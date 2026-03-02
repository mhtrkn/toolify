import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import DeletePdfPagesClient from "./DeletePdfPagesClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Delete PDF Pages",
  toolDescription:
    "Remove specific pages from a PDF file online for free. Select pages by number, delete them instantly, and download your edited PDF.",
  categorySlug: "pdf-tools",
  toolSlug: "delete-pdf-pages",
  keywords: [
    "delete pdf pages",
    "remove pages from pdf",
    "pdf page remover online",
    "extract pages pdf",
    "edit pdf pages free",
  ],
});

const FAQS = [
  {
    question: "How do I specify which pages to delete?",
    answer:
      'Enter page numbers or ranges separated by commas — for example "1, 3, 5-7" deletes pages 1, 3, and 5 through 7.',
  },
  {
    question: "Can I delete all pages?",
    answer: "No. At least one page must remain in the PDF after deletion.",
  },
  {
    question: "Does the tool work with encrypted PDFs?",
    answer: "Password-protected PDFs cannot be processed. Remove the password first using our Protect PDF tool.",
  },
  {
    question: "Is my file uploaded to a server?",
    answer:
      "No. Page deletion runs entirely in your browser using pdf-lib. Your PDF never leaves your device.",
  },
];

export default function DeletePdfPagesPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Delete PDF Pages",
          description: "Remove specific pages from a PDF file online.",
          slug: "delete-pdf-pages",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Delete PDF Pages", url: `${SITE_URL}/pdf-tools/delete-pdf-pages` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Delete PDF Pages" },
        ]}
        title="Delete PDF Pages – Remove Pages from PDF Online Free"
        description="Upload a PDF, enter the page numbers you want to remove, and download the result instantly. No software, no account required."
        howToSteps={[
          { title: "Upload PDF", description: "Click or drag your PDF file into the upload area." },
          { title: "Enter Pages to Delete", description: 'Type the page numbers or ranges (e.g. "2, 4-6") to remove.' },
          { title: "Download Result", description: "Click 'Delete Pages' and download your edited PDF." },
        ]}
        benefits={[
          { title: "Flexible Page Selection", description: "Delete individual pages or ranges like 1, 3-5, 8 in one step." },
          { title: "Instant Processing", description: "Pages are removed in seconds — no server wait time." },
          { title: "100% Private", description: "Processing happens in your browser — your file is never uploaded." },
          { title: "No Quality Loss", description: "Remaining pages are preserved at full original quality." },
        ]}
        faqs={FAQS}
      >
        <DeletePdfPagesClient />
      </ToolPageLayout>
    </>
  );
}
