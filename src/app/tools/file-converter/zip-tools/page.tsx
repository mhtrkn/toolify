import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "ZIP Tools",
  toolDescription:
    "Create ZIP archives from multiple files and extract ZIP files online for free. 100% client-side — your files never leave your browser.",
  categorySlug: "file-converter",
  toolSlug: "zip-tools",
  keywords: [
    "zip creator online free",
    "extract zip file online",
    "create zip archive browser",
    "zip extractor online no software",
    "online zip creator free",
    "zip file creator tool",
    "extract zip no upload",
    "make zip file online",
    "zip files together free",
    "online zip extractor free",
  ],
});

const FAQS = [
  {
    question: "How do I create a ZIP file?",
    answer:
      "Switch to 'Create ZIP' mode, drag and drop the files you want to compress, then click 'Create ZIP'. Your archive downloads instantly.",
  },
  {
    question: "What ZIP formats can be extracted?",
    answer:
      "Standard .zip archives are supported. Password-protected ZIP files and other formats (RAR, 7z) are not supported in the browser and require desktop software.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "You can add files up to 50MB total. For larger archives, consider using a desktop archiver like 7-Zip or WinRAR.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. All ZIP creation and extraction happens entirely in your browser using JSZip. Your files never leave your device.",
  },
];

export default function ZipToolsPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "ZIP Tools – Create & Extract ZIP Files",
          description: "Create and extract ZIP archives online for free.",
          slug: "zip-tools",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          { name: "ZIP Tools", url: `${SITE_URL}/tools/file-converter/zip-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "ZIP Tools" },
        ]}
        title="ZIP Tools – Create & Extract ZIP Files Free"
        description="Create ZIP archives from any files or extract the contents of a ZIP file — all in your browser. No software to install, no server uploads, no registration."
        howToSteps={[
          { title: "Choose Mode", description: "Select 'Create ZIP' to build an archive or 'Extract ZIP' to unpack one." },
          { title: "Add Files", description: "For creation: drop any files. For extraction: upload a .zip file." },
          { title: "Download", description: "Download the ZIP archive or individual extracted files." },
        ]}
        benefits={[
          { title: "100% Private", description: "All ZIP processing happens in your browser — no files are ever uploaded to a server." },
          { title: "Create or Extract", description: "Two modes in one tool — bundle files into a ZIP or unpack an existing archive." },
          { title: "Download Individually", description: "When extracting, download files one at a time or get all as a new ZIP." },
          { title: "No Registration", description: "Free to use immediately with no account or sign-up required." },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
