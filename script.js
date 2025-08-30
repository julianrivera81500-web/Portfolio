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
