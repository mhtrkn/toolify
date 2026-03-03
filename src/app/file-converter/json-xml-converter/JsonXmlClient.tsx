"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import { jsonToXml, xmlToJson } from "@/lib/converters/data-format";

type Mode = "json-to-xml" | "xml-to-json";
type Status = "idle" | "done" | "error";

export default function JsonXmlClient() {
  const [mode, setMode] = useState<Mode>("json-to-xml");
  const [status, setStatus] = useState<Status>("idle");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = (text: string, name?: string) => {
    setError(null);
    try {
      let result: string;
      let outName: string;
      if (mode === "json-to-xml") {
        const parsed = JSON.parse(text);
        result = jsonToXml(parsed);
        outName = (name ?? "output").replace(/\.json$/i, "") + ".xml";
      } else {
        const json = xmlToJson(text);
        result = JSON.stringify(json, null, 2);
        outName = (name ?? "output").replace(/\.xml$/i, "") + ".json";
      }
      setOutputText(result);
      setFileName(outName);
      setStatus("done");
      toast.success("Converted!", { description: outName });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed.";
      setError(msg);
      setStatus("error");
      toast.error("Conversion Failed", { description: msg });
    }
  };

  const handleFiles = async (files: File[]) => {
    const text = await files[0].text();
    setInputText(text);
    convert(text, files[0].name);
  };

  const download = () => {
    const mime = mode === "json-to-xml" ? "application/xml" : "application/json";
    const blob = new Blob([outputText], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    toast.success("Download Started");
  };

  const reset = () => {
    setStatus("idle");
    setInputText("");
    setOutputText("");
    setFileName("");
    setError(null);
  };

  const isJsonMode = mode === "json-to-xml";
  const accept = isJsonMode ? ".json" : ".xml";
  const placeholder = isJsonMode
    ? '{\n  "users": [\n    {"name": "Alice", "age": 30},\n    {"name": "Bob", "age": 25}\n  ]\n}'
    : '<?xml version="1.0"?>\n<root>\n  <user><name>Alice</name></user>\n</root>';

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        Files are automatically deleted after processing. All conversion happens in your browser.
      </p>

      {/* Mode toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <button
          onClick={() => { setMode("json-to-xml"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "json-to-xml" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          JSON → XML
        </button>
        <button
          onClick={() => { setMode(isJsonMode ? "xml-to-json" : "json-to-xml"); reset(); }}
          className="rounded-full border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"
          aria-label="Switch direction"
        >
          ⇌
        </button>
        <button
          onClick={() => { setMode("xml-to-json"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "xml-to-json" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          XML → JSON
        </button>
      </div>

      {status === "idle" && (
        <div className="space-y-4">
          <FileUploader
            accept={accept}
            maxSizeMB={20}
            onFiles={handleFiles}
            label={`Upload ${isJsonMode ? "JSON" : "XML"} File`}
            hint={`Supports standard ${isJsonMode ? ".json" : ".xml"} files — up to 20MB`}
          />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or paste text below</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <textarea
              rows={8}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={() => convert(inputText)}
              disabled={!inputText.trim()}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40"
            >
              Convert
            </button>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">✅ {fileName}</p>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Download
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-slate-200">
            {outputText.slice(0, 8000)}
            {outputText.length > 8000 ? "\n\n… (preview truncated)" : ""}
          </pre>
        </div>
      )}
    </div>
  );
}
