import { gsap } from 'gsap';

interface Photo {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  exif: string;
  grayscale: boolean;
}
interface Volume {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  categories: string[];
  year: number;
  location: string;
  client: string;
  description: string;
  photos: Photo[];
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Page Œuvres : filtres, étagère et visionneuse. Rebranché à chaque navigation (ClientRouter). */
function initGallery() {
  const dataEl = document.getElementById('viewer-data');
  const viewer = document.getElementById('viewer') as HTMLDialogElement | null;
  if (!dataEl || !viewer) return;

  const volumes: Volume[] = JSON.parse(dataEl.textContent!);
  const byId = new Map(volumes.map((v) => [v.id, v]));
  const books = [...document.querySelectorAll<HTMLElement>('.book-spine')];
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('.filter-tab')];
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  // Écouteurs globaux retirés au changement de page
  const abort = new AbortController();
  document.addEventListener('astro:before-swap', () => { abort.abort(); viewer.close(); }, { once: true });

  /* ---------- Filtres ---------- */
  let filter = 'all';
  const isVisible = (v: Volume) => filter === 'all' || v.categories.includes(filter);

  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      filter = tab.dataset.filter!;
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      const shown = books.filter((b) => {
        const visible = isVisible(byId.get(b.dataset.volume!)!);
        b.hidden = !visible;
        return visible;
      });
      gsap.fromTo(shown, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', clearProps: 'transform' });
      $('bookshelf-track').scrollTo({ left: 0 });
    }),
  );

  /* ---------- Défilement de l'étagère ---------- */
  const track = $('bookshelf-track');
  $('shelf-prev').addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));
  $('shelf-next').addEventListener('click', () => track.scrollBy({ left: 260, behavior: 'smooth' }));

  /* ---------- Visionneuse ---------- */
  // Liste à plat des photos des volumes visibles : on peut parcourir toute la sélection
  let slides: { volume: Volume; photo: Photo; i: number }[] = [];
  let current = 0;
  const img = $<HTMLImageElement>('viewer-img');

  const preload = (k: number) => {
    const s = slides[(k + slides.length) % slides.length];
    if (!s) return;
    const im = new Image();
    im.sizes = '(min-width: 1024px) 58vw, 100vw';
    im.srcset = s.photo.srcset;
  };

  const render = (k: number) => {
    current = (k + slides.length) % slides.length;
    const { volume: v, photo: p, i } = slides[current];

    img.style.opacity = '0';
    img.onload = () => (img.style.opacity = '1');
    img.width = p.width;
    img.height = p.height;
    img.sizes = '(min-width: 1024px) 58vw, 100vw';
    img.srcset = p.srcset;
    img.src = p.src;
    img.alt = p.alt;
    img.classList.toggle('grayscale', p.grayscale);
    if (img.complete) img.style.opacity = '1';

    $('viewer-index').textContent = `${pad(i + 1)} / ${pad(v.photos.length)}`;
    $('viewer-category').textContent = v.categoryLabel;
    $('viewer-year').textContent = String(v.year);
    $('viewer-title').textContent = v.title;
    $('viewer-sub').textContent = v.subtitle;
    $('viewer-photo-title').textContent = p.title;
    $('viewer-desc').textContent = v.description;
    $('viewer-location').textContent = v.location;
    $('viewer-client').textContent = v.client;
    $('viewer-exif').textContent = p.exif;
    $('viewer-exif-row').hidden = !p.exif;
    $<HTMLAnchorElement>('viewer-order').href = `/contact?sujet=tirage&oeuvre=${encodeURIComponent(`${v.title} — ${p.title}`)}`;

    preload(current + 1);
    preload(current - 1);
  };

  const open = (volumeId: string) => {
    const target = byId.get(volumeId)!;
    const pool = isVisible(target) ? volumes.filter(isVisible) : volumes;
    slides = pool.flatMap((volume) => volume.photos.map((photo, i) => ({ volume, photo, i })));
    render(slides.findIndex((s) => s.volume.id === volumeId));
    viewer.showModal();
    document.documentElement.style.overflow = 'hidden';
    gsap.fromTo(viewer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.viewer-panel', { y: 30, scale: 0.98 }, { y: 0, scale: 1, duration: 0.6, ease: 'expo.out' });
  };

  const close = () => {
    gsap.to(viewer, { autoAlpha: 0, duration: 0.25, ease: 'power2.in', onComplete: () => viewer.close() });
  };

  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    gsap.set(viewer, { clearProps: 'opacity,visibility' });
  });
  viewer.addEventListener('cancel', (e) => { e.preventDefault(); close(); }); // Échap : sortie animée
  viewer.addEventListener('click', (e) => { if (e.target === viewer) close(); });
  viewer.querySelector('[data-viewer-close]')!.addEventListener('click', close);
  viewer.querySelector('[data-viewer-prev]')!.addEventListener('click', () => render(current - 1));
  viewer.querySelector('[data-viewer-next]')!.addEventListener('click', () => render(current + 1));

  document.addEventListener(
    'keydown',
    (e) => {
      if (!viewer.open) return;
      if (e.key === 'ArrowLeft') render(current - 1);
      if (e.key === 'ArrowRight') render(current + 1);
    },
    { signal: abort.signal },
  );

  // Balayage tactile
  let touchX = 0;
  img.parentElement!.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  img.parentElement!.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) render(current + (dx < 0 ? 1 : -1));
  });

  books.forEach((b) => b.addEventListener('click', () => open(b.dataset.volume!)));
  document.querySelectorAll<HTMLElement>('[data-open-volume]').forEach((b) => b.addEventListener('click', () => open(b.dataset.openVolume!)));
}

document.addEventListener('astro:page-load', initGallery);
