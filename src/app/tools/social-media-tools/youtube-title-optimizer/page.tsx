import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import YouTubeTitleOptimizerClient from "./YouTubeTitleOptimizerClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "YouTube Title Optimizer",
  toolDescription:
    "Generate 10 click-worthy, SEO-optimized YouTube title variations from your draft title. Uses proven power words, curiosity gaps, and audience-targeting patterns to maximize CTR.",
  categorySlug: "social-media-tools",
  toolSlug: "youtube-title-optimizer",
  keywords: [
    "youtube title generator free",
    "clickbait youtube title generator",
    "seo optimized youtube titles",
    "youtube title ideas generator",
    "best youtube title examples",
    "youtube title optimizer tool",
    "generate youtube titles free",
    "viral youtube title generator",
    "youtube ctr title optimizer",
    "youtube title for more clicks 2025",
  ],
});

const FAQS = [
  {
    question: "What makes a good YouTube title?",
    answer:
      "A great title is specific, includes the main keyword early, creates curiosity or promises a clear benefit, and is under 60 characters so it doesn't get cut off in search results.",
  },
  {
    question: "How long should a YouTube title be?",
    answer:
      "Aim for 50–60 characters for search visibility. YouTube displays up to ~100 characters, but Google search results show ~60 characters before truncating.",
  },
  {
    question: "Should I use numbers in YouTube titles?",
    answer:
      "Yes — numbered titles like '7 Proven Tips' or '5 Mistakes' consistently outperform generic titles because they set clear viewer expectations.",
  },
  {
    question: "Can I use these titles on TikTok or Instagram Reels?",
    answer:
      "Absolutely. These optimized titles also work well as hooks for Reels, Shorts, and TikTok video captions.",
  },
];

export default function YouTubeTitleOptimizerPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "YouTube Title Optimizer", description: "Generate click-worthy YouTube titles.", slug: "youtube-title-optimizer", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "YouTube Title Optimizer", url: `${SITE_URL}/tools/social-media-tools/youtube-title-optimizer` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "YouTube Title Optimizer" },
        ]}
        title="YouTube Title Optimizer – Generate Click-Worthy Titles Free"
        description="Turn your draft title into 10 high-CTR YouTube title variants. Powered by proven copywriting formulas — power words, curiosity gaps, and numbered lists."
        howToSteps={[
          { title: "Enter Your Draft Title", description: "Type your video topic or existing title in the input field." },
          { title: "Add Niche & Audience", description: "Specify your channel niche and target audience for more relevant results." },
          { title: "Pick & Copy", description: "Browse the generated titles, pick your favorite, and copy it with one click." },
        ]}
        benefits={[
          { title: "10 Title Variants", description: "Get 10 different approaches — how-to, numbered lists, curiosity, challenge, and more." },
          { title: "Character Count", description: "Each title shows its character count so you can stay within the 60-char sweet spot." },
          { title: "CTR-Optimized Formulas", description: "Based on proven patterns from top-performing YouTube videos." },
          { title: "Copy Individually", description: "One-click copy for each title variant — no selecting text needed." },
        ]}
        faqs={FAQS}
      >
        <YouTubeTitleOptimizerClient />
      </ToolPageLayout>
    </>
  );
}
