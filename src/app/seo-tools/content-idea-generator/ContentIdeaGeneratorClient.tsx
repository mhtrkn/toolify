"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import type { ContentIdea } from "@/lib/seo-utils";

const TYPE_COLORS: Record<string, string> = {
  "How-To Guide": "bg-blue-100 text-blue-700",
  "Listicle": "bg-red-100 text-red-700",
  "Case Study": "bg-red-100 text-red-700",
  "Comparison": "bg-amber-100 text-amber-700",
  "Review": "bg-orange-100 text-orange-700",
  "Tutorial": "bg-sky-100 text-sky-700",
  "Opinion Piece": "bg-pink-100 text-pink-700",
  "Research Roundup": "bg-indigo-100 text-indigo-700",
  "Interview": "bg-emerald-100 text-emerald-700",
  "Infographic Idea": "bg-rose-100 text-rose-700",
  "Video Script": "bg-purple-100 text-purple-700",
  "Email Newsletter": "bg-yellow-100 text-yellow-700",
  "Social Thread": "bg-fuchsia-100 text-fuchsia-700",
};

export default function ContentIdeaGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(async () => {
    const t = topic.trim();
    if (!t) return;
    const { generateContentIdeas } = await import("@/lib/seo-utils");
    const results = generateContentIdeas(t);
    setIdeas(results);
    setTypeFilter("All");
    setGenerated(true);
    toast.success(`Generated ${results.length} content ideas!`);
  }, [topic]);

  const allTypes = ["All", ...Array.from(new Set(ideas.map((i) => i.type)))];
  const filtered = typeFilter === "All" ? ideas : ideas.filter((i) => i.type === typeFilter);

  const copyAll = useCallback(async () => {
    const text = filtered.map((i, n) => `${n + 1}. ${i.title} [${i.type}]`).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${filtered.length} ideas!`);
  }, [filtered]);

  const exportCsv = useCallback(() => {
    const csv = [
      '"#","Title","Content Type","Angle"',
      ...filtered.map((i, n) => `${n + 1},"${i.title}","${i.type}","${i.angle}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-ideas-${topic.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  }, [filtered, topic]);

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Topic or Niche
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. content marketing, remote work, email automation…"
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={generate} variant="primary" size="md" disabled={!topic.trim()}>Generate</Button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Get blog post titles, content types, and audience angles for any topic — instantly.
        </p>
      </div>

      {generated && ideas.length > 0 && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {allTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    typeFilter === t
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Button type="button" onClick={copyAll} variant="secondary" size="sm">Copy all</Button>
            <Button type="button" onClick={exportCsv} variant="secondary" size="sm">Export CSV</Button>
          </div>

          {/* Ideas list */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100">
              {filtered.map((idea, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 group">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-700">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">{idea.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Angle: {idea.angle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TYPE_COLORS[idea.type] || "bg-slate-100 text-slate-600"}`}>
                      {idea.type}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(idea.title);
                        toast.success("Title copied!");
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
