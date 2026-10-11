import { t as e } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { isTpSizeType as t, isTpVariantType as n } from "../components/base/base.types.js";
import "./divider.js";
import "./dropdown.js";
//#region src/components/theme/theme.css?inline
var r = "tp-theme{vertical-align:middle;display:inline-flex}tp-theme>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-theme>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-theme>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-theme>tp-dropdown{overscroll-behavior:contain;max-block-size:calc(100vh - 1rem);inline-size:max-content;min-inline-size:9rem;overflow-y:auto}tp-theme>tp-dropdown>ul{inline-size:100%;margin:0;padding:.25rem;list-style:none}tp-theme .tp-theme-option{cursor:pointer;border-radius:var(--tp-border-radius-sm,.25rem);align-items:center;gap:.5rem;padding:.3rem .5rem;display:flex}tp-theme .tp-theme-option:hover{background:var(--tp-neutral-fill-softer,#f3f4f6)}tp-theme .tp-theme-option[data-selected]{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-theme .tp-theme-option>tp-icon[name=check]{visibility:hidden}tp-theme .tp-theme-option[data-selected]>tp-icon[name=check]{visibility:visible}tp-theme .tp-theme-option-icon{color:var(--tp-warning-500,#eab308)}tp-theme .tp-theme-separator{margin:0;padding:0;list-style:none}";
//#endregion
//#region src/components/theme/theme.ts
function i(e) {
	return e === "light" || e === "dark" || e === "auto";
}
var a = /* @__PURE__ */ new WeakMap(), o = [
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
], s = ["--tp-brand-seed"];
function c(e) {
	let t = a.get(e);
	return t === void 0 && (t = {
		controllers: /* @__PURE__ */ new Set(),
		initialHasLight: e.classList.contains("tp-light"),
		initialHasDark: e.classList.contains("tp-dark"),
		inheritedBrandProperties: /* @__PURE__ */ new Set()
	}, a.set(e, t)), t;
}
function l(e, t) {
	let n = c(e);
	return n.controllers.add(t), n;
}
function u(e, t) {
	let n = a.get(e);
	n !== void 0 && (n.controllers.delete(t), !(n.controllers.size > 0) && (e.classList.toggle("tp-light", n.initialHasLight), e.classList.toggle("tp-dark", n.initialHasDark), p(e, n), a.delete(e)));
}
function d(e) {
	return e.hasAttribute("data-tp-color-scope") || o.some((t) => e.classList.contains(t));
}
function f(e, t) {
	if (d(e)) {
		p(e, t);
		return;
	}
	for (let n of s) e.style.getPropertyValue(n) !== "" && !t.inheritedBrandProperties.has(n) || (e.style.setProperty(n, "inherit"), t.inheritedBrandProperties.add(n));
}
function p(e, t) {
	for (let n of t.inheritedBrandProperties) e.style.removeProperty(n);
	t.inheritedBrandProperties.clear();
}
function m(e, t) {
	let n = a.get(e);
	if (n !== void 0) for (let e of n.controllers) e !== t && e.mode !== t.mode && e.syncToMode(t.mode);
}
var h = class a extends e {
	static styleId = "tp-theme-styles";
	static refreshEventName = "tp-theme-refresh";
	static changeEventName = "tp-theme-change";
	static nextControlId = 0;
	static get observedAttributes() {
		return [
			"mode",
			"anchor",
			"ui-anchor",
			"variant",
			"size",
			"disabled"
		];
	}
	targetElement = null;
	controlEl = null;
	dropdownEl = null;
	mediaQueryList = null;
	isSyncing = !1;
	hasAppliedTheme = !1;
	onMediaQueryChange = () => {
		this.mode === "auto" && this.applyTheme({ emitRefresh: !0 });
	};
	onThemeRefresh = (e) => {
		let t = e, n = t.detail?.source, r = t.detail?.scope;
		!(n instanceof a) || n === this || !(r instanceof HTMLElement) || r.contains(this) && this.targetElement !== r && this.applyTheme({ emitRefresh: !1 });
	};
	get mode() {
		let e = this.getStringAttribute("mode", "auto");
		return i(e) ? e : "auto";
	}
	set mode(e) {
		this.setStringAttribute("mode", e);
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
		super.connectedCallback(), this.ensureGlobalStyle(a.styleId, r), this.ensureControl(), this.updateControl(), document.addEventListener(a.refreshEventName, this.onThemeRefresh), this.applyTheme({ emitRefresh: !0 });
	}
	attributeChangedCallback(e, t, n) {
		this.isSyncing || ![
			"mode",
			"anchor",
			"ui-anchor",
			"variant",
			"size",
			"disabled"
		].includes(e) || t === n || (this.updateControl(), (e === "mode" || e === "anchor") && this.applyTheme({ emitRefresh: !0 }));
	}
	disconnectedCallback() {
		document.removeEventListener(a.refreshEventName, this.onThemeRefresh), this.teardownMediaQuery(), this.targetElement instanceof HTMLElement && (u(this.targetElement, this), this.targetElement = null);
	}
	ensureControl() {
		let e = this.queryElement(":scope > tp-icon-button");
		e instanceof HTMLElement || (e = document.createElement("tp-icon-button"), this.prepend(e)), e.setAttribute("name", "theme-light-dark"), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.onControlClick), e.addEventListener("click", this.onControlClick), this.controlEl = e;
		let t = this.ensureControlId(e), n = this.queryElement(":scope > tp-dropdown");
		n instanceof HTMLElement || (n = document.createElement("tp-dropdown"), this.append(n));
		let r = n;
		r.setAttribute("anchor", this.getDropdownAnchor(t)), r.hasAttribute("placement") || r.setAttribute("placement", "bottom"), r.setAttribute("outside-click", "");
		let i = r.querySelector("ul");
		if (!i || i.querySelectorAll(".tp-theme-option").length !== 3 || i.querySelector("tp-divider") === null) {
			let e = document.createElement("ul");
			for (let t of [
				"light",
				"dark",
				"auto"
			]) {
				if (t === "auto") {
					let t = document.createElement("li");
					t.className = "tp-theme-separator", t.setAttribute("role", "none"), t.setAttribute("aria-hidden", "true");
					let n = document.createElement("tp-divider");
					t.append(n), e.append(t);
				}
				let n = document.createElement("li");
				n.className = "tp-theme-option", n.setAttribute("data-mode", t), n.setAttribute("role", "menuitem");
				let i = document.createElement("tp-icon");
				i.setAttribute("name", "check");
				let a = document.createElement("tp-icon");
				a.className = "tp-theme-option-icon";
				let o = document.createElement("span");
				o.textContent = t, n.append(i, a, o), n.addEventListener("click", () => {
					this.mode = t, r.open = !1;
				}), e.append(n);
			}
			i ? i.replaceWith(e) : r.append(e);
		}
		this.dropdownEl = r;
	}
	ensureControlId(e) {
		let t = e.id.trim();
		if (t !== "") return t;
		a.nextControlId += 1;
		let n = `tp-theme-control-${String(a.nextControlId)}`;
		return e.id = n, n;
	}
	syncToMode(e) {
		this.mode !== e && (this.isSyncing = !0, this.mode = e, this.isSyncing = !1, this.updateControl(), this.applyTheme({ emitRefresh: !1 }));
	}
	getDropdownAnchor(e) {
		let t = this.getAttribute("ui-anchor")?.trim() ?? "";
		return t === "" ? `#${e}` : t;
	}
	onControlClick = () => {
		this.disabled || this.dropdownEl instanceof HTMLElement && (this.dropdownEl.open = !this.dropdownEl.open);
	};
	updateControl() {
		if (this.ensureControl(), !(this.controlEl instanceof HTMLElement)) return;
		let e = this.mode, t = this.resolveEffectiveMode(e);
		if (this.controlEl.setAttribute("label", `Theme: ${e}. Choose light, dark, or auto.`), this.controlEl.setAttribute("data-mode", e), this.controlEl.setAttribute("data-effective-mode", t), this.controlEl.setAttribute("name", t === "dark" ? "moon" : "sun"), this.controlEl.style.setProperty("color", "var(--tp-warning-500)"), this.dropdownEl instanceof HTMLElement) {
			let t = this.dropdownEl.querySelectorAll(".tp-theme-option");
			for (let n of t) {
				let t = n.getAttribute("data-mode"), r = n.querySelector("tp-icon.tp-theme-option-icon");
				if (t === "auto") {
					let e = this.resolveEffectiveMode("auto");
					r?.setAttribute("name", e === "dark" ? "moon" : "sun");
				} else t === "light" ? r?.setAttribute("name", "sun") : t === "dark" && r?.setAttribute("name", "moon");
				t === e ? n.setAttribute("data-selected", "") : n.removeAttribute("data-selected");
			}
		}
	}
	applyTheme(e) {
		this.setAttribute("mode", this.mode), this.updateControl();
		let t = this.resolveThemeTarget();
		if (!(t instanceof HTMLElement)) {
			this.teardownMediaQuery(), this.targetElement instanceof HTMLElement && (u(this.targetElement, this), this.targetElement = null), this.hasAppliedTheme = !0;
			return;
		}
		this.targetElement !== t && (this.targetElement instanceof HTMLElement && u(this.targetElement, this), this.targetElement = t, l(t, this));
		let n = this.mode, r = this.resolveEffectiveMode(n);
		n === "auto" ? this.setupMediaQuery() : this.teardownMediaQuery(), t.classList.remove("tp-light", "tp-dark"), t.classList.add(r === "dark" ? "tp-dark" : "tp-light"), f(t, c(t)), this.emitChange(t, r), this.hasAppliedTheme = !0, e.emitRefresh && this.dispatchEvent(new CustomEvent(a.refreshEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				source: this,
				scope: t
			}
		})), m(t, this);
	}
	emitChange(e, t) {
		this.hasAppliedTheme && this.dispatchEvent(new CustomEvent(a.changeEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				mode: this.mode,
				theme: t,
				anchor: this.anchor,
				target: e
			}
		}));
	}
	resolveThemeTarget() {
		let e = this.resolveAnchoredThemeTarget();
		if (e instanceof HTMLElement) return e;
		let t = this.parentElement;
		if (t?.tagName === "TP-TOOLBAR") return t.parentElement;
		if (t?.parentElement?.tagName === "TP-TOOLBAR") return t.parentElement.parentElement;
		let n = this.getEffectiveParent();
		return n instanceof HTMLElement ? (n.hasAttribute("data-tp-theme-scope"), n) : null;
	}
	resolveAnchoredThemeTarget() {
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
			"TP-CONTEXTMENU",
			"P"
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
	resolveEffectiveMode(e) {
		return e === "light" ? "light" : e === "dark" || this.getMediaQuery()?.matches === !0 ? "dark" : "light";
	}
	getMediaQuery() {
		if (this.mediaQueryList !== null) return this.mediaQueryList;
		let e = this.ownerDocument.defaultView;
		return e === null || typeof e.matchMedia != "function" ? null : (this.mediaQueryList = e.matchMedia("(prefers-color-scheme: dark)"), this.mediaQueryList);
	}
	setupMediaQuery() {
		let e = this.getMediaQuery();
		e !== null && (e.removeEventListener("change", this.onMediaQueryChange), e.addEventListener("change", this.onMediaQueryChange));
	}
	teardownMediaQuery() {
		let e = this.mediaQueryList;
		e !== null && e.removeEventListener("change", this.onMediaQueryChange);
	}
};
customElements.get("tp-theme") || customElements.define("tp-theme", h);
//#endregion
export { h as t };

//# sourceMappingURL=theme.js.map