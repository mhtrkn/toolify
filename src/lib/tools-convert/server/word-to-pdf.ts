/**
 * Server-side Word (DOCX/DOC) → PDF. Uses mammoth + linkedom + jsPDF.
 * Only import from API route (Node).
 * In Node, mammoth expects { buffer } (Node Buffer), not { arrayBuffer }.
 */

import { parseHTML } from "linkedom";

export async function wordToPdfBuffer(input: ArrayBuffer | Buffer): Promise<Buffer> {
  const mammoth = (await import("mammoth")).default;
  const { jsPDF } = await import("jspdf");

  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const { value: html } = await mammoth.convertToHtml({ buffer });
  // linkedom does NOT put fragment content into body (unlike browser DOMParser).
  // Wrap in full document so document.body contains the content.
  const wrappedHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
  const { document } = parseHTML(wrappedHtml);
  const doc = document;

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
  const out = pdf.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(out);
}
