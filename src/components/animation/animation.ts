/**
 * @module components/animation
 * @summary Applies an animation to a target element.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./animation.css?inline";

type TpAnimationTrigger =
	| "load"
	| "click"
	| "hover"
	| "manual"
	| "intersection";

type AnimationFillMode = "none" | "forwards" | "backwards" | "both";

function isTrigger(value: string): value is TpAnimationTrigger {
	return (
		value === "load" ||
		value === "click" ||
		value === "hover" ||
		value === "manual" ||
		value === "intersection"
	);
}

function isFillMode(value: string): value is AnimationFillMode {
	return (
		value === "none" ||
		value === "forwards" ||
		value === "backwards" ||
		value === "both"
	);
}

function parseThreshold(value: string | null): number | number[] {
	if (value === null || value.trim() === "") {
		return 0.1;
	}

	const parts = value
		.split(",")
		.map((part) => Number(part.trim()))
		.filter((part) => Number.isFinite(part) && part >= 0 && part <= 1);

	if (parts.length === 0) {
		return 0.1;
	}

	return parts.length === 1 && parts[0] !== undefined ? parts[0] : parts;
}

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
export class TpAnimation extends TpBase {
	private static readonly styleId = "tp-animation-styles";

	private targetEl: HTMLElement | null = null;
	private animation: Animation | null = null;
	private hasAutoPlayed = false;
	private intersectionObserver: IntersectionObserver | null = null;
	private decoratedTarget: HTMLElement | null = null;
	private decoratedRole: string | null = null;
	private decoratedTabindex: string | null = null;

	public static get observedAttributes(): string[] {
		return [
			"in",
			"out",
			"duration",
			"delay",
			"iterations",
			"easing",
			"fill",
			"trigger",
			"paused",
			"once",
			"target",
			"root-margin",
			"threshold",
		];
	}

	public get in(): string {
		return this.getAttribute("in") ?? "";
	}

	public set in(value: string) {
		if (value === "") {
			this.removeAttribute("in");
			return;
		}

		this.setAttribute("in", value);
	}

	public get out(): string {
		return this.getAttribute("out") ?? "";
	}

	public set out(value: string) {
		if (value === "") {
			this.removeAttribute("out");
			return;
		}

		this.setAttribute("out", value);
	}

	public get target(): string {
		return this.getAttribute("target") ?? "";
	}

	public set target(value: string) {
		if (value === "") {
			this.removeAttribute("target");
			return;
		}

		this.setAttribute("target", value);
	}

	public get duration(): string {
		return this.getAttribute("duration") ?? "1s";
	}

	public set duration(value: string) {
		this.setAttribute("duration", value);
	}

	public get delay(): string {
		return this.getAttribute("delay") ?? "0s";
	}

	public set delay(value: string) {
		this.setAttribute("delay", value);
	}

	public get iterations(): string {
		return this.getAttribute("iterations") ?? "1";
	}

	public set iterations(value: string) {
		this.setAttribute("iterations", value);
	}

	public get easing(): string {
		return this.getAttribute("easing") ?? "ease";
	}

	public set easing(value: string) {
		this.setAttribute("easing", value);
	}

	public get fill(): AnimationFillMode {
		const value = this.getAttribute("fill");
		return value !== null && isFillMode(value) ? value : "both";
	}

	public set fill(value: AnimationFillMode) {
		this.setAttribute("fill", value);
	}

	public get trigger(): TpAnimationTrigger {
		const value = this.getAttribute("trigger");
		return value !== null && isTrigger(value) ? value : "load";
	}

	public set trigger(value: TpAnimationTrigger) {
		this.setAttribute("trigger", value);
	}

	public get paused(): boolean {
		return this.hasAttribute("paused");
	}

	public set paused(value: boolean) {
		if (value) {
			this.setAttribute("paused", "");
			return;
		}

		this.removeAttribute("paused");
	}

	public get once(): boolean {
		return this.hasAttribute("once");
	}

	public set once(value: boolean) {
		if (value) {
			this.setAttribute("once", "");
			return;
		}

		this.removeAttribute("once");
	}

	/**
	 * Marge utilisée par IntersectionObserver.
	 */
	public get rootMargin(): string {
		return this.getAttribute("root-margin") ?? "0px";
	}

	public set rootMargin(value: string) {
		this.setAttribute("root-margin", value);
	}

	/**
	 * Seuil utilisé par IntersectionObserver.
	 * Peut être un nombre unique ou une liste séparée par des virgules.
	 */
	public get threshold(): string {
		return this.getAttribute("threshold") ?? "0.1";
	}

	public set threshold(value: string) {
		this.setAttribute("threshold", value);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureTarget();
		this.bindTrigger();
		this.bindIntersectionTrigger();

		if (this.trigger === "load" && (!this.once || !this.hasAutoPlayed)) {
			this.hasAutoPlayed = true;
			void this.playIn();
		}
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected) {
			return;
		}

		if (name === "trigger" && oldValue !== newValue && newValue !== "load") {
			this.hasAutoPlayed = false;
		}

		this.unbindTrigger();
		this.ensureTarget();
		this.bindTrigger();
		this.unbindIntersectionTrigger();
		this.bindIntersectionTrigger();

		if (this.paused) {
			this.pause();
		}
	}

	public disconnectedCallback(): void {
		super.connectedCallback();
		this.cancel();
		this.unbindTrigger();
		this.unbindIntersectionTrigger();
	}

	public play(): Promise<void> {
		return this.playIn();
	}

	public async playIn(): Promise<void> {
		await this.playNamedAnimation(this.in, "in");
	}

	public async playOut(): Promise<void> {
		await this.playNamedAnimation(this.out, "out");
	}

	public pause(): void {
		this.animation?.pause();
	}

	public cancel(): void {
		if (this.animation !== null) {
			this.animation.cancel();
			this.dispatchEvent(
				new CustomEvent("tp-animation-cancel", {
					bubbles: true,
					detail: {
						in: this.in,
						out: this.out,
					},
				}),
			);
			this.animation = null;
		}
	}

	public restart(): Promise<void> {
		return this.playIn();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpAnimation.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpAnimation.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private ensureTarget(): void {
		const allMarked = this.querySelectorAll("[data-tp-animation-target]");
		for (const element of allMarked) {
			element.removeAttribute("data-tp-animation-target");
		}

		if (this.target !== "") {
			this.targetEl = this.querySelector<HTMLElement>(this.target);
		} else {
			const firstElementChild = Array.from(this.childNodes).find(
				(node): node is HTMLElement => node instanceof HTMLElement,
			);

			this.targetEl = firstElementChild ?? null;
		}

		this.targetEl?.setAttribute("data-tp-animation-target", "");
	}

	private readonly handleClick = (): void => {
		if (this.once && this.hasAutoPlayed) {
			return;
		}

		this.hasAutoPlayed = true;
		void this.playIn();
	};

	private readonly handleMouseEnter = (): void => {
		if (this.once && this.hasAutoPlayed) {
			return;
		}

		this.hasAutoPlayed = true;
		void this.playIn();
	};

	private readonly handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		this.handleClick();
	};

	private readonly handleIntersection = (
		entries: IntersectionObserverEntry[],
	): void => {
		for (const entry of entries) {
			if (!entry.isIntersecting) {
				continue;
			}

			if (this.once && this.hasAutoPlayed) {
				continue;
			}

			this.hasAutoPlayed = true;
			void this.playIn();

			if (this.once) {
				this.unbindIntersectionTrigger();
			}
		}
	};

	private unbindTrigger(): void {
		this.targetEl?.removeEventListener("click", this.handleClick);
		this.targetEl?.removeEventListener("mouseenter", this.handleMouseEnter);
		this.targetEl?.removeEventListener("focus", this.handleMouseEnter);
		this.targetEl?.removeEventListener("keydown", this.handleKeyDown);

		if (this.decoratedTarget !== null) {
			if (this.decoratedRole === null)
				this.decoratedTarget.removeAttribute("role");
			else this.decoratedTarget.setAttribute("role", this.decoratedRole);

			if (this.decoratedTabindex === null) {
				this.decoratedTarget.removeAttribute("tabindex");
			} else {
				this.decoratedTarget.setAttribute("tabindex", this.decoratedTabindex);
			}
		}

		this.decoratedTarget = null;
		this.decoratedRole = null;
		this.decoratedTabindex = null;
	}

	private bindTrigger(): void {
		if (this.targetEl === null) {
			return;
		}

		if (this.trigger === "click") {
			this.targetEl.addEventListener("click", this.handleClick);

			if (!this.isNativeInteractiveTarget(this.targetEl)) {
				this.decoratedTarget = this.targetEl;
				this.decoratedRole = this.targetEl.getAttribute("role");
				this.decoratedTabindex = this.targetEl.getAttribute("tabindex");
				this.targetEl.setAttribute("role", "button");
				this.targetEl.tabIndex = 0;
				this.targetEl.addEventListener("keydown", this.handleKeyDown);
			}
		}

		if (this.trigger === "hover") {
			if (!this.isNativeInteractiveTarget(this.targetEl)) {
				this.decoratedTarget = this.targetEl;
				this.decoratedRole = this.targetEl.getAttribute("role");
				this.decoratedTabindex = this.targetEl.getAttribute("tabindex");
				this.targetEl.tabIndex = 0;
			}
			this.targetEl.addEventListener("mouseenter", this.handleMouseEnter);
			this.targetEl.addEventListener("focus", this.handleMouseEnter);
		}
	}

	private isNativeInteractiveTarget(target: HTMLElement): boolean {
		return target.matches(
			'button, a[href], input, select, textarea, summary, details, [contenteditable="true"], tp-button, tp-icon-button',
		);
	}

	private bindIntersectionTrigger(): void {
		if (
			this.trigger !== "intersection" ||
			this.targetEl === null ||
			typeof IntersectionObserver === "undefined"
		) {
			return;
		}

		this.intersectionObserver = new IntersectionObserver(
			this.handleIntersection,
			{
				root: null,
				rootMargin: this.rootMargin,
				threshold: parseThreshold(this.getAttribute("threshold")),
			},
		);

		this.intersectionObserver.observe(this.targetEl);
	}

	private unbindIntersectionTrigger(): void {
		this.intersectionObserver?.disconnect();
		this.intersectionObserver = null;
	}

	private async playNamedAnimation(
		animationName: string,
		phase: "in" | "out",
	): Promise<void> {
		if (this.targetEl === null || animationName === "") {
			return;
		}

		this.cancel();
		this.prepareAnimateCssClasses(animationName);

		const keyframes = this.extractKeyframesFromCssAnimationName(this.targetEl);
		if (keyframes === null) {
			return;
		}

		this.targetEl.classList.remove(
			"animate__animated",
			`animate__${animationName}`,
		);

		const reduceMotion =
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
		this.animation = this.targetEl.animate(keyframes, {
			delay: reduceMotion ? 0 : this.parseTimeToMs(this.delay),
			duration: reduceMotion ? 0 : this.parseTimeToMs(this.duration),
			easing: this.easing,
			fill: this.fill,
			iterations: reduceMotion ? 1 : this.parseIterations(this.iterations),
		});

		this.dispatchEvent(
			new CustomEvent("tp-animation-start", {
				bubbles: true,
				detail: {
					in: this.in,
					out: this.out,
					phase,
				},
			}),
		);

		if (this.paused) {
			this.animation.pause();
		}

		try {
			await this.animation.finished;

			this.dispatchEvent(
				new CustomEvent("tp-animation-finish", {
					bubbles: true,
					detail: {
						in: this.in,
						out: this.out,
						phase,
					},
				}),
			);
		} catch {
			// cancelled
		}
	}

	private prepareAnimateCssClasses(animationName: string): void {
		if (this.targetEl === null || animationName === "") {
			return;
		}

		this.targetEl.classList.remove(
			"animate__animated",
			`animate__${animationName}`,
		);
		void this.targetEl.offsetWidth;
		this.targetEl.classList.add(
			"animate__animated",
			`animate__${animationName}`,
		);
	}

	private extractKeyframesFromCssAnimationName(
		element: HTMLElement,
	): Keyframe[] | null {
		const computed = getComputedStyle(element);
		const animationName = computed.animationName;

		if (animationName === "none") {
			return null;
		}

		const samples = [0, 0.25, 0.5, 0.75, 1];
		const originalAnimation = element.style.animation;
		const originalTransition = element.style.transition;
		const originalAnimationDelay = element.style.animationDelay;
		const originalAnimationPlayState = element.style.animationPlayState;

		element.style.animationPlayState = "paused";
		element.style.transition = "none";

		const frames: Keyframe[] = samples.map((offset) => {
			element.style.animationDelay = `-${String(
				this.parseTimeToMs(this.duration) * offset,
			)}ms`;

			const styleNow = getComputedStyle(element);

			return {
				offset,
				opacity: styleNow.opacity,
				transform: styleNow.transform === "none" ? "none" : styleNow.transform,
				filter: styleNow.filter === "none" ? "none" : styleNow.filter,
			};
		});

		element.style.animation = originalAnimation;
		element.style.transition = originalTransition;
		element.style.animationDelay = originalAnimationDelay;
		element.style.animationPlayState = originalAnimationPlayState;

		return frames;
	}

	private parseTimeToMs(value: string): number {
		const trimmed = value.trim();

		if (trimmed.endsWith("ms")) {
			return Number(trimmed.slice(0, -2));
		}

		if (trimmed.endsWith("s")) {
			return Number(trimmed.slice(0, -1)) * 1000;
		}

		return 1000;
	}

	private parseIterations(value: string): number {
		if (value === "infinite") {
			return Number.POSITIVE_INFINITY;
		}

		const parsed = Number(value);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
	}
}

if (!customElements.get("tp-animation")) {
	customElements.define("tp-animation", TpAnimation);
}
