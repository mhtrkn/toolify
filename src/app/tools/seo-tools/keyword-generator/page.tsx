import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import KeywordGeneratorClient from "./KeywordGeneratorClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Keyword Generator",
  toolDescription:
    "Generate long-tail keywords, question keywords, and LSI variations from any seed topic. Free keyword research tool with CSV export — no API key, no signup required.",
  categorySlug: "seo-tools",
  toolSlug: "keyword-generator",
  keywords: [
    "keyword generator free online",
    "long tail keyword generator tool",
    "seo keyword research tool free",
    "question keyword generator",
    "keyword ideas from topic",
    "free keyword tool no api",
    "generate keywords for blog post",
    "lsi keyword generator free",
    "seo content keyword ideas",
    "keyword variations generator",
  ],
});

const FAQS = [
  {
    question: "Where do the keywords come from?",
    answer:
      "All keywords are generated client-side using linguistic patterns — prefix/suffix modifiers, question starters, and intent-based templates applied to your seed keyword. No external API.",
  },
  {
    question: "What types of keywords are generated?",
    answer:
      "Long-tail modifiers (best, free, online, for beginners), question keywords (how to, what is, why), commercial intent (best, top, review), and transactional variations.",
  },
  {
    question: "Can I export the keywords?",
    answer: "Yes. Click 'Export CSV' to download all (or filtered) keywords with their type as a .csv file.",
  },
  {
    question: "Is there a limit to how many keywords are generated?",
    answer: "The tool generates up to 80+ keywords per seed. Filter by type to see specific subsets.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. The tool is completely free and requires no signup, login, or API key.",
  },
];

export default function KeywordGeneratorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Keyword Generator",
          description: "Free online keyword generator — long-tail, questions, commercial, and LSI keywords from any seed topic.",
          slug: "keyword-generator",
          categorySlug: "seo-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "SEO Tools", url: `${SITE_URL}/tools/seo-tools` },
          { name: "Keyword Generator", url: `${SITE_URL}/tools/seo-tools/keyword-generator` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "SEO Tools", href: "/tools/seo-tools" },
          { label: "Keyword Generator" },
        ]}
        title="Free Keyword Generator – Long-tail, Questions & LSI Keywords"
        description="Enter any topic and instantly get long-tail keywords, question variations, commercial intent terms, and LSI keywords. Export as CSV. No API key needed."
        howToSteps={[
          {
            title: "Enter your seed keyword",
            description: "Type any topic, product name, or phrase and press Enter or click Generate.",
          },
          {
            title: "Filter by keyword type",
            description: "Use the filter buttons to view long-tail, question, or commercial intent keywords.",
          },
          {
            title: "Copy or export",
            description: "Copy all keywords to clipboard or download the full list as a CSV file.",
          },
        ]}
        benefits={[
          {
            title: "No API key required",
            description: "Generates keywords instantly using client-side patterns — no account or API needed.",
          },
          {
            title: "Multiple keyword types",
            description: "Long-tail, question-based, commercial intent, and transactional variations in one output.",
          },
          {
            title: "CSV export",
            description: "Download keywords with their type labels for use in spreadsheets or SEO tools.",
          },
          {
            title: "100% free",
            description: "No usage limits, no signup, no paywalls.",
          },
        ]}
        faqs={FAQS}
      >
        <KeywordGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
