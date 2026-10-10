import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/stack/stack.css?inline
var t = "tp-stack{flex-direction:column;justify-content:flex-start;display:flex}tp-stack *{margin-block:0}tp-stack:not([recursive])>*+*,tp-stack[recursive] *+*{margin-block-start:var(--stack-gap,1rem)}tp-stack[split-after]:only-child{block-size:100%}", n = 0, r = class r extends e {
	static styleId = "tp-stack-styles";
	splitStyleEl = null;
	instanceId = null;
	static get observedAttributes() {
		return ["recursive", "split-after"];
	}
	get recursive() {
		return this.hasAttribute("recursive");
	}
	set recursive(e) {
		if (e) {
			this.setAttribute("recursive", "");
			return;
		}
		this.removeAttribute("recursive");
	}
	get splitAfter() {
		let e = this.getAttribute("split-after");
		if (e === null) return null;
		let t = Number(e);
		return !Number.isInteger(t) || t < 1 ? null : t;
	}
	set splitAfter(e) {
		if (e === null) {
			this.removeAttribute("split-after");
			return;
		}
		this.setAttribute("split-after", String(e));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureInstanceId(), this.updateSplitStyle();
	}
	attributeChangedCallback(e) {
		e === "split-after" && this.updateSplitStyle();
	}
	disconnectedCallback() {
		super.connectedCallback(), this.removeSplitStyle();
	}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	ensureInstanceId() {
		this.instanceId === null && (n += 1, this.instanceId = `tp-stack-${String(n)}`, this.setAttribute("data-tp-stack-id", this.instanceId));
	}
	updateSplitStyle() {
		this.removeSplitStyle();
		let e = this.splitAfter;
		if (e === null) return;
		this.ensureInstanceId();
		let t = document.createElement("style");
		t.textContent = `tp-stack[data-tp-stack-id="${String(this.instanceId)}"] > :nth-child(${String(e)}) {margin-block-end: auto;}`, document.head.append(t), this.splitStyleEl = t;
	}
	removeSplitStyle() {
		this.splitStyleEl?.remove(), this.splitStyleEl = null;
	}
};
customElements.get("tp-stack") || customElements.define("tp-stack", r);
//#endregion
export { r as t };

//# sourceMappingURL=stack.js.map