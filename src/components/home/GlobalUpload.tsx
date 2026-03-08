"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import FileUploadTable, { UploadedFile } from "./FileUploadTable";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie/success confetti.json";
import {
  detectFileCategory,
  isSupportedFile,
} from "@/lib/file-tools/fileTypeDetector";
import { selectConversionEngine } from "@/lib/file-tools/conversionRouter";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomId() {
  return Math.random().toString(36).slice(2, 10);
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

function isSupported(file: File): boolean {
  return isSupportedFile(file);
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  count,
  errorCount,
  onConvertMore,
}: {
  count: number;
  errorCount: number;
  onConvertMore: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white px-8 pt-8 pb-12 text-center shadow-sm"
    >
      <div className="flex-center h-40 aspect-square -my-10">
        <Lottie animationData={animationData} loop />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.25 }}
      >
        <h3 className="text-2xl font-bold text-slate-800">All done!</h3>
        <p className="mt-1.5 text-sm text-slate-500">
          {count} file{count !== 1 ? "s" : ""} converted and downloaded
          successfully
          {errorCount > 0 && (
            <span className="ml-1 text-red-400">· {errorCount} failed</span>
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.25 }}
        className="flex w-full max-w-xs flex-col gap-2.5"
      >
        <button
          onClick={onConvertMore}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Convert more files
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlobalUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [unsupportedNames, setUnsupportedNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming);

    setFiles((prev) => {
      const good: UploadedFile[] = [];
      const bad: string[] = [];
      const dupes: string[] = [];

      const existingKeys = new Set(prev.map((f) => `${f.name}::${f.type}`));

      list.forEach((file) => {
        const key = `${file.name}::${file.type}`;
        if (!isSupported(file)) {
          bad.push(file.name);
        } else if (existingKeys.has(key)) {
          dupes.push(file.name);
        } else {
          existingKeys.add(key);
          good.push({
            id: randomId(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: "ready",
            rawFile: file,
            category: detectFileCategory(file),
          });
        }
      });

      dupes.forEach((name) => {
        toast.warning(`"${name}" is already in the list`, {
          id: `dupe-${name}`,
          description: "You can select a different output format for it below.",
          duration: 4000,
        });
      });

      if (bad.length) {
        setTimeout(() => {
          setUnsupportedNames(bad);
          setTimeout(() => setUnsupportedNames([]), 3500);
        }, 0);
      }

      return good.length ? [...prev, ...good] : prev;
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // only fire when leaving the zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFormat = useCallback((id: string, format: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        // Reset status so the download button re-appears after error or done
        const resetStatus =
          f.status === "error" || f.status === "done" ? "ready" : f.status;
        return { ...f, targetFormat: format, status: resetStatus };
      }),
    );
  }, []);

  const handleConvert = useCallback(
    async (fileId: string) => {
      const entry = files.find((f) => f.id === fileId);
      if (!entry?.rawFile || !entry.targetFormat) return;

      const { rawFile, targetFormat, name } = entry;
      const fmt = targetFormat.toLowerCase();
      const base = name.replace(/\.[^/.]+$/, "");

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)),
      );

      try {
        const { engine } = selectConversionEngine(name, rawFile.type);

        if (!engine) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "error" } : f,
            ),
          );
          toast.error(
            "This conversion is not supported for the selected file and format.",
          );
          return;
        }

        const result = await engine.convert(rawFile, fmt);

        if (Array.isArray(result)) {
          // Multi-file result (e.g. multi-page PDF → images): download each file
          for (const { blob, filename } of result) {
            triggerDownload(blob, filename);
          }
        } else {
          const downloadExt = fmt === "jpeg" ? "jpg" : fmt;
          triggerDownload(result, `${base}.${downloadExt}`);
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "done" } : f,
          ),
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "error" } : f)),
        );
        toast.error("Conversion failed. Please try again.");
      }
    },
    [files],
  );

  const hasFiles = files.length > 0;
  const showSuccess =
    files.length > 0 &&
    files.every((f) => f.status === "done" || f.status === "error") &&
    files.some((f) => f.status === "done");
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  const handleConvertMore = useCallback(() => {
    setFiles([]);
  }, []);

  useEffect(() => {
    const handleGlobalDrop = (e: Event) => {
      const customEvent = e as CustomEvent<FileList>;
      const droppedFiles = customEvent.detail;
      if (droppedFiles?.length) {
        addFiles(droppedFiles);
      }
    };

    window.addEventListener("global-files-dropped", handleGlobalDrop);

    return () => {
      window.removeEventListener("global-files-dropped", handleGlobalDrop);
    };
  }, [addFiles]);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleInputChange}
        accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.heic,.heif,.avif,.svg,.mp4,.mov,.avi,.webm,.mkv,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt"
      />

      {/* Unsupported file warning */}
      <AnimatePresence>
        {unsupportedNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl max-w-2xl w-full mx-auto border border-orange-200 bg-orange-50 px-4 py-3"
          >
            <p className="text-xs font-semibold text-orange-700">
              Unsupported file{unsupportedNames.length > 1 ? "s" : ""} skipped:
            </p>
            <p className="mt-0.5 truncate text-xs text-orange-500">
              {unsupportedNames.join(", ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone / File table / Success — single AnimatePresence to prevent layout shift */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!hasFiles && (
          <motion.div
            key="dropzone"
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
              className={`cursor-pointer rounded-3xl max-w-2xl mx-auto border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
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

        {hasFiles && showSuccess && (
          <SuccessScreen
            key="success"
            count={doneCount}
            errorCount={errorCount}
            onConvertMore={handleConvertMore}
          />
        )}

        {hasFiles && !showSuccess && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-2"
          >
            <FileUploadTable
              files={files}
              onRemove={removeFile}
              onFormatChange={updateFormat}
              onConvert={handleConvert}
              onAddMore={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              isDragging={isDragging}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
