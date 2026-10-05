import { gsap } from 'gsap';
import { REVEAL_EVENT } from './reveal';
import { framesToPreload } from './frames';

const ORIGIN = '1076 862'; // centre du diaphragme (coordonnées SVG)
const LEN = 2 * Math.PI * 580; // périmètre de l'anneau de progression

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let el: HTMLElement;
let ring: SVGCircleElement;
let countEl: HTMLElement;

/* ---------- Progression lissée ---------- */
// `ease` : vitesse de rattrapage (plus rapide pendant une navigation)
const state = { p: 0, target: 0, ease: 0.08 };
const setProgress = (v: number) => {
  state.target = Math.max(state.target, Math.min(100, v));
};
const render = () => {
  // Indépendant du framerate : `ease` est calibré pour 60 fps
  state.p += (state.target - state.p) * (1 - (1 - state.ease) ** gsap.ticker.deltaRatio(60));
  if (state.target - state.p < 0.05) state.p = state.target;
  countEl.textContent = String(Math.round(state.p)).padStart(2, '0');
  ring.style.strokeDashoffset = String(LEN * (1 - state.p / 100));
};
const progressDone = () =>
  new Promise<void>((res) => {
    const check = () => {
      if (state.p >= 100) {
        gsap.ticker.remove(check);
        res();
      }
    };
    gsap.ticker.add(check);
  });

/* ---------- Préchargement réel des images (hors lazy) d'un document ---------- */
// + la séquence de l'appareil photo si la page en contient une ([data-frame-sequence])
const preloadImages = (doc: Document, from: number, base: URL | string = location.href) => {
  const frames = doc.querySelector('[data-frame-sequence]') ? framesToPreload() : [];
  const srcs = [
    ...new Set(
      [...doc.images]
        .filter((img) => img.getAttribute('loading') !== 'lazy' && img.getAttribute('src'))
        .map((img) => img.getAttribute('src')!)
        .concat(frames)
        .map((src) => new URL(src, base).href),
    ),
  ];
  if (!srcs.length) return Promise.resolve();
  let done = 0;
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((res) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            setProgress(from + (++done / srcs.length) * (100 - from));
            res();
          };
          img.src = src;
        }),
    ),
  ).then(() => undefined);
};

/* ---------- Timelines ---------- */
let intro: gsap.core.Timeline;
let idle: gsap.core.Timeline;
let current: gsap.core.Timeline | null = null;

const resetMark = () => {
  gsap.set('#aperture, #lens', { rotation: 0, scale: 1, autoAlpha: 1, svgOrigin: ORIGIN });
  gsap.set('.ring-track, .ring-progress', { scale: 1, autoAlpha: 1, svgOrigin: ORIGIN });
  gsap.set('#pixels path', { x: 0, y: 0, scale: 1, autoAlpha: 1 });
  gsap.set('#loader .counter', { opacity: 0 });
  state.p = state.target = 0;
  render();
};

