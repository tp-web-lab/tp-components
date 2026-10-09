//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/diagram/index.js
function e(e, n = {}) {
	t(e, n);
}
function t(e, t) {
	let r = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, a, o, s, c) => {
		let l = e[a];
		return l === void 0 ? "" : l.info.trim() === "diagram" ? `
<div class="${i(t.className ?? "tp-md-diagram")}" data-md-diagram>
  <template data-md-diagram-source>${n(l.content.trim())}</template>
</div>
` : typeof r == "function" ? r(e, a, o, s, c) : c.renderToken(e, a, o);
	};
}
function n(e) {
	return e.replaceAll("</template", "<\\/template");
}
function r(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function i(e) {
	return r(e);
}
//#endregion
export { e as default };

