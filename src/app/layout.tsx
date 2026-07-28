import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import FloatingCTA from "@/components/ui/FloatingCTA";
import CustomCursor from "@/components/ui/CustomCursor";

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
    "ADORE est une maison de manucure haut de gamme à Strasbourg. Manucure russe, beauté des pieds et nail art sur mesure. Sur rendez-vous au 10 Rue Kuhn.",

  keywords: [
    "manucure Strasbourg",
    "manucure russe Strasbourg",
    "nail art Strasbourg",
    "onglerie luxe Strasbourg",
    "semi-permanent Strasbourg",
    "beauté des pieds Strasbourg",
    "soin mains Strasbourg",
    "ADORE manucure",
    "onglerie Rue Kuhn Strasbourg",
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
      "Un sanctuaire dédié à l'élégance des mains. Manucure russe, beauté des pieds, nail art sur mesure. Strasbourg, 10 Rue Kuhn.",
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
// Construit à partir de siteConfig : une seule source de vérité pour
// l'adresse et les horaires, impossible de les voir diverger du site.
const WEEKDAY_SCHEMA: Record<string, string> = {
  Lundi: "Monday",
  Mardi: "Tuesday",
  Mercredi: "Wednesday",
  Jeudi: "Thursday",
  Vendredi: "Friday",
  Samedi: "Saturday",
  Dimanche: "Sunday",
};

const openDays = siteConfig.hours.filter((h) => !h.closed);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "ADORE — Maison de Manucure",
  description: siteConfig.description,
  url: "https://adore-strasbourg.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "FR",
  },
  openingHoursSpecification: openDays.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: WEEKDAY_SCHEMA[h.day] ?? h.day,
    opens: h.open,
    closes: h.close,
  })),
  priceRange: "€€",
  image: "https://adore-strasbourg.fr/og-image.jpg",
  sameAs: [siteConfig.instagram, siteConfig.planityUrl],
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
        <SmoothScroll>
          <Navigation />
          {children}
          <FloatingCTA />
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
