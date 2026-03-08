import {
  detectCategoryFromNameAndType,
  type FileCategory,
} from "./fileTypeDetector";
import type { ConversionEngine } from "@/lib/conversion-engines/types";
import imageEngine from "@/lib/conversion-engines/imageEngine";
import pdfEngine from "@/lib/conversion-engines/pdfEngine";
import videoEngine from "@/lib/conversion-engines/videoEngine";
import wordEngine from "@/lib/conversion-engines/wordEngine";
import excelEngine from "@/lib/conversion-engines/excelEngine";
import pptxEngine from "@/lib/conversion-engines/pptxEngine";
import textEngine from "@/lib/conversion-engines/textEngine";

interface EngineSelectionResult {
  category: FileCategory;
  engine: ConversionEngine | null;
}

function getEngineForCategory(
  category: FileCategory,
): ConversionEngine | null {
  switch (category) {
    case "image":
      return imageEngine;
    case "pdf":
      return pdfEngine;
    case "video":
      return videoEngine;
    case "word":
      return wordEngine;
    case "excel":
      return excelEngine;
    case "powerpoint":
      return pptxEngine;
    case "text":
      return textEngine;
    default:
      return null;
  }
}

/**
 * Conversion router: select the appropriate engine for a given file name + type.
 * No redirects — this only returns the engine to run in-place.
 */
export function selectConversionEngine(
  sourceName: string,
  sourceMimeType: string,
): EngineSelectionResult {
  const category = detectCategoryFromNameAndType(sourceName, sourceMimeType);
  const engine = getEngineForCategory(category);
  return { category, engine };
}

