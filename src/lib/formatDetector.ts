/**
 * Format detection utilities — safe to import on both client and server.
 * No Node.js-specific APIs are used here.
 */

export type ImageFormat =
  | "jpg"
  | "jpeg"
  | "png"
  | "webp"
  | "gif"
  | "bmp"
  | "tiff"
  | "heic"
  | "heif"
  | "avif"
  | "svg";

/** Every format we accept as input */
export const SUPPORTED_INPUT_FORMATS: readonly ImageFormat[] = [
  "jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "heic", "heif", "avif", "svg",
] as const;

/**
 * Output formats supported by the server (sharp / libvips).
 * BMP is excluded — sharp does not support BMP as an output format.
 */
export const SERVER_OUTPUT_FORMATS: readonly ImageFormat[] = [
  "jpg", "png", "webp", "gif", "tiff", "avif", "heic", "svg",
] as const;

/**
 * Output formats the browser Canvas API can produce (client-side fallback).
 * GIF/TIFF/AVIF/HEIC are not available via canvas.toBlob().
 */
export const CANVAS_OUTPUT_FORMATS: readonly ImageFormat[] = [
  "jpg", "png", "webp", "svg",
] as const;

export const FORMAT_DISPLAY: Record<ImageFormat, string> = {
  jpg:  "JPG",
  jpeg: "JPEG",
  png:  "PNG",
  webp: "WebP",
  gif:  "GIF",
  bmp:  "BMP",
  tiff: "TIFF",
  heic: "HEIC",
  heif: "HEIF",
  avif: "AVIF",
  svg:  "SVG",
};

export const FORMAT_MIME: Record<ImageFormat, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
  bmp:  "image/bmp",
  tiff: "image/tiff",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
  svg:  "image/svg+xml",
};

const MIME_TO_FORMAT: Record<string, ImageFormat> = {
  "image/jpeg":    "jpg",
  "image/jpg":     "jpg",
  "image/png":     "png",
  "image/webp":    "webp",
  "image/gif":     "gif",
  "image/bmp":     "bmp",
  "image/x-bmp":   "bmp",
  "image/x-ms-bmp":"bmp",
  "image/tiff":    "tiff",
  "image/x-tiff":  "tiff",
  "image/heic":    "heic",
  "image/heif":    "heif",
  "image/avif":    "avif",
  "image/svg+xml": "svg",
};

const EXT_TO_FORMAT: Record<string, ImageFormat> = {
  jpg:  "jpg",
  jpeg: "jpg",
  png:  "png",
  webp: "webp",
  gif:  "gif",
  bmp:  "bmp",
  tiff: "tiff",
  tif:  "tiff",
  heic: "heic",
  heif: "heif",
  avif: "avif",
  svg:  "svg",
};

export function detectFormatFromMime(mime: string): ImageFormat | null {
  if (!mime) return null;
  // Strip parameters like "image/jpeg; charset=utf-8"
  const base = mime.toLowerCase().split(";")[0].trim();
  return MIME_TO_FORMAT[base] ?? null;
}

export function detectFormatFromExtension(filename: string): ImageFormat | null {
  if (!filename) return null;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_FORMAT[ext] ?? null;
}

/** Detect format from a File-like object: prefer MIME type, fall back to extension. */
export function detectFileFormat(file: { name: string; type: string }): ImageFormat | null {
  return detectFormatFromMime(file.type) ?? detectFormatFromExtension(file.name);
}

export function getMimeType(format: ImageFormat): string {
  return FORMAT_MIME[format] ?? "application/octet-stream";
}

export function getFormatDisplay(format: ImageFormat): string {
  return FORMAT_DISPLAY[format] ?? format.toUpperCase();
}

/** True for HEIC and HEIF formats */
export function isHeicFormat(format: ImageFormat): boolean {
  return format === "heic" || format === "heif";
}

/** True for SVG format */
export function isSvgFormat(format: ImageFormat): boolean {
  return format === "svg";
}

/** Normalise aliases: jpeg → jpg, heif → heic */
export function normalizeFormat(format: ImageFormat): ImageFormat {
  if (format === "jpeg") return "jpg";
  if (format === "heif") return "heic";
  return format;
}

/** File extension to use for the output filename */
export function getOutputExtension(format: ImageFormat): string {
  if (format === "jpeg" || format === "jpg") return "jpg";
  if (format === "heif") return "heic";
  if (format === "tiff") return "tiff";
  if (format === "svg") return "svg";
  return format;
}

/** Sensible default output format for a given input */
export function getDefaultOutputFormat(input: ImageFormat): ImageFormat {
  if (isHeicFormat(input)) return "jpg";
  if (input === "svg") return "png";
  if (input === "jpg" || input === "jpeg") return "png";
  if (input === "png") return "jpg";
  return "jpg";
}

export function isInputSupported(format: ImageFormat): boolean {
  return (SUPPORTED_INPUT_FORMATS as readonly string[]).includes(format);
}

export function isOutputSupported(format: ImageFormat): boolean {
  return (SERVER_OUTPUT_FORMATS as readonly string[]).includes(format);
}
