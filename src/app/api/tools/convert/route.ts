/**
 * Central convert API — all backend conversions in one place.
 * POST multipart: file, tool, [targetFormat], [quality]
 * tool: image | word-to-pdf | excel-to-pdf | pdf-to-rtf | pdf-to-txt
 */

import { NextRequest, NextResponse } from "next/server";
import { convertImage } from "@/lib/converter";
import {
  detectFormatFromExtension,
  detectFormatFromMime,
  getMimeType,
  getOutputExtension,
  isInputSupported,
  isOutputSupported,
  type ImageFormat,
} from "@/lib/formatDetector";
import { wordToPdfBuffer } from "@/lib/tools-convert/server/word-to-pdf";
import { excelToPdfBuffer } from "@/lib/tools-convert/server/excel-to-pdf";
import { pdfToRtfBuffer, pdfToTxtBuffer } from "@/lib/tools-convert/server/pdf-to-text";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

const TOOLS = ["image", "word-to-pdf", "excel-to-pdf", "pdf-to-rtf", "pdf-to-txt"] as const;
type ToolId = (typeof TOOLS)[number];

function json(body: object, status: number) {
  return NextResponse.json(body, { status });
}

function getOutputFilename(inputName: string, tool: ToolId, targetFormat?: string): string {
  const base = inputName.replace(/\.[^/.]+$/, "");
  switch (tool) {
    case "image":
      return `${base}.${targetFormat === "jpeg" ? "jpg" : targetFormat ?? "png"}`;
    case "word-to-pdf":
    case "excel-to-pdf":
      return `${base}.pdf`;
    case "pdf-to-rtf":
      return `${base}.rtf`;
    case "pdf-to-txt":
      return `${base}.txt`;
    default:
      return inputName;
  }
}

function getContentType(tool: ToolId, targetFormat?: string): string {
  switch (tool) {
    case "image":
      return getMimeType((targetFormat ?? "png") as ImageFormat);
    case "word-to-pdf":
    case "excel-to-pdf":
      return "application/pdf";
    case "pdf-to-rtf":
      return "application/rtf";
    case "pdf-to-txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return json({ error: "Could not parse multipart/form-data." }, 400);
    }

    const fileEntry = formData.get("file");
    const toolEntry = formData.get("tool");
    const targetFormatEntry = formData.get("targetFormat");
    const qualityEntry = formData.get("quality");

    if (!(fileEntry instanceof File)) {
      return json({ error: "Field 'file' is required." }, 400);
    }
    if (typeof toolEntry !== "string" || !TOOLS.includes(toolEntry as ToolId)) {
      return json({ error: "Field 'tool' is required and must be one of: " + TOOLS.join(", ") }, 400);
    }

    const tool = toolEntry as ToolId;
    const targetFormat = typeof targetFormatEntry === "string" ? targetFormatEntry.toLowerCase().trim() : undefined;
    const quality = qualityEntry != null ? Math.min(1, Math.max(0, Number(qualityEntry))) : 0.95;

    if (fileEntry.size === 0) return json({ error: "File is empty." }, 400);
    if (fileEntry.size > MAX_BYTES) return json({ error: "File exceeds 50 MB." }, 413);

    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let outputBuffer: Buffer;

    switch (tool) {
      case "image": {
        const fmt = (targetFormat ?? "png") as ImageFormat;
        if (!targetFormat || !isOutputSupported(fmt)) {
          return json({ error: "For tool 'image', valid targetFormat is required (e.g. jpg, png, webp)." }, 400);
        }
        const inputFormat =
          detectFormatFromMime(fileEntry.type) ?? detectFormatFromExtension(fileEntry.name);
        if (!inputFormat || !isInputSupported(inputFormat)) {
          return json({ error: "Unsupported input image format." }, 415);
        }
        if (inputFormat === "svg" && fmt === "svg") {
          return json({ error: "Input and output formats are the same." }, 400);
        }
        try {
          outputBuffer = await convertImage(buffer, fmt, { quality: Math.round(quality * 100) });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ error: `Image conversion failed: ${msg}` }, 500);
        }
        break;
      }

      case "word-to-pdf": {
        try {
          outputBuffer = await wordToPdfBuffer(buffer);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ error: `Word to PDF failed: ${msg}` }, 500);
        }
        break;
      }

      case "excel-to-pdf": {
        try {
          outputBuffer = await excelToPdfBuffer(arrayBuffer);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ error: `Excel to PDF failed: ${msg}` }, 500);
        }
        break;
      }

      case "pdf-to-rtf": {
        try {
          outputBuffer = await pdfToRtfBuffer(buffer);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ error: `PDF to RTF failed: ${msg}` }, 500);
        }
        break;
      }

      case "pdf-to-txt": {
        try {
          outputBuffer = await pdfToTxtBuffer(buffer);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ error: `PDF to text failed: ${msg}` }, 500);
        }
        break;
      }

      default:
        return json({ error: "Unknown tool." }, 400);
    }

    const filename = getOutputFilename(fileEntry.name, tool, targetFormat);
    const contentType = getContentType(tool, targetFormat);

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(outputBuffer.byteLength),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/tools/convert]", err);
    return json({ error: "Internal server error." }, 500);
  }
}
