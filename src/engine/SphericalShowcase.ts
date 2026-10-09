export interface SphericalShowcaseOptions {
  radius?: number;
  sensitivity?: number;
}

interface SphereCardMeta {
  el: HTMLElement;
  theta: number; // Longitude angle in degrees
  phi: number;   // Latitude angle in degrees
  baseTransform: string;
}

export class SphericalShowcase {
  private container: HTMLElement;
  private globeEl: HTMLElement | null = null;
  private cardMetas: SphereCardMeta[] = [];
  private focusedCard: HTMLElement | null = null;
  private currentYaw: number = 0;    // Horizontal rotation (Y-axis)
  private currentPitch: number = -6; // Vertical tilt (X-axis)
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;
  private totalDragDistance: number = 0;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private radius: number = 380;
  private sensitivity: number = 0.28;
  private animFrameId: number | null = null;

  constructor(container: HTMLElement, options: SphericalShowcaseOptions = {}) {
    this.container = container;
    this.radius = options.radius || 380;
    this.sensitivity = options.sensitivity || 0.28;

    this.init();
  }

  private init() {
    const rawCards = Array.from(this.container.querySelectorAll<HTMLElement>('.trending-card'));
    if (rawCards.length === 0) return;

    const count = rawCards.length;
    const goldenAngle = 137.507764; // degrees

    // Distribute cards uniformly across the sphere surface using Fibonacci Sphere
    this.cardMetas = rawCards.map((card, i) => {
      // Normalizing vertical range so cards stay in beautiful visible latitude
      const y = (1 - (2 * (i + 0.5)) / count) * 0.82;
      const phiRad = Math.asin(y);
      const phiDeg = (phiRad * 180) / Math.PI;
      const thetaDeg = (i * goldenAngle) % 360;

      card.classList.add('spherical-card');
      card.dataset.index = i.toString();

      // Ensure each card has a close button for focus mode
      if (!card.querySelector('.btn-close-focus')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close-focus';
        closeBtn.type = 'button';
        closeBtn.title = '关闭并归位';
        closeBtn.innerHTML = '✕';
        card.appendChild(closeBtn);
      }

      const baseTransform = `rotateY(${thetaDeg}deg) rotateX(${-phiDeg}deg) translateZ(${this.radius}px)`;
      card.style.transform = baseTransform;

      return {
        el: card,
        theta: thetaDeg,
        phi: phiDeg,
        baseTransform
      };
    });

    // Setup 3D Spherical Stage
    this.container.classList.add('spherical-stage');
    this.container.innerHTML = '';

    const stageInner = document.createElement('div');
    stageInner.className = 'spherical-stage-inner';

    const globe = document.createElement('div');
    globe.className = 'spherical-globe';
    this.globeEl = globe;

    this.cardMetas.forEach(meta => {
      globe.appendChild(meta.el);
    });

    stageInner.appendChild(globe);
    this.container.appendChild(stageInner);

    // Backdrop for focused card (clicking backdrop closes and returns card)
    const backdrop = document.createElement('div');
    backdrop.className = 'spherical-backdrop';
    backdrop.addEventListener('click', () => this.closeFocus());
    this.container.appendChild(backdrop);

    // Bottom interaction guide hint matching requirement
    const guideEl = document.createElement('div');
    guideEl.className = 'spherical-guide-hint';
    guideEl.innerHTML = '<iconify-icon icon="lucide:globe"></iconify-icon><span>拖动自由旋转内容星球 · 点击卡片单独移至前方查看 · 关闭后归位（球体保留在后方）</span>';
    this.container.appendChild(guideEl);

    this.bindEvents();
    this.updateTransform();
  }

  public updateTransform() {
    if (!this.globeEl) return;

    // Rotate globe around Y (Yaw) and X (Pitch)
    this.globeEl.style.transform = `translateZ(-${this.radius}px) rotateX(${this.currentPitch}deg) rotateY(${this.currentYaw}deg)`;

    const pitchRad = (this.currentPitch * Math.PI) / 180;
    const yawRad = (this.currentYaw * Math.PI) / 180;

    this.cardMetas.forEach((meta) => {
      // If this card is currently focused in front, let focus styles control its position
      if (meta.el === this.focusedCard) return;

      // Reset base position on sphere
      meta.el.style.transform = meta.baseTransform;

      // Compute facing depth towards camera
      const tRad = (meta.theta * Math.PI) / 180;
      const pRad = (meta.phi * Math.PI) / 180;

      // Unit normal on sphere:
      const nx = Math.cos(pRad) * Math.sin(tRad);
      const ny = -Math.sin(pRad);
      const nz = Math.cos(pRad) * Math.cos(tRad);

      // Rotate normal by current Yaw & Pitch
      const cosY = Math.cos(yawRad);
      const sinY = Math.sin(yawRad);
      const x1 = nx * cosY + nz * sinY;
      const y1 = ny;
      const z1 = -nx * sinY + nz * cosY;

      const cosX = Math.cos(pitchRad);
      const sinX = Math.sin(pitchRad);
      const z2 = y1 * sinX + z1 * cosX; // dot product with camera direction

      const cosVal = z2;

      // Depth culling & scale gradient on the sphere
      if (cosVal > 0.35) {
        // Front hemisphere - fully visible & interactive
        const factor = (cosVal - 0.35) / 0.65;
        const scale = 0.94 + factor * 0.16;
        meta.el.style.opacity = '1.0';
        meta.el.style.filter = 'none';
        meta.el.style.pointerEvents = 'auto';
        meta.el.style.zIndex = Math.round(100 + cosVal * 100).toString();
        meta.el.style.transform = `${meta.baseTransform} scale(${scale.toFixed(3)})`;
      } else if (cosVal > -0.05) {
        // Horizon curve of the sphere
        const factor = (cosVal + 0.05) / 0.4;
        const scale = 0.82 + factor * 0.12;
        meta.el.style.opacity = (0.55 + factor * 0.45).toFixed(2);
        meta.el.style.filter = 'none';
        meta.el.style.pointerEvents = 'auto';
        meta.el.style.zIndex = Math.round(40 + cosVal * 40).toString();
        meta.el.style.transform = `${meta.baseTransform} scale(${scale.toFixed(3)})`;
      } else {
        // Far back of the sphere (naturally occluded)
        meta.el.style.opacity = '0';
        meta.el.style.filter = 'none';
        meta.el.style.pointerEvents = 'none';
        meta.el.style.zIndex = '1';
      }
    });
  }

