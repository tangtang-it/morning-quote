import { StylePreset } from './presets';

export interface FanDeckItem {
  preset: StylePreset;
  previewUrl: string;
}

export class FanSpreadDeck {
  private container: HTMLElement;
  private items: FanDeckItem[] = [];
  private activeIndex: number = 0;
  private cardEls: HTMLElement[] = [];
  private onSelectCallback: (preset: StylePreset) => void;
  private isDragging: boolean = false;
  private startX: number = 0;
  private currentDeltaX: number = 0;

  constructor(
    viewportEl: HTMLElement,
    presets: StylePreset[],
    onSelect: (preset: StylePreset) => void,
    initialPresetId?: string
  ) {
    this.container = viewportEl;
    this.onSelectCallback = onSelect;
    this.prepareItems(presets);

    if (initialPresetId) {
      const foundIdx = this.items.findIndex(it => it.preset.id === initialPresetId);
      if (foundIdx !== -1) {
        this.activeIndex = foundIdx;
      }
    }

    this.mount();
    this.bindEvents();
    this.updateLayout(false);
  }

  public setPresets(presets: StylePreset[], initialPresetId?: string) {
    this.prepareItems(presets);
    this.activeIndex = 0;
    if (initialPresetId) {
      const foundIdx = this.items.findIndex(it => it.preset.id === initialPresetId);
      if (foundIdx !== -1) {
        this.activeIndex = foundIdx;
      }
    }
    this.mount();
    this.updateLayout(false);
    if (this.items[this.activeIndex]) {
      this.onSelectCallback(this.items[this.activeIndex].preset);
    }
  }

  public prepareItems(presets: StylePreset[]) {
    // Curated high-aesthetic presets for the fan spread deck (dynamically loads all presets across series)
    const validPresets = presets.filter(
      p => p.bgImageUrl || p.backgroundStyle === 'god-rays' || p.backgroundStyle === 'frosted-glass' || p.backgroundStyle === 'film-grain' || p.backgroundStyle === 'sunrise-rays'
    );

    const sourceList = validPresets.length > 0 ? validPresets : presets;

    this.items = sourceList.map(p => {
      const previewUrl = p.bgImageUrl || `/backgrounds/previews/preview-${p.id}.png`;
      return { preset: p, previewUrl };
    });
  }

  private itemBgStyle(item: FanDeckItem): string {
    if (item.preset.bgImageUrl) {
      return `background-image: url('${item.preset.bgImageUrl}'); background-size: cover; background-position: center;`;
    }
    const colors = item.preset.bgColors;
    if (colors && colors.length > 1) {
      return `background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});`;
    }
    return `background: ${colors?.[0] || '#B45309'};`;
  }

  private mount() {
    this.container.innerHTML = `
      <div class="fan-deck-wrapper">
        <div class="fan-deck-hub" id="fanDeckHub"></div>
      </div>
    `;

    const hub = this.container.querySelector('#fanDeckHub') as HTMLElement;
    this.cardEls = this.items.map((item, idx) => {
      const card = document.createElement('div');
      card.className = 'fan-card' + (idx === this.activeIndex ? ' active' : '');
      card.dataset.index = idx.toString();
      card.dataset.id = item.preset.id;

      const bgStyle = this.itemBgStyle(item);
      card.innerHTML = `
        <div class="fan-card-inner" style="${bgStyle}">
          <div class="fan-card-gloss"></div>
          <div class="fan-card-meta">
            <span class="fan-card-name">${item.preset.name}</span>
          </div>
        </div>
      `;
      hub.appendChild(card);
      return card;
    });
  }

  public updateLayout(animated: boolean = true) {
    const angleStep = 6.8; // degrees per card step
    const xStep = 36;      // px horizontal fan spread step
    const yStep = 3.5;     // px gentle vertical curve (prevents bottom clipping)

    this.cardEls.forEach((card, idx) => {
      const diff = idx - this.activeIndex;
      const absDiff = Math.abs(diff);

      card.classList.toggle('active', diff === 0);

      // Performance: hide cards that are too far from center view
      if (absDiff > 6) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = 'scale(0.5) translate3d(0, 100px, 0)';
        return;
      }

      const rotate = diff * angleStep;
      const tx = diff * xStep;
      const ty = absDiff * yStep;
      const scale = diff === 0 ? 1.08 : Math.max(0.78, 1 - absDiff * 0.05);
      const zIndex = 50 - absDiff;

      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.zIndex = zIndex.toString();
      card.style.transition = animated
        ? 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, filter 0.2s ease, border-color 0.2s ease'
        : 'none';
      card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg) scale(${scale})`;
    });
  }

  public setActiveIndex(index: number, emitCallback: boolean = true) {
    if (index < 0 || index >= this.items.length) return;
    this.activeIndex = index;
    this.updateLayout(true);

    if (emitCallback && this.items[index]) {
      this.onSelectCallback(this.items[index].preset);
    }
  }

  public setActiveById(id: string) {
    const idx = this.items.findIndex(it => it.preset.id === id);
    if (idx !== -1) {
      this.setActiveIndex(idx, false);
    }
  }

  public shuffleRandom(): StylePreset {
    const hub = this.container.querySelector('#fanDeckHub') as HTMLElement;
    if (hub) {
      hub.classList.add('shuffling');
      setTimeout(() => hub.classList.remove('shuffling'), 350);
    }

    let nextIdx = Math.floor(Math.random() * this.items.length);
    if (nextIdx === this.activeIndex && this.items.length > 1) {
      nextIdx = (nextIdx + 1) % this.items.length;
    }

    this.setActiveIndex(nextIdx, true);
    return this.items[nextIdx].preset;
  }

  public getActivePreset(): StylePreset {
    return this.items[this.activeIndex].preset;
  }

  private bindEvents() {
    this.container.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.fan-card') as HTMLElement;
      if (!target) return;
      const idx = parseInt(target.dataset.index || '0', 10);
      if (idx !== this.activeIndex) {
        this.setActiveIndex(idx, true);
      }
    });

    const onStart = (clientX: number) => {
      this.isDragging = true;
      this.startX = clientX;
      this.currentDeltaX = 0;
    };

    const onMove = (clientX: number) => {
      if (!this.isDragging) return;
      this.currentDeltaX = clientX - this.startX;
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const threshold = 32;
      if (this.currentDeltaX < -threshold) {
        this.setActiveIndex(Math.min(this.items.length - 1, this.activeIndex + 1), true);
      } else if (this.currentDeltaX > threshold) {
        this.setActiveIndex(Math.max(0, this.activeIndex - 1), true);
      }
      this.currentDeltaX = 0;
    };

    this.container.addEventListener('pointerdown', (e) => {
      onStart(e.clientX);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        onMove(e.clientX);
      }
    });

    window.addEventListener('pointerup', () => {
      onEnd();
    });

    window.addEventListener('pointercancel', () => {
      onEnd();
    });

    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaX) > 15 || Math.abs(e.deltaY) > 15) {
        if (e.deltaX > 0 || e.deltaY > 0) {
          this.setActiveIndex(Math.min(this.items.length - 1, this.activeIndex + 1), true);
        } else {
          this.setActiveIndex(Math.max(0, this.activeIndex - 1), true);
        }
      }
    }, { passive: false });
  }
}
