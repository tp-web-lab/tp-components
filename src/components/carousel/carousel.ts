// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-slider
 * @summary Arranges content in a horizontally or vertically scrollable strip.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import type { TpIconButton } from "../icon-button/icon-button.js";
import "../icon-button/icon-button.js";
import type { TpSlider } from "../slider/slider.js";
import "../slider/slider.js";
import style from "./carousel.css?inline";

/**
 * The custom `<tp-carousel>` element displays images one at a time in a horizontal or vertical carousel.
 *
 * @summary Displays images one at a time in a horizontal or vertical carousel.
 * @tagname tp-carousel
 * @attr {"horizontal" | "vertical"} orientation = "horizontal" - Direction of image navigation.
 * @attr {string} height = "20rem" - Height of the image viewport, in CSS units.
 * @attr {number} index = 0 - Zero-based index of the selected image, clamped to the available images.
 * @attr {string} bg-color = "transparent" - Viewport background: a CSS color, brand, neutral or a CSS variable.
 * @attr {"none" | "start-to-end" | "end-to-start"} transition = "none" - Full slide travel direction; follows reading direction horizontally and runs top/bottom vertically.
 * @attr {boolean} hide-controls = false - Hides both navigation buttons and the image counter.
 * @attr {number} auto = 0 - Automatic looping interval in milliseconds; zero disables automatic navigation.
 * @attr {boolean} loop = false - Lets Previous and Next wrap between the first and last images.
 * @event tp-carousel-change Emitted when the selected image changes.
 * @eventdetail tp-carousel-change { index: number; count: number }
 * @keyboard {ArrowLeft / ArrowRight} Selects the previous or next image in horizontal mode when the image viewport is focused.
 * @keyboard {ArrowUp / ArrowDown} Selects the previous or next image in vertical mode when the image viewport is focused.
 * @keyboard {Home / End} Selects the first or last image when the image viewport is focused.
 * @keyboard {Tab} Moves focus between the image viewport and available navigation buttons.
 * @accessibility Provides a labelled carousel, keyboard navigation, native touch scrolling and a live image counter; respects reduced-motion preferences.
 * @accessibilityresponsibility Supply meaningful alternative text for every image and an aria-label that identifies the gallery.
 * @see tp-slider - Provides the scrollable strip used by the carousel.
 * @example
 * <tp-carousel aria-label="Outdoor activities" height="18rem">
 *   <img src="/docs/medias/images/canoe.svg" alt="Canoe">
 *   <img src="/docs/medias/images/basketball.svg" alt="Basketball">
 *   <img src="/docs/medias/images/walking-shoe.svg" alt="Walking shoe">
 * </tp-carousel>
 */
