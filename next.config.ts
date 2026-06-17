import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation images (WebP automatique, lazy loading)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Unsplash pour les placeholders de développement
      { protocol: "https", hostname: "images.unsplash.com" },
      // Sanity CDN pour les images admin
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },

  // Headers de sécurité et performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Cache des assets statiques (1 an)
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Compression activée
  compress: true,

  // Powered-By header masqué
  poweredByHeader: false,
};

export default nextConfig;
