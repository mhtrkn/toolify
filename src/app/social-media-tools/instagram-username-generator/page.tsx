import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import InstagramUsernameGeneratorClient from "./InstagramUsernameGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Instagram Username Generator",
  toolDescription:
    "Generate 15 unique, creative Instagram username ideas based on your name and niche. Get handle suggestions that are brandable, memorable, and within Instagram's character limit.",
  categorySlug: "social-media-tools",
  toolSlug: "instagram-username-generator",
  keywords: [
    "instagram username generator free",
    "unique instagram username ideas",
    "instagram username creator online",
    "cool instagram usernames generator",
    "instagram handle generator",
    "creative username generator for instagram",
    "aesthetic instagram username generator",
    "instagram username ideas for brands",
    "available instagram username generator",
    "best instagram username generator 2025",
  ],
});

const FAQS = [
  {
    question: "What makes a good Instagram username?",
    answer:
      "A great username is short (under 20 chars), easy to spell, memorable, and reflects your brand or niche. Avoid excessive numbers or underscores.",
  },
  {
    question: "How do I check if an Instagram username is available?",
    answer:
      "Go to Instagram, tap 'Sign Up' or 'Edit Profile', and try entering the username. Instagram will tell you if it's taken. This tool generates suggestions — availability must be checked on Instagram.",
  },
  {
    question: "Can I use dots and underscores in an Instagram username?",
    answer:
      "Yes. Instagram usernames can contain letters (a-z), numbers (0-9), periods (.), and underscores (_). No spaces, hyphens, or special characters are allowed.",
  },
  {
    question: "What is the maximum length for an Instagram username?",
    answer:
      "Instagram usernames can be up to 30 characters long. Shorter usernames (under 15 chars) are generally better for branding and recall.",
  },
];

export default function InstagramUsernameGeneratorPage() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Instagram Username Generator", description: "Generate creative Instagram username ideas.", slug: "instagram-username-generator", categorySlug: "social-media-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Social Media Tools", url: `${SITE_URL}/social-media-tools` },
        { name: "Instagram Username Generator", url: `${SITE_URL}/social-media-tools/instagram-username-generator` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Social Media Tools", href: "/social-media-tools" },
          { label: "Instagram Username Generator" },
        ]}
        title="Instagram Username Generator – 15 Creative Handle Ideas Free"
        description="Enter your name and niche to get 15 brandable Instagram username suggestions. All within the 30-character limit and ready to try on Instagram."
        howToSteps={[
          { title: "Enter Your Name", description: "Type your real name, brand name, or nickname." },
          { title: "Add Your Niche", description: "Add your content niche (photography, fitness, cooking, etc.) for targeted suggestions." },
          { title: "Copy & Check", description: "Copy your favorite username and check availability on Instagram." },
        ]}
        benefits={[
          { title: "15 Unique Suggestions", description: "Get a variety of formats — prefix, suffix, compound, and creative variations." },
          { title: "Character Count", description: "Each username shows its length so you can stay under Instagram's 30-char limit." },
          { title: "Niche-Relevant", description: "Suggestions incorporate your niche keyword for a brandable, relevant handle." },
          { title: "Copy Instantly", description: "One-click copy for each username to quickly check on Instagram." },
        ]}
        faqs={FAQS}
      >
        <InstagramUsernameGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
