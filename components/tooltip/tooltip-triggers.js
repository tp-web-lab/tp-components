import { Qn as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/tooltip/tooltip-triggers.ts
var t = /* @__PURE__ */ new WeakMap();
function n(e) {
	return e === "show" || e === "hide" || e === "toggle";
}
function r(t, n = document) {
	let r = t.getAttribute("data-tp-tooltip-target");
	if (r === null || r.trim() === "") return null;
	let i = t.getRootNode(), a = i instanceof ShadowRoot || i instanceof Document ? i.querySelector(r) : null;
	if (a instanceof e) return a;
	let o = n instanceof Document || n instanceof ShadowRoot ? n.querySelector(r) : null;
	if (o instanceof e) return o;
	let s = document.querySelector(r);
	return s instanceof e ? s : null;
}
function i(e, t = document) {
	let i = e.getAttribute("data-tp-tooltip-action");
	if (i === null || !n(i)) return;
	let a = r(e, t);
	if (a !== null) {
		if (i === "show") {
			a.show();
			return;
		}
		if (i === "hide") {
			a.hide();
			return;
		}
		if (a.open) {
			a.hide();
			return;
		}
		a.show();
	}
}
function a(e = document) {
	if (t.has(e)) return;
	let n = (t) => {
		let n = t.target;
		if (!(n instanceof Element)) return;
		let r = n.closest("[data-tp-tooltip-action]");
		r !== null && i(r, e);
	};
	e.addEventListener("click", n), t.set(e, n);
}
function o(e = document) {
	let n = t.get(e);
	n !== void 0 && (e.removeEventListener("click", n), t.delete(e));
}
//#endregion
export { a as setupTpTooltipTriggers, o as teardownTpTooltipTriggers };

