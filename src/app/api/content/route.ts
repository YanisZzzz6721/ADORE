import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readSiteContent, writeSiteContent } from "@/lib/storage";
import { TEXT_FIELDS, type SiteContent } from "@/lib/site-data";

export const dynamic = "force-dynamic";

const MAX_FIELD_LENGTH = 2000;

/**
 * Quoi  : extrait des champs texte valides d'un corps de requête non fiable.
 * Input : body — JSON décodé, de forme inconnue.
 * Output: { updates } si tout est valide, { error } sinon.
 * Effets: aucun (fonction pure).
 */
function parseUpdates(
  body: unknown,
): { updates: Partial<SiteContent> } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Corps de requête invalide." };
  }

  const source = body as Record<string, unknown>;
  const updates: Partial<SiteContent> = {};

  for (const field of TEXT_FIELDS) {
    const value = source[field];
    if (value === undefined) continue;

    if (typeof value !== "string") {
      return { error: `Le champ « ${field} » doit être du texte.` };
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { error: `Le champ « ${field} » ne peut pas être vide.` };
    }
    if (trimmed.length > MAX_FIELD_LENGTH) {
      return {
        error: `Le champ « ${field} » dépasse ${MAX_FIELD_LENGTH} caractères.`,
      };
    }

    updates[field] = trimmed;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "Aucun champ modifiable fourni." };
  }

  return { updates };
}

/**
 * Quoi  : renvoie les textes éditables courants.
 * Input : aucun.
 * Output: l'objet SiteContent complet.
 * Effets: lecture Vercel Blob ou disque.
 */
export async function GET() {
  try {
    return NextResponse.json(await readSiteContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[content] lecture impossible :", error);
    return NextResponse.json(
      { error: "Lecture des textes impossible." },
      { status: 500 },
    );
  }
}

/**
 * Quoi  : met à jour les textes du site depuis l'admin.
 * Input : JSON partiel limité aux champs de TEXT_FIELDS + cookie de session valide.
 * Output: { ok: true, content } avec le contenu enregistré.
 * Effets: écriture Vercel Blob (ou disque en local).
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON illisible." }, { status: 400 });
  }

  const parsed = parseUpdates(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const current = await readSiteContent();
    const next = { ...current, ...parsed.updates };
    await writeSiteContent(next);
    return NextResponse.json({ ok: true, content: next });
  } catch (error) {
    console.error("[content] écriture impossible :", error);
    return NextResponse.json(
      { error: "Enregistrement impossible — réessayez dans un instant." },
      { status: 500 },
    );
  }
}
