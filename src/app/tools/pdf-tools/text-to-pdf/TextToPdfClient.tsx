"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";
import type { FontName, PageSize, Theme } from "@/lib/textToPdf";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_MB = 10;

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4 (210×297 mm)" },
  { value: "letter", label: "US Letter (216×279 mm)" },
];

const FONTS: { value: FontName; label: string }[] = [
  { value: "helvetica", label: "Helvetica" },
  { value: "times", label: "Times New Roman" },
  { value: "courier", label: "Courier" },
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24];

const MARGINS = [10, 15, 20, 25, 30];

const LINE_SPACINGS: { value: string; label: string }[] = [
  { value: "1", label: "Single (1.0)" },
  { value: "1.15", label: "1.15" },
  { value: "1.5", label: "1.5" },
  { value: "2", label: "Double (2.0)" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function TextToPdfClient() {
  const [text, setText] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [font, setFont] = useState<FontName>("helvetica");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);
  const [lineSpacing, setLineSpacing] = useState(1.15);
  const [theme, setTheme] = useState<Theme>("light");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pageNumbers, setPageNumbers] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File upload ────────────────────────────────────────────────────────────

  const handleTxtUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".txt") && file.type !== "text/plain") {
        setError("Only .txt files are supported.");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${MAX_FILE_MB} MB.`);
        e.target.value = "";
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setText((ev.target?.result as string) ?? "");
        toast.success(`Loaded ${file.name} (${formatBytes(file.size)})`);
      };
      reader.readAsText(file, "UTF-8");
      e.target.value = ""; // allow re-upload of same file
    },
    []
  );

  // ── PDF generation ─────────────────────────────────────────────────────────

  const generate = async () => {
    if (!text.trim()) {
      setError("Please enter some text or upload a .txt file.");
      return;
    }

    setError(null);
    setProcessing(true);
    setProgress(15);

    try {
      const { generateTextPdf } = await import("@/lib/textToPdf");
      setProgress(40);

      const pdf = await generateTextPdf({
        text,
        pageSize,
        fontSize,
        margin,
        lineSpacing,
        font,
        theme,
        headerText: headerText.trim() || undefined,
        footerText: footerText.trim() || undefined,
        pageNumbers,
      });

      setProgress(90);
      pdf.save("document.pdf");
      setProgress(100);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      const msg = "Failed to generate PDF. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setText("");
    setError(null);
    setProgress(0);
  };

  // ── Derived stats ──────────────────────────────────────────────────────────

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">🔒</span>
        <span>
          Your text is processed entirely in your browser. No data is uploaded
          to any server.
        </span>
      </div>

      {/* ── PDF Options ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
        <p className="text-sm font-semibold text-slate-700">PDF Options</p>

        {/* Row 1 — core options */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Page Size
            </label>
            <Select
              value={pageSize}
              onValueChange={(v) => setPageSize(v as PageSize)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Font</label>
            <Select
              value={font}
              onValueChange={(v) => setFont(v as FontName)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Font Size
            </label>
            <Select
              value={String(fontSize)}
              onValueChange={(v) => setFontSize(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} pt
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Margin</label>
            <Select
              value={String(margin)}
              onValueChange={(v) => setMargin(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARGINS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} mm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Line Spacing
            </label>
            <Select
              value={String(lineSpacing)}
              onValueChange={(v) => setLineSpacing(Number(v))}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LINE_SPACINGS.map((ls) => (
                  <SelectItem key={ls.value} value={ls.value}>
                    {ls.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Theme</label>
            <Select
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">☀️ Light</SelectItem>
                <SelectItem value="dark">🌙 Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2 — optional header / footer / page numbers */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Optional
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">
                Header Text
              </label>
              <Input
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="e.g. My Document"
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">
                Footer Text
              </label>
              <Input
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Confidential"
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                id="page-numbers"
                checked={pageNumbers}
                onCheckedChange={(c) => setPageNumbers(c as boolean)}
              />
              <label
                htmlFor="page-numbers"
                className="cursor-pointer select-none text-sm font-medium text-slate-700"
              >
                Page Numbers
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Text editor ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Text Editor
            </span>
            {charCount > 0 && (
              <span className="text-xs text-slate-400">
                {wordCount.toLocaleString()} words ·{" "}
                {charCount.toLocaleString()} chars
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Upload .txt */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload .txt
            </button>

            {charCount > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Editor area */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none"
          rows={18}
          placeholder="Start typing here, or click 'Upload .txt' to load a file…"
          spellCheck
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          className="sr-only"
          onChange={handleTxtUpload}
          aria-label="Upload text file"
        />
      </div>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* ── Processing state ─────────────────────────────────────────────── */}
      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Generating PDF…" />
          <div className="mt-4">
            <ProgressBar progress={progress} label="Processing" />
          </div>
        </div>
      )}

      {/* ── Generate button ──────────────────────────────────────────────── */}
      {!processing && (
        <button
          type="button"
          onClick={generate}
          disabled={!text.trim()}
          className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Download PDF
        </button>
      )}
    </div>
  );
}
