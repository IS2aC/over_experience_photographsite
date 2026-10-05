/**
 * Séquence de l'appareil photo qui se décompose (extraite de me/video-for-frame.mp4).
 * 72 images WebP (1 sur 2 de la vidéo à 24 i/s) en deux tailles : public/frames/1280 et public/frames/768.
 */
export const FRAME_COUNT = 72;

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const frameWidth = () => (matchMedia('(min-width: 768px)').matches ? 1280 : 768);

export const frameUrl = (index: number) => `/frames/${frameWidth()}/${String(index + 1).padStart(3, '0')}.webp`;

/** Images à précharger par le loader : toute la séquence, ou seulement la vue éclatée finale si animations réduites. */
export const framesToPreload = () =>
  reduceMotion() ? [frameUrl(FRAME_COUNT - 1)] : Array.from({ length: FRAME_COUNT }, (_, i) => frameUrl(i));
