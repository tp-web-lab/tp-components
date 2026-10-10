/**
 * @module components/turtle
 * @summary Turtle DSL rendering component.
 */
import { TpBase } from '../base/base.js';
/**
 * @summary Turtle DSL rendering component.
 * @tagname tp-turtle
 * @example
 * <tp-turtle></tp-turtle>
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
