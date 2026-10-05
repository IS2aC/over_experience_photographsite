import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FRAME_COUNT, frameUrl } from './frames';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero de l'accueil : l'appareil se décompose au scroll vers le bas et se recompose vers le haut.
 * La section est épinglée pendant la séquence ; les images sont déjà en cache grâce au loader.
 */
function initSequence() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-frame-sequence]');
  if (!canvas) return;
  const section = canvas.closest<HTMLElement>('.hero-pin')!;
  const ctx2d = canvas.getContext('2d')!;
  const counter = section.querySelector<HTMLElement>('[data-sequence-progress]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const frames: HTMLImageElement[] = [];
  let current = -1;

  const draw = (index: number) => {
    const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));
    if (i === current) return;
    const img = frames[i];
    if (!img?.complete || !img.naturalWidth) return; // pas encore chargée : on garde l'image précédente
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
    ctx2d.drawImage(img, 0, 0);
    current = i;
    if (counter) counter.textContent = String(Math.round((i / (FRAME_COUNT - 1)) * 100)).padStart(2, '0');
  };

  const load = (i: number) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = frameUrl(i);
    frames[i] = img;
    return img;
  };

  // Animations réduites : vue éclatée finale, sans épinglage
  if (reduce) {
    const last = load(FRAME_COUNT - 1);
    last.onload = () => draw(FRAME_COUNT - 1);
    return;
  }

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = load(i);
    if (i === 0) img.onload = () => draw(0);
  }
  // Si une image arrive pendant qu'on est dessus, on la dessine
  const state = { frame: 0 };
  frames.forEach((img, i) => img.addEventListener('load', () => i === Math.round(state.frame) && ((current = -1), draw(i))));

  const notes = gsap.utils.toArray<HTMLElement>('.hero-note', section);
  const mm = gsap.matchMedia();

  const scope = gsap.context(() => {
    gsap.set(notes, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top 80px', // sous le header fixe
        end: () => `+=${Math.round(innerHeight * 1.6)}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // La décomposition occupe toute la course de scroll…
    tl.to(state, { frame: FRAME_COUNT - 1, duration: 1, onUpdate: () => draw(state.frame) }, 0);
    // …et les annotations techniques apparaissent quand les pièces se séparent
    notes.forEach((note, i) => {
      tl.fromTo(note, { autoAlpha: 0, x: i === 1 ? 30 : -30 }, { autoAlpha: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.55 + i * 0.13);
    });

    // Léger zoom de l'appareil pendant la décomposition (desktop)
    mm.add('(min-width: 1024px)', () => {
      tl.fromTo(canvas, { scale: 0.92 }, { scale: 1.04, duration: 1 }, 0);
    });
  });

  document.addEventListener(
    'astro:before-swap',
    () => {
      scope.revert();
      mm.revert();
    },
    { once: true },
  );
}

document.addEventListener('astro:page-load', initSequence);
