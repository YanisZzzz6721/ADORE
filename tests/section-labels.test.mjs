import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const GLOBALS_URL = new URL("../src/app/globals.css", import.meta.url);
const SECTION_URLS = [
  new URL("../src/components/sections/MaisonSection.tsx", import.meta.url),
  new URL(
    "../src/components/sections/SavoirFaireSection.tsx",
    import.meta.url,
  ),
  new URL("../src/components/sections/GalerieSection.tsx", import.meta.url),
  new URL(
    "../src/components/sections/TemoignagesSection.tsx",
    import.meta.url,
  ),
  new URL("../src/components/sections/ContactSection.tsx", import.meta.url),
];

/**
 * Quoi : convertit une couleur hexadécimale en composantes RGB.
 * Input : hex — couleur au format #RRGGBB.
 * Output : tableau contenant rouge, vert et bleu entre 0 et 255.
 * Effets de bord : aucun (fonction pure).
 */
function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/**
 * Quoi : calcule la luminance relative WCAG d'une couleur hexadécimale.
 * Input : hex — couleur au format #RRGGBB.
 * Output : luminance comprise entre 0 et 1.
 * Effets de bord : aucun (fonction pure).
 */
function relativeLuminance(hex) {
  const channels = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Quoi : calcule le ratio de contraste WCAG entre deux couleurs.
 * Input : foreground — texte ; background — arrière-plan, au format #RRGGBB.
 * Output : ratio de contraste supérieur ou égal à 1.
 * Effets de bord : aucun (fonction pure).
 */
function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

test("les repères de section partagent une typographie plus visible", async () => {
  const sources = await Promise.all(
    SECTION_URLS.map((url) => readFile(url, "utf-8")),
  );

  for (const source of sources) {
    assert.match(source, /className="section-eyebrow"/);
  }

  const css = await readFile(GLOBALS_URL, "utf-8");
  assert.match(css, /\.section-eyebrow\s*\{/);
  assert.match(css, /font-size:\s*clamp\(15px,/);
  assert.match(css, /font-weight:\s*500/);
});

test("les repères I à III utilisent le même style de sous-section", async () => {
  const source = await readFile(SECTION_URLS[1], "utf-8");
  const occurrences = source.match(/className="subsection-eyebrow"/g) ?? [];

  assert.equal(occurrences.length, 2);
});

test("la couleur des repères reste lisible sur les deux fonds du site", async () => {
  const css = await readFile(GLOBALS_URL, "utf-8");
  const color = css.match(/--color-section-label:\s*(#[0-9A-Fa-f]{6})/)?.[1];

  assert.ok(color, "la couleur partagée des repères doit être déclarée");
  assert.ok(contrastRatio(color, "#FFFFFF") >= 4.5);
  assert.ok(contrastRatio(color, "#F4EEEB") >= 4.5);
});
