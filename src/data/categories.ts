/** Catégories de la galerie, dans l'ordre des onglets de filtre. */
export const CATEGORIES = {
  mariages: 'Mariages',
  portraits: 'Portraits',
  mode: 'Mode',
  architecture: 'Architecture',
  urbain: 'Urbain',
  culture: 'Culture',
  evenements: 'Événements',
  produits: 'Produits',
} as const;

export type Category = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [Category, ...Category[]];
