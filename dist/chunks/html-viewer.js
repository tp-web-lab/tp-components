import { dedent as e } from "../utilities/code.js";
import { getComponentSourceBaseUrl as t, resolveComponentSourceUrl as n } from "../utilities/source-url.js";
import "./object-tree.js";
import { formatHtmlForDisplay as r } from "../utilities/html-code.js";
import { t as i } from "./markup-viewer.js";
//#region src/components/html-viewer/html-viewer.css?inline
var a = ".tp-html-viewer-output pre{border-radius:.5rem;max-width:100%;margin:0;overflow:auto}", o = "tp-html-viewer-styles", s = [{
	value: "render",
	label: "Rendered HTML"
}, {
	value: "dom",
	label: "DOM tree"
}], c = "<!-- Added by tp-html-viewer to load custom tp-* elements in the visualisation panel. -->", l = `${c}
<script type="module">
  import '/tp-loader.js';
<\/script>`, u = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
function d(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function f(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
var p = /* @__PURE__ */ new Set([
	"data-tp-color-scope",
	"data-tp-toc-scope",
	"data-tp-reference-scope"
]), m = /* @__PURE__ */ new Set([
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone"
]);
function h(e) {
	return e === "data-source" || e === "data-tp-base-host" || e.startsWith("data-tp-") && !p.has(e);
}
function g(e) {
	return !e.localName.startsWith("tp-") && Array.from(e.attributes).some((e) => e.name.startsWith("data-tp-") && !p.has(e.name));
}
function _(e) {
	if (e.classList.contains("tp-color-option") || e.classList.contains("tp-color-swatch") || e.classList.contains("tp-theme-option") || e.classList.contains("tp-theme-option-icon") || e.classList.contains("tp-dir-option") || e.classList.contains("tp-dir-option-icon") || e.classList.contains("tp-lang-option") || e.classList.contains("tp-lang-option-icon")) return !0;
	if (e.tagName.toLowerCase() === "ul") {
		let t = Array.from(e.children);
		return t.length > 0 && t.every((e) => e.classList.contains("tp-color-option") || e.classList.contains("tp-theme-option") || e.classList.contains("tp-dir-option") || e.classList.contains("tp-lang-option"));
	}
	return e.tagName.toLowerCase() === "tp-dropdown" ? e.querySelector(".tp-color-option") !== null || e.querySelector(".tp-theme-option") !== null || e.querySelector(".tp-dir-option") !== null || e.querySelector(".tp-lang-option") !== null : !1;
}
function v(e, t) {
	let n = [];
	for (let r of t.split(";")) {
		let t = r.trim();
		if (t === "") continue;
		let i = t.indexOf(":");
		if (i === -1) {
			n.push(t);
			continue;
		}
		let a = t.slice(0, i).trim(), o = t.slice(i + 1).trim();
		if (e.localName === "tp-center") {
			let t = e.getAttribute("max-inline-size"), n = e.getAttribute("padding-inline");
			if (a === "max-inline-size" && t === o || a === "text-align" && e.hasAttribute("center-text") && o === "center" || (a === "padding-inline-start" || a === "padding-inline-end") && n === o) continue;
		}
		if (e.localName === "tp-cluster") {
			let t = e.getAttribute("justify") ?? "flex-start", n = e.getAttribute("align") ?? "center", r = e.getAttribute("gap") ?? "var(--tp-cluster-gap, 1rem)";
			if (a === "justify-content" && o === t || a === "align-items" && o === n || a === "gap" && o === r) continue;
		}
		n.push(t);
	}
	return n.join("; ");
}
function y(e) {
	return e.split(/\s+/).map((e) => e.trim()).filter((e) => e !== "").filter((e) => e !== "tp-light" && e !== "tp-dark" && !m.has(e)).join(" ");
}
function b(e, t) {
	if (t.name !== "id") return !1;
	if (e.localName === "dt") {
		let n = t.value.match(/^(.*)-summary-(\d+)$/);
		return n !== null && e.getAttribute("role") === "button" && e.getAttribute("aria-controls") === `${n[1] ?? ""}-content-${n[2] ?? ""}`;
	}
	if (e.localName === "dd") {
		let n = t.value.match(/^(.*)-content-(\d+)$/);
		return n !== null && e.getAttribute("role") === "region" && e.getAttribute("aria-labelledby") === `${n[1] ?? ""}-summary-${n[2] ?? ""}`;
	}
	return !1;
}
function x(e, t) {
	let n = e.tagName.toLowerCase();
	if (e.closest("tp-accordion") !== null) {
		if (n === "dt") return t.name === "role" || t.name === "tabindex" || t.name === "aria-expanded" || t.name === "aria-controls" || t.name === "data-index" || b(e, t);
		if (n === "dd") return t.name === "role" || t.name === "aria-labelledby" || t.name === "hidden" || t.name === "data-index" || b(e, t);
	}
	return e.closest("tp-dropdown[data-source]") !== null && n !== "tp-dropdown" ? t.name === "role" || t.name === "tabindex" || t.name === "aria-haspopup" || t.name === "aria-expanded" : n === "tp-dropdown" ? t.name === "style" || t.name === "data-open" || t.name === "placement" && t.value === "bottom" || t.name === "offset" && t.value === "8px" : e.closest("tp-dropdown") === null ? !!(n === "tp-color" && (t.name === "id" && /^tp-color-[a-z0-9]+$/i.test(t.value) || t.name === "preset" && t.value === "tp-default")) : t.name === "tabindex" || t.name === "aria-haspopup" || t.name === "aria-expanded";
}
function S(e) {
	if (e.nodeType === Node.TEXT_NODE) return f(e.textContent ?? "");
	if (!(e instanceof Element)) return "";
	let t = e.getAttribute("data-source");
	if (t !== null && t !== "") return C(t);
	if (g(e) || _(e)) return "";
	let n = e.tagName.toLowerCase(), r = [n, ...Array.from(e.attributes).filter((e) => !h(e.name)).filter((t) => !x(e, t)).flatMap((t) => {
		let n = t.name === "style" ? v(e, t.value) : t.name === "class" ? y(t.value) : t.value;
		return (t.name === "style" || t.name === "class") && n === "" ? [] : [n === "" ? t.name : `${t.name}="${d(n)}"`];
	})].join(" ");
	return u.has(n) ? `<${r}>` : n === "tp-color" || n === "tp-theme" || n === "tp-dir" || n === "tp-lang" ? `<${r}></${n}>` : n === "script" || n === "style" ? `<${r}>${e.textContent ?? ""}</${n}>` : `<${r}>${Array.from(e.childNodes).map((e) => S(e)).join("")}</${n}>`;
}
function C(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, Array.from(t.content.childNodes).map((e) => S(e)).join("").trim();
}
function w(e) {
	return e.replace(/\s+/g, " ").trim();
}
function T(e) {
	if (e.nodeType === Node.TEXT_NODE) {
		let t = w(e.textContent ?? "");
		return t === "" ? null : {
			nodeName: "#text",
			value: t
		};
	}
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let t = e, n = Object.fromEntries(Array.from(t.attributes, (e) => [e.name, e.value])), r = Array.from(t.childNodes).map(T).filter((e) => e !== null);
	return {
		nodeName: t.tagName.toLowerCase(),
		...Object.keys(n).length > 0 ? { attributes: n } : {},
		...r.length > 0 ? { children: r } : {}
	};
}
function E(e) {
	let t = new DOMParser().parseFromString(e, "text/html");
	return {
		nodeName: "#document-fragment",
		children: Array.from(t.body.childNodes).map(T).filter((e) => e !== null)
	};
}
function D() {
	return document.querySelector("script[src*=\"/@vite/client\"]") !== null || new URL(import.meta.url).pathname.includes("/src/");
}
function O(e) {
	return e.replaceAll("/dist/components/", "/components/").replaceAll("/dist/tp-loader.js", "/tp-loader.js");
}
function k(e) {
	let t = e;
	return t = t.replace(/(["'])\/components\//g, "$1/src/components/"), t = t.replace(/(["'])\.\/components\//g, "$1/src/components/"), t = t.replace(/(["'])components\//g, "$1/src/components/"), t = t.replace(/\/src\/components\/([^"'\s?#]+)\.js/g, "/src/components/$1.ts"), t = t.replace(/(["'])\/tp-loader\.js/g, "$1/src/tp-loader.ts"), t = t.replace(/(["'])\.\/tp-loader\.js/g, "$1/src/tp-loader.ts"), t = t.replace(/(["'])tp-loader\.js/g, "$1/src/tp-loader.ts"), t;
}
function A(e) {
	let t = new URL(import.meta.url), n = t.pathname.includes("/chunks/") && !t.pathname.includes("/src/chunks/") ? new URL("../", t) : t.pathname.includes("/components/") && !t.pathname.includes("/src/components/") ? new URL("../../", t) : new URL("./dist/", j() ?? window.location.href);
	return new URL(e, n).href;
}
function j() {
	let e = [document.baseURI, window.location.href];
	for (let t of e) if (M(t)) return t;
	try {
		if (window.parent !== window && M(window.parent.document.baseURI)) return window.parent.document.baseURI;
	} catch {}
	return null;
}
function M(e) {
	if (e == null || e === "") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:" || t.protocol === "file:";
	} catch {
		return !1;
	}
}
function N(e) {
	if (D()) return k(e);
	let t = e, n = A("components/"), r = A("tp-loader.js");
	return t = t.replace(/(["'])\/components\//g, `$1${n}`), t = t.replace(/(["'])\.\/components\//g, `$1${n}`), t = t.replace(/(["'])components\//g, `$1${n}`), t = t.replace(/(["'])\/tp-loader\.js/g, `$1${r}`), t = t.replace(/(["'])\.\/tp-loader\.js/g, `$1${r}`), t = t.replace(/(["'])tp-loader\.js/g, `$1${r}`), t;
}
function P(e) {
	return /<tp-[a-z0-9-]+(?:\s|>|\/)/i.test(e);
}
function F(e) {
	return /(?:import\s*\(?\s*["'][^"']*tp-loader\.(?:js|ts)["']|<script\b[^>]+src=["'][^"']*tp-loader\.(?:js|ts)["'])/i.test(e);
}
function I(e) {
	return !P(e) || F(e) ? e : `${e.trimEnd()}


${l}`;
}
function L(e) {
	return r(e).replace(c, `\n${c}`);
}
function R(e) {
	let t = e.textContent?.trim() ?? "";
	return t !== "" && /^(?:import\s+["']\/?components\/[a-z0-9-]+\/[a-z0-9-]+\.js["'];?\s*)+$/i.test(t);
}
function z(e) {
	if (!P(e) || F(e)) return e;
	let t = document.createElement("template");
	t.innerHTML = e;
	let n = Array.from(t.content.querySelectorAll("script[type=\"module\"]")).filter(R);
	if (n.length === 0) return I(e);
	let r = document.createElement("template");
	r.innerHTML = l, n[0]?.replaceWith(r.content.cloneNode(!0));
	for (let e of n.slice(1)) e.remove();
	return t.innerHTML.trim();
}
function B(e) {
	return e === null ? "" : `    <base href="${d(e)}" />\n`;
}
function V(e) {
	let t = e.pathname.endsWith("/") ? e.pathname : e.pathname.slice(0, e.pathname.lastIndexOf("/") + 1);
	return new URL(`${t}${e.search}`, e.origin).href;
}
function H(e, t) {
	if (t === null || /<base[\s>]/i.test(e)) return e;
	let n = B(t);
	return /<head[\s>]/i.test(e) ? e.replace(/<head([^>]*)>/i, `<head$1>\n${n}`) : /<html[\s>]/i.test(e) ? e.replace(/<html([^>]*)>/i, `<html$1>\n  <head>\n${n}  </head>`) : e;
}
function U(e) {
	let n = j();
	if (n === null) return null;
	try {
		return V(new URL(t(e), n));
	} catch {
		return null;
	}
}
function W(e, t, n = !0) {
	let r = N(O(n ? I(e) : e)), i = r.trim(), a = /<html[\s>]/i.test(i), o = /^<!doctype\s+html[\s>]/i.test(i), s = `<style data-tp-viewer-spacing>html > body { margin: 0; padding: 0.5rem; box-sizing: border-box; }</style>${n ? "<style data-tp-viewer-pending-components>:not(:defined):not(mjx-container):not(mjx-container *) { display: none !important; }</style>" : ""}`;
	if (o || a) {
		let e = H(i, t);
		return /<head[\s>]/i.test(e) ? e.replace(/<head([^>]*)>/i, `<head$1>\n${s}`) : /<html[\s>]/i.test(e) ? e.replace(/<html([^>]*)>/i, `<html$1><head>${s}</head>`) : e.replace(/^(<!doctype[^>]*>)/i, `$1\n${s}`);
	}
	return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${s}
${B(t)}
  </head>
  <body>
${r}
  </body>
</html>`;
}
function G(e, t, n = !0) {
	let r = new DOMParser().parseFromString(e, "text/html").body, i = Array.from(r.querySelectorAll("div[role=\"example\"]")).map((e, r) => ({
		label: e.getAttribute("label")?.trim() || `Example ${String(r + 1)}`,
		source: n ? z(C(e.innerHTML)) : C(e.innerHTML),
		context: t
	}));
	return i.length > 0 ? i : [{
		label: "Example",
		source: n ? z(C(e)) : C(e),
		context: t
	}];
}
var K = class extends i {
	static get observedAttributes() {
		return [
			...i.observedAttributes,
			"allow-script",
			"no-loader"
		];
	}
	sourceLanguage = "html";
	outputModes = s;
	viewerClassName = "tp-html-viewer";
	deferInitialRender = !0;
	overrideSource = null;
	overrideResetSource = null;
	initialInlineExample = null;
	setSource(e, t = null, n = e) {
		this.overrideSource = {
			source: e,
			baseHref: t
		}, this.overrideResetSource = n, this.removeAttribute("src"), this.requestViewerRender();
	}
	connectedCallback() {
		this.initialInlineExample === null && this.overrideSource === null && this.src.trim() === "" && (this.initialInlineExample = this.readInlineSource()), super.connectedCallback(), this.ensureGlobalStyle(o, a);
	}
	async loadExamples() {
		let { source: e, baseHref: t } = await this.readSource();
		return G(e, { baseHref: t }, !this.hasAttribute("no-loader")).map((e) => ({
			...e,
			source: this.hasAttribute("preserve-source") ? e.source : L(e.source)
		}));
	}
	getResetSource(e) {
		return this.overrideResetSource ?? e.source;
	}
	readInlineSource() {
		let t = this.querySelector(":scope > script:is([type=\"tp/html\"], [type=\"tp/html-viewer\"])"), n = this.querySelector(":scope > template");
		return {
			label: "Example",
			source: t instanceof HTMLScriptElement && t.textContent !== null ? e(t.textContent) : n instanceof HTMLTemplateElement ? e(n.innerHTML) : e(this.innerHTML),
			context: { baseHref: U(this) }
		};
	}
	createExternalContext(e) {
		return { baseHref: V(e) };
	}
	async renderOutput(e, t, n, r) {
		if (t === "dom") {
			let t = document.createElement("tp-object-tree");
			t.setValue(E(e)), n.replaceChildren(t);
			return;
		}
		if (e.trim() === "") {
			n.replaceChildren();
			return;
		}
		let i = document.createElement("iframe");
		i.className = "tp-html-viewer-frame", i.title = "HTML preview", this.hasAttribute("allow-script") && (i.allow = "autoplay"), i.srcdoc = W(e, r.baseHref, !this.hasAttribute("no-loader")), n.replaceChildren(i);
	}
	async readSource() {
		if (this.overrideSource !== null) return this.overrideSource;
		let e = this.src.trim();
		if (e !== "") {
			let t = n(this, e), r = await fetch(t.href, { cache: "no-store" });
			if (!r.ok) throw Error(`Unable to load HTML file: ${t.pathname} (${String(r.status)})`);
			return {
				source: await r.text(),
				baseHref: V(t)
			};
		}
		let t = this.initialInlineExample ?? this.readInlineSource();
		return {
			source: t.source,
			baseHref: t.context.baseHref
		};
	}
};
customElements.get("tp-html-viewer") || customElements.define("tp-html-viewer", K);
//#endregion
export { W as n, K as t };

//# sourceMappingURL=html-viewer.js.map