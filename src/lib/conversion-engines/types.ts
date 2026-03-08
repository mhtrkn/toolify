import type { FileCategory } from "../file-tools/fileTypeDetector";

export type EngineId = Exclude<FileCategory, "unknown">;

/** A named file result used when a conversion produces multiple output files. */
export interface ConversionFile {
  blob: Blob;
  filename: string;
}

/** Single blob or multiple named files (e.g. multi-page PDF→images). */
export type ConversionResult = Blob | ConversionFile[];

export interface ConversionEngine {
  id: EngineId;
  /**
   * Convert the given file into the requested target format.
   * Returns a single Blob, or an array of named files for multi-output conversions.
   */
  convert(file: File, targetFormat: string): Promise<ConversionResult>;
}

