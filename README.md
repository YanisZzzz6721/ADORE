# ADORE — Site vitrine one-page

Site vitrine haut de gamme pour **ADORE YOUR NAILS**, salon de manucure à Strasbourg
(anciennement *Vegan Nails*). One-page immersif, animations premium, espace
d'administration permettant à la propriétaire de changer photos et textes sans toucher au code.

> **Ce README est un document de passation.** Il décrit l'état réel du projet,
> y compris les problèmes connus non résolus. Lire la section
> [Conventions critiques](#-conventions-critiques) **avant** d'écrire la moindre ligne.

---

## Sommaire

- [Informations client](#informations-client)
- [Stack technique](#stack-technique)
- [⚠️ Conventions critiques](#-conventions-critiques)
- [Démarrage](#démarrage)
- [Arborescence](#arborescence)
- [Architecture des données](#architecture-des-données)
- [Sections du site](#sections-du-site)
- [Espace admin](#espace-admin)
- [Design system](#design-system)
- [Problèmes connus](#-problèmes-connus)
- [Reste à faire](#reste-à-faire)

---

## Informations client

| Champ | Valeur |
|---|---|
| Nom commercial | ADORE YOUR NAILS |
| Adresse | **10 Rue Kuhn, 67000 Strasbourg** |
| Horaires | Mardi–Samedi 10h–19h · Lundi & Dimanche fermés |
| Réservation | https://www.planity.com/adore-your-nails-67000-strasbourg |
| Instagram | https://www.instagram.com/adore.nails.strasbourg |
| Note Planity | 4.8/5 — 136 avis |

**Toute réservation passe par Planity** — il n'y a pas de système de booking interne,
et il ne faut pas en construire un. Les CTA pointent vers l'URL Planity.

### Prestations réelles (source : Planity)

**Beauté des Mains — Manucure Russe**

| Prestation | Durée | Prix |
|---|---|---|
| Pose Complète Naturel | 1h10 | 45 € |
| Pose Complète Couleur | 1h10 | 50 € |
| Pose Complète French | 1h10 | 50 € |
| Pose Complète Babyboomer | 1h | 50 € |
| Pose Complète Nail Art | 1h30 | Sur devis |

**Beauté des Pieds — Pédicure Soin**

| Prestation | Durée | Prix |
|---|---|---|
| Soin + Vernis Semi-Permanent | 1h10 | 50 € |
| Vernis Semi-Permanent seul | 1h | 35 € |
| Traitement Anti-Callosités | 30min | 20 € |
| Réparation / Extension Orteil | 30min | 5 € |
| Pose Complète Pieds | 1h10 | 35 € |

Ces données vivent dans [`src/lib/config.ts`](src/lib/config.ts) → `serviceCategories`.

---

## Stack technique

| Techno | Version | Note |
|---|---|---|
| Next.js | **16.2.9** | App Router |
| React | 19.2.4 | |
| TypeScript | ^5 | strict |
| Tailwind CSS | **v4** | ⚠️ voir conventions critiques |
| Framer Motion | ^12.40 | toutes les animations |
| @vercel/blob | ^2.6.1 | **installé mais pas encore câblé** |

### Dépendances installées mais inutilisées

À supprimer, ou à câbler si le besoin revient — elles alourdissent le bundle pour rien :

- `next-sanity` + `@sanity/image-url` — Sanity CMS avait été envisagé, puis abandonné
  au profit d'un admin maison. **Aucun code Sanity dans `src/`.**
- `@studio-freight/lenis` — le smooth scroll Lenis a été **retiré** (il rendait le scroll
  atrocement lent). `SmoothScroll.tsx` est désormais un simple passthrough.
  Restent quelques traces mortes : CSS `.lenis` dans le fichier orphelin
  `src/styles/globals.css`, et une branche `window.lenis` dans `FloatingCTA.tsx`
  (inoffensive, elle a un fallback `window.scrollTo`).

---

## ⚠️ Conventions critiques

Ces trois règles sont non négociables. Les ignorer produit du code qui **ne marche pas
visuellement sans lever la moindre erreur** — le piège classique sur ce projet.

### 1. Les classes responsive Tailwind ne fonctionnent PAS

La config Tailwind v4 de ce projet ne génère pas les variantes de breakpoint.
Écrire `hidden lg:flex`, `md:grid-cols-2`, `sm:p-4` **échoue silencieusement**.

À la place, on utilise des **classes utilitaires maison** définies dans
[`src/app/globals.css`](src/app/globals.css) :

| Classe | Effet |
|---|---|
| `.mobile-only` | visible < 1024px |
| `.desktop-only` | `display: flex` ≥ 1024px |
| `.desktop-only-block` | `display: block` ≥ 1024px |
| `.desktop-only-inline` | `display: inline-block` ≥ 1024px |
| `.desktop-md-only` | `display: block` ≥ 768px |
| `.desktop-md-grid` | `display: grid` ≥ 768px |
| `.mobile-md-only` | masqué ≥ 768px |

### 2. Le style est en inline `style={{}}`, pas en classes

Tous les composants stylent via l'attribut `style`. C'est le choix assumé du projet
(conséquence du point 1). **Ne pas convertir en classes Tailwind.**

Le responsive se fait par :
- `clamp(min, préféré, max)` pour toutes les tailles de police, marges et paddings ;
- `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))` pour les grilles qui doivent
  s'effondrer seules ;
- `flex: "1 1 140px"` pour les boutons qui s'empilent sur mobile.

### 3. `overflow: hidden` casse les carrousels

Un conteneur parent en `overflow: hidden` bloque le scroll horizontal de ses enfants.
Pour couper visuellement sans bloquer le swipe, utiliser **`overflowX: "clip"`**
(c'est ce que fait `TemoignagesSection`).

---

## Démarrage

```bash
npm install
```

Créer `.env.local` à la racine (le fichier est gitignored, donc absent du dépôt) :

```bash
ADMIN_PASSWORD=votre_mot_de_passe
```

Puis :

```bash
npm run dev
```

- Site : http://localhost:3000
- Admin : http://localhost:3000/admin

Vérification TypeScript (à lancer après chaque modification) :

```bash
npx tsc --noEmit
```

---

## Arborescence

```
src/
├── app/
│   ├── layout.tsx              # root layout : fonts, SEO, JSON-LD, nav, curseur
│   ├── page.tsx                # assemble les 8 sections du one-page
│   ├── globals.css             # ✅ LE fichier CSS actif (utilitaires responsive)
│   ├── robots.ts               # SEO
│   ├── sitemap.ts              # SEO
│   ├── admin/
│   │   ├── layout.tsx          # metadata noindex — PAS de <html>/<body>
│   │   └── page.tsx            # interface admin (login + upload + textes)
│   └── api/
│       ├── admin/login/route.ts  # vérifie ADMIN_PASSWORD
│       ├── upload/route.ts       # upload image → public/uploads + MAJ JSON
│       └── content/route.ts      # GET/POST des textes éditables
│
├── components/
│   ├── layout/       Navigation · Footer
│   ├── sections/     Hero · Citation · Maison · SavoirFaire ·
│   │                 Galerie · Temoignages · CTA · Contact
│   └── ui/           AnimatedText · FadeInUp · RevealImage ·
│                     CustomCursor · FloatingCTA · SmoothScroll
│
├── hooks/
│   ├── useSiteImages.ts    # lit /site-images.json
│   └── useSiteContent.ts   # lit /site-content.json
│
├── lib/config.ts           # siteConfig, navItems, serviceCategories, motionVariants
├── types/index.ts          # Service, ServiceCategory, SiteConfig, OpeningHours…
└── styles/globals.css      # ⚠️ ORPHELIN — jamais importé, à supprimer

public/
├── site-images.json        # 📌 état des photos (écrit par l'admin)
├── site-content.json       # 📌 état des textes (écrit par l'admin)
├── uploads/                # images uploadées via l'admin
├── logo.png                # logo ovale ADORE
└── salon.JPG               # photo du salon (fallback hero + maison)
```

> Attention au doublon `globals.css`. Le fichier **actif** est `src/app/globals.css`
> (importé par `layout.tsx` via `"./globals.css"`). Celui dans `src/styles/`
> n'est importé nulle part.

---

## Architecture des données

Le contenu éditable est séparé du code, dans deux fichiers JSON servis statiquement :

```
Admin (navigateur)
   │  POST /api/upload    (multipart)
   │  POST /api/content   (json)
   ▼
public/site-images.json  ·  public/site-content.json
   ▲
   │  fetch au montage
   │
useSiteImages()  ·  useSiteContent()
   ▲
   │
Sections du site (HeroSection, MaisonSection, …)
```

### `public/site-images.json`

```json
{
  "hero": "/salon.JPG",
  "maison": "/salon.JPG",
  "prestation_mains": "/uploads/prestation_mains-<timestamp>.jpg",
  "prestation_pieds": "/uploads/prestation_pieds-<timestamp>.jpg",
  "galerie": [null, null, null, null, null, "/uploads/galerie-5-<timestamp>.jpg"]
}
```

### `public/site-content.json`

```json
{
  "hero_tagline": "l'art de sublimer vos mains",
  "citation": "Chez ADORE, nous croyons que chaque détail compte…",
  "maison_p1": "Niché au cœur de Strasbourg…",
  "maison_p2": "Anciennement Vegan Nails…"
}
```

Les deux hooks fusionnent le JSON avec des valeurs par défaut (`{ ...DEFAULTS, ...data }`),
donc un champ manquant ne casse jamais le rendu.

**Slots d'upload valides** (`slot` dans le FormData) : `hero`, `maison`,
`prestation_mains`, `prestation_pieds`, `galerie-0` … `galerie-5`.
Formats acceptés : JPEG, PNG, WEBP.

---

## Sections du site

Ordre défini dans [`src/app/page.tsx`](src/app/page.tsx) :

| # | Composant | Contenu | Éditable en admin |
|---|---|---|---|
| — | `HeroSection` | Plein écran, image parallax, logo, tagline, CTA | photo + tagline |
| — | `CitationStrip` | Bandeau blush avec grande citation | citation |
| 01 | `MaisonSection` | Photo salon + 2 paragraphes + stats | photo + 2 textes |
| 02 | `SavoirFaireSection` | 2 cartes prestations (Mains/Pieds) + bloc Nail Art | 2 photos |
| 03 | `GalerieSection` | Mosaïque desktop (5 cases) / grille 2 col. mobile (6) | 6 photos |
| 04 | `TemoignagesSection` | Note 4.8 + carrousel de 3 avis Planity | ❌ en dur |
| — | `CTASection` | Appel à réservation | ❌ |
| — | `ContactSection` | Adresse, horaires, Google Maps | ❌ |
| — | `Footer` | Mentions, liens | ❌ |

Les labels de section (`01 — La Maison`, `02 — Savoir-Faire`…) sont normalisés à
**13px / weight 400 / letter-spacing 0.3em / couleur `#C4998C`** — le client a
explicitement demandé cette taille après avoir jugé le 9px illisible.

### Galerie — attention aux deux grilles

`GalerieSection` rend **deux** grilles distinctes :
- desktop (`.desktop-md-grid`) : mosaïque asymétrique, n'affiche que les index **0 à 4** ;
- mobile (`.mobile-md-only`) : grille 2 colonnes, affiche les **6** photos.

Une photo uploadée dans le slot `galerie-5` n'apparaît donc **que sur mobile**.
C'est le comportement actuel — à harmoniser si le client le remarque.

---

## Espace admin

**URL** `/admin` · **Auth** mot de passe unique via `ADMIN_PASSWORD`

L'interface expose :

- **Textes** — tagline hero, citation, La Maison ¶1 et ¶2, avec bouton
  « Enregistrer les textes » (vert au succès).
- **Photos principales** — fond d'accueil, photo La Maison.
- **Photos prestations** — Beauté des Mains, Beauté des Pieds.
- **Galerie** — 6 emplacements.

Chaque emplacement photo accepte le glisser-déposer ou le clic, affiche un aperçu
immédiat et confirme par un badge « ✓ Enregistré ».

La page `/admin` est en `noindex, nofollow` (metadata dans `src/app/admin/layout.tsx`).

> `src/app/admin/layout.tsx` ne doit **jamais** contenir `<html>` ou `<body>` :
> un layout imbriqué qui les redéclare provoque une erreur d'hydratation React.

---

## Design system

### Palette

| Token | Hex | Usage |
|---|---|---|
| Blanc cassé | `#FAFAFA` | fond principal |
| Noir | `#111111` | texte, boutons pleins |
| Blush | `#E8D5CE` | accents, hover, séparateurs |
| Blush foncé | `#C4998C` | labels, prix, étoiles |
| Blush clair | `#F4EEEB` | fonds de section alternés |
| Gris texte | `#7A6E6B` | paragraphes secondaires |
| Bordure | `#D9BDB4` / `#F0E8E4` | contours de boutons / filets |

### Typographie

- **Cormorant Garamond** (`--font-cormorant`) — titres, prix, citations. Weight 300 dominant.
- **Jost** (`--font-jost`) — corps de texte, labels, boutons. Weight 300.

Les labels en capitales utilisent systématiquement un `letter-spacing` généreux
(`0.22em` à `0.3em`) — c'est la signature visuelle du site.

### Animations

Easing standard partout : `[0.25, 0.46, 0.45, 0.94]`.

En TypeScript, il **faut** typer explicitement, sinon Framer Motion refuse le tableau :

```ts
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
```

Composants réutilisables : `FadeInUp` (accepte `delay`, `className`, `style`),
`AnimatedText` (titres mot par mot), `RevealImage` (masque blush qui glisse).

---

## 🔴 Problèmes connus

Ces points sont **réels et non corrigés**. Ils sont documentés pour éviter qu'on les
redécouvre en production.

### 1. Les routes API n'ont aucune authentification — critique

`POST /api/upload` et `POST /api/content` **ne vérifient pas le mot de passe**.
Le login ne pose aucun cookie de session : `/api/admin/login` se contente de renvoyer
`{ ok: true }`, et l'état `auth` de la page admin est purement côté client.

**Conséquence :** n'importe qui connaissant l'URL peut téléverser une image ou réécrire
les textes du site avec un simple `curl`, sans jamais voir l'écran de connexion.

**Correction attendue :** poser un cookie httpOnly signé à la connexion et le vérifier
en tête de chaque route mutante, ou passer par le middleware Next.

### 2. L'ancienne adresse subsiste dans le SEO

L'adresse réelle est **10 Rue Kuhn**, mais `5 Place Arnold` traîne encore dans :

- `src/app/layout.tsx` — `description`, `keywords`, `openGraph.description`,
  et `streetAddress` du JSON-LD Schema.org ;
- `src/components/sections/ContactSection.tsx` — le `title` et l'URL de l'iframe
  Google Maps (les coordonnées GPS pointent également sur Place Arnold).

C'est le JSON-LD qui compte le plus : il alimente le référencement local Google.

### 3. Le stockage fichier ne survivra pas à Vercel

L'admin écrit dans `public/site-images.json`, `public/site-content.json` et
`public/uploads/` via `fs.writeFile`. **Cela fonctionne uniquement en local.**

En production sur Vercel, le système de fichiers est en lecture seule : les uploads
échoueront, et même s'ils réussissaient, tout serait écrasé au déploiement suivant.

**C'était le chantier en cours au moment de la rédaction.** `@vercel/blob` est installé
mais aucun code ne l'utilise encore. Migration prévue :

- images → **Vercel Blob** (`put()` renvoie une URL publique persistante) ;
- les deux JSON de config → **Vercel KV** (ou Blob également).

Il faudra aussi ajouter le domaine Blob dans `next.config.ts` → `images.remotePatterns`.

### 4. Domaines d'images obsolètes dans `next.config.ts`

`remotePatterns` autorise `images.unsplash.com` et `cdn.sanity.io`. Les placeholders
Unsplash ont tous été remplacés et Sanity n'est pas utilisé — ces entrées peuvent partir,
au profit du domaine Vercel Blob.

---

## Reste à faire

Par ordre de priorité :

1. **Sécuriser les routes API** (cf. problème n°1) — bloquant avant toute mise en ligne.
2. **Migrer le stockage vers Vercel Blob + KV** (cf. problème n°3) — bloquant pour que
   l'admin serve à quelque chose en production.
3. **Corriger l'adresse dans le SEO et la carte** (cf. problème n°2).
4. Déploiement Vercel : connecter le dépôt, définir `ADMIN_PASSWORD` dans les variables
   d'environnement du projet (le `.env.local` est gitignored et ne monte pas tout seul).
5. Remplacer les photos restantes par de vraies photos du salon (5 slots galerie sur 6
   sont encore vides).
6. Rendre les avis Planity éditables depuis l'admin (aujourd'hui en dur dans
   `TemoignagesSection.tsx`).
7. Nettoyage : supprimer `src/styles/globals.css`, désinstaller `next-sanity`,
   `@sanity/image-url` et `@studio-freight/lenis`.
8. Audit Lighthouse (objectif 95+), génération de `og-image.jpg`, `favicon.ico`
   et `apple-touch-icon.png` — référencés dans les metadata mais absents de `public/`.
9. Achat et branchement du nom de domaine (`adore-strasbourg.fr` est codé en dur
   comme `metadataBase`, sitemap et JSON-LD).

---

## Conventions de contribution

- **Langue** — code, commentaires et documentation en français.
- **Documentation des fonctions** — toute fonction non triviale (branchement, boucle,
  ou I/O) porte une docstring avec les quatre rubriques : `Quoi`, `Input`, `Output`,
  `Effets de bord`.
- **Style de code** — petites fonctions à responsabilité unique, imbrication max ~3
  niveaux (préférer les early returns), nommage explicite, aucun catch silencieux.
- **Git** — le propriétaire du dépôt gère lui-même les commits et les push.
  Ne pas committer sans demande explicite, et ne pas ajouter de co-auteur automatique
  aux messages de commit.
