import type { ConversionEngine } from "./types";
import { convertViaServer } from "@/lib/server-convert";

const pptxEngine: ConversionEngine = {
  id: "powerpoint",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return convertViaServer(file, "pdf");
    }

    throw new Error(`Unsupported PowerPoint conversion to "${targetFormat}"`);
  },
};

export default pptxEngine;
