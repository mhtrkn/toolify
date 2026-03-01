import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import CompressVideoClient from "./CompressVideoClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Compress Video",
  toolDescription:
    "Reduce video file size online for free. Compress MP4, AVI, MOV, and MKV videos directly in your browser — no uploads, no software required.",
  categorySlug: "video-tools",
  toolSlug: "compress-video",
  keywords: [
    "compress video online",
    "reduce video size",
    "video compressor free",
    "shrink mp4 online",
    "video file size reducer",
  ],
});

const FAQS = [
  {
    question: "What video formats are supported?",
    answer:
      "You can upload MP4, AVI, MOV, MKV, and WebM files. The output will always be an MP4 (H.264) file.",
  },
  {
    question: "How much can I reduce my video size?",
    answer:
      "Compression results vary by content and preset. Choosing 'Smallest File' can reduce file size by 50–80% for most videos.",
  },
  {
    question: "Is my video uploaded to a server?",
    answer:
      "No. Video compression runs entirely in your browser using FFmpeg WebAssembly. Your video never leaves your device.",
  },
  {
    question: "Why does compression take a long time?",
    answer:
      "Video compression is computationally intensive. FFmpeg WASM runs in your browser, which is slower than native processing. Large files may take several minutes.",
  },
];

export default function CompressVideoPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Compress Video",
          description: "Reduce video file size online for free.",
          slug: "compress-video",
          categorySlug: "video-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Video Tools", url: `${SITE_URL}/video-tools` },
          {
            name: "Compress Video",
            url: `${SITE_URL}/video-tools/compress-video`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Video Tools", href: "/video-tools" },
          { label: "Compress Video" },
        ]}
        title="Compress Video – Reduce Video File Size Online Free"
        description="Compress MP4, AVI, MOV, and MKV videos directly in your browser using FFmpeg. Choose from quality presets and download your smaller video instantly."
        howToSteps={[
          {
            title: "Upload Video",
            description:
              "Click or drag to upload your video file (up to 500MB).",
          },
          {
            title: "Choose Preset",
            description:
              "Select a compression preset — High Quality, Balanced, or Smallest File.",
          },
          {
            title: "Download",
            description:
              "Wait for processing to complete and download your compressed MP4.",
          },
        ]}
        benefits={[
          {
            title: "3 Compression Presets",
            description:
              "Choose between quality levels to get the right balance of size and quality.",
          },
          {
            title: "100% Private",
            description:
              "FFmpeg WASM runs in your browser — your video is never uploaded.",
          },
          {
            title: "Wide Format Support",
            description:
              "Accepts MP4, AVI, MOV, MKV, and WebM input formats.",
          },
          {
            title: "Fast Start Output",
            description:
              "Output MP4 is optimized for web streaming with fast-start enabled.",
          },
        ]}
        faqs={FAQS}
      >
        <CompressVideoClient />
      </ToolPageLayout>
    </>
  );
}
