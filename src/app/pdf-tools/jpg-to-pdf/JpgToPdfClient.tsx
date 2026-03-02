"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

interface ImgFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfClient() {
  const [images, setImages] = useState<ImgFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);
    setResultUrl(null);
    const added: ImgFile[] = newFiles.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...added]);
    toast.success("Images Added", { description: `${newFiles.length} image${newFiles.length > 1 ? "s" : ""} added.` });
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setImages((prev) => { const next = [...prev]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; return next; });
  };

  const moveDown = (i: number) => {
    setImages((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; return next;
    });
  };

  const convert = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setProgress(5);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      setProgress(10);
      for (let i = 0; i < images.length; i++) {
        const { file } = images[i];
        const bytes = await file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);
        let img;
        const type = file.type.toLowerCase();
        if (type === "image/jpeg" || type === "image/jpg" || file.name.match(/\.jpe?g$/i)) {
          img = await pdfDoc.embedJpg(uint8);
        } else {
          img = await pdfDoc.embedPng(uint8);
        }
        const A4_W = 595.28, A4_H = 841.89, margin = 20;
        const maxW = A4_W - margin * 2, maxH = A4_H - margin * 2;
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const drawW = img.width * ratio, drawH = img.height * ratio;
        const x = (A4_W - drawW) / 2, y = (A4_H - drawH) / 2;
        const page = pdfDoc.addPage([A4_W, A4_H]);
        page.drawImage(img, { x, y, width: drawW, height: drawH });
        setProgress(10 + Math.round(((i + 1) / images.length) * 82));
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      toast.success("PDF Created!", {
        description: `${images.length} image${images.length !== 1 ? "s" : ""} merged into one PDF.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not convert images. Make sure all files are valid JPG or PNG images.";
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "images.pdf";
    a.click();
    toast.success("Download Started", { description: "Your PDF file is being downloaded." });
  };

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImages([]);
    setResultUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!resultUrl && !processing && (
        <>
          <FileUploader
            accept=".jpg,.jpeg,.png"
            multiple
            maxSizeMB={50}
            onFiles={handleFiles}
            label={images.length > 0 ? "Add More Images" : "Upload JPG or PNG Images"}
            hint="Each image becomes one PDF page — up to 50MB per file"
          />
          {images.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  {images.length} image{images.length > 1 ? "s" : ""} · each becomes a PDF page
                </p>
                <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600">Clear all</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {images.map((img, i) => (
                  <li key={img.id} className="flex items-center gap-3 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.previewUrl} alt={img.file.name} className="h-10 w-10 rounded object-cover border border-slate-200 shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-sm text-slate-700">{img.file.name}</span>
                    <span className="text-xs text-slate-400 shrink-0">{formatBytes(img.file.size)}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => moveUp(i)} disabled={i === 0} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">↑</button>
                      <button onClick={() => moveDown(i)} disabled={i === images.length - 1} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down">↓</button>
                      <button onClick={() => removeImage(img.id)} className="rounded p-1 text-red-400 hover:bg-red-50" aria-label="Remove">×</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {images.length >= 1 && (
            <button onClick={convert} className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white hover:bg-red-700">
              Convert {images.length} Image{images.length > 1 ? "s" : ""} to PDF
            </button>
          )}
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Building PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {resultUrl && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div>
            <p className="font-semibold text-green-900">PDF Created!</p>
            <p className="text-sm text-green-700 mt-1">{images.length} image{images.length > 1 ? "s" : ""} merged into one PDF.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Download PDF</button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">Convert More</button>
          </div>
        </div>
      )}
    </div>
  );
}
