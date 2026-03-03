"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";

type OutputFormat = "jpg" | "png" | "webp";

const FORMAT_LABELS: Record<OutputFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
};

const FORMAT_MIME: Record<OutputFormat, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

interface ConvertedFile {
  originalName: string;
  outputName: string;
  originalSize: number;
  convertedSize: number;
  blob: Blob;
  previewUrl: string;
  outputFormat: OutputFormat;
}

function canvasConvert(file: File, format: OutputFormat): Promise<ConvertedFile> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas not supported in this browser."));
      }
      // Fill white background for JPG (no alpha channel)
      if (format === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error(`Conversion failed for ${file.name}`));
          const ext = format === "jpg" ? "jpg" : format;
          const outputName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
          resolve({
            originalName: file.name,
            outputName,
            originalSize: file.size,
            convertedSize: blob.size,
            blob,
            previewUrl: URL.createObjectURL(blob),
            outputFormat: format,
          });
        },
        FORMAT_MIME[format],
        format === "jpg" ? 0.93 : undefined
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

async function heicConvert(file: File, format: OutputFormat): Promise<ConvertedFile> {
  // heic2any is loaded dynamically to avoid SSR issues and reduce initial bundle size
  const heic2any = (await import("heic2any")).default as (options: {
    blob: Blob;
    toType: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>;

  const result = await heic2any({
    blob: file,
    toType: FORMAT_MIME[format],
    quality: 0.92,
  });
  const blob = Array.isArray(result) ? result[0] : result;
  const ext = format === "jpg" ? "jpg" : format;
  const outputName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
  return {
    originalName: file.name,
    outputName,
    originalSize: file.size,
    convertedSize: blob.size,
    blob,
    previewUrl: URL.createObjectURL(blob),
    outputFormat: format,
  };
}

function isHeic(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

export default function ImageFormatConverterClient() {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setErrors([]);
      setResults([]);
      setProcessing(true);
      setProgress(0);

      const converted: ConvertedFile[] = [];
      const errs: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const result = isHeic(file)
            ? await heicConvert(file, outputFormat)
            : await canvasConvert(file, outputFormat);
          converted.push(result);
        } catch (e) {
          const msg = (e as Error).message || `Failed to convert ${file.name}`;
          errs.push(msg);
          toast.error("Conversion Error", { description: msg });
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setResults(converted);
      setErrors(errs);
      setProcessing(false);

      if (converted.length > 0) {
        toast.success(
          `${converted.length} image${converted.length !== 1 ? "s" : ""} converted!`,
          {
            description: `All files converted to ${FORMAT_LABELS[outputFormat]}.`,
          }
        );
      }
    },
    [outputFormat]
  );

  const downloadAll = () => {
    results.forEach((r) => downloadBlob(r.blob, r.outputName));
    toast.success("Downloading all files…");
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
    setErrors([]);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {results.length === 0 && !processing && (
        <>
          {/* Output format selector */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">Output Format</p>
            <div className="flex flex-wrap gap-2">
              {(["jpg", "png", "webp"] as OutputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`rounded-lg border px-5 py-2 text-sm font-semibold transition-colors ${
                    outputFormat === fmt
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/40"
                  }`}
                >
                  {FORMAT_LABELS[fmt]}
                </button>
              ))}
            </div>

            {/* Format support matrix */}
            <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-medium text-slate-500 mb-2">Supported input formats</p>
              <div className="flex flex-wrap gap-2">
                {["HEIC", "HEIF", "JPG", "PNG", "WebP", "BMP", "TIFF"].map((f) => (
                  <span
                    key={f}
                    className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {f}
                  </span>
                ))}
                <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-red-700">
                  → {FORMAT_LABELS[outputFormat]}
                </span>
              </div>
            </div>
          </div>

          <FileUploader
            accept=".heic,.heif,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif"
            multiple
            maxSizeMB={50}
            onFiles={handleFiles}
            label={`Upload Images → Convert to ${FORMAT_LABELS[outputFormat]}`}
            hint="Supports HEIC, JPG, PNG, WebP, BMP, TIFF — up to 50MB each"
          />
        </>
      )}

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Converting images…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Converting" /></div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-sm font-semibold text-red-800">Some files failed:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, i) => (
              <li key={i} className="text-sm text-red-700">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-900">
              {results.length} file{results.length > 1 ? "s" : ""} converted to{" "}
              <span className="text-red-600">{FORMAT_LABELS[outputFormat]}</span>
            </h2>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Download All
                </button>
              )}
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Convert More
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={r.previewUrl}
                  alt={r.outputName}
                  className="h-16 w-16 rounded-lg object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-slate-900 text-sm">{r.outputName}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                    <span>Original: {formatBytes(r.originalSize)}</span>
                    <span>→</span>
                    <span>Converted: {formatBytes(r.convertedSize)}</span>
                    <span className="font-medium text-red-600 uppercase">
                      {FORMAT_LABELS[r.outputFormat]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    downloadBlob(r.blob, r.outputName);
                    toast.success("Download started", { description: r.outputName });
                  }}
                  className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
