"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";

// ── Syntax Highlighting (Raw view) ────────────────────────────────────────────
function syntaxHighlightJson(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          return /:$/.test(match)
            ? `<span class="text-slate-300 font-semibold">${match}</span>`
            : `<span class="text-emerald-400">${match}</span>`;
        }
        if (/true|false/.test(match))
          return `<span class="text-purple-400">${match}</span>`;
        if (/null/.test(match))
          return `<span class="text-slate-500 italic">${match}</span>`;
        return `<span class="text-sky-400">${match}</span>`;
      },
    );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
type Stats = {
  keys: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  maxDepth: number;
};

function computeStats(value: unknown, depth = 0): Stats {
  const s: Stats = {
    keys: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    maxDepth: depth,
  };
  if (value === null) {
    s.nulls = 1;
    return s;
  }
  if (typeof value === "string") {
    s.strings = 1;
    return s;
  }
  if (typeof value === "number") {
    s.numbers = 1;
    return s;
  }
  if (typeof value === "boolean") {
    s.booleans = 1;
    return s;
  }
  const isArr = Array.isArray(value);
  if (!isArr) s.keys += Object.keys(value as Record<string, unknown>).length;
  const children = isArr
    ? (value as unknown[])
    : Object.values(value as Record<string, unknown>);
  for (const child of children) {
    const cs = computeStats(child, depth + 1);
    s.keys += cs.keys;
    s.strings += cs.strings;
    s.numbers += cs.numbers;
    s.booleans += cs.booleans;
    s.nulls += cs.nulls;
    s.maxDepth = Math.max(s.maxDepth, cs.maxDepth);
  }
  return s;
}

