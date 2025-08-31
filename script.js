/* =========================
   Mobile nav toggle
========================= */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* =========================
   Reveal on scroll (IO + fallback)
========================= */
(() => {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  let io;
  try {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            void entry.target.offsetWidth;
            entry.target.classList.add('visible');
          });
          io.unobserve(entry.target);
          entry.target.__revealed = true;
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10%' });
    els.forEach(el => io.observe(el));
  } catch(e){ /* pas d'IO → fallback */ }

  const check = () => {
    const vh = window.innerHeight;
    els.forEach(el => {
      if (el.__revealed) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > vh * 0.12) {
        el.classList.add('visible');
        el.__revealed = true;
        if (io) io.unobserve(el);
      }
    });
  };
  document.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  check();
})();

/* =========================
   Smooth wheel scroll (desktop)
========================= */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = window.matchMedia('(pointer: coarse)').matches;
  if (reduce || touch) return; // pas sur mobile

  let y = window.scrollY;
  let v = 0;
  let raf = null;

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const maxY  = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  function tick() {
    v *= 0.86;                       // friction
    if (Math.abs(v) < 0.1) { v = 0; raf = null; return; }
    y = clamp(y + v, 0, maxY());
    window.scrollTo(0, y);
    raf = requestAnimationFrame(tick);
  }

  function onWheel(e) {
    if (e.ctrlKey || e.metaKey) return; // garde le zoom natif
    e.preventDefault();
    if (!raf) y = window.scrollY;
    v += e.deltaY * 0.25;
    if (!raf) raf = requestAnimationFrame(tick);
  }
  window.addEventListener('wheel', onWheel, { passive: false });
})();

/* =========================
   Footer year
========================= */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* =========================
   Lightbox
========================= */
(() => {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close" aria-label="Fermer">×</span>
    <img src="" alt="Image en grand">
    <div class="lightbox-controls">
      <button class="lightbox-btn prev" aria-label="Image précédente">❮</button>
      <button class="lightbox-btn next" aria-label="Image suivante">❯</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn  = lightbox.querySelector('.prev');
  const nextBtn  = lightbox.querySelector('.next');

  let gallery = [];
  let currentIndex = 0;

  function openLightbox(index, images) {
    gallery = Array.from(images);
    currentIndex = index;
    lightboxImg.src = gallery[currentIndex].src;
    lightbox.classList.add('active');
  }
  function closeLightbox() { lightbox.classList.remove('active'); lightboxImg.src = ''; }
  function show(i) { currentIndex = (i + gallery.length) % gallery.length; lightboxImg.src = gallery[currentIndex].src; }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  nextBtn.addEventListener('click', () => show(currentIndex + 1));
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'ArrowLeft')  show(currentIndex - 1);
  });

  const selectors = '.projects-grid img, .project-media img, .card-media img';
  document.querySelectorAll(selectors).forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const images = img.closest('.projects-grid, .project-media, .grid, .cards')?.querySelectorAll('img') || [img];
      const idx = images ? Array.from(images).indexOf(img) : 0;
      openLightbox(idx, images);
    });
  });
})();

/* =========================
   Custom cursor (dot) — smooth follow
   ========================= */
(() => {
  // Pas sur tactile
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  // Crée/attrape le point
  let dot = document.querySelector('.cursor');
  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'cursor';
    document.body.appendChild(dot);
  }

  // Position "cible" (souris) et position "courante" (dot)
  let tx = innerWidth / 2,  ty = innerHeight / 2; // target
  let x  = tx,               y  = ty;              // current
  const ease = 0.04;                                 // lissage (0.08–0.25)

  // Boucle d’animation (suivi lissé)
  let raf;
  function loop(){
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  // Mise à jour de la cible
  const show = () => dot.classList.remove('hidden');
  const hide = () => dot.classList.add('hidden');

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    show();
  }, { passive:true });

  window.addEventListener('mouseenter', show,  { passive:true });
  window.addEventListener('mouseleave', hide,  { passive:true });
  window.addEventListener('mousedown',  () => dot.classList.add('click'));
  window.addEventListener('mouseup',    () => dot.classList.remove('click'));

  // Grossit un peu sur éléments interactifs (comme avant)
  const interactive = 'a,button,.btn,input,textarea,select,label,[role="button"],summary';
  document.addEventListener('mouseover', (e) => {
    dot.classList.toggle('hover', !!e.target.closest(interactive));
  });
  document.addEventListener('mouseout', () => {
    dot.classList.remove('hover');
  });
})();

