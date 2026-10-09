import { i as e, t } from "./turtle-dsl.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/turtle/index.js
function n(e) {
	let t = e.renderer.rules.fence ?? ((e, t, n, r, i) => i.renderToken(e, t, n));
	e.renderer.rules.fence = (e, n, a, o, s) => {
		let l = e[n];
		if (!l || i(l.info ?? "") !== "turtle") return t(e, n, a, o, s);
		try {
			return r(l, n);
		} catch (e) {
			return `<pre class="tp-turtle-error"><code>${c(`Turtle render error: ${e instanceof Error ? e.message : String(e)}`)}</code></pre>`;
		}
	};
}
function r(n, r) {
	let i = a(n.attrs ?? []), u = s(i.width, 900), d = s(i.height, 420), f = i.background ?? "transparent", p = (i.label ?? "").trim(), m = n.content ?? "";
	t(e(m));
	let h = o(i), g = `tp-turtle-${r}-${Math.random().toString(36).slice(2, 8)}`;
	return [
		`<figure${h}>`,
		"<div",
		" data-turtle-block=\"true\"",
		` data-turtle-id="${l(g)}"`,
		` data-program="${l(m)}"`,
		` data-width="${String(u)}"`,
		` data-height="${String(d)}"`,
		` data-background="${l(f)}"`,
		` data-label="${l(p)}"`,
		"></div>",
		p ? `<figcaption>${c(p)}</figcaption>` : "",
		"</figure>"
	].join("");
}
function i(e) {
	let t = (e ?? "").trim();
	return t ? (t.match(/^([^\s{]+)/)?.[1] ?? "").toLowerCase() : "";
}
function a(e) {
	let t = {};
	for (let [n, r] of e) {
		let e = (n ?? "").trim().toLowerCase();
		e && (t[e] = r ?? "");
	}
	return t;
}
function o(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) (n === "id" || n === "class" || n === "role" || n.startsWith("data-") || n.startsWith("aria-")) && t.push(` ${n}="${l(r)}"`);
	return t.join("");
}
function s(e, t) {
	if (e === void 0) return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function l(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;").replaceAll("\n", "&#10;").replaceAll("\r", "&#13;");
}
//#endregion
export { n as default };

