/**
 * @module components/chronometer
 * @summary Chronometer component with play, pause and stop controls.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { TpBase } from "../base/base.js";
/**
 * Chronometer component.
 *
 * @tagname tp-chronometer
 * @attr {string} size = "1rem" - Icon and text size.
 * @cssprop --tp-chronometer-size Icon and text size.
 * @example
 * <tp-chronometer></tp-chronometer>
 */
export declare class TpChronometer extends TpBase {
    private static readonly styleId;
    private tickTimer;
    private startedAtMs;
    private elapsedMs;
    private displayEl;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
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
     * Initializes the chronometer when the element is connected.
     *
     * @summary Connects the chronometer component.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Refreshes the chronometer after an observed attribute change.
     *
     * @summary Handles observed attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Stops active ticking when the element is disconnected.
     *
     * @summary Disconnects the chronometer component.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Creates and caches the internal chronometer UI.
     *
     * @summary Ensures the internal chronometer DOM exists.
     */
    private ensureDom;
    /**
     * Starts time accumulation and periodic display refresh.
     *
     * @summary Starts the chronometer.
     */
    play(): void;
    /**
     * Pauses time accumulation while preserving the elapsed value.
     *
     * @summary Pauses the chronometer.
     */
    pause(): void;
    /**
     * Stops the chronometer and resets the elapsed value to zero.
     *
     * @summary Stops and resets the chronometer.
     */
    stop(): void;
    /**
     * Stops the active refresh interval.
     *
     * @summary Stops the chronometer refresh ticker.
     */
    private stopTicking;
    /**
     * Refreshes the formatted elapsed time.
     *
     * @summary Updates the chronometer UI state.
     */
    private updateDisplay;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-chronometer": TpChronometer;
    }
}
