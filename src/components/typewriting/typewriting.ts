/** @module components/typewriting */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./typewriting.css?inline";

/**
 * @summary progressively reveals text one letter or one word at a time.
 * @tagname tp-typewriting
 * @attr {number} speed = 20 - Letters per second, or words per second with word; zero pauses the reveal.
 * @attr {number} delay = 0 - Milliseconds before the first reveal and between repetitions.
 * @attr {boolean} loop = false - Repeats the reveal after the complete text has been displayed.
 * @attr {boolean} word = false - Reveals whole words instead of Unicode grapheme clusters.
 * @accessibility Complete text remains available to assistive technology without repeated live announcements. Reduced motion reveals everything immediately.
 * @accessibility Keyboard focus or a pointer press reveals all text and stops repetition.
 * @keyboard {Tab} Focus the component to reveal all text and stop the animation.
 * @example
 * <tp-typewriting speed="20">
 *   <p>Welcome to <strong>tp-components</strong>. Make your words appear progressively.</p>
 * </tp-typewriting>
 */
export class TpTypewriting extends TpBase {
	/** Text fragments in document order; opacity preserves layout and accessible text. */
	private units: HTMLSpanElement[] = [];
	/** Pending reveal or initialization task. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Number of fragments already revealed. */
	private position = 0;
	/** Original author tab position, restored after the animation. */
	private authorTabindex: string | null = null;
	/** Whether this instance temporarily added a keyboard focus stop. */
	private ownsTabindex = false;
	/** Current operating-system motion preference. */
	private motion: MediaQueryList | null = null;
	/** Speech controller currently owning the reveal instead of the local clock. */
	private speechController: HTMLElement | null = null;
	/** UTF-16 end offsets matching the exact utterance text. */
	private speechEnds: number[] = [];
	/** Exact text used to resolve the current spoken word. */
	private speechText = "";
	/** Whether a reliable word boundary has arrived for this reading. */
	private speechBoundarySeen = false;
	/** Reader interruption prevents later speech events from hiding content again. */
	private speechDismissed = false;
	/** Watches late or replaced author content, never individual reveal attributes. */
	private readonly observer = new MutationObserver((records) => {
		if (
			records.some((record) => {
				const target =
					record.target instanceof Element
						? record.target
						: record.target.parentElement;
				return target?.closest("tp-typewriting") === this;
			})
		)
			this.schedule();
	});
	/** Ends animation when the reader interacts with this content. */
	private readonly finish = (): void => {
		this.speechDismissed = true;
		this.cancel();
		for (const unit of this.units) unit.removeAttribute("data-pending");
		this.restoreFocus();
	};
	/** Restarts when the operating-system motion preference changes. */
	private readonly motionChanged = (): void => this.schedule();
	/** Attributes controlling timing and segmentation. */
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "speed", "delay", "loop", "word"];
	}
	/** Reads a nonnegative finite timing, falling back for missing or invalid values. */
	private timing(name: string, fallback: number): number {
		const raw = this.getAttribute(name);
		const value = Number(raw);
		return raw?.trim() && Number.isFinite(value) && value >= 0
			? Math.min(value, 2147483647)
			: fallback;
	}
	/** Letters or words revealed per second. */
	public get speed(): number {
		return this.timing("speed", 20);
	}
	/** Sets the reveal rate; higher values reveal text faster. */
	public set speed(value: number) {
		this.setAttribute("speed", String(value));
	}
	/** Initial and inter-cycle delay in milliseconds. */
	public get delay(): number {
		return this.timing("delay", 0);
	}
	/** Sets the initial and inter-cycle delay. */
	public set delay(value: number) {
		this.setAttribute("delay", String(value));
	}
	/** Whether the animation repeats. */
	public get loop(): boolean {
		return this.hasAttribute("loop");
	}
	/** Enables repetition using boolean presence. */
	public set loop(value: boolean) {
		this.toggleAttribute("loop", value);
	}
	/** Whether whole words are revealed together. */
	public get word(): boolean {
		return this.hasAttribute("word");
	}
	/** Switches between word and grapheme segmentation. */
	public set word(value: boolean) {
		this.toggleAttribute("word", value);
	}
	/** Installs shared base styles, motion handling and reader interruption. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-typewriting-styles", style);
		this.motion =
			typeof matchMedia === "function"
				? matchMedia("(prefers-reduced-motion: reduce)")
				: null;
		this.motion?.addEventListener("change", this.motionChanged);
		this.addEventListener("pointerdown", this.finish);
		this.addEventListener("focusin", this.finish);
		this.observe();
		this.schedule();
	}
	/** Cancels work, restores visible content and releases all subscriptions. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		this.motion?.removeEventListener("change", this.motionChanged);
		this.motion = null;
		this.removeEventListener("pointerdown", this.finish);
		this.removeEventListener("focusin", this.finish);
		this.finish();
		this.unwrap();
	}
	/** Restarts the connected animation when settings change. */
	protected override attributeChangedCallback(): void {
		if (this.isConnected && !this.speechController) this.schedule();
	}
	/** Gives a speech component ownership; content remains visible until a word boundary arrives. */
	public attachSpeech(controller: HTMLElement): void {
		this.speechController = controller;
		this.finish();
	}
	/** Releases ownership without letting an obsolete controller affect a newer one. */
	public detachSpeech(controller: HTMLElement): void {
		if (this.speechController !== controller) return;
		this.speechController = null;
		this.finish();
		if (this.isConnected) this.schedule();
	}
	/** Returns the exact readable text, including separators between block elements. */
	public getSpeechText(): string {
		return this.speechSnapshot().text;
	}
	/** Prepares a reading; unsupported boundary reporting leaves the complete text visible. */
	public beginSpeech(controller: HTMLElement): void {
		if (this.speechController !== controller) return;
		this.cancel();
		this.prepare(true);
		for (const unit of this.units) unit.removeAttribute("data-pending");
		this.speechBoundarySeen = false;
	}
	/** Reveals through the word at a Web Speech UTF-16 character offset. */
	public revealSpeech(controller: HTMLElement, charIndex: number): void {
		if (
			this.speechController !== controller ||
			this.speechDismissed ||
			this.motion?.matches ||
			!Number.isInteger(charIndex) ||
			charIndex < 0 ||
			charIndex >= this.speechText.length
		)
			return;
		let end = charIndex;
		for (const part of new Intl.Segmenter(undefined, {
			granularity: "word",
		}).segment(this.speechText)) {
			if (part.isWordLike && part.index + part.segment.length > charIndex) {
				end = part.index + part.segment.length;
				break;
			}
		}
		if (!this.speechBoundarySeen) {
			for (const unit of this.units) unit.setAttribute("data-pending", "");
			this.speechBoundarySeen = true;
		}
		for (let index = 0; index < this.units.length; index++) {
			if ((this.speechEnds[index] ?? Infinity) <= end)
				this.units[index]?.removeAttribute("data-pending");
		}
	}
	/** Restores the complete text after speech ends, stops or fails. */
	public endSpeech(controller: HTMLElement): void {
		if (this.speechController === controller) this.finish();
	}
	/** Maps eligible text nodes to one utterance without reading controls or hidden source code. */
	private speechSnapshot(): {
		text: string;
		nodes: { node: Text; start: number }[];
	} {
		const nodes: { node: Text; start: number }[] = [];
		let text = "";
		let block: Element | null = null;
		const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
		let node = walker.nextNode();
		while (node) {
			if (
				node instanceof Text &&
				node.parentElement?.closest("tp-typewriting") === this &&
				!node.parentElement.closest(
					"script, style, textarea, select, button, input, svg, math, [hidden], [contenteditable], tp-button, tp-icon, tp-math",
				)
			) {
				const nextBlock = node.parentElement.closest(
					"p, div, li, h1, h2, h3, h4, h5, h6, blockquote, section, article",
				);
				if (text && nextBlock !== block) text += "\n";
				block = nextBlock;
				nodes.push({ node, start: text.length });
				text += node.data;
			}
			node = walker.nextNode();
		}
		return { text, nodes };
	}
	/** Watches content changes while avoiding self-generated wrapping mutations. */
	private observe(): void {
		this.observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
		});
	}
	/** Clears the current timer. */
	private cancel(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
	}
	/** Coalesces changes until declarative content has arrived. */
	private schedule(): void {
		this.cancel();
		this.timer = setTimeout(() => this.prepare(), 0);
	}
	/** Removes only owned fragment wrappers, retaining author elements and listeners. */
	private unwrap(): void {
		for (const unit of this.units) unit.replaceWith(...unit.childNodes);
		this.units = [];
		this.normalize();
	}
	/** Restores the author's focus policy after finishing. */
	private restoreFocus(): void {
		if (!this.ownsTabindex) return;
		if (this.authorTabindex === null) this.removeAttribute("tabindex");
		else this.setAttribute("tabindex", this.authorTabindex);
		this.ownsTabindex = false;
	}
	/** Builds visual fragments without duplicating semantic or interactive content. */
	private prepare(speech = false): void {
		this.timer = null;
		this.observer.disconnect();
		this.finish();
		this.unwrap();
		if (
			this.motion?.matches ||
			this.contains(document.activeElement) ||
			(this.speechController && !speech)
		) {
			this.observe();
			return;
		}
		const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
		const texts: Text[] = [];
		let node = walker.nextNode();
		while (node) {
			if (
				node instanceof Text &&
				node.data.trim() &&
				node.parentElement?.closest("tp-typewriting") === this &&
				!node.parentElement?.closest(
					"script, style, textarea, select, button, input, svg, math, [hidden], [contenteditable], tp-button, tp-icon, tp-math",
				)
			)
				texts.push(node);
			node = walker.nextNode();
		}
		const snapshot = this.speechSnapshot();
		this.speechText = snapshot.text;
		this.speechEnds = [];
		this.speechDismissed = false;
		const segmenter = new Intl.Segmenter(undefined, {
			granularity: this.word && !speech ? "word" : "grapheme",
		});
		for (const text of texts) {
			const pieces: string[] = [];
			for (const part of segmenter.segment(text.data)) {
				if (this.word && !speech && !part.isWordLike && pieces.length)
					pieces[pieces.length - 1] += part.segment;
				else pieces.push(part.segment);
			}
			const fragment = document.createDocumentFragment();
			let offset =
				snapshot.nodes.find((entry) => entry.node === text)?.start ?? 0;
			for (const piece of pieces) {
				const unit = document.createElement("span");
				unit.dataset.tpTypewritingUnit = "";
				unit.setAttribute("data-pending", "");
				unit.textContent = piece;
				this.units.push(unit);
				offset += piece.length;
				this.speechEnds.push(offset);
				fragment.append(unit);
			}
			text.replaceWith(fragment);
		}
		this.observe();
		this.position = 0;
		if (!this.units.length) return;
		this.authorTabindex = this.getAttribute("tabindex");
		this.ownsTabindex = true;
		if (this.authorTabindex === null) this.tabIndex = 0;
		if (!speech && this.speed > 0)
			this.timer = setTimeout(() => this.tick(), this.delay);
	}
	/** Reveals one fragment, then optionally starts a new cycle after a readable pause. */
	private tick(): void {
		this.timer = null;
		const interval = Math.min(2147483647, Math.max(1, 1000 / this.speed));
		this.units[this.position]?.removeAttribute("data-pending");
		this.position++;
		if (this.position < this.units.length)
			this.timer = setTimeout(() => this.tick(), interval);
		else if (this.loop)
			this.timer = setTimeout(
				() => {
					for (const unit of this.units) unit.setAttribute("data-pending", "");
					this.position = 0;
					this.tick();
				},
				Math.max(this.delay, interval),
			);
		else this.restoreFocus();
	}
}
if (!customElements.get("tp-typewriting"))
	customElements.define("tp-typewriting", TpTypewriting);
declare global {
	interface HTMLElementTagNameMap {
		"tp-typewriting": TpTypewriting;
	}
}
