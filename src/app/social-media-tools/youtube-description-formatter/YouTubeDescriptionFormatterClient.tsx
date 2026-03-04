"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateYtDescription } from "@/lib/social-utils";
import { toast } from "sonner";

export default function YouTubeDescriptionFormatterClient() {
  const [title, setTitle] = useState("");
  const [channelName, setChannelName] = useState("");
  const [summary, setSummary] = useState("");
  const [timestamps, setTimestamps] = useState("");
  const [links, setLinks] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [cta, setCta] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!title.trim()) {
      toast.error("Please enter your video title.");
      return;
    }
    const desc = generateYtDescription({ title, channelName, summary, timestamps, links, hashtags, cta });
    setResult(desc);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Description copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Video Title <span className="text-red-500">*</span>
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to Learn Python in 2025" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Channel Name{" "}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Input value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="e.g. TechWithJohn" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Video Summary / Hook{" "}
            <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="Briefly describe what viewers will learn or experience in this video..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Timestamps{" "}
            <span className="text-xs font-normal text-slate-400">(optional — one per line)</span>
          </label>
          <textarea
            value={timestamps}
            onChange={(e) => setTimestamps(e.target.value)}
            rows={4}
            placeholder={"00:00 Intro\n01:30 What is Python?\n05:00 Install Python\n10:00 Your First Script\n20:00 Conclusion"}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Links & Resources{" "}
            <span className="text-xs font-normal text-slate-400">(optional — one per line)</span>
          </label>
          <textarea
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            rows={3}
            placeholder={"Website: https://example.com\nInstagram: @yourhandle\nFree Template: https://example.com/template"}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Hashtags{" "}
              <span className="text-xs font-normal text-slate-400">(space or comma separated)</span>
            </label>
            <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="python programming coding tutorial" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Custom CTA{" "}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Leave blank for default subscribe CTA" />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!title.trim()}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          Generate Description
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {result.length} / 5000 characters
            </p>
            <button
              onClick={copyResult}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Copy Description
            </button>
          </div>
          <pre className="whitespace-pre-wrap p-5 text-sm text-slate-700 font-sans leading-relaxed max-h-96 overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
