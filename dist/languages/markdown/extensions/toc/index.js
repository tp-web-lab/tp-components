//#region src/languages/markdown/extensions/toc/index.ts
function e(e, r = {}) {
	e.core.ruler.push("tp_collect_toc", (e) => {
		let t = e.env, r = Number(t.attributes?.toc?.maxLevel ?? 6), i = [];
		for (let t = 0; t < e.tokens.length; t += 1) {
			let a = e.tokens[t];
			if (a?.type !== "heading_open") continue;
			let s = Number(a.tag.slice(1));
			if (!Number.isInteger(s) || s < 1 || s > r) continue;
			let c = e.tokens[t + 1], l = c?.type === "inline" ? n(c) : "";
			if (l === "") continue;
			let u = a.attrGet("id"), d = u ?? o(l);
			u === null && a.attrSet("id", d), i.push({
				level: s,
				id: d,
				title: l
			});
		}
		t.__tp_toc = i;
	}), e.block.ruler.before("paragraph", "table_of_contents", (e, t, n, i) => {
		let a = (e.bMarks[t] ?? 0) + (e.tShift[t] ?? 0), o = e.eMarks[t] ?? a, s = e.src.slice(a, o).trim(), c = s.match(/^\[\[toc(?::(.*))?\]\]$/i) ?? s.match(/^\[toc(?::(.*))?\]$/i) ?? s.match(/^\$\{toc(?::(.*))?\}$/i);
		if (c === null) return !1;
		if (i) return !0;
		let l = typeof c[1] == "string" && c[1].trim() !== "" ? c[1].trim() : r.defaultTitle ?? "Contents", u = e.push("toc_body", "", 0);
		return u.block = !0, u.meta = { title: l }, e.line = t + 1, !0;
	}), e.renderer.rules.toc_body = (e, n, r, o) => {
		let c = e[n];
		if (c === void 0) return "";
		let l = o.__tp_toc ?? [], u = typeof c.meta == "object" && c.meta !== null && typeof c.meta.title == "string" ? c.meta.title : "Contents", d = t(l);
		return `
${a()}
<details data-markdown-toc>
  <summary>${s(u)}</summary>
  ${i(d)}
</details>
`;
	};
}
function t(e) {
	let t = [], n = [{
		level: 0,
		children: t
	}];
	for (let t of e) {
		let e = {
			...t,
			children: []
		};
		for (; n.length > 1 && t.level <= r(n).level;) n.pop();
		r(n).children.push(e), n.push(e);
	}
	return t;
}
function n(e) {
	return (e.children ?? []).map((e) => e.type === "html_inline" ? e.content.replace(/<[^>]*>/g, "") : e.content).join("").trim();
}
function r(e) {
	let t = e.at(-1);
	return t === void 0 ? {
		level: 0,
		children: []
	} : t;
}
function i(e) {
	return e.length === 0 ? "<ul></ul>" : `
<ul${e.some((e) => /^\d+(\.\d+)*\s/.test(e.title)) ? " data-toc-numbered" : ""}>
  ${e.map((e) => `
<li data-level="${e.level}">
  <a href="#${c(e.id)}">
    ${s(e.title)}
  </a>

  ${i(e.children)}
</li>`).join("")}
</ul>
`;
}
function a() {
	return "\n<style>\n[data-markdown-toc] ul[data-toc-numbered] {\n  list-style: none;\n  padding-inline-start: 1.25rem;\n}\n\n[data-markdown-toc] ul[data-toc-numbered] ul[data-toc-numbered] {\n  padding-inline-start: 1.5rem;\n}\n</style>\n";
}
function o(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function c(e) {
	return s(e);
}
//#endregion
export { e as default };

//# sourceMappingURL=index.js.map