import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/compare/compare.css?inline
var t = "tp-compare{--tp-compare-position:50%;--tp-compare-divider-size:2px;--tp-compare-handle-size:2.5rem;display:block;position:relative;overflow:hidden}tp-compare>[data-tp-compare-layer]{position:absolute;inset:0;overflow:hidden}tp-compare>[data-tp-compare-layer=before]{z-index:1}tp-compare>[data-tp-compare-layer=after]{z-index:2}tp-compare[orientation=horizontal]>[data-tp-compare-layer=after]{clip-path:inset(0 calc(100% - var(--tp-compare-position)) 0 0)}tp-compare[orientation=vertical]>[data-tp-compare-layer=after]{clip-path:inset(0 0 calc(100% - var(--tp-compare-position)) 0)}tp-compare>[data-tp-compare-layer]>*{object-fit:cover;block-size:100%;inline-size:100%;display:block}tp-compare>[data-tp-compare-divider]{background:color-mix(in srgb, CanvasText 65%, Canvas);z-index:3;position:absolute}tp-compare[orientation=horizontal]>[data-tp-compare-divider]{block-size:100%;inline-size:var(--tp-compare-divider-size);inset-block-start:0;inset-inline-start:calc(var(--tp-compare-position) - (var(--tp-compare-divider-size) / 2))}tp-compare[orientation=vertical]>[data-tp-compare-divider]{block-size:var(--tp-compare-divider-size);inline-size:100%;inset-block-start:calc(var(--tp-compare-position) - (var(--tp-compare-divider-size) / 2));inset-inline-start:0}tp-compare>[data-tp-compare-handle]{border:1px solid color-mix(in srgb, CanvasText 30%, transparent);box-sizing:border-box;z-index:4;background:canvas;border-radius:999px;justify-content:center;align-items:center;display:flex;position:absolute}tp-compare[orientation=horizontal]>[data-tp-compare-handle]{block-size:var(--tp-compare-handle-size);inline-size:var(--tp-compare-handle-size);inset-block-start:calc(50% - (var(--tp-compare-handle-size) / 2));inset-inline-start:calc(var(--tp-compare-position) - (var(--tp-compare-handle-size) / 2))}tp-compare[orientation=vertical]>[data-tp-compare-handle]{block-size:var(--tp-compare-handle-size);inline-size:var(--tp-compare-handle-size);inset-block-start:calc(var(--tp-compare-position) - (var(--tp-compare-handle-size) / 2));inset-inline-start:calc(50% - (var(--tp-compare-handle-size) / 2))}tp-compare>[data-tp-compare-handle]:before{color:canvastext;content:\"⇆\";font-size:1rem;line-height:1}tp-compare[orientation=vertical]>[data-tp-compare-handle]:before{content:\"⇅\"}tp-compare>[data-tp-compare-label]{color:#fff;z-index:4;background:#000000b3;border-radius:.375rem;padding:.25rem .5rem;font:.875rem/1.2 inherit;position:absolute;inset-block-start:.75rem}tp-compare>[data-tp-compare-label=before]{inset-inline-start:.75rem}tp-compare>[data-tp-compare-label=after]{inset-inline-end:.75rem}";
//#endregion
//#region src/components/compare/compare.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
function r(e) {
	return /^\d+(?:\.\d+)?%$/.test(e);
}
function i(e) {
	return Number.parseFloat(e);
}
var a = class a extends e {
	static styleId = "tp-compare-styles";
	beforeLayerEl = null;
	afterLayerEl = null;
	dividerEl = null;
	handleEl = null;
	beforeLabelEl = null;
	afterLabelEl = null;
	initialPosition = "50%";
	handlePointerMove = (e) => {
		this.updatePositionFromPointer(e);
	};
	handlePointerUp = () => {
		window.removeEventListener("pointermove", this.handlePointerMove), window.removeEventListener("pointerup", this.handlePointerUp), this.savePosition();
	};
	static get observedAttributes() {
		return [
			"orientation",
			"position",
			"before-label",
			"after-label",
			"storage-key"
		];
	}
	get orientation() {
		let e = this.getAttribute("orientation");
		return e !== null && n(e) ? e : "horizontal";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	get position() {
		let e = this.getAttribute("position") ?? "";
		return r(e) ? e : "50%";
	}
	set position(e) {
		if (!r(e)) throw TypeError("The \"position\" attribute must be a percentage string like \"50%\".");
		this.setAttribute("position", e);
	}
	get beforeLabel() {
		return this.getAttribute("before-label") ?? "";
	}
	set beforeLabel(e) {
		if (e === "") {
			this.removeAttribute("before-label");
			return;
		}
		this.setAttribute("before-label", e);
	}
	get afterLabel() {
		return this.getAttribute("after-label") ?? "";
	}
	set afterLabel(e) {
		if (e === "") {
			this.removeAttribute("after-label");
			return;
		}
		this.setAttribute("after-label", e);
	}
	get storageKey() {
		return this.getAttribute("storage-key") ?? "";
	}
	set storageKey(e) {
		if (e === "") {
			this.removeAttribute("storage-key");
			return;
		}
		this.setAttribute("storage-key", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureStructure(), this.normalizeOrientationAttribute(), this.initialPosition = this.position, this.loadPosition(), this.updateCompare();
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "orientation" && this.normalizeOrientationAttribute() || (e === "storage-key" && this.loadPosition(), this.updateCompare()));
	}
	disconnectedCallback() {
		super.connectedCallback(), this.handlePointerUp();
	}
	reset() {
		this.position = this.initialPosition, this.savePosition(), this.updateCompare();
	}
	ensureStyles() {
		if (document.getElementById(a.styleId)) return;
		let e = document.createElement("style");
		e.id = a.styleId, e.textContent = t, document.head.append(e);
	}
	ensureStructure() {
		let e = this.querySelector("[slot=\"before\"]"), t = this.querySelector("[slot=\"after\"]");
		if (!(e === null || t === null)) {
			if (this.beforeLayerEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-layer", "before"), this.beforeLayerEl = e, this.append(e);
			}
			if (this.afterLayerEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-layer", "after"), this.afterLayerEl = e, this.append(e);
			}
			if (e.parentElement !== this.beforeLayerEl && this.beforeLayerEl.append(e), t.parentElement !== this.afterLayerEl && this.afterLayerEl.append(t), this.dividerEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-divider", ""), this.dividerEl = e, this.append(e);
			}
			if (this.handleEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-handle", ""), e.setAttribute("role", "separator"), e.setAttribute("aria-label", "Comparison position"), e.setAttribute("aria-valuemin", "5"), e.setAttribute("aria-valuemax", "95"), e.tabIndex = 0, e.addEventListener("pointerdown", (e) => {
					e.preventDefault(), window.addEventListener("pointermove", this.handlePointerMove), window.addEventListener("pointerup", this.handlePointerUp);
				}), e.addEventListener("keydown", (e) => {
					this.updatePositionFromKeyboard(e);
				}), this.handleEl = e, this.append(e);
			}
			if (this.beforeLabelEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-label", "before"), this.beforeLabelEl = e, this.append(e);
			}
			if (this.afterLabelEl === null) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-compare-label", "after"), this.afterLabelEl = e, this.append(e);
			}
		}
	}
	updateCompare() {
		if (this.style.setProperty("--tp-compare-position", this.position), this.handleEl !== null) {
			this.handleEl.setAttribute("aria-orientation", this.orientation === "horizontal" ? "vertical" : "horizontal");
			let e = i(this.position);
			this.handleEl.setAttribute("aria-valuenow", String(e)), this.handleEl.setAttribute("aria-valuetext", `${String(e)}%`);
		}
		this.updateLabels();
	}
	normalizeOrientationAttribute() {
		let e = this.getAttribute("orientation");
		return e === null || !n(e) ? (this.setAttribute("orientation", "horizontal"), !0) : !1;
	}
	updateLabels() {
		this.beforeLabelEl !== null && (this.beforeLabelEl.textContent = this.beforeLabel, this.beforeLabelEl.hidden = this.beforeLabel === ""), this.afterLabelEl !== null && (this.afterLabelEl.textContent = this.afterLabel, this.afterLabelEl.hidden = this.afterLabel === "");
	}
	updatePositionFromPointer(e) {
		let t = this.getBoundingClientRect();
		if (this.orientation === "horizontal") {
			let n = (e.clientX - t.left) / t.width * 100;
			this.position = `${String(this.clampPercentage(n))}%`;
			return;
		}
		let n = (e.clientY - t.top) / t.height * 100;
		this.position = `${String(this.clampPercentage(n))}%`;
	}
	updatePositionFromKeyboard(e) {
		if (![
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Home",
			"End"
		].includes(e.key)) return;
		e.preventDefault();
		let t = i(this.position), n = e.shiftKey ? 10 : 1, r = t;
		e.key === "Home" ? r = 5 : e.key === "End" ? r = 95 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? r -= n : r += n, this.position = `${String(this.clampPercentage(r))}%`, this.savePosition();
	}
	clampPercentage(e) {
		return Math.min(95, Math.max(5, Math.round(e * 100) / 100));
	}
	loadPosition() {
		if (this.storageKey !== "") try {
			let e = localStorage.getItem(this.storageKey);
			e !== null && r(e) && (this.position = e);
		} catch {}
	}
	savePosition() {
		if (this.storageKey !== "") try {
			localStorage.setItem(this.storageKey, this.position);
		} catch {}
	}
};
customElements.get("tp-compare") || customElements.define("tp-compare", a);
//#endregion
export { a as t };

//# sourceMappingURL=compare.js.map