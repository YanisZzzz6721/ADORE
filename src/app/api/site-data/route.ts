import { NextResponse } from "next/server";
import { readSiteImages, readSiteContent } from "@/lib/storage";
import { DEFAULT_CONTENT, DEFAULT_IMAGES } from "@/lib/site-data";

// Le contenu change à chaque modification depuis l'admin : jamais de cache.
export const dynamic = "force-dynamic";

/**
 * Quoi  : expose au site public les images et textes courants.
 * Input : aucun.
 * Output: { images, content } — toujours complet, jamais d'erreur bloquante.
 * Effets: lecture Vercel Blob (production) ou disque (développement).
 */
export async function GET() {
  try {
    const [images, content] = await Promise.all([
      readSiteImages(),
      readSiteContent(),
    ]);
    return NextResponse.json(
      { images, content },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Le site vitrine ne doit jamais casser à cause du stockage : on sert les
    // valeurs par défaut et on trace l'incident côté serveur.
    console.error("[site-data] lecture impossible :", error);
    return NextResponse.json(
      { images: DEFAULT_IMAGES, content: DEFAULT_CONTENT },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
