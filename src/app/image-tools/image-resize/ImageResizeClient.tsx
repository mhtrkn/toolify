"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ResizeResult {
  name: string;
  originalSize: number;
  newSize: number;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
}

export default function ImageResizeClient() {
  const [width, setWidth] = useState<number | "">(1280);
  const [height, setHeight] = useState<number | "">(720);
  const [keepAspect, setKeepAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState<number | null>(null);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResizeResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (keepAspect && originalAspect) setHeight(Math.round(v / originalAspect));
  };

  const onHeightChange = (v: number) => {
    setHeight(v);
    if (keepAspect && originalAspect) setWidth(Math.round(v * originalAspect));
  };

  const resizeImage = (file: File): Promise<ResizeResult> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const targetW = Number(width) || img.naturalWidth;
        const targetH = Number(height) || img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, targetW, targetH);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Resize failed"));
            resolve({ name: file.name, originalSize: file.size, newSize: blob.size, blob, previewUrl: URL.createObjectURL(blob), width: targetW, height: targetH });
          },
          `image/${format}`,
          0.92
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
      if (keepAspect && files.length > 0) {
        await new Promise<void>((res) => {
          const img = new Image();
          const u = URL.createObjectURL(files[0]);
          img.onload = () => { setOriginalAspect(img.naturalWidth / img.naturalHeight); URL.revokeObjectURL(u); res(); };
          img.src = u;
        });
      }
      const processed: ResizeResult[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await resizeImage(files[i]);
          processed.push(result);
        } catch (e) {
          setError((e as Error).message);
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setResults(processed);
      setProcessing(false);
      if (processed.length > 0) {
        toast.success("Images Resized!", {
          description: `${processed.length} image${processed.length !== 1 ? "s" : ""} resized to ${processed[0].width}×${processed[0].height}px.`,
        });
      }
    },
    [width, height, format, keepAspect]
  );

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
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-slate-900">Resize Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                <Input type="number" value={width} min={1} max={10000} onChange={(e) => onWidthChange(Number(e.target.value))} className="focus:border-red-500 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                <Input type="number" value={height} min={1} max={10000} onChange={(e) => onHeightChange(Number(e.target.value))} className="focus:border-red-500 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <Checkbox checked={keepAspect} onCheckedChange={(c) => setKeepAspect(c as boolean)} />
                Keep aspect ratio
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Output format:</span>
                {(["jpeg", "png", "webp"] as const).map((f) => (
                  <button key={f} onClick={() => setFormat(f)} className={`rounded px-2.5 py-1 text-xs font-medium uppercase transition-colors ${format === f ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {[{ label: "HD 1280×720", w: 1280, h: 720 }, { label: "FHD 1920×1080", w: 1920, h: 1080 }, { label: "Instagram 1080×1080", w: 1080, h: 1080 }, { label: "Twitter 1500×500", w: 1500, h: 500 }, { label: "Thumbnail 300×300", w: 300, h: 300 }].map((p) => (
                  <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-red-300 hover:text-red-600">{p.label}</button>
                ))}
              </div>
            </div>
          </div>
          <FileUploader accept=".jpg,.jpeg,.png,.webp,.gif" multiple maxSizeMB={50} onFiles={handleFiles} label="Upload Images to Resize" hint="Supports JPG, PNG, WebP, GIF" />
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Resizing images…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{results.length} image{results.length > 1 ? "s" : ""} resized</h2>
            <Button onClick={reset} variant="secondary" size="md">Resize More</Button>
          </div>
          {results.map((r, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
              <img src={r.previewUrl} alt={`Resized ${r.name}`} className="h-20 w-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-slate-900">{r.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span>{r.width} × {r.height}px</span>
                  <span>{formatBytes(r.newSize)}</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  const base = r.name.replace(/\.[^/.]+$/, "");
                  downloadBlob(r.blob, `${base}-${r.width}x${r.height}.${format}`);
                  toast.success("Downloading", { description: `${base}-${r.width}x${r.height}.${format}` });
                }}
                variant="primary" size="md" className="shrink-0"
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
