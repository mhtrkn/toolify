"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";
import Button from "@/components/ui/button";

type Status = "idle" | "ready" | "processing" | "done" | "error";

interface PdfResult {
  originalName: string;
  pdfUrl: string;
}

async function convertFileToPdf(file: File, onProgress: (p: number) => void): Promise<string> {
  // Step 1: DOCX → HTML via mammoth (no DOM needed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = (await import("mammoth")) as any;
  const mammoth = mod.default ?? mod;
  onProgress(20);

  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  onProgress(40);

  // Step 2: Parse HTML in memory via DOMParser.
  // DOMParser produces a detached document — it is never attached to the main DOM,
  // never rendered, and has zero visual side effects on the page.
  const doc = new DOMParser().parseFromString(html, "text/html");
  onProgress(55);

  // Step 3: Build PDF with jsPDF using text/vector rendering (no canvas, no DOM mutation)
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const pW = pdf.internal.pageSize.getWidth();
  const pH = pdf.internal.pageSize.getHeight();
  const mX = 60;
  const mY = 60;
  const maxW = pW - mX * 2;
  let curY = mY;

  function ensureSpace(h: number) {
    if (curY + h > pH - mY) { pdf.addPage(); curY = mY; }
  }

  function addText(str: string, fontSize: number, fontStyle: "normal" | "bold" | "italic", indent = 0) {
    if (!str.trim()) return;
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", fontStyle);
    const lh = fontSize * 1.4;
    const lines: string[] = pdf.splitTextToSize(str.trim(), maxW - indent);
    for (const line of lines) {
      ensureSpace(lh);
      pdf.text(line, mX + indent, curY);
      curY += lh;
    }
  }

  function processNode(node: Node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const content = el.textContent?.trim() ?? "";

    switch (tag) {
      case "h1": curY += 8; addText(content, 22, "bold"); curY += 6; break;
      case "h2": curY += 6; addText(content, 17, "bold"); curY += 4; break;
      case "h3": curY += 4; addText(content, 13, "bold"); curY += 2; break;
      case "h4":
      case "h5":
      case "h6": curY += 2; addText(content, 11, "bold"); curY += 2; break;
      case "p":
        if (content) { addText(content, 11, "normal"); curY += 5; }
        else curY += 8;
        break;
      case "ul":
        for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
          addText(`\u2022 ${li.textContent?.trim() ?? ""}`, 11, "normal", 12);
          curY += 2;
        }
        curY += 4;
        break;
      case "ol":
        Array.from(el.querySelectorAll(":scope > li")).forEach((li, i) => {
          addText(`${i + 1}. ${li.textContent?.trim() ?? ""}`, 11, "normal", 12);
          curY += 2;
        });
        curY += 4;
        break;
      case "table": {
        const rows = Array.from(el.querySelectorAll("tr"));
        if (!rows.length) break;
        const colCount = Math.max(...rows.map(r => r.querySelectorAll("td, th").length));
        if (!colCount) break;
        const colW = maxW / colCount;
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll("td, th"));
          const isHeader = cells.some(c => c.tagName.toLowerCase() === "th");
          ensureSpace(18);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", isHeader ? "bold" : "normal");
          cells.forEach((cell, ci) => {
            const lines: string[] = pdf.splitTextToSize(cell.textContent?.trim() ?? "", colW - 8);
            pdf.text(lines[0] ?? "", mX + ci * colW + 4, curY);
          });
          curY += 18;
          if (isHeader) {
            pdf.setDrawColor(150, 150, 150);
            pdf.line(mX, curY - 12, mX + maxW, curY - 12);
          }
        }
        curY += 6;
        break;
      }
      case "br": curY += 8; break;
      case "hr":
        ensureSpace(12);
        pdf.setDrawColor(180, 180, 180);
        pdf.line(mX, curY, mX + maxW, curY);
        curY += 12;
        break;
      default:
        el.childNodes.forEach(processNode);
        break;
    }
  }

  doc.body.childNodes.forEach(processNode);
  onProgress(90);

  const pdfBlob = pdf.output("blob");
  return URL.createObjectURL(pdfBlob);
}

