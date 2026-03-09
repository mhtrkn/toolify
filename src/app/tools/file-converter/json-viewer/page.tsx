import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JSON Viewer",
  toolDescription:
    "View, format, and validate JSON online. Interactive tree view with collapse/expand nodes, syntax highlighting, search, and live structure stats. Free, no signup, 100% client-side.",
  categorySlug: "file-converter",
  toolSlug: "json-viewer",
  keywords: [
    "json viewer online free",
    "json formatter online",
    "json beautifier free",
    "json validator online",
    "format json online",
    "json tree viewer",
    "json prettifier free",
    "json syntax highlighter",
    "view json file online",
    "json explorer browser",
  ],
});

const FAQS = [
  {
    question: "What does the JSON Viewer do?",
    answer:
      "It parses and displays your JSON in an interactive tree view with collapsible nodes, syntax highlighting, and structure statistics. You can also switch to formatted raw JSON and download the result.",
  },
  {
    question: "Can it validate my JSON?",
    answer:
      "Yes. The tool instantly validates your JSON as you type and shows a clear parse error message with the exact issue if the input is invalid.",
  },
  {
    question: "What does the Max Depth stat mean?",
    answer:
      "Max Depth indicates the deepest level of nesting in your JSON. A flat object has depth 1, while an object containing nested arrays or objects will have a higher depth value.",
  },
  {
    question: "How does search work in Tree View?",
    answer:
      "Typing in the search box highlights matching keys and string values throughout the tree. All nodes are automatically expanded while search is active so no match is hidden.",
  },
  {
    question: "Is my JSON data sent to a server?",
    answer:
      "No. All processing runs entirely in your browser using JavaScript. Your JSON data never leaves your device.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "The viewer supports JSON files up to 10 MB. For very large files the Raw JSON view is faster than the Tree View.",
  },
];

export default function JsonViewerPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JSON Viewer",
          description:
            "View, format, and validate JSON with an interactive collapsible tree viewer.",
          slug: "json-viewer",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          {
            name: "JSON Viewer",
            url: `${SITE_URL}/tools/file-converter/json-viewer`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "JSON Viewer" },
        ]}
        title="JSON Viewer — Format, Validate & Explore JSON Online"
        description="Paste or upload JSON to browse an interactive collapsible tree, view syntax-highlighted raw output, validate instantly, and inspect structure stats. Free, no registration required."
        howToSteps={[
          {
            title: "Paste or Upload",
            description:
              "Paste your JSON into the text area or upload a .json file up to 10 MB.",
          },
          {
            title: "Explore the Tree",
            description:
              "Browse the interactive tree view — expand or collapse any node, or search keys and values to highlight matches.",
          },
          {
            title: "Copy or Download",
            description:
              "Copy the formatted JSON to your clipboard or download it as a .json file.",
          },
        ]}
        benefits={[
          {
            title: "Live Validation",
            description:
              "Instantly see whether your JSON is valid. A detailed parse error points you to the exact problem.",
          },
          {
            title: "Interactive Tree",
            description:
              "Collapse and expand any object or array node to navigate even the most complex nested structures.",
          },
          {
            title: "Structure Stats",
            description:
              "At-a-glance metrics: max nesting depth, total keys, strings, numbers, booleans, and null values.",
          },
          {
            title: "100% Private",
            description:
              "Everything runs in your browser — your JSON is never uploaded to any server.",
          },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
