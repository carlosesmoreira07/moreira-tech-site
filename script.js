/* =====================================================
   MOREIRA TECH — script.js
   Comportamento compartilhado: navegação, modal, scroll-reveal,
   painel de qualidade e simulação de execução interativa.
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

// ── 4. SIMULAÇÃO DE EXECUÇÃO INTERATIVA (CASE VISUAL) ──
{
  const stepItems = document.querySelectorAll('.flow-step-item');
  const stagePreview = document.querySelector('.flow-live-stage');
  const playBtn = document.querySelector('.flow-replay-btn');

  if (stepItems.length && stagePreview) {
    let currentStep = 0;
    let timer = null;

    const stages = [
      {
        badge: 'ETAPA 01 / ADMIN',
        title: 'Atualização de Preço no Painel Admin',
        code: 'await page.fill("#product-price", "199.90"); await page.click("#save-product");',
        detail: 'Preço alterado com sucesso para R$ 199,90 no catálogo mestre.',
        status: 'STATUS 200 OK · MUTATION CONCLUÍDA'
      },
      {
        badge: 'ETAPA 02 / STOREFRONT',
        title: 'Sincronização em Tempo Real na Loja',
        code: 'await page.goto("/storefront"); expect(await page.locator(".price")).toHaveText("R$ 199,90");',
        detail: 'Vitrine reflete o novo valor instantaneamente sem cache desatualizado.',
        status: 'CHECK PASS · PROPAGAÇÃO CONFIRMADA'
      },
      {
        badge: 'ETAPA 03 / CARRINHO & CHECKOUT',
        title: 'Validação de Integridade no Carrinho',
        code: 'await page.click(".btn-buy"); expect(await page.locator(".cart-total")).toHaveText("R$ 199,90");',
        detail: 'Total do pedido preservado com precisão centesimal durante todo o checkout.',
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
      }, 3500);
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

// ── 5. MODAL DE EVIDÊNCIA EM ALTA RESOLUÇÃO ────────────
{
  const dialog    = document.querySelector('.img-dialog');
  const dialogImg = dialog ? dialog.querySelector('img') : null;
  const closeBtn  = dialog ? dialog.querySelector('.dialog-close') : null;

  if (dialog && dialogImg) {
    document.querySelectorAll('[data-modal-src]').forEach(btn => {
      btn.addEventListener('click', () => {
        dialogImg.src = btn.dataset.modalSrc;
        dialogImg.alt = btn.dataset.modalAlt || 'Evidência técnica selecionada';
        dialog.showModal();
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }
}
