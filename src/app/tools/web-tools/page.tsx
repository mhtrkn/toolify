import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";
import ToolHeader from "@/components/tools/ToolHeader";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Web Tools",
  categoryDescription:
    "Free online web and developer tools — generate QR codes, build color palettes, edit JSON/CSV, encode Base64, convert HTML to PDF, minify HTML, and shorten URLs. No signup required.",
  categorySlug: "web-tools",
  keywords: [
    "web tools online free",
    "qr code generator free",
    "json editor online",
    "base64 encoder",
    "url shortener free",
    "html minifier online",
    "developer tools browser",
    "color palette generator",
  ],
});

const FAQS = [
  {
    question: "Are these web tools free to use?",
    answer:
      "Yes, all web tools are completely free. No account or subscription required.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Most tools process data entirely in your browser without sending anything to a server. Your data stays private.",
  },
  {
    question: "Can I use these tools on mobile?",
    answer:
      "Yes, all tools are fully responsive and work on any device — mobile, tablet, or desktop.",
  },
];

export default function WebToolsPage() {
  const tools = getToolsByCategory("web-tools");
  const category = getCategoryBySlug("web-tools")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Web Tools", url: `${SITE_URL}/tools/web-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ToolHeader
            title="Web Tools – Free Online Developer Utilities"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* Generator Tools */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Generator Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3">
            {tools
              .filter((t) =>
                ["qr-code-generator", "color-palette"].includes(t.slug),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* Data & Encoding Tools */}
      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Data & Encoding Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3">
            {tools
              .filter((t) => ["base64", "url-shortener"].includes(t.slug))
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* HTML Tools */}
      <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            HTML Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3">
            {tools
              .filter((t) => ["html-to-pdf", "html-minifier"].includes(t.slug))
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
            All-in-One Online Developer & Designer Tools
          </h2>
          <p className="mt-3 text-slate-600">
            Our free web tools are built for developers and designers who need
            quick, reliable utilities without installing software. From
            generating QR codes and color palettes to encoding Base64 strings
            and minifying HTML — everything runs directly in your browser.
          </p>
          <p className="mt-3 text-slate-600">
            All tools are privacy-first: most processing happens client-side,
            meaning your data never leaves your device.
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
