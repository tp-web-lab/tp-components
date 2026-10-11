import { getLanguageFromFilename as e } from "../utilities/code.js";
import { t } from "./base.js";
import { loadUsedTpComponents as n } from "../tp-loader.js";
import "./icon-button.js";
import "./icon.js";
import { resolveComponentSourceUrl as r } from "../utilities/source-url.js";
import { a as i } from "./asciidoc.js";
import "./toolbar.js";
import "./color.js";
import "./dropdown.js";
import "./fullscreen.js";
import "./theme.js";
import { ot as a, st as o } from "./dist.js";
import "./code-editor.js";
import "./menu.js";
import { renderMarkdownInto as s, renderMarkdownRuntimeIn as c } from "../components/markdown/markdown.js";
import { a as l } from "./restructuredtext.js";
import { formatHtmlForDisplay as u } from "../utilities/html-code.js";
import "./checkbox-list.js";
import "./emoji-picker.js";
import "./icon-picker.js";
import "./symbol-picker.js";
//#region ../node_modules/.pnpm/orderedmap@2.1.1/node_modules/orderedmap/dist/index.js
function d(e) {
	this.content = e;
}
d.prototype = {
	constructor: d,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(e, t, n) {
		var r = n && n != e ? this.remove(n) : this, i = r.find(e), a = r.content.slice();
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new d(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new d(n);
	},
	addToStart: function(e, t) {
		return new d([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new d(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new d(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = d.from(e), e.size ? new d(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = d.from(e), e.size ? new d(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = d.from(e);
		for (var n = 0; n < e.content.length; n += 2) t = t.remove(e.content[n]);
		return t;
	},
	toObject: function() {
		var e = {};
		return this.forEach(function(t, n) {
			e[t] = n;
		}), e;
	},
	get size() {
		return this.content.length >> 1;
	}
}, d.from = function(e) {
	if (e instanceof d) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new d(t);
};
//#endregion
//#region ../node_modules/.pnpm/prosemirror-model@1.25.11/node_modules/prosemirror-model/dist/index.js
function f(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) {
			n += i.nodeSize;
			continue;
		}
		if (!i.sameMarkup(a)) return n;
		if (i.isText && i.text != a.text) {
			let e = i.text, t = a.text, r = 0;
			for (; e[r] == t[r]; r++) n++;
			return r && r < e.length && r < t.length && h(e.charCodeAt(r - 1)) && m(e.charCodeAt(r)) && n--, n;
		}
		if (i.content.size || a.content.size) {
			let e = f(i.content, a.content, n + 1);
			if (e != null) return e;
		}
		n += i.nodeSize;
	}
}
function p(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) {
			n -= c, r -= c;
			continue;
		}
		if (!o.sameMarkup(s)) return {
			a: n,
			b: r
		};
		if (o.isText && o.text != s.text) {
			let e = o.text, t = s.text, i = e.length, a = t.length;
			for (; i > 0 && a > 0 && e[i - 1] == t[a - 1];) i--, a--, n--, r--;
			return i && a && i < e.length && h(e.charCodeAt(i - 1)) && m(e.charCodeAt(i)) && (n++, r++), {
				a: n,
				b: r
			};
		}
		if (o.content.size || s.content.size) {
			let e = p(o.content, s.content, n - 1, r - 1);
			if (e) return e;
		}
		n -= c, r -= c;
	}
}
function m(e) {
	return e >= 56320 && e < 57344;
}
function h(e) {
	return e >= 55296 && e < 56320;
}
var g = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, t = 0) {
		return f(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return p(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return v(0, e);
		if (e == this.size) return v(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? v(t + 1, i) : v(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return e.fromArray(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n ||= t.slice(0, e), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
g.empty = new g([], 0);
var _ = {
	index: 0,
	offset: 0
};
function v(e, t) {
	return _.index = e, _.offset = t, _;
}
function y(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!y(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !y(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var b = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t ||= e.slice(0, r);
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t ||= e.slice(0, r), t.push(this), n = !0), t && t.push(i);
		}
		return t ||= e.slice(), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && y(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		let r = n.create(t.attrs);
		return n.checkAttrs(r.attrs), r;
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
b.none = [];
var x = class extends Error {}, S = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = te(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(ee(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(g.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
S.empty = new S(g.empty, 0, 0);
function ee(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(ee(a.content, t - i - 1, n - i - 1)));
}
function te(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = te(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function ne(e, t, n) {
	if (n.openStart > e.depth) throw new x("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new x("Inconsistent open depths");
	return re(e, t, n, 0);
}
function re(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = re(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	} else if (!n.content.size) return se(a, le(e, t, r));
	else if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return se(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	} else {
		let { start: i, end: o } = ue(n, e);
		return se(a, ce(e, i, o, t, r));
	}
}
function C(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new x("Cannot join " + t.type.name + " onto " + e.type.name);
}
function ie(e, t, n) {
	let r = e.node(n);
	return C(r, t.node(n)), r;
}
function ae(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function oe(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (ae(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) ae(i.child(e), r);
	t && t.depth == n && t.textOffset && ae(t.nodeBefore, r);
}
function se(e, t) {
	if (!e.type.validContent(t)) throw new x("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function ce(e, t, n, r, i) {
	let a = e.depth > i && ie(e, t, i + 1), o = r.depth > i && ie(n, r, i + 1), s = [];
	return oe(null, e, i, s), a && o && t.index(i) == n.index(i) ? (C(a, o), ae(se(a, ce(e, t, n, r, i + 1)), s)) : (a && ae(se(a, le(e, t, i + 1)), s), oe(t, n, i, s), o && ae(se(o, le(n, r, i + 1)), s)), oe(r, null, i, s), new g(s);
}
function le(e, t, n) {
	let r = [];
	return oe(null, e, n, r), e.depth > n && ae(se(ie(e, t, n + 1), le(e, t, n + 1)), r), oe(t, null, n, r), new g(r);
}
function ue(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(g.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var de = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return b.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive === !1 && (!r || !i[a].isInSet(r.marks)) && (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive === !1 && (!r || !n[i].isInSet(r.marks)) && (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new he(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = me.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else me.set(t, r = new fe());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % pe, i;
	}
}, fe = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, pe = 12, me = /* @__PURE__ */ new WeakMap(), he = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, ge = Object.create(null), _e = class e {
	constructor(e, t, n, r = b.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || g.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && y(this.attrs, t || e.defaultAttrs || ge) && b.sameSet(this.marks, n || b.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return S.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new S(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return ne(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return de.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return de.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), ye(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = g.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
		let e = b.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!b.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = g.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
_e.prototype.text = void 0;
var ve = class e extends _e {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : ye(this.marks, JSON.stringify(this.text));
	}
	get textContent() {
		return this.text;
	}
	textBetween(e, t) {
		return this.text.slice(e, t);
	}
	get nodeSize() {
		return this.text.length;
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.text, t);
	}
	withText(t) {
		return t == this.text ? this : new e(this.type, this.attrs, t, this.marks);
	}
	cut(e = 0, t = this.text.length) {
		return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
	}
	eq(e) {
		return this.sameMarkup(e) && this.text == e.text;
	}
	toJSON() {
		let e = super.toJSON();
		return e.text = this.text, e;
	}
};
function ye(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var be = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new xe(t, n);
		if (r.next == null) return e.empty;
		let i = Se(r);
		r.next && r.err("Unexpected trailing text");
		let a = Me(ke(i));
		return Ne(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return g.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				!a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!r.type || o.validEnd) && (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
be.empty = new be(!0);
var xe = class {
	constructor(e, t) {
		this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
	}
	get next() {
		return this.tokens[this.pos];
	}
	eat(e) {
		return this.next == e && (this.pos++ || !0);
	}
	err(e) {
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function Se(e) {
	let t = [];
	do
		t.push(Ce(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function Ce(e) {
	let t = [];
	do
		t.push(we(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function we(e) {
	let t = Oe(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = Ee(e, t);
	else break;
	return t;
}
function Te(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function Ee(e, t) {
	let n = Te(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : Te(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function De(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function Oe(e) {
	if (e.eat("(")) {
		let t = Se(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	} else if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = De(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function ke(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function Ae(e, t) {
	return t - e;
}
function je(e, t) {
	let n = [];
	return r(t), n.sort(Ae);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function Me(e) {
	let t = Object.create(null);
	return n(je(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				je(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new be(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(Ae);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function Ne(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function Pe(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function Fe(e, t) {
	let n = Object.create(null);
	for (let r in e) {
		let i = t && t[r];
		if (i === void 0) {
			let t = e[r];
			if (t.hasDefault) i = t.default;
			else throw RangeError("No value supplied for attribute " + r);
		}
		n[r] = i;
	}
	return n;
}
function Ie(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
function Le(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Be(e, r, t[r]);
	return n;
}
var Re = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = Le(e, n.attrs), this.defaultAttrs = Pe(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == be.empty;
	}
	get isAtom() {
		return this.isLeaf || !!this.spec.atom;
	}
	isInGroup(e) {
		return this.groups.indexOf(e) > -1;
	}
	get whitespace() {
		return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
	}
	hasRequiredAttrs() {
		for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
		return !1;
	}
	compatibleContent(e) {
		return this == e || this.contentMatch.compatible(e.contentMatch);
	}
	computeAttrs(e) {
		return !e && this.defaultAttrs ? this.defaultAttrs : Fe(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new _e(this, this.computeAttrs(e), g.from(t), b.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = g.from(t), this.checkContent(t), new _e(this, this.computeAttrs(e), t, b.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = g.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(g.empty, !0);
		return i ? new _e(this, e, t.append(i), b.setFrom(n)) : null;
	}
	validContent(e) {
		let t = this.contentMatch.matchFragment(e);
		if (!t || !t.validEnd) return !1;
		for (let t = 0; t < e.childCount; t++) if (!this.allowsMarks(e.child(t).marks)) return !1;
		return !0;
	}
	checkContent(e) {
		if (!this.validContent(e)) throw RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
	}
	checkAttrs(e) {
		Ie(this.attrs, e, "node", this.name);
	}
	allowsMarkType(e) {
		return this.markSet == null || this.markSet.indexOf(e) > -1;
	}
	allowsMarks(e) {
		if (this.markSet == null) return !0;
		for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
		return !0;
	}
	allowedMarks(e) {
		if (this.markSet == null) return e;
		let t;
		for (let n = 0; n < e.length; n++) this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t ||= e.slice(0, n);
		return t ? t.length ? t : b.none : e;
	}
	static compile(t, n) {
		let r = Object.create(null);
		t.forEach((t, i) => r[t] = new e(t, n, i));
		let i = n.spec.topNode || "doc";
		if (!r[i]) throw RangeError("Schema is missing its top node type ('" + i + "')");
		if (!r.text) throw RangeError("Every schema needs a 'text' type");
		for (let e in r.text.attrs) throw RangeError("The text node type should not have attributes");
		return r;
	}
};
function ze(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Be = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? ze(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, Ve = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = Le(e, r.attrs), this.excluded = null;
		let i = Pe(this.attrs);
		this.instance = i ? new b(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new b(this, Fe(this.attrs, e));
	}
	static compile(t, n) {
		let r = Object.create(null), i = 0;
		return t.forEach((t, a) => r[t] = new e(t, i++, n, a)), r;
	}
	removeFromSet(e) {
		for (var t = 0; t < e.length; t++) e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
	}
	checkAttrs(e) {
		Ie(this.attrs, e, "mark", this.name);
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, He = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = d.from(e.nodes), t.marks = d.from(e.marks || {}), this.nodes = Re.compile(this.spec.nodes, this), this.marks = Ve.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = be.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Ue(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Ue(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => _e.fromJSON(this, e), this.markFromJSON = (e) => b.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Re)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new ve(n, n.defaultAttrs, e, b.setFrom(t));
	}
	mark(e, t) {
		return typeof e == "string" && (e = this.marks[e]), e.create(t);
	}
	nodeType(e) {
		let t = this.nodes[e];
		if (!t) throw RangeError("Unknown node type: " + e);
		return t;
	}
};
function Ue(e, t) {
	let n = [];
	for (let r = 0; r < t.length; r++) {
		let i = t[r], a = e.marks[i], o = a;
		if (a) n.push(a);
		else for (let t in e.marks) {
			let r = e.marks[t];
			(i == "_" || r.spec.group && r.spec.group.split(" ").indexOf(i) > -1) && n.push(o = r);
		}
		if (!o) throw SyntaxError("Unknown mark type: '" + t[r] + "'");
	}
	return n;
}
function We(e) {
	return e.tag != null;
}
function Ge(e) {
	return e.style != null;
}
var Ke = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (We(e)) this.tags.push(e);
			else if (Ge(e)) {
				let t = /[^=]*/.exec(e.style)[0];
				n.indexOf(t) < 0 && n.push(t), this.styles.push(e);
			}
		}), this.normalizeLists = !this.tags.some((t) => {
			if (!/^(ul|ol)\b/.test(t.tag) || !t.node) return !1;
			let n = e.nodes[t.node];
			return n.contentMatch.matchType(n);
		});
	}
	parse(e, t = {}) {
		let n = new tt(this, t, !1);
		return n.addAll(e, b.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new tt(this, t, !0);
		return n.addAll(e, b.none, t.from, t.to), S.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (rt(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
				if (n.getAttrs) {
					let t = n.getAttrs(e);
					if (t === !1) continue;
					n.attrs = t || void 0;
				}
				return n;
			}
		}
	}
	matchStyle(e, t, n, r) {
		for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
			let r = this.styles[i], a = r.style;
			if (!(a.indexOf(e) != 0 || r.context && !n.matchesContext(r.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
				if (r.getAttrs) {
					let e = r.getAttrs(t);
					if (e === !1) continue;
					r.attrs = e || void 0;
				}
				return r;
			}
		}
	}
	static schemaRules(e) {
		let t = [];
		function n(e) {
			let n = e.priority == null ? 50 : e.priority, r = 0;
			for (; r < t.length; r++) {
				let e = t[r];
				if ((e.priority == null ? 50 : e.priority) < n) break;
			}
			t.splice(r, 0, e);
		}
		for (let t in e.marks) {
			let r = e.marks[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = it(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = it(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, qe = {
	address: !0,
	article: !0,
	aside: !0,
	blockquote: !0,
	body: !0,
	canvas: !0,
	dd: !0,
	div: !0,
	dl: !0,
	fieldset: !0,
	figcaption: !0,
	figure: !0,
	footer: !0,
	form: !0,
	h1: !0,
	h2: !0,
	h3: !0,
	h4: !0,
	h5: !0,
	h6: !0,
	header: !0,
	hgroup: !0,
	hr: !0,
	li: !0,
	noscript: !0,
	ol: !0,
	output: !0,
	p: !0,
	pre: !0,
	section: !0,
	table: !0,
	tfoot: !0,
	ul: !0
}, Je = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, Ye = {
	ol: !0,
	ul: !0
}, Xe = 1, Ze = 2, Qe = 4;
function $e(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? 3 : n & -5 : (t ? Xe : 0) | (t === "full" ? Ze : 0);
}
var et = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = b.none, this.match = i || (a & Qe ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(g.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & Xe)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = g.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(g.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !qe.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, tt = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = $e(null, t.preserveWhitespace, 0) | (n ? Qe : 0);
		i = r ? new et(r.type, r.attrs, b.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new et(null, null, b.none, !0, null, a) : new et(e.schema.topNodeType, null, b.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & Ze ? "full" : this.localPreserveWS || (r.options & Xe) > 0, { schema: a } = this.parser;
		if (i === "full" || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
			if (!i) {
				if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
					let t = r.content[r.content.length - 1], i = e.previousSibling;
					(!t || i && i.nodeName == "BR" || t.isText && /[ \t\r\n\u000c]$/.test(t.text)) && (n = n.slice(1));
				}
			} else if (i === "full") n = n.replace(/\r\n?/g, "\n");
			else if (a.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(a.linebreakReplacement.create())) {
				let e = n.split(/\r?\n|\r/);
				for (let n = 0; n < e.length; n++) n && this.insertNode(a.linebreakReplacement.create(), t, !0), e[n] && this.insertNode(a.text(e[n]), t, !/\S/.test(e[n]));
				n = "";
			} else n = n.replace(/\r?\n|\r/g, " ");
			n && this.insertNode(a.text(n), t, !/\S/.test(n)), this.findInText(e);
		} else this.findInside(e);
	}
	addElement(e, t, n) {
		let r = this.localPreserveWS, i = this.top;
		(e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
		let a = e.nodeName.toLowerCase(), o;
		Ye.hasOwnProperty(a) && this.parser.normalizeLists && nt(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : Je.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (qe.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
			else if (!e.firstChild) {
				this.leafFallback(e, t);
				break out;
			}
			let o = s && s.skip ? t : this.readStyles(e, t);
			o && this.addAll(e, o), n && this.sync(i), this.needsBlock = r;
		} else {
			let n = this.readStyles(e, t);
			n && this.addElementByRule(e, s, n, s.consuming === !1 ? o : void 0);
		}
		this.localPreserveWS = r;
	}
	leafFallback(e, t) {
		e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode("\n"), t);
	}
	ignoreFallback(e, t) {
		e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
	}
	readStyles(e, t) {
		let n = e.style;
		if (n && n.length) for (let e = 0; e < this.parser.matchedStyles.length; e++) {
			let r = this.parser.matchedStyles[e], i = n.getPropertyValue(r);
			if (i) for (let e;;) {
				let n = this.parser.matchStyle(r, i, this, e);
				if (!n) break;
				if (n.ignore) return null;
				if (t = n.clearMark ? t.filter((e) => !n.clearMark(e)) : t.concat(this.parser.schema.marks[n.mark].create(n.attrs)), n.consuming === !1) e = n;
				else break;
			}
		}
		return t;
	}
	addElementByRule(e, t, n, r) {
		let i, a;
		if (t.node) if (a = this.parser.schema.nodes[t.node], a.isLeaf) this.insertNode(a.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
		else {
			let e = this.enter(a, t.attrs || null, n, t.preserveWhitespace);
			e && (i = !0, n = e);
		}
		else {
			let e = this.parser.schema.marks[t.mark];
			n = n.concat(e.create(t.attrs));
		}
		let o = this.top;
		if (a && a.isLeaf) this.findInside(e);
		else if (r) this.addElement(e, n, r);
		else if (t.getContent) this.findInside(e), t.getContent(e, this.parser.schema).forEach((e) => this.insertNode(e, n, !1));
		else {
			let r = e;
			typeof t.contentElement == "string" ? r = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? r = t.contentElement(e) : t.contentElement && (r = t.contentElement), this.findAround(e, r, !0), this.addAll(r, n), this.findAround(e, r, !1);
		}
		i && this.sync(o) && this.open--;
	}
	addAll(e, t, n, r) {
		let i = n || 0;
		for (let a = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; a != o; a = a.nextSibling, ++i) this.findAtPoint(e, i), this.addDOM(a, t);
		this.findAtPoint(e, i);
	}
	findPlace(e, t, n) {
		let r, i;
		for (let t = this.open, a = 0; t >= 0; t--) {
			let o = this.nodes[t], s = o.findWrapping(e);
			if (s && (!r || r.length > s.length + a) && (r = s, i = o, !s.length)) break;
			if (o.solid) {
				if (n) break;
				a += 2;
			}
		}
		if (!r) return null;
		this.sync(i);
		for (let e = 0; e < r.length; e++) t = this.enterInner(r[e], null, t, !1);
		return t;
	}
	insertNode(e, t, n) {
		if (e.isInline && this.needsBlock && !this.top.type) {
			let e = this.textblockFromContext();
			e && (t = this.enterInner(e, null, t));
		}
		let r = this.findPlace(e, t, n);
		if (r) {
			this.closeExtra();
			let t = this.top;
			t.match &&= t.match.matchType(e.type);
			let n = b.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : at(i.type, e.type)) && (n = i.addToSet(n));
			return t.content.push(e.mark(n)), !0;
		}
		return !1;
	}
	enter(e, t, n, r) {
		let i = this.findPlace(e.create(t), n, !1);
		return i &&= this.enterInner(e, t, n, !0, r), i;
	}
	enterInner(e, t, n, r = !1, i) {
		this.closeExtra();
		let a = this.top;
		a.match = a.match && a.match.matchType(e);
		let o = $e(e, i, a.options);
		a.options & Qe && a.content.length == 0 && (o |= Qe);
		let s = b.none;
		return n = n.filter((t) => (a.type ? a.type.allowsMarkType(t.type) : at(t.type, e)) ? (s = t.addToSet(s), !1) : !0), this.nodes.push(new et(e, t, s, r, null, o)), this.open++, n;
	}
	closeExtra(e = !1) {
		let t = this.nodes.length - 1;
		if (t > this.open) {
			for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
			this.nodes.length = this.open + 1;
		}
	}
	finish() {
		return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
	}
	sync(e) {
		for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return this.open = t, !0;
		else this.localPreserveWS && (this.nodes[t].options |= Xe);
		return !1;
	}
	get currentPos() {
		this.closeExtra();
		let e = 0;
		for (let t = this.open; t >= 0; t--) {
			let n = this.nodes[t].content;
			for (let t = n.length - 1; t >= 0; t--) e += n[t].nodeSize;
			t && e++;
		}
		return e;
	}
	findAtPoint(e, t) {
		if (this.find) for (let n = 0; n < this.find.length; n++) this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
	}
	findInside(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
	}
	findAround(e, t, n) {
		if (e != t && this.find) for (let r = 0; r < this.find.length; r++) this.find[r].pos == null && e.nodeType == 1 && e.contains(this.find[r].node) && t.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos);
	}
	findInText(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
	}
	matchesContext(e) {
		if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
		let t = e.split("/"), n = this.options.context, r = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), i = -(n ? n.depth + 1 : 0) + +!r, a = (e, o) => {
			for (; e >= 0; e--) {
				let s = t[e];
				if (s == "") {
					if (e == t.length - 1 || e == 0) continue;
					for (; o >= i; o--) if (a(e - 1, o)) return !0;
					return !1;
				} else {
					let e = o > 0 || o == 0 && r ? this.nodes[o].type : n && o >= i ? n.node(o - i).type : null;
					if (!e || e.name != s && !e.isInGroup(s)) return !1;
					o--;
				}
			}
			return !0;
		};
		return a(t.length - 1, this.open);
	}
	textblockFromContext() {
		let e = this.options.context;
		if (e) for (let t = e.depth; t >= 0; t--) {
			let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
			if (n && n.isTextblock && n.defaultAttrs) return n;
		}
		for (let e in this.parser.schema.nodes) {
			let t = this.parser.schema.nodes[e];
			if (t.isTextblock && t.defaultAttrs) return t;
		}
	}
};
function nt(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && Ye.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function rt(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function it(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function at(e, t) {
	let n = t.schema.nodes;
	for (let r in n) {
		let i = n[r];
		if (!i.allowsMarkType(e)) continue;
		let a = [], o = (e) => {
			a.push(e);
			for (let n = 0; n < e.edgeCount; n++) {
				let { type: r, next: i } = e.edge(n);
				if (r == t || a.indexOf(i) < 0 && o(i)) return !0;
			}
		};
		if (o(i.contentMatch)) return !0;
	}
}
var ot = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= ct(t).createDocumentFragment();
		let r = n, i = [];
		return e.forEach((e) => {
			if (i.length || e.marks.length) {
				let n = 0, a = 0;
				for (; n < i.length && a < e.marks.length;) {
					let t = e.marks[a];
					if (!this.marks[t.type.name]) {
						a++;
						continue;
					}
					if (!t.eq(i[n][0]) || t.type.spec.spanning === !1) break;
					n++, a++;
				}
				for (; n < i.length;) r = i.pop()[1];
				for (; a < e.marks.length;) {
					let n = e.marks[a++], o = this.serializeMark(n, e.isInline, t);
					o && (i.push([n, r]), r.appendChild(o.dom), r = o.contentDOM || o.dom);
				}
			}
			r.appendChild(this.serializeNodeInner(e, t));
		}), n;
	}
	serializeNodeInner(e, t) {
		if (e.isText) return ct(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = ft(ct(t), this.nodes[e.type.name](e), null, e.attrs);
		if (r) {
			if (e.isLeaf) throw RangeError("Content hole not allowed in a leaf node spec");
			this.serializeFragment(e.content, t, r);
		}
		return n;
	}
	serializeNode(e, t = {}) {
		let n = this.serializeNodeInner(e, t);
		for (let r = e.marks.length - 1; r >= 0; r--) {
			let i = this.serializeMark(e.marks[r], e.isInline, t);
			i && ((i.contentDOM || i.dom).appendChild(n), n = i.dom);
		}
		return n;
	}
	serializeMark(e, t, n = {}) {
		let r = this.marks[e.type.name];
		return r && ft(ct(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : ft(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = st(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return st(e.marks);
	}
};
function st(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function ct(e) {
	return e.document || window.document;
}
var lt = /* @__PURE__ */ new WeakMap();
function ut(e) {
	let t = lt.get(e);
	return t === void 0 && lt.set(e, t = dt(e)), t;
}
function dt(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") if (Array.isArray(e)) if (typeof e[0] == "string") t ||= [], t.push(e);
		else for (let t = 0; t < e.length; t++) n(e[t]);
		else for (let t in e) n(e[t]);
	}
	return n(e), t;
}
function ft(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = ut(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
	let o = i.indexOf(" ");
	o > 0 && (n = i.slice(0, o), i = i.slice(o + 1));
	let s, c = n ? e.createElementNS(n, i) : e.createElement(i), l = t[1], u = 1;
	if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
		u = 2;
		for (let e in l) if (l[e] != null) {
			let t = e.indexOf(" ");
			t > 0 ? c.setAttributeNS(e.slice(0, t), e.slice(t + 1), l[e]) : e == "style" && c.style ? c.style.cssText = l[e] : c.setAttribute(e, l[e]);
		}
	}
	for (let i = u; i < t.length; i++) {
		let a = t[i];
		if (a === 0) {
			if (i < t.length - 1 || i > u) throw RangeError("Content hole must be the only child of its parent node");
			return {
				dom: c,
				contentDOM: c
			};
		} else if (typeof a == "string") c.appendChild(e.createTextNode(a));
		else {
			let { dom: t, contentDOM: i } = ft(e, a, n, r);
			if (c.appendChild(t), i) {
				if (s) throw RangeError("Multiple content holes");
				s = i;
			}
		}
	}
	return {
		dom: c,
		contentDOM: s
	};
}
//#endregion
//#region ../node_modules/.pnpm/prosemirror-transform@1.12.0/node_modules/prosemirror-transform/dist/index.js
var pt = 65535, mt = 2 ** 16;
function ht(e, t) {
	return e + t * mt;
}
function gt(e) {
	return e & pt;
}
function _t(e) {
	return (e - (e & pt)) / mt;
}
var vt = 1, yt = 2, bt = 4, xt = 8, St = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & xt) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & bt) > 0;
	}
}, Ct = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = gt(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + _t(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : ht(o / 3, e - s), f = e == s ? yt : e == u ? vt : bt;
				return (t < 0 ? e != s : e != u) && (f |= xt), new St(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new St(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = gt(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
Ct.empty = new Ct([]);
var wt = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData ||= (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror ||= [], this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new St(e, r, null);
	}
}, Tt = Object.create(null), w = class {
	getMap() {
		return Ct.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = Tt[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Tt) throw RangeError("Duplicate use of step JSON ID " + e);
		return Tt[e] = t, t.prototype.jsonID = e, t;
	}
}, T = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof x) return e.fail(t.message);
			throw t;
		}
	}
};
function Et(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(Et(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return g.fromArray(r);
}
var Dt = class e extends w {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new S(Et(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return T.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new Ot(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
w.jsonID("addMark", Dt);
var Ot = class e extends w {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new S(Et(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return T.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Dt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
w.jsonID("removeMark", Ot);
var kt = class e extends w {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return T.fromReplace(e, this.pos, this.pos + 1, new S(g.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new At(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
w.jsonID("addNodeMark", kt);
var At = class e extends w {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return T.fromReplace(e, this.pos, this.pos + 1, new S(g.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new kt(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
w.jsonID("removeNodeMark", At);
var jt = class e extends w {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Mt(e, this.from, this.to) ? T.fail("Structure replace would overwrite content") : T.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new Ct([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? S.empty : new S(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? S.empty : new S(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		} else return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, S.fromJSON(t, n.slice), !!n.structure);
	}
};
jt.MAP_BIAS = 1, w.jsonID("replace", jt);
var E = class e extends w {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Mt(e, this.from, this.gapFrom) || Mt(e, this.gapTo, this.to))) return T.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return T.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? T.fromReplace(e, this.from, this.to, n) : T.fail("Content does not fit in gap");
	}
	getMap() {
		return new Ct([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, S.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
w.jsonID("replaceAround", E);
function Mt(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function Nt(e, t, n, r) {
	let i = [], a = [], o, s;
	e.doc.nodesBetween(t, n, (e, c, l) => {
		if (!e.isInline) return;
		let u = e.marks;
		if (!r.isInSet(u) && l.type.allowsMarkType(r.type)) {
			let l = Math.max(c, t), d = Math.min(c + e.nodeSize, n), f = r.addToSet(u);
			for (let e = 0; e < u.length; e++) u[e].isInSet(f) || (o && o.to == l && o.mark.eq(u[e]) ? o.to = d : i.push(o = new Ot(l, d, u[e])));
			s && s.to == l ? s.to = d : a.push(s = new Dt(l, d, r));
		}
	}), i.forEach((t) => e.step(t)), a.forEach((t) => e.step(t));
}
function Pt(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline) return;
		a++;
		let s = null;
		if (r instanceof Ve) {
			let t = e.marks, n;
			for (; n = r.isInSet(t);) (s ||= []).push(n), t = n.removeFromSet(t);
		} else r ? r.isInSet(e.marks) && (s = [r]) : s = e.marks;
		if (s && s.length) {
			let r = Math.min(o + e.nodeSize, n);
			for (let e = 0; e < s.length; e++) {
				let n = s[e], c;
				for (let e = 0; e < i.length; e++) {
					let t = i[e];
					t.step == a - 1 && n.eq(i[e].style) && (c = t);
				}
				c ? (c.to = r, c.step = a) : i.push({
					style: n,
					from: Math.max(o, t),
					to: r,
					step: a
				});
			}
		}
	}), i.forEach((t) => e.step(new Ot(t.from, t.to, t.style)));
}
function Ft(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new jt(s, l, S.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new Ot(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r ||= new S(g.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0), o.push(new jt(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(g.empty, !0);
		e.replace(s, s, new S(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function It(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Lt(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !It(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function Rt(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = g.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = g.from(r.node(e).copy(u)), d++) : c--;
	let f = g.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = g.from(i.node(e).copy(f)), p++) : l++;
	e.step(new E(c, l, o, s, new S(u.append(f), d, p), u.size - d, !0));
}
function zt(e, t, n = null, r = e) {
	let i = Vt(e, t), a = i && Ht(r, t);
	return a ? i.map(Bt).concat({
		type: t,
		attrs: n
	}).concat(a.map(Bt)) : null;
}
function Bt(e) {
	return {
		type: e,
		attrs: null
	};
}
function Vt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function Ht(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function Ut(e, t, n) {
	let r = g.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = g.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new E(i, a, i, a, new S(r, 0, 0), n.length, !0));
}
function Wt(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && qt(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && Kt(e, t, n, a), Ft(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new E(c, l, c + 1, l - 1, new S(g.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && Gt(e, t, n, a), !1;
		}
	});
}
function Gt(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.isText) {
			let o, s = /\r?\n|\r/g;
			for (; o = s.exec(i.text);) {
				let i = e.mapping.slice(r).map(n + 1 + a + o.index);
				e.replaceWith(i, i + 1, t.type.schema.linebreakReplacement.create());
			}
		}
	});
}
function Kt(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function qt(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function Jt(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n ||= a.type;
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new E(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new S(g.from(o), 0, 0), 1, !0));
}
function Yt(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function Xt(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = g.empty, o = g.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = g.from(i.node(e).copy(a));
		let t = r && r[s];
		o = g.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new jt(t, t, new S(a.append(o), n, n), !0));
}
function Zt(e, t) {
	let n = e.resolve(t), r = n.index();
	return $t(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Qt(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function $t(e, t) {
	return !!(e && t && !e.isLeaf && Qt(e, t));
}
function en(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		Kt(e, r.node(), r.before(), s);
	}
	o.inlineContent && Ft(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new jt(l, c.map(t + n, -1), S.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		Gt(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function tn(e, t, n) {
	let r = e.resolve(t);
	if (r.parent.canReplaceWith(r.index(), r.index(), n)) return t;
	if (r.parentOffset == 0) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.index(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.before(e + 1);
		if (t > 0) return null;
	}
	if (r.parentOffset == r.parent.content.size) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.indexAfter(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.after(e + 1);
		if (t < r.node(e).childCount) return null;
	}
	return null;
}
function nn(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
function rn(e, t, n = t, r = S.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return an(i, a, r) ? new jt(t, n, r) : new on(i, a, r).fit();
}
function an(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var on = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = g.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = g.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new S(i, a, o);
		return e > -1 ? new E(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new jt(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = ln(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(g.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = ln(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new S(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = ln(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new S(sn(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new S(sn(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: u, type: d } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			u = u.matchFragment(r);
		}
		let f = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = u.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(un(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = cn(this.placed, t, g.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? S.empty : new S(sn(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new S(sn(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !dn(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = dn(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = dn(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = cn(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = cn(this.placed, this.depth, g.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(g.empty, !0);
		e.childCount && (this.placed = cn(this.placed, this.frontier.length, e));
	}
};
function sn(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(sn(e.firstChild.content, t - 1, n)));
}
function cn(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(cn(e.lastChild.content, t - 1, n)));
}
function ln(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function un(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, un(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(g.empty, !0)))), e.copy(r);
}
function dn(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !fn(n, a.content, o) ? s : null;
}
function fn(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function pn(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function mn(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (an(i, a, r)) return e.step(new jt(t, n, r));
	let o = vn(i, a);
	o[o.length - 1] == 0 && o.pop();
	let s = -(i.depth + 1);
	o.unshift(s);
	for (let e = i.depth, t = i.pos - 1; e > 0; e--, t--) {
		let n = i.node(e).type.spec;
		if (n.defining || n.definingAsContext || n.isolating) break;
		o.indexOf(e) > -1 ? s = e : i.before(e) == t && o.splice(1, 0, -e);
	}
	let c = o.indexOf(s), l = [], u = r.openStart;
	for (let e = r.content, t = 0;; t++) {
		let n = e.firstChild;
		if (l.push(n), t == r.openStart) break;
		e = n.content;
	}
	for (let e = u - 1; e >= 0; e--) {
		let t = l[e], n = pn(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new S(hn(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function hn(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(hn(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(g.empty, !0));
	}
	return e;
}
function gn(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = tn(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new S(g.from(r), 0, 0));
}
function _n(e, t, n) {
	let r = e.doc.resolve(t), i = e.doc.resolve(n);
	if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
		let a = r.sharedDepth(n), o = !1;
		for (let e = r.depth; e > a; e--) r.node(e).type.spec.isolating && (o = !0);
		for (let e = i.depth; e > a; e--) i.node(e).type.spec.isolating && (o = !0);
		if (!o) {
			for (let e = r.depth; e > 0 && t == r.start(e); e--) t = r.before(e);
			for (let e = i.depth; e > 0 && n == i.start(e); e--) n = i.before(e);
			r = e.doc.resolve(t), i = e.doc.resolve(n);
		}
	}
	let a = vn(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function vn(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var yn = class e extends w {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return T.fromReplace(e, this.pos, this.pos + 1, new S(g.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return Ct.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
w.jsonID("attr", yn);
var bn = class e extends w {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return T.ok(n);
	}
	getMap() {
		return Ct.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
w.jsonID("docAttr", bn);
var xn = class extends Error {};
xn = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, xn.prototype = Object.create(Error.prototype), xn.prototype.constructor = xn, xn.prototype.name = "TransformError";
var Sn = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new wt();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new xn(t.failed);
		return this;
	}
	maybeStep(e) {
		let t = e.apply(this.doc);
		return t.failed || this.addStep(e, t.doc), t;
	}
	get docChanged() {
		return this.steps.length > 0;
	}
	changedRange() {
		let e = 1e9, t = -1e9;
		for (let n = 0; n < this.mapping.maps.length; n++) {
			let r = this.mapping.maps[n];
			n && (e = r.map(e, 1), t = r.map(t, -1)), r.forEach((n, r, i, a) => {
				e = Math.min(e, i), t = Math.max(t, a);
			});
		}
		return e == 1e9 ? null : {
			from: e,
			to: t
		};
	}
	addStep(e, t) {
		this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
	}
	replace(e, t = e, n = S.empty) {
		let r = rn(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new S(g.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, S.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return mn(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return gn(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return _n(this, e, t), this;
	}
	lift(e, t) {
		return Rt(this, e, t), this;
	}
	join(e, t = 1) {
		return en(this, e, t), this;
	}
	wrap(e, t) {
		return Ut(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Wt(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return Jt(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new yn(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new bn(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new kt(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof b) t.isInSet(n.marks) && this.step(new At(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new At(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return Xt(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return Nt(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return Pt(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Ft(this, e, t, n), this;
	}
}, Cn = Object.create(null), D = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new wn(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = S.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? S.empty : t), o == 0 && jn(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), jn(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new O(e) : An(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? An(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : An(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new A(e.node(0));
	}
	static atStart(e) {
		return An(e, e, 0, 0, 1) || new A(e);
	}
	static atEnd(e) {
		return An(e, e, e.content.size, e.childCount, -1) || new A(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = Cn[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Cn) throw RangeError("Duplicate use of selection JSON ID " + e);
		return Cn[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return O.between(this.$anchor, this.$head).getBookmark();
	}
};
D.prototype.visible = !0;
var wn = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, Tn = !1;
function En(e) {
	!Tn && !e.parent.inlineContent && (Tn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var O = class e extends D {
	constructor(e, t = e) {
		En(e), En(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return D.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = S.empty) {
		if (super.replace(e, t), t == S.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new Dn(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = D.findFrom(n, r, !0) || D.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return D.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (D.findFrom(t, -r, !0) || D.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
D.jsonID("text", O);
var Dn = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return O.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, k = class e extends D {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? D.near(a) : new e(a);
	}
	content() {
		return new S(g.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new On(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
k.prototype.visible = !1, D.jsonID("node", k);
var On = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new Dn(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && k.isSelectable(n) ? new k(t) : D.near(t);
	}
}, A = class e extends D {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = S.empty) {
		if (t == S.empty) {
			e.delete(0, e.doc.content.size);
			let t = D.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return kn;
	}
};
D.jsonID("all", A);
var kn = {
	map() {
		return this;
	},
	resolve(e) {
		return new A(e);
	}
};
function An(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return O.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = An(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && k.isSelectable(r)) return k.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function jn(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof jt || i instanceof E)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(D.near(e.doc.resolve(o), n));
}
var Mn = 1, Nn = 2, Pn = 4, Fn = class extends Sn {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Mn) & -3, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & Mn) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= Nn, this;
	}
	ensureMarks(e) {
		return b.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & Nn) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= -3, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || b.none))), n.replaceWith(this, e), this;
	}
	deleteSelection() {
		return this.selection.replace(this), this;
	}
	insertText(e, t, n) {
		let r = this.doc.type.schema;
		if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
		{
			if (n ??= t, !e) return this.deleteRange(t, n);
			let i = this.storedMarks;
			if (!i) {
				let e = this.doc.resolve(t);
				i = n == t ? e.marks() : e.marksAcross(this.doc.resolve(n));
			}
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(D.near(this.selection.$to)), this;
		}
	}
	setMeta(e, t) {
		return this.meta[typeof e == "string" ? e : e.key] = t, this;
	}
	getMeta(e) {
		return this.meta[typeof e == "string" ? e : e.key];
	}
	get isGeneric() {
		for (let e in this.meta) return !1;
		return !0;
	}
	scrollIntoView() {
		return this.updated |= Pn, this;
	}
	get scrolledIntoView() {
		return (this.updated & Pn) > 0;
	}
};
function In(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Ln = class {
	constructor(e, t, n) {
		this.name = e, this.init = In(t.init, n), this.apply = In(t.apply, n);
	}
}, Rn = [
	new Ln("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new Ln("selection", {
		init(e, t) {
			return e.selection || D.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new Ln("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new Ln("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], zn = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = Rn.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new Ln(e.key, e.spec.state, e));
		});
	}
}, Bn = class e {
	constructor(e) {
		this.config = e;
	}
	get schema() {
		return this.config.schema;
	}
	get plugins() {
		return this.config.plugins;
	}
	apply(e) {
		return this.applyTransaction(e).state;
	}
	filterTransaction(e, t = -1) {
		for (let n = 0; n < this.config.plugins.length; n++) if (n != t) {
			let t = this.config.plugins[n];
			if (t.spec.filterTransaction && !t.spec.filterTransaction.call(t, e, this)) return !1;
		}
		return !0;
	}
	applyTransaction(e) {
		if (!this.filterTransaction(e)) return {
			state: this,
			transactions: []
		};
		let t = [e], n = this.applyInner(e), r = null;
		for (;;) {
			let i = !1;
			for (let a = 0; a < this.config.plugins.length; a++) {
				let o = this.config.plugins[a];
				if (o.spec.appendTransaction) {
					let s = r ? r[a].n : 0, c = r ? r[a].state : this, l = s < t.length && o.spec.appendTransaction.call(o, s ? t.slice(s) : t, c, n);
					if (l && n.filterTransaction(l, a)) {
						if (l.setMeta("appendedTransaction", e), !r) {
							r = [];
							for (let e = 0; e < this.config.plugins.length; e++) r.push(e < a ? {
								state: n,
								n: t.length
							} : {
								state: this,
								n: 0
							});
						}
						t.push(l), n = n.applyInner(l), i = !0;
					}
					r && (r[a] = {
						state: n,
						n: t.length
					});
				}
			}
			if (!i) return {
				state: n,
				transactions: t
			};
		}
	}
	applyInner(t) {
		if (!t.before.eq(this.doc)) throw RangeError("Applying a mismatched transaction");
		let n = new e(this.config), r = this.config.fields;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n[i.name] = i.apply(t, this[i.name], this, n);
		}
		return n;
	}
	get tr() {
		return new Fn(this);
	}
	static create(t) {
		let n = new zn(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new zn(this.schema, t.plugins), r = n.fields, i = new e(n);
		for (let e = 0; e < r.length; e++) {
			let n = r[e].name;
			i[n] = this.hasOwnProperty(n) ? this[n] : r[e].init(t, i);
		}
		return i;
	}
	toJSON(e) {
		let t = {
			doc: this.doc.toJSON(),
			selection: this.selection.toJSON()
		};
		if (this.storedMarks && (t.storedMarks = this.storedMarks.map((e) => e.toJSON())), e && typeof e == "object") for (let n in e) {
			if (n == "doc" || n == "selection") throw RangeError("The JSON fields `doc` and `selection` are reserved");
			let r = e[n], i = r.spec.state;
			i && i.toJSON && (t[n] = i.toJSON.call(r, this[r.key]));
		}
		return t;
	}
	static fromJSON(t, n, r) {
		if (!n) throw RangeError("Invalid input for EditorState.fromJSON");
		if (!t.schema) throw RangeError("Required config field 'schema' missing");
		let i = new zn(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = _e.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = D.fromJSON(a.doc, n.selection);
			else if (e.name == "storedMarks") n.storedMarks && (a.storedMarks = n.storedMarks.map(t.schema.markFromJSON));
			else {
				if (r) for (let i in r) {
					let o = r[i], s = o.spec.state;
					if (o.key == e.name && s && s.fromJSON && Object.prototype.hasOwnProperty.call(n, i)) {
						a[e.name] = s.fromJSON.call(o, t, n[i], a);
						return;
					}
				}
				a[e.name] = e.init(t, a);
			}
		}), a;
	}
};
function Vn(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = Vn(i, t, {})), n[r] = i;
	}
	return n;
}
var Hn = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && Vn(e.props, this, this.props), this.key = e.key ? e.key.key : Wn("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, Un = Object.create(null);
function Wn(e) {
	return e in Un ? e + "$" + ++Un[e] : (Un[e] = 0, e + "$");
}
var Gn = class {
	constructor(e = "key") {
		this.key = Wn(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, Kn = (e, t) => e.selection.empty ? !1 : (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function qn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var Jn = (e, t, n) => {
	let r = qn(e, n);
	if (!r) return !1;
	let i = Zn(r);
	if (!i) {
		let n = r.blockRange(), i = n && Lt(n);
		return i == null ? !1 : (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (dr(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Yn(a, "end") || k.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = rn(e.doc, r.before(n), r.after(n), S.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Yn(a, "end") ? D.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : k.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function Yn(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Xn = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = Zn(r);
	}
	let o = a && a.nodeBefore;
	return !o || !k.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(k.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Zn(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Qn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var $n = (e, t, n) => {
	let r = Qn(e, n);
	if (!r) return !1;
	let i = tr(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (dr(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Yn(a, "start") || k.isSelectable(a))) {
		let n = rn(e.doc, r.before(), r.after(), S.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Yn(a, "start") ? D.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : k.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, er = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = tr(r);
	}
	let o = a && a.nodeAfter;
	return !o || !k.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(k.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function tr(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var nr = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function rr(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var ir = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = rr(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(D.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, ar = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof A || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = rr(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(O.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, or = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (Yt(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Lt(r);
	return i == null ? !1 : (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function sr(e) {
	return (t, n) => {
		let { $from: r, $to: i } = t.selection;
		if (t.selection instanceof k && t.selection.node.isBlock) return !r.parentOffset || !Yt(t.doc, r.pos) ? !1 : (n && n(t.tr.split(r.pos).scrollIntoView()), !0);
		if (!r.depth) return !1;
		let a = [], o, s, c = !1, l = !1;
		for (let t = r.depth;; t--) if (r.node(t).isBlock) {
			c = r.end(t) == r.pos + (r.depth - t), l = r.start(t) == r.pos - (r.depth - t), s = rr(r.node(t - 1).contentMatchAt(r.indexAfter(t - 1)));
			let n = e && e(i.parent, c, r);
			a.unshift(n || (c && s ? { type: s } : null)), o = t;
			break;
		} else {
			if (t == 1) return !1;
			a.unshift(null);
		}
		let u = t.tr;
		(t.selection instanceof O || t.selection instanceof A) && u.deleteSelection();
		let d = u.mapping.map(r.pos), f = Yt(u.doc, d, a.length, a);
		if (f ||= (a[0] = s ? { type: s } : null, Yt(u.doc, d, a.length, a)), !f) return !1;
		if (u.split(d, a.length, a), !c && l && r.node(o).type != s) {
			let e = u.mapping.map(r.before(o)), t = u.doc.resolve(e);
			s && r.node(o - 1).canReplaceWith(t.index(), t.index() + 1, s) && u.setNodeMarkup(u.mapping.map(r.before(o)), s);
		}
		return n && n(u.scrollIntoView()), !0;
	};
}
var cr = sr(), lr = (e, t) => (t && t(e.tr.setSelection(new A(e.doc))), !0);
function ur(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Zt(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function dr(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && ur(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = g.empty;
			for (let e = o.length - 1; e >= 0; e--) s = g.from(o[e].create(null, s));
			s = g.from(i.copy(s));
			let c = e.tr.step(new E(t.pos - 1, r, t.pos, r, new S(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && Zt(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : D.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && Lt(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && Yn(a, "start", !0) && Yn(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = g.empty;
				for (let e = o.length - 1; e >= 0; e--) r = g.from(o[e].copy(r));
				n(e.tr.step(new E(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new S(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function fr(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(O.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var pr = fr(-1), mr = fr(1);
function hr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && zt(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function gr(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (!(!r.isTextblock || r.hasMarkup(e, t))) if (r.type == e) i = !0;
				else {
					let t = n.doc.resolve(a), r = t.index();
					i = t.parent.canReplaceWith(r, r + 1, e);
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function _r(e, t, n, r) {
	for (let i = 0; i < t.length; i++) {
		let { $from: a, $to: o } = t[i], s = a.depth == 0 && e.inlineContent && e.type.allowsMarkType(n);
		if (e.nodesBetween(a.pos, o.pos, (e, t) => {
			if (s || !r && e.isAtom && e.isInline && t >= a.pos && t + e.nodeSize <= o.pos) return !1;
			s = e.inlineContent && e.type.allowsMarkType(n);
		}), s) return !0;
	}
	return !1;
}
function vr(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let { $from: r, $to: i } = e[n];
		r.doc.nodesBetween(r.pos, i.pos, (e, n) => {
			if (e.isAtom && e.content.size && e.isInline && n >= r.pos && n + e.nodeSize <= i.pos) return n + 1 > r.pos && t.push(new wn(r, r.doc.resolve(n + 1))), r = r.doc.resolve(n + 1 + e.content.size), !1;
		}), r.pos < i.pos && t.push(new wn(r, i));
	}
	return t;
}
function j(e, t = null, n) {
	let r = (n && n.removeWhenPresent) !== !1, i = (n && n.enterInlineAtoms) !== !1, a = !(n && n.includeWhitespace);
	return function(n, o) {
		let { empty: s, $cursor: c, ranges: l } = n.selection;
		if (s && !c || !_r(n.doc, l, e, i)) return !1;
		if (o) if (c) e.isInSet(n.storedMarks || c.marks()) ? o(n.tr.removeStoredMark(e)) : o(n.tr.addStoredMark(e.create(t)));
		else {
			let s, c = n.tr;
			i || (l = vr(l)), s = r ? !l.some((t) => n.doc.rangeHasMark(t.$from.pos, t.$to.pos, e)) : !l.every((t) => {
				let n = !1;
				return c.doc.nodesBetween(t.$from.pos, t.$to.pos, (r, i, a) => {
					if (n) return !1;
					n = !e.isInSet(r.marks) && !!a && a.type.allowsMarkType(e) && !(r.isText && /^\s*$/.test(r.textBetween(Math.max(0, t.$from.pos - i), Math.min(r.nodeSize, t.$to.pos - i))));
				}), !n;
			});
			for (let n = 0; n < l.length; n++) {
				let { $from: r, $to: i } = l[n];
				if (!s) c.removeMark(r.pos, i.pos, e);
				else {
					let n = r.pos, o = i.pos, s = r.nodeAfter, l = i.nodeBefore, u = a && s && s.isText ? /^\s*/.exec(s.text)[0].length : 0, d = a && l && l.isText ? /\s*$/.exec(l.text)[0].length : 0;
					n + u < o && (n += u, o -= d), c.addMark(n, o, e.create(t));
				}
			}
			o(c.scrollIntoView());
		}
		return !0;
	};
}
function yr(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var br = yr(Kn, Jn, Xn), xr = yr(Kn, $n, er), Sr = {
	Enter: yr(nr, ar, or, cr),
	"Mod-Enter": ir,
	Backspace: br,
	"Mod-Backspace": br,
	"Shift-Backspace": br,
	Delete: xr,
	"Mod-Delete": xr,
	"Mod-a": lr
}, Cr = {
	"Ctrl-h": Sr.Backspace,
	"Alt-Backspace": Sr["Mod-Backspace"],
	"Ctrl-d": Sr.Delete,
	"Ctrl-Alt-Backspace": Sr["Mod-Delete"],
	"Alt-Delete": Sr["Mod-Delete"],
	"Alt-d": Sr["Mod-Delete"],
	"Ctrl-a": pr,
	"Ctrl-e": mr
};
for (let e in Sr) Cr[e] = Sr[e];
var wr = (typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin") ? Cr : Sr, Tr = 200, M = function() {};
M.prototype.append = function(e) {
	return e.length ? (e = M.from(e), !this.length && e || e.length < Tr && this.leafAppend(e) || this.length < Tr && e.leafPrepend(this) || this.appendInner(e)) : this;
}, M.prototype.prepend = function(e) {
	return e.length ? M.from(e).append(this) : this;
}, M.prototype.appendInner = function(e) {
	return new Dr(this, e);
}, M.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? M.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, M.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, M.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, M.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, M.from = function(e) {
	return e instanceof M ? e : e && e.length ? new Er(e) : M.empty;
};
var Er = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= Tr) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= Tr) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(M);
M.empty = new Er([]);
var Dr = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(M), Or = 500, kr = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) {
				i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
				return;
			}
			if (i) {
				u.push(new jr(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new jr(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
			} else o.maybeStep(t.step);
			if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new jr(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > Nr && (s = Ar(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new wt();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new jr(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		let r = [], i = Math.max(0, this.items.length - n), a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new jr(i, o, l));
			} else r.push(new jr(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new jr(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > Or && (d = d.compress(this.items.length - r.length)), d;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new jr(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(M.from(i.reverse()), a);
	}
};
kr.empty = new kr(M.empty, 0);
function Ar(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var jr = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, Mr = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, Nr = 20;
function Pr(e, t, n, r) {
	let i = n.getMeta(Hr), a;
	if (i) return i.historyState;
	n.getMeta(Ur) && (e = new Mr(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Hr)) return o.getMeta(Hr).redo ? new Mr(e.done.addTransform(n, void 0, r, Vr(t)), e.undone, Ir(n.mapping.maps), e.prevTime, e.prevComposition) : new Mr(e.done, e.undone.addTransform(n, void 0, r, Vr(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !Fr(n, e.prevRanges)), s = o ? Lr(e.prevRanges, n.mapping) : Ir(n.mapping.maps);
		return new Mr(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Vr(t)), kr.empty, s, n.time, i ?? e.prevComposition);
	} else if (a = n.getMeta("rebased")) return new Mr(e.done.rebased(n, a), e.undone.rebased(n, a), Lr(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
	else return new Mr(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), Lr(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function Fr(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function Ir(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function Lr(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function Rr(e, t, n) {
	let r = Vr(t), i = Hr.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new Mr(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Hr, {
		redo: n,
		historyState: c
	});
}
var zr = !1, Br = null;
function Vr(e) {
	let t = e.plugins;
	if (Br != t) {
		zr = !1, Br = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			zr = !0;
			break;
		}
	}
	return zr;
}
var Hr = new Gn("history"), Ur = new Gn("closeHistory");
function Wr(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new Hn({
		key: Hr,
		state: {
			init() {
				return new Mr(kr.empty, kr.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return Pr(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Kr : n == "historyRedo" ? qr : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function Gr(e, t) {
	return (n, r) => {
		let i = Hr.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = Rr(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Kr = Gr(!1, !0), qr = Gr(!0, !0), Jr = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Yr = typeof navigator < "u" && /Win/.test(navigator.platform);
function Xr(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) Jr ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function Zr(e) {
	let t = Object.create(null);
	for (let n in e) t[Xr(n)] = e[n];
	return t;
}
function Qr(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function $r(e) {
	return new Hn({ props: { handleKeyDown: ei(e) } });
}
function ei(e) {
	let t = Zr(e);
	return function(e, n) {
		let r = o(n), i, s = t[Qr(r, n)];
		if (s && s(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[Qr(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(Yr && n.ctrlKey && n.altKey) && (i = a[n.keyCode]) && i != r) {
				let r = t[Qr(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region ../node_modules/.pnpm/prosemirror-schema-basic@1.2.4/node_modules/prosemirror-schema-basic/dist/index.js
var ti = ["p", 0], ni = ["blockquote", 0], ri = ["hr"], ii = ["pre", ["code", 0]], ai = ["br"], oi = {
	doc: { content: "block+" },
	paragraph: {
		content: "inline*",
		group: "block",
		parseDOM: [{ tag: "p" }],
		toDOM() {
			return ti;
		}
	},
	blockquote: {
		content: "block+",
		group: "block",
		defining: !0,
		parseDOM: [{ tag: "blockquote" }],
		toDOM() {
			return ni;
		}
	},
	horizontal_rule: {
		group: "block",
		parseDOM: [{ tag: "hr" }],
		toDOM() {
			return ri;
		}
	},
	heading: {
		attrs: { level: {
			default: 1,
			validate: "number"
		} },
		content: "inline*",
		group: "block",
		defining: !0,
		parseDOM: [
			{
				tag: "h1",
				attrs: { level: 1 }
			},
			{
				tag: "h2",
				attrs: { level: 2 }
			},
			{
				tag: "h3",
				attrs: { level: 3 }
			},
			{
				tag: "h4",
				attrs: { level: 4 }
			},
			{
				tag: "h5",
				attrs: { level: 5 }
			},
			{
				tag: "h6",
				attrs: { level: 6 }
			}
		],
		toDOM(e) {
			return ["h" + e.attrs.level, 0];
		}
	},
	code_block: {
		content: "text*",
		marks: "",
		group: "block",
		code: !0,
		defining: !0,
		parseDOM: [{
			tag: "pre",
			preserveWhitespace: "full"
		}],
		toDOM() {
			return ii;
		}
	},
	text: { group: "inline" },
	image: {
		inline: !0,
		attrs: {
			src: { validate: "string" },
			alt: {
				default: null,
				validate: "string|null"
			},
			title: {
				default: null,
				validate: "string|null"
			}
		},
		group: "inline",
		draggable: !0,
		parseDOM: [{
			tag: "img[src]",
			getAttrs(e) {
				return {
					src: e.getAttribute("src"),
					title: e.getAttribute("title"),
					alt: e.getAttribute("alt")
				};
			}
		}],
		toDOM(e) {
			let { src: t, alt: n, title: r } = e.attrs;
			return ["img", {
				src: t,
				alt: n,
				title: r
			}];
		}
	},
	hard_break: {
		inline: !0,
		group: "inline",
		selectable: !1,
		parseDOM: [{ tag: "br" }],
		toDOM() {
			return ai;
		}
	}
}, si = ["em", 0], ci = ["strong", 0], li = ["code", 0], ui = new He({
	nodes: oi,
	marks: {
		link: {
			attrs: {
				href: { validate: "string" },
				title: {
					default: null,
					validate: "string|null"
				}
			},
			inclusive: !1,
			parseDOM: [{
				tag: "a[href]",
				getAttrs(e) {
					return {
						href: e.getAttribute("href"),
						title: e.getAttribute("title")
					};
				}
			}],
			toDOM(e) {
				let { href: t, title: n } = e.attrs;
				return [
					"a",
					{
						href: t,
						title: n
					},
					0
				];
			}
		},
		em: {
			parseDOM: [
				{ tag: "i" },
				{ tag: "em" },
				{ style: "font-style=italic" },
				{
					style: "font-style=normal",
					clearMark: (e) => e.type.name == "em"
				}
			],
			toDOM() {
				return si;
			}
		},
		strong: {
			parseDOM: [
				{ tag: "strong" },
				{
					tag: "b",
					getAttrs: (e) => e.style.fontWeight != "normal" && null
				},
				{
					style: "font-weight=400",
					clearMark: (e) => e.type.name == "strong"
				},
				{
					style: "font-weight",
					getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
				}
			],
			toDOM() {
				return ci;
			}
		},
		code: {
			code: !0,
			parseDOM: [{ tag: "code" }],
			toDOM() {
				return li;
			}
		}
	}
}), di = ["ol", 0], fi = ["ul", 0], pi = ["li", 0], mi = {
	attrs: { order: {
		default: 1,
		validate: "number"
	} },
	parseDOM: [{
		tag: "ol",
		getAttrs(e) {
			return { order: e.hasAttribute("start") ? +e.getAttribute("start") : 1 };
		}
	}],
	toDOM(e) {
		return e.attrs.order == 1 ? di : [
			"ol",
			{ start: e.attrs.order },
			0
		];
	}
}, hi = {
	parseDOM: [{ tag: "ul" }],
	toDOM() {
		return fi;
	}
}, gi = {
	parseDOM: [{ tag: "li" }],
	toDOM() {
		return pi;
	},
	defining: !0
};
function _i(e, t) {
	let n = {};
	for (let t in e) n[t] = e[t];
	for (let e in t) n[e] = t[e];
	return n;
}
function vi(e, t, n) {
	return e.append({
		ordered_list: _i(mi, {
			content: "list_item+",
			group: n
		}),
		bullet_list: _i(hi, {
			content: "list_item+",
			group: n
		}),
		list_item: _i(gi, { content: t })
	});
}
function yi(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return bi(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function bi(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new he(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new he(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = zt(a, n, r, t);
	return s ? (e && xi(e, t, s, i, n), !0) : !1;
}
function xi(e, t, n, r, i) {
	let a = g.empty;
	for (let e = n.length - 1; e >= 0; e--) a = g.from(n[e].type.create(n[e].attrs, a));
	e.step(new E(t.start - (r ? 2 : 0), t.end, t.start, t.end, new S(a, 0, 0), n.length, !0));
	let o = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (o = e + 1);
	let s = n.length - o, c = t.start + n.length - (r ? 2 : 0), l = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && Yt(e.doc, c, s) && (e.split(c, s), c += 2 * s), c += l.child(n).nodeSize;
	return e;
}
function Si(e, t) {
	return function(n, r) {
		let { $from: i, $to: a, node: o } = n.selection;
		if (o && o.isBlock || i.depth < 2 || !i.sameParent(a)) return !1;
		let s = i.node(-1);
		if (s.type != e) return !1;
		if (i.parent.content.size == 0 && i.node(-1).childCount == i.indexAfter(-1)) {
			if (i.depth == 3 || i.node(-3).type != e || i.index(-2) != i.node(-2).childCount - 1) return !1;
			if (r) {
				let t = g.empty, a = i.index(-1) ? 1 : i.index(-2) ? 2 : 3;
				for (let e = i.depth - a; e >= i.depth - 3; e--) t = g.from(i.node(e).copy(t));
				let o = i.indexAfter(-1) < i.node(-2).childCount ? 1 : i.indexAfter(-2) < i.node(-3).childCount ? 2 : 3;
				t = t.append(g.from(e.createAndFill()));
				let s = i.before(i.depth - (a - 1)), c = n.tr.replace(s, i.after(-o), new S(t, 4 - a, 0)), l = -1;
				c.doc.nodesBetween(s, c.doc.content.size, (e, t) => {
					if (l > -1) return !1;
					e.isTextblock && e.content.size == 0 && (l = t + 1);
				}), l > -1 && c.setSelection(D.near(c.doc.resolve(l))), r(c.scrollIntoView());
			}
			return !0;
		}
		let c = a.pos == i.end() ? s.contentMatchAt(0).defaultType : null, l = n.tr.delete(i.pos, a.pos), u = c ? [t ? {
			type: e,
			attrs: t
		} : null, { type: c }] : void 0;
		return Yt(l.doc, i.pos, 2, u) ? (r && r(l.split(i.pos, 2, u).scrollIntoView()), !0) : !1;
	};
}
//#endregion
//#region ../node_modules/.pnpm/prosemirror-view@1.42.2/node_modules/prosemirror-view/dist/index.js
var N = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, Ci = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, wi = null, Ti = function(e, t, n) {
	let r = wi ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Ei = function() {
	wi = null;
}, Di = function(e, t, n, r) {
	return n && (ki(e, t, n, r, -1) || ki(e, t, n, r, 1));
}, Oi = /^(img|br|input|textarea|hr)$/i;
function ki(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : P(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || Ni(e) || Oi.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = N(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") if (n.pmViewDesc?.ignoreForSelection) t += i;
			else return !1;
			else e = n, t = i < 0 ? P(e) : 0;
		} else return !1;
	}
}
function P(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Ai(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = P(e);
		} else if (e.parentNode && !Ni(e)) t = N(e), e = e.parentNode;
		else return null;
	}
}
function ji(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !Ni(e)) t = N(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Mi(e, t, n) {
	for (let r = t == 0, i = t == P(e); r || i;) {
		if (e == n) return !0;
		let t = N(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == P(e);
	}
}
function Ni(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Pi = function(e) {
	return e.focusNode && Di(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function Fi(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Ii(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Li(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(P(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(P(r.startContainer), r.startOffset)
		};
	}
}
var Ri = typeof navigator < "u" ? navigator : null, zi = typeof document < "u" ? document : null, Bi = Ri && Ri.userAgent || "", Vi = /Edge\/(\d+)/.exec(Bi), Hi = /MSIE \d/.exec(Bi), Ui = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Bi), F = !!(Hi || Ui || Vi), Wi = Hi ? document.documentMode : Ui ? +Ui[1] : Vi ? +Vi[1] : 0, I = !F && /gecko\/(\d+)/i.test(Bi);
I && +(/Firefox\/(\d+)/.exec(Bi) || [0, 0])[1];
var Gi = !F && /Chrome\/(\d+)/.exec(Bi), L = !!Gi, Ki = Gi ? +Gi[1] : 0, R = !F && !!Ri && /Apple Computer/.test(Ri.vendor), qi = R && (/Mobile\/\w+/.test(Bi) || !!Ri && Ri.maxTouchPoints > 2), z = qi || (Ri ? /Mac/.test(Ri.platform) : !1), Ji = Ri ? /Win/.test(Ri.platform) : !1, Yi = /Android \d/.test(Bi), Xi = !!zi && "webkitFontSmoothing" in zi.documentElement.style, Zi = Xi ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Qi(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function $i(e, t) {
	return typeof e == "number" ? e : e[t];
}
function ea(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function ta(e, t, n) {
	if (!ga(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = Ci(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? Qi(a) : ea(e), c = 0, l = 0;
		if (t.top < s.top + $i(r, "top") ? l = -(s.top - t.top + $i(i, "top")) : t.bottom > s.bottom - $i(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + $i(i, "top") - s.top : t.bottom - s.bottom + $i(i, "bottom")), t.left < s.left + $i(r, "left") ? c = -(s.left - t.left + $i(i, "left")) : t.right > s.right - $i(r, "right") && (c = t.right - s.right + $i(i, "right")), c || l) if (n) a.defaultView.scrollBy(c, l);
		else {
			let n = e.scrollLeft, r = e.scrollTop;
			l && (e.scrollTop += l), c && (e.scrollLeft += c);
			let i = e.scrollLeft - n, a = e.scrollTop - r;
			t = {
				left: t.left - i,
				top: t.top - a,
				right: t.right - i,
				bottom: t.bottom - a
			};
		}
		let u = n ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(u)) break;
		o = u == "absolute" ? o.offsetParent : Ci(o);
	}
}
function na(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: ra(e.dom)
	};
}
function ra(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = Ci(r));
	return t;
}
function ia({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	aa(n, r == 0 ? 0 : r - t);
}
function aa(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var oa = null;
function sa(e) {
	if (e.setActive) return e.setActive();
	if (oa) return e.focus(oa);
	let t = ra(e);
	e.focus(oa == null ? { get preventScroll() {
		return oa = { preventScroll: !0 }, !0;
	} } : void 0), oa || (oa = !1, aa(t, 0));
}
function ca(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = Ti(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && n.nodeType == 3 ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, u.nodeType == 1 && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? la(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : ca(n, i);
}
function la(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = _a(r, 1);
		if (n.top != n.bottom && ua(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function ua(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function da(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function fa(e, t, n) {
	let { node: r, offset: i } = ca(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function pa(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function ma(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (ua(t, i)) return ma(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function ha(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Li(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!ua(t, n) || (o = ma(e.dom, t, n), !o)) return null;
	}
	if (R) for (let e = o; r && e; e = Ci(e)) e.draggable && (r = void 0);
	if (o = da(o, t), r) {
		if (I && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		Xi && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = pa(e, r, i, t));
	}
	s ??= fa(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function ga(e) {
	return e.top < e.bottom || e.left < e.right;
}
function _a(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (ga(e)) return e;
	}
	return Array.prototype.find.call(n, ga) || e.getBoundingClientRect();
}
var va = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ya(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = Xi || I;
	if (r.nodeType == 3) if (o && (va.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
		let e = _a(Ti(r, i, i), n);
		if (I && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
			let t = _a(Ti(r, i - 1, i - 1), -1);
			if (t.top == e.top) {
				let n = _a(Ti(r, i, i + 1), -1);
				if (n.top != e.top) return ba(n, n.left < t.left);
			}
		}
		return e;
	} else {
		let e = i, t = i, a = n < 0 ? 1 : -1;
		return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, ba(_a(Ti(r, e, t), a), a < 0);
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == P(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return xa(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < P(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return xa(e.getBoundingClientRect(), !0);
		}
		return xa(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == P(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? Ti(e, P(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return ba(_a(t, 1), !1);
	}
	if (a == null && i < P(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? Ti(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return ba(_a(t, -1), !0);
	}
	return ba(_a(r.nodeType == 3 ? Ti(r) : r, -n), n >= 0);
}
function ba(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function xa(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Sa(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Ca(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Sa(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = ya(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = Ti(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var wa = /[\u0590-\u08ac]/;
function Ta(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !wa.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Sa(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var Ea = null, Da = null, Oa = !1;
function ka(e, t, n) {
	return Ea == t && Da == n ? Oa : (Ea = t, Da = n, Oa = n == "up" || n == "down" ? Ca(e, t, n) : Ta(e, t, n));
}
var B = 0, Aa = 1, ja = 2, V = 3, Ma = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = B, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule(e) {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
		}
	}
	get posBefore() {
		return this.parent.posBeforeChild(this);
	}
	get posAtStart() {
		return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
	}
	get posAfter() {
		return this.posBefore + this.size;
	}
	get posAtEnd() {
		return this.posAtStart + this.size - 2 * this.border;
	}
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)) if (n < 0) {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t - 1];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.previousSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
			return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
		} else {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.nextSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
			return n ? this.posBeforeChild(r) : this.posAtEnd;
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > N(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = e.compareDocumentPosition(this.contentDOM) & 2;
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return r ?? n > 0 ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) if (n && (a = i.nodeDOM) && !(a.nodeType == 1 ? a.contains(e.nodeType == 1 ? e : e.parentNode) : a == e)) n = !1;
			else return i;
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e || i instanceof za) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof Na && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, !(!e || e.dom.parentNode == this.contentDOM); n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? N(e.dom) + 1 : 0
			};
		} else {
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, !(!e || e.dom.parentNode == this.contentDOM); n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? N(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = N(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = N(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (t.nodeType != 1 || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((I || R) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: N(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (I && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && R) && Di(o.node, o.offset, l.anchorNode, l.anchorOffset) && Di(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && I)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? ja : Aa, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = V : i.markDirty(e - r, t - r);
					return;
				} else i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? ja : V;
			}
			n = a;
		}
		this.dirty = ja;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? ja : Aa;
			t.dirty < n && (t.dirty = n);
		}
	}
	get domAtom() {
		return !1;
	}
	get ignoreForCoords() {
		return !1;
	}
	get ignoreForSelection() {
		return !1;
	}
	isText(e) {
		return !1;
	}
}, Na = class extends Ma {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			if (a.nodeType != 1) {
				let e = document.createElement("span");
				e.appendChild(a), a = e;
			}
			a.contentEditable = "false", a.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == B && e.type.eq(this.widget.type);
	}
	parseRule() {
		return { ignore: !0 };
	}
	stopEvent(e) {
		let t = this.widget.spec.stopEvent;
		return t ? t(e) : !1;
	}
	ignoreMutation(e) {
		return e.type != "selection" || this.widget.spec.ignoreSelection;
	}
	destroy() {
		this.widget.type.destroy(this.dom), super.destroy();
	}
	get domAtom() {
		return !0;
	}
	get ignoreForSelection() {
		return !!this.widget.type.spec.relaxedSide;
	}
	get side() {
		return this.widget.type.side;
	}
}, Pa = class extends Ma {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, Fa = class e extends Ma {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = ot.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & V || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != V && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != B) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = B;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = no(a, n, o, r)), t > 0 && (a = no(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, Ia = class e extends Ma {
	constructor(e, t, n, r, i, a, o) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (u.nodeType != 3) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = ot.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = qa(u, r, n), l ? c = new Ba(t, n, r, i, u, d || null, f, l) : n.isText ? new Ra(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
	}
	parseRule(e) {
		if (this.node.type.spec.reparseInView) return null;
		let t = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM) t.getContent = () => this.node.content;
		else if (!this.contentLost) t.contentElement = this.contentDOM;
		else {
			for (let e = this.children.length - 1; e >= 0; e--) {
				let n = this.children[e];
				if (this.dom.contains(n.dom.parentNode)) {
					t.contentElement = n.dom.parentNode;
					break;
				}
			}
			if (!t.contentElement) {
				let n = e && e.find((t) => t.nodeType == 1 && e.indexOf(t.parentNode) < 0 && this.dom.contains(t));
				n ? t.contentElement = n : t.getContent = () => g.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == B && e.eq(this.node) && Ja(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new Xa(this, a && a.node, e);
		$a(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? b.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == ja) && (a && this.protectLocalComposition(e, a), Va(this.contentDOM, this.children, e), qi && eo(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof O) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = to(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		} else return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc &&= void 0;
		}
		let a = new Pa(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = no(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == V || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = B;
	}
	updateOuterDeco(e) {
		if (Ja(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = Ga(this.dom, this.nodeDOM, Wa(this.outerDeco, this.node, t), Wa(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function La(e, t, n, r, i) {
	qa(r, t, e);
	let a = new Ia(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var Ra = class e extends Ia {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == V || this.dirty != B && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != B || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = B, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = V);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, za = class extends Ma {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == B && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, Ba = class extends Ia {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == V) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		} else if (!this.contentDOM && !e.isLeaf) return !1;
		else return super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
	stopEvent(e) {
		return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
};
function Va(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = Ya(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof Fa) {
			let t = r ? r.previousSibling : e.lastChild;
			Va(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = Ya(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var Ha = function(e) {
	e && (this.nodeName = e);
};
Ha.prototype = Object.create(null);
var Ua = [new Ha()];
function Wa(e, t, n) {
	if (e.length == 0) return Ua;
	let r = n ? Ua[0] : new Ha(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new Ha(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new Ha(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function Ga(e, t, n, r) {
	if (n == Ua && r == Ua) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = Ua[0], i = t);
		}
		Ka(i, o || Ua[0], a);
	}
	return i;
}
function Ka(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function qa(e, t, n) {
	return Ga(e, e, Ua, Wa(t, n, e.nodeType != 1));
}
function Ja(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function Ya(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var Xa = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Za(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = B, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i < 0 && this.index < this.top.children.length) {
				let t = this.top.children[this.index];
				t instanceof Fa && t.dirty != V && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = Fa.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == V && a.dom == a.contentDOM && (a.dirty = ja), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof Ia) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != V && Ja(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = ja, u.updateChildren(r, a + 1), u.dirty = B), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Ja(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = Ia.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = Ia.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new Na(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof Fa;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof Ra) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((R || L) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new za(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function Za(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof Fa) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function Qa(e, t) {
	return e.type.side - t.type.side;
}
function $a(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d ||= [u]).push(e) : u = e);
		}
		if (u) if (d) {
			d.sort(Qa);
			for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
		} else n(u, l, !!c);
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function eo(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function to(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function no(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function ro(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Pi(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && k.isSelectable(e) && i.parent && !(e.isInline && Mi(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new k(o == e ? s : r.resolve(e));
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = ho(e, u, s, n);
	}
	return l;
}
function io(e) {
	return e.editable ? e.hasFocus() : _o(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function ao(e, t = !1) {
	let n = e.state.selection;
	if (po(e, n), !io(e)) return;
	let r = e.input.mouseDown;
	if (!t && L && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Di(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) fo(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		oo && !(n instanceof O) && (n.$from.parent.inlineContent || (a = so(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = so(e, n.to))), e.docView.setSelection(r, i, e, t), oo && (a && lo(a), o && lo(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && uo(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var oo = R || L && Ki < 63;
function so(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (R && i && i.contentEditable == "false") return co(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return co(i);
		if (a) return co(a);
	}
}
function co(e) {
	return e.contentEditable = "true", R && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function lo(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function uo(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!io(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function fo(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, N(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && F && Wi <= 11 && (n.disabled = !0, n.disabled = !1);
}
function po(e, t) {
	if (t instanceof k) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (mo(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else mo(e);
}
function mo(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function ho(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || O.between(t, n, r);
}
function go(e) {
	return e.editable && !e.hasFocus() ? !1 : _o(e);
}
function _o(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch {
		return !1;
	}
}
function vo(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Di(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function yo(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && D.findFrom(a, t);
}
function bo(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function xo(e, t, n) {
	let r = e.state.selection;
	if (r instanceof O) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return bo(e, new O(r.$anchor, a));
		} else if (!r.empty) return !1;
		else if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = yo(e.state, t);
			return n && n instanceof k ? bo(e, n) : !1;
		} else if (!(z && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? k.isSelectable(i) ? bo(e, new k(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : Xi ? bo(e, new O(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof k && r.node.isInline) return bo(e, new O(t > 0 ? r.$to : r.$from));
	else {
		let n = yo(e.state, t);
		return n ? bo(e, n) : !1;
	}
}
function So(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Co(e, t) {
	let n = e.pmViewDesc;
	return n && n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR");
}
function wo(e, t) {
	return t < 0 ? To(e) : Eo(e);
}
function To(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (I && n.nodeType == 1 && r < So(n) && Co(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (Co(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (Do(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Co(t, -1);) i = n.parentNode, a = N(t), t = t.previousSibling;
		if (t) n = t, r = So(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Ao(e, n, r) : i && Ao(e, i, a);
}
function Eo(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = So(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (Co(e, 1)) a = n, o = ++r;
		else break;
	} else if (Do(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Co(t, 1);) a = t.parentNode, o = N(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = So(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Ao(e, a, o);
}
function Do(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function Oo(e, t) {
	for (; e && t == e.childNodes.length && !Ni(e);) t = N(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function ko(e, t) {
	for (; e && !t && !Ni(e);) t = N(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Ao(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = Oo(t, n)) ? (t = r, n = 0) : (e = ko(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Pi(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && ao(e);
	}, 50);
}
function jo(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(L || Ji) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Mo(e, t, n) {
	let r = e.state.selection;
	if (r instanceof O && !r.empty || n.indexOf("s") > -1 || z && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = yo(e.state, t);
		if (n && n instanceof k) return bo(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof A ? D.near(n, t) : D.findFrom(n, t);
		return o ? bo(e, o) : !1;
	}
	return !1;
}
function No(e, t) {
	if (!(e.state.selection instanceof O)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function Po(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function Fo(e) {
	if (!R || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		Po(e, n, "true"), setTimeout(() => Po(e, n, "false"), 20);
	}
	return !1;
}
function Io(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function Lo(e, t) {
	let n = t.keyCode, r = Io(t);
	if (n == 8 || z && n == 72 && r == "c") return No(e, -1) || wo(e, -1);
	if (n == 46 && !t.shiftKey || z && n == 68 && r == "c") return No(e, 1) || wo(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || z && n == 66 && r == "c") {
		let t = n == 37 ? jo(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return xo(e, t, r) || wo(e, t);
	} else if (n == 39 || z && n == 70 && r == "c") {
		let t = n == 39 ? jo(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return xo(e, t, r) || wo(e, t);
	} else if (n == 38 || z && n == 80 && r == "c") return Mo(e, -1, r) || wo(e, -1);
	else if (n == 40 || z && n == 78 && r == "c") return Fo(e) || Mo(e, 1, r) || wo(e, 1);
	else if (r == (z ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90)) return !0;
	return !1;
}
function Ro(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || ot.fromSchema(e.state.schema), s = Jo(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = qo[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && l.nodeType == 1 && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function zo(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new S(g.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = ot.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = Zo(n), Xi && Qo(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Ke.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !Bo.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = $o(Ko(s, +u[1], +u[2]), u[4]);
	else if (s = S.maxOpen(Vo(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = Ko(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var Bo = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Vo(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && Uo(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = Wo(a[a.length - 1], i.length));
				let n = Ho(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return g.from(a);
	}
	return e;
}
function Ho(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, g.from(e));
	return e;
}
function Uo(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = Uo(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(g.from(Ho(n, e, i + 1))));
	}
}
function Wo(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, Wo(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(g.empty, !0);
	return e.copy(n.append(r));
}
function Go(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = Go(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(g.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function Ko(e, t, n) {
	return t < e.openStart && (e = new S(Go(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new S(Go(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var qo = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
};
function Jo() {
	return document.implementation.createHTMLDocument("title");
}
var Yo = null;
function Xo(e) {
	let t = window.trustedTypes;
	return t ? (Yo ||= t.defaultPolicy || t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e }), Yo.createHTML(e)) : e;
}
function Zo(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = Jo(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && qo[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = Xo(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
	for (let e = 0; e < n.styleSheets.length; e++) {
		let t = n.styleSheets[e];
		for (let e = 0; e < t.rules.length; e++) {
			let n = t.rules[e];
			if (n instanceof CSSStyleRule) {
				let e = r.querySelectorAll(n.selectorText);
				for (let t = 0; t < e.length; t++) e[t].style.cssText += n.style.cssText;
			}
		}
	}
	return r;
}
function Qo(e) {
	let t = e.querySelectorAll(L ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function $o(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		i = g.from(t.create(r[e + 1], i)), a++, o++;
	}
	return new S(i, a, o);
}
var H = {}, U = {}, es = {
	touchstart: !0,
	touchmove: !0
}, ts = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function ns(e) {
	for (let t in H) {
		let n = H[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			cs(e, t) && !ss(e, t) && (e.editable || !(t.type in U)) && n(e, t);
		}, es[t] ? { passive: !0 } : void 0);
	}
	R && e.dom.addEventListener("input", () => null), as(e);
}
function rs(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function is(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function as(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => ss(e, t));
	});
}
function ss(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function cs(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function ls(e, t) {
	!ss(e, t) && H[t.type] && (e.editable || !(t.type in U)) && H[t.type](e, t);
}
U.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Es(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(Yi && L && n.keyCode == 13))) if (n.keyCode != 229 && e.domObserver.forceFlush(), qi && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
		let t = Date.now();
		e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
			e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, Fi(13, "Enter"))), e.input.lastIOSEnter = 0);
		}, 200);
	} else e.someProp("handleKeyDown", (t) => t(e, n)) || Lo(e, n) ? n.preventDefault() : rs(e, "key");
}, U.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, U.keypress = (e, t) => {
	let n = t;
	if (Es(e) || !n.charCode || n.ctrlKey && !n.altKey || z && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof O) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function us(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function ds(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function fs(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function ps(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function ms(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && k.isSelectable(r) ? (ps(e, new k(n), "pointer"), !0) : !1;
}
function hs(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof k && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (k.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i == null ? !1 : (ps(e, k.create(e.state.doc, i), "pointer"), !0);
}
function gs(e, t, n, r, i) {
	return fs(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? hs(e, n) : ms(e, n));
}
function _s(e, t, n, r) {
	return fs(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function vs(e, t, n, r) {
	return fs(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || ys(e, n, r);
}
function ys(e, t, n) {
	if (n.button != 0) return !1;
	let r = bs(e, t, !0), i = e.state.doc;
	return r ? (ps(e, r, "pointer"), r instanceof O && i.eq(e.state.doc) && (e.input.mouseDown = new Ts(e, r)), !0) : !1;
}
function bs(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? O.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return O.create(r, a + 1, a + 1 + t.content.size);
		if (n && k.isSelectable(t)) return k.create(r, a);
	}
	return null;
}
function xs(e) {
	return Ms(e);
}
var Ss = z ? "metaKey" : "ctrlKey";
H.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = xs(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && ds(n, e.input.lastClick) && !n[Ss] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(us(n));
	o && (a == "singleClick" ? e.input.mouseDown = new ws(e, o, n, !!r) : (a == "doubleClick" ? _s : vs)(e, o.pos, o.inside, n) ? n.preventDefault() : rs(e, "pointer"));
};
var Cs = class {
	constructor(e) {
		this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
	}
	up(e) {
		this.done();
	}
	move(e) {
		e.buttons == 0 && this.done();
	}
	done() {
		this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
	}
	delaySelUpdate() {
		return !1;
	}
}, ws = class extends Cs {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Ss], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof k && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !!(this.target && !this.target.draggable),
			setUneditable: !!(this.target && I && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), rs(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || ao(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(us(e))), this.updateAllowDefault(e), this.allowDefault || !t ? rs(this.view, "pointer") : gs(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || R && this.mightDrag && !this.mightDrag.node.isAtom || L && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (ps(this.view, D.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : rs(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), rs(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, Ts = class extends Cs {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), rs(this.view, "pointer");
		let t = this.view.posAtCoords(us(e)), n = t && bs(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		ps(this.view, O.create(r, a, o), "pointer");
	}
};
H.touchstart = (e) => {
	e.input.lastTouch = Date.now(), xs(e), rs(e, "pointer");
}, H.touchmove = (e) => {
	e.input.lastTouch = Date.now(), rs(e, "pointer");
}, H.contextmenu = (e) => xs(e);
function Es(e, t) {
	return e.composing ? !0 : R && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var Ds = Yi ? 5e3 : -1;
U.compositionstart = U.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof O && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || L && Ji && Os(e))) e.markCursor = e.state.storedMarks || n.marks(), Ms(e, !0), e.markCursor = null;
		else if (Ms(e, !t.selection.empty), I && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && n.nodeType == 1 && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (t.nodeType == 3) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				} else n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	ks(e, Ds);
};
function Os(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
U.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, ks(e, 20));
};
function ks(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => Ms(e), t));
}
function As(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function js(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = Ai(t.focusNode, t.focusOffset), r = ji(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (!(!e || !e.isText(n.nodeValue))) return r;
		}
	}
	return n || r;
}
function Ms(e, t = !1) {
	if (!(Yi && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), As(e), t || e.docView && e.docView.dirty) {
			let n = ro(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function Ns(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var Ps = F && Wi < 15 || qi && Zi < 604;
H.copy = U.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = Ps ? null : n.clipboardData, { dom: o, text: s } = Ro(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : Ns(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Fs(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function Is(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Ls(e, r.value, null, i, t) : Ls(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function Ls(e, t, n, r, i) {
	let a = zo(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || S.empty))) return !0;
	if (!a) return !1;
	let o = Fs(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Rs(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
U.paste = (e, t) => {
	let n = t;
	if (e.composing && !Yi) return;
	let r = Ps ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && Ls(e, Rs(r), r.getData("text/html"), i, n) ? n.preventDefault() : Is(e, n);
};
var zs = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, Bs = z ? "altKey" : "ctrlKey";
function Vs(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[Bs] : !n;
}
H.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(us(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof k ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = k.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = k.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = Ro(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !L || Ki > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(Ps ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Ps || n.dataTransfer.setData("text/plain", c), e.dragging = new zs(l, Vs(e, n), o);
}, H.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, U.dragover = U.dragenter = (e, t) => t.preventDefault(), U.drop = (e, t) => {
	try {
		Hs(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function Hs(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(us(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = zo(e, Rs(t.dataTransfer), Ps ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && Vs(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || S.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? nn(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && k.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new k(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(ho(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
H.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && ao(e);
	}, 20));
}, H.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, H.beforeinput = (e, t) => {
	if (Yi && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, Fi(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in U) H[e] = U[e];
function Us(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var Ws = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || Js, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new W(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && Us(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, Gs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Js;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new W(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Us(this.attrs, t.attrs) && Us(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, Ks = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Js;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new W(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Us(this.attrs, t.attrs) && Us(this.spec, t.spec);
	}
	destroy() {}
}, W = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new Ws(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new Gs(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new Ks(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof Gs;
	}
	get widget() {
		return this.type instanceof Ws;
	}
}, qs = [], Js = {}, G = class e {
	constructor(e, t) {
		this.local = e.length ? e : qs, this.children = t.length ? t : qs;
	}
	static create(e, t) {
		return t.length ? tc(t, e, 0, Js) : K;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e ?? 0, t ?? 1e9, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == K || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || Js);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? Xs(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(nc), qs) : K;
	}
	add(t, n) {
		return n.length ? this == K ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = $s(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, tc(s, e, o + 1, Js)), a += 3;
			}
		});
		let o = Zs(a ? ec(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(nc) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == K ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == K ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : K;
	}
	forChild(t, n) {
		if (this == K) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof Gs) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(nc), qs);
			return r ? new Ys([t, r]) : t;
		}
		return r || K;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return rc(this.localsInner(e));
	}
	localsInner(e) {
		if (this == K) return qs;
		if (e.inlineContent || !this.local.some(Gs.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof Gs || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
G.empty = new G([], []), G.removeOverlap = rc;
var K = G.empty, Ys = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, Js));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return G.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != K && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) if (!t) t = i;
			else {
				n &&= (t = t.slice(), !1);
				for (let e = 0; e < i.length; e++) t.push(i[e]);
			}
		}
		return t ? rc(n ? t : t.sort(nc)) : qs;
	}
	static from(t) {
		switch (t.length) {
			case 0: return K;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof G) ? t : t.reduce((e, t) => e.concat(t instanceof G ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function Xs(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == K ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = tc(Qs(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new G(t.sort(nc), s);
}
function Zs(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new W(i.from + t, i.to + t, i.type));
	}
	return n;
}
function Qs(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function $s(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function ec(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function tc(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = $s(e, t, o + n);
		if (s) {
			a = !0;
			let e = tc(s, t, n + o + 1, r);
			e != K && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = Zs(a ? ec(e) : e, -n).sort(nc);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new G(o, i) : K;
}
function nc(e, t) {
	return e.from - t.from || e.to - t.to;
}
function rc(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), ic(t, i + 1, a.copy(r.to, a.to)));
				continue;
			} else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), ic(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function ic(e, t, n) {
	for (; t < e.length && nc(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function ac(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != K && t.push(r);
	}), e.cursorWrapper && t.push(G.create(e.state.doc, [e.cursorWrapper.deco])), Ys.from(t);
}
var oc = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, sc = F && Wi <= 11, cc = class {
	constructor() {
		this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
	}
	set(e) {
		this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
	}
	clear() {
		this.anchorNode = this.focusNode = null;
	}
	eq(e) {
		return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
	}
}, lc = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new cc(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			F && Wi <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : R && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), sc && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
		}), this.onSelectionChange = this.onSelectionChange.bind(this);
	}
	flushSoon() {
		this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
			this.flushingSoon = -1, this.flush();
		}, 20));
	}
	forceFlush() {
		this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
	}
	start() {
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, oc)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
				window.setTimeout(() => this.flush(), 20);
			}
			this.observer.disconnect();
		}
		this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
	}
	connectSelection() {
		this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
	}
	disconnectSelection() {
		this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
	}
	suppressSelectionUpdates() {
		this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
	}
	onSelectionChange() {
		if (go(this.view)) {
			if (this.suppressingSelectionUpdates) return ao(this.view);
			if (F && Wi <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Di(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = Ci(n)) t.add(n);
		for (let r = e.anchorNode; r; r = Ci(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: n.nodeType == 3 ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && go(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || L && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && t.nodeType == 1;) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (I && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || hc(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Pi(n) && (c = ro(e)) && c.eq(D.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, ao(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), fc(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, gc(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || ao(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), r.nodeType == 3 && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (F && Wi <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? N(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? N(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		} else if (e.type == "attributes") return {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		};
		else return this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		};
	}
}, uc = /* @__PURE__ */ new WeakMap(), dc = !1;
function fc(e) {
	if (!uc.has(e) && (uc.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = I, dc) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), dc = !0;
	}
}
function pc(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Di(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function mc(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return pc(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? pc(e, n) : null;
}
function hc(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function gc(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || e.nodeType != 1 || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function _c(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && e.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Pi(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), L && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || Ke.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: vc(r),
		context: m
	});
	if (u && u[0].pos != null) {
		let e = u[0].pos, t = u[1] && u[1].pos;
		t ??= e, h = {
			anchor: e + s,
			head: t + s
		};
	}
	return {
		doc: g,
		sel: h,
		from: s,
		to: c
	};
}
var vc = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (R && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		} else if (t.parentNode.lastChild == t || R && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, yc = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function bc(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = ro(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (L && Yi && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, Fi(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = _c(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Tc(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (qi && e.input.lastIOSEnter > Date.now() - 225 || Yi) && i.some((e) => e.nodeType == 1 && !yc.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, Fi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) if (r && c instanceof O && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
		start: c.from,
		endA: c.to,
		endB: c.to
	};
	else {
		if (l.sel) {
			let t = xc(e, e.state.doc, l.sel);
			if (t && !t.eq(e.state.selection)) {
				let n = e.state.tr.setSelection(t);
				a && n.setMeta("composition", a), e.dispatch(n);
			}
		}
		return;
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof O && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), F && Wi <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((qi && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, Fi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && Cc(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, Fi(8, "Backspace")))) {
		Yi && L && e.domObserver.suppressSelectionUpdates();
		return;
	}
	L && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), Yi && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, Fi(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = xc(e, n.doc, l.sel);
			t && !(L && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || F && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) if (h.pos == g.pos) {
		F && Wi <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => ao(e), 20));
		let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
		n && t.ensureMarks(n), e.dispatch(t);
	} else if (m.endA == m.endB && (S = Sc(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
		let t = x(e.state.tr);
		S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
	} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
		let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
		e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
	} else e.dispatch(x());
	else e.dispatch(x());
}
function xc(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : ho(e, t.resolve(n.anchor), t.resolve(n.head));
}
function Sc(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (g.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function Cc(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || wc(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(wc(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || wc(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function wc(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Tc(e, t, n, r, i) {
	let a = e.findDiffStart(t, n), o = n + e.size, s = n + t.size;
	if (a == null) return null;
	let { a: c, b: l } = e.findDiffEnd(t, o, s);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(c, l));
		r -= c + e - a;
	}
	if (c < a && o < s) {
		let e = r <= a && r >= c ? a - r : 0;
		a -= e, l = a + (l - c), c = a;
	} else if (l < a) {
		let e = r <= a && r >= l ? a - r : 0;
		a -= e, c = a + (c - l), l = a;
	}
	return {
		start: a,
		endA: c,
		endB: l
	};
}
var Ec = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new ts(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Nc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = kc(this), Oc(this), this.nodeViews = jc(this), this.docView = La(this.state.doc, Dc(this), ac(this), this.dom, this), this.domObserver = new lc(this, (e, t, n, r) => bc(this, e, t, n, r)), this.domObserver.start(), ns(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && as(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(Nc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		let n = this.state, r = !1, i = !1;
		e.storedMarks && this.composing && (As(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = jc(this);
			Mc(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && as(this), this.editable = kc(this), Oc(this);
		let o = ac(this), s = Dc(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && na(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (F || L) && !this.composing && !n.selection.empty && !e.selection.empty && Ac(n.selection, e.selection);
			if (l) {
				let n = L ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = js(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = La(e.doc, s, o, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && vo(this) && i.delaySelUpdate()) ? ao(this, t) : (po(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && ia(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode)) && !this.someProp("handleScrollToSelection", (e) => e(this))) if (this.state.selection instanceof k) {
			let t = this.docView.domAfterPos(this.state.selection.from);
			t.nodeType == 1 && ta(this, t.getBoundingClientRect(), e);
		} else ta(this, this.coordsAtPos(this.state.selection.head, 1), e);
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new zs(e.slice, e.move, r < 0 ? void 0 : k.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (F) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && sa(this.dom), ao(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return ha(this, e);
	}
	coordsAtPos(e, t = 1) {
		return ya(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return ka(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return Ls(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return Ls(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return Ro(this, e);
	}
	destroy() {
		this.docView && (is(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ac(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Ei());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return ls(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? R && this.root.nodeType === 11 && Ii(this.dom.ownerDocument) == this.dom && mc(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
Ec.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Dc(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [W.node(0, e.state.doc.content.size, t)];
}
function Oc(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: W.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function kc(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function Ac(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function jc(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function Mc(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function Nc(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
//#endregion
//#region ../node_modules/.pnpm/prosemirror-search@1.1.1/node_modules/prosemirror-search/dist/index.js
var Pc = class {
	constructor(e) {
		this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && !(this.regexp && !Vc(this.search)), this.wholeWord = !!e.wholeWord, this.filter = e.filter || null, this.impl = this.valid ? this.regexp ? new Rc(this) : new Ic(this) : Fc;
	}
	eq(e) {
		return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
	}
	findNext(e, t = 0, n = e.doc.content.size) {
		for (;;) {
			if (t >= n) return null;
			let r = this.impl.findNext(e, t, n);
			if (!r || this.checkResult(e, r)) return r;
			t = Math.max(t, r.from) + 1;
		}
	}
	findPrev(e, t = e.doc.content.size, n = 0) {
		for (;;) {
			if (t <= n) return null;
			let r = this.impl.findPrev(e, t, n);
			if (!r || this.checkResult(e, r)) return r;
			t = Math.min(t, r.to) - 1;
		}
	}
	checkResult(e, t) {
		return (!this.wholeWord || Gc(e, t.from) && Gc(e, t.to)) && (!this.filter || this.filter(e, t));
	}
	unquote(e) {
		return this.literal ? e : e.replace(/\\([nrt\\])/g, (e, t) => t == "n" ? "\n" : t == "r" ? "\r" : t == "t" ? "	" : "\\");
	}
	getReplacements(e, t) {
		let n = e.doc.resolve(t.from).marksAcross(e.doc.resolve(t.to)), r = [], i = g.empty, a = t.from, { match: o } = t, s = o ? zc(o) : [[0, t.to - t.from]], c = Bc(this.unquote(this.replace)), l;
		for (let o of c) if (typeof o == "string") i = i.addToEnd(e.schema.text(o, n));
		else if (l = s[o.group]) {
			let n = t.matchStart + l[0], s = t.matchStart + l[1];
			o.copy ? i = i.append(e.doc.slice(n, s).content) : ((i != g.empty || n > a) && (r.push({
				from: a,
				to: n,
				insert: new S(i, 0, 0)
			}), i = g.empty), a = s);
		}
		return (i != g.empty || a < t.to) && r.push({
			from: a,
			to: t.to,
			insert: new S(i, 0, 0)
		}), r;
	}
}, Fc = new class {
	findNext() {
		return null;
	}
	findPrev() {
		return null;
	}
}(), Ic = class {
	constructor(e) {
		this.query = e;
		let t = e.unquote(e.search);
		e.caseSensitive || (t = t.toLowerCase()), this.string = t;
	}
	findNext(e, t, n) {
		return Wc(e.doc, t, n, (e, r) => {
			let i = Math.max(t, r), a = Uc(e).slice(i - r, Math.min(e.content.size, n - r)), o = (this.query.caseSensitive ? a : a.toLowerCase()).indexOf(this.string);
			return o < 0 ? null : {
				from: i + o,
				to: i + o + this.string.length,
				match: null,
				matchStart: r
			};
		});
	}
	findPrev(e, t, n) {
		return Wc(e.doc, t, n, (e, r) => {
			let i = Math.max(r, n), a = Uc(e).slice(i - r, Math.min(e.content.size, t - r));
			this.query.caseSensitive || (a = a.toLowerCase());
			let o = a.lastIndexOf(this.string);
			return o < 0 ? null : {
				from: i + o,
				to: i + o + this.string.length,
				match: null,
				matchStart: r
			};
		});
	}
}, Lc = "g" + (/x/.unicode == null ? "" : "u") + (/x/.hasIndices == null ? "" : "d"), Rc = class {
	constructor(e) {
		this.query = e, this.regexp = new RegExp(e.search, Lc + (e.caseSensitive ? "" : "i"));
	}
	findNext(e, t, n) {
		return Wc(e.doc, t, n, (e, r) => {
			let i = Uc(e).slice(0, Math.min(e.content.size, n - r));
			this.regexp.lastIndex = t - r;
			let a = this.regexp.exec(i);
			return a ? {
				from: r + a.index,
				to: r + a.index + a[0].length,
				match: a,
				matchStart: r
			} : null;
		});
	}
	findPrev(e, t, n) {
		return Wc(e.doc, t, n, (e, n) => {
			let r = Uc(e).slice(0, Math.min(e.content.size, t - n)), i;
			for (let e = 0;;) {
				this.regexp.lastIndex = e;
				let t = this.regexp.exec(r);
				if (!t) break;
				i = t, e = t.index + 1;
			}
			return i ? {
				from: n + i.index,
				to: n + i.index + i[0].length,
				match: i,
				matchStart: n
			} : null;
		});
	}
};
function zc(e) {
	if (e.indices) return e.indices;
	let t = [[0, e[0].length]];
	for (let n = 1, r = 0; n < e.length; n++) {
		let i = e[n] ? e[0].indexOf(e[n], r) : -1;
		t.push(i < 0 ? void 0 : [i, r = i + e[n].length]);
	}
	return t;
}
function Bc(e) {
	let t = [], n = -1;
	function r(e) {
		let n = t.length - 1;
		n > -1 && typeof t[n] == "string" ? t[n] += e : t.push(e);
	}
	for (; e.length;) {
		let i = /\$([$&\d+])/.exec(e);
		if (!i) return r(e), t;
		if (i.index > 0 && r(e.slice(0, i.index + +(i[1] == "$"))), i[1] != "$") {
			let e = i[1] == "&" ? 0 : +i[1];
			n >= e ? t.push({
				group: e,
				copy: !0
			}) : (n = e || 1e3, t.push({
				group: e,
				copy: !1
			}));
		}
		e = e.slice(i.index + i[0].length);
	}
	return t;
}
function Vc(e) {
	try {
		return new RegExp(e, Lc), !0;
	} catch {
		return !1;
	}
}
var Hc = /* @__PURE__ */ new WeakMap();
function Uc(e) {
	let t = Hc.get(e);
	if (t) return t;
	let n = "";
	for (let t = 0; t < e.childCount; t++) {
		let r = e.child(t);
		r.isText ? n += r.text : r.isLeaf ? n += "￼" : n += " " + Uc(r) + " ";
	}
	return Hc.set(e, n), n;
}
function Wc(e, t, n, r, i = 0) {
	if (e.inlineContent) return r(e, i);
	if (!e.isLeaf) if (t > n) for (let a = e.childCount - 1, o = i + e.content.size; a >= 0 && o > n; a--) {
		let i = e.child(a);
		if (o -= i.nodeSize, o < t) {
			let e = Wc(i, t, n, r, o + 1);
			if (e != null) return e;
		}
	}
	else for (let a = 0, o = i; a < e.childCount && o < n; a++) {
		let i = e.child(a), s = o;
		if (o += i.nodeSize, o > t) {
			let e = Wc(i, t, n, r, s + 1);
			if (e != null) return e;
		}
	}
	return null;
}
function Gc(e, t) {
	let n = e.doc.resolve(t), r = n.nodeBefore, i = n.nodeAfter;
	return !r || !i || !r.isText || !i.isText || !/\p{L}$/u.test(r.text) || !/^\p{L}/u.test(i.text);
}
var Kc = class {
	constructor(e, t, n) {
		this.query = e, this.range = t, this.deco = n;
	}
};
function qc(e, t, n) {
	if (!t.valid) return G.empty;
	let r = [], i = e.selection;
	for (let a = n ? n.from : 0, o = n ? n.to : e.doc.content.size;;) {
		let n = t.findNext(e, a, o);
		if (!n) break;
		let s = n.from == i.from && n.to == i.to ? "ProseMirror-active-search-match" : "ProseMirror-search-match";
		r.push(W.inline(n.from, n.to, { class: s })), a = Math.max(n.to, a + 1);
	}
	return G.create(e.doc, r);
}
var Jc = new Gn("search");
function Yc(e = {}) {
	return new Hn({
		key: Jc,
		state: {
			init(t, n) {
				let r = e.initialQuery || new Pc({ search: "" }), i = e.initialRange || null;
				return new Kc(r, i, qc(n, r, i));
			},
			apply(e, t, n, r) {
				let i = e.getMeta(Jc);
				if (i) return new Kc(i.query, i.range, qc(r, i.query, i.range));
				if (e.docChanged || e.selectionSet) {
					let n = t.range;
					if (n) {
						let t = e.mapping.map(n.from, 1), r = e.mapping.map(n.to, -1);
						n = t < r ? {
							from: t,
							to: r
						} : null;
					}
					t = new Kc(t.query, n, qc(r, t.query, n));
				}
				return t;
			}
		},
		props: { decorations: (e) => Jc.getState(e).deco }
	});
}
function Xc(e, t, n = null) {
	return e.setMeta(Jc, {
		query: t,
		range: n
	});
}
//#endregion
//#region ../node_modules/.pnpm/prosemirror-tables@1.8.5/node_modules/prosemirror-tables/dist/index.js
var Zc, Qc;
if (typeof WeakMap < "u") {
	let e = /* @__PURE__ */ new WeakMap();
	Zc = (t) => e.get(t), Qc = (t, n) => (e.set(t, n), n);
} else {
	let e = [], t = 0;
	Zc = (t) => {
		for (let n = 0; n < e.length; n += 2) if (e[n] == t) return e[n + 1];
	}, Qc = (n, r) => (t == 10 && (t = 0), e[t++] = n, e[t++] = r);
}
var q = class {
	constructor(e, t, n, r) {
		this.width = e, this.height = t, this.map = n, this.problems = r;
	}
	findCell(e) {
		for (let t = 0; t < this.map.length; t++) {
			let n = this.map[t];
			if (n != e) continue;
			let r = t % this.width, i = t / this.width | 0, a = r + 1, o = i + 1;
			for (let e = 1; a < this.width && this.map[t + e] == n; e++) a++;
			for (let e = 1; o < this.height && this.map[t + this.width * e] == n; e++) o++;
			return {
				left: r,
				top: i,
				right: a,
				bottom: o
			};
		}
		throw RangeError(`No cell with offset ${e} found`);
	}
	colCount(e) {
		for (let t = 0; t < this.map.length; t++) if (this.map[t] == e) return t % this.width;
		throw RangeError(`No cell with offset ${e} found`);
	}
	nextCell(e, t, n) {
		let { left: r, right: i, top: a, bottom: o } = this.findCell(e);
		return t == "horiz" ? (n < 0 ? r == 0 : i == this.width) ? null : this.map[a * this.width + (n < 0 ? r - 1 : i)] : (n < 0 ? a == 0 : o == this.height) ? null : this.map[r + this.width * (n < 0 ? a - 1 : o)];
	}
	rectBetween(e, t) {
		let { left: n, right: r, top: i, bottom: a } = this.findCell(e), { left: o, right: s, top: c, bottom: l } = this.findCell(t);
		return {
			left: Math.min(n, o),
			top: Math.min(i, c),
			right: Math.max(r, s),
			bottom: Math.max(a, l)
		};
	}
	cellsInRect(e) {
		let t = [], n = {};
		for (let r = e.top; r < e.bottom; r++) for (let i = e.left; i < e.right; i++) {
			let a = r * this.width + i, o = this.map[a];
			n[o] || (n[o] = !0, !(i == e.left && i && this.map[a - 1] == o || r == e.top && r && this.map[a - this.width] == o) && t.push(o));
		}
		return t;
	}
	positionAt(e, t, n) {
		for (let r = 0, i = 0;; r++) {
			let a = i + n.child(r).nodeSize;
			if (r == e) {
				let n = t + e * this.width, r = (e + 1) * this.width;
				for (; n < r && this.map[n] < i;) n++;
				return n == r ? a - 1 : this.map[n];
			}
			i = a;
		}
	}
	static get(e) {
		return Zc(e) || Qc(e, $c(e));
	}
};
function $c(e) {
	if (e.type.spec.tableRole != "table") throw RangeError("Not a table node: " + e.type.name);
	let t = el(e), n = e.childCount, r = [], i = 0, a = null, o = [];
	for (let e = 0, i = t * n; e < i; e++) r[e] = 0;
	for (let s = 0, c = 0; s < n; s++) {
		let l = e.child(s);
		c++;
		for (let e = 0;; e++) {
			for (; i < r.length && r[i] != 0;) i++;
			if (e == l.childCount) break;
			let u = l.child(e), { colspan: d, rowspan: f, colwidth: p } = u.attrs;
			for (let e = 0; e < f; e++) {
				if (e + s >= n) {
					(a ||= []).push({
						type: "overlong_rowspan",
						pos: c,
						n: f - e
					});
					break;
				}
				let l = i + e * t;
				for (let e = 0; e < d; e++) {
					r[l + e] == 0 ? r[l + e] = c : (a ||= []).push({
						type: "collision",
						row: s,
						pos: c,
						n: d - e
					});
					let n = p && p[e];
					if (n) {
						let r = (l + e) % t * 2, i = o[r];
						i == null || i != n && o[r + 1] == 1 ? (o[r] = n, o[r + 1] = 1) : i == n && o[r + 1]++;
					}
				}
			}
			i += d, c += u.nodeSize;
		}
		let u = (s + 1) * t, d = 0;
		for (; i < u;) r[i++] == 0 && d++;
		d && (a ||= []).push({
			type: "missing",
			row: s,
			n: d
		}), c++;
	}
	(t === 0 || n === 0) && (a ||= []).push({ type: "zero_sized" });
	let s = new q(t, n, r, a), c = !1;
	for (let e = 0; !c && e < o.length; e += 2) o[e] != null && o[e + 1] < n && (c = !0);
	return c && tl(s, o, e), s;
}
function el(e) {
	let t = -1, n = !1;
	for (let r = 0; r < e.childCount; r++) {
		let i = e.child(r), a = 0;
		if (n) for (let t = 0; t < r; t++) {
			let n = e.child(t);
			for (let e = 0; e < n.childCount; e++) {
				let i = n.child(e);
				t + i.attrs.rowspan > r && (a += i.attrs.colspan);
			}
		}
		for (let e = 0; e < i.childCount; e++) {
			let t = i.child(e);
			a += t.attrs.colspan, t.attrs.rowspan > 1 && (n = !0);
		}
		t == -1 ? t = a : t != a && (t = Math.max(t, a));
	}
	return t;
}
function tl(e, t, n) {
	e.problems ||= [];
	let r = {};
	for (let i = 0; i < e.map.length; i++) {
		let a = e.map[i];
		if (r[a]) continue;
		r[a] = !0;
		let o = n.nodeAt(a);
		if (!o) throw RangeError(`No cell with offset ${a} found`);
		let s = null, c = o.attrs;
		for (let n = 0; n < c.colspan; n++) {
			let r = t[(i + n) % e.width * 2];
			r != null && (!c.colwidth || c.colwidth[n] != r) && ((s ||= nl(c))[n] = r);
		}
		s && e.problems.unshift({
			type: "colwidth mismatch",
			pos: a,
			colwidth: s
		});
	}
}
function nl(e) {
	if (e.colwidth) return e.colwidth.slice();
	let t = [];
	for (let n = 0; n < e.colspan; n++) t.push(0);
	return t;
}
function rl(e, t) {
	if (typeof e == "string") return {};
	let n = e.getAttribute("data-colwidth"), r = n && /^\d+(,\d+)*$/.test(n) ? n.split(",").map((e) => Number(e)) : null, i = Number(e.getAttribute("colspan") || 1), a = {
		colspan: i,
		rowspan: Number(e.getAttribute("rowspan") || 1),
		colwidth: r && r.length == i ? r : null
	};
	for (let n in t) {
		let r = t[n].getFromDOM, i = r && r(e);
		i != null && (a[n] = i);
	}
	return a;
}
function il(e, t) {
	let n = {};
	e.attrs.colspan != 1 && (n.colspan = e.attrs.colspan), e.attrs.rowspan != 1 && (n.rowspan = e.attrs.rowspan), e.attrs.colwidth && (n["data-colwidth"] = e.attrs.colwidth.join(","));
	for (let r in t) {
		let i = t[r].setDOMAttr;
		i && i(e.attrs[r], n);
	}
	return n;
}
function al(e) {
	if (e !== null) {
		if (!Array.isArray(e)) throw TypeError("colwidth must be null or an array");
		for (let t of e) if (typeof t != "number") throw TypeError("colwidth must be null or an array of numbers");
	}
}
function ol(e) {
	let t = e.cellAttributes || {}, n = {
		colspan: {
			default: 1,
			validate: "number"
		},
		rowspan: {
			default: 1,
			validate: "number"
		},
		colwidth: {
			default: null,
			validate: al
		}
	};
	for (let e in t) n[e] = {
		default: t[e].default,
		validate: t[e].validate
	};
	return {
		table: {
			content: "table_row+",
			tableRole: "table",
			isolating: !0,
			group: e.tableGroup,
			parseDOM: [{ tag: "table" }],
			toDOM() {
				return ["table", ["tbody", 0]];
			}
		},
		table_row: {
			content: "(table_cell | table_header)*",
			tableRole: "row",
			parseDOM: [{ tag: "tr" }],
			toDOM() {
				return ["tr", 0];
			}
		},
		table_cell: {
			content: e.cellContent,
			attrs: n,
			tableRole: "cell",
			isolating: !0,
			parseDOM: [{
				tag: "td",
				getAttrs: (e) => rl(e, t)
			}],
			toDOM(e) {
				return [
					"td",
					il(e, t),
					0
				];
			}
		},
		table_header: {
			content: e.cellContent,
			attrs: n,
			tableRole: "header_cell",
			isolating: !0,
			parseDOM: [{
				tag: "th",
				getAttrs: (e) => rl(e, t)
			}],
			toDOM(e) {
				return [
					"th",
					il(e, t),
					0
				];
			}
		}
	};
}
function J(e) {
	let t = e.cached.tableNodeTypes;
	if (!t) {
		t = e.cached.tableNodeTypes = {};
		for (let n in e.nodes) {
			let r = e.nodes[n], i = r.spec.tableRole;
			i && (t[i] = r);
		}
	}
	return t;
}
var sl = new Gn("selectingCells");
function cl(e) {
	for (let t = e.depth - 1; t > 0; t--) if (e.node(t).type.spec.tableRole == "row") return e.node(0).resolve(e.before(t + 1));
	return null;
}
function ll(e) {
	let t = e.selection.$head;
	for (let e = t.depth; e > 0; e--) if (t.node(e).type.spec.tableRole == "row") return !0;
	return !1;
}
function ul(e) {
	let t = e.selection;
	if ("$anchorCell" in t && t.$anchorCell) return t.$anchorCell.pos > t.$headCell.pos ? t.$anchorCell : t.$headCell;
	if ("node" in t && t.node && t.node.type.spec.tableRole == "cell") return t.$anchor;
	let n = cl(t.$head) || dl(t.$head);
	if (n) return n;
	throw RangeError(`No cell found around position ${t.head}`);
}
function dl(e) {
	for (let t = e.nodeAfter, n = e.pos; t; t = t.firstChild, n++) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n);
	}
	for (let t = e.nodeBefore, n = e.pos; t; t = t.lastChild, n--) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n - t.nodeSize);
	}
}
function fl(e) {
	return e.parent.type.spec.tableRole == "row" && !!e.nodeAfter;
}
function pl(e) {
	return e.node(0).resolve(e.pos + e.nodeAfter.nodeSize);
}
function ml(e, t) {
	return e.depth == t.depth && e.pos >= t.start(-1) && e.pos <= t.end(-1);
}
function hl(e, t, n) {
	let r = e.node(-1), i = q.get(r), a = e.start(-1), o = i.nextCell(e.pos - a, t, n);
	return o == null ? null : e.node(0).resolve(a + o);
}
function gl(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan - n
	};
	return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(t, n), r.colwidth.some((e) => e > 0) || (r.colwidth = null)), r;
}
function _l(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan + n
	};
	if (r.colwidth) {
		r.colwidth = r.colwidth.slice();
		for (let e = 0; e < n; e++) r.colwidth.splice(t, 0, 0);
	}
	return r;
}
function vl(e, t, n) {
	let r = J(t.type.schema).header_cell;
	for (let i = 0; i < e.height; i++) if (t.nodeAt(e.map[n + i * e.width]).type != r) return !1;
	return !0;
}
var Y = class e extends D {
	constructor(e, t = e) {
		let n = e.node(-1), r = q.get(n), i = e.start(-1), a = r.rectBetween(e.pos - i, t.pos - i), o = e.node(0), s = r.cellsInRect(a).filter((e) => e != t.pos - i);
		s.unshift(t.pos - i);
		let c = s.map((e) => {
			let t = n.nodeAt(e);
			if (!t) throw RangeError(`No cell with offset ${e} found`);
			let r = i + e + 1;
			return new wn(o.resolve(r), o.resolve(r + t.content.size));
		});
		super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.$anchorCell.pos)), i = t.resolve(n.map(this.$headCell.pos));
		if (fl(r) && fl(i) && ml(r, i)) {
			let t = this.$anchorCell.node(-1) != r.node(-1);
			return t && this.isRowSelection() ? e.rowSelection(r, i) : t && this.isColSelection() ? e.colSelection(r, i) : new e(r, i);
		}
		return O.between(r, i);
	}
	content() {
		let e = this.$anchorCell.node(-1), t = q.get(e), n = this.$anchorCell.start(-1), r = t.rectBetween(this.$anchorCell.pos - n, this.$headCell.pos - n), i = {}, a = [];
		for (let n = r.top; n < r.bottom; n++) {
			let o = [];
			for (let a = n * t.width + r.left, s = r.left; s < r.right; s++, a++) {
				let n = t.map[a];
				if (i[n]) continue;
				i[n] = !0;
				let s = t.findCell(n), c = e.nodeAt(n);
				if (!c) throw RangeError(`No cell with offset ${n} found`);
				let l = r.left - s.left, u = s.right - r.right;
				if (l > 0 || u > 0) {
					let e = c.attrs;
					if (l > 0 && (e = gl(e, 0, l)), u > 0 && (e = gl(e, e.colspan - u, u)), s.left < r.left) {
						if (c = c.type.createAndFill(e), !c) throw RangeError(`Could not create cell with attrs ${JSON.stringify(e)}`);
					} else c = c.type.create(e, c.content);
				}
				if (s.top < r.top || s.bottom > r.bottom) {
					let e = {
						...c.attrs,
						rowspan: Math.min(s.bottom, r.bottom) - Math.max(s.top, r.top)
					};
					c = s.top < r.top ? c.type.createAndFill(e) : c.type.create(e, c.content);
				}
				o.push(c);
			}
			a.push(e.child(n).copy(g.from(o)));
		}
		let o = this.isColSelection() && this.isRowSelection() ? e : a;
		return new S(g.from(o), 1, 1);
	}
	replace(e, t = S.empty) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n);
			e.replace(s.map(a.pos), s.map(o.pos), i ? S.empty : t);
		}
		let i = D.findFrom(e.doc.resolve(e.mapping.slice(n).map(this.to)), -1);
		i && e.setSelection(i);
	}
	replaceWith(e, t) {
		this.replace(e, new S(g.from(t), 0, 0));
	}
	forEachCell(e) {
		let t = this.$anchorCell.node(-1), n = q.get(t), r = this.$anchorCell.start(-1), i = n.cellsInRect(n.rectBetween(this.$anchorCell.pos - r, this.$headCell.pos - r));
		for (let n = 0; n < i.length; n++) e(t.nodeAt(i[n]), r + i[n]);
	}
	isColSelection() {
		let e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
		if (Math.min(e, t) > 0) return !1;
		let n = e + this.$anchorCell.nodeAfter.attrs.rowspan, r = t + this.$headCell.nodeAfter.attrs.rowspan;
		return Math.max(n, r) == this.$headCell.node(-1).childCount;
	}
	static colSelection(t, n = t) {
		let r = t.node(-1), i = q.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.top <= s.top ? (o.top > 0 && (t = c.resolve(a + i.map[o.left])), s.bottom < i.height && (n = c.resolve(a + i.map[i.width * (i.height - 1) + s.right - 1]))) : (s.top > 0 && (n = c.resolve(a + i.map[s.left])), o.bottom < i.height && (t = c.resolve(a + i.map[i.width * (i.height - 1) + o.right - 1]))), new e(t, n);
	}
	isRowSelection() {
		let e = this.$anchorCell.node(-1), t = q.get(e), n = this.$anchorCell.start(-1), r = t.colCount(this.$anchorCell.pos - n), i = t.colCount(this.$headCell.pos - n);
		if (Math.min(r, i) > 0) return !1;
		let a = r + this.$anchorCell.nodeAfter.attrs.colspan, o = i + this.$headCell.nodeAfter.attrs.colspan;
		return Math.max(a, o) == t.width;
	}
	eq(t) {
		return t instanceof e && t.$anchorCell.pos == this.$anchorCell.pos && t.$headCell.pos == this.$headCell.pos;
	}
	static rowSelection(t, n = t) {
		let r = t.node(-1), i = q.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.left <= s.left ? (o.left > 0 && (t = c.resolve(a + i.map[o.top * i.width])), s.right < i.width && (n = c.resolve(a + i.map[i.width * (s.top + 1) - 1]))) : (s.left > 0 && (n = c.resolve(a + i.map[s.top * i.width])), o.right < i.width && (t = c.resolve(a + i.map[i.width * (o.top + 1) - 1]))), new e(t, n);
	}
	toJSON() {
		return {
			type: "cell",
			anchor: this.$anchorCell.pos,
			head: this.$headCell.pos
		};
	}
	static fromJSON(t, n) {
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(t, n, r = n) {
		return new e(t.resolve(n), t.resolve(r));
	}
	getBookmark() {
		return new yl(this.$anchorCell.pos, this.$headCell.pos);
	}
};
Y.prototype.visible = !1, D.jsonID("cell", Y);
var yl = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = e.resolve(this.head);
		return t.parent.type.spec.tableRole == "row" && n.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && n.index() < n.parent.childCount && ml(t, n) ? new Y(t, n) : D.near(n, 1);
	}
};
function bl(e) {
	if (!(e.selection instanceof Y)) return null;
	let t = [];
	return e.selection.forEachCell((e, n) => {
		t.push(W.node(n, n + e.nodeSize, { class: "selectedCell" }));
	}), G.create(e.doc, t);
}
function xl({ $from: e, $to: t }) {
	if (e.pos == t.pos || e.pos < t.pos - 6) return !1;
	let n = e.pos, r = t.pos, i = e.depth;
	for (; i >= 0 && !(e.after(i + 1) < e.end(i)); i--, n++);
	for (let e = t.depth; e >= 0 && !(t.before(e + 1) > t.start(e)); e--, r--);
	return n == r && /row|table/.test(e.node(i).type.spec.tableRole);
}
function Sl({ $from: e, $to: t }) {
	let n, r;
	for (let t = e.depth; t > 0; t--) {
		let r = e.node(t);
		if (r.type.spec.tableRole === "cell" || r.type.spec.tableRole === "header_cell") {
			n = r;
			break;
		}
	}
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e);
		if (n.type.spec.tableRole === "cell" || n.type.spec.tableRole === "header_cell") {
			r = n;
			break;
		}
	}
	return n !== r && t.parentOffset === 0;
}
function Cl(e, t, n) {
	let r = (t || e).selection, i = (t || e).doc, a, o;
	if (r instanceof k && (o = r.node.type.spec.tableRole)) {
		if (o == "cell" || o == "header_cell") a = Y.create(i, r.from);
		else if (o == "row") {
			let e = i.resolve(r.from + 1);
			a = Y.rowSelection(e, e);
		} else if (!n) {
			let e = q.get(r.node), t = r.from + 1, n = t + e.map[e.width * e.height - 1];
			a = Y.create(i, t + 1, n);
		}
	} else r instanceof O && xl(r) ? a = O.create(i, r.from) : r instanceof O && Sl(r) && (a = O.create(i, r.$from.start(), r.$from.end()));
	return a && (t ||= e.tr).setSelection(a), t;
}
var wl = new Gn("fix-tables");
function Tl(e, t, n, r) {
	let i = e.childCount, a = t.childCount;
	outer: for (let o = 0, s = 0; o < a; o++) {
		let a = t.child(o);
		for (let t = s, r = Math.min(i, o + 3); t < r; t++) if (e.child(t) == a) {
			s = t + 1, n += a.nodeSize;
			continue outer;
		}
		r(a, n), s < i && e.child(s).sameMarkup(a) ? Tl(e.child(s), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
	}
}
function El(e, t) {
	let n, r = (t, r) => {
		t.type.spec.tableRole == "table" && (n = Dl(e, t, r, n));
	};
	return t ? t.doc != e.doc && Tl(t.doc, e.doc, 0, r) : e.doc.descendants(r), n;
}
function Dl(e, t, n, r) {
	let i = q.get(t);
	if (!i.problems) return r;
	r ||= e.tr;
	let a = [];
	for (let e = 0; e < i.height; e++) a.push(0);
	for (let e = 0; e < i.problems.length; e++) {
		let o = i.problems[e];
		if (o.type == "collision") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			let i = e.attrs;
			for (let e = 0; e < i.rowspan; e++) a[o.row + e] += o.n;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, gl(i, i.colspan - o.n, o.n));
		} else if (o.type == "missing") a[o.row] += o.n;
		else if (o.type == "overlong_rowspan") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				rowspan: e.attrs.rowspan - o.n
			});
		} else if (o.type == "colwidth mismatch") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				colwidth: o.colwidth
			});
		} else if (o.type == "zero_sized") {
			let e = r.mapping.map(n);
			r.delete(e, e + t.nodeSize);
		}
	}
	let o, s;
	for (let e = 0; e < a.length; e++) a[e] && (o ??= e, s = e);
	for (let c = 0, l = n + 1; c < i.height; c++) {
		let n = t.child(c), i = l + n.nodeSize, u = a[c];
		if (u > 0) {
			let t = "cell";
			n.firstChild && (t = n.firstChild.type.spec.tableRole);
			let a = [];
			for (let n = 0; n < u; n++) {
				let n = J(e.schema)[t].createAndFill();
				n && a.push(n);
			}
			let d = (c == 0 || o == c - 1) && s == c ? l + 1 : i - 1;
			r.insert(r.mapping.map(d), a);
		}
		l = i;
	}
	return r.setMeta(wl, { fixTables: !0 });
}
function Ol(e) {
	let t = e.selection, n = ul(e), r = n.node(-1), i = n.start(-1), a = q.get(r);
	return {
		...t instanceof Y ? a.rectBetween(t.$anchorCell.pos - i, t.$headCell.pos - i) : a.findCell(n.pos - i),
		tableStart: i,
		map: a,
		table: r
	};
}
function kl(e, { map: t, tableStart: n, table: r }, i) {
	let a = i > 0 ? -1 : 0;
	vl(t, r, i + a) && (a = i == 0 || i == t.width ? null : 0);
	for (let o = 0; o < t.height; o++) {
		let s = o * t.width + i;
		if (i > 0 && i < t.width && t.map[s - 1] == t.map[s]) {
			let a = t.map[s], c = r.nodeAt(a);
			e.setNodeMarkup(e.mapping.map(n + a), null, _l(c.attrs, i - t.colCount(a))), o += c.attrs.rowspan - 1;
		} else {
			let c = a == null ? J(r.type.schema).cell : r.nodeAt(t.map[s + a]).type, l = t.positionAt(o, i, r);
			e.insert(e.mapping.map(n + l), c.createAndFill());
		}
	}
	return e;
}
function Al(e, t) {
	if (!ll(e)) return !1;
	if (t) {
		let n = Ol(e);
		t(kl(e.tr, n, n.right));
	}
	return !0;
}
function jl(e, { map: t, table: n, tableStart: r }, i) {
	let a = e.mapping.maps.length;
	for (let o = 0; o < t.height;) {
		let s = o * t.width + i, c = t.map[s], l = n.nodeAt(c), u = l.attrs;
		if (i > 0 && t.map[s - 1] == c || i < t.width - 1 && t.map[s + 1] == c) e.setNodeMarkup(e.mapping.slice(a).map(r + c), null, gl(u, i - t.colCount(c)));
		else {
			let t = e.mapping.slice(a).map(r + c);
			e.delete(t, t + l.nodeSize);
		}
		o += u.rowspan;
	}
}
function Ml(e, t) {
	if (!ll(e)) return !1;
	if (t) {
		let n = Ol(e), r = e.tr;
		if (n.left == 0 && n.right == n.map.width) return !1;
		for (let e = n.right - 1; jl(r, n, e), e != n.left; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = q.get(e);
		}
		t(r);
	}
	return !0;
}
function Nl(e, t, n) {
	let r = J(t.type.schema).header_cell;
	for (let i = 0; i < e.width; i++) if (t.nodeAt(e.map[i + n * e.width])?.type != r) return !1;
	return !0;
}
function Pl(e, { map: t, tableStart: n, table: r }, i) {
	let a = n;
	for (let e = 0; e < i; e++) a += r.child(e).nodeSize;
	let o = [], s = i > 0 ? -1 : 0;
	Nl(t, r, i + s) && (s = i == 0 || i == t.height ? null : 0);
	for (let a = 0, c = t.width * i; a < t.width; a++, c++) if (i > 0 && i < t.height && t.map[c] == t.map[c - t.width]) {
		let i = t.map[c], o = r.nodeAt(i).attrs;
		e.setNodeMarkup(n + i, null, {
			...o,
			rowspan: o.rowspan + 1
		}), a += o.colspan - 1;
	} else {
		let e = (s == null ? J(r.type.schema).cell : r.nodeAt(t.map[c + s * t.width])?.type)?.createAndFill();
		e && o.push(e);
	}
	return e.insert(a, J(r.type.schema).row.create(null, o)), e;
}
function Fl(e, t) {
	if (!ll(e)) return !1;
	if (t) {
		let n = Ol(e);
		t(Pl(e.tr, n, n.bottom));
	}
	return !0;
}
function Il(e, { map: t, table: n, tableStart: r }, i) {
	let a = 0;
	for (let e = 0; e < i; e++) a += n.child(e).nodeSize;
	let o = a + n.child(i).nodeSize, s = e.mapping.maps.length;
	e.delete(a + r, o + r);
	let c = /* @__PURE__ */ new Set();
	for (let a = 0, o = i * t.width; a < t.width; a++, o++) {
		let l = t.map[o];
		if (!c.has(l)) {
			if (c.add(l), i > 0 && l == t.map[o - t.width]) {
				let t = n.nodeAt(l).attrs;
				e.setNodeMarkup(e.mapping.slice(s).map(l + r), null, {
					...t,
					rowspan: t.rowspan - 1
				}), a += t.colspan - 1;
			} else if (i < t.height && l == t.map[o + t.width]) {
				let o = n.nodeAt(l), c = o.attrs, u = o.type.create({
					...c,
					rowspan: o.attrs.rowspan - 1
				}, o.content), d = t.positionAt(i + 1, a, n);
				e.insert(e.mapping.slice(s).map(r + d), u), a += c.colspan - 1;
			}
		}
	}
}
function Ll(e, t) {
	if (!ll(e)) return !1;
	if (t) {
		let n = Ol(e), r = e.tr;
		if (n.top == 0 && n.bottom == n.map.height) return !1;
		for (let e = n.bottom - 1; Il(r, n, e), e != n.top; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = q.get(n.table);
		}
		t(r);
	}
	return !0;
}
function Rl(e) {
	return function(t, n) {
		if (!ll(t)) return !1;
		if (n) {
			let r = J(t.schema), i = Ol(t), a = t.tr, o = i.map.cellsInRect(e == "column" ? {
				left: i.left,
				top: 0,
				right: i.right,
				bottom: i.map.height
			} : e == "row" ? {
				left: 0,
				top: i.top,
				right: i.map.width,
				bottom: i.bottom
			} : i), s = o.map((e) => i.table.nodeAt(e));
			for (let e = 0; e < o.length; e++) s[e].type == r.header_cell && a.setNodeMarkup(i.tableStart + o[e], r.cell, s[e].attrs);
			if (a.steps.length === 0) for (let e = 0; e < o.length; e++) a.setNodeMarkup(i.tableStart + o[e], r.header_cell, s[e].attrs);
			n(a);
		}
		return !0;
	};
}
function zl(e, t, n) {
	let r = t.map.cellsInRect({
		left: 0,
		top: 0,
		right: e == "row" ? t.map.width : 1,
		bottom: e == "column" ? t.map.height : 1
	});
	for (let e = 0; e < r.length; e++) {
		let i = t.table.nodeAt(r[e]);
		if (i && i.type !== n.header_cell) return !1;
	}
	return !0;
}
function Bl(e, t) {
	return t ||= { useDeprecatedLogic: !1 }, t.useDeprecatedLogic ? Rl(e) : function(t, n) {
		if (!ll(t)) return !1;
		if (n) {
			let r = J(t.schema), i = Ol(t), a = t.tr, o = zl("row", i, r), s = zl("column", i, r), c = (e === "column" ? o : e === "row" && s) ? 1 : 0, l = e == "column" ? {
				left: 0,
				top: c,
				right: 1,
				bottom: i.map.height
			} : e == "row" ? {
				left: c,
				top: 0,
				right: i.map.width,
				bottom: 1
			} : i, u = e == "column" ? s ? r.cell : r.header_cell : e == "row" ? o ? r.cell : r.header_cell : r.cell;
			i.map.cellsInRect(l).forEach((e) => {
				let t = e + i.tableStart, n = a.doc.nodeAt(t);
				n && a.setNodeMarkup(t, u, n.attrs);
			}), n(a);
		}
		return !0;
	};
}
Bl("row", { useDeprecatedLogic: !0 }), Bl("column", { useDeprecatedLogic: !0 }), Bl("cell", { useDeprecatedLogic: !0 });
function Vl(e, t) {
	if (t < 0) {
		let t = e.nodeBefore;
		if (t) return e.pos - t.nodeSize;
		for (let t = e.index(-1) - 1, n = e.before(); t >= 0; t--) {
			let r = e.node(-1).child(t), i = r.lastChild;
			if (i) return n - 1 - i.nodeSize;
			n -= r.nodeSize;
		}
	} else {
		if (e.index() < e.parent.childCount - 1) return e.pos + e.nodeAfter.nodeSize;
		let t = e.node(-1);
		for (let n = e.indexAfter(-1), r = e.after(); n < t.childCount; n++) {
			let e = t.child(n);
			if (e.childCount) return r + 1;
			r += e.nodeSize;
		}
	}
	return null;
}
function Hl(e) {
	return function(t, n) {
		if (!ll(t)) return !1;
		let r = Vl(ul(t), e);
		if (r == null) return !1;
		if (n) {
			let e = t.doc.resolve(r);
			n(t.tr.setSelection(O.between(e, pl(e))).scrollIntoView());
		}
		return !0;
	};
}
function Ul(e, t) {
	let n = e.selection.$anchor;
	for (let r = n.depth; r > 0; r--) if (n.node(r).type.spec.tableRole == "table") return t && t(e.tr.delete(n.before(r), n.after(r)).scrollIntoView()), !0;
	return !1;
}
function Wl(e, t) {
	let n = e.selection;
	if (!(n instanceof Y)) return !1;
	if (t) {
		let r = e.tr, i = J(e.schema).cell.createAndFill().content;
		n.forEachCell((e, t) => {
			e.content.eq(i) || r.replace(r.mapping.map(t + 1), r.mapping.map(t + e.nodeSize - 1), new S(i, 0, 0));
		}), r.docChanged && t(r);
	}
	return !0;
}
function Gl(e) {
	if (e.size === 0) return null;
	let { content: t, openStart: n, openEnd: r } = e;
	for (; t.childCount == 1 && (n > 0 && r > 0 || t.child(0).type.spec.tableRole == "table");) n--, r--, t = t.child(0).content;
	let i = t.child(0), a = i.type.spec.tableRole, o = i.type.schema, s = [];
	if (a == "row") for (let e = 0; e < t.childCount; e++) {
		let i = t.child(e).content, a = e ? 0 : Math.max(0, n - 1), c = e < t.childCount - 1 ? 0 : Math.max(0, r - 1);
		(a || c) && (i = ql(J(o).row, new S(i, a, c)).content), s.push(i);
	}
	else if (a == "cell" || a == "header_cell") s.push(n || r ? ql(J(o).row, new S(t, n, r)).content : t);
	else return null;
	return Kl(o, s);
}
function Kl(e, t) {
	let n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		for (let t = r.childCount - 1; t >= 0; t--) {
			let { rowspan: i, colspan: a } = r.child(t).attrs;
			for (let t = e; t < e + i; t++) n[t] = (n[t] || 0) + a;
		}
	}
	let r = 0;
	for (let e = 0; e < n.length; e++) r = Math.max(r, n[e]);
	for (let i = 0; i < n.length; i++) if (i >= t.length && t.push(g.empty), n[i] < r) {
		let a = J(e).cell.createAndFill(), o = [];
		for (let e = n[i]; e < r; e++) o.push(a);
		t[i] = t[i].append(g.from(o));
	}
	return {
		height: t.length,
		width: r,
		rows: t
	};
}
function ql(e, t) {
	let n = e.createAndFill();
	return new Sn(n).replace(0, n.content.size, t).doc;
}
function Jl({ width: e, height: t, rows: n }, r, i) {
	if (e != r) {
		let t = [], i = [];
		for (let e = 0; e < n.length; e++) {
			let a = n[e], o = [];
			for (let n = t[e] || 0, i = 0; n < r; i++) {
				let s = a.child(i % a.childCount);
				n + s.attrs.colspan > r && (s = s.type.createChecked(gl(s.attrs, s.attrs.colspan, n + s.attrs.colspan - r), s.content)), o.push(s), n += s.attrs.colspan;
				for (let n = 1; n < s.attrs.rowspan; n++) t[e + n] = (t[e + n] || 0) + s.attrs.colspan;
			}
			i.push(g.from(o));
		}
		n = i, e = r;
	}
	if (t != i) {
		let e = [];
		for (let r = 0, a = 0; r < i; r++, a++) {
			let o = [], s = n[a % t];
			for (let e = 0; e < s.childCount; e++) {
				let t = s.child(e);
				r + t.attrs.rowspan > i && (t = t.type.create({
					...t.attrs,
					rowspan: Math.max(1, i - t.attrs.rowspan)
				}, t.content)), o.push(t);
			}
			e.push(g.from(o));
		}
		n = e, t = i;
	}
	return {
		width: e,
		height: t,
		rows: n
	};
}
function Yl(e, t, n, r, i, a, o) {
	let s = e.doc.type.schema, c = J(s), l, u;
	if (i > t.width) for (let a = 0, s = 0; a < t.height; a++) {
		let d = n.child(a);
		s += d.nodeSize;
		let f = [], p;
		p = d.lastChild == null || d.lastChild.type == c.cell ? l ||= c.cell.createAndFill() : u ||= c.header_cell.createAndFill();
		for (let e = t.width; e < i; e++) f.push(p);
		e.insert(e.mapping.slice(o).map(s - 1 + r), f);
	}
	if (a > t.height) {
		let s = [];
		for (let e = 0, r = (t.height - 1) * t.width; e < Math.max(t.width, i); e++) {
			let i = e >= t.width ? !1 : n.nodeAt(t.map[r + e]).type == c.header_cell;
			s.push(i ? u ||= c.header_cell.createAndFill() : l ||= c.cell.createAndFill());
		}
		let d = c.row.create(null, g.from(s)), f = [];
		for (let e = t.height; e < a; e++) f.push(d);
		e.insert(e.mapping.slice(o).map(r + n.nodeSize - 2), f);
	}
	return !!(l || u);
}
function Xl(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.height) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = o * t.width + l, a = t.map[i];
		if (t.map[i - t.width] == a) {
			c = !0;
			let i = n.nodeAt(a), { top: u, left: d } = t.findCell(a);
			e.setNodeMarkup(e.mapping.slice(s).map(a + r), null, {
				...i.attrs,
				rowspan: o - u
			}), e.insert(e.mapping.slice(s).map(t.positionAt(o, d, n)), i.type.createAndFill({
				...i.attrs,
				rowspan: u + i.attrs.rowspan - o
			})), l += i.attrs.colspan - 1;
		}
	}
	return c;
}
function Zl(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.width) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = l * t.width + o, a = t.map[i];
		if (t.map[i - 1] == a) {
			c = !0;
			let i = n.nodeAt(a), u = t.colCount(a), d = e.mapping.slice(s).map(a + r);
			e.setNodeMarkup(d, null, gl(i.attrs, o - u, i.attrs.colspan - (o - u))), e.insert(d + i.nodeSize, i.type.createAndFill(gl(i.attrs, 0, o - u))), l += i.attrs.rowspan - 1;
		}
	}
	return c;
}
function Ql(e, t, n, r, i) {
	let a = n ? e.doc.nodeAt(n - 1) : e.doc;
	if (!a) throw Error("No table found");
	let o = q.get(a), { top: s, left: c } = r, l = c + i.width, u = s + i.height, d = e.tr, f = 0;
	function p() {
		if (a = n ? d.doc.nodeAt(n - 1) : d.doc, !a) throw Error("No table found");
		o = q.get(a), f = d.mapping.maps.length;
	}
	Yl(d, o, a, n, l, u, f) && p(), Xl(d, o, a, n, c, l, s, f) && p(), Xl(d, o, a, n, c, l, u, f) && p(), Zl(d, o, a, n, s, u, c, f) && p(), Zl(d, o, a, n, s, u, l, f) && p();
	for (let e = s; e < u; e++) {
		let t = o.positionAt(e, c, a), r = o.positionAt(e, l, a);
		d.replace(d.mapping.slice(f).map(t + n), d.mapping.slice(f).map(r + n), new S(i.rows[e - s], 0, 0));
	}
	p(), d.setSelection(new Y(d.doc.resolve(n + o.positionAt(s, c, a)), d.doc.resolve(n + o.positionAt(u - 1, l - 1, a)))), t(d);
}
var $l = ei({
	ArrowLeft: tu("horiz", -1),
	ArrowRight: tu("horiz", 1),
	ArrowUp: tu("vert", -1),
	ArrowDown: tu("vert", 1),
	"Shift-ArrowLeft": nu("horiz", -1),
	"Shift-ArrowRight": nu("horiz", 1),
	"Shift-ArrowUp": nu("vert", -1),
	"Shift-ArrowDown": nu("vert", 1),
	Backspace: Wl,
	"Mod-Backspace": Wl,
	Delete: Wl,
	"Mod-Delete": Wl
});
function eu(e, t, n) {
	return n.eq(e.selection) ? !1 : (t && t(e.tr.setSelection(n).scrollIntoView()), !0);
}
function tu(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection;
		if (a instanceof Y) return eu(n, r, D.near(a.$headCell, t));
		if (e != "horiz" && !a.empty) return !1;
		let o = ou(i, e, t);
		if (o == null) return !1;
		if (e == "horiz") return eu(n, r, D.near(n.doc.resolve(a.head + t), t));
		{
			let i = n.doc.resolve(o), a = hl(i, e, t), s;
			return s = a ? D.near(a, 1) : t < 0 ? D.near(n.doc.resolve(i.before(-1)), -1) : D.near(n.doc.resolve(i.after(-1)), 1), eu(n, r, s);
		}
	};
}
function nu(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection, o;
		if (a instanceof Y) o = a;
		else {
			let r = ou(i, e, t);
			if (r == null) return !1;
			o = new Y(n.doc.resolve(r));
		}
		let s = hl(o.$headCell, e, t);
		return s ? eu(n, r, new Y(o.$anchorCell, s)) : !1;
	};
}
function ru(e, t) {
	let n = e.state.doc, r = cl(n.resolve(t));
	return r ? (e.dispatch(e.state.tr.setSelection(new Y(r))), !0) : !1;
}
function iu(e, t, n) {
	if (!ll(e.state)) return !1;
	let r = Gl(n), i = e.state.selection;
	if (i instanceof Y) {
		r ||= {
			width: 1,
			height: 1,
			rows: [g.from(ql(J(e.state.schema).cell, n))]
		};
		let t = i.$anchorCell.node(-1), a = i.$anchorCell.start(-1), o = q.get(t).rectBetween(i.$anchorCell.pos - a, i.$headCell.pos - a);
		return r = Jl(r, o.right - o.left, o.bottom - o.top), Ql(e.state, e.dispatch, a, o, r), !0;
	} else if (r) {
		let t = ul(e.state), n = t.start(-1);
		return Ql(e.state, e.dispatch, n, q.get(t.node(-1)).findCell(t.pos - n), r), !0;
	} else return !1;
}
function au(e, t) {
	if (t.button != 0 || t.ctrlKey || t.metaKey) return;
	let n = su(e, t.target), r;
	if (t.shiftKey && e.state.selection instanceof Y) i(e.state.selection.$anchorCell, t), t.preventDefault();
	else if (t.shiftKey && n && (r = cl(e.state.selection.$anchor)) != null && cu(e, t)?.pos != r.pos) i(r, t), t.preventDefault();
	else if (!n) return;
	function i(t, n) {
		let r = cu(e, n), i = sl.getState(e.state) == null;
		if (!r || !ml(t, r)) if (i) r = t;
		else return;
		let a = new Y(t, r);
		if (i || !e.state.selection.eq(a)) {
			let n = e.state.tr.setSelection(a);
			i && n.setMeta(sl, t.pos), e.dispatch(n);
		}
	}
	function a() {
		e.root.removeEventListener("mouseup", a), e.root.removeEventListener("dragstart", a), e.root.removeEventListener("mousemove", o), sl.getState(e.state) != null && e.dispatch(e.state.tr.setMeta(sl, -1));
	}
	function o(r) {
		let o = r, s = sl.getState(e.state), c;
		if (s != null) c = e.state.doc.resolve(s);
		else if (su(e, o.target) != n && (c = cu(e, t), !c)) return a();
		c && i(c, o);
	}
	e.root.addEventListener("mouseup", a), e.root.addEventListener("dragstart", a), e.root.addEventListener("mousemove", o);
}
function ou(e, t, n) {
	if (!(e.state.selection instanceof O)) return null;
	let { $head: r } = e.state.selection;
	for (let i = r.depth - 1; i >= 0; i--) {
		let a = r.node(i);
		if ((n < 0 ? r.index(i) : r.indexAfter(i)) != (n < 0 ? 0 : a.childCount)) return null;
		if (a.type.spec.tableRole == "cell" || a.type.spec.tableRole == "header_cell") {
			let a = r.before(i), o = t == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
			return e.endOfTextblock(o) ? a : null;
		}
	}
	return null;
}
function su(e, t) {
	for (; t && t != e.dom; t = t.parentNode) if (t.nodeName == "TD" || t.nodeName == "TH") return t;
	return null;
}
function cu(e, t) {
	let n = e.posAtCoords({
		left: t.clientX,
		top: t.clientY
	});
	if (!n) return null;
	let { inside: r, pos: i } = n;
	return r >= 0 && cl(e.state.doc.resolve(r)) || cl(e.state.doc.resolve(i));
}
var lu = class {
	constructor(e, t) {
		this.node = e, this.defaultCellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.table.style.setProperty("--default-cell-min-width", `${t}px`), this.colgroup = this.table.appendChild(document.createElement("colgroup")), uu(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
	}
	update(e) {
		return e.type == this.node.type ? (this.node = e, uu(e, this.colgroup, this.table, this.defaultCellMinWidth), !0) : !1;
	}
	ignoreMutation(e) {
		return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
	}
};
function uu(e, t, n, r, i, a) {
	let o = 0, s = !0, c = t.firstChild, l = e.firstChild;
	if (l) {
		for (let e = 0, n = 0; e < l.childCount; e++) {
			let { colspan: u, colwidth: d } = l.child(e).attrs;
			for (let e = 0; e < u; e++, n++) {
				let l = i == n ? a : d && d[e], u = l ? l + "px" : "";
				if (o += l || r, l || (s = !1), c) c.style.width != u && (c.style.width = u), c = c.nextSibling;
				else {
					let e = document.createElement("col");
					e.style.width = u, t.appendChild(e);
				}
			}
		}
		for (; c;) {
			var u;
			let e = c.nextSibling;
			(u = c.parentNode) == null || u.removeChild(c), c = e;
		}
		s ? (n.style.width = o + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = o + "px");
	}
}
var X = new Gn("tableColumnResizing");
function du({ handleWidth: e = 5, cellMinWidth: t = 25, defaultCellMinWidth: n = 100, View: r = lu, lastColumnResizable: i = !0 } = {}) {
	let a = new Hn({
		key: X,
		state: {
			init(e, t) {
				var i;
				let o = (i = a.spec) == null || (i = i.props) == null ? void 0 : i.nodeViews, s = J(t.schema).table.name;
				return r && o && (o[s] = (e, t) => new r(e, n, t)), new fu(-1, !1);
			},
			apply(e, t) {
				return t.apply(e);
			}
		},
		props: {
			attributes: (e) => {
				let t = X.getState(e);
				return t && t.activeHandle > -1 ? { class: "resize-cursor" } : {};
			},
			handleDOMEvents: {
				mousemove: (t, n) => {
					pu(t, n, e, i);
				},
				mouseleave: (e) => {
					mu(e);
				},
				mousedown: (e, r) => {
					hu(e, r, t, n);
				}
			},
			decorations: (e) => {
				let t = X.getState(e);
				if (t && t.activeHandle > -1) return wu(e, t.activeHandle);
			},
			nodeViews: {}
		}
	});
	return a;
}
var fu = class e {
	constructor(e, t) {
		this.activeHandle = e, this.dragging = t;
	}
	apply(t) {
		let n = this, r = t.getMeta(X);
		if (r && r.setHandle != null) return new e(r.setHandle, !1);
		if (r && r.setDragging !== void 0) return new e(n.activeHandle, r.setDragging);
		if (n.activeHandle > -1 && t.docChanged) {
			let r = t.mapping.map(n.activeHandle, -1);
			return fl(t.doc.resolve(r)) || (r = -1), new e(r, n.dragging);
		}
		return n;
	}
};
function pu(e, t, n, r) {
	if (!e.editable) return;
	let i = X.getState(e.state);
	if (i && !i.dragging) {
		let a = _u(t.target), o = -1;
		if (a) {
			let { left: r, right: i } = a.getBoundingClientRect();
			t.clientX - r <= n ? o = vu(e, t, "left", n) : i - t.clientX <= n && (o = vu(e, t, "right", n));
		}
		if (o != i.activeHandle) {
			if (!r && o !== -1) {
				let t = e.state.doc.resolve(o), n = t.node(-1), r = q.get(n), i = t.start(-1);
				if (r.colCount(t.pos - i) + t.nodeAfter.attrs.colspan - 1 == r.width - 1) return;
			}
			bu(e, o);
		}
	}
}
function mu(e) {
	if (!e.editable) return;
	let t = X.getState(e.state);
	t && t.activeHandle > -1 && !t.dragging && bu(e, -1);
}
function hu(e, t, n, r) {
	if (!e.editable) return !1;
	let i = e.dom.ownerDocument.defaultView ?? window, a = X.getState(e.state);
	if (!a || a.activeHandle == -1 || a.dragging) return !1;
	let o = e.state.doc.nodeAt(a.activeHandle), s = gu(e, a.activeHandle, o.attrs);
	e.dispatch(e.state.tr.setMeta(X, { setDragging: {
		startX: t.clientX,
		startWidth: s
	} }));
	function c(t) {
		i.removeEventListener("mouseup", c), i.removeEventListener("mousemove", l);
		let r = X.getState(e.state);
		r?.dragging && (xu(e, r.activeHandle, yu(r.dragging, t, n)), e.dispatch(e.state.tr.setMeta(X, { setDragging: null })));
	}
	function l(t) {
		if (!t.which) return c(t);
		let i = X.getState(e.state);
		if (i && i.dragging) {
			let a = yu(i.dragging, t, n);
			Su(e, i.activeHandle, a, r);
		}
	}
	return Su(e, a.activeHandle, s, r), i.addEventListener("mouseup", c), i.addEventListener("mousemove", l), t.preventDefault(), !0;
}
function gu(e, t, { colspan: n, colwidth: r }) {
	let i = r && r[r.length - 1];
	if (i) return i;
	let a = e.domAtPos(t), o = a.node.childNodes[a.offset].offsetWidth, s = n;
	if (r) for (let e = 0; e < n; e++) r[e] && (o -= r[e], s--);
	return o / s;
}
function _u(e) {
	for (; e && e.nodeName != "TD" && e.nodeName != "TH";) e = e.classList && e.classList.contains("ProseMirror") ? null : e.parentNode;
	return e;
}
function vu(e, t, n, r) {
	let i = n == "right" ? -r : r, a = e.posAtCoords({
		left: t.clientX + i,
		top: t.clientY
	});
	if (!a) return -1;
	let { pos: o } = a, s = cl(e.state.doc.resolve(o));
	if (!s) return -1;
	if (n == "right") return s.pos;
	let c = q.get(s.node(-1)), l = s.start(-1), u = c.map.indexOf(s.pos - l);
	return u % c.width == 0 ? -1 : l + c.map[u - 1];
}
function yu(e, t, n) {
	let r = t.clientX - e.startX;
	return Math.max(n, e.startWidth + r);
}
function bu(e, t) {
	e.dispatch(e.state.tr.setMeta(X, { setHandle: t }));
}
function xu(e, t, n) {
	let r = e.state.doc.resolve(t), i = r.node(-1), a = q.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, c = e.state.tr;
	for (let e = 0; e < a.height; e++) {
		let t = e * a.width + s;
		if (e && a.map[t] == a.map[t - a.width]) continue;
		let r = a.map[t], l = i.nodeAt(r).attrs, u = l.colspan == 1 ? 0 : s - a.colCount(r);
		if (l.colwidth && l.colwidth[u] == n) continue;
		let d = l.colwidth ? l.colwidth.slice() : Cu(l.colspan);
		d[u] = n, c.setNodeMarkup(o + r, null, {
			...l,
			colwidth: d
		});
	}
	c.docChanged && e.dispatch(c);
}
function Su(e, t, n, r) {
	let i = e.state.doc.resolve(t), a = i.node(-1), o = i.start(-1), s = q.get(a).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1, c = e.domAtPos(i.start(-1)).node;
	for (; c && c.nodeName != "TABLE";) c = c.parentNode;
	c && uu(a, c.firstChild, c, r, s, n);
}
function Cu(e) {
	return Array(e).fill(0);
}
function wu(e, t) {
	let n = [], r = e.doc.resolve(t), i = r.node(-1);
	if (!i) return G.empty;
	let a = q.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1;
	for (let t = 0; t < a.height; t++) {
		let r = s + t * a.width;
		if ((s == a.width - 1 || a.map[r] != a.map[r + 1]) && (t == 0 || a.map[r] != a.map[r - a.width])) {
			let t = a.map[r], s = o + t + i.nodeAt(t).nodeSize - 1, c = document.createElement("div");
			c.className = "column-resize-handle", X.getState(e)?.dragging && n.push(W.node(o + t, o + t + i.nodeAt(t).nodeSize, { class: "column-resize-dragging" })), n.push(W.widget(s, c));
		}
	}
	return G.create(e.doc, n);
}
function Tu({ allowTableNodeSelection: e = !1 } = {}) {
	return new Hn({
		key: sl,
		state: {
			init() {
				return null;
			},
			apply(e, t) {
				let n = e.getMeta(sl);
				if (n != null) return n == -1 ? null : n;
				if (t == null || !e.docChanged) return t;
				let { deleted: r, pos: i } = e.mapping.mapResult(t);
				return r ? null : i;
			}
		},
		props: {
			decorations: bl,
			handleDOMEvents: { mousedown: au },
			createSelectionBetween(e) {
				return sl.getState(e.state) == null ? null : e.state.selection;
			},
			handleTripleClick: ru,
			handleKeyDown: $l,
			handlePaste: iu
		},
		appendTransaction(t, n, r) {
			return Cl(r, El(r, n), e);
		}
	});
}
//#endregion
//#region src/components/prose-editor/prose-editor.css?inline
var Eu = "tp-prose-editor{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface,Canvas);color:var(--tp-color-text,CanvasText);display:block;overflow:hidden}tp-prose-editor[readonly]{background:var(--tp-color-surface-muted,color-mix(in srgb, Canvas 94%, CanvasText))}tp-prose-editor>tp-toolbar[data-tp-prose-editor-toolbar],tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{z-index:auto;border-block-end:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));--tp-toolbar-padding:.375rem;--tp-toolbar-size:auto;--tp-icon-button-size:2rem;flex-wrap:wrap;position:static;overflow-x:auto}tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{padding-block:.25rem}tp-prose-editor>tp-toolbar[data-tp-prose-editor-secondary-toolbar][hidden]{display:none}tp-prose-editor tp-dropdown[data-tp-prose-editor-emoji-picker-dropdown],tp-prose-editor tp-dropdown[data-tp-prose-editor-icon-picker-dropdown],tp-prose-editor tp-dropdown[data-tp-prose-editor-symbol-picker-dropdown]{inline-size:min(30rem,100vw - 2rem);max-inline-size:calc(100vw - 2rem);padding:.5rem}tp-prose-editor tp-dropdown[data-tp-prose-editor-emoji-picker-dropdown]>tp-emoji-picker,tp-prose-editor tp-dropdown[data-tp-prose-editor-icon-picker-dropdown]>tp-icon-picker,tp-prose-editor tp-dropdown[data-tp-prose-editor-symbol-picker-dropdown]>tp-symbol-picker{box-sizing:border-box;inline-size:100%}tp-prose-editor[readonly]>tp-toolbar[data-tp-prose-editor-toolbar],tp-prose-editor[readonly]>tp-toolbar[data-tp-prose-editor-secondary-toolbar]{display:none}tp-prose-editor tp-icon-button[aria-pressed=true]>button{background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 14%, transparent));color:var(--tp-color-accent,Highlight)}tp-prose-editor [data-tp-prose-editor-separator]{background:color-mix(in srgb, CanvasText 22%, Canvas);align-self:stretch;inline-size:1px;margin-inline:.125rem}tp-prose-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-prose-editor>tp-toolbar>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-prose-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start-color:color-mix(in srgb, CanvasText 22%, Canvas)}tp-prose-editor [data-tp-prose-editor-search-control]{align-items:center;display:inline-flex;position:relative}tp-prose-editor [data-tp-prose-editor-search-control][hidden]{display:none}tp-prose-editor [data-tp-prose-editor-search-input]{box-sizing:border-box;border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-surface,Canvas);block-size:1.75rem;inline-size:min(14rem,42vw);min-inline-size:7rem;color:inherit;font:inherit;padding-inline:.5rem 1.875rem;font-size:.8125rem;line-height:1}tp-prose-editor [data-tp-prose-editor-search-clear]{z-index:1;--tp-icon-button-size:1.5rem;--tp-icon-button-icon-size:.875rem;position:absolute;inset-block-start:50%;inset-inline-end:.125rem;transform:translateY(-50%)}tp-prose-editor [data-tp-prose-editor-search-input]:focus-visible{outline:2px solid var(--tp-color-focus,Highlight);outline-offset:2px}tp-prose-editor .tp-prose-editor-math-inline{vertical-align:middle;display:inline-block}tp-prose-editor .tp-prose-editor-math-block{text-align:center;margin-block:1rem;display:block;overflow-x:auto}tp-prose-editor .tp-prose-editor-math-inline svg,tp-prose-editor .tp-prose-editor-math-block svg,tp-prose-editor .tp-prose-editor-math-inline mjx-container>svg,tp-prose-editor .tp-prose-editor-math-block mjx-container>svg{max-width:none;max-inline-size:none;display:inline-block}tp-prose-editor [data-tp-prose-editor-file-menu],tp-prose-editor [data-tp-prose-editor-menu]{box-sizing:border-box;border:0;border-radius:0;max-block-size:min(24rem,100vh - 4rem);inline-size:max-content;min-inline-size:10rem;max-inline-size:calc(100vw - 2rem);overflow:auto}tp-prose-editor tp-dropdown[data-tp-prose-editor-type-dropdown],tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type]{overflow:visible!important}tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type]{max-block-size:none}tp-prose-editor [data-tp-prose-editor-menu][data-menu-kind=type] ul[data-tp-menu-submenu]{z-index:10002}tp-prose-editor [data-tp-prose-editor-table-menu]{box-sizing:border-box;border:0;border-radius:0;inline-size:max-content;min-inline-size:10rem;max-inline-size:calc(100vw - 2rem);overflow:visible}tp-prose-editor [data-tp-prose-editor-table-menu] ul,tp-prose-editor [data-tp-prose-editor-table-menu] li{margin:0;padding-inline-start:0;list-style:none}tp-prose-editor tp-menu li[aria-disabled=true]{opacity:.5;cursor:default}tp-prose-editor [data-tp-prose-editor-menu-label]{grid-template-columns:1.25rem max-content;align-items:center;gap:.45rem;display:inline-grid}tp-prose-editor [data-tp-prose-editor-menu-label]>tp-icon{place-items:center;font-size:1.125rem;display:inline-grid}tp-prose-editor tp-menu li[aria-expanded=true]>ul[data-tp-prose-editor-horizontal-submenu]{align-items:center;gap:.125rem;display:flex}tp-prose-editor tp-menu ul[data-tp-prose-editor-horizontal-submenu]>li[role=menuitem]{text-align:center;place-items:center;min-inline-size:2rem;padding:.35rem;display:grid}tp-prose-editor [data-table-picker]{position:relative}tp-prose-editor tp-menu li[aria-expanded=true]>ul[data-tp-prose-editor-table-picker-submenu]{display:block}tp-prose-editor ul[data-tp-prose-editor-table-picker-submenu],tp-prose-editor ul[data-tp-prose-editor-table-picker-submenu]>li{margin:0;padding:0;list-style:none}tp-prose-editor [data-table-picker-content][role=menuitem]{cursor:default}tp-prose-editor [data-table-picker-content][role=menuitem]:hover{color:inherit;background:0 0}tp-prose-editor [data-table-picker-content] [data-tp-prose-editor-table-picker]{gap:.375rem;padding:.25rem .5rem .5rem;display:grid}tp-prose-editor [data-tp-prose-editor-table-picker-size]{color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));text-align:center;font-size:.8125rem}tp-prose-editor [data-tp-prose-editor-table-picker-grid]{grid-template-columns:repeat(6,.75rem);gap:.1875rem;display:grid}tp-prose-editor [data-table-grid-cell]{appearance:none;box-sizing:border-box;block-size:.75rem;min-block-size:0;inline-size:.75rem;min-height:0;aspect-ratio:1;border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 22%, transparent));background:var(--tp-color-surface,Canvas);min-inline-size:0;color:inherit;cursor:pointer;border-radius:.125rem;padding:0;line-height:0}tp-prose-editor [data-table-grid-cell][data-selected]{border-color:var(--tp-color-accent,Highlight);background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 18%, transparent))}tp-prose-editor [data-table-grid-cell]:focus-visible{outline:2px solid var(--tp-color-focus,Highlight);outline-offset:2px}tp-prose-editor>[data-tp-prose-editor-surface],tp-prose-editor>[data-tp-prose-editor-html-rendered]{min-block-size:12rem}tp-prose-editor>[data-tp-prose-editor-html-rendered]{box-sizing:border-box;background:var(--tp-color-surface,Canvas);color:inherit;outline:none;padding:.875rem 1rem}tp-prose-editor>[data-tp-prose-editor-html-rendered][hidden]{display:none}tp-prose-editor>[data-tp-prose-editor-html-source]{box-sizing:border-box;resize:vertical;background:var(--tp-color-surface,Canvas);min-block-size:12rem;inline-size:100%;color:inherit;white-space:pre;tab-size:2;border:0;outline:none;padding:.875rem 1rem;font:.875rem/1.5 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;display:block}tp-prose-editor>[data-tp-prose-editor-html-source][hidden]{display:none}tp-prose-editor .ProseMirror{box-sizing:border-box;white-space:pre-wrap;overflow-wrap:break-word;outline:none;min-block-size:12rem;padding:.875rem 1rem;position:relative}tp-prose-editor .ProseMirror[data-tp-prose-editor-empty]:before{color:color-mix(in srgb, currentColor 45%, transparent);content:attr(data-placeholder);pointer-events:none;white-space:nowrap;position:absolute;inset-block-start:.875rem;inset-inline-start:1rem}tp-prose-editor .ProseMirror [data-tp-prose-editor-custom-element]{white-space:normal}tp-prose-editor .ProseMirror tp-icon{block-size:var(--tp-icon-size,1em);line-height:inherit;vertical-align:-.125em;display:inline-flex}tp-prose-editor .ProseMirror tp-icon>[data-tp-icon-container]{block-size:100%;min-block-size:0}tp-prose-editor .ProseMirror>:first-child{margin-block-start:0}tp-prose-editor .ProseMirror>:last-child{margin-block-end:0}tp-prose-editor .ProseMirror p,tp-prose-editor .ProseMirror blockquote,tp-prose-editor .ProseMirror ul,tp-prose-editor .ProseMirror ol{margin-block:0 .5rem}tp-prose-editor .ProseMirror ul,tp-prose-editor .ProseMirror ol{padding-inline-start:1.5rem}tp-prose-editor .ProseMirror hr{border:0;border-block-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));margin-block:1rem}:is(tp-prose-editor .ProseMirror figure:has(>img),tp-prose-editor .ProseMirror figure:has(>video),tp-prose-editor .ProseMirror figure:has(>audio)){background:0 0;max-inline-size:100%;margin:1rem 0;padding:0;display:inline-block}:is(tp-prose-editor .ProseMirror figure:has(>img)>img,tp-prose-editor .ProseMirror figure:has(>video)>video,tp-prose-editor .ProseMirror figure:has(>audio)>audio){max-inline-size:100%;display:block}:is(tp-prose-editor .ProseMirror figure:has(>img)>figcaption,tp-prose-editor .ProseMirror figure:has(>video)>figcaption,tp-prose-editor .ProseMirror figure:has(>audio)>figcaption){color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));text-align:center;margin-block-start:.375rem;font-size:.875rem;line-height:1.35}tp-prose-editor .ProseMirror audio{margin-block-end:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-audio-button]{align-items:center;display:inline-flex}tp-prose-editor .ProseMirror h1,tp-prose-editor .ProseMirror h2{margin-block:1rem .5rem;line-height:1.2}tp-prose-editor .ProseMirror h1{font-size:1.75rem}tp-prose-editor .ProseMirror h2{font-size:1.375rem}tp-prose-editor .ProseMirror blockquote{border-inline-start:.25rem solid var(--tp-color-border-strong,color-mix(in srgb, currentColor 32%, transparent));color:var(--tp-color-text-muted,color-mix(in srgb, currentColor 72%, transparent));margin-inline:0;padding-inline-start:1rem}tp-prose-editor .ProseMirror code{border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-code-background,color-mix(in srgb, currentColor 10%, transparent));padding:.08em .3em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;font-size:.9em}tp-prose-editor .ProseMirror [data-tp-prose-editor-code-block-editor]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));gap:.5rem;margin-block:1rem;padding:.5rem;display:grid}tp-prose-editor .ProseMirror [data-tp-prose-editor-code-block-toolbar]{white-space:normal;justify-content:flex-end;gap:.25rem;display:flex}tp-prose-editor [data-tp-prose-editor-code-menu]{--tp-menu-gap:0;box-sizing:border-box;white-space:normal;border:0;border-radius:0;max-block-size:min(20rem,100vh - 4rem);inline-size:max-content;min-inline-size:9rem;max-inline-size:calc(100vw - 2rem);margin:0;padding:0;overflow:auto}tp-prose-editor [data-tp-prose-editor-code-file-dropdown],tp-prose-editor [data-tp-prose-editor-code-language-dropdown]{--tp-dropdown-gap:0;--tp-dropdown-padding:0;white-space:normal;margin:0;padding:0}tp-prose-editor [data-tp-prose-editor-code-menu] ul{margin:0;padding:0;list-style:none}tp-prose-editor [data-tp-prose-editor-code-menu] li{margin:0;padding-block:0;padding-inline-start:0;list-style:none}tp-prose-editor [data-tp-prose-editor-code-menu]>ul[role=menu]{gap:0}tp-prose-editor [data-tp-prose-editor-code-menu]>ul[role=menu]>li[role=menuitem]{padding-block:0;padding-inline:.5rem}tp-prose-editor [data-tp-prose-editor-code-menu] li[data-selected]{font-weight:600}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-editor]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));gap:.75rem;margin-block:1rem;padding:.75rem;display:grid}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-header]{justify-content:flex-end;display:flex}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-s,.25rem);background:var(--tp-color-surface,Canvas);display:inline-flex;overflow:hidden}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button{border-inline-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));color:inherit;--tp-icon-button-radius:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button:first-child{border-inline-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-modes]>tp-icon-button[aria-pressed=true]>button{background:var(--tp-color-accent-soft,color-mix(in srgb, Highlight 14%, transparent));color:var(--tp-color-accent,Highlight)}tp-prose-editor .ProseMirror tp-code-editor[data-tp-prose-editor-markdown-source][hidden],tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview][hidden]{display:none}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]{border-block-start:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));white-space:normal;min-block-size:2rem;padding-block-start:.75rem}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-block-editor][data-view-mode=preview] [data-tp-prose-editor-markdown-preview]{border-block-start:0;padding-block-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]>:first-child{margin-block-start:0}tp-prose-editor .ProseMirror [data-tp-prose-editor-markdown-preview]>:last-child{margin-block-end:0}tp-prose-editor .ProseMirror table{border-collapse:collapse;table-layout:fixed;inline-size:100%;margin-block:1rem}tp-prose-editor .ProseMirror td,tp-prose-editor .ProseMirror th{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));vertical-align:top;min-inline-size:1rem;padding:.375rem .5rem;position:relative}tp-prose-editor .ProseMirror .selectedCell:after{z-index:2;pointer-events:none;content:\"\";background:color-mix(in srgb, Highlight 18%, transparent);position:absolute;inset:0}tp-prose-editor .ProseMirror .column-resize-handle{z-index:20;pointer-events:none;background:highlight;inline-size:4px;position:absolute;inset-block:0;inset-inline-end:-2px}tp-prose-editor .ProseMirror.resize-cursor{cursor:col-resize}tp-prose-editor .ProseMirror-search-match{background:color-mix(in srgb, Mark 65%, transparent)}tp-prose-editor .ProseMirror-active-search-match{background:color-mix(in srgb, Highlight 45%, transparent);outline:1px solid highlight}", Du = vi(ui.spec.nodes, "paragraph block*", "block"), Ou = "​", ku = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js", Au = null, ju = [
	"abc",
	"css",
	"html",
	"javascript",
	"json",
	"markdown",
	"prolog",
	"python",
	"sql",
	"text",
	"typescript",
	"yaml"
], Mu = ["tp-light", "tp-dark"], Nu = [
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone"
];
function Pu(e) {
	let t = typeof e == "string" && e.trim() !== "" ? e.trim().toLowerCase() : "html";
	return t === "plaintext" ? "text" : t;
}
function Fu(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return Mu.includes(t) ? t : null;
}
function Iu(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return Nu.includes(t) ? t : null;
}
function Lu(e, t) {
	for (let n of e) if (n !== null) {
		for (let e of t) if (n.classList.contains(e)) return e;
	}
	return null;
}
function Ru(e) {
	return Fu(Lu(e, Mu));
}
function zu(e) {
	return Iu(Lu(e, Nu));
}
function Bu(e, t, n) {
	let r = Fu(t), i = Iu(n);
	e.classList.remove(...Mu, ...Nu), r !== null && e.classList.add(r), i !== null && e.classList.add(i);
}
function Vu(e, t) {
	let n = [Fu(e), Iu(t)].filter((e) => e !== null);
	return n.length === 0 ? null : n.join(" ");
}
function Hu(e) {
	return e.querySelector("tp-theme[data-tp-code-editor-theme]")?.getAttribute("mode") ?? null;
}
function Uu(e, t) {
	let n = e.querySelector("tp-theme[data-tp-code-editor-theme]");
	if (n === null) return;
	let r = Fu(t);
	r === "tp-dark" ? n.setAttribute("mode", "dark") : r === "tp-light" ? n.setAttribute("mode", "light") : n.setAttribute("mode", "auto");
}
function Wu(e) {
	return /^(?:https?:|data:|blob:|\/|\.\/|\.\.\/)/.test(e.trim());
}
var Gu = {
	...ui.spec.nodes.get("code_block"),
	attrs: {
		language: { default: "html" },
		src: { default: null },
		theme: { default: null },
		color: { default: null }
	},
	parseDOM: [{
		tag: "pre",
		preserveWhitespace: "full",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("code"), n = Array.from(t?.classList ?? []).find((e) => e.startsWith("language-"));
			return {
				language: Pu(t?.getAttribute("data-language") ?? (n === void 0 ? null : n.slice(9))),
				src: e.getAttribute("data-src") ?? t?.getAttribute("data-src") ?? null,
				theme: Ru([t, e]),
				color: zu([t, e])
			};
		}
	}],
	toDOM(e) {
		let t = Pu(e.attrs.language), n = typeof e.attrs.src == "string" && e.attrs.src.trim() !== "" ? e.attrs.src.trim() : null, r = {}, i = Vu(e.attrs.theme, e.attrs.color);
		n !== null && (r["data-src"] = n), i !== null && (r.class = i);
		let a = [t === "html" ? null : `language-${t}`, i].filter((e) => e !== null).join(" "), o = {};
		return a !== "" && (o.class = a), t !== "html" && (o["data-language"] = t), [
			"pre",
			r,
			[
				"code",
				o,
				0
			]
		];
	}
};
function Ku(e, t) {
	return typeof e == "string" && e.split(/\s+/).includes(t);
}
var qu = {
	parseDOM: [
		{ tag: "u" },
		{
			style: "text-decoration",
			getAttrs: (e) => Ku(e, "underline") ? null : !1
		},
		{
			style: "text-decoration-line",
			getAttrs: (e) => Ku(e, "underline") ? null : !1
		}
	],
	toDOM: () => ["u", 0]
}, Ju = {
	parseDOM: [
		{ tag: "s" },
		{ tag: "strike" },
		{ tag: "del" },
		{
			style: "text-decoration",
			getAttrs: (e) => Ku(e, "line-through") ? null : !1
		},
		{
			style: "text-decoration-line",
			getAttrs: (e) => Ku(e, "line-through") ? null : !1
		}
	],
	toDOM: () => ["s", 0]
}, Yu = {
	excludes: "superscript",
	parseDOM: [{ tag: "sub" }],
	toDOM: () => ["sub", 0]
}, Xu = {
	excludes: "subscript",
	parseDOM: [{ tag: "sup" }],
	toDOM: () => ["sup", 0]
};
function Zu(e) {
	return e.getAttribute("src") ?? e.querySelector("source")?.getAttribute("src") ?? "";
}
function Qu(e, t) {
	let n = e.getAttribute(t);
	if (n !== null && n.trim() !== "") return n;
	let r = e.style.getPropertyValue(t);
	return r.trim() === "" ? null : r.trim();
}
function $u(e, t, n) {
	typeof n != "string" || n.trim() === "" || (e[t] = n.trim());
}
function ed(e, t) {
	let n = document.createElement("figure");
	if (n.append(e), typeof t == "string" && t.trim() !== "") {
		let e = document.createElement("figcaption");
		e.textContent = t, n.append(e);
	}
	return n;
}
var td = {
	attrs: {
		alt: { default: null },
		height: { default: null },
		src: {},
		title: { default: null },
		width: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("img[src]");
			return t instanceof HTMLElement && {
				alt: (e.querySelector("figcaption")?.textContent?.trim() ?? "") || t.getAttribute("alt"),
				height: Qu(t, "height"),
				src: t.getAttribute("src"),
				title: t.getAttribute("title"),
				width: Qu(t, "width")
			};
		}
	}, {
		tag: "img[src]",
		getAttrs(e) {
			return e instanceof HTMLElement && {
				alt: e.getAttribute("alt"),
				height: Qu(e, "height"),
				src: e.getAttribute("src"),
				title: e.getAttribute("title"),
				width: Qu(e, "width")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		typeof e.attrs.alt == "string" && (t.alt = e.attrs.alt), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), $u(t, "width", e.attrs.width), $u(t, "height", e.attrs.height);
		let n = document.createElement("img");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return ed(n, e.attrs.alt);
	}
}, nd = {
	attrs: {
		autoplay: { default: !1 },
		controls: { default: !0 },
		height: { default: null },
		poster: { default: null },
		caption: { default: null },
		src: {},
		title: { default: null },
		width: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("video");
			if (!(t instanceof HTMLElement)) return !1;
			let n = Zu(t);
			return n.trim() !== "" && {
				autoplay: t.hasAttribute("autoplay"),
				caption: e.querySelector("figcaption")?.textContent?.trim() ?? null,
				controls: t.hasAttribute("controls"),
				height: Qu(t, "height"),
				poster: t.getAttribute("poster"),
				src: n,
				title: t.getAttribute("title"),
				width: Qu(t, "width")
			};
		}
	}, {
		tag: "video",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = Zu(e);
			return t.trim() !== "" && {
				autoplay: e.hasAttribute("autoplay"),
				caption: null,
				controls: e.hasAttribute("controls"),
				height: Qu(e, "height"),
				poster: e.getAttribute("poster"),
				src: t,
				title: e.getAttribute("title"),
				width: Qu(e, "width")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		e.attrs.autoplay === !0 && (t.autoplay = ""), e.attrs.controls === !0 && (t.controls = ""), typeof e.attrs.poster == "string" && e.attrs.poster !== "" && (t.poster = e.attrs.poster), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), $u(t, "width", e.attrs.width), $u(t, "height", e.attrs.height);
		let n = document.createElement("video");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return ed(n, e.attrs.caption);
	}
}, rd = {
	attrs: {
		autoplay: { default: !1 },
		caption: { default: null },
		controls: { default: !0 },
		src: {},
		title: { default: null }
	},
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !0,
	parseDOM: [{
		tag: "figure",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = e.querySelector("audio");
			if (!(t instanceof HTMLElement)) return !1;
			let n = Zu(t);
			return n.trim() !== "" && {
				autoplay: t.hasAttribute("autoplay"),
				caption: e.querySelector("figcaption")?.textContent?.trim() ?? null,
				controls: t.hasAttribute("controls"),
				src: n,
				title: t.getAttribute("title")
			};
		}
	}, {
		tag: "audio",
		getAttrs(e) {
			if (!(e instanceof HTMLElement)) return !1;
			let t = Zu(e);
			return t.trim() !== "" && {
				autoplay: e.hasAttribute("autoplay"),
				caption: null,
				controls: e.hasAttribute("controls"),
				src: t,
				title: e.getAttribute("title")
			};
		}
	}],
	toDOM(e) {
		let t = { src: String(e.attrs.src) };
		e.attrs.autoplay === !0 && (t.autoplay = ""), e.attrs.controls === !0 && (t.controls = ""), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title);
		let n = document.createElement("audio");
		for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
		return e.attrs.controls === !0 ? ed(n, e.attrs.caption) : n;
	}
}, id = {
	attrs: { html: {} },
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	draggable: !1,
	parseDOM: [{
		tag: "*",
		priority: 10,
		getAttrs(e) {
			return !(e instanceof HTMLElement) || !e.localName.startsWith("tp-") ? !1 : { html: e.outerHTML };
		}
	}],
	toDOM(e) {
		let t = document.createElement("template");
		t.innerHTML = String(e.attrs.html);
		let n = t.content.firstElementChild;
		return n === null ? ["div", { "data-tp-prose-editor-custom-element": "" }] : n;
	}
}, ad = {
	attrs: { html: {} },
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	parseDOM: [{
		tag: "tp-icon",
		priority: 60,
		getAttrs(e) {
			return e instanceof HTMLElement && { html: e.outerHTML };
		}
	}],
	toDOM(e) {
		let t = document.createElement("template");
		return t.innerHTML = String(e.attrs.html), t.content.firstElementChild ?? ["span"];
	}
}, od = {
	attrs: {
		html: { default: "" },
		language: { default: "markdown" },
		markdown: { default: "" },
		view: { default: "both" }
	},
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	draggable: !1,
	parseDOM: [{
		tag: "[data-tp-prose-editor-markdown-block]",
		getAttrs(e) {
			return e instanceof HTMLElement && {
				html: e.innerHTML,
				language: e.getAttribute("data-language") ?? "markdown",
				markdown: e.getAttribute("data-markdown") ?? "",
				view: e.getAttribute("data-view") ?? "both"
			};
		}
	}],
	toDOM(e) {
		let t = document.createElement("div");
		return t.dataset.tpProseEditorMarkdownBlock = "", t.dataset.language = _d(e.attrs.language), t.dataset.markdown = String(e.attrs.markdown), t.dataset.view = vd(e.attrs.view), t.innerHTML = String(e.attrs.html), t;
	}
}, sd = {
	attrs: { tex: { default: "" } },
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	parseDOM: [{
		tag: "[data-tp-prose-editor-math-inline]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? e.textContent ?? "" };
		}
	}, {
		tag: "[data-mathjax-tex][data-mathjax-display=\"false\"]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? "" };
		}
	}],
	toDOM(e) {
		return ["span", {
			class: "tp-prose-editor-math-inline",
			"data-mathjax-display": "false",
			"data-mathjax-tex": String(e.attrs.tex),
			"data-tp-prose-editor-math-inline": ""
		}];
	}
}, cd = {
	attrs: { tex: { default: "" } },
	group: "block",
	atom: !0,
	isolating: !0,
	selectable: !0,
	parseDOM: [{
		tag: "[data-tp-prose-editor-math-block]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? e.textContent ?? "" };
		}
	}, {
		tag: "[data-mathjax-tex][data-mathjax-display=\"true\"]",
		getAttrs(e) {
			return e instanceof HTMLElement && { tex: e.getAttribute("data-mathjax-tex") ?? "" };
		}
	}],
	toDOM(e) {
		return ["div", {
			class: "tp-prose-editor-math-block",
			"data-mathjax-display": "true",
			"data-mathjax-tex": String(e.attrs.tex),
			"data-tp-prose-editor-math-block": ""
		}];
	}
}, ld = {
	content: "(definition_term | definition_description)+",
	group: "block",
	parseDOM: [{ tag: "dl" }],
	toDOM: () => ["dl", 0]
}, ud = {
	content: "inline*",
	defining: !0,
	parseDOM: [{ tag: "dt" }],
	toDOM: () => ["dt", 0]
}, dd = {
	content: "block+",
	defining: !0,
	parseDOM: [{ tag: "dd" }],
	toDOM: () => ["dd", 0]
}, fd = ol({
	tableGroup: "block",
	cellContent: "block+",
	cellAttributes: {}
});
fd.table = {
	...fd.table,
	attrs: { caption: { default: null } },
	parseDOM: [{
		tag: "table",
		getAttrs(e) {
			return e instanceof HTMLElement && { caption: e.querySelector(":scope > caption")?.textContent?.trim() ?? null };
		}
	}],
	toDOM(e) {
		let t = typeof e.attrs.caption == "string" ? e.attrs.caption.trim() : "";
		return t === "" ? ["table", ["tbody", 0]] : [
			"table",
			["caption", t],
			["tbody", 0]
		];
	}
};
var pd = class extends lu {
	captionElement = null;
	constructor(e, t) {
		super(e, t), this.syncCaption(e);
	}
	update(e) {
		return e.type === this.node.type ? (this.node = e, uu(e, this.colgroup, this.table, this.defaultCellMinWidth), this.syncCaption(e), !0) : !1;
	}
	syncCaption(e) {
		let t = typeof e.attrs.caption == "string" ? e.attrs.caption.trim() : "";
		if (t === "") {
			this.captionElement?.remove(), this.captionElement = null;
			return;
		}
		this.captionElement === null && (this.captionElement = document.createElement("caption"), this.table.insertBefore(this.captionElement, this.colgroup)), this.captionElement.textContent = t;
	}
}, Z = new He({
	nodes: Du.update("code_block", Gu).update("image", td).append(fd).append({
		audio: rd,
		custom_element: id,
		definition_description: dd,
		definition_list: ld,
		definition_term: ud,
		math_block: cd,
		math_inline: sd,
		markdown_block: od,
		tp_icon: ad,
		video: nd
	}),
	marks: ui.spec.marks.append({
		underline: qu,
		strikethrough: Ju,
		subscript: Yu,
		superscript: Xu
	})
}), md = "<script type=\"module\" src=\"./tp-loader.js\"><\/script>", hd = 1500;
function gd(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Q(e) {
	let t = Z.nodes[e];
	if (t === void 0) throw Error(`Missing ProseMirror node type: ${e}`);
	return t;
}
function $(e) {
	let t = Z.marks[e];
	if (t === void 0) throw Error(`Missing ProseMirror mark type: ${e}`);
	return t;
}
function _d(e) {
	return e === "asciidoc" || e === "html" || e === "restructuredtext" ? e : "markdown";
}
function vd(e) {
	return e === "source" || e === "preview" ? e : "both";
}
var yd = class a extends t {
	static styleId = "tp-prose-editor-styles";
	static nextId = 0;
	editorView = null;
	fileButtonId = "";
	fileDropdownElement = null;
	formatButtonId = "";
	formatDropdownElement = null;
	htmlButtonId = "";
	htmlDropdownElement = null;
	htmlFileInputElement = null;
	htmlMode = !1;
	htmlRenderMode = !1;
	htmlRenderedElement = null;
	htmlSourceElement = null;
	secondaryToolbarElement = null;
	imageFileInputElement = null;
	listButtonId = "";
	listDropdownElement = null;
	markdownFileInputElement = null;
	mediaButtonId = "";
	mediaDropdownElement = null;
	audioFileInputElement = null;
	searchClearButtonElement = null;
	searchControlElement = null;
	searchInputElement = null;
	surfaceElement = null;
	tableDropdownElement = null;
	toolbarElement = null;
	emojiPickerDropdownElement = null;
	iconPickerDropdownElement = null;
	symbolPickerDropdownElement = null;
	tableButtonId = "";
	typeButtonId = "";
	typeDropdownElement = null;
	videoFileInputElement = null;
	selectedTableColumns = 3;
	selectedTableRows = 3;
	internalValueUpdate = !1;
	initialHTML = "";
	srcLoadToken = 0;
	static get observedAttributes() {
		return [
			...t.observedAttributes,
			"placeholder",
			"readonly",
			"src",
			"value"
		];
	}
	get value() {
		return this.getHTML();
	}
	set value(e) {
		this.setHTML(e);
	}
	get placeholder() {
		return this.getStringAttribute("placeholder", "Type your prose...");
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get readonly() {
		return this.getBooleanAttribute("readonly");
	}
	set readonly(e) {
		this.setBooleanAttribute("readonly", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(a.styleId, Eu), this.editorView === null && (this.initialHTML = this.getAttribute("value") ?? this.innerHTML.trim(), this.render(), this.createEditor(this.initialHTML), this.src.trim() !== "" && this.loadSrcDocument());
	}
	disconnectedCallback() {
		this.editorView?.destroy(), this.editorView = null, this.fileDropdownElement = null, this.formatDropdownElement = null, this.htmlDropdownElement = null, this.htmlFileInputElement = null, this.htmlRenderedElement = null, this.htmlSourceElement = null, this.secondaryToolbarElement = null, this.listDropdownElement = null, this.markdownFileInputElement = null, this.mediaDropdownElement = null, this.emojiPickerDropdownElement = null, this.iconPickerDropdownElement = null, this.symbolPickerDropdownElement = null, this.searchClearButtonElement = null, this.searchControlElement = null, this.searchInputElement = null, this.surfaceElement = null, this.tableDropdownElement = null, this.toolbarElement = null, this.typeDropdownElement = null;
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) {
			if (e === "value" && !this.internalValueUpdate) {
				this.replaceDocument(n ?? "");
				return;
			}
			if (e === "readonly") {
				this.editorView?.setProps({ editable: () => !this.readonly });
				return;
			}
			if (e === "placeholder") {
				this.syncPlaceholder();
				return;
			}
			e === "src" && this.isConnected && this.loadSrcDocument();
		}
	}
	focus(e) {
		if (this.htmlRenderMode) {
			this.htmlRenderedElement?.focus(e);
			return;
		}
		if (e !== void 0) {
			this.editorView?.dom.focus(e);
			return;
		}
		this.editorView?.focus();
	}
	getHTML() {
		return this.htmlMode && this.htmlSourceElement !== null ? this.htmlSourceElement.value : this.htmlRenderMode && this.htmlRenderedElement !== null ? this.htmlRenderedElement.innerHTML : this.editorView === null ? this.getAttribute("value") ?? this.initialHTML : this.serializeDocument(this.editorView.state.doc);
	}
	setHTML(e) {
		this.replaceDocument(e), this.htmlSourceElement !== null && (this.htmlSourceElement.value = e), this.htmlRenderedElement !== null && (this.htmlRenderedElement.innerHTML = e), this.internalValueUpdate = !0, this.setStringAttribute("value", e), this.internalValueUpdate = !1;
	}
	insertTable(e = 3, t = 3) {
		if (this.editorView === null) return !1;
		let n = this.createTableNode(e, t);
		if (n === null) return !1;
		let r = this.editorView.state.tr.replaceSelectionWith(n).scrollIntoView();
		return this.editorView.dispatch(r), this.editorView.focus(), !0;
	}
	addTableRowAfter() {
		return this.runTableCommand(Fl);
	}
	addTableColumnAfter() {
		return this.runTableCommand(Al);
	}
	deleteTableRow() {
		return this.runTableCommand(Ll);
	}
	deleteTableColumn() {
		return this.runTableCommand(Ml);
	}
	deleteTable() {
		return this.runTableCommand(Ul);
	}
	setSearchQuery(e, t = {}) {
		if (this.editorView === null) return;
		let n = new Pc({
			...t,
			search: e
		}), r = Xc(this.editorView.state.tr, n);
		this.editorView.dispatch(r);
	}
	findNext(e) {
		return this.findSearchMatch(e, "next");
	}
	findPrevious(e) {
		return this.findSearchMatch(e, "previous");
	}
	render() {
		this.replaceChildren(), this.id.trim() === "" && (this.id = this.createToolbarId("root")), this.dataset.tpColorScope = "", this.dataset.tpThemeScope = "", this.fileButtonId === "" && (this.fileButtonId = this.createToolbarId("files")), this.typeButtonId === "" && (this.typeButtonId = this.createToolbarId("types")), this.formatButtonId === "" && (this.formatButtonId = this.createToolbarId("format")), this.listButtonId === "" && (this.listButtonId = this.createToolbarId("list")), this.tableButtonId === "" && (this.tableButtonId = this.createToolbarId("table")), this.mediaButtonId === "" && (this.mediaButtonId = this.createToolbarId("media")), this.htmlButtonId === "" && (this.htmlButtonId = this.createToolbarId("html"));
		let e = Array.from({ length: 6 }, (e, t) => Array.from({ length: 6 }, (e, n) => {
			let r = t + 1, i = n + 1;
			return `
          <button
            type="button"
            data-table-grid-cell
            data-table-rows="${String(r)}"
            data-table-columns="${String(i)}"
            aria-label="Insert ${String(r)} by ${String(i)} table"
          ></button>
        `;
		}).join("")).join(""), t = (e, t, n = "") => `
      <span data-tp-prose-editor-menu-label>
        <tp-icon${e === "" ? "" : ` name="${e}"`}${n === "" ? "" : ` library="${n}"`} aria-hidden="true"></tp-icon>
        <span>${t}</span>
      </span>
    `, n = (e, n, r = "", i = "") => `<li${r === "" ? "" : ` ${r}`}>${t(e, n, i)}</li>`, r = Array.from({ length: 6 }, (e, t) => t + 1).map((e) => `
        <li data-menu-command="format-header-${String(e)}" title="Heading ${String(e)}">
          <tp-icon name="format-header-${String(e)}" label="Heading ${String(e)}"></tp-icon>
        </li>
      `).join(""), i = document.createElement("tp-toolbar");
		i.dataset.tpProseEditorToolbar = "", i.setAttribute("placement", "top"), i.innerHTML = `
      <tp-icon-button section="start" id="${this.fileButtonId}" name="file" label="Files" data-command="files" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-file-dropdown anchor="#${this.fileButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-file-menu>
          <ul>
            ${n("file-download", "Load HTML", "data-file-action=\"load-html\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("file-import", "Import Markdown", "data-file-action=\"import-markdown\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("file-upload", "Save HTML", "data-file-action=\"save-html\"")}
            ${n("file-upload-as", "Save HTML as", "data-file-action=\"save-html-as\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <input section="start" type="file" accept=".html,.htm,text/html" data-tp-prose-editor-html-file hidden />
      <input section="start" type="file" accept=".md,.markdown,text/markdown,text/plain" data-tp-prose-editor-markdown-file hidden />
      <input section="start" type="file" accept="image/*" data-tp-prose-editor-image-file hidden />
      <input section="start" type="file" accept="video/*" data-tp-prose-editor-video-file hidden />
      <input section="start" type="file" accept="audio/*" data-tp-prose-editor-audio-file hidden />
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.typeButtonId}" name="format-title" label="Types" data-command="types" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-type-dropdown anchor="#${this.typeButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="type">
          <ul>
            ${n("paragraph", "Paragraph", "data-menu-command=\"format-text\"")}
            ${n("format-quote-open", "Blockquote", "data-menu-command=\"format-quote-open\"")}
            <li>${t("format-heading-hash", "Headings")}<ul data-tp-prose-editor-horizontal-submenu>${r}</ul></li>
            ${n("code-block", "Code block", "data-menu-command=\"format-code-block\"")}
            ${n("function-block", "Math block", "data-menu-command=\"insert-math-block\"")}
            <li>${t("text-block", "Markup block")}
              <ul>
                ${n("file_type_asciidoc", "AsciiDoc", "data-menu-command=\"insert-markup-asciidoc\"", "languages")}
                ${n("file_type_html", "HTML", "data-menu-command=\"insert-markup-html\"", "languages")}
                ${n("file_type_markdown", "Markdown", "data-menu-command=\"insert-markup-markdown\"", "languages")}
                ${n("file_type_restructuredtext", "reStructuredText", "data-menu-command=\"insert-markup-restructuredtext\"", "languages")}
              </ul>
            </li>
            ${n("horizontal-line", "Horizontal rule", "data-menu-command=\"insert-horizontal-rule\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.formatButtonId}" name="letter-f" label="Format" data-command="format" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-format-dropdown anchor="#${this.formatButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="format">
          <ul>
            ${n("format-bold", "Bold", "data-menu-command=\"format-bold\"")}
            ${n("format-italic", "Italic", "data-menu-command=\"format-italic\"")}
            ${n("format-underline", "Underline", "data-menu-command=\"format-underline\"")}
            ${n("format-strikethrough", "Strikethrough", "data-menu-command=\"format-strikethrough\"")}
            ${n("format-subscript", "Subscript", "data-menu-command=\"format-subscript\"")}
            ${n("format-superscript", "Superscript", "data-menu-command=\"format-superscript\"")}
            ${n("format-code", "Code", "data-menu-command=\"format-code\"")}
            ${n("function", "Math", "data-menu-command=\"format-math\"")}
            ${n("link", "Link", "data-menu-command=\"link\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.listButtonId}" name="list-down" label="List" data-command="list" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-list-dropdown anchor="#${this.listButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="list">
          <ul>
            ${n("format-list-bulleted", "Unordered list", "data-menu-command=\"format-list-bulleted\"")}
            ${n("format-list-numbered", "Ordered list", "data-menu-command=\"format-list-numbered\"")}
            ${n("format-list-text", "Definition list", "data-menu-command=\"format-list-text\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.tableButtonId}" name="table" label="Table" data-command="insert-table" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-table-dropdown anchor="#${this.tableButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-table-menu>
          <ul>
            <li data-table-picker>
              ${t("table-settings", "Insert table")}
              <ul data-tp-prose-editor-table-picker-submenu>
                <li data-table-picker-content>
                  <div data-tp-prose-editor-table-picker>
                    <output data-tp-prose-editor-table-picker-size>${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}</output>
                    <div data-tp-prose-editor-table-picker-grid role="grid" aria-label="Table size">
                      ${e}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            ${n("text-short", "Add caption", "data-table-action=\"add-caption\"")}
            ${n("table-row-plus-after", "Insert row", "data-table-action=\"add-row\"")}
            ${n("table-column-plus-after", "Insert column", "data-table-action=\"add-column\"")}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${n("table-row-remove", "Delete row", "data-table-action=\"delete-row\"")}
            ${n("table-column-remove", "Delete column", "data-table-action=\"delete-column\"")}
            ${n("table-remove", "Delete table", "data-table-action=\"delete-table\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.mediaButtonId}" name="multimedia" label="Medias" data-command="media" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-media-dropdown anchor="#${this.mediaButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="media">
          <ul>
            ${n("image-plus", "Image", "data-menu-command=\"insert-image\"")}
            ${n("video-plus", "Video", "data-menu-command=\"insert-video\"")}
            ${n("music-note-plus", "Audio", "data-menu-command=\"insert-audio\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-emoji-picker-button" name="emoticon-happy-outline" label="Emoji" data-command="emoji-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-emoji-picker-dropdown anchor="#${this.id}-emoji-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-emoji-picker compact filter="face"></tp-emoji-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-icon-picker-button" name="shapes" label="Icon" data-command="icon-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-icon-picker-dropdown anchor="#${this.id}-icon-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-icon-picker compact copy="tp-icon"></tp-icon-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-symbol-picker-button" name="symbol" label="Symbol" data-command="symbol-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-symbol-picker-dropdown anchor="#${this.id}-symbol-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-symbol-picker compact></tp-symbol-picker>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="start" aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="select-all" label="Select all" data-command="select-all"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="format-clear"></tp-icon-button>
      <tp-icon-button section="center" id="${this.htmlButtonId}" name="language-html" label="HTML" data-command="html" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="center" data-tp-prose-editor-html-dropdown anchor="#${this.htmlButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="html">
          <ul>
            ${n("application-edit-outline", "Editor", "data-html-action=\"editor\"")}
            ${n("cellphone-screenshot", "Rendered HTML", "data-html-action=\"render\"")}
            ${n("code", "HTML code", "data-html-action=\"code\"")}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="end" aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-prose-editor-search-control hidden>
        <input type="search" data-tp-prose-editor-search-input hidden aria-label="Search text" />
        <tp-icon-button name="close" size="xs" label="Clear search" data-tp-prose-editor-search-clear></tp-icon-button>
      </span>
      <tp-icon-button section="end" name="dots-vertical" label="More formatting tools" data-command="more" aria-pressed="false"></tp-icon-button>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}"></tp-theme>
    `;
		let a = document.createElement("tp-toolbar");
		a.dataset.tpProseEditorSecondaryToolbar = "", a.setAttribute("placement", "top"), a.hidden = !0, a.innerHTML = "\n      <tp-icon-button section=\"start\" name=\"paragraph\" label=\"Paragraph\" data-command=\"format-text\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-quote-open\" label=\"Blockquote\" data-command=\"format-quote-open\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-1\" label=\"Heading 1\" data-command=\"format-header-1\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-2\" label=\"Heading 2\" data-command=\"format-header-2\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"format-header-3\" label=\"Heading 3\" data-command=\"format-header-3\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"code-block\" label=\"Code block\" data-command=\"format-code-block\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"function-block\" label=\"Math block\" data-command=\"insert-math-block\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"text-block\" label=\"Markdown block\" data-command=\"insert-markup-markdown\"></tp-icon-button>\n      <tp-icon-button section=\"start\" name=\"horizontal-line\" label=\"Horizontal rule\" data-command=\"insert-horizontal-rule\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary=\"start\" aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"center\" name=\"format-list-bulleted\" label=\"Unordered list\" data-command=\"format-list-bulleted\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"format-list-numbered\" label=\"Ordered list\" data-command=\"format-list-numbered\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"format-list-text\" label=\"Definition list\" data-command=\"format-list-text\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"center\" name=\"image-plus\" label=\"Image\" data-command=\"insert-image\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"video-plus\" label=\"Video\" data-command=\"insert-video\"></tp-icon-button>\n      <tp-icon-button section=\"center\" name=\"music-note-plus\" label=\"Audio\" data-command=\"insert-audio\"></tp-icon-button>\n      <span section=\"center\" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary=\"end\" aria-hidden=\"true\"></span>\n      <tp-icon-button section=\"end\" name=\"format-bold\" label=\"Bold\" data-command=\"format-bold\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-italic\" label=\"Italic\" data-command=\"format-italic\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-underline\" label=\"Underline\" data-command=\"format-underline\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-strikethrough\" label=\"Strikethrough\" data-command=\"format-strikethrough\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-subscript\" label=\"Subscript\" data-command=\"format-subscript\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-superscript\" label=\"Superscript\" data-command=\"format-superscript\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"format-code\" label=\"Code\" data-command=\"format-code\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"function\" label=\"Math\" data-command=\"format-math\"></tp-icon-button>\n      <tp-icon-button section=\"end\" name=\"link\" label=\"Link\" data-command=\"link\"></tp-icon-button>\n    ", i.addEventListener("mousedown", this.handleToolbarMouseDown), a.addEventListener("mousedown", this.handleToolbarMouseDown), i.addEventListener("click", this.handleToolbarClick), a.addEventListener("click", this.handleToolbarClick), i.addEventListener("tp-menu-item-select", this.handleMenuItemSelect), a.addEventListener("tp-menu-item-select", this.handleMenuItemSelect);
		let o = [...i.querySelectorAll("[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]"), ...a.querySelectorAll("[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]")];
		for (let e of o) e.addEventListener("keydown", this.handleGenericMenuKeydown);
		let s = i.querySelector("[data-tp-prose-editor-search-input]");
		s?.addEventListener("input", this.handleSearchInput), s?.addEventListener("keydown", this.handleSearchInputKeydown);
		let c = i.querySelector("[data-tp-prose-editor-search-control]"), l = i.querySelector("[data-tp-prose-editor-search-clear]");
		l?.addEventListener("click", this.handleSearchClearClick);
		let u = i.querySelector("[data-tp-prose-editor-file-dropdown]");
		u?.addEventListener("tp-dropdown-toggle", this.handleFileDropdownToggle);
		let d = i.querySelector("[data-tp-prose-editor-type-dropdown]");
		d?.addEventListener("tp-dropdown-toggle", this.handleTypeDropdownToggle);
		let f = i.querySelector("[data-tp-prose-editor-format-dropdown]");
		f?.addEventListener("tp-dropdown-toggle", this.handleFormatDropdownToggle);
		let p = i.querySelector("[data-tp-prose-editor-html-dropdown]");
		p?.addEventListener("tp-dropdown-toggle", this.handleHTMLDropdownToggle);
		let m = i.querySelector("[data-tp-prose-editor-list-dropdown]");
		m?.addEventListener("tp-dropdown-toggle", this.handleListDropdownToggle);
		let h = i.querySelector("[data-tp-prose-editor-table-dropdown]"), g = i.querySelector("[data-tp-prose-editor-table-menu]");
		g?.addEventListener("keydown", this.handleTableMenuKeydown), g?.addEventListener("pointerover", this.handleTablePickerPointerOver), g?.addEventListener("click", this.handleTablePickerClick, { capture: !0 }), h?.addEventListener("tp-dropdown-toggle", this.handleTableDropdownToggle);
		let _ = i.querySelector("[data-tp-prose-editor-media-dropdown]");
		_?.addEventListener("tp-dropdown-toggle", this.handleMediaDropdownToggle);
		let v = i.querySelector("[data-tp-prose-editor-emoji-picker-dropdown]"), y = i.querySelector("[data-tp-prose-editor-icon-picker-dropdown]"), b = i.querySelector("[data-tp-prose-editor-symbol-picker-dropdown]");
		v?.querySelector("tp-emoji-picker")?.addEventListener("tp-emoji-picker-select", this.handleEmojiPickerSelect), y?.querySelector("tp-icon-picker")?.addEventListener("tp-icon-picker-select", this.handleIconPickerSelect), b?.querySelector("tp-symbol-picker")?.addEventListener("tp-symbol-picker-select", this.handleSymbolPickerSelect);
		let x = i.querySelector("[data-tp-prose-editor-html-file]");
		x?.addEventListener("change", this.handleHtmlFileChange);
		let S = i.querySelector("[data-tp-prose-editor-markdown-file]");
		S?.addEventListener("change", this.handleMarkdownFileChange);
		let ee = i.querySelector("[data-tp-prose-editor-image-file]");
		ee?.addEventListener("change", this.handleImageFileChange);
		let te = i.querySelector("[data-tp-prose-editor-video-file]");
		te?.addEventListener("change", this.handleVideoFileChange);
		let ne = i.querySelector("[data-tp-prose-editor-audio-file]");
		ne?.addEventListener("change", this.handleAudioFileChange);
		let re = document.createElement("div");
		re.dataset.tpProseEditorSurface = "";
		let C = document.createElement("textarea");
		C.dataset.tpProseEditorHtmlSource = "", C.placeholder = this.placeholder, C.hidden = !0, C.spellcheck = !1, C.addEventListener("input", this.handleHtmlSourceInput);
		let ie = document.createElement("div");
		ie.dataset.tpProseEditorHtmlRendered = "", ie.hidden = !0, ie.tabIndex = -1, this.toolbarElement = i, this.fileDropdownElement = u, this.formatDropdownElement = f, this.htmlDropdownElement = p, this.htmlFileInputElement = x, this.imageFileInputElement = ee, this.listDropdownElement = m, this.markdownFileInputElement = S, this.mediaDropdownElement = _, this.emojiPickerDropdownElement = v, this.iconPickerDropdownElement = y, this.symbolPickerDropdownElement = b, this.audioFileInputElement = ne, this.searchClearButtonElement = l, this.searchControlElement = c, this.searchInputElement = s, this.secondaryToolbarElement = a, this.surfaceElement = re, this.tableDropdownElement = h, this.htmlRenderedElement = ie, this.htmlSourceElement = C, this.typeDropdownElement = d, this.videoFileInputElement = te, this.append(i, a, re, C, ie);
	}
	createToolbarId(e) {
		return a.nextId += 1, `tp-prose-editor-${e}-${String(a.nextId)}`;
	}
	createEditor(e) {
		if (this.surfaceElement === null) return;
		let t = new Ec(this.surfaceElement, {
			state: Bn.create({
				doc: this.parseHTML(e),
				plugins: [
					Wr(),
					Yc(),
					du({ View: pd }),
					Tu(),
					$r({
						"Mod-b": j($("strong")),
						"Mod-i": j($("em")),
						"Mod-`": j($("code")),
						"Mod-z": Kr,
						"Mod-y": qr,
						"Shift-Mod-z": qr,
						Enter: yr(this.exitDefinitionListPlaceholder, this.insertDefinitionPairAfterDescription, Si(Q("list_item"))),
						Tab: Hl(1),
						"Shift-Tab": Hl(-1)
					}),
					$r(wr)
				]
			}),
			dispatchTransaction: (e) => {
				let n = t.state.apply(e);
				if (this.requiresTrailingEditableBlock(n.doc.lastChild)) {
					let e = Q("paragraph").createAndFill();
					if (e !== null) {
						let t = n.tr.insert(n.doc.content.size, e).setMeta("addToHistory", !1);
						n = n.apply(t);
					}
				}
				t.updateState(n), this.syncPlaceholder(t), e.docChanged && this.dispatchInputEvent(), this.updateToolbarState();
			},
			editable: () => !this.readonly,
			nodeViews: {
				audio: (e) => this.createAudioNodeView(e),
				code_block: (e, t, n) => this.createCodeBlockNodeView(e, t, n),
				custom_element: (e) => this.createCustomElementNodeView(e),
				markdown_block: (e, t, n) => this.createMarkdownBlockNodeView(e, t, n),
				math_block: (e, t, n) => this.createMathNodeView(e, t, n, !0),
				math_inline: (e, t, n) => this.createMathNodeView(e, t, n, !1)
			}
		});
		t.dom.setAttribute("aria-label", "Rich text editor"), t.dom.setAttribute("role", "textbox"), t.dom.setAttribute("aria-multiline", "true"), this.editorView = t, this.syncPlaceholder(t), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	replaceDocument(e) {
		if (this.editorView === null) {
			this.initialHTML = e;
			return;
		}
		let t = Bn.create({
			doc: this.parseHTML(e),
			plugins: this.editorView.state.plugins
		});
		this.editorView.updateState(t), this.syncPlaceholder(), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	syncPlaceholder(e = this.editorView) {
		if (this.htmlSourceElement !== null && (this.htmlSourceElement.placeholder = this.placeholder), e === null) return;
		e.dom.dataset.placeholder = this.placeholder;
		let t = e.state.doc, n = t.childCount === 1 && t.firstChild?.isTextblock === !0 && t.firstChild.content.size === 0;
		e.dom.toggleAttribute("data-tp-prose-editor-empty", n);
	}
	insertHTMLWithHistory(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		if (this.editorView === null) {
			this.setHTML(e);
			return;
		}
		let t = this.parseHTML(e), n = this.editorView.state.tr.replaceSelection(new S(t.content, 0, 0));
		this.editorView.dispatch(n), this.htmlSourceElement !== null && (this.htmlSourceElement.value = this.serializeDocument(n.doc)), this.updateToolbarState(), this.loadRenderedTpComponents(), this.editorView.focus();
	}
	async loadSrcDocument() {
		let e = this.src.trim(), t = ++this.srcLoadToken;
		if (e !== "") try {
			let n = this.resolveSourceUrl(e), r = await fetch(n.href, { cache: "no-store" });
			if (!r.ok) throw Error(`Unable to load ${n.pathname} (${String(r.status)})`);
			let i = await r.text();
			if (t !== this.srcLoadToken || !this.isConnected) return;
			if (this.isMarkdownSource(n)) {
				await this.replaceDocumentWithMarkdownSource(i, n);
				return;
			}
			this.setHTML(await this.renderSourceDocument(i, n));
		} catch (e) {
			if (t !== this.srcLoadToken || !this.isConnected) return;
			let n = e instanceof Error ? e.message : String(e);
			this.setHTML(`<pre><code>${gd(n)}</code></pre>`);
		}
	}
	async renderSourceDocument(e, t) {
		let n = this.getSourceExtension(t);
		return n === "html" || n === "htm" ? e : `<pre><code>${gd(e)}</code></pre>`;
	}
	async replaceDocumentWithMarkdownSource(e, t) {
		let n = document.createElement("div");
		await s(e, n, t.pathname);
		let r = this.serializeRenderedElement(n), i = Q("markdown_block").create({
			html: r,
			markdown: e,
			view: "preview"
		}), a = this.ensureTrailingEditableBlock(Z.topNodeType.create(null, [i]));
		this.replaceDocumentNode(a), this.syncHTMLSurfaces(r), this.internalValueUpdate = !0, this.setStringAttribute("value", r), this.internalValueUpdate = !1, this.dispatchInputEvent();
	}
	serializeRenderedElement(e) {
		return this.syncFormControlAttributes(e), e.innerHTML;
	}
	async renderMarkupInto(e, t, n) {
		if (t === "html") {
			n.innerHTML = e;
			return;
		}
		if (t === "asciidoc") {
			await i(e, n);
			return;
		}
		if (t === "restructuredtext") {
			await l(e, n);
			return;
		}
		await s(e, n, "/tp-prose-editor-markup-block.md");
	}
	syncFormControlAttributes(e) {
		for (let t of e.querySelectorAll("input")) t.type === "checkbox" || t.type === "radio" ? t.toggleAttribute("checked", t.checked) : t.setAttribute("value", t.value);
		for (let t of e.querySelectorAll("textarea")) t.textContent = t.value;
		for (let t of e.querySelectorAll("select")) for (let e of t.options) e.toggleAttribute("selected", e.selected);
	}
	replaceDocumentNode(e) {
		if (this.editorView === null) return;
		let t = Bn.create({
			doc: e,
			plugins: this.editorView.state.plugins
		});
		this.editorView.updateState(t), this.updateToolbarState(), this.loadRenderedTpComponents();
	}
	syncHTMLSurfaces(e) {
		this.htmlSourceElement !== null && (this.htmlSourceElement.value = e), this.htmlRenderedElement !== null && (this.htmlRenderedElement.innerHTML = e);
	}
	isMarkdownSource(e) {
		let t = this.getSourceExtension(e);
		return t === "md" || t === "markdown";
	}
	getSourceExtension(e) {
		let t = e.pathname.split("/").pop() ?? "", n = t.lastIndexOf(".");
		return n < 0 ? "" : t.slice(n + 1).toLowerCase();
	}
	resolveSourceUrl(e) {
		return r(this, e);
	}
	parseHTML(e) {
		let t = document.createElement("div");
		return t.innerHTML = e.trim() === "" ? "<p></p>" : e, this.ensureTrailingEditableBlock(Ke.fromSchema(Z).parse(t));
	}
	serializeDocument(e, t = {}) {
		let n = document.createElement("div"), r = Array.from(this.iterateChildNodes(e));
		for (let [e, i] of r.entries()) if (!this.shouldSkipTrailingEditableBlock(r, e) && !this.shouldSkipEmptyParagraphBeforeMedia(r, e)) {
			if (i.type === Q("markdown_block")) {
				let e = document.createElement("template");
				e.innerHTML = String(i.attrs.html), n.append(e.content.cloneNode(!0));
				continue;
			}
			if (t.renderComponents === !0 && i.type === Q("code_block")) {
				n.append(this.serializeCodeBlockAsComponent(i));
				continue;
			}
			n.append(ot.fromSchema(Z).serializeNode(i));
		}
		for (let e of n.querySelectorAll("tp-icon")) {
			let t = e.nextSibling;
			t instanceof Text && t.data.startsWith(Ou) && (t.data = t.data.slice(1), t.data === "" && t.remove());
		}
		return n.innerHTML;
	}
	serializeCodeBlockAsComponent(e) {
		let t = document.createElement("tp-code-editor"), n = document.createElement("script"), r = Pu(e.attrs.language), i = typeof e.attrs.src == "string" ? e.attrs.src.trim() : "";
		return t.setAttribute("language", r), t.setAttribute("line-numbers", ""), t.setAttribute("word-wrap", ""), Bu(t, e.attrs.theme, e.attrs.color), t.addEventListener("tp-code-editor-ready", () => {
			Uu(t, e.attrs.theme), Bu(t, e.attrs.theme, e.attrs.color);
		}, { once: !0 }), i !== "" && (t.setAttribute("filename", i), Wu(i) && t.setAttribute("src", i), n.setAttribute("filename", i)), n.type = `tp/${r}`, n.textContent = e.textContent, t.append(n), t;
	}
	ensureTrailingEditableBlock(e) {
		if (!this.requiresTrailingEditableBlock(e.lastChild)) return e;
		let t = Q("paragraph").createAndFill();
		return t === null ? e : e.copy(e.content.append(g.from(t)));
	}
	shouldSkipTrailingEditableBlock(e, t) {
		if (t !== e.length - 1) return !1;
		let n = e[t], r = e[t - 1];
		return n !== void 0 && r !== void 0 && this.isEmptyParagraph(n) && this.requiresTrailingEditableBlock(r);
	}
	shouldSkipEmptyParagraphBeforeMedia(e, t) {
		let n = e[t], r = e[t + 1];
		return n !== void 0 && r !== void 0 && this.isEmptyParagraph(n) && (r.type === Q("image") || r.type === Q("video"));
	}
	isEmptyParagraph(e) {
		return e.type === Q("paragraph") && e.content.size === 0;
	}
	requiresTrailingEditableBlock(e) {
		return e === null ? !1 : e.type === Q("bullet_list") || e.type === Q("definition_list") || e.type === Q("ordered_list") || e.type === Q("table") || e.type === Q("code_block") || e.type === Q("custom_element") || e.type === Q("markdown_block") || e.type === Q("math_block") || e.type === Q("image") || e.type === Q("video") || e.type === Q("audio");
	}
	*iterateChildNodes(e) {
		for (let t = 0; t < e.childCount; t += 1) yield e.child(t);
	}
	loadRenderedTpComponents() {
		this.surfaceElement !== null && n(this.surfaceElement).catch((e) => {
			console.error("Unable to load tp components in prose editor", e);
		});
	}
	loadRenderedHTMLComponents() {
		this.htmlRenderedElement !== null && this.refreshRenderedHTML(this.htmlRenderedElement);
	}
	async refreshRenderedHTML(e) {
		try {
			await n(e), await this.waitForRenderedMarkdownElements(e), await c(e, "/tp-prose-editor-html-render.md"), await this.renderMathElements(e);
		} catch (e) {
			console.error("Unable to refresh prose editor HTML render", e);
		}
	}
	async waitForRenderedMarkdownElements(e) {
		let t = e.querySelectorAll("tp-markdown");
		await Promise.all(Array.from(t, (e) => this.waitForRenderedMarkdownElement(e)));
	}
	waitForRenderedMarkdownElement(e) {
		return e.hasAttribute("data-tp-markdown-rendered") ? Promise.resolve() : new Promise((t) => {
			let n = window.setTimeout(() => {
				e.removeEventListener("tp-markdown-rendered", r), t();
			}, hd), r = () => {
				window.clearTimeout(n), t();
			};
			e.addEventListener("tp-markdown-rendered", r, { once: !0 });
		});
	}
	async ensureMathJax() {
		let e = window;
		return typeof e.MathJax?.tex2svgPromise == "function" ? (await e.MathJax.startup?.promise, e.MathJax) : Au === null ? (Au = new Promise((t, n) => {
			e.MathJax = {
				...e.MathJax,
				loader: { load: ["input/tex", "output/svg"] },
				tex: { packages: { "[+]": [] } },
				svg: { fontCache: "local" },
				startup: { typeset: !1 }
			};
			let r = document.createElement("script");
			r.async = !0, r.src = ku, r.addEventListener("load", () => {
				Promise.resolve(e.MathJax?.startup?.promise).then(() => {
					t();
				});
			}, { once: !0 }), r.addEventListener("error", () => {
				n(/* @__PURE__ */ Error("Unable to load MathJax"));
			}, { once: !0 }), document.head.append(r);
		}).catch((e) => {
			throw Au = null, e;
		}), await Au, e.MathJax ?? {}) : (await Au, e.MathJax ?? {});
	}
	async renderMathElements(e) {
		let t = e.querySelectorAll("[data-mathjax-tex]");
		for (let e of t) await this.renderMathElement(e);
	}
	async renderMathElement(e) {
		let t = e.getAttribute("data-mathjax-tex") ?? "";
		if (t.trim() === "") {
			e.textContent = "";
			return;
		}
		e.textContent = e.getAttribute("data-mathjax-display") === "true" ? `$$${t}$$` : `$${t}$`;
		try {
			let n = await this.ensureMathJax();
			if (typeof n.tex2svgPromise != "function") return;
			let r = await n.tex2svgPromise(t, { display: e.getAttribute("data-mathjax-display") === "true" });
			e.replaceChildren(r), e.setAttribute("data-mathjax-rendered", "true");
		} catch (e) {
			console.warn("Unable to render MathJax formula", e);
		}
	}
	createMathNodeView(e, t, n, r) {
		let i = e, a = document.createElement(r ? "div" : "span");
		a.className = r ? "tp-prose-editor-math-block" : "tp-prose-editor-math-inline", a.toggleAttribute("data-tp-prose-editor-math-block", r), a.toggleAttribute("data-tp-prose-editor-math-inline", !r), a.setAttribute("data-mathjax-display", String(r)), a.contentEditable = "false";
		let o = () => {
			a.setAttribute("data-mathjax-tex", String(i.attrs.tex)), this.renderMathElement(a);
		}, s = () => {
			if (this.readonly || typeof n != "function") return;
			let e = n();
			if (typeof e != "number") return;
			let r = window.prompt("Math", String(i.attrs.tex));
			r !== null && t.dispatch(t.state.tr.setNodeMarkup(e, void 0, { tex: r }));
		};
		return a.addEventListener("dblclick", s), o(), {
			dom: a,
			stopEvent: (e) => e.type === "dblclick",
			ignoreMutation: () => !0,
			update: (e) => e.type === i.type ? (i = e, o(), !0) : !1,
			destroy: () => {
				a.removeEventListener("dblclick", s);
			}
		};
	}
	createCodeBlockNodeView(t, n, r) {
		let i = t, a = document.createElement("div"), o = document.createElement("div"), s = this.createToolbarId("code-file"), c = this.createToolbarId("code-language"), l = document.createElement("tp-code-editor"), u = document.createElement("input"), d = ju.map((e) => `<li data-code-language="${e}">${e}</li>`).join("");
		a.dataset.tpProseEditorCodeBlockEditor = "", o.dataset.tpProseEditorCodeBlockToolbar = "", o.innerHTML = `
      <tp-icon-button id="${s}" name="file" label="Code file" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-file-dropdown anchor="#${s}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>
            <li data-code-file-action="load"><span data-tp-prose-editor-menu-label><tp-icon name="file-download" aria-hidden="true"></tp-icon><span>Load</span></span></li>
            <li data-code-file-action="save"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload" aria-hidden="true"></tp-icon><span>Save</span></span></li>
            <li data-code-file-action="save-as"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload-as" aria-hidden="true"></tp-icon><span>Save as</span></span></li>
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button id="${c}" name="code" label="Code language" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-language-dropdown anchor="#${c}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>${d}</ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button data-tp-prose-editor-code-toolbar name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)"></tp-icon-button>
    `, l.dataset.tpProseEditorCodeBlock = "", l.setAttribute("line-numbers", ""), l.setAttribute("word-wrap", ""), l.readonly = this.readonly, u.type = "file", u.hidden = !0, u.dataset.tpProseEditorCodeFile = "", a.append(o, u, l);
		let f = o.querySelector(`#${s}`), p = o.querySelector(`#${c}`), m = o.querySelector("[data-tp-prose-editor-code-toolbar]"), h = o.querySelector("[data-tp-prose-editor-code-file-dropdown]"), _ = o.querySelector("[data-tp-prose-editor-code-language-dropdown]"), v = () => {
			let e = Pu(i.attrs.language), t = typeof i.attrs.src == "string" ? i.attrs.src.trim() : "";
			l.setAttribute("language", e), Uu(l, i.attrs.theme), Bu(l, i.attrs.theme, i.attrs.color), t === "" ? (l.removeAttribute("src"), l.removeAttribute("filename")) : Wu(t) ? (l.setAttribute("src", t), l.removeAttribute("filename")) : (l.removeAttribute("src"), l.setAttribute("filename", t));
			for (let t of o.querySelectorAll("[data-code-language]")) t.toggleAttribute("data-selected", t.dataset.codeLanguage === e), t.dataset.codeLanguage === e ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current");
		}, y = (e = i.attrs, t = l.getValue()) => {
			if (typeof r != "function") return;
			let a = r();
			if (typeof a != "number") return;
			let o = n.state.tr.setNodeMarkup(a, void 0, e);
			if (t !== i.textContent) {
				let e = t === "" ? g.empty : g.from(Z.text(t));
				o = o.replaceWith(a + 1, a + i.nodeSize - 1, e);
			}
			n.dispatch(o);
		}, b = new MutationObserver(() => {
			let e = Ru([l]), t = zu([l]), n = Fu(i.attrs.theme), r = Hu(l);
			e !== null && r === "auto" && (l.classList.remove(...Mu), n !== null && l.classList.add(n), e = n), !(e === n && t === Iu(i.attrs.color)) && y({
				...i.attrs,
				theme: e,
				color: t
			});
		});
		b.observe(l, {
			attributeFilter: ["class"],
			attributes: !0
		});
		let x = (e) => {
			l.getValue() !== e && l.setValue(e);
		};
		x(t.textContent), v();
		let S = () => {
			l.getValue() !== i.textContent && y(i.attrs, l.getValue());
		}, ee = async () => {
			let t = u.files?.[0];
			if (t === void 0) return;
			let n = await t.text(), r = Pu(e(t.name));
			y({
				...i.attrs,
				language: r,
				src: t.name
			}, n), x(n), l.setAttribute("language", r), l.removeAttribute("src"), l.setAttribute("filename", t.name), u.value = "";
		}, te = () => {
			ee();
		}, ne = (e) => {
			let t = typeof i.attrs.src == "string" ? i.attrs.src.trim() : "", n = e ?? (t.split("/").pop() || `code.${Pu(i.attrs.language)}`);
			this.downloadTextFile(n, l.getValue(), "text/plain;charset=utf-8");
		}, re = () => {
			let e = (typeof i.attrs.src == "string" ? i.attrs.src.trim() : "").split("/").pop() || `code.${Pu(i.attrs.language)}`;
			this.saveTextFileAs(e, l.getValue(), "text/plain;charset=utf-8");
		}, C = (e) => {
			let t = e.detail?.item, n = t?.dataset.codeFileAction;
			n === "load" ? (u.value = "", u.click()) : n === "save" ? ne() : n === "save-as" && re(), t?.closest("tp-dropdown")?.hide();
		}, ie = (e) => {
			let t = e.detail?.item, n = t?.dataset.codeLanguage;
			n !== void 0 && (y({
				...i.attrs,
				language: n,
				src: i.attrs.src
			}, l.getValue()), t?.closest("tp-dropdown")?.hide());
		}, ae = () => {
			S();
		}, oe = () => {
			v();
		}, se = () => {
			f?.setAttribute("aria-expanded", String(h?.open === !0)), p?.setAttribute("aria-expanded", String(_?.open === !0));
		}, ce = (e, t, n) => {
			e.preventDefault(), e.stopPropagation(), t !== null && (n?.hide(), t.toggle(), se(), t.open ? t.querySelector("li[role=\"menuitem\"], li, button, input")?.focus() : l.focus());
		}, le = (e) => {
			ce(e, h, _);
		}, ue = (e) => {
			ce(e, _, h);
		}, de = () => {
			se();
		}, fe = () => {
			l.toolbar = !l.toolbar, m?.setAttribute("aria-pressed", String(l.toolbar));
		};
		return l.addEventListener("tp-code-editor-input", S), l.addEventListener("tp-code-editor-load", ae), l.addEventListener("tp-code-editor-ready", oe), u.addEventListener("change", te), f?.addEventListener("click", le), p?.addEventListener("click", ue), m?.addEventListener("click", fe), h?.addEventListener("tp-dropdown-toggle", de), _?.addEventListener("tp-dropdown-toggle", de), h?.addEventListener("tp-menu-item-select", C), _?.addEventListener("tp-menu-item-select", ie), {
			dom: a,
			stopEvent: () => !0,
			ignoreMutation: () => !0,
			update: (e) => {
				if (e.type !== i.type) return !1;
				i = e;
				let t = e.textContent;
				return x(t), v(), l.readonly = this.readonly, !0;
			},
			destroy: () => {
				b.disconnect(), l.removeEventListener("tp-code-editor-input", S), l.removeEventListener("tp-code-editor-load", ae), l.removeEventListener("tp-code-editor-ready", oe), u.removeEventListener("change", te), f?.removeEventListener("click", le), p?.removeEventListener("click", ue), m?.removeEventListener("click", fe), h?.removeEventListener("tp-dropdown-toggle", de), _?.removeEventListener("tp-dropdown-toggle", de), h?.removeEventListener("tp-menu-item-select", C), _?.removeEventListener("tp-menu-item-select", ie);
			}
		};
	}
	createMarkdownBlockNodeView(e, t, n) {
		let r = e, i = document.createElement("div"), a = document.createElement("div"), o = document.createElement("div"), s = document.createElement("tp-code-editor"), c = document.createElement("div"), l = 0, u = vd(e.attrs.view), d = _d(e.attrs.language), f = d === "restructuredtext" ? "reStructuredText" : d === "asciidoc" ? "AsciiDoc" : d === "html" ? "HTML" : "Markdown";
		i.dataset.tpProseEditorMarkdownBlockEditor = "", a.dataset.tpProseEditorMarkdownBlockHeader = "", o.dataset.tpProseEditorMarkdownBlockModes = "", o.setAttribute("role", "group"), o.setAttribute("aria-label", `${f} block display`);
		let p = [
			[
				"both",
				"splitscreen",
				`${f} + HTML`
			],
			[
				"source",
				"splitscreen-top",
				f
			],
			[
				"preview",
				"splitscreen-bottom",
				"HTML"
			]
		];
		for (let [e, t, n] of p) {
			let r = document.createElement("tp-icon-button");
			r.setAttribute("type", "button"), r.setAttribute("name", t), r.setAttribute("label", n), r.dataset.markdownView = e, o.append(r);
		}
		let m = document.createElement("tp-icon-button");
		m.setAttribute("name", "keyboard-f1"), m.setAttribute("label", "Toggle editor toolbar"), m.setAttribute("title", "Toggle editor toolbar (F1)"), m.dataset.tpProseEditorMarkupToolbar = "", o.append(m), a.append(o), s.dataset.tpProseEditorMarkdownSource = "", s.setAttribute("language", d), s.setAttribute("line-numbers", ""), s.setAttribute("word-wrap", ""), s.readonly = this.readonly, s.setValue(String(e.attrs.markdown)), c.dataset.tpProseEditorMarkdownPreview = "", c.innerHTML = String(e.attrs.html), i.append(a, s, c);
		let h = (e) => {
			if (typeof n != "function") return;
			let i = n();
			typeof i == "number" && (r.attrs.markdown === e.markdown && r.attrs.html === e.html && vd(r.attrs.view) === e.view || t.dispatch(t.state.tr.setNodeMarkup(i, void 0, e)));
		}, g = (e, t = !1) => {
			u = e, i.dataset.viewMode = e, s.hidden = e === "preview", m.hidden = e === "preview", c.hidden = e === "source";
			for (let t of o.querySelectorAll("tp-icon-button[data-markdown-view]")) t.setAttribute("aria-pressed", String(t.dataset.markdownView === e));
			t && h({
				html: String(r.attrs.html),
				language: d,
				markdown: String(r.attrs.markdown),
				view: e
			}), e === "preview" && document.getSelection()?.removeAllRanges();
		}, _ = (e) => {
			l += 1;
			let t = l, n = document.createElement("div");
			this.renderMarkupInto(e, d, n).then(() => {
				if (t !== l) return;
				let r = this.serializeRenderedElement(n);
				c.innerHTML = r, h({
					html: r,
					language: d,
					markdown: e,
					view: u
				});
			}).catch((e) => {
				console.error(`Unable to render ${f} block in prose editor`, e);
			});
		}, v = () => {
			_(s.getValue());
		}, y = (e) => {
			let t = e.target;
			t instanceof Element && t.closest("tp-icon-button[data-markdown-view]") !== null && e.preventDefault();
		}, b = (e) => {
			let t = e.target;
			if (!(t instanceof Element)) return;
			let n = t.closest("tp-icon-button[data-markdown-view]");
			n !== null && (e.preventDefault(), g(vd(n.dataset.markdownView), !0));
		};
		return s.addEventListener("tp-code-editor-input", v), m.addEventListener("click", () => {
			s.toolbar = !s.toolbar, m.setAttribute("aria-pressed", String(s.toolbar));
		}), o.addEventListener("mousedown", y), o.addEventListener("click", b), g(u), e.attrs.html === "" && e.attrs.markdown !== "" && _(String(e.attrs.markdown)), {
			dom: i,
			stopEvent: () => !0,
			ignoreMutation: () => !0,
			update: (e) => {
				if (e.type !== r.type) return !1;
				r = e;
				let t = String(e.attrs.markdown), n = String(e.attrs.html), i = vd(e.attrs.view);
				return s.getValue() !== t && s.setValue(t), c.innerHTML !== n && (c.innerHTML = n), s.readonly = this.readonly, g(i), !0;
			},
			destroy: () => {
				l += 1, s.removeEventListener("tp-code-editor-input", v), o.removeEventListener("mousedown", y), o.removeEventListener("click", b);
			}
		};
	}
	createCustomElementNodeView(e) {
		let t = this.createCustomElementDOM(e);
		return t.contentEditable = "false", t.dataset.tpProseEditorCustomElement = "", n(t).catch((e) => {
			console.error("Unable to load tp component node view", e);
		}), {
			dom: t,
			stopEvent: (e) => this.shouldIgnoreCustomElementEvent(e),
			ignoreMutation: () => !0,
			update: (t) => !(t.type !== e.type || t.attrs.html !== e.attrs.html)
		};
	}
	createAudioNodeView(e) {
		if (e.attrs.controls === !0) return {
			dom: ed(this.createAudioElement(e), e.attrs.caption),
			ignoreMutation: () => !0
		};
		let t = document.createElement("span");
		t.dataset.tpProseEditorAudioButton = "", t.contentEditable = "false";
		let n = this.createAudioElement(e);
		n.hidden = !0;
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("name", "volume-high"), r.setAttribute("label", String(e.attrs.title || "Play audio")), r.addEventListener("click", (e) => {
			e.preventDefault(), n.play();
		}), t.append(r, n), {
			dom: t,
			ignoreMutation: () => !0,
			stopEvent: (e) => e.type === "click"
		};
	}
	createAudioElement(e) {
		let t = document.createElement("audio");
		return t.src = String(e.attrs.src), e.attrs.autoplay === !0 && (t.autoplay = !0), e.attrs.controls === !0 && (t.controls = !0), typeof e.attrs.title == "string" && e.attrs.title !== "" && (t.title = e.attrs.title), t;
	}
	createCustomElementDOM(e) {
		let t = document.createElement("template");
		t.innerHTML = String(e.attrs.html);
		let n = t.content.firstElementChild;
		if (n instanceof HTMLElement) return n;
		let r = document.createElement("div");
		return r.dataset.tpProseEditorCustomElement = "", r;
	}
	shouldIgnoreCustomElementEvent(e) {
		if (e.type === "focus" || e.type === "blur" || e.type === "mousedown" || e.type === "mouseup" || e.type === "click" || e.type === "dblclick" || e.type === "pointerdown" || e.type === "pointerup" || e.type === "keydown" || e.type === "keyup" || e.type === "keypress" || e.type === "input" || e.type === "change") return !0;
		let t = e.target;
		return t instanceof Element && t.closest("input, textarea, select, button, label, [contenteditable=\"true\"]") !== null;
	}
	createTableNode(e, t) {
		let n = Math.max(1, Math.floor(e)), r = Math.max(1, Math.floor(t)), i = Q("table_cell"), a = Q("table_row"), o = Q("table"), s = Array.from({ length: n }, () => {
			let e = Array.from({ length: r }, () => {
				let e = i.createAndFill();
				if (e === null) throw Error("Unable to create table cell.");
				return e;
			});
			return a.create(null, e);
		});
		return o.create(null, s);
	}
	runTableCommand(e) {
		return this.editorView !== null && e(this.editorView.state, this.editorView.dispatch, this.editorView);
	}
	handleToolbarMouseDown = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("tp-icon-button[data-command=\"html\"]");
		n === null || n.hasAttribute("disabled") || e.preventDefault();
	};
	handleToolbarClick = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("tp-icon-button[data-command]");
		if (n === null || this.editorView === null || n.hasAttribute("disabled")) return;
		e.preventDefault();
		let r = n.dataset.command;
		this.runCommand(r), [
			"copy",
			"cut",
			"files",
			"emoji-picker",
			"format",
			"html",
			"insert-table",
			"list",
			"media",
			"icon-picker",
			"more",
			"paste",
			"search",
			"select-all",
			"types",
			"symbol-picker"
		].includes(r) || this.editorView.focus();
	};
	runCommand(e) {
		if (this.editorView !== null) {
			if (e === "more") {
				this.toggleSecondaryToolbar();
				return;
			}
			if (!this.toggleDropdownCommand(e)) {
				if ([
					"copy",
					"cut",
					"paste",
					"select-all"
				].includes(e)) {
					this.runClipboardCommand(e);
					return;
				}
				({
					"format-bold": j($("strong")),
					"format-clear": this.clearFormatting,
					"format-code": j($("code")),
					"format-code-block": gr(Q("code_block")),
					"format-list-bulleted": yi(Q("bullet_list")),
					"format-list-numbered": yi(Q("ordered_list")),
					"format-list-text": this.insertDefinitionList,
					"format-math": this.insertInlineMath,
					"format-header-1": this.toggleHeading(1),
					"format-header-2": this.toggleHeading(2),
					"format-header-3": this.toggleHeading(3),
					"format-header-4": this.toggleHeading(4),
					"format-header-5": this.toggleHeading(5),
					"format-header-6": this.toggleHeading(6),
					"format-italic": j($("em")),
					"format-quote-open": hr(Q("blockquote")),
					"format-strikethrough": j($("strikethrough")),
					"format-subscript": j($("subscript")),
					"format-superscript": j($("superscript")),
					"format-text": gr(Q("paragraph")),
					"format-underline": j($("underline")),
					"insert-horizontal-rule": this.insertHorizontalRule,
					"insert-math-block": this.insertMathBlock,
					"insert-markdown-block": this.insertMarkdownBlock,
					"insert-markup-asciidoc": this.insertMarkupBlock("asciidoc"),
					"insert-markup-html": this.insertMarkupBlock("html"),
					"insert-markup-markdown": this.insertMarkupBlock("markdown"),
					"insert-markup-restructuredtext": this.insertMarkupBlock("restructuredtext"),
					"insert-audio": this.insertAudio,
					"insert-image": this.insertImage,
					"insert-video": this.insertVideo,
					link: this.toggleLink,
					redo: qr,
					undo: Kr
				})[e]?.(this.editorView.state, this.editorView.dispatch, this.editorView), this.updateToolbarState();
			}
		}
	}
	toggleDropdownCommand(e) {
		let t = {
			files: this.fileDropdownElement,
			"emoji-picker": this.emojiPickerDropdownElement,
			format: this.formatDropdownElement,
			html: this.htmlDropdownElement,
			"insert-table": this.tableDropdownElement,
			list: this.listDropdownElement,
			media: this.mediaDropdownElement,
			"icon-picker": this.iconPickerDropdownElement,
			"symbol-picker": this.symbolPickerDropdownElement,
			types: this.typeDropdownElement
		}[e];
		if (t === void 0) return e === "search" ? (this.toggleSearch(), !0) : !1;
		if (t === null) return !0;
		let n = !t.open;
		return t.toggle(), n ? (t.querySelector("li[role=\"menuitem\"], button, input")?.focus(), !0) : (this.editorView?.focus(), !0);
	}
	handleMenuItemSelect = (e) => {
		let t = e.detail.item;
		if (!(t instanceof HTMLElement) || t.getAttribute("aria-disabled") === "true") return;
		let n = t.dataset.menuCommand, r = t.dataset.fileAction, i = t.dataset.htmlAction, a = t.dataset.tableAction;
		if (n !== void 0) {
			this.runCommand(n), t.closest("tp-dropdown")?.hide(), this.editorView?.focus();
			return;
		}
		if (r !== void 0) {
			this.runFileAction(r), t.closest("tp-dropdown")?.hide();
			return;
		}
		if (i !== void 0) {
			this.runHTMLAction(i), t.closest("tp-dropdown")?.hide();
			return;
		}
		a !== void 0 && this.runTableAction(a);
	};
	handleGenericMenuKeydown = (e) => {
		e.key === "Escape" && (e.preventDefault(), e.currentTarget?.closest("tp-dropdown")?.hide(), this.editorView?.focus());
	};
	runFileAction(e) {
		switch (e) {
			case "load-html":
				this.htmlFileInputElement?.click();
				break;
			case "import-markdown":
				this.markdownFileInputElement?.click();
				break;
			case "save-html":
				this.downloadHTML("prose-editor.html");
				break;
			case "save-html-as":
				this.downloadHTMLAs();
				break;
		}
	}
	openFileInput(e) {
		e !== null && (e.value = "", e.click());
	}
	runHTMLAction(e) {
		switch (e) {
			case "editor":
				this.restoreEditorMode();
				break;
			case "render":
				this.setHTMLRenderMode(!0);
				break;
			case "code":
				this.setHTMLCodeMode(!0);
				break;
		}
	}
	handleHtmlFileChange = (e) => {
		this.loadSelectedHTMLFile(e);
	};
	handleMarkdownFileChange = (e) => {
		this.loadSelectedMarkdownFile(e);
	};
	handleImageFileChange = (e) => {
		this.loadSelectedMediaFile(e, "image");
	};
	handleVideoFileChange = (e) => {
		this.loadSelectedMediaFile(e, "video");
	};
	handleAudioFileChange = (e) => {
		this.loadSelectedMediaFile(e, "audio");
	};
	handleHtmlSourceInput = () => {
		this.dispatchInputEvent();
	};
	handleSearchInput = () => {
		let e = this.searchInputElement?.value.trim() ?? "";
		if (this.syncSearchClearButton(), e === "") {
			this.setSearchQuery("");
			return;
		}
		this.findNext(e);
	};
	handleSearchClearClick = (e) => {
		e.preventDefault(), e.stopPropagation(), this.clearSearch();
	};
	handleFileDropdownToggle = () => this.syncDropdownButton("files", this.fileDropdownElement);
	handleTypeDropdownToggle = () => this.syncDropdownButton("types", this.typeDropdownElement);
	handleFormatDropdownToggle = () => this.syncDropdownButton("format", this.formatDropdownElement);
	handleHTMLDropdownToggle = () => this.syncDropdownButton("html", this.htmlDropdownElement);
	handleListDropdownToggle = () => this.syncDropdownButton("list", this.listDropdownElement);
	handleMediaDropdownToggle = () => this.syncDropdownButton("media", this.mediaDropdownElement);
	toggleSecondaryToolbar() {
		if (this.secondaryToolbarElement === null) return;
		let e = this.secondaryToolbarElement.hidden;
		this.secondaryToolbarElement.hidden = !e, e || (this.typeDropdownElement?.hide(), this.formatDropdownElement?.hide(), this.listDropdownElement?.hide()), this.updateToolbarState();
	}
	syncDropdownButton(e, t) {
		let n = this.querySelectorAll(`tp-icon-button[data-command="${e}"]`);
		for (let e of n) e.setAttribute("aria-expanded", String(t?.open === !0));
	}
	syncSearchClearButton() {
		this.searchClearButtonElement === null || this.searchInputElement === null || (this.searchClearButtonElement.hidden = !1, this.searchClearButtonElement.setAttribute("label", this.searchInputElement.value.trim() === "" ? "Close search" : "Clear search"));
	}
	clearSearch() {
		if (this.searchInputElement !== null) {
			if (this.searchInputElement.value.trim() === "") {
				this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
				return;
			}
			this.searchInputElement.value = "", this.setSearchQuery(""), this.syncSearchClearButton(), this.searchInputElement.focus();
		}
	}
	closeTableMenu() {
		this.tableDropdownElement !== null && this.tableDropdownElement.hide();
	}
	handleTableDropdownToggle = () => {
		this.toolbarElement?.querySelector("tp-icon-button[data-command=\"insert-table\"]")?.setAttribute("aria-expanded", String(this.tableDropdownElement?.open === !0)), this.syncTablePicker();
	};
	runTableAction(e) {
		switch (e) {
			case "insert":
				this.insertTable(this.readTableRows(), this.readTableColumns()), this.closeTableMenu();
				break;
			case "add-caption":
				this.addTableCaption(), this.closeTableMenu(), this.editorView?.focus();
				break;
			case "add-row":
				this.addTableRowAfter(), this.editorView?.focus();
				break;
			case "add-column":
				this.addTableColumnAfter(), this.editorView?.focus();
				break;
			case "delete-row":
				this.deleteTableRow(), this.editorView?.focus();
				break;
			case "delete-column":
				this.deleteTableColumn(), this.editorView?.focus();
				break;
			case "delete-table":
				this.deleteTable(), this.closeTableMenu(), this.editorView?.focus();
				break;
		}
	}
	addTableCaption() {
		if (this.editorView === null) return !1;
		let { state: e } = this.editorView, t = this.findTableForCaption();
		if (t === null) return !1;
		let n = typeof t.node.attrs.caption == "string" ? t.node.attrs.caption : "", r = window.prompt("Table caption", n);
		if (r === null) return !1;
		let i = {
			...t.node.attrs,
			caption: r.trim() === "" ? null : r.trim()
		};
		return this.editorView.dispatch(e.tr.setNodeMarkup(t.position, void 0, i).scrollIntoView()), !0;
	}
	findTableForCaption() {
		if (this.editorView === null) return null;
		let e = Q("table"), { state: t } = this.editorView, { $from: n } = t.selection;
		for (let t = n.depth; t > 0; --t) {
			let r = n.node(t);
			if (r.type === e) return {
				node: r,
				position: n.before(t)
			};
		}
		let r = null;
		return t.doc.descendants((n, i) => {
			if (n.type !== e) return !0;
			let a = Math.min(Math.abs(i - t.selection.from), Math.abs(i + n.nodeSize - t.selection.from));
			return (r === null || a < r.distance) && (r = {
				distance: a,
				node: n,
				position: i
			}), !1;
		}), r;
	}
	handleTableMenuKeydown = (e) => {
		e.key === "Escape" && (e.preventDefault(), this.closeTableMenu(), this.editorView?.focus());
	};
	handleTablePickerPointerOver = (e) => {
		let t = this.getTablePickerCell(e.target);
		t !== null && this.selectTablePickerCell(t);
	};
	handleTablePickerClick = (e) => {
		let t = this.getTablePickerCell(e.target);
		t !== null && (e.preventDefault(), this.selectTablePickerCell(t), this.insertTable(this.readTableRows(), this.readTableColumns()), this.closeTableMenu());
	};
	getTablePickerCell(e) {
		return e instanceof Element ? e.closest("[data-table-grid-cell]") : null;
	}
	selectTablePickerCell(e) {
		this.selectedTableRows = this.readPositiveInteger(e.dataset.tableRows ?? "", this.selectedTableRows), this.selectedTableColumns = this.readPositiveInteger(e.dataset.tableColumns ?? "", this.selectedTableColumns), this.syncTablePicker();
	}
	syncTablePicker() {
		let e = this.toolbarElement?.querySelector("[data-tp-prose-editor-table-picker]");
		if (e == null) return;
		e.querySelector("[data-tp-prose-editor-table-picker-size]")?.replaceChildren(`${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}`);
		let t = e.querySelectorAll("[data-table-grid-cell]");
		for (let e of t) {
			let t = this.readPositiveInteger(e.dataset.tableRows ?? "", 0), n = this.readPositiveInteger(e.dataset.tableColumns ?? "", 0), r = t <= this.selectedTableRows && n <= this.selectedTableColumns;
			e.toggleAttribute("data-selected", r), e.setAttribute("aria-pressed", String(t === this.selectedTableRows && n === this.selectedTableColumns));
		}
	}
	readTableRows() {
		return this.selectedTableRows;
	}
	readTableColumns() {
		return this.selectedTableColumns;
	}
	readPositiveInteger(e, t) {
		let n = Number.parseInt(e, 10);
		return !Number.isFinite(n) || n < 1 ? t : n;
	}
	toggleSearch() {
		if (this.searchInputElement !== null) {
			if (this.searchInputElement.hidden) {
				this.searchControlElement !== null && (this.searchControlElement.hidden = !1), this.searchInputElement.hidden = !1;
				let e = this.getSelectedText();
				e !== "" && (this.searchInputElement.value = e), this.syncSearchClearButton(), this.searchInputElement.focus(), this.searchInputElement.select();
				return;
			}
			if (this.searchInputElement.value.trim() !== "") {
				this.findNext(this.searchInputElement.value);
				return;
			}
			this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
		}
	}
	handleSearchInputKeydown = (e) => {
		if (this.searchInputElement === null) return;
		if (e.key === "Escape") {
			e.preventDefault(), this.searchInputElement.hidden = !0, this.searchControlElement !== null && (this.searchControlElement.hidden = !0), this.editorView?.focus();
			return;
		}
		if (e.key !== "Enter") return;
		e.preventDefault();
		let t = this.searchInputElement.value.trim();
		if (t !== "") {
			if (e.shiftKey) {
				this.findPrevious(t);
				return;
			}
			this.findNext(t);
		}
	};
	findSearchMatch(e, t) {
		if (this.editorView === null) return !1;
		let n = new Pc({ search: (e ?? this.searchInputElement?.value ?? "").trim() }), { state: r } = this.editorView, { from: i, to: a } = r.selection, o = t === "next" ? n.findNext(r, a) : n.findPrev(r, i);
		o === null && (o = t === "next" ? n.findNext(r, 0, i) : n.findPrev(r, r.doc.content.size, a));
		let s = Xc(r.tr, n);
		return o !== null && (s = s.setSelection(O.create(s.doc, o.from, o.to)).scrollIntoView()), this.editorView.dispatch(s), o !== null;
	}
	getSelectedText() {
		if (this.editorView === null) return "";
		let { from: e, to: t, empty: n } = this.editorView.state.selection;
		return n ? "" : this.editorView.state.doc.textBetween(e, t, " ").trim();
	}
	updateToolbarState() {
		if (this.editorView === null || this.toolbarElement === null) return;
		let e = /* @__PURE__ */ new Set();
		this.isMarkActive("strong") && e.add("format-bold"), this.isMarkActive("em") && e.add("format-italic"), this.isMarkActive("code") && e.add("format-code"), this.isMarkActive("underline") && e.add("format-underline"), this.isMarkActive("strikethrough") && e.add("format-strikethrough"), this.isMarkActive("subscript") && e.add("format-subscript"), this.isMarkActive("superscript") && e.add("format-superscript");
		let t = this.editorView.state.selection.$from.parent;
		t.type === Q("heading") && t.attrs.level === 1 && e.add("format-header-1"), t.type === Q("heading") && t.attrs.level === 2 && e.add("format-header-2"), t.type === Q("heading") && t.attrs.level === 3 && e.add("format-header-3"), t.type === Q("heading") && t.attrs.level === 4 && e.add("format-header-4"), t.type === Q("heading") && t.attrs.level === 5 && e.add("format-header-5"), t.type === Q("heading") && t.attrs.level === 6 && e.add("format-header-6"), t.type === Q("paragraph") && e.add("format-text"), this.isSelectAllActive() && e.add("select-all");
		let n = this.querySelectorAll("tp-icon-button[data-command]"), r = this.secondaryToolbarElement?.hidden === !1;
		for (let t of n) {
			let n = t.dataset.command;
			if ([
				"format-bold",
				"format-code",
				"format-header-1",
				"format-header-2",
				"format-header-3",
				"format-header-4",
				"format-header-5",
				"format-header-6",
				"format-italic",
				"format-strikethrough",
				"format-subscript",
				"format-superscript",
				"format-text",
				"format-underline",
				"html",
				"more",
				"select-all"
			].includes(n)) {
				let i = e.has(n) || n === "html" && (this.htmlMode || this.htmlRenderMode) || n === "more" && r ? "true" : "false";
				t.setAttribute("aria-pressed", i), t.querySelector(":scope > button")?.setAttribute("aria-pressed", i);
			} else t.removeAttribute("aria-pressed"), t.querySelector(":scope > button")?.removeAttribute("aria-pressed");
		}
	}
	isSelectAllActive() {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			let e = window.getSelection();
			return e === null || e.rangeCount === 0 ? !1 : e.getRangeAt(0).commonAncestorContainer === this.htmlRenderedElement;
		}
		return this.htmlMode && this.htmlSourceElement !== null ? this.htmlSourceElement.selectionStart === 0 && this.htmlSourceElement.selectionEnd === this.htmlSourceElement.value.length && this.htmlSourceElement.value.length > 0 : this.editorView !== null && this.editorView.state.selection instanceof A;
	}
	isMarkActive(e) {
		if (this.editorView === null) return !1;
		let t = $(e), { empty: n, $from: r, from: i, to: a } = this.editorView.state.selection;
		return n ? t.isInSet(this.editorView.state.storedMarks ?? r.marks()) !== void 0 : this.editorView.state.doc.rangeHasMark(i, a, t);
	}
	clearFormatting = (e, t) => {
		if (t === void 0) return !0;
		let { from: n, to: r } = e.selection, i = e.tr;
		for (let e of Object.values(Z.marks)) i = i.removeMark(n, r, e);
		return i = i.setBlockType(n, r, Q("paragraph")), t(i), !0;
	};
	insertHorizontalRule = (e, t) => (t === void 0 || t(e.tr.replaceSelectionWith(Q("horizontal_rule").create()).scrollIntoView()), !0);
	toggleHeading(e) {
		return (t, n) => {
			let r = t.selection.$from.parent, i = r.type === Q("heading") && r.attrs.level === e;
			return gr(Q(i ? "paragraph" : "heading"), i ? null : { level: e })(t, n);
		};
	}
	insertInlineMath = (e, t) => {
		let n = this.getSelectedTextOrPrompt(e, "Math");
		return n === null ? !1 : (t === void 0 || t(e.tr.replaceSelectionWith(Q("math_inline").create({ tex: n })).scrollIntoView()), !0);
	};
	insertMathBlock = (e, t) => {
		let n = this.getSelectedTextOrPrompt(e, "Math block");
		if (n === null) return !1;
		if (t === void 0) return !0;
		let { $from: r, $to: i } = e.selection, a = r.parent.type === Q("paragraph") && i.parent.type === Q("paragraph") && r.before() === i.before(), o = a ? r.before() : e.selection.from, s = a ? r.after() : e.selection.to, c = Q("math_block").create({ tex: n }), l = e.tr.replaceWith(o, s, c), u = Math.min(o + c.nodeSize, l.doc.content.size), d = -1;
		if (u >= l.doc.content.size) {
			let e = Q("paragraph").createAndFill();
			e !== null && (d = l.doc.content.size + 1, l = l.insert(l.doc.content.size, e));
		}
		let f = d > 0 ? O.create(l.doc, d) : O.near(l.doc.resolve(u), 1);
		return t(l.setSelection(f).scrollIntoView()), !0;
	};
	getSelectedTextOrPrompt(e, t) {
		let n = e.doc.textBetween(e.selection.from, e.selection.to, "\n", "\n").trim();
		if (n !== "") return n.replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").trim();
		let r = window.prompt(t, "");
		return r === null || r.trim() === "" ? null : r.trim().replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").trim();
	}
	insertMarkdownBlock = (e, t) => t === void 0 || this.insertMarkupBlock("markdown")(e, t);
	insertMarkupBlock = (e) => (t, n) => n === void 0 ? !0 : (n(t.tr.replaceSelectionWith(Q("markdown_block").create({
		html: "",
		language: e,
		markdown: "",
		view: "both"
	})).scrollIntoView()), queueMicrotask(() => {
		let e = this.querySelectorAll("tp-code-editor[data-tp-prose-editor-markdown-source]"), t = e.item(e.length - 1);
		if (t === null) return;
		let n = () => {
			document.getSelection()?.removeAllRanges(), t.focus();
		};
		t.addEventListener("tp-code-editor-ready", n, { once: !0 }), n();
	}), !0);
	insertDefinitionList = (e, t) => {
		let n = Q("paragraph").create(null, Z.text("Description"));
		if (t === void 0) return !0;
		let r = e.doc.textBetween(e.selection.from, e.selection.to, " ").trim(), i = r === "" ? "Term" : r, a = [Q("definition_term").create(null, Z.text(i)), Q("definition_description").create(null, n)], o = this.findCurrentDefinitionList(e), s, c;
		if (o === null) {
			let t = Q("definition_list").create(null, a);
			s = e.tr.replaceSelectionWith(t), c = s.mapping.map(e.selection.from, 1);
		} else c = o.position + o.node.nodeSize - 1, s = e.tr.insert(c, g.fromArray(a));
		let l = Infinity, u = -1, d = -1;
		if (s.doc.descendants((e, t) => {
			if (e.type === Q("definition_description")) {
				let e = t + 2, n = e + 11, r = Math.abs(t - c);
				return r < l && (l = r, u = e, d = n), !1;
			}
			return !0;
		}), d >= s.doc.content.size) {
			let e = Q("paragraph").createAndFill();
			e !== null && (s = s.insert(s.doc.content.size, e));
		}
		return u < 0 || d < 0 ? (t(s.scrollIntoView()), !0) : (t(s.setSelection(O.create(s.doc, u, d)).scrollIntoView()), !0);
	};
	findCurrentDefinitionList(e) {
		let t = Q("definition_list"), { $from: n } = e.selection;
		for (let e = n.depth; e > 0; --e) {
			let r = n.node(e);
			if (r.type === t) return {
				node: r,
				position: n.before(e)
			};
		}
		return null;
	}
	insertDefinitionPairAfterDescription = (e, t) => {
		if (!e.selection.empty) return !1;
		let { $from: n } = e.selection;
		if (n.parentOffset !== n.parent.content.size) return !1;
		let r = -1;
		for (let e = n.depth; e > 0; --e) if (n.node(e).type === Q("definition_description")) {
			r = e;
			break;
		}
		if (r < 0) return !1;
		if (t === void 0) return !0;
		let i = Q("paragraph").create(null, Z.text("Description")), a = g.fromArray([Q("definition_term").create(null, Z.text("Term")), Q("definition_description").create(null, i)]), o = n.after(r), s = e.tr.insert(o, a);
		return s.setSelection(O.create(s.doc, o + 1, o + 1 + 4)).scrollIntoView(), t(s), !0;
	};
	exitDefinitionListPlaceholder = (e, t) => {
		let n = this.findDefinitionPlaceholderPair(e);
		if (n === null) return !1;
		if (t === void 0) return !0;
		let r = Q("paragraph").createAndFill();
		if (r === null) return !1;
		let i, a;
		if (n.removeList) {
			i = e.tr.delete(n.listStart, n.listEnd);
			let t = i.doc.nodeAt(n.listStart);
			t !== null && this.isEmptyParagraph(t) || (i = i.insert(n.listStart, r)), a = n.listStart + 1;
		} else {
			i = e.tr.delete(n.pairStart, n.pairEnd);
			let t = i.mapping.map(n.listEnd, -1), o = i.doc.nodeAt(t);
			o !== null && this.isEmptyParagraph(o) || (i = i.insert(t, r)), a = t + 1;
		}
		return t(i.setSelection(O.create(i.doc, a)).scrollIntoView()), !0;
	};
	findDefinitionPlaceholderPair(e) {
		let { $from: t, $to: n } = e.selection, r = -1;
		for (let e = t.depth; e > 0; --e) if (t.node(e).type === Q("definition_list")) {
			r = e;
			break;
		}
		if (r < 0 || !n.sameParent(t)) return null;
		let i = t.node(r), a = t.index(r), o = i.child(a), s = -1;
		if (o.type === Q("definition_term") ? s = a : o.type === Q("definition_description") && (s = a - 1), s < 0 || s + 1 >= i.childCount) return null;
		let c = i.child(s), l = i.child(s + 1);
		if (c.type !== Q("definition_term") || l.type !== Q("definition_description")) return null;
		let u = c.textContent.trim(), d = l.textContent.trim();
		if (u !== "" && u !== "Term" || d !== "" && d !== "Description") return null;
		let f = t.before(r) + 1;
		for (let e = 0; e < s; e += 1) f += i.child(e).nodeSize;
		let p = f + c.nodeSize + l.nodeSize;
		if (e.selection.from < f || e.selection.to > p) return null;
		let m = t.before(r);
		return {
			listEnd: m + i.nodeSize,
			listStart: m,
			pairEnd: p,
			pairStart: f,
			removeList: i.childCount === 2
		};
	}
	insertImage = (e, t) => (t === void 0 || this.openFileInput(this.imageFileInputElement), !0);
	insertVideo = (e, t) => (t === void 0 || this.openFileInput(this.videoFileInputElement), !0);
	insertAudio = (e, t) => (t === void 0 || this.openFileInput(this.audioFileInputElement), !0);
	toggleLink = (e, t, n) => {
		let r = $("link"), { empty: i, from: a, to: o } = e.selection;
		if (!i && e.doc.rangeHasMark(a, o, r)) return j(r)(e, t, n);
		let s = window.prompt("Link URL");
		return s === null || s.trim() === "" ? !1 : j(r, {
			href: s.trim(),
			title: null
		})(e, t, n);
	};
	async runClipboardCommand(e) {
		if (e === "select-all") {
			this.selectAllContent();
			return;
		}
		switch ((this.htmlMode ? this.htmlSourceElement : this.htmlRenderMode ? this.htmlRenderedElement : this.editorView?.dom)?.focus(), e) {
			case "copy":
				document.execCommand("copy");
				return;
			case "cut":
				document.execCommand("cut");
				return;
			case "paste":
				await this.pasteClipboardText();
				return;
		}
	}
	selectAllContent() {
		if (this.isSelectAllActive()) {
			this.clearSelectAllContent();
			return;
		}
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			this.htmlRenderedElement.focus();
			let e = document.createRange();
			e.selectNodeContents(this.htmlRenderedElement);
			let t = window.getSelection();
			t?.removeAllRanges(), t?.addRange(e), this.updateToolbarState();
			return;
		}
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus(), this.htmlSourceElement.select(), this.updateToolbarState();
			return;
		}
		this.editorView !== null && (this.editorView.focus(), this.editorView.dispatch(this.editorView.state.tr.setSelection(new A(this.editorView.state.doc))), this.updateToolbarState());
	}
	clearSelectAllContent() {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			window.getSelection()?.removeAllRanges(), this.htmlRenderedElement.focus(), this.updateToolbarState();
			return;
		}
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus(), this.htmlSourceElement.setSelectionRange(0, 0), this.updateToolbarState();
			return;
		}
		this.editorView !== null && (this.editorView.focus(), this.editorView.dispatch(this.editorView.state.tr.setSelection(O.create(this.editorView.state.doc, 1))), this.updateToolbarState());
	}
	handleEmojiPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertPickerText(t), this.emojiPickerDropdownElement?.hide());
	};
	handleSymbolPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertPickerText(t), this.symbolPickerDropdownElement?.hide());
	};
	handleIconPickerSelect = (e) => {
		let t = e.detail?.value;
		typeof t == "string" && (this.insertInlineIcon(t), this.iconPickerDropdownElement?.hide());
	};
	insertInlineIcon(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		if (this.editorView === null) return;
		let t = document.createElement("template");
		t.innerHTML = e;
		let n = t.content.querySelector("tp-icon");
		if (!(n instanceof HTMLElement)) return;
		let r = Q("tp_icon").create({ html: n.outerHTML }), i = this.editorView.state.tr.replaceSelectionWith(r);
		i = i.insertText(Ou, i.selection.from), this.editorView.dispatch(i.scrollIntoView()), this.loadRenderedTpComponents(), this.editorView.focus();
	}
	insertPickerText(e) {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(e);
			return;
		}
		this.editorView !== null && (this.editorView.dispatch(this.editorView.state.tr.insertText(e).scrollIntoView()), this.editorView.focus());
	}
	async pasteClipboardText() {
		try {
			let e = await navigator.clipboard.readText();
			if (this.htmlMode && this.htmlSourceElement !== null) {
				this.insertTextInHTMLSource(e);
				return;
			}
			this.editorView !== null && this.editorView.dispatch(this.editorView.state.tr.insertText(e).scrollIntoView());
		} catch {
			document.execCommand("paste");
		}
	}
	insertTextInHTMLSource(e) {
		if (this.htmlSourceElement === null) return;
		let t = this.htmlSourceElement.selectionStart, n = this.htmlSourceElement.selectionEnd, r = this.htmlSourceElement.value;
		this.htmlSourceElement.value = `${r.slice(0, t)}${e}${r.slice(n)}`;
		let i = t + e.length;
		this.htmlSourceElement.setSelectionRange(i, i), this.dispatchInputEvent();
	}
	setHTMLCodeMode(e) {
		if (this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null) return !1;
		if (!e) {
			if (!this.htmlMode) return this.restoreEditorMode();
			let e = this.htmlSourceElement.value;
			return this.htmlMode = !1, this.htmlSourceElement.hidden = !0, this.htmlRenderMode = !1, this.htmlRenderedElement.hidden = !0, this.surfaceElement.hidden = !1, this.setHTML(e), this.editorView?.focus(), this.updateToolbarState(), !0;
		}
		if (this.htmlMode) return this.htmlSourceElement.focus(), this.updateToolbarState(), !0;
		let t = this.htmlRenderMode ? this.htmlRenderedElement.innerHTML : this.serializeDocument(this.editorView?.state.doc ?? this.parseHTML(""));
		return this.htmlSourceElement.value = u(t), this.htmlMode = !0, this.htmlRenderMode = !1, this.surfaceElement.hidden = !0, this.htmlRenderedElement.hidden = !0, this.htmlSourceElement.hidden = !1, this.htmlSourceElement.focus(), this.updateToolbarState(), !0;
	}
	setHTMLRenderMode(e) {
		if (this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null) return !1;
		if (!e) return this.restoreEditorMode();
		let t = this.htmlMode ? this.htmlSourceElement.value : this.serializeDocument(this.editorView?.state.doc ?? this.parseHTML(""), { renderComponents: !0 });
		return this.htmlRenderedElement.innerHTML = t, this.htmlRenderMode = !0, this.htmlMode = !1, this.surfaceElement.hidden = !0, this.htmlSourceElement.hidden = !0, this.htmlRenderedElement.hidden = !1, this.loadRenderedHTMLComponents(), this.updateToolbarState(), !0;
	}
	restoreEditorMode() {
		return this.surfaceElement === null || this.htmlSourceElement === null || this.htmlRenderedElement === null ? !1 : (this.htmlMode = !1, this.htmlRenderMode = !1, this.htmlSourceElement.hidden = !0, this.htmlRenderedElement.hidden = !0, this.surfaceElement.hidden = !1, document.getSelection()?.removeAllRanges(), this.updateToolbarState(), !0);
	}
	async loadSelectedHTMLFile(e) {
		let t = e.currentTarget;
		if (t === null) return;
		let n = t.files?.[0];
		n !== void 0 && (this.insertHTMLWithHistory(await n.text()), t.value = "");
	}
	async loadSelectedMarkdownFile(e) {
		let t = e.currentTarget;
		if (t === null) return;
		let n = t.files?.[0];
		if (n === void 0) return;
		let r = await n.text(), i = document.createElement("div");
		await s(r, i, n.name);
		let a = i.innerHTML;
		this.insertHTMLWithHistory(a), t.value = "";
	}
	async loadSelectedMediaFile(e, t) {
		let n = e.currentTarget;
		if (n === null) return;
		let r = n.files?.[0];
		if (r === void 0) return;
		let i = await this.readFileAsDataURL(r);
		await this.insertMediaFile(t, i, r), n.value = "";
	}
	async insertMediaFile(e, t, n) {
		if (this.editorView === null) return;
		let r = await this.createMediaNode(e, t, n);
		if (r === null) return;
		let i = this.editorView.state.selection.from, a = this.editorView.state.tr.replaceSelectionWith(r), o = Math.min(i + r.nodeSize, a.doc.content.size);
		if (this.requiresTrailingEditableBlock(r) && o >= a.doc.content.size) {
			let e = Q("paragraph").createAndFill();
			e !== null && (a = a.insert(o, e));
		}
		this.editorView.dispatch(a.setSelection(D.near(a.doc.resolve(o), 1)).scrollIntoView()), this.editorView.focus();
	}
	async createMediaNode(e, t, n) {
		let r = await this.promptMediaAttributes(e, n.name, t);
		return r === null ? null : e === "image" ? Q("image").create({
			alt: r.alt,
			height: r.height,
			src: t,
			title: r.title,
			width: r.width
		}) : e === "video" ? Q("video").create({
			autoplay: r.autoplay,
			controls: r.controls,
			caption: r.caption,
			poster: r.poster.trim() === "" ? null : r.poster.trim(),
			src: t,
			title: r.title,
			width: r.width,
			height: r.height
		}) : Q("audio").create({
			autoplay: r.autoplay,
			caption: r.caption,
			controls: r.controls,
			src: t,
			title: r.title
		});
	}
	getMediaOptionChecked(e, t, n) {
		return e.querySelector(`[data-media-option="${t}"] input[type="checkbox"]`)?.checked ?? n;
	}
	normalizeDimension(e) {
		let t = e.trim();
		if (t === "") return null;
		let n = Number.parseInt(t, 10);
		return Number.isFinite(n) && n > 0 ? String(n) : null;
	}
	promptMediaAttributes(e, t, n) {
		return new Promise((r) => {
			let i = document.createElement("dialog"), a = e === "audio" || e === "video", o = e === "image" || e === "video", s = e === "image" ? "1" : e === "video" ? "1,3" : "1", c = e === "image" ? "<li data-media-option=\"lock-ratio\">Lock ratio</li>" : `
          <li data-media-option="controls">controls</li>
          <li data-media-option="autoplay">autoplay</li>
          ${e === "video" ? "<li data-media-option=\"lock-ratio\">Lock ratio</li>" : ""}
        `;
			i.innerHTML = `
        <form method="dialog">
          <label>
            <span>Title</span>
            <input type="text" name="title" value="${gd(t)}">
          </label>
          ${e === "image" ? "\n            <label>\n              <span>Alternative text</span>\n              <input type=\"text\" name=\"alt\" value=\"\">\n            </label>\n          " : ""}
          ${e === "video" ? "\n            <label>\n              <span>Poster URL</span>\n              <input type=\"text\" name=\"poster\" value=\"\">\n            </label>\n          " : ""}
          ${e === "audio" || e === "video" ? "\n            <label>\n              <span>Caption</span>\n              <input type=\"text\" name=\"caption\" value=\"\">\n            </label>\n          " : ""}
          ${o ? "\n            <label>\n              <span>Width</span>\n              <input type=\"number\" name=\"width\" min=\"1\" step=\"1\" inputmode=\"numeric\">\n            </label>\n            <label>\n              <span>Height</span>\n              <input type=\"number\" name=\"height\" min=\"1\" step=\"1\" inputmode=\"numeric\">\n            </label>\n          " : ""}
          ${a || o ? `
            <tp-checkbox-list value="${s}">
              <ul>
                ${c}
              </ul>
            </tp-checkbox-list>
          ` : ""}
          <menu>
            <button type="button" value="cancel">Cancel</button>
            <button type="button" value="ok">OK</button>
          </menu>
        </form>
      `;
			let l = i.querySelector("tp-checkbox-list"), u = i.querySelector("input[name=\"title\"]"), d = i.querySelector("input[name=\"alt\"]"), f = i.querySelector("input[name=\"caption\"]"), p = i.querySelector("input[name=\"poster\"]"), m = i.querySelector("input[name=\"width\"]"), h = i.querySelector("input[name=\"height\"]"), g = 0, _ = 0, v = !1, y = () => this.getMediaOptionChecked(i, "lock-ratio", o), b = (e) => {
				if (v || !y() || g <= 0 || _ <= 0 || m === null || h === null) return;
				let t = Number.parseInt(e.value, 10);
				!Number.isFinite(t) || t <= 0 || (v = !0, e === m ? h.value = String(Math.round(t * _ / g)) : m.value = String(Math.round(t * g / _)), v = !1);
			}, x = (e) => {
				i.returnValue = e, i.dispatchEvent(new Event("close"));
			}, S = (e) => {
				let t = e.target?.closest("button[value]");
				t != null && (e.preventDefault(), x(t.value));
			};
			i.addEventListener("click", S), i.addEventListener("close", () => {
				if (i.removeEventListener("click", S), i.remove(), i.returnValue !== "ok") {
					r(null);
					return;
				}
				let e = a ? l?.getAttribute("value") || "1" : "", t = new Set(e.split(","));
				r({
					autoplay: this.getMediaOptionChecked(i, "autoplay", t.has("2")),
					controls: !a || this.getMediaOptionChecked(i, "controls", t.has("1")),
					alt: d?.value ?? "",
					caption: f?.value ?? "",
					height: this.normalizeDimension(h?.value ?? ""),
					lockRatio: this.getMediaOptionChecked(i, "lock-ratio", o),
					poster: p?.value ?? "",
					title: u?.value ?? "",
					width: this.normalizeDimension(m?.value ?? "")
				});
			}, { once: !0 }), m?.addEventListener("input", () => {
				b(m);
			}), h?.addEventListener("input", () => {
				b(h);
			}), this.append(i), (a || o) && l?.setAttribute("value", s), o && this.loadNaturalMediaSize(e, n).then((e) => {
				e !== null && (g = e.width, _ = e.height, m?.setAttribute("placeholder", String(e.width)), h?.setAttribute("placeholder", String(e.height)));
			}), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
		});
	}
	loadNaturalMediaSize(e, t) {
		return e === "image" ? new Promise((e) => {
			let n = new Image();
			n.addEventListener("load", () => {
				e({
					height: n.naturalHeight,
					width: n.naturalWidth
				});
			}, { once: !0 }), n.addEventListener("error", () => {
				e(null);
			}, { once: !0 }), n.src = t;
		}) : e === "video" ? new Promise((e) => {
			let n = document.createElement("video");
			n.preload = "metadata", n.addEventListener("loadedmetadata", () => {
				e({
					height: n.videoHeight,
					width: n.videoWidth
				});
			}, { once: !0 }), n.addEventListener("error", () => {
				e(null);
			}, { once: !0 }), n.src = t;
		}) : Promise.resolve(null);
	}
	readFileAsDataURL(e) {
		return new Promise((t, n) => {
			let r = new FileReader();
			r.addEventListener("load", () => {
				if (typeof r.result == "string") {
					t(r.result);
					return;
				}
				n(/* @__PURE__ */ Error(`Unable to read ${e.name}`));
			}), r.addEventListener("error", () => {
				n(r.error ?? /* @__PURE__ */ Error(`Unable to read ${e.name}`));
			}), r.readAsDataURL(e);
		});
	}
	downloadHTMLAs() {
		this.saveTextFileAs("prose-editor.html", this.createHTMLDocument(), "text/html;charset=utf-8", (e) => this.normalizeHTMLFilename(e));
	}
	downloadHTML(e) {
		this.downloadTextFile(e, this.createHTMLDocument(), "text/html;charset=utf-8");
	}
	downloadTextFile(e, t, n) {
		let r = new Blob([t], { type: n }), i = URL.createObjectURL(r), a = document.createElement("a");
		a.href = i, a.download = e, a.hidden = !0, document.body.append(a), a.click(), a.remove(), URL.revokeObjectURL(i);
	}
	async saveTextFileAs(e, t, n, r = (e) => e.trim()) {
		let i = window.showSaveFilePicker, a = r(e);
		if (a !== "") {
			if (typeof i != "function") {
				let e = window.prompt("File name", a);
				if (e === null || e.trim() === "") return;
				let i = r(e);
				if (i === "") return;
				this.downloadTextFile(i, t, n);
				return;
			}
			try {
				let e = /\.[a-z0-9]+$/i.exec(a)?.[0] ?? ".txt", r = await (await i.call(window, {
					suggestedName: a,
					types: [{
						description: "Text file",
						accept: { [n.split(";")[0] ?? "text/plain"]: [e] }
					}]
				})).createWritable();
				await r.write(new Blob([t], { type: n })), await r.close();
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				throw e;
			}
		}
	}
	normalizeHTMLFilename(e) {
		let t = e.trim();
		return t === "" ? "" : /\.(?:html?|xhtml)$/i.test(t) ? t : `${t}.html`;
	}
	createHTMLDocument() {
		return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>prose-editor</title>
</head>
<body>
${this.getHTML()}
${md}
</body>
</html>
`;
	}
	dispatchInputEvent() {
		let e = this.getHTML();
		this.internalValueUpdate = !0, this.setStringAttribute("value", e), this.internalValueUpdate = !1, this.dispatchEvent(new CustomEvent("tp-prose-editor-input", {
			bubbles: !0,
			detail: { value: e }
		})), this.dispatchEvent(new CustomEvent("tp-prose-editor-change", {
			bubbles: !0,
			detail: { value: e }
		}));
	}
};
customElements.get("tp-prose-editor") || customElements.define("tp-prose-editor", yd);
//#endregion
export { yd as t };

//# sourceMappingURL=prose-editor.js.map