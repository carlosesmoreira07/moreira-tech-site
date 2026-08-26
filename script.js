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
  // Close on nav link click
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── 2. TERMINAL ANIMATION ──────────────────────────────
const output = document.getElementById('terminal-output');
const cursor = document.querySelector('.terminal-cursor');

// Respect prefers-reduced-motion
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCRIPT = [
  { cls: 'running', delay: 600, lines: [
    { cls: 't-info', text: 'ℹ  Running 6 tests using 2 workers' },
    { cls: 't-sub',  text: 'project: web-cross-domain-flow' },
  ]},
  { delay: 900, lines: [
    { cls: 't-pass', text: '  ✓  [Admin] criar produto com preço R$199,90' },
    { cls: 't-pass', text: '  ✓  [Storefront] produto visível com preço correto' },
    { cls: 't-pass', text: '  ✓  [Carrinho] valor preservado no checkout' },
  ]},
  { delay: 600, lines: [
    { cls: 't-sub',  text: 'project: api-security' },
  ]},
  { delay: 400, lines: [
    { cls: 't-pass', text: '  ✓  anonymous → admin mutation → HTTP 401 ✓' },
    { cls: 't-pass', text: '  ✓  price integrity after concurrent edits' },
  ]},
  { delay: 800, lines: [
    { cls: 't-sub',  text: 'project: performance / k6' },
    { cls: 't-pass', text: '  ✓  p95 product_view = 412 ms  (< 1 000 ms)' },
    { cls: 't-pass', text: '  ✓  p95 order_validation = 238 ms  (< 500 ms)' },
    { cls: 't-pass', text: '  ✓  http_req_failed rate = 0' },
  ]},
  { delay: 700, lines: [
    { cls: 't-info', text: '─────────────────────────────────────────────' },
    { cls: 't-pass', text: '  6 passed  (6)' },
    { cls: 't-info', text: '  Finished in 12.4s' },
  ]},
  { delay: 500, lines: [
    { cls: 't-ok',  text: '' },
    { cls: 't-ok',  text: '  ✔  QUALITY GATE — APROVADO' },
    { cls: 't-sub', text: '  Pull Request liberado para merge ✓' },
  ]},
];

function addLine(cls, text) {
  const div = document.createElement('div');
  div.className = `t-line ${cls}`;
  div.textContent = text;
  output.appendChild(div);
  // Keep scroll at bottom
  output.scrollTop = output.scrollHeight;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTerminal() {
  if (!output || reducedMotion) {
    // Static fallback for reduced motion
    if (output) {
      SCRIPT.forEach(block => block.lines.forEach(l => addLine(l.cls, l.text)));
    }
    return;
  }

  await sleep(800);

  for (const block of SCRIPT) {
    await sleep(block.delay);
    for (const line of block.lines) {
      addLine(line.cls, line.text);
      await sleep(120);
    }
  }

  // Restart loop after pause
  await sleep(4500);
  output.innerHTML = '<div class="t-line"><span class="t-dim">$</span> <span class="t-cmd">playwright test --project=web-cross-domain</span></div>';
  runTerminal();
}

runTerminal();

// ── 3. IMAGE MODAL ─────────────────────────────────────
const dialog   = document.querySelector('.img-dialog');
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

  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
}
