"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FANCY_TEXT_STYLES } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

export default function FancyTextGeneratorClient() {
  const [text, setText] = useState("Hello World");

  const copyStyle = (converted: string, styleName: string) => {
    navigator.clipboard.writeText(converted);
    toast.success(`${styleName} style copied!`);
  };

  const copyAll = () => {
    const all = FANCY_TEXT_STYLES.map((s) => s.convert(text)).join("\n");
    navigator.clipboard.writeText(all);
    toast.success("All styles copied!");
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">Your Text</label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type anything — see it transform below..."
          maxLength={200}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">All styles update in real time</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{text.length}/200</span>
            {text && (
              <button
                onClick={copyAll}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Copy all styles
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      {text && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">{FANCY_TEXT_STYLES.length} font styles</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {FANCY_TEXT_STYLES.map((style) => {
              const converted = style.convert(text);
              return (
                <li key={style.id} className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      {style.name}
                    </p>
                    <p className="text-lg leading-snug text-slate-800 break-all">{converted}</p>
                  </div>
                  <Button onClick={() => copyStyle(converted, style.name)} variant="secondary" size="sm" className="shrink-0">Copy</Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
