import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import TxtDocxClient from "./TxtDocxClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "TXT ↔ DOCX Converter",
  toolDescription:
    "Convert plain text .txt files to Word .docx documents and extract plain text from DOCX files online for free. 100% client-side, no uploads.",
  categorySlug: "file-converter",
  toolSlug: "txt-docx-converter",
  keywords: [
    "txt to docx converter",
    "docx to txt converter",
    "convert text to word online free",
    "txt to word converter",
    "word to text extractor free",
    "txt to docx no software",
    "plain text to word document",
    "docx to plain text online",
    "convert txt to word free",
    "text file to word document",
  ],
});

const FAQS = [
  {
    question: "Does TXT to DOCX preserve line breaks and paragraphs?",
    answer:
      "Yes. Each line in the text file becomes a Word paragraph. Blank lines generate empty paragraphs to preserve spacing.",
  },
  {
    question: "Does DOCX to TXT preserve formatting like bold and tables?",
    answer:
      "The DOCX → TXT converter extracts raw text content only. Formatting like bold, italic, colors, and tables are removed. If you need rich formatting, use our Word to PDF tool instead.",
  },
  {
    question: "Is my file uploaded to a server?",
    answer:
      "No. TXT → DOCX is generated in-browser using JSZip. DOCX → TXT uses Mammoth.js locally. Your file never leaves your device.",
  },
  {
    question: "Can I convert .doc files as well?",
    answer:
      "The DOCX → TXT mode supports .docx files reliably. Legacy .doc files may work but results can vary.",
  },
];

export default function TxtDocxPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "TXT ↔ DOCX Converter",
          description: "Convert TXT to DOCX and DOCX to TXT online for free.",
          slug: "txt-docx-converter",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          { name: "TXT ↔ DOCX Converter", url: `${SITE_URL}/tools/file-converter/txt-docx-converter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "TXT ↔ DOCX Converter" },
        ]}
        title="TXT ↔ DOCX Converter – Free Online Tool"
        description="Convert plain text files to Word documents and extract text from DOCX files instantly in your browser. No Microsoft Word, no server uploads, no registration required."
        howToSteps={[
          { title: "Choose Direction", description: "Select TXT → DOCX to create a Word file, or DOCX → TXT to extract plain text." },
          { title: "Upload Your File", description: "Drop a .txt or .docx file onto the upload area." },
          { title: "Download Result", description: "Click Convert then download your converted file." },
        ]}
        benefits={[
          { title: "No Word Required", description: "Create and open Word documents without Microsoft Office installed." },
          { title: "100% Private", description: "All conversion runs in your browser — no file is ever sent to a server." },
          { title: "Paragraph Preservation", description: "Line breaks from your text file become proper Word paragraphs." },
          { title: "No Registration", description: "Free to use immediately with no account required." },
        ]}
        faqs={FAQS}
      >
        <TxtDocxClient />
      </ToolPageLayout>
    </>
  );
}
