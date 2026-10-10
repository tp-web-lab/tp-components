import { qu as e } from "../../chunks/lib/typescript/typescript.js";
import { t } from "../../chunks/content-table.js";
import { createContentTable as n } from "../../utilities/content-table.js";
import { TpDeclarativeTextSource as r } from "../../utilities/declarative-text-source.js";
import { parseCsv as i } from "./csv.js";
//#region src/components/csv-table/csv-table.ts
var a = class extends e {
	source = new r(this, {
		scriptTypes: [
			"tp/csv-table",
			"tp/csv",
			"tp/txt"
		],
		textContentFallback: !0,
		ignoreSelector: "[data-tp-table-output]"
	});
	timer = null;
	revision = 0;
	request = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"separator",
			"heading"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get separator() {
		return this.getAttribute("separator") || ",";
	}
	set separator(e) {
		this.setAttribute("separator", e);
	}
	get heading() {
		return this.hasAttribute("heading");
	}
	set heading(e) {
		this.toggleAttribute("heading", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-content-table-styles", t), this.source.observe(() => this.schedule()), this.schedule();
	}
	disconnectedCallback() {
		this.revision++, this.request?.abort(), this.source.disconnect(), this.timer !== null && clearTimeout(this.timer), this.timer = null, this.removeAttribute("aria-busy");
	}
	attributeChangedCallback() {
		this.isConnected && this.schedule();
	}
	schedule() {
		this.revision++, this.request?.abort(), this.timer !== null && clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.timer = null, this.render();
		}, 0);
	}
	async render() {
		let e = this.revision;
		this.source.capture(), this.request = new AbortController(), this.setAttribute("aria-busy", "true");
		try {
			let t = await this.source.read({ signal: this.request.signal });
			if (e !== this.revision || !this.isConnected) return;
			let r = i(t, this.separator === "\\t" ? "	" : this.separator);
			if (!r.length) throw Error("Provide CSV content or a CSV file to display a table.");
			let a = n(r.map((e) => e.map((e) => [this.ownerDocument.createTextNode(e)])), this.heading, this.ownerDocument);
			a.setAttribute("data-tp-table-output", ""), this.replaceChildren(a);
		} catch (t) {
			if (e !== this.revision || !this.isConnected) return;
			let n = document.createElement("tp-callout");
			n.setAttribute("variant", "warning"), n.setAttribute("data-tp-table-output", ""), n.textContent = t instanceof Error ? t.message : "Unable to load the CSV table.", this.replaceChildren(n);
		} finally {
			e === this.revision && this.removeAttribute("aria-busy");
		}
	}
};
customElements.get("tp-csv-table") || customElements.define("tp-csv-table", a);
//#endregion
export { a as TpCsvTable };

//# sourceMappingURL=csv-table.js.map