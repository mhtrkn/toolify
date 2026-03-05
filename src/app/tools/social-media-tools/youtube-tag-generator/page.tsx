import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import YouTubeTagGeneratorClient from "./YouTubeTagGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "YouTube Tag Generator",
  toolDescription:
    "Generate 20–30 SEO-optimized tags for your YouTube videos in seconds. Enter your video topic and niche to get a curated tag list that boosts discoverability and rankings.",
  categorySlug: "social-media-tools",
  toolSlug: "youtube-tag-generator",
  keywords: [
    "youtube tag generator free",
    "youtube seo tags generator",
    "best youtube tags for views",
    "youtube video tags ideas",
    "generate tags for youtube video",
    "youtube tags finder free",
    "youtube keyword tag generator",
    "youtube tags for more views 2025",
    "auto youtube tag generator",
    "free youtube tags tool",
  ],
});

const FAQS = [
  {
    question: "How many tags should a YouTube video have?",
    answer:
      "YouTube recommends 5–15 relevant tags. Too many unrelated tags can hurt your video. Focus on quality over quantity.",
  },
  {
    question: "Do YouTube tags still help with SEO in 2025?",
    answer:
      "Yes, though their impact is secondary to title, description, and thumbnails. Tags still help YouTube understand your content category and surface it in related videos.",
  },
  {
    question: "Should I use broad or specific tags?",
    answer:
      "Use a mix — 2–3 broad tags for discoverability, 5–8 mid-tail tags that describe your video specifically, and 3–5 long-tail tags matching search phrases your audience uses.",
  },
  {
    question: "Can I use these tags on TikTok or Instagram?",
    answer:
      "These tags are optimized for YouTube's algorithm. For Instagram or TikTok, use the dedicated Hashtag Generator tool on this site.",
  },
];

export default function YouTubeTagGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "YouTube Tag Generator", description: "Generate SEO tags for YouTube videos.", slug: "youtube-tag-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "YouTube Tag Generator", url: `${SITE_URL}/tools/social-media-tools/youtube-tag-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "YouTube Tag Generator" },
        ]}
        title="YouTube Tag Generator – Generate SEO Tags for More Views"
        description="Enter your video topic and get 20–30 SEO-optimized YouTube tags instantly. Copy all tags and paste them directly into your YouTube Studio upload."
        howToSteps={[
          { title: "Enter Your Topic", description: "Type your video's main topic or title into the topic field." },
          { title: "Add Your Niche", description: "Optionally add your channel niche for more targeted tag suggestions." },
          { title: "Copy & Paste", description: "Click Generate, then copy all tags and paste into YouTube Studio's tag field." },
        ]}
        benefits={[
          { title: "20–30 Tags per Video", description: "Get a comprehensive tag list covering broad to niche keywords." },
          { title: "SEO-Optimized", description: "Tags include common modifiers (tutorial, guide, tips) that match real searches." },
          { title: "One-Click Copy", description: "Copy all tags as a comma-separated list ready to paste into YouTube." },
          { title: "Niche-Aware", description: "Add your channel niche to get tags that match your specific audience." },
        ]}
        faqs={FAQS}
      >
        <YouTubeTagGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
