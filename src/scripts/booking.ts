import { mailtoUrl, whatsappUrl } from '../data/contact';

/**
 * Envoi du formulaire sans backend :
 * - si PUBLIC_BOOKING_ENDPOINT est défini (Formspree, Web3Forms…), la demande est postée en JSON
 *   (PUBLIC_BOOKING_ACCESS_KEY est ajoutée en `access_key` pour Web3Forms) ;
 * - sinon, ou en cas d'échec, le dossier est rédigé et proposé en envoi WhatsApp / e-mail.
 */
const ENDPOINT = import.meta.env.PUBLIC_BOOKING_ENDPOINT as string | undefined;
const ACCESS_KEY = import.meta.env.PUBLIC_BOOKING_ACCESS_KEY as string | undefined;

function initBooking() {
  const form = document.getElementById('booking-form') as HTMLFormElement | null;
  if (!form) return;

  const select = form.elements.namedItem('prestation') as HTMLSelectElement;
  const cards = [...document.querySelectorAll<HTMLButtonElement>('.service-card')];
  const $ = (id: string) => document.getElementById(id)!;

  /* ---------- Cartes de prestation ⇄ liste déroulante ---------- */
  const syncCards = () => cards.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.service === select.value)));
  cards.forEach((card) =>
    card.addEventListener('click', () => {
      select.value = card.dataset.service!;
      syncCards();
      $('formulaire').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }),
  );
  select.addEventListener('change', syncCards);

  // Pré-sélection via ?prestation=mariages
  const preset = new URLSearchParams(location.search).get('prestation');
  if (preset && [...select.options].some((o) => o.value === preset)) {
    select.value = preset;
    syncCards();
  }

  // Pas de date passée
  const date = form.elements.namedItem('date') as HTMLInputElement;
  date.min = new Date().toLocaleDateString('en-CA'); // AAAA-MM-JJ, heure locale

  /* ---------- Rédaction du dossier ---------- */
  const optionLabel = (name: string) => {
    const el = form.elements.namedItem(name) as HTMLSelectElement;
    return el.selectedOptions[0]?.textContent?.trim() ?? '';
  };
  const summary = () => {
    const data = new FormData(form);
    const d = new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return {
      subject: `Réservation OverXP — ${optionLabel('prestation')} — ${data.get('nom')}`,
      fields: {
        Nom: String(data.get('nom')),
        'E-mail': String(data.get('email')),
        Téléphone: String(data.get('telephone')),
        Prestation: optionLabel('prestation'),
        Date: d,
        Lieu: optionLabel('lieu'),
        Format: optionLabel('format'),
        Vision: String(data.get('vision') || '—'),
      },
    };
  };
  const asText = (fields: Record<string, string>) =>
    `Bonjour Olivier,\n\nJe souhaite réserver une séance avec OverXP :\n\n${Object.entries(fields)
      .map(([k, v]) => `• ${k} : ${v}`)
      .join('\n')}\n\nMerci,`;

  /* ---------- États ---------- */
  const actions = $('booking-actions');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const setLoading = (loading: boolean) => {
    button.disabled = loading;
    button.querySelector('[data-label]')!.textContent = loading ? 'Transmission du dossier…' : 'Réserver votre expérience';
    const icon = button.querySelector('[data-icon]')!;
    icon.textContent = loading ? 'progress_activity' : 'arrow_forward';
    icon.classList.toggle('animate-spin', loading);
  };
  const show = (panel: 'booking-sent' | 'booking-handoff', note?: string) => {
    actions.hidden = true;
    form.querySelectorAll('fieldset').forEach((f) => (f.disabled = true));
    if (note) $('booking-handoff-text').textContent = note;
    $(panel).hidden = false;
    $(panel).scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const handoff = (note?: string) => {
    const { subject, fields } = summary();
    const text = asText(fields);
    $('booking-whatsapp').setAttribute('href', whatsappUrl(text));
    $('booking-email').setAttribute('href', mailtoUrl(subject, text));
    show('booking-handoff', note);
  };

  $('booking-edit').addEventListener('click', () => {
    $('booking-handoff').hidden = true;
    actions.hidden = false;
    form.querySelectorAll('fieldset').forEach((f) => (f.disabled = false));
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Soumission ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = $('booking-invalid');
    if (!form.checkValidity()) {
      invalid.hidden = false;
      form.reportValidity();
      return;
    }
    invalid.hidden = true;
    if ((form.elements.namedItem('_gotcha') as HTMLInputElement).value) return; // robot

    if (!ENDPOINT) return handoff();

    setLoading(true);
    try {
      const { subject, fields } = summary();
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...(ACCESS_KEY && { access_key: ACCESS_KEY }), subject, _subject: subject, email: fields['E-mail'], ...fields }),
      });
      if (!res.ok) throw new Error(String(res.status));
      show('booking-sent');
    } catch {
      handoff("L'envoi automatique n'a pas abouti. Envoyez votre dossier directement : le message est déjà rédigé.");
    } finally {
      setLoading(false);
    }
  });
}

document.addEventListener('astro:page-load', initBooking);
