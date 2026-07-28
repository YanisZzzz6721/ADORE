// ─── Formes et valeurs par défaut du contenu éditable du site ──
// Ce module est importé côté serveur (routes API) ET côté client (hooks) :
// il ne doit contenir que des types et des constantes, aucun accès I/O.

export type SiteImages = {
  hero: string;
  maison: string;
  prestation_mains: string | null;
  prestation_pieds: string | null;
  galerie: (string | null)[];
};

export type SiteContent = {
  hero_tagline: string;
  citation: string;
  maison_p1: string;
  maison_p2: string;
};

export type SiteData = {
  images: SiteImages;
  content: SiteContent;
};

/** Nombre de photos de la galerie éditables depuis l'admin. */
export const GALERIE_SLOTS = 6;

export const DEFAULT_IMAGES: SiteImages = {
  hero: "/salon.JPG",
  maison: "/salon.JPG",
  prestation_mains: null,
  prestation_pieds: null,
  galerie: Array.from({ length: GALERIE_SLOTS }, () => null),
};

export const DEFAULT_CONTENT: SiteContent = {
  hero_tagline: "l'art de sublimer vos mains",
  citation:
    "Chez ADORE, nous croyons que chaque détail compte. Vos mains méritent le même soin que le reste de votre élégance.",
  maison_p1:
    "Niché au cœur de Strasbourg, ADORE est une maison de manucure d'exception. Dans un espace pensé pour la sérénité et le raffinement, nos expertes conjuguent techniques de pointe et matières précieuses.",
  maison_p2:
    "Anciennement Vegan Nails, réinventée sous le nom d'ADORE pour offrir une expérience sensorielle rare — la même exigence, un univers renouvelé.",
};

/** Champs texte modifiables depuis l'admin — sert de liste blanche à l'API. */
export const TEXT_FIELDS = [
  "hero_tagline",
  "citation",
  "maison_p1",
  "maison_p2",
] as const;

export type TextField = (typeof TEXT_FIELDS)[number];

/** Emplacements d'images à photo unique. */
export const FIXED_IMAGE_SLOTS = [
  "hero",
  "maison",
  "prestation_mains",
  "prestation_pieds",
] as const;

export type FixedImageSlot = (typeof FIXED_IMAGE_SLOTS)[number];
export type ImageSlot = FixedImageSlot | `galerie-${number}`;
