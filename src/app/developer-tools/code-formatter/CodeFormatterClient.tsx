"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = "json" | "html" | "css" | "js" | "sql";
type Mode = "format" | "minify";

const LANGS: { value: Language; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "js", label: "JavaScript" },
  { value: "sql", label: "SQL" },
];

const PLACEHOLDERS: Record<Language, string> = {
  json: '{"name":"John","age":30,"city":"New York"}',
  html: "<html><head><title>Hello</title></head><body><h1>World</h1></body></html>",
  css: "body{margin:0;padding:0;font-family:sans-serif;}h1{color:red;font-size:2em;}",
  js: 'function greet(name){return "Hello, "+name+"!";}console.log(greet("World"));',
  sql: "SELECT id,name,email FROM users WHERE active=1 ORDER BY name LIMIT 10;",
};

export default function CodeFormatterClient() {
  const [lang, setLang] = useState<Language>("json");
  const [mode, setMode] = useState<Mode>("format");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async () => {
    const code = input.trim();
    if (!code) { setError("Please enter some code first."); return; }
    setError(null);

    try {
      const {
        formatJson, minifyJson,
        formatHtml, minifyHtml,
        formatCss, minifyCss,
        formatJs, minifyJs,
        formatSql, minifySql,
      } = await import("@/lib/dev-utils");

      const map: Record<Language, [() => string, () => string]> = {
        json: [() => formatJson(code), () => minifyJson(code)],
        html: [() => formatHtml(code), () => minifyHtml(code)],
        css: [() => formatCss(code), () => minifyCss(code)],
        js: [() => formatJs(code), () => minifyJs(code)],
        sql: [() => formatSql(code), () => minifySql(code)],
      };

      const result = mode === "format" ? map[lang][0]() : map[lang][1]();
      setOutput(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed. Check your input.";
      setError(msg);
    }
  }, [input, lang, mode]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const ext: Record<Language, string> = { json: "json", html: "html", css: "css", js: "js", sql: "sql" };
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted.${ext[lang]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  }, [output, lang]);

  const swap = useCallback(() => {
    if (output) { setInput(output); setOutput(""); }
  }, [output]);

  const inputBytes = new TextEncoder().encode(input).length;
  const outputBytes = new TextEncoder().encode(output).length;
  const savings = inputBytes && outputBytes && mode === "minify"
    ? Math.round((1 - outputBytes / inputBytes) * 100)
    : null;

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">🔒</span>
        <span>Processing is done entirely in your browser. No code is uploaded to any server.</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Language</label>
          <Select value={lang} onValueChange={(v) => { setLang(v as Language); setOutput(""); setError(null); }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Mode</label>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {(["format", "minify"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setOutput(""); setError(null); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-red-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {m === "format" ? "✨ Beautify" : "⚡ Minify"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">Input</span>
            <span className="text-xs text-slate-400">{inputBytes > 0 ? `${inputBytes} B` : ""}</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            className="w-full resize-none p-4 font-mono text-xs text-slate-700 focus:outline-none"
            rows={20}
            placeholder={PLACEHOLDERS[lang]}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">Output</span>
            <div className="flex items-center gap-2">
              {savings !== null && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {savings}% smaller
                </span>
              )}
              {outputBytes > 0 && <span className="text-xs text-slate-400">{outputBytes} B</span>}
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full resize-none p-4 font-mono text-xs text-slate-700 focus:outline-none bg-slate-50"
            rows={20}
            placeholder="Output will appear here…"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={process}
          disabled={!input.trim()}
          className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {mode === "format" ? "✨ Beautify Code" : "⚡ Minify Code"}
        </button>

        {output && (
          <>
            <button
              type="button"
              onClick={copy}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={download}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Download
            </button>
            <button
              type="button"
              onClick={swap}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              title="Use output as input"
            >
              ⇄ Swap
            </button>
          </>
        )}
      </div>
    </div>
  );
}
