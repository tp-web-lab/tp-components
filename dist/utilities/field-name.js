//#region src/utilities/field-name.ts
var e = /* @__PURE__ */ new WeakSet();
function t(t) {
	if (e.has(t) || (e.add(t), t.hasAttribute("name"))) return;
	let n = Array.from(t.childNodes).filter((e) => e.nodeType === Node.TEXT_NODE || e instanceof HTMLElement && e.tagName === "CODE").map((e) => e.textContent ?? "").join("").trim();
	n && t.setAttribute("name", n);
}
//#endregion
export { t as initializeFieldName };

//# sourceMappingURL=field-name.js.map