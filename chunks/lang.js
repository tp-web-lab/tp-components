import { Ku as e, _r as t, vr as n } from "./lib/typescript/typescript.js";
//#region src/components/lang/lang.css?inline
var r = "tp-lang{vertical-align:middle;display:inline-flex}tp-lang>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-lang>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-lang>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-lang>tp-dropdown{overscroll-behavior:contain;max-block-size:calc(100vh - 1rem);inline-size:max-content;min-inline-size:9rem;overflow-y:auto}tp-lang>tp-dropdown>ul{inline-size:100%;margin:0;padding:.25rem;list-style:none}tp-lang .tp-lang-option{border-radius:var(--tp-border-radius-sm,.25rem);cursor:pointer;align-items:center;gap:.5rem;padding:.3rem .5rem;display:flex}tp-lang .tp-lang-option:hover{background:var(--tp-neutral-fill-softer,#f3f4f6)}tp-lang .tp-lang-option[data-selected]{background:var(--tp-neutral-fill-soft,#e5e7eb)}tp-lang .tp-lang-option>tp-icon[name=check]{visibility:hidden}tp-lang .tp-lang-option[data-selected]>tp-icon[name=check]{visibility:visible}tp-lang .tp-lang-option-icon{--tp-icon-size:1.15em}tp-lang .tp-lang-separator{margin:0;padding:0;list-style:none}", i = "tp-lang-styles";
function a(e) {
	return e.trim().toLowerCase();
}
function o(e) {
	let t = e.trim();
	if (t === "") return "";
	let n = t.replace(/\/+$/, "");
	return n === "" ? "/" : n;
}
function s() {
	return `tp-lang-${Math.random().toString(36).slice(2)}`;
}
function c(e, t) {
	let n = t.replace(/^\/+|\/+$/g, "");
	return e === "" || e === "/" ? `/${n}` : `${e.replace(/\/+$/, "")}/${n}`;
}
var l = class l extends e {
	static dropdownPlacement = "bottom";
	static changeEventName = "tp-lang-change";
	static nextControlId = 0;
	anchorId = s();
	controlEl = null;
	dropdownEl = null;
	static get observedAttributes() {
		return [
			"langs",
			"repository",
			"variant",
			"size",
			"disabled"
		];
	}
	get langs() {
		return this.getAttribute("langs") ?? "en";
	}
	set langs(e) {
		this.setAttribute("langs", e);
	}
	get repository() {
		return this.getAttribute("repository") ?? "";
	}
	set repository(e) {
		if (e.trim() === "") {
			this.removeAttribute("repository");
			return;
		}
		this.setAttribute("repository", e);
	}
	get variant() {
		let e = this.getAttribute("variant") ?? "neutral";
		return n(e) ? e : "neutral";
	}
	set variant(e) {
		this.setAttribute("variant", e);
	}
	get size() {
		let e = this.getAttribute("size") ?? "m";
		return t(e) ? e : "m";
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
		super.connectedCallback(), this.ensureGlobalStyle(i, r), this.ensureControl(), this.updateControl(), window.addEventListener("hashchange", this.handleLocationChange);
	}
	disconnectedCallback() {
		window.removeEventListener("hashchange", this.handleLocationChange);
	}
	attributeChangedCallback() {
		this.isConnected && (this.ensureControl(), this.updateControl());
	}
	ensureControl() {
		let e = this.querySelector(":scope > tp-icon-button");
		e instanceof HTMLElement || (e = document.createElement("tp-icon-button"), this.prepend(e)), e.setAttribute("library", "flags"), e.setAttribute("variant", this.variant), e.setAttribute("size", this.size), e.toggleAttribute("disabled", this.disabled), e.removeEventListener("click", this.handleControlClick), e.addEventListener("click", this.handleControlClick), this.controlEl = e, this.anchorId = this.ensureControlId(e);
		let t = this.querySelector(":scope > tp-dropdown");
		t instanceof HTMLElement || (t = document.createElement("tp-dropdown"), this.append(t));
		let n = t;
		n.setAttribute("anchor", `#${this.anchorId}`), n.setAttribute("placement", l.dropdownPlacement), n.setAttribute("outside-click", ""), this.dropdownEl = n, this.renderOptions();
	}
	ensureControlId(e) {
		let t = e.id.trim();
		if (t !== "") return t;
		l.nextControlId += 1;
		let n = `tp-lang-control-${String(l.nextControlId)}`;
		return e.id = n, n;
	}
	renderOptions() {
		if (!(this.dropdownEl instanceof HTMLElement)) return;
		let e = ["auto", ...this.readLangs()], t = Array.from(this.dropdownEl.querySelectorAll(".tp-lang-option")).map((e) => e.dataset.lang ?? "");
		if (t.length === e.length && t.every((t, n) => t === e[n]) && this.dropdownEl.querySelector("tp-divider") !== null) return;
		let n = document.createElement("ul");
		n.setAttribute("role", "menu");
		for (let t of e) {
			let e = document.createElement("li");
			e.className = "tp-lang-option", e.dataset.lang = t, e.setAttribute("role", "menuitem"), e.tabIndex = 0;
			let r = document.createElement("tp-icon");
			r.setAttribute("name", "check");
			let i = document.createElement("tp-icon");
			i.className = "tp-lang-option-icon", i.setAttribute("library", "flags");
			let a = document.createElement("span");
			if (a.textContent = t, e.append(r, i, a), e.addEventListener("click", this.handleLangItemClick), e.addEventListener("keydown", this.handleLangItemKeyDown), n.append(e), t === "auto") {
				let e = document.createElement("li");
				e.className = "tp-lang-separator", e.setAttribute("role", "none"), e.setAttribute("aria-hidden", "true");
				let t = document.createElement("tp-divider");
				e.append(t), n.append(e);
			}
		}
		this.dropdownEl.replaceChildren(n);
	}
	updateControl() {
		this.ensureControl();
		let e = this.readLangs(), t = this.resolveCurrentLang(e), n = this.resolveAutoLang(e), r = t === n ? "auto" : t, i = `Language: ${t.toUpperCase()}`;
		if (this.controlEl instanceof HTMLElement && (this.controlEl.setAttribute("name", t), this.controlEl.setAttribute("library", "flags"), this.controlEl.setAttribute("label", i), this.controlEl.setAttribute("title", i), this.controlEl.setAttribute("aria-haspopup", "menu"), this.controlEl.setAttribute("aria-expanded", String(this.dropdownEl?.open === !0))), this.dropdownEl instanceof HTMLElement) for (let e of this.dropdownEl.querySelectorAll(".tp-lang-option")) {
			let t = e.dataset.lang ?? "", i = t === "auto" ? n : t;
			e.querySelector("tp-icon.tp-lang-option-icon")?.setAttribute("name", i), t === r ? (e.setAttribute("data-selected", ""), e.setAttribute("aria-current", "true")) : (e.removeAttribute("data-selected"), e.removeAttribute("aria-current"));
		}
	}
	readLangs() {
		let e = this.langs.split(",").map(a).filter((e) => e !== "");
		return [...new Set(e.length === 0 ? ["en"] : e)];
	}
	resolveCurrentLang(e) {
		let t = this.resolveMarkdownDoc(), n = t === null ? "" : this.readHostRepository(t);
		if (n !== "") {
			let t = o(n);
			for (let n of e) if (this.repositoryForLang(n) === t) return n;
		}
		return this.readLangFromPath(e) ?? e[0] ?? "en";
	}
	readLangFromPath(e) {
		let t = this.resolveRepositoryPathSegments().at(-1);
		return t !== void 0 && e.includes(t) ? t : null;
	}
	resolveAutoLang(e) {
		let t = a(navigator.language.split("-", 1)[0] ?? "");
		return e.includes(t) ? t : e[0] ?? "en";
	}
	repositoryForLang(e) {
		let t = this.resolveRepositoryBase();
		return e === (this.readLangs()[0] ?? "en") ? t : c(t, e);
	}
	resolveRepositoryBase() {
		let e = o(this.repository);
		if (e !== "") return e;
		let t = this.readLangs(), n = t[0] ?? "en", r = this.resolveMarkdownDoc(), i = r === null ? "" : this.readHostRepository(r);
		if (i !== "") return this.stripLangSegment(o(i), t, n);
		let a = this.resolveRepositoryPathSegments(), s = a.at(-1);
		return s !== void 0 && s !== n && t.includes(s) && a.pop(), a.length === 0 ? "/" : `/${a.join("/")}`;
	}
	resolveRepositoryPathSegments() {
		let e = window.location.pathname, t = e.lastIndexOf("/");
		return (t === -1 ? "" : e.slice(0, t)).split("/").filter((e) => e !== "");
	}
	stripLangSegment(e, t, n) {
		let r = e.split("/").filter((e) => e !== ""), i = r.at(-1);
		return i !== void 0 && i !== n && t.includes(i) && r.pop(), r.length === 0 ? "/" : `/${r.join("/")}`;
	}
	readHostRepository(e) {
		let t = typeof e.repository == "string" ? e.repository.trim() : "";
		return t === "" ? e.getAttribute("repository")?.trim() ?? "" : t;
	}
	selectLang(e) {
		let t = this.readLangs(), n = e === "auto" ? this.resolveAutoLang(t) : e, r = this.repositoryForLang(n), i = this.resolveMarkdownDoc();
		i !== null && i.setAttribute("repository", r), this.updateUrlForRepository(r), this.updateControl(), this.emitChange(e, n, r, i);
	}
	emitChange(e, t, n, r) {
		this.dispatchEvent(new CustomEvent(l.changeEventName, {
			bubbles: !0,
			composed: !0,
			detail: {
				choice: e,
				lang: t,
				repository: n,
				anchor: null,
				target: r
			}
		}));
	}
	updateUrlForRepository(e) {
		let t = new URL(window.location.href);
		if (t.hash.startsWith("#/")) {
			window.dispatchEvent(new Event("hashchange"));
			return;
		}
		t.pathname = `${e.replace(/\/+$/, "")}/index.html`, window.history.pushState(null, "", t);
	}
	resolveMarkdownDoc() {
		let e = this.closest("tp-markdown-multi-pages, tp-asciidoc-multi-pages, tp-restructuredtext-multi-pages, tp-html-multi-pages, tp-markup-multi-pages");
		if (e instanceof HTMLElement) return e;
		let t = this.ownerDocument.querySelector("tp-markdown-multi-pages, tp-asciidoc-multi-pages, tp-restructuredtext-multi-pages, tp-html-multi-pages, tp-markup-multi-pages");
		return t instanceof HTMLElement ? t : null;
	}
	handleControlClick = () => {
		this.disabled || this.dropdownEl instanceof HTMLElement && (this.dropdownEl.open = !this.dropdownEl.open, this.controlEl?.setAttribute("aria-expanded", String(this.dropdownEl.open)));
	};
	handleLangItemClick = (e) => {
		if (this.disabled) return;
		let t = e.currentTarget;
		if (!(t instanceof HTMLElement)) return;
		let n = t.dataset.lang;
		n === void 0 || n === "" || (this.dropdownEl instanceof HTMLElement && (this.dropdownEl.open = !1), this.selectLang(n));
	};
	handleLangItemKeyDown = (e) => {
		e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.handleLangItemClick(e));
	};
	handleLocationChange = () => {
		this.updateControl();
	};
};
customElements.get("tp-lang") || customElements.define("tp-lang", l);
//#endregion
export { l as t };

