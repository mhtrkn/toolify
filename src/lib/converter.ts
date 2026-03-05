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

/** Return lightweight image metadata without decoding pixel data. */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer, { limitInputPixels: false }).metadata();
}
