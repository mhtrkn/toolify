"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";
type Preset = "high" | "medium" | "small";

const PRESETS: Record<Preset, { label: string; crf: number; desc: string }> = {
  high: { label: "High Quality", crf: 23, desc: "Best quality, moderate compression" },
  medium: { label: "Balanced", crf: 28, desc: "Good quality, smaller file size" },
  small: { label: "Smallest File", crf: 35, desc: "Maximum compression, lower quality" },
};

export default function CompressVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<Preset>("medium");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResult(null);
    toast.success("File Selected", { description: `${files[0].name} is ready to compress.` });
  };

  const compress = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);
    setError(null);
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        setProgress(25 + Math.round(p * 70));
      });
      setProgress(10);
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setProgress(25);
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      const crf = PRESETS[preset].crf;
      await ffmpeg.exec(["-i", inputName, "-vcodec", "libx264", "-crf", String(crf), "-preset", "fast", "-acodec", "aac", "-b:a", "128k", "-movflags", "+faststart", "output.mp4"]);
      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
      setStatus("done");
      const savedPct = Math.round(((file.size - blob.size) / file.size) * 100);
      toast.success("Video Compressed!", {
        description: savedPct > 0
          ? `Reduced by ${savedPct}% — ${formatBytes(file.size)} → ${formatBytes(blob.size)}.`
          : "Video compressed successfully.",
      });
    } catch (e) {
      console.error(e);
      const msg = "Video compression failed. This tool requires a browser with SharedArrayBuffer support (Chrome/Edge).";
      setError(msg);
      toast.error("Compression Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, "-compressed.mp4");
    a.click();
    toast.success("Download Started", { description: "Your compressed video is being downloaded." });
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  };

  const savedPct = file && result ? Math.round(((file.size - result.size) / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".mp4,.avi,.mov,.mkv,.webm" maxSizeMB={500} onFiles={handleFiles} label="Upload Video to Compress" hint="Supports MP4, AVI, MOV, MKV, WebM — up to 500MB" />
      )}
      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎬</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Compression Preset</p>
            <div className="grid gap-2">
              {(Object.keys(PRESETS) as Preset[]).map((key) => (
                <label key={key} className={`flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer ${preset === key ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="preset" value={key} checked={preset === key} onChange={() => setPreset(key)} className="accent-red-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{PRESETS[key].label}</p>
                    <p className="text-xs text-slate-500">{PRESETS[key].desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
            Output will be MP4 (H.264). Processing large files may take several minutes.
          </div>
          <div className="flex gap-3">
            <button onClick={compress} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">Compress Video</button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">Change File</button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">Compressing video… this may take a few minutes for large files.</p>
          <ProgressBar progress={progress} label="Compressing" />
        </div>
      )}
      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {status === "done" && result && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✅</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-green-900">Video Compressed!</p>
            {savedPct > 0 && (
              <p className="text-sm text-green-700 mt-1">Reduced by {savedPct}% — {formatBytes(file.size)} → {formatBytes(result.size)}</p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Download Compressed Video</button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">Compress Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
