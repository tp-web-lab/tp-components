import { Fr as e, Y as t, dr as n, et as r, it as i, qu as a, rt as o, td as s } from "./lib/typescript/typescript.js";
import { loadUsedTpComponents as c } from "../tp-loader.js";
import { A as l, B as u, C as d, D as f, E as p, F as m, H as h, I as g, L as _, M as v, N as y, O as b, P as x, R as S, S as C, T as w, U as T, V as E, _ as D, b as O, c as k, d as A, f as j, g as M, h as N, j as P, k as F, l as ee, m as te, p as ne, s as re, u as ie, v as ae, w as oe, x as se, y as ce, z as le } from "./lib/vendor/vendor.js";
import "./color.js";
import "./checkbox-list.js";
import "./emoji-picker.js";
import "./icon-picker.js";
import "./symbol-picker.js";
//#region src/components/prose-editor/prose-editor.css?inline
var ue = "tp-prose-editor{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface,Canvas);color:var(--tp-color-text,CanvasText);display:block;overflow:hidden}tp-prose-editor[readonly]{background:var(--tp-color-surface-muted,color-mix(in srgb, Canvas 94%, CanvasText))}tp-prose-editor>tp-toolbar[data-tp-prose-editor-toolbar],tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{z-index:auto;border-block-end:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));--tp-toolbar-padding:.375rem;--tp-toolbar-size:auto;--tp-icon-button-size:2rem;flex-wrap:wrap;position:static;overflow-x:auto}tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{padding-block:.25rem}tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar][hidden]{display:none}tp-prose-editor tp-dropdown[data-tp-prose-editor-emoji-picker-dropdown],tp-prose-editor tp-dropdown[data-tp-prose-editor-icon-picker-dropdown],tp-prose-editor tp-dropdown[data-tp-prose-editor-symbol-picker-dropdown]{inline-size:min(30rem,100vw - 2rem);max-inline-size:calc(100vw - 2rem);padding:.5rem}tp-prose-editor tp-dropdown[data-tp-prose-editor-emoji-picker-dropdown]>tp-emoji-picker,tp-prose-editor tp-dropdown[data-tp-prose-editor-icon-picker-dropdown]>tp-icon-picker,tp-prose-editor tp-dropdown[data-tp-prose-editor-symbol-picker-dropdown]>tp-symbol-picker{box-sizing:border-box;inline-size:100%}tp-prose-editor[readonly]>tp-toolbar[data-tp-prose-editor-toolbar],tp-prose-editor[readonly]>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{display:none}tp-prose-editor tp-icon-button[aria-pressed=true]>button{background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 14%, transparent));color:var(--tp-color-accent,Highlight)}tp-prose-editor [data-tp-prose-editor-separator]{background:color-mix(in srgb, CanvasText 22%, Canvas);align-self:stretch;inline-size:1px;margin-inline:.125rem}tp-prose-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-prose-editor>tp-toolbar>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-prose-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start-color:color-mix(in srgb, CanvasText 22%, Canvas)}tp-prose-editor [data-tp-prose-editor-search-control]{align-items:center;display:inline-flex;position:relative}tp-prose-editor [data-tp-prose-editor-search-control][hidden]{display:none}tp-prose-editor [data-tp-prose-editor-search-input]{box-sizing:border-box;border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-surface,Canvas);block-size:1.75rem;inline-size:min(14rem,42vw);min-inline-size:7rem;color:inherit;font:inherit;padding-inline:.5rem 1.875rem;font-size:.8125rem;line-height:1}tp-prose-editor [data-tp-prose-editor-search-clear]{z-index:1;--tp-icon-button-size:1.5rem;--tp-icon-button-icon-size:.875rem;position:absolute;inset-block-start:50%;inset-inline-end:.125rem;transform:translateY(-50%)}tp-prose-editor [data-tp-prose-editor-search-input]:focus-visible{outline:2px solid var(--tp-color-focus,Highlight);outline-offset:2px}tp-prose-editor .tp-prose-editor-math-inline{vertical-align:middle;display:inline-block}tp-prose-editor .tp-prose-editor-math-block{text-align:center;margin-block:1rem;display:block;overflow-x:auto}tp-prose-editor .tp-prose-editor-math-inline svg,tp-prose-editor .tp-prose-editor-math-block svg,tp-prose-editor .tp-prose-editor-math-inline mjx-container>svg,tp-prose-editor .tp-prose-editor-math-block mjx-container>svg{max-width:none;max-inline-size:none;display:inline-block}tp-prose-editor [data-tp-prose-editor-file-menu],tp-prose-editor [data-tp-prose-editor-menu]{box-sizing:border-box;border:0;border-radius:0;max-block-size:min(24rem,100vh - 4rem);inline-size:max-content;min-inline-size:10rem;max-inline-size:calc(100vw - 2rem);overflow:auto}tp-prose-editor tp-dropdown[data-tp-prose-editor-type-dropdown],tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type]{overflow:visible!important}tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type]{max-block-size:none}tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type] ul[data-tp-menu-submenu]{z-index:10002}tp-prose-editor [data-tp-prose-editor-table-menu]{box-sizing:border-box;border:0;border-radius:0;inline-size:max-content;min-inline-size:10rem;max-inline-size:calc(100vw - 2rem);overflow:visible}tp-prose-editor [data-tp-prose-editor-table-menu] ul,tp-prose-editor [data-tp-prose-editor-table-menu] li{margin:0;padding-inline-start:0;list-style:none}tp-prose-editor tp-menu li[aria-disabled=true]{opacity:.5;cursor:default}tp-prose-editor [data-tp-prose-editor-menu-label]{grid-template-columns:1.25rem max-content;align-items:center;gap:.45rem;display:inline-grid}tp-prose-editor [data-tp-prose-editor-menu-label]>tp-icon{place-items:center;font-size:1.125rem;display:inline-grid}tp-prose-editor tp-menu li[aria-expanded=true]>ul[data-tp-prose-editor-horizontal-submenu]{align-items:center;gap:.125rem;display:flex}tp-prose-editor tp-menu ul[data-tp-prose-editor-horizontal-submenu]>li[role=menuitem]{text-align:center;place-items:center;min-inline-size:2rem;padding:.35rem;display:grid}tp-prose-editor [data-table-picker]{position:relative}tp-prose-editor tp-menu li[aria-expanded=true]>ul[data-tp-prose-editor-table-picker-submenu]{display:block}tp-prose-editor ul[data-tp-prose-editor-table-picker-submenu],tp-prose-editor ul[data-tp-prose-editor-table-picker-submenu]>li{margin:0;padding:0;list-style:none}tp-prose-editor [data-table-picker-content][role=menuitem]{cursor:default}tp-prose-editor [data-table-picker-content][role=menuitem]:hover{color:inherit;background:0 0}tp-prose-editor [data-table-picker-content] [data-tp-prose-editor-table-picker]{gap:.375rem;padding:.25rem .5rem .5rem;display:grid}tp-prose-editor [data-tp-prose-editor-table-picker-size]{color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));text-align:center;font-size:.8125rem}tp-prose-editor [data-tp-prose-editor-table-picker-grid]{grid-template-columns:repeat(6,.75rem);gap:.1875rem;display:grid}tp-prose-editor [data-table-grid-cell]{appearance:none;box-sizing:border-box;block-size:.75rem;min-block-size:0;inline-size:.75rem;min-height:0;aspect-ratio:1;border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 22%, transparent));background:var(--tp-color-surface,Canvas);min-inline-size:0;color:inherit;cursor:pointer;border-radius:.125rem;padding:0;line-height:0}tp-prose-editor [data-table-grid-cell][data-selected]{border-color:var(--tp-color-accent,Highlight);background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 18%, transparent))}tp-prose-editor [data-table-grid-cell]:focus-visible{outline:2px solid var(--tp-color-focus,Highlight);outline-offset:2px}tp-prose-editor>[data-tp-prose-editor-surface],tp-prose-editor>[data-tp-prose-editor-html-rendered]{min-block-size:12rem}tp-prose-editor>[data-tp-prose-editor-html-rendered]{box-sizing:border-box;background:var(--tp-color-surface,Canvas);color:inherit;outline:none;padding:.875rem 1rem}tp-prose-editor>[data-tp-prose-editor-html-rendered][hidden]{display:none}tp-prose-editor>[data-tp-prose-editor-html-source]{box-sizing:border-box;resize:vertical;background:var(--tp-color-surface,Canvas);min-block-size:12rem;inline-size:100%;color:inherit;white-space:pre;tab-size:2;border:0;outline:none;padding:.875rem 1rem;font:.875rem/1.5 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;display:block}tp-prose-editor>[data-tp-prose-editor-html-source][hidden]{display:none}tp-prose-editor .ProseMirror{box-sizing:border-box;white-space:pre-wrap;overflow-wrap:break-word;outline:none;min-block-size:12rem;padding:.875rem 1rem;position:relative}tp-prose-editor .ProseMirror[data-tp-prose-editor-empty]:before{color:color-mix(in srgb, currentColor 45%, transparent);content:attr(data-placeholder);pointer-events:none;white-space:nowrap;position:absolute;inset-block-start:.875rem;inset-inline-start:1rem}tp-prose-editor .ProseMirror [data-tp-prose-editor-custom-element]{white-space:normal}tp-prose-editor .ProseMirror tp-icon{block-size:var(--tp-icon-size,1em);line-height:inherit;vertical-align:-.125em;display:inline-flex}tp-prose-editor .ProseMirror tp-icon>[data-tp-icon-container]{block-size:100%;min-block-size:0}tp-prose-editor .ProseMirror>:first-child{margin-block-start:0}tp-prose-editor .ProseMirror>:last-child{margin-block-end:0}tp-prose-editor .ProseMirror p,tp-prose-editor .ProseMirror blockquote,tp-prose-editor .ProseMirror ul,tp-prose-editor .ProseMirror ol{margin-block:0 .5rem}tp-prose-editor .ProseMirror ul,tp-prose-editor .ProseMirror ol{padding-inline-start:1.5rem}tp-prose-editor .ProseMirror hr{border:0;border-block-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));margin-block:1rem}:is(tp-prose-editor .ProseMirror figure:has(>img),tp-prose-editor .ProseMirror figure:has(>video),tp-prose-editor .ProseMirror figure:has(>audio)){background:0 0;max-inline-size:100%;margin:1rem 0;padding:0;display:inline-block}:is(tp-prose-editor .ProseMirror figure:has(>img)>img,tp-prose-editor .ProseMirror figure:has(>video)>video,tp-prose-editor .ProseMirror figure:has(>audio)>audio){max-inline-size:100%;display:block}:is(tp-prose-editor .ProseMirror figure:has(>img)>figcaption,tp-prose-editor .ProseMirror figure:has(>video)>figcaption,tp-prose-editor .ProseMirror figure:has(>audio)>figcaption){color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));text-align:center;margin-block-start:.375rem;font-size:.875rem;line-height:1.35}tp-prose-editor .ProseMirror audio{margin-block-end:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-audio-button]{align-items:center;display:inline-flex}tp-prose-editor .ProseMirror h1,tp-prose-editor .ProseMirror h2{margin-block:1rem .5rem;line-height:1.2}tp-prose-editor .ProseMirror h1{font-size:1.75rem}tp-prose-editor .ProseMirror h2{font-size:1.375rem}tp-prose-editor .ProseMirror blockquote{border-inline-start:.25rem solid var(--tp-color-border-strong,color-mix(in srgb, currentColor 32%, transparent));color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));margin-inline:0;padding-inline-start:1rem}tp-prose-editor .ProseMirror code{border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-code-background,color-mix(in srgb, currentColor 10%, transparent));padding:.08em .3em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;font-size:.9em}tp-prose-editor .ProseMirror [data-tp-prose-editor-code-block-editor]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));gap:.5rem;margin-block:1rem;padding:.5rem;display:grid}tp-prose-editor .ProseMirror [data-tp-prose-editor-code-block-toolbar]{white-space:normal;justify-content:flex-end;gap:.25rem;display:flex}tp-prose-editor [data-tp-prose-editor-code-menu]{--tp-menu-gap:0;box-sizing:border-box;white-space:normal;border:0;border-radius:0;max-block-size:min(20rem,100vh - 4rem);inline-size:max-content;min-inline-size:9rem;max-inline-size:calc(100vw - 2rem);margin:0;padding:0;overflow:auto}tp-prose-editor [data-tp-prose-editor-code-file-dropdown],tp-prose-editor [data-tp-prose-editor-code-language-dropdown]{--tp-dropdown-gap:0;--tp-dropdown-padding:0;white-space:normal;margin:0;padding:0}tp-prose-editor [data-tp-prose-editor-code-menu] ul{margin:0;padding:0;list-style:none}tp-prose-editor [data-tp-prose-editor-code-menu] li{margin:0;padding-block:0;padding-inline-start:0;list-style:none}tp-prose-editor [data-tp-prose-editor-code-menu]>ul[role=menu]{gap:0}tp-prose-editor [data-tp-prose-editor-code-menu]>ul[role=menu]>li[role=menuitem]{padding-block:0;padding-inline:.5rem}tp-prose-editor [data-tp-prose-editor-code-menu] li[data-selected]{font-weight:600}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-editor]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));gap:.75rem;margin-block:1rem;padding:.75rem;display:grid}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-header]{justify-content:flex-end;display:flex}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-surface,Canvas);display:inline-flex;overflow:hidden}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button{border-inline-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));color:inherit;--tp-icon-button-radius:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button:first-child{border-inline-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button[aria-pressed=true]>button{background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 14%, transparent));color:var(--tp-color-accent,Highlight)}tp-prose-editor .ProseMirror tp-code-editor[data-tp-prose-editor-markdown-source][hidden],tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview][hidden]{display:none}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]{border-block-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));white-space:normal;min-block-size:2rem;padding-block-start:.75rem}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-editor][data-view-mode=preview] [data-tp-prose-editor-markdown-preview]{border-block-start:0;padding-block-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]>:first-child{margin-block-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]>:last-child{margin-block-end:0}tp-prose-editor .ProseMirror table{border-collapse:collapse;table-layout:fixed;inline-size:100%;margin-block:1rem}tp-prose-editor .ProseMirror td,tp-prose-editor .ProseMirror th{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));vertical-align:top;min-inline-size:1rem;padding:.375rem .5rem;position:relative}tp-prose-editor .ProseMirror .selectedCell:after{z-index:2;pointer-events:none;content:\"\";background:color-mix(in srgb, Highlight 18%, transparent);position:absolute;inset:0}tp-prose-editor .ProseMirror .column-resize-handle{z-index:20;pointer-events:none;background:highlight;inline-size:4px;position:absolute;inset-block:0;inset-inline-end:-2px}tp-prose-editor .ProseMirror.resize-cursor{cursor:col-resize}tp-prose-editor .ProseMirror-search-match{background:color-mix(in srgb, Mark 65%, transparent)}tp-prose-editor .ProseMirror-active-search-match{background:color-mix(in srgb, Highlight 45%, transparent);outline:1px solid highlight}", de = C(w.spec.nodes, "paragraph block*", "block"), fe = "​", pe = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js", I = null, me = [
	"abc",
	"css",
	"html",
	"javascript",
	"json",
	"markdown",
	"prolog",
	"python",
	"sql",
	"text",
	"typescript",
	"yaml"
], L = ["tp-light", "tp-dark"], R = [
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
];
function z(e) {
	let t = typeof e == "string" && e.trim() !== "" ? e.trim().toLowerCase() : "html";
	return t === "plaintext" ? "text" : t;
}
function B(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return L.includes(t) ? t : null;
}
function V(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return R.includes(t) ? t : null;
}
function he(e, t) {
	for (let n of e) if (n !== null) {
		for (let e of t) if (n.classList.contains(e)) return e;
	}
	return null;
}
function ge(e) {
	return B(he(e, L));
}
function _e(e) {
	return V(he(e, R));
}
function H(e, t, n) {
	let r = B(t), i = V(n);
	e.classList.remove(...L, ...R), r !== null && e.classList.add(r), i !== null && e.classList.add(i);
}
function ve(e, t) {
	let n = [B(e), V(t)].filter((e) => e !== null);
	return n.length === 0 ? null : n.join(" ");
}
function ye(e) {
	return e.querySelector("tp-theme[data-tp-code-editor-theme]")?.getAttribute("mode") ?? null;
}
function be(e, t) {
	let n = e.querySelector("tp-theme[data-tp-code-editor-theme]");
	if (n === null) return;
	let r = B(t);
	r === "tp-dark" ? n.setAttribute("mode", "dark") : r === "tp-light" ? n.setAttribute("mode", "light") : n.setAttribute("mode", "auto");
}
function xe(e) {
	return /^(?:https?:|data:|blob:|\/|\.\/|\.\.\/)/.test(e.trim());
}
var Se = {
	...w.spec.nodes.get("code_block"),
	attrs: {
		language: { default: "html" },
		src: { default: null },
		theme: { default: null },
		color: { default: null }
	},
	parseDOM: [{
		tag: "pre",
		preserveWhitespace: "full",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("code"), n = Array.from(t?.classList ?? []).find((e) => e.startsWith("language-"));
			return {
				language: z(t?.getAttribute("data-language") ?? (n === void 0 ? null : n.slice(9))),
				src: e.getAttribute("data-src") ?? t?.getAttribute("data-src") ?? null,
				theme: ge([t, e]),
				color: _e([t, e])
			};
		}
	}],
	toDOM(e) {
		let t = z(e.attrs.language), n = typeof e.attrs.src == "string" && e.attrs.src.trim() !== "" ? e.attrs.src.trim() : null, r = {}, i = ve(e.attrs.theme, e.attrs.color);
		n !== null && (r["data-src"] = n), i !== null && (r.class = i);
		let a = [t === "html" ? null : `language-${t}`, i].filter((e) => e !== null).join(" "), o = {};
		return a !== "" && (o.class = a), t !== "html" && (o["data-language"] = t), [
			"pre",
			r,
			[
				"code",
				o,
				0
			]
		];
	}
};
function U(e, t) {
	return typeof e == "string" && e.split(/\s+/).includes(t);
}
var Ce = {
	parseDOM: [
		{ tag: "u" },
		{
			style: "text-decoration",
			getAttrs: (e) => U(e, "underline") ? null : !1
		},
		{
			style: "text-decoration-line",
			getAttrs: (e) => U(e, "underline") ? null : !1
		}
	],
	toDOM: () => ["u", 0]
}, we = {
	parseDOM: [
		{ tag: "s" },
		{ tag: "strike" },
		{ tag: "del" },
		{
			style: "text-decoration",
			getAttrs: (e) => U(e, "line-through") ? null : !1
		},
		{
			style: "text-decoration-line",
			getAttrs: (e) => U(e, "line-through") ? null : !1
		}
	],
	toDOM: () => ["s", 0]
}, Te = {
	excludes: "superscript",
	parseDOM: [{ tag: "sub" }],
	toDOM: () => ["sub", 0]
}, Ee = {
	excludes: "subscript",
	parseDOM: [{ tag: "sup" }],
	toDOM: () => ["sup", 0]
};
function W(e) {
	return e.getAttribute("src") ?? e.querySelector("source")?.getAttribute("src") ?? "";
}
function G(e, t) {
	let n = e.getAttribute(t);
	if (n !== null && n.trim() !== "") return n;
	let r = e.style.getPropertyValue(t);
	return r.trim() === "" ? null : r.trim();
}
function K(e, t, n) {
	typeof n != "string" || n.trim() === "" || (e[t] = n.trim());
}
function q(e, t) {
	let n = document.createElement("figure");
	if (n.append(e), typeof t == "string" && t.trim() !== "") {
		let e = document.createElement("figcaption");
		e.textContent = t, n.append(e);
	}
	return n;
}
var De = {
	attrs: {
		alt: { default: null },
		height: { default: null },
		src: {},
		title: { default: null },
		width: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("img[src]");
			return t instanceof HTMLElement && {
				alt: (e.querySelector("figcaption")?.textContent?.trim() ?? "") || t.getAttribute("alt"),
				height: G(t, "height"),
				src: t.getAttribute("src"),
				title: t.getAttribute("title"),
				width: G(t, "width")
			};
		}
	}, {
		tag: "img[src]",
		getAttrs(e) {
			return e instanceof HTMLElement && {
				alt: e.getAttribute("alt"),
				height: G(e, "height"),
				src: e.getAttribute("src"),
				title: e.getAttribute("title"),
				width: G(e, "width")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		typeof e.attrs.alt == "string" && (t.alt = e.attrs.alt), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), K(t, "width", e.attrs.width), K(t, "height", e.attrs.height);
		let n = document.createElement("img");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return q(n, e.attrs.alt);
	}
}, Oe = {
	attrs: {
		autoplay: { default: !1 },
		controls: { default: !0 },
		height: { default: null },
		poster: { default: null },
		caption: { default: null },
		src: {},
		title: { default: null },
		width: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("video");
			if (!(t instanceof HTMLElement)) return !1;
			let n = W(t);
			return n.trim() !== "" && {
				autoplay: t.hasAttribute("autoplay"),
				caption: e.querySelector("figcaption")?.textContent?.trim() ?? null,
				controls: t.hasAttribute("controls"),
				height: G(t, "height"),
				poster: t.getAttribute("poster"),
				src: n,
				title: t.getAttribute("title"),
				width: G(t, "width")
			};
		}
	}, {
		tag: "video",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = W(e);
			return t.trim() !== "" && {
				autoplay: e.hasAttribute("autoplay"),
				caption: null,
				controls: e.hasAttribute("controls"),
				height: G(e, "height"),
				poster: e.getAttribute("poster"),
				src: t,
				title: e.getAttribute("title"),
				width: G(e, "width")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		e.attrs.autoplay === !0 && (t.autoplay = ""), e.attrs.controls === !0 && (t.controls = ""), typeof e.attrs.poster == "string" && e.attrs.poster !== "" && (t.poster = e.attrs.poster), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), K(t, "width", e.attrs.width), K(t, "height", e.attrs.height);
		let n = document.createElement("video");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return q(n, e.attrs.caption);
	}
}, ke = {
	attrs: {
		autoplay: { default: !1 },
		caption: { default: null },
		controls: { default: !0 },
		src: {},
		title: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("audio");
			if (!(t instanceof HTMLElement)) return !1;
			let n = W(t);
			return n.trim() !== "" && {
				autoplay: t.hasAttribute("autoplay"),
				caption: e.querySelector("figcaption")?.textContent?.trim() ?? null,
				controls: t.hasAttribute("controls"),
				src: n,
				title: t.getAttribute("title")
			};
		}
	}, {
		tag: "audio",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = W(e);
			return t.trim() !== "" && {
				autoplay: e.hasAttribute("autoplay"),
				caption: null,
				controls: e.hasAttribute("controls"),
				src: t,
				title: e.getAttribute("title")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		e.attrs.autoplay === !0 && (t.autoplay = ""), e.attrs.controls === !0 && (t.controls = ""), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title);
		let n = document.createElement("audio");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return e.attrs.controls === !0 ? q(n, e.attrs.caption) : n;
	}
}, Ae = {
	attrs: { html: {} },
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	draggable: !1,
	parseDOM: [{
		tag: "*",
		priority: 10,
		getAttrs(e) {
			return !(e instanceof HTMLElement) || !e.localName.startsWith("tp-") ? !1 : { html: e.outerHTML };
		}
	}],
	toDOM(e) {
		let t = document.createElement("template");
		t.innerHTML = String(e.attrs.html);
		let n = t.content.firstElementChild;
		return n === null ? ["div", { "data-tp-prose-editor-custom-element": "" }] : n;
	}
}, je = {
	attrs: { html: {} },
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	parseDOM: [{
		tag: "tp-icon",
		priority: 60,
		getAttrs(e) {
			return e instanceof HTMLElement && { html: e.outerHTML };
		}
	}],
	toDOM(e) {
		let t = document.createElement("template");
		return t.innerHTML = String(e.attrs.html), t.content.firstElementChild ?? ["span"];
	}
}, Me = {
	attrs: {
		html: { default: "" },
		language: { default: "markdown" },
		markdown: { default: "" },
		view: { default: "both" }
	},
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	draggable: !1,
	parseDOM: [{
		tag: "[data-tp-prose-editor-markdown-block]",
		getAttrs(e) {
			return e instanceof HTMLElement && {
				html: e.innerHTML,
				language: e.getAttribute("data-language") ?? "markdown",
				markdown: e.getAttribute("data-markdown") ?? "",
				view: e.getAttribute("data-view") ?? "both"
			};
		}
	}],
	toDOM(e) {
		let t = document.createElement("div");
		return t.dataset.tpProseEditorMarkdownBlock = "", t.dataset.language = Ve(e.attrs.language), t.dataset.markdown = String(e.attrs.markdown), t.dataset.view = $(e.attrs.view), t.innerHTML = String(e.attrs.html), t;
	}
}, Ne = {
	attrs: { tex: { default: "" } },
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	parseDOM: [{
		tag: "[data-tp-prose-editor-math-inline]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? e.textContent ?? "" };
		}
	}, {
		tag: "[data-mathjax-tex][data-mathjax-display=\"false\"]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? "" };
		}
	}],
	toDOM(e) {
		return ["span", {
			class: "tp-prose-editor-math-inline",
			"data-mathjax-display": "false",
			"data-mathjax-tex": String(e.attrs.tex),
			"data-tp-prose-editor-math-inline": ""
		}];
	}
}, Pe = {
	attrs: { tex: { default: "" } },
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	parseDOM: [{
		tag: "[data-tp-prose-editor-math-block]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? e.textContent ?? "" };
		}
	}, {
		tag: "[data-mathjax-tex][data-mathjax-display=\"true\"]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? "" };
		}
	}],
	toDOM(e) {
		return ["div", {
			class: "tp-prose-editor-math-block",
			"data-mathjax-display": "true",
			"data-mathjax-tex": String(e.attrs.tex),
			"data-tp-prose-editor-math-block": ""
		}];
	}
}, Fe = {
	content: "(definition_term | definition_description)+",
	group: "block",
	parseDOM: [{ tag: "dl" }],
	toDOM: () => ["dl", 0]
}, Ie = {
	content: "inline*",
	defining: !0,
	parseDOM: [{ tag: "dt" }],
	toDOM: () => ["dt", 0]
}, Le = {
	content: "block+",
	defining: !0,
	parseDOM: [{ tag: "dd" }],
	toDOM: () => ["dd", 0]
}, J = M({
	tableGroup: "block",
	cellContent: "block+",
	cellAttributes: {}
});
J.table = {
	...J.table,
	attrs: { caption: { default: null } },
	parseDOM: [{
		tag: "table",
		getAttrs(e) {
			return e instanceof HTMLElement && { caption: e.querySelector(":scope > caption")?.textContent?.trim() ?? null };
		}
	}],
	toDOM(e) {
		let t = typeof e.attrs.caption == "string" ? e.attrs.caption.trim() : "";
		return t === "" ? ["table", ["tbody", 0]] : [
			"table",
			["caption", t],
			["tbody", 0]
		];
	}
};
var Re = class extends re {
	captionElement = null;
	constructor(e, t) {
		super(e, t), this.syncCaption(e);
	}
	update(e) {
		return e.type === this.node.type ? (this.node = e, D(e, this.colgroup, this.table, this.defaultCellMinWidth), this.syncCaption(e), !0) : !1;
	}
	syncCaption(e) {
		let t = typeof e.attrs.caption == "string" ? e.attrs.caption.trim() : "";
		if (t === "") {
			this.captionElement?.remove(), this.captionElement = null;
			return;
		}
		this.captionElement === null && (this.captionElement = document.createElement("caption"), this.table.insertBefore(this.captionElement, this.colgroup)), this.captionElement.textContent = t;
	}
}, Y = new h({
	nodes: de.update("code_block", Se).update("image", De).append(J).append({
		audio: ke,
		custom_element: Ae,
		definition_description: Le,
		definition_list: Fe,
		definition_term: Ie,
		math_block: Pe,
		math_inline: Ne,
		markdown_block: Me,
		tp_icon: je,
		video: Oe
	}),
	marks: w.spec.marks.append({
		underline: Ce,
		strikethrough: we,
		subscript: Te,
		superscript: Ee
	})
}), ze = "<script type=\"module\" src=\"./tp-loader.js\"><\/script>", Be = 1500;
function X(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Z(e) {
	let t = Y.nodes[e];
	if (t === void 0) throw Error(`Missing ProseMirror node type: ${e}`);
	return t;
}
function Q(e) {
	let t = Y.marks[e];
	if (t === void 0) throw Error(`Missing ProseMirror mark type: ${e}`);
	return t;
}
function Ve(e) {
	return e === "asciidoc" || e === "html" || e === "restructuredtext" ? e : "markdown";
}
function $(e) {
	return e === "source" || e === "preview" ? e : "both";
}
var He = class h extends a {
	static styleId = "tp-prose-editor-styles";
	static nextId = 0;
	editorView = null;
	fileButtonId = "";
	fileDropdownElement = null;
	formatButtonId = "";
	formatDropdownElement = null;
	htmlButtonId = "";
	htmlDropdownElement = null;
	htmlFileInputElement = null;
	htmlMode = !1;
	htmlRenderMode = !1;
	htmlRenderedElement = null;
	htmlSourceElement = null;
	secondaryToolbarElement = null;
	imageFileInputElement = null;
	listButtonId = "";
	listDropdownElement = null;
	markdownFileInputElement = null;
	mediaButtonId = "";
	mediaDropdownElement = null;
	audioFileInputElement = null;
	searchClearButtonElement = null;
	searchControlElement = null;
	searchInputElement = null;
	surfaceElement = null;
	tableDropdownElement = null;
	toolbarElement = null;
	emojiPickerDropdownElement = null;
	iconPickerDropdownElement = null;
	symbolPickerDropdownElement = null;
	tableButtonId = "";
	typeButtonId = "";
	typeDropdownElement = null;
	videoFileInputElement = null;
	selectedTableColumns = 3;
	selectedTableRows = 3;
	internalValueUpdate = !1;
	initialHTML = "";
	srcLoadToken = 0;
	static get observedAttributes() {
		return [
			...a.observedAttributes,
			"placeholder",
			"readonly",
			"src",
			"value"
		];
	}
	get value() {
		return this.getHTML();
	}
	set value(e) {
		this.setHTML(e);
	}
	get placeholder() {
		return this.getStringAttribute("placeholder", "Type your prose...");
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get readonly() {
		return this.getBooleanAttribute("readonly");
	}
	set readonly(e) {
		this.setBooleanAttribute("readonly", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(h.styleId, ue), this.editorView === null && (this.initialHTML = this.getAttribute("value") ?? this.innerHTML.trim(), this.render(), this.createEditor(this.initialHTML), this.src.trim() !== "" && this.loadSrcDocument());
	}
	disconnectedCallback() {
		this.editorView?.destroy(), this.editorView = null, this.fileDropdownElement = null, this.formatDropdownElement = null, this.htmlDropdownElement = null, this.htmlFileInputElement = null, this.htmlRenderedElement = null, this.htmlSourceElement = null, this.secondaryToolbarElement = null, this.listDropdownElement = null, this.markdownFileInputElement = null, this.mediaDropdownElement = null, this.emojiPickerDropdownElement = null, this.iconPickerDropdownElement = null, this.symbolPickerDropdownElement = null, this.searchClearButtonElement = null, this.searchControlElement = null, this.searchInputElement = null, this.surfaceElement = null, this.tableDropdownElement = null, this.toolbarElement = null, this.typeDropdownElement = null;
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) {
			if (e === "value" && !this.internalValueUpdate) {
				this.replaceDocument(n ?? "");
				return;
			}
			if (e === "readonly") {
				this.editorView?.setProps({ editable: () => !this.readonly });
				return;
			}
			if (e === "placeholder") {
				this.syncPlaceholder();
				return;
			}
			e === "src" && this.isConnected && this.loadSrcDocument();
		}
	}
	focus(e) {
		if (this.htmlRenderMode) {
			this.htmlRenderedElement?.focus(e);
			return;
		}
		if (e !== void 0) {
			this.editorView?.dom.focus(e);
			return;
		}
		this.editorView?.focus();
	}
	getHTML() {
		return this.htmlMode && this.htmlSourceElement !== null ? this.htmlSourceElement.value : this.htmlRenderMode && this.htmlRenderedElement !== null ? this.htmlRenderedElement.innerHTML : this.editorView === null ? this.getAttribute("value") ?? this.initialHTML : this.serializeDocument(this.editorView.state.doc);
	}
	setHTML(e) {
		this.replaceDocument(e), this.htmlSourceElement !== null && (this.htmlSourceElement.value = e), this.htmlRenderedElement !== null && (this.htmlRenderedElement.innerHTML = e), this.internalValueUpdate = !0, this.setStringAttribute("value", e), this.internalValueUpdate = !1;
	}
	insertTable(e = 3, t = 3) {
		if (this.editorView === null) return !1;
		let n = this.createTableNode(e, t);
		if (n === null) return !1;
		let r = this.editorView.state.tr.replaceSelectionWith(n).scrollIntoView();
		return this.editorView.dispatch(r), this.editorView.focus(), !0;
	}
	addTableRowAfter() {
		return this.runTableCommand(ee);
	}
	addTableColumnAfter() {
		return this.runTableCommand(k);
	}
	deleteTableRow() {
		return this.runTableCommand(j);
	}
	deleteTableColumn() {
		return this.runTableCommand(A);
	}
	deleteTable() {
		return this.runTableCommand(ne);
	}
	setSearchQuery(e, t = {}) {
		if (this.editorView === null) return;
		let n = new ae({
			...t,
			search: e
		}), r = O(this.editorView.state.tr, n);
		this.editorView.dispatch(r);
	}
	findNext(e) {
		return this.findSearchMatch(e, "next");
	}
	findPrevious(e) {
		return this.findSearchMatch(e, "previous");
	}
	render() {
		this.replaceChildren(), this.id.trim() === "" && (this.id = this.createToolbarId("root")), this.dataset.tpColorScope = "", this.dataset.tpThemeScope = "", this.fileButtonId === "" && (this.fileButtonId = this.createToolbarId("files")), this.typeButtonId === "" && (this.typeButtonId = this.createToolbarId("types")), this.formatButtonId === "" && (this.formatButtonId = this.createToolbarId("format")), this.listButtonId === "" && (this.listButtonId = this.createToolbarId("list")), this.tableButtonId === "" && (this.tableButtonId = this.createToolbarId("table")), this.mediaButtonId === "" && (this.mediaButtonId = this.createToolbarId("media")), this.htmlButtonId === "" && (this.htmlButtonId = this.createToolbarId("html"));
		let e = Array.from({ length: 6 }, (e, t) => Array.from({ length: 6 }, (e, n) => {
			let r = t + 1, i = n + 1;
			return `
          <button
            type="button"
            data-table-grid-cell
            data-table-rows="${String(r)}"
            data-table-columns="${String(i)}"
            aria-label="Insert ${String(r)} by ${String(i)} table"
          ></button>
        `;
		}).join("")).join(""), t = (e, t, n = "") => `
      <span data-tp-prose-editor-menu-label>
        <tp-icon${e === "" ? "" : ` name="${e}"`}${n === "" ? "" : ` library="${n}"`} aria-hidden="true"></tp-icon>
        <span>${t}</span>
      </span>
    `, n = (e, n, r = "", i = "") => `<li${r === "" ? "" : ` ${r}`}>${t(e, n, i)}</li>`, r = Array.from({ length: 6 }, (e, t) => t + 1).map((e) => `
        <li data-menu-command="format-header-${String(e)}" title="Heading ${String(e)}">
          <tp-icon name="format-header-${String(e)}" label="Heading ${String(e)}"></tp-icon>
        </li>
      `).join(""), i = document.createElement("tp-toolbar");
		i.dataset.tpProseEditorToolbar = "", i.setAttribute("placement", "top"), i.innerHTML = `
      <tp-icon-button section="start" id="${this.fileButtonId}" name="file" label="Files" data-command="files" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-file-dropdown anchor="#${this.fileButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-file-menu>
          <ul>
            ${n("file-download", "Load HTML", "data-file-action=\"load-html\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("file-import", "Import Markdown", "data-file-action=\"import-markdown\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("file-upload", "Save HTML", "data-file-action=\"save-html\"")}
            ${n("file-upload-as", "Save HTML as", "data-file-action=\"save-html-as\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <input section="start" type="file" accept=".html,.htm,text/html" data-tp-prose-editor-html-file hidden />
      <input section="start" type="file" accept=".md,.markdown,text/markdown,text/plain" data-tp-prose-editor-markdown-file hidden />
      <input section="start" type="file" accept="image/*" data-tp-prose-editor-image-file hidden />
      <input section="start" type="file" accept="video/*" data-tp-prose-editor-video-file hidden />
      <input section="start" type="file" accept="audio/*" data-tp-prose-editor-audio-file hidden />
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.typeButtonId}" name="format-title" label="Types" data-command="types" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-type-dropdown anchor="#${this.typeButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="type">
          <ul>
            ${n("paragraph", "Paragraph", "data-menu-command=\"format-text\"")}
            ${n("format-quote-open", "Blockquote", "data-menu-command=\"format-quote-open\"")}
            <li>${t("format-heading-hash", "Headings")}<ul data-tp-prose-editor-horizontal-submenu>${r}</ul></li>
            ${n("code-block", "Code block", "data-menu-command=\"format-code-block\"")}
            ${n("function-block", "Math block", "data-menu-command=\"insert-math-block\"")}
            <li>${t("text-block", "Markup block")}
              <ul>
                ${n("file_type_asciidoc", "AsciiDoc", "data-menu-command=\"insert-markup-asciidoc\"", "languages")}
                ${n("file_type_html", "HTML", "data-menu-command=\"insert-markup-html\"", "languages")}
                ${n("file_type_markdown", "Markdown", "data-menu-command=\"insert-markup-markdown\"", "languages")}
                ${n("file_type_restructuredtext", "reStructuredText", "data-menu-command=\"insert-markup-restructuredtext\"", "languages")}
              </ul>
            </li>
            ${n("horizontal-line", "Horizontal rule", "data-menu-command=\"insert-horizontal-rule\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.formatButtonId}" name="letter-f" label="Format" data-command="format" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-format-dropdown anchor="#${this.formatButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="format">
          <ul>
            ${n("format-bold", "Bold", "data-menu-command=\"format-bold\"")}
            ${n("format-italic", "Italic", "data-menu-command=\"format-italic\"")}
            ${n("format-underline", "Underline", "data-menu-command=\"format-underline\"")}
            ${n("format-strikethrough", "Strikethrough", "data-menu-command=\"format-strikethrough\"")}
            ${n("format-subscript", "Subscript", "data-menu-command=\"format-subscript\"")}
            ${n("format-superscript", "Superscript", "data-menu-command=\"format-superscript\"")}
            ${n("format-code", "Code", "data-menu-command=\"format-code\"")}
            ${n("function", "Math", "data-menu-command=\"format-math\"")}
            ${n("link", "Link", "data-menu-command=\"link\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.listButtonId}" name="list-down" label="List" data-command="list" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-list-dropdown anchor="#${this.listButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="list">
          <ul>
            ${n("format-list-bulleted", "Unordered list", "data-menu-command=\"format-list-bulleted\"")}
            ${n("format-list-numbered", "Ordered list", "data-menu-command=\"format-list-numbered\"")}
            ${n("format-list-text", "Definition list", "data-menu-command=\"format-list-text\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.tableButtonId}" name="table" label="Table" data-command="insert-table" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-table-dropdown anchor="#${this.tableButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-table-menu>
          <ul>
            <li data-table-picker>
              ${t("table-settings", "Insert table")}
              <ul data-tp-prose-editor-table-picker-submenu>
                <li data-table-picker-content>
                  <div data-tp-prose-editor-table-picker>
                    <output data-tp-prose-editor-table-picker-size>${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}</output>
                    <div data-tp-prose-editor-table-picker-grid role="grid" aria-label="Table size">
                      ${e}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            ${n("text-short", "Add caption", "data-table-action=\"add-caption\"")}
            ${n("table-row-plus-after", "Insert row", "data-table-action=\"add-row\"")}
            ${n("table-column-plus-after", "Insert column", "data-table-action=\"add-column\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("table-row-remove", "Delete row", "data-table-action=\"delete-row\"")}
            ${n("table-column-remove", "Delete column", "data-table-action=\"delete-column\"")}
            ${n("table-remove", "Delete table", "data-table-action=\"delete-table\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.mediaButtonId}" name="multimedia" label="Medias" data-command="media" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-media-dropdown anchor="#${this.mediaButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="media">
          <ul>
            ${n("image-plus", "Image", "data-menu-command=\"insert-image\"")}
            ${n("video-plus", "Video", "data-menu-command=\"insert-video\"")}
            ${n("music-note-plus", "Audio", "data-menu-command=\"insert-audio\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-emoji-picker-button" name="emoticon-happy-outline" label="Emoji" data-command="emoji-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-emoji-picker-dropdown anchor="#${this.id}-emoji-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-emoji-picker compact filter="face"></tp-emoji-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-icon-picker-button" name="shapes" label="Icon" data-command="icon-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-icon-picker-dropdown anchor="#${this.id}-icon-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-icon-picker compact copy="tp-icon"></tp-icon-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-symbol-picker-button" name="symbol" label="Symbol" data-command="symbol-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-symbol-picker-dropdown anchor="#${this.id}-symbol-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-symbol-picker compact></tp-symbol-picker>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="start" aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="select-all" label="Select all" data-command="select-all"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="format-clear"></tp-icon-button>
      <tp-icon-button section="center" id="${this.htmlButtonId}" name="language-html" label="HTML" data-command="html" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="center" data-tp-prose-editor-html-dropdown anchor="#${this.htmlButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="html">
          <ul>
            ${n("application-edit-outline", "Editor", "data-html-action=\"editor\"")}
            ${n("cellphone-screenshot", "Rendered HTML", "data-html-action=\"render\"")}
            ${n("code", "HTML code", "data-html-action=\"code\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="end" aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-prose-editor-search-control hidden>
        <input type="search" data-tp-prose-editor-search-input hidden aria-label="Search text" />
        <tp-icon-button name="close" size="xs" label="Clear search" data-tp-prose-editor-search-clear></tp-icon-button>
      </span>
      <tp-icon-button section="end" name="dots-vertical" label="More formatting tools" data-command="more" aria-pressed="false"></tp-icon-button>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}"></tp-theme>
    `;
		let a = document.createElement("tp-toolbar");
		a.dataset.tpProseEditorSecondaryToolbar = "", a.setAttribute("placement", "top"), a.hidden = !0, a.innerHTML = "\n      <tp-icon-button section=\"start\" name=\"paragraph\" label=\"Paragraph\" data-command=\"format-text\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-quote-open\" label=\"Blockquote\" data-command=\"format-quote-open\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-1\" label=\"Heading 1\" data-command=\"format-header-1\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-2\" label=\"Heading 2\" data-command=\"format-header-2\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-3\" label=\"Heading 3\" data-command=\"format-header-3\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"code-block\" label=\"Code block\" data-command=\"format-code-block\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"function-block\" label=\"Math block\" data-command=\"insert-math-block\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"text-block\" label=\"Markdown block\" data-command=\"insert-markup-markdown\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"horizontal-line\" label=\"Horizontal rule\" data-command=\"insert-horizontal-rule\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary=\"start\" aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"center\" name=\"format-list-bulleted\" label=\"Unordered list\" data-command=\"format-list-bulleted\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"format-list-numbered\" label=\"Ordered list\" data-command=\"format-list-numbered\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"format-list-text\" label=\"Definition list\" data-command=\"format-list-text\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"center\" name=\"image-plus\" label=\"Image\" data-command=\"insert-image\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"video-plus\" label=\"Video\" data-command=\"insert-video\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"music-note-plus\" label=\"Audio\" data-command=\"insert-audio\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary=\"end\" aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"end\" name=\"format-bold\" label=\"Bold\" data-command=\"format-bold\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-italic\" label=\"Italic\" data-command=\"format-italic\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-underline\" label=\"Underline\" data-command=\"format-underline\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-strikethrough\" label=\"Strikethrough\" data-command=\"format-strikethrough\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-subscript\" label=\"Subscript\" data-command=\"format-subscript\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-superscript\" label=\"Superscript\" data-command=\"format-superscript\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-code\" label=\"Code\" data-command=\"format-code\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"function\" label=\"Math\" data-command=\"format-math\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"link\" label=\"Link\" data-command=\"link\"></tp-icon-button>\n    ", i.addEventListener("mousedown", this.handleToolbarMouseDown), a.addEventListener("mousedown", this.handleToolbarMouseDown), i.addEventListener("click", this.handleToolbarClick), a.addEventListener("click", this.handleToolbarClick), i.addEventListener("tp-menu-item-select", this.handleMenuItemSelect), a.addEventListener("tp-menu-item-select", this.handleMenuItemSelect);
		let o = [...i.querySelectorAll("[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]"), ...a.querySelectorAll("[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]")];
		for (let e of o) e.addEventListener("keydown", this.handleGenericMenuKeydown);
		let s = i.querySelector("[data-tp-prose-editor-search-input]");
		s?.addEventListener("input", this.handleSearchInput), s?.addEventListener("keydown", this.handleSearchInputKeydown);
		let c = i.querySelector("[data-tp-prose-editor-search-control]"), l = i.querySelector("[data-tp-prose-editor-search-clear]");
		l?.addEventListener("click", this.handleSearchClearClick);
		let u = i.querySelector("[data-tp-prose-editor-file-dropdown]");
		u?.addEventListener("tp-dropdown-toggle", this.handleFileDropdownToggle);
		let d = i.querySelector("[data-tp-prose-editor-type-dropdown]");
		d?.addEventListener("tp-dropdown-toggle", this.handleTypeDropdownToggle);
		let f = i.querySelector("[data-tp-prose-editor-format-dropdown]");
		f?.addEventListener("tp-dropdown-toggle", this.handleFormatDropdownToggle);
		let p = i.querySelector("[data-tp-prose-editor-html-dropdown]");
		p?.addEventListener("tp-dropdown-toggle", this.handleHTMLDropdownToggle);
		let m = i.querySelector("[data-tp-prose-editor-list-dropdown]");
		m?.addEventListener("tp-dropdown-toggle", this.handleListDropdownToggle);
		let h = i.querySelector("[data-tp-prose-editor-table-dropdown]"), g = i.querySelector("[data-tp-prose-editor-table-menu]");
		g?.addEventListener("keydown", this.handleTableMenuKeydown), g?.addEventListener("pointerover", this.handleTablePickerPointerOver), g?.addEventListener("click", this.handleTablePickerClick, { capture: !0 }), h?.addEventListener("tp-dropdown-toggle", this.handleTableDropdownToggle);
		let _ = i.querySelector("[data-tp-prose-editor-media-dropdown]");
		_?.addEventListener("tp-dropdown-toggle", this.handleMediaDropdownToggle);
		let v = i.querySelector("[data-tp-prose-editor-emoji-picker-dropdown]"), y = i.querySelector("[data-tp-prose-editor-icon-picker-dropdown]"), b = i.querySelector("[data-tp-prose-editor-symbol-picker-dropdown]");
		v?.querySelector("tp-emoji-picker")?.addEventListener("tp-emoji-picker-select", this.handleEmojiPickerSelect), y?.querySelector("tp-icon-picker")?.addEventListener("tp-icon-picker-select", this.handleIconPickerSelect), b?.querySelector("tp-symbol-picker")?.addEventListener("tp-symbol-picker-select", this.handleSymbolPickerSelect);
		let x = i.querySelector("[data-tp-prose-editor-html-file]");
		x?.addEventListener("change", this.handleHtmlFileChange);
		let S = i.querySelector("[data-tp-prose-editor-markdown-file]");
		S?.addEventListener("change", this.handleMarkdownFileChange);
		let C = i.querySelector("[data-tp-prose-editor-image-file]");
		C?.addEventListener("change", this.handleImageFileChange);
		let w = i.querySelector("[data-tp-prose-editor-video-file]");
		w?.addEventListener("change", this.handleVideoFileChange);
		let T = i.querySelector("[data-tp-prose-editor-audio-file]");
		T?.addEventListener("change", this.handleAudioFileChange);
		let E = document.createElement("div");
		E.dataset.tpProseEditorSurface = "";
		let D = document.createElement("textarea");
		D.dataset.tpProseEditorHtmlSource = "", D.placeholder = this.placeholder, D.hidden = !0, D.spellcheck = !1, D.addEventListener("input", this.handleHtmlSourceInput);
		let O = document.createElement("div");
		O.dataset.tpProseEditorHtmlRendered = "", O.hidden = !0, O.tabIndex = -1, this.toolbarElement = i, this.fileDropdownElement = u, this.formatDropdownElement = f, this.htmlDropdownElement = p, this.htmlFileInputElement = x, this.imageFileInputElement = C, this.listDropdownElement = m, this.markdownFileInputElement = S, this.mediaDropdownElement = _, this.emojiPickerDropdownElement = v, this.iconPickerDropdownElement = y, this.symbolPickerDropdownElement = b, this.audioFileInputElement = T, this.searchClearButtonElement = l, this.searchControlElement = c, this.searchInputElement = s, this.secondaryToolbarElement = a, this.surfaceElement = E, this.tableDropdownElement = h, this.htmlRenderedElement = O, this.htmlSourceElement = D, this.typeDropdownElement = d, this.videoFileInputElement = w, this.append(i, a, E, D, O);
	}
	createToolbarId(e) {
		return h.nextId += 1, `tp-prose-editor-${e}-${String(h.nextId)}`;
	}
	createEditor(e) {
		if (this.surfaceElement === null) return;
		let t = new se(this.surfaceElement, {
			state: g.create({
				doc: this.parseHTML(e),
				plugins: [
					f(),
					ce(),
					ie({ View: Re }),
					N(),
					p({
						"Mod-b": y(Q("strong")),
						"Mod-i": y(Q("em")),
						"Mod-`": y(Q("code")),
						"Mod-z": F,
						"Mod-y": b,
						"Shift-Mod-z": b,
						Enter: P(this.exitDefinitionListPlaceholder, this.insertDefinitionPairAfterDescription, d(Z("list_item"))),
						Tab: te(1),
						"Shift-Tab": te(-1)
					}),
					p(l)
				]
			}),
			dispatchTransaction: (e) => {
				let n = t.state.apply(e);
				if (this.requiresTrailingEditableBlock(n.doc.lastChild)) {
					let e = Z("paragraph").createAndFill();
					if (e !== null) {
						let t = n.tr.insert(n.doc.content.size, e).setMeta("addToHistory", !1);
						n = n.apply(t);
					}
				}
				t.updateState(n), this.syncPlaceholder(t), e.docChanged && this.dispatchInputEvent(), this.updateToolbarState();
			},
			editable: () => !this.readonly,
			nodeViews: {
				audio: (e) => this.createAudioNodeView(e),
				code_block: (e, t, n) => this.createCodeBlockNodeView(e, t, n),
				custom_element: (e) => this.createCustomElementNodeView(e),
				markdown_block: (e, t, n) => this.createMarkdownBlockNodeView(e, t, n),
				math_block: (e, t, n) => this.createMathNodeView(e, t, n, !0),
				math_inline: (e, t, n) => this.createMathNodeView(e, t, n, !1)
			}
		});
		t.dom.setAttribute("aria-label", "Rich text editor"), t.dom.setAttribute("role", "textbox"), t.dom.setAttribute("aria-multiline", "true"), this.editorView = t, this.syncPlaceholder(t), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	replaceDocument(e) {
		if (this.editorView === null) {
			this.initialHTML = e;
			return;
		}
		let t = g.create({
			doc: this.parseHTML(e),
			plugins: this.editorView.state.plugins
		});
		this.editorView.updateState(t), this.syncPlaceholder(), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	syncPlaceholder(e = this.editorView) {
		if (this.htmlSourceElement !== null && (this.htmlSourceElement.placeholder = this.placeholder), e === null) return;
		e.dom.dataset.placeholder = this.placeholder;
		let t = e.state.doc, n = t.childCount === 1 && t.firstChild?.isTextblock === !0 && t.firstChild.content.size === 0;
		e.dom.toggleAttribute("data-tp-prose-editor-empty", n);
	}
	insertHTMLWithHistory(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		if (this.editorView === null) {
			this.setHTML(e);
			return;
		}
		let t = this.parseHTML(e), n = this.editorView.state.tr.replaceSelection(new T(t.content, 0, 0));
		this.editorView.dispatch(n), this.htmlSourceElement !== null && (this.htmlSourceElement.value = this.serializeDocument(n.doc)), this.updateToolbarState(), this.loadRenderedTpComponents(), this.editorView.focus();
	}
	async loadSrcDocument() {
		let e = this.src.trim(), t = ++this.srcLoadToken;
		if (e !== "") try {
			let n = this.resolveSourceUrl(e), r = await fetch(n.href, { cache: "no-store" });
			if (!r.ok) throw Error(`Unable to load ${n.pathname} (${String(r.status)})`);
			let i = await r.text();
			if (t !== this.srcLoadToken || !this.isConnected) return;
			if (this.isMarkdownSource(n)) {
				await this.replaceDocumentWithMarkdownSource(i, n);
				return;
			}
			this.setHTML(await this.renderSourceDocument(i, n));
		} catch (e) {
			if (t !== this.srcLoadToken || !this.isConnected) return;
			let n = e instanceof Error ? e.message : String(e);
			this.setHTML(`<pre><code>${X(n)}</code></pre>`);
		}
	}
	async renderSourceDocument(e, t) {
		let n = this.getSourceExtension(t);
		return n === "html" || n === "htm" ? e : `<pre><code>${X(e)}</code></pre>`;
	}
	async replaceDocumentWithMarkdownSource(e, t) {
		let n = document.createElement("div");
		await o(e, n, t.pathname);
		let r = this.serializeRenderedElement(n), i = Z("markdown_block").create({
			html: r,
			markdown: e,
			view: "preview"
		}), a = this.ensureTrailingEditableBlock(Y.topNodeType.create(null, [i]));
		this.replaceDocumentNode(a), this.syncHTMLSurfaces(r), this.internalValueUpdate = !0, this.setStringAttribute("value", r), this.internalValueUpdate = !1, this.dispatchInputEvent();
	}
	serializeRenderedElement(e) {
		return this.syncFormControlAttributes(e), e.innerHTML;
	}
	async renderMarkupInto(e, t, i) {
		if (t === "html") {
			i.innerHTML = e;
			return;
		}
		if (t === "asciidoc") {
			await n(e, i);
			return;
		}
		if (t === "restructuredtext") {
			await r(e, i);
			return;
		}
		await o(e, i, "/tp-prose-editor-markup-block.md");
	}
	syncFormControlAttributes(e) {
		for (let t of e.querySelectorAll("input")) t.type === "checkbox" || t.type === "radio" ? t.toggleAttribute("checked", t.checked) : t.setAttribute("value", t.value);
		for (let t of e.querySelectorAll("textarea")) t.textContent = t.value;
		for (let t of e.querySelectorAll("select")) for (let e of t.options) e.toggleAttribute("selected", e.selected);
	}
	replaceDocumentNode(e) {
		if (this.editorView === null) return;
		let t = g.create({
			doc: e,
			plugins: this.editorView.state.plugins
		});
		this.editorView.updateState(t), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	syncHTMLSurfaces(e) {
		this.htmlSourceElement !== null && (this.htmlSourceElement.value = e), this.htmlRenderedElement !== null && (this.htmlRenderedElement.innerHTML = e);
	}
	isMarkdownSource(e) {
		let t = this.getSourceExtension(e);
		return t === "md" || t === "markdown";
	}
	getSourceExtension(e) {
		let t = e.pathname.split("/").pop() ?? "", n = t.lastIndexOf(".");
		return n < 0 ? "" : t.slice(n + 1).toLowerCase();
	}
	resolveSourceUrl(t) {
		return e(this, t);
	}
	parseHTML(e) {
		let t = document.createElement("div");
		return t.innerHTML = e.trim() === "" ? "<p></p>" : e, this.ensureTrailingEditableBlock(le.fromSchema(Y).parse(t));
	}
	serializeDocument(e, t = {}) {
		let n = document.createElement("div"), r = Array.from(this.iterateChildNodes(e));
		for (let [e, i] of r.entries()) if (!this.shouldSkipTrailingEditableBlock(r, e) && !this.shouldSkipEmptyParagraphBeforeMedia(r, e)) {
			if (i.type === Z("markdown_block")) {
				let e = document.createElement("template");
				e.innerHTML = String(i.attrs.html), n.append(e.content.cloneNode(!0));
				continue;
			}
			if (t.renderComponents === !0 && i.type === Z("code_block")) {
				n.append(this.serializeCodeBlockAsComponent(i));
				continue;
			}
			n.append(u.fromSchema(Y).serializeNode(i));
		}
		for (let e of n.querySelectorAll("tp-icon")) {
			let t = e.nextSibling;
			t instanceof Text && t.data.startsWith(fe) && (t.data = t.data.slice(1), t.data === "" && t.remove());
		}
		return n.innerHTML;
	}
	serializeCodeBlockAsComponent(e) {
		let t = document.createElement("tp-code-editor"), n = document.createElement("script"), r = z(e.attrs.language), i = typeof e.attrs.src == "string" ? e.attrs.src.trim() : "";
		return t.setAttribute("language", r), t.setAttribute("line-numbers", ""), t.setAttribute("word-wrap", ""), H(t, e.attrs.theme, e.attrs.color), t.addEventListener("tp-code-editor-ready", () => {
			be(t, e.attrs.theme), H(t, e.attrs.theme, e.attrs.color);
		}, { once: !0 }), i !== "" && (t.setAttribute("filename", i), xe(i) && t.setAttribute("src", i), n.setAttribute("filename", i)), n.type = `tp/${r}`, n.textContent = e.textContent, t.append(n), t;
	}
	ensureTrailingEditableBlock(e) {
		if (!this.requiresTrailingEditableBlock(e.lastChild)) return e;
		let t = Z("paragraph").createAndFill();
		return t === null ? e : e.copy(e.content.append(E.from(t)));
	}
	shouldSkipTrailingEditableBlock(e, t) {
		if (t !== e.length - 1) return !1;
		let n = e[t], r = e[t - 1];
		return n !== void 0 && r !== void 0 && this.isEmptyParagraph(n) && this.requiresTrailingEditableBlock(r);
	}
	shouldSkipEmptyParagraphBeforeMedia(e, t) {
		let n = e[t], r = e[t + 1];
		return n !== void 0 && r !== void 0 && this.isEmptyParagraph(n) && (r.type === Z("image") || r.type === Z("video"));
	}
	isEmptyParagraph(e) {
		return e.type === Z("paragraph") && e.content.size === 0;
	}
	requiresTrailingEditableBlock(e) {
		return e === null ? !1 : e.type === Z("bullet_list") || e.type === Z("definition_list") || e.type === Z("ordered_list") || e.type === Z("table") || e.type === Z("code_block") || e.type === Z("custom_element") || e.type === Z("markdown_block") || e.type === Z("math_block") || e.type === Z("image") || e.type === Z("video") || e.type === Z("audio");
	}
	*iterateChildNodes(e) {
		for (let t = 0; t < e.childCount; t += 1) yield e.child(t);
	}
	loadRenderedTpComponents() {
		this.surfaceElement !== null && c(this.surfaceElement).catch((e) => {
			console.error("Unable to load tp components in prose editor", e);
		});
	}
	loadRenderedHTMLComponents() {
		this.htmlRenderedElement !== null && this.refreshRenderedHTML(this.htmlRenderedElement);
	}
	async refreshRenderedHTML(e) {
		try {
			await c(e), await this.waitForRenderedMarkdownElements(e), await i(e, "/tp-prose-editor-html-render.md"), await this.renderMathElements(e);
		} catch (e) {
			console.error("Unable to refresh prose editor HTML render", e);
		}
	}
	async waitForRenderedMarkdownElements(e) {
		let t = e.querySelectorAll("tp-markdown");
		await Promise.all(Array.from(t, (e) => this.waitForRenderedMarkdownElement(e)));
	}
	waitForRenderedMarkdownElement(e) {
		return e.hasAttribute("data-tp-markdown-rendered") ? Promise.resolve() : new Promise((t) => {
			let n = window.setTimeout(() => {
				e.removeEventListener("tp-markdown-rendered", r), t();
			}, Be), r = () => {
				window.clearTimeout(n), t();
			};
			e.addEventListener("tp-markdown-rendered", r, { once: !0 });
		});
	}
	async ensureMathJax() {
		let e = window;
		return typeof e.MathJax?.tex2svgPromise == "function" ? (await e.MathJax.startup?.promise, e.MathJax) : I === null ? (I = new Promise((t, n) => {
			e.MathJax = {
				...e.MathJax,
				loader: { load: ["input/tex", "output/svg"] },
				tex: { packages: { "[+]": [] } },
				svg: { fontCache: "local" },
				startup: { typeset: !1 }
			};
			let r = document.createElement("script");
			r.async = !0, r.src = pe, r.addEventListener("load", () => {
				Promise.resolve(e.MathJax?.startup?.promise).then(() => {
					t();
				});
			}, { once: !0 }), r.addEventListener("error", () => {
				n(/* @__PURE__ */ Error("Unable to load MathJax"));
			}, { once: !0 }), document.head.append(r);
		}).catch((e) => {
			throw I = null, e;
		}), await I, e.MathJax ?? {}) : (await I, e.MathJax ?? {});
	}
	async renderMathElements(e) {
		let t = e.querySelectorAll("[data-mathjax-tex]");
		for (let e of t) await this.renderMathElement(e);
	}
	async renderMathElement(e) {
		let t = e.getAttribute("data-mathjax-tex") ?? "";
		if (t.trim() === "") {
			e.textContent = "";
			return;
		}
		e.textContent = e.getAttribute("data-mathjax-display") === "true" ? `$$${t}$$` : `$${t}$`;
		try {
			let n = await this.ensureMathJax();
			if (typeof n.tex2svgPromise != "function") return;
			let r = await n.tex2svgPromise(t, { display: e.getAttribute("data-mathjax-display") === "true" });
			e.replaceChildren(r), e.setAttribute("data-mathjax-rendered", "true");
		} catch (e) {
			console.warn("Unable to render MathJax formula", e);
		}
	}
	createMathNodeView(e, t, n, r) {
		let i = e, a = document.createElement(r ? "div" : "span");
		a.className = r ? "tp-prose-editor-math-block" : "tp-prose-editor-math-inline", a.toggleAttribute("data-tp-prose-editor-math-block", r), a.toggleAttribute("data-tp-prose-editor-math-inline", !r), a.setAttribute("data-mathjax-display", String(r)), a.contentEditable = "false";
		let o = () => {
			a.setAttribute("data-mathjax-tex", String(i.attrs.tex)), this.renderMathElement(a);
		}, s = () => {
			if (this.readonly || typeof n != "function") return;
			let e = n();
			if (typeof e != "number") return;
			let r = window.prompt("Math", String(i.attrs.tex));
			r !== null && t.dispatch(t.state.tr.setNodeMarkup(e, void 0, { tex: r }));
		};
		return a.addEventListener("dblclick", s), o(), {
			dom: a,
			stopEvent: (e) => e.type === "dblclick",
			ignoreMutation: () => !0,
			update: (e) => e.type === i.type ? (i = e, o(), !0) : !1,
			destroy: () => {
				a.removeEventListener("dblclick", s);
			}
		};
	}
	createCodeBlockNodeView(e, t, n) {
		let r = e, i = document.createElement("div"), a = document.createElement("div"), o = this.createToolbarId("code-file"), c = this.createToolbarId("code-language"), l = document.createElement("tp-code-editor"), u = document.createElement("input"), d = me.map((e) => `<li data-code-language="${e}">${e}</li>`).join("");
		i.dataset.tpProseEditorCodeBlockEditor = "", a.dataset.tpProseEditorCodeBlockToolbar = "", a.innerHTML = `
      <tp-icon-button id="${o}" name="file" label="Code file" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-file-dropdown anchor="#${o}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>
            <li data-code-file-action="load"><span data-tp-prose-editor-menu-label><tp-icon name="file-download" aria-hidden="true"></tp-icon><span>Load</span></span></li>
            <li data-code-file-action="save"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload" aria-hidden="true"></tp-icon><span>Save</span></span></li>
            <li data-code-file-action="save-as"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload-as" aria-hidden="true"></tp-icon><span>Save as</span></span></li>
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button id="${c}" name="code" label="Code language" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-language-dropdown anchor="#${c}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>${d}</ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button data-tp-prose-editor-code-toolbar name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)"></tp-icon-button>
    `, l.dataset.tpProseEditorCodeBlock = "", l.setAttribute("line-numbers", ""), l.setAttribute("word-wrap", ""), l.readonly = this.readonly, u.type = "file", u.hidden = !0, u.dataset.tpProseEditorCodeFile = "", i.append(a, u, l);
		let f = a.querySelector(`#${o}`), p = a.querySelector(`#${c}`), m = a.querySelector("[data-tp-prose-editor-code-toolbar]"), h = a.querySelector("[data-tp-prose-editor-code-file-dropdown]"), g = a.querySelector("[data-tp-prose-editor-code-language-dropdown]"), _ = () => {
			let e = z(r.attrs.language), t = typeof r.attrs.src == "string" ? r.attrs.src.trim() : "";
			l.setAttribute("language", e), be(l, r.attrs.theme), H(l, r.attrs.theme, r.attrs.color), t === "" ? (l.removeAttribute("src"), l.removeAttribute("filename")) : xe(t) ? (l.setAttribute("src", t), l.removeAttribute("filename")) : (l.removeAttribute("src"), l.setAttribute("filename", t));
			for (let t of a.querySelectorAll("[data-code-language]")) t.toggleAttribute("data-selected", t.dataset.codeLanguage === e), t.dataset.codeLanguage === e ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current");
		}, v = (e = r.attrs, i = l.getValue()) => {
			if (typeof n != "function") return;
			let a = n();
			if (typeof a != "number") return;
			let o = t.state.tr.setNodeMarkup(a, void 0, e);
			if (i !== r.textContent) {
				let e = i === "" ? E.empty : E.from(Y.text(i));
				o = o.replaceWith(a + 1, a + r.nodeSize - 1, e);
			}
			t.dispatch(o);
		}, y = new MutationObserver(() => {
			let e = ge([l]), t = _e([l]), n = B(r.attrs.theme), i = ye(l);
			e !== null && i === "auto" && (l.classList.remove(...L), n !== null && l.classList.add(n), e = n), !(e === n && t === V(r.attrs.color)) && v({
				...r.attrs,
				theme: e,
				color: t
			});
		});
		y.observe(l, {
			attributeFilter: ["class"],
			attributes: !0
		});
		let b = (e) => {
			l.getValue() !== e && l.setValue(e);
		};
		b(e.textContent), _();
		let x = () => {
			l.getValue() !== r.textContent && v(r.attrs, l.getValue());
		}, S = async () => {
			let e = u.files?.[0];
			if (e === void 0) return;
			let t = await e.text(), n = z(s(e.name));
			v({
				...r.attrs,
				language: n,
				src: e.name
			}, t), b(t), l.setAttribute("language", n), l.removeAttribute("src"), l.setAttribute("filename", e.name), u.value = "";
		}, C = () => {
			S();
		}, w = (e) => {
			let t = typeof r.attrs.src == "string" ? r.attrs.src.trim() : "", n = e ?? (t.split("/").pop() || `code.${z(r.attrs.language)}`);
			this.downloadTextFile(n, l.getValue(), "text/plain;charset=utf-8");
		}, T = () => {
			let e = (typeof r.attrs.src == "string" ? r.attrs.src.trim() : "").split("/").pop() || `code.${z(r.attrs.language)}`;
			this.saveTextFileAs(e, l.getValue(), "text/plain;charset=utf-8");
		}, D = (e) => {
			let t = e.detail?.item, n = t?.dataset.codeFileAction;
			n === "load" ? (u.value = "", u.click()) : n === "save" ? w() : n === "save-as" && T(), t?.closest("tp-dropdown")?.hide();
		}, O = (e) => {
			let t = e.detail?.item, n = t?.dataset.codeLanguage;
			n !== void 0 && (v({
				...r.attrs,
				language: n,
				src: r.attrs.src
			}, l.getValue()), t?.closest("tp-dropdown")?.hide());
		}, k = () => {
			x();
		}, A = () => {
			_();
		}, j = () => {
			f?.setAttribute("aria-expanded", String(h?.open === !0)), p?.setAttribute("aria-expanded", String(g?.open === !0));
		}, M = (e, t, n) => {
			e.preventDefault(), e.stopPropagation(), t !== null && (n?.hide(), t.toggle(), j(), t.open ? t.querySelector("li[role=\"menuitem\"], li, button, input")?.focus() : l.focus());
		}, N = (e) => {
			M(e, h, g);
		}, P = (e) => {
			M(e, g, h);
		}, F = () => {
			j();
		}, ee = () => {
			l.toolbar = !l.toolbar, m?.setAttribute("aria-pressed", String(l.toolbar));
		};
		return l.addEventListener("tp-code-editor-input", x), l.addEventListener("tp-code-editor-load", k), l.addEventListener("tp-code-editor-ready", A), u.addEventListener("change", C), f?.addEventListener("click", N), p?.addEventListener("click", P), m?.addEventListener("click", ee), h?.addEventListener("tp-dropdown-toggle", F), g?.addEventListener("tp-dropdown-toggle", F), h?.addEventListener("tp-menu-item-select", D), g?.addEventListener("tp-menu-item-select", O), {
			dom: i,
			stopEvent: () => !0,
			ignoreMutation: () => !0,
			update: (e) => {
				if (e.type !== r.type) return !1;
				r = e;
				let t = e.textContent;
				return b(t), _(), l.readonly = this.readonly, !0;
			},
			destroy: () => {
				y.disconnect(), l.removeEventListener("tp-code-editor-input", x), l.removeEventListener("tp-code-editor-load", k), l.removeEventListener("tp-code-editor-ready", A), u.removeEventListener("change", C), f?.removeEventListener("click", N), p?.removeEventListener("click", P), m?.removeEventListener("click", ee), h?.removeEventListener("tp-dropdown-toggle", F), g?.removeEventListener("tp-dropdown-toggle", F), h?.removeEventListener("tp-menu-item-select", D), g?.removeEventListener("tp-menu-item-select", O);
			}
		};
	}
	createMarkdownBlockNodeView(e, t, n) {
		let r = e, i = document.createElement("div"), a = document.createElement("div"), o = document.createElement("div"), s = document.createElement("tp-code-editor"), c = document.createElement("div"), l = 0, u = $(e.attrs.view), d = Ve(e.attrs.language), f = d === "restructuredtext" ? "reStructuredText" : d === "asciidoc" ? "AsciiDoc" : d === "html" ? "HTML" : "Markdown";
		i.dataset.tpProseEditorMarkdownBlockEditor = "", a.dataset.tpProseEditorMarkdownBlockHeader = "", o.dataset.tpProseEditorMarkdownBlockModes = "", o.setAttribute("role", "group"), o.setAttribute("aria-label", `${f} block display`);
		let p = [
			[
				"both",
				"splitscreen",
				`${f} + HTML`
			],
			[
				"source",
				"splitscreen-top",
				f
			],
			[
				"preview",
				"splitscreen-bottom",
				"HTML"
			]
		];
		for (let [e, t, n] of p) {
			let r = document.createElement("tp-icon-button");
			r.setAttribute("type", "button"), r.setAttribute("name", t), r.setAttribute("label", n), r.dataset.markdownView = e, o.append(r);
		}
		let m = document.createElement("tp-icon-button");
		m.setAttribute("name", "keyboard-f1"), m.setAttribute("label", "Toggle editor toolbar"), m.setAttribute("title", "Toggle editor toolbar (F1)"), m.dataset.tpProseEditorMarkupToolbar = "", o.append(m), a.append(o), s.dataset.tpProseEditorMarkdownSource = "", s.setAttribute("language", d), s.setAttribute("line-numbers", ""), s.setAttribute("word-wrap", ""), s.readonly = this.readonly, s.setValue(String(e.attrs.markdown)), c.dataset.tpProseEditorMarkdownPreview = "", c.innerHTML = String(e.attrs.html), i.append(a, s, c);
		let h = (e) => {
			if (typeof n != "function") return;
			let i = n();
			typeof i == "number" && (r.attrs.markdown === e.markdown && r.attrs.html === e.html && $(r.attrs.view) === e.view || t.dispatch(t.state.tr.setNodeMarkup(i, void 0, e)));
		}, g = (e, t = !1) => {
			u = e, i.dataset.viewMode = e, s.hidden = e === "preview", m.hidden = e === "preview", c.hidden = e === "source";
			for (let t of o.querySelectorAll("tp-icon-button[data-markdown-view]")) t.setAttribute("aria-pressed", String(t.dataset.markdownView === e));
			t && h({
				html: String(r.attrs.html),
				language: d,
				markdown: String(r.attrs.markdown),
				view: e
			}), e === "preview" && document.getSelection()?.removeAllRanges();
		}, _ = (e) => {
			l += 1;
			let t = l, n = document.createElement("div");
			this.renderMarkupInto(e, d, n).then(() => {
				if (t !== l) return;
				let r = this.serializeRenderedElement(n);
				c.innerHTML = r, h({
					html: r,
					language: d,
					markdown: e,
					view: u
				});
			}).catch((e) => {
				console.error(`Unable to render ${f} block in prose editor`, e);
			});
		}, v = () => {
			_(s.getValue());
		}, y = (e) => {
			let t = e.target;
			t instanceof Element && t.closest("tp-icon-button[data-markdown-view]") !== null && e.preventDefault();
		}, b = (e) => {
			let t = e.target;
			if (!(t instanceof Element)) return;
			let n = t.closest("tp-icon-button[data-markdown-view]");
			n !== null && (e.preventDefault(), g($(n.dataset.markdownView), !0));
		};
		return s.addEventListener("tp-code-editor-input", v), m.addEventListener("click", () => {
			s.toolbar = !s.toolbar, m.setAttribute("aria-pressed", String(s.toolbar));
		}), o.addEventListener("mousedown", y), o.addEventListener("click", b), g(u), e.attrs.html === "" && e.attrs.markdown !== "" && _(String(e.attrs.markdown)), {
			dom: i,
			stopEvent: () => !0,
			ignoreMutation: () => !0,
			update: (e) => {
				if (e.type !== r.type) return !1;
				r = e;
				let t = String(e.attrs.markdown), n = String(e.attrs.html), i = $(e.attrs.view);
				return s.getValue() !== t && s.setValue(t), c.innerHTML !== n && (c.innerHTML = n), s.readonly = this.readonly, g(i), !0;
			},
			destroy: () => {
				l += 1, s.removeEventListener("tp-code-editor-input", v), o.removeEventListener("mousedown", y), o.removeEventListener("click", b);
			}
		};
	}
	createCustomElementNodeView(e) {
		let t = this.createCustomElementDOM(e);
		return t.contentEditable = "false", t.dataset.tpProseEditorCustomElement = "", c(t).catch((e) => {
			console.error("Unable to load tp component node view", e);
		}), {
			dom: t,
			stopEvent: (e) => this.shouldIgnoreCustomElementEvent(e),
			ignoreMutation: () => !0,
			update: (t) => !(t.type !== e.type || t.attrs.html !== e.attrs.html)
		};
	}
	createAudioNodeView(e) {
		if (e.attrs.controls === !0) return {
			dom: q(this.createAudioElement(e), e.attrs.caption),
			ignoreMutation: () => !0
		};
		let t = document.createElement("span");
		t.dataset.tpProseEditorAudioButton = "", t.contentEditable = "false";
		let n = this.createAudioElement(e);
		n.hidden = !0;
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("name", "volume-high"), r.setAttribute("label", String(e.attrs.title || "Play audio")), r.addEventListener("click", (e) => {
			e.preventDefault(), n.play();
		}), t.append(r, n), {
			dom: t,
			ignoreMutation: () => !0,
			stopEvent: (e) => e.type === "click"
		};
	}
	createAudioElement(e) {
		let t = document.createElement("audio");
		return t.src = String(e.attrs.src), e.attrs.autoplay === !0 && (t.autoplay = !0), e.attrs.controls === !0 && (t.controls = !0), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), t;
	}
	createCustomElementDOM(e) {
		let t = document.createElement("template");
		t.innerHTML = String(e.attrs.html);
		let n = t.content.firstElementChild;
		if (n instanceof HTMLElement) return n;
		let r = document.createElement("div");
		return r.dataset.tpProseEditorCustomElement = "", r;
	}
	shouldIgnoreCustomElementEvent(e) {
		if (e.type === "focus" || e.type === "blur" || e.type === "mousedown" || e.type === "mouseup" || e.type === "click" || e.type === "dblclick" || e.type === "pointerdown" || e.type === "pointerup" || e.type === "keydown" || e.type === "keyup" || e.type === "keypress" || e.type === "input" || e.type === "change") return !0;
		let t = e.target;
		return t instanceof Element && t.closest("input, textarea, select, button, label, [contenteditable=\"true\"]") !== null;
	}
	createTableNode(e, t) {
		let n = Math.max(1, Math.floor(e)), r = Math.max(1, Math.floor(t)), i = Z("table_cell"), a = Z("table_row"), o = Z("table"), s = Array.from({ length: n }, () => {
			let e = Array.from({ length: r }, () => {
				let e = i.createAndFill();
				if (e === null) throw Error("Unable to create table cell.");
				return e;
			});
			return a.create(null, e);
		});
		return o.create(null, s);
	}
	runTableCommand(e) {
		return this.editorView !== null && e(this.editorView.state, this.editorView.dispatch, this.editorView);
	}
	handleToolbarMouseDown = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("tp-icon-button[data-command=\"html\"]");
		n === null || n.hasAttribute("disabled") || e.preventDefault();
	};
	handleToolbarClick = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("tp-icon-button[data-command]");
		if (n === null || this.editorView === null || n.hasAttribute("disabled")) return;
		e.preventDefault();
		let r = n.dataset.command;
		this.runCommand(r), [
			"copy",
			"cut",
			"files",
			"emoji-picker",
			"format",
			"html",
			"insert-table",
			"list",
			"media",
			"icon-picker",
			"more",
			"paste",
			"search",
			"select-all",
			"types",
			"symbol-picker"
		].includes(r) || this.editorView.focus();
	};
	runCommand(e) {
		if (this.editorView !== null) {
			if (e === "more") {
				this.toggleSecondaryToolbar();
				return;
			}
			if (!this.toggleDropdownCommand(e)) {
				if ([
					"copy",
					"cut",
					"paste",
					"select-all"
				].includes(e)) {
					this.runClipboardCommand(e);
					return;
				}
				({
					"format-bold": y(Q("strong")),
					"format-clear": this.clearFormatting,
					"format-code": y(Q("code")),
					"format-code-block": v(Z("code_block")),
					"format-list-bulleted": oe(Z("bullet_list")),
					"format-list-numbered": oe(Z("ordered_list")),
					"format-list-text": this.insertDefinitionList,
					"format-math": this.insertInlineMath,
					"format-header-1": this.toggleHeading(1),
					"format-header-2": this.toggleHeading(2),
					"format-header-3": this.toggleHeading(3),
					"format-header-4": this.toggleHeading(4),
					"format-header-5": this.toggleHeading(5),
					"format-header-6": this.toggleHeading(6),
					"format-italic": y(Q("em")),
					"format-quote-open": x(Z("blockquote")),
					"format-strikethrough": y(Q("strikethrough")),
					"format-subscript": y(Q("subscript")),
					"format-superscript": y(Q("superscript")),
					"format-text": v(Z("paragraph")),
					"format-underline": y(Q("underline")),
					"insert-horizontal-rule": this.insertHorizontalRule,
					"insert-math-block": this.insertMathBlock,
					"insert-markdown-block": this.insertMarkdownBlock,
					"insert-markup-asciidoc": this.insertMarkupBlock("asciidoc"),
					"insert-markup-html": this.insertMarkupBlock("html"),
					"insert-markup-markdown": this.insertMarkupBlock("markdown"),
					"insert-markup-restructuredtext": this.insertMarkupBlock("restructuredtext"),
					"insert-audio": this.insertAudio,
					"insert-image": this.insertImage,
					"insert-video": this.insertVideo,
					link: this.toggleLink,
					redo: b,
					undo: F
				})[e]?.(this.editorView.state, this.editorView.dispatch, this.editorView), this.updateToolbarState();
			}
		}
	}
	toggleDropdownCommand(e) {
		let t = {
			files: this.fileDropdownElement,
			"emoji-picker": this.emojiPickerDropdownElement,
			format: this.formatDropdownElement,
			html: this.htmlDropdownElement,
			"insert-table": this.tableDropdownElement,
			list: this.listDropdownElement,
			media: this.mediaDropdownElement,
			"icon-picker": this.iconPickerDropdownElement,
			"symbol-picker": this.symbolPickerDropdownElement,
			types: this.typeDropdownElement
		}[e];
		if (t === void 0) return e === "search" ? (this.toggleSearch(), !0) : !1;
		if (t === null) return !0;
		let n = !t.open;
		return t.toggle(), n ? (t.querySelector("li[role=\"menuitem\"], button, input")?.focus(), !0) : (this.editorView?.focus(), !0);
	}
	handleMenuItemSelect = (e) => {
		let t = e.detail.item;
		if (!(t instanceof HTMLElement) || t.getAttribute("aria-disabled") === "true") return;
		let n = t.dataset.menuCommand, r = t.dataset.fileAction, i = t.dataset.htmlAction, a = t.dataset.tableAction;
		if (n !== void 0) {
			this.runCommand(n), t.closest("tp-dropdown")?.hide(), this.editorView?.focus();
			return;
		}
		if (r !== void 0) {
			this.runFileAction(r), t.closest("tp-dropdown")?.hide();
			return;
		}
		if (i !== void 0) {
			this.runHTMLAction(i), t.closest("tp-dropdown")?.hide();
			return;
		}
		a !== void 0 && this.runTableAction(a);
	};
	handleGenericMenuKeydown = (e) => {
		e.key === "Escape" && (e.preventDefault(), e.currentTarget?.closest("tp-dropdown")?.hide(), this.editorView?.focus());
	};
	runFileAction(e) {
		switch (e) {
			case "load-html":
				this.htmlFileInputElement?.click();
				break;
			case "import-markdown":
				this.markdownFileInputElement?.click();
				break;
			case "save-html":
				this.downloadHTML("prose-editor.html");
				break;
			case "save-html-as":
				this.downloadHTMLAs();
				break;
		}
	}
	openFileInput(e) {
		e !== null && (e.value = "", e.click());
	}
	runHTMLAction(e) {
		switch (e) {
			case "editor":
				this.restoreEditorMode();
				break;
			case "render":
				this.setHTMLRenderMode(!0);
				break;
			case "code":
				this.setHTMLCodeMode(!0);
				break;
		}
	}
	handleHtmlFileChange = (e) => {
		this.loadSelectedHTMLFile(e);
	};
	handleMarkdownFileChange = (e) => {
		this.loadSelectedMarkdownFile(e);
	};
	handleImageFileChange = (e) => {
		this.loadSelectedMediaFile(e, "image");
	};
	handleVideoFileChange = (e) => {
		this.loadSelectedMediaFile(e, "video");
	};
	handleAudioFileChange = (e) => {
		this.loadSelectedMediaFile(e, "audio");
	};
	handleHtmlSourceInput = () => {
		this.dispatchInputEvent();
	};
	handleSearchInput = () => {
		let e = this.searchInputElement?.value.trim() ?? "";
		if (this.syncSearchClearButton(), e === "") {
			this.setSearchQuery("");
			return;
		}
		this.findNext(e);
	};
	handleSearchClearClick = (e) => {
		e.preventDefault(), e.stopPropagation(), this.clearSearch();
	};
	handleFileDropdownToggle = () => this.syncDropdownButton("files", this.fileDropdownElement);
	handleTypeDropdownToggle = () => this.syncDropdownButton("types", this.typeDropdownElement);
	handleFormatDropdownToggle = () => this.syncDropdownButton("format", this.formatDropdownElement);
	handleHTMLDropdownToggle = () => this.syncDropdownButton("html", this.htmlDropdownElement);
	handleListDropdownToggle = () => this.syncDropdownButton("list", this.listDropdownElement);
	handleMediaDropdownToggle = () => this.syncDropdownButton("media", this.mediaDropdownElement);
	toggleSecondaryToolbar() {
		if (this.secondaryToolbarElement === null) return;
		let e = this.secondaryToolbarElement.hidden;
		this.secondaryToolbarElement.hidden = !e, e || (this.typeDropdownElement?.hide(), this.formatDropdownElement?.hide(), this.listDropdownElement?.hide()), this.updateToolbarState();
	}
	syncDropdownButton(e, t) {
		let n = this.querySelectorAll(`tp-icon-button[data-command="${e}"]`);
		for (let e of n) e.setAttribute("aria-expanded", String(t?.open === !0));
	}
	syncSearchClearButton() {
		this.searchClearButtonElement === null || this.searchInputElement === null || (this.searchClearButtonElement.hidden = !1, this.searchClearButtonElement.setAttribute("label", this.searchInputElement.value.trim() === "" ? "Close search" : "Clear search"));
	}
	clearSearch() {
		if (this.searchInputElement !== null) {
			if (this.searchInputElement.value.trim() === "") {
				this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
				return;
			}
			this.searchInputElement.value = "", this.setSearchQuery(""), this.syncSearchClearButton(), this.searchInputElement.focus();
		}
	}
	closeTableMenu() {
		this.tableDropdownElement !== null && this.tableDropdownElement.hide();
	}
	handleTableDropdownToggle = () => {
		this.toolbarElement?.querySelector("tp-icon-button[data-command=\"insert-table\"]")?.setAttribute("aria-expanded", String(this.tableDropdownElement?.open === !0)), this.syncTablePicker();
	};
	runTableAction(e) {
		switch (e) {
			case "insert":
				this.insertTable(this.readTableRows(), this.readTableColumns()), this.closeTableMenu();
				break;
			case "add-caption":
				this.addTableCaption(), this.closeTableMenu(), this.editorView?.focus();
				break;
			case "add-row":
				this.addTableRowAfter(), this.editorView?.focus();
				break;
			case "add-column":
				this.addTableColumnAfter(), this.editorView?.focus();
				break;
			case "delete-row":
				this.deleteTableRow(), this.editorView?.focus();
				break;
			case "delete-column":
				this.deleteTableColumn(), this.editorView?.focus();
				break;
			case "delete-table":
				this.deleteTable(), this.closeTableMenu(), this.editorView?.focus();
				break;
		}
	}
	addTableCaption() {
		if (this.editorView === null) return !1;
		let { state: e } = this.editorView, t = this.findTableForCaption();
		if (t === null) return !1;
		let n = typeof t.node.attrs.caption == "string" ? t.node.attrs.caption : "", r = window.prompt("Table caption", n);
		if (r === null) return !1;
		let i = {
			...t.node.attrs,
			caption: r.trim() === "" ? null : r.trim()
		};
		return this.editorView.dispatch(e.tr.setNodeMarkup(t.position, void 0, i).scrollIntoView()), !0;
	}
	findTableForCaption() {
		if (this.editorView === null) return null;
		let e = Z("table"), { state: t } = this.editorView, { $from: n } = t.selection;
		for (let t = n.depth; t > 0; --t) {
			let r = n.node(t);
			if (r.type === e) return {
				node: r,
				position: n.before(t)
			};
		}
		let r = null;
		return t.doc.descendants((n, i) => {
			if (n.type !== e) return !0;
			let a = Math.min(Math.abs(i - t.selection.from), Math.abs(i + n.nodeSize - t.selection.from));
			return (r === null || a < r.distance) && (r = {
				distance: a,
				node: n,
				position: i
			}), !1;
		}), r;
	}
	handleTableMenuKeydown = (e) => {
		e.key === "Escape" && (e.preventDefault(), this.closeTableMenu(), this.editorView?.focus());
	};
	handleTablePickerPointerOver = (e) => {
		let t = this.getTablePickerCell(e.target);
		t !== null && this.selectTablePickerCell(t);
	};
	handleTablePickerClick = (e) => {
		let t = this.getTablePickerCell(e.target);
		t !== null && (e.preventDefault(), this.selectTablePickerCell(t), this.insertTable(this.readTableRows(), this.readTableColumns()), this.closeTableMenu());
	};
	getTablePickerCell(e) {
		return e instanceof Element ? e.closest("[data-table-grid-cell]") : null;
	}
	selectTablePickerCell(e) {
		this.selectedTableRows = this.readPositiveInteger(e.dataset.tableRows ?? "", this.selectedTableRows), this.selectedTableColumns = this.readPositiveInteger(e.dataset.tableColumns ?? "", this.selectedTableColumns), this.syncTablePicker();
	}
	syncTablePicker() {
		let e = this.toolbarElement?.querySelector("[data-tp-prose-editor-table-picker]");
		if (e == null) return;
		e.querySelector("[data-tp-prose-editor-table-picker-size]")?.replaceChildren(`${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}`);
		let t = e.querySelectorAll("[data-table-grid-cell]");
		for (let e of t) {
			let t = this.readPositiveInteger(e.dataset.tableRows ?? "", 0), n = this.readPositiveInteger(e.dataset.tableColumns ?? "", 0), r = t <= this.selectedTableRows && n <= this.selectedTableColumns;
			e.toggleAttribute("data-selected", r), e.setAttribute("aria-pressed", String(t === this.selectedTableRows && n === this.selectedTableColumns));
		}
	}
	readTableRows() {
		return this.selectedTableRows;
	}
	readTableColumns() {
		return this.selectedTableColumns;
	}
	readPositiveInteger(e, t) {
		let n = Number.parseInt(e, 10);
		return !Number.isFinite(n) || n < 1 ? t : n;
	}
	toggleSearch() {
		if (this.searchInputElement !== null) {
			if (this.searchInputElement.hidden) {
				this.searchControlElement !== null && (this.searchControlElement.hidden = !1), this.searchInputElement.hidden = !1;
				let e = this.getSelectedText();
				e !== "" && (this.searchInputElement.value = e), this.syncSearchClearButton(), this.searchInputElement.focus(), this.searchInputElement.select();
				return;
			}
			if (this.searchInputElement.value.trim() !== "") {
				this.findNext(this.searchInputElement.value);
				return;
			}
			this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
		}
	}
	handleSearchInputKeydown = (e) => {
		if (this.searchInputElement === null) return;
		if (e.key === "Escape") {
			e.preventDefault(), this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
			return;
		}
		if (e.key !== "Enter") return;
		e.preventDefault();
		let t = this.searchInputElement.value.trim();
		if (t !== "") {
			if (e.shiftKey) {
				this.findPrevious(t);
				return;
			}
			this.findNext(t);
		}
	};
	findSearchMatch(e, t) {
		if (this.editorView === null) return !1;
		let n = new ae({ search: (e ?? this.searchInputElement?.value ?? "").trim() }), { state: r } = this.editorView, { from: i, to: a } = r.selection, o = t === "next" ? n.findNext(r, a) : n.findPrev(r, i);
		o === null && (o = t === "next" ? n.findNext(r, 0, i) : n.findPrev(r, r.doc.content.size, a));
		let s = O(r.tr, n);
		return o !== null && (s = s.setSelection(S.create(s.doc, o.from, o.to)).scrollIntoView()), this.editorView.dispatch(s), o !== null;
	}
	getSelectedText() {
		if (this.editorView === null) return "";
		let { from: e, to: t, empty: n } = this.editorView.state.selection;
		return n ? "" : this.editorView.state.doc.textBetween(e, t, " ").trim();
	}
	updateToolbarState() {
		if (this.editorView === null || this.toolbarElement === null) return;
		let e = /* @__PURE__ */ new Set();
		this.isMarkActive("strong") && e.add("format-bold"), this.isMarkActive("em") && e.add("format-italic"), this.isMarkActive("code") && e.add("format-code"), this.isMarkActive("underline") && e.add("format-underline"), this.isMarkActive("strikethrough") && e.add("format-strikethrough"), this.isMarkActive("subscript") && e.add("format-subscript"), this.isMarkActive("superscript") && e.add("format-superscript");
		let t = this.editorView.state.selection.$from.parent;
		t.type === Z("heading") && t.attrs.level === 1 && e.add("format-header-1"), t.type === Z("heading") && t.attrs.level === 2 && e.add("format-header-2"), t.type === Z("heading") && t.attrs.level === 3 && e.add("format-header-3"), t.type === Z("heading") && t.attrs.level === 4 && e.add("format-header-4"), t.type === Z("heading") && t.attrs.level === 5 && e.add("format-header-5"), t.type === Z("heading") && t.attrs.level === 6 && e.add("format-header-6"), t.type === Z("paragraph") && e.add("format-text"), this.isSelectAllActive() && e.add("select-all");
		let n = this.querySelectorAll("tp-icon-button[data-command]"), r = this.secondaryToolbarElement?.hidden === !1;
		for (let t of n) {
			let n = t.dataset.command;
			if ([
				"format-bold",
				"format-code",
				"format-header-1",
				"format-header-2",
				"format-header-3",
				"format-header-4",
				"format-header-5",
				"format-header-6",
				"format-italic",
				"format-strikethrough",
				"format-subscript",
				"format-superscript",
				"format-text",
				"format-underline",
				"html",
				"more",
				"select-all"
			].includes(n)) {
				let i = e.has(n) || n === "html" && (this.htmlMode || this.htmlRenderMode) || n === "more" && r ? "true" : "false";
				t.setAttribute("aria-pressed", i), t.querySelector(":scope > button")?.setAttribute("aria-pressed", i);
			} else t.removeAttribute("aria-pressed"), t.querySelector(":scope > button")?.removeAttribute("aria-pressed");
		}
	}
	isSelectAllActive() {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			let e = window.getSelection();
			return e === null || e.rangeCount === 0 ? !1 : e.getRangeAt(0).commonAncestorContainer === this.htmlRenderedElement;
		}
		return this.htmlMode && this.htmlSourceElement !== null ? this.htmlSourceElement.selectionStart === 0 && this.htmlSourceElement.selectionEnd === this.htmlSourceElement.value.length && this.htmlSourceElement.value.length > 0 : this.editorView !== null && this.editorView.state.selection instanceof m;
	}
	isMarkActive(e) {
		if (this.editorView === null) return !1;
		let t = Q(e), { empty: n, $from: r, from: i, to: a } = this.editorView.state.selection;
		return n ? t.isInSet(this.editorView.state.storedMarks ?? r.marks()) !== void 0 : this.editorView.state.doc.rangeHasMark(i, a, t);
	}
	clearFormatting = (e, t) => {
		if (t === void 0) return !0;
		let { from: n, to: r } = e.selection, i = e.tr;
		for (let e of Object.values(Y.marks)) i = i.removeMark(n, r, e);
		return i = i.setBlockType(n, r, Z("paragraph")), t(i), !0;
	};
	insertHorizontalRule = (e, t) => (t === void 0 || t(e.tr.replaceSelectionWith(Z("horizontal_rule").create()).scrollIntoView()), !0);
	toggleHeading(e) {
		return (t, n) => {
			let r = t.selection.$from.parent, i = r.type === Z("heading") && r.attrs.level === e;
			return v(Z(i ? "paragraph" : "heading"), i ? null : { level: e })(t, n);
		};
	}
	insertInlineMath = (e, t) => {
		let n = this.getSelectedTextOrPrompt(e, "Math");
		return n === null ? !1 : (t === void 0 || t(e.tr.replaceSelectionWith(Z("math_inline").create({ tex: n })).scrollIntoView()), !0);
	};
	insertMathBlock = (e, t) => {
		let n = this.getSelectedTextOrPrompt(e, "Math block");
		if (n === null) return !1;
		if (t === void 0) return !0;
		let { $from: r, $to: i } = e.selection, a = r.parent.type === Z("paragraph") && i.parent.type === Z("paragraph") && r.before() === i.before(), o = a ? r.before() : e.selection.from, s = a ? r.after() : e.selection.to, c = Z("math_block").create({ tex: n }), l = e.tr.replaceWith(o, s, c), u = Math.min(o + c.nodeSize, l.doc.content.size), d = -1;
		if (u >= l.doc.content.size) {
			let e = Z("paragraph").createAndFill();
			e !== null && (d = l.doc.content.size + 1, l = l.insert(l.doc.content.size, e));
		}
		let f = d > 0 ? S.create(l.doc, d) : S.near(l.doc.resolve(u), 1);
		return t(l.setSelection(f).scrollIntoView()), !0;
	};
	getSelectedTextOrPrompt(e, t) {
		let n = e.doc.textBetween(e.selection.from, e.selection.to, "\n", "\n").trim();
		if (n !== "") return n.replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").trim();
		let r = window.prompt(t, "");
		return r === null || r.trim() === "" ? null : r.trim().replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").trim();
	}
	insertMarkdownBlock = (e, t) => t === void 0 || this.insertMarkupBlock("markdown")(e, t);
	insertMarkupBlock = (e) => (t, n) => n === void 0 ? !0 : (n(t.tr.replaceSelectionWith(Z("markdown_block").create({
		html: "",
		language: e,
		markdown: "",
		view: "both"
	})).scrollIntoView()), queueMicrotask(() => {
		let e = this.querySelectorAll("tp-code-editor[data-tp-prose-editor-markdown-source]"), t = e.item(e.length - 1);
		if (t === null) return;
		let n = () => {
			document.getSelection()?.removeAllRanges(), t.focus();
		};
		t.addEventListener("tp-code-editor-ready", n, { once: !0 }), n();
	}), !0);
	insertDefinitionList = (e, t) => {
		let n = Z("paragraph").create(null, Y.text("Description"));
		if (t === void 0) return !0;
		let r = e.doc.textBetween(e.selection.from, e.selection.to, " ").trim(), i = r === "" ? "Term" : r, a = [Z("definition_term").create(null, Y.text(i)), Z("definition_description").create(null, n)], o = this.findCurrentDefinitionList(e), s, c;
		if (o === null) {
			let t = Z("definition_list").create(null, a);
			s = e.tr.replaceSelectionWith(t), c = s.mapping.map(e.selection.from, 1);
		} else c = o.position + o.node.nodeSize - 1, s = e.tr.insert(c, E.fromArray(a));
		let l = Infinity, u = -1, d = -1;
		if (s.doc.descendants((e, t) => {
			if (e.type === Z("definition_description")) {
				let e = t + 2, n = e + 11, r = Math.abs(t - c);
				return r < l && (l = r, u = e, d = n), !1;
			}
			return !0;
		}), d >= s.doc.content.size) {
			let e = Z("paragraph").createAndFill();
			e !== null && (s = s.insert(s.doc.content.size, e));
		}
		return u < 0 || d < 0 ? (t(s.scrollIntoView()), !0) : (t(s.setSelection(S.create(s.doc, u, d)).scrollIntoView()), !0);
	};
	findCurrentDefinitionList(e) {
		let t = Z("definition_list"), { $from: n } = e.selection;
		for (let e = n.depth; e > 0; --e) {
			let r = n.node(e);
			if (r.type === t) return {
				node: r,
				position: n.before(e)
			};
		}
		return null;
	}
	insertDefinitionPairAfterDescription = (e, t) => {
		if (!e.selection.empty) return !1;
		let { $from: n } = e.selection;
		if (n.parentOffset !== n.parent.content.size) return !1;
		let r = -1;
		for (let e = n.depth; e > 0; --e) if (n.node(e).type === Z("definition_description")) {
			r = e;
			break;
		}
		if (r < 0) return !1;
		if (t === void 0) return !0;
		let i = Z("paragraph").create(null, Y.text("Description")), a = E.fromArray([Z("definition_term").create(null, Y.text("Term")), Z("definition_description").create(null, i)]), o = n.after(r), s = e.tr.insert(o, a);
		return s.setSelection(S.create(s.doc, o + 1, o + 1 + 4)).scrollIntoView(), t(s), !0;
	};
	exitDefinitionListPlaceholder = (e, t) => {
		let n = this.findDefinitionPlaceholderPair(e);
		if (n === null) return !1;
		if (t === void 0) return !0;
		let r = Z("paragraph").createAndFill();
		if (r === null) return !1;
		let i, a;
		if (n.removeList) {
			i = e.tr.delete(n.listStart, n.listEnd);
			let t = i.doc.nodeAt(n.listStart);
			t !== null && this.isEmptyParagraph(t) || (i = i.insert(n.listStart, r)), a = n.listStart + 1;
		} else {
			i = e.tr.delete(n.pairStart, n.pairEnd);
			let t = i.mapping.map(n.listEnd, -1), o = i.doc.nodeAt(t);
			o !== null && this.isEmptyParagraph(o) || (i = i.insert(t, r)), a = t + 1;
		}
		return t(i.setSelection(S.create(i.doc, a)).scrollIntoView()), !0;
	};
	findDefinitionPlaceholderPair(e) {
		let { $from: t, $to: n } = e.selection, r = -1;
		for (let e = t.depth; e > 0; --e) if (t.node(e).type === Z("definition_list")) {
			r = e;
			break;
		}
		if (r < 0 || !n.sameParent(t)) return null;
		let i = t.node(r), a = t.index(r), o = i.child(a), s = -1;
		if (o.type === Z("definition_term") ? s = a : o.type === Z("definition_description") && (s = a - 1), s < 0 || s + 1 >= i.childCount) return null;
		let c = i.child(s), l = i.child(s + 1);
		if (c.type !== Z("definition_term") || l.type !== Z("definition_description")) return null;
		let u = c.textContent.trim(), d = l.textContent.trim();
		if (u !== "" && u !== "Term" || d !== "" && d !== "Description") return null;
		let f = t.before(r) + 1;
		for (let e = 0; e < s; e += 1) f += i.child(e).nodeSize;
		let p = f + c.nodeSize + l.nodeSize;
		if (e.selection.from < f || e.selection.to > p) return null;
		let m = t.before(r);
		return {
			listEnd: m + i.nodeSize,
			listStart: m,
			pairEnd: p,
			pairStart: f,
			removeList: i.childCount === 2
		};
	}
	insertImage = (e, t) => (t === void 0 || this.openFileInput(this.imageFileInputElement), !0);
	insertVideo = (e, t) => (t === void 0 || this.openFileInput(this.videoFileInputElement), !0);
	insertAudio = (e, t) => (t === void 0 || this.openFileInput(this.audioFileInputElement), !0);
	toggleLink = (e, t, n) => {
		let r = Q("link"), { empty: i, from: a, to: o } = e.selection;
		if (!i && e.doc.rangeHasMark(a, o, r)) return y(r)(e, t, n);
		let s = window.prompt("Link URL");
		return s === null || s.trim() === "" ? !1 : y(r, {
			href: s.trim(),
			title: null
		})(e, t, n);
	};
	async runClipboardCommand(e) {
		if (e === "select-all") {
			this.selectAllContent();
			return;
		}
		switch ((this.htmlMode ? this.htmlSourceElement : this.htmlRenderMode ? this.htmlRenderedElement : this.editorView?.dom)?.focus(), e) {
			case "copy":
				document.execCommand("copy");
				return;
			case "cut":
				document.execCommand("cut");
				return;
			case "paste":
				await this.pasteClipboardText();
				return;
		}
	}
	selectAllContent() {
		if (this.isSelectAllActive()) {
			this.clearSelectAllContent();
			return;
		}
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			this.htmlRenderedElement.focus();
			let e = document.createRange();
			e.selectNodeContents(this.htmlRenderedElement);
			let t = window.getSelection();
			t?.removeAllRanges(), t?.addRange(e), this.updateToolbarState();
			return;
		}
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus(), this.htmlSourceElement.select(), this.updateToolbarState();
			return;
		}
		this.editorView !== null && (this.editorView.focus(), this.editorView.dispatch(this.editorView.state.tr.setSelection(new m(this.editorView.state.doc))), this.updateToolbarState());
	}
	clearSelectAllContent() {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			window.getSelection()?.removeAllRanges(), this.htmlRenderedElement.focus(), this.updateToolbarState();
			return;
		}
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus(), this.htmlSourceElement.setSelectionRange(0, 0), this.updateToolbarState();
			return;
		}
		this.editorView !== null && (this.editorView.focus(), this.editorView.dispatch(this.editorView.state.tr.setSelection(S.create(this.editorView.state.doc, 1))), this.updateToolbarState());
	}
	handleEmojiPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertPickerText(t), this.emojiPickerDropdownElement?.hide());
	};
	handleSymbolPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertPickerText(t), this.symbolPickerDropdownElement?.hide());
	};
	handleIconPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertInlineIcon(t), this.iconPickerDropdownElement?.hide());
	};
	insertInlineIcon(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		if (this.editorView === null) return;
		let t = document.createElement("template");
		t.innerHTML = e;
		let n = t.content.querySelector("tp-icon");
		if (!(n instanceof HTMLElement)) return;
		let r = Z("tp_icon").create({ html: n.outerHTML }), i = this.editorView.state.tr.replaceSelectionWith(r);
		i = i.insertText(fe, i.selection.from), this.editorView.dispatch(i.scrollIntoView()), this.loadRenderedTpComponents(), this.editorView.focus();
	}
	insertPickerText(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		this.editorView !== null && (this.editorView.dispatch(this.editorView.state.tr.insertText(e).scrollIntoView()), this.editorView.focus());
	}
	async pasteClipboardText() {
		try {
			let e = await navigator.clipboard.readText();
			if (this.htmlMode && this.htmlSourceElement !== null) {
				this.insertTextInHTMLSource(e);
				return;
			}
			this.editorView !== null && this.editorView.dispatch(this.editorView.state.tr.insertText(e).scrollIntoView());
		} catch {
			document.execCommand("paste");
		}
	}
	insertTextInHTMLSource(e) {
		if (this.htmlSourceElement === null) return;
		let t = this.htmlSourceElement.selectionStart, n = this.htmlSourceElement.selectionEnd, r = this.htmlSourceElement.value;
		this.htmlSourceElement.value = `${r.slice(0, t)}${e}${r.slice(n)}`;
		let i = t + e.length;
		this.htmlSourceElement.setSelectionRange(i, i), this.dispatchInputEvent();
	}
	setHTMLCodeMode(e) {
		if (this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null) return !1;
		if (!e) {
			if (!this.htmlMode) return this.restoreEditorMode();
			let e = this.htmlSourceElement.value;
			return this.htmlMode = !1, this.htmlSourceElement.hidden = !0, this.htmlRenderMode = !1, this.htmlRenderedElement.hidden = !0, this.surfaceElement.hidden = !1, this.setHTML(e), this.editorView?.focus(), this.updateToolbarState(), !0;
		}
		if (this.htmlMode) return this.htmlSourceElement.focus(), this.updateToolbarState(), !0;
		let n = this.htmlRenderMode ? this.htmlRenderedElement.innerHTML : this.serializeDocument(this.editorView?.state.doc ?? this.parseHTML(""));
		return this.htmlSourceElement.value = t(n), this.htmlMode = !0, this.htmlRenderMode = !1, this.surfaceElement.hidden = !0, this.htmlRenderedElement.hidden = !0, this.htmlSourceElement.hidden = !1, this.htmlSourceElement.focus(), this.updateToolbarState(), !0;
	}
	setHTMLRenderMode(e) {
		if (this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null) return !1;
		if (!e) return this.restoreEditorMode();
		let t = this.htmlMode ? this.htmlSourceElement.value : this.serializeDocument(this.editorView?.state.doc ?? this.parseHTML(""), { renderComponents: !0 });
		return this.htmlRenderedElement.innerHTML = t, this.htmlRenderMode = !0, this.htmlMode = !1, this.surfaceElement.hidden = !0, this.htmlSourceElement.hidden = !0, this.htmlRenderedElement.hidden = !1, this.loadRenderedHTMLComponents(), this.updateToolbarState(), !0;
	}
	restoreEditorMode() {
		return this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null ? !1 : (this.htmlMode = !1, this.htmlRenderMode = !1, this.htmlSourceElement.hidden = !0, this.htmlRenderedElement.hidden = !0, this.surfaceElement.hidden = !1, document.getSelection()?.removeAllRanges(), this.updateToolbarState(), !0);
	}
	async loadSelectedHTMLFile(e) {
		let t = e.currentTarget;
		if (t === null) return;
		let n = t.files?.[0];
		n !== void 0 && (this.insertHTMLWithHistory(await n.text()), t.value = "");
	}
	async loadSelectedMarkdownFile(e) {
		let t = e.currentTarget;
		if (t === null) return;
		let n = t.files?.[0];
		if (n === void 0) return;
		let r = await n.text(), i = document.createElement("div");
		await o(r, i, n.name);
		let a = i.innerHTML;
		this.insertHTMLWithHistory(a), t.value = "";
	}
	async loadSelectedMediaFile(e, t) {
		let n = e.currentTarget;
		if (n === null) return;
		let r = n.files?.[0];
		if (r === void 0) return;
		let i = await this.readFileAsDataURL(r);
		await this.insertMediaFile(t, i, r), n.value = "";
	}
	async insertMediaFile(e, t, n) {
		if (this.editorView === null) return;
		let r = await this.createMediaNode(e, t, n);
		if (r === null) return;
		let i = this.editorView.state.selection.from, a = this.editorView.state.tr.replaceSelectionWith(r), o = Math.min(i + r.nodeSize, a.doc.content.size);
		if (this.requiresTrailingEditableBlock(r) && o >= a.doc.content.size) {
			let e = Z("paragraph").createAndFill();
			e !== null && (a = a.insert(o, e));
		}
		this.editorView.dispatch(a.setSelection(_.near(a.doc.resolve(o), 1)).scrollIntoView()), this.editorView.focus();
	}
	async createMediaNode(e, t, n) {
		let r = await this.promptMediaAttributes(e, n.name, t);
		return r === null ? null : e === "image" ? Z("image").create({
			alt: r.alt,
			height: r.height,
			src: t,
			title: r.title,
			width: r.width
		}) : e === "video" ? Z("video").create({
			autoplay: r.autoplay,
			controls: r.controls,
			caption: r.caption,
			poster: r.poster.trim() === "" ? null : r.poster.trim(),
			src: t,
			title: r.title,
			width: r.width,
			height: r.height
		}) : Z("audio").create({
			autoplay: r.autoplay,
			caption: r.caption,
			controls: r.controls,
			src: t,
			title: r.title
		});
	}
	getMediaOptionChecked(e, t, n) {
		return e.querySelector(`[data-media-option="${t}"] input[type="checkbox"]`)?.checked ?? n;
	}
	normalizeDimension(e) {
		let t = e.trim();
		if (t === "") return null;
		let n = Number.parseInt(t, 10);
		return Number.isFinite(n) && n > 0 ? String(n) : null;
	}
	promptMediaAttributes(e, t, n) {
		return new Promise((r) => {
			let i = document.createElement("dialog"), a = e === "audio" || e === "video", o = e === "image" || e === "video", s = e === "image" ? "1" : e === "video" ? "1,3" : "1", c = e === "image" ? "<li data-media-option=\"lock-ratio\">Lock ratio</li>" : `
          <li data-media-option="controls">controls</li>
          <li data-media-option="autoplay">autoplay</li>
          ${e === "video" ? "<li data-media-option=\"lock-ratio\">Lock ratio</li>" : ""}
        `;
			i.innerHTML = `
        <form method="dialog">
          <label>
            <span>Title</span>
            <input type="text" name="title" value="${X(t)}">
          </label>
          ${e === "image" ? "\n            <label>\n              <span>Alternative text</span>\n              <input type=\"text\" name=\"alt\" value=\"\">\n            </label>\n          " : ""}
          ${e === "video" ? "\n            <label>\n              <span>Poster URL</span>\n              <input type=\"text\" name=\"poster\" value=\"\">\n            </label>\n          " : ""}
          ${e === "audio" || e === "video" ? "\n            <label>\n              <span>Caption</span>\n              <input type=\"text\" name=\"caption\" value=\"\">\n            </label>\n          " : ""}
          ${o ? "\n            <label>\n              <span>Width</span>\n              <input type=\"number\" name=\"width\" min=\"1\" step=\"1\" inputmode=\"numeric\">\n            </label>\n            <label>\n              <span>Height</span>\n              <input type=\"number\" name=\"height\" min=\"1\" step=\"1\" inputmode=\"numeric\">\n            </label>\n          " : ""}
          ${a || o ? `
            <tp-checkbox-list value="${s}">
              <ul>
                ${c}
              </ul>
            </tp-checkbox-list>
          ` : ""}
          <menu>
            <button type="button" value="cancel">Cancel</button>
            <button type="button" value="ok">OK</button>
          </menu>
        </form>
      `;
			let l = i.querySelector("tp-checkbox-list"), u = i.querySelector("input[name=\"title\"]"), d = i.querySelector("input[name=\"alt\"]"), f = i.querySelector("input[name=\"caption\"]"), p = i.querySelector("input[name=\"poster\"]"), m = i.querySelector("input[name=\"width\"]"), h = i.querySelector("input[name=\"height\"]"), g = 0, _ = 0, v = !1, y = () => this.getMediaOptionChecked(i, "lock-ratio", o), b = (e) => {
				if (v || !y() || g <= 0 || _ <= 0 || m === null || h === null) return;
				let t = Number.parseInt(e.value, 10);
				!Number.isFinite(t) || t <= 0 || (v = !0, e === m ? h.value = String(Math.round(t * _ / g)) : m.value = String(Math.round(t * g / _)), v = !1);
			}, x = (e) => {
				i.returnValue = e, i.dispatchEvent(new Event("close"));
			}, S = (e) => {
				let t = e.target?.closest("button[value]");
				t != null && (e.preventDefault(), x(t.value));
			};
			i.addEventListener("click", S), i.addEventListener("close", () => {
				if (i.removeEventListener("click", S), i.remove(), i.returnValue !== "ok") {
					r(null);
					return;
				}
				let e = a ? l?.getAttribute("value") || "1" : "", t = new Set(e.split(","));
				r({
					autoplay: this.getMediaOptionChecked(i, "autoplay", t.has("2")),
					controls: !a || this.getMediaOptionChecked(i, "controls", t.has("1")),
					alt: d?.value ?? "",
					caption: f?.value ?? "",
					height: this.normalizeDimension(h?.value ?? ""),
					lockRatio: this.getMediaOptionChecked(i, "lock-ratio", o),
					poster: p?.value ?? "",
					title: u?.value ?? "",
					width: this.normalizeDimension(m?.value ?? "")
				});
			}, { once: !0 }), m?.addEventListener("input", () => {
				b(m);
			}), h?.addEventListener("input", () => {
				b(h);
			}), this.append(i), (a || o) && l?.setAttribute("value", s), o && this.loadNaturalMediaSize(e, n).then((e) => {
				e !== null && (g = e.width, _ = e.height, m?.setAttribute("placeholder", String(e.width)), h?.setAttribute("placeholder", String(e.height)));
			}), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
		});
	}
	loadNaturalMediaSize(e, t) {
		return e === "image" ? new Promise((e) => {
			let n = new Image();
			n.addEventListener("load", () => {
				e({
					height: n.naturalHeight,
					width: n.naturalWidth
				});
			}, { once: !0 }), n.addEventListener("error", () => {
				e(null);
			}, { once: !0 }), n.src = t;
		}) : e === "video" ? new Promise((e) => {
			let n = document.createElement("video");
			n.preload = "metadata", n.addEventListener("loadedmetadata", () => {
				e({
					height: n.videoHeight,
					width: n.videoWidth
				});
			}, { once: !0 }), n.addEventListener("error", () => {
				e(null);
			}, { once: !0 }), n.src = t;
		}) : Promise.resolve(null);
	}
	readFileAsDataURL(e) {
		return new Promise((t, n) => {
			let r = new FileReader();
			r.addEventListener("load", () => {
				if (typeof r.result == "string") {
					t(r.result);
					return;
				}
				n(/* @__PURE__ */ Error(`Unable to read ${e.name}`));
			}), r.addEventListener("error", () => {
				n(r.error ?? /* @__PURE__ */ Error(`Unable to read ${e.name}`));
			}), r.readAsDataURL(e);
		});
	}
	downloadHTMLAs() {
		this.saveTextFileAs("prose-editor.html", this.createHTMLDocument(), "text/html;charset=utf-8", (e) => this.normalizeHTMLFilename(e));
	}
	downloadHTML(e) {
		this.downloadTextFile(e, this.createHTMLDocument(), "text/html;charset=utf-8");
	}
	downloadTextFile(e, t, n) {
		let r = new Blob([t], { type: n }), i = URL.createObjectURL(r), a = document.createElement("a");
		a.href = i, a.download = e, a.hidden = !0, document.body.append(a), a.click(), a.remove(), URL.revokeObjectURL(i);
	}
	async saveTextFileAs(e, t, n, r = (e) => e.trim()) {
		let i = window.showSaveFilePicker, a = r(e);
		if (a !== "") {
			if (typeof i != "function") {
				let e = window.prompt("File name", a);
				if (e === null || e.trim() === "") return;
				let i = r(e);
				if (i === "") return;
				this.downloadTextFile(i, t, n);
				return;
			}
			try {
				let e = /\.[a-z0-9]+$/i.exec(a)?.[0] ?? ".txt", r = await (await i.call(window, {
					suggestedName: a,
					types: [{
						description: "Text file",
						accept: { [n.split(";")[0] ?? "text/plain"]: [e] }
					}]
				})).createWritable();
				await r.write(new Blob([t], { type: n })), await r.close();
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				throw e;
			}
		}
	}
	normalizeHTMLFilename(e) {
		let t = e.trim();
		return t === "" ? "" : /\.(?:html?|xhtml)$/i.test(t) ? t : `${t}.html`;
	}
	createHTMLDocument() {
		return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>prose-editor</title>
</head>
<body>
${this.getHTML()}
${ze}
</body>
</html>
`;
	}
	dispatchInputEvent() {
		let e = this.getHTML();
		this.internalValueUpdate = !0, this.setStringAttribute("value", e), this.internalValueUpdate = !1, this.dispatchEvent(new CustomEvent("tp-prose-editor-input", {
			bubbles: !0,
			detail: { value: e }
		})), this.dispatchEvent(new CustomEvent("tp-prose-editor-change", {
			bubbles: !0,
			detail: { value: e }
		}));
	}
};
customElements.get("tp-prose-editor") || customElements.define("tp-prose-editor", He);
//#endregion
export { He as t };

//# sourceMappingURL=prose-editor.js.map