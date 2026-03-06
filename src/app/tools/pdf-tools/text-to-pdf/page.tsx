import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import TextToPdfClient from "./TextToPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Text to PDF",
  customTitle: "Text to PDF Converter – Free Online Tool",
  toolDescription:
    "Convert plain text or .txt files to a downloadable PDF in seconds. Choose page size, font, margins, and line spacing. 100% free, browser-based, no upload required.",
  categorySlug: "web-tools",
  toolSlug: "text-to-pdf",
  keywords: [
    "text to pdf converter free",
    "convert txt to pdf online",
    "plain text to pdf generator",
    "free text to pdf no signup",
    "online txt to pdf converter",
    "convert notepad text to pdf",
    "text file to pdf download",
    "browser based pdf generator",
    "text to pdf with custom font",
    "free pdf creator from text",
    "create pdf from text online",
    "text to pdf a4 letter size",
  ],
});

const FAQS = [
  {
    question: "Is my text uploaded to a server?",
    answer:
      "No. All processing happens entirely inside your browser using the jsPDF library. Your text never leaves your device.",
  },
  {
    question: "What file formats can I upload?",
    answer:
      "You can upload plain-text files (.txt). Paste any text directly or drag a .txt file into the editor.",
  },
  {
    question: "What page sizes are supported?",
    answer:
      "A4 (210×297 mm) and US Letter (216×279 mm) are both supported. You can switch between them before generating the PDF.",
  },
  {
    question: "Can I add a header, footer, or page numbers?",
    answer:
      "Yes. Expand the Optional section to add custom header text, footer text, and automatic page numbers.",
  },
  {
    question: "How large a text file can I convert?",
    answer:
      "The tool supports .txt files up to 10 MB. Very long documents are automatically paginated across as many PDF pages as needed.",
  },
  {
    question: "What fonts are available?",
    answer:
      "Helvetica (sans-serif), Times New Roman (serif), and Courier (monospace) — all built into jsPDF with no external download required.",
  },
];

export default function TextToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Text to PDF Converter",
          description:
            "Convert plain text or .txt files to a downloadable PDF instantly, 100% browser-based.",
          slug: "text-to-pdf",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "PDF Tools", url: `${SITE_URL}/tools/pdf-tools` },
          { name: "Text to PDF", url: `${SITE_URL}/tools/web-tools/text-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Web Tools", href: "/tools/web-tools" },
          { label: "Text to PDF" },
        ]}
        title="Free Text to PDF Converter – Instant Browser-Based PDF"
        description="Paste text or upload a .txt file and download a perfectly formatted PDF in seconds. Adjust font, size, margins, line spacing, and theme — all in your browser."
        howToSteps={[
          {
            title: "Enter or Upload Text",
            description:
              "Type directly in the editor or click 'Upload .txt' to load a text file from your device.",
          },
          {
            title: "Customize PDF Options",
            description:
              "Choose page size, font, font size, margin, line spacing, and light or dark theme.",
          },
          {
            title: "Download PDF",
            description:
              "Click 'Download PDF' and your formatted PDF is generated instantly in your browser.",
          },
        ]}
        benefits={[
          {
            title: "100% Browser-Based",
            description:
              "No server upload, no account. Your text stays on your device at all times.",
          },
          {
            title: "Instant Generation",
            description:
              "PDFs are created client-side in milliseconds — no waiting for a server response.",
          },
          {
            title: "Flexible Formatting",
            description:
              "Control font, size, margins, line spacing, and light or dark PDF theme.",
          },
          {
            title: "Automatic Pagination",
            description:
              "Long documents are split across as many pages as needed automatically.",
          },
          {
            title: "Header, Footer & Page Numbers",
            description:
              "Add custom header and footer text plus auto-numbered pages with one click.",
          },
          {
            title: "No Ads, No Limits",
            description:
              "Free forever with no file count limit, no watermark, and no registration required.",
          },
        ]}
        faqs={FAQS}
      >
        <TextToPdfClient />
      </ToolPageLayout>
    </>
  );
}
