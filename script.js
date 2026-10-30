// --- Copy Email to Clipboard ---
function copyEmail(email) {
  navigator.clipboard.writeText(email).then(function() {
    var toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }
  });
}

// --- Map Physics & Momentum Engine ---
let posX = Math.floor(Math.random() * 60) + 20; // Random initial focus %
let posY = Math.floor(Math.random() * 60) + 20;

let vx = 0; // Velocity X
let vy = 0; // Velocity Y

const friction = 0.92; // Momentum decay rate (0.90 = stops faster, 0.96 = coasts longer)
let lastScrollY = window.scrollY;

// Render loop running every frame for silky smooth motion
function animateMap() {
  posX += vx;
  posY += vy;

  // Keep position clamped smoothly inside bounds (0% to 100%)
  if (posX < 0 || posX > 100) { vx *= -0.5; posX = Math.min(Math.max(posX, 0), 100); }
  if (posY < 0 || posY > 100) { vy *= -0.5; posY = Math.min(Math.max(posY, 0), 100); }

  // Update CSS custom properties
  document.documentElement.style.setProperty('--map-x', `${posX.toFixed(2)}%`);
  document.documentElement.style.setProperty('--map-y', `${posY.toFixed(2)}%`);

  // Apply friction
  vx *= friction;
  vy *= friction;

  requestAnimationFrame(animateMap);
}

// Start continuous physics loop
animateMap();

// 1. Add impulse on page scroll
window.addEventListener('scroll', () => {
  const deltaY = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;

  vx += deltaY * 0.008;
  vy += deltaY * 0.012;
}, { passive: true });

// 2. Add impulse on mouse wheel spin
window.addEventListener('wheel', (e) => {
  vx += e.deltaX * 0.005;
  vy += e.deltaY * 0.005;
}, { passive: true });


// --- Full-Screen X/Y Axis & Coordinates Tracker ---
const coordsText = document.getElementById('coords-text');

window.addEventListener('mousemove', (e) => {
  // Update line positions
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

  // Update live coordinate text readout (padded to 4 digits)
  if (coordsText) {
    const padX = String(e.clientX).padStart(4, '0');
    const padY = String(e.clientY).padStart(4, '0');
    coordsText.textContent = `[ ${padX} , ${padY} ]`;
  }

  // Momentum impulse to background world map
  vx += e.movementX * 0.0008;
  vy += e.movementY * 0.0008;
}, { passive: true });