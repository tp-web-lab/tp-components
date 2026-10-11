import { t as e } from "./base.js";
import "./icon.js";
//#region src/components/tabs/tabs.css?inline
var t = "tp-tabs{--tp-tabs-border-color:var(--tp-neutral-stroke-soft);--tp-tabs-border-selected-color:var(--tp-brand-stroke-soft);--tp-tabs-tab-bg:var(--tp-neutral-fill-softer);--tp-tabs-tab-color:var(--tp-text-body);--tp-tabs-tab-selected-bg:var(--tp-paper-color);--tp-tabs-tab-selected-color:var(--tp-brand-text-colorful);--tp-tabs-panel-bg:var(--tp-paper-color);min-inline-size:0;max-inline-size:100%;margin-bottom:1rem;display:flow-root}tp-tabs>[data-tp-tablist]{width:100%;box-sizing:border-box;flex-wrap:wrap;gap:0;min-inline-size:0;margin:0;display:flex}tp-tabs>[data-tp-tablist]>[role=tab]{border:1px solid var(--tp-tabs-border-color);background:var(--tp-tabs-tab-bg);min-inline-size:0;color:var(--tp-tabs-tab-color);cursor:pointer;-webkit-user-select:none;user-select:none;border-bottom:none;border-radius:.5rem .5rem 0 0;flex:1 1 0;order:-1;justify-content:space-between;align-items:center;gap:.375rem;margin:0;padding:.25rem .5rem;font-weight:400;line-height:1.2;display:inline-flex}tp-tabs>[data-tp-tablist]>[role=tab]:not(:last-of-type){margin-inline-end:.25rem}tp-tabs>[data-tp-tablist]>[role=tab][aria-selected=true]{z-index:1;border-color:var(--tp-tabs-border-selected-color);background:var(--tp-tabs-tab-selected-bg);color:var(--tp-tabs-tab-selected-color);font-weight:600;position:relative}tp-tabs>[data-tp-tablist]>[role=tab][aria-disabled=true]{cursor:wait;opacity:.4}tp-tabs>[data-tp-tablist]>[role=tab] [data-tp-tab-label]{text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;display:inline-block;overflow:hidden}tp-tabs>[data-tp-tablist]>[role=tab] [data-tp-tab-close]{opacity:0;flex:none;align-self:center;transition:opacity .15s}tp-tabs>[data-tp-tablist]>[role=tab]:hover [data-tp-tab-close],tp-tabs>[data-tp-tablist]>[role=tab]:focus-within [data-tp-tab-close],tp-tabs>[data-tp-tablist]>[role=tab] [data-tp-tab-close]:focus-visible{opacity:1}tp-tabs>[data-tp-tablist]>[role=tab]:focus-visible{outline:2px solid var(--tp-focus-color);outline-offset:2px}tp-tabs>[data-tp-tablist]>[role=tab][draggable=true]{-webkit-user-drag:element}tp-tabs>[data-tp-tablist]>[role=tab][draggable=true]:active{cursor:grabbing}tp-tabs>[role=tabpanel]{box-sizing:border-box;width:100%;border:1px solid var(--tp-tabs-border-color);background:var(--tp-tabs-panel-bg);border-radius:0 0 .5rem .5rem;min-inline-size:0;margin:0;padding:.75rem 1rem}tp-tabs>[role=tabpanel][hidden]{display:none}tp-tabs[orientation=vertical]{grid-template-columns:auto minmax(0,1fr);column-gap:0;display:grid}tp-tabs[orientation=vertical]>[data-tp-tablist]{flex-direction:column;grid-column:1}tp-tabs[orientation=vertical]>[data-tp-tablist]>[role=tab]{border-inline-end:none;border-bottom:1px solid var(--tp-tabs-border-color);border-radius:.5rem 0 0 .5rem;flex:none;align-self:stretch;max-inline-size:18rem}tp-tabs[orientation=vertical]>[data-tp-tablist]>[role=tab]:not(:last-of-type){margin-block-end:.25rem;margin-inline-end:0}tp-tabs[orientation=vertical]>[role=tabpanel]{border-radius:0;border-start-end-radius:.5rem;border-end-end-radius:.5rem;grid-column:2}@media (prefers-reduced-motion:reduce){tp-tabs,tp-tabs *{transition-duration:.01ms!important;transition-delay:0s!important}}";
//#endregion
//#region src/components/tabs/tabs.ts
function n(e) {
	return e === "auto" || e === "manual";
}
function r(e) {
	return e === "horizontal" || e === "vertical";
}
var i = 0, a = class a extends e {
	static styleId = "tp-tabs-styles";
	instanceId = "";
	dlEl = null;
	mutationObserver = null;
	static get observedAttributes() {
		return [
			"selected",
			"activation",
			"orientation"
		];
	}
	get selected() {
		let e = this.getAttribute("selected"), t = Number(e);
		return Number.isInteger(t) && t >= 0 ? t : 0;
	}
	set selected(e) {
		if (!Number.isInteger(e) || e < 0) throw TypeError("The \"selected\" property must be an integer greater than or equal to 0.");
		this.setAttribute("selected", String(e));
	}
	get activation() {
		let e = this.getAttribute("activation");
		return e !== null && n(e) ? e : "auto";
	}
	set activation(e) {
		this.setAttribute("activation", e);
	}
	get orientation() {
		let e = this.getAttribute("orientation");
		return e !== null && r(e) ? e : "horizontal";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureInstanceId(), this.ensureDl(), this.observeMutations(), this.update();
	}
	disconnectedCallback() {
		super.connectedCallback(), this.mutationObserver?.disconnect(), this.mutationObserver = null;
	}
	attributeChangedCallback() {
		this.isConnected && (this.ensureDl(), this.update());
	}
	select(e) {
		let t = this.getTabs();
		if (t.length === 0) return;
		let n = Math.max(0, Math.min(e, t.length - 1));
		this.selected = n;
	}
	selectValue(e) {
		let t = this.getTabs().findIndex((t) => t.getAttribute("data-value") === e);
		t >= 0 && (this.selected = t);
	}
	addTab(e, t) {
		if (this.ensureDl(), this.dlEl === null) return -1;
		let n = this.getTabs().findIndex((t) => t.getAttribute("data-value") === e);
		if (n >= 0) {
			let e = this.getTabs()[n];
			return e !== void 0 && this.setTabLabel(e, t), this.update(), n;
		}
		let r = document.createElement("div");
		r.setAttribute("data-tp-tab", ""), r.setAttribute("data-value", e), r.setAttribute("draggable", "true");
		let i = document.createElement("span");
		i.setAttribute("data-tp-tab-label", ""), i.textContent = t;
		let a = document.createElement("tp-icon");
		a.setAttribute("data-tp-tab-close", ""), a.setAttribute("name", "close"), a.setAttribute("size", "xs"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
		let o = document.createElement("div");
		return o.setAttribute("data-tp-tabpanel", ""), o.setAttribute("data-value", e), this.dlEl.append(r), this.append(o), this.update(), this.getTabs().findIndex((t) => t.getAttribute("data-value") === e);
	}
	removeTab(e) {
		let t = this.getTabs(), n = this.getPanels(), r = t.findIndex((t) => t.getAttribute("data-value") === e);
		if (r < 0) return;
		t[r]?.remove(), n[r]?.remove();
		let i = this.getTabs().length;
		if (i === 0) {
			this.selected = 0, this.update();
			return;
		}
		this.selected >= i && (this.selected = i - 1), this.update();
	}
	moveTab(e, t) {
		if (this.dlEl === null) return;
		let n = this.getTabs(), r = this.getPanels();
		if (e < 0 || t < 0 || e >= n.length || t >= n.length || e === t) return;
		let i = n.map((e, t) => ({
			tab: e,
			panel: r[t]
		})), a = i.splice(e, 1)[0];
		if (a === void 0) return;
		i.splice(t, 0, a), this.dlEl.replaceChildren(...i.map((e) => e.tab));
		for (let e of i) e.panel !== void 0 && this.append(e.panel);
		let o = a.tab.getAttribute("data-value") ?? this.getSelectedValue();
		o !== null && this.selectValue(o), this.update();
	}
	clearTabs() {
		if (this.ensureDl(), this.dlEl !== null) {
			this.dlEl.replaceChildren();
			for (let e of this.getPanels()) e.remove();
			this.selected = 0, this.update();
		}
	}
	getSelectedValue() {
		return this.getTabs()[this.selected]?.getAttribute("data-value") ?? null;
	}
	refresh() {
		this.ensureDl(), this.update();
	}
	ensureStyles() {
		if (document.getElementById(a.styleId)) return;
		let e = document.createElement("style");
		e.id = a.styleId, e.textContent = t, document.head.append(e);
	}
	ensureInstanceId() {
		this.instanceId === "" && (i += 1, this.instanceId = `tp-tabs-${String(i)}`, this.setAttribute("data-tp-tabs-id", this.instanceId));
	}
	observeMutations() {
		this.mutationObserver?.disconnect(), this.mutationObserver = new MutationObserver(() => {
			this.ensureDl(), this.update();
		}), this.mutationObserver.observe(this, {
			childList: !0,
			subtree: !0
		});
	}
	normalizeDl() {
		if (this.dlEl === null) return;
		let e = this.getTabs();
		for (let t of e) if (t.querySelector("[data-tp-tab-label]") === null) {
			let e = Array.from(t.childNodes);
			t.replaceChildren();
			let n = document.createElement("span");
			n.setAttribute("data-tp-tab-label", "");
			for (let t of e) n.append(t);
			if (t.append(n), t.querySelector("[data-tp-tab-close]") === null) {
				let e = document.createElement("tp-icon");
				e.setAttribute("data-tp-tab-close", ""), e.setAttribute("name", "close"), e.setAttribute("size", "xs"), e.setAttribute("aria-hidden", "true"), t.append(e);
			}
		}
	}
	ensureDl() {
		let e = this.querySelector(":scope > [data-tp-tablist]");
		if (e !== null) {
			this.dlEl = e, this.dlEl.setAttribute("role", "tablist"), this.dlEl.setAttribute("aria-orientation", this.orientation), this.normalizeDl();
			return;
		}
		let t = this.querySelector(":scope > dl");
		if (t instanceof HTMLDListElement) {
			let e = document.createElement("div");
			e.setAttribute("data-tp-tablist", ""), e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", this.orientation);
			let n = [];
			for (let r of Array.from(t.children)) if (r instanceof HTMLElement) {
				if (r.tagName === "DT") {
					let t = document.createElement("div");
					t.setAttribute("data-tp-tab", "");
					for (let e of Array.from(r.attributes)) t.setAttribute(e.name, e.value);
					t.append(...Array.from(r.childNodes)), e.append(t);
				} else if (r.tagName === "DD") {
					let e = document.createElement("div");
					e.setAttribute("data-tp-tabpanel", "");
					for (let t of Array.from(r.attributes)) e.setAttribute(t.name, t.value);
					e.append(...Array.from(r.childNodes)), n.push(e);
				}
			}
			t.replaceWith(e), this.append(...n), this.dlEl = e, this.normalizeDl();
			return;
		}
		let n = document.createElement("div");
		n.setAttribute("data-tp-tablist", ""), n.setAttribute("role", "tablist"), n.setAttribute("aria-orientation", this.orientation), this.append(n), this.dlEl = n;
	}
	getTabs() {
		return this.dlEl === null ? [] : Array.from(this.dlEl.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-tp-tab"));
	}
	getPanels() {
		return this.dlEl === null ? [] : Array.from(this.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-tp-tabpanel"));
	}
	setTabLabel(e, t) {
		let n = e.querySelector("[data-tp-tab-label]");
		n instanceof HTMLElement && (n.textContent = t);
	}
	update() {
		if (this.dlEl === null) return;
		let e = this.getTabs(), t = this.getPanels(), n = e.length === 0 ? 0 : Math.max(0, Math.min(this.selected, e.length - 1));
		this.dlEl.setAttribute("aria-orientation", this.orientation);
		for (let [r, i] of e.entries()) {
			i.setAttribute("role", "tab"), i.setAttribute("tabindex", r === n ? "0" : "-1"), i.setAttribute("aria-selected", String(r === n)), i.setAttribute("aria-disabled", String(i.hasAttribute("disabled"))), i.setAttribute("aria-keyshortcuts", "Delete"), i.setAttribute("draggable", "true");
			let a = t[r];
			if (a !== void 0) {
				let e = `${this.instanceId}-tab-${String(r)}`, t = `${this.instanceId}-panel-${String(r)}`;
				i.id = e, a.id = t, i.setAttribute("aria-controls", t), a.setAttribute("aria-labelledby", e);
			}
			i.onclick = (e) => {
				if (i.hasAttribute("disabled")) return;
				let t = e.target;
				if (t instanceof HTMLElement && t.closest("[data-tp-tab-close]")) {
					this.dispatchCloseEvent(r), e.stopPropagation();
					return;
				}
				e.preventDefault(), this.selected = r, this.dispatchSelectEvent(r);
			}, i.onkeydown = (t) => {
				if (i.hasAttribute("disabled")) {
					(t.key === "Enter" || t.key === " ") && t.preventDefault();
					return;
				}
				if (t.target instanceof HTMLElement && t.target.closest("[data-tp-tab-close]")) {
					(t.key === "Enter" || t.key === " ") && (this.dispatchCloseEvent(r), t.preventDefault());
					return;
				}
				if (t.key === "Delete" && i.querySelector("[data-tp-tab-close]") !== null) {
					this.dispatchCloseEvent(r), t.preventDefault();
					return;
				}
				this.handleKey(t, r, e);
			}, i.ondragstart = (e) => {
				let t = i.getAttribute("data-value");
				if (t === null || t === "") return;
				let n = e.dataTransfer;
				n !== null && (n.setData("text/plain", String(r)), n.setData("application/x-tp-tabs-value", t), n.effectAllowed = "move");
			}, i.ondragover = (e) => {
				e.preventDefault();
				let t = e.dataTransfer;
				t !== null && (t.dropEffect = "move");
			}, i.ondrop = (t) => {
				t.preventDefault();
				let n = t.dataTransfer;
				if (n === null) return;
				let i = n.getData("text/plain"), a = Number(i);
				!Number.isInteger(a) || a < 0 || a >= e.length || a === r || (this.moveTab(a, r), this.dispatchReorderEvent(a, r));
			};
		}
		for (let [e, r] of t.entries()) r.setAttribute("role", "tabpanel"), r.hidden = e !== n;
	}
	dispatchSelectEvent(e) {
		let t = this.getTabs()[e]?.getAttribute("data-value") ?? "";
		this.dispatchEvent(new CustomEvent("tp-tabs-select", {
			bubbles: !0,
			detail: {
				selected: e,
				value: t
			}
		}));
	}
	dispatchCloseEvent(e) {
		let t = this.getTabs()[e]?.getAttribute("data-value") ?? "";
		this.dispatchEvent(new CustomEvent("tp-tabs-close", {
			bubbles: !0,
			detail: {
				index: e,
				value: t
			}
		}));
	}
	dispatchReorderEvent(e, t) {
		let n = this.getTabs()[t]?.getAttribute("data-value") ?? "";
		this.dispatchEvent(new CustomEvent("tp-tabs-reorder", {
			bubbles: !0,
			detail: {
				fromIndex: e,
				toIndex: t,
				value: n
			}
		}));
	}
	handleKey(e, t, n) {
		if (n.length === 0) return;
		let r = this.orientation === "horizontal", i = t;
		if ((r && e.key === "ArrowRight" || !r && e.key === "ArrowDown") && (i = (t + 1) % n.length), (r && e.key === "ArrowLeft" || !r && e.key === "ArrowUp") && (i = (t - 1 + n.length) % n.length), e.key === "Home" && (i = 0), e.key === "End" && (i = n.length - 1), i !== t) {
			n[i]?.focus(), this.activation === "auto" && (this.selected = i, this.dispatchSelectEvent(i)), e.preventDefault();
			return;
		}
		this.activation === "manual" && (e.key === "Enter" || e.key === " ") && (this.selected = t, this.dispatchSelectEvent(t), e.preventDefault());
	}
};
customElements.get("tp-tabs") || customElements.define("tp-tabs", a);
//#endregion
export { a as t };

//# sourceMappingURL=tabs.js.map