//#region src/components/markup-viewer/shared-example.ts
var e = /* @__PURE__ */ new WeakMap();
function t(e) {
	return e.closest("tp-tabs") ?? e;
}
function n(e) {
	return JSON.stringify([...e].sort());
}
function r(r, i) {
	return e.get(t(r))?.get(n(i));
}
function i(r, i) {
	let a = t(r), o = n([...i.options].map((e) => e.value)), s = e.get(a);
	s || (s = /* @__PURE__ */ new Map(), e.set(a, s)), s.set(o, i.value);
	for (let e of a.querySelectorAll("select[aria-label=\"Example\"]")) e === i || e.closest("tp-tabs") !== r.closest("tp-tabs") || n([...e.options].map((e) => e.value)) !== o || e.value === i.value || (e.value = i.value, e.dispatchEvent(new Event("change")));
}
//#endregion
export { i as shareViewerExample, r as sharedViewerExample };

//# sourceMappingURL=shared-example.js.map