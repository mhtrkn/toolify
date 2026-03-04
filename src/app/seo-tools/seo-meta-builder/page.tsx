import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import SeoMetaBuilderClient from "./SeoMetaBuilderClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "SEO Meta Tag Builder",
  toolDescription:
    "Build perfect SEO meta tags — title, description, Open Graph, and Twitter Card — with real-time character counters and Google SERP preview. Copy HTML snippet instantly.",
  categorySlug: "seo-tools",
  toolSlug: "seo-meta-builder",
  keywords: [
    "seo meta tag generator free",
    "meta description builder online",
    "open graph tag generator",
    "twitter card meta generator",
    "serp snippet preview tool",
    "html meta tags builder online",
    "seo title tag optimizer",
    "og tags generator free",
    "meta description character counter",
    "seo metadata snippet tool",
  ],
});

const FAQS = [
  {
    question: "Which meta tags does this tool generate?",
    answer:
      "Primary meta tags (title, description, canonical), Open Graph tags (og:title, og:description, og:url, og:image, og:site_name), and Twitter Card tags.",
  },
  {
    question: "What is the ideal length for a title tag?",
    answer:
      "Google typically displays 50–60 characters. The tool shows a live character counter with color indicators — green when in range, amber when too short, red when too long.",
  },
  {
    question: "What is the ideal meta description length?",
    answer:
      "140–160 characters. Beyond 160 characters Google truncates the snippet in search results.",
  },
  {
    question: "Can I preview how my page looks in Google?",
    answer:
      "Yes. The SERP Preview updates in real time as you type your title, description, and URL.",
  },
  {
    question: "Is this tool free?",
    answer: "Completely free with no signup. All processing runs in your browser.",
  },
];

export default function SeoMetaBuilderPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "SEO Meta Tag Builder",
          description:
            "Free online SEO meta tag builder with Google SERP preview and character counters.",
          slug: "seo-meta-builder",
          categorySlug: "seo-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "SEO Tools", url: `${SITE_URL}/seo-tools` },
          { name: "SEO Meta Tag Builder", url: `${SITE_URL}/seo-tools/seo-meta-builder` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "SEO Tools", href: "/seo-tools" },
          { label: "SEO Meta Tag Builder" },
        ]}
        title="SEO Meta Tag Builder – Free SERP Preview & OG Tag Generator"
        description="Build perfect title tags, meta descriptions, Open Graph, and Twitter Card HTML in seconds. Live SERP preview and character counters help you stay within Google's limits."
        howToSteps={[
          {
            title: "Fill in page details",
            description:
              "Enter your page title, meta description, and canonical URL. Character counters guide you to ideal lengths.",
          },
          {
            title: "Preview in Google SERP",
            description:
              "See a live preview of how your page will appear in Google search results as you type.",
          },
          {
            title: "Copy and paste",
            description:
              "Click 'Generate Meta Tags', then copy the HTML snippet and paste it into your page's <head>.",
          },
        ]}
        benefits={[
          {
            title: "Live SERP preview",
            description: "See exactly how your title and description will look in Google search results.",
          },
          {
            title: "Character counters",
            description: "Color-coded counters warn you if your title or description is too short or too long.",
          },
          {
            title: "Complete OG + Twitter Card",
            description: "Generates all necessary Open Graph and Twitter Card meta tags in one click.",
          },
          {
            title: "Ready-to-paste HTML",
            description: "Copy the complete, formatted HTML snippet for your <head> section.",
          },
        ]}
        faqs={FAQS}
      >
        <SeoMetaBuilderClient />
      </ToolPageLayout>
    </>
  );
}
