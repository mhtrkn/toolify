import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "CSV ↔ JSON Converter",
  toolDescription:
    "Convert CSV files to JSON and JSON arrays to CSV online for free. Bidirectional, instant, 100% client-side — no server uploads.",
  categorySlug: "file-converter",
  toolSlug: "csv-json-converter",
  keywords: [
    "csv to json converter",
    "json to csv converter",
    "csv to json online free",
    "json to csv online",
    "convert csv to json browser",
    "parse csv to json",
    "json to csv download",
    "csv json converter free",
    "convert json array to csv",
    "csv to json no upload",
  ],
});

const FAQS = [
  {
    question: "How does the CSV to JSON converter work?",
    answer:
      "Your CSV is parsed entirely in the browser. The first row becomes JSON keys, and each subsequent row becomes a JSON object. No file is uploaded to any server.",
  },
  {
    question: "What format should my JSON be for JSON → CSV conversion?",
    answer:
      "The input must be a JSON array of flat objects, e.g. [{\"name\":\"Alice\",\"age\":30}]. Nested objects are not supported for CSV output.",
  },
  {
    question: "Are quoted fields and commas inside values supported?",
    answer:
      "Yes. The CSV parser correctly handles RFC 4180 quoted fields, including values that contain commas, quotes, or newlines.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Files up to 20MB are supported. For very large files, consider splitting them first for faster processing.",
  },
];

export default function CsvJsonPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "CSV ↔ JSON Converter",
          description: "Convert CSV to JSON and JSON to CSV online for free.",
          slug: "csv-json-converter",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          { name: "CSV ↔ JSON Converter", url: `${SITE_URL}/tools/file-converter/csv-json-converter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "CSV ↔ JSON Converter" },
        ]}
        title="CSV ↔ JSON Converter – Free Online Tool"
        description="Convert CSV files to JSON arrays and JSON arrays back to CSV instantly in your browser. Upload a file or paste text — no server, no registration."
        howToSteps={[
          { title: "Choose Direction", description: "Select CSV → JSON or JSON → CSV using the toggle." },
          { title: "Upload or Paste", description: "Drop your file onto the uploader or paste text directly." },
          { title: "Download Result", description: "Preview the output and click Download to save the converted file." },
        ]}
        benefits={[
          { title: "100% Private", description: "All conversion happens in your browser — your data never leaves your device." },
          { title: "Bidirectional", description: "Switch between CSV→JSON and JSON→CSV with one click." },
          { title: "RFC 4180 Compliant", description: "Correctly handles quoted fields, embedded commas, and newlines." },
          { title: "No Registration", description: "Free to use immediately with no account required." },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
