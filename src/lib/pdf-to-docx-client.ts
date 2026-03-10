/**
 * Client-side PDF → DOCX converter.
 * Uses pdfjs-dist (browser) for text extraction and docx (npm) for DOCX generation.
 * 100% client-side — no server upload needed.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface TextFragment {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontName: string;
}

interface LineData {
  text: string;
  y: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
}

interface PageLines {
  lines: LineData[];
}

// ─── Text Extraction ─────────────────────────────────────────────────────────

function extractFragments(items: unknown[]): TextFragment[] {
  const fragments: TextFragment[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (!("str" in item) || !("transform" in item) || !("width" in item))
      continue;
    const str = (item as { str: string }).str;
    if (!str || !str.trim()) continue;
    const transform = (item as { transform: number[] }).transform;
    const width = (item as { width: number }).width;
    const fontName =
      "fontName" in item ? String((item as { fontName: string }).fontName) : "";
    const fontSize = Math.abs(transform[3]) || Math.abs(transform[0]) || 12;
    fragments.push({
      str,
      x: transform[4],
      y: transform[5],
      width,
      fontSize,
      fontName,
    });
  }
  return fragments;
}

function groupIntoLines(fragments: TextFragment[]): LineData[] {
  if (fragments.length === 0) return [];

  // Sort by Y descending (top→bottom), then X ascending (left→right)
  fragments.sort((a, b) => b.y - a.y || a.x - b.x);

  const rawLines: TextFragment[][] = [];
  let currentLine: TextFragment[] = [fragments[0]];

  for (let i = 1; i < fragments.length; i++) {
    const prev = currentLine[0];
    const curr = fragments[i];
    const threshold = Math.max(prev.fontSize, curr.fontSize) * 0.4;
    if (Math.abs(prev.y - curr.y) <= threshold) {
      currentLine.push(curr);
    } else {
      rawLines.push(currentLine);
      currentLine = [curr];
    }
  }
  rawLines.push(currentLine);

  return rawLines.map((line) => {
    line.sort((a, b) => a.x - b.x);

    // Build text with smart spacing
    let text = "";
    for (let i = 0; i < line.length; i++) {
      if (i === 0) {
        text = line[i].str;
        continue;
      }
      const prev = line[i - 1];
      const gap = line[i].x - (prev.x + prev.width);
      const spaceWidth = prev.fontSize * 0.3;
      if (gap > spaceWidth * 3) {
        text += "\t" + line[i].str;
      } else if (gap > spaceWidth * 0.3) {
        text += " " + line[i].str;
      } else {
        text += line[i].str;
      }
    }

    // Dominant font properties
    const avgFontSize =
      line.reduce((s, f) => s + f.fontSize, 0) / line.length;
    const avgY = line.reduce((s, f) => s + f.y, 0) / line.length;
    const fontNames = line.map((f) => f.fontName.toLowerCase());
    const isBold = fontNames.some((n) => n.includes("bold"));
    const isItalic = fontNames.some(
      (n) => n.includes("italic") || n.includes("oblique"),
    );

    return { text, y: avgY, fontSize: avgFontSize, isBold, isItalic };
  });
}

// ─── Analysis ────────────────────────────────────────────────────────────────

function findBodyFontSize(pages: PageLines[]): number {
  const sizeCounts = new Map<number, number>();
  for (const page of pages) {
    for (const line of page.lines) {
      const rounded = Math.round(line.fontSize * 2) / 2;
      sizeCounts.set(rounded, (sizeCounts.get(rounded) ?? 0) + 1);
    }
  }
  let maxCount = 0;
  let bodySize = 12;
  for (const [size, count] of sizeCounts) {
    if (count > maxCount) {
      maxCount = count;
      bodySize = size;
    }
  }
  return bodySize;
}

function getHeadingLevel(
  fontSize: number,
  bodyFontSize: number,
): 1 | 2 | 3 | null {
  if (bodyFontSize <= 0) return null;
  const ratio = fontSize / bodyFontSize;
  if (ratio >= 1.8) return 1;
  if (ratio >= 1.4) return 2;
  if (ratio >= 1.15) return 3;
  return null;
}

// ─── DOCX Generation ─────────────────────────────────────────────────────────

interface ParagraphBlock {
  text: string;
  headingLevel: 1 | 2 | 3 | null;
  isBold: boolean;
  isItalic: boolean;
}

function buildParagraphBlocks(
  lines: LineData[],
  bodyFontSize: number,
): ParagraphBlock[] {
  if (lines.length === 0) return [];

  // Compute typical line gap for paragraph detection
  const gaps: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const gap = Math.abs(lines[i - 1].y - lines[i].y);
    if (gap > 0 && gap < bodyFontSize * 5) gaps.push(gap);
  }
  gaps.sort((a, b) => a - b);
  const typicalGap =
    gaps.length > 0 ? gaps[Math.floor(gaps.length / 2)] : bodyFontSize * 1.2;

  const blocks: ParagraphBlock[] = [];
  let accLines: LineData[] = [lines[0]];

  const flush = () => {
    if (accLines.length === 0) return;
    const firstLine = accLines[0];
    const hl = getHeadingLevel(firstLine.fontSize, bodyFontSize);
    const combinedText = accLines.map((l) => l.text).join(" ");
    blocks.push({
      text: combinedText,
      headingLevel: hl,
      isBold: accLines.some((l) => l.isBold) || hl !== null,
      isItalic: accLines.some((l) => l.isItalic),
    });
    accLines = [];
  };

  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    const curr = lines[i];
    const gap = Math.abs(prev.y - curr.y);

    const prevHL = getHeadingLevel(prev.fontSize, bodyFontSize);
    const currHL = getHeadingLevel(curr.fontSize, bodyFontSize);
    const isHeadingChange = prevHL !== currHL;
    const isLargeGap = gaps.length > 0 && gap > typicalGap * 1.5;
    const isSentenceEnd =
      /[.!?:;。]$/.test(prev.text.trim()) &&
      /^[A-ZÀ-ÖÜŞĞİÇ0-9•\-–—"]/.test(curr.text.trim());

    if (isHeadingChange || isLargeGap || isSentenceEnd) {
      flush();
    }
    accLines.push(curr);
  }
  flush();

  return blocks;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function convertPdfToDocx(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ blob: Blob; pageCount: number }> {
  // 1. Load PDF
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  onProgress?.(5);

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;
  const total = pdf.numPages;

  onProgress?.(10);

  // 2. Extract text from all pages
  const pages: PageLines[] = [];
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const fragments = extractFragments(content.items);
    const lines = groupIntoLines(fragments);
    pages.push({ lines });
    onProgress?.(10 + Math.round((i / total) * 50));
  }

  onProgress?.(65);

  // 3. Analyze body font size
  const bodyFontSize = findBodyFontSize(pages);

  // 4. Build DOCX
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import(
    "docx"
  );

  const HEADING_MAP = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  } as const;

  const allChildren: InstanceType<typeof Paragraph>[] = [];

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageData = pages[pageIdx];
    const blocks = buildParagraphBlocks(pageData.lines, bodyFontSize);

    if (blocks.length === 0 && pageIdx === 0) {
      allChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "(no extractable text found on this page)",
              font: "Calibri",
              size: 22,
              color: "999999",
            }),
          ],
        }),
      );
    }

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];

      const textRun = new TextRun({
        text: block.text,
        bold: block.isBold,
        italics: block.isItalic,
        font: "Calibri",
        size: block.headingLevel ? undefined : 22,
      });

      // Build options — heading & pageBreakBefore are read-only so must be set inline
      const isPageStart = pageIdx > 0 && bi === 0;

      allChildren.push(
        new Paragraph({
          children: [textRun],
          spacing: { after: block.headingLevel ? 120 : 200 },
          heading: block.headingLevel
            ? HEADING_MAP[block.headingLevel]
            : undefined,
          pageBreakBefore: isPageStart || undefined,
        }),
      );
    }

    onProgress?.(65 + Math.round(((pageIdx + 1) / pages.length) * 25));
  }

  if (allChildren.length === 0) {
    allChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "(no extractable text found)",
            font: "Calibri",
            size: 22,
          }),
        ],
      }),
    );
  }

  const doc = new Document({
    sections: [{ children: allChildren }],
  });

  onProgress?.(95);

  const blob = await Packer.toBlob(doc);

  onProgress?.(100);

  return { blob, pageCount: total };
}
