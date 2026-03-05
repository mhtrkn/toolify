export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured?: boolean;
  relatedTools: { name: string; href: string }[];
  relatedPosts?: string[];
}
