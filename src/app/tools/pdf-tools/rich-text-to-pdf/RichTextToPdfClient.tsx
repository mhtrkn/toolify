/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

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

// ─── Types & Constants ────────────────────────────────────────────────────────
type EditorMode = "richtext" | "markdown";
type PageSize = "a4" | "letter";

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4 (210×297 mm)" },
  { value: "letter", label: "US Letter (216×279 mm)" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px"];
const MARGINS = [
  { value: "10", label: "10 mm (narrow)" },
  { value: "15", label: "15 mm" },
  { value: "20", label: "20 mm (normal)" },
  { value: "25", label: "25 mm (wide)" },
];

const SIZE_WARN_BYTES = 10 * 1024 * 1024;

// ─── TipTap Toolbar Component ─────────────────────────────────────────────────
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-slate-200 text-slate-900"
        : "text-slate-600 hover:bg-white hover:shadow-sm"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-3 py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <b>B</b>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <i>I</i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive("underline"))}
      >
        <u>U</u>
      </button>

      <span className="mx-1 h-5 w-px bg-slate-200" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
      >
        H3
      </button>

      <span className="mx-1 h-5 w-px bg-slate-200" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        •
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
      >
        1.
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        ”
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RichTextToPdfClient() {
  const [editorMode, setEditorMode] = useState<EditorMode>("richtext");
  const [markdownInput, setMarkdownInput] = useState("");
  const [markdownHtml, setMarkdownHtml] = useState("");
  const [sizeWarning, setSizeWarning] = useState(false);

  // PDF options
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [fontSize, setFontSize] = useState("14px");
  const [margin, setMargin] = useState("20");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [pageNumbers, setPageNumbers] = useState(false);

  // Status
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // TipTap Editor Initialization
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Start writing your document here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[320px] p-5",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const bytes = new TextEncoder().encode(editor.getHTML()).length;
      setSizeWarning(bytes > SIZE_WARN_BYTES);
    },
  });

  // Markdown Parser
  useEffect(() => {
    if (editorMode !== "markdown") return;
    if (!markdownInput.trim()) {
      setMarkdownHtml("");
      return;
    }
    const id = setTimeout(async () => {
      try {
        const { marked } = await import("marked");
        const DOMPurify = (await import("isomorphic-dompurify")).default;
        const html = await Promise.resolve(
          marked.parse(markdownInput, { gfm: true, breaks: true }),
        );
        setMarkdownHtml(DOMPurify.sanitize(html as string));

        const bytes = new TextEncoder().encode(markdownInput).length;
        setSizeWarning(bytes > SIZE_WARN_BYTES);
      } catch {
        setMarkdownHtml(`<p>${markdownInput.replace(/\n/g, "<br>")}</p>`);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [markdownInput, editorMode]);

  const getHtml = (): string => {
    if (editorMode === "markdown") return markdownHtml;
    return editor?.getHTML() || "";
  };

  const clearAll = () => {
    editor?.commands.setContent("");
    setMarkdownInput("");
    setMarkdownHtml("");
    setError(null);
    setProgress(0);
    setSizeWarning(false);
  };

  // ─── Reliable PDF Generation (Canvas Y-Shift Method) ────────────────────────
  const generate = async () => {
    const rawHtml = getHtml();
    if (!rawHtml.trim() || rawHtml === "<p></p>") {
      setError("Please add some content before generating.");
      return;
    }

    setError(null);
    setProcessing(true);
    setProgress(10);

    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      setProgress(30);

      const marginMm = parseInt(margin, 10);
      const isA4 = pageSize === "a4";
      const pageW = isA4 ? 210 : 216;
      const pageH = isA4 ? 297 : 279;
      const contentW = pageW - marginMm * 2;
      const contentH = pageH - marginMm * 2;

      // 1. Create a visible container but hide it behind everything
      // html2canvas fails if display:none or top:-9999px is used aggressively in some browsers.
      const container = document.createElement("div");
      container.innerHTML = rawHtml;

      // Setup WYSIWYG Styling
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        z-index: -999;
        width: ${contentW}mm;
        background: #fff;
        color: #000;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: ${fontSize};
        line-height: 1.6;
        padding: 0;
        margin: 0;
      `;

      // Apply basic spacing for TipTap/Markdown tags
      const styleEl = document.createElement("style");
      styleEl.innerHTML = `
        h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; }
        ul { list-style-type: disc; margin-left: 2em; margin-bottom: 1em; }
        ol { list-style-type: decimal; margin-left: 2em; margin-bottom: 1em; }
        blockquote { border-left: 4px solid #ccc; padding-left: 1em; color: #666; }
        pre { background: #f4f4f4; padding: 1em; border-radius: 4px; white-space: pre-wrap; }
      `;
      container.prepend(styleEl);
      document.body.appendChild(container);

      setProgress(50);

      // 2. Take High-Res Canvas Snapshot
      const canvas = await html2canvas(container, {
        scale: 2, // High resolution for text clarity
        useCORS: true,
        logging: false,
        windowWidth: document.documentElement.offsetWidth,
      });

      document.body.removeChild(container);
      setProgress(75);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: isA4 ? "a4" : "letter",
      });

      // Calculate heights
      const imgWidth = contentW;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginMm; // Start Y position

      // Add First Page
      pdf.addImage(imgData, "PNG", marginMm, position, imgWidth, imgHeight);
      heightLeft -= contentH;

      let currentPage = 1;

      // Handle Pagination using the Y-Shift trick
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + marginMm;
        pdf.addPage();
        currentPage++;
        pdf.addImage(imgData, "PNG", marginMm, position, imgWidth, imgHeight);
        heightLeft -= contentH;
      }

      // 3. Add Header, Footer & Page Numbers
      const totalPages = currentPage;
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(9);
        pdf.setTextColor(120);

        if (headerText.trim()) {
          pdf.text(headerText.trim(), marginMm, marginMm * 0.5, {
            align: "left",
          });
        }
        if (footerText.trim()) {
          pdf.text(footerText.trim(), marginMm, pageH - marginMm * 0.5, {
            align: "left",
          });
        }
        if (pageNumbers) {
          pdf.text(
            `${p} / ${totalPages}`,
            pageW - marginMm,
            pageH - marginMm * 0.5,
            { align: "right" },
          );
        }
      }

      pdf.save("document.pdf");
      setProgress(100);
      toast.success("PDF downloaded successfully!");
      setProcessing(false);
    } catch (err) {
      console.error("[RichTextToPdf]", err);
      setError(
        "Failed to generate PDF. The content might be too complex or large.",
      );
      toast.error("PDF generation failed.");
      setProcessing(false);
    }
  };

  const hasContent =
    editorMode === "richtext" ? !editor?.isEmpty : !!markdownInput.trim();

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">🔒</span>
        <span>
          All processing happens <strong>entirely in your browser</strong>.
        </span>
      </div>

      {/* Editor mode tabs */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white w-fit">
        {(["richtext", "markdown"] as EditorMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setEditorMode(m);
              setError(null);
            }}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              editorMode === m
                ? "bg-red-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {m === "richtext" ? "✏️ Rich Text" : "# Markdown"}
          </button>
        ))}
      </div>

      {/* PDF Options */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">PDF Options</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Page Size
            </label>
            <Select
              value={pageSize}
              onValueChange={(v) => setPageSize(v as PageSize)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Font Size
            </label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
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
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Optional Overlays */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">
                Header Text
              </label>
              <Input
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="e.g. My Document"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
              <label className="text-xs font-medium text-slate-600">
                Footer Text
              </label>
              <Input
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Confidential"
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                id="rt-page-numbers"
                checked={pageNumbers}
                onCheckedChange={(c) => setPageNumbers(c as boolean)}
              />
              <label
                htmlFor="rt-page-numbers"
                className="cursor-pointer text-sm text-slate-700"
              >
                Page Numbers
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── RICH TEXT EDITOR (TipTap) ── */}
      <div className={editorMode === "richtext" ? "block" : "hidden"}>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <MenuBar editor={editor} />
          <div style={{ fontSize }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* ── MARKDOWN EDITOR ── */}
      <div
        className={
          editorMode === "markdown" ? "grid gap-4 lg:grid-cols-2" : "hidden"
        }
      >
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">
              Markdown
            </span>
          </div>
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            className="w-full flex-1 resize-y p-5 font-mono text-sm text-slate-700 focus:outline-none min-h-80"
            placeholder="# Write markdown here..."
            spellCheck={false}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-500">
              Preview
            </span>
          </div>
          <div
            className="flex-1 p-5 prose prose-slate prose-sm max-w-none overflow-auto min-h-80"
            style={{ fontSize }}
            dangerouslySetInnerHTML={{
              __html:
                markdownHtml ||
                "<p class='text-slate-400'>Preview will appear here...</p>",
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {processing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProgressBar progress={progress} label="Generating Document..." />
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={!hasContent}
            className="flex-1 rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Download PDF
          </button>
          {hasContent && (
            <button
              onClick={clearAll}
              className="px-6 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
