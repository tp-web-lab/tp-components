/**
 * @module components/timer
 * @summary Countdown timer with stop control and optional ring.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { TpBase } from "../base/base.js";
/**
 * Countdown timer component.
 *
 * @tagname tp-timer
 * @attr {number} duration = 60 - Countdown duration in seconds.
 * @attr {string} size = "1rem" - Icon and text size.
 * @attr {boolean} silent = false - Disables sound playback.
 * @cssprop --tp-timer-size Icon and text size.
 * @event tp-timer-elapsed Emitted when the countdown reaches zero.
 * @eventdetail tp-timer-elapsed void
 * @example
 * <tp-timer></tp-timer>
 */
export declare class TpTimer extends TpBase {
    private static readonly styleId;
    private static readonly ringCount;
    private static readonly ringGapMs;
    private countdownTimer;
    private ringTimeouts;
    private endTimestampMs;
    private remainingMs;
    private displayEl;
    private durationInputEl;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Returns the configured countdown duration in seconds.
     *
     * @summary Returns the configured countdown duration.
     */
    get duration(): number;
    /**
     * Updates the configured countdown duration in seconds.
     *
     * @summary Sets the countdown duration.
     * @param value Duration to apply, in seconds.
     */
    set duration(value: number);
    /**
     * Returns the configured component size.
     *
     * @summary Returns the configured size value.
     */
    get size(): string;
    /**
     * Updates the configured component size.
     *
     * @summary Sets the configured size value.
     * @param value Size value to apply.
     */
    set size(value: string);
    /**
     * Returns whether sound playback is disabled.
     *
     * @summary Returns the silent state.
     */
    get silent(): boolean;
    /**
     * Enables or disables sound playback.
     *
     * @summary Sets the silent state.
     * @param value Silent state to apply.
     */
    set silent(value: boolean);
    /**
     * Initializes the timer when the element is connected.
     *
     * @summary Connects the timer component.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Handles observed attribute changes.
     * @param name Updated attribute name.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * Stops active timers and ringing when the element is disconnected.
     *
     * @summary Disconnects the timer component.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Creates and caches the internal timer UI.
     *
     * @summary Ensures the internal timer DOM exists.
     */
    private ensureDom;
    /**
     * Starts the active countdown interval.
     *
     * @summary Starts the countdown loop.
     */
    private startCountdown;
    /**
     * Stops the active countdown interval.
     *
     * @summary Stops the countdown loop.
     */
    private stopCountdown;
    /**
     * Advances the countdown and emits the elapsed event when it reaches zero.
     *
     * @summary Updates the countdown state on each tick.
     */
    private tickCountdown;
    /**
     * Resets the countdown to its full configured duration.
     *
     * @summary Resets the countdown state.
     */
    private resetCountdown;
    /**
     * Stops the countdown and resets the timer immediately.
     *
     * @summary Stops and resets the timer.
     */
    private stopAndReset;
    /**
     * Restarts the timer from the configured duration.
     *
     * @summary Starts a new countdown from the beginning.
     */
    private startFromBeginning;
    /**
     * Schedules the ringing sequence that plays after the countdown elapses.
     *
     * @summary Starts the elapsed ringing sequence.
     */
    private startRinging;
    /**
     * Cancels every scheduled ring timeout.
     *
     * @summary Stops any pending ringing sequence.
     */
    private stopRinging;
    /**
     * Plays one short bell tone through the Web Audio API.
     *
     * @summary Plays a single timer bell tone.
     */
    private playBell;
    /**
     * Refreshes the displayed time and input value.
     *
     * @summary Updates the timer UI state.
     */
    private updateDisplay;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-timer": TpTimer;
    }
}
