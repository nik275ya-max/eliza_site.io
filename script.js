/* ============================================
   ELIZA LANDING — SCRIPTS
   ============================================ */

// ── Particles canvas ─────────────────────────
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticles() {
    const count = Math.floor(W * H / 14000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x:     rand(0, W),
        y:     rand(0, H),
        r:     rand(0.4, 1.6),
        dx:    rand(-0.12, 0.12),
        dy:    rand(-0.22, -0.06),
        alpha: rand(0.1, 0.55),
        dAlpha: rand(0.002, 0.008),
        rising: true,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // drift
      p.x += p.dx;
      p.y += p.dy;

      // flicker
      if (p.rising) {
        p.alpha += p.dAlpha;
        if (p.alpha >= 0.6) p.rising = false;
      } else {
        p.alpha -= p.dAlpha;
        if (p.alpha <= 0.05) p.rising = true;
      }

      // wrap
      if (p.y < -4)  p.y = H + 4;
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W+4) p.x = -4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }

  function init() {
    resize();
    createParticles();
    drawParticles();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  init();
})();


// ── Scroll reveal ─────────────────────────────
(function () {
  const els = document.querySelectorAll(
    '.feature-card, .plan-card, .step, .setup-note, .section-title, .section-label, .cta-content'
  );

  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


// ── Button ripple effect ──────────────────────
(function () {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // ripple
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        transform:scale(0);
        animation:ripple-anim 0.55s linear;
        background:rgba(255,255,255,0.15);
        pointer-events:none;
      `;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.width  = ripple.style.height = size + 'px';
      ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();


// ── Navbar scroll shadow ──────────────────────
(function () {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 4px 28px rgba(0,0,0,0.55)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
})();


// ── Smooth anchor scroll (fallback) ──────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
