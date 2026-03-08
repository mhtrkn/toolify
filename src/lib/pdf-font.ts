/**
 * Loads DejaVu Sans (full Unicode, including Turkish) from jsDelivr CDN and
 * registers it with a jsPDF instance.
 *
 * The TTF bytes are fetched once and cached for the lifetime of the page so
 * subsequent conversions are instant.
 *
 * Usage:
 *   const { jsPDF } = await import("jspdf");
 *   const pdf = new jsPDF({ ... });
 *   await registerUnicodeFont(pdf);
 *   pdf.setFont("DejaVuSans", "normal");
 */

// jsDelivr serves the DejaVu Fonts npm package — reliable CDN, no CORS issues.
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf";

const FONT_VFS_NAME = "DejaVuSans.ttf";
const FONT_FAMILY = "DejaVuSans";

let _fontBase64Cache: string | null = null;

async function fetchFontAsBase64(): Promise<string> {
  if (_fontBase64Cache) return _fontBase64Cache;

  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`Failed to load Unicode font (${res.status})`);

  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Convert to base64 in safe 8 KB chunks to avoid call-stack overflow on
  // large fonts (fromCharCode with a spread on a 750 KB array would crash).
  let binary = "";
  const CHUNK = 8_192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }

  _fontBase64Cache = btoa(binary);
  return _fontBase64Cache;
}

/** Register DejaVu Sans into `pdf` and set it as the active font. */
export async function registerUnicodeFont(
  pdf: { addFileToVFS: (name: string, data: string) => void; addFont: (fn: string, family: string, style: string) => void; setFont: (family: string, style: string) => void },
): Promise<void> {
  const base64 = await fetchFontAsBase64();
  pdf.addFileToVFS(FONT_VFS_NAME, base64);
  pdf.addFont(FONT_VFS_NAME, FONT_FAMILY, "normal");
  pdf.setFont(FONT_FAMILY, "normal");
}

export { FONT_FAMILY };
