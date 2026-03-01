import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { SITE_URL } from "@/lib/metadata";

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

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}/${tool.categorySlug}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: tool.popular ? 0.9 : 0.7,
  }));

  return [...homepage, ...categoryPages, ...toolPages];
}
