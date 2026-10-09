/**
 * @module components/clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */
import '../tooltip/tooltip.js';
import { TpBase } from '../base/base.js';
/**
 * Live clock component.
 *
 * The component renders local time and keeps itself updated every second.
 * The `type` attribute controls whether the display is `digital` or `analogic`.
 * The date is exposed through an attached `<tp-tooltip>`.
 *
 * @tagname tp-clock
 * @attr {string} type = "digital" - Display type (`digital` or `analogic`).
 * @attr {string} size = "1rem" - Clock size.
 * @cssprop --tp-clock-size Clock size.
 * @example
 * <tp-clock></tp-clock>
 */
export declare class TpClock extends TpBase {
    private static readonly styleId;
    private tickTimer;
    private timeEl;
    private tooltipEl;
    private digitalAnchorId;
    private analogicAnchorId;
    private hourHandEl;
    private minuteHandEl;
    private secondHandEl;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
    */
    static get observedAttributes(): string[];
    /**
     * Returns the configured clock display type.
     *
     * @summary Returns the current clock display type.
     */
    get type(): 'digital' | 'analogic';
    /**
     * Updates the configured clock display type.
     *
     * @summary Sets the clock display type.
     * @param value Display type to apply.
     */
    set type(value: 'digital' | 'analogic');
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
     * Initializes the clock when the element is connected.
     *
     * @summary Connects the clock component.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Refreshes the clock after an observed attribute changes.
     *
     * @summary Handles observed attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Stops the clock ticker when the element is disconnected.
     *
     * @summary Disconnects the clock component.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Creates and caches the internal DOM structure for digital and analog views.
     *
     * @summary Ensures the internal clock DOM exists.
     */
    private ensureDom;
    /**
     * Starts the one-second refresh ticker.
     *
     * @summary Starts the clock refresh ticker.
     */
    private startTicker;
    /**
     * Stops the one-second refresh ticker.
     *
     * @summary Stops the clock refresh ticker.
     */
    private stopTicker;
    /**
     * Refreshes the visible time, tooltip date, and analog hands.
     *
     * @summary Updates the clock UI state.
     */
    private updateClock;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-clock': TpClock;
    }
}
