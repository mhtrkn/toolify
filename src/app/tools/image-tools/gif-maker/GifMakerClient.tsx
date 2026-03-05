"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";

type Mode = "images-to-gif" | "video-to-gif" | "gif-to-mp4";

const MODE_INFO: Record<Mode, { label: string; emoji: string; description: string }> = {
  "images-to-gif": {
    label: "Images → GIF",
    emoji: "🖼️",
    description: "Combine multiple images into an animated GIF",
  },
  "video-to-gif": {
    label: "Video → GIF",
    emoji: "🎬",
    description: "Convert a video clip into an animated GIF",
  },
  "gif-to-mp4": {
    label: "GIF → MP4",
    emoji: "🎞️",
    description: "Convert an animated GIF to a silent MP4 video",
  },
};

type Status = "idle" | "ready" | "processing" | "done" | "error";

const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export default function GifMakerClient() {
  const [mode, setMode] = useState<Mode>("images-to-gif");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMime, setResultMime] = useState<"image/gif" | "video/mp4">("image/gif");
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [quality, setQuality] = useState(75); // for video-to-gif palette quality

  const ffmpegRef = useRef<import("@ffmpeg/ffmpeg").FFmpeg | null>(null);

  const handleFiles = (incoming: File[]) => {
    setFiles(incoming);
    setStatus("ready");
    setError(null);
    setResultBlob(null);
    setResultUrl(null);
    toast.success(
      incoming.length === 1
        ? `File ready: ${incoming[0].name}`
        : `${incoming.length} images ready`,
      { description: "Click the Convert button to start." }
    );
  };

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current;
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ff = new FFmpeg();
    ff.on("progress", ({ progress: p }: { progress: number }) => {
      setProgress(20 + Math.round(p * 75));
    });
    setStatusMessage("Loading FFmpeg engine…");
    setProgress(5);
    await ff.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegRef.current = ff;
    return ff;
  }, []);

  const convert = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);
    setError(null);

    try {
      const ff = await loadFFmpeg();
      const { fetchFile } = await import("@ffmpeg/util");

      setProgress(15);
      setStatusMessage("Preparing files…");

      if (mode === "images-to-gif") {
        // Write all images
        const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
        for (let i = 0; i < sortedFiles.length; i++) {
          const ext = sortedFiles[i].name.split(".").pop()?.toLowerCase() || "jpg";
          await ff.writeFile(`frame${String(i).padStart(3, "0")}.${ext}`, await fetchFile(sortedFiles[i]));
        }
        setStatusMessage("Generating GIF…");
        setProgress(20);

        const frameExt = sortedFiles[0].name.split(".").pop()?.toLowerCase() || "jpg";
        await ff.exec([
          "-framerate", String(fps),
          "-i", `frame%03d.${frameExt}`,
          "-vf", `scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=bayer`,
          "-loop", "0",
          "output.gif",
        ]);

        const data = await ff.readFile("output.gif");
        const blob = new Blob([data as unknown as BlobPart], { type: "image/gif" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultMime("image/gif");

      } else if (mode === "video-to-gif") {
        const file = files[0];
        const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
        await ff.writeFile(`input.${ext}`, await fetchFile(file));
        setStatusMessage("Converting video to GIF…");
        setProgress(20);

        await ff.exec([
          "-i", `input.${ext}`,
          "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${quality > 66 ? 256 : quality > 33 ? 128 : 64}[p];[s1][p]paletteuse=dither=bayer`,
          "-loop", "0",
          "output.gif",
        ]);

        const data = await ff.readFile("output.gif");
        const blob = new Blob([data as unknown as BlobPart], { type: "image/gif" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultMime("image/gif");

      } else {
        // gif-to-mp4
        await ff.writeFile("input.gif", await fetchFile(files[0]));
        setStatusMessage("Converting GIF to MP4…");
        setProgress(20);

        await ff.exec([
          "-i", "input.gif",
          "-movflags", "faststart",
          "-pix_fmt", "yuv420p",
          "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", // ensure even dimensions
          "output.mp4",
        ]);

        const data = await ff.readFile("output.mp4");
        const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setResultMime("video/mp4");
      }

      setProgress(100);
      setStatus("done");
      setStatusMessage("Done!");
      toast.success("Conversion complete!", { description: "Your file is ready to download." });

    } catch (e) {
      console.error(e);
      const msg =
        "Conversion failed. This tool requires a modern browser with SharedArrayBuffer support (Chrome 92+, Edge 92+, Firefox 79+).";
      setError(msg);
      toast.error("Conversion Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!resultBlob) return;
    const ext = resultMime === "video/mp4" ? "mp4" : "gif";
    const baseName =
      files.length === 1
        ? files[0].name.replace(/\.[^/.]+$/, "")
        : "output";
    downloadBlob(resultBlob, `${baseName}.${ext}`);
    toast.success("Download started");
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setStatusMessage("");
  };

  const modeAccept: Record<Mode, string> = {
    "images-to-gif": ".jpg,.jpeg,.png,.webp",
    "video-to-gif": ".mp4,.mov,.webm,.avi,.mkv",
    "gif-to-mp4": ".gif",
  };

  const modeHint: Record<Mode, string> = {
    "images-to-gif": "Upload JPG, PNG, or WebP images — sorted by filename",
    "video-to-gif": "Supports MP4, MOV, WebM, AVI — up to 200MB",
    "gif-to-mp4": "Upload a GIF file to convert to MP4",
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      {status === "idle" && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">Conversion Mode</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.entries(MODE_INFO) as [Mode, typeof MODE_INFO[Mode]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    mode === key
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-slate-50 hover:border-red-200 hover:bg-red-50/40"
                  }`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <p className={`mt-2 text-sm font-semibold ${mode === key ? "text-red-700" : "text-slate-800"}`}>
                    {info.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{info.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <p className="text-sm font-semibold text-slate-700">Settings</p>

            {mode !== "gif-to-mp4" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Frame Rate: <span className="font-semibold text-red-600">{fps} fps</span>
                  </label>
                  <input
                    type="range"
                    min={1} max={30} step={1}
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 fps (slow)</span>
                    <span>30 fps (smooth)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Width: <span className="font-semibold text-red-600">{width}px</span>
                  </label>
                  <input
                    type="range"
                    min={120} max={1280} step={40}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>120px</span>
                    <span>1280px</span>
                  </div>
                </div>
              </div>
            )}

            {mode === "video-to-gif" && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Color Quality: <span className="font-semibold text-red-600">{quality}%</span>
                </label>
                <input
                  type="range"
                  min={10} max={100} step={5}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Smaller file</span>
                  <span>More colors</span>
                </div>
              </div>
            )}

            {mode === "gif-to-mp4" && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                <strong>Note:</strong> GIF to MP4 produces a silent video with the same visual content. Output uses H.264 codec for maximum compatibility.
              </div>
            )}
          </div>

          <FileUploader
            accept={modeAccept[mode]}
            multiple={mode === "images-to-gif"}
            maxSizeMB={mode === "video-to-gif" ? 200 : 50}
            onFiles={handleFiles}
            label={`Upload ${MODE_INFO[mode].label}`}
            hint={modeHint[mode]}
          />
        </>
      )}

      {/* Ready state */}
      {status === "ready" && files.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{MODE_INFO[mode].emoji}</span>
            <div className="flex-1 min-w-0">
              {files.length === 1 ? (
                <>
                  <p className="font-medium text-slate-900 truncate">{files[0].name}</p>
                  <p className="text-sm text-slate-500">{formatBytes(files[0].size)}</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-900">{files.length} images selected</p>
                  <p className="text-sm text-slate-500">
                    Total: {formatBytes(files.reduce((s, f) => s + f.size, 0))} · Sorted by filename
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700 space-y-1">
            {mode !== "gif-to-mp4" && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frame rate</span>
                  <span className="font-medium">{fps} fps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Output width</span>
                  <span className="font-medium">{width}px (height auto)</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Output format</span>
              <span className="font-semibold text-red-600">
                {mode === "gif-to-mp4" ? "MP4" : "GIF"}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
            <strong>Note:</strong> FFmpeg WASM (~30MB) is loaded on first use. This may take 10–30 seconds on slower connections.
          </div>

          <div className="flex gap-3">
            <Button onClick={convert} variant="primary" size="lg" className="flex-1">
              Convert {MODE_INFO[mode].label}
            </Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change</Button>
          </div>
        </div>
      )}

      {/* Processing state */}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message={statusMessage || "Processing…"} />
          <p className="mt-2 text-center text-sm text-slate-500">Large files may take a minute. Please keep this tab open.</p>
          <div className="mt-4"><ProgressBar progress={progress} label="Converting" /></div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && error && (
        <div className="space-y-3">
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
          <Button onClick={reset} variant="secondary" size="md">Try Again</Button>
        </div>
      )}

      {/* Done state */}
      {status === "done" && resultUrl && resultBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">Conversion complete!</p>
              <p className="text-sm text-green-700">
                Output size: {formatBytes(resultBlob.size)}
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden border border-green-200 bg-white">
            {resultMime === "image/gif" ? (
              <img
                src={resultUrl}
                alt="Converted GIF preview"
                className="max-h-72 mx-auto object-contain block"
              />
            ) : (
              <video
                src={resultUrl}
                controls
                autoPlay
                loop
                muted
                className="max-h-72 mx-auto block w-full"
              />
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={download} variant="primary" size="lg" className="flex-1">
              Download {resultMime === "video/mp4" ? "MP4" : "GIF"}
            </Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">Convert Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
