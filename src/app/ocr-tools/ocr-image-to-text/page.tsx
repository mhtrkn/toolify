import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import OcrClient from "./OcrClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "OCR Image to Text",
  toolDescription:
    "Extract text from images online for free using AI-powered OCR. Supports JPG, PNG, BMP, and TIFF. Accurate, fast, and 100+ languages — no registration required.",
  categorySlug: "ocr-tools",
  toolSlug: "ocr-image-to-text",
  keywords: [
    "ocr image to text online free",
    "extract text from image",
    "image to text converter ocr",
    "jpg to text extractor online",
    "scan image to text free",
    "photo to text converter",
    "online ocr no signup",
    "ai image text recognition",
    "convert picture to text free",
    "handwriting ocr online free",
  ],
});

const FAQS = [
  {
    question: "What image formats are supported?",
    answer:
      "JPG, JPEG, PNG, BMP, and TIFF images are all supported.",
  },
  {
    question: "How accurate is the OCR?",
    answer:
      "Accuracy is high for clean printed text. Handwriting and stylized fonts may vary. For best results, use high-resolution images (300 DPI or higher).",
  },
  {
    question: "What languages are supported?",
    answer:
      "Over 100 languages are supported including English, Spanish, French, German, Arabic, Chinese, Japanese, and more.",
  },
  {
    question: "Can I extract text from scanned documents?",
    answer:
      "Yes — scanned document images work well, especially at 300 DPI or higher resolution.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Images up to 10MB are supported.",
  },
  {
    question: "Is my image sent to a server?",
    answer:
      "No. OCR runs locally in your browser using Tesseract.js. Your images never leave your device.",
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
        title="OCR Image to Text – Extract Text from Images Online Free"
        description="Upload any image and instantly extract all text using AI-powered OCR. Supports 100+ languages, editable output, and one-click download — no registration required."
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
