import type { ConversionEngine } from "./types";
import { convertViaServer } from "@/lib/server-convert";

const wordEngine: ConversionEngine = {
  id: "word",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      // Delegate to the server-side LibreOffice pipeline so that Turkish
      // characters, tables, page breaks and fonts are all preserved correctly.
      return convertViaServer(file, "pdf");
    }

    throw new Error(`Unsupported Word conversion to "${targetFormat}"`);
  },
};

export default wordEngine;
