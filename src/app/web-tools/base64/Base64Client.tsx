"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

type Direction = "encode" | "decode";
type InputMode = "text" | "file";

function safeEncode(str: string): { result: string; error: string | null } {
  try {
    return { result: btoa(unescape(encodeURIComponent(str))), error: null };
  } catch {
    return { result: "", error: "Invalid input for Base64 encoding." };
  }
}

function safeDecode(str: string): { result: string; error: string | null } {
  try {
    return { result: decodeURIComponent(escape(atob(str.trim()))), error: null };
  } catch {
    return { result: "", error: "Invalid Base64 string. Make sure it is correctly formatted." };
  }
}

export default function Base64Client() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    setText(val);
    setError(null);
    if (!val) { setResult(""); return; }
    if (direction === "encode") {
      const { result: r, error: e } = safeEncode(val);
      setResult(r);
      if (e) setError(e);
    } else {
      const { result: r, error: e } = safeDecode(val);
      setResult(r);
      if (e) setError(e);
    }
  };

  const handleDirectionChange = (d: Direction) => {
    setDirection(d);
    setError(null);
    if (!text) return;
    if (d === "encode") {
      const { result: r, error: e } = safeEncode(text);
      setResult(r);
      if (e) setError(e);
    } else {
      const { result: r, error: e } = safeDecode(text);
      setResult(r);
      if (e) setError(e);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // dataUrl = "data:<mime>;base64,<b64>"
      const b64 = dataUrl.split(",")[1];
      if (direction === "encode") {
        setFileBase64(b64);
        setResult(b64);
      } else {
        setFileBase64(b64);
        setResult(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const copy = async (val: string) => {
    await navigator.clipboard.writeText(val);
    toast.success("Copied to clipboard!");
  };

  const downloadResult = () => {
    if (!result) return;
    if (direction === "decode" && fileBase64) {
      // Try to download the decoded file
      const blob = new Blob([Uint8Array.from(atob(result.includes(",") ? result.split(",")[1] : text.trim()), (c) => c.charCodeAt(0))]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `decoded_${fileName ?? "file"}`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = direction === "encode" ? "encoded.txt" : "decoded.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Direction */}
        <div className="flex gap-2">
          {(["encode", "decode"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDirectionChange(d)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                direction === d
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {d === "encode" ? "🔒 Encode" : "🔓 Decode"}
            </button>
          ))}
        </div>
        {/* Input mode */}
        <div className="flex gap-2">
          {(["text", "file"] as InputMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setInputMode(m); setText(""); setResult(""); setError(null); setFileName(null); setFileBase64(null); }}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                inputMode === m
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {m === "text" ? "📝 Text" : "📁 File"}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 flex justify-between">
          <span>Input {direction === "encode" ? "(plain text)" : "(Base64 string)"}</span>
          {text && <span className="text-slate-400">{text.length} chars</span>}
        </div>
        {inputMode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={direction === "encode" ? "Enter text to encode…" : "Paste Base64 string to decode…"}
            className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none"
            rows={6}
            spellCheck={false}
          />
        ) : (
          <div className="p-4">
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-8 text-sm text-slate-500 hover:border-red-300 hover:bg-red-50/30 transition-colors"
            >
              <span className="text-2xl">📁</span>
              {fileName ? (
                <span className="font-medium text-slate-700">{fileName}</span>
              ) : (
                <span>Click to select a file</span>
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 flex justify-between">
            <span>Output {direction === "encode" ? "(Base64)" : "(decoded text)"}</span>
            <span className="text-slate-400">{result.length} chars</span>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={result}
              className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none bg-slate-50"
              rows={6}
            />
          </div>
          <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
            <button
              onClick={() => copy(result)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Copy Result
            </button>
            <button
              onClick={downloadResult}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Download
            </button>
            <button
              onClick={() => { setText(result); handleTextChange(result); }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              title="Use output as next input"
            >
              ↩ Use as Input
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
