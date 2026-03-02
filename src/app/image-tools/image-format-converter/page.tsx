import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ImageFormatConverterClient from "./ImageFormatConverterClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Image Format Converter",
  toolDescription:
    "Convert images between any format online for free. Supports HEIC to JPG/PNG/WebP, WebP to JPG, PNG to WebP, BMP to JPG, TIFF to PNG and more. Batch conversion — no uploads, 100% browser-based.",
  categorySlug: "image-tools",
  toolSlug: "image-format-converter",
  keywords: [
    "image format converter online free",
    "heic to jpg converter free",
    "webp to jpg converter online",
    "png to webp converter",
    "bmp to jpg online free",
    "tiff to jpg converter",
    "batch image format converter",
    "convert heic to png online",
    "jpg to webp converter free",
    "image type converter browser",
  ],
});

const HOW_TO_STEPS = [
  {
    title: "Choose Output Format",
    description: "Select JPG, PNG, or WebP as your target format.",
  },
  {
    title: "Upload Images",
    description:
      "Drag & drop or browse. Supports HEIC, JPG, PNG, WebP, BMP, and TIFF — batch upload supported.",
  },
  {
    title: "Download Converted Files",
    description: "Download individual files or all at once with one click.",
  },
];

const BENEFITS = [
  {
    title: "HEIC Support",
    description:
      "Convert Apple's HEIC/HEIF photos (from iPhone/iPad) to standard JPG, PNG, or WebP — no software needed.",
  },
  {
    title: "Batch Conversion",
    description:
      "Upload dozens of images at once and convert them all in a single operation.",
  },
  {
    title: "100% Client-Side",
    description:
      "Your images are processed entirely in your browser. Nothing is uploaded to any server.",
  },
  {
    title: "Lossless PNG & WebP",
    description:
      "Convert to PNG or WebP with full transparency support and no quality degradation.",
  },
];

const FAQS = [
  {
    question: "Can I convert HEIC files from my iPhone?",
    answer:
      "Yes! Upload your .heic files and select JPG, PNG, or WebP as the output. Conversion happens entirely in your browser.",
  },
  {
    question: "Does converting to JPG lose transparency?",
    answer:
      "Yes — JPG does not support transparency. Transparent areas are filled with white. Use PNG or WebP to preserve transparency.",
  },
  {
    question: "What's the maximum file size per image?",
    answer:
      "Up to 50MB per image. You can upload multiple files in one batch.",
  },
  {
    question: "Is WebP better than JPG?",
    answer:
      "WebP usually produces 25–35% smaller files than JPG at the same visual quality and also supports transparency like PNG.",
  },
];

export default function ImageFormatConverterPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Image Format Converter",
          description:
            "Convert images between HEIC, JPG, PNG, WebP, BMP, TIFF formats online for free.",
          slug: "image-format-converter",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools", url: `${SITE_URL}/image-tools` },
          {
            name: "Image Format Converter",
            url: `${SITE_URL}/image-tools/image-format-converter`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <JsonLd
        data={buildHowToSchema({
          name: "How to Convert Image Formats Online",
          description: "Convert between HEIC, JPG, PNG, WebP and more in three steps.",
          steps: HOW_TO_STEPS.map((s) => ({ name: s.title, text: s.description })),
        })}
      />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Image Tools", href: "/image-tools" },
          { label: "Image Format Converter" },
        ]}
        title="Image Format Converter – HEIC, JPG, PNG, WebP, BMP, TIFF"
        description="Convert images between any format for free. HEIC to JPG, WebP to PNG, BMP to WebP and more — batch upload supported. Everything runs in your browser; your images never leave your device."
        howToSteps={HOW_TO_STEPS}
        benefits={BENEFITS}
        faqs={FAQS}
      >
        <ImageFormatConverterClient />
      </ToolPageLayout>
    </>
  );
}
