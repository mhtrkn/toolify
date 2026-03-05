import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import LsiKeywordExplorerClient from "./LsiKeywordExplorerClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "LSI Keyword Explorer",
  toolDescription:
    "Discover LSI (Latent Semantic Indexing) keywords and semantic variations to boost your content's topical authority. Free related keyword finder with CSV export.",
  categorySlug: "seo-tools",
  toolSlug: "lsi-keyword-explorer",
  keywords: [
    "lsi keyword finder free online",
    "semantic keyword explorer",
    "related keywords generator free",
    "topical authority keyword tool",
    "lsi keywords for seo content",
    "semantic seo keyword finder",
    "latent semantic indexing keywords",
    "co-occurrence keywords tool",
    "entity keyword explorer free",
    "related search terms generator",
  ],
});

const FAQS = [
  {
    question: "What are LSI keywords?",
    answer:
      "LSI (Latent Semantic Indexing) keywords are terms semantically related to your main keyword. Search engines use them to understand the topic depth and relevance of your content.",
  },
  {
    question: "How are the LSI keywords generated?",
    answer:
      "The tool applies semantic patterns (definition, types, examples, benefits, etc.), synonym variations using a curated dictionary, and partial-match variations of your keyword.",
  },
  {
    question: "How do I use LSI keywords?",
    answer:
      "Use Semantic Pattern keywords in body paragraphs, Synonym Variations in subheadings, and Partial Matches in alt text and captions. Don't force them — write naturally.",
  },
  {
    question: "Is there a CSV export?",
    answer: "Yes. Click 'Export CSV' to download keywords with their category type.",
  },
  {
    question: "Do I need an account or API key?",
    answer: "No. The tool runs entirely in your browser with no external dependencies.",
  },
];

export default function LsiKeywordExplorerPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "LSI Keyword Explorer",
          description:
            "Free LSI keyword finder — semantic patterns, synonym variations, and partial matches for topical authority.",
          slug: "lsi-keyword-explorer",
          categorySlug: "seo-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "SEO Tools", url: `${SITE_URL}/tools/seo-tools` },
          { name: "LSI Keyword Explorer", url: `${SITE_URL}/tools/seo-tools/lsi-keyword-explorer` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "SEO Tools", href: "/tools/seo-tools" },
          { label: "LSI Keyword Explorer" },
        ]}
        title="LSI Keyword Explorer – Free Semantic Keyword Finder"
        description="Find LSI and semantic keyword variations to improve your content's topical authority. Generates semantic patterns, synonym variations, and partial matches. Free, no signup."
        howToSteps={[
          {
            title: "Enter your target keyword",
            description: "Type the main keyword you want to build topical authority for.",
          },
          {
            title: "Explore keyword variations",
            description:
              "Review Semantic Pattern, Synonym Variation, and Partial Match categories.",
          },
          {
            title: "Copy or export",
            description: "Copy individual keywords or export all as CSV for use in your content.",
          },
        ]}
        benefits={[
          {
            title: "Three variation types",
            description:
              "Semantic patterns (examples, benefits, types), synonym variations, and partial matches.",
          },
          {
            title: "Topical authority",
            description:
              "Using LSI keywords signals to Google that your content covers a topic comprehensively.",
          },
          {
            title: "Usage tips included",
            description:
              "Built-in guidance on where to place each keyword type in your content.",
          },
          {
            title: "CSV export",
            description: "Download keywords with category labels for use in content briefs.",
          },
        ]}
        faqs={FAQS}
      >
        <LsiKeywordExplorerClient />
      </ToolPageLayout>
    </>
  );
}
