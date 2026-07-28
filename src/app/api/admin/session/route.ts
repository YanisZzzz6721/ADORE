import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Quoi  : indique si le visiteur possède une session admin encore valide.
 * Input : cookie de session.
 * Output: { authenticated: boolean } — toujours 200, ce n'est pas une erreur d'être déconnecté.
 * Effets: aucun.
 *
 * Permet à la page admin de rester connectée après un rafraîchissement,
 * sans jamais stocker le mot de passe côté navigateur.
 */
export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return NextResponse.json({
    authenticated: isValidSessionToken(token),
    configured: true,
  });
}
