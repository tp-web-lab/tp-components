import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/typewriting/index.js
var t = "tp-md-typewriting-styles", n = "\n.tp-md-typewriting {\n  display: inline-flex;\n  align-items: baseline;\n}\n\n.tp-md-typewriting-block {\n  margin-block: 1rem;\n}\n\n.blinking-cursor {\n  display: inline-block;\n  margin-inline-start: 0.1em;\n  animation: tp-md-typewriting-blink 0.8s steps(2, start) infinite;\n}\n\n@keyframes tp-md-typewriting-blink {\n  to {\n    visibility: hidden;\n  }\n}\n";
function r(r) {
	e(t, n), i(r), o(r);
}
function i(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("escape", "typewriting_inline", (e, t) => {
		if (!e.src.startsWith(":typewriting", e.pos)) return !1;
		let n = a(e.src, e.pos + 12);
		if (n === null) return !1;
		let r = l(n.source);
		if (r.length === 0) return !1;
		if (!t) {
			let t = e.push("typewriting_inline", "", 0);
			t.meta = {
				words: r,
				...c(n.args)
			};
		}
		return e.pos = n.end, !0;
	}), n.rules.typewriting_inline = (e, t) => {
		let n = s(e[t]);
		return `<span class="tp-md-typewriting" data-typewriting-words="${v(JSON.stringify(n.words))}" ${h("data-typewriting-speed", n.speed)} ${h("data-typewriting-delay", n.delay)} ${h("data-typewriting-loop", n.loop)}></span>`;
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
		if (s.name !== "typewriting") return typeof n == "function" ? n(e, t, r, i, a) : a.renderToken(e, t, r);
		let l = `${s.args} ${u(o)}`.trim(), f = {
			words: o.content.split("\n").map((e) => e.trim()).filter((e) => e !== ""),
			...c(l)
		};
		return `
<div class="tp-md-typewriting-block">
  <span
    class="tp-md-typewriting"
    data-typewriting-words="${v(JSON.stringify(f.words))}"
    ${h("data-typewriting-speed", f.speed)}
    ${h("data-typewriting-delay", f.delay)}
    ${h("data-typewriting-loop", f.loop)}
  ></span>
</div>
`;
	};
}
function s(e) {
	let t = e?.meta;
	return typeof t == "object" && t && Array.isArray(t.words) ? t : { words: [] };
}
function c(e) {
	return {
		speed: p(e, "speed"),
		delay: p(e, "delay"),
		loop: m(e, "loop")
	};
}
function l(e) {
	return e.split("|").map((e) => e.trim()).filter((e) => e !== "");
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
	let n = RegExp(`${g(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function p(e, t) {
	let n = f(e, t);
	if (n === null) return;
	let r = Number(n);
	return Number.isFinite(r) ? r : void 0;
}
function m(e, t) {
	let n = f(e, t);
	if (n !== null) {
		if (n === "true" || n === "1") return !0;
		if (n === "false" || n === "0") return !1;
	}
}
function h(e, t) {
	return t === void 0 ? "" : `${e}="${v(String(t))}"`;
}
function g(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function v(e) {
	return _(e);
}
//#endregion
export { r as default };

