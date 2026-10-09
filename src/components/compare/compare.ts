/**
 * @module components/compare
 * @summary Before-and-after comparison component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './compare.css?inline';
import { TpBase } from '../base/base.js';

type TpCompareOrientation = 'horizontal' | 'vertical';

function isOrientation(value: string): value is TpCompareOrientation {
  return value === 'horizontal' || value === 'vertical';
}

function isPercentage(value: string): boolean {
  return /^\d+(?:\.\d+)?%$/.test(value);
}

function parsePercentage(value: string): number {
  return Number.parseFloat(value);
}

/**
 * `<tp-compare>` compare deux contenus superposés, typiquement une image
 * before/after, without using Shadow DOM.
 *
 * Structure attendue :
 *
 * ```html
 * <tp-compare position="50%">
 *   <img slot="before" src="/before.jpg" alt="Avant">
 *   <img slot="after" src="/after.jpg" alt="Après">
 * </tp-compare>
 * ```
 *
 * Le composant utilise l'attribut `slot` comme convention en DOM léger :
 * - `slot="before"`
 * - `slot="after"`
 *
 * Reactive attributes:
 * - `orientation`
 * - `position`
 * - `before-label`
 * - `after-label`
 * - `storage-key`
 * @tagname tp-compare
 * @accessibility Exposes the comparison handle as an adjustable ARIA separator.
 * @accessibility Supports equivalent pointer and keyboard position controls.
 * @accessibilityresponsibility Provide meaningful text alternatives for both compared contents.
 * @keyboard {Arrow keys} Moves the separator by 1%, or by 10% while Shift is held.
 * @keyboard {Home / End} Moves the separator to its minimum or maximum position.
 * @example
 * <tp-compare></tp-compare>
 */
export class TpCompare extends TpBase {
  private static readonly styleId = 'tp-compare-styles';

  private beforeLayerEl: HTMLDivElement | null = null;
  private afterLayerEl: HTMLDivElement | null = null;
  private dividerEl: HTMLDivElement | null = null;
  private handleEl: HTMLDivElement | null = null;
  private beforeLabelEl: HTMLDivElement | null = null;
  private afterLabelEl: HTMLDivElement | null = null;
  private initialPosition = '50%';

  private readonly handlePointerMove = (event: PointerEvent): void => {
    this.updatePositionFromPointer(event);
  };

  private readonly handlePointerUp = (): void => {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.savePosition();
  };

  public static get observedAttributes(): string[] {
    return [
      'orientation',
      'position',
      'before-label',
      'after-label',
      'storage-key',
    ];
  }

  /**
   * Comparator orientation.
   *
   * - `horizontal` : séparation gauche / droite
   * - `vertical` : séparation haut / bas
   */
  public get orientation(): TpCompareOrientation {
    const value = this.getAttribute('orientation');
    return value !== null && isOrientation(value) ? value : 'horizontal';
  }

  public set orientation(value: TpCompareOrientation) {
    this.setAttribute('orientation', value);
  }

  /**
   * Separator position as a percentage.
   */
  public get position(): string {
    const value = this.getAttribute('position') ?? '';
    return isPercentage(value) ? value : '50%';
  }

  public set position(value: string) {
    if (!isPercentage(value)) {
      throw new TypeError(
        'The "position" attribute must be a percentage string like "50%".',
      );
    }

    this.setAttribute('position', value);
  }

  /**
   * Optional label for the before layer.
   */
  public get beforeLabel(): string {
    return this.getAttribute('before-label') ?? '';
  }

  public set beforeLabel(value: string) {
    if (value === '') {
      this.removeAttribute('before-label');
      return;
    }

    this.setAttribute('before-label', value);
  }

  /**
   * Optional label for the after layer.
   */
  public get afterLabel(): string {
    return this.getAttribute('after-label') ?? '';
  }

  public set afterLabel(value: string) {
    if (value === '') {
      this.removeAttribute('after-label');
      return;
    }

    this.setAttribute('after-label', value);
  }

  /**
   * Local persistence key for the position.
   */
  public get storageKey(): string {
    return this.getAttribute('storage-key') ?? '';
  }

  public set storageKey(value: string) {
    if (value === '') {
      this.removeAttribute('storage-key');
      return;
    }

    this.setAttribute('storage-key', value);
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.ensureStructure();
    this.normalizeOrientationAttribute();
    this.initialPosition = this.position;
    this.loadPosition();
    this.updateCompare();
  }

  protected attributeChangedCallback(name: string): void {
    if (!this.isConnected) {
      return;
    }

    if (name === 'orientation' && this.normalizeOrientationAttribute()) {
      return;
    }

    if (name === 'storage-key') {
      this.loadPosition();
    }

    this.updateCompare();
  }

  public disconnectedCallback(): void {
    super.connectedCallback();
    this.handlePointerUp();
  }

