/**
 * @module components/slide-note
 * @summary Collapsible speaker notes with speech playback and presentation docking.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
// tp-docgen:dependencies:end

import { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
import style from "./slide-note.css?inline";

/**
 * @tagname tp-slide-note
 * @summary Presents collapsible speaker notes above a presentation's mode menu.
 * @attr {boolean} open = false - Expands the notes panel; closing it does not stop narration.
 * @cssprop --tp-slide-note-width = 36rem - Maximum width of docked notes.
 * @cssprop --tp-slide-note-gap = .5rem - Space between docked notes and the presentation menu.
 * @keyboard {Enter / Space} Expands or collapses the focused notes summary.
 * @example
 * <tp-slide-note legend="Speaker notes" lang="en-GB" show-text>
 *   <script type="tp/txt">Introduce the idea. [trigger=clic] Explain the next step.</script>
 * </tp-slide-note>
 */
export class TpSlideNote extends TpTextToSpeech {
	public static override get observedAttributes(): string[] {
		return [...TpTextToSpeech.observedAttributes, "open"];
	}

	/** Whether the speaker notes are expanded. */
	public get open(): boolean {
		return this.hasAttribute("open");
	}
	public set open(value: boolean) {
		this.toggleAttribute("open", value);
	}

	private panel: HTMLDetailsElement | null = null;
	private anchor: HTMLElement | null = null;
	private resizeObserver: ResizeObserver | null = null;
	private deckObserver: MutationObserver | null = null;
	private frame: number | null = null;

	protected override connectedCallback(): void {
		this.setAttribute("data-slide-notes", "");
		this.setAttribute("data-slide-notes-panel", "");
		this.ensureGlobalStyle("tp-slide-note-styles", style);
		super.connectedCallback();
		const deck = this.closest(".tp-markup-multi-slides-host");
		this.classList.toggle("tp-slide-note-docked", deck !== null);
		if (deck) {
			this.deckObserver = new MutationObserver(this.schedulePosition);
			this.deckObserver.observe(deck.parentElement ?? deck, {
				childList: true,
				subtree: true,
			});
			if (typeof ResizeObserver !== "undefined") {
				this.resizeObserver = new ResizeObserver(this.schedulePosition);
				this.resizeObserver.observe(deck);
			}
			this.ownerDocument.defaultView?.addEventListener(
				"resize",
				this.schedulePosition,
			);
			this.ownerDocument.addEventListener(
				"scroll",
				this.schedulePosition,
				true,
			);
			this.schedulePosition();
		}
	}

	protected override attributeChangedCallback(name: string): void {
		super.attributeChangedCallback(name);
		if (name === "open" && this.panel) this.panel.open = this.open;
		if (name === "legend") {
			const summary = this.panel?.querySelector("summary");
			if (summary) summary.textContent = this.getAttribute("legend") || "Notes";
		}
	}

	/** Keeps the shared speech controls and their source intact inside a native disclosure. */
	protected override render(): void {
		super.render();
		const fieldset = this.querySelector(":scope > .tp-speech-fieldset");
		if (!fieldset) return;
		fieldset.querySelector("legend")?.classList.add("tp-visually-hidden");
		const panel = this.ownerDocument.createElement("details");
		panel.setAttribute("data-tp-speech-ui", "");
		panel.open = this.open;
		const summary = this.ownerDocument.createElement("summary");
		summary.textContent = this.getAttribute("legend") || "Notes";
		panel.append(summary, fieldset);
		this.replaceChildren(panel);
		this.panel = panel;
		panel.addEventListener("toggle", () => {
			if (this.panel === panel) this.open = panel.open;
		});
		this.schedulePosition();
	}

	private readonly schedulePosition = (): void => {
		const view = this.ownerDocument.defaultView;
		if (!this.isConnected || this.frame !== null || !view) return;
		this.frame = view.requestAnimationFrame(() => {
			this.frame = null;
			this.positionNotes();
		});
	};

	private positionNotes(): void {
		const deck = this.closest(".tp-markup-multi-slides-host");
		if (!deck) return;
		const scope = deck.parentElement ?? deck;
		const anchor =
			scope.querySelector<HTMLElement>("[data-slide-mode-menu]") ??
			deck.querySelector<HTMLElement>(".tp-markup-multi-slides-navigation");
		if (anchor !== this.anchor) {
			if (this.anchor) this.resizeObserver?.unobserve(this.anchor);
			this.anchor = anchor;
			if (anchor) this.resizeObserver?.observe(anchor);
		}
		const view = this.ownerDocument.defaultView;
		if (!view) return;
		const bottom = anchor
			? Math.max(0, view.innerHeight - anchor.getBoundingClientRect().top)
			: 0;
		this.style.setProperty("--tp-slide-note-anchor-bottom", `${bottom}px`);
	}

	public override disconnectedCallback(): void {
		const view = this.ownerDocument.defaultView;
		if (this.frame !== null) view?.cancelAnimationFrame(this.frame);
		this.frame = null;
		this.resizeObserver?.disconnect();
		this.resizeObserver = null;
		this.deckObserver?.disconnect();
		this.deckObserver = null;
		this.anchor = null;
		view?.removeEventListener("resize", this.schedulePosition);
		this.ownerDocument.removeEventListener(
			"scroll",
			this.schedulePosition,
			true,
		);
		super.disconnectedCallback();
	}
}

if (!customElements.get("tp-slide-note")) {
	customElements.define("tp-slide-note", TpSlideNote);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-slide-note": TpSlideNote;
	}
}
