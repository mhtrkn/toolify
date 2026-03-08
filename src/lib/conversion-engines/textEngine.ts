import type { ConversionEngine } from "./types";
import { registerUnicodeFont } from "@/lib/pdf-font";

async function textToPdfBlob(file: File): Promise<Blob> {
  const text = await file.text();
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  // Register a full-Unicode font so Turkish (ç ş ü ı ö ğ) and other
  // non-Latin characters render correctly instead of showing "?" glyphs.
  await registerUnicodeFont(pdf);
  pdf.setFontSize(11);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 60;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 14;

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
  const text = await file.text();
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
