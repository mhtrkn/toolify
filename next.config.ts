import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://fasttoolify.com/",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable gzip compression for better performance
  compress: true,
};

export default nextConfig;
