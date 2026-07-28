"use client";

import FadeInUp from "@/components/ui/FadeInUp";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function CitationStrip() {
  const { content } = useSiteContent();

  return (
    <section style={{ background: "#F4EEEB", overflow: "hidden" }}>
      <div
        style={{
          padding: "clamp(48px, 8vw, 80px) clamp(24px, 6vw, 64px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(24px, 5vw, 60px)",
          maxWidth: "100%",
        }}
      >
        {/* Ligne décorative */}
        <FadeInUp delay={0.1}>
          <div
            style={{
              flexShrink: 0,
              width: 1,
              height: 72,
              background: "#D9BDB4",
            }}
          />
        </FadeInUp>

        {/* Citation */}
        <FadeInUp delay={0.2} style={{ flex: 1, minWidth: 0 }}>
          <blockquote
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(17px, 2.4vw, 34px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#111111",
              lineHeight: 1.55,
              letterSpacing: "0.02em",
            }}
          >
            «&nbsp;{content.citation}&nbsp;»
          </blockquote>
        </FadeInUp>

        {/* Signature verticale — cachée sur mobile */}
        <FadeInUp delay={0.35}>
          <span
            className="desktop-only-block"
            style={{
              writingMode: "vertical-rl",
              fontSize: "9px",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "#C4998C",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              flexShrink: 0,
              display: "block",
            }}
          >
            ADORE · Strasbourg
          </span>
        </FadeInUp>
      </div>
    </section>
  );
}
