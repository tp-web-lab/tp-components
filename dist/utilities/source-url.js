//#region src/utilities/source-url.ts
function e(t) {
	let n = t.ownerDocument.baseURI, r = t.closest("[data-tp-markdown-source], [data-tp-source]");
	if (!r) return n;
	let i = r.parentElement ? e(r.parentElement) : n, a = r.getAttribute("data-tp-markdown-source")?.trim(), o = a ? new URL(a, i).href : i, s = r.getAttribute("data-tp-source")?.trim();
	return s ? new URL(s, o).href : o;
}
function t(e) {
	let t = e.closest("[data-tp-markdown-source]")?.getAttribute("data-tp-markdown-source")?.trim();
	return t !== void 0 && t !== "";
}
function n(t, n) {
	return new URL(n, e(t));
}
//#endregion
export { e as getComponentSourceBaseUrl, t as hasComponentMarkdownSourceBase, n as resolveComponentSourceUrl };

//# sourceMappingURL=source-url.js.map