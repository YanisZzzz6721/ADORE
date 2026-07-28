"use client";

import { useSiteData } from "@/hooks/useSiteData";

export type { SiteImages } from "@/lib/site-data";

/**
 * Quoi  : expose les photos éditables du site (accueil, maison, prestations, galerie).
 * Input : aucun.
 * Output: { images, loading }.
 * Effets: déclenche le chargement partagé des données du site.
 */
export function useSiteImages() {
  const { images, loading } = useSiteData();
  return { images, loading };
}
