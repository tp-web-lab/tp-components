import { n as e } from "../../chunks/blank.js";
//#region src/components/fill-blank/fields.ts
function t(t) {
	return Array.from(t.querySelectorAll("input, select, tp-blank")).filter((t) => e(t) || (t instanceof HTMLInputElement || t instanceof HTMLSelectElement) && !t.closest("tp-blank") && !t.hasAttribute("data-tp-numberfield-submission"));
}
//#endregion
export { t as getBlankFields };

//# sourceMappingURL=fields.js.map