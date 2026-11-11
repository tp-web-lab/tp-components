/**
 * @module components/timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
export type TpTimefieldLabelPosition = "top" | "bottom" | "start" | "end";
/**
 * The custom `<tp-timefield>` element collects a time within optional limits.
 *
 * @summary Collects a time within optional limits.
 * @tagname tp-timefield
 * @attr {string} label = "" - Visible label associated with the native time input.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - Selected time in `HH:mm` or `HH:mm:ss` format.
 * @attr {string} min = "" - Earliest selectable time in HH:mm or HH:mm:ss format.
 * @attr {string} max = "" - Latest selectable time in HH:mm or HH:mm:ss format.
 * @attr {number} step = 60 - Time interval in seconds.
 * @attr {string} placeholder = "" - Hint forwarded to the native input; browsers may ignore it for date and time controls.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field and its action buttons.
 * @attr {boolean} clearable = false - Shows an embedded clear button while the field has a value.
 * @event input Emitted when the selected time changes while editing.
 * @event change Emitted when the selected time is committed.
 * @event tp-clear Emitted after the embedded button clears the value.
 * @example
 * <tp-timefield label="Time" value="14:30" clearable=""></tp-timefield>
 *  @cssprop [--tp-timefield-background=var(--tp-paper-color)] Background of the input control, excluding its label.
 * @cssprop [--tp-timefield-border-color=var(--tp-neutral-stroke-soft)] Border color of the input control when it is not focused.
 * @cssprop [--tp-timefield-focus-color=var(--tp-brand-text-colorful)] Border color and translucent outline tint while focus is inside the control.
 * @cssprop [--tp-timefield-inline-size=10.5em] Preferred width of the field, limited by the available container width.
 * @cssprop [--tp-timefield-label-font-weight=500] Font weight of the field label.
 * @cssprop [--tp-timefield-label-gap=0.35em] Space between the label and the input control.
 * @cssprop [--tp-timefield-padding-block=0.6em] Inner spacing above and below the input value.
 * @cssprop [--tp-timefield-padding-inline=0.75em] Inner spacing before and after the input value; additional space is reserved for action buttons.
 * @cssprop [--tp-timefield-radius=var(--tp-border-radius-sm)] Corner radius of the input control.
 * @cssprop [--tp-timefield-required-color=var(--tp-danger-text-colorful)] Color of the asterisk marking a required field.
 * @cssprop [--tp-timefield-value-font-weight=400] Font weight of the displayed input value.
 */
export declare class TpTimefield extends TpBase {
    private static readonly styleId;
    private field;
    private clearButton;
    private pickerButton;
    static get observedAttributes(): string[];
    /** Visible label associated with the native time input. */
    get label(): string;
    set label(value: string);
    /** Position of the visible label around its field. */
    get labelPosition(): TpTimefieldLabelPosition;
    set labelPosition(value: TpTimefieldLabelPosition);
    /** Selected time in `HH:mm` or `HH:mm:ss` format. */
    get value(): string;
    set value(value: string);
    /** Earliest selectable time. */
    get min(): string;
    set min(value: string);
    /** Latest selectable time. */
    get max(): string;
    set max(value: string);
    /** Time interval in seconds. */
    get step(): number;
    set step(value: number);
    /** Hint forwarded to the native input; browser support depends on input type. */
    get placeholder(): string;
    set placeholder(value: string);
    /** Name submitted with the containing form; defaults to the initial inline content when omitted. */
    get name(): string;
    set name(value: string);
    /** Native autocomplete hint. */
    get autocomplete(): string;
    set autocomplete(value: string);
    /** Whether a value is required. */
    get required(): boolean;
    set required(value: boolean);
    /** Whether the value cannot be edited. */
    get readOnly(): boolean;
    set readOnly(value: boolean);
    /** Whether the field is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Whether the embedded clear button can be displayed. */
    get clearable(): boolean;
    set clearable(value: boolean);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Focuses the native time input. */
    focus(options?: FocusOptions): void;
    /** Opens the native time picker when supported by the browser. */
    showPicker(): void;
    /** Clears the selected time and emits `input`, `change`, and `tp-clear`. */
    clear(): void;
    private render;
    private createButton;
    private sync;
    private readonly handleInput;
    private readonly handleChange;
    private readonly handleClear;
    private readonly handlePicker;
    private setValue;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-timefield": TpTimefield;
    }
}
