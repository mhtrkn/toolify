import type { ConversionEngine, ConversionResult } from "./types";
import { pdfToImageBlobs, pdfToTxtBlob } from "@/lib/global-converters";
import { generateDocxBlob } from "@/lib/docx-generator";

/**
 * Convert PDF pages to images.
 * - 1 page  → single Blob
 * - N pages → ConversionFile[] so GlobalUpload downloads each page separately
 */
async function pdfToImageResult(
  file: File,
  format: "jpg" | "png",
): Promise<ConversionResult> {
  const pages = await pdfToImageBlobs(file, format, 0.95, 3.0);
  if (!pages.length) throw new Error("PDF has no pages");
  if (pages.length === 1) return pages[0].blob;
  return pages; // array of { blob, filename }
}

const pdfEngine: ConversionEngine = {
  id: "pdf",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "jpg" || fmt === "jpeg") {
      return pdfToImageResult(file, "jpg");
    }

    if (fmt === "png") {
      return pdfToImageResult(file, "png");
    }

    if (fmt === "txt") {
      return pdfToTxtBlob(file);
    }

    if (fmt === "docx") {
      // Extract text client-side with pdfjs, then wrap in a DOCX blob.
      // Avoids server-side timeouts on Vercel Hobby (10s limit).
      const txtBlob = await pdfToTxtBlob(file);
      const text = await txtBlob.text();
      return generateDocxBlob(text);
    }

    throw new Error(`Unsupported PDF conversion to "${targetFormat}"`);
  },
};

export default pdfEngine;
