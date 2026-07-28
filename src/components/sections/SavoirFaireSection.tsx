"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { serviceCategories, siteConfig } from "@/lib/config";
import { useSiteImages } from "@/hooks/useSiteImages";
import type { ServiceCategory } from "@/types";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/** Carte d'une catégorie de prestations avec sa liste de soins.
 * Quoi  : affiche le titre, sous-titre et la liste des services avec prix alignés.
 * Input : category (ServiceCategory), index (pour le stagger), planityUrl.
 * Output: JSX — colonne blanche avec liste élégante style menu.
 * Effets: aucun (fonction pure).
 */
function CategoryCard({
  category,
  index,
  planityUrl,
  imageSrc,
}: {
  category: ServiceCategory;
  index: number;
  planityUrl: string;
  imageSrc: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.85, delay: index * 0.18, ease: EASE }}
      style={{
        background: "#FFFFFF",
        padding: "clamp(40px, 5vw, 56px) clamp(28px, 4vw, 48px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Photo de la prestation */}
      <div
        style={{
          position: "relative",
          height: 220,
          marginBottom: 28,
          overflow: "hidden",
          background: "#F4EEEB",
          flexShrink: 0,
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={category.label}
            fill
            unoptimized
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
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
                fontSize: 9,
                letterSpacing: "0.26em",
                color: "#C4998C",
                textTransform: "uppercase",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
              }}
            >
              Photo à venir
            </span>
          </div>
        )}
      </div>

      {/* Numéro + label catégorie */}
      <div style={{ marginBottom: "28px" }}>
        <span
          style={{
            display: "block",
            fontSize: "13px",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C4998C",
            marginBottom: "16px",
          }}
        >
          {category.num} — {category.label}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            color: "#111111",
            marginBottom: "10px",
          }}
        >
          {category.title}
        </h3>
        <p
          style={{
            fontSize: "12px",
            lineHeight: 1.75,
            color: "#7A6E6B",
            fontWeight: 300,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
          }}
        >
          {category.subtitle}
        </p>
      </div>

      {/* Séparateur */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#F0E8E4",
          marginBottom: "28px",
        }}
      />

      {/* Liste de services style menu */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, flex: 1 }}>
        {category.items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: index * 0.18 + i * 0.07,
              ease: EASE,
            }}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "12px",
              padding: "13px 0",
              borderBottom: "1px solid #F8F3F1",
            }}
          >
            {/* Nom + durée */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "#111111",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "#C4998C",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  letterSpacing: "0.18em",
                }}
              >
                {item.duration}
              </span>
            </div>

            {/* Prix */}
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "18px",
                fontWeight: 300,
                color: "#C4998C",
                letterSpacing: "0.04em",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {item.price}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Réserver */}
      <div style={{ marginTop: "32px" }}>
        <a
          href={planityUrl}
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
            padding: "12px 28px",
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
          Prendre rendez-vous
        </a>
      </div>
    </motion.div>
  );
}

export default function SavoirFaireSection() {
  const { images } = useSiteImages();

  const PRESTATION_IMAGES: Record<string, string | null> = {
    "beaute-mains": images.prestation_mains,
    "beaute-pieds": images.prestation_pieds,
  };

  return (
    <section
      id="savoir-faire"
      style={{
        background: "#F4EEEB",
        padding: "clamp(72px, 10vw, 120px) clamp(20px, 5vw, 64px)",
      }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
        <FadeInUp delay={0.05}>
          <span
            style={{
              display: "block",
              fontSize: "13px",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C4998C",
              marginBottom: "18px",
            }}
          >
            02 — Savoir-Faire
          </span>
        </FadeInUp>
        <AnimatedText
          text="Nos prestations d'exception"
          tag="h2"
          delay={0.1}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(28px, 4vw, 58px)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.08,
            color: "#111111",
            marginBottom: "24px",
          }}
        />
        <FadeInUp delay={0.25}>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 17px)",
              lineHeight: 1.75,
              color: "#7A6E6B",
              maxWidth: 560,
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.01em",
            }}
          >
            Chaque soin est un rituel pensé pour sublimer votre beauté avec
            précision et raffinement.
          </p>
        </FadeInUp>
      </div>

      {/* ─── Grille 2 catégories ─────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "3px",
        }}
      >
        {serviceCategories.map((category, i) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={i}
            planityUrl={siteConfig.planityUrl}
            imageSrc={PRESTATION_IMAGES[category.id] ?? null}
          />
        ))}
      </div>

      {/* ─── Note Nail Art ───────────────────────────────────── */}
      <FadeInUp delay={0.3}>
        <div
          style={{
            marginTop: "clamp(32px, 5vw, 56px)",
            padding: "clamp(36px, 5vw, 52px) clamp(28px, 4vw, 48px)",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(24px, 4vw, 56px)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "min(100%, 260px)" }}>
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.3em",
                color: "#C4998C",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              III — Nail Art sur Mesure
            </span>
            <p
              style={{
                fontSize: "clamp(15px, 1.6vw, 17px)",
                lineHeight: 1.75,
                color: "#7A6E6B",
                fontWeight: 300,
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontStyle: "italic",
                maxWidth: 480,
              }}
            >
              Créations personnalisées : motifs floraux, ombré, french twist,
              nail art 3D. Tarifs sur devis — contactez-nous via Instagram.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                flex: "1 1 140px",
                fontSize: "10px",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C4998C",
                textDecoration: "none",
                border: "1px solid rgba(196,153,140,0.5)",
                padding: "12px 24px",
                transition: "all 0.35s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F4EEEB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Instagram →
            </a>
            <a
              href={siteConfig.planityUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                flex: "1 1 140px",
                fontSize: "10px",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                background: "#111111",
                color: "#FAFAFA",
                padding: "12px 28px",
                transition: "background 0.35s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C4998C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#111111";
              }}
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
