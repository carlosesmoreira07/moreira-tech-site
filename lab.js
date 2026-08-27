/* =====================================================
   MOREIRA TECH — lab.js
   Terminal interativo de demonstração do Quality Gate.
   Carregado exclusivamente em lab.html.
   ===================================================== */

const output = document.getElementById('terminal-output');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!output) {
  console.warn('lab.js: #terminal-output não encontrado.');
} else {
  // Linhas: [cssClass, texto, pausaAposMs]
  const SCRIPT = [
    ['t-dim-cmd', 'playwright test --project=web-cross-domain', 700],
    ['t-info',    'ℹ  Running 6 tests · 2 workers',             350],
    ['t-sub',     '─────────────────────────────────────────',   200],
    ['t-pass',    '✓  [Web] Admin → preço atualizado',          140],
    ['t-pass',    '✓  [Web] Storefront → valor propagado',      140],
    ['t-pass',    '✓  [Web] Carrinho → integridade preservada', 350],
    ['t-sub',     '─────────────────────────────────────────',   200],
    ['t-pass',    '✓  [API] Autorização · HTTP 401 confirmado', 140],
    ['t-pass',    '✓  [Perf] p95 product_view = 412 ms',        140],
    ['t-pass',    '✓  [Perf] p95 order_validation = 231 ms',    450],
    ['t-sub',     '─────────────────────────────────────────',   350],
    ['t-info',    '6 passed · 0 failed · 12.4 s',               250],
    ['t-ok',      '',                                             0],
    ['t-ok',      '✔  QUALITY GATE — APROVADO',                 0],
    ['t-sub',     'PR liberado para merge ✓',                  5000],
  ];

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function makeLine(cls, text) {
    const div = document.createElement('div');
    div.className = `t-line ${cls}`;
    div.textContent = text;
    return div;
  }

  async function runTerminal() {
    if (reducedMotion) {
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

        if (cls === 't-dim-cmd') {
          el.innerHTML = '<span class="t-dim">$</span> ';
          const cmd = document.createElement('span');
          cmd.className = 't-cmd';
          el.appendChild(cmd);
          for (const ch of text) {
            cmd.textContent += ch;
            output.scrollTop = output.scrollHeight;
            await sleep(26);
          }
        } else if (text === '') {
          // Espaço em branco instantâneo
        } else {
          el.textContent = text;
          output.scrollTop = output.scrollHeight;
        }

        if (pause > 0) await sleep(pause);
      }
      await sleep(2200);
    }
  }

  runTerminal();
}
