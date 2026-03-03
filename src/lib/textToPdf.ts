export type PageSize = "a4" | "letter";
export type FontName = "helvetica" | "times" | "courier";
export type Theme = "light" | "dark";

export interface TextToPdfOptions {
  text: string;
  pageSize: PageSize;
  fontSize: number;
  /** Margin in mm applied to all four sides */
  margin: number;
  /** Line height multiplier, e.g. 1.0, 1.15, 1.5, 2.0 */
  lineSpacing: number;
  font: FontName;
  theme: Theme;
  headerText?: string;
  footerText?: string;
  pageNumbers?: boolean;
}

// Physical page dimensions in mm
const PAGE_DIMS: Record<PageSize, [number, number]> = {
  a4: [210, 297],
  letter: [216, 279],
};

// 1mm → px at 96 dpi
const MM_TO_PX = 3.7795275591;

// Render at 2× for crisp output on high-DPI screens / print
const RENDER_SCALE = 2;

// CSS font-family strings (all Unicode-capable system fonts)
const FONT_FAMILY: Record<FontName, string> = {
  helvetica: "Arial, Helvetica, sans-serif",
  times: '"Times New Roman", Georgia, serif',
  courier: '"Courier New", Courier, monospace',
};

// ── Text wrapping using canvas measureText ─────────────────────────────────
//
// We use the browser's own canvas to measure glyph widths so every character
// (including Turkish, CJK, etc.) is measured correctly.

