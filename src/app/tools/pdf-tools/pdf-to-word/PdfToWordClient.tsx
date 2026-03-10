"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";
import { convertPdfToDocx } from "@/lib/pdf-to-docx-client";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setDocxUrl(null);
    setPageCount(0);
    toast.success("File Selected", {
      description: `${files[0].name} is ready to convert.`,
    });
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const result = await convertPdfToDocx(file, setProgress);
      setPageCount(result.pageCount);
      setDocxUrl(URL.createObjectURL(result.blob));
      setProgress(100);
      setStatus("done");
      toast.success("Conversion Complete!", {
        description: `${result.pageCount} page${result.pageCount !== 1 ? "s" : ""} extracted and ready to download.`,
      });
    } catch (e) {
      console.error(e);
      const detail = e instanceof Error ? e.message : String(e);
      const msg = `Conversion failed: ${detail}`;
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!docxUrl || !file) return;
    const a = document.createElement("a");
    a.href = docxUrl;
    a.download = file.name.replace(/\.pdf$/i, ".docx");
    a.click();
    toast.success("Download Started", {
      description: "Your Word file is being downloaded.",
    });
  };

  const reset = () => {
    if (docxUrl) URL.revokeObjectURL(docxUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setDocxUrl(null);
    setPageCount(0);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF to Convert"
          hint="Supports PDF up to 100MB"
        />
      )}
      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <strong>Note:</strong> Text is extracted from the PDF and saved as a
            DOCX file — opens in Word, LibreOffice, and Google Docs. Scanned
            PDFs (images) require OCR and cannot be converted this way.
          </div>
          <div className="flex gap-3">
            <Button
              onClick={convert}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Convert to Word
            </Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">
              Change File
            </Button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Extracting text from PDF…" />
          <div className="mt-4">
            <ProgressBar progress={progress} label="Processing" />
          </div>
        </div>
      )}
      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {status === "done" && docxUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </span>
          </div>
          <div>
            <p className="font-semibold text-green-900">
              Conversion Complete!
            </p>
            <p className="text-sm text-green-700 mt-1">
              {pageCount} page{pageCount !== 1 ? "s" : ""} extracted · DOCX
              format · opens in Word, LibreOffice & Google Docs
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={download} variant="primary" size="lg">
              Download Word File
            </Button>
            <Button onClick={reset} variant="secondary" size="lg">
              Convert Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
