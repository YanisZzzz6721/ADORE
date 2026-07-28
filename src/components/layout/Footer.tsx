"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { label: "La Maison",   href: "#maison" },
    { label: "Prestations", href: "#savoir-faire" },
    { label: "Galerie",     href: "#galerie" },
    { label: "Contact",     href: "#contact" },
    { label: "Instagram",   href: siteConfig.instagram,  external: true },
    { label: "Rendez-vous", href: siteConfig.planityUrl, external: true },
  ];

  return (
    <footer style={{ background: "#111111", borderTop: "1px solid rgba(232,213,206,0.1)" }}>
      <div style={{
        padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: "36px",
      }}>
        {/* Ligne 1 : Logo + nav */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          <Image
            src="/logo.png"
            alt="ADORE"
            width={36}
            height={44}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }}
          />

          <nav>
            <ul style={{
              display: "flex", flexWrap: "wrap",
              gap: "clamp(16px, 3vw, 36px)",
              listStyle: "none", margin: 0, padding: 0,
            }}>
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontWeight: 300, letterSpacing: "0.2em",
                      textTransform: "uppercase", textDecoration: "none",
                      color: "rgba(232,213,206,0.4)",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#E8D5CE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(232,213,206,0.4)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Ligne 2 : copyright */}
        <p style={{
          fontSize: "10px",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontWeight: 300, letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.18)",
          textAlign: "center",
        }}>
          © {year} ADORE — Maison de Manucure · Strasbourg
        </p>
      </div>
    </footer>
  );
}
