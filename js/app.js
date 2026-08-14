/* ==========================================================================
   APP CONTROLLER & COORDINATOR
   Theme Switcher, Scroll Spy, Live Canvas Telemetry, Sound & Time
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Dark / Light Theme Manager ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    themeToggleBtns.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (window.playFeedbackSound) window.playFeedbackSound('click');
    if (window.showToast) window.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'success');
  }

  setTheme(storedTheme);
  themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
  window.toggleTheme = toggleTheme;


  // --- 2. Tactile Web Audio API Synthesizer ---
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playFeedbackSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'toast') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  window.playFeedbackSound = playFeedbackSound;

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      if (soundEnabled) {
        initAudio();
        playFeedbackSound('toast');
      }
    });
  }


  // --- 3. Scroll Spy & Navbar Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateScrollSpy() {
    const scrollY = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });


  // --- 4. Intersection Observer for Scroll Reveals & Counters ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- 5. Hero Telemetry Live Animated Graph ---
  const canvas = document.getElementById('hero-telemetry-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });

    const pointsCount = 28;
    const dataPointsA = [];
    const dataPointsB = [];

    for (let i = 0; i < pointsCount; i++) {
      dataPointsA.push(40 + Math.random() * 40);
      dataPointsB.push(20 + Math.random() * 30);
    }

    let frame = 0;

    function renderTelemetryChart() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Shift points periodically
      if (frame % 16 === 0) {
        dataPointsA.shift();
        dataPointsA.push(35 + Math.sin(frame * 0.05) * 20 + Math.random() * 25);

        dataPointsB.shift();
        dataPointsB.push(20 + Math.cos(frame * 0.04) * 15 + Math.random() * 20);
      }

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Series A (Cyan Stream)
      drawCurve(dataPointsA, '#06b6d4', 'rgba(6, 182, 212, 0.12)');

      // Draw Series B (Violet Stream)
      drawCurve(dataPointsB, '#8b5cf6', 'rgba(139, 92, 246, 0.1)');

      requestAnimationFrame(renderTelemetryChart);
    }

    function drawCurve(points, strokeColor, fillColor) {
      const step = width / (points.length - 1);

      ctx.beginPath();
      ctx.moveTo(0, height - (points[0] / 100) * height);

      for (let i = 0; i < points.length - 1; i++) {
        const x0 = i * step;
        const y0 = height - (points[i] / 100) * height;
        const x1 = (i + 1) * step;
        const y1 = height - (points[i + 1] / 100) * height;

        const xc = (x0 + x1) / 2;
        const yc = (y0 + y1) / 2;
        ctx.quadraticCurveTo(x0, y0, xc, yc);
      }

      // Fill area under curve
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(0, height - (points[0] / 100) * height);
      for (let i = 0; i < points.length - 1; i++) {
        const x0 = i * step;
        const y0 = height - (points[i] / 100) * height;
        const x1 = (i + 1) * step;
        const y1 = height - (points[i + 1] / 100) * height;

        const xc = (x0 + x1) / 2;
        const yc = (y0 + y1) / 2;
        ctx.quadraticCurveTo(x0, y0, xc, yc);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    requestAnimationFrame(renderTelemetryChart);
  }


  // --- 6. Live Local Time in Timezone ---
  const timeDisplay = document.getElementById('live-local-time');
  function updateLiveClock() {
    if (!timeDisplay) return;
    const now = new Date();
    // Format San Francisco Pacific Time or User Local Time
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    timeDisplay.textContent = `San Francisco, CA • ${timeString} PST`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);


  // --- 7. Back To Top Floating Action ---
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // --- 8. CV / Resume Viewer Modal ---
  const cvModal = document.getElementById('cv-modal');
  const cvTriggers = document.querySelectorAll('.trigger-cv-modal');

  function openCVModal() {
    if (!cvModal) return;
    cvModal.classList.add('active');
  }

  function closeCVModal() {
    if (!cvModal) return;
    cvModal.classList.remove('active');
  }

  cvTriggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    openCVModal();
  }));

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCVModal();
    });
    const closeBtn = cvModal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCVModal);
  }

  window.openCVModal = openCVModal;
  window.closeCVModal = closeCVModal;
})();
