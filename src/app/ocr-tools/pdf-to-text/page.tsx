import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import PdfToTextClient from "./PdfToTextClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PDF to Text",
  toolDescription:
    "Extract text content from PDF files online for free. Copy, download, and analyze text from any native PDF — no uploads, fully private.",
  categorySlug: "ocr-tools",
  toolSlug: "pdf-to-text",
  keywords: [
    "pdf to text",
    "extract text from pdf",
    "pdf text extractor online",
    "pdf to txt free",
    "copy text from pdf",
  ],
});

const FAQS = [
  {
    question: "What types of PDFs work with this tool?",
    answer:
      "This tool extracts text from native (text-based) PDFs that contain selectable text. For scanned or image-based PDFs, use the OCR Image to Text tool instead.",
  },
  {
    question: "Can I download the extracted text?",
    answer:
      "Yes. Click 'Download .txt' to save the extracted text as a plain text file, or use 'Copy Text' to copy it to your clipboard.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. Text extraction uses PDF.js and runs entirely in your browser. Your PDF never leaves your device.",
  },
  {
    question: "Why is the extracted text empty or garbled?",
    answer:
      "The PDF may be image-based (a scan) or use non-standard encoding. For scanned PDFs, use the OCR Image to Text tool which uses AI to recognize text from images.",
  },
];

export default function PdfToTextPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "PDF to Text Extractor",
          description: "Extract text content from PDF files online for free.",
          slug: "pdf-to-text",
          categorySlug: "ocr-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "OCR Tools", url: `${SITE_URL}/ocr-tools` },
          { name: "PDF to Text", url: `${SITE_URL}/ocr-tools/pdf-to-text` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "OCR Tools", href: "/ocr-tools" },
          { label: "PDF to Text" },
        ]}
        title="PDF to Text – Extract Text from PDF Online Free"
        description="Extract all text content from a PDF file instantly. View, copy, and download the text — processing runs locally in your browser for complete privacy."
        howToSteps={[
          {
            title: "Upload PDF",
            description: "Click or drag to upload your PDF file (up to 100MB).",
          },
          {
            title: "Extract Text",
            description:
              "Click 'Extract Text' to parse all pages and gather the text content.",
          },
          {
            title: "Copy or Download",
            description:
              "Copy the text to your clipboard or download it as a .txt file.",
          },
        ]}
        benefits={[
          {
            title: "Full Text Extraction",
            description:
              "Extracts text from all pages with page separators for easy navigation.",
          },
          {
            title: "Word & Character Count",
            description:
              "See word and character counts at a glance after extraction.",
          },
          {
            title: "100% Private",
            description:
              "Extraction runs in your browser using PDF.js — no server uploads.",
          },
          {
            title: "Download as .txt",
            description:
              "Save the extracted text as a plain text file for further use.",
          },
        ]}
        faqs={FAQS}
      >
        <PdfToTextClient />
      </ToolPageLayout>
    </>
  );
}
