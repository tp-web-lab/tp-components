//#region ../node_modules/.pnpm/js-yaml@5.2.2/node_modules/js-yaml/dist/js-yaml.mjs
var e = Symbol("NOT_RESOLVED"), t = Symbol("MERGE_KEY");
function n(e, t) {
	return {
		tagName: e,
		nodeKind: "scalar",
		implicit: t.implicit ?? !1,
		matchByTagPrefix: t.matchByTagPrefix ?? !1,
		implicitFirstChars: t.implicitFirstChars ?? null,
		resolve: t.resolve,
		identify: t.identify ?? null,
		represent: t.represent ?? ((e) => String(e)),
		representTagName: t.representTagName ?? null
	};
}
function r(e, t) {
	let n = t.finalize === void 0;
	return {
		tagName: e,
		nodeKind: "sequence",
		implicit: !1,
		matchByTagPrefix: t.matchByTagPrefix ?? !1,
		create: t.create,
		addItem: t.addItem,
		finalize: t.finalize ?? ((e) => e),
		carrierIsResult: n,
		identify: t.identify ?? null,
		represent: t.represent ?? ((e) => e),
		representTagName: t.representTagName ?? null
	};
}
function i(e, t) {
	let n = t.finalize === void 0;
	return {
		tagName: e,
		nodeKind: "mapping",
		implicit: !1,
		matchByTagPrefix: t.matchByTagPrefix ?? !1,
		create: t.create,
		addPair: t.addPair,
		has: t.has,
		keys: t.keys,
		get: t.get,
		finalize: t.finalize ?? ((e) => e),
		carrierIsResult: n,
		identify: t.identify ?? null,
		represent: t.represent ?? ((e) => e),
		representTagName: t.representTagName ?? null
	};
}
var a = n("tag:yaml.org,2002:str", {
	resolve: (e) => e,
	identify: (e) => typeof e == "string"
}), o = [
	"",
	"~",
	"null",
	"Null",
	"NULL"
], s = n("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: [
		"",
		"~",
		"n",
		"N"
	],
	resolve: (t) => o.indexOf(t) === -1 ? e : null,
	identify: (e) => e === null,
	represent: () => "null"
}), c = n("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: ["n"],
	resolve: (t, n) => t === "null" || n && t === "" ? null : e,
	identify: (e) => e === null,
	represent: () => "null"
}), l = [
	"",
	"~",
	"null",
	"Null",
	"NULL"
], u = n("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: [
		"",
		"~",
		"n",
		"N"
	],
	resolve: (t) => l.indexOf(t) === -1 ? e : null,
	identify: (e) => e === null,
	represent: () => "null"
}), d = [
	"true",
	"True",
	"TRUE"
], f = [
	"false",
	"False",
	"FALSE"
], p = n("tag:yaml.org,2002:bool", {
	implicit: !0,
	implicitFirstChars: [
		"t",
		"T",
		"f",
		"F"
	],
	resolve: (t) => d.indexOf(t) !== -1 || f.indexOf(t) === -1 && e,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), ee = ["true"], te = ["false"], ne = n("tag:yaml.org,2002:bool", {
	implicit: !0,
	implicitFirstChars: ["t", "f"],
	resolve: (t) => ee.indexOf(t) !== -1 || te.indexOf(t) === -1 && e,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), re = [
	"true",
	"True",
	"TRUE",
	"y",
	"Y",
	"yes",
	"Yes",
	"YES",
	"on",
	"On",
	"ON"
], ie = [
	"false",
	"False",
	"FALSE",
	"n",
	"N",
	"no",
	"No",
	"NO",
	"off",
	"Off",
	"OFF"
], ae = n("tag:yaml.org,2002:bool", {
	implicit: !0,
	implicitFirstChars: [
		"y",
		"Y",
		"n",
		"N",
		"t",
		"T",
		"f",
		"F",
		"o",
		"O"
	],
	resolve: (t) => re.indexOf(t) !== -1 || ie.indexOf(t) === -1 && e,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), oe = /* @__PURE__ */ RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"), se = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function ce(e) {
	let t = e, n = 1;
	return (t[0] === "-" || t[0] === "+") && (t[0] === "-" && (n = -1), t = t.slice(1)), t.startsWith("0b") ? n * parseInt(t.slice(2), 2) : t.startsWith("0o") ? n * parseInt(t.slice(2), 8) : t.startsWith("0x") ? n * parseInt(t.slice(2), 16) : n * parseInt(t, 10);
}
function le(t, n) {
	if (n) {
		if (!se.test(t)) return e;
	} else if (!oe.test(t)) return e;
	let r = ce(t);
	return Number.isFinite(r) ? r : e;
}
var ue = n("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		..."0123456789"
	],
	resolve: le,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), de = /* @__PURE__ */ RegExp("^-?(?:0|[1-9][0-9]*)$"), fe = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function pe(e) {
	let t = e, n = 1;
	return (t[0] === "-" || t[0] === "+") && (t[0] === "-" && (n = -1), t = t.slice(1)), t.startsWith("0b") ? n * parseInt(t.slice(2), 2) : t.startsWith("0o") ? n * parseInt(t.slice(2), 8) : t.startsWith("0x") ? n * parseInt(t.slice(2), 16) : n * parseInt(t, 10);
}
function me(t, n) {
	if (n) {
		if (!fe.test(t)) return e;
	} else if (!de.test(t)) return e;
	let r = pe(t);
	return Number.isFinite(r) ? r : e;
}
var he = n("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: ["-", ..."0123456789"],
	resolve: me,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), ge = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");
function _e(e) {
	let t = e.replace(/_/g, ""), n = 1;
	if ((t[0] === "-" || t[0] === "+") && (t[0] === "-" && (n = -1), t = t.slice(1)), t.startsWith("0b")) return n * parseInt(t.slice(2), 2);
	if (t.startsWith("0x")) return n * parseInt(t.slice(2), 16);
	if (t.includes(":")) {
		let e = 0;
		for (let n of t.split(":")) e = e * 60 + Number(n);
		return n * e;
	}
	return t !== "0" && t[0] === "0" ? n * parseInt(t, 8) : n * parseInt(t, 10);
}
function ve(t) {
	if (!ge.test(t)) return e;
	let n = _e(t);
	return Number.isFinite(n) ? n : e;
}
var ye = n("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		..."0123456789"
	],
	resolve: ve,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), be = /* @__PURE__ */ RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), xe = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Se(t) {
	if (!be.test(t)) return e;
	let n = t.toLowerCase(), r = n[0] === "-" ? -1 : 1;
	if ("+-".includes(n[0]) && (n = n.slice(1)), n === ".inf") return r === 1 ? Infinity : -Infinity;
	if (n === ".nan") return NaN;
	let i = r * parseFloat(n);
	return Number.isFinite(i) || xe.test(t) ? i : e;
}
function Ce(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var we = n("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		".",
		..."0123456789"
	],
	resolve: Se,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: Ce
}), Te = /* @__PURE__ */ RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"), Ee = /* @__PURE__ */ RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function De(t, n) {
	if (n) {
		if (!Ee.test(t)) return e;
		let n = t.toLowerCase(), r = n[0] === "-" ? -1 : 1;
		if ("+-".includes(n[0]) && (n = n.slice(1)), n === ".inf") return r === 1 ? Infinity : -Infinity;
		if (n === ".nan") return NaN;
		let i = r * parseFloat(n);
		return Number.isFinite(i) ? i : e;
	}
	if (!Te.test(t)) return e;
	let r = Number(t);
	return Number.isFinite(r) ? r : e;
}
function Oe(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var ke = n("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: ["-", ..."0123456789"],
	resolve: De,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: Oe
}), Ae = /* @__PURE__ */ RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), je = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Me(t) {
	if (!Ae.test(t)) return e;
	let n = t.toLowerCase().replace(/_/g, ""), r = n[0] === "-" ? -1 : 1;
	if ("+-".includes(n[0]) && (n = n.slice(1)), n === ".inf") return r === 1 ? Infinity : -Infinity;
	if (n === ".nan") return NaN;
	let i = 0;
	if (n.includes(":")) {
		for (let e of n.split(":")) i = i * 60 + Number(e);
		i *= r;
	} else i = r * parseFloat(n);
	return Number.isFinite(i) || je.test(t) ? i : e;
}
function Ne(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var m = n("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		".",
		..."0123456789"
	],
	resolve: Me,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: Ne
}), Pe = n("tag:yaml.org,2002:merge", {
	implicit: !0,
	implicitFirstChars: ["<"],
	resolve: (n, r) => n === "<<" || r && n === "" ? t : e
}), Fe = /^[A-Za-z0-9+/]*={0,2}$/;
function Ie(t) {
	let n = t.replace(/\s/g, "");
	if (n.length % 4 != 0 || !Fe.test(n)) return e;
	let r = atob(n), i = new Uint8Array(r.length);
	for (let e = 0; e < r.length; e++) i[e] = r.charCodeAt(e);
	return i;
}
function Le(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
	return btoa(t);
}
var Re = n("tag:yaml.org,2002:binary", {
	resolve: Ie,
	identify: (e) => Object.prototype.toString.call(e) === "[object Uint8Array]",
	represent: Le
}), ze = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), Be = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function Ve(t) {
	let n = ze.exec(t);
	if (n === null && (n = Be.exec(t)), n === null) return e;
	let r = +n[1], i = n[2] - 1, a = +n[3];
	if (!n[4]) {
		let t = new Date(Date.UTC(r, i, a));
		return t.getUTCFullYear() !== r || t.getUTCMonth() !== i || t.getUTCDate() !== a ? e : t;
	}
	let o = +n[4], s = +n[5], c = +n[6], l = 0;
	if (o > 23 || s > 59 || c > 59) return e;
	if (n[7]) {
		let e = n[7].slice(0, 3);
		for (; e.length < 3;) e += "0";
		l = +e;
	}
	let u = new Date(Date.UTC(r, i, a, o, s, c, l));
	if (u.getUTCFullYear() !== r || u.getUTCMonth() !== i || u.getUTCDate() !== a) return e;
	if (n[9]) {
		let t = +n[10], r = +(n[11] || 0);
		if (t > 23 || r > 59) return e;
		let i = (t * 60 + r) * 6e4;
		u.setTime(u.getTime() - (n[9] === "-" ? -i : i));
	}
	return u;
}
var He = n("tag:yaml.org,2002:timestamp", {
	implicit: !0,
	implicitFirstChars: [..."0123456789"],
	resolve: Ve,
	identify: (e) => e instanceof Date,
	represent: (e) => e.toISOString()
}), Ue = r("tag:yaml.org,2002:seq", {
	create: () => [],
	addItem: (e, t) => {
		e.push(t);
	},
	identify: Array.isArray
});
function h(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === null || t === Object.prototype;
}
function We(e, t) {
	let n = {};
	for (let r of t) e[r] !== void 0 && (n[r] = e[r]);
	return n;
}
var Ge = r("tag:yaml.org,2002:omap", {
	create: () => ({
		list: [],
		seen: /* @__PURE__ */ new Set()
	}),
	addItem: (e, t) => {
		let n;
		if (t instanceof Map) {
			if (t.size !== 1) return "cannot resolve an ordered map item";
			n = t.keys().next().value;
		} else if (h(t)) {
			let e = Object.keys(t);
			if (e.length !== 1) return "cannot resolve an ordered map item";
			n = e[0];
		} else return "cannot resolve an ordered map item";
		return e.seen.has(n) ? "duplicate key in ordered map" : (e.seen.add(n), e.list.push(t), "");
	},
	finalize: (e) => e.list
}), Ke = r("tag:yaml.org,2002:pairs", {
	create: () => [],
	addItem: (e, t) => {
		if (t instanceof Map) return t.size === 1 ? (e.push(t.entries().next().value), "") : "cannot resolve a pairs item";
		if (Object.prototype.toString.call(t) !== "[object Object]") return "cannot resolve a pairs item";
		let n = t, r = Object.keys(n);
		return r.length === 1 ? (e.push([r[0], n[r[0]]]), "") : "cannot resolve a pairs item";
	}
}), qe = i("tag:yaml.org,2002:map", {
	create: () => ({}),
	identify: h,
	represent: (e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of Object.keys(e)) t.set(n, e[n]);
		return t;
	},
	addPair: (e, t, n) => {
		if (typeof t == "object" && t) return "object-based map does not support complex keys";
		let r = String(t);
		return r === "__proto__" ? Object.defineProperty(e, r, {
			value: n,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = n, "";
	},
	has: (e, t) => typeof t == "object" && t ? !1 : Object.prototype.hasOwnProperty.call(e, String(t)),
	keys: (e) => Object.keys(e),
	get: (e, t) => e[String(t)]
}), Je = i("tag:yaml.org,2002:set", {
	create: () => /* @__PURE__ */ new Set(),
	identify: (e) => e instanceof Set,
	represent: (e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) t.set(n, null);
		return t;
	},
	addPair: (e, t, n) => n === null ? (e.add(t), "") : "cannot resolve a set item",
	has: (e, t) => e.has(t),
	keys: (e) => e.keys(),
	get: () => null
});
function Ye() {
	return {
		scalar: {},
		sequence: {},
		mapping: {}
	};
}
function Xe() {
	return {
		scalar: [],
		sequence: [],
		mapping: []
	};
}
function Ze(e) {
	let t = [];
	for (let n of e) {
		let e = t.length;
		for (let r = 0; r < t.length; r++) {
			let i = t[r];
			if (i.nodeKind === n.nodeKind && i.tagName === n.tagName && i.matchByTagPrefix === n.matchByTagPrefix) {
				e = r;
				break;
			}
		}
		t[e] = n;
	}
	return t;
}
var g = class e {
	tags;
	implicitScalarTags;
	implicitScalarByFirstChar;
	implicitScalarAnyFirstChar;
	defaultScalarTag;
	defaultSequenceTag;
	defaultMappingTag;
	exact;
	prefix;
	constructor(e) {
		let t = Ze(e), n = [], r = Ye(), i = Xe();
		for (let e of t) {
			if (e.nodeKind === "scalar" && e.implicit) {
				if (e.matchByTagPrefix) throw Error("Implicit scalar tags cannot match by tag prefix");
				n.push(e);
			}
			switch (e.nodeKind) {
				case "scalar":
					e.matchByTagPrefix ? i.scalar.push(e) : r.scalar[e.tagName] = e;
					break;
				case "sequence":
					e.matchByTagPrefix ? i.sequence.push(e) : r.sequence[e.tagName] = e;
					break;
				case "mapping":
					e.matchByTagPrefix ? i.mapping.push(e) : r.mapping[e.tagName] = e;
					break;
			}
		}
		let a = n.filter((e) => e.implicitFirstChars === null), o = /* @__PURE__ */ new Set();
		for (let e of n) if (e.implicitFirstChars !== null) for (let t of e.implicitFirstChars) o.add(t);
		let s = /* @__PURE__ */ new Map();
		for (let e of o) s.set(e, n.filter((t) => t.implicitFirstChars === null || t.implicitFirstChars.indexOf(e) !== -1));
		let c = r.scalar["tag:yaml.org,2002:str"];
		if (!c) throw Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");
		this.tags = t, this.implicitScalarTags = n, this.implicitScalarByFirstChar = s, this.implicitScalarAnyFirstChar = a, this.defaultScalarTag = c, this.defaultSequenceTag = r.sequence["tag:yaml.org,2002:seq"], this.defaultMappingTag = r.mapping["tag:yaml.org,2002:map"], this.exact = r, this.prefix = i;
	}
	withTags(...t) {
		let n = [];
		for (let e of t) n = n.concat(e);
		return new e([...this.tags, ...n]);
	}
}, _ = new g([
	a,
	Ue,
	qe
]);
new g([
	..._.tags,
	c,
	ne,
	he,
	ke
]);
var Qe = new g([
	..._.tags,
	s,
	p,
	ue,
	we
]), $e = new g([
	..._.tags,
	u,
	ae,
	ye,
	m,
	He,
	Pe,
	Re,
	Ge,
	Ke,
	Je
]);
i("tag:yaml.org,2002:map", {
	create: () => /* @__PURE__ */ new Map(),
	addPair: (e, t, n) => (e.set(t, n), ""),
	has: (e, t) => e.has(t),
	keys: (e) => e.keys(),
	get: (e, t) => e.get(t),
	identify: (e) => e instanceof Map || h(e),
	represent: (e) => {
		if (e instanceof Map) return e;
		let t = /* @__PURE__ */ new Map(), n = e;
		for (let e of Object.keys(n)) t.set(e, n[e]);
		return t;
	}
});
function et(e) {
	if (Array.isArray(e)) {
		let t = Array.prototype.slice.call(e);
		for (let e = 0; e < t.length; e++) {
			if (Array.isArray(t[e])) return null;
			typeof t[e] == "object" && Object.prototype.toString.call(t[e]) === "[object Object]" && (t[e] = "[object Object]");
		}
		return String(t);
	}
	return typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" ? "[object Object]" : String(e);
}
i("tag:yaml.org,2002:map", {
	create: () => ({}),
	identify: h,
	represent: (e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of Object.keys(e)) t.set(n, e[n]);
		return t;
	},
	addPair: (e, t, n) => {
		let r = et(t);
		return r === null ? "nested arrays are not supported inside keys" : (r === "__proto__" ? Object.defineProperty(e, r, {
			value: n,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = n, "");
	},
	has: (e, t) => {
		let n = et(t);
		return n !== null && Object.prototype.hasOwnProperty.call(e, n);
	},
	keys: (e) => Object.keys(e),
	get: (e, t) => e[String(t)]
});
var tt = {
	maxLength: 79,
	indent: 1,
	linesBefore: 3,
	linesAfter: 2
};
function v(e, t, n, r, i) {
	let a = "", o = "", s = Math.floor(i / 2) - 1;
	return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, "→") + o,
		pos: r - t + a.length
	};
}
function y(e, t) {
	return " ".repeat(Math.max(t - e.length, 0)) + e;
}
function nt(e, t) {
	if (!e.buffer) return null;
	let n = {
		...tt,
		...t
	}, r = /\r?\n|\r|\0/g, i = [0], a = [], o, s = -1;
	for (; o = r.exec(e.buffer);) a.push(o.index), i.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = i.length - 2);
	s < 0 && (s = i.length - 1);
	let c = "", l = Math.min(e.line + n.linesAfter, a.length).toString().length, u = n.maxLength - (n.indent + l + 3);
	for (let t = 1; t <= n.linesBefore && !(s - t < 0); t++) {
		let r = v(e.buffer, i[s - t], a[s - t], e.position - (i[s] - i[s - t]), u);
		c = `${" ".repeat(n.indent)}${y((e.line - t + 1).toString(), l)} | ${r.str}\n${c}`;
	}
	let d = v(e.buffer, i[s], a[s], e.position, u);
	c += `${" ".repeat(n.indent)}${y((e.line + 1).toString(), l)} | ${d.str}\n`, c += `${"-".repeat(n.indent + l + 3 + d.pos)}^\n`;
	for (let t = 1; t <= n.linesAfter && !(s + t >= a.length); t++) {
		let r = v(e.buffer, i[s + t], a[s + t], e.position - (i[s] - i[s + t]), u);
		c += `${" ".repeat(n.indent)}${y((e.line + t + 1).toString(), l)} | ${r.str}\n`;
	}
	return c.replace(/\n$/, "");
}
function rt(e, t) {
	let n = "";
	return e.mark ? (e.mark.name && (n += `in "${e.mark.name}" `), n += `(${e.mark.line + 1}:${e.mark.column + 1})`, !t && e.mark.snippet && (n += `\n\n${e.mark.snippet}`), `${e.reason} ${n}`) : e.reason;
}
var b = class extends Error {
	reason;
	mark;
	constructor(e, t) {
		super(), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = rt(this, !1), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}
	toString(e) {
		return `${this.name}: ${rt(this, e)}`;
	}
};
function x(e, t, n, r = "") {
	let i = 0, a = 0;
	for (let n = 0; n < t; n++) {
		let t = e.charCodeAt(n);
		t === 10 ? (i++, a = n + 1) : t === 13 && (i++, e.charCodeAt(n + 1) === 10 && n++, a = n + 1);
	}
	let o = {
		name: r,
		buffer: e,
		position: t,
		line: i,
		column: t - a
	};
	throw o.snippet = nt(o), new b(n, o);
}
var it = -1;
function at(e) {
	switch (e) {
		case 48: return "\0";
		case 97: return "\x07";
		case 98: return "\b";
		case 116: return "	";
		case 9: return "	";
		case 110: return "\n";
		case 118: return "\v";
		case 102: return "\f";
		case 114: return "\r";
		case 101: return "\x1B";
		case 32: return " ";
		case 34: return "\"";
		case 47: return "/";
		case 92: return "\\";
		case 78: return "";
		case 95: return "\xA0";
		case 76: return "\u2028";
		case 80: return "\u2029";
		default: return "";
	}
}
var ot = Array(256), st = Array(256);
for (let e = 0; e < 256; e++) ot[e] = +!!at(e), st[e] = at(e);
function ct(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function lt(e) {
	return e >= 48 && e <= 57 ? e - 48 : (e | 32) - 97 + 10;
}
function ut(e) {
	return e === 120 ? 2 : e === 117 ? 4 : 8;
}
function S(e, t, n) {
	let r = 0;
	for (; t < n;) {
		let n = e.charCodeAt(t);
		if (n === 10) r++, t++;
		else if (n === 13) r++, t++, e.charCodeAt(t) === 10 && t++;
		else if (n === 32 || n === 9) t++;
		else break;
	}
	return {
		position: t,
		breaks: r
	};
}
function C(e) {
	return e === 1 ? " " : "\n".repeat(e - 1);
}
function dt(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = S(e, i, n);
			r += C(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, o);
}
function ft(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 39) r += e.slice(a, i) + "'", i += 2, a = o = i;
		else if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = S(e, i, n);
			r += C(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, n);
}
function pt(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 92) {
			r += e.slice(a, i), i++;
			let t = e.charCodeAt(i);
			if (t === 10 || t === 13) i = S(e, i, n).position;
			else if (t < 256 && ot[t]) r += st[t], i++;
			else {
				let n = ut(t), a = 0;
				for (; n > 0; n--) {
					i++;
					let t = lt(e.charCodeAt(i));
					a = (a << 4) + t;
				}
				r += ct(a), i++;
			}
			a = o = i;
		} else if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = S(e, i, n);
			r += C(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, n);
}
function mt(e, t, n, r, i, a) {
	let o = r < 0 ? 0 : r, s = e.slice(t, n).replace(/\r\n?/g, "\n"), c = s === "" ? [] : (s.endsWith("\n") ? s.slice(0, -1) : s).split("\n"), l = "", u = !1, d = 0, f = !1;
	for (let e of c) {
		let t = 0;
		for (; t < o && e.charCodeAt(t) === 32;) t++;
		if (r < 0 || t >= e.length) {
			d++;
			continue;
		}
		let n = e.slice(o), i = n.charCodeAt(0);
		a ? i === 32 || i === 9 ? (f = !0, l += "\n".repeat(u ? 1 + d : d)) : f ? (f = !1, l += "\n".repeat(d + 1)) : d === 0 ? u && (l += " ") : l += "\n".repeat(d) : l += "\n".repeat(u ? 1 + d : d), l += n, u = !0, d = 0;
	}
	return i === 3 ? l += "\n".repeat(u ? 1 + d : d) : i !== 2 && u && (l += "\n"), l;
}
function ht(e, t) {
	if (t.valueStart === it) return "";
	let { valueStart: n, valueEnd: r } = t;
	if (t.fast) return e.slice(n, r);
	switch (t.style) {
		case 2: return ft(e, n, r);
		case 3: return pt(e, n, r);
		case 4: return mt(e, n, r, t.indent, t.chomping, !1);
		case 5: return mt(e, n, r, t.indent, t.chomping, !0);
		default: return dt(e, n, r);
	}
}
var gt = {
	"!": "!",
	"!!": "tag:yaml.org,2002:"
};
function _t(e, t) {
	if (e.startsWith("!<") && e.endsWith(">")) return decodeURIComponent(e.slice(2, -1));
	let n = e.indexOf("!", 1), r = n === -1 ? "!" : e.slice(0, n + 1), i = t?.[r] ?? gt[r] ?? r;
	return decodeURIComponent(i) + decodeURIComponent(e.slice(r.length));
}
var w = -1, T = {
	filename: "",
	schema: Qe,
	json: !1,
	maxTotalMergeKeys: 1e4,
	maxAliases: -1
};
function vt(e) {
	return "tagStart" in e && e.tagStart !== w ? e.tagStart : "anchorStart" in e && e.anchorStart !== w ? e.anchorStart : "valueStart" in e && e.valueStart !== w ? e.valueStart : "start" in e ? e.start : 0;
}
function E(e, t) {
	x(e.source, e.position, t, e.filename);
}
function yt(e, t, n, r) {
	try {
		return n.finalize(r);
	} catch (n) {
		if (n instanceof b) throw n;
		x(e.source, t, n instanceof Error ? n.message : String(n), e.filename);
	}
}
function D(e, t, n) {
	let r = e[n];
	if (r) return r;
	for (let e of t) if (n.startsWith(e.tagName)) return e;
}
function bt(e, t, n, r, i) {
	let a = D(t, n, r);
	if (a) return a;
	E(e, `unknown ${i} tag !<${r}>`);
}
function xt(t, n) {
	let r = ht(t.source, n), i = n.tagStart === w ? "" : t.source.slice(n.tagStart, n.tagEnd), a = t.schema.defaultScalarTag;
	if (i !== "") {
		if (i === "!") return {
			value: r,
			tag: a
		};
		let n = _t(i, t.tagHandlers), o = D(t.schema.exact.scalar, t.schema.prefix.scalar, n);
		if (o) {
			let i = o.resolve(r, !0, n);
			return i === e && E(t, `cannot resolve a node with !<${n}> explicit tag`), {
				value: i,
				tag: o
			};
		}
		let s = D(t.schema.exact.mapping, t.schema.prefix.mapping, n) ?? D(t.schema.exact.sequence, t.schema.prefix.sequence, n);
		if (s) {
			r !== "" && E(t, `cannot resolve a node with !<${n}> explicit tag`);
			let e = s.create(n);
			return {
				value: s.carrierIsResult ? e : yt(t, t.position, s, e),
				tag: s
			};
		}
		E(t, `unknown scalar tag !<${n}>`);
	}
	if (n.style === 1) {
		let n = t.schema.implicitScalarByFirstChar.get(r.charAt(0)) ?? t.schema.implicitScalarAnyFirstChar;
		for (let t of n) {
			let n = t.resolve(r, !1, t.tagName);
			if (n !== e) return {
				value: n,
				tag: t
			};
		}
	}
	return {
		value: a.resolve(r, !1, a.tagName),
		tag: a
	};
}
function St(e, t, n, r, i, a) {
	let o = t.tagStart === w ? "" : e.source.slice(t.tagStart, t.tagEnd), s = o === "" || o === "!" ? i : _t(o, e.tagHandlers);
	return {
		tagName: s,
		tag: bt(e, n, r, s, a)
	};
}
function Ct(e) {
	return e.nodeKind === "mapping";
}
function wt(e, t, n, r) {
	for (let i of r.keys(n)) {
		if (e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && E(e, `merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`), t.tag.has(t.value, i)) continue;
		let a = t.tag.addPair(t.value, i, r.get(n, i));
		a && E(e, a), (t.overridable ??= /* @__PURE__ */ new Set()).add(i);
	}
}
function Tt(e, t, n, r) {
	if (e.position = t.keyPosition, Ct(r)) wt(e, t, n, r);
	else if (r.nodeKind === "sequence" && Array.isArray(n)) for (let r of n) wt(e, t, r, t.tag);
	else E(e, "cannot merge mappings; the provided source object is unacceptable");
}
function Et(e, n, r, i, a) {
	if (e.position = n.keyPosition, r === t) {
		Tt(e, n, i, a);
		return;
	}
	!e.json && n.tag.has(n.value, r) && !n.overridable?.has(r) && E(e, "duplicated mapping key");
	let o = n.tag.addPair(n.value, r, i);
	o && E(e, o), n.overridable?.delete(r);
}
function O(e, t, n) {
	let r = e.frames[e.frames.length - 1];
	if (r.kind === "document") r.value = t, r.hasValue = !0;
	else if (r.kind === "sequence") {
		r.merge && (Ct(n) || E(e, "cannot merge mappings; the provided source object is unacceptable"));
		let i = r.tag.addItem(r.value, t, r.index++);
		i && E(e, i);
	} else if (r.hasKey) {
		let i = r.key;
		r.key = void 0, r.hasKey = !1, Et(e, r, i, t, n);
	} else r.key = t, r.keyPosition = e.position, r.hasKey = !0;
}
function k(e, t, n, r, i) {
	if (t.anchorStart !== w) {
		let a = {
			value: n,
			tag: r,
			isValueFinal: i
		};
		return e.anchors.set(e.source.slice(t.anchorStart, t.anchorEnd), a), a;
	}
	return null;
}
function Dt(e, n) {
	let r = {
		...T,
		...n,
		events: e,
		documents: [],
		eventIndex: 0,
		position: 0,
		frames: [],
		anchors: /* @__PURE__ */ new Map(),
		tagHandlers: Object.create(null),
		totalMergeKeys: 0,
		aliasCount: 0
	};
	for (; r.eventIndex < r.events.length;) {
		let e = r.events[r.eventIndex++];
		switch (r.position = vt(e), e.type) {
			case 1:
				r.anchors = /* @__PURE__ */ new Map(), r.aliasCount = 0, r.tagHandlers = Object.create(null);
				for (let t of e.directives) t.kind === "tag" && (r.tagHandlers[t.handle] = t.prefix);
				r.frames.push({
					kind: "document",
					position: r.position,
					value: void 0,
					hasValue: !1
				});
				break;
			case 4: {
				let { value: t, tag: n } = xt(r, e);
				k(r, e, t, n, !0), O(r, t, n);
				break;
			}
			case 2: {
				let n = St(r, e, r.schema.exact.sequence, r.schema.prefix.sequence, "tag:yaml.org,2002:seq", "sequence"), i = n.tag.create(n.tagName), a = k(r, e, i, n.tag, n.tag.carrierIsResult), o = r.frames[r.frames.length - 1], s = o !== void 0 && o.kind === "mapping" && o.hasKey && o.key === t;
				r.frames.push({
					kind: "sequence",
					position: r.position,
					value: i,
					tag: n.tag,
					anchor: a,
					index: 0,
					merge: s
				});
				break;
			}
			case 3: {
				let t = St(r, e, r.schema.exact.mapping, r.schema.prefix.mapping, "tag:yaml.org,2002:map", "mapping"), n = t.tag.create(t.tagName), i = k(r, e, n, t.tag, t.tag.carrierIsResult);
				r.frames.push({
					kind: "mapping",
					position: r.position,
					value: n,
					tag: t.tag,
					anchor: i,
					key: void 0,
					keyPosition: r.position,
					hasKey: !1,
					overridable: null
				});
				break;
			}
			case 5: {
				r.maxAliases !== -1 && ++r.aliasCount > r.maxAliases && E(r, `aliases exceeded maxAliases (${r.maxAliases})`);
				let t = r.source.slice(e.anchorStart, e.anchorEnd), n = r.anchors.get(t);
				n || E(r, `unidentified alias "${t}"`), n.isValueFinal || E(r, `recursive alias "${t}" is not supported for tag ${n.tag.tagName} because it uses finalize()`), O(r, n.value, n.tag);
				break;
			}
			case 6: {
				let e = r.frames.pop();
				if (e.kind === "document") r.documents.push(e.value);
				else {
					let t = e.tag.carrierIsResult ? e.value : yt(r, e.position, e.tag, e.value);
					e.anchor && (e.anchor.value = t, e.anchor.isValueFinal = !0), O(r, t, e.tag);
				}
				break;
			}
		}
	}
	return r.documents;
}
var A = -1, Ot = Object.prototype.hasOwnProperty, j = 1, M = 2, kt = 3, N = 4, At = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, jt = /[,\[\]{}]/, Mt = /^(?:!|!!|![0-9A-Za-z-]+!)$/, P = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`, Nt = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`, Pt = RegExp(`^(?:${P})*$`), Ft = RegExp(`^(?:${Nt})+$`), It = RegExp(`^(?:!(?:${P})*|${Nt}(?:${P})*)$`), F = {
	filename: "",
	maxDepth: 100
};
function Lt(e, t, n) {
	e.events.push({
		type: 1,
		explicitStart: t,
		explicitEnd: n,
		directives: e.directives
	});
}
function Rt(e, t, n, r, i, a, o) {
	e.events.push({
		type: 2,
		start: t,
		anchorStart: n,
		anchorEnd: r,
		tagStart: i,
		tagEnd: a,
		style: o
	});
}
function zt(e, t, n, r, i, a, o) {
	e.events.push({
		type: 3,
		start: t,
		anchorStart: n,
		anchorEnd: r,
		tagStart: i,
		tagEnd: a,
		style: o
	});
}
function Bt(e, t) {
	e.events.splice(t.eventsLength, 0, {
		type: 3,
		start: t.position,
		anchorStart: A,
		anchorEnd: A,
		tagStart: A,
		tagEnd: A,
		style: 2
	});
}
function I(e, t, n, r, i, a, o, s, c = 1, l = -1, u = !1) {
	e.events.push({
		type: 4,
		valueStart: t,
		valueEnd: n,
		anchorStart: r,
		anchorEnd: i,
		tagStart: a,
		tagEnd: o,
		style: s,
		chomping: c,
		indent: l,
		fast: u
	});
}
function Vt(e, t, n) {
	e.events.push({
		type: 5,
		anchorStart: t,
		anchorEnd: n
	});
}
function L(e) {
	e.events.push({ type: 6 });
}
function R(e) {
	I(e, A, A, A, A, A, A, 1);
}
function Ht() {
	return {
		anchorStart: A,
		anchorEnd: A,
		tagStart: A,
		tagEnd: A
	};
}
function z(e) {
	return {
		position: e.position,
		line: e.line,
		lineStart: e.lineStart,
		lineIndent: e.lineIndent,
		firstTabInLine: e.firstTabInLine,
		eventsLength: e.events.length
	};
}
function B(e, t) {
	e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.events.length = t.eventsLength;
}
function V(e, t) {
	x(e.input.slice(0, e.length), e.position, t, e.filename);
}
function H(e) {
	return e === 10 || e === 13;
}
function U(e) {
	return e === 9 || e === 32;
}
function W(e) {
	return U(e) || H(e);
}
function G(e) {
	return e === 0 || W(e);
}
function K(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Ut(e) {
	return e >= 48 && e <= 57 ? e - 48 : -1;
}
function Wt(e) {
	if (e >= 48 && e <= 57) return e - 48;
	let t = e | 32;
	return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function Gt(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Kt(e) {
	return e === 48 || e === 97 || e === 98 || e === 116 || e === 9 || e === 110 || e === 118 || e === 102 || e === 114 || e === 101 || e === 32 || e === 34 || e === 47 || e === 92 || e === 78 || e === 95 || e === 76 || e === 80;
}
function q(e) {
	e.input.charCodeAt(e.position) === 10 ? e.position++ : (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++), e.line++, e.lineStart = e.position, e.lineIndent = 0, e.firstTabInLine = -1;
}
function J(e, t) {
	let n = 0, r = e.input.charCodeAt(e.position), i = e.position === e.lineStart || W(e.input.charCodeAt(e.position - 1));
	for (; r !== 0;) {
		for (; U(r);) i = !0, r === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), r = e.input.charCodeAt(++e.position);
		if (t && i && r === 35) do
			r = e.input.charCodeAt(++e.position);
		while (!H(r) && r !== 0);
		if (!H(r)) break;
		for (q(e), n++, i = !0, r = e.input.charCodeAt(e.position); r === 32;) e.lineIndent++, r = e.input.charCodeAt(++e.position);
	}
	return n;
}
function Y(e, t = e.position) {
	let n = e.input.charCodeAt(t);
	if ((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2)) {
		let n = e.input.charCodeAt(t + 3);
		return n === 0 || W(n);
	}
	return !1;
}
function qt(e) {
	let t = e.input.charCodeAt(e.position);
	for (; t !== 0 && !H(t);) t = e.input.charCodeAt(++e.position);
}
function Jt(e, t, n) {
	At.test(e.input.slice(t, n)) && V(e, "the stream contains non-printable characters");
}
function Yt(e, t, n) {
	if (e.input.charCodeAt(e.position) !== 33) return !1;
	t.tagStart !== A && V(e, "duplication of a tag property");
	let r = e.position, i = !1, a = !1, o = "!", s = e.input.charCodeAt(++e.position);
	s === 60 ? (i = !0, s = e.input.charCodeAt(++e.position)) : s === 33 && (a = !0, o = "!!", s = e.input.charCodeAt(++e.position));
	let c = e.position, l;
	if (i) {
		for (; s !== 0 && s !== 62;) s = e.input.charCodeAt(++e.position);
		s !== 62 && V(e, "unexpected end of the stream within a verbatim tag"), l = e.input.slice(c, e.position), e.position++;
	} else {
		for (; s !== 0 && !W(s) && !(n && K(s));) s === 33 && (a ? V(e, "tag suffix cannot contain exclamation marks") : (o = e.input.slice(c - 1, e.position + 1), Mt.test(o) || V(e, "named tag handle cannot contain such characters"), a = !0, c = e.position + 1)), s = e.input.charCodeAt(++e.position);
		l = e.input.slice(c, e.position), jt.test(l) && V(e, "tag suffix cannot contain flow indicator characters");
	}
	return l && !(i ? Pt.test(l) : Ft.test(l)) && V(e, `tag name cannot contain such characters: ${l}`), !i && o !== "!" && o !== "!!" && !Ot.call(e.tagHandlers, o) && V(e, `undeclared tag handle "${o}"`), t.tagStart = r, t.tagEnd = e.position, !0;
}
function Xt(e, t) {
	if (e.input.charCodeAt(e.position) !== 38) return !1;
	t.anchorStart !== A && V(e, "duplication of an anchor property"), e.position++;
	let n = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !W(e.input.charCodeAt(e.position)) && !K(e.input.charCodeAt(e.position));) e.position++;
	return e.position === n && V(e, "name of an anchor node must contain at least one character"), t.anchorStart = n, t.anchorEnd = e.position, !0;
}
function Zt(e, t) {
	if (e.input.charCodeAt(e.position) !== 42) return !1;
	(t.anchorStart !== A || t.tagStart !== A) && V(e, "alias node should not have any properties"), e.position++;
	let n = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !W(e.input.charCodeAt(e.position)) && !K(e.input.charCodeAt(e.position));) e.position++;
	return e.position === n && V(e, "name of an alias node must contain at least one character"), Vt(e, n, e.position), !0;
}
function Qt(e, t) {
	J(e, !1), e.lineIndent < t && V(e, "deficient indentation");
}
function $t(e, t, n) {
	if (e.input.charCodeAt(e.position) !== 39) return !1;
	e.position++;
	let r = e.position, i = !0;
	for (; e.input.charCodeAt(e.position) !== 0;) {
		let a = e.input.charCodeAt(e.position);
		if (a === 39) {
			if (e.input.charCodeAt(e.position + 1) === 39) {
				i = !1, e.position += 2;
				continue;
			}
			let t = e.position;
			return e.position++, I(e, r, t, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2, 1, -1, i), !0;
		}
		H(a) ? (i = !1, Qt(e, t)) : e.position === e.lineStart && Y(e) ? V(e, "unexpected end of the document within a single quoted scalar") : a !== 9 && a < 32 ? V(e, "expected valid JSON character") : e.position++;
	}
	V(e, "unexpected end of the stream within a single quoted scalar");
}
function en(e, t, n) {
	if (e.input.charCodeAt(e.position) !== 34) return !1;
	e.position++;
	let r = e.position, i = !0;
	for (; e.input.charCodeAt(e.position) !== 0;) {
		let a = e.input.charCodeAt(e.position);
		if (a === 34) {
			let t = e.position;
			return e.position++, I(e, r, t, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 3, 1, -1, i), !0;
		}
		if (a === 92) {
			i = !1;
			let n = e.input.charCodeAt(++e.position);
			if (H(n)) Qt(e, t);
			else if (Kt(n)) e.position++;
			else {
				let t = Gt(n);
				for (t === 0 && V(e, "unknown escape sequence"); t-- > 0;) e.position++, Wt(e.input.charCodeAt(e.position)) < 0 && V(e, "expected hexadecimal character");
				e.position++;
			}
		} else H(a) ? (i = !1, Qt(e, t)) : e.position === e.lineStart && Y(e) ? V(e, "unexpected end of the document within a double quoted scalar") : a !== 9 && a < 32 ? V(e, "expected valid JSON character") : e.position++;
	}
	V(e, "unexpected end of the stream within a double quoted scalar");
}
function tn(e, t, n) {
	let r = e.input.charCodeAt(e.position), i = 1, a = -1, o = !1;
	if (r !== 124 && r !== 62) return !1;
	let s = r === 124 ? 4 : 5;
	for (e.position++; e.input.charCodeAt(e.position) !== 0;) {
		let n = e.input.charCodeAt(e.position), r = Ut(n);
		if (n === 43 || n === 45) i !== 1 && V(e, "repeat of a chomping mode identifier"), i = n === 43 ? 3 : 2, e.position++;
		else if (r >= 0) r === 0 && V(e, "bad explicit indentation width of a block scalar; it cannot be less than one"), o && V(e, "repeat of an indentation width identifier"), a = t + r - 1, o = !0, e.position++;
		else break;
	}
	let c = !1;
	for (; U(e.input.charCodeAt(e.position));) c = !0, e.position++;
	c && e.input.charCodeAt(e.position) === 35 && qt(e), H(e.input.charCodeAt(e.position)) ? q(e) : e.input.charCodeAt(e.position) !== 0 && V(e, "a line break is expected");
	let l = o ? a : -1, u = 0, d = e.position, f = e.position;
	for (; e.input.charCodeAt(e.position) !== 0;) {
		let n = e.position, r = 0;
		for (; e.input.charCodeAt(n + r) === 32;) r++;
		let i = e.input.charCodeAt(n + r);
		if (i === 0) {
			l >= 0 ? r > l && (f = n + r) : r > 0 && (f = n + r);
			break;
		}
		if (n === e.lineStart && Y(e, n)) break;
		if (!o && l === -1 && H(i) && (u = Math.max(u, r)), !o && l === -1 && !H(i) && (i === 9 && r < t && (e.position = n + r, V(e, "tab characters must not be used in indentation")), r < u && (e.position = n + r, V(e, "bad indentation of a mapping entry"))), l === -1 && i !== 0 && !H(i) && r < t) {
			e.lineIndent = r, e.position = n + r;
			break;
		}
		!o && i !== 0 && !H(i) && l === -1 && (l = r);
		let a = l === -1 ? t + 1 : l;
		if (i !== 0 && !H(i) && r < a) {
			e.lineIndent = r, e.position = n + r;
			break;
		}
		qt(e), f = e.position, H(e.input.charCodeAt(e.position)) && (q(e), f = e.position);
	}
	return Jt(e, d, f), I(e, d, f, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, s, i, l), !0;
}
function nn(e, t) {
	let n = e.input.charCodeAt(e.position), r = t === j;
	if (n === 0 || W(n) || n === 35 || n === 38 || n === 42 || n === 33 || n === 124 || n === 62 || n === 39 || n === 34 || n === 37 || n === 64 || n === 96 || r && K(n)) return !1;
	if (n === 63 || n === 45) {
		let t = e.input.charCodeAt(e.position + 1);
		if (G(t) || r && K(t)) return !1;
	}
	return !0;
}
function rn(e, t, n, r) {
	if (!nn(e, n)) return !1;
	let i = e.position, a = e.position, o = e.input.charCodeAt(e.position), s = n === j, c = !1;
	for (; o !== 0 && !(e.position === e.lineStart && Y(e));) {
		if (o === 58) {
			let t = e.input.charCodeAt(e.position + 1);
			if (G(t) || s && K(t)) break;
		} else if (o === 35) {
			if (W(e.input.charCodeAt(e.position - 1))) break;
		} else if (s && K(o)) break;
		else if (H(o)) {
			let n = e.position, r = e.line, i = e.lineStart, a = e.lineIndent;
			if (J(e, !1), e.lineIndent >= t) {
				c = !0, o = e.input.charCodeAt(e.position);
				continue;
			}
			e.position = n, e.line = r, e.lineStart = i, e.lineIndent = a;
			break;
		}
		U(o) || (a = e.position + 1), o = e.input.charCodeAt(++e.position);
	}
	return a === i ? !1 : (Jt(e, i, a), I(e, i, a, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1, 1, -1, !c), !0);
}
function X(e, t) {
	let n = e.line;
	J(e, !0), (e.line > n && e.lineIndent < t || e.firstTabInLine !== -1 && e.lineIndent < t) && V(e, "deficient indentation");
}
function an(e, t, n) {
	let r = e.input.charCodeAt(e.position), i = r === 123, a = e.position, o = !0;
	if (r !== 91 && r !== 123) return !1;
	let s = i ? 125 : 93;
	for (i ? zt(e, a, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2) : Rt(e, a, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2), e.position++; e.input.charCodeAt(e.position) !== 0;) {
		X(e, t);
		let n = e.input.charCodeAt(e.position);
		if (n === s) return e.position++, L(e), !0;
		o ? n === 44 && V(e, "expected the node content, but found ','") : V(e, "missed comma between flow collection entries");
		let r = !1, a = !1;
		n === 63 && W(e.input.charCodeAt(e.position + 1)) && (r = a = !0, e.position += 1, X(e, t));
		let c = e.line, l = z(e), u = Q(e, t, j, !1, !0);
		X(e, t), n = e.input.charCodeAt(e.position), (i || a || e.line === c) && n === 58 ? (r = !0, e.position++, X(e, t), i || Bt(e, l), u || R(e), Q(e, t, j, !1, !0) || R(e), X(e, t), i || L(e)) : i && r ? (u || R(e), R(e)) : i ? R(e) : r && (Bt(e, l), u || R(e), R(e), L(e)), n = e.input.charCodeAt(e.position), n === 44 ? (o = !0, e.position++) : o = !1;
	}
	V(e, "unexpected end of the stream within a flow collection");
}
function on(e, t, n) {
	if (e.firstTabInLine !== -1 || e.input.charCodeAt(e.position) !== 45 || !G(e.input.charCodeAt(e.position + 1))) return !1;
	for (Rt(e, e.position, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 1); e.input.charCodeAt(e.position) === 45 && G(e.input.charCodeAt(e.position + 1));) {
		e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, V(e, "tab characters must not be used in indentation"));
		let n = e.line;
		e.position++;
		let r = J(e, !0) > 0;
		if (e.firstTabInLine !== -1 && e.input.charCodeAt(e.position) === 45 && G(e.input.charCodeAt(e.position + 1)) && V(e, "bad indentation of a sequence entry"), r && e.lineIndent <= t ? R(e) : Q(e, t, kt, !1, !0), J(e, !0), e.lineIndent < t || e.position >= e.length) break;
		e.lineIndent > t && V(e, "bad indentation of a sequence entry"), e.line === n && e.input.charCodeAt(e.position) === 45 && G(e.input.charCodeAt(e.position + 1)) && V(e, "bad indentation of a sequence entry");
	}
	return L(e), !0;
}
function Z(e, t, n, r) {
	let i = !1, a = !1, o = !1, s = !1;
	if (e.firstTabInLine !== -1) return !1;
	let c = e.input.charCodeAt(e.position);
	for (; c !== 0;) {
		!i && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, V(e, "tab characters must not be used in indentation"));
		let l = e.input.charCodeAt(e.position + 1), u = e.line;
		if ((c === 63 || c === 58) && G(l)) o ||= (zt(e, e.position, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1), !0), c === 63 ? (i && R(e), a = !0, i = !0) : i ? i = !1 : (R(e), a = !0, i = !1), e.position += 1, s = !0;
		else {
			i &&= (R(e), !1);
			let t = z(e);
			if (!Q(e, n, M, !1, !0)) break;
			if (e.line === u) {
				for (c = e.input.charCodeAt(e.position); U(c);) c = e.input.charCodeAt(++e.position);
				if (c === 58) {
					if (c = e.input.charCodeAt(++e.position), G(c) || V(e, "a whitespace character is expected after the key-value separator within a block mapping"), !o) {
						for (B(e, t), zt(e, t.position, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1), o = !0, Q(e, n, M, !1, !0), c = e.input.charCodeAt(e.position); U(c);) c = e.input.charCodeAt(++e.position);
						e.position++;
					}
					a = !0, i = !1, s = !1;
				} else if (a) V(e, "expected ':' after a mapping key");
				else return r.anchorStart !== A || r.tagStart !== A ? (B(e, t), !1) : !0;
			} else if (a) V(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
			else return r.anchorStart !== A || r.tagStart !== A ? (B(e, t), !1) : !0;
		}
		if (Q(e, t, N, !0, s) && (s = !1), i || (s &&= (R(e), !1)), J(e, !0), c = e.input.charCodeAt(e.position), (e.line === u || e.lineIndent > t) && c !== 0) V(e, "bad indentation of a mapping entry");
		else if (e.lineIndent < t) break;
	}
	return a ? (i && R(e), o && L(e), !0) : !1;
}
function Q(e, t, n, r, i, a = !0) {
	e.depth >= e.maxDepth && V(e, `nesting exceeded maxDepth (${e.maxDepth})`), e.depth++;
	let o = 1, s = !1, c = !1, l = null, u = Ht(), d = n === N || n === kt, f = d, p = d;
	if (r && J(e, !0) && (s = !0, o = e.lineIndent > t ? 1 : e.lineIndent === t ? 0 : -1), e.position === e.lineStart && Y(e)) return e.depth--, !1;
	if (o === 1) for (;;) {
		let r = e.input.charCodeAt(e.position), i = z(e);
		if (s && o !== 1 && (r === 33 || r === 38)) break;
		if (s && p && (u.tagStart !== A || u.anchorStart !== A) && (r === 33 || r === 38)) {
			let n = z(e), r = t + 1;
			if (Z(e, e.position - e.lineStart, r, u) && e.events[n.eventsLength]?.type === 3) return e.depth--, !0;
			B(e, n);
		}
		if (s && (r === 33 && u.tagStart !== A || r === 38 && u.anchorStart !== A) || !Yt(e, u, n === j) && !Xt(e, u)) break;
		l === null && (l = i), J(e, !0) ? (s = !0, f = p, o = e.lineIndent > t ? 1 : e.lineIndent === t ? 0 : -1) : f = !1;
	}
	if (f &&= s || i, o === 1 || n === N) {
		let r = n === j || n === M ? t : t + 1, i = e.position - e.lineStart;
		if (o === 1) if (f && (on(e, i, u) || Z(e, i, r, u)) || an(e, r, u)) c = !0;
		else {
			let t = e.input.charCodeAt(e.position);
			if (l !== null && a && p && !f && t !== 124 && t !== 62) {
				let t = z(e), n = l.position - l.lineStart;
				B(e, l), Z(e, n, r, Ht()) && e.events[t.eventsLength]?.type === 3 ? c = !0 : B(e, t);
			}
			!c && (d && tn(e, r, u) || $t(e, r, u) || en(e, r, u) || Zt(e, u) || rn(e, r, n, u)) && (c = !0);
		}
		else o === 0 && (c = f && on(e, i, u));
	}
	return d &&= !c, !c && (u.anchorStart !== A || u.tagStart !== A || d) && (I(e, A, A, u.anchorStart, u.anchorEnd, u.tagStart, u.tagEnd, 1), c = !0), e.depth--, c || u.anchorStart !== A || u.tagStart !== A;
}
function sn(e) {
	if (e.lineIndent > 0 || e.input.charCodeAt(e.position) !== 37) return !1;
	e.position++;
	let t = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !W(e.input.charCodeAt(e.position));) e.position++;
	let n = e.input.slice(t, e.position), r = [];
	for (n.length === 0 && V(e, "directive name must not be less than one character in length"); e.input.charCodeAt(e.position) !== 0 && !H(e.input.charCodeAt(e.position));) {
		for (; U(e.input.charCodeAt(e.position));) e.position++;
		if (e.input.charCodeAt(e.position) === 35 || H(e.input.charCodeAt(e.position)) || e.input.charCodeAt(e.position) === 0) break;
		let t = e.position;
		for (; e.input.charCodeAt(e.position) !== 0 && !W(e.input.charCodeAt(e.position));) e.position++;
		r.push(e.input.slice(t, e.position));
	}
	if (H(e.input.charCodeAt(e.position)) && q(e), n === "YAML") {
		e.directives.some((e) => e.kind === "yaml") && V(e, "duplication of %YAML directive"), r.length !== 1 && V(e, "YAML directive accepts exactly one argument");
		let t = /^([0-9]+)\.([0-9]+)$/.exec(r[0]);
		t === null && V(e, "ill-formed argument of the YAML directive"), parseInt(t[1], 10) !== 1 && V(e, "unacceptable YAML version of the document"), e.directives.push({
			kind: "yaml",
			version: r[0]
		});
	} else if (n === "TAG") {
		r.length !== 2 && V(e, "TAG directive accepts exactly two arguments");
		let [t, n] = r;
		Mt.test(t) || V(e, "ill-formed tag handle (first argument) of the TAG directive"), Ot.call(e.tagHandlers, t) && V(e, `there is a previously declared suffix for "${t}" tag handle`), It.test(n) || V(e, "ill-formed tag prefix (second argument) of the TAG directive"), e.tagHandlers[t] = n, e.directives.push({
			kind: "tag",
			handle: t,
			prefix: n
		});
	}
	return !0;
}
function cn(e) {
	e.directives = [], e.tagHandlers = Object.create(null);
	let t = !1;
	for (J(e, !0); sn(e);) t = !0, J(e, !0);
	let n = !1, r = !1, i = !0;
	if (e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 && G(e.input.charCodeAt(e.position + 3))) {
		n = !0;
		let t = e.line;
		e.position += 3, J(e, !0), i = e.line > t;
	} else t && V(e, "directives end mark is expected");
	let a = e.events.length;
	if (!n && e.position === e.lineStart && e.input.charCodeAt(e.position) === 46 && Y(e)) {
		e.position += 3, J(e, !0);
		return;
	}
	if (Lt(e, n, !1), Q(e, e.lineIndent - 1, N, !1, i, i) || R(e), J(e, !0), e.position === e.lineStart && Y(e) && (r = e.input.charCodeAt(e.position) === 46, r)) {
		let t = e.line;
		e.position += 3, J(e, !0), e.line === t && e.position < e.length && V(e, "end of the stream or a document separator is expected");
	}
	let o = e.events[a];
	o?.type === 1 && (o.explicitEnd = r), L(e), !r && e.position < e.length && !(e.position === e.lineStart && Y(e)) && V(e, "end of the stream or a document separator is expected");
}
function ln(e, t) {
	let n = e.length, r = {
		...F,
		...t,
		input: `${e}\0`,
		length: n,
		position: 0,
		line: 0,
		lineStart: 0,
		lineIndent: 0,
		firstTabInLine: -1,
		depth: 0,
		directives: [],
		tagHandlers: Object.create(null),
		events: []
	}, i = e.indexOf("\0");
	for (i !== -1 && x(e, i, "null byte is not allowed in input", r.filename), r.input.charCodeAt(r.position) === 65279 && r.position++; r.position < r.length && (J(r, !0), !(r.position >= r.length));) {
		let e = r.position;
		cn(r), r.position === e && V(r, "can not read a document");
	}
	return r.events;
}
var un = {
	...F,
	...T
};
function dn(e, t = {}) {
	let n = {
		...un,
		...t
	}, r = String(e), i = Object.keys(F), a = Object.keys(T);
	return Dt(ln(r, We(n, i)), {
		...We(n, a),
		source: r
	});
}
function fn(e, t) {
	let n = dn(e, t);
	if (n.length === 0) throw new b("expected a document, but the input is empty");
	if (n.length === 1) return n[0];
	throw new b("expected a single document in the stream, but found more");
}
var $ = {};
$[0] = "\\0", $[7] = "\\a", $[8] = "\\b", $[9] = "\\t", $[10] = "\\n", $[11] = "\\v", $[12] = "\\f", $[13] = "\\r", $[27] = "\\e", $[34] = "\\\"", $[92] = "\\\\", $[133] = "\\N", $[160] = "\\_", $[8232] = "\\L", $[8233] = "\\P";
var pn = {
	indent: 2,
	seqNoIndent: !1,
	seqInlineFirst: !0,
	sortKeys: !1,
	lineWidth: 80,
	flowBracketPadding: !1,
	flowSkipCommaSpace: !1,
	flowSkipColonSpace: !1,
	quoteFlowKeys: !1,
	quoteStyle: "single",
	forceQuotes: !1,
	tagBeforeAnchor: !1
};
$e.withTags({
	...ye,
	resolve: (t, n, r) => {
		let i = ye.resolve(t, n, r);
		return i === e ? ue.resolve(t, n, r) : i;
	}
}, {
	...m,
	resolve: (t, n, r) => {
		let i = m.resolve(t, n, r);
		return i === e ? we.resolve(t, n, r) : i;
	}
}), { ...pn };
//#endregion
//#region src/languages/markdown/markdown-frontmatter.ts
function mn(e) {
	let t = e.match(/^---\n([\s\S]*?)\n---\n?/);
	if (t === null) return {
		attributes: {},
		body: e
	};
	let n = fn(t[1] ?? "");
	return {
		attributes: typeof n == "object" && n ? n : {},
		body: e.slice(t[0].length)
	};
}
//#endregion
export { mn as t };

//# sourceMappingURL=markdown-frontmatter.js.map