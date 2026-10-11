//#region src/utilities/iframe-overlay-bridge.ts
var e = "tp-dropdown[open], tp-tooltip[open], tp-popover[open], tp-contextmenu[open], tp-menu li[aria-expanded=\"true\"]", t = class {
	iframe;
	mutationObserver = null;
	placeholder = null;
	transparencyStyle = null;
	originalStyle = null;
	promoted = !1;
	handleLoad = () => this.observeDocument();
	handleViewportChange = () => this.updatePlacement();
	constructor(e) {
		this.iframe = e;
	}
	connect() {
		this.iframe.addEventListener("load", this.handleLoad), this.observeDocument();
	}
	disconnect() {
		this.iframe.removeEventListener("load", this.handleLoad), this.mutationObserver?.disconnect(), this.mutationObserver = null, this.restore();
	}
	observeDocument() {
		this.mutationObserver?.disconnect(), this.mutationObserver = null;
		let e = null;
		try {
			e = this.iframe.contentDocument;
		} catch {
			return;
		}
		if (e === null || e.documentElement === null || e.body === null) return;
		let t = e.defaultView?.MutationObserver ?? MutationObserver;
		this.mutationObserver = new t(() => this.sync()), this.mutationObserver.observe(e.documentElement, {
			attributes: !0,
			attributeFilter: ["open", "aria-expanded"],
			childList: !0,
			subtree: !0
		}), this.sync();
	}
	sync() {
		let t = null;
		try {
			t = this.iframe.contentDocument?.querySelector(e) ?? null;
		} catch {
			return;
		}
		if (t === null) {
			this.restore();
			return;
		}
		this.promote(), this.updatePlacement(), requestAnimationFrame(() => this.updatePlacement());
	}
	promote() {
		if (this.promoted || typeof this.iframe.showPopover != "function") return;
		let e = this.iframe.getBoundingClientRect(), t = document.createElement("span");
		t.setAttribute("data-tp-iframe-overlay-placeholder", ""), t.style.display = "block", t.style.flex = "1 1 auto", t.style.inlineSize = `${String(e.width)}px`, t.style.blockSize = `${String(e.height)}px`, this.iframe.before(t), this.placeholder = t, this.originalStyle = this.iframe.getAttribute("style"), this.prepareTransparentExtension(e.height), this.iframe.setAttribute("popover", "manual"), this.promoted = !0, this.updatePlacement();
		try {
			this.iframe.showPopover();
		} catch {
			this.restore();
			return;
		}
		window.addEventListener("resize", this.handleViewportChange), window.addEventListener("scroll", this.handleViewportChange, !0);
	}
	updatePlacement() {
		if (!this.promoted || this.placeholder === null) return;
		let e = this.placeholder.getBoundingClientRect(), t = this.measureRequiredHeight(e.height);
		Object.assign(this.iframe.style, {
			blockSize: `${String(t)}px`,
			background: "transparent",
			border: "0",
			bottom: "auto",
			inlineSize: `${String(e.width)}px`,
			left: `${String(e.left)}px`,
			margin: "0",
			maxBlockSize: "none",
			maxInlineSize: "none",
			padding: "0",
			position: "fixed",
			right: "auto",
			top: `${String(e.top)}px`
		});
	}
	prepareTransparentExtension(e) {
		let t = this.iframe.contentDocument;
		if (t === null || t.head === null || t.body === null) return;
		let n = t.defaultView, r = n?.getComputedStyle(t.body).backgroundColor ?? "", i = n?.getComputedStyle(t.documentElement).backgroundColor ?? "", a = (e) => e === "" || e === "transparent" || e === "rgba(0, 0, 0, 0)", o = a(r) ? a(i) ? "Canvas" : i : r, s = t.createElement("style");
		s.setAttribute("data-tp-iframe-overlay-transparency", ""), s.textContent = `
      html {
        background: transparent !important;
        overflow: hidden !important;
      }
      body {
        background: linear-gradient(
          to bottom,
          ${o} 0,
          ${o} ${String(e)}px,
          transparent ${String(e)}px,
          transparent 100%
        ) no-repeat !important;
        overflow: hidden !important;
      }
    `, t.head.append(s), this.transparencyStyle = s;
	}
	measureRequiredHeight(t) {
		let n = this.iframe.contentDocument;
		if (n === null) return t;
		let r = t;
		for (let t of n.querySelectorAll(e)) {
			let e = t.matches("tp-menu li[aria-expanded=\"true\"]") ? t.querySelector(":scope > ul") ?? t : t, i = e.getBoundingClientRect(), a = Math.max(i.height, e.scrollHeight);
			r = Math.max(r, i.top + a + 8);
			let o = t.getAttribute("anchor")?.trim() ?? "";
			if (o === "") continue;
			let s = null;
			try {
				s = n.querySelector(o);
			} catch {}
			if (s === null) continue;
			let c = s.getBoundingClientRect(), l = Number.parseFloat(t.getAttribute("offset") ?? "8") || 8, u = (t.getAttribute("placement") ?? "bottom") === "bottom" ? c.bottom + l + a : c.top + (c.height + a) / 2;
			r = Math.max(r, u + 8);
		}
		return Math.ceil(r);
	}
	restore() {
		if (this.promoted) {
			if (window.removeEventListener("resize", this.handleViewportChange), window.removeEventListener("scroll", this.handleViewportChange, !0), typeof this.iframe.hidePopover == "function") try {
				this.iframe.hidePopover();
			} catch {}
			this.originalStyle === null ? this.iframe.removeAttribute("style") : this.iframe.setAttribute("style", this.originalStyle), this.iframe.removeAttribute("popover"), this.placeholder?.remove(), this.transparencyStyle?.remove(), this.placeholder = null, this.transparencyStyle = null, this.originalStyle = null, this.promoted = !1;
		}
	}
};
//#endregion
export { t as IframeOverlayBridge };

//# sourceMappingURL=iframe-overlay-bridge.js.map