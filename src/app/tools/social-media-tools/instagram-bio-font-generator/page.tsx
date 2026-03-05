import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import InstagramBioFontClient from "./InstagramBioFontClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Instagram Bio Font Generator",
  toolDescription:
    "Generate stylish Unicode fonts for your Instagram bio — bold, italic, cursive, gothic, bubble, and 15+ more styles. Type your text, pick a style, and copy-paste directly into Instagram.",
  categorySlug: "social-media-tools",
  toolSlug: "instagram-bio-font-generator",
  keywords: [
    "instagram bio font generator",
    "cool fonts for instagram bio",
    "fancy text for instagram",
    "instagram bio font changer",
    "unicode font generator instagram",
    "stylish text for instagram bio",
    "instagram bio cursive font free",
    "instagram font maker online",
    "copy paste fonts for instagram",
    "fancy letters for instagram bio",
  ],
});

const FAQS = [
  {
    question: "How does the Instagram bio font generator work?",
    answer:
      "It converts your text into Unicode lookalike characters that look like different fonts. Instagram (and most apps) support Unicode, so these styled characters display correctly in bios and captions.",
  },
  {
    question: "Will these fonts work on Instagram?",
    answer:
      "Yes. Instagram supports Unicode characters in bios, captions, and comments. All 15+ styles in this tool display correctly on Instagram's iOS and Android apps.",
  },
  {
    question: "Can I use these fonts on other platforms?",
    answer:
      "Yes — these Unicode styles work on Twitter/X, TikTok, Facebook, LinkedIn, Discord, and most other platforms that support Unicode text.",
  },
  {
    question: "Why do some characters look like boxes or question marks?",
    answer:
      "This happens when a device's font doesn't include that Unicode character. Most modern devices and browsers support the full Unicode range used here.",
  },
  {
    question: "Are these real fonts?",
    answer:
      "No — they're Unicode characters from the Mathematical Alphanumeric Symbols block that look like styled letters. They're text, not font files, which is why they work anywhere.",
  },
];

export default function InstagramBioFontPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Instagram Bio Font Generator", description: "Generate stylish Unicode fonts for Instagram bio.", slug: "instagram-bio-font-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "Instagram Bio Font Generator", url: `${SITE_URL}/tools/social-media-tools/instagram-bio-font-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "Instagram Bio Font Generator" },
        ]}
        title="Instagram Bio Font Generator – 15+ Stylish Fonts Free"
        description="Transform your Instagram bio text into bold, cursive, gothic, bubble, and 15+ Unicode font styles. Type once, copy the style you love directly into Instagram."
        howToSteps={[
          { title: "Type Your Text", description: "Enter the text you want to style — your name, tagline, or bio line." },
          { title: "Browse Styles", description: "All 15+ font styles update live as you type. Scroll through to compare." },
          { title: "Copy & Paste", description: "Click Copy on your favorite style and paste it directly into your Instagram bio." },
        ]}
        benefits={[
          { title: "15+ Font Styles", description: "Bold, italic, cursive, gothic, double-struck, monospace, bubble, small caps, and more." },
          { title: "Live Preview", description: "See all styles update in real time as you type — no clicking Generate." },
          { title: "Works on Instagram", description: "All styles use standard Unicode that displays correctly on Instagram's apps." },
          { title: "Copy Each Style", description: "Copy individual styles with one click — no need to select text manually." },
        ]}
        faqs={FAQS}
      >
        <InstagramBioFontClient />
      </ToolPageLayout>
    </>
  );
}
