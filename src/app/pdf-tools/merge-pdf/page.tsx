import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import MergePdfClient from "./MergePdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Merge PDF",
  toolDescription:
    "Combine multiple PDF files into one document online for free. Reorder pages, merge instantly, and download your PDF — no registration required.",
  categorySlug: "pdf-tools",
  toolSlug: "merge-pdf",
  keywords: [
    "merge pdf online",
    "combine pdf files",
    "join pdf",
    "pdf merger free",
    "combine pdf into one",
  ],
});

const FAQS = [
  {
    question: "How many PDF files can I merge at once?",
    answer:
      "You can merge as many PDF files as you need. There is no limit on the number of files.",
  },
  {
    question: "Can I change the order of pages before merging?",
    answer:
      "Yes. After uploading, use the up/down arrows to reorder files before merging.",
  },
  {
    question: "Is my PDF data safe?",
    answer:
      "Yes. PDF merging uses pdf-lib and runs entirely in your browser. No files are sent to any server.",
  },
  {
    question: "What is the maximum PDF file size?",
    answer: "Each PDF can be up to 100MB. Total merged document size depends on your browser memory.",
  },
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Merge PDF", description: "Combine PDF files online.", slug: "merge-pdf", categorySlug: "pdf-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
        { name: "Merge PDF", url: `${SITE_URL}/pdf-tools/merge-pdf` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Merge PDF" },
        ]}
        title="Merge PDF – Combine PDF Files Online Free"
        description="Combine multiple PDF files into one document. Upload, reorder pages, and download your merged PDF instantly."
        howToSteps={[
          { title: "Upload PDFs", description: "Click or drag to add 2 or more PDF files." },
          { title: "Reorder Files", description: "Drag or use arrows to arrange files in the desired order." },
          { title: "Download Merged PDF", description: "Click 'Merge PDFs' and download the combined file." },
        ]}
        benefits={[
          { title: "Unlimited Files", description: "Merge as many PDFs as you need in a single operation." },
          { title: "Reorder Pages", description: "Easily change the order of files before merging." },
          { title: "No Watermarks", description: "Download clean, watermark-free merged PDFs." },
          { title: "100% Browser-Based", description: "No uploads — everything runs locally in your browser." },
        ]}
        faqs={FAQS}
      >
        <MergePdfClient />
      </ToolPageLayout>
    </>
  );
}
