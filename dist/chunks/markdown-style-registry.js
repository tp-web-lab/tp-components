//#region ../tp-markdown/dist/markdown/engine/markdown-style-registry.js
var e = /* @__PURE__ */ new Set();
function t(t, n) {
	if (e.has(t) || document.getElementById(t) !== null) {
		e.add(t);
		return;
	}
	let r = document.createElement("style");
	r.id = t, r.dataset.tpMarkdownStyle = t, r.textContent = n, document.head.append(r), e.add(t);
}
//#endregion
export { t };

//# sourceMappingURL=markdown-style-registry.js.map