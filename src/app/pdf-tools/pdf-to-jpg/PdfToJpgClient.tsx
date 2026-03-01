"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

interface PageResult {
  pageNumber: number;
  dataUrl: string;
}

export default function PdfToJpgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PageResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setResults([]);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(10);
    setError(null);

    try {
      // Dynamically import pdfjs-dist to keep bundle small
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const pages: PageResult[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        pages.push({ pageNumber: i, dataUrl: canvas.toDataURL("image/jpeg", quality / 100) });
        setProgress(Math.round(10 + (i / total) * 85));
      }

      setResults(pages);
      setProgress(100);
    } catch (e) {
      setError(
        "Could not process this PDF. Make sure pdfjs-dist is installed: npm install pdfjs-dist"
      );
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const downloadPage = (page: PageResult) => {
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = `page-${page.pageNumber}.jpg`;
    a.click();
  };

  const downloadAll = () => results.forEach(downloadPage);

  const reset = () => {
    setFile(null);
    setResults([]);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!file && !processing && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF File"
          hint="Supports PDF up to 100MB"
        />
      )}

      {file && results.length === 0 && !processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              JPG Quality: <span className="text-blue-600">{quality}%</span>
            </label>
            <input
              type="range" min={50} max={100} step={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={convert}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Convert to JPG
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              Change File
            </button>
          </div>
        </div>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">Converting PDF pages…</p>
          <ProgressBar progress={progress} label="Processing" />
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {results.length} page{results.length > 1 ? "s" : ""} converted
            </h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Download All
                </button>
              )}
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Convert Another
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <div key={r.pageNumber} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <img
                  src={r.dataUrl}
                  alt={`Page ${r.pageNumber}`}
                  className="w-full object-contain"
                  loading="lazy"
                />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-600">Page {r.pageNumber}</span>
                  <button
                    onClick={() => downloadPage(r)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Download JPG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
