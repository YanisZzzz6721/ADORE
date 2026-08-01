"use client";

import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { siteConfig } from "@/lib/config";

export default function ContactSection() {
  return (
    <section id="contact" style={{ background: "#F4EEEB" }}>
      <div
        style={{
          padding: "clamp(72px, 10vw, 120px) clamp(20px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          gap: "clamp(48px, 6vw, 80px)",
          alignItems: "start",
        }}
      >
        {/* ─── Infos ──────────────────────────────────────────── */}
        <div>
          <FadeInUp delay={0.05}>
            <span
              className="section-eyebrow"
              style={{
                marginBottom: "28px",
              }}
            >
              04 — Nous Trouver
            </span>
          </FadeInUp>

          <AnimatedText
            text="Venez nous rendre visite"
            tag="h2"
            delay={0.1}
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(26px, 3.5vw, 50px)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              color: "#111111",
              marginBottom: "36px",
            }}
          />

          <FadeInUp delay={0.25}>
            <div>
              {/* Adresse */}
              {[
                siteConfig.address.street,
                siteConfig.address.complement,
                `${siteConfig.address.postalCode} ${siteConfig.address.city}`,
              ]
                .filter(Boolean)
                .map((line, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "14px",
                      lineHeight: 2,
                      color: "#7A6E6B",
                      fontWeight: 300,
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                    }}
                  >
                    {line}
                  </p>
                ))}

              {/* Horaires */}
              <div style={{ marginTop: "32px", marginBottom: "28px" }}>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    color: "#C4998C",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    marginBottom: "14px",
                  }}
                >
                  Horaires
                </p>
                {siteConfig.hours.map((h) => (
                  <div
                    key={h.day}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(217,189,180,0.3)",
                      padding: "8px 0",
                      maxWidth: 300,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#7A6E6B",
                        fontFamily: "var(--font-jost), system-ui, sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {h.day}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: h.closed ? "#C4A0A0" : "#111111",
                        fontFamily: "var(--font-jost), system-ui, sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h.closed ? "Fermé" : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Liens */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "36px",
                }}
              >
                {[
                  {
                    label: "@adore.nails.strasbourg",
                    href: siteConfig.instagram,
                  },
                  {
                    label: "Réserver sur Planity →",
                    href: siteConfig.planityUrl,
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "12px",
                      color: "#C4998C",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.06em",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(196,153,140,0.3)",
                      paddingBottom: "2px",
                      width: "fit-content",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

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
                  padding: "15px 36px",
                  transition: "background 0.35s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C4998C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111111";
                }}
              >
                Prendre Rendez-vous
              </a>
            </div>
          </FadeInUp>
        </div>

        {/* ─── Carte ──────────────────────────────────────────── */}
        <FadeInUp delay={0.2}>
          <div
            style={{
              width: "100%",
              minHeight: "clamp(260px, 40vw, 420px)",
              overflow: "hidden",
              border: "1px solid rgba(217,189,180,0.5)",
            }}
          >
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`,
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
                minHeight: "clamp(260px, 40vw, 420px)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`ADORE — ${siteConfig.address.street}, ${siteConfig.address.city}`}
            />
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
