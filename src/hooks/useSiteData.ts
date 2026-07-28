"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  type SiteData,
} from "@/lib/site-data";

const FALLBACK: SiteData = {
  images: DEFAULT_IMAGES,
  content: DEFAULT_CONTENT,
};

// Cinq composants consomment ces données : on mémorise la promesse pour ne
// déclencher qu'un seul appel réseau par chargement de page.
let inFlight: Promise<SiteData> | null = null;

/**
 * Quoi  : charge (une seule fois) les images et textes du site depuis l'API.
 * Input : force — true pour ignorer le cache mémoire après une modification admin.
 * Output: les données du site, complétées par les valeurs par défaut.
 * Effets: GET /api/site-data ; ne rejette jamais — retombe sur les défauts.
 */
export function loadSiteData(force = false): Promise<SiteData> {
  if (force) inFlight = null;

  if (!inFlight) {
    inFlight = fetch("/api/site-data")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Partial<SiteData>) => ({
        images: { ...DEFAULT_IMAGES, ...data.images },
        content: { ...DEFAULT_CONTENT, ...data.content },
      }))
      .catch((error) => {
        // Le site doit rester affichable même si l'API est indisponible.
        console.error("[site-data] chargement impossible :", error);
        inFlight = null;
        return FALLBACK;
      });
  }

  return inFlight;
}

/**
 * Quoi  : expose les données du site à un composant React.
 * Input : aucun.
 * Output: { images, content, loading }.
 * Effets: déclenche loadSiteData au montage.
 */
export function useSiteData() {
  const [data, setData] = useState<SiteData>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadSiteData().then((loaded) => {
      if (!mounted) return;
      setData(loaded);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { ...data, loading };
}
