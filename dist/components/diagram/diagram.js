import { qu as e } from "../../chunks/lib/typescript/typescript.js";
import { TpDeclarativeTextSource as t } from "../../utilities/declarative-text-source.js";
//#region src/components/diagram/diagram.css?inline
var n = ".tp-diagram{max-inline-size:100%;margin-block:1rem;display:block}.tp-diagram-output{max-inline-size:100%;overflow:auto}.tp-diagram-output svg{block-size:auto;max-inline-size:100%;margin-inline:auto;display:block}.tp-diagram-error{border:1px solid var(--tp-danger-stroke-soft,#e4a4ac);background:var(--tp-danger-fill-softer,#fff3f5);color:var(--tp-danger-text-on-soft,#7f1d2d);border-radius:.5rem;margin:0;padding:.9rem;overflow:auto}", r = "tp-diagram-styles", i = 0, a = null, o = Promise.resolve();
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
var c = class extends e {
	static get observedAttributes() {
		return ["src", "label"];
	}
	source = new t(this, { scriptTypes: ["tp/diagram"] });
	renderToken = 0;
	initialRenderStarted = !1;
	lifecycleReady = !1;
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e.trim() === "" ? this.removeAttribute("src") : this.setAttribute("src", e);
	}
	get label() {
		return this.getAttribute("label")?.trim() || "Diagram";
	}
	set label(e) {
		e.trim() === "" ? this.removeAttribute("label") : this.setAttribute("label", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-diagram"), this.ensureGlobalStyle(r, n), this.source.observe(() => {
			this.storeInlineAuthorSource(), this.initialRenderStarted && this.renderDiagram();
		}), setTimeout(() => {
			this.isConnected && (this.initialRenderStarted = !0, this.source.capture() && this.storeInlineAuthorSource(), this.lifecycleReady = !0, this.renderDiagram());
		}, 0);
	}
	disconnectedCallback() {
		this.source.disconnect(), this.initialRenderStarted = !1, this.lifecycleReady = !1, this.renderToken += 1;
	}
	attributeChangedCallback() {
		this.isConnected && this.lifecycleReady && this.renderDiagram();
	}
	async renderDiagram() {
		let e = ++this.renderToken, t = this.src.trim();
		this.removeAttribute("data-tp-diagram-rendered"), this.setAttribute("aria-busy", "true");
		try {
			let n = await this.source.read({ cache: "no-store" });
			if (e !== this.renderToken) return;
			if (n.trim() === "") {
				this.replaceChildren(), this.removeAttribute("aria-busy");
				return;
			}
			let [{ default: r }, { default: s }] = await Promise.all([import("../../chunks/lib/vendor/vendor.js").then((e) => e.t), import("../../chunks/lib/vendor/vendor.js").then((e) => e.r)]);
			if (e !== this.renderToken) return;
			a === null && (a = (async () => {
				await r.registerExternalDiagrams([s]), r.initialize({
					securityLevel: "strict",
					startOnLoad: !1,
					suppressErrorRendering: !0
				});
			})()), await a, i += 1;
			let c = `tp-diagram-${String(i)}`, l = o.then(() => r.render(c, n));
			o = l.then(() => void 0, () => void 0);
			let u = await l;
			if (e !== this.renderToken) return;
			let d = document.createElement("div");
			d.className = "tp-diagram-output", d.innerHTML = u.svg;
			let f = d.querySelector("svg");
			f !== null && (f.setAttribute("role", "img"), f.setAttribute("aria-label", this.label), f.removeAttribute("aria-roledescription")), this.replaceChildren(d), u.bindFunctions?.(d), this.setAttribute("data-tp-diagram-rendered", ""), this.removeAttribute("aria-busy"), this.dispatchEvent(new CustomEvent("tp-diagram-rendered", {
				bubbles: !0,
				detail: { src: t }
			}));
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.removeAttribute("aria-busy"), this.innerHTML = `<pre class="tp-diagram-error" role="alert" tabindex="0"><code>${s(n)}</code></pre>`;
		}
	}
	storeInlineAuthorSource() {
		let e = this.cloneNode(!0);
		e.removeAttribute("aria-busy"), e.removeAttribute("data-source"), e.removeAttribute("data-tp-base-host"), e.removeAttribute("data-tp-diagram-rendered"), e.classList.remove("tp-diagram"), e.classList.length === 0 && e.removeAttribute("class"), this.setAttribute("data-source", e.outerHTML);
	}
};
customElements.get("tp-diagram") || customElements.define("tp-diagram", c);
//#endregion
export { c as TpDiagram };

//# sourceMappingURL=diagram.js.map