/** Prestations proposées à la réservation (cartes + liste déroulante du formulaire). */
export const SERVICES = [
  {
    id: 'mariages',
    icon: 'favorite',
    title: 'Mariages & cérémonies',
    text: "Cérémonies, réceptions et instants d'émotion, des préparatifs au dernier regard.",
    meta: 'Couverture complète',
  },
  {
    id: 'studio',
    icon: 'light_mode',
    title: 'Portraits studio & clair-obscur',
    text: "Portraits d'artistes, dirigeants, figures publiques et stylisme éditorial avec modelage de lumière cinématique.",
    meta: 'Studio privé',
  },
  {
    id: 'diplomes',
    icon: 'school',
    title: 'Séances diplômes & familles',
    text: 'Consécration académique, portraits de famille et célébrations multigénérationnelles, immortalisées avec élégance.',
    meta: 'Session sur mesure',
  },
  {
    id: 'exterieur',
    icon: 'landscape',
    title: 'Photographie extérieur & architecture',
    text: "Lagunes d'Abidjan, cité historique de Grand-Bassam, rivages d'Assinie et architectures modernes.",
    meta: 'Extérieur / site dédié',
  },
  {
    id: 'galas',
    icon: 'celebration',
    title: 'Événements de prestige & galas',
    text: "Sommets économiques, dîners de bienfaisance, vernissages d'art et grandes cérémonies protocolaires.",
    meta: 'Discrétion protocolaire',
  },
  {
    id: 'produits',
    icon: 'diamond',
    title: 'Produits & campagnes de luxe',
    text: 'Joaillerie, haute parfumerie, collections capsules textiles et packshots éditoriaux haute résolution.',
    meta: 'Direction commerciale',
  },
] as const;

/** Option supplémentaire de la liste déroulante (sans carte). */
export const SPECIAL_ORDER = { id: 'commande-speciale', title: 'Commande spéciale & scénographie unique' } as const;

export const LOCATIONS = [
  { id: 'abidjan', label: 'Abidjan (studio & résidences privées)' },
  { id: 'bouake', label: 'Bouaké & centre du pays' },
  { id: 'bassam', label: 'Grand-Bassam (quartier France & littoral)' },
  { id: 'assinie', label: "Assinie & presqu'île" },
  { id: 'yamoussoukro', label: 'Yamoussoukro / terres intérieures' },
  { id: 'international', label: 'Destination internationale' },
] as const;

export const FORMATS = [
  { id: 'fichiers', label: 'Fichiers HD + galerie en ligne' },
  { id: 'tirages', label: 'Coffret de tirages fine art' },
  { id: 'livre', label: "Livre d'art de collection" },
  { id: 'integrale', label: "Intégrale : livre + tirages + fichiers" },
] as const;
