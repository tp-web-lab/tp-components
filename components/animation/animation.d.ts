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
 * @accessibility Mirrors hover activation on keyboard focus.
 * @accessibility Gives a non-interactive click target button semantics and keyboard activation.
 * @accessibility Reduces Web Animations API motion to an immediate state change when the operating system requests reduced motion.
 * @accessibilityresponsibility Prefer a native interactive element, such as a button, for a click-triggered animation.
 * @keyboard {Enter / Space} Starts a click-triggered animation when its target is not a native control.
 * @example
 * <tp-animation></tp-animation>
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
    play(): Promise<void>;
    playIn(): Promise<void>;
    playOut(): Promise<void>;
    pause(): void;
    cancel(): void;
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
