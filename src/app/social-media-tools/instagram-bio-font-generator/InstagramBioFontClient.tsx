"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FANCY_TEXT_STYLES } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

export default function InstagramBioFontClient() {
  const [text, setText] = useState("Your Instagram Bio");

  const copyStyle = (converted: string) => {
    navigator.clipboard.writeText(converted);
    toast.success("Copied! Paste it into your Instagram bio.");
  };

  const copyAll = () => {
    const all = FANCY_TEXT_STYLES.map((s) => `${s.name}: ${s.convert(text)}`).join("\n");
    navigator.clipboard.writeText(all);
    toast.success("All styles copied!");
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Your Bio Text
        </label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your name, tagline, or bio text..."
          maxLength={150}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">Updates all styles live as you type</p>
          <span className="text-xs text-slate-400">{text.length}/150</span>
        </div>
      </div>

      {/* Styles Grid */}
      {text && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">{FANCY_TEXT_STYLES.length} styles available</p>
            <Button onClick={copyAll} variant="secondary" size="sm">Copy All</Button>
          </div>

          <ul className="divide-y divide-slate-100">
            {FANCY_TEXT_STYLES.map((style) => {
              const converted = style.convert(text);
              return (
                <li key={style.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">{style.name}</p>
                    <p className="truncate text-base text-slate-800 leading-snug">{converted}</p>
                  </div>
                  <Button onClick={() => copyStyle(converted)} variant="secondary" size="sm" className="shrink-0">Copy</Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
