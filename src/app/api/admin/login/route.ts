import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// Limitation anti force brute. En serverless le compteur est propre à chaque
// instance : il ralentit une attaque sans la bloquer totalement. Le vrai
// rempart reste un mot de passe long.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Quoi  : compte les tentatives ratées d'une IP sur une fenêtre glissante.
 * Input : ip — identifiant de l'appelant.
 * Output: true si l'IP a dépassé le quota.
 * Effets: mutation de la table d'attaques en mémoire.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/**
 * Quoi  : identifie l'appelant à partir des en-têtes de proxy Vercel.
 * Input : req.
 * Output: l'IP, ou "inconnue" si aucun en-tête exploitable.
 * Effets: aucun.
 */
function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnue";
}

/**
 * Quoi  : authentifie la propriétaire et ouvre une session admin signée.
 * Input : JSON { password }.
 * Output: { ok: true } + cookie httpOnly, ou une erreur 401/429.
 * Effets: pose le cookie de session.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD n'est pas configuré sur le serveur." },
      { status: 500 },
    );
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Trop de tentatives — réessayez dans 10 minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON illisible." }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  if (!checkPassword(password)) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  attempts.delete(clientIp(req));

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}

/**
 * Quoi  : ferme la session admin.
 * Input : aucun.
 * Output: { ok: true }.
 * Effets: supprime le cookie de session.
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
