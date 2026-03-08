/**
 * Shared conversion helpers — Word/Excel to PDF, PDF to JPG/PNG/RTF/TXT, Image to PDF.
 * Used by GlobalUpload and by the central tools-convert client.
 */

// ─── Image → PDF (single image, one page) ─────────────────────────────────────

export function imageToPdfBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d")!.drawImage(img, 0, 0);
        const data = c.toDataURL("image/jpeg", 0.95);
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          orientation: w > h ? "landscape" : "portrait",
          unit: "px",
          format: [w, h],
        });
        pdf.addImage(data, "JPEG", 0, 0, w, h);
        resolve(pdf.output("blob") as Blob);
      } finally {
        URL.revokeObjectURL(src);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Failed to load image"));
    };
    img.src = src;
  });
}

// ─── Word → PDF (mammoth + jsPDF) ─────────────────────────────────────────────

export async function wordToPdfBlob(file: File): Promise<Blob> {
  const mod = (await import("mammoth")) as { default?: { convertToHtml: (opts: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> }; convertToHtml?: (opts: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> };
  const mammoth = mod.default ?? mod;
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml!({ arrayBuffer });

  const doc = new DOMParser().parseFromString(html, "text/html");
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const pW = pdf.internal.pageSize.getWidth();
  const pH = pdf.internal.pageSize.getHeight();
  const mX = 60;
  const mY = 60;
  const maxW = pW - mX * 2;
  let curY = mY;

  function ensureSpace(h: number) {
    if (curY + h > pH - mY) {
      pdf.addPage();
      curY = mY;
    }
  }

  function addText(str: string, fontSize: number, fontStyle: "normal" | "bold" | "italic", indent = 0) {
    if (!str.trim()) return;
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", fontStyle);
    const lh = fontSize * 1.4;
    const lines: string[] = pdf.splitTextToSize(str.trim(), maxW - indent);
    for (const line of lines) {
      ensureSpace(lh);
      pdf.text(line, mX + indent, curY);
      curY += lh;
    }
  }

  function processNode(node: Node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const content = el.textContent?.trim() ?? "";

    switch (tag) {
      case "h1":
        curY += 8;
        addText(content, 22, "bold");
        curY += 6;
        break;
      case "h2":
        curY += 6;
        addText(content, 17, "bold");
        curY += 4;
        break;
      case "h3":
        curY += 4;
        addText(content, 13, "bold");
        curY += 2;
        break;
      case "h4":
      case "h5":
      case "h6":
        curY += 2;
        addText(content, 11, "bold");
        curY += 2;
        break;
      case "p":
        if (content) {
          addText(content, 11, "normal");
          curY += 5;
        } else curY += 8;
        break;
      case "ul":
        for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
          addText(`\u2022 ${li.textContent?.trim() ?? ""}`, 11, "normal", 12);
          curY += 2;
        }
        curY += 4;
        break;
      case "ol":
        Array.from(el.querySelectorAll(":scope > li")).forEach((li, i) => {
          addText(`${i + 1}. ${li.textContent?.trim() ?? ""}`, 11, "normal", 12);
          curY += 2;
        });
        curY += 4;
        break;
      case "table": {
        const rows = Array.from(el.querySelectorAll("tr"));
        if (!rows.length) break;
        const colCount = Math.max(...rows.map((r) => r.querySelectorAll("td, th").length));
        if (!colCount) break;
        const colW = maxW / colCount;
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll("td, th"));
          const isHeader = cells.some((c) => c.tagName.toLowerCase() === "th");
          ensureSpace(18);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", isHeader ? "bold" : "normal");
          cells.forEach((cell, ci) => {
            const lines: string[] = pdf.splitTextToSize(cell.textContent?.trim() ?? "", colW - 8);
            pdf.text(lines[0] ?? "", mX + ci * colW + 4, curY);
          });
          curY += 18;
          if (isHeader) {
            pdf.setDrawColor(150, 150, 150);
            pdf.line(mX, curY - 12, mX + maxW, curY - 12);
          }
        }
        curY += 6;
        break;
      }
      case "br":
        curY += 8;
        break;
      case "hr":
        ensureSpace(12);
        pdf.setDrawColor(180, 180, 180);
        pdf.line(mX, curY, mX + maxW, curY);
        curY += 12;
        break;
      default:
        el.childNodes.forEach(processNode);
        break;
    }
  }

  doc.body.childNodes.forEach(processNode);
  return pdf.output("blob") as Blob;
}

