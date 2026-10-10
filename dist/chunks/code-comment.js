import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/code-comment/code-comment.css?inline
var t = "tp-code-comment{min-inline-size:0;display:flow-root}tp-code-comment:not([open])>ol{display:none}tp-code-comment>ol>li{padding-inline-start:.25em;position:relative}tp-code-comment>ol>li:has(>[data-code-comment-number]:not([hidden]))::marker{color:#0000}tp-code-comment>ol>li>[data-code-comment-number]{color:var(--tp-text-body,CanvasText);position:absolute;inset-block-start:.15em;inset-inline-start:-1.5em}tp-code-comment [data-code-comment-number] svg>circle[fill=white]{fill:var(--tp-paper-color,Canvas)}", n = class extends e {
	target = null;
	items = [];
	icons = /* @__PURE__ */ new Map();
	status = null;
	observer = new MutationObserver(() => this.sync());
	static get observedAttributes() {
		return [...e.observedAttributes, "for"];
	}
	get htmlFor() {
		return this.getAttribute("for") ?? "";
	}
	set htmlFor(e) {
		this.setAttribute("for", e);
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(e) {
		this.toggleAttribute("open", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-code-comment-style", t), this.sync(!0), this.observer.observe(this.ownerDocument.documentElement, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: ["id"]
		});
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), e === "for" && t !== n && this.isConnected && this.sync(!0);
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.target?.setCodeCommentNumbers(this, []), this.target = null;
		for (let e of this.icons.values()) e.remove();
		this.icons.clear(), this.items = [], this.status?.remove(), this.status = null;
	}
	sync(e = !1) {
		let t = this.htmlFor ? this.ownerDocument.getElementById(this.htmlFor) : null, n = t?.localName === "tp-code-editor" && typeof t.setCodeCommentNumbers == "function" ? t : null, r = this.querySelector(":scope > ol"), i = r ? Array.from(r.children).filter((e) => e instanceof HTMLLIElement) : [];
		if (!e && n === this.target && i.length === this.items.length && i.every((e, t) => e === this.items[t])) return;
		n !== this.target && this.target?.setCodeCommentNumbers(this, []), this.target = n, this.items = i;
		for (let [e, t] of this.icons) i.includes(e) || (t.remove(), this.icons.delete(e));
		for (let [e, t] of i.entries()) {
			let n = this.icons.get(t);
			n || (n = document.createElement("tp-icon"), n.setAttribute("data-code-comment-number", ""), n.setAttribute("library", "numbers"), n.setAttribute("size", "1.25em"), n.setAttribute("aria-hidden", "true"), this.icons.set(t, n), t.prepend(n)), n.setAttribute("name", String(Math.min(e + 1, 99))), n.hidden = e >= 99;
		}
		n?.setCodeCommentNumbers(this, i.slice(0, 99).map((e, t) => t + 1), new Map(i.slice(0, 99).map((e, t) => [t + 1, e])));
		let a = !r || !i.length ? "Provide an ordered list of code comments." : n ? i.length > 99 ? "Numbered icons are available for comments 1 to 99." : "" : `No tp-code-editor found with id "${this.htmlFor}".`;
		a ? (this.status || (this.status = document.createElement("tp-callout"), this.status.setAttribute("variant", "warning"), this.status.setAttribute("role", "status"), this.append(this.status)), this.status.textContent = a) : (this.status?.remove(), this.status = null);
	}
};
customElements.get("tp-code-comment") || customElements.define("tp-code-comment", n);
//#endregion
export { n as t };

//# sourceMappingURL=code-comment.js.map