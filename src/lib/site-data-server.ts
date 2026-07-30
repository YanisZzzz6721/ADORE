import "server-only";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { readSiteContent, readSiteImages } from "@/lib/storage";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  type SiteData,
} from "@/lib/site-data";

const SITE_DATA_CACHE_TAG = "site-data";

/**
 * Quoi : lit simultanément les images et textes éditables.
 * Input : aucun.
 * Output : données complètes du site.
 * Effets de bord : lectures Blob ou disque.
 */
async function readSiteData(): Promise<SiteData> {
  const [images, content] = await Promise.all([
    readSiteImages(),
    readSiteContent(),
  ]);
  return { images, content };
}

const getCachedSiteData = unstable_cache(
  readSiteData,
  ["site-data-v1"],
  {
    tags: [SITE_DATA_CACHE_TAG],
    revalidate: 3600,
  },
);

/**
 * Quoi : fournit les données Blob dès le rendu initial sans mettre en cache une
 *        panne transitoire du stockage.
 * Input : aucun.
 * Output : images et textes complets, ou valeurs locales de secours.
 * Effets de bord : lecture du cache/stockage et journalisation serveur en cas d'erreur.
 */
export async function getSiteDataForRender(): Promise<SiteData> {
  try {
    return await getCachedSiteData();
  } catch (error) {
    console.error("[site-data] lecture impossible :", error);
    return { images: DEFAULT_IMAGES, content: DEFAULT_CONTENT };
  }
}

/**
 * Quoi : invalide immédiatement les données et la page d'accueil après une édition.
 * Input : aucun.
 * Output : aucun.
 * Effets de bord : purge le cache Next.js associé au contenu public.
 */
export function invalidateSiteDataCache(): void {
  revalidateTag(SITE_DATA_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "page");
}
