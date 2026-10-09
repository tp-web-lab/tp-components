/** @module components/lorem-ipsum */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import {
	DEFAULT_OPTIONS,
	type LoremType,
	readLoremType,
	readOptionalInteger,
	renderLorem,
} from "./generator.js";
import style from "./lorem-ipsum.css?inline";

/**
 * @summary generates placeholder sentences, titles, paragraphs or lists.
 * @tagname tp-lorem-ipsum
 * @attr {"sentence"|"title"|"p"|"dl"|"ol"|"ul"} type = "p" - Generated structure; title and sentence produce plain text.
 * @attr {string} length = "3-5" - Number or inclusive range of paragraphs or list entries; ignored for title and sentence.
 * @attr {string} words-per-sentence = "4-16" - Number or inclusive range of words per sentence or title.
 * @attr {string} sentences-per-paragraph = "3-6" - Number or inclusive range of sentences per paragraph; applies only to p.
 * @attr {string} seed = "" - Integer seed for repeatable output; empty generates fresh random text.
 * @accessibility Uses native paragraphs and list semantics without announcing decorative placeholder updates.
 * @accessibilityresponsibility Replace placeholder text with meaningful content before publishing.
 * @example
 * <tp-lorem-ipsum length="1" words-per-sentence="8" sentences-per-paragraph="2" seed="42"></tp-lorem-ipsum>
 */
export class TpLoremIpsum extends TpBase {
	/** Pending render, coalescing consecutive attribute changes. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Attributes affecting generated content. */
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"type",
			"length",
			"words-per-sentence",
			"sentences-per-paragraph",
			"seed",
		];
	}
	/** Kind of generated content, falling back to paragraphs. */
	public get type(): LoremType {
		return readLoremType(this.getAttribute("type") ?? "p");
	}
	/** Changes the output structure. */
	public set type(value: LoremType) {
		this.setAttribute("type", value);
	}
	/** Paragraph or list-entry count or range. */
	public get length(): string {
		return this.getAttribute("length") || String(DEFAULT_OPTIONS.length);
	}
	/** Changes the paragraph or list-entry count. */
	public set length(value: string) {
		this.setAttribute("length", value);
	}
	/** Word count or inclusive range. */
	public get wordsPerSentence(): string {
		return (
			this.getAttribute("words-per-sentence") ||
			String(DEFAULT_OPTIONS.wordsPerSentence)
		);
	}
	/** Changes the word count. */
	public set wordsPerSentence(value: string) {
		this.setAttribute("words-per-sentence", value);
	}
	/** Sentence count per paragraph. */
	public get sentencesPerParagraph(): string {
		return (
			this.getAttribute("sentences-per-paragraph") ||
			String(DEFAULT_OPTIONS.sentencesPerParagraph)
		);
	}
	/** Changes the paragraph sentence count. */
	public set sentencesPerParagraph(value: string) {
		this.setAttribute("sentences-per-paragraph", value);
	}
	/** Optional integer seed expressed as an attribute string. */
	public get seed(): string {
		return this.getAttribute("seed") ?? "";
	}
	/** Changes the random seed; empty restores unseeded generation. */
	public set seed(value: string) {
		this.setAttribute("seed", value);
	}
	/** Installs layout only; typography comes from the library's native element styles. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-lorem-ipsum-styles", style);
		this.schedule();
	}
	/** Releases deferred work when detached. */
	public disconnectedCallback(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
	}
	/** Regenerates after changes to local settings, not inherited presentation settings. */
	protected override attributeChangedCallback(name: string): void {
		if (
			this.isConnected &&
			[
				"type",
				"length",
				"words-per-sentence",
				"sentences-per-paragraph",
				"seed",
			].includes(name)
		)
			this.schedule();
	}
	/** Groups synchronous attribute changes into a single generation. */
	private schedule(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = null;
			this.regenerate();
		}, 0);
	}
	/** Computes a conservative count bound before allocating generated content. */
	private upperBound(value: string): number {
		const range = value.match(/^(\d+)\s*-\s*(\d+)$/);
		if (range) return Math.max(Number(range[1]), Number(range[2]));
		const number = Number.parseInt(value, 10);
		return Number.isFinite(number) ? Math.max(0, number) : 1;
	}
	/** Generates new content; the same seed and parameters always reproduce the same output. */
	public regenerate(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
		const count = ["sentence", "title"].includes(this.type)
			? 1
			: this.upperBound(this.length);
		const words = this.upperBound(this.wordsPerSentence);
		const sentences =
			this.type === "p" ? this.upperBound(this.sentencesPerParagraph) : 1;
		if (
			Math.max(count, words, sentences) > 10000 ||
			count * sentences * Math.max(1, words + (this.type === "dl" ? 3 : 0)) >
				10000
		) {
			const warning = document.createElement("tp-callout");
			warning.setAttribute("variant", "warning");
			warning.textContent =
				"Reduce the requested counts: a preview is limited to 10,000 words or items.";
			this.replaceChildren(warning);
			return;
		}
		this.innerHTML = renderLorem({
			type: this.type,
			length: this.length,
			wordsPerSentence: this.wordsPerSentence,
			sentencesPerParagraph: this.sentencesPerParagraph,
			seed: readOptionalInteger(this.seed),
		});
	}
}
if (!customElements.get("tp-lorem-ipsum"))
	customElements.define("tp-lorem-ipsum", TpLoremIpsum);
declare global {
	interface HTMLElementTagNameMap {
		"tp-lorem-ipsum": TpLoremIpsum;
	}
}
