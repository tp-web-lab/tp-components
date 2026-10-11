import { resolveMarkdownIncludes as e } from "./markdown-includes.js";
import { t } from "../chunks/markdown2.js";
//#region src/utilities/markdown-source.ts
function n(e) {
	let t = e.replace(/\r\n?/g, "\n").split("\n"), n = [], r = [], i = null;
	for (let e = 0; e < t.length; e += 1) {
		let a = t[e] ?? "", o = a.match(/^(?:[ ]{0,3}:\s*)?[ ]{0,3}(`{3,}|~{3,})/);
		if (o?.[1] !== void 0) {
			let e = o[1][0] ?? "";
			i === null ? i = {
				marker: e,
				length: o[1].length
			} : e === i.marker && o[1].length >= i.length && (i = null), r.push(a);
			continue;
		}
		let s = (i === null ? a.match(/^ {0,3}<(script|style|textarea|template)\b/i) : null)?.[1]?.toLowerCase();
		if (s === void 0) {
			r.push(a);
			continue;
		}
		let c = [a];
		for (; !RegExp(`</${s}\\s*>`, "i").test(c.at(-1) ?? "") && e + 1 < t.length;) e += 1, c.push(t[e] ?? "");
		let l = n.push(c.join("\n")) - 1;
		r.push(`<!--tp-markdown-raw-text-${String(l)}-->`);
	}
	return {
		source: r.join("\n"),
		restore: (e) => n.reduce((e, t, n) => e.replace(`<!--tp-markdown-raw-text-${String(n)}-->`, t), e)
	};
}
async function r(e, t) {
	let r = n(t);
	return r.restore(await e.renderAsync(r.source)).replace(/<p(\s[^>]*)?>\s*<p>([\s\S]*?)<\/p>\s*<\/p>/gi, (e, t, n) => `<p${t ?? ""}>${n}</p>`);
}
function i(e = "/index.md") {
	return new t({
		path: e,
		pageNavRoot: !1
	});
}
async function a(e, t = "/index.md") {
	return r(i(t), e);
}
async function o(e, t = "/index.md") {
	return (await i(t).parseAsync(e)).tokens;
}
//#endregion
export { i as createTpMarkdownParser, o as parseMarkdownToTokens, a as renderMarkdownToHtml, r as renderProtectedMarkdown, e as resolveMarkdownIncludes };

//# sourceMappingURL=markdown-source.js.map