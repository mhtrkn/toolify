"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { extractYouTubeId } from "@/lib/social-utils";
import { toast } from "sonner";

const QUALITIES = [
  { key: "maxresdefault", label: "Max Resolution", size: "1280×720" },
  { key: "hqdefault", label: "High Quality", size: "480×360" },
  { key: "mqdefault", label: "Medium Quality", size: "320×180" },
  { key: "default", label: "Standard", size: "120×90" },
] as const;

export default function YouTubeThumbnailClient() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGet = () => {
    setError(null);
    const id = extractYouTubeId(url.trim());
    if (!id) {
      setError("Could not find a valid YouTube video ID. Please paste a full YouTube URL or an 11-character video ID.");
      return;
    }
    setVideoId(id);
  };

  const handleDownload = async (quality: string) => {
    if (!videoId) return;
    try {
      const res = await fetch(`/api/yt-thumbnail?id=${videoId}&quality=${quality}`);
      if (!res.ok) {
        toast.error("That resolution is not available for this video. Try a lower quality.");
        return;
      }
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `thumbnail-${videoId}-${quality}.jpg`;
      a.click();
      URL.revokeObjectURL(objUrl);
      toast.success(`Downloaded ${quality} thumbnail!`);
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setVideoId(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          YouTube Video URL or ID
        </label>
        <div className="flex gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onKeyDown={(e) => e.key === "Enter" && handleGet()}
            className="flex-1"
          />
          <button
            onClick={handleGet}
            disabled={!url.trim()}
            className="shrink-0 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            Get Thumbnail
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Supports: youtube.com/watch?v=…, youtu.be/…, /shorts/…, and plain 11-char IDs
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Thumbnails Grid */}
      {videoId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Video ID: <span className="font-mono text-slate-900">{videoId}</span>
            </p>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Reset
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {QUALITIES.map((q) => (
              <div
                key={q.key}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                {/* Preview */}
                <div className="relative aspect-video bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/${q.key}.jpg`}
                    alt={`${q.label} thumbnail`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Info + Download */}
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{q.label}</p>
                    <p className="text-xs text-slate-400">{q.size}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(q.key)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    ↓ Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center">
            Only the thumbnail image (JPEG) is downloaded — no video content.
          </p>
        </div>
      )}
    </div>
  );
}
