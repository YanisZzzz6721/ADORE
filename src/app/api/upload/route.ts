import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readSiteImages, writeSiteImages, saveImage } from "@/lib/storage";
import { invalidateSiteDataCache } from "@/lib/site-data-server";
import {
  FIXED_IMAGE_SLOTS,
  GALERIE_SLOTS,
  type FixedImageSlot,
  type SiteImages,
} from "@/lib/site-data";

/** Extension de fichier déduite du type MIME — jamais du nom fourni par le client. */
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 4 * 1024 * 1024; // Sous la limite de 4,5 Mo de Vercel Functions.
const GALERIE_SLOT_PATTERN = new RegExp(`^galerie-([0-${GALERIE_SLOTS - 1}])$`);

/**
 * Quoi : contrôle que les premiers octets correspondent réellement au MIME annoncé.
 * Input : buffer — contenu du fichier ; contentType — type MIME déclaré.
 * Output : true uniquement pour une signature JPEG, PNG ou WebP valide.
 * Effets de bord : aucun (fonction pure).
 */
function hasValidImageSignature(
  buffer: Buffer,
  contentType: string,
): boolean {
  if (contentType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (contentType === "image/png") {
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    return (
      buffer.length >= pngSignature.length &&
      buffer.subarray(0, pngSignature.length).equals(pngSignature)
    );
  }

  if (contentType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

/**
 * Quoi  : valide l'emplacement demandé contre une liste blanche stricte.
 * Input : slot — valeur brute reçue du client.
 * Output: l'index de galerie si c'est un slot galerie, "fixed" si emplacement fixe, null si invalide.
 * Effets: aucun.
 *
 * Cette validation est ce qui empêche une valeur du type « ../../etc/passwd »
 * de se retrouver dans le nom du fichier écrit.
 */
function parseSlot(
  slot: string,
):
  | { kind: "fixed"; name: FixedImageSlot }
  | { kind: "galerie"; index: number }
  | null {
  if ((FIXED_IMAGE_SLOTS as readonly string[]).includes(slot)) {
    return { kind: "fixed", name: slot as FixedImageSlot };
  }

  const match = GALERIE_SLOT_PATTERN.exec(slot);
  if (match) return { kind: "galerie", index: Number(match[1]) };

  return null;
}

/**
 * Quoi  : applique la nouvelle URL à l'emplacement concerné de la config.
 * Input : images — config courante ; slot analysé ; url de l'image.
 * Output: une nouvelle config, sans mutation de l'entrée.
 * Effets: aucun (fonction pure).
 */
function applySlot(
  images: SiteImages,
  slot: NonNullable<ReturnType<typeof parseSlot>>,
  url: string,
): SiteImages {
  if (slot.kind === "fixed") return { ...images, [slot.name]: url };

  const galerie = [...images.galerie];
  galerie[slot.index] = url;
  return { ...images, galerie };
}

/**
 * Quoi  : reçoit une image de l'admin, la stocke et met à jour la config du site.
 * Input : FormData { file: File, slot: string } + cookie de session admin valide.
 * Output: { url } — URL publique de l'image enregistrée.
 * Effets: écriture Vercel Blob (ou disque en local) + mise à jour de site-images.json.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Formulaire d'upload illisible." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  const slotRaw = form.get("slot");

  if (!(file instanceof File) || typeof slotRaw !== "string") {
    return NextResponse.json(
      { error: "Fichier ou emplacement manquant." },
      { status: 400 },
    );
  }

  const slot = parseSlot(slotRaw);
  if (!slot) {
    return NextResponse.json(
      { error: `Emplacement inconnu : ${slotRaw}` },
      { status: 400 },
    );
  }

  const extension = EXTENSION_BY_MIME[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Format non supporté — JPG, PNG ou WEBP uniquement." },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "Le fichier est vide." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    const mo = (file.size / 1024 / 1024).toFixed(1);
    return NextResponse.json(
      { error: `Image trop lourde (${mo} Mo) — 4 Mo maximum.` },
      { status: 413 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasValidImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "Le contenu du fichier ne correspond pas à une image valide." },
        { status: 400 },
      );
    }

    const filename = `${slotRaw}-${randomUUID()}.${extension}`;
    const url = await saveImage(filename, buffer, file.type);

    const images = await readSiteImages();
    await writeSiteImages(applySlot(images, slot, url));
    invalidateSiteDataCache();

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[upload] échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Enregistrement impossible — réessayez dans un instant." },
      { status: 500 },
    );
  }
}
