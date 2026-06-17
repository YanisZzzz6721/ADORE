// ─── Types globaux ADORE ──────────────────────────────────────

export interface Service {
  id: string;
  num: string;           // "I", "II", "III"
  name: string;
  description: string;
  price: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: "manucure" | "nail-art" | "soin" | "salon";
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    complement?: string;
  };
  planityUrl: string;
  instagram: string;
  hours: OpeningHours[];
}

export interface NavItem {
  label: string;
  href: string;
}

// Framer Motion helpers
export type MotionDirection = "up" | "down" | "left" | "right";
