import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";
import Image from "next/image";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "PDF Tools",
  categoryDescription:
    "Free online PDF tools to merge, split, compress, convert, and protect PDF files. All tools run in your browser — no uploads, no registration, completely free.",
  categorySlug: "pdf-tools",
  keywords: [
    "pdf tools online free",
    "pdf converter online",
    "merge pdf free",
    "compress pdf online",
    "split pdf online",
    "pdf editor online free",
    "pdf tools no upload",
    "free pdf utilities",
  ],
});

const FAQS = [
  {
    question: "Are these PDF tools free to use?",
    answer:
      "Yes, all our PDF tools are completely free. No account or subscription required.",
  },
  {
    question: "Is my PDF data secure?",
    answer:
      "Your files are processed securely. We do not store or share your files and they are automatically deleted after processing.",
  },
  {
    question: "What is the maximum PDF file size?",
    answer:
      "You can upload PDF files up to 100MB. For larger files, consider splitting them first.",
  },
];

export default function PdfToolsPage() {
  const tools = getToolsByCategory("pdf-tools");
  const category = getCategoryBySlug("pdf-tools")!;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
  ]);
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start md:items-center gap-3">
            <div className="flex min-w-12 min-h-12 h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl md:text-2xl">
              <Image src={`/icons/${category.icon}.png`} width={36} height={36} alt="PDF tools icon" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                PDF Tools – Free Online PDF Converter
              </h1>
              <p className="mt-1 text-slate-600">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            All-in-One Online PDF Tools
          </h2>
          <p className="mt-3 text-slate-600">
            Our free PDF tools let you convert, merge, split, and compress PDF
            files entirely online. No software installation, no account needed —
            just upload your PDF and get your result in seconds.
          </p>
          <p className="mt-3 text-slate-600">
            Whether you need to convert a PDF to a JPG image, combine several
            PDFs into one document, or reduce a large PDF file size for emailing
            — toolify has the right tool for the job.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
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
