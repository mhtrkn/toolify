import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import CompressPdfClient from "./CompressPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Compress PDF",
  toolDescription:
    "Reduce PDF file size online for free with 3 compression levels: low, medium, or high. No uploads — files never leave your browser. Download smaller PDFs in seconds.",
  categorySlug: "pdf-tools",
  toolSlug: "compress-pdf",
  keywords: [
    "compress pdf online free",
    "reduce pdf file size",
    "pdf compressor no upload",
    "shrink pdf to 100kb",
    "compress pdf without losing quality",
    "make pdf smaller online",
    "pdf file size reducer",
    "compress pdf for email",
    "pdf compressor free tool",
    "reduce pdf size online without quality loss",
  ],
});

const FAQS = [
  {
    question: "What's the difference between Low, Medium, and High compression?",
    answer:
      "Low strips metadata only — no visual change, lossless. Medium re-renders pages as images at 72% JPEG quality. High applies maximum compression at 45% JPEG quality for the smallest file size.",
  },
  {
    question: "Will High compression make my PDF blurry?",
    answer:
      "High compression converts pages to images, which reduces visual quality. Use Low compression for documents you need to read or edit clearly.",
  },
  {
    question: "Can I compress a PDF for email attachment?",
    answer:
      "Yes. Use Medium or High compression to reduce below typical 25MB email attachment limits.",
  },
  {
    question: "Does compressed PDF still have selectable text?",
    answer:
      "Low compression preserves text selection. Medium and High output is image-only — text will not be selectable.",
  },
  {
    question: "What is the maximum file size?",
    answer: "Up to 100MB PDFs are supported.",
  },
  {
    question: "Is my PDF sent anywhere?",
    answer:
      "No. All compression runs in your browser using pdf-lib and PDF.js. Your file never leaves your device.",
  },
];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Compress PDF",
          description: "Reduce PDF file size online for free.",
          slug: "compress-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "PDF Tools", url: `${SITE_URL}/tools/pdf-tools` },
          { name: "Compress PDF", url: `${SITE_URL}/tools/pdf-tools/compress-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "PDF Tools", href: "/tools/pdf-tools" },
          { label: "Compress PDF" },
        ]}
        title="PDF Compressor – Reduce PDF File Size Online Free"
        description="Choose from 3 compression levels to shrink your PDF. No uploads — all processing is local in your browser. Download your smaller PDF in seconds."
        howToSteps={[
          { title: "Upload Your PDF", description: "Click or drag to upload your PDF file (up to 100MB)." },
          { title: "Choose Compression Level", description: "Select Low (lossless), Medium (balanced), or High (maximum size reduction)." },
          { title: "Compress & Download", description: "Click 'Compress PDF' and download your smaller optimized file." },
        ]}
        benefits={[
          { title: "3 Compression Levels", description: "Low (lossless metadata strip), Medium (re-rendered at 72% quality), High (maximum compression)." },
          { title: "Email-Ready Size", description: "Quickly reduce PDFs to fit email attachment limits of 25MB." },
          { title: "Zero Uploads", description: "All processing is local. Your file stays on your device." },
          { title: "Fast Processing", description: "Most PDFs compress in just a few seconds." },
        ]}
        faqs={FAQS}
      >
        <CompressPdfClient />
      </ToolPageLayout>
    </>
  );
}
