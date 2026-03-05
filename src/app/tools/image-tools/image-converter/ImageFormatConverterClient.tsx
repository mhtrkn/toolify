/* eslint-disable react-hooks/refs */
"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  FileImage,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import {
  CANVAS_OUTPUT_FORMATS,
  SERVER_OUTPUT_FORMATS,
  detectFileFormat,
  getDefaultOutputFormat,
  getFormatDisplay,
  getMimeType,
  getOutputExtension,
  isHeicFormat,
  type ImageFormat,
} from "@/lib/formatDetector";
import { downloadBlob, formatBytes } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type FileStatus = "idle" | "converting" | "done" | "error";

interface ConversionItem {
  id: string;
  file: File;
  inputFormat: ImageFormat;
  targetFormat: ImageFormat;
  status: FileStatus;
  progress: number;
  result?: {
    blob: Blob;
    size: number;
    url: string;
    filename: string;
  };
  error?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ACCEPTED_FORMATS =
  ".heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.avif";

const OUTPUT_OPTIONS = SERVER_OUTPUT_FORMATS.map((fmt) => ({
  value: fmt,
  label: getFormatDisplay(fmt),
}));

// ─── Conversion helpers ───────────────────────────────────────────────────────

async function convertViaAPI(
  file: File,
  targetFormat: ImageFormat,
): Promise<Blob> {
  const body = new FormData();
  body.append("file", file);
  body.append("targetFormat", targetFormat);

  const res = await fetch("/api/convert", { method: "POST", body });

  if (!res.ok) {
    let msg = `Server error (${res.status})`;
    try {
      const json = await res.json();
      if (typeof json.error === "string") msg = json.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res.blob();
}

/** Returns true if the browser can natively decode this blob as an image. */
function canBrowserLoadBlob(blob: Blob): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); resolve(true); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
    img.src = url;
  });
}

/** Draw a blob onto a canvas and export as the target format. */
function drawBlobToCanvas(source: Blob, targetFormat: ImageFormat): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(source);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          return reject(new Error("Canvas 2D context is unavailable in this browser."));
        }

        if (targetFormat === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const mime = targetFormat === "jpg" ? "image/jpeg" : getMimeType(targetFormat);
        const quality = targetFormat === "jpg" || targetFormat === "webp" ? 0.92 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas conversion produced no output."));
          },
          mime,
          quality,
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion."));
    };

    img.src = url;
  });
}

async function convertViaCanvas(
  file: File,
  targetFormat: ImageFormat,
): Promise<Blob> {
  let source: Blob = file;

  const inputFmt = detectFileFormat(file);
  if (inputFmt && isHeicFormat(inputFmt)) {
    // Step 1: check if the browser natively supports HEIC (Safari on macOS/iOS does).
    const nativeOk = await canBrowserLoadBlob(file);

    if (!nativeOk) {
      // Step 2: fall back to heic2any (open-source WASM libheif decoder).
      try {
        const heic2any = (await import("heic2any")).default as (opts: {
          blob: Blob;
          toType: string;
          quality?: number;
        }) => Promise<Blob | Blob[]>;

        const result = await heic2any({ blob: file, toType: "image/png", quality: 1 });
        source = Array.isArray(result) ? result[0] : result;
      } catch {
        throw new Error(
          "HEIC decoding is not supported in your browser. " +
          "Try opening the file in Safari, or save it as JPG on your device first.",
        );
      }
    }
    // If nativeOk, browser can decode HEIC directly — source stays as the original file.
  }

  return drawBlobToCanvas(source, targetFormat);
}

