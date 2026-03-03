"use client";

import { useState, useRef } from "react";
import LottieLoader from "@/components/tools/LottieLoader";
import ProgressBar from "@/components/tools/ProgressBar";
import { toast } from "sonner";

type PageSize = "a4" | "letter";

const PAGE_DIMS: Record<PageSize, { w: number; h: number; label: string }> = {
  a4:     { w: 210, h: 297, label: "A4 (210×297mm)" },
  letter: { w: 216, h: 279, label: "US Letter (216×279mm)" },
};

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
    h1 { color: #e7000b; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
    p  { line-height: 1.7; color: #475569; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>Hello from Toolify!</h1>
  <p>This is a sample HTML document converted to PDF. Edit the HTML on the left to see a live preview.</p>
  <div class="card">
    <strong>Tip:</strong> Use inline styles for best PDF output. External fonts and remote images may not load.
  </div>
</body>
</html>`;

export default function HtmlToPdfClient() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const convert = async () => {
    if (!html.trim()) {
      setError("Please enter some HTML to convert.");
      return;
    }
    setProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      setProgress(20);

      // Write HTML into a hidden iframe for rendering
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;border:none;";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Could not access iframe document.");

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Wait for iframe content to render
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProgress(40);

      const dims = PAGE_DIMS[pageSize];
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        width: 794,
        windowWidth: 794,
      });
      setProgress(75);

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [dims.w, dims.h],
      });

      const pdfW = dims.w;
      const pdfH = (canvas.height * pdfW) / canvas.width;

      // If content is taller than one page, split across pages
      const pageH = dims.h;
      if (pdfH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
      } else {
        let y = 0;
        while (y < pdfH) {
          pdf.addImage(imgData, "JPEG", 0, -y, pdfW, pdfH);
          y += pageH;
          if (y < pdfH) pdf.addPage();
        }
      }

      setProgress(95);
      pdf.save("converted.pdf");
      setProgress(100);
      toast.success("PDF downloaded!");
    } catch (e) {
      console.error(e);
      setError("Failed to convert HTML to PDF. Check your HTML and try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Options bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Page size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-300"
          >
            {(Object.entries(PAGE_DIMS) as [PageSize, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={convert}
          disabled={processing || !html.trim()}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Convert to PDF
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">HTML Editor</span>
            <button
              onClick={() => setHtml("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full resize-none p-4 font-mono text-xs text-slate-700 focus:outline-none"
            rows={20}
            spellCheck={false}
            placeholder="Paste your HTML here…"
          />
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-2">
            <span className="text-xs font-semibold text-slate-500">Live Preview</span>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={html}
            sandbox="allow-same-origin"
            className="w-full"
            style={{ height: "480px", border: "none" }}
            title="HTML Preview"
          />
        </div>
      </div>

      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Converting HTML to PDF…" />
          <div className="mt-4">
            <ProgressBar progress={progress} label="Processing" />
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Note: External resources (fonts, images) may not render due to browser security restrictions.
        Use inline styles and base64-encoded images for best results.
      </p>
    </div>
  );
}
