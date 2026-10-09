/**
 * @module components/markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
// tp-docgen:dependencies:end

import { TpMarkupMultiPages } from "../markup-multi-pages/markup-multi-pages.js";
import "../numberfield/numberfield.js";
import style from "./markup-multi-slides.css?inline";

/**
 * Uses the complete multi-pages implementation and replaces only its rendered
 * previous/next navigation with slide controls.
 *
 * @summary presents multi-format pages as a responsive slide deck.
 * @tagname tp-markup-multi-slides
 * @example
 * <tp-markup-multi-slides repository="/slides"></tp-markup-multi-slides>
 */
export class TpMarkupMultiSlides extends TpMarkupMultiPages {
	/** Allocate a distinct datalist for each presentation in the same document. */
	private static nextTicksId = 0;
	/** Stable identifier retained across slide changes. */
	private readonly ticksId =
		`tp-slide-ticks-${++TpMarkupMultiSlides.nextTicksId}`;
	private static readonly styleId = "tp-markup-multi-slides-styles";
	private navigationObserver: MutationObserver | null = null;
	private navigationSyncPending = false;
	private progressElements: HTMLElement[] = [];
	private progressSteps: number[] = [];
	private progressIndex = 0;
	private progressPage = "";
	private revealPreviousSlideOnLoad = false;

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markup-multi-slides-host");
		this.ensureGlobalStyle(TpMarkupMultiSlides.styleId, style);
		this.ownerDocument.addEventListener("keydown", this.handleKeydown);
		this.addEventListener("click", this.handleProgressClick);
		this.addEventListener("contextmenu", this.handleProgressContextMenu);
		this.observeNavigation();
		this.scheduleNavigationSync();
	}

	public override disconnectedCallback(): void {
		this.navigationObserver?.disconnect();
		this.navigationObserver = null;
		this.ownerDocument.removeEventListener("keydown", this.handleKeydown);
		this.removeEventListener("click", this.handleProgressClick);
		this.removeEventListener("contextmenu", this.handleProgressContextMenu);
		super.disconnectedCallback();
	}

	private handleKeydown = (event: KeyboardEvent): void => {
		if (
			!["ArrowLeft", "ArrowRight", "Enter", " ", "Backspace"].includes(
				event.key,
			) ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			this.closest("[hidden]") !== null
		)
			return;

		const target = event.target;
		if (
			target instanceof Element &&
			target.closest(
				"input, textarea, select, button, a, [contenteditable], tp-code-editor",
			) !== null
		)
			return;

		const handled =
			event.key === "ArrowLeft" || event.key === "Backspace"
				? this.rewindProgress()
				: this.advanceProgress();
		if (!handled) return;
		event.preventDefault();
	};

	private handleProgressClick = (event: MouseEvent): void => {
		const target = event.target;
		if (
			!(target instanceof Element) ||
			target.closest(".tp-markup-multi-pages-content") === null
		)
			return;
		if (
			target.closest(
				"a, button, input, textarea, select, summary, [contenteditable], tp-code-editor",
			) !== null
		)
			return;
		this.advanceProgress();
	};

	private handleProgressContextMenu = (event: MouseEvent): void => {
		const target = event.target;
		if (
			!(target instanceof Element) ||
			target.closest(".tp-markup-multi-pages-content") === null
		)
			return;
		if (
			target.closest(
				"a, button, input, textarea, select, summary, [contenteditable], tp-code-editor",
			) !== null
		)
			return;
		if (!this.rewindProgress()) return;
		event.preventDefault();
	};

	private advanceProgress(): boolean {
		const step = this.progressSteps[this.progressIndex];
		if (step !== undefined) {
			for (const element of this.progressElements) {
				if (Number(element.dataset.slideStep) !== step) continue;
				element.removeAttribute("data-slide-fragment-hidden");
				element.removeAttribute("aria-hidden");
			}
			this.progressIndex += 1;
			this.updateArrowStates();
			return true;
		}
		return this.goToRelativeSlide(1);
	}

	private rewindProgress(): boolean {
		if (this.progressIndex > 0) {
			this.progressIndex -= 1;
			const step = this.progressSteps[this.progressIndex];
			for (const element of this.progressElements) {
				if (Number(element.dataset.slideStep) !== step) continue;
				element.setAttribute("data-slide-fragment-hidden", "");
				element.setAttribute("aria-hidden", "true");
			}
			this.updateArrowStates();
			return true;
		}
		this.revealPreviousSlideOnLoad = true;
		if (this.goToRelativeSlide(-1)) return true;
		this.revealPreviousSlideOnLoad = false;
		return false;
	}

	private goToRelativeSlide(offset: -1 | 1): boolean {
		const links = Array.from(
			this.querySelectorAll<HTMLAnchorElement>(
				".tp-markup-multi-pages-sidebar a[href]",
			),
		);
		const index = links.findIndex(
			(link) => link.getAttribute("aria-current") === "page",
		);
		const destination = links[index + offset];
		if (destination === undefined) return false;
		destination.click();
		return true;
	}

	private observeNavigation(): void {
		this.navigationObserver?.disconnect();
		this.navigationObserver = new MutationObserver(() =>
			this.scheduleNavigationSync(),
		);
		this.navigationObserver.observe(this, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["aria-current"],
		});
	}

	private scheduleNavigationSync(): void {
		if (this.navigationSyncPending) return;
		this.navigationSyncPending = true;
		queueMicrotask(() => {
			this.navigationSyncPending = false;
			if (this.isConnected) this.syncNavigation();
		});
	}

	private syncNavigation(): void {
		this.querySelectorAll(".tp-markup-multi-pages-page-nav").forEach(
			(navigation) => {
				navigation.remove();
			},
		);

		const links = Array.from(
			this.querySelectorAll<HTMLAnchorElement>(
				".tp-markup-multi-pages-sidebar a[href]",
			),
		);
		const index = links.findIndex(
			(link) => link.getAttribute("aria-current") === "page",
		);
		const existing = this.querySelector<HTMLElement>(
			".tp-markup-multi-slides-navigation",
		);

		if (index < 0 || links.length === 0) {
			existing?.remove();
			return;
		}

		this.syncProgress();

		const signature = `${index}:${links.length}`;
		if (existing?.dataset.signature === signature) return;
		if (existing) {
			this.syncSlideTicks(existing, links.length);
			const range = existing.querySelector("tp-numberfield");
			if (range) {
				range.max = String(links.length);
				range.value = String(index + 1);
			}
			const counter = existing.querySelector(".tp-markup-multi-slides-counter");
			if (counter) counter.textContent = `${index + 1} / ${links.length}`;
			existing.dataset.signature = signature;
			this.updateArrowStates();
			return;
		}

		const navigation = document.createElement("nav");
		navigation.className = "tp-markup-multi-slides-navigation";
		navigation.dataset.signature = signature;
		navigation.setAttribute("aria-label", "Slide navigation");

		const range = document.createElement("tp-numberfield");
		range.range = true;
		range.list = this.ticksId;
		range.min = "1";
		range.max = String(links.length);
		range.value = String(index + 1);
		range.setAttribute("aria-label", "Current slide");
		range.addEventListener("input", () => {
			this.querySelectorAll<HTMLAnchorElement>(
				".tp-markup-multi-pages-sidebar a[href]",
			)[Number(range.value) - 1]?.click();
		});

		const controls = document.createElement("span");
		controls.className = "tp-markup-multi-slides-controls";
		controls.append(
			this.createArrow("previous", "arrow-left", "Previous step or slide"),
			this.createCounter(index, links.length),
			this.createArrow("next", "arrow-right", "Next step or slide"),
		);

		navigation.append(range, controls);
		this.syncSlideTicks(navigation, links.length);
		this.querySelector(".tp-markup-multi-pages")?.append(navigation);
		this.updateArrowStates();
	}

	/** Maintain one native tick mark per slide without recreating the slider. */
	private syncSlideTicks(navigation: HTMLElement, total: number): void {
		let ticks = navigation.querySelector("datalist");
		if (!ticks) {
			ticks = document.createElement("datalist");
			ticks.id = this.ticksId;
			navigation.append(ticks);
		}
		if (ticks.options.length === total) return;
		ticks.replaceChildren(
			...Array.from({ length: total }, (_, index) => {
				const option = document.createElement("option");
				option.value = String(index + 1);
				return option;
			}),
		);
	}

	private syncProgress(): void {
		const page =
			this.querySelector<HTMLAnchorElement>(
				'.tp-markup-multi-pages-sidebar a[aria-current="page"]',
			)?.href ?? "";
		const elements = Array.from(
			this.querySelectorAll<HTMLElement>(
				".tp-markup-multi-pages-content [data-slide-step]",
			),
		).filter((element) => {
			const step = Number(element.dataset.slideStep);
			return Number.isInteger(step) && step >= 1;
		});
		const unchanged =
			page === this.progressPage &&
			elements.length === this.progressElements.length &&
			elements.every(
				(element, index) => element === this.progressElements[index],
			);
		if (unchanged) return;

		this.progressPage = page;
		this.progressElements = elements;
		this.progressSteps = [
			...new Set(elements.map((element) => Number(element.dataset.slideStep))),
		].sort((left, right) => left - right);
		this.progressIndex = this.revealPreviousSlideOnLoad
			? this.progressSteps.length
			: 0;
		for (const element of elements) {
			element.hidden = false;
			if (this.revealPreviousSlideOnLoad) {
				element.removeAttribute("data-slide-fragment-hidden");
				element.removeAttribute("aria-hidden");
			} else {
				element.setAttribute("data-slide-fragment-hidden", "");
				element.setAttribute("aria-hidden", "true");
			}
		}
		this.revealPreviousSlideOnLoad = false;
	}

	private createArrow(
		direction: "previous" | "next",
		name: "arrow-left" | "arrow-right",
		label: string,
	): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.dataset.slideDirection = direction;
		button.setAttribute("name", name);
		button.setAttribute("label", label);
		button.setAttribute("color", "var(--tp-brand-text-colorful)");
		button.addEventListener("click", () => {
			if (direction === "previous") this.rewindProgress();
			else this.advanceProgress();
		});
		return button;
	}

	private updateArrowStates(): void {
		const links = Array.from(
			this.querySelectorAll<HTMLAnchorElement>(
				".tp-markup-multi-pages-sidebar a[href]",
			),
		);
		const pageIndex = links.findIndex(
			(link) => link.getAttribute("aria-current") === "page",
		);
		const previous = this.querySelector<HTMLElement>(
			'[data-slide-direction="previous"]',
		);
		const next = this.querySelector<HTMLElement>(
			'[data-slide-direction="next"]',
		);
		previous?.toggleAttribute(
			"disabled",
			this.progressIndex === 0 && pageIndex <= 0,
		);
		next?.toggleAttribute(
			"disabled",
			this.progressIndex >= this.progressSteps.length &&
				pageIndex >= links.length - 1,
		);
	}

	private createCounter(index: number, total: number): HTMLElement {
		const counter = document.createElement("span");
		counter.className = "tp-markup-multi-slides-counter";
		counter.setAttribute("aria-live", "polite");
		counter.textContent = `${index + 1} / ${total}`;
		return counter;
	}
}

if (!customElements.get("tp-markup-multi-slides")) {
	customElements.define("tp-markup-multi-slides", TpMarkupMultiSlides);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-markup-multi-slides": TpMarkupMultiSlides;
	}
}
