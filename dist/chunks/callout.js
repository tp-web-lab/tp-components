import { t as e } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { isTpVariantType as t } from "../components/base/base.types.js";
//#region src/components/callout/callout.css?inline
var n = "tp-callout{--tp-callout-accent:var(--tp-neutral-text-colorful);--tp-callout-background:var(--tp-neutral-fill-softer);--tp-callout-foreground:var(--tp-text-body);--tp-callout-border-color:var(--tp-neutral-stroke-soft);--tp-callout-border-width:4px;--tp-callout-radius:.75rem;--tp-callout-padding-block:.875rem;--tp-callout-padding-inline:1rem;--tp-callout-heading-font-size:1rem;--tp-callout-heading-gap:.625rem;background:var(--tp-callout-background);border:1px solid var(--tp-callout-border-color);border-inline-start:var(--tp-callout-border-width) solid var(--tp-callout-accent);border-radius:var(--tp-callout-radius);color:var(--tp-callout-foreground);padding-block:var(--tp-callout-padding-block);padding-inline:var(--tp-callout-padding-inline);margin-bottom:.5rem;display:flow-root}tp-callout :where(code,samp,tt){color:var(--tp-callout-foreground)}tp-callout[variant=success]{--tp-callout-accent:var(--tp-success-text-colorful);--tp-callout-background:var(--tp-success-fill-softer);--tp-callout-foreground:var(--tp-success-text-on-soft);--tp-callout-border-color:var(--tp-success-stroke-soft)}tp-callout[variant=danger]{--tp-callout-accent:var(--tp-danger-text-colorful);--tp-callout-background:var(--tp-danger-fill-softer);--tp-callout-foreground:var(--tp-danger-text-on-soft);--tp-callout-border-color:var(--tp-danger-stroke-soft)}tp-callout[variant=warning]{--tp-callout-accent:var(--tp-warning-text-colorful);--tp-callout-background:var(--tp-warning-fill-softer);--tp-callout-foreground:var(--tp-warning-text-on-soft);--tp-callout-border-color:var(--tp-warning-stroke-soft)}tp-callout[variant=info]{--tp-callout-accent:var(--tp-info-text-colorful);--tp-callout-background:var(--tp-info-fill-softer);--tp-callout-foreground:var(--tp-info-text-on-soft);--tp-callout-border-color:var(--tp-info-stroke-soft)}tp-callout[variant=neutral]{--tp-callout-accent:var(--tp-neutral-text-colorful);--tp-callout-background:var(--tp-neutral-fill-softer);--tp-callout-foreground:var(--tp-text-body);--tp-callout-border-color:var(--tp-neutral-stroke-soft)}tp-callout[variant=brand]{--tp-callout-accent:var(--tp-brand-text-colorful);--tp-callout-background:var(--tp-brand-fill-softer);--tp-callout-foreground:var(--tp-brand-text-on-soft);--tp-callout-border-color:var(--tp-brand-stroke-soft)}tp-callout[outlined]{--tp-callout-background:transparent}tp-callout[data-tp-callout-toast]{box-shadow:var(--tp-shadow-l,0 1rem 2rem #0000002e);inline-size:min(28rem,100vw - 2rem);z-index:var(--tp-z-index-toast,1100);margin:0;position:fixed;inset-block-start:1rem;inset-inline-end:1rem}tp-callout>[data-tp-callout-heading]{color:var(--tp-callout-foreground);font-size:var(--tp-callout-heading-font-size);align-items:center;gap:.4em;margin-block-end:var(--tp-callout-heading-gap);font-weight:700;line-height:1.2;display:flex}tp-callout>[data-tp-callout-heading]>tp-icon{--tp-icon-size:1.75em;flex:none}tp-callout>[data-tp-callout-heading]>[data-tp-callout-close]{flex:none;margin-inline-start:auto}tp-callout>[data-tp-callout-heading][hidden]{display:none}tp-callout>:first-child{margin-block-start:0}tp-callout>:last-child{margin-block-end:0}", r = class r extends e {
	static calloutStyleId = "tp-callout-styles";
	headingEl = null;
	toastTimeoutId = null;
	handleCloseClick = () => {
		this.closeCallout();
	};
	static get observedAttributes() {
		return [
			"variant",
			"heading",
			"icon",
			"library",
			"closable",
			"outlined",
			"title"
		];
	}
	get variant() {
		let e = this.getAttribute("variant");
		return e !== null && t(e) ? e : "neutral";
	}
	set variant(e) {
		this.setStringAttribute("variant", e);
	}
	get title() {
		return this.getStringAttribute("heading");
	}
	set title(e) {
		this.setStringAttribute("heading", e);
	}
	get heading() {
		return this.getStringAttribute("heading");
	}
	set heading(e) {
		this.setStringAttribute("heading", e);
	}
	get icon() {
		return this.getStringAttribute("icon");
	}
	set icon(e) {
		this.setStringAttribute("icon", e);
	}
	get library() {
		return this.getStringAttribute("library");
	}
	set library(e) {
		this.setStringAttribute("library", e);
	}
	get closable() {
		return this.getBooleanAttribute("closable");
	}
	set closable(e) {
		this.setBooleanAttribute("closable", e);
	}
	get outlined() {
		return this.getBooleanAttribute("outlined");
	}
	set outlined(e) {
		this.setBooleanAttribute("outlined", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.calloutStyleId, n), this.migrateNativeTitleAttribute(), this.ensureHeadingElement(), this.updateCallout();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (e === "title" && this.migrateNativeTitleAttribute(), this.ensureHeadingElement(), this.updateCallout());
	}
	disconnectedCallback() {
		this.clearToastTimeout();
	}
	toast(e = 3e3) {
		this.clearToastTimeout(), this.hidden = !1, this.setAttribute("data-tp-callout-toast", ""), this.setAttribute("role", "status"), e > 0 && (this.toastTimeoutId = window.setTimeout(() => {
			this.closeCallout();
		}, e));
	}
	migrateNativeTitleAttribute() {
		let e = this.getAttribute("title");
		e !== null && (this.hasAttribute("heading") || this.setAttribute("heading", e), this.removeAttribute("title"));
	}
	ensureHeadingElement() {
		let e = this.querySelector(":scope > [data-tp-callout-heading]");
		if (e instanceof HTMLDivElement) {
			this.headingEl = e;
			return;
		}
		let t = document.createElement("div");
		t.setAttribute("data-tp-callout-heading", ""), this.prepend(t), this.headingEl = t;
	}
	updateCallout() {
		this.setAttribute("variant", this.variant), this.syncHeading();
	}
	syncHeading() {
		if (!(this.headingEl instanceof HTMLDivElement)) return;
		let e = this.heading.trim(), t = this.icon.trim(), n = this.library.trim();
		if (e === "" && t === "" && !this.closable) {
			this.headingEl.hidden = !0, this.headingEl.replaceChildren();
			return;
		}
		if (this.headingEl.hidden = !1, this.headingEl.replaceChildren(), t !== "") {
			let e = document.createElement("tp-icon");
			e.setAttribute("size", "1.75em"), e.setAttribute("name", t), e.setAttribute("aria-hidden", "true"), n !== "" && e.setAttribute("library", n), this.headingEl.append(e);
		}
		if (e !== "") {
			let t = document.createElement("span");
			t.setAttribute("data-tp-callout-heading-text", ""), t.textContent = e, this.headingEl.append(t);
		}
		if (this.closable) {
			let e = document.createElement("tp-icon-button");
			e.setAttribute("name", "close"), e.setAttribute("size", "xs"), e.setAttribute("variant", "neutral"), e.setAttribute("label", "Close callout"), e.setAttribute("data-tp-callout-close", ""), e.addEventListener("click", this.handleCloseClick), this.headingEl.append(e);
		}
	}
	clearToastTimeout() {
		this.toastTimeoutId !== null && (window.clearTimeout(this.toastTimeoutId), this.toastTimeoutId = null);
	}
	closeCallout() {
		let e = this.hasAttribute("data-tp-callout-toast");
		this.clearToastTimeout(), this.hidden = !0, this.removeAttribute("data-tp-callout-toast"), e && this.getAttribute("role") === "status" && this.removeAttribute("role");
	}
};
customElements.get("tp-callout") || customElements.define("tp-callout", r);
//#endregion
export { r as t };

//# sourceMappingURL=callout.js.map