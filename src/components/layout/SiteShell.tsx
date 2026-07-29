"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import FloatingCTA from "@/components/ui/FloatingCTA";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

/**
 * Quoi : affiche le chrome du site public uniquement hors de l'espace admin.
 * Input : children — contenu de la route courante.
 * Output : contenu seul dans /admin, sinon contenu entouré de la navigation publique.
 * Effets de bord : monte les interactions de navigation, CTA et curseur sur le site public.
 */
export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return <>{children}</>;

  return (
    <SmoothScroll>
      <Navigation />
      {children}
      <FloatingCTA />
      <CustomCursor />
    </SmoothScroll>
  );
}
