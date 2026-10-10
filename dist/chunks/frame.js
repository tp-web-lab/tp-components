import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/frame/frame.css?inline
var t = "tp-frame{--tp-frame-numerator:16;--tp-frame-denominator:9;aspect-ratio:var(--tp-frame-numerator) / var(--tp-frame-denominator);justify-content:center;align-items:center;display:flex;overflow:hidden}tp-frame>img,tp-frame>video{object-fit:cover;block-size:100%;inline-size:100%}";
//#endregion
//#region src/components/frame/frame.ts
function n(e) {
	let t = /^(?<numerator>[1-9]\d*):(?<denominator>[1-9]\d*)$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = Number(t.groups.numerator), r = Number(t.groups.denominator);
	return !Number.isInteger(n) || !Number.isInteger(r) || n < 1 || r < 1 ? null : {
		denominator: r,
		numerator: n,
		raw: `${String(n)}:${String(r)}`
	};
}
var r = class r extends e {
	static styleId = "tp-frame-styles";
	static get observedAttributes() {
		return ["aspect-ratio"];
	}
	get aspectRatio() {
		return n(this.getAttribute("aspect-ratio") ?? "")?.raw ?? "";
	}
	set aspectRatio(e) {
		if (e === "") {
			this.removeAttribute("aspect-ratio");
			return;
		}
		let t = n(e);
		if (t === null) throw TypeError("The \"aspect-ratio\" attribute must be a string like \"16:9\", \"4:3\" or \"1:1\".");
		this.setAttribute("aspect-ratio", t.raw);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.updateStyles();
	}
	attributeChangedCallback() {
		this.updateStyles();
	}
	disconnectedCallback() {
		super.connectedCallback();
	}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		let e = n(this.getAttribute("aspect-ratio") ?? "");
		if (e === null) {
			this.style.removeProperty("--tp-frame-numerator"), this.style.removeProperty("--tp-frame-denominator");
			return;
		}
		this.style.setProperty("--tp-frame-numerator", String(e.numerator)), this.style.setProperty("--tp-frame-denominator", String(e.denominator));
	}
};
customElements.get("tp-frame") || customElements.define("tp-frame", r);
//#endregion
export { r as t };

//# sourceMappingURL=frame.js.map