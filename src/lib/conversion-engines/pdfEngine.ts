import type { ConversionEngine } from "./types";
import { pdfToImageBlobs, pdfToTxtBlob } from "@/lib/global-converters";
import { convertViaServer } from "@/lib/server-convert";

async function pdfToSingleImageBlob(
  file: File,
  format: "jpg" | "png",
): Promise<Blob> {
  const pages = await pdfToImageBlobs(file, format, 0.95, 2.5);
  if (!pages.length) {
    throw new Error("PDF has no pages");
  }
  // Return only the first page as a single image.
  return pages[0].blob;
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
      // Delegate to the server-side pipeline (pdf-parse + docx library) so that
      // Unicode / Turkish characters in the source PDF are extracted correctly.
      return convertViaServer(file, "docx");
    }

    throw new Error(`Unsupported PDF conversion to "${targetFormat}"`);
  },
};

export default pdfEngine;
