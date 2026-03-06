/**
 * Server-side image conversion via sharp + libvips.
 *
 * ⚠️  This module must NOT be imported on the client — it requires Node.js
 *     native binaries that are unavailable in the browser.
 *     Only import from API Route Handlers or Server Components.
 */

import sharp from "sharp";
import type { ImageFormat } from "./formatDetector";

export interface ConversionOptions {
  /** Output quality 1–100. Defaults to 88. */
  quality?: number;
  /** Use lossless compression for WebP / AVIF / HEIC. Defaults to false. */
  lossless?: boolean;
}

/** Map our format names to sharp's internal identifiers */
const FORMAT_TO_SHARP: Record<string, string> = {
  jpg:  "jpeg",
  jpeg: "jpeg",
  png:  "png",
  webp: "webp",
  gif:  "gif",
  tiff: "tiff",
  heic: "heif",   // sharp uses 'heif' for both HEIC and HEIF
  heif: "heif",
  avif: "avif",
};

/**
 * Convert an image buffer to the specified target format.
 *
 * @param input        Raw image bytes (Buffer or ArrayBuffer)
 * @param targetFormat Target format key from ImageFormat
 * @param options      Optional quality / lossless flags
 * @returns            Converted image as a Node.js Buffer
 * @throws             Error when the format is unsupported or conversion fails
 */
export async function convertImage(
  input: Buffer | ArrayBuffer,
  targetFormat: ImageFormat,
  options: ConversionOptions = {}
): Promise<Buffer> {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

  // ── Raster → SVG: embed as base64 data URI inside an SVG wrapper ──────
  if (targetFormat === "svg") {
    return rasterToSvg(buffer);
  }

  const sharpFormat = FORMAT_TO_SHARP[targetFormat];

  if (!sharpFormat) {
    throw new Error(`Output format "${targetFormat}" is not supported.`);
  }

  const { quality = 88, lossless = false } = options;

  const instance = sharp(buffer, {
    // Allow very large images (panoramas, camera RAW outputs)
    limitInputPixels: false,
    // Preserve animation only when the output is GIF
    animated: targetFormat === "gif",
    // Fail fast on truncated / corrupt files instead of producing garbage
    failOn: "truncated",
  });

  switch (sharpFormat) {
    case "jpeg":
      return instance.jpeg({ quality, mozjpeg: false }).toBuffer();

    case "png":
      return instance.png({ compressionLevel: 6, palette: false }).toBuffer();

    case "webp":
      return instance.webp({ quality, lossless }).toBuffer();

    case "gif":
      return instance.gif().toBuffer();

    case "tiff":
      return instance.tiff({ quality }).toBuffer();

    case "heif":
      return instance
        .heif({ quality, compression: "hevc", lossless })
        .toBuffer();

    case "avif":
      return instance.avif({ quality, lossless }).toBuffer();

    default:
      return instance
        .toFormat(sharpFormat as keyof sharp.FormatEnum)
        .toBuffer();
  }
}

/**
 * Convert a raster image to SVG by embedding it as a base64 data URI.
 * The resulting SVG preserves the original dimensions and pixel data.
 */
async function rasterToSvg(buffer: Buffer): Promise<Buffer> {
  const meta = await sharp(buffer, { limitInputPixels: false }).metadata();
  const width = meta.width ?? 800;
  const height = meta.height ?? 600;

  // Convert to PNG first for consistent embedding (lossless)
  const pngBuffer = await sharp(buffer, { limitInputPixels: false })
    .png()
    .toBuffer();
  const b64 = pngBuffer.toString("base64");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" href="data:image/png;base64,${b64}"/>
</svg>`;

  return Buffer.from(svg, "utf-8");
}

/** Return lightweight image metadata without decoding pixel data. */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer, { limitInputPixels: false }).metadata();
}
