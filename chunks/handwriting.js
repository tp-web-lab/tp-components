import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/handwriting/index.js
var t = "tp-md-handwriting-styles", n = "\n.tp-md-handwriting-rendered {\n  font-size: 1.35em;\n  white-space: pre-wrap;\n}\n\n.tp-md-handwriting-block {\n  margin-block: 1rem;\n}\n\n.tp-md-handwriting-output {\n  padding: 1rem;\n  border-radius: 0.75rem;\n}\n\n.tp-md-handwriting-paper-ruled {\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent,\n      transparent calc(var(--tp-md-handwriting-line-height, 1.6) * 1em - 1px),\n      rgb(0 120 255 / 0.22) calc(var(--tp-md-handwriting-line-height, 1.6) * 1em - 1px),\n      rgb(0 120 255 / 0.22) calc(var(--tp-md-handwriting-line-height, 1.6) * 1em)\n    );\n}\n";
function r(r) {
	e(t, n), i(r), o(r);
}
function i(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("escape", "handwriting_inline", (e, t) => {
		if (!e.src.startsWith(":handwriting", e.pos)) return !1;
		let n = a(e.src, e.pos + 12);
		if (n === null || n.source.trim() === "") return !1;
		if (!t) {
			let t = e.push("handwriting_inline", "", 0);
			t.meta = {
				source: n.source.trim(),
				...c(n.args)
			};
		}
		return e.pos = n.end, !0;
	}), n.rules.handwriting_inline = (e, t) => {
		let n = s(e[t]);
		return `<span
  class="tp-md-handwriting"
  data-handwriting-text="${_(n.source)}"
  ${m("data-handwriting-font", n.font)}
  ${m("data-handwriting-font-url", n.fontUrl)}
  ${m("data-handwriting-line-height", n.lineHeight)}
  ${m("data-handwriting-paper", n.paper)}
></span>`;
	});
}
function a(e, t) {
	let n = t, r = "";
	if (e[n] === "{") {
		let t = e.indexOf("}", n + 1);
		if (t === -1) return null;
		r = e.slice(n + 1, t), n = t + 1;
	}
	if (e[n] !== ":" || (n += 1, e[n] !== "`")) return null;
	let i = n + 1, a = e.indexOf("`", i);
	return a === -1 ? null : {
		args: r,
		source: e.slice(i, a),
		end: a + 1
	};
}
function o(e) {
	let t = e.renderer, n = t.rules.fence;
	t.rules.fence = (e, t, r, i, a) => {
		let o = e[t];
		if (o === void 0) return "";
		let s = d(o.info);
		if (s.name !== "handwriting") return typeof n == "function" ? n(e, t, r, i, a) : a.renderToken(e, t, r);
		let l = `${s.args} ${u(o)}`.trim(), f = {
			source: o.content.trim(),
			...c(l)
		};
		return `
<div
  class="tp-md-handwriting-block"
  ${m("data-handwriting-font", f.font)}
  ${m("data-handwriting-font-url", f.fontUrl)}
  ${m("data-handwriting-line-height", f.lineHeight)}
  ${m("data-handwriting-paper", f.paper)}
>
  <pre hidden class="tp-md-handwriting-source">${g(f.source)}</pre>
  <div class="tp-md-handwriting-output"></div>
</div>
`;
	};
}
function s(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.source == "string" ? t : { source: "" };
}
function c(e) {
	return {
		font: f(e, "font") ?? void 0,
		fontUrl: f(e, "font-url") ?? f(e, "fontUrl") ?? void 0,
		lineHeight: p(e, "line-height") ?? p(e, "lineHeight"),
		paper: l(e)
	};
}
function l(e) {
	let t = f(e, "paper");
	if (t === "none" || t === "ruled") return t;
}
function u(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function d(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function f(e, t) {
	let n = RegExp(`${h(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function p(e, t) {
	let n = f(e, t);
	if (n === null) return;
	let r = Number(n);
	return Number.isFinite(r) ? r : void 0;
}
function m(e, t) {
	return t === void 0 ? "" : `${e}="${_(String(t))}"`;
}
function h(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function g(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function _(e) {
	return g(e);
}
//#endregion
export { r as default };

