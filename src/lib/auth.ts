import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE = "adore_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 h

/**
 * Quoi  : récupère le mot de passe admin servant aussi de clé de signature HMAC.
 * Input : aucun (lit process.env.ADMIN_PASSWORD).
 * Output: le secret.
 * Effets: aucun — lève une erreur explicite si la variable manque.
 */
function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD absent de l'environnement — l'espace admin ne peut pas fonctionner.",
    );
  }
  return secret;
}

/**
 * Quoi  : compare deux chaînes en temps constant (anti timing-attack).
 * Input : deux chaînes.
 * Output: true si identiques.
 * Effets: aucun (fonction pure).
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Quoi  : signe une charge utile avec le secret admin.
 * Input : payload à signer.
 * Output: signature hexadécimale.
 * Effets: aucun (fonction pure hors lecture d'env).
 */
function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/**
 * Quoi  : vérifie le mot de passe saisi sur l'écran de connexion.
 * Input : candidate — valeur brute reçue du client (type non garanti).
 * Output: true si le mot de passe correspond.
 * Effets: aucun.
 */
export function checkPassword(candidate: unknown): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return safeEqual(candidate, getSecret());
}

/**
 * Quoi  : fabrique un jeton de session signé « expiration.signature ».
 * Input : aucun.
 * Output: le jeton à poser en cookie httpOnly.
 * Effets: aucun.
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

/**
 * Quoi  : valide un jeton de session (signature intacte et non expiré).
 * Input : token — valeur du cookie, éventuellement absente.
 * Output: true si la session est valide.
 * Effets: aucun.
 */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const separator = token.indexOf(".");
  if (separator <= 0) return false;

  const expiresRaw = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!signature) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  return safeEqual(signature, sign(expiresRaw));
}

/**
 * Quoi : vérifie que la requête d'écriture provient du même site.
 * Input : req — requête Next.js contenant les en-têtes Origin et Host.
 * Output : true si protocole et hôte correspondent exactement.
 * Effets de bord : aucun (fonction pure).
 */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = req.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim();
    const expectedHost =
      forwardedHost || req.headers.get("host") || req.nextUrl.host;
    const forwardedProtocol = req.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const expectedProtocol =
      forwardedProtocol || req.nextUrl.protocol.replace(":", "");

    return (
      originUrl.host === expectedHost &&
      originUrl.protocol === `${expectedProtocol}:`
    );
  } catch {
    return false;
  }
}

/**
 * Quoi : refuse une mutation sans en-tête Origin valide du site courant.
 * Input : req — requête entrante.
 * Output : null si l'origine est sûre, sinon une réponse HTTP 403.
 * Effets de bord : aucun.
 */
export function requireSameOrigin(req: NextRequest): NextResponse | null {
  if (isSameOrigin(req)) return null;

  return NextResponse.json(
    { error: "Origine de requête non autorisée." },
    { status: 403 },
  );
}

/**
 * Quoi  : garde-fou des routes d'écriture — bloque toute requête non authentifiée.
 * Input : req — la requête entrante.
 * Output: null si l'accès est autorisé, sinon la réponse d'erreur à renvoyer telle quelle.
 * Effets: aucun.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const invalidOrigin = requireSameOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD n'est pas configuré sur le serveur." },
      { status: 500 },
    );
  }

  if (!isValidSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json(
      { error: "Session expirée ou absente — reconnectez-vous." },
      { status: 401 },
    );
  }

  return null;
}
