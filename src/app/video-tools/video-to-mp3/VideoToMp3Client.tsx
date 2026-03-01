"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function VideoToMp3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setAudioUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);
    setError(null);

    try {
      // Use FFmpeg.wasm for in-browser conversion
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        setProgress(5 + Math.round(p * 90));
      });

      setProgress(10);
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setProgress(20);
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.exec(["-i", "input.mp4", "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", "output.mp3"]);

      const data = await ffmpeg.readFile("output.mp3");
      const blob = new Blob([data as unknown as BlobPart], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "FFmpeg could not be loaded. Install @ffmpeg/ffmpeg and @ffmpeg/util, or use a server-side API for video conversion."
      );
      setStatus("error");
    }
  };

  const download = () => {
    if (!audioUrl || !file) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3";
    a.click();
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setAudioUrl(null);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".mp4,.avi,.mov,.mkv,.webm,.flv,.wmv"
          maxSizeMB={500}
          onFiles={handleFiles}
          label="Upload Video File"
          hint="Supports MP4, AVI, MOV, MKV, WebM — up to 500MB"
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎬</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            <strong>Output:</strong> MP3 audio — 192kbps, 44.1kHz stereo
          </div>

          <div className="flex gap-3">
            <button
              onClick={convert}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Extract MP3 Audio
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              Change File
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">
            Extracting audio… this may take a moment for large files.
          </p>
          <ProgressBar progress={progress} label="Converting" />
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && audioUrl && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            <div>
              <p className="font-semibold text-green-900">Conversion complete!</p>
              <p className="text-sm text-green-700">Your MP3 is ready to download.</p>
            </div>
          </div>
          <audio controls src={audioUrl} className="w-full" />
          <div className="flex gap-3">
            <button
              onClick={download}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Download MP3
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