// ── Highlight Helper ──────────────────────────────────────────────────────────
function hl(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded-[2px] text-slate-900 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Tree Node ─────────────────────────────────────────────────────────────────
type TreeNodeProps = {
  value: unknown;
  keyName?: string | number;
  depth: number;
  path: string;
  collapsed: Set<string>;
  toggle: (path: string) => void;
  search: string;
};

function JsonTreeNode({
  value,
  keyName,
  depth,
  path,
  collapsed,
  toggle,
  search,
}: TreeNodeProps) {
  const isCollapsed = collapsed.has(path);
  const pl = depth * 20;

  const keyEl =
    keyName !== undefined ? (
      <span>
        <span className="text-slate-600 font-semibold">
          {typeof keyName === "string" ? (
            <>
              &quot;{hl(keyName, search)}&quot;
            </>
          ) : (
            keyName
          )}
        </span>
        <span className="text-slate-400 mx-1 select-none">:</span>
      </span>
    ) : null;

  if (value === null) {
    return (
      <div
        style={{ paddingLeft: pl }}
        className="py-[2px] flex items-baseline gap-1 text-sm font-mono"
      >
        {keyEl}
        <span className="text-slate-400 italic">null</span>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div
        style={{ paddingLeft: pl }}
        className="py-[2px] flex items-baseline gap-1 text-sm font-mono"
      >
        {keyEl}
        <span className="text-purple-600 font-medium">
          {value ? "true" : "false"}
        </span>
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div
        style={{ paddingLeft: pl }}
        className="py-[2px] flex items-baseline gap-1 text-sm font-mono"
      >
        {keyEl}
        <span className="text-blue-600">{value}</span>
      </div>
    );
  }

  if (typeof value === "string") {
    const display = value.length > 300 ? `${value.slice(0, 300)}…` : value;
    return (
      <div
        style={{ paddingLeft: pl }}
        className="py-[2px] flex items-baseline gap-1 text-sm font-mono"
      >
        {keyEl}
        <span className="text-green-600 break-all">
          &quot;{hl(display, search)}&quot;
        </span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    const count = value.length;
    return (
      <div>
        <button
          style={{ paddingLeft: pl }}
          className="w-full text-left flex items-center gap-1 py-[2px] text-sm font-mono hover:bg-slate-50 rounded transition-colors group"
          onClick={() => toggle(path)}
        >
          <span className="text-slate-400 w-3.5 text-[10px] select-none shrink-0 group-hover:text-slate-600">
            {isCollapsed ? "▶" : "▼"}
          </span>
          {keyEl}
          <span className="text-slate-500">[</span>
          {isCollapsed && (
            <>
              <span className="text-slate-400 text-xs italic mx-0.5">
                {count} item{count !== 1 ? "s" : ""}
              </span>
              <span className="text-slate-500">]</span>
            </>
          )}
        </button>
        {!isCollapsed && (
          <>
            {value.map((item, i) => (
              <JsonTreeNode
                key={i}
                value={item}
                keyName={i}
                depth={depth + 1}
                path={`${path}[${i}]`}
                collapsed={collapsed}
                toggle={toggle}
                search={search}
              />
            ))}
            <div
              style={{ paddingLeft: pl }}
              className="py-[2px] text-sm font-mono text-slate-500"
            >
              ]
            </div>
          </>
        )}
      </div>
    );
  }

  if (typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    return (
      <div>
        <button
          style={{ paddingLeft: pl }}
          className="w-full text-left flex items-center gap-1 py-[2px] text-sm font-mono hover:bg-slate-50 rounded transition-colors group"
          onClick={() => toggle(path)}
        >
          <span className="text-slate-400 w-3.5 text-[10px] select-none shrink-0 group-hover:text-slate-600">
            {isCollapsed ? "▶" : "▼"}
          </span>
          {keyEl}
          <span className="text-slate-500">{"{"}</span>
          {isCollapsed && (
            <>
              <span className="text-slate-400 text-xs italic mx-0.5">
                {keys.length} key{keys.length !== 1 ? "s" : ""}
              </span>
              <span className="text-slate-500">{"}"}</span>
            </>
          )}
        </button>
        {!isCollapsed && (
          <>
            {keys.map((key) => (
              <JsonTreeNode
                key={key}
                value={(value as Record<string, unknown>)[key]}
                keyName={key}
                depth={depth + 1}
                path={`${path}.${key}`}
                collapsed={collapsed}
                toggle={toggle}
                search={search}
              />
            ))}
            <div
              style={{ paddingLeft: pl }}
              className="py-[2px] text-sm font-mono text-slate-500"
            >
              {"}"}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}

// ── Main Component ─────────────────────────────────────────────────────────────
type ViewMode = "tree" | "raw";

export default function JsonViewerClient() {
  const [rawInput, setRawInput] = useState("");
  const [parsed, setParsed] = useState<unknown>(undefined);
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasInput, setHasInput] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const formattedJson = useMemo(() => {
    if (parsed === undefined) return "";
    try {
      return JSON.stringify(parsed, null, 2);
    } catch {
      return "";
    }
  }, [parsed]);

  const stats = useMemo(
    () =>
      parsed !== undefined && parseError === null ? computeStats(parsed) : null,
    [parsed, parseError],
  );

  const handleInput = useCallback((text: string) => {
    setRawInput(text);
    const trimmed = text.trim();
    setHasInput(!!trimmed);
    if (!trimmed) {
      setParsed(undefined);
      setParseError(null);
      return;
    }
    try {
      setParsed(JSON.parse(trimmed));
      setParseError(null);
      setCollapsed(new Set());
    } catch (e) {
      setParsed(undefined);
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const text = await files[0].text();
      handleInput(text);
      toast.success("File loaded", { description: files[0].name });
    },
    [handleInput],
  );

  const toggle = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const copyJson = () => {
    navigator.clipboard
      .writeText(formattedJson)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const downloadJson = () => {
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success("Download Started");
  };

  // When search is active, expand everything so all matches are visible
  const effectiveCollapsed = search ? new Set<string>() : collapsed;

  const isValid = hasInput && parseError === null && parsed !== undefined;
  const isInvalid = hasInput && parseError !== null;

  return (
    <div className="space-y-4">
      {/* Privacy notice */}
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        All processing happens locally in your browser. No data is sent to any
        server.
      </p>

      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              JSON Input
            </p>
            {isValid && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                ✓ Valid
              </span>
            )}
            {isInvalid && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                ✗ Invalid
              </span>
            )}
          </div>
          {rawInput && (
            <button
              onClick={() => handleInput("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          className={`h-48 w-full resize-none rounded-xl border p-4 font-mono text-sm focus:outline-none focus:ring-2 transition-colors ${
            isInvalid
              ? "border-red-300 bg-red-50 text-slate-800 focus:ring-red-400"
              : isValid
                ? "border-green-300 bg-white text-slate-800 focus:ring-green-400"
                : "border-slate-200 bg-white text-slate-800 focus:ring-red-400"
          }`}
          value={rawInput}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={
            '{\n  "name": "Alice",\n  "age": 30,\n  "scores": [98, 76, 85],\n  "active": true,\n  "notes": null\n}'
          }
          spellCheck={false}
        />
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">or upload a file</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <FileUploader
          accept=".json"
          maxSizeMB={10}
          onFiles={handleFiles}
          label="Upload JSON File"
          hint="Up to 10 MB"
        />
      </div>

      {/* Parse Error */}
      {isInvalid && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-mono text-sm text-red-700"
        >
          <span className="font-semibold">Parse Error: </span>
          {parseError}
        </div>
      )}

      {/* Output */}
      {isValid && parsed !== undefined && (
        <div className="space-y-3">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {(
                [
                  { label: "Max Depth", value: stats.maxDepth },
                  { label: "Keys", value: stats.keys },
                  { label: "Strings", value: stats.strings },
                  { label: "Numbers", value: stats.numbers },
                  { label: "Booleans", value: stats.booleans },
                  { label: "Nulls", value: stats.nulls },
                ] as const
              ).map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center"
                >
                  <p className="text-lg font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
            {/* View mode tabs */}
            <div className="flex items-center gap-1 flex-1">
              <button
                onClick={() => setViewMode("tree")}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  viewMode === "tree"
                    ? "bg-red-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  viewMode === "raw"
                    ? "bg-red-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Raw JSON
              </button>
            </div>

            {/* Expand / Collapse (tree only) */}
            {viewMode === "tree" && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCollapsed(new Set())}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setCollapsed(new Set(["root"]))}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Collapse All
                </button>
              </div>
            )}

            {/* Copy + Download */}
            <div className="flex items-center gap-1">
              <button
                onClick={copyJson}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                Copy
              </button>
              <button
                onClick={downloadJson}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Download
              </button>
            </div>
          </div>

          {/* Search (tree only) */}
          {viewMode === "tree" && (
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keys and values…"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                spellCheck={false}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Tree View */}
          {viewMode === "tree" && (
            <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-4 max-h-[600px]">
              <JsonTreeNode
                value={parsed}
                depth={0}
                path="root"
                collapsed={effectiveCollapsed}
                toggle={toggle}
                search={search}
              />
            </div>
          )}

          {/* Raw JSON */}
          {viewMode === "raw" && (
            <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4 max-h-[600px]">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlightJson(formattedJson),
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasInput && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="text-3xl font-mono text-red-600">{"{}"}</span>
          </div>
          <p className="text-sm font-medium text-slate-700">
            Paste or upload a JSON file to get started
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports any valid JSON — objects, arrays, primitives
          </p>
        </div>
      )}
    </div>
  );
}
