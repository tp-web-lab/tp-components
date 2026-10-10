import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/card/card.css?inline
var t = ".tp-card{border:1px solid var(--tp-card-border-color,var(--tp-neutral-stroke-soft,#d6d9df));border-radius:var(--tp-card-border-radius,var(--tp-border-radius-lg,.5625rem));background:var(--tp-card-background,var(--tp-paper-color,#fff));color:var(--tp-text-body,inherit);flex-direction:column;display:flex;overflow:hidden}.tp-card *,.tp-card :before,.tp-card :after{box-sizing:border-box}.tp-card-header,.tp-card-main,.tp-card-footer{padding:var(--tp-card-padding,1rem)}.tp-card-header{border-bottom:1px solid var(--tp-card-border-color,var(--tp-neutral-stroke-soft,#d6d9df));background:var(--tp-card-header-background,var(--tp-neutral-fill-softer,#f5f6f8));font-weight:var(--tp-font-weight-bold,700);flex:none}.tp-card-main{background:var(--tp-card-background,var(--tp-paper-color,#fff));flex:auto;min-height:0}.tp-card-main-media{width:100%;height:100%;padding:0}.tp-card-media-only{width:fit-content;max-width:100%}.tp-card-main-media>:is(img,svg){object-fit:cover;width:100%;height:100%;margin:0;display:block}.tp-card-footer{border-top:1px solid var(--tp-card-border-color,var(--tp-neutral-stroke-soft,#d6d9df));background:var(--tp-card-footer-background,var(--tp-neutral-fill-softer,#f5f6f8));color:var(--tp-text-body,inherit);flex:none}.tp-card :where(p:first-child){margin-block-start:0}.tp-card :where(p:last-child){margin-block-end:0}.tp-card-error{padding:var(--tp-card-padding,1rem);background:var(--tp-danger-fill-softer,#f8d7da);color:var(--tp-danger-text-colorful,#721c24);font-weight:var(--tp-font-weight-semibold,500)}", n = [
	"header",
	"main",
	"footer"
], r = class r extends e {
	static styleId = "tp-card-styles";
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.styleId, t), this.classList.add("tp-card"), this.dataset.tpCardRendered !== "true" && this.renderFromDefinitionList();
	}
	renderFromDefinitionList() {
		let e = Array.from(this.children).find((e) => e.tagName === "DL");
		if (!e) {
			this.renderError("tp-card requires a definition list");
			return;
		}
		let t = /* @__PURE__ */ new Map(), r = null;
		for (let i of Array.from(e.children)) {
			if (i.tagName === "DT") {
				let e = i.textContent?.trim().toLowerCase() ?? "";
				r = n.includes(e) ? e : null;
				continue;
			}
			if (i.tagName === "DD" && r) {
				let e = t.get(r) ?? [];
				e.push(...Array.from(i.childNodes)), t.set(r, e);
			}
		}
		let i = document.createDocumentFragment();
		for (let e of n) {
			let n = t.get(e);
			if (!n || n.length === 0) continue;
			let r = document.createElement(e === "main" ? "div" : e);
			r.className = `tp-card-${e}`;
			let a = e === "main" && !t.has("header") && !t.has("footer") ? this.findOnlyMedia(n) : null;
			r.append(...a ? [a] : n), a && (r.classList.add("tp-card-main-media"), this.classList.add("tp-card-media-only")), i.append(r);
		}
		if (!i.hasChildNodes()) {
			this.renderError("tp-card requires header, main, or footer content");
			return;
		}
		this.replaceChildren(i), this.dataset.tpCardRendered = "true";
	}
	findOnlyMedia(e) {
		let t = e.filter((e) => e.nodeType !== Node.COMMENT_NODE && !(e.nodeType === Node.TEXT_NODE && !e.textContent?.trim()));
		if (t.length !== 1) return null;
		let n = t[0];
		return n instanceof Element ? ["img", "svg"].includes(n.localName) ? n : [
			"figure",
			"p",
			"span"
		].includes(n.localName) ? this.findOnlyMedia(Array.from(n.childNodes)) : null : null;
	}
	renderError(e) {
		let t = document.createElement("div");
		t.className = "tp-card-error", t.textContent = `Error: ${e}`, this.replaceChildren(t);
	}
};
customElements.get("tp-card") || customElements.define("tp-card", r);
//#endregion
export { r as t };

//# sourceMappingURL=card.js.map