async function convertFileWithFallback(
  file: File,
  targetFormat: ImageFormat,
): Promise<Blob> {
  try {
    return await convertViaAPI(file, targetFormat);
  } catch (apiErr) {
    const canFallback = (CANVAS_OUTPUT_FORMATS as readonly string[]).includes(
      targetFormat,
    );
    if (!canFallback) throw apiErr;

    console.warn("[converter] API failed, using canvas fallback:", apiErr);
    return convertViaCanvas(file, targetFormat);
  }
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

interface FileRowProps {
  item: ConversionItem;
  onConvert: () => void;
  onDownload: () => void;
  onRemove: () => void;
  onFormatChange: (fmt: ImageFormat) => void;
}

function FileRow({
  item,
  onConvert,
  onDownload,
  onRemove,
  onFormatChange,
}: FileRowProps) {
  const isConverting = item.status === "converting";
  const isDone = item.status === "done";
  const isError = item.status === "error";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-4">
        {/* Status icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-red-500" />
          ) : isError ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : isConverting ? (
            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          ) : (
            <FileImage className="h-5 w-5 text-slate-400" />
          )}
        </div>

        {/* Filename + size */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">
            {item.file.name}
          </p>
          <p className="text-xs text-slate-400">
            {formatBytes(item.file.size)}
          </p>
        </div>

        {/* Format badges */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
            {getFormatDisplay(item.inputFormat)}
          </span>

          <ArrowRight className="h-4 w-4 text-slate-300" />

          <div className="relative">
            <select
              value={item.targetFormat}
              onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
              disabled={isConverting}
              className="cursor-pointer appearance-none rounded border border-red-200 bg-red-50 py-0.5 pl-2.5 pr-6 font-mono text-xs text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
            >
              {OUTPUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-red-500" />
          </div>
        </div>

        {/* Action button */}
        <div className="shrink-0">
          {isDone ? (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          ) : (
            <button
              onClick={onConvert}
              disabled={isConverting}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConverting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {isError ? "Retry" : "Convert"}
            </button>
          )}
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          disabled={isConverting}
          aria-label="Remove file"
          className="shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      {isConverting && (
        <div className="px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-600 transition-[width] duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {isError && item.error && (
        <div className="flex items-center gap-1.5 px-4 pb-3">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{item.error}</p>
        </div>
      )}

      {/* Converted size */}
      {isDone && item.result && (
        <div className="px-4 pb-3">
          <p className="text-xs text-red-700">
            Converted · {formatBytes(item.result.size)}{" "}
            <span className="text-slate-400">
              ({item.result.size < item.file.size ? "−" : "+"}
              {formatBytes(Math.abs(item.result.size - item.file.size))})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImageFormatConverterClient() {
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [isDragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ConversionItem[]>([]);
  itemsRef.current = items;

  // ── File ingestion ──────────────────────────────────────────────────────────

  const addFiles = useCallback((files: File[]) => {
    const next: ConversionItem[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name}: exceeds 50 MB limit`);
        continue;
      }

      const inputFormat = detectFileFormat(file);
      if (!inputFormat) {
        toast.error(`${file.name}: unsupported format`);
        continue;
      }

      next.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        inputFormat,
        targetFormat: getDefaultOutputFormat(inputFormat),
        status: "idle",
        progress: 0,
      });
    }

    if (next.length > 0) setItems((prev) => [...prev, ...next]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
        e.target.value = "";
      }
    },
    [addFiles],
  );

  // ── Conversion ──────────────────────────────────────────────────────────────

  const handleConvert = useCallback(async (id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item || item.status === "converting") return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "converting", progress: 10, error: undefined }
          : i,
      ),
    );

    const timer = setInterval(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && i.status === "converting"
            ? { ...i, progress: Math.min(i.progress + 12, 85) }
            : i,
        ),
      );
    }, 350);

    try {
      const blob = await convertFileWithFallback(item.file, item.targetFormat);
      const ext = getOutputExtension(item.targetFormat);
      const baseName = item.file.name.replace(/\.[^/.]+$/, "");
      const filename = `${baseName}.${ext}`;
      const url = URL.createObjectURL(blob);

      clearInterval(timer);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "done",
                progress: 100,
                error: undefined,
                result: { blob, size: blob.size, url, filename },
              }
            : i,
        ),
      );
      toast.success(`${item.file.name} converted`);
    } catch (err) {
      clearInterval(timer);
      const message = err instanceof Error ? err.message : "Conversion failed";
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: "error", progress: 0, error: message }
            : i,
        ),
      );
      toast.error(`${item.file.name}: ${message}`);
    }
  }, []);

  const handleConvertAll = useCallback(async () => {
    const pending = itemsRef.current.filter(
      (i) => i.status === "idle" || i.status === "error",
    );
    for (const item of pending) {
      await handleConvert(item.id);
    }
  }, [handleConvert]);

  // ── Downloads ───────────────────────────────────────────────────────────────

  const handleDownload = useCallback((item: ConversionItem) => {
    if (!item.result) return;
    downloadBlob(item.result.blob, item.result.filename);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const done = itemsRef.current.filter(
      (i) => i.status === "done" && i.result,
    );
    if (done.length === 0) return;

    if (done.length === 1) {
      handleDownload(done[0]);
      return;
    }

    const zip = new JSZip();
    for (const item of done) {
      if (item.result) zip.file(item.result.filename, item.result.blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, "converted-images.zip");
    toast.success(`${done.length} files packaged as ZIP`);
  }, [handleDownload]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.result?.url) URL.revokeObjectURL(item.result.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    itemsRef.current.forEach((i) => {
      if (i.result?.url) URL.revokeObjectURL(i.result.url);
    });
    setItems([]);
  }, []);

  const setTargetFormat = useCallback((id: string, format: ImageFormat) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              targetFormat: format,
              status: "idle",
              progress: 0,
              result: undefined,
              error: undefined,
            }
          : i,
      ),
    );
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const hasPending = items.some(
    (i) => i.status === "idle" || i.status === "error",
  );
  const hasDone = items.some((i) => i.status === "done");
  const isAnyConverting = items.some((i) => i.status === "converting");

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Upload zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
        }
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${
          isDragging
            ? "border-red-500 bg-red-50"
            : "border-slate-300 bg-slate-50 hover:border-red-300 hover:bg-red-50/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FORMATS}
          multiple
          className="sr-only"
          onChange={handleFileInput}
          aria-hidden
        />

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            isDragging ? "bg-red-100" : "bg-white shadow"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        <div>
          <p className="text-base font-semibold text-slate-700">
            {isDragging ? "Drop files here" : "Drop files or click to browse"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            HEIC · HEIF · JPG · PNG · WebP · GIF · BMP · TIFF · AVIF
          </p>
          <p className="mt-1 text-xs text-slate-400">Max 50 MB per file</p>
        </div>
      </div>

      {/* File queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              onConvert={() => handleConvert(item.id)}
              onDownload={() => handleDownload(item)}
              onRemove={() => removeItem(item.id)}
              onFormatChange={(fmt) => setTargetFormat(item.id, fmt)}
            />
          ))}
        </div>
      )}

      {/* Actions bar */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {hasPending && (
            <button
              onClick={handleConvertAll}
              disabled={isAnyConverting}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnyConverting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Convert All
            </button>
          )}

          {hasDone && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <Download className="h-4 w-4" />
              Download All
            </button>
          )}

          <button
            onClick={clearAll}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
