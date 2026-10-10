import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/typewriting/typewriting.css?inline
var t = "tp-typewriting{min-inline-size:0;display:block}tp-typewriting [data-tp-typewriting-unit][data-pending]{opacity:0}@media (prefers-reduced-motion:reduce){tp-typewriting [data-tp-typewriting-unit][data-pending]{opacity:1}}", n = class extends e {
	units = [];
	timer = null;
	position = 0;
	authorTabindex = null;
	ownsTabindex = !1;
	motion = null;
	speechController = null;
	speechEnds = [];
	speechText = "";
	speechBoundarySeen = !1;
	speechDismissed = !1;
	observer = new MutationObserver((e) => {
		e.some((e) => (e.target instanceof Element ? e.target : e.target.parentElement)?.closest("tp-typewriting") === this) && this.schedule();
	});
	finish = () => {
		this.speechDismissed = !0, this.cancel();
		for (let e of this.units) e.removeAttribute("data-pending");
		this.restoreFocus();
	};
	motionChanged = () => this.schedule();
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"speed",
			"delay",
			"loop",
			"word"
		];
	}
	timing(e, t) {
		let n = this.getAttribute(e), r = Number(n);
		return n?.trim() && Number.isFinite(r) && r >= 0 ? Math.min(r, 2147483647) : t;
	}
	get speed() {
		return this.timing("speed", 20);
	}
	set speed(e) {
		this.setAttribute("speed", String(e));
	}
	get delay() {
		return this.timing("delay", 0);
	}
	set delay(e) {
		this.setAttribute("delay", String(e));
	}
	get loop() {
		return this.hasAttribute("loop");
	}
	set loop(e) {
		this.toggleAttribute("loop", e);
	}
	get word() {
		return this.hasAttribute("word");
	}
	set word(e) {
		this.toggleAttribute("word", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-typewriting-styles", t), this.motion = typeof matchMedia == "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null, this.motion?.addEventListener("change", this.motionChanged), this.addEventListener("pointerdown", this.finish), this.addEventListener("focusin", this.finish), this.observe(), this.schedule();
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.motion?.removeEventListener("change", this.motionChanged), this.motion = null, this.removeEventListener("pointerdown", this.finish), this.removeEventListener("focusin", this.finish), this.finish(), this.unwrap();
	}
	attributeChangedCallback() {
		this.isConnected && !this.speechController && this.schedule();
	}
	attachSpeech(e) {
		this.speechController = e, this.finish();
	}
	detachSpeech(e) {
		this.speechController === e && (this.speechController = null, this.finish(), this.isConnected && this.schedule());
	}
	getSpeechText() {
		return this.speechSnapshot().text;
	}
	beginSpeech(e) {
		if (this.speechController === e) {
			this.cancel(), this.prepare(!0);
			for (let e of this.units) e.removeAttribute("data-pending");
			this.speechBoundarySeen = !1;
		}
	}
	revealSpeech(e, t) {
		if (this.speechController !== e || this.speechDismissed || this.motion?.matches || !Number.isInteger(t) || t < 0 || t >= this.speechText.length) return;
		let n = t;
		for (let e of new Intl.Segmenter(void 0, { granularity: "word" }).segment(this.speechText)) if (e.isWordLike && e.index + e.segment.length > t) {
			n = e.index + e.segment.length;
			break;
		}
		if (!this.speechBoundarySeen) {
			for (let e of this.units) e.setAttribute("data-pending", "");
			this.speechBoundarySeen = !0;
		}
		for (let e = 0; e < this.units.length; e++) (this.speechEnds[e] ?? Infinity) <= n && this.units[e]?.removeAttribute("data-pending");
	}
	endSpeech(e) {
		this.speechController === e && this.finish();
	}
	speechSnapshot() {
		let e = [], t = "", n = null, r = document.createTreeWalker(this, NodeFilter.SHOW_TEXT), i = r.nextNode();
		for (; i;) {
			if (i instanceof Text && i.parentElement?.closest("tp-typewriting") === this && !i.parentElement.closest("script, style, textarea, select, button, input, svg, math, [hidden], [contenteditable], tp-button, tp-icon, tp-math")) {
				let r = i.parentElement.closest("p, div, li, h1, h2, h3, h4, h5, h6, blockquote, section, article");
				t && r !== n && (t += "\n"), n = r, e.push({
					node: i,
					start: t.length
				}), t += i.data;
			}
			i = r.nextNode();
		}
		return {
			text: t,
			nodes: e
		};
	}
	observe() {
		this.observer.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0
		});
	}
	cancel() {
		this.timer !== null && clearTimeout(this.timer), this.timer = null;
	}
	schedule() {
		this.cancel(), this.timer = setTimeout(() => this.prepare(), 0);
	}
	unwrap() {
		for (let e of this.units) e.replaceWith(...e.childNodes);
		this.units = [], this.normalize();
	}
	restoreFocus() {
		this.ownsTabindex &&= (this.authorTabindex === null ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", this.authorTabindex), !1);
	}
	prepare(e = !1) {
		if (this.timer = null, this.observer.disconnect(), this.finish(), this.unwrap(), this.motion?.matches || this.contains(document.activeElement) || this.speechController && !e) {
			this.observe();
			return;
		}
		let t = document.createTreeWalker(this, NodeFilter.SHOW_TEXT), n = [], r = t.nextNode();
		for (; r;) r instanceof Text && r.data.trim() && r.parentElement?.closest("tp-typewriting") === this && !r.parentElement?.closest("script, style, textarea, select, button, input, svg, math, [hidden], [contenteditable], tp-button, tp-icon, tp-math") && n.push(r), r = t.nextNode();
		let i = this.speechSnapshot();
		this.speechText = i.text, this.speechEnds = [], this.speechDismissed = !1;
		let a = new Intl.Segmenter(void 0, { granularity: this.word && !e ? "word" : "grapheme" });
		for (let t of n) {
			let n = [];
			for (let r of a.segment(t.data)) this.word && !e && !r.isWordLike && n.length ? n[n.length - 1] += r.segment : n.push(r.segment);
			let r = document.createDocumentFragment(), o = i.nodes.find((e) => e.node === t)?.start ?? 0;
			for (let e of n) {
				let t = document.createElement("span");
				t.dataset.tpTypewritingUnit = "", t.setAttribute("data-pending", ""), t.textContent = e, this.units.push(t), o += e.length, this.speechEnds.push(o), r.append(t);
			}
			t.replaceWith(r);
		}
		this.observe(), this.position = 0, this.units.length && (this.authorTabindex = this.getAttribute("tabindex"), this.ownsTabindex = !0, this.authorTabindex === null && (this.tabIndex = 0), !e && this.speed > 0 && (this.timer = setTimeout(() => this.tick(), this.delay)));
	}
	tick() {
		this.timer = null;
		let e = Math.min(2147483647, Math.max(1, 1e3 / this.speed));
		this.units[this.position]?.removeAttribute("data-pending"), this.position++, this.position < this.units.length ? this.timer = setTimeout(() => this.tick(), e) : this.loop ? this.timer = setTimeout(() => {
			for (let e of this.units) e.setAttribute("data-pending", "");
			this.position = 0, this.tick();
		}, Math.max(this.delay, e)) : this.restoreFocus();
	}
};
customElements.get("tp-typewriting") || customElements.define("tp-typewriting", n);
//#endregion
export { n as t };

//# sourceMappingURL=typewriting.js.map