import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import UrlShortenerClient from "./UrlShortenerClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "URL Shortener",
  toolDescription:
    "Shorten long URLs into compact, shareable links for free. Powered by TinyURL — links never expire. No account needed. Generate your short link in seconds.",
  categorySlug: "web-tools",
  toolSlug: "url-shortener",
  keywords: [
    "url shortener free online",
    "shorten link free",
    "free short url generator",
    "url shortener no signup",
    "link shortener for social media",
    "tinyurl alternative free",
    "short url creator online",
    "compact url generator",
    "url shortener no expiry",
    "best free url shortener 2025",
  ],
});

const FAQS = [
  {
    question: "How does the URL shortener work?",
    answer:
      "Enter your long URL and click 'Shorten'. We send it to the TinyURL API via a server-side proxy and return the short link. The short link redirects to your original URL.",
  },
  {
    question: "Do the short links expire?",
    answer:
      "No — short links generated via TinyURL do not expire and remain active indefinitely.",
  },
  {
    question: "Can I customize the short link?",
    answer:
      "Custom aliases are not available in this tool. Use TinyURL.com directly for custom slug support.",
  },
  {
    question: "Is there a limit on how many URLs I can shorten?",
    answer:
      "There is no hard limit for personal use. Please use the tool responsibly.",
  },
  {
    question: "Can I track click statistics?",
    answer:
      "This tool generates basic short links without analytics. For click tracking, consider a dedicated service like Bitly.",
  },
  {
    question: "Can I combine this with a QR code?",
    answer:
      "Yes! Shorten your URL here, then use our free QR Code Generator to create a compact, scannable QR code for the short link.",
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
        title="Free URL Shortener – Create Short Links Instantly"
        description="Turn long URLs into short, shareable links in one click. Powered by TinyURL — links never expire. Free, fast, and no account required."
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
