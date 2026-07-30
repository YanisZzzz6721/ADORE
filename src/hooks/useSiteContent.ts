"use client";

import { useSiteData } from "@/hooks/useSiteData";

export type { SiteContent } from "@/lib/site-data";

/**
 * Quoi  : expose les textes éditables du site (tagline, citation, La Maison).
 * Input : aucun.
 * Output: { content, loading }.
 * Effets: lit le contexte partagé des données du site.
 */
export function useSiteContent() {
  const { content, loading } = useSiteData();
  return { content, loading };
}