  /**
   * Focus a single card: brings it forward in front of the viewer,
   * while keeping the entire sphere intact in the background.
   */
  public focusCard(card: HTMLElement) {
    if (this.focusedCard === card) {
      this.closeFocus();
      return;
    }

    if (this.focusedCard) {
      this.closeFocus();
    }

    this.focusedCard = card;
    this.container.classList.add('has-focused-card');
    card.classList.add('is-focused-front');

    // Smoothly animate card forward along the screen normal
    // Counteract the globe's current rotation so the card faces directly front to user!
    // The globe is rotated by rotateX(pitch) rotateY(yaw).
    // To face user, the card in globe coordinates must counter-rotate:
    const invYaw = -this.currentYaw;
    const invPitch = -this.currentPitch;

    // Bring card forward to center front z = +260px
    card.style.transform = `rotateY(${invYaw}deg) rotateX(${invPitch}deg) translateZ(${this.radius + 180}px) scale(1.18)`;
    card.style.zIndex = '9999';
    card.style.opacity = '1';
    card.style.filter = 'none';
    card.style.pointerEvents = 'auto';
  }

  public closeFocus() {
    if (!this.focusedCard) return;

    const card = this.focusedCard;
    this.focusedCard = null;
    this.container.classList.remove('has-focused-card');
    card.classList.remove('is-focused-front');

    // Return card smoothly back to its base spherical coordinates
    const meta = this.cardMetas.find(m => m.el === card);
    if (meta) {
      card.style.transform = meta.baseTransform;
    }

    // Re-evaluate transform after transition
    setTimeout(() => {
      this.updateTransform();
    }, 320);
  }

  private bindEvents() {
    const stage = this.container;

    const onPointerDown = (clientX: number, clientY: number) => {
      if (this.focusedCard) return; // Freeze dragging while inspecting a single card
      this.isDragging = true;
      this.startX = clientX;
      this.startY = clientY;
      this.lastX = clientX;
      this.lastY = clientY;
      this.totalDragDistance = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      stage.classList.add('is-dragging');
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!this.isDragging || this.focusedCard) return;
      const deltaX = clientX - this.lastX;
      const deltaY = clientY - this.lastY;

      this.totalDragDistance += Math.abs(deltaX) + Math.abs(deltaY);
      this.velocityX = deltaX * 0.35;
      this.velocityY = deltaY * 0.25;

      this.currentYaw += deltaX * this.sensitivity;
      this.currentPitch -= deltaY * (this.sensitivity * 0.7);

      // Clamp pitch between -45deg and 45deg
      this.currentPitch = Math.max(-45, Math.min(45, this.currentPitch));

      this.lastX = clientX;
      this.lastY = clientY;
      this.updateTransform();
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      stage.classList.remove('is-dragging');
      this.applyInertia();
    };

    stage.addEventListener('pointerdown', (e) => {
      onPointerDown(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        onPointerMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('pointerup', () => {
      onPointerUp();
    });

    window.addEventListener('pointercancel', () => {
      onPointerUp();
    });

    // Card click events: focus forward or clone or close
    stage.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Close button on focused card
      if (target.closest('.btn-close-focus')) {
        e.stopPropagation();
        this.closeFocus();
        return;
      }

      // If dragging, ignore click
      if (this.totalDragDistance > 6) {
        e.stopPropagation();
        return;
      }

      // Clone badge button: allow default clone handler and close focus
      const cloneBadge = target.closest('.trending-clone-badge');
      if (cloneBadge) {
        setTimeout(() => this.closeFocus(), 150);
        return;
      }

      // Click card itself -> move individually forward in front of viewer!
      const card = target.closest('.spherical-card') as HTMLElement;
      if (card) {
        this.focusCard(card);
      }
    });

    // Escape key closes focused card
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.focusedCard) {
        this.closeFocus();
      }
    });

    // Mouse wheel horizontal spin
    stage.addEventListener('wheel', (e) => {
      if (this.focusedCard) return;
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      this.currentYaw -= delta * 0.08;
      this.updateTransform();
    }, { passive: false });
  }

  private applyInertia() {
    if (Math.abs(this.velocityX) < 0.04 && Math.abs(this.velocityY) < 0.04) {
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }

    this.currentYaw += this.velocityX * this.sensitivity;
    this.currentPitch -= this.velocityY * (this.sensitivity * 0.5);
    this.currentPitch = Math.max(-45, Math.min(45, this.currentPitch));

    this.velocityX *= 0.90;
    this.velocityY *= 0.90;
    this.updateTransform();

    this.animFrameId = requestAnimationFrame(() => this.applyInertia());
  }
}
