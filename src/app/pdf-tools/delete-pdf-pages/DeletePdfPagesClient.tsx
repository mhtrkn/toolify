"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Status = "idle" | "ready" | "processing" | "done" | "error";

function parsePageInput(input: string, total: number): Set<number> | null {
  const indices = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b) return null;
      for (let i = a; i <= b; i++) indices.add(i - 1);
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > total) return null;
      indices.add(n - 1);
    }
  }
  return indices;
}

export default function DeletePdfPagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultPageCount, setResultPageCount] = useState(0);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setResultUrl(null);
    setPageInput("");
    setStatus("ready");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const ab = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
      setPageCount(pdf.numPages);
      toast.success("File Ready", { description: `${f.name} loaded — ${pdf.numPages} pages.` });
    } catch {
      setPageCount(0);
      toast.success("File Ready", { description: `${f.name} is ready.` });
    }
  };

  const process = async () => {
    if (!file) return;
    const pagesToDelete = parsePageInput(pageInput, pageCount);
    if (!pagesToDelete) {
      setError(`Invalid page numbers. Enter values between 1 and ${pageCount}, e.g. "1, 3, 5-7".`);
      return;
    }
    if (pagesToDelete.size === 0) { setError("Please enter at least one page to delete."); return; }
    if (pagesToDelete.size >= pageCount) { setError("You cannot delete all pages. At least one page must remain."); return; }

    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      setProgress(20);
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);
      const total = srcPdf.getPageCount();
      setProgress(35);
      const keepIndices = Array.from({ length: total }, (_, i) => i).filter((i) => !pagesToDelete.has(i));
      const outPdf = await PDFDocument.create();
      const copied = await outPdf.copyPages(srcPdf, keepIndices);
      copied.forEach((p) => outPdf.addPage(p));
      setProgress(80);
      const pdfBytes = await outPdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setResultPageCount(keepIndices.length);
      setProgress(100);
      setStatus("done");
      toast.success("Pages Deleted!", {
        description: `${pagesToDelete.size} page${pagesToDelete.size !== 1 ? "s" : ""} removed. ${keepIndices.length} page${keepIndices.length !== 1 ? "s" : ""} remaining.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not process this PDF. The file may be encrypted or corrupted.";
      setError(msg);
      toast.error("Operation Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(".pdf", "-edited.pdf");
    a.click();
    toast.success("Download Started", { description: "Your edited PDF is being downloaded." });
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPageCount(0);
    setPageInput("");
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResultUrl(null);
    setResultPageCount(0);
  };

  const pagesToDeletePreview = (() => {
    if (!pageInput.trim() || pageCount === 0) return null;
    const parsed = parsePageInput(pageInput, pageCount);
    if (!parsed || parsed.size === 0) return null;
    return parsed.size;
  })();

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".pdf" maxSizeMB={100} onFiles={handleFiles} label="Upload PDF File" hint="Supports PDF up to 100MB" />
      )}
      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}{pageCount > 0 && ` · ${pageCount} pages`}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pages to delete <span className="font-normal text-slate-400">(e.g. 1, 3, 5-7)</span>
            </label>
            <Input
              type="text"
              value={pageInput}
              onChange={(e) => { setPageInput(e.target.value); setError(null); }}
              placeholder={pageCount > 1 ? `1-${Math.min(2, pageCount)}` : "1"}
              className="focus:ring-red-400"
            />
            {pageCount > 0 && <p className="mt-1 text-xs text-slate-400">PDF has {pageCount} pages. Enter comma-separated pages or ranges.</p>}
            {pagesToDeletePreview !== null && (
              <p className="mt-1 text-xs text-amber-700">
                {pagesToDeletePreview} page{pagesToDeletePreview !== 1 ? "s" : ""} will be deleted · {pageCount - pagesToDeletePreview} will remain
              </p>
            )}
          </div>
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="flex gap-3">
            <button onClick={process} disabled={!pageInput.trim()} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              Delete Pages
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">Change File</button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Processing PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Removing pages" /></div>
        </div>
      )}
      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {status === "done" && resultUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div>
            <p className="font-semibold text-green-900">Pages Deleted!</p>
            <p className="text-sm text-green-700 mt-1">
              {pageCount - resultPageCount} page{pageCount - resultPageCount !== 1 ? "s" : ""} removed · {resultPageCount} page{resultPageCount !== 1 ? "s" : ""} remaining
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Download PDF</button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">Edit Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
