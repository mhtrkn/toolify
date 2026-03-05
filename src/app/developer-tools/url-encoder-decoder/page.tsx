import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import UrlEncoderDecoderClient from "./UrlEncoderDecoderClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "URL Encoder / Decoder",
  toolDescription:
    "Encode or decode URLs and query strings online. Supports component encoding, full URL encoding, and query string mode. Instant, browser-based, no signup required.",
  categorySlug: "developer-tools",
  toolSlug: "url-encoder-decoder",
  keywords: [
    "url encoder decoder online free",
    "encode url online",
    "decode url online free",
    "percent encoding tool",
    "url encode special characters",
    "query string encoder online",
    "uri encoder decoder browser",
    "url escape unescape tool",
    "encode decode url component",
    "url encoding reference",
  ],
});

const FAQS = [
  {
    question: "What is the difference between Component and Full URL encoding?",
    answer:
      "Component encoding (encodeURIComponent) encodes all special characters including / : ? # — use it for individual values in query strings. Full URL encoding (encodeURI) preserves the URL structure characters so the URL remains functional.",
  },
  {
    question: "What is Query String mode?",
    answer:
      "Query String mode encodes each key and value in a key=value&key=value string individually while preserving the & and = separators.",
  },
  {
    question: "Is my URL data sent to a server?",
    answer: "No. All encoding and decoding uses your browser's built-in encodeURIComponent and decodeURIComponent functions.",
  },
  {
    question: "What does percent encoding mean?",
    answer:
      "Percent encoding (also called URL encoding) replaces reserved or non-ASCII characters with a % followed by two hexadecimal digits — for example, a space becomes %20.",
  },
  {
    question: "Can I flip direction?",
    answer:
      "Yes. Use the ⇄ Swap & Flip button to move the output to the input and automatically flip the direction between encode and decode.",
  },
];

export default function UrlEncoderDecoderPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "URL Encoder / Decoder",
          description: "Free online URL encoder and decoder — component, full URL, and query string modes.",
          slug: "url-encoder-decoder",
          categorySlug: "developer-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Developer Tools", url: `${SITE_URL}/developer-tools` },
          { name: "URL Encoder / Decoder", url: `${SITE_URL}/developer-tools/url-encoder-decoder` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Developer Tools", href: "/developer-tools" },
          { label: "URL Encoder / Decoder" },
        ]}
        title="URL Encoder / Decoder – Free Online Percent-Encoding Tool"
        description="Encode or decode URLs and query strings with three encoding modes: component, full URL, and query string. Instant, client-side, with character reference."
        howToSteps={[
          {
            title: "Choose direction & mode",
            description: "Select Encode or Decode, then pick the encoding type that fits your use case.",
          },
          {
            title: "Paste your URL or text",
            description: "Enter the URL or text you want to process. Load an example for a quick demo.",
          },
          {
            title: "Copy the result",
            description: "Click Encode/Decode, then copy the result or use Swap & Flip for the reverse operation.",
          },
        ]}
        benefits={[
          {
            title: "Three encoding modes",
            description: "Component, Full URL, and Query String — covers every common URL encoding scenario.",
          },
          {
            title: "Swap & Flip",
            description: "Instantly reverse the operation: output becomes input with flipped direction.",
          },
          {
            title: "Character reference",
            description: "Built-in chart of the most common percent-encoded characters.",
          },
          {
            title: "100% browser-based",
            description: "No server calls. Uses native browser encoding functions.",
          },
        ]}
        faqs={FAQS}
      >
        <UrlEncoderDecoderClient />
      </ToolPageLayout>
    </>
  );
}
