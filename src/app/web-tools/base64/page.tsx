import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import Base64Client from "./Base64Client";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Base64 Encoder / Decoder",
  toolDescription:
    "Encode and decode text or files to Base64 format online for free. Supports strings, images, and binary files. Instant results — no registration, no uploads needed.",
  categorySlug: "web-tools",
  toolSlug: "base64",
  keywords: [
    "base64 encoder online free",
    "base64 decoder online",
    "encode text to base64",
    "decode base64 string online",
    "base64 file encoder free",
    "base64 image encoder",
    "convert base64 to text",
    "base64 encode decode tool",
    "online base64 converter",
    "base64 encode file browser",
  ],
});

const FAQS = [
  {
    question: "What is Base64 encoding?",
    answer:
      "Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters. It is commonly used to encode data in URLs, emails, and data URIs.",
  },
  {
    question: "Can I encode files with Base64?",
    answer:
      "Yes. Upload any file to get its Base64 string. You can also decode a Base64 string back to its original binary file.",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. All encoding and decoding happens entirely in your browser using the native btoa/atob functions and FileReader API.",
  },
  {
    question: "What is the maximum file size for encoding?",
    answer:
      "There is no hard limit, but very large files may cause the browser to slow down. Files under 10MB work best.",
  },
];

export default function Base64Page() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Base64 Encoder / Decoder",
          description: "Encode and decode Base64 strings and files online.",
          slug: "base64",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Web Tools", url: `${SITE_URL}/web-tools` },
          { name: "Base64 Encoder / Decoder", url: `${SITE_URL}/web-tools/base64` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Web Tools", href: "/web-tools" },
          { label: "Base64 Encoder / Decoder" },
        ]}
        title="Base64 Encoder & Decoder – Encode Files and Text Online Free"
        description="Encode text or files to Base64 and decode Base64 strings back to text or files. Supports images and binary files — instant results, no uploads needed."
        howToSteps={[
          { title: "Choose Mode", description: "Select Encode or Decode, then pick Text or File input." },
          { title: "Enter Input", description: "Type or paste text, or upload a file to encode/decode." },
          { title: "Copy or Download", description: "Copy the result to clipboard or download as a file." },
        ]}
        benefits={[
          { title: "Text & File Support", description: "Encode/decode both plain text strings and binary files." },
          { title: "Instant Results", description: "See the Base64 output as you type — no button needed." },
          { title: "Copy to Clipboard", description: "One-click copy for the encoded/decoded result." },
          { title: "100% Browser-Based", description: "Uses native browser APIs — nothing is sent to any server." },
        ]}
        faqs={FAQS}
      >
        <Base64Client />
      </ToolPageLayout>
    </>
  );
}
