/**
 * OCR Text Post-Processing
 *
 * Multi-stage pipeline that transforms raw Tesseract output into clean,
 * readable, well-structured text.
 *
 * Pipeline order:
 * 1. Unicode normalization  — fancy quotes, zero-width chars, dashes
 * 2. Dehyphenation          — "word-\nbreak" → "wordbreak"
 * 3. Orphan removal         — noise-only lines stripped
 * 4. Whitespace cleanup     — multiple spaces, tabs, trailing spaces
 * 5. Punctuation fixes      — space before period, missing space after comma
 * 6. Paragraph reconstruction — merge OCR visual line breaks into real paragraphs
 * 7. Blank line collapse    — 3+ blanks → 2
 * 8. Final trim
 */

export function cleanOcrText(raw: string): string {
  if (!raw.trim()) return raw;

  let text = raw;

  // 1. Unicode normalization
  text = normalizeUnicode(text);

  // 2. Dehyphenation: rejoin words split by line-ending hyphens
  //    "compli-\ncated" → "complicated"
  text = text.replace(/-\n(\S)/g, "$1");

  // 3. Remove orphan lines: lines with only punctuation / stray symbols
  text = text
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return true;
      return /[\p{L}\p{N}]/u.test(trimmed);
    })
    .join("\n");

  // 4. Whitespace cleanup
  text = text
    .split("\n")
    .map((line) => {
      let l = line;
      // Collapse multiple spaces → single
      l = l.replace(/ {2,}/g, " ");
      // Remove tabs (OCR artifact)
      l = l.replace(/\t+/g, " ");
      // Trim trailing whitespace
      return l.trimEnd();
    })
    .join("\n");

  // 5. Punctuation fixes
  text = fixPunctuation(text);

  // 6. Paragraph reconstruction: merge visual line breaks into logical paragraphs
  text = reconstructParagraphs(text);

  // 7. Collapse 3+ consecutive blank lines → exactly 2
  text = text.replace(/\n{3,}/g, "\n\n");

  // 8. Final trim
  return text.trim();
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalize Unicode oddities that OCR engines often produce.
 */
function normalizeUnicode(text: string): string {
  return (
    text
      // Fancy single quotes → standard apostrophe
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      // Fancy double quotes → standard
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      // Various dashes → standard hyphen/em-dash
      .replace(/[\u2010\u2011\u2012\u2013]/g, "-")
      .replace(/[\u2014\u2015]/g, " — ")
      // Ellipsis character → three dots
      .replace(/\u2026/g, "...")
      // Zero-width characters (ZWSP, ZWNJ, ZWJ, BOM)
      .replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, "")
      // Non-breaking space → regular space
      .replace(/\u00A0/g, " ")
  );
}

/**
 * Fix common OCR punctuation artifacts.
 */
function fixPunctuation(text: string): string {
  return (
    text
      // Remove space before sentence-ending punctuation: "word ." → "word."
      .replace(/ +([.!?,;:)}\]])/g, "$1")
      // Ensure space after sentence-ending punctuation when followed by a letter
      //   "word.Next" → "word. Next"  (but not "3.14" or "e.g." or "U.S.A.")
      .replace(/([.!?])([A-Z\u00C0-\u024F])/g, "$1 $2")
      // Ensure space after comma when followed by a letter: "a,b" → "a, b"
      .replace(/,([A-Za-z\u00C0-\u024F])/g, ", $1")
      // Remove space after opening bracket: "( word" → "(word"
      .replace(/([(\[{])\s+/g, "$1")
  );
}

/**
 * Merge lines that were visually wrapped in the original document into
 * logical paragraphs.
 *
 * Strategy (conservative — avoids breaking intentional formatting):
 * - Compute average line length from non-empty lines
 * - A line is merged with the next line ONLY when:
 *   (a) it does NOT end with terminal punctuation (. ! ? :)
 *   (b) its length ≥ 55% of average (i.e. it was wrapped, not a short heading)
 *   (c) the next line is not blank
 *   (d) the next line is not a list/heading marker
 *
 * Lines that end WITH terminal punctuation, or are noticeably shorter than
 * average, are treated as paragraph/heading boundaries.
 */
function reconstructParagraphs(text: string): string {
  const lines = text.split("\n");
  if (lines.length <= 1) return text;

  // Average length of non-empty lines (used as reference for "full-width" lines)
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return text;
  const avgLen =
    nonEmpty.reduce((s, l) => s + l.trim().length, 0) / nonEmpty.length;

  // If average line length is very short (< 25 chars), don't merge — likely
  // a table, list, or short-form content where line breaks are intentional
  if (avgLen < 25) return text;

  const result: string[] = [];
  let buffer = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Blank lines always act as paragraph separators
    if (line.length === 0) {
      if (buffer) {
        result.push(buffer);
        buffer = "";
      }
      result.push("");
      continue;
    }

    // Accumulate line into current paragraph buffer
    buffer = buffer ? buffer + " " + line : line;

    // Decide: should we break the paragraph after this line?
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
    const shouldBreak =
      // Next line is blank or doesn't exist
      nextLine.length === 0 ||
      // This line ends with terminal punctuation
      /[.!?:]\s*$/.test(line) ||
      // This line is short relative to average → likely end of paragraph or heading
      line.length < avgLen * 0.55 ||
      // Next line starts with a list marker (bullet or numbered)
      /^(\d+[.)\-]|[-•*▪▸►●○◆◇→])\s/.test(nextLine) ||
      // Next line looks like a heading: starts uppercase + current line is noticeably short
      (line.length < avgLen * 0.7 &&
        /^[A-Z\u00C0-\u024F\u0400-\u04FF]/.test(nextLine));

    if (shouldBreak) {
      result.push(buffer);
      buffer = "";
    }
  }

  if (buffer) result.push(buffer);

  return result.join("\n");
}
