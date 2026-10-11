//#region src/components/icon/icon-registry.ts
var e = "__tpIconLibraries__", t = globalThis, n = t[e] ?? /* @__PURE__ */ new Map();
t[e] = n;
function r(e, t) {
	let r = n?.get(e) ?? /* @__PURE__ */ new Map();
	for (let [e, n] of Object.entries(t)) r.set(e, n);
	n?.set(e, r), window.dispatchEvent(new CustomEvent("tp-icon-library-registered", { detail: { library: e } }));
}
function i(e, t, r = "tp") {
	let i = n?.get(r) ?? /* @__PURE__ */ new Map();
	i.set(e, t), n?.set(r, i), window.dispatchEvent(new CustomEvent("tp-icon-library-registered", { detail: { library: r } }));
}
function a(e, t = "tp") {
	let r = n.get(t);
	return r === void 0 ? null : r.get(e) ?? null;
}
function o(e, t = "tp") {
	return a(e, t) !== null;
}
function s(e = "tp") {
	let t = n.get(e);
	return t === void 0 ? [] : Array.from(t.keys()).sort();
}
function c() {
	return Array.from(n.keys()).sort();
}
function l(e = "tp") {
	let t = n.get(e);
	return t === void 0 ? {} : Object.fromEntries(t.entries());
}
function u() {
	let e = {};
	for (let [t, r] of n.entries()) e[t] = Object.fromEntries(r.entries());
	return e;
}
function d() {
	n.clear(), window.dispatchEvent(new CustomEvent("tp-icon-library-registered", { detail: { library: "*" } }));
}
//#endregion
export { d as clearTpIconRegistry, u as getAllTpIconLibraries, a as getTpIcon, l as getTpIconLibrary, o as hasTpIcon, c as listTpIconLibraries, s as listTpIcons, i as registerTpIcon, r as registerTpIconLibrary };

//# sourceMappingURL=icon-registry.js.map