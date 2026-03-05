import SearchBar from "@/components/home/SearchBar";
import FeaturedBlogs from "@/components/blog/FeaturedBlogs";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { whyChooseData } from "@/lib/mockdata";
import { buildWebSiteSchema } from "@/lib/structured-data";
import { CATEGORIES, getPopularTools } from "@/lib/tools";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Free Online Tools – PDF, Image, SEO, Developer & File Converter | toolify",
  description:
    "Free online tools for PDF, image, SEO, and developer utilities. Merge PDFs, generate keywords, format code, decode JWTs — fast, secure, no registration.",
  alternates: { canonical: "/" },
  keywords:
    "free online tools, pdf tools, image compressor, word to pdf, qr code generator, keyword generator, code formatter, regex tester, seo meta tag builder, file converter online",
};

export default function HomePage() {
  const popularTools = getPopularTools();

  return (
    <main>
      <JsonLd data={buildWebSiteSchema()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            100% Free · No Account · Runs in Your Browser
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Free Online Tools –{" "}
            <span className="text-red-600">PDF, Image & File Converter</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Merge PDFs, compress images, convert files, generate QR codes —
            everything processes instantly in your browser. Fast, private, and
            free.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Browse
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Tool Categories
          </h2>
          <p className="mt-2 text-slate-500">
            Choose a category to find the right tool for your task.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className={`group flex flex-col items-center gap-2.5 rounded-xl border bg-linear-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cat.bgColor} ${cat.borderColor}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 shadow-sm">
                  <Image
                    src={`/icons/${cat.icon}.png`}
                    alt={`${cat.name} tools icon`}
                    width={24}
                    height={24}
                  />
                </div>
                <p
                  className={`text-xs font-semibold leading-tight ${cat.color}`}
                >
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="border-t border-slate-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Most Used
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Popular Tools
          </h2>
          <p className="mt-2 text-slate-500">
            Trusted by millions of users every day.
          </p>
          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard isHomepage key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            View all tools
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features / Trust Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Why Toolify
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Built for speed and privacy
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseData.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center">
                  <Image
                    src={`/icons/${feature.icon}.png`}
                    alt={`${feature.title} icon`}
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <FeaturedBlogs />

      {/* SEO Text */}
      <section className="border-t border-slate-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl prose prose-slate">
          <h2 className="text-xl font-bold text-slate-900">
            The Best Free Online Tools for Everyday Tasks
          </h2>
          <p className="mt-3 text-slate-600 mb-8">
            toolify offers a comprehensive suite of free online tools to handle
            your everyday file conversion, editing, and optimization needs.
            Whether you need to{" "}
            <Link
              href="/tools/pdf-tools/merge-pdf"
              className="text-red-600 hover:underline"
            >
              merge PDF files
            </Link>
            ,{" "}
            <Link
              href="/tools/pdf-tools/compress-pdf"
              className="text-red-600 hover:underline"
            >
              compress a PDF
            </Link>
            ,{" "}
            <Link
              href="/tools/pdf-tools/pdf-to-jpg"
              className="text-red-600 hover:underline"
            >
              convert PDF to JPG
            </Link>
            , or{" "}
            <Link
              href="/tools/pdf-tools/word-to-pdf"
              className="text-red-600 hover:underline"
            >
              convert Word to PDF
            </Link>{" "}
            — we have you covered with 9 dedicated PDF tools.
          </p>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            Image &amp; File Tools
          </h3>
          <p className="mt-2 text-slate-600 mb-8">
            Need to{" "}
            <Link
              href="/tools/image-tools/image-compressor"
              className="text-blue-600 hover:underline"
            >
              compress an image
            </Link>{" "}
            before uploading? Or{" "}
            <Link
              href="/tools/image-tools/image-resize"
              className="text-blue-600 hover:underline"
            >
              resize a photo
            </Link>{" "}
            to exact pixel dimensions? Our image tools handle JPG, PNG, and WebP
            in seconds.
          </p>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            Web &amp; Developer Tools
          </h3>
          <p className="mt-2 text-slate-600">
            Generate a{" "}
            <Link
              href="/tools/web-tools/qr-code-generator"
              className="text-indigo-600 hover:underline"
            >
              QR code for any URL or WiFi network
            </Link>
            , shorten links with our{" "}
            <Link
              href="/tools/web-tools/url-shortener"
              className="text-indigo-600 hover:underline"
            >
              free URL shortener
            </Link>
            , or extract text from images using our{" "}
            <Link
              href="/tools/ocr-tools/ocr-image-to-text"
              className="text-orange-600 hover:underline"
            >
              OCR image to text
            </Link>{" "}
            tool. For code work, our{" "}
            <Link
              href="/tools/developer-tools/code-formatter"
              className="text-violet-600 hover:underline"
            >
              Code Formatter
            </Link>{" "}
            handles JSON, HTML, CSS, JS, and SQL, while our{" "}
            <Link
              href="/tools/developer-tools/regex-tester"
              className="text-violet-600 hover:underline"
            >
              Regex Tester
            </Link>{" "}
            provides live match highlighting.
          </p>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            SEO &amp; Content Tools
          </h3>
          <p className="mt-2 text-slate-600">
            Plan your content strategy with our{" "}
            <Link
              href="/tools/seo-tools/keyword-generator"
              className="text-teal-600 hover:underline"
            >
              Keyword Generator
            </Link>
            , build perfect title and description tags with the{" "}
            <Link
              href="/tools/seo-tools/seo-meta-builder"
              className="text-teal-600 hover:underline"
            >
              SEO Meta Tag Builder
            </Link>
            , and discover semantic variations with the{" "}
            <Link
              href="/tools/seo-tools/lsi-keyword-explorer"
              className="text-teal-600 hover:underline"
            >
              LSI Keyword Explorer
            </Link>
            . All tools are designed to be beginner-friendly with a clean,
            distraction-free interface — no software, no signup, just results.
          </p>
        </div>
      </section>
    </main>
  );
}
