import FeaturedBlogs from "@/components/blog/FeaturedBlogs";
import GlobalUpload from "@/components/home/GlobalUpload";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { whyChooseData } from "@/lib/mockdata";
import { buildHowToSchema, buildWebSiteSchema } from "@/lib/structured-data";
import { CATEGORIES, getPopularTools } from "@/lib/tools";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const WHY_ICONS: Record<string, { bg: string; color: string; path: string }> = {
  lightning: {
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    path: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  shield: {
    bg: "bg-blue-50",
    color: "text-blue-600",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  money: {
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  world: {
    bg: "bg-blue-50",
    color: "text-blue-600",
    path: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
};

const HOW_TO_STEPS = [
  {
    title: "Upload Your File",
    description:
      "Drag and drop or click to select the file you want to convert.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    badge: "bg-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-600 border-red-100",
  },
  {
    title: "Choose Format",
    description:
      "Select your desired output format from 100+ supported options.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    badge: "bg-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-600 border-red-100",
  },
  {
    title: "Download",
    description: "Get your converted file instantly, ready to use.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
    badge: "bg-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600 border-emerald-100",
  },
];

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
      <JsonLd
        data={buildHowToSchema({
          name: "How to Convert Files Online for Free",
          description:
            "Upload any file, choose your target format, and download the converted result instantly — all in your browser.",
          steps: HOW_TO_STEPS.map((s) => ({
            name: s.title,
            text: s.description,
          })),
        })}
      />

      {/* Hero */}
      <section className="relative border-b border-slate-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl min-h-97.75 transition duration-300">
          <h1 className="mt-4 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Free Online Convert Tools
            <br />
            <span className="text-red-600">PDF, Image & File Converter</span>
          </h1>

          <p className="mx-auto font-light mt-2 max-w-2xl text-slate-500">
            Everything processes instantly in your browser. Fast, private, and
            free.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            {/* <SearchBar /> */}
            <GlobalUpload />
          </div>
        </div>
      </section>

      {/* How To */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-base text-slate-500">
              Convert any file in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW_TO_STEPS.map((step, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`absolute -top-2.5 left-6 ${step.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  Step {i + 1}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 mt-2 border ${step.iconBg} ${step.iconColor}`}
                >
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Trust Section */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Why Toolify
            </p>
            <h2 className="text-base text-slate-500">
              Built for speed and privacy
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseData.map((feature) => {
              const icon = WHY_ICONS[feature.icon];
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 ${icon.bg} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <svg
                      className={`w-6 h-6 ${icon.color}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={icon.path}
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
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
