"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import type { LsiKeyword } from "@/lib/seo-utils";

const CAT_COLORS: Record<string, string> = {
  "Semantic Pattern": "bg-red-100 text-red-700",
  "Synonym Variation": "bg-blue-100 text-blue-700",
  "Partial Match": "bg-amber-100 text-amber-700",
};

export default function LsiKeywordExplorerClient() {
  const [seed, setSeed] = useState("");
  const [keywords, setKeywords] = useState<LsiKeyword[]>([]);
  const [filter, setFilter] = useState("All");
  const [generated, setGenerated] = useState(false);

  const explore = useCallback(async () => {
    const s = seed.trim();
    if (!s) return;
    const { exploreLsiKeywords } = await import("@/lib/seo-utils");
    const results = exploreLsiKeywords(s);
    setKeywords(results);
    setFilter("All");
    setGenerated(true);
    toast.success(`Found ${results.length} LSI keywords!`);
  }, [seed]);

  const categories = ["All", ...Array.from(new Set(keywords.map((k) => k.category)))];
  const filtered = filter === "All" ? keywords : keywords.filter((k) => k.category === filter);

  const counts: Record<string, number> = {};
  for (const k of keywords) counts[k.category] = (counts[k.category] || 0) + 1;

  const copyAll = useCallback(async () => {
    const text = filtered.map((k) => k.keyword).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${filtered.length} keywords!`);
  }, [filtered]);

  const exportCsv = useCallback(() => {
    const csv = ["keyword,category", ...filtered.map((k) => `"${k.keyword}","${k.category}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lsi-keywords-${seed.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  }, [filtered, seed]);

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <span className="mt-px shrink-0">💡</span>
        <span>
          LSI (Latent Semantic Indexing) keywords help search engines understand your content's topic
          depth. Add them naturally throughout your page to improve topical authority.
        </span>
      </div>

      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Target Keyword
            </label>
            <Input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && explore()}
              placeholder="e.g. seo strategy, content marketing, web development…"
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={explore} variant="primary" size="md" disabled={!seed.trim()}>Explore</Button>
          </div>
        </div>
      </div>

      {generated && keywords.length > 0 && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(counts).map(([cat, count]) => (
              <div key={cat} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-xl font-bold text-red-600">{count}</p>
                <p className="text-xs text-slate-500">{cat}</p>
              </div>
            ))}
          </div>

          {/* Filters + actions */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  filter === c
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c} {c !== "All" && `(${counts[c] || 0})`}
              </button>
            ))}
            <div className="flex-1" />
            <Button type="button" onClick={copyAll} variant="secondary" size="sm">Copy all</Button>
            <Button type="button" onClick={exportCsv} variant="secondary" size="sm">Export CSV</Button>
          </div>

          {/* Keywords */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100">
              {filtered.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50 group"
                >
                  <span className="text-sm text-slate-700">{kw.keyword}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CAT_COLORS[kw.category] || "bg-slate-100 text-slate-600"}`}>
                      {kw.category}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(kw.keyword);
                        toast.success("Copied!");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-600 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage tips */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">How to use LSI keywords</p>
            <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
              <li>Use Semantic Pattern keywords in your main body paragraphs</li>
              <li>Add Synonym Variations to subheadings (H2/H3)</li>
              <li>Sprinkle Partial Match keywords in image alt text and captions</li>
              <li>Don't force keywords — write for readers, not bots</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
