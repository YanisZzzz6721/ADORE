import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const STORAGE_SOURCE_URL = new URL("../src/lib/storage.ts", import.meta.url);
const MINIMUM_BLOB_CACHE_SECONDS = 60;

/**
 * Quoi : extrait la durée de cache configurée pour les JSON Vercel Blob.
 * Input : source TypeScript du module de stockage.
 * Output : durée en secondes, ou null si l'option est absente ou non numérique.
 * Effets de bord : aucun (fonction pure).
 */
function extractConfigCacheSeconds(source) {
  const writeConfigStart = source.indexOf("async function writeConfig");
  if (writeConfigStart === -1) return null;

  const writeConfigSource = source.slice(
    writeConfigStart,
    source.indexOf("/** Lit la configuration", writeConfigStart),
  );
  const match = writeConfigSource.match(/cacheControlMaxAge:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

test("la configuration Blob respecte le cache minimal accepté par Vercel", async () => {
  const source = await readFile(STORAGE_SOURCE_URL, "utf-8");
  const cacheSeconds = extractConfigCacheSeconds(source);

  assert.notEqual(
    cacheSeconds,
    null,
    "writeConfig doit déclarer explicitement cacheControlMaxAge",
  );
  assert.ok(
    cacheSeconds >= MINIMUM_BLOB_CACHE_SECONDS,
    `Vercel Blob exige au moins ${MINIMUM_BLOB_CACHE_SECONDS} secondes de cache`,
  );
});
