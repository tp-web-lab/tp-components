import { t as e } from "./base.js";
import "./callout.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
import { n } from "./math.js";
//#region src/components/math/math.css?inline
var r = "tp-math{display:inline}tp-math[displaystyle]{text-align:center;max-inline-size:100%;margin-block:1em;display:block;overflow-x:auto}tp-math [data-tp-math-output] mjx-container{margin:0;display:inline-block}tp-math [data-tp-math-output] svg{max-inline-size:none;overflow:visible}", i = class i extends e {
	static queue = Promise.resolve();
	source = new t(this, {
		scriptTypes: ["tp/math", "tp/txt"],
		textContentFallback: !0,
		ignoreSelector: "[data-tp-math-output]"
	});
	revision = 0;
	renderedKey = "";
	publishedSource = null;
	static async prepare(e) {
		let t = Array.from(e.querySelectorAll("tp-math"));
		for (let e of t) customElements.upgrade(e);
		await Promise.all(t.map((e) => e.render(!0)));
	}
	request = null;
	timer = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"value",
			"src",
			"mode",
			"displaystyle",
			"label"
		];
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		this.setAttribute("value", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get mode() {
		return this.getAttribute("mode") === "asciimath" ? "asciimath" : "latexmath";
	}
	set mode(e) {
		this.setAttribute("mode", e);
	}
	get displaystyle() {
		return this.hasAttribute("displaystyle");
	}
	set displaystyle(e) {
		this.toggleAttribute("displaystyle", e);
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-math-styles", r), this.source.observe(() => this.schedule()), this.schedule();
	}
	disconnectedCallback() {
		this.revision++, this.request?.abort(), this.timer !== null && clearTimeout(this.timer), this.timer = null, this.source.disconnect();
	}
	attributeChangedCallback() {
		this.isConnected && this.schedule();
	}
	schedule() {
		this.revision++, this.request?.abort(), this.timer !== null && clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.timer = null, this.render();
		}, 0);
	}
	async render(e = !1) {
		let t = this.revision;
		this.source.capture();
		let r = this.querySelector(":scope > [data-tp-math-output]");
		this.publishedSource ??= r?.getAttribute("data-tp-math-source") ?? null, this.request = new AbortController();
		let a = document.createElement("span");
		a.setAttribute("data-tp-math-output", ""), this.setAttribute("aria-busy", "true");
		try {
			let o = (await this.source.read({ signal: this.request.signal }) || this.publishedSource || "").trim();
			if (t !== this.revision || !e && !this.isConnected) return;
			a.setAttribute("data-tp-math-source", o);
			let s = this.mode, c = this.displaystyle, l = JSON.stringify([
				o,
				s,
				c,
				this.label
			]);
			if ((l === this.renderedKey || r?.getAttribute("data-tp-math-key") === l && r.querySelector("svg") && !r.querySelector("[data-mml-node=\"merror\"]")) && r) return;
			if (o) {
				let r = document.createElement("span");
				r.setAttribute(s === "asciimath" ? "data-mathjax-asciimath" : "data-mathjax-tex", o), r.setAttribute("data-mathjax-display", String(c)), a.append(r);
				let l = i.queue.then(async () => {
					try {
						await n.render(a);
					} finally {
						window.MathJax?.typesetClear?.([a]);
					}
				});
				if (i.queue = l.catch(() => void 0), await l, t !== this.revision || !e && !this.isConnected) return;
				let u = a.querySelector("svg");
				if (!u || a.querySelector("[data-mml-node=\"merror\"]")) throw Error("The mathematical expression could not be rendered as SVG.");
				u.setAttribute("role", "img"), u.setAttribute("aria-label", this.label.trim() || o), u.removeAttribute("aria-hidden"), u.removeAttribute("aria-labelledby");
			}
			a.setAttribute("data-tp-math-key", l), this.replaceChildren(a), this.renderedKey = l, o && this.dispatchEvent(new CustomEvent("tp-math-rendered", {
				bubbles: !0,
				detail: {
					value: o,
					mode: s,
					displaystyle: c
				}
			}));
		} catch (n) {
			if (t !== this.revision || !e && !this.isConnected) return;
			this.renderedKey = "";
			let r = n instanceof Error ? n.message : "Unable to render the mathematical expression.", i = document.createElement("tp-callout");
			i.setAttribute("variant", "warning"), i.textContent = r, a.replaceChildren(i), this.replaceChildren(a), this.dispatchEvent(new CustomEvent("tp-math-error", {
				bubbles: !0,
				detail: { message: r }
			}));
		} finally {
			t === this.revision && this.removeAttribute("aria-busy");
		}
	}
};
customElements.get("tp-math") || customElements.define("tp-math", i);
//#endregion
export { i as t };

//# sourceMappingURL=math2.js.map