import { qu as e, vr as t } from "./lib/typescript/typescript.js";
//#region src/components/avatar/avatar.css?inline
var n = "tp-avatar{vertical-align:middle;flex:none;block-size:3rem;inline-size:3rem;font-size:1.25rem;font-weight:600;line-height:1;display:inline-flex}tp-avatar[data-size=xxs]{block-size:1rem;inline-size:1rem;font-size:.416667rem}tp-avatar[data-size=xs]{block-size:1.5rem;inline-size:1.5rem;font-size:.625rem}tp-avatar[data-size=s]{block-size:2rem;inline-size:2rem;font-size:.833333rem}tp-avatar[data-size=l]{block-size:4rem;inline-size:4rem;font-size:1.66667rem}tp-avatar[data-size=xl]{block-size:5rem;inline-size:5rem;font-size:2.08333rem}tp-avatar[data-size=xxl]{block-size:6rem;inline-size:6rem;font-size:2.5rem}tp-avatar>.tp-avatar-visual{border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-neutral-fill-softer);block-size:100%;inline-size:100%;color:var(--tp-neutral-text-on-soft);border-radius:50%;justify-content:center;align-items:center;display:flex;overflow:hidden}tp-avatar[data-shape=square]>.tp-avatar-visual{border-radius:0}tp-avatar>.tp-avatar-visual>img{object-fit:cover;block-size:100%;inline-size:100%;display:block}", r = class extends e {
	failedSource = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"initials",
			"icon",
			"library",
			"label",
			"shape",
			"size"
		];
	}
	get src() {
		return this.getAttribute("src")?.trim() || "";
	}
	set src(e) {
		this.setStringAttribute("src", e);
	}
	get initials() {
		return this.getAttribute("initials")?.trim() || "";
	}
	set initials(e) {
		this.setStringAttribute("initials", e);
	}
	get icon() {
		return this.getAttribute("icon")?.trim() || "user";
	}
	set icon(e) {
		this.setStringAttribute("icon", e);
	}
	get library() {
		return this.getAttribute("library")?.trim() || "tp";
	}
	set library(e) {
		this.setStringAttribute("library", e);
	}
	get label() {
		return this.getAttribute("label")?.trim() || "";
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get shape() {
		return this.getAttribute("shape") === "square" ? "square" : "circle";
	}
	set shape(e) {
		this.setStringAttribute("shape", e);
	}
	get size() {
		let e = this.getAttribute("size");
		return e !== null && t(e) ? e : "m";
	}
	set size(e) {
		this.setStringAttribute("size", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-avatar-styles", n), this.render();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (e === "src" && (this.failedSource = null), this.isConnected && this.render());
	}
	render() {
		this.dataset.shape = this.shape, this.dataset.size = this.size;
		let e = document.createElement("span");
		e.className = "tp-avatar-visual", this.label ? (e.setAttribute("role", "img"), e.setAttribute("aria-label", this.label)) : e.setAttribute("aria-hidden", "true");
		let t = this.src;
		if (t && t !== this.failedSource) {
			let n = document.createElement("img");
			n.alt = "", n.src = t, n.addEventListener("error", () => {
				n.parentElement !== e || e.parentElement !== this || (this.failedSource = t, this.render());
			}, { once: !0 }), e.append(n);
		} else if (this.initials) {
			let t = document.createElement("span");
			t.textContent = this.initials, e.append(t);
		} else {
			let t = document.createElement("tp-icon");
			t.setAttribute("name", this.icon), t.setAttribute("library", this.library), t.setAttribute("size", "2em"), t.setAttribute("aria-hidden", "true"), e.append(t);
		}
		this.replaceChildren(e);
	}
};
customElements.get("tp-avatar") || customElements.define("tp-avatar", r);
//#endregion
export { r as t };

//# sourceMappingURL=avatar.js.map