/**
 * @module components/divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './divider.css?inline';
import { TpBase } from '../base/base.js';

export type TpDividerOrientation = 'horizontal' | 'vertical';

function isTpDividerOrientation(value: string): value is TpDividerOrientation {
  return value === 'horizontal' || value === 'vertical';
}

/**
 * `<tp-divider>` draws a compact horizontal or vertical separator.
 *
 * @summary Visual separator.
 * @tagname tp-divider
 * @attr {string} orientation = "horizontal" - Divider orientation (`horizontal` or `vertical`).
 * @cssprop --tp-divider-color Divider line color.
 * @cssprop --tp-divider-thickness Divider line thickness.
 * @cssprop --tp-divider-margin-block Block margin around the divider.
 * @cssprop --tp-divider-margin-inline Inline margin around the divider.
 * @example
 * <tp-divider></tp-divider>
 */
export class TpDivider extends TpBase {
  private static readonly styleId = 'tp-divider-styles';

  public static get observedAttributes(): string[] {
    return ['orientation'];
  }

  /**
   * Returns the divider orientation.
   *
   * @summary Returns the configured orientation.
   */
  public get orientation(): TpDividerOrientation {
    const value = this.getAttribute('orientation') ?? 'horizontal';
    return isTpDividerOrientation(value) ? value : 'horizontal';
  }

  /**
   * Updates the divider orientation.
   *
   * @summary Sets the configured orientation.
   * @param value Divider orientation.
   */
  public set orientation(value: TpDividerOrientation) {
    this.setAttribute('orientation', value);
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpDivider.styleId, style);
    this.updateDivider();
  }

  protected attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }

    this.updateDivider();
  }

  private updateDivider(): void {
    const orientation = this.orientation;

    if (this.getAttribute('orientation') !== orientation) {
      this.setAttribute('orientation', orientation);
    }

    this.setAttribute('role', 'separator');
    this.setAttribute('aria-orientation', orientation);
  }
}

if (!customElements.get('tp-divider')) {
  customElements.define('tp-divider', TpDivider);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-divider': TpDivider;
  }
}
