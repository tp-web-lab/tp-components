import { getCodeFromFile as e, getCodeFromScript as t } from "../utilities/code.js";
import { t as n } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { hasComponentMarkdownSourceBase as r, resolveComponentSourceUrl as i } from "../utilities/source-url.js";
import "./button.js";
import { t as a } from "./dropdown.js";
import "./fullscreen.js";
import "./theme.js";
import "./copy-code.js";
import { $ as o, A as s, B as c, C as l, Ct as u, D as d, Dt as f, E as p, Et as m, F as h, G as g, H as _, I as ee, J as te, K as ne, L as re, M as v, N as ie, O as y, Ot as ae, P as oe, Q as se, R as ce, S as le, St as ue, T as de, Tt as fe, U as pe, V as me, W as b, X as he, Y as ge, Z as _e, _ as x, _t as ve, a as ye, at as S, b as be, bt as C, c as xe, ct as Se, d as Ce, dt as w, et as we, f as Te, ft as Ee, g as De, gt as Oe, h as ke, ht as Ae, i as je, it as Me, j as T, k as Ne, kt as Pe, l as Fe, lt as Ie, m as Le, mt as Re, n as ze, nt as Be, o as E, p as Ve, pt as D, q as He, r as Ue, rt as We, s as Ge, t as Ke, tt as qe, u as O, ut as Je, v as Ye, vt as Xe, w as Ze, wt as k, x as Qe, xt as $e, y as et, yt as tt, z as nt } from "./dist.js";
import { codeCommentMarkers as rt } from "../components/code-editor/code-comment-markers.js";
import "./badge.js";
import { abcBaseTheme as it, abcLanguage as at } from "../components/code-editor/abc-language.js";
//#region ../node_modules/.pnpm/@codemirror+autocomplete@6.20.3/node_modules/@codemirror/autocomplete/dist/index.js
var ot = class {
	constructor(e, t, n, r) {
		this.state = e, this.pos = t, this.explicit = n, this.view = r, this.abortListeners = [], this.abortOnDocChange = !1;
	}
	tokenBefore(e) {
		let t = y(this.state).resolveInner(this.pos, -1);
		for (; t && e.indexOf(t.name) < 0;) t = t.parent;
		return t ? {
			from: t.from,
			to: this.pos,
			text: this.state.sliceDoc(t.from, this.pos),
			type: t.type
		} : null;
	}
	matchBefore(e) {
		let t = this.state.doc.lineAt(this.pos), n = Math.max(t.from, this.pos - 250), r = t.text.slice(n - t.from, this.pos - t.from), i = r.search(pt(e, !1));
		return i < 0 ? null : {
			from: n + i,
			to: this.pos,
			text: r.slice(i)
		};
	}
	get aborted() {
		return this.abortListeners == null;
	}
	addEventListener(e, t, n) {
		e == "abort" && this.abortListeners && (this.abortListeners.push(t), n && n.onDocChange && (this.abortOnDocChange = !0));
	}
};
function st(e) {
	let t = Object.keys(e).join(""), n = /\w/.test(t);
	return n && (t = t.replace(/\w/g, "")), `[${n ? "\\w" : ""}${t.replace(/[^\w\s]/g, "\\$&")}]`;
}
function ct(e) {
	let t = Object.create(null), n = Object.create(null);
	for (let { label: r } of e) {
		t[r[0]] = !0;
		for (let e = 1; e < r.length; e++) n[r[e]] = !0;
	}
	let r = st(t) + st(n) + "*$";
	return [RegExp("^" + r), new RegExp(r)];
}
function lt(e) {
	let t = e.map((e) => typeof e == "string" ? { label: e } : e), [n, r] = t.every((e) => /^\w+$/.test(e.label)) ? [/\w*$/, /\w+$/] : ct(t);
	return (e) => {
		let i = e.matchBefore(r);
		return i || e.explicit ? {
			from: i ? i.from : e.pos,
			options: t,
			validFor: n
		} : null;
	};
}
function ut(e, t) {
	return (n) => {
		for (let t = y(n.state).resolveInner(n.pos, -1); t; t = t.parent) {
			if (e.indexOf(t.name) > -1) return null;
			if (t.type.isTop) break;
		}
		return t(n);
	};
}
var dt = class {
	constructor(e, t, n, r) {
		this.completion = e, this.source = t, this.match = n, this.score = r;
	}
};
function ft(e) {
	return e.selection.main.from;
}
function pt(e, t) {
	let { source: n } = e, r = t && n[0] != "^", i = n[n.length - 1] != "$";
	return !r && !i ? e : RegExp(`${r ? "^" : ""}(?:${n})${i ? "$" : ""}`, e.flags ?? (e.ignoreCase ? "i" : ""));
}
var mt = /*@__PURE__*/ Se.define();
function ht(e, t, n, r) {
	let { main: i } = e.selection, a = n - i.from, o = r - i.from;
	return {
		...e.changeByRange((s) => {
			if (s != i && n != r && e.sliceDoc(s.from + a, s.from + o) != e.sliceDoc(n, r)) return { range: s };
			let c = e.toText(t);
			return {
				changes: {
					from: s.from + a,
					to: r == i.from ? s.to : s.from + o,
					insert: c
				},
				range: D.cursor(s.from + a + c.length)
			};
		}),
		scrollIntoView: !0,
		userEvent: "input.complete"
	};
}
var gt = /*@__PURE__*/ new WeakMap();
function _t(e) {
	if (!Array.isArray(e)) return e;
	let t = gt.get(e);
	return t || gt.set(e, t = lt(e)), t;
}
var vt = /*@__PURE__*/ C.define(), yt = /*@__PURE__*/ C.define(), bt = class {
	constructor(e) {
		this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
		for (let t = 0; t < e.length;) {
			let n = k(e, t), r = fe(n);
			this.chars.push(n);
			let i = e.slice(t, t + r), a = i.toUpperCase();
			this.folded.push(k(a == i ? i.toLowerCase() : a, 0)), t += r;
		}
		this.astral = e.length != this.chars.length;
	}
	ret(e, t) {
		return this.score = e, this.matched = t, this;
	}
	match(e) {
		if (this.pattern.length == 0) return this.ret(-100, []);
		if (e.length < this.pattern.length) return null;
		let { chars: t, folded: n, any: r, precise: i, byWord: a } = this;
		if (t.length == 1) {
			let r = k(e, 0), i = fe(r), a = i == e.length ? 0 : -100;
			if (r != t[0]) if (r == n[0]) a += -200;
			else return null;
			return this.ret(a, [0, i]);
		}
		let o = e.indexOf(this.pattern);
		if (o == 0) return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
		let s = t.length, c = 0;
		if (o < 0) {
			for (let i = 0, a = Math.min(e.length, 200); i < a && c < s;) {
				let a = k(e, i);
				(a == t[c] || a == n[c]) && (r[c++] = i), i += fe(a);
			}
			if (c < s) return null;
		}
		let l = 0, u = 0, d = !1, f = 0, p = -1, m = -1, h = /[a-z]/.test(e), g = !0;
		for (let r = 0, c = Math.min(e.length, 200), _ = 0; r < c && u < s;) {
			let c = k(e, r);
			o < 0 && (l < s && c == t[l] && (i[l++] = r), f < s && (c == t[f] || c == n[f] ? (f == 0 && (p = r), m = r + 1, f++) : f = 0));
			let ee, te = c < 255 ? c >= 48 && c <= 57 || c >= 97 && c <= 122 ? 2 : +(c >= 65 && c <= 90) : (ee = Pe(c)) == ee.toLowerCase() ? ee == ee.toUpperCase() ? 0 : 2 : 1;
			(!r || te == 1 && h || _ == 0 && te != 0) && (t[u] == c || n[u] == c && (d = !0) ? a[u++] = r : a.length && (g = !1)), _ = te, r += fe(c);
		}
		return u == s && a[0] == 0 && g ? this.result(-100 + (d ? -200 : 0), a, e) : f == s && p == 0 ? this.ret(-200 - e.length + (m == e.length ? 0 : -100), [0, m]) : o > -1 ? this.ret(-700 - e.length, [o, o + this.pattern.length]) : f == s ? this.ret(-900 - e.length, [p, m]) : u == s ? this.result(-100 + (d ? -200 : 0) + -700 + (g ? 0 : -1100), a, e) : t.length == 2 ? null : this.result((r[0] ? -700 : 0) + -200 + -1100, r, e);
	}
	result(e, t, n) {
		let r = [], i = 0;
		for (let e of t) {
			let t = e + (this.astral ? fe(k(n, e)) : 1);
			i && r[i - 1] == e ? r[i - 1] = t : (r[i++] = e, r[i++] = t);
		}
		return this.ret(e - n.length, r);
	}
}, xt = class {
	constructor(e) {
		this.pattern = e, this.matched = [], this.score = 0, this.folded = e.toLowerCase();
	}
	match(e) {
		if (e.length < this.pattern.length) return null;
		let t = e.slice(0, this.pattern.length), n = t == this.pattern ? 0 : t.toLowerCase() == this.folded ? -200 : null;
		return n == null ? null : (this.matched = [0, t.length], this.score = n + (e.length == this.pattern.length ? 0 : -100), this);
	}
}, A = /*@__PURE__*/ Ae.define({ combine(e) {
	return m(e, {
		activateOnTyping: !0,
		activateOnCompletion: () => !1,
		activateOnTypingDelay: 100,
		selectOnOpen: !0,
		override: null,
		closeOnBlur: !0,
		maxRenderedOptions: 100,
		defaultKeymap: !0,
		tooltipClass: () => "",
		optionClass: () => "",
		aboveCursor: !1,
		icons: !0,
		addToOptions: [],
		positionInfo: Ct,
		filterStrict: !1,
		compareCompletions: (e, t) => (e.sortText || e.label).localeCompare(t.sortText || t.label),
		interactionDelay: 75,
		updateSyncTime: 100
	}, {
		defaultKeymap: (e, t) => e && t,
		closeOnBlur: (e, t) => e && t,
		icons: (e, t) => e && t,
		tooltipClass: (e, t) => (n) => St(e(n), t(n)),
		optionClass: (e, t) => (n) => St(e(n), t(n)),
		addToOptions: (e, t) => e.concat(t),
		filterStrict: (e, t) => e || t
	});
} });
function St(e, t) {
	return e ? t ? e + " " + t : e : t;
}
function Ct(e, t, n, r, i, a) {
	let o = e.textDirection == pe.RTL, s = o, c = !1, l = "top", u, d, f = t.left - i.left, p = i.right - t.right, m = r.right - r.left, h = r.bottom - r.top;
	if (s && f < Math.min(m, p) ? s = !1 : !s && p < Math.min(m, f) && (s = !0), m <= (s ? f : p)) u = Math.max(i.top, Math.min(n.top, i.bottom - h)) - t.top, d = Math.min(400, s ? f : p);
	else {
		c = !0, d = Math.min(400, (o ? t.right : i.right - t.left) - 30);
		let e = i.bottom - t.bottom;
		e >= h || e > t.top ? u = n.bottom - t.top : (l = "bottom", u = t.bottom - n.top);
	}
	let g = (t.bottom - t.top) / a.offsetHeight, _ = (t.right - t.left) / a.offsetWidth;
	return {
		style: `${l}: ${u / g}px; max-width: ${d / _}px`,
		class: "cm-completionInfo-" + (c ? o ? "left-narrow" : "right-narrow" : s ? "left" : "right")
	};
}
var wt = /*@__PURE__*/ C.define();
function Tt(e) {
	let t = e.addToOptions.slice();
	return e.icons && t.push({
		render(e) {
			let t = document.createElement("div");
			return t.classList.add("cm-completionIcon"), e.type && t.classList.add(...e.type.split(/\s+/g).map((e) => "cm-completionIcon-" + e)), t.setAttribute("aria-hidden", "true"), t;
		},
		position: 20
	}), t.push({
		render(e, t, n, r) {
			let i = document.createElement("span");
			i.className = "cm-completionLabel";
			let a = e.displayLabel || e.label, o = 0;
			for (let e = 0; e < r.length;) {
				let t = r[e++], n = r[e++];
				t > o && i.appendChild(document.createTextNode(a.slice(o, t)));
				let s = i.appendChild(document.createElement("span"));
				s.appendChild(document.createTextNode(a.slice(t, n))), s.className = "cm-completionMatchedText", o = n;
			}
			return o < a.length && i.appendChild(document.createTextNode(a.slice(o))), i;
		},
		position: 50
	}, {
		render(e) {
			if (!e.detail) return null;
			let t = document.createElement("span");
			return t.className = "cm-completionDetail", t.textContent = e.detail, t;
		},
		position: 80
	}), t.sort((e, t) => e.position - t.position).map((e) => e.render);
}
function Et(e, t, n) {
	if (e <= n) return {
		from: 0,
		to: e
	};
	if (t < 0 && (t = 0), t <= e >> 1) {
		let e = Math.floor(t / n);
		return {
			from: e * n,
			to: (e + 1) * n
		};
	}
	let r = Math.ceil((e - t) / n);
	return {
		from: e - r * n,
		to: e - (r - 1) * n
	};
}
var Dt = class {
	constructor(e, t, n) {
		this.view = e, this.stateField = t, this.applyCompletion = n, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
			read: () => this.measureInfo(),
			write: (e) => this.placeInfo(e),
			key: this
		}, this.space = null, this.currentClass = "";
		let r = e.state.field(t), { options: i, selected: a } = r.open, o = e.state.facet(A);
		this.optionContent = Tt(o), this.optionClass = o.optionClass, this.tooltipClass = o.tooltipClass, this.range = Et(i.length, a, o.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (n) => {
			let { options: r } = e.state.field(t).open;
			for (let t = n.target, i; t && t != this.dom; t = t.parentNode) if (t.nodeName == "LI" && (i = /-(\d+)$/.exec(t.id)) && +i[1] < r.length) {
				this.applyCompletion(e, r[+i[1]]), n.preventDefault();
				return;
			}
			if (n.target == this.list) {
				let t = this.list.classList.contains("cm-completionListIncompleteTop") && n.clientY < this.list.firstChild.getBoundingClientRect().top ? this.range.from - 1 : this.list.classList.contains("cm-completionListIncompleteBottom") && n.clientY > this.list.lastChild.getBoundingClientRect().bottom ? this.range.to : null;
				t != null && (e.dispatch({ effects: wt.of(t) }), n.preventDefault());
			}
		}), this.dom.addEventListener("focusout", (t) => {
			let n = e.state.field(this.stateField, !1);
			n && n.tooltip && e.state.facet(A).closeOnBlur && t.relatedTarget != e.contentDOM && e.dispatch({ effects: yt.of(null) });
		}), this.showOptions(i, r.id);
	}
	mount() {
		this.updateSel();
	}
	showOptions(e, t) {
		this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
			this.info && this.view.requestMeasure(this.placeInfoReq);
		});
	}
	update(e) {
		let t = e.state.field(this.stateField), n = e.startState.field(this.stateField);
		if (this.updateTooltipClass(e.state), t != n) {
			let { options: r, selected: i, disabled: a } = t.open;
			(!n.open || n.open.options != r) && (this.range = Et(r.length, i, e.state.facet(A).maxRenderedOptions), this.showOptions(r, t.id)), this.updateSel(), a != n.open?.disabled && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!a);
		}
	}
	updateTooltipClass(e) {
		let t = this.tooltipClass(e);
		if (t != this.currentClass) {
			for (let e of this.currentClass.split(" ")) e && this.dom.classList.remove(e);
			for (let e of t.split(" ")) e && this.dom.classList.add(e);
			this.currentClass = t;
		}
	}
	positioned(e) {
		this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
	}
	updateSel() {
		let e = this.view.state.field(this.stateField), t = e.open;
		(t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = Et(t.options.length, t.selected, this.view.state.facet(A).maxRenderedOptions), this.showOptions(t.options, e.id));
		let n = this.updateSelectedOption(t.selected);
		if (n) {
			this.destroyInfo();
			let { completion: r } = t.options[t.selected], { info: i } = r;
			if (!i) return;
			let a = typeof i == "string" ? document.createTextNode(i) : i(r);
			if (!a) return;
			"then" in a ? a.then((t) => {
				t && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(t, r);
			}).catch((e) => se(this.view.state, e, "completion info")) : (this.addInfoPane(a, r), n.setAttribute("aria-describedby", this.info.id));
		}
	}
	addInfoPane(e, t) {
		this.destroyInfo();
		let n = this.info = document.createElement("div");
		if (n.className = "cm-tooltip cm-completionInfo", n.id = "cm-completionInfo-" + Math.floor(Math.random() * 65535).toString(16), e.nodeType != null) n.appendChild(e), this.infoDestroy = null;
		else {
			let { dom: t, destroy: r } = e;
			n.appendChild(t), this.infoDestroy = r || null;
		}
		this.dom.appendChild(n), this.view.requestMeasure(this.placeInfoReq);
	}
	updateSelectedOption(e) {
		let t = null;
		for (let n = this.list.firstChild, r = this.range.from; n; n = n.nextSibling, r++) n.nodeName != "LI" || !n.id ? r-- : r == e ? n.hasAttribute("aria-selected") || (n.setAttribute("aria-selected", "true"), t = n) : n.hasAttribute("aria-selected") && (n.removeAttribute("aria-selected"), n.removeAttribute("aria-describedby"));
		return t && kt(this.list, t), t;
	}
	measureInfo() {
		let e = this.dom.querySelector("[aria-selected]");
		if (!e || !this.info) return null;
		let t = this.dom.getBoundingClientRect(), n = this.info.getBoundingClientRect(), r = e.getBoundingClientRect(), i = this.space;
		if (!i) {
			let e = this.dom.ownerDocument.documentElement;
			i = {
				left: 0,
				top: 0,
				right: e.clientWidth,
				bottom: e.clientHeight
			};
		}
		return r.top > Math.min(i.bottom, t.bottom) - 10 || r.bottom < Math.max(i.top, t.top) + 10 ? null : this.view.state.facet(A).positionInfo(this.view, t, r, n, i, this.dom);
	}
	placeInfo(e) {
		this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
	}
	createListBox(e, t, n) {
		let r = document.createElement("ul");
		r.id = t, r.setAttribute("role", "listbox"), r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-label", this.view.state.phrase("Completions")), r.addEventListener("mousedown", (e) => {
			e.target == r && e.preventDefault();
		});
		let i = null;
		for (let a = n.from; a < n.to; a++) {
			let { completion: o, match: s } = e[a], { section: c } = o;
			if (c) {
				let e = typeof c == "string" ? c : c.name;
				if (e != i && (a > n.from || n.from == 0)) if (i = e, typeof c != "string" && c.header) r.appendChild(c.header(c));
				else {
					let t = r.appendChild(document.createElement("completion-section"));
					t.textContent = e;
				}
			}
			let l = r.appendChild(document.createElement("li"));
			l.id = t + "-" + a, l.setAttribute("role", "option");
			let u = this.optionClass(o);
			u && (l.className = u);
			for (let e of this.optionContent) {
				let t = e(o, this.view.state, this.view, s);
				t && l.appendChild(t);
			}
		}
		return n.from && r.classList.add("cm-completionListIncompleteTop"), n.to < e.length && r.classList.add("cm-completionListIncompleteBottom"), r;
	}
	destroyInfo() {
		this.info &&= (this.infoDestroy && this.infoDestroy(), this.info.remove(), null);
	}
	destroy() {
		this.destroyInfo();
	}
};
function Ot(e, t) {
	return (n) => new Dt(n, e, t);
}
function kt(e, t) {
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect(), i = n.height / e.offsetHeight;
	r.top < n.top ? e.scrollTop -= (n.top - r.top) / i : r.bottom > n.bottom && (e.scrollTop += (r.bottom - n.bottom) / i);
}
function At(e) {
	return (e.boost || 0) * 100 + (e.apply ? 10 : 0) + (e.info ? 5 : 0) + +!!e.type;
}
function jt(e, t) {
	let n = [], r = null, i = null, a = (e) => {
		n.push(e);
		let { section: t } = e.completion;
		if (t) {
			r ||= [];
			let e = typeof t == "string" ? t : t.name;
			r.some((t) => t.name == e) || r.push(typeof t == "string" ? { name: e } : t);
		}
	}, o = t.facet(A);
	for (let r of e) if (r.hasResult()) {
		let e = r.result.getMatch;
		if (r.result.filter === !1) for (let t of r.result.options) a(new dt(t, r.source, e ? e(t) : [], 1e9 - n.length));
		else {
			let n = t.sliceDoc(r.from, r.to), s, c = o.filterStrict ? new xt(n) : new bt(n);
			for (let t of r.result.options) if (s = c.match(t.label)) {
				let n = t.displayLabel ? e ? e(t, s.matched) : [] : s.matched, o = s.score + (t.boost || 0);
				if (a(new dt(t, r.source, n, o)), typeof t.section == "object" && t.section.rank === "dynamic") {
					let { name: e } = t.section;
					i ||= Object.create(null), i[e] = Math.max(o, i[e] || -1e9);
				}
			}
		}
	}
	if (r) {
		let e = Object.create(null), t = 0, a = (e, t) => (e.rank === "dynamic" && t.rank === "dynamic" ? i[t.name] - i[e.name] : 0) || (typeof e.rank == "number" ? e.rank : 1e9) - (typeof t.rank == "number" ? t.rank : 1e9) || (e.name < t.name ? -1 : 1);
		for (let n of r.sort(a)) t -= 1e5, e[n.name] = t;
		for (let t of n) {
			let { section: n } = t.completion;
			n && (t.score += e[typeof n == "string" ? n : n.name]);
		}
	}
	let s = [], c = null, l = o.compareCompletions;
	for (let e of n.sort((e, t) => t.score - e.score || l(e.completion, t.completion))) {
		let t = e.completion;
		!c || c.label != t.label || c.detail != t.detail || c.type != null && t.type != null && c.type != t.type || c.apply != t.apply || c.boost != t.boost ? s.push(e) : At(e.completion) > At(c) && (s[s.length - 1] = e), c = e.completion;
	}
	return s;
}
var Mt = class e {
	constructor(e, t, n, r, i, a) {
		this.options = e, this.attrs = t, this.tooltip = n, this.timestamp = r, this.selected = i, this.disabled = a;
	}
	setSelected(t, n) {
		return t == this.selected || t >= this.options.length ? this : new e(this.options, Lt(n, t), this.tooltip, this.timestamp, t, this.disabled);
	}
	static build(t, n, r, i, a, o) {
		if (i && !o && t.some((e) => e.isPending)) return i.setDisabled();
		let s = jt(t, n);
		if (!s.length) return i && t.some((e) => e.isPending) ? i.setDisabled() : null;
		let c = n.facet(A).selectOnOpen ? 0 : -1;
		if (i && i.selected != c && i.selected != -1) {
			let e = i.options[i.selected].completion;
			for (let t = 0; t < s.length; t++) if (s[t].completion == e) {
				c = t;
				break;
			}
		}
		return new e(s, Lt(r, c), {
			pos: t.reduce((e, t) => t.hasResult() ? Math.min(e, t.from) : e, 1e8),
			create: Gt,
			above: a.aboveCursor
		}, i ? i.timestamp : Date.now(), c, !1);
	}
	map(t) {
		return new e(this.options, this.attrs, {
			...this.tooltip,
			pos: t.mapPos(this.tooltip.pos)
		}, this.timestamp, this.selected, this.disabled);
	}
	setDisabled() {
		return new e(this.options, this.attrs, this.tooltip, this.timestamp, this.selected, !0);
	}
}, Nt = class e {
	constructor(e, t, n) {
		this.active = e, this.id = t, this.open = n;
	}
	static start() {
		return new e(Rt, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
	}
	update(t) {
		let { state: n } = t, r = n.facet(A), i = (r.override || n.languageDataAt("autocomplete", ft(n)).map(_t)).map((e) => (this.active.find((t) => t.source == e) || new Bt(e, +!!this.active.some((e) => e.state != 0))).update(t, r));
		i.length == this.active.length && i.every((e, t) => e == this.active[t]) && (i = this.active);
		let a = this.open, o = t.effects.some((e) => e.is(Ut));
		a && t.docChanged && (a = a.map(t.changes)), t.selection || i.some((e) => e.hasResult() && t.changes.touchesRange(e.from, e.to)) || !Pt(i, this.active) || o ? a = Mt.build(i, n, this.id, a, r, o) : a && a.disabled && !i.some((e) => e.isPending) && (a = null), !a && i.every((e) => !e.isPending) && i.some((e) => e.hasResult()) && (i = i.map((e) => e.hasResult() ? new Bt(e.source, 0) : e));
		for (let e of t.effects) e.is(wt) && (a &&= a.setSelected(e.value, this.id));
		return i == this.active && a == this.open ? this : new e(i, this.id, a);
	}
	get tooltip() {
		return this.open ? this.open.tooltip : null;
	}
	get attrs() {
		return this.open ? this.open.attrs : this.active.length ? Ft : It;
	}
};
function Pt(e, t) {
	if (e == t) return !0;
	for (let n = 0, r = 0;;) {
		for (; n < e.length && !e[n].hasResult();) n++;
		for (; r < t.length && !t[r].hasResult();) r++;
		let i = n == e.length, a = r == t.length;
		if (i || a) return i == a;
		if (e[n++].result != t[r++].result) return !1;
	}
}
var Ft = { "aria-autocomplete": "list" }, It = {};
function Lt(e, t) {
	let n = {
		"aria-autocomplete": "list",
		"aria-haspopup": "listbox",
		"aria-controls": e
	};
	return t > -1 && (n["aria-activedescendant"] = e + "-" + t), n;
}
var Rt = [];
function zt(e, t) {
	if (e.isUserEvent("input.complete")) {
		let n = e.annotation(mt);
		if (n && t.activateOnCompletion(n)) return 12;
	}
	let n = e.isUserEvent("input.type");
	return n && t.activateOnTyping ? 5 : n ? 1 : e.isUserEvent("delete.backward") ? 2 : e.selection ? 8 : e.docChanged ? 16 : 0;
}
var Bt = class e {
	constructor(e, t, n = !1) {
		this.source = e, this.state = t, this.explicit = n;
	}
	hasResult() {
		return !1;
	}
	get isPending() {
		return this.state == 1;
	}
	update(t, n) {
		let r = zt(t, n), i = this;
		(r & 8 || r & 16 && this.touches(t)) && (i = new e(i.source, 0)), r & 4 && i.state == 0 && (i = new e(this.source, 1)), i = i.updateFor(t, r);
		for (let n of t.effects) if (n.is(vt)) i = new e(i.source, 1, n.value);
		else if (n.is(yt)) i = new e(i.source, 0);
		else if (n.is(Ut)) for (let e of n.value) e.source == i.source && (i = e);
		return i;
	}
	updateFor(e, t) {
		return this.map(e.changes);
	}
	map(e) {
		return this;
	}
	touches(e) {
		return e.changes.touchesRange(ft(e.state));
	}
}, Vt = class e extends Bt {
	constructor(e, t, n, r, i, a) {
		super(e, 3, t), this.limit = n, this.result = r, this.from = i, this.to = a;
	}
	hasResult() {
		return !0;
	}
	updateFor(t, n) {
		if (!(n & 3)) return this.map(t.changes);
		let r = this.result;
		r.map && !t.changes.empty && (r = r.map(r, t.changes));
		let i = t.changes.mapPos(this.from), a = t.changes.mapPos(this.to, 1), o = ft(t.state);
		if (o > a || !r || n & 2 && (ft(t.startState) == this.from || o < this.limit)) return new Bt(this.source, n & 4 ? 1 : 0);
		let s = t.changes.mapPos(this.limit);
		return Ht(r.validFor, t.state, i, a) ? new e(this.source, this.explicit, s, r, i, a) : r.update && (r = r.update(r, i, a, new ot(t.state, o, !1))) ? new e(this.source, this.explicit, s, r, r.from, r.to ?? ft(t.state)) : new Bt(this.source, 1, this.explicit);
	}
	map(t) {
		if (t.empty) return this;
		let n = this.result.map ? this.result.map(this.result, t) : this.result;
		return n ? new e(this.source, this.explicit, t.mapPos(this.limit), n, t.mapPos(this.from), t.mapPos(this.to, 1)) : new Bt(this.source, 0);
	}
	touches(e) {
		return e.changes.touchesRange(this.from, this.to);
	}
};
function Ht(e, t, n, r) {
	if (!e) return !1;
	let i = t.sliceDoc(n, r);
	return typeof e == "function" ? e(i, n, r, t) : pt(e, !0).test(i);
}
var Ut = /*@__PURE__*/ C.define({ map(e, t) {
	return e.map((e) => e.map(t));
} }), j = /*@__PURE__*/ $e.define({
	create() {
		return Nt.start();
	},
	update(e, t) {
		return e.update(t);
	},
	provide: (e) => [Me.from(e, (e) => e.tooltip), b.contentAttributes.from(e, (e) => e.attrs)]
});
function Wt(e, t) {
	let n = t.completion.apply || t.completion.label, r = e.state.field(j).active.find((e) => e.source == t.source);
	return r instanceof Vt ? (typeof n == "string" ? e.dispatch({
		...ht(e.state, n, r.from, r.to),
		annotations: mt.of(t.completion)
	}) : n(e, t.completion, r.from, r.to), !0) : !1;
}
var Gt = /*@__PURE__*/ Ot(j, Wt);
function Kt(e, t = "option") {
	return (n) => {
		let r = n.state.field(j, !1);
		if (!r || !r.open || r.open.disabled || Date.now() - r.open.timestamp < n.state.facet(A).interactionDelay) return !1;
		let i = 1, a;
		t == "page" && (a = te(n, r.open.tooltip)) && (i = Math.max(2, Math.floor(a.dom.offsetHeight / a.dom.querySelector("li").offsetHeight) - 1));
		let { length: o } = r.open.options, s = r.open.selected > -1 ? r.open.selected + i * (e ? 1 : -1) : e ? 0 : o - 1;
		return s < 0 ? s = t == "page" ? 0 : o - 1 : s >= o && (s = t == "page" ? o - 1 : 0), n.dispatch({ effects: wt.of(s) }), !0;
	};
}
var qt = (e) => {
	let t = e.state.field(j, !1);
	return e.state.readOnly || !t || !t.open || t.open.selected < 0 || t.open.disabled || Date.now() - t.open.timestamp < e.state.facet(A).interactionDelay ? !1 : Wt(e, t.open.options[t.open.selected]);
}, Jt = (e) => e.state.field(j, !1) ? (e.dispatch({ effects: vt.of(!0) }), !0) : !1, Yt = (e) => {
	let t = e.state.field(j, !1);
	return !t || !t.active.some((e) => e.state != 0) ? !1 : (e.dispatch({ effects: yt.of(null) }), !0);
}, Xt = class {
	constructor(e, t) {
		this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
	}
}, Zt = 50, Qt = 1e3, $t = /*@__PURE__*/ g.fromClass(class {
	constructor(e) {
		this.view = e, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
		for (let t of e.state.field(j).active) t.isPending && this.startQuery(t);
	}
	update(e) {
		let t = e.state.field(j), n = e.state.facet(A);
		if (!e.selectionSet && !e.docChanged && e.startState.field(j) == t) return;
		let r = e.transactions.some((e) => {
			let t = zt(e, n);
			return t & 8 || (e.selection || e.docChanged) && !(t & 3);
		});
		for (let t = 0; t < this.running.length; t++) {
			let n = this.running[t];
			if (r || n.context.abortOnDocChange && e.docChanged || n.updates.length + e.transactions.length > Zt && Date.now() - n.time > Qt) {
				for (let e of n.context.abortListeners) try {
					e();
				} catch (e) {
					se(this.view.state, e);
				}
				n.context.abortListeners = null, this.running.splice(t--, 1);
			} else n.updates.push(...e.transactions);
		}
		this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), e.transactions.some((e) => e.effects.some((e) => e.is(vt))) && (this.pendingStart = !0);
		let i = this.pendingStart ? 50 : n.activateOnTypingDelay;
		if (this.debounceUpdate = t.active.some((e) => e.isPending && !this.running.some((t) => t.active.source == e.source)) ? setTimeout(() => this.startUpdate(), i) : -1, this.composing != 0) for (let t of e.transactions) t.isUserEvent("input.type") ? this.composing = 2 : this.composing == 2 && t.selection && (this.composing = 3);
	}
	startUpdate() {
		this.debounceUpdate = -1, this.pendingStart = !1;
		let { state: e } = this.view, t = e.field(j);
		for (let e of t.active) e.isPending && !this.running.some((t) => t.active.source == e.source) && this.startQuery(e);
		this.running.length && t.open && t.open.disabled && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(A).updateSyncTime));
	}
	startQuery(e) {
		let { state: t } = this.view, n = new ot(t, ft(t), e.explicit, this.view), r = new Xt(e, n);
		this.running.push(r), Promise.resolve(e.source(n)).then((e) => {
			r.context.aborted || (r.done = e || null, this.scheduleAccept());
		}, (e) => {
			this.view.dispatch({ effects: yt.of(null) }), se(this.view.state, e);
		});
	}
	scheduleAccept() {
		this.running.every((e) => e.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(A).updateSyncTime));
	}
	accept() {
		this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
		let e = [], t = this.view.state.facet(A), n = this.view.state.field(j);
		for (let r = 0; r < this.running.length; r++) {
			let i = this.running[r];
			if (i.done === void 0) continue;
			if (this.running.splice(r--, 1), i.done) {
				let n = ft(i.updates.length ? i.updates[0].startState : this.view.state), r = Math.min(n, i.done.from + +!i.active.explicit), a = new Vt(i.active.source, i.active.explicit, r, i.done, i.done.from, i.done.to ?? n);
				for (let e of i.updates) a = a.update(e, t);
				if (a.hasResult()) {
					e.push(a);
					continue;
				}
			}
			let a = n.active.find((e) => e.source == i.active.source);
			if (a && a.isPending) if (i.done == null) {
				let n = new Bt(i.active.source, 0);
				for (let e of i.updates) n = n.update(e, t);
				n.isPending || e.push(n);
			} else this.startQuery(a);
		}
		(e.length || n.open && n.open.disabled) && this.view.dispatch({ effects: Ut.of(e) });
	}
}, { eventHandlers: {
	blur(e) {
		let t = this.view.state.field(j, !1);
		if (t && t.tooltip && this.view.state.facet(A).closeOnBlur) {
			let n = t.open && te(this.view, t.open.tooltip);
			(!n || !n.dom.contains(e.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: yt.of(null) }), 10);
		}
	},
	compositionstart() {
		this.composing = 1;
	},
	compositionend() {
		this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: vt.of(!1) }), 20), this.composing = 0;
	}
} }), en = typeof navigator == "object" && /*@__PURE__*/ /Win/.test(navigator.platform), tn = /*@__PURE__*/ ve.highest(/*@__PURE__*/ b.domEventHandlers({ keydown(e, t) {
	let n = t.state.field(j, !1);
	if (!n || !n.open || n.open.disabled || n.open.selected < 0 || e.key.length > 1 || e.ctrlKey && !(en && e.altKey) || e.metaKey) return !1;
	let r = n.open.options[n.open.selected], i = n.active.find((e) => e.source == r.source), a = r.completion.commitCharacters || i.result.commitCharacters;
	return a && a.indexOf(e.key) > -1 && Wt(t, r), !1;
} })), nn = /*@__PURE__*/ b.baseTheme({
	".cm-tooltip.cm-tooltip-autocomplete": { "& > ul": {
		fontFamily: "monospace",
		whiteSpace: "nowrap",
		overflow: "hidden auto",
		maxWidth_fallback: "700px",
		maxWidth: "min(700px, 95vw)",
		minWidth: "250px",
		maxHeight: "10em",
		height: "100%",
		listStyle: "none",
		margin: 0,
		padding: 0,
		"& > li, & > completion-section": {
			padding: "1px 3px",
			lineHeight: 1.2
		},
		"& > li": {
			overflowX: "hidden",
			textOverflow: "ellipsis",
			cursor: "pointer"
		},
		"& > completion-section": {
			display: "list-item",
			borderBottom: "1px solid silver",
			paddingLeft: "0.5em",
			opacity: .7
		}
	} },
	"&light .cm-tooltip-autocomplete ul li[aria-selected]": {
		background: "#17c",
		color: "white"
	},
	"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: "#777" },
	"&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
		background: "#347",
		color: "white"
	},
	"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: "#444" },
	".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
		content: "\"···\"",
		opacity: .5,
		display: "block",
		textAlign: "center",
		cursor: "pointer"
	},
	".cm-tooltip.cm-completionInfo": {
		position: "absolute",
		padding: "3px 9px",
		width: "max-content",
		maxWidth: "400px",
		boxSizing: "border-box",
		whiteSpace: "pre-line"
	},
	".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
	".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
	".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
	".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
	"&light .cm-snippetField": { backgroundColor: "#00000022" },
	"&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
	".cm-snippetFieldPosition": {
		verticalAlign: "text-top",
		width: 0,
		height: "1.15em",
		display: "inline-block",
		margin: "0 -0.7px -.7em",
		borderLeft: "1.4px dotted #888"
	},
	".cm-completionMatchedText": { textDecoration: "underline" },
	".cm-completionDetail": {
		marginLeft: "0.5em",
		fontStyle: "italic"
	},
	".cm-completionIcon": {
		fontSize: "90%",
		width: ".8em",
		display: "inline-block",
		textAlign: "center",
		paddingRight: ".6em",
		opacity: "0.6",
		boxSizing: "content-box"
	},
	".cm-completionIcon-function, .cm-completionIcon-method": { "&:after": { content: "'ƒ'" } },
	".cm-completionIcon-class": { "&:after": { content: "'○'" } },
	".cm-completionIcon-interface": { "&:after": { content: "'◌'" } },
	".cm-completionIcon-variable": { "&:after": { content: "'𝑥'" } },
	".cm-completionIcon-constant": { "&:after": { content: "'𝐶'" } },
	".cm-completionIcon-type": { "&:after": { content: "'𝑡'" } },
	".cm-completionIcon-enum": { "&:after": { content: "'∪'" } },
	".cm-completionIcon-property": { "&:after": { content: "'□'" } },
	".cm-completionIcon-keyword": { "&:after": { content: "'🔑︎'" } },
	".cm-completionIcon-namespace": { "&:after": { content: "'▢'" } },
	".cm-completionIcon-text": { "&:after": {
		content: "'abc'",
		fontSize: "50%",
		verticalAlign: "middle"
	} }
}), rn = class {
	constructor(e, t, n, r) {
		this.field = e, this.line = t, this.from = n, this.to = r;
	}
}, an = class e {
	constructor(e, t, n) {
		this.field = e, this.from = t, this.to = n;
	}
	map(t) {
		let n = t.mapPos(this.from, -1, Oe.TrackDel), r = t.mapPos(this.to, 1, Oe.TrackDel);
		return n == null || r == null ? null : new e(this.field, n, r);
	}
}, on = class e {
	constructor(e, t) {
		this.lines = e, this.fieldPositions = t;
	}
	instantiate(e, t) {
		let n = [], r = [t], i = e.doc.lineAt(t), a = /^\s*/.exec(i.text)[0];
		for (let i of this.lines) {
			if (n.length) {
				let n = a, o = /^\t*/.exec(i)[0].length;
				for (let t = 0; t < o; t++) n += e.facet(l);
				r.push(t + n.length - o), i = n + i.slice(o);
			}
			n.push(i), t += i.length + 1;
		}
		return {
			text: n,
			ranges: this.fieldPositions.map((e) => new an(e.field, r[e.line] + e.from, r[e.line] + e.to))
		};
	}
	static parse(t) {
		let n = [], r = [], i = [], a;
		for (let e of t.split(/\r\n?|\n/)) {
			for (; a = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(e);) {
				let t = a[1] ? +a[1] : null, o = a[2] || a[3] || "", s = -1;
				t === 0 && (t = 1e9);
				let c = o.replace(/\\[{}]/g, (e) => e[1]);
				for (let e = 0; e < n.length; e++) (t == null ? c && n[e].name == c : n[e].seq == t) && (s = e);
				if (s < 0) {
					let e = 0;
					for (; e < n.length && (t == null || n[e].seq != null && n[e].seq < t);) e++;
					n.splice(e, 0, {
						seq: t,
						name: c
					}), s = e;
					for (let e of i) e.field >= s && e.field++;
				}
				for (let e of i) if (e.line == r.length && e.from > a.index) {
					let t = a[2] ? 3 + (a[1] || "").length : 2;
					e.from -= t, e.to -= t;
				}
				i.push(new rn(s, r.length, a.index, a.index + c.length)), e = e.slice(0, a.index) + o + e.slice(a.index + a[0].length);
			}
			e = e.replace(/\\([{}])/g, (e, t, n) => {
				for (let e of i) e.line == r.length && e.from > n && (e.from--, e.to--);
				return t;
			}), r.push(e);
		}
		return new e(r, i);
	}
}, sn = /*@__PURE__*/ _.widget({ widget: /*@__PURE__*/ new class extends ne {
	toDOM() {
		let e = document.createElement("span");
		return e.className = "cm-snippetFieldPosition", e;
	}
	ignoreEvent() {
		return !1;
	}
}() }), cn = /*@__PURE__*/ _.mark({ class: "cm-snippetField" }), ln = class e {
	constructor(e, t) {
		this.ranges = e, this.active = t, this.deco = _.set(e.map((e) => (e.from == e.to ? sn : cn).range(e.from, e.to)), !0);
	}
	map(t) {
		let n = [];
		for (let e of this.ranges) {
			let r = e.map(t);
			if (!r) return null;
			n.push(r);
		}
		return new e(n, this.active);
	}
	selectionInsideField(e) {
		return e.ranges.every((e) => this.ranges.some((t) => t.field == this.active && t.from <= e.from && t.to >= e.to));
	}
}, un = /*@__PURE__*/ C.define({ map(e, t) {
	return e && e.map(t);
} }), dn = /*@__PURE__*/ C.define(), fn = /*@__PURE__*/ $e.define({
	create() {
		return null;
	},
	update(e, t) {
		for (let n of t.effects) {
			if (n.is(un)) return n.value;
			if (n.is(dn) && e) return new ln(e.ranges, n.value);
		}
		return e && t.docChanged && (e = e.map(t.changes)), e && t.selection && !e.selectionInsideField(t.selection) && (e = null), e;
	},
	provide: (e) => b.decorations.from(e, (e) => e ? e.deco : _.none)
});
function pn(e, t) {
	return D.create(e.filter((e) => e.field == t).map((e) => D.range(e.from, e.to)));
}
function mn(e) {
	let t = on.parse(e);
	return (e, n, r, i) => {
		let { text: a, ranges: o } = t.instantiate(e.state, r), { main: s } = e.state.selection, c = {
			changes: {
				from: r,
				to: i == s.from ? s.to : i,
				insert: ue.of(a)
			},
			scrollIntoView: !0,
			annotations: n ? [mt.of(n), u.userEvent.of("input.complete")] : void 0
		};
		if (o.length && (c.selection = pn(o, 0)), o.some((e) => e.field > 0)) {
			let t = new ln(o, 0), n = c.effects = [un.of(t)];
			e.state.field(fn, !1) === void 0 && n.push(C.appendConfig.of([
				fn,
				vn,
				yn,
				nn
			]));
		}
		e.dispatch(e.state.update(c));
	};
}
function hn(e) {
	return ({ state: t, dispatch: n }) => {
		let r = t.field(fn, !1);
		if (!r || e < 0 && r.active == 0) return !1;
		let i = r.active + e, a = e > 0 && !r.ranges.some((t) => t.field == i + e);
		return n(t.update({
			selection: pn(r.ranges, i),
			effects: un.of(a ? null : new ln(r.ranges, i)),
			scrollIntoView: !0
		})), !0;
	};
}
var gn = [{
	key: "Tab",
	run: /* @__PURE__ */ hn(1),
	shift: /* @__PURE__ */ hn(-1)
}, {
	key: "Escape",
	run: ({ state: e, dispatch: t }) => e.field(fn, !1) ? (t(e.update({ effects: un.of(null) })), !0) : !1
}], _n = /*@__PURE__*/ Ae.define({ combine(e) {
	return e.length ? e[0] : gn;
} }), vn = /*@__PURE__*/ ve.highest(/*@__PURE__*/ he.compute([_n], (e) => e.facet(_n)));
function M(e, t) {
	return {
		...t,
		apply: mn(e)
	};
}
var yn = /*@__PURE__*/ b.domEventHandlers({ mousedown(e, t) {
	let n = t.state.field(fn, !1), r;
	if (!n || (r = t.posAtCoords({
		x: e.clientX,
		y: e.clientY
	})) == null) return !1;
	let i = n.ranges.find((e) => e.from <= r && e.to >= r);
	return !i || i.field == n.active ? !1 : (t.dispatch({
		selection: pn(n.ranges, i.field),
		effects: un.of(n.ranges.some((e) => e.field > i.field) ? new ln(n.ranges, i.field) : null),
		scrollIntoView: !0
	}), !0);
} }), bn = /*@__PURE__*/ new class extends tt {}();
bn.startSide = 1, bn.endSide = -1, typeof navigator == "object" && navigator.userAgent;
function xn(e = {}) {
	return [
		tn,
		j,
		A.of(e),
		$t,
		Cn,
		nn
	];
}
var Sn = [
	{
		key: "Ctrl-Space",
		run: Jt
	},
	{
		mac: "Alt-`",
		run: Jt
	},
	{
		mac: "Alt-i",
		run: Jt
	},
	{
		key: "Escape",
		run: Yt
	},
	{
		key: "ArrowDown",
		run: /*@__PURE__*/ Kt(!0)
	},
	{
		key: "ArrowUp",
		run: /*@__PURE__*/ Kt(!1)
	},
	{
		key: "PageDown",
		run: /*@__PURE__*/ Kt(!0, "page")
	},
	{
		key: "PageUp",
		run: /*@__PURE__*/ Kt(!1, "page")
	},
	{
		key: "Enter",
		run: qt
	}
], Cn = /*@__PURE__*/ ve.highest(/*@__PURE__*/ he.computeN([A], (e) => e.facet(A).defaultKeymap ? [Sn] : [])), wn = (e) => {
	let { state: t } = e, n = t.doc.lineAt(t.selection.main.from), r = kn(e.state, n.from);
	return r.line ? En(e) : r.block ? On(e) : !1;
};
function Tn(e, t) {
	return ({ state: n, dispatch: r }) => {
		if (n.readOnly) return !1;
		let i = e(t, n);
		return i ? (r(n.update(i)), !0) : !1;
	};
}
var En = /*@__PURE__*/ Tn(Pn, 0), Dn = /*@__PURE__*/ Tn(Nn, 0), On = /*@__PURE__*/ Tn((e, t) => Nn(e, t, Mn(t)), 0);
function kn(e, t) {
	let n = e.languageDataAt("commentTokens", t, 1);
	return n.length ? n[0] : {};
}
var An = 50;
function jn(e, { open: t, close: n }, r, i) {
	let a = e.sliceDoc(r - An, r), o = e.sliceDoc(i, i + An), s = /\s*$/.exec(a)[0].length, c = /^\s*/.exec(o)[0].length, l = a.length - s;
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
	i - r <= 2 * An ? u = d = e.sliceDoc(r, i) : (u = e.sliceDoc(r, r + An), d = e.sliceDoc(i - An, i));
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
function Mn(e) {
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
function Nn(e, t, n = t.selection.ranges) {
	let r = n.map((e) => kn(t, e.from).block);
	if (!r.every((e) => e)) return null;
	let i = n.map((e, n) => jn(t, r[n], e.from, e.to));
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
function Pn(e, t, n = t.selection.ranges) {
	let r = [], i = -1;
	ranges: for (let { from: e, to: a } of n) {
		let n = r.length, o = 1e9, s;
		for (let n = e; n <= a;) {
			let c = t.doc.lineAt(n);
			if (s == null && (s = kn(t, c.from).line, !s)) continue ranges;
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
var Fn = /*@__PURE__*/ Se.define(), In = /*@__PURE__*/ Se.define(), Ln = /*@__PURE__*/ Ae.define(), Rn = /*@__PURE__*/ Ae.define({ combine(e) {
	return m(e, {
		minDepth: 100,
		newGroupDelay: 500,
		joinToEvent: (e, t) => t
	}, {
		minDepth: Math.max,
		newGroupDelay: Math.min,
		joinToEvent: (e, t) => (n, r) => e(n, r) || t(n, r)
	});
} }), zn = /*@__PURE__*/ $e.define({
	create() {
		return nr.empty;
	},
	update(e, t) {
		let n = t.state.facet(Rn), r = t.annotation(Fn);
		if (r) {
			let i = N.fromTransaction(t, r.selection), a = r.side, o = a == 0 ? e.undone : e.done;
			return o = i ? Kn(o, o.length, n.minDepth, i) : Zn(o, t.startState.selection), new nr(a == 0 ? r.rest : o, a == 0 ? o : r.rest);
		}
		let i = t.annotation(In);
		if ((i == "full" || i == "before") && (e = e.isolate()), t.annotation(u.addToHistory) === !1) return t.changes.empty ? e : e.addMapping(t.changes.desc);
		let a = N.fromTransaction(t), o = t.annotation(u.time), s = t.annotation(u.userEvent);
		return a ? e = e.addChanges(a, o, s, n, t) : t.selection && (e = e.addSelection(t.startState.selection, o, s, n.newGroupDelay)), (i == "full" || i == "after") && (e = e.isolate()), e;
	},
	toJSON(e) {
		return {
			done: e.done.map((e) => e.toJSON()),
			undone: e.undone.map((e) => e.toJSON())
		};
	},
	fromJSON(e) {
		return new nr(e.done.map(N.fromJSON), e.undone.map(N.fromJSON));
	}
});
function Bn(e = {}) {
	return [
		zn,
		Rn.of(e),
		b.domEventHandlers({ beforeinput(e, t) {
			let n = e.inputType == "historyUndo" ? Hn : e.inputType == "historyRedo" ? Un : null;
			return n ? (e.preventDefault(), n(t)) : !1;
		} })
	];
}
function Vn(e, t) {
	return function({ state: n, dispatch: r }) {
		if (!t && n.readOnly) return !1;
		let i = n.field(zn, !1);
		if (!i) return !1;
		let a = i.pop(e, n, t);
		return a ? (r(a), !0) : !1;
	};
}
var Hn = /*@__PURE__*/ Vn(0, !1), Un = /*@__PURE__*/ Vn(1, !1), Wn = /*@__PURE__*/ Vn(0, !0), Gn = /*@__PURE__*/ Vn(1, !0), N = class e {
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
		return new e(t.changes && Je.fromJSON(t.changes), [], t.mapped && Ie.fromJSON(t.mapped), t.startSelection && D.fromJSON(t.startSelection), t.selectionsAfter.map(D.fromJSON));
	}
	static fromTransaction(t, n) {
		let r = P;
		for (let e of t.startState.facet(Ln)) {
			let n = e(t);
			n.length && (r = r.concat(n));
		}
		return !r.length && t.changes.empty ? null : new e(t.changes.invert(t.startState.doc), r, void 0, n || t.startState.selection, P);
	}
	static selection(t) {
		return new e(void 0, P, void 0, void 0, t);
	}
};
function Kn(e, t, n, r) {
	let i = t + 1 > n + 20 ? t - n - 1 : 0, a = e.slice(i, t);
	return a.push(r), a;
}
function qn(e, t) {
	let n = [], r = !1;
	return e.iterChangedRanges((e, t) => n.push(e, t)), t.iterChangedRanges((e, t, i, a) => {
		for (let e = 0; e < n.length;) {
			let t = n[e++], o = n[e++];
			a >= t && i <= o && (r = !0);
		}
	}), r;
}
function Jn(e, t) {
	return e.ranges.length == t.ranges.length && e.ranges.filter((e, n) => e.empty != t.ranges[n].empty).length === 0;
}
function Yn(e, t) {
	return e.length ? t.length ? e.concat(t) : e : t;
}
var P = [], Xn = 200;
function Zn(e, t) {
	if (e.length) {
		let n = e[e.length - 1], r = n.selectionsAfter.slice(Math.max(0, n.selectionsAfter.length - Xn));
		return r.length && r[r.length - 1].eq(t) ? e : (r.push(t), Kn(e, e.length - 1, 1e9, n.setSelAfter(r)));
	} else return [N.selection([t])];
}
function Qn(e) {
	let t = e[e.length - 1], n = e.slice();
	return n[e.length - 1] = t.setSelAfter(t.selectionsAfter.slice(0, t.selectionsAfter.length - 1)), n;
}
function $n(e, t) {
	if (!e.length) return e;
	let n = e.length, r = P;
	for (; n;) {
		let i = er(e[n - 1], t, r);
		if (i.changes && !i.changes.empty || i.effects.length) {
			let t = e.slice(0, n);
			return t[n - 1] = i, t;
		} else t = i.mapped, n--, r = i.selectionsAfter;
	}
	return r.length ? [N.selection(r)] : P;
}
function er(e, t, n) {
	let r = Yn(e.selectionsAfter.length ? e.selectionsAfter.map((e) => e.map(t)) : P, n);
	if (!e.changes) return N.selection(r);
	let i = e.changes.map(t), a = t.mapDesc(e.changes, !0), o = e.mapped ? e.mapped.composeDesc(a) : a;
	return new N(i, C.mapEffects(e.effects, t), o, e.startSelection.map(a), r);
}
var tr = /^(input\.type|delete)($|\.)/, nr = class e {
	constructor(e, t, n = 0, r = void 0) {
		this.done = e, this.undone = t, this.prevTime = n, this.prevUserEvent = r;
	}
	isolate() {
		return this.prevTime ? new e(this.done, this.undone) : this;
	}
	addChanges(t, n, r, i, a) {
		let o = this.done, s = o[o.length - 1];
		return o = s && s.changes && !s.changes.empty && t.changes && (!r || tr.test(r)) && (!s.selectionsAfter.length && n - this.prevTime < i.newGroupDelay && i.joinToEvent(a, qn(s.changes, t.changes)) || r == "input.type.compose") ? Kn(o, o.length - 1, i.minDepth, new N(t.changes.compose(s.changes), Yn(C.mapEffects(t.effects, s.changes), s.effects), s.mapped, s.startSelection, P)) : Kn(o, o.length, i.minDepth, t), new e(o, P, n, r);
	}
	addSelection(t, n, r, i) {
		let a = this.done.length ? this.done[this.done.length - 1].selectionsAfter : P;
		return a.length > 0 && n - this.prevTime < i && r == this.prevUserEvent && r && /^select($|\.)/.test(r) && Jn(a[a.length - 1], t) ? this : new e(Zn(this.done, t), this.undone, n, r);
	}
	addMapping(t) {
		return new e($n(this.done, t), $n(this.undone, t), this.prevTime, this.prevUserEvent);
	}
	pop(e, t, n) {
		let r = e == 0 ? this.done : this.undone;
		if (r.length == 0) return null;
		let i = r[r.length - 1], a = i.selectionsAfter[0] || (i.startSelection ? i.startSelection.map(i.changes.invertedDesc, 1) : t.selection);
		if (n && i.selectionsAfter.length) return t.update({
			selection: i.selectionsAfter[i.selectionsAfter.length - 1],
			annotations: Fn.of({
				side: e,
				rest: Qn(r),
				selection: a
			}),
			userEvent: e == 0 ? "select.undo" : "select.redo",
			scrollIntoView: !0
		});
		if (i.changes) {
			let n = r.length == 1 ? P : r.slice(0, r.length - 1);
			return i.mapped && (n = $n(n, i.mapped)), t.update({
				changes: i.changes,
				selection: i.startSelection,
				effects: i.effects,
				annotations: Fn.of({
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
nr.empty = /*@__PURE__*/ new nr(P, P);
var rr = [
	{
		key: "Mod-z",
		run: Hn,
		preventDefault: !0
	},
	{
		key: "Mod-y",
		mac: "Mod-Shift-z",
		run: Un,
		preventDefault: !0
	},
	{
		linux: "Ctrl-Shift-z",
		run: Un,
		preventDefault: !0
	},
	{
		key: "Mod-u",
		run: Wn,
		preventDefault: !0
	},
	{
		key: "Alt-u",
		mac: "Mod-Shift-u",
		run: Gn,
		preventDefault: !0
	}
];
function ir(e, t) {
	return D.create(e.ranges.map(t), e.mainIndex);
}
function F(e, t) {
	return e.update({
		selection: t,
		scrollIntoView: !0,
		userEvent: "select"
	});
}
function I({ state: e, dispatch: t }, n) {
	let r = ir(e.selection, n);
	return r.eq(e.selection, !0) ? !1 : (t(F(e, r)), !0);
}
function ar(e, t) {
	return D.cursor(t ? e.to : e.from);
}
function or(e, t) {
	return I(e, (n) => n.empty ? e.moveByChar(n, t) : ar(n, t));
}
function L(e) {
	return e.textDirectionAt(e.state.selection.main.head) == pe.LTR;
}
var sr = (e) => or(e, !L(e)), cr = (e) => or(e, L(e));
function lr(e, t) {
	return I(e, (n) => n.empty ? e.moveByGroup(n, t) : ar(n, t));
}
var ur = (e) => lr(e, !L(e)), dr = (e) => lr(e, L(e));
typeof Intl < "u" && Intl.Segmenter;
function fr(e, t, n) {
	if (t.type.prop(n)) return !0;
	let r = t.to - t.from;
	return r && (r > 2 || /[^\s,.;:]/.test(e.sliceDoc(t.from, t.to))) || t.firstChild;
}
function pr(e, t, n) {
	let r = y(e).resolveInner(t.head), i = n ? h.closedBy : h.openedBy;
	for (let a = t.head;;) {
		let t = n ? r.childAfter(a) : r.childBefore(a);
		if (!t) break;
		fr(e, t, i) ? r = t : a = n ? t.to : t.from;
	}
	let a = r.type.prop(i), o, s;
	return s = a && (o = n ? de(e, r.from, 1) : de(e, r.to, -1)) && o.matched ? n ? o.end.to : o.end.from : n ? r.to : r.from, D.cursor(s, n ? -1 : 1);
}
var mr = (e) => I(e, (t) => pr(e.state, t, !L(e))), hr = (e) => I(e, (t) => pr(e.state, t, L(e)));
function gr(e, t) {
	return I(e, (n) => {
		if (!n.empty) return ar(n, t);
		let r = e.moveVertically(n, t);
		return r.head == n.head ? e.moveToLineBoundary(n, t) : r;
	});
}
var _r = (e) => gr(e, !1), vr = (e) => gr(e, !0);
function yr(e) {
	let t = e.scrollDOM.clientHeight < e.scrollDOM.scrollHeight - 2, n = 0, r = 0, i;
	if (t) {
		for (let t of e.state.facet(b.scrollMargins)) {
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
function br(e, t) {
	let n = yr(e), { state: r } = e, i = ir(r.selection, (r) => r.empty ? e.moveVertically(r, t, n.height) : ar(r, t));
	if (i.eq(r.selection)) return !1;
	let a;
	if (n.selfScroll) {
		let t = e.coordsAtPos(r.selection.main.head), o = e.scrollDOM.getBoundingClientRect(), s = o.top + n.marginTop, c = o.bottom - n.marginBottom;
		t && t.top > s && t.bottom < c && (a = b.scrollIntoView(i.main.head, {
			y: "start",
			yMargin: t.top - s
		}));
	}
	return e.dispatch(F(r, i), { effects: a }), !0;
}
var xr = (e) => br(e, !1), Sr = (e) => br(e, !0);
function R(e, t, n) {
	let r = e.lineBlockAt(t.head), i = e.moveToLineBoundary(t, n);
	if (i.head == t.head && i.head != (n ? r.to : r.from) && (i = e.moveToLineBoundary(t, n, !1)), !n && i.head == r.from && r.length) {
		let n = /^\s*/.exec(e.state.sliceDoc(r.from, Math.min(r.from + 100, r.to)))[0].length;
		n && t.head != r.from + n && (i = D.cursor(r.from + n));
	}
	return i;
}
var Cr = (e) => I(e, (t) => R(e, t, !0)), wr = (e) => I(e, (t) => R(e, t, !1)), Tr = (e) => I(e, (t) => R(e, t, !L(e))), Er = (e) => I(e, (t) => R(e, t, L(e))), Dr = (e) => I(e, (t) => D.cursor(e.lineBlockAt(t.head).from, 1)), Or = (e) => I(e, (t) => D.cursor(e.lineBlockAt(t.head).to, -1));
function kr(e, t, n) {
	let r = !1, i = ir(e.selection, (t) => {
		let i = de(e, t.head, -1) || de(e, t.head, 1) || t.head > 0 && de(e, t.head - 1, 1) || t.head < e.doc.length && de(e, t.head + 1, -1);
		if (!i || !i.end) return t;
		r = !0;
		let a = i.start.from == t.head ? i.end.to : i.end.from;
		return n ? D.range(t.anchor, a) : D.cursor(a);
	});
	return r ? (t(F(e, i)), !0) : !1;
}
var Ar = ({ state: e, dispatch: t }) => kr(e, t, !1);
function z(e, t, n) {
	let r = ir(e.state.selection, (e) => {
		e.undirectional && e.head >= e.anchor != t && (e = D.range(e.head, e.anchor));
		let r = n(e);
		return D.range(e.anchor, r.head, r.goalColumn, r.bidiLevel || void 0, r.assoc);
	});
	return r.eq(e.state.selection) ? !1 : (e.dispatch(F(e.state, r)), !0);
}
function jr(e, t) {
	return z(e, t, (n) => e.moveByChar(n, t));
}
var Mr = (e) => jr(e, !L(e)), Nr = (e) => jr(e, L(e));
function Pr(e, t) {
	return z(e, t, (n) => e.moveByGroup(n, t));
}
var Fr = (e) => Pr(e, !L(e)), Ir = (e) => Pr(e, L(e)), Lr = (e) => {
	let t = !L(e);
	return z(e, t, (n) => pr(e.state, n, t));
}, Rr = (e) => {
	let t = L(e);
	return z(e, t, (n) => pr(e.state, n, t));
};
function zr(e, t) {
	return z(e, t, (n) => e.moveVertically(n, t));
}
var Br = (e) => zr(e, !1), Vr = (e) => zr(e, !0);
function Hr(e, t) {
	return z(e, t, (n) => e.moveVertically(n, t, yr(e).height));
}
var Ur = (e) => Hr(e, !1), Wr = (e) => Hr(e, !0), Gr = (e) => z(e, !0, (t) => R(e, t, !0)), Kr = (e) => z(e, !1, (t) => R(e, t, !1)), qr = (e) => {
	let t = !L(e);
	return z(e, t, (n) => R(e, n, t));
}, Jr = (e) => {
	let t = L(e);
	return z(e, t, (n) => R(e, n, t));
}, Yr = (e) => z(e, !1, (t) => D.cursor(e.lineBlockAt(t.head).from)), Xr = (e) => z(e, !0, (t) => D.cursor(e.lineBlockAt(t.head).to)), Zr = ({ state: e, dispatch: t }) => (t(F(e, { anchor: 0 })), !0), Qr = ({ state: e, dispatch: t }) => (t(F(e, { anchor: e.doc.length })), !0), $r = ({ state: e, dispatch: t }) => (t(F(e, {
	anchor: e.selection.main.anchor,
	head: 0
})), !0), ei = ({ state: e, dispatch: t }) => (t(F(e, {
	anchor: e.selection.main.anchor,
	head: e.doc.length
})), !0), ti = ({ state: e, dispatch: t }) => (t(e.update({
	selection: {
		anchor: 0,
		head: e.doc.length
	},
	userEvent: "select"
})), !0), ni = ({ state: e, dispatch: t }) => {
	let n = xi(e).map(({ from: t, to: n }) => D.range(t, Math.min(n + 1, e.doc.length)));
	return t(e.update({
		selection: D.create(n),
		userEvent: "select"
	})), !0;
}, ri = ({ state: e, dispatch: t }) => {
	let n = ir(e.selection, (t) => {
		let n = y(e), r = n.resolveStack(t.from, 1);
		if (t.empty) {
			let e = n.resolveStack(t.from, -1);
			e.node.from >= r.node.from && e.node.to <= r.node.to && (r = e);
		}
		for (let e = r; e; e = e.next) {
			let { node: n } = e;
			if ((n.from < t.from && n.to >= t.to || n.to > t.to && n.from <= t.from) && e.next) return D.range(n.to, n.from);
		}
		return t;
	});
	return n.eq(e.selection) ? !1 : (t(F(e, n)), !0);
};
function ii(e, t) {
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
	return i.length == r.ranges.length ? !1 : (e.dispatch(F(n, D.create(i, i.length - 1))), !0);
}
var ai = (e) => ii(e, !1), oi = (e) => ii(e, !0), si = ({ state: e, dispatch: t }) => {
	let n = e.selection, r = null;
	return n.ranges.length > 1 ? r = D.create([n.main]) : n.main.empty || (r = D.create([D.cursor(n.main.head)])), r ? (t(F(e, r)), !0) : !1;
};
function ci(e, t) {
	if (e.state.readOnly) return !1;
	let n = "delete.selection", { state: r } = e, i = r.changeByRange((r) => {
		let { from: i, to: a } = r;
		if (i == a) {
			let o = t(r);
			o < i ? (n = "delete.backward", o = li(e, o, !1)) : o > i && (n = "delete.forward", o = li(e, o, !0)), i = Math.min(i, o), a = Math.max(a, o);
		} else i = li(e, i, !1), a = li(e, a, !0);
		return i == a ? { range: r } : {
			changes: {
				from: i,
				to: a
			},
			range: D.cursor(i, i < r.head ? -1 : 1)
		};
	});
	return i.changes.empty ? !1 : (e.dispatch(r.update(i, {
		scrollIntoView: !0,
		userEvent: n,
		effects: n == "delete.selection" ? b.announce.of(r.phrase("Selection deleted")) : void 0
	})), !0);
}
function li(e, t, n) {
	if (e instanceof b) for (let r of e.state.facet(b.atomicRanges).map((t) => t(e))) r.between(t, t, (e, r) => {
		e < t && r > t && (t = n ? r : e);
	});
	return t;
}
var ui = (e, t, n) => ci(e, (r) => {
	let i = r.from, { state: a } = e, o = a.doc.lineAt(i), s, c;
	if (n && !t && i > o.from && i < o.from + 200 && !/[^ \t]/.test(s = o.text.slice(0, i - o.from))) {
		if (s[s.length - 1] == "	") return i - 1;
		let e = f(s, a.tabSize) % et(a) || et(a);
		for (let t = 0; t < e && s[s.length - 1 - t] == " "; t++) i--;
		c = i;
	} else c = ae(o.text, i - o.from, t, t) + o.from, c == i && o.number != (t ? a.doc.lines : 1) ? c += t ? 1 : -1 : !t && /[\ufe00-\ufe0f]/.test(o.text.slice(c - o.from, i - o.from)) && (c = ae(o.text, c - o.from, !1, !1) + o.from);
	return c;
}), di = (e) => ui(e, !1, !0), fi = (e) => ui(e, !0, !1), pi = (e, t) => ci(e, (n) => {
	let r = n.head, { state: i } = e, a = i.doc.lineAt(r), o = i.charCategorizer(r);
	for (let e = null;;) {
		if (r == (t ? a.to : a.from)) {
			r == n.head && a.number != (t ? i.doc.lines : 1) && (r += t ? 1 : -1);
			break;
		}
		let s = ae(a.text, r - a.from, t) + a.from, c = a.text.slice(Math.min(r, s) - a.from, Math.max(r, s) - a.from), l = o(c);
		if (e != null && l != e) break;
		(c != " " || r != n.head) && (e = l), r = s;
	}
	return r;
}), mi = (e) => pi(e, !1), hi = (e) => pi(e, !0), gi = (e) => ci(e, (t) => {
	let n = e.lineBlockAt(t.head).to;
	return t.head < n ? n : Math.min(e.state.doc.length, t.head + 1);
}), _i = (e) => ci(e, (t) => {
	let n = e.moveToLineBoundary(t, !1).head;
	return t.head > n ? n : Math.max(0, t.head - 1);
}), vi = (e) => ci(e, (t) => {
	let n = e.moveToLineBoundary(t, !0).head;
	return t.head < n ? n : Math.min(e.state.doc.length, t.head + 1);
}), yi = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = e.changeByRange((e) => ({
		changes: {
			from: e.from,
			to: e.to,
			insert: ue.of(["", ""])
		},
		range: D.cursor(e.from)
	}));
	return t(e.update(n, {
		scrollIntoView: !0,
		userEvent: "input"
	})), !0;
}, bi = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = e.changeByRange((t) => {
		if (!t.empty || t.from == 0 || t.from == e.doc.length) return { range: t };
		let n = t.from, r = e.doc.lineAt(n), i = n == r.from ? n - 1 : ae(r.text, n - r.from, !1) + r.from, a = n == r.to ? n + 1 : ae(r.text, n - r.from, !0) + r.from;
		return {
			changes: {
				from: i,
				to: a,
				insert: e.doc.slice(n, a).append(e.doc.slice(i, n))
			},
			range: D.cursor(a)
		};
	});
	return n.changes.empty ? !1 : (t(e.update(n, {
		scrollIntoView: !0,
		userEvent: "move.character"
	})), !0);
};
function xi(e) {
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
function Si(e, t, n) {
	if (e.readOnly) return !1;
	let r = [], i = [];
	for (let t of xi(e)) {
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
			for (let n of t.ranges) i.push(D.range(Math.min(e.doc.length, n.anchor + o), Math.min(e.doc.length, n.head + o)));
		} else {
			r.push({
				from: a.from,
				to: t.from
			}, {
				from: t.to,
				insert: e.lineBreak + a.text
			});
			for (let e of t.ranges) i.push(D.range(e.anchor - o, e.head - o));
		}
	}
	return r.length ? (t(e.update({
		changes: r,
		scrollIntoView: !0,
		selection: D.create(i, e.selection.mainIndex),
		userEvent: "move.line"
	})), !0) : !1;
}
var Ci = ({ state: e, dispatch: t }) => Si(e, t, !1), wi = ({ state: e, dispatch: t }) => Si(e, t, !0);
function Ti(e, t, n) {
	if (e.readOnly) return !1;
	let r = [];
	for (let t of xi(e)) n ? r.push({
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
var Ei = ({ state: e, dispatch: t }) => Ti(e, t, !1), Di = ({ state: e, dispatch: t }) => Ti(e, t, !0), Oi = (e) => {
	if (e.state.readOnly) return !1;
	let { state: t } = e, n = t.changes(xi(t).map(({ from: e, to: n }) => (e > 0 ? e-- : n < t.doc.length && n++, {
		from: e,
		to: n
	}))), r = ir(t.selection, (t) => {
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
function ki(e, t) {
	if (/\(\)|\[\]|\{\}/.test(e.sliceDoc(t - 1, t + 1))) return {
		from: t,
		to: t
	};
	let n = y(e).resolveInner(t), r = n.childBefore(t), i = n.childAfter(t), a;
	return r && i && r.to <= t && i.from >= t && (a = r.type.prop(h.closedBy)) && a.indexOf(i.name) > -1 && e.doc.lineAt(r.to).from == e.doc.lineAt(i.from).from && !/\S/.test(e.sliceDoc(r.to, i.from)) ? {
		from: r.to,
		to: i.from
	} : null;
}
var Ai = /*@__PURE__*/ Mi(!1), ji = /*@__PURE__*/ Mi(!0);
function Mi(e) {
	return ({ state: t, dispatch: n }) => {
		if (t.readOnly) return !1;
		let r = t.changeByRange((n) => {
			let { from: r, to: i } = n, a = t.doc.lineAt(r), o = !e && r == i && ki(t, r);
			e && (r = i = (i <= a.to ? a : t.doc.lineAt(i)).to);
			let s = new ze(t, {
				simulateBreak: r,
				simulateDoubleBreak: !!o
			}), c = be(s, r);
			for (c ??= f(/^\s*/.exec(t.doc.lineAt(r).text)[0], t.tabSize); i < a.to && /\s/.test(a.text[i - a.from]);) i++;
			o ? {from: r, to: i} = o : r > a.from && r < a.from + 100 && !/\S/.test(a.text.slice(0, r)) && (r = a.from);
			let l = ["", le(t, c)];
			return o && l.push(le(t, s.lineIndent(a.from, -1))), {
				changes: {
					from: r,
					to: i,
					insert: ue.of(l)
				},
				range: D.cursor(r + 1 + l[1].length)
			};
		});
		return n(t.update(r, {
			scrollIntoView: !0,
			userEvent: "input"
		})), !0;
	};
}
function Ni(e, t) {
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
			range: D.range(a.mapPos(r.anchor, 1), a.mapPos(r.head, 1))
		};
	});
}
var Pi = ({ state: e, dispatch: t }) => {
	if (e.readOnly) return !1;
	let n = Object.create(null), r = new ze(e, { overrideIndentation: (e) => n[e] ?? -1 }), i = Ni(e, (t, i, a) => {
		let o = be(r, t.from);
		if (o == null) return;
		/\S/.test(t.text) || (o = 0);
		let s = /^\s*/.exec(t.text)[0], c = le(e, o);
		(s != c || a.from < t.from + s.length) && (n[t.from] = o, i.push({
			from: t.from,
			to: t.from + s.length,
			insert: c
		}));
	});
	return i.changes.empty || t(e.update(i, { userEvent: "indent" })), !0;
}, Fi = ({ state: e, dispatch: t }) => e.readOnly ? !1 : (t(e.update(Ni(e, (t, n) => {
	n.push({
		from: t.from,
		insert: e.facet(l)
	});
}), { userEvent: "input.indent" })), !0), Ii = ({ state: e, dispatch: t }) => e.readOnly ? !1 : (t(e.update(Ni(e, (t, n) => {
	let r = /^\s*/.exec(t.text)[0];
	if (!r) return;
	let i = f(r, e.tabSize), a = 0, o = le(e, Math.max(0, i - et(e)));
	for (; a < r.length && a < o.length && r.charCodeAt(a) == o.charCodeAt(a);) a++;
	n.push({
		from: t.from + a,
		to: t.from + r.length,
		insert: o.slice(a)
	});
}), { userEvent: "delete.dedent" })), !0), Li = (e) => (e.setTabFocusMode(), !0), Ri = [
	{
		key: "Ctrl-b",
		run: sr,
		shift: Mr,
		preventDefault: !0
	},
	{
		key: "Ctrl-f",
		run: cr,
		shift: Nr
	},
	{
		key: "Ctrl-p",
		run: _r,
		shift: Br
	},
	{
		key: "Ctrl-n",
		run: vr,
		shift: Vr
	},
	{
		key: "Ctrl-a",
		run: Dr,
		shift: Yr
	},
	{
		key: "Ctrl-e",
		run: Or,
		shift: Xr
	},
	{
		key: "Ctrl-d",
		run: fi
	},
	{
		key: "Ctrl-h",
		run: di
	},
	{
		key: "Ctrl-k",
		run: gi
	},
	{
		key: "Ctrl-Alt-h",
		run: mi
	},
	{
		key: "Ctrl-o",
		run: yi
	},
	{
		key: "Ctrl-t",
		run: bi
	},
	{
		key: "Ctrl-v",
		run: Sr
	}
], zi = /*@__PURE__*/ [
	{
		key: "ArrowLeft",
		run: sr,
		shift: Mr,
		preventDefault: !0
	},
	{
		key: "Mod-ArrowLeft",
		mac: "Alt-ArrowLeft",
		run: ur,
		shift: Fr,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowLeft",
		run: Tr,
		shift: qr,
		preventDefault: !0
	},
	{
		key: "ArrowRight",
		run: cr,
		shift: Nr,
		preventDefault: !0
	},
	{
		key: "Mod-ArrowRight",
		mac: "Alt-ArrowRight",
		run: dr,
		shift: Ir,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowRight",
		run: Er,
		shift: Jr,
		preventDefault: !0
	},
	{
		key: "ArrowUp",
		run: _r,
		shift: Br,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowUp",
		run: Zr,
		shift: $r
	},
	{
		mac: "Ctrl-ArrowUp",
		run: xr,
		shift: Ur
	},
	{
		key: "ArrowDown",
		run: vr,
		shift: Vr,
		preventDefault: !0
	},
	{
		mac: "Cmd-ArrowDown",
		run: Qr,
		shift: ei
	},
	{
		mac: "Ctrl-ArrowDown",
		run: Sr,
		shift: Wr
	},
	{
		key: "PageUp",
		run: xr,
		shift: Ur
	},
	{
		key: "PageDown",
		run: Sr,
		shift: Wr
	},
	{
		key: "Home",
		run: wr,
		shift: Kr,
		preventDefault: !0
	},
	{
		key: "Mod-Home",
		run: Zr,
		shift: $r
	},
	{
		key: "End",
		run: Cr,
		shift: Gr,
		preventDefault: !0
	},
	{
		key: "Mod-End",
		run: Qr,
		shift: ei
	},
	{
		key: "Enter",
		run: Ai,
		shift: Ai
	},
	{
		key: "Mod-a",
		run: ti
	},
	{
		key: "Backspace",
		run: di,
		shift: di,
		preventDefault: !0
	},
	{
		key: "Delete",
		run: fi,
		preventDefault: !0
	},
	{
		key: "Mod-Backspace",
		mac: "Alt-Backspace",
		run: mi,
		preventDefault: !0
	},
	{
		key: "Mod-Delete",
		mac: "Alt-Delete",
		run: hi,
		preventDefault: !0
	},
	{
		mac: "Mod-Backspace",
		run: _i,
		preventDefault: !0
	},
	{
		mac: "Mod-Delete",
		run: vi,
		preventDefault: !0
	}
].concat(/*@__PURE__*/ Ri.map((e) => ({
	mac: e.key,
	run: e.run,
	shift: e.shift
}))), Bi = /*@__PURE__*/ [
	{
		key: "Alt-ArrowLeft",
		mac: "Ctrl-ArrowLeft",
		run: mr,
		shift: Lr
	},
	{
		key: "Alt-ArrowRight",
		mac: "Ctrl-ArrowRight",
		run: hr,
		shift: Rr
	},
	{
		key: "Alt-ArrowUp",
		run: Ci
	},
	{
		key: "Shift-Alt-ArrowUp",
		run: Ei
	},
	{
		key: "Alt-ArrowDown",
		run: wi
	},
	{
		key: "Shift-Alt-ArrowDown",
		run: Di
	},
	{
		key: "Mod-Alt-ArrowUp",
		run: ai
	},
	{
		key: "Mod-Alt-ArrowDown",
		run: oi
	},
	{
		key: "Escape",
		run: si
	},
	{
		key: "Mod-Enter",
		run: ji
	},
	{
		key: "Alt-l",
		mac: "Ctrl-l",
		run: ni
	},
	{
		key: "Mod-i",
		run: ri,
		preventDefault: !0
	},
	{
		key: "Mod-[",
		run: Ii
	},
	{
		key: "Mod-]",
		run: Fi
	},
	{
		key: "Mod-Alt-\\",
		run: Pi
	},
	{
		key: "Shift-Mod-k",
		run: Oi
	},
	{
		key: "Shift-Mod-\\",
		run: Ar
	},
	{
		key: "Mod-/",
		run: wn
	},
	{
		key: "Alt-A",
		run: Dn
	},
	{
		key: "Ctrl-m",
		mac: "Shift-Alt-m",
		run: Li
	}
].concat(zi), Vi = {
	key: "Tab",
	run: Fi,
	shift: Ii
}, Hi = typeof String.prototype.normalize == "function" ? (e) => e.normalize("NFKD") : (e) => e, Ui = class {
	constructor(e, t, n = 0, r = e.length, i, a) {
		this.test = a, this.value = {
			from: 0,
			to: 0,
			precise: !1
		}, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(n, r), this.bufferStart = n, this.normalize = i ? (e) => i(Hi(e)) : Hi, this.query = this.normalize(t);
	}
	peek() {
		if (this.bufferPos == this.buffer.length) {
			if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done) return -1;
			this.bufferPos = 0, this.buffer = this.iter.value;
		}
		return k(this.buffer, this.bufferPos);
	}
	next() {
		for (; this.matches.length;) this.matches.pop();
		return this.nextOverlapping();
	}
	nextOverlapping() {
		for (;;) {
			let e = this.peek();
			if (e < 0) return this.done = !0, this;
			let t = Pe(e), n = this.bufferStart + this.bufferPos;
			this.bufferPos += fe(e);
			let r = this.normalize(t);
			if (r.length) for (let e = 0, i = n, a = !0;; e++) {
				let n = r.charCodeAt(e), o = this.match(n, i, a, this.bufferPos + this.bufferStart, e == r.length - 1);
				if (o) return this.value = o, this;
				if (e == r.length - 1) break;
				a && e < t.length && t.charCodeAt(e) == n ? i++ : a = !1;
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
typeof Symbol < "u" && (Ui.prototype[Symbol.iterator] = function() {
	return this;
});
var Wi = {
	from: -1,
	to: -1,
	match: /*@__PURE__*/ /.*/.exec(""),
	precise: !0
}, Gi = "gm" + (/x/.unicode == null ? "" : "u"), Ki = class {
	constructor(e, t, n, r = 0, i = e.length) {
		if (this.text = e, this.to = i, this.curLine = "", this.done = !1, this.value = Wi, /\\[sWDnr]|\n|\r|\[\^/.test(t)) return new Yi(e, t, n, r, i);
		this.re = new RegExp(t, Gi + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.iter = e.iter();
		let a = e.lineAt(r);
		this.curLineStart = a.from, this.matchPos = Zi(e, r), this.getLine(this.curLineStart);
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
				if (this.matchPos = Zi(this.text, r + +(n == r)), n == this.curLineStart + this.curLine.length && this.nextLine(), (n < r || n > this.value.to) && (!this.test || this.test(n, r, t))) return this.value = {
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
}, qi = /*@__PURE__*/ new WeakMap(), Ji = class e {
	constructor(e, t) {
		this.from = e, this.text = t;
	}
	get to() {
		return this.from + this.text.length;
	}
	static get(t, n, r) {
		let i = qi.get(t);
		if (!i || i.from >= r || i.to <= n) {
			let i = new e(n, t.sliceString(n, r));
			return qi.set(t, i), i;
		}
		if (i.from == n && i.to == r) return i;
		let { text: a, from: o } = i;
		return o > n && (a = t.sliceString(n, o) + a, o = n), i.to < r && (a += t.sliceString(i.to, r)), qi.set(t, new e(o, a)), new e(n, a.slice(n - o, r - o));
	}
}, Yi = class {
	constructor(e, t, n, r, i) {
		this.text = e, this.to = i, this.done = !1, this.value = Wi, this.matchPos = Zi(e, r), this.re = new RegExp(t, Gi + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.flat = Ji.get(e, r, this.chunkEnd(r + 5e3));
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
				}, this.matchPos = Zi(this.text, n + +(e == n)), this;
			}
			if (this.flat.to == this.to) return this.done = !0, this;
			this.flat = Ji.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
		}
	}
};
typeof Symbol < "u" && (Ki.prototype[Symbol.iterator] = Yi.prototype[Symbol.iterator] = function() {
	return this;
});
function Xi(e) {
	try {
		return new RegExp(e, Gi), !0;
	} catch {
		return !1;
	}
}
function Zi(e, t) {
	if (t >= e.length) return t;
	let n = e.lineAt(t), r;
	for (; t < n.to && (r = n.text.charCodeAt(t - n.from)) >= 56320 && r < 57344;) t++;
	return t;
}
var Qi = (e) => {
	let { state: t } = e, n = String(t.doc.lineAt(e.state.selection.main.head).number), { close: r, result: i } = Be(e, {
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
		let a = t.doc.lineAt(t.selection.main.head), [, o, s, c, l] = i, u = c ? +c.slice(1) : 0, d = s ? +s : a.number;
		if (s && l) {
			let e = d / 100;
			o && (e = e * (o == "-" ? -1 : 1) + a.number / t.doc.lines), d = Math.round(t.doc.lines * e);
		} else s && o && (d = d * (o == "-" ? -1 : 1) + a.number);
		let f = t.doc.line(Math.max(1, Math.min(t.doc.lines, d))), p = D.cursor(f.from + Math.max(0, Math.min(u, f.length)));
		e.dispatch({
			effects: [r, b.scrollIntoView(p.from, { y: "center" })],
			selection: p
		});
	}), !0;
}, $i = ({ state: e, dispatch: t }) => {
	let { selection: n } = e, r = D.create(n.ranges.map((t) => e.wordAt(t.head) || D.cursor(t.head)), n.mainIndex);
	return r.eq(n) ? !1 : (t(e.update({ selection: r })), !0);
};
function ea(e, t) {
	let { main: n, ranges: r } = e.selection, i = e.wordAt(n.head), a = i && i.from == n.from && i.to == n.to;
	for (let n = !1, i = new Ui(e.doc, t, r[r.length - 1].to);;) if (i.next(), i.done) {
		if (n) return null;
		i = new Ui(e.doc, t, 0, Math.max(0, r[r.length - 1].from - 1)), n = !0;
	} else {
		if (n && r.some((e) => e.from == i.value.from)) continue;
		if (a) {
			let t = e.wordAt(i.value.from);
			if (!t || t.from != i.value.from || t.to != i.value.to) continue;
		}
		return i.value;
	}
}
var ta = ({ state: e, dispatch: t }) => {
	let { ranges: n } = e.selection;
	if (n.some((e) => e.from === e.to)) return $i({
		state: e,
		dispatch: t
	});
	let r = e.sliceDoc(n[0].from, n[0].to);
	if (e.selection.ranges.some((t) => e.sliceDoc(t.from, t.to) != r)) return !1;
	let i = ea(e, r);
	return i ? (t(e.update({
		selection: e.selection.addRange(D.range(i.from, i.to), !1),
		effects: b.scrollIntoView(i.to)
	})), !0) : !1;
}, na = /*@__PURE__*/ Ae.define({ combine(e) {
	return m(e, {
		top: !1,
		caseSensitive: !1,
		literal: !1,
		regexp: !1,
		wholeWord: !1,
		createPanel: (e) => new Fa(e),
		scrollToMatch: (e) => b.scrollIntoView(e)
	});
} }), ra = class {
	constructor(e) {
		this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || Xi(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord, this.test = e.test;
	}
	unquote(e) {
		return this.literal ? e : e.replace(/\\([nrt\\])/g, (e, t) => t == "n" ? "\n" : t == "r" ? "\r" : t == "t" ? "	" : "\\");
	}
	eq(e) {
		return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord && this.test == e.test;
	}
	create() {
		return this.regexp ? new ma(this) : new ca(this);
	}
	getCursor(e, t = 0, n) {
		let r = e.doc ? e : Re.create({ doc: e });
		return n ??= r.doc.length, this.regexp ? ua(this, r, t, n) : oa(this, r, t, n);
	}
}, ia = class {
	constructor(e) {
		this.spec = e;
	}
};
function aa(e, t, n) {
	return (r, i, a, o) => n && !n(r, i, a, o) ? !1 : e(r >= o && i <= o + a.length ? a.slice(r - o, i - o) : t.doc.sliceString(r, i), t, r, i);
}
function oa(e, t, n, r) {
	let i;
	return e.wholeWord && (i = sa(t.doc, t.charCategorizer(t.selection.main.head))), e.test && (i = aa(e.test, t, i)), new Ui(t.doc, e.unquoted, n, r, e.caseSensitive ? void 0 : (e) => e.toLowerCase(), i);
}
function sa(e, t) {
	return (n, r, i, a) => ((a > n || a + i.length < r) && (a = Math.max(0, n - 2), i = e.sliceString(a, Math.min(e.length, r + 2))), (t(da(i, n - a)) != w.Word || t(fa(i, n - a)) != w.Word) && (t(fa(i, r - a)) != w.Word || t(da(i, r - a)) != w.Word));
}
var ca = class extends ia {
	constructor(e) {
		super(e);
	}
	nextMatch(e, t, n) {
		let r = oa(this.spec, e, n, e.doc.length).nextOverlapping();
		if (r.done) {
			let n = Math.min(e.doc.length, t + this.spec.unquoted.length);
			r = oa(this.spec, e, 0, n).nextOverlapping();
		}
		return r.done || r.value.from == t && r.value.to == n ? null : r.value;
	}
	prevMatchInRange(e, t, n) {
		for (let r = n;;) {
			let n = Math.max(t, r - 1e4 - this.spec.unquoted.length), i = oa(this.spec, e, n, r), a = null;
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
		let n = oa(this.spec, e, 0, e.doc.length), r = [];
		for (; !n.next().done;) {
			if (r.length >= t) return null;
			r.push(n.value);
		}
		return r;
	}
	highlight(e, t, n, r) {
		let i = oa(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(n + this.spec.unquoted.length, e.doc.length));
		for (; !i.next().done;) r(i.value.from, i.value.to);
	}
};
function la(e, t, n) {
	return (r, i, a) => (!n || n(r, i, a)) && e(a[0], t, r, i);
}
function ua(e, t, n, r) {
	let i;
	return e.wholeWord && (i = pa(t.charCategorizer(t.selection.main.head))), e.test && (i = la(e.test, t, i)), new Ki(t.doc, e.search, {
		ignoreCase: !e.caseSensitive,
		test: i
	}, n, r);
}
function da(e, t) {
	return e.slice(ae(e, t, !1), t);
}
function fa(e, t) {
	return e.slice(t, ae(e, t));
}
function pa(e) {
	return (t, n, r) => !r[0].length || (e(da(r.input, r.index)) != w.Word || e(fa(r.input, r.index)) != w.Word) && (e(fa(r.input, r.index + r[0].length)) != w.Word || e(da(r.input, r.index + r[0].length)) != w.Word);
}
var ma = class extends ia {
	nextMatch(e, t, n) {
		let r = ua(this.spec, e, n, e.doc.length).next();
		return r.done && (r = ua(this.spec, e, 0, t).next()), r.done ? null : r.value;
	}
	prevMatchInRange(e, t, n) {
		for (let r = 1;; r++) {
			let i = Math.max(t, n - r * 1e4), a = ua(this.spec, e, i, n), o = null;
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
		let n = ua(this.spec, e, 0, e.doc.length), r = [];
		for (; !n.next().done;) {
			if (r.length >= t) return null;
			r.push(n.value);
		}
		return r;
	}
	highlight(e, t, n, r) {
		let i = ua(this.spec, e, Math.max(0, t - 250), Math.min(n + 250, e.doc.length));
		for (; !i.next().done;) r(i.value.from, i.value.to);
	}
}, ha = /*@__PURE__*/ C.define(), ga = /*@__PURE__*/ C.define(), B = /*@__PURE__*/ $e.define({
	create(e) {
		return new _a(ka(e).create(), null);
	},
	update(e, t) {
		for (let n of t.effects) n.is(ha) ? e = new _a(n.value.create(), e.panel) : n.is(ga) && (e = new _a(e.query, n.value ? Oa : null));
		return e;
	},
	provide: (e) => We.from(e, (e) => e.panel)
}), _a = class {
	constructor(e, t) {
		this.query = e, this.panel = t;
	}
}, va = /*@__PURE__*/ _.mark({ class: "cm-searchMatch" }), ya = /*@__PURE__*/ _.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), ba = /*@__PURE__*/ g.fromClass(class {
	constructor(e) {
		this.view = e, this.decorations = this.highlight(e.state.field(B));
	}
	update(e) {
		let t = e.state.field(B);
		(t != e.startState.field(B) || e.docChanged || e.selectionSet || e.viewportChanged) && (this.decorations = this.highlight(t));
	}
	highlight({ query: e, panel: t }) {
		if (!t || !e.spec.valid) return _.none;
		let { view: n } = this, r = new Xe();
		for (let t = 0, i = n.visibleRanges, a = i.length; t < a; t++) {
			let { from: o, to: s } = i[t];
			for (; t < a - 1 && s > i[t + 1].from - 500;) s = i[++t].to;
			e.highlight(n.state, o, s, (e, t) => {
				let i = n.state.selection.ranges.some((n) => n.from == e && n.to == t);
				r.add(e, t, i ? ya : va);
			});
		}
		return r.finish();
	}
}, { decorations: (e) => e.decorations });
function xa(e) {
	return (t) => {
		let n = t.state.field(B, !1);
		return n && n.query.spec.valid ? e(t, n) : Ma(t);
	};
}
var Sa = /*@__PURE__*/ xa((e, { query: t }) => {
	let { to: n } = e.state.selection.main, r = t.nextMatch(e.state, n, n);
	if (!r) return !1;
	let i = D.single(r.from, r.to), a = e.state.facet(na);
	return e.dispatch({
		selection: i,
		effects: [Ra(e, r), a.scrollToMatch(i.main, e)],
		userEvent: "select.search"
	}), ja(e), !0;
}), Ca = /*@__PURE__*/ xa((e, { query: t }) => {
	let { state: n } = e, { from: r } = n.selection.main, i = t.prevMatch(n, r, r);
	if (!i) return !1;
	let a = D.single(i.from, i.to), o = e.state.facet(na);
	return e.dispatch({
		selection: a,
		effects: [Ra(e, i), o.scrollToMatch(a.main, e)],
		userEvent: "select.search"
	}), ja(e), !0;
}), wa = /*@__PURE__*/ xa((e, { query: t }) => {
	let n = t.matchAll(e.state, 1e3);
	return !n || !n.length ? !1 : (e.dispatch({
		selection: D.create(n.map((e) => D.range(e.from, e.to))),
		userEvent: "select.search.matches"
	}), !0);
}), Ta = ({ state: e, dispatch: t }) => {
	let n = e.selection;
	if (n.ranges.length > 1 || n.main.empty) return !1;
	let { from: r, to: i } = n.main, a = [], o = 0;
	for (let t = new Ui(e.doc, e.sliceDoc(r, i)); !t.next().done;) {
		if (a.length > 1e3) return !1;
		t.value.from == r && (o = a.length), a.push(D.range(t.value.from, t.value.to));
	}
	return t(e.update({
		selection: D.create(a, o),
		userEvent: "select.search.matches"
	})), !0;
}, Ea = /*@__PURE__*/ xa((e, { query: t }) => {
	let { state: n } = e, { from: r, to: i } = n.selection.main;
	if (n.readOnly) return !1;
	let a = t.nextMatch(n, r, r);
	if (!a) return !1;
	let o = a, s = [], c, l, u = [];
	o.precise ? o.from == r && o.to == i && (l = n.toText(t.getReplacement(o)), s.push({
		from: o.from,
		to: o.to,
		insert: l
	}), o = t.nextMatch(n, o.from, o.to), u.push(b.announce.of(n.phrase("replaced match on line $", n.doc.lineAt(r).number) + "."))) : o = t.nextMatch(n, o.from, o.to);
	let d = e.state.changes(s);
	return o && (c = D.single(o.from, o.to).map(d), u.push(Ra(e, o)), u.push(n.facet(na).scrollToMatch(c.main, e))), e.dispatch({
		changes: d,
		selection: c,
		effects: u,
		userEvent: "input.replace"
	}), !0;
}), Da = /*@__PURE__*/ xa((e, { query: t }) => {
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
		effects: b.announce.of(r),
		userEvent: "input.replace.all"
	}), !0;
});
function Oa(e) {
	return e.state.facet(na).createPanel(e);
}
function ka(e, t) {
	let n = e.selection.main, r = n.empty || n.to > n.from + 100 ? "" : e.sliceDoc(n.from, n.to);
	if (t && !r) return t;
	let i = e.facet(na);
	return new ra({
		search: t?.literal ?? i.literal ? r : r.replace(/\n/g, "\\n"),
		caseSensitive: t?.caseSensitive ?? i.caseSensitive,
		literal: t?.literal ?? i.literal,
		regexp: t?.regexp ?? i.regexp,
		wholeWord: t?.wholeWord ?? i.wholeWord
	});
}
function Aa(e) {
	let t = He(e, Oa);
	return t && t.dom.querySelector("[main-field]");
}
function ja(e) {
	let t = Aa(e);
	t && t == e.root.activeElement && t.select();
}
var Ma = (e) => {
	let t = e.state.field(B, !1);
	if (t && t.panel) {
		let n = Aa(e);
		if (n && n != e.root.activeElement) {
			let r = ka(e.state, t.query.spec);
			r.valid && e.dispatch({ effects: ha.of(r) }), n.focus(), n.select();
		}
	} else e.dispatch({ effects: [ga.of(!0), t ? ha.of(ka(e.state, t.query.spec)) : C.appendConfig.of(Ba)] });
	return !0;
}, Na = (e) => {
	let t = e.state.field(B, !1);
	if (!t || !t.panel) return !1;
	let n = He(e, Oa);
	return n && n.dom.contains(e.root.activeElement) && e.focus(), e.dispatch({ effects: ga.of(!1) }), !0;
}, Pa = [
	{
		key: "Mod-f",
		run: Ma,
		scope: "editor search-panel"
	},
	{
		key: "F3",
		run: Sa,
		shift: Ca,
		scope: "editor search-panel",
		preventDefault: !0
	},
	{
		key: "Mod-g",
		run: Sa,
		shift: Ca,
		scope: "editor search-panel",
		preventDefault: !0
	},
	{
		key: "Escape",
		run: Na,
		scope: "editor search-panel"
	},
	{
		key: "Mod-Shift-l",
		run: Ta
	},
	{
		key: "Mod-Alt-g",
		run: Qi
	},
	{
		key: "Mod-d",
		run: ta,
		preventDefault: !0
	}
], Fa = class {
	constructor(e) {
		this.view = e;
		let t = this.query = e.state.field(B).query.spec;
		this.commit = this.commit.bind(this), this.searchField = S("input", {
			value: t.search,
			placeholder: V(e, "Find"),
			"aria-label": V(e, "Find"),
			class: "cm-textfield",
			name: "search",
			form: "",
			"main-field": "true",
			onchange: this.commit,
			onkeyup: this.commit
		}), this.replaceField = S("input", {
			value: t.replace,
			placeholder: V(e, "Replace"),
			"aria-label": V(e, "Replace"),
			class: "cm-textfield",
			name: "replace",
			form: "",
			onchange: this.commit,
			onkeyup: this.commit
		}), this.caseField = S("input", {
			type: "checkbox",
			name: "case",
			form: "",
			checked: t.caseSensitive,
			onchange: this.commit
		}), this.reField = S("input", {
			type: "checkbox",
			name: "re",
			form: "",
			checked: t.regexp,
			onchange: this.commit
		}), this.wordField = S("input", {
			type: "checkbox",
			name: "word",
			form: "",
			checked: t.wholeWord,
			onchange: this.commit
		});
		function n(e, t, n) {
			return S("button", {
				class: "cm-button",
				name: e,
				onclick: t,
				type: "button"
			}, n);
		}
		this.dom = S("div", {
			onkeydown: (e) => this.keydown(e),
			class: "cm-search"
		}, [
			this.searchField,
			n("next", () => Sa(e), [V(e, "next")]),
			n("prev", () => Ca(e), [V(e, "previous")]),
			n("select", () => wa(e), [V(e, "all")]),
			S("label", null, [this.caseField, V(e, "match case")]),
			S("label", null, [this.reField, V(e, "regexp")]),
			S("label", null, [this.wordField, V(e, "by word")]),
			...e.state.readOnly ? [] : [
				S("br"),
				this.replaceField,
				n("replace", () => Ea(e), [V(e, "replace")]),
				n("replaceAll", () => Da(e), [V(e, "replace all")])
			],
			S("button", {
				name: "close",
				onclick: () => Na(e),
				"aria-label": V(e, "close"),
				type: "button"
			}, ["×"])
		]);
	}
	commit() {
		let e = new ra({
			search: this.searchField.value,
			caseSensitive: this.caseField.checked,
			regexp: this.reField.checked,
			wholeWord: this.wordField.checked,
			replace: this.replaceField.value
		});
		e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: ha.of(e) }));
	}
	keydown(e) {
		qe(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? Ca : Sa)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), Ea(this.view));
	}
	update(e) {
		for (let t of e.transactions) for (let e of t.effects) e.is(ha) && !e.value.eq(this.query) && this.setQuery(e.value);
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
		return this.view.state.facet(na).top;
	}
};
function V(e, t) {
	return e.state.phrase(t);
}
var Ia = 30, La = /[\s\.,:;?!]/;
function Ra(e, { from: t, to: n }) {
	let r = e.state.doc.lineAt(t), i = e.state.doc.lineAt(n).to, a = Math.max(r.from, t - Ia), o = Math.min(i, n + Ia), s = e.state.sliceDoc(a, o);
	if (a != r.from) {
		for (let e = 0; e < Ia; e++) if (!La.test(s[e + 1]) && La.test(s[e])) {
			s = s.slice(e);
			break;
		}
	}
	if (o != i) {
		for (let e = s.length - 1; e > s.length - Ia; e--) if (!La.test(s[e - 1]) && La.test(s[e])) {
			s = s.slice(0, e);
			break;
		}
	}
	return b.announce.of(`${e.state.phrase("current match")}. ${s} ${e.state.phrase("on line")} ${r.number}.`);
}
var za = /*@__PURE__*/ b.baseTheme({
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
}), Ba = [
	B,
	/*@__PURE__*/ ve.low(ba),
	za
], Va = "tp-code-editor{--tp-code-editor-surface:var(--tp-syntax-surface,var(--tp-paper-color,#fff));--tp-code-editor-foreground:var(--tp-syntax-foreground,var(--tp-text-body,#111827));--tp-code-editor-muted:var(--tp-syntax-muted,var(--tp-text-muted,#6b7280));--tp-code-editor-caret:var(--tp-syntax-caret,var(--tp-text-body,#111827));--tp-code-editor-selection:var(--tp-syntax-selection,color-mix(in srgb, var(--tp-brand-fill-mid,#60a5fa) 62%, transparent));--tp-code-editor-active-line:var(--tp-syntax-active-line,color-mix(in srgb, var(--tp-neutral-fill-soft,#e5e7eb) 38%, transparent));--tp-code-editor-gutter-background:var(--tp-syntax-gutter-background,color-mix(in srgb, var(--tp-neutral-fill-softer,#f3f4f6) 88%, transparent));--tp-code-editor-gutter-foreground:var(--tp-syntax-gutter-foreground,var(--tp-text-muted,#6b7280));--tp-code-editor-gutter-border:var(--tp-syntax-gutter-border,var(--tp-neutral-stroke-soft,#d1d5db));--tp-code-editor-fold-background:var(--tp-syntax-fold-background,color-mix(in srgb, var(--tp-neutral-fill-soft,#e5e7eb) 70%, transparent));--tp-code-editor-token-keyword:var(--tp-syntax-token-keyword,#2563eb);--tp-code-editor-token-string:var(--tp-syntax-token-string,#b45309);--tp-code-editor-token-number:var(--tp-syntax-token-number,#7c3aed);--tp-code-editor-token-comment:var(--tp-syntax-token-comment,#6b7280);--tp-code-editor-token-variable:var(--tp-syntax-token-variable,#0f766e);--tp-code-editor-token-property:var(--tp-syntax-token-property,#0f766e);--tp-code-editor-token-type:var(--tp-syntax-token-type,#1d4ed8);--tp-code-editor-token-function:var(--tp-syntax-token-function,#1d4ed8);--tp-code-editor-token-link:var(--tp-syntax-token-link,#0284c7);border:1px solid var(--tp-neutral-stroke-soft,#d1d5db);border-block-end-color:var(--tp-neutral-stroke-soft,#d1d5db);box-sizing:border-box;grid-template-rows:auto minmax(0,1fr);min-block-size:0;min-inline-size:0;display:grid;position:relative;overflow:visible}tp-code-editor .cm-placeholder{color:var(--tp-code-editor-foreground)!important;opacity:1!important}tp-code-editor.tp-dark{--tp-syntax-surface:#1e1e1e;--tp-syntax-foreground:#d4d4d4;--tp-syntax-muted:#6a9955;--tp-syntax-caret:#d4d4d4;--tp-syntax-selection:#2677bf9e;--tp-syntax-active-line:#ffffff0d;--tp-syntax-gutter-background:#181818;--tp-syntax-gutter-foreground:#858585;--tp-syntax-gutter-border:#2f2f2f;--tp-syntax-fold-background:#ffffff14;--tp-syntax-token-keyword:#569cd6;--tp-syntax-token-string:#ce9178;--tp-syntax-token-number:#b5cea8;--tp-syntax-token-comment:#6a9955;--tp-syntax-token-variable:#9cdcfe;--tp-syntax-token-property:#9cdcfe;--tp-syntax-token-type:#4ec9b0;--tp-syntax-token-function:#dcdcaa;--tp-syntax-token-link:#4fc1ff}tp-code-editor{direction:ltr;unicode-bidi:isolate}tp-code-editor .cm-editor,tp-code-editor .cm-content,tp-code-editor .cm-line{text-align:left;direction:ltr;unicode-bidi:isolate}tp-code-editor>[data-tp-code-editor]{block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;overflow:hidden}tp-code-editor .cm-editor{color:canvastext;background:canvas;block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;position:relative;overflow:visible}tp-code-editor .cm-scroller{overflow:auto}tp-code-editor .cm-content{min-block-size:2.8em;min-block-size:2lh;line-height:1.5rem}tp-code-editor .cm-line{overflow-wrap:normal;word-break:normal;line-height:1.5rem}tp-code-editor .cm-panels{z-index:6;flex-direction:column;gap:.25rem;font-size:.8125rem;line-height:1.3;display:flex}tp-code-editor>[data-tp-code-editor-panels]{z-index:20;gap:.25rem;min-block-size:0;margin-block-end:.25rem;display:grid}tp-code-editor>[data-tp-code-editor-panels]>[data-tp-code-editor-source-error]{background:color-mix(in srgb, var(--tp-danger-fill-soft,#fecaca) 65%, transparent);border:1px solid color-mix(in srgb, var(--tp-danger-stroke-soft,#fca5a5) 70%, transparent);color:var(--tp-danger-text-colorful,#b91c1c);white-space:normal;border-radius:.25rem;padding:.3rem .45rem;font-size:.8125rem;line-height:1.3}tp-code-editor>[data-tp-code-editor-panels] .cm-panels{position:static!important;inset:auto!important}tp-code-editor .cm-panel{background:var(--tp-code-editor-surface,Canvas);border-block-color:color-mix(in srgb, currentColor 20%, transparent);color:var(--tp-code-editor-foreground,CanvasText);white-space:nowrap;flex-wrap:nowrap;align-items:center;gap:.25rem;padding:.25rem .375rem;display:flex;overflow:auto hidden}tp-code-editor [data-tp-code-editor-action-panel]{justify-content:stretch;align-items:center;gap:.5rem;display:flex}tp-code-editor:not([toolbar]) [data-tp-code-editor-action-panel]{display:none}tp-code-editor [data-tp-code-editor-action-section]{align-items:center;gap:.35rem;min-inline-size:0;display:inline-flex}tp-code-editor [data-tp-code-editor-action-section=start]{justify-content:flex-start}tp-code-editor [data-tp-code-editor-action-section=center]{flex:auto;justify-content:center}tp-code-editor [data-tp-code-editor-action-section=end]{justify-content:flex-end}tp-code-editor [data-tp-code-editor-action-panel] tp-theme,tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen{display:inline-flex}tp-code-editor [data-tp-code-editor-action-panel] tp-badge,tp-code-editor [data-tp-code-editor-action-panel] tp-theme,tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen,tp-code-editor [data-tp-code-editor-action-panel] tp-copy-code,tp-code-editor [data-tp-code-editor-action-panel] button{position:static;inset:auto}tp-code-editor [data-tp-code-editor-action-panel] tp-theme>tp-icon-button,tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen>tp-icon-button{--tp-icon-button-size:1.4rem;--tp-icon-button-icon-size:.85rem}tp-code-editor [data-tp-code-editor-action-panel] tp-theme>tp-icon-button>button,tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen>tp-icon-button>button{border:0!important}tp-code-editor [data-tp-code-editor-action-panel] tp-copy-code[size=xs]{min-block-size:1.5rem;min-inline-size:1.5rem}tp-code-editor [data-tp-code-editor-action-panel] tp-copy-code[size=xs] tp-icon{--tp-icon-size:.875rem}tp-code-editor [data-tp-code-editor-cursor-position]{color:var(--tp-code-editor-muted,var(--tp-text-muted,#6b7280));white-space:nowrap;font-size:.75rem;line-height:1}tp-code-editor .cm-panels :is(input,button,select,.cm-button){block-size:1.5rem;min-block-size:1.5rem;box-sizing:border-box;min-height:1.5rem;font:inherit;inline-size:auto;border-radius:.25rem;width:auto;padding:.125rem .4rem;line-height:1.1;display:inline-block}tp-code-editor .cm-panels input{max-inline-size:13rem}tp-code-editor .cm-panels input[type=checkbox]{appearance:auto;accent-color:var(--tp-brand-fill-mid,#2563eb);block-size:1rem;min-block-size:1rem;min-height:1rem;vertical-align:middle;inline-size:1rem;width:1rem;margin:0;padding:0}tp-code-editor .cm-panels label{align-items:center;column-gap:.25rem;line-height:1.1;display:inline-flex}tp-code-editor .cm-panel.cm-search{white-space:normal;flex-wrap:wrap;overflow:visible}tp-code-editor .cm-panel.cm-search>br{flex-basis:100%;block-size:0;inline-size:0;margin:0;padding:0;display:block}tp-code-editor .cm-editor,tp-code-editor .cm-scroller,tp-code-editor .cm-content,tp-code-editor .cm-line{text-align:left;direction:ltr;unicode-bidi:isolate}tp-code-editor [data-tp-code-editor-action-panel]>button{border:1px solid color-mix(in srgb, currentColor 20%, transparent);color:canvastext;cursor:pointer;font:inherit;pointer-events:auto;background:canvas;border-radius:999rem;justify-content:center;align-items:center;padding:.25rem;display:inline-flex}tp-code-editor [data-tp-code-editor-action-panel]>button:hover{background:color-mix(in srgb, currentColor 8%, transparent)}.cm-rst-section-title{color:var(--tp-code-editor-token-number,#7c3aed);font-weight:700}.tp-code-comment-marker{vertical-align:middle;align-items:center;line-height:1;display:inline-flex}tp-code-editor .tp-code-comment-marker>tp-icon{color:var(--tp-code-editor-foreground)}tp-code-editor .tp-code-comment-marker:focus-visible{outline:2px solid var(--tp-code-editor-foreground);outline-offset:2px;border-radius:50%}tp-code-editor .tp-code-comment-marker svg>circle[fill=white]{fill:var(--tp-code-editor-surface)}", Ha = class e {
	constructor(e, t, n, r, i, a, o, s, c, l = 0, u) {
		this.p = e, this.stack = t, this.state = n, this.reducePos = r, this.pos = i, this.score = a, this.buffer = o, this.bufferBase = s, this.curContext = c, this.lookAhead = l, this.parent = u;
	}
	toString() {
		return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
	}
	static start(t, n, r = 0) {
		let i = t.parser.context;
		return new e(t, [], n, r, r, 0, [], 0, i ? new Ua(i, i.start) : null, 0, null);
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
		for (let t = new Wa(this);;) {
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
			let t = new Ua(this.curContext.tracker, e);
			t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
		}
	}
	setLookAhead(e) {
		return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
	}
	close() {
		this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
	}
}, Ua = class {
	constructor(e, t) {
		this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
	}
}, Wa = class {
	constructor(e) {
		this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
	}
	reduce(e) {
		let t = e & 65535, n = e >> 19;
		n == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (n - 1) * 3;
		let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
		this.state = r;
	}
}, Ga = class e {
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
function Ka(e, t = Uint16Array) {
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
var qa = class {
	constructor() {
		this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
	}
}, Ja = new qa(), Ya = class {
	constructor(e, t) {
		this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Ja, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
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
		if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = Ja, this.pos != e) {
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
}, Xa = class {
	constructor(e, t) {
		this.data = e, this.id = t;
	}
	token(e, t) {
		let { parser: n } = t.p;
		Qa(this.data, e, t, this.id, n.data, n.tokenPrecTable);
	}
};
Xa.prototype.contextual = Xa.prototype.fallback = Xa.prototype.extend = !1;
var Za = class {
	constructor(e, t, n) {
		this.precTable = t, this.elseToken = n, this.data = typeof e == "string" ? Ka(e) : e;
	}
	token(e, t) {
		let n = e.pos, r = 0;
		for (;;) {
			let n = e.next < 0, i = e.resolveOffset(1, 1);
			if (Qa(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1) break;
			if (this.elseToken == null) return;
			if (n || r++, i == null) break;
			e.reset(i, e.token);
		}
		r && (e.reset(n, e.token), e.acceptToken(this.elseToken, r));
	}
};
Za.prototype.contextual = Xa.prototype.fallback = Xa.prototype.extend = !1;
var H = class {
	constructor(e, t = {}) {
		this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
	}
};
function Qa(e, t, n, r, i, a) {
	let o = 0, s = 1 << r, { dialect: c } = n.p.parser;
	scan: for (; (s & e[o]) != 0;) {
		let n = e[o + 1];
		for (let r = o + 3; r < n; r += 2) if ((e[r + 1] & s) > 0) {
			let n = e[r];
			if (c.allows(n) && (t.token.value == -1 || t.token.value == n || eo(n, t.token.value, i, a))) {
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
function $a(e, t, n) {
	for (let r = t, i; (i = e[r]) != 65535; r++) if (i == n) return r - t;
	return -1;
}
function eo(e, t, n, r) {
	let i = $a(n, r, t);
	return i < 0 || $a(n, r, e) < i;
}
var U = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG), to = null;
function no(e, t, n) {
	let r = e.cursor(oe.IncludeAnonymous);
	for (r.moveTo(t);;) if (!(n < 0 ? r.childBefore(t) : r.childAfter(t))) for (;;) {
		if ((n < 0 ? r.to < t : r.from > t) && !r.type.isError) return n < 0 ? Math.max(0, Math.min(r.to - 1, t - 25)) : Math.min(e.length, Math.max(r.from + 1, t + 25));
		if (n < 0 ? r.prevSibling() : r.nextSibling()) break;
		if (!r.parent()) return n < 0 ? 0 : e.length;
	}
}
var ro = class {
	constructor(e, t) {
		this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
	}
	nextFragment() {
		let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
		if (e) {
			for (this.safeFrom = e.openStart ? no(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? no(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length;) this.trees.pop(), this.start.pop(), this.index.pop();
			this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
		} else this.nextStart = 1e9;
	}
	nodeAt(e) {
		if (e < this.nextStart) return null;
		for (; this.fragment && this.safeTo <= e;) this.nextFragment();
		if (!this.fragment) return null;
		for (;;) {
			let t = this.trees.length - 1;
			if (t < 0) return this.nextFragment(), null;
			let n = this.trees[t], r = this.index[t];
			if (r == n.children.length) {
				this.trees.pop(), this.start.pop(), this.index.pop();
				continue;
			}
			let i = n.children[r], a = this.start[t] + n.positions[r];
			if (a > e) return this.nextStart = a, null;
			if (i instanceof c) {
				if (a == e) {
					if (a < this.safeFrom) return null;
					let e = a + i.length;
					if (e <= this.safeTo) {
						let t = i.prop(h.lookAhead);
						if (!t || e + t < this.fragment.to) return i;
					}
				}
				this.index[t]++, a + i.length >= Math.max(this.safeFrom, e) && (this.trees.push(i), this.start.push(a), this.index.push(0));
			} else this.index[t]++, this.nextStart = a + i.length;
		}
	}
}, io = class {
	constructor(e, t) {
		this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((e) => new qa());
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
		return s && e.setLookAhead(s), !n && e.pos == this.stream.end && (n = new qa(), n.value = e.p.parser.eofTerm, n.start = n.end = e.pos, t = this.addActions(e, n.value, n.end, t)), this.mainToken = n, this.actions;
	}
	getMainToken(e) {
		if (this.mainToken) return this.mainToken;
		let t = new qa(), { pos: n, p: r } = e;
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
			if (o[s] == 65535) if (o[s + 1] == 1) s = W(o, s + 2);
			else {
				r == 0 && o[s + 1] == 2 && (r = this.putAction(W(o, s + 2), t, n, r));
				break;
			}
			o[s] == t && (r = this.putAction(W(o, s + 1), t, n, r));
		}
		return r;
	}
}, ao = class {
	constructor(e, t, n, r) {
		this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new Ya(t, r), this.tokens = new io(e, this.stream), this.topTerm = e.top[1];
		let { from: i } = r[0];
		this.stacks = [Ha.start(this, e.top[0], i)], this.fragments = n.length && this.stream.end - i > e.bufferLength * 4 ? new ro(n, e.nodeSet) : null;
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
			let e = r && fo(r);
			if (e) return U && console.log("Finish with " + this.stackID(e)), this.stackToTree(e);
			if (this.parser.strict) throw U && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), SyntaxError("No parse at " + t);
			this.recovering ||= 5;
		}
		if (this.recovering && r) {
			let e = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, i, n);
			if (e) return U && console.log("Force-finish " + this.stackID(e)), this.stackToTree(e.forceAll());
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
	advanceStack(e, t, n) {
		let r = e.pos, { parser: i } = this, a = U ? this.stackID(e) + " -> " : "";
		if (this.stoppedAt != null && r > this.stoppedAt) return e.forceReduce() ? e : null;
		if (this.fragments) {
			let t = e.curContext && e.curContext.tracker.strict, n = t ? e.curContext.hash : 0;
			for (let o = this.fragments.nodeAt(r); o;) {
				let r = this.parser.nodeSet.types[o.type.id] == o.type ? i.getGoto(e.state, o.type.id) : -1;
				if (r > -1 && o.length && (!t || (o.prop(h.contextHash) || 0) == n)) return e.useNode(o, r), U && console.log(a + this.stackID(e) + ` (via reuse of ${i.getName(o.type.id)})`), !0;
				if (!(o instanceof c) || o.children.length == 0 || o.positions[0] > 0) break;
				let s = o.children[0];
				if (s instanceof c && o.positions[0] == 0) o = s;
				else break;
			}
		}
		let o = i.stateSlot(e.state, 4);
		if (o > 0) return e.reduce(o), U && console.log(a + this.stackID(e) + ` (via always-reduce ${i.getName(o & 65535)})`), !0;
		if (e.stack.length >= 8400) for (; e.stack.length > 6e3 && e.forceReduce(););
		let s = this.tokens.getActions(e);
		for (let o = 0; o < s.length;) {
			let c = s[o++], l = s[o++], u = s[o++], d = o == s.length || !n, f = d ? e : e.split(), p = this.tokens.mainToken;
			if (f.apply(c, l, p ? p.start : f.pos, u), U && console.log(a + this.stackID(f) + ` (via ${c & 65536 ? `reduce of ${i.getName(c & 65535)}` : "shift"} for ${i.getName(l)} @ ${r}${f == e ? "" : ", split"})`), d) return !0;
			f.pos > r ? t.push(f) : n.push(f);
		}
		return !1;
	}
	advanceFully(e, t) {
		let n = e.pos;
		for (;;) {
			if (!this.advanceStack(e, null, null)) return !1;
			if (e.pos > n) return oo(e, t), !0;
		}
	}
	runRecovery(e, t, n) {
		let r = null, i = !1;
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = t[a << 1], c = t[(a << 1) + 1], l = U ? this.stackID(o) + " -> " : "";
			if (o.deadEnd && (i || (i = !0, o.restart(), U && console.log(l + this.stackID(o) + " (restarted)"), this.advanceFully(o, n)))) continue;
			let u = o.split(), d = l;
			for (let e = 0; e < 10 && u.forceReduce() && (U && console.log(d + this.stackID(u) + " (via force-reduce)"), !this.advanceFully(u, n)); e++) U && (d = this.stackID(u) + " -> ");
			for (let e of o.recoverByInsert(s)) U && console.log(l + this.stackID(e) + " (via recover-insert)"), this.advanceFully(e, n);
			this.stream.end > o.pos ? (c == o.pos && (c++, s = 0), o.recoverByDelete(s, c), U && console.log(l + this.stackID(o) + ` (via recover-delete ${this.parser.getName(s)})`), oo(o, n)) : (!r || r.score < u.score) && (r = u);
		}
		return r;
	}
	stackToTree(e) {
		return e.close(), c.build({
			buffer: Ga.create(e),
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
		let t = (to ||= /* @__PURE__ */ new WeakMap()).get(e);
		return t || to.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
	}
};
function oo(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (r.pos == e.pos && r.sameState(e)) {
			t[n].score < e.score && (t[n] = e);
			return;
		}
	}
	t.push(e);
}
var so = class {
	constructor(e, t, n) {
		this.source = e, this.flags = t, this.disabled = n;
	}
	allows(e) {
		return !this.disabled || this.disabled[e] == 0;
	}
}, co = (e) => e, lo = class {
	constructor(e) {
		this.start = e.start, this.shift = e.shift || co, this.reduce = e.reduce || co, this.reuse = e.reuse || co, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
	}
}, uo = class e extends nt {
	constructor(e) {
		if (super(), this.wrappers = [], e.version != 14) throw RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
		let t = e.nodeNames.split(" ");
		this.minRepeatTerm = t.length;
		for (let n = 0; n < e.repeatNodeCount; n++) t.push("");
		let n = Object.keys(e.topRules).map((t) => e.topRules[t][1]), r = [];
		for (let e = 0; e < t.length; e++) r.push([]);
		function i(e, t, n) {
			r[e].push([t, t.deserialize(String(n))]);
		}
		if (e.nodeProps) for (let t of e.nodeProps) {
			let e = t[0];
			typeof e == "string" && (e = h[e]);
			for (let n = 1; n < t.length;) {
				let r = t[n++];
				if (r >= 0) i(r, e, t[n++]);
				else {
					let a = t[n + -r];
					for (let o = -r; o > 0; o--) i(t[n++], e, a);
					n++;
				}
			}
		}
		this.nodeSet = new ee(t.map((t, i) => re.define({
			name: i >= this.minRepeatTerm ? void 0 : t,
			id: i,
			props: r[i],
			top: n.indexOf(i) > -1,
			error: i == 0,
			skipped: e.skippedNodes && e.skippedNodes.indexOf(i) > -1
		}))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = ie;
		let a = Ka(e.tokenData);
		this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
		for (let e = 0; e < this.specializerSpecs.length; e++) this.specialized[e] = this.specializerSpecs[e].term;
		this.specializers = this.specializerSpecs.map(po), this.states = Ka(e.states, Uint32Array), this.data = Ka(e.stateData), this.goto = Ka(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((e) => typeof e == "number" ? new Xa(a, e) : e), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
	}
	createParse(e, t, n) {
		let r = new ao(this, e, t, n);
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
			if ((a = n[i]) == 65535) if (n[i + 1] == 1) a = n[i = W(n, i + 2)];
			else if (n[i + 1] == 2) return W(n, i + 2);
			else break;
			if (a == t || a == 0) return W(n, i + 1);
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
			if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = W(this.data, n + 2);
			else break;
			r = t(W(this.data, n + 1));
		}
		return r;
	}
	nextStates(e) {
		let t = [];
		for (let n = this.stateSlot(e, 1);; n += 3) {
			if (this.data[n] == 65535) if (this.data[n + 1] == 1) n = W(this.data, n + 2);
			else break;
			if (!(this.data[n + 2] & 1)) {
				let e = this.data[n + 1];
				t.some((t, n) => n & 1 && t == e) || t.push(this.data[n], e);
			}
		}
		return t;
	}
	configure(t) {
		let n = Object.assign(Object.create(e.prototype), this);
		if (t.props && (n.nodeSet = this.nodeSet.extend(...t.props)), t.top) {
			let e = this.topRules[t.top];
			if (!e) throw RangeError(`Invalid top rule name ${t.top}`);
			n.top = e;
		}
		return t.tokenizers && (n.tokenizers = this.tokenizers.map((e) => {
			let n = t.tokenizers.find((t) => t.from == e);
			return n ? n.to : e;
		})), t.specializers && (n.specializers = this.specializers.slice(), n.specializerSpecs = this.specializerSpecs.map((e, r) => {
			let i = t.specializers.find((t) => t.from == e.external);
			if (!i) return e;
			let a = Object.assign(Object.assign({}, e), { external: i.to });
			return n.specializers[r] = po(a), a;
		})), t.contextTracker && (n.context = t.contextTracker), t.dialect && (n.dialect = this.parseDialect(t.dialect)), t.strict != null && (n.strict = t.strict), t.wrap && (n.wrappers = n.wrappers.concat(t.wrap)), t.bufferLength != null && (n.bufferLength = t.bufferLength), n;
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
		return new so(e, n, r);
	}
	static deserialize(t) {
		return new e(t);
	}
};
function W(e, t) {
	return e[t] | e[t + 1] << 16;
}
function fo(e) {
	let t = null;
	for (let n of e) {
		let e = n.p.stoppedAt;
		(n.pos == n.p.stream.end || e != null && n.pos > e) && n.p.parser.stateFlag(n.state, 2) && (!t || t.score < n.score) && (t = n);
	}
	return t;
}
function po(e) {
	if (e.external) {
		let t = +!!e.extend;
		return (n, r) => e.external(n, r) << 1 | t;
	}
	return e.get;
}
//#endregion
//#region ../node_modules/.pnpm/@lezer+css@1.3.4/node_modules/@lezer/css/dist/index.js
var mo = 145, ho = 1, go = 146, _o = 147, vo = 2, yo = 148, bo = 3, xo = 4, So = [
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
], Co = 58, wo = 40, To = 95, Eo = 91, Do = 45, Oo = 46, ko = 35, Ao = 37, jo = 38, Mo = 92, No = 10, Po = 42;
function Fo(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 161;
}
function Io(e) {
	return e >= 48 && e <= 57;
}
function Lo(e) {
	return Io(e) || e >= 97 && e <= 102 || e >= 65 && e <= 70;
}
var Ro = (e, t, n) => (r, i) => {
	for (let a = !1, o = 0, s = 0;; s++) {
		let { next: c } = r;
		if (Fo(c) || c == Do || c == To || a && Io(c)) !a && (c != Do || s > 0) && (a = !0), o === s && c == Do && o++, r.advance();
		else if (c == Mo && r.peek(1) != No) {
			if (r.advance(), Lo(r.next)) {
				do
					r.advance();
				while (Lo(r.next));
				r.next == 32 && r.advance();
			} else r.next > -1 && r.advance();
			a = !0;
		} else {
			a && r.acceptToken(o == 2 && i.canShift(vo) ? t : c == wo ? n : e);
			break;
		}
	}
}, zo = new H(Ro(go, vo, _o), { contextual: !0 }), Bo = new H(Ro(yo, bo, xo), { contextual: !0 }), Vo = new H((e) => {
	if (So.includes(e.peek(-1))) {
		let { next: t } = e;
		(Fo(t) || t == To || t == ko || t == Oo || t == Po || t == Eo || t == Co && Fo(e.peek(1)) || t == Do || t == jo) && e.acceptToken(mo);
	}
}), Ho = new H((e) => {
	if (!So.includes(e.peek(-1))) {
		let { next: t } = e;
		if (t == Ao && (e.advance(), e.acceptToken(ho)), Fo(t)) {
			do
				e.advance();
			while (Fo(e.next) || Io(e.next));
			e.acceptToken(ho);
		}
	}
}), Uo = T({
	"AtKeyword import charset namespace keyframes media supports font-feature-values": v.definitionKeyword,
	"from to selector scope MatchFlag": v.keyword,
	NamespaceName: v.namespace,
	KeyframeName: v.labelName,
	KeyframeRangeName: v.operatorKeyword,
	TagName: v.tagName,
	ClassName: v.className,
	PseudoClassName: v.constant(v.className),
	IdName: v.labelName,
	"FeatureName PropertyName": v.propertyName,
	AttributeName: v.attributeName,
	NumberLiteral: v.number,
	KeywordQuery: v.keyword,
	UnaryQueryOp: v.operatorKeyword,
	"CallTag ValueName FontName": v.atom,
	VariableName: v.variableName,
	Callee: v.operatorKeyword,
	Unit: v.unit,
	"UniversalSelector NestingSelector": v.definitionOperator,
	"MatchOp CompareOp": v.compareOperator,
	"ChildOp SiblingOp, LogicOp": v.logicOperator,
	BinOp: v.arithmeticOperator,
	Important: v.modifier,
	Comment: v.blockComment,
	ColorLiteral: v.color,
	"ParenthesizedContent StringLiteral": v.string,
	":": v.punctuation,
	"PseudoOp #": v.derefOperator,
	"; , |": v.separator,
	"( )": v.paren,
	"[ ]": v.squareBracket,
	"{ }": v.brace
}), Wo = {
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
}, Go = {
	__proto__: null,
	or: 104,
	and: 104,
	not: 112,
	only: 112,
	layer: 206
}, Ko = {
	__proto__: null,
	selector: 118,
	style: 124,
	layer: 202
}, qo = {
	__proto__: null,
	"@import": 198,
	"@media": 210,
	"@charset": 214,
	"@namespace": 218,
	"@keyframes": 224,
	"@supports": 236,
	"@scope": 240,
	"@font-feature-values": 246
}, Jo = {
	__proto__: null,
	to: 243
}, Yo = uo.deserialize({
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
	propSources: [Uo],
	skippedNodes: [
		0,
		5,
		127
	],
	repeatNodeCount: 17,
	tokenData: "K`~R!bOX%ZX^&R^p%Zpq&Rqr)ers)vst+jtu2Xuv%Zvw3Rwx3dxy5Ryz5dz{5i{|6S|}:u}!O;W!O!P;u!P!Q<^!Q![=V![!]>Q!]!^>|!^!_?_!_!`@Z!`!a@n!a!b%Z!b!cAo!c!k%Z!k!lC|!l!u%Z!u!vC|!v!}%Z!}#OD_#O#P%Z#P#QDp#Q#R2X#R#]%Z#]#^ER#^#g%Z#g#hC|#h#o%Z#o#pIf#p#qIw#q#rJ`#r#sJq#s#y%Z#y#z&R#z$f%Z$f$g&R$g#BY%Z#BY#BZ&R#BZ$IS%Z$IS$I_&R$I_$I|%Z$I|$JO&R$JO$JT%Z$JT$JU&R$JU$KV%Z$KV$KW&R$KW&FU%Z&FU&FV&R&FV;'S%Z;'S;=`KY<%lO%Z`%^SOy%jz;'S%j;'S;=`%{<%lO%j`%oS!o`Oy%jz;'S%j;'S;=`%{<%lO%j`&OP;=`<%l%j~&Wh$[~OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%j~'yh$[~!o`OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%jj)jS$qYOy%jz;'S%j;'S;=`%{<%lO%j~)yWOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d<%lO)v~*hOw~~*kRO;'S)v;'S;=`*t;=`O)v~*wXOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d;=`<%l)v<%lO)v~+gP;=`<%l)vj+oYmYOy%jz!Q%j!Q![,_![!c%j!c!i,_!i#T%j#T#Z,_#Z;'S%j;'S;=`%{<%lO%jj,dY!o`Oy%jz!Q%j!Q![-S![!c%j!c!i-S!i#T%j#T#Z-S#Z;'S%j;'S;=`%{<%lO%jj-XY!o`Oy%jz!Q%j!Q![-w![!c%j!c!i-w!i#T%j#T#Z-w#Z;'S%j;'S;=`%{<%lO%jj.OYuY!o`Oy%jz!Q%j!Q![.n![!c%j!c!i.n!i#T%j#T#Z.n#Z;'S%j;'S;=`%{<%lO%jj.uYuY!o`Oy%jz!Q%j!Q![/e![!c%j!c!i/e!i#T%j#T#Z/e#Z;'S%j;'S;=`%{<%lO%jj/jY!o`Oy%jz!Q%j!Q![0Y![!c%j!c!i0Y!i#T%j#T#Z0Y#Z;'S%j;'S;=`%{<%lO%jj0aYuY!o`Oy%jz!Q%j!Q![1P![!c%j!c!i1P!i#T%j#T#Z1P#Z;'S%j;'S;=`%{<%lO%jj1UY!o`Oy%jz!Q%j!Q![1t![!c%j!c!i1t!i#T%j#T#Z1t#Z;'S%j;'S;=`%{<%lO%jj1{SuY!o`Oy%jz;'S%j;'S;=`%{<%lO%jd2[UOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jd2uS!yS!o`Oy%jz;'S%j;'S;=`%{<%lO%jb3WS^QOy%jz;'S%j;'S;=`%{<%lO%j~3gWOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{<%lO3d~4SRO;'S3d;'S;=`4];=`O3d~4`XOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{;=`<%l3d<%lO3d~5OP;=`<%l3dj5WShYOy%jz;'S%j;'S;=`%{<%lO%j~5iOg~n5pUWQyWOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jj6ZWyW#PQOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj6xU!o`Oy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%jj7cY!o`$gYOy%jz!Q%j!Q![7[![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj8WY!o`Oy%jz{%j{|8v|}%j}!O8v!O!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj8{U!o`Oy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj9fU!o`$gYOy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj:P[!o`$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj:zS!dYOy%jz;'S%j;'S;=`%{<%lO%jj;]WyWOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj;zU`YOy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%j~<cTyWOy%jz{<r{;'S%j;'S;=`%{<%lO%j~<yS!o`$]~Oy%jz;'S%j;'S;=`%{<%lO%jj=[[$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj>VUcYOy%jz![%j![!]>i!];'S%j;'S;=`%{<%lO%jj>pSdY!o`Oy%jz;'S%j;'S;=`%{<%lO%jj?RSnYOy%jz;'S%j;'S;=`%{<%lO%jh?dU!WWOy%jz!_%j!_!`?v!`;'S%j;'S;=`%{<%lO%jh?}S!WW!o`Oy%jz;'S%j;'S;=`%{<%lO%jl@bS!WW!ySOy%jz;'S%j;'S;=`%{<%lO%jj@uV!|Q!WWOy%jz!_%j!_!`?v!`!aA[!a;'S%j;'S;=`%{<%lO%jbAcS!|Q!o`Oy%jz;'S%j;'S;=`%{<%lO%jjArYOy%jz}%j}!OBb!O!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjBgW!o`Oy%jz!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjCW[lY!o`Oy%jz}%j}!OCP!O!Q%j!Q![CP![!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jhDRS!zWOy%jz;'S%j;'S;=`%{<%lO%jjDdSpYOy%jz;'S%j;'S;=`%{<%lO%jnDuSo^Oy%jz;'S%j;'S;=`%{<%lO%jjEWU!zWOy%jz#a%j#a#bEj#b;'S%j;'S;=`%{<%lO%jbEoU!o`Oy%jz#d%j#d#eFR#e;'S%j;'S;=`%{<%lO%jbFWU!o`Oy%jz#c%j#c#dFj#d;'S%j;'S;=`%{<%lO%jbFoU!o`Oy%jz#f%j#f#gGR#g;'S%j;'S;=`%{<%lO%jbGWU!o`Oy%jz#h%j#h#iGj#i;'S%j;'S;=`%{<%lO%jbGoU!o`Oy%jz#T%j#T#UHR#U;'S%j;'S;=`%{<%lO%jbHWU!o`Oy%jz#b%j#b#cHj#c;'S%j;'S;=`%{<%lO%jbHoU!o`Oy%jz#h%j#h#iIR#i;'S%j;'S;=`%{<%lO%jbIYS$pQ!o`Oy%jz;'S%j;'S;=`%{<%lO%jjIkSsYOy%jz;'S%j;'S;=`%{<%lO%jfI|U$cUOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jjJeSrYOy%jz;'S%j;'S;=`%{<%lO%jfJvU#PQOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%j`K]P;=`<%l%Z",
	tokenizers: [
		Vo,
		Ho,
		zo,
		Bo,
		1,
		2,
		3,
		4,
		new Za("m~RRYZ[z{a~~g~aO$_~~dP!P!Qg~lO$`~~", 28, 152)
	],
	topRules: {
		StyleSheet: [0, 6],
		Styles: [1, 126]
	},
	dynamicPrecedences: { 94: 1 },
	specialized: [
		{
			term: 147,
			get: (e) => Wo[e] || -1
		},
		{
			term: 148,
			get: (e) => Go[e] || -1
		},
		{
			term: 4,
			get: (e) => Ko[e] || -1
		},
		{
			term: 28,
			get: (e) => qo[e] || -1
		},
		{
			term: 146,
			get: (e) => Jo[e] || -1
		}
	],
	tokenPrec: 2405
}), Xo = null;
function Zo() {
	if (!Xo && typeof document == "object" && document.body) {
		let { style: e } = document.body, t = [], n = /* @__PURE__ */ new Set();
		for (let r in e) r != "cssText" && r != "cssFloat" && typeof e[r] == "string" && (/[A-Z]/.test(r) && (r = r.replace(/[A-Z]/g, (e) => "-" + e.toLowerCase())), n.has(r) || (t.push(r), n.add(r)));
		Xo = t.sort().map((e) => ({
			type: "property",
			label: e,
			apply: e + ": "
		}));
	}
	return Xo || [];
}
var Qo = /*@__PURE__*/ (/* @__PURE__ */ "active.after.any-link.autofill.backdrop.before.checked.cue.default.defined.disabled.empty.enabled.file-selector-button.first.first-child.first-letter.first-line.first-of-type.focus.focus-visible.focus-within.fullscreen.has.host.host-context.hover.in-range.indeterminate.invalid.is.lang.last-child.last-of-type.left.link.marker.modal.not.nth-child.nth-last-child.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.part.placeholder.placeholder-shown.read-only.read-write.required.right.root.scope.selection.slotted.target.target-text.valid.visited.where".split(".")).map((e) => ({
	type: "class",
	label: e
})), $o = /*@__PURE__*/ (/* @__PURE__ */ "above.absolute.activeborder.additive.activecaption.after-white-space.ahead.alias.all.all-scroll.alphabetic.alternate.always.antialiased.appworkspace.asterisks.attr.auto.auto-flow.avoid.avoid-column.avoid-page.avoid-region.axis-pan.background.backwards.baseline.below.bidi-override.blink.block.block-axis.bold.bolder.border.border-box.both.bottom.break.break-all.break-word.bullets.button.button-bevel.buttonface.buttonhighlight.buttonshadow.buttontext.calc.capitalize.caps-lock-indicator.caption.captiontext.caret.cell.center.checkbox.circle.cjk-decimal.clear.clip.close-quote.col-resize.collapse.color.color-burn.color-dodge.column.column-reverse.compact.condensed.contain.content.contents.content-box.context-menu.continuous.copy.counter.counters.cover.crop.cross.crosshair.currentcolor.cursive.cyclic.darken.dashed.decimal.decimal-leading-zero.default.default-button.dense.destination-atop.destination-in.destination-out.destination-over.difference.disc.discard.disclosure-closed.disclosure-open.document.dot-dash.dot-dot-dash.dotted.double.down.e-resize.ease.ease-in.ease-in-out.ease-out.element.ellipse.ellipsis.embed.end.ethiopic-abegede-gez.ethiopic-halehame-aa-er.ethiopic-halehame-gez.ew-resize.exclusion.expanded.extends.extra-condensed.extra-expanded.fantasy.fast.fill.fill-box.fixed.flat.flex.flex-end.flex-start.footnotes.forwards.from.geometricPrecision.graytext.grid.groove.hand.hard-light.help.hidden.hide.higher.highlight.highlighttext.horizontal.hsl.hsla.hue.icon.ignore.inactiveborder.inactivecaption.inactivecaptiontext.infinite.infobackground.infotext.inherit.initial.inline.inline-axis.inline-block.inline-flex.inline-grid.inline-table.inset.inside.intrinsic.invert.italic.justify.keep-all.landscape.large.larger.left.level.lighter.lighten.line-through.linear.linear-gradient.lines.list-item.listbox.listitem.local.logical.loud.lower.lower-hexadecimal.lower-latin.lower-norwegian.lowercase.ltr.luminosity.manipulation.match.matrix.matrix3d.medium.menu.menutext.message-box.middle.min-intrinsic.mix.monospace.move.multiple.multiple_mask_images.multiply.n-resize.narrower.ne-resize.nesw-resize.no-close-quote.no-drop.no-open-quote.no-repeat.none.normal.not-allowed.nowrap.ns-resize.numbers.numeric.nw-resize.nwse-resize.oblique.opacity.open-quote.optimizeLegibility.optimizeSpeed.outset.outside.outside-shape.overlay.overline.padding.padding-box.painted.page.paused.perspective.pinch-zoom.plus-darker.plus-lighter.pointer.polygon.portrait.pre.pre-line.pre-wrap.preserve-3d.progress.push-button.radial-gradient.radio.read-only.read-write.read-write-plaintext-only.rectangle.region.relative.repeat.repeating-linear-gradient.repeating-radial-gradient.repeat-x.repeat-y.reset.reverse.rgb.rgba.ridge.right.rotate.rotate3d.rotateX.rotateY.rotateZ.round.row.row-resize.row-reverse.rtl.run-in.running.s-resize.sans-serif.saturation.scale.scale3d.scaleX.scaleY.scaleZ.screen.scroll.scrollbar.scroll-position.se-resize.self-start.self-end.semi-condensed.semi-expanded.separate.serif.show.single.skew.skewX.skewY.skip-white-space.slide.slider-horizontal.slider-vertical.sliderthumb-horizontal.sliderthumb-vertical.slow.small.small-caps.small-caption.smaller.soft-light.solid.source-atop.source-in.source-out.source-over.space.space-around.space-between.space-evenly.spell-out.square.start.static.status-bar.stretch.stroke.stroke-box.sub.subpixel-antialiased.svg_masks.super.sw-resize.symbolic.symbols.system-ui.table.table-caption.table-cell.table-column.table-column-group.table-footer-group.table-header-group.table-row.table-row-group.text.text-bottom.text-top.textarea.textfield.thick.thin.threeddarkshadow.threedface.threedhighlight.threedlightshadow.threedshadow.to.top.transform.translate.translate3d.translateX.translateY.translateZ.transparent.ultra-condensed.ultra-expanded.underline.unidirectional-pan.unset.up.upper-latin.uppercase.url.var.vertical.vertical-text.view-box.visible.visibleFill.visiblePainted.visibleStroke.visual.w-resize.wait.wave.wider.window.windowframe.windowtext.words.wrap.wrap-reverse.x-large.x-small.xor.xx-large.xx-small".split(".")).map((e) => ({
	type: "keyword",
	label: e
})).concat(/*@__PURE__*/ (/* @__PURE__ */ "aliceblue.antiquewhite.aqua.aquamarine.azure.beige.bisque.black.blanchedalmond.blue.blueviolet.brown.burlywood.cadetblue.chartreuse.chocolate.coral.cornflowerblue.cornsilk.crimson.cyan.darkblue.darkcyan.darkgoldenrod.darkgray.darkgreen.darkkhaki.darkmagenta.darkolivegreen.darkorange.darkorchid.darkred.darksalmon.darkseagreen.darkslateblue.darkslategray.darkturquoise.darkviolet.deeppink.deepskyblue.dimgray.dodgerblue.firebrick.floralwhite.forestgreen.fuchsia.gainsboro.ghostwhite.gold.goldenrod.gray.grey.green.greenyellow.honeydew.hotpink.indianred.indigo.ivory.khaki.lavender.lavenderblush.lawngreen.lemonchiffon.lightblue.lightcoral.lightcyan.lightgoldenrodyellow.lightgray.lightgreen.lightpink.lightsalmon.lightseagreen.lightskyblue.lightslategray.lightsteelblue.lightyellow.lime.limegreen.linen.magenta.maroon.mediumaquamarine.mediumblue.mediumorchid.mediumpurple.mediumseagreen.mediumslateblue.mediumspringgreen.mediumturquoise.mediumvioletred.midnightblue.mintcream.mistyrose.moccasin.navajowhite.navy.oldlace.olive.olivedrab.orange.orangered.orchid.palegoldenrod.palegreen.paleturquoise.palevioletred.papayawhip.peachpuff.peru.pink.plum.powderblue.purple.rebeccapurple.red.rosybrown.royalblue.saddlebrown.salmon.sandybrown.seagreen.seashell.sienna.silver.skyblue.slateblue.slategray.snow.springgreen.steelblue.tan.teal.thistle.tomato.turquoise.violet.wheat.white.whitesmoke.yellow.yellowgreen".split(".")).map((e) => ({
	type: "constant",
	label: e
}))), es = /*@__PURE__*/ (/* @__PURE__ */ "a.abbr.address.article.aside.b.bdi.bdo.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.dd.del.details.dfn.dialog.div.dl.dt.em.figcaption.figure.footer.form.header.hgroup.h1.h2.h3.h4.h5.h6.hr.html.i.iframe.img.input.ins.kbd.label.legend.li.main.meter.nav.ol.output.p.pre.ruby.section.select.small.source.span.strong.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.tr.u.ul".split(".")).map((e) => ({
	type: "type",
	label: e
})), ts = /*@__PURE__*/ [
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
})), G = /^(\w[\w-]*|-\w[\w-]*|)$/, ns = /^-(-[\w-]*)?$/;
function rs(e, t) {
	if ((e.name == "(" || e.type.isError) && (e = e.parent || e), e.name != "ArgList") return !1;
	let n = e.parent?.firstChild;
	return n?.name == "Callee" && t.sliceString(n.from, n.to) == "var";
}
var is = /*@__PURE__*/ new ce(), as = ["Declaration"];
function os(e) {
	for (let t = e;;) {
		if (t.type.isTop) return t;
		if (!(t = t.parent)) return e;
	}
}
function ss(e, t, n) {
	if (t.to - t.from > 4096) {
		let r = is.get(t);
		if (r) return r;
		let i = [], a = /* @__PURE__ */ new Set(), o = t.cursor(oe.IncludeAnonymous);
		if (o.firstChild()) do
			for (let t of ss(e, o.node, n)) a.has(t.label) || (a.add(t.label), i.push(t));
		while (o.nextSibling());
		return is.set(t, i), i;
	} else {
		let r = [], i = /* @__PURE__ */ new Set();
		return t.cursor().iterate((t) => {
			if (n(t) && t.matchContext(as) && t.node.nextSibling?.name == ":") {
				let n = e.sliceString(t.from, t.to);
				i.has(n) || (i.add(n), r.push({
					label: n,
					type: "variable"
				}));
			}
		}), r;
	}
}
var cs = /*@__PURE__*/ ((e) => (t) => {
	let { state: n, pos: r } = t, i = y(n).resolveInner(r, -1), a = i.type.isError && i.from == i.to - 1 && n.doc.sliceString(i.from, i.to) == "-";
	if (i.name == "PropertyName" || (a || i.name == "TagName") && /^(Block|Styles)$/.test(i.resolve(i.to).name)) return {
		from: i.from,
		options: Zo(),
		validFor: G
	};
	if (i.name == "ValueName") return {
		from: i.from,
		options: $o,
		validFor: G
	};
	if (i.name == "PseudoClassName") return {
		from: i.from,
		options: Qo,
		validFor: G
	};
	if (e(i) || (t.explicit || a) && rs(i, n.doc)) return {
		from: e(i) || a ? i.from : r,
		options: ss(n.doc, os(i), e),
		validFor: ns
	};
	if (i.name == "TagName") {
		for (let { parent: e } = i; e; e = e.parent) if (e.name == "Block") return {
			from: i.from,
			options: Zo(),
			validFor: G
		};
		return {
			from: i.from,
			options: es,
			validFor: G
		};
	}
	if (i.name == "AtKeyword") return {
		from: i.from,
		options: ts,
		validFor: G
	};
	if (!t.explicit) return null;
	let o = i.resolve(r), s = o.childBefore(r);
	return s && s.name == ":" && o.name == "PseudoClassSelector" ? {
		from: r,
		options: Qo,
		validFor: G
	} : s && s.name == ":" && o.name == "Declaration" || o.name == "ArgList" ? {
		from: r,
		options: $o,
		validFor: G
	} : o.name == "Block" || o.name == "Styles" ? {
		from: r,
		options: Zo(),
		validFor: G
	} : null;
})((e) => e.name == "VariableName"), ls = /*@__PURE__*/ Ue.define({
	name: "css",
	parser: /*@__PURE__*/ Yo.configure({ props: [/*@__PURE__*/ Qe.add({ Declaration: /*@__PURE__*/ O() }), /*@__PURE__*/ x.add({ "Block KeyframeList": De })] }),
	languageData: {
		commentTokens: { block: {
			open: "/*",
			close: "*/"
		} },
		indentOnInput: /^\s*\}$/,
		wordChars: "-"
	}
});
function us() {
	return new E(ls, ls.data.of({ autocomplete: cs }));
}
//#endregion
//#region ../node_modules/.pnpm/@lezer+html@1.3.13/node_modules/@lezer/html/dist/index.js
var ds = 55, fs = 1, ps = 56, ms = 2, hs = 57, gs = 3, _s = 4, vs = 5, ys = 6, bs = 7, xs = 8, Ss = 9, Cs = 10, ws = 11, Ts = 12, Es = 13, Ds = 58, Os = 14, ks = 15, As = 59, js = 21, Ms = 23, Ns = 24, Ps = 25, Fs = 27, Is = 28, Ls = 29, Rs = 32, zs = 35, Bs = 37, Vs = 38, Hs = 0, Us = 1, Ws = {
	area: !0,
	base: !0,
	br: !0,
	col: !0,
	command: !0,
	embed: !0,
	frame: !0,
	hr: !0,
	img: !0,
	input: !0,
	keygen: !0,
	link: !0,
	meta: !0,
	param: !0,
	source: !0,
	track: !0,
	wbr: !0,
	menuitem: !0
}, Gs = {
	dd: !0,
	li: !0,
	optgroup: !0,
	option: !0,
	p: !0,
	rp: !0,
	rt: !0,
	tbody: !0,
	td: !0,
	tfoot: !0,
	th: !0,
	tr: !0
}, Ks = {
	dd: {
		dd: !0,
		dt: !0
	},
	dt: {
		dd: !0,
		dt: !0
	},
	li: { li: !0 },
	option: {
		option: !0,
		optgroup: !0
	},
	optgroup: { optgroup: !0 },
	p: {
		address: !0,
		article: !0,
		aside: !0,
		blockquote: !0,
		dir: !0,
		div: !0,
		dl: !0,
		fieldset: !0,
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
		menu: !0,
		nav: !0,
		ol: !0,
		p: !0,
		pre: !0,
		section: !0,
		table: !0,
		ul: !0
	},
	rp: {
		rp: !0,
		rt: !0
	},
	rt: {
		rp: !0,
		rt: !0
	},
	tbody: {
		tbody: !0,
		tfoot: !0
	},
	td: {
		td: !0,
		th: !0
	},
	tfoot: { tbody: !0 },
	th: {
		td: !0,
		th: !0
	},
	thead: {
		tbody: !0,
		tfoot: !0
	},
	tr: { tr: !0 }
};
function qs(e) {
	return e == 45 || e == 46 || e == 58 || e >= 65 && e <= 90 || e == 95 || e >= 97 && e <= 122 || e >= 161;
}
var Js = null, Ys = null, Xs = 0;
function Zs(e, t) {
	let n = e.pos + t;
	if (Xs == n && Ys == e) return Js;
	let r = e.peek(t), i = "";
	for (; qs(r);) i += String.fromCharCode(r), r = e.peek(++t);
	return Ys = e, Xs = n, Js = i ? i.toLowerCase() : r == tc || r == nc ? void 0 : null;
}
var Qs = 60, $s = 62, ec = 47, tc = 63, nc = 33, rc = 45;
function ic(e, t) {
	this.name = e, this.parent = t;
}
var ac = [
	ys,
	Cs,
	bs,
	xs,
	Ss
], oc = new lo({
	start: null,
	shift(e, t, n, r) {
		return ac.indexOf(t) > -1 ? new ic(Zs(r, 1) || "", e) : e;
	},
	reduce(e, t) {
		return t == js && e ? e.parent : e;
	},
	reuse(e, t, n, r) {
		let i = t.type.id;
		return i == ys || i == Bs ? new ic(Zs(r, 1) || "", e) : e;
	},
	strict: !1
}), sc = new H((e, t) => {
	if (e.next != Qs) {
		e.next < 0 && t.context && e.acceptToken(Ds);
		return;
	}
	e.advance();
	let n = e.next == ec;
	n && e.advance();
	let r = Zs(e, 0);
	if (r === void 0) return;
	if (!r) return e.acceptToken(n ? ks : Os);
	let i = t.context ? t.context.name : null;
	if (n) {
		if (r == i) return e.acceptToken(ws);
		if (i && Gs[i]) return e.acceptToken(Ds, -2);
		if (t.dialectEnabled(Hs)) return e.acceptToken(Ts);
		for (let e = t.context; e; e = e.parent) if (e.name == r) return;
		e.acceptToken(Es);
	} else {
		if (r == "script") return e.acceptToken(bs);
		if (r == "style") return e.acceptToken(xs);
		if (r == "textarea") return e.acceptToken(Ss);
		if (Ws.hasOwnProperty(r)) return e.acceptToken(Cs);
		i && Ks[i] && Ks[i][r] ? e.acceptToken(Ds, -1) : e.acceptToken(ys);
	}
}, { contextual: !0 }), cc = new H((e) => {
	for (let t = 0, n = 0;; n++) {
		if (e.next < 0) {
			n && e.acceptToken(As);
			break;
		}
		if (e.next == rc) t++;
		else if (e.next == $s && t >= 2) {
			n >= 3 && e.acceptToken(As, -2);
			break;
		} else t = 0;
		e.advance();
	}
});
function lc(e) {
	for (; e; e = e.parent) if (e.name == "svg" || e.name == "math") return !0;
	return !1;
}
var uc = new H((e, t) => {
	if (e.next == ec && e.peek(1) == $s) {
		let n = t.dialectEnabled(Us) || lc(t.context);
		e.acceptToken(n ? vs : _s, 2);
	} else e.next == $s && e.acceptToken(_s, 1);
});
function dc(e, t, n) {
	let r = 2 + e.length;
	return new H((i) => {
		for (let a = 0, o = 0, s = 0;; s++) {
			if (i.next < 0) {
				s && i.acceptToken(t);
				break;
			}
			if (a == 0 && i.next == Qs || a == 1 && i.next == ec || a >= 2 && a < r && i.next == e.charCodeAt(a - 2)) a++, o++;
			else if (a == r && i.next == $s) {
				s > o ? i.acceptToken(t, -o) : i.acceptToken(n, -(o - 2));
				break;
			} else if ((i.next == 10 || i.next == 13) && s) {
				i.acceptToken(t, 1);
				break;
			} else a = o = 0;
			i.advance();
		}
	});
}
var fc = dc("script", ds, fs), pc = dc("style", ps, ms), mc = dc("textarea", hs, gs), hc = T({
	"Text RawText IncompleteTag IncompleteCloseTag": v.content,
	"StartTag StartCloseTag SelfClosingEndTag EndTag": v.angleBracket,
	TagName: v.tagName,
	"MismatchedCloseTag/TagName": [v.tagName, v.invalid],
	AttributeName: v.attributeName,
	"AttributeValue UnquotedAttributeValue": v.attributeValue,
	Is: v.definitionOperator,
	"EntityReference CharacterReference": v.character,
	Comment: v.blockComment,
	ProcessingInst: v.processingInstruction,
	DoctypeDecl: v.documentMeta
}), gc = uo.deserialize({
	version: 14,
	states: ",xOVO!rOOO!ZQ#tO'#CrO!`Q#tO'#C{O!eQ#tO'#DOO!jQ#tO'#DRO!oQ#tO'#DTO!tOaO'#CqO#PObO'#CqO#[OdO'#CqO$kO!rO'#CqOOO`'#Cq'#CqO$rO$fO'#DUO$zQ#tO'#DWO%PQ#tO'#DXOOO`'#Dl'#DlOOO`'#DZ'#DZQVO!rOOO%UQ&rO,59^O%aQ&rO,59gO%lQ&rO,59jO%wQ&rO,59mO&SQ&rO,59oOOOa'#D_'#D_O&_OaO'#CyO&jOaO,59]OOOb'#D`'#D`O&rObO'#C|O&}ObO,59]OOOd'#Da'#DaO'VOdO'#DPO'bOdO,59]OOO`'#Db'#DbO'jO!rO,59]O'qQ#tO'#DSOOO`,59],59]OOOp'#Dc'#DcO'vO$fO,59pOOO`,59p,59pO(OQ#|O,59rO(TQ#|O,59sOOO`-E7X-E7XO(YQ&rO'#CtOOQW'#D['#D[O(hQ&rO1G.xOOOa1G.x1G.xOOO`1G/Z1G/ZO(sQ&rO1G/ROOOb1G/R1G/RO)OQ&rO1G/UOOOd1G/U1G/UO)ZQ&rO1G/XOOO`1G/X1G/XO)fQ&rO1G/ZOOOa-E7]-E7]O)qQ#tO'#CzOOO`1G.w1G.wOOOb-E7^-E7^O)vQ#tO'#C}OOOd-E7_-E7_O){Q#tO'#DQOOO`-E7`-E7`O*QQ#|O,59nOOOp-E7a-E7aOOO`1G/[1G/[OOO`1G/^1G/^OOO`1G/_1G/_O*VQ,UO,59`OOQW-E7Y-E7YOOOa7+$d7+$dOOO`7+$u7+$uOOOb7+$m7+$mOOOd7+$p7+$pOOO`7+$s7+$sO*bQ#|O,59fO*gQ#|O,59iO*lQ#|O,59lOOO`1G/Y1G/YO*qO7[O'#CwO+SOMhO'#CwOOQW1G.z1G.zOOO`1G/Q1G/QOOO`1G/T1G/TOOO`1G/W1G/WOOOO'#D]'#D]O+eO7[O,59cOOQW,59c,59cOOOO'#D^'#D^O+vOMhO,59cOOOO-E7Z-E7ZOOQW1G.}1G.}OOOO-E7[-E7[",
	stateData: ",c~O!_OS~OUSOVPOWQOXROYTO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O|_O!eZO~OgaO~OgbO~OgcO~OgdO~OgeO~O!XfOPmP![mP~O!YiOQpP![pP~O!ZlORsP![sP~OUSOVPOWQOXROYTOZqO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O!eZO~O![rO~P#gO!]sO!fuO~OgvO~OgwO~OS|OT}OiyO~OS!POT}OiyO~OS!ROT}OiyO~OS!TOT}OiyO~OS}OT}OiyO~O!XfOPmX![mX~OP!WO![!XO~O!YiOQpX![pX~OQ!ZO![!XO~O!ZlORsX![sX~OR!]O![!XO~O![!XO~P#gOg!_O~O!]sO!f!aO~OS!bO~OS!cO~Oj!dOShXThXihX~OS!fOT!gOiyO~OS!hOT!gOiyO~OS!iOT!gOiyO~OS!jOT!gOiyO~OS!gOT!gOiyO~Og!kO~Og!lO~Og!mO~OS!nO~Ol!qO!a!oO!c!pO~OS!rO~OS!sO~OS!tO~Ob!uOc!uOd!uO!a!wO!b!uO~Ob!xOc!xOd!xO!c!wO!d!xO~Ob!uOc!uOd!uO!a!{O!b!uO~Ob!xOc!xOd!xO!c!{O!d!xO~OT~cbd!ey|!e~",
	goto: "%q!aPPPPPPPPPPPPPPPPPPPPP!b!hP!nPP!zP!}#Q#T#Z#^#a#g#j#m#s#y!bP!b!bP$P$V$m$s$y%P%V%]%cPPPPPPPP%iX^OX`pXUOX`pezabcde{!O!Q!S!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ!ObQ!QcQ!SdQ!UeZ!e{!O!Q!S!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",
	nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
	maxTerm: 68,
	context: oc,
	nodeProps: [
		[
			"closedBy",
			-10,
			1,
			2,
			3,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			"EndTag",
			6,
			"EndTag SelfClosingEndTag",
			-4,
			22,
			31,
			34,
			37,
			"CloseTag"
		],
		[
			"openedBy",
			4,
			"StartTag StartCloseTag",
			5,
			"StartTag",
			-4,
			30,
			33,
			36,
			38,
			"OpenTag"
		],
		[
			"group",
			-10,
			14,
			15,
			18,
			19,
			20,
			21,
			40,
			41,
			42,
			43,
			"Entity",
			17,
			"Entity TextContent",
			-3,
			29,
			32,
			35,
			"TextContent Entity"
		],
		[
			"isolate",
			-11,
			22,
			30,
			31,
			33,
			34,
			36,
			37,
			38,
			39,
			42,
			43,
			"ltr",
			-3,
			27,
			28,
			40,
			""
		]
	],
	propSources: [hc],
	skippedNodes: [0],
	repeatNodeCount: 9,
	tokenData: "!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|caPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bXaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UVaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pTaPOv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!dpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({WaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!b`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!b`!dpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYlWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]`aP!b`!dp!_^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebiSlWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXiSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vciSaP!b`!dpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!ahaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WiiSlWd!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zblWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOb!R!R7tP;=`<%l7S!Z8OYlWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{iiSlWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbiSlWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QciSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXiSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TalWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOc!R!RAwP;=`<%lAY!ZBRYlWc!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbiSlWc!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbiSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXiSc!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!cxaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYliSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_kiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_XaP!b`!dp!fQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZiSgQaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!b`!dpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!b`!dp!ePOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!b`!dpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!b`!dpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!b`!dpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!b`!dpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!b`!dpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!b`!dpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!b`!dpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!dpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO|PP!-nP;=`<%l!-Sq!-xS!dp|POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!b`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!b`|POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!b`!dp|POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!b`!dpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!b`!dpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!b`!dpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!b`!dpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!b`!dpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!b`!dpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!dpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOyPP!7TP;=`<%l!6Vq!7]V!dpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!dpyPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!b`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!b`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!b`yPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!b`!dpyPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXjSaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",
	tokenizers: [
		fc,
		pc,
		mc,
		uc,
		sc,
		cc,
		0,
		1,
		2,
		3,
		4,
		5
	],
	topRules: { Document: [0, 16] },
	dialects: {
		noMatch: 0,
		selfClosing: 515
	},
	tokenPrec: 517
});
function _c(e, t) {
	let n = Object.create(null);
	for (let r of e.getChildren(Ns)) {
		let e = r.getChild(Ps), i = r.getChild(Fs) || r.getChild(Is);
		e && (n[t.read(e.from, e.to)] = i ? i.type.id == Fs ? t.read(i.from + 1, i.to - 1) : t.read(i.from, i.to) : "");
	}
	return n;
}
function vc(e, t) {
	let n = e.getChild(Ms);
	return n ? t.read(n.from, n.to) : " ";
}
function yc(e, t, n) {
	let r;
	for (let i of n) if (!i.attrs || i.attrs(r ||= _c(e.node.parent.firstChild, t))) return {
		parser: i.parser,
		bracketed: !0
	};
	return null;
}
function bc(e = [], t = []) {
	let n = [], r = [], i = [], a = [];
	for (let t of e) (t.tag == "script" ? n : t.tag == "style" ? r : t.tag == "textarea" ? i : a).push(t);
	let o = t.length ? Object.create(null) : null;
	for (let e of t) (o[e.name] || (o[e.name] = [])).push(e);
	return me((e, t) => {
		let s = e.type.id;
		if (s == Ls) return yc(e, t, n);
		if (s == Rs) return yc(e, t, r);
		if (s == zs) return yc(e, t, i);
		if (s == js && a.length) {
			let n = e.node, r = n.firstChild, i = r && vc(r, t), o;
			if (i) {
				for (let e of a) if (e.tag == i && (!e.attrs || e.attrs(o ||= _c(r, t)))) {
					let t = n.lastChild, i = t.type.id == Vs ? t.from : n.to;
					if (i > r.to) return {
						parser: e.parser,
						overlay: [{
							from: r.to,
							to: i
						}]
					};
				}
			}
		}
		if (o && s == Ns) {
			let n = e.node, r;
			if (r = n.firstChild) {
				let e = o[t.read(r.from, r.to)];
				if (e) for (let r of e) {
					if (r.tagName && r.tagName != vc(n.parent, t)) continue;
					let e = n.lastChild;
					if (e.type.id == Fs) {
						let t = e.from + 1, n = e.lastChild, i = e.to - (n && n.isError ? 0 : 1);
						if (i > t) return {
							parser: r.parser,
							overlay: [{
								from: t,
								to: i
							}],
							bracketed: !0
						};
					} else if (e.type.id == Is) return {
						parser: r.parser,
						overlay: [{
							from: e.from,
							to: e.to
						}]
					};
				}
			}
		}
		return null;
	});
}
//#endregion
//#region ../node_modules/.pnpm/@lezer+javascript@1.5.4/node_modules/@lezer/javascript/dist/index.js
var xc = 316, Sc = 317, Cc = 1, wc = 2, Tc = 3, Ec = 4, Dc = 318, Oc = 320, kc = 321, Ac = 5, jc = 6, Mc = 0, Nc = [
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
], Pc = 125, Fc = 59, Ic = 47, Lc = 42, Rc = 43, zc = 45, Bc = 60, Vc = 44, Hc = 63, Uc = 46, Wc = 91, Gc = new lo({
	start: !1,
	shift(e, t) {
		return t == Ac || t == jc || t == Oc ? e : t == kc;
	},
	strict: !1
}), Kc = new H((e, t) => {
	let { next: n } = e;
	(n == Pc || n == -1 || t.context) && e.acceptToken(Dc);
}, {
	contextual: !0,
	fallback: !0
}), qc = new H((e, t) => {
	let { next: n } = e, r;
	Nc.indexOf(n) > -1 || n == Ic && ((r = e.peek(1)) == Ic || r == Lc) || n != Pc && n != Fc && n != -1 && !t.context && e.acceptToken(xc);
}, { contextual: !0 }), Jc = new H((e, t) => {
	e.next == Wc && !t.context && e.acceptToken(Sc);
}, { contextual: !0 }), Yc = new H((e, t) => {
	let { next: n } = e;
	if (n == Rc || n == zc) {
		if (e.advance(), n == e.next) {
			e.advance();
			let n = !t.context && t.canShift(Cc);
			e.acceptToken(n ? Cc : wc);
		}
	} else n == Hc && e.peek(1) == Uc && (e.advance(), e.advance(), (e.next < 48 || e.next > 57) && e.acceptToken(Tc));
}, { contextual: !0 });
function Xc(e, t) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e == 95 || e >= 192 || !t && e >= 48 && e <= 57;
}
var Zc = new H((e, t) => {
	if (e.next != Bc || !t.dialectEnabled(Mc) || (e.advance(), e.next == Ic)) return;
	let n = 0;
	for (; Nc.indexOf(e.next) > -1;) e.advance(), n++;
	if (Xc(e.next, !0)) {
		for (e.advance(), n++; Xc(e.next, !1);) e.advance(), n++;
		for (; Nc.indexOf(e.next) > -1;) e.advance(), n++;
		if (e.next == Vc) return;
		for (let t = 0;; t++) {
			if (t == 7) {
				if (!Xc(e.next, !0)) return;
				break;
			}
			if (e.next != "extends".charCodeAt(t)) break;
			e.advance(), n++;
		}
	}
	e.acceptToken(Ec, -n);
}), Qc = T({
	"get set async static": v.modifier,
	"for while do if else switch try catch finally return throw break continue default case defer": v.controlKeyword,
	"in of await yield void typeof delete instanceof as satisfies": v.operatorKeyword,
	"let var const using function class extends": v.definitionKeyword,
	"import export from": v.moduleKeyword,
	"with debugger new": v.keyword,
	TemplateString: v.special(v.string),
	super: v.atom,
	BooleanLiteral: v.bool,
	this: v.self,
	null: v.null,
	Star: v.modifier,
	VariableName: v.variableName,
	"CallExpression/VariableName TaggedTemplateExpression/VariableName": v.function(v.variableName),
	VariableDefinition: v.definition(v.variableName),
	Label: v.labelName,
	PropertyName: v.propertyName,
	PrivatePropertyName: v.special(v.propertyName),
	"CallExpression/MemberExpression/PropertyName": v.function(v.propertyName),
	"FunctionDeclaration/VariableDefinition": v.function(v.definition(v.variableName)),
	"ClassDeclaration/VariableDefinition": v.definition(v.className),
	"NewExpression/VariableName": v.className,
	PropertyDefinition: v.definition(v.propertyName),
	PrivatePropertyDefinition: v.definition(v.special(v.propertyName)),
	UpdateOp: v.updateOperator,
	"LineComment Hashbang": v.lineComment,
	BlockComment: v.blockComment,
	Number: v.number,
	String: v.string,
	Escape: v.escape,
	ArithOp: v.arithmeticOperator,
	LogicOp: v.logicOperator,
	BitOp: v.bitwiseOperator,
	CompareOp: v.compareOperator,
	RegExp: v.regexp,
	Equals: v.definitionOperator,
	Arrow: v.function(v.punctuation),
	": Spread": v.punctuation,
	"( )": v.paren,
	"[ ]": v.squareBracket,
	"{ }": v.brace,
	"InterpolationStart InterpolationEnd": v.special(v.brace),
	".": v.derefOperator,
	", ;": v.separator,
	"@": v.meta,
	TypeName: v.typeName,
	TypeDefinition: v.definition(v.typeName),
	"type enum interface implements namespace module declare": v.definitionKeyword,
	"abstract global Privacy readonly override": v.modifier,
	"is keyof unique infer asserts": v.operatorKeyword,
	JSXAttributeValue: v.attributeValue,
	JSXText: v.content,
	"JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": v.angleBracket,
	"JSXIdentifier JSXNameSpacedName": v.tagName,
	"JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": v.attributeName,
	"JSXBuiltin/JSXIdentifier": v.standard(v.tagName)
}), $c = {
	__proto__: null,
	export: 20,
	as: 25,
	from: 33,
	default: 36,
	async: 41,
	function: 42,
	in: 52,
	out: 55,
	const: 56,
	extends: 60,
	this: 64,
	true: 72,
	false: 72,
	null: 84,
	void: 88,
	typeof: 92,
	super: 108,
	new: 142,
	delete: 154,
	yield: 163,
	await: 167,
	class: 172,
	public: 235,
	private: 235,
	protected: 235,
	readonly: 237,
	instanceof: 256,
	satisfies: 259,
	import: 292,
	keyof: 349,
	unique: 353,
	infer: 359,
	asserts: 395,
	is: 397,
	abstract: 417,
	implements: 419,
	type: 421,
	let: 424,
	var: 426,
	using: 429,
	interface: 435,
	enum: 439,
	namespace: 445,
	module: 447,
	declare: 451,
	global: 455,
	defer: 471,
	for: 476,
	of: 485,
	while: 488,
	with: 492,
	do: 496,
	if: 500,
	else: 502,
	switch: 506,
	case: 512,
	try: 518,
	catch: 522,
	finally: 526,
	return: 530,
	throw: 534,
	break: 538,
	continue: 542,
	debugger: 546
}, el = {
	__proto__: null,
	async: 129,
	get: 131,
	set: 133,
	declare: 195,
	public: 197,
	private: 197,
	protected: 197,
	static: 199,
	abstract: 201,
	override: 203,
	readonly: 209,
	accessor: 211,
	new: 401
}, tl = {
	__proto__: null,
	"<": 193
}, nl = uo.deserialize({
	version: 14,
	states: "$F|Q%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Il'#IlO1XQ`O'#GsO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JrO6[Q!0MxO'#JsO6uQ`O'#F]O6zQ,UO'#FtOOQ!0Lf'#Ff'#FfO7VO7dO'#FfO9XQMhO'#F|O9`Q`O'#F{OOQ!0Lf'#Js'#JsOOQ!0Lb'#Jr'#JrO9eQ`O'#GwOOQ['#K_'#K_O9pQ`O'#IYO9uQ!0LrO'#IZOOQ['#J`'#J`OOQ['#I_'#I_Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GsO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EyO;hQMhO'#FeO;xQ`O'#GsOOQO'#K`'#K`O;}Q`O'#K`O<]Q`O'#G{O<]Q`O'#G|O<]Q`O'#HOO9kQ`O'#HRO=SQ`O'#HUO>kQ`O'#CeO>{Q`O'#HcO?TQ`O'#HiO?TQ`O'#HkO`QlO'#HmO?TQ`O'#HoO?TQ`O'#HrO?YQ`O'#HxO?_Q!0LsO'#IOO%[QlO'#IQO?jQ!0LsO'#ISO?uQ!0LsO'#IUO9uQ!0LrO'#IWO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FeOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jv'#JvO%[QlO'#JvOOQO'#Jy'#JyOOQO'#Ih'#IhOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#J}'#J}OC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jx'#JxODlQpO'#JyOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CD})CD}OOOO'#I`'#I`OFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ia'#IaOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Ic'#IcOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IdOGyQ`O'#JtOIxQ!fO'#JtO+}QlO'#JtOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KTOKPQ`O'#KSOKPQ`O'#KSOKXQ`O,5;^OK^Q`O'#KROOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KQONtQ`O'#KPO9eQ`O'#KPO! YQ`O'#KPO! bQ`O,5;]O! gQ`O'#KPO!#lQ!fO'#JsOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#Jz'#JzOOQO-E<j-E<jO9kQ`O,5=_O!$rQ`O,5=_O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;dO!(|QpO,5;dO%[QlO,5;dOOQ['#FT'#FTOOQ['#FV'#FVO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eOOQ['#FZ'#FZO!)[QlO,5;tOOQ!0Lf,5;y,5;yOOQ!0Lf,5;z,5;zOOQ!0Lf,5;|,5;|O%[QlO'#IpO!+_Q!0LrO,5<iO%[QlO,5;eO!&zQMhO,5;eO!+|QMhO,5;eO!-nQMhO'#E^O%[QlO,5;wOOQ!0Lf,5;{,5;{O!-uQ,UO'#FjO!.rQ,UO'#KXO!.^Q,UO'#KXO!.yQ,UO'#KXOOQO'#KX'#KXO!/_Q,UO,5<SOOOW,5<`,5<`O!/pQlO'#FvOOOW'#Io'#IoO7VO7dO,5<QO!/wQ,UO'#FxOOQ!0Lf,5<Q,5<QO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<eO!1pQ`O,5<hO!3YQ(CWO'#GXO!3jQ`O'#GYO!3oQ`O'#GYO!5_Q(CWO'#G^O!6dQpO'#GbOOQO'#Gn'#GnO!,TQMhO'#GmOOQO'#Gp'#GpO!,TQMhO'#GoO!7VQ$IUO'#JlOOQ!0Lh'#Jl'#JlO!7aQ`O'#JkO!7oQ`O'#JjO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<eO1SQ`O'#DZO!,TQMhO'#GPO!,TQMhO'#GRO!8gQ`O'#GTO!8lQ`O'#GUO!3oQ`O'#G[O!,TQMhO'#GaO<]Q`O'#JkO!8qQ`O'#EqO!9`Q`O,5<gOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KR'#KRO!:iQ!0LrO'#KaO9uQ!0LrO,5=cO`QlO,5>tOOQ['#Jh'#JhOOQ[,5>u,5>uOOQ[-E<]-E<]O!<hQ!0MxO,5:bO!:]QpO,5:`O!?RQ!0MxO,5:jO%[QlO,5:jO!AiQ!0MxO,5:lOOQO,5@z,5@zO!BYQMhO,5=_O!BhQ!0LrO'#JiO9`Q`O'#JiO!ByQ!0LrO,59ZO!CUQpO,59ZO!C^QMhO,59ZO:dQMhO,59ZO!CiQ`O,5;ZO!CqQ`O'#HbO!DVQ`O'#KdO%[QlO,5;}O!:]QpO,5<PO!D_Q`O,5=zO!DdQ`O,5=zO!DiQ`O,5=zO!DwQ`O,5=zO9uQ!0LrO,5=zO<]Q`O,5=jOOQO'#Cy'#CyO!EOQpO,5=gO!EWQMhO,5=hO!EcQ`O,5=jO!EhQ!bO,5=mO!EpQ`O'#K`O?YQ`O'#HWO9kQ`O'#HYO!EuQ`O'#HYO:dQMhO'#H[O!EzQ`O'#H[OOQ[,5=p,5=pO!FPQ`O'#H]O!FbQ`O'#CoO!FgQ`O,59PO!FqQ`O,59PO!HvQlO,59POOQ[,59P,59PO!IWQ!0LrO,59PO%[QlO,59PO!KcQlO'#HeOOQ['#Hf'#HfOOQ['#Hg'#HgO`QlO,5=}O!KyQ`O,5=}O`QlO,5>TO`QlO,5>VO!LOQ`O,5>XO`QlO,5>ZO!LTQ`O,5>^O!LYQlO,5>dOOQ[,5>j,5>jO%[QlO,5>jO9uQ!0LrO,5>lOOQ[,5>n,5>nO#!dQ`O,5>nOOQ[,5>p,5>pO#!dQ`O,5>pOOQ[,5>r,5>rO##QQpO'#D_O%[QlO'#JvO##sQpO'#JvO##}QpO'#DmO#$`QpO'#DmO#&qQlO'#DmO#&xQ`O'#JuO#'QQ`O,5:WO#'VQ`O'#EtO#'eQ`O'#KUO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CUQpO,5;YO!C^QMhO,5;YO:dQMhO,5;YO#(`Q`O,5@bO#(eQ07dO,5:sOOQO-E<f-E<fO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!ByQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CUQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I^'#I^P#+RO&2DjO,58|POOO,58|,58|OOOO-E<^-E<^OOQ!0Lh1G.p1G.pOOOO-E<_-E<_OOOO,59},59}O#+^Q!bO,59}OOOO-E<a-E<aOOQ!0Lf1G/g1G/gO#+cQ!fO,5?OO+}QlO,5?OOOQO,5?U,5?UO#+mQlO'#IdOOQO-E<b-E<bO#+zQ`O,5@`O#,SQ!fO,5@`O#,ZQ`O,5@nOOQ!0Lf1G/m1G/mO%[QlO,5@oO#,cQ`O'#IjOOQO-E<h-E<hO#,ZQ`O,5@nOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@lO#,wQ!0LrO,5@lO#-YQ!0LrO,5@lO#-aQ`O,5@kO9eQ`O,5@kO#-iQ`O,5@kO#-wQ`O'#ImO#-aQ`O,5@kOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2yO9kQ`O1G2yOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GW'#GWO#0rQ!0MzO'#JlO!$wQlO1G0uO#2}Q!fO'#JwO%[QlO'#JwO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1O1G1OO%[QlO1G1OOOQ!0Lf1G1f1G1fO#3^Q`O1G1OO#5rQ!0MxO1G1PO#5yQ!0MxO1G1PO#8aQ!0MxO1G1PO#8hQ!0MxO1G1PO#;OQ!0MxO1G1PO#=fQ!0MxO1G1PO#=mQ!0MxO1G1PO#=tQ!0MxO1G1PO#@[Q!0MxO1G1PO#@cQ!0MxO1G1PO#BpQ?MtO'#CiO#DkQ?MtO1G1`O#DrQ?MtO'#JsO#EVQ!0MxO,5?[OOQ!0Lb-E<n-E<nO#GdQ!0MxO1G1PO#HaQ!0MzO1G1POOQ!0Lf1G1P1G1PO#IdQMjO'#J|O#InQ`O,5:xO#IsQ!0MxO1G1cO#JgQ,UO,5<WO#JoQ,UO,5<XO#JwQ,UO'#FoO#K`Q`O'#FnOOQO'#KY'#KYOOQO'#In'#InO#KeQ,UO1G1nOOQ!0Lf1G1n1G1nOOOW1G1y1G1yO#KvQ?MtO'#JrO#LQQ`O,5<bO!)[QlO,5<bOOOW-E<m-E<mOOQ!0Lf1G1l1G1lO#LVQpO'#KXOOQ!0Lf,5<d,5<dO#L_QpO,5<dO#LdQMhO'#DTOOOO'#Ib'#IbO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2PO!8lQ`O'#IrO#LvQ`O,5<zOOQ!0Lh,5<w,5<wO!,TQMhO'#IuO#MdQMjO,5=XO!,TQMhO'#IwO#NVQMjO,5=ZO!&zQMhO,5=]OOQO1G2S1G2SO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GbO$!dQ!dO,5<sO$!kQ`O'#K[O9eQ`O'#K[O$!yQ`O,5<uO$#aQ!dO'#C{O!,TQMhO,5<tO$#kQ`O'#GZO$$PQ`O,5<tO$$UQ!dO'#GWO$$cQ!dO'#K]O$$mQ`O'#K]O!&zQMhO'#K]O$$rQ`O,5<xO$$wQlO'#JvO$%RQpO'#GcO#$`QpO'#GcO$%dQ`O'#GgO!3oQ`O'#GkO$%iQ!0LrO'#ItO$%tQpO,5<|OOQ!0Lp,5<|,5<|O$%{QpO'#GcO$&YQpO'#GdO$&kQpO'#GdO$&pQMjO,5=XO$'QQMjO,5=ZOOQ!0Lh,5=^,5=^O!,TQMhO,5@VO!,TQMhO,5@VO$'bQ`O'#IyO$'vQ`O,5@UO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@VO$)TQ$IYO,59uOOQ!0Lh'#Jp'#JpO$)vQMjO,5<kO$*iQMjO,5<mO@zQ`O,5<oOOQ!0Lh,5<p,5<pO$*sQ`O,5<vO$*xQMjO,5<{O$+YQ`O'#KPO!$wQlO1G2RO$+_Q`O1G2RO9eQ`O'#KSO9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I{O$+dQ!0LrO,5@{OOQ[1G2}1G2}OOQ[1G4`1G4`OOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-fQ!0MxO1G0UOOQ[1G2y1G2yO!&zQMhO1G2yO%[QlO1G2yO#.tQ`O1G2yO$/jQMhO'#EkOOQ!0Lb,5@T,5@TO$/wQ!0LrO,5@TOOQ[1G.u1G.uO!ByQ!0LrO1G.uO!CUQpO1G.uO!C^QMhO1G.uO$0YQ`O1G0uO$0_Q`O'#CiO$0jQ`O'#KeO$0rQ`O,5=|O$0wQ`O'#KeO$0|Q`O'#KeO$1[Q`O'#JRO$1jQ`O,5AOO$1rQ!fO1G1iOOQ!0Lf1G1k1G1kO9kQ`O1G3fO@zQ`O1G3fO$1yQ`O1G3fO$2OQ`O1G3fO!DiQ`O1G3fO9uQ!0LrO1G3fOOQ[1G3f1G3fO!EcQ`O1G3UO!&zQMhO1G3RO$2TQ`O1G3ROOQ[1G3S1G3SO!&zQMhO1G3SO$2YQ`O1G3SO$2bQpO'#HQOOQ[1G3U1G3UO!6_QpO'#I}O!EhQ!bO1G3XOOQ[1G3X1G3XOOQ[,5=r,5=rO$2jQMhO,5=tO9kQ`O,5=tO$%dQ`O,5=vO9`Q`O,5=vO!CUQpO,5=vO!C^QMhO,5=vO:dQMhO,5=vO$2xQ`O'#KcO$3TQ`O,5=wOOQ[1G.k1G.kO$3YQ!0LrO1G.kO@zQ`O1G.kO$3eQ`O1G.kO9uQ!0LrO1G.kO$5mQ!fO,5AQO$5zQ`O,5AQO9eQ`O,5AQO$6VQlO,5>PO$6^Q`O,5>POOQ[1G3i1G3iO`QlO1G3iOOQ[1G3o1G3oOOQ[1G3q1G3qO?TQ`O1G3sO$6cQlO1G3uO$:gQlO'#HtOOQ[1G3x1G3xO$:tQ`O'#HzO?YQ`O'#H|OOQ[1G4O1G4OO$:|QlO1G4OO9uQ!0LrO1G4UOOQ[1G4W1G4WOOQ!0Lb'#G_'#G_O9uQ!0LrO1G4YO9uQ!0LrO1G4[O$?TQ`O,5@bO!)[QlO,5;`O9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CUQpO,5:XO$?YQ?MtO,5:XOOQO,5;`,5;`O$?dQpO'#IeO$?zQ`O,5@aOOQ!0Lf1G/r1G/rO$@SQpO'#IkO$@^Q`O,5@pOOQ!0Lb1G0y1G0yO#$`QpO,5:XOOQO'#Ig'#IgO$@fQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CUQpO1G0tO!C^QMhO1G0tOOQ!0Lb1G5|1G5|O!ByQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@mQ!0LrO1G0mO$@xQ!0LrO1G0mO!CUQpO1G0^ODWQpO1G0^O$AWQ!0LrO1G0mOOQO1G0^1G0^O$AlQ!0MxO1G0mPOOO-E<[-E<[POOO1G.h1G.hOOOO1G/i1G/iO$AvQ!bO,5<iO$BOQ!fO1G4jOOQO1G4p1G4pO%[QlO,5?OO$BYQ`O1G5zO$BbQ`O1G6YO$BjQ!fO1G6ZO9eQ`O,5?UO$BtQ!0MxO1G6WO%[QlO1G6WO$CUQ!0LrO1G6WO$CgQ`O1G6VO$CgQ`O1G6VO9eQ`O1G6VO$CoQ`O,5?XO9eQ`O,5?XOOQO,5?X,5?XO$DTQ`O,5?XO$+YQ`O,5?XOOQO-E<k-E<kOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(e7+(eO!&zQMhO7+(eO%[QlO7+(eO$DcQ`O7+(eO$DnQMhO7+(eO$D|Q!0MzO,5=XO$GXQ!0MzO,5=ZO$IdQ!0MzO,5=XO$KuQ!0MzO,5=ZO$NWQ!0MzO,59uO%!]Q!0MzO,5<kO%$hQ!0MzO,5<mO%&sQ!0MzO,5<{OOQ!0Lf7+&a7+&aO%)UQ!0MxO7+&aO%)xQlO'#IfO%*VQ`O,5@cO%*_Q!fO,5@cOOQ!0Lf1G0P1G0PO%*iQ`O7+&jOOQ!0Lf7+&j7+&jO%*nQ?MtO,5:fO%[QlO7+&zO%*xQ?MtO,5:bO%+VQ?MtO,5:jO%+aQ?MtO,5:lO%+kQMhO'#IiO%+uQ`O,5@hOOQ!0Lh1G0d1G0dOOQO1G1r1G1rOOQO1G1s1G1sO%+}Q!jO,5<ZO!)[QlO,5<YOOQO-E<l-E<lOOQ!0Lf7+'Y7+'YOOOW7+'e7+'eOOOW1G1|1G1|O%,YQ`O1G1|OOQ!0Lf1G2O1G2OOOOO,59o,59oO%,_Q!dO,59oOOOO-E<`-E<`OOQ!0Lh1G/X1G/XO%,fQ!0MxO7+'kOOQ!0Lh,5?^,5?^O%-YQMhO1G2fP%-aQ`O'#IrPOQ!0Lh-E<p-E<pO%-}QMjO,5?aOOQ!0Lh-E<s-E<sO%.pQMjO,5?cOOQ!0Lh-E<u-E<uO%.zQ!dO1G2wO%/RQ!dO'#CrO%/iQMhO'#KSO$$wQlO'#JvOOQ!0Lh1G2_1G2_O%/sQ`O'#IqO%0[Q`O,5@vO%0[Q`O,5@vO%0dQ`O,5@vO%0oQ`O,5@vOOQO1G2a1G2aO%0}QMjO1G2`O$+YQ`O'#K[O!,TQMhO1G2`O%1_Q(CWO'#IsO%1lQ`O,5@wO!&zQMhO,5@wO%1tQ!dO,5@wOOQ!0Lh1G2d1G2dO%4UQ!fO'#CiO%4`Q`O,5=POOQ!0Lb,5<},5<}O%4hQpO,5<}OOQ!0Lb,5=O,5=OOCwQ`O,5<}O%4sQpO,5<}OOQ!0Lb,5=R,5=RO$+YQ`O,5=VOOQO,5?`,5?`OOQO-E<r-E<rOOQ!0Lp1G2h1G2hO#$`QpO,5<}O$$wQlO,5=PO%5RQ`O,5=OO%5^QpO,5=OO!,TQMhO'#IuO%6WQMjO1G2sO!,TQMhO'#IwO%6yQMjO1G2uO%7TQMjO1G5qO%7_QMjO1G5qOOQO,5?e,5?eOOQO-E<w-E<wOOQO1G.{1G.{O!,TQMhO1G5qO!,TQMhO1G5qO!:]QpO,59wO%[QlO,59wOOQ!0Lh,5<j,5<jO%7lQ`O1G2ZO!,TQMhO1G2bO%7qQ!0MxO7+'mOOQ!0Lf7+'m7+'mO!$wQlO7+'mO%8eQ`O,5;`OOQ!0Lb,5?g,5?gOOQ!0Lb-E<y-E<yO%8jQ!dO'#K^O#(ZQ`O7+(eO4UQ!fO7+(eO$DfQ`O7+(eO%8tQ!0MvO'#CiO%9XQ!0MvO,5=SO%9lQ`O,5=SO%9tQ`O,5=SOOQ!0Lb1G5o1G5oOOQ[7+$a7+$aO!ByQ!0LrO7+$aO!CUQpO7+$aO!$wQlO7+&aO%9yQ`O'#JQO%:bQ`O,5APOOQO1G3h1G3hO9kQ`O,5APO%:bQ`O,5APO%:jQ`O,5APOOQO,5?m,5?mOOQO-E=P-E=POOQ!0Lf7+'T7+'TO%:oQ`O7+)QO9uQ!0LrO7+)QO9kQ`O7+)QO@zQ`O7+)QO%:tQ`O7+)QOOQ[7+)Q7+)QOOQ[7+(p7+(pO%:yQ!0MvO7+(mO!&zQMhO7+(mO!E^Q`O7+(nOOQ[7+(n7+(nO!&zQMhO7+(nO%;TQ`O'#KbO%;`Q`O,5=lOOQO,5?i,5?iOOQO-E<{-E<{OOQ[7+(s7+(sO%<rQpO'#HZOOQ[1G3`1G3`O!&zQMhO1G3`O%[QlO1G3`O%<yQ`O1G3`O%=UQMhO1G3`O9uQ!0LrO1G3bO$%dQ`O1G3bO9`Q`O1G3bO!CUQpO1G3bO!C^QMhO1G3bO%=dQ`O'#JPO%=xQ`O,5@}O%>QQpO,5@}OOQ!0Lb1G3c1G3cOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>]Q`O7+$VO%[QlO1G6lO%[QlO1G6mO%>bQ!0LrO1G6lO%>lQlO1G3kO%>sQ`O1G3kO%>xQlO1G3kOOQ[7+)T7+)TO9uQ!0LrO7+)_O`QlO7+)aOOQ['#Kh'#KhOOQ['#JS'#JSO%?PQlO,5>`OOQ[,5>`,5>`O%[QlO'#HuO%?^Q`O'#HwOOQ[,5>f,5>fO9eQ`O,5>fOOQ[,5>h,5>hOOQ[7+)j7+)jOOQ[7+)p7+)pOOQ[7+)t7+)tOOQ[7+)v7+)vO%?cQpO1G5|O%?}Q?MtO1G0zO%@XQ`O1G0zOOQO1G/s1G/sO%@dQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?P,5?POOQO-E<c-E<cOOQO,5?V,5?VOOQO-E<i-E<iO!CUQpO1G/sOOQO-E<e-E<eOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CUQpO7+&`OOQO7+%x7+%xO$AlQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@nQ!0LrO7+&XO!ByQ!0LrO7+%xO!CUQpO7+%xO%@yQ!0LrO7+&XO%AXQ!0MxO7++rO%[QlO7++rO%AiQ`O7++qO%AiQ`O7++qOOQO1G4s1G4sO9eQ`O1G4sO%AqQ`O1G4sOOQS7+%}7+%}O#(ZQ`O<<LPO4UQ!fO<<LPO%BPQ`O<<LPOOQ[<<LP<<LPO!&zQMhO<<LPO%[QlO<<LPO%BXQ`O<<LPO%BdQ!0MzO,5?aO%DoQ!0MzO,5?cO%FzQ!0MzO1G2`O%I]Q!0MzO1G2sO%KhQ!0MzO1G2uO%MsQ!fO,5?QO%[QlO,5?QOOQO-E<d-E<dO%M}Q`O1G5}OOQ!0Lf<<JU<<JUO%NVQ?MtO1G0uO&!^Q?MtO1G1PO&!eQ?MtO1G1PO&$fQ?MtO1G1PO&$mQ?MtO1G1PO&&nQ?MtO1G1PO&(oQ?MtO1G1PO&(vQ?MtO1G1PO&(}Q?MtO1G1PO&+OQ?MtO1G1PO&+VQ?MtO1G1PO&+^Q!0MxO<<JfO&-UQ?MtO1G1PO&.RQ?MvO1G1PO&/UQ?MvO'#JlO&1[Q?MtO1G1cO&1iQ?MtO1G0UO&1sQMjO,5?TOOQO-E<g-E<gO!)[QlO'#FqOOQO'#KZ'#KZOOQO1G1u1G1uO&1}Q`O1G1tO&2SQ?MtO,5?[OOOW7+'h7+'hOOOO1G/Z1G/ZO&2^Q!dO1G4xOOQ!0Lh7+(Q7+(QP!&zQMhO,5?^O!,TQMhO7+(cO&2eQ`O,5?]O9eQ`O,5?]O$+YQ`O,5?]OOQO-E<o-E<oO&2sQ`O1G6bO&2sQ`O1G6bO&2{Q`O1G6bO&3WQMjO7+'zO&3hQ!dO,5?_O&3rQ`O,5?_O!&zQMhO,5?_OOQO-E<q-E<qO&3wQ!dO1G6cO&4RQ`O1G6cO&4ZQ`O1G2kO!&zQMhO1G2kOOQ!0Lb1G2i1G2iOOQ!0Lb1G2j1G2jO%4hQpO1G2iO!CUQpO1G2iOCwQ`O1G2iOOQ!0Lb1G2q1G2qO&4`QpO1G2iO&4nQ`O1G2kO$+YQ`O1G2jOCwQ`O1G2jO$$wQlO1G2kO&4vQ`O1G2jO&5jQMjO,5?aOOQ!0Lh-E<t-E<tO&6]QMjO,5?cOOQ!0Lh-E<v-E<vO!,TQMhO7++]O&6gQMjO7++]O&6qQMjO7++]OOQ!0Lh1G/c1G/cO&7OQ`O1G/cOOQ!0Lh7+'u7+'uO&7TQMjO7+'|O&7eQ!0MxO<<KXOOQ!0Lf<<KX<<KXO&8XQ`O1G0zO!&zQMhO'#IzO&8^Q`O,5@xO&:`Q!fO<<LPO!&zQMhO1G2nO&:gQ!0LrO1G2nOOQ[<<G{<<G{O!ByQ!0LrO<<G{O&:xQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?l,5?lO&;lQ`O,5?lO&;qQ`O,5?lOOQO-E=O-E=OO&<PQ`O1G6kO&<PQ`O1G6kO9kQ`O1G6kO@zQ`O<<LlOOQ[<<Ll<<LlO&<XQ`O<<LlO9uQ!0LrO<<LlO9kQ`O<<LlOOQ[<<LX<<LXO%:yQ!0MvO<<LXOOQ[<<LY<<LYO!E^Q`O<<LYO&<^QpO'#I|O&<iQ`O,5@|O!)[QlO,5@|OOQ[1G3W1G3WOOQO'#JO'#JOO9uQ!0LrO'#JOO&<qQpO,5=uOOQ[,5=u,5=uO&<xQpO'#EgO&=PQpO'#GeO&=UQ`O7+(zO&=ZQ`O7+(zOOQ[7+(z7+(zO!&zQMhO7+(zO%[QlO7+(zO&=cQ`O7+(zOOQ[7+(|7+(|O9uQ!0LrO7+(|O$%dQ`O7+(|O9`Q`O7+(|O!CUQpO7+(|O&=nQ`O,5?kOOQO-E<}-E<}OOQO'#H^'#H^O&=yQ`O1G6iO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>RQ`O7+,WO&>WQ`O7+,XO%[QlO7+,WO%[QlO7+,XOOQ[7+)V7+)VO&>]Q`O7+)VO&>bQlO7+)VO&>iQ`O7+)VOOQ[<<Ly<<LyOOQ[<<L{<<L{OOQ[-E=Q-E=QOOQ[1G3z1G3zO&>nQ`O,5>aOOQ[,5>c,5>cO&>sQ`O1G4QO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&>xQ?MtO1G6ZO?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AlQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!ByQ!0LrO<<IdO&?SQ!0LrO<<IsO&?_Q!0MxO<= ^O&?oQ`O<= ]OOQO7+*_7+*_O9eQ`O7+*_OOQ[ANAkANAkO&?wQ!fOANAkO!&zQMhOANAkO#(ZQ`OANAkO4UQ!fOANAkO&@OQ`OANAkO%[QlOANAkO&@WQ!0MzO7+'zO&BiQ!0MzO,5?aO&DtQ!0MzO,5?cO&GPQ!0MzO7+'|O&IbQ!fO1G4lO&IlQ?MtO7+&aO&KpQ?MvO,5=XO&MwQ?MvO,5=ZO&NXQ?MvO,5=XO&NiQ?MvO,5=ZO&NyQ?MvO,59uO'#PQ?MvO,5<kO'%SQ?MvO,5<mO''hQ?MvO,5<{O')^Q?MtO7+'kO')kQ?MtO7+'mO')xQ`O,5<]OOQO7+'`7+'`OOQ!0Lh7+*d7+*dO')}QMjO<<K}OOQO1G4w1G4wO'*UQ`O1G4wO'*aQ`O1G4wO'*oQ`O7++|O'*oQ`O7++|O!&zQMhO1G4yO'*wQ!dO1G4yO'+RQ`O7++}O'+ZQ`O7+(VO'+fQ!dO7+(VOOQ!0Lb7+(T7+(TOOQ!0Lb7+(U7+(UO!CUQpO7+(TOCwQ`O7+(TO'+pQ`O7+(VO!&zQMhO7+(VO$+YQ`O7+(UO'+uQ`O7+(VOCwQ`O7+(UO'+}QMjO<<NwO!,TQMhO<<NwOOQ!0Lh7+$}7+$}O',XQ!dO,5?fOOQO-E<x-E<xO',cQ!0MvO7+(YO!&zQMhO7+(YOOQ[AN=gAN=gO9kQ`O1G5WOOQO1G5W1G5WO',sQ`O1G5WO',xQ`O7+,VO',xQ`O7+,VO9uQ!0LrOANBWO@zQ`OANBWOOQ[ANBWANBWO'-QQ`OANBWOOQ[ANAsANAsOOQ[ANAtANAtO'-VQ`O,5?hOOQO-E<z-E<zO'-bQ?MtO1G6hOOQO,5?j,5?jOOQO-E<|-E<|OOQ[1G3a1G3aO'-lQ`O,5=POOQ[<<Lf<<LfO!&zQMhO<<LfO&=UQ`O<<LfO'-qQ`O<<LfO%[QlO<<LfOOQ[<<Lh<<LhO9uQ!0LrO<<LhO$%dQ`O<<LhO9`Q`O<<LhO'-yQpO1G5VO'.UQ`O7+,TOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= r<= rOOQ[<= s<= sO'.^Q`O<= rO'.cQ`O<= sOOQ[<<Lq<<LqO'.hQ`O<<LqO'.mQlO<<LqOOQ[1G3{1G3{O?YQ`O7+)lO'.tQ`O<<JQO'/PQ?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AlQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<My<<MyOOQ[G27VG27VO!&zQMhOG27VO#(ZQ`OG27VO'/ZQ!fOG27VO4UQ!fOG27VO'/bQ`OG27VO'/jQ?MtO<<JfO'/wQ?MvO1G2`O'1mQ?MvO,5?aO'3pQ?MvO,5?cO'5sQ?MvO1G2sO'7vQ?MvO1G2uO'9yQ?MtO<<KXO':WQ?MtO<<I{OOQO1G1w1G1wO!,TQMhOANAiOOQO7+*c7+*cO':eQ`O7+*cO':pQ`O<= hO':xQ!dO7+*eOOQ!0Lb<<Kq<<KqO$+YQ`O<<KqOCwQ`O<<KqO';SQ`O<<KqO!&zQMhO<<KqOOQ!0Lb<<Ko<<KoO!CUQpO<<KoO';_Q!dO<<KqOOQ!0Lb<<Kp<<KpO';iQ`O<<KqO!&zQMhO<<KqO$+YQ`O<<KpO';nQMjOANDcO';xQ!0MvO<<KtOOQO7+*r7+*rO9kQ`O7+*rO'<YQ`O<= qOOQ[G27rG27rO9uQ!0LrOG27rO@zQ`OG27rO!)[QlO1G5SO'<bQ`O7+,SO'<jQ`O1G2kO&=UQ`OANBQOOQ[ANBQANBQO!&zQMhOANBQO'<oQ`OANBQOOQ[ANBSANBSO9uQ!0LrOANBSO$%dQ`OANBSOOQO'#H_'#H_OOQO7+*q7+*qOOQ[G22wG22wOOQ[ANE^ANE^OOQ[ANE_ANE_OOQ[ANB]ANB]O'<wQ`OANB]OOQ[<<MW<<MWO!)[QlOAN?lOOQOG24yG24yO$AlQ!0MxOG24yO#(ZQ`OLD,qOOQ[LD,qLD,qO!&zQMhOLD,qO'<|Q!fOLD,qO'=TQ?MvO7+'zO'>yQ?MvO,5?aO'@|Q?MvO,5?cO'CPQ?MvO7+'|O'DuQMjOG27TOOQO<<M}<<M}OOQ!0LbANA]ANA]O$+YQ`OANA]OCwQ`OANA]O'EVQ!dOANA]OOQ!0LbANAZANAZO'E^Q`OANA]O!&zQMhOANA]O'EiQ!dOANA]OOQ!0LbANA[ANA[OOQO<<N^<<N^OOQ[LD-^LD-^O9uQ!0LrOLD-^O'EsQ?MtO7+*nOOQO'#Gf'#GfOOQ[G27lG27lO&=UQ`OG27lO!&zQMhOG27lOOQ[G27nG27nO9uQ!0LrOG27nOOQ[G27wG27wO'E}Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!]!$(!]O#(ZQ`O!$(!]O!&zQMhO!$(!]O'FXQ!0MzOG27TOOQ!0LbG26wG26wO$+YQ`OG26wO'HjQ`OG26wOCwQ`OG26wO'HuQ!dOG26wO!&zQMhOG26wOOQ[!$(!x!$(!xOOQ[LD-WLD-WO&=UQ`OLD-WOOQ[LD-YLD-YOOQ[!)9Ew!)9EwO#(ZQ`O!)9EwOOQ!0LbLD,cLD,cO$+YQ`OLD,cOCwQ`OLD,cO'H|Q`OLD,cO'IXQ!dOLD,cOOQ[!$(!r!$(!rOOQ[!.K;c!.K;cO'I`Q?MvOG27TOOQ!0Lb!$( }!$( }O$+YQ`O!$( }OCwQ`O!$( }O'KUQ`O!$( }OOQ!0Lb!)9Ei!)9EiO$+YQ`O!)9EiOCwQ`O!)9EiOOQ!0Lb!.K;T!.K;TO$+YQ`O!.K;TOOQ!0Lb!4/0o!4/0oO!)[QlO'#DzO1PQ`O'#EXO'KaQ!fO'#JrO'KhQ!L^O'#DvO'KoQlO'#EOO'KvQ!fO'#CiO'N^Q!fO'#CiO!)[QlO'#EQO'NnQlO,5;ZO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO'#IpO(!qQ`O,5<iO!)[QlO,5;eO(!yQMhO,5;eO($dQMhO,5;eO!)[QlO,5;wO!&zQMhO'#GmO(!yQMhO'#GmO!&zQMhO'#GoO(!yQMhO'#GoO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GPO(!yQMhO'#GPO!&zQMhO'#GRO(!yQMhO'#GRO!&zQMhO'#GaO(!yQMhO'#GaO!)[QlO,5:jO($kQpO'#D_O($uQpO'#JvO!)[QlO,5@oO'NnQlO1G0uO(%PQ?MtO'#CiO!)[QlO1G2PO!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO(%ZQ!dO'#CrO!&zQMhO,5<tO(!yQMhO,5<tO'NnQlO1G2RO!)[QlO7+&zO!&zQMhO1G2`O(!yQMhO1G2`O!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO!&zQMhO1G2bO(!yQMhO1G2bO'NnQlO7+'mO'NnQlO7+&aO!&zQMhOANAiO(!yQMhOANAiO(%nQ`O'#EoO(%sQ`O'#EoO(%{Q`O'#F]O(&QQ`O'#EyO(&VQ`O'#KTO(&bQ`O'#KRO(&mQ`O,5;ZO(&rQMjO,5<eO(&yQ`O'#GYO('OQ`O'#GYO('TQ`O,5<eO(']Q`O,5<gO('eQ`O,5;ZO('mQ?MtO1G1`O('tQ`O,5<tO('yQ`O,5<tO((OQ`O,5<vO((TQ`O,5<vO((YQ`O1G2RO((_Q`O1G0uO((dQMjO<<K}O((kQMjO<<K}O((rQMhO'#F|O9`Q`O'#F{OAuQ`O'#EnO!)[QlO,5;tO!3oQ`O'#GYO!3oQ`O'#GYO!3oQ`O'#G[O!3oQ`O'#G[O!,TQMhO7+(cO!,TQMhO7+(cO%.zQ!dO1G2wO%.zQ!dO1G2wO!&zQMhO,5=]O!&zQMhO,5=]",
	stateData: "()x~O'|OS'}OSTOS(ORQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$W|O$niO%h}O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO&W!WO&^!XO&`!YO&b!ZO&d![O&g!]O&m!^O&s!_O&u!`O&w!aO&y!bO&{!cO(TSO(VTO(YUO(aVO(o[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O(O!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X'z]X(a]X(r]X(y]X(z]X~O!g%RX~P(qO_!}O(V#PO(W!}O(X#PO~O_#QO(X#PO(Y#PO(Z#QO~Ox#SO!U#TO(b#TO(c#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T<ZO(VTO(YUO(aVO(o[O~O![#ZO!]#WO!Y(hP!Y(vP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(VTO(YUO(aVO(o[O~Op#mO![#iO!|]O#i#lO#j#iO(T<[O!k(sP~P.iO!l#oO(T#nO~O!x#sO!|]O%h#tO~O#k#uO~O!g#vO#k#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa(fX'z(fX'w(fX!k(fX!Y(fX!_(fX%i(fX!g(fX~P1qO#S$dO#`$eO$Q$eOP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX!_(gX%i(gX~Oa(gX'z(gX'w(gX!Y(gX!k(gXv(gX!g(gX~P4UO#`$eO~O$]$hO$_$gO$f$mO~OSfO!_$nO$i$oO$k$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T$sO(VTO(YUO(a$uO(y$}O(z%POg(^P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(T%gO~O!g%mO~Oa%nO'z%nO~O!Q%rO~P%[O(U!lO~P%[O%n%vO~P%[Oh%VO!l%eO(T%gO(U!lO~Oe%}O!l%eO(T%gO~Oj$RO~O!_&PO(T%gO(U!lO(VTO(YUO`)WP~O!Q&SO!l&RO%j&VO&T&WO~P;SO!x#sO~O%s&YO!S)SX!_)SX(T)SX~O(T&ZO~Ol!PO!u&`O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO~Od&eOe&dO!x&bO%h&cO%{&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%h}O%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO~Ob&kO#`&nO%j&iO(U!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'x&{O'z%nO~Oa%nO'x'OO'z%nO~Oa%nO'x'QO'z%nO~O'w]X!Y]Xv]X!k]X&[]X!_]X%i]X!g]X~P(qO!b'_O!c'WO!d'WO(U!lO(VTO(YUO~Os'UO!S'TO!['XO(e'SO!^(iP!^(xP~P@nOn'bO!_'`O(T%gO~Oe'gO!l%eO(T%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<VO#T!pO#U!pO#W!pO#X!pO(U!lO(VTO(YUO(e!mO(o!sO~O!b'mO!c'lO!d'lO#V!pO#['nO#]'nO~PBYOa%nOh%VO!g#vO!l%eO'z%nO(r'pO~O!p'tO#`'rO~PChOs!nO!S!oO(VTO(YUO(e!mO(o!sO~O!_XOs(mX!S(mX!b(mX!c(mX!d(mX!|(mX#T(mX#U(mX#V(mX#W(mX#X(mX#[(mX#](mX(U(mX(V(mX(Y(mX(e(mX(o(mX~O!c'lO!d'lO(U!lO~PDWO(P'xO(Q'xO(R'zO~O_!}O(V'|O(W!}O(X'|O~O_#QO(X'|O(Y'|O(Z#QO~Ov(OO~P%[Ox#SO!U#TO(b#TO(c(RO~O![(TO!Y'WX!Y'^X!]'WX!]'^X~P+}O!](VO!Y(hX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](VO!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~O!Y(hX~PHRO!Y([O~O!Y(uX!](uX!g(uX!k(uX(r(uX~O#`(uX#k#dX!^(uX~PJUO#`(]O!Y(wX!](wX~O!](^O!Y(vX~O!Y(aO~O#`$eO~PJUO!^(bO~P`OR#zO!Q#yO!S#{O!l#xO(aVOP!na[!naj!nar!na!]!na!p!na#R!na#n!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#x!na#z!na#{!na(r!na(y!na(z!na~Oa!na'z!na'w!na!Y!na!k!nav!na!_!na%i!na!g!na~PKlO!k(cO~O!g#vO#`(dO(r'pO!](tXa(tX'z(tX~O!k(tX~PNXO!S%hO!_%iO!|]O#i(iO#j(hO(T%gO~O!](jO!k(sX~O!k(lO~O!S%hO!_%iO#j(hO(T%gO~OP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~O!g#vO!k(gX~P! uOR(nO!Q(mO!l#xO#S$dO!|!{a!S!{a~O!x!{a%h!{a!_!{a#i!{a#j!{a(T!{a~P!#vO!x(rO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~O#k(xO~O![(zO!k(kP~P%[O(e(|O(o[O~O!S)OO!l#xO(e(|O(o[O~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]$_Oa$qa'z$qa'w$qa!k$qa!Y$qa!_$qa%i$qa!g$qa~Ol)dO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Og(pP~P!,TO!Q)iO!g)hO!_$^X$Z$^X$]$^X$_$^X$f$^X~O!g)hO!_({X$Z({X$]({X$_({X$f({X~O!Q)iO~P!.^O!Q)iO!_({X$Z({X$]({X$_({X$f({X~O!_)kO$Z)oO$])jO$_)jO$f)pO~O![)sO~P!)[O$]$hO$_$gO$f)wO~On$zX!Q$zX#S$zX'y$zX(y$zX(z$zX~OgmXg$zXnmX!]mX#`mX~P!0SOx)yO(b)zO(c)|O~On*VO!Q*OO'y*PO(y$}O(z%PO~Og)}O~P!1WOg*WO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S*YO!_*ZO!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op*`O![*^O(T*XO!k)OP~P!1uO#k*aO~O!l*bO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T*dO(VTO(YUO(a$uO(y$}O(z%PO~O![*gO!Y)PP~P!3tOr*sOs!nO!S*iO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO(e!mO~O!^*pO~P!5iO#S$dOn(`X!Q(`X'y(`X(y(`X(z(`X!](`X#`(`X~Og(`X$O(`X~P!6kOn*xO#`*wOg(_X!](_X~O!]*yOg(^X~Oj%dOk%dOl%dO(T&ZOg(^P~Os*|O~Og)}O(T&ZO~O!l+SO~O(T(vO~Op+WO!S%hO![#iO!_%iO!|]O#i#lO#j#iO(T%gO!k(sP~O!g#vO#k+XO~O!S%hO![+ZO!](^O!_%iO(T%gO!Y(vP~Os'[O!S+]O![+[O(VTO(YUO(e(|O~O!^(xP~P!9|O!]+^Oa)TX'z)TX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa!ja!]!ja'z!ja'w!ja!Y!ja!k!jav!ja!_!ja%i!ja!g!ja~P!:tOR#zO!Q#yO!S#{O!l#xO(aVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#n!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#x!ra#z!ra#{!ra(r!ra(y!ra(z!ra~Oa!ra'z!ra'w!ra!Y!ra!k!rav!ra!_!ra%i!ra!g!ra~P!=[OR#zO!Q#yO!S#{O!l#xO(aVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#n!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#x!ta#z!ta#{!ta(r!ta(y!ta(z!ta~Oa!ta'z!ta'w!ta!Y!ta!k!tav!ta!_!ta%i!ta!g!ta~P!?rOh%VOn+gO!_'`O%i+fO~O!g+iOa(]X!_(]X'z(]X!](]X~Oa%nO!_XO'z%nO~Oh%VO!l%eO~Oh%VO!l%eO(T%gO~O!g#vO#k(xO~Ob+tO%j+uO(T+qO(VTO(YUO!^)XP~O!]+vO`)WX~O[+zO~O`+{O~O!_&PO(T%gO(U!lO`)WP~O%j,OO~P;SOh%VO#`,SO~Oh%VOn,VO!_$|O~O!_,XO~O!Q,ZO!_XO~O%n%vO~O!x,`O~Oe,eO~Ob,fO(T#nO(VTO(YUO!^)VP~Oe%}O~O%j!QO(T&ZO~P=gO[,kO`,jO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$niO%h}O(VTO(YUO(aVO(o[O~O!_!eO!u!gO$W!kO(T!dO~P!FyO`,jOa%nO'z%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa,pOl!OO!uwO%l!OO%m!OO%n!OO~P!IcO!l&oO~O&^,vO~O!_,xO~O&o,zO&q,{OP&laQ&laS&laY&laa&lad&lae&lal&lap&lar&las&lat&laz&la|&la!O&la!S&la!W&la!X&la!_&la!i&la!l&la!o&la!p&la!q&la!s&la!u&la!x&la!|&la$W&la$n&la%h&la%j&la%l&la%m&la%n&la%q&la%s&la%v&la%w&la%y&la&W&la&^&la&`&la&b&la&d&la&g&la&m&la&s&la&u&la&w&la&y&la&{&la'w&la(T&la(V&la(Y&la(a&la(o&la!^&la&e&lab&la&j&la~O(T-QO~Oh!eX!]!RX!^!RX!g!RX!g!eX!l!eX#`!RX~O!]!eX!^!eX~P#!iO!g-VO#`-UOh(jX!]#hX!^#hX!g(jX!l(jX~O!](jX!^(jX~P##[Oh%VO!g-XO!l%eO!]!aX!^!aX~Os!nO!S!oO(VTO(YUO(e!mO~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(VTO(YUO(aVO(o[O~O(T=QO~P#$qO!]-]O!^(iX~O!^-_O~O!g-VO#`-UO!]#hX!^#hX~O!]-`O!^(xX~O!^-bO~O!c-cO!d-cO(U!lO~P#$`O!^-fO~P'_On-iO!_'`O~O!Y-nO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(U!{a(V!{a(Y!{a(e!{a(o!{a~P!#vO!p-sO#`-qO~PChO!c-uO!d-uO(U!lO~PDWOa%nO#`-qO'z%nO~Oa%nO!g#vO#`-qO'z%nO~Oa%nO!g#vO!p-sO#`-qO'z%nO(r'pO~O(P'xO(Q'xO(R-zO~Ov-{O~O!Y'Wa!]'Wa~P!:tO![.PO!Y'WX!]'WX~P%[O!](VO!Y(ha~O!Y(ha~PHRO!](^O!Y(va~O!S%hO![.TO!_%iO(T%gO!Y'^X!]'^X~O#`.VO!](ta!k(taa(ta'z(ta~O!g#vO~P#,wO!](jO!k(sa~O!S%hO!_%iO#j.ZO(T%gO~Op.`O!S%hO![.]O!_%iO!|]O#i._O#j.]O(T%gO!]'aX!k'aX~OR.dO!l#xO~Oh%VOn.gO!_'`O%i.fO~Oa#ci!]#ci'z#ci'w#ci!Y#ci!k#civ#ci!_#ci%i#ci!g#ci~P!:tOn>]O!Q*OO'y*PO(y$}O(z%PO~O#k#_aa#_a#`#_a'z#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#k(`XP(`XR(`X[(`Xa(`Xj(`Xr(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X'z(`X(a(`X(r(`X!k(`X!Y(`X'w(`Xv(`X!_(`X%i(`X!g(`X~P!6kO!].tO!k(kX~P!:tO!k.wO~O!Y.yO~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mia#mij#mir#mi!]#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#n#mi~P#3cO#n$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO[#mia#mij#mi!]#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#r#mi~P#6QO#r$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO(aVOa#mi!]#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#v#mi~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO(aVO(z#}Oa#mi!]#mi#z#mi#{#mi'z#mi(r#mi(y#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#x$UO~P#;VO#x#mi~P#;VO#v$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO(aVO(y#|O(z#}Oa#mi!]#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#z#mi~P#={O#z$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X!]]X!^]X~O$O]X~P#@jOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO#z<gO#{<hO(aVO(r$YO(y#|O(z#}O~O$O.{O~P#BwO#S$dO#`<nO$Q<nO$O(gX!^(gX~P! uOa'da!]'da'z'da'w'da!k'da!Y'dav'da!_'da%i'da!g'da~P!:tO[#mia#mij#mir#mi!]#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO(y#mi(z#mi~P#EyOn>]O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P#EyO!]/POg(pX~P!1WOg/RO~Oa$Pi!]$Pi'z$Pi'w$Pi!Y$Pi!k$Piv$Pi!_$Pi%i$Pi!g$Pi~P!:tO$]/SO$_/SO~O$]/TO$_/TO~O!g)hO#`/UO!_$cX$Z$cX$]$cX$_$cX$f$cX~O![/VO~O!_)kO$Z/XO$])jO$_)jO$f/YO~O!]<iO!^(fX~P#BwO!^/ZO~O!g)hO$f({X~O$f/]O~Ov/^O~P!&zOx)yO(b)zO(c/aO~O!S/dO~O(y$}On%aa!Q%aa'y%aa(z%aa!]%aa#`%aa~Og%aa$O%aa~P#L{O(z%POn%ca!Q%ca'y%ca(y%ca!]%ca#`%ca~Og%ca$O%ca~P#MnO!]fX!gfX!kfX!k$zX(rfX~P!0SOp%WO![/mO!](^O(T/lO!Y(vP!Y)PP~P!1uOr*sO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO~Os<}O!S/nO![+[O!^*pO(e<|O!^(xP~P$ [O!k/oO~P#/sO!]/pO!g#vO(r'pO!k)OX~O!k/uO~OnoX!QoX'yoX(yoX(zoX~O!g#vO!koX~P$#OOp/wO!S%hO![*^O!_%iO(T%gO!k)OP~O#k/xO~O!Y$zX!]$zX!g%RX~P!0SO!]/yO!Y)PX~P#/sO!g/{O~O!Y/}O~OpkO(T0OO~P.iOh%VOr0TO!g#vO!l%eO(r'pO~O!g+iO~Oa%nO!]0XO'z%nO~O!^0ZO~P!5iO!c0[O!d0[O(U!lO~P#$`Os!nO!S0]O(VTO(YUO(e!mO~O#[0_O~Og%aa!]%aa#`%aa$O%aa~P!1WOg%ca!]%ca#`%ca$O%ca~P!1WOj%dOk%dOl%dO(T&ZOg'mX!]'mX~O!]*yOg(^a~Og0hO~On0jO#`0iOg(_a!](_a~OR0kO!Q0kO!S0lO#S$dOn}a'y}a(y}a(z}a!]}a#`}a~Og}a$O}a~P$(cO!Q*OO'y*POn$sa(y$sa(z$sa!]$sa#`$sa~Og$sa$O$sa~P$)_O!Q*OO'y*POn$ua(y$ua(z$ua!]$ua#`$ua~Og$ua$O$ua~P$*QO#k0oO~Og%Ta!]%Ta#`%Ta$O%Ta~P!1WO!g#vO~O#k0rO~O!]+^Oa)Ta'z)Ta~OR#zO!Q#yO!S#{O!l#xO(aVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#n!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#x!ri#z!ri#{!ri(r!ri(y!ri(z!ri~Oa!ri'z!ri'w!ri!Y!ri!k!riv!ri!_!ri%i!ri!g!ri~P$+oOh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op0{O%]0|O(T0zO~P$.VO!g+iOa(]a!_(]a'z(]a!](]a~O#k1SO~O[]X!]fX!^fX~O!]1TO!^)XX~O!^1VO~O[1WO~Ob1YO(T+qO(VTO(YUO~O!_&PO(T%gO`'uX!]'uX~O!]+vO`)Wa~O!k1]O~P!:tO[1`O~O`1aO~O#`1fO~On1iO!_$|O~O(e(|O!^)UP~Oh%VOn1rO!_1oO%i1qO~O[1|O!]1zO!^)VX~O!^1}O~O`2POa%nO'z%nO~O(T#nO(VTO(YUO~O#S$dO#`$eO$Q$eOP(gXR(gX[(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~Oj2SO&[2TOa(gX~P$3pOj2SO#`$eO&[2TO~Oa2VO~P%[Oa2XO~O&e2[OP&ciQ&ciS&ciY&cia&cid&cie&cil&cip&cir&cis&cit&ciz&ci|&ci!O&ci!S&ci!W&ci!X&ci!_&ci!i&ci!l&ci!o&ci!p&ci!q&ci!s&ci!u&ci!x&ci!|&ci$W&ci$n&ci%h&ci%j&ci%l&ci%m&ci%n&ci%q&ci%s&ci%v&ci%w&ci%y&ci&W&ci&^&ci&`&ci&b&ci&d&ci&g&ci&m&ci&s&ci&u&ci&w&ci&y&ci&{&ci'w&ci(T&ci(V&ci(Y&ci(a&ci(o&ci!^&cib&ci&j&ci~Ob2bO!^2`O&j2aO~P`O!_XO!l2dO~O&q,{OP&liQ&liS&liY&lia&lid&lie&lil&lip&lir&lis&lit&liz&li|&li!O&li!S&li!W&li!X&li!_&li!i&li!l&li!o&li!p&li!q&li!s&li!u&li!x&li!|&li$W&li$n&li%h&li%j&li%l&li%m&li%n&li%q&li%s&li%v&li%w&li%y&li&W&li&^&li&`&li&b&li&d&li&g&li&m&li&s&li&u&li&w&li&y&li&{&li'w&li(T&li(V&li(Y&li(a&li(o&li!^&li&e&lib&li&j&li~O!Y2jO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2pO(e!mO!]'XX!^'XX~P@nO!]-]O!^(ia~O!]'_X!^'_X~P!9|O!]-`O!^(xa~O!^2wO~P'_Oa%nO#`3QO'z%nO~Oa%nO!g#vO#`3QO'z%nO~Oa%nO!g#vO!p3UO#`3QO'z%nO(r'pO~Oa%nO'z%nO~P!:tO!]$_Ov$qa~O!Y'Wi!]'Wi~P!:tO!](VO!Y(hi~O!](^O!Y(vi~O!Y(wi!](wi~P!:tO!](ti!k(tia(ti'z(ti~P!:tO#`3WO!](ti!k(tia(ti'z(ti~O!](jO!k(si~O!S%hO!_%iO!|]O#i3]O#j3[O(T%gO~O!S%hO!_%iO#j3[O(T%gO~On3dO!_'`O%i3cO~Oh%VOn3dO!_'`O%i3cO~O#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aav%aa!_%aa%i%aa!g%aa~P#L{O#k%caP%caR%ca[%caa%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%cav%ca!_%ca%i%ca!g%ca~P#MnO#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!]%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aa#`%aav%aa!_%aa%i%aa!g%aa~P#/sO#k%caP%caR%ca[%caa%caj%car%ca!S%ca!]%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%ca#`%cav%ca!_%ca%i%ca!g%ca~P#/sO#k}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a'z}a(a}a(r}a!k}a!Y}a'w}av}a!_}a%i}a!g}a~P$(cO#k$saP$saR$sa[$saa$saj$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa'z$sa(a$sa(r$sa!k$sa!Y$sa'w$sav$sa!_$sa%i$sa!g$sa~P$)_O#k$uaP$uaR$ua[$uaa$uaj$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua'z$ua(a$ua(r$ua!k$ua!Y$ua'w$uav$ua!_$ua%i$ua!g$ua~P$*QO#k%TaP%TaR%Ta[%Taa%Taj%Tar%Ta!S%Ta!]%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta'z%Ta(a%Ta(r%Ta!k%Ta!Y%Ta'w%Ta#`%Tav%Ta!_%Ta%i%Ta!g%Ta~P#/sOa#cq!]#cq'z#cq'w#cq!Y#cq!k#cqv#cq!_#cq%i#cq!g#cq~P!:tO![3lO!]'YX!k'YX~P%[O!].tO!k(ka~O!].tO!k(ka~P!:tO!Y3oO~O$O!na!^!na~PKlO$O!ja!]!ja!^!ja~P#BwO$O!ra!^!ra~P!=[O$O!ta!^!ta~P!?rOg']X!]']X~P!,TO!]/POg(pa~OSfO!_4TO$d4UO~O!^4YO~Ov4ZO~P#/sOa$mq!]$mq'z$mq'w$mq!Y$mq!k$mqv$mq!_$mq%i$mq!g$mq~P!:tO!Y4]O~P!&zO!S4^O~O!Q*OO'y*PO(z%POn'ia(y'ia!]'ia#`'ia~Og'ia$O'ia~P%-fO!Q*OO'y*POn'ka(y'ka(z'ka!]'ka#`'ka~Og'ka$O'ka~P%.XO(r$YO~P#/sO!YfX!Y$zX!]fX!]$zX!g%RX#`fX~P!0SOp%WO(T=WO~P!1uOp4bO!S%hO![4aO!_%iO(T%gO!]'eX!k'eX~O!]/pO!k)Oa~O!]/pO!g#vO!k)Oa~O!]/pO!g#vO(r'pO!k)Oa~Og$|i!]$|i#`$|i$O$|i~P!1WO![4jO!Y'gX!]'gX~P!3tO!]/yO!Y)Pa~O!]/yO!Y)Pa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~Oj%YX!g%YX~P%2OOj4oO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4tO!l%eO(r'pO~Or4yO!g#vO(r'pO~Os!nO!S4zO(VTO(YUO(e!mO~O(y$}On%ai!Q%ai'y%ai(z%ai!]%ai#`%ai~Og%ai$O%ai~P%5oO(z%POn%ci!Q%ci'y%ci(y%ci!]%ci#`%ci~Og%ci$O%ci~P%6bOg(_i!](_i~P!1WO#`5QOg(_i!](_i~P!1WO!k5VO~Oa$oq!]$oq'z$oq'w$oq!Y$oq!k$oqv$oq!_$oq%i$oq!g$oq~P!:tO!Y5ZO~O!]5[O!_)QX~P#/sOa$zX!_$zX%^]X'z$zX!]$zX~P!0SO%^5_OaoX!_oX'zoX!]oX~P$#OOp5`O(T#nO~O%^5_O~Ob5fO%j5gO(T+qO(VTO(YUO!]'tX!^'tX~O!]1TO!^)Xa~O[5kO~O`5lO~O[5pO~Oa%nO'z%nO~P#/sO!]5uO#`5wO!^)UX~O!^5xO~Or6OOs!nO!S*iO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!pO#W!pO#X!pO#[5}O#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O!^5|O~P%;eOn6TO!_1oO%i6SO~Oh%VOn6TO!_1oO%i6SO~Ob6[O(T#nO(VTO(YUO!]'sX!^'sX~O!]1zO!^)Va~O(VTO(YUO(e6^O~O`6bO~Oj6eO&[6fO~PNXO!k6gO~P%[Oa6iO~Oa6iO~P%[Ob2bO!^6nO&j2aO~P`O!g6pO~O!g6rOh(ji!](ji!^(ji!g(ji!l(jir(ji(r(ji~O!]#hi!^#hi~P#BwO#`6sO!]#hi!^#hi~O!]!ai!^!ai~P#BwOa%nO#`6|O'z%nO~Oa%nO!g#vO#`6|O'z%nO~O!](tq!k(tqa(tq'z(tq~P!:tO!](jO!k(sq~O!S%hO!_%iO#j7TO(T%gO~O!_'`O%i7WO~On7[O!_'`O%i7WO~O#k'iaP'iaR'ia['iaa'iaj'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia'z'ia(a'ia(r'ia!k'ia!Y'ia'w'iav'ia!_'ia%i'ia!g'ia~P%-fO#k'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka'z'ka(a'ka(r'ka!k'ka!Y'ka'w'kav'ka!_'ka%i'ka!g'ka~P%.XO#k$|iP$|iR$|i[$|ia$|ij$|ir$|i!S$|i!]$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i'z$|i(a$|i(r$|i!k$|i!Y$|i'w$|i#`$|iv$|i!_$|i%i$|i!g$|i~P#/sO#k%aiP%aiR%ai[%aia%aij%air%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai'z%ai(a%ai(r%ai!k%ai!Y%ai'w%aiv%ai!_%ai%i%ai!g%ai~P%5oO#k%ciP%ciR%ci[%cia%cij%cir%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci'z%ci(a%ci(r%ci!k%ci!Y%ci'w%civ%ci!_%ci%i%ci!g%ci~P%6bO!]'Ya!k'Ya~P!:tO!].tO!k(ki~O$O#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mij#mir#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#n#mi~P%NdO#n<_O~P%NdOP$[OR#zOr<kO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO[#mij#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#r#mi~P&!lO#r<aO~P&!lOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO(aVO#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#v#mi~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO(aVO(z#}O#z#mi#{#mi$O#mi(r#mi(y#mi!]#mi!^#mi~O#x<eO~P&&uO#x#mi~P&&uO#v<cO~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO(aVO(y#|O(z#}O#{#mi$O#mi(r#mi!]#mi!^#mi~O#z#mi~P&)UO#z<gO~P&)UOa#|y!]#|y'z#|y'w#|y!Y#|y!k#|yv#|y!_#|y%i#|y!g#|y~P!:tO[#mij#mir#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi!]#mi!^#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO(y#mi(z#mi~P&,QOn>^O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P&,QO#S$dOP(`XR(`X[(`Xj(`Xn(`Xr(`X!Q(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X$O(`X'y(`X(a(`X(r(`X(y(`X(z(`X!](`X!^(`X~O$O$Pi!]$Pi!^$Pi~P#BwO$O!ri!^!ri~P$+oOg']a!]']a~P!1WO!^7nO~O!]'da!^'da~P#BwO!Y7oO~P#/sO!g#vO(r'pO!]'ea!k'ea~O!]/pO!k)Oi~O!]/pO!g#vO!k)Oi~Og$|q!]$|q#`$|q$O$|q~P!1WO!Y'ga!]'ga~P#/sO!g7vO~O!]/yO!Y)Pi~P#/sO!]/yO!Y)Pi~O!Y7yO~Oh%VOr8OO!l%eO(r'pO~Oj8QO!g#vO~Or8TO!g#vO(r'pO~O!Q*OO'y*PO(z%POn'ja(y'ja!]'ja#`'ja~Og'ja$O'ja~P&5RO!Q*OO'y*POn'la(y'la(z'la!]'la#`'la~Og'la$O'la~P&5tOg(_q!](_q~P!1WO#`8VOg(_q!](_q~P!1WO!Y8WO~Og%Oq!]%Oq#`%Oq$O%Oq~P!1WOa$oy!]$oy'z$oy'w$oy!Y$oy!k$oyv$oy!_$oy%i$oy!g$oy~P!:tO!g6rO~O!]5[O!_)Qa~O!_'`OP$TaR$Ta[$Taj$Tar$Ta!Q$Ta!S$Ta!]$Ta!l$Ta!p$Ta#R$Ta#n$Ta#o$Ta#p$Ta#q$Ta#r$Ta#s$Ta#t$Ta#u$Ta#v$Ta#x$Ta#z$Ta#{$Ta(a$Ta(r$Ta(y$Ta(z$Ta~O%i7WO~P&8fO%^8[Oa%[i!_%[i'z%[i!]%[i~Oa#cy!]#cy'z#cy'w#cy!Y#cy!k#cyv#cy!_#cy%i#cy!g#cy~P!:tO[8^O~Ob8`O(T+qO(VTO(YUO~O!]1TO!^)Xi~O`8dO~O(e(|O!]'pX!^'pX~O!]5uO!^)Ua~O!^8nO~P%;eO(o!sO~P$&YO#[8oO~O!_1oO~O!_1oO%i8qO~On8tO!_1oO%i8qO~O[8yO!]'sa!^'sa~O!]1zO!^)Vi~O!k8}O~O!k9OO~O!k9RO~O!k9RO~P%[Oa9TO~O!g9UO~O!k9VO~O!](wi!^(wi~P#BwOa%nO#`9_O'z%nO~O!](ty!k(tya(ty'z(ty~P!:tO!](jO!k(sy~O%i9bO~P&8fO!_'`O%i9bO~O#k$|qP$|qR$|q[$|qa$|qj$|qr$|q!S$|q!]$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q'z$|q(a$|q(r$|q!k$|q!Y$|q'w$|q#`$|qv$|q!_$|q%i$|q!g$|q~P#/sO#k'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja'z'ja(a'ja(r'ja!k'ja!Y'ja'w'jav'ja!_'ja%i'ja!g'ja~P&5RO#k'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la'z'la(a'la(r'la!k'la!Y'la'w'lav'la!_'la%i'la!g'la~P&5tO#k%OqP%OqR%Oq[%Oqa%Oqj%Oqr%Oq!S%Oq!]%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq'z%Oq(a%Oq(r%Oq!k%Oq!Y%Oq'w%Oq#`%Oqv%Oq!_%Oq%i%Oq!g%Oq~P#/sO!]'Yi!k'Yi~P!:tO$O#cq!]#cq!^#cq~P#BwO(y$}OP%aaR%aa[%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa$O%aa(a%aa(r%aa!]%aa!^%aa~On%aa!Q%aa'y%aa(z%aa~P&IyO(z%POP%caR%ca[%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca$O%ca(a%ca(r%ca!]%ca!^%ca~On%ca!Q%ca'y%ca(y%ca~P&LQOn>^O!Q*OO'y*PO(z%PO~P&IyOn>^O!Q*OO'y*PO(y$}O~P&LQOR0kO!Q0kO!S0lO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a$O}a'y}a(a}a(r}a(y}a(z}a!]}a!^}a~O!Q*OO'y*POP$saR$sa[$saj$san$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa$O$sa(a$sa(r$sa(y$sa(z$sa!]$sa!^$sa~O!Q*OO'y*POP$uaR$ua[$uaj$uan$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua$O$ua(a$ua(r$ua(y$ua(z$ua!]$ua!^$ua~On>^O!Q*OO'y*PO(y$}O(z%PO~OP%TaR%Ta[%Taj%Tar%Ta!S%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta$O%Ta(a%Ta(r%Ta!]%Ta!^%Ta~P''VO$O$mq!]$mq!^$mq~P#BwO$O$oq!]$oq!^$oq~P#BwO!^9oO~O$O9pO~P!1WO!g#vO!]'ei!k'ei~O!g#vO(r'pO!]'ei!k'ei~O!]/pO!k)Oq~O!Y'gi!]'gi~P#/sO!]/yO!Y)Pq~Or9wO!g#vO(r'pO~O[9yO!Y9xO~P#/sO!Y9xO~Oj:PO!g#vO~Og(_y!](_y~P!1WO!]'na!_'na~P#/sOa%[q!_%[q'z%[q!]%[q~P#/sO[:UO~O!]1TO!^)Xq~O`:YO~O#`:ZO!]'pa!^'pa~O!]5uO!^)Ui~P#BwO!S:]O~O!_1oO%i:`O~O(VTO(YUO(e:eO~O!]1zO!^)Vq~O!k:hO~O!k:iO~O!k:jO~O!k:jO~P%[O#`:mO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%i:rO~P&8fO!_'`O%i:rO~O$O#|y!]#|y!^#|y~P#BwOP$|iR$|i[$|ij$|ir$|i!S$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i$O$|i(a$|i(r$|i!]$|i!^$|i~P''VO!Q*OO'y*PO(z%POP'iaR'ia['iaj'ian'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia$O'ia(a'ia(r'ia(y'ia!]'ia!^'ia~O!Q*OO'y*POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka$O'ka(a'ka(r'ka(y'ka(z'ka!]'ka!^'ka~O(y$}OP%aiR%ai[%aij%ain%air%ai!Q%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai$O%ai'y%ai(a%ai(r%ai(z%ai!]%ai!^%ai~O(z%POP%ciR%ci[%cij%cin%cir%ci!Q%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci$O%ci'y%ci(a%ci(r%ci(y%ci!]%ci!^%ci~O$O$oy!]$oy!^$oy~P#BwO$O#cy!]#cy!^#cy~P#BwO!g#vO!]'eq!k'eq~O!]/pO!k)Oy~O!Y'gq!]'gq~P#/sOr:|O!g#vO(r'pO~O[;QO!Y;PO~P#/sO!Y;PO~Og(_!R!](_!R~P!1WOa%[y!_%[y'z%[y!]%[y~P#/sO!]1TO!^)Xy~O!]5uO!^)Uq~O(T;XO~O!_1oO%i;[O~O!k;_O~O%i;dO~P&8fOP$|qR$|q[$|qj$|qr$|q!S$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q$O$|q(a$|q(r$|q!]$|q!^$|q~P''VO!Q*OO'y*PO(z%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja$O'ja(a'ja(r'ja(y'ja!]'ja!^'ja~O!Q*OO'y*POP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la$O'la(a'la(r'la(y'la(z'la!]'la!^'la~OP%OqR%Oq[%Oqj%Oqr%Oq!S%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq$O%Oq(a%Oq(r%Oq!]%Oq!^%Oq~P''VOg%e!Z!]%e!Z#`%e!Z$O%e!Z~P!1WO!Y;hO~P#/sOr;iO!g#vO(r'pO~O[;kO!Y;hO~P#/sO!]'pq!^'pq~P#BwO!]#h!Z!^#h!Z~P#BwO#k%e!ZP%e!ZR%e!Z[%e!Za%e!Zj%e!Zr%e!Z!S%e!Z!]%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z'z%e!Z(a%e!Z(r%e!Z!k%e!Z!Y%e!Z'w%e!Z#`%e!Zv%e!Z!_%e!Z%i%e!Z!g%e!Z~P#/sOr;tO!g#vO(r'pO~O!Y;uO~P#/sOr;|O!g#vO(r'pO~O!Y;}O~P#/sOP%e!ZR%e!Z[%e!Zj%e!Zr%e!Z!S%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z$O%e!Z(a%e!Z(r%e!Z!]%e!Z!^%e!Z~P''VOr<QO!g#vO(r'pO~Ov(fX~P1qO!Q%rO~P!)[O(U!lO~P!)[O!YfX!]fX#`fX~P%2OOP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~O!gfX!k]X!kfX(rfX~P'LTOP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_XO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]<iO!^$qa~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<tO!S${O!_$|O!i>WO!l$xO#j<zO$W%`O$t<vO$v<xO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Ol)dO~P(!yOr!eX(r!eX~P#!iOr(jX(r(jX~P##[O!^]X!^fX~P'LTO!YfX!Y$zX!]fX!]$zX#`fX~P!0SO#k<^O~O!g#vO#k<^O~O#`<nO~Oj<bO~O#`=OO!](wX!^(wX~O#`<nO!](uX!^(uX~O#k=PO~Og=RO~P!1WO#k=XO~O#k=YO~Og=RO(T&ZO~O!g#vO#k=ZO~O!g#vO#k=PO~O$O=[O~P#BwO#k=]O~O#k=^O~O#k=cO~O#k=dO~O#k=eO~O#k=fO~O$O=gO~P!1WO$O=hO~P!1WOl=sO~P7eOk#S#T#U#W#X#[#i#j#u$n$t$v$y%]%^%h%i%j%q%s%v%w%y%{~(OT#o!X'|(U#ps#n#qr!Q'}$]'}(T$_(e~",
	goto: "$9Y)]PPPPPP)^PP)aP)rP+W/]PPPP6mPP7TPP=QPPP@tPA^PA^PPPA^PCfPA^PA^PA^PCjPCoPD^PIWPPPI[PPPPI[L_PPPLeMVPI[PI[PP! eI[PPPI[PI[P!#lI[P!'S!(X!(bP!)U!)Y!)U!,gPPPPPPP!-W!(XPP!-h!/YP!2iI[I[!2n!5z!:h!:h!>gPPP!>oI[PPPPPPPPP!BOP!C]PPI[!DnPI[PI[I[I[I[I[PI[!FQP!I[P!LbP!Lf!Lp!Lt!LtP!IXP!Lx!LxP#!OP#!SI[PI[#!Y#%_CjA^PA^PA^A^P#&lA^A^#)OA^#+vA^#.SA^A^#.r#1W#1W#1]#1f#1W#1qPP#1WPA^#2ZA^#6YA^A^6mPPP#:_PPP#:x#:xP#:xP#;`#:xPP#;fP#;]P#;]#;y#;]#<e#<k#<n)aP#<q)aP#<z#<z#<zP)aP)aP)aP)aPP)aP#=Q#=TP#=T)aP#=XP#=[P)aP)aP)aP)aP)aP)a)aPP#=b#=h#=s#=y#>P#>V#>]#>k#>q#>{#?R#?]#?c#?s#?y#@k#@}#AT#AZ#Ai#BO#Cs#DR#DY#Et#FS#Gt#HS#HY#H`#Hf#Hp#Hv#H|#IW#Ij#IpPPPPPPPPPPP#IvPPPPPPP#Jk#Mx$ b$ i$ qPPP$']P$'f$*_$0x$0{$1O$1}$2Q$2X$2aP$2g$2jP$3W$3[$4S$5b$5g$5}PP$6S$6Y$6^$6a$6e$6i$7e$7|$8e$8i$8l$8o$8y$8|$9Q$9UR!|RoqOXst!Z#d%m&r&t&u&w,s,x2[2_Y!vQ'`-e1o5{Q%tvQ%|yQ&T|Q&j!VS'W!e-]Q'f!iS'l!r!yU*k$|*Z*oQ+o%}S+|&V&WQ,d&dQ-c'_Q-m'gQ-u'mQ0[*qQ1b,OQ1y,eR<{<Y%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_S#q]<V!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU+P%]<s<tQ+t&PQ,f&gQ,m&oQ0x+gQ0}+iQ1Y+uQ2R,kQ3`.gQ5`0|Q5f1TQ6[1zQ7Y3dQ8`5gR9e7['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S!S!nQ!r!v!y!z$|'W'_'`'l'm'n*k*o*q*r-]-c-e-u0[0_1o5{5}%[$ti#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q&X|Q'U!eS'[%i-`Q+t&PQ,P&WQ,f&gQ0n+SQ1Y+uQ1_+{Q2Q,jQ2R,kQ5f1TQ5o1aQ6[1zQ6_1|Q6`2PQ8`5gQ8c5lQ8|6bQ:X8dQ:f8yQ;V:YR<}*ZrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R,h&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'b'r(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>R>S[#]WZ#W#Z'X(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ%wxQ%{yW&Q|&V&W,OQ&_!TQ'c!hQ'e!iQ(q#sS+n%|%}Q+r&PQ,_&bQ,c&dS-l'f'gQ.i(rQ1R+oQ1X+uQ1Z+vQ1^+zQ1t,`S1x,d,eQ2|-mQ5e1TQ5i1WQ5n1`Q6Z1yQ8_5gQ8b5kQ8f5pQ:T8^R;T:U!U$zi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y!^%yy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{Q+h%wQ,T&[Q,W&]Q,b&dQ.h(qQ1s,_U1w,c,d,eQ3e.iQ6U1tS6Y1x1yQ8x6Z#f>T#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o>U<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hW%Ti%V*y>PS&[!Q&iQ&]!RQ&^!SU*}%[%d=sR,R&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^T)z$u){V+P%]<s<tW'[!e%i*Z-`S(}#y#zQ+c%rQ+y&SS.b(m(nQ1j,XQ5T0kR8i5u'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S$i$^c#Y#e%q%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.|.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ'Y!eR2q-]!W!nQ!e!r!v!y!z$|'W'_'`'l'm'n*Z*k*o*q*r-]-c-e-u0[0_1o5{5}R1l,ZnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&y!^Q'v!xS(s#u<^Q+l%zQ,]&_Q,^&aQ-j'dQ-w'oS.r(x=PS0q+X=ZQ1P+mQ1n,[Q2c,zQ2e,{Q2m-WQ2z-kQ2}-oS5Y0r=eQ5a1QS5d1S=fQ6t2oQ6x2{Q6}3SQ8]5bQ9Y6vQ9Z6yQ9^7OR:l9V$d$]c#Y#e%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vS(o#p'iQ)P#zS+b%q.|S.c(n(pR3^.d'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS#q]<VQ&t!XQ&u!YQ&w![Q&x!]R2Z,vQ'a!hQ+e%wQ-h'cS.e(q+hQ2x-gW3b.h.i0w0yQ6w2yW7U3_3a3e5^U9a7V7X7ZU:q9c9d9fS;b:p:sQ;p;cR;x;qU!wQ'`-eT5y1o5{!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(j,s,x.[2[2_]!pQ!r'`-e1o5{T#q]<V%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S(}#y#zS.b(m(n!s=l$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU$fd)_,mS(p#p'iU*v%R(w4OU0m+O.n7gQ5^0xQ7V3`Q9d7YR:s9em!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}Q't!uS(f#g2US-s'k'wQ/s*]Q0R*jQ3U-vQ4f/tQ4r0TQ4s0UQ4x0^Q7r4`S7}4t4vS8R4y4{Q9r7sQ9v7yQ9{8OQ:Q8TS:{9w9xS;g:|;PS;s;h;iS;{;t;uS<P;|;}R<S<QQ#wbQ's!uS(e#g2US(g#m+WQ+Y%fQ+j%xQ+p&OU-r'k't'wQ.W(fU/r*]*`/wQ0S*jQ0V*lQ1O+kQ1u,aS3R-s-vQ3Z.`S4e/s/tQ4n0PS4q0R0^Q4u0WQ6W1vQ7P3US7q4`4bQ7u4fU7|4r4x4{Q8P4wQ8v6XS9q7r7sQ9u7yQ9}8RQ:O8SQ:c8wQ:y9rS:z9v9xQ;S:QQ;^:dS;f:{;PS;r;g;hS;z;s;uS<O;{;}Q<R<PQ<T<SQ=o=jQ={=tR=|=uV!wQ'`-e%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S#wz!j!r=i$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=o>R%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Q%fj!^%xy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{S&Oz!jQ+k%yQ,a&dW1v,b,c,d,eU6X1w1x1yS8w6Y6ZQ:d8x!r=j$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ=t>QR=u>R%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Y#bWZ#W#Z(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ,n&o!p=k$Z$n)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=n'XU']!e%i*ZR2s-`%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ,m&oQ0x+gQ3`.gQ7Y3dR9e7[!b$Tc#Y%q(S(Y(t(y)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!P<d)^)q-Z.|2k2n3p3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!f$Vc#Y%q(S(Y(t(y)W)X)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!T<f)^)q-Z.|2k2n3p3v3w3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!^$Zc#Y%q(S(Y(t(y)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<WQ4_/kz>S)^)q-Z.|2k2n3p4P4X6u7b7k7l8k9X9g9m9n;W;`=vQ>X>ZR>Y>['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS$oh$pR4U/U'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$kf$qQ$ifS)j$l)nR)v$qT$jf$qT)l$l)n'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$oh$pQ$rhR)u$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_!s>Q$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'b)O)s*i+]+g,p,s,x-i.g/V/n0]0l1r2S2T2V2X2[2_2a3d4T4z6T6e6f6i7[8t9T!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^Q+T%aQ/c*Oo4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!U$yi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>YQ*c$zU*l$|*Z*oQ+U%bQ0W*m#f=q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n=r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hQ=w>TQ=x>UQ=y>VR=z>W!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hnoOXst!Z#d%m&r&t&u&w,s,x2[2_S*f${*YQ-R'OQ-S'QR4i/y%[%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q,U&]Q1h,WQ5s1gR8h5tV*n$|*Z*oU*n$|*Z*oT5z1o5{S0P*i/nQ4w0]T8S4z:]Q+j%xQ0V*lQ1O+kQ1u,aQ6W1vQ8v6XQ:c8wR;^:d!U%Oi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Yx*R$v)e*S*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>OS0`*t0a#f<o#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<p<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!d=S(u)c*[*e.j.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[`=T3}7c7f7j9h:t:w;yS=_.l3iT=`7e9k!U%Qi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y|*T$v)e*U*t+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>OS0b*u0c#f<q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!h=U(u)c*[*e.k.l.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[d=V3}7d7e7j9h9i:t:u:w;yS=a.m3jT=b7f9lrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q&f!UR,p&ornOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R&f!UQ,Y&^R1d,RsnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q1p,_S6R1s1tU8p6P6Q6US:_8r8sS;Y:^:aQ;m;ZR;w;nQ&m!VR,i&iR6_1|R:f8yW&Q|&V&W,OR1Z+vQ&r!WR,s&sR,y&xT2],x2_R,}&yQ,|&yR2f,}Q'y!{R-y'ySsOtQ#dXT%ps#dQ#OTR'{#OQ#RUR'}#RQ){$uR/`){Q#UVR(Q#UQ#XWU(W#X(X.QQ(X#YR.Q(YQ-^'YR2r-^Q.u(yS3m.u3nR3n.vQ-e'`R2v-eY!rQ'`-e1o5{R'j!rQ/Q)eR4S/QU#_W%h*YU(_#_(`.RQ(`#`R.R(ZQ-a']R2t-at`OXst!V!Z#d%m&i&k&r&t&u&w,s,x2[2_S#hZ%eU#r`#h.[R.[(jQ(k#jQ.X(gW.a(k.X3X7RQ3X.YR7R3YQ)n$lR/W)nQ$phR)t$pQ$`cU)a$`-|<jQ-|<WR<j)qQ/q*]W4c/q4d7t9sU4d/r/s/tS7t4e4fR9s7u$e*Q$v(u)c)e*[*e*t*u+Q+R+V.l.m.o.p.q/_/g/i/k/v/|0d0e0v1e3f3g3h3}4R4[4g4h4l4|5O5R5S5W5r7]7^7_7`7e7f7h7i7j7p7w7z8U8X8Z9h9i9j9t9|:R:S:t:u:v:w:x:};R;e;j;v;y=p=}>O>Z>[Q/z*eU4k/z4m7xQ4m/|R7x4lS*o$|*ZR0Y*ox*S$v)e*t*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>O!d.j(u)c*[*e.l.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/h*S.j7ca7c3}7e7f7j9h:t:w;yQ0a*tQ3i.lU4}0a3i9kR9k7e|*U$v)e*t*u+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>O!h.k(u)c*[*e.l.m.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/j*U.k7de7d3}7e7f7j9h9i:t:u:w;yQ0c*uQ3j.mU5P0c3j9lR9l7fQ*z%UR0g*zQ5]0vR8Y5]Q+_%kR0u+_Q5v1jS8j5v:[R:[8kQ,[&_R1m,[Q5{1oR8m5{Q1{,fS6]1{8zR8z6_Q1U+rW5h1U5j8a:VQ5j1XQ8a5iR:V8bQ+w&QR1[+wQ2_,xR6m2_YrOXst#dQ&v!ZQ+a%mQ,r&rQ,t&tQ,u&uQ,w&wQ2Y,sS2],x2_R6l2[Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'q!uQ+`%lQ+l%zQ,Q&XQ,h&mQ-P&|W-p'k's't'wQ-w'oQ0X*nQ1P+mQ1c,PS2O,i,lQ2g-OQ2h-RQ2i-SQ2}-oW3P-r-s-v-xQ5a1QQ5m1_Q5q1eQ6V1uQ6a2QQ6k2ZU6z3O3R3UQ6}3SQ8]5bQ8e5oQ8g5rQ8l5zQ8u6WQ8{6`S9[6{7PQ9^7OQ:W8cQ:b8vQ:g8|Q:n9]Q;U:XQ;]:cQ;a:oQ;l;VR;o;^Q%zyQ'd!iQ'o!uU+m%{%|%}Q-W'VU-k'e'f'gS-o'k'uQ0Q*jS1Q+n+oQ2o-YS2{-l-mQ3S-tS4p0R0UQ5b1RQ6v2uQ6y2|Q7O3TU7{4r4s4vQ9z7}R;O9{S$wi>PR*{%VU%Ui%V>PR0f*yQ$viS(u#v+iS)c$b$cQ)e$dQ*[$xS*e${*YQ*t%OQ*u%QQ+Q%^Q+R%_Q+V%cQ.l<oQ.m<qQ.o<uQ.p<wQ.q<yQ/_)yQ/g*RQ/i*TQ/k*VQ/v*aS/|*g/mQ0d*wQ0e*xl0v+f,V.f1i1q3c6S7W8q9b:`:r;[;dQ1e,SQ3f=SQ3g=UQ3h=XS3}<l<mQ4R/PS4[/d4^Q4g/xQ4h/yQ4l/{Q4|0`Q5O0bQ5R0iQ5S0jQ5W0oQ5r1fQ7]=]Q7^=_Q7_=aQ7`=cQ7e<pQ7f<rQ7h<vQ7i<xQ7j<zQ7p4_Q7w4jQ7z4oQ8U5QQ8X5[Q8Z5_Q9h=YQ9i=TQ9j=VQ9t7vQ9|8QQ:R8VQ:S8[Q:t=^Q:u=`Q:v=bQ:w=dQ:x9pQ:}9yQ;R:PQ;e=gQ;j;QQ;v;kQ;y=hQ=p>PQ=}>XQ>O>YQ>Z>]R>[>^Q+O%]Q.n<sR7g<tnpOXst!Z#d%m&r&t&u&w,s,x2[2_Q!fPS#fZ#oQ&|!`W'h!o*i0]4zQ(P#SQ)Q#{Q)r$nS,l&k&nQ,q&oQ-O&{S-T'T/nQ-g'bQ.x)OQ/[)sQ0s+]Q0y+gQ2W,pQ2y-iQ3a.gQ4W/VQ5U0lQ6Q1rQ6c2SQ6d2TQ6h2VQ6j2XQ6o2aQ7Z3dQ7m4TQ8s6TQ9P6eQ9Q6fQ9S6iQ9f7[Q:a8tR:k9T#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'b)O*i+]+g,p,s,x-i.g/n0]0l1r2S2T2V2X2[2_2a3d4z6T6e6f6i7[8t9TQ#YWQ#eYQ%quQ%svS%uw!gS(S#W(VQ(Y#ZQ(t#uQ(y#xQ)R$OQ)S$PQ)T$QQ)U$RQ)V$SQ)W$TQ)X$UQ)Y$VQ)Z$WQ)[$XQ)^$ZQ)`$_Q)b$aQ)g$eW)q$n)s/V4TQ+d%tQ+x&RS-Z'X2pQ-x'rS-}(T.PQ.S(]Q.U(dQ.s(xQ.v(zQ.z<UQ.|<XQ.}<YQ/O<]Q/b)}Q0p+XQ2k-UQ2n-XQ3O-qQ3V.VQ3k.tQ3p<^Q3q<_Q3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{.{Q3|<kQ4P<nQ4Q<{Q4X<iQ5X0rQ5c1SQ6u=OQ6{3QQ7Q3WQ7a3lQ7b=PQ7k=RQ7l=ZQ8k5wQ9X6sQ9]6|Q9g=[Q9m=eQ9n=fQ:o9_Q;W:ZQ;`:mQ<W#SR=v>SR#[WR'Z!el!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}S'V!e-]U*j$|*Z*oS-Y'W'_S0U*k*qQ0^*rQ2u-cQ4v0[R4{0_R({#xQ!fQT-d'`-e]!qQ!r'`-e1o5{Q#p]R'i<VR)f$dY!uQ'`-e1o5{Q'k!rS'u!v!yS'w!z5}S-t'l'mQ-v'nR3T-uT#kZ%eS#jZ%eS%km,oU(g#h#i#lS.Y(h(iQ.^(jQ0t+^Q3Y.ZU3Z.[.]._S7S3[3]R9`7Td#^W#W#Z%h(T(^*Y+Z.T/mr#gZm#h#i#l%e(h(i(j+^.Z.[.]._3[3]7TS*]$x*bQ/t*^Q2U,oQ2l-VQ4`/pQ6q2dQ7s4aQ9W6rT=m'X+[V#aW%h*YU#`W%h*YS(U#W(^U(Z#Z+Z/mS-['X+[T.O(T.TV'^!e%i*ZQ$lfR)x$qT)m$l)nR4V/UT*_$x*bT*h${*YQ0w+fQ1g,VQ3_.fQ5t1iQ6P1qQ7X3cQ8r6SQ9c7WQ:^8qQ:p9bQ;Z:`Q;c:rQ;n;[R;q;dnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&l!VR,h&itmOXst!U!V!Z#d%m&i&r&t&u&w,s,x2[2_R,o&oT%lm,oR1k,XR,g&gQ&U|S+}&V&WR1^,OR+s&PT&p!W&sT&q!W&sT2^,x2_",
	nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
	maxTerm: 380,
	context: Gc,
	nodeProps: [
		[
			"isolate",
			-8,
			5,
			6,
			14,
			37,
			39,
			51,
			53,
			55,
			""
		],
		[
			"group",
			-26,
			9,
			17,
			19,
			68,
			207,
			211,
			215,
			216,
			218,
			221,
			224,
			234,
			237,
			243,
			245,
			247,
			249,
			252,
			258,
			264,
			266,
			268,
			270,
			272,
			274,
			275,
			"Statement",
			-34,
			13,
			14,
			32,
			35,
			36,
			42,
			51,
			54,
			55,
			57,
			62,
			70,
			72,
			76,
			80,
			82,
			84,
			85,
			110,
			111,
			120,
			121,
			136,
			139,
			141,
			142,
			143,
			144,
			145,
			147,
			148,
			167,
			169,
			171,
			"Expression",
			-23,
			31,
			33,
			37,
			41,
			43,
			45,
			173,
			175,
			177,
			178,
			180,
			181,
			182,
			184,
			185,
			186,
			188,
			189,
			190,
			201,
			203,
			205,
			206,
			"Type",
			-3,
			88,
			103,
			109,
			"ClassItem"
		],
		[
			"openedBy",
			23,
			"<",
			38,
			"InterpolationStart",
			56,
			"[",
			60,
			"{",
			73,
			"(",
			160,
			"JSXStartCloseTag"
		],
		[
			"closedBy",
			-2,
			24,
			168,
			">",
			40,
			"InterpolationEnd",
			50,
			"]",
			61,
			"}",
			74,
			")",
			165,
			"JSXEndTag"
		]
	],
	propSources: [Qc],
	skippedNodes: [
		0,
		5,
		6,
		278
	],
	repeatNodeCount: 37,
	tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$i&j(Wp(Z!b'|0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(X#S$i&j'}0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$i&j(Wp(Z!b'}0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$i&j!p),Q(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(V':f$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$i&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$d`$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$d``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$d`$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(Z!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$d`(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$i&j(Wp(Z!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$i&j(Wp(Z!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$i&j(Z!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$i&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(Z!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$i&j(WpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(WpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Wp(Z!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$i&j(o%1l(Wp(Z!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$i&j(Wp(Z!b$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$i&j(Wp(Z!b$]#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$i&j(Wp(Z!b#p(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$i&j$Q(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(z+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$i&j#z(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Y';W$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$i&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$d`$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(WpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$d`(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$i&j(Wp(Z!b(U%&f#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$i&j(Wp(Z!b#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$i&j(Wp(Z!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$i&j(Wp(Z!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$i&j(Wp(Z!b#o(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$i&j(Z!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$i&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$i&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$i&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$i&j(Z!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(Z!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(Z!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(Z!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$i&j(Z!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$i&j(Wp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$i&j(Wp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Wp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Wp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(WpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$i&j(WpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$i&j(Wp(Z!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Wp(Z!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Wp(Z!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Wp(Z!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$i&j(Wp(Z!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$i&j(Wp(Z!b(O0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$i&j(Wp(Z!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$i&j(Z!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$i&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(Z!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$i&j(WpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(WpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Wp(Z!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$i&j$Q(Ch(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$Z#t$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$i&j$O)Lv(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Wp(Z!b$n7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$k&j(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#r(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$Q(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#s(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#k(Cl$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#s(Ch$f#|$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#s(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(r(Ct$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$i&j#{(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$i&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$i&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$i&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$i&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$i&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#x(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$i&j(Wp(Z!b(a+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$i&j(Wp(Z!b(T,2j$_#t(e$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$i&j(Wp(Z!b$_#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(y+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$i&j(Wp(Z!b'|0/l$]#t(T,2j(e$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$i&j(Wp(Z!b'}0/l$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
	tokenizers: [
		qc,
		Jc,
		Yc,
		Zc,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		Kc,
		new Za("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(c~~", 141, 340),
		new Za("j~RQYZXz{^~^O(Q~~aP!P!Qd~iO(R~~", 25, 323)
	],
	topRules: {
		Script: [0, 7],
		SingleExpression: [1, 276],
		SingleClassItem: [2, 277]
	},
	dialects: {
		jsx: 0,
		ts: 15175
	},
	dynamicPrecedences: {
		80: 1,
		82: 1,
		94: 1,
		169: 1,
		199: 1
	},
	specialized: [
		{
			term: 327,
			get: (e) => $c[e] || -1
		},
		{
			term: 343,
			get: (e) => el[e] || -1
		},
		{
			term: 95,
			get: (e) => tl[e] || -1
		}
	],
	tokenPrec: 15201
}), rl = [
	/*@__PURE__*/ M("function ${name}(${params}) {\n	${}\n}", {
		label: "function",
		detail: "definition",
		type: "keyword"
	}),
	/*@__PURE__*/ M("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
		label: "for",
		detail: "loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("for (let ${name} of ${collection}) {\n	${}\n}", {
		label: "for",
		detail: "of loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("do {\n	${}\n} while (${})", {
		label: "do",
		detail: "loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("while (${}) {\n	${}\n}", {
		label: "while",
		detail: "loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("try {\n	${}\n} catch (${error}) {\n	${}\n}", {
		label: "try",
		detail: "/ catch block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("if (${}) {\n	${}\n}", {
		label: "if",
		detail: "block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("if (${}) {\n	${}\n} else {\n	${}\n}", {
		label: "if",
		detail: "/ else block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("class ${name} {\n	constructor(${params}) {\n		${}\n	}\n}", {
		label: "class",
		detail: "definition",
		type: "keyword"
	}),
	/*@__PURE__*/ M("import {${names}} from \"${module}\"\n${}", {
		label: "import",
		detail: "named",
		type: "keyword"
	}),
	/*@__PURE__*/ M("import ${name} from \"${module}\"\n${}", {
		label: "import",
		detail: "default",
		type: "keyword"
	})
], il = /*@__PURE__*/ rl.concat([
	/*@__PURE__*/ M("interface ${name} {\n	${}\n}", {
		label: "interface",
		detail: "definition",
		type: "keyword"
	}),
	/*@__PURE__*/ M("type ${name} = ${type}", {
		label: "type",
		detail: "definition",
		type: "keyword"
	}),
	/*@__PURE__*/ M("enum ${name} {\n	${}\n}", {
		label: "enum",
		detail: "definition",
		type: "keyword"
	})
]), al = /*@__PURE__*/ new ce(), ol = /*@__PURE__*/ new Set([
	"Script",
	"Block",
	"FunctionExpression",
	"FunctionDeclaration",
	"ArrowFunction",
	"MethodDeclaration",
	"ForStatement"
]);
function sl(e) {
	return (t, n) => {
		let r = t.node.getChild("VariableDefinition");
		return r && n(r, e), !0;
	};
}
var cl = ["FunctionDeclaration"], ll = {
	FunctionDeclaration: /*@__PURE__*/ sl("function"),
	ClassDeclaration: /*@__PURE__*/ sl("class"),
	ClassExpression: () => !0,
	EnumDeclaration: /*@__PURE__*/ sl("constant"),
	TypeAliasDeclaration: /*@__PURE__*/ sl("type"),
	NamespaceDeclaration: /*@__PURE__*/ sl("namespace"),
	VariableDefinition(e, t) {
		e.matchContext(cl) || t(e, "variable");
	},
	TypeDefinition(e, t) {
		t(e, "type");
	},
	__proto__: null
};
function ul(e, t) {
	let n = al.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(oe.IncludeAnonymous).iterate((t) => {
		if (i) i = !1;
		else if (t.name) {
			let e = ll[t.name];
			if (e && e(t, a) || ol.has(t.name)) return !1;
		} else if (t.to - t.from > 8192) {
			for (let n of ul(e, t.node)) r.push(n);
			return !1;
		}
	}), al.set(t, r), r;
}
var dl = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, fl = [
	"TemplateString",
	"String",
	"RegExp",
	"LineComment",
	"BlockComment",
	"VariableDefinition",
	"TypeDefinition",
	"Label",
	"PropertyDefinition",
	"PropertyName",
	"PrivatePropertyDefinition",
	"PrivatePropertyName",
	"JSXText",
	"JSXAttributeValue",
	"JSXOpenTag",
	"JSXCloseTag",
	"JSXSelfClosingTag",
	".",
	"?."
];
function pl(e) {
	let t = y(e.state).resolveInner(e.pos, -1);
	if (fl.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && dl.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) ol.has(n.name) && (r = r.concat(ul(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: dl
	};
}
var K = /*@__PURE__*/ Ue.define({
	name: "javascript",
	parser: /*@__PURE__*/ nl.configure({ props: [/*@__PURE__*/ Qe.add({
		IfStatement: /*@__PURE__*/ O({ except: /^\s*({|else\b)/ }),
		TryStatement: /*@__PURE__*/ O({ except: /^\s*({|catch\b|finally\b)/ }),
		LabeledStatement: Ve,
		SwitchBody: (e) => {
			let t = e.textAfter, n = /^\s*\}/.test(t), r = /^\s*(case|default)\b/.test(t);
			return e.baseIndent + (n ? 0 : r ? 1 : 2) * e.unit;
		},
		Block: /*@__PURE__*/ Te({ closing: "}" }),
		ArrowFunction: (e) => e.baseIndent + e.unit,
		"TemplateString BlockComment": () => null,
		"Statement Property": /*@__PURE__*/ O({ except: /^\s*{/ }),
		JSXElement(e) {
			let t = /^\s*<\//.test(e.textAfter);
			return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
		},
		JSXEscape(e) {
			let t = /\s*\}/.test(e.textAfter);
			return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
		},
		"JSXOpenTag JSXSelfClosingTag"(e) {
			return e.column(e.node.from) + e.unit;
		}
	}), /*@__PURE__*/ x.add({
		"Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": De,
		BlockComment(e) {
			return {
				from: e.from + 2,
				to: e.to - 2
			};
		},
		JSXElement(e) {
			let t = e.firstChild;
			if (!t || t.name == "JSXSelfClosingTag") return null;
			let n = e.lastChild;
			return {
				from: t.to,
				to: n.type.isError ? e.to : n.from
			};
		},
		"JSXSelfClosingTag JSXOpenTag"(e) {
			let t = e.firstChild?.nextSibling, n = e.lastChild;
			return !t || t.type.isError ? null : {
				from: t.to,
				to: n.type.isError ? e.to : n.from
			};
		}
	})] }),
	languageData: {
		closeBrackets: { brackets: [
			"(",
			"[",
			"{",
			"'",
			"\"",
			"`"
		] },
		commentTokens: {
			line: "//",
			block: {
				open: "/*",
				close: "*/"
			}
		},
		indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
		wordChars: "$"
	}
}), ml = {
	test: (e) => /^JSX/.test(e.name),
	facet: /*@__PURE__*/ Ce({ commentTokens: { block: {
		open: "{/*",
		close: "*/}"
	} } })
}, hl = /*@__PURE__*/ K.configure({ dialect: "ts" }, "typescript"), gl = /*@__PURE__*/ K.configure({
	dialect: "jsx",
	props: [/*@__PURE__*/ p.add((e) => e.isTop ? [ml] : void 0)]
}), _l = /*@__PURE__*/ K.configure({
	dialect: "jsx ts",
	props: [/*@__PURE__*/ p.add((e) => e.isTop ? [ml] : void 0)]
}, "typescript"), vl = (e) => ({
	label: e,
	type: "keyword"
}), yl = /*@__PURE__*/ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(vl), bl = /*@__PURE__*/ yl.concat(/*@__PURE__*/ [
	"declare",
	"implements",
	"private",
	"protected",
	"public"
].map(vl));
function xl(e = {}) {
	let t = e.jsx ? e.typescript ? _l : gl : e.typescript ? hl : K, n = e.typescript ? il.concat(bl) : rl.concat(yl);
	return new E(t, [
		K.data.of({ autocomplete: ut(fl, lt(n)) }),
		K.data.of({ autocomplete: pl }),
		e.jsx ? Tl : []
	]);
}
function Sl(e) {
	for (;;) {
		if (e.name == "JSXOpenTag" || e.name == "JSXSelfClosingTag" || e.name == "JSXFragmentTag") return e;
		if (e.name == "JSXEscape" || !e.parent) return null;
		e = e.parent;
	}
}
function Cl(e, t, n = e.length) {
	for (let r = t?.firstChild; r; r = r.nextSibling) if (r.name == "JSXIdentifier" || r.name == "JSXBuiltin" || r.name == "JSXNamespacedName" || r.name == "JSXMemberExpression") return e.sliceString(r.from, Math.min(r.to, n));
	return "";
}
var wl = typeof navigator == "object" && /*@__PURE__*/ /Android\b/.test(navigator.userAgent), Tl = /*@__PURE__*/ b.inputHandler.of((e, t, n, r, i) => {
	if ((wl ? e.composing : e.compositionStarted) || e.state.readOnly || t != n || r != ">" && r != "/" || !K.isActiveAt(e.state, t, -1)) return !1;
	let a = i(), { state: o } = a, s = o.changeByRange((e) => {
		let { head: t } = e, n = y(o).resolveInner(t - 1, -1), i;
		if (n.name == "JSXStartTag" && (n = n.parent), !(o.doc.sliceString(t - 1, t) != r || n.name == "JSXAttributeValue" && n.to > t)) {
			if (r == ">" && n.name == "JSXFragmentTag") return {
				range: e,
				changes: {
					from: t,
					insert: "</>"
				}
			};
			if (r == "/" && n.name == "JSXStartCloseTag") {
				let e = n.parent, r = e.parent;
				if (r && e.from == t - 2 && ((i = Cl(o.doc, r.firstChild, t)) || r.firstChild?.name == "JSXFragmentTag")) {
					let e = `${i}>`;
					return {
						range: D.cursor(t + e.length, -1),
						changes: {
							from: t,
							insert: e
						}
					};
				}
			} else if (r == ">") {
				let r = Sl(n);
				if (r && r.name == "JSXOpenTag" && !/^\/?>|^<\//.test(o.doc.sliceString(t, t + 2)) && (i = Cl(o.doc, r, t))) return {
					range: e,
					changes: {
						from: t,
						insert: `</${i}>`
					}
				};
			}
		}
		return { range: e };
	});
	return s.changes.empty ? !1 : (e.dispatch([a, o.update(s, {
		userEvent: "input.complete",
		scrollIntoView: !0
	})]), !0);
}), El = [
	"_blank",
	"_self",
	"_top",
	"_parent"
], Dl = [
	"ascii",
	"utf-8",
	"utf-16",
	"latin1",
	"latin1"
], Ol = [
	"get",
	"post",
	"put",
	"delete"
], kl = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
], q = ["true", "false"], J = {}, Al = {
	a: { attrs: {
		href: null,
		ping: null,
		type: null,
		media: null,
		target: El,
		hreflang: null
	} },
	abbr: J,
	address: J,
	area: { attrs: {
		alt: null,
		coords: null,
		href: null,
		target: null,
		ping: null,
		media: null,
		hreflang: null,
		type: null,
		shape: [
			"default",
			"rect",
			"circle",
			"poly"
		]
	} },
	article: J,
	aside: J,
	audio: { attrs: {
		src: null,
		mediagroup: null,
		crossorigin: ["anonymous", "use-credentials"],
		preload: [
			"none",
			"metadata",
			"auto"
		],
		autoplay: ["autoplay"],
		loop: ["loop"],
		controls: ["controls"]
	} },
	b: J,
	base: { attrs: {
		href: null,
		target: El
	} },
	bdi: J,
	bdo: J,
	blockquote: { attrs: { cite: null } },
	body: J,
	br: J,
	button: { attrs: {
		form: null,
		formaction: null,
		name: null,
		value: null,
		autofocus: ["autofocus"],
		disabled: ["autofocus"],
		formenctype: kl,
		formmethod: Ol,
		formnovalidate: ["novalidate"],
		formtarget: El,
		type: [
			"submit",
			"reset",
			"button"
		]
	} },
	canvas: { attrs: {
		width: null,
		height: null
	} },
	caption: J,
	center: J,
	cite: J,
	code: J,
	col: { attrs: { span: null } },
	colgroup: { attrs: { span: null } },
	command: { attrs: {
		type: [
			"command",
			"checkbox",
			"radio"
		],
		label: null,
		icon: null,
		radiogroup: null,
		command: null,
		title: null,
		disabled: ["disabled"],
		checked: ["checked"]
	} },
	data: { attrs: { value: null } },
	datagrid: { attrs: {
		disabled: ["disabled"],
		multiple: ["multiple"]
	} },
	datalist: { attrs: { data: null } },
	dd: J,
	del: { attrs: {
		cite: null,
		datetime: null
	} },
	details: { attrs: { open: ["open"] } },
	dfn: J,
	div: J,
	dl: J,
	dt: J,
	em: J,
	embed: { attrs: {
		src: null,
		type: null,
		width: null,
		height: null
	} },
	eventsource: { attrs: { src: null } },
	fieldset: { attrs: {
		disabled: ["disabled"],
		form: null,
		name: null
	} },
	figcaption: J,
	figure: J,
	footer: J,
	form: { attrs: {
		action: null,
		name: null,
		"accept-charset": Dl,
		autocomplete: ["on", "off"],
		enctype: kl,
		method: Ol,
		novalidate: ["novalidate"],
		target: El
	} },
	h1: J,
	h2: J,
	h3: J,
	h4: J,
	h5: J,
	h6: J,
	head: { children: [
		"title",
		"base",
		"link",
		"style",
		"meta",
		"script",
		"noscript",
		"command"
	] },
	header: J,
	hgroup: J,
	hr: J,
	html: { attrs: { manifest: null } },
	i: J,
	iframe: { attrs: {
		src: null,
		srcdoc: null,
		name: null,
		width: null,
		height: null,
		sandbox: [
			"allow-top-navigation",
			"allow-same-origin",
			"allow-forms",
			"allow-scripts"
		],
		seamless: ["seamless"]
	} },
	img: { attrs: {
		alt: null,
		src: null,
		ismap: null,
		usemap: null,
		width: null,
		height: null,
		crossorigin: ["anonymous", "use-credentials"]
	} },
	input: { attrs: {
		alt: null,
		dirname: null,
		form: null,
		formaction: null,
		height: null,
		list: null,
		max: null,
		maxlength: null,
		min: null,
		name: null,
		pattern: null,
		placeholder: null,
		size: null,
		src: null,
		step: null,
		value: null,
		width: null,
		accept: [
			"audio/*",
			"video/*",
			"image/*"
		],
		autocomplete: ["on", "off"],
		autofocus: ["autofocus"],
		checked: ["checked"],
		disabled: ["disabled"],
		formenctype: kl,
		formmethod: Ol,
		formnovalidate: ["novalidate"],
		formtarget: El,
		multiple: ["multiple"],
		readonly: ["readonly"],
		required: ["required"],
		type: [
			"hidden",
			"text",
			"search",
			"tel",
			"url",
			"email",
			"password",
			"datetime",
			"date",
			"month",
			"week",
			"time",
			"datetime-local",
			"number",
			"range",
			"color",
			"checkbox",
			"radio",
			"file",
			"submit",
			"image",
			"reset",
			"button"
		]
	} },
	ins: { attrs: {
		cite: null,
		datetime: null
	} },
	kbd: J,
	keygen: { attrs: {
		challenge: null,
		form: null,
		name: null,
		autofocus: ["autofocus"],
		disabled: ["disabled"],
		keytype: ["RSA"]
	} },
	label: { attrs: {
		for: null,
		form: null
	} },
	legend: J,
	li: { attrs: { value: null } },
	link: { attrs: {
		href: null,
		type: null,
		hreflang: null,
		media: null,
		sizes: [
			"all",
			"16x16",
			"16x16 32x32",
			"16x16 32x32 64x64"
		]
	} },
	map: { attrs: { name: null } },
	mark: J,
	menu: { attrs: {
		label: null,
		type: [
			"list",
			"context",
			"toolbar"
		]
	} },
	meta: { attrs: {
		content: null,
		charset: Dl,
		name: [
			"viewport",
			"application-name",
			"author",
			"description",
			"generator",
			"keywords"
		],
		"http-equiv": [
			"content-language",
			"content-type",
			"default-style",
			"refresh"
		]
	} },
	meter: { attrs: {
		value: null,
		min: null,
		low: null,
		high: null,
		max: null,
		optimum: null
	} },
	nav: J,
	noscript: J,
	object: { attrs: {
		data: null,
		type: null,
		name: null,
		usemap: null,
		form: null,
		width: null,
		height: null,
		typemustmatch: ["typemustmatch"]
	} },
	ol: {
		attrs: {
			reversed: ["reversed"],
			start: null,
			type: [
				"1",
				"a",
				"A",
				"i",
				"I"
			]
		},
		children: [
			"li",
			"script",
			"template",
			"ul",
			"ol"
		]
	},
	optgroup: { attrs: {
		disabled: ["disabled"],
		label: null
	} },
	option: { attrs: {
		disabled: ["disabled"],
		label: null,
		selected: ["selected"],
		value: null
	} },
	output: { attrs: {
		for: null,
		form: null,
		name: null
	} },
	p: J,
	param: { attrs: {
		name: null,
		value: null
	} },
	pre: J,
	progress: { attrs: {
		value: null,
		max: null
	} },
	q: { attrs: { cite: null } },
	rp: J,
	rt: J,
	ruby: J,
	samp: J,
	script: { attrs: {
		type: ["text/javascript"],
		src: null,
		async: ["async"],
		defer: ["defer"],
		charset: Dl
	} },
	section: J,
	select: { attrs: {
		form: null,
		name: null,
		size: null,
		autofocus: ["autofocus"],
		disabled: ["disabled"],
		multiple: ["multiple"]
	} },
	slot: { attrs: { name: null } },
	small: J,
	source: { attrs: {
		src: null,
		type: null,
		media: null
	} },
	span: J,
	strong: J,
	style: { attrs: {
		type: ["text/css"],
		media: null,
		scoped: null
	} },
	sub: J,
	summary: J,
	sup: J,
	table: J,
	tbody: J,
	td: { attrs: {
		colspan: null,
		rowspan: null,
		headers: null
	} },
	template: J,
	textarea: { attrs: {
		dirname: null,
		form: null,
		maxlength: null,
		name: null,
		placeholder: null,
		rows: null,
		cols: null,
		autofocus: ["autofocus"],
		disabled: ["disabled"],
		readonly: ["readonly"],
		required: ["required"],
		wrap: ["soft", "hard"]
	} },
	tfoot: J,
	th: { attrs: {
		colspan: null,
		rowspan: null,
		headers: null,
		scope: [
			"row",
			"col",
			"rowgroup",
			"colgroup"
		]
	} },
	thead: J,
	time: { attrs: { datetime: null } },
	title: J,
	tr: J,
	track: { attrs: {
		src: null,
		label: null,
		default: null,
		kind: [
			"subtitles",
			"captions",
			"descriptions",
			"chapters",
			"metadata"
		],
		srclang: null
	} },
	ul: { children: [
		"li",
		"script",
		"template",
		"ul",
		"ol"
	] },
	var: J,
	video: { attrs: {
		src: null,
		poster: null,
		width: null,
		height: null,
		crossorigin: ["anonymous", "use-credentials"],
		preload: [
			"auto",
			"metadata",
			"none"
		],
		autoplay: ["autoplay"],
		mediagroup: ["movie"],
		muted: ["muted"],
		controls: ["controls"]
	} },
	wbr: J
}, jl = {
	accesskey: null,
	class: null,
	contenteditable: q,
	contextmenu: null,
	dir: [
		"ltr",
		"rtl",
		"auto"
	],
	draggable: [
		"true",
		"false",
		"auto"
	],
	dropzone: [
		"copy",
		"move",
		"link",
		"string:",
		"file:"
	],
	hidden: ["hidden"],
	id: null,
	inert: ["inert"],
	itemid: null,
	itemprop: null,
	itemref: null,
	itemscope: ["itemscope"],
	itemtype: null,
	lang: [
		"ar",
		"bn",
		"de",
		"en-GB",
		"en-US",
		"es",
		"fr",
		"hi",
		"id",
		"ja",
		"pa",
		"pt",
		"ru",
		"tr",
		"zh"
	],
	spellcheck: q,
	autocorrect: q,
	autocapitalize: q,
	style: null,
	tabindex: null,
	title: null,
	translate: ["yes", "no"],
	rel: [
		"stylesheet",
		"alternate",
		"author",
		"bookmark",
		"help",
		"license",
		"next",
		"nofollow",
		"noreferrer",
		"prefetch",
		"prev",
		"search",
		"tag"
	],
	role: /*@__PURE__*/ "alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),
	"aria-activedescendant": null,
	"aria-atomic": q,
	"aria-autocomplete": [
		"inline",
		"list",
		"both",
		"none"
	],
	"aria-busy": q,
	"aria-checked": [
		"true",
		"false",
		"mixed",
		"undefined"
	],
	"aria-controls": null,
	"aria-describedby": null,
	"aria-disabled": q,
	"aria-dropeffect": null,
	"aria-expanded": [
		"true",
		"false",
		"undefined"
	],
	"aria-flowto": null,
	"aria-grabbed": [
		"true",
		"false",
		"undefined"
	],
	"aria-haspopup": q,
	"aria-hidden": q,
	"aria-invalid": [
		"true",
		"false",
		"grammar",
		"spelling"
	],
	"aria-label": null,
	"aria-labelledby": null,
	"aria-level": null,
	"aria-live": [
		"off",
		"polite",
		"assertive"
	],
	"aria-multiline": q,
	"aria-multiselectable": q,
	"aria-owns": null,
	"aria-posinset": null,
	"aria-pressed": [
		"true",
		"false",
		"mixed",
		"undefined"
	],
	"aria-readonly": q,
	"aria-relevant": null,
	"aria-required": q,
	"aria-selected": [
		"true",
		"false",
		"undefined"
	],
	"aria-setsize": null,
	"aria-sort": [
		"ascending",
		"descending",
		"none",
		"other"
	],
	"aria-valuemax": null,
	"aria-valuemin": null,
	"aria-valuenow": null,
	"aria-valuetext": null
}, Ml = /*@__PURE__*/ "beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map((e) => "on" + e);
for (let e of Ml) jl[e] = null;
var Nl = class {
	constructor(e, t) {
		this.tags = {
			...Al,
			...e
		}, this.globalAttrs = {
			...jl,
			...t
		}, this.allTags = Object.keys(this.tags), this.globalAttrNames = Object.keys(this.globalAttrs);
	}
};
Nl.default = /*@__PURE__*/ new Nl();
function Pl(e, t, n = e.length) {
	if (!t) return "";
	let r = t.firstChild, i = r && r.getChild("TagName");
	return i ? e.sliceString(i.from, Math.min(i.to, n)) : "";
}
function Fl(e, t = !1) {
	for (; e; e = e.parent) if (e.name == "Element") if (t) t = !1;
	else return e;
	return null;
}
function Il(e, t, n) {
	return n.tags[Pl(e, Fl(t))]?.children || n.allTags;
}
function Ll(e, t) {
	let n = [];
	for (let r = Fl(t); r && !r.type.isTop; r = Fl(r.parent)) {
		let i = Pl(e, r);
		if (i && r.lastChild.name == "CloseTag") break;
		i && n.indexOf(i) < 0 && (t.name == "EndTag" || t.from >= r.firstChild.to) && n.push(i);
	}
	return n;
}
var Rl = /^[:\-\.\w\u00b7-\uffff]*$/;
function zl(e, t, n, r, i) {
	let a = /\s*>/.test(e.sliceDoc(i, i + 5)) ? "" : ">", o = Fl(n, n.name == "StartTag" || n.name == "TagName");
	return {
		from: r,
		to: i,
		options: Il(e.doc, o, t).map((e) => ({
			label: e,
			type: "type"
		})).concat(Ll(e.doc, n).map((e, t) => ({
			label: "/" + e,
			apply: "/" + e + a,
			type: "type",
			boost: 99 - t
		}))),
		validFor: /^\/?[:\-\.\w\u00b7-\uffff]*$/
	};
}
function Bl(e, t, n, r) {
	let i = /\s*>/.test(e.sliceDoc(r, r + 5)) ? "" : ">";
	return {
		from: n,
		to: r,
		options: Ll(e.doc, t).map((e, t) => ({
			label: e,
			apply: e + i,
			type: "type",
			boost: 99 - t
		})),
		validFor: Rl
	};
}
function Vl(e, t, n, r) {
	let i = [], a = 0;
	for (let r of Il(e.doc, n, t)) i.push({
		label: "<" + r,
		type: "type"
	});
	for (let t of Ll(e.doc, n)) i.push({
		label: "</" + t + ">",
		type: "type",
		boost: 99 - a++
	});
	return {
		from: r,
		to: r,
		options: i,
		validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/
	};
}
function Hl(e, t, n, r, i) {
	let a = Fl(n), o = a ? t.tags[Pl(e.doc, a)] : null, s = o && o.attrs ? Object.keys(o.attrs) : [];
	return {
		from: r,
		to: i,
		options: (o && o.globalAttrs === !1 ? s : s.length ? s.concat(t.globalAttrNames) : t.globalAttrNames).map((e) => ({
			label: e,
			type: "property"
		})),
		validFor: Rl
	};
}
function Ul(e, t, n, r, i) {
	let a = n.parent?.getChild("AttributeName"), o = [], s;
	if (a) {
		let c = e.sliceDoc(a.from, a.to), l = t.globalAttrs[c];
		if (!l) {
			let r = Fl(n), i = r ? t.tags[Pl(e.doc, r)] : null;
			l = i?.attrs && i.attrs[c];
		}
		if (l) {
			let t = e.sliceDoc(r, i).toLowerCase(), n = "\"", a = "\"";
			/^['"]/.test(t) ? (s = t[0] == "\"" ? /^[^"]*$/ : /^[^']*$/, n = "", a = e.sliceDoc(i, i + 1) == t[0] ? "" : t[0], t = t.slice(1), r++) : s = /^[^\s<>='"]*$/;
			for (let e of l) o.push({
				label: e,
				apply: n + e + a,
				type: "constant"
			});
		}
	}
	return {
		from: r,
		to: i,
		options: o,
		validFor: s
	};
}
function Wl(e, t) {
	let { state: n, pos: r } = t, i = y(n).resolveInner(r, -1), a = i.resolve(r);
	for (let e = r, t; a == i && (t = i.childBefore(e));) {
		let n = t.lastChild;
		if (!n || !n.type.isError || n.from < n.to) break;
		a = i = t, e = n.from;
	}
	return i.name == "TagName" ? i.parent && /CloseTag$/.test(i.parent.name) ? Bl(n, i, i.from, r) : zl(n, e, i, i.from, r) : i.name == "StartTag" || i.name == "IncompleteTag" ? zl(n, e, i, r, r) : i.name == "StartCloseTag" || i.name == "IncompleteCloseTag" ? Bl(n, i, r, r) : i.name == "OpenTag" || i.name == "SelfClosingTag" || i.name == "AttributeName" ? Hl(n, e, i, i.name == "AttributeName" ? i.from : r, r) : i.name == "Is" || i.name == "AttributeValue" || i.name == "UnquotedAttributeValue" ? Ul(n, e, i, i.name == "Is" ? r : i.from, r) : t.explicit && (a.name == "Element" || a.name == "Text" || a.name == "Document") ? Vl(n, e, i, r) : null;
}
function Gl(e) {
	return Wl(Nl.default, e);
}
function Kl(e) {
	let { extraTags: t, extraGlobalAttributes: n } = e, r = n || t ? new Nl(t, n) : Nl.default;
	return (e) => Wl(r, e);
}
var ql = /*@__PURE__*/ K.parser.configure({ top: "SingleExpression" }), Jl = [
	{
		tag: "script",
		attrs: (e) => e.type == "text/typescript" || e.lang == "ts",
		parser: hl.parser
	},
	{
		tag: "script",
		attrs: (e) => e.type == "text/babel" || e.type == "text/jsx",
		parser: gl.parser
	},
	{
		tag: "script",
		attrs: (e) => e.type == "text/typescript-jsx",
		parser: _l.parser
	},
	{
		tag: "script",
		attrs(e) {
			return /^(importmap|speculationrules|application\/(.+\+)?json)$/i.test(e.type);
		},
		parser: ql
	},
	{
		tag: "script",
		attrs(e) {
			return !e.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(e.type);
		},
		parser: K.parser
	},
	{
		tag: "style",
		attrs(e) {
			return (!e.lang || e.lang == "css") && (!e.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(e.type));
		},
		parser: ls.parser
	}
], Yl = /*@__PURE__*/ [{
	name: "style",
	parser: /*@__PURE__*/ ls.parser.configure({ top: "Styles" })
}].concat(/*@__PURE__*/ Ml.map((e) => ({
	name: e,
	parser: K.parser
}))), Xl = /*@__PURE__*/ Ue.define({
	name: "html",
	parser: /*@__PURE__*/ gc.configure({ props: [
		/*@__PURE__*/ Qe.add({
			Element(e) {
				let t = /^(\s*)(<\/)?/.exec(e.textAfter);
				return e.node.to <= e.pos + t[0].length ? e.continue() : e.lineIndent(e.node.from) + (t[2] ? 0 : e.unit);
			},
			"OpenTag CloseTag SelfClosingTag"(e) {
				return e.column(e.node.from) + e.unit;
			},
			Document(e) {
				if (e.pos + /\s*/.exec(e.textAfter)[0].length < e.node.to) return e.continue();
				let t = null, n;
				for (let n = e.node;;) {
					let e = n.lastChild;
					if (!e || e.name != "Element" || e.to != n.to) break;
					t = n = e;
				}
				return t && !((n = t.lastChild) && (n.name == "CloseTag" || n.name == "SelfClosingTag")) ? e.lineIndent(t.from) + e.unit : null;
			}
		}),
		/*@__PURE__*/ x.add({ Element(e) {
			let t = e.firstChild, n = e.lastChild;
			return !t || t.name != "OpenTag" ? null : {
				from: t.to,
				to: n.name == "CloseTag" ? n.from : e.to
			};
		} }),
		/*@__PURE__*/ Fe.add({ "OpenTag CloseTag": (e) => e.getChild("TagName") })
	] }),
	languageData: {
		commentTokens: { block: {
			open: "<!--",
			close: "-->"
		} },
		indentOnInput: /^\s*<\/\w+\W$/,
		wordChars: "-_"
	}
}), Zl = /*@__PURE__*/ Xl.configure({ wrap: /*@__PURE__*/ bc(Jl, Yl) });
function Ql(e = {}) {
	let t = "", n;
	return e.matchClosingTags === !1 && (t = "noMatch"), e.selfClosingTags === !0 && (t = (t ? t + " " : "") + "selfClosing"), (e.nestedLanguages && e.nestedLanguages.length || e.nestedAttributes && e.nestedAttributes.length) && (n = bc((e.nestedLanguages || []).concat(Jl), (e.nestedAttributes || []).concat(Yl))), new E(n ? Xl.configure({
		wrap: n,
		dialect: t
	}) : t ? Zl.configure({ dialect: t }) : Zl, [
		Zl.data.of({ autocomplete: Kl(e) }),
		e.autoCloseTags === !1 ? [] : eu,
		xl().support,
		us().support
	]);
}
var $l = /*@__PURE__*/ new Set(/*@__PURE__*/ "area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" ")), eu = /*@__PURE__*/ b.inputHandler.of((e, t, n, r, i) => {
	if (e.composing || e.state.readOnly || t != n || r != ">" && r != "/" || !Zl.isActiveAt(e.state, t, -1)) return !1;
	let a = i(), { state: o } = a, s = o.changeByRange((e) => {
		let t = o.doc.sliceString(e.from - 1, e.to) == r, { head: n } = e, i = y(o).resolveInner(n, -1), a;
		if (t && r == ">" && i.name == "EndTag") {
			let t = i.parent;
			if (t.parent?.lastChild?.name != "CloseTag" && (a = Pl(o.doc, t.parent, n)) && !$l.has(a)) return {
				range: e,
				changes: {
					from: n,
					to: n + +(o.doc.sliceString(n, n + 1) === ">"),
					insert: `</${a}>`
				}
			};
		} else if (t && r == "/" && i.name == "IncompleteCloseTag") {
			let e = i.parent;
			if (i.from == n - 2 && e.lastChild?.name != "CloseTag" && (a = Pl(o.doc, e, n)) && !$l.has(a)) {
				let e = n + +(o.doc.sliceString(n, n + 1) === ">"), t = `${a}>`;
				return {
					range: D.cursor(n + t.length, -1),
					changes: {
						from: n,
						to: e,
						insert: t
					}
				};
			}
		}
		return { range: e };
	});
	return s.changes.empty ? !1 : (e.dispatch([a, o.update(s, {
		userEvent: "input.complete",
		scrollIntoView: !0
	})]), !0);
}), tu = T({
	String: v.string,
	Number: v.number,
	"True False": v.bool,
	PropertyName: v.propertyName,
	Null: v.null,
	", :": v.separator,
	"[ ]": v.squareBracket,
	"{ }": v.brace
}), nu = uo.deserialize({
	version: 14,
	states: "$bOVQPOOOOQO'#Cb'#CbOnQPO'#CeOvQPO'#ClOOQO'#Cr'#CrQOQPOOOOQO'#Cg'#CgO}QPO'#CfO!SQPO'#CtOOQO,59P,59PO![QPO,59PO!aQPO'#CuOOQO,59W,59WO!iQPO,59WOVQPO,59QOqQPO'#CmO!nQPO,59`OOQO1G.k1G.kOVQPO'#CnO!vQPO,59aOOQO1G.r1G.rOOQO1G.l1G.lOOQO,59X,59XOOQO-E6k-E6kOOQO,59Y,59YOOQO-E6l-E6l",
	stateData: "#O~OeOS~OQSORSOSSOTSOWQO_ROgPO~OVXOgUO~O^[O~PVO[^O~O]_OVhX~OVaO~O]bO^iX~O^dO~O]_OVha~O]bO^ia~O",
	goto: "!kjPPPPPPkPPkqwPPPPk{!RPPP!XP!e!hXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",
	nodeNames: "⚠ JsonText True False Null Number String } { Object Property PropertyName : , ] [ Array",
	maxTerm: 25,
	nodeProps: [
		[
			"isolate",
			-2,
			6,
			11,
			""
		],
		[
			"openedBy",
			7,
			"{",
			14,
			"["
		],
		[
			"closedBy",
			8,
			"}",
			15,
			"]"
		]
	],
	propSources: [tu],
	skippedNodes: [0],
	repeatNodeCount: 2,
	tokenData: "(|~RaXY!WYZ!W]^!Wpq!Wrs!]|}$u}!O$z!Q!R%T!R![&c![!]&t!}#O&y#P#Q'O#Y#Z'T#b#c'r#h#i(Z#o#p(r#q#r(w~!]Oe~~!`Wpq!]qr!]rs!xs#O!]#O#P!}#P;'S!];'S;=`$o<%lO!]~!}Og~~#QXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#m~#pR!Q![#y!c!i#y#T#Z#y~#|R!Q![$V!c!i$V#T#Z$V~$YR!Q![$c!c!i$c#T#Z$c~$fR!Q![!]!c!i!]#T#Z!]~$rP;=`<%l!]~$zO]~~$}Q!Q!R%T!R![&c~%YRT~!O!P%c!g!h%w#X#Y%w~%fP!Q![%i~%nRT~!Q![%i!g!h%w#X#Y%w~%zR{|&T}!O&T!Q![&Z~&WP!Q![&Z~&`PT~!Q![&Z~&hST~!O!P%c!Q![&c!g!h%w#X#Y%w~&yO[~~'OO_~~'TO^~~'WP#T#U'Z~'^P#`#a'a~'dP#g#h'g~'jP#X#Y'm~'rOR~~'uP#i#j'x~'{P#`#a(O~(RP#`#a(U~(ZOS~~(^P#f#g(a~(dP#i#j(g~(jP#X#Y(m~(rOQ~~(wOW~~(|OV~",
	tokenizers: [0],
	topRules: { JsonText: [0, 1] },
	tokenPrec: 0
}), ru = /*@__PURE__*/ Ue.define({
	name: "json",
	parser: /*@__PURE__*/ nu.configure({ props: [/*@__PURE__*/ Qe.add({
		Object: /*@__PURE__*/ O({ except: /^\s*\}/ }),
		Array: /*@__PURE__*/ O({ except: /^\s*\]/ })
	}), /*@__PURE__*/ x.add({ "Object Array": De })] }),
	languageData: {
		closeBrackets: { brackets: [
			"[",
			"{",
			"\""
		] },
		indentOnInput: /^\s*[\}\]]$/
	}
});
function iu() {
	return new E(ru);
}
//#endregion
//#region ../node_modules/.pnpm/@lezer+markdown@1.7.2/node_modules/@lezer/markdown/dist/index.js
var au = class e {
	static create(t, n, r, i, a) {
		let o = i + (i << 8) + t + (n << 4) | 0;
		return new e(t, n, r, o, a, [], []);
	}
	constructor(e, t, n, r, i, a, o) {
		this.type = e, this.value = t, this.from = n, this.hash = r, this.end = i, this.children = a, this.positions = o, this.hashProp = [[h.contextHash, r]];
	}
	addChild(e, t) {
		e.prop(h.contextHash) != this.hash && (e = new c(e.type, e.children, e.positions, e.length, this.hashProp)), this.children.push(e), this.positions.push(t);
	}
	toTree(e, t = this.end) {
		let n = this.children.length - 1;
		return n >= 0 && (t = Math.max(t, this.positions[n] + this.children[n].length + this.from)), new c(e.types[this.type], this.children, this.positions, t - this.from).balance({ makeTree: (e, t, n) => new c(re.none, e, t, n, this.hashProp) });
	}
}, Y;
(function(e) {
	e[e.Document = 1] = "Document", e[e.CodeBlock = 2] = "CodeBlock", e[e.FencedCode = 3] = "FencedCode", e[e.Blockquote = 4] = "Blockquote", e[e.HorizontalRule = 5] = "HorizontalRule", e[e.BulletList = 6] = "BulletList", e[e.OrderedList = 7] = "OrderedList", e[e.ListItem = 8] = "ListItem", e[e.ATXHeading1 = 9] = "ATXHeading1", e[e.ATXHeading2 = 10] = "ATXHeading2", e[e.ATXHeading3 = 11] = "ATXHeading3", e[e.ATXHeading4 = 12] = "ATXHeading4", e[e.ATXHeading5 = 13] = "ATXHeading5", e[e.ATXHeading6 = 14] = "ATXHeading6", e[e.SetextHeading1 = 15] = "SetextHeading1", e[e.SetextHeading2 = 16] = "SetextHeading2", e[e.HTMLBlock = 17] = "HTMLBlock", e[e.LinkReference = 18] = "LinkReference", e[e.Paragraph = 19] = "Paragraph", e[e.CommentBlock = 20] = "CommentBlock", e[e.ProcessingInstructionBlock = 21] = "ProcessingInstructionBlock", e[e.Escape = 22] = "Escape", e[e.Entity = 23] = "Entity", e[e.HardBreak = 24] = "HardBreak", e[e.Emphasis = 25] = "Emphasis", e[e.StrongEmphasis = 26] = "StrongEmphasis", e[e.Link = 27] = "Link", e[e.Image = 28] = "Image", e[e.InlineCode = 29] = "InlineCode", e[e.HTMLTag = 30] = "HTMLTag", e[e.Comment = 31] = "Comment", e[e.ProcessingInstruction = 32] = "ProcessingInstruction", e[e.Autolink = 33] = "Autolink", e[e.HeaderMark = 34] = "HeaderMark", e[e.QuoteMark = 35] = "QuoteMark", e[e.ListMark = 36] = "ListMark", e[e.LinkMark = 37] = "LinkMark", e[e.EmphasisMark = 38] = "EmphasisMark", e[e.CodeMark = 39] = "CodeMark", e[e.CodeText = 40] = "CodeText", e[e.CodeInfo = 41] = "CodeInfo", e[e.LinkTitle = 42] = "LinkTitle", e[e.LinkLabel = 43] = "LinkLabel", e[e.URL = 44] = "URL";
})(Y ||= {});
var ou = class {
	constructor(e, t) {
		this.start = e, this.content = t, this.marks = [], this.parsers = [];
	}
}, su = class {
	constructor() {
		this.text = "", this.baseIndent = 0, this.basePos = 0, this.depth = 0, this.markers = [], this.pos = 0, this.indent = 0, this.next = -1;
	}
	forward() {
		this.basePos > this.pos && this.forwardInner();
	}
	forwardInner() {
		let e = this.skipSpace(this.basePos);
		this.indent = this.countIndent(e, this.pos, this.indent), this.pos = e, this.next = e == this.text.length ? -1 : this.text.charCodeAt(e);
	}
	skipSpace(e) {
		return uu(this.text, e);
	}
	reset(e) {
		for (this.text = e, this.baseIndent = this.basePos = this.pos = this.indent = 0, this.forwardInner(), this.depth = 1; this.markers.length;) this.markers.pop();
	}
	moveBase(e) {
		this.basePos = e, this.baseIndent = this.countIndent(e, this.pos, this.indent);
	}
	moveBaseColumn(e) {
		this.baseIndent = e, this.basePos = this.findColumn(e);
	}
	addMarker(e) {
		this.markers.push(e);
	}
	countIndent(e, t = 0, n = 0) {
		for (let r = t; r < e; r++) n += this.text.charCodeAt(r) == 9 ? 4 - n % 4 : 1;
		return n;
	}
	findColumn(e) {
		let t = 0;
		for (let n = 0; t < this.text.length && n < e; t++) n += this.text.charCodeAt(t) == 9 ? 4 - n % 4 : 1;
		return t;
	}
	scrub() {
		if (!this.baseIndent) return this.text;
		let e = "";
		for (let t = 0; t < this.basePos; t++) e += " ";
		return e + this.text.slice(this.basePos);
	}
};
function cu(e, t, n) {
	if (n.pos == n.text.length || e != t.block && n.indent >= t.stack[n.depth + 1].value + n.baseIndent) return !0;
	if (n.indent >= n.baseIndent + 4) return !1;
	let r = (e.type == Y.OrderedList ? _u : gu)(n, t, !1);
	return r > 0 && (e.type != Y.BulletList || mu(n, t, !1) < 0) && n.text.charCodeAt(n.pos + r - 1) == e.value;
}
var lu = {
	[Y.Blockquote](e, t, n) {
		return n.next == 62 ? (n.markers.push(Q(Y.QuoteMark, t.lineStart + n.pos, t.lineStart + n.pos + 1)), n.moveBase(n.pos + (X(n.text.charCodeAt(n.pos + 1)) ? 2 : 1)), e.end = t.lineStart + n.text.length, !0) : !1;
	},
	[Y.ListItem](e, t, n) {
		return n.indent < n.baseIndent + e.value && n.next > -1 ? !1 : (n.moveBaseColumn(n.baseIndent + e.value), !0);
	},
	[Y.OrderedList]: cu,
	[Y.BulletList]: cu,
	[Y.Document]() {
		return !0;
	}
};
function X(e) {
	return e == 32 || e == 9 || e == 10 || e == 13;
}
function uu(e, t = 0) {
	for (; t < e.length && X(e.charCodeAt(t));) t++;
	return t;
}
function du(e, t, n) {
	for (; t > n && X(e.charCodeAt(t - 1));) t--;
	return t;
}
function fu(e) {
	if (e.next != 96 && e.next != 126) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
	if (t < e.pos + 3) return -1;
	if (e.next == 96) {
		for (let n = t; n < e.text.length; n++) if (e.text.charCodeAt(n) == 96) return -1;
	}
	return t;
}
function pu(e) {
	return e.next == 62 ? e.text.charCodeAt(e.pos + 1) == 32 ? 2 : 1 : -1;
}
function mu(e, t, n) {
	if (e.next != 42 && e.next != 45 && e.next != 95) return -1;
	let r = 1;
	for (let t = e.pos + 1; t < e.text.length; t++) {
		let n = e.text.charCodeAt(t);
		if (n == e.next) r++;
		else if (!X(n)) return -1;
	}
	return n && e.next == 45 && yu(e) > -1 && e.depth == t.stack.length && t.parser.leafBlockParsers.indexOf(Au.SetextHeading) > -1 || r < 3 ? -1 : 1;
}
function hu(e, t) {
	for (let n = e.stack.length - 1; n >= 0; n--) if (e.stack[n].type == t) return !0;
	return !1;
}
function gu(e, t, n) {
	return (e.next == 45 || e.next == 43 || e.next == 42) && (e.pos == e.text.length - 1 || X(e.text.charCodeAt(e.pos + 1))) && (!n || hu(t, Y.BulletList) || e.skipSpace(e.pos + 2) < e.text.length) ? 1 : -1;
}
function _u(e, t, n) {
	let r = e.pos, i = e.next;
	for (; i >= 48 && i <= 57;) {
		if (r++, r == e.text.length) return -1;
		i = e.text.charCodeAt(r);
	}
	return r == e.pos || r > e.pos + 9 || i != 46 && i != 41 || r < e.text.length - 1 && !X(e.text.charCodeAt(r + 1)) || n && !hu(t, Y.OrderedList) && (e.skipSpace(r + 1) == e.text.length || r > e.pos + 1 || e.next != 49) ? -1 : r + 1 - e.pos;
}
function vu(e) {
	if (e.next != 35) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == 35;) t++;
	if (t < e.text.length && e.text.charCodeAt(t) != 32) return -1;
	let n = t - e.pos;
	return n > 6 ? -1 : n;
}
function yu(e) {
	if (e.next != 45 && e.next != 61 || e.indent >= e.baseIndent + 4) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
	let n = t;
	for (; t < e.text.length && X(e.text.charCodeAt(t));) t++;
	return t == e.text.length ? n : -1;
}
var bu = /^[ \t]*$/, xu = /-->/, Su = /\?>/, Cu = [
	[/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
	[/^\s*<!--/, xu],
	[/^\s*<\?/, Su],
	[/^\s*<![A-Z]/, />/],
	[/^\s*<!\[CDATA\[/, /\]\]>/],
	[/^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i, bu],
	[/^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i, bu]
];
function wu(e, t, n) {
	if (e.next != 60) return -1;
	let r = e.text.slice(e.pos);
	for (let e = 0, t = Cu.length - +!!n; e < t; e++) if (Cu[e][0].test(r)) return e;
	return -1;
}
function Tu(e, t) {
	let n = e.countIndent(t, e.pos, e.indent), r = e.skipSpace(t), i = e.countIndent(r, t, n);
	return i >= n + 5 || r == e.text.length ? n + 1 : i;
}
function Z(e, t, n) {
	let r = e.length - 1;
	r >= 0 && e[r].to == t && e[r].type == Y.CodeText ? e[r].to = n : e.push(Q(Y.CodeText, t, n));
}
var Eu = {
	LinkReference: void 0,
	IndentedCode(e, t) {
		let n = t.baseIndent + 4;
		if (t.indent < n) return !1;
		let r = t.findColumn(n), i = e.lineStart + r, a = e.lineStart + t.text.length, o = [], s = [];
		for (Z(o, i, a); e.nextLine() && t.depth >= e.stack.length;) if (t.pos == t.text.length) {
			Z(s, e.lineStart - 1, e.lineStart);
			for (let e of t.markers) s.push(e);
		} else if (t.indent < n) break;
		else {
			if (s.length) {
				for (let e of s) e.type == Y.CodeText ? Z(o, e.from, e.to) : o.push(e);
				s = [];
			}
			Z(o, e.lineStart - 1, e.lineStart);
			for (let e of t.markers) o.push(e);
			a = e.lineStart + t.text.length;
			let n = e.lineStart + t.findColumn(t.baseIndent + 4);
			n < a && Z(o, n, a);
		}
		return s.length && (s = s.filter((e) => e.type != Y.CodeText), s.length && (t.markers = s.concat(t.markers))), e.addNode(e.buffer.writeElements(o, -i).finish(Y.CodeBlock, a - i), i), !0;
	},
	FencedCode(e, t) {
		let n = fu(t);
		if (n < 0) return !1;
		let r = e.lineStart + t.pos, i = t.next, a = n - t.pos, o = t.skipSpace(n), s = du(t.text, t.text.length, o), c = [Q(Y.CodeMark, r, r + a)];
		o < s && c.push(Q(Y.CodeInfo, e.lineStart + o, e.lineStart + s));
		for (let n = !0, r = !0, o = !1; e.nextLine() && t.depth >= e.stack.length; n = !1) {
			let s = t.pos;
			if (t.indent - t.baseIndent < 4) for (; s < t.text.length && t.text.charCodeAt(s) == i;) s++;
			if (s - t.pos >= a && t.skipSpace(s) == t.text.length) {
				for (let e of t.markers) c.push(e);
				r && o && Z(c, e.lineStart - 1, e.lineStart), c.push(Q(Y.CodeMark, e.lineStart + t.pos, e.lineStart + s)), e.nextLine();
				break;
			} else {
				o = !0, n || (Z(c, e.lineStart - 1, e.lineStart), r = !1);
				for (let e of t.markers) c.push(e);
				let i = e.lineStart + t.basePos, a = e.lineStart + t.text.length;
				i < a && (Z(c, i, a), r = !1);
			}
		}
		return e.addNode(e.buffer.writeElements(c, -r).finish(Y.FencedCode, e.prevLineEnd() - r), r), !0;
	},
	Blockquote(e, t) {
		let n = pu(t);
		return n < 0 ? !1 : (e.startContext(Y.Blockquote, t.pos), e.addNode(Y.QuoteMark, e.lineStart + t.pos, e.lineStart + t.pos + 1), t.moveBase(t.pos + n), null);
	},
	HorizontalRule(e, t) {
		if (mu(t, e, !1) < 0) return !1;
		let n = e.lineStart + t.pos;
		return e.nextLine(), e.addNode(Y.HorizontalRule, n), !0;
	},
	BulletList(e, t) {
		let n = gu(t, e, !1);
		if (n < 0) return !1;
		e.block.type != Y.BulletList && e.startContext(Y.BulletList, t.basePos, t.next);
		let r = Tu(t, t.pos + 1);
		return e.startContext(Y.ListItem, t.basePos, r - t.baseIndent), e.addNode(Y.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n), t.moveBaseColumn(r), null;
	},
	OrderedList(e, t) {
		let n = _u(t, e, !1);
		if (n < 0) return !1;
		e.block.type != Y.OrderedList && e.startContext(Y.OrderedList, t.basePos, t.text.charCodeAt(t.pos + n - 1));
		let r = Tu(t, t.pos + n);
		return e.startContext(Y.ListItem, t.basePos, r - t.baseIndent), e.addNode(Y.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n), t.moveBaseColumn(r), null;
	},
	ATXHeading(e, t) {
		let n = vu(t);
		if (n < 0) return !1;
		let r = t.pos, i = e.lineStart + r, a = du(t.text, t.text.length, r), o = a;
		for (; o > r && t.text.charCodeAt(o - 1) == t.next;) o--;
		(o == a || o == r || !X(t.text.charCodeAt(o - 1))) && (o = t.text.length);
		let s = e.buffer.write(Y.HeaderMark, 0, n).writeElements(e.parser.parseInline(t.text.slice(r + n + 1, o), i + n + 1), -i);
		o < t.text.length && s.write(Y.HeaderMark, o - r, a - r);
		let c = s.finish(Y.ATXHeading1 - 1 + n, t.text.length - r);
		return e.nextLine(), e.addNode(c, i), !0;
	},
	HTMLBlock(e, t) {
		let n = wu(t, e, !1);
		if (n < 0) return !1;
		let r = e.lineStart + t.pos, i = Cu[n][1], a = [], o = i != bu;
		for (; !i.test(t.text) && e.nextLine();) {
			if (t.depth < e.stack.length) {
				o = !1;
				break;
			}
			for (let e of t.markers) a.push(e);
		}
		o && e.nextLine();
		let s = i == xu ? Y.CommentBlock : i == Su ? Y.ProcessingInstructionBlock : Y.HTMLBlock, c = e.prevLineEnd();
		return e.addNode(e.buffer.writeElements(a, -r).finish(s, c - r), r), !0;
	},
	SetextHeading: void 0
}, Du = class {
	constructor(e) {
		this.stage = 0, this.elts = [], this.pos = 0, this.start = e.start, this.advance(e.content);
	}
	nextLine(e, t, n) {
		if (this.stage == -1) return !1;
		let r = n.content + "\n" + t.scrub(), i = this.advance(r);
		return i > -1 && i < r.length && this.complete(e, n, i);
	}
	finish(e, t) {
		return (this.stage == 2 || this.stage == 3) && uu(t.content, this.pos) == t.content.length && this.complete(e, t, t.content.length);
	}
	complete(e, t, n) {
		return e.addLeafElement(t, Q(Y.LinkReference, this.start, this.start + n, this.elts)), !0;
	}
	nextStage(e) {
		return e ? (this.pos = e.to - this.start, this.elts.push(e), this.stage++, !0) : (e === !1 && (this.stage = -1), !1);
	}
	advance(e) {
		for (;;) if (this.stage == -1) return -1;
		else if (this.stage == 0) {
			if (!this.nextStage(ed(e, this.pos, this.start, !0))) return -1;
			if (e.charCodeAt(this.pos) != 58) return this.stage = -1;
			this.elts.push(Q(Y.LinkMark, this.pos + this.start, this.pos + this.start + 1)), this.pos++;
		} else if (this.stage == 1) {
			if (!this.nextStage(Qu(e, uu(e, this.pos), this.start))) return -1;
		} else if (this.stage == 2) {
			let t = uu(e, this.pos), n = 0;
			if (t > this.pos) {
				let r = $u(e, t, this.start);
				if (r) {
					let t = Ou(e, r.to - this.start);
					t > 0 && (this.nextStage(r), n = t);
				}
			}
			return n ||= Ou(e, this.pos), n > 0 && n < e.length ? n : -1;
		} else return Ou(e, this.pos);
	}
};
function Ou(e, t) {
	for (; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n == 10) break;
		if (!X(n)) return -1;
	}
	return t;
}
var ku = class {
	nextLine(e, t, n) {
		let r = t.depth < e.stack.length ? -1 : yu(t), i = t.next;
		if (r < 0) return !1;
		let a = Q(Y.HeaderMark, e.lineStart + t.pos, e.lineStart + r);
		return e.nextLine(), e.addLeafElement(n, Q(i == 61 ? Y.SetextHeading1 : Y.SetextHeading2, n.start, e.prevLineEnd(), [...e.parser.parseInline(n.content, n.start), a])), !0;
	}
	finish() {
		return !1;
	}
}, Au = {
	LinkReference(e, t) {
		return t.content.charCodeAt(0) == 91 ? new Du(t) : null;
	},
	SetextHeading() {
		return new ku();
	}
}, ju = [
	(e, t) => vu(t) >= 0,
	(e, t) => fu(t) >= 0,
	(e, t) => pu(t) >= 0,
	(e, t) => gu(t, e, !0) >= 0,
	(e, t) => _u(t, e, !0) >= 0,
	(e, t) => mu(t, e, !0) >= 0,
	(e, t) => wu(t, e, !0) >= 0
], Mu = {
	text: "",
	end: 0
}, Nu = class {
	constructor(e, t, n, r) {
		this.parser = e, this.input = t, this.ranges = r, this.line = new su(), this.atEnd = !1, this.reusePlaceholders = /* @__PURE__ */ new Map(), this.stoppedAt = null, this.rangeI = 0, this.to = r[r.length - 1].to, this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = r[0].from, this.block = au.create(Y.Document, 0, this.lineStart, 0, 0), this.stack = [this.block], this.fragments = n.length ? new id(n, t) : null, this.readLine();
	}
	get parsedPos() {
		return this.absoluteLineStart;
	}
	advance() {
		if (this.stoppedAt != null && this.absoluteLineStart > this.stoppedAt) return this.finish();
		let { line: e } = this;
		for (;;) {
			for (let t = 0;;) {
				let n = e.depth < this.stack.length ? this.stack[this.stack.length - 1] : null;
				for (; t < e.markers.length && (!n || e.markers[t].from < n.end);) {
					let n = e.markers[t++];
					this.addNode(n.type, n.from, n.to);
				}
				if (!n) break;
				this.finishContext();
			}
			if (e.pos < e.text.length) break;
			if (!this.nextLine()) return this.finish();
		}
		if (this.fragments && this.reuseFragment(e.basePos)) return null;
		start: for (;;) {
			for (let t of this.parser.blockParsers) if (t) {
				let n = t(this, e);
				if (n != 0) {
					if (n == 1) return null;
					e.forward();
					continue start;
				}
			}
			break;
		}
		if (e.pos == e.text.length) return this.nextLine() ? null : this.finish();
		let t = new ou(this.lineStart + e.pos, e.text.slice(e.pos));
		for (let e of this.parser.leafBlockParsers) if (e) {
			let n = e(this, t);
			n && t.parsers.push(n);
		}
		lines: for (; this.nextLine() && e.pos != e.text.length;) {
			if (e.indent < e.baseIndent + 4) {
				for (let n of this.parser.endLeafBlock) if (n(this, e, t)) break lines;
			}
			for (let n of t.parsers) if (n.nextLine(this, e, t)) return null;
			t.content += "\n" + e.scrub();
			for (let n of e.markers) t.marks.push(n);
		}
		return this.finishLeaf(t), null;
	}
	stopAt(e) {
		if (this.stoppedAt != null && this.stoppedAt < e) throw RangeError("Can't move stoppedAt forward");
		this.stoppedAt = e;
	}
	reuseFragment(e) {
		if (!this.fragments.moveTo(this.absoluteLineStart + e, this.absoluteLineStart) || !this.fragments.matches(this.block.hash)) return !1;
		let t = this.fragments.takeNodes(this);
		return t ? (this.absoluteLineStart += t, this.lineStart = ad(this.absoluteLineStart, this.ranges), this.moveRangeI(), this.absoluteLineStart < this.to ? (this.lineStart++, this.absoluteLineStart++, this.readLine()) : (this.atEnd = !0, this.readLine()), !0) : !1;
	}
	get depth() {
		return this.stack.length;
	}
	parentType(e = this.depth - 1) {
		return this.parser.nodeSet.types[this.stack[e].type];
	}
	nextLine() {
		return this.lineStart += this.line.text.length, this.absoluteLineEnd >= this.to ? (this.absoluteLineStart = this.absoluteLineEnd, this.atEnd = !0, this.readLine(), !1) : (this.lineStart++, this.absoluteLineStart = this.absoluteLineEnd + 1, this.moveRangeI(), this.readLine(), !0);
	}
	peekLine() {
		return this.scanLine(this.absoluteLineEnd + 1).text;
	}
	moveRangeI() {
		for (; this.rangeI < this.ranges.length - 1 && this.absoluteLineStart >= this.ranges[this.rangeI].to;) this.rangeI++, this.absoluteLineStart = Math.max(this.absoluteLineStart, this.ranges[this.rangeI].from);
	}
	scanLine(e) {
		let t = Mu;
		if (t.end = e, e >= this.to) t.text = "";
		else if (t.text = this.lineChunkAt(e), t.end += t.text.length, this.ranges.length > 1) {
			let e = this.absoluteLineStart, n = this.rangeI;
			for (; this.ranges[n].to < t.end;) {
				n++;
				let r = this.ranges[n].from, i = this.lineChunkAt(r);
				t.end = r + i.length, t.text = t.text.slice(0, this.ranges[n - 1].to - e) + i, e = t.end - t.text.length;
			}
		}
		return t;
	}
	readLine() {
		let { line: e } = this, { text: t, end: n } = this.scanLine(this.absoluteLineStart);
		for (this.absoluteLineEnd = n, e.reset(t); e.depth < this.stack.length; e.depth++) {
			let t = this.stack[e.depth], n = this.parser.skipContextMarkup[t.type];
			if (!n) throw Error("Unhandled block context " + Y[t.type]);
			let r = this.line.markers.length;
			if (!n(t, this, e)) {
				this.line.markers.length > r && (t.end = this.line.markers[this.line.markers.length - 1].to), e.forward();
				break;
			}
			e.forward();
		}
	}
	lineChunkAt(e) {
		let t = this.input.chunk(e), n;
		if (this.input.lineChunks) n = t == "\n" ? "" : t;
		else {
			let e = t.indexOf("\n");
			n = e < 0 ? t : t.slice(0, e);
		}
		return e + n.length > this.to ? n.slice(0, this.to - e) : n;
	}
	prevLineEnd() {
		return this.atEnd ? this.lineStart : this.lineStart - 1;
	}
	startContext(e, t, n = 0) {
		this.block = au.create(e, n, this.lineStart + t, this.block.hash, this.lineStart + this.line.text.length), this.stack.push(this.block);
	}
	startComposite(e, t, n = 0) {
		this.startContext(this.parser.getNodeType(e), t, n);
	}
	addNode(e, t, n) {
		typeof e == "number" && (e = new c(this.parser.nodeSet.types[e], Bu, Bu, (n ?? this.prevLineEnd()) - t)), this.block.addChild(e, t - this.block.from);
	}
	addElement(e) {
		this.block.addChild(e.toTree(this.parser.nodeSet), e.from - this.block.from);
	}
	addLeafElement(e, t) {
		this.addNode(this.buffer.writeElements(nd(t.children, e.marks), -t.from).finish(t.type, t.to - t.from), t.from);
	}
	finishContext() {
		let e = this.stack.pop(), t = this.stack[this.stack.length - 1];
		t.addChild(e.toTree(this.parser.nodeSet), e.from - t.from), this.block = t;
	}
	finish() {
		for (; this.stack.length > 1;) this.finishContext();
		return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
	}
	addGaps(e) {
		return this.ranges.length > 1 ? Pu(this.ranges, 0, e.topNode, this.ranges[0].from, this.reusePlaceholders) : e;
	}
	finishLeaf(e) {
		for (let t of e.parsers) if (t.finish(this, e)) return;
		let t = nd(this.parser.parseInline(e.content, e.start), e.marks);
		this.addNode(this.buffer.writeElements(t, -e.start).finish(Y.Paragraph, e.content.length), e.start);
	}
	elt(e, t, n, r) {
		return typeof e == "string" ? Q(this.parser.getNodeType(e), t, n, r) : new Uu(e, t);
	}
	get buffer() {
		return new Vu(this.parser.nodeSet);
	}
};
function Pu(e, t, n, r, i) {
	let a = e[t].to, o = [], s = [], l = n.from + r;
	function u(n, i) {
		for (; i ? n >= a : n > a;) {
			let i = e[t + 1].from - a;
			r += i, n += i, t++, a = e[t].to;
		}
	}
	for (let c = n.firstChild; c; c = c.nextSibling) {
		u(c.from + r, !0);
		let n = c.from + r, d, f = i.get(c.tree);
		f ? d = f : c.to + r > a ? (d = Pu(e, t, c, r, i), u(c.to + r, !1)) : d = c.toTree(), o.push(d), s.push(n - l);
	}
	return u(n.to + r, !1), new c(n.type, o, s, n.to + r - l, n.tree ? n.tree.propValues : void 0);
}
var Fu = class e extends nt {
	constructor(e, t, n, r, i, a, o, s, c) {
		super(), this.nodeSet = e, this.blockParsers = t, this.leafBlockParsers = n, this.blockNames = r, this.endLeafBlock = i, this.skipContextMarkup = a, this.inlineParsers = o, this.inlineNames = s, this.wrappers = c, this.nodeTypes = Object.create(null);
		for (let t of e.types) this.nodeTypes[t.name] = t.id;
	}
	createParse(e, t, n) {
		let r = new Nu(this, e, t, n);
		for (let i of this.wrappers) r = i(r, e, t, n);
		return r;
	}
	configure(t) {
		let n = Lu(t);
		if (!n) return this;
		let { nodeSet: r, skipContextMarkup: i } = this, a = this.blockParsers.slice(), o = this.leafBlockParsers.slice(), c = this.blockNames.slice(), l = this.inlineParsers.slice(), u = this.inlineNames.slice(), d = this.endLeafBlock.slice(), f = this.wrappers;
		if (Iu(n.defineNodes)) {
			i = Object.assign({}, i);
			let e = r.types.slice(), t;
			for (let r of n.defineNodes) {
				let { name: n, block: a, composite: o, style: c } = typeof r == "string" ? { name: r } : r;
				if (e.some((e) => e.name == n)) continue;
				o && (i[e.length] = (e, t, n) => o(t, n, e.value));
				let l = e.length, u = o ? ["Block", "BlockContext"] : a ? l >= Y.ATXHeading1 && l <= Y.SetextHeading2 ? [
					"Block",
					"LeafBlock",
					"Heading"
				] : ["Block", "LeafBlock"] : void 0;
				e.push(re.define({
					id: l,
					name: n,
					props: u && [[h.group, u]]
				})), c && (t ||= {}, Array.isArray(c) || c instanceof s ? t[n] = c : Object.assign(t, c));
			}
			r = new ee(e), t && (r = r.extend(T(t)));
		}
		if (Iu(n.props) && (r = r.extend(...n.props)), Iu(n.remove)) for (let e of n.remove) {
			let t = this.blockNames.indexOf(e), n = this.inlineNames.indexOf(e);
			t > -1 && (a[t] = o[t] = void 0), n > -1 && (l[n] = void 0);
		}
		if (Iu(n.parseBlock)) for (let e of n.parseBlock) {
			let t = c.indexOf(e.name);
			if (t > -1) a[t] = e.parse, o[t] = e.leaf;
			else {
				let t = e.before ? Ru(c, e.before) : e.after ? Ru(c, e.after) + 1 : c.length - 1;
				a.splice(t, 0, e.parse), o.splice(t, 0, e.leaf), c.splice(t, 0, e.name);
			}
			e.endLeaf && d.push(e.endLeaf);
		}
		if (Iu(n.parseInline)) for (let e of n.parseInline) {
			let t = u.indexOf(e.name);
			if (t > -1) l[t] = e.parse;
			else {
				let t = e.before ? Ru(u, e.before) : e.after ? Ru(u, e.after) + 1 : u.length - 1;
				l.splice(t, 0, e.parse), u.splice(t, 0, e.name);
			}
		}
		return n.wrap && (f = f.concat(n.wrap)), new e(r, a, o, c, d, i, l, u, f);
	}
	getNodeType(e) {
		let t = this.nodeTypes[e];
		if (t == null) throw RangeError(`Unknown node type '${e}'`);
		return t;
	}
	parseInline(e, t) {
		let n = new td(this, e, t);
		outer: for (let e = t; e < n.end;) {
			let t = n.char(e);
			for (let r of this.inlineParsers) if (r) {
				let i = r(n, t, e);
				if (i >= 0) {
					e = i;
					continue outer;
				}
			}
			e++;
		}
		return n.resolveMarkers(0);
	}
};
function Iu(e) {
	return e != null && e.length > 0;
}
function Lu(e) {
	if (!Array.isArray(e)) return e;
	if (e.length == 0) return null;
	let t = Lu(e[0]);
	if (e.length == 1) return t;
	let n = Lu(e.slice(1));
	if (!n || !t) return t || n;
	let r = (e, t) => (e || Bu).concat(t || Bu), i = t.wrap, a = n.wrap;
	return {
		props: r(t.props, n.props),
		defineNodes: r(t.defineNodes, n.defineNodes),
		parseBlock: r(t.parseBlock, n.parseBlock),
		parseInline: r(t.parseInline, n.parseInline),
		remove: r(t.remove, n.remove),
		wrap: i ? a ? (e, t, n, r) => i(a(e, t, n, r), t, n, r) : i : a
	};
}
function Ru(e, t) {
	let n = e.indexOf(t);
	if (n < 0) throw RangeError(`Position specified relative to unknown parser ${t}`);
	return n;
}
var zu = [re.none];
for (let e = 1, t; t = Y[e]; e++) zu[e] = re.define({
	id: e,
	name: t,
	props: e >= Y.Escape ? [] : [[h.group, e in lu ? ["Block", "BlockContext"] : ["Block", "LeafBlock"]]],
	top: t == "Document"
});
var Bu = [], Vu = class {
	constructor(e) {
		this.nodeSet = e, this.content = [], this.nodes = [];
	}
	write(e, t, n, r = 0) {
		return this.content.push(e, t, n, 4 + r * 4), this;
	}
	writeElements(e, t = 0) {
		for (let n of e) n.writeTo(this, t);
		return this;
	}
	finish(e, t) {
		return c.build({
			buffer: this.content,
			nodeSet: this.nodeSet,
			reused: this.nodes,
			topID: e,
			length: t
		});
	}
}, Hu = class {
	constructor(e, t, n, r = Bu) {
		this.type = e, this.from = t, this.to = n, this.children = r;
	}
	writeTo(e, t) {
		let n = e.content.length;
		e.writeElements(this.children, t), e.content.push(this.type, this.from + t, this.to + t, e.content.length + 4 - n);
	}
	toTree(e) {
		return new Vu(e).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
	}
}, Uu = class {
	constructor(e, t) {
		this.tree = e, this.from = t;
	}
	get to() {
		return this.from + this.tree.length;
	}
	get type() {
		return this.tree.type.id;
	}
	get children() {
		return Bu;
	}
	writeTo(e, t) {
		e.nodes.push(this.tree), e.content.push(e.nodes.length - 1, this.from + t, this.to + t, -1);
	}
	toTree() {
		return this.tree;
	}
};
function Q(e, t, n, r) {
	return new Hu(e, t, n, r);
}
var Wu = {
	resolve: "Emphasis",
	mark: "EmphasisMark"
}, Gu = {
	resolve: "Emphasis",
	mark: "EmphasisMark"
}, Ku = {}, qu = {}, $ = class {
	constructor(e, t, n, r) {
		this.type = e, this.from = t, this.to = n, this.side = r;
	}
}, Ju = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~", Yu = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
	Yu = /* @__PURE__ */ RegExp("[\\p{S}|\\p{P}]", "u");
} catch {}
var Xu = {
	Escape(e, t, n) {
		if (t != 92 || n == e.end - 1) return -1;
		let r = e.char(n + 1);
		for (let t = 0; t < 32; t++) if (Ju.charCodeAt(t) == r) return e.append(Q(Y.Escape, n, n + 2));
		return -1;
	},
	Entity(e, t, n) {
		if (t != 38) return -1;
		let r = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(e.slice(n + 1, n + 31));
		return r ? e.append(Q(Y.Entity, n, n + 1 + r[0].length)) : -1;
	},
	InlineCode(e, t, n) {
		if (t != 96 || n && e.char(n - 1) == 96) return -1;
		let r = n + 1;
		for (; r < e.end && e.char(r) == 96;) r++;
		let i = r - n, a = 0;
		for (; r < e.end; r++) if (e.char(r) == 96) {
			if (a++, a == i && e.char(r + 1) != 96) return e.append(Q(Y.InlineCode, n, r + 1, [Q(Y.CodeMark, n, n + i), Q(Y.CodeMark, r + 1 - i, r + 1)]));
		} else a = 0;
		return -1;
	},
	HTMLTag(e, t, n) {
		if (t != 60 || n == e.end - 1) return -1;
		let r = e.slice(n + 1, e.end), i = /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(r);
		if (i) return e.append(Q(Y.Autolink, n, n + 1 + i[0].length, [
			Q(Y.LinkMark, n, n + 1),
			Q(Y.URL, n + 1, n + i[0].length),
			Q(Y.LinkMark, n + i[0].length, n + 1 + i[0].length)
		]));
		let a = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(r);
		if (a) return e.append(Q(Y.Comment, n, n + 1 + a[0].length));
		let o = /^\?[^]*?\?>/.exec(r);
		if (o) return e.append(Q(Y.ProcessingInstruction, n, n + 1 + o[0].length));
		let s = /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(r);
		return s ? e.append(Q(Y.HTMLTag, n, n + 1 + s[0].length)) : -1;
	},
	Emphasis(e, t, n) {
		if (t != 95 && t != 42) return -1;
		let r = n + 1;
		for (; e.char(r) == t;) r++;
		let i = e.slice(n - 1, n), a = e.slice(r, r + 1), o = Yu.test(i), s = Yu.test(a), c = /\s|^$/.test(i), l = /\s|^$/.test(a), u = !l && (!s || c || o), d = !c && (!o || l || s), f = u && (t == 42 || !d || o), p = d && (t == 42 || !u || s);
		return e.append(new $(t == 95 ? Wu : Gu, n, r, !!f | (p ? 2 : 0)));
	},
	HardBreak(e, t, n) {
		if (t == 92 && e.char(n + 1) == 10) return e.append(Q(Y.HardBreak, n, n + 2));
		if (t == 32) {
			let t = n + 1;
			for (; e.char(t) == 32;) t++;
			if (e.char(t) == 10 && t >= n + 2) return e.append(Q(Y.HardBreak, n, t + 1));
		}
		return -1;
	},
	Link(e, t, n) {
		return t == 91 ? e.append(new $(Ku, n, n + 1, 1)) : -1;
	},
	Image(e, t, n) {
		return t == 33 && e.char(n + 1) == 91 ? e.append(new $(qu, n, n + 2, 1)) : -1;
	},
	LinkEnd(e, t, n) {
		if (t != 93) return -1;
		for (let t = e.parts.length - 1; t >= 0; t--) {
			let r = e.parts[t];
			if (r instanceof $ && (r.type == Ku || r.type == qu)) {
				if (!r.side || e.skipSpace(r.to) == n && !/[(\[]/.test(e.slice(n + 1, n + 2))) return e.parts[t] = null, -1;
				let i = e.takeContent(t), a = e.parts[t] = Zu(e, i, r.type == Ku ? Y.Link : Y.Image, r.from, n + 1);
				if (r.type == Ku) for (let n = 0; n < t; n++) {
					let t = e.parts[n];
					t instanceof $ && t.type == Ku && (t.side = 0);
				}
				return a.to;
			}
		}
		return -1;
	}
};
function Zu(e, t, n, r, i) {
	let { text: a } = e, o = e.char(i), s = i;
	if (t.unshift(Q(Y.LinkMark, r, r + (n == Y.Image ? 2 : 1))), t.push(Q(Y.LinkMark, i - 1, i)), o == 40) {
		let n = e.skipSpace(i + 1), r = Qu(a, n - e.offset, e.offset), o;
		r && (n = e.skipSpace(r.to), n != r.to && (o = $u(a, n - e.offset, e.offset), o && (n = e.skipSpace(o.to)))), e.char(n) == 41 && (t.push(Q(Y.LinkMark, i, i + 1)), s = n + 1, r && t.push(r), o && t.push(o), t.push(Q(Y.LinkMark, n, s)));
	} else if (o == 91) {
		let n = ed(a, i - e.offset, e.offset, !1);
		n && (t.push(n), s = n.to);
	}
	return Q(n, r, s, t);
}
function Qu(e, t, n) {
	if (e.charCodeAt(t) == 60) {
		for (let r = t + 1; r < e.length; r++) {
			let i = e.charCodeAt(r);
			if (i == 62) return Q(Y.URL, t + n, r + 1 + n);
			if (i == 60 || i == 10) return !1;
		}
		return null;
	} else {
		let r = 0, i = t;
		for (let t = !1; i < e.length; i++) {
			let n = e.charCodeAt(i);
			if (X(n)) break;
			if (t) t = !1;
			else if (n == 40) r++;
			else if (n == 41) {
				if (!r) break;
				r--;
			} else n == 92 && (t = !0);
		}
		return i > t ? Q(Y.URL, t + n, i + n) : i == e.length && null;
	}
}
function $u(e, t, n) {
	let r = e.charCodeAt(t);
	if (r != 39 && r != 34 && r != 40) return !1;
	let i = r == 40 ? 41 : r;
	for (let r = t + 1, a = !1; r < e.length; r++) {
		let o = e.charCodeAt(r);
		if (a) a = !1;
		else if (o == i) return Q(Y.LinkTitle, t + n, r + 1 + n);
		else o == 92 && (a = !0);
	}
	return null;
}
function ed(e, t, n, r) {
	for (let i = !1, a = t + 1, o = Math.min(e.length, a + 999); a < o; a++) {
		let o = e.charCodeAt(a);
		if (i) i = !1;
		else if (o == 93) return !r && Q(Y.LinkLabel, t + n, a + 1 + n);
		else {
			if (r && !X(o) && (r = !1), o == 91) return !1;
			o == 92 && (i = !0);
		}
	}
	return null;
}
var td = class {
	constructor(e, t, n) {
		this.parser = e, this.text = t, this.offset = n, this.parts = [];
	}
	char(e) {
		return e >= this.end ? -1 : this.text.charCodeAt(e - this.offset);
	}
	get end() {
		return this.offset + this.text.length;
	}
	slice(e, t) {
		return this.text.slice(e - this.offset, t - this.offset);
	}
	append(e) {
		return this.parts.push(e), e.to;
	}
	addDelimiter(e, t, n, r, i) {
		return this.append(new $(e, t, n, !!r | (i ? 2 : 0)));
	}
	get hasOpenLink() {
		for (let e = this.parts.length - 1; e >= 0; e--) {
			let t = this.parts[e];
			if (t instanceof $ && (t.type == Ku || t.type == qu)) return !0;
		}
		return !1;
	}
	addElement(e) {
		return this.append(e);
	}
	resolveMarkers(e) {
		for (let t = e; t < this.parts.length; t++) {
			let n = this.parts[t];
			if (!(n instanceof $ && n.type.resolve && n.side & 2)) continue;
			let r = n.type == Wu || n.type == Gu, i = n.to - n.from, a, o = t - 1;
			for (; o >= e; o--) {
				let e = this.parts[o];
				if (e instanceof $ && e.side & 1 && e.type == n.type && !(r && (n.side & 1 || e.side & 2) && (e.to - e.from + i) % 3 == 0 && ((e.to - e.from) % 3 || i % 3))) {
					a = e;
					break;
				}
			}
			if (!a) continue;
			let s = n.type.resolve, c = [], l = a.from, u = n.to;
			if (r) {
				let e = Math.min(2, a.to - a.from, i);
				l = a.to - e, u = n.from + e, s = e == 1 ? "Emphasis" : "StrongEmphasis";
			}
			a.type.mark && c.push(this.elt(a.type.mark, l, a.to));
			for (let e = o + 1; e < t; e++) this.parts[e] instanceof Hu && c.push(this.parts[e]), this.parts[e] = null;
			n.type.mark && c.push(this.elt(n.type.mark, n.from, u));
			let d = this.elt(s, l, u, c);
			this.parts[o] = r && a.from != l ? new $(a.type, a.from, l, a.side) : null, (this.parts[t] = r && n.to != u ? new $(n.type, u, n.to, n.side) : null) ? this.parts.splice(t, 0, d) : this.parts[t] = d;
		}
		let t = [];
		for (let n = e; n < this.parts.length; n++) {
			let e = this.parts[n];
			e instanceof Hu && t.push(e);
		}
		return t;
	}
	findOpeningDelimiter(e) {
		for (let t = this.parts.length - 1; t >= 0; t--) {
			let n = this.parts[t];
			if (n instanceof $ && n.type == e && n.side & 1) return t;
		}
		return null;
	}
	takeContent(e) {
		let t = this.resolveMarkers(e);
		return this.parts.length = e, t;
	}
	getDelimiterAt(e) {
		let t = this.parts[e];
		return t instanceof $ ? t : null;
	}
	skipSpace(e) {
		return uu(this.text, e - this.offset) + this.offset;
	}
	elt(e, t, n, r) {
		return typeof e == "string" ? Q(this.parser.getNodeType(e), t, n, r) : new Uu(e, t);
	}
};
td.linkStart = Ku, td.imageStart = qu;
function nd(e, t) {
	if (!t.length) return e;
	if (!e.length) return t;
	let n = e.slice(), r = 0;
	for (let e of t) {
		for (; r < n.length && n[r].to < e.to;) r++;
		if (r < n.length && n[r].from < e.from) {
			let t = n[r];
			t instanceof Hu && (n[r] = new Hu(t.type, t.from, t.to, nd(t.children, [e])));
		} else n.splice(r++, 0, e);
	}
	return n;
}
var rd = [
	Y.CodeBlock,
	Y.ListItem,
	Y.OrderedList,
	Y.BulletList
], id = class {
	constructor(e, t) {
		this.fragments = e, this.input = t, this.i = 0, this.fragment = null, this.fragmentEnd = -1, this.cursor = null, e.length && (this.fragment = e[this.i++]);
	}
	nextFragment() {
		this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null, this.cursor = null, this.fragmentEnd = -1;
	}
	moveTo(e, t) {
		for (; this.fragment && this.fragment.to <= e;) this.nextFragment();
		if (!this.fragment || this.fragment.from > (e ? e - 1 : 0)) return !1;
		if (this.fragmentEnd < 0) {
			let e = this.fragment.to;
			for (; e > 0 && this.input.read(e - 1, e) != "\n";) e--;
			this.fragmentEnd = e ? e - 1 : 0;
		}
		let n = this.cursor;
		n || (n = this.cursor = this.fragment.tree.cursor(), n.firstChild());
		let r = e + this.fragment.offset;
		for (; n.to <= r;) if (!n.parent()) return !1;
		for (;;) {
			if (n.from >= r) return this.fragment.from <= t;
			if (!n.childAfter(r)) return !1;
		}
	}
	matches(e) {
		let t = this.cursor.tree;
		return t && t.prop(h.contextHash) == e;
	}
	takeNodes(e) {
		let t = this.cursor, n = this.fragment.offset, r = this.fragmentEnd - +!!this.fragment.openEnd, i = e.absoluteLineStart, a = i, o = e.block.children.length, s = a, l = o;
		for (;;) {
			if (t.to - n > r) {
				if (t.type.isAnonymous && t.firstChild()) continue;
				break;
			}
			let i = ad(t.from - n, e.ranges);
			if (t.to - n <= e.ranges[e.rangeI].to) e.addNode(t.tree, i);
			else {
				let n = new c(e.parser.nodeSet.types[Y.Paragraph], [], [], 0, e.block.hashProp);
				e.reusePlaceholders.set(n, t.tree), e.addNode(n, i);
			}
			if (t.type.is("Block") && (rd.indexOf(t.type.id) < 0 ? (a = t.to - n, o = e.block.children.length) : (a = s, o = l), s = t.to - n, l = e.block.children.length), !t.nextSibling()) break;
		}
		for (; e.block.children.length > o;) e.block.children.pop(), e.block.positions.pop();
		return a - i;
	}
};
function ad(e, t) {
	let n = e;
	for (let r = 1; r < t.length; r++) {
		let i = t[r - 1].to, a = t[r].from;
		i < e && (n -= a - i);
	}
	return n;
}
var od = T({
	"Blockquote/...": v.quote,
	HorizontalRule: v.contentSeparator,
	"ATXHeading1/... SetextHeading1/...": v.heading1,
	"ATXHeading2/... SetextHeading2/...": v.heading2,
	"ATXHeading3/...": v.heading3,
	"ATXHeading4/...": v.heading4,
	"ATXHeading5/...": v.heading5,
	"ATXHeading6/...": v.heading6,
	"Comment CommentBlock": v.comment,
	Escape: v.escape,
	Entity: v.character,
	"Emphasis/...": v.emphasis,
	"StrongEmphasis/...": v.strong,
	"Link/... Image/...": v.link,
	"OrderedList/... BulletList/...": v.list,
	"BlockQuote/...": v.quote,
	"InlineCode CodeText": v.monospace,
	"URL Autolink": v.url,
	"HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": v.processingInstruction,
	"CodeInfo LinkLabel": v.labelName,
	LinkTitle: v.string,
	Paragraph: v.content
}), sd = new Fu(new ee(zu).extend(od), Object.keys(Eu).map((e) => Eu[e]), Object.keys(Eu).map((e) => Au[e]), Object.keys(Eu), ju, lu, Object.keys(Xu).map((e) => Xu[e]), Object.keys(Xu), []);
function cd(e, t, n) {
	let r = [];
	for (let i = e.firstChild, a = t;; i = i.nextSibling) {
		let e = i ? i.from : n;
		if (e > a && r.push({
			from: a,
			to: e
		}), !i) break;
		a = i.to;
	}
	return r;
}
function ld(e) {
	let { codeParser: t, htmlParser: n } = e;
	return { wrap: me((e, r) => {
		let i = e.type.id;
		if (t && (i == Y.CodeBlock || i == Y.FencedCode)) {
			let n = "";
			if (i == Y.FencedCode) {
				let t = e.node.getChild(Y.CodeInfo);
				t && (n = r.read(t.from, t.to));
			}
			let a = t(n);
			if (a) return {
				parser: a,
				overlay: (e) => e.type.id == Y.CodeText,
				bracketed: i == Y.FencedCode
			};
		} else if (n && (i == Y.HTMLBlock || i == Y.HTMLTag || i == Y.CommentBlock)) return {
			parser: n,
			overlay: cd(e.node, e.from, e.to)
		};
		return null;
	}) };
}
var ud = {
	resolve: "Strikethrough",
	mark: "StrikethroughMark"
}, dd = {
	defineNodes: [{
		name: "Strikethrough",
		style: { "Strikethrough/...": v.strikethrough }
	}, {
		name: "StrikethroughMark",
		style: v.processingInstruction
	}],
	parseInline: [{
		name: "Strikethrough",
		parse(e, t, n) {
			if (t != 126 || e.char(n + 1) != 126 || e.char(n + 2) == 126) return -1;
			let r = e.slice(n - 1, n), i = e.slice(n + 2, n + 3), a = /\s|^$/.test(r), o = /\s|^$/.test(i), s = Yu.test(r), c = Yu.test(i);
			return e.addDelimiter(ud, n, n + 2, !o && (!c || a || s), !a && (!s || o || c));
		},
		after: "Emphasis"
	}]
};
function fd(e, t, n = 0, r, i = 0) {
	let a = 0, o = !0, s = -1, c = -1, l = !1, u = () => {
		r.push(e.elt("TableCell", i + s, i + c, e.parser.parseInline(t.slice(s, c), i + s)));
	};
	for (let d = n; d < t.length; d++) {
		let n = t.charCodeAt(d);
		n == 124 && !l ? ((!o || s > -1) && a++, o = !1, r && (s > -1 && u(), r.push(e.elt("TableDelimiter", d + i, d + i + 1))), s = c = -1) : (l || n != 32 && n != 9) && (s < 0 && (s = d), c = d + 1), l = !l && n == 92;
	}
	return s > -1 && (a++, r && u()), a;
}
function pd(e, t) {
	for (let n = t; n < e.length; n++) {
		let t = e.charCodeAt(n);
		if (t == 124) return !0;
		t == 92 && n++;
	}
	return !1;
}
var md = /^[>\s]*\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/, hd = class {
	constructor() {
		this.rows = null;
	}
	nextLine(e, t, n) {
		if (this.rows == null) {
			this.rows = !1;
			let r;
			if ((t.next == 45 || t.next == 58 || t.next == 124) && md.test(r = t.text.slice(t.pos))) {
				let i = [];
				fd(e, n.content, 0, i, n.start) == fd(e, r, 0) && (this.rows = [e.elt("TableHeader", n.start, n.start + n.content.length, i), e.elt("TableDelimiter", e.lineStart + t.pos, e.lineStart + t.text.length)]);
			}
		} else if (this.rows) {
			let n = [];
			fd(e, t.text, t.pos, n, e.lineStart), this.rows.push(e.elt("TableRow", e.lineStart + t.pos, e.lineStart + t.text.length, n));
		}
		return !1;
	}
	finish(e, t) {
		return this.rows ? (e.addLeafElement(t, e.elt("Table", t.start, t.start + t.content.length, this.rows)), !0) : !1;
	}
}, gd = {
	defineNodes: [
		{
			name: "Table",
			block: !0
		},
		{
			name: "TableHeader",
			style: { "TableHeader/...": v.heading }
		},
		"TableRow",
		{
			name: "TableCell",
			style: v.content
		},
		{
			name: "TableDelimiter",
			style: v.processingInstruction
		}
	],
	parseBlock: [{
		name: "Table",
		leaf(e, t) {
			return pd(t.content, 0) ? new hd() : null;
		},
		endLeaf(e, t, n) {
			if (n.parsers.some((e) => e instanceof hd) || !pd(t.text, t.basePos)) return !1;
			let r = e.peekLine();
			return md.test(r) && fd(e, t.text, t.basePos) == fd(e, r, t.basePos);
		},
		before: "SetextHeading"
	}]
}, _d = class {
	nextLine() {
		return !1;
	}
	finish(e, t) {
		return e.addLeafElement(t, e.elt("Task", t.start, t.start + t.content.length, [e.elt("TaskMarker", t.start, t.start + 3), ...e.parser.parseInline(t.content.slice(3), t.start + 3)])), !0;
	}
}, vd = {
	defineNodes: [{
		name: "Task",
		block: !0,
		style: v.list
	}, {
		name: "TaskMarker",
		style: v.atom
	}],
	parseBlock: [{
		name: "TaskList",
		leaf(e, t) {
			return /^\[[ xX]\][ \t]/.test(t.content) && e.parentType().name == "ListItem" ? new _d() : null;
		},
		after: "SetextHeading"
	}]
}, yd = /(www\.)|(https?:\/\/)|([\w.+-]{1,100}@)|(mailto:|xmpp:)/gy, bd = /[\w-]+(\.[\w-]+)+(:\d+)?(\/[^\s<]*)?/gy, xd = /[\w-]+\.[\w-]+($|[/:])/, Sd = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy, Cd = /\/[a-zA-Z\d@.]+/gy;
function wd(e, t, n, r) {
	let i = 0;
	for (let a = t; a < n; a++) e[a] == r && i++;
	return i;
}
function Td(e, t) {
	bd.lastIndex = t;
	let n = bd.exec(e);
	if (!n || xd.exec(n[0])[0].indexOf("_") > -1) return -1;
	let r = t + n[0].length;
	for (;;) {
		let n = e[r - 1], i;
		if (/[?!.,:*_~]/.test(n) || n == ")" && wd(e, t, r, ")") > wd(e, t, r, "(")) r--;
		else if (n == ";" && (i = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(e.slice(t, r)))) r = t + i.index;
		else break;
	}
	return r;
}
function Ed(e, t) {
	Sd.lastIndex = t;
	let n = Sd.exec(e);
	if (!n) return -1;
	let r = n[0][n[0].length - 1];
	return r == "_" || r == "-" ? -1 : t + n[0].length - +(r == ".");
}
var Dd = [
	gd,
	vd,
	dd,
	{ parseInline: [{
		name: "Autolink",
		parse(e, t, n) {
			let r = n - e.offset;
			if (r && /\w/.test(e.text[r - 1])) return -1;
			yd.lastIndex = r;
			let i = yd.exec(e.text), a = -1;
			return !i || (i[1] || i[2] ? (a = Td(e.text, r + i[0].length), a > -1 && e.hasOpenLink && (a = r + /([^\[\]]|\[[^\]]*\])*/.exec(e.text.slice(r, a))[0].length)) : i[3] ? a = Ed(e.text, r) : (a = Ed(e.text, r + i[0].length), a > -1 && i[0] == "xmpp:" && (Cd.lastIndex = a, i = Cd.exec(e.text), i && (a = i.index + i[0].length))), a < 0) ? -1 : (e.addElement(e.elt("URL", n, a + e.offset)), a + e.offset);
		}
	}] }
];
function Od(e, t, n) {
	return (r, i, a) => {
		if (i != e || r.char(a + 1) == e) return -1;
		let o = [r.elt(n, a, a + 1)];
		for (let i = a + 1; i < r.end; i++) {
			let s = r.char(i);
			if (s == e) return r.addElement(r.elt(t, a, i + 1, o.concat(r.elt(n, i, i + 1))));
			if (s == 92 && o.push(r.elt("Escape", i, i++ + 2)), X(s)) break;
		}
		return -1;
	};
}
var kd = {
	defineNodes: [{
		name: "Superscript",
		style: v.special(v.content)
	}, {
		name: "SuperscriptMark",
		style: v.processingInstruction
	}],
	parseInline: [{
		name: "Superscript",
		parse: Od(94, "Superscript", "SuperscriptMark")
	}]
}, Ad = {
	defineNodes: [{
		name: "Subscript",
		style: v.special(v.content)
	}, {
		name: "SubscriptMark",
		style: v.processingInstruction
	}],
	parseInline: [{
		name: "Subscript",
		parse: Od(126, "Subscript", "SubscriptMark")
	}]
}, jd = {
	defineNodes: [{
		name: "Emoji",
		style: v.character
	}],
	parseInline: [{
		name: "Emoji",
		parse(e, t, n) {
			let r;
			return t != 58 || !(r = /^[a-zA-Z_0-9]+:/.exec(e.slice(n + 1, e.end))) ? -1 : e.addElement(e.elt("Emoji", n, n + 1 + r[0].length));
		}
	}]
}, Md = /*@__PURE__*/ Ce({ commentTokens: { block: {
	open: "<!--",
	close: "-->"
} } }), Nd = /*@__PURE__*/ new h(), Pd = /*@__PURE__*/ sd.configure({ props: [
	/*@__PURE__*/ x.add((e) => !e.is("Block") || e.is("Document") || Fd(e) != null || Id(e) ? void 0 : (e, t) => ({
		from: t.doc.lineAt(e.from).to,
		to: e.to
	})),
	/*@__PURE__*/ Nd.add(Fd),
	/*@__PURE__*/ Qe.add({ Document: () => null }),
	/*@__PURE__*/ Ze.add({ Document: Md })
] });
function Fd(e) {
	let t = /^(?:ATX|Setext)Heading(\d)$/.exec(e.name);
	return t ? +t[1] : void 0;
}
function Id(e) {
	return e.name == "OrderedList" || e.name == "BulletList";
}
function Ld(e, t) {
	let n = e;
	for (;;) {
		let e = n.nextSibling, r;
		if (!e || (r = Fd(e.type)) != null && r <= t) break;
		n = e;
	}
	return n.to;
}
var Rd = /*@__PURE__*/ Ye.of((e, t, n) => {
	for (let r = y(e).resolveInner(n, -1); r && !(r.from < t); r = r.parent) {
		let e = r.type.prop(Nd);
		if (e == null) continue;
		let t = Ld(r, e);
		if (t > n) return {
			from: n,
			to: t
		};
	}
	return null;
});
function zd(e) {
	return new je(Md, e, [], "markdown");
}
var Bd = /*@__PURE__*/ zd(Pd), Vd = /*@__PURE__*/ zd(/* @__PURE__ */ Pd.configure([
	Dd,
	Ad,
	kd,
	jd,
	{ props: [/*@__PURE__*/ x.add({ Table: (e, t) => ({
		from: t.doc.lineAt(e.from).to,
		to: e.to
	}) })] }
]));
function Hd(e, t) {
	return (n) => {
		if (n && e) {
			let t = null;
			if (n = /\S*/.exec(n)[0], t = typeof e == "function" ? e(n) : ye.matchLanguageName(e, n, !0), t instanceof ye) return t.support ? t.support.language.parser : Ge.getSkippingParser(t.load());
			if (t) return t.parser;
		}
		return t ? t.parser : null;
	};
}
var Ud = class {
	constructor(e, t, n, r, i, a, o) {
		this.node = e, this.from = t, this.to = n, this.spaceBefore = r, this.spaceAfter = i, this.type = a, this.item = o;
	}
	blank(e, t = !0) {
		let n = this.spaceBefore + (this.node.name == "Blockquote" ? ">" : "");
		if (e != null) {
			for (; n.length < e;) n += " ";
			return n;
		} else {
			for (let e = this.to - this.from - n.length - this.spaceAfter.length; e > 0; e--) n += " ";
			return n + (t ? this.spaceAfter : "");
		}
	}
	marker(e, t) {
		let n = this.node.name == "OrderedList" ? String(+Gd(this.item, e)[2] + t) : "";
		return this.spaceBefore + n + this.type + this.spaceAfter;
	}
};
function Wd(e, t) {
	let n = [], r = [];
	for (let t = e; t; t = t.parent) {
		if (t.name == "FencedCode") return r;
		(t.name == "ListItem" || t.name == "Blockquote") && n.push(t);
	}
	for (let e = n.length - 1; e >= 0; e--) {
		let i = n[e], a, o = t.lineAt(i.from), s = i.from - o.from;
		if (i.name == "Blockquote" && (a = /^ *>( ?)/.exec(o.text.slice(s)))) r.push(new Ud(i, s, s + a[0].length, "", a[1], ">", null));
		else if (i.name == "ListItem" && i.parent.name == "OrderedList" && (a = /^( *)\d+([.)])( *)/.exec(o.text.slice(s)))) {
			let e = a[3], t = a[0].length;
			e.length >= 4 && (e = e.slice(0, e.length - 4), t -= 4), r.push(new Ud(i.parent, s, s + t, a[1], e, a[2], i));
		} else if (i.name == "ListItem" && i.parent.name == "BulletList" && (a = /^( *)([-+*])( {1,4}\[[ xX]\])?( +)/.exec(o.text.slice(s)))) {
			let e = a[4], t = a[0].length;
			e.length > 4 && (e = e.slice(0, e.length - 4), t -= 4);
			let n = a[2];
			a[3] && (n += a[3].replace(/[xX]/, " ")), r.push(new Ud(i.parent, s, s + t, a[1], e, n, i));
		}
	}
	return r;
}
function Gd(e, t) {
	return /^(\s*)(\d+)(?=[.)])/.exec(t.sliceString(e.from, e.from + 10));
}
function Kd(e, t, n, r = 0) {
	for (let i = -1, a = e;;) {
		if (a.name == "ListItem") {
			let e = Gd(a, t), o = +e[2];
			if (i >= 0) {
				if (o != i + 1) return;
				n.push({
					from: a.from + e[1].length,
					to: a.from + e[0].length,
					insert: String(i + 2 + r)
				});
			}
			i = o;
		}
		let e = a.nextSibling;
		if (!e) break;
		a = e;
	}
}
function qd(e, t) {
	let n = /^[ \t]*/.exec(e)[0].length;
	if (!n || t.facet(l) != "	") return e;
	let r = f(e, 4, n), i = "";
	for (let e = r; e > 0;) e >= 4 ? (i += "	", e -= 4) : (i += " ", e--);
	return i + e.slice(n);
}
var Jd = /*@__PURE__*/ ((e = {}) => ({ state: t, dispatch: n }) => {
	let r = y(t), { doc: i } = t, a = null, o = t.changeByRange((n) => {
		if (!n.empty || !Vd.isActiveAt(t, n.from, -1) && !Vd.isActiveAt(t, n.from, 1)) return a = { range: n };
		let o = n.from, s = i.lineAt(o), c = Wd(r.resolveInner(o, -1), i);
		for (; c.length && c[c.length - 1].from > o - s.from;) c.pop();
		if (!c.length) return a = { range: n };
		let l = c[c.length - 1];
		if (l.to - l.spaceAfter.length > o - s.from) return a = { range: n };
		let u = o >= l.to - l.spaceAfter.length && !/\S/.test(s.text.slice(l.to));
		if (l.item && u) {
			let n = l.node.firstChild, r = l.node.getChild("ListItem", "ListItem");
			if (n.to >= o || r && r.to < o || s.from > 0 && !/[^\s>]/.test(i.lineAt(s.from - 1).text) || e.nonTightLists === !1) {
				let e = c.length > 1 ? c[c.length - 2] : null, t, n = "";
				e && e.item ? (t = s.from + e.from, n = e.marker(i, 1)) : t = s.from + (e ? e.to : 0);
				let r = [{
					from: t,
					to: o,
					insert: n
				}];
				return l.node.name == "OrderedList" && Kd(l.item, i, r, -2), e && e.node.name == "OrderedList" && Kd(e.item, i, r), {
					range: D.cursor(t + n.length),
					changes: r
				};
			} else {
				let e = Zd(c, t, s);
				return {
					range: D.cursor(o + e.length + 1),
					changes: {
						from: s.from,
						insert: e + t.lineBreak
					}
				};
			}
		}
		if (l.node.name == "Blockquote" && u && s.from) {
			let e = i.lineAt(s.from - 1), r = />\s*$/.exec(e.text);
			if (r && r.index == l.from) {
				let i = t.changes([{
					from: e.from + r.index,
					to: e.to
				}, {
					from: s.from + l.from,
					to: s.to
				}]);
				return {
					range: n.map(i),
					changes: i
				};
			}
		}
		let d = [];
		l.node.name == "OrderedList" && Kd(l.item, i, d);
		let p = l.item && l.item.from < s.from, m = "";
		if (!p || /^[\s\d.)\-+*>]*/.exec(s.text)[0].length >= l.to) for (let e = 0, t = c.length - 1; e <= t; e++) m += e == t && !p ? c[e].marker(i, 1) : c[e].blank(e < t ? f(s.text, 4, c[e + 1].from) - m.length : null);
		let h = o;
		for (; h > s.from && /\s/.test(s.text.charAt(h - s.from - 1));) h--;
		return m = qd(m, t), Xd(l.node, t.doc) && (m = Zd(c, t, s) + t.lineBreak + m), d.push({
			from: h,
			to: o,
			insert: t.lineBreak + m
		}), {
			range: D.cursor(h + m.length + 1),
			changes: d
		};
	});
	return a ? !1 : (n(t.update(o, {
		scrollIntoView: !0,
		userEvent: "input"
	})), !0);
})();
function Yd(e) {
	return e.name == "QuoteMark" || e.name == "ListMark";
}
function Xd(e, t) {
	if (e.name != "OrderedList" && e.name != "BulletList") return !1;
	let n = e.firstChild, r = e.getChild("ListItem", "ListItem");
	if (!r) return !1;
	let i = t.lineAt(n.to), a = t.lineAt(r.from), o = /^[\s>]*$/.test(i.text);
	return i.number + +!o < a.number;
}
function Zd(e, t, n) {
	let r = "";
	for (let t = 0, i = e.length - 2; t <= i; t++) r += e[t].blank(t < i ? f(n.text, 4, e[t + 1].from) - r.length : null, t < i);
	return qd(r, t);
}
function Qd(e, t) {
	let n = e.resolveInner(t, -1), r = t;
	Yd(n) && (r = n.from, n = n.parent);
	for (let e; e = n.childBefore(r);) if (Yd(e)) r = e.from;
	else if (e.name == "OrderedList" || e.name == "BulletList") n = e.lastChild, r = n.to;
	else break;
	return n;
}
var $d = [{
	key: "Enter",
	run: Jd
}, {
	key: "Backspace",
	run: ({ state: e, dispatch: t }) => {
		let n = y(e), r = null, i = e.changeByRange((t) => {
			let i = t.from, { doc: a } = e;
			if (t.empty && Vd.isActiveAt(e, t.from)) {
				let t = a.lineAt(i), r = Wd(Qd(n, i), a);
				if (r.length) {
					let n = r[r.length - 1], a = n.to - n.spaceAfter.length + +!!n.spaceAfter;
					if (i - t.from > a && !/\S/.test(t.text.slice(a, i - t.from))) return {
						range: D.cursor(t.from + a),
						changes: {
							from: t.from + a,
							to: i
						}
					};
					if (i - t.from == a && (n.item && t.from <= n.item.from || /^[\s>]*$/.test(t.text.slice(0, n.to)))) {
						let r = t.from + n.from;
						if (n.item && n.node.from < n.item.from && /\S/.test(t.text.slice(n.from, n.to))) {
							let i = n.blank(f(t.text, 4, n.to) - f(t.text, 4, n.from));
							return r == t.from && (i = qd(i, e)), {
								range: D.cursor(r + i.length),
								changes: {
									from: r,
									to: t.from + n.to,
									insert: i
								}
							};
						}
						if (r < i) return {
							range: D.cursor(r),
							changes: {
								from: r,
								to: i
							}
						};
					}
				}
			}
			return r = { range: t };
		});
		return r ? !1 : (t(e.update(i, {
			scrollIntoView: !0,
			userEvent: "delete"
		})), !0);
	}
}], ef = /*@__PURE__*/ Ql({ matchClosingTags: !1 });
function tf(e = {}) {
	let { codeLanguages: t, defaultCodeLanguage: n, addKeymap: r = !0, base: { parser: i } = Bd, completeHTMLTags: a = !0, pasteURLAsLink: o = !0, htmlTagLanguage: s = ef } = e;
	if (!(i instanceof Fu)) throw RangeError("Base parser provided to `markdown` should be a Markdown parser");
	let c = e.extensions ? [e.extensions] : [], l = [s.support, Rd], u;
	o && l.push(sf), n instanceof E ? (l.push(n.support), u = n.language) : n && (u = n);
	let d = t || u ? Hd(t, u) : void 0;
	c.push(ld({
		codeParser: d,
		htmlParser: s.language.parser
	})), r && l.push(ve.high(he.of($d)));
	let f = zd(i.configure(c));
	return a && l.push(f.data.of({ autocomplete: nf })), new E(f, l);
}
function nf(e) {
	let { state: t, pos: n } = e, r = /<[:\-\.\w\u00b7-\uffff]*$/.exec(t.sliceDoc(n - 25, n));
	if (!r) return null;
	let i = y(t).resolveInner(n, -1);
	for (; i && !i.type.isTop;) {
		if (i.name == "CodeBlock" || i.name == "FencedCode" || i.name == "ProcessingInstructionBlock" || i.name == "CommentBlock" || i.name == "Link" || i.name == "Image") return null;
		i = i.parent;
	}
	return {
		from: n - r[0].length,
		to: n,
		options: af(),
		validFor: /^<[:\-\.\w\u00b7-\uffff]*$/
	};
}
var rf = null;
function af() {
	if (rf) return rf;
	let e = Gl(new ot(Re.create({ extensions: ef }), 0, !0));
	return rf = e ? e.options : [];
}
var of = /code|horizontalrule|html|link|comment|processing|escape|entity|image|mark|url/i, sf = /*@__PURE__*/ b.domEventHandlers({ paste: (e, t) => {
	let { main: n } = t.state.selection;
	if (n.empty) return !1;
	let r = e.clipboardData?.getData("text/plain");
	if (!r || !/^(https?:\/\/|mailto:|xmpp:|www\.)/.test(r) || (/^www\./.test(r) && (r = "https://" + r), !Vd.isActiveAt(t.state, n.from, 1))) return !1;
	let i = y(t.state), a = !1;
	return i.iterate({
		from: n.from,
		to: n.to,
		enter: (e) => {
			(e.from > n.from || of.test(e.name)) && (a = !0);
		},
		leave: (e) => {
			e.to < n.to && (a = !0);
		}
	}), a ? !1 : (t.dispatch({
		changes: [{
			from: n.from,
			insert: "["
		}, {
			from: n.to,
			insert: `](${r})`
		}],
		userEvent: "input.paste",
		scrollIntoView: !0
	}), !0);
} }), cf = 1, lf = 194, uf = 195, df = 196, ff = 197, pf = 198, mf = 199, hf = 200, gf = 2, _f = 3, vf = 201, yf = 24, bf = 25, xf = 49, Sf = 50, Cf = 55, wf = 56, Tf = 57, Ef = 59, Df = 60, Of = 61, kf = 62, Af = 63, jf = 65, Mf = 238, Nf = 71, Pf = 241, Ff = 242, If = 243, Lf = 244, Rf = 245, zf = 246, Bf = 247, Vf = 248, Hf = 72, Uf = 249, Wf = 250, Gf = 251, Kf = 252, qf = 253, Jf = 254, Yf = 255, Xf = 256, Zf = 73, Qf = 77, $f = 263, ep = 112, tp = 130, np = 151, rp = 152, ip = 155, ap = 10, op = 13, sp = 32, cp = 9, lp = 35, up = 40, dp = 46, fp = 123, pp = 125, mp = 39, hp = 34, gp = 92, _p = 111, vp = 120, yp = 78, bp = 117, xp = 85, Sp = /* @__PURE__ */ new Set([
	bf,
	xf,
	Sf,
	$f,
	jf,
	tp,
	wf,
	Tf,
	Mf,
	kf,
	Af,
	Hf,
	Zf,
	Qf,
	Df,
	Of,
	np,
	rp,
	ip,
	ep
]);
function Cp(e) {
	return e == ap || e == op;
}
function wp(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
var Tp = new H((e, t) => {
	let n;
	if (e.next < 0) e.acceptToken(mf);
	else if (t.context.flags & Dp) Cp(e.next) && e.acceptToken(pf, 1);
	else if (((n = e.peek(-1)) < 0 || Cp(n)) && t.canShift(ff)) {
		let t = 0;
		for (; e.next == sp || e.next == cp;) e.advance(), t++;
		(e.next == ap || e.next == op || e.next == lp) && e.acceptToken(ff, -t);
	} else Cp(e.next) && e.acceptToken(df, 1);
}, { contextual: !0 }), Ep = new H((e, t) => {
	let n = t.context;
	if (n.flags) return;
	let r = e.peek(-1);
	if (r == ap || r == op) {
		let t = 0, r = 0;
		for (;;) {
			if (e.next == sp) t++;
			else if (e.next == cp) t += 8 - t % 8;
			else break;
			e.advance(), r++;
		}
		t != n.indent && e.next != ap && e.next != op && e.next != lp && (t < n.indent ? e.acceptToken(uf, -r) : e.acceptToken(lf));
	}
}), Dp = 1, Op = 2, kp = 4, Ap = 8, jp = 16, Mp = 32;
function Np(e, t, n) {
	this.parent = e, this.indent = t, this.flags = n, this.hash = (e ? e.hash + e.hash << 8 : 0) + t + (t << 4) + n + (n << 6);
}
var Pp = new Np(null, 0, 0);
function Fp(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e.charCodeAt(n) == cp ? 8 - t % 8 : 1;
	return t;
}
var Ip = new Map([
	[Pf, 0],
	[Ff, kp],
	[If, Ap],
	[Lf, 12],
	[Rf, jp],
	[zf, 20],
	[Bf, 24],
	[Vf, 28],
	[Uf, Mp],
	[Wf, 36],
	[Gf, 40],
	[Kf, 44],
	[qf, 48],
	[Jf, 52],
	[Yf, 56],
	[Xf, 60]
].map(([e, t]) => [e, t | Op])), Lp = new lo({
	start: Pp,
	reduce(e, t, n, r) {
		return e.flags & Dp && Sp.has(t) || (t == Nf || t == Hf) && e.flags & Op ? e.parent : e;
	},
	shift(e, t, n, r) {
		return t == lf ? new Np(e, Fp(r.read(r.pos, n.pos)), 0) : t == uf ? e.parent : t == yf || t == Cf || t == Ef || t == _f ? new Np(e, 0, Dp) : Ip.has(t) ? new Np(e, 0, Ip.get(t) | e.flags & Dp) : e;
	},
	hash(e) {
		return e.hash;
	}
}), Rp = new H((e) => {
	for (let t = 0; t < 5; t++) {
		if (e.next != "print".charCodeAt(t)) return;
		e.advance();
	}
	if (!/\w/.test(String.fromCharCode(e.next))) for (let t = 0;; t++) {
		let n = e.peek(t);
		if (!(n == sp || n == cp)) {
			n != up && n != dp && n != ap && n != op && n != lp && e.acceptToken(cf);
			return;
		}
	}
}), zp = new H((e, t) => {
	let { flags: n } = t.context, r = n & kp ? hp : mp, i = (n & Ap) > 0, a = !(n & jp), o = (n & Mp) > 0, s = e.pos;
	for (; !(e.next < 0);) if (o && e.next == fp) if (e.peek(1) == fp) e.advance(2);
	else {
		if (e.pos == s) {
			e.acceptToken(_f, 1);
			return;
		}
		break;
	}
	else if (a && e.next == gp) {
		if (e.pos == s) {
			e.advance();
			let t = e.next;
			t >= 0 && (e.advance(), Bp(e, t)), e.acceptToken(gf);
			return;
		}
		break;
	} else if (e.next == gp && !a && e.peek(1) > -1) e.advance(2);
	else if (e.next == r && (!i || e.peek(1) == r && e.peek(2) == r)) {
		if (e.pos == s) {
			e.acceptToken(vf, i ? 3 : 1);
			return;
		}
		break;
	} else if (e.next == ap) {
		if (i) e.advance();
		else if (e.pos == s) {
			e.acceptToken(vf);
			return;
		}
		break;
	} else e.advance();
	e.pos > s && e.acceptToken(hf);
});
function Bp(e, t) {
	if (t == _p) for (let t = 0; t < 2 && e.next >= 48 && e.next <= 55; t++) e.advance();
	else if (t == vp) for (let t = 0; t < 2 && wp(e.next); t++) e.advance();
	else if (t == bp) for (let t = 0; t < 4 && wp(e.next); t++) e.advance();
	else if (t == xp) for (let t = 0; t < 8 && wp(e.next); t++) e.advance();
	else if (t == yp && e.next == fp) {
		for (e.advance(); e.next >= 0 && e.next != pp && e.next != mp && e.next != hp && e.next != ap;) e.advance();
		e.next == pp && e.advance();
	}
}
var Vp = T({
	"async \"*\" \"**\" FormatConversion FormatSpec": v.modifier,
	"for while if elif else try except finally return raise break continue with pass assert await yield match case": v.controlKeyword,
	"in not and or is del": v.operatorKeyword,
	"from def class global nonlocal lambda": v.definitionKeyword,
	import: v.moduleKeyword,
	"with as print": v.keyword,
	Boolean: v.bool,
	None: v.null,
	VariableName: v.variableName,
	"CallExpression/VariableName": v.function(v.variableName),
	"FunctionDefinition/VariableName": v.function(v.definition(v.variableName)),
	"ClassDefinition/VariableName": v.definition(v.className),
	PropertyName: v.propertyName,
	"CallExpression/MemberExpression/PropertyName": v.function(v.propertyName),
	Comment: v.lineComment,
	Number: v.number,
	String: v.string,
	FormatString: v.special(v.string),
	Escape: v.escape,
	UpdateOp: v.updateOperator,
	"ArithOp!": v.arithmeticOperator,
	BitOp: v.bitwiseOperator,
	CompareOp: v.compareOperator,
	AssignOp: v.definitionOperator,
	Ellipsis: v.punctuation,
	At: v.meta,
	"( )": v.paren,
	"[ ]": v.squareBracket,
	"{ }": v.brace,
	".": v.derefOperator,
	", ;": v.separator
}), Hp = {
	__proto__: null,
	await: 44,
	or: 54,
	and: 56,
	in: 60,
	not: 62,
	is: 64,
	if: 70,
	else: 72,
	lambda: 76,
	yield: 94,
	from: 96,
	async: 102,
	for: 104,
	None: 162,
	True: 164,
	False: 164,
	del: 178,
	pass: 182,
	break: 186,
	continue: 190,
	return: 194,
	raise: 202,
	import: 206,
	as: 208,
	global: 212,
	nonlocal: 214,
	assert: 218,
	type: 223,
	elif: 236,
	while: 240,
	try: 246,
	except: 248,
	finally: 250,
	with: 254,
	def: 258,
	class: 268,
	match: 279,
	case: 285
}, Up = uo.deserialize({
	version: 14,
	states: "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
	stateData: "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
	goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
	nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
	maxTerm: 277,
	context: Lp,
	nodeProps: [
		[
			"isolate",
			-5,
			4,
			71,
			72,
			73,
			77,
			""
		],
		[
			"group",
			-15,
			6,
			85,
			87,
			88,
			90,
			92,
			94,
			96,
			98,
			99,
			100,
			102,
			105,
			108,
			110,
			"Statement Statement",
			-22,
			8,
			18,
			21,
			25,
			40,
			49,
			50,
			56,
			57,
			60,
			61,
			62,
			63,
			64,
			67,
			70,
			71,
			72,
			79,
			80,
			81,
			82,
			"Expression",
			-10,
			114,
			116,
			119,
			121,
			122,
			126,
			128,
			133,
			135,
			138,
			"Statement",
			-9,
			143,
			144,
			147,
			148,
			150,
			151,
			152,
			153,
			154,
			"Pattern"
		],
		[
			"openedBy",
			23,
			"(",
			54,
			"[",
			58,
			"{"
		],
		[
			"closedBy",
			24,
			")",
			55,
			"]",
			59,
			"}"
		]
	],
	propSources: [Vp],
	skippedNodes: [0, 4],
	repeatNodeCount: 34,
	tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
	tokenizers: [
		Rp,
		Ep,
		Tp,
		zp,
		0,
		1,
		2,
		3,
		4
	],
	topRules: { Script: [0, 5] },
	specialized: [{
		term: 221,
		get: (e) => Hp[e] || -1
	}],
	tokenPrec: 7668
}), Wp = /*@__PURE__*/ new ce(), Gp = /*@__PURE__*/ new Set([
	"Script",
	"Body",
	"FunctionDefinition",
	"ClassDefinition",
	"LambdaExpression",
	"ForStatement",
	"MatchClause"
]);
function Kp(e) {
	return (t, n, r) => {
		if (r) return !1;
		let i = t.node.getChild("VariableName");
		return i && n(i, e), !0;
	};
}
var qp = {
	FunctionDefinition: /*@__PURE__*/ Kp("function"),
	ClassDefinition: /*@__PURE__*/ Kp("class"),
	ForStatement(e, t, n) {
		if (n) {
			for (let n = e.node.firstChild; n; n = n.nextSibling) if (n.name == "VariableName") t(n, "variable");
			else if (n.name == "in") break;
		}
	},
	ImportStatement(e, t) {
		let { node: n } = e, r = n.firstChild?.name == "from";
		for (let e = n.getChild("import"); e; e = e.nextSibling) e.name == "VariableName" && e.nextSibling?.name != "as" && t(e, r ? "variable" : "namespace");
	},
	AssignStatement(e, t) {
		for (let n = e.node.firstChild; n; n = n.nextSibling) if (n.name == "VariableName") t(n, "variable");
		else if (n.name == ":" || n.name == "AssignOp") break;
	},
	ParamList(e, t) {
		for (let n = null, r = e.node.firstChild; r; r = r.nextSibling) r.name == "VariableName" && (!n || !/\*|AssignOp/.test(n.name)) && t(r, "variable"), n = r;
	},
	CapturePattern: /*@__PURE__*/ Kp("variable"),
	AsPattern: /*@__PURE__*/ Kp("variable"),
	__proto__: null
};
function Jp(e, t) {
	let n = Wp.get(t);
	if (n) return n;
	let r = [], i = !0;
	function a(t, n) {
		let i = e.sliceString(t.from, t.to);
		r.push({
			label: i,
			type: n
		});
	}
	return t.cursor(oe.IncludeAnonymous).iterate((t) => {
		if (t.name) {
			let e = qp[t.name];
			if (e && e(t, a, i) || !i && Gp.has(t.name)) return !1;
			i = !1;
		} else if (t.to - t.from > 8192) {
			for (let n of Jp(e, t.node)) r.push(n);
			return !1;
		}
	}), Wp.set(t, r), r;
}
var Yp = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, Xp = [
	"String",
	"FormatString",
	"Comment",
	"PropertyName"
];
function Zp(e) {
	let t = y(e.state).resolveInner(e.pos, -1);
	if (Xp.indexOf(t.name) > -1) return null;
	let n = t.name == "VariableName" || t.to - t.from < 20 && Yp.test(e.state.sliceDoc(t.from, t.to));
	if (!n && !e.explicit) return null;
	let r = [];
	for (let n = t; n; n = n.parent) Gp.has(n.name) && (r = r.concat(Jp(e.state.doc, n)));
	return {
		options: r,
		from: n ? t.from : e.pos,
		validFor: Yp
	};
}
var Qp = /*@__PURE__*/ [
	"__annotations__",
	"__builtins__",
	"__debug__",
	"__doc__",
	"__import__",
	"__name__",
	"__loader__",
	"__package__",
	"__spec__",
	"False",
	"None",
	"True"
].map((e) => ({
	label: e,
	type: "constant"
})).concat(/*@__PURE__*/ (/* @__PURE__ */ "ArithmeticError.AssertionError.AttributeError.BaseException.BlockingIOError.BrokenPipeError.BufferError.BytesWarning.ChildProcessError.ConnectionAbortedError.ConnectionError.ConnectionRefusedError.ConnectionResetError.DeprecationWarning.EOFError.Ellipsis.EncodingWarning.EnvironmentError.Exception.FileExistsError.FileNotFoundError.FloatingPointError.FutureWarning.GeneratorExit.IOError.ImportError.ImportWarning.IndentationError.IndexError.InterruptedError.IsADirectoryError.KeyError.KeyboardInterrupt.LookupError.MemoryError.ModuleNotFoundError.NameError.NotADirectoryError.NotImplemented.NotImplementedError.OSError.OverflowError.PendingDeprecationWarning.PermissionError.ProcessLookupError.RecursionError.ReferenceError.ResourceWarning.RuntimeError.RuntimeWarning.StopAsyncIteration.StopIteration.SyntaxError.SyntaxWarning.SystemError.SystemExit.TabError.TimeoutError.TypeError.UnboundLocalError.UnicodeDecodeError.UnicodeEncodeError.UnicodeError.UnicodeTranslateError.UnicodeWarning.UserWarning.ValueError.Warning.ZeroDivisionError".split(".")).map((e) => ({
	label: e,
	type: "type"
}))).concat(/*@__PURE__*/ [
	"bool",
	"bytearray",
	"bytes",
	"classmethod",
	"complex",
	"float",
	"frozenset",
	"int",
	"list",
	"map",
	"memoryview",
	"object",
	"range",
	"set",
	"staticmethod",
	"str",
	"super",
	"tuple",
	"type"
].map((e) => ({
	label: e,
	type: "class"
}))).concat(/*@__PURE__*/ (/* @__PURE__ */ "abs.aiter.all.anext.any.ascii.bin.breakpoint.callable.chr.compile.delattr.dict.dir.divmod.enumerate.eval.exec.exit.filter.format.getattr.globals.hasattr.hash.help.hex.id.input.isinstance.issubclass.iter.len.license.locals.max.min.next.oct.open.ord.pow.print.property.quit.repr.reversed.round.setattr.slice.sorted.sum.vars.zip".split(".")).map((e) => ({
	label: e,
	type: "function"
}))), $p = [
	/*@__PURE__*/ M("def ${name}(${params}):\n	${}", {
		label: "def",
		detail: "function",
		type: "keyword"
	}),
	/*@__PURE__*/ M("for ${name} in ${collection}:\n	${}", {
		label: "for",
		detail: "loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("while ${}:\n	${}", {
		label: "while",
		detail: "loop",
		type: "keyword"
	}),
	/*@__PURE__*/ M("try:\n	${}\nexcept ${error}:\n	${}", {
		label: "try",
		detail: "/ except block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("if ${}:\n	\n", {
		label: "if",
		detail: "block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("if ${}:\n	${}\nelse:\n	${}", {
		label: "if",
		detail: "/ else block",
		type: "keyword"
	}),
	/*@__PURE__*/ M("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
		label: "class",
		detail: "definition",
		type: "keyword"
	}),
	/*@__PURE__*/ M("import ${module}", {
		label: "import",
		detail: "statement",
		type: "keyword"
	}),
	/*@__PURE__*/ M("from ${module} import ${names}", {
		label: "from",
		detail: "import",
		type: "keyword"
	})
], em = /*@__PURE__*/ ut(Xp, /*@__PURE__*/ lt(/*@__PURE__*/ Qp.concat($p)));
function tm(e) {
	let { node: t, pos: n } = e, r = e.lineIndent(n, -1), i = null;
	for (;;) {
		let a = t.childBefore(n);
		if (!a) break;
		if (a.name == "Comment") n = a.from;
		else if (a.name == "Body" || a.name == "MatchBody") e.baseIndentFor(a) + e.unit <= r && (i = a), t = a;
		else if (a.name == "MatchClause") t = a;
		else if (a.type.is("Statement")) t = a;
		else break;
	}
	return i;
}
function nm(e, t) {
	let n = e.baseIndentFor(t), r = e.lineAt(e.pos, -1), i = r.from + r.text.length;
	return /^\s*($|#)/.test(r.text) && e.node.to < i + 100 && !/\S/.test(e.state.sliceDoc(i, e.node.to)) && e.lineIndent(e.pos, -1) <= n || /^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(e.textAfter) && e.lineIndent(e.pos, -1) > n ? null : n + e.unit;
}
var rm = /*@__PURE__*/ Ue.define({
	name: "python",
	parser: /*@__PURE__*/ Up.configure({ props: [/*@__PURE__*/ Qe.add({
		Body: (e) => nm(e, /^\s*(#|$)/.test(e.textAfter) && tm(e) || e.node) ?? e.continue(),
		MatchBody: (e) => nm(e, tm(e) || e.node) ?? e.continue(),
		IfStatement: (e) => /^\s*(else:|elif )/.test(e.textAfter) ? e.baseIndent : e.continue(),
		"ForStatement WhileStatement": (e) => /^\s*else:/.test(e.textAfter) ? e.baseIndent : e.continue(),
		TryStatement: (e) => /^\s*(except[ :]|finally:|else:)/.test(e.textAfter) ? e.baseIndent : e.continue(),
		MatchStatement: (e) => /^\s*case /.test(e.textAfter) ? e.baseIndent + e.unit : e.continue(),
		"TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /*@__PURE__*/ Te({ closing: ")" }),
		"DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /*@__PURE__*/ Te({ closing: "}" }),
		"ArrayExpression ArrayComprehensionExpression": /*@__PURE__*/ Te({ closing: "]" }),
		MemberExpression: (e) => e.baseIndent + e.unit,
		"String FormatString": () => null,
		Script: (e) => {
			let t = tm(e);
			return (t && nm(e, t)) ?? e.continue();
		}
	}), /*@__PURE__*/ x.add({
		"ArrayExpression DictionaryExpression SetExpression TupleExpression": De,
		Body: (e, t) => ({
			from: e.from + 1,
			to: e.to - (e.to == t.doc.length ? 0 : 1)
		}),
		"String FormatString": (e, t) => ({
			from: t.doc.lineAt(e.from).to,
			to: e.to
		})
	})] }),
	languageData: {
		closeBrackets: {
			brackets: [
				"(",
				"[",
				"{",
				"'",
				"\"",
				"'''",
				"\"\"\""
			],
			stringPrefixes: [
				"f",
				"fr",
				"rf",
				"r",
				"u",
				"b",
				"br",
				"rb",
				"F",
				"FR",
				"RF",
				"R",
				"U",
				"B",
				"BR",
				"RB"
			]
		},
		commentTokens: { line: "#" },
		indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:|case\s+[^:]*:?)$/
	}
});
function im() {
	return new E(rm, [rm.data.of({ autocomplete: Zp }), rm.data.of({ autocomplete: em })]);
}
//#endregion
//#region ../node_modules/.pnpm/@codemirror+lang-sql@6.10.0/node_modules/@codemirror/lang-sql/dist/index.js
var am = 36, om = 1, sm = 2, cm = 3, lm = 4, um = 5, dm = 6, fm = 7, pm = 8, mm = 9, hm = 10, gm = 11, _m = 12, vm = 13, ym = 14, bm = 15, xm = 16, Sm = 17, Cm = 18, wm = 19, Tm = 20, Em = 21, Dm = 22, Om = 23, km = 24;
function Am(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57;
}
function jm(e) {
	return e >= 48 && e <= 57 || e >= 97 && e <= 102 || e >= 65 && e <= 70;
}
function Mm(e, t, n) {
	for (let r = !1;;) {
		if (e.next < 0) return;
		if (e.next == t && !r) {
			e.advance();
			return;
		}
		r = n && !r && e.next == 92, e.advance();
	}
}
function Nm(e, t) {
	scan: for (;;) {
		if (e.next < 0) return;
		if (e.next == 36) {
			e.advance();
			for (let n = 0; n < t.length; n++) {
				if (e.next != t.charCodeAt(n)) continue scan;
				e.advance();
			}
			if (e.next == 36) {
				e.advance();
				return;
			}
		} else e.advance();
	}
}
function Pm(e, t) {
	let n = "[{<(".indexOf(String.fromCharCode(t)), r = n < 0 ? t : "]}>)".charCodeAt(n);
	for (;;) {
		if (e.next < 0) return;
		if (e.next == r && e.peek(1) == 39) {
			e.advance(2);
			return;
		}
		e.advance();
	}
}
function Fm(e, t) {
	for (; !(e.next != 95 && !Am(e.next));) t != null && (t += String.fromCharCode(e.next)), e.advance();
	return t;
}
function Im(e) {
	if (e.next == 39 || e.next == 34 || e.next == 96) {
		let t = e.next;
		e.advance(), Mm(e, t, !1);
	} else Fm(e);
}
function Lm(e, t) {
	for (; e.next == 48 || e.next == 49;) e.advance();
	t && e.next == t && e.advance();
}
function Rm(e, t) {
	for (;;) {
		if (e.next == 46) {
			if (t) break;
			t = !0;
		} else if (e.next < 48 || e.next > 57) break;
		e.advance();
	}
	if (e.next == 69 || e.next == 101) for (e.advance(), (e.next == 43 || e.next == 45) && e.advance(); e.next >= 48 && e.next <= 57;) e.advance();
}
function zm(e) {
	for (; !(e.next < 0 || e.next == 10);) e.advance();
}
function Bm(e, t) {
	for (let n = 0; n < t.length; n++) if (t.charCodeAt(n) == e) return !0;
	return !1;
}
var Vm = " 	\r\n";
function Hm(e, t, n) {
	let r = Object.create(null);
	r.true = r.false = um, r.null = r.unknown = dm;
	for (let t of e.split(" ")) t && (r[t] = Tm);
	for (let e of t.split(" ")) e && (r[e] = Em);
	for (let e of (n || "").split(" ")) e && (r[e] = km);
	return r;
}
var Um = {
	backslashEscapes: !1,
	hashComments: !1,
	spaceAfterDashes: !1,
	slashComments: !1,
	doubleQuotedStrings: !1,
	doubleDollarQuotedStrings: !1,
	unquotedBitLiterals: !1,
	treatBitsAsBytes: !1,
	charSetCasts: !1,
	plsqlQuotingMechanism: !1,
	operatorChars: "*+-%<>!=&|~^/",
	specialVar: "?",
	identifierQuotes: "\"",
	caseInsensitiveIdentifiers: !1,
	words: /*@__PURE__*/ Hm("absolute action add after all allocate alter and any are as asc assertion at authorization before begin between both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ", "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ")
};
function Wm(e, t, n, r) {
	let i = {};
	for (let t in Um) i[t] = (e.hasOwnProperty(t) ? e : Um)[t];
	return t && (i.words = Hm(t, n || "", r)), i;
}
function Gm(e) {
	return new H((t) => {
		let { next: n } = t;
		if (t.advance(), Bm(n, Vm)) {
			for (; Bm(t.next, Vm);) t.advance();
			t.acceptToken(am);
		} else if (n == 36 && e.doubleDollarQuotedStrings) {
			let e = Fm(t, "");
			t.next == 36 && (t.advance(), Nm(t, e), t.acceptToken(cm));
		} else if (n == 39 || n == 34 && e.doubleQuotedStrings) Mm(t, n, e.backslashEscapes), t.acceptToken(cm);
		else if (n == 35 && e.hashComments || n == 47 && t.next == 47 && e.slashComments) zm(t), t.acceptToken(om);
		else if (n == 45 && t.next == 45 && (!e.spaceAfterDashes || t.peek(1) == 32)) zm(t), t.acceptToken(om);
		else if (n == 47 && t.next == 42) {
			t.advance();
			for (let e = 1;;) {
				let n = t.next;
				if (t.next < 0) break;
				if (t.advance(), n == 42 && t.next == 47) {
					if (e--, t.advance(), !e) break;
				} else n == 47 && t.next == 42 && (e++, t.advance());
			}
			t.acceptToken(sm);
		} else if ((n == 101 || n == 69) && t.next == 39) t.advance(), Mm(t, 39, !0), t.acceptToken(cm);
		else if ((n == 110 || n == 78) && t.next == 39 && e.charSetCasts) t.advance(), Mm(t, 39, e.backslashEscapes), t.acceptToken(cm);
		else if (n == 95 && e.charSetCasts) for (let n = 0;; n++) {
			if (t.next == 39 && n > 1) {
				t.advance(), Mm(t, 39, e.backslashEscapes), t.acceptToken(cm);
				break;
			}
			if (!Am(t.next)) break;
			t.advance();
		}
		else if (e.plsqlQuotingMechanism && (n == 113 || n == 81) && t.next == 39 && t.peek(1) > 0 && !Bm(t.peek(1), Vm)) {
			let e = t.peek(1);
			t.advance(2), Pm(t, e), t.acceptToken(cm);
		} else if (Bm(n, e.identifierQuotes)) Mm(t, n == 91 ? 93 : n, !1), t.acceptToken(wm);
		else if (n == 40) t.acceptToken(fm);
		else if (n == 41) t.acceptToken(pm);
		else if (n == 123) t.acceptToken(mm);
		else if (n == 125) t.acceptToken(hm);
		else if (n == 91) t.acceptToken(gm);
		else if (n == 93) t.acceptToken(_m);
		else if (n == 59) t.acceptToken(vm);
		else if (e.unquotedBitLiterals && n == 48 && t.next == 98) t.advance(), Lm(t), t.acceptToken(Dm);
		else if ((n == 98 || n == 66) && (t.next == 39 || t.next == 34)) {
			let n = t.next;
			t.advance(), e.treatBitsAsBytes ? (Mm(t, n, e.backslashEscapes), t.acceptToken(Om)) : (Lm(t, n), t.acceptToken(Dm));
		} else if (n == 48 && (t.next == 120 || t.next == 88) || (n == 120 || n == 88) && t.next == 39) {
			let e = t.next == 39;
			for (t.advance(); jm(t.next);) t.advance();
			e && t.next == 39 && t.advance(), t.acceptToken(lm);
		} else if (n == 46 && t.next >= 48 && t.next <= 57) Rm(t, !0), t.acceptToken(lm);
		else if (n == 46) t.acceptToken(ym);
		else if (n >= 48 && n <= 57) Rm(t, !1), t.acceptToken(lm);
		else if (Bm(n, e.operatorChars)) {
			for (; Bm(t.next, e.operatorChars);) t.advance();
			t.acceptToken(bm);
		} else if (Bm(n, e.specialVar)) t.next == n && t.advance(), Im(t), t.acceptToken(Sm);
		else if (n == 58 || n == 44) t.acceptToken(xm);
		else if (Am(n)) {
			let r = Fm(t, String.fromCharCode(n));
			t.acceptToken(t.next == 46 || t.peek(-r.length - 1) == 46 ? Cm : e.words[r.toLowerCase()] ?? Cm);
		}
	});
}
var Km = /*@__PURE__*/ Gm(Um), qm = /*@__PURE__*/ uo.deserialize({
	version: 14,
	states: "%vQ]QQOOO#wQRO'#DSO$OQQO'#CwO%eQQO'#CxO%lQQO'#CyO%sQQO'#CzOOQQ'#DS'#DSOOQQ'#C}'#C}O'UQRO'#C{OOQQ'#Cv'#CvOOQQ'#C|'#C|Q]QQOOQOQQOOO'`QQO'#DOO(xQRO,59cO)PQQO,59cO)UQQO'#DSOOQQ,59d,59dO)cQQO,59dOOQQ,59e,59eO)jQQO,59eOOQQ,59f,59fO)qQQO,59fOOQQ-E6{-E6{OOQQ,59b,59bOOQQ-E6z-E6zOOQQ,59j,59jOOQQ-E6|-E6|O+VQRO1G.}O+^QQO,59cOOQQ1G/O1G/OOOQQ1G/P1G/POOQQ1G/Q1G/QP+kQQO'#C}O+rQQO1G.}O)PQQO,59cO,PQQO'#Cw",
	stateData: ",[~OtOSPOSQOS~ORUOSUOTUOUUOVROXSOZTO]XO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O^]ORvXSvXTvXUvXVvXXvXZvX]vX_vX`vXavXbvXcvXdvXevXfvXgvXhvX~OsvX~P!jOa_Ob_Oc_O~ORUOSUOTUOUUOVROXSOZTO^tO_UO`UOa`Ob`Oc`OdUOeUOfUOgUOhUO~OWaO~P$ZOYcO~P$ZO[eO~P$ZORUOSUOTUOUUOVROXSOZTO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O]hOsoX~P%zOajObjOcjO~O^]ORkaSkaTkaUkaVkaXkaZka]ka_ka`kaakabkackadkaekafkagkahka~Oska~P'kO^]O~OWvXYvX[vX~P!jOWnO~P$ZOYoO~P$ZO[pO~P$ZO^]ORkiSkiTkiUkiVkiXkiZki]ki_ki`kiakibkickidkiekifkigkihki~Oski~P)xOWkaYka[ka~P'kO]hO~P$ZOWkiYki[ki~P)xOasObsOcsO~O",
	goto: "#hwPPPPPPPPPPPPPPPPPPPPPPPPPPx||||!Y!^!d!xPPP#[TYOZeUORSTWZbdfqT[OZQZORiZSWOZQbRQdSQfTZgWbdfqQ^PWk^lmrQl_Qm`RrseVORSTWZbdfq",
	nodeNames: "⚠ LineComment BlockComment String Number Bool Null ( ) { } [ ] ; . Operator Punctuation SpecialVar Identifier QuotedIdentifier Keyword Type Bits Bytes Builtin Script Statement CompositeIdentifier Parens Braces Brackets Statement",
	maxTerm: 38,
	nodeProps: [[
		"isolate",
		-4,
		1,
		2,
		3,
		19,
		""
	]],
	skippedNodes: [
		0,
		1,
		2
	],
	repeatNodeCount: 3,
	tokenData: "RORO",
	tokenizers: [0, Km],
	topRules: { Script: [0, 25] },
	tokenPrec: 0
});
function Jm(e) {
	let t = e.cursor().moveTo(e.from, -1);
	for (; /Comment/.test(t.name);) t.moveTo(t.from, -1);
	return t.node;
}
function Ym(e, t) {
	let n = e.sliceString(t.from, t.to), r = /^([`'"\[])(.*)([`'"\]])$/.exec(n);
	return r ? r[2] : n;
}
function Xm(e) {
	return e && (e.name == "Identifier" || e.name == "QuotedIdentifier");
}
function Zm(e, t) {
	if (t.name == "CompositeIdentifier") {
		let n = [];
		for (let r = t.firstChild; r; r = r.nextSibling) Xm(r) && n.push(Ym(e, r));
		return n;
	}
	return [Ym(e, t)];
}
function Qm(e, t) {
	for (let n = [];;) {
		if (!t || t.name != ".") return n;
		let r = Jm(t);
		if (!Xm(r)) return n;
		n.unshift(Ym(e, r)), t = Jm(r);
	}
}
function $m(e, t) {
	let n = y(e).resolveInner(t, -1), r = th(e.doc, n);
	return n.name == "Identifier" || n.name == "QuotedIdentifier" || n.name == "Keyword" ? {
		from: n.from,
		quoted: n.name == "QuotedIdentifier" ? e.doc.sliceString(n.from, n.from + 1) : null,
		parents: Qm(e.doc, Jm(n)),
		aliases: r
	} : n.name == "." ? {
		from: t,
		quoted: null,
		parents: Qm(e.doc, n),
		aliases: r
	} : {
		from: t,
		quoted: null,
		parents: [],
		empty: !0,
		aliases: r
	};
}
var eh = /*@__PURE__*/ new Set(/*@__PURE__*/ "where group having order union intersect except all distinct limit offset fetch for".split(" "));
function th(e, t) {
	let n;
	for (let e = t; !n; e = e.parent) {
		if (!e) return null;
		e.name == "Statement" && (n = e);
	}
	let r = null;
	for (let t = n.firstChild, i = !1, a = null; t; t = t.nextSibling) {
		let n = t.name == "Keyword" ? e.sliceString(t.from, t.to).toLowerCase() : null, o = null;
		if (!i) i = n == "from";
		else if (n == "as" && a && Xm(t.nextSibling)) o = Ym(e, t.nextSibling);
		else if (n && eh.has(n)) break;
		else a && Xm(t) && (o = Ym(e, t));
		o && (r ||= Object.create(null), r[o] = Zm(e, a)), a = /Identifier$/.test(t.name) ? t : null;
	}
	return r;
}
function nh(e, t, n) {
	return n.map((n) => ({
		...n,
		label: n.label[0] == e ? n.label : e + n.label + t,
		apply: void 0
	}));
}
var rh = /^\w*$/, ih = /^[`'"\[]?\w*[`'"\]]?$/;
function ah(e) {
	return e.self && typeof e.self.label == "string";
}
var oh = class e {
	constructor(e, t) {
		this.idQuote = e, this.idCaseInsensitive = t, this.list = [], this.children = void 0;
	}
	child(t) {
		let n = this.children ||= Object.create(null);
		return n[t] || (t && !this.list.some((e) => e.label == t) && this.list.push(sh(t, "type", this.idQuote, this.idCaseInsensitive)), n[t] = new e(this.idQuote, this.idCaseInsensitive));
	}
	maybeChild(e) {
		return this.children ? this.children[e] : null;
	}
	addCompletion(e) {
		let t = this.list.findIndex((t) => t.label == e.label);
		t > -1 ? this.list[t] = e : this.list.push(e);
	}
	addCompletions(e) {
		for (let t of e) this.addCompletion(typeof t == "string" ? sh(t, "property", this.idQuote, this.idCaseInsensitive) : t);
	}
	addNamespace(e) {
		Array.isArray(e) ? this.addCompletions(e) : ah(e) ? this.addNamespace(e.children) : this.addNamespaceObject(e);
	}
	addNamespaceObject(e) {
		for (let t of Object.keys(e)) {
			let n = e[t], r = null, i = t.replace(/\\?\./g, (e) => e == "." ? "\0" : e).split("\0"), a = this;
			ah(n) && (r = n.self, n = n.children);
			for (let e = 0; e < i.length; e++) r && e == i.length - 1 && a.addCompletion(r), a = a.child(i[e].replace(/\\\./g, "."));
			a.addNamespace(n);
		}
	}
};
function sh(e, t, n, r) {
	return RegExp("^[a-z_][a-z_\\d]*$", r ? "i" : "").test(e) ? {
		label: e,
		type: t
	} : {
		label: e,
		type: t,
		apply: n + e + ch(n)
	};
}
function ch(e) {
	return e === "[" ? "]" : e;
}
function lh(e, t, n, r, i, a) {
	let o = new oh(a?.spec.identifierQuotes?.[0] || "\"", !!a?.spec.caseInsensitiveIdentifiers), s = i ? o.child(i) : null;
	return o.addNamespace(e), t && (s || o).addCompletions(t), n && o.addCompletions(n), s && o.addCompletions(s.list), r && o.addCompletions((s || o).child(r).list), (e) => {
		let { parents: t, from: n, quoted: i, empty: a, aliases: c } = $m(e.state, e.pos);
		if (a && !e.explicit) return null;
		c && t.length == 1 && (t = c[t[0]] || t);
		let l = o;
		for (let e of t) {
			for (; !l.children || !l.children[e];) if (l == o && s) l = s;
			else if (l == s && r) l = l.child(r);
			else return null;
			let t = l.maybeChild(e);
			if (!t) return null;
			l = t;
		}
		let u = l.list;
		if (l == o && c && (u = u.concat(Object.keys(c).map((e) => ({
			label: e,
			type: "constant"
		})))), i) {
			let t = i[0], r = ch(t);
			return {
				from: n,
				to: e.state.sliceDoc(e.pos, e.pos + 1) == r ? e.pos + 1 : void 0,
				options: nh(t, r, u),
				validFor: ih
			};
		} else return {
			from: n,
			options: u,
			validFor: rh
		};
	};
}
function uh(e) {
	return e == Em ? "type" : e == Tm ? "keyword" : "variable";
}
function dh(e, t, n) {
	return ut([
		"QuotedIdentifier",
		"String",
		"LineComment",
		"BlockComment",
		"."
	], lt(Object.keys(e).map((r) => n(t ? r.toUpperCase() : r, uh(e[r])))));
}
var fh = /*@__PURE__*/ qm.configure({ props: [
	/*@__PURE__*/ Qe.add({ Statement: /*@__PURE__*/ O() }),
	/*@__PURE__*/ x.add({
		Statement(e, t) {
			return {
				from: Math.min(e.from + 100, t.doc.lineAt(e.from).to),
				to: e.to
			};
		},
		BlockComment(e) {
			return {
				from: e.from + 2,
				to: e.to - 2
			};
		}
	}),
	/*@__PURE__*/ T({
		Keyword: v.keyword,
		Type: v.typeName,
		Builtin: /*@__PURE__*/ v.standard(v.name),
		Bits: v.number,
		Bytes: v.string,
		Bool: v.bool,
		Null: v.null,
		Number: v.number,
		String: v.string,
		Identifier: v.name,
		QuotedIdentifier: /*@__PURE__*/ v.special(v.string),
		SpecialVar: /*@__PURE__*/ v.special(v.name),
		LineComment: v.lineComment,
		BlockComment: v.blockComment,
		Operator: v.operator,
		"Semi Punctuation": v.punctuation,
		"( )": v.paren,
		"{ }": v.brace,
		"[ ]": v.squareBracket
	})
] }), ph = class e {
	constructor(e, t, n) {
		this.dialect = e, this.language = t, this.spec = n;
	}
	get extension() {
		return this.language.extension;
	}
	configureLanguage(t, n) {
		return new e(this.dialect, this.language.configure(t, n), this.spec);
	}
	static define(t) {
		let n = Wm(t, t.keywords, t.types, t.builtin), r = Ue.define({
			name: "sql",
			parser: fh.configure({ tokenizers: [{
				from: Km,
				to: Gm(n)
			}] }),
			languageData: {
				commentTokens: {
					line: "--",
					block: {
						open: "/*",
						close: "*/"
					}
				},
				closeBrackets: { brackets: [
					"(",
					"[",
					"{",
					"'",
					"\"",
					"`"
				] }
			}
		});
		return new e(n, r, t);
	}
};
function mh(e, t) {
	return {
		label: e,
		type: t,
		boost: -1
	};
}
function hh(e, t = !1, n) {
	return dh(e.dialect.words, t, n || mh);
}
function gh(e) {
	return e.schema ? lh(e.schema, e.tables, e.schemas, e.defaultTable, e.defaultSchema, e.dialect || yh) : () => null;
}
function _h(e) {
	return e.schema ? (e.dialect || yh).language.data.of({ autocomplete: gh(e) }) : [];
}
function vh(e = {}) {
	let t = e.dialect || yh;
	return new E(t.language, [_h(e), t.language.data.of({ autocomplete: hh(t, e.upperCaseKeywords, e.keywordCompletion) })]);
}
var yh = /*@__PURE__*/ ph.define({});
//#endregion
//#region src/components/code-editor/code-editor.ts
function bh(e) {
	let t = e.matchBefore(/\w*/);
	if (t === null) return null;
	let n = window.__tp_sql_schema__ ?? [], r = n.map((e) => ({
		label: e.name,
		type: "class"
	})), i = n.flatMap((e) => e.columns.map((e) => ({
		label: e,
		type: "property"
	}))), a = [
		"SELECT",
		"FROM",
		"WHERE",
		"JOIN",
		"INNER",
		"LEFT",
		"RIGHT",
		"ON",
		"INSERT",
		"UPDATE",
		"DELETE",
		"CREATE",
		"TABLE",
		"INDEX",
		"EXPLAIN"
	].map((e) => ({
		label: e,
		type: "keyword"
	}));
	return {
		from: t.from,
		options: [
			...a,
			...r,
			...i
		]
	};
}
var xh = xe.define({ token(e) {
	return e.match(/%.*$/) ? "comment" : e.match(/"(?:[^"\\]|\\.)*"/) || e.match(/'(?:[^'\\]|\\.)*'/) ? "string" : e.match(/[A-Z_][A-Za-z0-9_]*/) ? "variableName" : e.match(/[a-z][A-Za-z0-9_]*/) ? "atom" : e.match(/:-|-->|[().,[\]|!]/) ? "operator" : (e.next(), null);
} }), Sh = /^\[(?:source|listing|literal|script|style)(?:[,.%#\]].*)?$/i, Ch = /^(?:={4,}|-{4,}|\.{4,}|_{4,}|\+{4,}|\*{4,})$/, wh = xe.define({
	startState: () => ({
		rawDelimiter: null,
		rawStyle: null,
		pendingVerbatim: !1
	}),
	copyState: (e) => ({ ...e }),
	token(e, t) {
		if (e.sol()) {
			let n = e.string.trim();
			if (t.rawDelimiter !== null) return n === t.rawDelimiter ? (e.skipToEnd(), t.rawDelimiter = null, t.rawStyle = null, "meta") : (e.skipToEnd(), t.rawStyle === "comment" ? "comment" : "string");
			if (n === "////") return e.skipToEnd(), t.rawDelimiter = "////", t.rawStyle = "comment", "comment";
			let r = n.match(Ch)?.[0];
			if (r !== void 0) return e.skipToEnd(), (t.pendingVerbatim || r.startsWith("-") || r.startsWith(".") || r.startsWith("+")) && (t.rawDelimiter = r, t.rawStyle = "verbatim"), t.pendingVerbatim = !1, "meta";
			if (t.pendingVerbatim = Sh.test(n), e.match(/^={1,6}\s.+$/)) return "heading";
			if (e.match(/^:{1,2}[\w-]+:/)) return "attributeName";
			if (e.match(/^\.\S.*$/)) return "labelName";
			if (e.match(/^(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION):/)) return "keyword";
			if (e.match(/^\/\//)) return e.skipToEnd(), "comment";
			if (e.match(/^\s*(?:\*+|-|\.+|\d+\.)\s+/)) return "meta";
			if (e.match(/^.+?(?=::{1,4}(?:\s|$))/)) return "typeName";
		}
		return e.match(/^\[(?=[a-z][a-z0-9-]*(?:[,.%#\]]))/i) ? "meta" : e.match(/^[a-z][a-z0-9-]*/i) && e.string.trimStart().startsWith("[") ? "typeName" : e.match(/^,[\w:-]+/) ? "attributeName" : e.match(/^=(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^,\]]+)/) ? "string" : e.match(/^[.%#][\w-]+/) ? "attributeName" : e.match(/^\]/) ? "meta" : e.match(/^(?:include|image|video|audio|xref|link|icon|kbd|btn|menu|footnote|stem)::?/) ? "keyword" : e.match(/^::{1,4}/) ? "meta" : e.match(/^\{[\w-]+\}/) ? "variableName" : e.match(/^<<[^>,]+(?:,[^>]+)?>>/) || e.match(/^https?:\/\/[^\s[]+(?:\[[^\]]*\])?/) ? "link" : e.match(/^\*\*[^*]+\*\*/) ? "strong" : e.match(/^\*[^*]+\*/) || e.match(/^_[^_]+_/) ? "emphasis" : e.match(/^`[^`]+`/) ? "string" : e.match(/^#[^#]+#/) ? "atom" : e.match(/^\^[^^]+\^|^~[^~]+~/) ? "number" : (e.next(), null);
	}
}), Th = _.line({ class: "cm-rst-section-title" }), Eh = g.fromClass(class {
	decorations;
	constructor(e) {
		this.decorations = Dh(e);
	}
	update(e) {
		(e.docChanged || e.viewportChanged) && (this.decorations = Dh(e.view));
	}
}, { decorations: (e) => e.decorations });
function Dh(e) {
	let t = new Xe(), n = e.state.doc;
	for (let e = 2; e <= n.lines; e += 1) {
		let r = n.line(e).text.trim();
		if (!/^[=~`:#"^_*+-]{3,}$/.test(r)) continue;
		let i = n.line(e - 1);
		i.text.trim() !== "" && t.add(i.from, i.from, Th);
	}
	return t.finish();
}
var Oh = xe.define({ token(e) {
	if (e.sol()) {
		let t = e.string.trim();
		if (/^[=~`:#"^_*+-]{3,}$/.test(t)) return e.skipToEnd(), "meta";
		if (e.match(/^\s*\.\.\s+[\w-]+::/)) return "keyword";
		if (e.match(/^\s*\.\.\s+_[^:]+:/)) return "link";
		if (e.match(/^\s+:[\w-]+:/)) return "attributeName";
	}
	return e.match(/:[\w-]+:`[^`]*`/) ? "keyword" : e.match(/\*\*[^*]+\*\*/) ? "strong" : e.match(/\*[^*]+\*/) ? "emphasis" : e.match(/``[^`]+``/) ? "string" : e.match(/`[^`<]+<[^>]+>`_/) || e.match(/https?:\/\/\S+/) ? "link" : (e.next(), null);
} }), kh = d(Ke.define([
	{
		tag: [
			v.keyword,
			v.operatorKeyword,
			v.modifier
		],
		color: "var(--tp-code-editor-token-keyword, #2563eb)"
	},
	{
		tag: [
			v.string,
			v.special(v.string),
			v.regexp
		],
		color: "var(--tp-code-editor-token-string, #b45309)"
	},
	{
		tag: [
			v.number,
			v.bool,
			v.null,
			v.atom
		],
		color: "var(--tp-code-editor-token-number, #7c3aed)"
	},
	{
		tag: [
			v.comment,
			v.lineComment,
			v.blockComment
		],
		color: "var(--tp-code-editor-token-comment, #6b7280)",
		fontStyle: "italic"
	},
	{
		tag: [v.variableName, v.name],
		color: "var(--tp-code-editor-token-variable, #0f766e)"
	},
	{
		tag: [
			v.propertyName,
			v.attributeName,
			v.labelName
		],
		color: "var(--tp-code-editor-token-property, #0f766e)"
	},
	{
		tag: [
			v.typeName,
			v.className,
			v.namespace
		],
		color: "var(--tp-code-editor-token-type, #1d4ed8)"
	},
	{
		tag: [v.function(v.variableName), v.function(v.propertyName)],
		color: "var(--tp-code-editor-token-function, #1d4ed8)"
	},
	{
		tag: [v.link, v.url],
		color: "var(--tp-code-editor-token-link, #0284c7)",
		textDecoration: "underline"
	},
	{
		tag: [v.strong],
		fontWeight: "700"
	},
	{
		tag: [v.emphasis],
		fontStyle: "italic"
	}
])), Ah = b.theme({
	"&": {
		backgroundColor: "var(--tp-code-editor-surface, var(--tp-paper-color, #ffffff))",
		color: "var(--tp-code-editor-foreground, var(--tp-text-body, #111827))"
	},
	".cm-content": { caretColor: "var(--tp-code-editor-caret, currentColor)" },
	".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--tp-code-editor-caret, currentColor)" },
	".cm-selectionBackground, .cm-content ::selection": { backgroundColor: "var(--tp-code-editor-selection, rgba(59, 130, 246, 0.25))" },
	".cm-activeLine": { backgroundColor: "var(--tp-code-editor-active-line, rgba(148, 163, 184, 0.16))" },
	".cm-gutters": {
		backgroundColor: "var(--tp-code-editor-gutter-background, color-mix(in srgb, var(--tp-neutral-fill-softer, #f3f4f6) 88%, transparent))",
		color: "var(--tp-code-editor-gutter-foreground, var(--tp-text-muted, #6b7280))",
		borderInlineEnd: "1px solid var(--tp-code-editor-gutter-border, var(--tp-neutral-stroke-soft, #d1d5db))"
	},
	".cm-activeLineGutter": { backgroundColor: "var(--tp-code-editor-active-line, rgba(148, 163, 184, 0.16))" },
	".cm-foldPlaceholder": {
		backgroundColor: "var(--tp-code-editor-fold-background, color-mix(in srgb, var(--tp-neutral-fill-soft, #e5e7eb) 70%, transparent))",
		border: "none",
		color: "var(--tp-code-editor-muted, var(--tp-text-muted, #6b7280))"
	}
}), jh = d(Ke.define([
	{
		tag: [
			v.heading,
			v.heading1,
			v.heading2,
			v.heading3,
			v.heading4,
			v.heading5,
			v.heading6
		],
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700"
	},
	{
		tag: v.keyword,
		color: "var(--tp-code-editor-token-keyword, #2563eb)",
		fontWeight: "600"
	},
	{
		tag: [v.attributeName, v.labelName],
		color: "var(--tp-code-editor-token-property, #0f766e)"
	},
	{
		tag: [v.typeName, v.className],
		color: "var(--tp-code-editor-token-type, #1d4ed8)",
		fontWeight: "600"
	},
	{
		tag: v.meta,
		color: "var(--tp-code-editor-muted, #6b7280)"
	},
	{
		tag: [v.link, v.url],
		color: "var(--tp-code-editor-token-link, #0284c7)",
		textDecoration: "underline"
	},
	{
		tag: v.atom,
		color: "var(--tp-code-editor-token-number, #7c3aed)"
	}
])), Mh = d(Ke.define([
	{
		tag: [
			v.heading,
			v.heading1,
			v.heading2,
			v.heading3,
			v.heading4,
			v.heading5,
			v.heading6
		],
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700"
	},
	{
		tag: v.keyword,
		color: "var(--tp-code-editor-token-keyword, #2563eb)",
		fontWeight: "600"
	},
	{
		tag: v.attributeName,
		color: "var(--tp-code-editor-token-property, #0f766e)"
	},
	{
		tag: v.link,
		color: "var(--tp-code-editor-token-link, #0284c7)",
		textDecoration: "underline"
	},
	{
		tag: v.strong,
		fontWeight: "700"
	},
	{
		tag: v.emphasis,
		fontStyle: "italic"
	},
	{
		tag: v.string,
		color: "var(--tp-code-editor-token-string, #b45309)"
	}
])), Nh = b.baseTheme({
	".cm-line .cm-header": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700",
		textDecoration: "none"
	},
	".cm-line .cm-header *": { textDecoration: "none" },
	".cm-rst-section-title": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700",
		textDecoration: "none"
	},
	".cm-meta": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		opacity: "0.35",
		textDecoration: "none"
	}
}), Ph = _.mark({ class: "cm-tp-markdown-fence" }), Fh = _.mark({ class: "cm-tp-markdown-component" }), Ih = _.mark({ class: "cm-tp-markdown-attributes" }), Lh = _.mark({ class: "cm-tp-markdown-definition-term" }), Rh = _.mark({ class: "cm-tp-markdown-definition-marker" });
function zh(e) {
	let t = [];
	for (let n = 1; n <= e.state.doc.lines; n += 1) {
		let r = e.state.doc.line(n), i = /^(\s*)(:{3,})(?:\s+([a-z][a-z0-9-]*)(?:\s+(\{.*\}))?)?\s*$/i.exec(r.text);
		if (i !== null) {
			let e = i[1]?.length ?? 0, n = i[2] ?? "", a = r.from + e;
			t.push(Ph.range(a, a + n.length));
			let o = i[3];
			if (o !== void 0) {
				let i = r.text.indexOf(o, e + n.length);
				t.push(Fh.range(r.from + i, r.from + i + o.length));
			}
			let s = i[4];
			if (s !== void 0) {
				let e = r.text.lastIndexOf(s);
				t.push(Ih.range(r.from + e, r.from + e + s.length));
			}
		}
		let a = /^(\s*)(:)(?=\s+)/.exec(r.text);
		if (a !== null) {
			let i = r.from + (a[1]?.length ?? 0);
			if (t.push(Rh.range(i, i + 1)), n > 1) {
				let r = e.state.doc.line(n - 1);
				if (r.text.trim() !== "") {
					let e = r.text.length - r.text.trimStart().length, n = r.text.length - r.text.trimEnd().length;
					t.push(Lh.range(r.from + e, r.to - n));
				}
			}
		}
		for (let e of r.text.matchAll(/:([a-z][a-z0-9-]*):[^{}\n]*(\{[^}\n]*\})/gi)) {
			let n = e[0], i = e[1], a = e[2], o = e.index;
			if (n === void 0 || i === void 0 || a === void 0 || o === void 0) continue;
			let s = r.from + o, c = r.from + o + n.lastIndexOf(a);
			t.push(Fh.range(s, s + i.length + 2)), t.push(Ih.range(c, c + a.length));
		}
	}
	return t.sort((e, t) => e.from - t.from || e.to - t.to), _.set(t, !0);
}
var Bh = g.fromClass(class {
	decorations;
	constructor(e) {
		this.decorations = zh(e);
	}
	update(e) {
		(e.docChanged || e.viewportChanged) && (this.decorations = zh(e.view));
	}
}, { decorations: (e) => e.decorations }), Vh = b.baseTheme({
	".cm-tp-markdown-fence, .cm-tp-markdown-definition-marker": {
		color: "var(--tp-code-editor-token-keyword, #2563eb)",
		fontWeight: "700"
	},
	".cm-tp-markdown-component": {
		color: "var(--tp-code-editor-token-type, #1d4ed8)",
		fontWeight: "600"
	},
	".cm-tp-markdown-attributes": { color: "var(--tp-code-editor-token-property, #0f766e)" },
	".cm-tp-markdown-definition-term": {
		color: "var(--tp-code-editor-token-variable, #0f766e)",
		fontWeight: "600"
	}
}), Hh = class s extends n {
	static styleId = "tp-code-editor-styles";
	editor = null;
	commentNumbers = /* @__PURE__ */ new Map();
	commentContents = /* @__PURE__ */ new Map();
	commentCompartment = new Ee();
	setCodeCommentNumbers(e, t, n = /* @__PURE__ */ new Map()) {
		t.length ? (this.commentNumbers.set(e, [...t]), this.commentContents.set(e, n)) : (this.commentNumbers.delete(e), this.commentContents.delete(e)), this.editor?.dispatch({ effects: this.commentCompartment.reconfigure(this.commentExtension()) });
	}
	commentExtension() {
		return this.commentNumbers.size ? rt(new Set([...this.commentNumbers.values()].flat()), new Map([...this.commentContents.values()].flatMap((e) => [...e]))) : [];
	}
	container = null;
	panelContainer = null;
	sourceErrorElement = null;
	panelObserver = null;
	layoutObserver = null;
	observedInlineSize = -1;
	actionPanelEl = null;
	languageBadgeEl = null;
	cursorPositionEl = null;
	static nextKeyboardId = 0;
	static nextThemeTargetId = 0;
	keyboardId = `tp-code-editor-keyboard-${String(s.nextKeyboardId++)}`;
	keyboardDropdownEl = null;
	generatedThemeTargetId = `tp-code-editor-${String(s.nextThemeTargetId++)}`;
	currentValue = "";
	currentLanguage = "html";
	overrideValue = null;
	currentFilename = "";
	pendingSourceLoad = null;
	sourceReloadRequested = !1;
	isApplyingExternalValue = !1;
	initialValue = "";
	hasInitialValue = !1;
	toggleGutters() {
		this.foldGutter = !this.foldGutter;
	}
	toggleLineNumbers() {
		this.lineNumbers = !this.lineNumbers;
	}
	emitBoundaryIntent(e) {
		return this.dispatchEvent(new CustomEvent("tp-code-editor-boundary", {
			bubbles: !0,
			detail: { direction: e }
		})), !0;
	}
	getShortcutLabels() {
		return navigator.platform.toLowerCase().includes("mac") || navigator.userAgent.toLowerCase().includes("mac") ? {
			mod: "⌘",
			shift: "⇧",
			alt: "⌥"
		} : {
			mod: "Ctrl",
			shift: "Shift",
			alt: "Alt"
		};
	}
	static get observedAttributes() {
		return [
			"value",
			"src",
			"filename",
			"language",
			"placeholder",
			"readonly",
			"toolbar",
			"line-numbers",
			"fold-gutter",
			"word-wrap"
		];
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		if (e === "") {
			this.removeAttribute("value");
			return;
		}
		this.setAttribute("value", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	get filename() {
		return this.getAttribute("filename") ?? "";
	}
	set filename(e) {
		if (e === "") {
			this.removeAttribute("filename");
			return;
		}
		this.setAttribute("filename", e);
	}
	get language() {
		return this.getAttribute("language") ?? "html";
	}
	set language(e) {
		this.setAttribute("language", e);
	}
	get placeholder() {
		return this.getAttribute("placeholder") ?? `Type some ${this.currentLanguage} code... or F1 to toggle the toolbar`;
	}
	set placeholder(e) {
		if (e === "") {
			this.removeAttribute("placeholder");
			return;
		}
		this.setAttribute("placeholder", e);
	}
	get readonly() {
		return this.hasAttribute("readonly");
	}
	set readonly(e) {
		if (e) {
			this.setAttribute("readonly", "");
			return;
		}
		this.removeAttribute("readonly");
	}
	get lineNumbers() {
		return this.hasAttribute("line-numbers");
	}
	set lineNumbers(e) {
		if (e) {
			this.setAttribute("line-numbers", "");
			return;
		}
		this.removeAttribute("line-numbers");
	}
	get foldGutter() {
		return this.hasAttribute("fold-gutter");
	}
	set foldGutter(e) {
		if (e) {
			this.setAttribute("fold-gutter", "");
			return;
		}
		this.removeAttribute("fold-gutter");
	}
	get wordWrap() {
		return this.hasAttribute("word-wrap");
	}
	set wordWrap(e) {
		if (e) {
			this.setAttribute("word-wrap", "");
			return;
		}
		this.removeAttribute("word-wrap");
	}
	get toolbar() {
		return this.hasAttribute("toolbar");
	}
	set toolbar(e) {
		this.toggleAttribute("toolbar", e);
	}
	setInitialValue(e) {
		this.initialValue = e, this.hasInitialValue = !0;
	}
	getInitialValue() {
		return this.initialValue;
	}
	reset() {
		if (!this.hasInitialValue) {
			this.setValue("");
			return;
		}
		this.setValue(this.initialValue), this.dispatchEvent(new CustomEvent("tp-code-editor-reset", {
			bubbles: !0,
			detail: { value: this.initialValue }
		}));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureThemeTargetId(), this.ensureContainer(), this.ensureActionPanel(), this.createEditor(), this.startPanelObserver(), this.startLayoutObserver(), this.syncActionPanel(), this.requestLoadSourceAndSyncEditor(), document.fonts?.ready.then(() => {
			this.editor?.requestMeasure(), this.scheduleSyncHeight();
		}), this.dispatchEvent(new CustomEvent("tp-code-editor-ready", { bubbles: !0 }));
	}
	attributeChangedCallback(e, t, n) {
		if (!(!this.isConnected || t === n)) {
			if (e === "language" && (this.currentLanguage = this.readExplicitLanguage() ?? "html", this.reconfigureEditor()), this.syncActionPanel(), e === "toolbar") {
				this.toolbar || this.keyboardDropdownEl?.hide(), this.scheduleSyncHeight();
				return;
			}
			if (e === "value" || e === "src" || e === "filename" || e === "language") {
				this.requestLoadSourceAndSyncEditor();
				return;
			}
			this.reconfigureEditor(), this.scheduleSyncHeight();
		}
	}
	disconnectedCallback() {
		this.panelObserver?.disconnect(), this.panelObserver = null, this.layoutObserver?.disconnect(), this.layoutObserver = null, this.keyboardDropdownEl?.removeEventListener("tp-dropdown-toggle", this.handleKeyboardDropdownToggle), this.keyboardDropdownEl?.remove(), this.keyboardDropdownEl = null, this.editor?.destroy(), this.editor = null;
	}
	getContentHeight() {
		if (this.container === null || this.editor === null) return 0;
		let e = this.container.querySelector(".cm-editor"), t = this.container.querySelector(".cm-scroller"), n = this.container.querySelector(".cm-content"), r = this.container.querySelector(".cm-line"), i = {
			host: this.style.blockSize,
			container: this.container.style.blockSize,
			editorRoot: e?.style.blockSize ?? "",
			scroller: t?.style.blockSize ?? ""
		};
		this.style.blockSize = "auto", this.container.style.blockSize = "auto", e instanceof HTMLElement && (e.style.blockSize = "auto"), t instanceof HTMLElement && (t.style.blockSize = "auto");
		try {
			let e = r instanceof HTMLElement ? Math.max(Math.ceil(Number.parseFloat(getComputedStyle(r).lineHeight) || 20), 20) : 20, t = this.editor.state.doc.lines, i = 0, a = 0;
			if (n instanceof HTMLElement) {
				let e = getComputedStyle(n);
				i = Number.parseFloat(e.paddingTop) || 0, a = Number.parseFloat(e.paddingBottom) || 0;
			}
			let o = Math.ceil(t * e + i + a), s = Array.from(this.container.querySelectorAll(".cm-line")).reduce((e, t) => e + Math.ceil(t.getBoundingClientRect().height), 0), c = Math.ceil(s + i + a);
			return Math.max(o, c);
		} finally {
			this.style.blockSize = i.host, this.container.style.blockSize = i.container, e instanceof HTMLElement && (e.style.blockSize = i.editorRoot), t instanceof HTMLElement && (t.style.blockSize = i.scroller);
		}
	}
	getValue() {
		return this.editor?.state.doc.toString() ?? this.currentValue;
	}
	setValue(e) {
		this.overrideValue = e, this.currentValue = e, this.applyValueToEditor(e);
	}
	focus() {
		this.editor?.focus(), this.container?.querySelector(".cm-editor")?.classList.add("cm-focused");
	}
	isCursorAtStart() {
		if (this.editor === null) return !1;
		let e = this.editor.state.selection.main;
		return e.empty && e.from === 0;
	}
	isCursorAtEnd() {
		if (this.editor === null) return !1;
		let e = this.editor.state.selection.main;
		return e.empty && e.to === this.editor.state.doc.length;
	}
	reload() {
		this.loadSourceAndSyncEditor();
	}
	requestLoadSourceAndSyncEditor() {
		return this.pendingSourceLoad === null ? (this.pendingSourceLoad = (async () => {
			do
				this.sourceReloadRequested = !1, await this.loadSourceAndSyncEditor();
			while (this.sourceReloadRequested);
		})().finally(() => {
			this.pendingSourceLoad = null;
		}), this.pendingSourceLoad) : (this.sourceReloadRequested = !0, this.pendingSourceLoad);
	}
	syncHeightToContent() {
		this.scheduleSyncHeight();
	}
	createEditor() {
		if (this.container === null) return;
		let e = Re.create({
			doc: this.currentValue,
			extensions: this.buildExtensions()
		});
		this.editor = new b({
			parent: this.container,
			state: e
		});
	}
	async runKeyboardAction(e) {
		if (this.editor === null) return;
		let t = this.editor;
		switch (t.focus(), e) {
			case "undo":
				Hn(t);
				return;
			case "redo":
				Un(t);
				return;
			case "copy":
				document.execCommand("copy");
				return;
			case "cut":
				document.execCommand("cut");
				return;
			case "paste":
				try {
					let e = await navigator.clipboard.readText();
					t.dispatch(t.state.replaceSelection(e));
				} catch {
					document.execCommand("paste");
				}
				return;
			case "select-all":
				ti(t);
				return;
			case "fold-code":
				Le(t);
				return;
			case "unfold-code":
				Ne(t);
				return;
			case "toggle-gutters":
				this.foldGutter = !this.foldGutter;
				return;
			case "toggle-line-numbers":
				this.lineNumbers = !this.lineNumbers;
				return;
			case "indent":
				Fi(t);
				return;
			case "dedent":
				Ii(t);
				return;
			case "search":
				Ma(t);
				return;
			case "replace":
				Ma(t), Ea(t);
				return;
			case "goto-line":
				Qi(t);
				return;
			case "toggle-line-comment":
				En(t);
				return;
			case "toggle-block-comment":
				Dn(t);
				return;
			case "toggle-command-palette":
				this.toggleKeyboardDropdown();
				return;
			case "toggle-toolbar":
				this.toolbar = !this.toolbar;
				return;
			default: return;
		}
	}
	handleKeyboardDropdownClick = (e) => {
		let t = e.target;
		if (!(t instanceof HTMLElement)) return;
		let n = t.closest("[data-tp-code-editor-keyboard-action]");
		if (!(n instanceof HTMLElement)) return;
		let r = n.getAttribute("data-tp-code-editor-keyboard-action");
		r !== null && (e.preventDefault(), e.stopPropagation(), this.runKeyboardAction(r).finally(() => {
			this.keyboardDropdownEl?.hide();
		}));
	};
	handleKeyboardDropdownToggle = (e) => {
		let t = e.currentTarget;
		t instanceof HTMLElement && this.toggleAttribute("data-tp-code-editor-keyboard-open", t.hasAttribute("open"));
	};
	async loadSourceAndSyncEditor() {
		let e = await this.resolveSource(), { filename: t, source: n, value: r } = this.overrideValue === null ? e : {
			filename: this.filename,
			source: "api",
			value: this.overrideValue
		};
		this.currentValue = r, this.currentFilename = t, n !== "api" && this.overrideValue !== null && (this.overrideValue = null), this.editor !== null && (this.reconfigureEditor(), this.applyValueToEditor(r), this.scheduleSyncHeight(), this.syncActionPanel(), this.dispatchEvent(new CustomEvent("tp-code-editor-load", {
			bubbles: !0,
			detail: {
				filename: t,
				source: n,
				valueLength: r.length
			}
		})));
	}
	async resolveSource() {
		let n = this.readExplicitLanguage();
		if (this.overrideValue !== null) return this.currentLanguage = n ?? "html", this.clearInlineSourceError(), {
			filename: this.filename,
			source: "api",
			value: this.overrideValue
		};
		let a = t(void 0, this);
		if (a !== null) return this.currentLanguage = this.resolveLanguage(a.language, n), this.clearInlineSourceError(), {
			filename: a.filename || this.filename,
			source: "script",
			value: a.value
		};
		if (this.src !== "") try {
			let t = await e(r(this) ? i(this, this.src).href : this.src);
			return this.currentLanguage = this.resolveLanguage(t.language, n), this.clearInlineSourceError(), {
				filename: this.filename || t.filename,
				source: "src",
				value: t.value
			};
		} catch (e) {
			let t = e instanceof Error ? e.message : "Unknown fetch error";
			return this.currentLanguage = n ?? "html", this.dispatchErrorEvent(t), this.showInlineSourceError(t), {
				filename: this.filename,
				source: "none",
				value: `/* Failed to load src: ${t} */`
			};
		}
		return this.value === "" ? (this.currentLanguage = n ?? "html", this.clearInlineSourceError(), {
			filename: this.filename,
			source: "none",
			value: ""
		}) : (this.currentLanguage = n ?? "html", this.clearInlineSourceError(), {
			filename: this.filename,
			source: "value",
			value: this.value
		});
	}
	resolveLanguage(e, t) {
		let n = e?.trim().toLowerCase() ?? "";
		return n !== "" && n !== "plaintext" ? n : t ?? "html";
	}
	reconfigureEditor() {
		if (this.editor === null) return;
		let e = this.editor.state.doc.toString();
		this.editor.setState(Re.create({
			doc: e,
			extensions: this.buildExtensions()
		}));
	}
	applyValueToEditor(e) {
		this.editor !== null && this.editor.state.doc.toString() !== e && (this.isApplyingExternalValue = !0, this.editor.dispatch({ changes: {
			from: 0,
			insert: e,
			to: this.editor.state.doc.length
		} }), this.isApplyingExternalValue = !1);
	}
	toggleKeyboardDropdown() {
		this.keyboardDropdownEl?.open ? this.keyboardDropdownEl.hide() : this.keyboardDropdownEl?.show();
	}
	buildExtensions() {
		let e = he.of([
			{
				key: "ArrowUp",
				run: () => this.isCursorAtStart() ? this.emitBoundaryIntent("before") : !1
			},
			{
				key: "Backspace",
				run: () => this.isCursorAtStart() ? this.emitBoundaryIntent("before") : !1
			},
			{
				key: "ArrowDown",
				run: () => this.isCursorAtEnd() ? this.emitBoundaryIntent("after") : !1
			},
			{
				key: "Delete",
				run: () => this.isCursorAtEnd() ? this.emitBoundaryIntent("after") : !1
			},
			Vi,
			{
				key: "Mod-Alt-ArrowDown",
				run: (e) => (Le(e), !0)
			},
			{
				key: "Mod-Alt-ArrowUp",
				run: (e) => (Ne(e), !0)
			},
			{
				key: "Mod-Alt-g",
				run: () => (this.toggleGutters(), !0)
			},
			{
				key: "Mod-Alt-l",
				run: () => (this.toggleLineNumbers(), !0)
			},
			{
				key: "Mod-Alt-f",
				run: (e) => (Ma(e), !0)
			},
			{
				key: "Mod-g",
				run: (e) => (Qi(e), !0)
			},
			{
				key: "Mod-Alt-c",
				run: (e) => (En(e), !0)
			},
			{
				key: "Mod-Alt-b",
				run: (e) => (Dn(e), !0)
			},
			{
				key: "F1",
				run: () => (this.toolbar = !this.toolbar, !0)
			},
			{
				key: "Mod-Shift-p",
				run: (e) => (e.focus(), this.toggleKeyboardDropdown(), !0)
			}
		]), t = [
			this.commentCompartment.of(this.commentExtension()),
			e,
			he.of([
				...Bi,
				...rr,
				...Pa
			]),
			Bn(),
			ge(),
			...this.panelContainer === null ? [] : [o({
				topContainer: this.panelContainer,
				bottomContainer: this.panelContainer
			})],
			We.of(() => ({
				dom: this.ensureActionPanel(),
				top: !0
			})),
			Ah,
			kh,
			b.editorAttributes.of({ dir: "ltr" }),
			b.contentAttributes.of({
				"aria-label": this.getAttribute("aria-label")?.trim() || "Code editor",
				dir: "ltr",
				spellcheck: "false",
				tabindex: "0"
			}),
			b.updateListener.of((e) => {
				(e.docChanged || e.selectionSet) && this.syncCursorPosition(), e.docChanged && (this.currentValue = e.state.doc.toString(), this.scheduleSyncHeight(), !this.isApplyingExternalValue && (this.dispatchEvent(new CustomEvent("tp-code-editor-input", {
					bubbles: !0,
					detail: {
						filename: this.currentFilename,
						value: this.currentValue
					}
				})), this.dispatchEvent(new CustomEvent("tp-code-editor-change", {
					bubbles: !0,
					detail: {
						filename: this.currentFilename,
						value: this.currentValue
					}
				}))));
			})
		];
		switch (this.placeholder !== "" && t.push(we(this.placeholder)), this.currentLanguage) {
			case "abc":
				t.push(at), t.push(it);
				break;
			case "asciidoc":
				t.push(wh), t.push(jh);
				break;
			case "json":
				t.push(iu());
				break;
			case "javascript":
				t.push(xl());
				break;
			case "typescript":
				t.push(xl({ typescript: !0 }));
				break;
			case "css":
				t.push(us());
				break;
			case "python":
				t.push(im());
				break;
			case "markdown":
				t.push(tf()), t.push(Bh), t.push(Vh);
				break;
			case "html":
				t.push(Ql());
				break;
			case "sql":
				t.push(vh()), t.push(xn({ override: [bh] }));
				break;
			case "prolog":
				t.push(xh);
				break;
			case "restructuredtext":
				t.push(Oh), t.push(Eh), t.push(Mh), t.push(Nh);
				break;
		}
		return this.readonly && t.push(b.editable.of(!1)), this.lineNumbers && t.push(_e()), this.foldGutter && t.push(ke()), this.wordWrap && t.push(b.lineWrapping), t;
	}
	syncHeight() {
		if (this.container === null) return;
		let e = this.container.querySelector(".cm-editor");
		if (!(e instanceof HTMLElement)) return;
		let t = this.container.querySelector(".cm-content"), n = this.container.querySelector(".cm-line"), r = n instanceof HTMLElement ? Math.max(Math.ceil(Number.parseFloat(getComputedStyle(n).lineHeight) || 20), 20) : 20, i = 0, a = 0;
		if (t instanceof HTMLElement) {
			let e = getComputedStyle(t);
			i = Number.parseFloat(e.paddingTop) || 0, a = Number.parseFloat(e.paddingBottom) || 0;
		}
		let o = Math.ceil(2 * r + i + a), s = Math.max(this.getContentHeight(), o), c = 0;
		if (this.panelContainer instanceof HTMLElement) {
			let e = this.panelContainer.getBoundingClientRect(), t = getComputedStyle(this.panelContainer), n = Number.parseFloat(t.marginTop) || 0, r = Number.parseFloat(t.marginBottom) || 0;
			c = Math.ceil(e.height + n + r);
		}
		let l = getComputedStyle(this), u = (Number.parseFloat(l.borderBlockStartWidth) || 0) + (Number.parseFloat(l.borderBlockEndWidth) || 0);
		this.container.style.blockSize = `${String(Math.ceil(s))}px`, this.style.blockSize = `${String(Math.ceil(s + c + u))}px`, e.style.blockSize = "100%";
	}
	scheduleSyncHeight() {
		this.syncHeight(), this.editor?.requestMeasure({
			read: () => void 0,
			write: () => {
				this.syncHeight();
			}
		}), queueMicrotask(() => {
			this.syncHeight();
		}), requestAnimationFrame(() => {
			this.syncHeight(), requestAnimationFrame(() => {
				this.editor?.requestMeasure(), this.syncHeight();
			});
		}), setTimeout(() => {
			this.syncHeight();
		}, 0);
	}
	ensureActionPanel() {
		let { mod: e, shift: t, alt: n } = this.getShortcutLabels();
		this.querySelector(":scope > [data-tp-code-editor-overlay]")?.remove();
		let r = this.actionPanelEl;
		r instanceof HTMLDivElement || (r = document.createElement("div"), r.classList.add("cm-panel"), r.setAttribute("data-tp-code-editor-action-panel", ""), this.actionPanelEl = r);
		let i = this.ensureActionPanelSection(r, "start"), o = this.ensureActionPanelSection(r, "center"), s = this.ensureActionPanelSection(r, "end"), c = r.querySelector("tp-badge[data-tp-code-editor-language-badge]");
		c instanceof HTMLElement || (c = document.createElement("tp-badge"), c.setAttribute("data-tp-code-editor-language-badge", "")), c instanceof HTMLElement && (c.setAttribute("size", "xs"), c.setAttribute("outlined", ""), i.append(c)), this.languageBadgeEl = c instanceof HTMLElement ? c : null;
		let l = r.querySelector("[data-tp-code-editor-cursor-position]");
		l instanceof HTMLSpanElement || (l = document.createElement("span"), l.setAttribute("data-tp-code-editor-cursor-position", "")), i.append(l), this.cursorPositionEl = l;
		let u = r.querySelector("tp-copy-code[data-tp-code-editor-copy]");
		u instanceof HTMLElement || (u = document.createElement("tp-copy-code"), u.setAttribute("data-tp-code-editor-copy", "")), u instanceof HTMLElement && (u.setAttribute("size", "xs"), u.forElement = this);
		let d = r.querySelector("tp-theme[data-tp-code-editor-theme]");
		d instanceof HTMLElement || (d = document.createElement("tp-theme"), d.setAttribute("data-tp-code-editor-theme", ""), this.classList.contains("tp-dark") ? d.setAttribute("mode", "dark") : this.classList.contains("tp-light") && d.setAttribute("mode", "light")), d instanceof HTMLElement && (d.hasAttribute("mode") || (this.classList.contains("tp-dark") ? d.setAttribute("mode", "dark") : this.classList.contains("tp-light") && d.setAttribute("mode", "light")), d.setAttribute("anchor", `#${this.ensureThemeTargetId()}`), this.syncThemeDropdownPlacement(d));
		let f = r.querySelector("tp-fullscreen[data-tp-code-editor-fullscreen]");
		f instanceof HTMLElement || (f = document.createElement("tp-fullscreen"), f.setAttribute("data-tp-code-editor-fullscreen", "")), f instanceof HTMLElement && f.setAttribute("anchor", `#${this.ensureThemeTargetId()}`);
		let p = r.querySelector("[data-tp-code-editor-keyboard-button]");
		if (!(p instanceof HTMLElement)) {
			let e = document.createElement("tp-icon-button");
			e.id = this.keyboardId, e.setAttribute("data-tp-code-editor-keyboard-button", ""), e.setAttribute("name", "keyboard-outline"), e.setAttribute("size", "xs"), e.setAttribute("label", "Keyboard shortcuts"), r.append(e), p = e;
		}
		p instanceof HTMLElement && p.setAttribute("size", "xs"), p instanceof HTMLElement && s.append(p), u instanceof HTMLElement && s.append(u), d instanceof HTMLElement && s.append(d), f instanceof HTMLElement && s.append(f), o.childElementCount === 0 && o.replaceChildren(), this.querySelector(":scope > [data-tp-code-editor-keyboard-dropdown]")?.remove(), r.querySelector(":scope > [data-tp-code-editor-keyboard-dropdown]")?.remove();
		let m = this.keyboardDropdownEl;
		if (!(m instanceof a) || !m.isConnected) {
			let r = document.createElement("tp-dropdown");
			r.setAttribute("data-tp-code-editor-keyboard-dropdown", ""), r.setAttribute("data-tp-dropdown-align", "end"), r.setAttribute("anchor", `#${p.id}`), r.setAttribute("placement", "bottom"), r.setAttribute("outside-click", ""), r.innerHTML = `
      <ul>
        <li data-tp-code-editor-keyboard-action="undo">
          <span>Undo</span><kbd>${e} Z</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="redo">
          <span>Redo</span><kbd>${e} ${t} Z</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="copy">
          <span>Copy</span><kbd>${e} C</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="cut">
          <span>Cut</span><kbd>${e} X</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="paste">
          <span>Paste</span><kbd>${e} V</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="select-all">
          <span>Select all</span><kbd>${e} A</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="fold-code">
          <span>Fold code</span><kbd>${e} ${n} ↓</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="unfold-code">
          <span>Unfold code</span><kbd>${e} ${n} ↑</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-gutters">
          <span>Toggle gutters</span><kbd>${e} ${n} G</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-line-numbers">
          <span>Toggle line numbers</span><kbd>${e} ${n} L</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="indent">
          <span>Indent</span><kbd>Tab</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="dedent">
          <span>Dedent</span><kbd>${t} Tab</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="search">
          <span>Search</span><kbd>${e} F</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="replace">
          <span>Replace</span><kbd>${e} ${n} F</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="goto-line">
          <span>Go to line</span><kbd>${e} G</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="toggle-line-comment">
          <span>Toggle line comment</span><kbd>${e} ${n} C</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-block-comment">
          <span>Toggle block comment</span><kbd>${e} ${n} B</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-command-palette-hint data-tp-code-editor-keyboard-action="toggle-command-palette">
          <span>Toggle Command Palette</span><kbd>${e} ${t} P</kbd>
        </li>

        <li data-tp-code-editor-keyboard-action="toggle-toolbar">
          <span>Toggle toolbar</span><kbd>F1</kbd>
        </li>

      </ul>
    `, document.body.append(r), m = r;
		}
		return m.parentElement !== document.body && document.body.append(m), m.setAttribute("anchor", `#${p.id}`), m.setAttribute("placement", "bottom"), m.setAttribute("data-tp-dropdown-align", "end"), m.setAttribute("outside-click", ""), p.onclick = (e) => {
			e.preventDefault(), e.stopPropagation(), m.toggle();
		}, m.removeEventListener("click", this.handleKeyboardDropdownClick), m.addEventListener("click", this.handleKeyboardDropdownClick), m.removeEventListener("tp-dropdown-toggle", this.handleKeyboardDropdownToggle), m.addEventListener("tp-dropdown-toggle", this.handleKeyboardDropdownToggle), m.style.setProperty("-webkit-overflow-scrolling", "touch"), this.keyboardDropdownEl = m, r;
	}
	ensureActionPanelSection(e, t) {
		let n = e.querySelector(`:scope > [data-tp-code-editor-action-section="${t}"]`);
		return n instanceof HTMLElement || (n = document.createElement("div"), n.setAttribute("data-tp-code-editor-action-section", t), e.append(n)), n;
	}
	syncThemeDropdownPlacement(e) {
		let t = () => {
			let t = e.querySelector(":scope > tp-dropdown");
			t instanceof HTMLElement && t.setAttribute("placement", "start");
		};
		t(), setTimeout(t, 0);
	}
	ensureThemeTargetId() {
		return this.id === "" && (this.id = this.generatedThemeTargetId), this.id;
	}
	syncActionPanel() {
		this.ensureActionPanel(), this.languageBadgeEl instanceof HTMLElement && (this.languageBadgeEl.textContent = this.currentLanguage), this.syncCursorPosition();
	}
	syncCursorPosition() {
		if (!(this.cursorPositionEl instanceof HTMLElement) || this.editor === null) return;
		let e = this.editor.state.selection.main, t = this.editor.state.doc.lineAt(e.head), n = e.head - t.from + 1;
		this.cursorPositionEl.textContent = `Ln ${String(t.number)}, Col ${String(n)}`, this.cursorPositionEl.setAttribute("aria-label", `Line ${String(t.number)}, column ${String(n)}`);
	}
	ensureContainer() {
		let e = this.querySelector(":scope > [data-tp-code-editor]"), t = this.querySelector(":scope > [data-tp-code-editor-panels]");
		if (e instanceof HTMLDivElement) this.container = e;
		else {
			let e = document.createElement("div");
			e.setAttribute("data-tp-code-editor", ""), this.append(e), this.container = e;
		}
		if (t instanceof HTMLDivElement) this.panelContainer = t;
		else {
			let e = document.createElement("div");
			e.setAttribute("data-tp-code-editor-panels", ""), this.insertBefore(e, this.container), this.panelContainer = e;
		}
		if (this.panelContainer instanceof HTMLDivElement && this.container instanceof HTMLDivElement && this.panelContainer.nextElementSibling !== this.container && this.insertBefore(this.panelContainer, this.container), this.panelContainer === null) {
			this.sourceErrorElement = null;
			return;
		}
		let n = this.panelContainer.querySelector(":scope > [data-tp-code-editor-source-error]");
		if (n instanceof HTMLDivElement) {
			this.sourceErrorElement = n;
			return;
		}
		let r = document.createElement("div");
		r.setAttribute("data-tp-code-editor-source-error", ""), r.setAttribute("role", "alert"), r.hidden = !0, this.panelContainer.append(r), this.sourceErrorElement = r;
	}
	startPanelObserver() {
		typeof MutationObserver > "u" || this.panelContainer === null || (this.panelObserver?.disconnect(), this.panelObserver = new MutationObserver(() => {
			this.scheduleSyncHeight();
		}), this.panelObserver.observe(this.panelContainer, {
			childList: !0,
			subtree: !0
		}));
	}
	startLayoutObserver() {
		typeof ResizeObserver > "u" || this.container === null || (this.layoutObserver?.disconnect(), this.layoutObserver = new ResizeObserver((e) => {
			let t = Math.ceil(e[0]?.contentRect.width ?? 0);
			t !== this.observedInlineSize && (this.observedInlineSize = t, this.editor?.requestMeasure(), this.scheduleSyncHeight());
		}), this.layoutObserver.observe(this.container));
	}
	ensureStyles() {
		if (document.getElementById(s.styleId)) return;
		let e = document.createElement("style");
		e.id = s.styleId, e.textContent = Va, document.head.append(e);
	}
	readExplicitLanguage() {
		let e = this.getAttribute("language");
		if (e === null) return;
		let t = e.trim().toLowerCase();
		return t === "" ? void 0 : t;
	}
	dispatchErrorEvent(e) {
		this.dispatchEvent(new CustomEvent("tp-code-editor-error", {
			bubbles: !0,
			detail: { message: e }
		}));
	}
	showInlineSourceError(e) {
		this.sourceErrorElement instanceof HTMLDivElement && (this.sourceErrorElement.textContent = e, this.sourceErrorElement.hidden = !1, this.scheduleSyncHeight());
	}
	clearInlineSourceError() {
		this.sourceErrorElement instanceof HTMLDivElement && (this.sourceErrorElement.hidden || (this.sourceErrorElement.textContent = "", this.sourceErrorElement.hidden = !0, this.scheduleSyncHeight()));
	}
};
customElements.get("tp-code-editor") || customElements.define("tp-code-editor", Hh);
//#endregion
export { Oh as a, Eh as c, Ah as d, Bh as f, xh as i, bh as l, jh as n, Nh as o, Vh as p, wh as r, Mh as s, Hh as t, kh as u };

//# sourceMappingURL=code-editor.js.map