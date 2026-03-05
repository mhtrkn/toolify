import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import OcrClient from "./OcrClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "OCR Image to Text",
  toolDescription:
    "Extract text from images using AI-powered multilingual OCR. Supports English, Turkish, German, French, Spanish, Arabic, Russian and 100+ languages. Multi-file batch processing, DOCX export, and confidence highlighting — 100% free, no signup.",
  categorySlug: "ocr-tools",
  toolSlug: "ocr-image-to-text",
  keywords: [
    "ocr image to text online free",
    "extract text from image",
    "multilingual ocr online",
    "turkish ocr free",
    "image to text converter",
    "batch ocr processing",
    "tesseract ocr online",
    "photo to text converter",
    "scan image to text",
    "ocr with confidence score",
  ],
});

const FAQS = [
  {
    question: "Which image formats are supported?",
    answer:
      "JPG, JPEG, PNG, WEBP, BMP, TIFF, and HEIC images are all supported. For best results use high-resolution images (300 DPI or higher).",
  },
  {
    question: "Which languages can be recognized?",
    answer:
      "English, Turkish, German, French, Spanish, Arabic, Russian, Chinese (Simplified & Traditional), Japanese, Korean, Portuguese, Italian and more. Use Auto Detect to run seven languages simultaneously.",
  },
  {
    question: "Can I upload multiple images at once?",
    answer:
      "Yes — multi-file batch upload is supported. Each image is processed sequentially and results are shown in tabs.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can copy text to clipboard, download as .txt, or export as a .docx (Word) file. Batch results can be downloaded as a .zip archive.",
  },
  {
    question: "What is the Confidence view?",
    answer:
      "Confidence shows how certain the OCR engine is about each recognized word. Words below 70% are highlighted in orange/red so you can quickly review and correct uncertain areas.",
  },
  {
    question: "Is my image sent to any server?",
    answer:
      "No. OCR runs entirely in your browser using Tesseract.js. Your files never leave your device.",
  },
];

export default function OcrImageToTextPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "OCR Image to Text",
          description:
            "Multilingual OCR tool to extract text from images. Supports 14 languages, batch processing, and DOCX export.",
          slug: "ocr-image-to-text",
          categorySlug: "ocr-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "OCR Tools", url: `${SITE_URL}/tools/ocr-tools` },
          {
            name: "OCR Image to Text",
            url: `${SITE_URL}/tools/ocr-tools/ocr-image-to-text`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "OCR Tools", href: "/tools/ocr-tools" },
          { label: "OCR Image to Text" },
        ]}
        title="OCR Image to Text — Multilingual, Batch, Free"
        description="Upload any image and extract all text instantly using AI-powered OCR. Supports 14 languages including Turkish, Arabic and Russian. Multi-file batch processing, editable output, DOCX export, and confidence highlighting — no registration required."
        howToSteps={[
          {
            title: "Select Language",
            description:
              "Choose your document language or use Auto Detect for mixed-language documents.",
          },
          {
            title: "Upload Images",
            description:
              "Drag & drop or click to upload JPG, PNG, WEBP, TIFF, or HEIC images. Multiple files are supported.",
          },
          {
            title: "Review & Export",
            description:
              "Edit extracted text, check confidence highlights, then download as .txt or .docx.",
          },
        ]}
        benefits={[
          {
            title: "14 Languages",
            description:
              "Recognizes English, Turkish, German, French, Spanish, Arabic, Russian, Chinese, Japanese, Korean, and more.",
          },
          {
            title: "Auto Language Detection",
            description:
              "Runs OCR with 7 languages simultaneously — no guessing required.",
          },
          {
            title: "Confidence Highlighting",
            description:
              "Low-confidence words are color-coded so you can spot and fix OCR errors instantly.",
          },
          {
            title: "Batch Processing",
            description:
              "Upload multiple images at once and process them all in a single click.",
          },
          {
            title: "DOCX Export",
            description:
              "Download extracted text as a Word document (.docx) ready for editing.",
          },
          {
            title: "100% Private",
            description:
              "All OCR runs in your browser. Your images never leave your device.",
          },
        ]}
        faqs={FAQS}
      >
        <OcrClient />
      </ToolPageLayout>
    </>
  );
}
