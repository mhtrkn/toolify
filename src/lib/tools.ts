import type { Tool, Category } from "@/types/tool";

export const CATEGORIES: Category[] = [
  {
    id: "pdf",
    slug: "pdf-tools",
    name: "PDF Tools",
    description:
      "Convert, merge, split, and edit PDF files online for free. No installation required.",
    icon: "pdfv2",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    id: "image",
    slug: "image-tools",
    name: "Image Tools",
    description:
      "Compress, resize, convert, and edit images online. Supports JPG, PNG, WebP and more.",
    icon: "image",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "video",
    slug: "video-tools",
    name: "Video Tools",
    description:
      "Convert video formats, extract audio, compress videos online without software.",
    icon: "record",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "file",
    slug: "file-converter",
    name: "File Converter",
    description:
      "Convert files between formats instantly. Supports documents, spreadsheets, and more.",
    icon: "file",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "ocr",
    slug: "ocr-tools",
    name: "OCR Tools",
    description:
      "Extract text from images and PDFs using AI-powered optical character recognition.",
    icon: "qcr",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "web",
    slug: "web-tools",
    name: "Web Tools",
    description:
      "Free online utilities for developers and designers — QR codes, color palettes, Base64, JSON/CSV editor, HTML tools, and more.",
    icon: "web",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
];

export const TOOLS: Tool[] = [
  // PDF Tools
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description:
      "Convert PDF pages to high-quality JPG images online for free. Fast, secure, and easy to use.",
    shortDescription: "Convert PDF pages to JPG images",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "📄→🖼️",
    keywords: ["pdf to jpg", "convert pdf to image", "pdf to jpeg online"],
    popular: true,
    acceptedFormats: [".pdf"],
    outputFormat: "JPG",
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description:
      "Combine multiple PDF files into one document online. Free PDF merger with no file size limits.",
    shortDescription: "Combine multiple PDFs into one",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "📑",
    keywords: ["merge pdf", "combine pdf files", "join pdf online"],
    popular: true,
    acceptedFormats: [".pdf"],
    outputFormat: "PDF",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description:
      "Reduce PDF file size without losing quality. Free online PDF compressor.",
    shortDescription: "Reduce PDF file size online",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "🗜️",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor online"],
    acceptedFormats: [".pdf"],
    outputFormat: "PDF",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description:
      "Split a PDF into multiple separate files. Extract pages from PDF online for free.",
    shortDescription: "Split PDF into separate pages",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "✂️",
    keywords: ["split pdf", "extract pages from pdf", "pdf splitter"],
    acceptedFormats: [".pdf"],
    outputFormat: "PDF",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description:
      "Convert JPG or PNG images to PDF online. Combine multiple images into one PDF file instantly.",
    shortDescription: "Convert images to a PDF file",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "🖼️",
    keywords: ["jpg to pdf", "image to pdf", "png to pdf converter", "convert image to pdf"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png"],
    outputFormat: "PDF",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description:
      "Convert PDF files to editable Word documents online for free. Extract text and download as RTF.",
    shortDescription: "Convert PDF to Word document",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "📝",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to word online", "pdf text extractor"],
    acceptedFormats: [".pdf"],
    outputFormat: "RTF",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description:
      "Convert Word documents to PDF online for free. Supports .doc and .docx — no account needed.",
    shortDescription: "Convert Word documents to PDF",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "📄",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf online"],
    acceptedFormats: [".doc", ".docx"],
    outputFormat: "PDF",
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description:
      "Remove specific pages from a PDF file online. Select pages to delete and download the result instantly.",
    shortDescription: "Remove pages from a PDF",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "🗑️",
    keywords: ["delete pdf pages", "remove pages from pdf", "pdf page remover", "extract pdf pages"],
    acceptedFormats: [".pdf"],
    outputFormat: "PDF",
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description:
      "Add password protection to PDF files online. Encrypt and lock your PDF with a secure password.",
    shortDescription: "Add password to your PDF",
    category: "pdf",
    categorySlug: "pdf-tools",
    categoryName: "PDF Tools",
    icon: "🔒",
    keywords: ["protect pdf", "password protect pdf", "encrypt pdf", "lock pdf with password"],
    acceptedFormats: [".pdf"],
    outputFormat: "PDF",
  },
  // Image Tools
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress images online without losing quality. Reduce JPG, PNG, WebP file size instantly.",
    shortDescription: "Compress images without quality loss",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "🗜️",
    keywords: ["image compressor", "compress image online", "reduce image size"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: "JPG/PNG/WebP",
  },
  {
    slug: "image-resize",
    name: "Image Resize",
    description:
      "Resize images online to any dimension. Free image resizer that maintains aspect ratio.",
    shortDescription: "Resize images to custom dimensions",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "↔️",
    keywords: ["resize image", "image resizer online", "change image dimensions"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "JPG/PNG",
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    description:
      "Convert JPG images to PNG format online for free. Lossless conversion with transparency support.",
    shortDescription: "Convert JPG images to PNG format",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "🔁",
    keywords: ["jpg to png", "convert jpg to png", "jpeg to png converter"],
    acceptedFormats: [".jpg", ".jpeg"],
    outputFormat: "PNG",
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    description:
      "Convert PNG images to JPG format online. Reduce file size while preserving quality.",
    shortDescription: "Convert PNG images to JPG format",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "🔁",
    keywords: ["png to jpg", "convert png to jpeg", "png to jpg converter"],
    acceptedFormats: [".png"],
    outputFormat: "JPG",
  },
  // Video Tools
  {
    slug: "video-to-mp3",
    name: "Video to MP3",
    description:
      "Extract audio from video files and convert to MP3 online for free. Supports MP4, AVI, MOV.",
    shortDescription: "Extract MP3 audio from video files",
    category: "video",
    categorySlug: "video-tools",
    categoryName: "Video Tools",
    icon: "🎵",
    keywords: ["video to mp3", "extract audio from video", "mp4 to mp3 converter"],
    popular: true,
    acceptedFormats: [".mp4", ".avi", ".mov", ".mkv", ".webm"],
    outputFormat: "MP3",
  },
  {
    slug: "compress-video",
    name: "Compress Video",
    description:
      "Reduce video file size online without losing quality. Free video compressor.",
    shortDescription: "Reduce video file size online",
    category: "video",
    categorySlug: "video-tools",
    categoryName: "Video Tools",
    icon: "🗜️",
    keywords: ["compress video", "reduce video size", "video compressor online"],
    acceptedFormats: [".mp4", ".avi", ".mov", ".mkv"],
    outputFormat: "MP4",
  },
  // File Converter
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description:
      "Convert Word documents (DOCX) to PDF online for free. Preserves formatting perfectly.",
    shortDescription: "Convert Word documents to PDF",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "📝",
    keywords: ["word to pdf", "docx to pdf", "convert word document to pdf"],
    popular: true,
    acceptedFormats: [".doc", ".docx"],
    outputFormat: "PDF",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description:
      "Convert Excel spreadsheets to PDF format online. Free XLSX to PDF converter.",
    shortDescription: "Convert Excel files to PDF",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "📊",
    keywords: ["excel to pdf", "xlsx to pdf", "spreadsheet to pdf"],
    acceptedFormats: [".xls", ".xlsx"],
    outputFormat: "PDF",
  },
  // Web Tools
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Generate QR codes for URLs, WiFi networks, and vCards online for free. Customize size and color.",
    shortDescription: "Generate QR codes for links, WiFi, and contacts",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "⬛",
    keywords: ["qr code generator", "create qr code", "free qr code maker", "wifi qr code", "vcard qr code"],
    popular: true,
    outputFormat: "PNG",
  },
  {
    slug: "color-palette",
    name: "Color Palette Generator",
    description:
      "Generate complementary and analogous color palettes from any hex color. Convert hex to RGB and HSB instantly.",
    shortDescription: "Generate color palettes from any hex color",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "🎨",
    keywords: ["color palette generator", "complementary colors", "hex to rgb", "color scheme generator", "analogous colors"],
    popular: true,
    outputFormat: "HEX/RGB",
  },
  {
    slug: "json-csv-editor",
    name: "JSON / CSV Editor",
    description:
      "Preview, edit, and export JSON and CSV files online. Drag & drop files, edit inline, and download the result.",
    shortDescription: "Preview and edit JSON and CSV files online",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "📋",
    keywords: ["json editor online", "csv editor", "json viewer", "csv viewer", "edit json online"],
    popular: true,
    acceptedFormats: [".json", ".csv"],
    outputFormat: "JSON/CSV",
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode and decode Base64 strings online. Supports text and file input with instant results.",
    shortDescription: "Encode or decode Base64 text and files",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "🔢",
    keywords: ["base64 encoder", "base64 decoder", "encode base64 online", "decode base64 string", "base64 converter"],
    acceptedFormats: ["*"],
    outputFormat: "TXT/Base64",
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF Converter",
    description:
      "Convert HTML code to a downloadable PDF file online. Choose page size and preserve styling.",
    shortDescription: "Convert HTML code to a PDF document",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "📄",
    keywords: ["html to pdf", "convert html to pdf online", "html pdf converter", "html page to pdf"],
    outputFormat: "PDF",
  },
  {
    slug: "html-minifier",
    name: "HTML Minifier",
    description:
      "Minify HTML code online by removing comments, whitespace, and redundant characters. Instantly reduce file size.",
    shortDescription: "Minify and compress HTML code online",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "⚡",
    keywords: ["html minifier", "minify html online", "compress html", "html compressor", "reduce html size"],
    outputFormat: "HTML",
  },
  {
    slug: "url-shortener",
    name: "URL Shortener",
    description:
      "Shorten long URLs online for free. Generate compact, shareable short links instantly.",
    shortDescription: "Shorten long URLs into compact links",
    category: "web",
    categorySlug: "web-tools",
    categoryName: "Web Tools",
    icon: "🔗",
    keywords: ["url shortener", "shorten url online", "free link shortener", "short url generator"],
    popular: true,
    outputFormat: "Short URL",
  },
  // OCR Tools
  {
    slug: "ocr-image-to-text",
    name: "OCR Image to Text",
    description:
      "Extract text from images using AI-powered OCR technology. Supports 100+ languages.",
    shortDescription: "Extract text from images using OCR",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "🔍",
    keywords: ["ocr image to text", "extract text from image", "image to text converter"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".bmp", ".tiff"],
    outputFormat: "TXT",
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description:
      "Extract text content from PDF files online. Free PDF to text converter.",
    shortDescription: "Extract text from PDF files",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "📋",
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor"],
    acceptedFormats: [".pdf"],
    outputFormat: "TXT",
  },
];

export function getToolsByCategory(categorySlug: string): Tool[] {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return TOOLS.filter((t) => t.category === category.id);
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter((t) => t.popular);
}

export function getToolBySlug(categorySlug: string, toolSlug: string): Tool | undefined {
  return TOOLS.find((t) => t.categorySlug === categorySlug && t.slug === toolSlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}
