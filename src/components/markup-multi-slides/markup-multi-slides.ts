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
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-slide-note
 * @summary Collapsible speaker notes with speech playback and presentation docking.
 */
/**
 * @tp-dependency tp-text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
// tp-docgen:dependencies:end

import { TpMarkupMultiPages } from "../markup-multi-pages/markup-multi-pages.js";
import "../numberfield/numberfield.js";
import "../menu/menu.js";
import "../slide-note/slide-note.js";
import { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
import style from "./markup-multi-slides.css?inline";
import { type SlideAutoMode, SlidePlayback } from "./slide-playback.js";

/**
 * The custom `<tp-markup-multi-slides>` element presents multi-format pages as a responsive slide deck.
 *
 * @summary Presents multi-format pages as a responsive slide deck.
 * @cssprop --tp-slide-content-width = 65em - Maximum content width.
 * @cssprop --tp-slide-content-padding = clamp(1em, 3vw, 3em) - Inline content padding.
 * @cssprop --tp-slide-font-size = clamp(1rem, calc(0.65rem + 1.15vw), 2.5rem) - Responsive slide content font size.
 * @cssprop --tp-slide-title-size = 2.488em - Level-one title size relative to slide text.
 * @cssprop --tp-slide-image-height = 13em - Maximum image height.
 * @cssprop --tp-slide-image-height-small = 10em - Maximum image height below 650px.
 * @cssprop --tp-slide-svg-height = 22em - Maximum height of included SVG illustrations.
 * @attr {"" | "notes" | "timing"} auto = "" - Enables automatic playback controls. notes follows the current tp-text-to-speech[data-slide-notes] and its [trigger=clic] commands; timing advances each progressive step on a clock. Absent or invalid values keep manual navigation.
 * @attr {number} timing = 5000 - Positive integer milliseconds per progressive step in timing mode, also used when notes are absent or finished.
 * @tagname tp-markup-multi-slides
 * @example
 * <tp-markup-multi-slides repository="/slides"></tp-markup-multi-slides>
 */
export class TpMarkupMultiSlides extends TpMarkupMultiPages {
	public static override get observedAttributes(): string[] {
		return [...TpMarkupMultiPages.observedAttributes, "auto", "timing"];
	}

	/** Configured playback mode; an empty value preserves manual navigation. */
	public get auto(): SlideAutoMode {
		const value = this.getAttribute("auto");
		return value === "notes" || value === "timing" ? value : "";
	}
	public set auto(value: SlideAutoMode) {
		if (value) this.setAttribute("auto", value);
		else this.removeAttribute("auto");
	}

	/** Milliseconds before revealing the next step or moving to the next slide. */
	public get timing(): number {
		const value = this.getAttribute("timing") ?? "";
		return /^\d+$/.test(value) &&
			Number(value) > 0 &&
			Number(value) <= 2_147_483_647
			? Number(value)
			: 5000;
	}
	public set timing(value: number) {
		this.setAttribute("timing", String(value));
	}

	/** Starts or resumes the configured automatic playback after user activation. */
	public playAuto(): void {
		this.syncAutomatic();
		this.playback.play();
	}
	/** Freezes the current voice or the remaining clock interval. */
	public pauseAuto(): void {
		this.playback.pause();
	}
	/** Cancels automatic playback while retaining the current slide and reveals. */
	public stopAuto(): void {
		this.automaticHash = null;
		this.playback.stop();
	}

	private readonly playback = new SlidePlayback(
		() => {
			const step = this.progressIndex < this.progressSteps.length;
			this.automaticNavigation = true;
			const advanced = this.advanceProgress();
			if (advanced && !step)
				this.automaticHash =
					this.ownerDocument.defaultView?.location.hash ?? null;
			this.automaticNavigation = false;
			return !advanced ? "end" : step ? "step" : "slide";
		},
		() => this.syncAutoControls(),
		() => {
			this.progressIndex = 0;
			for (const element of this.progressElements) {
				element.setAttribute("data-slide-fragment-hidden", "");
				element.setAttribute("aria-hidden", "true");
			}
			this.updateArrowStates();
		},
	);
	private automaticNavigation = false;
	private automaticHash: string | null = null;
	private handleAutoRoute = (): void => {
		const hash = this.ownerDocument.defaultView?.location.hash;
		if (hash === this.automaticHash) {
			this.automaticHash = null;
			return;
		}
		this.stopAuto();
	};

