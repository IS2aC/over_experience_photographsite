import type { APIRoute } from 'astro';

// Généré au build pour pointer vers le sitemap du domaine configuré (astro.config.mjs → site)
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
