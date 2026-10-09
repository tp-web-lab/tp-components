//#region src/languages/markdown/extensions/web-component/index.ts
var e = /* @__PURE__ */ new Set([
	"script",
	"style",
	"textarea",
	"template"
]), t = /* @__PURE__ */ new Set([
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
function n(e) {
	r(e), i(e);
}
function r(n) {
	n.block.ruler.before(f(n), "web_component_block", (e, t, n, r) => {
		let i = a(l(e, t).trim());
		if (i === null) return !1;
		let s = o(i.info);
		if (s === null) return !1;
		if (r) return !0;
		let u = c(e, t, n, i.fence), d = e.push("web_component_block", "", 0);
		return d.content = u.content, d.meta = s, d.block = !0, e.line = u.nextLine, !0;
	}, { alt: [
		"paragraph",
		"reference",
		"blockquote",
		"list"
	] }), n.renderer.rules.web_component_block = (r, i) => {
		let a = r[i];
		if (a === void 0) return "";
		let o = d(a.meta, "div");
		if (t.has(o.tag)) return `<${o.tag}${o.attributes === "" ? "" : ` ${o.attributes}`}>\n`;
		let s = e.has(o.tag) ? a.content : o.tag === "p" ? n.renderInline(a.content.trim()) : n.render(a.content);
		return `<${o.tag}${o.attributes === "" ? "" : ` ${o.attributes}`}>
${s}
</${o.tag}>
`;
	};
}
function i(e) {
	e.inline.ruler.before("emphasis", "web_component_inline", (e, t) => {
		if (e.src[e.pos] !== ":") return !1;
		let n = e.src.slice(e.pos).match(/^:([a-z][a-z0-9-]*):([^\n]*?)\{([^}\n]*)\}/i);
		if (n === null) return !1;
		let r = n[1] ?? "", i = n[2] ?? "", a = `{${n[3] ?? ""}}`, o = u(r), c = s(a);
		if (o === "div") return !1;
		if (!t) {
			let t = e.push("web_component_inline", "", 0);
			t.content = i.trim(), t.meta = {
				tag: o,
				attributes: c
			};
		}
		return e.pos += n[0].length, !0;
	}), e.renderer.rules.web_component_inline = (n, r) => {
		let i = n[r];
		if (i === void 0) return "";
		let a = d(i.meta, "span"), o = e.utils.escapeHtml(i.content);
		return t.has(a.tag) ? `<${a.tag}${a.attributes === "" ? "" : ` ${a.attributes}`}>` : `<${a.tag}${a.attributes === "" ? "" : ` ${a.attributes}`}>${o}</${a.tag}>`;
	};
}
function a(e) {
	let t = e.match(/^(:{3,})(.*)$/);
	if (t === null) return null;
	let n = t[1];
	return n === void 0 ? null : {
		fence: n,
		info: t[2]?.trim() ?? ""
	};
}
function o(e) {
	let t = e.match(/^([a-z][a-z0-9-]*)(?:\s+(\{[\s\S]*\}))?$/i);
	if (t === null) return null;
	let n = t[1];
	if (n === void 0) return null;
	let r = u(n);
	return r === "div" && n !== "div" ? null : {
		tag: r,
		attributes: s(t[2] ?? "")
	};
}
function s(e) {
	let t = e.trim();
	return t === "" || !t.startsWith("{") || !t.endsWith("}") ? "" : t.slice(1, -1).trim();
}
function c(e, t, n, r) {
	let i = [], a = t + 1;
	for (; a < n;) {
		let t = l(e, a);
		if (t.trim() === r) return {
			content: i.join("\n"),
			nextLine: a + 1
		};
		i.push(t), a += 1;
	}
	return {
		content: i.join("\n"),
		nextLine: a
	};
}
function l(e, t) {
	let n = e.bMarks[t] ?? 0, r = e.tShift[t] ?? 0, i = e.eMarks[t] ?? n, a = n + r;
	return e.src.slice(a, i);
}
function u(e) {
	let t = e.trim().toLowerCase();
	return /^[a-z][a-z0-9-]*$/.test(t) ? t : "div";
}
function d(e, t) {
	if (typeof e == "object" && e && typeof e.tag == "string") {
		let n = e;
		return {
			tag: u(n.tag ?? t),
			attributes: typeof n.attributes == "string" ? n.attributes.trim() : ""
		};
	}
	return {
		tag: t,
		attributes: ""
	};
}
function f(e) {
	return e.block.ruler.__rules__?.[0]?.name ?? "fence";
}
//#endregion
export { n as default };

