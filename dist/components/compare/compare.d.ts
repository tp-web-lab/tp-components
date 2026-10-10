/**
 * @module components/compare
 * @summary Before-and-after comparison component.
 */
import { TpBase } from '../base/base.js';
type TpCompareOrientation = 'horizontal' | 'vertical';
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
export declare class TpCompare extends TpBase {
    private static readonly styleId;
    private beforeLayerEl;
    private afterLayerEl;
    private dividerEl;
    private handleEl;
    private beforeLabelEl;
    private afterLabelEl;
    private initialPosition;
    private readonly handlePointerMove;
    private readonly handlePointerUp;
    static get observedAttributes(): string[];
    /**
     * Comparator orientation.
     *
     * - `horizontal` : séparation gauche / droite
     * - `vertical` : séparation haut / bas
     */
    get orientation(): TpCompareOrientation;
    set orientation(value: TpCompareOrientation);
    /**
     * Separator position as a percentage.
     */
    get position(): string;
    set position(value: string);
    /**
     * Optional label for the before layer.
     */
    get beforeLabel(): string;
    set beforeLabel(value: string);
    /**
     * Optional label for the after layer.
     */
    get afterLabel(): string;
    set afterLabel(value: string);
    /**
     * Local persistence key for the position.
     */
    get storageKey(): string;
    set storageKey(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    disconnectedCallback(): void;
    /**
     * Resets the position to its initial value.
     */
    reset(): void;
    private ensureStyles;
    private ensureStructure;
    private updateCompare;
    private normalizeOrientationAttribute;
    private updateLabels;
    private updatePositionFromPointer;
    private updatePositionFromKeyboard;
    private clampPercentage;
    private loadPosition;
    private savePosition;
}
export {};
