import { Ku as e } from "./lib/typescript/typescript.js";
import { J as t } from "./lib/vendor/vendor.js";
//#region src/components/formula-picker/formula-picker.css?inline
var n = "tp-formula-picker{min-inline-size:0;display:inline-block}tp-formula-picker label{align-items:center;gap:.35rem;font-size:.85rem;display:flex}tp-formula-picker select{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-paper-color);min-block-size:2rem;max-inline-size:13rem;color:inherit;font:inherit;padding-inline:.4rem}", r = Object.entries(t).filter(([e, t]) => typeof t == "function" && /^[A-Z][A-Z0-9.]*$/.test(e)).map(([e]) => e).sort((e, t) => e.localeCompare(t)), i = {
	AND: "logical1, …",
	AVERAGE: "number1, …",
	CONCATENATE: "text1, …",
	COUNT: "value1, …",
	MAX: "number1, …",
	MIN: "number1, …",
	OR: "logical1, …",
	PRODUCT: "number1, …",
	SUM: "number1, …"
};
function a(e) {
	let n = t[e];
	if (typeof n != "function") return `${e}(xxx)`;
	let r = String(n).match(/^function\s*[^()]*\(([^)]*)\)/)?.[1]?.trim() ?? "";
	return `${e}(${r === "" ? i[e] ?? "xxx" : r})`;
}
var o = class t extends e {
	static styleId = "tp-formula-picker-styles";
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.styleId, n), this.render();
	}
	render() {
		let e = document.createElement("label");
		e.textContent = "Formula";
		let t = document.createElement("select");
		t.setAttribute("aria-label", "Formula");
		let n = document.createElement("option");
		n.value = "", n.textContent = "Insert a formula…", n.selected = !0, t.append(n);
		for (let e of r) {
			let n = document.createElement("option");
			n.value = e, n.textContent = a(e), t.append(n);
		}
		t.addEventListener("change", () => {
			if (t.value === "") return;
			let e = `=${a(t.value)}`;
			this.dispatchEvent(new CustomEvent("tp-formula-picker-select", {
				bubbles: !0,
				composed: !0,
				detail: {
					name: t.value,
					formula: e,
					selectionStart: e.indexOf("(") + 1,
					selectionEnd: e.lastIndexOf(")")
				}
			})), t.value = "";
		}), e.append(t), this.replaceChildren(e);
	}
};
customElements.get("tp-formula-picker") || customElements.define("tp-formula-picker", o);
//#endregion
export { r as n, a as r, o as t };

