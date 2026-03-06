import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
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

// ─── sips fallback (macOS only) ─────────────────────────────────────────────
// macOS ships `sips` which uses Apple VideoToolbox — it handles HEVC-encoded
// HEIC files that libheif pre-built binaries don't support.
const SIPS_FORMAT: Partial<Record<ImageFormat, string>> = {
  jpg: "jpeg", jpeg: "jpeg", png: "png", gif: "gif", tiff: "tiff",
};

async function convertWithSips(buffer: Buffer, targetFormat: ImageFormat): Promise<Buffer> {
  const sipsFormat = SIPS_FORMAT[targetFormat];
  if (!sipsFormat) throw new Error(`sips does not support output format: ${targetFormat}`);

  const id  = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const ext = getOutputExtension(targetFormat);
  const tmpIn  = join(tmpdir(), `sips_in_${id}.heic`);
  const tmpOut = join(tmpdir(), `sips_out_${id}.${ext}`);

  await writeFile(tmpIn, buffer);
  try {
    await new Promise<void>((resolve, reject) =>
      execFile("sips", ["-s", "format", sipsFormat, tmpIn, "--out", tmpOut], (err, _out, stderr) =>
        err ? reject(new Error(stderr || err.message)) : resolve()
      )
    );
    return readFile(tmpOut);
  } finally {
    await Promise.allSettled([unlink(tmpIn), unlink(tmpOut)]);
  }
}

// Must run on the Node.js runtime — sharp requires native binaries.
// The Edge runtime does NOT support Node.js native modules.
export const runtime = "nodejs";

// Allow up to 60 s for large-file conversions.
// On Vercel Hobby the cap is 10 s; on Pro / Enterprise it can be raised.
export const maxDuration = 60;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB hard limit

// ─── Helpers ────────────────────────────────────────────────────────────────

function json(body: object, status: number) {
  return NextResponse.json(body, { status });
}

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Parse multipart body ────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return json({ error: "Could not parse multipart/form-data payload." }, 400);
    }

    const fileEntry    = formData.get("file");
    const formatEntry  = formData.get("targetFormat");

    if (!(fileEntry instanceof File)) {
      return json({ error: "Field 'file' is required." }, 400);
    }
    if (typeof formatEntry !== "string" || !formatEntry.trim()) {
      return json({ error: "Field 'targetFormat' is required." }, 400);
    }

    const targetFormat = formatEntry.toLowerCase().trim() as ImageFormat;

    // ── Validate file ───────────────────────────────────────────────────────
    if (fileEntry.size === 0) {
      return json({ error: "The uploaded file is empty." }, 400);
    }
    if (fileEntry.size > MAX_BYTES) {
      return json({ error: "File exceeds the 50 MB size limit." }, 413);
    }

    // ── Detect input format ─────────────────────────────────────────────────
    // Browsers often report HEIC as "application/octet-stream" so we fall
    // back to the file extension when the MIME type is ambiguous.
    const inputFormat =
      detectFormatFromMime(fileEntry.type) ??
      detectFormatFromExtension(fileEntry.name);

    if (!inputFormat || !isInputSupported(inputFormat)) {
      return json(
        { error: `Unsupported input format: "${fileEntry.type || fileEntry.name}".` },
        415
      );
    }

    // ── Validate output format ──────────────────────────────────────────────
    if (!isOutputSupported(targetFormat)) {
      return json(
        { error: `Unsupported output format: "${targetFormat}".` },
        400
      );
    }

    // ── Block SVG → SVG (no-op) ──────────────────────────────────────────
    if (inputFormat === "svg" && targetFormat === "svg") {
      return json({ error: "Input and output formats are the same." }, 400);
    }

    // ── Read into buffer ────────────────────────────────────────────────────
    let inputBuffer: Buffer;
    try {
      inputBuffer = Buffer.from(await fileEntry.arrayBuffer());
    } catch {
      return json({ error: "Failed to read the uploaded file." }, 400);
    }

    // ── Convert ─────────────────────────────────────────────────────────────
    let outputBuffer: Buffer;
    try {
      outputBuffer = await convertImage(inputBuffer, targetFormat);
    } catch (sharpErr) {
      const sharpMsg = sharpErr instanceof Error ? sharpErr.message : String(sharpErr);
      console.warn("[api/convert] sharp failed, trying sips fallback:", sharpMsg);

      // sips is macOS-only and only helps when sharp lacks HEVC HEIC support.
      const canSips = process.platform === "darwin" && SIPS_FORMAT[targetFormat] !== undefined;
      if (!canSips) {
        console.error("[api/convert] no fallback available:", sharpMsg);
        return json({ error: `Conversion failed: ${sharpMsg}` }, 500);
      }

      try {
        outputBuffer = await convertWithSips(inputBuffer, targetFormat);
        console.log("[api/convert] sips fallback succeeded");
      } catch (sipsErr) {
        const sipsMsg = sipsErr instanceof Error ? sipsErr.message : String(sipsErr);
        console.error("[api/convert] sips fallback also failed:", sipsMsg);
        return json({ error: `Conversion failed: ${sharpMsg}` }, 500);
      }
    }

    // ── Build response ──────────────────────────────────────────────────────
    const ext      = getOutputExtension(targetFormat);
    const baseName = fileEntry.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}.${ext}`;
    const mime     = getMimeType(targetFormat);

    // Wrap as Uint8Array — Buffer<ArrayBufferLike> is not assignable to BodyInit
    // in strict TypeScript, but Uint8Array (ArrayBufferView) is.
    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type":        mime,
        "Content-Length":      String(outputBuffer.byteLength),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control":       "no-store",
        // Expose sizes so the client can display before/after
        "X-Original-Size":     String(fileEntry.size),
        "X-Converted-Size":    String(outputBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("[api/convert] Unexpected error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}
