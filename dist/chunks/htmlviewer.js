import { lt as e } from "./lib/typescript/typescript.js";
//#region ../tp-markdown/dist/markdown/renderers/htmlviewer.js
var t = "Copy HTML code", n = "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"9\" y=\"9\" width=\"10\" height=\"10\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\" />\n  <path\n    d=\"M7 15H6C4.89543 15 4 14.1046 4 13V6C4 4.89543 4.89543 4 6 4H13C14.1046 4 15 4.89543 15 6V7\"\n    stroke=\"currentColor\"\n    stroke-linecap=\"round\"\n    stroke-width=\"2\"\n  />\n</svg>", r = new e({ attributes: { pageNav: { enabled: !1 } } }), i = {
	id: "htmlviewer",
	async render(e, t = {}) {
		for (let n of e.querySelectorAll("[data-htmlviewer=\"true\"]")) n instanceof HTMLElement && await a(n, t);
	}
};
async function a(e, i) {
	if (e.dataset.htmlviewerRendered === "true") return;
	e.dataset.htmlviewerRendered = "true";
	let a = C(e), l = p(a), g = e.hasAttribute("data-allow-script"), _ = l[0] ?? {
		label: "Example",
		source: a
	}, v = document.createElement("div");
	v.className = "tp-htmlviewer-grid";
	let y = document.createElement("div");
	y.className = "tp-htmlviewer-panel tp-htmlviewer-panel-code";
	let b = document.createElement("div");
	b.className = "tp-htmlviewer-controls tp-htmlviewer-controls-start";
	let x = o();
	b.append(u("View", x));
	let S = l.length > 1 ? c(l) : null;
	S !== null && b.append(u("Example", S));
	let E = document.createElement("div");
	E.className = "tp-htmlviewer-toolbar";
	let D = document.createElement("button");
	D.type = "button", D.className = "tp-htmlviewer-copy-btn", D.setAttribute("aria-label", t), D.title = t, D.innerHTML = n, D.addEventListener("click", async () => {
		D.dataset.state = "idle";
		try {
			await navigator.clipboard.writeText(_.source), D.dataset.state = "success", D.title = "Copied!";
		} catch {
			D.dataset.state = "error", D.title = "Copy failed";
		}
		window.setTimeout(() => {
			D.dataset.state = "idle", D.title = t;
		}, 1200);
	}), E.append(D);
	let O = document.createElement("div");
	O.className = "tp-htmlviewer-source-output";
	let k = document.createElement("pre");
	k.className = "tp-htmlviewer-code";
	let A = document.createElement("code");
	A.className = "language-html", k.append(A), O.append(E, k), y.append(b, O);
	let j = document.createElement("div");
	j.className = "tp-htmlviewer-panel tp-htmlviewer-panel-preview";
	let M = document.createElement("div");
	M.className = "tp-htmlviewer-controls tp-htmlviewer-controls-end";
	let N = s();
	M.append(u("Output", N));
	let P = document.createElement("div");
	P.className = "tp-htmlviewer-output", j.append(M, P), v.append(y, j), e.replaceChildren(v);
	let F = () => {
		v.dataset.htmlviewerLayout = d(x.value);
	}, I = async () => {
		A.textContent = _.source, A.removeAttribute("data-highlight-rendered"), A.removeAttribute("data-highlighted"), await r.renderRuntime(O, { only: ["highlight"] });
	}, L = async () => {
		if (f(N.value) === "render") {
			let e = document.createElement("iframe");
			e.className = "tp-htmlviewer-frame", e.title = "HTML preview", e.setAttribute("sandbox", g ? "allow-scripts allow-same-origin" : ""), w(e, _.source, g, i), T(e), P.replaceChildren(e);
			return;
		}
		let e = await h(_.source, g, i);
		P.replaceChildren(m(e, "xml")), await r.renderRuntime(P, { only: ["highlight"] });
	}, R = async () => {
		F(), await I(), await L();
	};
	x.addEventListener("change", F), N.addEventListener("change", () => {
		L();
	}), S !== null && S.addEventListener("change", () => {
		let e = l.find((e) => e.label === S.value);
		e !== void 0 && (_ = e, R());
	}), F(), await R();
}
function o() {
	let e = document.createElement("select");
	return e.className = "tp-htmlviewer-layout", e.setAttribute("aria-label", "Layout"), e.append(l("both", "Both")), e.append(l("source", "Input only")), e.append(l("output", "Output only")), e;
}
function s() {
	let e = document.createElement("select");
	return e.className = "tp-htmlviewer-mode", e.setAttribute("aria-label", "Output mode"), e.append(l("render", "Rendered HTML")), e.append(l("dom", "DOM tree")), e;
}
function c(e) {
	let t = document.createElement("select");
	t.className = "tp-htmlviewer-example", t.setAttribute("aria-label", "Example");
	for (let n of e) t.append(l(n.label, n.label));
	return t;
}
function l(e, t) {
	let n = document.createElement("option");
	return n.value = e, n.textContent = t, n;
}
function u(e, t) {
	let n = document.createElement("label"), r = document.createElement("span");
	return r.textContent = e, n.append(r, t), n;
}
function d(e) {
	return e === "source" || e === "output" ? e : "both";
}
function f(e) {
	return e === "dom" ? e : "render";
}
function p(e) {
	let t = document.createElement("div");
	t.innerHTML = e;
	let n = Array.from(t.querySelectorAll("div[role=\"example\"]")).map((e, t) => ({
		label: e.getAttribute("label")?.trim() || `Example ${t + 1}`,
		source: r(e.innerHTML)
	}));
	if (n.length > 0) return n;
	function r(e) {
		let t = e.replace(/\r\n?/g, "\n").replace(/^\n+|\n+$/g, "");
		if (t.length === 0) return "";
		let n = t.split("\n"), r = n.filter((e) => e.trim().length > 0), i = r.filter((e) => /^[\t ]*</.test(e)), a = (i.length > 0 ? i : r).reduce((e, t) => {
			let n = t.match(/^[\t ]*/)?.[0].length ?? 0;
			return Math.min(e, n);
		}, Infinity);
		return !Number.isFinite(a) || a <= 0 ? t : n.map((e) => {
			let t = e.match(/^[\t ]*/)?.[0].length ?? 0;
			return t <= 0 ? e : e.slice(Math.min(t, a));
		}).join("\n");
	}
	return [{
		label: "Example",
		source: e
	}];
}
function m(e, t) {
	let n = document.createElement("pre"), r = document.createElement("code");
	return r.className = `language-${t}`, r.textContent = e, n.append(r), n;
}
async function h(e, t, n) {
	let r = document.createElement("iframe");
	r.style.position = "fixed", r.style.left = "0", r.style.top = "0", r.style.inlineSize = "1px", r.style.blockSize = "1px", r.style.opacity = "0", r.style.pointerEvents = "none", r.style.border = "0", r.style.zIndex = "-1", r.setAttribute("aria-hidden", "true"), r.setAttribute("sandbox", t ? "allow-scripts allow-same-origin" : ""), document.body.append(r);
	let i = ["#document-fragment"];
	try {
		let a = x(r);
		w(r, e, t, n), await a, await b(r), await S(r);
		let o = r.contentDocument;
		if (!o || !o.body) return i.join("\n");
		let s = Array.from(o.body.childNodes).filter((e) => !_(e));
		for (let [e, t] of s.entries()) g(t, "", e === s.length - 1, i);
	} finally {
		r.remove();
	}
	return i.join("\n");
}
function g(e, t, n, r) {
	let i = n ? "└─ " : "├─ ", a = t + (n ? "   " : "│  ");
	if (e.nodeType === Node.TEXT_NODE) {
		let n = v(e.textContent ?? "");
		n !== "" && r.push(`${t}${i}#text "${y(n, 120)}"`);
		return;
	}
	if (e.nodeType === Node.COMMENT_NODE) {
		let n = v(e.textContent ?? "");
		r.push(`${t}${i}<!-- ${y(n, 120)} -->`);
		return;
	}
	if (e.nodeType !== Node.ELEMENT_NODE) {
		r.push(`${t}${i}#node(type=${e.nodeType})`);
		return;
	}
	let o = e, s = Array.from(o.attributes).map((e) => `${e.name}="${e.value}"`).join(" "), c = s === "" ? `<${o.tagName.toLowerCase()}>` : `<${o.tagName.toLowerCase()} ${s}>`;
	r.push(`${t}${i}${c}`);
	let l = Array.from(o.childNodes).filter((e) => !_(e));
	if (o.shadowRoot) {
		let e = Array.from(o.shadowRoot.childNodes).filter((e) => !_(e)), t = l.length === 0;
		r.push(`${a}${t ? "└─ " : "├─ "}#shadow-root (open)`);
		let n = a + (t ? "   " : "│  ");
		for (let [t, i] of e.entries()) g(i, n, t === e.length - 1, r);
	}
	for (let [e, t] of l.entries()) g(t, a, e === l.length - 1, r);
}
function _(e) {
	return e.nodeType === Node.TEXT_NODE && v(e.textContent ?? "") === "";
}
function v(e) {
	return e.replace(/\s+/g, " ").trim();
}
function y(e, t) {
	return e.length <= t ? e : `${e.slice(0, t - 1)}…`;
}
async function b(e, t = 3e3) {
	let n = e.contentDocument, r = e.contentWindow;
	if (!n || !r) return;
	let i = /* @__PURE__ */ new Set();
	for (let e of Array.from(n.querySelectorAll("*"))) {
		let t = e.tagName.toLowerCase();
		t.includes("-") && i.add(t);
	}
	if (i.size === 0) return;
	let a = Array.from(i).map((e) => r.customElements.whenDefined(e));
	await Promise.race([Promise.allSettled(a), new Promise((e) => setTimeout(e, t))]);
}
async function x(e, t = 3e3) {
	await new Promise((n) => {
		let r = !1, i = 0, a = () => {
			r || (r = !0, e.removeEventListener("load", o), e.removeEventListener("error", s), window.clearTimeout(i), n());
		}, o = () => a(), s = () => a();
		i = window.setTimeout(a, t), e.addEventListener("load", o), e.addEventListener("error", s);
	});
}
async function S(e, t = 120, n = 2500) {
	let r = e.contentDocument;
	!r || !r.body || await new Promise((e) => {
		let i = !1, a = 0, o = 0, s = new MutationObserver(() => l()), c = () => {
			i || (i = !0, s.disconnect(), window.clearTimeout(a), window.clearTimeout(o), e());
		}, l = () => {
			window.clearTimeout(a), a = window.setTimeout(c, t);
		};
		s.observe(r.body, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0
		}), l(), o = window.setTimeout(c, n);
	});
}
function C(e) {
	let t = e.querySelector(".tp-htmlviewer-source");
	return t instanceof HTMLTemplateElement ? P(t.innerHTML) : "";
}
function w(e, t, n, r) {
	e.srcdoc = j(t, n, r);
}
function T(e) {
	let t = 0, n = -1, r = () => {
		let t = e.contentDocument;
		if (!t || !t.body) return 0;
		let n = t.body, r = Math.ceil(n.getBoundingClientRect().height), i = Math.ceil(n.scrollHeight);
		return Math.max(0, Math.min(Math.max(r, i), i));
	}, i = () => {
		t = 0;
		let i = r();
		Math.abs(i - n) <= 1 || (n = i, e.style.height = `${i}px`);
	}, a = () => {
		t ||= requestAnimationFrame(i);
	};
	e.addEventListener("load", async () => {
		try {
			await b(e);
		} catch (e) {
			console.warn("[htmlviewer] waitForCustomElementsInIframe failed", e);
		}
		let t = e.contentDocument;
		!t || !t.body || (new MutationObserver(a).observe(t.body, {
			subtree: !0,
			childList: !0,
			characterData: !0
		}), a(), setTimeout(a, 50));
	});
}
function E(e) {
	if (O()) return k(e);
	let t = e;
	return t = t.replace(/(["'])\/components\//g, "$1/dist/components/"), t = t.replace(/(["'])\.\/components\//g, "$1/dist/components/"), t;
}
function D(e) {
	return e.replaceAll("/dist/components/", "/components/");
}
function O() {
	return document.querySelector("script[src*=\"/@vite/client\"]") !== null;
}
function k(e) {
	let t = e;
	return t = t.replace(/(["'])\/components\//g, "$1/src/components/"), t = t.replace(/(["'])\.\/components\//g, "$1/src/components/"), t = t.replace(/\/src\/components\/([^"'\s?#]+)\.js/g, "/src/components/$1.ts"), t;
}
function A(e, t) {
	return e;
}
function j(e, t, n) {
	let r = e.trim(), i = M(n), a = /<html[\s>]/i.test(r), o = /<head[\s>]/i.test(r), s = /<body[\s>]/i.test(r), c = /^<!doctype\s+html[\s>]/i.test(r) || a || o || s, l = (e) => /^<!doctype\s+html[\s>]/i.test(e) ? e : `<!doctype html>\n${e}`, u = (e) => /<head[\s>]/i.test(e) ? e : /<html[\s>]/i.test(e) ? e.replace(/<html([^>]*)>/i, "<html$1>\n<head></head>") : /<body[\s>]/i.test(e) ? e.replace(/<body([^>]*)>/i, "<head></head>\n<body$1>") : `<head></head>\n${e}`, d = (e) => e, f = (e) => /<meta[^>]+name=["']viewport["'][^>]*>/i.test(e) ? e : e.replace(/<head([^>]*)>/i, "<head$1>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />"), p = (e) => /<meta[^>]+charset=["'][^"']+["'][^>]*>/i.test(e) ? e : e.replace(/<head([^>]*)>/i, "<head$1>\n<meta charset=\"utf-8\" />"), m = (e) => /<style[^>]*data-tp-htmlviewer-reset[^>]*>/i.test(e) ? e : e.replace(/<head([^>]*)>/i, "<head$1>\n<style data-tp-htmlviewer-reset>\n  html, body { margin: 0; padding: 0; }\n  body { padding: 0.75rem; box-sizing: border-box; }\n</style>");
	if (c) {
		let e = r;
		return e = l(e), e = u(e), e = A(e, t), e = p(e), e = d(e), e = f(e), e = m(e), e = D(e), e = E(e), /<\/html>\s*$/i.test(e) || (e += "\n</html>"), e;
	}
	return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <base href="${I(i)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style data-tp-htmlviewer-reset>
      html, body { margin: 0; padding: 0; }
      body { padding: 0.75rem; box-sizing: border-box; }
    </style>
  </head>
  <body>
${E(D(e))}
  </body>
</html>`;
}
function M(e) {
	let t = N(e.path, e.includeBaseUrl);
	if (t !== null) return t;
	let n = window.location?.origin;
	return !n || n === "null" ? "/" : `${n}/`;
}
function N(e, t) {
	if (typeof e != "string" || e.trim() === "") return null;
	let n = e.trim().startsWith("/") ? e.trim() : `/${e.trim()}`;
	try {
		if (typeof t == "string" && t.trim() !== "") {
			let e = t.endsWith("/") ? t : `${t}/`;
			return new URL(n.replace(/^\//, ""), e).href;
		}
		let e = window.location?.origin;
		return !e || e === "null" ? null : new URL(n, `${e}/`).href;
	} catch {
		return null;
	}
}
function P(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
function F(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function I(e) {
	return F(e).replaceAll("\n", "&#10;").replaceAll("\r", "&#13;");
}
//#endregion
export { i as default };

//# sourceMappingURL=htmlviewer.js.map