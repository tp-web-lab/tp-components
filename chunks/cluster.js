import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/cluster/cluster.css?inline
var t = "tp-cluster{align-items:center;gap:var(--tp-cluster-gap,1rem);flex-wrap:wrap;justify-content:flex-start;display:flex}", n = class n extends e {
	static styleId = "tp-cluster-styles";
	static get observedAttributes() {
		return [
			"justify",
			"align",
			"gap"
		];
	}
	get justify() {
		return this.getAttribute("justify") ?? "";
	}
	set justify(e) {
		if (e === "") {
			this.removeAttribute("justify");
			return;
		}
		this.setAttribute("justify", e);
	}
	get align() {
		return this.getAttribute("align") ?? "";
	}
	set align(e) {
		if (e === "") {
			this.removeAttribute("align");
			return;
		}
		this.setAttribute("align", e);
	}
	get gap() {
		return this.getAttribute("gap") ?? "";
	}
	set gap(e) {
		if (e === "") {
			this.removeAttribute("gap");
			return;
		}
		this.setAttribute("gap", e);
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
		if (document.getElementById(n.styleId)) return;
		let e = document.createElement("style");
		e.id = n.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		this.style.justifyContent = this.justify || "flex-start", this.style.alignItems = this.align || "center", this.style.gap = this.gap || "var(--tp-cluster-gap, 1rem)";
	}
};
customElements.get("tp-cluster") || customElements.define("tp-cluster", n);
//#endregion
export { n as t };

