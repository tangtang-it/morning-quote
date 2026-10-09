import { AspectRatio, ASPECT_RATIOS, StylePreset, BackgroundEffect, BackgroundStyle, BadgeOption } from './presets';
export type TextPlacement = 'top' | 'center';
export type TextMood = 'serif' | 'handwriting' | 'modern';
export type TextColorMode = 'auto' | 'dark' | 'light';

export interface RenderCardOptions {
  recipientName?: string;
  quoteText: string;
  authorText?: string;
  preset: StylePreset;
  aspectRatio: AspectRatio;
  showWatermark?: boolean;
  backgroundEffect?: BackgroundEffect;
  badgeOption?: BadgeOption;
  textPlacement?: TextPlacement;
  textMood?: TextMood;
  textColorMode?: TextColorMode;
  textBackplate?: boolean;
}
export class CardRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private lastRenderOptions: RenderCardOptions | null = null;
  private renderVersion: number = 0;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    if (!context) {
      throw new Error('Canvas 2D context is not available');
    }
    this.ctx = context;
  }
  public preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(url)) {
      const cached = this.imageCache.get(url)!;
      if (cached.complete && cached.naturalWidth > 0) {
        return Promise.resolve(cached);
      }
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }
  public render(options: RenderCardOptions): void {
    console.log('[DEBUG RENDER START]', options.preset.name, 'quote len:', options.quoteText?.length, 'isPhoto:', options.preset.bgImageUrl);
    this.lastRenderOptions = options;
    const currentVersion = ++this.renderVersion;
    const { width, height } = ASPECT_RATIOS[options.aspectRatio];
    
    // Set internal resolution for crisp high-definition export
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    const ctx = this.ctx;
    const { preset, recipientName, quoteText, authorText, showWatermark = true, backgroundEffect = 'auto' } = options;
    ctx.save();
    // 1. Draw Multi-Mode Advanced Background (Photo or Procedural Gradient)
    const effectiveStyle: BackgroundStyle = (backgroundEffect && backgroundEffect !== 'auto')
      ? (backgroundEffect as BackgroundStyle)
      : preset.backgroundStyle;
    const isPhoto = Boolean(preset.bgImageUrl && (effectiveStyle === 'photo-scenic' || effectiveStyle === 'frosted-glass' || effectiveStyle === 'film-grain'));
    if (isPhoto) {
      const img = this.imageCache.get(preset.bgImageUrl!);
      if (img && img.complete && img.naturalWidth > 0) {
        console.log('[DEBUG FROM DIRECT CACHE]'); this.renderPhotoBackground(width, height, img, preset);
      } else {
        // Fallback: draw base gradient while image loads
        this.renderBaseGradient(width, height, preset);
        this.renderSoftAmbientLayer(width, height, preset);
        // Preload and trigger COMPLETE card re-render (never background alone!)
        this.preloadImage(preset.bgImageUrl!).then(() => {
          if (this.renderVersion === currentVersion && this.lastRenderOptions) {
            this.render(this.lastRenderOptions);
          }
        }).catch(() => {
          // Image load failed, keep base gradient
        });
      }
    } else {
      this.drawNonPhotoBackground(width, height, preset, effectiveStyle, options.aspectRatio);
    }
    // 2. Draw Decorative Border if enabled
    if (preset.hasBorder && effectiveStyle !== 'minimal-frame') {
      this.drawDecorativeBorder(width, height, preset.borderColor || 'rgba(255, 255, 255, 0.3)');
    }
    // 3. Dynamic Text Positioning based on textPlacement (top vs center)
    const placement = options.textPlacement || 'top';
    const isTop = placement === 'top';
    const headerY = options.aspectRatio === '9:16' ? (isTop ? 180 : 230) : (isTop ? 130 : 160);
    this.drawHeaderBadge(width / 2, headerY, preset, options.badgeOption, isPhoto);

    // 4. Draw Recipient (To: [Name]) if present
    let recipientOffset = 0;
    if (recipientName && recipientName.trim().length > 0) {
      recipientOffset = 70;
      this.drawRecipient(width / 2, headerY + 75, recipientName.trim(), preset, isPhoto);
    }

    // 5. Calculate & Draw Quote Text (with Golden Upper Negative Space)
    const quoteStartY = options.aspectRatio === '9:16'
      ? (isTop ? height * 0.31 : height * 0.44) + (recipientName ? 30 : 0)
      : (isTop ? height * 0.35 : height * 0.46) + (recipientName ? 25 : 0);

    const quoteEndY = this.drawQuoteContent(
      width,
      height,
      quoteStartY,
      quoteText,
      preset,
      options.aspectRatio,
      isPhoto,
      options.textMood,
      options.textColorMode,
      options.textBackplate
    );

    // 6. Draw Author / Sign-off
    if (authorText && authorText.trim().length > 0) {
      this.drawAuthor(width / 2, quoteEndY + 45, authorText.trim(), preset, isPhoto, options.textColorMode);
    }
    // 7. Draw Footer / Subtle Watermark
    if (showWatermark) {
      const footerY = height - (options.aspectRatio === '9:16' ? 140 : 90);
      this.drawFooter(width / 2, footerY, preset, isPhoto);
    }
    ctx.restore();
  }
  /**
   * Render Non-Photo Background Styles
   */
  private drawNonPhotoBackground(
    width: number,
    height: number,
    preset: StylePreset,
    style: BackgroundStyle,
    aspectRatio: AspectRatio
  ): void {
    const ctx = this.ctx;
    // Base Linear Gradient
    this.renderBaseGradient(width, height, preset);
    // Specific Style Layer
    switch (style) {
      case 'sunrise-rays':
        this.renderSunriseRaysLayer(width, height, preset, aspectRatio);
        break;
      case 'mesh-aurora':
        this.renderMeshAuroraLayer(width, height, preset);
        break;
      case 'abstract-waves':
        this.renderAbstractWavesLayer(width, height, preset);
        break;
      case 'paper-texture':
        this.renderPaperTextureLayer(width, height, preset);
        break;
      case 'minimal-frame':
        this.renderMinimalFrameLayer(width, height, preset);
        break;
      case 'god-rays':
        this.renderGodRaysLayer(width, height, preset);
        break;
      case 'torn-paper':
        this.renderTornPaperLayer(width, height, preset);
        break;
      case 'soft-gradient':
      default:
        this.renderSoftAmbientLayer(width, height, preset);
        break;
    }
    // Center Readability Mask
    const centerGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      100,
      width * 0.5,
      height * 0.48,
      width * 0.65
    );
    const isDark = this.isDarkText(preset.textColor);
    if (!isDark) {
      centerGlow.addColorStop(0, 'rgba(0, 0, 0, 0.08)');
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
    } else {
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    }
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);
  }
  private isDarkText(color: string): boolean {
    if (!color) return false;
    const c = color.trim().toUpperCase();
    if (['#111827', '#1C1917', '#1A1A1A', '#292524', '#4C0519', '#3A1C28', '#2C1A11', '#382214', '#1B3B2B', '#29180D'].includes(c)) {
      return true;
    }
    if (c.startsWith('#') && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
    }
    return false;
  }
  private renderBaseGradient(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    const rad = (preset.gradientAngle * Math.PI) / 180;
    const x1 = width / 2 - (Math.cos(rad) * width) / 2;
    const y1 = height / 2 - (Math.sin(rad) * height) / 2;
    const x2 = width / 2 + (Math.cos(rad) * width) / 2;
    const y2 = height / 2 + (Math.sin(rad) * height) / 2;
    const baseGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    const colors = preset.bgColors;
    colors.forEach((col, idx) => {
      baseGrad.addColorStop(idx / Math.max(colors.length - 1, 1), col);
    });
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);
  }
  /**
   * Render High-Resolution Photography Background with Contrast Overlay
   */
  private renderPhotoBackground(width: number, height: number, img: HTMLImageElement, preset: StylePreset): void {
    console.log('[DEBUG ENTER RENDER PHOTO BG]', 'img complete:', img.complete, 'naturalWidth:', img.naturalWidth);
    const ctx = this.ctx;
    ctx.save();
    // Aspect-fit cover calculation
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    let renderW: number, renderH: number, offsetX: number, offsetY: number;
    if (imgRatio > canvasRatio) {
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    } else {
      renderW = width;
      renderH = width / imgRatio;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    }
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    const isDark = this.isDarkText(preset.textColor);
    const opacity = preset.overlayOpacity !== undefined ? preset.overlayOpacity : (isDark ? 0 : 0.35);
    if (opacity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fillRect(0, 0, width, height);
    }
    if (!isDark && opacity > 0.15) {
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        width * 0.2,
        width * 0.5,
        height * 0.48,
        width * 0.72
      );
      vig.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      vig.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }
  /**
   * 1. Sunrise & Radiant Sunburst Effect
   */
  private renderSunriseRaysLayer(width: number, height: number, preset: StylePreset, aspectRatio: AspectRatio): void {
    const ctx = this.ctx;
    ctx.save();
    const sunX = width * 0.5;
    const sunY = aspectRatio === '9:16' ? height * 0.68 : height * 0.62;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, width * 0.65);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    sunGlow.addColorStop(0.2, 'rgba(254, 240, 138, 0.35)');
    sunGlow.addColorStop(0.55, 'rgba(245, 158, 11, 0.18)');
    sunGlow.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, width * 0.65, 0, Math.PI * 2);
    ctx.fill();
    // Radiant Sunburst Rays
    ctx.save();
    ctx.translate(sunX, sunY);
    const rayCount = 18;
    const rayLength = width * 0.95;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * Math.PI) / (rayCount - 1) - Math.PI;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const spread = 0.06;
      ctx.lineTo(Math.cos(angle - spread) * rayLength, Math.sin(angle - spread) * rayLength);
      ctx.lineTo(Math.cos(angle + spread) * rayLength, Math.sin(angle + spread) * rayLength);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
      ctx.fill();
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(sunX, sunY + 60, width * 0.55, Math.PI, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }
  /**
   * 2. Mesh Aurora Multi-Orb Diffusion
   */
  private renderMeshAuroraLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: width * 0.5, color: preset.accentColor || '#A7F3D0', alpha: 0.32 },
      { x: width * 0.8, y: height * 0.35, r: width * 0.55, color: preset.bgColors[2] || '#EC4899', alpha: 0.28 },
      { x: width * 0.35, y: height * 0.75, r: width * 0.6, color: preset.bgColors[1] || '#06B6D4', alpha: 0.35 },
      { x: width * 0.85, y: height * 0.8, r: width * 0.5, color: '#FDE047', alpha: 0.22 }
    ];
    orbs.forEach((orb) => {
      const g = ctx.createRadialGradient(orb.x, orb.y, 20, orb.x, orb.y, orb.r);
      g.addColorStop(0, orb.color);
      g.addColorStop(0.5, orb.color);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.globalAlpha = orb.alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
  /**
   * 3. Abstract Zen Waves & Morning Mountain Contours
   */
  private renderAbstractWavesLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height * 0.62);
    ctx.bezierCurveTo(width * 0.28, height * 0.52, width * 0.65, height * 0.72, width, height * 0.58);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, height * 0.73);
    ctx.bezierCurveTo(width * 0.35, height * 0.82, width * 0.72, height * 0.64, width, height * 0.75);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, height * 0.84);
    ctx.bezierCurveTo(width * 0.25, height * 0.78, width * 0.62, height * 0.90, width, height * 0.82);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fill();
    ctx.restore();
  }
  /**
   * 4. Artisan Paper Texture with Delicate Procedural Noise
   */
  private renderPaperTextureLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.35,
      width * 0.5,
      height * 0.5,
      width * 0.72
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    const grainStep = 8;
    for (let x = 0; x < width; x += grainStep) {
      for (let y = 0; y < height; y += grainStep) {
        const pseudo = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const val = pseudo - Math.floor(pseudo);
        if (val > 0.68) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    ctx.restore();
  }
  /**
   * 5. Minimalist Frame & Modern Editorial Geometry
   */
  private renderMinimalFrameLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    const padding = 54;
    const innerPadding = 74;
    const strokeColor = preset.borderColor || 'rgba(0, 0, 0, 0.25)';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
    ctx.lineWidth = 2;
    ctx.strokeRect(innerPadding, innerPadding, width - innerPadding * 2, height - innerPadding * 2);
    ctx.font = '22px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = preset.accentColor;
    const cornerOffset = innerPadding + 14;
    ctx.fillText('✦', cornerOffset, cornerOffset);
    ctx.fillText('✦', width - cornerOffset, cornerOffset);
    ctx.fillText('✦', cornerOffset, height - cornerOffset);
    ctx.fillText('✦', width - cornerOffset, height - cornerOffset);
    ctx.restore();
  }
  /**
   * 6. Soft Ambient Gradient
   */
  /**
   * Morning Tyndall Sunbeams (God Rays) with Ambient Dust Particles
   */
  private renderGodRaysLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    // Source of dawn light rays from top-left (or top-center)
    const lightSourceX = width * 0.15;
    const lightSourceY = -height * 0.1;
    // Multiple radiant fan beams with soft screen blending
    const beamCount = 9;
    const maxSpread = width * 1.5;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < beamCount; i++) {
      const angle = (Math.PI / 4) + (i - beamCount / 2) * 0.085;
      const beamGrad = ctx.createRadialGradient(
        lightSourceX, lightSourceY, 50,
        lightSourceX + Math.cos(angle) * height * 1.2,
        lightSourceY + Math.sin(angle) * height * 1.2,
        height * 1.4
      );
      const alpha = 0.12 + (i % 2 === 0 ? 0.08 : 0.03);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, ' + (alpha * 1.5) + ')');
      beamGrad.addColorStop(0.35, 'rgba(253, 224, 71, ' + alpha + ')');
      beamGrad.addColorStop(0.8, 'rgba(251, 191, 36, 0.02)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(lightSourceX, lightSourceY);
      ctx.lineTo(
        lightSourceX + Math.cos(angle - 0.065) * height * 1.6,
        lightSourceY + Math.sin(angle - 0.065) * height * 1.6
      );
      ctx.lineTo(
        lightSourceX + Math.cos(angle + 0.065) * height * 1.6,
        lightSourceY + Math.sin(angle + 0.065) * height * 1.6
      );
      ctx.closePath();
      ctx.fill();
    }
    // Add delicate ambient dust motes catching the morning light
    const motesCount = 45;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let j = 0; j < motesCount; j++) {
      const rx = (Math.sin(j * 997.3) * 0.5 + 0.5) * width;
      const ry = (Math.cos(j * 643.1) * 0.5 + 0.5) * height;
      const rRadius = 1.2 + (j % 4) * 0.8;
      const rAlpha = 0.2 + (j % 5) * 0.12;
      ctx.globalAlpha = rAlpha;
      ctx.beginPath();
      ctx.arc(rx, ry, rRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.restore();
  }
  /**
   * Vintage Morning Journal Note with Torn Ripped Edges & Postmark
   */
  private renderTornPaperLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    ctx.save();
    const marginX = width * 0.07;
    const marginY = height * 0.06;
    const paperW = width - marginX * 2;
    const paperH = height - marginY * 2;
    // 1. Soft Paper Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(41, 37, 36, 0.35)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 12;
    // 2. Draw Paper Base with Torn Ripped Edge at bottom
    ctx.fillStyle = '#FFFDF9';
    ctx.beginPath();
    ctx.moveTo(marginX, marginY + 24);
    ctx.arcTo(marginX, marginY, marginX + 24, marginY, 24);
    ctx.lineTo(marginX + paperW - 24, marginY);
    ctx.arcTo(marginX + paperW, marginY, marginX + paperW, marginY + 24, 24);
    ctx.lineTo(marginX + paperW, marginY + paperH - 24);
    // Natural torn bottom edge simulation with jagged teeth
    const steps = 36;
    const stepW = paperW / steps;
    for (let i = steps; i >= 0; i--) {
      const currentX = marginX + i * stepW;
      const jag = (Math.sin(i * 3.7) * 7) + (Math.cos(i * 7.1) * 4);
      ctx.lineTo(currentX, marginY + paperH + jag);
    }
    ctx.lineTo(marginX, marginY + 24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // 3. Delicate Paper Grain & Ruled Margin Line
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginX + 48, marginY + 30);
    ctx.lineTo(marginX + 48, marginY + paperH - 20);
    ctx.stroke();
    // 4. Subtle Morning Sunrise Postmark Stamp (Top-Right)
    const stampX = marginX + paperW - 90;
    const stampY = marginY + 80;
    const stampR = 48;
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.38)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(stampX, stampY, stampR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(stampX, stampY, stampR - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(180, 83, 9, 0.42)';
    ctx.font = '700 12px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('SUNRISE POST', stampX, stampY - 8);
    ctx.font = '600 11px "Inter", -apple-system, sans-serif';
    ctx.fillText('06:30 AM', stampX, stampY + 8);
    ctx.restore();
    ctx.restore();
  }
  private renderSoftAmbientLayer(width: number, height: number, preset: StylePreset): void {
    const ctx = this.ctx;
    const ambient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      width * 0.1,
      width * 0.5,
      height * 0.45,
      width * 0.7
    );
    ambient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    ambient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, width, height);
  }
  private drawDecorativeBorder(width: number, height: number, color: string): void {
    const ctx = this.ctx;
    const padding = 60;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
    const notchSize = 16;
    ctx.lineWidth = 1;
    ctx.strokeRect(padding + 8, padding + 8, notchSize, notchSize);
    ctx.strokeRect(width - padding - 8 - notchSize, padding + 8, notchSize, notchSize);
    ctx.strokeRect(padding + 8, height - padding - 8 - notchSize, notchSize, notchSize);
    ctx.strokeRect(width - padding - 8 - notchSize, height - padding - 8 - notchSize, notchSize, notchSize);
  }
  private drawHeaderBadge(x: number, y: number, preset: StylePreset, badgeOption?: BadgeOption, isPhoto = false): void {
    const ctx = this.ctx;
    ctx.save();
    const displayBadgeText = (badgeOption && badgeOption.id !== 'default' && badgeOption.badgeText) 
      ? badgeOption.badgeText.toUpperCase() 
      : preset.badgeText.toUpperCase();
    const iconUrl = badgeOption?.iconUrl;
    const cachedIcon = iconUrl ? this.imageCache.get(iconUrl) : undefined;
    const hasIcon = Boolean(cachedIcon && cachedIcon.complete && cachedIcon.naturalWidth > 0);
    ctx.font = '600 24px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = preset.accentColor;
    if (isPhoto) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
    }
    const textWidth = ctx.measureText(displayBadgeText).width;
    const iconSize = 42;
    const iconGap = 14;
    if (hasIcon && cachedIcon) {
      const totalWidth = iconSize + iconGap + textWidth;
      const startX = x - totalWidth / 2;
      const iconX = startX;
      const iconY = y - iconSize / 2;
      // Draw circular clipped Agnes icon
      ctx.save();
      ctx.beginPath();
      ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(cachedIcon, iconX, iconY, iconSize, iconSize);
      ctx.restore();
      // Delicate halo border ring
      ctx.strokeStyle = preset.accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 + 1, 0, Math.PI * 2);
      ctx.stroke();
      // Render Badge Typography
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 1.0;
      ctx.fillText(displayBadgeText, iconX + iconSize + iconGap, y);
      // Symmetrical decorative side lines
      ctx.strokeStyle = preset.accentColor;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX - 36, y);
      ctx.lineTo(startX - 12, y);
      ctx.moveTo(startX + totalWidth + 12, y);
      ctx.lineTo(startX + totalWidth + 36, y);
      ctx.stroke();
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayBadgeText, x, y);
      ctx.strokeStyle = preset.accentColor;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - textWidth / 2 - 40, y);
      ctx.lineTo(x - textWidth / 2 - 12, y);
      ctx.moveTo(x + textWidth / 2 + 12, y);
      ctx.lineTo(x + textWidth / 2 + 40, y);
      ctx.stroke();
    }
    ctx.restore();
  }
  private drawRecipient(x: number, y: number, name: string, preset: StylePreset, isPhoto = false): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 32px "Playfair Display", Georgia, serif';
    ctx.fontStyle = 'italic';
    ctx.fillStyle = preset.textColor;
    ctx.globalAlpha = 0.95;
    if (isPhoto) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(`To: ${name}`, x, y);
    ctx.restore();
  }
  private drawQuoteContent(
    width: number,
    height: number,
    centerY: number,
    text: string,
    preset: StylePreset,
    aspectRatio: AspectRatio,
    isPhoto = false,
    textMood: TextMood = 'serif',
    textColorMode: TextColorMode = 'auto',
    textBackplate = false
  ): number {
    const ctx = this.ctx;
    ctx.save();
    const maxLineWidth = width * (aspectRatio === '9:16' ? 0.78 : 0.82);
    
    const len = text.length;
    let baseFontSize = 58;
    if (len < 60) baseFontSize = 66;
    else if (len < 120) baseFontSize = 52;
    else if (len < 180) baseFontSize = 44;
    else baseFontSize = 38;
    if (aspectRatio === '9:16') {
      baseFontSize += 2;
    }

    // Font Family resolution based on mood
    let fontFamily = preset.fontFamily;
    let fontStyle = preset.fontStyle || 'normal';
    if (textMood === 'handwriting') {
      fontFamily = '"Caveat", "Segoe Script", cursive';
      fontStyle = 'normal';
      baseFontSize = Math.round(baseFontSize * 1.18); // Caveat naturally looks better slightly larger
    } else if (textMood === 'modern') {
      fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      fontStyle = 'normal';
    } else {
      fontFamily = '"Playfair Display", Georgia, serif';
    }

    ctx.font = `${fontStyle} ${baseFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Color resolution based on textColorMode
    let finalTextColor = preset.textColor;
    if (textColorMode === 'dark') {
      finalTextColor = '#2C1A11';
    } else if (textColorMode === 'light') {
      finalTextColor = '#FFFFFF';
    }
    ctx.fillStyle = finalTextColor;

    const isDarkText = this.isDarkText(finalTextColor);
    if (isPhoto) {
      if (isDarkText) {
        // Soft subtle golden-white backlight glow instead of dirty black shadow
        ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
      }
    }

    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    let maxLineWidthMeasured = 0;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxLineWidth && currentLine) {
        lines.push(currentLine);
        maxLineWidthMeasured = Math.max(maxLineWidthMeasured, ctx.measureText(currentLine).width);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
      maxLineWidthMeasured = Math.max(maxLineWidthMeasured, ctx.measureText(currentLine).width);
    }

    const lineHeight = baseFontSize * (textMood === 'handwriting' ? 1.42 : 1.48);
    const totalBlockHeight = lines.length * lineHeight;
    const startY = centerY - totalBlockHeight / 2;

    // Frosted Backplate (Optional Frosted Pill Pad)
    if (textBackplate) {
      ctx.save();
      const padX = 46;
      const padY = 32;
      const plateW = Math.min(width * 0.88, maxLineWidthMeasured + padX * 2);
      const plateH = totalBlockHeight + padY * 2;
      const plateX = (width - plateW) / 2;
      const plateY = startY - padY / 2 - 10;
      
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(plateX, plateY, plateW, plateH, 24);
      } else {
        ctx.rect(plateX, plateY, plateW, plateH);
      }
      
      if (isDarkText) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(120, 53, 15, 0.08)';
        ctx.shadowBlur = 18;
      } else {
        ctx.fillStyle = 'rgba(26, 18, 14, 0.55)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 18;
      }
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Quote mark decoration
    if (!textBackplate) {
      ctx.save();
      ctx.font = `italic 72px "Playfair Display", Georgia, serif`;
      ctx.fillStyle = preset.accentColor;
      ctx.globalAlpha = 0.5;
      ctx.fillText('“', width / 2, startY - 38);
      ctx.restore();
    }

    lines.forEach((line, idx) => {
      const lineY = startY + idx * lineHeight;
      ctx.fillText(line, width / 2, lineY);
    });
    ctx.restore();
    return startY + (lines.length - 1) * lineHeight;
  }
  private drawAuthor(
    x: number,
    y: number,
    author: string,
    preset: StylePreset,
    isPhoto = false,
    textColorMode: TextColorMode = 'auto'
  ): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '400 28px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '1.5px';
    let authorColor = preset.accentColor;
    if (textColorMode === 'dark') authorColor = '#5C3D2E';
    else if (textColorMode === 'light') authorColor = 'rgba(255, 255, 255, 0.9)';
    ctx.fillStyle = authorColor;
    ctx.globalAlpha = 0.94;
    if (isPhoto) {
      if (textColorMode === 'dark') {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 6;
      }
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(`— ${author}`, x, y);
    ctx.restore();
    return;
  } private _oldDrawAuthorIgnored() {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '400 28px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillStyle = preset.accentColor;
    ctx.globalAlpha = 0.94;
    if (isPhoto) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(`— ${author}`, x, y);
    ctx.restore();
  }
  private drawFooter(x: number, y: number, preset: StylePreset, isPhoto = false): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 20px "Inter", -apple-system, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = preset.textColor;
    ctx.globalAlpha = 0.65;
    if (isPhoto) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;
    }
    ctx.fillText('morning-quote.com', x, y);
    ctx.restore();
  }
  public async exportBlob(format: 'image/png' | 'image/webp' = 'image/png', quality = 0.95): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob from canvas'));
          }
        },
        format,
        quality
      );
    });
  }
  public async download(filename = 'morning-quote.png'): Promise<void> {
    const blob = await this.exportBlob('image/png', 0.98);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  public async copyToClipboard(): Promise<boolean> {
    try {
      const blob = await this.exportBlob('image/png', 0.95);
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Clipboard copy error:', e);
      return false;
    }
  }
  private fillRoundedRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  }
  private strokeRoundedRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.stroke();
  }
  private renderFrostedGlassPanel(
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    isLightMode: boolean
  ): void {
    const ctx = this.ctx;
    ctx.save();
    // 1. Deep Atmospheric Soft Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 22;
    ctx.shadowOffsetX = 0;
    // 2. Translucent Glass Fill
    ctx.fillStyle = isLightMode
      ? 'rgba(255, 255, 255, 0.16)'
      : 'rgba(15, 23, 42, 0.38)';
    this.fillRoundedRect(x, y, w, h, radius);
    ctx.shadowColor = 'transparent';
    // 3. Specular Highlight Gradient Border
    const strokeGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    strokeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.58)');
    strokeGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.22)');
    strokeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 1.8;
    this.strokeRoundedRect(x, y, w, h, radius);
    // 4. Subtle Inner Highlight Line at Top
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius + 10, y + 2);
    ctx.lineTo(x + w - radius - 10, y + 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  private renderFilmGrain(width: number, height: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    const step = 6;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const val = seed - Math.floor(seed);
        if (val > 0.65) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
    }
    ctx.restore();
  }
  private renderLightLeak(width: number, height: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const leak = ctx.createRadialGradient(
      width * 0.05,
      height * 0.08,
      10,
      width * 0.15,
      height * 0.18,
      width * 0.75
    );
    leak.addColorStop(0, 'rgba(255, 215, 130, 0.42)');
    leak.addColorStop(0.35, 'rgba(251, 146, 60, 0.20)');
    leak.addColorStop(0.7, 'rgba(244, 63, 94, 0.08)');
    leak.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = leak;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
  private renderWindowShadowLayer(width: number, height: number, preset: any): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((-22 * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
    const barWidth = 46;
    const gap = 64;
    ctx.fillStyle = 'rgba(28, 25, 23, 0.08)';
    for (let y = -height; y < height * 2; y += barWidth + gap) {
      ctx.fillRect(-width, y, width * 3, barWidth);
    }
    ctx.restore();
    ctx.restore();
  }
}