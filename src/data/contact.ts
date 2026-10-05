/**
 * Coordonnées d'OverXP — source unique pour la page Contact, le footer et les liens pré-remplis.
 *
 * ⚠️ L'e-mail est encore fictif (maquette Stitch) : à remplacer.
 */
export const CONTACT = {
  /** Numéro WhatsApp au format international, chiffres uniquement (utilisé pour wa.me) */
  whatsapp: '2250103580486',
  phoneDisplay: '+225 01 03 58 04 86',
  email: 'olivier@overxp.ci',
  instagram: 'olivier_kouassi_photography',
  tiktok: 'olivierkouassi01',
  /** Villes où OverXP est représenté (ordre d'affichage) */
  cities: ['Abidjan', 'Bouaké'],
  country: "Côte d'Ivoire",
  timeZone: 'Africa/Abidjan',
} as const;

/** « Abidjan & Bouaké » */
export const CITIES = CONTACT.cities.join(' & ');

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;
/** Pseudo coupable proprement : retour à la ligne autorisé après chaque « _ » (à utiliser avec set:html) */
export const breakableHandle = (handle: string) => `@${handle.replaceAll('_', '_<wbr>')}`;

export const tiktokUrl = (handle: string) => `https://www.tiktok.com/@${handle}`;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoUrl = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${CONTACT.email}${query ? `?${query}` : ''}`;
};
