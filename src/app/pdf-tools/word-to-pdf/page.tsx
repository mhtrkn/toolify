import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import WordToPdfClient from "@/app/file-converter/word-to-pdf/WordToPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Word to PDF",
  toolDescription:
    "Convert Word documents to PDF online for free. Upload .doc or .docx and download a clean PDF instantly — no account or software needed.",
  categorySlug: "pdf-tools",
  toolSlug: "word-to-pdf",
  keywords: [
    "word to pdf",
    "docx to pdf converter",
    "convert word document to pdf online free",
    "doc to pdf",
  ],
});

const FAQS = [
  {
    question: "What Word formats are supported?",
    answer: "Both .doc and .docx files are supported, up to 50MB.",
  },
  {
    question: "Will the formatting be preserved?",
    answer:
      "Headings, paragraphs, bold, italic, lists, and basic tables are preserved. Complex custom layouts or embedded objects may differ slightly.",
  },
  {
    question: "Is my file uploaded to a server?",
    answer:
      "No. The conversion runs entirely in your browser using mammoth.js, html2canvas, and jsPDF. Your document never leaves your device.",
  },
  {
    question: "Can I convert password-protected Word files?",
    answer: "Password-protected Word documents are not supported. Remove the protection in Word first.",
  },
];

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Word to PDF",
          description: "Convert Word documents to PDF online for free.",
          slug: "word-to-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Word to PDF", url: `${SITE_URL}/pdf-tools/word-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Word to PDF" },
        ]}
        title="Word to PDF – Convert DOCX to PDF Online Free"
        description="Convert Word documents to PDF instantly. Upload your .doc or .docx file and download a clean PDF — no software, no account needed."
        howToSteps={[
          { title: "Upload Word File", description: "Click or drag your .doc or .docx file into the upload area." },
          { title: "Convert", description: "Click 'Convert to PDF' — the conversion runs in your browser." },
          { title: "Download PDF", description: "Download your PDF file immediately after conversion." },
        ]}
        benefits={[
          { title: "No Software Needed", description: "Convert directly in your browser — nothing to install." },
          { title: "Formatting Preserved", description: "Headings, paragraphs, bold/italic, lists, and tables are retained." },
          { title: "100% Private", description: "Your document never leaves your device — fully browser-based." },
          { title: "Free & Fast", description: "No account or payment required. Convert in seconds." },
        ]}
        faqs={FAQS}
      >
        <WordToPdfClient />
      </ToolPageLayout>
    </>
  );
}
