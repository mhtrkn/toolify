"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

type FileMode = "json" | "csv";

/* ---------- CSV helpers ---------- */

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

function toCsvString(rows: string[][]): string {
  return rows.map((r) => r.join(",")).join("\n");
}

/* ---------- JSON tree helpers ---------- */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function JsonTree({
  data,
  onChange,
  path = [],
}: {
  data: unknown;
  onChange: (path: (string | number)[], value: unknown) => void;
  path?: (string | number)[];
}) {
  if (Array.isArray(data)) {
    return (
      <div className="ml-4 border-l border-slate-200 pl-3">
        {data.map((item, i) => (
          <div key={i} className="py-0.5">
            <span className="text-xs font-mono text-slate-400">[{i}]</span>{" "}
            <JsonTree data={item} onChange={onChange} path={[...path, i]} />
          </div>
        ))}
      </div>
    );
  }
  if (isObject(data)) {
    return (
      <div className="ml-4 border-l border-slate-200 pl-3">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="py-0.5 flex items-start gap-1 flex-wrap">
            <span className="text-xs font-mono font-semibold text-red-700">{key}:</span>{" "}
            <JsonTree data={val} onChange={onChange} path={[...path, key]} />
          </div>
        ))}
      </div>
    );
  }
  // Leaf value
  return (
    <EditableLeaf
      value={String(data ?? "")}
      onChange={(v) => {
        // Try to preserve type
        if (typeof data === "number") onChange(path, Number(v));
        else if (typeof data === "boolean") onChange(path, v === "true");
        else onChange(path, v);
      }}
    />
  );
}

function EditableLeaf({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    setEditing(false);
    onChange(draft);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="rounded border border-red-300 px-1 py-0 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-400 w-40"
      />
    );
  }
  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="font-mono text-xs text-emerald-700 hover:underline"
      title="Click to edit"
    >
      {value === "" ? <span className="italic text-slate-400">empty</span> : value}
    </button>
  );
}

/* ---------- Deep set helper ---------- */

function deepSet(obj: unknown, path: (string | number)[], value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const next = [...obj];
    next[head as number] = deepSet(next[head as number], rest, value);
    return next;
  }
  if (isObject(obj)) {
    return { ...obj, [head]: deepSet((obj as Record<string, unknown>)[head as string], rest, value) };
  }
  return value;
}

/* ---------- Main component ---------- */

export default function JsonCsvEditorClient() {
  const [mode, setMode] = useState<FileMode>("json");
  const [rawText, setRawText] = useState("");
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadText = useCallback(
    (text: string, detectedMode?: FileMode) => {
      const m = detectedMode ?? mode;
      setRawText(text);
      setParseError(null);
      if (m === "json") {
        try {
          setJsonData(JSON.parse(text));
        } catch {
          setParseError("Invalid JSON: " + (text.length > 0 ? "check your syntax." : "paste JSON above."));
          setJsonData(null);
        }
      } else {
        setCsvRows(parseCsv(text));
      }
    },
    [mode]
  );

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const m: FileMode = ext === "csv" ? "csv" : "json";
    setMode(m);
    const reader = new FileReader();
    reader.onload = (e) => loadText(e.target?.result as string, m);
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const updateJsonLeaf = (path: (string | number)[], value: unknown) => {
    setJsonData((prev: unknown) => deepSet(prev, path, value));
  };

  const updateCsvCell = (row: number, col: number, value: string) => {
    setCsvRows((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  const exportFile = () => {
    let content: string;
    let filename: string;
    let type: string;
    if (mode === "json") {
      content = JSON.stringify(jsonData, null, 2);
      filename = "data.json";
      type = "application/json";
    } else {
      content = toCsvString(csvRows);
      filename = "data.csv";
      type = "text/csv";
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const hasData = mode === "json" ? jsonData !== null : csvRows.length > 0;

  return (
    <div className="space-y-4">
      {/* Mode + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["json", "csv"] as FileMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Open File
          </button>
          {hasData && (
            <button
              onClick={exportFile}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Export {mode.toUpperCase()}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv"
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Drag & drop / paste area */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`rounded-xl border-2 border-dashed transition-colors ${
          isDragging ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
        }`}
      >
        <textarea
          value={rawText}
          onChange={(e) => loadText(e.target.value)}
          placeholder={
            mode === "json"
              ? '{\n  "key": "value"\n}'
              : "name,age,email\nJane,28,jane@example.com"
          }
          className="w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm text-slate-700 focus:outline-none"
          rows={8}
          spellCheck={false}
        />
      </div>

      {parseError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {parseError}
        </div>
      )}

      {/* JSON tree view */}
      {mode === "json" && jsonData !== null && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-auto">
          <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
            Tree View · Click any value to edit
          </div>
          <div className="p-4 text-sm">
            <JsonTree data={jsonData} onChange={updateJsonLeaf} />
          </div>
        </div>
      )}

      {/* CSV table view */}
      {mode === "csv" && csvRows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
            Table View · Click any cell to edit
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {csvRows[0]?.map((header, ci) => (
                  <th key={ci} className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {csvRows.slice(1).map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5">
                      <EditableLeaf value={cell} onChange={(v) => updateCsvCell(ri + 1, ci, v)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
