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

## 3. Contact (`/contact`)

- [ ] Intégration de la maquette
- [ ] Formulaire sans backend (à choisir : Formspree / Web3Forms / Netlify Forms)
- [ ] Pré-remplir le sujet depuis `?sujet=tirage&oeuvre=…` (liens « Commander ce tirage » de la galerie)
- [ ] Liens réseaux, e-mail, WhatsApp

## 4. Réserver (`/reserver`)

- [ ] Intégration de la maquette (sélection de prestation, date, infos)
- [ ] Envoi sans backend (même service que Contact) ou embed Cal.com / Calendly

## 5. Finitions & mise en ligne

- [ ] SEO : meta Open Graph, sitemap (`@astrojs/sitemap`), robots.txt
- [ ] Favicon / icônes à partir du logo officiel (l'onglet utilise encore l'ancien pictogramme)
- [ ] Audit Lighthouse (perf, accessibilité)
- [ ] Déploiement (Netlify / Vercel / Cloudflare Pages — build `npm run build`, dossier `dist/`)
