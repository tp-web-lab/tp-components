/**
 * @module components/game-life
 * @summary Conway's Game of Life component.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../button-group/button-group.js";
/**
 * @summary Conway's Game of Life component.
 * @tagname tp-game-life
 * @attr {string} wrap = "" - Connects opposite grid edges so cells at a boundary interact with cells on the opposite side.
 * @attr {string} steps = "" - Number of generations to compute before the first display and after reset. Zero or a negative value keeps the starting grid.
 * @attr {string} preset-y = "" - Integer vertical offset of the preset pattern in grid cells; defaults to the preset position.
 * @attr {string} preset-x = "" - Integer horizontal offset of the preset pattern in grid cells; defaults to the preset position.
 * @attr {string} preset-width = "" - Positive number of grid columns when using preset; absent or invalid uses that preset's width.
 * @attr {string} preset-height = "" - Positive number of grid rows when using preset; absent or invalid uses that preset's height.
 * @attr {string} preset = "" - Built-in starting pattern: glider, blinker, toad, beacon or gosper-gun. An inline tp/game-life program takes precedence.
 * @attr {string} padding = "" - Space around the grid in SVG units; negative values are clamped to zero.
 * @attr {string} label = "" - Optional title displayed above the game controls.
 * @attr {string} interval = "" - Delay between automatic generations in milliseconds, clamped to at least 16.
 * @attr {string} grid-stroke-width = "" - Width of the grid lines in SVG units, clamped to at least 0.1.
 * @attr {string} grid-color = "" - SVG stroke color of the cell grid lines.
 * @attr {string} cell-size = "" - Width and height of each cell in SVG units, clamped to at least 1.
 * @attr {string} cell-radius = "" - Corner radius of each cell in SVG units; negative values are clamped to zero.
 * @attr {string} autoplay = "" - Starts automatic generation playback after initialization or reset when present.
 * @attr {string} background = "" - SVG background color behind the grid.
 * @attr {string} dead-color = "" - SVG fill color for dead cells.
 * @attr {string} alive-color = "" - SVG fill color for living cells.
 * @example
 * <tp-game-life></tp-game-life>
 */
export declare class TpGameLife extends TpBase {
    private static readonly gameLifeStyleId;
    private currentGrid;
    private renderToken;
    private autoplayTimer;
    static get observedAttributes(): string[];
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private hasBoolAttr;
    private readIntAttr;
    private readPositiveIntAttr;
    private readNumberAttr;
    private readStringAttr;
    private getPresetName;
    private buildPresetProgram;
    private readProgramSource;
    private readSvgOptions;
    private renderWithToolbar;
    private stepOnce;
    private startAutoplay;
    private stopAutoplay;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-game-life": TpGameLife;
    }
}
