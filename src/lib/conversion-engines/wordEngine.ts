import type { ConversionEngine } from "./types";
import { wordToPdfBlob } from "@/lib/global-converters";

const wordEngine: ConversionEngine = {
  id: "word",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return wordToPdfBlob(file);
    }

    throw new Error(`Unsupported Word conversion to "${targetFormat}"`);
  },
};

export default wordEngine;

