/**
 * @module components/latex
 * @summary Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-math
 * @summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
 */
/**
 * @tp-dependency tp-tikz
 * @summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
import { TpBase } from "../base/base.js";
import "../math/math.js";
import "../tikz/tikz.js";
/**
 * The custom `<tp-latex>` element renders LaTeX documents, mathematical formulas and TikZ drawings.
 *
 * @summary Renders LaTeX documents, mathematical formulas and TikZ drawings.
 * @tagname tp-latex
 * @attr {string} src = "" - URL of a LaTeX document; takes precedence over value and inline source.
 * @attr {string} value = "" - LaTeX source; takes precedence over inline source when present.
 * @example
 * <tp-latex><script type="tp/latex">\section{A first document}
 * The area of a circle is $A=\pi r^2$.</script></tp-latex>
 *  @event tp-latex-rendered Emitted after document conversion. Nested formulas and figures may still be rendering.
 * @eventdetail tp-latex-rendered { html: string }
 * @event tp-latex-error Emitted when loading or conversion fails.
 * @eventdetail tp-latex-error { message: string }
 * @see tp-tikz - Render a standalone TikZ drawing.
 */
export declare class TpLatex extends TpBase {
    static get observedAttributes(): string[];
    private readonly output;
    private snapshot;
    private revision;
    private request?;
    get src(): string;
    set src(value: string);
    get value(): string;
    set value(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    protected disconnectedCallback(): void;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-latex": TpLatex;
    }
}
