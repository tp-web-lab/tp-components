/**
 * @module components/button-group
 * @summary Button group component for organizing multiple buttons.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
// tp-docgen:dependencies:end

import style from './button-group.css?inline';
import { TpBase } from '../base/base.js';
import '../button/button.js';

/**
 * @summary API documentation summary.
 */
export type TpButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isButtonGroupOrientation(
  value: string,
): value is TpButtonGroupOrientation {
  return value === 'horizontal' || value === 'vertical';
}

/**
 * @summary API documentation summary.
 * @tagname tp-button-group
 * @attr {string} orientation = "horizontal" - Attribute `orientation`.
 * @attr {boolean} attached = false - Attribute `attached`.
 * @attr {boolean} stretch = false - Attribute `stretch`.
 * @cssprop [--tp-button-group-gap=0] CSS custom property.
 * @example
 * <tp-button-group>
 * <tp-button>Previous</tp-button>
 *   <tp-button data-next>Next</tp-button>
 * </tp-button-group>
 */
export class TpButtonGroup extends TpBase {
 /**
  * @summary Global style ID.
  * @internal
  */
  private static readonly buttonGroupStyleId = 'tp-button-group-styles';

 /**
  * @summary Declares observed attributes.
  * @internal
  */
  public static get observedAttributes(): string[] {
    return ['orientation', 'attached', 'stretch'];
  }

 /**
  * @summary API documentation summary.
  * @default horizontal
  */
  public get orientation(): TpButtonGroupOrientation {
    const value = this.getAttribute('orientation');
    return value !== null && isButtonGroupOrientation(value)
      ? value
      : 'horizontal';
  }

  public set orientation(value: TpButtonGroupOrientation) {
    this.setStringAttribute('orientation', value);
  }

 /**
  * @summary API documentation summary.
  * @attr attached
  */
  public get attached(): boolean {
    return this.getBooleanAttribute('attached');
  }

  public set attached(value: boolean) {
    this.setBooleanAttribute('attached', value);
  }

 /**
  * @summary API documentation summary.
  * @attr stretch
  */
  public get stretch(): boolean {
    return this.getBooleanAttribute('stretch');
  }

  public set stretch(value: boolean) {
    this.setBooleanAttribute('stretch', value);
  }

 /**
  * @summary Injects the styles and synchronizes the markers.
  * @internal
  */
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpButtonGroup.buttonGroupStyleId, style);
    this.updateButtonGroup();
  }

 /**
  * @summary API documentation summary.
  * @param _name Parameter.
  * @param oldValue Parameter.
  * @param newValue Parameter.
  * @internal
  */
  protected attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue !== newValue) {
      this.updateButtonGroup();
    }
  }

 /**
  * @summary API documentation summary.
  * @internal
  */
  public disconnectedCallback(): void {
  }

 /**
  * @summary API documentation summary.
  * @internal
  */
  private updateButtonGroup(): void {
    this.setAttribute('orientation', this.orientation);
  }
}

if (!customElements.get('tp-button-group')) {
  customElements.define('tp-button-group', TpButtonGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-button-group': TpButtonGroup;
  }
}
