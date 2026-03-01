"use client";

import { useState } from "react";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

interface SheetPreview {
  name: string;
  rows: number;
  cols: number;
}

export default function ExcelToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetPreview[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError(null);
    setPdfUrl(null);
    setSheets([]);

    try {
      const XLSX = await import("xlsx");
      const ab = await f.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const previews: SheetPreview[] = wb.SheetNames.map((name) => {
        const ws = wb.Sheets[name];
        const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
        return {
          name,
          rows: range.e.r - range.s.r + 1,
          cols: range.e.c - range.s.c + 1,
        };
      });
      setSheets(previews);
      setStatus("ready");
    } catch {
      setStatus("ready");
    }
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    try {
      const XLSX = await import("xlsx");
      const { jsPDF } = await import("jspdf");
      setProgress(20);

      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      setProgress(30);

      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 36;
      const usableWidth = pageWidth - margin * 2;

      let firstSheet = true;

      for (let si = 0; si < wb.SheetNames.length; si++) {
        const sheetName = wb.SheetNames[si];
        const ws = wb.Sheets[sheetName];
        const data: string[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
          raw: false,
        }) as string[][];

        if (data.length === 0) continue;

        if (!firstSheet) pdf.addPage();
        firstSheet = false;

        // Sheet title
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 30, 30);
        pdf.text(sheetName, margin, margin + 10);

        const startY = margin + 28;
        const colCount = Math.max(...data.map((r) => r.length));
        if (colCount === 0) continue;

        const colWidth = Math.min(usableWidth / colCount, 120);
        const rowHeight = 18;
        const fontSize = 8;

        let y = startY;

        for (let ri = 0; ri < data.length; ri++) {
          const row = data[ri];

          // New page if needed
          if (y + rowHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin + 10;
          }

          // Header row styling
          if (ri === 0) {
            pdf.setFillColor(240, 240, 245);
            pdf.rect(margin, y, colWidth * colCount, rowHeight, "F");
          }

          // Draw cells
          for (let ci = 0; ci < colCount; ci++) {
            const x = margin + ci * colWidth;
            const cellVal = String(row[ci] ?? "");

            // Cell border
            pdf.setDrawColor(200, 200, 210);
            pdf.setLineWidth(0.4);
            pdf.rect(x, y, colWidth, rowHeight, "S");

            // Cell text
            pdf.setFontSize(fontSize);
            pdf.setFont("helvetica", ri === 0 ? "bold" : "normal");
            pdf.setTextColor(ri === 0 ? 20 : 60, ri === 0 ? 20 : 60, ri === 0 ? 20 : 60);

            const maxChars = Math.floor(colWidth / (fontSize * 0.55));
            const truncated =
              cellVal.length > maxChars
                ? cellVal.slice(0, maxChars - 1) + "…"
                : cellVal;

            pdf.text(truncated, x + 3, y + rowHeight - 5);
          }

          y += rowHeight;
        }

        setProgress(30 + Math.round(((si + 1) / wb.SheetNames.length) * 60));
      }

      const blob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        "Could not convert this Excel file. Please make sure it is a valid .xlsx or .xls file."
      );
      setStatus("error");
    }
  };

  const download = () => {
    if (!pdfUrl || !file) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = file.name.replace(/\.(xlsx?|xls)$/i, ".pdf");
    a.click();
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setSheets([]);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPdfUrl(null);
  };

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader
          accept=".xls,.xlsx"
          maxSizeMB={50}
          onFiles={handleFiles}
          label="Upload Excel File"
          hint="Supports .xls and .xlsx files — up to 50MB"
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>

          {sheets.length > 0 && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1">
              <p className="text-xs font-medium text-slate-600 mb-2">
                {sheets.length} sheet{sheets.length > 1 ? "s" : ""} detected:
              </p>
              {sheets.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-xs text-slate-600"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-400">
                    {s.rows} rows × {s.cols} cols
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={convert}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Convert to PDF
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              Change File
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">
            Converting Excel to PDF…
          </p>
          <ProgressBar progress={progress} label="Processing" />
        </div>
      )}

      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {status === "done" && pdfUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </span>
          </div>
          <div>
            <p className="font-semibold text-green-900">Converted to PDF!</p>
            <p className="text-sm text-green-700 mt-1">
              {file.name.replace(/\.(xlsx?|xls)$/i, ".pdf")} · Landscape A4
              {sheets.length > 1 && ` · ${sheets.length} sheets`}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={download}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Download PDF
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
