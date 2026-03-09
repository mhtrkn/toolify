import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Image Converter",
  toolDescription:
    "Convert HEIC, HEIF, JPG, PNG, WebP, GIF, TIFF, AVIF, and SVG images online for free. Server-powered by sharp with a browser fallback — no watermarks, no sign-up, batch conversion supported.",
  categorySlug: "image-tools",
  toolSlug: "image-converter",
  keywords: [
    "heic to jpg converter free",
    "heic to png online",
    "heic converter online",
    "heif to jpg",
    "image converter online free",
    "convert heic free",
    "png to webp converter",
    "jpg to webp converter free",
    "avif converter",
    "tiff converter online",
    "batch image converter",
    "webp to jpg converter online",
    "png to svg converter",
    "jpg to svg converter",
    "svg to png converter",
    "svg to jpg converter",
    "svg converter online free",
  ],
});

const HOW_TO_STEPS = [
  {
    title:       "Upload your images",
    description: "Drop one or more files onto the page — or click Browse. HEIC, HEIF, JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and SVG are all supported.",
  },
  {
    title:       "Pick the output format",
    description: "Each file has its own format selector. Choose JPG, PNG, WebP, GIF, TIFF, AVIF, HEIC, or SVG — mix and match freely across files.",
  },
  {
    title:       "Convert & download",
    description: "Click Convert (or Convert All). Download files individually or grab the entire batch as a single ZIP.",
  },
];

const BENEFITS = [
  {
    title:       "HEIC / HEIF support",
    description: "iPhone HEIC and HEIF photos are handled natively — no app installs, no plugins.",
  },
  {
    title:       "SVG ↔ Raster conversion",
    description: "Convert SVG to PNG, JPG, or WebP — or wrap raster images into SVG. Great for web development workflows.",
  },
  {
    title:       "Server-powered quality",
    description: "Conversion runs on the server with sharp + libvips for full colour fidelity and pixel-perfect output.",
  },
  {
    title:       "Batch conversion",
    description: "Upload unlimited files at once. Convert all with one click and download as a ZIP.",
  },
  {
    title:       "Browser fallback",
    description: "If the server is unreachable, JPG / PNG / WebP conversions continue entirely in your browser via the Canvas API.",
  },
  {
    title:       "Private by design",
    description: "Files are processed in memory and streamed back immediately — never written to disk or stored.",
  },
  {
    title:       "All major formats",
    description: "In → JPG, PNG, WebP, GIF, BMP, TIFF, HEIC, HEIF, AVIF, SVG.  Out → JPG, PNG, WebP, GIF, TIFF, AVIF, HEIC, SVG.",
  },
];

const FAQS = [
  {
    question: "How do I convert iPhone HEIC photos to JPG?",
    answer:
      "Simply drop your .heic files onto the page. The converter detects HEIC automatically. Select JPG as the output format and click Convert. No apps or sign-up required.",
  },
  {
    question: "Is there a file-size limit?",
    answer:
      "Each file can be up to 50 MB. For almost all photos and graphics this is well above the practical maximum.",
  },
  {
    question: "Are my files stored or shared?",
    answer:
      "No. Files are converted in memory on the server and streamed directly to your browser. Nothing is saved to disk or logged.",
  },
  {
    question: "Which output formats are available?",
    answer:
      "Server-side: JPG, PNG, WebP, GIF, TIFF, AVIF, HEIC, and SVG. In the browser fallback (when the server is unavailable): JPG, PNG, WebP, and SVG.",
  },
  {
    question: "Does converting to JPG reduce quality?",
    answer:
      "Our default quality setting (88/100) is high enough that differences are invisible at normal viewing distances. Choose PNG or WebP for lossless output.",
  },
  {
    question: "Can I convert multiple files at once?",
    answer:
      "Yes. Drop as many files as you like. Each file gets its own output format selector so you can mix formats in a single batch. Download them individually or as a ZIP.",
  },
  {
    question: "Can I convert PNG or JPG to SVG?",
    answer:
      "Yes. The converter wraps your raster image inside an SVG container, preserving the original dimensions and quality. This is ideal for embedding in web pages or vector editors. For true vector tracing of line art, a dedicated vectorization tool is recommended.",
  },
  {
    question: "Can I convert SVG to PNG or JPG?",
    answer:
      "Yes. Drop your SVG file and select PNG, JPG, or any other raster format. The SVG is rendered at high resolution (minimum 1024px on the longest side) for crisp output.",
  },
];

export default function ImageFormatConverterPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebAppSchema({
            name:         "Image Converter",
            description:  "Convert HEIC, HEIF, JPG, PNG, WebP, GIF, TIFF, AVIF, and SVG images online for free.",
            slug:         "image-converter",
            categorySlug: "image-tools",
          }),
          buildBreadcrumbSchema([
            { name: "Home",         url: SITE_URL },
            { name: "Tools",        url: `${SITE_URL}/tools` },
            { name: "Image Tools",  url: `${SITE_URL}/tools/image-tools` },
            { name: "Image Converter", url: `${SITE_URL}/tools/image-tools/image-converter` },
          ]),
          buildHowToSchema({
            name:        "How to Convert Images Online",
            description: "Step-by-step guide to converting HEIC, JPG, PNG, WebP, SVG and other image formats.",
            steps:       HOW_TO_STEPS.map((s) => ({ name: s.title, text: s.description })),
          }),
          buildFaqSchema(FAQS),
        ]}
      />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools",       href: "/tools" },
          { label: "Image Tools", href: "/tools/image-tools" },
          { label: "Image Converter" },
        ]}
        title="Image Converter"
        description="Convert HEIC, HEIF, JPG, PNG, WebP, GIF, TIFF, AVIF, and SVG — server-powered with sharp, browser fallback included. Free, private, no sign-up."
        howToSteps={HOW_TO_STEPS}
        benefits={BENEFITS}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
