import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import PdfToJpgClient from "./PdfToJpgClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PDF to JPG",
  toolDescription:
    "Convert PDF pages to high-quality JPG images online for free. Fast, accurate PDF to JPEG conversion with adjustable quality. No software needed.",
  categorySlug: "pdf-tools",
  toolSlug: "pdf-to-jpg",
  keywords: [
    "pdf to jpg",
    "convert pdf to image",
    "pdf to jpeg online",
    "pdf to jpg free",
    "pdf page to image",
  ],
});

const FAQS = [
  {
    question: "How do I convert PDF to JPG?",
    answer:
      "Upload your PDF file, adjust the JPG quality if needed, click 'Convert to JPG', and download each page as a separate JPG image.",
  },
  {
    question: "Is the PDF to JPG conversion free?",
    answer: "Yes, it is completely free with no file size limits and no registration.",
  },
  {
    question: "Can I convert a multi-page PDF?",
    answer:
      "Yes. Each page of the PDF will be converted to a separate JPG image that you can download individually or all at once.",
  },
  {
    question: "What quality are the output JPG images?",
    answer:
      "Images are rendered at 2x scale for sharp results. You can adjust the JPG quality (50–100%) before converting.",
  },
];

export default function PdfToJpgPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "PDF to JPG", description: "Convert PDF pages to JPG images online.", slug: "pdf-to-jpg", categorySlug: "pdf-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
        { name: "PDF to JPG", url: `${SITE_URL}/pdf-tools/pdf-to-jpg` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "PDF to JPG" },
        ]}
        title="PDF to JPG – Convert PDF Pages to Images Free"
        description="Convert every page of a PDF into high-quality JPG images. Adjustable quality, instant download, no file size limits."
        howToSteps={[
          { title: "Upload PDF", description: "Click or drag and drop your PDF file to upload." },
          { title: "Set Quality", description: "Choose the JPG quality level (default 90% is recommended)." },
          { title: "Download JPGs", description: "Download each page as a JPG or get all pages at once." },
        ]}
        benefits={[
          { title: "All Pages Converted", description: "Every page in your PDF becomes a separate high-quality JPG." },
          { title: "Adjustable Quality", description: "Control the output quality from 50% to 100%." },
          { title: "No File Size Limit", description: "Convert large PDFs with many pages without restrictions." },
          { title: "No Watermarks", description: "Clean, watermark-free output every time." },
        ]}
        faqs={FAQS}
      >
        <PdfToJpgClient />
      </ToolPageLayout>
    </>
  );
}
