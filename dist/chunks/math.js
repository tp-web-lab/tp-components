import { r as e } from "./rolldown-runtime.js";
//#region ../tp-markdown/dist/markdown/renderers/math.js
var t = /* @__PURE__ */ e({ default: () => r }), n = {
	loader: { load: [
		"input/tex",
		"input/asciimath",
		"output/svg"
	] },
	tex: { packages: { "[+]": [] } },
	svg: {
		fontCache: "local",
		postFilters: [({ math: e, data: t }) => {
			e.start?.node?.parentElement?.closest(".stemblock, [data-mathjax-display=\"true\"]") && (e.display = !0, t.setAttribute("display", "true"));
		}]
	},
	asciimath: { delimiters: [["`", "`"], ["\\$", "\\$"]] },
	startup: { typeset: !1 },
	options: { enableSpeech: !1 }
}, r = {
	id: "math",
	async render(e, t = {}) {
		i(e) && await a(t) && (await s(e), await c(e));
	}
};
function i(e) {
	return e.querySelector("[data-mathjax-tex]") !== null || e.querySelector("[data-mathjax-asciimath]") !== null;
}
async function a(e = {}) {
	if (typeof window.MathJax?.tex2svgPromise == "function") return await window.MathJax.startup?.promise, o(), !0;
	window.MathJax = u(n, e.options ?? {});
	try {
		await l("tp-mathjax-script", "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js"), await window.MathJax.startup?.promise;
	} catch (e) {
		return console.warn(e instanceof Error ? e.message : "Failed to load MathJax."), !1;
	}
	return typeof window.MathJax?.tex2svgPromise == "function" ? (o(), !0) : (console.warn("MathJax tex2svgPromise is not available."), !1);
}
function o() {
	let e = Symbol.for("@tp/mathjax-ready");
	Reflect.has(globalThis, e) || (Reflect.set(globalThis, e, !0), console.info(`[tp-mathjax] MathJax ${window.MathJax?.version ?? "4"} loaded (SVG).`));
}
async function s(e) {
	let t = window.MathJax;
	if (typeof t?.tex2svgPromise == "function") for (let n of e.querySelectorAll("[data-mathjax-tex]")) {
		if (!(n instanceof HTMLElement) || n.dataset.mathjaxRendered === "true") continue;
		let e = n.getAttribute("data-mathjax-tex") ?? "", r = n.getAttribute("data-mathjax-display") === "true";
		if (e.trim() === "") continue;
		let i = await t.tex2svgPromise(e, { display: r });
		n.replaceChildren(i), n.dataset.mathjaxRendered = "true";
	}
}
async function c(e) {
	let t = window.MathJax;
	if (typeof t?.typesetPromise != "function") return;
	let n = [];
	for (let t of e.querySelectorAll("[data-mathjax-asciimath]")) {
		if (!(t instanceof HTMLElement) || t.dataset.mathjaxRendered === "true") continue;
		let e = t.getAttribute("data-mathjax-asciimath") ?? "";
		e.trim() !== "" && (t.textContent = `\`${e}\``, t.dataset.mathjaxRendered = "true", n.push(t));
	}
	n.length > 0 && await t.typesetPromise(n);
}
function l(e, t) {
	let n = document.getElementById(e);
	return n instanceof HTMLScriptElement ? window.MathJax?.startup?.promise ? window.MathJax.startup.promise.then(() => void 0) : new Promise((e, r) => {
		n.addEventListener("load", () => e(), { once: !0 }), n.addEventListener("error", () => r(/* @__PURE__ */ Error(`Failed to load script: ${t}`)), { once: !0 });
	}) : new Promise((n, r) => {
		let i = document.createElement("script");
		i.id = e, i.src = t, i.defer = !0, i.addEventListener("load", () => n(), { once: !0 }), i.addEventListener("error", () => r(/* @__PURE__ */ Error(`Failed to load script: ${t}`)), { once: !0 }), document.head.append(i);
	});
}
function u(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		n[e] = d(t) && d(r) ? u(t, r) : r;
	}
	return n;
}
function d(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
//#endregion
export { r as n, t };

//# sourceMappingURL=math.js.map