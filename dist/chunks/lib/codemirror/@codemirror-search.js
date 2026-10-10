import { Et as e, Ot as t, Q as n, Tt as r, X as i, Y as a, _t as o, at as s, bt as c, gt as l, ht as u, it as d, kt as f, ot as p, pt as m, q as h, st as g, vt as ee, wt as te, xt as ne, yt as re } from "./@codemirror-autocomplete.js";
//#region ../node_modules/.pnpm/@codemirror+search@6.7.1/node_modules/@codemirror/search/dist/index.js
var _ = typeof String.prototype.normalize == "function" ? (e) => e.normalize("NFKD") : (e) => e, v = class {
	constructor(e, t, n = 0, r = e.length, i, a) {
		this.test = a, this.value = {
			from: 0,
			to: 0,
			precise: !1
		}, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(n, r), this.bufferStart = n, this.normalize = i ? (e) => i(_(e)) : _, this.query = this.normalize(t);
	}
	peek() {
		if (this.bufferPos == this.buffer.length) {
			if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done) return -1;
			this.bufferPos = 0, this.buffer = this.iter.value;
		}
		return te(this.buffer, this.bufferPos);
	}
	next() {
		for (; this.matches.length;) this.matches.pop();
		return this.nextOverlapping();
	}
	nextOverlapping() {
		for (;;) {
			let e = this.peek();
			if (e < 0) return this.done = !0, this;
			let t = f(e), n = this.bufferStart + this.bufferPos;
			this.bufferPos += r(e);
			let i = this.normalize(t);
			if (i.length) for (let e = 0, r = n, a = !0;; e++) {
				let n = i.charCodeAt(e), o = this.match(n, r, a, this.bufferPos + this.bufferStart, e == i.length - 1);
				if (o) return this.value = o, this;
				if (e == i.length - 1) break;
				a && e < t.length && t.charCodeAt(e) == n ? r++ : a = !1;
			}
		}
	}
	match(e, t, n, r, i) {
		let a = null;
		for (let t = 0; t < this.matches.length;) {
			let n = this.matches[t], o = !1;
			this.query.charCodeAt(n.index) == e && (n.index == this.query.length - 1 ? a = {
				from: n.from,
				to: r,
				precise: i && n.precise
			} : (n.index++, o = !0)), o ? t++ : this.matches.splice(t, 1);
		}
		return this.query.charCodeAt(0) == e && (this.query.length == 1 ? a = {
			from: t,
			to: r,
			precise: n && i
		} : this.matches.push({
			from: t,
			index: 1,
			precise: n
		})), a && this.test && !this.test(a.from, a.to, this.buffer, this.bufferStart) && (a = null), a;
	}
};
typeof Symbol < "u" && (v.prototype[Symbol.iterator] = function() {
	return this;
});
var y = {
	from: -1,
	to: -1,
	match: /*@__PURE__*/ /.*/.exec(""),
	precise: !0
}, b = "gm" + (/x/.unicode == null ? "" : "u"), x = class {
	constructor(e, t, n, r = 0, i = e.length) {
		if (this.text = e, this.to = i, this.curLine = "", this.done = !1, this.value = y, /\\[sWDnr]|\n|\r|\[\^/.test(t)) return new w(e, t, n, r, i);
		this.re = new RegExp(t, b + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.iter = e.iter();
		let a = e.lineAt(r);
		this.curLineStart = a.from, this.matchPos = T(e, r), this.getLine(this.curLineStart);
	}
	getLine(e) {
		this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
	}
	nextLine() {
		this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
	}
	next() {
		for (let e = this.matchPos - this.curLineStart;;) {
			this.re.lastIndex = e;
			let t = this.matchPos <= this.to && this.re.exec(this.curLine);
			if (t) {
				let n = this.curLineStart + t.index, r = n + t[0].length;
				if (this.matchPos = T(this.text, r + +(n == r)), n == this.curLineStart + this.curLine.length && this.nextLine(), (n < r || n > this.value.to) && (!this.test || this.test(n, r, t))) return this.value = {
					from: n,
					to: r,
					precise: !0,
					match: t
				}, this;
				e = this.matchPos - this.curLineStart;
			} else if (this.curLineStart + this.curLine.length < this.to) this.nextLine(), e = 0;
			else return this.done = !0, this;
		}
	}
}, S = /*@__PURE__*/ new WeakMap(), C = class e {
	constructor(e, t) {
		this.from = e, this.text = t;
	}
	get to() {
		return this.from + this.text.length;
	}
	static get(t, n, r) {
		let i = S.get(t);
		if (!i || i.from >= r || i.to <= n) {
			let i = new e(n, t.sliceString(n, r));
			return S.set(t, i), i;
		}
		if (i.from == n && i.to == r) return i;
		let { text: a, from: o } = i;
		return o > n && (a = t.sliceString(n, o) + a, o = n), i.to < r && (a += t.sliceString(i.to, r)), S.set(t, new e(o, a)), new e(n, a.slice(n - o, r - o));
	}
}, w = class {
	constructor(e, t, n, r, i) {
		this.text = e, this.to = i, this.done = !1, this.value = y, this.matchPos = T(e, r), this.re = new RegExp(t, b + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.flat = C.get(e, r, this.chunkEnd(r + 5e3));
	}
	chunkEnd(e) {
		return e >= this.to ? this.to : this.text.lineAt(e).to;
	}
	next() {
		for (;;) {
			let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
			if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
				let e = this.flat.from + t.index, n = e + t[0].length;
				if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(e, n, t))) return this.value = {
					from: e,
					to: n,
					precise: !0,
					match: t
				}, this.matchPos = T(this.text, n + +(e == n)), this;
			}
			if (this.flat.to == this.to) return this.done = !0, this;
			this.flat = C.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
		}
	}
};
typeof Symbol < "u" && (x.prototype[Symbol.iterator] = w.prototype[Symbol.iterator] = function() {
	return this;
});
function ie(e) {
	try {
		return new RegExp(e, b), !0;
	} catch {
		return !1;
	}
}
function T(e, t) {
	if (t >= e.length) return t;
	let n = e.lineAt(t), r;
	for (; t < n.to && (r = n.text.charCodeAt(t - n.from)) >= 56320 && r < 57344;) t++;
	return t;
}
var E = (e) => {
	let { state: t } = e, n = String(t.doc.lineAt(e.state.selection.main.head).number), { close: r, result: i } = s(e, {
		label: t.phrase("Go to line"),
		input: {
			type: "text",
			name: "line",
			value: n
		},
		focus: !0,
		submitLabel: t.phrase("go")
	});
	return i.then((n) => {
		let i = n && /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(n.elements.line.value);
		if (!i) {
			e.dispatch({ effects: r });
			return;
		}
		let o = t.doc.lineAt(t.selection.main.head), [, s, c, l, d] = i, f = l ? +l.slice(1) : 0, p = c ? +c : o.number;
		if (c && d) {
			let e = p / 100;
			s && (e = e * (s == "-" ? -1 : 1) + o.number / t.doc.lines), p = Math.round(t.doc.lines * e);
		} else c && s && (p = p * (s == "-" ? -1 : 1) + o.number);
		let m = t.doc.line(Math.max(1, Math.min(t.doc.lines, p))), h = u.cursor(m.from + Math.max(0, Math.min(f, m.length)));
		e.dispatch({
			effects: [r, a.scrollIntoView(h.from, { y: "center" })],
			selection: h
		});
	}), !0;
}, ae = ({ state: e, dispatch: t }) => {
	let { selection: n } = e, r = u.create(n.ranges.map((t) => e.wordAt(t.head) || u.cursor(t.head)), n.mainIndex);
	return r.eq(n) ? !1 : (t(e.update({ selection: r })), !0);
};
function oe(e, t) {
	let { main: n, ranges: r } = e.selection, i = e.wordAt(n.head), a = i && i.from == n.from && i.to == n.to;
	for (let n = !1, i = new v(e.doc, t, r[r.length - 1].to);;) if (i.next(), i.done) {
		if (n) return null;
		i = new v(e.doc, t, 0, Math.max(0, r[r.length - 1].from - 1)), n = !0;
	} else {
		if (n && r.some((e) => e.from == i.value.from)) continue;
		if (a) {
			let t = e.wordAt(i.value.from);
			if (!t || t.from != i.value.from || t.to != i.value.to) continue;
		}
		return i.value;
	}
}
var D = ({ state: e, dispatch: t }) => {
	let { ranges: n } = e.selection;
	if (n.some((e) => e.from === e.to)) return ae({
		state: e,
		dispatch: t
	});
	let r = e.sliceDoc(n[0].from, n[0].to);
	if (e.selection.ranges.some((t) => e.sliceDoc(t.from, t.to) != r)) return !1;
	let i = oe(e, r);
	return i ? (t(e.update({
		selection: e.selection.addRange(u.range(i.from, i.to), !1),
		effects: a.scrollIntoView(i.to)
	})), !0) : !1;
}, O = /*@__PURE__*/ o.define({ combine(t) {
	return e(t, {
		top: !1,
		caseSensitive: !1,
		literal: !1,
		regexp: !1,
		wholeWord: !1,
		createPanel: (e) => new ye(e),
		scrollToMatch: (e) => a.scrollIntoView(e)
	});
} }), k = class {
	constructor(e) {
		this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || ie(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord, this.test = e.test;
	}
	unquote(e) {
		return this.literal ? e : e.replace(/\\([nrt\\])/g, (e, t) => t == "n" ? "\n" : t == "r" ? "\r" : t == "t" ? "	" : "\\");
	}
	eq(e) {
		return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord && this.test == e.test;
	}
	create() {
		return this.regexp ? new fe(this) : new le(this);
	}
	getCursor(e, t = 0, n) {
		let r = e.doc ? e : l.create({ doc: e });
		return n ??= r.doc.length, this.regexp ? M(this, r, t, n) : j(this, r, t, n);
	}
}, A = class {
	constructor(e) {
		this.spec = e;
	}
};
function se(e, t, n) {
	return (r, i, a, o) => n && !n(r, i, a, o) ? !1 : e(r >= o && i <= o + a.length ? a.slice(r - o, i - o) : t.doc.sliceString(r, i), t, r, i);
}
function j(e, t, n, r) {
	let i;
	return e.wholeWord && (i = ce(t.doc, t.charCategorizer(t.selection.main.head))), e.test && (i = se(e.test, t, i)), new v(t.doc, e.unquoted, n, r, e.caseSensitive ? void 0 : (e) => e.toLowerCase(), i);
}
function ce(e, t) {
	return (n, r, i, a) => ((a > n || a + i.length < r) && (a = Math.max(0, n - 2), i = e.sliceString(a, Math.min(e.length, r + 2))), (t(N(i, n - a)) != m.Word || t(P(i, n - a)) != m.Word) && (t(P(i, r - a)) != m.Word || t(N(i, r - a)) != m.Word));
}
var le = class extends A {
	constructor(e) {
		super(e);
	}
	nextMatch(e, t, n) {
		let r = j(this.spec, e, n, e.doc.length).nextOverlapping();
		if (r.done) {
			let n = Math.min(e.doc.length, t + this.spec.unquoted.length);
			r = j(this.spec, e, 0, n).nextOverlapping();
		}
		return r.done || r.value.from == t && r.value.to == n ? null : r.value;
	}
	prevMatchInRange(e, t, n) {
		for (let r = n;;) {
			let n = Math.max(t, r - 1e4 - this.spec.unquoted.length), i = j(this.spec, e, n, r), a = null;
			for (; !i.nextOverlapping().done;) a = i.value;
			if (a) return a;
			if (n == t) return null;
			r -= 1e4;
		}
	}
	prevMatch(e, t, n) {
		let r = this.prevMatchInRange(e, 0, t);
		return r ||= this.prevMatchInRange(e, Math.max(0, n - this.spec.unquoted.length), e.doc.length), r && (r.from != t || r.to != n) ? r : null;
	}
	getReplacement(e) {
		return this.spec.unquote(this.spec.replace);
	}
	matchAll(e, t) {
		let n = j(this.spec, e, 0, e.doc.length), r = [];
		for (; !n.next().done;) {
			if (r.length >= t) return null;
			r.push(n.value);
		}
		return r;
	}
	highlight(e, t, n, r) {
		let i = j(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(n + this.spec.unquoted.length, e.doc.length));
		for (; !i.next().done;) r(i.value.from, i.value.to);
	}
};
function ue(e, t, n) {
	return (r, i, a) => (!n || n(r, i, a)) && e(a[0], t, r, i);
}
function M(e, t, n, r) {
	let i;
	return e.wholeWord && (i = de(t.charCategorizer(t.selection.main.head))), e.test && (i = ue(e.test, t, i)), new x(t.doc, e.search, {
		ignoreCase: !e.caseSensitive,
		test: i
	}, n, r);
}
function N(e, n) {
	return e.slice(t(e, n, !1), n);
}
function P(e, n) {
	return e.slice(n, t(e, n));
}
function de(e) {
	return (t, n, r) => !r[0].length || (e(N(r.input, r.index)) != m.Word || e(P(r.input, r.index)) != m.Word) && (e(P(r.input, r.index + r[0].length)) != m.Word || e(N(r.input, r.index + r[0].length)) != m.Word);
}
var fe = class extends A {
	nextMatch(e, t, n) {
		let r = M(this.spec, e, n, e.doc.length).next();
		return r.done && (r = M(this.spec, e, 0, t).next()), r.done ? null : r.value;
	}
	prevMatchInRange(e, t, n) {
		for (let r = 1;; r++) {
			let i = Math.max(t, n - r * 1e4), a = M(this.spec, e, i, n), o = null;
			for (; !a.next().done;) o = a.value;
			if (o && (i == t || o.from > i + 10)) return o;
			if (i == t) return null;
		}
	}
	prevMatch(e, t, n) {
		return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, n, e.doc.length);
	}
	getReplacement(e) {
		return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g, (t, n) => {
			if (n == "&") return e.match[0];
			if (n == "$") return "$";
			for (let t = n.length; t > 0; t--) {
				let r = +n.slice(0, t);
				if (r > 0 && r < e.match.length) return e.match[r] + n.slice(t);
			}
			return t;
		});
	}
	matchAll(e, t) {
		let n = M(this.spec, e, 0, e.doc.length), r = [];
		for (; !n.next().done;) {
			if (r.length >= t) return null;
			r.push(n.value);
		}
		return r;
	}
	highlight(e, t, n, r) {
		let i = M(this.spec, e, Math.max(0, t - 250), Math.min(n + 250, e.doc.length));
		for (; !i.next().done;) r(i.value.from, i.value.to);
	}
}, F = /*@__PURE__*/ c.define(), I = /*@__PURE__*/ c.define(), L = /*@__PURE__*/ ne.define({
	create(e) {
		return new R(G(e).create(), null);
	},
	update(e, t) {
		for (let n of t.effects) n.is(F) ? e = new R(n.value.create(), e.panel) : n.is(I) && (e = new R(e.query, n.value ? W : null));
		return e;
	},
	provide: (e) => p.from(e, (e) => e.panel)
}), R = class {
	constructor(e, t) {
		this.query = e, this.panel = t;
	}
}, pe = /*@__PURE__*/ h.mark({ class: "cm-searchMatch" }), z = /*@__PURE__*/ h.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), me = /*@__PURE__*/ i.fromClass(class {
	constructor(e) {
		this.view = e, this.decorations = this.highlight(e.state.field(L));
	}
	update(e) {
		let t = e.state.field(L);
		(t != e.startState.field(L) || e.docChanged || e.selectionSet || e.viewportChanged) && (this.decorations = this.highlight(t));
	}
	highlight({ query: e, panel: t }) {
		if (!t || !e.spec.valid) return h.none;
		let { view: n } = this, r = new re();
		for (let t = 0, i = n.visibleRanges, a = i.length; t < a; t++) {
			let { from: o, to: s } = i[t];
			for (; t < a - 1 && s > i[t + 1].from - 500;) s = i[++t].to;
			e.highlight(n.state, o, s, (e, t) => {
				let i = n.state.selection.ranges.some((n) => n.from == e && n.to == t);
				r.add(e, t, i ? z : pe);
			});
		}
		return r.finish();
	}
}, { decorations: (e) => e.decorations });
function B(e) {
	return (t) => {
		let n = t.state.field(L, !1);
		return n && n.query.spec.valid ? e(t, n) : J(t);
	};
}
var V = /*@__PURE__*/ B((e, { query: t }) => {
	let { to: n } = e.state.selection.main, r = t.nextMatch(e.state, n, n);
	if (!r) return !1;
	let i = u.single(r.from, r.to), a = e.state.facet(O);
	return e.dispatch({
		selection: i,
		effects: [$(e, r), a.scrollToMatch(i.main, e)],
		userEvent: "select.search"
	}), q(e), !0;
}), H = /*@__PURE__*/ B((e, { query: t }) => {
	let { state: n } = e, { from: r } = n.selection.main, i = t.prevMatch(n, r, r);
	if (!i) return !1;
	let a = u.single(i.from, i.to), o = e.state.facet(O);
	return e.dispatch({
		selection: a,
		effects: [$(e, i), o.scrollToMatch(a.main, e)],
		userEvent: "select.search"
	}), q(e), !0;
}), he = /*@__PURE__*/ B((e, { query: t }) => {
	let n = t.matchAll(e.state, 1e3);
	return !n || !n.length ? !1 : (e.dispatch({
		selection: u.create(n.map((e) => u.range(e.from, e.to))),
		userEvent: "select.search.matches"
	}), !0);
}), ge = ({ state: e, dispatch: t }) => {
	let n = e.selection;
	if (n.ranges.length > 1 || n.main.empty) return !1;
	let { from: r, to: i } = n.main, a = [], o = 0;
	for (let t = new v(e.doc, e.sliceDoc(r, i)); !t.next().done;) {
		if (a.length > 1e3) return !1;
		t.value.from == r && (o = a.length), a.push(u.range(t.value.from, t.value.to));
	}
	return t(e.update({
		selection: u.create(a, o),
		userEvent: "select.search.matches"
	})), !0;
}, U = /*@__PURE__*/ B((e, { query: t }) => {
	let { state: n } = e, { from: r, to: i } = n.selection.main;
	if (n.readOnly) return !1;
	let o = t.nextMatch(n, r, r);
	if (!o) return !1;
	let s = o, c = [], l, d, f = [];
	s.precise ? s.from == r && s.to == i && (d = n.toText(t.getReplacement(s)), c.push({
		from: s.from,
		to: s.to,
		insert: d
	}), s = t.nextMatch(n, s.from, s.to), f.push(a.announce.of(n.phrase("replaced match on line $", n.doc.lineAt(r).number) + "."))) : s = t.nextMatch(n, s.from, s.to);
	let p = e.state.changes(c);
	return s && (l = u.single(s.from, s.to).map(p), f.push($(e, s)), f.push(n.facet(O).scrollToMatch(l.main, e))), e.dispatch({
		changes: p,
		selection: l,
		effects: f,
		userEvent: "input.replace"
	}), !0;
}), _e = /*@__PURE__*/ B((e, { query: t }) => {
	if (e.state.readOnly) return !1;
	let n = [];
	for (let r of t.matchAll(e.state, 1e9)) {
		let { from: e, to: i, precise: a } = r;
		a && n.push({
			from: e,
			to: i,
			insert: t.getReplacement(r)
		});
	}
	if (!n.length) return !1;
	let r = e.state.phrase("replaced $ matches", n.length) + ".";
	return e.dispatch({
		changes: n,
		effects: a.announce.of(r),
		userEvent: "input.replace.all"
	}), !0;
});
function W(e) {
	return e.state.facet(O).createPanel(e);
}
function G(e, t) {
	let n = e.selection.main, r = n.empty || n.to > n.from + 100 ? "" : e.sliceDoc(n.from, n.to);
	if (t && !r) return t;
	let i = e.facet(O);
	return new k({
		search: t?.literal ?? i.literal ? r : r.replace(/\n/g, "\\n"),
		caseSensitive: t?.caseSensitive ?? i.caseSensitive,
		literal: t?.literal ?? i.literal,
		regexp: t?.regexp ?? i.regexp,
		wholeWord: t?.wholeWord ?? i.wholeWord
	});
}
function K(e) {
	let t = n(e, W);
	return t && t.dom.querySelector("[main-field]");
}
function q(e) {
	let t = K(e);
	t && t == e.root.activeElement && t.select();
}
var J = (e) => {
	let t = e.state.field(L, !1);
	if (t && t.panel) {
		let n = K(e);
		if (n && n != e.root.activeElement) {
			let r = G(e.state, t.query.spec);
			r.valid && e.dispatch({ effects: F.of(r) }), n.focus(), n.select();
		}
	} else e.dispatch({ effects: [I.of(!0), t ? F.of(G(e.state, t.query.spec)) : c.appendConfig.of(xe)] });
	return !0;
}, Y = (e) => {
	let t = e.state.field(L, !1);
	if (!t || !t.panel) return !1;
	let r = n(e, W);
	return r && r.dom.contains(e.root.activeElement) && e.focus(), e.dispatch({ effects: I.of(!1) }), !0;
}, ve = [
	{
		key: "Mod-f",
		run: J,
		scope: "editor search-panel"
	},
	{
		key: "F3",
		run: V,
		shift: H,
		scope: "editor search-panel",
		preventDefault: !0
	},
	{
		key: "Mod-g",
		run: V,
		shift: H,
		scope: "editor search-panel",
		preventDefault: !0
	},
	{
		key: "Escape",
		run: Y,
		scope: "editor search-panel"
	},
	{
		key: "Mod-Shift-l",
		run: ge
	},
	{
		key: "Mod-Alt-g",
		run: E
	},
	{
		key: "Mod-d",
		run: D,
		preventDefault: !0
	}
], ye = class {
	constructor(e) {
		this.view = e;
		let t = this.query = e.state.field(L).query.spec;
		this.commit = this.commit.bind(this), this.searchField = g("input", {
			value: t.search,
			placeholder: X(e, "Find"),
			"aria-label": X(e, "Find"),
			class: "cm-textfield",
			name: "search",
			form: "",
			"main-field": "true",
			onchange: this.commit,
			onkeyup: this.commit
		}), this.replaceField = g("input", {
			value: t.replace,
			placeholder: X(e, "Replace"),
			"aria-label": X(e, "Replace"),
			class: "cm-textfield",
			name: "replace",
			form: "",
			onchange: this.commit,
			onkeyup: this.commit
		}), this.caseField = g("input", {
			type: "checkbox",
			name: "case",
			form: "",
			checked: t.caseSensitive,
			onchange: this.commit
		}), this.reField = g("input", {
			type: "checkbox",
			name: "re",
			form: "",
			checked: t.regexp,
			onchange: this.commit
		}), this.wordField = g("input", {
			type: "checkbox",
			name: "word",
			form: "",
			checked: t.wholeWord,
			onchange: this.commit
		});
		function n(e, t, n) {
			return g("button", {
				class: "cm-button",
				name: e,
				onclick: t,
				type: "button"
			}, n);
		}
		this.dom = g("div", {
			onkeydown: (e) => this.keydown(e),
			class: "cm-search"
		}, [
			this.searchField,
			n("next", () => V(e), [X(e, "next")]),
			n("prev", () => H(e), [X(e, "previous")]),
			n("select", () => he(e), [X(e, "all")]),
			g("label", null, [this.caseField, X(e, "match case")]),
			g("label", null, [this.reField, X(e, "regexp")]),
			g("label", null, [this.wordField, X(e, "by word")]),
			...e.state.readOnly ? [] : [
				g("br"),
				this.replaceField,
				n("replace", () => U(e), [X(e, "replace")]),
				n("replaceAll", () => _e(e), [X(e, "replace all")])
			],
			g("button", {
				name: "close",
				onclick: () => Y(e),
				"aria-label": X(e, "close"),
				type: "button"
			}, ["×"])
		]);
	}
	commit() {
		let e = new k({
			search: this.searchField.value,
			caseSensitive: this.caseField.checked,
			regexp: this.reField.checked,
			wholeWord: this.wordField.checked,
			replace: this.replaceField.value
		});
		e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: F.of(e) }));
	}
	keydown(e) {
		d(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? H : V)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), U(this.view));
	}
	update(e) {
		for (let t of e.transactions) for (let e of t.effects) e.is(F) && !e.value.eq(this.query) && this.setQuery(e.value);
	}
	setQuery(e) {
		this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
	}
	mount() {
		this.searchField.select();
	}
	get pos() {
		return 80;
	}
	get top() {
		return this.view.state.facet(O).top;
	}
};
function X(e, t) {
	return e.state.phrase(t);
}
var Z = 30, Q = /[\s\.,:;?!]/;
function $(e, { from: t, to: n }) {
	let r = e.state.doc.lineAt(t), i = e.state.doc.lineAt(n).to, o = Math.max(r.from, t - Z), s = Math.min(i, n + Z), c = e.state.sliceDoc(o, s);
	if (o != r.from) {
		for (let e = 0; e < Z; e++) if (!Q.test(c[e + 1]) && Q.test(c[e])) {
			c = c.slice(e);
			break;
		}
	}
	if (s != i) {
		for (let e = c.length - 1; e > c.length - Z; e--) if (!Q.test(c[e - 1]) && Q.test(c[e])) {
			c = c.slice(0, e);
			break;
		}
	}
	return a.announce.of(`${e.state.phrase("current match")}. ${c} ${e.state.phrase("on line")} ${r.number}.`);
}
var be = /*@__PURE__*/ a.baseTheme({
	".cm-panel.cm-search": {
		padding: "2px 6px 4px",
		position: "relative",
		"& [name=close]": {
			position: "absolute",
			top: "0",
			right: "4px",
			backgroundColor: "inherit",
			border: "none",
			font: "inherit",
			padding: 0,
			margin: 0
		},
		"& input, & button, & label": { margin: ".2em .6em .2em 0" },
		"& input[type=checkbox]": { marginRight: ".2em" },
		"& label": {
			fontSize: "80%",
			whiteSpace: "pre"
		}
	},
	"&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
	"&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
	"&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
	"&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), xe = [
	L,
	/*@__PURE__*/ ee.low(me),
	be
];
//#endregion
export { ve as i, J as n, U as r, E as t };

//# sourceMappingURL=@codemirror-search.js.map