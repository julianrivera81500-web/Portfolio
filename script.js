/* Mobile nav toggle */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Reveal on scroll */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
},{threshold:0.12});
revealEls.forEach(el => io.observe(el));

/* Year in footer */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
// ===== Lightbox =====
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightbox.innerHTML = `
  <span class="lightbox-close">&times;</span>
  <img src="" alt="Image en grand">
  <div class="lightbox-controls">
    <button class="lightbox-btn prev">❮</button>
    <button class="lightbox-btn next">❯</button>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.prev');
const nextBtn = lightbox.querySelector('.next');

let gallery = [];
let currentIndex = 0;

// Ouvrir la lightbox
function openLightbox(index, images) {
  gallery = images;
  currentIndex = index;
  lightboxImg.src = gallery[currentIndex].src;
  lightbox.classList.add('active');
}

// Fermer
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

// Navigation
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % gallery.length;
  lightboxImg.src = gallery[currentIndex].src;
});
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
  lightboxImg.src = gallery[currentIndex].src;
});

// Fermer sur fond noir
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

// Activer sur les images des albums
document.querySelectorAll('.projects-grid').forEach(grid => {
  const images = grid.querySelectorAll('img');
  images.forEach((img, index) => {
    img.style.cursor = "pointer";
    img.addEventListener('click', () => {
      openLightbox(index, images);
    });
  });
});
/* ===== Custom cursor ===== */
(() => {
  // Ne pas afficher sur écrans tactiles
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  document.body.appendChild(dot);

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
})();
/* Survol: grossit un peu sur les éléments interactifs */
(() => {
  const dot = document.querySelector('.cursor');
  if (!dot) return;
  const interactive = 'a,button,.btn,input,textarea,select,label,[role="button"],summary';

  document.addEventListener('mouseover', (e) => {
    dot.classList.toggle('hover', !!e.target.closest(interactive));
  });
  document.addEventListener('mouseout', () => {
    dot.classList.remove('hover');
  });
})();
/* ===== BG "lignes" — 10x plus longues + couleurs du site ===== */
(() => {

  // Ne bloque plus en reduced-motion, mais tu peux remettre un return si tu veux respecter l'OS
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Conteneur plein écran
  let bg = document.getElementById('bg-lines');
  if (!bg){
    bg = document.createElement('div');
    bg.id = 'bg-lines';
    document.body.prepend(bg);
  }

  // Récupère les couleurs depuis :root
  const css = getComputedStyle(document.documentElement);
  const c1 = (css.getPropertyValue('--accent')   || '#6C63FF').trim();
  const c2 = (css.getPropertyValue('--accent-2') || '#00B3FF').trim();
  const colors = [c1, c2]; // palette pilotée par ton thème

  // Tailles — longueur ×10, épaisseur inchangée
  const LONG  = [300, 350, 400, 500];  // ex- [30,35,40,50]
  const THICK = [3, 4, 5, 6];          // épaisseur conservée

  const pick = arr => arr[Math.floor(Math.random()*arr.length)];

  function newLine(x, y){
    const el = document.createElement('div');
    const horizontal = Math.random() < 0.5;

    el.className = 'line ' + (horizontal ? 'line-wide' : 'line-high');
    el.style.backgroundColor = pick(colors);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';

    // si horizontal: width=LONG, height=THICK ; si vertical: inversé
    el.style.width  = (horizontal ? pick(LONG)  : pick(THICK)) + 'px';
    el.style.height = (horizontal ? pick(THICK) : pick(LONG))  + 'px';

    // Lignes un peu plus douces si reduced-motion
    if (reduceMotion) el.style.opacity = '0.7';

    bg.appendChild(el);
const rootStyles = getComputedStyle(document.documentElement);
const durStr = rootStyles.getPropertyValue('--bg-line-duration').trim() || '2600ms';
const durMs  = parseFloat(durStr); // lit "2600ms" -> 2600
setTimeout(() => el.remove(), (isNaN(durMs) ? 2600 : durMs) + 400);


    // garde le DOM propre
    if (bg.children.length > 200) {
      const extra = bg.children.length - 200;
      for (let i=0; i<extra; i++) bg.firstChild?.remove();
    }
  }

  // Crée une ligne à l’init + dès qu’on bouge de ≥12px (réactif)
  let lastX, lastY; newLine(innerWidth/2, innerHeight/2);
  // juste au-dessus de onMove :
const STEP = 80; // 12px × 5 = 60px → lignes 5x plus espacées

// ...
const onMove = e => {
  const x = e.clientX ?? e.touches?.[0]?.clientX;
  const y = e.clientY ?? e.touches?.[0]?.clientY;
  if (x == null || y == null) return;
  if (lastX == null || lastY == null) { lastX = x; lastY = y; newLine(x, y); return; }

  // AVANT : 12
  // if (Math.hypot(x - lastX, y - lastY) > 12) { ... }

  // APRÈS : 60 (espacement 5x)
  if (Math.hypot(x - lastX, y - lastY) > STEP) {
    lastX = x; lastY = y;
    newLine(x, y);
  }
};


  window.addEventListener('pointermove', onMove, { passive:true });
})();
/* ===== Hover zoom smooth (RAF) ===== */
(() => {
  // désactive sur écrans tactiles et si "réduire les animations"
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SELECTORS = '.hero-photo img, .card-media img, .project-media img';
  const imgs = document.querySelectorAll(SELECTORS);
  if (!imgs.length) return;

  const SCALE = 1.06;     // intensité du zoom
  const DURATION = 260;   // ms
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  imgs.forEach(img => {
    let raf = null, start = 0, from = 1, to = 1, current = 1;

    function frame(ts){
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / DURATION);
      current = from + (to - from) * easeOutCubic(p);
      img.style.transform = `translateZ(0) scale(${current})`;
      if (p < 1) raf = requestAnimationFrame(frame); else raf = null;
    }
    function go(target){
      if (reduce) return;                 // respect accessibilité
      cancelAnimationFrame(raf);
      from = current;
      to   = target;
      start = 0;
      raf = requestAnimationFrame(frame);
    }
    function reset(){ go(1); }

    // init styles (évite conflit avec transitions CSS)
    img.style.willChange = 'transform';
    img.style.transformOrigin = 'center center';
    img.style.transition = 'none';

    // survol / sortie
    img.addEventListener('pointerenter', () => go(SCALE));
    img.addEventListener('pointerleave', reset);
    img.addEventListener('blur', reset);

    // focus clavier si l'image est dans un <a>
    const link = img.closest('a');
    if (link){
      link.addEventListener('focus', () => go(SCALE));
      link.addEventListener('blur',  reset);
    }
  });
})();
/* ===== Cursor ring v2 — smooth 0→1 sur éléments cliquables ===== */
(() => {
  // pas d'effet sur tactile
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // anneau (et point existant si besoin)
  let ring = document.querySelector('.cursor-ring');
  if (!ring) {
    ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);
  }

  // position du ring
  let x = 0, y = 0;
  window.addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    ring.style.left = x + 'px';
    ring.style.top  = y + 'px';
  }, { passive:true });

  // détection des éléments interactifs
  const SEL = 'a,button,.btn,[role="button"],input[type="submit"],summary,label[for]';
  let target = 0;    // 0..1 : veut-on afficher l’anneau ?
  let s = 0;         // 0..1 : état courant (animé)
  let last = 0, raf;

  // bascule 0→1 au survol/focus, et 1→0 en sortie
  document.addEventListener('mouseover',  e => { target = e.target.closest(SEL) ? 1 : 0; });
  document.addEventListener('mouseout',   e => { if (!e.relatedTarget || !e.relatedTarget.closest(SEL)) target = 0; });
  document.addEventListener('focusin',    e => { if (e.target.closest(SEL)) target = 1; });
  document.addEventListener('focusout',   e => { if (!document.activeElement || !document.activeElement.closest(SEL)) target = 0; });
  window.addEventListener('mouseleave',   () => { target = 0; });

  // anim lissée (approche exp. vers la cible), ~220ms
  const DURATION = 220; // ms pour aller proche de la cible
  function tick(ts){
    if (!last) last = ts;
    const dt = ts - last; last = ts;

    const diff = target - s;
    if (Math.abs(diff) < 0.001) {
      s = target;
    } else {
      // convertit une durée en facteur d’approche selon dt (smooth, indépendant FPS)
      const k = 1 - Math.pow(1 - 1/Math.max(1, DURATION), dt);
      s += diff * k;
    }
    ring.style.setProperty('--s', s.toFixed(3));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // petit "bump" au clic (optionnel, discret)
  document.addEventListener('mousedown', e => {
    if (reduce || !e.target.closest(SEL)) return;
    ring.style.setProperty('--b', '1.14');
    setTimeout(() => ring.style.setProperty('--b','1'), 90);
  });
})();

/* ===== Reflet “shine” sur les boutons (conserve le design existant) ===== */
(() => {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const updateShine = (btn, e) => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - r.top)  + 'px');
  };
  document.addEventListener('pointermove', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) updateShine(btn, e);
  }, { passive:true });
})();
