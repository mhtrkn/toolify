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
    keywords: ["pdf to jpg converter", "convert pdf to image online free", "pdf to jpg high quality", "extract images from pdf", "pdf page to jpeg", "pdf to image converter", "convert pdf to jpg without adobe", "pdf to jpg bulk download", "export pdf pages as images", "pdf to jpeg free online"],
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
    keywords: ["merge pdf online free", "combine pdf files", "join pdf documents", "pdf merger no upload", "merge multiple pdfs into one", "combine pdf pages online", "pdf combiner free", "merge pdf without adobe", "free pdf merge tool", "combine two pdf files online"],
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
    keywords: ["compress pdf online free", "reduce pdf file size", "pdf compressor no upload", "shrink pdf to 100kb", "compress pdf without losing quality", "make pdf smaller online", "pdf file size reducer", "compress pdf for email", "pdf compressor free tool", "reduce pdf size online without quality loss"],
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
    keywords: ["split pdf online free", "extract pages from pdf", "pdf page extractor", "split pdf by page range", "separate pdf pages online", "cut pdf pages online", "pdf splitter no upload", "divide pdf into parts", "extract specific pages from pdf", "split pdf without adobe"],
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
    keywords: ["jpg to pdf converter", "convert images to pdf online free", "multiple photos to pdf", "jpeg to pdf free", "png to pdf converter", "combine images into pdf", "image to pdf converter online", "photos to pdf no watermark", "jpg to pdf without software", "convert picture to pdf free"],
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
    keywords: ["pdf to word converter free", "convert pdf to docx online", "extract text from pdf to word", "pdf to editable document", "pdf to word no software", "pdf text to rtf free", "convert pdf to word online no email", "pdf to word without adobe", "pdf to word free online tool", "scanned pdf to word text"],
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
    keywords: ["word to pdf converter free", "convert docx to pdf online", "doc to pdf converter", "microsoft word to pdf free", "word to pdf no software", "save word as pdf online", "convert word document to pdf free", "docx to pdf without word", "word file to pdf converter online", "word to pdf best quality"],
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
    keywords: ["delete pages from pdf online free", "remove pdf pages", "pdf page remover", "delete specific pages from pdf", "remove pages from pdf without acrobat", "pdf page deleter online", "how to delete a page from pdf online", "online pdf editor remove pages", "cut pages from pdf free", "pdf page removal tool"],
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
    keywords: ["password protect pdf online free", "encrypt pdf with password", "add password to pdf online", "pdf password protection free", "secure pdf online", "lock pdf with password free", "pdf encryption tool online", "protect pdf without adobe", "pdf password encryption free tool", "how to password protect a pdf online"],
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
    keywords: ["image compressor online free", "compress jpg online", "compress png file size", "reduce image file size without quality loss", "image size reducer free", "compress webp online", "compress images for website free", "image file compressor no upload", "reduce photo size online free", "compress image to 100kb free"],
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
    keywords: ["resize image online free", "image resizer custom dimensions", "resize photo online", "change image size online free", "resize jpg online free", "resize png online", "image resize pixels free", "resize image without losing quality", "resize image for social media", "online image resizer no signup"],
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
    keywords: ["jpg to png converter free", "convert jpeg to png online", "jpg to png lossless", "jpeg to png with transparency", "change jpg format to png free", "convert photo to png online", "jpg to png no quality loss", "jpg to png converter without software", "batch jpg to png online", "convert jpg to transparent png"],
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
    keywords: ["png to jpg converter free", "convert png to jpeg online", "png to jpg no quality loss", "transparent png to jpg converter", "change png to jpg format", "reduce png file size as jpg", "png to jpeg converter online free", "convert png to jpg without software", "batch png to jpg converter", "png to jpg background color"],
    acceptedFormats: [".png"],
    outputFormat: "JPG",
  },
  {
    slug: "image-format-converter",
    name: "Image Format Converter",
    description:
      "Convert images between any format online for free. Supports HEIC, JPG, PNG, WebP, BMP, TIFF. Batch conversion with drag & drop — all client-side.",
    shortDescription: "Convert HEIC, JPG, PNG, WebP, BMP, TIFF",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "🔄",
    keywords: ["image format converter online free", "heic to jpg converter", "webp to jpg converter", "png to webp converter", "bmp to jpg online", "tiff to jpg free", "convert heic to png online", "batch image converter free", "image type converter browser", "heic to webp online free"],
    popular: true,
    acceptedFormats: [".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".tif"],
    outputFormat: "JPG/PNG/WebP",
  },
  {
    slug: "gif-maker",
    name: "GIF Maker & Converter",
    description:
      "Create GIFs from images or video online. Convert video to GIF or GIF to MP4. Set frame rate, quality, and resolution. Preview before download.",
    shortDescription: "Create GIF from images or video, convert GIF to MP4",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "🎞️",
    keywords: ["gif maker online free", "video to gif converter", "gif to mp4 converter", "create gif from images online", "make gif from video free", "gif creator browser", "video to gif no upload", "gif to video converter free", "animated gif maker online", "gif maker with custom fps"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm", ".gif"],
    outputFormat: "GIF/MP4",
  },
  {
    slug: "image-editor",
    name: "Image Editor",
    description:
      "Free online image editor with resize, crop, rotate, and flip tools. Supports JPG, PNG, WebP. No software needed — works in your browser.",
    shortDescription: "Resize, crop, rotate & flip images online",
    category: "image",
    categorySlug: "image-tools",
    categoryName: "Image Tools",
    icon: "✏️",
    keywords: ["image editor online free", "crop image online", "rotate image online", "flip image online", "resize image online free", "online photo editor no signup", "image crop resize rotate free", "edit image browser", "photo editor online free no download", "image flipper online"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".bmp"],
    outputFormat: "JPG/PNG/WebP",
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
    keywords: ["video to mp3 converter free", "extract audio from video online", "mp4 to mp3 free", "convert video to audio online", "video audio extractor browser", "mov to mp3 converter free", "mkv to mp3 online free", "webm to mp3 converter", "video to mp3 no software", "free audio extractor from video"],
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
    keywords: ["compress video online free", "reduce video file size online", "mp4 compressor free", "video compressor no upload", "compress video without losing quality", "make video smaller online free", "reduce mp4 file size online", "compress video for email free", "video size reducer browser", "compress mov file online free"],
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
    keywords: ["word to pdf converter free", "convert docx to pdf online", "doc to pdf converter", "microsoft word to pdf free", "word to pdf no software", "save word as pdf online", "convert word document to pdf free", "docx to pdf without word", "word file to pdf converter online", "word to pdf best quality"],
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
    keywords: ["excel to pdf converter free", "convert xlsx to pdf online", "xls to pdf free", "excel spreadsheet to pdf", "convert excel to pdf no office", "xlsx to pdf online no software", "excel table to pdf converter", "batch excel to pdf free", "excel to pdf best quality", "convert xls to pdf online free"],
    acceptedFormats: [".xls", ".xlsx"],
    outputFormat: "PDF",
  },
  // File Converter – Data Format & Text Tools
  {
    slug: "csv-json-converter",
    name: "CSV ↔ JSON Converter",
    description:
      "Convert CSV files to JSON and JSON arrays to CSV online for free. Bidirectional, instant, 100% in-browser.",
    shortDescription: "Convert CSV to JSON and back",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "🔄",
    keywords: ["csv to json converter", "json to csv converter", "csv to json online free", "json to csv online", "convert csv to json browser", "parse csv to json", "json to csv download", "csv json converter free", "convert json array to csv", "csv to json no upload"],
    popular: true,
    acceptedFormats: [".csv", ".json"],
    outputFormat: "JSON/CSV",
  },
  {
    slug: "json-xml-converter",
    name: "JSON ↔ XML Converter",
    description:
      "Convert JSON to XML and XML to JSON online for free. Bidirectional converter with live preview.",
    shortDescription: "Convert JSON to XML and back",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "🔁",
    keywords: ["json to xml converter", "xml to json converter", "json to xml online free", "xml to json online", "convert json to xml browser", "json xml converter free", "xml to json download", "convert xml to json no upload", "json to xml formatter", "xml json converter tool"],
    acceptedFormats: [".json", ".xml"],
    outputFormat: "JSON/XML",
  },
  {
    slug: "excel-csv-converter",
    name: "Excel ↔ CSV Converter",
    description:
      "Convert Excel spreadsheets to CSV and CSV files to Excel online. Supports .xlsx and .xls — no software needed.",
    shortDescription: "Convert Excel to CSV and back",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "📊",
    keywords: ["excel to csv converter", "csv to excel converter", "xlsx to csv online free", "csv to xlsx online", "convert excel to csv no software", "excel csv converter free", "xls to csv converter", "csv to excel download", "batch excel to csv free", "excel csv online tool"],
    popular: true,
    acceptedFormats: [".xlsx", ".xls", ".csv"],
    outputFormat: "CSV/XLSX",
  },
  {
    slug: "txt-docx-converter",
    name: "TXT ↔ DOCX Converter",
    description:
      "Convert plain text files to Word DOCX documents and extract text from DOCX files online for free.",
    shortDescription: "Convert TXT to DOCX and back",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "📝",
    keywords: ["txt to docx converter", "docx to txt converter", "convert text to word online free", "txt to word converter", "word to text extractor free", "txt to docx no software", "plain text to word document", "docx to plain text online", "convert txt to word free", "text file to word document"],
    acceptedFormats: [".txt", ".docx"],
    outputFormat: "DOCX/TXT",
  },
  {
    slug: "markdown-html-converter",
    name: "Markdown ↔ HTML Converter",
    description:
      "Convert Markdown to HTML and HTML to Markdown online with a live split-pane preview. Fast, free, no signup.",
    shortDescription: "Convert Markdown to HTML with live preview",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "✍️",
    keywords: ["markdown to html converter", "html to markdown converter", "markdown to html online free", "md to html live preview", "html to markdown online", "convert markdown to html", "markdown html editor free", "md to html converter no signup", "html to md converter", "markdown preview online"],
    popular: true,
    outputFormat: "HTML/MD",
  },
  {
    slug: "zip-tools",
    name: "ZIP Tools",
    description:
      "Create ZIP archives from multiple files and extract ZIP files online for free. 100% client-side, no uploads.",
    shortDescription: "Create and extract ZIP archives online",
    category: "file",
    categorySlug: "file-converter",
    categoryName: "File Converter",
    icon: "🗜️",
    keywords: ["zip creator online free", "extract zip file online", "create zip archive browser", "zip extractor online no software", "online zip creator free", "zip file creator tool", "extract zip no upload", "make zip file online", "zip files together free", "online zip extractor free"],
    acceptedFormats: [".zip", "*"],
    outputFormat: "ZIP",
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
    keywords: ["qr code generator free online", "create qr code for url", "wifi qr code generator", "vcard qr code creator", "custom qr code free", "qr code maker no signup", "qr code for business card free", "qr code generator download png", "free qr code with custom color", "qr code generator for link sharing"],
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
    keywords: ["color palette generator free", "complementary color finder online", "hex color palette", "analogous color scheme generator", "triadic color palette tool", "color scheme generator from hex", "brand color palette generator", "rgb color palette maker", "color combination generator online", "color harmony tool free"],
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
    keywords: ["json editor online free", "csv editor browser", "json viewer online", "edit json file online", "json to csv converter free", "csv to json converter online", "json formatter and validator", "csv file viewer online", "online json prettifier", "json csv converter no signup"],
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
    keywords: ["base64 encoder online free", "base64 decoder online", "encode text to base64", "decode base64 string online", "base64 file encoder free", "base64 image encoder", "convert base64 to text", "base64 encode decode tool", "online base64 converter", "base64 encode file browser"],
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
    keywords: ["html to pdf converter free", "convert html to pdf online", "webpage to pdf converter", "html code to pdf download", "html to pdf no software", "save html as pdf online", "url to pdf converter free", "web page to pdf online", "html to pdf a4 format", "convert html file to pdf free"],
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
    keywords: ["html minifier online free", "minify html code online", "compress html file free", "html code optimizer", "remove whitespace from html online", "html uglifier free", "reduce html file size", "minify html javascript free", "html compressor tool", "online html minifier no signup"],
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
    keywords: ["url shortener free online", "shorten link free", "free short url generator", "url shortener no signup", "link shortener for social media", "tinyurl alternative free", "short url creator online", "compact url generator", "url shortener no expiry", "best free url shortener 2025"],
    popular: true,
    outputFormat: "Short URL",
  },
  // OCR Tools
  {
    slug: "ocr-image-to-text",
    name: "OCR Image to Text",
    description:
      "Extract text from images using AI-powered multilingual OCR. Supports 14 languages including Turkish, Arabic and Russian. Batch processing, DOCX export, and confidence highlighting.",
    shortDescription: "Multilingual OCR — extract text from images",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "🔍",
    keywords: ["ocr image to text online free", "multilingual ocr", "turkish ocr free", "extract text from image", "image to text converter ocr", "batch ocr processing", "ocr with confidence score", "scan image to text free", "photo to text converter", "online ocr no signup"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".heic"],
    outputFormat: "TXT/DOCX",
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description:
      "Extract text from digital and scanned PDFs online. Auto-OCR for image-based pages. Export as TXT, DOCX, or JSON. Batch processing — all in your browser.",
    shortDescription: "Extract text from PDF — digital & scanned",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "📋",
    keywords: ["pdf to text converter free", "scanned pdf ocr extractor", "extract text from pdf online", "pdf to docx converter", "pdf text extraction json", "batch pdf to text", "pdf ocr fallback", "pdf to txt online free", "copy text from scanned pdf", "pdf text extractor free"],
    popular: true,
    acceptedFormats: [".pdf"],
    outputFormat: "TXT/DOCX/JSON",
  },
  {
    slug: "barcode-qr-scanner",
    name: "Barcode & QR Scanner",
    description:
      "Scan QR codes and barcodes from images or live webcam. Supports QR, Code128, EAN-13, UPC, DataMatrix, and more. Also generate custom QR codes for URLs, WiFi, vCards, and text.",
    shortDescription: "Scan QR & barcodes · Generate custom QR codes",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "⬛",
    keywords: ["qr code scanner online free", "barcode scanner from image", "webcam barcode scanner browser", "scan qr code from image upload", "ean-13 barcode reader online", "code128 scanner free", "qr code generator url wifi vcard", "custom qr code color size", "barcode qr tool free", "qr scanner no app"],
    popular: true,
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".bmp"],
    outputFormat: "Text/PNG",
  },
  {
    slug: "ocr-text-editor",
    name: "OCR Text Editor",
    description:
      "Upload an image, extract text with OCR, then edit it in a smart text editor. Features spell check, search & replace, word/char counts, and export to TXT or DOCX.",
    shortDescription: "OCR + smart text editor with search & replace",
    category: "ocr",
    categorySlug: "ocr-tools",
    categoryName: "OCR Tools",
    icon: "✏️",
    keywords: ["ocr text editor online", "extract and edit text from image", "ocr spell check online", "search replace ocr text", "image to editable text free", "ocr word editor online", "ocr post processing tool", "edit extracted text from image", "ocr correction tool free", "image text extractor editor"],
    acceptedFormats: [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"],
    outputFormat: "TXT/DOCX",
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
