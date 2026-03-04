import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Link from "next/link";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "SEO Tools",
  categoryDescription:
    "Free SEO and content tools — keyword generator, meta tag builder, LSI keyword explorer, content idea generator. 100% browser-based, no signup required.",
  categorySlug: "seo-tools",
  keywords: [
    "free seo tools online",
    "keyword generator tool free",
    "seo meta tag builder",
    "content idea generator",
    "lsi keyword explorer free",
    "seo tools no signup",
    "keyword research tool free",
    "serp preview tool",
    "seo content tools online",
    "long tail keyword generator",
  ],
});

const FAQS = [
  {
    question: "Are these SEO tools completely free?",
    answer:
      "Yes. All SEO tools are 100% free with no account, subscription, or registration required. No daily limits.",
  },
  {
    question: "Do these tools use an AI or API for keyword generation?",
    answer:
      "No. All tools run client-side using pattern-based algorithms. No external keyword API is called — results are instant and do not require internet access after the page loads.",
  },
  {
    question: "Is my data stored or sent anywhere?",
    answer:
      "No. All tools run entirely in your browser. Your keywords, meta tags, and content ideas never leave your device.",
  },
  {
    question: "What is the difference between Keyword Generator and LSI Keyword Explorer?",
    answer:
      "The Keyword Generator produces long-tail, question, and commercial intent variations of your seed keyword. The LSI Keyword Explorer focuses on semantic variations and topical depth terms.",
  },
  {
    question: "Can I use these tools for client SEO work?",
    answer:
      "Yes. Export keywords or content ideas as CSV and use them in your client deliverables, content briefs, or editorial calendars.",
  },
];

export default function SeoToolsPage() {
  const tools = getToolsByCategory("seo-tools");
  const category = getCategoryBySlug("seo-tools")!;

  const keywordTools = tools.filter((t) =>
    t.slug.includes("keyword") || t.slug.includes("lsi")
  );
  const contentTools = tools.filter((t) =>
    t.slug.includes("content") || t.slug.includes("meta")
  );
  const otherTools = tools.filter(
    (t) => !keywordTools.includes(t) && !contentTools.includes(t)
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "SEO Tools", url: `${SITE_URL}/seo-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-4 md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-3xl">
              🔍
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Free SEO & Content Tools – Keyword, Meta & Content Generator
              </h1>
              <p className="mt-1 text-slate-600">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keyword Research Tools */}
      {keywordTools.length > 0 && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-xl font-bold text-slate-800">🔑 Keyword Research Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {keywordTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content & Meta Tools */}
      {contentTools.length > 0 && (
        <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-xl font-bold text-slate-800">📝 Content & Metadata Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {contentTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other tools */}
      {otherTools.length > 0 && (
        <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-xl font-bold text-slate-800">🛠️ More SEO Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {otherTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Text */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Free SEO Tools for Content Creators & Marketers
          </h2>
          <p className="mt-3 text-slate-600">
            Whether you're planning a blog post, optimizing a landing page, or building a content
            calendar, our free SEO tools give you everything you need in one place. Use the{" "}
            <Link href="/seo-tools/keyword-generator" className="text-red-600 hover:underline">
              Keyword Generator
            </Link>{" "}
            to find long-tail keywords, the{" "}
            <Link href="/seo-tools/lsi-keyword-explorer" className="text-red-600 hover:underline">
              LSI Keyword Explorer
            </Link>{" "}
            to improve topical authority, and the{" "}
            <Link href="/seo-tools/seo-meta-builder" className="text-red-600 hover:underline">
              SEO Meta Tag Builder
            </Link>{" "}
            to generate perfect title and description tags with a live Google preview.
          </p>
          <p className="mt-3 text-slate-600">
            All tools are 100% free and run entirely in your browser — no API keys, no accounts,
            no rate limits. Export results as CSV for use in your content briefs or client reports.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {FAQS.map((faq, i) => (
              <div key={i} className="px-6 py-5">
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
