import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import JpgToPngClient from "./JpgToPngClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JPG to PNG",
  toolDescription:
    "Convert JPG images to PNG format online for free. Lossless conversion with transparency support. Fast, secure, no registration — download your PNG instantly.",
  categorySlug: "image-tools",
  toolSlug: "jpg-to-png",
  keywords: [
    "jpg to png converter free",
    "convert jpeg to png online",
    "jpg to png lossless",
    "jpeg to png with transparency",
    "change jpg format to png free",
    "convert photo to png online",
    "jpg to png no quality loss",
    "jpg to png converter without software",
    "batch jpg to png online",
    "convert jpg to transparent png",
  ],
});

const FAQS = [
  {
    question: "Why convert JPG to PNG?",
    answer:
      "PNG supports lossless compression and transparency (alpha channel), making it ideal for logos, icons, and images that need a transparent background.",
  },
  {
    question: "Can I convert multiple JPG files at once?",
    answer:
      "Yes! Select multiple JPG files at once and they will all be converted to PNG in one go.",
  },
  {
    question: "Will the image quality change?",
    answer:
      "No. PNG is a lossless format so no image quality is lost during conversion. The PNG may be slightly larger than the original JPG.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. All conversion happens locally in your browser using the Canvas API. Your images never leave your device.",
  },
];

export default function JpgToPngPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JPG to PNG Converter",
          description: "Convert JPG images to PNG format online for free.",
          slug: "jpg-to-png",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools", url: `${SITE_URL}/image-tools` },
          { name: "JPG to PNG", url: `${SITE_URL}/image-tools/jpg-to-png` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Image Tools", href: "/image-tools" },
          { label: "JPG to PNG" },
        ]}
        title="JPG to PNG Converter – Convert JPEG to PNG Free"
        description="Convert JPG and JPEG images to lossless PNG format instantly. Batch convert multiple files — supports transparency, no uploads, 100% private."
        howToSteps={[
          {
            title: "Upload JPG Files",
            description: "Click or drag to upload one or more JPG/JPEG files.",
          },
          {
            title: "Auto-Convert",
            description:
              "Files are converted to PNG automatically as soon as they are uploaded.",
          },
          {
            title: "Download PNG",
            description:
              "Download individual PNG files or all at once.",
          },
        ]}
        benefits={[
          {
            title: "Batch Conversion",
            description:
              "Convert multiple JPG files to PNG simultaneously with no extra steps.",
          },
          {
            title: "Lossless Output",
            description:
              "PNG is lossless — no quality is sacrificed during conversion.",
          },
          {
            title: "100% Private",
            description:
              "Images are converted using your browser's Canvas API. Nothing is uploaded.",
          },
          {
            title: "No Limits",
            description: "Convert as many images as you need, completely free.",
          },
        ]}
        faqs={FAQS}
      >
        <JpgToPngClient />
      </ToolPageLayout>
    </>
  );
}
