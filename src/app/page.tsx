import FeaturedBlogs from "@/components/blog/FeaturedBlogs";
import GlobalUpload from "@/components/home/GlobalUpload";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { siteStats, whyChooseData } from "@/lib/mockdata";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildItemListSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";
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

const HOME_FAQS = [
  {
    question: "Are these tools really free?",
    answer:
      "Yes. Every tool on toolify is 100% free to use with no hidden costs, no subscription, and no credit card required. We are ad-supported to keep the service free.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. All processing happens directly in your browser — your files are never uploaded to our servers. We have no access to your data at any point.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No installation is required. toolify runs entirely in your web browser. Any modern browser (Chrome, Firefox, Safari, Edge) on desktop or mobile works perfectly.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support a wide range of formats including PDF, JPG, PNG, WebP, HEIC, DOCX, XLSX, PPTX, MP4, MOV, and many more. Each tool page lists its supported input and output formats.",
  },
  {
    question: "How fast are the conversions?",
    answer:
      "Most conversions complete in seconds because they run client-side in your browser using WebAssembly and the latest browser APIs. No round-trip to a remote server means near-instant results.",
  },
  {
    question: "Can I use these tools on my phone or tablet?",
    answer:
      "Yes. toolify is fully responsive and works on all modern smartphones and tablets. The interface adapts to any screen size for a seamless mobile experience.",
  },
];

