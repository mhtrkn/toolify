import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ProtectPdfClient from "./ProtectPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Protect PDF",
  toolDescription:
    "Add password protection to your PDF files online for free. Encrypt and lock PDFs with a secure password — no software needed.",
  categorySlug: "pdf-tools",
  toolSlug: "protect-pdf",
  keywords: [
    "protect pdf",
    "password protect pdf online",
    "encrypt pdf free",
    "lock pdf with password",
    "secure pdf online",
  ],
});

const FAQS = [
  {
    question: "What type of encryption is used?",
    answer:
      "pdf-lib applies RC4 128-bit encryption, which is compatible with all major PDF viewers including Adobe Acrobat, Preview, and browser-based readers.",
  },
  {
    question: "What restrictions are added to the PDF?",
    answer:
      "Viewers can open and read the PDF with the password, and fill in forms. Copying text, editing content, and low-resolution printing are disabled.",
  },
  {
    question: "Can I recover the password if I forget it?",
    answer:
      "No. The password is never stored on our servers (processing is entirely client-side). Keep your password safe — there is no recovery option.",
  },
  {
    question: "Will the file content change?",
    answer:
      "No. Only security settings are added. The text, images, and layout of your PDF remain exactly the same.",
  },
];

export default function ProtectPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Protect PDF",
          description: "Add password protection to PDF files online.",
          slug: "protect-pdf",
          categorySlug: "pdf-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools", url: `${SITE_URL}/pdf-tools` },
          { name: "Protect PDF", url: `${SITE_URL}/pdf-tools/protect-pdf` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Protect PDF" },
        ]}
        title="Protect PDF – Add Password to PDF Online Free"
        description="Lock your PDF with a password in seconds. Upload your file, set a password, and download a fully encrypted PDF — all in your browser."
        howToSteps={[
          { title: "Upload PDF", description: "Click or drag your PDF file into the upload area." },
          { title: "Set a Password", description: "Enter and confirm your password. Minimum 4 characters." },
          { title: "Download Protected PDF", description: "Click 'Protect PDF' and download your encrypted file." },
        ]}
        benefits={[
          { title: "Client-Side Encryption", description: "Your file is encrypted locally — it never touches our servers." },
          { title: "Universal Compatibility", description: "Protected PDFs open in Acrobat, Preview, and all major viewers." },
          { title: "Instant & Free", description: "No account, no payment — protect any PDF in seconds." },
          { title: "Content Preserved", description: "Encryption only adds security — your PDF content is unchanged." },
        ]}
        faqs={FAQS}
      >
        <ProtectPdfClient />
      </ToolPageLayout>
    </>
  );
}
