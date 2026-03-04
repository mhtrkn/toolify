import SearchBar from "@/components/home/SearchBar";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { whyChooseData } from "@/lib/mockdata";
import { buildWebSiteSchema } from "@/lib/structured-data";
import { CATEGORIES, getPopularTools } from "@/lib/tools";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Online Tools – PDF, Image, SEO, Developer & File Converter | toolify",
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
      <section className="bg-grid-pattern border-b border-slate-200 bg-white px-4 py-16 text-center sm:px-6 sm:py-26 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Free Online Tools –{" "}
            <span className="text-red-600">
              PDF, Image & File Converter
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            All the tools you need in one place. No software to install, no
            account required. Fast, free, and secure.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900">Tool Categories</h2>
          <p className="mt-2 text-slate-500">
            Choose a category to find the right tool for your task.
          </p>
          <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(155px,1fr))]">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`group flex flex-col items-center gap-3 bg-linear-to-br from-25% rounded-xl border p-6 text-center shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl ${cat.bgColor} ${cat.borderColor}`}
              >
                <Image
                  src={`/icons/${cat.icon}.png`}
                  alt={`${cat.name} tools icon`}
                  width={36}
                  height={36}
                />
                <div>
                  <p className={`font-semibold ${cat.color}`}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="border-t border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900">Popular Tools</h2>
          <p className="mt-2 text-slate-500">
            Most-used tools trusted by millions of users every day.
          </p>
          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
            {popularTools.map((tool) => (
              <ToolCard isHomepage key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features / Trust Section */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Why Choose Toolify?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseData.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center"
              >
                <div className="flex items-center justify-center mb-2">
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
                <p className="mt-2 text-sm text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-slate">
          <h2 className="text-xl font-bold text-slate-900">
            The Best Free Online Tools for Everyday Tasks
          </h2>
          <p className="mt-3 text-slate-600 mb-8">
            toolify offers a comprehensive suite of free online tools to handle
            your everyday file conversion, editing, and optimization needs.
            Whether you need to{" "}
            <Link
              href="/pdf-tools/merge-pdf"
              className="text-red-600 hover:underline"
            >
              merge PDF files
            </Link>
            ,{" "}
            <Link
              href="/pdf-tools/compress-pdf"
              className="text-red-600 hover:underline"
            >
              compress a PDF
            </Link>
            ,{" "}
            <Link
              href="/pdf-tools/pdf-to-jpg"
              className="text-red-600 hover:underline"
            >
              convert PDF to JPG
            </Link>
            , or{" "}
            <Link
              href="/pdf-tools/word-to-pdf"
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
              href="/image-tools/image-compressor"
              className="text-blue-600 hover:underline"
            >
              compress an image
            </Link>{" "}
            before uploading? Or{" "}
            <Link
              href="/image-tools/image-resize"
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
              href="/web-tools/qr-code-generator"
              className="text-indigo-600 hover:underline"
            >
              QR code for any URL or WiFi network
            </Link>
            , shorten links with our{" "}
            <Link
              href="/web-tools/url-shortener"
              className="text-indigo-600 hover:underline"
            >
              free URL shortener
            </Link>
            , or extract text from images using our{" "}
            <Link
              href="/ocr-tools/ocr-image-to-text"
              className="text-orange-600 hover:underline"
            >
              OCR image to text
            </Link>{" "}
            tool. For code work, our{" "}
            <Link
              href="/developer-tools/code-formatter"
              className="text-violet-600 hover:underline"
            >
              Code Formatter
            </Link>{" "}
            handles JSON, HTML, CSS, JS, and SQL, while our{" "}
            <Link
              href="/developer-tools/regex-tester"
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
              href="/seo-tools/keyword-generator"
              className="text-teal-600 hover:underline"
            >
              Keyword Generator
            </Link>
            , build perfect title and description tags with the{" "}
            <Link
              href="/seo-tools/seo-meta-builder"
              className="text-teal-600 hover:underline"
            >
              SEO Meta Tag Builder
            </Link>
            , and discover semantic variations with the{" "}
            <Link
              href="/seo-tools/lsi-keyword-explorer"
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
