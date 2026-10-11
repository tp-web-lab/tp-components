import { t as e } from "./base.js";
//#region src/components/dragdrop/dragdrop.css?inline
var t = "tp-dragdrop{display:none}.tp-dragdrop-status{clip:rect(0 0 0 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}", n = class n extends e {
	integration = null;
	get adapter() {
		return this.integration;
	}
	set adapter(e) {
		this.clearState(), this.integration = e, this.isConnected && (this.bindRoot(), this.updateItems());
	}
	static styleId = "tp-dragdrop-styles";
	rootEl = null;
	sourceEl = null;
	targetEl = null;
	position = null;
	statusEl = null;
	static get observedAttributes() {
		return [
			"root",
			"items",
			"handle"
		];
	}
	get root() {
		return this.getAttribute("root") ?? "";
	}
	set root(e) {
		if (e === "") {
			this.removeAttribute("root");
			return;
		}
		this.setAttribute("root", e);
	}
	get items() {
		return this.getAttribute("items") ?? "";
	}
	set items(e) {
		if (e === "") {
			this.removeAttribute("items");
			return;
		}
		this.setAttribute("items", e);
	}
	get handle() {
		return this.getAttribute("handle") ?? "";
	}
	set handle(e) {
		if (e === "") {
			this.removeAttribute("handle");
			return;
		}
		this.setAttribute("handle", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n.styleId, t), this.bindRoot(), this.updateItems();
	}
	attributeChangedCallback() {
		this.isConnected && (this.bindRoot(), this.updateItems());
	}
	disconnectedCallback() {
		this.unbindRoot(), this.clearState();
	}
	bindRoot() {
		if (this.unbindRoot(), this.integration === null && this.root === "") return;
		let e = this.integration?.root ?? document.querySelector(this.root);
		e instanceof HTMLElement && (this.rootEl = e, this.rootEl.addEventListener("dragstart", this.handleDragStart), this.rootEl.addEventListener("dragenter", this.handleDragEnter), this.rootEl.addEventListener("dragover", this.handleDragOver), this.rootEl.addEventListener("drop", this.handleDrop), this.rootEl.addEventListener("dragend", this.handleDragEnd), this.rootEl.addEventListener("keydown", this.handleKeyDown), this.integration === null && this.ensureStatus());
	}
	unbindRoot() {
		this.rootEl instanceof HTMLElement && (this.rootEl.removeEventListener("dragstart", this.handleDragStart), this.rootEl.removeEventListener("dragenter", this.handleDragEnter), this.rootEl.removeEventListener("dragover", this.handleDragOver), this.rootEl.removeEventListener("drop", this.handleDrop), this.rootEl.removeEventListener("dragend", this.handleDragEnd), this.rootEl.removeEventListener("keydown", this.handleKeyDown), this.statusEl?.remove(), this.statusEl = null, this.rootEl = null);
	}
	updateItems() {
		if (this.integration !== null || !(this.rootEl instanceof HTMLElement) || this.items === "") return;
		let e = Array.from(this.rootEl.querySelectorAll(this.items)).filter((e) => e instanceof HTMLElement);
		for (let t of e) {
			t.setAttribute("draggable", "true");
			let e = this.getKeyboardTarget(t);
			!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = 0);
		}
	}
	ensureStatus() {
		if (this.rootEl === null || this.statusEl !== null) return;
		let e = document.createElement("span");
		e.className = "tp-dragdrop-status", e.setAttribute("role", "status"), e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), this.rootEl.append(e), this.statusEl = e;
	}
	getKeyboardTarget(e) {
		return this.handle === "" ? e : e.querySelector(this.handle) ?? e;
	}
	getItems() {
		return this.rootEl === null || this.items === "" ? [] : Array.from(this.rootEl.querySelectorAll(this.items)).filter((e) => e instanceof HTMLElement);
	}
	getItemName(e) {
		return e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "item";
	}
	announce(e) {
		this.statusEl !== null && (this.statusEl.textContent = e);
	}
	getItemFromEvent(e) {
		if (this.integration !== null) return this.integration.getItem(e);
		if (this.items === "") return null;
		let t = e.target;
		if (!(t instanceof Element)) return null;
		let n = t.closest(this.items);
		return !(n instanceof HTMLElement) || !(this.rootEl instanceof HTMLElement) || !this.rootEl.contains(n) ? null : n;
	}
	canStartFromEvent(e) {
		if (this.integration !== null) return this.integration.canStart(e);
		if (this.handle === "") return !0;
		let t = e.target;
		return t instanceof Element && t.closest(this.handle) !== null;
	}
	getDropPosition(e, t) {
		if (this.integration !== null) return this.integration.getPosition(e, t);
		let n = t.getBoundingClientRect(), r = e.clientY - n.top, i = n.height > 0 ? r / n.height : .5;
		return i < .25 ? "before" : i > .75 ? "after" : "inside";
	}
	handleDragStart = (e) => {
		if (this.integration !== null && this.getItemFromEvent(e) === null) return;
		if (!this.canStartFromEvent(e)) {
			e.preventDefault();
			return;
		}
		let t = this.getItemFromEvent(e);
		t instanceof HTMLElement && (this.sourceEl = t, e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", this.integration?.getData(t) ?? "")), this.dispatchEvent(new CustomEvent("tp-dragdrop-start", {
			bubbles: !0,
			detail: { source: t }
		})));
	};
	handleDragEnter = (e) => {
		if (!(this.sourceEl instanceof HTMLElement)) return;
		let t = this.getItemFromEvent(e);
		!(t instanceof HTMLElement) || this.integration?.canDrop(t) === !1 || (e.preventDefault(), this.targetEl = t, this.position = this.getDropPosition(e, t), this.emitOver());
	};
	handleDragOver = (e) => {
		if (!(this.sourceEl instanceof HTMLElement)) return;
		let t = this.getItemFromEvent(e);
		!(t instanceof HTMLElement) || this.integration?.canDrop(t) === !1 || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.targetEl = t, this.position = this.getDropPosition(e, t), this.emitOver());
	};
	handleDrop = (e) => {
		if (e.preventDefault(), !(this.sourceEl instanceof HTMLElement)) {
			this.clearState();
			return;
		}
		let t = this.getItemFromEvent(e);
		if (t !== null && this.integration?.canDrop(t) === !1) {
			this.handleDragEnd();
			return;
		}
		let n = t instanceof HTMLElement ? this.integration === null ? this.getDropPosition(e, t) : this.position ?? this.getDropPosition(e, t) : null;
		this.dispatchEvent(new CustomEvent("tp-dragdrop-drop", {
			bubbles: !0,
			detail: {
				source: this.sourceEl,
				target: t,
				position: n
			}
		})), this.clearState();
	};
	handleDragEnd = () => {
		this.dispatchEvent(new CustomEvent("tp-dragdrop-end", { bubbles: !0 })), this.clearState();
	};
	handleKeyDown = (e) => {
		if (this.integration !== null) return;
		let t = this.getItemFromEvent(e);
		if (t === null) return;
		if (e.key === "Escape" && this.sourceEl !== null) {
			e.preventDefault(), this.announce(`Move cancelled for ${this.getItemName(this.sourceEl)}.`), this.dispatchEvent(new CustomEvent("tp-dragdrop-end", { bubbles: !0 })), this.clearState();
			return;
		}
		if (e.key === "Enter" || e.key === " ") {
			if (e.preventDefault(), this.sourceEl === null) {
				this.sourceEl = t, t.setAttribute("data-tp-dragdrop-keyboard-source", ""), this.announce(`${this.getItemName(t)} grabbed. Use arrow keys to choose a position, then press Enter or Space to drop.`), this.dispatchEvent(new CustomEvent("tp-dragdrop-start", {
					bubbles: !0,
					detail: { source: t }
				}));
				return;
			}
			if (this.targetEl === null || this.position === null) return;
			let n = this.sourceEl, r = this.targetEl, i = this.position;
			this.dispatchEvent(new CustomEvent("tp-dragdrop-drop", {
				bubbles: !0,
				detail: {
					source: n,
					target: r,
					position: i
				}
			})), this.announce(`${this.getItemName(n)} dropped ${i} ${this.getItemName(r)}.`), this.dispatchEvent(new CustomEvent("tp-dragdrop-end", { bubbles: !0 })), this.clearState();
			return;
		}
		if (this.sourceEl === null || ![
			"ArrowUp",
			"ArrowLeft",
			"ArrowDown",
			"ArrowRight"
		].includes(e.key)) return;
		e.preventDefault();
		let n = this.getItems(), r = this.targetEl ?? this.sourceEl, i = n.indexOf(r), a = e.key === "ArrowDown" || e.key === "ArrowRight", o = n[Math.min(n.length - 1, Math.max(0, i + (a ? 1 : -1)))];
		o === void 0 || o === this.sourceEl || (this.targetEl = o, this.position = a ? "after" : "before", this.getKeyboardTarget(o).focus(), this.announce(`Drop ${this.getItemName(this.sourceEl)} ${this.position} ${this.getItemName(o)}.`), this.emitOver());
	};
	emitOver() {
		this.sourceEl instanceof HTMLElement && this.dispatchEvent(new CustomEvent("tp-dragdrop-over", {
			bubbles: !0,
			detail: {
				source: this.sourceEl,
				target: this.targetEl,
				position: this.position
			}
		}));
	}
	clearState() {
		this.sourceEl?.removeAttribute("data-tp-dragdrop-keyboard-source"), this.sourceEl = null, this.targetEl = null, this.position = null;
	}
};
customElements.get("tp-dragdrop") || customElements.define("tp-dragdrop", n);
//#endregion
export { n as t };

//# sourceMappingURL=dragdrop.js.map