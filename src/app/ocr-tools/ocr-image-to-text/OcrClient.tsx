"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { generateDocxBlob } from "@/lib/docx-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "idle" | "ready" | "processing" | "done" | "error";

interface WordData {
  text: string;
  confidence: number;
}

interface OcrResult {
  file: File;
  previewUrl: string;
  text: string;
  confidence: number;
  lowConfWords: WordData[];
}

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "auto", label: "Auto Detect (7 languages)" },
  { code: "eng", label: "English" },
  { code: "tur", label: "Turkish" },
  { code: "deu", label: "German" },
  { code: "fra", label: "French" },
  { code: "spa", label: "Spanish" },
  { code: "ara", label: "Arabic" },
  { code: "rus", label: "Russian" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "chi_tra", label: "Chinese (Traditional)" },
  { code: "jpn", label: "Japanese" },
  { code: "kor", label: "Korean" },
  { code: "por", label: "Portuguese" },
  { code: "ita", label: "Italian" },
];

// Running OCR with combined language pack enables Tesseract auto-detection
const AUTO_LANG = "eng+tur+deu+fra+spa+ara+rus";

// ── Component ─────────────────────────────────────────────────────────────────
export default function OcrClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState("eng");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [results, setResults] = useState<OcrResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showLowConf, setShowLowConf] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFiles = (incoming: File[]) => {
    setFiles(incoming);
    setStatus("ready");
    setResults([]);
    setError(null);
    setProgress(0);
  };

  const runOcr = async () => {
    if (!files.length) return;
    setStatus("processing");
    setError(null);
    const lang = language === "auto" ? AUTO_LANG : language;
    const out: OcrResult[] = [];

    try {
      const { recognize } = await import("tesseract.js");

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setProgressLabel(`Recognizing "${f.name}" (${i + 1} / ${files.length})`);
        const previewUrl = URL.createObjectURL(f);

        const { data } = await recognize(f, lang, {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === "recognizing text") {
              const base = (i / files.length) * 100;
              setProgress(Math.round(base + (m.progress * 100) / files.length));
            }
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawWords: any[] = (data as any).words ?? [];
        const lowConfWords: WordData[] = rawWords
          .filter((w: { confidence: number; text: string }) => w.confidence < 70 && w.text.trim().length > 0)
          .map((w: { confidence: number; text: string }) => ({ text: w.text, confidence: w.confidence }));

        out.push({
          file: f,
          previewUrl,
          text: data.text.trim(),
          confidence: data.confidence,
          lowConfWords,
        });
      }

      setResults(out);
      setProgress(100);
      setStatus("done");
      setActiveIdx(0);
      toast.success(
        files.length === 1
          ? `${out[0].text.length.toLocaleString()} characters extracted`
          : `${files.length} files processed successfully`
      );
    } catch (err) {
      console.error(err);
      const msg =
        "OCR failed. Please try a higher-resolution image (300 DPI recommended).";
      setError(msg);
      toast.error("OCR Failed", { description: msg });
      setStatus("error");
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("Copied to clipboard");
  };

  const downloadTxt = (r: OcrResult) => {
    const blob = new Blob([r.text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, r.file.name.replace(/\.[^/.]+$/, "") + ".txt");
    toast.success("Saved as .txt");
  };

  const downloadDocx = async (r: OcrResult) => {
    try {
      const blob = await generateDocxBlob(r.text);
      downloadBlob(blob, r.file.name.replace(/\.[^/.]+$/, "") + ".docx");
      toast.success("Saved as .docx");
    } catch {
      toast.error("DOCX export failed");
    }
  };

  const downloadAllZip = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.file.name.replace(/\.[^/.]+$/, "") + ".txt", r.text);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "ocr-results.zip");
    toast.success("All files downloaded as ZIP");
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setProgressLabel("");
    setError(null);
  };

  const updateText = (i: number, text: string) => {
    setResults((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, text } : r))
    );
  };

  const active = results[activeIdx];

  // ── Idle: show language picker + uploader ─────────────────────────────────
  if (status === "idle") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Recognition Language
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="py-2.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {language === "auto" && (
            <p className="mt-2 text-xs text-slate-500">
              Runs OCR with English, Turkish, German, French, Spanish, Arabic
              &amp; Russian simultaneously and picks the best match.
            </p>
          )}
        </div>

        <FileUploader
          accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif,.webp,.heic"
          multiple
          maxSizeMB={20}
          onFiles={handleFiles}
          label="Upload Images for OCR"
          hint="JPG, PNG, WEBP, BMP, TIFF, HEIC — up to 20 MB each · multi-file supported"
        />
      </div>
    );
  }

  // ── Ready: file list + run button ─────────────────────────────────────────
  if (status === "ready") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </p>
          <span className="text-xs text-slate-500">
            Language:{" "}
            <span className="font-medium text-slate-700">
              {LANGUAGES.find((l) => l.code === language)?.label}
            </span>
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5"
            >
              <span className="text-lg">🖼️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {f.name}
                </p>
                <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={runOcr}
            className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Extract Text with OCR
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5">
        <div className="text-5xl">🔍</div>
        <div>
          <p className="font-semibold text-slate-800">
            {progressLabel || "Initializing OCR engine…"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            First run downloads language data (~5–15 MB). Subsequent runs are
            instant.
          </p>
        </div>
        <ProgressBar progress={progress} label="OCR in progress" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === "error" && error) {
    return (
      <div className="space-y-4">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
        <button
          onClick={reset}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (status === "done" && active) {
    const wordCount = active.text.split(/\s+/).filter(Boolean).length;
    const conf = Math.round(active.confidence);
    const confColor =
      conf > 80
        ? "text-green-600"
        : conf > 60
        ? "text-yellow-600"
        : "text-red-500";

    return (
      <div className="space-y-5">
        {/* Multi-file tabs */}
        {results.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === activeIdx
                    ? "bg-red-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r.file.name.length > 22
                  ? r.file.name.slice(0, 22) + "…"
                  : r.file.name}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              <span className="font-bold text-slate-800">
                {active.text.length.toLocaleString()}
              </span>{" "}
              chars
            </span>
            <span>
              <span className="font-bold text-slate-800">
                {wordCount.toLocaleString()}
              </span>{" "}
              words
            </span>
            <span className={`font-bold ${confColor}`}>{conf}% confidence</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowLowConf((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showLowConf
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {showLowConf ? "Hide" : "Show"} Low Confidence
            </button>
            <button
              onClick={() => copyText(active.text)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                copied
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => downloadTxt(active)}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              .txt
            </button>
            <button
              onClick={() => downloadDocx(active)}
              className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800"
            >
              .docx
            </button>
            {results.length > 1 && (
              <button
                onClick={downloadAllZip}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                All (.zip)
              </button>
            )}
            <button
              onClick={reset}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              New
            </button>
          </div>
        </div>

        {/* Side-by-side view */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Original Image
            </p>
            <img
              src={active.previewUrl}
              alt={active.file.name}
              className="w-full rounded-xl border border-slate-200 object-contain max-h-96 bg-slate-50"
            />
            <p className="mt-1 text-xs text-slate-400">
              {active.file.name} · {formatBytes(active.file.size)}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Extracted Text{" "}
              <span className="normal-case font-normal">(editable)</span>
            </p>
            <textarea
              value={active.text}
              onChange={(e) => updateText(activeIdx, e.target.value)}
              className="h-96 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              spellCheck
              aria-label="Extracted text — editable"
            />
          </div>
        </div>

        {/* Low confidence words panel */}
        {showLowConf && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">
              Low Confidence Words (&lt;70%)
            </p>
            {active.lowConfWords.length === 0 ? (
              <p className="text-sm text-orange-600">
                All words recognized with ≥70% confidence — excellent scan
                quality!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {active.lowConfWords.slice(0, 60).map((w, i) => (
                  <span
                    key={i}
                    title={`${Math.round(w.confidence)}% confidence`}
                    className={`rounded px-2 py-0.5 text-xs font-medium cursor-help ${
                      w.confidence < 40
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {w.text}
                  </span>
                ))}
                {active.lowConfWords.length > 60 && (
                  <span className="text-xs text-orange-600 self-center">
                    …and {active.lowConfWords.length - 60} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
