import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import RichTextToPdfClient from "./RichTextToPdfClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Rich Text to PDF",
  toolDescription:
    "Convert rich-formatted text to PDF online — bold, italic, headings, lists, and more. Choose page size, font, margins, header, footer. 100% free, runs in your browser.",
  categorySlug: "pdf-tools",
  toolSlug: "rich-text-to-pdf",
  keywords: [
    "rich text to pdf converter online free",
    "formatted text to pdf",
    "online rich text editor pdf export",
    "bold italic headings to pdf",
    "wysiwyg pdf creator browser",
    "text editor with formatting pdf download",
    "html to pdf formatted online",
    "create pdf with bold text",
    "word processor pdf export free",
    "pdf from formatted text no upload",
  ],
});

const FAQS = [
  {
    question: "What formatting is supported?",
    answer:
      "Bold, italic, underline, Heading 1/2/3, bulleted lists, and numbered lists. All formatting is preserved in the generated PDF.",
  },
  {
    question: "Is my text uploaded to a server?",
    answer:
      "No. All processing runs entirely in your browser using jsPDF. Your content never leaves your device.",
  },
  {
    question: "Can I set custom margins and a header/footer?",
    answer:
      "Yes. You can choose margin size (10–25 mm), enter optional header and footer text, and enable automatic page numbering.",
  },
  {
    question: "What page sizes are supported?",
    answer: "A4 (210×297 mm) and US Letter (216×279 mm). Portrait orientation.",
  },
  {
    question: "How is Rich Text to PDF different from Text to PDF?",
    answer:
      "Text to PDF converts plain text files. Rich Text to PDF lets you format content directly in the browser — bold headings, bullet points, italic text — before exporting.",
  },
];

export default function RichTextToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Rich Text to PDF",
          description:
            "Free online rich text editor with PDF export. Add bold, headings, and lists — then download as a formatted PDF.",
          slug: "rich-text-to-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Rich Text to PDF", url: `${SITE_URL}/pdf-tools/rich-text-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Rich Text to PDF" },
        ]}
        title="Rich Text to PDF – Free Online Formatted PDF Creator"
        description="Write bold headings, bullet lists, and formatted text — then download as a PDF in one click. No upload, no server, 100% private."
        howToSteps={[
          {
            title: "Format your text",
            description:
              "Use the toolbar to apply bold, italic, headings (H1–H3), and bullet or numbered lists.",
          },
          {
            title: "Configure PDF options",
            description:
              "Choose page size (A4 or Letter), font size, margins, and optionally add a header or footer.",
          },
          {
            title: "Download your PDF",
            description:
              "Click 'Download PDF' to generate and save the formatted document to your device instantly.",
          },
        ]}
        benefits={[
          {
            title: "Formatting preserved",
            description:
              "Bold, italic, headings, and lists are rendered faithfully in the PDF output.",
          },
          {
            title: "100% browser-based",
            description:
              "Nothing is uploaded. jsPDF runs in your browser, keeping your content private.",
          },
          {
            title: "Page size & layout control",
            description:
              "Choose A4 or Letter, set margins, and add custom header/footer text.",
          },
          {
            title: "Instant download",
            description: "Click once to generate and download — no email, no account, no wait.",
          },
        ]}
        faqs={FAQS}
      >
        <RichTextToPdfClient />
      </ToolPageLayout>
    </>
  );
}
