"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [showTop,  setShowTop]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > window.innerHeight * 0.6);
      setShowTop(y > window.innerHeight * 1.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = (window as typeof window & { lenis?: { scrollTo: (target: number, opts: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "clamp(16px, 4vw, 36px)",
        right: "clamp(16px, 4vw, 36px)",
        zIndex: 800,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      {/* Scroll-to-top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={scrollToTop}
            aria-label="Remonter en haut"
            style={{
              width: "44px",
              height: "44px",
              border: "1px solid #D9BDB4",
              background: "#FAFAFA",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#E8D5CE";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8D5CE";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#FAFAFA";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#D9BDB4";
            }}
          >
            {/* Flèche haut */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M2 7l5-5 5 5" stroke="#7A6E6B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bouton RDV flottant */}
      <AnimatePresence>
        {visible && (
          <motion.a
            key="floating-rdv"
            href={siteConfig.planityUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: "inline-block",
              background: "#111111",
              color: "#FAFAFA",
              fontSize: "9px",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "14px 24px",
              boxShadow: "0 4px 24px rgba(17,17,17,0.18)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#C4998C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#111111";
            }}
          >
            Rendez-vous →
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
