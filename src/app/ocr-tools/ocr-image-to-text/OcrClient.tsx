"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function OcrClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [copied, setCopied] = useState(false);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("ready");
    setError(null);
    setExtractedText("");
  };

  const extract = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);
    setError(null);

    try {
      const Tesseract = await import("tesseract.js");
      const { data: { text } } = await Tesseract.recognize(file, language, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(10 + Math.round(m.progress * 85));
          }
        },
      });
      setExtractedText(text.trim());
      setProgress(100);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "OCR failed. Install tesseract.js to enable OCR: npm install tesseract.js"
      );
      setStatus("error");
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.[^/.]+$/, "") || "extracted") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setProgress(0);
    setExtractedText("");
    setError(null);
  };

  const LANGUAGES = [
    { code: "eng", label: "English" },
    { code: "spa", label: "Spanish" },
    { code: "fra", label: "French" },
    { code: "deu", label: "German" },
    { code: "chi_sim", label: "Chinese (Simplified)" },
    { code: "ara", label: "Arabic" },
    { code: "por", label: "Portuguese" },
    { code: "rus", label: "Russian" },
  ];

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Document Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <FileUploader
            accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp"
            maxSizeMB={20}
            onFiles={handleFiles}
            label="Upload Image for OCR"
            hint="Supports JPG, PNG, BMP, TIFF — up to 20MB"
          />
        </>
      )}

      {status === "ready" && file && preview && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={extract}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Extract Text with OCR
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              Change Image
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">
            Recognizing text… this may take a moment.
          </p>
          <ProgressBar progress={progress} label="OCR Processing" />
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Extracted Text</h2>
            <div className="flex gap-2">
              <button
                onClick={copyText}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                onClick={downloadTxt}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Download .txt
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                New Image
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {preview && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Original Image</p>
                <img src={preview} alt="Original" className="w-full rounded-xl border border-slate-200 object-contain max-h-80" />
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Extracted Text ({extractedText.length} characters)
              </p>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="h-80 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Extracted text"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
