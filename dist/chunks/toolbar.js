import { t as e } from "./base.js";
//#region src/components/toolbar/toolbar.css?inline
var t = "tp-toolbar{z-index:var(--tp-toolbar-z-index,100);align-items:center;gap:var(--tp-toolbar-gap,.25rem);padding:var(--tp-toolbar-padding,.25rem .5rem);background:inherit;display:flex;position:sticky}tp-toolbar[data-orientation=horizontal]{min-block-size:var(--tp-toolbar-size,3rem);flex-direction:row;inline-size:100%;inset-inline:0}tp-toolbar[data-orientation=horizontal][data-placement=top]{top:0}tp-toolbar[data-orientation=horizontal][data-placement=bottom]{bottom:0}tp-toolbar[data-orientation=vertical]{min-inline-size:var(--tp-toolbar-size,3rem);flex-direction:column;justify-content:flex-start;align-self:flex-start;align-items:center;block-size:100%}tp-toolbar[data-orientation=vertical][data-placement=start]{left:0}tp-toolbar[data-orientation=vertical][data-placement=end]{right:0}tp-toolbar>[data-toolbar-start],tp-toolbar>[data-toolbar-center],tp-toolbar>[data-toolbar-end]{align-items:center;gap:var(--tp-toolbar-section-gap,.25rem);flex-shrink:0;display:flex}tp-toolbar>[data-toolbar-center]{flex:1;justify-content:center}tp-toolbar>[data-toolbar-end]{margin-inline-start:auto}tp-toolbar[data-orientation=vertical]>[data-toolbar-start],tp-toolbar[data-orientation=vertical]>[data-toolbar-center],tp-toolbar[data-orientation=vertical]>[data-toolbar-end]{flex-direction:column;align-items:center}tp-toolbar[data-orientation=vertical]>[data-toolbar-center]{flex:1;justify-content:center}tp-toolbar[data-orientation=vertical]>[data-toolbar-end]{margin-block-start:auto;margin-inline-start:0}tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-toolbar>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start:1px solid var(--tp-brand-stroke-soft,#d1d5db);margin-inline-start:var(--tp-toolbar-section-gap,.25rem);padding-inline-start:var(--tp-toolbar-section-gap,.25rem)}tp-toolbar[data-orientation=vertical]>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-toolbar[data-orientation=vertical]>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-toolbar[data-orientation=vertical]>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start:none;border-block-start:1px solid var(--tp-brand-stroke-soft,#d1d5db);margin-block-start:var(--tp-toolbar-section-gap,.25rem);margin-inline-start:0;padding-block-start:var(--tp-toolbar-section-gap,.25rem);padding-inline-start:0}";
//#endregion
//#region src/components/toolbar/toolbar.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
function r(e) {
	return e === "top" || e === "bottom" || e === "start" || e === "end";
}
var i = class i extends e {
	static styleId = "tp-toolbar-styles";
	childObserver = null;
	startSection = null;
	centerSection = null;
	endSection = null;
	static get observedAttributes() {
		return ["orientation", "placement"];
	}
	get orientation() {
		let e = this.getAttribute("orientation") ?? "horizontal";
		return n(e) ? e : "horizontal";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	get placement() {
		let e = this.getAttribute("placement");
		return e !== null && r(e) ? e : this.orientation === "vertical" ? "start" : "top";
	}
	set placement(e) {
		this.setAttribute("placement", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.styleId, t), this.buildSections(), this.distributeExistingChildren(), this.updateDataAttributes(), this.startObserving();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (e === "orientation" || e === "placement") && this.updateDataAttributes();
	}
	disconnectedCallback() {
		this.childObserver?.disconnect(), this.childObserver = null;
	}
	addButtonToSection(e, t) {
		if (!this.startSection || !this.centerSection || !this.endSection) throw Error("Toolbar sections are not initialized.");
		switch (t) {
			case "start":
				this.startSection.appendChild(e);
				break;
			case "center":
				this.centerSection.appendChild(e);
				break;
			case "end":
				this.endSection.appendChild(e);
				break;
			default: throw Error(`Invalid section: ${t}`);
		}
	}
	buildSections() {
		let e = this.querySelector("[data-toolbar-start]"), t = this.querySelector("[data-toolbar-center]"), n = this.querySelector("[data-toolbar-end]");
		e === null && (e = document.createElement("div"), e.setAttribute("data-toolbar-start", ""), t = document.createElement("div"), t.setAttribute("data-toolbar-center", ""), n = document.createElement("div"), n.setAttribute("data-toolbar-end", ""), this.append(e, t, n)), this.startSection = e, this.centerSection = t, this.endSection = n;
	}
	distributeExistingChildren() {
		let e = Array.from(this.children).filter((e) => !e.hasAttribute("data-toolbar-start") && !e.hasAttribute("data-toolbar-center") && !e.hasAttribute("data-toolbar-end"));
		for (let t of e) this.assignToSection(t);
	}
	assignToSection(e) {
		if (e.localName === "p" && e.attributes.length === 0 && e.children.length > 0 && Array.from(e.childNodes).every((e) => e instanceof HTMLElement ? e.hasAttribute("section") : e.nodeType === Node.TEXT_NODE && !e.textContent?.trim())) {
			for (let t of Array.from(e.children)) t instanceof HTMLElement && this.assignToSection(t);
			e.remove();
			return;
		}
		let t = e.getAttribute("section") ?? "start";
		(t === "center" ? this.centerSection : t === "end" ? this.endSection : this.startSection)?.append(e);
	}
	updateDataAttributes() {
		this.setAttribute("data-orientation", this.orientation), this.setAttribute("data-placement", this.placement);
	}
	startObserving() {
		this.childObserver = new MutationObserver((e) => {
			for (let t of e) for (let e of t.addedNodes) e instanceof HTMLElement && (e.hasAttribute("data-toolbar-start") || e.hasAttribute("data-toolbar-center") || e.hasAttribute("data-toolbar-end") || this.assignToSection(e));
		}), this.childObserver.observe(this, { childList: !0 });
	}
};
customElements.get("tp-toolbar") || customElements.define("tp-toolbar", i);
//#endregion
export { i as t };

//# sourceMappingURL=toolbar.js.map