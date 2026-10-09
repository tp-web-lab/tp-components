import { B as e, E as t, G as n, H as r, I as i, L as a, N as o, R as s, S as c, U as l, V as u, W as d, c as f, d as p, h as ee, x as te, z as m } from "./@codemirror-autocomplete.js";
//#region ../../../../../../@tp/node_modules/.pnpm/@lezer+lr@1.4.10/node_modules/@lezer/lr/dist/index.js
var ne = class e {
	constructor(e, t, n, r, i, a, o, s, c, l = 0, u) {
		this.p = e, this.stack = t, this.state = n, this.reducePos = r, this.pos = i, this.score = a, this.buffer = o, this.bufferBase = s, this.curContext = c, this.lookAhead = l, this.parent = u;
	}
	toString() {
		return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
	}
	static start(t, n, r = 0) {
		let i = t.parser.context;
		return new e(t, [], n, r, r, 0, [], 0, i ? new h(i, i.start) : null, 0, null);
	}
	get context() {
		return this.curContext ? this.curContext.context : null;
	}
	pushState(e, t) {
		this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
	}
	reduce(e) {
		let t = e >> 19, n = e & 65535, { parser: r } = this.p, i = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), a = r.dynamicPrecedence(n);
		if (a && (this.score += a), t == 0) {
			n < r.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(r.getGoto(this.state, n, !0), this.reducePos), n < r.minRepeatTerm && this.storeNode(n, this.reducePos, this.reducePos, i ? 8 : 4, !0), this.reduceContext(n, this.reducePos);
			return;
		}
		let o = this.stack.length - (t - 1) * 3 - (e & 262144 ? 6 : 0), s = o ? this.stack[o - 2] : this.p.ranges[0].from;
		n < r.minRepeatTerm && s == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
		let c = this.reducePos - s;
		c >= 2e3 && !this.p.parser.nodeSet.types[n]?.isAnonymous && (s == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = c) : this.p.lastBigReductionSize < c && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = s, this.p.lastBigReductionSize = c));
		let l = o ? this.stack[o - 1] : 0, u = this.bufferBase + this.buffer.length - l;
		if (n < r.minRepeatTerm || e & 131072) {
			let e = r.stateFlag(this.state, 1) ? this.pos : this.reducePos;
			this.storeNode(n, s, e, u + 4, !0);
		}
		if (e & 262144) this.state = this.stack[o];
		else {
			let e = this.stack[o - 3];
			this.state = r.getGoto(e, n, !0);
		}
		for (; this.stack.length > o;) this.stack.pop();
		this.reduceContext(n, s);
	}
	storeNode(e, t, n, r = 4, i = !1) {
		if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
			let e = this.buffer.length;
			if (e > 0 && this.buffer[e - 4] == 0 && this.buffer[e - 1] > -1) {
				if (t == n) return;
				if (this.buffer[e - 2] >= t) {
					this.buffer[e - 2] = n;
					return;
				}
			}
		}
		if (!i || this.pos == n) this.buffer.push(e, t, n, r);
		else {
			let i = this.buffer.length;
			if (i > 0 && (this.buffer[i - 4] != 0 || this.buffer[i - 1] < 0)) {
				let e = !1;
				for (let t = i; t > 0 && this.buffer[t - 2] > n; t -= 4) if (this.buffer[t - 1] >= 0) {
					e = !0;
					break;
				}
				if (e) for (; i > 0 && this.buffer[i - 2] > n;) this.buffer[i] = this.buffer[i - 4], this.buffer[i + 1] = this.buffer[i - 3], this.buffer[i + 2] = this.buffer[i - 2], this.buffer[i + 3] = this.buffer[i - 1], i -= 4, r > 4 && (r -= 4);
			}
			this.buffer[i] = e, this.buffer[i + 1] = t, this.buffer[i + 2] = n, this.buffer[i + 3] = r;
		}
	}
	shift(e, t, n, r) {
		if (e & 131072) this.pushState(e & 65535, this.pos);
		else if (e & 262144) this.pos = r, this.shiftContext(t, n), t <= this.p.parser.maxNode && this.buffer.push(t, n, r, 4);
		else {
			let i = e, { parser: a } = this.p;
			this.pos = r;
			let o = a.stateFlag(i, 1);
			!o && (r > n || t <= a.maxNode) && (this.reducePos = r), this.pushState(i, o ? n : Math.min(n, this.reducePos)), this.shiftContext(t, n), t <= a.maxNode && this.buffer.push(t, n, r, 4);
		}
	}
	apply(e, t, n, r) {
		e & 65536 ? this.reduce(e) : this.shift(e, t, n, r);
	}
	useNode(e, t) {
		let n = this.p.reused.length - 1;
		(n < 0 || this.p.reused[n] != e) && (this.p.reused.push(e), n++);
		let r = this.pos;
		this.reducePos = this.pos = r + e.length, this.pushState(t, r), this.buffer.push(n, r, this.reducePos, -1), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
	}
	split() {
		let t = this, n = t.buffer.length;
		for (n && t.buffer[n - 4] == 0 && (n -= 4); n > 0 && t.buffer[n - 2] > t.reducePos;) n -= 4;
		let r = t.buffer.slice(n), i = t.bufferBase + n;
		for (; t && i == t.bufferBase;) t = t.parent;
		return new e(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, r, i, this.curContext, this.lookAhead, t);
	}
	recoverByDelete(e, t) {
		let n = e <= this.p.parser.maxNode;
		n && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, n ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
	}
	canShift(e) {
		for (let t = new re(this);;) {
			let n = this.p.parser.stateSlot(t.state, 4) || this.p.parser.hasAction(t.state, e);
			if (n == 0) return !1;
			if (!(n & 65536)) return !0;
			t.reduce(n);
		}
	}
	recoverByInsert(e) {
		if (this.stack.length >= 300) return [];
		let t = this.p.parser.nextStates(this.state);
		if (t.length > 8 || this.stack.length >= 120) {
			let n = [];
			for (let r = 0, i; r < t.length; r += 2) (i = t[r + 1]) != this.state && this.p.parser.hasAction(i, e) && n.push(t[r], i);
			if (this.stack.length < 120) for (let e = 0; n.length < 8 && e < t.length; e += 2) {
				let r = t[e + 1];
				n.some((e, t) => t & 1 && e == r) || n.push(t[e], r);
			}
			t = n;
		}
		let n = [];
		for (let e = 0; e < t.length && n.length < 4; e += 2) {
			let r = t[e + 1];
			if (r == this.state) continue;
			let i = this.split();
			i.pushState(r, this.pos), i.storeNode(0, i.pos, i.pos, 4, !0), i.shiftContext(t[e], this.pos), i.reducePos = this.pos, i.score -= 200, n.push(i);
		}
		return n;
	}
	forceReduce() {
		let { parser: e } = this.p, t = e.stateSlot(this.state, 5);
		if (!(t & 65536)) return !1;
		if (!e.validAction(this.state, t)) {
			let n = t >> 19, r = t & 65535, i = this.stack.length - n * 3;
			if (i < 0 || e.getGoto(this.stack[i], r, !1) < 0) {
				let e = this.findForcedReduction();
				if (e == null) return !1;
				t = e;
			}
			this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
		}
		return this.reducePos = this.pos, this.reduce(t), !0;
	}
	findForcedReduction() {
		let { parser: e } = this.p, t = [], n = (r, i) => {
			if (!t.includes(r)) return t.push(r), e.allActions(r, (t) => {
				if (!(t & 393216)) if (t & 65536) {
					let n = (t >> 19) - i;
					if (n > 1) {
						let r = t & 65535, i = this.stack.length - n * 3;
						if (i >= 0 && e.getGoto(this.stack[i], r, !1) >= 0) return n << 19 | 65536 | r;
					}
				} else {
					let e = n(t, i + 1);
					if (e != null) return e;
				}
			});
		};
		return n(this.state, 0);
	}
	forceAll() {
		for (; !this.p.parser.stateFlag(this.state, 2);) if (!this.forceReduce()) {
			this.storeNode(0, this.pos, this.pos, 4, !0);
			break;
		}
		return this;
	}
	get deadEnd() {
		if (this.stack.length != 3) return !1;
		let { parser: e } = this.p;
		return e.data[e.stateSlot(this.state, 1)] == 65535 && !e.stateSlot(this.state, 4);
	}
	restart() {
		this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
	}
	sameState(e) {
		if (this.state != e.state || this.stack.length != e.stack.length) return !1;
		for (let t = 0; t < this.stack.length; t += 3) if (this.stack[t] != e.stack[t]) return !1;
		return !0;
	}
	get parser() {
		return this.p.parser;
	}
	dialectEnabled(e) {
		return this.p.parser.dialect.flags[e];
	}
	shiftContext(e, t) {
		this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
	}
	reduceContext(e, t) {
		this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
	}
	emitContext() {
		let e = this.buffer.length - 1;
		(e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
	}
	emitLookAhead() {
		let e = this.buffer.length - 1;
		(e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
	}
	updateContext(e) {
		if (e != this.curContext.context) {
			let t = new h(this.curContext.tracker, e);
			t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
		}
	}
	setLookAhead(e) {
		return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
	}
	close() {
		this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
	}
}, h = class {
	constructor(e, t) {
		this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
	}
}, re = class {
	constructor(e) {
		this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
	}
	reduce(e) {
		let t = e & 65535, n = e >> 19;
		n == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (n - 1) * 3;
		let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
		this.state = r;
	}
}, ie = class e {
	constructor(e, t, n) {
		this.stack = e, this.pos = t, this.index = n, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
	}
	static create(t, n = t.bufferBase + t.buffer.length) {
		return new e(t, n, n - t.bufferBase);
	}
	maybeNext() {
		let e = this.stack.parent;
		e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
	}
	get id() {
		return this.buffer[this.index - 4];
	}
	get start() {
		return this.buffer[this.index - 3];
	}
	get end() {
		return this.buffer[this.index - 2];
	}
	get size() {
		return this.buffer[this.index - 1];
	}
	next() {
		this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
	}
	fork() {
		return new e(this.stack, this.pos, this.index);
	}
};
function g(e, t = Uint16Array) {
	if (typeof e != "string") return e;
	let n = null;
	for (let r = 0, i = 0; r < e.length;) {
		let a = 0;
		for (;;) {
			let t = e.charCodeAt(r++), n = !1;
			if (t == 126) {
				a = 65535;
				break;
			}
			t >= 92 && t--, t >= 34 && t--;
			let i = t - 32;
			if (i >= 46 && (i -= 46, n = !0), a += i, n) break;
			a *= 46;
		}
		n ? n[i++] = a : n = new t(a);
	}
	return n;
}
var _ = class {
	constructor() {
		this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
	}
}, v = new _(), ae = class {
	constructor(e, t) {
		this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = v, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
	}
	resolveOffset(e, t) {
		let n = this.range, r = this.rangeIndex, i = this.pos + e;
		for (; i < n.from;) {
			if (!r) return null;
			let e = this.ranges[--r];
			i -= n.from - e.to, n = e;
		}
		for (; t < 0 ? i > n.to : i >= n.to;) {
			if (r == this.ranges.length - 1) return null;
			let e = this.ranges[++r];
			i += e.from - n.to, n = e;
		}
		return i;
	}
	clipPos(e) {
		if (e >= this.range.from && e < this.range.to) return e;
		for (let t of this.ranges) if (t.to > e) return Math.max(e, t.from);
		return this.end;
	}
	peek(e) {
		let t = this.chunkOff + e, n, r;
		if (t >= 0 && t < this.chunk.length) n = this.pos + e, r = this.chunk.charCodeAt(t);
		else {
			let t = this.resolveOffset(e, 1);
			if (t == null) return -1;
			if (n = t, n >= this.chunk2Pos && n < this.chunk2Pos + this.chunk2.length) r = this.chunk2.charCodeAt(n - this.chunk2Pos);
			else {
				let e = this.rangeIndex, t = this.range;
				for (; t.to <= n;) t = this.ranges[++e];
				this.chunk2 = this.input.chunk(this.chunk2Pos = n), n + this.chunk2.length > t.to && (this.chunk2 = this.chunk2.slice(0, t.to - n)), r = this.chunk2.charCodeAt(0);
			}
		}
		return n >= this.token.lookAhead && (this.token.lookAhead = n + 1), r;
	}
	acceptToken(e, t = 0) {
		let n = t ? this.resolveOffset(t, -1) : this.pos;
		if (n == null || n < this.token.start) throw RangeError("Token end out of bounds");
		this.token.value = e, this.token.end = n;
	}
	acceptTokenTo(e, t) {
		this.token.value = e, this.token.end = t;
	}
	getChunk() {
		if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
			let { chunk: e, chunkPos: t } = this;
			this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
		} else {
			this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
			let e = this.input.chunk(this.pos), t = this.pos + e.length;
			this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
		}
	}
	readNext() {
		return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
	}
	advance(e = 1) {
		for (this.chunkOff += e; this.pos + e >= this.range.to;) {
			if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
			e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
		}
		return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
	}
	setDone() {
		return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
	}
	reset(e, t) {
		if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = v, this.pos != e) {
			if (this.pos = e, e == this.end) return this.setDone(), this;
			for (; e < this.range.from;) this.range = this.ranges[--this.rangeIndex];
			for (; e >= this.range.to;) this.range = this.ranges[++this.rangeIndex];
			e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
		}
		return this;
	}
	read(e, t) {
		if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length) return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
		if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length) return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
		if (e >= this.range.from && t <= this.range.to) return this.input.read(e, t);
		let n = "";
		for (let r of this.ranges) {
			if (r.from >= t) break;
			r.to > e && (n += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
		}
		return n;
	}
}, y = class {
	constructor(e, t) {
		this.data = e, this.id = t;
	}
	token(e, t) {
		let { parser: n } = t.p;
		S(this.data, e, t, this.id, n.data, n.tokenPrecTable);
	}
};
y.prototype.contextual = y.prototype.fallback = y.prototype.extend = !1;
var b = class {
	constructor(e, t, n) {
		this.precTable = t, this.elseToken = n, this.data = typeof e == "string" ? g(e) : e;
	}
	token(e, t) {
		let n = e.pos, r = 0;
		for (;;) {
			let n = e.next < 0, i = e.resolveOffset(1, 1);
			if (S(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1) break;
			if (this.elseToken == null) return;
			if (n || r++, i == null) break;
			e.reset(i, e.token);
		}
		r && (e.reset(n, e.token), e.acceptToken(this.elseToken, r));
	}
};
b.prototype.contextual = y.prototype.fallback = y.prototype.extend = !1;
var x = class {
	constructor(e, t = {}) {
		this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
	}
};
function S(e, t, n, r, i, a) {
	let o = 0, s = 1 << r, { dialect: c } = n.p.parser;
	scan: for (; (s & e[o]) != 0;) {
		let n = e[o + 1];
		for (let r = o + 3; r < n; r += 2) if ((e[r + 1] & s) > 0) {
			let n = e[r];
			if (c.allows(n) && (t.token.value == -1 || t.token.value == n || oe(n, t.token.value, i, a))) {
				t.acceptToken(n);
				break;
			}
		}
		let r = t.next, l = 0, u = e[o + 2];
		if (t.next < 0 && u > l && e[n + u * 3 - 3] == 65535) {
			o = e[n + u * 3 - 1];
			continue scan;
		}
		for (; l < u;) {
			let i = l + u >> 1, a = n + i + (i << 1), s = e[a], c = e[a + 1] || 65536;
			if (r < s) u = i;
			else if (r >= c) l = i + 1;
			else {
				o = e[a + 2], t.advance();
				continue scan;
			}
		}
		break;
	}
}
function C(e, t, n) {
	for (let r = t, i; (i = e[r]) != 65535; r++) if (i == n) return r - t;
	return -1;
}
function oe(e, t, n, r) {
	let i = C(n, r, t);
	return i < 0 || C(n, r, e) < i;
}
var w = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG), T = null;
function E(e, t, n) {
	let r = e.cursor(m.IncludeAnonymous);
	for (r.moveTo(t);;) if (!(n < 0 ? r.childBefore(t) : r.childAfter(t))) for (;;) {
		if ((n < 0 ? r.to < t : r.from > t) && !r.type.isError) return n < 0 ? Math.max(0, Math.min(r.to - 1, t - 25)) : Math.min(e.length, Math.max(r.from + 1, t + 25));
		if (n < 0 ? r.prevSibling() : r.nextSibling()) break;
		if (!r.parent()) return n < 0 ? 0 : e.length;
	}
}
var D = class {
	constructor(e, t) {
		this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
	}
	nextFragment() {
		let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
		if (e) {
			for (this.safeFrom = e.openStart ? E(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? E(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length;) this.trees.pop(), this.start.pop(), this.index.pop();
			this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
		} else this.nextStart = 1e9;
	}
	nodeAt(t) {
		if (t < this.nextStart) return null;
		for (; this.fragment && this.safeTo <= t;) this.nextFragment();
		if (!this.fragment) return null;
		for (;;) {
			let r = this.trees.length - 1;
			if (r < 0) return this.nextFragment(), null;
			let i = this.trees[r], a = this.index[r];
			if (a == i.children.length) {
				this.trees.pop(), this.start.pop(), this.index.pop();
				continue;
			}
			let o = i.children[a], s = this.start[r] + i.positions[a];
			if (s > t) return this.nextStart = s, null;
			if (o instanceof n) {
				if (s == t) {
					if (s < this.safeFrom) return null;
					let t = s + o.length;
					if (t <= this.safeTo) {
						let n = o.prop(e.lookAhead);
						if (!n || t + n < this.fragment.to) return o;
					}
				}
				this.index[r]++, s + o.length >= Math.max(this.safeFrom, t) && (this.trees.push(o), this.start.push(s), this.index.push(0));
			} else this.index[r]++, this.nextStart = s + o.length;
		}
	}
}, se = class {
	constructor(e, t) {
		this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((e) => new _());
	}
	getActions(e) {
		let t = 0, n = null, { parser: r } = e.p, { tokenizers: i } = r, a = r.stateSlot(e.state, 3), o = e.curContext ? e.curContext.hash : 0, s = 0;
		for (let r = 0; r < i.length; r++) {
			if (!(1 << r & a)) continue;
			let c = i[r], l = this.tokens[r];
			if (!(n && !c.fallback) && ((c.contextual || l.start != e.pos || l.mask != a || l.context != o) && (this.updateCachedToken(l, c, e), l.mask = a, l.context = o), l.lookAhead > l.end + 25 && (s = Math.max(l.lookAhead, s)), l.value != 0)) {
				let r = t;
				if (l.extended > -1 && (t = this.addActions(e, l.extended, l.end, t)), t = this.addActions(e, l.value, l.end, t), !c.extend && (n = l, t > r)) break;
			}
		}
		for (; this.actions.length > t;) this.actions.pop();
		return s && e.setLookAhead(s), !n && e.pos == this.stream.end && (n = new _(), n.value = e.p.parser.eofTerm, n.start = n.end = e.pos, t = this.addActions(e, n.value, n.end, t)), this.mainToken = n, this.actions;
	}
	getMainToken(e) {
		if (this.mainToken) return this.mainToken;
		let t = new _(), { pos: n, p: r } = e;
		return t.start = n, t.end = Math.min(n + 1, r.stream.end), t.value = n == r.stream.end ? r.parser.eofTerm : 0, t;
	}
	updateCachedToken(e, t, n) {
		let r = this.stream.clipPos(n.pos);
		if (t.token(this.stream.reset(r, e), n), e.value > -1) {
			let { parser: t } = n.p;
			for (let r = 0; r < t.specialized.length; r++) if (t.specialized[r] == e.value) {
				let i = t.specializers[r](this.stream.read(e.start, e.end), n);
				if (i >= 0 && n.p.parser.dialect.allows(i >> 1)) {
					i & 1 ? e.extended = i >> 1 : e.value = i >> 1;
					break;
				}
			}
		} else e.value = 0, e.end = this.stream.clipPos(r + 1);
	}
	putAction(e, t, n, r) {
		for (let t = 0; t < r; t += 3) if (this.actions[t] == e) return r;
		return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = n, r;
	}
	addActions(e, t, n, r) {
		let { state: i } = e, { parser: a } = e.p, { data: o } = a;
		for (let e = 0; e < 2; e++) for (let s = a.stateSlot(i, e ? 2 : 1);; s += 3) {
			if (o[s] == 65535) if (o[s + 1] == 1) s = j(o, s + 2);
			else {
				r == 0 && o[s + 1] == 2 && (r = this.putAction(j(o, s + 2), t, n, r));
				break;
			}
			o[s] == t && (r = this.putAction(j(o, s + 1), t, n, r));
		}
		return r;
	}
}, ce = class {
	constructor(e, t, n, r) {
		this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new ae(t, r), this.tokens = new se(e, this.stream), this.topTerm = e.top[1];
		let { from: i } = r[0];
		this.stacks = [ne.start(this, e.top[0], i)], this.fragments = n.length && this.stream.end - i > e.bufferLength * 4 ? new D(n, e.nodeSet) : null;
	}
	get parsedPos() {
		return this.minStackPos;
	}
	advance() {
		let e = this.stacks, t = this.minStackPos, n = this.stacks = [], r, i;
		if (this.bigReductionCount > 300 && e.length == 1) {
			let [t] = e;
			for (; t.forceReduce() && t.stack.length && t.stack[t.stack.length - 2] >= this.lastBigReductionStart;);
			this.bigReductionCount = this.lastBigReductionSize = 0;
		}
		for (let a = 0; a < e.length; a++) {
			let o = e[a];
			for (;;) {
				if (this.tokens.mainToken = null, o.pos > t) n.push(o);
				else if (this.advanceStack(o, n, e)) continue;
				else {
					r || (r = [], i = []), r.push(o);
					let e = this.tokens.getMainToken(o);
					i.push(e.value, e.end);
				}
				break;
			}
		}
		if (!n.length) {
			let e = r && de(r);
			if (e) return w && console.log("Finish with " + this.stackID(e)), this.stackToTree(e);
			if (this.parser.strict) throw w && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), SyntaxError("No parse at " + t);
			this.recovering ||= 5;
		}
		if (this.recovering && r) {
			let e = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, i, n);
			if (e) return w && console.log("Force-finish " + this.stackID(e)), this.stackToTree(e.forceAll());
		}
		if (this.recovering) {
			let e = this.recovering == 1 ? 1 : this.recovering * 3;
			if (n.length > e) for (n.sort((e, t) => t.score - e.score); n.length > e;) n.pop();
			n.some((e) => e.reducePos > t) && this.recovering--;
		} else if (n.length > 1) {
			outer: for (let e = 0; e < n.length - 1; e++) {
				let t = n[e];
				for (let r = e + 1; r < n.length; r++) {
					let i = n[r];
					if (t.sameState(i) || t.buffer.length > 500 && i.buffer.length > 500) if ((t.score - i.score || t.buffer.length - i.buffer.length) > 0) n.splice(r--, 1);
					else {
						n.splice(e--, 1);
						continue outer;
					}
				}
			}
			n.length > 12 && (n.sort((e, t) => t.score - e.score), n.splice(12, n.length - 12));
		}
		this.minStackPos = n[0].pos;
		for (let e = 1; e < n.length; e++) n[e].pos < this.minStackPos && (this.minStackPos = n[e].pos);
		return null;
	}
	stopAt(e) {
		if (this.stoppedAt != null && this.stoppedAt < e) throw RangeError("Can't move stoppedAt forward");
		this.stoppedAt = e;
	}
	advanceStack(t, r, i) {
		let a = t.pos, { parser: o } = this, s = w ? this.stackID(t) + " -> " : "";
		if (this.stoppedAt != null && a > this.stoppedAt) return t.forceReduce() ? t : null;
		if (this.fragments) {
			let r = t.curContext && t.curContext.tracker.strict, i = r ? t.curContext.hash : 0;
			for (let c = this.fragments.nodeAt(a); c;) {
				let a = this.parser.nodeSet.types[c.type.id] == c.type ? o.getGoto(t.state, c.type.id) : -1;
				if (a > -1 && c.length && (!r || (c.prop(e.contextHash) || 0) == i)) return t.useNode(c, a), w && console.log(s + this.stackID(t) + ` (via reuse of ${o.getName(c.type.id)})`), !0;
				if (!(c instanceof n) || c.children.length == 0 || c.positions[0] > 0) break;
				let l = c.children[0];
				if (l instanceof n && c.positions[0] == 0) c = l;
				else break;
			}
		}
		let c = o.stateSlot(t.state, 4);
		if (c > 0) return t.reduce(c), w && console.log(s + this.stackID(t) + ` (via always-reduce ${o.getName(c & 65535)})`), !0;
		if (t.stack.length >= 8400) for (; t.stack.length > 6e3 && t.forceReduce(););
		let l = this.tokens.getActions(t);
		for (let e = 0; e < l.length;) {
			let n = l[e++], c = l[e++], u = l[e++], d = e == l.length || !i, f = d ? t : t.split(), p = this.tokens.mainToken;
			if (f.apply(n, c, p ? p.start : f.pos, u), w && console.log(s + this.stackID(f) + ` (via ${n & 65536 ? `reduce of ${o.getName(n & 65535)}` : "shift"} for ${o.getName(c)} @ ${a}${f == t ? "" : ", split"})`), d) return !0;
			f.pos > a ? r.push(f) : i.push(f);
		}
		return !1;
	}
	advanceFully(e, t) {
		let n = e.pos;
		for (;;) {
			if (!this.advanceStack(e, null, null)) return !1;
			if (e.pos > n) return O(e, t), !0;
		}
	}
	runRecovery(e, t, n) {
		let r = null, i = !1;
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = t[a << 1], c = t[(a << 1) + 1], l = w ? this.stackID(o) + " -> " : "";
			if (o.deadEnd && (i || (i = !0, o.restart(), w && console.log(l + this.stackID(o) + " (restarted)"), this.advanceFully(o, n)))) continue;
			let u = o.split(), d = l;
			for (let e = 0; e < 10 && u.forceReduce() && (w && console.log(d + this.stackID(u) + " (via force-reduce)"), !this.advanceFully(u, n)); e++) w && (d = this.stackID(u) + " -> ");
			for (let e of o.recoverByInsert(s)) w && console.log(l + this.stackID(e) + " (via recover-insert)"), this.advanceFully(e, n);
			this.stream.end > o.pos ? (c == o.pos && (c++, s = 0), o.recoverByDelete(s, c), w && console.log(l + this.stackID(o) + ` (via recover-delete ${this.parser.getName(s)})`), O(o, n)) : (!r || r.score < u.score) && (r = u);
		}
		return r;
	}
	stackToTree(e) {
		return e.close(), n.build({
			buffer: ie.create(e),
			nodeSet: this.parser.nodeSet,
			topID: this.topTerm,
			maxBufferLength: this.parser.bufferLength,
			reused: this.reused,
			start: this.ranges[0].from,
			length: e.pos - this.ranges[0].from,
			minRepeatType: this.parser.minRepeatTerm
		});
	}
	stackID(e) {
		let t = (T ||= /* @__PURE__ */ new WeakMap()).get(e);
		return t || T.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
	}
};
function O(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (r.pos == e.pos && r.sameState(e)) {
			t[n].score < e.score && (t[n] = e);
			return;
		}
	}
	t.push(e);
}
var le = class {
	constructor(e, t, n) {
		this.source = e, this.flags = t, this.disabled = n;
	}
	allows(e) {
		return !this.disabled || this.disabled[e] == 0;
	}
}, k = (e) => e, ue = class {
	constructor(e) {
		this.start = e.start, this.shift = e.shift || k, this.reduce = e.reduce || k, this.reuse = e.reuse || k, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
	}
}, A = class t extends d {
	constructor(t) {
		if (super(), this.wrappers = [], t.version != 14) throw RangeError(`Parser version (${t.version}) doesn't match runtime version (14)`);
		let n = t.nodeNames.split(" ");
		this.minRepeatTerm = n.length;
		for (let e = 0; e < t.repeatNodeCount; e++) n.push("");
		let i = Object.keys(t.topRules).map((e) => t.topRules[e][1]), a = [];
		for (let e = 0; e < n.length; e++) a.push([]);
		function o(e, t, n) {
			a[e].push([t, t.deserialize(String(n))]);
		}
		if (t.nodeProps) for (let n of t.nodeProps) {
			let t = n[0];
			typeof t == "string" && (t = e[t]);
			for (let e = 1; e < n.length;) {
				let r = n[e++];
				if (r >= 0) o(r, t, n[e++]);
				else {
					let i = n[e + -r];
					for (let a = -r; a > 0; a--) o(n[e++], t, i);
					e++;
				}
			}
		}
		this.nodeSet = new u(n.map((e, n) => r.define({
			name: n >= this.minRepeatTerm ? void 0 : e,
			id: n,
			props: a[n],
			top: i.indexOf(n) > -1,
			error: n == 0,
			skipped: t.skippedNodes && t.skippedNodes.indexOf(n) > -1
		}))), t.propSources && (this.nodeSet = this.nodeSet.extend(...t.propSources)), this.strict = !1, this.bufferLength = s;
		let c = g(t.tokenData);
		this.context = t.context, this.specializerSpecs = t.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
		for (let e = 0; e < this.specializerSpecs.length; e++) this.specialized[e] = this.specializerSpecs[e].term;
		this.specializers = this.specializerSpecs.map(M), this.states = g(t.states, Uint32Array), this.data = g(t.stateData), this.goto = g(t.goto), this.maxTerm = t.maxTerm, this.tokenizers = t.tokenizers.map((e) => typeof e == "number" ? new y(c, e) : e), this.topRules = t.topRules, this.dialects = t.dialects || {}, this.dynamicPrecedences = t.dynamicPrecedences || null, this.tokenPrecTable = t.tokenPrec, this.termNames = t.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
	}
	createParse(e, t, n) {
		let r = new ce(this, e, t, n);
		for (let i of this.wrappers) r = i(r, e, t, n);
		return r;
	}
	getGoto(e, t, n = !1) {
		let r = this.goto;
		if (t >= r[0]) return -1;
		for (let i = r[t + 1];;) {
			let t = r[i++], a = t & 1, o = r[i++];
			if (a && n) return o;
			for (let n = i + (t >> 1); i < n; i++) if (r[i] == e) return o;
			if (a) return -1;
		}
	}
	hasAction(e, t) {
		let n = this.data;
		for (let r = 0; r < 2; r++) for (let i = this.stateSlot(e, r ? 2 : 1), a;; i += 3) {
			if ((a = n[i]) == 65535) if (n[i + 1] == 1) a = n[i = j(n, i + 2)];
			else if (n[i + 1] == 2) return j(n, i + 2);
			else break;
			if (a == t || a == 0) return j(n, i + 1);
		}
		return 0;
	}
	stateSlot(e, t) {
		return this.states[e * 6 + t];
	}
	stateFlag(e, t) {
		return (this.stateSlot(e, 0) & t) > 0;
	}
	validAction(e, t) {
		return !!this.allActions(e, (e) => e == t || null);
	}
	allActions(e, t) {
		let n = this.stateSlot(e, 4), r = n ? t(n) : void 0;
		for (let n = this.stateSlot(e, 1); r == null; n += 3) {
			if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = j(this.data, n + 2);
			else break;
			r = t(j(this.data, n + 1));
		}
		return r;
	}
	nextStates(e) {
		let t = [];
		for (let n = this.stateSlot(e, 1);; n += 3) {
			if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = j(this.data, n + 2);
			else break;
			if (!(this.data[n + 2] & 1)) {
				let e = this.data[n + 1];
				t.some((t, n) => n & 1 && t == e) || t.push(this.data[n], e);
			}
		}
		return t;
	}
	configure(e) {
		let n = Object.assign(Object.create(t.prototype), this);
		if (e.props && (n.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
			let t = this.topRules[e.top];
			if (!t) throw RangeError(`Invalid top rule name ${e.top}`);
			n.top = t;
		}
		return e.tokenizers && (n.tokenizers = this.tokenizers.map((t) => {
			let n = e.tokenizers.find((e) => e.from == t);
			return n ? n.to : t;
		})), e.specializers && (n.specializers = this.specializers.slice(), n.specializerSpecs = this.specializerSpecs.map((t, r) => {
			let i = e.specializers.find((e) => e.from == t.external);
			if (!i) return t;
			let a = Object.assign(Object.assign({}, t), { external: i.to });
			return n.specializers[r] = M(a), a;
		})), e.contextTracker && (n.context = e.contextTracker), e.dialect && (n.dialect = this.parseDialect(e.dialect)), e.strict != null && (n.strict = e.strict), e.wrap && (n.wrappers = n.wrappers.concat(e.wrap)), e.bufferLength != null && (n.bufferLength = e.bufferLength), n;
	}
	hasWrappers() {
		return this.wrappers.length > 0;
	}
	getName(e) {
		return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
	}
	get eofTerm() {
		return this.maxNode + 1;
	}
	get topNode() {
		return this.nodeSet.types[this.top[1]];
	}
	dynamicPrecedence(e) {
		let t = this.dynamicPrecedences;
		return t == null ? 0 : t[e] || 0;
	}
	parseDialect(e) {
		let t = Object.keys(this.dialects), n = t.map(() => !1);
		if (e) for (let r of e.split(" ")) {
			let e = t.indexOf(r);
			e >= 0 && (n[e] = !0);
		}
		let r = null;
		for (let e = 0; e < t.length; e++) if (!n[e]) for (let n = this.dialects[t[e]], i; (i = this.data[n++]) != 65535;) (r ||= new Uint8Array(this.maxTerm + 1))[i] = 1;
		return new le(e, n, r);
	}
	static deserialize(e) {
		return new t(e);
	}
};
function j(e, t) {
	return e[t] | e[t + 1] << 16;
}
function de(e) {
	let t = null;
	for (let n of e) {
		let e = n.p.stoppedAt;
		(n.pos == n.p.stream.end || e != null && n.pos > e) && n.p.parser.stateFlag(n.state, 2) && (!t || t.score < n.score) && (t = n);
	}
	return t;
}
function M(e) {
	if (e.external) {
		let t = +!!e.extend;
		return (n, r) => e.external(n, r) << 1 | t;
	}
	return e.get;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/@lezer+css@1.3.4/node_modules/@lezer/css/dist/index.js
var fe = 145, N = 1, pe = 146, me = 147, P = 2, he = 148, F = 3, I = 4, L = [
	9,
	10,
	11,
	12,
	13,
	32,
	133,
	160,
	5760,
	8192,
	8193,
	8194,
	8195,
	8196,
	8197,
	8198,
	8199,
	8200,
	8201,
	8202,
	8232,
	8233,
	8239,
	8287,
	12288
], R = 58, ge = 40, z = 95, _e = 91, B = 45, ve = 46, ye = 35, be = 37, xe = 38, Se = 92, Ce = 10, we = 42;
function V(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 161;
}
function H(e) {
	return e >= 48 && e <= 57;
}
function U(e) {
	return H(e) || e >= 97 && e <= 102 || e >= 65 && e <= 70;
}
var W = (e, t, n) => (r, i) => {
	for (let a = !1, o = 0, s = 0;; s++) {
		let { next: c } = r;
		if (V(c) || c == B || c == z || a && H(c)) !a && (c != B || s > 0) && (a = !0), o === s && c == B && o++, r.advance();
		else if (c == Se && r.peek(1) != Ce) {
			if (r.advance(), U(r.next)) {
				do
					r.advance();
				while (U(r.next));
				r.next == 32 && r.advance();
			} else r.next > -1 && r.advance();
			a = !0;
		} else {
			a && r.acceptToken(o == 2 && i.canShift(P) ? t : c == ge ? n : e);
			break;
		}
	}
}, Te = new x(W(pe, P, me), { contextual: !0 }), Ee = new x(W(he, F, I), { contextual: !0 }), De = new x((e) => {
	if (L.includes(e.peek(-1))) {
		let { next: t } = e;
		(V(t) || t == z || t == ye || t == ve || t == we || t == _e || t == R && V(e.peek(1)) || t == B || t == xe) && e.acceptToken(fe);
	}
}), Oe = new x((e) => {
	if (!L.includes(e.peek(-1))) {
		let { next: t } = e;
		if (t == be && (e.advance(), e.acceptToken(N)), V(t)) {
			do
				e.advance();
			while (V(e.next) || H(e.next));
			e.acceptToken(N);
		}
	}
}), ke = i({
	"AtKeyword import charset namespace keyframes media supports font-feature-values": a.definitionKeyword,
	"from to selector scope MatchFlag": a.keyword,
	NamespaceName: a.namespace,
	KeyframeName: a.labelName,
	KeyframeRangeName: a.operatorKeyword,
	TagName: a.tagName,
	ClassName: a.className,
	PseudoClassName: a.constant(a.className),
	IdName: a.labelName,
	"FeatureName PropertyName": a.propertyName,
	AttributeName: a.attributeName,
	NumberLiteral: a.number,
	KeywordQuery: a.keyword,
	UnaryQueryOp: a.operatorKeyword,
	"CallTag ValueName FontName": a.atom,
	VariableName: a.variableName,
	Callee: a.operatorKeyword,
	Unit: a.unit,
	"UniversalSelector NestingSelector": a.definitionOperator,
	"MatchOp CompareOp": a.compareOperator,
	"ChildOp SiblingOp, LogicOp": a.logicOperator,
	BinOp: a.arithmeticOperator,
	Important: a.modifier,
	Comment: a.blockComment,
	ColorLiteral: a.color,
	"ParenthesizedContent StringLiteral": a.string,
	":": a.punctuation,
	"PseudoOp #": a.derefOperator,
	"; , |": a.separator,
	"( )": a.paren,
	"[ ]": a.squareBracket,
	"{ }": a.brace
}), Ae = {
	__proto__: null,
	lang: 44,
	"nth-child": 44,
	"nth-last-child": 44,
	"nth-of-type": 44,
	"nth-last-of-type": 44,
	dir: 44,
	"host-context": 44,
	if: 90,
	url: 152,
	"url-prefix": 152,
	domain: 152,
	regexp: 152
}, je = {
	__proto__: null,
	or: 104,
	and: 104,
	not: 112,
	only: 112,
	layer: 206
}, Me = {
	__proto__: null,
	selector: 118,
	style: 124,
	layer: 202
}, Ne = {
	__proto__: null,
	"@import": 198,
	"@media": 210,
	"@charset": 214,
	"@namespace": 218,
	"@keyframes": 224,
	"@supports": 236,
	"@scope": 240,
	"@font-feature-values": 246
}, Pe = {
	__proto__: null,
	to: 243
}, Fe = A.deserialize({
	version: 14,
	states: "MlQYQdOOO#}QdOOP$UO`OOO%OQaO'#CfOOQP'#Ce'#CeO%VQdO'#CgO%[Q`O'#CgO%aQaO'#FnO&XQdO'#CkO&xQaO'#CcO'SQdO'#CnO'_QdO'#EOO'dQdO'#EQO'oQdO'#EXO'oQdO'#E[OOQP'#Fn'#FnO)RQhO'#E}OOQS'#Fm'#FmOOQS'#FQ'#FQQYQdOOO)YQdO'#EbO*iQhO'#EhO)YQdO'#EjO*pQdO'#ElO*{QdO'#EoO)}QhO'#EuO+TQdO'#EwO+`QdO'#EzO+eQaO'#CfO+lQ`O'#E_O+qQ`O'#F{O+|QdO'#F{QOQ`OOP,WO&jO'#CaPOOO)CA])CA]OOQP'#Ci'#CiOOQP,59R,59RO%VQdO,59ROOQP'#Cm'#CmOOQP,59V,59VO&XQdO,59VO,cQdO,59YO'_QdO,5:jO'dQdO,5:lO'oQdO,5:sO'oQdO,5:uO'oQdO,5:vO'oQdO'#FXO,nQ`O,58}O,vQdO'#E^OOQS,58},58}OOQP'#Cq'#CqOOQO'#D|'#D|OOQP,59Y,59YO,}Q`O,59YO-SQ`O,59YOOQP'#EP'#EPOOQP,5:j,5:jO-XQpO'#ERO-dQdO'#ESO-iQ`O'#ESO-nQpO,5:lO.XQaO,5:sO.oQaO,5:vOOQW'#D^'#D^O/nQhO'#DgO0RQhO,5;iO)}QhO'#DeO0`Q`O'#DnO0eQhO'#DxOOQW'#Ft'#FtOOQS,5;i,5;iO0jQ`O'#DhO0oQ`O'#DkOOQS-E9O-E9OOOQ['#Cv'#CvO0tQdO'#CwO1[QdO'#C}O1rQdO'#DQO2YQ!pO'#DSO4fQ!jO,5:|OOQO'#DX'#DXO-SQ`O'#DWO4vQ!nO'#FqO6|Q`O'#DYO7RQ`O'#DyOOQ['#Fq'#FqO7WQhO'#GOO7fQ`O,5;SO7kQ!bO,5;UOOQS'#En'#EnO7sQ`O,5;WO7xQdO,5;WOOQO'#Eq'#EqO8QQ`O,5;ZO8VQhO,5;aO'oQdO'#DjOOQS,5;c,5;cO0jQ`O,5;cO8_QdO,5;cOOQS'#F`'#F`O8gQdO'#E|O7fQ`O,5;fO8oQdO,5:yO9PQdO'#FZO9^Q`O,5<gO9^Q`O,5<gPOOO'#FP'#FPP9iO&jO,58{POOO,58{,58{OOQP1G.m1G.mOOQP1G.q1G.qOOQP1G.t1G.tO,}Q`O1G.tO-SQ`O1G.tOOQP1G0U1G0UO9tQpO1G0WO9|QaO1G0_O:dQaO1G0aO:zQaO1G0bO;bQaO,5;sOOQO-E9V-E9VOOQS1G.i1G.iO;lQ`O,5:xO;qQdO'#D}O;xQdO'#CuOOQO'#EU'#EUOOQO,5:n,5:nO-dQdO,5:nOOQP1G0W1G0WO)YQdO1G0WO<PQ!jO'#D^O<_Q!bO,59yO<gQhO,5:ROOQO'#Fu'#FuO<bQ!bO,59}O<oQhO'#FaO)}QhO,59{O)}QhO'#FaO=gQhO1G1TOOQS1G1T1G1TO=qQhO,5:PO>lQhO'#DoOOQW,5:Y,5:YOOQW,5:d,5:dOOQW,5:S,5:SO>vQhO,5:VO?bQ!fO'#FrOOQS'#Fr'#FrOOQS'#FS'#FSO@rQdO,59cOOQ[,59c,59cOAYQdO,59iOOQ[,59i,59iOApQdO,59lOOQ[,59l,59lOOQ[,59n,59nO)YQdO,59pOBWQhO'#EdOOQW'#Ed'#EdOBuQ`O1G0hO4oQhO1G0hOOQ[,59r,59rO)}QhO'#D[OOQ[,59t,59tOBzQ#tO,5:eOCVQhO'#F]OCdQ`O,5<jOOQS1G0n1G0nOOQS1G0p1G0pOOQS1G0r1G0rOCoQ`O1G0rOCtQdO'#ErOOQS1G0u1G0uOOQS1G0{1G0{ODPQaO,5:UO7fQ`O1G0}OOQS1G0}1G0}O0jQ`O1G0}OOQS-E9^-E9^OOQS1G1Q1G1QODWQ!fO1G0eODnQ`O'#EaOOQO1G0e1G0eOOQO,5;u,5;uODsQdO,5;uOOQO-E9X-E9XOEQQ`O1G2RPOOO-E8}-E8}POOO1G.g1G.gOOQP7+$`7+$`OOQP7+%r7+%rO)YQdO7+%rOOQS1G0d1G0dOE]QaO'#FzOEgQ`O,5:iOElQ!fO'#FROFjQdO'#FpOFtQ`O,59aOOQO1G0Y1G0YOFyQ!bO7+%rO)YQdO1G/eOGUQhO1G/iOOQW1G/m1G/mOOQW1G/g1G/gOGgQhO,5;{OOQW-E9_-E9_OOQS7+&o7+&oOH_QhO'#D^OHmQhO'#FxOHxQ`O'#FxOH}Q`O,5:ZOISQ!bO'#D`O>vQhO'#DmOI_QhO'#DqOIgQhO'#DsOIlQhO'#FwOOQO'#Fw'#FwOItQ!bO'#DwOOQO'#Fy'#FyOOQO'#Fv'#FvOIyQ`O1G/qOOQS-E9Q-E9QOOQ[1G.}1G.}OOQ[1G/T1G/TOOQ[1G/W1G/WOOQ[1G/[1G/[OJOQdO,5;OOOQS7+&S7+&SOJTQ`O7+&SOJYQhO'#D]OJbQ`O,59vO)}QhO,59vOOQ[1G0P1G0POJjQ`O1G0POJoQhO,5;wOOQO-E9Z-E9ZOOQS7+&^7+&^OJ}QbO'#DSOOQO'#Et'#EtOK]Q`O'#EsOOQO'#Es'#EsOKhQ`O'#F^OKpQdO,5;^OOQS,5;^,5;^OOQ[1G/p1G/pOOQS7+&i7+&iO7fQ`O7+&iOK{Q!fO'#FYO)YQdO'#FYOMSQdO7+&POOQO7+&P7+&POOQO,5:{,5:{OOQO1G1a1G1aOMgQ!bO<<I^OMrQdO'#FWOM|Q`O,5<fOOQP1G0T1G0TOOQS-E9P-E9PONUQdO'#FVON`Q`O,5<[OOQ]1G.{1G.{OOQP<<I^<<I^ONhQ`O<<I^ONmQdO7+%POOQO'#D`'#D`ONtQ!bO7+%TON|QhO'#FUO! ZQ`O,5<dO)YQdO,5<dOOQW1G/u1G/uO)YQdO,5:bO! cQ`O,5:XO>vQhO'#DrOOQO,5:],5:]O! hQhO,5:_OGUQhO,5:cOOQW7+%]7+%]OOQO'#Ef'#EfO! pQ`O1G0jOOQS<<In<<InO)YQdO,59wO!!dQhO1G/bOOQ[1G/b1G/bO!!kQ`O1G/bOOQW-E9R-E9ROOQ[7+%k7+%kOOQO,5;_,5;_OCwQdO'#F_OKhQ`O,5;xOOQS,5;x,5;xOOQS-E9[-E9[OOQS1G0x1G0xOOQS<<JT<<JTO!!sQ!fO,5;tOOQS-E9W-E9WOOQO<<Ik<<IkOOQPAN>xAN>xO!#zQ`OAN>xO!$PQaO,5;rOOQO-E9U-E9UO!$ZQdO,5;qOOQO-E9T-E9TOOQW<<Hk<<HkOOQW<<Ho<<HoO!$eQhO<<HoO!$vQhO,5;pO!%RQ`O,5;pOOQO-E9S-E9SO!%WQdO1G2OO!%bQdO1G/|O!%iQhO1G/sO!%qQ`O,5:^O>vQhO'#DuOOQO1G/y1G/yO!%vQ!bO1G/}OJOQdO'#F[O!&OQ`O7+&UOOQW7+&U7+&UO!&WQ!bO1G/cOOQ[7+$|7+$|O!&cQhO7+$|P!&jQ`O'#FTOOQO,5;y,5;yOOQO-E9]-E9]OOQS1G1d1G1dOOQPG24dG24dO!&oQ`OAN>ZO)YQdO1G1[O!&tQ`O7+'jOOQO1G/x1G/xO!&|Q`O,5:aO!$eQhO7+%iOOQO,5;v,5;vOOQO-E9Y-E9YOOQW<<Ip<<IpOOQ[<<Hh<<HhPOQW,5;o,5;oOOQWG23uG23uO!'RQdO7+&vOOQO1G/{1G/{OOQO<<IT<<IT",
	stateData: "!'f~O$[OS$]QQ~OWVO^_O`WOcYOdYOl`OmZOp[O!|]O#P^O#VdO#]eO#_fO#agO#dhO#jiO#ljO#okO$WRO$cTO~OQmOWVO^_O`WOcYOdYOl`OmZOp[O!|]O#P^O#VdO#]eO#_fO#agO#dhO#jiO#ljO#okO$WlO$cTO~O$U$oP~P!jO$]qO~O`YXcYXdYXmYXpYXsYX!dYX!|YX#PYX$VYX$c[X~OgYX~P$ZO$WsO~O$cuO~O$cuO`$bXc$bXd$bXm$bXp$bXs$bX!d$bX!|$bX#P$bX$V$bXg$bX~O$WvO~O`xOcyOdyOmzOp{O!||O#P!OO$V}O~Os!RO!d!PO~P&^Of!XO$W!TO$X!UO~O$W!YO~OW!^O$W![O$c!]O~OWVO^_O`WOcYOdYOmZOp[O!|]O#P^O$WRO$cTO~OS!fOc!gOd!gOh!cOs!RO!Y!eO!]!jO!`!kO$Y!bO~On!iO~P(dOQ!uOh!nOp!oOs!pOu!xOw!xO}!vO!n!wO$W!mO$X!sO$g!qO~OS!fOc!gOd!gOh!cO!Y!eO!]!jO!`!kO$Y!bO~Os$rP~P)}Ow!}O!n!wO$W!|O~Ow#PO$W#PO~Oh#SOs!RO#m#UO~O$W#WO~Oc#SX~P$ZOc#ZO~On#[O$U$oXr$oX~O$U$oXr$oX~P!jO$^#_O$_#_O$`#aO~Of#fO$W!TO$X!UO~Os!RO!d!PO~Or$oP~P!jOh#pO~Oh#qO~Oo!uX!y!uX$c!wX~O$W#rO~O$c#tO~Oo#uO!y#vO~O`xOcyOdyOmzOp{O~Os!{a!d!{a!|!{a#P!{a$V!{ag!{a~P-vOs#Oa!d#Oa!|#Oa#P#Oa$V#Oag#Oa~P-vOS!fOc!gOd!gOh!cO!Y!eO!]!jO!`!kO~OR#zOu#zOw#zO$Y#wO$g!qO~P/VOn$QO!U#}O!d$OO~P(dOh$SO~O$Y$UO~Oh#SO~Oh$WO~O`$YOc$YOg$]Ol$YOm$YOn$YO~P)YO`$YOc$YOl$YOm$YOn$YOo$_O~P)YO`$YOc$YOl$YOm$YOn$YOr$aO~P)YOP$bOSvXcvXdvXhvXnvXyvX!YvX!]vX!`vX#XvX#ZvX$YvX!WvXQvX`vXgvXlvXmvXpvXsvXuvXwvX}vX!nvX$WvX$XvX$gvXovXrvX!dvX$UvX$qvX!zvX~Oy$cO#X$dO#Z$eOn$rP~P)}Oh#qOS$eXc$eXd$eXn$eXy$eX!Y$eX!]$eX!`$eX#X$eX#Z$eX$Y$eXQ$eX`$eXg$eXl$eXm$eXp$eXs$eXu$eXw$eX}$eX!n$eX$W$eX$X$eX$g$eXo$eXr$eX!d$eX$U$eX$q$eX!z$eX~Oh$iO~Oh$kO~O!U#}O!d$lOs$rXn$rX~Os!RO~On$oOy$cO~On$pO~Ow$qO!n!wO~Os$rO~Os!RO!U#}O~Os!RO#m$xO~O$W#WOs#pX~O$q$|On#Ra$U#Rar#Ra~P)YOn#}X$U#}Xr#}X~P!jOn#[O$U$oar$oa~O$^#_O$_#_O$`%TO~Oo%VO!y%WO~Os!{i!d!{i!|!{i#P!{i$V!{ig!{i~P-vOs!}i!d!}i!|!}i#P!}i$V!}ig!}i~P-vOs#Oi!d#Oi!|#Oi#P#Oi$V#Oig#Oi~P-vOs#{a!d#{a~P&^Or%XO~Og$nP~P'oOg$dP~P)YOc!SXg!QX!U!QX!W!SX~Oc%aO!W%bO~Og%cO!U#}O~O!U#}OS$TXc$TXd$TXh$TXn$TXs$TX!Y$TX!]$TX!`$TX!d$TX$Y$TX~On%gO!d$OO~P(dO!U#}OS!Xac!Xad!Xah!Xan!Xas!Xa!Y!Xa!]!Xa!`!Xa!d!Xa$Y!Xag!Xa~O$Y%hOg$lP~P/VOR#zOS!fOh%mOu#zOw#zO!Y%nO$Y%lO$g!qO~Oy$cOQ$fX`$fXc$fXg$fXh$fXl$fXm$fXn$fXp$fXs$fXu$fXw$fX}$fX!n$fX$W$fX$X$fX$g$fXo$fXr$fX~O`$YOc$YOg%wOl$YOm$YOn$YO~P)YO`$YOc$YOl$YOm$YOn$YOo%xO~P)YO`$YOc$YOl$YOm$YOn$YOr%yO~P)YOh%{OS#WXc#WXd#WXn#WX!Y#WX!]#WX!`#WX$Y#WX~On%|O~Og&ROw&SO!o&SO~Os$PX!d$PXn$PX~P)}O!d$lOs$ran$ra~On&VO~Or&^O$W&XO$g&WO~Og&_O~P&^Oy$cO!d&cO$q$|On#Ri$U#Rir#Ri~P)YO$p&fO~On#}a$U#}ar#}a~P!jOn#[O$U$oir$oi~O!d&iOg$nX~P&^Og&kO~Oy$cOQ#uXg#uXh#uXp#uXs#uXu#uXw#uX}#uX!d#uX!n#uX$W#uX$X#uX$g#uX~O!d&mOg$dX~P)YOg&oO~Oo&pOy$cO!z&qO~OR#zOu#zOw#zO$Y&sO$g!qO~O!U#}OS$Tac$Tad$Tah$Tan$Tas$Ta!Y$Ta!]$Ta!`$Ta!d$Ta$Y$Ta~Oc!SXg!QX!U!QX!d!QX~O!U#}O!d&uOg$lX~Oc&wO~Og&xO~Oc&yOg!jX!W!SX~OS!fOh&{O~O!U&}O~O!U&}Og$kX~O!W'OO~Og'PO~O$W'QO~On'SO~Oc'TO!U#}O~Og'VOn'UO~Og'YO~O!U#}Os$Pa!d$Pan$Pa~OP$bOsvX!dvXgvX~O$g&WOs#gX!d#gX~Os!RO!d'[O~Or'`O$W&XO$g&WO~Oy$cOQ#|Xh#|Xn#|Xp#|Xs#|Xu#|Xw#|X}#|X!d#|X!n#|X$U#|X$W#|X$X#|X$g#|X$q#|Xr#|X~O!d&cO$q$|On#Rq$U#Rqr#Rq~P)YOo'eOy$cO!z'fO~Og#zX!d#zX~P'oO!d&iOg$na~Og#yX!d#yX~P)YO!d&mOg$da~Oo'eO~Og'kO~P)YOg'lO!W'mO~O$Y%hOg#xX!d#xX~P/VO!d&uOg$la~Og'sO~OS!fOh'uO~O`'xOg'zO~OS#wac#wad#wah#wa!Y#wa!]#wa!`#wa$Y#wa~Og'|O~P! xOg'|On'}O~Oy$cOQ#|ah#|an#|ap#|as#|au#|aw#|a}#|a!d#|a!n#|a$U#|a$W#|a$X#|a$g#|a$q#|ar#|a~Oo(SO~Og#za!d#za~P&^Og#ya!d#ya~P)YOR#zOu#zOw#zO$Y&sO$g&WO~O!U#}Og#xa!d#xa~Oc(UO~O!d&uOg$li~P)YOg!ji~P)YOg!ai!U!hi~Og(WO~O!W(YOg!ki~O`'xOg(]O~Oy$cOg!Pin!Pi~Og(^O~P! xOn(_O~Og(`O~O!d&uOg$lq~Og(bO~Og#xq!d#xq~P)YO$[!o$]$g`$gy#P~",
	goto: "7[$sPPPPP$tP$wP%Q%d%Q%v&YP%QP&`%QPP&fPPP&l&v&vPPPPP&vPP&vP'fP&vP&v(i&vP)X)[)b)b)t)bP)bP)bP)b)bP*a)bP*m*s+cP*m+f*m+i+`+o+o)b+uPP,k,q%Q,w%Q,},}-T-XPP%QP%Q%QP-_.Z.h.o$wP.xP.{P$wP$wP$wP/R$wP/U/X/[/c$wP$wPP$wP/h$wP/k/q0Q0l0z1Q1[1b1h1n1t2O2U2[2b2h2nPPPPPPPPPPP2t2}P3s3v4zP5S5|6c6o6u6o6x6{PP7RRrQ_aOPco!R#[%Pq_OP]^co|}!O!P!R#S#[#p%P&iqSOP]^co|}!O!P!R#S#[#p%P&iqUOP]^co|}!O!P!R#S#[#p%P&iQtTR#buQwWR#cxQ!VYR#dyQ#d!XS$h!t!uR%U#f!Z!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(a!Y!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(ab#z!c$W%b%m&{'O'm'u(YU&Z$r&]'[R'Z&Y!Z!tdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(aR$j!vQ&P$iR'W&Qq!h`ei!c!d!e!r#}$O$P$S$g$i$l&Q&uQ#x!cQ%j$SW%r$W%m&{'uQ&t%bQ'o&uQ'w'OQ(T'mR(c(YQ#VjQ$V!jQ$v#UR&a$xX%q$W%m&{'up!h`ei!c!d!e!r#}$O$P$S$g$i$l&Q&uW%p$W%m&{'uQ&|%nR'v&}R$T!fR&|%nX%o$W%m&{'uX%s$W%m&{'u!Y!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(aQ!}gR$q#OQ!WYR#eyQ#d!WR%U#eQ!ZZR#gzQ!_[R#h{T!^[{Q#s!]R%_#tQ!SXQ!i`Q#TjQ#n!QQ$Q!dQ$n!zQ$t#RQ$w#VQ$z#YQ%g$PQ&`$vQ'^&[Q'a&aR(R']SnP!RQ#^oQ%O#[R&g%PZmPo!R#[%PQ$}#ZQ&e${R'd&dR$g!rQ'R%{R(Z'xR#OgR#QhR$s#QS&[$r&]R(P'[V&Y$r&]'[R#YkQ#`qR%S#`QcOSoP!RU!lco%PR%P#[Q%]#q[&l%]&r'i'q'r(aQ&r%aQ'i&mQ'q&wQ'r&yR(a(UQ$[!nQ$^!oQ$`!pV%v$[$^$`Q&Q$iR'X&QQ&v%iS'p&v(VR(V'qQ&n%]R'j&nQ&j%YR'h&jQ!QXR#m!QQ&d${R'c&dQ#]nS%Q#]%RR%R#^Q'y'RR(['yQ$m!yR&U$mQ&]$rR'_&]Q']&[R(Q']Q#XkR$y#XQ$P!dR%f$P_bOPco!R#[%P^XOPco!R#[%PQ!`]Q!a^Q#i|Q#j}Q#k!OQ#l!PQ$u#SQ%Y#pR'g&iR%^#qQ!rdQ!{f[$X!n!o!p$[$^$`Q${#Zh%[#q%]%a&m&r&w&y'i'q'r(U(aQ%`#vQ%z$cS&b${&dQ&h%WQ'b&cR'{'T]$Z!n!o!p$[$^$`Q!d`U!ye!r$gQ#RiQ#y!cS#|!d$PQ$R!eQ%d#}Q%e$OQ%i$SS&O$i&QQ&T$lR'n&uQ#{!cW%r$W%m&{'uQ&t%bQ'w'OQ(T'mR(c(YQ%u$WQ&z%mQ't&{R(X'uX%t$W%m&{'uR%k$SR%Z#pQpPR#o!RQ!zeQ$f!rR%}$g",
	nodeNames: "⚠ Unit VariableName VariableName QueryCallee Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NamespacedTagSelector NamespaceName TagName NestingSelector ClassSelector . ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue AtKeyword # ; ] [ BracketedValue } { BracedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee IfExpression if ArgList IfBranch KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp ComparisonQuery CompareOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector ParenthesizedSelector StyleQuery style ParenthesedQuery CallQuery ArgList , UnaryQuery ParenthesedQuery BinaryQuery ParenthesedQuery ParenthesedQuery StyleFeature StyleRange PseudoQuery CallLiteral CallTag ParenthesizedContent PseudoClassName ArgList IdSelector IdName AttributeSelector AttributeName NamespacedAttribute NamespaceName AttributeName MatchOp MatchFlag ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block Declaration PropertyName Important ImportStatement import Layer layer LayerName layer MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports ScopeStatement scope to FontFeatureStatement font-feature-values FontName AtRule Styles",
	maxTerm: 172,
	nodeProps: [
		[
			"isolate",
			-2,
			5,
			39,
			""
		],
		[
			"openedBy",
			23,
			"(",
			31,
			"[",
			34,
			"{"
		],
		[
			"closedBy",
			24,
			")",
			32,
			"]",
			35,
			"}"
		]
	],
	propSources: [ke],
	skippedNodes: [
		0,
		5,
		127
	],
	repeatNodeCount: 17,
	tokenData: "K`~R!bOX%ZX^&R^p%Zpq&Rqr)ers)vst+jtu2Xuv%Zvw3Rwx3dxy5Ryz5dz{5i{|6S|}:u}!O;W!O!P;u!P!Q<^!Q![=V![!]>Q!]!^>|!^!_?_!_!`@Z!`!a@n!a!b%Z!b!cAo!c!k%Z!k!lC|!l!u%Z!u!vC|!v!}%Z!}#OD_#O#P%Z#P#QDp#Q#R2X#R#]%Z#]#^ER#^#g%Z#g#hC|#h#o%Z#o#pIf#p#qIw#q#rJ`#r#sJq#s#y%Z#y#z&R#z$f%Z$f$g&R$g#BY%Z#BY#BZ&R#BZ$IS%Z$IS$I_&R$I_$I|%Z$I|$JO&R$JO$JT%Z$JT$JU&R$JU$KV%Z$KV$KW&R$KW&FU%Z&FU&FV&R&FV;'S%Z;'S;=`KY<%lO%Z`%^SOy%jz;'S%j;'S;=`%{<%lO%j`%oS!o`Oy%jz;'S%j;'S;=`%{<%lO%j`&OP;=`<%l%j~&Wh$[~OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%j~'yh$[~!o`OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%jj)jS$qYOy%jz;'S%j;'S;=`%{<%lO%j~)yWOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d<%lO)v~*hOw~~*kRO;'S)v;'S;=`*t;=`O)v~*wXOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d;=`<%l)v<%lO)v~+gP;=`<%l)vj+oYmYOy%jz!Q%j!Q![,_![!c%j!c!i,_!i#T%j#T#Z,_#Z;'S%j;'S;=`%{<%lO%jj,dY!o`Oy%jz!Q%j!Q![-S![!c%j!c!i-S!i#T%j#T#Z-S#Z;'S%j;'S;=`%{<%lO%jj-XY!o`Oy%jz!Q%j!Q![-w![!c%j!c!i-w!i#T%j#T#Z-w#Z;'S%j;'S;=`%{<%lO%jj.OYuY!o`Oy%jz!Q%j!Q![.n![!c%j!c!i.n!i#T%j#T#Z.n#Z;'S%j;'S;=`%{<%lO%jj.uYuY!o`Oy%jz!Q%j!Q![/e![!c%j!c!i/e!i#T%j#T#Z/e#Z;'S%j;'S;=`%{<%lO%jj/jY!o`Oy%jz!Q%j!Q![0Y![!c%j!c!i0Y!i#T%j#T#Z0Y#Z;'S%j;'S;=`%{<%lO%jj0aYuY!o`Oy%jz!Q%j!Q![1P![!c%j!c!i1P!i#T%j#T#Z1P#Z;'S%j;'S;=`%{<%lO%jj1UY!o`Oy%jz!Q%j!Q![1t![!c%j!c!i1t!i#T%j#T#Z1t#Z;'S%j;'S;=`%{<%lO%jj1{SuY!o`Oy%jz;'S%j;'S;=`%{<%lO%jd2[UOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jd2uS!yS!o`Oy%jz;'S%j;'S;=`%{<%lO%jb3WS^QOy%jz;'S%j;'S;=`%{<%lO%j~3gWOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{<%lO3d~4SRO;'S3d;'S;=`4];=`O3d~4`XOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{;=`<%l3d<%lO3d~5OP;=`<%l3dj5WShYOy%jz;'S%j;'S;=`%{<%lO%j~5iOg~n5pUWQyWOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jj6ZWyW#PQOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj6xU!o`Oy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%jj7cY!o`$gYOy%jz!Q%j!Q![7[![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj8WY!o`Oy%jz{%j{|8v|}%j}!O8v!O!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj8{U!o`Oy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj9fU!o`$gYOy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj:P[!o`$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj:zS!dYOy%jz;'S%j;'S;=`%{<%lO%jj;]WyWOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj;zU`YOy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%j~<cTyWOy%jz{<r{;'S%j;'S;=`%{<%lO%j~<yS!o`$]~Oy%jz;'S%j;'S;=`%{<%lO%jj=[[$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj>VUcYOy%jz![%j![!]>i!];'S%j;'S;=`%{<%lO%jj>pSdY!o`Oy%jz;'S%j;'S;=`%{<%lO%jj?RSnYOy%jz;'S%j;'S;=`%{<%lO%jh?dU!WWOy%jz!_%j!_!`?v!`;'S%j;'S;=`%{<%lO%jh?}S!WW!o`Oy%jz;'S%j;'S;=`%{<%lO%jl@bS!WW!ySOy%jz;'S%j;'S;=`%{<%lO%jj@uV!|Q!WWOy%jz!_%j!_!`?v!`!aA[!a;'S%j;'S;=`%{<%lO%jbAcS!|Q!o`Oy%jz;'S%j;'S;=`%{<%lO%jjArYOy%jz}%j}!OBb!O!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjBgW!o`Oy%jz!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjCW[lY!o`Oy%jz}%j}!OCP!O!Q%j!Q![CP![!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jhDRS!zWOy%jz;'S%j;'S;=`%{<%lO%jjDdSpYOy%jz;'S%j;'S;=`%{<%lO%jnDuSo^Oy%jz;'S%j;'S;=`%{<%lO%jjEWU!zWOy%jz#a%j#a#bEj#b;'S%j;'S;=`%{<%lO%jbEoU!o`Oy%jz#d%j#d#eFR#e;'S%j;'S;=`%{<%lO%jbFWU!o`Oy%jz#c%j#c#dFj#d;'S%j;'S;=`%{<%lO%jbFoU!o`Oy%jz#f%j#f#gGR#g;'S%j;'S;=`%{<%lO%jbGWU!o`Oy%jz#h%j#h#iGj#i;'S%j;'S;=`%{<%lO%jbGoU!o`Oy%jz#T%j#T#UHR#U;'S%j;'S;=`%{<%lO%jbHWU!o`Oy%jz#b%j#b#cHj#c;'S%j;'S;=`%{<%lO%jbHoU!o`Oy%jz#h%j#h#iIR#i;'S%j;'S;=`%{<%lO%jbIYS$pQ!o`Oy%jz;'S%j;'S;=`%{<%lO%jjIkSsYOy%jz;'S%j;'S;=`%{<%lO%jfI|U$cUOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jjJeSrYOy%jz;'S%j;'S;=`%{<%lO%jfJvU#PQOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%j`K]P;=`<%l%Z",
	tokenizers: [
		De,
		Oe,
		Te,
		Ee,
		1,
		2,
		3,
		4,
		new b("m~RRYZ[z{a~~g~aO$_~~dP!P!Qg~lO$`~~", 28, 152)
	],
	topRules: {
		StyleSheet: [0, 6],
		Styles: [1, 126]
	},
	dynamicPrecedences: { 94: 1 },
	specialized: [
		{
			term: 147,
			get: (e) => Ae[e] || -1
		},
		{
			term: 148,
			get: (e) => je[e] || -1
		},
		{
			term: 4,
			get: (e) => Me[e] || -1
		},
		{
			term: 28,
			get: (e) => Ne[e] || -1
		},
		{
			term: 146,
			get: (e) => Pe[e] || -1
		}
	],
	tokenPrec: 2405
}), G = null;
function K() {
	if (!G && typeof document == "object" && document.body) {
		let { style: e } = document.body, t = [], n = /* @__PURE__ */ new Set();
		for (let r in e) r != "cssText" && r != "cssFloat" && typeof e[r] == "string" && (/[A-Z]/.test(r) && (r = r.replace(/[A-Z]/g, (e) => "-" + e.toLowerCase())), n.has(r) || (t.push(r), n.add(r)));
		G = t.sort().map((e) => ({
			type: "property",
			label: e,
			apply: e + ": "
		}));
	}
	return G || [];
}
var q = /*@__PURE__*/ (/* @__PURE__ */ "active.after.any-link.autofill.backdrop.before.checked.cue.default.defined.disabled.empty.enabled.file-selector-button.first.first-child.first-letter.first-line.first-of-type.focus.focus-visible.focus-within.fullscreen.has.host.host-context.hover.in-range.indeterminate.invalid.is.lang.last-child.last-of-type.left.link.marker.modal.not.nth-child.nth-last-child.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.part.placeholder.placeholder-shown.read-only.read-write.required.right.root.scope.selection.slotted.target.target-text.valid.visited.where".split(".")).map((e) => ({
	type: "class",
	label: e
})), J = /*@__PURE__*/ (/* @__PURE__ */ "above.absolute.activeborder.additive.activecaption.after-white-space.ahead.alias.all.all-scroll.alphabetic.alternate.always.antialiased.appworkspace.asterisks.attr.auto.auto-flow.avoid.avoid-column.avoid-page.avoid-region.axis-pan.background.backwards.baseline.below.bidi-override.blink.block.block-axis.bold.bolder.border.border-box.both.bottom.break.break-all.break-word.bullets.button.button-bevel.buttonface.buttonhighlight.buttonshadow.buttontext.calc.capitalize.caps-lock-indicator.caption.captiontext.caret.cell.center.checkbox.circle.cjk-decimal.clear.clip.close-quote.col-resize.collapse.color.color-burn.color-dodge.column.column-reverse.compact.condensed.contain.content.contents.content-box.context-menu.continuous.copy.counter.counters.cover.crop.cross.crosshair.currentcolor.cursive.cyclic.darken.dashed.decimal.decimal-leading-zero.default.default-button.dense.destination-atop.destination-in.destination-out.destination-over.difference.disc.discard.disclosure-closed.disclosure-open.document.dot-dash.dot-dot-dash.dotted.double.down.e-resize.ease.ease-in.ease-in-out.ease-out.element.ellipse.ellipsis.embed.end.ethiopic-abegede-gez.ethiopic-halehame-aa-er.ethiopic-halehame-gez.ew-resize.exclusion.expanded.extends.extra-condensed.extra-expanded.fantasy.fast.fill.fill-box.fixed.flat.flex.flex-end.flex-start.footnotes.forwards.from.geometricPrecision.graytext.grid.groove.hand.hard-light.help.hidden.hide.higher.highlight.highlighttext.horizontal.hsl.hsla.hue.icon.ignore.inactiveborder.inactivecaption.inactivecaptiontext.infinite.infobackground.infotext.inherit.initial.inline.inline-axis.inline-block.inline-flex.inline-grid.inline-table.inset.inside.intrinsic.invert.italic.justify.keep-all.landscape.large.larger.left.level.lighter.lighten.line-through.linear.linear-gradient.lines.list-item.listbox.listitem.local.logical.loud.lower.lower-hexadecimal.lower-latin.lower-norwegian.lowercase.ltr.luminosity.manipulation.match.matrix.matrix3d.medium.menu.menutext.message-box.middle.min-intrinsic.mix.monospace.move.multiple.multiple_mask_images.multiply.n-resize.narrower.ne-resize.nesw-resize.no-close-quote.no-drop.no-open-quote.no-repeat.none.normal.not-allowed.nowrap.ns-resize.numbers.numeric.nw-resize.nwse-resize.oblique.opacity.open-quote.optimizeLegibility.optimizeSpeed.outset.outside.outside-shape.overlay.overline.padding.padding-box.painted.page.paused.perspective.pinch-zoom.plus-darker.plus-lighter.pointer.polygon.portrait.pre.pre-line.pre-wrap.preserve-3d.progress.push-button.radial-gradient.radio.read-only.read-write.read-write-plaintext-only.rectangle.region.relative.repeat.repeating-linear-gradient.repeating-radial-gradient.repeat-x.repeat-y.reset.reverse.rgb.rgba.ridge.right.rotate.rotate3d.rotateX.rotateY.rotateZ.round.row.row-resize.row-reverse.rtl.run-in.running.s-resize.sans-serif.saturation.scale.scale3d.scaleX.scaleY.scaleZ.screen.scroll.scrollbar.scroll-position.se-resize.self-start.self-end.semi-condensed.semi-expanded.separate.serif.show.single.skew.skewX.skewY.skip-white-space.slide.slider-horizontal.slider-vertical.sliderthumb-horizontal.sliderthumb-vertical.slow.small.small-caps.small-caption.smaller.soft-light.solid.source-atop.source-in.source-out.source-over.space.space-around.space-between.space-evenly.spell-out.square.start.static.status-bar.stretch.stroke.stroke-box.sub.subpixel-antialiased.svg_masks.super.sw-resize.symbolic.symbols.system-ui.table.table-caption.table-cell.table-column.table-column-group.table-footer-group.table-header-group.table-row.table-row-group.text.text-bottom.text-top.textarea.textfield.thick.thin.threeddarkshadow.threedface.threedhighlight.threedlightshadow.threedshadow.to.top.transform.translate.translate3d.translateX.translateY.translateZ.transparent.ultra-condensed.ultra-expanded.underline.unidirectional-pan.unset.up.upper-latin.uppercase.url.var.vertical.vertical-text.view-box.visible.visibleFill.visiblePainted.visibleStroke.visual.w-resize.wait.wave.wider.window.windowframe.windowtext.words.wrap.wrap-reverse.x-large.x-small.xor.xx-large.xx-small".split(".")).map((e) => ({
	type: "keyword",
	label: e
})).concat(/*@__PURE__*/ (/* @__PURE__ */ "aliceblue.antiquewhite.aqua.aquamarine.azure.beige.bisque.black.blanchedalmond.blue.blueviolet.brown.burlywood.cadetblue.chartreuse.chocolate.coral.cornflowerblue.cornsilk.crimson.cyan.darkblue.darkcyan.darkgoldenrod.darkgray.darkgreen.darkkhaki.darkmagenta.darkolivegreen.darkorange.darkorchid.darkred.darksalmon.darkseagreen.darkslateblue.darkslategray.darkturquoise.darkviolet.deeppink.deepskyblue.dimgray.dodgerblue.firebrick.floralwhite.forestgreen.fuchsia.gainsboro.ghostwhite.gold.goldenrod.gray.grey.green.greenyellow.honeydew.hotpink.indianred.indigo.ivory.khaki.lavender.lavenderblush.lawngreen.lemonchiffon.lightblue.lightcoral.lightcyan.lightgoldenrodyellow.lightgray.lightgreen.lightpink.lightsalmon.lightseagreen.lightskyblue.lightslategray.lightsteelblue.lightyellow.lime.limegreen.linen.magenta.maroon.mediumaquamarine.mediumblue.mediumorchid.mediumpurple.mediumseagreen.mediumslateblue.mediumspringgreen.mediumturquoise.mediumvioletred.midnightblue.mintcream.mistyrose.moccasin.navajowhite.navy.oldlace.olive.olivedrab.orange.orangered.orchid.palegoldenrod.palegreen.paleturquoise.palevioletred.papayawhip.peachpuff.peru.pink.plum.powderblue.purple.rebeccapurple.red.rosybrown.royalblue.saddlebrown.salmon.sandybrown.seagreen.seashell.sienna.silver.skyblue.slateblue.slategray.snow.springgreen.steelblue.tan.teal.thistle.tomato.turquoise.violet.wheat.white.whitesmoke.yellow.yellowgreen".split(".")).map((e) => ({
	type: "constant",
	label: e
}))), Ie = /*@__PURE__*/ (/* @__PURE__ */ "a.abbr.address.article.aside.b.bdi.bdo.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.dd.del.details.dfn.dialog.div.dl.dt.em.figcaption.figure.footer.form.header.hgroup.h1.h2.h3.h4.h5.h6.hr.html.i.iframe.img.input.ins.kbd.label.legend.li.main.meter.nav.ol.output.p.pre.ruby.section.select.small.source.span.strong.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.tr.u.ul".split(".")).map((e) => ({
	type: "type",
	label: e
})), Le = /*@__PURE__*/ [
	"@charset",
	"@color-profile",
	"@container",
	"@counter-style",
	"@font-face",
	"@font-feature-values",
	"@font-palette-values",
	"@import",
	"@keyframes",
	"@layer",
	"@media",
	"@namespace",
	"@page",
	"@position-try",
	"@property",
	"@scope",
	"@starting-style",
	"@supports",
	"@view-transition"
].map((e) => ({
	type: "keyword",
	label: e
})), Y = /^(\w[\w-]*|-\w[\w-]*|)$/, Re = /^-(-[\w-]*)?$/;
function ze(e, t) {
	if ((e.name == "(" || e.type.isError) && (e = e.parent || e), e.name != "ArgList") return !1;
	let n = e.parent?.firstChild;
	return n?.name == "Callee" && t.sliceString(n.from, n.to) == "var";
}
var X = /*@__PURE__*/ new l(), Z = ["Declaration"];
function Be(e) {
	for (let t = e;;) {
		if (t.type.isTop) return t;
		if (!(t = t.parent)) return e;
	}
}
function Q(e, t, n) {
	if (t.to - t.from > 4096) {
		let r = X.get(t);
		if (r) return r;
		let i = [], a = /* @__PURE__ */ new Set(), o = t.cursor(m.IncludeAnonymous);
		if (o.firstChild()) do
			for (let t of Q(e, o.node, n)) a.has(t.label) || (a.add(t.label), i.push(t));
		while (o.nextSibling());
		return X.set(t, i), i;
	} else {
		let r = [], i = /* @__PURE__ */ new Set();
		return t.cursor().iterate((t) => {
			if (n(t) && t.matchContext(Z) && t.node.nextSibling?.name == ":") {
				let n = e.sliceString(t.from, t.to);
				i.has(n) || (i.add(n), r.push({
					label: n,
					type: "variable"
				}));
			}
		}), r;
	}
}
var Ve = /*@__PURE__*/ ((e) => (t) => {
	let { state: n, pos: r } = t, i = o(n).resolveInner(r, -1), a = i.type.isError && i.from == i.to - 1 && n.doc.sliceString(i.from, i.to) == "-";
	if (i.name == "PropertyName" || (a || i.name == "TagName") && /^(Block|Styles)$/.test(i.resolve(i.to).name)) return {
		from: i.from,
		options: K(),
		validFor: Y
	};
	if (i.name == "ValueName") return {
		from: i.from,
		options: J,
		validFor: Y
	};
	if (i.name == "PseudoClassName") return {
		from: i.from,
		options: q,
		validFor: Y
	};
	if (e(i) || (t.explicit || a) && ze(i, n.doc)) return {
		from: e(i) || a ? i.from : r,
		options: Q(n.doc, Be(i), e),
		validFor: Re
	};
	if (i.name == "TagName") {
		for (let { parent: e } = i; e; e = e.parent) if (e.name == "Block") return {
			from: i.from,
			options: K(),
			validFor: Y
		};
		return {
			from: i.from,
			options: Ie,
			validFor: Y
		};
	}
	if (i.name == "AtKeyword") return {
		from: i.from,
		options: Le,
		validFor: Y
	};
	if (!t.explicit) return null;
	let s = i.resolve(r), c = s.childBefore(r);
	return c && c.name == ":" && s.name == "PseudoClassSelector" ? {
		from: r,
		options: q,
		validFor: Y
	} : c && c.name == ":" && s.name == "Declaration" || s.name == "ArgList" ? {
		from: r,
		options: J,
		validFor: Y
	} : s.name == "Block" || s.name == "Styles" ? {
		from: r,
		options: K(),
		validFor: Y
	} : null;
})((e) => e.name == "VariableName"), $ = /*@__PURE__*/ f.define({
	name: "css",
	parser: /*@__PURE__*/ Fe.configure({ props: [/*@__PURE__*/ t.add({ Declaration: /*@__PURE__*/ ee() }), /*@__PURE__*/ c.add({ "Block KeyframeList": te })] }),
	languageData: {
		commentTokens: { block: {
			open: "/*",
			close: "*/"
		} },
		indentOnInput: /^\s*\}$/,
		wordChars: "-"
	}
});
function He() {
	return new p($, $.data.of({ autocomplete: Ve }));
}
//#endregion
export { A as a, x as i, $ as n, b as o, ue as r, He as t };

