//#region src/utilities/references.ts
var e = "[data-tp-reference-output], tp-tooltip", t = 0;
function n(e) {
	return e.closest("[data-tp-reference-scope], .tp-markdown-output, .tp-asciidoc-output, .tp-restructuredtext-output, article, main") ?? e.ownerDocument.body ?? e;
}
function r(e) {
	if (!e.id) {
		let n;
		do
			n = `tp-reference-${++t}`;
		while (e.ownerDocument.getElementById(n));
		e.id = n;
	}
	return e.id;
}
function i(e) {
	for (let t of [
		"title",
		"label",
		"caption",
		"figcaption"
	]) {
		let n = e.getAttribute(t)?.trim();
		if (n) return n;
	}
	return e.querySelector(":scope > caption, :scope > figcaption")?.textContent?.trim() || e.getAttribute("ref")?.trim() || "";
}
function a(e, t) {
	return Array.from(e.querySelectorAll(t)).filter((t) => !t.closest("[data-tp-reference-output], tp-tooltip") && n(t) === e);
}
var o = /* @__PURE__ */ new WeakMap();
function s(e, t) {
	let r = n(e), i = o.get(r);
	if (!i) {
		let e = /* @__PURE__ */ new Set(), t = new MutationObserver((t) => {
			if (t.some((e) => {
				let t = e.target instanceof Element ? e.target : e.target.parentElement;
				return t && !t.closest("[data-tp-reference-output], tp-tooltip");
			})) for (let t of e) t();
		});
		t.observe(r, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0
		}), i = {
			observer: t,
			listeners: e
		}, o.set(r, i);
	}
	return i.listeners.add(t), () => {
		i.listeners.delete(t), i.listeners.size || (i.observer.disconnect(), o.delete(r));
	};
}
function c(e) {
	let t = e.ownerDocument.createElement("template");
	t.innerHTML = e.innerHTML;
	for (let e of t.content.querySelectorAll("script")) e.remove();
	for (let e of t.content.querySelectorAll("[id], [ref]")) e.removeAttribute("id"), e.removeAttribute("ref");
	return t.content;
}
function l(e) {
	let t = a(e, "tp-note[ref]"), n = new Set(t.map((e) => e.getAttribute("ref")).filter((e) => !!e)), r = /* @__PURE__ */ new Map();
	for (let t of a(e, "tp-ref[href^=\"^\"]")) {
		if (t.closest("tp-note, tp-biblio, tp-glossary")) continue;
		let e = t.getAttribute("href")?.slice(1) ?? "";
		n.has(e) && !r.has(e) && r.set(e, r.size + 1);
	}
	for (let e of n) r.has(e) || r.set(e, r.size + 1);
	return r;
}
//#endregion
export { l as noteNumbers, s as observeReferences, c as referenceContent, a as referenceElements, r as referenceId, i as referenceLabel, e as referenceOutput, n as referenceScope };

