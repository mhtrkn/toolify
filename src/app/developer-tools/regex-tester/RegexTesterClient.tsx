"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Match {
  index: number;
  length: number;
  value: string;
  groups: string[];
}

const FLAGS_LIST = [
  { id: "g", label: "g", title: "Global — find all matches" },
  { id: "i", label: "i", title: "Case insensitive" },
  { id: "m", label: "m", title: "Multiline (^ and $ match line start/end)" },
  { id: "s", label: "s", title: "Dot-all (. matches newlines)" },
];

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("\\b\\w{5,}\\b");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [testStr, setTestStr] = useState(
    "The quick brown fox jumps over the lazy dog.\nRegex testing made easy."
  );
  const [error, setError] = useState<string | null>(null);

  const toggleFlag = useCallback((f: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }, []);

  const flagStr = Array.from(flags).join("");

  const { regex, matches } = useMemo<{ regex: RegExp | null; matches: Match[] }>(() => {
    if (!pattern) return { regex: null, matches: [] };
    try {
      const re = new RegExp(pattern, flagStr);
      setError(null);
      const found: Match[] = [];
      let m: RegExpExecArray | null;

      if (re.global || re.sticky) {
        re.lastIndex = 0;
        while ((m = re.exec(testStr)) !== null) {
          found.push({
            index: m.index,
            length: m[0].length,
            value: m[0],
            groups: m.slice(1).map((g) => g ?? "undefined"),
          });
          if (!re.global && !re.sticky) break;
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        m = re.exec(testStr);
        if (m) {
          found.push({
            index: m.index,
            length: m[0].length,
            value: m[0],
            groups: m.slice(1).map((g) => g ?? "undefined"),
          });
        }
      }
      return { regex: re, matches: found };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex");
      return { regex: null, matches: [] };
    }
  }, [pattern, flagStr, testStr]);

  // Build highlighted HTML for the test string
  const highlightedHtml = useMemo(() => {
    if (!matches.length) return escapeHtml(testStr);
    const result: string[] = [];
    let cursor = 0;
    for (const m of matches) {
      result.push(escapeHtml(testStr.slice(cursor, m.index)));
      result.push(
        `<mark class="bg-yellow-200 rounded px-0.5">${escapeHtml(testStr.slice(m.index, m.index + m.length))}</mark>`
      );
      cursor = m.index + m.length;
    }
    result.push(escapeHtml(testStr.slice(cursor)));
    return result.join("").replace(/\n/g, "<br>");
  }, [matches, testStr]);

  const copyRegex = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    toast.success("Regex copied!");
  };

  return (
    <div className="space-y-5">
      {/* Pattern input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Regular Expression</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
            <span className="font-mono text-slate-400 text-lg select-none">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 font-mono text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              placeholder="your regex here"
              spellCheck={false}
            />
            <span className="font-mono text-slate-400 text-lg select-none">/{flagStr}</span>
            <button
              type="button"
              onClick={copyRegex}
              className="ml-2 text-xs text-slate-500 hover:text-red-600"
              title="Copy regex"
            >
              Copy
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-600 font-mono">{error}</p>
          )}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {FLAGS_LIST.map((f) => (
            <label key={f.id} className="flex items-center gap-2 cursor-pointer" title={f.title}>
              <Checkbox
                id={`flag-${f.id}`}
                checked={flags.has(f.id)}
                onCheckedChange={() => toggleFlag(f.id)}
              />
              <span className="font-mono text-sm font-semibold text-slate-700">/{f.label}</span>
              <span className="text-xs text-slate-500">{f.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Test string + highlighted preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">Test String</span>
          </div>
          <textarea
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            className="w-full resize-none p-4 font-mono text-sm text-slate-700 focus:outline-none"
            rows={10}
            placeholder="Enter the text to test against…"
            spellCheck={false}
          />
        </div>

        {/* Highlighted output */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">Match Preview</span>
            <span className={`text-xs font-medium ${matches.length ? "text-emerald-600" : "text-slate-400"}`}>
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div
            className="p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap min-h-40"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </div>

      {/* Match details */}
      {matches.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">Match Details</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex flex-wrap items-start gap-4 px-4 py-3 text-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                  {i + 1}
                </span>
                <span className="font-mono font-semibold text-slate-800">{JSON.stringify(m.value)}</span>
                <span className="text-slate-500">index: {m.index}</span>
                <span className="text-slate-500">length: {m.length}</span>
                {m.groups.length > 0 && (
                  <span className="text-slate-500">
                    groups: [{m.groups.map((g) => JSON.stringify(g)).join(", ")}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <details className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          Quick Regex Reference ▾
        </summary>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3 lg:grid-cols-4 text-xs">
          {[
            [".", "Any character (except newline)"],
            ["\\d", "Digit [0-9]"],
            ["\\w", "Word char [a-zA-Z0-9_]"],
            ["\\s", "Whitespace"],
            ["^", "Start of string/line"],
            ["$", "End of string/line"],
            ["*", "0 or more"],
            ["+", "1 or more"],
            ["?", "0 or 1 (optional)"],
            ["{n,m}", "Between n and m times"],
            ["[abc]", "Character class"],
            ["[^abc]", "Negated class"],
            ["(abc)", "Capture group"],
            ["(?:abc)", "Non-capture group"],
            ["a|b", "Alternation (a or b)"],
            ["\\b", "Word boundary"],
          ].map(([sym, desc]) => (
            <div key={sym} className="flex gap-1.5">
              <code className="shrink-0 font-mono font-semibold text-red-700">{sym}</code>
              <span className="text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
