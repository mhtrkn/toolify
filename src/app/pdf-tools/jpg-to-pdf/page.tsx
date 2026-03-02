import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import JpgToPdfClient from "./JpgToPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JPG to PDF",
  toolDescription:
    "Convert JPG and PNG images to PDF online for free. Combine multiple images into one PDF file — no software needed.",
  categorySlug: "pdf-tools",
  toolSlug: "jpg-to-pdf",
  keywords: [
    "jpg to pdf",
    "image to pdf converter",
    "png to pdf online",
    "convert photo to pdf",
    "multiple images to pdf",
  ],
});

const FAQS = [
  {
    question: "Can I combine multiple images into one PDF?",
    answer:
      "Yes. Upload as many JPG or PNG images as you need, reorder them with the arrows, and convert — each image becomes one PDF page.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG (JPEG) and PNG images are supported. Upload one or many files at once.",
  },
  {
    question: "Is the PDF conversion done in my browser?",
    answer:
      "Yes. Images are converted entirely in your browser using pdf-lib. No files are sent to any server.",
  },
  {
    question: "What size will the output PDF be?",
    answer:
      "Each image is fitted onto an A4 page with margins. The PDF size depends on the original image sizes.",
  },
];

export default function JpgToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JPG to PDF",
          description: "Convert JPG and PNG images to a PDF file online.",
          slug: "jpg-to-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "JPG to PDF", url: `${SITE_URL}/pdf-tools/jpg-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "JPG to PDF" },
        ]}
        title="JPG to PDF – Convert Images to PDF Online Free"
        description="Convert JPG and PNG images to a PDF file instantly. Upload multiple images, arrange their order, and download a clean PDF."
        howToSteps={[
          { title: "Upload Images", description: "Click or drag to add one or more JPG/PNG files." },
          { title: "Reorder Pages", description: "Use the arrows to set the order of pages in the PDF." },
          { title: "Download PDF", description: "Click 'Convert to PDF' and download your file instantly." },
        ]}
        benefits={[
          { title: "Multiple Images", description: "Combine any number of images into a single PDF document." },
          { title: "A4 Layout", description: "Each image is auto-fitted to an A4 page with clean margins." },
          { title: "100% Private", description: "All processing happens in your browser — no server uploads." },
          { title: "No Watermarks", description: "Download clean PDFs with no watermarks or branding." },
        ]}
        faqs={FAQS}
      >
        <JpgToPdfClient />
      </ToolPageLayout>
    </>
  );
}
