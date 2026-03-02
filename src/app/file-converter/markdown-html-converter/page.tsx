import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import MarkdownHtmlClient from "./MarkdownHtmlClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Markdown ↔ HTML Converter",
  toolDescription:
    "Convert Markdown to HTML and HTML to Markdown online with a live split-pane preview. Instant, bidirectional, 100% client-side — no registration needed.",
  categorySlug: "file-converter",
  toolSlug: "markdown-html-converter",
  keywords: [
    "markdown to html converter",
    "html to markdown converter",
    "markdown to html online free",
    "md to html live preview",
    "html to markdown online",
    "convert markdown to html",
    "markdown html editor free",
    "md to html converter no signup",
    "html to md converter",
    "markdown preview online",
  ],
});

const FAQS = [
  {
    question: "Does the Markdown converter support GitHub Flavored Markdown?",
    answer:
      "Yes. The converter uses the Marked library with GFM enabled, supporting tables, task lists, strikethrough, and fenced code blocks.",
  },
  {
    question: "Can I see a live preview of my Markdown?",
    answer:
      "Yes. The right pane shows a live rendered preview that updates as you type, with a 300ms debounce for performance.",
  },
  {
    question: "How does HTML to Markdown work?",
    answer:
      "The converter uses Turndown.js to parse your HTML and generate clean Markdown with ATX headings and fenced code blocks.",
  },
  {
    question: "Is my content sent to a server?",
    answer:
      "No. Everything runs in your browser using Marked and Turndown. Your content is never uploaded anywhere.",
  },
];

export default function MarkdownHtmlPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Markdown ↔ HTML Converter",
          description: "Convert Markdown to HTML and HTML to Markdown with live preview.",
          slug: "markdown-html-converter",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "File Converter", url: `${SITE_URL}/file-converter` },
          { name: "Markdown ↔ HTML Converter", url: `${SITE_URL}/file-converter/markdown-html-converter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "File Converter", href: "/file-converter" },
          { label: "Markdown ↔ HTML Converter" },
        ]}
        title="Markdown ↔ HTML Converter – Live Preview"
        description="Convert Markdown to HTML with a live split-pane preview, or convert HTML back to Markdown. Supports GFM — tables, code blocks, strikethrough. No registration, no server."
        howToSteps={[
          { title: "Choose Direction", description: "Select Markdown → HTML or HTML → Markdown from the toolbar." },
          { title: "Type or Paste", description: "Write or paste your content in the left pane — the output updates live." },
          { title: "Copy or Download", description: "Copy the result to clipboard or download it as a file." },
        ]}
        benefits={[
          { title: "Live Preview", description: "See rendered HTML output update in real-time as you type, with 300ms debounce." },
          { title: "GFM Support", description: "GitHub Flavored Markdown — tables, fenced code, task lists, strikethrough." },
          { title: "Bidirectional", description: "Swap input and output with one click to round-trip your content." },
          { title: "100% Private", description: "All conversion runs in your browser — no data is ever sent to a server." },
        ]}
        faqs={FAQS}
      >
        <MarkdownHtmlClient />
      </ToolPageLayout>
    </>
  );
}
