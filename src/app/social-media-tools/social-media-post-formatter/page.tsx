import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import SocialMediaPostFormatterClient from "./SocialMediaPostFormatterClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Social Media Post Formatter",
  toolDescription:
    "Format your post for Twitter/X (280 chars + thread split), Instagram (caption structure), LinkedIn (professional), Facebook, or TikTok. See character counts, limits, and platform warnings.",
  categorySlug: "social-media-tools",
  toolSlug: "social-media-post-formatter",
  keywords: [
    "social media post formatter",
    "twitter post formatter free",
    "linkedin post formatter online",
    "instagram post format tool",
    "social media text formatter",
    "format posts for multiple platforms",
    "twitter character counter",
    "linkedin article formatter free",
    "social post optimizer",
    "multi platform social media formatter",
  ],
});

const FAQS = [
  {
    question: "What character limits does each platform have?",
    answer:
      "Twitter/X: 280 characters. Instagram captions: 2,200 characters. LinkedIn posts: 3,000 characters. Facebook: 63,206 characters. TikTok captions: 2,200 characters.",
  },
  {
    question: "Does the Twitter formatter split long posts into threads?",
    answer:
      "Yes. If your text exceeds 280 characters, the formatter automatically splits it into numbered thread tweets (1/N format) at natural sentence boundaries.",
  },
  {
    question: "What does LinkedIn formatting do differently?",
    answer:
      "It adds extra line spacing and converts dashes to bullet points for better readability, matching LinkedIn's typical high-engagement post format.",
  },
  {
    question: "Does this tool post to social media?",
    answer:
      "No. This tool only formats text for you to copy and paste. It doesn't connect to any social media accounts or APIs.",
  },
];

export default function SocialMediaPostFormatterPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Social Media Post Formatter", description: "Format posts for Twitter, Instagram, LinkedIn, and more.", slug: "social-media-post-formatter", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Social Media Tools", url: `${SITE_URL}/social-media-tools` },
        { name: "Social Media Post Formatter", url: `${SITE_URL}/social-media-tools/social-media-post-formatter` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Social Media Tools", href: "/social-media-tools" },
          { label: "Social Media Post Formatter" },
        ]}
        title="Social Media Post Formatter – Format for Every Platform Free"
        description="Paste your post and select a platform. Get the correctly formatted version with character count, limit warnings, and platform-specific optimizations for Twitter, Instagram, LinkedIn, and more."
        howToSteps={[
          { title: "Paste Your Post", description: "Enter your draft post content in the text area." },
          { title: "Select Platform", description: "Choose Twitter/X, Instagram, LinkedIn, Facebook, or TikTok." },
          { title: "Copy Formatted Text", description: "Review warnings, copy the platform-optimized version, and post." },
        ]}
        benefits={[
          { title: "5 Platforms Supported", description: "Twitter/X, Instagram, LinkedIn, Facebook, and TikTok — each with specific rules." },
          { title: "Thread Splitter", description: "Twitter posts over 280 chars are automatically split into numbered thread tweets." },
          { title: "Character Counter", description: "Live character count with visual warnings when approaching or exceeding limits." },
          { title: "Platform Warnings", description: "Alerts for Instagram's 125-char fold, LinkedIn's 210-char fold, and Twitter's thread threshold." },
        ]}
        faqs={FAQS}
      >
        <SocialMediaPostFormatterClient />
      </ToolPageLayout>
    </>
  );
}
