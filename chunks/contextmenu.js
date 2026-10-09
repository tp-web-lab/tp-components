import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/contextmenu/contextmenu.css?inline
var t = "tp-contextmenu{--tp-contextmenu-background:Canvas;--tp-contextmenu-foreground:CanvasText;--tp-contextmenu-border-color:color-mix(in srgb, currentColor 18%, transparent);--tp-contextmenu-shadow-1:#0000002e;--tp-contextmenu-shadow-2:#0000001a;--tp-contextmenu-hover:color-mix(in srgb, currentColor 10%, transparent);--tp-contextmenu-radius:.5rem;--tp-contextmenu-submenu-offset:calc(100% - .25rem);--tp-contextmenu-min-inline-size:12rem;--tp-contextmenu-padding:.25rem;--tp-contextmenu-item-padding-block:.5rem;--tp-contextmenu-item-padding-inline:.75rem;--tp-contextmenu-z-index:1000;background:var(--tp-contextmenu-background);border:1px solid var(--tp-contextmenu-border-color);border-radius:var(--tp-contextmenu-radius);box-shadow:0 8px 24px var(--tp-contextmenu-shadow-1), 0 2px 8px var(--tp-contextmenu-shadow-2);box-sizing:border-box;color:var(--tp-contextmenu-foreground);inline-size:max-content;min-inline-size:var(--tp-contextmenu-min-inline-size);padding:var(--tp-contextmenu-padding);z-index:var(--tp-contextmenu-z-index);display:block;position:fixed}tp-contextmenu:not([open]){display:none}tp-contextmenu>ul,tp-contextmenu ul ul{background:var(--tp-contextmenu-background);margin:0;padding:0;list-style:none}tp-contextmenu li{box-sizing:border-box;cursor:pointer;min-block-size:2rem;padding-block:var(--tp-contextmenu-item-padding-block);padding-inline:var(--tp-contextmenu-item-padding-inline);-webkit-user-select:none;user-select:none;background:0 0;border-radius:.375rem;align-items:center;gap:.5rem;display:flex;position:relative}tp-contextmenu li:hover,tp-contextmenu li:focus-visible{background:var(--tp-contextmenu-hover);outline:none}tp-contextmenu li[aria-disabled=true]{cursor:not-allowed;opacity:.45}tp-contextmenu li[aria-disabled=true]:hover,tp-contextmenu li[aria-disabled=true]:focus-visible{background:0 0}tp-contextmenu li[role=separator]{pointer-events:none;cursor:default;background:0 0;border-radius:0;min-block-size:0;margin:.25rem 0;padding:0;display:block}tp-contextmenu li[role=separator]:before{content:\"\";border-top:1px solid var(--tp-contextmenu-border-color);margin-inline:.25rem;display:block}tp-contextmenu li[role=separator]:after{content:none}tp-contextmenu li[role=separator]:hover,tp-contextmenu li[role=separator]:focus-visible{background:0 0;outline:none}tp-contextmenu li[aria-haspopup=menu]{padding-inline-end:2rem}tp-contextmenu li[aria-haspopup=menu]:after{content:\"▸\";position:absolute;inset-inline-end:.75rem}tp-contextmenu li>ul{background:var(--tp-contextmenu-background);border:1px solid var(--tp-contextmenu-border-color);border-radius:var(--tp-contextmenu-radius);box-shadow:0 8px 24px var(--tp-contextmenu-shadow-1), 0 2px 8px var(--tp-contextmenu-shadow-2);min-inline-size:var(--tp-contextmenu-min-inline-size);padding:var(--tp-contextmenu-padding);z-index:calc(var(--tp-contextmenu-z-index) + 1);display:none;position:absolute;inset-block-start:-.25rem;inset-inline-start:var(--tp-contextmenu-submenu-offset)}tp-contextmenu li[aria-expanded=true]>ul{display:block}", n = 0, r = class r extends e {
	static contextmenuStyleId = "tp-contextmenu-styles";
	anchorEl = null;
	instanceId = "";
	lastPointerX = 0;
	lastPointerY = 0;
	handleAnchorContextmenu = (e) => {
		e.preventDefault(), this.lastPointerX = e.clientX, this.lastPointerY = e.clientY, this.showAt(this.lastPointerX, this.lastPointerY);
	};
	handleDocumentPointerDown = (e) => {
		if (!this.open) return;
		let t = e.target;
		t instanceof Node && (this.contains(t) || this.hide());
	};
	handleDocumentKeydown = (e) => {
		this.open && e.key === "Escape" && this.hide();
	};
	static get observedAttributes() {
		return ["anchor", "open"];
	}
	get anchor() {
		return this.getStringAttribute("anchor");
	}
	set anchor(e) {
		this.setStringAttribute("anchor", e);
	}
	get open() {
		return this.getBooleanAttribute("open");
	}
	set open(e) {
		this.setBooleanAttribute("open", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.contextmenuStyleId, t), this.ensureInstanceId(), this.bindAnchor(), this.updateMenu(), document.addEventListener("pointerdown", this.handleDocumentPointerDown), document.addEventListener("keydown", this.handleDocumentKeydown);
	}
	attributeChangedCallback(e, t, n) {
		!this.isConnected || t === n || (e === "anchor" && this.bindAnchor(), this.updateMenu());
	}
	disconnectedCallback() {
		this.unbindAnchor(), document.removeEventListener("pointerdown", this.handleDocumentPointerDown), document.removeEventListener("keydown", this.handleDocumentKeydown);
	}
	showAt(e, t) {
		this.open = !0, this.positionMenu(e, t);
	}
	hide() {
		this.open = !1, this.closeAll();
	}
	closeAll() {
		let e = this.getMenuItems();
		for (let t of e) this.getSubmenu(t) !== null && t.setAttribute("aria-expanded", "false");
	}
	ensureInstanceId() {
		this.instanceId === "" && (n += 1, this.instanceId = `tp-contextmenu-${String(n)}`, this.setAttribute("data-tp-contextmenu-id", this.instanceId));
	}
	bindAnchor() {
		if (this.unbindAnchor(), this.anchor === "") return;
		let e = document.querySelector(this.anchor);
		e instanceof HTMLElement && (this.anchorEl = e, this.anchorEl.addEventListener("contextmenu", this.handleAnchorContextmenu));
	}
	unbindAnchor() {
		this.anchorEl !== null && (this.anchorEl.removeEventListener("contextmenu", this.handleAnchorContextmenu), this.anchorEl = null);
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
	getItemAction(e) {
		return e.getAttribute("data-action") ?? "";
	}
	getItemLabel(e) {
		return Array.from(e.childNodes).filter((e) => !(e instanceof HTMLUListElement)).map((e) => e.textContent ?? "").join(" ").trim().replace(/\s+/g, " ");
	}
	updateMenu() {
		let e = this.getRootMenu();
		e !== null && (e.setAttribute("role", "menu"), this.decorateMenu(e));
	}
	decorateMenu(e) {
		e.setAttribute("role", "menu");
		let t = this.getDirectMenuItems(e), n = !1;
		for (let e of t) {
			if (e.getAttribute("role") === "separator") {
				e.setAttribute("role", "separator"), e.removeAttribute("tabindex"), e.removeAttribute("aria-haspopup"), e.removeAttribute("aria-expanded"), e.onclick = null, e.onkeydown = null;
				continue;
			}
			e.setAttribute("role", "menuitem"), e.setAttribute("tabindex", n ? "-1" : "0"), n = !0;
			let r = this.getSubmenu(e);
			r === null ? (e.removeAttribute("aria-haspopup"), e.removeAttribute("aria-expanded")) : (e.setAttribute("aria-haspopup", "menu"), e.hasAttribute("aria-expanded") || e.setAttribute("aria-expanded", "false"), this.decorateMenu(r)), e.onclick = () => {
				if (e.getAttribute("aria-disabled") !== "true") {
					if (r !== null) {
						let t = e.getAttribute("aria-expanded") === "true";
						e.setAttribute("aria-expanded", String(!t));
						return;
					}
					this.handleItemActivation(e);
				}
			}, e.onkeydown = (n) => {
				if (e.getAttribute("aria-disabled") === "true") {
					(n.key === "Enter" || n.key === " ") && n.preventDefault();
					return;
				}
				this.handleKey(n, e, t.filter((e) => e.getAttribute("role") !== "separator"));
			};
		}
	}
	handleItemActivation(e) {
		if (e.getAttribute("aria-disabled") === "true" || e.getAttribute("role") === "separator") return;
		let t = this.getItemAction(e);
		t !== "" && this.dispatchEvent(new CustomEvent("tp-contextmenu-select", {
			bubbles: !0,
			detail: {
				action: t,
				item: e,
				label: this.getItemLabel(e)
			}
		})), this.hide();
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
				} else this.handleItemActivation(t);
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
	positionMenu(e, t) {
		let n = this.getBoundingClientRect(), r = Math.max(8, Math.min(e, window.innerWidth - n.width - 8)), i = Math.max(8, Math.min(t, window.innerHeight - n.height - 8));
		this.style.left = `${String(Math.round(r))}px`, this.style.top = `${String(Math.round(i))}px`;
	}
};
customElements.get("tp-contextmenu") || customElements.define("tp-contextmenu", r);
//#endregion
export { r as t };

