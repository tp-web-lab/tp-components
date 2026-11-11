/**
 * @module components/flip-card
 * @summary Two-sided card component.
 */
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-flip-card>` element displays a two-sided card.
 *
 * @summary Displays a two-sided card.
 * @tagname tp-flip-card
 * @attr {boolean} disabled = false - Prevents the card from being flipped.
 * @attr {boolean} fit-content = false - Adapts the card dimensions to its verso content.
 * @attr {boolean} flipped = false - Shows the verso when present.
 * @attr {string} button-position = "bottom end" - Position of the overlaid flip button, or none to hide it.
 *
 * @cssprop --tp-flip-card-aspect-ratio Card aspect ratio.
 * @cssprop --tp-flip-card-background Card face background.
 * @cssprop --tp-flip-card-border-color Card border color.
 * @cssprop --tp-flip-card-border-radius Card border radius.
 * @cssprop --tp-flip-card-button-offset Distance between the button and the card edge.
 * @cssprop --tp-flip-card-padding Card face padding.
 * @cssprop --tp-flip-card-width Card width.
 * @example
 * <tp-flip-card>
 * <dl>
 *   <dt>recto</dt><dd><p>This is the content <strong>recto...</strong></p></dd>
 *   <dt>verso</dt><dd><p>...and here is the content <strong>verso.</strong></p></dd>
 * </dl>
 * </tp-flip-card>
 *  @event tp-flip-card-change Emitted when the visible side changes; flipped is true when the back face is visible.
 * @eventdetail tp-flip-card-change { flipped: boolean }
 */
export declare class TpFlipCard extends TpBase {
    private static readonly styleId;
    static get observedAttributes(): string[];
    get disabled(): boolean;
    set disabled(value: boolean);
    get flipped(): boolean;
    set flipped(value: boolean);
    get buttonPosition(): string;
    set buttonPosition(value: string);
    protected connectedCallback(): void;
    attributeChangedCallback(): void;
    /** Flips the card and returns its new state. */
    flip(): boolean;
    private renderFromDefinitionList;
    private syncState;
    private normalizedButtonPosition;
    private renderError;
}
