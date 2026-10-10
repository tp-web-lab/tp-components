import { Ku as e } from "./lib/typescript/typescript.js";
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
	async render() {
		let e = this.revision;
		this.source.capture(), this.request = new AbortController();
		let t = document.createElement("span");
		t.setAttribute("data-tp-math-output", ""), this.setAttribute("aria-busy", "true");
		try {
			let r = (await this.source.read({ signal: this.request.signal }) || this.querySelector(":scope > [data-tp-math-output]")?.getAttribute("data-tp-math-source") || "").trim();
			if (e !== this.revision || !this.isConnected) return;
			t.setAttribute("data-tp-math-source", r);
			let a = this.mode, o = this.displaystyle;
			if (r) {
				let s = document.createElement("span");
				s.setAttribute(a === "asciimath" ? "data-mathjax-asciimath" : "data-mathjax-tex", r), s.setAttribute("data-mathjax-display", String(o)), t.append(s);
				let c = i.queue.then(async () => {
					try {
						await n.render(t);
					} finally {
						window.MathJax?.typesetClear?.([t]);
					}
				});
				if (i.queue = c.catch(() => void 0), await c, e !== this.revision || !this.isConnected) return;
				let l = t.querySelector("svg");
				if (!l || t.querySelector("[data-mml-node=\"merror\"]")) throw Error("The mathematical expression could not be rendered as SVG.");
				l.setAttribute("role", "img"), l.setAttribute("aria-label", this.label.trim() || r), l.removeAttribute("aria-hidden"), l.removeAttribute("aria-labelledby");
			}
			this.replaceChildren(t), r && this.dispatchEvent(new CustomEvent("tp-math-rendered", {
				bubbles: !0,
				detail: {
					value: r,
					mode: a,
					displaystyle: o
				}
			}));
		} catch (n) {
			if (e !== this.revision || !this.isConnected) return;
			let r = n instanceof Error ? n.message : "Unable to render the mathematical expression.", i = document.createElement("tp-callout");
			i.setAttribute("variant", "warning"), i.textContent = r, t.replaceChildren(i), this.replaceChildren(t), this.dispatchEvent(new CustomEvent("tp-math-error", {
				bubbles: !0,
				detail: { message: r }
			}));
		} finally {
			e === this.revision && this.removeAttribute("aria-busy");
		}
	}
};
customElements.get("tp-math") || customElements.define("tp-math", i);
//#endregion
export { i as t };

//# sourceMappingURL=math2.js.map