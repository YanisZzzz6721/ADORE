import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const AUTH_SOURCE_URL = new URL("../src/lib/auth.ts", import.meta.url);
const LOGIN_SOURCE_URL = new URL(
  "../src/app/api/admin/login/route.ts",
  import.meta.url,
);
const UPLOAD_SOURCE_URL = new URL(
  "../src/app/api/upload/route.ts",
  import.meta.url,
);
const NEXT_CONFIG_SOURCE_URL = new URL("../next.config.ts", import.meta.url);

test("les écritures admin refusent les requêtes provenant d'un autre site", async () => {
  const source = await readFile(AUTH_SOURCE_URL, "utf-8");

  assert.match(source, /function isSameOrigin/);
  assert.match(source, /Origine de requête non autorisée/);
  assert.match(source, /isSameOrigin\(req\)/);
});

test("l'upload contrôle la signature réelle du fichier et génère un nom imprévisible", async () => {
  const source = await readFile(UPLOAD_SOURCE_URL, "utf-8");

  assert.match(source, /hasValidImageSignature\(buffer,\s*file\.type\)/);
  assert.match(source, /randomUUID\(\)/);
  assert.match(source, /MAX_BYTES = 4 \* 1024 \* 1024/);
});

test("la limitation de connexion compte seulement les échecs et borne sa mémoire", async () => {
  const source = await readFile(LOGIN_SOURCE_URL, "utf-8");
  const limiterStart = source.indexOf("function isRateLimited");
  const limiterEnd = source.indexOf(
    "/**\n * Quoi : comptabilise",
    limiterStart,
  );
  const limiterSource = source.slice(limiterStart, limiterEnd);

  assert.match(source, /const MAX_TRACKED_CLIENTS = 10_000/);
  assert.match(source, /if \(!checkPassword\(password\)\) \{\s*recordFailedAttempt\(ip\)/);
  assert.doesNotMatch(limiterSource, /entry\.count \+= 1/);
});

test("les en-têtes limitent l'intégration et les primitives web dangereuses", async () => {
  const source = await readFile(NEXT_CONFIG_SOURCE_URL, "utf-8");

  assert.match(source, /Content-Security-Policy/);
  assert.match(source, /frame-ancestors 'none'/);
  assert.match(source, /Cross-Origin-Opener-Policy/);
  assert.match(source, /strict-origin-when-cross-origin/);
});
