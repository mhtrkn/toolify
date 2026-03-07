"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "ready" | "uploading" | "done" | "error";
  targetFormat?: string;
  rawFile?: File;
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

const FORMAT_GROUPS = [
  { label: "Image", formats: ["jpg", "png", "webp", "svg", "gif", "bmp", "tiff"] },
  { label: "Document", formats: ["pdf", "docx", "txt", "rtf", "odt"] },
  { label: "Audio", formats: ["mp3", "aac", "wav", "ogg", "flac"] },
  { label: "Video", formats: ["mp4", "webm", "avi", "mov", "mkv"] },
  { label: "Ebook", formats: ["epub", "mobi", "azw3", "fb2"] },
  { label: "Presentation", formats: ["ppt", "pptx", "odp"] },
] as const;

const FORMATS_FOR: Record<string, string[]> = {
  pdf: ["jpg", "png", "webp", "txt", "docx"],
  jpg: ["png", "webp", "svg", "gif", "bmp", "tiff", "pdf"],
  jpeg: ["png", "webp", "svg", "gif", "bmp", "tiff", "pdf"],
  png: ["jpg", "webp", "svg", "gif", "bmp", "tiff", "pdf"],
  webp: ["jpg", "png", "svg", "gif", "bmp", "tiff", "pdf"],
  gif: ["jpg", "png", "webp", "svg", "bmp", "tiff", "pdf"],
  svg: ["jpg", "png", "webp", "gif", "bmp", "tiff", "pdf"],
  bmp: ["jpg", "png", "webp", "svg", "gif", "tiff", "pdf"],
  tiff: ["jpg", "png", "webp", "svg", "gif", "bmp", "pdf"],
  heic: ["jpg", "png", "webp", "pdf"],
  // Video
  mp4: ["mp3", "aac", "wav", "webm", "avi", "mov"],
  mov: ["mp3", "aac", "wav", "mp4", "webm", "avi"],
  avi: ["mp3", "aac", "wav", "mp4", "webm", "mov"],
  webm: ["mp3", "aac", "wav", "mp4", "avi", "mov"],
  mkv: ["mp3", "aac", "wav", "mp4", "webm", "avi", "mov"],
  // Word
  docx: ["pdf", "txt", "rtf", "odt"],
  doc: ["pdf", "txt", "rtf", "odt"],
  // Excel
  xlsx: ["pdf", "txt"],
  xls: ["pdf", "txt"],
  // Ebook
  epub: ["pdf", "docx", "txt", "mobi"],
  mobi: ["pdf", "docx", "txt", "epub"],
  // Presentation
  ppt: ["pdf", "jpg", "png"],
  pptx: ["pdf", "jpg", "png"],
};

