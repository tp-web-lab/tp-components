import { sr as e } from "./lib/typescript/typescript.js";
//#region src/components/popover/popover.css?inline
var t = "tp-popover{z-index:1000;max-inline-size:min(24rem,100vw - 2rem);margin:0;position:fixed;inset:auto}tp-popover:not([open]){display:none}tp-popover-backdrop{opacity:0;pointer-events:none;visibility:hidden;z-index:999;background:0 0;position:fixed;inset:0}tp-popover-backdrop[data-open=true]{opacity:1;pointer-events:auto;visibility:visible}";
//#endregion
//#region src/components/popover/popover.ts
function n(e) {
	return e === "top" || e === "end" || e === "bottom" || e === "start";
}
function r(e) {
	let t = e.trim();
	return t === "" ? !1 : /^(calc|min|max|clamp)\(/.test(t) ? !0 : /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(t);
}
var i = class i extends e {
	overlayName = "tp-popover";
	backdropTagName = "tp-popover-backdrop";
	toggleEventName = "tp-popover-toggle";
	get usesTopLayer() {
		return !0;
	}
	static styleId = "tp-popover-styles";
	resizeObserver = null;
	handleViewportChange = () => {
		this.positionPopover();
	};
	handlePointerDownOutside = (e) => {
		if (!this.open || !this.outsideClick) return;
		let t = e.target;
		if (!(t instanceof Node)) return;
		let n = this.getAnchorElement();
		this.contains(t) || n?.contains(t) || this.hide();
	};
	isInsideInteractiveBoundary(e) {
		return this.contains(e) ? !0 : this.getAnchorElement()?.contains(e) ?? !1;
	}
	static get observedAttributes() {
		return [
			"anchor",
			"placement",
			"offset",
			"open",
			"backdrop",
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
	get outsideClick() {
		return this.hasAttribute("outside-click");
	}
	set outsideClick(e) {
		if (e) {
			this.setAttribute("outside-click", "");
			return;
		}
		this.removeAttribute("outside-click");
	}
	get placement() {
		let e = this.getAttribute("placement");
		return e !== null && n(e) ? e : "bottom";
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
		super.connectedCallback(), this.ensureStyles(), this.observeLayout(), this.positionPopover(), window.addEventListener("resize", this.handleViewportChange), window.addEventListener("scroll", this.handleViewportChange, !0), document.addEventListener("pointerdown", this.handlePointerDownOutside);
	}
	attributeChangedCallback() {
		this.isConnected && (this.updateOverlayState(), this.positionPopover());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.resizeObserver?.disconnect(), this.resizeObserver = null, window.removeEventListener("resize", this.handleViewportChange), window.removeEventListener("scroll", this.handleViewportChange, !0), document.removeEventListener("pointerdown", this.handlePointerDownOutside);
	}
	toggle() {
		this.open = !this.open;
	}
	getBackdropParent() {
		return document.body;
	}
	isBackdropContained() {
		return !1;
	}
	getToggleEventDetail() {
		return {
			anchor: this.anchor,
			placement: this.placement,
			outsideClick: this.outsideClick
		};
	}
	afterOverlayUpdate() {
		this.positionPopover();
	}
	ensureStyles() {
		if (document.getElementById(i.styleId)) return;
		let e = document.createElement("style");
		e.id = i.styleId, e.textContent = t, document.head.append(e);
	}
	observeLayout() {
		if (typeof ResizeObserver > "u") return;
		this.resizeObserver = new ResizeObserver(() => {
			this.positionPopover();
		}), this.resizeObserver.observe(this);
		let e = this.getAnchorElement();
		e !== null && this.resizeObserver.observe(e);
	}
	getAnchorElement() {
		if (this.anchor === "") return null;
		let e = document.querySelector(this.anchor);
		return e instanceof HTMLElement ? e : null;
	}
	getOffsetInPixels() {
		let e = this.offset.trim();
		if (e.endsWith("px")) return Number(e.slice(0, -2));
		let t = document.createElement("div");
		t.style.position = "absolute", t.style.visibility = "hidden", t.style.inlineSize = e, document.body.append(t);
		let n = t.getBoundingClientRect().width;
		return t.remove(), Number.isFinite(n) ? n : 8;
	}
	positionPopover() {
		if (!this.open) return;
		let e = this.getAnchorElement();
		if (e === null) return;
		let t = e.getBoundingClientRect(), n = this.getBoundingClientRect(), r = this.getOffsetInPixels(), i = 0, a = 0;
		this.placement === "bottom" && (i = t.left + (t.width - n.width) / 2, a = t.bottom + r), this.placement === "top" && (i = t.left + (t.width - n.width) / 2, a = t.top - n.height - r), this.placement === "start" && (i = t.left - n.width - r, a = t.top + (t.height - n.height) / 2), this.placement === "end" && (i = t.right + r, a = t.top + (t.height - n.height) / 2);
		let o = Math.max(8, Math.min(i, window.innerWidth - n.width - 8)), s = Math.max(8, Math.min(a, window.innerHeight - n.height - 8));
		this.style.left = `${String(Math.round(o))}px`, this.style.top = `${String(Math.round(s))}px`;
	}
};
customElements.get("tp-popover") || customElements.define("tp-popover", i);
//#endregion
export { i as t };

//# sourceMappingURL=popover.js.map