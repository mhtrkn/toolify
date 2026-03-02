import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import HtmlMinifierClient from "./HtmlMinifierClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "HTML Minifier",
  toolDescription:
    "Minify HTML code online by removing comments, extra whitespace, and redundant characters. Instantly reduce HTML file size.",
  categorySlug: "web-tools",
  toolSlug: "html-minifier",
  keywords: [
    "html minifier",
    "minify html online",
    "compress html code",
    "html compressor",
    "reduce html size",
    "html optimizer",
  ],
});

const FAQS = [
  {
    question: "What does HTML minification do?",
    answer:
      "HTML minification removes unnecessary characters like comments, extra whitespace, and line breaks without affecting how the page renders. This reduces file size and can improve page load speed.",
  },
  {
    question: "Will minification break my HTML?",
    answer:
      "For standard HTML, minification is safe. However, whitespace inside <pre> or <textarea> tags is preserved. Always test your page after minifying.",
  },
  {
    question: "Does it minify inline CSS and JavaScript?",
    answer:
      "Basic inline styles are preserved. Inline <script> and <style> blocks have their internal whitespace reduced.",
  },
  {
    question: "Is my HTML sent to a server?",
    answer:
      "No. Minification is done entirely in your browser using JavaScript regex operations. Your code never leaves your device.",
  },
];

export default function HtmlMinifierPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "HTML Minifier",
          description: "Minify HTML code online to reduce file size.",
          slug: "html-minifier",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Web Tools", url: `${SITE_URL}/web-tools` },
          { name: "HTML Minifier", url: `${SITE_URL}/web-tools/html-minifier` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Web Tools", href: "/web-tools" },
          { label: "HTML Minifier" },
        ]}
        title="HTML Minifier – Compress HTML Code Online"
        description="Paste your HTML and instantly get a minified version with comments and whitespace removed. See size savings in real-time."
        howToSteps={[
          { title: "Paste HTML", description: "Paste your HTML code into the input area." },
          { title: "See Minified Output", description: "The minified HTML appears instantly in the output area." },
          { title: "Copy or Download", description: "Copy the minified code or download it as an HTML file." },
        ]}
        benefits={[
          { title: "Instant Minification", description: "Results appear as you type — no button click required." },
          { title: "Size Savings", description: "See exactly how many bytes and what percentage you saved." },
          { title: "No Dependencies", description: "Pure browser-based — no external libraries or servers used." },
          { title: "Safe to Use", description: "Whitespace in <pre> tags is preserved to avoid layout issues." },
        ]}
        faqs={FAQS}
      >
        <HtmlMinifierClient />
      </ToolPageLayout>
    </>
  );
}
