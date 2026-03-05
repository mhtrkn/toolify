import type { NextConfig } from "next";

const TOOL_CATEGORIES = [
  "pdf-tools",
  "image-tools",
  "file-converter",
  "ocr-tools",
  "web-tools",
  "seo-tools",
  "developer-tools",
  "social-media-tools",
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://fasttoolify.com",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  async redirects() {
    return TOOL_CATEGORIES.flatMap((cat) => [
      {
        source: `/${cat}`,
        destination: `/tools/${cat}`,
        permanent: true,
      },
      {
        source: `/${cat}/:slug`,
        destination: `/tools/${cat}/:slug`,
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
