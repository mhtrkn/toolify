import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ProtectPdfClient from "./ProtectPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Protect PDF",
  toolDescription:
    "Password-protect your PDF files online for free. Add user and owner passwords with AES encryption. No uploads — files are encrypted entirely in your browser.",
  categorySlug: "pdf-tools",
  toolSlug: "protect-pdf",
  keywords: [
    "password protect pdf online free",
    "encrypt pdf with password",
    "add password to pdf online",
    "pdf password protection free",
    "secure pdf online",
    "lock pdf with password free",
    "pdf encryption tool online",
    "protect pdf without adobe",
    "pdf password encryption free tool",
    "how to password protect a pdf online",
  ],
});

const FAQS = [
  {
    question: "What type of encryption is used?",
    answer:
      "AES encryption via jsPDF — compatible with Adobe Acrobat, Preview, Chrome, Edge, and all major PDF viewers.",
  },
  {
    question: "What is the difference between user and owner password?",
    answer:
      "The user password is required to open the PDF. The owner password controls editing, printing, and copying permissions.",
  },
  {
    question: "What restrictions are added to the PDF?",
    answer:
      "Viewers can open and read the PDF with the user password. Copying text, editing, and printing can be restricted via the owner password.",
  },
  {
    question: "Can I recover the password if I forget it?",
    answer:
      "No. The password is never stored anywhere (processing is entirely client-side). Keep your password safe — there is no recovery option.",
  },
  {
    question: "Is this compatible with all PDF readers?",
    answer:
      "Yes — standard AES-encrypted PDFs work in Adobe Reader, Preview, Chrome, Edge, and more.",
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
        title="Password Protect PDF Online – Encrypt PDF for Free"
        description="Lock your PDF with a password in seconds. Set user and owner passwords with AES encryption — all processed locally in your browser. No uploads."
        howToSteps={[
          { title: "Upload PDF", description: "Click or drag your PDF file into the upload area." },
          { title: "Set Passwords", description: "Enter a user password (to open) and optional owner password (to restrict editing)." },
          { title: "Encrypt & Download", description: "Click 'Protect PDF' and download your password-locked encrypted file." },
        ]}
        benefits={[
          { title: "AES Encryption", description: "Industry-standard AES encryption compatible with all major PDF readers." },
          { title: "User + Owner Password", description: "Set separate passwords for opening the PDF and for restricting editing." },
          { title: "No Uploads", description: "Encryption happens 100% in your browser. Files stay private on your device." },
          { title: "Instant Download", description: "Protected PDF is ready to download in seconds." },
        ]}
        faqs={FAQS}
      >
        <ProtectPdfClient />
      </ToolPageLayout>
    </>
  );
}
