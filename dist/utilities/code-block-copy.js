//#region src/utilities/code-block-copy.ts
var e = /* @__PURE__ */ new WeakSet();
async function t(e) {
	if (!e.isConnected || !e.querySelector(":scope > code") || e.closest(".cm-editor, [contenteditable=\"true\"]") || (await import("../components/copy-code/copy-code.js"), !e.isConnected)) return;
	let t = e.querySelector(":scope > code");
	if (!t) return;
	for (let n of e.ownerDocument.querySelectorAll("tp-copy-code:not([data-tp-code-block-copy])")) {
		let r = n.getAttribute("for");
		if (n.forElement === e || n.forElement === t || r && (r === e.id || r === t.id)) return;
	}
	let n = e.querySelector(":scope > tp-copy-code");
	if (n) {
		n.hasAttribute("data-tp-code-block-copy") && (n.forElement = t);
		return;
	}
	let r = e.ownerDocument.createElement("tp-copy-code");
	r.setAttribute("data-tp-code-block-copy", ""), r.forElement = t, e.classList.add("tp-code-block-copy"), e.append(r), r.setAttribute("aria-label", "Copy code");
}
function n(e) {
	if (!(e instanceof Element || e instanceof Document)) return;
	let n = e instanceof Element ? e.closest("pre") : null;
	n && t(n);
	for (let n of e.querySelectorAll("pre")) t(n);
}
function r(t) {
	e.has(t) || (e.add(t), new MutationObserver((e) => {
		for (let t of e) for (let e of t.addedNodes) n(e);
	}).observe(t, {
		childList: !0,
		subtree: !0
	}), n(t));
}
//#endregion
export { r as ensureCodeBlockCopyButtons };

//# sourceMappingURL=code-block-copy.js.map