import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "@/styles/globals.css";

// ─── Google Fonts ─────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-jost",
  display: "swap",
  preload: true,
});

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://adore-strasbourg.fr"),

  title: {
    default: "ADORE — Maison de Manucure à Strasbourg",
    template: "%s | ADORE Strasbourg",
  },
  description:
    "ADORE est une maison de manucure haut de gamme à Strasbourg. Manucure prestige, nail art exclusif et soins régénérants. Sur rendez-vous au 5 Place Arnold.",

  keywords: [
    "manucure Strasbourg",
    "nail art Strasbourg",
    "onglerie luxe Strasbourg",
    "semi-permanent Strasbourg",
    "gel ongles Strasbourg",
    "soin mains Strasbourg",
    "ADORE manucure",
    "nail art haut de gamme",
    "onglerie Place Arnold Strasbourg",
  ],

  authors: [{ name: "ADORE — Maison de Manucure" }],
  creator: "ADORE",
  publisher: "ADORE",

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://adore-strasbourg.fr",
    siteName: "ADORE — Maison de Manucure",
    title: "ADORE — Maison de Manucure à Strasbourg",
    description:
      "Un sanctuaire dédié à l'élégance des mains. Manucure prestige, nail art exclusif, soins régénérants. Strasbourg, 5 Place Arnold.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ADORE — Maison de Manucure à Strasbourg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ADORE — Maison de Manucure à Strasbourg",
    description: "Un sanctuaire dédié à l'élégance des mains. Strasbourg.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8D5CE",
};

// ─── Schema.org JSON-LD — référencement local Strasbourg ──────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "ADORE — Maison de Manucure",
  description:
    "Maison de manucure haut de gamme à Strasbourg. Manucure prestige, nail art exclusif et soins régénérants.",
  url: "https://adore-strasbourg.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5 Place Arnold",
    addressLocality: "Strasbourg",
    postalCode: "67000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.5734053,
    longitude: 7.7521113,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  priceRange: "€€€",
  image: "https://adore-strasbourg.fr/og-image.jpg",
  sameAs: ["https://www.instagram.com/adore.nails.strasbourg"],
};

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAFAFA] text-[#111111] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
