import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import ToolHeader from "@/components/tools/ToolHeader";

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

      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ToolHeader
            title="OCR Tools – Free Image to Text Converter"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* Text Extraction */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Text Extraction
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {tools
              .filter((t) =>
                ["ocr-image-to-text", "pdf-to-text"].includes(t.slug),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* Scanning & Editing */}
      <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Scanning & Editing
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {tools
              .filter((t) =>
                ["barcode-qr-scanner", "ocr-text-editor"].includes(t.slug),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
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
