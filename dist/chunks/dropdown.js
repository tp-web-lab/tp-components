import { TpOverlayElement as e } from "../components/overlay/overlay.js";
//#region src/components/dropdown/dropdown.css?inline
var t = "tp-dropdown{--tp-dropdown-gap:.125rem;--tp-dropdown-padding:.25rem;border:1px solid color-mix(in srgb, currentColor 20%, transparent);box-sizing:border-box;color:canvastext;inline-size:max-content;max-inline-size:min(24rem,100vw - 1rem);padding:var(--tp-dropdown-padding);z-index:10000;background:canvas;border-radius:.5rem;margin:0;display:block;position:fixed;inset:auto;box-shadow:0 .5rem 1.5rem #0003}tp-dropdown:not([open]){display:none}tp-dropdown ul{margin:0;padding:0;list-style:none}tp-dropdown li,tp-dropdown ul>tp-divider{list-style:none}tp-dropdown>ul{background:canvas;inline-size:max-content;min-inline-size:max-content}tp-dropdown>ul[role=menu]{gap:var(--tp-dropdown-gap);flex-direction:column;display:flex}tp-dropdown li[role=menuitem]{cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;border-radius:.375rem;padding:.35rem .6rem;position:relative}tp-dropdown li[role=menuitem]:hover,tp-dropdown li[role=menuitem]:focus-visible{background:color-mix(in srgb, currentColor 10%, transparent);outline:none}tp-dropdown li[aria-disabled=true]{cursor:default;pointer-events:none}tp-dropdown li[data-tp-dropdown-divider]{border-block-start:1px solid color-mix(in srgb, currentColor 20%, transparent);block-size:0;margin:.25rem 0;padding:0}tp-dropdown li[aria-haspopup=menu]{padding-inline-end:1.75rem}tp-dropdown li[aria-haspopup=menu]:after{content:\"▸\";position:absolute;inset-inline-end:.5rem}tp-dropdown li[aria-haspopup=menu][aria-expanded=true]:after{content:\"▾\"}tp-dropdown li[aria-haspopup=menu]>ul[role=menu]{border:1px solid color-mix(in srgb, currentColor 20%, transparent);min-inline-size:max-content;padding:var(--tp-dropdown-padding);z-index:1001;background:canvas;border-radius:.5rem;display:none;position:absolute;inset-block-start:0;inset-inline-start:calc(100% + .25rem);box-shadow:0 .5rem 1.5rem #0003}tp-dropdown li[aria-haspopup=menu][aria-expanded=true]>ul[role=menu]{gap:var(--tp-dropdown-gap);flex-direction:column;display:flex}tp-dropdown[data-tp-code-editor-keyboard-dropdown]{max-block-size:calc(100vh - 1rem);overscroll-behavior:contain;max-height:calc(100vh - 1rem);overflow:hidden auto}tp-dropdown[data-tp-code-editor-keyboard-dropdown]>ul[role=menu]{overscroll-behavior:contain;overflow:visible}tp-dropdown[data-tp-code-editor-keyboard-dropdown] li[role=menuitem]{grid-template-columns:1fr auto;align-items:center;gap:2rem;display:grid}tp-dropdown[data-tp-code-editor-keyboard-dropdown] kbd{border:1px solid color-mix(in srgb, currentColor 25%, transparent);white-space:nowrap;border-radius:.25rem;padding:.05rem .35rem;font:.75rem ui-monospace,SFMono-Regular,Consolas,monospace}";
//#endregion
//#region src/components/dropdown/dropdown.ts
function n(e) {
	return e === "top" || e === "end" || e === "bottom" || e === "start";
}
function r(e) {
	let t = e.trim();
	return t === "" ? !1 : /^(calc|min|max|clamp)\(/.test(t) ? !0 : /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(t);
}
var i = class i extends e {
	overlayName = "tp-dropdown";
	backdropTagName = "tp-dropdown-backdrop";
	toggleEventName = "tp-dropdown-toggle";
	get usesTopLayer() {
		return !0;
	}
	static styleId = "tp-dropdown-styles";
	resizeObserver = null;
	anchorEl = null;
	handleViewportChange = (e) => {
		let t = e?.target;
		t instanceof Node && this.contains(t) || this.positionDropdown();
	};
	handleDropdownWheel = (e) => {
		if (!this.open || this.scrollHeight <= this.clientHeight) return;
		let t = this.scrollTop > 0, n = this.scrollTop + this.clientHeight < this.scrollHeight;
		(e.deltaY < 0 && t || e.deltaY > 0 && n) && (e.preventDefault(), e.stopPropagation(), this.scrollTop += e.deltaY);
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
		super.connectedCallback(), this.ensureStyles(), this.syncAnchor(), this.observeLayout(), this.updateMenu(), this.positionDropdown(), this.addEventListener("wheel", this.handleDropdownWheel, { passive: !1 }), window.addEventListener("resize", this.handleViewportChange), window.addEventListener("scroll", this.handleViewportChange, !0);
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "anchor" && this.syncAnchor(), this.updateOverlayState(), this.updateMenu(), this.positionDropdown());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.removeEventListener("wheel", this.handleDropdownWheel), window.removeEventListener("resize", this.handleViewportChange), window.removeEventListener("scroll", this.handleViewportChange, !0);
	}
	toggle() {
		this.open = !this.open;
	}
	show() {
		this.scrollTop = 0, super.show();
	}
	closeAll() {
		let e = this.getMenuItems();
		for (let t of e) this.getSubmenu(t) !== null && t.setAttribute("aria-expanded", "false");
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
		this.open || this.closeAll(), this.positionDropdown();
	}
	ensureStyles() {
		if (document.getElementById(i.styleId)) return;
		let e = document.createElement("style");
		e.id = i.styleId, e.textContent = t, document.head.append(e);
	}
	syncAnchor() {
		let e = this.getAnchorElement();
		this.anchorEl = e;
	}
	observeLayout() {
		typeof ResizeObserver > "u" || (this.resizeObserver = new ResizeObserver(() => {
			this.positionDropdown();
		}), this.resizeObserver.observe(this), this.anchorEl !== null && this.resizeObserver.observe(this.anchorEl));
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
	getRootMenu() {
		let e = this.querySelector(":scope > ul");
		return e instanceof HTMLUListElement ? e : null;
	}
	getDirectMenuItems(e) {
		return Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
	}
	getMenuItems() {
		return Array.from(this.querySelectorAll("li")).filter((e) => e instanceof HTMLLIElement);
	}
	getSubmenu(e) {
		return Array.from(e.children).find((e) => e instanceof HTMLUListElement) ?? null;
	}
	updateMenu() {
		let e = this.getRootMenu();
		e !== null && (e.setAttribute("role", "menu"), this.decorateMenu(e));
	}
	decorateMenu(e) {
		e.setAttribute("role", "menu");
		let t = this.getDirectMenuItems(e);
		for (let [e, n] of t.entries()) {
			n.setAttribute("role", "menuitem"), n.setAttribute("tabindex", e === 0 ? "0" : "-1");
			let r = this.getSubmenu(n);
			r !== null && (n.setAttribute("aria-haspopup", "menu"), n.hasAttribute("aria-expanded") || n.setAttribute("aria-expanded", "false"), this.decorateMenu(r)), n.onclick = () => {
				if (r !== null) {
					let e = n.getAttribute("aria-expanded") === "true";
					n.setAttribute("aria-expanded", String(!e));
					return;
				}
				this.hide();
			}, n.onkeydown = (e) => {
				this.handleKey(e, n, t);
			};
		}
	}
	handleKey(e, t, n) {
		let r = n.indexOf(t);
		if (!(r < 0)) {
			if (e.key === "ArrowDown") {
				this.focusItem(n[(r + 1) % n.length]), e.preventDefault();
				return;
			}
			if (e.key === "ArrowUp") {
				this.focusItem(n[(r - 1 + n.length) % n.length]), e.preventDefault();
				return;
			}
			if (e.key === "ArrowRight") {
				let n = this.getSubmenu(t);
				n !== null && (t.setAttribute("aria-expanded", "true"), this.focusItem(this.getDirectMenuItems(n)[0])), e.preventDefault();
				return;
			}
			if (e.key === "ArrowLeft") {
				let n = t.parentElement?.closest("li");
				n instanceof HTMLLIElement && (n.setAttribute("aria-expanded", "false"), this.focusItem(n)), e.preventDefault();
				return;
			}
			if (e.key === "Home") {
				this.focusItem(n[0]), e.preventDefault();
				return;
			}
			if (e.key === "End") {
				this.focusItem(n[n.length - 1]), e.preventDefault();
				return;
			}
			if (e.key === "Enter" || e.key === " ") {
				let n = this.getSubmenu(t);
				if (n !== null) {
					let e = t.getAttribute("aria-expanded") === "true";
					t.setAttribute("aria-expanded", String(!e)), e || this.focusItem(this.getDirectMenuItems(n)[0]);
				} else this.hide();
				e.preventDefault();
				return;
			}
			e.key === "Escape" && (this.hide(), e.preventDefault());
		}
	}
	focusItem(e) {
		if (e === void 0) return;
		let t = e.parentElement;
		if (!(t instanceof HTMLUListElement)) return;
		let n = this.getDirectMenuItems(t);
		for (let t of n) t.setAttribute("tabindex", t === e ? "0" : "-1");
		e.focus();
	}
	positionDropdown() {
		if (!this.open) return;
		let e = this.anchorEl;
		if (e === null) return;
		let t = e.getBoundingClientRect();
		this.resetScrollableConstraints();
		let n = this.getBoundingClientRect(), r = Math.max(n.height, this.scrollHeight), i = this.getOffsetInPixels(), a = 0, o = 0, s = this.getAttribute("data-tp-dropdown-align");
		this.placement === "bottom" && (a = s === "end" ? t.right - n.width : t.left, o = t.bottom + i), this.placement === "top" && (a = s === "end" ? t.right - n.width : t.left, o = t.top - n.height - i), this.placement === "start" && (a = t.left - n.width - i, o = t.top), this.placement === "end" && (a = t.right + i, o = t.top);
		let c = Math.max(8, Math.min(a, window.innerWidth - n.width - 8)), l = window.innerHeight - 120 - 8, u = Math.max(8, Math.min(o, l));
		this.style.left = `${String(Math.round(c))}px`, this.style.top = `${String(Math.round(u))}px`, this.applyScrollableConstraints(u, r);
	}
	applyScrollableConstraints(e, t) {
		let n = Math.max(120, Math.floor(window.innerHeight - e - 8)), r = `${String(n)}px`, i = t > n;
		this.style.maxHeight = r, this.style.maxBlockSize = r, this.style.height = i ? r : "auto", this.style.overflowY = i ? "auto" : "visible", this.style.overscrollBehavior = "contain";
	}
	resetScrollableConstraints() {
		this.style.removeProperty("height"), this.style.removeProperty("max-height"), this.style.removeProperty("max-block-size"), this.style.removeProperty("overflow-y"), this.style.removeProperty("overscroll-behavior");
	}
};
customElements.get("tp-dropdown") || customElements.define("tp-dropdown", i);
//#endregion
export { i as t };

//# sourceMappingURL=dropdown.js.map