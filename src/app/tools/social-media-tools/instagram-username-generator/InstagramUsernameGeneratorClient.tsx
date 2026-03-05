"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateInstagramUsernames } from "@/lib/social-utils";
import { toast } from "sonner";
import Button from "@/components/ui/button";

export default function InstagramUsernameGeneratorClient() {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!name.trim() && !niche.trim()) {
      toast.error("Please enter at least a name or niche.");
      return;
    }
    setUsernames(generateInstagramUsernames(name.trim(), niche.trim()));
  };

  const copyUsername = (u: string) => {
    navigator.clipboard.writeText(u);
    toast.success(`@${u} copied!`);
  };

  const lengthColor = (len: number) => {
    if (len <= 15) return "text-green-600";
    if (len <= 25) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Your Name or Brand
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Emma, TechBrand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Your Niche / Content Type
            </label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. photography, fitness, cooking, travel"
            />
          </div>
        </div>
        <Button onClick={handleGenerate} variant="primary" size="lg" disabled={!name.trim() && !niche.trim()} className="w-full">
          Generate Usernames
        </Button>
      </div>

      {/* Results */}
      {usernames.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">{usernames.length} username ideas</p>
            <Button onClick={handleGenerate} variant="secondary" size="sm">Regenerate</Button>
          </div>

          <ul className="divide-y divide-slate-100">
            {usernames.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-800">@{u}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${lengthColor(u.length)}`}>
                    {u.length} chars
                  </span>
                  <Button onClick={() => copyUsername(u)} variant="secondary" size="sm">Copy</Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-400">
              🟢 ≤15 chars = ideal &nbsp; 🟡 16–25 = acceptable &nbsp; 🔴 26–30 = long but valid
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Check availability by trying the username in Instagram's profile settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
