import { t as e } from "./base.js";
//#region src/components/menu/menu.css?inline
var t = "tp-menu{border:1px solid color-mix(in srgb, CanvasText 18%, transparent);border-radius:.5rem;display:flow-root}tp-menu ul{margin:0;padding:0;list-style:none}tp-menu ul>li{list-style:none}tp-menu>ul[role=menu]{gap:var(--tp-menu-gap,.25rem);display:flex}tp-menu[data-vertical]>ul[role=menu]{flex-direction:column}tp-menu[data-horizontal]>ul[role=menu]>li[role=menuitem]:not(:last-child):before{background:color-mix(in srgb, CanvasText 18%, transparent);content:\"\";block-size:1.25rem;inline-size:1px;position:absolute;inset-block-start:50%;inset-inline-end:calc(-.5 * var(--tp-menu-gap,.25rem));transform:translateY(-50%)}tp-menu[data-horizontal]>ul[role=menu]{flex-direction:row;align-items:center}tp-menu li[role=menuitem]{cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;position:relative}tp-menu li[role=menuitem]>p{margin:0}tp-menu li[role=menuitem]>a,tp-menu li[role=menuitem]>p>a{align-items:center;min-block-size:24px;min-inline-size:24px;display:inline-flex}tp-menu>ul[role=menu]>li[role=menuitem]{padding:.25rem .5rem}tp-menu li[role=menuitem]:focus-visible{outline-offset:2px;outline:2px solid}tp-menu li[aria-haspopup=menu]{grid-template-columns:max-content 1rem;align-items:center;column-gap:.35rem;padding-inline-end:.5rem;display:grid}tp-menu li[aria-haspopup=menu]:after{content:\"▸\";pointer-events:none;grid-column:2;justify-self:end;position:static;transform:none}tp-menu[data-horizontal] li[data-tp-menu-root-item][aria-haspopup=menu]:after,tp-menu li[aria-haspopup=menu][aria-expanded=true]:after{content:\"▾\"}tp-menu li[aria-haspopup=menu]>ul[data-tp-menu-submenu]{grid-column:1/-1}tp-menu ul[data-tp-menu-submenu]{border:1px solid color-mix(in srgb, CanvasText 18%, transparent);box-shadow:0 .5rem 1rem color-mix(in srgb, CanvasText 18%, transparent);color:canvastext;z-index:1000;background:canvas;border-radius:.5rem;min-inline-size:max-content;padding:.25rem;display:none;position:absolute}tp-menu li[aria-expanded=true]>ul[data-tp-menu-submenu]{display:block}tp-menu ul[data-tp-menu-submenu]{inset-block-start:0;inset-inline-start:calc(100% + .25rem)}tp-menu[data-horizontal] ul[data-tp-menu-root-submenu]{inset-block-start:calc(100% + .15rem);inset-inline-start:0}tp-menu ul[data-tp-menu-submenu]>li[role=menuitem]{padding:.35rem .75rem}tp-menu ul[data-tp-menu-submenu]>li[aria-haspopup=menu]{padding-inline-end:1.75rem}tp-menu li[data-tp-menu-divider]{background:color-mix(in srgb, CanvasText 18%, transparent);cursor:default;pointer-events:none;block-size:1px;margin-block:.25rem;padding:0}tp-menu li[data-tp-menu-divider]:before,tp-menu li[data-tp-menu-divider]:after{content:none}";
//#endregion
//#region src/components/menu/menu.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
var r = class r extends e {
	static styleId = "tp-menu-styles";
	static get observedAttributes() {
		return ["orientation"];
	}
	get orientation() {
		let e = this.getAttribute("orientation");
		return e !== null && n(e) ? e : "vertical";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.hasAttribute("orientation") || this.setAttribute("orientation", "vertical"), this.updateMenu(), document.addEventListener("pointerdown", this.handleDocumentPointerDown);
	}
	attributeChangedCallback() {
		this.isConnected && this.updateMenu();
	}
	disconnectedCallback() {
		super.connectedCallback(), document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
	}
	closeAll() {
		let e = this.getMenuItems();
		for (let t of e) this.getSubmenu(t) !== null && t.setAttribute("aria-expanded", "false");
	}
	refresh() {
		this.updateMenu();
	}
	ensureStyles() {
		let e = document.getElementById(r.styleId);
		if (e instanceof HTMLStyleElement) {
			e.textContent = t;
			return;
		}
		let n = document.createElement("style");
		n.id = r.styleId, n.textContent = t, document.head.append(n);
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
	handleDocumentPointerDown = (e) => {
		let t = e.target;
		t instanceof Node && (this.contains(t) || this.closeAll());
	};
	updateMenu() {
		let e = this.getRootMenu();
		if (e === null) return;
		let t = this.orientation;
		this.toggleAttribute("data-horizontal", t === "horizontal"), this.toggleAttribute("data-vertical", t === "vertical"), e.setAttribute("role", "menu"), e.setAttribute("aria-orientation", t), this.decorateMenu(e, !0);
	}
	decorateMenu(e, t = !1, n = !1) {
		e.setAttribute("role", "menu"), e.setAttribute("aria-orientation", t ? this.orientation : "vertical"), n ? e.setAttribute("data-tp-menu-root-submenu", "") : e.removeAttribute("data-tp-menu-root-submenu");
		let r = this.getDirectMenuItems(e);
		for (let [n, i] of r.entries()) {
			if (i.hasAttribute("data-tp-menu-divider")) {
				i.setAttribute("role", "separator"), i.setAttribute("aria-disabled", "true"), i.removeAttribute("tabindex");
				continue;
			}
			i.setAttribute("role", "menuitem"), t ? i.setAttribute("data-tp-menu-root-item", "") : i.removeAttribute("data-tp-menu-root-item"), i.setAttribute("tabindex", n === 0 ? "0" : "-1");
			let a = this.getSubmenu(i);
			a !== null && (a.setAttribute("data-tp-menu-submenu", ""), i.setAttribute("aria-haspopup", "menu"), i.hasAttribute("aria-expanded") || i.setAttribute("aria-expanded", "false"), this.decorateMenu(a, !1, t)), i.onclick = (e) => {
				let t = e.target;
				if (t instanceof Element && t.closest("li[role=\"menuitem\"]") === i) {
					if (a !== null) {
						let t = i.getAttribute("aria-expanded") === "true";
						t || this.closeSiblingSubmenus(i), i.setAttribute("aria-expanded", String(!t)), e.stopPropagation();
						return;
					}
					this.closeAll(), this.dispatchEvent(new CustomEvent("tp-menu-item-select", {
						bubbles: !0,
						composed: !0,
						detail: { item: i }
					})), e.stopPropagation();
				}
			}, i.onkeydown = (t) => {
				!(t.target instanceof Element) || t.target.closest("li[role=\"menuitem\"]") !== i || this.handleKey(t, i, r, e);
			};
		}
	}
	closeSiblingSubmenus(e) {
		let t = e.parentElement;
		if (!(t instanceof HTMLUListElement)) return;
		let n = this.getDirectMenuItems(t);
		for (let t of n) t !== e && t.setAttribute("aria-expanded", "false");
	}
	handleKey(e, t, n, r) {
		let i = n.indexOf(t);
		if (i < 0) return;
		let a = r === this.getRootMenu() ? this.orientation : "vertical";
		if (a === "vertical" && e.key === "ArrowDown" || a === "horizontal" && e.key === "ArrowRight") {
			let t = n[(i + 1) % n.length];
			this.focusItem(t), e.preventDefault();
			return;
		}
		if (a === "vertical" && e.key === "ArrowUp" || a === "horizontal" && e.key === "ArrowLeft") {
			let t = n[(i - 1 + n.length) % n.length];
			this.focusItem(t), e.preventDefault();
			return;
		}
		if (e.key === "ArrowRight") {
			let n = this.getSubmenu(t);
			if (n !== null) {
				t.setAttribute("aria-expanded", "true");
				let r = this.getDirectMenuItems(n)[0];
				this.focusItem(r), e.preventDefault();
				return;
			}
		}
		if (e.key === "ArrowLeft") {
			let n = t.parentElement?.closest("li");
			if (n instanceof HTMLLIElement) {
				n.setAttribute("aria-expanded", "false"), this.focusItem(n), e.preventDefault();
				return;
			}
		}
		if (e.key === "ArrowDown" && a === "horizontal") {
			let n = this.getSubmenu(t);
			if (n !== null) {
				t.setAttribute("aria-expanded", "true");
				let r = this.getDirectMenuItems(n)[0];
				this.focusItem(r), e.preventDefault();
				return;
			}
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
				if (t.setAttribute("aria-expanded", String(!e)), !e) {
					let e = this.getDirectMenuItems(n)[0];
					this.focusItem(e);
				}
			}
			e.preventDefault();
			return;
		}
		e.key === "Escape" && (this.closeAll(), this.focusItem(t), e.preventDefault());
	}
	focusItem(e) {
		if (e === void 0) return;
		let t = e.parentElement;
		if (!(t instanceof HTMLUListElement)) return;
		let n = this.getDirectMenuItems(t);
		for (let t of n) t.setAttribute("tabindex", t === e ? "0" : "-1");
		e.focus();
	}
};
customElements.get("tp-menu") || customElements.define("tp-menu", r);
//#endregion
export { r as t };

//# sourceMappingURL=menu.js.map