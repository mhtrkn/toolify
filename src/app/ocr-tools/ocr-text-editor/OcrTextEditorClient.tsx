"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { generateDocxBlob } from "@/lib/docx-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────
type Mode = "upload" | "ocr" | "edit";

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

// ── SearchReplace panel ───────────────────────────────────────────────────────
function SearchReplacePanel({
  text,
  onTextChange,
}: {
  text: string;
  onTextChange: (t: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const countMatches = useCallback(
    (q: string) => {
      if (!q) { setMatchCount(null); return; }
      const flags = caseSensitive ? "g" : "gi";
      try {
        const count = (text.match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags)) || []).length;
        setMatchCount(count);
      } catch {
        setMatchCount(null);
      }
    },
    [text, caseSensitive]
  );

  const handleSearch = (q: string) => {
    setSearch(q);
    countMatches(q);
  };

  const replaceAll = () => {
    if (!search) return;
    const flags = caseSensitive ? "g" : "gi";
    try {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const newText = text.replace(new RegExp(escaped, flags), replace);
      onTextChange(newText);
      const diff = text.length - newText.length;
      toast.success(`Replaced ${matchCount ?? 0} occurrence${matchCount !== 1 ? "s" : ""}`, {
        description: diff !== 0 ? `${Math.abs(diff)} characters ${diff > 0 ? "removed" : "added"}` : undefined,
      });
      setMatchCount(0);
    } catch {
      toast.error("Invalid search pattern");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Search &amp; Replace
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="relative">
          <Input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search…"
            className="pr-14 focus:border-red-500 focus:ring-0"
          />
          {matchCount !== null && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {matchCount}
            </span>
          )}
        </div>
        <Input
          type="text"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          placeholder="Replace with…"
          className="focus:border-red-500 focus:ring-0"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <Checkbox
            checked={caseSensitive}
            onCheckedChange={(c) => {
              setCaseSensitive(c as boolean);
              countMatches(search);
            }}
          />
          Case sensitive
        </label>
        <Button onClick={replaceAll} variant="primary" size="sm" disabled={!search}>Replace All</Button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OcrTextEditorClient() {
  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [text, setText] = useState("");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lineCount = text ? text.split("\n").length : 0;

  // ── OCR ────────────────────────────────────────────────────────────────────
  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setMode("ocr");
  };

  const runOcr = async () => {
    if (!file) return;
    setOcrProgress(5);
    try {
      const { recognize } = await import("tesseract.js");
      const lang = language === "auto" ? AUTO_LANG : language;
      const { data } = await recognize(file, lang, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text")
            setOcrProgress(10 + Math.round(m.progress * 85));
        },
      });
      pushUndo(text);
      setText(data.text.trim());
      setOcrProgress(100);
      setMode("edit");
      toast.success(`${data.text.trim().length.toLocaleString()} characters extracted`);
    } catch {
      toast.error("OCR failed. Try a higher-resolution image.");
      setMode("upload");
      setOcrProgress(0);
    }
  };

  const pushUndo = (prev: string) => {
    setUndoStack((s) => [...s.slice(-49), prev]);
  };

  const undo = () => {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setText(prev);
  };

  const handleTextChange = (newText: string) => {
    pushUndo(text);
    setText(newText);
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("Copied to clipboard");
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, (file?.name.replace(/\.[^/.]+$/, "") || "edited-text") + ".txt");
    toast.success("Saved as .txt");
  };

  const downloadDocx = async () => {
    try {
      const blob = await generateDocxBlob(text);
      downloadBlob(blob, (file?.name.replace(/\.[^/.]+$/, "") || "edited-text") + ".docx");
      toast.success("Saved as .docx");
    } catch {
      toast.error("DOCX export failed");
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setText("");
    setUndoStack([]);
    setOcrProgress(0);
    setShowSearch(false);
    setMode("upload");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // Upload mode
  if (mode === "upload") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            OCR Language
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

        <FileUploader
          accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif,.webp"
          maxSizeMB={20}
          onFiles={handleFiles}
          label="Upload Image to Extract & Edit"
          hint="JPG, PNG, WEBP, BMP, TIFF — up to 20 MB"
        />

        {/* Or type directly */}
        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="mx-4 text-xs text-slate-400 bg-white px-2">or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700">Start with blank document</p>
          <Button onClick={() => { setText(""); setMode("edit"); }} variant="secondary" size="lg" className="w-full">
            Open Empty Editor
          </Button>
        </div>
      </div>
    );
  }

  // OCR in progress
  if (mode === "ocr") {
    return (
      <div className="space-y-5">
        {ocrProgress === 5 ? (
          // Confirm step
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                />
              )}
              <div>
                <p className="font-semibold text-slate-900">{file?.name}</p>
                <p className="text-sm text-slate-500">{file ? formatBytes(file.size) : ""}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Language:{" "}
                  <span className="font-medium text-slate-700">
                    {LANGUAGES.find((l) => l.code === language)?.label}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={runOcr} variant="primary" size="lg" className="flex-1">Extract Text with OCR</Button>
              <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change</Button>
            </div>
          </div>
        ) : (
          // Processing
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5">
            <div className="text-5xl">🔍</div>
            <p className="font-semibold text-slate-800">Recognizing text…</p>
            <ProgressBar progress={ocrProgress} label="OCR in progress" />
          </div>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4">
      {/* Image context strip (only when file was uploaded) */}
      {previewUrl && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <img
            src={previewUrl}
            alt={file?.name}
            className="h-10 w-10 rounded object-cover flex-shrink-0"
          />
          <p className="text-sm text-slate-600 truncate flex-1">{file?.name}</p>
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            <span className="font-bold text-slate-700">{charCount.toLocaleString()}</span> chars
          </span>
          <span>
            <span className="font-bold text-slate-700">{wordCount.toLocaleString()}</span> words
          </span>
          <span>
            <span className="font-bold text-slate-700">{lineCount.toLocaleString()}</span> lines
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowSearch((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showSearch
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Search &amp; Replace
          </button>
          <button
            onClick={undo}
            disabled={!undoStack.length}
            title="Undo"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Undo
          </button>
          <button
            onClick={copyText}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              copied
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <Button onClick={downloadTxt} variant="primary" size="sm">.txt</Button>
          <Button onClick={downloadDocx} variant="primary" size="sm">.docx</Button>
          <Button onClick={reset} variant="secondary" size="sm">New</Button>
        </div>
      </div>

      {/* Search & replace panel */}
      {showSearch && (
        <SearchReplacePanel text={text} onTextChange={handleTextChange} />
      )}

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          // For the editor, push undo on every ~100 char change batch
          setText(e.target.value);
        }}
        onBlur={() => pushUndo(text)}
        className="min-h-96 w-full resize-y rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
        spellCheck
        autoCorrect="on"
        autoCapitalize="sentences"
        placeholder="Extracted text will appear here. You can also type or paste directly."
        aria-label="Text editor"
      />

      <p className="text-xs text-slate-400 text-center">
        Spell check is active — right-click underlined words for correction suggestions.
      </p>
    </div>
  );
}
