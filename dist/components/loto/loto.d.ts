/**
 * @module components/loto
 * @summary French loto game with a random ticket and number draw.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-chronometer
 * @summary Chronometer component with play, pause and stop controls.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
import { TpBase } from "../base/base.js";
import "../chronometer/chronometer.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
/** Information emitted after a loto draw. */
export interface TpLotoDrawDetail {
    number: number;
}
/**
 * Displays a French loto ticket and draws numbers from 1 to 90.
 *
 * @summary Displays a playable French loto game.
 * @tagname tp-loto
 * @attr {number} cards = 1 - Number of loto tickets displayed, from 1 to 4.
 * @event tp-loto-draw Emitted after a number is drawn.
 * @eventdetail tp-loto-draw { number: number }
 * @event tp-loto-reset Emitted after a new ticket and draw are generated.
 * @event tp-loto-win Emitted when every displayed ticket number has been drawn.
 * @cssprop --tp-game-cell-size Size of a ticket cell.
 * @example
 * <tp-loto></tp-loto>
 */
export declare class TpLoto extends TpBase {
    private static readonly styleId;
    private tickets;
    private drawPile;
    private drawnNumbers;
    private chronometerStarted;
    private completed;
    private rendered;
    static get observedAttributes(): string[];
    get cards(): number;
    set cards(value: number);
    protected connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Generates a new ticket and resets the draw and chronometer. */
    reset(): void;
    /** Draws and returns the next number, or null when the game is over. */
    draw(): number | null;
    private get chronometer();
    private get ticketNumbers();
    private renderShell;
    private renderGame;
    private createTicket;
    private shuffle;
}
