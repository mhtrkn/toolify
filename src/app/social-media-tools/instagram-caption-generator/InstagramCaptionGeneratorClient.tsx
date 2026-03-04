"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateInstagramCaptions } from "@/lib/social-utils";
import { toast } from "sonner";

type Mood = "excited" | "motivational" | "funny" | "professional" | "aesthetic";

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "excited", label: "Excited", emoji: "✨" },
  { value: "motivational", label: "Motivational", emoji: "💪" },
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "aesthetic", label: "Aesthetic", emoji: "🌿" },
];

export default function InstagramCaptionGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState<Mood>("excited");
  const [captions, setCaptions] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter your post topic.");
      return;
    }
    setCaptions(generateInstagramCaptions(topic.trim(), mood));
  };

  const copyCaptionText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Caption copied!");
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Post Topic <span className="text-red-500">*</span>
          </label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. morning coffee ritual, gym progress, new product launch, beach vacation"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Caption Mood</label>
          <Select value={mood} onValueChange={(v) => setMood(v as Mood)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.emoji} {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic.trim()}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-40"
        >
          Generate Captions
        </button>
      </div>

      {/* Results */}
      {captions.length > 0 && (
        <div className="space-y-4">
          {captions.map((caption, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
                <p className="text-xs font-medium text-slate-500">Caption {i + 1}</p>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-400">{caption.length} chars</span>
                  <button
                    onClick={() => copyCaptionText(caption)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap p-5 text-sm text-slate-700 font-sans leading-relaxed">
                {caption}
              </pre>
            </div>
          ))}

          <button
            onClick={handleGenerate}
            className="w-full rounded-xl border border-slate-300 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Regenerate Captions
          </button>
        </div>
      )}
    </div>
  );
}
