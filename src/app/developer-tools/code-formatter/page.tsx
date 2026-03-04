import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import CodeFormatterClient from "./CodeFormatterClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Code Formatter & Minifier",
  toolDescription:
    "Format and minify JavaScript, CSS, HTML, JSON, and SQL code online. Beautify messy code or minify for production instantly — no upload, 100% browser-based.",
  categorySlug: "developer-tools",
  toolSlug: "code-formatter",
  keywords: [
    "code formatter online free",
    "javascript beautifier online",
    "css minifier free",
    "html formatter online",
    "json beautifier online",
    "sql formatter online free",
    "code beautify tool",
    "minify js online",
    "code formatter minifier browser",
    "format code without upload",
  ],
});

const FAQS = [
  {
    question: "Which languages does the formatter support?",
    answer: "JSON, HTML, CSS, JavaScript, and SQL. Select the language from the dropdown before processing.",
  },
  {
    question: "Is my code sent to a server?",
    answer: "No. All formatting and minification runs entirely in your browser. Your code is never uploaded anywhere.",
  },
  {
    question: "How is JavaScript formatted?",
    answer:
      "The JS formatter applies basic brace-based indentation. For strict PEP/style-guide formatting, use Prettier locally — our tool is optimized for quick, dependency-free formatting.",
  },
  {
    question: "What does minification do?",
    answer:
      "Minification removes whitespace, comments, and unnecessary characters to reduce file size for production. It shows the size savings percentage after processing.",
  },
  {
    question: "Can I use the output as input again?",
    answer: "Yes — use the ⇄ Swap button to send the output back to the input field for further processing.",
  },
];

export default function CodeFormatterPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Code Formatter & Minifier",
          description: "Free online code formatter and minifier for JSON, HTML, CSS, JavaScript, and SQL.",
          slug: "code-formatter",
          categorySlug: "developer-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Developer Tools", url: `${SITE_URL}/developer-tools` },
          { name: "Code Formatter", url: `${SITE_URL}/developer-tools/code-formatter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Developer Tools", href: "/developer-tools" },
          { label: "Code Formatter & Minifier" },
        ]}
        title="Code Formatter & Minifier – Free Online Beautify / Minify"
        description="Instantly format or minify JSON, HTML, CSS, JavaScript, and SQL in your browser. No server upload, no signup — paste your code and get clean results."
        howToSteps={[
          {
            title: "Select language & mode",
            description: "Choose the language (JSON, HTML, CSS, JS, SQL) and whether you want to beautify or minify.",
          },
          {
            title: "Paste your code",
            description: "Paste or type your code into the input panel on the left.",
          },
          {
            title: "Copy or download",
            description: "Click Beautify or Minify, then copy the result to clipboard or download the file.",
          },
        ]}
        benefits={[
          {
            title: "5 languages in one tool",
            description: "Format JSON, HTML, CSS, JavaScript, and SQL without switching tools.",
          },
          {
            title: "Size savings display",
            description: "Minify mode shows exactly how much smaller your code became.",
          },
          {
            title: "100% client-side",
            description: "Your code never leaves your browser — no server, no logs.",
          },
          {
            title: "Swap input ⇄ output",
            description: "Easily feed output back as input for chained operations.",
          },
        ]}
        faqs={FAQS}
      >
        <CodeFormatterClient />
      </ToolPageLayout>
    </>
  );
}
