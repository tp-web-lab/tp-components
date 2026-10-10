/**
 * @module components/game-life
 * @summary Conway's Game of Life component.
 */
import { TpBase } from '../base/base.js';
import '../button/button.js';
import '../button-group/button-group.js';
/**
 * @summary Conway's Game of Life component.
 * @tagname tp-game-life
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
        'tp-game-life': TpGameLife;
    }
}