// ─── Excel → PDF (xlsx + jsPDF) ────────────────────────────────────────────────

export async function excelToPdfBlob(file: File): Promise<Blob> {
  const XLSX = await import("xlsx");
  const { jsPDF } = await import("jspdf");

  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const usableWidth = pageWidth - margin * 2;
  let firstSheet = true;

  for (let si = 0; si < wb.SheetNames.length; si++) {
    const sheetName = wb.SheetNames[si];
    const ws = wb.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: "",
      raw: false,
    }) as string[][];
    if (data.length === 0) continue;
    if (!firstSheet) pdf.addPage();
    firstSheet = false;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 30, 30);
    pdf.text(sheetName, margin, margin + 10);
    const startY = margin + 28;
    const colCount = Math.max(...data.map((r) => r.length));
    if (colCount === 0) continue;
    const colWidth = Math.min(usableWidth / colCount, 120);
    const rowHeight = 18;
    const fontSize = 8;
    let y = startY;
    for (let ri = 0; ri < data.length; ri++) {
      const row = data[ri];
      if (y + rowHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin + 10;
      }
      if (ri === 0) {
        pdf.setFillColor(240, 240, 245);
        pdf.rect(margin, y, colWidth * colCount, rowHeight, "F");
      }
      for (let ci = 0; ci < colCount; ci++) {
        const x = margin + ci * colWidth;
        const cellVal = String(row[ci] ?? "");
        pdf.setDrawColor(200, 200, 210);
        pdf.setLineWidth(0.4);
        pdf.rect(x, y, colWidth, rowHeight, "S");
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", ri === 0 ? "bold" : "normal");
        pdf.setTextColor(ri === 0 ? 20 : 60, ri === 0 ? 20 : 60, ri === 0 ? 20 : 60);
        const maxChars = Math.floor(colWidth / (fontSize * 0.55));
        const truncated = cellVal.length > maxChars ? cellVal.slice(0, maxChars - 1) + "…" : cellVal;
        pdf.text(truncated, x + 3, y + rowHeight - 5);
      }
      y += rowHeight;
    }
  }

  return pdf.output("blob") as Blob;
}

// ─── PDF → Image (JPG/PNG) — one blob per page ───────────────────────────────

export interface PdfPageBlob {
  blob: Blob;
  filename: string;
}

/** Product-ready: scale 2.5 ≈ 180 DPI, quality 0.95, zero-padded filenames */
export async function pdfToImageBlobs(
  file: File,
  format: "jpg" | "png" | "webp",
  quality = 0.95,
  scale = 2.5
): Promise<PdfPageBlob[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const baseName = file.name.replace(/\.pdf$/i, "");
  const pad = String(numPages).length;
  const ext = format === "jpg" ? "jpg" : format === "png" ? "png" : "webp";
  const mime =
    format === "jpg"
      ? "image/jpeg"
      : format === "png"
        ? "image/png"
        : "image/webp";
  const out: PdfPageBlob[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await (page as unknown as { render: (opts: unknown) => { promise: Promise<void> } }).render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(
        res,
        mime,
        format === "jpg" || format === "webp" ? quality : undefined
      )
    );
    if (!blob) throw new Error("toBlob failed");
    out.push({
      blob,
      filename: `${baseName}-page-${String(i).padStart(pad, "0")}.${ext}`,
    });
  }
  return out;
}

// ─── PDF → RTF (for “Word” export) ────────────────────────────────────────────

interface TextFragment {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
}

function extractLinesFromPdf(items: unknown[]): string[] {
  const fragments: TextFragment[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (!("str" in item) || !("transform" in item) || !("width" in item)) continue;
    const str = (item as { str: string }).str;
    if (!str || !str.trim()) continue;
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

export async function pdfToRtfBlob(file: File): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const total = pdf.numPages;
  const pages: string[][] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = extractLinesFromPdf(content.items);
    const paragraphed = detectParagraphs(lines);
    pages.push(paragraphed);
  }

  const rtf = buildRtf(pages);
  return new Blob([rtf], { type: "application/rtf" });
}

// ─── PDF → plain text ────────────────────────────────────────────────────────

export async function pdfToTxtBlob(file: File): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const total = pdf.numPages;
  const parts: string[] = [];

  for (let i = 1; i <= total; i++) {
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
  return new Blob([fullText], { type: "text/plain;charset=utf-8" });
}
