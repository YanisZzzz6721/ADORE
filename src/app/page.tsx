import HeroSection from "@/components/sections/HeroSection";
import CitationStrip from "@/components/sections/CitationStrip";
import MaisonSection from "@/components/sections/MaisonSection";
import SavoirFaireSection from "@/components/sections/SavoirFaireSection";
import GalerieSection from "@/components/sections/GalerieSection";
import TemoignagesSection from "@/components/sections/TemoignagesSection";
import CTASection from "@/components/sections/CTASection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import { SiteDataProvider } from "@/hooks/useSiteData";
import { getSiteDataForRender } from "@/lib/site-data-server";

export const dynamic = "force-dynamic";

/**
 * Quoi : rend l'accueil avec les images et textes Blob dès le premier HTML.
 * Input : aucun.
 * Output : page d'accueil complète.
 * Effets de bord : consulte le cache serveur des données éditables.
 */
export default async function Home() {
  const initialData = await getSiteDataForRender();

  return (
    <SiteDataProvider initialData={initialData}>
      <main>
        <HeroSection />
        <CitationStrip />
        <MaisonSection />
        <SavoirFaireSection />
        <GalerieSection />
        <TemoignagesSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </main>
    </SiteDataProvider>
  );
}
