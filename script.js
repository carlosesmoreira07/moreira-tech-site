/* =====================================================
   MOREIRA TECH - script.js
   Comportamento compartilhado: navegacao, modal, scroll-reveal, badge.
   Terminal especifico do Lab esta em lab.js.
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. NAVEGACAO MOBILE ────────────────────────────────
const menuBtn = document.querySelector('.menu-btn');
const nav     = document.querySelector('#site-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── 2. REVELACAO AO ROLAR (SCROLL REVEAL) ──────────────
{
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// ── 3. PAINEL DE QUALIDADE (HOME) ──────────────────────
{
  const pillars = document.querySelectorAll('.badge-pillar');
  const status  = document.querySelector('.badge-status');

  if (pillars.length) {
    if (reducedMotion) {
      pillars.forEach(el => el.classList.add('visible'));
      if (status) status.classList.add('visible');
    } else {
      pillars.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 500 + i * 250);
      });
      if (status) {
        setTimeout(() => status.classList.add('visible'), 500 + pillars.length * 250 + 200);
      }
    }
  }
}

// ── 4. MODAL DE EVIDENCIA ──────────────────────────────
{
  const dialog    = document.querySelector('.img-dialog');
  const dialogImg = dialog ? dialog.querySelector('img') : null;
  const closeBtn  = dialog ? dialog.querySelector('.dialog-close') : null;

  if (dialog && dialogImg) {
    document.querySelectorAll('[data-modal-src]').forEach(btn => {
      btn.addEventListener('click', () => {
        dialogImg.src = btn.dataset.modalSrc;
        dialogImg.alt = btn.dataset.modalAlt || 'Evidencia técnica selecionada';
        dialog.showModal();
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }
}
