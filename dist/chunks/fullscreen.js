import { t as e } from "./base.js";
import "./icon-button.js";
import { isTpSizeType as t, isTpVariantType as n } from "../components/base/base.types.js";
//#region src/components/fullscreen/fullscreen.css?inline
var r = "tp-fullscreen{vertical-align:middle;display:inline-flex}tp-fullscreen>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-fullscreen>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-fullscreen>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}:where([data-tp-fullscreen-target]):fullscreen{background:var(--tp-background-color,Canvas);color:var(--tp-text-body,CanvasText)}", i = "tp-fullscreen-styles", a = /* @__PURE__ */ new Set([
	"TP-TOOLBAR",
	"TP-MENU",
	"TP-DROPDOWN",
	"TP-BUTTON-GROUP",
	"TP-CONTEXTMENU",
	"P"
]);
function o(e) {
	return e.tagName.includes("-");
}
var s = class s extends e {
	static changeEventName = "tp-fullscreen-change";
	static get observedAttributes() {
		return [
			"anchor",
			"variant",
			"size",
			"disabled"
		];
	}
	controlEl = null;
	fullscreenTarget = null;
	addedThemeClass = null;
	lastFullscreenTarget = null;
	lastFullscreenState = null;
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
		super.connectedCallback(), this.ensureGlobalStyle(i, r), this.ensureControl(), this.updateControl(), this.ownerDocument.addEventListener("fullscreenchange", this.handleFullscreenChange);
	}
	disconnectedCallback() {
		this.ownerDocument.removeEventListener("fullscreenchange", this.handleFullscreenChange), this.cleanupFullscreenTarget();
	}
	attributeChangedCallback() {
		this.isConnected && this.updateControl();
	}
	ensureControl() {
		let e = this.querySelector(":scope > tp-icon-button");
		e instanceof HTMLElement || (e = document.createElement("tp-icon-button"), this.replaceChildren(e)), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.handleControlClick), e.addEventListener("click", this.handleControlClick), this.controlEl = e;
	}
	updateControl() {
		if (this.ensureControl(), !(this.controlEl instanceof HTMLElement)) return;
		let e = this.resolveFullscreenTarget(), t = e !== null && this.ownerDocument.fullscreenElement === e, n = t ? "Exit fullscreen" : "Fullscreen";
		this.controlEl.setAttribute("name", t ? "fullscreen-exit" : "fullscreen"), this.controlEl.setAttribute("label", n), this.controlEl.setAttribute("title", n), this.controlEl.setAttribute("aria-pressed", String(t));
	}
	async toggleFullscreen() {
		let e = this.resolveFullscreenTarget();
		if (e !== null) {
			if (this.ownerDocument.fullscreenElement === e) {
				await this.ownerDocument.exitFullscreen(), this.updateControl();
				return;
			}
			this.prepareFullscreenTarget(e);
			try {
				await e.requestFullscreen(), this.updateControl();
			} catch (e) {
				throw this.cleanupFullscreenTarget(), e;
			}
		}
	}
	resolveFullscreenTarget() {
		let e = this.resolveAnchoredTarget();
		return e instanceof HTMLElement ? e : this.resolveContainingTarget();
	}
	resolveAnchoredTarget() {
		let e = this.anchor.trim();
		if (e === "") return null;
		let t = this.ownerDocument.querySelector(e);
		return t instanceof HTMLElement ? t : null;
	}
	resolveContainingTarget() {
		let e = this.parentElement;
		for (; e instanceof HTMLElement;) {
			let t = e.tagName.toUpperCase();
			if (a.has(t)) {
				e = e.parentElement;
				continue;
			}
			if (e.parentElement instanceof HTMLElement) {
				let t = e.parentElement.tagName.toUpperCase();
				if (a.has(t)) {
					e = e.parentElement.parentElement;
					continue;
				}
			}
			if (o(e)) return e;
			let n = e.parentElement?.closest(":defined");
			return n instanceof HTMLElement && o(n) ? n : e;
		}
		return null;
	}
	handleControlClick = () => {
		this.disabled || this.toggleFullscreen();
	};
	handleFullscreenChange = () => {
		let e = this.fullscreenTarget ?? this.lastFullscreenTarget ?? this.resolveFullscreenTarget();
		this.fullscreenTarget !== null && this.ownerDocument.fullscreenElement !== this.fullscreenTarget && this.cleanupFullscreenTarget(), this.updateControl();
		let t = this.fullscreenTarget ?? e;
		t instanceof HTMLElement && this.emitChange(t, this.ownerDocument.fullscreenElement === t);
	};
	prepareFullscreenTarget(e) {
		if (this.cleanupFullscreenTarget(), this.fullscreenTarget = e, this.lastFullscreenTarget = e, e.setAttribute("data-tp-fullscreen-target", ""), e.classList.contains("tp-light") || e.classList.contains("tp-dark")) return;
		let t = this.resolveEffectiveTheme(e);
		t !== null && (e.classList.add(t), this.addedThemeClass = t);
	}
	cleanupFullscreenTarget() {
		let e = this.fullscreenTarget;
		e !== null && (e.removeAttribute("data-tp-fullscreen-target"), this.addedThemeClass !== null && (e.classList.remove(this.addedThemeClass), this.addedThemeClass = null), this.fullscreenTarget = null);
	}
	emitChange(e, t) {
		this.lastFullscreenState === t && this.lastFullscreenTarget === e || (this.lastFullscreenState = t, this.lastFullscreenTarget = e, this.dispatchEvent(new CustomEvent(s.changeEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				fullscreen: t,
				anchor: this.anchor,
				target: e
			}
		})));
	}
	resolveEffectiveTheme(e) {
		let t = e.closest(".tp-light, .tp-dark");
		return t instanceof HTMLElement ? t.classList.contains("tp-dark") ? "tp-dark" : "tp-light" : this.ownerDocument.body.classList.contains("tp-dark") ? "tp-dark" : this.ownerDocument.body.classList.contains("tp-light") ? "tp-light" : this.ownerDocument.documentElement.classList.contains("tp-dark") ? "tp-dark" : this.ownerDocument.documentElement.classList.contains("tp-light") ? "tp-light" : null;
	}
};
customElements.get("tp-fullscreen") || customElements.define("tp-fullscreen", s);
//#endregion
export { s as t };

//# sourceMappingURL=fullscreen.js.map