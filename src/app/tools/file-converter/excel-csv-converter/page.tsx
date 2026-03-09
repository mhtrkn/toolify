import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import GlobalUpload from "@/components/home/GlobalUpload";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Excel ↔ CSV Converter",
  toolDescription:
    "Convert Excel spreadsheets to CSV and CSV files to Excel online for free. Supports .xlsx and .xls. Multi-sheet Excel exports as a ZIP of CSVs.",
  categorySlug: "file-converter",
  toolSlug: "excel-csv-converter",
  keywords: [
    "excel to csv converter",
    "csv to excel converter",
    "xlsx to csv online free",
    "csv to xlsx online",
    "convert excel to csv no software",
    "excel csv converter free",
    "xls to csv converter",
    "csv to excel download",
    "batch excel to csv free",
    "excel csv online tool",
  ],
});

const FAQS = [
  {
    question: "What happens with multi-sheet Excel files?",
    answer:
      "Each sheet is exported as a separate CSV file. When your workbook has more than one sheet, all CSVs are bundled into a single ZIP archive for download.",
  },
  {
    question: "Does CSV to Excel preserve my data types?",
    answer:
      "The converter creates a standard .xlsx file with all values as text. You can use Excel's Format Cells after opening to apply number or date formatting.",
  },
  {
    question: "Is my file uploaded to a server?",
    answer:
      "No. All conversion runs entirely in your browser using SheetJS (xlsx). Your spreadsheet never leaves your device.",
  },
  {
    question: "What is the maximum file size?",
    answer: "Files up to 20MB are supported. For very large spreadsheets, consider splitting them before converting.",
  },
];

export default function ExcelCsvPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "Excel ↔ CSV Converter",
          description: "Convert Excel to CSV and CSV to Excel online for free.",
          slug: "excel-csv-converter",
          categorySlug: "file-converter",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "File Converter", url: `${SITE_URL}/tools/file-converter` },
          { name: "Excel ↔ CSV Converter", url: `${SITE_URL}/tools/file-converter/excel-csv-converter` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "File Converter", href: "/tools/file-converter" },
          { label: "Excel ↔ CSV Converter" },
        ]}
        title="Excel ↔ CSV Converter – Free Online Tool"
        description="Convert Excel .xlsx/.xls files to CSV and CSV files to Excel in your browser. Multi-sheet workbooks export as a ZIP of CSVs. No Microsoft Office or server upload needed."
        howToSteps={[
          { title: "Choose Direction", description: "Select Excel → CSV or CSV → Excel using the mode toggle." },
          { title: "Upload Your File", description: "Drop an .xlsx, .xls, or .csv file onto the upload area." },
          { title: "Download Result", description: "Click Convert then download your converted file instantly." },
        ]}
        benefits={[
          { title: "Multi-Sheet Support", description: "All sheets from Excel workbooks are exported — one CSV per sheet, bundled as ZIP." },
          { title: "100% Private", description: "Conversion happens in your browser — no file is ever uploaded to a server." },
          { title: "No Office Required", description: "Works without Microsoft Excel, LibreOffice, or any desktop software." },
          { title: "No Registration", description: "Free to use immediately with no account or sign-up required." },
        ]}
        faqs={FAQS}
      >
        <GlobalUpload />
      </ToolPageLayout>
    </>
  );
}
