"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "idle" | "ready" | "processing" | "done" | "error";
type ExportFmt = "txt" | "docx" | "json";

interface PageResult {
  page: number;
  text: string;
  isOcr: boolean;
}

interface PdfResult {
  file: File;
  pages: PageResult[];
  totalPages: number;
  hasOcrPages: boolean;
}

// ── OCR language config ───────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "auto", label: "Auto Detect" },
  { code: "eng", label: "English" },
  { code: "tur", label: "Turkish" },
  { code: "deu", label: "German" },
  { code: "fra", label: "French" },
  { code: "spa", label: "Spanish" },
  { code: "ara", label: "Arabic" },
  { code: "rus", label: "Russian" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "jpn", label: "Japanese" },
  { code: "por", label: "Portuguese" },
];

const AUTO_LANG = "eng+tur+deu+fra+spa+ara+rus";

// ── Helpers ───────────────────────────────────────────────────────────────────
async function renderPdfPageToDataUrl(
  page: Awaited<ReturnType<import("pdfjs-dist").PDFDocumentProxy["getPage"]>>
): Promise<string> {
  const viewport = page.getViewport({ scale: 2.0 }); // 2× scale for OCR quality
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  // pdfjs-dist v5 render API requires the canvas element directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (page as any).render({ canvas, viewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.9);
}