  /**
   * Resets the position to its initial value.
   */
  public reset(): void {
    this.position = this.initialPosition;
    this.savePosition();
    this.updateCompare();
  }

  private ensureStyles(): void {
    if (document.getElementById(TpCompare.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpCompare.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

  private ensureStructure(): void {
    const before = this.querySelector<HTMLElement>('[slot="before"]');
    const after = this.querySelector<HTMLElement>('[slot="after"]');

    if (before === null || after === null) {
      return;
    }

    if (this.beforeLayerEl === null) {
      const layer = document.createElement('div');
      layer.setAttribute('data-tp-compare-layer', 'before');
      this.beforeLayerEl = layer;
      this.append(layer);
    }

    if (this.afterLayerEl === null) {
      const layer = document.createElement('div');
      layer.setAttribute('data-tp-compare-layer', 'after');
      this.afterLayerEl = layer;
      this.append(layer);
    }

    if (before.parentElement !== this.beforeLayerEl) {
      this.beforeLayerEl.append(before);
    }

    if (after.parentElement !== this.afterLayerEl) {
      this.afterLayerEl.append(after);
    }

    if (this.dividerEl === null) {
      const divider = document.createElement('div');
      divider.setAttribute('data-tp-compare-divider', '');
      this.dividerEl = divider;
      this.append(divider);
    }

    if (this.handleEl === null) {
      const handle = document.createElement('div');
      handle.setAttribute('data-tp-compare-handle', '');
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-label', 'Comparison position');
      handle.setAttribute('aria-valuemin', '5');
      handle.setAttribute('aria-valuemax', '95');
      handle.tabIndex = 0;
      handle.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
      });
      handle.addEventListener('keydown', (event) => {
        this.updatePositionFromKeyboard(event);
      });
      this.handleEl = handle;
      this.append(handle);
    }

    if (this.beforeLabelEl === null) {
      const label = document.createElement('div');
      label.setAttribute('data-tp-compare-label', 'before');
      this.beforeLabelEl = label;
      this.append(label);
    }

    if (this.afterLabelEl === null) {
      const label = document.createElement('div');
      label.setAttribute('data-tp-compare-label', 'after');
      this.afterLabelEl = label;
      this.append(label);
    }
  }

  private updateCompare(): void {
    this.style.setProperty('--tp-compare-position', this.position);

    if (this.handleEl !== null) {
      this.handleEl.setAttribute(
        'aria-orientation',
        this.orientation === 'horizontal' ? 'vertical' : 'horizontal',
      );
      const value = parsePercentage(this.position);
      this.handleEl.setAttribute('aria-valuenow', String(value));
      this.handleEl.setAttribute('aria-valuetext', `${String(value)}%`);
    }

    this.updateLabels();
  }

  private normalizeOrientationAttribute(): boolean {
    const orientation = this.getAttribute('orientation');
    if (orientation === null || !isOrientation(orientation)) {
      this.setAttribute('orientation', 'horizontal');
      return true;
    }

    return false;
  }

  private updateLabels(): void {
    if (this.beforeLabelEl !== null) {
      this.beforeLabelEl.textContent = this.beforeLabel;
      this.beforeLabelEl.hidden = this.beforeLabel === '';
    }

    if (this.afterLabelEl !== null) {
      this.afterLabelEl.textContent = this.afterLabel;
      this.afterLabelEl.hidden = this.afterLabel === '';
    }
  }

  private updatePositionFromPointer(event: PointerEvent): void {
    const rect = this.getBoundingClientRect();

    if (this.orientation === 'horizontal') {
      const relativeX = event.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;
      this.position = `${String(this.clampPercentage(percentage))}%`;
      return;
    }

    const relativeY = event.clientY - rect.top;
    const percentage = (relativeY / rect.height) * 100;
    this.position = `${String(this.clampPercentage(percentage))}%`;
  }

  private updatePositionFromKeyboard(event: KeyboardEvent): void {
    const supported = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];
    if (!supported.includes(event.key)) {
      return;
    }

    event.preventDefault();
    const current = parsePercentage(this.position);
    const step = event.shiftKey ? 10 : 1;
    let next = current;

    if (event.key === 'Home') next = 5;
    else if (event.key === 'End') next = 95;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next -= step;
    else next += step;

    this.position = `${String(this.clampPercentage(next))}%`;
    this.savePosition();
  }

  private clampPercentage(value: number): number {
    return Math.min(95, Math.max(5, Math.round(value * 100) / 100));
  }

  private loadPosition(): void {
    if (this.storageKey === '') {
      return;
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved !== null && isPercentage(saved)) {
        this.position = saved;
      }
    } catch {
      // ignore storage errors
    }
  }

  private savePosition(): void {
    if (this.storageKey === '') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, this.position);
    } catch {
      // ignore storage errors
    }
  }
}

if (!customElements.get('tp-compare')) {
  customElements.define('tp-compare', TpCompare);
}
