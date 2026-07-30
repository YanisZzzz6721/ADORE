import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const PAGE_SOURCE_URL = new URL("../src/app/page.tsx", import.meta.url);
const HOOK_SOURCE_URL = new URL(
  "../src/hooks/useSiteData.ts",
  import.meta.url,
);
const STORAGE_SOURCE_URL = new URL("../src/lib/storage.ts", import.meta.url);

test("la page injecte les données Blob avant le premier rendu", async () => {
  const source = await readFile(PAGE_SOURCE_URL, "utf-8");

  assert.match(source, /export default async function Home/);
  assert.match(source, /await getSiteDataForRender\(\)/);
  assert.match(source, /<SiteDataProvider initialData=\{initialData\}>/);
});

test("les sections consomment le contexte initial sans flash des images locales", async () => {
  const source = await readFile(HOOK_SOURCE_URL, "utf-8");

  assert.match(source, /createContext<SiteData \| null>/);
  assert.match(source, /export function SiteDataProvider/);
  assert.match(source, /useContext\(SiteDataContext\)/);
  assert.doesNotMatch(source, /useState<SiteData>\(FALLBACK\)/);
});

test("chaque configuration Blob reçoit une URL immuable et versionnée", async () => {
  const source = await readFile(STORAGE_SOURCE_URL, "utf-8");

  assert.match(source, /createVersionedConfigPath/);
  assert.match(source, /allowOverwrite:\s*false/);
  assert.doesNotMatch(
    source,
    /put\(`\$\{BLOB_CONFIG_PREFIX\}\$\{filename\}`/,
  );
});
