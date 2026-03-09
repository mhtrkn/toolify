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
  toolName: "GIF Maker & Converter",
  toolDescription:
    "Create animated GIFs from images or video clips online for free. Convert video to GIF or GIF to MP4. Set frame rate, width, and color quality. Preview before download — 100% browser-based.",
  categorySlug: "image-tools",
  toolSlug: "gif-maker",
  keywords: [
    "gif maker online free",
    "video to gif converter",
    "gif to mp4 converter online",
    "create gif from images free",
    "make animated gif online",
    "mp4 to gif converter free",
    "gif creator browser no upload",
    "images to gif online free",
    "gif to video converter",
    "animated gif maker custom fps",
  ],
});

const HOW_TO_STEPS = [
  {
    title: "Choose Conversion Mode",
    description: "Select Images → GIF, Video → GIF, or GIF → MP4.",
  },
  {
    title: "Adjust Settings",
    description: "Set the frame rate, output width, and color quality for best results.",
  },
  {
    title: "Upload & Convert",
    description: "Upload your files, click Convert, preview the result, and download.",
  },
];

const BENEFITS = [
  {
    title: "Three Conversion Modes",
    description:
      "Make GIFs from still images, extract a GIF from any video, or convert a GIF to a shareable MP4.",
  },
  {
    title: "Full Control over Output",
    description:
      "Choose frame rate (1–30 fps), output width (up to 1280px), and color palette quality.",
  },
  {
    title: "Live Preview",
    description:
      "See your GIF or MP4 play in the browser before downloading — no surprises.",
  },
  {
    title: "Private & Secure",
    description:
      "All processing uses FFmpeg compiled to WebAssembly. Your files never leave your device.",
  },
];

const FAQS = [
  {
    question: "How many images can I use to make a GIF?",
    answer:
      "There is no hard limit, but very large sets (50+ high-resolution images) may be slow. Images are sorted alphabetically by filename to set the frame order.",
  },
  {
    question: "Why does the first conversion take longer?",
    answer:
      "FFmpeg runs as WebAssembly in your browser. The engine (~30MB) is downloaded and compiled once on first use. Subsequent conversions in the same session are much faster.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Chrome 92+, Edge 92+, and Firefox 79+ support the required SharedArrayBuffer API. Safari has limited support — use Chrome for best results.",
  },
  {
    question: "What is the maximum video size for Video → GIF?",
    answer:
      "Up to 200MB. For long videos, use a short clip (under 30 seconds) for the best GIF output size and quality.",
  },
];

export default function GifMakerPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "GIF Maker & Converter",
          description:
            "Create GIFs from images or video, convert video to GIF, and convert GIF to MP4 online free.",
          slug: "gif-maker",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Image Tools", url: `${SITE_URL}/tools/image-tools` },
          { name: "GIF Maker", url: `${SITE_URL}/tools/image-tools/gif-maker` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Image Tools", href: "/tools/image-tools" },
          { label: "GIF Maker & Converter" },
        ]}
        title="GIF Maker – Create GIF from Images or Video Free"
        description="Turn images into an animated GIF, convert a video clip to GIF, or convert a GIF to MP4. Control frame rate, size, and quality — preview before you download. All processing happens in your browser."
        howToSteps={HOW_TO_STEPS}
        benefits={BENEFITS}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
