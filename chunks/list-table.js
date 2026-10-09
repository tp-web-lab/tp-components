import { ct as e } from "./lib/typescript/typescript.js";
import { l as t } from "./lib/markdown-it/markdown-it.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/list-table.js
var n = {
	id: "list-table",
	render(e, t = {}) {
		for (;;) {
			let n = e.querySelector("template[data-md-renderer=\"list-table\"]");
			if (n === null) break;
			let i = g(t), a = {
				className: v(t, "className", "tp-md-table tp-md-list-table"),
				noHeading: n.hasAttribute("no-heading"),
				caption: n.getAttribute("caption") ?? "",
				markdownIt: i,
				env: _(t)
			}, s = o(r(h(n), a), a);
			n.replaceWith(s);
		}
	}
};
function r(e, t) {
	let n = l(t.markdownIt.parse(e, t.env));
	return n === null ? [] : i(n.tokens);
}
function i(e) {
	return f(e).map(a).filter((e) => e.cells.length > 0);
}
function a(e) {
	let t = u(e);
	return t === null ? { cells: [] } : { cells: f(t.tokens).map((e) => ({ tokens: e })) };
}
function o(e, t) {
	let n = document.createElement("table");
	if (n.className = t.className, t.caption.trim() !== "") {
		let e = document.createElement("caption");
		e.textContent = t.caption, n.append(e);
	}
	let [r, ...i] = e;
	if (!t.noHeading && r !== void 0) {
		let e = document.createElement("thead");
		e.append(s(r, "th", t)), n.append(e);
	}
	let a = document.createElement("tbody"), o = t.noHeading ? e : i;
	for (let e of o) a.append(s(e, "td", t));
	return n.append(a), p(n), n;
}
function s(e, t, n) {
	let r = document.createElement("tr");
	for (let i of e.cells) {
		let e = document.createElement(t);
		e.innerHTML = c(i.tokens, n), r.append(e);
	}
	return r;
}
function c(e, t) {
	return t.markdownIt.renderer.render(e, t.markdownIt.options, t.env);
}
function l(e) {
	for (let t = 0; t < e.length; t += 1) if (e[t]?.type === "bullet_list_open") return d(e, t);
	return null;
}
function u(e) {
	for (let t = 0; t < e.length; t += 1) if (e[t]?.type === "bullet_list_open") return d(e, t);
	return null;
}
function d(e, t) {
	let n = e[t]?.type, r = n?.replace("_open", "_close") ?? "", i = 0;
	for (let a = t; a < e.length; a += 1) {
		let o = e[a];
		if (o?.type === n && (i += 1), o?.type === r && (--i, i === 0)) return {
			tokens: e.slice(t + 1, a),
			nextIndex: a + 1
		};
	}
	return {
		tokens: e.slice(t + 1),
		nextIndex: e.length
	};
}
function f(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		if (e[n]?.type !== "list_item_open") {
			n += 1;
			continue;
		}
		let r = d(e, n);
		t.push(r.tokens), n = r.nextIndex;
	}
	return t;
}
function p(e) {
	let t = e.tBodies.item(0);
	if (t === null) return;
	let n = [...t.rows];
	if (n.length === 0) return;
	let r = Math.max(...n.map((e) => e.cells.length));
	for (let e = 0; e < r; e += 1) {
		let t = n.map((t) => t.cells.item(e)).filter((e) => e !== null);
		if (t.length > 0 && t.every((e) => m(e.textContent ?? ""))) for (let e of t) e.classList.add("tp-md-table-number");
	}
}
function m(e) {
	let t = e.trim().replaceAll(/\s/g, "").replace(",", ".");
	return t !== "" && Number.isFinite(Number(t));
}
function h(e) {
	return e.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&quot;", "\"").replaceAll("<\\/template", "</template");
}
function g(n) {
	let r = n.markdownIt;
	return r instanceof t ? r : new e().md;
}
function _(e) {
	let t = e.env;
	return typeof t == "object" && t && !Array.isArray(t) ? t : {};
}
function v(e, t, n) {
	let r = e[t];
	return typeof r == "string" ? r : n;
}
//#endregion
export { n as default };

