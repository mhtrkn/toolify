import { NextRequest, NextResponse } from "next/server";
import { convertToPdfWithGotenberg } from "@/lib/gotenberg";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 50 * 1024 * 1024;

function json(body: object, status: number) {
  return NextResponse.json(body, { status });
}

// ─── PDF → DOCX via pdfjs-dist (text extraction) + docx ─────────────────────

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
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

// ─── Handler ─────────────────────────────────────────────────────────────────

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

  // ── Office → PDF (DOCX, DOC, PPTX, PPT, XLSX, XLS) via Gotenberg ──────────
  const OFFICE_TO_PDF_EXTS = ["docx", "doc", "pptx", "ppt", "xlsx", "xls", "odp", "odt", "ods", "txt"];
  if (fmt === "pdf" && OFFICE_TO_PDF_EXTS.includes(inputExt)) {
    try {
      const pdfBuffer = await convertToPdfWithGotenberg(buffer, fileEntry.name);
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
      console.error("[api/convert-doc] Office→PDF failed:", msg);
      return json({ error: msg }, 500);
    }
  }

  // ── PDF → DOCX ────────────────────────────────────────────────────────────
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
        "Supported: Office formats → PDF, PDF → DOCX.",
    },
    400,
  );
}
