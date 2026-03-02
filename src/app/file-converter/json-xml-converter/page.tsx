import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import JsonXmlClient from "./JsonXmlClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JSON ↔ XML Converter",
  toolDescription:
    "Convert JSON to XML and XML to JSON online for free. Bidirectional converter with instant preview — no server uploads, no registration.",
  categorySlug: "file-converter",
  toolSlug: "json-xml-converter",
  keywords: [
    "json to xml converter",
    "xml to json converter",
    "json to xml online free",
    "xml to json online",
    "convert json to xml browser",
    "json xml converter free",
    "xml to json download",
    "convert xml to json no upload",
    "json to xml formatter",
    "xml json converter tool",
  ],
});

const FAQS = [
  {
    question: "How are JSON arrays converted to XML?",
    answer:
      "JSON array items are wrapped in <item> tags. Object keys become XML element names. Nested objects and arrays are recursively serialized.",
  },
  {
    question: "How are XML attributes handled?",
    answer:
      "The XML → JSON parser treats element content as values. XML attributes are not currently extracted separately — only text content and child elements.",
  },
  {
    question: "Is my data uploaded to a server?",
    answer:
      "No. All conversion runs entirely in your browser using the built-in DOMParser and JavaScript. Your files never leave your device.",
  },
  {
    question: "What happens with invalid XML?",
    answer:
      "If the XML cannot be parsed, a clear error message is shown. Check for unclosed tags or invalid characters and try again.",
  },
];

export default function JsonXmlPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JSON ↔ XML Converter",
          description: "Convert JSON to XML and XML to JSON online for free.",
          slug: "json-xml-converter",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "File Converter", url: `${SITE_URL}/file-converter` },
          { name: "JSON ↔ XML Converter", url: `${SITE_URL}/file-converter/json-xml-converter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "File Converter", href: "/file-converter" },
          { label: "JSON ↔ XML Converter" },
        ]}
        title="JSON ↔ XML Converter – Free Online Tool"
        description="Convert JSON objects to well-formed XML and parse XML back to JSON instantly in your browser. Upload a file or paste text — no server, no registration."
        howToSteps={[
          { title: "Choose Direction", description: "Select JSON → XML or XML → JSON using the mode toggle." },
          { title: "Upload or Paste", description: "Drop your file onto the uploader or paste content into the text area." },
          { title: "Download Result", description: "Preview the converted output and click Download to save the file." },
        ]}
        benefits={[
          { title: "100% Private", description: "Conversion runs in your browser — no data is sent to any server." },
          { title: "Handles Nesting", description: "Correctly serializes nested JSON objects and arrays into XML elements." },
          { title: "Instant Preview", description: "See the formatted output immediately before downloading." },
          { title: "No Registration", description: "Free to use with no account or sign-up required." },
        ]}
        faqs={FAQS}
      >
        <JsonXmlClient />
      </ToolPageLayout>
    </>
  );
}
