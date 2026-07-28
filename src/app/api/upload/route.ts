import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readSiteImages, writeSiteImages, saveImage } from "@/lib/storage";
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

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo
const GALERIE_SLOT_PATTERN = new RegExp(`^galerie-([0-${GALERIE_SLOTS - 1}])$`);

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

  const form = await req.formData();
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
      { error: `Image trop lourde (${mo} Mo) — 8 Mo maximum.` },
      { status: 413 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${slotRaw}-${Date.now()}.${extension}`;
    const url = await saveImage(filename, buffer, file.type);

    const images = await readSiteImages();
    await writeSiteImages(applySlot(images, slot, url));

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[upload] échec de l'enregistrement :", error);
    return NextResponse.json(
      { error: "Enregistrement impossible — réessayez dans un instant." },
      { status: 500 },
    );
  }
}
