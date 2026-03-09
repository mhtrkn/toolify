import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Word to PDF",
  toolDescription:
    "Convert Word documents to PDF online for free. Preserves fonts, layout, and formatting. Supports .doc and .docx files — no Microsoft Office or account required.",
  categorySlug: "file-converter",
  toolSlug: "word-to-pdf",
  keywords: [
    "word to pdf converter free",
    "convert docx to pdf online",
    "doc to pdf converter",
    "microsoft word to pdf free",
    "word to pdf no software",
    "save word as pdf online",
    "convert word document to pdf free",
    "docx to pdf without word",
    "word file to pdf converter online",
    "word to pdf best quality",
  ],
});

const FAQS = [
  {
    question: "Does it support .doc and .docx files?",
    answer:
      "Yes. Both .doc and .docx formats are supported. DOCX (Office Open XML) typically yields the best conversion results.",
  },
  {
    question: "Will my formatting be preserved?",
    answer:
      "Core formatting like headings, paragraphs, bold, italic, lists, and tables is preserved. Complex layouts, custom fonts, or advanced Word features may differ slightly from the original.",
  },
  {
    question: "Is my document sent to a server?",
    answer:
      "No. Conversion uses mammoth.js, html2canvas, and jsPDF — all running in your browser. Your document never leaves your device.",
  },
  {
    question: "What is the maximum file size?",
    answer: "Word documents up to 50MB are supported.",
  },
];

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Word to PDF Converter",
          description: "Convert Word documents to PDF online for free.",
          slug: "word-to-pdf",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          { name: "Word to PDF", url: `${SITE_URL}/tools/file-converter/word-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "Word to PDF" },
        ]}
        title="Word to PDF Converter – Convert DOCX to PDF Free"
        description="Convert Word documents to PDF format instantly. Upload .doc or .docx and download a clean, formatted PDF — no Microsoft Office or account needed."
        howToSteps={[
          {
            title: "Upload Word File",
            description: "Click or drag to upload your .doc or .docx file.",
          },
          {
            title: "Convert",
            description:
              "Click 'Convert to PDF' to process your document in the browser.",
          },
          {
            title: "Download PDF",
            description:
              "Download your converted PDF file with one click.",
          },
        ]}
        benefits={[
          {
            title: "100% Private",
            description:
              "Conversion runs in your browser using local processing — no server uploads.",
          },
          {
            title: "Formatting Preserved",
            description:
              "Headings, paragraphs, bold, italic, lists, and tables are all preserved in the output.",
          },
          {
            title: "No Software Needed",
            description:
              "Works in any modern browser. No Word or PDF software required.",
          },
          {
            title: "Completely Free",
            description:
              "No registration, no subscription, no watermarks.",
          },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
