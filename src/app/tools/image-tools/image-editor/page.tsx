import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Image Editor",
  toolDescription:
    "Free online image editor with resize, crop, rotate, and flip tools. Supports JPG, PNG, WebP. Undo history, social media presets, aspect ratio lock — all in your browser with no uploads.",
  categorySlug: "image-tools",
  toolSlug: "image-editor",
  keywords: [
    "image editor online free",
    "crop image online free",
    "rotate image online",
    "flip image online free",
    "resize image online free",
    "online photo editor no signup",
    "image crop resize rotate browser",
    "photo editor online free no download",
    "image flipper online",
    "canvas image editor free",
  ],
});

const HOW_TO_STEPS = [
  {
    title: "Upload Your Image",
    description: "Drag & drop or click to upload JPG, PNG, WebP, or BMP.",
  },
  {
    title: "Edit with Tabs",
    description:
      "Switch between Resize, Crop, Rotate, and Flip tabs. Apply each operation individually.",
  },
  {
    title: "Download Result",
    description:
      "Choose your export format (JPG, PNG, WebP) and click Download.",
  },
];

const BENEFITS = [
  {
    title: "Resize with Presets",
    description:
      "Set exact pixel dimensions or pick social media presets for Instagram, YouTube, Twitter and more. Lock aspect ratio with one click.",
  },
  {
    title: "Interactive Crop",
    description:
      "Drag the crop box directly on the image. Choose free crop or fixed ratios: 1:1, 16:9, 4:3, 3:2, 9:16.",
  },
  {
    title: "Rotate & Flip",
    description:
      "Rotate 90°/180°/270° or any custom angle. Flip horizontally or vertically in one click.",
  },
  {
    title: "Undo & Reset",
    description:
      "Every operation is non-destructive. Undo the last step or reset to the original at any time.",
  },
];

const FAQS = [
  {
    question: "Can I apply multiple edits to the same image?",
    answer:
      "Yes. Apply as many operations as you like in sequence. Each step is added to a history stack so you can undo one step at a time or reset to the original.",
  },
  {
    question: "Does cropping change the image resolution?",
    answer:
      "Yes — cropping reduces the canvas to the selected area. The output resolution equals the size of the crop selection in pixels.",
  },
  {
    question: "Which output formats are supported?",
    answer:
      "You can download the edited image as JPG, PNG, or WebP. JPG is best for photos, PNG for transparency, WebP for smallest file size.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer:
      "No. All editing uses the HTML5 Canvas API directly in your browser. Your image never leaves your device.",
  },
];

export default function ImageEditorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Image Editor",
          description:
            "Online image editor — resize, crop, rotate, and flip images for free in your browser.",
          slug: "image-editor",
          categorySlug: "image-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Image Tools", url: `${SITE_URL}/tools/image-tools` },
          { name: "Image Editor", url: `${SITE_URL}/tools/image-tools/image-editor` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <JsonLd
        data={buildHowToSchema({
          name: "How to Edit Images Online",
          description: "Resize, crop, rotate, and flip images in three easy steps.",
          steps: HOW_TO_STEPS.map((s) => ({ name: s.title, text: s.description })),
        })}
      />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Image Tools", href: "/tools/image-tools" },
          { label: "Image Editor" },
        ]}
        title="Image Editor – Resize, Crop, Rotate & Flip Free Online"
        description="Edit images directly in your browser — no software, no uploads. Resize to any dimension with social media presets, crop with preset aspect ratios, rotate to any angle, and flip in one click. Undo history keeps your workflow safe."
        howToSteps={HOW_TO_STEPS}
        benefits={BENEFITS}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