/* =========================
   BG “lignes”
========================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let bg = document.getElementById('bg-lines');
  if (!bg) { bg = document.createElement('div'); bg.id = 'bg-lines'; document.body.prepend(bg); }

  const css = getComputedStyle(document.documentElement);
  const c1 = (css.getPropertyValue('--accent')   || '#6C63FF').trim();
  const c2 = (css.getPropertyValue('--accent-2') || '#00B3FF').trim();
  const colors = [c1, c2];

  const LONG  = [300, 350, 400, 500];
  const THICK = [3, 4, 5, 6];
  const STEP  = 80;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function newLine(x, y) {
    const el = document.createElement('div');
    const horizontal = Math.random() < 0.5;
    el.className = 'line ' + (horizontal ? 'line-wide' : 'line-high');
    el.style.backgroundColor = pick(colors);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.width  = (horizontal ? pick(LONG)  : pick(THICK)) + 'px';
    el.style.height = (horizontal ? pick(THICK) : pick(LONG))  + 'px';
    if (reduceMotion) el.style.opacity = '0.7';

    bg.appendChild(el);

    const durStr = (css.getPropertyValue('--bg-line-duration') || '2600ms').trim();
    const durMs  = parseFloat(durStr) || 2600;
    setTimeout(() => el.remove(), durMs + 400);

    if (bg.children.length > 220) {
      const extra = bg.children.length - 220;
      for (let i = 0; i < extra; i++) bg.firstChild?.remove();
    }
  }

  let lastX = null, lastY = null;
  newLine(innerWidth / 2, innerHeight / 2);

  const onMove = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x == null || y == null) return;
    if (lastX == null || lastY == null) { lastX = x; lastY = y; newLine(x, y); return; }
    if (Math.hypot(x - lastX, y - lastY) > STEP) { lastX = x; lastY = y; newLine(x, y); }
  };
  window.addEventListener('pointermove', onMove, { passive: true });
})();

/* =========================
   Hover zoom images (optionnel)
========================= */
(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imgs = document.querySelectorAll('.hero-photo img, .card-media img, .project-media img');
  if (!imgs.length) return;

  const SCALE = 1.06;
  const DURATION = 260;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  imgs.forEach(img => {
    let raf = null, start = 0, from = 1, to = 1, current = 1;
    function frame(ts){ if (!start) start = ts; const p = Math.min(1,(ts-start)/DURATION);
      current = from + (to-from)*easeOutCubic(p); img.style.transform = `translateZ(0) scale(${current})`;
      if (p < 1) raf = requestAnimationFrame(frame); else raf = null;
    }
    function go(target){ if (reduce) return; cancelAnimationFrame(raf); from = current; to = target; start = 0; raf = requestAnimationFrame(frame); }
    function reset(){ go(1); }
    img.style.willChange = 'transform';
    img.addEventListener('pointerenter', () => go(SCALE));
    img.addEventListener('pointerleave', reset);
  });
})();

/* =========================
   Compétences : séquence “logo → texte à droite”
========================= */
(() => {
  const stack = document.querySelector('.skills-stack');
  if (!stack) return;

  const rows = Array.from(stack.querySelectorAll('.skill-row'));
  if (!rows.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsClip = CSS?.supports?.('clip-path: inset(0 0 0 0)');

  // état initial : visible par défaut (CSS). Le JS anime l’apparition.
  rows.forEach(row => {
    const text = row.querySelector('.skill-text');
    if (text) {
      text.style.opacity = '1';
      text.style.transform = 'none';
    }
  });

  async function revealRow(row){
    if (row.dataset.shown === '1' || reduce) return;
    row.dataset.shown = '1';
    const text = row.querySelector('.skill-text');
    if (!text) return;

    // départ compacté (depuis l’icône)
    text.style.opacity   = '0';
    text.style.transform = 'translateX(-10px)';
    if (supportsClip) text.style.clipPath = 'inset(0 100% 0 0)';

    const kf = supportsClip
      ? [
          { opacity: 0, transform: 'translateX(-10px)', 'clip-path': 'inset(0 100% 0 0)' },
          { opacity: 1, transform: 'translateX(0)',      'clip-path': 'inset(0 0 0 0)'   }
        ]
      : [
          { opacity: 0, transform: 'translateX(-10px)' },
          { opacity: 1, transform: 'translateX(0)'      }
        ];

    const anim = text.animate(kf, { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    await anim.finished;
    text.style.removeProperty('clip-path');
  }

  async function runSequenceOnce(){
    if (stack.dataset.played === '1') return;
    stack.dataset.played = '1';
    for (const row of rows){
      await revealRow(row);
      await new Promise(r => setTimeout(r, 120));
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { runSequenceOnce(); io.unobserve(stack); } });
  }, { threshold: 0.2, rootMargin: '0px 0px -10%' });
  io.observe(stack);

  // fallback si déjà visible
  const r = stack.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) runSequenceOnce();
})();
