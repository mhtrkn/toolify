import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import MergePdfClient from "./MergePdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Merge PDF",
  toolDescription:
    "Combine multiple PDF files into one document online. Free, no file size limits. Reorder pages before merging, then download your PDF — no registration needed.",
  categorySlug: "pdf-tools",
  toolSlug: "merge-pdf",
  keywords: [
    "merge pdf online free",
    "combine pdf files",
    "join pdf documents",
    "pdf merger no upload",
    "merge multiple pdfs into one",
    "combine pdf pages online",
    "pdf combiner free",
    "merge pdf without adobe",
    "free pdf merge tool",
    "combine two pdf files online",
  ],
});

const FAQS = [
  {
    question: "How many PDF files can I merge at once?",
    answer:
      "No limit — add as many PDF files as you need and merge them all in one operation.",
  },
  {
    question: "Can I reorder files before merging?",
    answer:
      "Yes. After uploading, use the up/down arrows or drag-and-drop to arrange files in the desired order.",
  },
  {
    question: "Will merging reduce the PDF quality?",
    answer:
      "No. pdf-lib merges files losslessly — pages are identical to the originals with no quality change.",
  },
  {
    question: "Is there a file size limit per PDF?",
    answer: "Each PDF can be up to 100MB. Total merged document size depends on available browser memory.",
  },
  {
    question: "Can I merge PDFs from different sources?",
    answer: "Yes — any standard PDF file works regardless of origin or the app used to create it.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. PDF merging uses pdf-lib and runs entirely in your browser. No files are sent to any server.",
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
        title="Merge PDF Files Online – Combine Multiple PDFs Free"
        description="Combine multiple PDF files into one document. Upload, reorder pages, and download your merged PDF instantly — no file size limits."
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
