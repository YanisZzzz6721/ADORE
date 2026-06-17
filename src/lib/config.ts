import type { SiteConfig, Service, NavItem } from "@/types";

// ─── Config centrale du site (éditée par l'admin Sanity) ─────
export const siteConfig: SiteConfig = {
  name: "ADORE",
  tagline: "L'art de sublimer vos mains",
  description:
    "Maison de manucure haut de gamme au cœur de Strasbourg. Un sanctuaire dédié à l'élégance des mains.",
  address: {
    street: "5 Place Arnold",
    complement: "chez New_Green_Atelier",
    city: "Strasbourg",
    postalCode: "67000",
  },
  planityUrl: "https://www.planity.com/vegan-nails-67000-strasbourg",
  instagram: "https://www.instagram.com/adore.nails.strasbourg",
  hours: [
    { day: "Lundi",    open: "",      close: "",      closed: true },
    { day: "Mardi",    open: "10:00", close: "19:00" },
    { day: "Mercredi", open: "10:00", close: "19:00" },
    { day: "Jeudi",    open: "10:00", close: "19:00" },
    { day: "Vendredi", open: "10:00", close: "19:00" },
    { day: "Samedi",   open: "10:00", close: "19:00" },
    { day: "Dimanche", open: "",      close: "",      closed: true },
  ],
};

// ─── Navigation ───────────────────────────────────────────────
export const navItems: NavItem[] = [
  { label: "La Maison",    href: "#maison" },
  { label: "Savoir-Faire", href: "#savoir-faire" },
  { label: "Galerie",      href: "#galerie" },
  { label: "Contact",      href: "#contact" },
];

// ─── Services (remplacé par Sanity en prod) ───────────────────
export const services: Service[] = [
  {
    id: "manucure-prestige",
    num: "I",
    name: "Manucure Prestige",
    description:
      "Soin complet et ritualisé : cuticules, shaping sur mesure, pose semi-permanent ou gel longue tenue. Finitions parfaites, résultat jusqu'à 4 semaines.",
    price: "À partir de 45 €",
    imageAlt: "Manucure prestige ADORE Strasbourg",
  },
  {
    id: "nail-art-exclusif",
    num: "II",
    name: "Nail Art Exclusif",
    description:
      "Créations sur mesure : motifs floraux, graphiques, ombré, french twist, pierres Swarovski. Chaque ongle, une œuvre unique et personnalisée.",
    price: "À partir de 65 €",
    imageAlt: "Nail art exclusif ADORE Strasbourg",
  },
  {
    id: "rituel-regenerant",
    num: "III",
    name: "Rituel Régénérant",
    description:
      "Soin profond aux huiles précieuses et actifs botaniques : gommage, enveloppement nutritif, massage relaxant et révélateur de brillance naturelle.",
    price: "À partir de 55 €",
    imageAlt: "Rituel soin mains ADORE Strasbourg",
  },
];

// ─── Variants Framer Motion réutilisables ─────────────────────
export const motionVariants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  staggerContainer: {
    hidden:  {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
} as const;
