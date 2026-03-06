"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

interface TextFragment {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
}

function extractLines(items: unknown[]): string[] {
  const fragments: TextFragment[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (!("str" in item) || !("transform" in item) || !("width" in item)) continue;
    const str = (item as { str: string }).str;
    if (!str || !str.trim()) continue;
    const transform = (item as { transform: number[] }).transform;
    const width = (item as { width: number }).width;
    const fontSize = Math.abs(transform[3]) || Math.abs(transform[0]) || 12;
    fragments.push({ str, x: transform[4], y: transform[5], width, fontSize });
  }
  if (fragments.length === 0) return [];

  // Sort by Y descending (top to bottom), then X ascending (left to right)
  fragments.sort((a, b) => b.y - a.y || a.x - b.x);

  // Group into lines using font-size-relative Y threshold
  const lines: TextFragment[][] = [];
  let currentLine: TextFragment[] = [fragments[0]];
  for (let i = 1; i < fragments.length; i++) {
    const prev = currentLine[0];
    const curr = fragments[i];
    const threshold = Math.max(prev.fontSize, curr.fontSize) * 0.4;
    if (Math.abs(prev.y - curr.y) <= threshold) {
      currentLine.push(curr);
    } else {
      lines.push(currentLine);
      currentLine = [curr];
    }
  }
  lines.push(currentLine);

  // Build text for each line with smart spacing
  return lines.map((line) => {
    line.sort((a, b) => a.x - b.x);
    let text = "";
    for (let i = 0; i < line.length; i++) {
      if (i === 0) {
        text = line[i].str;
        continue;
      }
      const prev = line[i - 1];
      const gap = line[i].x - (prev.x + prev.width);
      const spaceWidth = prev.fontSize * 0.3;
      if (gap > spaceWidth * 3) {
        text += "\t" + line[i].str;
      } else if (gap > spaceWidth * 0.3) {
        text += " " + line[i].str;
      } else {
        text += line[i].str;
      }
    }
    return text;
  });
}

function detectParagraphs(lines: string[]): string[] {
  if (lines.length <= 1) return lines;
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);
    if (i < lines.length - 1) {
      const curr = lines[i].trim();
      const next = lines[i + 1].trim();
      const endsWithPunctuation = /[.!?:。]$/.test(curr);
      const nextStartsUpper = /^[A-ZÀ-ÖÜŞĞİÇ0-9•\-–—]/.test(next);
      if (endsWithPunctuation && nextStartsUpper) {
        result.push("");
      }
    }
  }
  return result;
}

function escapeRtf(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\t/g, "\\tab ")
    .replace(/[^\x00-\x7F]/g, (ch) => {
      const code = ch.charCodeAt(0);
      return `\\u${code}?`;
    });
}

function buildRtf(pages: string[][]): string {
  const header =
    "{\\rtf1\\ansi\\deff0\n" +
    "{\\fonttbl{\\f0 Arial;}}\n" +
    "{\\colortbl;\\red0\\green0\\blue0;}\n" +
    "\\f0\\fs24\\cf1\n";
  const body = pages
    .map((lines, pageIdx) => {
      const content = lines
        .map((l) => (l.trim().length === 0 ? "\\par\n" : escapeRtf(l) + "\\par\n"))
        .join("");
      return pageIdx < pages.length - 1 ? content + "\\page\n" : content;
    })
    .join("");
  return header + body + "}";
}

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [rtfUrl, setRtfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setRtfUrl(null);
    setPageCount(0);
    toast.success("File Selected", { description: `${files[0].name} is ready to convert.` });
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      setProgress(20);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const total = pdf.numPages;
      setPageCount(total);
      setProgress(30);
      const pages: string[][] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines = extractLines(content.items);
        const paragraphed = detectParagraphs(lines);
        pages.push(paragraphed);
        setProgress(30 + Math.round((i / total) * 60));
      }
      const rtf = buildRtf(pages);
      const blob = new Blob([rtf], { type: "application/rtf" });
      setRtfUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus("done");
      toast.success("Conversion Complete!", {
        description: `${total} page${total !== 1 ? "s" : ""} extracted and ready to download.`,
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
    if (!rtfUrl || !file) return;
    const a = document.createElement("a");
    a.href = rtfUrl;
    a.download = file.name.replace(/\.pdf$/i, ".rtf");
    a.click();
    toast.success("Download Started", { description: "Your Word file is being downloaded." });
  };

  const reset = () => {
    if (rtfUrl) URL.revokeObjectURL(rtfUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setRtfUrl(null);
    setPageCount(0);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".pdf" maxSizeMB={100} onFiles={handleFiles} label="Upload PDF to Convert" hint="Supports PDF up to 100MB" />
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
            <strong>Note:</strong> Text is extracted from the PDF and saved as an RTF file — opens in Word, LibreOffice, and Google Docs. Scanned PDFs (images) require OCR and cannot be converted this way.
          </div>
          <div className="flex gap-3">
            <Button onClick={convert} variant="primary" size="lg" className="flex-1">Convert to Word</Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change File</Button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Extracting text from PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}
      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {status === "done" && rtfUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div>
            <p className="font-semibold text-green-900">Conversion Complete!</p>
            <p className="text-sm text-green-700 mt-1">
              {pageCount} page{pageCount !== 1 ? "s" : ""} extracted · opens in Word & LibreOffice
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={download} variant="primary" size="lg">Download Word File</Button>
            <Button onClick={reset} variant="secondary" size="lg">Convert Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
