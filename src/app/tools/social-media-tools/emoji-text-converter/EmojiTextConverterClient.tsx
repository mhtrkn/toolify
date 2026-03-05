"use client";

import { useState, useMemo } from "react";
import { convertToEmojiText } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

type Mode = "decorate" | "replace";

export default function EmojiTextConverterClient() {
  const [input, setInput] = useState("I love music and coffee in the morning. Fire up the star energy!");
  const [mode, setMode] = useState<Mode>("decorate");

  const result = useMemo(() => {
    if (!input.trim()) return "";
    return convertToEmojiText(input, mode);
  }, [input, mode]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied emoji text!");
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Conversion Mode</p>
          <div className="flex gap-3">
            {(["decorate", "replace"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors ${
                  mode === m
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {m === "decorate" ? "✨ Decorate" : "🔄 Replace"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {mode === "decorate"
              ? "Adds emojis after recognized keywords — your original text is kept."
              : "Replaces recognized words entirely with their emoji equivalents."}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Type your caption, post, or message..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-slate-400">{input.length} characters</p>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">Emoji Text</p>
            <Button onClick={copyResult} variant="primary" size="sm">Copy</Button>
          </div>
          <div className="p-5">
            <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
