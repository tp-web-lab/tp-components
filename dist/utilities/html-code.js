//#region src/utilities/html-code.ts
var e = /* @__PURE__ */ new Set([
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
]), t = /* @__PURE__ */ new Set(["script", "style"]), n = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.b.bdi.bdo.br.button.cite.code.data.del.dfn.em.i.img.input.ins.kbd.label.mark.q.ruby.s.samp.small.span.strong.sub.sup.time.u.var.wbr".split("."));
function r(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function i(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function a(e) {
	let t = [];
	for (let n of e.attributes) {
		if (n.value === "") {
			t.push(n.name);
			continue;
		}
		t.push(`${n.name}="${r(n.value)}"`);
	}
	return t.join(" ");
}
function o(e, t, n) {
	let r = "  ".repeat(t), a = e.replace(/\r\n/g, "\n").trim();
	if (a !== "") for (let e of a.split("\n")) {
		let t = e.trim();
		t !== "" && n.push(`${r}${i(t)}`);
	}
}
function s(e, t, n) {
	let r = "  ".repeat(t), i = e.replace(/\r\n?/g, "\n").split("\n");
	for (; i[0]?.trim() === "";) i.shift();
	for (; i.at(-1)?.trim() === "";) i.pop();
	if (i.length === 0) return;
	let a = Math.min(...i.filter((e) => e.trim() !== "").map((e) => e.match(/^[\t ]*/)?.[0].length ?? 0));
	for (let e of i) n.push(e.trim() === "" ? "" : `${r}${e.slice(a)}`);
}
function c(e) {
	if (e.nodeType === Node.TEXT_NODE || e.nodeType === Node.COMMENT_NODE) return !0;
	if (e.nodeType !== Node.ELEMENT_NODE) return !1;
	let t = e, r = t.tagName.toLowerCase();
	return n.has(r) && Array.from(t.childNodes).every(c);
}
function l(t) {
	if (t.nodeType === Node.TEXT_NODE) return i((t.textContent ?? "").replace(/\s+/g, " "));
	if (t.nodeType === Node.COMMENT_NODE) return `<!-- ${(t.textContent ?? "").trim()} -->`;
	let n = t, r = n.tagName.toLowerCase(), o = a(n), s = o === "" ? `<${r}>` : `<${r} ${o}>`;
	return e.has(r) ? s : `${s}${Array.from(n.childNodes).map(l).join("")}</${r}>`;
}
function u(n, r, d) {
	if (n.nodeType === Node.TEXT_NODE) {
		o(n.textContent ?? "", r, d);
		return;
	}
	if (n.nodeType === Node.COMMENT_NODE) {
		let e = (n.textContent ?? "").trim();
		e !== "" && d.push(`${"  ".repeat(r)}<!-- ${e} -->`);
		return;
	}
	if (n.nodeType !== Node.ELEMENT_NODE) return;
	let f = n, p = f.tagName.toLowerCase(), m = a(f), h = "  ".repeat(r), g = m === "" ? `<${p}>` : `<${p} ${m}>`;
	if (e.has(p)) {
		d.push(`${h}${g}`);
		return;
	}
	if (t.has(p)) {
		d.push(`${h}${g}`), s(f.textContent ?? "", r + 1, d), d.push(`${h}</${p}>`);
		return;
	}
	let _ = Array.from(f.childNodes);
	if (_.length === 0) {
		d.push(`${h}${g}</${p}>`);
		return;
	}
	if (!_.some((e) => e.nodeType === Node.ELEMENT_NODE) && _.length === 1 && _[0]?.nodeType === Node.TEXT_NODE) {
		let e = (_[0].textContent ?? "").replace(/\s+/g, " ").trim();
		if (e !== "") {
			d.push(`${h}${g}${i(e)}</${p}>`);
			return;
		}
	}
	if (_.every(c)) {
		let e = _.map(l).join("").trim();
		d.push(`${h}${g}${e}</${p}>`);
		return;
	}
	d.push(`${h}${g}`);
	for (let e of _) u(e, r + 1, d);
	d.push(`${h}</${p}>`);
}
function d(e) {
	let t = e.trim();
	if (t === "") return "";
	let n = new DOMParser().parseFromString(t, "text/html"), r = [];
	if (/<!doctype\s+html[\s>]/i.test(t) || /<html[\s>]/i.test(t)) {
		r.push("<!doctype html>");
		let e = n.documentElement;
		return e !== null && u(e, 0, r), r.join("\n");
	}
	let i = document.createElement("template");
	i.innerHTML = t;
	for (let e of Array.from(i.content.childNodes)) u(e, 0, r);
	return r.join("\n").trim();
}
//#endregion
export { d as formatHtmlForDisplay };

//# sourceMappingURL=html-code.js.map