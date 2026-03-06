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

async function convertExcelToPdf(file: File, onProgress: (p: number) => void): Promise<string> {
  const XLSX = await import("xlsx");
  const { jsPDF } = await import("jspdf");
  onProgress(20);

  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  onProgress(30);

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const usableWidth = pageWidth - margin * 2;
  let firstSheet = true;

  for (let si = 0; si < wb.SheetNames.length; si++) {
    const sheetName = wb.SheetNames[si];
    const ws = wb.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false }) as string[][];
    if (data.length === 0) continue;
    if (!firstSheet) pdf.addPage();
    firstSheet = false;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 30, 30);
    pdf.text(sheetName, margin, margin + 10);
    const startY = margin + 28;
    const colCount = Math.max(...data.map((r) => r.length));
    if (colCount === 0) continue;
    const colWidth = Math.min(usableWidth / colCount, 120);
    const rowHeight = 18;
    const fontSize = 8;
    let y = startY;
    for (let ri = 0; ri < data.length; ri++) {
      const row = data[ri];
      if (y + rowHeight > pageHeight - margin) { pdf.addPage(); y = margin + 10; }
      if (ri === 0) { pdf.setFillColor(240, 240, 245); pdf.rect(margin, y, colWidth * colCount, rowHeight, "F"); }
      for (let ci = 0; ci < colCount; ci++) {
        const x = margin + ci * colWidth;
        const cellVal = String(row[ci] ?? "");
        pdf.setDrawColor(200, 200, 210);
        pdf.setLineWidth(0.4);
        pdf.rect(x, y, colWidth, rowHeight, "S");
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", ri === 0 ? "bold" : "normal");
        pdf.setTextColor(ri === 0 ? 20 : 60, ri === 0 ? 20 : 60, ri === 0 ? 20 : 60);
        const maxChars = Math.floor(colWidth / (fontSize * 0.55));
        const truncated = cellVal.length > maxChars ? cellVal.slice(0, maxChars - 1) + "…" : cellVal;
        pdf.text(truncated, x + 3, y + rowHeight - 5);
      }
      y += rowHeight;
    }
    onProgress(30 + Math.round(((si + 1) / wb.SheetNames.length) * 65));
  }

  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}

export default function ExcelToPdfClient() {
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
        const pdfUrl = await convertExcelToPdf(file, (p) => {
          setProgress(fileBaseProgress + Math.round(p / files.length));
        });
        converted.push({ originalName: file.name, pdfUrl });
      }
      setResults(converted);
      setProgress(100);
      setStatus("done");
      toast.success("Conversion Complete!", {
        description: `${converted.length} file${converted.length !== 1 ? "s" : ""} converted to PDF.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not convert one or more Excel files. Please make sure they are valid .xlsx or .xls files.";
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
      setStatus("error");
    }
  };

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.pdfUrl;
        a.download = r.originalName.replace(/\.(xlsx?|xls)$/i, ".pdf");
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
            accept=".xls,.xlsx"
            multiple
            maxSizeMB={50}
            onFiles={handleFiles}
            label={files.length > 0 ? "Add More Excel Files" : "Upload Excel Files"}
            hint="Supports .xls and .xlsx files — up to 50MB each"
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
                    <span className="text-xl shrink-0">📊</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="shrink-0 text-xs text-slate-400 hover:text-red-600">Remove</button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-slate-100">
                <Button onClick={convert} variant="primary" size="lg" className="w-full">
                  Convert {files.length > 1 ? `${files.length} Files` : "File"} to PDF
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message={statusMessage || "Converting Excel to PDF…"} />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {status === "done" && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-900">
              {results.length} file{results.length > 1 ? "s" : ""} converted to PDF
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
                    {r.originalName.replace(/\.(xlsx?|xls)$/i, ".pdf")}
                  </p>
                </div>
                <a
                  href={r.pdfUrl}
                  download={r.originalName.replace(/\.(xlsx?|xls)$/i, ".pdf")}
                  onClick={() => toast.success("Downloading", { description: r.originalName.replace(/\.(xlsx?|xls)$/i, ".pdf") })}
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
