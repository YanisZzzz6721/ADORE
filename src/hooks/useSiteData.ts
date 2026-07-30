"use client";

import {
  createContext,
  createElement,
  useContext,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  type SiteData,
} from "@/lib/site-data";

const FALLBACK: SiteData = {
  images: DEFAULT_IMAGES,
  content: DEFAULT_CONTENT,
};

let inFlight: Promise<SiteData> | null = null;
const SiteDataContext = createContext<SiteData | null>(null);

/**
 * Quoi : partage les données récupérées côté serveur avec toutes les sections.
 * Input : initialData — données Blob du rendu initial ; children — sections du site.
 * Output : fournisseur de contexte React.
 * Effets de bord : initialise un contexte React partagé.
 */
export function SiteDataProvider({
  initialData,
  children,
}: {
  initialData: SiteData;
  children: ReactNode;
}) {
  return createElement(
    SiteDataContext.Provider,
    { value: initialData },
    children,
  );
}

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
 * Quoi : expose les données déjà injectées par le rendu serveur.
 * Input : aucun.
 * Output : images, textes et loading=false.
 * Effets de bord : lit le contexte React courant.
 */
export function useSiteData() {
  const data = useContext(SiteDataContext);
  return { ...(data ?? FALLBACK), loading: false };
}
