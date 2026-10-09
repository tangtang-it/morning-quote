export interface CylindricalShowcaseOptions {
  cardWidth?: number;
  gap?: number;
  sensitivity?: number;
}

export class CylindricalShowcase {
  private container: HTMLElement;
  private cylinderEl: HTMLElement | null = null;
  private cards: HTMLElement[] = [];
  private currentAngle: number = 0;
  private isDragging: boolean = false;
  private startX: number = 0;
  private lastX: number = 0;
  private totalDragDistance: number = 0;
  private velocity: number = 0;
  private cardWidth: number = 280;
  private gap: number = 24;
  private radius: number = 420;
  private stepAngle: number = 45;
  private animFrameId: number | null = null;
  private sensitivity: number = 0.25;

  constructor(container: HTMLElement, options: CylindricalShowcaseOptions = {}) {
    this.container = container;
    this.cardWidth = options.cardWidth || 280;
    this.gap = options.gap || 24;
    this.sensitivity = options.sensitivity || 0.25;

    this.init();
  }

  private init() {
    const rawCards = Array.from(this.container.querySelectorAll<HTMLElement>('.trending-card'));
    if (rawCards.length === 0) return;

    this.cards = rawCards;
    const count = this.cards.length;

    // Calculate cylinder geometry with gap: 24px
    this.stepAngle = 360 / count;
    const chord = this.cardWidth + this.gap;
    this.radius = Math.round(chord / (2 * Math.tan(Math.PI / count)));
    if (this.radius < 380) this.radius = 380;

    // Setup stage structure with orbit indicator
    this.container.classList.add('cylindrical-stage');
    this.container.innerHTML = '';

    const stageInner = document.createElement('div');
    stageInner.className = 'cylindrical-stage-inner';

    // Circular ground orbit track
    const orbitTrack = document.createElement('div');
    orbitTrack.className = 'cylindrical-orbit-track';
    orbitTrack.style.width = `${this.radius * 2}px`;
    orbitTrack.style.height = `${this.radius * 2}px`;
    stageInner.appendChild(orbitTrack);

    const cylinder = document.createElement('div');
    cylinder.className = 'cylindrical-cylinder';
    this.cylinderEl = cylinder;

    this.cards.forEach((card, idx) => {
      card.classList.add('cylindrical-card');
      card.dataset.index = idx.toString();
      cylinder.appendChild(card);
    });

    stageInner.appendChild(cylinder);
    this.container.appendChild(stageInner);

    // Bottom interaction guide text like reference
    const guideEl = document.createElement('div');
    guideEl.className = 'cylindrical-guide-hint';
    guideEl.innerHTML = '<iconify-icon icon="lucide:arrow-left-right"></iconify-icon><span>拖动浏览 · 点击“Clone Design”应用</span>';
    this.container.appendChild(guideEl);

    this.bindEvents();
    this.updateTransform();
  }

  public updateTransform() {
    if (!this.cylinderEl) return;

    // Rotate cylinder around vertical axis
    this.cylinderEl.style.transform = `translateZ(-${this.radius}px) rotateY(${this.currentAngle}deg)`;

    this.cards.forEach((card, idx) => {
      const baseAngle = idx * this.stepAngle;
      const effectiveAngle = ((baseAngle + this.currentAngle) % 360 + 360) % 360;
      const rad = (effectiveAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad); // 1 = in front facing viewer, -1 = behind in distance

      // Calculate dramatic scale & vertical height drop (producing the reference stair/depth effect)
      // Front card: scales up (1.14), drops downward (+20px) to become the primary focal point
      // Back cards: scales down (0.72), lifts upward (-32px), creating distinct spatial layering
      let scale = 0.72;
      let translateY = -32;
      let opacity = 0.35;
      let isFront = false;

      if (cosVal > 0.7) {
        // Front hero card
        const factor = (cosVal - 0.7) / 0.3; // 0 ~ 1
        scale = 0.98 + factor * 0.16; // 0.98 ~ 1.14
        translateY = factor * 22;      // 0px ~ +22px
        opacity = 1.0;
        isFront = true;
      } else if (cosVal > 0.1) {
        // Side wing cards
        const factor = (cosVal - 0.1) / 0.6; // 0 ~ 1
        scale = 0.82 + factor * 0.16; // 0.82 ~ 0.98
        translateY = -16 + factor * 16; // -16px ~ 0px
        opacity = 0.65 + factor * 0.35;
      } else {
        // Distant back cards
        const factor = Math.max(0, (cosVal + 1) / 1.1); // 0 ~ 1
        scale = 0.70 + factor * 0.12;
        translateY = -32;
        opacity = Math.max(0.2, 0.25 + factor * 0.3);
      }

      card.style.transform = `rotateY(${baseAngle}deg) translateZ(${this.radius}px) translateY(${translateY}px) scale(${scale})`;

      if (isFront) {
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.pointerEvents = 'auto';
        card.style.zIndex = Math.round(150 + cosVal * 100).toString();
        card.classList.add('is-focal-front');
      } else {
        card.classList.remove('is-focal-front');
        card.style.opacity = opacity.toFixed(2);
        card.style.zIndex = Math.max(1, Math.round(40 + cosVal * 40)).toString();

        if (cosVal <= 0.1) {
          card.style.filter = 'blur(1.2px) brightness(0.85)';
          card.style.pointerEvents = 'none';
        } else {
          card.style.filter = 'none';
          card.style.pointerEvents = 'auto';
        }
      }
    });
  }

  public rotateToCard(index: number) {
    const targetAngle = -index * this.stepAngle;
    let diff = (targetAngle - this.currentAngle) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    this.currentAngle += diff;
    this.updateTransform();
  }

  private bindEvents() {
    const stage = this.container;

    const onPointerDown = (clientX: number) => {
      this.isDragging = true;
      this.startX = clientX;
      this.lastX = clientX;
      this.totalDragDistance = 0;
      this.velocity = 0;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      stage.classList.add('is-dragging');
    };

    const onPointerMove = (clientX: number) => {
      if (!this.isDragging) return;
      const delta = clientX - this.lastX;
      this.totalDragDistance += Math.abs(delta);
      this.velocity = delta * 0.35;
      this.currentAngle += delta * this.sensitivity;
      this.lastX = clientX;
      this.updateTransform();
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      stage.classList.remove('is-dragging');
      this.applyInertia();
    };

    stage.addEventListener('pointerdown', (e) => {
      onPointerDown(e.clientX);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        onPointerMove(e.clientX);
      }
    });

    window.addEventListener('pointerup', () => {
      onPointerUp();
    });

    window.addEventListener('pointercancel', () => {
      onPointerUp();
    });

    // Click card body to rotate to center
    stage.addEventListener('click', (e) => {
      if (this.totalDragDistance > 6) {
        e.stopPropagation();
        return;
      }

      const cloneBadge = (e.target as HTMLElement).closest('.trending-clone-badge');
      if (cloneBadge) return;

      const card = (e.target as HTMLElement).closest('.cylindrical-card') as HTMLElement;
      if (card && card.dataset.index) {
        const idx = parseInt(card.dataset.index, 10);
        this.rotateToCard(idx);
      }
    }, true);

    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      this.currentAngle -= delta * 0.08;
      this.updateTransform();
    }, { passive: false });
  }

  private applyInertia() {
    if (Math.abs(this.velocity) < 0.04) {
      this.velocity = 0;
      return;
    }

    this.currentAngle += this.velocity * this.sensitivity;
    this.velocity *= 0.90;
    this.updateTransform();

    this.animFrameId = requestAnimationFrame(() => this.applyInertia());
  }
}
