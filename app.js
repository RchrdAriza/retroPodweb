/* =====================================================
   RETROPOD — Landing Page JavaScript
   Interactions, animations, and dynamic content
   ===================================================== */

'use strict';

/* ---- NAV SCROLL EFFECT ---- */
(function () {
  const nav = document.getElementById('main-nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.style.boxShadow = '0 4px 40px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
    lastY = y;
  }, { passive: true });
})();

/* ---- HAMBURGER MENU ---- */
(function () {
  const btn = document.getElementById('nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(10,10,15,0.98)';
      links.style.padding = '16px 24px';
      links.style.gap = '16px';
      links.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      links.style.backdropFilter = 'blur(20px)';
    } else {
      links.style.display = '';
    }
  });
})();

/* ---- INTERFACE SCREEN SWITCHER ---- */
(function () {
  const buttons = document.querySelectorAll('.iface-btn');
  const panels = document.querySelectorAll('.screen-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;

      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('screen-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* Click wheel interaction on iface-device */
  const wheelCenter = document.getElementById('wheel-center');
  if (wheelCenter) {
    wheelCenter.addEventListener('click', () => {
      const activeBtn = document.querySelector('.iface-btn.active');
      if (!activeBtn) return;
      const btns = Array.from(buttons);
      const currentIndex = btns.indexOf(activeBtn);
      const nextIndex = (currentIndex + 1) % btns.length;
      btns[nextIndex].click();
    });
  }
})();

/* ---- SKINS SWITCHER ---- */
(function () {
  const options = document.querySelectorAll('.skin-option');
  const device = document.getElementById('skins-device');
  const label = document.getElementById('skins-active-label');

  if (!device) return;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('active');
        o.setAttribute('aria-pressed', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-pressed', 'true');

      const skinId = opt.dataset.skinId;
      const skinName = opt.querySelector('.skin-option-label').textContent;

      device.setAttribute('data-active-skin', skinId);
      if (label) label.textContent = skinName;

      /* Animate transition */
      device.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      device.style.transform = 'scale(0.96)';
      setTimeout(() => { device.style.transform = ''; }, 200);
    });
  });
})();

/* ---- PLAYER CONTROLS ---- */
(function () {
  const playBtn = document.getElementById('btn-play');
  const shuffleBtn = document.getElementById('btn-shuffle');
  const repeatBtn = document.getElementById('btn-repeat');
  const fill = document.getElementById('player-fill');
  const thumb = document.getElementById('player-thumb');
  const volume = document.getElementById('player-volume');

  let isPlaying = false;
  let progress = 29;
  let progressInterval = null;

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '&#9646;&#9646;' : '&#9654;';
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      playBtn.setAttribute('aria-pressed', String(isPlaying));

      if (isPlaying) {
        progressInterval = setInterval(() => {
          progress = Math.min(100, progress + 0.2);
          updateFill();
          if (progress >= 100) {
            progress = 0;
            isPlaying = false;
            clearInterval(progressInterval);
            playBtn.innerHTML = '&#9654;';
            playBtn.setAttribute('aria-label', 'Play');
          }
        }, 100);
      } else {
        clearInterval(progressInterval);
      }
    });
  }

  function updateFill() {
    if (fill) fill.style.width = progress + '%';
    if (thumb) thumb.style.left = progress + '%';
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const active = shuffleBtn.classList.toggle('active');
      shuffleBtn.setAttribute('aria-pressed', String(active));
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
      const active = repeatBtn.classList.toggle('active');
      repeatBtn.setAttribute('aria-pressed', String(active));
    });
  }

  /* Volume slider background */
  if (volume) {
    volume.addEventListener('input', () => {
      const val = volume.value;
      volume.style.background = `linear-gradient(90deg, var(--aqua) ${val}%, rgba(255,255,255,0.1) ${val}%)`;
    });
  }

  /* Progress bar click */
  const progressBar = document.querySelector('.player-progress');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      progress = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      updateFill();
    });
  }
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  if (!window.IntersectionObserver) return;

  const els = document.querySelectorAll(
    '.download-card, .spec-block, .what-is-grid'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.07}s, transform 0.6s ease ${(i % 6) * 0.07}s`;
    observer.observe(el);
  });
})();

/* ---- ACTIVE NAV LINK ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--aqua)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ---- SMOOTH ANCHOR SCROLL ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      /* Close hamburger if open */
      const hamburger = document.getElementById('nav-hamburger');
      if (hamburger && hamburger.getAttribute('aria-expanded') === 'true') {
        hamburger.click();
      }
    });
  });
})();
