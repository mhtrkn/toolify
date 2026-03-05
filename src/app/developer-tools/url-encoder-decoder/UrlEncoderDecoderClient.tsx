"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import type { EncodeMode } from "@/lib/dev-utils";

type Direction = "encode" | "decode";

const MODES: { value: EncodeMode; label: string; description: string }[] = [
  {
    value: "component",
    label: "Component",
    description: "Encodes all special chars including / ? # (use for individual values)",
  },
  {
    value: "full",
    label: "Full URL",
    description: "Preserves URL structure — / : ? # & = (use for complete URLs)",
  },
  {
    value: "query",
    label: "Query String",
    description: "Encodes key=value pairs, preserving & separators",
  },
];

const EXAMPLES: Record<EncodeMode, { encode: string; decode: string }> = {
  component: {
    encode: "Hello World! #1 & more",
    decode: "Hello%20World%21%20%231%20%26%20more",
  },
  full: {
    encode: "https://example.com/search?q=hello world&lang=en",
    decode: "https://example.com/search?q=hello%20world&lang=en",
  },
  query: {
    encode: "name=John Doe&city=New York&tag=hello world",
    decode: "name=John%20Doe&city=New%20York&tag=hello%20world",
  },
};

export default function UrlEncoderDecoderClient() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [mode, setMode] = useState<EncodeMode>("component");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async () => {
    const val = input.trim();
    if (!val) { setError("Please enter a URL or text to process."); return; }
    setError(null);

    try {
      const { encodeUrl, decodeUrl } = await import("@/lib/dev-utils");
      const result = direction === "encode" ? encodeUrl(val, mode) : decodeUrl(val, mode);
      setOutput(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed.";
      setError(msg);
    }
  }, [input, direction, mode]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  }, [output]);

  const swap = useCallback(() => {
    if (output) {
      setInput(output);
      setOutput("");
      setDirection((d) => (d === "encode" ? "decode" : "encode"));
    }
  }, [output]);

  const loadExample = () => {
    const ex = EXAMPLES[mode];
    setInput(direction === "encode" ? ex.encode : ex.decode);
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">🔒</span>
        <span>All encoding/decoding runs in your browser. No data is sent anywhere.</span>
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        {/* Direction toggle */}
        <div className="flex gap-2">
          {(["encode", "decode"] as Direction[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { setDirection(d); setOutput(""); setError(null); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                direction === d
                  ? "bg-red-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {d === "encode" ? "🔒 Encode" : "🔓 Decode"}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Encoding Type</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {MODES.map((m) => (
              <label
                key={m.value}
                className={`flex flex-1 cursor-pointer items-start gap-2 rounded-xl border p-3 transition-colors ${
                  mode === m.value
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m.value}
                  checked={mode === m.value}
                  onChange={() => { setMode(m.value); setOutput(""); setError(null); }}
                  className="mt-0.5 accent-red-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">
              {direction === "encode" ? "Plain Text / URL" : "Encoded URL"}
            </span>
            <button
              type="button"
              onClick={loadExample}
              className="text-xs text-red-600 hover:underline"
            >
              Load example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none"
            rows={8}
            placeholder={EXAMPLES[mode][direction === "encode" ? "encode" : "decode"]}
            spellCheck={false}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">
              {direction === "encode" ? "Encoded Result" : "Decoded Result"}
            </span>
            {output && (
              <span className="text-xs text-slate-400">{output.length} chars</span>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none bg-slate-50"
            rows={8}
            placeholder="Result appears here…"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={process} variant="primary" size="lg" disabled={!input.trim()} className="flex-1">
          {direction === "encode" ? "🔒 Encode URL" : "🔓 Decode URL"}
        </Button>
        {output && (
          <>
            <Button type="button" onClick={copy} variant="secondary" size="lg">Copy</Button>
            <Button type="button" onClick={swap} variant="secondary" size="lg" title="Swap output to input and flip direction">⇄ Swap & Flip</Button>
          </>
        )}
      </div>

      {/* Character reference */}
      <details className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          Common Encoded Characters ▾
        </summary>
        <div className="grid grid-cols-3 gap-2 px-4 pb-4 sm:grid-cols-4 lg:grid-cols-6 text-xs">
          {[
            [" ", "%20"], ["!", "%21"], ["#", "%23"], ["$", "%24"],
            ["%", "%25"], ["&", "%26"], ["'", "%27"], ["(", "%28"],
            [")", "%29"], ["*", "%2A"], ["+", "%2B"], [",", "%2C"],
            ["/", "%2F"], [":", "%3A"], [";", "%3B"], ["=", "%3D"],
            ["?", "%3F"], ["@", "%40"], ["[", "%5B"], ["]", "%5D"],
          ].map(([char, enc]) => (
            <div key={char} className="flex gap-1.5 items-center">
              <code className="font-mono font-bold text-slate-700 w-5 text-center">{char}</code>
              <span className="text-slate-400">→</span>
              <code className="font-mono text-red-600">{enc}</code>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
