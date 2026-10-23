/* ==========================================================================
   Happy 19th Birthday Chetan Hotkar - Interactive Script & Motion Engine
   Dedicated from Harsh Gupta (24th October 2026)
   ========================================================================== */

// --- Global State ---
let audioPlaying = false;
let webAudioCtx = null;
let webAudioLoopInterval = null;
let balloonScore = 0;
let candlesLit = true;
let cakeSliced = false;

// Audio Elements
const bgAudio = document.getElementById('bg-audio');
const popAudio = document.getElementById('pop-audio');
const sparkleAudio = document.getElementById('sparkle-audio');
const cheerAudio = document.getElementById('cheer-audio');

const musicToggleBtn = document.getElementById('music-toggle-btn');
const soundWaves = document.getElementById('sound-waves');
const trackStatus = document.getElementById('track-status');
const cheerBtn = document.getElementById('sfx-cheer-btn');

/* ==========================================================================
   Web Audio API Procedural Synthesizer (Fallback & Dynamic Sound Engine)
   ========================================================================== */
function getAudioContext() {
  if (!webAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      webAudioCtx = new AudioContext();
    }
  }
  if (webAudioCtx && webAudioCtx.state === 'suspended') {
    webAudioCtx.resume();
  }
  return webAudioCtx;
}

// Procedural Melody Generator for Happy Birthday
function playSynthHappyBirthday() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = {
    'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00,
    'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33
  };

  const melody = [
    { n: 'D4', d: 0.35, pause: 0.1 }, { n: 'D4', d: 0.15, pause: 0.05 },
    { n: 'E4', d: 0.5, pause: 0.05 },  { n: 'D4', d: 0.5, pause: 0.05 },
    { n: 'G4', d: 0.5, pause: 0.05 },  { n: 'F#4', d: 1.0, pause: 0.15 },

    { n: 'D4', d: 0.35, pause: 0.1 }, { n: 'D4', d: 0.15, pause: 0.05 },
    { n: 'E4', d: 0.5, pause: 0.05 },  { n: 'D4', d: 0.5, pause: 0.05 },
    { n: 'A4', d: 0.5, pause: 0.05 },  { n: 'G4', d: 1.0, pause: 0.15 },

    { n: 'D4', d: 0.35, pause: 0.1 }, { n: 'D4', d: 0.15, pause: 0.05 },
    { n: 'D5', d: 0.5, pause: 0.05 },  { n: 'B4', d: 0.5, pause: 0.05 },
    { n: 'G4', d: 0.5, pause: 0.05 },  { n: 'F#4', d: 0.5, pause: 0.05 },
    { n: 'E4', d: 0.8, pause: 0.15 },

    { n: 'C5', d: 0.35, pause: 0.1 }, { n: 'C5', d: 0.15, pause: 0.05 },
    { n: 'B4', d: 0.5, pause: 0.05 },  { n: 'G4', d: 0.5, pause: 0.05 },
    { n: 'A4', d: 0.5, pause: 0.05 },  { n: 'G4', d: 1.2, pause: 0.3 }
  ];

  let timeCursor = ctx.currentTime + 0.05;

  melody.forEach(item => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(notes[item.n], timeCursor);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, timeCursor);
    gain.gain.exponentialRampToValueAtTime(0.18, timeCursor + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, timeCursor + item.d);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(timeCursor);
    osc.stop(timeCursor + item.d);

    // Sparkle harmonic
    const oscSparkle = ctx.createOscillator();
    const gainSparkle = ctx.createGain();
    oscSparkle.type = 'sine';
    oscSparkle.frequency.setValueAtTime(notes[item.n] * 2, timeCursor);
    gainSparkle.gain.setValueAtTime(0.001, timeCursor);
    gainSparkle.gain.exponentialRampToValueAtTime(0.06, timeCursor + 0.03);
    gainSparkle.gain.exponentialRampToValueAtTime(0.0001, timeCursor + item.d * 0.7);
    oscSparkle.connect(gainSparkle);
    gainSparkle.connect(ctx.destination);
    oscSparkle.start(timeCursor);
    oscSparkle.stop(timeCursor + item.d * 0.7);

    timeCursor += item.d + item.pause;
  });

  return (timeCursor - ctx.currentTime) * 1000;
}

// Procedural Synthetic Sound Effects (Fallback if audio files are delayed)
function playSynthPop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

function playSynthSparkle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + idx * 0.06;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  });
}

function playSynthCheer() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Crowd shimmer + horn chords
  const chordNotes = [392.00, 493.88, 587.33, 783.99];
  chordNotes.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  });
}

/* ==========================================================================
   Sound Playback Controllers
   ========================================================================== */
function startMusic() {
  audioPlaying = true;
  soundWaves.classList.remove('paused');
  trackStatus.textContent = 'Playing festive track 🎶';

  // Try HTML5 audio first
  if (bgAudio) {
    bgAudio.volume = 0.7;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to Web Audio synthesis if file audio playback is blocked
        runProceduralLoop();
      });
    }
  } else {
    runProceduralLoop();
  }
}

