import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import SplitPdfClient from "./SplitPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Split PDF",
  toolDescription:
    "Split a PDF into separate pages or custom page ranges online for free. Extract exactly the pages you need. No file uploads — 100% private and instant.",
  categorySlug: "pdf-tools",
  toolSlug: "split-pdf",
  keywords: [
    "split pdf online free",
    "extract pages from pdf",
    "pdf page extractor",
    "split pdf by page range",
    "separate pdf pages online",
    "cut pdf pages online",
    "pdf splitter no upload",
    "divide pdf into parts",
    "extract specific pages from pdf",
    "split pdf without adobe",
  ],
});

const FAQS = [
  {
    question: "Can I extract specific page ranges from a PDF?",
    answer:
      "Yes. Enter ranges like '1-3, 5, 7-9' — each segment becomes its own PDF file.",
  },
  {
    question: "Can I extract every page as a separate PDF?",
    answer:
      "Yes. Choose 'All Pages' mode and every page will be extracted as an individual PDF file.",
  },
  {
    question: "Can I extract just one page?",
    answer:
      "Yes — enter a single page number to extract it as a standalone PDF document.",
  },
  {
    question: "Will the extracted PDF preserve quality?",
    answer:
      "Yes. Pages are extracted losslessly using pdf-lib with no quality change.",
  },
  {
    question: "Is there a page limit?",
    answer:
      "There is no hard page limit. Very large PDFs with hundreds of pages may take a moment to process.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. The entire splitting process runs locally in your browser using pdf-lib. Your file never leaves your device.",
  },
];

export default function SplitPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Split PDF",
          description: "Split PDF into separate pages online for free.",
          slug: "split-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Split PDF", url: `${SITE_URL}/pdf-tools/split-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Split PDF" },
        ]}
        title="Split PDF Online – Extract Pages from PDF Free"
        description="Upload a PDF and extract individual pages or custom page ranges. Download each segment as a separate PDF file — no uploads, 100% private."
        howToSteps={[
          {
            title: "Upload Your PDF",
            description: "Click or drag to upload the PDF you want to split.",
          },
          {
            title: "Choose Split Mode",
            description:
              "Extract all pages separately, or specify custom page ranges.",
          },
          {
            title: "Download",
            description:
              "Download individual PDF segments with one click each, or download all at once.",
          },
        ]}
        benefits={[
          {
            title: "Custom Page Ranges",
            description:
              "Extract exactly the pages you need using intuitive range notation.",
          },
          {
            title: "100% Private",
            description:
              "Processing happens entirely in your browser — files never leave your device.",
          },
          {
            title: "No File Limits",
            description:
              "Split PDFs with any number of pages at no cost.",
          },
          {
            title: "Instant Download",
            description:
              "Download individual files immediately after splitting.",
          },
        ]}
        faqs={FAQS}
      >
        <SplitPdfClient />
      </ToolPageLayout>
    </>
  );
}
