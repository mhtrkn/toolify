"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { generateDocxBlob } from "@/lib/docx-generator";
import { preprocessForOcr } from "@/lib/ocr-preprocess";
import { cleanOcrText } from "@/lib/ocr-postprocess";
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

const AUTO_LANG = "eng+tur+deu+fra+spa+ara+rus";

// ── Confidence badge component ──────────────────────────────────────────────
function ConfidenceBadge({ value }: { value: number }) {
  const conf = Math.round(value);
  const color =
    conf > 80
      ? "bg-green-100 text-green-700 border-green-200"
      : conf > 60
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";
  const barColor =
    conf > 80 ? "bg-green-500" : conf > 60 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${color}`}
    >
      <div className="w-16 h-1.5 rounded-full bg-black/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${conf}%` }}
        />
      </div>
      <span className="text-xs font-bold">{conf}%</span>
    </div>
  );
}

// ── Language picker (shared between idle and ready states) ───────────────────
function LanguagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Recognition Language
      </label>
      <Select value={value} onValueChange={onChange}>
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
      {value === "auto" && (
        <p className="mt-2 text-xs text-slate-500">
          Runs OCR with English, Turkish, German, French, Spanish, Arabic &amp;
          Russian simultaneously and picks the best match.
        </p>
      )}
    </div>
  );
}

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
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Generate thumbnails when files change
  useEffect(() => {
    if (files.length === 0) {
      setThumbnails([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setThumbnails(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

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
    const pendingUrls: string[] = [];

    try {
      const { createWorker, OEM, PSM } = await import("tesseract.js");

      setProgressLabel("Initializing OCR engine…");

      let currentIdx = 0;

      const worker = await createWorker(lang, OEM.LSTM_ONLY, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "loading tesseract core") {
            setProgressLabel("Loading OCR engine…");
          } else if (m.status === "loading language traineddata") {
            setProgressLabel("Downloading language data…");
          } else if (m.status === "recognizing text") {
            const base = (currentIdx / files.length) * 100;
            setProgress(Math.round(base + (m.progress * 100) / files.length));
          }
        },
      });

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD,
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
      });

      for (let i = 0; i < files.length; i++) {
        currentIdx = i;
        const f = files[i];
        setProgressLabel(
          `Preprocessing "${f.name}" (${i + 1} / ${files.length})`
        );

        let ocrInput: File | Blob = f;
        try {
          ocrInput = await preprocessForOcr(f);
        } catch {
          ocrInput = f;
        }

        const previewUrl = URL.createObjectURL(f);
        pendingUrls.push(previewUrl);

        setProgressLabel(
          `Recognizing "${f.name}" (${i + 1} / ${files.length})`
        );

        const { data } = await worker.recognize(ocrInput);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawWords: any[] = (data as any).words ?? [];
        const lowConfWords: WordData[] = rawWords
          .filter(
            (w: { confidence: number; text: string }) =>
              w.confidence < 70 && w.text.trim().length > 0
          )
          .map((w: { confidence: number; text: string }) => ({
            text: w.text,
            confidence: w.confidence,
          }));

        out.push({
          file: f,
          previewUrl,
          text: cleanOcrText(data.text),
          confidence: data.confidence,
          lowConfWords,
        });
      }

      await worker.terminate();

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
      pendingUrls.forEach((u) => URL.revokeObjectURL(u));
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

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (status === "idle") {
    return (
      <div className="space-y-5">
        <LanguagePicker value={language} onChange={setLanguage} />
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

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (status === "ready") {
    return (
      <div className="space-y-4">
        <LanguagePicker value={language} onChange={setLanguage} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {files.length} image{files.length > 1 ? "s" : ""} ready
            </p>
            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
              >
                {thumbnails[i] && (
                  <img
                    src={thumbnails[i]}
                    alt=""
                    className="h-10 w-10 rounded-md object-cover border border-slate-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(f.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={runOcr}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Extract Text with OCR
          </Button>
        </div>
      </div>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5">
        <div className="flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl animate-pulse">
            🔍
          </span>
        </div>
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg flex-shrink-0">
              ✕
            </span>
            <div>
              <p className="font-semibold text-red-900 mb-1">
                Text Extraction Failed
              </p>
              <p className="text-sm text-red-700">{error}</p>
              <ul className="mt-3 space-y-1 text-xs text-red-600">
                <li>
                  • Use high-resolution images (300 DPI or higher)
                </li>
                <li>• Ensure text is clearly visible and not blurry</li>
                <li>
                  • Try selecting a specific language instead of Auto Detect
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Button onClick={reset} variant="secondary" size="lg" className="w-full">
          Try with Different Images
        </Button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (status === "done" && active) {
    const wordCount = active.text.split(/\s+/).filter(Boolean).length;
    const totalChars = results.reduce((s, r) => s + r.text.length, 0);
    const totalWords = results.reduce(
      (s, r) => s + r.text.split(/\s+/).filter(Boolean).length,
      0
    );

    return (
      <div className="space-y-5">
        {/* ── Success summary card ──────────────────────────────────────── */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg flex-shrink-0">
              ✓
            </span>
            <div>
              <p className="font-semibold text-green-900">
                Text Extracted Successfully
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {results.length === 1
                  ? `${active.text.length.toLocaleString()} characters · ${wordCount.toLocaleString()} words`
                  : `${results.length} images · ${totalChars.toLocaleString()} characters · ${totalWords.toLocaleString()} words`}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white border border-green-200 p-3 text-center">
              <p className="text-lg font-bold text-slate-800">
                {active.text.length.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Characters</p>
            </div>
            <div className="rounded-lg bg-white border border-green-200 p-3 text-center">
              <p className="text-lg font-bold text-slate-800">
                {wordCount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Words</p>
            </div>
            <div className="rounded-lg bg-white border border-green-200 p-3 text-center flex flex-col items-center justify-center">
              <ConfidenceBadge value={active.confidence} />
              <p className="text-xs text-slate-500 mt-1">Confidence</p>
            </div>
          </div>
        </div>

        {/* ── Multi-file tabs ───────────────────────────────────────────── */}
        {results.length > 1 && (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-medium text-slate-400 mb-2 px-1">
              Results
            </p>
            <div className="flex flex-wrap gap-1.5">
              {results.map((r, i) => {
                const c = Math.round(r.confidence);
                const dotColor =
                  c > 80
                    ? "bg-green-400"
                    : c > 60
                    ? "bg-yellow-400"
                    : "bg-red-400";
                return (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      i === activeIdx
                        ? "bg-red-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        i === activeIdx ? "bg-white" : dotColor
                      }`}
                    />
                    {r.file.name.length > 20
                      ? r.file.name.slice(0, 20) + "…"
                      : r.file.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action toolbar ────────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyText(active.text)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                copied
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {copied ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
              {copied ? "Copied!" : "Copy Text"}
            </button>

            <button
              onClick={() => downloadTxt(active)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Save as .txt
            </button>

            <button
              onClick={() => downloadDocx(active)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Save as .docx
            </button>

            {results.length > 1 && (
              <button
                onClick={downloadAllZip}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"
                  />
                </svg>
                Download All (.zip)
              </button>
            )}

            <div className="flex-1" />

            <button
              onClick={() => setShowLowConf((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showLowConf
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {showLowConf ? "Hide" : "Show"} Low Confidence
            </button>
          </div>
        </div>

        {/* ── Side-by-side view ──────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Original Image
            </p>
            <img
              src={active.previewUrl}
              alt={active.file.name}
              className="w-full rounded-lg border border-slate-100 object-contain max-h-96 bg-slate-50"
            />
            <p className="mt-2 text-xs text-slate-400 truncate">
              {active.file.name} · {formatBytes(active.file.size)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Extracted Text
              </p>
              <span className="text-xs text-slate-400">editable</span>
            </div>
            <textarea
              value={active.text}
              onChange={(e) => updateText(activeIdx, e.target.value)}
              className="h-96 w-full resize-none rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-400"
              spellCheck
              aria-label="Extracted text — editable"
            />
          </div>
        </div>

        {/* ── Low confidence words panel ─────────────────────────────────── */}
        {showLowConf && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="h-4 w-4 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-orange-800">
                Low Confidence Words{" "}
                <span className="font-normal text-orange-600">
                  ({active.lowConfWords.length} words below 70%)
                </span>
              </p>
            </div>
            {active.lowConfWords.length === 0 ? (
              <p className="text-sm text-orange-600">
                All words recognized with high confidence — excellent image
                quality!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {active.lowConfWords.slice(0, 80).map((w, i) => (
                  <span
                    key={i}
                    title={`${Math.round(w.confidence)}% confidence`}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium cursor-help ${
                      w.confidence < 40
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-orange-100 text-orange-700 border border-orange-200"
                    }`}
                  >
                    {w.text}
                  </span>
                ))}
                {active.lowConfWords.length > 80 && (
                  <span className="text-xs text-orange-600 self-center ml-1">
                    +{active.lowConfWords.length - 80} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Extract more CTA ──────────────────────────────────────────── */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={reset}
            variant="secondary"
            size="lg"
            className="px-8"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Extract More Images
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
