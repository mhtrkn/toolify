import type { FileCategory } from "../file-tools/fileTypeDetector";

export type EngineId = Exclude<FileCategory, "unknown">;

export interface ConversionEngine {
  id: EngineId;
  /**
   * Convert the given file into the requested target format.
   * The target format should be a lowercase extension (e.g. "pdf", "jpg").
   */
  convert(file: File, targetFormat: string): Promise<Blob>;
}

