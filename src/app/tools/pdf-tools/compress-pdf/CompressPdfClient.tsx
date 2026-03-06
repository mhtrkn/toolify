/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";
type Level = "low";

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("low");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(
    null,
  );

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResult(null);
    toast.success("File Selected", {
      description: `${files[0].name} is ready to compress.`,
    });
  };

  const compressLow = async (arrayBuffer: ArrayBuffer): Promise<Uint8Array> => {
    const { PDFDocument } = await import("pdf-lib");
    setProgress(30);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setProgress(50);
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("toolify");
    pdfDoc.setCreator("toolify");
    setProgress(70);
    return pdfDoc.save({ useObjectStreams: true });
  };

  const compressRendered = async (
    arrayBuffer: ArrayBuffer,
    scale: number,
    jpegQuality: number,
  ): Promise<Uint8Array> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    setProgress(15);
    const srcPdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;
    const total = srcPdf.numPages;
    const { PDFDocument } = await import("pdf-lib");
    const outPdf = await PDFDocument.create();
    setProgress(20);
    for (let i = 1; i <= total; i++) {
      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const jpeg = canvas.toDataURL("image/jpeg", jpegQuality);
      const base64 = jpeg.split(",")[1];
      const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const embeddedImg = await outPdf.embedJpg(imgBytes);
      const pdfPage = outPdf.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
      setProgress(20 + Math.round((i / total) * 70));
    }
    setProgress(92);
    return outPdf.save({ useObjectStreams: true });
  };

  const compress = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      let compressed: Uint8Array;
      if (level === "low") {
        compressed = await compressLow(arrayBuffer);
      } else if (level === "medium") {
        compressed = await compressRendered(arrayBuffer, 1.2, 0.72);
      } else {
        compressed = await compressRendered(arrayBuffer, 0.75, 0.45);
      }
      const blob = new Blob([compressed as unknown as BlobPart], {
        type: "application/pdf",
      });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
      setStatus("done");
      const savedPct = Math.round(((file.size - blob.size) / file.size) * 100);
      toast.success("PDF Compressed!", {
        description:
          savedPct > 0
            ? `Reduced by ${savedPct}% — ${formatBytes(file.size - blob.size)} saved.`
            : "PDF optimized successfully.",
      });
    } catch (e) {
      console.error(e);
      const msg =
        "Could not compress this PDF. The file may be encrypted or corrupted.";
      setError(msg);
      toast.error("Compression Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(".pdf", "-compressed.pdf");
    a.click();
    toast.success("Download Started", {
      description: "Your compressed PDF is being downloaded.",
    });
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  };

  const savedBytes = file && result ? file.size - result.size : 0;
  const savedPct =
    file && result ? Math.round((savedBytes / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".pdf"
          maxSizeMB={100}
          onFiles={handleFiles}
          label="Upload PDF to Compress"
          hint="Supports PDF up to 100MB"
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={compress}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Compress PDF
            </Button>
            <Button
              onClick={reset}
              variant="secondary"
              size="lg"
              className="px-4"
            >
              Change File
            </Button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Compressing PDF…" />
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

      {status === "done" && result && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-green-900">PDF Compressed!</p>
            <p className="text-sm text-green-700 mt-1">
              {savedPct > 0
                ? `Reduced by ${savedPct}% · saved ${formatBytes(savedBytes)}`
                : "PDF optimized successfully"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-white border border-green-200 p-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">Original</p>
              <p className="font-semibold text-slate-800">
                {formatBytes(file.size)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Compressed</p>
              <p className="font-semibold text-green-700">
                {formatBytes(result.size)}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={download} variant="primary" size="lg">
              Download Compressed PDF
            </Button>
            <Button onClick={reset} variant="secondary" size="lg">
              Compress Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
