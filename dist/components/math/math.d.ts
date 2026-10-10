/** @module components/math */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
 * @summary Markdown parsing and rendering.
 */
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
/** Mathematical input notation, consistent with tp-mathfield. */
export type TpMathMode = "latexmath" | "asciimath";
/**
 * @summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
 * @tagname tp-math
 * @attr {string} value = "" - Expression without surrounding math delimiters.
 * @attr {string} src = "" - Expression file; takes precedence over value and inline content.
 * @attr {"latexmath" | "asciimath"} mode = "latexmath" - Mathematical input notation.
 * @attr {boolean} displaystyle = false - Uses display-style mathematics in a centered block instead of inline mathematics.
 * @attr {string} label = "" - Accessible description of the formula; defaults to its source text.
 * @event tp-math-rendered Emitted after the current expression is rendered successfully.
 * @eventdetail tp-math-rendered { value: string; mode: TpMathMode; displaystyle: boolean }
 * @event tp-math-error Emitted when loading or rendering the current expression fails.
 * @eventdetail tp-math-error { message: string }
 * @accessibility The SVG has an accessible name; label can provide a readable description instead of source notation.
 * @accessibilityresponsibility Describe complex expressions with label or surrounding explanatory text.
 * @example
 * <p>The identity <tp-math value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"></tp-math> describes a right triangle.</p>
 */
export declare class TpMath extends TpBase {
    /** Serializes this component's MathJax jobs, including initial runtime loading. */
    private static queue;
    /** Preserves author content independently of generated SVGs and messages. */
    private readonly source;
    /** Invalidates asynchronous work after updates or disconnection. */
    private revision;
    /** Cancels an obsolete source request. */
    private request;
    /** Defers initial reading until the HTML parser has supplied child content. */
    private timer;
    /** Attributes that update the expression without rebuilding the element. */
    static get observedAttributes(): string[];
    /** Expression supplied directly as an attribute. */
    get value(): string;
    /** Sets the expression; an empty value falls back to inline content. */
    set value(value: string);
    /** URL of an external expression file. */
    get src(): string;
    /** Sets the external source; an empty string restores local content. */
    set src(value: string);
    /** Effective input notation; unrecognized values fall back to LaTeX. */
    get mode(): TpMathMode;
    /** Sets the input notation. */
    set mode(value: TpMathMode);
    /** Whether the formula uses display style and block layout. */
    get displaystyle(): boolean;
    /** Enables display style by presence, or inline style by absence. */
    set displaystyle(value: boolean);
    /** Optional human-readable accessible name. */
    get label(): string;
    /** Sets the accessible description. */
    set label(value: string);
    /** Installs shared styles and observes author content arriving after upgrade. */
    protected connectedCallback(): void;
    /** Cancels pending work without losing the original expression. */
    disconnectedCallback(): void;
    /** Renders only connected elements, coalescing synchronous attribute changes. */
    protected attributeChangedCallback(): void;
    /** Invalidates obsolete output immediately, then defers a single render. */
    private schedule;
    /** Reads the common source contract and commits only the latest SVG or error. */
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-math": TpMath;
    }
}
