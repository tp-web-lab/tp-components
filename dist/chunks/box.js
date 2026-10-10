import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/box/box.css?inline
var t = "tp-box{padding:var(--tp-box-padding,1rem);border:var(--tp-box-border-width,1px) solid currentColor;border-radius:var(--tp-box-border-radius,0px);color:var(--tp-box-color,var(--tp-text-body,inherit));background:var(--tp-box-background,var(--tp-paper-color,transparent));display:flow-root}tp-box :where(code,samp,tt){color:var(--tp-box-color,var(--tp-text-body,inherit))}tp-box>p:last-child{margin-block-end:0}tp-box[invert]{--tp-box-background:var(--tp-neutral-950);--tp-box-color:var(--tp-neutral-200);--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}.tp-dark tp-box[invert]{--tp-box-background:white;--tp-box-color:var(--tp-neutral-900);--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}", n = class n extends e {
	static styleId = "tp-box-styles";
	static get observedAttributes() {
		return [
			"padding",
			"border-width",
			"border-radius",
			"invert"
		];
	}
	get padding() {
		return this.getAttribute("padding") ?? "";
	}
	set padding(e) {
		if (e === "") {
			this.removeAttribute("padding");
			return;
		}
		this.setAttribute("padding", e);
	}
	get borderWidth() {
		return this.getAttribute("border-width") ?? "";
	}
	set borderWidth(e) {
		if (e === "") {
			this.removeAttribute("border-width");
			return;
		}
		this.setAttribute("border-width", e);
	}
	get borderRadius() {
		return this.getAttribute("border-radius") ?? "";
	}
	set borderRadius(e) {
		if (e === "") {
			this.removeAttribute("border-radius");
			return;
		}
		this.setAttribute("border-radius", e);
	}
	get invert() {
		return this.hasAttribute("invert");
	}
	set invert(e) {
		if (e) {
			this.setAttribute("invert", "");
			return;
		}
		this.removeAttribute("invert");
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.updateStyles();
	}
	attributeChangedCallback() {
		this.updateStyles();
	}
	ensureStyles() {
		if (document.getElementById(n.styleId)) return;
		let e = document.createElement("style");
		e.id = n.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		this.padding === "" ? this.style.removeProperty("--tp-box-padding") : this.style.setProperty("--tp-box-padding", this.padding), this.borderWidth === "" ? this.style.removeProperty("--tp-box-border-width") : this.style.setProperty("--tp-box-border-width", this.borderWidth), this.borderRadius === "" ? this.style.removeProperty("--tp-box-border-radius") : this.style.setProperty("--tp-box-border-radius", this.borderRadius);
	}
};
customElements.get("tp-box") || customElements.define("tp-box", n);
//#endregion
export { n as t };

//# sourceMappingURL=box.js.map