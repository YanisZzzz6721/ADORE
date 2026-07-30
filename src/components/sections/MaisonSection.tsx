"use client";

import RevealImage from "@/components/ui/RevealImage";
import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { siteConfig } from "@/lib/config";
import { useSiteImages } from "@/hooks/useSiteImages";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function MaisonSection() {
  const { images } = useSiteImages();
  const { content } = useSiteContent();
  return (
    <section id="maison">
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          minHeight: "clamp(600px, 92vh, 1000px)",
        }}
      >
        {/* ─── Image ────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            minHeight: "clamp(280px, 50vw, 700px)",
          }}
        >
          <RevealImage
            src={images.maison}
            alt="Salon ADORE — Maison de Manucure Strasbourg"
            fill
            delay={0.1}
            sizes="(max-width: 959px) 100vw, 50vw"
          />
          {/* Cadre ornemental — masqué sur mobile */}
          <div
            className="desktop-md-only"
            style={{
              position: "absolute",
              inset: 28,
              border: "1px solid rgba(232,213,206,0.3)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ─── Texte ────────────────────────────────────────── */}
        <div
          style={{
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            padding: "clamp(56px, 8vw, 100px) clamp(24px, 6vw, 80px)",
          }}
        >
          <div style={{ maxWidth: 460, width: "100%" }}>
            <FadeInUp delay={0.1}>
              <span
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#C4998C",
                  marginBottom: "28px",
                }}
              >
                01 — La Maison
              </span>
            </FadeInUp>

            <AnimatedText
              text="Un sanctuaire dédié à l'élégance des mains"
              tag="h2"
              delay={0.15}
              stagger={0.06}
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(28px, 4vw, 58px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "0.03em",
                color: "#111111",
                marginBottom: "32px",
              }}
            />

            <FadeInUp delay={0.3}>
              <p
                style={{
                  fontSize: "clamp(13px, 1.5vw, 14px)",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 300,
                  lineHeight: 2,
                  color: "#7A6E6B",
                  marginBottom: "16px",
                  letterSpacing: "0.01em",
                }}
              >
                {content.maison_p1}
              </p>
              <p
                style={{
                  fontSize: "clamp(13px, 1.5vw, 14px)",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 300,
                  lineHeight: 2,
                  color: "#7A6E6B",
                  marginBottom: "40px",
                  letterSpacing: "0.01em",
                }}
              >
                {content.maison_p2}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.45}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="#savoir-faire"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#savoir-faire")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-block",
                    fontSize: "10px",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    border: "1px solid #D9BDB4",
                    color: "#111111",
                    padding: "13px 28px",
                    transition: "all 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8D5CE";
                    e.currentTarget.style.borderColor = "#E8D5CE";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "#D9BDB4";
                  }}
                >
                  Nos prestations
                </a>
                <a
                  href={siteConfig.planityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    fontSize: "10px",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    background: "#111111",
                    color: "#FAFAFA",
                    padding: "13px 28px",
                    transition: "background 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#C4998C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#111111";
                  }}
                >
                  Réserver
                </a>
              </div>
            </FadeInUp>

            {/* Chiffres clés */}
            <FadeInUp delay={0.55}>
              <div
                style={{
                  display: "flex",
                  gap: "clamp(24px, 5vw, 48px)",
                  marginTop: "48px",
                  paddingTop: "36px",
                  borderTop: "1px solid #F0E8E4",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { num: "5+", label: "ans d'expérience" },
                  { num: "100%", label: "sur rendez-vous" },
                  { num: "★★★★★", label: "avis clients" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize: "clamp(22px, 3vw, 28px)",
                        fontWeight: 300,
                        color: "#C4998C",
                        letterSpacing: "0.04em",
                        marginBottom: "6px",
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#7A6E6B",
                        fontFamily: "var(--font-jost), system-ui, sans-serif",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
