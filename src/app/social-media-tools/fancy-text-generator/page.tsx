import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import FancyTextGeneratorClient from "./FancyTextGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Fancy Text Generator",
  toolDescription:
    "Convert plain text to 15+ Unicode font styles — bold, italic, cursive, gothic, double-struck, monospace, bubble, small caps, strikethrough, and upside down. Copy with one click.",
  categorySlug: "social-media-tools",
  toolSlug: "fancy-text-generator",
  keywords: [
    "fancy text generator free",
    "unicode font generator online",
    "cool text generator copy paste",
    "stylish text generator for social media",
    "bold text generator online",
    "cursive text generator free",
    "gothic font text generator",
    "fancy letters for facebook",
    "fancy text for twitter bio",
    "unicode text style converter",
  ],
});

const FAQS = [
  {
    question: "What is a Fancy Text Generator?",
    answer:
      "It converts regular letters into Unicode lookalike characters that appear as different font styles — bold, italic, cursive, and more — in any app that supports Unicode text.",
  },
  {
    question: "Where can I use fancy text?",
    answer:
      "Anywhere that supports Unicode: Instagram, Twitter/X, Facebook, TikTok, Discord, WhatsApp, Telegram, LinkedIn, email subjects, and more.",
  },
  {
    question: "Does it work in Instagram bios?",
    answer:
      "Yes. Instagram fully supports Unicode characters in bios, captions, and comments. All 15 styles work on both iOS and Android Instagram apps.",
  },
  {
    question: "Why doesn't every letter have a fancy version?",
    answer:
      "The Unicode standard's Mathematical Alphanumeric Symbols block covers A–Z and a–z, but a few positions are occupied by existing symbols (like ℬ, ℰ). Those use the nearest Unicode equivalent.",
  },
  {
    question: "Can I use fancy text in Google Docs or Word?",
    answer:
      "Yes — you can paste Unicode text anywhere that supports it, including Google Docs, Word, Notion, and Slack.",
  },
];

export default function FancyTextGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Fancy Text Generator", description: "Convert text to 15+ Unicode font styles.", slug: "fancy-text-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Social Media Tools", url: `${SITE_URL}/social-media-tools` },
        { name: "Fancy Text Generator", url: `${SITE_URL}/social-media-tools/fancy-text-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Social Media Tools", href: "/social-media-tools" },
          { label: "Fancy Text Generator" },
        ]}
        title="Fancy Text Generator – 15+ Unicode Font Styles Free"
        description="Type your text and instantly see it in 15+ font styles — 𝗯𝗼𝗹𝗱, 𝘪𝘵𝘢𝘭𝘪𝘤, 𝓬𝓾𝓻𝓼𝓲𝓿𝓮, 𝔤𝔬𝔱𝔥𝔦𝔠, Ⓑⓤⓑⓑⓛⓔ, ᴀɴᴅ ᴍᴏʀᴇ. Copy any style with one click."
        howToSteps={[
          { title: "Type Your Text", description: "Enter any text — name, quote, phrase, or message." },
          { title: "Browse All Styles", description: "See all 15+ styles update live as you type." },
          { title: "Copy & Use", description: "Click Copy next to any style and paste it into any social media platform." },
        ]}
        benefits={[
          { title: "15+ Font Styles", description: "Bold, italic, bold italic, script, fraktur, double-struck, monospace, bubble, small caps, strikethrough, upside-down, and more." },
          { title: "Live Preview", description: "All styles update instantly as you type — no Generate button needed." },
          { title: "Works Everywhere", description: "Instagram, Twitter, Facebook, TikTok, Discord, WhatsApp, LinkedIn, and more." },
          { title: "One-Click Copy", description: "Copy any individual style or all styles at once." },
        ]}
        faqs={FAQS}
      >
        <FancyTextGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
