"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { siteConfig } from "@/lib/config";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

type Avis = {
  id: string;
  note: number;
  date: string;
  texte: string;
};

const AVIS: Avis[] = [
  {
    id: "1",
    note: 5,
    date: "Juillet 2026",
    texte:
      "Toujours un plaisir de faire mes ongles chez Vard ! 7 ans que je reviens à chaque été pour ma mise à jour. Et le soin des pieds magique. Quel bonheur d'avoir enfin des pieds tout doux.",
  },
  {
    id: "2",
    note: 5,
    date: "Juillet 2026",
    texte:
      "Je suis très satisfaite de ma manucure pédicure, personnel au top qui excelle dans leur domaine. Je reviendrai sans hésiter et je le recommande fortement.",
  },
  {
    id: "3",
    note: 5,
    date: "Juillet 2026",
    texte:
      "Très bonne prestation, elle est minutieuse et professionnelle, on sent qu'elle est expérimentée. Le salon est très joli, je recommande.",
  },
];

function Etoiles({ note, size = 13 }: { note: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= note ? "#C4998C" : "none"}
          stroke="#C4998C"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TemoignagesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="temoignages"
      style={{
        background: "#F4EEEB",
        padding: "clamp(72px, 10vw, 120px) 0",
        overflowX: "clip",
      }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "0 clamp(20px, 5vw, 64px)",
          marginBottom: "clamp(48px, 7vw, 64px)",
        }}
      >
        <FadeInUp delay={0.05}>
          <span
            className="section-eyebrow"
            style={{
              marginBottom: "18px",
            }}
          >
            04 — Témoignages
          </span>
        </FadeInUp>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "clamp(20px, 4vw, 40px)",
          }}
        >
          <AnimatedText
            text="Ce que disent nos clientes"
            tag="h2"
            delay={0.1}
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(28px, 4vw, 58px)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.08,
              color: "#111111",
            }}
          />

          {/* Badge note globale */}
          <FadeInUp delay={0.2}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "#fff",
                padding: "20px 28px",
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(40px, 5vw, 52px)",
                    fontWeight: 300,
                    color: "#111111",
                    lineHeight: 1,
                  }}
                >
                  4.8
                </div>
                <Etoiles note={5} size={15} />
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#7A6E6B",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    textTransform: "uppercase",
                    marginTop: 8,
                  }}
                >
                  136 avis vérifiés
                </div>
              </div>
              <div style={{ width: 1, height: 56, background: "#E8D5CE" }} />
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    color: "#7A6E6B",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    marginBottom: 8,
                  }}
                >
                  Source
                </div>
                <a
                  href={siteConfig.planityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    fontWeight: 400,
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#111111",
                    textDecoration: "none",
                    borderBottom: "1px solid #C4998C",
                    paddingBottom: 2,
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#C4998C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#111111";
                  }}
                >
                  Planity →
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* ─── Carrousel d'avis ───────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "12px",
          padding: "0 clamp(20px, 5vw, 64px)",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {AVIS.map((avis, i) => (
          <motion.div
            key={avis.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.75, delay: i * 0.1, ease: EASE }}
            style={{
              background: "#FFFFFF",
              padding: "clamp(24px, 3vw, 36px) clamp(20px, 2.5vw, 32px)",
              minWidth: "min(calc(100vw - 40px), 340px)",
              maxWidth: 400,
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            {/* Barre rose en haut */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "#E8D5CE",
              }}
            />

            {/* Étoiles */}
            <Etoiles note={avis.note} />

            {/* Texte */}
            <p
              style={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontSize: "14px",
                lineHeight: 1.8,
                fontWeight: 300,
                color: "#3A3A3A",
                flex: 1,
                margin: 0,
              }}
            >
              &ldquo;{avis.texte}&rdquo;
            </p>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #F0E8E4",
                paddingTop: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#F4EEEB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4998C"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#7A6E6B",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                  }}
                >
                  Cliente vérifiée
                </span>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: "#C4998C",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  letterSpacing: "0.12em",
                }}
              >
                {avis.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Indicateur scroll mobile ───────────────────────── */}
      <FadeInUp delay={0.4}>
        <p
          className="mobile-only"
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C4998C",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            opacity: 0.55,
          }}
        >
          ← Glisser pour voir plus →
        </p>
      </FadeInUp>
    </section>
  );
}
