/**
 * @module components/animation
 * @summary Applies an animation to a target element.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
type TpAnimationTrigger = "load" | "click" | "hover" | "manual" | "intersection";
type AnimationFillMode = "none" | "forwards" | "backwards" | "both";
/**
 * `<tp-animation>` applique une animation à une cible du DOM léger.
 *
 * Le composant utilise animate.css pour les noms d'animation
 * et WAAPI pour le contrôle de lecture.
 * @tagname tp-animation
 * @attr {string} threshold = "0.1" - Visibility thresholds for the intersection trigger: one number from 0 to 1, or a comma-separated list. Invalid entries are ignored; the fallback is 0.1.
 * @attr {string} root-margin = "0px" - Viewport margin for the intersection trigger, using CSS margin syntax such as 100px or 0px 0px -20% 0px.
 * @attr {TpAnimationTrigger} trigger = "load" - Playback trigger: load, click, hover (also keyboard focus), intersection (entering the viewport), or manual (playIn()/playOut()).
 * @attr {string} target = "" - CSS selector of a descendant to animate. When absent, the first child element is used.
 * @attr {boolean} paused = false - Pauses playback when present; removing it allows the animation to resume.
 * @attr {boolean} once = false - Limits automatic click, hover/focus and intersection triggers to their first playback.
 * @attr {string} iterations = "1" - Positive number of playback cycles, or infinite for continuous repetition. Invalid values use one cycle.
 * @attr {string} out = "" - Animate.css exit animation name used by playOut(), such as fadeOut; empty means no exit animation.
 * @attr {string} in = "" - Animate.css entrance animation name, such as fadeIn; empty means no entrance animation.
 * @attr {AnimationFillMode} fill = "both" - Styles retained outside playback: none, forwards (after), backwards (during the delay), or both.
 * @attr {string} easing = "ease" - CSS timing function controlling the animation pace, for example linear, ease-in-out or cubic-bezier(0.4, 0, 0.2, 1).
 * @attr {string} duration = "1s" - Duration of one animation cycle, with an explicit time unit such as 500ms or 2s.
 * @attr {string} delay = "0s" - Wait before each animation, with an explicit time unit such as 200ms or 0.5s.
 * @accessibility Mirrors hover activation on keyboard focus.
 * @accessibility Gives a non-interactive click target button semantics and keyboard activation.
 * @accessibility Reduces Web Animations API motion to an immediate state change when the operating system requests reduced motion.
 * @accessibilityresponsibility Prefer a native interactive element, such as a button, for a click-triggered animation.
 * @keyboard {Enter / Space} Starts a click-triggered animation when its target is not a native control.
 * @example
 * <tp-animation></tp-animation>
 * @event tp-animation-start Emitted when an entrance or exit animation starts, including when immediately paused. The detail identifies the configured animation names and the phase.
 * @eventdetail tp-animation-start { in: string; out: string; phase: "in" | "out" }
 * @event tp-animation-finish Emitted after an entrance or exit animation finishes normally; cancellation does not emit finish. The detail identifies the configured animation names and the phase.
 * @eventdetail tp-animation-finish { in: string; out: string; phase: "in" | "out" }
 * @event tp-animation-cancel Emitted when cancel() cancels an existing animation, including cancellation before starting another phase. The detail contains the configured entrance and exit animation names.
 * @eventdetail tp-animation-cancel { in: string; out: string }
 */
export declare class TpAnimation extends TpBase {
    private static readonly styleId;
    private targetEl;
    private animation;
    private hasAutoPlayed;
    private intersectionObserver;
    private decoratedTarget;
    private decoratedRole;
    private decoratedTabindex;
    static get observedAttributes(): string[];
    get in(): string;
    set in(value: string);
    get out(): string;
    set out(value: string);
    get target(): string;
    set target(value: string);
    get duration(): string;
    set duration(value: string);
    get delay(): string;
    set delay(value: string);
    get iterations(): string;
    set iterations(value: string);
    get easing(): string;
    set easing(value: string);
    get fill(): AnimationFillMode;
    set fill(value: AnimationFillMode);
    get trigger(): TpAnimationTrigger;
    set trigger(value: TpAnimationTrigger);
    get paused(): boolean;
    set paused(value: boolean);
    get once(): boolean;
    set once(value: boolean);
    /**
     * Marge utilisée par IntersectionObserver.
     */
    get rootMargin(): string;
    set rootMargin(value: string);
    /**
     * Seuil utilisé par IntersectionObserver.
     * Peut être un nombre unique ou une liste séparée par des virgules.
     */
    get threshold(): string;
    set threshold(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    disconnectedCallback(): void;
    /**
     * @summary Starts the entrance animation from the beginning, like playIn(); resolves when playback finishes or is cancelled.
     */
    play(): Promise<void>;
    /**
     * @summary Cancels the current animation and plays the configured in animation. Resolves on completion or cancellation; does nothing if the target or animation name is missing.
     */
    playIn(): Promise<void>;
    /**
     * @summary Cancels the current animation and plays the configured out animation. Resolves on completion or cancellation; does nothing if the target or animation name is missing.
     */
    playOut(): Promise<void>;
    /**
     * @summary Pauses the current animation at its current time; does nothing when no animation exists.
     */
    pause(): void;
    /**
     * @summary Cancels the current animation, clears its playback reference and emits tp-animation-cancel when an animation existed.
     */
    cancel(): void;
    /**
     * @summary Starts the configured entrance animation again from the beginning; returns the same completion promise as playIn().
     */
    restart(): Promise<void>;
    private ensureStyles;
    private ensureTarget;
    private readonly handleClick;
    private readonly handleMouseEnter;
    private readonly handleKeyDown;
    private readonly handleIntersection;
    private unbindTrigger;
    private bindTrigger;
    private isNativeInteractiveTarget;
    private bindIntersectionTrigger;
    private unbindIntersectionTrigger;
    private playNamedAnimation;
    private prepareAnimateCssClasses;
    private extractKeyframesFromCssAnimationName;
    private parseTimeToMs;
    private parseIterations;
}
export {};