function buildFullText(result: PdfResult): string {
  return result.pages
    .map((p) => `--- Page ${p.page} ---\n${p.text}`)
    .join("\n\n");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PdfToTextClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState("eng");
  const [ocrFallback, setOcrFallback] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [results, setResults] = useState<PdfResult[]>([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (incoming: File[]) => {
    setFiles(incoming);
    setStatus("ready");
    setResults([]);
    setError(null);
  };

  const extract = async () => {
    if (!files.length) return;
    setStatus("processing");
    setError(null);
    const allResults: PdfResult[] = [];

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      for (let fi = 0; fi < files.length; fi++) {
        const f = files[fi];
        setProgressLabel(`Loading ${f.name} (${fi + 1} / ${files.length})`);

        const arrayBuffer = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        const pages: PageResult[] = [];
        let hasOcrPages = false;

        for (let p = 1; p <= totalPages; p++) {
          const globalDone = fi * totalPages + p;
          const globalTotal = files.length * totalPages;
          setProgressLabel(`${f.name} — page ${p} / ${totalPages}`);
          setProgress(Math.round((globalDone / globalTotal) * 95));

          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          const nativeText = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          if (nativeText.length >= 30 || !ocrFallback) {
            // Selectable text found OR OCR disabled
            pages.push({
              page: p,
              text: nativeText || "(no text on this page)",
              isOcr: false,
            });
          } else {
            // Scanned/image page — render to canvas and OCR
            hasOcrPages = true;
            setProgressLabel(`${f.name} — page ${p}/${totalPages} (OCR…)`);
            const dataUrl = await renderPdfPageToDataUrl(page);
            const { recognize } = await import("tesseract.js");
            const lang = language === "auto" ? AUTO_LANG : language;
            const { data } = await recognize(dataUrl, lang);
            pages.push({
              page: p,
              text: data.text.trim() || "(no text recognized)",
              isOcr: true,
            });
          }
        }

        allResults.push({ file: f, pages, totalPages, hasOcrPages });
      }

      setResults(allResults);
      setProgress(100);
      setStatus("done");
      setActiveFileIdx(0);
      toast.success(
        files.length === 1
          ? `${allResults[0].totalPages} page${allResults[0].totalPages !== 1 ? "s" : ""} extracted`
          : `${files.length} PDFs processed`
      );
    } catch (e) {
      console.error(e);
      const msg =
        "Could not process this PDF. It may be encrypted, password-protected, or corrupted.";
      setError(msg);
      toast.error("Extraction failed", { description: msg });
      setStatus("error");
    }
  };

  const handleExport = async (r: PdfResult, fmt: ExportFmt) => {
    const fullText = buildFullText(r);
    const base = r.file.name.replace(".pdf", "");

    if (fmt === "txt") {
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, base + ".txt");
      toast.success("Saved as .txt");
    } else if (fmt === "docx") {
      try {
        const blob = await generateDocxBlob(fullText);
        downloadBlob(blob, base + ".docx");
        toast.success("Saved as .docx");
      } catch {
        toast.error("DOCX export failed");
      }
    } else if (fmt === "json") {
      const data = {
        filename: r.file.name,
        totalPages: r.totalPages,
        ocrUsed: r.hasOcrPages,
        extractedAt: new Date().toISOString(),
        pages: r.pages.map((p) => ({
          page: p.page,
          text: p.text,
          method: p.isOcr ? "ocr" : "native",
        })),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      downloadBlob(blob, base + ".json");
      toast.success("Saved as .json");
    }
  };

  const copyText = (r: PdfResult) => {
    navigator.clipboard.writeText(buildFullText(r));
    toast.success("Copied to clipboard");
  };

  const downloadAllZip = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.file.name.replace(".pdf", ".txt"), buildFullText(r));
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "pdf-extractions.zip");
    toast.success("All results downloaded as ZIP");
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setProgressLabel("");
    setError(null);
  };

  const active = results[activeFileIdx];

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (status === "idle") {
    return (
      <div className="space-y-5">
        {/* Options */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              OCR Fallback Language
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
          </div>

          <label className="flex cursor-pointer items-center gap-3 select-none">
            <Checkbox
              checked={ocrFallback}
              onCheckedChange={(c) => setOcrFallback(c as boolean)}
            />
            <span className="text-sm text-slate-700">
              Auto-OCR scanned pages{" "}
              <span className="text-xs text-slate-500">
                (pages with no selectable text are processed with OCR)
              </span>
            </span>
          </label>
        </div>

        <FileUploader
          accept=".pdf"
          multiple
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF Files"
          hint="Supports digital and scanned PDFs — up to 100 MB each · multi-file supported"
        />
      </div>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (status === "ready") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <p className="text-sm font-semibold text-slate-700">
          {files.length} file{files.length > 1 ? "s" : ""} ready
        </p>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5"
            >
              <span className="text-xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {f.name}
                </p>
                <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
              </div>
            </div>
          ))}
        </div>

        {ocrFallback && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-700">
            OCR fallback is enabled — scanned pages will be recognized
            automatically (slower for image-heavy PDFs).
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={extract} variant="primary" size="lg" className="flex-1">Extract Text</Button>
          <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change</Button>
        </div>
      </div>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5">
        <div className="text-5xl">📋</div>
        <div>
          <p className="font-semibold text-slate-800">
            {progressLabel || "Processing PDF…"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            OCR on scanned pages downloads language data on first use (~5–15 MB).
          </p>
        </div>
        <ProgressBar progress={progress} label="Extracting text" />
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
        <Button onClick={reset} variant="secondary" size="md">Try Again</Button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (status === "done" && active) {
    const fullText = buildFullText(active);
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const charCount = fullText.length;
    const ocrPageCount = active.pages.filter((p) => p.isOcr).length;

    return (
      <div className="space-y-5">
        {/* Multi-file tabs */}
        {results.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveFileIdx(i)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === activeFileIdx
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

        {/* Stats + toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">Text extracted</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {active.totalPages} pages ·{" "}
              {wordCount.toLocaleString()} words ·{" "}
              {charCount.toLocaleString()} chars
              {ocrPageCount > 0 && (
                <span className="ml-2 text-orange-600 font-medium">
                  · {ocrPageCount} OCR page{ocrPageCount > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => copyText(active)} variant="secondary" size="sm">Copy</Button>
            <Button onClick={() => handleExport(active, "txt")} variant="primary" size="sm">.txt</Button>
            <Button onClick={() => handleExport(active, "docx")} variant="primary" size="sm">.docx</Button>
            <Button onClick={() => handleExport(active, "json")} variant="primary" size="sm">.json</Button>
            {results.length > 1 && (
              <Button onClick={downloadAllZip} variant="secondary" size="sm">All (.zip)</Button>
            )}
            <Button onClick={reset} variant="secondary" size="sm">New</Button>
          </div>
        </div>

        {/* Page tabs + text view */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Page list */}
          {active.pages.length > 1 && (
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-4 py-3 bg-slate-50">
              {active.pages.map((p) => (
                <a
                  key={p.page}
                  href={`#page-${p.page}`}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    p.isOcr
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                  title={p.isOcr ? "OCR recognized" : "Native text"}
                >
                  P{p.page}
                  {p.isOcr && " *"}
                </a>
              ))}
              {active.hasOcrPages && (
                <span className="self-center text-xs text-orange-600 ml-2">
                  * = OCR recognized
                </span>
              )}
            </div>
          )}

          {/* Scrollable text */}
          <div className="divide-y divide-slate-100 max-h-150 overflow-y-auto">
            {active.pages.map((p) => (
              <div key={p.page} id={`page-${p.page}`} className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Page {p.page}
                  </span>
                  {p.isOcr && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
                      OCR
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