export const metadata: Metadata = {
  title:
    "Free Online Converter Tools – PDF, Image, SEO, Developer & File Converter | toolify",
  description:
    "Free online converter tools for PDF, image, SEO, and developer utilities. Merge PDFs, compress images, convert Word to PDF, generate QR codes — fast, private, no registration.",
  alternates: { canonical: "/" },
  keywords:
    "free online tools, pdf tools, image compressor, word to pdf, qr code generator, keyword generator, code formatter, regex tester, seo meta tag builder, file converter online, merge pdf online, compress pdf free, resize image online, ocr image to text",
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
      <JsonLd data={buildFaqSchema(HOME_FAQS)} />
      <JsonLd
        data={buildItemListSchema(
          popularTools.map((t) => ({
            name: t.name,
            url: `${SITE_URL}/tools/${t.categorySlug}/${t.slug}`,
          })),
        )}
      />
      <JsonLd
        data={buildWebPageSchema({
          name: "Free Online Tools – PDF, Image, SEO, Developer & File Converter",
          description:
            "Free browser-based tools for PDF, image, OCR, SEO, developer utilities and file conversion. No signup, no installation.",
          url: SITE_URL,
          breadcrumb: [
            { name: "Home", url: SITE_URL },
            { name: "Online Tools", url: `${SITE_URL}/tools` },
          ],
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Online Tools", url: `${SITE_URL}/tools` },
        ])}
      />

      {/* Hero */}
      <section className="relative border-b border-slate-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl min-h-97.75 transition duration-300">
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

      {/* Top Tools – keyword-rich internal links */}
      <nav
        aria-label="Popular free online tools"
        className="border-b border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Quick Access
          </p>
          <ul className="flex flex-wrap gap-2">
            {[
              { label: "Merge PDF Online", href: "/tools/pdf-tools/merge-pdf" },
              {
                label: "Compress PDF Free",
                href: "/tools/pdf-tools/compress-pdf",
              },
              {
                label: "Convert Word to PDF",
                href: "/tools/pdf-tools/word-to-pdf",
              },
              {
                label: "PDF to JPG Converter",
                href: "/tools/pdf-tools/pdf-to-jpg",
              },
              {
                label: "Image Compressor Online",
                href: "/tools/image-tools/image-compressor",
              },
              {
                label: "Resize Image Online",
                href: "/tools/image-tools/image-resize",
              },
              {
                label: "QR Code Generator Free",
                href: "/tools/web-tools/qr-code-generator",
              },
              {
                label: "OCR Image to Text",
                href: "/tools/ocr-tools/ocr-image-to-text",
              },
              {
                label: "Keyword Generator Tool",
                href: "/tools/seo-tools/keyword-generator",
              },
              {
                label: "JSON Formatter Online",
                href: "/tools/developer-tools/code-formatter",
              },
              {
                label: "URL Shortener Free",
                href: "/tools/web-tools/url-shortener",
              },
              { label: "PDF to Text", href: "/tools/ocr-tools/pdf-to-text" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* How To */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
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

      {/* Stats */}
      <section className="bg-slate-50 border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {siteStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-200 p-6 py-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Trust Section */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
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
                  className="flex flex-col items-center text-center bg-white rounded-xl px-4 py-6 shadow-sm"
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
                  <h3 className="font-semibold text-sm text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-xs">
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
        <div className="mx-auto max-w-3xl">
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
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Browse
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Tool Categories
          </h2>
          <p className="mt-2 text-slate-500">
            Choose a category to find the right tool for your task.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

      {/* FAQ Section */}
      <section
        aria-labelledby="faq-heading"
        className="border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-1 text-3xl font-bold tracking-tight text-slate-900"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-500">
              Everything you need to know about toolify.
            </p>
          </div>
          <div className="space-y-4">
            {HOME_FAQS.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text – expanded */}
      <section className="border-t border-slate-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-slate">
          {/* Featured snippet target */}
          <h2 className="text-xl font-bold text-slate-900">
            What Are Free Online Tools?
          </h2>
          <p className="mt-3 text-slate-600">
            Free online tools are browser-based utilities that let you convert,
            edit, optimize, and analyze files without installing any software.
            toolify provides PDF tools, image tools, SEO tools, OCR tools,
            developer tools, and many other utilities that run entirely in your
            browser — no account, no download, no waiting.
          </p>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            The Best Free Online Tools for Everyday Tasks
          </h2>
          <p className="mt-3 text-slate-600">
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
            — we have you covered with dedicated PDF tools that process files
            instantly inside your browser.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            PDF Tools – Merge, Compress, Convert &amp; Edit PDFs Online
          </h3>
          <p className="mt-2 text-slate-600">
            PDF remains the world&apos;s most popular document format, but
            working with PDFs often requires expensive desktop software. Our
            free{" "}
            <Link
              href="/tools/pdf-tools/merge-pdf"
              className="text-red-600 hover:underline"
            >
              PDF merge tool
            </Link>{" "}
            lets you combine multiple PDF documents into one in seconds. The{" "}
            <Link
              href="/tools/pdf-tools/compress-pdf"
              className="text-red-600 hover:underline"
            >
              PDF compressor
            </Link>{" "}
            shrinks file size without noticeable quality loss — ideal before
            emailing or uploading. Use the{" "}
            <Link
              href="/tools/pdf-tools/word-to-pdf"
              className="text-red-600 hover:underline"
            >
              Word to PDF converter
            </Link>{" "}
            to produce perfectly formatted PDFs from .docx files, or the{" "}
            <Link
              href="/tools/pdf-tools/pdf-to-jpg"
              className="text-red-600 hover:underline"
            >
              PDF to JPG converter
            </Link>{" "}
            to extract each page as a high-resolution image. All PDF tools are
            client-side — your documents never leave your device.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            Image Tools – Compress, Resize &amp; Convert Images Online
          </h3>
          <p className="mt-2 text-slate-600">
            Our image tools make it easy to prepare visuals for any platform.
            The{" "}
            <Link
              href="/tools/image-tools/image-compressor"
              className="text-blue-600 hover:underline"
            >
              image compressor
            </Link>{" "}
            reduces JPG and PNG file sizes by up to 90% while preserving
            sharpness. The{" "}
            <Link
              href="/tools/image-tools/image-resize"
              className="text-blue-600 hover:underline"
            >
              image resize tool
            </Link>{" "}
            lets you set exact pixel dimensions or percentage scales — perfect
            for social media, email attachments, or web uploads. Need to convert
            formats? Our{" "}
            <Link
              href="/tools/image-tools/image-format-converter"
              className="text-blue-600 hover:underline"
            >
              image format converter
            </Link>{" "}
            handles HEIC, WebP, BMP, TIFF, PNG, and JPG conversions entirely in
            your browser using the latest WebAssembly technology.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            OCR Tools – Extract Text from Images &amp; Scanned PDFs
          </h3>
          <p className="mt-2 text-slate-600">
            Optical character recognition (OCR) turns images and scanned
            documents into editable text. Our{" "}
            <Link
              href="/tools/ocr-tools/ocr-image-to-text"
              className="text-orange-600 hover:underline"
            >
              OCR image to text
            </Link>{" "}
            tool supports 14 languages including English, Spanish, French,
            German, Chinese, and Arabic. The{" "}
            <Link
              href="/tools/ocr-tools/pdf-to-text"
              className="text-orange-600 hover:underline"
            >
              PDF to text extractor
            </Link>{" "}
            handles both native and scanned PDFs, falling back to OCR
            automatically when needed. Outputs can be downloaded as plain TXT,
            DOCX, or JSON. No file ever leaves your browser.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            Developer Tools – Format, Decode &amp; Test Code Online
          </h3>
          <p className="mt-2 text-slate-600">
            Our developer utilities are built for speed and precision. The{" "}
            <Link
              href="/tools/developer-tools/code-formatter"
              className="text-violet-600 hover:underline"
            >
              code formatter
            </Link>{" "}
            beautifies JSON, HTML, CSS, JavaScript, and SQL with one click. The{" "}
            <Link
              href="/tools/developer-tools/regex-tester"
              className="text-violet-600 hover:underline"
            >
              regex tester
            </Link>{" "}
            provides live match highlighting and capture group details as you
            type. Need to inspect an authentication token? Our JWT decoder
            parses header, payload, and signature instantly, entirely
            client-side. URL encoder/decoder, Base64 encoder, and color picker
            tools round out the developer toolkit.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            Web Tools – QR Code Generator, URL Shortener &amp; More
          </h3>
          <p className="mt-2 text-slate-600">
            Generate a{" "}
            <Link
              href="/tools/web-tools/qr-code-generator"
              className="text-indigo-600 hover:underline"
            >
              QR code for any URL, WiFi network, vCard, or email
            </Link>{" "}
            with custom colors, sizes, and error-correction levels — download as
            PNG or SVG. The{" "}
            <Link
              href="/tools/web-tools/url-shortener"
              className="text-indigo-600 hover:underline"
            >
              free URL shortener
            </Link>{" "}
            creates clean, shareable short links in seconds.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            SEO &amp; Content Tools – Keywords, Meta Tags &amp; More
          </h3>
          <p className="mt-2 text-slate-600">
            Plan your content strategy with the{" "}
            <Link
              href="/tools/seo-tools/keyword-generator"
              className="text-teal-600 hover:underline"
            >
              keyword generator
            </Link>
            , craft perfectly optimised title and description tags with the{" "}
            <Link
              href="/tools/seo-tools/seo-meta-builder"
              className="text-teal-600 hover:underline"
            >
              SEO meta tag builder
            </Link>
            , and discover semantic keyword variations with the{" "}
            <Link
              href="/tools/seo-tools/lsi-keyword-explorer"
              className="text-teal-600 hover:underline"
            >
              LSI keyword explorer
            </Link>
            . All SEO tools are beginner-friendly and require no signup.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            Why toolify Is the Best Free Online Tool Suite
          </h3>
          <p className="mt-2 text-slate-600">
            Unlike many online tool sites, toolify processes everything
            client-side. Your files are never sent to a remote server, which
            means absolute privacy and instant results — even with a slow
            connection. There is no file-size limit imposed by server resources,
            no signup wall, and no forced format upgrades. Whether you are a
            student, designer, developer, marketer, or business owner, toolify
            has a free tool ready for you right now.
          </p>
        </div>
      </section>
    </main>
  );
}
