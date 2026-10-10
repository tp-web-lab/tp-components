//#region src/languages/markdown/extensions/references/index.ts
function e(e, t) {
	e.core.ruler.before("block", "tp_extract_references", (r) => {
		let i = r.env, a = x(i), o = typeof i.path == "string" && i.path !== "" ? i.path : t.entryPath ?? "/index.md";
		r.src = n(e, a, r.src, o, t).source;
	});
}
function t(t, n = {}) {
	e(t, n), s(t), u(t, n);
}
function n(e, t, n, s, c) {
	let l = n.split("\n"), u = [];
	for (let n = 0; n < l.length; n += 1) {
		let r = l[n] ?? "", s = r.match(/^(\[@([^\]]+)\]|\[%([^\]]+)\]|\[\^([^\]]+)\]):\s*(.*)$/);
		if (s === null) {
			u.push(r);
			continue;
		}
		let c = i(s), d = a(s), f = [s[5] ?? ""], p = n + 1;
		for (; p < l.length;) {
			let e = l[p] ?? "";
			if (e.trim() === "") {
				f.push(""), p += 1;
				continue;
			}
			if (/^( {2,}|\t)/.test(e)) {
				f.push(e.replace(/^( {2,}|\t)/, "")), p += 1;
				continue;
			}
			break;
		}
		n = p - 1, o(e, t, c, d, f.join("\n").trim());
	}
	return r(e, t, u.join("\n"), s, c), { source: u.join("\n") };
}
function r(e, t, r, i, a) {
	let o = a.files ?? {}, s = r.matchAll(/^::(bibliography|biblio|glossary|notes)\{([^}]*)\}\s*$/gm);
	for (let r of s) {
		let s = r[2]?.trim() ?? "";
		if (s === "") continue;
		let c = A(i, s), l = o[c];
		typeof l == "string" && n(e, t, l, c, a);
	}
}
function i(e) {
	return e[2] === void 0 ? e[3] === void 0 ? "notes" : "glossary" : "bibliography";
}
function a(e) {
	return (e[2] ?? e[3] ?? e[4] ?? "").trim();
}
function o(e, t, n, r, i) {
	if (r === "") return;
	let a = j(r), o = C(n, a), s = `popover-${o}`, c = e.render(i), l = {
		key: r,
		id: o,
		popoverId: s,
		raw: i,
		html: c,
		text: M(c)
	};
	if (n === "bibliography") {
		t.bibliography.set(a, l);
		return;
	}
	if (n === "glossary") {
		t.glossary.set(a, l);
		return;
	}
	t.notes.set(a, l), t.noteOrder.includes(a) || t.noteOrder.push(a);
}
function s(e) {
	e.inline.ruler.before("emphasis", "tp_reference_inline", (e, t) => {
		let n = e.src.slice(e.pos), r = n.match(/^\[@([^\]]+)\]/) ?? n.match(/^\[%([^\]]+)\]/) ?? n.match(/^\[\^([^\]]+)\]/);
		if (r === null) return !1;
		let i = r[0], a = r[1]?.trim() ?? "";
		if (a === "") return !1;
		if (!t) {
			let t = e.push(c(i), "", 0);
			t.content = "", t.meta = { key: a };
		}
		return e.pos += i.length, !0;
	}), e.inline.ruler.before("emphasis", "tp_index_inline", (e, t) => {
		let n = e.src.slice(e.pos).match(/^:index:`([^`]+)`/);
		if (n === null) return !1;
		let r = n[1]?.trim() ?? "";
		if (r === "") return !1;
		let i = e.env, a = x(i), o = `index-${N(r)}-${String(a.indexEntries.length + 1)}`;
		if (!t) {
			a.indexEntries.push({
				id: o,
				key: r
			});
			let t = e.push("tp_index_inline", "", 0);
			t.content = "", t.meta = {
				key: r,
				id: o
			};
		}
		return e.pos += n[0].length, !0;
	}), e.renderer.rules.tp_cite_inline = (e, t, n, r) => l(e[t], r, "bibliography"), e.renderer.rules.tp_glossary_inline = (e, t, n, r) => l(e[t], r, "glossary"), e.renderer.rules.tp_note_inline = (e, t, n, r) => l(e[t], r, "notes"), e.renderer.rules.tp_index_inline = (e, t) => {
		let n = D(e[t]);
		return n === null ? "" : `<span id="${F(n.id)}" data-index-entry="${F(n.key)}" aria-hidden="true"></span>`;
	};
}
function c(e) {
	return e.startsWith("[@") ? "tp_cite_inline" : e.startsWith("[%") ? "tp_glossary_inline" : "tp_note_inline";
}
function l(e, t, n) {
	let r = E(e);
	if (r === "") return "";
	let i = x(t), a = j(r), o = S(i, n, a), s = o?.id ?? C(n, a), c = f(o);
	if (n === "bibliography") return `<a href="#${F(s)}" class="tp-md-reference-link" data-cite-ref="${F(s)}">[${P(r)}]${c}</a>`;
	if (n === "glossary") return `<a href="#${F(s)}" class="tp-md-reference-link tp-md-glossary-link" data-glossary-link="${F(s)}">${P(r)}${c}</a>`;
	let l = w(i, a);
	return `<a href="#${F(s)}" class="tp-md-reference-link tp-md-note-link" data-note-ref="${F(s)}">[${P(l)}]${c}</a>`;
}
function u(e, t) {
	e.block.ruler.before("paragraph", "tp_references_block", (e, t, n, r) => {
		let i = k(e, t).trim().match(/^::(bibliography|biblio|glossary|notes|index)\{([^}]*)\}\s*$/);
		if (i === null) return !1;
		if (r) return !0;
		let a = e.push("tp_references_block", "", 0);
		return a.block = !0, a.meta = {
			kind: T(i[1] ?? ""),
			file: i[2]?.trim() ?? ""
		}, e.line = t + 1, !0;
	}), e.renderer.rules.tp_references_block = (n, r, i, a) => {
		let o = n[r];
		if (o === void 0) return "";
		let s = O(o.meta), c = x(a);
		return s.file !== "" && p(e, c, s.kind, s.file, a, t), s.kind === "bibliography" ? [d(), m("tp-md-bibliography", c.bibliography)].join("") : s.kind === "glossary" ? [d(), m("tp-md-glossary", c.glossary)].join("") : s.kind === "notes" ? [d(), h(c)].join("") : g(c.indexEntries);
	};
}
function d() {
	return "\n<style>\n.tp-md-reference-link {\n  position: relative;\n  text-decoration: underline dotted;\n  text-underline-offset: 0.2em;\n}\n\n.tp-md-reference-tooltip {\n  position: absolute;\n  z-index: 20;\n  inset-block-end: 100%;\n  inset-inline-start: 0;\n  display: none;\n  inline-size: max-content;\n  max-inline-size: 32rem;\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n  background: Canvas;\n  color: CanvasText;\n  border: 1px solid color-mix(in srgb, CanvasText 20%, transparent);\n  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);\n  white-space: normal;\n}\n\n.tp-md-reference-link:hover .tp-md-reference-tooltip,\n.tp-md-reference-link:focus .tp-md-reference-tooltip {\n  display: block;\n}\n</style>\n";
}
function f(e) {
	return e === void 0 ? "" : `<span class="tp-md-reference-tooltip" role="tooltip">${P(e.text)}</span>`;
}
function p(e, t, r, i, a, o) {
	if (r === "index") return;
	let s = o.files ?? {}, c = A(typeof a.path == "string" && a.path !== "" ? a.path : o.entryPath ?? "/index.md", i), l = s[c];
	typeof l == "string" && n(e, t, l, c, o);
}
function m(e, t) {
	let n = [`<dl class="${F(e)}">`];
	for (let e of t.values()) n.push(`<dt id="${F(e.id)}">${P(e.key)}</dt>`), n.push(`<dd data-reference-def="${F(e.id)}">${e.html}</dd>`);
	return n.push("</dl>"), n.join("");
}
function h(e) {
	let t = ["<dl class=\"tp-md-notes\">"], n = [...e.noteRefs, ...e.noteOrder.filter((t) => !e.noteRefs.includes(t))];
	for (let r of n) {
		let n = e.notes.get(r);
		if (n === void 0) continue;
		let i = w(e, r);
		t.push(`<dt id="${F(n.id)}">[${P(i)}]</dt>`), t.push(`<dd data-reference-def="${F(n.id)}">${n.html}</dd>`);
	}
	return t.push("</dl>"), t.join("");
}
function g(e) {
	return y(_(e), !0);
}
function _(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.key.split(",").map((e) => e.trim()).filter((e) => e !== "");
		e.length !== 0 && v(t, e, n.id);
	}
	return t;
}
function v(e, t, n) {
	let r = t[0];
	if (r === void 0) return;
	let i = j(r), a = e.get(i);
	a === void 0 && (a = {
		label: r,
		targets: [],
		children: /* @__PURE__ */ new Map()
	}, e.set(i, a));
	let o = t.slice(1);
	if (o.length === 0) {
		a.targets.push(n);
		return;
	}
	v(a.children, o, n);
}
function y(e, t = !1) {
	let n = [`<dl${t ? " class=\"tp-md-index\"" : ""}>`];
	for (let t of [...e.values()].sort((e, t) => e.label.localeCompare(t.label, void 0, {
		sensitivity: "base",
		numeric: !0
	}))) n.push("<dt>"), n.push(P(t.label)), t.targets.length > 0 && (n.push(" "), n.push(b(t.targets))), n.push("</dt>"), t.children.size > 0 && (n.push("<dd>"), n.push(y(t.children)), n.push("</dd>"));
	return n.push("</dl>"), n.join("");
}
function b(e) {
	return e.map((e, t) => `<a href="#${F(e)}">${String(t + 1)}</a>`).join(", ");
}
function x(e) {
	if (e.__tp_references !== void 0) return e.__tp_references;
	let t = {
		bibliography: /* @__PURE__ */ new Map(),
		glossary: /* @__PURE__ */ new Map(),
		notes: /* @__PURE__ */ new Map(),
		noteOrder: [],
		noteRefs: [],
		indexEntries: []
	};
	return e.__tp_references = t, t;
}
function S(e, t, n) {
	return t === "bibliography" ? e.bibliography.get(n) : t === "glossary" ? e.glossary.get(n) : e.notes.get(n);
}
function C(e, t) {
	return e === "bibliography" ? `bib-${N(t)}` : e === "glossary" ? `glo-${N(t)}` : `note-${N(t)}`;
}
function w(e, t) {
	let n = e.noteRefs.indexOf(t);
	return n === -1 && (e.noteRefs.push(t), n = e.noteRefs.length - 1), String(n + 1);
}
function T(e) {
	return e === "biblio" || e === "bibliography" ? "bibliography" : e === "glossary" ? "glossary" : e === "notes" ? "notes" : "index";
}
function E(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.key == "string" ? t.key : "";
}
function D(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.key == "string" && typeof t.id == "string" ? t : null;
}
function O(e) {
	if (typeof e != "object" || !e) return {
		kind: "bibliography",
		file: ""
	};
	let t = e;
	return {
		kind: typeof t.kind == "string" ? T(t.kind) : "bibliography",
		file: typeof t.file == "string" ? t.file : ""
	};
}
function k(e, t) {
	let n = (e.bMarks[t] ?? 0) + (e.tShift[t] ?? 0), r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
function A(e, t) {
	if (t.startsWith("/")) return t;
	let n = e.split("/").filter(Boolean);
	n.pop();
	let r = [...n];
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			r.pop();
			continue;
		}
		r.push(e);
	}
	return `/${r.join("/")}`;
}
function j(e) {
	return e.trim().toLowerCase();
}
function M(e) {
	return e.replaceAll(/<[^>]*>/g, "").replaceAll(/\s+/g, " ").trim();
}
function N(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
function P(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function F(e) {
	return P(e);
}
//#endregion
export { t as default };

//# sourceMappingURL=index.js.map