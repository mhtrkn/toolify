"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie/success confetti.json";
import {
  detectFileCategory,
  isSupportedFile,
  getFileExtension,
} from "@/lib/file-tools/fileTypeDetector";
import { selectConversionEngine } from "@/lib/file-tools/conversionRouter";
import { getCategoryConfig } from "@/lib/file-tools/toolRegistry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileData {
  name: string;
  size: number;
  type: string;
  rawFile: File;
}

type ConvStatus = "ready" | "uploading" | "done" | "error";

// ─── Stepper Header ───────────────────────────────────────────────────────────

const STEP_DEFS = [
  {
    id: 1,
    label: "Select File",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Choose Format",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Convert",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

function StepConnector({ filled }: { filled: boolean }) {
  return (
    <div className="relative flex-1 mx-1 h-0.5 bg-slate-200 overflow-hidden mb-5">
      <motion.div
        className="absolute inset-y-0 left-0 bg-red-600"
        animate={{ scaleX: filled ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ width: "100%", transformOrigin: "left" }}
      />
    </div>
  );
}

function StepperHeader({ step }: { step: number }) {
  return (
    <div className="max-w-3xl mx-auto w-full mb-2">
      {/* Top row: circles + connectors aligned */}
      <div className="flex items-center">
        {STEP_DEFS.map((s, i) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <motion.div
                  animate={{
                    backgroundColor:
                      isActive || isCompleted ? "#dc2626" : "#e2e8f0",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <motion.span
                    animate={{
                      color: isCompleted || isActive ? "#ffffff" : "#94a3b8",
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </motion.span>
                </motion.div>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    isActive || isCompleted ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {/* Connector after every step except the last */}
              {i < STEP_DEFS.length - 1 && (
                <StepConnector filled={step > s.id} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onConvertMore }: { onConvertMore: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex flex-col items-center gap-5 rounded-3xl border border-slate-100 bg-white px-8 pt-6 pb-10 text-center shadow-sm max-w-3xl mx-auto w-full overflow-hidden"
    >
      {/* Subtle radial glow behind animation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Lottie */}
      <div className="relative z-10 w-36 h-36 -my-4">
        <Lottie animationData={animationData} loop />
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-1"
      >
        <h3 className="text-2xl font-bold text-slate-800">Conversion complete!</h3>
        <p className="text-sm text-slate-400">
          Your file has been downloaded successfully.
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        className="w-16 h-px bg-slate-200 origin-center"
      />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="relative z-10 flex flex-col sm:flex-row gap-2.5 w-full max-w-sm"
      >
        <button
          onClick={onConvertMore}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-100 transition-all hover:bg-red-700 active:scale-[0.98]"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Convert another file
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlobalUpload() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<FileData | null>(null);
  const [format, setFormat] = useState("");
  const [convStatus, setConvStatus] = useState<ConvStatus>("ready");
  const [isDragging, setIsDragging] = useState(false);
  const [unsupportedName, setUnsupportedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFile = useCallback((f: File) => {
    if (!isSupportedFile(f)) {
      setUnsupportedName(f.name);
      setTimeout(() => setUnsupportedName(null), 3500);
      return;
    }
    setFile({ name: f.name, size: f.size, type: f.type, rawFile: f });
    setFormat("");
    setConvStatus("ready");
    setStep(2);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) addFile(f);
    },
    [addFile],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      addFile(f);
      e.target.value = "";
    }
  };

  const handleFormatChange = (fmt: string) => {
    setFormat(fmt);
    setStep(fmt ? 3 : 2);
    if (convStatus === "error") setConvStatus("ready");
  };

  const handleClear = () => {
    setFile(null);
    setFormat("");
    setConvStatus("ready");
    setStep(1);
  };

  const handleConvert = async () => {
    if (!file || !format || step !== 3 || convStatus === "uploading") return;
    setConvStatus("uploading");
    try {
      const { engine } = selectConversionEngine(file.name, file.type);
      if (!engine) {
        setConvStatus("error");
        toast.error("This conversion is not supported.");
        return;
      }
      const result = await engine.convert(file.rawFile, format);
      const base = file.name.replace(/\.[^/.]+$/, "");
      const ext = format === "jpeg" ? "jpg" : format;
      if (Array.isArray(result)) {
        for (const { blob, filename } of result)
          triggerDownload(blob, filename);
      } else {
        triggerDownload(result, `${base}.${ext}`);
      }
      setConvStatus("done");
    } catch {
      setConvStatus("error");
      toast.error("Conversion failed. Please try again.");
    }
  };

  // Available formats for the selected file (excluding its source format)
  const availableFormats = file
    ? getCategoryConfig(detectFileCategory(file.rawFile)).formats.filter(
        (f) => f !== getFileExtension(file.name),
      )
    : [];

  const showSuccess = convStatus === "done";

  useEffect(() => {
    const handleGlobalDrop = (e: Event) => {
      const customEvent = e as CustomEvent<FileList>;
      const first = customEvent.detail?.[0];
      if (first) addFile(first);
    };
    window.addEventListener("global-files-dropped", handleGlobalDrop);
    return () =>
      window.removeEventListener("global-files-dropped", handleGlobalDrop);
  }, [addFile]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Stepper header */}
      <StepperHeader step={showSuccess ? 4 : step} />

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.heic,.heif,.avif,.svg,.mp4,.mov,.avi,.webm,.mkv,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt"
      />

      {/* Unsupported file warning */}
      <AnimatePresence>
        {unsupportedName && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl max-w-2xl w-full mx-auto border border-orange-200 bg-orange-50 px-4 py-3"
          >
            <p className="text-xs font-semibold text-orange-700">
              Unsupported file skipped:
            </p>
            <p className="mt-0.5 truncate text-xs text-orange-500">
              {unsupportedName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        {/* ── Success ── */}
        {showSuccess && (
          <SuccessScreen key="success" onConvertMore={handleClear} />
        )}

        {/* ── Step 1: Drop zone ── */}
        {!showSuccess && step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-3xl max-w-3xl mx-auto border-2 border-dashed px-6 py-15 text-center transition-all duration-200 ${
                isDragging
                  ? "border-red-400 bg-red-50 scale-[1.01]"
                  : "border-slate-300 bg-white hover:border-red-300"
              }`}
            >
              <div className="pointer-events-none flex flex-col items-center gap-3">
                <div className="flex aspect-square w-14 items-center justify-center rounded-2xl bg-red-50/50">
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
                <div>
                  <p className="text-lg text-red-600">
                    Click, or drop your files here
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Multiple content formats supported
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Steps 2 & 3: File card + format + convert ── */}
        {!showSuccess && (step === 2 || step === 3) && (
          <motion.div
            key="step23"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="max-w-3xl mx-auto w-full flex flex-col gap-4"
          >
            {/* File card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* File row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <span className="text-[11px] font-extrabold tracking-tight leading-none">
                    {getFileExtension(file!.name).toUpperCase().slice(0, 4) ||
                      "FILE"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate font-medium text-slate-800 text-sm"
                    title={file!.name}
                  >
                    {file!.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatBytes(file!.size)}
                  </p>
                </div>
                {/* Clear / remove button */}
                <button
                  onClick={handleClear}
                  title="Remove file"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Format select */}
              <div className="border-t border-slate-100 px-5 py-4">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Convert to
                </label>
                <Select
                  value={format || undefined}
                  onValueChange={(v) => handleFormatChange(v)}
                >
                  <SelectTrigger className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-800">
                    <SelectValue placeholder="Choose output format…" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((fmt) => (
                      <SelectItem key={fmt} value={fmt}>
                        {fmt.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Convert button */}
            <motion.button
              whileTap={
                step === 3 && convStatus !== "uploading" ? { scale: 0.98 } : {}
              }
              onClick={handleConvert}
              disabled={step < 3 || convStatus === "uploading"}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                step === 3
                  ? convStatus === "uploading"
                    ? "cursor-not-allowed bg-red-400 text-white"
                    : "cursor-pointer bg-red-600 text-white shadow-md shadow-red-200 hover:bg-red-700 active:bg-red-800"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              {convStatus === "uploading" ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Converting…
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Convert Now
                </>
              )}
            </motion.button>

            {/* Error state */}
            <AnimatePresence>
              {convStatus === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs text-red-500"
                >
                  Conversion failed.{" "}
                  <button
                    onClick={() => setConvStatus("ready")}
                    className="underline hover:text-red-700"
                  >
                    Try again
                  </button>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-4 text-[11px] mt-2">
        <div className="flex items-center text-gray-400">
          <svg
            className="w-4 h-4 mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          256-bit SSL Encryption
        </div>
        <div className="flex items-center text-gray-400">
          <svg
            className="w-4 h-4 mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          No data sharing
        </div>
        <div className="flex items-center text-gray-400">
          <svg
            className="w-4 h-4 mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Delete after download
        </div>
      </div>
    </div>
  );
}
