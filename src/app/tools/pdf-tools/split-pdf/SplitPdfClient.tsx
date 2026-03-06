"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Mode = "all" | "range";
type Status = "idle" | "ready" | "processing" | "done" | "error";

interface SplitResult {
  name: string;
  url: string;
  size: number;
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("all");
  const [rangeInput, setRangeInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SplitResult[]>([]);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setResults([]);
    setStatus("ready");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const ab = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      setPageCount(pdf.numPages);
      toast.success("File Ready", {
        description: `${f.name} loaded — ${pdf.numPages} pages detected.`,
      });
    } catch {
      setPageCount(0);
      toast.success("File Ready", { description: `${f.name} is ready to split.` });
    }
  };

  const parseSegments = (input: string, total: number): number[][] | null => {
    const segments: number[][] = [];
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map(Number);
        if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b) return null;
        const pages: number[] = [];
        for (let i = a; i <= b; i++) pages.push(i - 1);
        segments.push(pages);
      } else {
        const n = Number(part);
        if (isNaN(n) || n < 1 || n > total) return null;
        segments.push([n - 1]);
      }
    }
    return segments.length > 0 ? segments : null;
  };

  const split = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      setProgress(15);

      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);
      const total = srcPdf.getPageCount();
      setProgress(30);

      let segments: number[][];
      if (mode === "all") {
        segments = Array.from({ length: total }, (_, i) => [i]);
      } else {
        const parsed = parseSegments(rangeInput, total);
        if (!parsed) {
          setError(
            `Invalid range. Use format like "1-3, 5, 7-9". Pages must be between 1 and ${total}.`
          );
          setStatus("error");
          return;
        }
        segments = parsed;
      }

      const out: SplitResult[] = [];
      for (let s = 0; s < segments.length; s++) {
        const pages = segments[s];
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(srcPdf, pages);
        copied.forEach((p) => newPdf.addPage(p));
        const bytes = await newPdf.save({ useObjectStreams: true });
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });

        let name: string;
        if (mode === "all") {
          name = `page-${pages[0] + 1}.pdf`;
        } else if (pages.length === 1) {
          name = `page-${pages[0] + 1}.pdf`;
        } else {
          name = `pages-${pages[0] + 1}-${pages[pages.length - 1] + 1}.pdf`;
        }

        out.push({ name, url: URL.createObjectURL(blob), size: blob.size });
        setProgress(30 + Math.round(((s + 1) / segments.length) * 65));
      }

      setResults(out);
      setProgress(100);
      setStatus("done");
      toast.success("PDF Split!", {
        description: `${out.length} file${out.length !== 1 ? "s" : ""} created successfully.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not split this PDF. The file may be encrypted or corrupted.";
      setError(msg);
      toast.error("Split Failed", { description: msg });
      setStatus("error");
    }
  };

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.url;
        a.download = r.name;
        a.click();
      }, i * 200);
    });
    toast.success("Downloading All Files", {
      description: `${results.length} PDF files are being downloaded.`,
    });
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFile(null);
    setPageCount(0);
    setMode("all");
    setRangeInput("");
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF to Split"
          hint="Supports PDF up to 100MB"
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">
                {formatBytes(file.size)}
                {pageCount > 0 && ` · ${pageCount} pages`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Split mode</p>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer ${
                  mode === "all" ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input type="radio" name="mode" value="all" checked={mode === "all"} onChange={() => setMode("all")} className="accent-red-600" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">All Pages</p>
                  <p className="text-xs text-slate-500">Extract each page as a separate PDF</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer ${
                  mode === "range" ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input type="radio" name="mode" value="range" checked={mode === "range"} onChange={() => setMode("range")} className="accent-red-600" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">Custom Range</p>
                  <p className="text-xs text-slate-500">Specify pages or ranges to extract</p>
                </div>
              </label>
            </div>

            {mode === "range" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Page ranges <span className="font-normal text-slate-400">(e.g. 1-3, 5, 7-9)</span>
                </label>
                <Input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder={`1-${Math.ceil(pageCount / 2)}, ${Math.ceil(pageCount / 2) + 1}-${pageCount}`}
                  className="focus:ring-red-400"
                />
                <p className="mt-1 text-xs text-slate-400">Comma-separated segments — each becomes its own PDF</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={split} variant="primary" size="lg" className="flex-1" disabled={mode === "range" && !rangeInput.trim()}>
              Split PDF
            </Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change File</Button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Splitting PDF…" />
          <div className="mt-4">
            <ProgressBar progress={progress} label="Processing" />
          </div>
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {results.length} file{results.length > 1 ? "s" : ""} created
            </h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <Button onClick={downloadAll} variant="primary" size="md">Download All</Button>
              )}
              <Button onClick={reset} variant="secondary" size="md">Split Another</Button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg shrink-0">📄</span>
                <span className="flex-1 min-w-0 truncate text-sm text-slate-700">{r.name}</span>
                <span className="text-xs text-slate-400 shrink-0">{formatBytes(r.size)}</span>
                <a
                  href={r.url}
                  download={r.name}
                  onClick={() => toast.success("Downloading", { description: r.name })}
                  className="shrink-0 text-sm rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
