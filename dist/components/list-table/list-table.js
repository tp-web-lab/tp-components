import { Ku as e } from "../../chunks/lib/typescript/typescript.js";
import { t } from "../../chunks/content-table.js";
import { createContentTable as n } from "../../utilities/content-table.js";
//#region src/components/list-table/list-table.ts
var r = class extends e {
	rows = null;
	timer = null;
	observer = new MutationObserver((e) => {
		e.some((e) => [...e.addedNodes].some((e) => e instanceof Element && e.matches("ul, ol, li")) || e.target instanceof Element && e.target.closest("ul, ol")) && this.schedule();
	});
	static get observedAttributes() {
		return [...e.observedAttributes, "heading"];
	}
	get heading() {
		return this.hasAttribute("heading");
	}
	set heading(e) {
		this.toggleAttribute("heading", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-content-table-styles", t), this.rows || this.observer.observe(this, {
			childList: !0,
			subtree: !0
		}), this.schedule();
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.timer !== null && clearTimeout(this.timer), this.timer = null;
	}
	attributeChangedCallback() {
		this.isConnected && this.schedule();
	}
	schedule() {
		this.timer !== null && clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.timer = null, this.render();
		}, 0);
	}
	render() {
		if (!this.rows) {
			let e = this.querySelectorAll(":scope > ul, :scope > ol"), t = e[0], n = t ? [...t.children].filter((e) => e.tagName === "LI") : [];
			if (e.length !== 1 || !n.length) {
				this.warn("Provide one nonempty ul or ol list to display a table.");
				return;
			}
			let r = [];
			for (let e of n) {
				let t = e.querySelectorAll(":scope > ul, :scope > ol");
				if (t.length > 1 || t.length === 1 && [...e.childNodes].some((e) => e !== t[0] && e.textContent?.trim())) {
					this.warn("Each row must contain only one cell list, or a single cell of content.");
					return;
				}
				let n = t[0] ? [...t[0].children].filter((e) => e.tagName === "LI") : [e];
				if (!n.length) {
					this.warn("Each table row must contain at least one cell.");
					return;
				}
				r.push(n.map((e) => [...e.childNodes]));
			}
			this.rows = r, this.observer.disconnect();
		}
		let e = n(this.rows, this.heading, this.ownerDocument);
		this.replaceChildren(e);
	}
	warn(e) {
		let t = this.querySelector(":scope > tp-callout[data-tp-table-error]");
		t || (t = document.createElement("tp-callout"), t.setAttribute("data-tp-table-error", ""), t.setAttribute("variant", "warning"), this.append(t)), t.textContent = e;
	}
};
customElements.get("tp-list-table") || customElements.define("tp-list-table", r);
//#endregion
export { r as TpListTable };

//# sourceMappingURL=list-table.js.map