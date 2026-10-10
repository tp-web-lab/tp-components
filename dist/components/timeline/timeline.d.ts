/**
 * @module components/timeline
 * @summary Chronological events arranged around a timeline.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import "../icon/icon.js";
/** Axis along which events are arranged. */
export type TpTimelineOrientation = "vertical" | "horizontal";
/**
 * Each direct `dl` describes one event using Time, Icon, Title and Content terms.
 * Icon and Content are optional. Author nodes are moved, not serialized or cloned.
 * @summary Arranges chronological events on a vertical or horizontal timeline.
 * @tagname tp-timeline
 * @attr {string} orientation = "vertical" - Timeline orientation (`vertical` or `horizontal`).
 * @accessibility Presents events as an ordered list in author order; decorative markers are hidden from assistive technology.
 * @keyboard {Tab} Focuses the horizontal event list and any interactive event content.
 * @keyboard {ArrowLeft / ArrowRight} Scrolls the focused horizontal event list left or right.
 * @example
 * <tp-timeline>
 *   <dl>
 *     <dt>Time</dt><dd>09:00</dd>
 *     <dt>Icon</dt><dd><tp-icon name="home"></tp-icon></dd>
 *     <dt>Title</dt><dd>Welcome</dd>
 *     <dt>Content</dt><dd>Meet the team and explore the project.</dd>
 *   </dl>
 *   <dl>
 *     <dt>Time</dt><dd>10:00</dd>
 *     <dt>Title</dt><dd>Workshop</dd>
 *     <dt>Content</dt><dd>Build your first component together.</dd>
 *   </dl>
 *   <dl>
 *     <dt>Time</dt><dd>12:00</dd>
 *     <dt>Title</dt><dd>Closing session</dd>
 *   </dl>
 * </tp-timeline>
 */
export declare class TpTimeline extends TpBase {
    /** Watches for event lists supplied after connection. */
    private readonly observer;
    /** Attributes whose changes affect the layout. */
    static get observedAttributes(): string[];
    /** Returns the axis, falling back to vertical for unknown values. */
    get orientation(): TpTimelineOrientation;
    /** Changes the timeline axis without recreating event content. */
    set orientation(value: TpTimelineOrientation);
    /** Installs shared styles and converts the author-provided event lists. */
    protected connectedCallback(): void;
    /** Stops watching detached content; connection resumes observation. */
    disconnectedCallback(): void;
    /** Scrolls only the focused horizontal list, leaving nested controls untouched. */
    private readonly handleKeydown;
    /** Reflects layout changes while retaining event nodes and their state. */
    protected attributeChangedCallback(): void;
    /** Applies the effective orientation and makes horizontal overflow keyboard-scrollable. */
    private updateOrientation;
    /** Consumes complete event lists and retains invalid author content with a diagnostic. */
    private renderEntries;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-timeline": TpTimeline;
    }
}
