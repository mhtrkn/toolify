import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import PngToJpgClient from "./PngToJpgClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "PNG to JPG",
  toolDescription:
    "Convert PNG images to JPG format online for free. Reduce file size while preserving quality — batch convert multiple files with adjustable quality.",
  categorySlug: "image-tools",
  toolSlug: "png-to-jpg",
  keywords: [
    "png to jpg",
    "png to jpeg converter",
    "convert png to jpg online",
    "png jpg free",
    "image format converter",
  ],
});

const FAQS = [
  {
    question: "Why convert PNG to JPG?",
    answer:
      "JPG files are significantly smaller than PNG for photos and complex images, making them better for web performance and sharing. JPG does not support transparency.",
  },
  {
    question: "What happens to PNG transparency?",
    answer:
      "Transparent areas in your PNG are filled with a white background when converting to JPG, since JPG does not support transparency.",
  },
  {
    question: "Can I adjust the JPG quality?",
    answer:
      "Yes. Use the quality slider before uploading to set the compression level. Higher quality means larger file size.",
  },
  {
    question: "Can I convert multiple PNG files at once?",
    answer:
      "Yes. Select multiple PNG files and they will all be converted to JPG simultaneously.",
  },
];

export default function PngToJpgPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "PNG to JPG Converter",
          description: "Convert PNG images to JPG format online for free.",
          slug: "png-to-jpg",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools", url: `${SITE_URL}/image-tools` },
          { name: "PNG to JPG", url: `${SITE_URL}/image-tools/png-to-jpg` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Image Tools", href: "/image-tools" },
          { label: "PNG to JPG" },
        ]}
        title="PNG to JPG – Convert Images Online Free"
        description="Convert PNG images to compressed JPG format with adjustable quality. Batch convert multiple files at once — fully private, no uploads."
        howToSteps={[
          {
            title: "Set Quality",
            description:
              "Adjust the quality slider to balance file size and image quality.",
          },
          {
            title: "Upload PNG Files",
            description: "Click or drag to upload one or more PNG files.",
          },
          {
            title: "Download JPG",
            description:
              "Download your converted JPG files individually or all at once.",
          },
        ]}
        benefits={[
          {
            title: "Adjustable Quality",
            description:
              "Control the compression level to get the perfect balance of size and quality.",
          },
          {
            title: "Transparent Background Handling",
            description:
              "Transparent PNG areas are automatically filled with white for JPG compatibility.",
          },
          {
            title: "Batch Processing",
            description:
              "Convert multiple PNG files to JPG in a single upload.",
          },
          {
            title: "100% Private",
            description:
              "All conversion is done in your browser — your images are never uploaded.",
          },
        ]}
        faqs={FAQS}
      >
        <PngToJpgClient />
      </ToolPageLayout>
    </>
  );
}
