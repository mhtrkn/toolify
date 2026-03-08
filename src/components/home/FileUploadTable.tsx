"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  detectCategoryFromNameAndType,
  type FileCategory,
} from "@/lib/file-tools/fileTypeDetector";
import { getCategoryConfig } from "@/lib/file-tools/toolRegistry";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "ready" | "uploading" | "done" | "error";
  targetFormat?: string;
  rawFile?: File;
  category?: FileCategory;
}

interface FileUploadTableProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
  onFormatChange: (fileId: string, format: string) => void;
  onConvert?: (fileId: string) => Promise<void> | void;
  onAddMore?: () => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllowedFormats(name: string, type: string): string[] {
  const category = detectCategoryFromNameAndType(name, type);
  const config = getCategoryConfig(category);
  return config.formats;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

// ─── Format config (monochrome — site palette) ────────────────────────────────

type FormatMeta = { label: string; icon: React.ReactNode };

const FORMAT_META: Record<string, FormatMeta> = {
  jpg: {
    label: "JPG",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15l-5-5L5 21"
        />
      </svg>
    ),
  },
  png: {
    label: "PNG",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="3 2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15l-5-5L5 21"
        />
      </svg>
    ),
  },
  webp: {
    label: "WEBP",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 12h7M12 8.5v7"
        />
      </svg>
    ),
  },
  pdf: {
    label: "PDF",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2v6h6M9 13h6M9 17h4"
        />
      </svg>
    ),
  },
  docx: {
    label: "DOCX",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2v6h6M9 11h6M9 15h6M9 19h4"
        />
      </svg>
    ),
  },
  txt: {
    label: "TXT",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7h16M4 12h10M4 17h7"
        />
      </svg>
    ),
  },
  svg: {
    label: "SVG",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h8M12 8v8"
        />
      </svg>
    ),
  },
  mp3: {
    label: "MP3",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 18V5l12-2v13"
        />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
};

const ALL_FORMATS = ["jpg", "png", "webp", "svg", "pdf", "docx", "txt", "mp3"];

// ─── FileIcon ─────────────────────────────────────────────────────────────────

function FileIcon({ name, type }: { name: string; type: string }) {
  const ext = getExt(name);
  const lType = type.toLowerCase();

  let color = "text-slate-500 bg-slate-100";
  if (lType === "application/pdf" || ext === "pdf")
    color = "text-red-600 bg-red-50";
  else if (
    lType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff"].includes(ext)
  )
    color = "text-slate-600 bg-slate-100";
  else if (
    lType.startsWith("video/") ||
    ["mp4", "mov", "avi", "webm", "mkv"].includes(ext)
  )
    color = "text-slate-600 bg-slate-100";
  else if (["docx", "doc"].includes(ext)) color = "text-red-600 bg-red-50";
  else if (["xlsx", "xls"].includes(ext)) color = "text-slate-600 bg-slate-100";

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}
    >
      <span className="text-[9px] font-extrabold tracking-tight leading-none">
        {ext.toUpperCase().slice(0, 4) || "FILE"}
      </span>
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UploadedFile["status"] }) {
  const map = {
    ready: {
      cls: "bg-green-50/50 text-green-500 ring-green-200",
      label: "Ready",
    },
    uploading: {
      cls: "bg-amber-50/50 text-amber-500 ring-amber-200",
      label: "Converting",
    },
    done: {
      cls: "bg-emerald-50/50 text-emerald-500 ring-emerald-200",
      label: "Done",
    },
    error: {
      cls: "bg-red-50/50 text-red-500 ring-red-200",
      label: "Failed",
    },
  } as const;

  const s = map[status];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 3 }}
        transition={{ duration: 0.15 }}
        className={`inline-flex w-fit mx-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-center py-0.5 text-[10px] font-semibold ring-1 ${s.cls}`}
      >
        {s.label}
      </motion.span>
    </AnimatePresence>
  );
}

// ─── FormatDropdown ───────────────────────────────────────────────────────────

