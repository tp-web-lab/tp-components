import "../../chunks/lib/typescript/typescript.js";
//#region src/components/copy-code/setup-tp-copy-code-buttons.ts
function e(e) {
	return e.querySelector(":scope > tp-copy-code[data-tp-copy-code-generated]") !== null;
}
function t(t, n = {}) {
	if (e(t)) return null;
	let r = document.createElement("tp-copy-code");
	return r.setAttribute("data-tp-copy-code-generated", ""), n.icon !== void 0 && n.icon !== "" && r.setAttribute("icon", n.icon), n.successIcon !== void 0 && n.successIcon !== "" && r.setAttribute("success-icon", n.successIcon), n.errorIcon !== void 0 && n.errorIcon !== "" && r.setAttribute("error-icon", n.errorIcon), n.copiedText !== void 0 && n.copiedText !== "" && r.setAttribute("copied-text", n.copiedText), r.forElement = t, t.append(r), r;
}
function n(e = {}) {
	let n = e.selector ?? "tp-code-editor, tp-html", r = Array.from(document.querySelectorAll(n)), i = [];
	for (let n of r) {
		let r = t(n, e);
		r !== null && i.push(r);
	}
	return i;
}
function r(e = {}) {
	let t = e.selector ?? "tp-code-editor, tp-html", n = document.querySelectorAll(t);
	for (let e of n) {
		let t = e.querySelectorAll(":scope > tp-copy-code[data-tp-copy-code-generated]");
		for (let e of t) e.remove();
	}
}
//#endregion
export { t as attachTpCopyCodeButton, n as setupTpCopyCodeButtons, r as teardownTpCopyCodeButtons };

//# sourceMappingURL=setup-tp-copy-code-buttons.js.map