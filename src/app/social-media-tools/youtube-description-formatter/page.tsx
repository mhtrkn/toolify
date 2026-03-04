import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import YouTubeDescriptionFormatterClient from "./YouTubeDescriptionFormatterClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "YouTube Description Formatter",
  toolDescription:
    "Create a professional YouTube video description with timestamps, links, hashtags, and a call-to-action. Formatted, SEO-friendly, and ready to paste into YouTube Studio.",
  categorySlug: "social-media-tools",
  toolSlug: "youtube-description-formatter",
  keywords: [
    "youtube description generator free",
    "youtube description template",
    "youtube video description formatter",
    "youtube description with timestamps",
    "seo youtube description maker",
    "create youtube description online",
    "youtube description formatter free",
    "youtube channel description generator",
    "youtube description with hashtags",
    "youtube description copy paste template",
  ],
});

const FAQS = [
  {
    question: "How long should a YouTube description be?",
    answer:
      "YouTube allows up to 5,000 characters. The first 2–3 lines are visible before the 'Show more' fold — make them count with your main keyword and a hook.",
  },
  {
    question: "Should I include keywords in my YouTube description?",
    answer:
      "Yes. Including your primary keyword in the first sentence and throughout the description helps YouTube understand your content and improve rankings.",
  },
  {
    question: "How do I format timestamps in a YouTube description?",
    answer:
      "Use MM:SS or HH:MM:SS format on a new line, e.g. '00:00 Intro'. YouTube automatically creates clickable chapter links from these.",
  },
  {
    question: "How many hashtags should I add to a YouTube description?",
    answer:
      "YouTube recommends 3–5 hashtags. Adding more than 15 causes all hashtags to be ignored. Place them at the end of the description.",
  },
];

export default function YouTubeDescriptionFormatterPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "YouTube Description Formatter", description: "Create formatted YouTube video descriptions.", slug: "youtube-description-formatter", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Social Media Tools", url: `${SITE_URL}/social-media-tools` },
        { name: "YouTube Description Formatter", url: `${SITE_URL}/social-media-tools/youtube-description-formatter` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Social Media Tools", href: "/social-media-tools" },
          { label: "YouTube Description Formatter" },
        ]}
        title="YouTube Description Formatter – Create Professional Descriptions Free"
        description="Fill in your video details and generate a complete, formatted YouTube description with timestamps, links, hashtags, and a call-to-action — ready to paste."
        howToSteps={[
          { title: "Enter Video Details", description: "Fill in your title, channel name, summary, and optional timestamps/links." },
          { title: "Add Hashtags & CTA", description: "Add 3–5 hashtags and customize your call-to-action message." },
          { title: "Copy & Paste", description: "Click Generate, review the formatted description, and copy it to YouTube Studio." },
        ]}
        benefits={[
          { title: "Professional Format", description: "Structured with sections, separators, and emojis for a clean look." },
          { title: "SEO-Ready", description: "Includes space for keywords, a hook in the first lines, and proper hashtag placement." },
          { title: "Clickable Timestamps", description: "Formatted timestamps that YouTube automatically converts into chapter links." },
          { title: "One-Click Copy", description: "Copy the entire formatted description to clipboard instantly." },
        ]}
        faqs={FAQS}
      >
        <YouTubeDescriptionFormatterClient />
      </ToolPageLayout>
    </>
  );
}
