import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import InstagramCaptionGeneratorClient from "./InstagramCaptionGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Instagram Caption Generator",
  toolDescription:
    "Generate 3 ready-to-post Instagram captions with emojis and hashtags. Choose your topic, tone (excited, motivational, funny, professional, aesthetic), and get captions that drive engagement.",
  categorySlug: "social-media-tools",
  toolSlug: "instagram-caption-generator",
  keywords: [
    "instagram caption generator free",
    "generate captions for instagram",
    "instagram post caption ideas",
    "best instagram captions generator",
    "instagram caption maker online",
    "caption generator for instagram photos",
    "funny instagram caption generator",
    "motivational instagram caption generator",
    "instagram caption with hashtags free",
    "auto caption generator for instagram",
  ],
});

const FAQS = [
  {
    question: "How long should an Instagram caption be?",
    answer:
      "Instagram allows up to 2,200 characters, but only the first ~125 characters appear before 'more'. Use a strong hook at the start and put hashtags at the end.",
  },
  {
    question: "How many emojis should I use in an Instagram caption?",
    answer:
      "3–8 emojis per caption is a common best practice. Too many feels spammy; a few well-placed emojis improve readability and tone.",
  },
  {
    question: "Should I put hashtags in the caption or the comments?",
    answer:
      "Both work. Placing hashtags in the caption is slightly better for initial discoverability. Some creators put them in the first comment to keep the caption cleaner.",
  },
  {
    question: "Can I edit the generated caption?",
    answer:
      "Yes. The generated captions are starting points — customize them with your own voice, specific details, and any adjustments before posting.",
  },
];

export default function InstagramCaptionGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Instagram Caption Generator", description: "Generate Instagram captions with emojis and hashtags.", slug: "instagram-caption-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "Instagram Caption Generator", url: `${SITE_URL}/tools/social-media-tools/instagram-caption-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "Instagram Caption Generator" },
        ]}
        title="Instagram Caption Generator – Generate Engaging Captions Free"
        description="Enter your post topic, pick a mood, and get 3 ready-to-use Instagram captions with emojis and hashtags. Excited, funny, motivational, aesthetic, or professional — you choose."
        howToSteps={[
          { title: "Enter Your Topic", description: "Describe what your post is about — a place, product, activity, or feeling." },
          { title: "Choose a Mood", description: "Pick the tone: excited, motivational, funny, professional, or aesthetic." },
          { title: "Copy Your Caption", description: "Get 3 caption options and copy your favorite to paste into Instagram." },
        ]}
        benefits={[
          { title: "5 Mood Options", description: "Excited, motivational, funny, professional, and aesthetic templates." },
          { title: "Emojis Included", description: "Each caption has relevant emojis naturally woven in." },
          { title: "3 Variants per Generate", description: "Get multiple options and pick the one that fits your post best." },
          { title: "CTA Built-in", description: "Captions include calls-to-action (comments, saves, shares) to boost engagement." },
        ]}
        faqs={FAQS}
      >
        <InstagramCaptionGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
