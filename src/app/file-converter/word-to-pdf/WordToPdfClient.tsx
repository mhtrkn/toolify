"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function WordToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setPdfUrl(null);
    toast.success("File Selected", {
      description: `${files[0].name} is ready to convert.`,
    });
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    try {
      // Step 1: Convert DOCX → HTML with mammoth
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = (await import("mammoth")) as any;
      const mammoth = mod.default ?? mod;
      setProgress(20);

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setProgress(40);

      const html = result.value;

      // Step 2: Render HTML to a hidden, styled container
      const wrapper = document.createElement("div");
      wrapper.style.cssText = [
        "position: fixed",
        "top: -9999px",
        "left: -9999px",
        "width: 794px",          // A4 width at 96dpi
        "background: white",
        "color: black",
        "font-family: Georgia, serif",
        "font-size: 13px",
        "line-height: 1.6",
        "padding: 60px 80px",
        "box-sizing: border-box",
      ].join("; ");
      wrapper.innerHTML = `
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; }
          h1 { font-size: 24px; margin-bottom: 12px; font-weight: bold; }
          h2 { font-size: 20px; margin-bottom: 10px; font-weight: bold; }
          h3 { font-size: 16px; margin-bottom: 8px; font-weight: bold; }
          p  { margin-bottom: 10px; }
          ul, ol { margin-left: 24px; margin-bottom: 10px; }
          li { margin-bottom: 4px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
          td, th { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          strong { font-weight: bold; }
          em { font-style: italic; }
        </style>
        ${html}
      `;
      document.body.appendChild(wrapper);
      setProgress(55);

      // Step 3: Capture with html2canvas
      const html2canvas = (await import("html2canvas")).default;
      const pageHeight = 1123; // A4 height at 96dpi
      const pageWidth = 794;
      const totalHeight = wrapper.scrollHeight;
      setProgress(65);

      // Step 4: Generate PDF with jsPDF
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
      let y = 0;
      let firstPage = true;
      setProgress(70);

      while (y < totalHeight) {
        const canvas = await html2canvas(wrapper, {
          scale: 1,
          useCORS: true,
          y,
          height: Math.min(pageHeight, totalHeight - y),
          width: pageWidth,
          windowWidth: pageWidth,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const imgHeight = Math.min(pageHeight, totalHeight - y);

        if (!firstPage) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
        firstPage = false;
        y += pageHeight;
        setProgress(70 + Math.round(Math.min((y / totalHeight) * 25, 25)));
      }

      document.body.removeChild(wrapper);

      const pdfBlob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
      setProgress(100);
      setStatus("done");
      toast.success("Converted to PDF!", {
        description: `${file.name.replace(/\.(docx?|doc)$/i, ".pdf")} is ready to download.`,
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not convert this Word document. Please make sure it is a valid .docx file.";
      setError(msg);
      setStatus("error");
      toast.error("Conversion Failed", { description: msg });
      // Clean up wrapper if it was appended
      document.querySelectorAll("body > div[style*='-9999px']").forEach((el) =>
        document.body.removeChild(el)
      );
    }
  };

  const download = () => {
    if (!pdfUrl || !file) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = file.name.replace(/\.(docx?|doc)$/i, ".pdf");
    a.click();
    toast.success("Download Started", {
      description: "Your PDF file is being downloaded.",
    });
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPdfUrl(null);
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {status === "idle" && (
        <FileUploader
          accept=".doc,.docx"
          maxSizeMB={50}
          onFiles={handleFiles}
          label="Upload Word Document"
          hint="Supports .doc and .docx files — up to 50MB"
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
            <strong>Note:</strong> Basic formatting (headings, paragraphs, bold, italic, tables) is preserved. Complex layouts and custom fonts may differ from the original.
          </div>
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
            Converting Word document to PDF…
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
              {file.name.replace(/\.(docx?|doc)$/i, ".pdf")}
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
