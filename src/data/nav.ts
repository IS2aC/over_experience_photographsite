export const NAV = [
  { href: '/', label: 'Accueil', footerLabel: 'Accueil' },
  { href: '/oeuvres', label: 'Œuvres', footerLabel: 'Galerie des Œuvres' },
  { href: '/contact', label: 'Contact', footerLabel: 'Contact & Réseaux' },
  { href: '/reserver', label: 'Réserver', footerLabel: 'Réserver un Shooting' },
] as const;

export const isActive = (href: string, pathname: string) =>
  href === '/' ? pathname === '/' : pathname.replace(/\/$/, '') === href;
