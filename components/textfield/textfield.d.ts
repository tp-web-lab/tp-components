/**
 * @module components/textfield
 * @summary Single-line and automatically growing multiline text field.
 */
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
export type TpTextfieldType = "text" | "email" | "password" | "search" | "tel" | "url";
export type TpTextfieldLabelPosition = "top" | "bottom" | "start" | "end";
/**
 * @summary Single-line and automatically growing multiline text field.
 * @tagname tp-textfield
 * @attr {string} type = "text" - Input type (`text`, `email`, `password`, `search`, `tel`, or `url`).
 * @attr {boolean} multiline = false - Uses an automatically growing textarea instead of an input.
 * @attr {string} label = "" - Visible label associated with the native input or textarea.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - Current field value.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} placeholder = "" - Placeholder shown while the field is empty.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {number} rows = 3 - Minimum number of rows in multiline mode.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field and its clear button.
 * @attr {boolean} clearable = false - Shows the clear button; it is disabled when empty, readonly or disabled.
 * @attr {string} icon = "" - Prefix icon name.
 * @attr {string} icon-library = "tp" - Prefix icon library.
 * @event input Emitted when the value changes while editing.
 * @event change Emitted when the edited value is committed.
 * @event tp-clear Emitted after the embedded button clears the value.
 * @cssprop [--tp-textfield-background=var(--tp-paper-color)] Field background.
 * @cssprop [--tp-textfield-border-color=var(--tp-neutral-stroke-soft)] Field border color.
 * @cssprop [--tp-textfield-focus-color=var(--tp-brand-text-colorful)] Focus border color.
 * @cssprop [--tp-textfield-inline-size=20ch] Width of a single-line text field.
 * @cssprop [--tp-textfield-label-gap=0.35em] Space between the label and its field.
 * @cssprop [--tp-textfield-label-font-weight=500] Label font weight.
 * @cssprop [--tp-textfield-radius=var(--tp-border-radius-sm)] Field border radius.
 * @cssprop [--tp-textfield-required-color=var(--tp-danger-text-colorful)] Required marker color.
 * @cssprop [--tp-textfield-padding-block=0.6em] Vertical field padding.
 * @cssprop [--tp-textfield-padding-inline=0.75em] Horizontal field padding.
 * @cssprop [--tp-textfield-value-font-weight=400] Entered value and placeholder font weight.
 * @example
 * <tp-textfield label="Single line" placeholder="Type some text..." clearable></tp-textfield>
 *
 *     <tp-textfield label="Multiline" multiline placeholder="Type some text..." clearable value="An example of text that has already been entered in the field"></tp-textfield>
 */
export declare class TpTextfield extends TpBase {
    private static readonly textfieldStyleId;
    private field;
    private prefixIcon;
    private clearButton;
    static get observedAttributes(): string[];
    /** Native input type used in single-line mode. */
    get type(): TpTextfieldType;
    set type(value: TpTextfieldType);
    /** Whether the control uses an automatically growing textarea. */
    get multiline(): boolean;
    set multiline(value: boolean);
    /** Visible label associated with the native input or textarea. */
    get label(): string;
    set label(value: string);
    /** Position of the visible label around its field. */
    get labelPosition(): TpTextfieldLabelPosition;
    set labelPosition(value: TpTextfieldLabelPosition);
    /** Current field value. */
    get value(): string;
    set value(value: string);
    /** Name submitted with the containing form; defaults to the initial inline content when omitted. */
    get name(): string;
    set name(value: string);
    /** Placeholder shown while the field is empty. */
    get placeholder(): string;
    set placeholder(value: string);
    /** Native autocomplete hint. */
    get autocomplete(): string;
    set autocomplete(value: string);
    /** Minimum number of rows used in multiline mode. */
    get rows(): number;
    set rows(value: number);
    /** Whether a value is required for native form validation. */
    get required(): boolean;
    set required(value: boolean);
    /** Whether the value cannot be edited. */
    get readOnly(): boolean;
    set readOnly(value: boolean);
    /** Whether the complete field is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Whether the embedded clear button is displayed. */
    get clearable(): boolean;
    set clearable(value: boolean);
    /** Prefix icon name. */
    get icon(): string;
    set icon(value: string);
    /** Prefix icon library. */
    get iconLibrary(): string;
    set iconLibrary(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Focuses the native input or textarea. */
    focus(options?: FocusOptions): void;
    /** Selects the complete field value. */
    select(): void;
    /** Clears the field and emits `input`, `change`, and `tp-clear`. */
    clear(): void;
    private render;
    private sync;
    private readonly handleInput;
    private readonly handleChange;
    private readonly handleClear;
    private setValue;
    private resizeTextarea;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-textfield": TpTextfield;
    }
}