function wrapLines(
  rawText: string,
  ctx: CanvasRenderingContext2D,
  maxWidthPx: number
): string[] {
  const result: string[] = [];

  for (const rawLine of rawText.split("\n")) {
    if (rawLine === "") {
      result.push("");
      continue;
    }

    const words = rawLine.split(" ");
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;

      if (ctx.measureText(candidate).width > maxWidthPx && current !== "") {
        result.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    // Flush last segment (may be a very long word — leave it, canvas clips nothing)
    if (current !== "") result.push(current);
  }

  return result;
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Renders text to a multi-page PDF using Canvas API + jsPDF.
 *
 * WHY canvas instead of jsPDF text primitives:
 *   jsPDF's built-in fonts (Helvetica / Times / Courier) only cover WinAnsi
 *   (Windows-1252). Characters outside that range — Turkish ğ ş ı İ, Arabic,
 *   CJK, etc. — are silently replaced with wrong glyphs.
 *   The browser's Canvas 2D uses the OS font stack, which renders every Unicode
 *   codepoint correctly. Each page is captured as a JPEG and embedded in the PDF.
 *
 * Trade-off: text in the PDF is image-based (not selectable). For a
 * "write → download" tool this is the correct behaviour.
 */
export async function generateTextPdf(options: TextToPdfOptions) {
  const { jsPDF } = await import("jspdf");

  const {
    text,
    pageSize,
    fontSize,
    margin,
    lineSpacing,
    font,
    theme,
    headerText,
    footerText,
    pageNumbers,
  } = options;

  const [pageW, pageH] = PAGE_DIMS[pageSize]; // mm

  // ── Pixel dimensions (logical, before RENDER_SCALE) ─────────────────────
  const pageWPx = Math.round(pageW * MM_TO_PX);
  const pageHPx = Math.round(pageH * MM_TO_PX);
  const marginPx = Math.round(margin * MM_TO_PX);

  // ── Font metrics ─────────────────────────────────────────────────────────
  const fontFamily = FONT_FAMILY[font];
  // Canvas ctx.font accepts CSS shorthand incl. pt units
  const bodyFontCss = `${fontSize}pt ${fontFamily}`;
  const metaFontSizePt = 8;
  const metaFontCss = `${metaFontSizePt}pt ${fontFamily}`;

  // Approximate meta line height in px (used for header/footer zone sizing)
  const metaLineHPx = metaFontSizePt * (96 / 72) * 1.6;

  const hasHeader = !!headerText?.trim();
  const hasFooter = !!(footerText?.trim() || pageNumbers);

  const headerZonePx = hasHeader ? metaLineHPx + 6 : 0;
  const footerZonePx = hasFooter ? metaLineHPx + 6 : 0;

  // Content area (where body text goes)
  const contentTopPx = marginPx + headerZonePx;
  const contentBottomPx = pageHPx - marginPx - footerZonePx;
  const contentHPx = contentBottomPx - contentTopPx;
  const contentWPx = pageWPx - marginPx * 2;

  // ── Colours ──────────────────────────────────────────────────────────────
  const isDark = theme === "dark";
  const bgColor = isDark ? "#1a1a21" : "#ffffff";
  const textColor = isDark ? "#dcdcdc" : "#1c1c1c";
  const metaColor = isDark ? "#777777" : "#999999";
  const ruleColor = isDark ? "#3a3a4a" : "#dddddd";

  // ── Measuring pass (invisible, width=1) ──────────────────────────────────
  const measCanvas = document.createElement("canvas");
  measCanvas.width = 1;
  measCanvas.height = 1;
  const measCtx = measCanvas.getContext("2d")!;
  measCtx.font = bodyFontCss;

  const wrappedLines = wrapLines(text, measCtx, contentWPx);

  // Body line height in px
  const lineHPx = fontSize * (96 / 72) * lineSpacing;
  const linesPerPage = Math.max(1, Math.floor(contentHPx / lineHPx));
  const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

  // ── Render canvas (reused across pages) ─────────────────────────────────
  const renderCanvas = document.createElement("canvas");
  renderCanvas.width = pageWPx * RENDER_SCALE;
  renderCanvas.height = pageHPx * RENDER_SCALE;
  const ctx = renderCanvas.getContext("2d")!;

  // Scale once so all draw calls use logical px coordinates
  ctx.scale(RENDER_SCALE, RENDER_SCALE);

  // ── Build PDF ────────────────────────────────────────────────────────────
  const pdf = new jsPDF({ unit: "mm", format: pageSize, orientation: "portrait" });

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // Clear background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pageWPx, pageHPx);

    // ── Body text ──────────────────────────────────────────────────────────
    ctx.font = bodyFontCss;
    ctx.fillStyle = textColor;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    const lineStart = page * linesPerPage;
    const lineEnd = Math.min(lineStart + linesPerPage, wrappedLines.length);

    for (let i = lineStart; i < lineEnd; i++) {
      const line = wrappedLines[i];
      if (line) {
        const y = contentTopPx + (i - lineStart) * lineHPx;
        ctx.fillText(line, marginPx, y);
      }
    }

    // ── Header ────────────────────────────────────────────────────────────
    if (hasHeader && headerText) {
      ctx.font = metaFontCss;
      ctx.fillStyle = metaColor;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      const hTextY = marginPx * 0.55;
      ctx.fillText(headerText.trim(), marginPx, hTextY);

      // Separator rule
      const ruleY = hTextY + metaLineHPx + 1;
      ctx.strokeStyle = ruleColor;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(marginPx, ruleY);
      ctx.lineTo(pageWPx - marginPx, ruleY);
      ctx.stroke();
    }

    // ── Footer ────────────────────────────────────────────────────────────
    if (hasFooter) {
      ctx.font = metaFontCss;
      ctx.fillStyle = metaColor;
      ctx.textBaseline = "bottom";

      const fy = pageHPx - marginPx * 0.5;

      if (footerText?.trim()) {
        ctx.textAlign = "left";
        ctx.fillText(footerText.trim(), marginPx, fy);
      }

      if (pageNumbers) {
        const label =
          totalPages > 1 ? `${page + 1} / ${totalPages}` : `${page + 1}`;
        ctx.textAlign = "right";
        ctx.fillText(label, pageWPx - marginPx, fy);
        ctx.textAlign = "left";
      }
    }

    // Embed page as JPEG
    const imgData = renderCanvas.toDataURL("image/jpeg", 0.93);
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
  }

  return pdf;
}
