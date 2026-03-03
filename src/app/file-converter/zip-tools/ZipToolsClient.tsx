"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Mode = "create" | "extract";
type Status = "idle" | "ready" | "processing" | "done" | "error";

interface ExtractedFile { name: string; size: number; blob: Blob }

export default function ZipToolsClient() {
  const [mode, setMode] = useState<Mode>("create");
  const [status, setStatus] = useState<Status>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [extracted, setExtracted] = useState<ExtractedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [zipName, setZipName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ── Create mode ──────────────────────────────────────────────────────────────
  const handleCreateFiles = (incoming: File[]) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      const deduped = incoming.filter((f) => !names.has(f.name));
      return [...prev, ...deduped];
    });
    setStatus("ready");
    setError(null);
  };

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const createZip = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (let i = 0; i < files.length; i++) {
        zip.file(files[i].name, files[i]);
        setProgress(10 + Math.round(((i + 1) / files.length) * 60));
      }
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      setProgress(100);
      const name = "archive.zip";
      setZipUrl(URL.createObjectURL(blob));
      setZipName(name);
      setStatus("done");
      toast.success("ZIP Created!", { description: `${files.length} file${files.length > 1 ? "s" : ""} — ${formatBytes(blob.size)}` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create ZIP.";
      setError(msg);
      setStatus("error");
      toast.error("ZIP Creation Failed", { description: msg });
    }
  };

  // ── Extract mode ─────────────────────────────────────────────────────────────
  const handleZipFile = async (incoming: File[]) => {
    const f = incoming[0];
    setStatus("processing");
    setProgress(10);
    setError(null);
    setExtracted([]);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(f);
      setProgress(40);
      const results: ExtractedFile[] = [];
      const entries = Object.entries(zip.files).filter(([, entry]) => !entry.dir);
      for (let i = 0; i < entries.length; i++) {
        const [name, entry] = entries[i];
        const blob = await entry.async("blob");
        results.push({ name, size: blob.size, blob });
        setProgress(40 + Math.round(((i + 1) / entries.length) * 55));
      }
      setExtracted(results);
      setProgress(100);
      setStatus("done");
      toast.success("ZIP Extracted!", { description: `${results.length} file${results.length !== 1 ? "s" : ""} found.` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to read ZIP file.";
      setError(msg);
      setStatus("error");
      toast.error("Extraction Failed", { description: msg });
    }
  };

  const downloadExtracted = (ef: ExtractedFile) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(ef.blob);
    a.download = ef.name.split("/").pop() ?? ef.name;
    a.click();
    toast.success("Download Started", { description: ef.name });
  };

  const downloadAllExtracted = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const ef of extracted) zip.file(ef.name, ef.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "extracted_files.zip";
    a.click();
    toast.success("Downloading All Files");
  };

  const downloadZip = () => {
    if (!zipUrl) return;
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = zipName;
    a.click();
    toast.success("Download Started");
  };

  const reset = () => {
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    setFiles([]);
    setExtracted([]);
    setStatus("idle");
    setProgress(0);
    setZipUrl(null);
    setZipName("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        Files are automatically deleted after processing. All conversion happens in your browser.
      </p>

      {/* Mode toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <button
          onClick={() => { setMode("create"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "create" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Create ZIP
        </button>
        <button
          onClick={() => { setMode("extract"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "extract" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Extract ZIP
        </button>
      </div>

      {/* Create mode */}
      {mode === "create" && (
        <>
          {(status === "idle" || status === "ready") && (
            <div className="space-y-4">
              <FileUploader
                multiple
                maxSizeMB={50}
                onFiles={handleCreateFiles}
                label="Add Files to ZIP"
                hint="Drop any files here — up to 50MB total"
              />
              {files.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                  {files.map((f) => (
                    <div key={f.name} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{f.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(f.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(f.name)}
                        className="ml-3 shrink-0 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {files.length > 0 && (
                <button
                  onClick={createZip}
                  className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Create ZIP ({files.length} file{files.length > 1 ? "s" : ""})
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Extract mode */}
      {mode === "extract" && status === "idle" && (
        <FileUploader
          accept=".zip"
          maxSizeMB={50}
          onFiles={handleZipFile}
          label="Upload ZIP File to Extract"
          hint="Supports standard .zip archives — up to 50MB"
        />
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message={mode === "create" ? "Creating ZIP…" : "Extracting ZIP…"} />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create done */}
      {mode === "create" && status === "done" && zipUrl && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-4">
          <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">✅</span>
          <div>
            <p className="font-semibold text-red-900">ZIP Created!</p>
            <p className="text-sm text-red-700 mt-1">{zipName} · {files.length} file{files.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={downloadZip} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              Download ZIP
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">
              Create Another
            </button>
          </div>
        </div>
      )}

      {/* Extract done */}
      {mode === "extract" && status === "done" && extracted.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">✅ {extracted.length} file{extracted.length !== 1 ? "s" : ""} extracted</p>
            <div className="flex gap-2">
              <button
                onClick={downloadAllExtracted}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Download All
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                Extract Another
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {extracted.map((ef) => (
              <div key={ef.name} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{ef.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(ef.size)}</p>
                </div>
                <button
                  onClick={() => downloadExtracted(ef)}
                  className="ml-3 shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
