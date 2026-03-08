/**
 * Server-side PDF → text or RTF. Uses pdfjs-dist legacy build (Node).
 * Only import from API route (Node).
 */

interface TextFragment {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
}

function extractLines(items: unknown[]): string[] {
  const fragments: TextFragment[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (!("str" in item) || !("transform" in item) || !("width" in item)) continue;
    const str = (item as { str: string }).str;
    if (!str?.trim()) continue;
    const transform = (item as { transform: number[] }).transform;
    const width = (item as { width: number }).width;
    const fontSize = Math.abs(transform[3]) || Math.abs(transform[0]) || 12;
    fragments.push({ str, x: transform[4], y: transform[5], width, fontSize });
  }
  if (fragments.length === 0) return [];
  fragments.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: TextFragment[][] = [];
  let currentLine: TextFragment[] = [fragments[0]];
  for (let i = 1; i < fragments.length; i++) {
    const prev = currentLine[0];
    const curr = fragments[i];
    const threshold = Math.max(prev.fontSize, curr.fontSize) * 0.4;
    if (Math.abs(prev.y - curr.y) <= threshold) {
      currentLine.push(curr);
    } else {
      lines.push(currentLine);
      currentLine = [curr];
    }
  }
  lines.push(currentLine);
  return lines.map((line) => {
    line.sort((a, b) => a.x - b.x);
    let text = "";
    for (let i = 0; i < line.length; i++) {
      if (i === 0) {
        text = line[i].str;
        continue;
      }
      const prev = line[i - 1];
      const gap = line[i].x - (prev.x + prev.width);
      const spaceWidth = prev.fontSize * 0.3;
      if (gap > spaceWidth * 3) text += "\t" + line[i].str;
      else if (gap > spaceWidth * 0.3) text += " " + line[i].str;
      else text += line[i].str;
    }
    return text;
  });
}

function detectParagraphs(lines: string[]): string[] {
  if (lines.length <= 1) return lines;
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);
    if (i < lines.length - 1) {
      const curr = lines[i].trim();
      const next = lines[i + 1].trim();
      const endsWithPunctuation = /[.!?:。]$/.test(curr);
      const nextStartsUpper = /^[A-ZÀ-ÖÜŞĞİÇ0-9•\-–—]/.test(next);
      if (endsWithPunctuation && nextStartsUpper) result.push("");
    }
  }
  return result;
}

function escapeRtf(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\t/g, "\\tab ")
    .replace(/[^\x00-\x7F]/g, (ch) => `\\u${ch.charCodeAt(0)}?`);
}

function buildRtf(pages: string[][]): string {
  const header =
    "{\\rtf1\\ansi\\deff0\n" +
    "{\\fonttbl{\\f0 Arial;}}\n" +
    "{\\colortbl;\\red0\\green0\\blue0;}\n" +
    "\\f0\\fs24\\cf1\n";
  const body = pages
    .map((lines, pageIdx) => {
      const content = lines
        .map((l) => (l.trim().length === 0 ? "\\par\n" : escapeRtf(l) + "\\par\n"))
        .join("");
      return pageIdx < pages.length - 1 ? content + "\\page\n" : content;
    })
    .join("");
  return header + body + "}";
}

export async function pdfToTxtBuffer(buffer: Buffer): Promise<Buffer> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const numPages = pdf.numPages;
  const parts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    parts.push(text || "(no text on this page)");
  }

  const fullText = parts.join("\n\n");
  return Buffer.from(fullText, "utf-8");
}

export async function pdfToRtfBuffer(buffer: Buffer): Promise<Buffer> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const numPages = pdf.numPages;
  const pages: string[][] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = extractLines(content.items);
    const paragraphed = detectParagraphs(lines);
    pages.push(paragraphed);
  }

  const rtf = buildRtf(pages);
  return Buffer.from(rtf, "utf-8");
}
