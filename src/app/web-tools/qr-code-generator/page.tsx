import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import QrCodeGeneratorClient from "./QrCodeGeneratorClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "QR Code Generator",
  toolDescription:
    "Generate QR codes for URLs, WiFi networks, and vCards online for free. Customize size and color, then download instantly.",
  categorySlug: "web-tools",
  toolSlug: "qr-code-generator",
  keywords: [
    "qr code generator",
    "create qr code online",
    "free qr code maker",
    "wifi qr code generator",
    "vcard qr code",
    "custom qr code",
  ],
});

const FAQS = [
  {
    question: "What types of QR codes can I generate?",
    answer:
      "You can generate QR codes for URLs/links, WiFi networks (SSID + password + security type), and vCards (contact information).",
  },
  {
    question: "Can I customize the QR code colors?",
    answer:
      "Yes. You can change the foreground (dark) and background (light) colors using the color pickers, and adjust the QR code size.",
  },
  {
    question: "How do I download the QR code?",
    answer:
      "Click the 'Download QR Code' button to save the QR code as a PNG image file.",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. QR codes are generated entirely in your browser using the qrcode library. No data is sent to any server.",
  },
];

export default function QrCodeGeneratorPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "QR Code Generator",
          description: "Generate QR codes for URLs, WiFi, and vCards online.",
          slug: "qr-code-generator",
          categorySlug: "web-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Web Tools", url: `${SITE_URL}/web-tools` },
          { name: "QR Code Generator", url: `${SITE_URL}/web-tools/qr-code-generator` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Web Tools", href: "/web-tools" },
          { label: "QR Code Generator" },
        ]}
        title="QR Code Generator – Free Online QR Maker"
        description="Create QR codes for links, WiFi networks, and contact cards. Customize size and color, then download instantly."
        howToSteps={[
          { title: "Choose QR Type", description: "Select URL, WiFi, or vCard as your QR code type." },
          { title: "Enter Your Data", description: "Fill in the URL, WiFi credentials, or contact information." },
          { title: "Customize & Download", description: "Adjust size and colors, then click Download to save your QR code." },
        ]}
        benefits={[
          { title: "3 QR Types", description: "Generate QR codes for links, WiFi networks, and contact vCards." },
          { title: "Custom Colors", description: "Choose any foreground and background color for your QR code." },
          { title: "Instant Download", description: "Download your QR code as a high-quality PNG image." },
          { title: "100% Browser-Based", description: "QR codes are generated in your browser — no data sent to servers." },
        ]}
        faqs={FAQS}
      >
        <QrCodeGeneratorClient />
      </ToolPageLayout>
    </>
  );
}
