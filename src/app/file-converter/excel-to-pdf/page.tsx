import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import ExcelToPdfClient from "./ExcelToPdfClient";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import {
  buildWebAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Excel to PDF",
  toolDescription:
    "Convert Excel spreadsheets (XLS, XLSX) to PDF online for free. All sheets included — convert and download instantly in your browser.",
  categorySlug: "file-converter",
  toolSlug: "excel-to-pdf",
  keywords: [
    "excel to pdf",
    "xlsx to pdf online",
    "convert excel to pdf free",
    "xls to pdf",
    "spreadsheet to pdf",
  ],
});

const FAQS = [
  {
    question: "Does it support both .xls and .xlsx formats?",
    answer:
      "Yes. Both legacy XLS and modern XLSX formats are supported. XLSX is recommended for best results.",
  },
  {
    question: "Are multiple sheets included in the PDF?",
    answer:
      "Yes. All sheets in your Excel workbook are included in the PDF output, each starting on a new page.",
  },
  {
    question: "Is my spreadsheet uploaded to a server?",
    answer:
      "No. Conversion runs entirely in your browser using SheetJS (xlsx) and jsPDF. Your file never leaves your device.",
  },
  {
    question: "What is the PDF page orientation?",
    answer:
      "The PDF is generated in landscape A4 format to best accommodate the wide nature of spreadsheet data.",
  },
];

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Excel to PDF Converter",
          description: "Convert Excel spreadsheets to PDF online for free.",
          slug: "excel-to-pdf",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "File Converter", url: `${SITE_URL}/file-converter` },
          {
            name: "Excel to PDF",
            url: `${SITE_URL}/file-converter/excel-to-pdf`,
          },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "File Converter", href: "/file-converter" },
          { label: "Excel to PDF" },
        ]}
        title="Excel to PDF – Convert Spreadsheets Online Free"
        description="Convert Excel XLS and XLSX files to PDF format in your browser. All sheets are included, no software installation required."
        howToSteps={[
          {
            title: "Upload Excel File",
            description: "Click or drag to upload your .xls or .xlsx file.",
          },
          {
            title: "Preview Sheets",
            description:
              "See a preview of detected sheets and their dimensions before converting.",
          },
          {
            title: "Download PDF",
            description:
              "Click 'Convert to PDF' and download your landscape-format PDF.",
          },
        ]}
        benefits={[
          {
            title: "All Sheets Included",
            description:
              "Every sheet in your workbook is included in the PDF with page breaks between them.",
          },
          {
            title: "100% Private",
            description:
              "Conversion happens in your browser — no server uploads, no data sharing.",
          },
          {
            title: "Sheet Preview",
            description:
              "See sheet names and dimensions before converting so you know what to expect.",
          },
          {
            title: "No Registration",
            description:
              "Free to use immediately with no account or sign-up required.",
          },
        ]}
        faqs={FAQS}
      >
        <ExcelToPdfClient />
      </ToolPageLayout>
    </>
  );
}
