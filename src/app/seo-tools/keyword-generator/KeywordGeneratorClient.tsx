"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import type { GeneratedKeyword } from "@/lib/seo-utils";

type FilterType = "all" | "long-tail" | "question" | "commercial" | "lsi";

const TYPE_LABELS: Record<FilterType, string> = {
  "all": "All",
  "long-tail": "Long-tail",
  "question": "Questions",
  "commercial": "Commercial",
  "lsi": "LSI",
};

const TYPE_COLORS: Record<GeneratedKeyword["type"], string> = {
  "long-tail": "bg-red-100 text-red-700",
  "question": "bg-blue-100 text-blue-700",
  "commercial": "bg-amber-100 text-amber-700",
  "lsi": "bg-purple-100 text-purple-700",
};

export default function KeywordGeneratorClient() {
  const [seed, setSeed] = useState("");
  const [keywords, setKeywords] = useState<GeneratedKeyword[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(async () => {
    const s = seed.trim();
    if (!s) return;
    const { generateKeywords } = await import("@/lib/seo-utils");
    const results = generateKeywords(s);
    setKeywords(results);
    setFilter("all");
    setGenerated(true);
    toast.success(`Generated ${results.length} keywords!`);
  }, [seed]);

  const filtered = filter === "all" ? keywords : keywords.filter((k) => k.type === filter);

  const copyAll = useCallback(async () => {
    const text = filtered.map((k) => k.keyword).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${filtered.length} keywords!`);
  }, [filtered]);

  const exportCsv = useCallback(() => {
    const csv = ["keyword,type", ...filtered.map((k) => `"${k.keyword}","${k.type}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keywords-${seed.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  }, [filtered, seed]);

  const counts = keywords.reduce<Record<string, number>>(
    (acc, k) => { acc[k.type] = (acc[k.type] || 0) + 1; return acc; },
    {}
  );

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Seed Keyword or Topic
            </label>
            <Input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. digital marketing, web design, seo strategy…"
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={generate}
              disabled={!seed.trim()}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Generate
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Enter any topic and get long-tail, question, commercial, and LSI keyword variations instantly.
        </p>
      </div>

      {generated && keywords.length > 0 && (
        <>
          {/* Stats + filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "long-tail", "question", "commercial"] as FilterType[]).map((t) => {
              const count = t === "all" ? keywords.length : (counts[t] || 0);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    filter === t
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {TYPE_LABELS[t]} ({count})
                </button>
              );
            })}

            <div className="flex-1" />

            <button
              type="button"
              onClick={copyAll}
              className="rounded-xl border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Copy all
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Export CSV
            </button>
          </div>

          {/* Keyword grid */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100">
              {filtered.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50 group"
                >
                  <span className="text-sm text-slate-700">{kw.keyword}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TYPE_COLORS[kw.type]}`}>
                      {kw.type}
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
        </>
      )}
    </div>
  );
}
