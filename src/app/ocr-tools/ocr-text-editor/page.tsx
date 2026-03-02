import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import OcrTextEditorClient from "./OcrTextEditorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "OCR Text Editor",
  toolDescription:
    "Upload an image, extract text with AI-powered OCR, then edit it in a smart text editor. Features spell check, search & replace, undo, word/character counts, and export to TXT or DOCX — 100% free, no signup.",
  categorySlug: "ocr-tools",
  toolSlug: "ocr-text-editor",
  keywords: [
    "ocr text editor online free",
    "extract and edit text from image",
    "ocr spell check online",
    "ocr search replace text",
    "image to editable text free",
    "ocr word editor browser",
    "ocr post processing tool",
    "edit extracted text from image",
    "ocr correction tool free",
    "image text extractor editor",
  ],
});

const FAQS = [
  {
    question: "How does the OCR Text Editor work?",
    answer:
      "Upload an image — OCR extracts the text, which then appears in the editor where you can read, correct, and format it before exporting.",
  },
  {
    question: "Can I use the editor without uploading an image?",
    answer:
      "Yes. Click 'Open Empty Editor' to start with a blank document and type or paste your own text.",
  },
  {
    question: "How does spell check work?",
    answer:
      "The editor uses your browser's native spell checker. Misspelled words are underlined — right-click them for correction suggestions.",
  },
  {
    question: "How does Search & Replace work?",
    answer:
      "Click 'Search & Replace' in the toolbar, enter a search term and replacement, then hit 'Replace All'. Optionally toggle case sensitivity.",
  },
  {
    question: "How many undo levels are available?",
    answer:
      "Up to 50 undo steps are stored. Each OCR extraction and each search-replace action creates an undo point.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can copy text to clipboard, download as .txt (plain text), or export as .docx (Word-compatible document).",
  },
];

export default function OcrTextEditorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "OCR Text Editor",
          description:
            "Extract text from images with OCR and edit it in a smart editor with spell check, search & replace, and DOCX export.",
          slug: "ocr-text-editor",
          categorySlug: "ocr-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "OCR Tools", url: `${SITE_URL}/ocr-tools` },
          {
            name: "OCR Text Editor",
            url: `${SITE_URL}/ocr-tools/ocr-text-editor`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "OCR Tools", href: "/ocr-tools" },
          { label: "OCR Text Editor" },
        ]}
        title="OCR Text Editor — Extract, Correct & Export Text Free"
        description="Upload any image to extract text with AI-powered OCR, then refine it in a fully-featured browser editor. Spell check, search & replace, undo history, word counts, and one-click export to TXT or DOCX — no software or registration required."
        howToSteps={[
          {
            title: "Upload Image (or Type)",
            description:
              "Drop an image to extract text with OCR, or click 'Open Empty Editor' to start typing directly.",
          },
          {
            title: "Review & Correct",
            description:
              "The editor highlights misspelled words automatically. Use Search & Replace to fix repeated OCR errors at once.",
          },
          {
            title: "Export",
            description:
              "Copy to clipboard or download as .txt or .docx. All processing stays in your browser.",
          },
        ]}
        benefits={[
          {
            title: "Smart Text Editor",
            description:
              "Browser-native spell check, auto-capitalize, and a monospace font optimized for reviewing OCR output.",
          },
          {
            title: "Search & Replace",
            description:
              "Find any word or phrase and replace all instances at once. Case-sensitive mode available.",
          },
          {
            title: "Undo History",
            description:
              "Up to 50 undo steps so you can freely experiment without losing your work.",
          },
          {
            title: "Live Word Count",
            description:
              "Character, word, and line counts update in real time as you type.",
          },
          {
            title: "DOCX Export",
            description:
              "Download your cleaned text as a Word-compatible .docx file ready for further editing.",
          },
          {
            title: "100% Private",
            description:
              "OCR runs in your browser via Tesseract.js. No data is sent to any server.",
          },
        ]}
        faqs={FAQS}
      >
        <OcrTextEditorClient />
      </ToolPageLayout>
    </>
  );
}
