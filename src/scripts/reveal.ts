import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Émis par le loader au moment où l'obturateur s'ouvre sur la page. */
export const REVEAL_EVENT = 'overxp:reveal';

let ctx: gsap.Context | null = null;

const setup = () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ctx = gsap.context(() => {
    // Apparition en fondu-montée des blocs marqués [data-reveal], par lots au scroll
    gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true }),
    });

    // Vue éclatée du hero : léger zoom d'entrée puis parallaxe au scroll
    gsap.from('.hero-camera', { scale: 0.92, autoAlpha: 0, duration: 1.4, ease: 'expo.out' });
    gsap.from('.hero-note', { autoAlpha: 0, x: (i) => (i === 1 ? 30 : -30), duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.5 });
    gsap.to('.hero-camera', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-camera', start: 'top 30%', end: 'bottom top', scrub: true },
    });

    // Compteurs des chiffres clés
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const prefix = el.textContent!.trim().startsWith('+') ? '+' : '';
      const obj = { v: 0 };
      el.textContent = `${prefix}0`;
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = `${prefix}${Math.round(obj.v)}`),
      });
    });
  });
};

document.addEventListener('astro:page-load', () => {
  document.addEventListener(REVEAL_EVENT, setup, { once: true });
});

document.addEventListener('astro:before-swap', () => {
  ctx?.revert();
  ctx = null;
});
