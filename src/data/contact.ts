/**
 * Coordonnées d'OverXP — source unique pour la page Contact, le footer et les liens pré-remplis.
 *
 * ⚠️ À REMPLACER : les valeurs ci-dessous viennent de la maquette Stitch (fictives).
 */
export const CONTACT = {
  /** Numéro WhatsApp au format international, chiffres uniquement (utilisé pour wa.me) */
  whatsapp: '2250748001200',
  phoneDisplay: '+225 07 48 00 12 00',
  email: 'olivier@overxp.ci',
  instagramPerso: 'olivierkouassi',
  instagramStudio: 'overxp.officiel',
  city: "Abidjan, Côte d'Ivoire",
  timeZone: 'Africa/Abidjan',
} as const;

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoUrl = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${CONTACT.email}${query ? `?${query}` : ''}`;
};