	protected override attributeChangedCallback(name: string): void {
		super.attributeChangedCallback(name);
		if (name === "repository" && this.playback) this.stopAuto();
		if ((name === "auto" || name === "timing") && this.playback) {
			this.playback.configure(this.auto, this.timing);
			this.scheduleNavigationSync();
		}
	}

	private handleManualNavigation = (event: Event): void => {
		if (this.automaticNavigation) return;
		const target = event.target;
		if (
			!(target instanceof Element) ||
			target.closest(
				"tp-text-to-speech, [data-slide-notes-panel], [data-slide-auto-action], summary",
			)
		)
			return;
		if (
			target.closest(
				".tp-markup-multi-pages-content, .tp-markup-multi-pages-sidebar a, [data-slide-direction], .tp-markup-multi-slides-navigation tp-numberfield, [data-action=home], [data-action=code]",
			)
		)
			this.stopAuto();
	};

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
		const mode = new URL(this.ownerDocument.URL).searchParams.get("mode");
		if (mode === "manual") this.auto = "";
		else if (mode === "notes" || mode === "timing") this.auto = mode;
		super.connectedCallback();
		this.classList.add("tp-markup-multi-slides-host");
		this.ensureGlobalStyle(TpMarkupMultiSlides.styleId, style);
		this.ownerDocument.addEventListener("keydown", this.handleKeydown);
		this.addEventListener("click", this.handleProgressClick);
		this.addEventListener("contextmenu", this.handleProgressContextMenu);
		this.addEventListener("click", this.handleManualNavigation, true);
		this.addEventListener("input", this.handleManualNavigation, true);
		this.ownerDocument.defaultView?.addEventListener(
			"hashchange",
			this.handleAutoRoute,
		);
		this.observeNavigation();
		this.scheduleNavigationSync();
	}

	public override disconnectedCallback(): void {
		this.playback.dispose();
		this.ownerDocument.defaultView?.removeEventListener(
			"hashchange",
			this.handleAutoRoute,
		);
		this.removeEventListener("click", this.handleManualNavigation, true);
		this.removeEventListener("input", this.handleManualNavigation, true);
		this.navigationObserver?.disconnect();
		this.navigationObserver = null;
		this.ownerDocument.removeEventListener("keydown", this.handleKeydown);
		this.removeEventListener("click", this.handleProgressClick);
		this.removeEventListener("contextmenu", this.handleProgressContextMenu);
		super.disconnectedCallback();
	}

	private handleKeydown = (event: KeyboardEvent): void => {
		if (
			event.defaultPrevented ||
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
				"input, textarea, select, button, a, tp-menu, [contenteditable], tp-code-editor, [data-slide-notes-panel], [data-slide-notes]",
			) !== null
		)
			return;

		this.stopAuto();
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
				"a, button, input, textarea, select, summary, [contenteditable], tp-code-editor, [data-slide-notes-panel], [data-slide-notes]",
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
				"a, button, input, textarea, select, summary, [contenteditable], tp-code-editor, [data-slide-notes-panel], [data-slide-notes]",
			) !== null
		)
			return;
		this.stopAuto();
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
			attributeFilter: [
				"aria-current",
				"open",
				"data-tp-markdown-rendered",
				"data-tp-asciidoc-rendered",
				"data-tp-restructuredtext-rendered",
				"data-tp-latex-rendered",
				"data-tp-speech-ready",
			],
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
		this.syncModeMenu();
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
		this.syncAutomatic();

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
		this.syncAutoControls();
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
			return (
				Number.isInteger(step) &&
				step >= 1 &&
				element.closest("[data-slide-notes]") === null
			);
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

	private syncAutomatic(): void {
		this.playback.configure(this.auto, this.timing);
		const page = this.querySelector(
			".tp-markup-multi-pages-content > :first-child",
		);
		const reader = page?.querySelector(
			"tp-slide-note, tp-text-to-speech[data-slide-notes]",
		);
		const markup =
			page?.matches(
				"tp-markdown, tp-asciidoc, tp-restructuredtext, tp-latex",
			) ?? false;
		const ready =
			page !== null &&
			(!markup ||
				page.matches(
					"[data-tp-markdown-rendered], [data-tp-asciidoc-rendered], [data-tp-restructuredtext-rendered], [data-tp-latex-rendered]",
				));
		this.playback.sync(
			page,
			reader instanceof TpTextToSpeech ? reader : null,
			ready,
		);
		this.syncAutoControls();
	}

	private syncModeMenu(): void {
		const layout = this.querySelector(".tp-markup-multi-pages-root");
		if (!layout) return;
		let menu = layout.querySelector<HTMLElement>(
			":scope > [data-slide-mode-menu]",
		);
		if (!menu) {
			menu = this.ownerDocument.createElement("tp-menu");
			menu.setAttribute("data-slide-mode-menu", "");
			menu.className = "tp-markup-multi-slides-mode-menu";
			menu.setAttribute("orientation", "horizontal");
			menu.setAttribute("aria-label", "Presentation mode");
			menu.innerHTML =
				'<ul><li data-mode="manual">Manual</li><li data-mode="timing">Timing</li><li data-mode="notes">Narration</li><li data-action="toggle-note">Note</li></ul>';
			menu.addEventListener("tp-menu-item-select", (event) => {
				const item = (event as CustomEvent<{ item: HTMLElement }>).detail.item;
				if (item.dataset.action === "toggle-note") {
					this.querySelector(
						".tp-markup-multi-pages-content tp-slide-note",
					)?.toggleAttribute("open");
				} else if (item.dataset.mode === "manual") this.auto = "";
				else if (
					item.dataset.mode === "notes" ||
					item.dataset.mode === "timing"
				)
					this.auto = item.dataset.mode;
				const mode = item.dataset.mode;
				if (mode === "manual" || mode === "timing" || mode === "notes") {
					const url = new URL(this.ownerDocument.URL);
					url.searchParams.set("mode", mode);
					if (["http:", "https:", "file:"].includes(url.protocol))
						this.ownerDocument.defaultView?.history.replaceState(
							this.ownerDocument.defaultView.history.state,
							"",
							url,
						);
				}
				this.syncModeMenu();
			});
			layout.append(menu);
		}
		const selected = this.auto || "manual";
		for (const item of menu.querySelectorAll<HTMLElement>("[data-mode]")) {
			if (item.dataset.mode === selected) {
				if (item.getAttribute("aria-current") !== "true")
					item.setAttribute("aria-current", "true");
			} else if (item.hasAttribute("aria-current"))
				item.removeAttribute("aria-current");
		}
		const note = this.querySelector<HTMLElement>(
			".tp-markup-multi-pages-content tp-slide-note",
		);
		const item = menu.querySelector('[data-action="toggle-note"]');
		item?.setAttribute(
			"aria-expanded",
			String(note?.hasAttribute("open") ?? false),
		);
		item?.setAttribute("aria-disabled", String(!note));
		if (note) {
			if (!note.id) note.id = `${this.ticksId}-note`;
			item?.setAttribute("aria-controls", note.id);
		} else item?.removeAttribute("aria-controls");
	}

	private syncAutoControls(): void {
		const controls = this.querySelector(".tp-markup-multi-slides-controls");
		if (!controls) return;
		let buttons = controls.querySelector(".tp-markup-multi-slides-auto");
		if (!this.auto) {
			buttons?.remove();
			return;
		}
		if (!buttons) {
			buttons = this.ownerDocument.createElement("span");
			buttons.className = "tp-markup-multi-slides-auto";
			buttons.setAttribute("data-help-group", "Automatic playback");
			for (const action of ["play", "stop"] as const) {
				const button = this.ownerDocument.createElement("tp-icon-button");
				button.dataset.slideAutoAction = action;
				button.setAttribute("name", action === "play" ? "play" : "stop");
				button.setAttribute(
					"label",
					action === "play" ? "Play automatically" : "Stop automatic playback",
				);
				button.addEventListener("click", () => {
					if (action === "stop") this.stopAuto();
					else if (this.playback.state === "playing") this.pauseAuto();
					else this.playAuto();
				});
				buttons.append(button);
			}
			controls.prepend(buttons);
		}
		const play = buttons.querySelector('[data-slide-auto-action="play"]');
		const playing = this.playback.state === "playing";
		play?.setAttribute("name", playing ? "pause" : "play");
		play?.setAttribute(
			"label",
			playing ? "Pause automatic playback" : "Play automatically",
		);
		play?.setAttribute("aria-pressed", String(playing));
		buttons
			.querySelector('[data-slide-auto-action="stop"]')
			?.toggleAttribute("disabled", this.playback.state === "stopped");
		this.dataset.slidePlayback = this.playback.state;
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
