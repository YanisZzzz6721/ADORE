import HeroSection from "@/components/sections/HeroSection";
import CitationStrip from "@/components/sections/CitationStrip";
import MaisonSection from "@/components/sections/MaisonSection";
import SavoirFaireSection from "@/components/sections/SavoirFaireSection";
import GalerieSection from "@/components/sections/GalerieSection";
import TemoignagesSection from "@/components/sections/TemoignagesSection";
import CTASection from "@/components/sections/CTASection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
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
  );
}
