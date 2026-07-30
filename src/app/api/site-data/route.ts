import { NextResponse } from "next/server";
import { getSiteDataForRender } from "@/lib/site-data-server";

// Le contenu change à chaque modification depuis l'admin : jamais de cache.
export const dynamic = "force-dynamic";

/**
 * Quoi  : expose au site public les images et textes courants.
 * Input : aucun.
 * Output: { images, content } — toujours complet, jamais d'erreur bloquante.
 * Effets: lecture Vercel Blob (production) ou disque (développement).
 */
export async function GET() {
  const data = await getSiteDataForRender();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
