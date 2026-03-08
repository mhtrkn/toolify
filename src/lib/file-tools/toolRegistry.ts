import type { FileCategory } from "./fileTypeDetector";

export type ExecutionMode = "local" | "redirect";

export interface CategoryToolConfig {
  formats: string[];
  execution: ExecutionMode;
}

export const TOOL_REGISTRY: Record<FileCategory, CategoryToolConfig> = {
  image: {
    formats: ["jpg", "png", "webp", "pdf"],
    execution: "local",
  },
  pdf: {
    formats: ["jpg", "png", "docx", "txt"],
    execution: "redirect",
  },
  video: {
    formats: ["mp3"],
    execution: "redirect",
  },
  word: {
    formats: ["pdf"],
    execution: "redirect",
  },
  excel: {
    formats: ["pdf"],
    execution: "redirect",
  },
  text: {
    formats: ["pdf", "docx"],
    execution: "redirect",
  },
  unknown: {
    formats: [],
    execution: "redirect",
  },
};

export const TOOL_URLS: Record<string, string> = {
  "pdf→jpg": "/tools/pdf-tools/pdf-to-jpg",
  "pdf→png": "/tools/pdf-tools/pdf-to-jpg",
  "pdf→docx": "/tools/pdf-tools/pdf-to-word",
  "pdf→txt": "/tools/ocr-tools/pdf-to-text",
  "video→mp3": "/tools/video-tools/video-to-mp3",
  "doc→pdf": "/tools/file-converter/word-to-pdf",
  "docx→pdf": "/tools/file-converter/word-to-pdf",
  "xls→pdf": "/tools/file-converter/excel-to-pdf",
  "xlsx→pdf": "/tools/file-converter/excel-to-pdf",
};

export function getCategoryConfig(category: FileCategory): CategoryToolConfig {
  return TOOL_REGISTRY[category] ?? TOOL_REGISTRY.unknown;
}

export function getRedirectUrl(
  sourceExtension: string,
  category: FileCategory,
  targetFormat: string,
): string | undefined {
  const ext = sourceExtension.toLowerCase();
  const fmt = targetFormat.toLowerCase();

  const byExtensionKey = `${ext}→${fmt}`;
  if (byExtensionKey in TOOL_URLS) {
    return TOOL_URLS[byExtensionKey];
  }

  const byCategoryKey = `${category}→${fmt}`;
  if (byCategoryKey in TOOL_URLS) {
    return TOOL_URLS[byCategoryKey];
  }

  return undefined;
}

