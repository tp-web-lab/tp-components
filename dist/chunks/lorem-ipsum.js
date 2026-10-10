import { Ku as e } from "./lib/typescript/typescript.js";
import { DEFAULT_OPTIONS as t, readLoremType as n, readOptionalInteger as r, renderLorem as i } from "../components/lorem-ipsum/generator.js";
//#region src/components/lorem-ipsum/lorem-ipsum.css?inline
var a = "tp-lorem-ipsum{min-inline-size:0;display:flow-root}tp-lorem-ipsum:is([type=sentence],[type=title]){display:inline}", o = class extends e {
	timer = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"type",
			"length",
			"words-per-sentence",
			"sentences-per-paragraph",
			"seed"
		];
	}
	get type() {
		return n(this.getAttribute("type") ?? "p");
	}
	set type(e) {
		this.setAttribute("type", e);
	}
	get length() {
		return this.getAttribute("length") || String(t.length);
	}
	set length(e) {
		this.setAttribute("length", e);
	}
	get wordsPerSentence() {
		return this.getAttribute("words-per-sentence") || String(t.wordsPerSentence);
	}
	set wordsPerSentence(e) {
		this.setAttribute("words-per-sentence", e);
	}
	get sentencesPerParagraph() {
		return this.getAttribute("sentences-per-paragraph") || String(t.sentencesPerParagraph);
	}
	set sentencesPerParagraph(e) {
		this.setAttribute("sentences-per-paragraph", e);
	}
	get seed() {
		return this.getAttribute("seed") ?? "";
	}
	set seed(e) {
		this.setAttribute("seed", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-lorem-ipsum-styles", a), this.schedule();
	}
	disconnectedCallback() {
		this.timer !== null && clearTimeout(this.timer), this.timer = null;
	}
	attributeChangedCallback(e) {
		this.isConnected && [
			"type",
			"length",
			"words-per-sentence",
			"sentences-per-paragraph",
			"seed"
		].includes(e) && this.schedule();
	}
	schedule() {
		this.timer !== null && clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.timer = null, this.regenerate();
		}, 0);
	}
	upperBound(e) {
		let t = e.match(/^(\d+)\s*-\s*(\d+)$/);
		if (t) return Math.max(Number(t[1]), Number(t[2]));
		let n = Number.parseInt(e, 10);
		return Number.isFinite(n) ? Math.max(0, n) : 1;
	}
	regenerate() {
		this.timer !== null && clearTimeout(this.timer), this.timer = null;
		let e = ["sentence", "title"].includes(this.type) ? 1 : this.upperBound(this.length), t = this.upperBound(this.wordsPerSentence), n = this.type === "p" ? this.upperBound(this.sentencesPerParagraph) : 1;
		if (Math.max(e, t, n) > 1e4 || e * n * Math.max(1, t + (this.type === "dl" ? 3 : 0)) > 1e4) {
			let e = document.createElement("tp-callout");
			e.setAttribute("variant", "warning"), e.textContent = "Reduce the requested counts: a preview is limited to 10,000 words or items.", this.replaceChildren(e);
			return;
		}
		this.innerHTML = i({
			type: this.type,
			length: this.length,
			wordsPerSentence: this.wordsPerSentence,
			sentencesPerParagraph: this.sentencesPerParagraph,
			seed: r(this.seed)
		});
	}
};
customElements.get("tp-lorem-ipsum") || customElements.define("tp-lorem-ipsum", o);
//#endregion
export { o as t };

//# sourceMappingURL=lorem-ipsum.js.map