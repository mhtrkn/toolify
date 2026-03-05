"use client";

import { useState, useMemo } from "react";
import { formatForPlatform } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

const PLATFORMS = [
  {
    value: "twitter",
    label: "Twitter / X",
    icon: "🐦",
    limit: 280,
    hashtagLimit: 0,
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: "📸",
    limit: 2200,
    hashtagLimit: 30,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    limit: 3000,
    hashtagLimit: 0,
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: "📘",
    limit: 63206,
    hashtagLimit: 0,
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: "🎵",
    limit: 2200,
    hashtagLimit: 0,
  },
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

  // Stats Calculations
  const charCount = result?.charCount || 0;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hashtagCount = (text.match(/#/g) || []).length;

  const progressPercent = selectedPlatform.limit
    ? Math.min((charCount / selectedPlatform.limit) * 100, 100)
    : 0;

  const isOverLimit = charCount > selectedPlatform.limit;

  const progressColor = isOverLimit
    ? "bg-red-500"
    : progressPercent >= 85
      ? "bg-amber-400"
      : "bg-green-500";

  const copyFormatted = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formatted);
    toast.success(`${selectedPlatform.label} format copied!`);
  };

  const clearText = () => {
    setText("");
    toast("Text cleared.");
  };

  // Render over-limit text with highlight
  const renderFormattedText = () => {
    if (!result) return null;
    const formatted = result.formatted;
    const limit = selectedPlatform.limit;

    if (!isOverLimit) {
      return <>{formatted}</>;
    }

    const validText = formatted.slice(0, limit);
    const overText = formatted.slice(limit);

    return (
      <>
        {validText}
        <mark className="bg-red-100 text-red-800 rounded-sm">{overText}</mark>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector (Upgraded to Pills) */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPlatform(p.value)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              platform === p.value
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <span>{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-slate-700">
            Post Text
          </label>
          {text && (
            <button
              onClick={clearText}
              className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Paste or type your post here..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-colors resize-none"
        />

        {/* Extended Stats */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span>📝 {wordCount} Words</span>
          {selectedPlatform.hashtagLimit > 0 && (
            <span
              className={
                selectedPlatform.hashtagLimit &&
                hashtagCount > selectedPlatform.hashtagLimit
                  ? "text-red-500"
                  : ""
              }
            >
              #️⃣ {hashtagCount} Hashtags{" "}
              {selectedPlatform.hashtagLimit &&
                `(Max ${selectedPlatform.hashtagLimit})`}
            </span>
          )}
        </div>

        {/* Character progress */}
        {selectedPlatform.limit && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">
                <span
                  className={isOverLimit ? "text-red-600" : "text-slate-900"}
                >
                  {charCount.toLocaleString()}
                </span>{" "}
                / {selectedPlatform.limit.toLocaleString()} characters
              </span>
              <span
                className={`text-xs font-bold ${isOverLimit ? "text-red-600" : progressPercent >= 85 ? "text-amber-600" : "text-green-600"}`}
              >
                {isOverLimit
                  ? `${(charCount - selectedPlatform.limit).toLocaleString()} characters over limit`
                  : `${(selectedPlatform.limit - charCount).toLocaleString()} remaining`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Warnings */}
      {result && result.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5 shadow-sm">
          {result.warnings.map((w, i) => (
            <p
              key={i}
              className="text-sm font-medium text-amber-800 flex items-start gap-2"
            >
              <span>⚠️</span> <span>{w}</span>
            </p>
          ))}
        </div>
      )}

      {/* Formatted Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              {selectedPlatform.icon} {selectedPlatform.label} Preview
            </p>
            <Button onClick={copyFormatted} variant="primary" size="sm" disabled={isOverLimit}>Copy</Button>
          </div>
          <div className="p-5 bg-white">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed max-h-80 overflow-y-auto">
              {renderFormattedText()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
