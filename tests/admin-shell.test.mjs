import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT_LAYOUT_URL = new URL("../src/app/layout.tsx", import.meta.url);
const SITE_SHELL_URL = new URL(
  "../src/components/layout/SiteShell.tsx",
  import.meta.url,
);

test("le chrome public n'est pas rendu dans l'espace admin", async () => {
  const rootLayout = await readFile(ROOT_LAYOUT_URL, "utf-8");
  const siteShell = await readFile(SITE_SHELL_URL, "utf-8");

  assert.match(rootLayout, /<SiteShell>\s*\{children\}\s*<\/SiteShell>/);
  assert.doesNotMatch(rootLayout, /<Navigation\s*\/>/);
  assert.match(siteShell, /pathname\.startsWith\("\/admin"\)/);
  assert.match(siteShell, /if \(isAdminRoute\) return <>\{children\}<\/>/);
});
