import type { ConversionEngine } from "./types";
import { convertViaServer } from "@/lib/server-convert";

const excelEngine: ConversionEngine = {
  id: "excel",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      // Delegate to the server-side LibreOffice pipeline via Gotenberg
      // for accurate rendering of formulas, tables and formatting.
      return convertViaServer(file, "pdf");
    }

    throw new Error(`Unsupported Excel conversion to "${targetFormat}"`);
  },
};

export default excelEngine;