function pauseMusic() {
  audioPlaying = false;
  soundWaves.classList.add('paused');
  trackStatus.textContent = 'Track paused';
  if (bgAudio) bgAudio.pause();
  if (webAudioLoopInterval) {
    clearInterval(webAudioLoopInterval);
    webAudioLoopInterval = null;
  }
}

function toggleMusic() {
  if (audioPlaying) {
    pauseMusic();
  } else {
    startMusic();
  }
}

function runProceduralLoop() {
  if (webAudioLoopInterval) clearInterval(webAudioLoopInterval);
  const dur = playSynthHappyBirthday();
  webAudioLoopInterval = setInterval(() => {
    if (audioPlaying) playSynthHappyBirthday();
  }, dur || 16000);
}

function playPopSound() {
  if (popAudio) {
    popAudio.currentTime = 0;
    popAudio.play().catch(() => playSynthPop());
  } else {
    playSynthPop();
  }
}

function playSparkleSound() {
  if (sparkleAudio) {
    sparkleAudio.currentTime = 0;
    sparkleAudio.play().catch(() => playSynthSparkle());
  } else {
    playSynthSparkle();
  }
}

function playCheerSound() {
  if (cheerAudio) {
    cheerAudio.currentTime = 0;
    cheerAudio.play().catch(() => playSynthCheer());
  } else {
    playSynthCheer();
  }
}

/* ==========================================================================
   Confetti Engine
   ========================================================================== */
function blastFestiveConfetti() {
  playSparkleSound();
  if (typeof confetti === 'function') {
    // Left cannon
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.7 },
      colors: ['#ffd700', '#ff8008', '#ff5e62', '#8a2be2', '#00f2fe']
    });
    // Right cannon
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.7 },
      colors: ['#ffd700', '#ff8008', '#ff5e62', '#8a2be2', '#00f2fe']
    });
    // Center gold blast
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffd700', '#fff275', '#ffa751']
    });
  }
}

function playCheerAndConfetti() {
  playCheerSound();
  blastFestiveConfetti();
  showToast("📣 Shouted out to Chetan! Brotherhood 100% 🔥");
}

/* ==========================================================================
   Interactive Entrance Flow
   ========================================================================== */
const enterBtn = document.getElementById('enter-btn');
const entranceOverlay = document.getElementById('entrance-overlay');

if (enterBtn && entranceOverlay) {
  enterBtn.addEventListener('click', () => {
    getAudioContext();
    startMusic();
    blastFestiveConfetti();

    // Smooth exit animation
    entranceOverlay.classList.add('hidden');
    setTimeout(() => {
      entranceOverlay.style.display = 'none';
      spawnBalloonWave();
    }, 800);
  });
}

// Audio dock toggle event
if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', toggleMusic);
}

if (cheerBtn) {
  cheerBtn.addEventListener('click', () => {
    playCheerSound();
    blastFestiveConfetti();
  });
}

/* ==========================================================================
   Interactive Cake Ceremony
   ========================================================================== */
const flame1 = document.getElementById('flame-1');
const flame9 = document.getElementById('flame-9');
const cakeBody = document.getElementById('cake-body');
const ceremonialKnife = document.getElementById('ceremonial-knife');
const cakeStatusBadge = document.getElementById('cake-status-badge');
const cakeStatusText = document.getElementById('cake-status-text');
const wishRevealBox = document.getElementById('wish-reveal-box');

function blowOutCandles() {
  if (!candlesLit) {
    showToast("Candles are already blown! Click Relight to blow again.");
    return;
  }
  candlesLit = false;
  if (flame1) flame1.classList.add('extinguished');
  if (flame9) flame9.classList.add('extinguished');

  playSparkleSound();
  blastFestiveConfetti();

  if (cakeStatusBadge) {
    cakeStatusBadge.innerHTML = '<span class="status-dot green"></span><span>Wish made! Candles blown for Chetan ✨</span>';
  }

  showToast("🌬️ Whoosh! Happy 19th Birthday Chetan! Wish registered!");
}

function cutTheCake() {
  if (cakeSliced) {
    showToast("The cake has already been sliced! Savor the moment 🍰");
    return;
  }
  cakeSliced = true;

  // Animate knife descending
  if (ceremonialKnife) {
    ceremonialKnife.classList.add('active-cut');
    setTimeout(() => {
      ceremonialKnife.classList.remove('active-cut');
    }, 1200);
  }

  setTimeout(() => {
    if (cakeBody) cakeBody.classList.add('sliced');
    playCheerSound();
    blastFestiveConfetti();

    if (cakeStatusBadge) {
      cakeStatusBadge.innerHTML = '<span class="status-dot orange"></span><span>🎂 19th Cake Sliced! Share the sweetness!</span>';
    }

    if (wishRevealBox) {
      wishRevealBox.style.display = 'block';
      wishRevealBox.style.animation = 'pulseGlow 1.5s ease';
    }

    showToast("🍰 Cake Cut! Wishing Chetan the sweetest 19th year ahead!");
  }, 600);
}

