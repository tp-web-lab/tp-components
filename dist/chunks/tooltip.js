import { TpOverlayElement as e } from "../components/overlay/overlay.js";
//#region src/components/tooltip/tooltip.css?inline
var t = "tp-tooltip{color:canvas;font:inherit;pointer-events:none;z-index:1000;background:canvastext;border-radius:.375rem;max-inline-size:min(20rem,100vw - 1rem);margin:0;padding:.375rem .5rem;position:fixed;inset:auto}tp-tooltip:not([open]){display:none}";
//#endregion
//#region src/components/tooltip/tooltip.ts
function n(e) {
	return e === "top" || e === "end" || e === "bottom" || e === "start";
}
function r(e) {
	let t = e.trim();
	return t === "" ? !1 : /^(calc|min|max|clamp)\(/.test(t) ? !0 : /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(t);
}
var i = class i extends e {
	overlayName = "tp-tooltip";
	backdropTagName = "tp-tooltip-backdrop";
	toggleEventName = "tp-tooltip-toggle";
	get usesTopLayer() {
		return !0;
	}
	static styleId = "tp-tooltip-styles";
	resizeObserver = null;
	anchorEl = null;
	handleViewportChange = () => {
		this.positionTooltip();
	};
	handleAnchorMouseEnter = () => {
		this.show();
	};
	handleAnchorMouseLeave = () => {
		this.hide();
	};
	handleAnchorFocus = () => {
		this.show();
	};
	handleAnchorBlur = () => {
		this.hide();
	};
	static get observedAttributes() {
		return [
			"anchor",
			"placement",
			"offset",
			"open",
			"outside-click"
		];
	}
	get anchor() {
		return this.getAttribute("anchor") ?? "";
	}
	set anchor(e) {
		if (e === "") {
			this.removeAttribute("anchor");
			return;
		}
		this.setAttribute("anchor", e);
	}
	get placement() {
		let e = this.getAttribute("placement");
		return e !== null && n(e) ? e : "top";
	}
	set placement(e) {
		this.setAttribute("placement", e);
	}
	get offset() {
		let e = this.getAttribute("offset");
		return e !== null && r(e) ? e : "8px";
	}
	set offset(e) {
		if (!r(e)) throw TypeError("The \"offset\" attribute must be a valid CSS length like \"8px\" or \"0.5rem\".");
		this.setAttribute("offset", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.syncAnchor(), this.observeLayout(), this.positionTooltip(), window.addEventListener("resize", this.handleViewportChange), window.addEventListener("scroll", this.handleViewportChange, !0);
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "anchor" && this.syncAnchor(), this.updateOverlayState(), this.positionTooltip());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.unbindAnchorEvents(), this.resizeObserver?.disconnect(), this.resizeObserver = null, window.removeEventListener("resize", this.handleViewportChange), window.removeEventListener("scroll", this.handleViewportChange, !0);
	}
	getBackdropParent() {
		return null;
	}
	isBackdropContained() {
		return !1;
	}
	getToggleEventDetail() {
		return {
			anchor: this.anchor,
			placement: this.placement
		};
	}
	isInsideInteractiveBoundary(e) {
		return this.contains(e) ? !0 : this.anchorEl?.contains(e) ?? !1;
	}
	afterOverlayUpdate() {
		this.positionTooltip(), this.updateAria();
	}
	ensureStyles() {
		if (document.getElementById(i.styleId)) return;
		let e = document.createElement("style");
		e.id = i.styleId, e.textContent = t, document.head.append(e);
	}
	syncAnchor() {
		this.unbindAnchorEvents();
		let e = this.getAnchorElement();
		this.anchorEl = e, e !== null && (e.addEventListener("mouseenter", this.handleAnchorMouseEnter), e.addEventListener("mouseleave", this.handleAnchorMouseLeave), e.addEventListener("focus", this.handleAnchorFocus), e.addEventListener("blur", this.handleAnchorBlur), this.updateAria());
	}
	unbindAnchorEvents() {
		this.anchorEl !== null && (this.anchorEl.removeEventListener("mouseenter", this.handleAnchorMouseEnter), this.anchorEl.removeEventListener("mouseleave", this.handleAnchorMouseLeave), this.anchorEl.removeEventListener("focus", this.handleAnchorFocus), this.anchorEl.removeEventListener("blur", this.handleAnchorBlur), this.anchorEl.removeAttribute("aria-describedby"), this.anchorEl = null);
	}
	observeLayout() {
		typeof ResizeObserver > "u" || (this.resizeObserver = new ResizeObserver(() => {
			this.positionTooltip();
		}), this.resizeObserver.observe(this), this.anchorEl !== null && this.resizeObserver.observe(this.anchorEl));
	}
	getAnchorElement() {
		if (this.anchor === "") return null;
		let e = document.querySelector(this.anchor);
		return e instanceof HTMLElement ? e : null;
	}
	updateAria() {
		this.id === "" && (this.id = `${this.overlayName}-content-${Math.random().toString(36).slice(2, 10)}`), this.anchorEl !== null && (this.setAttribute("role", "tooltip"), this.anchorEl.setAttribute("aria-describedby", this.id));
	}
	getOffsetInPixels() {
		let e = this.offset.trim();
		if (e.endsWith("px")) return Number(e.slice(0, -2));
		let t = document.createElement("div");
		t.style.position = "absolute", t.style.visibility = "hidden", t.style.inlineSize = e, document.body.append(t);
		let n = t.getBoundingClientRect().width;
		return t.remove(), Number.isFinite(n) ? n : 8;
	}
	positionTooltip() {
		if (!this.open) return;
		let e = this.anchorEl;
		if (e === null) return;
		let t = e.getBoundingClientRect(), n = this.getBoundingClientRect(), r = this.getOffsetInPixels(), i = 0, a = 0;
		this.placement === "bottom" && (i = t.left + (t.width - n.width) / 2, a = t.bottom + r), this.placement === "top" && (i = t.left + (t.width - n.width) / 2, a = t.top - n.height - r), this.placement === "start" && (i = t.left - n.width - r, a = t.top + (t.height - n.height) / 2), this.placement === "end" && (i = t.right + r, a = t.top + (t.height - n.height) / 2);
		let o = Math.max(8, Math.min(i, window.innerWidth - n.width - 8)), s = Math.max(8, Math.min(a, window.innerHeight - n.height - 8));
		this.style.left = `${String(Math.round(o))}px`, this.style.top = `${String(Math.round(s))}px`;
	}
};
customElements.get("tp-tooltip") || customElements.define("tp-tooltip", i);
//#endregion
export { i as t };

//# sourceMappingURL=tooltip.js.map