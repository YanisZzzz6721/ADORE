import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation images (WebP automatique, lazy loading)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Vercel Blob — photos envoyées depuis l'espace admin en production.
      // L'hôte contient l'identifiant du store, d'où le joker de sous-domaine.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Photo de stock encore utilisée en fond de CTASection — à remplacer
      // par une vraie photo du salon, cette entrée pourra alors disparaître.
      { protocol: "https", hostname: "images.unsplash.com" },
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
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache des assets statiques (1 an)
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
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
