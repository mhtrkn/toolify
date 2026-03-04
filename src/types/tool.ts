export type ToolCategoryType = "pdf" | "image" | "file" | "ocr" | "web" | "social" | "seo" | "dev";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategoryType;
  categorySlug: string;
  categoryName: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  isNew?: boolean;
  acceptedFormats?: string[];
  outputFormat?: string;
}

export interface Category {
  id: ToolCategoryType;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
