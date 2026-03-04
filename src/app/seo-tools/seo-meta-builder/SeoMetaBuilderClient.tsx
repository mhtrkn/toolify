"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const TITLE_MAX = 60;
const TITLE_MIN = 50;
const DESC_MAX = 160;
const DESC_MIN = 140;

function CharCounter({
  value,
  min,
  max,
}: {
  value: string;
  min: number;
  max: number;
}) {
  const len = value.length;
  const color =
    len === 0 ? "text-slate-400"
    : len < min ? "text-amber-600"
    : len > max ? "text-red-600"
    : "text-emerald-600";
  return (
    <span className={`text-xs font-mono ${color}`}>
      {len} / {max}
    </span>
  );
}

export default function SeoMetaBuilderClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [output, setOutput] = useState("");

  const generate = useCallback(async () => {
    if (!title.trim() || !description.trim() || !url.trim()) {
      toast.error("Title, description, and URL are required.");
      return;
    }
    const { buildMetaTags } = await import("@/lib/seo-utils");
    const tags = buildMetaTags({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      image: ogImage.trim() || undefined,
      siteName: siteName.trim() || undefined,
      twitterHandle: twitterHandle.trim() || undefined,
    });
    setOutput(tags);
  }, [title, description, url, ogImage, siteName, twitterHandle]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Meta tags copied!");
  }, [output]);

  // SERP preview
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const titleTruncated = title.length > TITLE_MAX ? title.slice(0, TITLE_MAX) + "…" : title;
  const descTruncated = description.length > DESC_MAX ? description.slice(0, DESC_MAX) + "…" : description;

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <p className="text-sm font-semibold text-slate-700">Page Information</p>

        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Page Title <span className="text-red-500">*</span>
              </label>
              <CharCounter value={title} min={TITLE_MIN} max={TITLE_MAX} />
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Free Online Tools – PDF, Image & File Converter"
              className="rounded-xl"
            />
            {title.length > 0 && title.length < TITLE_MIN && (
              <p className="mt-1 text-xs text-amber-600">Recommended: {TITLE_MIN}–{TITLE_MAX} characters</p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <CharCounter value={description} min={DESC_MIN} max={DESC_MAX} />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Free online tools for PDF, image, and file conversion. No software to install — fast, secure, and always free."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
              rows={3}
            />
            {description.length > 0 && description.length < DESC_MIN && (
              <p className="mt-1 text-xs text-amber-600">Recommended: {DESC_MIN}–{DESC_MAX} characters</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Canonical URL <span className="text-red-500">*</span>
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourdomain.com/page-slug"
              className="rounded-xl"
              type="url"
            />
          </div>
        </div>

        {/* Optional fields */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Optional (Open Graph / Twitter)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Site Name</label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Toolify" className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Twitter Handle</label>
              <Input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@yourbrand" className="rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">OG Image URL</label>
              <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://yourdomain.com/og-image.png" className="rounded-xl" type="url" />
            </div>
          </div>
        </div>
      </div>

      {/* SERP Preview */}
      {(title || description || url) && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Google SERP Preview</p>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500 truncate">{displayUrl || "yourdomain.com"}</p>
            <p className={`mt-0.5 text-base font-medium text-blue-700 leading-snug ${title.length > TITLE_MAX ? "line-through text-red-500" : ""}`}>
              {titleTruncated || "Page Title"}
            </p>
            <p className="mt-1 text-sm text-slate-600 leading-snug line-clamp-2">
              {descTruncated || "Meta description will appear here…"}
            </p>
          </div>
          {title.length > TITLE_MAX && (
            <p className="mt-2 text-xs text-red-600">⚠️ Title exceeds {TITLE_MAX} characters and will be truncated by Google.</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={!title.trim() || !description.trim() || !url.trim()}
        className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        🏷️ Generate Meta Tags
      </button>

      {/* Output */}
      {output && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">HTML Snippet — ready to paste in &lt;head&gt;</span>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs text-slate-700 bg-slate-50 leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
