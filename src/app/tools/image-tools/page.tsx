import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import ToolHeader from "@/components/tools/ToolHeader";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Image Tools",
  categoryDescription:
    "Free online image tools to compress, resize, and convert images in your browser. Supports JPG, PNG, and WebP — fast, secure, no account required.",
  categorySlug: "image-tools",
  keywords: [
    "image tools online free",
    "image converter free",
    "compress image online",
    "resize image online",
    "jpg png converter free",
    "image editor browser",
  ],
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
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Image Tools", url: `${SITE_URL}/tools/image-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ToolHeader
            title="Image Tools – Free Online Image Editor"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* Image Editing */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Image Editing
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools
              .filter((t) =>
                [
                  "image-editor",
                  "image-resize",
                  "image-compressor",
                  "gif-maker",
                ].includes(t.slug),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* Image Conversion */}
      <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Image Conversion
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools
              .filter((t) =>
                ["image-converter", "jpg-to-png", "png-to-jpg"].includes(
                  t.slug,
                ),
              )
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-slate-900">
            Free Image Editing Tools
          </h2>
          <p className="mt-3 text-slate-600">
            toolify provides powerful, free image tools that run directly in
            your browser. Compress large photos before uploading, resize images
            to exact pixel dimensions, or convert between image formats — all
            without installing any software.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
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
