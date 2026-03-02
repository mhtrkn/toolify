import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import JsonCsvEditorClient from "./JsonCsvEditorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JSON / CSV Editor",
  toolDescription:
    "Preview, edit, and export JSON and CSV files online. Drag & drop files, edit values inline, and download the updated file.",
  categorySlug: "web-tools",
  toolSlug: "json-csv-editor",
  keywords: [
    "json editor online",
    "csv editor online",
    "json viewer",
    "csv viewer",
    "edit json file online",
    "edit csv online",
    "json formatter",
  ],
});

const FAQS = [
  {
    question: "What file types are supported?",
    answer: "The editor supports .json and .csv file formats. You can also paste raw JSON or CSV text directly.",
  },
  {
    question: "Can I edit data inline?",
    answer:
      "Yes. JSON values and CSV cell values are editable directly in the table/tree view. Changes are reflected in the export.",
  },
  {
    question: "Is my file data secure?",
    answer:
      "All processing happens in your browser. Your files are never uploaded to any server.",
  },
  {
    question: "What is the maximum file size?",
    answer:
      "The editor works well for files up to ~5MB. Very large files may be slow to render in the browser.",
  },
];

export default function JsonCsvEditorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JSON / CSV Editor",
          description: "Preview, edit, and export JSON and CSV files online.",
          slug: "json-csv-editor",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Web Tools", url: `${SITE_URL}/web-tools` },
          { name: "JSON / CSV Editor", url: `${SITE_URL}/web-tools/json-csv-editor` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Web Tools", href: "/web-tools" },
          { label: "JSON / CSV Editor" },
        ]}
        title="JSON / CSV Preview & Editor – Free Online Tool"
        description="Drag & drop or paste your JSON / CSV data. Edit values inline and export back to file instantly."
        howToSteps={[
          { title: "Load Data", description: "Drag & drop a .json or .csv file, or paste text directly into the editor." },
          { title: "Edit Inline", description: "Click any value to edit it in place. Switch between JSON and CSV views." },
          { title: "Export File", description: "Download the updated file as JSON or CSV with one click." },
        ]}
        benefits={[
          { title: "Drag & Drop", description: "Drop JSON or CSV files directly onto the editor area." },
          { title: "Inline Editing", description: "Click any cell or value to edit it directly — no extra steps." },
          { title: "Instant Export", description: "Download your edited data as a formatted JSON or CSV file." },
          { title: "100% Private", description: "All processing happens in your browser. Files are never uploaded." },
        ]}
        faqs={FAQS}
      >
        <JsonCsvEditorClient />
      </ToolPageLayout>
    </>
  );
}
