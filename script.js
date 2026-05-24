/* ══════════════════════════════════════════════
   ARCHI PRIYA — PORTFOLIO SCRIPT v2
   ══════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Use delegation so cursor hover never blocks native link clicks (mailto, etc.)
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, .project-card, .contact-link'))
    ring?.classList.add('hover-state');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button, .project-card, .contact-link'))
    ring?.classList.remove('hover-state');
});

/* ── SCROLL PROGRESS ── */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (progressBar) {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  }
}, { passive: true });

/* ── NAVBAR ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
  document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    // Skip non-hash links (mailto:, https://, etc.)
    if (!href || !href.startsWith('#') || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        const match = item.getAttribute('href') === '#' + entry.target.id;
        item.classList.toggle('active', match);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.children || [])].filter(el => el.classList.contains('reveal'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 90, 360));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-width]').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 250);
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-category, .dsa-card').forEach(el => skillObserver.observe(el));

/* ── HERO NAME SCRAMBLE ── */
function scramble(el, final) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';
  let i = 0;
  const iv = setInterval(() => {
    el.innerHTML = final.split('').map((c, idx) => {
      if (c === '\n') return '<br>';
      if (idx < i) return `<span style="color:var(--text-1)">${c}</span>`;
      return `<span style="color:var(--text-3)">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
    }).join('');
    if (i >= final.length) { el.innerHTML = final.replace('\n', '<br>'); clearInterval(iv); }
    i += 1.4;
  }, 32);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const nameLines = document.querySelectorAll('.name-line');
    if (nameLines.length >= 1) scramble(nameLines[0], 'Archi');
    if (nameLines.length >= 2) setTimeout(() => scramble(nameLines[1], 'Priya'), 500);
  }, 300);
});

/* ── STATS COUNTER ── */
function countUp(el, target) {
  const dur = 1600;
  const start = performance.now();
  const step = ts => {
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const so = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    statsEl.querySelectorAll('.h-stat-num[data-target]').forEach(el => {
      countUp(el, parseInt(el.dataset.target));
    });
    so.disconnect();
  }, { threshold: 0.5 });
  so.observe(statsEl);
}

/* ── PROJECT CARD TILT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .3s var(--ease), border-color .3s, box-shadow .3s';
  });
});

/* ── TERMINAL TYPING ── */
(function animateTerminal() {
  const cmds = document.querySelectorAll('.t-cmd[data-text]');
  cmds.forEach((cmd, i) => {
    const text = cmd.dataset.text;
    cmd.textContent = '';
    let ci = 0;
    setTimeout(() => {
      const iv = setInterval(() => {
        cmd.textContent += text[ci++];
        if (ci >= text.length) clearInterval(iv);
      }, 45);
    }, i * 900 + 600);
  });
})();

/* ── MODALS ── */
function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ── CONTACT FORM — Formspree ── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

form?.addEventListener('submit', async e => {
  e.preventDefault(); // We handle it via fetch so page doesn't reload

  const data = new FormData(form);
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      // Success
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
      if (successMsg) successMsg.style.display = 'flex';
      form.reset();
      setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 6000);
    } else {
      // Formspree returned an error
      const json = await res.json();
      throw new Error(json?.errors?.map(e => e.message).join(', ') || 'Form error');
    }
  } catch (err) {
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
    alert('Oops! Something went wrong. Please email me directly at archipriya03@gmail.com');
    console.error(err);
  }
});

/* ── BACK TO TOP ── */
document.getElementById('backTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONSOLE EASTER EGG ── */
console.log(
  '\n%c 👩‍💻 Archi Priya %c Full Stack Developer \n',
  'background:#f59e0b;color:#000;padding:6px 14px;font-size:14px;font-weight:bold;border-radius:6px 0 0 6px',
  'background:#0c1119;color:#f59e0b;padding:6px 14px;font-size:14px;border-radius:0 6px 6px 0;border:1px solid #f59e0b'
);
console.log('%c 🔗 GitHub: https://github.com/archipriya03', 'color:#38bdf8');
console.log('%c 📧 Email: archipriya03@gmail.com', 'color:#4ade80');

/* ── MAILTO SAFETY — ensure all email links always work ── */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', e => {
    e.stopPropagation();
    window.location.href = link.getAttribute('href');
  });
});