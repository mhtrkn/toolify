/**
 * Central types for all convert tools — single source of truth.
 * Used by API route, GlobalUpload, and individual tool pages.
 */

export type ConvertToolId =
  | "image"
  | "image-to-pdf"
  | "word-to-pdf"
  | "excel-to-pdf"
  | "pdf-to-image"
  | "pdf-to-rtf"
  | "pdf-to-txt"
  | "images-to-pdf";

/** Tools that run on the backend (Next API route) */
export const BACKEND_TOOL_IDS: ConvertToolId[] = [
  "image",
  "word-to-pdf",
  "excel-to-pdf",
  "pdf-to-rtf",
  "pdf-to-txt",
];

export interface ConvertTool {
  id: ConvertToolId;
  label: string;
  description?: string;
  /** Input MIME or extension hints */
  inputFormats: string[];
  /** Output format(s) — e.g. ["pdf"], ["jpg","png","webp"] */
  outputFormats: string[];
  /** If true, conversion runs via POST /api/tools/convert */
  requiresBackend: boolean;
  /** Optional redirect URL when not supported (e.g. video→mp3) */
  redirectUrl?: string;
}

export interface ConvertOptions {
  /** Target format (e.g. "pdf", "jpg", "png") */
  targetFormat?: string;
  /** Quality 0–1 for images/PDF export. Default 0.95 for product-ready. */
  quality?: number;
  /** Scale for PDF→image (e.g. 2.5 for print). Default 2.5. */
  scale?: number;
  /** For pdf-to-image: pack all pages into one ZIP. Default true. */
  zipPages?: boolean;
}

export interface ConvertResult {
  ok: true;
  /** Single file (API returns one blob) */
  blob?: Blob;
  /** Multiple files (e.g. PDF pages); client may zip them */
  files?: { blob: Blob; filename: string }[];
  /** Suggested download filename when single blob */
  filename?: string;
}

export interface ConvertError {
  ok: false;
  error: string;
  code?: string;
}

export type ConvertResultOrError = ConvertResult | ConvertError;
