/** @module components/word-cloud */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import "../icon/icon.js";
/** Full rectangle containment also rejects concave notches crossing between its corners. */
export declare function fitsCloud(x: number, y: number, w: number, h: number, shape: string): boolean;
/** Tests points against the chosen silhouette, centered on the origin. */
export declare function insideCloud(x: number, y: number, shape: string): boolean;
/**
 * The custom `<tp-word-cloud>` element generates a responsive SVG word cloud inside a chosen silhouette.
 *
 * @summary Generates a responsive SVG word cloud inside a chosen silhouette.
 * @tagname tp-word-cloud
 * @attr {"circle"|"triangle"|"square"|"pentagon"|"hexagon"|"cloud"|"heart"|"puzzle"} shape = "circle" - Outer silhouette, using English names only.
 * @attr {"default"|"red"|"orange"|"amber"|"yellow"|"lime"|"green"|"emerald"|"teal"|"glaz"|"cyan"|"sky"|"blue"|"indigo"|"violet"|"purple"|"fuchsia"|"pink"|"rose"|"zinc"|"ivory"|"stone"} color = "glaz" - Brand palette, with varied levels for individual words.
 * @attr {""|"default"|"red"|"orange"|"amber"|"yellow"|"lime"|"green"|"emerald"|"teal"|"glaz"|"cyan"|"sky"|"blue"|"indigo"|"violet"|"purple"|"fuchsia"|"pink"|"rose"|"zinc"|"ivory"|"stone"} bg-color = "glaz" - Brand palette for the shape background at level 100; an explicit empty value leaves it transparent.
 * @attr {number} scale = 1 - Positive font-size multiplier, clamped to 0.1–4; crowded clouds shrink together to fit.
 * @attr {number} rotate = 0 - Maximum word rotation in degrees, clamped to -90–90; orientations alternate between zero and both signs.
 * @accessibility The original ranked list remains available to assistive technology; the generated SVG is decorative.
 * @example
 * <tp-word-cloud shape="circle" color="glaz" bg-color="glaz" scale="1" rotate="0">
 *   <ol>
 *     <li><tp-icon name="logo-tp" aria-label="tp logo"></tp-icon></li>
 *     <li></li>
 *     <li>quizzes, playgrounds, viewers, notebooks</li>
 *     <li>simulators, plots, games</li>
 *     <li></li>
 *     <li>documentations, editors, pickers, controllers, feedbacks</li>
 *     <li>markdown, asciidoc, latex, restructuredtext</li>
 *     <li>forms, overlays, medias, times</li>
 *     <li></li>
 *     <li>utilities</li>
 *   </ol>
 * </tp-word-cloud>
 */
export declare class TpWordCloud extends TpBase {
    private observer;
    private measuredWidth;
    private resize;
    private pending;
    private svg;
    static get observedAttributes(): string[];
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private observe;
    private schedule;
    private number;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-word-cloud": TpWordCloud;
    }
}
