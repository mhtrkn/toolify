import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import BarcodeQrClient from "./BarcodeQrClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Barcode & QR Code Scanner",
  toolDescription:
    "Scan QR codes and barcodes from images or live webcam for free. Supports QR, Code128, EAN-13, UPC, DataMatrix, PDF417 and more. Also generate custom QR codes for URLs, WiFi, vCards, and email — no app needed.",
  categorySlug: "ocr-tools",
  toolSlug: "barcode-qr-scanner",
  keywords: [
    "qr code scanner online free",
    "barcode scanner from image upload",
    "webcam barcode scanner browser",
    "ean-13 barcode reader online",
    "code128 scanner free",
    "qr code generator wifi vcard",
    "custom qr code color size",
    "scan qr code from image",
    "qr barcode tool no app",
    "online qr scanner no signup",
  ],
});

const FAQS = [
  {
    question: "Which barcode formats are supported for scanning?",
    answer:
      "QR Code, Code128, Code39, EAN-13, EAN-8, UPC-A, UPC-E, DataMatrix, PDF417, Aztec, Codabar, and more — powered by the ZXing library.",
  },
  {
    question: "Can I scan barcodes using my webcam?",
    answer:
      "Yes. Switch to the 'Webcam Scanner' tab, allow camera access, and point your camera at any barcode or QR code for instant detection.",
  },
  {
    question: "What types of QR codes can I generate?",
    answer:
      "URL, plain text, WiFi network credentials, vCard contact information, and email (with pre-filled subject and body).",
  },
  {
    question: "Can I customize the QR code appearance?",
    answer:
      "Yes — choose foreground and background colors, set output size (100–1000px), and select error correction level (L/M/Q/H).",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. All scanning and generation happens entirely in your browser. Your images and QR data never leave your device.",
  },
  {
    question: "What image formats work for scanning?",
    answer:
      "JPG, PNG, WEBP, and BMP. For best results use a clear, high-contrast image with good lighting.",
  },
];

export default function BarcodeQrScannerPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Barcode & QR Code Scanner",
          description:
            "Scan QR codes and barcodes from images or webcam. Generate custom QR codes for URLs, WiFi, vCards and email.",
          slug: "barcode-qr-scanner",
          categorySlug: "ocr-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "OCR Tools", url: `${SITE_URL}/ocr-tools` },
          {
            name: "Barcode & QR Scanner",
            url: `${SITE_URL}/ocr-tools/barcode-qr-scanner`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "OCR Tools", href: "/ocr-tools" },
          { label: "Barcode & QR Scanner" },
        ]}
        title="Barcode & QR Code Scanner — Scan & Generate Free"
        description="Instantly scan QR codes and barcodes from uploaded images or your live webcam. Supports 10+ formats including Code128, EAN-13, and DataMatrix. Also generate fully customized QR codes for URLs, WiFi, vCards, and more — all in your browser."
        howToSteps={[
          {
            title: "Choose Mode",
            description:
              "Select 'Scan from Image', 'Webcam Scanner', or 'Generate QR' from the tab bar.",
          },
          {
            title: "Scan or Configure",
            description:
              "Upload an image or start the webcam to decode. For generation, fill in your QR data and pick colors.",
          },
          {
            title: "Copy or Download",
            description:
              "Copy decoded text to clipboard, follow links directly, or download your generated QR as a PNG.",
          },
        ]}
        benefits={[
          {
            title: "10+ Barcode Formats",
            description:
              "Reads QR, Code128, EAN-13, UPC, DataMatrix, PDF417, Aztec, Codabar and more via ZXing.",
          },
          {
            title: "Live Webcam Scanning",
            description:
              "Continuous webcam scanning with real-time detection — no app or installation needed.",
          },
          {
            title: "5 QR Types",
            description:
              "Generate QR codes for URL, Text, WiFi credentials, vCard contact, and Email.",
          },
          {
            title: "Full Customization",
            description:
              "Pick colors, set output size up to 1000px, and choose error correction level.",
          },
          {
            title: "100% Private",
            description:
              "Everything runs in your browser. No data is sent to any server.",
          },
        ]}
        faqs={FAQS}
      >
        <BarcodeQrClient />
      </ToolPageLayout>
    </>
  );
}
