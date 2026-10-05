// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// URL publique du site (sitemap, liens canoniques, Open Graph).
// ⚠️ À remplacer par le vrai domaine, ou à définir via la variable d'environnement SITE_URL au déploiement.
const SITE_URL = process.env.SITE_URL ?? 'https://www.overxp.ci';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
