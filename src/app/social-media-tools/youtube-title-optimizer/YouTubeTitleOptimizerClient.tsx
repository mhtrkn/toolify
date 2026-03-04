"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateYtTitles } from "@/lib/social-utils";
import { toast } from "sonner";

export default function YouTubeTitleOptimizerClient() {
  const [draft, setDraft] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!draft.trim()) {
      toast.error("Please enter a video topic or draft title.");
      return;
    }
    setTitles(generateYtTitles(draft.trim(), niche.trim(), audience.trim() || "Beginners"));
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success("Title copied!");
  };

  const charColor = (len: number) => {
    if (len <= 60) return "text-green-600";
    if (len <= 80) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Video Topic / Draft Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. how to start a YouTube channel, keto diet plan, React hooks"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Channel Niche{" "}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. tech, cooking, finance"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Target Audience{" "}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. beginners, entrepreneurs, students"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!draft.trim()}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          Generate Titles
        </button>
      </div>

      {/* Results */}
      {titles.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">{titles.length} title variants</p>
            <button
              onClick={handleGenerate}
              className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Regenerate
            </button>
          </div>

          <ul className="divide-y divide-slate-100">
            {titles.map((title, i) => (
              <li key={i} className="flex items-start justify-between gap-3 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 leading-snug">{title}</p>
                  <span className={`text-xs font-medium ${charColor(title.length)}`}>
                    {title.length} chars
                  </span>
                </div>
                <button
                  onClick={() => copyTitle(title)}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-400">
              🟢 ≤60 chars = ideal for search &nbsp; 🟡 61–80 = acceptable &nbsp; 🔴 81+ = may be truncated
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
