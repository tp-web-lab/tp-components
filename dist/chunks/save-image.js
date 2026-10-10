import { Ku as e, _n as t, _r as n, vn as r, vr as i } from "./lib/typescript/typescript.js";
//#region src/components/save-image/save-image.css?inline
var a = "tp-save-image{vertical-align:middle;display:inline-flex}tp-save-image>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-save-image>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-save-image>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-save-image>tp-dropdown{min-inline-size:7rem}tp-save-image>tp-dropdown>ul{margin:0;padding:.25rem;list-style:none}tp-save-image [data-format]{border-radius:var(--tp-border-radius-sm,.25rem);cursor:pointer;padding:.4rem .65rem}tp-save-image [data-format]:is(:hover,:focus-visible){background:var(--tp-neutral-fill-softer,#f3f4f6);outline:none}";
//#endregion
//#region src/components/save-image/save-image.ts
function o(e) {
	return e === "svg" || e === "png" || e === "webp";
}
var s = class s extends e {
	static styleId = "tp-save-image-styles";
	static nextId = 0;
	dropdownEl = null;
	static get observedAttributes() {
		return [
			"anchor",
			"name",
			"filename",
			"variant",
			"size",
			"disabled"
		];
	}
	get anchor() {
		return this.getAttribute("anchor") ?? "";
	}
	set anchor(e) {
		this.setAttribute("anchor", e);
	}
	get name() {
		return this.getAttribute("name")?.trim() || "image-download";
	}
	set name(e) {
		this.setAttribute("name", e);
	}
	get filename() {
		return this.getAttribute("filename")?.trim() || "image";
	}
	set filename(e) {
		this.setAttribute("filename", e);
	}
	get variant() {
		let e = this.getAttribute("variant") ?? "neutral";
		return i(e) ? e : "neutral";
	}
	set variant(e) {
		this.setAttribute("variant", e);
	}
	get size() {
		let e = this.getAttribute("size") ?? "m";
		return n(e) ? e : "m";
	}
	set size(e) {
		this.setAttribute("size", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(s.styleId, a), this.ensureControl();
	}
	attributeChangedCallback() {
		this.isConnected && this.ensureControl();
	}
	async save(e) {
		if (!o(e)) throw TypeError(`Unsupported image format: ${e}`);
		let n = this.resolveTarget();
		if (!n) throw TypeError(`No image matches the anchor "${this.anchor}".`);
		try {
			let i = await t({
				suggestedName: `${this.safeFilename()}.${e}`,
				description: `${e.toUpperCase()} image`,
				mimeType: e === "svg" ? "image/svg+xml" : `image/${e}`,
				extension: `.${e}`
			});
			if (!i) return;
			await r(e === "svg" ? new Blob([await this.createSvg(n)], { type: "image/svg+xml" }) : await this.createRaster(n, e), i), this.dropdownEl?.removeAttribute("open"), this.dispatchEvent(new CustomEvent("tp-save-image-save", {
				bubbles: !0,
				composed: !0,
				detail: {
					format: e,
					filename: i.filename,
					anchor: this.anchor,
					target: n
				}
			}));
		} catch (t) {
			throw this.dispatchEvent(new CustomEvent("tp-save-image-error", {
				bubbles: !0,
				composed: !0,
				detail: {
					format: e,
					error: t,
					anchor: this.anchor
				}
			})), t;
		}
	}
	ensureControl() {
		let e = this.querySelector(":scope > tp-icon-button");
		e || (e = document.createElement("tp-icon-button"), this.prepend(e)), e.id === "" && (s.nextId += 1, e.id = `tp-save-image-trigger-${s.nextId}`), e.setAttribute("name", this.name), e.setAttribute("label", "Save image"), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.handleTriggerClick), e.addEventListener("click", this.handleTriggerClick);
		let t = this.querySelector(":scope > tp-dropdown");
		if (t instanceof HTMLElement || (t = document.createElement("tp-dropdown"), this.append(t)), t.setAttribute("anchor", `#${e.id}`), t.setAttribute("placement", "bottom"), t.setAttribute("outside-click", ""), !t.querySelector("[data-format]")) {
			let e = document.createElement("ul");
			e.setAttribute("role", "menu");
			for (let t of [
				"svg",
				"png",
				"webp"
			]) {
				let n = document.createElement("li");
				n.dataset.format = t, n.setAttribute("role", "menuitem"), n.tabIndex = 0, n.textContent = t.toUpperCase(), n.addEventListener("click", () => {
					this.save(t).catch(() => void 0);
				}), n.addEventListener("keydown", (e) => {
					(e.key === "Enter" || e.key === " ") && this.save(t).catch(() => void 0);
				}), e.append(n);
			}
			t.append(e);
		}
		this.dropdownEl = t;
	}
	handleTriggerClick = () => {
		this.disabled || this.dropdownEl?.toggle();
	};
	resolveTarget() {
		if (this.anchor.trim() === "") return null;
		try {
			return document.querySelector(this.anchor);
		} catch {
			return null;
		}
	}
	async createSvg(e) {
		if (typeof e.exportSvg == "function") return e.exportSvg();
		let t = e instanceof SVGSVGElement ? e : e.querySelector("svg");
		if (t) {
			let e = t.cloneNode(!0);
			return e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), new XMLSerializer().serializeToString(e);
		}
		let n = e instanceof HTMLCanvasElement || e instanceof HTMLImageElement ? e : e.querySelector("canvas, img");
		if (!(n instanceof HTMLCanvasElement || n instanceof HTMLImageElement)) throw TypeError("The anchored element does not contain an exportable image.");
		let r = n instanceof HTMLCanvasElement ? n.toDataURL("image/png") : n.currentSrc || n.src, { width: i, height: a } = this.imageSize(n);
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${a}" viewBox="0 0 ${i} ${a}"><image href="${r}" width="${i}" height="${a}" /></svg>`;
	}
	async createRaster(e, t) {
		if (e instanceof HTMLCanvasElement) return this.canvasBlob(e, t);
		let n = e.querySelector("canvas");
		if (n instanceof HTMLCanvasElement) return this.canvasBlob(n, t);
		let r = await this.createSvg(e), { width: i, height: a } = this.svgSize(r, e), o = new Image(), s = URL.createObjectURL(new Blob([r], { type: "image/svg+xml" }));
		try {
			await new Promise((e, t) => {
				o.onload = () => e(), o.onerror = () => t(/* @__PURE__ */ Error("The SVG could not be rasterized.")), o.src = s;
			});
			let e = document.createElement("canvas");
			e.width = i, e.height = a;
			let n = e.getContext("2d");
			if (!n) throw Error("Canvas rendering is not available.");
			return n.drawImage(o, 0, 0, i, a), await this.canvasBlob(e, t);
		} finally {
			URL.revokeObjectURL(s);
		}
	}
	svgSize(e, t) {
		let n = new DOMParser().parseFromString(e, "image/svg+xml").documentElement, r = n.getAttribute("width") ?? "", i = n.getAttribute("height") ?? "", a = r.includes("%") ? NaN : Number.parseFloat(r), o = i.includes("%") ? NaN : Number.parseFloat(i);
		if (Number.isFinite(a) && a > 0 && Number.isFinite(o) && o > 0) return {
			width: Math.round(a),
			height: Math.round(o)
		};
		let s = n.getAttribute("viewBox")?.trim().split(/[ ,]+/).map(Number);
		if (s?.length === 4 && Number.isFinite(s[2]) && Number.isFinite(s[3]) && (s[2] ?? 0) > 0 && (s[3] ?? 0) > 0) return {
			width: Math.round(s[2] ?? 1),
			height: Math.round(s[3] ?? 1)
		};
		let c = t.getBoundingClientRect();
		return {
			width: Math.max(1, Math.round(c.width || 1200)),
			height: Math.max(1, Math.round(c.height || 800))
		};
	}
	canvasBlob(e, t) {
		return new Promise((n, r) => e.toBlob((e) => e ? n(e) : r(/* @__PURE__ */ Error(`The image could not be encoded as ${t.toUpperCase()}.`)), `image/${t}`));
	}
	imageSize(e) {
		return e instanceof HTMLCanvasElement ? {
			width: e.width || 1,
			height: e.height || 1
		} : {
			width: e.naturalWidth || e.width || 1,
			height: e.naturalHeight || e.height || 1
		};
	}
	safeFilename() {
		return this.filename.replace(/\.(svg|png|webp)$/i, "").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "") || "image";
	}
};
customElements.get("tp-save-image") || customElements.define("tp-save-image", s);
//#endregion
export { s as t };

//# sourceMappingURL=save-image.js.map