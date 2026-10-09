//#region src/languages/markdown/extensions/mathjax/index.ts
var e = !1;
function t() {
	return e ? "" : (e = !0, n());
}
function n() {
	return "\n<style>\n.tp-md-math-display {\n  display: flex;\n  justify-content: center;\n  margin-block: 1rem;\n  overflow-x: auto;\n}\n\n.tp-md-math-display mjx-container {\n  margin-inline: auto;\n}\n\n.tp-md-math-inline {\n  display: inline-block;\n}\n</style>\n";
}
function r(e, t = {}) {
	i(e), a(e), o(e), u(e);
}
function i(e) {
	e.inline.ruler.before("escape", "mathjax_latex_inline", (e, t) => s(e, t, "latexmath", "mathjax_latex_inline")), e.renderer.rules.mathjax_latex_inline = c;
}
function a(e) {
	e.inline.ruler.before("escape", "mathjax_asciimath_inline", (e, t) => s(e, t, "asciimath", "mathjax_asciimath_inline")), e.renderer.rules.mathjax_asciimath_inline = l;
}
function o(e) {
	e.inline.ruler.before("escape", "mathjax_generic_inline", (e, t) => s(e, t, "math", "mathjax_generic_inline")), e.renderer.rules.mathjax_generic_inline = (e, t, n, r) => {
		let i = d(e[t]);
		return (r.attributes?.math ?? "latexmath") === "asciimath" ? p(i, !1) : f(i, !1);
	};
}
function s(e, t, n, r) {
	let i = `:${n}:\``;
	if (!e.src.startsWith(i, e.pos)) return !1;
	let a = e.pos + i.length, o = e.src.indexOf("`", a);
	if (o === -1) return !1;
	let s = e.src.slice(a, o);
	if (s === "") return !1;
	if (!t) {
		let t = e.push(r, "", 0);
		t.content = "", t.meta = { source: s };
	}
	return e.pos = o + 1, !0;
}
function c(e, t) {
	return f(d(e[t]), !1);
}
function l(e, t) {
	return p(d(e[t]), !1);
}
function u(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		let s = o.info.trim();
		if (s !== "math" && s !== "latexmath" && s !== "asciimath") return typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
		let c = o.content.trim();
		return s === "asciimath" || s === "math" && i.attributes?.math === "asciimath" ? p(c, !0) : f(c, !0);
	};
}
function d(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.source == "string" ? t.source : "";
}
function f(e, n) {
	let r = n ? "div" : "span", i = n ? "tp-md-math tp-md-math-display" : "tp-md-math tp-md-math-inline";
	return `${t()}<${r} class="${i}" data-mathjax-tex="${h(e)}" data-mathjax-display="${String(n)}"></${r}>`;
}
function p(e, n) {
	let r = n ? "div" : "span", i = n ? "tp-md-math tp-md-math-display" : "tp-md-math tp-md-math-inline";
	return `${t()}<${r} class="${i}" data-mathjax-asciimath="${h(e)}" data-mathjax-display="${String(n)}"></${r}>`;
}
function m(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function h(e) {
	return m(e);
}
//#endregion
export { r as default };

