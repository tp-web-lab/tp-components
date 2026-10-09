import { Ku as e, Qn as t } from "./lib/typescript/typescript.js";
import "./biblio.js";
import "./glossary.js";
import "./note.js";
import { noteNumbers as n, observeReferences as r, referenceContent as i, referenceElements as a, referenceId as o, referenceScope as s } from "../utilities/references.js";
//#region src/components/ref/ref.css?inline
var c = "tp-ref{display:inline}tp-ref>button{color:var(--tp-brand-text-colorful);cursor:pointer;text-decoration:none}tp-ref>button:disabled{color:inherit;cursor:help;-webkit-text-decoration:underline wavy;text-decoration:underline wavy}tp-tooltip.tp-ref-tooltip{max-inline-size:min(32rem,100vw - 1rem)}tp-tooltip.tp-ref-tooltip>:first-child{margin-block-start:0}tp-tooltip.tp-ref-tooltip>:last-child{margin-block-end:0}tp-ref>button{font:inherit;background:0 0;border:0;padding:0;display:inline}tp-ref[href^=\\%]>button{text-underline-offset:.15em;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}tp-ref>button>sup{vertical-align:super;font-size:.75em;line-height:0}", l = class extends e {
	link = null;
	tooltip = null;
	unsubscribe = null;
	original = null;
	content = "";
	static get observedAttributes() {
		return ["href"];
	}
	get href() {
		return this.getAttribute("href") ?? "";
	}
	set href(e) {
		this.setAttribute("href", e);
	}
	connectedCallback() {
		this.isConnected && (super.connectedCallback(), this.ensureGlobalStyle("tp-ref-styles", c), !this.closest("tp-tooltip, tp-note, tp-biblio, tp-glossary") && (this.original ||= Array.from(this.childNodes), this.link || (this.link = document.createElement("button"), this.link.type = "button", this.link.addEventListener("click", () => this.tooltip?.show()), this.link.dataset.tpReferenceOutput = "", o(this.link), this.append(this.link), this.tooltip = new t(), this.tooltip.dataset.tpReferenceOutput = "", this.tooltip.classList.add("tp-ref-tooltip"), this.tooltip.setAttribute("anchor", `#${this.link.id}`), this.append(this.tooltip)), this.unsubscribe?.(), this.refresh(), this.unsubscribe = r(this, () => this.refresh())));
	}
	disconnectedCallback() {
		this.unsubscribe?.(), this.unsubscribe = null;
	}
	attributeChangedCallback() {
		this.isConnected && this.refresh();
	}
	refresh() {
		if (!this.link || !this.tooltip) return;
		let e = {
			"^": "tp-note",
			"@": "tp-biblio",
			"%": "tp-glossary"
		}[this.href[0] ?? ""], t = this.href.slice(1), r = e && t ? a(s(this), e).find((e) => e.getAttribute("ref") === t) : void 0;
		for (let e of this.original ?? []) (e.parentNode === this || e.parentNode === this.link) && e.parentNode.removeChild(e);
		let o = this.href.startsWith("^"), c = o ? `[${n(s(this)).get(t) ?? "?"}]` : this.href.startsWith("@") ? `[${t}]` : t || "?";
		if (this.link.textContent !== c || !!this.link.querySelector("sup") !== o) if (o) {
			let e = document.createElement("sup");
			e.textContent = c, this.link.replaceChildren(e);
		} else this.link.textContent = c;
		this.link.disabled = !r, r || this.tooltip.hide();
		let l = r?.innerHTML ?? "";
		l !== this.content && (this.content = l, this.tooltip.replaceChildren(...r ? [i(r)] : []));
	}
};
customElements.get("tp-ref") || customElements.define("tp-ref", l);
//#endregion
export { l as t };

