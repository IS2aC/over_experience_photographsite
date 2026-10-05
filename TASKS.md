# OverXP — Plan de travail

Stack : **Astro 7** (site statique) · **Tailwind CSS 4** · **GSAP** · Montserrat (fontsource) · View Transitions (`ClientRouter`)
Maquette : [Stitch — OverXP Portfolio & Booking](https://stitch.withgoogle.com/projects/947412879523867683)

```bash
npm run dev      # http://localhost:4321
npm run build    # sortie statique dans dist/
```

## 0. Fondations ✅

- [x] Projet Astro + Tailwind 4 + GSAP, Node 22 (`.nvmrc`)
- [x] Design system Stitch → tokens Tailwind `@theme` (`src/styles/global.css`) : les classes de la maquette marchent telles quelles
- [x] Layout commun (`src/layouts/Layout.astro`), header + menu mobile, footer
- [x] Routes : `/`, `/oeuvres`, `/contact`, `/reserver`
- [x] Loader obturateur (`src/components/Loader.astro` + `src/scripts/loader.ts`)
  - premier chargement : intro complète + progression réelle (images + polices)
  - à chaque navigation : fermeture en cercle → diaphragme → préchargement des images de la page suivante → ouverture
  - respecte `prefers-reduced-motion`

## 1. Accueil (`/`) ✅

- [x] Hero « Over Experience » fond blanc studio + vue éclatée Nikon et annotations 01/02/03 (`src/components/home/Hero.astro`)
- [x] Manifeste + signature d'Olivier Kouassi
- [x] Les 4 piliers de l'atelier
- [x] Chiffres clés (compteurs animés)
- [x] Œuvres choisies (triptyque asymétrique)
- [x] CTA « Créons ensemble »
- [x] Images rapatriées en local et optimisées (`src/assets/home/`, `astro:assets`)
- [x] Animations au scroll (GSAP ScrollTrigger, `src/scripts/reveal.ts`), synchronisées avec l'ouverture du loader
- [ ] Remplacer les photos de démo Stitch (L'Or d'Assinie, Couronnement d'amour) par de vraies œuvres
- [ ] Valider les textes et chiffres (+500 séances, +10 ans, +300 clients)

## 2. Œuvres (`/oeuvres`) ✅

- [x] En-tête éditorial + onglets de filtre (générés depuis les catégories réellement utilisées)
- [x] Étagère 3D : un livre = une série (texture de la tranche = photo de couverture)
- [x] Visionneuse plein écran (`<dialog>` accessible) : clavier ←/→/Échap, balayage tactile, préchargement, EXIF
- [x] Grille « Archives & expositions » + CTA tirages d'art
- [x] Content collection `src/content/oeuvres/*.yaml` : ajouter une série = déposer les photos + un fichier YAML
- [x] Vraies photos d'Olivier (`me/oeuvres/`) : séries Yamoussoukro (23/12/2024) et Abidjan Plateau (27/12/2024)
- [ ] Remplacer les séries démo (`demo: true` : Souveraine d'Assinie, Épousailles Royales, L'Œil du Créateur)
- [ ] Valider titres / textes des séries réelles

## 3. Contact (`/contact`) ✅

- [x] En-tête « L'auteur & le regard », portrait d'Olivier + manifeste, carte atelier
- [x] Canaux directs : WhatsApp (direct chat), Instagram, TikTok
- [x] Pas de formulaire (conforme à la maquette) : demandes de tirage via `?sujet=tirage&oeuvre=…`
      → bandeau avec message WhatsApp / e-mail pré-rédigé (sans backend)
- [x] Coordonnées centralisées dans `src/data/contact.ts` (aussi utilisées par le footer)
- [x] Vraies coordonnées : WhatsApp +225 01 03 58 04 86, Instagram @olivier_kouassi_photography, TikTok @olivierkouassi01
- [ ] **E-mail** encore fictif (`olivier@overxp.ci`) — utilisé par les boutons e-mail pré-remplis (tirages, réservation)

## 4. Réserver (`/reserver`) ✅

- [x] Hero « Capturons vos moments avec nous » + barre HUD
- [x] 6 prestations signature : cliquer une carte pré-sélectionne le formulaire (et `?prestation=<id>`)
- [x] Formulaire en 3 étapes (identité, logistique, vision) avec validation, dates passées bloquées, anti-spam
- [x] Envoi sans backend : dossier rédigé → WhatsApp / e-mail pré-remplis
- [x] Option service de formulaire via `PUBLIC_BOOKING_ENDPOINT` (Formspree / Web3Forms, voir `.env.example`)
- [x] Bandeau conciergerie (WhatsApp, bureau, Instagram)
- [x] Visuel « Book with us » remplacé : l'affiche de la maquette appartient à « Louis Photography » (marque et n° +234 d'un tiers)
- [ ] Choisir : rester en WhatsApp/e-mail, ou brancher Formspree / Web3Forms (compte gratuit à créer)
- [ ] Valider prestations, lieux et formats de restitution

## 5. Finitions & mise en ligne

- [x] Animation de l'appareil au scroll (accueil) : 72 images extraites de la vidéo (`public/frames/1280` et `/768`),
      hero épinglé, décomposition ↓ / recomposition ↑, préchargement par le loader, repli animations réduites
- [x] SEO : URL canonique, Open Graph / Twitter (image `public/og-image.jpg`), données structurées Schema.org
      (`ProfessionalService`, villes desservies), `sitemap-index.xml`, `robots.txt`, page 404
- [x] Icônes : favicon, apple-touch-icon, icônes 192/512 + `site.webmanifest` depuis le logo officiel
- [x] Performance : police Montserrat préchargée, police d'icônes réduite aux seules icônes utilisées, zéro CLS
- [x] Accessibilité : animations d'apparition en opacité seule (contenu toujours lu par les lecteurs d'écran)
- [x] Audit Lighthouse (build de production) : 97–100 en performance mobile, 100 partout ailleurs (accessibilité, bonnes pratiques, SEO)
- [ ] **Domaine** : remplacer `https://www.overxp.ci` (astro.config.mjs) ou définir `SITE_URL` au déploiement
- [ ] Déploiement (Netlify / Vercel / Cloudflare Pages — build `npm run build`, dossier `dist/`, Node 22)
