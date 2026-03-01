import type { Tool, Category } from "@/types/tool";

export const CATEGORIES: Category[] = [
  {
    id: "pdf",
    slug: "pdf-tools",
    name: "PDF Tools",
    description:
      "Convert, merge, split, and edit PDF files online for free. No installation required.",
    icon: "📄",
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
    icon: "🖼️",
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
    icon: "🎬",
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
    icon: "🔄",
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
    icon: "🔍",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
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
