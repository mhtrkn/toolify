"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function PdfToTextClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setText("");
    setPageCount(0);
  };

  const extract = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      setProgress(20);

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      setPageCount(total);
      setProgress(30);

      const pages: string[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        pages.push(`--- Page ${i} ---\n${pageText}`);
        setProgress(30 + Math.round((i / total) * 65));
      }

      setText(pages.join("\n\n"));
      setProgress(100);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "Could not extract text from this PDF. The file may be image-based, encrypted, or corrupted."
      );
      setStatus("error");
    }
  };

  const downloadTxt = () => {
    if (!text || !file) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".pdf", ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setText("");
    setPageCount(0);
  };

  const wordCount = text
    ? text.split(/\s+/).filter((w) => w.length > 0).length
    : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF File"
          hint="Supports PDF up to 100MB"
        />
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
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
            Text is extracted from native PDF text layers. For scanned/image PDFs, use the{" "}
            <a href="/ocr-tools/ocr-image-to-text" className="text-red-600 underline">
              OCR Image to Text
            </a>{" "}
            tool instead.
          </div>
          <div className="flex gap-3">
            <button
              onClick={extract}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Extract Text
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

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">
            Extracting text from PDF…
          </p>
          <ProgressBar progress={progress} label="Processing" />
        </div>
      )}

      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {status === "done" && text && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-slate-900">Text extracted</p>
              <p className="text-sm text-slate-500">
                {pageCount} page{pageCount > 1 ? "s" : ""} · {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Copy Text
              </button>
              <button
                onClick={downloadTxt}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Download .txt
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Extract Another
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={text}
            rows={20}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm font-mono text-slate-700 focus:outline-none resize-y"
            aria-label="Extracted text"
          />
        </div>
      )}
    </div>
  );
}
