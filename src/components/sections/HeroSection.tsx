"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useSiteImages } from "@/hooks/useSiteImages";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { images } = useSiteImages();
  const { content } = useSiteContent();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
      }}
    >
      {/* ─── Fond + parallax ────────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          top: "-10%",
          left: 0,
          right: 0,
          bottom: "-10%",
          y: bgY,
        }}
      >
        <Image
          src={images.hero}
          alt="ADORE — Maison de Manucure Strasbourg"
          fill
          preload
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(17,17,17,0.22) 0%,rgba(17,17,17,0.52) 55%,rgba(17,17,17,0.68) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 35% 65%, rgba(232,213,206,0.12) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* ─── Coins décoratifs desktop ───────────────────────── */}
      <motion.div
        className="desktop-md-only"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4, ease: EASE }}
        style={{
          position: "absolute",
          top: 100,
          left: 56,
          width: 64,
          height: 64,
          borderTop: "1px solid rgba(232,213,206,0.38)",
          borderLeft: "1px solid rgba(232,213,206,0.38)",
        }}
      />
      <motion.div
        className="desktop-md-only"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4, ease: EASE }}
        style={{
          position: "absolute",
          bottom: 72,
          right: 56,
          width: 64,
          height: 64,
          borderBottom: "1px solid rgba(232,213,206,0.38)",
          borderRight: "1px solid rgba(232,213,206,0.38)",
        }}
      />

      {/* ─── Contenu central ────────────────────────────────── */}
      <motion.div
        style={{
          position: "relative",
          textAlign: "center",
          y: contentY,
          opacity,
          padding: "0 24px",
          width: "100%",
        }}
      >
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "clamp(20px, 4vw, 32px)",
          }}
        >
          <span
            style={{
              display: "block",
              width: 28,
              height: 1,
              background: "rgba(232,213,206,0.45)",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: "0.52em",
              textTransform: "uppercase",
              color: "rgba(232,213,206,0.85)",
            }}
          >
            Maison de Manucure · Strasbourg
          </span>
          <span
            style={{
              display: "block",
              width: 28,
              height: 1,
              background: "rgba(232,213,206,0.45)",
            }}
          />
        </motion.div>

        {/* Logo centré */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "clamp(16px, 3vw, 24px)",
          }}
        >
          <Image
            src="/logo.png"
            alt="ADORE"
            width={160}
            height={274}
            loading="eager"
            style={{
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              opacity: 0.93,
              width: "clamp(110px, 22vw, 180px)",
              height: "auto",
            }}
          />
        </motion.div>

        {/* Tagline italique */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(16px, 2.4vw, 26px)",
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: "0.14em",
            color: "rgba(232,213,206,0.82)",
            marginBottom: "clamp(40px, 6vw, 56px)",
          }}
        >
          {content.hero_tagline}
        </motion.p>

        {/* CTA */}
        <motion.a
          href={siteConfig.planityUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 300,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "1px solid rgba(232,213,206,0.55)",
            color: "#FAFAFA",
            padding: "clamp(12px, 2vw, 16px) clamp(28px, 5vw, 52px)",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E8D5CE";
            e.currentTarget.style.borderColor = "#E8D5CE";
            e.currentTarget.style.color = "#111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(232,213,206,0.55)";
            e.currentTarget.style.color = "#FAFAFA";
          }}
        >
          Prendre Rendez-vous
        </motion.a>
      </motion.div>

      {/* ─── Indicateur scroll ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{
          position: "absolute",
          bottom: "clamp(20px, 4vw, 36px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(232,213,206,0.45)",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 40,
            background:
              "linear-gradient(to bottom, rgba(232,213,206,0.55), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
