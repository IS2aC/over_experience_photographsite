import { CONTACT, mailtoUrl, whatsappUrl } from '../data/contact';

/** Page Contact : horloge du studio + demande de tirage pré-remplie depuis la galerie. */
function initContact() {
  const clock = document.getElementById('studio-clock');
  if (!clock) return;

  /* ---------- Horloge d'Abidjan ---------- */
  const status = document.getElementById('studio-status')!;
  const fmt = new Intl.DateTimeFormat('fr-FR', { timeZone: CONTACT.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now);
    clock.setAttribute('datetime', now.toISOString());
    const hour = Number(fmt.formatToParts(now).find((p) => p.type === 'hour')!.value);
    status.textContent = hour >= 8 && hour < 20 ? 'Studio ouvert' : 'Studio fermé · réponse dès demain';
  };
  tick();
  const timer = setInterval(tick, 1000);
  document.addEventListener('astro:before-swap', () => clearInterval(timer), { once: true });

  /* ---------- Demande de tirage (?sujet=tirage&oeuvre=…) ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get('sujet') !== 'tirage') return;

  const oeuvre = params.get('oeuvre')?.trim();
  const subject = oeuvre ? `Demande de tirage d'art — ${oeuvre}` : "Demande du catalogue des tirages d'art";
  const message = oeuvre
    ? `Bonjour Olivier,\n\nJe souhaite acquérir un tirage de l'œuvre « ${oeuvre} ». Pourriez-vous m'indiquer les formats, finitions et tarifs disponibles ?\n\nMerci,`
    : `Bonjour Olivier,\n\nJe souhaite recevoir le catalogue de vos tirages d'art numérotés (formats, finitions et tarifs).\n\nMerci,`;

  const banner = document.getElementById('print-request')!;
  document.getElementById('print-request-title')!.textContent = oeuvre ? `« ${oeuvre} »` : 'Catalogue des tirages';
  document.getElementById('print-request-whatsapp')!.setAttribute('href', whatsappUrl(message));
  document.getElementById('print-request-email')!.setAttribute('href', mailtoUrl(subject, message));
  banner.hidden = false;
}

document.addEventListener('astro:page-load', initContact);
