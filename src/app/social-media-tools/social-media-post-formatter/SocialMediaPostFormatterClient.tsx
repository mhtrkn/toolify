"use client";

import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatForPlatform } from "@/lib/social-utils";
import { toast } from "sonner";

const PLATFORMS = [
  { value: "twitter", label: "Twitter / X", icon: "🐦", limit: 280 },
  { value: "instagram", label: "Instagram", icon: "📸", limit: 2200 },
  { value: "linkedin", label: "LinkedIn", icon: "💼", limit: 3000 },
  { value: "facebook", label: "Facebook", icon: "📘", limit: 63206 },
  { value: "tiktok", label: "TikTok", icon: "🎵", limit: 2200 },
] as const;

type Platform = (typeof PLATFORMS)[number]["value"];

export default function SocialMediaPostFormatterClient() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    return formatForPlatform(text, platform);
  }, [text, platform]);

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform)!;

  const progressPercent = result
    ? selectedPlatform.limit
      ? Math.min((result.charCount / selectedPlatform.limit) * 100, 100)
      : 0
    : 0;

  const progressColor =
    progressPercent >= 100
      ? "bg-red-500"
      : progressPercent >= 85
        ? "bg-amber-400"
        : "bg-green-500";

  const copyFormatted = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formatted);
    toast.success("Formatted post copied!");
  };

  return (
    <div className="space-y-6">
      {/* Input + Platform */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Platform</label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Post Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Paste or type your post here..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Character progress */}
        {result && selectedPlatform.limit && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">
                {result.charCount.toLocaleString()} / {selectedPlatform.limit.toLocaleString()} characters
              </span>
              <span className={`text-xs font-semibold ${progressPercent >= 100 ? "text-red-600" : progressPercent >= 85 ? "text-amber-600" : "text-green-600"}`}>
                {progressPercent >= 100
                  ? "Over limit"
                  : `${selectedPlatform.limit - result.charCount} remaining`}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className={`h-1.5 rounded-full transition-all ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Warnings */}
      {result && result.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1">
          {result.warnings.map((w, i) => (
            <p key={i} className="text-sm text-amber-700">
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      {/* Formatted Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {selectedPlatform.icon} Formatted for {selectedPlatform.label}
            </p>
            <button
              onClick={copyFormatted}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Copy
            </button>
          </div>
          <pre className="whitespace-pre-wrap p-5 text-sm text-slate-700 font-sans leading-relaxed max-h-80 overflow-y-auto">
            {result.formatted}
          </pre>
        </div>
      )}
    </div>
  );
}
