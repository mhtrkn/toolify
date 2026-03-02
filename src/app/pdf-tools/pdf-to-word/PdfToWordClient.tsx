"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

function escapeRtf(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/[^\x00-\x7F]/g, (ch) => {
      const code = ch.charCodeAt(0);
      return `\\u${code}?`;
    });
}

function buildRtf(pages: string[][]): string {
  const header =
    "{\\rtf1\\ansi\\deff0\n" +
    "{\\fonttbl{\\f0 Arial;}}\n" +
    "{\\colortbl;\\red0\\green0\\blue0;}\n" +
    "\\f0\\fs24\\cf1\n";
  const body = pages
    .map((lines, pageIdx) => {
      const content = lines
        .filter((l) => l.trim().length > 0)
        .map((l) => escapeRtf(l) + "\\par\n")
        .join("");
      return pageIdx < pages.length - 1 ? content + "\\page\n" : content;
    })
    .join("");
  return header + body + "}";
}

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [rtfUrl, setRtfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setRtfUrl(null);
    setPageCount(0);
    toast.success("File Selected", { description: `${files[0].name} is ready to convert.` });
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      setProgress(20);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const total = pdf.numPages;
      setPageCount(total);
      setProgress(30);
      const pages: string[][] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        type TextItem = { str: string; transform: number[] };
        const items = content.items as TextItem[];
        const lineMap = new Map<number, string[]>();
        for (const item of items) {
          if (!item.str.trim()) continue;
          const y = Math.round(item.transform[5] / 2) * 2;
          if (!lineMap.has(y)) lineMap.set(y, []);
          lineMap.get(y)!.push(item.str);
        }
        const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
        const lines = sortedYs.map((y) => lineMap.get(y)!.join(" "));
        pages.push(lines);
        setProgress(30 + Math.round((i / total) * 60));
      }
      const rtf = buildRtf(pages);
      const blob = new Blob([rtf], { type: "application/rtf" });
      setRtfUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus("done");
      toast.success("Conversion Complete!", {
        description: `${total} page${total !== 1 ? "s" : ""} extracted and ready to download.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not extract text from this PDF. The file may be scanned or password-protected.";
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!rtfUrl || !file) return;
    const a = document.createElement("a");
    a.href = rtfUrl;
    a.download = file.name.replace(/\.pdf$/i, ".rtf");
    a.click();
    toast.success("Download Started", { description: "Your Word file is being downloaded." });
  };

  const reset = () => {
    if (rtfUrl) URL.revokeObjectURL(rtfUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setRtfUrl(null);
    setPageCount(0);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".pdf" maxSizeMB={100} onFiles={handleFiles} label="Upload PDF to Convert" hint="Supports PDF up to 100MB" />
      )}
      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
            <strong>Note:</strong> Text is extracted from the PDF and saved as an RTF file — opens in Word, LibreOffice, and Google Docs. Scanned PDFs (images) require OCR and cannot be converted this way.
          </div>
          <div className="flex gap-3">
            <button onClick={convert} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">Convert to Word</button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">Change File</button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Extracting text from PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}
      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {status === "done" && rtfUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div>
            <p className="font-semibold text-green-900">Conversion Complete!</p>
            <p className="text-sm text-green-700 mt-1">
              {pageCount} page{pageCount !== 1 ? "s" : ""} extracted · opens in Word & LibreOffice
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Download Word File</button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">Convert Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
