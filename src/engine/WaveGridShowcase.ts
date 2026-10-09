export interface WaveGridOptions {
  columns?: number;
  onClone?: (presetId: string, item: any) => void;
}

export class WaveGridShowcase {
  private container: HTMLElement;
  private gridWrapperEl: HTMLElement | null = null;
  private cards: HTMLElement[] = [];
  private expandedCard: HTMLElement | null = null;
  private isPaused: boolean = false;
  private columns: number = 6;
  private onCloneCallback?: (presetId: string, item: any) => void;

  constructor(container: HTMLElement, options: WaveGridOptions = {}) {
    this.container = container;
    this.columns = options.columns || 6;
    this.onCloneCallback = options.onClone;

    this.init();
  }

  private init() {
    const rawCards = Array.from(this.container.querySelectorAll<HTMLElement>('.trending-card'));
    if (rawCards.length === 0) return;

    this.cards = rawCards;
    const total = this.cards.length;

    // Determine grid dimensions based on card count
    // Default 6 columns x ceil(total/6) rows
    const cols = total >= 18 ? 6 : total >= 12 ? 5 : 4;
    this.columns = cols;

    // Setup stage structure
    this.container.classList.add('wave-grid-stage');
    this.container.innerHTML = '';

    const headerBar = document.createElement('div');
    headerBar.className = 'wave-grid-header';
    headerBar.innerHTML = `
      <div class="wave-grid-title-group">
        <span class="wave-grid-title-badge">04 / SPATIAL CARDS</span>
        <h3 class="wave-grid-title">波浪矩阵 <span>WAVE GRID</span></h3>
      </div>
      <div class="wave-grid-controls">
        <button type="button" class="btn-toggle-wave" id="btnToggleWave" title="暂停/恢复波浪">
          <iconify-icon icon="lucide:waves"></iconify-icon>
          <span class="wave-toggle-text">波动中</span>
        </button>
      </div>
    `;

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'wave-grid-matrix';
    gridWrapper.style.setProperty('--grid-cols', cols.toString());
    this.gridWrapperEl = gridWrapper;

    // Distribute cards into grid with spatial row & col properties
    this.cards.forEach((card, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;

      card.classList.add('wave-card');
      card.dataset.index = idx.toString();
      card.dataset.row = row.toString();
      card.dataset.col = col.toString();

      // CSS custom properties for wave propagation delay:
      // Wave travels diagonally from top-left (col 0, row 0) across the matrix
      const delayOrder = (col * 0.16) + (row * 0.22);
      card.style.setProperty('--wave-delay', `${delayOrder.toFixed(2)}s`);
      card.style.setProperty('--card-col', col.toString());
      card.style.setProperty('--card-row', row.toString());

      gridWrapper.appendChild(card);
    });

    // Backdrop overlay for expanded mode
    const backdrop = document.createElement('div');
    backdrop.className = 'wave-grid-backdrop';
    backdrop.addEventListener('click', () => this.closeExpanded());

    // Bottom requirement indicator matching reference
    const footerBar = document.createElement('div');
    footerBar.className = 'wave-grid-footer-bar';
    footerBar.innerHTML = `
      <div class="wave-requirement-box">
        <div class="req-title">实现要点</div>
        <div class="req-desc">保留原有行列位置 · 起伏按行列顺序传播<br>选中项暂停并展开 · 关闭后回到队列</div>
      </div>
    `;

    this.container.appendChild(headerBar);
    this.container.appendChild(backdrop);
    this.container.appendChild(gridWrapper);
    this.container.appendChild(footerBar);

    this.bindEvents();
  }

  public setWaveState(paused: boolean) {
    this.isPaused = paused;
    if (this.gridWrapperEl) {
      this.gridWrapperEl.classList.toggle('wave-paused', paused);
    }
    const toggleBtn = this.container.querySelector('#btnToggleWave') as HTMLElement;
    if (toggleBtn) {
      const textSpan = toggleBtn.querySelector('.wave-toggle-text') as HTMLElement;
      if (textSpan) {
        textSpan.textContent = paused ? '已暂停' : '波动中';
      }
      toggleBtn.classList.toggle('active', paused);
    }
  }

  public expandCard(card: HTMLElement) {
    if (this.expandedCard === card) {
      this.closeExpanded();
      return;
    }

    if (this.expandedCard) {
      this.expandedCard.classList.remove('is-expanded');
    }

    // 1. Pause wave animation across matrix
    this.setWaveState(true);

    // 2. Expand selected card
    this.expandedCard = card;
    card.classList.add('is-expanded');
    this.container.classList.add('has-expanded-card');

    // Smooth scroll card into clear view within stage if needed
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  public closeExpanded() {
    if (!this.expandedCard) return;

    this.expandedCard.classList.remove('is-expanded');
    this.expandedCard = null;
    this.container.classList.remove('has-expanded-card');

    // 3. Resume wave propagation after brief smooth return transition
    setTimeout(() => {
      this.setWaveState(false);
    }, 280);
  }

  private bindEvents() {
    // Toggle wave button
    const toggleBtn = this.container.querySelector('#btnToggleWave');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.setWaveState(!this.isPaused);
      });
    }

    // Card click: expand/pause or trigger clone
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Close button inside expanded card
      if (target.closest('.btn-close-expanded')) {
        e.stopPropagation();
        this.closeExpanded();
        return;
      }

      // Clone button click
      const cloneBadge = target.closest('.trending-clone-badge');
      if (cloneBadge) {
        // Let main.ts clone handler do its job, but also close expanded
        setTimeout(() => this.closeExpanded(), 150);
        return;
      }

      // Click card itself -> expand card and pause wave
      const card = target.closest('.wave-card') as HTMLElement;
      if (card) {
        this.expandCard(card);
      }
    });

    // Escape key closes expanded card
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.expandedCard) {
        this.closeExpanded();
      }
    });
  }
}
