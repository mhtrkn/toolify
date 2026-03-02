"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";

/* ---------- Minification logic ---------- */

function minifyHtml(html: string): string {
  let out = html;

  // Preserve <pre> and <textarea> content
  const preserved: string[] = [];
  out = out.replace(/<(pre|textarea|script|style)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    const idx = preserved.length;
    // For script/style blocks, collapse internal whitespace
    const inner = match.replace(/(<(?:script|style)[^>]*>)([\s\S]*?)(<\/(?:script|style)>)/i, (_, open, content, close) => {
      return open + content.replace(/\s+/g, " ").trim() + close;
    });
    preserved.push(inner);
    return `\x00PRESERVED_${idx}\x00`;
  });

  // Remove HTML comments (but not IE conditionals)
  out = out.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");

  // Collapse whitespace between tags
  out = out.replace(/>\s+</g, "><");

  // Collapse multiple spaces into one
  out = out.replace(/\s{2,}/g, " ");

  // Trim each line and remove empty lines
  out = out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("");

  // Restore preserved blocks
  preserved.forEach((block, i) => {
    out = out.replace(`\x00PRESERVED_${i}\x00`, block);
  });

  return out.trim();
}

const SAMPLE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- This is a comment that will be removed -->
    <meta charset="UTF-8" />
    <title>  My   Page  </title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <!-- Navigation -->
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <main>
      <h1>  Hello World  </h1>
      <p>
        This is some text with   extra   whitespace.
      </p>
    </main>
  </body>
</html>`;

export default function HtmlMinifierClient() {
  const [input, setInput] = useState(SAMPLE);

  const minified = useMemo(() => (input.trim() ? minifyHtml(input) : ""), [input]);

  const inputBytes = new TextEncoder().encode(input).length;
  const outputBytes = new TextEncoder().encode(minified).length;
  const savings = inputBytes > 0 ? Math.round(((inputBytes - outputBytes) / inputBytes) * 100) : 0;

  const copy = async () => {
    await navigator.clipboard.writeText(minified);
    toast.success("Copied to clipboard!");
  };

  const download = () => {
    const blob = new Blob([minified], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded minified.html");
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {minified && (
        <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm">
          <span className="text-slate-600">
            Original: <strong className="text-slate-900">{formatBytes(inputBytes)}</strong>
          </span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-600">
            Minified: <strong className="text-slate-900">{formatBytes(outputBytes)}</strong>
          </span>
          <span className={`font-semibold ${savings > 0 ? "text-green-600" : "text-slate-500"}`}>
            {savings > 0 ? `↓ ${savings}% saved` : "No reduction"}
          </span>
        </div>
      )}

      {/* Editor pair */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Input HTML</span>
            <div className="flex gap-2">
              <span className="text-xs text-slate-400">{formatBytes(inputBytes)}</span>
              <button
                onClick={() => setInput("")}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full resize-none p-4 font-mono text-xs text-slate-700 focus:outline-none"
            rows={20}
            spellCheck={false}
            placeholder="Paste your HTML here…"
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Minified HTML</span>
            <span className="text-xs text-slate-400">{formatBytes(outputBytes)}</span>
          </div>
          <textarea
            readOnly
            value={minified}
            className="w-full resize-none bg-slate-50 p-4 font-mono text-xs text-slate-700 focus:outline-none"
            rows={20}
            spellCheck={false}
            placeholder="Minified output will appear here…"
          />
        </div>
      </div>

      {/* Actions */}
      {minified && (
        <div className="flex gap-3">
          <button
            onClick={copy}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Copy Minified HTML
          </button>
          <button
            onClick={download}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Download .html
          </button>
        </div>
      )}
    </div>
  );
}
