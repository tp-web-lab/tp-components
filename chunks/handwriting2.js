//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/handwriting.js
var e = {
	id: "handwriting",
	async render(e, r = {}) {
		await o(r);
		for (let n of e.querySelectorAll(".tp-md-handwriting")) n instanceof HTMLElement && await t(n, r);
		for (let t of e.querySelectorAll(".tp-md-handwriting-block")) t instanceof HTMLElement && await n(t, r);
	}
};
async function t(e, t) {
	if (e.dataset.handwritingRendered === "true") return;
	e.dataset.handwritingRendered = "true";
	let n = i(t, r(e));
	await o(n), e.textContent = e.dataset.handwritingText ?? "", e.classList.add("tp-md-handwriting-rendered"), (n.paper ?? "none") === "ruled" && e.classList.add("tp-md-handwriting-paper-ruled"), s(e, n);
}
async function n(e, t) {
	if (e.dataset.handwritingRendered === "true") return;
	e.dataset.handwritingRendered = "true";
	let n = i(t, r(e));
	await o(n);
	let a = e.querySelector(".tp-md-handwriting-source"), c = e.querySelector(".tp-md-handwriting-output");
	c instanceof HTMLElement && (c.textContent = a instanceof HTMLElement ? a.textContent ?? "" : "", c.classList.add("tp-md-handwriting-rendered"), (n.paper ?? "none") === "ruled" && c.classList.add("tp-md-handwriting-paper-ruled"), s(c, n));
}
function r(e) {
	return {
		font: e.dataset.handwritingFont,
		fontUrl: e.dataset.handwritingFontUrl,
		lineHeight: c(e.dataset.handwritingLineHeight),
		paper: l(e.dataset.handwritingPaper)
	};
}
function i(e, t) {
	return {
		...e,
		...a(t)
	};
}
function a(e) {
	let t = {};
	return e.font !== void 0 && (t.font = e.font), e.fontUrl !== void 0 && (t.fontUrl = e.fontUrl), e.lineHeight !== void 0 && (t.lineHeight = e.lineHeight), e.paper !== void 0 && (t.paper = e.paper), t;
}
async function o(e) {
	let t = e.fontUrl ?? "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap";
	t.trim() !== "" && await u(`tp-md-handwriting-font-${d(t)}`, t);
}
function s(e, t) {
	let n = t.font ?? "Caveat", r = t.lineHeight ?? 1.8;
	e.style.fontFamily = `"${n}", cursive`, e.style.lineHeight = String(r), e.style.setProperty("--tp-md-handwriting-line-height", String(r));
}
function c(e) {
	if (e === void 0) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function l(e) {
	if (e === "none" || e === "ruled") return e;
}
function u(e, t) {
	return document.getElementById(e) instanceof HTMLLinkElement ? Promise.resolve() : new Promise((n, r) => {
		let i = document.createElement("link");
		i.id = e, i.rel = "stylesheet", i.href = t, i.addEventListener("load", () => n(), { once: !0 }), i.addEventListener("error", () => r(/* @__PURE__ */ Error(`Failed to load stylesheet: ${t}`)), { once: !0 }), document.head.append(i);
	});
}
function d(e) {
	let t = 0;
	for (let n = 0; n < e.length; n += 1) t = Math.imul(31, t) + e.charCodeAt(n);
	return Math.abs(t).toString(36);
}
//#endregion
export { e as default };

