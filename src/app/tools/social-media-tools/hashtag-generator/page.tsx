import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import HashtagGeneratorClient from "./HashtagGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Hashtag Generator",
  toolDescription:
    "Generate trending hashtags for any topic and platform — Instagram, Twitter/X, TikTok, LinkedIn, or YouTube. Get categorized hashtags by popularity tier and copy them all instantly.",
  categorySlug: "social-media-tools",
  toolSlug: "hashtag-generator",
  keywords: [
    "hashtag generator free online",
    "trending hashtags generator",
    "hashtag generator for twitter",
    "tiktok hashtag generator free",
    "linkedin hashtag generator",
    "youtube hashtag generator",
    "best hashtags for any topic",
    "hashtag finder tool free",
    "generate hashtags for post 2025",
    "viral hashtag generator online",
  ],
});

const FAQS = [
  {
    question: "How many hashtags should I use on each platform?",
    answer:
      "Twitter/X: 1–3 hashtags. Instagram: 5–30 hashtags. TikTok: 3–7 hashtags. LinkedIn: 3–5 hashtags. YouTube: 3–5 hashtags placed at the end of the description.",
  },
  {
    question: "Are these hashtags checked for current trending status?",
    answer:
      "These are algorithmically generated based on known popular hashtags for each niche and platform. For real-time trending hashtags, also check each platform's Explore/Trending section.",
  },
  {
    question: "What topics does the hashtag generator support?",
    answer:
      "It works best for common niches: travel, food, fitness, fashion, beauty, business, photography, technology, lifestyle, and art. For other topics, it generates relevant keyword-based hashtags.",
  },
  {
    question: "Can I use these hashtags on multiple platforms?",
    answer:
      "The hashtags themselves can be used anywhere, but the generated set is optimized for your chosen platform. Instagram and TikTok sets use more volume hashtags; LinkedIn uses professional keywords.",
  },
];

export default function HashtagGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Hashtag Generator", description: "Generate hashtags for any topic and platform.", slug: "hashtag-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "Hashtag Generator", url: `${SITE_URL}/tools/social-media-tools/hashtag-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "Hashtag Generator" },
        ]}
        title="Hashtag Generator – Generate Hashtags for Any Platform Free"
        description="Enter your topic and select a platform. Get a curated set of trending, medium, and niche hashtags optimized for Instagram, Twitter, TikTok, LinkedIn, or YouTube."
        howToSteps={[
          { title: "Enter Your Topic", description: "Type the topic or keyword for your post content." },
          { title: "Select Platform", description: "Choose your target platform — each has a different optimal hashtag strategy." },
          { title: "Copy & Post", description: "Copy all hashtags at once, or by tier, and paste them into your post." },
        ]}
        benefits={[
          { title: "5 Platform Modes", description: "Instagram, Twitter/X, TikTok, LinkedIn, and YouTube — each optimized differently." },
          { title: "3-Tier Strategy", description: "Trending (high volume), medium (balanced), and niche (targeted) hashtags per generate." },
          { title: "10+ Niche Databases", description: "Travel, food, fitness, fashion, beauty, business, tech, photography, and more." },
          { title: "Copy by Tier", description: "Copy all hashtags or select individual tiers to mix and match your strategy." },
        ]}
        faqs={FAQS}
      >
        <HashtagGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
