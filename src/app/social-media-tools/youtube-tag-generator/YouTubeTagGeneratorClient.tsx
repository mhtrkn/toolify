"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateYtTags } from "@/lib/social-utils";
import { toast } from "sonner";

export default function YouTubeTagGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [removed, setRemoved] = useState<Set<number>>(new Set());

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic.");
      return;
    }
    const generated = generateYtTags(topic.trim(), niche.trim());
    setTags(generated);
    setRemoved(new Set());
  };

  const visibleTags = tags.filter((_, i) => !removed.has(i));

  const copyAll = () => {
    navigator.clipboard.writeText(visibleTags.join(", "));
    toast.success(`${visibleTags.length} tags copied to clipboard!`);
  };

  const removeTag = (i: number) => {
    setRemoved((prev) => new Set([...prev, i]));
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Video Topic <span className="text-red-500">*</span>
          </label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to learn guitar, react js tutorial, healthy meal prep"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Channel Niche{" "}
            <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <Input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. music, programming, cooking, fitness"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!topic.trim()}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          Generate Tags
        </button>
      </div>

      {/* Results */}
      {tags.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {visibleTags.length} tags generated
            </p>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Copy All
              </button>
              <button
                onClick={handleGenerate}
                className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-wrap gap-2">
            {tags.map((tag, i) =>
              removed.has(i) ? null : (
                <span
                  key={i}
                  className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(i)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ),
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-400">
              Tip: YouTube allows tags up to 500 characters total. Remove less relevant tags to stay within limits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
