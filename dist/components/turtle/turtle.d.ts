/**
 * @module components/turtle
 * @summary Turtle DSL rendering component.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-turtle>` element provides a turtle DSL rendering component.
 *
 * @summary Provides a turtle DSL rendering component.
 * @tagname tp-turtle
 * @attr {string} download-name = "" - Filename for SVG downloads. The .svg extension is appended when missing; empty uses turtle.svg.
 * @attr {string} save-label = "" - Text of the SVG download button; empty uses Save SVG.
 * @attr {string} replay-label = "" - Text of the button that replays the drawing commands; empty uses Replay.
 * @attr {string} label = "" - Optional caption displayed below the drawing.
 * @attr {string} background = "" - CSS color of the drawing background, or transparent.
 * @attr {string} height = "" - Drawing coordinate height as a number; also determines the SVG aspect ratio. Use a positive value for a visible drawing.
 * @attr {string} width = "" - Drawing coordinate width as a number; also determines the SVG aspect ratio. Use a positive value for a visible drawing. The SVG remains responsive.
 * @attr {string} src = "" - URL of a Turtle program; takes precedence over the inline tp/turtle script.
 * @example
 * <tp-turtle width="420" height="220" label="A square">
 *     <script type="tp/turtle">
 *       turtle x=0 y=0 heading=0 speed=6
 *       forward 80
 *       right 90
 *       forward 80
 *       right 90
 *       forward 80
 *       right 90
 *       forward 80
 *     </script>
 *   </tp-turtle>
 */
export declare class TpTurtle extends TpBase {
    private abortController;
    private lastExpanded;
    private lastWidth;
    private lastHeight;
    private lastBackground;
    private renderToken;
    private replayTimer;
    private readonly source;
    static get observedAttributes(): string[];
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private render;
    private renderWithToolbar;
    private replayCurrentProgram;
    private downloadCurrentSvg;
    private stopReplay;
    private renderSvgFromLines;
    private ensureResponsiveSvg;
    private getSaveLabel;
    private getReplayLabel;
    private getDownloadName;
    private readProgramSource;
    private readNumberAttr;
}
