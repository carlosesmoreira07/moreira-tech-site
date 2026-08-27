/* =====================================================
   MOREIRA TECH — lab.js
   Terminal interativo com typewriter em PT-BR.
   Carregado exclusivamente em lab.html.
   ===================================================== */

const output = document.getElementById('terminal-output');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!output) {
  console.warn('lab.js: #terminal-output não encontrado.');
} else {
  const SCRIPT = [
    ['t-dim-cmd', 'playwright test --project=web-cross-domain', 700],
    ['t-info',    'Analisando riscos: 6 testes executando em 2 workers', 350],
    ['t-sub',     '  ──────────────────────────────────────────', 200],
    ['t-pass',    '  ✓  [PASS] Web / Admin: preço atualizado (R$ 199,90)', 130],
    ['t-pass',    '  ✓  [PASS] Web / Storefront: valor propagado', 130],
    ['t-pass',    '  ✓  [PASS] Web / Carrinho: integridade preservada', 350],
    ['t-sub',     '  ──────────────────────────────────────────', 200],
    ['t-pass',    '  ✓  [PASS] Segurança / Limite HTTP 401 confirmado', 130],
    ['t-pass',    '  ✓  [PASS] Carga k6 / p95 = 412 ms (< 1000 ms)', 450],
    ['t-sub',     '  ──────────────────────────────────────────', 350],
    ['t-info',    '  6 aprovados · 0 falhas · Duração: 12.4 s', 250],
    ['t-ok',      '', 0],
    ['t-ok',      '  ✔  Quality Gate: APROVADO COM SUCESSO', 0],
    ['t-sub',     '  Pull Request liberado para integração contínua', 5000],
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
        if (text) output.appendChild(makeLine(cls, text));
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
