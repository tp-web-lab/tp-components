import { t as e } from "./base.js";
import { isTpSizeType as t, isTpVariantType as n } from "../components/base/base.types.js";
//#region src/components/button/button.css?inline
var r = "tp-button{--tp-button-accent:var(--tp-neutral-text-colorful);--tp-button-background:var(--tp-neutral-fill-loud);--tp-button-foreground:var(--tp-neutral-text-on-loud);--tp-button-border-color:var(--tp-neutral-stroke-mid);--tp-button-outline-background:var(--tp-neutral-fill-softer);--tp-button-focus-ring-color:var(--tp-focus-color);--tp-button-radius:.5em;--tp-button-font-size:.875em;--tp-button-padding-block:.35em;--tp-button-padding-inline:.7em;--tp-button-spinner-size:1em;--tp-button-spinner-border-width:2px;vertical-align:middle;align-items:center;max-inline-size:100%;line-height:1;display:inline-flex}tp-button[variant=success]{--tp-button-accent:var(--tp-success-text-colorful);--tp-button-background:var(--tp-success-fill-loud);--tp-button-foreground:var(--tp-success-text-on-loud);--tp-button-border-color:var(--tp-success-stroke-mid);--tp-button-outline-background:var(--tp-success-fill-softer)}tp-button[variant=danger]{--tp-button-accent:var(--tp-danger-text-colorful);--tp-button-background:var(--tp-danger-fill-loud);--tp-button-foreground:var(--tp-danger-text-on-loud);--tp-button-border-color:var(--tp-danger-stroke-mid);--tp-button-outline-background:var(--tp-danger-fill-softer)}tp-button[variant=warning]{--tp-button-accent:var(--tp-warning-text-colorful);--tp-button-background:var(--tp-warning-fill-loud);--tp-button-foreground:var(--tp-warning-text-on-loud);--tp-button-border-color:var(--tp-warning-stroke-mid);--tp-button-outline-background:var(--tp-warning-fill-softer)}tp-button[variant=info]{--tp-button-accent:var(--tp-info-text-colorful);--tp-button-background:var(--tp-info-fill-loud);--tp-button-foreground:var(--tp-info-text-on-loud);--tp-button-border-color:var(--tp-info-stroke-mid);--tp-button-outline-background:var(--tp-info-fill-softer)}tp-button[variant=neutral]{--tp-button-accent:var(--tp-neutral-text-colorful);--tp-button-background:var(--tp-neutral-fill-loud);--tp-button-foreground:var(--tp-neutral-text-on-loud);--tp-button-border-color:var(--tp-neutral-stroke-mid);--tp-button-outline-background:var(--tp-neutral-fill-softer)}tp-button[variant=brand]{--tp-button-accent:var(--tp-brand-text-colorful);--tp-button-background:var(--tp-brand-fill-loud);--tp-button-foreground:var(--tp-brand-text-on-loud);--tp-button-border-color:var(--tp-brand-stroke-mid);--tp-button-outline-background:var(--tp-brand-fill-softer)}tp-button[outlined]{--tp-button-background:transparent;--tp-button-foreground:var(--tp-button-accent)}tp-button[pill]{--tp-button-radius:999px}tp-button>button,tp-button>a{appearance:none;background:var(--tp-button-background);border:1px solid var(--tp-button-border-color);border-radius:var(--tp-button-radius);box-shadow:none;color:var(--tp-button-foreground);cursor:pointer;font:inherit;font-size:var(--tp-button-font-size);min-block-size:24px;inline-size:auto;min-inline-size:24px;max-inline-size:100%;padding-block:var(--tp-button-padding-block);padding-inline:var(--tp-button-padding-inline);text-align:center;-webkit-user-select:none;user-select:none;vertical-align:middle;white-space:nowrap;outline:none;justify-content:center;align-items:center;gap:.25em;margin:0;font-weight:600;line-height:1;text-decoration:none;transition:background-color .15s,border-color .15s,color .15s,box-shadow .15s,filter .15s,opacity .15s,transform .15s;display:inline-flex;position:relative}tp-button>a:any-link,tp-button>a:any-link>[data-tp-button-content]{color:var(--tp-button-foreground)}tp-button[outlined]>button,tp-button[outlined]>a{border-color:var(--tp-button-accent)}tp-button>button>[data-tp-button-content],tp-button>a>[data-tp-button-content]{gap:inherit;display:inline-flex}tp-button>button>[data-tp-button-spinner],tp-button>a>[data-tp-button-spinner]{block-size:var(--tp-button-spinner-size);border:var(--tp-button-spinner-border-width) solid color-mix(in srgb, currentColor 28%, transparent);box-sizing:border-box;inline-size:var(--tp-button-spinner-size);opacity:0;pointer-events:none;border-top-color:currentColor;border-radius:999px;position:absolute}tp-button[size=xxs]{--tp-button-font-size:.625em;--tp-button-padding-block:.15em;--tp-button-padding-inline:.4em;--tp-button-spinner-size:.75em;--tp-button-spinner-border-width:1.5px}tp-button[size=xs]{--tp-button-font-size:.6875em;--tp-button-padding-block:.2em;--tp-button-padding-inline:.5em;--tp-button-spinner-size:.8em}tp-button[size=s]{--tp-button-font-size:.75em;--tp-button-padding-block:.25em;--tp-button-padding-inline:.55em;--tp-button-spinner-size:.9em}tp-button[size=m]{--tp-button-font-size:.875em;--tp-button-padding-block:.35em;--tp-button-padding-inline:.7em;--tp-button-spinner-size:1em}tp-button[size=l]{--tp-button-font-size:.95em;--tp-button-padding-block:.42em;--tp-button-padding-inline:.8em;--tp-button-spinner-size:1.05em}tp-button[size=xl]{--tp-button-font-size:1em;--tp-button-padding-block:.5em;--tp-button-padding-inline:.9em;--tp-button-spinner-size:1.1em}tp-button[size=xxl]{--tp-button-font-size:1.125em;--tp-button-padding-block:.6em;--tp-button-padding-inline:1em;--tp-button-spinner-size:1.15em}tp-button[loading][loading-mode=replace]>button>[data-tp-button-spinner],tp-button[loading][loading-mode=replace]>a>[data-tp-button-spinner]{opacity:1;animation:.7s linear infinite tp-button-spin;inset-block-start:50%;inset-inline-start:50%;transform:translate(-50%,-50%)}tp-button[loading][loading-mode=replace]>button>[data-tp-button-content],tp-button[loading][loading-mode=replace]>a>[data-tp-button-content]{opacity:0}tp-button[loading][loading-mode=inline]>button,tp-button[loading][loading-mode=inline]>a{align-items:center}tp-button[loading][loading-mode=inline]>button>[data-tp-button-spinner],tp-button[loading][loading-mode=inline]>a>[data-tp-button-spinner]{opacity:1;vertical-align:middle;flex:none;margin-inline-end:.35em;animation:.7s linear infinite tp-button-spin;display:inline-block;position:static;transform:none}tp-button[loading][loading-mode=inline]>button>[data-tp-button-content],tp-button[loading][loading-mode=inline]>a>[data-tp-button-content]{opacity:1;align-items:center;display:inline-flex}tp-button:not([disabled]):not([loading])>button:hover,tp-button:not([disabled]):not([loading])>a:hover{border-color:var(--tp-button-accent);box-shadow:0 0 0 2px Canvas, 0 0 0 4px var(--tp-button-focus-ring-color);filter:brightness(1.14);transform:translateY(-1px)}tp-button[outlined]:not([disabled]):not([loading])>button:hover,tp-button[outlined]:not([disabled]):not([loading])>a:hover{background-color:var(--tp-button-outline-background)}tp-button:not([disabled]):not([loading])>button:active,tp-button:not([disabled]):not([loading])>a:active{transform:translateY(1px)}tp-button>button:focus-visible,tp-button>a:focus-visible{box-shadow:0 0 0 2px Canvas, 0 0 0 4px var(--tp-button-focus-ring-color);outline:none}tp-button[disabled]>button,tp-button[disabled]>a,tp-button[loading]>button,tp-button[loading]>a{cursor:not-allowed}tp-button[disabled]>button,tp-button[disabled]>a{opacity:.55}tp-button[loading]>button,tp-button[loading]>a{opacity:.85}@keyframes tp-button-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){tp-button,tp-button *{transition-duration:.01ms!important;transition-delay:0s!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}";
//#endregion
//#region src/components/button/button.ts
function i(e) {
	return e === "button" || e === "submit" || e === "reset";
}
function a(e) {
	return e === "replace" || e === "inline";
}
function o(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
var s = class s extends e {
	static buttonStyleId = "tp-button-styles";
	controlEl = null;
	contentEl = null;
	childObserver = null;
	isSyncingLightDomContent = !1;
	static get observedAttributes() {
		return [
			"variant",
			"size",
			"type",
			"outlined",
			"pill",
			"disabled",
			"loading",
			"loading-mode",
			"href",
			"target",
			"rel",
			"download"
		];
	}
	get variant() {
		let e = this.getAttribute("variant");
		return e !== null && n(e) ? e : "neutral";
	}
	set variant(e) {
		this.setStringAttribute("variant", e);
	}
	get size() {
		let e = this.getAttribute("size");
		return e !== null && t(e) ? e : "m";
	}
	set size(e) {
		this.setStringAttribute("size", e);
	}
	get type() {
		let e = this.getAttribute("type");
		return e !== null && i(e) ? e : "button";
	}
	set type(e) {
		this.setStringAttribute("type", e);
	}
	get outlined() {
		return this.getBooleanAttribute("outlined");
	}
	set outlined(e) {
		this.setBooleanAttribute("outlined", e);
	}
	get pill() {
		return this.getBooleanAttribute("pill");
	}
	set pill(e) {
		this.setBooleanAttribute("pill", e);
	}
	get disabled() {
		return this.getBooleanAttribute("disabled");
	}
	set disabled(e) {
		this.setBooleanAttribute("disabled", e);
	}
	get loading() {
		return this.getBooleanAttribute("loading");
	}
	set loading(e) {
		this.setBooleanAttribute("loading", e);
	}
	get loadingMode() {
		let e = this.getAttribute("loading-mode");
		return e !== null && a(e) ? e : "replace";
	}
	set loadingMode(e) {
		this.setStringAttribute("loading-mode", e);
	}
	get href() {
		return this.getStringAttribute("href");
	}
	set href(e) {
		this.setStringAttribute("href", e);
	}
	get target() {
		return this.getStringAttribute("target");
	}
	set target(e) {
		this.setStringAttribute("target", e);
	}
	get rel() {
		return this.getStringAttribute("rel");
	}
	set rel(e) {
		this.setStringAttribute("rel", e);
	}
	get download() {
		return this.getStringAttribute("download");
	}
	set download(e) {
		this.setStringAttribute("download", e);
	}
	get isLink() {
		return this.href !== "";
	}
	get isBlocked() {
		return this.disabled || this.loading;
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(s.buttonStyleId, r), this.observeLightDomContent(), queueMicrotask(() => {
			this.isConnected && (this.ensureControl(), this.updateButton(), this.syncLightDomContent(), this.updateHelpSource());
		});
	}
	attributeChangedCallback(e, t, n) {
		this.isConnected && t !== n && (this.ensureControl(), this.updateButton(), this.syncLightDomContent(), this.updateHelpSource());
	}
	disconnectedCallback() {
		this.childObserver?.disconnect(), this.childObserver = null;
	}
	observeLightDomContent() {
		this.childObserver !== null || typeof MutationObserver > "u" || (this.childObserver = new MutationObserver(() => {
			this.isSyncingLightDomContent || this.syncLightDomContent();
		}), this.childObserver.observe(this, { childList: !0 }));
	}
	syncLightDomContent() {
		if (this.controlEl === null || this.contentEl === null || this.isSyncingLightDomContent) return;
		let e = Array.from(this.childNodes).filter((e) => e !== this.controlEl);
		if (e.length !== 0) {
			this.isSyncingLightDomContent = !0;
			for (let t of e) this.contentEl.append(t);
			this.isSyncingLightDomContent = !1, this.updateHelpSource();
		}
	}
	updateHelpSource() {
		if (this.contentEl === null) return;
		let e = ["tp-button", ...Array.from(this.attributes).flatMap((e) => e.name === "data-source" || e.name === "data-tp-base-host" || e.name === "variant" && e.value === "neutral" || e.name === "size" && e.value === "m" || e.name === "loading-mode" && e.value === "replace" ? [] : [e.value === "" ? e.name : `${e.name}="${o(e.value)}"`])].join(" "), t = this.contentEl.innerHTML.trim();
		this.setAttribute("data-source", `<${e}>${t}</tp-button>`);
	}
	ensureControl() {
		let e = this.isLink ? "A" : "BUTTON", t = this.querySelector(":scope > a, :scope > button");
		if (t instanceof HTMLElement && t.tagName === e && (t instanceof HTMLAnchorElement || t instanceof HTMLButtonElement)) {
			this.controlEl = t, this.ensureInnerStructure();
			return;
		}
		let n = this.isLink ? document.createElement("a") : document.createElement("button");
		this.replaceControl(n);
	}
	replaceControl(e) {
		let t = document.createDocumentFragment(), n = this.querySelector(":scope > a, :scope > button");
		if (n instanceof HTMLAnchorElement || n instanceof HTMLButtonElement) {
			let e = n.querySelector(":scope > [data-tp-button-content]");
			if (e instanceof HTMLElement) for (; e.firstChild !== null;) t.append(e.firstChild);
			else for (; n.firstChild !== null;) t.append(n.firstChild);
			n.remove();
		} else for (; this.firstChild !== null;) t.append(this.firstChild);
		this.append(e), this.controlEl = e, this.ensureInnerStructure(), this.contentEl !== null && this.contentEl.replaceChildren(t);
	}
	ensureInnerStructure() {
		if (!(this.controlEl instanceof HTMLButtonElement) && !(this.controlEl instanceof HTMLAnchorElement)) return;
		let e = this.controlEl.querySelector(":scope > [data-tp-button-spinner]"), t = this.controlEl.querySelector(":scope > [data-tp-button-content]");
		if (e instanceof HTMLSpanElement || (e = document.createElement("span"), e.setAttribute("data-tp-button-spinner", ""), e.setAttribute("aria-hidden", "true"), this.controlEl.prepend(e)), !(t instanceof HTMLSpanElement)) {
			t = document.createElement("span"), t.setAttribute("data-tp-button-content", "");
			let n = Array.from(this.controlEl.childNodes).filter((t) => t !== e);
			for (let e of n) t.append(e);
			this.controlEl.append(t);
		}
		this.contentEl = t;
	}
	updateButton() {
		if (this.ensureControl(), this.setAttribute("variant", this.variant), this.setAttribute("size", this.size), this.setAttribute("type", this.type), this.setAttribute("loading-mode", this.loadingMode), this.controlEl instanceof HTMLButtonElement) {
			this.updateNativeButton(this.controlEl), this.updateLoadingState(this.controlEl);
			return;
		}
		this.controlEl instanceof HTMLAnchorElement && (this.updateNativeLink(this.controlEl), this.updateLoadingState(this.controlEl));
	}
	updateNativeButton(e) {
		e.type = this.type, e.disabled = this.isBlocked, e.setAttribute("aria-disabled", String(this.isBlocked)), e.removeAttribute("href"), e.removeAttribute("target"), e.removeAttribute("rel"), e.removeAttribute("download");
	}
	updateNativeLink(e) {
		this.isBlocked ? (e.removeAttribute("href"), e.setAttribute("aria-disabled", "true"), e.tabIndex = -1) : (e.href = this.href, e.setAttribute("aria-disabled", "false"), e.removeAttribute("tabindex")), this.target === "" ? e.removeAttribute("target") : e.target = this.target, this.rel === "" ? e.removeAttribute("rel") : e.rel = this.rel, this.download === "" ? e.removeAttribute("download") : e.setAttribute("download", this.download);
	}
	updateLoadingState(e) {
		if (this.ensureInnerStructure(), this.loading) {
			e.setAttribute("aria-busy", "true"), this.setAttribute("data-loading", "");
			return;
		}
		e.setAttribute("aria-busy", "false"), this.removeAttribute("data-loading");
	}
};
customElements.get("tp-button") || customElements.define("tp-button", s);
//#endregion
export { s as t };

//# sourceMappingURL=button.js.map