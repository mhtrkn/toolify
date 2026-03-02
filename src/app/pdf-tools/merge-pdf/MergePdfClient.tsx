"use client";

import { useState, useCallback } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

interface PdfFile {
  id: string;
  file: File;
}

export default function MergePdfClient() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);
    setMergedUrl(null);
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: crypto.randomUUID(), file: f })),
    ]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i: number) => {
    setFiles((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const merge = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    setProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      setProgress(20);

      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
        setProgress(20 + Math.round(((i + 1) / files.length) * 70));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setMergedUrl(URL.createObjectURL(blob));
      setProgress(100);
    } catch (e) {
      setError(
        "Could not merge PDFs. Make sure pdf-lib is installed: npm install pdf-lib"
      );
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setFiles([]);
    setMergedUrl(null);
    setProgress(0);
    setError(null);
  };

  const download = () => {
    if (!mergedUrl) return;
    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = "merged.pdf";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* File list */}
      {files.length > 0 && !mergedUrl && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {files.length} PDF file{files.length > 1 ? "s" : ""}
            </p>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600">
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg shrink-0">📄</span>
                <span className="flex-1 min-w-0 truncate text-sm text-slate-700">{f.file.name}</span>
                <span className="text-xs text-slate-400 shrink-0">{formatBytes(f.file.size)}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === files.length - 1}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="rounded p-1 text-red-400 hover:bg-red-50"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!mergedUrl && !processing && (
        <>
          <FileUploader
            accept=".pdf"
            multiple
            maxSizeMB={100}
            onFiles={handleFiles}
            label={files.length > 0 ? "Add More PDFs" : "Upload PDF Files to Merge"}
            hint="Select 2 or more PDFs — up to 100MB each"
          />

          {files.length >= 2 && (
            <button
              onClick={merge}
              className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white hover:bg-red-700"
            >
              Merge {files.length} PDFs
            </button>
          )}
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Merging PDFs…" />
          <div className="mt-4">
            <ProgressBar progress={progress} label="Processing" />
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {mergedUrl && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </span>
          </div>
          <div>
            <p className="font-semibold text-green-900">PDF merged successfully!</p>
            <p className="text-sm text-green-700 mt-1">
              {files.length} PDF files merged into one document.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={download}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Download Merged PDF
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50"
            >
              Merge More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
