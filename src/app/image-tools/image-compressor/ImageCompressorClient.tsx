"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";

interface ProcessedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  previewUrl: string;
  savings: number;
}

export default function ImageCompressorClient() {
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const compressImage = (file: File, q: number): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const previewUrl = URL.createObjectURL(blob);
            resolve({
              name: file.name,
              originalSize: file.size,
              compressedSize: blob.size,
              blob,
              previewUrl,
              savings: Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100)),
            });
          },
          mimeType,
          q / 100
        );
      };
      img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
      img.src = url;
    });
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      setResults([]);
      setProcessing(true);
      setProgress(0);
      const processed: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await compressImage(files[i], quality);
          processed.push(result);
        } catch (e) {
          setError((e as Error).message);
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setResults(processed);
      setProcessing(false);
      if (processed.length > 0) {
        const avgSavings = Math.round(processed.reduce((sum, r) => sum + r.savings, 0) / processed.length);
        toast.success("Images Compressed!", {
          description: `${processed.length} image${processed.length !== 1 ? "s" : ""} compressed${avgSavings > 0 ? ` — avg ${avgSavings}% saved` : ""}.`,
        });
      }
    },
    [quality]
  );

  const downloadAll = () => {
    results.forEach((r) => {
      const ext = r.blob.type === "image/png" ? "png" : "jpg";
      const baseName = r.name.replace(/\.[^/.]+$/, "");
      downloadBlob(r.blob, `${baseName}-compressed.${ext}`);
    });
    toast.success("Downloading All", { description: `${results.length} compressed images are being downloaded.` });
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {results.length === 0 && !processing && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <label className="block text-sm font-semibold text-slate-700">
              Compression Quality: <span className="text-red-600">{quality}%</span>
            </label>
            <input
              type="range" min={10} max={100} step={5} value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-3 w-full accent-red-600"
              aria-label="Compression quality"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>
          <FileUploader accept=".jpg,.jpeg,.png,.webp" multiple maxSizeMB={50} onFiles={handleFiles} label="Upload Images to Compress" hint="Supports JPG, PNG, WebP — up to 50MB each" />
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Compressing images…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{results.length} image{results.length > 1 ? "s" : ""} compressed</h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button onClick={downloadAll} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Download All</button>
              )}
              <button onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Compress More</button>
            </div>
          </div>
          {results.map((r, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
              <img src={r.previewUrl} alt={`Compressed ${r.name}`} className="h-20 w-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-slate-900">{r.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span>Original: {formatBytes(r.originalSize)}</span>
                  <span>Compressed: {formatBytes(r.compressedSize)}</span>
                  {r.savings > 0 && <span className="font-medium text-green-600">Saved {r.savings}%</span>}
                </div>
              </div>
              <button
                onClick={() => {
                  const ext = r.blob.type === "image/png" ? "png" : "jpg";
                  const base = r.name.replace(/\.[^/.]+$/, "");
                  downloadBlob(r.blob, `${base}-compressed.${ext}`);
                  toast.success("Downloading", { description: `${base}-compressed.${ext}` });
                }}
                className="shrink-0 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
