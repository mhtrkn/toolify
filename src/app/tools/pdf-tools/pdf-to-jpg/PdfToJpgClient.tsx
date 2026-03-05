"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

interface PageResult {
  pageNumber: number;
  dataUrl: string;
}

interface PdfResult {
  fileName: string;
  fileSize: number;
  pages: PageResult[];
}

export default function PdfToJpgClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PdfResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);

  const handleFiles = (incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
    setResults([]);
    setError(null);
    toast.success(`${incoming.length} file${incoming.length > 1 ? "s" : ""} added`, {
      description: "Ready to convert to JPG.",
    });
  };

  const convert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    const allResults: PdfResult[] = [];
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      // Count total pages first for accurate progress
      let totalPages = 0;
      const pdfDocs: { numPages: number; getPage: (n: number) => Promise<unknown> }[] = [];
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        pdfDocs.push(pdf as unknown as { numPages: number; getPage: (n: number) => Promise<unknown> });
        totalPages += (pdf as unknown as { numPages: number }).numPages;
      }

      let globalPagesDone = 0;
      for (let fi = 0; fi < files.length; fi++) {
        const file = files[fi];
        const pdf = pdfDocs[fi];
        const pages: PageResult[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i) as {
            getViewport: (opts: { scale: number }) => { width: number; height: number };
            render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number }; canvas: HTMLCanvasElement }) => { promise: Promise<void> };
          };
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          pages.push({ pageNumber: i, dataUrl: canvas.toDataURL("image/jpeg", quality / 100) });
          globalPagesDone++;
          setProgress(Math.round((globalPagesDone / totalPages) * 100));
        }
        allResults.push({ fileName: file.name, fileSize: file.size, pages });
      }

      setResults(allResults);
      const totalConverted = allResults.reduce((s, r) => s + r.pages.length, 0);
      toast.success("Conversion Complete!", {
        description: `${totalConverted} page${totalConverted !== 1 ? "s" : ""} from ${files.length} PDF${files.length !== 1 ? "s" : ""} converted to JPG.`,
      });
    } catch (e) {
      const msg = "Could not process one or more PDFs. Files may be corrupted or password-protected.";
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const downloadPage = (page: PageResult, fileBaseName: string) => {
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = `${fileBaseName}-page-${page.pageNumber}.jpg`;
    a.click();
  };

  const downloadAll = () => {
    let delay = 0;
    for (const result of results) {
      const base = result.fileName.replace(/\.pdf$/i, "");
      for (const page of result.pages) {
        setTimeout(() => downloadPage(page, base), delay);
        delay += 100;
      }
    }
    const total = results.reduce((s, r) => s + r.pages.length, 0);
    toast.success("Downloading All", { description: `${total} JPG files are being downloaded.` });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {results.length === 0 && !processing && (
        <>
          <FileUploader
            accept=".pdf"
            multiple
            maxSizeMB={100}
            onFiles={handleFiles}
            label={files.length > 0 ? "Add More PDF Files" : "Upload PDF Files"}
            hint="Select one or more PDF files — up to 100MB each"
          />

          {files.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">{files.length} PDF{files.length > 1 ? "s" : ""} selected</p>
                <button onClick={reset} className="text-xs text-slate-400 hover:text-red-600">Clear all</button>
              </div>
              <div className="divide-y divide-slate-100">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl shrink-0">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="shrink-0 text-xs text-slate-400 hover:text-red-600">Remove</button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    JPG Quality: <span className="text-red-600">{quality}%</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={5}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                </div>
                <Button onClick={convert} variant="primary" size="lg" className="w-full">
                  Convert {files.length > 1 ? `${files.length} PDFs` : "PDF"} to JPG
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Converting PDF pages…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-900">
              {results.reduce((s, r) => s + r.pages.length, 0)} pages converted from {results.length} PDF{results.length > 1 ? "s" : ""}
            </h2>
            <div className="flex gap-2">
              <Button onClick={downloadAll} variant="primary" size="md">Download All</Button>
              <Button onClick={reset} variant="secondary" size="md">Convert Another</Button>
            </div>
          </div>

          {results.map((result, ri) => (
            <div key={ri} className="space-y-3">
              {results.length > 1 && (
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>📄</span>
                  <span>{result.fileName}</span>
                  <span className="font-normal text-slate-400">({result.pages.length} pages)</span>
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.pages.map((page) => {
                  const base = result.fileName.replace(/\.pdf$/i, "");
                  return (
                    <div key={page.pageNumber} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="w-full object-contain" loading="lazy" />
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-600">Page {page.pageNumber}</span>
                        <button
                          onClick={() => {
                            downloadPage(page, base);
                            toast.success("Downloading", { description: `${base}-page-${page.pageNumber}.jpg` });
                          }}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Download JPG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
