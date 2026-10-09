export interface DepthStackOptions {
  stepX?: number;
  stepY?: number;
  scaleStep?: number;
}

export class DepthStackShowcase {
  private container: HTMLElement;
  private stackTrackEl: HTMLElement | null = null;
  private cards: HTMLElement[] = [];
  private activeIndex: number = 0;
  private isDragging: boolean = false;
  private startX: number = 0;
  private totalDragDistance: number = 0;
  private stepX: number = 68;       // Horizontal diagonal spacing
  private stepY: number = -16;      // Vertical upward staircase step
  private scaleStep: number = 0.045;// Scale decrement per tier

  constructor(container: HTMLElement, options: DepthStackOptions = {}) {
    this.container = container;
    this.stepX = options.stepX || 68;
    this.stepY = options.stepY || -16;
    this.scaleStep = options.scaleStep || 0.045;

    this.init();
  }

  private init() {
    const rawCards = Array.from(this.container.querySelectorAll<HTMLElement>('.trending-card'));
    if (rawCards.length === 0) return;

    this.cards = rawCards;

    // Setup 3D Depth Stack Stage
    this.container.classList.add('depth-stack-stage');
    this.container.innerHTML = '';

    const headerBar = document.createElement('div');
    headerBar.className = 'depth-stack-header';
    headerBar.innerHTML = `
      <div class="depth-stack-title-group">
        <span class="depth-stack-badge">02 / SPATIAL CARDS</span>
        <h3 class="depth-stack-title">纵深叠排 <span>DEPTH STACK</span></h3>
      </div>
      <div class="depth-stack-nav">
        <button type="button" class="btn-stack-nav" id="btnPrevStack" title="Previous Card">
          <iconify-icon icon="lucide:chevron-left"></iconify-icon>
        </button>
        <span class="stack-counter" id="stackCounter">1 / ${this.cards.length}</span>
        <button type="button" class="btn-stack-nav" id="btnNextStack" title="Next Card">
          <iconify-icon icon="lucide:chevron-right"></iconify-icon>
        </button>
      </div>
    `;

    const viewport = document.createElement('div');
    viewport.className = 'depth-stack-viewport';

    const track = document.createElement('div');
    track.className = 'depth-stack-track';
    this.stackTrackEl = track;

    this.cards.forEach((card, idx) => {
      card.classList.add('depth-card');
      card.dataset.index = idx.toString();
      track.appendChild(card);
    });

    viewport.appendChild(track);
    this.container.appendChild(headerBar);
    this.container.appendChild(viewport);

    // Bottom guide indicator matching reference design
    const footerBar = document.createElement('div');
    footerBar.className = 'depth-stack-footer-bar';
    footerBar.innerHTML = `
      <div class="depth-guide-hint">
        <iconify-icon icon="lucide:layers"></iconify-icon>
        <span>点击后方卡片切换置顶 · 拖动横向浏览 · 点击“Clone Design”应用</span>
      </div>
    `;
    this.container.appendChild(footerBar);

    this.bindEvents();
    this.updateStack();
  }

  public updateStack(animated: boolean = true) {
    const total = this.cards.length;

    this.cards.forEach((card, idx) => {
      // Calculate cyclic forward distance from activeIndex
      // Active card is at diff = 0
      // Next cards are at diff = 1, 2, 3...
      const diff = (idx - this.activeIndex + total) % total;

      card.classList.toggle('is-front-active', diff === 0);

      // Max visible stack depth (show up to 7 cascading cards)
      if (diff > 7) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = `translate3d(${8 * this.stepX}px, ${8 * this.stepY}px, -200px) scale(0.65)`;
        return;
      }

      const tx = diff * this.stepX;
      const ty = diff * this.stepY;
      const tz = -diff * 35;
      const scale = Math.max(0.65, 1 - diff * this.scaleStep);
      const zIndex = 100 - diff;
      const opacity = diff === 0 ? 1 : Math.max(0.45, 0.95 - diff * 0.08);

      card.style.opacity = opacity.toFixed(2);
      card.style.zIndex = zIndex.toString();
      card.style.pointerEvents = 'auto';

      if (animated) {
        card.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease, box-shadow 0.3s ease, border-color 0.25s ease';
      } else {
        card.style.transition = 'none';
      }

      card.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) scale(${scale})`;
    });

    // Update counter
    const counter = this.container.querySelector('#stackCounter');
    if (counter) {
      counter.textContent = `${this.activeIndex + 1} / ${total}`;
    }
  }

  public setActiveIndex(index: number) {
    const total = this.cards.length;
    this.activeIndex = (index % total + total) % total;
    this.updateStack(true);
  }

  public next() {
    this.setActiveIndex(this.activeIndex + 1);
  }

  public prev() {
    this.setActiveIndex(this.activeIndex - 1);
  }

  private bindEvents() {
    // Nav buttons
    const prevBtn = this.container.querySelector('#btnPrevStack');
    const nextBtn = this.container.querySelector('#btnNextStack');

    prevBtn?.addEventListener('click', () => this.prev());
    nextBtn?.addEventListener('click', () => this.next());

    // Drag / Swipe support
    const stage = this.container;

    stage.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.totalDragDistance = 0;
      stage.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      this.totalDragDistance += Math.abs(deltaX);
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      stage.classList.remove('is-dragging');

      const deltaX = e.clientX - this.startX;
      if (Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });

    // Click on stacked card to bring directly to front
    stage.addEventListener('click', (e) => {
      if (this.totalDragDistance > 6) {
        e.stopPropagation();
        return;
      }

      // If clicked clone badge, allow default handler
      const cloneBadge = (e.target as HTMLElement).closest('.trending-clone-badge');
      if (cloneBadge) return;

      const card = (e.target as HTMLElement).closest('.depth-card') as HTMLElement;
      if (card && card.dataset.index) {
        const idx = parseInt(card.dataset.index, 10);
        if (idx !== this.activeIndex) {
          this.setActiveIndex(idx);
        }
      }
    });

    // Wheel navigation
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        if (delta > 0) this.next();
        else this.prev();
      }
    }, { passive: false });
  }
}
