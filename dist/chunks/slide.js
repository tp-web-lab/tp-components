import { dt as e } from "./lib/typescript/typescript.js";
//#region ../tp-markdown/dist/markdown/extensions/slide/index.js
var t = "tp-md-slide-runtime-styles", n = "\n.tp-md-slide.reveal {\n  box-sizing: border-box;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  block-size: var(--tp-md-slide-height, 36rem);\n  margin-block: 1rem;\n  overflow: hidden;\n}\n\n.tp-md-slide.reveal * {\n  box-sizing: border-box;\n}\n\n.tp-md-slide.reveal .slides {\n  inset: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-inline-size: 100%;\n}\n\n.tp-md-slide.reveal .slides section {\n  top: 0 !important;\n  left: 0 !important;\n  padding: 0.75rem;\n  box-sizing: border-box;\n}\n\n.tp-md-slide.reveal .slides section,\n.tp-md-slide.reveal .slides section > * {\n  text-align: start !important;\n}\n\n.tp-md-slide.reveal .slides section {\n  max-block-size: 100%;\n  overflow-y: auto !important;\n  scrollbar-gutter: stable;\n}\n\n.tp-md-slide.reveal .slides section.present {\n  overflow-y: auto !important;\n}\n  \n.tp-md-slide.reveal h1,\n.tp-md-slide.reveal h2,\n.tp-md-slide.reveal h3,\n.tp-md-slide.reveal p,\n.tp-md-slide.reveal ul,\n.tp-md-slide.reveal ol,\n.tp-md-slide.reveal pre {\n  text-align: start !important;\n}\n";
function r(r, a = {}) {
	e(t, n), i(r, a);
}
function i(e, t) {
	let n = e.renderer, r = n.rules.fence;
	n.rules.fence = (n, i, o, c, l) => {
		let u = n[i];
		if (u === void 0) return "";
		let p = f(u.info);
		if (p.name !== "slide" && p.name !== "reveal") return typeof r == "function" ? r(n, i, o, c, l) : l.renderToken(n, i, o);
		let m = s(`${p.args} ${d(u)}`.trim()), h = c.attributes?.slide ?? c.attributes?.reveal ?? {}, g = {
			...t,
			...h,
			...m,
			options: {
				...t.options ?? {},
				...h.options ?? {},
				...m.options ?? {}
			}
		};
		return a(e, u.content.trim(), g, c);
	};
}
function a(e, t, n, r) {
	let i = n.className ?? "tp-md-slide", a = n.options ?? {}, s = p(t, /^---\s*$/m);
	return `
<div
  class="${h(i)} reveal"
  data-slide-options="${h(JSON.stringify(a))}"
  ${m("data-slide-theme", n.theme)}
>
  <div class="slides">
    ${s.map((t) => o(e, t, r)).join("\n")}
  </div>
</div>
`;
}
function o(e, t, n) {
	let r = p(t, /^--\s*$/m);
	return r.length <= 1 ? `<section>${e.render(t.trim(), n)}</section>` : `
<section>
  ${r.map((t) => `<section>${e.render(t.trim(), n)}</section>`).join("\n")}
</section>
`;
}
function s(e) {
	let t = c(e), n = t.className ?? t.class, r = t.theme, i = { ...l(t.options) ?? {} };
	for (let [e, n] of Object.entries(t)) e === "class" || e === "className" || e === "theme" || e === "options" || (i[e] = u(n));
	return {
		className: n,
		theme: r,
		options: i
	};
}
function c(e) {
	let t = {};
	for (let n of e.matchAll(/([a-zA-Z][\w-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/g)) {
		let e = n[1] ?? "";
		t[e] = (n[2] ?? "").replace(/^["']|["']$/g, "");
	}
	return t;
}
function l(e) {
	if (!(e === void 0 || e.trim() === "")) try {
		let t = JSON.parse(e);
		if (typeof t == "object" && t && !Array.isArray(t)) return t;
	} catch (e) {
		console.warn("Invalid slide JSON options:", e);
	}
}
function u(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	let t = Number(e);
	return Number.isFinite(t) && e.trim() !== "" ? t : e;
}
function d(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function f(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function p(e, t) {
	return e.split(t).map((e) => e.trim()).filter((e) => e !== "");
}
function m(e, t) {
	return t === void 0 ? "" : `${e}="${h(t)}"`;
}
function h(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
export { r as default };

//# sourceMappingURL=slide.js.map