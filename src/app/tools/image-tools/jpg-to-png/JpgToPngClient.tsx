"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";
import Image from "next/image";

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  url: string;
  size: number;
}

export default function JpgToPngClient() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const convertFiles = useCallback(async (files: File[]) => {
    setError(null);
    setProcessing(true);
    const converted: ConvertedFile[] = [];
    for (const file of files) {
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
          img.src = url;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
            "image/png",
          );
        });
        const pngUrl = URL.createObjectURL(blob);
        converted.push({
          id: crypto.randomUUID(),
          originalName: file.name,
          originalSize: file.size,
          url: pngUrl,
          size: blob.size,
        });
      } catch (e) {
        console.error(e);
        setError(`Failed to convert ${file.name}. Please try another file.`);
      }
    }
    setResults((prev) => [...prev, ...converted]);
    setProcessing(false);
    if (converted.length > 0) {
      toast.success("Conversion Complete!", {
        description: `${converted.length} file${converted.length !== 1 ? "s" : ""} converted to PNG.`,
      });
    }
  }, []);

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.url;
        a.download = r.originalName.replace(/\.(jpg|jpeg)$/i, ".png");
        a.click();
      }, i * 150);
    });
    toast.success("Downloading All", {
      description: `${results.length} PNG files are being downloaded.`,
    });
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <FileUploader
        accept=".jpg,.jpeg"
        multiple
        maxSizeMB={50}
        onFiles={convertFiles}
        label={results.length > 0 ? "Convert More JPGs" : "Upload JPG Files"}
        hint="Select one or more JPG/JPEG files — up to 50MB each"
      />

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Converting to PNG…" />
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
                <Button onClick={downloadAll} variant="primary" size="md">
                  Download All
                </Button>
              )}
              <Button onClick={reset} variant="secondary" size="md">
                Clear
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {results.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <Image
                  src={r.url}
                  alt={r.originalName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {r.originalName.replace(/\.(jpg|jpeg)$/i, ".png")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatBytes(r.originalSize)} → {formatBytes(r.size)}
                  </p>
                </div>
                <a
                  href={r.url}
                  download={r.originalName.replace(/\.(jpg|jpeg)$/i, ".png")}
                  onClick={() =>
                    toast.success("Downloading", {
                      description: r.originalName.replace(
                        /\.(jpg|jpeg)$/i,
                        ".png",
                      ),
                    })
                  }
                  className="shrink-0 text-sm rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  Download PNG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
