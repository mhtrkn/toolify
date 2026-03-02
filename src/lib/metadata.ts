import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fasttoolify.com").replace(/\/$/, "");
const SITE_NAME = "toolify";
const SITE_DESCRIPTION =
  "Free online tools for PDF, image, video, and file conversion. Merge PDFs, compress images, convert Word to PDF — fast, secure, no registration required.";

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function buildToolMetadata({
  toolName,
  toolDescription,
  categorySlug,
  toolSlug,
  keywords,
  customTitle,
}: {
  toolName: string;
  toolDescription: string;
  categorySlug: string;
  toolSlug: string;
  keywords: string[];
  customTitle?: string;
}): Metadata {
  return buildMetadata({
    title: customTitle ?? `${toolName} – Free Online Tool`,
    description: toolDescription,
    path: `/${categorySlug}/${toolSlug}`,
    keywords,
  });
}

export function buildCategoryMetadata({
  categoryName,
  categoryDescription,
  categorySlug,
  keywords,
}: {
  categoryName: string;
  categoryDescription: string;
  categorySlug: string;
  keywords?: string[];
}): Metadata {
  return buildMetadata({
    title: `${categoryName} – Free Online Tools`,
    description: categoryDescription,
    path: `/${categorySlug}`,
    keywords,
  });
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION };
