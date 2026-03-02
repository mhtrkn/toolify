import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "File Converter",
  categoryDescription:
    "Convert Word and Excel files to PDF online for free. Preserve formatting perfectly — no Microsoft Office or Adobe Acrobat required. Works directly in your browser.",
  categorySlug: "file-converter",
  keywords: [
    "file converter online free",
    "word to pdf free",
    "excel to pdf converter",
    "docx to pdf online",
    "xlsx to pdf converter",
    "document converter browser",
  ],
});

const FAQS = [
  {
    question: "Can I convert Word documents to PDF for free?",
    answer:
      "Yes, our Word to PDF converter is completely free with no file size limits and no registration required.",
  },
  {
    question: "Will my document formatting be preserved?",
    answer:
      "Yes, our converter preserves fonts, images, tables, and layout when converting between formats.",
  },
  {
    question: "What document formats are supported?",
    answer:
      "We support DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, RTF, and many other common document formats.",
  },
];

export default function FileConverterPage() {
  const tools = getToolsByCategory("file-converter");
  const category = getCategoryBySlug("file-converter")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "File Converter", url: `${SITE_URL}/file-converter` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
              <Image src={`/icons/${category.icon}.png`} width={36} height={36} alt="File converter icon" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                File Converter – Free Online Document Converter
              </h1>
              <p className="mt-1 text-slate-600">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">Convert Any File Format Online</h2>
          <p className="mt-3 text-slate-600">
            Our file converter supports the most popular document formats. Convert
            Word to PDF, Excel to PDF, and more with just a few clicks. Perfect
            formatting is guaranteed every time.
          </p>
        </div>
      </section>

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
