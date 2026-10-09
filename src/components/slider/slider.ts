// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./slider.css?inline";

/**
 * Arranges children in a horizontally scrollable row with keyboard navigation.
 *
 * Reactive attributes:
 * - `slider-height`
 * - `item-width`
 * - `gap`
 * - `scrollbar`
 * - `scrollbar-track-color`
 * - `scrollback-thumb-color`
 * @summary arranges content in a horizontally scrollable row with a configurable scrollbar.
 * @tagname tp-slider
 * @attr {string} gap = "1rem" - Gap between items, using --tp-slider-gap when absent.
 * @attr {string} item-width = "auto" - Preferred width of non-image items. By default, each item uses its own width or content-based size.
 * @attr {string} slider-height = "auto" - Height of the scrolling area. By default, follows the content height.
 * @attr {boolean} scrollbar = false - Shows the scrollbar when present and hides it when absent, regardless of the attribute's text value.
 * @attr {string} scrollbar-track-color = "transparent" - Scrollbar track color, using --tp-scrollbar-track-color when absent.
 * @attr {string} scrollback-thumb-color = "var(--tp-neutral-fill-mid)" - Scrollbar thumb color, using --tp-scrollbar-thumb-color when absent. Defaults to the theme's neutral scrollbar color.
 * @keyboard {Tab} Moves focus to the slider, then to its focusable children.
 * @keyboard {ArrowLeft / ArrowRight} Scrolls the focused slider left or right by 80% of its visible width.
 * @keyboard {Home / End} Scrolls the focused slider to the start or end of its content, respecting text direction.
 * @example
 * ```html
 * <tp-box style="max-inline-size: 28rem">
 *   <tp-slider scrollbar item-width="10rem" gap="1rem">
 *     <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
 *   </tp-slider>
 * </tp-box>
 * ```
 */
export class TpSlider extends TpBase {
	private static readonly styleId = "tp-slider-styles";

	private resizeObserver: ResizeObserver | null = null;
	private mutationObserver: MutationObserver | null = null;

	private readonly handleScroll = (): void => {
		this.updateOverflowState();
	};

	/** Scrolls only when the slider itself has focus, preserving child controls. */
	private readonly handleKeydown = (event: KeyboardEvent): void => {
		if (
			event.target !== this ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			!this.overflowing
		)
			return;
		const limit = this.scrollWidth - this.clientWidth;
		const rtl = getComputedStyle(this).direction === "rtl";
		const step = this.clientWidth * 0.8;
		let position: number;
		switch (event.key) {
			case "ArrowLeft":
				position = this.scrollLeft - step;
				break;
			case "ArrowRight":
				position = this.scrollLeft + step;
				break;
			case "Home":
				position = 0;
				break;
			case "End":
				position = rtl ? -limit : limit;
				break;
			default:
				return;
		}
		event.preventDefault();
		// Immediate scrolling also respects reduced-motion preferences.
		this.scrollLeft = Math.max(
			rtl ? -limit : 0,
			Math.min(rtl ? 0 : limit, position),
		);
	};

	public static get observedAttributes(): string[] {
		return [
			"slider-height",
			"item-width",
			"gap",
			"scrollbar",
			"scrollbar-track-color",
			"scrollback-thumb-color",
		];
	}

	public get sliderHeight(): string {
		return this.getAttribute("slider-height") ?? "";
	}

	public set sliderHeight(value: string) {
		if (value === "") {
			this.removeAttribute("slider-height");
			return;
		}

		this.setAttribute("slider-height", value);
	}

	public get itemWidth(): string {
		return this.getAttribute("item-width") ?? "";
	}

	public set itemWidth(value: string) {
		if (value === "") {
			this.removeAttribute("item-width");
			return;
		}

		this.setAttribute("item-width", value);
	}

	public get gap(): string {
		return this.getAttribute("gap") ?? "";
	}

	public set gap(value: string) {
		if (value === "") {
			this.removeAttribute("gap");
			return;
		}

		this.setAttribute("gap", value);
	}

