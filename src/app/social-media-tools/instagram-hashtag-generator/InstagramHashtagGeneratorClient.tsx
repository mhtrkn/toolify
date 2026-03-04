"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateInstagramHashtags } from "@/lib/social-utils";
import { toast } from "sonner";

const TIER_CONFIG = [
  { key: "trending" as const, label: "Trending", subtitle: "High volume (1M+ posts)", color: "bg-red-50 border-red-200 text-red-700" },
  { key: "medium" as const, label: "Medium", subtitle: "100k–1M posts", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { key: "niche" as const, label: "Niche", subtitle: "Under 100k posts", color: "bg-green-50 border-green-200 text-green-700" },
];

export default function InstagramHashtagGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<{ trending: string[]; medium: string[]; niche: string[] } | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or niche.");
      return;
    }
    setHashtags(generateInstagramHashtags(topic.trim()));
  };

  const copyTier = (tags: string[]) => {
    navigator.clipboard.writeText(tags.join(" "));
    toast.success(`${tags.length} hashtags copied!`);
  };

  const copyAll = () => {
    if (!hashtags) return;
    const all = [...hashtags.trending, ...hashtags.medium, ...hashtags.niche];
    navigator.clipboard.writeText(all.join(" "));
    toast.success(`${all.length} hashtags copied!`);
  };

  const total = hashtags
    ? hashtags.trending.length + hashtags.medium.length + hashtags.niche.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Post Topic or Niche <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. travel, fitness, food, fashion, photography, business"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="flex-1"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="shrink-0 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Results */}
      {hashtags && (
        <div className="space-y-4">
          {/* Copy All */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
            <p className="text-sm font-medium text-slate-700">{total} hashtags ready</p>
            <button
              onClick={copyAll}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Copy All {total}
            </button>
          </div>

          {/* Tiers */}
          {TIER_CONFIG.map(({ key, label, subtitle, color }) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
                <div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
                    {label}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">{subtitle}</span>
                </div>
                <button
                  onClick={() => copyTier(hashtags[key])}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Copy {hashtags[key].length}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {hashtags[key].map((tag) => (
                  <span
                    key={tag}
                    onClick={() => { navigator.clipboard.writeText(tag); toast.success("Copied!"); }}
                    className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-xs text-slate-400">
            Tip: Instagram recommends using hashtags relevant to your specific post content.
          </p>
        </div>
      )}
    </div>
  );
}
