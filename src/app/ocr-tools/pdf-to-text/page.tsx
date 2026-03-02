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
    "Extract text from PDF files online for free. Supports both digital and scanned PDFs via OCR. Copy or download extracted text instantly — no registration needed.",
  categorySlug: "ocr-tools",
  toolSlug: "pdf-to-text",
  keywords: [
    "pdf to text converter free",
    "extract text from pdf online",
    "pdf text extractor",
    "scanned pdf to text ocr",
    "copy text from pdf free",
    "pdf to txt converter online",
    "pdf text recognition free",
    "convert pdf to plain text",
    "pdf to text no software",
    "pdf ocr text extractor free",
  ],
});

const FAQS = [
  {
    question: "Does this work with scanned PDFs?",
    answer:
      "Yes. Scanned PDFs are processed with OCR to recognize text. For best results, use high-quality scans.",
  },
  {
    question: "Will formatting like tables be preserved?",
    answer:
      "Plain text is extracted. Complex layouts like tables and columns may flatten into linear text.",
  },
  {
    question: "Can I extract text from password-protected PDFs?",
    answer:
      "No. Remove the password protection first before uploading the PDF.",
  },
  {
    question: "Is there a page limit?",
    answer: "All pages are extracted with no page limit.",
  },
  {
    question: "What is the max file size?",
    answer: "PDFs up to 100MB are supported.",
  },
  {
    question: "Is my PDF sent to a server?",
    answer:
      "No. Text extraction runs in your browser using PDF.js. Your file never leaves your device.",
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
        title="PDF to Text Extractor – Extract Text from PDF Online Free"
        description="Extract all text content from a PDF file instantly. Supports digital and scanned PDFs — copy or download as .txt. Processing runs locally for complete privacy."
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
