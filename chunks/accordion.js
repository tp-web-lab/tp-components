import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/accordion/accordion.css?inline
var t = "tp-accordion{display:flow-root}tp-accordion>dl{margin:0;display:block}tp-accordion>dl>dt,tp-accordion>dl>dd{margin:0}tp-accordion>dl>dt{cursor:pointer;-webkit-user-select:none;user-select:none;min-block-size:1.5em;padding-block:.5rem;padding-inline-end:2em;position:relative}tp-accordion>dl>dt:after{content:\"\";transform-origin:50%;border-block-end:2px solid;border-inline-end:2px solid;block-size:.5em;inline-size:.5em;transition:transform 50ms;position:absolute;inset-block-start:50%;inset-inline-end:.75em;transform:translateY(-50%)rotate(-45deg)}tp-accordion>dl>dt[aria-expanded=true]:after{transform:translateY(-70%)rotate(45deg)}tp-accordion>dl>dt[aria-expanded=true]{font-weight:600}tp-accordion>dl>dd[hidden]{display:none}tp-accordion>dl>dt+dd{margin-block-start:var(--tp-accordion-content-gap,.5rem);margin-block-end:var(--tp-accordion-item-gap,1rem)}tp-accordion:not([appearance]),tp-accordion[appearance=default]{--tp-accordion-content-gap:0;--tp-accordion-item-gap:0}tp-accordion:not([appearance])>dl>dd,tp-accordion[appearance=default]>dl>dd{padding-block:0 .75rem}tp-accordion:not([appearance])>dl>dd+dt,tp-accordion[appearance=default]>dl>dd+dt{border-block-start:var(--tp-border-style,solid) var(--tp-border-width,1px) var(--tp-neutral-stroke-softer,#d1d5db)}tp-accordion[appearance=outlined]>dl,tp-accordion[appearance=filled]>dl{border:var(--tp-border-style,solid) var(--tp-border-width,1px) var(--tp-neutral-stroke-softer,#d1d5db);border-radius:var(--tp-border-radius-md,.375rem);box-shadow:var(--tp-shadow-softer,none);overflow:hidden}tp-accordion[appearance=outlined]>dl>dt,tp-accordion[appearance=filled]>dl>dt{padding-inline:calc(var(--tp-content-spacing,1rem) / 2) 2em}tp-accordion[appearance=outlined]>dl>dt[aria-expanded=true],tp-accordion[appearance=filled]>dl>dt[aria-expanded=true]{border-block-end:var(--tp-border-style,solid) var(--tp-border-width,1px) var(--tp-neutral-stroke-softer,#d1d5db)}tp-accordion[appearance=outlined]>dl>dt+dd,tp-accordion[appearance=filled]>dl>dt+dd{padding:calc(var(--tp-content-spacing,1rem) / 2);margin-block:0}tp-accordion[appearance=outlined]>dl>dd+dt,tp-accordion[appearance=filled]>dl>dd+dt{border-block-start:var(--tp-border-style,solid) var(--tp-border-width,1px) var(--tp-neutral-stroke-softer,#d1d5db)}tp-accordion[appearance=filled]>dl>dt{background-color:var(--tp-brand-fill-softer,#e8f1ed);border-color:var(--tp-brand-stroke-soft,#88b1a1);color:var(--tp-brand-text-on-soft,#1f3b31)}tp-accordion[appearance=filled]>dl>dd{background-color:var(--tp-paper-color,Canvas);color:var(--tp-text-body,CanvasText)}tp-accordion[appearance=filled]>dl,tp-accordion[appearance=filled]>dl>dt[aria-expanded=true],tp-accordion[appearance=filled]>dl>dd+dt{border-color:var(--tp-brand-stroke-soft,#88b1a1)}tp-accordion>dl>dt:focus-visible{outline-offset:2px;outline:2px solid}@media (prefers-reduced-motion:reduce){tp-accordion,tp-accordion *{transition-duration:.01ms!important;transition-delay:0s!important}}";
//#endregion
//#region src/components/accordion/accordion.ts
function n(e) {
	if (e === null || e.trim() === "") return [];
	let t = e.trim().split(/\s+/).map((e) => Number(e)).filter((e) => Number.isInteger(e) && e >= 0);
	return [...new Set(t)].sort((e, t) => e - t);
}
var r = 0, i = class i extends e {
	static accordionStyleId = "tp-accordion-styles";
	instanceId = "";
	dlEl = null;
	static get observedAttributes() {
		return [
			"appearance",
			"multiple",
			"open-indexes"
		];
	}
	get appearance() {
		let e = this.getAttribute("appearance");
		return e === "outlined" || e === "filled" ? e : "default";
	}
	set appearance(e) {
		if (e === "default") {
			this.removeAttribute("appearance");
			return;
		}
		this.setAttribute("appearance", e);
	}
	get multiple() {
		return this.hasAttribute("multiple");
	}
	set multiple(e) {
		if (e) {
			this.setAttribute("multiple", "");
			return;
		}
		this.removeAttribute("multiple");
	}
	get openIndexes() {
		return n(this.getAttribute("open-indexes"));
	}
	set openIndexes(e) {
		let t = [...new Set(e)].filter((e) => Number.isInteger(e) && e >= 0).sort((e, t) => e - t);
		if (t.length === 0) {
			this.removeAttribute("open-indexes");
			return;
		}
		this.setAttribute("open-indexes", t.join(" "));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.accordionStyleId, t), this.ensureInstanceId(), this.ensureDl(), this.update();
	}
	attributeChangedCallback() {
		this.isConnected && (this.ensureDl(), this.update());
	}
	open(e) {
		if (!(!Number.isInteger(e) || e < 0)) {
			if (this.multiple) {
				this.openIndexes = [...this.openIndexes, e];
				return;
			}
			this.openIndexes = [e];
		}
	}
	close(e) {
		!Number.isInteger(e) || e < 0 || (this.openIndexes = this.openIndexes.filter((t) => t !== e));
	}
	toggle(e) {
		if (!(!Number.isInteger(e) || e < 0)) {
			if (this.openIndexes.includes(e)) {
				this.close(e);
				return;
			}
			this.open(e);
		}
	}
	ensureInstanceId() {
		this.instanceId === "" && (r += 1, this.instanceId = `tp-accordion-${String(r)}`, this.setAttribute("data-tp-accordion-id", this.instanceId));
	}
	ensureDl() {
		let e = this.querySelector("dl");
		if (!(e instanceof HTMLDListElement)) {
			this.dlEl = null;
			return;
		}
		this.dlEl = e, this.dlEl.setAttribute("role", "presentation");
	}
	getSummaries() {
		return this.dlEl === null ? [] : Array.from(this.dlEl.children).filter((e) => e instanceof HTMLElement && e.tagName === "DT");
	}
	getContents() {
		return this.dlEl === null ? [] : Array.from(this.dlEl.children).filter((e) => e instanceof HTMLElement && e.tagName === "DD");
	}
	update() {
		if (this.dlEl === null) return;
		let e = this.getSummaries(), t = this.getContents(), n = this.multiple ? this.openIndexes : this.openIndexes.slice(0, 1);
		for (let [r, i] of e.entries()) {
			let a = t[r], o = n.includes(r);
			if (i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), i.setAttribute("aria-expanded", String(o)), a !== void 0) {
				let e = `${this.instanceId}-summary-${String(r)}`, t = `${this.instanceId}-content-${String(r)}`;
				i.id = e, a.id = t, i.setAttribute("aria-controls", t), a.setAttribute("aria-labelledby", e), a.hidden = !o;
			}
			i.onclick = () => {
				this.toggle(r);
			}, i.onkeydown = (t) => {
				this.handleKey(t, r, e);
			};
		}
		for (let e of t) e.setAttribute("role", "region");
	}
	handleKey(e, t, n) {
		if (n.length === 0) return;
		let r = t;
		if (e.key === "ArrowDown" && (r = (t + 1) % n.length), e.key === "ArrowUp" && (r = (t - 1 + n.length) % n.length), e.key === "Home" && (r = 0), e.key === "End" && (r = n.length - 1), r !== t) {
			let t = n[r];
			t !== void 0 && t.focus(), e.preventDefault();
			return;
		}
		(e.key === "Enter" || e.key === " ") && (this.toggle(t), e.preventDefault());
	}
};
customElements.get("tp-accordion") || customElements.define("tp-accordion", i);
//#endregion
export { i as t };

