import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 50 * 1024 * 1024;
const execFileAsync = promisify(execFile);

function json(body: object, status: number) {
  return NextResponse.json(body, { status });
}

// ─── LibreOffice discovery ─────────────────────────────────────────────────

const LO_CANDIDATES = [
  "/opt/homebrew/bin/soffice",                              // macOS Homebrew (Apple Silicon)
  "/usr/local/bin/soffice",                                 // macOS Homebrew (Intel) / Linux manual
  "/Applications/LibreOffice.app/Contents/MacOS/soffice",  // macOS .dmg install
  "/usr/bin/soffice",                                       // Linux (apt)
  "soffice",                                                // PATH fallback
  "libreoffice",                                            // PATH alias fallback
];

let _loPath: string | null | undefined = undefined; // undefined = not yet resolved

async function findLibreOffice(): Promise<string | null> {
  if (_loPath !== undefined) return _loPath;

  for (const candidate of LO_CANDIDATES) {
    try {
      await execFileAsync(candidate, ["--version"], { timeout: 5000 });
      _loPath = candidate;
      return _loPath;
    } catch {
      // not available at this path
    }
  }

  _loPath = null;
  return null;
}

// ─── DOCX / DOC → PDF via LibreOffice headless ───────────────────────────

async function docxToPdfWithLibreOffice(
  buffer: Buffer,
  originalName: string,
): Promise<Buffer> {
  const loPath = await findLibreOffice();
  if (!loPath) {
    throw new Error(
      "LibreOffice is not installed on this server. " +
        "Please install it (e.g. `apt-get install libreoffice`) and restart.",
    );
  }

  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const tmpDir = join(tmpdir(), `lo_convert_${id}`);
  await mkdir(tmpDir, { recursive: true });

  const safeExt = originalName.toLowerCase().endsWith(".doc") ? ".doc" : ".docx";
  const inFile = join(tmpDir, `input${safeExt}`);

  await writeFile(inFile, buffer);

  try {
    await execFileAsync(
      loPath,
      ["--headless", "--convert-to", "pdf", "--outdir", tmpDir, inFile],
      { timeout: 30_000 },
    );

    const pdfBuffer = await readFile(join(tmpDir, "input.pdf"));
    return pdfBuffer;
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─── PDF → DOCX via pdfjs-dist (text extraction) + docx ─────────────────
// Using pdfjs-dist instead of pdf-parse to avoid Turbopack bundling issues.
// getTextContent() does not require canvas — safe for Node.js API routes.

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  // Disable the browser Worker in a Node.js context — pdfjs falls back to
  // an inline synchronous worker which works fine for text extraction.
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  const pdf = await pdfjsLib
    .getDocument({ data: new Uint8Array(buffer), useSystemFonts: true })
    .promise;

  const pageParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) pageParts.push(text);
  }

  return pageParts.join("\n\n");
}

async function pdfToDocxBuffer(buffer: Buffer): Promise<Buffer> {
  const rawText = await extractPdfText(buffer);

  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const blocks = rawText
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const paragraphs = blocks.map(
    (block) =>
      new Paragraph({
        children: [new TextRun({ text: block, font: "Calibri", size: 22 })],
        spacing: { after: 160 },
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: paragraphs.length
          ? paragraphs
          : [new Paragraph("(no extractable text found)")],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// ─── Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: "Could not parse multipart/form-data payload." }, 400);
  }

  const fileEntry = formData.get("file");
  const formatEntry = formData.get("targetFormat");

  if (!(fileEntry instanceof File))
    return json({ error: "Field 'file' is required." }, 400);
  if (typeof formatEntry !== "string" || !formatEntry.trim())
    return json({ error: "Field 'targetFormat' is required." }, 400);
  if (fileEntry.size === 0)
    return json({ error: "The uploaded file is empty." }, 400);
  if (fileEntry.size > MAX_BYTES)
    return json({ error: "File exceeds the 50 MB size limit." }, 413);

  const fmt = formatEntry.toLowerCase().trim();
  const buffer = Buffer.from(await fileEntry.arrayBuffer());
  const baseName = fileEntry.name.replace(/\.[^/.]+$/, "");
  const inputExt = fileEntry.name.split(".").pop()?.toLowerCase() ?? "";

  // ── DOCX / DOC → PDF ──────────────────────────────────────────────────
  if (fmt === "pdf" && (inputExt === "docx" || inputExt === "doc")) {
    try {
      const pdfBuffer = await docxToPdfWithLibreOffice(buffer, fileEntry.name);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[api/convert-doc] DOCX→PDF failed:", msg);
      return json({ error: msg }, 500);
    }
  }

  // ── PDF → DOCX ───────────────────────────────────────────────────────
  if (fmt === "docx" && inputExt === "pdf") {
    try {
      const docxBuffer = await pdfToDocxBuffer(buffer);
      return new NextResponse(new Uint8Array(docxBuffer), {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.docx"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[api/convert-doc] PDF→DOCX failed:", msg);
      return json({ error: msg }, 500);
    }
  }

  return json(
    {
      error:
        `Unsupported conversion: ${inputExt} → ${fmt}. ` +
        "This endpoint handles DOCX/DOC→PDF and PDF→DOCX only.",
    },
    400,
  );
}
