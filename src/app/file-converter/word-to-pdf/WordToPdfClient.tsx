"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

interface PdfResult {
  originalName: string;
  pdfUrl: string;
}

async function convertFileToPdf(file: File, onProgress: (p: number) => void): Promise<string> {
  // Step 1: Convert DOCX → HTML with mammoth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = (await import("mammoth")) as any;
  const mammoth = mod.default ?? mod;
  onProgress(20);

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  onProgress(40);

  const html = result.value;

  // Step 2: Render HTML to a hidden, styled container
  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "position: fixed",
    "top: -9999px",
    "left: -9999px",
    "width: 794px",
    "background: white",
    "color: black",
    "font-family: Georgia, serif",
    "font-size: 13px",
    "line-height: 1.6",
    "padding: 60px 80px",
    "box-sizing: border-box",
  ].join("; ");
  wrapper.innerHTML = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Georgia, serif; }
      h1 { font-size: 24px; margin-bottom: 12px; font-weight: bold; }
      h2 { font-size: 20px; margin-bottom: 10px; font-weight: bold; }
      h3 { font-size: 16px; margin-bottom: 8px; font-weight: bold; }
      p  { margin-bottom: 10px; }
      ul, ol { margin-left: 24px; margin-bottom: 10px; }
      li { margin-bottom: 4px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
      td, th { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
      th { background: #f0f0f0; font-weight: bold; }
      strong { font-weight: bold; }
      em { font-style: italic; }
    </style>
    ${html}
  `;
  document.body.appendChild(wrapper);
  onProgress(55);

  // Step 3: Capture with html2canvas
  const html2canvas = (await import("html2canvas")).default;
  const pageHeight = 1123;
  const pageWidth = 794;
  const totalHeight = wrapper.scrollHeight;
  onProgress(65);

  // Step 4: Generate PDF with jsPDF
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
  let y = 0;
  let firstPage = true;
  onProgress(70);

  while (y < totalHeight) {
    const canvas = await html2canvas(wrapper, {
      scale: 1,
      useCORS: true,
      y,
      height: Math.min(pageHeight, totalHeight - y),
      width: pageWidth,
      windowWidth: pageWidth,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgHeight = Math.min(pageHeight, totalHeight - y);

    if (!firstPage) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
    firstPage = false;
    y += pageHeight;
    onProgress(70 + Math.round(Math.min((y / totalHeight) * 25, 25)));
  }

  document.body.removeChild(wrapper);

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
      document.querySelectorAll("body > div[style*='-9999px']").forEach((el) =>
        document.body.removeChild(el)
      );
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
            accept=".doc,.docx"
            multiple
            maxSizeMB={50}
            onFiles={handleFiles}
            label={files.length > 0 ? "Add More Word Documents" : "Upload Word Documents"}
            hint="Supports .doc and .docx files — up to 50MB each"
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
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                  <strong>Note:</strong> Basic formatting (headings, paragraphs, bold, italic, tables) is preserved. Complex layouts may differ.
                </div>
                <button
                  onClick={convert}
                  className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Convert {files.length > 1 ? `${files.length} Documents` : "Document"} to PDF
                </button>
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
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
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
                <button onClick={downloadAll} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Download All
                </button>
              )}
              <button onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Convert More
              </button>
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
                  className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
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
