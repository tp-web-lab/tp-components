import { Ku as e, Mr as t, Pr as n } from "./lib/typescript/typescript.js";
import { TpDeclarativeTextSource as r } from "../utilities/declarative-text-source.js";
//#region src/components/skeleton/skeleton.css?inline
var i = "tp-skeleton{min-inline-size:0;display:flow-root}tp-skeleton .tp-skeleton-output{max-inline-size:100%}tp-skeleton .tp-skeleton-block.tp-skeleton-message>.tp-skeleton-bar{block-size:auto;min-block-size:2rem;color:var(--tp-neutral-text-on-soft);overflow-wrap:anywhere;align-items:center;padding:.35rem .75rem;font-size:.875rem;line-height:1.4;display:flex}tp-skeleton .tp-skeleton-block,tp-skeleton .tp-skeleton-main,tp-skeleton .tp-skeleton-frame{margin-block:0 1rem}tp-skeleton [data-kind=table]{border:1px solid var(--tp-neutral-stroke-soft);grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;padding:.75rem;display:grid}tp-skeleton [data-kind=table]>.tp-skeleton-bar{inline-size:100%;margin:0}tp-skeleton [data-kind=table]>.tp-skeleton-bar:nth-child(-n+3){block-size:1rem}tp-skeleton .tp-skeleton-bar{background:var(--tp-neutral-fill-soft);border-radius:.2rem;block-size:.75rem;display:block}tp-skeleton :where([data-kind=p],[data-kind=ul],[data-kind=ol],[data-kind=dl],[data-kind=blockquote],[data-kind=figure])>.tp-skeleton-bar+.tp-skeleton-bar{margin-block-start:.5rem}tp-skeleton :where([data-kind=p],[data-kind=ul],[data-kind=ol],[data-kind=blockquote])>.tp-skeleton-bar:last-child{inline-size:65%}tp-skeleton [data-kind=h1]>.tp-skeleton-bar{block-size:2rem;inline-size:70%}tp-skeleton [data-kind=h2]>.tp-skeleton-bar{block-size:1.6rem;inline-size:65%}tp-skeleton [data-kind=h3]>.tp-skeleton-bar{block-size:1.3rem;inline-size:60%}tp-skeleton [data-kind=h4]>.tp-skeleton-bar{block-size:1.1rem;inline-size:55%}tp-skeleton [data-kind=h5]>.tp-skeleton-bar{block-size:.95rem;inline-size:50%}tp-skeleton [data-kind=h6]>.tp-skeleton-bar{block-size:.85rem;inline-size:45%}tp-skeleton [data-kind=ul],tp-skeleton [data-kind=ol]{padding-inline-start:1.5rem}tp-skeleton [data-kind=ul]>.tp-skeleton-bar,tp-skeleton [data-kind=ol]>.tp-skeleton-bar{position:relative}tp-skeleton [data-kind=ul]>.tp-skeleton-bar:before,tp-skeleton [data-kind=ol]>.tp-skeleton-bar:before{content:\"\";background:var(--tp-neutral-fill-soft);border-radius:50%;block-size:.75rem;inline-size:.75rem;position:absolute;inset-inline-start:-1.5rem}tp-skeleton [data-kind=ol]>.tp-skeleton-bar:before{border-radius:.15rem}tp-skeleton [data-kind=dl]>.tp-skeleton-bar:nth-child(odd){block-size:.9rem;inline-size:30%}tp-skeleton [data-kind=dl]>.tp-skeleton-bar:nth-child(2n){inline-size:65%;margin-inline-start:1.5rem}tp-skeleton [data-kind=blockquote]{border-inline-start:.25rem solid var(--tp-neutral-stroke-soft);padding-inline-start:1rem}tp-skeleton [data-kind=figure]>.tp-skeleton-bar:first-child{block-size:7rem}tp-skeleton [data-kind=figure]>.tp-skeleton-bar:last-child{inline-size:40%;margin-inline:auto}tp-skeleton [data-kind=nav]{gap:1rem;display:flex}tp-skeleton [data-kind=nav]>.tp-skeleton-bar{inline-size:20%;margin:0}tp-skeleton .tp-skeleton-frame{border:1px solid var(--tp-neutral-stroke-soft);border-radius:.25rem;padding:1rem}tp-skeleton .tp-skeleton-main>:last-child,tp-skeleton .tp-skeleton-frame>:last-child{margin-block-end:0}", a = /* @__PURE__ */ new Set([
	"p",
	"ul",
	"ol",
	"dl",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"blockquote",
	"figure",
	"nav",
	"table"
]), o = class extends e {
	source = new r(this, { scriptTypes: ["tp/html", "tp/skeleton"] });
	controller = null;
	generation = 0;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"value",
			"label"
		];
	}
	get src() {
		return this.getAttribute("src")?.trim() ?? "";
	}
	set src(e) {
		this.setStringAttribute("src", e);
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		this.setStringAttribute("value", e);
	}
	get label() {
		return this.getAttribute("label")?.trim() || "Content layout preview";
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-skeleton-styles", i), this.source.observe(() => {
			this.render();
		}), queueMicrotask(() => {
			this.isConnected && this.render();
		});
	}
	disconnectedCallback() {
		this.source.disconnect(), this.controller?.abort(), this.generation += 1;
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.isConnected && this.render();
	}
	parse(e) {
		let t = document.createElement("template");
		return t.innerHTML = e, t.content;
	}
	pattern(e) {
		let t = document.createElement("div");
		t.className = "tp-skeleton-block", t.dataset.kind = e;
		let n = e === "table" ? 12 : e === "dl" ? 4 : e === "figure" ? 2 : /^h[1-6]$/.test(e) ? 1 : 3;
		return Array.from({ length: n }).forEach(() => {
			let e = document.createElement("span");
			e.className = "tp-skeleton-bar", t.append(e);
		}), t;
	}
	async walk(e, t, n, r = 0, i = /* @__PURE__ */ new Set()) {
		let o = document.createDocumentFragment();
		for (let s of Array.from(e.children)) {
			if (n.aborted) break;
			let e = s.localName;
			if (a.has(e)) o.append(this.pattern(e));
			else if (e === "main" && r < 8) {
				let e = document.createElement("div");
				e.className = "tp-skeleton-main", e.dataset.kind = "main", e.append(await this.walk(s, t, n, r + 1, i)), o.append(e);
			} else if (e === "iframe") {
				let e = document.createElement("div");
				if (e.className = "tp-skeleton-frame", e.dataset.kind = "iframe", r < 8) {
					let a = await this.frameSource(s, t, n, i);
					a && e.append(await this.walk(this.parse(a.html), a.base, n, r + 1, a.visited));
				}
				e.childElementCount || e.append(this.pattern("figure")), o.append(e);
			}
		}
		return o;
	}
	async frameSource(e, t, n, r) {
		if (e.hasAttribute("srcdoc")) return {
			html: e.getAttribute("srcdoc") ?? "",
			base: t,
			visited: r
		};
		let i = e.getAttribute("src")?.trim();
		if (!i) return null;
		try {
			let e = new URL(i, t);
			if (e.hash = "", !["http:", "https:"].includes(e.protocol) || e.origin !== new URL(this.ownerDocument.baseURI).origin || r.has(e.href)) return null;
			let a = await fetch(e.href, {
				signal: n,
				mode: "same-origin"
			});
			return a.ok ? {
				html: await a.text(),
				base: a.url || e.href,
				visited: /* @__PURE__ */ new Set([...r, e.href])
			} : null;
		} catch {
			return null;
		}
	}
	showMessage(e) {
		let t = this.pattern("h1");
		t.classList.add("tp-skeleton-message"), t.setAttribute("role", "status");
		let n = t.firstElementChild;
		n && (n.textContent = e), this.replaceChildren(t), this.setAttribute("data-rendered", "");
	}
	async render() {
		let e = ++this.generation;
		this.controller?.abort();
		let r = new AbortController();
		this.controller = r, this.removeAttribute("data-rendered");
		try {
			let i = await this.source.read({ signal: r.signal });
			if (e !== this.generation || !this.isConnected) return;
			if (i.trim() === "") {
				this.showMessage("No HTML source provided.");
				return;
			}
			let a = this.src ? n(this, this.src).href : t(this), o = document.createElement("div");
			o.className = "tp-skeleton-output", o.setAttribute("role", "img"), o.setAttribute("aria-label", this.label);
			let s = document.createElement("div");
			if (s.setAttribute("aria-hidden", "true"), s.append(await this.walk(this.parse(i), a, r.signal, 0, /* @__PURE__ */ new Set([a]))), o.append(s), e !== this.generation || !this.isConnected) return;
			if (!s.querySelector(".tp-skeleton-bar")) {
				this.showMessage("No supported HTML content found.");
				return;
			}
			this.replaceChildren(o), this.setAttribute("data-rendered", "");
		} catch (t) {
			if (e !== this.generation || !this.isConnected) return;
			let n = t instanceof Error ? t.message : String(t);
			this.showMessage(`Unable to load HTML. ${n}`);
		}
	}
};
customElements.get("tp-skeleton") || customElements.define("tp-skeleton", o);
//#endregion
export { o as t };

//# sourceMappingURL=skeleton.js.map