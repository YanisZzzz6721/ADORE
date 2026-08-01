"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { useSiteImages } from "@/hooks/useSiteImages";

const PHOTOS = [
  { id: 1, label: "Réalisation", hint: "Tap pour agrandir" },
  { id: 2, label: "Réalisation", hint: "" },
  { id: 3, label: "Réalisation", hint: "" },
  { id: 4, label: "Réalisation", hint: "" },
  { id: 5, label: "Réalisation", hint: "" },
  { id: 6, label: "Réalisation", hint: "" },
];

const PH_COLORS = [
  "linear-gradient(135deg,#E8D5CE,#F4EEEB)",
  "linear-gradient(135deg,#D9BDB4,#E8D5CE)",
  "linear-gradient(135deg,#F4EEEB,#EDE4E0)",
  "linear-gradient(135deg,#E0CEC8,#EDE4E0)",
  "linear-gradient(135deg,#EDE4E0,#F4EEEB)",
  "linear-gradient(135deg,#E8D5CE,#D9BDB4)",
];

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function GalerieSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { images } = useSiteImages();

  return (
    <section
      id="galerie"
      style={{ background: "#FFFFFF", padding: "clamp(72px, 10vw, 120px) 0" }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "0 clamp(20px, 5vw, 64px)",
          marginBottom: "clamp(40px, 6vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <FadeInUp delay={0.05}>
            <span
              className="section-eyebrow"
              style={{
                marginBottom: "18px",
              }}
            >
              03 — Galerie
            </span>
          </FadeInUp>
          <AnimatedText
            text="Nos Réalisations"
            tag="h2"
            delay={0.1}
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(28px, 4vw, 58px)",
              fontWeight: 300,
              letterSpacing: "0.06em",
              color: "#111111",
            }}
          />
        </div>
        <FadeInUp delay={0.2}>
          <a
            href="https://www.instagram.com/adore.nails.strasbourg"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C4998C",
              textDecoration: "none",
              borderBottom: "1px solid rgba(196,153,140,0.4)",
              paddingBottom: "3px",
            }}
          >
            Instagram →
          </a>
        </FadeInUp>
      </div>

      {/* ─── Grille responsive ──────────────────────────────── */}
      {/* Desktop : grille mosaïque asymétrique */}
      <div
        className="desktop-md-grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
          gridTemplateRows: "260px 263px",
          gap: "3px",
          padding: "0 3px",
        }}
      >
        {[
          { style: { gridColumn: "1/3", gridRow: "1/2" }, idx: 0 },
          { style: { gridColumn: "3/4", gridRow: "1/3" }, idx: 1 },
          { style: { gridColumn: "4/5", gridRow: "1/2" }, idx: 2 },
          { style: { gridColumn: "1/2", gridRow: "2/3" }, idx: 3 },
          { style: { gridColumn: "4/5", gridRow: "2/3" }, idx: 4 },
        ].map((cell, i) => {
          const src = images.galerie[cell.idx];
          return (
            <motion.div
              key={i}
              style={{
                ...cell.style,
                overflow: "hidden",
                position: "relative",
                background: PH_COLORS[i],
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {src ? (
                <Image
                  src={src}
                  alt={`Réalisation ${cell.idx + 1}`}
                  fill
                  sizes="(max-width: 767px) 50vw, 40vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    transform: hovered === i ? "scale(1.04)" : "scale(1)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4998C"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.26em",
                      color: "#C4998C",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                    }}
                  >
                    Photo
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile : grille 2 colonnes simple */}
      <div
        className="mobile-md-only"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px",
          padding: "0 3px",
        }}
      >
        {PHOTOS.map((photo, i) => {
          const src = images.galerie[i];
          return (
            <motion.div
              key={photo.id}
              style={{
                height: 160,
                overflow: "hidden",
                position: "relative",
                background: PH_COLORS[i % PH_COLORS.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            >
              {src ? (
                <Image
                  src={src}
                  alt={`Réalisation ${i + 1}`}
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4998C"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.22em",
                      color: "#C4998C",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                    }}
                  >
                    Photo
                  </span>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <FadeInUp delay={0.3}>
        <div
          style={{
            textAlign: "center",
            marginTop: "48px",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <a
            href="https://www.instagram.com/adore.nails.strasbourg"
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
              border: "1px solid #D9BDB4",
              color: "#111111",
              padding: "14px clamp(24px, 5vw, 44px)",
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
            Voir toutes nos créations
          </a>
        </div>
      </FadeInUp>
    </section>
  );
}
