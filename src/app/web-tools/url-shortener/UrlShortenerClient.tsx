"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface ShortenedLink {
  original: string;
  short: string;
}

export default function UrlShortenerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>([]);

  const isValidUrl = (val: string): boolean => {
    try { new URL(val); return true; } catch { return false; }
  };

  const shorten = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL including http:// or https://");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json() as { shortUrl?: string; error?: string };
      if (!res.ok || !data.shortUrl) {
        setError(data.error ?? "Failed to shorten URL. Please try again.");
        return;
      }
      setHistory((prev) => [{ original: trimmed, short: data.shortUrl! }, ...prev]);
      setUrl("");
      toast.success("URL shortened!");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Enter a long URL to shorten
        </label>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && shorten()}
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            disabled={loading}
          />
          <button
            onClick={shorten}
            disabled={loading || !url.trim()}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 sm:shrink-0"
          >
            {loading ? "Shortening…" : "Shorten URL"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Results */}
      {history.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {history.length} shortened link{history.length > 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear history
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {history.map((item, i) => (
              <li key={i} className="px-4 py-4 space-y-1">
                <p className="text-xs text-slate-400 truncate" title={item.original}>
                  {item.original}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={item.short}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold text-sm hover:underline"
                  >
                    {item.short}
                  </a>
                  <button
                    onClick={() => copy(item.short)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                  <Link
                    href={`/web-tools/qr-code-generator?url=${encodeURIComponent(item.short)}`}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    QR Code →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        Short links are powered by TinyURL and do not expire.
        Short links are public — do not shorten sensitive URLs.
      </p>
    </div>
  );
}
