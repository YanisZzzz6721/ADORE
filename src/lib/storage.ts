import { put, list } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  type SiteContent,
  type SiteImages,
} from "@/lib/site-data";

// En production (Vercel) le système de fichiers est en lecture seule : tout
// passe par Vercel Blob. En local, sans jeton Blob, on retombe sur public/.
const IMAGES_FILE = "site-images.json";
const CONTENT_FILE = "site-content.json";
const BLOB_CONFIG_PREFIX = "site-config/";
const BLOB_UPLOADS_PREFIX = "uploads/";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

/**
 * Quoi  : indique si le stockage distant Vercel Blob est configuré.
 * Input : aucun.
 * Output: true si BLOB_READ_WRITE_TOKEN est présent.
 * Effets: aucun.
 */
export function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Quoi  : lit un JSON de configuration depuis Vercel Blob.
 * Input : filename — nom du fichier de config.
 * Output: l'objet parsé, ou null si aucun blob n'existe encore.
 * Effets: appels réseau à l'API Blob (list puis fetch du contenu).
 */
async function readJsonFromBlob(filename: string): Promise<unknown | null> {
  const pathname = `${BLOB_CONFIG_PREFIX}${filename}`;
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const blob = blobs.find((b) => b.pathname === pathname);
  if (!blob) return null;

  // L'URL publique est servie par le CDN : on la casse avec la date d'upload
  // pour être certain de lire la dernière version après une modification.
  const freshUrl = `${blob.url}?v=${blob.uploadedAt.getTime()}`;
  const res = await fetch(freshUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Lecture du blob ${pathname} impossible (HTTP ${res.status}).`,
    );
  }
  return res.json();
}

/**
 * Quoi  : lit un JSON de configuration depuis public/ (mode développement).
 * Input : filename — nom du fichier de config.
 * Output: l'objet parsé, ou null si le fichier n'existe pas encore.
 * Effets: lecture disque.
 */
async function readJsonFromDisk(filename: string): Promise<unknown | null> {
  try {
    const raw = await readFile(path.join(PUBLIC_DIR, filename), "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/**
 * Quoi  : lit une config JSON via Blob ou disque, en fusionnant sur les défauts.
 * Input : filename, defaults — valeurs de repli si rien n'est encore stocké.
 * Output: la config complète, jamais partielle.
 * Effets: lecture réseau (Blob) ou disque.
 */
async function readConfig<T extends object>(
  filename: string,
  defaults: T,
): Promise<T> {
  const stored = isBlobEnabled()
    ? await readJsonFromBlob(filename)
    : await readJsonFromDisk(filename);

  if (!stored || typeof stored !== "object") return defaults;
  return { ...defaults, ...(stored as Partial<T>) };
}

/**
 * Quoi  : écrit une config JSON via Blob ou disque selon l'environnement.
 * Input : filename, data — la config complète à persister.
 * Output: aucun.
 * Effets: écriture Blob (production) ou disque (développement).
 */
async function writeConfig(filename: string, data: object): Promise<void> {
  const body = JSON.stringify(data, null, 2);

  if (isBlobEnabled()) {
    await put(`${BLOB_CONFIG_PREFIX}${filename}`, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return;
  }

  await writeFile(path.join(PUBLIC_DIR, filename), body, "utf-8");
}

/** Lit la configuration des images du site. */
export function readSiteImages(): Promise<SiteImages> {
  return readConfig(IMAGES_FILE, DEFAULT_IMAGES);
}

/** Écrit la configuration des images du site. */
export function writeSiteImages(images: SiteImages): Promise<void> {
  return writeConfig(IMAGES_FILE, images);
}

/** Lit les textes éditables du site. */
export function readSiteContent(): Promise<SiteContent> {
  return readConfig(CONTENT_FILE, DEFAULT_CONTENT);
}

/** Écrit les textes éditables du site. */
export function writeSiteContent(content: SiteContent): Promise<void> {
  return writeConfig(CONTENT_FILE, content);
}

/**
 * Quoi  : persiste une image uploadée et renvoie son URL publique.
 * Input : filename — nom déjà assaini par l'appelant ; buffer ; contentType MIME.
 * Output: l'URL publique de l'image (absolue en Blob, relative en local).
 * Effets: écriture Blob (production) ou disque dans public/uploads (développement).
 */
export async function saveImage(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  if (isBlobEnabled()) {
    const blob = await put(`${BLOB_UPLOADS_PREFIX}${filename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
