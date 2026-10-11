import { t as e } from "./base.js";
import { isTpSizeType as t, isTpVariantType as n } from "../components/base/base.types.js";
//#region src/components/badge/badge.css?inline
var r = "tp-badge{--tp-badge-accent:var(--tp-neutral-text-colorful);--tp-badge-background:var(--tp-neutral-fill-softer);--tp-badge-foreground:var(--tp-neutral-text-on-soft);--tp-badge-border-color:var(--tp-neutral-stroke-soft);--tp-badge-radius:.5em;--tp-badge-font-size:.875em;--tp-badge-padding-block:.35em;--tp-badge-padding-inline:.7em;background-color:var(--tp-badge-background);border:1px solid var(--tp-badge-border-color);border-radius:var(--tp-badge-radius);color:var(--tp-badge-foreground);font:inherit;font-size:var(--tp-badge-font-size);max-inline-size:100%;padding-block:var(--tp-badge-padding-block);padding-inline:var(--tp-badge-padding-inline);vertical-align:middle;white-space:nowrap;align-items:center;gap:.25em;font-weight:600;line-height:1;display:inline-flex}tp-badge>p{display:contents}tp-badge[variant=success]{--tp-badge-accent:var(--tp-success-text-colorful);--tp-badge-background:var(--tp-success-fill-softer);--tp-badge-foreground:var(--tp-success-text-on-soft);--tp-badge-border-color:var(--tp-success-stroke-soft)}tp-badge[variant=danger]{--tp-badge-accent:var(--tp-danger-text-colorful);--tp-badge-background:var(--tp-danger-fill-softer);--tp-badge-foreground:var(--tp-danger-text-on-soft);--tp-badge-border-color:var(--tp-danger-stroke-soft)}tp-badge[variant=warning]{--tp-badge-accent:var(--tp-warning-text-colorful);--tp-badge-background:var(--tp-warning-fill-softer);--tp-badge-foreground:var(--tp-warning-text-on-soft);--tp-badge-border-color:var(--tp-warning-stroke-soft)}tp-badge[variant=info]{--tp-badge-accent:var(--tp-info-text-colorful);--tp-badge-background:var(--tp-info-fill-softer);--tp-badge-foreground:var(--tp-info-text-on-soft);--tp-badge-border-color:var(--tp-info-stroke-soft)}tp-badge[variant=neutral]{--tp-badge-accent:var(--tp-neutral-text-colorful);--tp-badge-background:var(--tp-neutral-fill-softer);--tp-badge-foreground:var(--tp-neutral-text-on-soft);--tp-badge-border-color:var(--tp-neutral-stroke-soft)}tp-badge[variant=brand]{--tp-badge-accent:var(--tp-brand-text-colorful);--tp-badge-background:var(--tp-brand-fill-softer);--tp-badge-foreground:var(--tp-brand-text-on-soft);--tp-badge-border-color:var(--tp-brand-stroke-soft)}tp-badge[outlined]{--tp-badge-background:transparent;--tp-badge-foreground:var(--tp-badge-accent);--tp-badge-border-color:var(--tp-badge-accent)}tp-badge[pill]{--tp-badge-radius:999em}tp-badge[pulse]{animation:1.4s ease-in-out infinite tp-badge-pulse}tp-badge[size=xxs]{--tp-badge-font-size:.625em;--tp-badge-padding-block:.15em;--tp-badge-padding-inline:.4em}tp-badge[size=xs]{--tp-badge-font-size:.6875em;--tp-badge-padding-block:.2em;--tp-badge-padding-inline:.5em}tp-badge[size=s]{--tp-badge-font-size:.75em;--tp-badge-padding-block:.25em;--tp-badge-padding-inline:.55em}tp-badge[size=m]{--tp-badge-font-size:.875em;--tp-badge-padding-block:.35em;--tp-badge-padding-inline:.7em}tp-badge[size=l]{--tp-badge-font-size:.95em;--tp-badge-padding-block:.42em;--tp-badge-padding-inline:.8em}tp-badge[size=xl]{--tp-badge-font-size:1em;--tp-badge-padding-block:.5em;--tp-badge-padding-inline:.9em}tp-badge[size=xxl]{--tp-badge-font-size:1.125em;--tp-badge-padding-block:.6em;--tp-badge-padding-inline:1em}@keyframes tp-badge-pulse{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--tp-badge-accent) 45%, transparent);transform:scale(1)}50%{box-shadow:0 0 0 .35em color-mix(in srgb, var(--tp-badge-accent) 0%, transparent);transform:scale(1.04)}}@media (prefers-reduced-motion:reduce){tp-badge[pulse]{box-shadow:0 0 0 .18em color-mix(in srgb, var(--tp-badge-accent) 30%, transparent);animation:none}}", i = class i extends e {
	static badgeStyleId = "tp-badge-styles";
	static get observedAttributes() {
		return [
			"variant",
			"size",
			"outlined",
			"pill",
			"pulse"
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
	get pulse() {
		return this.getBooleanAttribute("pulse");
	}
	set pulse(e) {
		this.setBooleanAttribute("pulse", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.badgeStyleId, r), this.updateBadge();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.updateBadge();
	}
	updateBadge() {
		this.setAttribute("variant", this.variant), this.setAttribute("size", this.size);
	}
};
customElements.get("tp-badge") || customElements.define("tp-badge", i);
//#endregion
export { i as t };

//# sourceMappingURL=badge.js.map