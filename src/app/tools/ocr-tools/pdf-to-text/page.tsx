import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PDF to Text",
  toolDescription:
    "Extract text from PDF files online for free. Supports digital and scanned PDFs with automatic OCR fallback. Export as TXT, DOCX, or JSON. Batch processing, multi-page support — no registration needed.",
  categorySlug: "ocr-tools",
  toolSlug: "pdf-to-text",
  keywords: [
    "pdf to text converter free",
    "extract text from pdf online",
    "scanned pdf ocr extractor",
    "pdf to docx converter",
    "pdf text extraction json",
    "batch pdf to text",
    "pdf ocr fallback",
    "pdf to txt online free",
    "copy text from scanned pdf",
    "pdf text extractor no signup",
  ],
});

const FAQS = [
  {
    question: "Does this work with scanned PDFs?",
    answer:
      "Yes. When Auto-OCR is enabled, pages with no selectable text are automatically processed with OCR so you get text from scanned documents too.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can export as .txt (plain text), .docx (Word document), or .json (structured data with per-page metadata).",
  },
  {
    question: "Can I process multiple PDFs at once?",
    answer:
      "Yes — upload multiple PDFs and they are all processed in one batch. Results are shown in tabs and can be downloaded as a ZIP.",
  },
  {
    question: "How do I know which pages used OCR?",
    answer:
      "Pages processed with OCR are marked with an orange 'OCR' badge and an asterisk (*) in the page navigation tabs.",
  },
  {
    question: "Can I extract text from password-protected PDFs?",
    answer:
      "No. Remove the password first using a PDF password remover, then upload the unlocked file.",
  },
  {
    question: "Is my PDF uploaded to any server?",
    answer:
      "No. Extraction runs entirely in your browser using PDF.js and Tesseract.js. Your files never leave your device.",
  },
];

export default function PdfToTextPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "PDF to Text Extractor",
          description:
            "Extract text from digital and scanned PDFs. Supports OCR fallback, batch processing, and TXT/DOCX/JSON export.",
          slug: "pdf-to-text",
          categorySlug: "ocr-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "OCR Tools", url: `${SITE_URL}/tools/ocr-tools` },
          { name: "PDF to Text", url: `${SITE_URL}/tools/ocr-tools/pdf-to-text` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "OCR Tools", href: "/tools/ocr-tools" },
          { label: "PDF to Text" },
        ]}
        title="PDF to Text — Extract Text from Any PDF Free"
        description="Extract text from digital or scanned PDFs in seconds. Auto-OCR recognizes text in image-based pages automatically. Export to TXT, DOCX, or JSON. Multi-file batch processing — all in your browser, no uploads."
        howToSteps={[
          {
            title: "Configure Options",
            description:
              "Choose the OCR language and toggle auto-OCR for scanned pages.",
          },
          {
            title: "Upload PDFs",
            description:
              "Drop one or more PDF files. Digital and scanned PDFs are both supported.",
          },
          {
            title: "Extract & Export",
            description:
              "Review the extracted text page-by-page, then download as .txt, .docx, or .json.",
          },
        ]}
        benefits={[
          {
            title: "Auto OCR Fallback",
            description:
              "Scanned pages with no selectable text are automatically processed with OCR — no manual steps needed.",
          },
          {
            title: "3 Export Formats",
            description:
              "Download as plain text (.txt), Word document (.docx), or structured JSON with per-page metadata.",
          },
          {
            title: "Batch Processing",
            description:
              "Upload multiple PDFs and process them all at once. Results zip-downloadable.",
          },
          {
            title: "Per-Page Navigation",
            description:
              "Jump to any page in the result view. OCR-processed pages are clearly marked.",
          },
          {
            title: "100% Private",
            description:
              "PDF.js and Tesseract.js run locally in your browser. Zero server uploads.",
          },
          {
            title: "No File Size Limit",
            description:
              "Processes PDFs up to 100 MB with no page limit.",
          },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
