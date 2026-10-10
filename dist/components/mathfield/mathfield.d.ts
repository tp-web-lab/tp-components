/**
 * @module components/mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 */
import "../copy-code/copy-code.js";
import "../divider/divider.js";
import "../icon-button/icon-button.js";
import "../markdown/markdown.js";
import "../textfield/textfield.js";
import { TpBase } from "../base/base.js";
export type TpMathfieldMode = "latexmath" | "asciimath";
export type TpMathfieldLabelPosition = "top" | "bottom" | "start" | "end";
/**
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 * @tagname tp-mathfield
 * @attr {string} mode = "latexmath" - Mathematical notation (`latexmath` or `asciimath`).
 * @attr {boolean} multiline = false - Uses a multiline editor and display-style rendering.
 * @attr {boolean} preview = false - Opens the rendered MathJax preview panel.
 * @attr {string} value = "" - Mathematical expression source.
 * @attr {string} label = "" - Visible label associated with the editing field.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} placeholder = "Type LaTeX formula..." - Placeholder shown while the field is empty; defaults to the active notation mode.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field.
 * @attr {boolean} clearable = false - Shows the clear button; it is disabled when empty, readonly or disabled.
 * @event input Emitted when the expression changes while editing.
 * @event change Emitted when the expression is committed or a different notation is selected in the menu.
 * @event tp-clear Emitted after the embedded button clears the expression.
 * @event tp-math-rendered Emitted after MathJax finishes rendering the expression.
 * @cssprop [--tp-mathfield-inline-size=28rem] Component width.
 * @cssprop [--tp-mathfield-preview-background=Canvas] Preview panel background.
 * @cssprop [--tp-mathfield-preview-border-color=var(--tp-neutral-stroke-soft)] Preview border color.
 * @cssprop [--tp-mathfield-preview-padding=0.75rem] Preview padding.
 * @example
 * <tp-mathfield label="Formula" value="E = mc^2" clearable></tp-mathfield>
 */
export declare class TpMathfield extends TpBase {
    private static nextModeId;
    private modeButton;
    private modeDropdown;
    private static readonly styleId;
    private editor;
    private previewPanel;
    private previewButton;
    private sourceCopyButton;
    static get observedAttributes(): string[];
    /** Mathematical notation used by the expression. */
    get mode(): TpMathfieldMode;
    set mode(value: TpMathfieldMode);
    /** Whether the editor and rendering use multiline display mode. */
    get multiline(): boolean;
    set multiline(value: boolean);
    /** Whether the rendered MathJax preview is visible. */
    get previewVisible(): boolean;
    set previewVisible(value: boolean);
    /** Mathematical expression source. */
    get value(): string;
    set value(value: string);
    /** Visible label associated with the editing field. */
    get label(): string;
    set label(value: string);
    /** Position of the visible label around the editing field. */
    get labelPosition(): TpMathfieldLabelPosition;
    set labelPosition(value: TpMathfieldLabelPosition);
    /** Placeholder shown while the field is empty. */
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
    protected attributeChangedCallback(name: string): void;
    /** Focuses the expression editor. */
    focus(options?: FocusOptions): void;
    /** Clears the expression and emits `input`, `change`, and `tp-clear`. */
    clear(): void;
    /** Returns the mathematical expression source. */
    getValue(): string;
    private renderStructure;
    private syncEditor;
    private renderPreview;
    private readonly handleInput;
    private readonly handleChange;
    private readonly handleClear;
    private readonly handlePreviewToggle;
    private readonly handleRendered;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-mathfield": TpMathfield;
    }
}
