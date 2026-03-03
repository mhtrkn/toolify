import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "OCR Tools",
  categoryDescription:
    "Free online OCR tools to extract text from images and PDFs. AI-powered optical character recognition supports 100+ languages — no registration required.",
  categorySlug: "ocr-tools",
  keywords: [
    "ocr tools online free",
    "extract text from image free",
    "pdf to text online",
    "image ocr browser",
    "text recognition online",
    "ocr no signup free",
  ],
});

const FAQS = [
  {
    question: "What is OCR?",
    answer:
      "OCR (Optical Character Recognition) is technology that converts text in images or scanned documents into editable, searchable text.",
  },
  {
    question: "What languages does the OCR support?",
    answer:
      "Our OCR engine supports over 100 languages including English, Spanish, French, German, Chinese, Arabic, and many more.",
  },
  {
    question: "How accurate is the OCR?",
    answer:
      "Our OCR achieves 99%+ accuracy for high-quality printed text. Handwriting and low-resolution images may have lower accuracy.",
  },
];

export default function OcrToolsPage() {
  const tools = getToolsByCategory("ocr-tools");
  const category = getCategoryBySlug("ocr-tools")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "OCR Tools", url: `${SITE_URL}/ocr-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              <Image
                src={`/icons/${category.icon}.png`}
                width={36}
                height={36}
                alt="OCR tools icon"
              />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                OCR Tools – Free Image to Text Converter
              </h1>
              <p className="mt-1 text-slate-600">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {tools
              .slice()
              .sort((a, b) => Number(b.popular ?? 0) - Number(a.popular ?? 0))
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            AI-Powered OCR Text Recognition
          </h2>
          <p className="mt-3 text-slate-600">
            Extract text from scanned documents, photos of receipts,
            screenshots, or any image file. Our AI-powered OCR engine delivers
            fast and accurate results with support for over 100 languages.
          </p>
        </div>
      </section>

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
