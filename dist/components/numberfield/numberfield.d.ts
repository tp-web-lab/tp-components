/**
 * @module components/numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { type TpChoiceLabelPosition } from "../../utilities/choice-label.js";
/** Logical positions of the visible number-field label. */
export type TpNumberfieldLabelPosition = TpChoiceLabelPosition;
/**
 * @summary numeric field with an optional native range slider.
 * @tagname tp-numberfield
 * @attr {string} label = "" - Visible label associated with the native input.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} aria-label = "" - Accessible name when a visible label is not supplied.
 * @attr {string} value = "" - Numeric value; range mode normalizes it to a nonempty value within its limits.
 * @attr {string} min = "" - Lower bound; native range inputs default to 0.
 * @attr {string} max = "" - Upper bound; native range inputs default to 100.
 * @attr {string} step = "1" - Positive numeric increment, or `any` for unrestricted fractional values.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} list = "" - ID of an external datalist supplying numeric suggestions or slider tick marks.
 * @attr {string} placeholder = "" - Hint shown by the empty number input; ignored in range mode.
 * @attr {boolean} range = false - Uses input type range instead of input type number.
 * @attr {boolean} required = false - Requires a value in number mode; ignored by native range inputs.
 * @attr {boolean} readonly = false - Prevents editing; a readonly slider is disabled with a hidden submission mirror.
 * @attr {boolean} disabled = false - Disables editing, clearing and form submission.
 * @attr {boolean} clearable = false - Shows a button that empties a number or resets a slider to its native midpoint.
 * @event input Emitted when the value changes during editing or clearing.
 * @event change Emitted when the value is committed or cleared.
 * @event tp-clear Emitted after clearing a number or resetting the slider.
 * @cssprop [--tp-numberfield-inline-size=20ch] Width of the field.
 * @cssprop [--tp-numberfield-background=var(--tp-paper-color)] Field background.
 * @cssprop [--tp-numberfield-border-color=var(--tp-neutral-stroke-soft)] Field border color.
 * @cssprop [--tp-numberfield-focus-color=var(--tp-brand-text-colorful)] Focus indicator color.
 * @example
 * <tp-numberfield label="Quantity" value="3" min="0" max="10" clearable></tp-numberfield>
 */
export declare class TpNumberfield extends TpBase {
    /** Native editor, retained when labels and modes change. */
    private readonly field;
    /** Existing library control used for clearing and resetting. */
    private readonly clearButton;
    /** Visible current slider value, redundant with the slider's accessible value. */
    private readonly readout;
    /** Submit readonly slider values without enabling the disabled native slider. */
    private readonly submission;
    /** Prevent recursive synchronization when native normalization changes value. */
    private syncing;
    /** Attributes synchronized with the native input. */
    static get observedAttributes(): string[];
    /** Visible field label. */
    get label(): string;
    /** Update the visible label. */
    set label(value: string);
    /** Logical label position, defaulting to top. */
    get labelPosition(): TpNumberfieldLabelPosition;
    /** Position the label around the native input. */
    set labelPosition(value: TpNumberfieldLabelPosition);
    /** Current numeric string; empty is supported only in number mode. */
    get value(): string;
    /** Assign a value, using native sanitization once connected. */
    set value(value: string);
    /** Lower bound, or an empty string for the native default. */
    get min(): string;
    /** Set the lower bound. */
    set min(value: string);
    /** Upper bound, or an empty string for the native default. */
    get max(): string;
    /** Set the upper bound. */
    set max(value: string);
    /** Positive increment or any; invalid values fall back to 1. */
    get step(): string;
    /** Set the increment or allow any fractional value. */
    set step(value: string);
    /** Field name used in form data. */
    get name(): string;
    /** Set the submitted field name. */
    set name(value: string);
    /** Identifier of the external datalist used by the native editor. */
    get list(): string;
    /** Associate a datalist with the native editor. */
    set list(value: string);
    /** Empty-number input hint. */
    get placeholder(): string;
    /** Set the empty-number input hint. */
    set placeholder(value: string);
    /** Whether the native editor is a slider. */
    get range(): boolean;
    /** Switch between number input and slider. */
    set range(value: boolean);
    /** Whether number mode requires a value. */
    get required(): boolean;
    /** Enable or disable native required validation. */
    set required(value: boolean);
    /** Whether editing is prevented while preserving submission. */
    get readOnly(): boolean;
    /** Prevent or allow editing. */
    set readOnly(value: boolean);
    /** Whether editing and submission are disabled. */
    get disabled(): boolean;
    /** Disable or enable the field and its clear action. */
    set disabled(value: boolean);
    /** Whether the embedded clear/reset control is shown. */
    get clearable(): boolean;
    /** Show or hide the clear/reset control. */
    set clearable(value: boolean);
    /** Reuse the established field styling and library buttons once connected. */
    protected connectedCallback(): void;
    /** Release listeners; reconnecting installs them once without duplicating DOM. */
    disconnectedCallback(): void;
    /** Update presentation without replacing the native editor. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Focus the native number input or slider. */
    focus(options?: FocusOptions): void;
    /** Empty a number or reset a slider to its native midpoint and notify consumers. */
    clear(): void;
    /** Build the familiar field shell using shared styles and existing icon components. */
    private render;
    /** Apply native number/range rules and reflect the sanitized value. */
    private sync;
    /** Forward one editing event after reflecting the native value. */
    private readonly handleInput;
    /** Reflect edits even when a browser commits without a preceding input event. */
    private readonly handleChange;
    /** Delegate activation of the shared clear button to the public action. */
    private readonly handleClear;
}
declare global {
    /** Typed DOM creation for the public numberfield tag. */
    interface HTMLElementTagNameMap {
        "tp-numberfield": TpNumberfield;
    }
}
