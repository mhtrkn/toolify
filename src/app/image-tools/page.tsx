import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Image Tools",
  categoryDescription:
    "Free online image tools — compress, resize, and convert images. Supports JPG, PNG, WebP and more.",
  categorySlug: "image-tools",
  keywords: ["image tools", "compress image online", "resize image free", "image converter"],
});

const FAQS = [
  {
    question: "Can I compress images without losing quality?",
    answer:
      "Yes! Our smart compression algorithm reduces file size while preserving visual quality. You can also choose your compression level.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support JPG, JPEG, PNG, WebP, GIF, BMP, TIFF, and more. Output formats vary by tool.",
  },
  {
    question: "Is there a limit to how many images I can process?",
    answer:
      "You can process multiple images in one session. Batch processing is available for most tools.",
  },
];

export default function ImageToolsPage() {
  const tools = getToolsByCategory("image-tools");
  const category = getCategoryBySlug("image-tools")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Image Tools", url: `${SITE_URL}/image-tools` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
              <Image src={`/icons/${category.icon}.png`} width={36} height={36} alt={category.description} />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Image Tools – Free Online Image Editor
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
          <h2 className="text-xl font-bold text-slate-900">Free Image Editing Tools</h2>
          <p className="mt-3 text-slate-600">
            Toolify provides powerful, free image tools that run directly in your
            browser. Compress large photos before uploading, resize images to
            exact pixel dimensions, or convert between image formats — all without
            installing any software.
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
