/**
 * @module components/alarm
 * @summary Alarm component with stop control and optional ring.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { TpBase } from "../base/base.js";
/**
 * Alarm component.
 *
 * The alarm triggers when local time matches the `time` attribute.
 *
 * @tagname tp-alarm
 * @attr {string} time = "07:00" - Alarm time in `HH:MM` or `HH:MM:SS`.
 * @attr {string} size = "1rem" - Icon and text size.
 * @attr {boolean} silent = false - Disables sound playback.
 * @cssprop --tp-alarm-size Icon and text size.
 * @event tp-alarm-trigger Emitted when the alarm is triggered.
 * @eventdetail tp-alarm-trigger void
 * @example
 * <tp-alarm></tp-alarm>
 */
export declare class TpAlarm extends TpBase {
    private static readonly styleId;
    private static readonly ringCount;
    private static readonly ringGapMs;
    private checkTimer;
    private ringTimeouts;
    private displayEl;
    private timeInputEl;
    private alarmIconEl;
    private lastTriggerKey;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Returns the configured alarm time.
     *
     * @summary Returns the configured alarm time string.
     */
    get time(): string;
    /**
     * Updates the configured alarm time.
     *
     * @summary Sets the alarm time string.
     * @param value Time value to apply.
     */
    set time(value: string);
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
     * Initializes the alarm when the element is connected.
     *
     * @summary Connects the alarm component.
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
     * Stops timers and ringing when the element is disconnected.
     *
     * @summary Disconnects the alarm component.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Creates and caches the internal alarm UI.
     *
     * @summary Ensures the internal alarm DOM exists.
     */
    private ensureDom;
    /**
     * Starts periodic alarm-time checks.
     *
     * @summary Starts the alarm polling loop.
     */
    private startChecking;
    /**
     * Stops periodic alarm-time checks.
     *
     * @summary Stops the alarm polling loop.
     */
    private stopChecking;
    /**
     * Compares the current time to the configured alarm time.
     *
     * @summary Checks whether the alarm should trigger.
     */
    private checkAlarm;
    /**
     * Marks the alarm as active and schedules ringing.
     *
     * @summary Triggers the alarm state and audio feedback.
     */
    private triggerAlarm;
    /**
     * Starts alarm monitoring after a manual resume.
     *
     * @summary Restarts alarm monitoring.
     */
    private startAlarm;
    /**
     * Stops alarm monitoring and clears any active alert.
     *
     * @summary Stops the alarm and clears its active state.
     */
    private stopAlarm;
    /**
     * Clears the current alert state and optionally marks the alarm as stopped.
     *
     * @summary Clears the active alert state.
     * @param markStopped Whether to add the stopped state marker.
     */
    private clearAlert;
    /**
     * Cancels every scheduled ring timeout.
     *
     * @summary Stops any pending ringing sequence.
     */
    private stopRinging;
    /**
     * Plays a short bell tone through the Web Audio API.
     *
     * @summary Plays one alarm bell tone.
     */
    private playBell;
    /**
     * Parses a clock time formatted as `HH:MM` or `HH:MM:SS`.
     *
     * @summary Parses the configured alarm time.
     * @param value Raw time string to parse.
     * @returns Parsed time parts or `null` when the value is invalid.
     */
    private parseAlarmTime;
    /**
     * Refreshes the displayed time and icon size.
     *
     * @summary Updates the alarm UI state.
     */
    private updateDisplay;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-alarm": TpAlarm;
    }
}