	public get scrollbar(): boolean {
		return this.hasAttribute("scrollbar");
	}

	public set scrollbar(value: boolean) {
		this.toggleAttribute("scrollbar", value);
	}

	public get scrollbarTrackColor(): string {
		return this.getAttribute("scrollbar-track-color") ?? "";
	}

	public set scrollbarTrackColor(value: string) {
		if (value === "") {
			this.removeAttribute("scrollbar-track-color");
			return;
		}

		this.setAttribute("scrollbar-track-color", value);
	}

	public get scrollbackThumbColor(): string {
		return this.getAttribute("scrollback-thumb-color") ?? "";
	}

	public set scrollbackThumbColor(value: string) {
		if (value === "") {
			this.removeAttribute("scrollback-thumb-color");
			return;
		}

		this.setAttribute("scrollback-thumb-color", value);
	}

	public get overflowing(): boolean {
		return this.scrollWidth > this.clientWidth;
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.updateStyles();
		this.updateOverflowState();
		this.observeLayout();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
		this.addEventListener("keydown", this.handleKeydown);
		this.addEventListener("scroll", this.handleScroll, { passive: true });
	}

	protected attributeChangedCallback(): void {
		this.updateStyles();
		this.updateOverflowState();
	}

	public disconnectedCallback(): void {
		this.removeEventListener("keydown", this.handleKeydown);
		this.resizeObserver?.disconnect();
		this.resizeObserver = null;
		this.mutationObserver?.disconnect();
		this.mutationObserver = null;
		this.removeEventListener("scroll", this.handleScroll);
	}

	private ensureStyles(): void {
		if (document.getElementById(TpSlider.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpSlider.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private observeLayout(): void {
		if (typeof ResizeObserver !== "undefined") {
			this.resizeObserver = new ResizeObserver(() => {
				this.updateOverflowState();
			});
			this.resizeObserver.observe(this);
		}

		this.mutationObserver = new MutationObserver(() => {
			this.updateOverflowState();
		});

		this.mutationObserver.observe(this, {
			childList: true,
			subtree: false,
		});
	}

	private updateStyles(): void {
		if (this.sliderHeight === "") {
			this.style.removeProperty("block-size");
		} else {
			this.style.blockSize = this.sliderHeight;
		}

		if (this.itemWidth === "") {
			this.style.removeProperty("--tp-slider-item-width");
		} else {
			this.style.setProperty("--tp-slider-item-width", this.itemWidth);
		}

		if (this.gap === "") {
			this.style.removeProperty("--tp-slider-gap");
		} else {
			this.style.setProperty("--tp-slider-gap", this.gap);
		}

		if (this.scrollbarTrackColor === "") {
			this.style.removeProperty("--tp-scrollbar-track-color");
		} else {
			this.style.setProperty(
				"--tp-scrollbar-track-color",
				this.scrollbarTrackColor,
			);
		}

		if (this.scrollbackThumbColor === "") {
			this.style.removeProperty("--tp-scrollbar-thumb-color");
		} else {
			this.style.setProperty(
				"--tp-scrollbar-thumb-color",
				this.scrollbackThumbColor,
			);
		}
	}

	private updateOverflowState(): void {
		this.classList.toggle("overflowing", this.overflowing);
		// Reserve only the space that the native scrollbar does not occupy itself.
		// WebKit may use an overlay when scrollbar is enabled after initialization.
		const styles = getComputedStyle(this);
		const borders =
			(Number.parseFloat(styles.borderTopWidth) || 0) +
			(Number.parseFloat(styles.borderBottomWidth) || 0);
		const nativeSize = Math.max(
			0,
			this.offsetHeight - this.clientHeight - borders,
		);
		const value = `${nativeSize}px`;
		if (
			this.style.getPropertyValue("--tp-slider-native-scrollbar-size") !== value
		) {
			this.style.setProperty("--tp-slider-native-scrollbar-size", value);
		}
	}
}

if (!customElements.get("tp-slider")) {
	customElements.define("tp-slider", TpSlider);
}
