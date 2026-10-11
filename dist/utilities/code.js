//#region src/utilities/code.ts
var e = {
	c: "c",
	cpp: "cpp",
	css: "css",
	h: "c",
	htm: "html",
	html: "html",
	java: "java",
	js: "javascript",
	json: "json",
	jsx: "jsx",
	md: "markdown",
	mjs: "javascript",
	pl: "prolog",
	py: "python",
	rest: "restructuredtext",
	rst: "restructuredtext",
	sh: "shell",
	sql: "sql",
	svg: "xml",
	ts: "typescript",
	tsx: "tsx",
	txt: "plaintext",
	xml: "xml",
	yaml: "yaml",
	yml: "yaml"
};
function t(e) {
	let t = e.replace(/\r\n/g, "\n").split("\n");
	for (; t.length > 0 && t[0]?.trim() === "";) t.shift();
	for (; t.length > 0 && t[t.length - 1]?.trim() === "";) t.pop();
	if (t.length === 0) return "";
	let n = null;
	for (let e of t) {
		if (e.trim() === "") continue;
		let t = e.match(/^[\t ]*/), r = t ? t[0].length : 0;
		(n === null || r < n) && (n = r);
	}
	return n === null || n === 0 ? t.join("\n") : t.map((e) => e.trim() === "" ? "" : e.slice(n)).join("\n");
}
function n(t) {
	let n = t.trim().toLowerCase().split(/[?#]/, 1)[0] ?? "", r = /\.([a-z0-9]+)$/.exec(n);
	return r?.[1] ? e[r[1]] ?? "plaintext" : "plaintext";
}
function r(e) {
	let t = e?.trim().toLowerCase() ?? "";
	return t === "" ? "plaintext" : t;
}
async function i(e, t) {
	let i = [e], c = o(e, "parent");
	c !== null && !i.includes(c) && i.push(c);
	let l = o(e, "top");
	l !== null && !i.includes(l) && i.push(l);
	let u = s(e);
	u !== null && !i.includes(u) && i.push(u);
	let d = null, f = "", p = e, m = !1;
	for (let t of i) {
		let n = await globalThis.fetch(t);
		if (!n.ok) {
			d = n;
			continue;
		}
		let r = await n.text(), i = a(e, n, r);
		if (d = n, !i) {
			p = t, f = r, m = !0;
			break;
		}
	}
	if (d === null || !d.ok || !m) {
		let t = d?.status ?? 0;
		throw Error(`Failed to fetch "${e}" (${String(t)}).`);
	}
	return {
		filename: p,
		language: t === void 0 || t.trim() === "" ? n(p) : r(t),
		value: f
	};
}
function a(e, t, n) {
	let r = e.trim().toLowerCase().split(/[?#]/, 1)[0] ?? "", i = /\.([a-z0-9]+)$/.exec(r)?.[1] ?? "";
	if (i === "html" || i === "htm" || i === "xhtml") return !1;
	let a = (t.headers.get("content-type") ?? "").toLowerCase(), o = n.trimStart().toLowerCase();
	return o.startsWith("<!doctype html") || o.startsWith("<html") ? (a.includes("text/html"), !0) : !1;
}
function o(e, t) {
	let n = e.trim();
	if (n === "" || !n.startsWith("./") && !n.startsWith("../") || typeof window > "u") return null;
	try {
		let e = t === "parent" ? window.parent?.location?.href : window.top?.location?.href;
		return !e || e === "about:blank" ? null : new URL(n, e).href;
	} catch {
		return null;
	}
}
function s(e) {
	let t = e.trim();
	if (!t.startsWith("../")) return null;
	let n = t.replace(/^(\.\.\/)+/, "").replace(/^\.\//, "");
	return n === "" ? null : `/docs/${n}`;
}
function c(e, i = document) {
	let a = e === void 0 || e.trim() === "" ? "" : r(e), o = a === "" ? "script[type^=\"tp/\"]" : `script[type="tp/${a}"]`, s = i.querySelector(o);
	if (!(s instanceof HTMLScriptElement)) return null;
	let c = s.getAttribute("filename") ?? "", l = a;
	if (l === "") {
		let e = s.getAttribute("type") ?? "";
		l = /^tp\/(.+)$/.exec(e.trim().toLowerCase())?.[1] ?? "";
	}
	if (c !== "") {
		let e = n(c);
		(l === "" || l === "plaintext") && (l = e);
	}
	return l === "" && (l = "plaintext"), {
		filename: c,
		language: l,
		value: t(s.textContent ?? "")
	};
}
function l(e, i = document) {
	let a = i.querySelector("template");
	if (!(a instanceof HTMLTemplateElement)) return null;
	let o = a.getAttribute("filename") ?? "", s = e === void 0 || e.trim() === "" ? "" : r(e);
	if (o !== "") {
		let e = n(o);
		(s === "" || s === "plaintext") && (s = e);
	}
	return s === "" && (s = "plaintext"), {
		filename: o,
		language: s,
		value: t(a.innerHTML)
	};
}
function u(e, t) {
	if (e == null) throw Error(t);
	return e;
}
//#endregion
export { t as dedent, u as expectDefined, i as getCodeFromFile, c as getCodeFromScript, l as getCodeFromTemplate, n as getLanguageFromFilename };

//# sourceMappingURL=code.js.map