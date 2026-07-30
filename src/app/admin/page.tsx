"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  DEFAULT_CONTENT,
  DEFAULT_IMAGES,
  GALERIE_SLOTS,
  type ImageSlot as Slot,
  type SiteContent,
  type SiteImages,
} from "@/lib/site-data";
import { loadSiteData } from "@/hooks/useSiteData";

type UploadState = "idle" | "uploading" | "done" | "error";
type SaveState = "idle" | "saving" | "saved" | "error";
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

// ─── Composant slot upload ─────────────────────────────────────
/**
 * Quoi  : zone drag-and-drop pour uploader une image vers un slot.
 * Input : slot, label, currentUrl, onUploaded.
 * Output: JSX — carte avec aperçu et état d'upload.
 * Effets: POST /api/upload.
 */
function UploadSlot({
  slot,
  label,
  hint,
  currentUrl,
  onUploaded,
  onUnauthorized,
}: {
  slot: Slot;
  label: string;
  hint?: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onUnauthorized: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
        setStatus("error");
        setError("Format non supporté — JPG, PNG ou WEBP uniquement.");
        return;
      }

      if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
        setStatus("error");
        setError(
          file.size === 0
            ? "Le fichier est vide."
            : "Image trop lourde — 4 Mo maximum.",
        );
        return;
      }

      setPreview(URL.createObjectURL(file));
      setStatus("uploading");
      setError(null);

      const form = new FormData();
      form.append("file", file);
      form.append("slot", slot);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));

        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (!res.ok) {
          setStatus("error");
          setError(data.error ?? "Envoi impossible.");
          return;
        }

        setStatus("done");
        onUploaded(data.url);
      } catch {
        setStatus("error");
        setError("Connexion interrompue — réessayez.");
      }
    },
    [slot, onUploaded, onUnauthorized],
  );

  const displayed = preview ?? currentUrl;

  return (
    <div style={{ background: "#fff", overflow: "hidden" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        style={{
          position: "relative",
          height: 160,
          cursor: "pointer",
          background: dragging ? "#F0E8E4" : "#F4EEEB",
          border: dragging ? "2px dashed #C4998C" : "2px dashed transparent",
          transition: "all 0.2s",
        }}
      >
        {displayed ? (
          <Image
            src={displayed}
            alt={label}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C4998C"
              strokeWidth="1.2"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
            <span
              style={{
                fontSize: 11,
                color: "#C4998C",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Déposer ou cliquer
            </span>
          </div>
        )}
        {status === "uploading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(250,250,250,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: 11, color: "#C4998C", letterSpacing: "0.2em" }}
            >
              Envoi…
            </span>
          </div>
        )}
        {status === "done" && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#111",
              color: "#fff",
              fontSize: 10,
              padding: "4px 10px",
              letterSpacing: "0.15em",
            }}
          >
            ✓ Enregistré
          </div>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 500,
            color: "#111",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        {hint && (
          <p style={{ margin: "3px 0 0", fontSize: 10, color: "#aaa" }}>
            {hint}
          </p>
        )}
        {error && (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#C0392B" }}>
            {error}
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

// ─── Composant champ texte éditable ───────────────────────────
function TextField({
  label,
  hint,
  value,
  rows,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#111",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ margin: "0 0 8px", fontSize: 10, color: "#aaa" }}>{hint}</p>
      )}
      <textarea
        rows={rows ?? 3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #E8D5CE",
          fontSize: 13,
          color: "#111",
          background: "#FAFAFA",
          resize: "vertical",
          outline: "none",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ─── Section admin avec titre ──────────────────────────────────
function AdminSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 52 }}>
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #E8D5CE",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [images, setImages] = useState<SiteImages>(DEFAULT_IMAGES);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Le cookie de session survit à un rafraîchissement : on le vérifie au
  // montage pour ne pas redemander le mot de passe à chaque rechargement.
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) =>
        setAuth(Boolean(data.authenticated)),
      )
      .catch(() => setAuth(false))
      .finally(() => setCheckingSession(false));
  }, []);

  // Charge le contenu réel du site une fois connectée.
  useEffect(() => {
    if (!auth) return;
    loadSiteData(true).then((data) => {
      setImages(data.images);
      setContent(data.content);
    });
  }, [auth]);

  /** Ramène l'écran de connexion quand le serveur rejette la session. */
  const handleUnauthorized = useCallback(() => {
    setAuth(false);
    setAuthError("Session expirée — reconnectez-vous.");
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setPassword("");
        setAuth(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error ?? "Connexion impossible.");
      }
    } catch {
      setAuthError("Serveur injoignable — vérifiez votre connexion.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    setAuth(false);
  };

  const updateSlot = useCallback((slot: Slot, url: string) => {
    setImages((prev) => {
      if (slot === "hero") return { ...prev, hero: url };
      if (slot === "maison") return { ...prev, maison: url };
      if (slot === "prestation_mains")
        return { ...prev, prestation_mains: url };
      if (slot === "prestation_pieds")
        return { ...prev, prestation_pieds: url };
      if (slot.startsWith("galerie-")) {
        const i = parseInt(slot.split("-")[1], 10);
        const next = [...prev.galerie];
        next[i] = url;
        return { ...prev, galerie: next };
      }
      return prev;
    });
  }, []);

  const saveContent = async () => {
    setSaveState("saving");
    setSaveError(null);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveState("error");
        setSaveError(data.error ?? "Enregistrement impossible.");
        return;
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setSaveError("Serveur injoignable — réessayez.");
    }
  };

  // ─── Vérification de session en cours ───────────────────────
  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4EEEB",
          fontSize: 10,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#C4998C",
        }}
      >
        Chargement…
      </div>
    );
  }

  // ─── Écran login ────────────────────────────────────────────
  if (!auth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4EEEB",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "52px 48px",
            width: "100%",
            maxWidth: 360,
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                color: "#C4998C",
                marginBottom: 12,
              }}
            >
              Espace administration
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 300,
                fontFamily: "Georgia, serif",
                letterSpacing: "0.06em",
                color: "#111",
              }}
            >
              ADORE
            </h1>
          </div>
          <form onSubmit={login}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 16px",
                border: "1px solid #E8D5CE",
                fontSize: 14,
                color: "#111",
                background: "#FAFAFA",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12,
              }}
            />
            {authError && (
              <p style={{ fontSize: 12, color: "#C0392B", margin: "0 0 12px" }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: "100%",
                padding: "13px",
                background: "#111",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                opacity: authLoading ? 0.6 : 1,
              }}
            >
              {authLoading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Interface admin ────────────────────────────────────────
  return (
    <div
      style={{ minHeight: "100vh", background: "#F4EEEB", paddingBottom: 80 }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E8D5CE",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#C4998C",
            }}
          >
            Administration
          </span>
          <h1
            style={{
              margin: "4px 0 0",
              fontSize: 20,
              fontWeight: 300,
              fontFamily: "Georgia, serif",
              letterSpacing: "0.06em",
              color: "#111",
            }}
          >
            ADORE — Gestion du site
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a
            href="/"
            target="_blank"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#7A6E6B",
              textDecoration: "none",
              borderBottom: "1px solid rgba(122,110,107,0.3)",
            }}
          >
            Voir le site →
          </a>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C4998C",
              borderBottom: "1px solid rgba(196,153,140,0.4)",
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        {/* ── TEXTES ───────────────────────────────────────────── */}
        <AdminSection
          title="Textes du site"
          subtitle="Modifiez les textes puis cliquez sur Enregistrer."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <TextField
              label="Tagline — Page d'accueil"
              hint="Phrase italique sous le logo dans le hero."
              value={content.hero_tagline}
              rows={2}
              onChange={(v) => setContent((c) => ({ ...c, hero_tagline: v }))}
            />
            <TextField
              label="Grande citation"
              hint="Bandeau entre le hero et la section La Maison."
              value={content.citation}
              rows={3}
              onChange={(v) => setContent((c) => ({ ...c, citation: v }))}
            />
            <TextField
              label="La Maison — Paragraphe 1"
              hint="Présentation du salon."
              value={content.maison_p1}
              rows={3}
              onChange={(v) => setContent((c) => ({ ...c, maison_p1: v }))}
            />
            <TextField
              label="La Maison — Paragraphe 2"
              hint="Histoire / évolution du salon."
              value={content.maison_p2}
              rows={3}
              onChange={(v) => setContent((c) => ({ ...c, maison_p2: v }))}
            />
            <button
              onClick={saveContent}
              disabled={saveState === "saving"}
              style={{
                alignSelf: "flex-start",
                padding: "13px 32px",
                background:
                  saveState === "saved"
                    ? "#4CAF50"
                    : saveState === "error"
                      ? "#C0392B"
                      : "#111",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                transition: "background 0.3s",
              }}
            >
              {saveState === "saving"
                ? "Enregistrement…"
                : saveState === "saved"
                  ? "✓ Enregistré"
                  : saveState === "error"
                    ? "Erreur — réessayer"
                    : "Enregistrer les textes"}
            </button>
            {saveError && (
              <p style={{ margin: 0, fontSize: 12, color: "#C0392B" }}>
                {saveError}
              </p>
            )}
          </div>
        </AdminSection>

        {/* ── PHOTOS PRINCIPALES ──────────────────────────────── */}
        <AdminSection
          title="Photos principales"
          subtitle="Cliquez ou déposez une image pour la remplacer."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: 12,
            }}
          >
            <UploadSlot
              slot="hero"
              label="Fond d'accueil"
              hint="1920×1080px min"
              currentUrl={images.hero}
              onUploaded={(u) => updateSlot("hero", u)}
              onUnauthorized={handleUnauthorized}
            />
            <UploadSlot
              slot="maison"
              label="Photo La Maison"
              hint="Portrait ou paysage"
              currentUrl={images.maison}
              onUploaded={(u) => updateSlot("maison", u)}
              onUnauthorized={handleUnauthorized}
            />
          </div>
        </AdminSection>

        {/* ── PHOTOS PRESTATIONS ──────────────────────────────── */}
        <AdminSection
          title="Photos des prestations"
          subtitle="Images des cartes Beauté des Mains et Beauté des Pieds."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: 12,
            }}
          >
            <UploadSlot
              slot="prestation_mains"
              label="Beauté des Mains"
              hint="480×320px min"
              currentUrl={images.prestation_mains}
              onUploaded={(u) => updateSlot("prestation_mains", u)}
              onUnauthorized={handleUnauthorized}
            />
            <UploadSlot
              slot="prestation_pieds"
              label="Beauté des Pieds"
              hint="480×320px min"
              currentUrl={images.prestation_pieds}
              onUploaded={(u) => updateSlot("prestation_pieds", u)}
              onUnauthorized={handleUnauthorized}
            />
          </div>
        </AdminSection>

        {/* ── GALERIE ─────────────────────────────────────────── */}
        <AdminSection
          title="Galerie — Nos réalisations"
          subtitle="6 photos de réalisations — carrés ou portraits, 600×600px min."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: 12,
            }}
          >
            {Array.from({ length: GALERIE_SLOTS }, (_, i) => (
              <UploadSlot
                key={i}
                slot={`galerie-${i}` as Slot}
                label={`Réalisation ${i + 1}`}
                currentUrl={images.galerie[i] ?? null}
                onUploaded={(u) => updateSlot(`galerie-${i}` as Slot, u)}
                onUnauthorized={handleUnauthorized}
              />
            ))}
          </div>
        </AdminSection>
      </div>
    </div>
  );
}
