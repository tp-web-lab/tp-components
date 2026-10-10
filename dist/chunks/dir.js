import { Ku as e, _r as t, gr as n, vr as r } from "./lib/typescript/typescript.js";
import { isRtlLocale as i } from "../utilities/text-direction.js";
//#region src/components/dir/dir.css?inline
var a = "tp-dir{vertical-align:middle;display:inline-flex}tp-dir>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-dir>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-dir>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-dir>tp-dropdown{min-inline-size:14rem}tp-dir>tp-dropdown>ul{margin:0;padding:.25rem;list-style:none}tp-dir .tp-dir-option{cursor:pointer;border-radius:var(--tp-border-radius-sm,.25rem);align-items:center;gap:.5rem;padding:.3rem .5rem;display:flex}tp-dir .tp-dir-option:hover{background:var(--tp-neutral-fill-softer,#f3f4f6)}tp-dir .tp-dir-option[data-selected]{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-dir .tp-dir-option>tp-icon[name=check]{visibility:hidden}tp-dir .tp-dir-option[data-selected]>tp-icon[name=check]{visibility:visible}tp-dir .tp-dir-separator{margin:0;padding:0;list-style:none}";
//#endregion
//#region src/components/dir/dir.ts
function o() {
	let e = document.documentElement, t = e.getAttribute("dir");
	return t === "rtl" ? "rtl" : t === "ltr" ? "ltr" : i(e.getAttribute("lang") ?? "") ? "rtl" : "ltr";
}
var s = /* @__PURE__ */ new WeakMap();
function c(e) {
	let t = s.get(e);
	return t === void 0 && (t = {
		controllers: /* @__PURE__ */ new Set(),
		initialDir: e.getAttribute("dir")
	}, s.set(e, t)), t;
}
function l(e, t) {
	let n = c(e);
	return n.controllers.add(t), n;
}
function u(e, t) {
	let n = s.get(e);
	n !== void 0 && (n.controllers.delete(t), !(n.controllers.size > 0) && (n.initialDir === null ? e.removeAttribute("dir") : e.setAttribute("dir", n.initialDir), s.delete(e)));
}
function d(e, t) {
	let n = s.get(e);
	if (n !== void 0) for (let e of n.controllers) e !== t && e.mode !== t.mode && e.syncToMode(t.mode);
}
var f = class i extends e {
	static styleId = "tp-dir-styles";
	static changeEventName = "tp-dir-change";
	static nextControlId = 0;
	static get observedAttributes() {
		return [
			"mode",
			"anchor",
			"variant",
			"size",
			"disabled"
		];
	}
	targetElement = null;
	controlEl = null;
	dropdownEl = null;
	documentObserver = null;
	isSyncing = !1;
	hasAppliedDir = !1;
	get mode() {
		let e = this.getStringAttribute("mode", "auto");
		return n(e) ? e : "auto";
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
		return r(e) ? e : "neutral";
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
		super.connectedCallback(), this.ensureGlobalStyle(i.styleId, a), this.ensureControl(), this.updateControl(), this.applyDir();
	}
	attributeChangedCallback(e, t, n) {
		this.isSyncing || ![
			"mode",
			"anchor",
			"variant",
			"size",
			"disabled"
		].includes(e) || t === n || (this.updateControl(), (e === "mode" || e === "anchor") && this.applyDir());
	}
	disconnectedCallback() {
		this.teardownDocumentObserver(), this.targetElement instanceof HTMLElement && (u(this.targetElement, this), this.targetElement = null);
	}
	syncToMode(e) {
		this.mode !== e && (this.isSyncing = !0, this.mode = e, this.isSyncing = !1, this.updateControl(), this.applyDir());
	}
	ensureControl() {
		let e = this.queryElement(":scope > tp-icon-button");
		e instanceof HTMLElement || (e = document.createElement("tp-icon-button"), this.prepend(e)), e.setAttribute("name", "arrow-right"), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.onControlClick), e.addEventListener("click", this.onControlClick), this.controlEl = e;
		let t = this.ensureControlId(e), n = this.queryElement(":scope > tp-dropdown");
		n instanceof HTMLElement || (n = document.createElement("tp-dropdown"), this.append(n));
		let r = n;
		r.setAttribute("anchor", `#${t}`), r.setAttribute("placement", "bottom"), r.setAttribute("outside-click", "");
		let i = r.querySelector("ul");
		if (!i || i.querySelectorAll(".tp-dir-option").length !== 3 || i.querySelector("tp-divider") === null) {
			let e = document.createElement("ul");
			for (let t of [
				"ltr",
				"rtl",
				"auto"
			]) {
				if (t === "auto") {
					let t = document.createElement("li");
					t.className = "tp-dir-separator", t.setAttribute("role", "none"), t.setAttribute("aria-hidden", "true");
					let n = document.createElement("tp-divider");
					t.append(n), e.append(t);
				}
				let n = document.createElement("li");
				n.className = "tp-dir-option", n.setAttribute("data-mode", t), n.setAttribute("role", "menuitem");
				let i = document.createElement("tp-icon");
				i.setAttribute("name", "check");
				let a = document.createElement("tp-icon");
				a.className = "tp-dir-option-icon";
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
		i.nextControlId += 1;
		let n = `tp-dir-control-${String(i.nextControlId)}`;
		return e.id = n, n;
	}
	onControlClick = () => {
		this.disabled || this.dropdownEl instanceof HTMLElement && (this.dropdownEl.open = !this.dropdownEl.open);
	};
	updateControl() {
		if (this.ensureControl(), !(this.controlEl instanceof HTMLElement)) return;
		let e = this.mode, t = this.resolveEffectiveDir(e);
		if (this.controlEl.setAttribute("label", `Direction: ${e}. Choose ltr, rtl, or auto.`), this.controlEl.setAttribute("data-mode", e), this.controlEl.setAttribute("data-effective-dir", t), this.controlEl.setAttribute("name", t === "rtl" ? "arrow-left" : "arrow-right"), this.dropdownEl instanceof HTMLElement) {
			let n = this.dropdownEl.querySelectorAll(".tp-dir-option");
			for (let r of n) {
				let n = r.getAttribute("data-mode"), i = r.querySelector("tp-icon.tp-dir-option-icon");
				n === "auto" ? i?.setAttribute("name", t === "rtl" ? "arrow-left" : "arrow-right") : n === "rtl" ? i?.setAttribute("name", "arrow-left") : n === "ltr" && i?.setAttribute("name", "arrow-right"), n === e ? r.setAttribute("data-selected", "") : r.removeAttribute("data-selected");
			}
		}
	}
	applyDir() {
		this.setAttribute("mode", this.mode), this.updateControl();
		let e = this.resolveTarget();
		if (!(e instanceof HTMLElement)) {
			this.teardownDocumentObserver(), this.targetElement instanceof HTMLElement && (u(this.targetElement, this), this.targetElement = null), this.hasAppliedDir = !0;
			return;
		}
		this.targetElement !== e && (this.targetElement instanceof HTMLElement && u(this.targetElement, this), this.targetElement = e, l(e, this));
		let t = this.mode;
		t === "auto" ? this.setupDocumentObserver() : this.teardownDocumentObserver();
		let n = this.resolveEffectiveDir(t);
		e.setAttribute("dir", n), this.emitChange(e, n), this.hasAppliedDir = !0, d(e, this);
	}
	emitChange(e, t) {
		this.hasAppliedDir && this.dispatchEvent(new CustomEvent(i.changeEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				mode: this.mode,
				dir: t,
				anchor: this.anchor,
				target: e
			}
		}));
	}
	resolveTarget() {
		let e = this.resolveAnchoredTarget();
		return e instanceof HTMLElement ? e : this.getEffectiveParent();
	}
	resolveAnchoredTarget() {
		let e = this.anchor.trim();
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
	resolveEffectiveDir(e) {
		return e === "ltr" ? "ltr" : e === "rtl" ? "rtl" : o();
	}
	setupDocumentObserver() {
		this.documentObserver === null && (this.documentObserver = new MutationObserver(() => {
			this.mode === "auto" && this.applyDir();
		}), this.documentObserver.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["dir", "lang"]
		}));
	}
	teardownDocumentObserver() {
		this.documentObserver?.disconnect(), this.documentObserver = null;
	}
};
customElements.get("tp-dir") || customElements.define("tp-dir", f);
//#endregion
export { f as t };

//# sourceMappingURL=dir.js.map