import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Palette ADORE ───────────────────────────────────────────
      colors: {
        adore: {
          white:     "#FAFAFA",
          pure:      "#FFFFFF",
          black:     "#111111",
          blush:     "#E8D5CE",   // rose poudré principal
          "blush-md":"#D9BDB4",   // rose moyen
          "blush-dk":"#C4998C",   // accent rose soutenu
          "blush-lt":"#F4EEEB",   // rose très clair (fonds de sections)
          mid:       "#7A6E6B",   // gris-brun (corps de texte)
          soft:      "#A89E9B",   // gris léger
        },
      },

      // ─── Typographie ─────────────────────────────────────────────
      fontFamily: {
        serif:  ["var(--font-cormorant)", "Georgia", "serif"],
        sans:   ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(80px,12vw,172px)", { lineHeight: "0.85", letterSpacing: "0.22em" }],
        "display-lg": ["clamp(48px,7vw,100px)",  { lineHeight: "0.9",  letterSpacing: "0.1em"  }],
        "display-md": ["clamp(36px,5vw,68px)",   { lineHeight: "1.05", letterSpacing: "0.06em" }],
        "display-sm": ["clamp(28px,3.5vw,48px)", { lineHeight: "1.1",  letterSpacing: "0.04em" }],
        "label":      ["10px",                   { lineHeight: "1",    letterSpacing: "0.45em" }],
        "label-sm":   ["9px",                    { lineHeight: "1",    letterSpacing: "0.55em" }],
        "body-lg":    ["15px",                   { lineHeight: "2",    letterSpacing: "0.02em" }],
        "body":       ["13.5px",                 { lineHeight: "1.9",  letterSpacing: "0.015em"}],
        "caption":    ["11px",                   { lineHeight: "1.6",  letterSpacing: "0.1em"  }],
      },

      // ─── Espacements ─────────────────────────────────────────────
      spacing: {
        "section":    "120px",
        "section-sm": "80px",
        "section-xs": "60px",
        "nav":        "96px",
      },

      // ─── Animations ──────────────────────────────────────────────
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "reveal":  "cubic-bezier(0.76, 0, 0.24, 1)",
        "spring":  "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000":"1000ms",
        "1200":"1200ms",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "reveal-left": {
          "0%":   { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "ticker": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "dot-pulse": {
          "0%,100%": { opacity: "0.3", transform: "scale(1)" },
          "50%":     { opacity: "1",   transform: "scale(1.4)" },
        },
        "line-grow": {
          "0%":   { transform: "scaleY(0)", transformOrigin: "top" },
          "100%": { transform: "scaleY(1)", transformOrigin: "top" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.8s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "fade-in":    "fade-in 0.6s ease both",
        "ticker":     "ticker 20s linear infinite",
        "dot-pulse":  "dot-pulse 2s ease-in-out infinite",
        "line-grow":  "line-grow 1s cubic-bezier(0.76,0,0.24,1) both",
      },

      // ─── Ombres ──────────────────────────────────────────────────
      boxShadow: {
        "luxury":    "0 8px 40px rgba(196,153,140,0.15)",
        "luxury-lg": "0 24px 80px rgba(17,17,17,0.12)",
        "floating":  "0 4px 24px rgba(17,17,17,0.18)",
        "card":      "0 2px 16px rgba(232,213,206,0.3)",
      },

      // ─── Grille ──────────────────────────────────────────────────
      maxWidth: {
        "site": "1440px",
        "text": "640px",
        "narrow": "480px",
      },
    },
  },
  plugins: [],
};

export default config;
