import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Menambahkan trailingSlash agar routing di CDN Cloudflare lebih konsisten
  trailingSlash: true,
};

export default nextConfig;
