/** @module components/wari
 * @summary Interactive Oware Abapa positions, sowing and endgames.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-chronometer
 * @summary Chronometer component with play, pause and stop controls.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import { type WariPlayMode, type WariPosition, type WariSide } from "./wari-model.js";
export type { WariMove, WariPlayMode, WariPosition, WariSide, } from "./wari-model.js";
/**
 * The custom `<tp-wari>` element displays Oware Abapa positions and plays out games and endgames.
 *
 * @summary Displays Oware Abapa positions and plays out games and endgames.
 * @tagname tp-wari
 * @attr {string} position = "S:4,4,4,4,4,4,4,4,4,4,4,4:0,0" - Side to move, twelve pit counts in sowing order, and South/North scores.
 * @attr {"south" | "north"} orientation = "south" - Side displayed at the bottom.
 * @attr {boolean} interactive = false - Enables human moves by clicking, tapping or keyboard.
 * @event tp-wari-change Emitted after loading, playing or navigating a position.
 * @eventdetail tp-wari-change { position: string; pits: number[]; scores: number[]; turn: string }
 * @event tp-wari-move Emitted after a complete sowing turn and its captures.
 * @eventdetail tp-wari-move { number: number; side: string; from: number; to: number; seeds: number; path: number[]; captures: { pit: number; seeds: number }[]; grandSlam: boolean; collected: number[]; before: string; after: string }
 * @event tp-wari-end Emitted when a played move ends the game.
 * @eventdetail tp-wari-end { position: string; result: string }
 * @event tp-wari-error Emitted for invalid positions or play parameters; the previous game remains unchanged.
 * @eventdetail tp-wari-error { message: string }
 * @keyboard Arrow keys Move focus between pits in the displayed direction.
 * @keyboard Enter / Space Sow the seeds of the focused legal pit when human input is enabled.
 * @accessibility Numbered pit buttons expose seed counts and legal moves; scores and game status have text alternatives.
 * @see tp-chess - Explore chess positions with the same playback controls.
 * @see tp-checkers - Explore international draughts positions with the same playback controls.
 * @example
 * <tp-wari interactive=""></tp-wari>
 */
export declare class TpWari extends TpBase {
    static get observedAttributes(): string[];
    private game;
    private initialPosition;
    private future;
    private initialized;
    private reflecting;
    private mode;
    private userSide;
    private delay;
    private timer?;
    private board?;
    private sidebar?;
    private status?;
    private scoresPanel?;
    private focusPit;
    private highlighted;
    private message;
    /** Serialized current position. Loading a position starts a new history. */
    get position(): string;
    set position(value: string);
    /** Side displayed at the bottom; does not change the active side. */
    get orientation(): WariSide;
    set orientation(value: WariSide);
    /** Enables clicking, tapping and keyboard play. API moves remain available when false. */
    get interactive(): boolean;
    set interactive(value: boolean);
    /** Independent South/North captured-seed totals, including any final collection. */
    get scores(): [number, number];
    /** Side whose turn it is. */
    get turn(): WariSide;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Loads the standard four-seeds-per-pit starting position. */
    start(): void;
    /** Loads a serialized position or an object with twelve pits, two scores and a turn. Invalid input preserves the previous game. */
    setPosition(value: string | WariPosition): boolean;
    /** Restores the loaded exercise, clearing recorded moves. */
    reset(): void;
    /** Empties the board and scores and stops play. */
    clear(): void;
    /** Reverses the view without changing the active or human side. */
    flip(): void;
    /** Returns all playable pit numbers (1–12), including compulsory feeding restrictions. */
    legalMoves(): number[];
    /** Tests whether a pit can be sown without changing the position. */
    legalMove(pit: number): boolean;
    /** Highlights and returns legal pits. Pass false to clear highlights. */
    highlightLegalMove(show?: boolean): number[];
    /** Sows one pit and applies captures and end-of-game collection. Returns false for illegal input. */
    move(pit: number): boolean;
    /** Starts user/random or random/random play. Default delay is 2000 ms; allowed range is 100–60000 ms. */
    play(mode?: WariPlayMode, userSide?: WariSide, delay?: number): boolean;
    /** Stops automatic play while preserving the current board and recorded continuation. */
    stop(): void;
    /** Pauses playback without discarding history. */
    pause(): void;
    /** Returns to the loaded beginning, retaining recorded moves for replay. */
    rewind(): void;
    /** Undoes one complete turn, restoring seeds, scores and repetition state. */
    previousMove(): boolean;
    /** Replays one recorded move, or chooses one random legal move at the end of the recording. */
    nextMove(): boolean;
    /** Replays the continuation and then plays randomly until the game ends or is paused. */
    playToEnd(): boolean;
    private advance;
    private navigated;
    private sync;
    private changed;
    private emit;
    private fail;
    private humanTurn;
    private schedule;
    private build;
    private order;
    private describe;
    private render;
    private mark;
    private key;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-wari": TpWari;
    }
}
