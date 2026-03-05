"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateHashtags } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

type Platform = "instagram" | "twitter" | "tiktok" | "youtube" | "linkedin" | "general";

const PLATFORMS: { value: Platform; label: string; icon: string; rec: string }[] = [
  { value: "instagram", label: "Instagram", icon: "📸", rec: "20–30 hashtags" },
  { value: "twitter", label: "Twitter / X", icon: "🐦", rec: "1–3 hashtags" },
  { value: "tiktok", label: "TikTok", icon: "🎵", rec: "3–7 hashtags" },
  { value: "linkedin", label: "LinkedIn", icon: "💼", rec: "3–5 hashtags" },
  { value: "youtube", label: "YouTube", icon: "🎬", rec: "3–5 hashtags" },
  { value: "general", label: "General", icon: "🌐", rec: "Any platform" },
];

const TIER_CONFIG = [
  { key: "trending" as const, label: "Trending", subtitle: "Broad audience", color: "bg-red-50 border-red-200 text-red-700" },
  { key: "medium" as const, label: "Medium", subtitle: "Balanced reach", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { key: "niche" as const, label: "Niche", subtitle: "Targeted audience", color: "bg-green-50 border-green-200 text-green-700" },
];

export default function HashtagGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [hashtags, setHashtags] = useState<{ trending: string[]; medium: string[]; niche: string[] } | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or keyword.");
      return;
    }
    setHashtags(generateHashtags(topic.trim(), platform));
  };

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform)!;

  const copyTier = (tags: string[], label: string) => {
    navigator.clipboard.writeText(tags.join(" "));
    toast.success(`${tags.length} ${label} hashtags copied!`);
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
      {/* Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Topic / Keyword <span className="text-red-500">*</span>
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. travel, fitness, food, technology"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>
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
        </div>

        {platform && (
          <p className="text-xs text-slate-500">
            💡 Recommended for {selectedPlatform.label}: <strong>{selectedPlatform.rec}</strong>
          </p>
        )}

        <Button onClick={handleGenerate} variant="primary" size="lg" disabled={!topic.trim()} className="w-full">
          Generate Hashtags
        </Button>
      </div>

      {/* Results */}
      {hashtags && (
        <div className="space-y-4">
          {/* Copy All */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {total} hashtags for {selectedPlatform.icon} {selectedPlatform.label}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} variant="secondary" size="sm">Regenerate</Button>
              <Button onClick={copyAll} variant="primary" size="sm">Copy All</Button>
            </div>
          </div>

          {TIER_CONFIG.map(({ key, label, subtitle, color }) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
                    {label}
                  </span>
                  <span className="text-xs text-slate-400">{subtitle}</span>
                </div>
                <Button onClick={() => copyTier(hashtags[key], label)} variant="secondary" size="sm">Copy {hashtags[key].length}</Button>
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
        </div>
      )}
    </div>
  );
}
