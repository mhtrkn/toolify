import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import PdfToWordClient from "./PdfToWordClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PDF to Word",
  toolDescription:
    "Convert PDF files to editable Word documents online for free. Extract text from PDF and download as an RTF file — no account needed.",
  categorySlug: "pdf-tools",
  toolSlug: "pdf-to-word",
  keywords: [
    "pdf to word",
    "pdf to docx converter",
    "convert pdf to word online free",
    "pdf text extractor",
    "pdf to rtf",
  ],
});

const FAQS = [
  {
    question: "What format is the output file?",
    answer:
      "The output is an RTF (Rich Text Format) file. RTF opens natively in Microsoft Word, LibreOffice Writer, and Google Docs, and can be saved as .docx from any of those apps.",
  },
  {
    question: "Will the formatting be preserved?",
    answer:
      "Text content and paragraph structure are extracted. Complex layouts, fonts, images, and tables from the original PDF may not be reproduced exactly.",
  },
  {
    question: "Does it work with scanned PDFs?",
    answer:
      "No. Scanned PDFs contain images of text, not actual text data. For scanned documents, use our OCR Image to Text tool instead.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. The entire conversion runs in your browser using pdfjs-dist. Your file never leaves your device.",
  },
];

export default function PdfToWordPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "PDF to Word",
          description: "Convert PDF to editable Word document online.",
          slug: "pdf-to-word",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "PDF to Word", url: `${SITE_URL}/pdf-tools/pdf-to-word` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "PDF to Word" },
        ]}
        title="PDF to Word – Convert PDF to Editable Document Free"
        description="Extract text from any PDF and download it as a Word-compatible RTF file. Open directly in Microsoft Word, LibreOffice, or Google Docs."
        howToSteps={[
          { title: "Upload your PDF", description: "Click or drag your PDF file into the upload area." },
          { title: "Convert", description: "Click 'Convert to Word' — text is extracted instantly." },
          { title: "Download", description: "Download the RTF file and open it in Word or LibreOffice." },
        ]}
        benefits={[
          { title: "No Server Upload", description: "Conversion runs entirely in your browser — fully private." },
          { title: "Multi-page Support", description: "All pages are extracted with page breaks preserved." },
          { title: "Opens in Word & LibreOffice", description: "RTF is universally supported by all major word processors." },
          { title: "Free & Instant", description: "No account, no payment, no wait — convert in seconds." },
        ]}
        faqs={FAQS}
      >
        <PdfToWordClient />
      </ToolPageLayout>
    </>
  );
}
