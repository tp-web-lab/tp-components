import { Ju as e } from "./chunks/lib/typescript/typescript.js";
//#region src/tp-loader.ts
var t = "tp-", n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), a = null;
function o(e) {
	let n = e.toLowerCase();
	return n.startsWith(t) ? n.slice(3) : null;
}
function s(e) {
	let t = new URL(import.meta.url), n = t.pathname.endsWith(".ts"), r = n ? "ts" : "js", i = [
		n ? "./components" : t.pathname.includes("/chunks/") ? "../components" : "./components",
		e,
		`${e}.${r}`
	].join("/");
	return new URL(i, import.meta.url).href;
}
function c(e) {
	return e === "loader" || e.endsWith("-backdrop");
}
async function l(e) {
	let t = e.toLowerCase(), a = o(t);
	if (a === null || c(a) || customElements.get(t) !== void 0) return;
	let l = s(a);
	if (n.has(l) || r.has(l)) return;
	let u = i.get(l);
	if (u !== void 0) {
		await u;
		return;
	}
	let d = import(
		/* @vite-ignore */
		l
).then(() => {
		n.add(l), console.info(`[tp-loader] loaded <${t}> from ${l}`);
	}).catch((e) => {
		r.add(l), console.warn(`[tp-loader] skipped <${t}> from ${l}`, e);
	}).finally(() => {
		i.delete(l);
	});
	i.set(l, d), await d;
}
function u(e) {
	let n = /* @__PURE__ */ new Set();
	e instanceof Element && e.localName.startsWith(t) && n.add(e.localName);
	for (let r of e.querySelectorAll("*")) r.localName.startsWith(t) && n.add(r.localName);
	return n;
}
async function d(e = document) {
	let t = u(e);
	await Promise.all([...t].map((e) => l(e)));
}
function f(e) {
	return e instanceof Document ? e.documentElement ?? e : e;
}
function p(e = document) {
	let t = new MutationObserver((e) => {
		for (let t of e) for (let e of t.addedNodes) e instanceof Element && d(e);
	});
	return t.observe(f(e), {
		childList: !0,
		subtree: !0
	}), t;
}
async function m() {
	e(), a === null && (a = p(document)), await d(document);
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
	m();
}) : m());
//#endregion
export { d as loadUsedTpComponents, p as observeUsedTpComponents, m as startTpLoader };

//# sourceMappingURL=tp-loader.js.map