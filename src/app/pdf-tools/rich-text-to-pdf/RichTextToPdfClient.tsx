"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressBar from "@/components/tools/ProgressBar";

type PageSize = "a4" | "letter";

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4 (210×297 mm)" },
  { value: "letter", label: "US Letter (216×279 mm)" },
];

const FONT_SIZES = ["10px", "12px", "14px", "16px", "18px", "20px", "24px"];

const MARGINS = [
  { value: "10", label: "10 mm (narrow)" },
  { value: "15", label: "15 mm" },
  { value: "20", label: "20 mm (normal)" },
  { value: "25", label: "25 mm (wide)" },
];

const TOOLBAR_BUTTONS: { cmd: string; label: string; title: string }[] = [
  { cmd: "bold", label: "<strong>B</strong>", title: "Bold (Ctrl+B)" },
  { cmd: "italic", label: "<em>I</em>", title: "Italic (Ctrl+I)" },
  { cmd: "underline", label: "<u>U</u>", title: "Underline (Ctrl+U)" },
];

const HEADING_OPTIONS = [
  { tag: "p", label: "Paragraph" },
  { tag: "h1", label: "Heading 1" },
  { tag: "h2", label: "Heading 2" },
  { tag: "h3", label: "Heading 3" },
];

export default function RichTextToPdfClient() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [fontSize, setFontSize] = useState("12px");
  const [margin, setMargin] = useState("20");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pageNumbers, setPageNumbers] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // track empty state
  const handleInput = useCallback(() => {
    const content = editorRef.current?.innerHTML ?? "";
    setIsEmpty(!content || content === "<br>" || content === "<div><br></div>");
    setError(null);
  }, []);

  // apply font size to editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontSize = fontSize;
    }
  }, [fontSize]);

  const execCmd = useCallback((cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
  }, []);

  const insertList = useCallback((ordered: boolean) => {
    editorRef.current?.focus();
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList", false);
  }, []);

  const applyHeading = useCallback((tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
  }, []);

  const generate = async () => {
    const html = editorRef.current?.innerHTML ?? "";
    if (!html || html === "<br>" || html === "<div><br></div>") {
      setError("Please enter some content before generating.");
      return;
    }

    setError(null);
    setProcessing(true);
    setProgress(15);

    try {
      const { jsPDF } = await import("jspdf");
      setProgress(35);

      const marginPx = parseInt(margin, 10);
      const isA4 = pageSize === "a4";
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: isA4 ? "a4" : "letter",
      });

      setProgress(55);

      const pageW = isA4 ? 210 : 216;
      const pageH = isA4 ? 297 : 279;
      const contentW = pageW - marginPx * 2;

      // Build a hidden iframe to render the HTML and capture via html()
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        width: ${contentW}mm;
        padding: 0;
        margin: 0;
        font-family: Arial, sans-serif;
        font-size: ${fontSize};
        color: #000;
        line-height: 1.5;
        box-sizing: border-box;
      `;
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      setProgress(70);

      await doc.html(wrapper, {
        callback: (pdfDoc) => {
          document.body.removeChild(wrapper);
          setProgress(90);

          // Header
          if (headerText.trim()) {
            const totalPages = pdfDoc.getNumberOfPages();
            for (let p = 1; p <= totalPages; p++) {
              pdfDoc.setPage(p);
              pdfDoc.setFontSize(9);
              pdfDoc.setTextColor(120);
              pdfDoc.text(headerText.trim(), marginPx, marginPx / 2 + 2, { align: "left" });
              pdfDoc.setTextColor(0);
            }
          }

          // Footer + page numbers
          if (footerText.trim() || pageNumbers) {
            const totalPages = pdfDoc.getNumberOfPages();
            for (let p = 1; p <= totalPages; p++) {
              pdfDoc.setPage(p);
              pdfDoc.setFontSize(9);
              pdfDoc.setTextColor(120);
              if (footerText.trim()) {
                pdfDoc.text(footerText.trim(), marginPx, pageH - marginPx / 2 - 2, { align: "left" });
              }
              if (pageNumbers) {
                pdfDoc.text(`${p} / ${totalPages}`, pageW - marginPx, pageH - marginPx / 2 - 2, { align: "right" });
              }
              pdfDoc.setTextColor(0);
            }
          }

          pdfDoc.save("document.pdf");
          setProgress(100);
          toast.success("PDF downloaded!");
          setProcessing(false);
        },
        margin: [marginPx, marginPx, marginPx, marginPx],
        autoPaging: "text",
        html2canvas: { scale: 0.75 },
        x: marginPx,
        y: marginPx,
        width: contentW,
        windowWidth: Math.round((contentW / 25.4) * 96),
      });
    } catch (err) {
      console.error(err);
      const msg = "Failed to generate PDF. Please try again.";
      setError(msg);
      toast.error(msg);
      setProcessing(false);
    }
  };

  const clearEditor = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    setIsEmpty(true);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">🔒</span>
        <span>Processing is done securely in your browser. No data is uploaded to any server.</span>
      </div>

      {/* PDF Options */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
        <p className="text-sm font-semibold text-slate-700">PDF Options</p>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Page Size</label>
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Font Size</label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Margin</label>
            <Select value={margin} onValueChange={setMargin}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARGINS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Optional header/footer/page numbers */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Optional</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">Header Text</label>
              <Input
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="e.g. My Document"
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">Footer Text</label>
              <Input
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Confidential"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                id="rich-page-numbers"
                checked={pageNumbers}
                onCheckedChange={(c) => setPageNumbers(c as boolean)}
              />
              <label htmlFor="rich-page-numbers" className="cursor-pointer select-none text-sm font-medium text-slate-700">
                Page Numbers
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-3 py-2">
          {/* Format buttons */}
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.cmd}
              type="button"
              title={btn.title}
              onMouseDown={(e) => { e.preventDefault(); execCmd(btn.cmd); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-slate-600 hover:bg-white hover:shadow-sm"
              dangerouslySetInnerHTML={{ __html: btn.label }}
            />
          ))}

          <span className="mx-1 h-5 w-px bg-slate-200" />

          {/* Heading selector */}
          <select
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:outline-none"
            defaultValue="p"
            onChange={(e) => applyHeading(e.target.value)}
          >
            {HEADING_OPTIONS.map((h) => (
              <option key={h.tag} value={h.tag}>{h.label}</option>
            ))}
          </select>

          <span className="mx-1 h-5 w-px bg-slate-200" />

          {/* List buttons */}
          <button
            type="button"
            title="Bullet list"
            onMouseDown={(e) => { e.preventDefault(); insertList(false); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-slate-600 hover:bg-white hover:shadow-sm"
          >
            ≡
          </button>
          <button
            type="button"
            title="Numbered list"
            onMouseDown={(e) => { e.preventDefault(); insertList(true); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-slate-600 hover:bg-white hover:shadow-sm"
          >
            1≡
          </button>

          <div className="flex-1" />

          {!isEmpty && (
            <button
              type="button"
              onClick={clearEditor}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-72 w-full p-5 text-slate-800 focus:outline-none prose prose-slate max-w-none"
          style={{ fontSize }}
          data-placeholder="Start typing your rich text here…"
        />
      </div>

      {/* Placeholder CSS */}
      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        .prose h1 { font-size: 1.75em; font-weight: 700; margin: 0.5em 0; }
        .prose h2 { font-size: 1.35em; font-weight: 600; margin: 0.5em 0; }
        .prose h3 { font-size: 1.1em; font-weight: 600; margin: 0.4em 0; }
        .prose ul { list-style: disc; padding-left: 1.5em; }
        .prose ol { list-style: decimal; padding-left: 1.5em; }
      `}</style>

      {/* Error */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ProgressBar progress={progress} label="Generating PDF…" />
        </div>
      )}

      {/* Generate button */}
      {!processing && (
        <button
          type="button"
          onClick={generate}
          disabled={isEmpty}
          className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Download PDF
        </button>
      )}
    </div>
  );
}