const buildTimelines = () => {
  // 1. INTRO : ouverture de l'obturateur
  intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  intro
    // Les lames apparaissent une à une dans le sens horaire, en tournant depuis le centre
    .from('#aperture path', {
      autoAlpha: 0,
      scale: 0.2,
      rotation: -70,
      svgOrigin: ORIGIN,
      duration: 1.2,
      // ordre horaire autour du cercle (data-o = angle normalisé 0→1)
      stagger: (_i, target) => parseFloat(target.dataset.o) * 1.1,
    })
    // Rotation d'ensemble : l'obturateur se « visse » en place
    .from('#aperture', { rotation: -90, svgOrigin: ORIGIN, duration: 2, ease: 'power4.out' }, 0)
    // Objectif central : mise au point
    .from('#lens path', { autoAlpha: 0, scale: 1.6, svgOrigin: ORIGIN, duration: 0.9, stagger: 0.04, ease: 'power3.out' }, 0.7)
    // Pixels : ils s'échappent du diaphragme vers le haut-droite
    .from(
      '#pixels path',
      {
        autoAlpha: 0,
        scale: 0,
        x: -140,
        y: 140,
        transformOrigin: '50% 50%',
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: (_i, target) => ((parseFloat(target.dataset.o) - 500) / 300) * 0.45,
      },
      1.1,
    )
    .to('#loader .counter', { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, 1.2);

  // Boucle d'attente
  idle = gsap.timeline({ paused: true, repeat: -1 });
  idle
    .to('#aperture', { rotation: '+=360', svgOrigin: ORIGIN, duration: 24, ease: 'none' }, 0)
    .to('#pixels path', { opacity: 0.55, duration: 0.6, ease: 'sine.inOut', stagger: { each: 0.25, repeat: 1, yoyo: true } }, 0);
};

/** Joue l'intro du diaphragme ; `speed` > 1 pour la version courte (navigation). */
const playIntro = (speed: number) =>
  new Promise<void>((res) => {
    if (reduce()) {
      intro.progress(1).pause();
      return res();
    }
    intro.timeScale(speed).restart();
    intro.eventCallback('onComplete', () => {
      idle.restart();
      res();
    });
  });

/* ---------- 3. SORTIE : fermeture de l'obturateur, révélation de la page ---------- */
const reveal = async (delay = 0.35) => {
  setProgress(100);
  await progressDone();
  gsap.ticker.remove(render);
  idle.pause();

  current?.kill();
  current = gsap
    .timeline({ delay })
    .to('#loader .counter', { opacity: 0, duration: 0.3 })
    .to('.ring-track, .ring-progress', { autoAlpha: 0, scale: 1.08, svgOrigin: ORIGIN, duration: 0.5, ease: 'power2.in' }, '<')
    .to('#pixels path', { autoAlpha: 0, scale: 0, x: -140, y: 140, transformOrigin: '50% 50%', duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in' }, '<')
    .to('#lens', { scale: 0, svgOrigin: ORIGIN, duration: 0.45, ease: 'power3.in' }, '<0.1')
    .to('#aperture', { rotation: '+=120', scale: 0, svgOrigin: ORIGIN, duration: 0.8, ease: 'expo.in' }, '<0.05')
    .add('open', '-=0.35')
    // Signale aux animations de page (src/scripts/reveal.ts) que la page devient visible
    .call(() => document.dispatchEvent(new Event(REVEAL_EVENT)), undefined, 'open')
    .to(el, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' }, 'open')
    .add(() => el.classList.add('is-hidden'))
    .from('main', { opacity: 0, scale: 0.98, duration: 1, ease: 'power3.out', clearProps: 'all' }, '-=0.45');

  if (reduce()) current.progress(1);
};

/* ---------- Couverture de l'écran avant un changement de page ---------- */
const cover = async () => {
  current?.kill();
  intro.pause();
  idle.pause();
  resetMark();
  state.ease = 0.2;
  gsap.ticker.add(render);
  el.classList.remove('is-hidden');

  if (reduce()) {
    gsap.set(el, { clipPath: 'circle(150% at 50% 50%)' });
  } else {
    await gsap.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: 0.5, ease: 'expo.inOut' });
  }
  await playIntro(2.5);
};

let navigating = false;

export function initLoader() {
  el = document.getElementById('loader')!;
  ring = el.querySelector('.ring-progress')!;
  countEl = document.getElementById('count')!;

  gsap.set(ring, { strokeDasharray: LEN, strokeDashoffset: LEN });
  gsap.set('#mark', { visibility: 'visible' });
  buildTimelines();

  /* Premier chargement : intro complète + progression réelle (images + polices) */
  gsap.ticker.add(render);
  Promise.all([
    playIntro(1),
    preloadImages(document, 0),
    document.fonts.ready,
  ]).then(() => reveal());

  /* Navigations (Astro ClientRouter) : on couvre l'écran pendant le fetch
     et le préchargement des images de la page suivante. */
  document.addEventListener('astro:before-preparation', (e) => {
    navigating = true;
    const originalLoader = e.loader;
    e.loader = async () => {
      const covered = cover();
      // Plancher de progression calé sur l'animation de couverture (0 → 60 %),
      // les 40 % restants suivent le préchargement réel des images.
      gsap.to({}, { duration: 1.4, ease: 'power1.out', onUpdate() { setProgress(this.progress() * 60); } });
      await originalLoader();
      await Promise.all([covered, e.newDocument ? preloadImages(e.newDocument, 60, e.to) : undefined]);
    };
  });

  document.addEventListener('astro:page-load', () => {
    if (!navigating) return;
    navigating = false;
    reveal(0.1);
  });
}
