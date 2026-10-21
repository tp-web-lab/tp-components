//#region src/components/fill-blank/fields.ts
function e(e) {
	return Array.from(e.querySelectorAll("input, select, tp-blank, tp-mathfield")).filter((e) => e.localName === "tp-blank" || e.localName === "tp-mathfield" && !e.closest("tp-blank") || (e instanceof HTMLInputElement || e instanceof HTMLSelectElement) && !e.closest("tp-blank, tp-mathfield") && !e.hasAttribute("data-tp-numberfield-submission"));
}
//#endregion
export { e as getBlankFields };

//# sourceMappingURL=fields.js.map