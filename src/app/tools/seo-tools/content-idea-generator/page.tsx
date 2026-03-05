import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import ContentIdeaGeneratorClient from "./ContentIdeaGeneratorClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Content Idea Generator",
  toolDescription:
    "Generate blog post titles, content ideas, and topic clusters from any keyword or niche. 20 content formats including listicles, guides, and comparisons. Free, instant, no signup.",
  categorySlug: "seo-tools",
  toolSlug: "content-idea-generator",
  keywords: [
    "content idea generator free",
    "blog post idea generator",
    "blog title generator seo",
    "content topic generator online",
    "content marketing ideas tool",
    "blog idea generator from keyword",
    "content cluster generator",
    "content strategy tool free",
    "blog post title ideas",
    "content calendar idea generator",
  ],
});

const FAQS = [
  {
    question: "How are the content ideas generated?",
    answer:
      "Ideas are generated using a curated library of proven blog title templates applied to your topic. Templates include listicles, how-to guides, comparisons, case studies, and more.",
  },
  {
    question: "What is the 'Content Type' shown for each idea?",
    answer:
      "Content type suggests the best format for that title — How-To Guide, Listicle, Comparison, Review, Tutorial, Opinion Piece, etc. Use this to plan a diverse content calendar.",
  },
  {
    question: "What is the 'Angle' column?",
    answer:
      "The audience angle suggests who the piece should be written for — beginners, advanced practitioners, B2B, budget-conscious, etc. This helps you differentiate similar topics.",
  },
  {
    question: "Can I export ideas?",
    answer: "Yes. Click 'Export CSV' to download all ideas with their type and angle for use in your content calendar.",
  },
  {
    question: "How many ideas are generated per topic?",
    answer: "20 unique title ideas per query, spanning 13 different content types and 8 audience angles.",
  },
];

export default function ContentIdeaGeneratorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Content Idea Generator",
          description:
            "Free online content idea generator — 20+ blog titles, content types, and audience angles from any keyword.",
          slug: "content-idea-generator",
          categorySlug: "seo-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "SEO Tools", url: `${SITE_URL}/tools/seo-tools` },
          { name: "Content Idea Generator", url: `${SITE_URL}/tools/seo-tools/content-idea-generator` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "SEO Tools", href: "/tools/seo-tools" },
          { label: "Content Idea Generator" },
        ]}
        title="Content Idea Generator – Free Blog Post Title & Topic Planner"
        description="Enter any topic and get 20 blog post ideas with content type and audience angle. Filter by format, copy titles, and export to CSV for your content calendar."
        howToSteps={[
          {
            title: "Enter your topic or niche",
            description: "Type any topic, keyword, or industry and press Enter or click Generate.",
          },
          {
            title: "Filter by content type",
            description: "Use filter buttons to show only listicles, guides, comparisons, or other formats.",
          },
          {
            title: "Copy or export ideas",
            description: "Copy individual titles or export all ideas as a CSV for your editorial calendar.",
          },
        ]}
        benefits={[
          {
            title: "13 content formats",
            description: "Ideas span listicles, tutorials, case studies, comparisons, reviews, and more.",
          },
          {
            title: "Audience angle for each idea",
            description: "Each idea comes with a suggested audience angle to help you differentiate content.",
          },
          {
            title: "CSV export",
            description: "Download all ideas with type and angle into a spreadsheet-ready CSV.",
          },
          {
            title: "Instant & free",
            description: "No AI API, no credits, no signup — just type and generate.",
          },
        ]}
        faqs={FAQS}
      >
        <ContentIdeaGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
