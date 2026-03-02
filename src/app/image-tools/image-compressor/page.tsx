import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ImageCompressorClient from "./ImageCompressorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Image Compressor",
  toolDescription:
    "Compress JPG, PNG, and WebP images online for free. Reduce image file size without losing visible quality. Instant results — no uploads, works in your browser.",
  categorySlug: "image-tools",
  toolSlug: "image-compressor",
  keywords: [
    "image compressor online free",
    "compress jpg online",
    "compress png file size",
    "reduce image file size without quality loss",
    "image size reducer free",
    "compress webp online",
    "compress images for website free",
    "image file compressor no upload",
    "reduce photo size online free",
    "compress image to 100kb free",
  ],
});

const HOW_TO_STEPS = [
  {
    title: "Upload Your Image",
    description: "Drag and drop or click to select JPG, PNG, or WebP images.",
  },
  {
    title: "Set Quality Level",
    description: "Adjust the quality slider (default 80% gives the best balance).",
  },
  {
    title: "Download Compressed Image",
    description: "Click Download to save your compressed image instantly.",
  },
];

const BENEFITS = [
  {
    title: "No Quality Loss",
    description: "Our smart compression preserves visual quality while reducing file size up to 90%.",
  },
  {
    title: "Batch Compression",
    description: "Upload and compress multiple images at once. Download all with one click.",
  },
  {
    title: "100% Private",
    description: "Compression happens entirely in your browser. Your images never leave your device.",
  },
  {
    title: "No Limits",
    description: "Compress as many images as you want, completely free, with no watermarks.",
  },
];

const FAQS = [
  {
    question: "How much can I compress an image?",
    answer:
      "Depending on the image and quality setting, you can typically reduce file size by 40–90% without noticeable quality loss.",
  },
  {
    question: "Does compressing change the image dimensions?",
    answer:
      "No. Our compressor only reduces file size by optimizing data — the dimensions (width and height) stay the same.",
  },
  {
    question: "What image formats can I compress?",
    answer:
      "We support JPG/JPEG, PNG, and WebP formats. GIF compression is coming soon.",
  },
  {
    question: "Is the compressed image stored on your servers?",
    answer:
      "No. Everything happens in your browser using the Canvas API. Your images are never uploaded to any server.",
  },
];

export default function ImageCompressorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Image Compressor",
          description: "Compress JPG, PNG, and WebP images online for free.",
          slug: "image-compressor",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools", url: `${SITE_URL}/image-tools` },
          { name: "Image Compressor", url: `${SITE_URL}/image-tools/image-compressor` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <JsonLd
        data={buildHowToSchema({
          name: "How to Compress Images Online",
          description: "Reduce image file size in three simple steps.",
          steps: HOW_TO_STEPS.map((s) => ({ name: s.title, text: s.description })),
        })}
      />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Image Tools", href: "/image-tools" },
          { label: "Image Compressor" },
        ]}
        title="Image Compressor – Reduce Image File Size Free"
        description="Compress JPG, PNG, and WebP images by up to 90% without losing visible quality. Set quality level, see instant savings, and download — no uploads needed."
        howToSteps={HOW_TO_STEPS}
        benefits={BENEFITS}
        faqs={FAQS}
      >
        <ImageCompressorClient />
      </ToolPageLayout>
    </>
  );
}
