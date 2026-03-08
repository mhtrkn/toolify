/**
 * Registry of all convert tools — single place to manage conversions.
 * Add or remove tools here; API and client use this.
 */

import type { ConvertTool } from "./types";
import { BACKEND_TOOL_IDS } from "./types";

export const CONVERT_TOOLS: ConvertTool[] = [
  {
    id: "image",
    label: "Image format conversion",
    description: "Convert between JPG, PNG, WebP, GIF, TIFF, AVIF, HEIC, SVG",
    inputFormats: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff", "image/bmp", "image/heic", "image/heif", "image/avif", "image/svg+xml", ".jpg", ".png", ".webp", ".gif", ".heic", ".svg"],
    outputFormats: ["jpg", "jpeg", "png", "webp", "gif", "tiff", "avif", "heic", "svg"],
    requiresBackend: true,
  },
  {
    id: "image-to-pdf",
    label: "Image to PDF",
    description: "Single image to one-page PDF",
    inputFormats: ["image/", ".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormats: ["pdf"],
    requiresBackend: false,
  },
  {
    id: "images-to-pdf",
    label: "Images to PDF",
    description: "Multiple images merged into one PDF",
    inputFormats: ["image/", ".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormats: ["pdf"],
    requiresBackend: false,
  },
  {
    id: "word-to-pdf",
    label: "Word to PDF",
    description: "DOCX/DOC to PDF",
    inputFormats: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", ".docx", ".doc"],
    outputFormats: ["pdf"],
    requiresBackend: true,
  },
  {
    id: "excel-to-pdf",
    label: "Excel to PDF",
    description: "XLSX/XLS to PDF",
    inputFormats: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", ".xlsx", ".xls"],
    outputFormats: ["pdf"],
    requiresBackend: true,
  },
  {
    id: "pdf-to-image",
    label: "PDF to images",
    description: "Each page to JPG/PNG/WebP — product-ready (ZIP, high quality)",
    inputFormats: ["application/pdf", ".pdf"],
    outputFormats: ["jpg", "png", "webp"],
    requiresBackend: false,
  },
  {
    id: "pdf-to-rtf",
    label: "PDF to Word (RTF)",
    description: "Extract text to RTF for Word/LibreOffice",
    inputFormats: ["application/pdf", ".pdf"],
    outputFormats: ["rtf", "docx"],
    requiresBackend: true,
  },
  {
    id: "pdf-to-txt",
    label: "PDF to text",
    description: "Extract text to plain TXT",
    inputFormats: ["application/pdf", ".pdf"],
    outputFormats: ["txt"],
    requiresBackend: true,
  },
];

export function getToolById(id: string): ConvertTool | undefined {
  return CONVERT_TOOLS.find((t) => t.id === id);
}

export function toolRequiresBackend(id: string): boolean {
  return BACKEND_TOOL_IDS.includes(id as (typeof BACKEND_TOOL_IDS)[number]);
}

/** Resolve which tool ID to use for a given source extension and target format */
export function resolveToolId(
  sourceExt: string,
  targetFormat: string
): ConvertTool["id"] | null {
  const ext = sourceExt.toLowerCase();
  const fmt = targetFormat.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "heic", "svg", "avif"].includes(ext) && (fmt === "pdf" || ["jpg", "jpeg", "png", "webp", "gif", "tiff", "avif", "heic", "svg"].includes(fmt))) {
    if (fmt === "pdf") return "image-to-pdf";
    return "image";
  }
  if (["docx", "doc"].includes(ext) && fmt === "pdf") return "word-to-pdf";
  if (["xlsx", "xls"].includes(ext) && fmt === "pdf") return "excel-to-pdf";
  if (ext === "pdf") {
    if (["jpg", "jpeg", "png", "webp"].includes(fmt)) return "pdf-to-image";
    if (fmt === "docx" || fmt === "rtf") return "pdf-to-rtf";
    if (fmt === "txt") return "pdf-to-txt";
  }
  return null;
}
