"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, siteConfig } from "@/lib/config";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isTransparent = !scrolled && !menuOpen;

  return (
    <>
      {/* ─── Barre de navigation ──────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          background: isTransparent ? "transparent" : "rgba(250,250,250,0.96)",
          backdropFilter: isTransparent ? "none" : "blur(20px)",
          WebkitBackdropFilter: isTransparent ? "none" : "blur(20px)",
          boxShadow: scrolled ? "0 1px 0 rgba(232,213,206,0.4)" : "none",
          transition: "background 0.5s ease, box-shadow 0.5s ease",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Logo desktop / Texte ADORE mobile */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 0,
          }}
          aria-label="Retour en haut"
        >
          {/* Desktop : logo image */}
          <Image
            src="/logo.png"
            alt="ADORE"
            width={36}
            height={44}
            className="desktop-only-block"
            style={{
              objectFit: "contain",
              filter: isTransparent ? "brightness(0) invert(1)" : "none",
            }}
            priority
          />
          {/* Mobile : texte ADORE — positionné en absolu pour être vraiment centré */}
          <span
            className="mobile-only"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "22px",
              fontWeight: 300,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: isTransparent ? "#FFFFFF" : "#111111",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Adore
          </span>
        </button>

        {/* ─── Links desktop uniquement ─────────────────────── */}
        <ul
          style={{
            display: "flex",
            gap: "40px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="desktop-only"
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => scrollTo(item.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: isTransparent ? "rgba(255,255,255,0.82)" : "#7A6E6B",
                  transition: "color 0.3s",
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#C4998C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isTransparent
                    ? "rgba(255,255,255,0.82)"
                    : "#7A6E6B";
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ─── CTA desktop uniquement ───────────────────────── */}
        <a
          href={siteConfig.planityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="desktop-only-inline"
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 300,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            border: `1px solid ${isTransparent ? "rgba(255,255,255,0.5)" : "#D9BDB4"}`,
            color: isTransparent ? "rgba(255,255,255,0.9)" : "#111111",
            padding: "11px 24px",
            textDecoration: "none",
            background: "transparent",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E8D5CE";
            e.currentTarget.style.borderColor = "#E8D5CE";
            e.currentTarget.style.color = "#111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = isTransparent
              ? "rgba(255,255,255,0.5)"
              : "#D9BDB4";
            e.currentTarget.style.color = isTransparent
              ? "rgba(255,255,255,0.9)"
              : "#111111";
          }}
        >
          Prendre Rendez-vous
        </a>

        {/* ─── Hamburger mobile uniquement ──────────────────── */}
        <button
          className="mobile-only"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fermer" : "Menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <motion.span
            animate={
              menuOpen
                ? { rotate: 45, y: 7, width: 24, background: "#111111" }
                : {
                    rotate: 0,
                    y: 0,
                    width: 24,
                    background: isTransparent ? "#fff" : "#111111",
                  }
            }
            transition={{ duration: 0.28 }}
            style={{ display: "block", height: 1, transformOrigin: "center" }}
          />
          <motion.span
            animate={
              menuOpen
                ? { opacity: 0, x: -6 }
                : {
                    opacity: 1,
                    x: 0,
                    background: isTransparent ? "#fff" : "#111111",
                  }
            }
            transition={{ duration: 0.18 }}
            style={{
              display: "block",
              width: 18,
              height: 1,
              background: isTransparent ? "#fff" : "#111111",
            }}
          />
          <motion.span
            animate={
              menuOpen
                ? { rotate: -45, y: -7, width: 24, background: "#111111" }
                : {
                    rotate: 0,
                    y: 0,
                    width: 24,
                    background: isTransparent ? "#fff" : "#111111",
                  }
            }
            transition={{ duration: 0.28 }}
            style={{ display: "block", height: 1, transformOrigin: "center" }}
          />
        </button>
      </motion.nav>

      {/* ─── Menu mobile plein écran ──────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 800,
              background: "#F4EEEB",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              overflowY: "auto",
            }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + i * 0.07,
                  duration: 0.45,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <button
                  onClick={() => scrollTo(item.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(36px, 10vw, 56px)",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: "#111111",
                    padding: "10px 0",
                    display: "block",
                  }}
                >
                  {item.label}
                </button>
              </motion.div>
            ))}

            <motion.a
              href={siteConfig.planityUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              style={{
                marginTop: "28px",
                fontSize: "10px",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                background: "#111111",
                color: "#FAFAFA",
                padding: "15px 44px",
                textDecoration: "none",
              }}
            >
              Prendre Rendez-vous
            </motion.a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: "24px",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#7A6E6B",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
              }}
            >
              10 Rue Kuhn · Strasbourg
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
