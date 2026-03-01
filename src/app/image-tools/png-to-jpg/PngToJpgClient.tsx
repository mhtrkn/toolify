"use client";

import { useState, useCallback } from "react";
import FileUploader from "@/components/tools/FileUploader";
import { formatBytes } from "@/lib/utils";

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  url: string;
  size: number;
}

export default function PngToJpgClient() {
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const convertFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      setProcessing(true);

      const converted: ConvertedFile[] = [];

      for (const file of files) {
        try {
          const blobUrl = URL.createObjectURL(file);
          const img = new Image();

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () =>
              reject(new Error(`Failed to load ${file.name}`));
            img.src = blobUrl;
          });

          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          // Fill white background before drawing (PNG may have transparency)
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(blobUrl);

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
              "image/jpeg",
              quality / 100
            );
          });

          const jpgUrl = URL.createObjectURL(blob);
          converted.push({
            id: crypto.randomUUID(),
            originalName: file.name,
            originalSize: file.size,
            url: jpgUrl,
            size: blob.size,
          });
        } catch (e) {
          console.error(e);
          setError(`Failed to convert ${file.name}. Please try another file.`);
        }
      }

      setResults((prev) => [...prev, ...converted]);
      setProcessing(false);
    },
    [quality]
  );

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.url;
        a.download = r.originalName.replace(/\.png$/i, ".jpg");
        a.click();
      }, i * 150);
    });
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Quality setting */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          JPG Quality:{" "}
          <span className="text-red-600 font-semibold">{quality}%</span>
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
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      <FileUploader
        accept=".png"
        multiple
        maxSizeMB={50}
        onFiles={convertFiles}
        label={results.length > 0 ? "Convert More PNGs" : "Upload PNG Files"}
        hint="Select one or more PNG files — up to 50MB each"
      />

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Converting to JPG…
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {results.length} file{results.length > 1 ? "s" : ""} converted
            </h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Download All
                </button>
              )}
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {results.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={r.url}
                  alt={r.originalName}
                  className="h-10 w-10 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {r.originalName.replace(/\.png$/i, ".jpg")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatBytes(r.originalSize)} → {formatBytes(r.size)}
                  </p>
                </div>
                <a
                  href={r.url}
                  download={r.originalName.replace(/\.png$/i, ".jpg")}
                  className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  Download JPG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
