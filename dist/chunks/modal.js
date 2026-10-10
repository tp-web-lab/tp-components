import { rr as e } from "./lib/typescript/typescript.js";
//#region src/components/modal/modal.css?inline
var t = "tp-modal{z-index:1000;position:absolute;inset-block-start:50%;inset-inline-start:50%;transform:translate(-50%,-50%)}tp-modal[fixed]{position:fixed}tp-modal:not([open]){display:none}tp-modal.contain{--tp-modal-margin:0px;max-block-size:calc(100% - (var(--tp-modal-margin) * 2));max-inline-size:calc(100% - (var(--tp-modal-margin) * 2));overflow:auto}tp-modal-backdrop{opacity:0;pointer-events:none;visibility:hidden;z-index:999;background:#00000080;transition:opacity .2s;position:fixed;inset:0}tp-modal-backdrop[data-open=true]{opacity:1;pointer-events:auto;visibility:visible}tp-modal-backdrop[data-contained=true]{position:absolute}@media (prefers-reduced-motion:reduce){tp-modal,tp-modal *,tp-modal-backdrop{transition-duration:.01ms!important;transition-delay:0s!important}}", n = class n extends e {
	overlayName = "tp-modal";
	backdropTagName = "tp-modal-backdrop";
	toggleEventName = "tp-modal-toggle";
	static styleId = "tp-modal-styles";
	previouslyFocusedElement = null;
	inertedElements = /* @__PURE__ */ new Map();
	modalStateInitialized = !1;
	temporaryTabIndex = !1;
	handleModalKeydown = (e) => {
		if (!this.open || e.key !== "Tab") return;
		let t = this.getFocusableElements();
		if (t.length === 0) {
			e.preventDefault(), this.focus();
			return;
		}
		let n = t[0], r = t.at(-1), i = this.ownerDocument.activeElement;
		if (e.shiftKey && (i === n || !this.contains(i))) {
			e.preventDefault(), r?.focus();
			return;
		}
		!e.shiftKey && (i === r || !this.contains(i)) && (e.preventDefault(), n?.focus());
	};
	handleDocumentFocus = (e) => {
		!this.open || e.target instanceof Node && this.contains(e.target) || this.focusInitialElement();
	};
	static get observedAttributes() {
		return [
			"open",
			"breakout",
			"margin",
			"fixed",
			"backdrop",
			"outside-click"
		];
	}
	get breakout() {
		return this.hasAttribute("breakout");
	}
	set breakout(e) {
		if (e) {
			this.setAttribute("breakout", "");
			return;
		}
		this.removeAttribute("breakout");
	}
	get margin() {
		return this.getAttribute("margin") ?? "";
	}
	set margin(e) {
		if (e === "") {
			this.removeAttribute("margin");
			return;
		}
		this.setAttribute("margin", e);
	}
	get fixed() {
		return this.hasAttribute("fixed");
	}
	set fixed(e) {
		if (e) {
			this.setAttribute("fixed", "");
			return;
		}
		this.removeAttribute("fixed");
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.hasAttribute("role") || this.setAttribute("role", "dialog"), this.setAttribute("aria-modal", "true"), this.addEventListener("keydown", this.handleModalKeydown), this.ownerDocument.addEventListener("focusin", this.handleDocumentFocus), this.updateOverlayState();
	}
	attributeChangedCallback() {
		this.updateOverlayState();
	}
	disconnectedCallback() {
		this.removeEventListener("keydown", this.handleModalKeydown), this.ownerDocument.removeEventListener("focusin", this.handleDocumentFocus), this.restoreBackground(), this.restoreTemporaryTabIndex(), this.modalStateInitialized = !1, super.disconnectedCallback();
	}
	getBackdropParent() {
		return this.fixed ? document.body : this.parentElement;
	}
	isBackdropContained() {
		return !this.fixed;
	}
	getToggleEventDetail() {
		return {
			breakout: this.breakout,
			fixed: this.fixed
		};
	}
	afterOverlayUpdate() {
		if (this.classList.toggle("contain", !this.breakout), this.margin === "" ? this.style.removeProperty("--tp-modal-margin") : this.style.setProperty("--tp-modal-margin", this.margin), !this.isConnected || this.modalStateInitialized === this.open) return;
		if (this.modalStateInitialized = this.open, this.open) {
			let e = this.ownerDocument.activeElement;
			this.previouslyFocusedElement = e instanceof HTMLElement ? e : null, this.makeBackgroundInert(), queueMicrotask(() => {
				this.open && this.isConnected && this.focusInitialElement();
			});
			return;
		}
		this.restoreBackground(), this.restoreTemporaryTabIndex();
		let e = this.previouslyFocusedElement;
		this.previouslyFocusedElement = null, queueMicrotask(() => {
			e?.isConnected && e.focus();
		});
	}
	getFocusableElements() {
		let e = [
			"a[href]",
			"area[href]",
			"button:not([disabled])",
			"input:not([disabled]):not([type=\"hidden\"])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"iframe",
			"audio[controls]",
			"video[controls]",
			"[contenteditable]:not([contenteditable=\"false\"])",
			"[tabindex]:not([tabindex=\"-1\"])"
		].join(",");
		return Array.from(this.querySelectorAll(e)).filter((e) => !e.hidden && e.getAttribute("aria-hidden") !== "true");
	}
	focusInitialElement() {
		let e = this.querySelector("[autofocus]") ?? this.getFocusableElements()[0];
		if (e != null) {
			e.focus();
			return;
		}
		this.hasAttribute("tabindex") || (this.tabIndex = -1, this.temporaryTabIndex = !0), this.focus();
	}
	makeBackgroundInert() {
		let e = this, t = e.parentElement;
		for (; t !== null;) {
			for (let n of Array.from(t.children)) n instanceof HTMLElement && n !== e && n.tagName !== "TP-MODAL-BACKDROP" && (this.inertedElements.set(n, n.hasAttribute("inert")), n.inert = !0);
			e = t, t = t.parentElement;
		}
	}
	restoreBackground() {
		for (let [e, t] of this.inertedElements) e.inert = t;
		this.inertedElements.clear();
	}
	restoreTemporaryTabIndex() {
		this.temporaryTabIndex &&= (this.removeAttribute("tabindex"), !1);
	}
	ensureStyles() {
		if (document.getElementById(n.styleId)) return;
		let e = document.createElement("style");
		e.id = n.styleId, e.textContent = t, document.head.append(e);
	}
};
customElements.get("tp-modal") || customElements.define("tp-modal", n);
//#endregion
export { n as t };

//# sourceMappingURL=modal.js.map