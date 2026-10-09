import { Ku as e, Pr as t } from "./lib/typescript/typescript.js";
import { t as n } from "./lib/dompurify/dompurify.js";
//#region src/components/include/include.css?inline
var r = "tp-include{display:block}tp-include>[data-tp-include-loading]{font-style:italic}tp-include[mode=raw]>pre{white-space:pre;margin:0;overflow:auto}";
//#endregion
//#region src/components/include/include.ts
function i(e) {
	return e === "cors" || e === "no-cors" || e === "same-origin";
}
function a(e) {
	return /<html[\s>]/i.test(e) || /<body[\s>]/i.test(e);
}
var o = class o extends e {
	static styleId = "tp-include-styles";
	requestId = 0;
	static get observedAttributes() {
		return [
			"src",
			"mode",
			"fetch-mode",
			"allow-scripts",
			"allow-styles",
			"sanitize",
			"loading",
			"fallback"
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
	get mode() {
		return this.getAttribute("mode") === "raw" ? "raw" : "auto";
	}
	set mode(e) {
		e === "raw" ? this.setAttribute("mode", "raw") : this.removeAttribute("mode");
	}
	get fetchMode() {
		let e = this.getAttribute("fetch-mode");
		return e !== null && i(e) ? e : "cors";
	}
	set fetchMode(e) {
		this.setAttribute("fetch-mode", e);
	}
	get allowScripts() {
		return this.hasAttribute("allow-scripts");
	}
	set allowScripts(e) {
		if (e) {
			this.setAttribute("allow-scripts", "");
			return;
		}
		this.removeAttribute("allow-scripts");
	}
	get allowStyles() {
		return this.hasAttribute("allow-styles");
	}
	set allowStyles(e) {
		if (e) {
			this.setAttribute("allow-styles", "");
			return;
		}
		this.removeAttribute("allow-styles");
	}
	get sanitize() {
		return this.hasAttribute("sanitize");
	}
	set sanitize(e) {
		if (e) {
			this.setAttribute("sanitize", "");
			return;
		}
		this.removeAttribute("sanitize");
	}
	get loading() {
		return this.getAttribute("loading") ?? "";
	}
	set loading(e) {
		if (e === "") {
			this.removeAttribute("loading");
			return;
		}
		this.setAttribute("loading", e);
	}
	get fallback() {
		return this.getAttribute("fallback") ?? "";
	}
	set fallback(e) {
		if (e === "") {
			this.removeAttribute("fallback");
			return;
		}
		this.setAttribute("fallback", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.loadContent();
	}
	attributeChangedCallback() {
		this.isConnected && this.loadContent();
	}
	async reload() {
		await this.loadContent();
	}
	ensureStyles() {
		if (document.getElementById(o.styleId)) return;
		let e = document.createElement("style");
		e.id = o.styleId, e.textContent = r, document.head.append(e);
	}
	async loadContent() {
		let e = ++this.requestId;
		if (this.src === "") {
			this.replaceChildren();
			return;
		}
		this.renderLoading();
		try {
			let n = t(this, this.src);
			this.setAttribute("data-tp-source", n.href);
			let r = await fetch(n.href, { mode: this.fetchMode });
			if (e !== this.requestId) return;
			if (!r.ok) throw Error(`HTTP ${String(r.status)}`);
			let i = await r.text();
			if (e !== this.requestId) return;
			this.mode === "raw" ? this.injectRaw(i) : this.injectHtml(i), this.dispatchEvent(new CustomEvent("tp-include-load", {
				bubbles: !0,
				detail: {
					src: this.src,
					fetchMode: this.fetchMode,
					allowScripts: this.allowScripts,
					allowStyles: this.allowStyles,
					sanitize: this.sanitize,
					scriptsExecuted: this.allowScripts && !this.sanitize
				}
			}));
		} catch (t) {
			if (e !== this.requestId) return;
			this.renderFallback(), this.dispatchEvent(new CustomEvent("tp-include-error", {
				bubbles: !0,
				detail: {
					src: this.src,
					fetchMode: this.fetchMode,
					allowScripts: this.allowScripts,
					allowStyles: this.allowStyles,
					sanitize: this.sanitize,
					scriptsExecuted: !1,
					error: t instanceof Error ? t.message : "Unknown include error"
				}
			}));
		}
	}
	injectHtml(e) {
		let t = this.sanitize ? n.sanitize(e, { WHOLE_DOCUMENT: a(e) }) : e, r;
		if (a(t)) {
			let e = new DOMParser().parseFromString(t, "text/html");
			r = document.createDocumentFragment();
			for (let t of Array.from(e.body.childNodes)) r.append(t.cloneNode(!0));
		} else {
			let e = document.createElement("template");
			e.innerHTML = t, r = e.content.cloneNode(!0);
		}
		this.processStyles(r), this.processScripts(r), this.replaceChildren(r);
	}
	injectRaw(e) {
		let t = document.createElement("pre"), n = document.createElement("code");
		n.textContent = e, t.append(n), this.replaceChildren(t);
	}
	processStyles(e) {
		if (this.allowStyles) return;
		let t = Array.from(e.querySelectorAll("style"));
		for (let e of t) e.remove();
		let n = Array.from(e.querySelectorAll("link"));
		for (let e of n) e.getAttribute("rel")?.toLowerCase() === "stylesheet" && e.remove();
	}
	processScripts(e) {
		let t = Array.from(e.querySelectorAll("script")), n = this.allowScripts && !this.sanitize;
		for (let e of t) {
			if (s(e)) continue;
			if (!n) {
				e.remove();
				continue;
			}
			let t = document.createElement("script");
			for (let { name: n, value: r } of Array.from(e.attributes)) t.setAttribute(n, r);
			t.textContent = e.textContent, e.replaceWith(t);
		}
	}
	renderLoading() {
		if (this.loading === "") {
			this.replaceChildren();
			return;
		}
		let e = document.createElement("div");
		e.setAttribute("data-tp-include-loading", ""), e.textContent = this.loading, this.replaceChildren(e);
	}
	renderFallback() {
		if (this.fallback === "") {
			this.replaceChildren();
			return;
		}
		let e = this.querySelector(this.fallback);
		if (!(e instanceof HTMLElement)) {
			this.replaceChildren();
			return;
		}
		let t = e.cloneNode(!0);
		t instanceof HTMLElement && (t.hidden = !1), this.replaceChildren(t);
	}
};
function s(e) {
	return e.getAttribute("type")?.trim().toLowerCase().startsWith("tp/") === !0;
}
customElements.get("tp-include") || customElements.define("tp-include", o);
//#endregion
export { o as t };

