import { or as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/drawer/drawer-triggers.ts
var t = /* @__PURE__ */ new WeakMap();
function n(e) {
	return e === "show" || e === "hide" || e === "toggle";
}
function r(t) {
	let n = t.getAttribute("data-tp-drawer-target");
	if (n === null || n.trim() === "") return null;
	let r = t.getRootNode(), i = r instanceof ShadowRoot || r instanceof Document ? r.querySelector(n) : null;
	if (i instanceof e) return i;
	let a = document.querySelector(n);
	return a instanceof e ? a : null;
}
function i(e) {
	let t = e.getAttribute("data-tp-drawer-action");
	if (t === null || !n(t)) return;
	let i = r(e);
	if (i !== null) {
		if (t === "show") {
			i.show();
			return;
		}
		if (t === "hide") {
			i.hide();
			return;
		}
		i.open = !i.open;
	}
}
function a(e = document) {
	if (t.has(e)) return;
	let n = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("[data-tp-drawer-action]");
		n !== null && i(n);
	};
	e.addEventListener("click", n), t.set(e, n);
}
function o(e = document) {
	let n = t.get(e);
	n !== void 0 && (e.removeEventListener("click", n), t.delete(e));
}
//#endregion
export { a as setupTpDrawerTriggers, o as teardownTpDrawerTriggers };

//# sourceMappingURL=drawer-triggers.js.map