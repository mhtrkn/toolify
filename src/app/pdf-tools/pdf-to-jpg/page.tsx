import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import PdfToJpgClient from "./PdfToJpgClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PDF to JPG",
  toolDescription:
    "Convert PDF pages to high-quality JPG images free online. Adjust quality settings, extract all pages, and download as a ZIP. No uploads — 100% private and instant.",
  categorySlug: "pdf-tools",
  toolSlug: "pdf-to-jpg",
  keywords: [
    "pdf to jpg converter",
    "convert pdf to image online free",
    "pdf to jpg high quality",
    "extract images from pdf",
    "pdf page to jpeg",
    "pdf to image converter",
    "convert pdf to jpg without adobe",
    "pdf to jpg bulk download",
    "export pdf pages as images",
    "pdf to jpeg free online",
  ],
});

const FAQS = [
  {
    question: "Can I convert a multi-page PDF to JPG at once?",
    answer:
      "Yes. Every page is converted simultaneously and you can download them all at once in a ZIP file.",
  },
  {
    question: "What quality settings are available?",
    answer:
      "Use the quality slider to adjust output from low (small files) to maximum (sharpest images). Default is 90%.",
  },
  {
    question: "Will the JPG images be blurry or low quality?",
    answer:
      "No. Pages are rendered at high resolution using the PDF.js rendering engine for crisp, clear output.",
  },
  {
    question: "Can I convert just one page of a PDF?",
    answer:
      "Currently the tool converts all pages. To convert a single page, use our Split PDF tool first to extract it, then convert.",
  },
  {
    question: "Is there a file size limit?",
    answer: "PDFs up to 100MB are supported.",
  },
  {
    question: "Is my PDF data private?",
    answer:
      "Yes. All conversion runs locally in your browser using PDF.js. Nothing is uploaded to any server.",
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
        title="PDF to JPG Converter – Extract PDF Pages as Images"
        description="Convert every page of a PDF into a high-quality JPG image. Adjust quality, download all images as a ZIP, and keep your files 100% private."
        howToSteps={[
          { title: "Upload Your PDF", description: "Click or drag and drop your PDF file into the uploader." },
          { title: "Set Image Quality", description: "Use the quality slider to choose your preferred image resolution." },
          { title: "Convert & Download", description: "Click 'Convert to JPG', then download all images in a ZIP file." },
        ]}
        benefits={[
          { title: "Batch Page Extraction", description: "Convert every PDF page to a separate JPG image in one click." },
          { title: "Adjustable Quality", description: "Balance file size vs. sharpness with the quality slider (50–100%)." },
          { title: "ZIP Download", description: "Download all converted images packaged in a single ZIP file." },
          { title: "100% Browser-Based", description: "No file uploads. All processing stays on your device." },
        ]}
        faqs={FAQS}
      >
        <PdfToJpgClient />
      </ToolPageLayout>
    </>
  );
}
