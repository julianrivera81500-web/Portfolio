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
/* Reveal on scroll (IO - déclenche à la frame suivante) */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          void entry.target.offsetWidth;       // flush style
          entry.target.classList.add('visible');
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10%' });
  revealEls.forEach(el => io.observe(el));
}
/* Démarrage immédiat des reveals marqués .reveal-start (ex: hero) */
document.addEventListener('DOMContentLoaded', () => {
  const startEls = document.querySelectorAll('.reveal-start');
  if (!startEls.length) return;

  // on décale d'une frame + flush style pour garantir la transition
  requestAnimationFrame(() => {
    startEls.forEach(el => {
      void el.offsetWidth;          // force le style initial (transform: translateY(70vh))
      el.classList.add('visible');  // déclenche l'anim vers transform: none
    });
  });
});


/* =========================
   Year in footer
   ========================= */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* =========================
   Lightbox (images projets)
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
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }
  function show(i) {
    currentIndex = (i + gallery.length) % gallery.length;
    lightboxImg.src = gallery[currentIndex].src;
  }

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
  document.querySelectorAll(selectors).forEach((img, index, all) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const images = img.closest('.projects-grid, .project-media, .grid, .cards')?.querySelectorAll('img') || [img];
      const idx = images ? Array.from(images).indexOf(img) : 0;
      openLightbox(idx, images);
    });
  });
})();

/* =========================
   Custom cursor (dot)
   ========================= */
(() => {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // pas sur tactile
  let dot = document.querySelector('.cursor');
  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'cursor';
    document.body.appendChild(dot);
  }

  const move = (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    dot.classList.remove('hidden');
  };
  const hide = () => dot.classList.add('hidden');

  window.addEventListener('mousemove', move, { passive: true });
  window.addEventListener('mouseenter', () => dot.classList.remove('hidden'));
  window.addEventListener('mouseleave', hide);
  window.addEventListener('mousedown', () => dot.classList.add('click'));
  window.addEventListener('mouseup',   () => dot.classList.remove('click'));

  const interactive = 'a,button,.btn,input,textarea,select,label,[role="button"],summary';
  document.addEventListener('mouseover', (e) => {
    dot.classList.toggle('hover', !!e.target.closest(interactive));
  });
  document.addEventListener('mouseout', () => dot.classList.remove('hover'));
})();

/* =========================
   BG "lignes" (longues, espacées, couleurs thème)
   ========================= */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let bg = document.getElementById('bg-lines');
  if (!bg) {
    bg = document.createElement('div');
    bg.id = 'bg-lines';
    document.body.prepend(bg);
  }

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

    const rootStyles = getComputedStyle(document.documentElement);
    const durStr = (rootStyles.getPropertyValue('--bg-line-duration') || '2600ms').trim();
    const durMs  = parseFloat(durStr) || 2600;
    setTimeout(() => el.remove(), durMs + 400);

    if (bg.children.length > 220) {
      const extra = bg.children.length - 220;
      for (let i = 0; i < extra; i++) { bg.firstChild?.remove(); }
    }
  }

  let lastX = null, lastY = null;
  newLine(innerWidth / 2, innerHeight / 2); // une ligne au chargement

  const onMove = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x == null || y == null) return;
    if (lastX == null || lastY == null) { lastX = x; lastY = y; newLine(x, y); return; }
    if (Math.hypot(x - lastX, y - lastY) > STEP) {
      lastX = x; lastY = y; newLine(x, y);
    }
  };
  window.addEventListener('pointermove', onMove, { passive: true });
})();

/* =========================
   Hover zoom smooth (RAF) sur images
   ========================= */
(() => {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SELECTORS = '.hero-photo img, .card-media img, .project-media img';
  const imgs = document.querySelectorAll(SELECTORS);
  if (!imgs.length) return;

  const SCALE = 1.06;
  const DURATION = 260;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  imgs.forEach(img => {
    let raf = null, start = 0, from = 1, to = 1, current = 1;

    function frame(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / DURATION);
      current = from + (to - from) * easeOutCubic(p);
      img.style.transform = `translateZ(0) scale(${current})`;
      if (p < 1) { raf = requestAnimationFrame(frame); } else { raf = null; }
    }
    function go(target) {
      if (reduce) return;
      cancelAnimationFrame(raf);
      from = current; to = target; start = 0;
      raf = requestAnimationFrame(frame);
    }
    function reset() { go(1); }

    img.style.willChange = 'transform';
    img.style.transformOrigin = 'center center';
    img.style.transition = 'none';

    img.addEventListener('pointerenter', () => go(SCALE));
    img.addEventListener('pointerleave', reset);
    img.addEventListener('blur', reset);

    const link = img.closest('a');
    if (link) {
      link.addEventListener('focus', () => go(SCALE));
      link.addEventListener('blur',  reset);
    }
  });
})();

