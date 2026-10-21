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
 * @summary displays a text, SVG or image answer in a focusable blank.
 * @tagname tp-blank
 * @attr {boolean} closed = false - Uses an answer-bank destination unless the question overrides the mode.
 * @attr {string} type = "text" - Open field type: text, number, math, date, or time.
 * @attr {string} name = "" - Name used by tp-fill-blank form data.
 * @attr {string} placeholder = "…" - Text displayed while the blank is empty.
 * @attr {boolean} disabled = false - Disables interaction.
 * @event input - Emitted when an answer is assigned or cleared.
 * @example
 * <tp-blank name="result" aria-label="Expected result"></tp-blank>
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
