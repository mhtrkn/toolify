"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";
import { escapeCsvValue } from "@/lib/converters/data-format";

type Mode = "excel-to-csv" | "csv-to-excel";
type Status = "idle" | "ready" | "processing" | "done" | "error";

interface SheetInfo { name: string; rows: number; cols: number }

export default function ExcelCsvClient() {
  const [mode, setMode] = useState<Mode>("excel-to-csv");
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setResultUrl(null);
    setSheets([]);

    if (mode === "excel-to-csv") {
      try {
        const XLSX = await import("xlsx");
        const ab = await f.arrayBuffer();
        const wb = XLSX.read(ab, { type: "array" });
        const infos: SheetInfo[] = wb.SheetNames.map((name) => {
          const ws = wb.Sheets[name];
          const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
          return { name, rows: range.e.r - range.s.r + 1, cols: range.e.c - range.s.c + 1 };
        });
        setSheets(infos);
        toast.success("File Ready", { description: `${infos.length} sheet${infos.length !== 1 ? "s" : ""} detected.` });
      } catch {
        toast.success("File Ready", { description: f.name });
      }
    } else {
      toast.success("File Ready", { description: f.name });
    }
    setStatus("ready");
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    try {
      const XLSX = await import("xlsx");
      setProgress(30);

      if (mode === "excel-to-csv") {
        // Excel → one CSV per sheet, zipped if multiple sheets
        const ab = await file.arrayBuffer();
        const wb = XLSX.read(ab, { type: "array" });
        setProgress(50);

        if (wb.SheetNames.length === 1) {
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false }) as unknown[][];
          const csv = data.map((row) => row.map((c) => escapeCsvValue(String(c ?? ""))).join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const outName = file.name.replace(/\.(xlsx?|xls)$/i, ".csv");
          setResultUrl(URL.createObjectURL(blob));
          setResultName(outName);
        } else {
          // Multiple sheets → ZIP with one CSV per sheet
          const JSZip = (await import("jszip")).default;
          const zip = new JSZip();
          for (const sheetName of wb.SheetNames) {
            const ws = wb.Sheets[sheetName];
            const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false }) as unknown[][];
            const csv = data.map((row) => row.map((c) => escapeCsvValue(String(c ?? ""))).join(",")).join("\n");
            zip.file(`${sheetName}.csv`, csv);
          }
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const outName = file.name.replace(/\.(xlsx?|xls)$/i, "_sheets.zip");
          setResultUrl(URL.createObjectURL(zipBlob));
          setResultName(outName);
        }
      } else {
        // CSV → Excel
        const text = await file.text();
        const wb = XLSX.utils.book_new();
        const rows: unknown[][] = text
          .trim()
          .split(/\r?\n/)
          .map((line) => line.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const outName = file.name.replace(/\.csv$/i, ".xlsx");
        setResultUrl(URL.createObjectURL(blob));
        setResultName(outName);
      }

      setProgress(100);
      setStatus("done");
      toast.success("Converted!", { description: resultName || "File ready." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed.";
      setError(msg);
      setStatus("error");
      toast.error("Conversion Failed", { description: msg });
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    a.click();
    toast.success("Download Started");
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setSheets([]);
    setStatus("idle");
    setProgress(0);
    setResultUrl(null);
    setResultName("");
    setError(null);
  };

  const isExcelMode = mode === "excel-to-csv";

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        Files are automatically deleted after processing. All conversion happens in your browser.
      </p>

      {/* Mode toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <button
          onClick={() => { setMode("excel-to-csv"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "excel-to-csv" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Excel → CSV
        </button>
        <button
          onClick={() => { setMode(isExcelMode ? "csv-to-excel" : "excel-to-csv"); reset(); }}
          className="rounded-full border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"
          aria-label="Switch direction"
        >
          ⇌
        </button>
        <button
          onClick={() => { setMode("csv-to-excel"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "csv-to-excel" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          CSV → Excel
        </button>
      </div>

      {status === "idle" && (
        <FileUploader
          accept={isExcelMode ? ".xls,.xlsx" : ".csv"}
          maxSizeMB={20}
          onFiles={handleFiles}
          label={isExcelMode ? "Upload Excel File" : "Upload CSV File"}
          hint={isExcelMode ? "Supports .xls and .xlsx — up to 20MB" : "Standard comma-separated CSV — up to 20MB"}
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isExcelMode ? "📊" : "📄"}</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          {sheets.length > 0 && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1">
              <p className="text-xs font-medium text-slate-600 mb-2">
                {sheets.length} sheet{sheets.length > 1 ? "s" : ""} detected
                {sheets.length > 1 && " — will be exported as ZIP"}:
              </p>
              {sheets.map((s) => (
                <div key={s.name} className="flex justify-between text-xs text-slate-600">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-400">{s.rows} rows × {s.cols} cols</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={convert} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">
              Convert
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
              Change File
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">Converting…</p>
          <ProgressBar progress={progress} label="Processing" />
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && resultUrl && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-4">
          <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">✅</span>
          <div>
            <p className="font-semibold text-red-900">Conversion Complete!</p>
            <p className="text-sm text-red-700 mt-1">{resultName}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              Download
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
