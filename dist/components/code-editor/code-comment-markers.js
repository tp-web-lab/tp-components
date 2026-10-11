import "../../chunks/tooltip.js";
import { G as e, H as t, K as n, O as r } from "../../chunks/dist.js";
//#region src/components/code-editor/code-comment-markers.ts
var i = 0, a = /* @__PURE__ */ new WeakMap();
function o(e, t) {
	let n = e.ownerDocument.createElement("div");
	for (let t of e.childNodes) n.append(t.cloneNode(!0));
	for (let e of n.querySelectorAll("[data-code-comment-number], script")) e.remove();
	let r = /* @__PURE__ */ new Map();
	for (let e of n.querySelectorAll("[id]")) {
		let n = e.id;
		e.id = `${t}-${r.size}`, r.set(n, e.id);
	}
	for (let e of n.querySelectorAll("*")) for (let t of Array.from(e.attributes)) {
		let n = t.value;
		for (let [e, i] of r) n = n.replaceAll(`url(#${e})`, `url(#${i})`), (t.name === "href" || t.name === "xlink:href") && n === `#${e}` && (n = `#${i}`), ["aria-labelledby", "aria-describedby"].includes(t.name) && (n = n.split(/\s+/).map((t) => t === e ? i : t).join(" "));
		n !== t.value && e.setAttribute(t.name, n);
	}
	return n;
}
function s(e, t) {
	let n = [];
	return r(e).iterate({ enter(r) {
		if (!/comment/i.test(r.name)) return;
		let i = e.sliceDoc(r.from, r.to);
		for (let e of i.matchAll(/<([1-9]\d?)>/g)) {
			let i = Number(e[1]);
			t.has(i) && n.push({
				from: r.from + e.index,
				to: r.from + e.index + e[0].length,
				number: i
			});
		}
		return !1;
	} }), n;
}
var c = class extends n {
	number;
	source;
	constructor(e, t) {
		super(), this.number = e, this.source = t;
	}
	eq(e) {
		return e.number === this.number && e.source === this.source;
	}
	toDOM(e) {
		let t = e.dom.ownerDocument.createElement("span");
		t.className = "tp-code-comment-marker", t.setAttribute("role", "img"), t.setAttribute("aria-label", `Comment ${this.number}`);
		let n = e.dom.ownerDocument.createElement("tp-icon");
		n.setAttribute("library", "numbers"), n.setAttribute("name", String(this.number)), n.setAttribute("size", "1.25em"), n.setAttribute("aria-hidden", "true"), t.append(n);
		let r = this.source;
		if (r) {
			t.id = `tp-code-comment-anchor-${++i}`, t.tabIndex = 0, t.setAttribute("contenteditable", "false");
			let e = t.ownerDocument.createElement("tp-tooltip");
			e.setAttribute("anchor", `#${t.id}`), e.setAttribute("data-tp-code-comment-tooltip", "");
			let n = () => e.replaceChildren(o(r, `${t.id}-content`));
			n();
			let s = new MutationObserver(n);
			s.observe(r, {
				childList: !0,
				subtree: !0,
				characterData: !0,
				attributes: !0
			}), a.set(t, () => {
				s.disconnect(), e.remove();
			}), queueMicrotask(() => {
				t.isConnected && a.has(t) && t.ownerDocument.body.append(e);
			});
		}
		return t;
	}
	destroy(e) {
		a.get(e)?.(), a.delete(e);
	}
};
function l(n, i = /* @__PURE__ */ new Map()) {
	let a = (e) => t.set(s(e.state, n).map((e) => t.replace({ widget: new c(e.number, i.get(e.number)) }).range(e.from, e.to)), !0);
	return e.fromClass(class {
		decorations;
		constructor(e) {
			this.decorations = a(e);
		}
		update(e) {
			(e.docChanged || e.viewportChanged || r(e.startState) !== r(e.state)) && (this.decorations = a(e.view));
		}
	}, { decorations: (e) => e.decorations });
}
//#endregion
export { l as codeCommentMarkers, s as findCodeCommentMarkers };

//# sourceMappingURL=code-comment-markers.js.map