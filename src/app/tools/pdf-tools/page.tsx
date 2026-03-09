import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";
import ToolHeader from "@/components/tools/ToolHeader";

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
          { name: "Tools", url: `${SITE_URL}/tools` },
    { name: "PDF Tools", url: `${SITE_URL}/tools/pdf-tools` },
  ]);
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ToolHeader
            title="PDF Tools – Free Online PDF Converter"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* PDF Management */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            PDF Management
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3">
            {tools
              .filter((t) =>
                [
                  "merge-pdf",
                  "split-pdf",
                  "delete-pdf-pages",
                  "compress-pdf",
                  "protect-pdf",
                ].includes(t.slug),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* PDF Conversion */}
      <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            PDF Conversion
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3">
            {tools
              .filter((t) =>
                [
                  "pdf-to-jpg",
                  "jpg-to-pdf",
                  "pdf-to-word",
                  "word-to-pdf",
                  "text-to-pdf",
                  "rich-text-to-pdf",
                ].includes(t.slug),
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
