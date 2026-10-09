import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/toc/toc.css?inline
var t = "tp-toc{max-inline-size:100%;margin-block:0 1rem;display:flow-root}tp-toc[data-position=start]{float:inline-start;inline-size:min(18rem,35%);margin-inline-end:1rem}tp-toc[data-position=end]{float:inline-end;inline-size:min(18rem,35%);margin-inline-start:1rem}tp-toc[data-position=center]{inline-size:100%}tp-toc>[data-tp-toc-panel]{background:var(--tp-toc-background,color-mix(in srgb, Canvas 94%, CanvasText 6%));border:1px solid var(--tp-toc-border-color,color-mix(in srgb, CanvasText 12%, transparent));border-radius:var(--tp-border-radius-md,.375rem);color:var(--tp-toc-color,inherit);padding:.75rem}tp-toc[brand]{--tp-toc-background:var(--tp-brand-fill-softer);--tp-toc-border-color:var(--tp-brand-stroke-soft);--tp-toc-color:var(--tp-brand-text-on-soft)}tp-toc[data-position=start]>[data-tp-toc-panel],tp-toc[data-position=end]>[data-tp-toc-panel]{z-index:20;position:sticky;inset-block-start:1rem}tp-toc [data-tp-toc-label]{cursor:pointer;font-size:1rem;font-weight:var(--tp-font-weight-bold,700);margin-block:0;line-height:1.2}tp-toc [data-tp-toc-panel][open]>nav{margin-block-start:.5rem}tp-toc tp-tree{font-size:.9375rem}tp-toc a{color:inherit;align-items:center;min-block-size:1.5rem;text-decoration:none;display:inline-flex}tp-toc a:hover{text-decoration:underline}", n = "h1, h2, h3, h4, h5, h6";
function r(e) {
	return e === "start" || e === "end" || e === "center";
}
function i(e) {
	return typeof e.expandAll == "function";
}
var a = class a extends e {
	static styleId = "tp-toc-styles";
	observer = null;
	observedScope = null;
	renderQueued = !1;
	static get observedAttributes() {
		return [
			"brand",
			"expand-all",
			"label",
			"open",
			"position"
		];
	}
	get brand() {
		return this.hasAttribute("brand");
	}
	set brand(e) {
		this.toggleAttribute("brand", e);
	}
	get label() {
		return this.getAttribute("label") ?? "Contents";
	}
	set label(e) {
		if (e.trim() === "") {
			this.removeAttribute("label");
			return;
		}
		this.setAttribute("label", e);
	}
	get position() {
		let e = this.getAttribute("position") ?? "center";
		return r(e) ? e : "center";
	}
	set position(e) {
		if (!r(e)) {
			this.setAttribute("position", "center");
			return;
		}
		this.setAttribute("position", e);
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(e) {
		this.toggleAttribute("open", e);
	}
	get expandAll() {
		return this.hasAttribute("expand-all");
	}
	set expandAll(e) {
		this.toggleAttribute("expand-all", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(a.styleId, t), this.syncPositionAttribute(), this.render(), this.observeScope(), this.addEventListener("click", this.handleClick);
	}
	disconnectedCallback() {
		this.observer?.disconnect(), this.observer = null, this.observedScope = null, this.removeEventListener("click", this.handleClick);
	}
	attributeChangedCallback() {
		this.isConnected && (this.syncPositionAttribute(), this.render());
	}
	syncPositionAttribute() {
		let e = this.position;
		this.getAttribute("position") !== e && this.setAttribute("position", e), this.setAttribute("data-position", e);
	}
	observeScope() {
		let e = this.getTocScope();
		e !== this.observedScope && (this.observer?.disconnect(), this.observedScope = e, this.observer = new MutationObserver((t) => {
			t.some((t) => !this.contains(t.target) && s(t.target, e)) && this.scheduleRender();
		}), this.observer.observe(e, {
			attributes: !0,
			attributeFilter: ["id"],
			characterData: !0,
			childList: !0,
			subtree: !0
		}));
	}
	scheduleRender() {
		this.renderQueued || (this.renderQueued = !0, queueMicrotask(() => {
			this.renderQueued = !1, this.isConnected && this.render();
		}));
	}
	render() {
		this.observer?.disconnect(), this.observer = null, this.observedScope = null;
		let e = this.collectHeadings(), t = document.createElement("details");
		t.setAttribute("data-tp-toc-panel", ""), t.open = this.open;
		let n = document.createElement("summary");
		n.setAttribute("data-tp-toc-label", ""), n.textContent = this.label, t.append(n);
		let r = document.createElement("nav");
		r.setAttribute("aria-label", this.label);
		let a = document.createElement("tp-tree");
		a.setAttribute("guides", ""), a.append(this.renderTreeList(l(e))), r.append(a), t.append(r), this.replaceChildren(t), this.expandAll && i(a) && a.expandAll(), this.observeScope();
	}
	collectHeadings() {
		let e = this.getTocScope(), t = /* @__PURE__ */ new Set(), r = [];
		for (let i of e.querySelectorAll(n)) {
			if (!(i instanceof HTMLHeadingElement) || this.contains(i) || !o(i, e)) continue;
			let n = document.createTreeWalker(i, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.parentElement?.closest("tp-icon, script, style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }), a = "";
			for (; n.nextNode();) a += n.currentNode.textContent ?? "";
			let s = a.replace(/\s+/g, " ").trim();
			if (s === "") continue;
			let c = Number(i.tagName.slice(1)), l = this.ensureHeadingId(i, s, t);
			r.push({
				level: c,
				id: l,
				title: s
			});
		}
		return r;
	}
	ensureHeadingId(e, t, n) {
		let r = e.id.trim();
		if (r !== "") return n.add(r), r;
		let i = f(t) || "section", a = i, o = 2;
		for (; document.getElementById(a) !== null || n.has(a);) a = `${i}-${String(o)}`, o += 1;
		return e.id = a, n.add(a), a;
	}
	renderTreeList(e) {
		let t = document.createElement("ul");
		for (let n of e) {
			let e = document.createElement("li");
			e.setAttribute("data-node-id", n.id), e.setAttribute("data-kind", `h${String(n.level)}`), e.setAttribute("data-label", n.title);
			let r = document.createElement("a");
			r.href = this.createHeadingHref(n.id), r.textContent = n.title, e.append(r), n.children.length > 0 && (e.setAttribute("data-expanded", ""), e.append(this.renderTreeList(n.children))), t.append(e);
		}
		return t;
	}
	createHeadingHref(e) {
		return `${u()}#${encodeURIComponent(e)}`;
	}
	getTocScope() {
		return this.closest("[data-tp-toc-scope], .tp-html-viewer-output, .tp-asciidoc-output, .tp-md-mdviewer-output, .tp-markdown-output, .tp-restructuredtext-output, article, main") ?? this.parentElement ?? document.body;
	}
	handleClick = (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("a[href]");
		if (n === null || !this.contains(n)) return;
		let r = d(n.getAttribute("href") ?? "");
		if (r === null) return;
		let i = u();
		if (r.route !== "" && r.route !== i) return;
		let a = document.getElementById(r.id);
		a !== null && (e.preventDefault(), window.location.hash = r.route === "" ? `#${r.id}` : `${r.route}#${r.id}`, a.scrollIntoView?.({ block: "start" }));
	};
};
function o(e, t) {
	return c(e, t);
}
function s(e, t) {
	let n = e instanceof Element ? e : e.parentElement;
	return n !== null && c(n, t);
}
function c(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		if (n.localName.includes("-") || n.matches("[data-tp-toc-scope], article, main")) return !1;
		n = n.parentElement;
	}
	return n === t;
}
function l(e) {
	let t = [], n = [{
		level: 0,
		children: t
	}];
	for (let r of e) {
		let e = {
			...r,
			children: []
		};
		for (; n.length > 1 && r.level <= (n.at(-1)?.level ?? 0);) n.pop();
		(n.at(-1)?.children ?? t).push(e), n.push(e);
	}
	return t;
}
function u() {
	let e = window.location.hash;
	if (!e.startsWith("#/")) return "";
	let t = e.indexOf("#", 2);
	return t === -1 ? e : e.slice(0, t);
}
function d(e) {
	if (!e.startsWith("#")) return null;
	let t = e.indexOf("#", e.startsWith("#/") ? 2 : 1), n = t === -1 ? e.slice(1) : e.slice(t + 1);
	return n === "" ? null : {
		route: t === -1 ? "" : e.slice(0, t),
		id: decodeURIComponent(n)
	};
}
function f(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
customElements.get("tp-toc") || customElements.define("tp-toc", a);
//#endregion
export { a as t };

