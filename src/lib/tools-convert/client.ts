/**
 * Single entry point for all conversions. Calls API for backend tools,
 * runs client-side converters for pdf-to-image and image-to-pdf.
 */

import type { ConvertOptions, ConvertResult, ConvertResultOrError } from "./types";
import { resolveToolId, toolRequiresBackend } from "./registry";
import {
  imageToPdfBlob,
  pdfToImageBlobs,
} from "@/lib/global-converters";

const API_BASE = "/api/tools/convert";

/** Product-ready defaults */
const DEFAULT_QUALITY = 0.95;
const DEFAULT_PDF_IMAGE_SCALE = 2.5;

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** Trigger download of a blob with a filename */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Run conversion. Use resolveToolId(sourceExt, targetFormat) to get toolId,
 * or pass toolId explicitly (e.g. "word-to-pdf").
 * Returns single blob + filename, or multiple files (e.g. PDF pages).
 */
export async function convert(
  file: File,
  toolOrTargetFormat: string,
  options: ConvertOptions & { targetFormat?: string } = {}
): Promise<ConvertResultOrError> {
  const targetFormat = options.targetFormat ?? toolOrTargetFormat;
  const sourceExt = getExt(file.name);
  const toolId = resolveToolId(sourceExt, targetFormat);
  if (!toolId) {
    return { ok: false, error: "Unsupported conversion", code: "UNSUPPORTED" };
  }

  const quality = options.quality ?? DEFAULT_QUALITY;
  const scale = options.scale ?? DEFAULT_PDF_IMAGE_SCALE;
  const zipPages = options.zipPages !== false;
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  try {
    if (toolRequiresBackend(toolId)) {
      const form = new FormData();
      form.append("file", file);
      form.append("tool", toolId);
      if (toolId === "image" && targetFormat) {
        form.append("targetFormat", targetFormat);
        form.append("quality", String(quality));
      }

      const res = await fetch(API_BASE, { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = (body as { error?: string }).error ?? `Server error ${res.status}`;
        return { ok: false, error: msg, code: "API_ERROR" };
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let filename = `${baseName}.${targetFormat}`;
      if (disposition) {
        const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
        if (match) filename = decodeURIComponent(match[1].trim());
      }
      return { ok: true, blob, filename };
    }

    // ─── Client-side: pdf-to-image, image-to-pdf ─────────────────────────

    if (toolId === "image-to-pdf") {
      const blob = await imageToPdfBlob(file);
      return { ok: true, blob, filename: `${baseName}.pdf` };
    }

    if (toolId === "pdf-to-image") {
      const fmt = (targetFormat === "jpeg" ? "jpg" : targetFormat) as "jpg" | "png" | "webp";
      const pages = await pdfToImageBlobs(file, fmt, quality, scale);
      const files = pages.map((p) => ({ blob: p.blob, filename: p.filename }));

      if (zipPages && files.length > 0) {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (const f of files) {
          zip.file(f.filename, f.blob);
        }
        const zipBlob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        });
        return { ok: true, blob: zipBlob, filename: `${baseName}.zip` };
      }
      return { ok: true, files };
    }

    return { ok: false, error: "Conversion not implemented on client", code: "NOT_IMPLEMENTED" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg, code: "CONVERSION_FAILED" };
  }
}

/**
 * Convert and trigger download(s). Uses convert() then downloads blob or all files.
 */
export async function convertAndDownload(
  file: File,
  targetFormat: string,
  options: ConvertOptions = {}
): Promise<ConvertResultOrError> {
  const result = await convert(file, targetFormat, options);
  if (!result.ok) return result;

  if (result.blob && result.filename) {
    downloadBlob(result.blob, result.filename);
  } else if (result.files?.length) {
    for (const f of result.files) {
      downloadBlob(f.blob, f.filename);
    }
  }
  return result;
}
