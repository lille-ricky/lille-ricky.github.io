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

window.addEventListener('mousemove', (e) => {
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