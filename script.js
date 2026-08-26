const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');
const dialog = document.querySelector('.evidence-dialog');
const dialogImage = dialog.querySelector('img');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
}

if (dialog && dialogImage) {
  document.querySelectorAll('[data-modal-src]').forEach((button) => {
    button.addEventListener('click', () => {
      dialogImage.src = button.dataset.modalSrc;
      dialogImage.alt = button.dataset.modalAlt;
      dialog.showModal();
    });
  });

  const closeBtn = dialog.querySelector('.dialog-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

// Signature Motion Moment — Quality System Pipeline Cycler
const pipelineSteps = [
  { step: '01 / 04', label: 'RISK.DETECT()', status: 'ANALISANDO RISCO', detail: 'Identificando impactos nas jornadas críticas de produto.', signal: 'risk' },
  { step: '02 / 04', label: 'QUALITY.CONTROL()', status: 'EXECUTANDO CONTROLES', detail: 'Rodando suítes de automação Playwright Web & API.', signal: 'control' },
  { step: '03 / 04', label: 'EVIDENCE.COLLECT()', status: 'VALIDANDO EVIDÊNCIAS', detail: 'Verificando thresholds de k6, p95 e autorização HTTP 401.', signal: 'evidence' },
  { step: '04 / 04', label: 'DECISION.APPROVE()', status: 'QUALITY GATE APROVADO', detail: 'Evidências 100% verificadas. Release liberado com segurança.', signal: 'mint' }
];

const panelCore = document.querySelector('.decision-core');
const panelTopline = document.querySelector('.panel-topline .step-counter');

if (panelCore && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let currentIndex = 0;
  let intervalId = null;

  const updatePanel = (index) => {
    const data = pipelineSteps[index];
    panelCore.classList.add('transitioning');
    
    setTimeout(() => {
      if (panelTopline) panelTopline.textContent = data.step;
      const labelEl = panelCore.querySelector('.decision-label');
      const statusEl = panelCore.querySelector('strong');
      const detailEl = panelCore.querySelector('p');

      if (labelEl) labelEl.textContent = data.label;
      if (statusEl) {
        statusEl.textContent = data.status;
        statusEl.className = data.signal === 'risk' ? 'text-amber' : data.signal === 'evidence' ? 'text-blue' : 'text-mint';
      }
      if (detailEl) detailEl.textContent = data.detail;
      panelCore.classList.remove('transitioning');
    }, 180);
  };

  const startCycling = () => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % pipelineSteps.length;
      updatePanel(currentIndex);
    }, 3200);
  };

  startCycling();

  const decisionPanel = document.querySelector('.decision-panel');
  if (decisionPanel) {
    decisionPanel.addEventListener('mouseenter', () => clearInterval(intervalId));
    decisionPanel.addEventListener('mouseleave', () => startCycling());
  }
}
