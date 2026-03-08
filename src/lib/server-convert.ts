/**
 * Client-side helper that uploads a file to /api/convert-doc and returns
 * the converted result as a Blob.
 *
 * Used by wordEngine (DOCX → PDF) and pdfEngine (PDF → DOCX) to delegate
 * complex conversions to the Node.js server where LibreOffice is available.
 */
export async function convertViaServer(
  file: File,
  targetFormat: string,
): Promise<Blob> {
  const body = new FormData();
  body.append("file", file);
  body.append("targetFormat", targetFormat);

  const res = await fetch("/api/convert-doc", { method: "POST", body });

  if (!res.ok) {
    let message = `Server error ${res.status}`;
    try {
      const payload = (await res.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  return res.blob();
}