function getAllowedFormats(name: string, type: string): string[] {
  const ext = getExt(name);
  if (FORMATS_FOR[ext]) return FORMATS_FOR[ext];
  const t = type.toLowerCase();
  if (t === "application/pdf") return FORMATS_FOR.pdf;
  if (t.startsWith("image/")) return ["jpg", "png", "webp", "svg", "gif", "bmp", "tiff", "pdf"].filter((f) => f !== ext);
  if (t.startsWith("video/")) return ["mp3", "aac", "wav", "mp4", "webm", "avi", "mov"].filter((f) => f !== ext);
  return FORMAT_GROUPS.flatMap((g) => [...g.formats]);
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

function FileIcon({ name, type }: { name: string; type: string }) {
  const ext = getExt(name);
  const lType = type.toLowerCase();

  let bg = "bg-slate-100";
  let color = "text-slate-500";

  if (lType === "application/pdf" || ext === "pdf") {
    bg = "bg-red-50"; color = "text-red-600";
  } else if (lType.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "tiff"].includes(ext)) {
    bg = "bg-blue-50"; color = "text-blue-600";
  } else if (lType.startsWith("video/") || ["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) {
    bg = "bg-purple-50"; color = "text-purple-600";
  } else if (["docx", "doc", "odt", "rtf"].includes(ext)) {
    bg = "bg-indigo-50"; color = "text-indigo-600";
  } else if (["xlsx", "xls", "csv"].includes(ext)) {
    bg = "bg-green-50"; color = "text-green-600";
  } else if (["ppt", "pptx"].includes(ext)) {
    bg = "bg-orange-50"; color = "text-orange-600";
  } else if (["epub", "mobi", "azw3"].includes(ext)) {
    bg = "bg-amber-50"; color = "text-amber-600";
  }

  const label = (ext.toUpperCase().slice(0, 4)) || "FILE";

  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      <span className={`text-[10px] font-bold tracking-tight leading-none ${color}`}>{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: UploadedFile["status"] }) {
  const map = {
    ready: { dot: "bg-emerald-500", ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", label: "Ready" },
    uploading: { dot: "bg-blue-500 animate-pulse", ring: "ring-blue-200", bg: "bg-blue-50", text: "text-blue-700", label: "Converting" },
    done: { dot: "bg-blue-500", ring: "ring-blue-200", bg: "bg-blue-50", text: "text-blue-700", label: "Done" },
    error: { dot: "bg-red-500", ring: "ring-red-200", bg: "bg-red-50", text: "text-red-700", label: "Error" },
  } as const;

  const s = map[status];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </motion.span>
    </AnimatePresence>
  );
}

function FormatDropdown({ value, onChange, allowedFormats }: { value?: string; onChange: (fmt: string) => void; allowedFormats?: string[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const availableGroups = FORMAT_GROUPS.map((g) => ({
    label: g.label,
    formats: g.formats.filter((f) => !allowedFormats || allowedFormats.includes(f)),
  })).filter((g) => g.formats.length > 0);

  const [activeCategory, setActiveCategory] = useState<string>(() => availableGroups[0]?.label ?? "");

  const effectiveCategory = availableGroups.find((g) => g.label === activeCategory)?.label
    ?? availableGroups[0]?.label
    ?? "";
  const activeCategoryFormats = availableGroups.find((g) => g.label === effectiveCategory)?.formats ?? [];

  const searchResults = search
    ? availableGroups.map((g) => ({
      label: g.label,
      formats: g.formats.filter((f) => f.includes(search.toLowerCase())),
    })).filter((g) => g.formats.length > 0)
    : [];

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

  const select = (fmt: string) => { onChange(fmt); setOpen(false); setSearch(""); };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex min-w-29 items-center justify-between gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        <span className={value ? "text-slate-800 uppercase" : "text-slate-400"}>
          {value ? `${value}` : "Select format"}
        </span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
            style={{ minWidth: 240 }}
          >
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                placeholder="Search format…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {search ? (
              <div className="max-h-52 overflow-y-auto p-1">
                {searchResults.length > 0 ? (
                  searchResults.map((group) => (
                    <div key={group.label}>
                      <p className="px-2 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 pb-1">
                        {group.formats.map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => select(fmt)}
                            className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide transition-colors ${value === fmt
                              ? "bg-red-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-5 text-center text-xs text-slate-400">No formats found</p>
                )}
              </div>
            ) : (
              <div className="flex">
                <div className="w-26 shrink-0 border-r border-slate-100">
                  {availableGroups.map((g) => (
                    <button
                      key={g.label}
                      onMouseEnter={() => setActiveCategory(g.label)}
                      onClick={() => setActiveCategory(g.label)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors ${activeCategory === g.label
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                    >
                      <span>{g.label}</span>
                      {activeCategory === g.label && (
                        <svg className="h-3 w-3 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 200 }}>
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeCategoryFormats.map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => select(fmt)}
                        className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide transition-colors ${value === fmt
                          ? "bg-red-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  return (
    <div
      className={`w-full rounded-2xl border bg-white shadow-sm transition-colors duration-150 ${isDragging ? "border-red-400 bg-red-50/20" : "border-slate-200 shadow-slate-100"
        }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >

      <div className="hidden rounded-t-2xl grid-cols-[36px_1fr_72px_88px_168px_36px] items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 sm:grid">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Type</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">File</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Size</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Status</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Convert to</span>
        <div />
      </div>

      <AnimatePresence initial={false}>
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={`
                group
                grid grid-cols-[36px_1fr_auto_36px] items-center gap-3 px-4 py-3
                transition-colors duration-100 hover:bg-slate-50/80
                sm:grid-cols-[36px_1fr_72px_88px_168px_36px] sm:gap-4
                ${index > 0 ? "border-t border-slate-100" : ""}
              `}
            >
              <FileIcon name={file.name} type={file.type} />

              <div className="min-w-0">
                <p
                  title={file.name}
                  className="truncate text-sm font-medium text-slate-800 leading-snug"
                >
                  {file.name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 sm:hidden">
                  <span className="text-[11px] text-slate-400">{formatBytes(file.size)}</span>
                  <StatusBadge status={file.status} />
                </div>
              </div>

              <span className="hidden whitespace-nowrap text-xs text-slate-400 sm:block">
                {formatBytes(file.size)}
              </span>

              <motion.div layout className="hidden sm:flex items-center justify-center">
                <StatusBadge status={file.status} />
              </motion.div>

              {/* Format dropdown + convert button */}
              <div className="hidden sm:flex items-center justify-center gap-1.5">
                <FormatDropdown value={file.targetFormat} onChange={(fmt) => onFormatChange(file.id, fmt)} allowedFormats={getAllowedFormats(file.name, file.type)} />
              </div>

              <button
                onClick={() => onRemove(file.id)}
                aria-label="Remove file"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Mobile: format + convert */}
              <div className="col-span-4 -mt-1 flex items-center gap-2 sm:hidden">
                <div className="flex-1">
                  <FormatDropdown value={file.targetFormat} onChange={(fmt) => onFormatChange(file.id, fmt)} allowedFormats={getAllowedFormats(file.name, file.type)} />
                </div>
                <AnimatePresence>
                  {file.targetFormat && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => onConvert?.(file.id)}
                      disabled={file.status === "uploading"}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {file.status === "uploading" ? (
                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      Convert
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-between rounded-b-2xl border-t border-slate-100 bg-slate-50/50 px-4 py-2">
        <span className="text-[11px] text-slate-400">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          {onAddMore && (
            <button
              onClick={onAddMore}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add more files
            </button>
          )}
          <AnimatePresence>
            {files.some((f) => f.targetFormat && f.status === "ready") && onConvert && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={async () => {
                  const toConvert = files.filter((f) => f.targetFormat && f.status === "ready");
                  for (const f of toConvert) {
                    await onConvert(f.id);
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
