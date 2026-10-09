import { t as e } from "../../chunks/popover.js";
//#region src/components/popover/popover-triggers.ts
var t = /* @__PURE__ */ new WeakMap();
function n(e) {
	return e === "show" || e === "hide" || e === "toggle";
}
function r(t, n = document) {
	let r = t.getAttribute("data-tp-popover-target");
	if (r === null || r.trim() === "") return null;
	let i = t.getRootNode(), a = i instanceof ShadowRoot || i instanceof Document ? i.querySelector(r) : null;
	if (a instanceof e) return a;
	let o = n instanceof Document || n instanceof ShadowRoot ? n.querySelector(r) : null;
	if (o instanceof e) return o;
	let s = document.querySelector(r);
	return s instanceof e ? s : null;
}
function i(t = document) {
	return (t instanceof Document || t instanceof ShadowRoot ? Array.from(t.querySelectorAll("tp-popover")) : Array.from(document.querySelectorAll("tp-popover"))).filter((t) => t instanceof e);
}
function a(e, t = document) {
	let n = i(t);
	for (let t of n) t !== e && t.open && t.hide();
}
function o(e, t = document) {
	let i = e.getAttribute("data-tp-popover-action");
	if (i === null || !n(i)) return;
	let o = r(e, t);
	if (o === null) return;
	let s = e.hasAttribute("data-tp-popover-exclusive");
	if (i === "show") {
		s && a(o, t), o.show();
		return;
	}
	if (i === "hide") {
		o.hide();
		return;
	}
	!o.open && s && a(o, t), o.toggle();
}
function s(e = document) {
	if (t.has(e)) return;
	let n = (t) => {
		let n = t.target;
		if (!(n instanceof Element)) return;
		let r = n.closest("[data-tp-popover-action]");
		r !== null && o(r, e);
	};
	e.addEventListener("click", n), t.set(e, n);
}
function c(e = document) {
	let n = t.get(e);
	n !== void 0 && (e.removeEventListener("click", n), t.delete(e));
}
//#endregion
export { s as setupTpPopoverTriggers, c as teardownTpPopoverTriggers };

