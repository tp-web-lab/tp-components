import { t as e } from "./base.js";
//#region src/components/switcher/switcher.css?inline
var t = "tp-switcher{gap:var(--tp-switcher-gap,1rem);flex-wrap:wrap;display:flex}tp-switcher>*{flex-basis:calc((var(--tp-switcher-threshold,30rem) - 100%) * 999);flex-grow:1}", n = 0;
function r(e) {
	return /^[1-9]\d*$/.test(e);
}
var i = class i extends e {
	static styleId = "tp-switcher-styles";
	maxHorizontalStyleEl = null;
	instanceId = null;
	static get observedAttributes() {
		return [
			"threshold",
			"gap",
			"max-horizontal"
		];
	}
	get threshold() {
		return this.getAttribute("threshold") ?? "";
	}
	set threshold(e) {
		if (e === "") {
			this.removeAttribute("threshold");
			return;
		}
		this.setAttribute("threshold", e);
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
	get maxHorizontal() {
		let e = this.getAttribute("max-horizontal");
		return e === null || !r(e) ? null : Number(e);
	}
	set maxHorizontal(e) {
		if (e === null) {
			this.removeAttribute("max-horizontal");
			return;
		}
		if (!Number.isInteger(e) || e < 1) throw TypeError("The \"max-horizontal\" attribute must be a positive integer.");
		this.setAttribute("max-horizontal", String(e));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureInstanceId(), this.updateStyles(), this.updateMaxHorizontalStyle();
	}
	attributeChangedCallback(e) {
		this.updateStyles(), e === "max-horizontal" && this.updateMaxHorizontalStyle();
	}
	disconnectedCallback() {
		super.connectedCallback(), this.removeMaxHorizontalStyle();
	}
	ensureStyles() {
		if (document.getElementById(i.styleId)) return;
		let e = document.createElement("style");
		e.id = i.styleId, e.textContent = t, document.head.append(e);
	}
	ensureInstanceId() {
		this.instanceId === null && (n += 1, this.instanceId = `tp-switcher-${String(n)}`, this.setAttribute("data-tp-switcher-id", this.instanceId));
	}
	updateStyles() {
		this.threshold === "" ? this.style.removeProperty("--tp-switcher-threshold") : this.style.setProperty("--tp-switcher-threshold", this.threshold), this.gap === "" ? this.style.removeProperty("--tp-switcher-gap") : this.style.setProperty("--tp-switcher-gap", this.gap);
	}
	updateMaxHorizontalStyle() {
		if (this.removeMaxHorizontalStyle(), !this.isConnected) return;
		let e = this.maxHorizontal;
		if (e === null) return;
		this.ensureInstanceId();
		let t = `tp-switcher[data-tp-switcher-id="${String(this.instanceId)}"]`, n = document.createElement("style");
		n.textContent = `${t} > * {flex-basis: max(calc((var(--tp-switcher-threshold, 30rem) - 100%) * 999), calc((100% - ${String(e - 1)} * var(--tp-switcher-gap, 1rem)) / ${String(e)}));}`, document.head.append(n), this.maxHorizontalStyleEl = n;
	}
	removeMaxHorizontalStyle() {
		this.maxHorizontalStyleEl?.remove(), this.maxHorizontalStyleEl = null;
	}
};
customElements.get("tp-switcher") || customElements.define("tp-switcher", i);
//#endregion
export { i as t };

//# sourceMappingURL=switcher.js.map