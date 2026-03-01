"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResult(null);
  };

  const compress = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      setProgress(20);

      const arrayBuffer = await file.arrayBuffer();
      setProgress(35);

      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
      });
      setProgress(50);

      // Strip metadata to reduce size
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("Toolify");
      pdfDoc.setCreator("Toolify");
      setProgress(65);

      // Save with object streams enabled for best compression
      const compressed = await pdfDoc.save({ useObjectStreams: true });
      setProgress(90);

      const blob = new Blob([compressed as unknown as BlobPart], {
        type: "application/pdf",
      });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Could not compress this PDF. The file may be encrypted or corrupted.");
      setStatus("error");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(".pdf", "-compressed.pdf");
    a.click();
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  };

  const savedBytes = file && result ? file.size - result.size : 0;
  const savedPct =
    file && result ? Math.round((savedBytes / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF to Compress"
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
            Compression removes metadata and optimizes the PDF document structure.
          </div>
          <div className="flex gap-3">
            <button
              onClick={compress}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Compress PDF
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
            Compressing PDF…
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

      {status === "done" && result && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-green-900">PDF Compressed!</p>
            <p className="text-sm text-green-700 mt-1">
              {savedPct > 0
                ? `Reduced by ${savedPct}% (saved ${formatBytes(savedBytes)})`
                : "PDF optimized successfully"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-white border border-green-200 p-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">Original</p>
              <p className="font-semibold text-slate-800">{formatBytes(file.size)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Compressed</p>
              <p className="font-semibold text-green-700">{formatBytes(result.size)}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={download}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Download Compressed PDF
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50"
            >
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
