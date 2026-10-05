import { mailtoUrl, whatsappUrl } from '../data/contact';

/** Page Contact : demande de tirage pré-remplie depuis la galerie (?sujet=tirage&oeuvre=…). */
function initContact() {
  const banner = document.getElementById('print-request');
  if (!banner) return;

  /* ---------- Demande de tirage (?sujet=tirage&oeuvre=…) ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get('sujet') !== 'tirage') return;

  const oeuvre = params.get('oeuvre')?.trim();
  const subject = oeuvre ? `Demande de tirage d'art — ${oeuvre}` : "Demande du catalogue des tirages d'art";
  const message = oeuvre
    ? `Bonjour Olivier,\n\nJe souhaite acquérir un tirage de l'œuvre « ${oeuvre} ». Pourriez-vous m'indiquer les formats, finitions et tarifs disponibles ?\n\nMerci,`
    : `Bonjour Olivier,\n\nJe souhaite recevoir le catalogue de vos tirages d'art numérotés (formats, finitions et tarifs).\n\nMerci,`;

  document.getElementById('print-request-title')!.textContent = oeuvre ? `« ${oeuvre} »` : 'Catalogue des tirages';
  document.getElementById('print-request-whatsapp')!.setAttribute('href', whatsappUrl(message));
  document.getElementById('print-request-email')!.setAttribute('href', mailtoUrl(subject, message));
  banner.hidden = false;
}

document.addEventListener('astro:page-load', initContact);