function relightCake() {
  candlesLit = true;
  cakeSliced = false;

  if (flame1) flame1.classList.remove('extinguished');
  if (flame9) flame9.classList.remove('extinguished');
  if (cakeBody) cakeBody.classList.remove('sliced');

  if (cakeStatusBadge) {
    cakeStatusBadge.innerHTML = '<span class="status-dot green"></span><span>Candles are glowing! Blow them out</span>';
  }

  playSparkleSound();
  showToast("✨ Candles relit! Ready for another celebration!");
}

// Allow tapping candles directly to blow them out
const candle1 = document.querySelector('.candle-1');
const candle9 = document.querySelector('.candle-9');
if (candle1) candle1.addEventListener('click', blowOutCandles);
if (candle9) candle9.addEventListener('click', blowOutCandles);

/* ==========================================================================
   Interactive Floating Balloon Popping Game
   ========================================================================== */
const balloonArena = document.getElementById('balloon-arena');
const balloonScoreElem = document.getElementById('balloon-score');

const balloonThemes = ['balloon-gold', 'balloon-purple', 'balloon-cyan', 'balloon-red'];
const balloonWishes = ['19', 'CHETAN', '🎂', '👑', 'BAPPA', 'DUBAI', 'OCT 24', 'HARSH', '🔥', 'HERO'];

function createBalloon() {
  if (!balloonArena) return;

  const balloon = document.createElement('div');
  const theme = balloonThemes[Math.floor(Math.random() * balloonThemes.length)];
  const wish = balloonWishes[Math.floor(Math.random() * balloonWishes.length)];

  balloon.className = `interactive-balloon ${theme}`;
  balloon.textContent = wish;

  // Random horizontal position
  const leftPercent = 5 + Math.random() * 85;
  balloon.style.left = `${leftPercent}%`;

  // Random animation speed
  const duration = 6 + Math.random() * 5;
  balloon.style.animationDuration = `${duration}s`;

  // Click to pop
  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    popBalloon(balloon);
  });

  balloonArena.appendChild(balloon);

  // Auto clean up after animation finishes
  setTimeout(() => {
    if (balloon.parentNode === balloonArena) {
      balloon.remove();
    }
  }, duration * 1000);
}

function popBalloon(balloon) {
  playPopSound();
  balloonScore++;
  if (balloonScoreElem) {
    balloonScoreElem.textContent = balloonScore;
  }

  // Confetti burst at balloon position
  const rect = balloon.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
      colors: ['#ffd700', '#ff5e62', '#00f2fe', '#8a2be2']
    });
  }

  // Remove balloon with pop scale
  balloon.style.transform = 'scale(1.4)';
  balloon.style.opacity = '0';
  setTimeout(() => balloon.remove(), 100);

  // Milestone reward at 19
  if (balloonScore === 19) {
    playCheerSound();
    blastFestiveConfetti();
    showToast("🏆 BOOM! 19 Balloons Popped! Chetan's 19th Goal Reached! 🎉");
  }
}

function spawnBalloonWave() {
  for (let i = 0; i < 7; i++) {
    setTimeout(createBalloon, i * 450);
  }
}

// Continuous gentle balloon spawner
setInterval(() => {
  if (balloonArena && balloonArena.children.length < 8) {
    createBalloon();
  }
}, 2200);

/* ==========================================================================
   3D Tilt Physics for Cards
   ========================================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   Photo Lightbox Modal
   ========================================================================== */
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('.gallery-img');
    const title = card.querySelector('.card-title');
    if (img && lightboxModal && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxCaption.textContent = title ? title.textContent : 'Chetan Hotkar - 19th Birthday';
      lightboxModal.classList.add('active');
    }
  });
});

function closeLightbox(e) {
  if (e) e.stopPropagation();
  if (lightboxModal) lightboxModal.classList.remove('active');
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function copySiteLink() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("📋 Link Copied! Send it to Chetan on WhatsApp!");
    }).catch(() => {
      showToast("Link: " + window.location.href);
    });
  } else {
    showToast("Celebration Link Ready to Share!");
  }
}

/* ==========================================================================
   Ambient Particles Canvas Engine
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 60;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      color: Math.random() > 0.4 ? 'rgba(255, 215, 0, ' : 'rgba(255, 94, 98, ',
      alpha: Math.random() * 0.7 + 0.2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.6 + 0.2),
      phase: Math.random() * Math.PI * 2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.y += p.vy;
      p.x += p.vx;
      p.phase += 0.03;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const dynamicAlpha = Math.sin(p.phase) * 0.3 + p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.max(0.1, dynamicAlpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffd700';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

// Initialise everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  init3DTilt();
  // Pre-seed some balloons in arena
  setTimeout(spawnBalloonWave, 1000);

  if (window.location.search.includes('nooverlay') && entranceOverlay) {
    entranceOverlay.style.display = 'none';
  }
});
