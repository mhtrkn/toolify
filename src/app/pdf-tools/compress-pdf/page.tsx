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
    "Reduce PDF file size online for free. Optimize and compress PDF documents without losing quality — no registration or software required.",
  categorySlug: "pdf-tools",
  toolSlug: "compress-pdf",
  keywords: [
    "compress pdf online",
    "reduce pdf size",
    "pdf compressor free",
    "shrink pdf",
    "optimize pdf",
  ],
});

const FAQS = [
  {
    question: "How much can I reduce my PDF size?",
    answer:
      "The reduction depends on the PDF content. PDFs with heavy metadata, redundant objects, or unoptimized structure typically see the best results.",
  },
  {
    question: "Will compression affect my PDF quality?",
    answer:
      "No. Our compressor optimizes the document structure and removes metadata without altering the visual content of your PDF.",
  },
  {
    question: "Is my PDF data kept private?",
    answer:
      "Yes. Compression runs entirely in your browser using pdf-lib. Your file is never uploaded to any server.",
  },
  {
    question: "What is the maximum PDF size I can compress?",
    answer:
      "You can compress PDFs up to 100MB. Very large files may take a moment to process.",
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
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Compress PDF", url: `${SITE_URL}/pdf-tools/compress-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Compress PDF" },
        ]}
        title="Compress PDF – Reduce PDF File Size Online Free"
        description="Optimize and reduce your PDF file size instantly. Removes metadata and compresses document structure — no uploads, 100% private."
        howToSteps={[
          {
            title: "Upload Your PDF",
            description: "Click or drag to upload your PDF file (up to 100MB).",
          },
          {
            title: "Compress",
            description:
              "Click 'Compress PDF' and wait a moment while we optimize your file.",
          },
          {
            title: "Download",
            description:
              "Download your smaller, optimized PDF with one click.",
          },
        ]}
        benefits={[
          {
            title: "100% Private",
            description:
              "All processing happens in your browser. Your file never leaves your device.",
          },
          {
            title: "No Quality Loss",
            description:
              "Visual content remains identical — only unnecessary overhead is removed.",
          },
          {
            title: "No Registration",
            description: "Free to use with no account or sign-up required.",
          },
          {
            title: "Fast Processing",
            description:
              "Most PDFs compress in just a few seconds.",
          },
        ]}
        faqs={FAQS}
      >
        <CompressPdfClient />
      </ToolPageLayout>
    </>
  );
}
