import type { ConversionEngine } from "./types";
import { excelToPdfBlob } from "@/lib/global-converters";

const excelEngine: ConversionEngine = {
  id: "excel",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return excelToPdfBlob(file);
    }

    throw new Error(`Unsupported Excel conversion to "${targetFormat}"`);
  },
};

export default excelEngine;

