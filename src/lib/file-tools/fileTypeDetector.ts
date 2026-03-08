export type FileCategory =
  | "image"
  | "pdf"
  | "video"
  | "word"
  | "excel"
  | "text"
  | "unknown";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "bmp",
  "tiff",
  "avif",
  "heic",
  "heif",
]);

const PDF_EXTENSIONS = new Set(["pdf"]);

const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "avi", "mkv", "webm"]);

const WORD_EXTENSIONS = new Set(["doc", "docx"]);

const EXCEL_EXTENSIONS = new Set(["xls", "xlsx"]);

const TEXT_EXTENSIONS = new Set(["txt"]);

export function getFileExtension(input: File | string): string {
  const name = typeof input === "string" ? input : input.name;
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts.pop()!.toLowerCase();
}

function detectCategoryByExtension(ext: string): FileCategory {
  const normalized = ext.toLowerCase();
  if (IMAGE_EXTENSIONS.has(normalized)) return "image";
  if (PDF_EXTENSIONS.has(normalized)) return "pdf";
  if (VIDEO_EXTENSIONS.has(normalized)) return "video";
  if (WORD_EXTENSIONS.has(normalized)) return "word";
  if (EXCEL_EXTENSIONS.has(normalized)) return "excel";
  if (TEXT_EXTENSIONS.has(normalized)) return "text";
  return "unknown";
}

function detectCategoryByMime(mime: string): FileCategory {
  const type = mime.toLowerCase();
  if (!type) return "unknown";

  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "pdf";
  if (type.startsWith("video/")) return "video";

  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "word";
  }

  if (
    type === "application/vnd.ms-excel" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "excel";
  }

  if (type.startsWith("text/")) return "text";

  return "unknown";
}

export function detectFileCategory(file: File): FileCategory {
  const mimeCategory = detectCategoryByMime(file.type);
  if (mimeCategory !== "unknown") return mimeCategory;
  const ext = getFileExtension(file);
  return detectCategoryByExtension(ext);
}

export function detectCategoryFromNameAndType(
  name: string,
  mimeType: string,
): FileCategory {
  const ext = getFileExtension(name);
  const byExt = detectCategoryByExtension(ext);
  if (byExt !== "unknown") return byExt;
  return detectCategoryByMime(mimeType);
}

export function isSupportedFile(file: File): boolean {
  return detectFileCategory(file) !== "unknown";
}

export const FILE_TYPE_CONSTANTS = {
  IMAGE_EXTENSIONS,
  PDF_EXTENSIONS,
  VIDEO_EXTENSIONS,
  WORD_EXTENSIONS,
  EXCEL_EXTENSIONS,
  TEXT_EXTENSIONS,
} as const;

