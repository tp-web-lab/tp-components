/**
 * @module components/mastermind
 * @summary Interactive Mastermind game component.
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
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import "../chronometer/chronometer.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
/**
 * Displays an interactive Mastermind game.
 *
 * @summary Displays an interactive Mastermind game.
 * @tagname tp-mastermind
 *
 * @attr {string} solution = "" - Secret color sequence separated by spaces or commas.
 * @attr {string} colors = "red blue green yellow orange purple" - Available colors separated by spaces or commas.
 * @attr {number} attempts = 10 - Maximum number of guesses.
 *
 * @example
 * <tp-mastermind></tp-mastermind>
 */
export declare class TpMastermind extends TpBase {
    private static readonly styleId;
    private solution;
    private colors;
    private maxAttempts;
    private guesses;
    private feedback;
    private currentAttempt;
    private outcome;
    private selectedColor;
    private history;
    private historyIndex;
    private chronometerStarted;
    private readonly assistTriggerId;
    protected connectedCallback(): void;
    private readConfiguration;
    private parseColors;
    private resetState;
    private createSnapshot;
    private restoreSnapshot;
    private pushHistory;
    private render;
    private renderRow;
    private attachEventListeners;
    private setPeg;
    private checkGuess;
    private scoreGuess;
    private undo;
    private redo;
    private applyAssist;
    private resetGame;
    private resetWithNewCode;
    private statusText;
    private setStatusMessage;
    private renderError;
}
