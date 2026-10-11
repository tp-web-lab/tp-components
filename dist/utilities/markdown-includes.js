function e(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function t(e, t, a = 0) {
	if (a > 12) throw Error("Include depth exceeded.");
	let o = /(^[^\S\r\n]*:?[^\S\r\n]*)?::include\{([^}]+)\}/gm, s = [], c = 0;
	for (let l of e.matchAll(o)) {
		let o = l.index, u = l[1] ?? "", d = i(l[2] ?? ""), f = d.path;
		o === void 0 || f === void 0 || f === "" || (s.push(e.slice(c, o)), s.push(n(await r(f, t, a, d.mode), u)), c = o + l[0].length);
	}
	return s.push(e.slice(c)), s.join("");
}
function n(e, t) {
	if (t === "") return e;
	let n = t.match(/^([^\S\r\n]*):([^\S\r\n]*)$/);
	if (n !== null) {
		let r = `${n[1] ?? ""}${" ".repeat(1 + (n[2]?.length ?? 0))}`;
		return /^:{3,}\s+[a-z]/i.test(e) ? `${n[1] ?? ""}:\n${e.split("\n").map((e) => `${r}${e}`).join("\n")}` : e.split("\n").map((e, n) => `${n === 0 ? t : r}${e}`).join("\n");
	}
	return e.split("\n").map((e) => `${t}${e}`).join("\n");
}
async function r(n, r, i, a) {
	let o = new URL(n, r), s = o.pathname.toLowerCase();
	if (a === "raw") {
		let e = await fetch(o.href, { cache: "no-store" });
		return e.ok ? e.text() : `Unable to include file: ${o.pathname} (${String(e.status)})`;
	}
	if (s.endsWith(".adoc") || s.endsWith(".asciidoc")) return `<tp-asciidoc src="${e(o.href)}"></tp-asciidoc>`;
	if (s.endsWith(".rst") || s.endsWith(".rest")) return `<tp-restructuredtext src="${e(o.href)}"></tp-restructuredtext>`;
	if (s.endsWith(".html") || s.endsWith(".htm")) return `<tp-include src="${e(o.href)}"></tp-include>`;
	let c = await fetch(o.href, { cache: "no-store" });
	if (!c.ok) return `<pre class="tp-markdown-error"><code>Unable to include file: ${e(o.pathname)} (${String(c.status)})</code></pre>`;
	let l = await c.text();
	return s.endsWith(".md") ? t(l, o, i + 1) : s.endsWith(".svg") ? l : `<pre><code>${e(l)}</code></pre>`;
}
function i(e) {
	let t = /(?:^|\s)mode\s*=\s*(?:"(auto|raw)"|'(auto|raw)'|(auto|raw))(?=\s|$)/i, n = e.match(t), r = (n?.[1] ?? n?.[2] ?? n?.[3] ?? "auto").toLowerCase();
	return {
		path: (n === null ? e : e.replace(t, "")).trim(),
		mode: r === "raw" ? "raw" : "auto"
	};
}
//#endregion
export { n as applyIncludePrefix, r as renderInclude, t as resolveMarkdownIncludes };

//# sourceMappingURL=markdown-includes.js.map