import { dt as e } from "./lib/typescript/typescript.js";
import { a as t, n, t as r } from "./cryptarithm-ui.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/cryptarithm/index.js
var i = "__tp_cryptarithm_installed";
function a(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
function o(o) {
	if (o[i]) return;
	o[i] = !0, e(t, n);
	let s = o.renderer.rules.fence;
	o.renderer.rules.fence = function(e, t, n, i, o) {
		let c = e[t];
		if (!c) return "";
		if (!(c.info || "").trim().startsWith("cryptarithm")) return s ? s.call(this, e, t, n, i, o) : "";
		let l = r(c.content);
		return `<div class="tp-cryptarithm" data-cryptarithm-equation="${a(l.equation)}" data-cryptarithm-solution="${a(l.solution)}"></div>`;
	};
}
//#endregion
export { o as cryptarithmExtension, o as default };

