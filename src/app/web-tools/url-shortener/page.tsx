import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import UrlShortenerClient from "./UrlShortenerClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "URL Shortener",
  toolDescription:
    "Shorten long URLs into compact, shareable short links for free. Generate short URLs instantly — no account needed.",
  categorySlug: "web-tools",
  toolSlug: "url-shortener",
  keywords: [
    "url shortener",
    "shorten url online",
    "free link shortener",
    "short url generator",
    "tinyurl alternative",
    "link shortener free",
  ],
});

const FAQS = [
  {
    question: "How does the URL shortener work?",
    answer:
      "Enter your long URL and click 'Shorten'. We generate a short link via the TinyURL service. The short link redirects to your original URL.",
  },
  {
    question: "Do the short links expire?",
    answer:
      "Short links generated via TinyURL do not expire — they remain active indefinitely.",
  },
  {
    question: "Is there a limit on how many URLs I can shorten?",
    answer:
      "There is no hard limit for personal use. Please use the tool responsibly.",
  },
  {
    question: "Can I track click statistics?",
    answer:
      "This tool generates basic short links without analytics. For click tracking, consider using a dedicated service like Bitly.",
  },
];

export default function UrlShortenerPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "URL Shortener",
          description: "Shorten long URLs into compact shareable links for free.",
          slug: "url-shortener",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Web Tools", url: `${SITE_URL}/web-tools` },
          { name: "URL Shortener", url: `${SITE_URL}/web-tools/url-shortener` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Web Tools", href: "/web-tools" },
          { label: "URL Shortener" },
        ]}
        title="URL Shortener – Free Short Link Generator"
        description="Turn long URLs into short, shareable links instantly. Free, fast, and no account required."
        howToSteps={[
          { title: "Paste URL", description: "Enter or paste your long URL into the input field." },
          { title: "Click Shorten", description: "Press the 'Shorten URL' button to generate a short link." },
          { title: "Copy & Share", description: "Copy your short link and share it anywhere." },
        ]}
        benefits={[
          { title: "Instant Results", description: "Short links are generated in seconds." },
          { title: "No Expiry", description: "Generated short links remain active indefinitely." },
          { title: "No Account Needed", description: "Use the tool freely without creating an account." },
          { title: "QR Code Ready", description: "Short URLs are ideal for QR codes — use our QR generator next!" },
        ]}
        faqs={FAQS}
      >
        <UrlShortenerClient />
      </ToolPageLayout>
    </>
  );
}