export class TpCarousel extends TpBase {
	private viewport: TpSlider | null = null;
	private controls: HTMLElement | null = null;
	private previousButton: TpIconButton | null = null;
	private nextButton: TpIconButton | null = null;
	private counter: HTMLElement | null = null;
	private activeIndex = 0;
	private reflecting = false;
	private resizeObserver: ResizeObserver | null = null;
	private mutationObserver: MutationObserver | null = null;
	private layoutFrame: number | null = null;
	private scrollFrame: number | null = null;
	private transitionAnimation: Animation | null = null;
	private hovered = false;
	private autoDeadline = 0;
	private autoRemaining = 0;
	private autoTimer: ReturnType<typeof setTimeout> | null = null;

	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"orientation",
			"height",
			"index",
			"loop",
			"auto",
			"hide-controls",
			"bg-color",
			"transition",
		];
	}
	public get orientation(): "horizontal" | "vertical" {
		return this.getAttribute("orientation") === "vertical"
			? "vertical"
			: "horizontal";
	}
	public set orientation(value: "horizontal" | "vertical") {
		this.setAttribute("orientation", value);
	}
	public get height(): string {
		return this.getAttribute("height")?.trim() || "20rem";
	}
	public set height(value: string) {
		this.setAttribute("height", value);
	}
	public get index(): number {
		const value = Number(this.getAttribute("index") ?? 0);
		return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
	}
	public set index(value: number) {
		this.setAttribute("index", String(value));
	}
	public get loop(): boolean {
		return this.hasAttribute("loop");
	}
	public set loop(value: boolean) {
		this.toggleAttribute("loop", value);
	}
	/** Background color of the image viewport. */
	public get bgColor(): string {
		return this.getAttribute("bg-color")?.trim() || "transparent";
	}
	public set bgColor(value: string) {
		this.setAttribute("bg-color", value);
	}
	/** Direction of the full traversal animation. */
	public get transition(): "none" | "start-to-end" | "end-to-start" {
		const value = this.getAttribute("transition");
		return value === "start-to-end" || value === "end-to-start"
			? value
			: "none";
	}
	public set transition(value: "none" | "start-to-end" | "end-to-start") {
		this.setAttribute("transition", value);
	}
	private cancelTransition(): void {
		this.transitionAnimation?.cancel();
		this.transitionAnimation = null;
	}
	private animateSelection(): void {
		const slide = this.slides[this.activeIndex];
		if (
			!slide ||
			this.transition === "none" ||
			typeof slide.animate !== "function" ||
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
		)
			return;
		const vertical = this.orientation === "vertical";
		const rtl = !vertical && getComputedStyle(this).direction === "rtl";
		const sign = (this.transition === "start-to-end" ? -1 : 1) * (rtl ? -1 : 1);
		const viewportRect = this.viewport?.getBoundingClientRect();
		if (!viewportRect) return;
		const content = slide.querySelector<HTMLElement>("tp-icon, img") ?? slide;
		const rect = content.getBoundingClientRect();
		let size = vertical ? rect.height : rect.width;
		let center = vertical
			? rect.top + rect.height / 2
			: rect.left + rect.width / 2;
		if (
			content instanceof HTMLImageElement &&
			content.naturalWidth &&
			content.naturalHeight &&
			getComputedStyle(content).objectFit === "contain"
		) {
			const scale = Math.min(
				rect.width / content.naturalWidth,
				rect.height / content.naturalHeight,
			);
			size = (vertical ? content.naturalHeight : content.naturalWidth) * scale;
		}
		if (size === 0) {
			size = vertical ? viewportRect.height : viewportRect.width;
			center = vertical
				? viewportRect.top + size / 2
				: viewportRect.left + size / 2;
		}
		const start =
			(vertical ? viewportRect.top : viewportRect.left) - center - size / 2;
		const end =
			(vertical ? viewportRect.bottom : viewportRect.right) - center + size / 2;
		const animation = slide.animate(
			[
				{
					transform: `translate${vertical ? "Y" : "X"}(${sign < 0 ? start : end}px)`,
				},
				{
					transform: `translate${vertical ? "Y" : "X"}(${sign < 0 ? end : start}px)`,
				},
			],
			{
				duration: this.auto > 0 ? Math.min(this.auto, 2_147_483_647) : 400,
				easing: "linear",
				fill: "both",
			},
		);
		this.transitionAnimation = animation;
		if (this.hovered) animation.pause();
	}
	/** Whether navigation buttons and the counter are hidden. */
	public get hideControls(): boolean {
		return this.hasAttribute("hide-controls");
	}
	public set hideControls(value: boolean) {
		this.toggleAttribute("hide-controls", value);
	}
	/** Automatic looping interval in milliseconds, or zero when disabled. */
	public get auto(): number {
		const value = Number(this.getAttribute("auto") ?? 0);
		return Number.isFinite(value) && value > 0 ? value : 0;
	}
	public set auto(value: number) {
		this.setAttribute("auto", String(value));
	}
	private stopAuto(): void {
		if (this.autoTimer !== null) clearTimeout(this.autoTimer);
		this.autoTimer = null;
	}
	private scheduleAuto(): void {
		if (this.hovered || !this.isConnected || this.auto === 0 || this.count < 2)
			return;
		this.autoDeadline = Date.now() + this.autoRemaining;
		this.autoTimer = setTimeout(() => {
			this.autoTimer = null;
			if (
				this.hovered ||
				!this.isConnected ||
				this.auto === 0 ||
				this.count < 2
			)
				return;
			this.goTo((this.activeIndex + 1) % this.count);
			this.syncAuto();
		}, this.autoRemaining);
	}
	private syncAuto(): void {
		this.stopAuto();
		this.autoRemaining = Math.min(this.auto, 2_147_483_647);
		this.scheduleAuto();
	}
	private readonly handleMouseEnter = (): void => {
		if (this.hovered) return;
		this.hovered = true;
		if (this.autoTimer !== null) {
			this.autoRemaining = Math.max(0, this.autoDeadline - Date.now());
			this.stopAuto();
		}
		this.transitionAnimation?.pause();
	};
	private readonly handleMouseLeave = (): void => {
		if (!this.hovered) return;
		this.hovered = false;
		if (this.transitionAnimation?.playState === "paused")
			this.transitionAnimation.play();
		this.scheduleAuto();
	};
	/** Number of images in the carousel. */
	public get count(): number {
		return this.slides.length;
	}
	private get slides(): HTMLElement[] {
		return this.viewport
			? Array.from(this.viewport.children).filter(
					(child): child is HTMLElement =>
						child instanceof HTMLElement &&
						child.matches("img, picture, figure"),
				)
			: [];
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-carousel-styles", style);
		if (!this.hasAttribute("role")) this.setAttribute("role", "region");
		this.setAttribute("aria-roledescription", "carousel");
		if (
			!this.hasAttribute("aria-label") &&
			!this.hasAttribute("aria-labelledby")
		)
			this.setAttribute("aria-label", "Image carousel");
		this.addEventListener("mouseenter", this.handleMouseEnter);
		this.addEventListener("mouseleave", this.handleMouseLeave);
		this.ensureControls();
		this.collectImages();
		this.sync();
		this.viewport?.addEventListener("keydown", this.handleKeydown, true);
		this.viewport?.addEventListener("scroll", this.handleScroll, {
			passive: true,
		});
		this.viewport?.addEventListener("load", this.scheduleLayout, true);
		this.mutationObserver = new MutationObserver(() => {
			this.collectImages();
			this.sync();
		});
		this.mutationObserver.observe(this, { childList: true });
		if (this.viewport)
			this.mutationObserver.observe(this.viewport, { childList: true });
		if (typeof ResizeObserver !== "undefined") {
			this.resizeObserver = new ResizeObserver(this.scheduleLayout);
			if (this.viewport) this.resizeObserver.observe(this.viewport);
		}
	}
	public disconnectedCallback(): void {
		this.removeEventListener("mouseenter", this.handleMouseEnter);
		this.removeEventListener("mouseleave", this.handleMouseLeave);
		this.hovered = false;
		this.cancelTransition();
		this.stopAuto();
		this.resizeObserver?.disconnect();
		this.mutationObserver?.disconnect();
		this.viewport?.removeEventListener("keydown", this.handleKeydown, true);
		this.viewport?.removeEventListener("scroll", this.handleScroll);
		this.viewport?.removeEventListener("load", this.scheduleLayout, true);
		if (this.layoutFrame !== null) cancelAnimationFrame(this.layoutFrame);
		if (this.scrollFrame !== null) cancelAnimationFrame(this.scrollFrame);
		this.layoutFrame = this.scrollFrame = null;
	}
	protected override attributeChangedCallback(): void {
		if (this.isConnected && !this.reflecting) this.sync();
	}
	/** Selects the previous image, wrapping when loop is enabled. */
	public previous(): void {
		this.step(-1);
	}
	/** Selects the next image, wrapping when loop is enabled. */
	public next(): void {
		this.step(1);
	}
	/** Selects an image by its zero-based index. */
	public goTo(index: number): void {
		if (!Number.isFinite(index)) return;
		this.cancelTransition();
		const previous = this.activeIndex;
		this.select(index);
		this.scrollToSelection(
			this.auto === 0 &&
				this.transition === "none" &&
				!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
		);
		if (previous !== this.activeIndex) this.animateSelection();
	}
	private step(delta: number): void {
		if (!this.count) return;
		const index = this.activeIndex + delta;
		this.goTo(this.loop ? (index + this.count) % this.count : index);
	}
	private ensureControls(): void {
		if (this.viewport) return;
		this.viewport = document.createElement("tp-slider") as TpSlider;
		this.viewport.dataset.carouselViewport = "";
		this.viewport.setAttribute("aria-label", "Images");
		this.viewport.gap = "0px";
		this.controls = document.createElement("div");
		this.controls.dataset.carouselControls = "";
		this.controls.dataset.helpGroup = "Carousel";
		const button = (
			label: string,
			description: string,
			action: () => void,
		): TpIconButton => {
			const control = document.createElement("tp-icon-button") as TpIconButton;
			control.setAttribute("label", label);
			control.setAttribute("data-help-description", description);
			control.addEventListener("click", action);
			return control;
		};
		this.previousButton = button(
			"Previous image",
			"Show the previous image.",
			() => this.previous(),
		);
		this.nextButton = button("Next image", "Show the next image.", () =>
			this.next(),
		);
		this.counter = document.createElement("span");
		this.counter.dataset.carouselCounter = "";
		this.counter.setAttribute("role", "status");
		this.counter.setAttribute("aria-live", "polite");
		this.counter.setAttribute("aria-atomic", "true");
		this.controls.append(this.previousButton, this.counter, this.nextButton);
		this.append(this.viewport, this.controls);
	}
	private collectImages(): void {
		for (const child of Array.from(this.children)) {
			if (child.matches("img, picture, figure")) this.viewport?.append(child);
			// Native markup parsers wrap standalone images in paragraphs or image blocks.
			else if (
				child.matches("p, .imageblock") &&
				child.querySelector("img, picture") &&
				(child.matches(".imageblock") || !child.textContent?.trim())
			) {
				const images = Array.from(
					child.querySelectorAll("picture, img:not(picture img)"),
				);
				const caption = child.querySelector(".title");
				if (caption) {
					const figure = document.createElement("figure");
					const legend = document.createElement("figcaption");
					legend.append(...Array.from(caption.childNodes));
					figure.append(...images, legend);
					this.viewport?.append(figure);
				} else this.viewport?.append(...images);
				child.remove();
			}
		}
	}
	private sync(): void {
		if (!this.viewport) return;
		this.cancelTransition();
		const background =
			this.bgColor === "brand"
				? "var(--tp-brand-fill-softer)"
				: this.bgColor === "neutral"
					? "var(--tp-neutral-fill-softer)"
					: this.bgColor;
		this.viewport.style.removeProperty("background-color");
		this.viewport.style.backgroundColor = background;
		this.viewport.orientation = this.orientation;
		this.viewport.sliderHeight = this.height;
		this.select(this.index);
		this.updateControls();
		this.scheduleLayout();
		this.syncAuto();
	}
	private select(index: number): void {
		const next = Math.max(
			0,
			Math.min(Math.max(0, this.count - 1), Math.trunc(index)),
		);
		const changed = next !== this.activeIndex;
		this.activeIndex = next;
		this.reflecting = true;
		if (this.getAttribute("index") !== String(next))
			this.setAttribute("index", String(next));
		this.reflecting = false;
		this.updateControls();
		if (changed)
			this.dispatchEvent(
				new CustomEvent("tp-carousel-change", {
					bubbles: true,
					detail: { index: next, count: this.count },
				}),
			);
	}
	private updateControls(): void {
		if (this.controls) this.controls.hidden = this.hideControls;
		const vertical = this.orientation === "vertical";
		this.previousButton?.setAttribute(
			"name",
			vertical ? "chevron-up" : "chevron-left",
		);
		this.nextButton?.setAttribute(
			"name",
			vertical ? "chevron-down" : "chevron-right",
		);
		this.previousButton?.toggleAttribute(
			"disabled",
			this.count < 2 || (!this.loop && this.activeIndex === 0),
		);
		this.nextButton?.toggleAttribute(
			"disabled",
			this.count < 2 || (!this.loop && this.activeIndex === this.count - 1),
		);
		this.counter?.setAttribute("aria-live", this.auto > 0 ? "off" : "polite");
		if (this.counter)
			this.counter.textContent = this.count
				? `${this.activeIndex + 1} / ${this.count}`
				: "No images";
		for (const [index, slide] of this.slides.entries())
			slide.toggleAttribute("data-carousel-active", index === this.activeIndex);
	}
	private readonly scheduleLayout = (): void => {
		if (this.layoutFrame !== null) return;
		this.layoutFrame = requestAnimationFrame(() => {
			this.layoutFrame = null;
			if (this.isConnected) {
				this.cancelTransition();
				this.scrollToSelection(false);
				if (this.auto > 0 && this.transition !== "none") {
					this.syncAuto();
					this.animateSelection();
				}
			}
		});
	};
	private scrollToSelection(smooth: boolean): void {
		const viewport = this.viewport;
		const slide = this.slides[this.activeIndex];
		if (!viewport || !slide || !viewport.clientWidth || !viewport.clientHeight)
			return;
		if (this.transition !== "none") {
			viewport.scrollTo({ left: 0, top: 0, behavior: "instant" });
			return;
		}
		const origin = viewport.getBoundingClientRect();
		const rect = slide.getBoundingClientRect();
		const vertical = this.orientation === "vertical";
		const rtl = !vertical && getComputedStyle(viewport).direction === "rtl";
		viewport.scrollTo({
			left: vertical
				? 0
				: viewport.scrollLeft +
					(rtl ? rect.right - origin.right : rect.left - origin.left),
			top: vertical ? viewport.scrollTop + rect.top - origin.top : 0,
			behavior: smooth ? "smooth" : "instant",
		});
	}
	private readonly handleScroll = (): void => {
		if (this.scrollFrame !== null) return;
		this.scrollFrame = requestAnimationFrame(() => {
			this.scrollFrame = null;
			if (
				!this.viewport ||
				!this.isConnected ||
				this.transition !== "none" ||
				this.transitionAnimation
			)
				return;
			const origin = this.viewport.getBoundingClientRect();
			const vertical = this.orientation === "vertical";
			const rtl =
				!vertical && getComputedStyle(this.viewport).direction === "rtl";
			let best = 0;
			let distance = Number.POSITIVE_INFINITY;
			this.slides.forEach((slide, index) => {
				const rect = slide.getBoundingClientRect();
				const current = Math.abs(
					vertical
						? rect.top - origin.top
						: rtl
							? rect.right - origin.right
							: rect.left - origin.left,
				);
				if (current < distance) {
					distance = current;
					best = index;
				}
			});
			this.select(best);
		});
	};
	private readonly handleKeydown = (event: KeyboardEvent): void => {
		if (
			event.target !== this.viewport ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey
		)
			return;
		const vertical = this.orientation === "vertical";
		const rtl =
			this.viewport && getComputedStyle(this.viewport).direction === "rtl";
		let action: (() => void) | undefined;
		if (event.key === "Home") action = () => this.goTo(0);
		else if (event.key === "End") action = () => this.goTo(this.count - 1);
		else if (
			event.key === (vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft")
		)
			action = () => this.previous();
		else if (
			event.key === (vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight")
		)
			action = () => this.next();
		if (action) {
			event.preventDefault();
			event.stopImmediatePropagation();
			action();
		}
	};
}
if (!customElements.get("tp-carousel"))
	customElements.define("tp-carousel", TpCarousel);
declare global {
	interface HTMLElementTagNameMap {
		"tp-carousel": TpCarousel;
	}
}
