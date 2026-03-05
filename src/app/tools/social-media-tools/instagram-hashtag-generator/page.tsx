import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import InstagramHashtagGeneratorClient from "./InstagramHashtagGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Instagram Hashtag Generator",
  toolDescription:
    "Generate 30 targeted Instagram hashtags for any niche or topic. Get a perfect mix of trending, medium, and niche hashtags to maximize your reach — copy all at once.",
  categorySlug: "social-media-tools",
  toolSlug: "instagram-hashtag-generator",
  keywords: [
    "instagram hashtag generator free",
    "best hashtags for instagram",
    "instagram hashtags 30 copy paste",
    "niche hashtag generator instagram",
    "instagram hashtag finder free",
    "generate hashtags for instagram post",
    "viral instagram hashtags generator",
    "instagram hashtag tool 2025",
    "hashtag generator for more likes",
    "instagram hashtags by category",
  ],
});

const FAQS = [
  {
    question: "How many hashtags should I use on Instagram?",
    answer:
      "Instagram allows up to 30 hashtags per post. Research suggests 3–5 highly relevant hashtags perform best for engagement, but using 20–30 can improve discoverability. Test what works for your account.",
  },
  {
    question: "What's the difference between trending, medium, and niche hashtags?",
    answer:
      "Trending hashtags have millions of posts (high competition, hard to rank). Medium hashtags have 100k–1M posts (good balance). Niche hashtags have under 100k posts (easier to rank, more targeted audience).",
  },
  {
    question: "Should I use the same hashtags every post?",
    answer:
      "Instagram recommends varying your hashtags per post. Repeating the exact same set can reduce reach over time.",
  },
  {
    question: "Should I put hashtags in the caption or in the first comment?",
    answer:
      "Both work equally well for reach. Many creators put hashtags in the caption for simplicity, or in the first comment for a cleaner aesthetic.",
  },
];

export default function InstagramHashtagGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Instagram Hashtag Generator", description: "Generate 30 Instagram hashtags for any niche.", slug: "instagram-hashtag-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "Instagram Hashtag Generator", url: `${SITE_URL}/tools/social-media-tools/instagram-hashtag-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "Instagram Hashtag Generator" },
        ]}
        title="Instagram Hashtag Generator – Get 30 Targeted Hashtags Free"
        description="Enter your post niche or topic and generate 30 Instagram-ready hashtags organized into trending, medium, and niche tiers. Copy all at once."
        howToSteps={[
          { title: "Enter Your Niche", description: "Type your post topic or niche — e.g. travel, fitness, food, business." },
          { title: "Get 30 Hashtags", description: "Receive a curated list split into trending, medium, and niche tiers." },
          { title: "Copy & Post", description: "Copy all 30 hashtags at once or pick by tier, then paste into Instagram." },
        ]}
        benefits={[
          { title: "30 Hashtags per Generate", description: "Enough for a complete Instagram post in one click." },
          { title: "3-Tier Strategy", description: "Trending, medium, and niche hashtags — the optimal Instagram hashtag mix." },
          { title: "10+ Niches Supported", description: "Travel, food, fitness, fashion, beauty, business, photography, and more." },
          { title: "Copy by Tier", description: "Copy all hashtags, or just the trending/medium/niche sets separately." },
        ]}
        faqs={FAQS}
      >
        <InstagramHashtagGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
