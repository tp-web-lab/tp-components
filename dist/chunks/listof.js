import { qu as e } from "./lib/typescript/typescript.js";
import "./biblio.js";
import "./glossary.js";
import "./note.js";
import { noteNumbers as t, observeReferences as n, referenceContent as r, referenceElements as i, referenceId as a, referenceLabel as o, referenceScope as s } from "../utilities/references.js";
//#region src/components/listof/listof.css?inline
var c = "tp-listof{display:block}tp-listof .tp-listof-biblio{grid-template-columns:fit-content(40%) minmax(0,1fr);align-items:baseline;gap:.5rem .75em;display:grid}tp-listof .tp-listof-biblio>:is(dt,dd){overflow-wrap:anywhere;min-inline-size:0;margin:0}tp-listof .tp-listof-biblio>dt{grid-column:1}tp-listof .tp-listof-biblio>dd{grid-column:2}tp-listof .tp-listof-biblio>dd>:last-child{margin-block-end:0}tp-listof .tp-listof-notes>li>:first-child,tp-listof dl>dd>:first-child{margin-block-start:0}", l = class extends e {
	unsubscribe = null;
	output = null;
	signature = "";
	static get observedAttributes() {
		return ["selector"];
	}
	get selector() {
		return this.getAttribute("selector") ?? "";
	}
	set selector(e) {
		this.setAttribute("selector", e);
	}
	connectedCallback() {
		this.isConnected && (super.connectedCallback(), this.ensureGlobalStyle("tp-listof-styles", c), !this.closest("[data-tp-reference-output], tp-tooltip") && (this.output || (this.output = document.createElement("div"), this.output.dataset.tpReferenceOutput = "", this.replaceChildren(this.output)), this.unsubscribe?.(), this.refresh(), this.unsubscribe = n(this, () => this.refresh())));
	}
	disconnectedCallback() {
		this.unsubscribe?.(), this.unsubscribe = null;
	}
	attributeChangedCallback() {
		this.isConnected && this.refresh();
	}
	refresh() {
		if (!this.output) return;
		let e = [], n = !1;
		try {
			this.selector.trim() && (e = i(s(this), this.selector));
		} catch {
			n = !0;
		}
		this.hasAttribute("data-invalid-selector") !== n && this.toggleAttribute("data-invalid-selector", n);
		let c = e.filter((e) => e !== this && !e.contains(this) && !e.matches("tp-listof, tp-ref")).map((e) => ({
			element: e,
			label: o(e)
		})).filter((e) => e.label).map((e) => ({
			...e,
			id: a(e.element),
			definition: e.element.matches("tp-note, tp-biblio, tp-glossary")
		})), l = t(s(this)), u = JSON.stringify(c.map((e) => [
			e.id,
			e.element.localName,
			e.element.getAttribute("ref"),
			l.get(e.element.getAttribute("ref") ?? ""),
			e.label,
			e.definition ? e.element.innerHTML : ""
		]));
		if (u === this.signature) return;
		this.signature = u;
		let d = [], f = c.filter((e) => e.element.localName === "tp-note");
		if (f.length) {
			f.sort((e, t) => (l.get(e.element.getAttribute("ref") ?? "") ?? Infinity) - (l.get(t.element.getAttribute("ref") ?? "") ?? Infinity));
			let e = document.createElement("ol");
			e.className = "tp-listof-notes";
			for (let t of f) {
				let n = document.createElement("li"), i = l.get(t.element.getAttribute("ref") ?? "");
				i !== void 0 && (n.value = i), n.append(r(t.element)), e.append(n);
			}
			d.push(e);
		}
		let p = new Intl.Collator(this.closest("[lang]")?.getAttribute("lang") || void 0, {
			sensitivity: "base",
			numeric: !0
		});
		for (let e of ["biblio", "glossary"]) {
			let t = c.filter((t) => t.element.localName === `tp-${e}`), n = (e) => e.element.getAttribute("ref") || e.label;
			if (t.sort((e, t) => p.compare(n(e), n(t))), !t.length) continue;
			let i = document.createElement("dl");
			i.className = `tp-listof-${e}`;
			for (let e of t) {
				let t = document.createElement("dt");
				t.textContent = n(e);
				let a = document.createElement("dd");
				a.append(r(e.element)), i.append(t, a);
			}
			d.push(i);
		}
		let m = c.filter((e) => !e.definition);
		if (m.length) {
			let e = document.createElement("ul");
			for (let t of m) {
				let n = document.createElement("li"), r = document.createElement("a"), i = this.ownerDocument.defaultView?.location.hash ?? "";
				r.href = `${i.startsWith("#/") ? i.split("#").slice(0, 2).join("#") : ""}#${encodeURIComponent(t.id)}`, r.addEventListener("click", (e) => {
					if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
					e.preventDefault();
					let n = this.ownerDocument.defaultView;
					n && (n.location.hash = r.getAttribute("href") ?? ""), t.element.scrollIntoView?.({ block: "start" });
				}), r.textContent = t.label, n.append(r), e.append(n);
			}
			d.push(e);
		}
		this.output.replaceChildren(...d), this.output.hidden = d.length === 0;
	}
};
customElements.get("tp-listof") || customElements.define("tp-listof", l);
//#endregion
export { l as t };

//# sourceMappingURL=listof.js.map