/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-datefield
 * @summary Native date field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import { TpDatefield } from "../datefield/datefield.js";
import { TpMathfield } from "../mathfield/mathfield.js";
import { TpNumberfield } from "../numberfield/numberfield.js";
import { TpTextfield } from "../textfield/textfield.js";
import { TpTimefield } from "../timefield/timefield.js";
declare const fieldClasses: {
    text: typeof TpTextfield;
    number: typeof TpNumberfield;
    math: typeof TpMathfield;
    date: typeof TpDatefield;
    time: typeof TpTimefield;
};
type BlankType = keyof typeof fieldClasses;
/**
 * The custom `<tp-blank>` element provides an answer slot for text, images or drawings.
 *
 * @summary Provides an answer slot for text, images or drawings.
 * @tagname tp-blank
 * @attr {string} aria-label = "" - Accessible name forwarded to the editing control; use it when the field has no visible label.
 * @attr {boolean} closed = false - Uses an answer-bank destination unless the question overrides the mode.
 * @attr {string} type = "text" - Open field type: text, number, math, date, or time.
 * @attr {string} name = "" - Name used by tp-fill-blank form data.
 * @attr {string} placeholder = "…" - Text displayed while the blank is empty.
 * @attr {boolean} disabled = false - Disables interaction.
 *
 * @example
 * <tp-fill-blank-question mode="closed">
 *   <dl>
 *     <dt>Title</dt><dd>Match the answers</dd>
 *     <dt>Prompt</dt><dd>Choose an answer for each blank.</dd>
 *     <dt>Answers</dt>
 *     <dd><ol>
 *       <li>Paris</li>
 *       <li><svg xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" role="img" aria-label="Triangle"><path d="M24 3 45 37H3Z" fill="none" stroke="currentColor" stroke-width="3"></path></svg></li>
 *       <li><img src="/docs/medias/logos/logo-tp.svg" alt="tp-components logo" width="40" height="40"></li>
 *     </ol></dd>
 *     <dt>Form</dt>
 *     <dd>
 *       <p>The capital of France: <tp-blank name="capital" aria-label="Capital of France"></tp-blank></p>
 *       <p>A shape with three sides: <tp-blank name="shape" aria-label="Three-sided shape"></tp-blank></p>
 *       <p>The library logo: <tp-blank name="logo" aria-label="Library logo"></tp-blank></p>
 *     </dd>
 *     <dt>Feedback</dt><dd>Match each answer to its description.</dd>
 *     <dt>Solution</dt><dd>Paris; the triangle; the tp-components logo.</dd>
 *   </dl>
 * </tp-fill-blank-question>
 *  @cssprop [--tp-blank-filled-border-color=var(--tp-brand-stroke-mid)] Bottom border color of a blank after an answer has been filled in.
 * @event input Emitted when an answer is assigned or cleared; read the updated answer from value.
 * @eventdetail input void
 * @event tp-blank-mode-change Emitted when closed or type changes while connected, after the blank has been rendered in its new mode.
 * @eventdetail tp-blank-mode-change void
 * @accessibility Editable blanks delegate to the field matching their type and forward accessible naming attributes; closed blanks expose a named focusable group with aria-disabled reflecting availability.
 * @accessibility Delete and Backspace clear an enabled focused closed blank; its clear control is disabled when clearing is unavailable.
 * @accessibilityresponsibility Supply a descriptive label or aria-label for each answer location and text alternatives for image or SVG answers; do not rely on answer color or position alone.
 */
export declare class TpBlank extends TpBase {
    private editor;
    private renderedType;
    private renderedClosed;
    private readonly questionObserver;
    private readonly forwarded;
    get closed(): boolean;
    set closed(value: boolean);
    get type(): BlankType;
    set type(value: BlankType);
    get effectiveClosed(): boolean;
    /** Reconciles the local control with the nearest question without changing author attributes. */
    syncMode(): void;
    /** Stored answer identity, independent of the displayed markup. */
    private currentValue;
    /** Previously assigned content allows form-data restoration without losing SVG. */
    private readonly answers;
    /** Stable trailing controls, kept outside the rich answer content. */
    private tools;
    /** Built-in clear control reused across renders. */
    private clearButton;
    /** Attributes whose changes affect the visible control. */
    static get observedAttributes(): string[];
    /** Field name included in form data. */
    get name(): string;
    set name(value: string);
    /** Whether the destination is unavailable. */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Closed blanks are readonly; open fields follow the author readonly setting. */
    get readOnly(): boolean;
    set readOnly(_value: boolean);
    /** Answer identity (one-based source-list rank in a closed question). */
    get value(): string;
    set value(value: string);
    /** Assigns an identity and clones its visual content without moving the source. */
    setAnswer(value: string, content: Node): void;
    /** Empties the blank and notifies its form. */
    clear(): void;
    /** Installs shared styles and makes the destination itself keyboard-focusable. */
    protected connectedCallback(): void;
    /** Removes the standalone clearing shortcut on disconnect. */
    disconnectedCallback(): void;
    /** Reflects attributes without losing assigned content. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Supports clearing a standalone focused blank. */
    private readonly onKeyDown;
    /** Clears without treating the close click as a new answer assignment. */
    private readonly onClearClick;
    /** Places answer nodes directly in the host, preserving SVG semantics and host focus. */
    private render;
}
/** Recognizes registered blanks even when hot reload creates a new module constructor. */
export declare function isTpBlank(element: Element): element is TpBlank;
declare global {
    interface HTMLElementTagNameMap {
        "tp-blank": TpBlank;
    }
}
export {};
