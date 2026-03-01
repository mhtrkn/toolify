import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Video Tools",
  categoryDescription:
    "Free online video tools — convert video formats, extract MP3 audio, and compress videos.",
  categorySlug: "video-tools",
  keywords: ["video converter online", "video to mp3", "extract audio from video", "compress video"],
});

const FAQS = [
  {
    question: "How do I convert a video to MP3?",
    answer:
      "Upload your video file, click 'Convert to MP3', and download your audio file. It takes just a few seconds.",
  },
  {
    question: "What video formats are supported?",
    answer:
      "We support MP4, AVI, MOV, MKV, WebM, FLV, WMV, and many more common video formats.",
  },
  {
    question: "What is the maximum video file size?",
    answer:
      "You can upload video files up to 500MB. For longer videos, we recommend compressing first.",
  },
];

export default function VideoToolsPage() {
  const tools = getToolsByCategory("video-tools");
  const category = getCategoryBySlug("video-tools")!;

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Video Tools", url: `${SITE_URL}/video-tools` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
              <Image src={`/icons/${category.icon}.png`} width={36} height={36} alt={category.description} />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Video Tools – Free Online Video Converter
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
          <h2 className="text-xl font-bold text-slate-900">Online Video Tools — No Software Needed</h2>
          <p className="mt-3 text-slate-600">
            Extract MP3 audio from any video file, convert between formats, and
            reduce video file sizes — all directly in your browser with no
            downloads or installs required.
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
