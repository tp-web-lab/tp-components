import { Ku as e } from "./lib/typescript/typescript.js";
import "./avatar.js";
//#region src/components/avatar-group/avatar-group.css?inline
var t = "tp-avatar-group{isolation:isolate;vertical-align:middle;align-items:center;max-inline-size:100%;display:inline-flex}tp-avatar-group>tp-avatar{z-index:var(--tp-avatar-group-index);position:relative}tp-avatar-group>tp-avatar~tp-avatar{margin-inline-start:calc(-1 * var(--tp-avatar-group-overlap,.75rem))}tp-avatar-group[data-orientation=vertical]{flex-direction:column}tp-avatar-group[data-orientation=vertical]>tp-avatar~tp-avatar{margin-block-start:calc(-1 * var(--tp-avatar-group-overlap,.75rem));margin-inline-start:0}", n = class extends e {
	managed = /* @__PURE__ */ new Set();
	observer = new MutationObserver(() => this.update());
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"offset",
			"order",
			"orientation"
		];
	}
	get offset() {
		let e = this.getAttribute("offset")?.trim() ?? "";
		return /^(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|ch|ex|cap|lh|rlh|vw|vh|vi|vb|vmin|vmax|cm|mm|in|pt|pc))$/i.test(e) ? e : "0.75rem";
	}
	set offset(e) {
		this.setStringAttribute("offset", e);
	}
	get order() {
		return this.getAttribute("order") === "rtl" ? "rtl" : "ltr";
	}
	set order(e) {
		this.setStringAttribute("order", e);
	}
	get orientation() {
		return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
	}
	set orientation(e) {
		this.setStringAttribute("orientation", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-avatar-group-styles", t), this.update(), this.observer.observe(this, { childList: !0 });
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.managed.forEach((e) => {
			e.style.removeProperty("--tp-avatar-group-index");
		}), this.managed.clear();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.isConnected && this.update();
	}
	update() {
		this.dataset.orientation = this.orientation, this.style.setProperty("--tp-avatar-group-overlap", this.offset);
		let e = Array.from(this.children).filter((e) => e instanceof HTMLElement && e.localName === "tp-avatar");
		this.managed.forEach((t) => {
			e.includes(t) || (t.style.removeProperty("--tp-avatar-group-index"), this.managed.delete(t));
		}), e.forEach((t, n) => {
			t.style.setProperty("--tp-avatar-group-index", String(this.order === "ltr" ? n + 1 : e.length - n)), this.managed.add(t);
		});
	}
};
customElements.get("tp-avatar-group") || customElements.define("tp-avatar-group", n);
//#endregion
export { n as t };

