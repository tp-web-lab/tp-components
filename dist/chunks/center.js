import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/center/center.css?inline
var t = "tp-center{box-sizing:content-box;max-inline-size:var(--tp-center-width,60ch);margin-inline:auto;display:block}tp-center[intrinsic]{flex-direction:column;align-items:center;display:flex}", n = class n extends e {
	static styleId = "tp-center-styles";
	static get observedAttributes() {
		return [
			"max-inline-size",
			"center-text",
			"padding-inline",
			"intrinsic"
		];
	}
	get maxInlineSize() {
		return this.getAttribute("max-inline-size") ?? "";
	}
	set maxInlineSize(e) {
		if (e === "") {
			this.removeAttribute("max-inline-size");
			return;
		}
		this.setAttribute("max-inline-size", e);
	}
	get centerText() {
		return this.hasAttribute("center-text");
	}
	set centerText(e) {
		if (e) {
			this.setAttribute("center-text", "");
			return;
		}
		this.removeAttribute("center-text");
	}
	get paddingInline() {
		return this.getAttribute("padding-inline") ?? "";
	}
	set paddingInline(e) {
		if (e === "") {
			this.removeAttribute("padding-inline");
			return;
		}
		this.setAttribute("padding-inline", e);
	}
	get intrinsic() {
		return this.hasAttribute("intrinsic");
	}
	set intrinsic(e) {
		if (e) {
			this.setAttribute("intrinsic", "");
			return;
		}
		this.removeAttribute("intrinsic");
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
		this.style.maxInlineSize = this.maxInlineSize, this.style.textAlign = this.centerText ? "center" : "";
		let e = this.paddingInline;
		this.style.paddingInlineStart = e, this.style.paddingInlineEnd = e;
	}
};
customElements.get("tp-center") || customElements.define("tp-center", n);
//#endregion
export { n as t };

//# sourceMappingURL=center.js.map