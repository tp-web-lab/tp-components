//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/math/index.js
var e = !1;
function t(e, t = {}) {
	n(e), r(e), i(e), l(e);
}
function n(e) {
	e.inline.ruler.before("escape", "math_latex_inline", (e, t) => a(e, t, "latexmath", "math_latex_inline")), e.renderer.rules.math_latex_inline = s;
}
function r(e) {
	e.inline.ruler.before("escape", "math_asciimath_inline", (e, t) => a(e, t, "asciimath", "math_asciimath_inline")), e.renderer.rules.math_asciimath_inline = c;
}
function i(e) {
	e.inline.ruler.before("escape", "math_generic_inline", (e, t) => a(e, t, "math", "math_generic_inline")), e.renderer.rules.math_generic_inline = (e, t, n, r) => {
		let i = f(e[t]);
		return u(r) === "asciimath" ? m(i, !1) : p(i, !1);
	};
}
function a(e, t, n, r) {
	let i = `:${n}:`;
	if (!e.src.startsWith(i, e.pos)) return !1;
	let a = o(e.src, e.pos + i.length);
	if (a === null || a.source === "") return !1;
	if (!t) {
		let t = e.push(r, "", 0);
		t.content = "", t.meta = {
			source: a.source,
			...d(a.args)
		};
	}
	return e.pos = a.end, !0;
}
function o(e, t) {
	let n = t, r = "";
	if (e[n] === "{") {
		let t = e.indexOf("}", n + 1);
		if (t === -1) return null;
		r = e.slice(n + 1, t), n = t + 1;
	}
	if (e[n] !== "`") return null;
	let i = n + 1, a = e.indexOf("`", i);
	return a === -1 ? null : {
		args: r,
		source: e.slice(i, a),
		end: a + 1
	};
}
function s(e, t) {
	return p(f(e[t]), !1);
}
function c(e, t) {
	return m(f(e[t]), !1);
}
function l(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		let s = _(o.info);
		if (s.name !== "math" && s.name !== "latexmath" && s.name !== "asciimath") return typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
		let c = d(`${s.args} ${g(o)}`.trim()), l = o.content.trim();
		return (c.syntax ?? (s.name === "latexmath" || s.name === "asciimath" ? s.name : u(i))) === "asciimath" ? m(l, !0) : p(l, !0);
	};
}
function u(e) {
	let t = e.attributes?.math ?? e.attributes?.mathjax;
	return typeof t == "string" ? t : typeof t == "object" && t && typeof t.syntax == "string" ? t.syntax : "latexmath";
}
function d(e) {
	return { syntax: v(e, "syntax") ?? v(e, "type") ?? void 0 };
}
function f(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.source == "string" ? t.source : "";
}
function p(e, t) {
	let n = t ? "div" : "span", r = t ? "tp-md-math tp-md-math-display" : "tp-md-math tp-md-math-inline";
	return `${h()}<${n} class="${r}" data-mathjax-tex="${x(e)}" data-mathjax-display="${String(t)}"></${n}>`;
}
function m(e, t) {
	let n = t ? "div" : "span", r = t ? "tp-md-math tp-md-math-display" : "tp-md-math tp-md-math-inline";
	return `${h()}<${n} class="${r}" data-mathjax-asciimath="${x(e)}" data-mathjax-display="${String(t)}"></${n}>`;
}
function h() {
	return e ? "" : (e = !0, "\n<style>\n.tp-md-math-display {\n  display: flex;\n  justify-content: center;\n  margin-block: 1rem;\n  overflow-x: auto;\n}\n\n.tp-md-math-display mjx-container {\n  margin-inline: auto;\n}\n\n.tp-md-math-inline {\n  display: inline-block;\n}\n</style>\n");
}
function g(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function _(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function v(e, t) {
	let n = RegExp(`${y(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function y(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function b(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function x(e) {
	return b(e);
}
//#endregion
export { t as default };

