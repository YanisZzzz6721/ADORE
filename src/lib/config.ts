import type { SiteConfig, Service, ServiceCategory, NavItem } from "@/types";

// ─── Config centrale du site ──────────────────────────────────
export const siteConfig: SiteConfig = {
  name: "ADORE",
  tagline: "L'art de sublimer vos mains",
  description:
    "Maison de manucure haut de gamme au cœur de Strasbourg. Un sanctuaire dédié à l'élégance des mains.",
  address: {
    street: "10 Rue Kuhn",
    city: "Strasbourg",
    postalCode: "67000",
  },
  planityUrl: "https://www.planity.com/adore-your-nails-67000-strasbourg",
  instagram: "https://www.instagram.com/adore.nails.strasbourg",
  hours: [
    { day: "Lundi", open: "", close: "", closed: true },
    { day: "Mardi", open: "10:00", close: "19:00" },
    { day: "Mercredi", open: "10:00", close: "19:00" },
    { day: "Jeudi", open: "10:00", close: "19:00" },
    { day: "Vendredi", open: "10:00", close: "19:00" },
    { day: "Samedi", open: "10:00", close: "19:00" },
    { day: "Dimanche", open: "", close: "", closed: true },
  ],
};

// ─── Navigation ───────────────────────────────────────────────
export const navItems: NavItem[] = [
  { label: "La Maison", href: "#maison" },
  { label: "Savoir-Faire", href: "#savoir-faire" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" },
];

// ─── Catégories de prestations (données Planity réelles) ──────
export const serviceCategories: ServiceCategory[] = [
  {
    id: "beaute-mains",
    num: "I",
    label: "Beauté des Mains",
    title: "Manucure Russe",
    subtitle:
      "Technique de précision pour des cuticules impeccables et une tenue longue durée.",
    items: [
      {
        id: "mains-naturel",
        name: "Pose Complète Naturel",
        duration: "1h10",
        price: "45 €",
      },
      {
        id: "mains-couleur",
        name: "Pose Complète Couleur",
        duration: "1h10",
        price: "50 €",
      },
      {
        id: "mains-french",
        name: "Pose Complète French",
        duration: "1h10",
        price: "50 €",
      },
      {
        id: "mains-babyboomer",
        name: "Pose Complète Babyboomer",
        duration: "1h",
        price: "50 €",
      },
      {
        id: "mains-nail-art",
        name: "Pose Complète Nail Art",
        duration: "1h30",
        price: "Sur devis",
      },
    ],
  },
  {
    id: "beaute-pieds",
    num: "II",
    label: "Beauté des Pieds",
    title: "Pédicure Soin",
    subtitle:
      "Un rituel complet pour des pieds soignés, du traitement des callosités à la pose semi-permanente.",
    items: [
      {
        id: "pieds-soin-vernis",
        name: "Soin + Vernis Semi-Permanent",
        duration: "1h10",
        price: "50 €",
      },
      {
        id: "pieds-vernis",
        name: "Vernis Semi-Permanent seul",
        duration: "1h",
        price: "35 €",
      },
      {
        id: "pieds-callosites",
        name: "Traitement Anti-Callosités",
        duration: "30min",
        price: "20 €",
      },
      {
        id: "pieds-reparation",
        name: "Réparation / Extension Orteil",
        duration: "30min",
        price: "5 €",
      },
      {
        id: "pieds-full-set",
        name: "Pose Complète Pieds",
        duration: "1h10",
        price: "35 €",
      },
    ],
  },
];

// ─── Services héritage (compatibilité composants existants) ───
export const services: Service[] = [
  {
    id: "beaute-mains",
    num: "I",
    name: "Beauté des Mains",
    description:
      "Manucure Russe de précision : cuticules impeccables, pose complète couleur, french ou babyboomer. Résultat durable et finitions parfaites.",
    price: "À partir de 45 €",
  },
  {
    id: "beaute-pieds",
    num: "II",
    name: "Beauté des Pieds",
    description:
      "Soin pédicure complet : traitement anti-callosités, vernis semi-permanent et pose complète pour des pieds soignés et élégants.",
    price: "À partir de 20 €",
  },
  {
    id: "nail-art",
    num: "III",
    name: "Nail Art sur Mesure",
    description:
      "Créations personnalisées sur devis via Instagram. Motifs floraux, ombré, french twist — chaque ongle une œuvre unique.",
    price: "Sur devis Instagram",
  },
];

// ─── Variants Framer Motion réutilisables ─────────────────────
export const motionVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
} as const;
