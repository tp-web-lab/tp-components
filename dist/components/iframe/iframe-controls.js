import { Cn as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/iframe/iframe-controls.ts
var t = /* @__PURE__ */ new WeakMap();
function n(e) {
	return e === "zoom-in" || e === "zoom-out" || e === "zoom-reset";
}
function r(t, n) {
	let r = t.getAttribute("data-tp-iframe-target");
	if (r === null || r.trim() === "") return null;
	let i = ("querySelector" in n ? n.querySelector(r) : null) ?? document.querySelector(r);
	return i instanceof e ? i : null;
}
function i(e, t) {
	let i = e.getAttribute("data-tp-iframe-action");
	if (i === null || !n(i)) return !1;
	let a = r(e, t);
	if (a === null) return !1;
	if (i === "zoom-in") return a.zoomIn(), !0;
	if (i === "zoom-out") return a.zoomOut(), !0;
	let o = Number(e.getAttribute("data-tp-iframe-zoom") ?? "1");
	return a.resetZoom(Number.isFinite(o) ? o : 1), !0;
}
function a(e = document) {
	if (t.has(e)) return;
	let n = (t) => {
		let n = t.target;
		if (!(n instanceof Element)) return;
		let r = n.closest("[data-tp-iframe-action]");
		r !== null && i(r, e) && e !== document && t.stopPropagation();
	};
	e.addEventListener("click", n), t.set(e, n);
}
function o(e = document) {
	let n = t.get(e);
	n !== void 0 && (e.removeEventListener("click", n), t.delete(e));
}
//#endregion
export { a as setupTpIframeControls, o as teardownTpIframeControls };

//# sourceMappingURL=iframe-controls.js.map