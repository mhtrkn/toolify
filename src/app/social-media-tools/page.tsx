/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Link from "next/link";
import ToolHeader from "@/components/tools/ToolHeader";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Social Media Tools",
  categoryDescription:
    "Free social media tools for YouTube and Instagram creators — generate tags, titles, captions, hashtags, fancy text, and format posts for every platform. 100% free, no signup.",
  categorySlug: "social-media-tools",
  keywords: [
    "social media tools free online",
    "youtube tag generator free",
    "instagram hashtag generator",
    "fancy text generator",
    "instagram caption generator",
    "youtube thumbnail downloader",
    "hashtag generator free",
    "social media post formatter",
    "instagram bio font generator",
    "creator tools free online",
  ],
});

const FAQS = [
  {
    question: "Are these social media tools completely free?",
    answer:
      "Yes. All tools are 100% free with no account, subscription, or registration required.",
  },
  {
    question:
      "Do these tools work for Instagram, YouTube, TikTok, and LinkedIn?",
    answer:
      "Yes. We have platform-specific tools for YouTube and Instagram, plus general tools like Hashtag Generator and Post Formatter that support all major platforms.",
  },
  {
    question: "Is it safe to use these tools — do you store my data?",
    answer:
      "All tools run entirely in your browser. We do not send, store, or process your text on any server.",
  },
  {
    question: "What does the Fancy Text Generator actually do?",
    answer:
      "It converts your text into Unicode lookalike characters — bold, italic, cursive, gothic, bubble, and more — that work in social media bios, captions, and posts.",
  },
  {
    question:
      "Does the YouTube Thumbnail Downloader download copyrighted content?",
    answer:
      "No. It only fetches the publicly accessible thumbnail images hosted on YouTube's own servers (img.youtube.com). It does not download videos or any copyrighted media.",
  },
];

export default function SocialMediaToolsPage() {
  const tools = getToolsByCategory("social-media-tools");
  const category = getCategoryBySlug("social-media-tools")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Social Media Tools", url: `${SITE_URL}/social-media-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ToolHeader
            title="Social Media & Creator Tools – Free Online Generator Suite"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* YouTube Tools Sub-section */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            YouTube Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools
              .filter((t) => t.slug.startsWith("youtube"))
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* Instagram Tools Sub-section */}
      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Instagram Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools
              .filter((t) => t.slug.startsWith("instagram"))
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* General Social Tools Sub-section */}
      <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            General Social Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools
              .filter(
                (t) =>
                  !t.slug.startsWith("youtube") &&
                  !t.slug.startsWith("instagram"),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            All-in-One Social Media Creator Toolkit
          </h2>
          <p className="mt-3 text-slate-600">
            Whether you're a solo creator, brand manager, or digital marketer,
            our free social media tools help you produce better content faster.
            Use the{" "}
            <Link
              href="/social-media-tools/youtube-tag-generator"
              className="text-rose-600 hover:underline"
            >
              YouTube Tag Generator
            </Link>{" "}
            to improve SEO, the{" "}
            <Link
              href="/social-media-tools/instagram-hashtag-generator"
              className="text-rose-600 hover:underline"
            >
              Instagram Hashtag Generator
            </Link>{" "}
            to maximize reach, or the{" "}
            <Link
              href="/social-media-tools/fancy-text-generator"
              className="text-rose-600 hover:underline"
            >
              Fancy Text Generator
            </Link>{" "}
            to make your bio stand out — all without leaving your browser.
          </p>
          <p className="mt-3 text-slate-600">
            Every tool is 100% client-side: your content never leaves your
            device. No logins, no rate limits, no ads in the way. Just clean,
            fast, professional-grade creator tools.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
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
