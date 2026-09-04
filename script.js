/* =====================================================
   MOREIRA TECH — script.js
   Comportamento compartilhado: navegação, modal, scroll-reveal,
   painel de qualidade, simulação de execução, cópia de e-mail
   e terminal de Quality Gate.
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. NAVEGAÇÃO MOBILE ────────────────────────────────
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

// ── 2. REVELAÇÃO AO ROLAR (SCROLL REVEAL) ──────────────
{
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// ── 3. PAINEL DE QUALIDADE (HERO HOME) ─────────────────
{
  const pillars = document.querySelectorAll('.badge-pillar');
  const status  = document.querySelector('.badge-status');

  if (pillars.length) {
    if (reducedMotion) {
      pillars.forEach(el => el.classList.add('visible'));
      if (status) status.classList.add('visible');
    } else {
      pillars.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 400 + i * 200);
      });
      if (status) {
        setTimeout(() => status.classList.add('visible'), 400 + pillars.length * 200 + 150);
      }
    }
  }
}

// ── 4. TERMINAL INTERATIVO (QUALITY GATE) ─────────────
function initQualityGateTerminal() {
  const output = document.getElementById('terminal-output');
  if (!output || output.dataset.running) return;
  output.dataset.running = 'true';

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
    div.className = 't-line ' + cls;
    div.textContent = text;
    return div;
  }

  async function run() {
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
          // spacer
        } else {
          el.textContent = text;
          output.scrollTop = output.scrollHeight;
        }

        if (pause > 0) await sleep(pause);
      }
      await sleep(2200);
    }
  }

  run();
}
initQualityGateTerminal();

// ── 5. SIMULAÇÃO DE EXECUÇÃO INTERATIVA (CASE VISUAL) ──
{
  const stepItems = document.querySelectorAll('.flow-step-item');
  const stagePreview = document.querySelector('.flow-live-stage');
  const playBtn = document.querySelector('.flow-replay-btn');

  if (stepItems.length && stagePreview) {
    let currentStep = 0;
    let timer = null;

    const stages = [
      {
        badge: 'ETAPA 1 / ADMIN',
        title: 'Atualização de Preço no Painel Admin',
        code: 'await page.fill("#product-price", "199.90"); await page.click("#save-product");',
        detail: 'Preço alterado com sucesso para R$ 199,90 no catálogo mestre.',
        status: 'STATUS 200 OK · MUTATION CONCLUÍDA'
      },
      {
        badge: 'ETAPA 2 / STOREFRONT',
        title: 'Sincronização em Tempo Real na Vitrine',
        code: 'await page.goto("/storefront"); expect(await page.locator(".price")).toHaveText("R$ 199,90");',
        detail: 'Vitrine reflete o novo valor instantaneamente sem cache desatualizado.',
        status: 'CHECK PASS · PROPAGAÇÃO CONFIRMADA'
      },
      {
        badge: 'ETAPA 3 / CARRINHO & CHECKOUT',
        title: 'Validação de Integridade no Carrinho Final',
        code: 'await page.click(".btn-buy"); expect(await page.locator(".cart-total")).toHaveText("R$ 199,90");',
        detail: 'Total do pedido preservado com precisão centesimal no carrinho final.',
        status: 'QUALITY GATE PASS · MERGE APROVADO'
      }
    ];

    function activateStep(index) {
      currentStep = index;
      stepItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.classList.toggle('completed', i < index);
      });

      const data = stages[index];
      if (data) {
        stagePreview.innerHTML = `
          <div class="flow-stage-head">
            <span class="flow-stage-badge">${data.badge}</span>
            <span class="flow-stage-status">${data.status}</span>
          </div>
          <div class="flow-stage-body">
            <strong>${data.title}</strong>
            <code>${data.code}</code>
            <p>${data.detail}</p>
          </div>
        `;
      }
    }

    function startCycle() {
      if (reducedMotion) {
        activateStep(2);
        return;
      }
      activateStep(0);
      clearInterval(timer);
      timer = setInterval(() => {
        const next = (currentStep + 1) % stages.length;
        activateStep(next);
      }, 3600);
    }

    stepItems.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        clearInterval(timer);
        activateStep(idx);
      });
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        startCycle();
      });
    }

    startCycle();
  }
}

// ── 6. CÓPIA DE E-MAIL COM FEEDBACK VISUAL ─────────────
{
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email || 'contato@moreira-tech.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const input = document.createElement('input');
          input.value = email;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
      } catch (err) {
        console.warn('Erro ao copiar:', err);
      }

      const actionText = btn.querySelector('.email-action-text');
      if (actionText) {
        const originalText = actionText.innerHTML;
        actionText.innerHTML = 'Copiado! ✓';
        actionText.classList.add('copied');
        setTimeout(() => {
          actionText.innerHTML = originalText;
          actionText.classList.remove('copied');
        }, 2200);
      }
    });
  });
}

// ── 7. MODAL DE EVIDÊNCIA EM ALTA RESOLUÇÃO ────────────
{
  const dialog    = document.querySelector('.img-dialog');
  const dialogImg = dialog ? dialog.querySelector('img') : null;
  const closeBtn  = dialog ? dialog.querySelector('.dialog-close') : null;

  if (dialog && dialogImg) {
    document.querySelectorAll('[data-modal-src]').forEach(btn => {
      const openModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dialogImg.src = btn.dataset.modalSrc;
        dialogImg.alt = btn.dataset.modalAlt || 'Evidência técnica selecionada';
        dialog.showModal();
      };
      btn.addEventListener('click', openModal);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openModal(e);
        }
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }
}

// ── 8. BLOQUEIO DE ATALHO DE CÓPIA (CTRL+C) ───────────
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
  }
});

// ── 9. BOTÃO FLUTUANTE DE VOLTAR AO TOPO ───────────────
{
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