function FormatDropdown({
  value,
  onChange,
  allowedFormats,
}: {
  value?: string;
  onChange: (fmt: string) => void;
  allowedFormats?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const formats = ALL_FORMATS.filter(
    (f) => !allowedFormats || allowedFormats.includes(f),
  );
  const filtered = search
    ? formats.filter((f) => f.includes(search.toLowerCase()))
    : formats;

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const select = (fmt: string) => {
    onChange(fmt);
    setOpen(false);
    setSearch("");
  };
  const selectedMeta = value ? FORMAT_META[value] : null;

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300
          ${
            selectedMeta
              ? "border-red-200 bg-red-50 text-red-600 shadow-sm"
              : "border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50/40 hover:text-red-500 shadow-sm"
          }`}
      >
        {selectedMeta ? (
          <>
            <span className="text-red-600">{selectedMeta.icon}</span>
            <span className="font-semibold tracking-wide">
              {selectedMeta.label}
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 7h12M8 12h8M8 17h4"
              />
            </svg>
            <span>Convert to…</span>
          </>
        )}
        <svg
          className={`ml-auto h-3 w-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${selectedMeta ? "text-red-400" : "text-slate-300"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-50 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/80"
          >
            {/* Search */}
            <div className="p-2 pb-1.5">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 ring-1 ring-inset ring-slate-100">
                <svg
                  className="h-3 w-3 shrink-0 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  autoFocus
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Format list */}
            <div className="px-1.5 pb-2">
              {filtered.length === 0 ? (
                <p className="py-5 text-center text-xs text-slate-400">
                  No formats found
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {filtered.map((fmt) => {
                    const meta = FORMAT_META[fmt];
                    if (!meta) return null;
                    const isActive = value === fmt;
                    return (
                      <motion.button
                        key={fmt}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => select(fmt)}
                        className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors duration-100
                          ${
                            isActive
                              ? "bg-red-500 text-white shadow-sm shadow-red-200"
                              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
                          }`}
                      >
                        <span
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-red-600"
                          }
                        >
                          {meta.icon}
                        </span>
                        <span className="tracking-wide">{meta.label}</span>
                        {isActive && (
                          <svg
                            className="ml-auto h-3 w-3 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ConvertButton ────────────────────────────────────────────────────────────

function ConvertButton({
  status,
  onClick,
}: {
  status: UploadedFile["status"];
  onClick: () => void;
}) {
  const isConverting = status === "uploading";
  const isDone = status === "done";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={isConverting || isDone}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed
        ${
          isDone
            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
            : isConverting
              ? "bg-red-50 text-red-400 ring-1 ring-red-100"
              : "bg-red-500 text-white shadow-sm shadow-red-200 hover:bg-red-600"
        }`}
    >
      {isConverting ? (
        <>
          <svg
            className="h-3.5 w-3.5 animate-spin"
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
          Converting
        </>
      ) : isDone ? (
        <>
          <svg
            className="h-3.5 w-3.5"
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
          Done
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Convert
        </>
      )}
    </motion.button>
  );
}

// ─── FileUploadTable ──────────────────────────────────────────────────────────

export default function FileUploadTable({
  files,
  onRemove,
  onFormatChange,
  onConvert,
  onAddMore,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging,
}: FileUploadTableProps) {
  if (files.length === 0) return null;

  const hasReady = files.some(
    (f) => f.targetFormat && (f.status === "ready" || f.status === "error"),
  );

  return (
    <div
      className={`w-full rounded-2xl border bg-white shadow-sm transition-colors duration-200
        ${isDragging ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Desktop header */}
      <div className="hidden sm:grid grid-cols-[40px_1fr_72px_90px_160px_40px] rounded-t-2xl items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        {["", "File", "Size", "Status", "Convert to", ""].map((h, i) => (
          <span
            key={i}
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest text-slate-400",
            )}
          >
            {h}
          </span>
        ))}
      </div>

      {/* File rows */}
      <AnimatePresence initial={false}>
        {files.map((file, index) => {
          const sourceExt = getExt(file.name);
          const allowed = getAllowedFormats(file.name, file.type).filter(
            (f) => f !== sourceExt,
          );

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={index > 0 ? "border-t border-slate-100" : ""}
            >
              {/* ── Desktop row ── */}
              <div className="hidden sm:grid grid-cols-[40px_1fr_72px_90px_160px_40px] items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-50/60">
                <FileIcon name={file.name} type={file.type} />

                <div className="min-w-0">
                  <p
                    className="truncate text-sm text-left font-medium text-slate-800"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </div>

                <span className="text-xs text-slate-400 tabular-nums">
                  {formatBytes(file.size)}
                </span>

                <StatusBadge status={file.status} />

                <FormatDropdown
                  value={file.targetFormat}
                  onChange={(fmt) => onFormatChange(file.id, fmt)}
                  allowedFormats={allowed}
                />

                <button
                  onClick={() => onRemove(file.id)}
                  aria-label="Remove"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg
                    className="h-3.5 w-3.5"
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

              {/* ── Mobile card ── */}
              <div className="flex sm:hidden flex-col gap-2.5 px-3 py-3">
                {/* Top row: icon + name/meta + remove */}
                <div className="flex items-start gap-2.5">
                  <FileIcon name={file.name} type={file.type} />
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate text-left md:text-center text-sm font-medium text-slate-800 leading-snug"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {formatBytes(file.size)}
                      </span>
                      <StatusBadge status={file.status} />
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(file.id)}
                    aria-label="Remove"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="h-3.5 w-3.5"
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

                {/* Bottom row: dropdown + convert */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <FormatDropdown
                      value={file.targetFormat}
                      onChange={(fmt) => onFormatChange(file.id, fmt)}
                      allowedFormats={allowed}
                    />
                  </div>
                  <AnimatePresence>
                    {file.targetFormat && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ConvertButton
                          status={file.status}
                          onClick={() => onConvert?.(file.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <span className="text-[11px] text-slate-400">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </span>

        <div className="flex items-center gap-2">
          {onAddMore && (
            <button
              onClick={onAddMore}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <svg
                className="h-3.5 w-3.5"
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
              Add more
            </button>
          )}

          <AnimatePresence>
            {hasReady && onConvert && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={async () => {
                  const toConvert = files.filter(
                    (f) =>
                      f.targetFormat &&
                      (f.status === "ready" || f.status === "error"),
                  );
                  for (const f of toConvert) await onConvert(f.id);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-red-200 transition-colors hover:bg-red-600"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Convert all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
