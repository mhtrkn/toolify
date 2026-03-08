/**
 * Gotenberg HTTP client — shared helper for all server-side conversions.
 *
 * Gotenberg wraps LibreOffice headless and exposes a simple REST API.
 * Deploy URL is read from the GOTENBERG_URL environment variable.
 *
 * Supported via /forms/libreoffice/convert/office:
 *   DOCX, DOC, PPTX, PPT, XLSX, XLS, ODP, ODT, ODS, TXT → PDF
 */

const GOTENBERG_URL =
  process.env.GOTENBERG_URL ?? "https://gotenberg-w9m0.onrender.com";

/**
 * Convert any LibreOffice-supported file to PDF via Gotenberg.
 *
 * @param buffer   Raw file bytes
 * @param filename Original filename (extension used for format detection)
 * @returns        PDF as Buffer
 */
export async function convertToPdfWithGotenberg(
  buffer: Buffer,
  filename: string,
): Promise<Buffer> {
  const form = new FormData();
  form.append(
    "files",
    new Blob([new Uint8Array(buffer)]),
    filename,
  );

  const res = await fetch(
    `${GOTENBERG_URL}/forms/libreoffice/convert`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`Gotenberg conversion failed (${res.status}): ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
