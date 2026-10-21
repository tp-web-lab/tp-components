import { t as e } from "./base.js";
import { t } from "./button.js";
import { t as n } from "./tooltip.js";
import "./biblio.js";
import "./glossary.js";
import "./note.js";
import { noteNumbers as r, observeReferences as i, referenceContent as a, referenceElements as o, referenceId as s, referenceScope as c } from "../utilities/references.js";
//#region src/components/ref/ref.css?inline
var l = "tp-ref{display:inline}tp-ref>tp-button>button{color:var(--tp-brand-text-colorful);cursor:pointer;text-decoration:none}tp-ref>tp-button>button:disabled{color:inherit;cursor:help;-webkit-text-decoration:underline wavy;text-decoration:underline wavy}tp-tooltip.tp-ref-tooltip{max-inline-size:min(32rem,100vw - 1rem)}tp-tooltip.tp-ref-tooltip>:first-child{margin-block-start:0}tp-tooltip.tp-ref-tooltip>:last-child{margin-block-end:0}tp-ref>tp-button>button{font:inherit;background:0 0;border:0;padding:0;display:inline}tp-ref[href^=\\%]>tp-button>button{text-underline-offset:.15em;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}tp-ref>tp-button>button sup{vertical-align:super;font-size:.75em;line-height:0}tp-ref>tp-button{vertical-align:baseline;line-height:inherit;display:inline}tp-ref>tp-button>button{vertical-align:baseline;border-radius:0;min-block-size:0;min-inline-size:0}tp-ref>tp-button>button>[data-tp-button-content]{display:inline}tp-ref>tp-button:not([disabled]):not([loading])>button:hover,tp-ref>tp-button:not([disabled]):not([loading])>button:active{transform:none}", u = class extends e {
	link = null;
	label = null;
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
		this.isConnected && (super.connectedCallback(), this.ensureGlobalStyle("tp-ref-styles", l), !this.closest("tp-tooltip, tp-note, tp-biblio, tp-glossary") && (this.original ||= Array.from(this.childNodes), this.link || (this.link = new t(), this.label = document.createElement("span"), this.link.append(this.label), this.link.type = "button", this.link.addEventListener("click", () => {
			this.link?.disabled || this.tooltip?.show();
		}), this.link.dataset.tpReferenceOutput = "", s(this.link), this.append(this.link), this.tooltip = new n(), this.tooltip.dataset.tpReferenceOutput = "", this.tooltip.classList.add("tp-ref-tooltip"), this.append(this.tooltip)), queueMicrotask(() => {
			this.isConnected && this.link && this.tooltip?.setAttribute("anchor", `#${this.link.id} > button`);
		}), this.unsubscribe?.(), this.refresh(), this.unsubscribe = i(this, () => this.refresh())));
	}
	disconnectedCallback() {
		this.unsubscribe?.(), this.unsubscribe = null;
	}
	attributeChangedCallback() {
		this.isConnected && this.refresh();
	}
	refresh() {
		if (!this.link || !this.label || !this.tooltip) return;
		let e = {
			"^": "tp-note",
			"@": "tp-biblio",
			"%": "tp-glossary"
		}[this.href[0] ?? ""], t = this.href.slice(1), n = e && t ? o(c(this), e).find((e) => e.getAttribute("ref") === t) : void 0;
		for (let e of this.original ?? []) (e.parentNode === this || e.parentNode === this.link) && e.parentNode.removeChild(e);
		let i = this.href.startsWith("^"), s = i ? `[${r(c(this)).get(t) ?? "?"}]` : this.href.startsWith("@") ? `[${t}]` : t || "?";
		if (this.label.textContent !== s || !!this.label.querySelector("sup") !== i) if (i) {
			let e = document.createElement("sup");
			e.textContent = s, this.label.replaceChildren(e);
		} else this.label.textContent = s;
		this.link.disabled = !n, n || this.tooltip.hide();
		let l = n?.innerHTML ?? "";
		l !== this.content && (this.content = l, this.tooltip.replaceChildren(...n ? [a(n)] : []));
	}
};
customElements.get("tp-ref") || customElements.define("tp-ref", u);
//#endregion
export { u as t };

//# sourceMappingURL=ref.js.map