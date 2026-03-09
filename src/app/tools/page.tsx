import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { buildMetadata, SITE_URL } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/structured-data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "All Free Online Tools – PDF, Image, SEO & Developer Utilities",
  description:
    "Browse all free online tools in one place. PDF converter, image compressor, code formatter, SEO keyword generator, and more — no signup, runs in your browser.",
  path: "/tools",
  keywords: [
    "free online tools",
    "all tools list",
    "pdf tools online",
    "image tools free",
    "developer tools online",
    "seo tools free",
    "file converter online",
    "web tools browser",
  ],
});

export default function AllToolsPage() {
  const toolsByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    tools: TOOLS.filter((t) => t.category === cat.id),
  }));

  const totalTools = TOOLS.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "All Tools", url: `${SITE_URL}/tools` },
        ])}
      />
      <JsonLd
        data={buildItemListSchema(
          TOOLS.map((tool) => ({
            name: tool.name,
            url: `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
          }))
        )}
      />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={[{ label: "All Tools" }]} />

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            All Tools
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-500">
            {totalTools} free online tools across {CATEGORIES.length} categories.
            No signup, no uploads — everything runs in your browser.
          </p>

          {/* Category quick-nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className={`inline-flex items-center gap-2 rounded-lg border bg-linear-to-br px-3 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cat.bgColor} ${cat.borderColor} ${cat.color}`}
              >
                <Image
                  src={`/icons/${cat.icon}.png`}
                  alt=""
                  width={16}
                  height={16}
                />
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tool sections by category */}
      {toolsByCategory.map(({ category, tools }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-20 border-b border-slate-100 bg-white px-4 py-12 odd:bg-slate-50 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-3xl">
            {/* Category header */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-sm ${category.bgColor} ${category.borderColor} border`}
              >
                <Image
                  src={`/icons/${category.icon}.png`}
                  alt={`${category.name} icon`}
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <Link
                  href={`/tools/${category.slug}`}
                  className={`text-xl font-bold tracking-tight transition-colors hover:underline ${category.color}`}
                >
                  {category.name}
                </Link>
                <p className="text-sm text-slate-500">
                  {tools.length} tool{tools.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Tools grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
