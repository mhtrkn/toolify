import type { ConversionEngine } from "./types";

async function textFileToString(file: File): Promise<string> {
  return file.text();
}

async function textToPdfBlob(file: File): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const text = await textFileToString(file);

  const pdf = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 60;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 14;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const lines = pdf.splitTextToSize(text, maxWidth) as string[];

  let y = margin;
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (const line of lines) {
    if (y + lineHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += lineHeight;
  }

  return pdf.output("blob") as Blob;
}

async function textToDocxBlob(file: File): Promise<Blob> {
  const text = await textFileToString(file);
  const docxMod = await import("docx");
  const { Document, Packer, Paragraph } = docxMod;

  const paragraphs = text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => new Paragraph(chunk));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length ? paragraphs : [new Paragraph(text)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

const textEngine: ConversionEngine = {
  id: "text",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return textToPdfBlob(file);
    }

    if (fmt === "docx") {
      return textToDocxBlob(file);
    }

    throw new Error(`Unsupported text conversion to "${targetFormat}"`);
  },
};

export default textEngine;

