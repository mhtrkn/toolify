import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import HtmlToPdfClient from "./HtmlToPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "HTML to PDF Converter",
  toolDescription:
    "Convert HTML code to a PDF document online for free. Paste your HTML or URL, choose A4 or Letter size, and download your PDF instantly. No registration needed.",
  categorySlug: "web-tools",
  toolSlug: "html-to-pdf",
  keywords: [
    "html to pdf converter free",
    "convert html to pdf online",
    "webpage to pdf converter",
    "html code to pdf download",
    "html to pdf no software",
    "save html as pdf online",
    "url to pdf converter free",
    "web page to pdf online",
    "html to pdf a4 format",
    "convert html file to pdf free",
  ],
});

const FAQS = [
  {
    question: "Can I include CSS styles in my HTML?",
    answer:
      "Yes. Inline styles and `<style>` tags are fully supported. External stylesheets may not load due to browser security restrictions (CORS).",
  },
  {
    question: "What page sizes are supported?",
    answer: "You can choose A4 (210×297mm) or US Letter (216×279mm) page sizes.",
  },
  {
    question: "Is my HTML sent to a server?",
    answer:
      "No. The HTML is rendered in a sandboxed iframe in your browser and converted to PDF using html2canvas and jsPDF — no data leaves your device.",
  },
  {
    question: "What are the limitations?",
    answer:
      "External fonts, remote images, and cross-origin resources may not render due to browser security restrictions. Use inline styles and data URIs for best results.",
  },
];

export default function HtmlToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "HTML to PDF Converter",
          description: "Convert HTML code to PDF online.",
          slug: "html-to-pdf",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Web Tools", url: `${SITE_URL}/tools/web-tools` },
          { name: "HTML to PDF", url: `${SITE_URL}/tools/web-tools/html-to-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Web Tools", href: "/tools/web-tools" },
          { label: "HTML to PDF Converter" },
        ]}
        title="HTML to PDF Converter – Convert HTML Code to PDF Free"
        description="Paste your HTML, preview it live, choose A4 or Letter size, and download your PDF. Inline styles supported. No server — processed in your browser."
        howToSteps={[
          { title: "Paste HTML", description: "Enter or paste your HTML code into the editor on the left." },
          { title: "Preview", description: "See a live preview of your HTML rendered in the preview pane." },
          { title: "Download PDF", description: "Choose your page size and click 'Convert to PDF' to download." },
        ]}
        benefits={[
          { title: "Live Preview", description: "See your HTML rendered in real-time before converting." },
          { title: "Page Size Options", description: "Choose between A4 and US Letter page sizes." },
          { title: "Inline Styles", description: "Supports inline CSS styles and embedded <style> tags." },
          { title: "Browser-Based", description: "Uses html2canvas + jsPDF. No server required." },
        ]}
        faqs={FAQS}
      >
        <HtmlToPdfClient />
      </ToolPageLayout>
    </>
  );
}
