import { A as e, B as t, Ct as n, D as r, Dt as i, Et as a, J as o, N as s, O as c, Ot as l, St as u, T as d, Y as f, _t as p, bt as m, dt as ee, ft as te, ht as h, s as g, ut as _, w as v, xt as ne } from "./@codemirror-autocomplete.js";
//#region ../node_modules/.pnpm/@codemirror+commands@6.10.4/node_modules/@codemirror/commands/dist/index.js
var re = (e) => {
	let { state: t } = e, n = t.doc.lineAt(t.selection.main.from), r = b(e.state, n.from);
	return r.line ? ie(e) : r.block ? oe(e) : !1;
};
function y(e, t) {
	return ({ state: n, dispatch: r }) => {
		if (n.readOnly) return !1;
		let i = e(t, n);
		return i ? (r(n.update(i)), !0) : !1;
	};
}
var ie = /*@__PURE__*/ y(le, 0), ae = /*@__PURE__*/ y(S, 0), oe = /*@__PURE__*/ y((e, t) => S(e, t, ce(t)), 0);
function b(e, t) {
	let n = e.languageDataAt("commentTokens", t, 1);
	return n.length ? n[0] : {};
}
var x = 50;
function se(e, { open: t, close: n }, r, i) {
	let a = e.sliceDoc(r - x, r), o = e.sliceDoc(i, i + x), s = /\s*$/.exec(a)[0].length, c = /^\s*/.exec(o)[0].length, l = a.length - s;
	if (a.slice(l - t.length, l) == t && o.slice(c, c + n.length) == n) return {
		open: {
			pos: r - s,
			margin: s && 1
		},
		close: {
			pos: i + c,
			margin: c && 1
		}
	};
	let u, d;
	i - r <= 2 * x ? u = d = e.sliceDoc(r, i) : (u = e.sliceDoc(r, r + x), d = e.sliceDoc(i - x, i));
	let f = /^\s*/.exec(u)[0].length, p = /\s*$/.exec(d)[0].length, m = d.length - p - n.length;
	return u.slice(f, f + t.length) == t && d.slice(m, m + n.length) == n ? {
		open: {
			pos: r + f + t.length,
			margin: +!!/\s/.test(u.charAt(f + t.length))
		},
		close: {
			pos: i - p - n.length,
			margin: +!!/\s/.test(d.charAt(m - 1))
		}
	} : null;
}
function ce(e) {
	let t = [];
	for (let n of e.selection.ranges) {
		let r = e.doc.lineAt(n.from), i = n.to <= r.to ? r : e.doc.lineAt(n.to);
		i.from > r.from && i.from == n.to && (i = n.to == r.to + 1 ? r : e.doc.lineAt(n.to - 1));
		let a = t.length - 1;
		a >= 0 && t[a].to > r.from ? t[a].to = i.to : t.push({
			from: r.from + /^\s*/.exec(r.text)[0].length,
			to: i.to
		});
	}
	return t;
}
function S(e, t, n = t.selection.ranges) {
	let r = n.map((e) => b(t, e.from).block);
	if (!r.every((e) => e)) return null;
	let i = n.map((e, n) => se(t, r[n], e.from, e.to));
	if (e != 2 && !i.every((e) => e)) return { changes: t.changes(n.map((e, t) => i[t] ? [] : [{
		from: e.from,
		insert: r[t].open + " "
	}, {
		from: e.to,
		insert: " " + r[t].close
	}])) };
	if (e != 1 && i.some((e) => e)) {
		let e = [];
		for (let t = 0, n; t < i.length; t++) if (n = i[t]) {
			let i = r[t], { open: a, close: o } = n;
			e.push({
				from: a.pos - i.open.length,
				to: a.pos + a.margin
			}, {
				from: o.pos - o.margin,
				to: o.pos + i.close.length
			});
		}
		return { changes: e };
	}
	return null;
}
function le(e, t, n = t.selection.ranges) {
	let r = [], i = -1;
	ranges: for (let { from: e, to: a } of n) {
		let n = r.length, o = 1e9, s;
		for (let n = e; n <= a;) {
			let c = t.doc.lineAt(n);
			if (s == null && (s = b(t, c.from).line, !s)) continue ranges;
			if (c.from > i && (e == a || a > c.from)) {
				i = c.from;
				let e = /^\s*/.exec(c.text)[0].length, t = e == c.length, n = c.text.slice(e, e + s.length) == s ? e : -1;
				e < c.text.length && e < o && (o = e), r.push({
					line: c,
					comment: n,
					token: s,
					indent: e,
					empty: t,
					single: !1
				});
			}
			n = c.to + 1;
		}
		if (o < 1e9) for (let e = n; e < r.length; e++) r[e].indent < r[e].line.text.length && (r[e].indent = o);
		r.length == n + 1 && (r[n].single = !0);
	}
	if (e != 2 && r.some((e) => e.comment < 0 && (!e.empty || e.single))) {
		let e = [];
		for (let { line: t, token: n, indent: i, empty: a, single: o } of r) (o || !a) && e.push({
			from: t.from + i,
			insert: n + " "
		});
		let n = t.changes(e);
		return {
			changes: n,
			selection: t.selection.map(n, 1)
		};
	} else if (e != 1 && r.some((e) => e.comment >= 0)) {
		let e = [];
		for (let { line: t, comment: n, token: i } of r) if (n >= 0) {
			let r = t.from + n, a = r + i.length;
			t.text[a - t.from] == " " && a++, e.push({
				from: r,
				to: a
			});
		}
		return { changes: e };
	}
	return null;
}
var C = /*@__PURE__*/ _.define(), ue = /*@__PURE__*/ _.define(), de = /*@__PURE__*/ p.define(), fe = /*@__PURE__*/ p.define({ combine(e) {
	return a(e, {
		minDepth: 100,
		newGroupDelay: 500,
		joinToEvent: (e, t) => t
	}, {
		minDepth: Math.max,
		newGroupDelay: Math.min,
		joinToEvent: (e, t) => (n, r) => e(n, r) || t(n, r)
	});
} }), pe = /*@__PURE__*/ ne.define({
	create() {
		return N.empty;
	},
	update(e, t) {
		let r = t.state.facet(fe), i = t.annotation(C);
		if (i) {
			let n = D.fromTransaction(t, i.selection), a = i.side, o = a == 0 ? e.undone : e.done;
			return o = n ? O(o, o.length, r.minDepth, n) : j(o, t.startState.selection), new N(a == 0 ? i.rest : o, a == 0 ? o : i.rest);
		}
		let a = t.annotation(ue);
		if ((a == "full" || a == "before") && (e = e.isolate()), t.annotation(n.addToHistory) === !1) return t.changes.empty ? e : e.addMapping(t.changes.desc);
		let o = D.fromTransaction(t), s = t.annotation(n.time), c = t.annotation(n.userEvent);
		return o ? e = e.addChanges(o, s, c, r, t) : t.selection && (e = e.addSelection(t.startState.selection, s, c, r.newGroupDelay)), (a == "full" || a == "after") && (e = e.isolate()), e;
	},
	toJSON(e) {
		return {
			done: e.done.map((e) => e.toJSON()),
			undone: e.undone.map((e) => e.toJSON())
		};
	},
	fromJSON(e) {
		return new N(e.done.map(D.fromJSON), e.undone.map(D.fromJSON));
	}
});
function me(e = {}) {
	return [
		pe,
		fe.of(e),
		f.domEventHandlers({ beforeinput(e, t) {
			let n = e.inputType == "historyUndo" ? T : e.inputType == "historyRedo" ? E : null;
			return n ? (e.preventDefault(), n(t)) : !1;
		} })
	];
}
function w(e, t) {
	return function({ state: n, dispatch: r }) {
		if (!t && n.readOnly) return !1;
		let i = n.field(pe, !1);
		if (!i) return !1;
		let a = i.pop(e, n, t);
		return a ? (r(a), !0) : !1;
	};
}
var T = /*@__PURE__*/ w(0, !1), E = /*@__PURE__*/ w(1, !1), he = /*@__PURE__*/ w(0, !0), ge = /*@__PURE__*/ w(1, !0), D = class e {
	constructor(e, t, n, r, i) {
		this.changes = e, this.effects = t, this.mapped = n, this.startSelection = r, this.selectionsAfter = i;
	}
	setSelAfter(t) {
		return new e(this.changes, this.effects, this.mapped, this.startSelection, t);
	}
	toJSON() {
		return {
			changes: this.changes?.toJSON(),
			mapped: this.mapped?.toJSON(),
			startSelection: this.startSelection?.toJSON(),
			selectionsAfter: this.selectionsAfter.map((e) => e.toJSON())
		};
	}
	static fromJSON(t) {
		return new e(t.changes && te.fromJSON(t.changes), [], t.mapped && ee.fromJSON(t.mapped), t.startSelection && h.fromJSON(t.startSelection), t.selectionsAfter.map(h.fromJSON));
	}
	static fromTransaction(t, n) {
		let r = A;
		for (let e of t.startState.facet(de)) {
			let n = e(t);
			n.length && (r = r.concat(n));
		}
		return !r.length && t.changes.empty ? null : new e(t.changes.invert(t.startState.doc), r, void 0, n || t.startState.selection, A);
	}
	static selection(t) {
		return new e(void 0, A, void 0, void 0, t);
	}
};
function O(e, t, n, r) {
	let i = t + 1 > n + 20 ? t - n - 1 : 0, a = e.slice(i, t);
	return a.push(r), a;
}
function _e(e, t) {
	let n = [], r = !1;
	return e.iterChangedRanges((e, t) => n.push(e, t)), t.iterChangedRanges((e, t, i, a) => {
		for (let e = 0; e < n.length;) {
			let t = n[e++], o = n[e++];
			a >= t && i <= o && (r = !0);
		}
	}), r;
}
function ve(e, t) {
	return e.ranges.length == t.ranges.length && e.ranges.filter((e, n) => e.empty != t.ranges[n].empty).length === 0;
}
function k(e, t) {
	return e.length ? t.length ? e.concat(t) : e : t;
}
var A = [], ye = 200;
function j(e, t) {
	if (e.length) {
		let n = e[e.length - 1], r = n.selectionsAfter.slice(Math.max(0, n.selectionsAfter.length - ye));
		return r.length && r[r.length - 1].eq(t) ? e : (r.push(t), O(e, e.length - 1, 1e9, n.setSelAfter(r)));
	} else return [D.selection([t])];
}
function be(e) {
	let t = e[e.length - 1], n = e.slice();
	return n[e.length - 1] = t.setSelAfter(t.selectionsAfter.slice(0, t.selectionsAfter.length - 1)), n;
}
function M(e, t) {
	if (!e.length) return e;
	let n = e.length, r = A;
	for (; n;) {
		let i = xe(e[n - 1], t, r);
		if (i.changes && !i.changes.empty || i.effects.length) {
			let t = e.slice(0, n);
			return t[n - 1] = i, t;
		} else t = i.mapped, n--, r = i.selectionsAfter;
	}
	return r.length ? [D.selection(r)] : A;
}
function xe(e, t, n) {
	let r = k(e.selectionsAfter.length ? e.selectionsAfter.map((e) => e.map(t)) : A, n);
	if (!e.changes) return D.selection(r);
	let i = e.changes.map(t), a = t.mapDesc(e.changes, !0), o = e.mapped ? e.mapped.composeDesc(a) : a;
	return new D(i, m.mapEffects(e.effects, t), o, e.startSelection.map(a), r);
}
var Se = /^(input\.type|delete)($|\.)/, N = class e {
	constructor(e, t, n = 0, r = void 0) {
		this.done = e, this.undone = t, this.prevTime = n, this.prevUserEvent = r;
	}
	isolate() {
		return this.prevTime ? new e(this.done, this.undone) : this;
	}
	addChanges(t, n, r, i, a) {
		let o = this.done, s = o[o.length - 1];
		return o = s && s.changes && !s.changes.empty && t.changes && (!r || Se.test(r)) && (!s.selectionsAfter.length && n - this.prevTime < i.newGroupDelay && i.joinToEvent(a, _e(s.changes, t.changes)) || r == "input.type.compose") ? O(o, o.length - 1, i.minDepth, new D(t.changes.compose(s.changes), k(m.mapEffects(t.effects, s.changes), s.effects), s.mapped, s.startSelection, A)) : O(o, o.length, i.minDepth, t), new e(o, A, n, r);
	}
	addSelection(t, n, r, i) {
		let a = this.done.length ? this.done[this.done.length - 1].selectionsAfter : A;
		return a.length > 0 && n - this.prevTime < i && r == this.prevUserEvent && r && /^select($|\.)/.test(r) && ve(a[a.length - 1], t) ? this : new e(j(this.done, t), this.undone, n, r);
	}
	addMapping(t) {
		return new e(M(this.done, t), M(this.undone, t), this.prevTime, this.prevUserEvent);
	}
	pop(e, t, n) {
		let r = e == 0 ? this.done : this.undone;
		if (r.length == 0) return null;
		let i = r[r.length - 1], a = i.selectionsAfter[0] || (i.startSelection ? i.startSelection.map(i.changes.invertedDesc, 1) : t.selection);
		if (n && i.selectionsAfter.length) return t.update({
			selection: i.selectionsAfter[i.selectionsAfter.length - 1],
			annotations: C.of({
				side: e,
				rest: be(r),
				selection: a
			}),
			userEvent: e == 0 ? "select.undo" : "select.redo",
			scrollIntoView: !0
		});
		if (i.changes) {
			let n = r.length == 1 ? A : r.slice(0, r.length - 1);
			return i.mapped && (n = M(n, i.mapped)), t.update({
				changes: i.changes,
				selection: i.startSelection,
				effects: i.effects,
				annotations: C.of({
					side: e,
					rest: n,
					selection: a
				}),
				filter: !1,
				userEvent: e == 0 ? "undo" : "redo",
				scrollIntoView: !0
			});
		} else return null;
	}
};
N.empty = /*@__PURE__*/ new N(A, A);
var Ce = [
	{
		key: "Mod-z",
		run: T,
		preventDefault: !0
	},
	{
		key: "Mod-y",
		mac: "Mod-Shift-z",
		run: E,
		preventDefault: !0
	},
	{
		linux: "Ctrl-Shift-z",
		run: E,
		preventDefault: !0
	},
	{
		key: "Mod-u",
		run: he,
		preventDefault: !0
	},
	{
		key: "Alt-u",
		mac: "Mod-Shift-u",
		run: ge,
		preventDefault: !0
	}
];
function P(e, t) {
	return h.create(e.ranges.map(t), e.mainIndex);
}
function F(e, t) {
	return e.update({
		selection: t,
		scrollIntoView: !0,
		userEvent: "select"
	});
}
function I({ state: e, dispatch: t }, n) {
	let r = P(e.selection, n);
	return r.eq(e.selection, !0) ? !1 : (t(F(e, r)), !0);
}
function L(e, t) {
	return h.cursor(t ? e.to : e.from);
}
function R(e, t) {
	return I(e, (n) => n.empty ? e.moveByChar(n, t) : L(n, t));
}
function z(e) {
	return e.textDirectionAt(e.state.selection.main.head) == o.LTR;
}
var B = (e) => R(e, !z(e)), V = (e) => R(e, z(e));
function we(e, t) {
	return I(e, (n) => n.empty ? e.moveByGroup(n, t) : L(n, t));
}
var Te = (e) => we(e, !z(e)), Ee = (e) => we(e, z(e));
typeof Intl < "u" && Intl.Segmenter;
function De(e, t, n) {
	if (t.type.prop(n)) return !0;
	let r = t.to - t.from;
	return r && (r > 2 || /[^\s,.;:]/.test(e.sliceDoc(t.from, t.to))) || t.firstChild;
}
function H(n, r, i) {
	let a = s(n).resolveInner(r.head), o = i ? t.closedBy : t.openedBy;
	for (let e = r.head;;) {
		let t = i ? a.childAfter(e) : a.childBefore(e);
		if (!t) break;
		De(n, t, o) ? a = t : e = i ? t.to : t.from;
	}
	let c = a.type.prop(o), l, u;
	return u = c && (l = i ? e(n, a.from, 1) : e(n, a.to, -1)) && l.matched ? i ? l.end.to : l.end.from : i ? a.to : a.from, h.cursor(u, i ? -1 : 1);
}
var Oe = (e) => I(e, (t) => H(e.state, t, !z(e))), ke = (e) => I(e, (t) => H(e.state, t, z(e)));
function Ae(e, t) {
	return I(e, (n) => {
		if (!n.empty) return L(n, t);
		let r = e.moveVertically(n, t);
		return r.head == n.head ? e.moveToLineBoundary(n, t) : r;
	});
}
var je = (e) => Ae(e, !1), Me = (e) => Ae(e, !0);
function U(e) {
	let t = e.scrollDOM.clientHeight < e.scrollDOM.scrollHeight - 2, n = 0, r = 0, i;
	if (t) {
		for (let t of e.state.facet(f.scrollMargins)) {
			let i = t(e);
			i?.top && (n = Math.max(i?.top, n)), i?.bottom && (r = Math.max(i?.bottom, r));
		}
		i = e.scrollDOM.clientHeight - n - r;
	} else i = (e.dom.ownerDocument.defaultView || window).innerHeight;
	return {
		marginTop: n,
		marginBottom: r,
		selfScroll: t,
		height: Math.max(e.defaultLineHeight, i - 5)
	};
}
function Ne(e, t) {
	let n = U(e), { state: r } = e, i = P(r.selection, (r) => r.empty ? e.moveVertically(r, t, n.height) : L(r, t));
	if (i.eq(r.selection)) return !1;
	let a;
	if (n.selfScroll) {
		let t = e.coordsAtPos(r.selection.main.head), o = e.scrollDOM.getBoundingClientRect(), s = o.top + n.marginTop, c = o.bottom - n.marginBottom;
		t && t.top > s && t.bottom < c && (a = f.scrollIntoView(i.main.head, {
			y: "start",
			yMargin: t.top - s
		}));
	}
	return e.dispatch(F(r, i), { effects: a }), !0;
}
var Pe = (e) => Ne(e, !1), W = (e) => Ne(e, !0);
function G(e, t, n) {
	let r = e.lineBlockAt(t.head), i = e.moveToLineBoundary(t, n);
	if (i.head == t.head && i.head != (n ? r.to : r.from) && (i = e.moveToLineBoundary(t, n, !1)), !n && i.head == r.from && r.length) {
		let n = /^\s*/.exec(e.state.sliceDoc(r.from, Math.min(r.from + 100, r.to)))[0].length;
		n && t.head != r.from + n && (i = h.cursor(r.from + n));
	}
	return i;
}
var Fe = (e) => I(e, (t) => G(e, t, !0)), Ie = (e) => I(e, (t) => G(e, t, !1)), Le = (e) => I(e, (t) => G(e, t, !z(e))), Re = (e) => I(e, (t) => G(e, t, z(e))), ze = (e) => I(e, (t) => h.cursor(e.lineBlockAt(t.head).from, 1)), Be = (e) => I(e, (t) => h.cursor(e.lineBlockAt(t.head).to, -1));
function Ve(t, n, r) {
	let i = !1, a = P(t.selection, (n) => {
		let a = e(t, n.head, -1) || e(t, n.head, 1) || n.head > 0 && e(t, n.head - 1, 1) || n.head < t.doc.length && e(t, n.head + 1, -1);
		if (!a || !a.end) return n;
		i = !0;
		let o = a.start.from == n.head ? a.end.to : a.end.from;
		return r ? h.range(n.anchor, o) : h.cursor(o);
	});
	return i ? (n(F(t, a)), !0) : !1;
}
var He = ({ state: e, dispatch: t }) => Ve(e, t, !1);
function K(e, t, n) {
	let r = P(e.state.selection, (e) => {
		e.undirectional && e.head >= e.anchor != t && (e = h.range(e.head, e.anchor));
		let r = n(e);
		return h.range(e.anchor, r.head, r.goalColumn, r.bidiLevel || void 0, r.assoc);
	});
	return r.eq(e.state.selection) ? !1 : (e.dispatch(F(e.state, r)), !0);
}
function Ue(e, t) {
	return K(e, t, (n) => e.moveByChar(n, t));
}
var We = (e) => Ue(e, !z(e)), Ge = (e) => Ue(e, z(e));
function Ke(e, t) {
	return K(e, t, (n) => e.moveByGroup(n, t));
}
var qe = (e) => Ke(e, !z(e)), Je = (e) => Ke(e, z(e)), Ye = (e) => {
	let t = !z(e);
	return K(e, t, (n) => H(e.state, n, t));
}, Xe = (e) => {
	let t = z(e);
	return K(e, t, (n) => H(e.state, n, t));
};
function Ze(e, t) {
	return K(e, t, (n) => e.moveVertically(n, t));
}
var Qe = (e) => Ze(e, !1), $e = (e) => Ze(e, !0);
function et(e, t) {
	return K(e, t, (n) => e.moveVertically(n, t, U(e).height));
}
var tt = (e) => et(e, !1), nt = (e) => et(e, !0), rt = (e) => K(e, !0, (t) => G(e, t, !0)), it = (e) => K(e, !1, (t) => G(e, t, !1)), at = (e) => {
	let t = !z(e);
	return K(e, t, (n) => G(e, n, t));
}, ot = (e) => {
	let t = z(e);
	return K(e, t, (n) => G(e, n, t));
}, st = (e) => K(e, !1, (t) => h.cursor(e.lineBlockAt(t.head).from)), ct = (e) => K(e, !0, (t) => h.cursor(e.lineBlockAt(t.head).to)), lt = ({ state: e, dispatch: t }) => (t(F(e, { anchor: 0 })), !0), ut = ({ state: e, dispatch: t }) => (t(F(e, { anchor: e.doc.length })), !0), dt = ({ state: e, dispatch: t }) => (t(F(e, {
	anchor: e.selection.main.anchor,
	head: 0
})), !0), ft = ({ state: e, dispatch: t }) => (t(F(e, {
	anchor: e.selection.main.anchor,
	head: e.doc.length
})), !0), pt = ({ state: e, dispatch: t }) => (t(e.update({
	selection: {
		anchor: 0,
		head: e.doc.length
	},
	userEvent: "select"
})), !0), mt = ({ state: e, dispatch: t }) => {
	let n = X(e).map(({ from: t, to: n }) => h.range(t, Math.min(n + 1, e.doc.length)));
	return t(e.update({
		selection: h.create(n),
		userEvent: "select"
	})), !0;
}, ht = ({ state: e, dispatch: t }) => {
	let n = P(e.selection, (t) => {
		let n = s(e), r = n.resolveStack(t.from, 1);
		if (t.empty) {
			let e = n.resolveStack(t.from, -1);
			e.node.from >= r.node.from && e.node.to <= r.node.to && (r = e);
		}
		for (let e = r; e; e = e.next) {
			let { node: n } = e;
			if ((n.from < t.from && n.to >= t.to || n.to > t.to && n.from <= t.from) && e.next) return h.range(n.to, n.from);
		}
		return t;
	});
	return n.eq(e.selection) ? !1 : (t(F(e, n)), !0);
};
function gt(e, t) {
	let { state: n } = e, r = n.selection, i = n.selection.ranges.slice();
	for (let r of n.selection.ranges) {
		let a = n.doc.lineAt(r.head);
		if (t ? a.to < e.state.doc.length : a.from > 0) for (let n = r;;) {
			let r = e.moveVertically(n, t);
			if (r.head < a.from || r.head > a.to) {
				i.some((e) => e.head == r.head) || i.push(r);
				break;
			} else if (r.head == n.head) break;
			else n = r;
		}
	}
	return i.length == r.ranges.length ? !1 : (e.dispatch(F(n, h.create(i, i.length - 1))), !0);
}
var _t = (e) => gt(e, !1), vt = (e) => gt(e, !0), yt = ({ state: e, dispatch: t }) => {
	let n = e.selection, r = null;
	return n.ranges.length > 1 ? r = h.create([n.main]) : n.main.empty || (r = h.create([h.cursor(n.main.head)])), r ? (t(F(e, r)), !0) : !1;
};
function q(e, t) {
	if (e.state.readOnly) return !1;
	let n = "delete.selection", { state: r } = e, i = r.changeByRange((r) => {
		let { from: i, to: a } = r;
		if (i == a) {
			let o = t(r);
			o < i ? (n = "delete.backward", o = J(e, o, !1)) : o > i && (n = "delete.forward", o = J(e, o, !0)), i = Math.min(i, o), a = Math.max(a, o);
		} else i = J(e, i, !1), a = J(e, a, !0);
		return i == a ? { range: r } : {
			changes: {
				from: i,
				to: a
			},
			range: h.cursor(i, i < r.head ? -1 : 1)
		};
	});
	return i.changes.empty ? !1 : (e.dispatch(r.update(i, {
		scrollIntoView: !0,
		userEvent: n,
		effects: n == "delete.selection" ? f.announce.of(r.phrase("Selection deleted")) : void 0
	})), !0);
}
function J(e, t, n) {
	if (e instanceof f) for (let r of e.state.facet(f.atomicRanges).map((t) => t(e))) r.between(t, t, (e, r) => {
		e < t && r > t && (t = n ? r : e);
	});
	return t;
}
var bt = (e, t, n) => q(e, (r) => {
	let a = r.from, { state: o } = e, s = o.doc.lineAt(a), c, u;
	if (n && !t && a > s.from && a < s.from + 200 && !/[^ \t]/.test(c = s.text.slice(0, a - s.from))) {
		if (c[c.length - 1] == "	") return a - 1;
		let e = i(c, o.tabSize) % v(o) || v(o);
		for (let t = 0; t < e && c[c.length - 1 - t] == " "; t++) a--;
		u = a;
	} else u = l(s.text, a - s.from, t, t) + s.from, u == a && s.number != (t ? o.doc.lines : 1) ? u += t ? 1 : -1 : !t && /[\ufe00-\ufe0f]/.test(s.text.slice(u - s.from, a - s.from)) && (u = l(s.text, u - s.from, !1, !1) + s.from);
	return u;
}), Y = (e) => bt(e, !1, !0), xt = (e) => bt(e, !0, !1), St = (e, t) => q(e, (n) => {
	let r = n.head, { state: i } = e, a = i.doc.lineAt(r), o = i.charCategorizer(r);
	for (let e = null;;) {
		if (r == (t ? a.to : a.from)) {
			r == n.head && a.number != (t ? i.doc.lines : 1) && (r += t ? 1 : -1);
			break;
		}
		let s = l(a.text, r - a.from, t) + a.from, c = a.text.slice(Math.min(r, s) - a.from, Math.max(r, s) - a.from), u = o(c);
		if (e != null && u != e) break;
		(c != " " || r != n.head) && (e = u), r = s;
	}
	return r;
}), Ct = (e) => St(e, !1), wt = (e) => St(e, !0), Tt = (e) => q(e, (t) => {
	let n = e.lineBlockAt(t.head).to;
	return t.head < n ? n : Math.min(e.state.doc.length, t.head + 1);
}), Et = (e) => q(e, (t) => {
	let n = e.moveToLineBoundary(t, !1).head;
	return t.head > n ? n : Math.max(0, t.head - 1);
}), Dt = (e) => q(e, (t) => {
	let n = e.moveToLineBoundary(t, !0).head;
	return t.head < n ? n : Math.min(e.state.doc.length, t.head + 1);
}), Ot = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = e.changeByRange((e) => ({
		changes: {
			from: e.from,
			to: e.to,
			insert: u.of(["", ""])
		},
		range: h.cursor(e.from)
	}));
	return t(e.update(n, {
		scrollIntoView: !0,
		userEvent: "input"
	})), !0;
}, kt = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = e.changeByRange((t) => {
		if (!t.empty || t.from == 0 || t.from == e.doc.length) return { range: t };
		let n = t.from, r = e.doc.lineAt(n), i = n == r.from ? n - 1 : l(r.text, n - r.from, !1) + r.from, a = n == r.to ? n + 1 : l(r.text, n - r.from, !0) + r.from;
		return {
			changes: {
				from: i,
				to: a,
				insert: e.doc.slice(n, a).append(e.doc.slice(i, n))
			},
			range: h.cursor(a)
		};
	});
	return n.changes.empty ? !1 : (t(e.update(n, {
		scrollIntoView: !0,
		userEvent: "move.character"
	})), !0);
};
function X(e) {
	let t = [], n = -1;
	for (let r of e.selection.ranges) {
		let i = e.doc.lineAt(r.from), a = e.doc.lineAt(r.to);
		if (!r.empty && r.to == a.from && (a = e.doc.lineAt(r.to - 1)), n >= i.number) {
			let e = t[t.length - 1];
			e.to = a.to, e.ranges.push(r);
		} else t.push({
			from: i.from,
			to: a.to,
			ranges: [r]
		});
		n = a.number + 1;
	}
	return t;
}
function At(e, t, n) {
	if (e.readOnly) return !1;
	let r = [], i = [];
	for (let t of X(e)) {
		if (n ? t.to == e.doc.length : t.from == 0) continue;
		let a = e.doc.lineAt(n ? t.to + 1 : t.from - 1), o = a.length + 1;
		if (n) {
			r.push({
				from: t.to,
				to: a.to
			}, {
				from: t.from,
				insert: a.text + e.lineBreak
			});
			for (let n of t.ranges) i.push(h.range(Math.min(e.doc.length, n.anchor + o), Math.min(e.doc.length, n.head + o)));
		} else {
			r.push({
				from: a.from,
				to: t.from
			}, {
				from: t.to,
				insert: e.lineBreak + a.text
			});
			for (let e of t.ranges) i.push(h.range(e.anchor - o, e.head - o));
		}
	}
	return r.length ? (t(e.update({
		changes: r,
		scrollIntoView: !0,
		selection: h.create(i, e.selection.mainIndex),
		userEvent: "move.line"
	})), !0) : !1;
}
var jt = ({ state: e, dispatch: t }) => At(e, t, !1), Mt = ({ state: e, dispatch: t }) => At(e, t, !0);
function Nt(e, t, n) {
	if (e.readOnly) return !1;
	let r = [];
	for (let t of X(e)) n ? r.push({
		from: t.from,
		insert: e.doc.slice(t.from, t.to) + e.lineBreak
	}) : r.push({
		from: t.to,
		insert: e.lineBreak + e.doc.slice(t.from, t.to)
	});
	let i = e.changes(r);
	return t(e.update({
		changes: i,
		selection: e.selection.map(i, n ? 1 : -1),
		scrollIntoView: !0,
		userEvent: "input.copyline"
	})), !0;
}
var Pt = ({ state: e, dispatch: t }) => Nt(e, t, !1), Ft = ({ state: e, dispatch: t }) => Nt(e, t, !0), It = (e) => {
	if (e.state.readOnly) return !1;
	let { state: t } = e, n = t.changes(X(t).map(({ from: e, to: n }) => (e > 0 ? e-- : n < t.doc.length && n++, {
		from: e,
		to: n
	}))), r = P(t.selection, (t) => {
		let n;
		if (e.lineWrapping) {
			let r = e.lineBlockAt(t.head), i = e.coordsAtPos(t.head, t.assoc || 1);
			i && (n = r.bottom + e.documentTop - i.bottom + e.defaultLineHeight / 2);
		}
		return e.moveVertically(t, !0, n);
	}).map(n);
	return e.dispatch({
		changes: n,
		selection: r,
		scrollIntoView: !0,
		userEvent: "delete.line"
	}), !0;
};
function Lt(e, n) {
	if (/\(\)|\[\]|\{\}/.test(e.sliceDoc(n - 1, n + 1))) return {
		from: n,
		to: n
	};
	let r = s(e).resolveInner(n), i = r.childBefore(n), a = r.childAfter(n), o;
	return i && a && i.to <= n && a.from >= n && (o = i.type.prop(t.closedBy)) && o.indexOf(a.name) > -1 && e.doc.lineAt(i.to).from == e.doc.lineAt(a.from).from && !/\S/.test(e.sliceDoc(i.to, a.from)) ? {
		from: i.to,
		to: a.from
	} : null;
}
var Rt = /*@__PURE__*/ Bt(!1), zt = /*@__PURE__*/ Bt(!0);
function Bt(e) {
	return ({ state: t, dispatch: n }) => {
		if (t.readOnly) return !1;
		let a = t.changeByRange((n) => {
			let { from: a, to: o } = n, s = t.doc.lineAt(a), c = !e && a == o && Lt(t, a);
			e && (a = o = (o <= s.to ? s : t.doc.lineAt(o)).to);
			let l = new g(t, {
				simulateBreak: a,
				simulateDoubleBreak: !!c
			}), f = d(l, a);
			for (f ??= i(/^\s*/.exec(t.doc.lineAt(a).text)[0], t.tabSize); o < s.to && /\s/.test(s.text[o - s.from]);) o++;
			c ? {from: a, to: o} = c : a > s.from && a < s.from + 100 && !/\S/.test(s.text.slice(0, a)) && (a = s.from);
			let p = ["", r(t, f)];
			return c && p.push(r(t, l.lineIndent(s.from, -1))), {
				changes: {
					from: a,
					to: o,
					insert: u.of(p)
				},
				range: h.cursor(a + 1 + p[1].length)
			};
		});
		return n(t.update(a, {
			scrollIntoView: !0,
			userEvent: "input"
		})), !0;
	};
}
function Z(e, t) {
	let n = -1;
	return e.changeByRange((r) => {
		let i = [];
		for (let a = r.from; a <= r.to;) {
			let o = e.doc.lineAt(a);
			o.number > n && (r.empty || r.to > o.from) && (t(o, i, r), n = o.number), a = o.to + 1;
		}
		let a = e.changes(i);
		return {
			changes: i,
			range: h.range(a.mapPos(r.anchor, 1), a.mapPos(r.head, 1))
		};
	});
}
var Vt = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = Object.create(null), i = new g(e, { overrideIndentation: (e) => n[e] ?? -1 }), a = Z(e, (t, a, o) => {
		let s = d(i, t.from);
		if (s == null) return;
		/\S/.test(t.text) || (s = 0);
		let c = /^\s*/.exec(t.text)[0], l = r(e, s);
		(c != l || o.from < t.from + c.length) && (n[t.from] = s, a.push({
			from: t.from,
			to: t.from + c.length,
			insert: l
		}));
	});
	return a.changes.empty || t(e.update(a, { userEvent: "indent" })), !0;
}, Q = ({ state: e, dispatch: t }) => e.readOnly ? !1 : (t(e.update(Z(e, (t, n) => {
	n.push({
		from: t.from,
		insert: e.facet(c)
	});
}), { userEvent: "input.indent" })), !0), $ = ({ state: e, dispatch: t }) => e.readOnly ? !1 : (t(e.update(Z(e, (t, n) => {
	let a = /^\s*/.exec(t.text)[0];
	if (!a) return;
	let o = i(a, e.tabSize), s = 0, c = r(e, Math.max(0, o - v(e)));
	for (; s < a.length && s < c.length && a.charCodeAt(s) == c.charCodeAt(s);) s++;
	n.push({
		from: t.from + s,
		to: t.from + a.length,
		insert: c.slice(s)
	});
}), { userEvent: "delete.dedent" })), !0), Ht = (e) => (e.setTabFocusMode(), !0), Ut = [
	{
		key: "Ctrl-b",
		run: B,
		shift: We,
		preventDefault: !0
	},
	{
		key: "Ctrl-f",
		run: V,
		shift: Ge
	},
	{
		key: "Ctrl-p",
		run: je,
		shift: Qe
	},
	{
		key: "Ctrl-n",
		run: Me,
		shift: $e
	},
	{
		key: "Ctrl-a",
		run: ze,
		shift: st
	},
	{
		key: "Ctrl-e",
		run: Be,
		shift: ct
	},
	{
		key: "Ctrl-d",
		run: xt
	},
	{
		key: "Ctrl-h",
		run: Y
	},
	{
		key: "Ctrl-k",
		run: Tt
	},
	{
		key: "Ctrl-Alt-h",
		run: Ct
	},
	{
		key: "Ctrl-o",
		run: Ot
	},
	{
		key: "Ctrl-t",
		run: kt
	},
	{
		key: "Ctrl-v",
		run: W
	}
], Wt = /*@__PURE__*/ [
	{
		key: "ArrowLeft",
		run: B,
		shift: We,
		preventDefault: !0
	},
	{
		key: "Mod-ArrowLeft",
		mac: "Alt-ArrowLeft",
		run: Te,
		shift: qe,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowLeft",
		run: Le,
		shift: at,
		preventDefault: !0
	},
	{
		key: "ArrowRight",
		run: V,
		shift: Ge,
		preventDefault: !0
	},
	{
		key: "Mod-ArrowRight",
		mac: "Alt-ArrowRight",
		run: Ee,
		shift: Je,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowRight",
		run: Re,
		shift: ot,
		preventDefault: !0
	},
	{
		key: "ArrowUp",
		run: je,
		shift: Qe,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowUp",
		run: lt,
		shift: dt
	},
	{
		mac: "Ctrl-ArrowUp",
		run: Pe,
		shift: tt
	},
	{
		key: "ArrowDown",
		run: Me,
		shift: $e,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowDown",
		run: ut,
		shift: ft
	},
	{
		mac: "Ctrl-ArrowDown",
		run: W,
		shift: nt
	},
	{
		key: "PageUp",
		run: Pe,
		shift: tt
	},
	{
		key: "PageDown",
		run: W,
		shift: nt
	},
	{
		key: "Home",
		run: Ie,
		shift: it,
		preventDefault: !0
	},
	{
		key: "Mod-Home",
		run: lt,
		shift: dt
	},
	{
		key: "End",
		run: Fe,
		shift: rt,
		preventDefault: !0
	},
	{
		key: "Mod-End",
		run: ut,
		shift: ft
	},
	{
		key: "Enter",
		run: Rt,
		shift: Rt
	},
	{
		key: "Mod-a",
		run: pt
	},
	{
		key: "Backspace",
		run: Y,
		shift: Y,
		preventDefault: !0
	},
	{
		key: "Delete",
		run: xt,
		preventDefault: !0
	},
	{
		key: "Mod-Backspace",
		mac: "Alt-Backspace",
		run: Ct,
		preventDefault: !0
	},
	{
		key: "Mod-Delete",
		mac: "Alt-Delete",
		run: wt,
		preventDefault: !0
	},
	{
		mac: "Mod-Backspace",
		run: Et,
		preventDefault: !0
	},
	{
		mac: "Mod-Delete",
		run: Dt,
		preventDefault: !0
	}
].concat(/*@__PURE__*/ Ut.map((e) => ({
	mac: e.key,
	run: e.run,
	shift: e.shift
}))), Gt = /*@__PURE__*/ [
	{
		key: "Alt-ArrowLeft",
		mac: "Ctrl-ArrowLeft",
		run: Oe,
		shift: Ye
	},
	{
		key: "Alt-ArrowRight",
		mac: "Ctrl-ArrowRight",
		run: ke,
		shift: Xe
	},
	{
		key: "Alt-ArrowUp",
		run: jt
	},
	{
		key: "Shift-Alt-ArrowUp",
		run: Pt
	},
	{
		key: "Alt-ArrowDown",
		run: Mt
	},
	{
		key: "Shift-Alt-ArrowDown",
		run: Ft
	},
	{
		key: "Mod-Alt-ArrowUp",
		run: _t
	},
	{
		key: "Mod-Alt-ArrowDown",
		run: vt
	},
	{
		key: "Escape",
		run: yt
	},
	{
		key: "Mod-Enter",
		run: zt
	},
	{
		key: "Alt-l",
		mac: "Ctrl-l",
		run: mt
	},
	{
		key: "Mod-i",
		run: ht,
		preventDefault: !0
	},
	{
		key: "Mod-[",
		run: $
	},
	{
		key: "Mod-]",
		run: Q
	},
	{
		key: "Mod-Alt-\\",
		run: Vt
	},
	{
		key: "Shift-Mod-k",
		run: It
	},
	{
		key: "Shift-Mod-\\",
		run: He
	},
	{
		key: "Mod-/",
		run: re
	},
	{
		key: "Alt-A",
		run: ae
	},
	{
		key: "Ctrl-m",
		mac: "Shift-Alt-m",
		run: Ht
	}
].concat(Wt), Kt = {
	key: "Tab",
	run: Q,
	shift: $
};
//#endregion
export { Q as a, pt as c, T as d, $ as i, ae as l, me as n, Kt as o, Ce as r, E as s, Gt as t, ie as u };

//# sourceMappingURL=@codemirror-commands.js.map