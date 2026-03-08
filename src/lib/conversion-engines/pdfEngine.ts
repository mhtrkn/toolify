import type { ConversionEngine } from "./types";
import {
  pdfToImageBlobs,
  pdfToTxtBlob,
} from "@/lib/global-converters";

async function pdfToSingleImageBlob(
  file: File,
  format: "jpg" | "png",
): Promise<Blob> {
  const pages = await pdfToImageBlobs(file, format, 0.95, 2.5);
  if (!pages.length) {
    throw new Error("PDF has no pages");
  }
  // For now, only return the first page as a single image.
  return pages[0].blob;
}

async function pdfToDocxBlob(file: File): Promise<Blob> {
  const txtBlob = await pdfToTxtBlob(file);
  const text = await txtBlob.text();

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

  // Packer.toBlob is available in browser builds and returns a Blob directly.
  const blob = await Packer.toBlob(doc);
  return blob;
}

const pdfEngine: ConversionEngine = {
  id: "pdf",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "jpg" || fmt === "jpeg") {
      return pdfToSingleImageBlob(file, "jpg");
    }

    if (fmt === "png") {
      return pdfToSingleImageBlob(file, "png");
    }

    if (fmt === "txt") {
      return pdfToTxtBlob(file);
    }

    if (fmt === "docx") {
      return pdfToDocxBlob(file);
    }

    throw new Error(`Unsupported PDF conversion to "${targetFormat}"`);
  },
};

export default pdfEngine;

