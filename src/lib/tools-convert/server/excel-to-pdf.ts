/**
 * Server-side Excel (XLSX/XLS) → PDF. Uses xlsx + jsPDF.
 * Only import from API route (Node).
 */

export async function excelToPdfBuffer(arrayBuffer: ArrayBuffer): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const { jsPDF } = await import("jspdf");

  const wb = XLSX.read(arrayBuffer, { type: "array" });
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

  const out = pdf.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(out);
}
