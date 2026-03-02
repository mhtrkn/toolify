"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type Mode = "md-to-html" | "html-to-md";

export default function MarkdownHtmlClient() {
  const [mode, setMode] = useState<Mode>("md-to-html");
  const [input, setInput] = useState(
    "# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Live preview\n- Bidirectional conversion\n- Download result\n\n> Blockquote example\n\n```\ncode block\n```"
  );
  const [output, setOutput] = useState("");
  const [converting, setConverting] = useState(false);

  const convert = useCallback(
    async (text: string) => {
      if (!text.trim()) { setOutput(""); return; }
      setConverting(true);
      try {
        if (mode === "md-to-html") {
          const { marked } = await import("marked");
          const html = await marked(text, { breaks: true, gfm: true });
          setOutput(String(html));
        } else {
          const TurndownService = (await import("turndown")).default;
          const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
          setOutput(td.turndown(text));
        }
      } catch {
        setOutput("// Conversion error — check your input");
      } finally {
        setConverting(false);
      }
    },
    [mode]
  );

  // Debounced live conversion
  useEffect(() => {
    const id = setTimeout(() => convert(input), 300);
    return () => clearTimeout(id);
  }, [input, convert]);

  const download = () => {
    const ext = mode === "md-to-html" ? "html" : "md";
    const mime = mode === "md-to-html" ? "text/html" : "text/markdown";
    const blob = new Blob([output], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `converted.${ext}`;
    a.click();
    toast.success("Download Started", { description: `converted.${ext}` });
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() =>
      toast.success("Copied to clipboard")
    );
  };

  const switchMode = () => {
    setMode((m) => {
      const next: Mode = m === "md-to-html" ? "html-to-md" : "md-to-html";
      setInput(output);
      return next;
    });
  };

  const isMdMode = mode === "md-to-html";

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        Files are automatically deleted after processing. All conversion happens in your browser.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-1 items-center gap-2">
          <button
            onClick={() => setMode("md-to-html")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${mode === "md-to-html" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Markdown → HTML
          </button>
          <button
            onClick={switchMode}
            title="Swap input/output"
            className="rounded-full border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
          >
            ⇌
          </button>
          <button
            onClick={() => setMode("html-to-md")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${mode === "html-to-md" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            HTML → Markdown
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyOutput}
            disabled={!output}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Copy
          </button>
          <button
            onClick={download}
            disabled={!output}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            Download
          </button>
        </div>
      </div>

      {/* Split pane */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {isMdMode ? "Markdown Input" : "HTML Input"}
            </p>
            <button
              onClick={() => setInput("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          </div>
          <textarea
            className="h-80 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isMdMode ? "# Start typing Markdown here…" : "<h1>Start typing HTML here…</h1>"}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {isMdMode ? "HTML Output" : "Markdown Output"}
            </p>
            {converting && <span className="text-xs text-slate-400 animate-pulse">Converting…</span>}
          </div>
          {isMdMode ? (
            <div className="h-80 overflow-auto rounded-xl border border-slate-200 bg-white p-4">
              <div
                className="prose prose-sm max-w-none text-slate-800 [&_pre]:bg-slate-100 [&_pre]:rounded [&_pre]:p-2 [&_code]:text-xs [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            </div>
          ) : (
            <textarea
              readOnly
              className="h-80 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700"
              value={output}
            />
          )}
        </div>
      </div>

      {/* Raw HTML view toggle for MD→HTML mode */}
      {isMdMode && output && (
        <details className="rounded-xl border border-slate-200 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-slate-500 hover:text-slate-700">
            View Raw HTML Source
          </summary>
          <pre className="overflow-auto p-4 text-xs text-slate-600 border-t border-slate-100">
            {output}
          </pre>
        </details>
      )}
    </div>
  );
}
