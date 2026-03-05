import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ColorPaletteClient from "./ColorPaletteClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Color Palette Generator",
  toolDescription:
    "Generate color palettes from any hex color free online. Get complementary, analogous, and triadic color schemes with HEX, RGB, and HSB codes — copy with one click.",
  categorySlug: "web-tools",
  toolSlug: "color-palette",
  keywords: [
    "color palette generator free",
    "complementary color finder online",
    "hex color palette",
    "analogous color scheme generator",
    "triadic color palette tool",
    "color scheme generator from hex",
    "brand color palette generator",
    "rgb color palette maker",
    "color combination generator online",
    "color harmony tool free",
  ],
});

const FAQS = [
  {
    question: "What color harmonies are shown?",
    answer:
      "We show complementary (opposite on the color wheel), analogous (adjacent colors, ±30°), and triadic (evenly spaced at 120°) color palettes.",
  },
  {
    question: "What is a complementary color?",
    answer:
      "A complementary color sits directly opposite on the color wheel — it creates high contrast and visual impact.",
  },
  {
    question: "What are analogous colors?",
    answer:
      "Colors adjacent on the wheel — they create harmonious, soothing palettes ideal for UI and brand design.",
  },
  {
    question: "How do I copy a color code?",
    answer:
      "Click on any color swatch to copy its hex code to your clipboard instantly.",
  },
  {
    question: "What formats are shown for each color?",
    answer:
      "Each color displays its HEX, RGB, and HSB (hue, saturation, brightness) values.",
  },
  {
    question: "Can I use this for brand colors?",
    answer:
      "Yes — enter your brand's primary hex color and get a complete matching palette for design systems, CSS, and Figma.",
  },
];

export default function ColorPalettePage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Color Palette Generator",
          description: "Generate color palettes from any hex color.",
          slug: "color-palette",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Web Tools", url: `${SITE_URL}/tools/web-tools` },
          { name: "Color Palette Generator", url: `${SITE_URL}/tools/web-tools/color-palette` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Web Tools", href: "/tools/web-tools" },
          { label: "Color Palette Generator" },
        ]}
        title="Color Palette Generator – Create Color Schemes from Any Hex Color"
        description="Enter any hex color and instantly get complementary, analogous, and triadic palettes with HEX, RGB, and HSB codes. One-click copy — free, no signup."
        howToSteps={[
          { title: "Pick a Color", description: "Enter a hex code or use the color picker to choose your base color." },
          { title: "Explore Palettes", description: "See complementary, analogous, and triadic color harmonies generated instantly." },
          { title: "Copy Color Codes", description: "Click any swatch to copy its HEX code to your clipboard." },
        ]}
        benefits={[
          { title: "Multiple Harmonies", description: "Complementary, analogous, triadic — all generated from one base color." },
          { title: "Instant Conversion", description: "See HEX, RGB, and HSB values for every color in the palette." },
          { title: "One-Click Copy", description: "Click any swatch to copy the hex code to your clipboard instantly." },
          { title: "No Registration", description: "Free to use with no account required." },
        ]}
        faqs={FAQS}
      >
        <ColorPaletteClient />
      </ToolPageLayout>
    </>
  );
}