export default function WordToPdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PdfResult[]>([]);

  const handleFiles = (incoming: File[]) => {
    const invalid = incoming.filter((f) => !f.name.toLowerCase().endsWith(".docx"));
    if (invalid.length > 0) {
      toast.error("Unsupported Format", {
        description: "Only .docx files are supported. Please save as .docx from Word first.",
      });
      return;
    }
    setFiles((prev) => [...prev, ...incoming]);
    setStatus("ready");
    setError(null);
    setResults([]);
    toast.success(`${incoming.length} file${incoming.length > 1 ? "s" : ""} added`, {
      description: "Ready to convert to PDF.",
    });
  };

  const convert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setError(null);

    const converted: PdfResult[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatusMessage(`Converting ${file.name}… (${i + 1}/${files.length})`);
        const fileBaseProgress = Math.round((i / files.length) * 100);
        const pdfUrl = await convertFileToPdf(file, (p) => {
          setProgress(fileBaseProgress + Math.round(p / files.length));
        });
        converted.push({ originalName: file.name, pdfUrl });
      }
      setResults(converted);
      setProgress(100);
      setStatus("done");
      toast.success("Conversion Complete!", {
        description: `${converted.length} document${converted.length !== 1 ? "s" : ""} converted to PDF.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not convert one or more Word documents. Please make sure they are valid .docx files.";
      setError(msg);
      setStatus("error");
      toast.error("Conversion Failed", { description: msg });
    }
  };

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.pdfUrl;
        a.download = r.originalName.replace(/\.(docx?|doc)$/i, ".pdf");
        a.click();
      }, i * 200);
    });
    toast.success("Downloading All", { description: `${results.length} PDF files are being downloaded.` });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setStatus("idle");
      return next;
    });
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.pdfUrl));
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setStatusMessage("");
  };

  return (
    <div className="space-y-6">
      {(status === "idle" || status === "ready") && (
        <>
          <FileUploader
            accept=".docx"
            multiple
            maxSizeMB={50}
            onFiles={handleFiles}
            label={files.length > 0 ? "Add More Word Documents" : "Upload Word Documents"}
            hint="Supports .docx files — up to 50MB each"
          />

          {files.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
                <button onClick={reset} className="text-xs text-slate-400 hover:text-red-600">Clear all</button>
              </div>
              <div className="divide-y divide-slate-100">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl shrink-0">📝</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="shrink-0 text-xs text-slate-400 hover:text-red-600">Remove</button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-slate-100 space-y-3">
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <strong>Note:</strong> Basic formatting (headings, paragraphs, bold, italic, tables) is preserved. Complex layouts may differ.
                </div>
                <Button onClick={convert} variant="primary" size="lg" className="w-full">
                  Convert {files.length > 1 ? `${files.length} Documents` : "Document"} to PDF
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message={statusMessage || "Converting Word document to PDF…"} />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 whitespace-pre-line">
          {error}
          <button onClick={reset} className="mt-3 block text-xs underline hover:text-red-900">Try Again</button>
        </div>
      )}

      {status === "done" && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-900">
              {results.length} document{results.length > 1 ? "s" : ""} converted to PDF
            </h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <Button onClick={downloadAll} variant="primary" size="md">Download All</Button>
              )}
              <Button onClick={reset} variant="secondary" size="md">Convert More</Button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl shrink-0">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {r.originalName.replace(/\.(docx?|doc)$/i, ".pdf")}
                  </p>
                </div>
                <a
                  href={r.pdfUrl}
                  download={r.originalName.replace(/\.(docx?|doc)$/i, ".pdf")}
                  onClick={() => toast.success("Downloading", { description: r.originalName.replace(/\.(docx?|doc)$/i, ".pdf") })}
                  className="shrink-0 text-sm rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
