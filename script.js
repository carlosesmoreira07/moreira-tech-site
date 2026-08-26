/* =====================================================
   MOREIRA TECH — script.js
   1. Mobile nav
   2. Terminal typewriter animation
   3. Image modal dialog
   ===================================================== */

// ── 1. MOBILE NAV ──────────────────────────────────────
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

// ── 2. TERMINAL TYPEWRITER ─────────────────────────────
const output      = document.getElementById('terminal-output');
const cursor      = document.querySelector('.terminal-cursor');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Script lines: [cssClass, text, pauseAfter(ms)]
// pauseAfter = extra wait after this line before next
const SCRIPT = [
  ['t-dim-cmd', '$ playwright test --project=web-cross-domain', 600],
  ['t-info',    'ℹ  Running 6 tests · 2 workers',              300],
  ['t-sub',     '  ─────────────────────────────────────────',  200],
  ['t-pass',    '  ✓  [Web] Admin → preço atualizado',          120],
  ['t-pass',    '  ✓  [Web] Storefront → valor propagado',      120],
  ['t-pass',    '  ✓  [Web] Carrinho → integridade preservada', 300],
  ['t-sub',     '  ─────────────────────────────────────────',  200],
  ['t-pass',    '  ✓  [API] Autorização · HTTP 401 confirmado', 120],
  ['t-pass',    '  ✓  [Perf] p95 product_view = 412 ms',        120],
  ['t-pass',    '  ✓  [Perf] p95 order_validation = 231 ms',    400],
  ['t-sub',     '  ─────────────────────────────────────────',  300],
  ['t-info',    '  6 passed · 0 failed · 12.4 s',               200],
  ['t-ok',      '',                                              0],
  ['t-ok',      '  ✔  QUALITY GATE — APROVADO',                 0],
  ['t-sub',     '  PR liberado para merge ✓',                   4000],
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function makeLine(cls, text) {
  const div = document.createElement('div');
  div.className = `t-line ${cls}`;
  div.textContent = text;
  return div;
}

async function typeLine(el, text, charDelay = 22) {
  for (const ch of text) {
    el.textContent += ch;
    output.scrollTop = output.scrollHeight;
    await sleep(charDelay);
  }
}

async function runAnimation() {
  if (!output) return;

  if (reducedMotion) {
    // Static snapshot — no typing, no loop
    SCRIPT.forEach(([cls, text]) => {
      if (cls !== 't-ok' || text) output.appendChild(makeLine(cls, text));
    });
    return;
  }

  while (true) {
    output.innerHTML = '';

    for (const [cls, text, pause] of SCRIPT) {
      const el = makeLine(cls, '');
      output.appendChild(el);

      // First line types char-by-char, rest appear word-by-word for speed
      const isCommand = cls === 't-dim-cmd';
      if (isCommand) {
        // Show $ prompt immediately, then type the command
        el.innerHTML = '<span class="t-dim">$</span> ';
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 't-cmd';
        el.appendChild(cmdSpan);
        for (const ch of text.replace(/^\$ /, '')) {
          cmdSpan.textContent += ch;
          output.scrollTop = output.scrollHeight;
          await sleep(28);
        }
      } else if (text === '') {
        // Empty spacer — instant
      } else {
        // Fast reveal for status lines
        el.textContent = text;
        output.scrollTop = output.scrollHeight;
      }

      if (pause > 0) await sleep(pause);
    }

    // Pause at end before loop restart
    await sleep(1800);
  }
}

runAnimation();

// ── 3. IMAGE MODAL ─────────────────────────────────────
const dialog    = document.querySelector('.img-dialog');
const dialogImg = dialog ? dialog.querySelector('img') : null;
const closeBtn  = dialog ? dialog.querySelector('.dialog-close') : null;

if (dialog && dialogImg) {
  document.querySelectorAll('[data-modal-src]').forEach(btn => {
    btn.addEventListener('click', () => {
      dialogImg.src = btn.dataset.modalSrc;
      dialogImg.alt = btn.dataset.modalAlt || '';
      dialog.showModal();
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
}
