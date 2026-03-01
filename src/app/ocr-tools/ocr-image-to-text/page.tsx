import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import OcrClient from "./OcrClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "OCR Image to Text",
  toolDescription:
    "Extract text from images online using AI-powered OCR. Supports JPG, PNG, BMP, TIFF and 100+ languages. Copy or download extracted text instantly.",
  categorySlug: "ocr-tools",
  toolSlug: "ocr-image-to-text",
  keywords: [
    "ocr image to text",
    "extract text from image",
    "image to text online",
    "photo to text",
    "free ocr tool",
  ],
});

const FAQS = [
  {
    question: "What is OCR and how does it work?",
    answer:
      "OCR (Optical Character Recognition) is AI technology that scans images and identifies text characters, converting them to editable digital text.",
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPG, JPEG, PNG, BMP, TIFF, and WebP images.",
  },
  {
    question: "Can I extract text from handwritten notes?",
    answer:
      "OCR works best with clearly printed text. Handwritten text can be recognized but accuracy may vary depending on handwriting clarity.",
  },
  {
    question: "Can I edit the extracted text?",
    answer:
      "Yes. The extracted text appears in an editable text box. You can edit it before copying or downloading.",
  },
];

export default function OcrImageToTextPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "OCR Image to Text", description: "Extract text from images using OCR.", slug: "ocr-image-to-text", categorySlug: "ocr-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "OCR Tools", url: `${SITE_URL}/ocr-tools` },
        { name: "OCR Image to Text", url: `${SITE_URL}/ocr-tools/ocr-image-to-text` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "OCR Tools", href: "/ocr-tools" },
          { label: "OCR Image to Text" },
        ]}
        title="OCR Image to Text – Extract Text from Images Free"
        description="Upload any image and instantly extract all text using AI-powered OCR. Supports 100+ languages, editable output, and one-click download."
        howToSteps={[
          { title: "Select Language", description: "Choose the language of text in your image." },
          { title: "Upload Image", description: "Upload a JPG, PNG, BMP, or TIFF image." },
          { title: "Copy or Download", description: "Review extracted text, edit if needed, then copy or save as .txt." },
        ]}
        benefits={[
          { title: "100+ Languages", description: "Recognizes text in English, Spanish, French, Chinese, Arabic, and over 100 languages." },
          { title: "AI-Powered Accuracy", description: "Tesseract OCR engine delivers high accuracy on printed text." },
          { title: "Editable Output", description: "Edit extracted text directly in the browser before downloading." },
          { title: "Side-by-Side View", description: "See the original image and extracted text simultaneously." },
        ]}
        faqs={FAQS}
      >
        <OcrClient />
      </ToolPageLayout>
    </>
  );
}
