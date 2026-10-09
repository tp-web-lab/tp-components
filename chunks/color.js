import { Ku as e, _r as t, vr as n } from "./lib/typescript/typescript.js";
//#region src/components/color/color.css?inline
var r = "tp-color{display:inline-flex;position:relative}tp-color>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-color>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-color>tp-dropdown{overscroll-behavior:contain;max-block-size:calc(100vh - 1rem);inline-size:max-content;min-inline-size:13rem;overflow-y:auto}tp-color>tp-dropdown>ul{grid-template-columns:1fr 1fr;inline-size:100%;margin:0;padding:.25rem;list-style:none;display:grid}tp-color .tp-color-option{cursor:pointer;border-radius:var(--tp-border-radius-sm,.25rem);align-items:center;gap:.45rem;padding:.3rem .5rem;display:flex}tp-color .tp-color-option:hover{background:var(--tp-neutral-fill-softer,#f3f4f6)}tp-color .tp-color-option[data-selected]{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-color .tp-color-option>tp-icon[name=check]{visibility:hidden}tp-color .tp-color-option[data-selected]>tp-icon[name=check]{visibility:visible}tp-color .tp-color-option>span{flex:1}tp-color .tp-color-separator{grid-column:1/-1;margin:0;padding:0;list-style:none}", i = [
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone"
], a = {
	"tp-default": "#88B1A1",
	"tp-red": "#ef5655",
	"tp-orange": "#f08039",
	"tp-amber": "#e89a26",
	"tp-yellow": "#dcb31e",
	"tp-lime": "#9abb28",
	"tp-green": "#5dbb55",
	"tp-emerald": "#47b873",
	"tp-teal": "#37b995",
	"tp-glaz": "#88B1A1",
	"tp-cyan": "#20b8bc",
	"tp-sky": "#1caedd",
	"tp-blue": "#4a97f4",
	"tp-indigo": "#6e85f8",
	"tp-violet": "#927cfb",
	"tp-purple": "#ae75f6",
	"tp-fuchsia": "#d26ae8",
	"tp-pink": "#e468b0",
	"tp-rose": "#ee6383",
	"tp-zinc": "#8b8c93",
	"tp-ivory": "#fffff0",
	"tp-stone": "#918c87"
};
function o(e) {
	return i.includes(e);
}
function s(e) {
	return e.replace("tp-", "").replace("-", " ");
}
var c = /* @__PURE__ */ new WeakMap();
function l(e) {
	let t = c.get(e);
	return t === void 0 && (t = {
		controllers: /* @__PURE__ */ new Set(),
		initialPresetClasses: new Set(i.filter((t) => e.classList.contains(t)))
	}, c.set(e, t)), t;
}
function u(e, t) {
	let n = l(e);
	return n.controllers.add(t), n;
}
function d(e, t) {
	let n = c.get(e);
	if (n !== void 0 && (n.controllers.delete(t), !(n.controllers.size > 0))) {
		e.classList.remove(...i);
		for (let t of n.initialPresetClasses) e.classList.add(t);
		c.delete(e);
	}
}
function f(e, t) {
	let n = c.get(e);
	if (n !== void 0) for (let e of n.controllers) e !== t && e.preset !== t.preset && e.syncToPreset(t.preset);
}
var p = class c extends e {
	static styleId = "tp-color-styles";
	static changeEventName = "tp-color-change";
	static presets = i;
	static get observedAttributes() {
		return [
			"preset",
			"anchor",
			"ui-anchor",
			"variant",
			"size",
			"disabled"
		];
	}
	targetElement = null;
	triggerEl = null;
	dropdownEl = null;
	isSyncing = !1;
	hasAppliedPreset = !1;
	get preset() {
		let e = this.getStringAttribute("preset", "tp-default");
		return o(e) ? e : "tp-default";
	}
	set preset(e) {
		this.setStringAttribute("preset", e);
	}
	get anchor() {
		return this.getAttribute("anchor") ?? "";
	}
	set anchor(e) {
		if (e.trim() === "") {
			this.removeAttribute("anchor");
			return;
		}
		this.setAttribute("anchor", e);
	}
	get variant() {
		let e = this.getAttribute("variant") ?? "neutral";
		return n(e) ? e : "neutral";
	}
	set variant(e) {
		this.setAttribute("variant", e);
	}
	get size() {
		let e = this.getAttribute("size") ?? "m";
		return t(e) ? e : "m";
	}
	set size(e) {
		this.setAttribute("size", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(c.styleId, r), this.ensureControl(), this.updateControl(), this.applyPreset();
	}
	attributeChangedCallback(e, t, n) {
		this.isSyncing || ![
			"preset",
			"anchor",
			"ui-anchor",
			"variant",
			"size",
			"disabled"
		].includes(e) || t === n || (this.updateControl(), (e === "preset" || e === "anchor") && this.applyPreset());
	}
	disconnectedCallback() {
		this.targetElement instanceof HTMLElement && (d(this.targetElement, this), this.targetElement = null);
	}
	ensureControl() {
		let e = this.queryElement(":scope > tp-icon-button");
		e instanceof HTMLElement || (e = document.createElement("tp-icon-button"), e.id = `${this.getControlId()}-trigger`, this.prepend(e)), e.setAttribute("name", "palette-swatch"), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.onTriggerClick), e.addEventListener("click", this.onTriggerClick), this.triggerEl = e;
		let t = this.queryElement(":scope > tp-dropdown");
		t instanceof HTMLElement || (t = document.createElement("tp-dropdown"), this.append(t)), t.setAttribute("anchor", this.getDropdownAnchor(e.id)), t.setAttribute("placement", "bottom"), t.setAttribute("outside-click", "");
		let n = t.querySelector("ul");
		if (!n || n.querySelectorAll(".tp-color-option").length !== i.length || n.querySelector("tp-divider") === null) {
			let e = document.createElement("ul");
			for (let n of i) {
				let r = document.createElement("li");
				r.className = "tp-color-option", r.setAttribute("data-preset", n);
				let i = document.createElement("tp-icon");
				i.setAttribute("name", "check");
				let o = document.createElement("tp-icon");
				o.className = "tp-color-swatch", o.setAttribute("name", "square-rounded"), o.setAttribute("size", "1.5em"), o.setAttribute("color", a[n]);
				let c = document.createElement("span");
				if (c.textContent = s(n), r.append(i, o, c), r.addEventListener("click", () => {
					this.preset = n, t.open = !1;
				}), e.append(r), n === "tp-default") {
					let t = document.createElement("li");
					t.className = "tp-color-separator", t.setAttribute("role", "none"), t.setAttribute("aria-hidden", "true");
					let n = document.createElement("tp-divider");
					t.append(n), e.append(t);
				}
			}
			n ? n.replaceWith(e) : t.append(e);
		}
		this.dropdownEl = t;
	}
	getControlId() {
		return this.id.trim() === "" ? (this.id = `tp-color-${Math.random().toString(36).slice(2, 9)}`, this.id) : this.id.trim();
	}
	getDropdownAnchor(e) {
		let t = this.getAttribute("ui-anchor")?.trim() ?? "";
		return t === "" ? `#${e}` : t;
	}
	syncToPreset(e) {
		this.preset !== e && (this.isSyncing = !0, this.preset = e, this.isSyncing = !1, this.updateControl(), this.applyPreset());
	}
	onTriggerClick = () => {
		this.disabled || this.dropdownEl instanceof HTMLElement && (this.dropdownEl.open = !this.dropdownEl.open);
	};
	updateControl() {
		this.ensureControl();
		let e = this.preset;
		if (this.triggerEl instanceof HTMLElement && (this.triggerEl.setAttribute("label", `Brand preset: ${s(e)}. Click to choose another color.`), this.triggerEl.style.setProperty("color", a[e])), this.dropdownEl instanceof HTMLElement) {
			let t = this.dropdownEl.querySelectorAll(".tp-color-option");
			for (let n of t) n.getAttribute("data-preset") === e ? n.setAttribute("data-selected", "") : n.removeAttribute("data-selected");
		}
	}
	applyPreset() {
		let e = this.preset;
		if (this.getAttribute("preset") !== e) {
			this.setAttribute("preset", e);
			return;
		}
		let t = this.resolveColorTarget();
		if (!(t instanceof HTMLElement)) {
			this.targetElement instanceof HTMLElement && (d(this.targetElement, this), this.targetElement = null), this.hasAppliedPreset = !0;
			return;
		}
		let n = this.targetElement !== t;
		if (n && (this.targetElement instanceof HTMLElement && d(this.targetElement, this), this.targetElement = t, u(t, this)), n) {
			let n = l(t);
			if (n.controllers.size > 1) {
				for (let e of n.controllers) if (e !== this) {
					this.syncToPreset(e.preset);
					return;
				}
			} else if (n.initialPresetClasses.size > 0) {
				let [t] = n.initialPresetClasses;
				if (t !== void 0 && o(t) && t !== e) {
					this.isSyncing = !0, this.setAttribute("preset", t), this.isSyncing = !1, this.updateControl();
					return;
				}
			}
		}
		t.classList.remove(...i), t.classList.add(e), this.emitChange(t), this.hasAppliedPreset = !0, f(t, this);
	}
	emitChange(e) {
		if (!this.hasAppliedPreset) return;
		let t = this.preset;
		this.dispatchEvent(new CustomEvent(c.changeEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				preset: t,
				brand: t,
				anchor: this.anchor,
				target: e
			}
		}));
	}
	resolveColorTarget() {
		let e = this.resolveAnchoredColorTarget();
		if (e instanceof HTMLElement) return e;
		let t = this.getClosestSkippingContainers("[data-tp-color-scope]");
		if (t instanceof HTMLElement) return t;
		let n = this.getEffectiveParent();
		return n instanceof HTMLElement ? n : null;
	}
	resolveAnchoredColorTarget() {
		let e = this.getAttribute("anchor")?.trim() ?? "";
		if (e === "") return null;
		let t = this.ownerDocument.querySelector(e);
		return t instanceof HTMLElement ? t : null;
	}
	getEffectiveParent() {
		let e = /* @__PURE__ */ new Set([
			"TP-TOOLBAR",
			"TP-MENU",
			"TP-DROPDOWN",
			"TP-BUTTON-GROUP",
			"TP-CONTEXTMENU"
		]), t = this.parentElement;
		for (; t instanceof HTMLElement;) {
			let n = t.tagName.toUpperCase();
			if (e.has(n)) {
				t = t.parentElement;
				continue;
			}
			if (t.parentElement && e.has(t.parentElement.tagName.toUpperCase())) {
				t = t.parentElement.parentElement;
				continue;
			}
			return t;
		}
		return null;
	}
};
customElements.get("tp-color") || customElements.define("tp-color", p);
//#endregion
export { p as t };

