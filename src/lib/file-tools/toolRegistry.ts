import type { FileCategory } from "./fileTypeDetector";

export type ExecutionMode = "local" | "redirect";

export interface CategoryToolConfig {
  formats: string[];
  execution: ExecutionMode;
}

export const TOOL_REGISTRY: Record<FileCategory, CategoryToolConfig> = {
  image: {
    formats: ["jpg", "png", "webp", "pdf", "svg"],
    execution: "local",
  },
  pdf: {
    formats: ["jpg", "png", "docx", "txt"],
    execution: "local",
  },
  video: {
    formats: ["mp3"],
    execution: "redirect",
  },
  word: {
    formats: ["pdf"],
    execution: "local",
  },
  excel: {
    formats: ["pdf"],
    execution: "local",
  },
  powerpoint: {
    formats: ["pdf"],
    execution: "local",
  },
  text: {
    formats: ["pdf", "docx"],
    execution: "local",
  },
  unknown: {
    formats: [],
    execution: "redirect",
  },
};

export function getCategoryConfig(category: FileCategory): CategoryToolConfig {
  return TOOL_REGISTRY[category] ?? TOOL_REGISTRY.unknown;
}

