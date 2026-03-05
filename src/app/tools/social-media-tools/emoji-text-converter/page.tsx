import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import EmojiTextConverterClient from "./EmojiTextConverterClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Emoji Text Converter",
  toolDescription:
    "Add emojis to your text automatically. Choose Decorate mode to sprinkle emojis after keywords, or Replace mode to swap words with matching emoji symbols. Free, instant, no signup.",
  categorySlug: "social-media-tools",
  toolSlug: "emoji-text-converter",
  keywords: [
    "emoji text converter online free",
    "add emojis to text automatically",
    "text to emoji converter",
    "emoji generator for text",
    "convert words to emojis",
    "emoji text generator copy paste",
    "emoji message generator",
    "text with emojis generator",
    "auto emoji text tool",
    "emoji keyboard for social media",
  ],
});

const FAQS = [
  {
    question: "How does the emoji text converter work?",
    answer:
      "It scans your text for keywords with known emoji equivalents (like 'love', 'fire', 'music', 'star') and either adds emojis after those words (Decorate mode) or replaces the words with emojis (Replace mode).",
  },
  {
    question: "What's the difference between Decorate and Replace mode?",
    answer:
      "Decorate keeps your text intact and adds matching emojis after recognized keywords. Replace mode substitutes the recognized words entirely with their emoji equivalents.",
  },
  {
    question: "Can I use the output on Instagram or Twitter?",
    answer:
      "Yes. Emoji characters are universally supported across all social media platforms, messaging apps, and email.",
  },
  {
    question: "How many words have emoji mappings?",
    answer:
      "The tool recognizes 80+ common English words and maps them to relevant emojis — including emotions, objects, nature, sports, technology, and more.",
  },
];

export default function EmojiTextConverterPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Emoji Text Converter", description: "Add emojis to text automatically.", slug: "emoji-text-converter", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        { name: "Social Media Tools", url: `${SITE_URL}/tools/social-media-tools` },
        { name: "Emoji Text Converter", url: `${SITE_URL}/tools/social-media-tools/emoji-text-converter` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Social Media Tools", href: "/tools/social-media-tools" },
          { label: "Emoji Text Converter" },
        ]}
        title="Emoji Text Converter – Add Emojis to Text Automatically Free"
        description="Paste your text and automatically add relevant emojis. Decorate mode adds emojis after keywords; Replace mode swaps words with emoji symbols. Perfect for social media posts."
        howToSteps={[
          { title: "Type or Paste Your Text", description: "Enter your message, caption, or post content in the text box." },
          { title: "Choose a Mode", description: "Select Decorate (emojis added) or Replace (words become emojis)." },
          { title: "Copy Result", description: "Click Convert, review the emoji-enhanced text, and copy it." },
        ]}
        benefits={[
          { title: "80+ Keyword Mappings", description: "Recognizes emotions, objects, activities, nature, and more." },
          { title: "2 Conversion Modes", description: "Decorate adds emojis alongside text; Replace swaps words entirely." },
          { title: "Live Preview", description: "See the converted text update as you type." },
          { title: "One-Click Copy", description: "Copy the emoji-enhanced text instantly to paste anywhere." },
        ]}
        faqs={FAQS}
      >
        <EmojiTextConverterClient />
      </ToolPageLayout>
    </>
  );
}
