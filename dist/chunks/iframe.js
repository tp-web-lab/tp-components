import { t as e } from "./base.js";
import { IframeOverlayBridge as t } from "../utilities/iframe-overlay-bridge.js";
//#region src/components/iframe/iframe.css?inline
var n = "tp-iframe{--tp-iframe-zoom:1;background:canvas;min-block-size:0;inline-size:100%;min-inline-size:0;display:block;position:relative}tp-iframe>[data-tp-iframe-viewport]{block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;position:relative;overflow:auto}tp-iframe>[data-tp-iframe-viewport]>[data-tp-iframe-stage]{block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;position:relative}tp-iframe iframe{aspect-ratio:auto;block-size:100%;min-block-size:0;max-block-size:none;inline-size:100%;min-inline-size:0;max-inline-size:none;transform:scale(var(--tp-iframe-zoom));transform-origin:0 0;background:#fff;border:0;margin:0;padding:0;display:block;position:absolute;inset:0}tp-iframe[data-tp-iframe-interaction=false] iframe{pointer-events:none}", r = "25% 50% 75% 100% 125% 150% 175% 200%";
function i(e, t) {
	return e === null || e === "" ? t : e === "true" || e !== "false" && t;
}
function a(e) {
	let t = e.trim().split(/\s+/).map((e) => {
		let t = /^(?<value>\d+(?:\.\d+)?)%$/.exec(e);
		if (!t?.groups) return null;
		let n = Number(t.groups.value) / 100;
		return Number.isFinite(n) && n > 0 ? n : null;
	}).filter((e) => e !== null), n = [...new Set(t)].sort((e, t) => e - t);
	return n.length > 0 ? n : [
		.25,
		.5,
		.75,
		1,
		1.25,
		1.5,
		1.75,
		2
	];
}
function o(e) {
	return `${String(Math.round(e * 100))}%`;
}
var s = class s extends e {
	static styleId = "tp-iframe-styles";
	iframeEl = null;
	iframeOverlayBridge = null;
	stageEl = null;
	viewportEl = null;
	controlsEl = null;
	zoomLabelEl = null;
	mutationObserver = null;
	resizeObserver = null;
	handleScroll = () => {
		this.dispatchZoomState();
	};
	handleIframeLoad = () => {
		this.dispatchZoomState(), requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.dispatchEvent(new CustomEvent("tp-iframe-load", {
					bubbles: !0,
					detail: {
						contentHeight: this.getContentHeight(),
						hasSrcdoc: this.srcdoc !== "",
						src: this.src
					}
				}));
			});
		});
	};
	static get observedAttributes() {
		return [
			"src",
			"srcdoc",
			"fullscreen",
			"controls",
			"loading",
			"sandbox",
			"referrerpolicy",
			"interaction",
			"zoom",
			"zoom-levels"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	get srcdoc() {
		return this.getAttribute("srcdoc") ?? "";
	}
	set srcdoc(e) {
		if (e === "") {
			this.removeAttribute("srcdoc");
			return;
		}
		this.setAttribute("srcdoc", e);
	}
	get fullscreen() {
		return this.hasAttribute("fullscreen");
	}
	set fullscreen(e) {
		if (e) {
			this.setAttribute("fullscreen", "");
			return;
		}
		this.removeAttribute("fullscreen");
	}
	get controls() {
		return i(this.getAttribute("controls"), !1);
	}
	set controls(e) {
		this.setAttribute("controls", String(e));
	}
	get loading() {
		let e = this.getAttribute("loading");
		return e === "lazy" || e === "eager" ? e : "";
	}
	set loading(e) {
		if (e === "") {
			this.removeAttribute("loading");
			return;
		}
		if (e !== "lazy" && e !== "eager") throw TypeError("The \"loading\" attribute must be \"eager\" or \"lazy\".");
		this.setAttribute("loading", e);
	}
	get sandbox() {
		return this.getAttribute("sandbox") ?? "";
	}
	set sandbox(e) {
		if (e === "") {
			this.removeAttribute("sandbox");
			return;
		}
		this.setAttribute("sandbox", e);
	}
	get referrerPolicy() {
		return this.getAttribute("referrerpolicy") ?? "";
	}
	set referrerPolicy(e) {
		if (e === "") {
			this.removeAttribute("referrerpolicy");
			return;
		}
		this.setAttribute("referrerpolicy", e);
	}
	get interaction() {
		return i(this.getAttribute("interaction"), !0);
	}
	set interaction(e) {
		this.setAttribute("interaction", String(e));
	}
	get zoom() {
		let e = this.getAttribute("zoom");
		if (e === null || e === "") return 1;
		let t = Number(e);
		return Number.isFinite(t) && t >= 0 ? t : 1;
	}
	set zoom(e) {
		if (!Number.isFinite(e) || e < 0) throw TypeError("The \"zoom\" property must be a number greater than or equal to 0.");
		this.setAttribute("zoom", String(e));
	}
	get zoomLevels() {
		return this.getAttribute("zoom-levels") ?? r;
	}
	set zoomLevels(e) {
		if (e.trim() === "") {
			this.removeAttribute("zoom-levels");
			return;
		}
		this.setAttribute("zoom-levels", e);
	}
	get contentDocument() {
		return this.iframeEl?.contentDocument ?? null;
	}
	get contentWindow() {
		return this.iframeEl?.contentWindow ?? null;
	}
	getContentHeight() {
		let e = this.contentDocument;
		if (e === null) return 0;
		let t = e.body, n = e.documentElement;
		return Math.max(t?.scrollHeight ?? 0, t?.offsetHeight ?? 0, n?.scrollHeight ?? 0, n?.offsetHeight ?? 0);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureDom(), this.updateAll(), this.observeLayout();
	}
	attributeChangedCallback() {
		this.isConnected && (this.ensureDom(), this.updateAll());
	}
	disconnectedCallback() {
		super.connectedCallback(), this.viewportEl?.removeEventListener("scroll", this.handleScroll), this.iframeEl?.removeEventListener("load", this.handleIframeLoad), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.mutationObserver?.disconnect(), this.mutationObserver = null, this.iframeOverlayBridge?.disconnect(), this.iframeOverlayBridge = null;
	}
	zoomIn() {
		let e = a(this.zoomLevels), t = this.zoom, n = e.find((e) => e > t + 2 ** -52);
		this.zoom = n ?? e.at(-1) ?? t;
	}
	zoomOut() {
		let e = a(this.zoomLevels), t = this.zoom, n = [...e].reverse().find((e) => e < t - 2 ** -52);
		this.zoom = n ?? e[0] ?? t;
	}
	resetZoom(e = 1) {
		this.zoom = e;
	}
	ensureStyles() {
		if (document.getElementById(s.styleId)) return;
		let e = document.createElement("style");
		e.id = s.styleId, e.textContent = n, document.head.append(e);
	}
	ensureDom() {
		if (this.viewportEl !== null && this.stageEl !== null && this.iframeEl !== null && this.controlsEl !== null && this.zoomLabelEl !== null) return;
		this.textContent = "";
		let e = document.createElement("div");
		e.setAttribute("data-tp-iframe-viewport", ""), e.setAttribute("data-tp-iframe-role", "viewport"), e.addEventListener("scroll", this.handleScroll, { passive: !0 });
		let n = document.createElement("div");
		n.setAttribute("data-tp-iframe-stage", ""), n.setAttribute("data-tp-iframe-role", "stage");
		let r = document.createElement("iframe");
		r.setAttribute("data-tp-iframe-role", "iframe"), r.style.display = "block", r.style.inlineSize = "100%", r.style.blockSize = "100%", r.style.border = "0", r.addEventListener("load", this.handleIframeLoad), n.append(r), e.append(n);
		let i = document.createElement("div");
		i.setAttribute("data-tp-iframe-controls", ""), i.setAttribute("hidden", "");
		let a = document.createElement("span");
		a.setAttribute("data-tp-iframe-zoom-label", ""), i.append(a), this.append(e), this.append(i), this.viewportEl = e, this.stageEl = n, this.iframeEl = r, this.iframeOverlayBridge = new t(r), this.iframeOverlayBridge.connect(), this.controlsEl = i, this.zoomLabelEl = a;
	}
	observeLayout() {
		typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(() => {
			this.dispatchZoomState();
		}), this.resizeObserver.observe(this)), this.mutationObserver = new MutationObserver(() => {
			this.dispatchZoomState();
		}), this.mutationObserver.observe(this, {
			childList: !0,
			subtree: !1
		});
	}
	updateAll() {
		this.updateIframeAttributes(), this.updateZoom(), this.updateControls(), this.updateInteraction(), this.dispatchZoomState();
	}
	updateIframeAttributes() {
		this.iframeEl !== null && (this.iframeEl.title = this.getAttribute("aria-label")?.trim() || this.getAttribute("title")?.trim() || "Embedded content", this.src === "" ? this.iframeEl.removeAttribute("src") : this.iframeEl.src = this.src, this.srcdoc === "" ? this.iframeEl.removeAttribute("srcdoc") : this.iframeEl.srcdoc = this.srcdoc, this.fullscreen ? this.iframeEl.setAttribute("allowfullscreen", "") : this.iframeEl.removeAttribute("allowfullscreen"), this.loading === "" ? this.iframeEl.removeAttribute("loading") : this.iframeEl.setAttribute("loading", this.loading), this.sandbox === "" ? this.iframeEl.removeAttribute("sandbox") : this.iframeEl.setAttribute("sandbox", this.sandbox), this.referrerPolicy === "" ? this.iframeEl.removeAttribute("referrerpolicy") : this.iframeEl.setAttribute("referrerpolicy", this.referrerPolicy));
	}
	updateZoom() {
		this.style.setProperty("--tp-iframe-zoom", String(this.zoom));
	}
	updateControls() {
		this.controlsEl !== null && this.controlsEl.toggleAttribute("hidden", !this.controls), this.zoomLabelEl !== null && (this.zoomLabelEl.textContent = o(this.zoom));
	}
	updateInteraction() {
		this.setAttribute("data-tp-iframe-interaction", String(this.interaction)), this.iframeEl !== null && (this.iframeEl.style.pointerEvents = this.interaction ? "auto" : "none");
	}
	getOverflowWidth() {
		return this.viewportEl === null ? 0 : Math.max(0, this.viewportEl.scrollWidth - this.viewportEl.clientWidth);
	}
	dispatchZoomState() {
		this.dispatchEvent(new CustomEvent("tp-iframe-change", {
			bubbles: !0,
			detail: {
				interaction: this.interaction,
				overflowWidth: this.getOverflowWidth(),
				scrollPosition: this.viewportEl?.scrollLeft ?? 0,
				zoom: this.zoom,
				zoomText: o(this.zoom)
			}
		}));
	}
};
customElements.get("tp-iframe") || customElements.define("tp-iframe", s);
//#endregion
export { s as t };

//# sourceMappingURL=iframe.js.map