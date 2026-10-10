import { mr as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/animation/animation-triggers.ts
var t = /* @__PURE__ */ new WeakMap();
function n(e) {
	return e === "play-in" || e === "play-out" || e === "pause" || e === "cancel" || e === "restart";
}
function r(t, n = document) {
	let r = t.getAttribute("data-tp-animation-target");
	if (r === null || r.trim() === "") return null;
	let i = t.getRootNode(), a = i instanceof ShadowRoot || i instanceof Document ? i.querySelector(r) : null;
	if (a instanceof e) return a;
	let o = n instanceof Document || n instanceof ShadowRoot ? n.querySelector(r) : null;
	if (o instanceof e) return o;
	let s = document.querySelector(r);
	return s instanceof e ? s : null;
}
function i(e, t = document) {
	let i = e.getAttribute("data-tp-animation-action");
	if (i === null || !n(i)) return;
	let a = r(e, t);
	if (a !== null) {
		if (i === "play-in") {
			a.playIn();
			return;
		}
		if (i === "play-out") {
			a.playOut();
			return;
		}
		if (i === "pause") {
			a.pause();
			return;
		}
		if (i === "cancel") {
			a.cancel();
			return;
		}
		a.restart();
	}
}
function a(e = document) {
	if (t.has(e)) return;
	let n = (t) => {
		let n = t.target;
		if (!(n instanceof Element)) return;
		let r = n.closest("[data-tp-animation-action]");
		r !== null && i(r, e);
	};
	e.addEventListener("click", n), t.set(e, n);
}
function o(e = document) {
	let n = t.get(e);
	n !== void 0 && (e.removeEventListener("click", n), t.delete(e));
}
//#endregion
export { a as setupTpAnimationTriggers, o as teardownTpAnimationTriggers };

//# sourceMappingURL=animation-triggers.js.map