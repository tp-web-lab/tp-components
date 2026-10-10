//#region src/languages/markdown/extensions/mermaid/index.ts
function e(e, n = {}) {
	t(e, n);
}
function t(e, t) {
	let i = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, a, o, s, c) => {
		let l = e[a];
		return l === void 0 ? "" : l.info.trim() === "mermaid" ? `
<div class="${r(t.className ?? "tp-md-mermaid")}">
  <pre class="mermaid">${n(l.content.trim())}</pre>
</div>
` : typeof i == "function" ? i(e, a, o, s, c) : c.renderToken(e, a, o);
	};
}
function n(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function r(e) {
	return n(e);
}
//#endregion
export { e as default };

//# sourceMappingURL=index.js.map