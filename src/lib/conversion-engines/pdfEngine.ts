import type { ConversionEngine, ConversionResult } from "./types";
import { pdfToImageBlobs, pdfToTxtBlob } from "@/lib/global-converters";
import { convertViaServer } from "@/lib/server-convert";

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
      // Delegate to the server-side pipeline (pdf-parse + docx library) so that
      // Unicode / Turkish characters in the source PDF are extracted correctly.
      return convertViaServer(file, "docx");
    }

    throw new Error(`Unsupported PDF conversion to "${targetFormat}"`);
  },
};

export default pdfEngine;
