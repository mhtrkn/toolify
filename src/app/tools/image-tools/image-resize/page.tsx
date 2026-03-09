import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Image Resize",
  toolDescription:
    "Resize images online for free to any custom width and height. Maintain aspect ratio or set exact dimensions. Supports JPG, PNG, WebP — no account needed.",
  categorySlug: "image-tools",
  toolSlug: "image-resize",
  keywords: [
    "resize image online free",
    "image resizer custom dimensions",
    "resize photo online",
    "change image size online free",
    "resize jpg online free",
    "resize png online",
    "image resize pixels free",
    "resize image without losing quality",
    "resize image for social media",
    "online image resizer no signup",
  ],
});

const FAQS = [
  {
    question: "Can I resize multiple images at once?",
    answer:
      "Yes! Upload multiple images and they will all be resized to the same dimensions.",
  },
  {
    question: "Will resizing reduce image quality?",
    answer:
      "Enlarging images can reduce quality since pixels are interpolated. Reducing size generally looks great.",
  },
  {
    question: "What output formats are available?",
    answer: "You can save resized images as JPEG, PNG, or WebP.",
  },
  {
    question: "Can I keep the original aspect ratio?",
    answer:
      "Yes. Enable 'Keep aspect ratio' and changing one dimension will automatically update the other.",
  },
];

export default function ImageResizePage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Image Resize", description: "Resize images online for free.", slug: "image-resize", categorySlug: "image-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Image Tools", url: `${SITE_URL}/tools/image-tools` },
        { name: "Image Resize", url: `${SITE_URL}/tools/image-tools/image-resize` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Image Tools", href: "/tools/image-tools" },
          { label: "Image Resize" },
        ]}
        title="Image Resizer – Resize Images to Any Dimension Free"
        description="Resize JPG, PNG, and WebP images to any pixel dimension. Set exact width and height, lock aspect ratio, use social media presets — download instantly."
        howToSteps={[
          { title: "Set Dimensions", description: "Enter your desired width and height, or pick a preset." },
          { title: "Upload Image", description: "Drag and drop or browse to select your image files." },
          { title: "Download", description: "Click Download to save the resized image." },
        ]}
        benefits={[
          { title: "Exact Pixel Control", description: "Set any width and height in pixels for precise output." },
          { title: "Social Media Presets", description: "One-click presets for Instagram, Twitter, YouTube, and more." },
          { title: "Aspect Ratio Lock", description: "Automatically maintain proportions when resizing." },
          { title: "Multiple Formats", description: "Export resized images as JPEG, PNG, or WebP." },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
