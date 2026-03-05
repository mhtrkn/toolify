import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import RichTextToPdfClient from "./RichTextToPdfClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Rich Text to PDF",
  toolDescription:
    "Convert rich-formatted text or Markdown to PDF online — bold, italic, headings, lists, code blocks and more. Choose page size, font, margins, header, footer. 100% free, runs in your browser.",
  categorySlug: "pdf-tools",
  toolSlug: "rich-text-to-pdf",
  keywords: [
    "rich text to pdf converter online free",
    "markdown to pdf online free",
    "formatted text to pdf",
    "online rich text editor pdf export",
    "bold italic headings to pdf",
    "wysiwyg pdf creator browser",
    "text editor with formatting pdf download",
    "markdown pdf download browser",
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
      "Bold, italic, underline, Heading 1/2/3, code blocks, bullet lists, and numbered lists. In Markdown mode, blockquotes, inline code, and links are also supported. All formatting is preserved in the generated PDF.",
  },
  {
    question: "Can I use Markdown to create the PDF?",
    answer:
      "Yes. Switch to Markdown mode, type or paste your Markdown content, and watch the live HTML preview. The PDF is generated from the rendered HTML, so what you see in the preview is what you get in the PDF.",
  },
  {
    question: "Is my text uploaded to a server?",
    answer:
      "No. All processing runs entirely in your browser using jsPDF and html2canvas. Your content never leaves your device.",
  },
  {
    question: "Can I copy my content as Markdown?",
    answer:
      "Yes. Both modes include a 'Copy as Markdown' button that converts the current HTML content to clean Markdown using Turndown — useful for pasting into editors, terminals, or GitHub.",
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
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "PDF Tools", url: `${SITE_URL}/tools/pdf-tools` },
          { name: "Rich Text to PDF", url: `${SITE_URL}/tools/pdf-tools/rich-text-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "PDF Tools", href: "/tools/pdf-tools" },
          { label: "Rich Text to PDF" },
        ]}
        title="Rich Text to PDF – Free Online Formatted PDF Creator"
        description="Write rich text or paste Markdown — then download as a formatted PDF in one click. Bold, headings, lists, code blocks, and more. No upload, no server, 100% private."
        howToSteps={[
          {
            title: "Choose your input mode",
            description:
              "Use Rich Text mode to type with the WYSIWYG toolbar (bold, italic, headings, lists, code). Or switch to Markdown mode and paste any Markdown — a live preview shows exactly what the PDF will look like.",
          },
          {
            title: "Configure PDF options",
            description:
              "Choose page size (A4 or Letter), font size, margins, and optionally add a header, footer, or page numbers.",
          },
          {
            title: "Download your PDF",
            description:
              "Click 'Download PDF' to generate and save the formatted document. You can also copy the content as Markdown or HTML using the toolbar buttons.",
          },
        ]}
        benefits={[
          {
            title: "Rich Text & Markdown",
            description:
              "Two modes in one tool: WYSIWYG formatting or Markdown input with live HTML preview.",
          },
          {
            title: "Consistent rendering",
            description:
              "Inline styles are applied to every element before PDF generation, ensuring the PDF matches the preview exactly.",
          },
          {
            title: "100% browser-based",
            description:
              "Nothing is uploaded. All processing uses jsPDF and html2canvas running locally in your browser.",
          },
          {
            title: "Copy as Markdown",
            description: "One click to convert your rich text or rendered Markdown back to clean Markdown syntax using Turndown.",
          },
        ]}
        faqs={FAQS}
      >
        <RichTextToPdfClient />
      </ToolPageLayout>
    </>
  );
}
