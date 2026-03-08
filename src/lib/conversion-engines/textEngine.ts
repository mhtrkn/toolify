import type { ConversionEngine } from "./types";
import { convertViaServer } from "@/lib/server-convert";

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
      return convertViaServer(file, "pdf");
    }

    if (fmt === "docx") {
      return textToDocxBlob(file);
    }

    throw new Error(`Unsupported text conversion to "${targetFormat}"`);
  },
};

export default textEngine;