/* =========================
   Cursor ring v2 (smooth 0→1) + shine boutons
   ========================= */
(() => {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Anneau (utilise CSS vars --s & --b)
  let ring = document.querySelector('.cursor-ring');
  if (!ring) {
    ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);
  }

  // Suivi position
  window.addEventListener('mousemove', e => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, { passive: true });

  // Cible 0..1 selon survol éléments interactifs
  const SEL = 'a,button,.btn,[role="button"],input[type="submit"],summary,label[for]';
  let target = 0;  // 0/1
  let s = 0;       // état courant
  let last = 0, raf;

  document.addEventListener('mouseover',  e => { target = e.target.closest(SEL) ? 1 : 0; });
  document.addEventListener('mouseout',   e => { if (!e.relatedTarget || !e.relatedTarget.closest?.(SEL)) target = 0; });
  document.addEventListener('focusin',    e => { if (e.target.closest(SEL)) target = 1; });
  document.addEventListener('focusout',   () => { if (!document.activeElement?.closest?.(SEL)) target = 0; });
  window.addEventListener('mouseleave',   () => { target = 0; });

  const DURATION = 220; // ms approx pour atteindre la cible
  function tick(ts) {
    if (!last) last = ts;
    const dt = ts - last; last = ts;

    const diff = target - s;
    if (Math.abs(diff) < 0.001) {
      s = target;
    } else {
      const k = 1 - Math.pow(1 - 1 / Math.max(1, DURATION), dt); // lissage indépendant du FPS
      s += diff * k;
    }
    ring.style.setProperty('--s', s.toFixed(3));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // Petit bump au clic
  document.addEventListener('mousedown', e => {
    if (reduce || !e.target.closest(SEL)) return;
    ring.style.setProperty('--b', '1.14');
    setTimeout(() => ring.style.setProperty('--b', '1'), 90);
  });

  // Reflet "shine" sur les boutons (suivi souris via --x/--y)
  const updateShine = (btn, e) => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - r.top)  + 'px');
  };
  document.addEventListener('pointermove', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) updateShine(btn, e);
  }, { passive: true });
})();
/* ===== Compétences : texte qui sort de l'icône → droite, une fois, en séquence (fix) ===== */
(() => {
  const stack = document.querySelector('.skills-stack');
  if (!stack) return;

  const rows = Array.from(stack.querySelectorAll('.skill-row'));
  if (!rows.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsClip = CSS?.supports?.('clip-path: inset(0 0 0 0)');

  async function revealRow(row){
    if (row.dataset.shown === '1') return;   // déjà fait
    row.dataset.shown = '1';

    const text = row.querySelector('.skill-text');
    if (!text) return;

    if (reduce) { row.classList.add('open'); return; }

    // état de départ sécurisé
    text.style.opacity   = '0';
    text.style.transform = 'translateX(-6px)';
    if (supportsClip) text.style.clipPath = 'inset(0 100% 0 0)';

    // keyframes : utiliser 'clip-path' (kebab-case)
    const kf = supportsClip
      ? [
          { opacity: 0, transform: 'translateX(-6px)', 'clip-path': 'inset(0 100% 0 0)' },
          { opacity: 1, transform: 'translateX(0)',    'clip-path': 'inset(0 0 0 0)'   }
        ]
      : [
          { opacity: 0, transform: 'translateX(-6px)', width: '0px' },
          { opacity: 1, transform: 'translateX(0)',    width: text.scrollWidth + 'px' }
        ];

    const anim = text.animate(kf, {
      duration: 420,
      easing: 'cubic-bezier(.2,.7,.2,1)',
      fill: 'forwards'
    });

    await anim.finished;

    // nettoyage + état final stable
    text.style.removeProperty('clip-path');
    text.style.removeProperty('width');
    row.classList.add('open');
  }

  async function runSequence(){
    if (stack.dataset.played === '1') return;
    stack.dataset.played = '1';
    for (const row of rows){
      await revealRow(row);                 // joue l’item i
      await new Promise(r => setTimeout(r, 120)); // petit décalage
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { runSequence(); io.unobserve(stack); }
    });
  }, { threshold: 0.25 });
  io.observe(stack);

  // Au cas où la section est déjà visible au chargement
  const r = stack.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) runSequence();

  // Accessibilité : TAB déclenche la séquence si pas encore jouée
  stack.addEventListener('focusin', runSequence);
})();
