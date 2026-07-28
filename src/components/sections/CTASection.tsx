"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import FadeInUp from "@/components/ui/FadeInUp";
import AnimatedText from "@/components/ui/AnimatedText";
import { siteConfig } from "@/lib/config";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative", minHeight: "75vh",
        display: "flex", alignItems: "center",
        justifyContent: "center", overflow: "hidden",
      }}
    >
      {/* ─── Fond avec parallax ───────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute", inset: "-15%", y: bgY,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1800&q=80"
          alt="ADORE Rendez-vous"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(232,213,206,0.72) 0%, rgba(17,17,17,0.5) 100%)",
        }} />
      </motion.div>

      {/* ─── Contenu ──────────────────────────────────────────── */}
      <div style={{ position: "relative", textAlign: "center", padding: "80px 40px" }}>
        <FadeInUp delay={0.05}>
          <div style={{
            width: 1, height: 48,
            background: "rgba(17,17,17,0.25)",
            margin: "0 auto 28px",
          }} />
        </FadeInUp>

        <AnimatedText
          text="Offrez-vous un moment ADORE"
          tag="h2"
          delay={0.1}
          stagger={0.05}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 5.5vw, 76px)",
            fontWeight: 300, letterSpacing: "0.05em",
            lineHeight: 1.12, color: "#111111",
            marginBottom: "16px",
          }}
        />

        <FadeInUp delay={0.3}>
          <p style={{
            fontSize: "11px",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(17,17,17,0.6)", marginBottom: "52px",
          }}>
            {siteConfig.address.street} · {siteConfig.address.city} · Sur rendez-vous
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <a
            href={siteConfig.planityUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontSize: "10px",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 300, letterSpacing: "0.25em",
              textTransform: "uppercase", textDecoration: "none",
              background: "#111111", color: "#FAFAFA",
              padding: "18px 60px", transition: "background 0.35s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C4998C"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#111111"; }}
          >
            Réserver mon rendez-vous
          </a>
        </FadeInUp>
      </div>
    </section>
  );
}
