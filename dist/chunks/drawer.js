import "./icon-button.js";
import "./divider.js";
import { TpOverlayElement as e } from "../components/overlay/overlay.js";
//#region src/components/drawer/drawer.css?inline
var t = "tp-drawer{--tp-drawer-size:min(24rem, 100vw);--tp-drawer-duration:.2s;box-shadow:0 0 0 1px color-mix(in srgb, CanvasText 12%, transparent), 0 1rem 2rem color-mix(in srgb, CanvasText 18%, transparent);color:canvastext;visibility:hidden;z-index:1000;background:canvas;border:0;flex-direction:column;max-block-size:100vh;max-inline-size:100vw;margin:0;padding:0;display:flex;position:fixed;inset:auto;overflow:hidden}tp-drawer[contained]{position:absolute}tp-drawer[data-open=false]{pointer-events:none;visibility:hidden}tp-drawer[data-open=true]{pointer-events:auto;visibility:visible}tp-drawer[data-placement=end]{block-size:100%;inline-size:var(--tp-drawer-size);transition:transform var(--tp-drawer-duration) ease, visibility 0s linear var(--tp-drawer-duration);inset-block:0;inset-inline-end:0;transform:translate(100%)}tp-drawer[data-placement=end][data-open=true]{transition:transform var(--tp-drawer-duration) ease, visibility 0s linear 0s;transform:translate(0)}tp-drawer[data-placement=start]{block-size:100%;inline-size:var(--tp-drawer-size);transition:transform var(--tp-drawer-duration) ease, visibility 0s linear var(--tp-drawer-duration);inset-block:0;inset-inline-start:0;transform:translate(-100%)}tp-drawer[data-placement=start][data-open=true]{transition:transform var(--tp-drawer-duration) ease, visibility 0s linear 0s;transform:translate(0)}tp-drawer[data-placement=top]{block-size:min(24rem,100vh);inline-size:100%;transition:transform var(--tp-drawer-duration) ease, visibility 0s linear var(--tp-drawer-duration);inset-block-start:0;inset-inline:0;transform:translateY(-100%)}tp-drawer[data-placement=top][data-open=true]{transition:transform var(--tp-drawer-duration) ease, visibility 0s linear 0s;transform:translateY(0)}tp-drawer[data-placement=bottom]{block-size:min(24rem,100vh);inline-size:100%;transition:transform var(--tp-drawer-duration) ease, visibility 0s linear var(--tp-drawer-duration);inset-block-end:0;inset-inline:0;transform:translateY(100%)}tp-drawer[data-placement=bottom][data-open=true]{transition:transform var(--tp-drawer-duration) ease, visibility 0s linear 0s;transform:translateY(0)}tp-drawer>[data-tp-drawer-header]{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.75rem;padding:1rem;display:grid}tp-drawer>[data-tp-drawer-header]>[data-tp-drawer-actions]{grid-column:2;align-items:center;gap:.25rem;display:inline-flex}tp-drawer>[data-tp-drawer-header]>[data-tp-drawer-title]{font:inherit;text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;margin:0;font-weight:600;overflow:hidden}tp-drawer>[data-tp-drawer-content]{flex:auto;min-block-size:0;padding:1rem;overflow:auto}tp-drawer>tp-divider[data-tp-drawer-resize]{cursor:ew-resize;touch-action:none;z-index:1;border:0;inline-size:8px;margin:0;position:absolute;inset-block:0;inset-inline-start:0}tp-drawer[data-placement=start]>[data-tp-drawer-resize]{inset-inline:auto 0}tp-drawer>[data-tp-drawer-resize]:is(:hover,:focus-visible){background:var(--tp-brand-fill-mid)}tp-drawer>[data-tp-drawer-resize]:focus-visible{outline:2px solid var(--tp-brand-text-colorful);outline-offset:-2px}tp-drawer>[data-tp-drawer-resize][hidden]{display:none}tp-drawer-backdrop{opacity:0;pointer-events:none;visibility:hidden;z-index:999;background:#00000080;transition:opacity .2s;position:fixed;inset:0}tp-drawer-backdrop[data-open=true]{opacity:1;pointer-events:auto;visibility:visible}tp-drawer-backdrop[data-contained=true]{position:absolute}@media (prefers-reduced-motion:reduce){tp-drawer,tp-drawer *,tp-drawer-backdrop{transition-duration:.01ms!important;transition-delay:0s!important}}";
//#endregion
//#region src/components/drawer/drawer.ts
function n(e) {
	return e === "top" || e === "end" || e === "bottom" || e === "start";
}
var r = class r extends e {
	get closesOnBackdropClick() {
		return this.outsideClick;
	}
	get usesTopLayer() {
		return !this.contained;
	}
	overlayName = "tp-drawer";
	backdropTagName = "tp-drawer-backdrop";
	toggleEventName = "tp-drawer-toggle";
	static styleId = "tp-drawer-styles";
	static collapsedWidth = "24rem";
	static expandedWidth = "100vw";
	closeButtonEl = null;
	contentEl = null;
	collapseButtonEl = null;
	expandButtonEl = null;
	headerEl = null;
	titleEl = null;
	resizeHandle = null;
	resizeAbort = null;
	static get observedAttributes() {
		return [
			"placement",
			"open",
			"contained",
			"label",
			"width",
			"outside-click",
			"backdrop"
		];
	}
	get placement() {
		let e = this.getAttribute("placement");
		return e !== null && n(e) ? e : "end";
	}
	set placement(e) {
		this.setAttribute("placement", e);
	}
	get contained() {
		return this.hasAttribute("contained");
	}
	set contained(e) {
		if (e) {
			this.setAttribute("contained", "");
			return;
		}
		this.removeAttribute("contained");
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		if (e === "") {
			this.removeAttribute("label");
			return;
		}
		this.setAttribute("label", e);
	}
	get width() {
		return this.getAttribute("width") ?? "";
	}
	set width(e) {
		if (e === "") {
			this.removeAttribute("width");
			return;
		}
		this.setAttribute("width", e);
	}
	setContent(e) {
		if (this.ensureDom(), this.contentEl !== null) {
			if (this.contentEl.replaceChildren(), typeof e == "string") {
				this.contentEl.innerHTML = e;
				return;
			}
			if (e instanceof Node) {
				this.contentEl.append(e);
				return;
			}
			this.contentEl.append(...e);
		}
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureDom(), this.updateOverlayState();
	}
	attributeChangedCallback() {
		this.updateOverlayState();
	}
	disconnectedCallback() {
		this.resizeAbort?.abort(), super.disconnectedCallback();
	}
	getBackdropParent() {
		return this.contained ? this.parentElement : document.body;
	}
	isBackdropContained() {
		return this.contained;
	}
	getToggleEventDetail() {
		return {
			contained: this.contained,
			placement: this.placement
		};
	}
	afterOverlayUpdate() {
		this.setAttribute("data-placement", this.placement), this.updateWidth(), this.resizeHandle && (this.resizeHandle.hidden = this.placement === "top" || this.placement === "bottom", this.updateResizeAria()), this.open || this.resizeAbort?.abort(), this.titleEl !== null && (this.titleEl.textContent = this.label, this.titleEl.hidden = this.label === "");
	}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	ensureDom() {
		if (this.headerEl !== null && this.titleEl !== null && this.expandButtonEl !== null && this.collapseButtonEl !== null && this.closeButtonEl !== null && this.contentEl !== null) return;
		let e = Array.from(this.childNodes);
		this.textContent = "";
		let t = document.createElement("div");
		t.setAttribute("data-tp-drawer-header", ""), t.setAttribute("data-tp-drawer-role", "header");
		let n = document.createElement("tp-icon-button");
		n.setAttribute("name", "arrow-expand-horizontal"), n.setAttribute("label", "Expand drawer"), n.setAttribute("data-tp-drawer-expand", ""), n.setAttribute("data-tp-drawer-role", "expand-button"), n.addEventListener("click", () => {
			this.width = r.expandedWidth;
		});
		let i = document.createElement("tp-icon-button");
		i.setAttribute("name", "arrow-collapse-horizontal"), i.setAttribute("label", "Collapse drawer"), i.setAttribute("data-tp-drawer-collapse", ""), i.setAttribute("data-tp-drawer-role", "collapse-button"), i.addEventListener("click", () => {
			this.width = r.collapsedWidth;
		});
		let a = document.createElement("p");
		a.setAttribute("data-tp-drawer-title", ""), a.setAttribute("data-tp-drawer-role", "title");
		let o = document.createElement("div");
		o.setAttribute("data-tp-drawer-actions", "end");
		let s = document.createElement("tp-icon-button");
		s.setAttribute("name", "close"), s.setAttribute("label", "Close drawer"), s.setAttribute("data-tp-drawer-close", ""), s.setAttribute("data-tp-drawer-role", "close-button"), s.addEventListener("click", () => {
			this.hide();
		}), o.append(n, i, s), t.append(a, o);
		let c = document.createElement("div");
		c.setAttribute("data-tp-drawer-content", ""), c.setAttribute("data-tp-drawer-role", "content");
		for (let t of e) c.append(t);
		this.append(t, c), this.headerEl = t, this.titleEl = a, this.expandButtonEl = n, this.collapseButtonEl = i, this.closeButtonEl = s, this.contentEl = c;
		let l = document.createElement("tp-divider");
		l.setAttribute("orientation", "vertical"), l.setAttribute("data-tp-drawer-resize", ""), l.setAttribute("role", "separator"), l.setAttribute("aria-orientation", "vertical"), l.setAttribute("aria-label", "Resize drawer"), l.tabIndex = 0, l.addEventListener("pointerdown", (e) => this.startResize(e)), l.addEventListener("keydown", (e) => {
			if (![
				"ArrowLeft",
				"ArrowRight",
				"Home",
				"End"
			].includes(e.key)) return;
			e.preventDefault(), e.stopPropagation();
			let t = this.maximumWidth(), n = this.getBoundingClientRect().width, r = e.shiftKey ? 50 : 10, i = e.key === "Home" ? 0 : e.key === "End" ? t : n + (e.key === "ArrowRight" ? r : -r) * this.resizeDirection();
			this.setResizedWidth(i);
		}), this.resizeHandle = l, this.append(l);
	}
	maximumWidth() {
		return this.contained && this.parentElement?.clientWidth || window.innerWidth;
	}
	resizeDirection() {
		return (this.placement === "start" ? 1 : -1) * (getComputedStyle(this).direction === "rtl" ? -1 : 1);
	}
	setResizedWidth(e) {
		let t = this.maximumWidth();
		this.width = `${Math.round(Math.min(t, Math.max(Math.min(160, t), e)))}px`, this.updateResizeAria();
	}
	updateResizeAria() {
		let e = this.maximumWidth();
		this.resizeHandle?.setAttribute("aria-valuemin", String(Math.min(160, e))), this.resizeHandle?.setAttribute("aria-valuemax", String(e)), this.resizeHandle?.setAttribute("aria-valuenow", String(Math.round(this.getBoundingClientRect().width)));
	}
	startResize(e) {
		if (e.button !== 0 || !this.open || this.placement === "top" || this.placement === "bottom") return;
		e.preventDefault(), e.stopPropagation(), this.resizeAbort?.abort();
		let t = new AbortController();
		this.resizeAbort = t, window.addEventListener("blur", () => t.abort(), { signal: t.signal });
		let n = this.getBoundingClientRect().width, r = e.clientX, i = this.resizeDirection(), a = this.resizeHandle;
		a?.focus(), a?.setPointerCapture?.(e.pointerId), document.addEventListener("pointermove", (t) => {
			t.pointerId === e.pointerId && this.setResizedWidth(n + (t.clientX - r) * i);
		}, { signal: t.signal });
		let o = (n) => {
			n.pointerId === e.pointerId && (a?.hasPointerCapture?.(e.pointerId) && a.releasePointerCapture(e.pointerId), t.abort());
		};
		document.addEventListener("pointerup", o, { signal: t.signal }), document.addEventListener("pointercancel", o, { signal: t.signal });
	}
	updateWidth() {
		if (this.width === "") {
			this.style.removeProperty("--tp-drawer-size");
			return;
		}
		this.style.setProperty("--tp-drawer-size", this.width);
	}
};
customElements.get("tp-drawer") || customElements.define("tp-drawer", r);
//#endregion
export { r as t };

//# sourceMappingURL=drawer.js.map