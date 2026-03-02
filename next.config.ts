import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://fasttoolify.com/",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  async headers() {
    return [
      {
        // SharedArrayBuffer required for FFmpeg WASM (video tools)
        source: "/video-tools/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
