/** @module components/lsystem */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../save-image/save-image.js";
/**
 * @summary renders L-system fractals and explores their successive rewriting iterations.
 * @tagname tp-lsystem
 * @attr {string} src = "" - Source file; takes precedence over the internal script and preset.
 * @attr {"fractal-tree"|"barnsley-fern"|"koch-curve"|"dragon-curve"|"hilbert-curve"|"peano-curve"|"levy-c-curve"|"gosper-curve"|"pythagoras-tree"|"sierpinski-triangle"|"sierpinski-carpet"|"sierpinski-arrowhead"|"sierpinski-gasket"|"sierpinski-tetrahedron"} preset = "koch-curve" - Built-in definition used when no source is supplied.
 * @attr {string} iterations = "" - Optional iteration override from 0 to 12; empty uses the source or preset value.
 * @attr {string} angle = "" - Optional turning-angle override in degrees; empty uses the definition.
 * @attr {string} step = "" - Optional positive drawing-step override; empty uses the definition.
 * @attr {number} interval = 1000 - Milliseconds between playback iterations, at least 100.
 * @attr {string} label = "L-system" - Visible caption and accessible SVG name.
 * @event tp-lsystem-rendered Emitted after an iteration has been drawn.
 * @eventdetail tp-lsystem-rendered { iteration: number; iterations: number }
 * @keyboard Tab / Shift+Tab - Move between the playback and export controls.
 * @keyboard Enter / Space - Activate the focused control.
 * @accessibility Named SVG, native button interactions through tp-button, and an announced iteration counter.
 * @accessibilityresponsibility Supply a meaningful label and explain the mathematical construction in adjacent text.
 * @example
 * <tp-lsystem label="Koch curve">
 *   <script type="tp/lsystem">
 *     axiom: F
 *     iterations: 3
 *     angle: 60
 *     rule: F => F+F--F+F
 *   </script>
 * </tp-lsystem>
 */
export declare class TpLsystem extends TpBase {
    /** Unique anchor identifiers for independent export controls. */
    private static nextId;
    /** Source snapshot shared with other content-driven components. */
    private readonly source;
    /** Current parsed definition, cleared during loading or after a failure. */
    private definition;
    /** Currently displayed rewriting depth. */
    private iteration;
    /** Playback interval; null when paused. */
    private timer;
    /** Deferred initial render and grouped attribute updates. */
    private pending;
    /** Cancels an obsolete source request. */
    private request;
    /** Invalidates asynchronous work when attributes change or the element disconnects. */
    private revision;
    /** Current generated SVG, also used by export consumers. */
    private svg;
    /** Export target unique to this instance. */
    private readonly viewportId;
    /** Attributes affecting the definition, presentation or playback. */
    static get observedAttributes(): string[];
    /** Initializes common styling and waits for parser-inserted script content. */
    protected connectedCallback(): void;
    /** Cancels timers, requests and source observation without losing the author snapshot. */
    disconnectedCallback(): void;
    /** Rebuilds only for local attributes, not inherited presentation changes. */
    protected attributeChangedCallback(name: string): void;
    /** Coalesces attribute changes and prevents old playback or responses from taking effect. */
    private schedule;
    /** Reads a finite numeric override, preserving the definition when the attribute is empty. */
    private number;
    /** Reads the shared source, then falls back to a named preset, and renders the final iteration. */
    private load;
    /** Converts the current generation to accessible SVG using the shared engine. */
    private draw;
    /** Stops playback and reports a failure as text, never as injected markup. */
    private fail;
    /** Dispatches toolbar actions while preserving focus on the original buttons. */
    private readonly handleClick;
    /** Advances one iteration; reaching the limit restarts at the axiom on the next step. */
    step(): void;
    /** Starts user-requested playback, stopping at the final iteration without looping. */
    play(): void;
    /** Pauses playback without changing the displayed iteration. */
    pause(): void;
    /** Pauses and restores iteration zero, the unexpanded axiom. */
    reset(): void;
    /** Returns the current standalone SVG for export integrations. */
    exportSvg(): string;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-lsystem": TpLsystem;
    }
}
