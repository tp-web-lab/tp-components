//#region src/languages/markdown/extensions/section-numbering/index.ts
function e(e, r = {}) {
	e.core.ruler.push("tp_section_numbering", (e) => {
		let i = e.env;
		if ((i.attributes?.sectionNumbering?.enabled ?? i.attributes?.sectionNumbering?.enable ?? r.enabled ?? !1) !== !0) return;
		let a = t(i.attributes?.sectionNumbering?.maxLevel ?? r.maxLevel ?? 6), o = Array.from({ length: a }, () => 0);
		for (let t = 0; t < e.tokens.length; t += 1) {
			let r = e.tokens[t];
			if (r?.type !== "heading_open") continue;
			let i = Number(r.tag.slice(1));
			if (!Number.isInteger(i) || i < 1 || i > a) continue;
			o[i - 1] = (o[i - 1] ?? 0) + 1;
			for (let e = i; e < o.length; e += 1) o[e] = 0;
			let s = o.slice(0, i).filter((e) => e > 0).join("."), c = e.tokens[t + 1];
			if (c?.type !== "inline") continue;
			c.children ??= [];
			let l = new e.Token("html_inline", "", 0);
			l.content = `<span data-section-number>${n(s)} </span>`, c.children.unshift(l);
		}
	});
}
function t(e) {
	let t = Number(e);
	return Number.isInteger(t) ? Math.min(Math.max(t, 1), 6) : 6;
}
function n(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
export { e as default };

