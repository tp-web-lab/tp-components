import { ct as e, lt as t, ut as n } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/mdviewer.js
var r = {
	id: "mdviewer",
	async render(e, t = {}) {
		for (let n of e.querySelectorAll(".tp-md-mdviewer")) n instanceof HTMLElement && await i(n, t);
	}
};
async function i(t, n) {
	if (t.dataset.mdviewerRendered === "true") return;
	t.dataset.mdviewerRendered = "true";
	let r = t.querySelector(".tp-md-mdviewer-source"), i = t.querySelector(".tp-md-mdviewer-start"), o = t.querySelector(".tp-md-mdviewer-start-controls"), s = t.querySelector(".tp-md-mdviewer-source-output"), c = t.querySelector(".tp-md-mdviewer-output"), l = t.querySelector(".tp-md-mdviewer-select"), u = t.querySelector(".tp-md-mdviewer-layout");
	if (!(r instanceof HTMLElement) || !(i instanceof HTMLElement) || !(c instanceof HTMLElement) || !(l instanceof HTMLSelectElement) || !(u instanceof HTMLSelectElement)) return;
	let d = s instanceof HTMLElement ? s : i, f = o instanceof HTMLElement ? o : i, p = E(r), m = x(t.dataset.mdviewerExtensions ?? ""), g = await a(t, p, n, m), _ = new e({ attributes: { pageNav: { enabled: !1 } } }), v = g[0] ?? {
		label: "Example",
		source: p,
		renderSource: C(p, m),
		attributes: h(p),
		path: n.path,
		allowScript: !1
	}, y = g.length > 1 ? b(g) : null;
	y !== null && (f.append(y), y.addEventListener("change", () => {
		let e = g.find((e) => e.label === y.value);
		e !== void 0 && (v = e, w());
	}));
	let S = () => {
		t.dataset.mdviewerLayout = A(u.value);
	}, w = async () => {
		S(), d.replaceChildren(j(v.source, "markdown")), await _.renderRuntime(d, { only: ["highlight"] }), await D(c, v.renderSource, v.attributes, v.path ?? n.path, n.includeBaseUrl, k(l.value), v.allowScript === !0);
	};
	u.addEventListener("change", S), l.addEventListener("change", () => {
		w();
	}), S(), await w();
}
async function a(e, t, n, r) {
	let i = e.dataset.mdviewerSrc?.trim() ?? "";
	if (i !== "") {
		let e = await o(i, n, r);
		if (e.length > 0) return e;
	}
	let a = h(t), s = d(t, r, a);
	return s.length > 0 ? s : [{
		label: "Example",
		source: t,
		renderSource: C(t, r),
		attributes: a,
		path: n.path
	}];
}
async function o(e, t, n) {
	let r = e.split(",").map((e) => e.trim()).filter((e) => e !== ""), i = [];
	for (let e of r) {
		let r = F(t.path ?? "/index.md", e), a = L(t.includeBaseUrl ?? "", r), o = await T(a);
		if (o === null) {
			i.push({
				label: R(e),
				source: `> Unable to load example: \`${a}\``,
				renderSource: `> Unable to load example: \`${a}\``,
				attributes: {},
				path: r,
				allowScript: !1
			});
			continue;
		}
		let l = h(o), u = c(o, n), f = d(o, u, l);
		if (f.length > 0) {
			i.push(...f.map((e) => ({
				...e,
				path: r
			})));
			continue;
		}
		i.push({
			label: s(o) ?? R(e),
			source: o,
			renderSource: C(o, u),
			attributes: l,
			path: r,
			allowScript: !1
		});
	}
	return i;
}
function s(e) {
	if (e === null) return null;
	let t = e.match(/^(`{3,}|~{3,})\s*\S+\s+(.*?)$/m);
	return t === null ? null : N(t[2] ?? "", "label");
}
function c(e, t) {
	let n = new Set(t);
	for (let t of u(e)) {
		let e = _(t);
		l(e) && n.add(e);
	}
	return S([...n]);
}
function l(e) {
	return [
		"diagram",
		"game-life",
		"handwriting",
		"l-system",
		"map",
		"math",
		"music",
		"slide",
		"speech-to-text",
		"text-to-speech",
		"turtle",
		"typewriting",
		"sudoku",
		"crossword"
	].includes(e);
}
function u(e) {
	let t = [];
	for (let n of e.matchAll(/^(`{3,}|~{3,})\s*([^\s{]+)?/gm)) {
		let e = n[2]?.trim() ?? "";
		e !== "" && t.push(e);
	}
	return t;
}
function d(e, t, n = h(e)) {
	let r = e.split("\n"), i = [], a = m(e), o = g(e), s = 0;
	for (; s < r.length;) {
		let e = (r[s] ?? "").match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
		if (e === null) {
			s += 1;
			continue;
		}
		let c = e[1] ?? "```", l = e[2]?.trim() ?? "", u = M(l), d = s;
		for (s += 1; s < r.length;) {
			if (f(r[s] ?? "", c)) {
				let e = p(r.slice(d + 1, s).join("\n")), f = N(l, "label") ?? `${u || "example"} ${String(i.length + 1)}`, m = y(l), h = _(u), g = P(l, "allow-script"), b = [
					`${c}${l === "" ? "" : ` ${l}`}`,
					e,
					c
				].join("\n"), x = u === "example" ? e : [
					`${c}${m === "" ? "" : ` ${m}`}`,
					e,
					c
				].join("\n"), S = a === "" ? x : `${a}${x}`, w = u === "example" ? e : b, T = a === "" ? w : `${a}${w}`, E = v(t, ...o, ...u === "example" ? [] : [h]);
				i.push({
					label: f,
					source: T,
					renderSource: C(S, E),
					attributes: n,
					allowScript: g
				}), s += 1;
				break;
			}
			s += 1;
		}
	}
	return i;
}
function f(e, t) {
	let n = t[0] ?? "`";
	return RegExp(`^ {0,3}${z(n)}{${String(t.length)},}[ \\t]*$`).test(e);
}
function p(e) {
	let t = e.replace(/\r\n/g, "\n").split("\n"), n = t.filter((e) => e.trim() !== "").map((e) => e.match(/^[ \t]*/)?.[0].length ?? 0), r = n.length === 0 ? 0 : Math.min(...n);
	return r === 0 ? e : t.map((e) => e.trim() === "" ? e : e.slice(r)).join("\n");
}
function m(e) {
	return e.match(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/)?.[0].trimStart() ?? "";
}
function h(e) {
	let n = e.match(/^\s*---\r?\n([\s\S]*?)\r?\n---/);
	if (n === null) return {};
	try {
		let e = t(n[1] ?? "");
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function g(e) {
	let t = h(e).extensions;
	return Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.trim() !== "") : [];
}
function _(e) {
	switch (e) {
		case "latexmath":
		case "asciimath": return "math";
		default: return e;
	}
}
function v(e, ...t) {
	return S([.../* @__PURE__ */ new Set([...e.filter(l), ...t.filter(l)])]);
}
function y(e) {
	return e.replace(/\s*name=(?:"[^"]+"|'[^']+'|\S+)/g, "").replace(/\{\s*name=(?:"[^"]+"|'[^']+'|\S+)\s*\}/g, "").replace(/\{\s+/g, "{ ").replace(/\s+\}/g, " }").replace(/\{\s*\}/g, "").replace(/\s+/g, " ").trim();
}
function b(e) {
	let t = document.createElement("select");
	t.className = "tp-md-mdviewer-example", t.setAttribute("aria-label", "Example");
	for (let n of e) {
		let e = document.createElement("option");
		e.value = n.label, e.textContent = n.label, t.append(e);
	}
	return t;
}
function x(e) {
	return S(e.split(",").map((e) => e.trim()).filter(l));
}
function S(e) {
	let t = [
		"math",
		"diagram",
		"music",
		"sudoku",
		"crossword",
		"map",
		"slide",
		"text-to-speech",
		"speech-to-text"
	];
	return [...e].sort((e, n) => {
		let r = t.indexOf(e), i = t.indexOf(n);
		return r === -1 && i === -1 ? 0 : r === -1 ? 1 : i === -1 ? -1 : r - i;
	});
}
function C(e, t) {
	let n = t.filter(l);
	return n.length === 0 ? e : w(e) ? e.replace(/^\s*---\r?\n([\s\S]*?)\r?\n---/, (t, r) => {
		let i = h(e), a = Array.isArray(i.extensions) ? i.extensions.filter((e) => typeof e == "string" && l(e)) : [], o = `extensions:\n${[.../* @__PURE__ */ new Set([...a, ...n])].map((e) => `  - ${e}`).join("\n")}\n`;
		return `---\n${(r.match(/^extensions:\r?\n((?:\s+- .+\r?\n?)*)/m) === null ? `${r.trimEnd()}\n${o}` : r.replace(/^extensions:\r?\n(?:\s+- .+\r?\n?)*/m, o)).trimEnd()}\n---`;
	}) : `---
extensions:
${n.map((e) => `  - ${e}`).join("\n")}
---

${e}`;
}
function w(e) {
	return /^\s*---\r?\n/.test(e);
}
async function T(e) {
	try {
		let t = await fetch(e, { cache: "no-store" });
		if (!t.ok) return null;
		let n = t.headers.get("content-type") ?? "", r = await t.text();
		return n.includes("text/html") || /^\s*<!doctype html/i.test(r) || /^\s*<html[\s>]/i.test(r) ? null : r;
	} catch {
		return null;
	}
}
function E(e) {
	return e instanceof HTMLTemplateElement ? e.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'").replaceAll("&amp;", "&") : e.textContent ?? "";
}
async function D(t, r, i, a, o, s, c) {
	if (t.toggleAttribute("data-allow-script", c), O(r)) {
		t.replaceChildren(j("Nested mdviewer rendering skipped.", "text"));
		return;
	}
	let l = new e({
		path: a ?? "/mdviewer.md",
		includeBaseUrl: o,
		attributes: {
			...i,
			pageNav: { enabled: !1 }
		}
	});
	if (s === "render") {
		t.innerHTML = await l.renderAsync(r), await l.renderRuntime(t, { exclude: ["mdviewer"] }), n(t);
		return;
	}
	if (s === "html") {
		let e = await l.renderAsync(r);
		t.replaceChildren(j(V(e), "html")), await l.renderRuntime(t, { only: ["highlight"] });
		return;
	}
	let u = await l.parseAsync(r), d = JSON.stringify(u.tokens, null, 2);
	t.replaceChildren(j(d, "json")), await l.renderRuntime(t, { only: ["highlight"] });
}
function O(e) {
	return /^(`{3,}|~{3,})[ \t]*mdviewer\b/m.test(e);
}
function k(e) {
	return e === "html" || e === "ast" ? e : "render";
}
function A(e) {
	return e === "source" || e === "output" ? e : "both";
}
function j(e, t) {
	let n = document.createElement("pre"), r = document.createElement("code");
	return r.className = `language-${t}`, r.textContent = e, n.append(r), n;
}
function M(e) {
	return e.trim().split(/\s+/)[0]?.replace(/[{}]/g, "") ?? "";
}
function N(e, t) {
	let n = RegExp(`${z(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function P(e, t) {
	return RegExp(`(?:^|[\\s{])${z(t)}(?:[\\s}]|$)`).test(e);
}
function F(e, t) {
	if (t.startsWith("/")) return I(t);
	let n = e.split("/").filter(Boolean);
	n.pop();
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			n.pop();
			continue;
		}
		n.push(e);
	}
	return `/${n.join("/")}`;
}
function I(e) {
	let t = [];
	for (let n of e.split("/")) if (!(n === "" || n === ".")) {
		if (n === "..") {
			t.pop();
			continue;
		}
		t.push(n);
	}
	return `/${t.join("/")}`;
}
function L(e, t) {
	let n = e.replace(/\/$/, ""), r = t.replace(/^\//, "");
	return n === "" ? `/${r}` : `${n}/${r}`;
}
function R(e) {
	return e.split("/").at(-1)?.replace(/\.[^.]+$/, "") ?? e;
}
function z(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var B = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.b.bdi.bdo.cite.code.data.dfn.em.h1.h2.h3.h4.h5.h6.i.kbd.mark.p.q.rp.rt.ruby.s.samp.small.span.strong.sub.sup.time.u.var.wbr".split("."));
function V(e) {
	let t = document.createElement("template");
	return t.innerHTML = e.trim(), Array.from(t.content.childNodes).map((e) => H(e, 0)).filter((e) => e.length > 0).join("\n").trim();
}
function H(e, t) {
	if (e instanceof Text) return W(e.textContent ?? "");
	if (!(e instanceof Element)) return "";
	let n = e.tagName.toLowerCase(), r = G(e), i = "  ".repeat(t);
	if (B.has(n)) return `${i}<${n}${r}>${U(e)}</${n}>`;
	let a = Array.from(e.childNodes).map((e) => H(e, t + 1)).filter((e) => e.trim().length > 0);
	return a.length === 0 ? `${i}<${n}${r}></${n}>` : [
		`${i}<${n}${r}>`,
		...a,
		`${i}</${n}>`
	].join("\n");
}
function U(e) {
	return Array.from(e.childNodes).map((e) => {
		if (e instanceof Text) return W(e.textContent ?? "");
		if (e instanceof Element) {
			let t = e.tagName.toLowerCase();
			return `<${t}${G(e)}>${U(e)}</${t}>`;
		}
		return "";
	}).join("").replace(/\s+/g, " ").trim();
}
function W(e) {
	return e.replace(/\s+/g, " ");
}
function G(e) {
	return Array.from(e.attributes).map((e) => ` ${e.name}="${K(e.value)}"`).join("");
}
function K(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;");
}
//#endregion
export { r as default };

