"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";
type Level = "low" | "medium" | "high";

const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: "low", label: "Low", description: "Lossless — removes metadata, preserves quality" },
  { id: "medium", label: "Medium", description: "Balanced — re-renders at 75% JPEG quality" },
  { id: "high", label: "High", description: "Maximum — aggressive compression, smaller file" },
];

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResult(null);
    toast.success("File Selected", { description: `${files[0].name} is ready to compress.` });
  };

  const compressLow = async (arrayBuffer: ArrayBuffer): Promise<Uint8Array> => {
    const { PDFDocument } = await import("pdf-lib");
    setProgress(30);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setProgress(50);
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("Fasttoolify");
    pdfDoc.setCreator("Fasttoolify");
    setProgress(70);
    return pdfDoc.save({ useObjectStreams: true });
  };

  const compressRendered = async (
    arrayBuffer: ArrayBuffer,
    scale: number,
    jpegQuality: number,
  ): Promise<Uint8Array> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    setProgress(15);
    const srcPdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const total = srcPdf.numPages;
    const { PDFDocument } = await import("pdf-lib");
    const outPdf = await PDFDocument.create();
    setProgress(20);
    for (let i = 1; i <= total; i++) {
      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const jpeg = canvas.toDataURL("image/jpeg", jpegQuality);
      const base64 = jpeg.split(",")[1];
      const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const embeddedImg = await outPdf.embedJpg(imgBytes);
      const pdfPage = outPdf.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      setProgress(20 + Math.round((i / total) * 70));
    }
    setProgress(92);
    return outPdf.save({ useObjectStreams: true });
  };

  const compress = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      let compressed: Uint8Array;
      if (level === "low") {
        compressed = await compressLow(arrayBuffer);
      } else if (level === "medium") {
        compressed = await compressRendered(arrayBuffer, 1.2, 0.72);
      } else {
        compressed = await compressRendered(arrayBuffer, 0.75, 0.45);
      }
      const blob = new Blob([compressed as unknown as BlobPart], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
      setStatus("done");
      const savedPct = Math.round(((file.size - blob.size) / file.size) * 100);
      toast.success("PDF Compressed!", {
        description: savedPct > 0
          ? `Reduced by ${savedPct}% — ${formatBytes(file.size - blob.size)} saved.`
          : "PDF optimized successfully.",
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not compress this PDF. The file may be encrypted or corrupted.";
      setError(msg);
      toast.error("Compression Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(".pdf", "-compressed.pdf");
    a.click();
    toast.success("Download Started", { description: "Your compressed PDF is being downloaded." });
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
  const savedPct = file && result ? Math.round((savedBytes / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".pdf" maxSizeMB={100} onFiles={handleFiles} label="Upload PDF to Compress" hint="Supports PDF up to 100MB" />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Compression level</p>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map((l) => (
                <label key={l.id} className={`flex flex-col gap-1 rounded-lg border p-4 cursor-pointer transition-colors ${level === l.id ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="level" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} className="sr-only" />
                  <span className="font-semibold text-sm text-slate-800">{l.label}</span>
                  <span className="text-xs text-slate-500 leading-snug">{l.description}</span>
                </label>
              ))}
            </div>
            {(level === "medium" || level === "high") && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Pages are re-rendered as images — text selection in output will not be available.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={compress} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">
              Compress PDF
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
              Change File
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Compressing PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
          {(level === "medium" || level === "high") && (
            <p className="mt-3 text-center text-xs text-slate-400">Re-rendering pages — this may take a moment for large files.</p>
          )}
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {status === "done" && result && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-green-900">PDF Compressed!</p>
            <p className="text-sm text-green-700 mt-1">
              {savedPct > 0 ? `Reduced by ${savedPct}% · saved ${formatBytes(savedBytes)}` : "PDF optimized successfully"}
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
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              Download Compressed PDF
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
