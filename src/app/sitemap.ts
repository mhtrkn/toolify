import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { SITE_URL } from "@/lib/metadata";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepage: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/tools/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: tool.popular ? 0.9 : 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...homepage, ...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
