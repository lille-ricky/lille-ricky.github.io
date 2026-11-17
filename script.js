function copyEmail(email) {
  navigator.clipboard.writeText(email).then(function () {
    var toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 2500);
    }
  });
}

let posX = Math.floor(Math.random() * 60) + 20;
let posY = Math.floor(Math.random() * 60) + 20;

let vx = 0;
let vy = 0;

const friction = 0.96;
let lastScrollY = window.scrollY;

function animateMap() {
  posX += vx;
  posY += vy;

  const edgeBuffer = 5;
  const softPush = 0.08;

  if (posX <= edgeBuffer) {
    vx += softPush;
    vy += (Math.random() - 0.5) * 0.02;
  } else if (posX >= 100 - edgeBuffer) {
    vx -= softPush;
    vy += (Math.random() - 0.5) * 0.02;
  }

  if (posY <= edgeBuffer) {
    vy += softPush;
    vx += (Math.random() - 0.5) * 0.02;
  } else if (posY >= 100 - edgeBuffer) {
    vy -= softPush;
    vx += (Math.random() - 0.5) * 0.02;
  }

  posX = Math.min(Math.max(posX, 0), 100);
  posY = Math.min(Math.max(posY, 0), 100);

  document.documentElement.style.setProperty('--map-x', `${posX.toFixed(2)}%`);
  document.documentElement.style.setProperty('--map-y', `${posY.toFixed(2)}%`);

  vx *= friction;
  vy *= friction;

  requestAnimationFrame(animateMap);
}

animateMap();

window.addEventListener('scroll', () => {
  const deltaY = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;

  vx += deltaY * 0.003;
  vy += deltaY * 0.005;
}, { passive: true });

window.addEventListener('wheel', (e) => {
  vx += e.deltaX * 0.002;
  vy += e.deltaY * 0.002;
}, { passive: true });

const coordsText = document.getElementById('coords-text');
const crosshairEl = document.getElementById('crosshair');

window.addEventListener('mousemove', (e) => {
  if (crosshairEl && crosshairEl.classList.contains('hidden-in-game')) {
    crosshairEl.classList.remove('hidden-in-game');
  }

  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

  if (coordsText) {
    const padX = String(e.clientX).padStart(4, '0');
    const padY = String(e.clientY).padStart(4, '0');
    coordsText.textContent = `[ ${padX} , ${padY} ]`;
  }

  vx += e.movementX * 0.0008;
  vy += e.movementY * 0.0008;
}, { passive: true });

// --- Projects Revolving Carousel ---
(function initProjectsCarousel() {
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('proj-prev');
  const nextBtn = document.getElementById('proj-next');
  const indicator = document.getElementById('proj-indicator');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function updateCarousel() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);

    if (currentIndex > maxIndex) currentIndex = 0;
    if (currentIndex < 0) currentIndex = maxIndex;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const offset = currentIndex * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    if (indicator) {
      const displayNum = String(currentIndex + 1).padStart(2, '0');
      const totalNum = String(maxIndex + 1).padStart(2, '0');
      indicator.textContent = `[ ${displayNum} / ${totalNum} ]`;
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Position ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, total - getVisibleCount());
      currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, total - getVisibleCount());
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
})();

// --- Full-Screen Game Modal & Crosshair Toggle ---
const gameFrame = document.getElementById('game-frame');
const gameModalTitle = document.getElementById('game-modal-title');

if (gameFrame && crosshairEl) {
  gameFrame.addEventListener('mouseenter', () => {
    crosshairEl.classList.add('hidden-in-game');
  });

  gameFrame.addEventListener('mouseleave', () => {
    crosshairEl.classList.remove('hidden-in-game');
  });
}

window.addEventListener('blur', () => {
  if (document.activeElement === gameFrame && crosshairEl) {
    crosshairEl.classList.add('hidden-in-game');
  }
});

function openGameModal(url, title) {
  const modal = document.getElementById('game-modal');
  if (modal && gameFrame) {
    if (gameModalTitle && title) {
      gameModalTitle.textContent = `[ EXECUTING // ${title} ]`;
    }
    gameFrame.src = url;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    gameFrame.onload = () => {
      gameFrame.contentWindow.focus();
      if (crosshairEl) crosshairEl.classList.add('hidden-in-game');
    };
  }
}

function closeGameModal() {
  const modal = document.getElementById('game-modal');
  if (modal && gameFrame) {
    modal.classList.remove('active');
    gameFrame.src = '';
    document.body.style.overflow = '';
    if (crosshairEl) crosshairEl.classList.remove('hidden-in-game');
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGameModal();
  }
});