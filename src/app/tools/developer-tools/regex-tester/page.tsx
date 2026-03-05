import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import RegexTesterClient from "./RegexTesterClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Regex Tester",
  toolDescription:
    "Test regular expressions online with real-time match highlighting, group capture display, and flag controls. JavaScript regex syntax. Free, browser-based, no signup.",
  categorySlug: "developer-tools",
  toolSlug: "regex-tester",
  keywords: [
    "regex tester online free",
    "regular expression tester",
    "javascript regex tester",
    "regex debugger online",
    "regex match highlighter",
    "online regex validator free",
    "regex group capture tester",
    "test regex pattern online",
    "regex flags tester",
    "live regex tester browser",
  ],
});

const FAQS = [
  {
    question: "What regex syntax is supported?",
    answer:
      "JavaScript (ECMAScript) regex syntax. This supports character classes, groups, backreferences, lookahead/lookbehind, and all standard flags.",
  },
  {
    question: "What flags are available?",
    answer:
      "g (global), i (case-insensitive), m (multiline), and s (dotAll — dot matches newlines). Toggle each flag independently.",
  },
  {
    question: "Are capture groups shown?",
    answer:
      "Yes. Each match entry shows its value, index, length, and any capture group values.",
  },
  {
    question: "Is there a quick reference?",
    answer:
      "Yes — expand the 'Quick Regex Reference' section at the bottom for a cheat sheet of common patterns.",
  },
  {
    question: "Is my data sent to a server?",
    answer: "No. All regex evaluation runs in your browser using JavaScript's built-in RegExp engine.",
  },
];

export default function RegexTesterPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Regex Tester",
          description: "Free online regex tester with real-time match highlighting and capture group display.",
          slug: "regex-tester",
          categorySlug: "developer-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Developer Tools", url: `${SITE_URL}/tools/developer-tools` },
          { name: "Regex Tester", url: `${SITE_URL}/tools/developer-tools/regex-tester` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Developer Tools", href: "/tools/developer-tools" },
          { label: "Regex Tester" },
        ]}
        title="Regex Tester – Free Online Regular Expression Debugger"
        description="Test and debug regular expressions with live match highlighting, flag controls, and capture group display. Supports full JavaScript regex syntax."
        howToSteps={[
          {
            title: "Enter your pattern",
            description: "Type your regular expression in the pattern field. Flags can be toggled below.",
          },
          {
            title: "Enter your test string",
            description: "Type or paste the text you want to test against in the Test String panel.",
          },
          {
            title: "See live results",
            description: "Matches are highlighted in real time. Match details (index, groups) appear below.",
          },
        ]}
        benefits={[
          {
            title: "Real-time highlighting",
            description: "All matches are highlighted instantly as you type — no need to click a button.",
          },
          {
            title: "Capture group display",
            description: "See each capture group value alongside the full match index and length.",
          },
          {
            title: "Built-in cheat sheet",
            description: "Quick reference for common patterns so you don't need to leave the page.",
          },
          {
            title: "Copy regex",
            description: "One-click copy of the full regex expression including flags.",
          },
        ]}
        faqs={FAQS}
      >
        <RegexTesterClient />
      </ToolPageLayout>
    </>
  );
}
