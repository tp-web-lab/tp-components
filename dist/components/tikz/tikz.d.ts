/**
 * @module components/tikz
 * @summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
/**
 * @credit TikZJax https://tikzjax.com/
 * @summary WebAssembly TeX engine, core dump and SVG conversion.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-tikz>` element renders TikZ drawings.
 *
 * @summary Renders TikZ drawings.
 * @tagname tp-tikz
 * @attr {string} src = "" - URL of a TikZ source file; takes precedence over value and inline source.
 * @attr {string} value = "" - TikZ source; takes precedence over inline source when present.
 * @attr {string} libraries = "" - Comma-separated TikZ libraries to load before the drawing.
 * @attr {number} scale = "1" - Positive display scale for the complete drawing, constrained to the available width.
 * @attr {string} label = "TikZ drawing" - Accessible title for the drawing frame.
 * @example
 * <tp-tikz scale="1.8" label="Linear, sine and exponential functions"><script type="tp/tikz">\begin{tikzpicture}[domain=0:4]
 *   \draw[very thin,color=gray] (-0.1,-1.1) grid (3.9,3.9);
 *
 *   \draw[->] (-0.2,0) -- (4.2,0) node[right] {$x$};
 *   \draw[->] (0,-1.2) -- (0,4.2) node[above] {$f(x)$};
 *
 *   \draw[color=red]    plot (\x,\x)             node[right] {$f(x) =x$};
 *   % \x r means to convert '\x' from degrees to _r_adians:
 *   \draw[color=blue]   plot (\x,{sin(\x r)})    node[right] {$f(x) = \sin x$};
 *   \draw[color=orange] plot (\x,{0.05*exp(\x)}) node[right] {$f(x) = \frac{1}{20} \mathrm e^x$};
 * \end{tikzpicture}</script></tp-tikz>
 *  @event tp-tikz-rendered Emitted when the SVG drawing is ready.
 * @eventdetail tp-tikz-rendered void
 * @event tp-tikz-error Emitted when loading or compilation fails.
 * @eventdetail tp-tikz-error { message: string }
 * @see tp-latex - Render a complete LaTeX document containing TikZ figures.
 */
export declare class TpTikz extends TpBase {
    static get observedAttributes(): string[];
    private revision;
    private request?;
    private snapshot;
    private frame?;
    private timer?;
    private source;
    private readonly output;
    private readonly receive;
    get src(): string;
    set src(value: string);
    get value(): string;
    set value(value: string);
    get libraries(): string;
    set libraries(value: string);
    get scale(): number;
    set scale(value: number);
    get label(): string;
    set label(value: string);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    private fail;
    private render;
    private renderFrame;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-tikz": TpTikz;
    }
}
