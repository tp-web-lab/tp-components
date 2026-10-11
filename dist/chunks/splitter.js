import { t as e } from "./base.js";
//#region src/components/splitter/splitter.css?inline
var t = "tp-splitter{--tp-splitter-position:50%;--tp-splitter-divider-size:.75rem;--tp-splitter-divider-color:var(--tp-brand-fill-mid,#2563eb);box-sizing:border-box;min-block-size:0;min-inline-size:0;display:flow-root}tp-splitter>dl,tp-splitter>dl>dt,tp-splitter>dl>dd{box-sizing:border-box;margin:0;padding:0}tp-splitter>dl{block-size:100%;inline-size:100%;min-block-size:inherit;min-inline-size:inherit;display:grid}tp-splitter[axis=horizontal]>dl{grid-template-columns:minmax(0, var(--tp-splitter-position)) var(--tp-splitter-divider-size) minmax(0, calc(100% - var(--tp-splitter-position)));grid-template-rows:1fr}tp-splitter[axis=vertical]>dl{grid-template-columns:1fr;grid-template-rows:minmax(0, var(--tp-splitter-position)) var(--tp-splitter-divider-size) minmax(0, calc(100% - var(--tp-splitter-position)))}tp-splitter>dl>dt{display:none}tp-splitter>dl>dd{min-block-size:0;min-inline-size:0;margin:0;overflow:auto}tp-splitter>dl>[data-tp-splitter-panel=start]{grid-area:1/1}tp-splitter>dl>[data-tp-splitter-panel=end]{grid-area:1/3}tp-splitter[axis=vertical]>dl>[data-tp-splitter-panel=start]{grid-area:1/1}tp-splitter[axis=vertical]>dl>[data-tp-splitter-panel=end]{grid-area:3/1}tp-splitter>dl>[data-tp-splitter-divider]{background:color-mix(in srgb, var(--tp-splitter-divider-color) 12%, Canvas);-webkit-user-select:none;user-select:none;justify-content:center;align-items:center;min-block-size:0;min-inline-size:0;display:flex}tp-splitter[axis=horizontal]>dl>[data-tp-splitter-divider]{cursor:col-resize;grid-area:1/2}tp-splitter[axis=vertical]>dl>[data-tp-splitter-divider]{cursor:row-resize;grid-area:2/1}tp-splitter>dl>[data-tp-splitter-divider]:before{background:var(--tp-splitter-divider-color);content:\"\";border-radius:999px;display:block}tp-splitter[axis=horizontal]>dl>[data-tp-splitter-divider]:before{block-size:2rem;inline-size:.2rem}tp-splitter[axis=vertical]>dl>[data-tp-splitter-divider]:before{block-size:.2rem;inline-size:2rem}tp-splitter[data-dragging=true] tp-iframe,tp-splitter[data-dragging=true] iframe{pointer-events:none}";
//#endregion
//#region src/components/splitter/splitter.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
function r(e) {
	return e === "start" || e === "end";
}
function i(e) {
	return /^\d+(?:\.\d+)?%$/.test(e);
}
function a(e) {
	if (!i(e)) return null;
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : null;
}
var o = 0, s = class s extends e {
	static styleId = "tp-splitter-styles";
	dlEl = null;
	dividerEl = null;
	initialPosition = "50%";
	instanceId = "";
	handlePointerMove = (e) => {
		this.updatePositionFromPointer(e);
	};
	handlePointerUp = () => {
		this.endDrag(), this.savePosition(), this.dispatchChangeEvent();
	};
	static get observedAttributes() {
		return [
			"axis",
			"position",
			"storage-key"
		];
	}
	get axis() {
		let e = this.getAttribute("axis");
		return e !== null && n(e) ? e : "horizontal";
	}
	set axis(e) {
		this.setAttribute("axis", e);
	}
	get position() {
		let e = this.getAttribute("position") ?? "";
		return i(e) ? e : "50%";
	}
	set position(e) {
		if (!i(e)) throw TypeError("The \"position\" attribute must be a percentage string like \"50%\".");
		this.setAttribute("position", e);
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
		super.connectedCallback(), this.ensureStyles(), this.ensureInstanceId(), this.ensureStructure(), this.normalizeAxisAttribute(), this.initialPosition = this.position, this.loadPosition(), this.update();
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "axis" && this.normalizeAxisAttribute() || (e === "storage-key" && this.loadPosition(), this.update()));
	}
	disconnectedCallback() {
		super.connectedCallback(), this.endDrag();
	}
	reset() {
		this.position = this.initialPosition, this.savePosition(), this.update(), this.dispatchChangeEvent();
	}
	ensureStyles() {
		if (document.getElementById(s.styleId)) return;
		let e = document.createElement("style");
		e.id = s.styleId, e.textContent = t, document.head.append(e);
	}
	ensureInstanceId() {
		this.instanceId === "" && (o += 1, this.instanceId = `tp-splitter-${String(o)}`, this.setAttribute("data-tp-splitter-id", this.instanceId));
	}
	ensureStructure() {
		let e = this.querySelector("dl");
		if (!(e instanceof HTMLDListElement)) return;
		this.dlEl = e, this.dlEl.setAttribute("role", "presentation");
		let t = Array.from(e.children), n = null, i = null, a = "", o = "";
		for (let e = 0; e < t.length; e += 1) {
			let s = t[e], c = t[e + 1];
			if (!(s instanceof HTMLElement) || !(c instanceof HTMLElement) || s.tagName !== "DT" || c.tagName !== "DD") continue;
			let l = s.textContent?.trim().toLowerCase() ?? "";
			r(l) && (l === "start" && n === null && (n = c, a = s.textContent?.trim() ?? "start"), l === "end" && i === null && (i = c, o = s.textContent?.trim() ?? "end"), s.setAttribute("data-tp-splitter-term", l));
		}
		if (n !== null && (n.setAttribute("data-tp-splitter-panel", "start"), n.setAttribute("data-tp-splitter-label", a)), i !== null && (i.setAttribute("data-tp-splitter-panel", "end"), i.setAttribute("data-tp-splitter-label", o)), this.dividerEl === null) {
			let t = document.createElement("div");
			t.setAttribute("data-tp-splitter-divider", ""), t.setAttribute("role", "separator"), t.setAttribute("aria-label", "Resize panels"), t.setAttribute("aria-valuemin", "10"), t.setAttribute("aria-valuemax", "90"), t.tabIndex = 0, t.addEventListener("pointerdown", (e) => {
				e.preventDefault(), t.setPointerCapture?.(e.pointerId), this.beginDrag();
			}), t.addEventListener("keydown", (e) => {
				this.updatePositionFromKeyboard(e);
			}), this.dividerEl = t, e.append(t);
		}
	}
	beginDrag() {
		this.setAttribute("data-dragging", "true"), window.addEventListener("pointermove", this.handlePointerMove), window.addEventListener("pointerup", this.handlePointerUp);
	}
	endDrag() {
		this.removeAttribute("data-dragging"), window.removeEventListener("pointermove", this.handlePointerMove), window.removeEventListener("pointerup", this.handlePointerUp);
	}
	update() {
		if (this.dlEl !== null && (this.style.setProperty("--tp-splitter-position", this.position), this.dividerEl !== null)) {
			this.dividerEl.setAttribute("aria-orientation", this.axis === "horizontal" ? "vertical" : "horizontal");
			let e = a(this.position) ?? 50;
			this.dividerEl.setAttribute("aria-valuenow", String(e)), this.dividerEl.setAttribute("aria-valuetext", `${String(e)}%`);
		}
	}
	normalizeAxisAttribute() {
		let e = this.getAttribute("axis");
		return e === null || !n(e) ? (this.setAttribute("axis", "horizontal"), !0) : !1;
	}
	updatePositionFromPointer(e) {
		if (this.dlEl === null) return;
		let t = this.dlEl.getBoundingClientRect();
		if (this.axis === "horizontal") {
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
		let t = a(this.position) ?? 50, n = e.shiftKey ? 10 : 1, r = t;
		e.key === "Home" ? r = 10 : e.key === "End" ? r = 90 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? r -= n : r += n, this.position = `${String(this.clampPercentage(r))}%`, this.savePosition(), this.dispatchChangeEvent();
	}
	clampPercentage(e) {
		return Math.min(90, Math.max(10, Math.round(e * 100) / 100));
	}
	loadPosition() {
		if (this.storageKey !== "") try {
			let e = localStorage.getItem(this.storageKey), t = e === null ? null : a(e);
			t !== null && (this.position = `${String(this.clampPercentage(t))}%`);
		} catch {}
	}
	savePosition() {
		if (this.storageKey !== "") try {
			localStorage.setItem(this.storageKey, this.position);
		} catch {}
	}
	dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent("tp-splitter-change", {
			bubbles: !0,
			detail: {
				axis: this.axis,
				position: this.position,
				storageKey: this.storageKey
			}
		}));
	}
};
customElements.get("tp-splitter") || customElements.define("tp-splitter", s);
//#endregion
export { s as t };

//# sourceMappingURL=splitter.js.map