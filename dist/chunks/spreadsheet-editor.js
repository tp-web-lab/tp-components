import { t as e } from "./base.js";
import "./icon-button.js";
import "./toolbar.js";
import "./color.js";
import "./dropdown.js";
import "./fullscreen.js";
import "./theme.js";
import "./menu.js";
import { i as t } from "./formula-picker.js";
//#region ../node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs
var n = {};
n.version = "0.18.5";
var r = 1200, i = 1252, a = [
	874,
	932,
	936,
	949,
	950,
	1250,
	1251,
	1252,
	1253,
	1254,
	1255,
	1256,
	1257,
	1258,
	1e4
], o = {
	0: 1252,
	1: 65001,
	2: 65001,
	77: 1e4,
	128: 932,
	129: 949,
	130: 1361,
	134: 936,
	136: 950,
	161: 1253,
	162: 1254,
	163: 1258,
	177: 1255,
	178: 1256,
	186: 1257,
	204: 1251,
	222: 874,
	238: 1250,
	255: 1252,
	69: 6969
}, s = function(e) {
	a.indexOf(e) != -1 && (i = o[0] = e);
};
function c() {
	s(1252);
}
var l = function(e) {
	r = e, s(e);
};
function u() {
	l(1200), c();
}
function d(e) {
	for (var t = [], n = 0, r = e.length; n < r; ++n) t[n] = e.charCodeAt(n);
	return t;
}
function f(e) {
	for (var t = [], n = 0; n < e.length >> 1; ++n) t[n] = String.fromCharCode(e.charCodeAt(2 * n) + (e.charCodeAt(2 * n + 1) << 8));
	return t.join("");
}
function p(e) {
	for (var t = [], n = 0; n < e.length >> 1; ++n) t[n] = String.fromCharCode(e.charCodeAt(2 * n + 1) + (e.charCodeAt(2 * n) << 8));
	return t.join("");
}
var m = function(e) {
	var t = e.charCodeAt(0), n = e.charCodeAt(1);
	return t == 255 && n == 254 ? f(e.slice(2)) : t == 254 && n == 255 ? p(e.slice(2)) : t == 65279 ? e.slice(1) : e;
}, h = function(e) {
	return String.fromCharCode(e);
}, g = function(e) {
	return String.fromCharCode(e);
}, _, v = null, y = !0, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function x(e) {
	for (var t = "", n = 0, r = 0, i = 0, a = 0, o = 0, s = 0, c = 0, l = 0; l < e.length;) n = e.charCodeAt(l++), a = n >> 2, r = e.charCodeAt(l++), o = (n & 3) << 4 | r >> 4, i = e.charCodeAt(l++), s = (r & 15) << 2 | i >> 6, c = i & 63, isNaN(r) ? s = c = 64 : isNaN(i) && (c = 64), t += b.charAt(a) + b.charAt(o) + b.charAt(s) + b.charAt(c);
	return t;
}
function S(e) {
	var t = "", n = 0, r = 0, i = 0, a = 0, o = 0, s = 0, c = 0;
	e = e.replace(/[^\w\+\/\=]/g, "");
	for (var l = 0; l < e.length;) a = b.indexOf(e.charAt(l++)), o = b.indexOf(e.charAt(l++)), n = a << 2 | o >> 4, t += String.fromCharCode(n), s = b.indexOf(e.charAt(l++)), r = (o & 15) << 4 | s >> 2, s !== 64 && (t += String.fromCharCode(r)), c = b.indexOf(e.charAt(l++)), i = (s & 3) << 6 | c, c !== 64 && (t += String.fromCharCode(i));
	return t;
}
var C = /*#__PURE__*/ (function() {
	return typeof Buffer < "u" && typeof process < "u" && process.versions !== void 0 && !!process.versions.node;
})(), w = /*#__PURE__*/ (function() {
	if (typeof Buffer < "u") {
		var e = !Buffer.from;
		if (!e) try {
			Buffer.from("foo", "utf8");
		} catch {
			e = !0;
		}
		return e ? function(e, t) {
			return t ? new Buffer(e, t) : new Buffer(e);
		} : Buffer.from.bind(Buffer);
	}
	return function() {};
})();
function T(e) {
	return C ? Buffer.alloc ? Buffer.alloc(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : Array(e);
}
function E(e) {
	return C ? Buffer.allocUnsafe ? Buffer.allocUnsafe(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : Array(e);
}
var D = function(e) {
	return C ? w(e, "binary") : e.split("").map(function(e) {
		return e.charCodeAt(0) & 255;
	});
};
function O(e) {
	if (typeof ArrayBuffer > "u") return D(e);
	for (var t = new ArrayBuffer(e.length), n = new Uint8Array(t), r = 0; r != e.length; ++r) n[r] = e.charCodeAt(r) & 255;
	return t;
}
function k(e) {
	if (Array.isArray(e)) return e.map(function(e) {
		return String.fromCharCode(e);
	}).join("");
	for (var t = [], n = 0; n < e.length; ++n) t[n] = String.fromCharCode(e[n]);
	return t.join("");
}
function A(e) {
	if (typeof Uint8Array > "u") throw Error("Unsupported");
	return new Uint8Array(e);
}
function j(e) {
	if (typeof ArrayBuffer > "u") throw Error("Unsupported");
	if (e instanceof ArrayBuffer) return j(new Uint8Array(e));
	for (var t = Array(e.length), n = 0; n < e.length; ++n) t[n] = e[n];
	return t;
}
var M = C ? function(e) {
	return Buffer.concat(e.map(function(e) {
		return Buffer.isBuffer(e) ? e : w(e);
	}));
} : function(e) {
	if (typeof Uint8Array < "u") {
		var t = 0, n = 0;
		for (t = 0; t < e.length; ++t) n += e[t].length;
		var r = new Uint8Array(n), i = 0;
		for (t = 0, n = 0; t < e.length; n += i, ++t) if (i = e[t].length, e[t] instanceof Uint8Array) r.set(e[t], n);
		else if (typeof e[t] == "string") throw "wtf";
		else r.set(new Uint8Array(e[t]), n);
		return r;
	}
	return [].concat.apply([], e.map(function(e) {
		return Array.isArray(e) ? e : [].slice.call(e);
	}));
};
function N(e) {
	for (var t = [], n = 0, r = e.length + 250, i = T(e.length + 255), a = 0; a < e.length; ++a) {
		var o = e.charCodeAt(a);
		if (o < 128) i[n++] = o;
		else if (o < 2048) i[n++] = 192 | o >> 6 & 31, i[n++] = 128 | o & 63;
		else if (o >= 55296 && o < 57344) {
			o = (o & 1023) + 64;
			var s = e.charCodeAt(++a) & 1023;
			i[n++] = 240 | o >> 8 & 7, i[n++] = 128 | o >> 2 & 63, i[n++] = 128 | s >> 6 & 15 | (o & 3) << 4, i[n++] = 128 | s & 63;
		} else i[n++] = 224 | o >> 12 & 15, i[n++] = 128 | o >> 6 & 63, i[n++] = 128 | o & 63;
		n > r && (t.push(i.slice(0, n)), n = 0, i = T(65535), r = 65530);
	}
	return t.push(i.slice(0, n)), M(t);
}
var P = /\u0000/g, F = /[\u0001-\u0006]/g;
function I(e) {
	for (var t = "", n = e.length - 1; n >= 0;) t += e.charAt(n--);
	return t;
}
function L(e, t) {
	var n = "" + e;
	return n.length >= t ? n : Tt("0", t - n.length) + n;
}
function R(e, t) {
	var n = "" + e;
	return n.length >= t ? n : Tt(" ", t - n.length) + n;
}
function ee(e, t) {
	var n = "" + e;
	return n.length >= t ? n : n + Tt(" ", t - n.length);
}
function z(e, t) {
	var n = "" + Math.round(e);
	return n.length >= t ? n : Tt("0", t - n.length) + n;
}
function B(e, t) {
	var n = "" + e;
	return n.length >= t ? n : Tt("0", t - n.length) + n;
}
var te = 2 ** 32;
function ne(e, t) {
	return e > te || e < -te ? z(e, t) : B(Math.round(e), t);
}
function V(e, t) {
	return t ||= 0, e.length >= 7 + t && (e.charCodeAt(t) | 32) == 103 && (e.charCodeAt(t + 1) | 32) == 101 && (e.charCodeAt(t + 2) | 32) == 110 && (e.charCodeAt(t + 3) | 32) == 101 && (e.charCodeAt(t + 4) | 32) == 114 && (e.charCodeAt(t + 5) | 32) == 97 && (e.charCodeAt(t + 6) | 32) == 108;
}
var re = [
	["Sun", "Sunday"],
	["Mon", "Monday"],
	["Tue", "Tuesday"],
	["Wed", "Wednesday"],
	["Thu", "Thursday"],
	["Fri", "Friday"],
	["Sat", "Saturday"]
], H = [
	[
		"J",
		"Jan",
		"January"
	],
	[
		"F",
		"Feb",
		"February"
	],
	[
		"M",
		"Mar",
		"March"
	],
	[
		"A",
		"Apr",
		"April"
	],
	[
		"M",
		"May",
		"May"
	],
	[
		"J",
		"Jun",
		"June"
	],
	[
		"J",
		"Jul",
		"July"
	],
	[
		"A",
		"Aug",
		"August"
	],
	[
		"S",
		"Sep",
		"September"
	],
	[
		"O",
		"Oct",
		"October"
	],
	[
		"N",
		"Nov",
		"November"
	],
	[
		"D",
		"Dec",
		"December"
	]
];
function ie(e) {
	return e ||= {}, e[0] = "General", e[1] = "0", e[2] = "0.00", e[3] = "#,##0", e[4] = "#,##0.00", e[9] = "0%", e[10] = "0.00%", e[11] = "0.00E+00", e[12] = "# ?/?", e[13] = "# ??/??", e[14] = "m/d/yy", e[15] = "d-mmm-yy", e[16] = "d-mmm", e[17] = "mmm-yy", e[18] = "h:mm AM/PM", e[19] = "h:mm:ss AM/PM", e[20] = "h:mm", e[21] = "h:mm:ss", e[22] = "m/d/yy h:mm", e[37] = "#,##0 ;(#,##0)", e[38] = "#,##0 ;[Red](#,##0)", e[39] = "#,##0.00;(#,##0.00)", e[40] = "#,##0.00;[Red](#,##0.00)", e[45] = "mm:ss", e[46] = "[h]:mm:ss", e[47] = "mmss.0", e[48] = "##0.0E+0", e[49] = "@", e[56] = "\"上午/下午 \"hh\"時\"mm\"分\"ss\"秒 \"", e;
}
var U = {
	0: "General",
	1: "0",
	2: "0.00",
	3: "#,##0",
	4: "#,##0.00",
	9: "0%",
	10: "0.00%",
	11: "0.00E+00",
	12: "# ?/?",
	13: "# ??/??",
	14: "m/d/yy",
	15: "d-mmm-yy",
	16: "d-mmm",
	17: "mmm-yy",
	18: "h:mm AM/PM",
	19: "h:mm:ss AM/PM",
	20: "h:mm",
	21: "h:mm:ss",
	22: "m/d/yy h:mm",
	37: "#,##0 ;(#,##0)",
	38: "#,##0 ;[Red](#,##0)",
	39: "#,##0.00;(#,##0.00)",
	40: "#,##0.00;[Red](#,##0.00)",
	45: "mm:ss",
	46: "[h]:mm:ss",
	47: "mmss.0",
	48: "##0.0E+0",
	49: "@",
	56: "\"上午/下午 \"hh\"時\"mm\"分\"ss\"秒 \""
}, ae = {
	5: 37,
	6: 38,
	7: 39,
	8: 40,
	23: 0,
	24: 0,
	25: 0,
	26: 0,
	27: 14,
	28: 14,
	29: 14,
	30: 14,
	31: 14,
	50: 14,
	51: 14,
	52: 14,
	53: 14,
	54: 14,
	55: 14,
	56: 14,
	57: 14,
	58: 14,
	59: 1,
	60: 2,
	61: 3,
	62: 4,
	67: 9,
	68: 10,
	69: 12,
	70: 13,
	71: 14,
	72: 14,
	73: 15,
	74: 16,
	75: 17,
	76: 20,
	77: 21,
	78: 22,
	79: 45,
	80: 46,
	81: 47,
	82: 0
}, oe = {
	5: "\"$\"#,##0_);\\(\"$\"#,##0\\)",
	63: "\"$\"#,##0_);\\(\"$\"#,##0\\)",
	6: "\"$\"#,##0_);[Red]\\(\"$\"#,##0\\)",
	64: "\"$\"#,##0_);[Red]\\(\"$\"#,##0\\)",
	7: "\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)",
	65: "\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)",
	8: "\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)",
	66: "\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)",
	41: "_(* #,##0_);_(* \\(#,##0\\);_(* \"-\"_);_(@_)",
	42: "_(\"$\"* #,##0_);_(\"$\"* \\(#,##0\\);_(\"$\"* \"-\"_);_(@_)",
	43: "_(* #,##0.00_);_(* \\(#,##0.00\\);_(* \"-\"??_);_(@_)",
	44: "_(\"$\"* #,##0.00_);_(\"$\"* \\(#,##0.00\\);_(\"$\"* \"-\"??_);_(@_)"
};
function W(e, t, n) {
	for (var r = e < 0 ? -1 : 1, i = e * r, a = 0, o = 1, s = 0, c = 1, l = 0, u = 0, d = Math.floor(i); l < t && (d = Math.floor(i), s = d * o + a, u = d * l + c, !(i - d < 5e-8));) i = 1 / (i - d), a = o, o = s, c = l, l = u;
	if (u > t && (l > t ? (u = c, s = a) : (u = l, s = o)), !n) return [
		0,
		r * s,
		u
	];
	var f = Math.floor(r * s / u);
	return [
		f,
		r * s - f * u,
		u
	];
}
function se(e, t, n) {
	if (e > 2958465 || e < 0) return null;
	var r = e | 0, i = Math.floor(86400 * (e - r)), a = 0, o = [], s = {
		D: r,
		T: i,
		u: 86400 * (e - r) - i,
		y: 0,
		m: 0,
		d: 0,
		H: 0,
		M: 0,
		S: 0,
		q: 0
	};
	if (Math.abs(s.u) < 1e-6 && (s.u = 0), t && t.date1904 && (r += 1462), s.u > .9999 && (s.u = 0, ++i == 86400 && (s.T = i = 0, ++r, ++s.D)), r === 60) o = n ? [
		1317,
		10,
		29
	] : [
		1900,
		2,
		29
	], a = 3;
	else if (r === 0) o = n ? [
		1317,
		8,
		29
	] : [
		1900,
		1,
		0
	], a = 6;
	else {
		r > 60 && --r;
		var c = new Date(1900, 0, 1);
		c.setDate(c.getDate() + r - 1), o = [
			c.getFullYear(),
			c.getMonth() + 1,
			c.getDate()
		], a = c.getDay(), r < 60 && (a = (a + 6) % 7), n && (a = ve(c, o));
	}
	return s.y = o[0], s.m = o[1], s.d = o[2], s.S = i % 60, i = Math.floor(i / 60), s.M = i % 60, i = Math.floor(i / 60), s.H = i, s.q = a, s;
}
var ce = /*#__PURE__*/ new Date(1899, 11, 31, 0, 0, 0), le = /*#__PURE__*/ ce.getTime(), ue = /*#__PURE__*/ new Date(1900, 2, 1, 0, 0, 0);
function de(e, t) {
	var n = /*#__PURE__*/ e.getTime();
	return t ? n -= 1461 * 24 * 60 * 60 * 1e3 : e >= ue && (n += 1440 * 60 * 1e3), (n - (le + (/*#__PURE__*/ e.getTimezoneOffset() - /*#__PURE__*/ ce.getTimezoneOffset()) * 6e4)) / (1440 * 60 * 1e3);
}
function fe(e) {
	return e.indexOf(".") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}
function pe(e) {
	return e.indexOf("E") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/, "$1E").replace(/(E[+-])(\d)$/, "$10$2");
}
function me(e) {
	var t = e < 0 ? 12 : 11, n = fe(e.toFixed(12));
	return n.length <= t || (n = e.toPrecision(10), n.length <= t) ? n : e.toExponential(5);
}
function he(e) {
	var t = fe(e.toFixed(11));
	return t.length > (e < 0 ? 12 : 11) || t === "0" || t === "-0" ? e.toPrecision(6) : t;
}
function ge(e) {
	var t = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E);
	return fe(pe((t >= -4 && t <= -1 ? e.toPrecision(10 + t) : Math.abs(t) <= 9 ? me(e) : t === 10 ? e.toFixed(10).substr(0, 12) : he(e)).toUpperCase()));
}
function _e(e, t) {
	switch (typeof e) {
		case "string": return e;
		case "boolean": return e ? "TRUE" : "FALSE";
		case "number": return (e | 0) === e ? e.toString(10) : ge(e);
		case "undefined": return "";
		case "object":
			if (e == null) return "";
			if (e instanceof Date) return Ye(14, de(e, t && t.date1904), t);
	}
	throw Error("unsupported value in General format: " + e);
}
function ve(e, t) {
	t[0] -= 581;
	var n = e.getDay();
	return e < 60 && (n = (n + 6) % 7), n;
}
function ye(e, t, n, r) {
	var i = "", a = 0, o = 0, s = n.y, c, l = 0;
	switch (e) {
		case 98: s = n.y + 543;
		case 121:
			switch (t.length) {
				case 1:
				case 2:
					c = s % 100, l = 2;
					break;
				default:
					c = s % 1e4, l = 4;
					break;
			}
			break;
		case 109:
			switch (t.length) {
				case 1:
				case 2:
					c = n.m, l = t.length;
					break;
				case 3: return H[n.m - 1][1];
				case 5: return H[n.m - 1][0];
				default: return H[n.m - 1][2];
			}
			break;
		case 100:
			switch (t.length) {
				case 1:
				case 2:
					c = n.d, l = t.length;
					break;
				case 3: return re[n.q][0];
				default: return re[n.q][1];
			}
			break;
		case 104:
			switch (t.length) {
				case 1:
				case 2:
					c = 1 + (n.H + 11) % 12, l = t.length;
					break;
				default: throw "bad hour format: " + t;
			}
			break;
		case 72:
			switch (t.length) {
				case 1:
				case 2:
					c = n.H, l = t.length;
					break;
				default: throw "bad hour format: " + t;
			}
			break;
		case 77:
			switch (t.length) {
				case 1:
				case 2:
					c = n.M, l = t.length;
					break;
				default: throw "bad minute format: " + t;
			}
			break;
		case 115:
			if (t != "s" && t != "ss" && t != ".0" && t != ".00" && t != ".000") throw "bad second format: " + t;
			return n.u === 0 && (t == "s" || t == "ss") ? L(n.S, t.length) : (o = r >= 2 ? r === 3 ? 1e3 : 100 : r === 1 ? 10 : 1, a = Math.round(o * (n.S + n.u)), a >= 60 * o && (a = 0), t === "s" ? a === 0 ? "0" : "" + a / o : (i = L(a, 2 + r), t === "ss" ? i.substr(0, 2) : "." + i.substr(2, t.length - 1)));
		case 90:
			switch (t) {
				case "[h]":
				case "[hh]":
					c = n.D * 24 + n.H;
					break;
				case "[m]":
				case "[mm]":
					c = (n.D * 24 + n.H) * 60 + n.M;
					break;
				case "[s]":
				case "[ss]":
					c = ((n.D * 24 + n.H) * 60 + n.M) * 60 + Math.round(n.S + n.u);
					break;
				default: throw "bad abstime format: " + t;
			}
			l = t.length === 3 ? 1 : 2;
			break;
		case 101:
			c = s, l = 1;
			break;
	}
	return l > 0 ? L(c, l) : "";
}
function be(e) {
	var t = 3;
	if (e.length <= t) return e;
	for (var n = e.length % t, r = e.substr(0, n); n != e.length; n += t) r += (r.length > 0 ? "," : "") + e.substr(n, t);
	return r;
}
var xe = /%/g;
function Se(e, t, n) {
	var r = t.replace(xe, ""), i = t.length - r.length;
	return Ve(e, r, n * 10 ** (2 * i)) + Tt("%", i);
}
function Ce(e, t, n) {
	for (var r = t.length - 1; t.charCodeAt(r - 1) === 44;) --r;
	return Ve(e, t.substr(0, r), n / 10 ** (3 * (t.length - r)));
}
function we(e, t) {
	var n, r = e.indexOf("E") - e.indexOf(".") - 1;
	if (e.match(/^#+0.0E\+0$/)) {
		if (t == 0) return "0.0E+0";
		if (t < 0) return "-" + we(e, -t);
		var i = e.indexOf(".");
		i === -1 && (i = e.indexOf("E"));
		var a = Math.floor(Math.log(t) * Math.LOG10E) % i;
		if (a < 0 && (a += i), n = (t / 10 ** a).toPrecision(r + 1 + (i + a) % i), n.indexOf("e") === -1) {
			var o = Math.floor(Math.log(t) * Math.LOG10E);
			for (n.indexOf(".") === -1 ? n = n.charAt(0) + "." + n.substr(1) + "E+" + (o - n.length + a) : n += "E+" + (o - a); n.substr(0, 2) === "0.";) n = n.charAt(0) + n.substr(2, i) + "." + n.substr(2 + i), n = n.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
			n = n.replace(/\+-/, "-");
		}
		n = n.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(e, t, n, r) {
			return t + n + r.substr(0, (i + a) % i) + "." + r.substr(a) + "E";
		});
	} else n = t.toExponential(r);
	return e.match(/E\+00$/) && n.match(/e[+-]\d$/) && (n = n.substr(0, n.length - 1) + "0" + n.charAt(n.length - 1)), e.match(/E\-/) && n.match(/e\+/) && (n = n.replace(/e\+/, "e")), n.replace("e", "E");
}
var Te = /# (\?+)( ?)\/( ?)(\d+)/;
function Ee(e, t, n) {
	var r = parseInt(e[4], 10), i = Math.round(t * r), a = Math.floor(i / r), o = i - a * r, s = r;
	return n + (a === 0 ? "" : "" + a) + " " + (o === 0 ? Tt(" ", e[1].length + 1 + e[4].length) : R(o, e[1].length) + e[2] + "/" + e[3] + L(s, e[4].length));
}
function De(e, t, n) {
	return n + (t === 0 ? "" : "" + t) + Tt(" ", e[1].length + 2 + e[4].length);
}
var Oe = /^#*0*\.([0#]+)/, ke = /\).*[0#]/, Ae = /\(###\) ###\\?-####/;
function je(e) {
	for (var t = "", n, r = 0; r != e.length; ++r) switch (n = e.charCodeAt(r)) {
		case 35: break;
		case 63:
			t += " ";
			break;
		case 48:
			t += "0";
			break;
		default: t += String.fromCharCode(n);
	}
	return t;
}
function Me(e, t) {
	var n = 10 ** t;
	return "" + Math.round(e * n) / n;
}
function Ne(e, t) {
	var n = e - Math.floor(e), r = 10 ** t;
	return t < ("" + Math.round(n * r)).length ? 0 : Math.round(n * r);
}
function Pe(e, t) {
	return +(t < ("" + Math.round((e - Math.floor(e)) * 10 ** t)).length);
}
function Fe(e) {
	return e < 2147483647 && e > -2147483648 ? "" + (e >= 0 ? e | 0 : e - 1 | 0) : "" + Math.floor(e);
}
function Ie(e, t, n) {
	if (e.charCodeAt(0) === 40 && !t.match(ke)) {
		var r = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
		return n >= 0 ? Ie("n", r, n) : "(" + Ie("n", r, -n) + ")";
	}
	if (t.charCodeAt(t.length - 1) === 44) return Ce(e, t, n);
	if (t.indexOf("%") !== -1) return Se(e, t, n);
	if (t.indexOf("E") !== -1) return we(t, n);
	if (t.charCodeAt(0) === 36) return "$" + Ie(e, t.substr(t.charAt(1) == " " ? 2 : 1), n);
	var i, a, o, s, c = Math.abs(n), l = n < 0 ? "-" : "";
	if (t.match(/^00+$/)) return l + ne(c, t.length);
	if (t.match(/^[#?]+$/)) return i = ne(n, 0), i === "0" && (i = ""), i.length > t.length ? i : je(t.substr(0, t.length - i.length)) + i;
	if (a = t.match(Te)) return Ee(a, c, l);
	if (t.match(/^#+0+$/)) return l + ne(c, t.length - t.indexOf("0"));
	if (a = t.match(Oe)) return i = Me(n, a[1].length).replace(/^([^\.]+)$/, "$1." + je(a[1])).replace(/\.$/, "." + je(a[1])).replace(/\.(\d*)$/, function(e, t) {
		return "." + t + Tt("0", je(a[1]).length - t.length);
	}), t.indexOf("0.") === -1 ? i.replace(/^0\./, ".") : i;
	if (t = t.replace(/^#+([0.])/, "$1"), a = t.match(/^(0*)\.(#*)$/)) return l + Me(c, a[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, a[1].length ? "0." : ".");
	if (a = t.match(/^#{1,3},##0(\.?)$/)) return l + be(ne(c, 0));
	if (a = t.match(/^#,##0\.([#0]*0)$/)) return n < 0 ? "-" + Ie(e, t, -n) : be("" + (Math.floor(n) + Pe(n, a[1].length))) + "." + L(Ne(n, a[1].length), a[1].length);
	if (a = t.match(/^#,#*,#0/)) return Ie(e, t.replace(/^#,#*,/, ""), n);
	if (a = t.match(/^([0#]+)(\\?-([0#]+))+$/)) return i = I(Ie(e, t.replace(/[\\-]/g, ""), n)), o = 0, I(I(t.replace(/\\/g, "")).replace(/[0#]/g, function(e) {
		return o < i.length ? i.charAt(o++) : e === "0" ? "0" : "";
	}));
	if (t.match(Ae)) return i = Ie(e, "##########", n), "(" + i.substr(0, 3) + ") " + i.substr(3, 3) + "-" + i.substr(6);
	var u = "";
	if (a = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) return o = Math.min(a[4].length, 7), s = W(c, 10 ** o - 1, !1), i = "" + l, u = Ve("n", a[1], s[1]), u.charAt(u.length - 1) == " " && (u = u.substr(0, u.length - 1) + "0"), i += u + a[2] + "/" + a[3], u = ee(s[2], o), u.length < a[4].length && (u = je(a[4].substr(a[4].length - u.length)) + u), i += u, i;
	if (a = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) return o = Math.min(Math.max(a[1].length, a[4].length), 7), s = W(c, 10 ** o - 1, !0), l + (s[0] || (s[1] ? "" : "0")) + " " + (s[1] ? R(s[1], o) + a[2] + "/" + a[3] + ee(s[2], o) : Tt(" ", 2 * o + 1 + a[2].length + a[3].length));
	if (a = t.match(/^[#0?]+$/)) return i = ne(n, 0), t.length <= i.length ? i : je(t.substr(0, t.length - i.length)) + i;
	if (a = t.match(/^([#0?]+)\.([#0]+)$/)) {
		i = "" + n.toFixed(Math.min(a[2].length, 10)).replace(/([^0])0+$/, "$1"), o = i.indexOf(".");
		var d = t.indexOf(".") - o, f = t.length - i.length - d;
		return je(t.substr(0, d) + i + t.substr(t.length - f));
	}
	if (a = t.match(/^00,000\.([#0]*0)$/)) return o = Ne(n, a[1].length), n < 0 ? "-" + Ie(e, t, -n) : be(Fe(n)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(e) {
		return "00," + (e.length < 3 ? L(0, 3 - e.length) : "") + e;
	}) + "." + L(o, a[1].length);
	switch (t) {
		case "###,##0.00": return Ie(e, "#,##0.00", n);
		case "###,###":
		case "##,###":
		case "#,###":
			var p = be(ne(c, 0));
			return p === "0" ? "" : l + p;
		case "###,###.00": return Ie(e, "###,##0.00", n).replace(/^0\./, ".");
		case "#,###.00": return Ie(e, "#,##0.00", n).replace(/^0\./, ".");
		default:
	}
	throw Error("unsupported format |" + t + "|");
}
function Le(e, t, n) {
	for (var r = t.length - 1; t.charCodeAt(r - 1) === 44;) --r;
	return Ve(e, t.substr(0, r), n / 10 ** (3 * (t.length - r)));
}
function Re(e, t, n) {
	var r = t.replace(xe, ""), i = t.length - r.length;
	return Ve(e, r, n * 10 ** (2 * i)) + Tt("%", i);
}
function ze(e, t) {
	var n, r = e.indexOf("E") - e.indexOf(".") - 1;
	if (e.match(/^#+0.0E\+0$/)) {
		if (t == 0) return "0.0E+0";
		if (t < 0) return "-" + ze(e, -t);
		var i = e.indexOf(".");
		i === -1 && (i = e.indexOf("E"));
		var a = Math.floor(Math.log(t) * Math.LOG10E) % i;
		if (a < 0 && (a += i), n = (t / 10 ** a).toPrecision(r + 1 + (i + a) % i), !n.match(/[Ee]/)) {
			var o = Math.floor(Math.log(t) * Math.LOG10E);
			n.indexOf(".") === -1 ? n = n.charAt(0) + "." + n.substr(1) + "E+" + (o - n.length + a) : n += "E+" + (o - a), n = n.replace(/\+-/, "-");
		}
		n = n.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(e, t, n, r) {
			return t + n + r.substr(0, (i + a) % i) + "." + r.substr(a) + "E";
		});
	} else n = t.toExponential(r);
	return e.match(/E\+00$/) && n.match(/e[+-]\d$/) && (n = n.substr(0, n.length - 1) + "0" + n.charAt(n.length - 1)), e.match(/E\-/) && n.match(/e\+/) && (n = n.replace(/e\+/, "e")), n.replace("e", "E");
}
function Be(e, t, n) {
	if (e.charCodeAt(0) === 40 && !t.match(ke)) {
		var r = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
		return n >= 0 ? Be("n", r, n) : "(" + Be("n", r, -n) + ")";
	}
	if (t.charCodeAt(t.length - 1) === 44) return Le(e, t, n);
	if (t.indexOf("%") !== -1) return Re(e, t, n);
	if (t.indexOf("E") !== -1) return ze(t, n);
	if (t.charCodeAt(0) === 36) return "$" + Be(e, t.substr(t.charAt(1) == " " ? 2 : 1), n);
	var i, a, o, s, c = Math.abs(n), l = n < 0 ? "-" : "";
	if (t.match(/^00+$/)) return l + L(c, t.length);
	if (t.match(/^[#?]+$/)) return i = "" + n, n === 0 && (i = ""), i.length > t.length ? i : je(t.substr(0, t.length - i.length)) + i;
	if (a = t.match(Te)) return De(a, c, l);
	if (t.match(/^#+0+$/)) return l + L(c, t.length - t.indexOf("0"));
	if (a = t.match(Oe)) return i = ("" + n).replace(/^([^\.]+)$/, "$1." + je(a[1])).replace(/\.$/, "." + je(a[1])), i = i.replace(/\.(\d*)$/, function(e, t) {
		return "." + t + Tt("0", je(a[1]).length - t.length);
	}), t.indexOf("0.") === -1 ? i.replace(/^0\./, ".") : i;
	if (t = t.replace(/^#+([0.])/, "$1"), a = t.match(/^(0*)\.(#*)$/)) return l + ("" + c).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, a[1].length ? "0." : ".");
	if (a = t.match(/^#{1,3},##0(\.?)$/)) return l + be("" + c);
	if (a = t.match(/^#,##0\.([#0]*0)$/)) return n < 0 ? "-" + Be(e, t, -n) : be("" + n) + "." + Tt("0", a[1].length);
	if (a = t.match(/^#,#*,#0/)) return Be(e, t.replace(/^#,#*,/, ""), n);
	if (a = t.match(/^([0#]+)(\\?-([0#]+))+$/)) return i = I(Be(e, t.replace(/[\\-]/g, ""), n)), o = 0, I(I(t.replace(/\\/g, "")).replace(/[0#]/g, function(e) {
		return o < i.length ? i.charAt(o++) : e === "0" ? "0" : "";
	}));
	if (t.match(Ae)) return i = Be(e, "##########", n), "(" + i.substr(0, 3) + ") " + i.substr(3, 3) + "-" + i.substr(6);
	var u = "";
	if (a = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) return o = Math.min(a[4].length, 7), s = W(c, 10 ** o - 1, !1), i = "" + l, u = Ve("n", a[1], s[1]), u.charAt(u.length - 1) == " " && (u = u.substr(0, u.length - 1) + "0"), i += u + a[2] + "/" + a[3], u = ee(s[2], o), u.length < a[4].length && (u = je(a[4].substr(a[4].length - u.length)) + u), i += u, i;
	if (a = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) return o = Math.min(Math.max(a[1].length, a[4].length), 7), s = W(c, 10 ** o - 1, !0), l + (s[0] || (s[1] ? "" : "0")) + " " + (s[1] ? R(s[1], o) + a[2] + "/" + a[3] + ee(s[2], o) : Tt(" ", 2 * o + 1 + a[2].length + a[3].length));
	if (a = t.match(/^[#0?]+$/)) return i = "" + n, t.length <= i.length ? i : je(t.substr(0, t.length - i.length)) + i;
	if (a = t.match(/^([#0]+)\.([#0]+)$/)) {
		i = "" + n.toFixed(Math.min(a[2].length, 10)).replace(/([^0])0+$/, "$1"), o = i.indexOf(".");
		var d = t.indexOf(".") - o, f = t.length - i.length - d;
		return je(t.substr(0, d) + i + t.substr(t.length - f));
	}
	if (a = t.match(/^00,000\.([#0]*0)$/)) return n < 0 ? "-" + Be(e, t, -n) : be("" + n).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(e) {
		return "00," + (e.length < 3 ? L(0, 3 - e.length) : "") + e;
	}) + "." + L(0, a[1].length);
	switch (t) {
		case "###,###":
		case "##,###":
		case "#,###":
			var p = be("" + c);
			return p === "0" ? "" : l + p;
		default: if (t.match(/\.[0#?]*$/)) return Be(e, t.slice(0, t.lastIndexOf(".")), n) + je(t.slice(t.lastIndexOf(".")));
	}
	throw Error("unsupported format |" + t + "|");
}
function Ve(e, t, n) {
	return (n | 0) === n ? Be(e, t, n) : Ie(e, t, n);
}
function He(e) {
	for (var t = [], n = !1, r = 0, i = 0; r < e.length; ++r) switch (e.charCodeAt(r)) {
		case 34:
			n = !n;
			break;
		case 95:
		case 42:
		case 92:
			++r;
			break;
		case 59: t[t.length] = e.substr(i, r - i), i = r + 1;
	}
	if (t[t.length] = e.substr(i), n === !0) throw Error("Format |" + e + "| unterminated string ");
	return t;
}
var Ue = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function We(e) {
	for (var t = 0, n = "", r = ""; t < e.length;) switch (n = e.charAt(t)) {
		case "G":
			V(e, t) && (t += 6), t++;
			break;
		case "\"":
			for (; e.charCodeAt(++t) !== 34 && t < e.length;);
			++t;
			break;
		case "\\":
			t += 2;
			break;
		case "_":
			t += 2;
			break;
		case "@":
			++t;
			break;
		case "B":
		case "b": if (e.charAt(t + 1) === "1" || e.charAt(t + 1) === "2") return !0;
		case "M":
		case "D":
		case "Y":
		case "H":
		case "S":
		case "E":
		case "m":
		case "d":
		case "y":
		case "h":
		case "s":
		case "e":
		case "g": return !0;
		case "A":
		case "a":
		case "上":
			if (e.substr(t, 3).toUpperCase() === "A/P" || e.substr(t, 5).toUpperCase() === "AM/PM" || e.substr(t, 5).toUpperCase() === "上午/下午") return !0;
			++t;
			break;
		case "[":
			for (r = n; e.charAt(t++) !== "]" && t < e.length;) r += e.charAt(t);
			if (r.match(Ue)) return !0;
			break;
		case ".":
		case "0":
		case "#":
			for (; t < e.length && ("0#?.,E+-%".indexOf(n = e.charAt(++t)) > -1 || n == "\\" && e.charAt(t + 1) == "-" && "0#".indexOf(e.charAt(t + 2)) > -1););
			break;
		case "?":
			for (; e.charAt(++t) === n;);
			break;
		case "*":
			++t, (e.charAt(t) == " " || e.charAt(t) == "*") && ++t;
			break;
		case "(":
		case ")":
			++t;
			break;
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			for (; t < e.length && "0123456789".indexOf(e.charAt(++t)) > -1;);
			break;
		case " ":
			++t;
			break;
		default:
			++t;
			break;
	}
	return !1;
}
function Ge(e, t, n, r) {
	for (var i = [], a = "", o = 0, s = "", c = "t", l, u, d, f = "H"; o < e.length;) switch (s = e.charAt(o)) {
		case "G":
			if (!V(e, o)) throw Error("unrecognized character " + s + " in " + e);
			i[i.length] = {
				t: "G",
				v: "General"
			}, o += 7;
			break;
		case "\"":
			for (a = ""; (d = e.charCodeAt(++o)) !== 34 && o < e.length;) a += String.fromCharCode(d);
			i[i.length] = {
				t: "t",
				v: a
			}, ++o;
			break;
		case "\\":
			var p = e.charAt(++o), m = p === "(" || p === ")" ? p : "t";
			i[i.length] = {
				t: m,
				v: p
			}, ++o;
			break;
		case "_":
			i[i.length] = {
				t: "t",
				v: " "
			}, o += 2;
			break;
		case "@":
			i[i.length] = {
				t: "T",
				v: t
			}, ++o;
			break;
		case "B":
		case "b": if (e.charAt(o + 1) === "1" || e.charAt(o + 1) === "2") {
			if (l == null && (l = se(t, n, e.charAt(o + 1) === "2"), l == null)) return "";
			i[i.length] = {
				t: "X",
				v: e.substr(o, 2)
			}, c = s, o += 2;
			break;
		}
		case "M":
		case "D":
		case "Y":
		case "H":
		case "S":
		case "E": s = s.toLowerCase();
		case "m":
		case "d":
		case "y":
		case "h":
		case "s":
		case "e":
		case "g":
			if (t < 0 || l == null && (l = se(t, n), l == null)) return "";
			for (a = s; ++o < e.length && e.charAt(o).toLowerCase() === s;) a += s;
			s === "m" && c.toLowerCase() === "h" && (s = "M"), s === "h" && (s = f), i[i.length] = {
				t: s,
				v: a
			}, c = s;
			break;
		case "A":
		case "a":
		case "上":
			var h = {
				t: s,
				v: s
			};
			if (l ??= se(t, n), e.substr(o, 3).toUpperCase() === "A/P" ? (l != null && (h.v = l.H >= 12 ? "P" : "A"), h.t = "T", f = "h", o += 3) : e.substr(o, 5).toUpperCase() === "AM/PM" ? (l != null && (h.v = l.H >= 12 ? "PM" : "AM"), h.t = "T", o += 5, f = "h") : e.substr(o, 5).toUpperCase() === "上午/下午" ? (l != null && (h.v = l.H >= 12 ? "下午" : "上午"), h.t = "T", o += 5, f = "h") : (h.t = "t", ++o), l == null && h.t === "T") return "";
			i[i.length] = h, c = s;
			break;
		case "[":
			for (a = s; e.charAt(o++) !== "]" && o < e.length;) a += e.charAt(o);
			if (a.slice(-1) !== "]") throw "unterminated \"[\" block: |" + a + "|";
			if (a.match(Ue)) {
				if (l == null && (l = se(t, n), l == null)) return "";
				i[i.length] = {
					t: "Z",
					v: a.toLowerCase()
				}, c = a.charAt(1);
			} else a.indexOf("$") > -1 && (a = (a.match(/\$([^-\[\]]*)/) || [])[1] || "$", We(e) || (i[i.length] = {
				t: "t",
				v: a
			}));
			break;
		case ".": if (l != null) {
			for (a = s; ++o < e.length && (s = e.charAt(o)) === "0";) a += s;
			i[i.length] = {
				t: "s",
				v: a
			};
			break;
		}
		case "0":
		case "#":
			for (a = s; ++o < e.length && "0#?.,E+-%".indexOf(s = e.charAt(o)) > -1;) a += s;
			i[i.length] = {
				t: "n",
				v: a
			};
			break;
		case "?":
			for (a = s; e.charAt(++o) === s;) a += s;
			i[i.length] = {
				t: s,
				v: a
			}, c = s;
			break;
		case "*":
			++o, (e.charAt(o) == " " || e.charAt(o) == "*") && ++o;
			break;
		case "(":
		case ")":
			i[i.length] = {
				t: r === 1 ? "t" : s,
				v: s
			}, ++o;
			break;
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			for (a = s; o < e.length && "0123456789".indexOf(e.charAt(++o)) > -1;) a += e.charAt(o);
			i[i.length] = {
				t: "D",
				v: a
			};
			break;
		case " ":
			i[i.length] = {
				t: s,
				v: s
			}, ++o;
			break;
		case "$":
			i[i.length] = {
				t: "t",
				v: "$"
			}, ++o;
			break;
		default:
			if (",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(s) === -1) throw Error("unrecognized character " + s + " in " + e);
			i[i.length] = {
				t: "t",
				v: s
			}, ++o;
			break;
	}
	var g = 0, _ = 0, v;
	for (o = i.length - 1, c = "t"; o >= 0; --o) switch (i[o].t) {
		case "h":
		case "H":
			i[o].t = f, c = "h", g < 1 && (g = 1);
			break;
		case "s": (v = i[o].v.match(/\.0+$/)) && (_ = Math.max(_, v[0].length - 1)), g < 3 && (g = 3);
		case "d":
		case "y":
		case "M":
		case "e":
			c = i[o].t;
			break;
		case "m":
			c === "s" && (i[o].t = "M", g < 2 && (g = 2));
			break;
		case "X": break;
		case "Z": g < 1 && i[o].v.match(/[Hh]/) && (g = 1), g < 2 && i[o].v.match(/[Mm]/) && (g = 2), g < 3 && i[o].v.match(/[Ss]/) && (g = 3);
	}
	switch (g) {
		case 0: break;
		case 1:
			l.u >= .5 && (l.u = 0, ++l.S), l.S >= 60 && (l.S = 0, ++l.M), l.M >= 60 && (l.M = 0, ++l.H);
			break;
		case 2:
			l.u >= .5 && (l.u = 0, ++l.S), l.S >= 60 && (l.S = 0, ++l.M);
			break;
	}
	var y = "", b;
	for (o = 0; o < i.length; ++o) switch (i[o].t) {
		case "t":
		case "T":
		case " ":
		case "D": break;
		case "X":
			i[o].v = "", i[o].t = ";";
			break;
		case "d":
		case "m":
		case "y":
		case "h":
		case "H":
		case "M":
		case "s":
		case "e":
		case "b":
		case "Z":
			i[o].v = ye(i[o].t.charCodeAt(0), i[o].v, l, _), i[o].t = "t";
			break;
		case "n":
		case "?":
			for (b = o + 1; i[b] != null && ((s = i[b].t) === "?" || s === "D" || (s === " " || s === "t") && i[b + 1] != null && (i[b + 1].t === "?" || i[b + 1].t === "t" && i[b + 1].v === "/") || i[o].t === "(" && (s === " " || s === "n" || s === ")") || s === "t" && (i[b].v === "/" || i[b].v === " " && i[b + 1] != null && i[b + 1].t == "?"));) i[o].v += i[b].v, i[b] = {
				v: "",
				t: ";"
			}, ++b;
			y += i[o].v, o = b - 1;
			break;
		case "G":
			i[o].t = "t", i[o].v = _e(t, n);
			break;
	}
	var x = "", S, C;
	if (y.length > 0) {
		y.charCodeAt(0) == 40 ? (S = t < 0 && y.charCodeAt(0) === 45 ? -t : t, C = Ve("n", y, S)) : (S = t < 0 && r > 1 ? -t : t, C = Ve("n", y, S), S < 0 && i[0] && i[0].t == "t" && (C = C.substr(1), i[0].v = "-" + i[0].v)), b = C.length - 1;
		var w = i.length;
		for (o = 0; o < i.length; ++o) if (i[o] != null && i[o].t != "t" && i[o].v.indexOf(".") > -1) {
			w = o;
			break;
		}
		var T = i.length;
		if (w === i.length && C.indexOf("E") === -1) {
			for (o = i.length - 1; o >= 0; --o) i[o] == null || "n?".indexOf(i[o].t) === -1 || (b >= i[o].v.length - 1 ? (b -= i[o].v.length, i[o].v = C.substr(b + 1, i[o].v.length)) : b < 0 ? i[o].v = "" : (i[o].v = C.substr(0, b + 1), b = -1), i[o].t = "t", T = o);
			b >= 0 && T < i.length && (i[T].v = C.substr(0, b + 1) + i[T].v);
		} else if (w !== i.length && C.indexOf("E") === -1) {
			for (b = C.indexOf(".") - 1, o = w; o >= 0; --o) if (!(i[o] == null || "n?".indexOf(i[o].t) === -1)) {
				for (u = i[o].v.indexOf(".") > -1 && o === w ? i[o].v.indexOf(".") - 1 : i[o].v.length - 1, x = i[o].v.substr(u + 1); u >= 0; --u) b >= 0 && (i[o].v.charAt(u) === "0" || i[o].v.charAt(u) === "#") && (x = C.charAt(b--) + x);
				i[o].v = x, i[o].t = "t", T = o;
			}
			for (b >= 0 && T < i.length && (i[T].v = C.substr(0, b + 1) + i[T].v), b = C.indexOf(".") + 1, o = w; o < i.length; ++o) if (!(i[o] == null || "n?(".indexOf(i[o].t) === -1 && o !== w)) {
				for (u = i[o].v.indexOf(".") > -1 && o === w ? i[o].v.indexOf(".") + 1 : 0, x = i[o].v.substr(0, u); u < i[o].v.length; ++u) b < C.length && (x += C.charAt(b++));
				i[o].v = x, i[o].t = "t", T = o;
			}
		}
	}
	for (o = 0; o < i.length; ++o) i[o] != null && "n?".indexOf(i[o].t) > -1 && (S = r > 1 && t < 0 && o > 0 && i[o - 1].v === "-" ? -t : t, i[o].v = Ve(i[o].t, i[o].v, S), i[o].t = "t");
	var E = "";
	for (o = 0; o !== i.length; ++o) i[o] != null && (E += i[o].v);
	return E;
}
var Ke = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function qe(e, t) {
	if (t == null) return !1;
	var n = parseFloat(t[2]);
	switch (t[1]) {
		case "=":
			if (e == n) return !0;
			break;
		case ">":
			if (e > n) return !0;
			break;
		case "<":
			if (e < n) return !0;
			break;
		case "<>":
			if (e != n) return !0;
			break;
		case ">=":
			if (e >= n) return !0;
			break;
		case "<=":
			if (e <= n) return !0;
			break;
	}
	return !1;
}
function Je(e, t) {
	var n = He(e), r = n.length, i = n[r - 1].indexOf("@");
	if (r < 4 && i > -1 && --r, n.length > 4) throw Error("cannot find right format for |" + n.join("|") + "|");
	if (typeof t != "number") return [4, n.length === 4 || i > -1 ? n[n.length - 1] : "@"];
	switch (n.length) {
		case 1:
			n = i > -1 ? [
				"General",
				"General",
				"General",
				n[0]
			] : [
				n[0],
				n[0],
				n[0],
				"@"
			];
			break;
		case 2:
			n = i > -1 ? [
				n[0],
				n[0],
				n[0],
				n[1]
			] : [
				n[0],
				n[1],
				n[0],
				"@"
			];
			break;
		case 3:
			n = i > -1 ? [
				n[0],
				n[1],
				n[0],
				n[2]
			] : [
				n[0],
				n[1],
				n[2],
				"@"
			];
			break;
		case 4: break;
	}
	var a = t > 0 ? n[0] : t < 0 ? n[1] : n[2];
	if (n[0].indexOf("[") === -1 && n[1].indexOf("[") === -1) return [r, a];
	if (n[0].match(/\[[=<>]/) != null || n[1].match(/\[[=<>]/) != null) {
		var o = n[0].match(Ke), s = n[1].match(Ke);
		return qe(t, o) ? [r, n[0]] : qe(t, s) ? [r, n[1]] : [r, n[o != null && s != null ? 2 : 1]];
	}
	return [r, a];
}
function Ye(e, t, n) {
	n ??= {};
	var r = "";
	switch (typeof e) {
		case "string":
			r = e == "m/d/yy" && n.dateNF ? n.dateNF : e;
			break;
		case "number":
			r = e == 14 && n.dateNF ? n.dateNF : (n.table == null ? U : n.table)[e], r ??= n.table && n.table[ae[e]] || U[ae[e]], r ??= oe[e] || "General";
			break;
	}
	if (V(r, 0)) return _e(t, n);
	t instanceof Date && (t = de(t, n.date1904));
	var i = Je(r, t);
	if (V(i[1])) return _e(t, n);
	if (t === !0) t = "TRUE";
	else if (t === !1) t = "FALSE";
	else if (t === "" || t == null) return "";
	return Ge(i[1], t, n, i[0]);
}
function Xe(e, t) {
	if (typeof t != "number") {
		t = +t || -1;
		for (var n = 0; n < 392; ++n) {
			if (U[n] == null) {
				t < 0 && (t = n);
				continue;
			}
			if (U[n] == e) {
				t = n;
				break;
			}
		}
		t < 0 && (t = 391);
	}
	return U[t] = e, t;
}
function Ze(e) {
	for (var t = 0; t != 392; ++t) e[t] !== void 0 && Xe(e[t], t);
}
function Qe() {
	U = ie();
}
var $e = {
	5: "\"$\"#,##0_);\\(\"$\"#,##0\\)",
	6: "\"$\"#,##0_);[Red]\\(\"$\"#,##0\\)",
	7: "\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)",
	8: "\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)",
	23: "General",
	24: "General",
	25: "General",
	26: "General",
	27: "m/d/yy",
	28: "m/d/yy",
	29: "m/d/yy",
	30: "m/d/yy",
	31: "m/d/yy",
	32: "h:mm:ss",
	33: "h:mm:ss",
	34: "h:mm:ss",
	35: "h:mm:ss",
	36: "m/d/yy",
	41: "_(* #,##0_);_(* (#,##0);_(* \"-\"_);_(@_)",
	42: "_(\"$\"* #,##0_);_(\"$\"* (#,##0);_(\"$\"* \"-\"_);_(@_)",
	43: "_(* #,##0.00_);_(* (#,##0.00);_(* \"-\"??_);_(@_)",
	44: "_(\"$\"* #,##0.00_);_(\"$\"* (#,##0.00);_(\"$\"* \"-\"??_);_(@_)",
	50: "m/d/yy",
	51: "m/d/yy",
	52: "m/d/yy",
	53: "m/d/yy",
	54: "m/d/yy",
	55: "m/d/yy",
	56: "m/d/yy",
	57: "m/d/yy",
	58: "m/d/yy",
	59: "0",
	60: "0.00",
	61: "#,##0",
	62: "#,##0.00",
	63: "\"$\"#,##0_);\\(\"$\"#,##0\\)",
	64: "\"$\"#,##0_);[Red]\\(\"$\"#,##0\\)",
	65: "\"$\"#,##0.00_);\\(\"$\"#,##0.00\\)",
	66: "\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)",
	67: "0%",
	68: "0.00%",
	69: "# ?/?",
	70: "# ??/??",
	71: "m/d/yy",
	72: "m/d/yy",
	73: "d-mmm-yy",
	74: "d-mmm",
	75: "mmm-yy",
	76: "h:mm",
	77: "h:mm:ss",
	78: "m/d/yy h:mm",
	79: "mm:ss",
	80: "[h]:mm:ss",
	81: "mmss.0"
}, et = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function tt(e) {
	var t = typeof e == "number" ? U[e] : e;
	return t = t.replace(et, "(\\d+)"), RegExp("^" + t + "$");
}
function nt(e, t, n) {
	var r = -1, i = -1, a = -1, o = -1, s = -1, c = -1;
	(t.match(et) || []).forEach(function(e, t) {
		var l = parseInt(n[t + 1], 10);
		switch (e.toLowerCase().charAt(0)) {
			case "y":
				r = l;
				break;
			case "d":
				a = l;
				break;
			case "h":
				o = l;
				break;
			case "s":
				c = l;
				break;
			case "m":
				o >= 0 ? s = l : i = l;
				break;
		}
	}), c >= 0 && s == -1 && i >= 0 && (s = i, i = -1);
	var l = ("" + (r >= 0 ? r : (/* @__PURE__ */ new Date()).getFullYear())).slice(-4) + "-" + ("00" + (i >= 1 ? i : 1)).slice(-2) + "-" + ("00" + (a >= 1 ? a : 1)).slice(-2);
	l.length == 7 && (l = "0" + l), l.length == 8 && (l = "20" + l);
	var u = ("00" + (o >= 0 ? o : 0)).slice(-2) + ":" + ("00" + (s >= 0 ? s : 0)).slice(-2) + ":" + ("00" + (c >= 0 ? c : 0)).slice(-2);
	return o == -1 && s == -1 && c == -1 ? l : r == -1 && i == -1 && a == -1 ? u : l + "T" + u;
}
var rt = /*#__PURE__*/ (function() {
	var e = {};
	e.version = "1.2.0";
	function t() {
		for (var e = 0, t = Array(256), n = 0; n != 256; ++n) e = n, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1, t[n] = e;
		return typeof Int32Array < "u" ? new Int32Array(t) : t;
	}
	var n = t();
	function r(e) {
		var t = 0, n = 0, r = 0, i = typeof Int32Array < "u" ? /* @__PURE__ */ new Int32Array(4096) : Array(4096);
		for (r = 0; r != 256; ++r) i[r] = e[r];
		for (r = 0; r != 256; ++r) for (n = e[r], t = 256 + r; t < 4096; t += 256) n = i[t] = n >>> 8 ^ e[n & 255];
		var a = [];
		for (r = 1; r != 16; ++r) a[r - 1] = typeof Int32Array < "u" ? i.subarray(r * 256, r * 256 + 256) : i.slice(r * 256, r * 256 + 256);
		return a;
	}
	var i = r(n), a = i[0], o = i[1], s = i[2], c = i[3], l = i[4], u = i[5], d = i[6], f = i[7], p = i[8], m = i[9], h = i[10], g = i[11], _ = i[12], v = i[13], y = i[14];
	function b(e, t) {
		for (var r = t ^ -1, i = 0, a = e.length; i < a;) r = r >>> 8 ^ n[(r ^ e.charCodeAt(i++)) & 255];
		return ~r;
	}
	function x(e, t) {
		for (var r = t ^ -1, i = e.length - 15, b = 0; b < i;) r = y[e[b++] ^ r & 255] ^ v[e[b++] ^ r >> 8 & 255] ^ _[e[b++] ^ r >> 16 & 255] ^ g[e[b++] ^ r >>> 24] ^ h[e[b++]] ^ m[e[b++]] ^ p[e[b++]] ^ f[e[b++]] ^ d[e[b++]] ^ u[e[b++]] ^ l[e[b++]] ^ c[e[b++]] ^ s[e[b++]] ^ o[e[b++]] ^ a[e[b++]] ^ n[e[b++]];
		for (i += 15; b < i;) r = r >>> 8 ^ n[(r ^ e[b++]) & 255];
		return ~r;
	}
	function S(e, t) {
		for (var r = t ^ -1, i = 0, a = e.length, o = 0, s = 0; i < a;) o = e.charCodeAt(i++), o < 128 ? r = r >>> 8 ^ n[(r ^ o) & 255] : o < 2048 ? (r = r >>> 8 ^ n[(r ^ (192 | o >> 6 & 31)) & 255], r = r >>> 8 ^ n[(r ^ (128 | o & 63)) & 255]) : o >= 55296 && o < 57344 ? (o = (o & 1023) + 64, s = e.charCodeAt(i++) & 1023, r = r >>> 8 ^ n[(r ^ (240 | o >> 8 & 7)) & 255], r = r >>> 8 ^ n[(r ^ (128 | o >> 2 & 63)) & 255], r = r >>> 8 ^ n[(r ^ (128 | s >> 6 & 15 | (o & 3) << 4)) & 255], r = r >>> 8 ^ n[(r ^ (128 | s & 63)) & 255]) : (r = r >>> 8 ^ n[(r ^ (224 | o >> 12 & 15)) & 255], r = r >>> 8 ^ n[(r ^ (128 | o >> 6 & 63)) & 255], r = r >>> 8 ^ n[(r ^ (128 | o & 63)) & 255]);
		return ~r;
	}
	return e.table = n, e.bstr = b, e.buf = x, e.str = S, e;
})(), G = /*#__PURE__*/ (function() {
	var e = {};
	e.version = "1.2.1";
	function t(e, t) {
		for (var n = e.split("/"), r = t.split("/"), i = 0, a = 0, o = Math.min(n.length, r.length); i < o; ++i) {
			if (a = n[i].length - r[i].length) return a;
			if (n[i] != r[i]) return n[i] < r[i] ? -1 : 1;
		}
		return n.length - r.length;
	}
	function n(e) {
		if (e.charAt(e.length - 1) == "/") return e.slice(0, -1).indexOf("/") === -1 ? e : n(e.slice(0, -1));
		var t = e.lastIndexOf("/");
		return t === -1 ? e : e.slice(0, t + 1);
	}
	function r(e) {
		if (e.charAt(e.length - 1) == "/") return r(e.slice(0, -1));
		var t = e.lastIndexOf("/");
		return t === -1 ? e : e.slice(t + 1);
	}
	function i(e, t) {
		typeof t == "string" && (t = new Date(t));
		var n = t.getHours();
		n = n << 6 | t.getMinutes(), n = n << 5 | t.getSeconds() >>> 1, e.write_shift(2, n);
		var r = t.getFullYear() - 1980;
		r = r << 4 | t.getMonth() + 1, r = r << 5 | t.getDate(), e.write_shift(2, r);
	}
	function a(e) {
		var t = e.read_shift(2) & 65535, n = e.read_shift(2) & 65535, r = /* @__PURE__ */ new Date(), i = n & 31;
		n >>>= 5;
		var a = n & 15;
		n >>>= 4, r.setMilliseconds(0), r.setFullYear(n + 1980), r.setMonth(a - 1), r.setDate(i);
		var o = t & 31;
		t >>>= 5;
		var s = t & 63;
		return t >>>= 6, r.setHours(t), r.setMinutes(s), r.setSeconds(o << 1), r;
	}
	function o(e) {
		lr(e, 0);
		for (var t = {}, n = 0; e.l <= e.length - 4;) {
			var r = e.read_shift(2), i = e.read_shift(2), a = e.l + i, o = {};
			switch (r) {
				case 21589:
					n = e.read_shift(1), n & 1 && (o.mtime = e.read_shift(4)), i > 5 && (n & 2 && (o.atime = e.read_shift(4)), n & 4 && (o.ctime = e.read_shift(4))), o.mtime && (o.mt = /* @__PURE__ */ new Date(o.mtime * 1e3));
					break;
			}
			e.l = a, t[r] = o;
		}
		return t;
	}
	var s;
	function c() {
		return s ||= {};
	}
	function l(e, t) {
		if (e[0] == 80 && e[1] == 75) return Be(e, t);
		if ((e[0] | 32) == 109 && (e[1] | 32) == 105) return Ye(e, t);
		if (e.length < 512) throw Error("CFB file size " + e.length + " < 512");
		var n = 3, r = 512, i = 0, a = 0, o = 0, s = 0, c = 0, l = [], m = e.slice(0, 512);
		lr(m, 0);
		var g = u(m);
		switch (n = g[0], n) {
			case 3:
				r = 512;
				break;
			case 4:
				r = 4096;
				break;
			case 0: if (g[1] == 0) return Be(e, t);
			default: throw Error("Major Version: Expected 3 or 4 saw " + n);
		}
		r !== 512 && (m = e.slice(0, r), lr(m, 28));
		var y = e.slice(0, r);
		d(m, n);
		var b = m.read_shift(4, "i");
		if (n === 3 && b !== 0) throw Error("# Directory Sectors: Expected 0 saw " + b);
		m.l += 4, o = m.read_shift(4, "i"), m.l += 4, m.chk("00100000", "Mini Stream Cutoff Size: "), s = m.read_shift(4, "i"), i = m.read_shift(4, "i"), c = m.read_shift(4, "i"), a = m.read_shift(4, "i");
		for (var x = -1, S = 0; S < 109 && (x = m.read_shift(4, "i"), !(x < 0)); ++S) l[S] = x;
		var C = f(e, r);
		h(c, a, C, r, l);
		var w = _(C, o, l, r);
		w[o].name = "!Directory", i > 0 && s !== R && (w[s].name = "!MiniFAT"), w[l[0]].name = "!FAT", w.fat_addrs = l, w.ssz = r;
		var T = {}, E = [], D = [], O = [];
		v(o, w, C, E, i, T, D, s), p(D, O, E), E.shift();
		var k = {
			FileIndex: D,
			FullPaths: O
		};
		return t && t.raw && (k.raw = {
			header: y,
			sectors: C
		}), k;
	}
	function u(e) {
		if (e[e.l] == 80 && e[e.l + 1] == 75) return [0, 0];
		e.chk(ee, "Header Signature: "), e.l += 16;
		var t = e.read_shift(2, "u");
		return [e.read_shift(2, "u"), t];
	}
	function d(e, t) {
		var n = 9;
		switch (e.l += 2, n = e.read_shift(2)) {
			case 9:
				if (t != 3) throw Error("Sector Shift: Expected 9 saw " + n);
				break;
			case 12:
				if (t != 4) throw Error("Sector Shift: Expected 12 saw " + n);
				break;
			default: throw Error("Sector Shift: Expected 9 or 12 saw " + n);
		}
		e.chk("0600", "Mini Sector Shift: "), e.chk("000000000000", "Reserved: ");
	}
	function f(e, t) {
		for (var n = Math.ceil(e.length / t) - 1, r = [], i = 1; i < n; ++i) r[i - 1] = e.slice(i * t, (i + 1) * t);
		return r[n - 1] = e.slice(n * t), r;
	}
	function p(e, t, n) {
		for (var r = 0, i = 0, a = 0, o = 0, s = 0, c = n.length, l = [], u = []; r < c; ++r) l[r] = u[r] = r, t[r] = n[r];
		for (; s < u.length; ++s) r = u[s], i = e[r].L, a = e[r].R, o = e[r].C, l[r] === r && (i !== -1 && l[i] !== i && (l[r] = l[i]), a !== -1 && l[a] !== a && (l[r] = l[a])), o !== -1 && (l[o] = r), i !== -1 && r != l[r] && (l[i] = l[r], u.lastIndexOf(i) < s && u.push(i)), a !== -1 && r != l[r] && (l[a] = l[r], u.lastIndexOf(a) < s && u.push(a));
		for (r = 1; r < c; ++r) l[r] === r && (a !== -1 && l[a] !== a ? l[r] = l[a] : i !== -1 && l[i] !== i && (l[r] = l[i]));
		for (r = 1; r < c; ++r) if (e[r].type !== 0) {
			if (s = r, s != l[s]) do
				s = l[s], t[r] = t[s] + "/" + t[r];
			while (s !== 0 && l[s] !== -1 && s != l[s]);
			l[r] = -1;
		}
		for (t[0] += "/", r = 1; r < c; ++r) e[r].type !== 2 && (t[r] += "/");
	}
	function m(e, t, n) {
		for (var r = e.start, i = e.size, a = [], o = r; n && i > 0 && o >= 0;) a.push(t.slice(o * L, o * L + L)), i -= L, o = tr(n, o * 4);
		return a.length === 0 ? dr(0) : M(a).slice(0, e.size);
	}
	function h(e, t, n, r, i) {
		var a = R;
		if (e === R) {
			if (t !== 0) throw Error("DIFAT chain shorter than expected");
		} else if (e !== -1) {
			var o = n[e], s = (r >>> 2) - 1;
			if (!o) return;
			for (var c = 0; c < s && (a = tr(o, c * 4)) !== R; ++c) i.push(a);
			h(tr(o, r - 4), t - 1, n, r, i);
		}
	}
	function g(e, t, n, r, i) {
		var a = [], o = [];
		i ||= [];
		var s = r - 1, c = 0, l = 0;
		for (c = t; c >= 0;) {
			i[c] = !0, a[a.length] = c, o.push(e[c]);
			var u = n[Math.floor(c * 4 / r)];
			if (l = c * 4 & s, r < 4 + l) throw Error("FAT boundary crossed: " + c + " 4 " + r);
			if (!e[u]) break;
			c = tr(e[u], l);
		}
		return {
			nodes: a,
			data: An([o])
		};
	}
	function _(e, t, n, r) {
		var i = e.length, a = [], o = [], s = [], c = [], l = r - 1, u = 0, d = 0, f = 0, p = 0;
		for (u = 0; u < i; ++u) if (s = [], f = u + t, f >= i && (f -= i), !o[f]) {
			c = [];
			var m = [];
			for (d = f; d >= 0;) {
				m[d] = !0, o[d] = !0, s[s.length] = d, c.push(e[d]);
				var h = n[Math.floor(d * 4 / r)];
				if (p = d * 4 & l, r < 4 + p) throw Error("FAT boundary crossed: " + d + " 4 " + r);
				if (!e[h] || (d = tr(e[h], p), m[d])) break;
			}
			a[f] = {
				nodes: s,
				data: An([c])
			};
		}
		return a;
	}
	function v(e, t, n, r, i, a, o, s) {
		for (var c = 0, l = r.length ? 2 : 0, u = t[e].data, d = 0, f = 0, p; d < u.length; d += 128) {
			var h = u.slice(d, d + 128);
			lr(h, 64), f = h.read_shift(2), p = Mn(h, 0, f - l), r.push(p);
			var _ = {
				name: p,
				type: h.read_shift(1),
				color: h.read_shift(1),
				L: h.read_shift(4, "i"),
				R: h.read_shift(4, "i"),
				C: h.read_shift(4, "i"),
				clsid: h.read_shift(16),
				state: h.read_shift(4, "i"),
				start: 0,
				size: 0
			};
			h.read_shift(2) + h.read_shift(2) + h.read_shift(2) + h.read_shift(2) !== 0 && (_.ct = y(h, h.l - 8)), h.read_shift(2) + h.read_shift(2) + h.read_shift(2) + h.read_shift(2) !== 0 && (_.mt = y(h, h.l - 8)), _.start = h.read_shift(4, "i"), _.size = h.read_shift(4, "i"), _.size < 0 && _.start < 0 && (_.size = _.type = 0, _.start = R, _.name = ""), _.type === 5 ? (c = _.start, i > 0 && c !== R && (t[c].name = "!StreamData")) : _.size >= 4096 ? (_.storage = "fat", t[_.start] === void 0 && (t[_.start] = g(n, _.start, t.fat_addrs, t.ssz)), t[_.start].name = _.name, _.content = t[_.start].data.slice(0, _.size)) : (_.storage = "minifat", _.size < 0 ? _.size = 0 : c !== R && _.start !== R && t[c] && (_.content = m(_, t[c].data, (t[s] || {}).data))), _.content && lr(_.content, 0), a[p] = _, o.push(_);
		}
	}
	function y(e, t) {
		return /* @__PURE__ */ new Date((er(e, t + 4) / 1e7 * 2 ** 32 + er(e, t) / 1e7 - 11644473600) * 1e3);
	}
	function b(e, t) {
		return c(), l(s.readFileSync(e), t);
	}
	function O(e, t) {
		var n = t && t.type;
		switch (n || C && Buffer.isBuffer(e) && (n = "buffer"), n || "base64") {
			case "file": return b(e, t);
			case "base64": return l(D(S(e)), t);
			case "binary": return l(D(e), t);
		}
		return l(e, t);
	}
	function k(e, t) {
		var n = t || {}, r = n.root || "Root Entry";
		if (e.FullPaths ||= [], e.FileIndex ||= [], e.FullPaths.length !== e.FileIndex.length) throw Error("inconsistent CFB structure");
		e.FullPaths.length === 0 && (e.FullPaths[0] = r + "/", e.FileIndex[0] = {
			name: r,
			type: 5
		}), n.CLSID && (e.FileIndex[0].clsid = n.CLSID), A(e);
	}
	function A(e) {
		var t = "Sh33tJ5";
		if (!G.find(e, "/" + t)) {
			var n = dr(4);
			n[0] = 55, n[1] = n[3] = 50, n[2] = 54, e.FileIndex.push({
				name: t,
				type: 2,
				content: n,
				size: 4,
				L: 69,
				R: 69,
				C: 69
			}), e.FullPaths.push(e.FullPaths[0] + t), j(e);
		}
	}
	function j(e, i) {
		k(e);
		for (var a = !1, o = !1, s = e.FullPaths.length - 1; s >= 0; --s) {
			var c = e.FileIndex[s];
			switch (c.type) {
				case 0:
					o ? a = !0 : (e.FileIndex.pop(), e.FullPaths.pop());
					break;
				case 1:
				case 2:
				case 5:
					o = !0, isNaN(c.R * c.L * c.C) && (a = !0), c.R > -1 && c.L > -1 && c.R == c.L && (a = !0);
					break;
				default:
					a = !0;
					break;
			}
		}
		if (!(!a && !i)) {
			var l = new Date(1987, 1, 19), u = 0, d = Object.create ? Object.create(null) : {}, f = [];
			for (s = 0; s < e.FullPaths.length; ++s) d[e.FullPaths[s]] = !0, e.FileIndex[s].type !== 0 && f.push([e.FullPaths[s], e.FileIndex[s]]);
			for (s = 0; s < f.length; ++s) {
				var p = n(f[s][0]);
				o = d[p], o || (f.push([p, {
					name: r(p).replace("/", ""),
					type: 1,
					clsid: B,
					ct: l,
					mt: l,
					content: null
				}]), d[p] = !0);
			}
			for (f.sort(function(e, n) {
				return t(e[0], n[0]);
			}), e.FullPaths = [], e.FileIndex = [], s = 0; s < f.length; ++s) e.FullPaths[s] = f[s][0], e.FileIndex[s] = f[s][1];
			for (s = 0; s < f.length; ++s) {
				var m = e.FileIndex[s], h = e.FullPaths[s];
				if (m.name = r(h).replace("/", ""), m.L = m.R = m.C = -(m.color = 1), m.size = m.content ? m.content.length : 0, m.start = 0, m.clsid = m.clsid || B, s === 0) m.C = f.length > 1 ? 1 : -1, m.size = 0, m.type = 5;
				else if (h.slice(-1) == "/") {
					for (u = s + 1; u < f.length && n(e.FullPaths[u]) != h; ++u);
					for (m.C = u >= f.length ? -1 : u, u = s + 1; u < f.length && n(e.FullPaths[u]) != n(h); ++u);
					m.R = u >= f.length ? -1 : u, m.type = 1;
				} else n(e.FullPaths[s + 1] || "") == n(h) && (m.R = s + 1), m.type = 2;
			}
		}
	}
	function N(e, t) {
		var n = t || {};
		if (n.fileType == "mad") return Xe(e, n);
		switch (j(e), n.fileType) {
			case "zip": return He(e, n);
		}
		var r = (function(e) {
			for (var t = 0, n = 0, r = 0; r < e.FileIndex.length; ++r) {
				var i = e.FileIndex[r];
				if (i.content) {
					var a = i.content.length;
					a > 0 && (a < 4096 ? t += a + 63 >> 6 : n += a + 511 >> 9);
				}
			}
			for (var o = e.FullPaths.length + 3 >> 2, s = t + 7 >> 3, c = t + 127 >> 7, l = s + n + o + c, u = l + 127 >> 7, d = u <= 109 ? 0 : Math.ceil((u - 109) / 127); l + u + d + 127 >> 7 > u;) d = ++u <= 109 ? 0 : Math.ceil((u - 109) / 127);
			var f = [
				1,
				d,
				u,
				c,
				o,
				n,
				t,
				0
			];
			return e.FileIndex[0].size = t << 6, f[7] = (e.FileIndex[0].start = f[0] + f[1] + f[2] + f[3] + f[4] + f[5]) + (f[6] + 7 >> 3), f;
		})(e), i = dr(r[7] << 9), a = 0, o = 0;
		for (a = 0; a < 8; ++a) i.write_shift(1, z[a]);
		for (a = 0; a < 8; ++a) i.write_shift(2, 0);
		for (i.write_shift(2, 62), i.write_shift(2, 3), i.write_shift(2, 65534), i.write_shift(2, 9), i.write_shift(2, 6), a = 0; a < 3; ++a) i.write_shift(2, 0);
		for (i.write_shift(4, 0), i.write_shift(4, r[2]), i.write_shift(4, r[0] + r[1] + r[2] + r[3] - 1), i.write_shift(4, 0), i.write_shift(4, 4096), i.write_shift(4, r[3] ? r[0] + r[1] + r[2] - 1 : R), i.write_shift(4, r[3]), i.write_shift(-4, r[1] ? r[0] - 1 : R), i.write_shift(4, r[1]), a = 0; a < 109; ++a) i.write_shift(-4, a < r[2] ? r[1] + a : -1);
		if (r[1]) for (o = 0; o < r[1]; ++o) {
			for (; a < 236 + o * 127; ++a) i.write_shift(-4, a < r[2] ? r[1] + a : -1);
			i.write_shift(-4, o === r[1] - 1 ? R : o + 1);
		}
		var s = function(e) {
			for (o += e; a < o - 1; ++a) i.write_shift(-4, a + 1);
			e && (++a, i.write_shift(-4, R));
		};
		for (o = a = 0, o += r[1]; a < o; ++a) i.write_shift(-4, te.DIFSECT);
		for (o += r[2]; a < o; ++a) i.write_shift(-4, te.FATSECT);
		s(r[3]), s(r[4]);
		for (var c = 0, l = 0, u = e.FileIndex[0]; c < e.FileIndex.length; ++c) u = e.FileIndex[c], u.content && (l = u.content.length, !(l < 4096) && (u.start = o, s(l + 511 >> 9)));
		for (s(r[6] + 7 >> 3); i.l & 511;) i.write_shift(-4, te.ENDOFCHAIN);
		for (o = a = 0, c = 0; c < e.FileIndex.length; ++c) u = e.FileIndex[c], u.content && (l = u.content.length, !(!l || l >= 4096) && (u.start = o, s(l + 63 >> 6)));
		for (; i.l & 511;) i.write_shift(-4, te.ENDOFCHAIN);
		for (a = 0; a < r[4] << 2; ++a) {
			var d = e.FullPaths[a];
			if (!d || d.length === 0) {
				for (c = 0; c < 17; ++c) i.write_shift(4, 0);
				for (c = 0; c < 3; ++c) i.write_shift(4, -1);
				for (c = 0; c < 12; ++c) i.write_shift(4, 0);
				continue;
			}
			u = e.FileIndex[a], a === 0 && (u.start = u.size ? u.start - 1 : R);
			var f = a === 0 && n.root || u.name;
			if (l = 2 * (f.length + 1), i.write_shift(64, f, "utf16le"), i.write_shift(2, l), i.write_shift(1, u.type), i.write_shift(1, u.color), i.write_shift(-4, u.L), i.write_shift(-4, u.R), i.write_shift(-4, u.C), u.clsid) i.write_shift(16, u.clsid, "hex");
			else for (c = 0; c < 4; ++c) i.write_shift(4, 0);
			i.write_shift(4, u.state || 0), i.write_shift(4, 0), i.write_shift(4, 0), i.write_shift(4, 0), i.write_shift(4, 0), i.write_shift(4, u.start), i.write_shift(4, u.size), i.write_shift(4, 0);
		}
		for (a = 1; a < e.FileIndex.length; ++a) if (u = e.FileIndex[a], u.size >= 4096) if (i.l = u.start + 1 << 9, C && Buffer.isBuffer(u.content)) u.content.copy(i, i.l, 0, u.size), i.l += u.size + 511 & -512;
		else {
			for (c = 0; c < u.size; ++c) i.write_shift(1, u.content[c]);
			for (; c & 511; ++c) i.write_shift(1, 0);
		}
		for (a = 1; a < e.FileIndex.length; ++a) if (u = e.FileIndex[a], u.size > 0 && u.size < 4096) if (C && Buffer.isBuffer(u.content)) u.content.copy(i, i.l, 0, u.size), i.l += u.size + 63 & -64;
		else {
			for (c = 0; c < u.size; ++c) i.write_shift(1, u.content[c]);
			for (; c & 63; ++c) i.write_shift(1, 0);
		}
		if (C) i.l = i.length;
		else for (; i.l < i.length;) i.write_shift(1, 0);
		return i;
	}
	function I(e, t) {
		var n = e.FullPaths.map(function(e) {
			return e.toUpperCase();
		}), r = n.map(function(e) {
			var t = e.split("/");
			return t[t.length - (e.slice(-1) == "/" ? 2 : 1)];
		}), i = !1;
		t.charCodeAt(0) === 47 ? (i = !0, t = n[0].slice(0, -1) + t) : i = t.indexOf("/") !== -1;
		var a = t.toUpperCase(), o = i === !0 ? n.indexOf(a) : r.indexOf(a);
		if (o !== -1) return e.FileIndex[o];
		var s = !a.match(F);
		for (a = a.replace(P, ""), s && (a = a.replace(F, "!")), o = 0; o < n.length; ++o) if ((s ? n[o].replace(F, "!") : n[o]).replace(P, "") == a || (s ? r[o].replace(F, "!") : r[o]).replace(P, "") == a) return e.FileIndex[o];
		return null;
	}
	var L = 64, R = -2, ee = "d0cf11e0a1b11ae1", z = [
		208,
		207,
		17,
		224,
		161,
		177,
		26,
		225
	], B = "00000000000000000000000000000000", te = {
		MAXREGSECT: -6,
		DIFSECT: -4,
		FATSECT: -3,
		ENDOFCHAIN: R,
		FREESECT: -1,
		HEADER_SIGNATURE: ee,
		HEADER_MINOR_VERSION: "3e00",
		MAXREGSID: -6,
		NOSTREAM: -1,
		HEADER_CLSID: B,
		EntryTypes: [
			"unknown",
			"storage",
			"stream",
			"lockbytes",
			"property",
			"root"
		]
	};
	function ne(e, t, n) {
		c();
		var r = N(e, n);
		s.writeFileSync(t, r);
	}
	function V(e) {
		for (var t = Array(e.length), n = 0; n < e.length; ++n) t[n] = String.fromCharCode(e[n]);
		return t.join("");
	}
	function re(e, t) {
		var n = N(e, t);
		switch (t && t.type || "buffer") {
			case "file": return c(), s.writeFileSync(t.filename, n), n;
			case "binary": return typeof n == "string" ? n : V(n);
			case "base64": return x(typeof n == "string" ? n : V(n));
			case "buffer": if (C) return Buffer.isBuffer(n) ? n : w(n);
			case "array": return typeof n == "string" ? D(n) : n;
		}
		return n;
	}
	var H;
	function ie(e) {
		try {
			var t = e.InflateRaw, n = new t();
			if (n._processChunk(new Uint8Array([3, 0]), n._finishFlushFlag), n.bytesRead) H = e;
			else throw Error("zlib does not expose bytesRead");
		} catch (e) {
			console.error("cannot use native zlib: " + (e.message || e));
		}
	}
	function U(e, t) {
		if (!H) return Re(e, t);
		var n = H.InflateRaw, r = new n(), i = r._processChunk(e.slice(e.l), r._finishFlushFlag);
		return e.l += r.bytesRead, i;
	}
	function ae(e) {
		return H ? H.deflateRawSync(e) : Ae(e);
	}
	var oe = [
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	], W = [
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		13,
		15,
		17,
		19,
		23,
		27,
		31,
		35,
		43,
		51,
		59,
		67,
		83,
		99,
		115,
		131,
		163,
		195,
		227,
		258
	], se = [
		1,
		2,
		3,
		4,
		5,
		7,
		9,
		13,
		17,
		25,
		33,
		49,
		65,
		97,
		129,
		193,
		257,
		385,
		513,
		769,
		1025,
		1537,
		2049,
		3073,
		4097,
		6145,
		8193,
		12289,
		16385,
		24577
	];
	function ce(e) {
		var t = (e << 1 | e << 11) & 139536 | (e << 5 | e << 15) & 558144;
		return (t >> 16 | t >> 8 | t) & 255;
	}
	for (var le = typeof Uint8Array < "u", ue = le ? /* @__PURE__ */ new Uint8Array(256) : [], de = 0; de < 256; ++de) ue[de] = ce(de);
	function fe(e, t) {
		var n = ue[e & 255];
		return t <= 8 ? n >>> 8 - t : (n = n << 8 | ue[e >> 8 & 255], t <= 16 ? n >>> 16 - t : (n = n << 8 | ue[e >> 16 & 255], n >>> 24 - t));
	}
	function pe(e, t) {
		var n = t & 7, r = t >>> 3;
		return (e[r] | (n <= 6 ? 0 : e[r + 1] << 8)) >>> n & 3;
	}
	function me(e, t) {
		var n = t & 7, r = t >>> 3;
		return (e[r] | (n <= 5 ? 0 : e[r + 1] << 8)) >>> n & 7;
	}
	function he(e, t) {
		var n = t & 7, r = t >>> 3;
		return (e[r] | (n <= 4 ? 0 : e[r + 1] << 8)) >>> n & 15;
	}
	function ge(e, t) {
		var n = t & 7, r = t >>> 3;
		return (e[r] | (n <= 3 ? 0 : e[r + 1] << 8)) >>> n & 31;
	}
	function _e(e, t) {
		var n = t & 7, r = t >>> 3;
		return (e[r] | (n <= 1 ? 0 : e[r + 1] << 8)) >>> n & 127;
	}
	function ve(e, t, n) {
		var r = t & 7, i = t >>> 3, a = (1 << n) - 1, o = e[i] >>> r;
		return n < 8 - r || (o |= e[i + 1] << 8 - r, n < 16 - r) || (o |= e[i + 2] << 16 - r, n < 24 - r) || (o |= e[i + 3] << 24 - r), o & a;
	}
	function ye(e, t, n) {
		var r = t & 7, i = t >>> 3;
		return r <= 5 ? e[i] |= (n & 7) << r : (e[i] |= n << r & 255, e[i + 1] = (n & 7) >> 8 - r), t + 3;
	}
	function be(e, t, n) {
		var r = t & 7, i = t >>> 3;
		return n = (n & 1) << r, e[i] |= n, t + 1;
	}
	function xe(e, t, n) {
		var r = t & 7, i = t >>> 3;
		return n <<= r, e[i] |= n & 255, n >>>= 8, e[i + 1] = n, t + 8;
	}
	function Se(e, t, n) {
		var r = t & 7, i = t >>> 3;
		return n <<= r, e[i] |= n & 255, n >>>= 8, e[i + 1] = n & 255, e[i + 2] = n >>> 8, t + 16;
	}
	function Ce(e, t) {
		var n = e.length, r = 2 * n > t ? 2 * n : t + 5, i = 0;
		if (n >= t) return e;
		if (C) {
			var a = E(r);
			if (e.copy) e.copy(a);
			else for (; i < e.length; ++i) a[i] = e[i];
			return a;
		} else if (le) {
			var o = new Uint8Array(r);
			if (o.set) o.set(e);
			else for (; i < n; ++i) o[i] = e[i];
			return o;
		}
		return e.length = r, e;
	}
	function we(e) {
		for (var t = Array(e), n = 0; n < e; ++n) t[n] = 0;
		return t;
	}
	function Te(e, t, n) {
		var r = 1, i = 0, a = 0, o = 0, s = 0, c = e.length, l = le ? /* @__PURE__ */ new Uint16Array(32) : we(32);
		for (a = 0; a < 32; ++a) l[a] = 0;
		for (a = c; a < n; ++a) e[a] = 0;
		c = e.length;
		var u = le ? new Uint16Array(c) : we(c);
		for (a = 0; a < c; ++a) l[i = e[a]]++, r < i && (r = i), u[a] = 0;
		for (l[0] = 0, a = 1; a <= r; ++a) l[a + 16] = s = s + l[a - 1] << 1;
		for (a = 0; a < c; ++a) s = e[a], s != 0 && (u[a] = l[s + 16]++);
		var d = 0;
		for (a = 0; a < c; ++a) if (d = e[a], d != 0) for (s = fe(u[a], r) >> r - d, o = (1 << r + 4 - d) - 1; o >= 0; --o) t[s | o << d] = d & 15 | a << 4;
		return r;
	}
	var Ee = le ? /* @__PURE__ */ new Uint16Array(512) : we(512), De = le ? /* @__PURE__ */ new Uint16Array(32) : we(32);
	if (!le) {
		for (var Oe = 0; Oe < 512; ++Oe) Ee[Oe] = 0;
		for (Oe = 0; Oe < 32; ++Oe) De[Oe] = 0;
	}
	(function() {
		for (var e = [], t = 0; t < 32; t++) e.push(5);
		Te(e, De, 32);
		var n = [];
		for (t = 0; t <= 143; t++) n.push(8);
		for (; t <= 255; t++) n.push(9);
		for (; t <= 279; t++) n.push(7);
		for (; t <= 287; t++) n.push(8);
		Te(n, Ee, 288);
	})();
	var ke = /*#__PURE__*/ (function() {
		for (var e = le ? /* @__PURE__ */ new Uint8Array(32768) : [], t = 0, n = 0; t < se.length - 1; ++t) for (; n < se[t + 1]; ++n) e[n] = t;
		for (; n < 32768; ++n) e[n] = 29;
		var r = le ? /* @__PURE__ */ new Uint8Array(259) : [];
		for (t = 0, n = 0; t < W.length - 1; ++t) for (; n < W[t + 1]; ++n) r[n] = t;
		function i(e, t) {
			for (var n = 0; n < e.length;) {
				var r = Math.min(65535, e.length - n), i = n + r == e.length;
				for (t.write_shift(1, +i), t.write_shift(2, r), t.write_shift(2, ~r & 65535); r-- > 0;) t[t.l++] = e[n++];
			}
			return t.l;
		}
		function a(t, n) {
			for (var i = 0, a = 0, o = le ? /* @__PURE__ */ new Uint16Array(32768) : []; a < t.length;) {
				var s = Math.min(65535, t.length - a);
				if (s < 10) {
					for (i = ye(n, i, +(a + s == t.length)), i & 7 && (i += 8 - (i & 7)), n.l = i / 8 | 0, n.write_shift(2, s), n.write_shift(2, ~s & 65535); s-- > 0;) n[n.l++] = t[a++];
					i = n.l * 8;
					continue;
				}
				i = ye(n, i, +(a + s == t.length) + 2);
				for (var c = 0; s-- > 0;) {
					var l = t[a];
					c = (c << 5 ^ l) & 32767;
					var u = -1, d = 0;
					if ((u = o[c]) && (u |= a & -32768, u > a && (u -= 32768), u < a)) for (; t[u + d] == t[a + d] && d < 250;) ++d;
					if (d > 2) {
						l = r[d], l <= 22 ? i = xe(n, i, ue[l + 1] >> 1) - 1 : (xe(n, i, 3), i += 5, xe(n, i, ue[l - 23] >> 5), i += 3);
						var f = l < 8 ? 0 : l - 4 >> 2;
						f > 0 && (Se(n, i, d - W[l]), i += f), l = e[a - u], i = xe(n, i, ue[l] >> 3), i -= 3;
						var p = l < 4 ? 0 : l - 2 >> 1;
						p > 0 && (Se(n, i, a - u - se[l]), i += p);
						for (var m = 0; m < d; ++m) o[c] = a & 32767, c = (c << 5 ^ t[a]) & 32767, ++a;
						s -= d - 1;
					} else l <= 143 ? l += 48 : i = be(n, i, 1), i = xe(n, i, ue[l]), o[c] = a & 32767, ++a;
				}
				i = xe(n, i, 0) - 1;
			}
			return n.l = (i + 7) / 8 | 0, n.l;
		}
		return function(e, t) {
			return e.length < 8 ? i(e, t) : a(e, t);
		};
	})();
	function Ae(e) {
		var t = dr(50 + Math.floor(e.length * 1.1)), n = ke(e, t);
		return t.slice(0, n);
	}
	var je = le ? /* @__PURE__ */ new Uint16Array(32768) : we(32768), Me = le ? /* @__PURE__ */ new Uint16Array(32768) : we(32768), Ne = le ? /* @__PURE__ */ new Uint16Array(128) : we(128), Pe = 1, Fe = 1;
	function Ie(e, t) {
		var n = ge(e, t) + 257;
		t += 5;
		var r = ge(e, t) + 1;
		t += 5;
		var i = he(e, t) + 4;
		t += 4;
		for (var a = 0, o = le ? /* @__PURE__ */ new Uint8Array(19) : we(19), s = [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		], c = 1, l = le ? /* @__PURE__ */ new Uint8Array(8) : we(8), u = le ? /* @__PURE__ */ new Uint8Array(8) : we(8), d = o.length, f = 0; f < i; ++f) o[oe[f]] = a = me(e, t), c < a && (c = a), l[a]++, t += 3;
		var p = 0;
		for (l[0] = 0, f = 1; f <= c; ++f) u[f] = p = p + l[f - 1] << 1;
		for (f = 0; f < d; ++f) (p = o[f]) != 0 && (s[f] = u[p]++);
		var m = 0;
		for (f = 0; f < d; ++f) if (m = o[f], m != 0) {
			p = ue[s[f]] >> 8 - m;
			for (var h = (1 << 7 - m) - 1; h >= 0; --h) Ne[p | h << m] = m & 7 | f << 3;
		}
		var g = [];
		for (c = 1; g.length < n + r;) switch (p = Ne[_e(e, t)], t += p & 7, p >>>= 3) {
			case 16:
				for (a = 3 + pe(e, t), t += 2, p = g[g.length - 1]; a-- > 0;) g.push(p);
				break;
			case 17:
				for (a = 3 + me(e, t), t += 3; a-- > 0;) g.push(0);
				break;
			case 18:
				for (a = 11 + _e(e, t), t += 7; a-- > 0;) g.push(0);
				break;
			default:
				g.push(p), c < p && (c = p);
				break;
		}
		var _ = g.slice(0, n), v = g.slice(n);
		for (f = n; f < 286; ++f) _[f] = 0;
		for (f = r; f < 30; ++f) v[f] = 0;
		return Pe = Te(_, je, 286), Fe = Te(v, Me, 30), t;
	}
	function Le(e, t) {
		if (e[0] == 3 && !(e[1] & 3)) return [T(t), 2];
		for (var n = 0, r = 0, i = E(t || 1 << 18), a = 0, o = i.length >>> 0, s = 0, c = 0; !(r & 1);) {
			if (r = me(e, n), n += 3, r >>> 1) r >> 1 == 1 ? (s = 9, c = 5) : (n = Ie(e, n), s = Pe, c = Fe);
			else {
				n & 7 && (n += 8 - (n & 7));
				var l = e[n >>> 3] | e[(n >>> 3) + 1] << 8;
				if (n += 32, l > 0) for (!t && o < a + l && (i = Ce(i, a + l), o = i.length); l-- > 0;) i[a++] = e[n >>> 3], n += 8;
				continue;
			}
			for (;;) {
				!t && o < a + 32767 && (i = Ce(i, a + 32767), o = i.length);
				var u = ve(e, n, s), d = r >>> 1 == 1 ? Ee[u] : je[u];
				if (n += d & 15, d >>>= 4, !(d >>> 8 & 255)) i[a++] = d;
				else if (d == 256) break;
				else {
					d -= 257;
					var f = d < 8 ? 0 : d - 4 >> 2;
					f > 5 && (f = 0);
					var p = a + W[d];
					f > 0 && (p += ve(e, n, f), n += f), u = ve(e, n, c), d = r >>> 1 == 1 ? De[u] : Me[u], n += d & 15, d >>>= 4;
					var m = d < 4 ? 0 : d - 2 >> 1, h = se[d];
					for (m > 0 && (h += ve(e, n, m), n += m), !t && o < p && (i = Ce(i, p + 100), o = i.length); a < p;) i[a] = i[a - h], ++a;
				}
			}
		}
		return t ? [i, n + 7 >>> 3] : [i.slice(0, a), n + 7 >>> 3];
	}
	function Re(e, t) {
		var n = Le(e.slice(e.l || 0), t);
		return e.l += n[1], n[0];
	}
	function ze(e, t) {
		if (e) typeof console < "u" && console.error(t);
		else throw Error(t);
	}
	function Be(e, t) {
		var n = e;
		lr(n, 0);
		var r = {
			FileIndex: [],
			FullPaths: []
		};
		k(r, { root: t.root });
		for (var i = n.length - 4; (n[i] != 80 || n[i + 1] != 75 || n[i + 2] != 5 || n[i + 3] != 6) && i >= 0;) --i;
		n.l = i + 4, n.l += 4;
		var a = n.read_shift(2);
		for (n.l += 6, n.l = n.read_shift(4), i = 0; i < a; ++i) {
			n.l += 20;
			var s = n.read_shift(4), c = n.read_shift(4), l = n.read_shift(2), u = n.read_shift(2), d = n.read_shift(2);
			n.l += 8;
			var f = n.read_shift(4), p = o(n.slice(n.l + l, n.l + l + u));
			n.l += l + u + d;
			var m = n.l;
			n.l = f + 4, Ve(n, s, c, r, p), n.l = m;
		}
		return r;
	}
	function Ve(e, t, n, r, i) {
		e.l += 2;
		var s = e.read_shift(2), c = e.read_shift(2), l = a(e);
		if (s & 8257) throw Error("Unsupported ZIP encryption");
		for (var u = e.read_shift(4), d = e.read_shift(4), f = e.read_shift(4), p = e.read_shift(2), m = e.read_shift(2), h = "", g = 0; g < p; ++g) h += String.fromCharCode(e[e.l++]);
		if (m) {
			var _ = o(e.slice(e.l, e.l + m));
			(_[21589] || {}).mt && (l = _[21589].mt), ((i || {})[21589] || {}).mt && (l = i[21589].mt);
		}
		e.l += m;
		var v = e.slice(e.l, e.l + d);
		switch (c) {
			case 8:
				v = U(e, f);
				break;
			case 0: break;
			default: throw Error("Unsupported ZIP Compression method " + c);
		}
		var y = !1;
		s & 8 && (u = e.read_shift(4), u == 134695760 && (u = e.read_shift(4), y = !0), d = e.read_shift(4), f = e.read_shift(4)), d != t && ze(y, "Bad compressed size: " + t + " != " + d), f != n && ze(y, "Bad uncompressed size: " + n + " != " + f), Qe(r, h, v, {
			unsafe: !0,
			mt: l
		});
	}
	function He(e, t) {
		var n = t || {}, r = [], a = [], o = dr(1), s = n.compression ? 8 : 0, c = 0, l = 0, u = 0, d = 0, f = 0, p = e.FullPaths[0], m = p, h = e.FileIndex[0], g = [], _ = 0;
		for (l = 1; l < e.FullPaths.length; ++l) if (m = e.FullPaths[l].slice(p.length), h = e.FileIndex[l], !(!h.size || !h.content || m == "Sh33tJ5")) {
			var v = d, y = dr(m.length);
			for (u = 0; u < m.length; ++u) y.write_shift(1, m.charCodeAt(u) & 127);
			y = y.slice(0, y.l), g[f] = rt.buf(h.content, 0);
			var b = h.content;
			s == 8 && (b = ae(b)), o = dr(30), o.write_shift(4, 67324752), o.write_shift(2, 20), o.write_shift(2, c), o.write_shift(2, s), h.mt ? i(o, h.mt) : o.write_shift(4, 0), o.write_shift(-4, c & 8 ? 0 : g[f]), o.write_shift(4, c & 8 ? 0 : b.length), o.write_shift(4, c & 8 ? 0 : h.content.length), o.write_shift(2, y.length), o.write_shift(2, 0), d += o.length, r.push(o), d += y.length, r.push(y), d += b.length, r.push(b), c & 8 && (o = dr(12), o.write_shift(-4, g[f]), o.write_shift(4, b.length), o.write_shift(4, h.content.length), d += o.l, r.push(o)), o = dr(46), o.write_shift(4, 33639248), o.write_shift(2, 0), o.write_shift(2, 20), o.write_shift(2, c), o.write_shift(2, s), o.write_shift(4, 0), o.write_shift(-4, g[f]), o.write_shift(4, b.length), o.write_shift(4, h.content.length), o.write_shift(2, y.length), o.write_shift(2, 0), o.write_shift(2, 0), o.write_shift(2, 0), o.write_shift(2, 0), o.write_shift(4, 0), o.write_shift(4, v), _ += o.l, a.push(o), _ += y.length, a.push(y), ++f;
		}
		return o = dr(22), o.write_shift(4, 101010256), o.write_shift(2, 0), o.write_shift(2, 0), o.write_shift(2, f), o.write_shift(2, f), o.write_shift(4, _), o.write_shift(4, d), o.write_shift(2, 0), M([
			M(r),
			M(a),
			o
		]);
	}
	var Ue = {
		htm: "text/html",
		xml: "text/xml",
		gif: "image/gif",
		jpg: "image/jpeg",
		png: "image/png",
		mso: "application/x-mso",
		thmx: "application/vnd.ms-officetheme",
		sh33tj5: "application/octet-stream"
	};
	function We(e, t) {
		if (e.ctype) return e.ctype;
		var n = e.name || "", r = n.match(/\.([^\.]+)$/);
		return r && Ue[r[1]] || t && (r = (n = t).match(/[\.\\]([^\.\\])+$/), r && Ue[r[1]]) ? Ue[r[1]] : "application/octet-stream";
	}
	function Ge(e) {
		for (var t = x(e), n = [], r = 0; r < t.length; r += 76) n.push(t.slice(r, r + 76));
		return n.join("\r\n") + "\r\n";
	}
	function Ke(e) {
		var t = e.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function(e) {
			var t = e.charCodeAt(0).toString(16).toUpperCase();
			return "=" + (t.length == 1 ? "0" + t : t);
		});
		t = t.replace(/ $/gm, "=20").replace(/\t$/gm, "=09"), t.charAt(0) == "\n" && (t = "=0D" + t.slice(1)), t = t.replace(/\r(?!\n)/gm, "=0D").replace(/\n\n/gm, "\n=0A").replace(/([^\r\n])\n/gm, "$1=0A");
		for (var n = [], r = t.split("\r\n"), i = 0; i < r.length; ++i) {
			var a = r[i];
			if (a.length == 0) {
				n.push("");
				continue;
			}
			for (var o = 0; o < a.length;) {
				var s = 76, c = a.slice(o, o + s);
				c.charAt(s - 1) == "=" ? s-- : c.charAt(s - 2) == "=" ? s -= 2 : c.charAt(s - 3) == "=" && (s -= 3), c = a.slice(o, o + s), o += s, o < a.length && (c += "="), n.push(c);
			}
		}
		return n.join("\r\n");
	}
	function qe(e) {
		for (var t = [], n = 0; n < e.length; ++n) {
			for (var r = e[n]; n <= e.length && r.charAt(r.length - 1) == "=";) r = r.slice(0, r.length - 1) + e[++n];
			t.push(r);
		}
		for (var i = 0; i < t.length; ++i) t[i] = t[i].replace(/[=][0-9A-Fa-f]{2}/g, function(e) {
			return String.fromCharCode(parseInt(e.slice(1), 16));
		});
		return D(t.join("\r\n"));
	}
	function Je(e, t, n) {
		for (var r = "", i = "", a = "", o, s = 0; s < 10; ++s) {
			var c = t[s];
			if (!c || c.match(/^\s*$/)) break;
			var l = c.match(/^(.*?):\s*([^\s].*)$/);
			if (l) switch (l[1].toLowerCase()) {
				case "content-location":
					r = l[2].trim();
					break;
				case "content-type":
					a = l[2].trim();
					break;
				case "content-transfer-encoding":
					i = l[2].trim();
					break;
			}
		}
		switch (++s, i.toLowerCase()) {
			case "base64":
				o = D(S(t.slice(s).join("")));
				break;
			case "quoted-printable":
				o = qe(t.slice(s));
				break;
			default: throw Error("Unsupported Content-Transfer-Encoding " + i);
		}
		var u = Qe(e, r.slice(n.length), o, { unsafe: !0 });
		a && (u.ctype = a);
	}
	function Ye(e, t) {
		if (V(e.slice(0, 13)).toLowerCase() != "mime-version:") throw Error("Unsupported MAD header");
		var n = t && t.root || "", r = (C && Buffer.isBuffer(e) ? e.toString("binary") : V(e)).split("\r\n"), i = 0, a = "";
		for (i = 0; i < r.length; ++i) if (a = r[i], /^Content-Location:/i.test(a) && (a = a.slice(a.indexOf("file")), n ||= a.slice(0, a.lastIndexOf("/") + 1), a.slice(0, n.length) != n)) for (; n.length > 0 && (n = n.slice(0, n.length - 1), n = n.slice(0, n.lastIndexOf("/") + 1), a.slice(0, n.length) != n););
		var o = (r[1] || "").match(/boundary="(.*?)"/);
		if (!o) throw Error("MAD cannot find boundary");
		var s = "--" + (o[1] || ""), c = {
			FileIndex: [],
			FullPaths: []
		};
		k(c);
		var l, u = 0;
		for (i = 0; i < r.length; ++i) {
			var d = r[i];
			d !== s && d !== s + "--" || (u++ && Je(c, r.slice(l, i), n), l = i);
		}
		return c;
	}
	function Xe(e, t) {
		var n = t || {}, r = n.boundary || "SheetJS";
		r = "------=" + r;
		for (var i = [
			"MIME-Version: 1.0",
			"Content-Type: multipart/related; boundary=\"" + r.slice(2) + "\"",
			"",
			"",
			""
		], a = e.FullPaths[0], o = a, s = e.FileIndex[0], c = 1; c < e.FullPaths.length; ++c) if (o = e.FullPaths[c].slice(a.length), s = e.FileIndex[c], !(!s.size || !s.content || o == "Sh33tJ5")) {
			o = o.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function(e) {
				return "_x" + e.charCodeAt(0).toString(16) + "_";
			}).replace(/[\u0080-\uFFFF]/g, function(e) {
				return "_u" + e.charCodeAt(0).toString(16) + "_";
			});
			for (var l = s.content, u = C && Buffer.isBuffer(l) ? l.toString("binary") : V(l), d = 0, f = Math.min(1024, u.length), p = 0, m = 0; m <= f; ++m) (p = u.charCodeAt(m)) >= 32 && p < 128 && ++d;
			var h = d >= f * 4 / 5;
			i.push(r), i.push("Content-Location: " + (n.root || "file:///C:/SheetJS/") + o), i.push("Content-Transfer-Encoding: " + (h ? "quoted-printable" : "base64")), i.push("Content-Type: " + We(s, o)), i.push(""), i.push(h ? Ke(u) : Ge(u));
		}
		return i.push(r + "--\r\n"), i.join("\r\n");
	}
	function Ze(e) {
		var t = {};
		return k(t, e), t;
	}
	function Qe(e, t, n, i) {
		var a = i && i.unsafe;
		a || k(e);
		var o = !a && G.find(e, t);
		if (!o) {
			var s = e.FullPaths[0];
			t.slice(0, s.length) == s ? s = t : (s.slice(-1) != "/" && (s += "/"), s = (s + t).replace("//", "/")), o = {
				name: r(t),
				type: 2
			}, e.FileIndex.push(o), e.FullPaths.push(s), a || G.utils.cfb_gc(e);
		}
		return o.content = n, o.size = n ? n.length : 0, i && (i.CLSID && (o.clsid = i.CLSID), i.mt && (o.mt = i.mt), i.ct && (o.ct = i.ct)), o;
	}
	function $e(e, t) {
		k(e);
		var n = G.find(e, t);
		if (n) {
			for (var r = 0; r < e.FileIndex.length; ++r) if (e.FileIndex[r] == n) return e.FileIndex.splice(r, 1), e.FullPaths.splice(r, 1), !0;
		}
		return !1;
	}
	function et(e, t, n) {
		k(e);
		var i = G.find(e, t);
		if (i) {
			for (var a = 0; a < e.FileIndex.length; ++a) if (e.FileIndex[a] == i) return e.FileIndex[a].name = r(n), e.FullPaths[a] = n, !0;
		}
		return !1;
	}
	function tt(e) {
		j(e, !0);
	}
	return e.find = I, e.read = O, e.parse = l, e.write = re, e.writeFile = ne, e.utils = {
		cfb_new: Ze,
		cfb_add: Qe,
		cfb_del: $e,
		cfb_mov: et,
		cfb_gc: tt,
		ReadShift: rr,
		CheckField: cr,
		prep_blob: lr,
		bconcat: M,
		use_zlib: ie,
		_deflateRaw: Ae,
		_inflateRaw: Re,
		consts: te
	}, e;
})(), it = void 0;
function at(e) {
	return typeof e == "string" ? O(e) : Array.isArray(e) ? A(e) : e;
}
function ot(e, t, n) {
	if (it !== void 0 && it.writeFileSync) return n ? it.writeFileSync(e, t, n) : it.writeFileSync(e, t);
	if (typeof Deno < "u") {
		if (n && typeof t == "string") switch (n) {
			case "utf8":
				t = new TextEncoder(n).encode(t);
				break;
			case "binary":
				t = O(t);
				break;
			default: throw Error("Unsupported encoding " + n);
		}
		return Deno.writeFileSync(e, t);
	}
	var r = n == "utf8" ? un(t) : t;
	if (typeof IE_SaveFile < "u") return IE_SaveFile(r, e);
	if (typeof Blob < "u") {
		var i = new Blob([at(r)], { type: "application/octet-stream" });
		if (typeof navigator < "u" && navigator.msSaveBlob) return navigator.msSaveBlob(i, e);
		if (typeof saveAs < "u") return saveAs(i, e);
		if (typeof URL < "u" && typeof document < "u" && document.createElement && URL.createObjectURL) {
			var a = URL.createObjectURL(i);
			if (typeof chrome == "object" && typeof (chrome.downloads || {}).download == "function") return URL.revokeObjectURL && typeof setTimeout < "u" && setTimeout(function() {
				URL.revokeObjectURL(a);
			}, 6e4), chrome.downloads.download({
				url: a,
				filename: e,
				saveAs: !0
			});
			var o = document.createElement("a");
			if (o.download != null) return o.download = e, o.href = a, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL && typeof setTimeout < "u" && setTimeout(function() {
				URL.revokeObjectURL(a);
			}, 6e4), a;
		}
	}
	if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u") try {
		var s = File(e);
		return s.open("w"), s.encoding = "binary", Array.isArray(t) && (t = k(t)), s.write(t), s.close(), t;
	} catch (e) {
		if (!e.message || !e.message.match(/onstruct/)) throw e;
	}
	throw Error("cannot save file " + e);
}
function st(e) {
	if (it !== void 0) return it.readFileSync(e);
	if (typeof Deno < "u") return Deno.readFileSync(e);
	if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u") try {
		var t = File(e);
		t.open("r"), t.encoding = "binary";
		var n = t.read();
		return t.close(), n;
	} catch (e) {
		if (!e.message || !e.message.match(/onstruct/)) throw e;
	}
	throw Error("Cannot access file " + e);
}
function ct(e) {
	for (var t = Object.keys(e), n = [], r = 0; r < t.length; ++r) Object.prototype.hasOwnProperty.call(e, t[r]) && n.push(t[r]);
	return n;
}
function lt(e) {
	for (var t = [], n = ct(e), r = 0; r !== n.length; ++r) t[e[n[r]]] = n[r];
	return t;
}
function ut(e) {
	for (var t = [], n = ct(e), r = 0; r !== n.length; ++r) t[e[n[r]]] = parseInt(n[r], 10);
	return t;
}
function dt(e) {
	for (var t = [], n = ct(e), r = 0; r !== n.length; ++r) t[e[n[r]]] ?? (t[e[n[r]]] = []), t[e[n[r]]].push(n[r]);
	return t;
}
var ft = /*#__PURE__*/ new Date(1899, 11, 30, 0, 0, 0);
function pt(e, t) {
	var n = /*#__PURE__*/ e.getTime();
	t && (n -= 1462 * 24 * 60 * 60 * 1e3);
	var r = /*#__PURE__*/ ft.getTime() + (/*#__PURE__*/ e.getTimezoneOffset() - /*#__PURE__*/ ft.getTimezoneOffset()) * 6e4;
	return (n - r) / (1440 * 60 * 1e3);
}
var mt = /*#__PURE__*/ new Date(), ht = /*#__PURE__*/ ft.getTime() + (/*#__PURE__*/ mt.getTimezoneOffset() - /*#__PURE__*/ ft.getTimezoneOffset()) * 6e4, gt = /*#__PURE__*/ mt.getTimezoneOffset();
function _t(e) {
	var t = /* @__PURE__ */ new Date();
	return t.setTime(e * 24 * 60 * 60 * 1e3 + ht), t.getTimezoneOffset() !== gt && t.setTime(t.getTime() + (t.getTimezoneOffset() - gt) * 6e4), t;
}
function vt(e) {
	var t = 0, n = 0, r = !1, i = e.match(/P([0-9\.]+Y)?([0-9\.]+M)?([0-9\.]+D)?T([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
	if (!i) throw Error("|" + e + "| is not an ISO8601 Duration");
	for (var a = 1; a != i.length; ++a) if (i[a]) {
		switch (n = 1, a > 3 && (r = !0), i[a].slice(i[a].length - 1)) {
			case "Y": throw Error("Unsupported ISO Duration Field: " + i[a].slice(i[a].length - 1));
			case "D": n *= 24;
			case "H": n *= 60;
			case "M": if (r) n *= 60;
			else throw Error("Unsupported ISO Duration Field: M");
			case "S": break;
		}
		t += n * parseInt(i[a], 10);
	}
	return t;
}
var yt = /*#__PURE__*/ new Date("2017-02-19T19:06:09.000Z"), bt = /*#__PURE__*/ isNaN(/*#__PURE__*/ yt.getFullYear()) ? /*#__PURE__*/ new Date("2/19/17") : yt, xt = /*#__PURE__*/ bt.getFullYear() == 2017;
function St(e, t) {
	var n = new Date(e);
	if (xt) return t > 0 ? n.setTime(n.getTime() + n.getTimezoneOffset() * 60 * 1e3) : t < 0 && n.setTime(n.getTime() - n.getTimezoneOffset() * 60 * 1e3), n;
	if (e instanceof Date) return e;
	if (bt.getFullYear() == 1917 && !isNaN(n.getFullYear())) {
		var r = n.getFullYear();
		return e.indexOf("" + r) > -1 || n.setFullYear(n.getFullYear() + 100), n;
	}
	var i = e.match(/\d+/g) || [
		"2017",
		"2",
		"19",
		"0",
		"0",
		"0"
	], a = new Date(+i[0], i[1] - 1, +i[2], +i[3] || 0, +i[4] || 0, +i[5] || 0);
	return e.indexOf("Z") > -1 && (a = /* @__PURE__ */ new Date(a.getTime() - a.getTimezoneOffset() * 60 * 1e3)), a;
}
function Ct(e, t) {
	if (C && Buffer.isBuffer(e)) {
		if (t) {
			if (e[0] == 255 && e[1] == 254) return un(e.slice(2).toString("utf16le"));
			if (e[1] == 254 && e[2] == 255) return un(p(e.slice(2).toString("binary")));
		}
		return e.toString("binary");
	}
	if (typeof TextDecoder < "u") try {
		if (t) {
			if (e[0] == 255 && e[1] == 254) return un(new TextDecoder("utf-16le").decode(e.slice(2)));
			if (e[0] == 254 && e[1] == 255) return un(new TextDecoder("utf-16be").decode(e.slice(2)));
		}
		var n = {
			"€": "",
			"‚": "",
			ƒ: "",
			"„": "",
			"…": "",
			"†": "",
			"‡": "",
			ˆ: "",
			"‰": "",
			Š: "",
			"‹": "",
			Œ: "",
			Ž: "",
			"‘": "",
			"’": "",
			"“": "",
			"”": "",
			"•": "",
			"–": "",
			"—": "",
			"˜": "",
			"™": "",
			š: "",
			"›": "",
			œ: "",
			ž: "",
			Ÿ: ""
		};
		return Array.isArray(e) && (e = new Uint8Array(e)), new TextDecoder("latin1").decode(e).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(e) {
			return n[e] || e;
		});
	} catch {}
	for (var r = [], i = 0; i != e.length; ++i) r.push(String.fromCharCode(e[i]));
	return r.join("");
}
function wt(e) {
	if (typeof JSON < "u" && !Array.isArray(e)) return JSON.parse(JSON.stringify(e));
	if (typeof e != "object" || !e) return e;
	if (e instanceof Date) return new Date(e.getTime());
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = wt(e[n]));
	return t;
}
function Tt(e, t) {
	for (var n = ""; n.length < t;) n += e;
	return n;
}
function Et(e) {
	var t = Number(e);
	if (!isNaN(t)) return isFinite(t) ? t : NaN;
	if (!/\d/.test(e)) return t;
	var n = 1, r = e.replace(/([\d]),([\d])/g, "$1$2").replace(/[$]/g, "").replace(/[%]/g, function() {
		return n *= 100, "";
	});
	return !isNaN(t = Number(r)) || (r = r.replace(/[(](.*)[)]/, function(e, t) {
		return n = -n, t;
	}), !isNaN(t = Number(r))) ? t / n : t;
}
var Dt = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december"
];
function Ot(e) {
	var t = new Date(e), n = /* @__PURE__ */ new Date(NaN), r = t.getYear(), i = t.getMonth(), a = t.getDate();
	if (isNaN(a)) return n;
	var o = e.toLowerCase();
	if (o.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
		if (o = o.replace(/[^a-z]/g, "").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/, ""), o.length > 3 && Dt.indexOf(o) == -1) return n;
	} else if (o.match(/[a-z]/)) return n;
	return r < 0 || r > 8099 ? n : (i > 0 || a > 1) && r != 101 ? t : e.match(/[^-0-9:,\/\\]/) ? n : t;
}
var kt = /*#__PURE__*/ (function() {
	var e = "abacaba".split(/(:?b)/i).length == 5;
	return function(t, n, r) {
		if (e || typeof n == "string") return t.split(n);
		for (var i = t.split(n), a = [i[0]], o = 1; o < i.length; ++o) a.push(r), a.push(i[o]);
		return a;
	};
})();
function At(e) {
	return e ? e.content && e.type ? Ct(e.content, !0) : e.data ? m(e.data) : e.asNodeBuffer && C ? m(e.asNodeBuffer().toString("binary")) : e.asBinary ? m(e.asBinary()) : e._data && e._data.getContent ? m(Ct(Array.prototype.slice.call(e._data.getContent(), 0))) : null : null;
}
function jt(e) {
	if (!e) return null;
	if (e.data) return d(e.data);
	if (e.asNodeBuffer && C) return e.asNodeBuffer();
	if (e._data && e._data.getContent) {
		var t = e._data.getContent();
		return typeof t == "string" ? d(t) : Array.prototype.slice.call(t);
	}
	return e.content && e.type ? e.content : null;
}
function Mt(e) {
	return e && e.name.slice(-4) === ".bin" ? jt(e) : At(e);
}
function Nt(e, t) {
	for (var n = e.FullPaths || ct(e.files), r = t.toLowerCase().replace(/[\/]/g, "\\"), i = r.replace(/\\/g, "/"), a = 0; a < n.length; ++a) {
		var o = n[a].replace(/^Root Entry[\/]/, "").toLowerCase();
		if (r == o || i == o) return e.files ? e.files[n[a]] : e.FileIndex[a];
	}
	return null;
}
function Pt(e, t) {
	var n = Nt(e, t);
	if (n == null) throw Error("Cannot find file " + t + " in zip");
	return n;
}
function Ft(e, t, n) {
	if (!n) return Mt(Pt(e, t));
	if (!t) return null;
	try {
		return Ft(e, t);
	} catch {
		return null;
	}
}
function It(e, t, n) {
	if (!n) return At(Pt(e, t));
	if (!t) return null;
	try {
		return It(e, t);
	} catch {
		return null;
	}
}
function Lt(e, t, n) {
	if (!n) return jt(Pt(e, t));
	if (!t) return null;
	try {
		return Lt(e, t);
	} catch {
		return null;
	}
}
function Rt(e) {
	for (var t = e.FullPaths || ct(e.files), n = [], r = 0; r < t.length; ++r) t[r].slice(-1) != "/" && n.push(t[r].replace(/^Root Entry[\/]/, ""));
	return n.sort();
}
function zt(e, t, n) {
	if (e.FullPaths) {
		if (typeof n == "string") {
			var r = C ? w(n) : N(n);
			return G.utils.cfb_add(e, t, r);
		}
		G.utils.cfb_add(e, t, n);
	} else e.file(t, n);
}
function Bt() {
	return G.utils.cfb_new();
}
function Vt(e, t) {
	switch (t.type) {
		case "base64": return G.read(e, { type: "base64" });
		case "binary": return G.read(e, { type: "binary" });
		case "buffer":
		case "array": return G.read(e, { type: "buffer" });
	}
	throw Error("Unrecognized type " + t.type);
}
function Ht(e, t) {
	if (e.charAt(0) == "/") return e.slice(1);
	var n = t.split("/");
	t.slice(-1) != "/" && n.pop();
	for (var r = e.split("/"); r.length !== 0;) {
		var i = r.shift();
		i === ".." ? n.pop() : i !== "." && n.push(i);
	}
	return n.join("/");
}
var Ut = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\r\n", Wt = /([^"\s?>\/]+)\s*=\s*((?:")([^"]*)(?:")|(?:')([^']*)(?:')|([^'">\s]+))/g, Gt = /<[\/\?]?[a-zA-Z0-9:_-]+(?:\s+[^"\s?>\/]+\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s=]+))*\s*[\/\?]?>/gm, Kt = /*#__PURE__*/ Ut.match(Gt) ? Gt : /<[^>]*>/g, qt = /<\w*:/, Jt = /<(\/?)\w+:/;
function K(e, t, n) {
	for (var r = {}, i = 0, a = 0; i !== e.length && !((a = e.charCodeAt(i)) === 32 || a === 10 || a === 13); ++i);
	if (t || (r[0] = e.slice(0, i)), i === e.length) return r;
	var o = e.match(Wt), s = 0, c = "", l = 0, u = "", d = "", f = 1;
	if (o) for (l = 0; l != o.length; ++l) {
		for (d = o[l], a = 0; a != d.length && d.charCodeAt(a) !== 61; ++a);
		for (u = d.slice(0, a).trim(); d.charCodeAt(a + 1) == 32;) ++a;
		for (f = +((i = d.charCodeAt(a + 1)) == 34 || i == 39), c = d.slice(a + 1 + f, d.length - f), s = 0; s != u.length && u.charCodeAt(s) !== 58; ++s);
		if (s === u.length) u.indexOf("_") > 0 && (u = u.slice(0, u.indexOf("_"))), r[u] = c, n || (r[u.toLowerCase()] = c);
		else {
			var p = (s === 5 && u.slice(0, 5) === "xmlns" ? "xmlns" : "") + u.slice(s + 1);
			if (r[p] && u.slice(s - 3, s) == "ext") continue;
			r[p] = c, n || (r[p.toLowerCase()] = c);
		}
	}
	return r;
}
function Yt(e) {
	return e.replace(Jt, "<$1");
}
var Xt = {
	"&quot;": "\"",
	"&apos;": "'",
	"&gt;": ">",
	"&lt;": "<",
	"&amp;": "&"
}, Zt = /*#__PURE__*/ lt(Xt), q = /*#__PURE__*/ (function() {
	var e = /&(?:quot|apos|gt|lt|amp|#x?([\da-fA-F]+));/gi, t = /_x([\da-fA-F]{4})_/gi;
	return function n(r) {
		var i = r + "", a = i.indexOf("<![CDATA[");
		if (a == -1) return i.replace(e, function(e, t) {
			return Xt[e] || String.fromCharCode(parseInt(t, e.indexOf("x") > -1 ? 16 : 10)) || e;
		}).replace(t, function(e, t) {
			return String.fromCharCode(parseInt(t, 16));
		});
		var o = i.indexOf("]]>");
		return n(i.slice(0, a)) + i.slice(a + 9, o) + n(i.slice(o + 3));
	};
})(), Qt = /[&<>'"]/g, $t = /[\u0000-\u0008\u000b-\u001f]/g;
function en(e) {
	return (e + "").replace(Qt, function(e) {
		return Zt[e];
	}).replace($t, function(e) {
		return "_x" + ("000" + e.charCodeAt(0).toString(16)).slice(-4) + "_";
	});
}
var tn = /[\u0000-\u001f]/g;
function nn(e) {
	return (e + "").replace(Qt, function(e) {
		return Zt[e];
	}).replace(/\n/g, "<br/>").replace(tn, function(e) {
		return "&#x" + ("000" + e.charCodeAt(0).toString(16)).slice(-4) + ";";
	});
}
var rn = /*#__PURE__*/ (function() {
	var e = /&#(\d+);/g;
	function t(e, t) {
		return String.fromCharCode(parseInt(t, 10));
	}
	return function(n) {
		return n.replace(e, t);
	};
})();
function an(e) {
	switch (e) {
		case 1:
		case !0:
		case "1":
		case "true":
		case "TRUE": return !0;
		default: return !1;
	}
}
function on(e) {
	for (var t = "", n = 0, r = 0, i = 0, a = 0, o = 0, s = 0; n < e.length;) {
		if (r = e.charCodeAt(n++), r < 128) {
			t += String.fromCharCode(r);
			continue;
		}
		if (i = e.charCodeAt(n++), r > 191 && r < 224) {
			o = (r & 31) << 6, o |= i & 63, t += String.fromCharCode(o);
			continue;
		}
		if (a = e.charCodeAt(n++), r < 240) {
			t += String.fromCharCode((r & 15) << 12 | (i & 63) << 6 | a & 63);
			continue;
		}
		o = e.charCodeAt(n++), s = ((r & 7) << 18 | (i & 63) << 12 | (a & 63) << 6 | o & 63) - 65536, t += String.fromCharCode(55296 + (s >>> 10 & 1023)), t += String.fromCharCode(56320 + (s & 1023));
	}
	return t;
}
function sn(e) {
	var t = T(2 * e.length), n, r, i = 1, a = 0, o = 0, s;
	for (r = 0; r < e.length; r += i) i = 1, (s = e.charCodeAt(r)) < 128 ? n = s : s < 224 ? (n = (s & 31) * 64 + (e.charCodeAt(r + 1) & 63), i = 2) : s < 240 ? (n = (s & 15) * 4096 + (e.charCodeAt(r + 1) & 63) * 64 + (e.charCodeAt(r + 2) & 63), i = 3) : (i = 4, n = (s & 7) * 262144 + (e.charCodeAt(r + 1) & 63) * 4096 + (e.charCodeAt(r + 2) & 63) * 64 + (e.charCodeAt(r + 3) & 63), n -= 65536, o = 55296 + (n >>> 10 & 1023), n = 56320 + (n & 1023)), o !== 0 && (t[a++] = o & 255, t[a++] = o >>> 8, o = 0), t[a++] = n % 256, t[a++] = n >>> 8;
	return t.slice(0, a).toString("ucs2");
}
function cn(e) {
	return w(e, "binary").toString("utf8");
}
var ln = "foo bar bazâð£", J = C && (/*#__PURE__*/ cn(ln) == /*#__PURE__*/ on(ln) && cn || /*#__PURE__*/ sn(ln) == /*#__PURE__*/ on(ln) && sn) || on, un = C ? function(e) {
	return w(e, "utf8").toString("binary");
} : function(e) {
	for (var t = [], n = 0, r = 0, i = 0; n < e.length;) switch (r = e.charCodeAt(n++), !0) {
		case r < 128:
			t.push(String.fromCharCode(r));
			break;
		case r < 2048:
			t.push(String.fromCharCode(192 + (r >> 6))), t.push(String.fromCharCode(128 + (r & 63)));
			break;
		case r >= 55296 && r < 57344:
			r -= 55296, i = e.charCodeAt(n++) - 56320 + (r << 10), t.push(String.fromCharCode(240 + (i >> 18 & 7))), t.push(String.fromCharCode(144 + (i >> 12 & 63))), t.push(String.fromCharCode(128 + (i >> 6 & 63))), t.push(String.fromCharCode(128 + (i & 63)));
			break;
		default: t.push(String.fromCharCode(224 + (r >> 12))), t.push(String.fromCharCode(128 + (r >> 6 & 63))), t.push(String.fromCharCode(128 + (r & 63)));
	}
	return t.join("");
}, dn = /*#__PURE__*/ (function() {
	var e = {};
	return function(t, n) {
		var r = t + "|" + (n || "");
		return e[r] ? e[r] : e[r] = RegExp("<(?:\\w+:)?" + t + "(?: xml:space=\"preserve\")?(?:[^>]*)>([\\s\\S]*?)</(?:\\w+:)?" + t + ">", n || "");
	};
})(), fn = /*#__PURE__*/ (function() {
	var e = [
		["nbsp", " "],
		["middot", "·"],
		["quot", "\""],
		["apos", "'"],
		["gt", ">"],
		["lt", "<"],
		["amp", "&"]
	].map(function(e) {
		return [RegExp("&" + e[0] + ";", "ig"), e[1]];
	});
	return function(t) {
		for (var n = t.replace(/^[\t\n\r ]+/, "").replace(/[\t\n\r ]+$/, "").replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/[\t\n\r ]+/g, " ").replace(/<\s*[bB][rR]\s*\/?>/g, "\n").replace(/<[^>]*>/g, ""), r = 0; r < e.length; ++r) n = n.replace(e[r][0], e[r][1]);
		return n;
	};
})(), pn = /*#__PURE__*/ (function() {
	var e = {};
	return function(t) {
		return e[t] === void 0 ? e[t] = RegExp("<(?:vt:)?" + t + ">([\\s\\S]*?)</(?:vt:)?" + t + ">", "g") : e[t];
	};
})(), mn = /<\/?(?:vt:)?variant>/g, hn = /<(?:vt:)([^>]*)>([\s\S]*)</;
function gn(e, t) {
	var n = K(e), r = e.match(pn(n.baseType)) || [], i = [];
	if (r.length != n.size) {
		if (t.WTF) throw Error("unexpected vector length " + r.length + " != " + n.size);
		return i;
	}
	return r.forEach(function(e) {
		var t = e.replace(mn, "").match(hn);
		t && i.push({
			v: J(t[2]),
			t: t[1]
		});
	}), i;
}
var _n = /(^\s|\s$|\n)/;
function vn(e, t) {
	return "<" + e + (t.match(_n) ? " xml:space=\"preserve\"" : "") + ">" + t + "</" + e + ">";
}
function yn(e) {
	return ct(e).map(function(t) {
		return " " + t + "=\"" + e[t] + "\"";
	}).join("");
}
function Y(e, t, n) {
	return "<" + e + (n == null ? "" : yn(n)) + (t == null ? "/" : (t.match(_n) ? " xml:space=\"preserve\"" : "") + ">" + t + "</" + e) + ">";
}
function bn(e, t) {
	try {
		return e.toISOString().replace(/\.\d*/, "");
	} catch (e) {
		if (t) throw e;
	}
	return "";
}
function xn(e, t) {
	switch (typeof e) {
		case "string":
			var n = Y("vt:lpwstr", en(e));
			return t && (n = n.replace(/&quot;/g, "_x0022_")), n;
		case "number": return Y((e | 0) == e ? "vt:i4" : "vt:r8", en(String(e)));
		case "boolean": return Y("vt:bool", e ? "true" : "false");
	}
	if (e instanceof Date) return Y("vt:filetime", bn(e));
	throw Error("Unable to serialize " + e);
}
function Sn(e) {
	if (C && Buffer.isBuffer(e)) return e.toString("utf8");
	if (typeof e == "string") return e;
	if (typeof Uint8Array < "u" && e instanceof Uint8Array) return J(k(j(e)));
	throw Error("Bad input format: expected Buffer or string");
}
var Cn = /<(\/?)([^\s?><!\/:]*:|)([^\s?<>:\/]+)(?:[\s?:\/][^>]*)?>/gm, wn = {
	CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
	CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
	EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
	CT: "http://schemas.openxmlformats.org/package/2006/content-types",
	RELS: "http://schemas.openxmlformats.org/package/2006/relationships",
	TCMNT: "http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments",
	dc: "http://purl.org/dc/elements/1.1/",
	dcterms: "http://purl.org/dc/terms/",
	dcmitype: "http://purl.org/dc/dcmitype/",
	mx: "http://schemas.microsoft.com/office/mac/excel/2008/main",
	r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
	sjs: "http://schemas.openxmlformats.org/package/2006/sheetjs/core-properties",
	vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
	xsi: "http://www.w3.org/2001/XMLSchema-instance",
	xsd: "http://www.w3.org/2001/XMLSchema"
}, Tn = [
	"http://schemas.openxmlformats.org/spreadsheetml/2006/main",
	"http://purl.oclc.org/ooxml/spreadsheetml/main",
	"http://schemas.microsoft.com/office/excel/2006/main",
	"http://schemas.microsoft.com/office/excel/2006/2"
], En = {
	o: "urn:schemas-microsoft-com:office:office",
	x: "urn:schemas-microsoft-com:office:excel",
	ss: "urn:schemas-microsoft-com:office:spreadsheet",
	dt: "uuid:C2F41010-65B3-11d1-A29F-00AA00C14882",
	mv: "http://macVmlSchemaUri",
	v: "urn:schemas-microsoft-com:vml",
	html: "http://www.w3.org/TR/REC-html40"
};
function Dn(e, t) {
	for (var n = 1 - 2 * (e[t + 7] >>> 7), r = ((e[t + 7] & 127) << 4) + (e[t + 6] >>> 4 & 15), i = e[t + 6] & 15, a = 5; a >= 0; --a) i = i * 256 + e[t + a];
	return r == 2047 ? i == 0 ? n * Infinity : NaN : (r == 0 ? r = -1022 : (r -= 1023, i += 2 ** 52), n * 2 ** (r - 52) * i);
}
function On(e, t, n) {
	var r = (t < 0 || 1 / t == -Infinity) << 7, i = 0, a = 0, o = r ? -t : t;
	isFinite(o) ? o == 0 ? i = a = 0 : (i = Math.floor(Math.log(o) / Math.LN2), a = o * 2 ** (52 - i), i <= -1023 && (!isFinite(a) || a < 2 ** 52) ? i = -1022 : (a -= 2 ** 52, i += 1023)) : (i = 2047, a = isNaN(t) ? 26985 : 0);
	for (var s = 0; s <= 5; ++s, a /= 256) e[n + s] = a & 255;
	e[n + 6] = (i & 15) << 4 | a & 15, e[n + 7] = i >> 4 | r;
}
var kn = function(e) {
	for (var t = [], n = 10240, r = 0; r < e[0].length; ++r) if (e[0][r]) for (var i = 0, a = e[0][r].length; i < a; i += n) t.push.apply(t, e[0][r].slice(i, i + n));
	return t;
}, An = C ? function(e) {
	return e[0].length > 0 && Buffer.isBuffer(e[0][0]) ? Buffer.concat(e[0].map(function(e) {
		return Buffer.isBuffer(e) ? e : w(e);
	})) : kn(e);
} : kn, jn = function(e, t, n) {
	for (var r = [], i = t; i < n; i += 2) r.push(String.fromCharCode(Qn(e, i)));
	return r.join("").replace(P, "");
}, Mn = C ? function(e, t, n) {
	return Buffer.isBuffer(e) ? e.toString("utf16le", t, n).replace(P, "") : jn(e, t, n);
} : jn, Nn = function(e, t, n) {
	for (var r = [], i = t; i < t + n; ++i) r.push(("0" + e[i].toString(16)).slice(-2));
	return r.join("");
}, Pn = C ? function(e, t, n) {
	return Buffer.isBuffer(e) ? e.toString("hex", t, t + n) : Nn(e, t, n);
} : Nn, Fn = function(e, t, n) {
	for (var r = [], i = t; i < n; i++) r.push(String.fromCharCode(Zn(e, i)));
	return r.join("");
}, In = C ? function(e, t, n) {
	return Buffer.isBuffer(e) ? e.toString("utf8", t, n) : Fn(e, t, n);
} : Fn, Ln = function(e, t) {
	var n = er(e, t);
	return n > 0 ? In(e, t + 4, t + 4 + n - 1) : "";
}, Rn = Ln, zn = function(e, t) {
	var n = er(e, t);
	return n > 0 ? In(e, t + 4, t + 4 + n - 1) : "";
}, Bn = zn, Vn = function(e, t) {
	var n = 2 * er(e, t);
	return n > 0 ? In(e, t + 4, t + 4 + n - 1) : "";
}, Hn = Vn, Un = function(e, t) {
	var n = er(e, t);
	return n > 0 ? Mn(e, t + 4, t + 4 + n) : "";
}, Wn = Un, Gn = function(e, t) {
	var n = er(e, t);
	return n > 0 ? In(e, t + 4, t + 4 + n) : "";
}, Kn = Gn, qn = function(e, t) {
	return Dn(e, t);
}, Jn = qn, Yn = function(e) {
	return Array.isArray(e) || typeof Uint8Array < "u" && e instanceof Uint8Array;
};
C && (Rn = function(e, t) {
	if (!Buffer.isBuffer(e)) return Ln(e, t);
	var n = e.readUInt32LE(t);
	return n > 0 ? e.toString("utf8", t + 4, t + 4 + n - 1) : "";
}, Bn = function(e, t) {
	if (!Buffer.isBuffer(e)) return zn(e, t);
	var n = e.readUInt32LE(t);
	return n > 0 ? e.toString("utf8", t + 4, t + 4 + n - 1) : "";
}, Hn = function(e, t) {
	if (!Buffer.isBuffer(e)) return Vn(e, t);
	var n = 2 * e.readUInt32LE(t);
	return e.toString("utf16le", t + 4, t + 4 + n - 1);
}, Wn = function(e, t) {
	if (!Buffer.isBuffer(e)) return Un(e, t);
	var n = e.readUInt32LE(t);
	return e.toString("utf16le", t + 4, t + 4 + n);
}, Kn = function(e, t) {
	if (!Buffer.isBuffer(e)) return Gn(e, t);
	var n = e.readUInt32LE(t);
	return e.toString("utf8", t + 4, t + 4 + n);
}, Jn = function(e, t) {
	return Buffer.isBuffer(e) ? e.readDoubleLE(t) : qn(e, t);
}, Yn = function(e) {
	return Buffer.isBuffer(e) || Array.isArray(e) || typeof Uint8Array < "u" && e instanceof Uint8Array;
});
function Xn() {
	Mn = function(e, t, n) {
		return _.utils.decode(1200, e.slice(t, n)).replace(P, "");
	}, In = function(e, t, n) {
		return _.utils.decode(65001, e.slice(t, n));
	}, Rn = function(e, t) {
		var n = er(e, t);
		return n > 0 ? _.utils.decode(i, e.slice(t + 4, t + 4 + n - 1)) : "";
	}, Bn = function(e, t) {
		var n = er(e, t);
		return n > 0 ? _.utils.decode(r, e.slice(t + 4, t + 4 + n - 1)) : "";
	}, Hn = function(e, t) {
		var n = 2 * er(e, t);
		return n > 0 ? _.utils.decode(1200, e.slice(t + 4, t + 4 + n - 1)) : "";
	}, Wn = function(e, t) {
		var n = er(e, t);
		return n > 0 ? _.utils.decode(1200, e.slice(t + 4, t + 4 + n)) : "";
	}, Kn = function(e, t) {
		var n = er(e, t);
		return n > 0 ? _.utils.decode(65001, e.slice(t + 4, t + 4 + n)) : "";
	};
}
_ !== void 0 && Xn();
var Zn = function(e, t) {
	return e[t];
}, Qn = function(e, t) {
	return e[t + 1] * 256 + e[t];
}, $n = function(e, t) {
	var n = e[t + 1] * 256 + e[t];
	return n < 32768 ? n : (65535 - n + 1) * -1;
}, er = function(e, t) {
	return e[t + 3] * (1 << 24) + (e[t + 2] << 16) + (e[t + 1] << 8) + e[t];
}, tr = function(e, t) {
	return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t];
}, nr = function(e, t) {
	return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
};
function rr(e, t) {
	var n = "", i, a, o = [], s, c, l, u;
	switch (t) {
		case "dbcs":
			if (u = this.l, C && Buffer.isBuffer(this)) n = this.slice(this.l, this.l + 2 * e).toString("utf16le");
			else for (l = 0; l < e; ++l) n += String.fromCharCode(Qn(this, u)), u += 2;
			e *= 2;
			break;
		case "utf8":
			n = In(this, this.l, this.l + e);
			break;
		case "utf16le":
			e *= 2, n = Mn(this, this.l, this.l + e);
			break;
		case "wstr":
			if (_ !== void 0) n = _.utils.decode(r, this.slice(this.l, this.l + 2 * e));
			else return rr.call(this, e, "dbcs");
			e = 2 * e;
			break;
		case "lpstr-ansi":
			n = Rn(this, this.l), e = 4 + er(this, this.l);
			break;
		case "lpstr-cp":
			n = Bn(this, this.l), e = 4 + er(this, this.l);
			break;
		case "lpwstr":
			n = Hn(this, this.l), e = 4 + 2 * er(this, this.l);
			break;
		case "lpp4":
			e = 4 + er(this, this.l), n = Wn(this, this.l), e & 2 && (e += 2);
			break;
		case "8lpp4":
			e = 4 + er(this, this.l), n = Kn(this, this.l), e & 3 && (e += 4 - (e & 3));
			break;
		case "cstr":
			for (e = 0, n = ""; (s = Zn(this, this.l + e++)) !== 0;) o.push(h(s));
			n = o.join("");
			break;
		case "_wstr":
			for (e = 0, n = ""; (s = Qn(this, this.l + e)) !== 0;) o.push(h(s)), e += 2;
			e += 2, n = o.join("");
			break;
		case "dbcs-cont":
			for (n = "", u = this.l, l = 0; l < e; ++l) {
				if (this.lens && this.lens.indexOf(u) !== -1) return s = Zn(this, u), this.l = u + 1, c = rr.call(this, e - l, s ? "dbcs-cont" : "sbcs-cont"), o.join("") + c;
				o.push(h(Qn(this, u))), u += 2;
			}
			n = o.join(""), e *= 2;
			break;
		case "cpstr": if (_ !== void 0) {
			n = _.utils.decode(r, this.slice(this.l, this.l + e));
			break;
		}
		case "sbcs-cont":
			for (n = "", u = this.l, l = 0; l != e; ++l) {
				if (this.lens && this.lens.indexOf(u) !== -1) return s = Zn(this, u), this.l = u + 1, c = rr.call(this, e - l, s ? "dbcs-cont" : "sbcs-cont"), o.join("") + c;
				o.push(h(Zn(this, u))), u += 1;
			}
			n = o.join("");
			break;
		default: switch (e) {
			case 1: return i = Zn(this, this.l), this.l++, i;
			case 2: return i = (t === "i" ? $n : Qn)(this, this.l), this.l += 2, i;
			case 4:
			case -4: return t === "i" || !(this[this.l + 3] & 128) ? (i = (e > 0 ? tr : nr)(this, this.l), this.l += 4, i) : (a = er(this, this.l), this.l += 4, a);
			case 8:
			case -8:
				if (t === "f") return a = e == 8 ? Jn(this, this.l) : Jn([
					this[this.l + 7],
					this[this.l + 6],
					this[this.l + 5],
					this[this.l + 4],
					this[this.l + 3],
					this[this.l + 2],
					this[this.l + 1],
					this[this.l + 0]
				], 0), this.l += 8, a;
				e = 8;
			case 16:
				n = Pn(this, this.l, e);
				break;
		}
	}
	return this.l += e, n;
}
var ir = function(e, t, n) {
	e[n] = t & 255, e[n + 1] = t >>> 8 & 255, e[n + 2] = t >>> 16 & 255, e[n + 3] = t >>> 24 & 255;
}, ar = function(e, t, n) {
	e[n] = t & 255, e[n + 1] = t >> 8 & 255, e[n + 2] = t >> 16 & 255, e[n + 3] = t >> 24 & 255;
}, or = function(e, t, n) {
	e[n] = t & 255, e[n + 1] = t >>> 8 & 255;
};
function sr(e, t, n) {
	var r = 0, a = 0;
	if (n === "dbcs") {
		for (a = 0; a != t.length; ++a) or(this, t.charCodeAt(a), this.l + 2 * a);
		r = 2 * t.length;
	} else if (n === "sbcs") {
		if (_ !== void 0 && i == 874) for (a = 0; a != t.length; ++a) {
			var o = _.utils.encode(i, t.charAt(a));
			this[this.l + a] = o[0];
		}
		else for (t = t.replace(/[^\x00-\x7F]/g, "_"), a = 0; a != t.length; ++a) this[this.l + a] = t.charCodeAt(a) & 255;
		r = t.length;
	} else if (n === "hex") {
		for (; a < e; ++a) this[this.l++] = parseInt(t.slice(2 * a, 2 * a + 2), 16) || 0;
		return this;
	} else if (n === "utf16le") {
		var s = Math.min(this.l + e, this.length);
		for (a = 0; a < Math.min(t.length, e); ++a) {
			var c = t.charCodeAt(a);
			this[this.l++] = c & 255, this[this.l++] = c >> 8;
		}
		for (; this.l < s;) this[this.l++] = 0;
		return this;
	} else switch (e) {
		case 1:
			r = 1, this[this.l] = t & 255;
			break;
		case 2:
			r = 2, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255;
			break;
		case 3:
			r = 3, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255, t >>>= 8, this[this.l + 2] = t & 255;
			break;
		case 4:
			r = 4, ir(this, t, this.l);
			break;
		case 8: if (r = 8, n === "f") {
			On(this, t, this.l);
			break;
		}
		case 16: break;
		case -4:
			r = 4, ar(this, t, this.l);
			break;
	}
	return this.l += r, this;
}
function cr(e, t) {
	var n = Pn(this, this.l, e.length >> 1);
	if (n !== e) throw Error(t + "Expected " + e + " saw " + n);
	this.l += e.length >> 1;
}
function lr(e, t) {
	e.l = t, e.read_shift = rr, e.chk = cr, e.write_shift = sr;
}
function ur(e, t) {
	e.l += t;
}
function dr(e) {
	var t = T(e);
	return lr(t, 0), t;
}
function fr(e, t, n) {
	if (e) {
		var r, i, a;
		lr(e, e.l || 0);
		for (var o = e.length, s = 0, c = 0; e.l < o;) {
			s = e.read_shift(1), s & 128 && (s = (s & 127) + ((e.read_shift(1) & 127) << 7));
			var l = Zp[s] || Zp[65535];
			for (r = e.read_shift(1), a = r & 127, i = 1; i < 4 && r & 128; ++i) a += ((r = e.read_shift(1)) & 127) << 7 * i;
			c = e.l + a;
			var u = l.f && l.f(e, a, n);
			if (e.l = c, t(u, l, s)) return;
		}
	}
}
function pr() {
	var e = [], t = C ? 256 : 2048, n = function(e) {
		var t = dr(e);
		return lr(t, 0), t;
	}, r = n(t), i = function() {
		r &&= (r.length > r.l && (r = r.slice(0, r.l), r.l = r.length), r.length > 0 && e.push(r), null);
	}, a = function(e) {
		return r && e < r.length - r.l ? r : (i(), r = n(Math.max(e + 1, t)));
	};
	return {
		next: a,
		push: function(e) {
			i(), r = e, r.l ??= r.length, a(t);
		},
		end: function() {
			return i(), M(e);
		},
		_bufs: e
	};
}
function mr(e, t, n) {
	var r = wt(e);
	if (t.s ? (r.cRel && (r.c += t.s.c), r.rRel && (r.r += t.s.r)) : (r.cRel && (r.c += t.c), r.rRel && (r.r += t.r)), !n || n.biff < 12) {
		for (; r.c >= 256;) r.c -= 256;
		for (; r.r >= 65536;) r.r -= 65536;
	}
	return r;
}
function hr(e, t, n) {
	var r = wt(e);
	return r.s = mr(r.s, t.s, n), r.e = mr(r.e, t.s, n), r;
}
function gr(e, t) {
	if (e.cRel && e.c < 0) for (e = wt(e); e.c < 0;) e.c += t > 8 ? 16384 : 256;
	if (e.rRel && e.r < 0) for (e = wt(e); e.r < 0;) e.r += t > 8 ? 1048576 : t > 5 ? 65536 : 16384;
	var n = X(e);
	return !e.cRel && e.cRel != null && (n = wr(n)), !e.rRel && e.rRel != null && (n = br(n)), n;
}
function _r(e, t) {
	return e.s.r == 0 && !e.s.rRel && e.e.r == (t.biff >= 12 ? 1048575 : t.biff >= 8 ? 65536 : 16384) && !e.e.rRel ? (e.s.cRel ? "" : "$") + Cr(e.s.c) + ":" + (e.e.cRel ? "" : "$") + Cr(e.e.c) : e.s.c == 0 && !e.s.cRel && e.e.c == (t.biff >= 12 ? 16383 : 255) && !e.e.cRel ? (e.s.rRel ? "" : "$") + yr(e.s.r) + ":" + (e.e.rRel ? "" : "$") + yr(e.e.r) : gr(e.s, t.biff) + ":" + gr(e.e, t.biff);
}
function vr(e) {
	return parseInt(xr(e), 10) - 1;
}
function yr(e) {
	return "" + (e + 1);
}
function br(e) {
	return e.replace(/([A-Z]|^)(\d+)$/, "$1$$$2");
}
function xr(e) {
	return e.replace(/\$(\d+)$/, "$1");
}
function Sr(e) {
	for (var t = Tr(e), n = 0, r = 0; r !== t.length; ++r) n = 26 * n + t.charCodeAt(r) - 64;
	return n - 1;
}
function Cr(e) {
	if (e < 0) throw Error("invalid column " + e);
	var t = "";
	for (++e; e; e = Math.floor((e - 1) / 26)) t = String.fromCharCode((e - 1) % 26 + 65) + t;
	return t;
}
function wr(e) {
	return e.replace(/^([A-Z])/, "$$$1");
}
function Tr(e) {
	return e.replace(/^\$([A-Z])/, "$1");
}
function Er(e) {
	return e.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",");
}
function Dr(e) {
	for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
		var i = e.charCodeAt(r);
		i >= 48 && i <= 57 ? t = 10 * t + (i - 48) : i >= 65 && i <= 90 && (n = 26 * n + (i - 64));
	}
	return {
		c: n - 1,
		r: t - 1
	};
}
function X(e) {
	for (var t = e.c + 1, n = ""; t; t = (t - 1) / 26 | 0) n = String.fromCharCode((t - 1) % 26 + 65) + n;
	return n + (e.r + 1);
}
function Or(e) {
	var t = e.indexOf(":");
	return t == -1 ? {
		s: Dr(e),
		e: Dr(e)
	} : {
		s: Dr(e.slice(0, t)),
		e: Dr(e.slice(t + 1))
	};
}
function Z(e, t) {
	return t === void 0 || typeof t == "number" ? Z(e.s, e.e) : (typeof e != "string" && (e = X(e)), typeof t != "string" && (t = X(t)), e == t ? e : e + ":" + t);
}
function kr(e) {
	var t = {
		s: {
			c: 0,
			r: 0
		},
		e: {
			c: 0,
			r: 0
		}
	}, n = 0, r = 0, i = 0, a = e.length;
	for (n = 0; r < a && !((i = e.charCodeAt(r) - 64) < 1 || i > 26); ++r) n = 26 * n + i;
	for (t.s.c = --n, n = 0; r < a && !((i = e.charCodeAt(r) - 48) < 0 || i > 9); ++r) n = 10 * n + i;
	if (t.s.r = --n, r === a || i != 10) return t.e.c = t.s.c, t.e.r = t.s.r, t;
	for (++r, n = 0; r != a && !((i = e.charCodeAt(r) - 64) < 1 || i > 26); ++r) n = 26 * n + i;
	for (t.e.c = --n, n = 0; r != a && !((i = e.charCodeAt(r) - 48) < 0 || i > 9); ++r) n = 10 * n + i;
	return t.e.r = --n, t;
}
function Ar(e, t) {
	var n = e.t == "d" && t instanceof Date;
	if (e.z != null) try {
		return e.w = Ye(e.z, n ? pt(t) : t);
	} catch {}
	try {
		return e.w = Ye((e.XF || {}).numFmtId || (n ? 14 : 0), n ? pt(t) : t);
	} catch {
		return "" + t;
	}
}
function jr(e, t, n) {
	return e == null || e.t == null || e.t == "z" ? "" : e.w === void 0 ? (e.t == "d" && !e.z && n && n.dateNF && (e.z = n.dateNF), e.t == "e" ? bi[e.v] || e.v : t == null ? Ar(e, e.v) : Ar(e, t)) : e.w;
}
function Mr(e, t) {
	var n = t && t.sheet ? t.sheet : "Sheet1", r = {};
	return r[n] = e, {
		SheetNames: [n],
		Sheets: r
	};
}
function Nr(e, t, n) {
	var r = n || {}, i = e ? Array.isArray(e) : r.dense;
	v != null && i == null && (i = v);
	var a = e || (i ? [] : {}), o = 0, s = 0;
	if (a && r.origin != null) {
		if (typeof r.origin == "number") o = r.origin;
		else {
			var c = typeof r.origin == "string" ? Dr(r.origin) : r.origin;
			o = c.r, s = c.c;
		}
		a["!ref"] ||= "A1:A1";
	}
	var l = {
		s: {
			c: 1e7,
			r: 1e7
		},
		e: {
			c: 0,
			r: 0
		}
	};
	if (a["!ref"]) {
		var u = kr(a["!ref"]);
		l.s.c = u.s.c, l.s.r = u.s.r, l.e.c = Math.max(l.e.c, u.e.c), l.e.r = Math.max(l.e.r, u.e.r), o == -1 && (l.e.r = o = u.e.r + 1);
	}
	for (var d = 0; d != t.length; ++d) if (t[d]) {
		if (!Array.isArray(t[d])) throw Error("aoa_to_sheet expects an array of arrays");
		for (var f = 0; f != t[d].length; ++f) if (t[d][f] !== void 0) {
			var p = { v: t[d][f] }, m = o + d, h = s + f;
			if (l.s.r > m && (l.s.r = m), l.s.c > h && (l.s.c = h), l.e.r < m && (l.e.r = m), l.e.c < h && (l.e.c = h), t[d][f] && typeof t[d][f] == "object" && !Array.isArray(t[d][f]) && !(t[d][f] instanceof Date)) p = t[d][f];
			else if (Array.isArray(p.v) && (p.f = t[d][f][1], p.v = p.v[0]), p.v === null) if (p.f) p.t = "n";
			else if (r.nullError) p.t = "e", p.v = 0;
			else if (r.sheetStubs) p.t = "z";
			else continue;
			else typeof p.v == "number" ? p.t = "n" : typeof p.v == "boolean" ? p.t = "b" : p.v instanceof Date ? (p.z = r.dateNF || U[14], r.cellDates ? (p.t = "d", p.w = Ye(p.z, pt(p.v))) : (p.t = "n", p.v = pt(p.v), p.w = Ye(p.z, p.v))) : p.t = "s";
			if (i) a[m] || (a[m] = []), a[m][h] && a[m][h].z && (p.z = a[m][h].z), a[m][h] = p;
			else {
				var g = X({
					c: h,
					r: m
				});
				a[g] && a[g].z && (p.z = a[g].z), a[g] = p;
			}
		}
	}
	return l.s.c < 1e7 && (a["!ref"] = Z(l)), a;
}
function Pr(e, t) {
	return Nr(null, e, t);
}
function Fr(e) {
	return e.read_shift(4, "i");
}
function Ir(e) {
	var t = e.read_shift(4);
	return t === 0 ? "" : e.read_shift(t, "dbcs");
}
function Lr(e) {
	return {
		ich: e.read_shift(2),
		ifnt: e.read_shift(2)
	};
}
function Rr(e, t) {
	var n = e.l, r = e.read_shift(1), i = Ir(e), a = [], o = {
		t: i,
		h: i
	};
	if (r & 1) {
		for (var s = e.read_shift(4), c = 0; c != s; ++c) a.push(Lr(e));
		o.r = a;
	} else o.r = [{
		ich: 0,
		ifnt: 0
	}];
	return e.l = n + t, o;
}
var zr = Rr;
function Br(e) {
	var t = e.read_shift(4), n = e.read_shift(2);
	return n += e.read_shift(1) << 16, e.l++, {
		c: t,
		iStyleRef: n
	};
}
function Vr(e) {
	var t = e.read_shift(2);
	return t += e.read_shift(1) << 16, e.l++, {
		c: -1,
		iStyleRef: t
	};
}
var Hr = Ir;
function Ur(e) {
	var t = e.read_shift(4);
	return t === 0 || t === 4294967295 ? "" : e.read_shift(t, "dbcs");
}
var Wr = Ir, Gr = Ur;
function Kr(e) {
	var t = e.slice(e.l, e.l + 4), n = t[0] & 1, r = t[0] & 2;
	e.l += 4;
	var i = r === 0 ? Jn([
		0,
		0,
		0,
		0,
		t[0] & 252,
		t[1],
		t[2],
		t[3]
	], 0) : tr(t, 0) >> 2;
	return n ? i / 100 : i;
}
function qr(e) {
	var t = {
		s: {},
		e: {}
	};
	return t.s.r = e.read_shift(4), t.e.r = e.read_shift(4), t.s.c = e.read_shift(4), t.e.c = e.read_shift(4), t;
}
var Jr = qr;
function Yr(e) {
	if (e.length - e.l < 8) throw "XLS Xnum Buffer underflow";
	return e.read_shift(8, "f");
}
function Xr(e) {
	var t = {}, n = e.read_shift(1) >>> 1, r = e.read_shift(1), i = e.read_shift(2, "i"), a = e.read_shift(1), o = e.read_shift(1), s = e.read_shift(1);
	switch (e.l++, n) {
		case 0:
			t.auto = 1;
			break;
		case 1:
			t.index = r;
			var c = yi[r];
			c && (t.rgb = Xs(c));
			break;
		case 2:
			t.rgb = Xs([
				a,
				o,
				s
			]);
			break;
		case 3:
			t.theme = r;
			break;
	}
	return i != 0 && (t.tint = i > 0 ? i / 32767 : i / 32768), t;
}
function Zr(e) {
	var t = e.read_shift(1);
	return e.l++, {
		fBold: t & 1,
		fItalic: t & 2,
		fUnderline: t & 4,
		fStrikeout: t & 8,
		fOutline: t & 16,
		fShadow: t & 32,
		fCondense: t & 64,
		fExtend: t & 128
	};
}
function Qr(e, t) {
	var n = {
		2: "BITMAP",
		3: "METAFILEPICT",
		8: "DIB",
		14: "ENHMETAFILE"
	}, r = e.read_shift(4);
	switch (r) {
		case 0: return "";
		case 4294967295:
		case 4294967294: return n[e.read_shift(4)] || "";
	}
	if (r > 400) throw Error("Unsupported Clipboard: " + r.toString(16));
	return e.l -= 4, e.read_shift(0, t == 1 ? "lpstr" : "lpwstr");
}
function $r(e) {
	return Qr(e, 1);
}
function ei(e) {
	return Qr(e, 2);
}
var ti = 2, ni = 3, ri = 11, ii = 12, ai = 19, oi = 64, si = 65, ci = 71, li = 4108, ui = 4126, di = 80, fi = 81, pi = [di, fi], mi = {
	1: {
		n: "CodePage",
		t: ti
	},
	2: {
		n: "Category",
		t: di
	},
	3: {
		n: "PresentationFormat",
		t: di
	},
	4: {
		n: "ByteCount",
		t: ni
	},
	5: {
		n: "LineCount",
		t: ni
	},
	6: {
		n: "ParagraphCount",
		t: ni
	},
	7: {
		n: "SlideCount",
		t: ni
	},
	8: {
		n: "NoteCount",
		t: ni
	},
	9: {
		n: "HiddenCount",
		t: ni
	},
	10: {
		n: "MultimediaClipCount",
		t: ni
	},
	11: {
		n: "ScaleCrop",
		t: ri
	},
	12: {
		n: "HeadingPairs",
		t: li
	},
	13: {
		n: "TitlesOfParts",
		t: ui
	},
	14: {
		n: "Manager",
		t: di
	},
	15: {
		n: "Company",
		t: di
	},
	16: {
		n: "LinksUpToDate",
		t: ri
	},
	17: {
		n: "CharacterCount",
		t: ni
	},
	19: {
		n: "SharedDoc",
		t: ri
	},
	22: {
		n: "HyperlinksChanged",
		t: ri
	},
	23: {
		n: "AppVersion",
		t: ni,
		p: "version"
	},
	24: {
		n: "DigSig",
		t: si
	},
	26: {
		n: "ContentType",
		t: di
	},
	27: {
		n: "ContentStatus",
		t: di
	},
	28: {
		n: "Language",
		t: di
	},
	29: {
		n: "Version",
		t: di
	},
	255: {},
	2147483648: {
		n: "Locale",
		t: ai
	},
	2147483651: {
		n: "Behavior",
		t: ai
	},
	1919054434: {}
}, hi = {
	1: {
		n: "CodePage",
		t: ti
	},
	2: {
		n: "Title",
		t: di
	},
	3: {
		n: "Subject",
		t: di
	},
	4: {
		n: "Author",
		t: di
	},
	5: {
		n: "Keywords",
		t: di
	},
	6: {
		n: "Comments",
		t: di
	},
	7: {
		n: "Template",
		t: di
	},
	8: {
		n: "LastAuthor",
		t: di
	},
	9: {
		n: "RevNumber",
		t: di
	},
	10: {
		n: "EditTime",
		t: oi
	},
	11: {
		n: "LastPrinted",
		t: oi
	},
	12: {
		n: "CreatedDate",
		t: oi
	},
	13: {
		n: "ModifiedDate",
		t: oi
	},
	14: {
		n: "PageCount",
		t: ni
	},
	15: {
		n: "WordCount",
		t: ni
	},
	16: {
		n: "CharCount",
		t: ni
	},
	17: {
		n: "Thumbnail",
		t: ci
	},
	18: {
		n: "Application",
		t: di
	},
	19: {
		n: "DocSecurity",
		t: ni
	},
	255: {},
	2147483648: {
		n: "Locale",
		t: ai
	},
	2147483651: {
		n: "Behavior",
		t: ai
	},
	1919054434: {}
}, gi = {
	1: "US",
	2: "CA",
	3: "",
	7: "RU",
	20: "EG",
	30: "GR",
	31: "NL",
	32: "BE",
	33: "FR",
	34: "ES",
	36: "HU",
	39: "IT",
	41: "CH",
	43: "AT",
	44: "GB",
	45: "DK",
	46: "SE",
	47: "NO",
	48: "PL",
	49: "DE",
	52: "MX",
	55: "BR",
	61: "AU",
	64: "NZ",
	66: "TH",
	81: "JP",
	82: "KR",
	84: "VN",
	86: "CN",
	90: "TR",
	105: "JS",
	213: "DZ",
	216: "MA",
	218: "LY",
	351: "PT",
	354: "IS",
	358: "FI",
	420: "CZ",
	886: "TW",
	961: "LB",
	962: "JO",
	963: "SY",
	964: "IQ",
	965: "KW",
	966: "SA",
	971: "AE",
	972: "IL",
	974: "QA",
	981: "IR",
	65535: "US"
}, _i = [
	null,
	"solid",
	"mediumGray",
	"darkGray",
	"lightGray",
	"darkHorizontal",
	"darkVertical",
	"darkDown",
	"darkUp",
	"darkGrid",
	"darkTrellis",
	"lightHorizontal",
	"lightVertical",
	"lightDown",
	"lightUp",
	"lightGrid",
	"lightTrellis",
	"gray125",
	"gray0625"
];
function vi(e) {
	return e.map(function(e) {
		return [
			e >> 16 & 255,
			e >> 8 & 255,
			e & 255
		];
	});
}
var yi = /*#__PURE__*/ wt(/* @__PURE__ */ vi([
	0,
	16777215,
	16711680,
	65280,
	255,
	16776960,
	16711935,
	65535,
	0,
	16777215,
	16711680,
	65280,
	255,
	16776960,
	16711935,
	65535,
	8388608,
	32768,
	128,
	8421376,
	8388736,
	32896,
	12632256,
	8421504,
	10066431,
	10040166,
	16777164,
	13434879,
	6684774,
	16744576,
	26316,
	13421823,
	128,
	16711935,
	16776960,
	65535,
	8388736,
	8388608,
	32896,
	255,
	52479,
	13434879,
	13434828,
	16777113,
	10079487,
	16751052,
	13408767,
	16764057,
	3368703,
	3394764,
	10079232,
	16763904,
	16750848,
	16737792,
	6710937,
	9868950,
	13158,
	3381606,
	13056,
	3355392,
	10040064,
	10040166,
	3355545,
	3355443,
	16777215,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
])), bi = {
	0: "#NULL!",
	7: "#DIV/0!",
	15: "#VALUE!",
	23: "#REF!",
	29: "#NAME?",
	36: "#NUM!",
	42: "#N/A",
	43: "#GETTING_DATA",
	255: "#WTF?"
}, xi = {
	"#NULL!": 0,
	"#DIV/0!": 7,
	"#VALUE!": 15,
	"#REF!": 23,
	"#NAME?": 29,
	"#NUM!": 36,
	"#N/A": 42,
	"#GETTING_DATA": 43,
	"#WTF?": 255
}, Si = {
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
	"application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
	"application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
	"application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
	"application/vnd.ms-excel.worksheet": "sheets",
	"application/vnd.ms-excel.binIndexWs": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
	"application/vnd.ms-excel.chartsheet": "charts",
	"application/vnd.ms-excel.macrosheet+xml": "macros",
	"application/vnd.ms-excel.macrosheet": "macros",
	"application/vnd.ms-excel.intlmacrosheet": "TODO",
	"application/vnd.ms-excel.binIndexMs": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
	"application/vnd.ms-excel.dialogsheet": "dialogs",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
	"application/vnd.ms-excel.sharedStrings": "strs",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
	"application/vnd.ms-excel.styles": "styles",
	"application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
	"application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
	"application/vnd.ms-excel.comments": "comments",
	"application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
	"application/vnd.ms-excel.person+xml": "people",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
	"application/vnd.ms-excel.sheetMetadata": "metadata",
	"application/vnd.ms-excel.pivotTable": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
	"application/vnd.ms-office.chartcolorstyle+xml": "TODO",
	"application/vnd.ms-office.chartstyle+xml": "TODO",
	"application/vnd.ms-office.chartex+xml": "TODO",
	"application/vnd.ms-excel.calcChain": "calcchains",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
	"application/vnd.ms-office.activeX": "TODO",
	"application/vnd.ms-office.activeX+xml": "TODO",
	"application/vnd.ms-excel.attachedToolbars": "TODO",
	"application/vnd.ms-excel.connections": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
	"application/vnd.ms-excel.externalLink": "links",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
	"application/vnd.ms-excel.pivotCacheDefinition": "TODO",
	"application/vnd.ms-excel.pivotCacheRecords": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
	"application/vnd.ms-excel.queryTable": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
	"application/vnd.ms-excel.userNames": "TODO",
	"application/vnd.ms-excel.revisionHeaders": "TODO",
	"application/vnd.ms-excel.revisionLog": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
	"application/vnd.ms-excel.tableSingleCells": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
	"application/vnd.ms-excel.slicer": "TODO",
	"application/vnd.ms-excel.slicerCache": "TODO",
	"application/vnd.ms-excel.slicer+xml": "TODO",
	"application/vnd.ms-excel.slicerCache+xml": "TODO",
	"application/vnd.ms-excel.wsSortMap": "TODO",
	"application/vnd.ms-excel.table": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.theme+xml": "themes",
	"application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
	"application/vnd.ms-excel.Timeline+xml": "TODO",
	"application/vnd.ms-excel.TimelineCache+xml": "TODO",
	"application/vnd.ms-office.vbaProject": "vba",
	"application/vnd.ms-office.vbaProjectSignature": "TODO",
	"application/vnd.ms-office.volatileDependencies": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
	"application/vnd.ms-excel.controlproperties+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.model+data": "TODO",
	"application/vnd.ms-excel.Survey+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
	"application/vnd.openxmlformats-package.relationships+xml": "rels",
	"application/vnd.openxmlformats-officedocument.oleObject": "TODO",
	"image/png": "TODO",
	sheet: "js"
}, Ci = {
	workbooks: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
		xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
		xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
		xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
		xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml"
	},
	strs: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
		xlsb: "application/vnd.ms-excel.sharedStrings"
	},
	comments: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
		xlsb: "application/vnd.ms-excel.comments"
	},
	sheets: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
		xlsb: "application/vnd.ms-excel.worksheet"
	},
	charts: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
		xlsb: "application/vnd.ms-excel.chartsheet"
	},
	dialogs: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
		xlsb: "application/vnd.ms-excel.dialogsheet"
	},
	macros: {
		xlsx: "application/vnd.ms-excel.macrosheet+xml",
		xlsb: "application/vnd.ms-excel.macrosheet"
	},
	metadata: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
		xlsb: "application/vnd.ms-excel.sheetMetadata"
	},
	styles: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
		xlsb: "application/vnd.ms-excel.styles"
	}
};
function wi() {
	return {
		workbooks: [],
		sheets: [],
		charts: [],
		dialogs: [],
		macros: [],
		rels: [],
		strs: [],
		comments: [],
		threadedcomments: [],
		links: [],
		coreprops: [],
		extprops: [],
		custprops: [],
		themes: [],
		styles: [],
		calcchains: [],
		vba: [],
		drawings: [],
		metadata: [],
		people: [],
		TODO: [],
		xmlns: ""
	};
}
function Ti(e) {
	var t = wi();
	if (!e || !e.match) return t;
	var n = {};
	if ((e.match(Kt) || []).forEach(function(e) {
		var r = K(e);
		switch (r[0].replace(qt, "<")) {
			case "<?xml": break;
			case "<Types":
				t.xmlns = r["xmlns" + (r[0].match(/<(\w+):/) || ["", ""])[1]];
				break;
			case "<Default":
				n[r.Extension] = r.ContentType;
				break;
			case "<Override":
				t[Si[r.ContentType]] !== void 0 && t[Si[r.ContentType]].push(r.PartName);
				break;
		}
	}), t.xmlns !== wn.CT) throw Error("Unknown Namespace: " + t.xmlns);
	return t.calcchain = t.calcchains.length > 0 ? t.calcchains[0] : "", t.sst = t.strs.length > 0 ? t.strs[0] : "", t.style = t.styles.length > 0 ? t.styles[0] : "", t.defaults = n, delete t.calcchains, t;
}
function Ei(e, t) {
	var n = dt(Si), r = [], i;
	r[r.length] = Ut, r[r.length] = Y("Types", null, {
		xmlns: wn.CT,
		"xmlns:xsd": wn.xsd,
		"xmlns:xsi": wn.xsi
	}), r = r.concat([
		["xml", "application/xml"],
		["bin", "application/vnd.ms-excel.sheet.binary.macroEnabled.main"],
		["vml", "application/vnd.openxmlformats-officedocument.vmlDrawing"],
		["data", "application/vnd.openxmlformats-officedocument.model+data"],
		["bmp", "image/bmp"],
		["png", "image/png"],
		["gif", "image/gif"],
		["emf", "image/x-emf"],
		["wmf", "image/x-wmf"],
		["jpg", "image/jpeg"],
		["jpeg", "image/jpeg"],
		["tif", "image/tiff"],
		["tiff", "image/tiff"],
		["pdf", "application/pdf"],
		["rels", "application/vnd.openxmlformats-package.relationships+xml"]
	].map(function(e) {
		return Y("Default", null, {
			Extension: e[0],
			ContentType: e[1]
		});
	}));
	var a = function(n) {
		e[n] && e[n].length > 0 && (i = e[n][0], r[r.length] = Y("Override", null, {
			PartName: (i[0] == "/" ? "" : "/") + i,
			ContentType: Ci[n][t.bookType] || Ci[n].xlsx
		}));
	}, o = function(n) {
		(e[n] || []).forEach(function(e) {
			r[r.length] = Y("Override", null, {
				PartName: (e[0] == "/" ? "" : "/") + e,
				ContentType: Ci[n][t.bookType] || Ci[n].xlsx
			});
		});
	}, s = function(t) {
		(e[t] || []).forEach(function(e) {
			r[r.length] = Y("Override", null, {
				PartName: (e[0] == "/" ? "" : "/") + e,
				ContentType: n[t][0]
			});
		});
	};
	return a("workbooks"), o("sheets"), o("charts"), s("themes"), ["strs", "styles"].forEach(a), [
		"coreprops",
		"extprops",
		"custprops"
	].forEach(s), s("vba"), s("comments"), s("threadedcomments"), s("drawings"), o("metadata"), s("people"), r.length > 2 && (r[r.length] = "</Types>", r[1] = r[1].replace("/>", ">")), r.join("");
}
var Q = {
	WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
	SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
	HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
	VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
	XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
	XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
	XLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
	CXML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
	CXMLP: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
	CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
	CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
	EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
	CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
	SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
	STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
	THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
	CHART: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
	CHARTEX: "http://schemas.microsoft.com/office/2014/relationships/chartEx",
	CS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
	WS: ["http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet", "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"],
	DS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
	MS: "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet",
	IMG: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
	DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
	XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
	TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
	PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
	VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
};
function Di(e) {
	var t = e.lastIndexOf("/");
	return e.slice(0, t + 1) + "_rels/" + e.slice(t + 1) + ".rels";
}
function Oi(e, t) {
	var n = { "!id": {} };
	if (!e) return n;
	t.charAt(0) !== "/" && (t = "/" + t);
	var r = {};
	return (e.match(Kt) || []).forEach(function(e) {
		var i = K(e);
		if (i[0] === "<Relationship") {
			var a = {};
			a.Type = i.Type, a.Target = i.Target, a.Id = i.Id, i.TargetMode && (a.TargetMode = i.TargetMode);
			var o = i.TargetMode === "External" ? i.Target : Ht(i.Target, t);
			n[o] = a, r[i.Id] = a;
		}
	}), n["!id"] = r, n;
}
function ki(e) {
	var t = [Ut, Y("Relationships", null, { xmlns: wn.RELS })];
	return ct(e["!id"]).forEach(function(n) {
		t[t.length] = Y("Relationship", null, e["!id"][n]);
	}), t.length > 2 && (t[t.length] = "</Relationships>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function Ai(e, t, n, r, i, a) {
	if (i ||= {}, e["!id"] ||= {}, e["!idx"] ||= 1, t < 0) for (t = e["!idx"]; e["!id"]["rId" + t]; ++t);
	if (e["!idx"] = t + 1, i.Id = "rId" + t, i.Type = r, i.Target = n, a ? i.TargetMode = a : [
		Q.HLINK,
		Q.XPATH,
		Q.XMISS
	].indexOf(i.Type) > -1 && (i.TargetMode = "External"), e["!id"][i.Id]) throw Error("Cannot rewrite rId " + t);
	return e["!id"][i.Id] = i, e[("/" + i.Target).replace("//", "/")] = i, t;
}
var ji = "application/vnd.oasis.opendocument.spreadsheet";
function Mi(e, t) {
	for (var n = Sn(e), r, i; r = Cn.exec(n);) switch (r[3]) {
		case "manifest": break;
		case "file-entry":
			if (i = K(r[0], !1), i.path == "/" && i.type !== ji) throw Error("This OpenDocument is not a spreadsheet");
			break;
		case "encryption-data":
		case "algorithm":
		case "start-key-generation":
		case "key-derivation": throw Error("Unsupported ODS Encryption");
		default: if (t && t.WTF) throw r;
	}
}
var Ni = [
	["cp:category", "Category"],
	["cp:contentStatus", "ContentStatus"],
	["cp:keywords", "Keywords"],
	["cp:lastModifiedBy", "LastAuthor"],
	["cp:lastPrinted", "LastPrinted"],
	["cp:revision", "RevNumber"],
	["cp:version", "Version"],
	["dc:creator", "Author"],
	["dc:description", "Comments"],
	["dc:identifier", "Identifier"],
	["dc:language", "Language"],
	["dc:subject", "Subject"],
	["dc:title", "Title"],
	[
		"dcterms:created",
		"CreatedDate",
		"date"
	],
	[
		"dcterms:modified",
		"ModifiedDate",
		"date"
	]
], Pi = /*#__PURE__*/ (function() {
	for (var e = Array(Ni.length), t = 0; t < Ni.length; ++t) {
		var n = Ni[t], r = "(?:" + n[0].slice(0, n[0].indexOf(":")) + ":)" + n[0].slice(n[0].indexOf(":") + 1);
		e[t] = RegExp("<" + r + "[^>]*>([\\s\\S]*?)</" + r + ">");
	}
	return e;
})();
function Fi(e) {
	var t = {};
	e = J(e);
	for (var n = 0; n < Ni.length; ++n) {
		var r = Ni[n], i = e.match(Pi[n]);
		i != null && i.length > 0 && (t[r[1]] = q(i[1])), r[2] === "date" && t[r[1]] && (t[r[1]] = St(t[r[1]]));
	}
	return t;
}
function Ii(e, t, n, r, i) {
	i[e] != null || t == null || t === "" || (i[e] = t, t = en(t), r[r.length] = n ? Y(e, t, n) : vn(e, t));
}
function Li(e, t) {
	var n = t || {}, r = [Ut, Y("cp:coreProperties", null, {
		"xmlns:cp": wn.CORE_PROPS,
		"xmlns:dc": wn.dc,
		"xmlns:dcterms": wn.dcterms,
		"xmlns:dcmitype": wn.dcmitype,
		"xmlns:xsi": wn.xsi
	})], i = {};
	if (!e && !n.Props) return r.join("");
	e && (e.CreatedDate != null && Ii("dcterms:created", typeof e.CreatedDate == "string" ? e.CreatedDate : bn(e.CreatedDate, n.WTF), { "xsi:type": "dcterms:W3CDTF" }, r, i), e.ModifiedDate != null && Ii("dcterms:modified", typeof e.ModifiedDate == "string" ? e.ModifiedDate : bn(e.ModifiedDate, n.WTF), { "xsi:type": "dcterms:W3CDTF" }, r, i));
	for (var a = 0; a != Ni.length; ++a) {
		var o = Ni[a], s = n.Props && n.Props[o[1]] != null ? n.Props[o[1]] : e ? e[o[1]] : null;
		s === !0 ? s = "1" : s === !1 ? s = "0" : typeof s == "number" && (s = String(s)), s != null && Ii(o[0], s, null, r, i);
	}
	return r.length > 2 && (r[r.length] = "</cp:coreProperties>", r[1] = r[1].replace("/>", ">")), r.join("");
}
var Ri = [
	[
		"Application",
		"Application",
		"string"
	],
	[
		"AppVersion",
		"AppVersion",
		"string"
	],
	[
		"Company",
		"Company",
		"string"
	],
	[
		"DocSecurity",
		"DocSecurity",
		"string"
	],
	[
		"Manager",
		"Manager",
		"string"
	],
	[
		"HyperlinksChanged",
		"HyperlinksChanged",
		"bool"
	],
	[
		"SharedDoc",
		"SharedDoc",
		"bool"
	],
	[
		"LinksUpToDate",
		"LinksUpToDate",
		"bool"
	],
	[
		"ScaleCrop",
		"ScaleCrop",
		"bool"
	],
	[
		"HeadingPairs",
		"HeadingPairs",
		"raw"
	],
	[
		"TitlesOfParts",
		"TitlesOfParts",
		"raw"
	]
];
function zi(e, t, n, r) {
	var i = [];
	if (typeof e == "string") i = gn(e, r);
	else for (var a = 0; a < e.length; ++a) i = i.concat(e[a].map(function(e) {
		return { v: e };
	}));
	var o = typeof t == "string" ? gn(t, r).map(function(e) {
		return e.v;
	}) : t, s = 0, c = 0;
	if (o.length > 0) for (var l = 0; l !== i.length; l += 2) {
		switch (c = +i[l + 1].v, i[l].v) {
			case "Worksheets":
			case "工作表":
			case "Листы":
			case "أوراق العمل":
			case "ワークシート":
			case "גליונות עבודה":
			case "Arbeitsblätter":
			case "Çalışma Sayfaları":
			case "Feuilles de calcul":
			case "Fogli di lavoro":
			case "Folhas de cálculo":
			case "Planilhas":
			case "Regneark":
			case "Hojas de cálculo":
			case "Werkbladen":
				n.Worksheets = c, n.SheetNames = o.slice(s, s + c);
				break;
			case "Named Ranges":
			case "Rangos con nombre":
			case "名前付き一覧":
			case "Benannte Bereiche":
			case "Navngivne områder":
				n.NamedRanges = c, n.DefinedNames = o.slice(s, s + c);
				break;
			case "Charts":
			case "Diagramme":
				n.Chartsheets = c, n.ChartNames = o.slice(s, s + c);
				break;
		}
		s += c;
	}
}
function Bi(e, t, n) {
	var r = {};
	return t ||= {}, e = J(e), Ri.forEach(function(n) {
		var i = (e.match(dn(n[0])) || [])[1];
		switch (n[2]) {
			case "string":
				i && (t[n[1]] = q(i));
				break;
			case "bool":
				t[n[1]] = i === "true";
				break;
			case "raw":
				var a = e.match(RegExp("<" + n[0] + "[^>]*>([\\s\\S]*?)</" + n[0] + ">"));
				a && a.length > 0 && (r[n[1]] = a[1]);
				break;
		}
	}), r.HeadingPairs && r.TitlesOfParts && zi(r.HeadingPairs, r.TitlesOfParts, t, n), t;
}
function Vi(e) {
	var t = [], n = Y;
	return e ||= {}, e.Application = "SheetJS", t[t.length] = Ut, t[t.length] = Y("Properties", null, {
		xmlns: wn.EXT_PROPS,
		"xmlns:vt": wn.vt
	}), Ri.forEach(function(r) {
		if (e[r[1]] !== void 0) {
			var i;
			switch (r[2]) {
				case "string":
					i = en(String(e[r[1]]));
					break;
				case "bool":
					i = e[r[1]] ? "true" : "false";
					break;
			}
			i !== void 0 && (t[t.length] = n(r[0], i));
		}
	}), t[t.length] = n("HeadingPairs", n("vt:vector", n("vt:variant", "<vt:lpstr>Worksheets</vt:lpstr>") + n("vt:variant", n("vt:i4", String(e.Worksheets))), {
		size: 2,
		baseType: "variant"
	})), t[t.length] = n("TitlesOfParts", n("vt:vector", e.SheetNames.map(function(e) {
		return "<vt:lpstr>" + en(e) + "</vt:lpstr>";
	}).join(""), {
		size: e.Worksheets,
		baseType: "lpstr"
	})), t.length > 2 && (t[t.length] = "</Properties>", t[1] = t[1].replace("/>", ">")), t.join("");
}
var Hi = /<[^>]+>[^<]*/g;
function Ui(e, t) {
	var n = {}, r = "", i = e.match(Hi);
	if (i) for (var a = 0; a != i.length; ++a) {
		var o = i[a], s = K(o);
		switch (s[0]) {
			case "<?xml": break;
			case "<Properties": break;
			case "<property":
				r = q(s.name);
				break;
			case "</property>":
				r = null;
				break;
			default: if (o.indexOf("<vt:") === 0) {
				var c = o.split(">"), l = c[0].slice(4), u = c[1];
				switch (l) {
					case "lpstr":
					case "bstr":
					case "lpwstr":
						n[r] = q(u);
						break;
					case "bool":
						n[r] = an(u);
						break;
					case "i1":
					case "i2":
					case "i4":
					case "i8":
					case "int":
					case "uint":
						n[r] = parseInt(u, 10);
						break;
					case "r4":
					case "r8":
					case "decimal":
						n[r] = parseFloat(u);
						break;
					case "filetime":
					case "date":
						n[r] = St(u);
						break;
					case "cy":
					case "error":
						n[r] = q(u);
						break;
					default:
						if (l.slice(-1) == "/") break;
						t.WTF && typeof console < "u" && console.warn("Unexpected", o, l, c);
				}
			} else if (o.slice(0, 2) !== "</" && t.WTF) throw Error(o);
		}
	}
	return n;
}
function Wi(e) {
	var t = [Ut, Y("Properties", null, {
		xmlns: wn.CUST_PROPS,
		"xmlns:vt": wn.vt
	})];
	if (!e) return t.join("");
	var n = 1;
	return ct(e).forEach(function(r) {
		++n, t[t.length] = Y("property", xn(e[r], !0), {
			fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
			pid: n,
			name: en(r)
		});
	}), t.length > 2 && (t[t.length] = "</Properties>", t[1] = t[1].replace("/>", ">")), t.join("");
}
var Gi = {
	Title: "Title",
	Subject: "Subject",
	Author: "Author",
	Keywords: "Keywords",
	Comments: "Description",
	LastAuthor: "LastAuthor",
	RevNumber: "Revision",
	Application: "AppName",
	LastPrinted: "LastPrinted",
	CreatedDate: "Created",
	ModifiedDate: "LastSaved",
	Category: "Category",
	Manager: "Manager",
	Company: "Company",
	AppVersion: "Version",
	ContentStatus: "ContentStatus",
	Identifier: "Identifier",
	Language: "Language"
}, Ki;
function qi(e, t, n) {
	Ki ||= lt(Gi), t = Ki[t] || t, e[t] = n;
}
function Ji(e) {
	var t = e.read_shift(4), n = e.read_shift(4);
	return (/* @__PURE__ */ new Date((n / 1e7 * 2 ** 32 + t / 1e7 - 11644473600) * 1e3)).toISOString().replace(/\.000/, "");
}
function Yi(e, t, n) {
	var r = e.l, i = e.read_shift(0, "lpstr-cp");
	if (n) for (; e.l - r & 3;) ++e.l;
	return i;
}
function Xi(e, t, n) {
	var r = e.read_shift(0, "lpwstr");
	return n && (e.l += 4 - (r.length + 1 & 3) & 3), r;
}
function Zi(e, t, n) {
	return t === 31 ? Xi(e) : Yi(e, t, n);
}
function Qi(e, t, n) {
	return Zi(e, t, n === !1 ? 0 : 4);
}
function $i(e, t) {
	if (!t) throw Error("VtUnalignedString must have positive length");
	return Zi(e, t, 0);
}
function ea(e) {
	for (var t = e.read_shift(4), n = [], r = 0; r != t; ++r) {
		var i = e.l;
		n[r] = e.read_shift(0, "lpwstr").replace(P, ""), e.l - i & 2 && (e.l += 2);
	}
	return n;
}
function ta(e) {
	for (var t = e.read_shift(4), n = [], r = 0; r != t; ++r) n[r] = e.read_shift(0, "lpstr-cp").replace(P, "");
	return n;
}
function na(e) {
	var t = e.l, n = sa(e, fi);
	return e[e.l] == 0 && e[e.l + 1] == 0 && e.l - t & 2 && (e.l += 2), [n, sa(e, ni)];
}
function ra(e) {
	for (var t = e.read_shift(4), n = [], r = 0; r < t / 2; ++r) n.push(na(e));
	return n;
}
function ia(e, t) {
	for (var n = e.read_shift(4), r = {}, i = 0; i != n; ++i) {
		var a = e.read_shift(4), o = e.read_shift(4);
		r[a] = e.read_shift(o, t === 1200 ? "utf16le" : "utf8").replace(P, "").replace(F, "!"), t === 1200 && o % 2 && (e.l += 2);
	}
	return e.l & 3 && (e.l = e.l >> 3 << 2), r;
}
function aa(e) {
	var t = e.read_shift(4), n = e.slice(e.l, e.l + t);
	return e.l += t, (t & 3) > 0 && (e.l += 4 - (t & 3) & 3), n;
}
function oa(e) {
	var t = {};
	return t.Size = e.read_shift(4), e.l += t.Size + 3 - (t.Size - 1) % 4, t;
}
function sa(e, t, n) {
	var r = e.read_shift(2), i, a = n || {};
	if (e.l += 2, t !== ii && r !== t && pi.indexOf(t) === -1 && !((t & 65534) == 4126 && (r & 65534) == 4126)) throw Error("Expected type " + t + " saw " + r);
	switch (t === ii ? r : t) {
		case 2: return i = e.read_shift(2, "i"), a.raw || (e.l += 2), i;
		case 3: return i = e.read_shift(4, "i"), i;
		case 11: return e.read_shift(4) !== 0;
		case 19: return i = e.read_shift(4), i;
		case 30: return Yi(e, r, 4).replace(P, "");
		case 31: return Xi(e);
		case 64: return Ji(e);
		case 65: return aa(e);
		case 71: return oa(e);
		case 80: return Qi(e, r, !a.raw).replace(P, "");
		case 81: return $i(e, r).replace(P, "");
		case 4108: return ra(e);
		case 4126:
		case 4127: return r == 4127 ? ea(e) : ta(e);
		default: throw Error("TypedPropertyValue unrecognized type " + t + " " + r);
	}
}
function ca(e, t) {
	var n = e.l, r = e.read_shift(4), i = e.read_shift(4), a = [], o = 0, s = 0, c = -1, u = {};
	for (o = 0; o != i; ++o) a[o] = [e.read_shift(4), e.read_shift(4) + n];
	a.sort(function(e, t) {
		return e[1] - t[1];
	});
	var d = {};
	for (o = 0; o != i; ++o) {
		if (e.l !== a[o][1]) {
			var f = !0;
			if (o > 0 && t) switch (t[a[o - 1][0]].t) {
				case 2:
					e.l + 2 === a[o][1] && (e.l += 2, f = !1);
					break;
				case 80:
					e.l <= a[o][1] && (e.l = a[o][1], f = !1);
					break;
				case 4108:
					e.l <= a[o][1] && (e.l = a[o][1], f = !1);
					break;
			}
			if ((!t || o == 0) && e.l <= a[o][1] && (f = !1, e.l = a[o][1]), f) throw Error("Read Error: Expected address " + a[o][1] + " at " + e.l + " :" + o);
		}
		if (t) {
			var p = t[a[o][0]];
			if (d[p.n] = sa(e, p.t, { raw: !0 }), p.p === "version" && (d[p.n] = String(d[p.n] >> 16) + "." + ("0000" + String(d[p.n] & 65535)).slice(-4)), p.n == "CodePage") switch (d[p.n]) {
				case 0: d[p.n] = 1252;
				case 874:
				case 932:
				case 936:
				case 949:
				case 950:
				case 1250:
				case 1251:
				case 1253:
				case 1254:
				case 1255:
				case 1256:
				case 1257:
				case 1258:
				case 1e4:
				case 1200:
				case 1201:
				case 1252:
				case 65e3:
				case -536:
				case 65001:
				case -535:
					l(s = d[p.n] >>> 0 & 65535);
					break;
				default: throw Error("Unsupported CodePage: " + d[p.n]);
			}
		} else if (a[o][0] === 1) {
			if (s = d.CodePage = sa(e, ti), l(s), c !== -1) {
				var m = e.l;
				e.l = a[c][1], u = ia(e, s), e.l = m;
			}
		} else if (a[o][0] === 0) {
			if (s === 0) {
				c = o, e.l = a[o + 1][1];
				continue;
			}
			u = ia(e, s);
		} else {
			var h = u[a[o][0]], g;
			switch (e[e.l]) {
				case 65:
					e.l += 4, g = aa(e);
					break;
				case 30:
					e.l += 4, g = Qi(e, e[e.l - 4]).replace(/\u0000+$/, "");
					break;
				case 31:
					e.l += 4, g = Qi(e, e[e.l - 4]).replace(/\u0000+$/, "");
					break;
				case 3:
					e.l += 4, g = e.read_shift(4, "i");
					break;
				case 19:
					e.l += 4, g = e.read_shift(4);
					break;
				case 5:
					e.l += 4, g = e.read_shift(8, "f");
					break;
				case 11:
					e.l += 4, g = fa(e, 4);
					break;
				case 64:
					e.l += 4, g = St(Ji(e));
					break;
				default: throw Error("unparsed value: " + e[e.l]);
			}
			d[h] = g;
		}
	}
	return e.l = n + r, d;
}
function la(e, t, n) {
	var r = e.content;
	if (!r) return {};
	lr(r, 0);
	var i, a, o, s, c = 0;
	r.chk("feff", "Byte Order: "), r.read_shift(2);
	var l = r.read_shift(4), u = r.read_shift(16);
	if (u !== G.utils.consts.HEADER_CLSID && u !== n) throw Error("Bad PropertySet CLSID " + u);
	if (i = r.read_shift(4), i !== 1 && i !== 2) throw Error("Unrecognized #Sets: " + i);
	if (a = r.read_shift(16), s = r.read_shift(4), i === 1 && s !== r.l) throw Error("Length mismatch: " + s + " !== " + r.l);
	i === 2 && (o = r.read_shift(16), c = r.read_shift(4));
	var d = ca(r, t), f = { SystemIdentifier: l };
	for (var p in d) f[p] = d[p];
	if (f.FMTID = a, i === 1) return f;
	if (c - r.l == 2 && (r.l += 2), r.l !== c) throw Error("Length mismatch 2: " + r.l + " !== " + c);
	var m;
	try {
		m = ca(r, null);
	} catch {}
	for (p in m) f[p] = m[p];
	return f.FMTID = [a, o], f;
}
function ua(e, t) {
	return e.read_shift(t), null;
}
function da(e, t, n) {
	for (var r = [], i = e.l + t; e.l < i;) r.push(n(e, i - e.l));
	if (i !== e.l) throw Error("Slurp error");
	return r;
}
function fa(e, t) {
	return e.read_shift(t) === 1;
}
function pa(e) {
	return e.read_shift(2, "u");
}
function ma(e, t) {
	return da(e, t, pa);
}
function ha(e) {
	var t = e.read_shift(1);
	return e.read_shift(1) === 1 ? t : t === 1;
}
function ga(e, t, n) {
	var i = e.read_shift(n && n.biff >= 12 ? 2 : 1), a = "sbcs-cont", o = r;
	n && n.biff >= 8 && (r = 1200), !n || n.biff == 8 ? e.read_shift(1) && (a = "dbcs-cont") : n.biff == 12 && (a = "wstr"), n.biff >= 2 && n.biff <= 5 && (a = "cpstr");
	var s = i ? e.read_shift(i, a) : "";
	return r = o, s;
}
function _a(e) {
	var t = r;
	r = 1200;
	var n = e.read_shift(2), i = e.read_shift(1), a = i & 4, o = i & 8, s = 1 + (i & 1), c = 0, l, u = {};
	o && (c = e.read_shift(2)), a && (l = e.read_shift(4));
	var d = s == 2 ? "dbcs-cont" : "sbcs-cont", f = n === 0 ? "" : e.read_shift(n, d);
	return o && (e.l += 4 * c), a && (e.l += l), u.t = f, o || (u.raw = "<t>" + u.t + "</t>", u.r = u.t), r = t, u;
}
function va(e, t, n) {
	var r;
	if (n) {
		if (n.biff >= 2 && n.biff <= 5) return e.read_shift(t, "cpstr");
		if (n.biff >= 12) return e.read_shift(t, "dbcs-cont");
	}
	return r = e.read_shift(1) === 0 ? e.read_shift(t, "sbcs-cont") : e.read_shift(t, "dbcs-cont"), r;
}
function ya(e, t, n) {
	var r = e.read_shift(n && n.biff == 2 ? 1 : 2);
	return r === 0 ? (e.l++, "") : va(e, r, n);
}
function ba(e, t, n) {
	if (n.biff > 5) return ya(e, t, n);
	var r = e.read_shift(1);
	return r === 0 ? (e.l++, "") : e.read_shift(r, n.biff <= 4 || !e.lens ? "cpstr" : "sbcs-cont");
}
function xa(e) {
	var t = e.read_shift(1);
	e.l++;
	var n = e.read_shift(2);
	return e.l += 2, [t, n];
}
function Sa(e) {
	var t = e.read_shift(4), n = e.l, r = !1;
	t > 24 && (e.l += t - 24, e.read_shift(16) === "795881f43b1d7f48af2c825dc4852763" && (r = !0), e.l = n);
	var i = e.read_shift((r ? t - 24 : t) >> 1, "utf16le").replace(P, "");
	return r && (e.l += 24), i;
}
function Ca(e) {
	for (var t = e.read_shift(2), n = ""; t-- > 0;) n += "../";
	var r = e.read_shift(0, "lpstr-ansi");
	if (e.l += 2, e.read_shift(2) != 57005) throw Error("Bad FileMoniker");
	if (e.read_shift(4) === 0) return n + r.replace(/\\/g, "/");
	var i = e.read_shift(4);
	if (e.read_shift(2) != 3) throw Error("Bad FileMoniker");
	var a = e.read_shift(i >> 1, "utf16le").replace(P, "");
	return n + a;
}
function wa(e, t) {
	var n = e.read_shift(16);
	switch (t -= 16, n) {
		case "e0c9ea79f9bace118c8200aa004ba90b": return Sa(e, t);
		case "0303000000000000c000000000000046": return Ca(e, t);
		default: throw Error("Unsupported Moniker " + n);
	}
}
function Ta(e) {
	var t = e.read_shift(4);
	return t > 0 ? e.read_shift(t, "utf16le").replace(P, "") : "";
}
function Ea(e, t) {
	var n = e.l + t, r = e.read_shift(4);
	if (r !== 2) throw Error("Unrecognized streamVersion: " + r);
	var i = e.read_shift(2);
	e.l += 2;
	var a, o, s, c, l = "", u, d;
	i & 16 && (a = Ta(e, n - e.l)), i & 128 && (o = Ta(e, n - e.l)), (i & 257) == 257 && (s = Ta(e, n - e.l)), (i & 257) == 1 && (c = wa(e, n - e.l)), i & 8 && (l = Ta(e, n - e.l)), i & 32 && (u = e.read_shift(16)), i & 64 && (d = Ji(e)), e.l = n;
	var f = o || s || c || "";
	f && l && (f += "#" + l), f ||= "#" + l, i & 2 && f.charAt(0) == "/" && f.charAt(1) != "/" && (f = "file://" + f);
	var p = { Target: f };
	return u && (p.guid = u), d && (p.time = d), a && (p.Tooltip = a), p;
}
function Da(e) {
	return [
		e.read_shift(1),
		e.read_shift(1),
		e.read_shift(1),
		e.read_shift(1)
	];
}
function Oa(e, t) {
	var n = Da(e, t);
	return n[3] = 0, n;
}
function ka(e) {
	return {
		r: e.read_shift(2),
		c: e.read_shift(2),
		ixfe: e.read_shift(2)
	};
}
function Aa(e) {
	var t = e.read_shift(2), n = e.read_shift(2);
	return e.l += 8, {
		type: t,
		flags: n
	};
}
function ja(e, t, n) {
	return t === 0 ? "" : ba(e, t, n);
}
function Ma(e, t, n) {
	var r = n.biff > 8 ? 4 : 2;
	return [
		e.read_shift(r),
		e.read_shift(r, "i"),
		e.read_shift(r, "i")
	];
}
function Na(e) {
	return [e.read_shift(2), Kr(e)];
}
function Pa(e, t, n) {
	e.l += 4, t -= 4;
	var r = e.l + t, i = ga(e, t, n), a = e.read_shift(2);
	if (r -= e.l, a !== r) throw Error("Malformed AddinUdf: padding = " + r + " != " + a);
	return e.l += a, i;
}
function Fa(e) {
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(2), i = e.read_shift(2);
	return {
		s: {
			c: r,
			r: t
		},
		e: {
			c: i,
			r: n
		}
	};
}
function Ia(e) {
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(1), i = e.read_shift(1);
	return {
		s: {
			c: r,
			r: t
		},
		e: {
			c: i,
			r: n
		}
	};
}
var La = Ia;
function Ra(e) {
	e.l += 4;
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(2);
	return e.l += 12, [
		n,
		t,
		r
	];
}
function za(e) {
	var t = {};
	return e.l += 4, e.l += 16, t.fSharedNote = e.read_shift(2), e.l += 4, t;
}
function Ba(e) {
	return e.l += 4, e.cf = e.read_shift(2), {};
}
function Va(e) {
	e.l += 2, e.l += e.read_shift(2);
}
var Ha = {
	0: Va,
	4: Va,
	5: Va,
	6: Va,
	7: Ba,
	8: Va,
	9: Va,
	10: Va,
	11: Va,
	12: Va,
	13: za,
	14: Va,
	15: Va,
	16: Va,
	17: Va,
	18: Va,
	19: Va,
	20: Va,
	21: Ra
};
function Ua(e, t) {
	for (var n = e.l + t, r = []; e.l < n;) {
		var i = e.read_shift(2);
		e.l -= 2;
		try {
			r.push(Ha[i](e, n - e.l));
		} catch {
			return e.l = n, r;
		}
	}
	return e.l != n && (e.l = n), r;
}
function Wa(e, t) {
	var n = {
		BIFFVer: 0,
		dt: 0
	};
	switch (n.BIFFVer = e.read_shift(2), t -= 2, t >= 2 && (n.dt = e.read_shift(2), e.l -= 2), n.BIFFVer) {
		case 1536:
		case 1280:
		case 1024:
		case 768:
		case 512:
		case 2:
		case 7: break;
		default: if (t > 6) throw Error("Unexpected BIFF Ver " + n.BIFFVer);
	}
	return e.read_shift(t), n;
}
function Ga(e, t) {
	return t === 0 || e.read_shift(2), 1200;
}
function Ka(e, t, n) {
	if (n.enc) return e.l += t, "";
	var r = e.l, i = ba(e, 0, n);
	return e.read_shift(t + r - e.l), i;
}
function qa(e, t, n) {
	var r = n && n.biff == 8 || t == 2 ? e.read_shift(2) : (e.l += t, 0);
	return {
		fDialog: r & 16,
		fBelow: r & 64,
		fRight: r & 128
	};
}
function Ja(e, t, n) {
	var r = e.read_shift(4), i = e.read_shift(1) & 3, a = e.read_shift(1);
	switch (a) {
		case 0:
			a = "Worksheet";
			break;
		case 1:
			a = "Macrosheet";
			break;
		case 2:
			a = "Chartsheet";
			break;
		case 6:
			a = "VBAModule";
			break;
	}
	var o = ga(e, 0, n);
	return o.length === 0 && (o = "Sheet1"), {
		pos: r,
		hs: i,
		dt: a,
		name: o
	};
}
function Ya(e, t) {
	for (var n = e.l + t, r = e.read_shift(4), i = e.read_shift(4), a = [], o = 0; o != i && e.l < n; ++o) a.push(_a(e));
	return a.Count = r, a.Unique = i, a;
}
function Xa(e, t) {
	var n = {};
	return n.dsst = e.read_shift(2), e.l += t - 2, n;
}
function Za(e) {
	var t = {};
	t.r = e.read_shift(2), t.c = e.read_shift(2), t.cnt = e.read_shift(2) - t.c;
	var n = e.read_shift(2);
	e.l += 4;
	var r = e.read_shift(1);
	return e.l += 3, r & 7 && (t.level = r & 7), r & 32 && (t.hidden = !0), r & 64 && (t.hpt = n / 20), t;
}
function Qa(e) {
	var t = Aa(e);
	if (t.type != 2211) throw Error("Invalid Future Record " + t.type);
	return e.read_shift(4) !== 0;
}
function $a(e) {
	return e.read_shift(2), e.read_shift(4);
}
function eo(e, t, n) {
	var r = 0;
	n && n.biff == 2 || (r = e.read_shift(2));
	var i = e.read_shift(2);
	return n && n.biff == 2 && (r = 1 - (i >> 15), i &= 32767), [{
		Unsynced: r & 1,
		DyZero: (r & 2) >> 1,
		ExAsc: (r & 4) >> 2,
		ExDsc: (r & 8) >> 3
	}, i];
}
function to(e) {
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(2), i = e.read_shift(2), a = e.read_shift(2), o = e.read_shift(2), s = e.read_shift(2), c = e.read_shift(2), l = e.read_shift(2);
	return {
		Pos: [t, n],
		Dim: [r, i],
		Flags: a,
		CurTab: o,
		FirstTab: s,
		Selected: c,
		TabRatio: l
	};
}
function no(e, t, n) {
	return n && n.biff >= 2 && n.biff < 5 ? {} : { RTL: e.read_shift(2) & 64 };
}
function ro() {}
function io(e, t, n) {
	var r = {
		dyHeight: e.read_shift(2),
		fl: e.read_shift(2)
	};
	switch (n && n.biff || 8) {
		case 2: break;
		case 3:
		case 4:
			e.l += 2;
			break;
		default:
			e.l += 10;
			break;
	}
	return r.name = ga(e, 0, n), r;
}
function ao(e) {
	var t = ka(e);
	return t.isst = e.read_shift(4), t;
}
function oo(e, t, n) {
	n.biffguess && n.biff == 2 && (n.biff = 5);
	var r = e.l + t, i = ka(e, 6);
	return n.biff == 2 && e.l++, i.val = ya(e, r - e.l, n), i;
}
function so(e, t, n) {
	return [e.read_shift(2), ba(e, 0, n)];
}
var co = ba;
function lo(e, t, n) {
	var r = e.l + t, i = n.biff == 8 || !n.biff ? 4 : 2, a = e.read_shift(i), o = e.read_shift(i), s = e.read_shift(2), c = e.read_shift(2);
	return e.l = r, {
		s: {
			r: a,
			c: s
		},
		e: {
			r: o,
			c
		}
	};
}
function uo(e) {
	var t = e.read_shift(2), n = e.read_shift(2), r = Na(e);
	return {
		r: t,
		c: n,
		ixfe: r[0],
		rknum: r[1]
	};
}
function fo(e, t) {
	for (var n = e.l + t - 2, r = e.read_shift(2), i = e.read_shift(2), a = []; e.l < n;) a.push(Na(e));
	if (e.l !== n) throw Error("MulRK read error");
	var o = e.read_shift(2);
	if (a.length != o - i + 1) throw Error("MulRK length mismatch");
	return {
		r,
		c: i,
		C: o,
		rkrec: a
	};
}
function po(e, t) {
	for (var n = e.l + t - 2, r = e.read_shift(2), i = e.read_shift(2), a = []; e.l < n;) a.push(e.read_shift(2));
	if (e.l !== n) throw Error("MulBlank read error");
	var o = e.read_shift(2);
	if (a.length != o - i + 1) throw Error("MulBlank length mismatch");
	return {
		r,
		c: i,
		C: o,
		ixfe: a
	};
}
function mo(e, t, n, r) {
	var i = {}, a = e.read_shift(4), o = e.read_shift(4), s = e.read_shift(4), c = e.read_shift(2);
	return i.patternType = _i[s >> 26], r.cellStyles ? (i.alc = a & 7, i.fWrap = a >> 3 & 1, i.alcV = a >> 4 & 7, i.fJustLast = a >> 7 & 1, i.trot = a >> 8 & 255, i.cIndent = a >> 16 & 15, i.fShrinkToFit = a >> 20 & 1, i.iReadOrder = a >> 22 & 2, i.fAtrNum = a >> 26 & 1, i.fAtrFnt = a >> 27 & 1, i.fAtrAlc = a >> 28 & 1, i.fAtrBdr = a >> 29 & 1, i.fAtrPat = a >> 30 & 1, i.fAtrProt = a >> 31 & 1, i.dgLeft = o & 15, i.dgRight = o >> 4 & 15, i.dgTop = o >> 8 & 15, i.dgBottom = o >> 12 & 15, i.icvLeft = o >> 16 & 127, i.icvRight = o >> 23 & 127, i.grbitDiag = o >> 30 & 3, i.icvTop = s & 127, i.icvBottom = s >> 7 & 127, i.icvDiag = s >> 14 & 127, i.dgDiag = s >> 21 & 15, i.icvFore = c & 127, i.icvBack = c >> 7 & 127, i.fsxButton = c >> 14 & 1, i) : i;
}
function ho(e, t, n) {
	var r = {};
	return r.ifnt = e.read_shift(2), r.numFmtId = e.read_shift(2), r.flags = e.read_shift(2), r.fStyle = r.flags >> 2 & 1, t -= 6, r.data = mo(e, t, r.fStyle, n), r;
}
function go(e) {
	e.l += 4;
	var t = [e.read_shift(2), e.read_shift(2)];
	if (t[0] !== 0 && t[0]--, t[1] !== 0 && t[1]--, t[0] > 7 || t[1] > 7) throw Error("Bad Gutters: " + t.join("|"));
	return t;
}
function _o(e, t, n) {
	var r = ka(e, 6);
	(n.biff == 2 || t == 9) && ++e.l;
	var i = ha(e, 2);
	return r.val = i, r.t = i === !0 || i === !1 ? "b" : "e", r;
}
function vo(e, t, n) {
	n.biffguess && n.biff == 2 && (n.biff = 5);
	var r = ka(e, 6);
	return r.val = Yr(e, 8), r;
}
var yo = ja;
function bo(e, t, n) {
	var r = e.l + t, i = e.read_shift(2), a = e.read_shift(2);
	if (n.sbcch = a, a == 1025 || a == 14849) return [a, i];
	if (a < 1 || a > 255) throw Error("Unexpected SupBook type: " + a);
	for (var o = va(e, a), s = []; r > e.l;) s.push(ya(e));
	return [
		a,
		i,
		o,
		s
	];
}
function xo(e, t, n) {
	var r = e.read_shift(2), i, a = {
		fBuiltIn: r & 1,
		fWantAdvise: r >>> 1 & 1,
		fWantPict: r >>> 2 & 1,
		fOle: r >>> 3 & 1,
		fOleLink: r >>> 4 & 1,
		cf: r >>> 5 & 1023,
		fIcon: r >>> 15 & 1
	};
	return n.sbcch === 14849 && (i = Pa(e, t - 2, n)), a.body = i || e.read_shift(t - 2), typeof i == "string" && (a.Name = i), a;
}
var So = [
	"_xlnm.Consolidate_Area",
	"_xlnm.Auto_Open",
	"_xlnm.Auto_Close",
	"_xlnm.Extract",
	"_xlnm.Database",
	"_xlnm.Criteria",
	"_xlnm.Print_Area",
	"_xlnm.Print_Titles",
	"_xlnm.Recorder",
	"_xlnm.Data_Form",
	"_xlnm.Auto_Activate",
	"_xlnm.Auto_Deactivate",
	"_xlnm.Sheet_Title",
	"_xlnm._FilterDatabase"
];
function Co(e, t, n) {
	var r = e.l + t, i = e.read_shift(2), a = e.read_shift(1), o = e.read_shift(1), s = e.read_shift(n && n.biff == 2 ? 1 : 2), c = 0;
	(!n || n.biff >= 5) && (n.biff != 5 && (e.l += 2), c = e.read_shift(2), n.biff == 5 && (e.l += 2), e.l += 4);
	var l = va(e, o, n);
	i & 32 && (l = So[l.charCodeAt(0)]);
	var u = r - e.l;
	n && n.biff == 2 && --u;
	var d = r == e.l || s === 0 || !(u > 0) ? [] : ud(e, u, n, s);
	return {
		chKey: a,
		Name: l,
		itab: c,
		rgce: d
	};
}
function wo(e, t, n) {
	if (n.biff < 8) return To(e, t, n);
	for (var r = [], i = e.l + t, a = e.read_shift(n.biff > 8 ? 4 : 2); a-- !== 0;) r.push(Ma(e, n.biff > 8 ? 12 : 6, n));
	if (e.l != i) throw Error("Bad ExternSheet: " + e.l + " != " + i);
	return r;
}
function To(e, t, n) {
	e[e.l + 1] == 3 && e[e.l]++;
	var r = ga(e, t, n);
	return r.charCodeAt(0) == 3 ? r.slice(1) : r;
}
function Eo(e, t, n) {
	if (n.biff < 8) {
		e.l += t;
		return;
	}
	var r = e.read_shift(2), i = e.read_shift(2);
	return [va(e, r, n), va(e, i, n)];
}
function Do(e, t, n) {
	var r = Ia(e, 6);
	e.l++;
	var i = e.read_shift(1);
	return t -= 8, [
		dd(e, t, n),
		i,
		r
	];
}
function Oo(e, t, n) {
	var r = La(e, 6);
	switch (n.biff) {
		case 2:
			e.l++, t -= 7;
			break;
		case 3:
		case 4:
			e.l += 2, t -= 8;
			break;
		default: e.l += 6, t -= 12;
	}
	return [r, cd(e, t, n, r)];
}
function ko(e) {
	return [
		e.read_shift(4) !== 0,
		e.read_shift(4) !== 0,
		e.read_shift(4)
	];
}
function Ao(e, t, n) {
	if (!(n.biff < 8)) {
		var r = e.read_shift(2), i = e.read_shift(2), a = e.read_shift(2), o = e.read_shift(2), s = ba(e, 0, n);
		return n.biff < 8 && e.read_shift(1), [
			{
				r,
				c: i
			},
			s,
			o,
			a
		];
	}
}
function jo(e, t, n) {
	return Ao(e, t, n);
}
function Mo(e, t) {
	for (var n = [], r = e.read_shift(2); r--;) n.push(Fa(e, t));
	return n;
}
function No(e, t, n) {
	if (n && n.biff < 8) return Fo(e, t, n);
	var r = Ra(e, 22);
	return {
		cmo: r,
		ft: Ua(e, t - 22, r[1])
	};
}
var Po = { 8: function(e, t) {
	var n = e.l + t;
	e.l += 10;
	var r = e.read_shift(2);
	e.l += 4, e.l += 2, e.l += 2, e.l += 2, e.l += 4;
	var i = e.read_shift(1);
	return e.l += i, e.l = n, { fmt: r };
} };
function Fo(e, t, n) {
	e.l += 4;
	var r = e.read_shift(2), i = e.read_shift(2), a = e.read_shift(2);
	e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 6, t -= 36;
	var o = [];
	return o.push((Po[r] || ur)(e, t, n)), {
		cmo: [
			i,
			r,
			a
		],
		ft: o
	};
}
function Io(e, t, n) {
	var r = e.l, i = "";
	try {
		e.l += 4;
		var a = (n.lastobj || { cmo: [0, 0] }).cmo[1];
		[
			0,
			5,
			7,
			11,
			12,
			14
		].indexOf(a) == -1 ? e.l += 6 : xa(e, 6, n);
		var o = e.read_shift(2);
		e.read_shift(2), pa(e, 2);
		var s = e.read_shift(2);
		e.l += s;
		for (var c = 1; c < e.lens.length - 1; ++c) {
			if (e.l - r != e.lens[c]) throw Error("TxO: bad continue record");
			var l = e[e.l], u = va(e, e.lens[c + 1] - e.lens[c] - 1);
			if (i += u, i.length >= (l ? o : 2 * o)) break;
		}
		if (i.length !== o && i.length !== o * 2) throw Error("cchText: " + o + " != " + i.length);
		return e.l = r + t, { t: i };
	} catch {
		return e.l = r + t, { t: i };
	}
}
function Lo(e, t) {
	var n = Fa(e, 8);
	return e.l += 16, [n, Ea(e, t - 24)];
}
function Ro(e, t) {
	e.read_shift(2);
	var n = Fa(e, 8), r = e.read_shift((t - 10) / 2, "dbcs-cont");
	return r = r.replace(P, ""), [n, r];
}
function zo(e) {
	var t = [0, 0], n = e.read_shift(2);
	return t[0] = gi[n] || n, n = e.read_shift(2), t[1] = gi[n] || n, t;
}
function Bo(e) {
	for (var t = e.read_shift(2), n = []; t-- > 0;) n.push(Oa(e, 8));
	return n;
}
function Vo(e) {
	for (var t = e.read_shift(2), n = []; t-- > 0;) n.push(Oa(e, 8));
	return n;
}
function Ho(e) {
	e.l += 2;
	var t = {
		cxfs: 0,
		crc: 0
	};
	return t.cxfs = e.read_shift(2), t.crc = e.read_shift(4), t;
}
function Uo(e, t, n) {
	if (!n.cellStyles) return ur(e, t);
	var r = n && n.biff >= 12 ? 4 : 2, i = e.read_shift(r), a = e.read_shift(r), o = e.read_shift(r), s = e.read_shift(r), c = e.read_shift(2);
	r == 2 && (e.l += 2);
	var l = {
		s: i,
		e: a,
		w: o,
		ixfe: s,
		flags: c
	};
	return (n.biff >= 5 || !n.biff) && (l.level = c >> 8 & 7), l;
}
function Wo(e, t) {
	var n = {};
	return t < 32 ? n : (e.l += 16, n.header = Yr(e, 8), n.footer = Yr(e, 8), e.l += 2, n);
}
function Go(e, t, n) {
	var r = { area: !1 };
	if (n.biff != 5) return e.l += t, r;
	var i = e.read_shift(1);
	return e.l += 3, i & 16 && (r.area = !0), r;
}
var Ko = ka, qo = ma, Jo = ya;
function Yo(e) {
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(4), i = {
		fmt: t,
		env: n,
		len: r,
		data: e.slice(e.l, e.l + r)
	};
	return e.l += r, i;
}
function Xo(e, t, n) {
	n.biffguess && n.biff == 5 && (n.biff = 2);
	var r = ka(e, 6);
	++e.l;
	var i = ba(e, t - 7, n);
	return r.t = "str", r.val = i, r;
}
function Zo(e) {
	var t = ka(e, 6);
	++e.l;
	var n = Yr(e, 8);
	return t.t = "n", t.val = n, t;
}
function Qo(e) {
	var t = ka(e, 6);
	++e.l;
	var n = e.read_shift(2);
	return t.t = "n", t.val = n, t;
}
function $o(e) {
	var t = e.read_shift(1);
	return t === 0 ? (e.l++, "") : e.read_shift(t, "sbcs-cont");
}
function es(e, t) {
	e.l += 6, e.l += 2, e.l += 1, e.l += 3, e.l += 1, e.l += t - 13;
}
function ts(e, t, n) {
	var r = e.l + t, i = ka(e, 6), a = va(e, e.read_shift(2), n);
	return e.l = r, i.t = "str", i.val = a, i;
}
var ns = [
	2,
	3,
	48,
	49,
	131,
	139,
	140,
	245
], rs = /*#__PURE__*/ (function() {
	var e = {
		1: 437,
		2: 850,
		3: 1252,
		4: 1e4,
		100: 852,
		101: 866,
		102: 865,
		103: 861,
		104: 895,
		105: 620,
		106: 737,
		107: 857,
		120: 950,
		121: 949,
		122: 936,
		123: 932,
		124: 874,
		125: 1255,
		126: 1256,
		150: 10007,
		151: 10029,
		152: 10006,
		200: 1250,
		201: 1251,
		202: 1254,
		203: 1253,
		0: 20127,
		8: 865,
		9: 437,
		10: 850,
		11: 437,
		13: 437,
		14: 850,
		15: 437,
		16: 850,
		17: 437,
		18: 850,
		19: 932,
		20: 850,
		21: 437,
		22: 850,
		23: 865,
		24: 437,
		25: 437,
		26: 850,
		27: 437,
		28: 863,
		29: 850,
		31: 852,
		34: 852,
		35: 852,
		36: 860,
		37: 850,
		38: 866,
		55: 850,
		64: 852,
		77: 936,
		78: 949,
		79: 950,
		80: 874,
		87: 1252,
		88: 1252,
		89: 1252,
		108: 863,
		134: 737,
		135: 852,
		136: 857,
		204: 1257,
		255: 16969
	}, t = lt({
		1: 437,
		2: 850,
		3: 1252,
		4: 1e4,
		100: 852,
		101: 866,
		102: 865,
		103: 861,
		104: 895,
		105: 620,
		106: 737,
		107: 857,
		120: 950,
		121: 949,
		122: 936,
		123: 932,
		124: 874,
		125: 1255,
		126: 1256,
		150: 10007,
		151: 10029,
		152: 10006,
		200: 1250,
		201: 1251,
		202: 1254,
		203: 1253,
		0: 20127
	});
	function n(t, n) {
		var r = [], i = T(1);
		switch (n.type) {
			case "base64":
				i = D(S(t));
				break;
			case "binary":
				i = D(t);
				break;
			case "buffer":
			case "array":
				i = t;
				break;
		}
		lr(i, 0);
		var a = i.read_shift(1), o = !!(a & 136), s = !1, c = !1;
		switch (a) {
			case 2: break;
			case 3: break;
			case 48:
				s = !0, o = !0;
				break;
			case 49:
				s = !0, o = !0;
				break;
			case 131: break;
			case 139: break;
			case 140:
				c = !0;
				break;
			case 245: break;
			default: throw Error("DBF Unsupported Version: " + a.toString(16));
		}
		var l = 0, u = 521;
		a == 2 && (l = i.read_shift(2)), i.l += 3, a != 2 && (l = i.read_shift(4)), l > 1048576 && (l = 1e6), a != 2 && (u = i.read_shift(2));
		var d = i.read_shift(2), f = n.codepage || 1252;
		a != 2 && (i.l += 16, i.read_shift(1), i[i.l] !== 0 && (f = e[i[i.l]]), i.l += 1, i.l += 2), c && (i.l += 36);
		for (var p = [], m = {}, h = Math.min(i.length, a == 2 ? 521 : u - 10 - (s ? 264 : 0)), g = c ? 32 : 11; i.l < h && i[i.l] != 13;) switch (m = {}, m.name = _.utils.decode(f, i.slice(i.l, i.l + g)).replace(/[\u0000\r\n].*$/g, ""), i.l += g, m.type = String.fromCharCode(i.read_shift(1)), a != 2 && !c && (m.offset = i.read_shift(4)), m.len = i.read_shift(1), a == 2 && (m.offset = i.read_shift(2)), m.dec = i.read_shift(1), m.name.length && p.push(m), a != 2 && (i.l += c ? 13 : 14), m.type) {
			case "B":
				(!s || m.len != 8) && n.WTF && console.log("Skipping " + m.name + ":" + m.type);
				break;
			case "G":
			case "P":
				n.WTF && console.log("Skipping " + m.name + ":" + m.type);
				break;
			case "+":
			case "0":
			case "@":
			case "C":
			case "D":
			case "F":
			case "I":
			case "L":
			case "M":
			case "N":
			case "O":
			case "T":
			case "Y": break;
			default: throw Error("Unknown Field Type: " + m.type);
		}
		if (i[i.l] !== 13 && (i.l = u - 1), i.read_shift(1) !== 13) throw Error("DBF Terminator not found " + i.l + " " + i[i.l]);
		i.l = u;
		var v = 0, y = 0;
		for (r[0] = [], y = 0; y != p.length; ++y) r[0][y] = p[y].name;
		for (; l-- > 0;) {
			if (i[i.l] === 42) {
				i.l += d;
				continue;
			}
			for (++i.l, r[++v] = [], y = 0, y = 0; y != p.length; ++y) {
				var b = i.slice(i.l, i.l + p[y].len);
				i.l += p[y].len, lr(b, 0);
				var x = _.utils.decode(f, b);
				switch (p[y].type) {
					case "C":
						x.trim().length && (r[v][y] = x.replace(/\s+$/, ""));
						break;
					case "D":
						x.length === 8 ? r[v][y] = new Date(+x.slice(0, 4), x.slice(4, 6) - 1, +x.slice(6, 8)) : r[v][y] = x;
						break;
					case "F":
						r[v][y] = parseFloat(x.trim());
						break;
					case "+":
					case "I":
						r[v][y] = c ? b.read_shift(-4, "i") ^ 2147483648 : b.read_shift(4, "i");
						break;
					case "L":
						switch (x.trim().toUpperCase()) {
							case "Y":
							case "T":
								r[v][y] = !0;
								break;
							case "N":
							case "F":
								r[v][y] = !1;
								break;
							case "":
							case "?": break;
							default: throw Error("DBF Unrecognized L:|" + x + "|");
						}
						break;
					case "M":
						if (!o) throw Error("DBF Unexpected MEMO for type " + a.toString(16));
						r[v][y] = "##MEMO##" + (c ? parseInt(x.trim(), 10) : b.read_shift(4));
						break;
					case "N":
						x = x.replace(/\u0000/g, "").trim(), x && x != "." && (r[v][y] = +x || 0);
						break;
					case "@":
						r[v][y] = /* @__PURE__ */ new Date(b.read_shift(-8, "f") - 621356832e5);
						break;
					case "T":
						r[v][y] = new Date((b.read_shift(4) - 2440588) * 864e5 + b.read_shift(4));
						break;
					case "Y":
						r[v][y] = b.read_shift(4, "i") / 1e4 + b.read_shift(4, "i") / 1e4 * 2 ** 32;
						break;
					case "O":
						r[v][y] = -b.read_shift(-8, "f");
						break;
					case "B": if (s && p[y].len == 8) {
						r[v][y] = b.read_shift(8, "f");
						break;
					}
					case "G":
					case "P":
						b.l += p[y].len;
						break;
					case "0": if (p[y].name === "_NullFlags") break;
					default: throw Error("DBF Unsupported data type " + p[y].type);
				}
			}
		}
		if (a != 2 && i.l < i.length && i[i.l++] != 26) throw Error("DBF EOF Marker missing " + (i.l - 1) + " of " + i.length + " " + i[i.l - 1].toString(16));
		return n && n.sheetRows && (r = r.slice(0, n.sheetRows)), n.DBF = p, r;
	}
	function r(e, t) {
		var r = t || {};
		r.dateNF ||= "yyyymmdd";
		var i = Pr(n(e, r), r);
		return i["!cols"] = r.DBF.map(function(e) {
			return {
				wch: e.len,
				DBF: e
			};
		}), delete r.DBF, i;
	}
	function a(e, t) {
		try {
			return Mr(r(e, t), t);
		} catch (e) {
			if (t && t.WTF) throw e;
		}
		return {
			SheetNames: [],
			Sheets: {}
		};
	}
	var o = {
		B: 8,
		C: 250,
		L: 1,
		D: 8,
		"?": 0,
		"": 0
	};
	function s(e, n) {
		var r = n || {};
		if (+r.codepage >= 0 && l(+r.codepage), r.type == "string") throw Error("Cannot write DBF to JS string");
		var a = pr(), s = ph(e, {
			header: 1,
			raw: !0,
			cellDates: !0
		}), c = s[0], u = s.slice(1), d = e["!cols"] || [], f = 0, p = 0, m = 0, h = 1;
		for (f = 0; f < c.length; ++f) {
			if (((d[f] || {}).DBF || {}).name) {
				c[f] = d[f].DBF.name, ++m;
				continue;
			}
			if (c[f] != null) {
				if (++m, typeof c[f] == "number" && (c[f] = c[f].toString(10)), typeof c[f] != "string") throw Error("DBF Invalid column name " + c[f] + " |" + typeof c[f] + "|");
				if (c.indexOf(c[f]) !== f) {
					for (p = 0; p < 1024; ++p) if (c.indexOf(c[f] + "_" + p) == -1) {
						c[f] += "_" + p;
						break;
					}
				}
			}
		}
		var g = kr(e["!ref"]), _ = [], v = [], y = [];
		for (f = 0; f <= g.e.c - g.s.c; ++f) {
			var b = "", x = "", S = 0, C = [];
			for (p = 0; p < u.length; ++p) u[p][f] != null && C.push(u[p][f]);
			if (C.length == 0 || c[f] == null) {
				_[f] = "?";
				continue;
			}
			for (p = 0; p < C.length; ++p) {
				switch (typeof C[p]) {
					case "number":
						x = "B";
						break;
					case "string":
						x = "C";
						break;
					case "boolean":
						x = "L";
						break;
					case "object":
						x = C[p] instanceof Date ? "D" : "C";
						break;
					default: x = "C";
				}
				S = Math.max(S, String(C[p]).length), b = b && b != x ? "C" : x;
			}
			S > 250 && (S = 250), x = ((d[f] || {}).DBF || {}).type, x == "C" && d[f].DBF.len > S && (S = d[f].DBF.len), b == "B" && x == "N" && (b = "N", y[f] = d[f].DBF.dec, S = d[f].DBF.len), v[f] = b == "C" || x == "N" ? S : o[b] || 0, h += v[f], _[f] = b;
		}
		var w = a.next(32);
		for (w.write_shift(4, 318902576), w.write_shift(4, u.length), w.write_shift(2, 296 + 32 * m), w.write_shift(2, h), f = 0; f < 4; ++f) w.write_shift(4, 0);
		for (w.write_shift(4, 0 | (+t[i] || 3) << 8), f = 0, p = 0; f < c.length; ++f) if (c[f] != null) {
			var T = a.next(32), E = (c[f].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
			T.write_shift(1, E, "sbcs"), T.write_shift(1, _[f] == "?" ? "C" : _[f], "sbcs"), T.write_shift(4, p), T.write_shift(1, v[f] || o[_[f]] || 0), T.write_shift(1, y[f] || 0), T.write_shift(1, 2), T.write_shift(4, 0), T.write_shift(1, 0), T.write_shift(4, 0), T.write_shift(4, 0), p += v[f] || o[_[f]] || 0;
		}
		var D = a.next(264);
		for (D.write_shift(4, 13), f = 0; f < 65; ++f) D.write_shift(4, 0);
		for (f = 0; f < u.length; ++f) {
			var O = a.next(h);
			for (O.write_shift(1, 0), p = 0; p < c.length; ++p) if (c[p] != null) switch (_[p]) {
				case "L":
					O.write_shift(1, u[f][p] == null ? 63 : u[f][p] ? 84 : 70);
					break;
				case "B":
					O.write_shift(8, u[f][p] || 0, "f");
					break;
				case "N":
					var k = "0";
					for (typeof u[f][p] == "number" && (k = u[f][p].toFixed(y[p] || 0)), m = 0; m < v[p] - k.length; ++m) O.write_shift(1, 32);
					O.write_shift(1, k, "sbcs");
					break;
				case "D":
					u[f][p] ? (O.write_shift(4, ("0000" + u[f][p].getFullYear()).slice(-4), "sbcs"), O.write_shift(2, ("00" + (u[f][p].getMonth() + 1)).slice(-2), "sbcs"), O.write_shift(2, ("00" + u[f][p].getDate()).slice(-2), "sbcs")) : O.write_shift(8, "00000000", "sbcs");
					break;
				case "C":
					var A = String(u[f][p] == null ? "" : u[f][p]).slice(0, v[p]);
					for (O.write_shift(1, A, "sbcs"), m = 0; m < v[p] - A.length; ++m) O.write_shift(1, 32);
					break;
			}
		}
		return a.next(1).write_shift(1, 26), a.end();
	}
	return {
		to_workbook: a,
		to_sheet: r,
		from_sheet: s
	};
})(), is = /*#__PURE__*/ (function() {
	var e = {
		AA: "À",
		BA: "Á",
		CA: "Â",
		DA: 195,
		HA: "Ä",
		JA: 197,
		AE: "È",
		BE: "É",
		CE: "Ê",
		HE: "Ë",
		AI: "Ì",
		BI: "Í",
		CI: "Î",
		HI: "Ï",
		AO: "Ò",
		BO: "Ó",
		CO: "Ô",
		DO: 213,
		HO: "Ö",
		AU: "Ù",
		BU: "Ú",
		CU: "Û",
		HU: "Ü",
		Aa: "à",
		Ba: "á",
		Ca: "â",
		Da: 227,
		Ha: "ä",
		Ja: 229,
		Ae: "è",
		Be: "é",
		Ce: "ê",
		He: "ë",
		Ai: "ì",
		Bi: "í",
		Ci: "î",
		Hi: "ï",
		Ao: "ò",
		Bo: "ó",
		Co: "ô",
		Do: 245,
		Ho: "ö",
		Au: "ù",
		Bu: "ú",
		Cu: "û",
		Hu: "ü",
		KC: "Ç",
		Kc: "ç",
		q: "æ",
		z: "œ",
		a: "Æ",
		j: "Œ",
		DN: 209,
		Dn: 241,
		Hy: 255,
		S: 169,
		c: 170,
		R: 174,
		"B ": 180,
		0: 176,
		1: 177,
		2: 178,
		3: 179,
		5: 181,
		6: 182,
		7: 183,
		Q: 185,
		k: 186,
		b: 208,
		i: 216,
		l: 222,
		s: 240,
		y: 248,
		"!": 161,
		"\"": 162,
		"#": 163,
		"(": 164,
		"%": 165,
		"'": 167,
		"H ": 168,
		"+": 171,
		";": 187,
		"<": 188,
		"=": 189,
		">": 190,
		"?": 191,
		"{": 223
	}, t = RegExp("\x1BN(" + ct(e).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g, "\\$1") + "|\\|)", "gm"), n = function(t, n) {
		var r = e[n];
		return typeof r == "number" ? g(r) : r;
	}, r = function(e, t, n) {
		var r = t.charCodeAt(0) - 32 << 4 | n.charCodeAt(0) - 48;
		return r == 59 ? e : g(r);
	};
	e["|"] = 254;
	function i(e, t) {
		switch (t.type) {
			case "base64": return a(S(e), t);
			case "binary": return a(e, t);
			case "buffer": return a(C && Buffer.isBuffer(e) ? e.toString("binary") : k(e), t);
			case "array": return a(Ct(e), t);
		}
		throw Error("Unrecognized type " + t.type);
	}
	function a(e, i) {
		var a = e.split(/[\n\r]+/), o = -1, s = -1, c = 0, u = 0, d = [], f = [], p = null, m = {}, h = [], g = [], v = [], y = 0, b;
		for (+i.codepage >= 0 && l(+i.codepage); c !== a.length; ++c) {
			y = 0;
			var x = a[c].trim().replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, r).replace(t, n), S = x.replace(/;;/g, "\0").split(";").map(function(e) {
				return e.replace(/\u0000/g, ";");
			}), C = S[0], w;
			if (x.length > 0) switch (C) {
				case "ID": break;
				case "E": break;
				case "B": break;
				case "O": break;
				case "W": break;
				case "P":
					S[1].charAt(0) == "P" && f.push(x.slice(3).replace(/;;/g, ";"));
					break;
				case "C":
					var T = !1, E = !1, D = !1, O = !1, k = -1, A = -1;
					for (u = 1; u < S.length; ++u) switch (S[u].charAt(0)) {
						case "A": break;
						case "X":
							s = parseInt(S[u].slice(1)) - 1, E = !0;
							break;
						case "Y":
							for (o = parseInt(S[u].slice(1)) - 1, E || (s = 0), b = d.length; b <= o; ++b) d[b] = [];
							break;
						case "K":
							w = S[u].slice(1), w.charAt(0) === "\"" ? w = w.slice(1, w.length - 1) : w === "TRUE" ? w = !0 : w === "FALSE" ? w = !1 : isNaN(Et(w)) ? isNaN(Ot(w).getDate()) || (w = St(w)) : (w = Et(w), p !== null && We(p) && (w = _t(w))), _ !== void 0 && typeof w == "string" && (i || {}).type != "string" && (i || {}).codepage && (w = _.utils.decode(i.codepage, w)), T = !0;
							break;
						case "E":
							O = !0;
							var j = El(S[u].slice(1), {
								r: o,
								c: s
							});
							d[o][s] = [d[o][s], j];
							break;
						case "S":
							D = !0, d[o][s] = [d[o][s], "S5S"];
							break;
						case "G": break;
						case "R":
							k = parseInt(S[u].slice(1)) - 1;
							break;
						case "C":
							A = parseInt(S[u].slice(1)) - 1;
							break;
						default: if (i && i.WTF) throw Error("SYLK bad record " + x);
					}
					if (T && (d[o][s] && d[o][s].length == 2 ? d[o][s][0] = w : d[o][s] = w, p = null), D) {
						if (O) throw Error("SYLK shared formula cannot have own formula");
						var M = k > -1 && d[k][A];
						if (!M || !M[1]) throw Error("SYLK shared formula cannot find base");
						d[o][s][1] = kl(M[1], {
							r: o - k,
							c: s - A
						});
					}
					break;
				case "F":
					var N = 0;
					for (u = 1; u < S.length; ++u) switch (S[u].charAt(0)) {
						case "X":
							s = parseInt(S[u].slice(1)) - 1, ++N;
							break;
						case "Y":
							for (o = parseInt(S[u].slice(1)) - 1, b = d.length; b <= o; ++b) d[b] = [];
							break;
						case "M":
							y = parseInt(S[u].slice(1)) / 20;
							break;
						case "F": break;
						case "G": break;
						case "P":
							p = f[parseInt(S[u].slice(1))];
							break;
						case "S": break;
						case "D": break;
						case "N": break;
						case "W":
							for (v = S[u].slice(1).split(" "), b = parseInt(v[0], 10); b <= parseInt(v[1], 10); ++b) y = parseInt(v[2], 10), g[b - 1] = y === 0 ? { hidden: !0 } : { wch: y }, lc(g[b - 1]);
							break;
						case "C":
							s = parseInt(S[u].slice(1)) - 1, g[s] || (g[s] = {});
							break;
						case "R":
							o = parseInt(S[u].slice(1)) - 1, h[o] || (h[o] = {}), y > 0 ? (h[o].hpt = y, h[o].hpx = fc(y)) : y === 0 && (h[o].hidden = !0);
							break;
						default: if (i && i.WTF) throw Error("SYLK bad record " + x);
					}
					N < 1 && (p = null);
					break;
				default: if (i && i.WTF) throw Error("SYLK bad record " + x);
			}
		}
		return h.length > 0 && (m["!rows"] = h), g.length > 0 && (m["!cols"] = g), i && i.sheetRows && (d = d.slice(0, i.sheetRows)), [d, m];
	}
	function o(e, t) {
		var n = i(e, t), r = n[0], a = n[1], o = Pr(r, t);
		return ct(a).forEach(function(e) {
			o[e] = a[e];
		}), o;
	}
	function s(e, t) {
		return Mr(o(e, t), t);
	}
	function c(e, t, n, r) {
		var i = "C;Y" + (n + 1) + ";X" + (r + 1) + ";K";
		switch (e.t) {
			case "n":
				i += e.v || 0, e.f && !e.F && (i += ";E" + Ol(e.f, {
					r: n,
					c: r
				}));
				break;
			case "b":
				i += e.v ? "TRUE" : "FALSE";
				break;
			case "e":
				i += e.w || e.v;
				break;
			case "d":
				i += "\"" + (e.w || e.v) + "\"";
				break;
			case "s":
				i += "\"" + e.v.replace(/"/g, "").replace(/;/g, ";;") + "\"";
				break;
		}
		return i;
	}
	function u(e, t) {
		t.forEach(function(t, n) {
			var r = "F;W" + (n + 1) + " " + (n + 1) + " ";
			t.hidden ? r += "0" : (typeof t.width == "number" && !t.wpx && (t.wpx = ic(t.width)), typeof t.wpx == "number" && !t.wch && (t.wch = ac(t.wpx)), typeof t.wch == "number" && (r += Math.round(t.wch))), r.charAt(r.length - 1) != " " && e.push(r);
		});
	}
	function d(e, t) {
		t.forEach(function(t, n) {
			var r = "F;";
			t.hidden ? r += "M0;" : t.hpt ? r += "M" + 20 * t.hpt + ";" : t.hpx && (r += "M" + 20 * dc(t.hpx) + ";"), r.length > 2 && e.push(r + "R" + (n + 1));
		});
	}
	function f(e, t) {
		var n = ["ID;PWXL;N;E"], r = [], i = kr(e["!ref"]), a, o = Array.isArray(e), s = "\r\n";
		n.push("P;PGeneral"), n.push("F;P0;DG0G8;M255"), e["!cols"] && u(n, e["!cols"]), e["!rows"] && d(n, e["!rows"]), n.push("B;Y" + (i.e.r - i.s.r + 1) + ";X" + (i.e.c - i.s.c + 1) + ";D" + [
			i.s.c,
			i.s.r,
			i.e.c,
			i.e.r
		].join(" "));
		for (var l = i.s.r; l <= i.e.r; ++l) for (var f = i.s.c; f <= i.e.c; ++f) {
			var p = X({
				r: l,
				c: f
			});
			a = o ? (e[l] || [])[f] : e[p], !(!a || a.v == null && (!a.f || a.F)) && r.push(c(a, e, l, f, t));
		}
		return n.join(s) + s + r.join(s) + s + "E" + s;
	}
	return {
		to_workbook: s,
		to_sheet: o,
		from_sheet: f
	};
})(), as = /*#__PURE__*/ (function() {
	function e(e, n) {
		switch (n.type) {
			case "base64": return t(S(e), n);
			case "binary": return t(e, n);
			case "buffer": return t(C && Buffer.isBuffer(e) ? e.toString("binary") : k(e), n);
			case "array": return t(Ct(e), n);
		}
		throw Error("Unrecognized type " + n.type);
	}
	function t(e, t) {
		for (var n = e.split("\n"), r = -1, i = -1, a = 0, o = []; a !== n.length; ++a) {
			if (n[a].trim() === "BOT") {
				o[++r] = [], i = 0;
				continue;
			}
			if (!(r < 0)) {
				var s = n[a].trim().split(","), c = s[0], l = s[1];
				++a;
				for (var u = n[a] || ""; (u.match(/["]/g) || []).length & 1 && a < n.length - 1;) u += "\n" + n[++a];
				switch (u = u.trim(), +c) {
					case -1:
						if (u === "BOT") {
							o[++r] = [], i = 0;
							continue;
						} else if (u !== "EOD") throw Error("Unrecognized DIF special command " + u);
						break;
					case 0:
						u === "TRUE" ? o[r][i] = !0 : u === "FALSE" ? o[r][i] = !1 : isNaN(Et(l)) ? isNaN(Ot(l).getDate()) ? o[r][i] = l : o[r][i] = St(l) : o[r][i] = Et(l), ++i;
						break;
					case 1:
						u = u.slice(1, u.length - 1), u = u.replace(/""/g, "\""), y && u && u.match(/^=".*"$/) && (u = u.slice(2, -1)), o[r][i++] = u === "" ? null : u;
						break;
				}
				if (u === "EOD") break;
			}
		}
		return t && t.sheetRows && (o = o.slice(0, t.sheetRows)), o;
	}
	function n(t, n) {
		return Pr(e(t, n), n);
	}
	function r(e, t) {
		return Mr(n(e, t), t);
	}
	return {
		to_workbook: r,
		to_sheet: n,
		from_sheet: /* @__PURE__ */ (function() {
			var e = function(e, t, n, r, i) {
				e.push(t), e.push(n + "," + r), e.push("\"" + i.replace(/"/g, "\"\"") + "\"");
			}, t = function(e, t, n, r) {
				e.push(t + "," + n), e.push(t == 1 ? "\"" + r.replace(/"/g, "\"\"") + "\"" : r);
			};
			return function(n) {
				var r = [], i = kr(n["!ref"]), a, o = Array.isArray(n);
				e(r, "TABLE", 0, 1, "sheetjs"), e(r, "VECTORS", 0, i.e.r - i.s.r + 1, ""), e(r, "TUPLES", 0, i.e.c - i.s.c + 1, ""), e(r, "DATA", 0, 0, "");
				for (var s = i.s.r; s <= i.e.r; ++s) {
					t(r, -1, 0, "BOT");
					for (var c = i.s.c; c <= i.e.c; ++c) {
						var l = X({
							r: s,
							c
						});
						if (a = o ? (n[s] || [])[c] : n[l], !a) {
							t(r, 1, 0, "");
							continue;
						}
						switch (a.t) {
							case "n":
								var u = y ? a.w : a.v;
								!u && a.v != null && (u = a.v), u == null ? y && a.f && !a.F ? t(r, 1, 0, "=" + a.f) : t(r, 1, 0, "") : t(r, 0, u, "V");
								break;
							case "b":
								t(r, 0, +!!a.v, a.v ? "TRUE" : "FALSE");
								break;
							case "s":
								t(r, 1, 0, !y || isNaN(a.v) ? a.v : "=\"" + a.v + "\"");
								break;
							case "d":
								a.w ||= Ye(a.z || U[14], pt(St(a.v))), y ? t(r, 0, a.w, "V") : t(r, 1, 0, a.w);
								break;
							default: t(r, 1, 0, "");
						}
					}
				}
				return t(r, -1, 0, "EOD"), r.join("\r\n");
			};
		})()
	};
})(), os = /*#__PURE__*/ (function() {
	function e(e) {
		return e.replace(/\\b/g, "\\").replace(/\\c/g, ":").replace(/\\n/g, "\n");
	}
	function t(e) {
		return e.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n");
	}
	function n(t, n) {
		for (var r = t.split("\n"), i = -1, a = -1, o = 0, s = []; o !== r.length; ++o) {
			var c = r[o].trim().split(":");
			if (c[0] === "cell") {
				var l = Dr(c[1]);
				if (s.length <= l.r) for (i = s.length; i <= l.r; ++i) s[i] || (s[i] = []);
				switch (i = l.r, a = l.c, c[2]) {
					case "t":
						s[i][a] = e(c[3]);
						break;
					case "v":
						s[i][a] = +c[3];
						break;
					case "vtf": var u = c[c.length - 1];
					case "vtc":
						switch (c[3]) {
							case "nl":
								s[i][a] = !!+c[4];
								break;
							default:
								s[i][a] = +c[4];
								break;
						}
						c[2] == "vtf" && (s[i][a] = [s[i][a], u]);
				}
			}
		}
		return n && n.sheetRows && (s = s.slice(0, n.sheetRows)), s;
	}
	function r(e, t) {
		return Pr(n(e, t), t);
	}
	function i(e, t) {
		return Mr(r(e, t), t);
	}
	var a = [
		"socialcalc:version:1.5",
		"MIME-Version: 1.0",
		"Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"
	].join("\n"), o = ["--SocialCalcSpreadsheetControlSave", "Content-type: text/plain; charset=UTF-8"].join("\n") + "\n", s = ["# SocialCalc Spreadsheet Control Save", "part:sheet"].join("\n"), c = "--SocialCalcSpreadsheetControlSave--";
	function l(e) {
		if (!e || !e["!ref"]) return "";
		for (var n = [], r = [], i, a = "", o = Or(e["!ref"]), s = Array.isArray(e), c = o.s.r; c <= o.e.r; ++c) for (var l = o.s.c; l <= o.e.c; ++l) if (a = X({
			r: c,
			c: l
		}), i = s ? (e[c] || [])[l] : e[a], !(!i || i.v == null || i.t === "z")) {
			switch (r = [
				"cell",
				a,
				"t"
			], i.t) {
				case "s":
				case "str":
					r.push(t(i.v));
					break;
				case "n":
					i.f ? (r[2] = "vtf", r[3] = "n", r[4] = i.v, r[5] = t(i.f)) : (r[2] = "v", r[3] = i.v);
					break;
				case "b":
					r[2] = "vt" + (i.f ? "f" : "c"), r[3] = "nl", r[4] = i.v ? "1" : "0", r[5] = t(i.f || (i.v ? "TRUE" : "FALSE"));
					break;
				case "d":
					var u = pt(St(i.v));
					r[2] = "vtc", r[3] = "nd", r[4] = "" + u, r[5] = i.w || Ye(i.z || U[14], u);
					break;
				case "e": continue;
			}
			n.push(r.join(":"));
		}
		return n.push("sheet:c:" + (o.e.c - o.s.c + 1) + ":r:" + (o.e.r - o.s.r + 1) + ":tvf:1"), n.push("valueformat:1:text-wiki"), n.join("\n");
	}
	function u(e) {
		return [
			a,
			o,
			s,
			o,
			l(e),
			c
		].join("\n");
	}
	return {
		to_workbook: i,
		to_sheet: r,
		from_sheet: u
	};
})(), ss = /*#__PURE__*/ (function() {
	function e(e, t, n, r, i) {
		i.raw ? t[n][r] = e : e === "" || (e === "TRUE" ? t[n][r] = !0 : e === "FALSE" ? t[n][r] = !1 : isNaN(Et(e)) ? isNaN(Ot(e).getDate()) ? t[n][r] = e : t[n][r] = St(e) : t[n][r] = Et(e));
	}
	function t(t, n) {
		var r = n || {}, i = [];
		if (!t || t.length === 0) return i;
		for (var a = t.split(/[\r\n]/), o = a.length - 1; o >= 0 && a[o].length === 0;) --o;
		for (var s = 10, c = 0, l = 0; l <= o; ++l) c = a[l].indexOf(" "), c == -1 ? c = a[l].length : c++, s = Math.max(s, c);
		for (l = 0; l <= o; ++l) {
			i[l] = [];
			var u = 0;
			for (e(a[l].slice(0, s).trim(), i, l, u, r), u = 1; u <= (a[l].length - s) / 10 + 1; ++u) e(a[l].slice(s + (u - 1) * 10, s + u * 10).trim(), i, l, u, r);
		}
		return r.sheetRows && (i = i.slice(0, r.sheetRows)), i;
	}
	var n = {
		44: ",",
		9: "	",
		59: ";",
		124: "|"
	}, r = {
		44: 3,
		9: 2,
		59: 1,
		124: 0
	};
	function i(e) {
		for (var t = {}, i = !1, a = 0, o = 0; a < e.length; ++a) (o = e.charCodeAt(a)) == 34 ? i = !i : !i && o in n && (t[o] = (t[o] || 0) + 1);
		for (a in o = [], t) Object.prototype.hasOwnProperty.call(t, a) && o.push([t[a], a]);
		if (!o.length) for (a in t = r, t) Object.prototype.hasOwnProperty.call(t, a) && o.push([t[a], a]);
		return o.sort(function(e, t) {
			return e[0] - t[0] || r[e[1]] - r[t[1]];
		}), n[o.pop()[1]] || 44;
	}
	function a(e, t) {
		var n = t || {}, r = "";
		v != null && n.dense == null && (n.dense = v);
		var a = n.dense ? [] : {}, o = {
			s: {
				c: 0,
				r: 0
			},
			e: {
				c: 0,
				r: 0
			}
		};
		e.slice(0, 4) == "sep=" ? e.charCodeAt(5) == 13 && e.charCodeAt(6) == 10 ? (r = e.charAt(4), e = e.slice(7)) : e.charCodeAt(5) == 13 || e.charCodeAt(5) == 10 ? (r = e.charAt(4), e = e.slice(6)) : r = i(e.slice(0, 1024)) : r = n && n.FS ? n.FS : i(e.slice(0, 1024));
		var s = 0, c = 0, l = 0, u = 0, d = 0, f = r.charCodeAt(0), p = !1, m = 0, h = e.charCodeAt(0);
		e = e.replace(/\r\n/gm, "\n");
		var g = n.dateNF == null ? null : tt(n.dateNF);
		function _() {
			var t = e.slice(u, d), r = {};
			if (t.charAt(0) == "\"" && t.charAt(t.length - 1) == "\"" && (t = t.slice(1, -1).replace(/""/g, "\"")), t.length === 0) r.t = "z";
			else if (n.raw) r.t = "s", r.v = t;
			else if (t.trim().length === 0) r.t = "s", r.v = t;
			else if (t.charCodeAt(0) == 61) t.charCodeAt(1) == 34 && t.charCodeAt(t.length - 1) == 34 ? (r.t = "s", r.v = t.slice(2, -1).replace(/""/g, "\"")) : jl(t) ? (r.t = "n", r.f = t.slice(1)) : (r.t = "s", r.v = t);
			else if (t == "TRUE") r.t = "b", r.v = !0;
			else if (t == "FALSE") r.t = "b", r.v = !1;
			else if (!isNaN(l = Et(t))) r.t = "n", n.cellText !== !1 && (r.w = t), r.v = l;
			else if (!isNaN(Ot(t).getDate()) || g && t.match(g)) {
				r.z = n.dateNF || U[14];
				var i = 0;
				g && t.match(g) && (t = nt(t, n.dateNF, t.match(g) || []), i = 1), n.cellDates ? (r.t = "d", r.v = St(t, i)) : (r.t = "n", r.v = pt(St(t, i))), n.cellText !== !1 && (r.w = Ye(r.z, r.v instanceof Date ? pt(r.v) : r.v)), n.cellNF || delete r.z;
			} else r.t = "s", r.v = t;
			if (r.t == "z" || (n.dense ? (a[s] || (a[s] = []), a[s][c] = r) : a[X({
				c,
				r: s
			})] = r), u = d + 1, h = e.charCodeAt(u), o.e.c < c && (o.e.c = c), o.e.r < s && (o.e.r = s), m == f) ++c;
			else if (c = 0, ++s, n.sheetRows && n.sheetRows <= s) return !0;
		}
		outer: for (; d < e.length; ++d) switch (m = e.charCodeAt(d)) {
			case 34:
				h === 34 && (p = !p);
				break;
			case f:
			case 10:
			case 13:
				if (!p && _()) break outer;
				break;
			default: break;
		}
		return d - u > 0 && _(), a["!ref"] = Z(o), a;
	}
	function o(e, n) {
		return !(n && n.PRN) || n.FS || e.slice(0, 4) == "sep=" || e.indexOf("	") >= 0 || e.indexOf(",") >= 0 || e.indexOf(";") >= 0 ? a(e, n) : Pr(t(e, n), n);
	}
	function s(e, t) {
		var n = "", r = t.type == "string" ? [
			0,
			0,
			0,
			0
		] : Zm(e, t);
		switch (t.type) {
			case "base64":
				n = S(e);
				break;
			case "binary":
				n = e;
				break;
			case "buffer":
				n = t.codepage == 65001 ? e.toString("utf8") : t.codepage && _ !== void 0 ? _.utils.decode(t.codepage, e) : C && Buffer.isBuffer(e) ? e.toString("binary") : k(e);
				break;
			case "array":
				n = Ct(e);
				break;
			case "string":
				n = e;
				break;
			default: throw Error("Unrecognized type " + t.type);
		}
		return r[0] == 239 && r[1] == 187 && r[2] == 191 ? n = J(n.slice(3)) : t.type != "string" && t.type != "buffer" && t.codepage == 65001 ? n = J(n) : t.type == "binary" && _ !== void 0 && t.codepage && (n = _.utils.decode(t.codepage, _.utils.encode(28591, n))), n.slice(0, 19) == "socialcalc:version:" ? os.to_sheet(t.type == "string" ? n : J(n), t) : o(n, t);
	}
	function c(e, t) {
		return Mr(s(e, t), t);
	}
	function l(e) {
		for (var t = [], n = kr(e["!ref"]), r, i = Array.isArray(e), a = n.s.r; a <= n.e.r; ++a) {
			for (var o = [], s = n.s.c; s <= n.e.c; ++s) {
				var c = X({
					r: a,
					c: s
				});
				if (r = i ? (e[a] || [])[s] : e[c], !r || r.v == null) {
					o.push("          ");
					continue;
				}
				for (var l = (r.w || (jr(r), r.w) || "").slice(0, 10); l.length < 10;) l += " ";
				o.push(l + (s === 0 ? " " : ""));
			}
			t.push(o.join(""));
		}
		return t.join("\n");
	}
	return {
		to_workbook: c,
		to_sheet: s,
		from_sheet: l
	};
})();
function cs(e, t) {
	var n = t || {}, r = !!n.WTF;
	n.WTF = !0;
	try {
		var i = is.to_workbook(e, n);
		return n.WTF = r, i;
	} catch (i) {
		if (n.WTF = r, !i.message.match(/SYLK bad record ID/) && r) throw i;
		return ss.to_workbook(e, t);
	}
}
var ls = /*#__PURE__*/ (function() {
	function e(e, t, n) {
		if (e) {
			lr(e, e.l || 0);
			for (var r = n.Enum || z; e.l < e.length;) {
				var i = e.read_shift(2), a = r[i] || r[65535], o = e.read_shift(2), s = e.l + o, c = a.f && a.f(e, o, n);
				if (e.l = s, t(c, a, i)) return;
			}
		}
	}
	function t(e, t) {
		switch (t.type) {
			case "base64": return n(D(S(e)), t);
			case "binary": return n(D(e), t);
			case "buffer":
			case "array": return n(e, t);
		}
		throw "Unsupported type " + t.type;
	}
	function n(t, n) {
		if (!t) return t;
		var r = n || {};
		v != null && r.dense == null && (r.dense = v);
		var i = r.dense ? [] : {}, a = "Sheet1", o = "", s = 0, c = {}, l = [], u = [], d = {
			s: {
				r: 0,
				c: 0
			},
			e: {
				r: 0,
				c: 0
			}
		}, f = r.sheetRows || 0;
		if (t[2] == 0 && (t[3] == 8 || t[3] == 9) && t.length >= 16 && t[14] == 5 && t[15] === 108) throw Error("Unsupported Works 3 for Mac file");
		if (t[2] == 2) r.Enum = z, e(t, function(e, t, n) {
			switch (n) {
				case 0:
					r.vers = e, e >= 4096 && (r.qpro = !0);
					break;
				case 6:
					d = e;
					break;
				case 204:
					e && (o = e);
					break;
				case 222:
					o = e;
					break;
				case 15:
				case 51: r.qpro || (e[1].v = e[1].v.slice(1));
				case 13:
				case 14:
				case 16:
					n == 14 && (e[2] & 112) == 112 && (e[2] & 15) > 1 && (e[2] & 15) < 15 && (e[1].z = r.dateNF || U[14], r.cellDates && (e[1].t = "d", e[1].v = _t(e[1].v))), r.qpro && e[3] > s && (i["!ref"] = Z(d), c[a] = i, l.push(a), i = r.dense ? [] : {}, d = {
						s: {
							r: 0,
							c: 0
						},
						e: {
							r: 0,
							c: 0
						}
					}, s = e[3], a = o || "Sheet" + (s + 1), o = "");
					var u = r.dense ? (i[e[0].r] || [])[e[0].c] : i[X(e[0])];
					if (u) {
						u.t = e[1].t, u.v = e[1].v, e[1].z != null && (u.z = e[1].z), e[1].f != null && (u.f = e[1].f);
						break;
					}
					r.dense ? (i[e[0].r] || (i[e[0].r] = []), i[e[0].r][e[0].c] = e[1]) : i[X(e[0])] = e[1];
					break;
				default:
			}
		}, r);
		else if (t[2] == 26 || t[2] == 14) r.Enum = B, t[2] == 14 && (r.qpro = !0, t.l = 0), e(t, function(e, t, n) {
			switch (n) {
				case 204:
					a = e;
					break;
				case 22: e[1].v = e[1].v.slice(1);
				case 23:
				case 24:
				case 25:
				case 37:
				case 39:
				case 40:
					if (e[3] > s && (i["!ref"] = Z(d), c[a] = i, l.push(a), i = r.dense ? [] : {}, d = {
						s: {
							r: 0,
							c: 0
						},
						e: {
							r: 0,
							c: 0
						}
					}, s = e[3], a = "Sheet" + (s + 1)), f > 0 && e[0].r >= f) break;
					r.dense ? (i[e[0].r] || (i[e[0].r] = []), i[e[0].r][e[0].c] = e[1]) : i[X(e[0])] = e[1], d.e.c < e[0].c && (d.e.c = e[0].c), d.e.r < e[0].r && (d.e.r = e[0].r);
					break;
				case 27:
					e[14e3] && (u[e[14e3][0]] = e[14e3][1]);
					break;
				case 1537:
					u[e[0]] = e[1], e[0] == s && (a = e[1]);
					break;
				default: break;
			}
		}, r);
		else throw Error("Unrecognized LOTUS BOF " + t[2]);
		if (i["!ref"] = Z(d), c[o || a] = i, l.push(o || a), !u.length) return {
			SheetNames: l,
			Sheets: c
		};
		for (var p = {}, m = [], h = 0; h < u.length; ++h) c[l[h]] ? (m.push(u[h] || l[h]), p[u[h]] = c[u[h]] || c[l[h]]) : (m.push(u[h]), p[u[h]] = { "!ref": "A1" });
		return {
			SheetNames: m,
			Sheets: p
		};
	}
	function r(e, t) {
		var n = t || {};
		if (+n.codepage >= 0 && l(+n.codepage), n.type == "string") throw Error("Cannot write WK1 to JS string");
		var r = pr(), i = kr(e["!ref"]), o = Array.isArray(e), s = [];
		$p(r, 0, a(1030)), $p(r, 6, c(i));
		for (var u = Math.min(i.e.r, 8191), d = i.s.r; d <= u; ++d) for (var p = yr(d), h = i.s.c; h <= i.e.c; ++h) {
			d === i.s.r && (s[h] = Cr(h));
			var _ = s[h] + p, v = o ? (e[d] || [])[h] : e[_];
			if (!(!v || v.t == "z")) if (v.t == "n") (v.v | 0) == v.v && v.v >= -32768 && v.v <= 32767 ? $p(r, 13, m(d, h, v.v)) : $p(r, 14, g(d, h, v.v));
			else {
				var y = jr(v);
				$p(r, 15, f(d, h, y.slice(0, 239)));
			}
		}
		return $p(r, 1), r.end();
	}
	function i(e, t) {
		var n = t || {};
		if (+n.codepage >= 0 && l(+n.codepage), n.type == "string") throw Error("Cannot write WK3 to JS string");
		var r = pr();
		$p(r, 0, o(e));
		for (var i = 0, a = 0; i < e.SheetNames.length; ++i) (e.Sheets[e.SheetNames[i]] || {})["!ref"] && $p(r, 27, ee(e.SheetNames[i], a++));
		var s = 0;
		for (i = 0; i < e.SheetNames.length; ++i) {
			var c = e.Sheets[e.SheetNames[i]];
			if (!(!c || !c["!ref"])) {
				for (var u = kr(c["!ref"]), d = Array.isArray(c), f = [], p = Math.min(u.e.r, 8191), m = u.s.r; m <= p; ++m) for (var h = yr(m), g = u.s.c; g <= u.e.c; ++g) {
					m === u.s.r && (f[g] = Cr(g));
					var _ = f[g] + h, v = d ? (c[m] || [])[g] : c[_];
					if (!(!v || v.t == "z")) if (v.t == "n") $p(r, 23, A(m, g, s, v.v));
					else {
						var y = jr(v);
						$p(r, 22, E(m, g, s, y.slice(0, 239)));
					}
				}
				++s;
			}
		}
		return $p(r, 1), r.end();
	}
	function a(e) {
		var t = dr(2);
		return t.write_shift(2, e), t;
	}
	function o(e) {
		var t = dr(26);
		t.write_shift(2, 4096), t.write_shift(2, 4), t.write_shift(4, 0);
		for (var n = 0, r = 0, i = 0, a = 0; a < e.SheetNames.length; ++a) {
			var o = e.SheetNames[a], s = e.Sheets[o];
			if (!(!s || !s["!ref"])) {
				++i;
				var c = Or(s["!ref"]);
				n < c.e.r && (n = c.e.r), r < c.e.c && (r = c.e.c);
			}
		}
		return n > 8191 && (n = 8191), t.write_shift(2, n), t.write_shift(1, i), t.write_shift(1, r), t.write_shift(2, 0), t.write_shift(2, 0), t.write_shift(1, 1), t.write_shift(1, 2), t.write_shift(4, 0), t.write_shift(4, 0), t;
	}
	function s(e, t, n) {
		var r = {
			s: {
				c: 0,
				r: 0
			},
			e: {
				c: 0,
				r: 0
			}
		};
		return t == 8 && n.qpro ? (r.s.c = e.read_shift(1), e.l++, r.s.r = e.read_shift(2), r.e.c = e.read_shift(1), e.l++, r.e.r = e.read_shift(2), r) : (r.s.c = e.read_shift(2), r.s.r = e.read_shift(2), t == 12 && n.qpro && (e.l += 2), r.e.c = e.read_shift(2), r.e.r = e.read_shift(2), t == 12 && n.qpro && (e.l += 2), r.s.c == 65535 && (r.s.c = r.e.c = r.s.r = r.e.r = 0), r);
	}
	function c(e) {
		var t = dr(8);
		return t.write_shift(2, e.s.c), t.write_shift(2, e.s.r), t.write_shift(2, e.e.c), t.write_shift(2, e.e.r), t;
	}
	function u(e, t, n) {
		var r = [
			{
				c: 0,
				r: 0
			},
			{
				t: "n",
				v: 0
			},
			0,
			0
		];
		return n.qpro && n.vers != 20768 ? (r[0].c = e.read_shift(1), r[3] = e.read_shift(1), r[0].r = e.read_shift(2), e.l += 2) : (r[2] = e.read_shift(1), r[0].c = e.read_shift(2), r[0].r = e.read_shift(2)), r;
	}
	function d(e, t, n) {
		var r = e.l + t, i = u(e, t, n);
		if (i[1].t = "s", n.vers == 20768) {
			e.l++;
			var a = e.read_shift(1);
			return i[1].v = e.read_shift(a, "utf8"), i;
		}
		return n.qpro && e.l++, i[1].v = e.read_shift(r - e.l, "cstr"), i;
	}
	function f(e, t, n) {
		var r = dr(7 + n.length);
		r.write_shift(1, 255), r.write_shift(2, t), r.write_shift(2, e), r.write_shift(1, 39);
		for (var i = 0; i < r.length; ++i) {
			var a = n.charCodeAt(i);
			r.write_shift(1, a >= 128 ? 95 : a);
		}
		return r.write_shift(1, 0), r;
	}
	function p(e, t, n) {
		var r = u(e, t, n);
		return r[1].v = e.read_shift(2, "i"), r;
	}
	function m(e, t, n) {
		var r = dr(7);
		return r.write_shift(1, 255), r.write_shift(2, t), r.write_shift(2, e), r.write_shift(2, n, "i"), r;
	}
	function h(e, t, n) {
		var r = u(e, t, n);
		return r[1].v = e.read_shift(8, "f"), r;
	}
	function g(e, t, n) {
		var r = dr(13);
		return r.write_shift(1, 255), r.write_shift(2, t), r.write_shift(2, e), r.write_shift(8, n, "f"), r;
	}
	function _(e, t, n) {
		var r = e.l + t, i = u(e, t, n);
		if (i[1].v = e.read_shift(8, "f"), n.qpro) e.l = r;
		else {
			var a = e.read_shift(2);
			C(e.slice(e.l, e.l + a), i), e.l += a;
		}
		return i;
	}
	function y(e, t, n) {
		var r = t & 32768;
		return t &= -32769, t = (r ? e : 0) + (t >= 8192 ? t - 16384 : t), (r ? "" : "$") + (n ? Cr(t) : yr(t));
	}
	var b = {
		51: ["FALSE", 0],
		52: ["TRUE", 0],
		70: ["LEN", 1],
		80: ["SUM", 69],
		81: ["AVERAGEA", 69],
		82: ["COUNTA", 69],
		83: ["MINA", 69],
		84: ["MAXA", 69],
		111: ["T", 1]
	}, x = /* @__PURE__ */ ".........+.-.*./.^.=.<>.<=.>=.<.>.....&.......".split(".");
	function C(e, t) {
		lr(e, 0);
		for (var n = [], r = 0, i = "", a = "", o = "", s = ""; e.l < e.length;) {
			var c = e[e.l++];
			switch (c) {
				case 0:
					n.push(e.read_shift(8, "f"));
					break;
				case 1:
					a = y(t[0].c, e.read_shift(2), !0), i = y(t[0].r, e.read_shift(2), !1), n.push(a + i);
					break;
				case 2:
					var l = y(t[0].c, e.read_shift(2), !0), u = y(t[0].r, e.read_shift(2), !1);
					a = y(t[0].c, e.read_shift(2), !0), i = y(t[0].r, e.read_shift(2), !1), n.push(l + u + ":" + a + i);
					break;
				case 3:
					if (e.l < e.length) {
						console.error("WK1 premature formula end");
						return;
					}
					break;
				case 4:
					n.push("(" + n.pop() + ")");
					break;
				case 5:
					n.push(e.read_shift(2));
					break;
				case 6:
					for (var d = ""; c = e[e.l++];) d += String.fromCharCode(c);
					n.push("\"" + d.replace(/"/g, "\"\"") + "\"");
					break;
				case 8:
					n.push("-" + n.pop());
					break;
				case 23:
					n.push("+" + n.pop());
					break;
				case 22:
					n.push("NOT(" + n.pop() + ")");
					break;
				case 20:
				case 21:
					s = n.pop(), o = n.pop(), n.push(["AND", "OR"][c - 20] + "(" + o + "," + s + ")");
					break;
				default: if (c < 32 && x[c]) s = n.pop(), o = n.pop(), n.push(o + x[c] + s);
				else if (b[c]) {
					if (r = b[c][1], r == 69 && (r = e[e.l++]), r > n.length) {
						console.error("WK1 bad formula parse 0x" + c.toString(16) + ":|" + n.join("|") + "|");
						return;
					}
					var f = n.slice(-r);
					n.length -= r, n.push(b[c][0] + "(" + f.join(",") + ")");
				} else if (c <= 7) return console.error("WK1 invalid opcode " + c.toString(16));
				else if (c <= 24) return console.error("WK1 unsupported op " + c.toString(16));
				else if (c <= 30) return console.error("WK1 invalid opcode " + c.toString(16));
				else if (c <= 115) return console.error("WK1 unsupported function opcode " + c.toString(16));
				else return console.error("WK1 unrecognized opcode " + c.toString(16));
			}
		}
		n.length == 1 ? t[1].f = "" + n[0] : console.error("WK1 bad formula parse |" + n.join("|") + "|");
	}
	function w(e) {
		var t = [
			{
				c: 0,
				r: 0
			},
			{
				t: "n",
				v: 0
			},
			0
		];
		return t[0].r = e.read_shift(2), t[3] = e[e.l++], t[0].c = e[e.l++], t;
	}
	function T(e, t) {
		var n = w(e, t);
		return n[1].t = "s", n[1].v = e.read_shift(t - 4, "cstr"), n;
	}
	function E(e, t, n, r) {
		var i = dr(6 + r.length);
		i.write_shift(2, e), i.write_shift(1, n), i.write_shift(1, t), i.write_shift(1, 39);
		for (var a = 0; a < r.length; ++a) {
			var o = r.charCodeAt(a);
			i.write_shift(1, o >= 128 ? 95 : o);
		}
		return i.write_shift(1, 0), i;
	}
	function O(e, t) {
		var n = w(e, t);
		n[1].v = e.read_shift(2);
		var r = n[1].v >> 1;
		if (n[1].v & 1) switch (r & 7) {
			case 0:
				r = (r >> 3) * 5e3;
				break;
			case 1:
				r = (r >> 3) * 500;
				break;
			case 2:
				r = (r >> 3) / 20;
				break;
			case 3:
				r = (r >> 3) / 200;
				break;
			case 4:
				r = (r >> 3) / 2e3;
				break;
			case 5:
				r = (r >> 3) / 2e4;
				break;
			case 6:
				r = (r >> 3) / 16;
				break;
			case 7:
				r = (r >> 3) / 64;
				break;
		}
		return n[1].v = r, n;
	}
	function k(e, t) {
		var n = w(e, t), r = e.read_shift(4), i = e.read_shift(4), a = e.read_shift(2);
		if (a == 65535) return r === 0 && i === 3221225472 ? (n[1].t = "e", n[1].v = 15) : r === 0 && i === 3489660928 ? (n[1].t = "e", n[1].v = 42) : n[1].v = 0, n;
		var o = a & 32768;
		return a = (a & 32767) - 16446, n[1].v = (1 - o * 2) * (i * 2 ** (a + 32) + r * 2 ** a), n;
	}
	function A(e, t, n, r) {
		var i = dr(14);
		if (i.write_shift(2, e), i.write_shift(1, n), i.write_shift(1, t), r == 0) return i.write_shift(4, 0), i.write_shift(4, 0), i.write_shift(2, 65535), i;
		var a = 0, o = 0, s = 0, c = 0;
		return r < 0 && (a = 1, r = -r), o = Math.log2(r) | 0, r /= 2 ** (o - 31), c = r >>> 0, c & 2147483648 || (r /= 2, ++o, c = r >>> 0), r -= c, c |= 2147483648, c >>>= 0, r *= 2 ** 32, s = r >>> 0, i.write_shift(4, s), i.write_shift(4, c), o += 16383 + (a ? 32768 : 0), i.write_shift(2, o), i;
	}
	function j(e, t) {
		var n = k(e, 14);
		return e.l += t - 14, n;
	}
	function M(e, t) {
		var n = w(e, t), r = e.read_shift(4);
		return n[1].v = r >> 6, n;
	}
	function N(e, t) {
		var n = w(e, t), r = e.read_shift(8, "f");
		return n[1].v = r, n;
	}
	function P(e, t) {
		var n = N(e, 14);
		return e.l += t - 10, n;
	}
	function F(e, t) {
		return e[e.l + t - 1] == 0 ? e.read_shift(t, "cstr") : "";
	}
	function I(e, t) {
		var n = e[e.l++];
		n > t - 1 && (n = t - 1);
		for (var r = ""; r.length < n;) r += String.fromCharCode(e[e.l++]);
		return r;
	}
	function L(e, t, n) {
		if (!(!n.qpro || t < 21)) {
			var r = e.read_shift(1);
			return e.l += 17, e.l += 1, e.l += 2, [r, e.read_shift(t - 21, "cstr")];
		}
	}
	function R(e, t) {
		for (var n = {}, r = e.l + t; e.l < r;) {
			var i = e.read_shift(2);
			if (i == 14e3) {
				for (n[i] = [0, ""], n[i][0] = e.read_shift(2); e[e.l];) n[i][1] += String.fromCharCode(e[e.l]), e.l++;
				e.l++;
			}
		}
		return n;
	}
	function ee(e, t) {
		var n = dr(5 + e.length);
		n.write_shift(2, 14e3), n.write_shift(2, t);
		for (var r = 0; r < e.length; ++r) {
			var i = e.charCodeAt(r);
			n[n.l++] = i > 127 ? 95 : i;
		}
		return n[n.l++] = 0, n;
	}
	var z = {
		0: {
			n: "BOF",
			f: pa
		},
		1: { n: "EOF" },
		2: { n: "CALCMODE" },
		3: { n: "CALCORDER" },
		4: { n: "SPLIT" },
		5: { n: "SYNC" },
		6: {
			n: "RANGE",
			f: s
		},
		7: { n: "WINDOW1" },
		8: { n: "COLW1" },
		9: { n: "WINTWO" },
		10: { n: "COLW2" },
		11: { n: "NAME" },
		12: { n: "BLANK" },
		13: {
			n: "INTEGER",
			f: p
		},
		14: {
			n: "NUMBER",
			f: h
		},
		15: {
			n: "LABEL",
			f: d
		},
		16: {
			n: "FORMULA",
			f: _
		},
		24: { n: "TABLE" },
		25: { n: "ORANGE" },
		26: { n: "PRANGE" },
		27: { n: "SRANGE" },
		28: { n: "FRANGE" },
		29: { n: "KRANGE1" },
		32: { n: "HRANGE" },
		35: { n: "KRANGE2" },
		36: { n: "PROTEC" },
		37: { n: "FOOTER" },
		38: { n: "HEADER" },
		39: { n: "SETUP" },
		40: { n: "MARGINS" },
		41: { n: "LABELFMT" },
		42: { n: "TITLES" },
		43: { n: "SHEETJS" },
		45: { n: "GRAPH" },
		46: { n: "NGRAPH" },
		47: { n: "CALCCOUNT" },
		48: { n: "UNFORMATTED" },
		49: { n: "CURSORW12" },
		50: { n: "WINDOW" },
		51: {
			n: "STRING",
			f: d
		},
		55: { n: "PASSWORD" },
		56: { n: "LOCKED" },
		60: { n: "QUERY" },
		61: { n: "QUERYNAME" },
		62: { n: "PRINT" },
		63: { n: "PRINTNAME" },
		64: { n: "GRAPH2" },
		65: { n: "GRAPHNAME" },
		66: { n: "ZOOM" },
		67: { n: "SYMSPLIT" },
		68: { n: "NSROWS" },
		69: { n: "NSCOLS" },
		70: { n: "RULER" },
		71: { n: "NNAME" },
		72: { n: "ACOMM" },
		73: { n: "AMACRO" },
		74: { n: "PARSE" },
		102: { n: "PRANGES??" },
		103: { n: "RRANGES??" },
		104: { n: "FNAME??" },
		105: { n: "MRANGES??" },
		204: {
			n: "SHEETNAMECS",
			f: F
		},
		222: {
			n: "SHEETNAMELP",
			f: I
		},
		65535: { n: "" }
	}, B = {
		0: { n: "BOF" },
		1: { n: "EOF" },
		2: { n: "PASSWORD" },
		3: { n: "CALCSET" },
		4: { n: "WINDOWSET" },
		5: { n: "SHEETCELLPTR" },
		6: { n: "SHEETLAYOUT" },
		7: { n: "COLUMNWIDTH" },
		8: { n: "HIDDENCOLUMN" },
		9: { n: "USERRANGE" },
		10: { n: "SYSTEMRANGE" },
		11: { n: "ZEROFORCE" },
		12: { n: "SORTKEYDIR" },
		13: { n: "FILESEAL" },
		14: { n: "DATAFILLNUMS" },
		15: { n: "PRINTMAIN" },
		16: { n: "PRINTSTRING" },
		17: { n: "GRAPHMAIN" },
		18: { n: "GRAPHSTRING" },
		19: { n: "??" },
		20: { n: "ERRCELL" },
		21: { n: "NACELL" },
		22: {
			n: "LABEL16",
			f: T
		},
		23: {
			n: "NUMBER17",
			f: k
		},
		24: {
			n: "NUMBER18",
			f: O
		},
		25: {
			n: "FORMULA19",
			f: j
		},
		26: { n: "FORMULA1A" },
		27: {
			n: "XFORMAT",
			f: R
		},
		28: { n: "DTLABELMISC" },
		29: { n: "DTLABELCELL" },
		30: { n: "GRAPHWINDOW" },
		31: { n: "CPA" },
		32: { n: "LPLAUTO" },
		33: { n: "QUERY" },
		34: { n: "HIDDENSHEET" },
		35: { n: "??" },
		37: {
			n: "NUMBER25",
			f: M
		},
		38: { n: "??" },
		39: {
			n: "NUMBER27",
			f: N
		},
		40: {
			n: "FORMULA28",
			f: P
		},
		142: { n: "??" },
		147: { n: "??" },
		150: { n: "??" },
		151: { n: "??" },
		152: { n: "??" },
		153: { n: "??" },
		154: { n: "??" },
		155: { n: "??" },
		156: { n: "??" },
		163: { n: "??" },
		174: { n: "??" },
		175: { n: "??" },
		176: { n: "??" },
		177: { n: "??" },
		184: { n: "??" },
		185: { n: "??" },
		186: { n: "??" },
		187: { n: "??" },
		188: { n: "??" },
		195: { n: "??" },
		201: { n: "??" },
		204: {
			n: "SHEETNAMECS",
			f: F
		},
		205: { n: "??" },
		206: { n: "??" },
		207: { n: "??" },
		208: { n: "??" },
		256: { n: "??" },
		259: { n: "??" },
		260: { n: "??" },
		261: { n: "??" },
		262: { n: "??" },
		263: { n: "??" },
		265: { n: "??" },
		266: { n: "??" },
		267: { n: "??" },
		268: { n: "??" },
		270: { n: "??" },
		271: { n: "??" },
		384: { n: "??" },
		389: { n: "??" },
		390: { n: "??" },
		393: { n: "??" },
		396: { n: "??" },
		512: { n: "??" },
		514: { n: "??" },
		513: { n: "??" },
		516: { n: "??" },
		517: { n: "??" },
		640: { n: "??" },
		641: { n: "??" },
		642: { n: "??" },
		643: { n: "??" },
		644: { n: "??" },
		645: { n: "??" },
		646: { n: "??" },
		647: { n: "??" },
		648: { n: "??" },
		658: { n: "??" },
		659: { n: "??" },
		660: { n: "??" },
		661: { n: "??" },
		662: { n: "??" },
		665: { n: "??" },
		666: { n: "??" },
		768: { n: "??" },
		772: { n: "??" },
		1537: {
			n: "SHEETINFOQP",
			f: L
		},
		1600: { n: "??" },
		1602: { n: "??" },
		1793: { n: "??" },
		1794: { n: "??" },
		1795: { n: "??" },
		1796: { n: "??" },
		1920: { n: "??" },
		2048: { n: "??" },
		2049: { n: "??" },
		2052: { n: "??" },
		2688: { n: "??" },
		10998: { n: "??" },
		12849: { n: "??" },
		28233: { n: "??" },
		28484: { n: "??" },
		65535: { n: "" }
	};
	return {
		sheet_to_wk1: r,
		book_to_wk3: i,
		to_workbook: t
	};
})();
function us(e) {
	var t = {}, n = e.match(Kt), r = 0, i = !1;
	if (n) for (; r != n.length; ++r) {
		var a = K(n[r]);
		switch (a[0].replace(/\w*:/g, "")) {
			case "<condense": break;
			case "<extend": break;
			case "<shadow": if (!a.val) break;
			case "<shadow>":
			case "<shadow/>":
				t.shadow = 1;
				break;
			case "</shadow>": break;
			case "<charset":
				if (a.val == "1") break;
				t.cp = o[parseInt(a.val, 10)];
				break;
			case "<outline": if (!a.val) break;
			case "<outline>":
			case "<outline/>":
				t.outline = 1;
				break;
			case "</outline>": break;
			case "<rFont":
				t.name = a.val;
				break;
			case "<sz":
				t.sz = a.val;
				break;
			case "<strike": if (!a.val) break;
			case "<strike>":
			case "<strike/>":
				t.strike = 1;
				break;
			case "</strike>": break;
			case "<u":
				if (!a.val) break;
				switch (a.val) {
					case "double":
						t.uval = "double";
						break;
					case "singleAccounting":
						t.uval = "single-accounting";
						break;
					case "doubleAccounting":
						t.uval = "double-accounting";
						break;
				}
			case "<u>":
			case "<u/>":
				t.u = 1;
				break;
			case "</u>": break;
			case "<b": if (a.val == "0") break;
			case "<b>":
			case "<b/>":
				t.b = 1;
				break;
			case "</b>": break;
			case "<i": if (a.val == "0") break;
			case "<i>":
			case "<i/>":
				t.i = 1;
				break;
			case "</i>": break;
			case "<color":
				a.rgb && (t.color = a.rgb.slice(2, 8));
				break;
			case "<color>":
			case "<color/>":
			case "</color>": break;
			case "<family":
				t.family = a.val;
				break;
			case "<family>":
			case "<family/>":
			case "</family>": break;
			case "<vertAlign":
				t.valign = a.val;
				break;
			case "<vertAlign>":
			case "<vertAlign/>":
			case "</vertAlign>": break;
			case "<scheme": break;
			case "<scheme>":
			case "<scheme/>":
			case "</scheme>": break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>": break;
			case "<ext":
				i = !0;
				break;
			case "</ext>":
				i = !1;
				break;
			default: if (a[0].charCodeAt(1) !== 47 && !i) throw Error("Unrecognized rich format " + a[0]);
		}
	}
	return t;
}
var ds = /*#__PURE__*/ (function() {
	var e = dn("t"), t = dn("rPr");
	function n(n) {
		var r = n.match(e);
		if (!r) return {
			t: "s",
			v: ""
		};
		var i = {
			t: "s",
			v: q(r[1])
		}, a = n.match(t);
		return a && (i.s = us(a[1])), i;
	}
	var r = /<(?:\w+:)?r>/g, i = /<\/(?:\w+:)?r>/;
	return function(e) {
		return e.replace(r, "").split(i).map(n).filter(function(e) {
			return e.v;
		});
	};
})(), fs = /*#__PURE__*/ (function() {
	var e = /(\r\n|\n)/g;
	function t(e, t, n) {
		var r = [];
		e.u && r.push("text-decoration: underline;"), e.uval && r.push("text-underline-style:" + e.uval + ";"), e.sz && r.push("font-size:" + e.sz + "pt;"), e.outline && r.push("text-effect: outline;"), e.shadow && r.push("text-shadow: auto;"), t.push("<span style=\"" + r.join("") + "\">"), e.b && (t.push("<b>"), n.push("</b>")), e.i && (t.push("<i>"), n.push("</i>")), e.strike && (t.push("<s>"), n.push("</s>"));
		var i = e.valign || "";
		return i == "superscript" || i == "super" ? i = "sup" : i == "subscript" && (i = "sub"), i != "" && (t.push("<" + i + ">"), n.push("</" + i + ">")), n.push("</span>"), e;
	}
	function n(n) {
		var r = [
			[],
			n.v,
			[]
		];
		return n.v ? (n.s && t(n.s, r[0], r[2]), r[0].join("") + r[1].replace(e, "<br/>") + r[2].join("")) : "";
	}
	return function(e) {
		return e.map(n).join("");
	};
})(), ps = /<(?:\w+:)?t[^>]*>([^<]*)<\/(?:\w+:)?t>/g, ms = /<(?:\w+:)?r>/, hs = /<(?:\w+:)?rPh.*?>([\s\S]*?)<\/(?:\w+:)?rPh>/g;
function gs(e, t) {
	var n = !t || t.cellHTML, r = {};
	return e ? (e.match(/^\s*<(?:\w+:)?t[^>]*>/) ? (r.t = q(J(e.slice(e.indexOf(">") + 1).split(/<\/(?:\w+:)?t>/)[0] || "")), r.r = J(e), n && (r.h = nn(r.t))) : e.match(ms) && (r.r = J(e), r.t = q(J((e.replace(hs, "").match(ps) || []).join("").replace(Kt, ""))), n && (r.h = fs(ds(r.r)))), r) : { t: "" };
}
var _s = /<(?:\w+:)?sst([^>]*)>([\s\S]*)<\/(?:\w+:)?sst>/, vs = /<(?:\w+:)?(?:si|sstItem)>/g, ys = /<\/(?:\w+:)?(?:si|sstItem)>/;
function bs(e, t) {
	var n = [], r = "";
	if (!e) return n;
	var i = e.match(_s);
	if (i) {
		r = i[2].replace(vs, "").split(ys);
		for (var a = 0; a != r.length; ++a) {
			var o = gs(r[a].trim(), t);
			o != null && (n[n.length] = o);
		}
		i = K(i[1]), n.Count = i.count, n.Unique = i.uniqueCount;
	}
	return n;
}
var xs = /^\s|\s$|[\t\n\r]/;
function Ss(e, t) {
	if (!t.bookSST) return "";
	var n = [Ut];
	n[n.length] = Y("sst", null, {
		xmlns: Tn[0],
		count: e.Count,
		uniqueCount: e.Unique
	});
	for (var r = 0; r != e.length; ++r) if (e[r] != null) {
		var i = e[r], a = "<si>";
		i.r ? a += i.r : (a += "<t", i.t ||= "", i.t.match(xs) && (a += " xml:space=\"preserve\""), a += ">" + en(i.t) + "</t>"), a += "</si>", n[n.length] = a;
	}
	return n.length > 2 && (n[n.length] = "</sst>", n[1] = n[1].replace("/>", ">")), n.join("");
}
function Cs(e) {
	return [e.read_shift(4), e.read_shift(4)];
}
function ws(e, t) {
	var n = [], r = !1;
	return fr(e, function(e, i, a) {
		switch (a) {
			case 159:
				n.Count = e[0], n.Unique = e[1];
				break;
			case 19:
				n.push(e);
				break;
			case 160: return !0;
			case 35:
				r = !0;
				break;
			case 36:
				r = !1;
				break;
			default: if (i.T, !r || t.WTF) throw Error("Unexpected record 0x" + a.toString(16));
		}
	}), n;
}
function Ts(e) {
	if (_ !== void 0) return _.utils.encode(i, e);
	for (var t = [], n = e.split(""), r = 0; r < n.length; ++r) t[r] = n[r].charCodeAt(0);
	return t;
}
function Es(e, t) {
	var n = {};
	return n.Major = e.read_shift(2), n.Minor = e.read_shift(2), t >= 4 && (e.l += t - 4), n;
}
function Ds(e) {
	var t = {};
	return t.id = e.read_shift(0, "lpp4"), t.R = Es(e, 4), t.U = Es(e, 4), t.W = Es(e, 4), t;
}
function Os(e) {
	for (var t = e.read_shift(4), n = e.l + t - 4, r = {}, i = e.read_shift(4), a = []; i-- > 0;) a.push({
		t: e.read_shift(4),
		v: e.read_shift(0, "lpp4")
	});
	if (r.name = e.read_shift(0, "lpp4"), r.comps = a, e.l != n) throw Error("Bad DataSpaceMapEntry: " + e.l + " != " + n);
	return r;
}
function ks(e) {
	var t = [];
	e.l += 4;
	for (var n = e.read_shift(4); n-- > 0;) t.push(Os(e));
	return t;
}
function As(e) {
	var t = [];
	e.l += 4;
	for (var n = e.read_shift(4); n-- > 0;) t.push(e.read_shift(0, "lpp4"));
	return t;
}
function js(e) {
	var t = {};
	return e.read_shift(4), e.l += 4, t.id = e.read_shift(0, "lpp4"), t.name = e.read_shift(0, "lpp4"), t.R = Es(e, 4), t.U = Es(e, 4), t.W = Es(e, 4), t;
}
function Ms(e) {
	var t = js(e);
	if (t.ename = e.read_shift(0, "8lpp4"), t.blksz = e.read_shift(4), t.cmode = e.read_shift(4), e.read_shift(4) != 4) throw Error("Bad !Primary record");
	return t;
}
function Ns(e, t) {
	var n = e.l + t, r = {};
	r.Flags = e.read_shift(4) & 63, e.l += 4, r.AlgID = e.read_shift(4);
	var i = !1;
	switch (r.AlgID) {
		case 26126:
		case 26127:
		case 26128:
			i = r.Flags == 36;
			break;
		case 26625:
			i = r.Flags == 4;
			break;
		case 0:
			i = r.Flags == 16 || r.Flags == 4 || r.Flags == 36;
			break;
		default: throw "Unrecognized encryption algorithm: " + r.AlgID;
	}
	if (!i) throw Error("Encryption Flags/AlgID mismatch");
	return r.AlgIDHash = e.read_shift(4), r.KeySize = e.read_shift(4), r.ProviderType = e.read_shift(4), e.l += 8, r.CSPName = e.read_shift(n - e.l >> 1, "utf16le"), e.l = n, r;
}
function Ps(e, t) {
	var n = {}, r = e.l + t;
	return e.l += 4, n.Salt = e.slice(e.l, e.l + 16), e.l += 16, n.Verifier = e.slice(e.l, e.l + 16), e.l += 16, e.read_shift(4), n.VerifierHash = e.slice(e.l, r), e.l = r, n;
}
function Fs(e) {
	var t = Es(e);
	switch (t.Minor) {
		case 2: return [t.Minor, Is(e, t)];
		case 3: return [t.Minor, Ls(e, t)];
		case 4: return [t.Minor, Rs(e, t)];
	}
	throw Error("ECMA-376 Encrypted file unrecognized Version: " + t.Minor);
}
function Is(e) {
	if ((e.read_shift(4) & 63) != 36) throw Error("EncryptionInfo mismatch");
	return {
		t: "Std",
		h: Ns(e, e.read_shift(4)),
		v: Ps(e, e.length - e.l)
	};
}
function Ls() {
	throw Error("File is password-protected: ECMA-376 Extensible");
}
function Rs(e) {
	var t = [
		"saltSize",
		"blockSize",
		"keyBits",
		"hashSize",
		"cipherAlgorithm",
		"cipherChaining",
		"hashAlgorithm",
		"saltValue"
	];
	e.l += 4;
	var n = e.read_shift(e.length - e.l, "utf8"), r = {};
	return n.replace(Kt, function(e) {
		var n = K(e);
		switch (Yt(n[0])) {
			case "<?xml": break;
			case "<encryption":
			case "</encryption>": break;
			case "<keyData":
				t.forEach(function(e) {
					r[e] = n[e];
				});
				break;
			case "<dataIntegrity":
				r.encryptedHmacKey = n.encryptedHmacKey, r.encryptedHmacValue = n.encryptedHmacValue;
				break;
			case "<keyEncryptors>":
			case "<keyEncryptors":
				r.encs = [];
				break;
			case "</keyEncryptors>": break;
			case "<keyEncryptor":
				r.uri = n.uri;
				break;
			case "</keyEncryptor>": break;
			case "<encryptedKey":
				r.encs.push(n);
				break;
			default: throw n[0];
		}
	}), r;
}
function zs(e, t) {
	var n = {}, r = n.EncryptionVersionInfo = Es(e, 4);
	if (t -= 4, r.Minor != 2) throw Error("unrecognized minor version code: " + r.Minor);
	if (r.Major > 4 || r.Major < 2) throw Error("unrecognized major version code: " + r.Major);
	n.Flags = e.read_shift(4), t -= 4;
	var i = e.read_shift(4);
	return t -= 4, n.EncryptionHeader = Ns(e, i), t -= i, n.EncryptionVerifier = Ps(e, t), n;
}
function Bs(e) {
	var t = {}, n = t.EncryptionVersionInfo = Es(e, 4);
	if (n.Major != 1 || n.Minor != 1) throw "unrecognized version code " + n.Major + " : " + n.Minor;
	return t.Salt = e.read_shift(16), t.EncryptedVerifier = e.read_shift(16), t.EncryptedVerifierHash = e.read_shift(16), t;
}
function Vs(e) {
	var t = 0, n, r = Ts(e), i = r.length + 1, a, o, s, c, l;
	for (n = T(i), n[0] = r.length, a = 1; a != i; ++a) n[a] = r[a - 1];
	for (a = i - 1; a >= 0; --a) o = n[a], s = t & 16384 ? 1 : 0, c = t << 1 & 32767, l = s | c, t = l ^ o;
	return t ^ 52811;
}
var Hs = /*#__PURE__*/ (function() {
	var e = [
		187,
		255,
		255,
		186,
		255,
		255,
		185,
		128,
		0,
		190,
		15,
		0,
		191,
		15,
		0
	], t = [
		57840,
		7439,
		52380,
		33984,
		4364,
		3600,
		61902,
		12606,
		6258,
		57657,
		54287,
		34041,
		10252,
		43370,
		20163
	], n = [
		44796,
		19929,
		39858,
		10053,
		20106,
		40212,
		10761,
		31585,
		63170,
		64933,
		60267,
		50935,
		40399,
		11199,
		17763,
		35526,
		1453,
		2906,
		5812,
		11624,
		23248,
		885,
		1770,
		3540,
		7080,
		14160,
		28320,
		56640,
		55369,
		41139,
		20807,
		41614,
		21821,
		43642,
		17621,
		28485,
		56970,
		44341,
		19019,
		38038,
		14605,
		29210,
		60195,
		50791,
		40175,
		10751,
		21502,
		43004,
		24537,
		18387,
		36774,
		3949,
		7898,
		15796,
		31592,
		63184,
		47201,
		24803,
		49606,
		37805,
		14203,
		28406,
		56812,
		17824,
		35648,
		1697,
		3394,
		6788,
		13576,
		27152,
		43601,
		17539,
		35078,
		557,
		1114,
		2228,
		4456,
		30388,
		60776,
		51953,
		34243,
		7079,
		14158,
		28316,
		14128,
		28256,
		56512,
		43425,
		17251,
		34502,
		7597,
		13105,
		26210,
		52420,
		35241,
		883,
		1766,
		3532,
		4129,
		8258,
		16516,
		33032,
		4657,
		9314,
		18628
	], r = function(e) {
		return (e / 2 | e * 128) & 255;
	}, i = function(e, t) {
		return r(e ^ t);
	}, a = function(e) {
		for (var r = t[e.length - 1], i = 104, a = e.length - 1; a >= 0; --a) for (var o = e[a], s = 0; s != 7; ++s) o & 64 && (r ^= n[i]), o *= 2, --i;
		return r;
	};
	return function(t) {
		for (var n = Ts(t), r = a(n), o = n.length, s = T(16), c = 0; c != 16; ++c) s[c] = 0;
		var l, u, d;
		for ((o & 1) == 1 && (l = r >> 8, s[o] = i(e[0], l), --o, l = r & 255, u = n[n.length - 1], s[o] = i(u, l)); o > 0;) --o, l = r >> 8, s[o] = i(n[o], l), --o, l = r & 255, s[o] = i(n[o], l);
		for (o = 15, d = 15 - n.length; d > 0;) l = r >> 8, s[o] = i(e[d], l), --o, --d, l = r & 255, s[o] = i(n[o], l), --o, --d;
		return s;
	};
})(), Us = function(e, t, n, r, i) {
	i ||= t, r ||= Hs(e);
	var a, o;
	for (a = 0; a != t.length; ++a) o = t[a], o ^= r[n], o = (o >> 5 | o << 3) & 255, i[a] = o, ++n;
	return [
		i,
		n,
		r
	];
}, Ws = function(e) {
	var t = 0, n = Hs(e);
	return function(e) {
		var r = Us("", e, t, n);
		return t = r[1], r[0];
	};
};
function Gs(e, t, n, r) {
	var i = {
		key: pa(e),
		verificationBytes: pa(e)
	};
	return n.password && (i.verifier = Vs(n.password)), r.valid = i.verificationBytes === i.verifier, r.valid && (r.insitu = Ws(n.password)), i;
}
function Ks(e, t, n) {
	var r = n || {};
	return r.Info = e.read_shift(2), e.l -= 2, r.Info === 1 ? r.Data = Bs(e, t) : r.Data = zs(e, t), r;
}
function qs(e, t, n) {
	var r = { Type: n.biff >= 8 ? e.read_shift(2) : 0 };
	return r.Type ? Ks(e, t - 2, r) : Gs(e, n.biff >= 8 ? t : t - 2, n, r), r;
}
var Js = /*#__PURE__*/ (function() {
	function e(e, n) {
		switch (n.type) {
			case "base64": return t(S(e), n);
			case "binary": return t(e, n);
			case "buffer": return t(C && Buffer.isBuffer(e) ? e.toString("binary") : k(e), n);
			case "array": return t(Ct(e), n);
		}
		throw Error("Unrecognized type " + n.type);
	}
	function t(e, t) {
		var n = (t || {}).dense ? [] : {}, r = e.match(/\\trowd.*?\\row\b/g);
		if (!r.length) throw Error("RTF missing table");
		var i = {
			s: {
				c: 0,
				r: 0
			},
			e: {
				c: 0,
				r: r.length - 1
			}
		};
		return r.forEach(function(e, t) {
			Array.isArray(n) && (n[t] = []);
			for (var r = /\\\w+\b/g, a = 0, o, s = -1; o = r.exec(e);) {
				switch (o[0]) {
					case "\\cell":
						var c = e.slice(a, r.lastIndex - o[0].length);
						if (c[0] == " " && (c = c.slice(1)), ++s, c.length) {
							var l = {
								v: c,
								t: "s"
							};
							Array.isArray(n) ? n[t][s] = l : n[X({
								r: t,
								c: s
							})] = l;
						}
						break;
				}
				a = r.lastIndex;
			}
			s > i.e.c && (i.e.c = s);
		}), n["!ref"] = Z(i), n;
	}
	function n(t, n) {
		return Mr(e(t, n), n);
	}
	function r(e) {
		for (var t = ["{\\rtf1\\ansi"], n = kr(e["!ref"]), r, i = Array.isArray(e), a = n.s.r; a <= n.e.r; ++a) {
			t.push("\\trowd\\trautofit1");
			for (var o = n.s.c; o <= n.e.c; ++o) t.push("\\cellx" + (o + 1));
			for (t.push("\\pard\\intbl"), o = n.s.c; o <= n.e.c; ++o) {
				var s = X({
					r: a,
					c: o
				});
				r = i ? (e[a] || [])[o] : e[s], !(!r || r.v == null && (!r.f || r.F)) && (t.push(" " + (r.w || (jr(r), r.w))), t.push("\\cell"));
			}
			t.push("\\pard\\intbl\\row");
		}
		return t.join("") + "}";
	}
	return {
		to_workbook: n,
		to_sheet: e,
		from_sheet: r
	};
})();
function Ys(e) {
	var t = e.slice(+(e[0] === "#")).slice(0, 6);
	return [
		parseInt(t.slice(0, 2), 16),
		parseInt(t.slice(2, 4), 16),
		parseInt(t.slice(4, 6), 16)
	];
}
function Xs(e) {
	for (var t = 0, n = 1; t != 3; ++t) n = n * 256 + (e[t] > 255 ? 255 : e[t] < 0 ? 0 : e[t]);
	return n.toString(16).toUpperCase().slice(1);
}
function Zs(e) {
	var t = e[0] / 255, n = e[1] / 255, r = e[2] / 255, i = Math.max(t, n, r), a = Math.min(t, n, r), o = i - a;
	if (o === 0) return [
		0,
		0,
		t
	];
	var s = 0, c = 0, l = i + a;
	switch (c = o / (l > 1 ? 2 - l : l), i) {
		case t:
			s = ((n - r) / o + 6) % 6;
			break;
		case n:
			s = (r - t) / o + 2;
			break;
		case r:
			s = (t - n) / o + 4;
			break;
	}
	return [
		s / 6,
		c,
		l / 2
	];
}
function Qs(e) {
	var t = e[0], n = e[1], r = e[2], i = n * 2 * (r < .5 ? r : 1 - r), a = r - i / 2, o = [
		a,
		a,
		a
	], s = 6 * t, c;
	if (n !== 0) switch (s | 0) {
		case 0:
		case 6:
			c = i * s, o[0] += i, o[1] += c;
			break;
		case 1:
			c = i * (2 - s), o[0] += c, o[1] += i;
			break;
		case 2:
			c = i * (s - 2), o[1] += i, o[2] += c;
			break;
		case 3:
			c = i * (4 - s), o[1] += c, o[2] += i;
			break;
		case 4:
			c = i * (s - 4), o[2] += i, o[0] += c;
			break;
		case 5:
			c = i * (6 - s), o[2] += c, o[0] += i;
			break;
	}
	for (var l = 0; l != 3; ++l) o[l] = Math.round(o[l] * 255);
	return o;
}
function $s(e, t) {
	if (t === 0) return e;
	var n = Zs(Ys(e));
	return t < 0 ? n[2] *= 1 + t : n[2] = 1 - (1 - n[2]) * (1 - t), Xs(Qs(n));
}
var ec = 6, tc = 15, nc = 1, rc = ec;
function ic(e) {
	return Math.floor((e + Math.round(128 / rc) / 256) * rc);
}
function ac(e) {
	return Math.floor((e - 5) / rc * 100 + .5) / 100;
}
function oc(e) {
	return Math.round((e * rc + 5) / rc * 256) / 256;
}
function sc(e) {
	return oc(ac(ic(e)));
}
function cc(e) {
	var t = Math.abs(e - sc(e)), n = rc;
	if (t > .005) for (rc = nc; rc < tc; ++rc) Math.abs(e - sc(e)) <= t && (t = Math.abs(e - sc(e)), n = rc);
	rc = n;
}
function lc(e) {
	e.width ? (e.wpx = ic(e.width), e.wch = ac(e.wpx), e.MDW = rc) : e.wpx ? (e.wch = ac(e.wpx), e.width = oc(e.wch), e.MDW = rc) : typeof e.wch == "number" && (e.width = oc(e.wch), e.wpx = ic(e.width), e.MDW = rc), e.customWidth && delete e.customWidth;
}
var uc = 96;
function dc(e) {
	return e * 96 / uc;
}
function fc(e) {
	return e * uc / 96;
}
var pc = {
	None: "none",
	Solid: "solid",
	Gray50: "mediumGray",
	Gray75: "darkGray",
	Gray25: "lightGray",
	HorzStripe: "darkHorizontal",
	VertStripe: "darkVertical",
	ReverseDiagStripe: "darkDown",
	DiagStripe: "darkUp",
	DiagCross: "darkGrid",
	ThickDiagCross: "darkTrellis",
	ThinHorzStripe: "lightHorizontal",
	ThinVertStripe: "lightVertical",
	ThinReverseDiagStripe: "lightDown",
	ThinHorzCross: "lightGrid"
};
function mc(e, t, n, r) {
	t.Borders = [];
	var i = {}, a = !1;
	(e[0].match(Kt) || []).forEach(function(e) {
		var n = K(e);
		switch (Yt(n[0])) {
			case "<borders":
			case "<borders>":
			case "</borders>": break;
			case "<border":
			case "<border>":
			case "<border/>":
				i = {}, n.diagonalUp && (i.diagonalUp = an(n.diagonalUp)), n.diagonalDown && (i.diagonalDown = an(n.diagonalDown)), t.Borders.push(i);
				break;
			case "</border>": break;
			case "<left/>": break;
			case "<left":
			case "<left>": break;
			case "</left>": break;
			case "<right/>": break;
			case "<right":
			case "<right>": break;
			case "</right>": break;
			case "<top/>": break;
			case "<top":
			case "<top>": break;
			case "</top>": break;
			case "<bottom/>": break;
			case "<bottom":
			case "<bottom>": break;
			case "</bottom>": break;
			case "<diagonal":
			case "<diagonal>":
			case "<diagonal/>": break;
			case "</diagonal>": break;
			case "<horizontal":
			case "<horizontal>":
			case "<horizontal/>": break;
			case "</horizontal>": break;
			case "<vertical":
			case "<vertical>":
			case "<vertical/>": break;
			case "</vertical>": break;
			case "<start":
			case "<start>":
			case "<start/>": break;
			case "</start>": break;
			case "<end":
			case "<end>":
			case "<end/>": break;
			case "</end>": break;
			case "<color":
			case "<color>": break;
			case "<color/>":
			case "</color>": break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>": break;
			case "<ext":
				a = !0;
				break;
			case "</ext>":
				a = !1;
				break;
			default: if (r && r.WTF && !a) throw Error("unrecognized " + n[0] + " in borders");
		}
	});
}
function hc(e, t, n, r) {
	t.Fills = [];
	var i = {}, a = !1;
	(e[0].match(Kt) || []).forEach(function(e) {
		var n = K(e);
		switch (Yt(n[0])) {
			case "<fills":
			case "<fills>":
			case "</fills>": break;
			case "<fill>":
			case "<fill":
			case "<fill/>":
				i = {}, t.Fills.push(i);
				break;
			case "</fill>": break;
			case "<gradientFill>": break;
			case "<gradientFill":
			case "</gradientFill>":
				t.Fills.push(i), i = {};
				break;
			case "<patternFill":
			case "<patternFill>":
				n.patternType && (i.patternType = n.patternType);
				break;
			case "<patternFill/>":
			case "</patternFill>": break;
			case "<bgColor":
				i.bgColor ||= {}, n.indexed && (i.bgColor.indexed = parseInt(n.indexed, 10)), n.theme && (i.bgColor.theme = parseInt(n.theme, 10)), n.tint && (i.bgColor.tint = parseFloat(n.tint)), n.rgb && (i.bgColor.rgb = n.rgb.slice(-6));
				break;
			case "<bgColor/>":
			case "</bgColor>": break;
			case "<fgColor":
				i.fgColor ||= {}, n.theme && (i.fgColor.theme = parseInt(n.theme, 10)), n.tint && (i.fgColor.tint = parseFloat(n.tint)), n.rgb != null && (i.fgColor.rgb = n.rgb.slice(-6));
				break;
			case "<fgColor/>":
			case "</fgColor>": break;
			case "<stop":
			case "<stop/>": break;
			case "</stop>": break;
			case "<color":
			case "<color/>": break;
			case "</color>": break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>": break;
			case "<ext":
				a = !0;
				break;
			case "</ext>":
				a = !1;
				break;
			default: if (r && r.WTF && !a) throw Error("unrecognized " + n[0] + " in fills");
		}
	});
}
function gc(e, t, n, r) {
	t.Fonts = [];
	var i = {}, a = !1;
	(e[0].match(Kt) || []).forEach(function(e) {
		var s = K(e);
		switch (Yt(s[0])) {
			case "<fonts":
			case "<fonts>":
			case "</fonts>": break;
			case "<font":
			case "<font>": break;
			case "</font>":
			case "<font/>":
				t.Fonts.push(i), i = {};
				break;
			case "<name":
				s.val && (i.name = J(s.val));
				break;
			case "<name/>":
			case "</name>": break;
			case "<b":
				i.bold = s.val ? an(s.val) : 1;
				break;
			case "<b/>":
				i.bold = 1;
				break;
			case "<i":
				i.italic = s.val ? an(s.val) : 1;
				break;
			case "<i/>":
				i.italic = 1;
				break;
			case "<u":
				switch (s.val) {
					case "none":
						i.underline = 0;
						break;
					case "single":
						i.underline = 1;
						break;
					case "double":
						i.underline = 2;
						break;
					case "singleAccounting":
						i.underline = 33;
						break;
					case "doubleAccounting":
						i.underline = 34;
						break;
				}
				break;
			case "<u/>":
				i.underline = 1;
				break;
			case "<strike":
				i.strike = s.val ? an(s.val) : 1;
				break;
			case "<strike/>":
				i.strike = 1;
				break;
			case "<outline":
				i.outline = s.val ? an(s.val) : 1;
				break;
			case "<outline/>":
				i.outline = 1;
				break;
			case "<shadow":
				i.shadow = s.val ? an(s.val) : 1;
				break;
			case "<shadow/>":
				i.shadow = 1;
				break;
			case "<condense":
				i.condense = s.val ? an(s.val) : 1;
				break;
			case "<condense/>":
				i.condense = 1;
				break;
			case "<extend":
				i.extend = s.val ? an(s.val) : 1;
				break;
			case "<extend/>":
				i.extend = 1;
				break;
			case "<sz":
				s.val && (i.sz = +s.val);
				break;
			case "<sz/>":
			case "</sz>": break;
			case "<vertAlign":
				s.val && (i.vertAlign = s.val);
				break;
			case "<vertAlign/>":
			case "</vertAlign>": break;
			case "<family":
				s.val && (i.family = parseInt(s.val, 10));
				break;
			case "<family/>":
			case "</family>": break;
			case "<scheme":
				s.val && (i.scheme = s.val);
				break;
			case "<scheme/>":
			case "</scheme>": break;
			case "<charset":
				if (s.val == "1") break;
				s.codepage = o[parseInt(s.val, 10)];
				break;
			case "<color":
				if (i.color ||= {}, s.auto && (i.color.auto = an(s.auto)), s.rgb) i.color.rgb = s.rgb.slice(-6);
				else if (s.indexed) {
					i.color.index = parseInt(s.indexed, 10);
					var c = yi[i.color.index];
					i.color.index == 81 && (c = yi[1]), c ||= yi[1], i.color.rgb = c[0].toString(16) + c[1].toString(16) + c[2].toString(16);
				} else s.theme && (i.color.theme = parseInt(s.theme, 10), s.tint && (i.color.tint = parseFloat(s.tint)), s.theme && n.themeElements && n.themeElements.clrScheme && (i.color.rgb = $s(n.themeElements.clrScheme[i.color.theme].rgb, i.color.tint || 0)));
				break;
			case "<color/>":
			case "</color>": break;
			case "<AlternateContent":
				a = !0;
				break;
			case "</AlternateContent>":
				a = !1;
				break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>": break;
			case "<ext":
				a = !0;
				break;
			case "</ext>":
				a = !1;
				break;
			default: if (r && r.WTF && !a) throw Error("unrecognized " + s[0] + " in fonts");
		}
	});
}
function _c(e, t, n) {
	t.NumberFmt = [];
	for (var r = ct(U), i = 0; i < r.length; ++i) t.NumberFmt[r[i]] = U[r[i]];
	var a = e[0].match(Kt);
	if (a) for (i = 0; i < a.length; ++i) {
		var o = K(a[i]);
		switch (Yt(o[0])) {
			case "<numFmts":
			case "</numFmts>":
			case "<numFmts/>":
			case "<numFmts>": break;
			case "<numFmt":
				var s = q(J(o.formatCode)), c = parseInt(o.numFmtId, 10);
				if (t.NumberFmt[c] = s, c > 0) {
					if (c > 392) {
						for (c = 392; c > 60 && t.NumberFmt[c] != null; --c);
						t.NumberFmt[c] = s;
					}
					Xe(s, c);
				}
				break;
			case "</numFmt>": break;
			default: if (n.WTF) throw Error("unrecognized " + o[0] + " in numFmts");
		}
	}
}
function vc(e) {
	var t = ["<numFmts>"];
	return [
		[5, 8],
		[23, 26],
		[41, 44],
		[50, 392]
	].forEach(function(n) {
		for (var r = n[0]; r <= n[1]; ++r) e[r] != null && (t[t.length] = Y("numFmt", null, {
			numFmtId: r,
			formatCode: en(e[r])
		}));
	}), t.length === 1 ? "" : (t[t.length] = "</numFmts>", t[0] = Y("numFmts", null, { count: t.length - 2 }).replace("/>", ">"), t.join(""));
}
var yc = [
	"numFmtId",
	"fillId",
	"fontId",
	"borderId",
	"xfId"
], bc = [
	"applyAlignment",
	"applyBorder",
	"applyFill",
	"applyFont",
	"applyNumberFormat",
	"applyProtection",
	"pivotButton",
	"quotePrefix"
];
function xc(e, t, n) {
	t.CellXf = [];
	var r, i = !1;
	(e[0].match(Kt) || []).forEach(function(e) {
		var a = K(e), o = 0;
		switch (Yt(a[0])) {
			case "<cellXfs":
			case "<cellXfs>":
			case "<cellXfs/>":
			case "</cellXfs>": break;
			case "<xf":
			case "<xf/>":
				for (r = a, delete r[0], o = 0; o < yc.length; ++o) r[yc[o]] && (r[yc[o]] = parseInt(r[yc[o]], 10));
				for (o = 0; o < bc.length; ++o) r[bc[o]] && (r[bc[o]] = an(r[bc[o]]));
				if (t.NumberFmt && r.numFmtId > 392) {
					for (o = 392; o > 60; --o) if (t.NumberFmt[r.numFmtId] == t.NumberFmt[o]) {
						r.numFmtId = o;
						break;
					}
				}
				t.CellXf.push(r);
				break;
			case "</xf>": break;
			case "<alignment":
			case "<alignment/>":
				var s = {};
				a.vertical && (s.vertical = a.vertical), a.horizontal && (s.horizontal = a.horizontal), a.textRotation != null && (s.textRotation = a.textRotation), a.indent && (s.indent = a.indent), a.wrapText && (s.wrapText = an(a.wrapText)), r.alignment = s;
				break;
			case "</alignment>": break;
			case "<protection": break;
			case "</protection>":
			case "<protection/>": break;
			case "<AlternateContent":
				i = !0;
				break;
			case "</AlternateContent>":
				i = !1;
				break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>": break;
			case "<ext":
				i = !0;
				break;
			case "</ext>":
				i = !1;
				break;
			default: if (n && n.WTF && !i) throw Error("unrecognized " + a[0] + " in cellXfs");
		}
	});
}
function Sc(e) {
	var t = [];
	return t[t.length] = Y("cellXfs", null), e.forEach(function(e) {
		t[t.length] = Y("xf", null, e);
	}), t[t.length] = "</cellXfs>", t.length === 2 ? "" : (t[0] = Y("cellXfs", null, { count: t.length - 2 }).replace("/>", ">"), t.join(""));
}
var Cc = /*#__PURE__*/ (function() {
	var e = /<(?:\w+:)?numFmts([^>]*)>[\S\s]*?<\/(?:\w+:)?numFmts>/, t = /<(?:\w+:)?cellXfs([^>]*)>[\S\s]*?<\/(?:\w+:)?cellXfs>/, n = /<(?:\w+:)?fills([^>]*)>[\S\s]*?<\/(?:\w+:)?fills>/, r = /<(?:\w+:)?fonts([^>]*)>[\S\s]*?<\/(?:\w+:)?fonts>/, i = /<(?:\w+:)?borders([^>]*)>[\S\s]*?<\/(?:\w+:)?borders>/;
	return function(a, o, s) {
		var c = {};
		if (!a) return c;
		a = a.replace(/<!--([\s\S]*?)-->/gm, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, "");
		var l;
		return (l = a.match(e)) && _c(l, c, s), (l = a.match(r)) && gc(l, c, o, s), (l = a.match(n)) && hc(l, c, o, s), (l = a.match(i)) && mc(l, c, o, s), (l = a.match(t)) && xc(l, c, s), c;
	};
})();
function wc(e, t) {
	var n = [Ut, Y("styleSheet", null, {
		xmlns: Tn[0],
		"xmlns:vt": wn.vt
	})], r;
	return e.SSF && (r = vc(e.SSF)) != null && (n[n.length] = r), n[n.length] = "<fonts count=\"1\"><font><sz val=\"12\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/><scheme val=\"minor\"/></font></fonts>", n[n.length] = "<fills count=\"2\"><fill><patternFill patternType=\"none\"/></fill><fill><patternFill patternType=\"gray125\"/></fill></fills>", n[n.length] = "<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>", n[n.length] = "<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>", (r = Sc(t.cellXfs)) && (n[n.length] = r), n[n.length] = "<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>", n[n.length] = "<dxfs count=\"0\"/>", n[n.length] = "<tableStyles count=\"0\" defaultTableStyle=\"TableStyleMedium9\" defaultPivotStyle=\"PivotStyleMedium4\"/>", n.length > 2 && (n[n.length] = "</styleSheet>", n[1] = n[1].replace("/>", ">")), n.join("");
}
function Tc(e, t) {
	return [e.read_shift(2), Ir(e, t - 2)];
}
function Ec(e, t, n) {
	var r = {};
	r.sz = e.read_shift(2) / 20;
	var i = Zr(e, 2, n);
	switch (i.fItalic && (r.italic = 1), i.fCondense && (r.condense = 1), i.fExtend && (r.extend = 1), i.fShadow && (r.shadow = 1), i.fOutline && (r.outline = 1), i.fStrikeout && (r.strike = 1), e.read_shift(2) === 700 && (r.bold = 1), e.read_shift(2)) {
		case 1:
			r.vertAlign = "superscript";
			break;
		case 2:
			r.vertAlign = "subscript";
			break;
	}
	var a = e.read_shift(1);
	a != 0 && (r.underline = a);
	var o = e.read_shift(1);
	o > 0 && (r.family = o);
	var s = e.read_shift(1);
	switch (s > 0 && (r.charset = s), e.l++, r.color = Xr(e, 8), e.read_shift(1)) {
		case 1:
			r.scheme = "major";
			break;
		case 2:
			r.scheme = "minor";
			break;
	}
	return r.name = Ir(e, t - 21), r;
}
var Dc = ur;
function Oc(e, t) {
	var n = e.l + t, r = e.read_shift(2), i = e.read_shift(2);
	return e.l = n, {
		ixfe: r,
		numFmtId: i
	};
}
var kc = ur;
function Ac(e, t, n) {
	var r = {};
	for (var i in r.NumberFmt = [], U) r.NumberFmt[i] = U[i];
	r.CellXf = [], r.Fonts = [];
	var a = [], o = !1;
	return fr(e, function(e, i, s) {
		switch (s) {
			case 44:
				r.NumberFmt[e[0]] = e[1], Xe(e[1], e[0]);
				break;
			case 43:
				r.Fonts.push(e), e.color.theme != null && t && t.themeElements && t.themeElements.clrScheme && (e.color.rgb = $s(t.themeElements.clrScheme[e.color.theme].rgb, e.color.tint || 0));
				break;
			case 1025: break;
			case 45: break;
			case 46: break;
			case 47:
				a[a.length - 1] == 617 && r.CellXf.push(e);
				break;
			case 48:
			case 507:
			case 572:
			case 475: break;
			case 1171:
			case 2102:
			case 1130:
			case 512:
			case 2095:
			case 3072: break;
			case 35:
				o = !0;
				break;
			case 36:
				o = !1;
				break;
			case 37:
				a.push(s), o = !0;
				break;
			case 38:
				a.pop(), o = !1;
				break;
			default: if (i.T > 0) a.push(s);
			else if (i.T < 0) a.pop();
			else if (!o || n.WTF && a[a.length - 1] != 37) throw Error("Unexpected record 0x" + s.toString(16));
		}
	}), r;
}
var jc = [
	"</a:lt1>",
	"</a:dk1>",
	"</a:lt2>",
	"</a:dk2>",
	"</a:accent1>",
	"</a:accent2>",
	"</a:accent3>",
	"</a:accent4>",
	"</a:accent5>",
	"</a:accent6>",
	"</a:hlink>",
	"</a:folHlink>"
];
function Mc(e, t, n) {
	t.themeElements.clrScheme = [];
	var r = {};
	(e[0].match(Kt) || []).forEach(function(e) {
		var i = K(e);
		switch (i[0]) {
			case "<a:clrScheme":
			case "</a:clrScheme>": break;
			case "<a:srgbClr":
				r.rgb = i.val;
				break;
			case "<a:sysClr":
				r.rgb = i.lastClr;
				break;
			case "<a:dk1>":
			case "</a:dk1>":
			case "<a:lt1>":
			case "</a:lt1>":
			case "<a:dk2>":
			case "</a:dk2>":
			case "<a:lt2>":
			case "</a:lt2>":
			case "<a:accent1>":
			case "</a:accent1>":
			case "<a:accent2>":
			case "</a:accent2>":
			case "<a:accent3>":
			case "</a:accent3>":
			case "<a:accent4>":
			case "</a:accent4>":
			case "<a:accent5>":
			case "</a:accent5>":
			case "<a:accent6>":
			case "</a:accent6>":
			case "<a:hlink>":
			case "</a:hlink>":
			case "<a:folHlink>":
			case "</a:folHlink>":
				i[0].charAt(1) === "/" ? (t.themeElements.clrScheme[jc.indexOf(i[0])] = r, r = {}) : r.name = i[0].slice(3, i[0].length - 1);
				break;
			default: if (n && n.WTF) throw Error("Unrecognized " + i[0] + " in clrScheme");
		}
	});
}
function Nc() {}
function Pc() {}
var Fc = /<a:clrScheme([^>]*)>[\s\S]*<\/a:clrScheme>/, Ic = /<a:fontScheme([^>]*)>[\s\S]*<\/a:fontScheme>/, Lc = /<a:fmtScheme([^>]*)>[\s\S]*<\/a:fmtScheme>/;
function Rc(e, t, n) {
	t.themeElements = {};
	var r;
	[
		[
			"clrScheme",
			Fc,
			Mc
		],
		[
			"fontScheme",
			Ic,
			Nc
		],
		[
			"fmtScheme",
			Lc,
			Pc
		]
	].forEach(function(i) {
		if (!(r = e.match(i[1]))) throw Error(i[0] + " not found in themeElements");
		i[2](r, t, n);
	});
}
var zc = /<a:themeElements([^>]*)>[\s\S]*<\/a:themeElements>/;
function Bc(e, t) {
	(!e || e.length === 0) && (e = Vc());
	var n, r = {};
	if (!(n = e.match(zc))) throw Error("themeElements not found in theme");
	return Rc(n[0], r, t), r.raw = e, r;
}
function Vc(e, t) {
	if (t && t.themeXLSX) return t.themeXLSX;
	if (e && typeof e.raw == "string") return e.raw;
	var n = [Ut];
	return n[n.length] = "<a:theme xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" name=\"Office Theme\">", n[n.length] = "<a:themeElements>", n[n.length] = "<a:clrScheme name=\"Office\">", n[n.length] = "<a:dk1><a:sysClr val=\"windowText\" lastClr=\"000000\"/></a:dk1>", n[n.length] = "<a:lt1><a:sysClr val=\"window\" lastClr=\"FFFFFF\"/></a:lt1>", n[n.length] = "<a:dk2><a:srgbClr val=\"1F497D\"/></a:dk2>", n[n.length] = "<a:lt2><a:srgbClr val=\"EEECE1\"/></a:lt2>", n[n.length] = "<a:accent1><a:srgbClr val=\"4F81BD\"/></a:accent1>", n[n.length] = "<a:accent2><a:srgbClr val=\"C0504D\"/></a:accent2>", n[n.length] = "<a:accent3><a:srgbClr val=\"9BBB59\"/></a:accent3>", n[n.length] = "<a:accent4><a:srgbClr val=\"8064A2\"/></a:accent4>", n[n.length] = "<a:accent5><a:srgbClr val=\"4BACC6\"/></a:accent5>", n[n.length] = "<a:accent6><a:srgbClr val=\"F79646\"/></a:accent6>", n[n.length] = "<a:hlink><a:srgbClr val=\"0000FF\"/></a:hlink>", n[n.length] = "<a:folHlink><a:srgbClr val=\"800080\"/></a:folHlink>", n[n.length] = "</a:clrScheme>", n[n.length] = "<a:fontScheme name=\"Office\">", n[n.length] = "<a:majorFont>", n[n.length] = "<a:latin typeface=\"Cambria\"/>", n[n.length] = "<a:ea typeface=\"\"/>", n[n.length] = "<a:cs typeface=\"\"/>", n[n.length] = "<a:font script=\"Jpan\" typeface=\"ＭＳ Ｐゴシック\"/>", n[n.length] = "<a:font script=\"Hang\" typeface=\"맑은 고딕\"/>", n[n.length] = "<a:font script=\"Hans\" typeface=\"宋体\"/>", n[n.length] = "<a:font script=\"Hant\" typeface=\"新細明體\"/>", n[n.length] = "<a:font script=\"Arab\" typeface=\"Times New Roman\"/>", n[n.length] = "<a:font script=\"Hebr\" typeface=\"Times New Roman\"/>", n[n.length] = "<a:font script=\"Thai\" typeface=\"Tahoma\"/>", n[n.length] = "<a:font script=\"Ethi\" typeface=\"Nyala\"/>", n[n.length] = "<a:font script=\"Beng\" typeface=\"Vrinda\"/>", n[n.length] = "<a:font script=\"Gujr\" typeface=\"Shruti\"/>", n[n.length] = "<a:font script=\"Khmr\" typeface=\"MoolBoran\"/>", n[n.length] = "<a:font script=\"Knda\" typeface=\"Tunga\"/>", n[n.length] = "<a:font script=\"Guru\" typeface=\"Raavi\"/>", n[n.length] = "<a:font script=\"Cans\" typeface=\"Euphemia\"/>", n[n.length] = "<a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/>", n[n.length] = "<a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/>", n[n.length] = "<a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/>", n[n.length] = "<a:font script=\"Thaa\" typeface=\"MV Boli\"/>", n[n.length] = "<a:font script=\"Deva\" typeface=\"Mangal\"/>", n[n.length] = "<a:font script=\"Telu\" typeface=\"Gautami\"/>", n[n.length] = "<a:font script=\"Taml\" typeface=\"Latha\"/>", n[n.length] = "<a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/>", n[n.length] = "<a:font script=\"Orya\" typeface=\"Kalinga\"/>", n[n.length] = "<a:font script=\"Mlym\" typeface=\"Kartika\"/>", n[n.length] = "<a:font script=\"Laoo\" typeface=\"DokChampa\"/>", n[n.length] = "<a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/>", n[n.length] = "<a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/>", n[n.length] = "<a:font script=\"Viet\" typeface=\"Times New Roman\"/>", n[n.length] = "<a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/>", n[n.length] = "<a:font script=\"Geor\" typeface=\"Sylfaen\"/>", n[n.length] = "</a:majorFont>", n[n.length] = "<a:minorFont>", n[n.length] = "<a:latin typeface=\"Calibri\"/>", n[n.length] = "<a:ea typeface=\"\"/>", n[n.length] = "<a:cs typeface=\"\"/>", n[n.length] = "<a:font script=\"Jpan\" typeface=\"ＭＳ Ｐゴシック\"/>", n[n.length] = "<a:font script=\"Hang\" typeface=\"맑은 고딕\"/>", n[n.length] = "<a:font script=\"Hans\" typeface=\"宋体\"/>", n[n.length] = "<a:font script=\"Hant\" typeface=\"新細明體\"/>", n[n.length] = "<a:font script=\"Arab\" typeface=\"Arial\"/>", n[n.length] = "<a:font script=\"Hebr\" typeface=\"Arial\"/>", n[n.length] = "<a:font script=\"Thai\" typeface=\"Tahoma\"/>", n[n.length] = "<a:font script=\"Ethi\" typeface=\"Nyala\"/>", n[n.length] = "<a:font script=\"Beng\" typeface=\"Vrinda\"/>", n[n.length] = "<a:font script=\"Gujr\" typeface=\"Shruti\"/>", n[n.length] = "<a:font script=\"Khmr\" typeface=\"DaunPenh\"/>", n[n.length] = "<a:font script=\"Knda\" typeface=\"Tunga\"/>", n[n.length] = "<a:font script=\"Guru\" typeface=\"Raavi\"/>", n[n.length] = "<a:font script=\"Cans\" typeface=\"Euphemia\"/>", n[n.length] = "<a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/>", n[n.length] = "<a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/>", n[n.length] = "<a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/>", n[n.length] = "<a:font script=\"Thaa\" typeface=\"MV Boli\"/>", n[n.length] = "<a:font script=\"Deva\" typeface=\"Mangal\"/>", n[n.length] = "<a:font script=\"Telu\" typeface=\"Gautami\"/>", n[n.length] = "<a:font script=\"Taml\" typeface=\"Latha\"/>", n[n.length] = "<a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/>", n[n.length] = "<a:font script=\"Orya\" typeface=\"Kalinga\"/>", n[n.length] = "<a:font script=\"Mlym\" typeface=\"Kartika\"/>", n[n.length] = "<a:font script=\"Laoo\" typeface=\"DokChampa\"/>", n[n.length] = "<a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/>", n[n.length] = "<a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/>", n[n.length] = "<a:font script=\"Viet\" typeface=\"Arial\"/>", n[n.length] = "<a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/>", n[n.length] = "<a:font script=\"Geor\" typeface=\"Sylfaen\"/>", n[n.length] = "</a:minorFont>", n[n.length] = "</a:fontScheme>", n[n.length] = "<a:fmtScheme name=\"Office\">", n[n.length] = "<a:fillStyleLst>", n[n.length] = "<a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill>", n[n.length] = "<a:gradFill rotWithShape=\"1\">", n[n.length] = "<a:gsLst>", n[n.length] = "<a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"50000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"35000\"><a:schemeClr val=\"phClr\"><a:tint val=\"37000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:tint val=\"15000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs>", n[n.length] = "</a:gsLst>", n[n.length] = "<a:lin ang=\"16200000\" scaled=\"1\"/>", n[n.length] = "</a:gradFill>", n[n.length] = "<a:gradFill rotWithShape=\"1\">", n[n.length] = "<a:gsLst>", n[n.length] = "<a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"100000\"/><a:shade val=\"100000\"/><a:satMod val=\"130000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:tint val=\"50000\"/><a:shade val=\"100000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs>", n[n.length] = "</a:gsLst>", n[n.length] = "<a:lin ang=\"16200000\" scaled=\"0\"/>", n[n.length] = "</a:gradFill>", n[n.length] = "</a:fillStyleLst>", n[n.length] = "<a:lnStyleLst>", n[n.length] = "<a:ln w=\"9525\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"><a:shade val=\"95000\"/><a:satMod val=\"105000\"/></a:schemeClr></a:solidFill><a:prstDash val=\"solid\"/></a:ln>", n[n.length] = "<a:ln w=\"25400\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/></a:ln>", n[n.length] = "<a:ln w=\"38100\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/></a:ln>", n[n.length] = "</a:lnStyleLst>", n[n.length] = "<a:effectStyleLst>", n[n.length] = "<a:effectStyle>", n[n.length] = "<a:effectLst>", n[n.length] = "<a:outerShdw blurRad=\"40000\" dist=\"20000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"38000\"/></a:srgbClr></a:outerShdw>", n[n.length] = "</a:effectLst>", n[n.length] = "</a:effectStyle>", n[n.length] = "<a:effectStyle>", n[n.length] = "<a:effectLst>", n[n.length] = "<a:outerShdw blurRad=\"40000\" dist=\"23000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"35000\"/></a:srgbClr></a:outerShdw>", n[n.length] = "</a:effectLst>", n[n.length] = "</a:effectStyle>", n[n.length] = "<a:effectStyle>", n[n.length] = "<a:effectLst>", n[n.length] = "<a:outerShdw blurRad=\"40000\" dist=\"23000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"35000\"/></a:srgbClr></a:outerShdw>", n[n.length] = "</a:effectLst>", n[n.length] = "<a:scene3d><a:camera prst=\"orthographicFront\"><a:rot lat=\"0\" lon=\"0\" rev=\"0\"/></a:camera><a:lightRig rig=\"threePt\" dir=\"t\"><a:rot lat=\"0\" lon=\"0\" rev=\"1200000\"/></a:lightRig></a:scene3d>", n[n.length] = "<a:sp3d><a:bevelT w=\"63500\" h=\"25400\"/></a:sp3d>", n[n.length] = "</a:effectStyle>", n[n.length] = "</a:effectStyleLst>", n[n.length] = "<a:bgFillStyleLst>", n[n.length] = "<a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill>", n[n.length] = "<a:gradFill rotWithShape=\"1\">", n[n.length] = "<a:gsLst>", n[n.length] = "<a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"40000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"40000\"><a:schemeClr val=\"phClr\"><a:tint val=\"45000\"/><a:shade val=\"99000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:shade val=\"20000\"/><a:satMod val=\"255000\"/></a:schemeClr></a:gs>", n[n.length] = "</a:gsLst>", n[n.length] = "<a:path path=\"circle\"><a:fillToRect l=\"50000\" t=\"-80000\" r=\"50000\" b=\"180000\"/></a:path>", n[n.length] = "</a:gradFill>", n[n.length] = "<a:gradFill rotWithShape=\"1\">", n[n.length] = "<a:gsLst>", n[n.length] = "<a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"80000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs>", n[n.length] = "<a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:shade val=\"30000\"/><a:satMod val=\"200000\"/></a:schemeClr></a:gs>", n[n.length] = "</a:gsLst>", n[n.length] = "<a:path path=\"circle\"><a:fillToRect l=\"50000\" t=\"50000\" r=\"50000\" b=\"50000\"/></a:path>", n[n.length] = "</a:gradFill>", n[n.length] = "</a:bgFillStyleLst>", n[n.length] = "</a:fmtScheme>", n[n.length] = "</a:themeElements>", n[n.length] = "<a:objectDefaults>", n[n.length] = "<a:spDef>", n[n.length] = "<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx=\"1\"><a:schemeClr val=\"accent1\"/></a:lnRef><a:fillRef idx=\"3\"><a:schemeClr val=\"accent1\"/></a:fillRef><a:effectRef idx=\"2\"><a:schemeClr val=\"accent1\"/></a:effectRef><a:fontRef idx=\"minor\"><a:schemeClr val=\"lt1\"/></a:fontRef></a:style>", n[n.length] = "</a:spDef>", n[n.length] = "<a:lnDef>", n[n.length] = "<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx=\"2\"><a:schemeClr val=\"accent1\"/></a:lnRef><a:fillRef idx=\"0\"><a:schemeClr val=\"accent1\"/></a:fillRef><a:effectRef idx=\"1\"><a:schemeClr val=\"accent1\"/></a:effectRef><a:fontRef idx=\"minor\"><a:schemeClr val=\"tx1\"/></a:fontRef></a:style>", n[n.length] = "</a:lnDef>", n[n.length] = "</a:objectDefaults>", n[n.length] = "<a:extraClrSchemeLst/>", n[n.length] = "</a:theme>", n.join("");
}
function Hc(e, t, n) {
	var r = e.l + t;
	if (e.read_shift(4) !== 124226) {
		if (!n.cellStyles) {
			e.l = r;
			return;
		}
		var i = e.slice(e.l);
		e.l = r;
		var a;
		try {
			a = Vt(i, { type: "array" });
		} catch {
			return;
		}
		var o = It(a, "theme/theme/theme1.xml", !0);
		if (o) return Bc(o, n);
	}
}
function Uc(e) {
	return e.read_shift(4);
}
function Wc(e) {
	var t = {};
	switch (t.xclrType = e.read_shift(2), t.nTintShade = e.read_shift(2), t.xclrType) {
		case 0:
			e.l += 4;
			break;
		case 1:
			t.xclrValue = Gc(e, 4);
			break;
		case 2:
			t.xclrValue = Da(e, 4);
			break;
		case 3:
			t.xclrValue = Uc(e, 4);
			break;
		case 4:
			e.l += 4;
			break;
	}
	return e.l += 8, t;
}
function Gc(e, t) {
	return ur(e, t);
}
function Kc(e, t) {
	return ur(e, t);
}
function qc(e) {
	var t = e.read_shift(2), n = e.read_shift(2) - 4, r = [t];
	switch (t) {
		case 4:
		case 5:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 13:
			r[1] = Wc(e, n);
			break;
		case 6:
			r[1] = Kc(e, n);
			break;
		case 14:
		case 15:
			r[1] = e.read_shift(n === 1 ? 1 : 2);
			break;
		default: throw Error("Unrecognized ExtProp type: " + t + " " + n);
	}
	return r;
}
function Jc(e, t) {
	var n = e.l + t;
	e.l += 2;
	var r = e.read_shift(2);
	e.l += 2;
	for (var i = e.read_shift(2), a = []; i-- > 0;) a.push(qc(e, n - e.l));
	return {
		ixfe: r,
		ext: a
	};
}
function Yc(e, t) {
	t.forEach(function(e) {
		switch (e[0]) {
			case 4: break;
			case 5: break;
			case 6: break;
			case 7: break;
			case 8: break;
			case 9: break;
			case 10: break;
			case 11: break;
			case 13: break;
			case 14: break;
			case 15: break;
		}
	});
}
function Xc(e, t) {
	return {
		flags: e.read_shift(4),
		version: e.read_shift(4),
		name: Ir(e, t - 8)
	};
}
function Zc(e) {
	for (var t = [], n = e.read_shift(4); n-- > 0;) t.push([e.read_shift(4), e.read_shift(4)]);
	return t;
}
function Qc(e) {
	return e.l += 4, e.read_shift(4) != 0;
}
function $c(e, t, n) {
	var r = {
		Types: [],
		Cell: [],
		Value: []
	}, i = n || {}, a = [], o = !1, s = 2;
	return fr(e, function(e, t, n) {
		switch (n) {
			case 335:
				r.Types.push({ name: e.name });
				break;
			case 51:
				e.forEach(function(e) {
					s == 1 ? r.Cell.push({
						type: r.Types[e[0] - 1].name,
						index: e[1]
					}) : s == 0 && r.Value.push({
						type: r.Types[e[0] - 1].name,
						index: e[1]
					});
				});
				break;
			case 337:
				s = +!!e;
				break;
			case 338:
				s = 2;
				break;
			case 35:
				a.push(n), o = !0;
				break;
			case 36:
				a.pop(), o = !1;
				break;
			default: if (!t.T && (!o || i.WTF && a[a.length - 1] != 35)) throw Error("Unexpected record 0x" + n.toString(16));
		}
	}), r;
}
function el(e, t, n) {
	var r = {
		Types: [],
		Cell: [],
		Value: []
	};
	if (!e) return r;
	var i = !1, a = 2, o;
	return e.replace(Kt, function(e) {
		var t = K(e);
		switch (Yt(t[0])) {
			case "<?xml": break;
			case "<metadata":
			case "</metadata>": break;
			case "<metadataTypes":
			case "</metadataTypes>": break;
			case "<metadataType":
				r.Types.push({ name: t.name });
				break;
			case "</metadataType>": break;
			case "<futureMetadata":
				for (var s = 0; s < r.Types.length; ++s) r.Types[s].name == t.name && (o = r.Types[s]);
				break;
			case "</futureMetadata>": break;
			case "<bk>": break;
			case "</bk>": break;
			case "<rc":
				a == 1 ? r.Cell.push({
					type: r.Types[t.t - 1].name,
					index: +t.v
				}) : a == 0 && r.Value.push({
					type: r.Types[t.t - 1].name,
					index: +t.v
				});
				break;
			case "</rc>": break;
			case "<cellMetadata":
				a = 1;
				break;
			case "</cellMetadata>":
				a = 2;
				break;
			case "<valueMetadata":
				a = 0;
				break;
			case "</valueMetadata>":
				a = 2;
				break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>":
			case "<extLst/>": break;
			case "<ext":
				i = !0;
				break;
			case "</ext>":
				i = !1;
				break;
			case "<rvb":
				if (!o) break;
				o.offsets ||= [], o.offsets.push(+t.i);
				break;
			default: if (!i && n.WTF) throw Error("unrecognized " + t[0] + " in metadata");
		}
		return e;
	}), r;
}
function tl() {
	var e = [Ut];
	return e.push("<metadata xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:xlrd=\"http://schemas.microsoft.com/office/spreadsheetml/2017/richdata\" xmlns:xda=\"http://schemas.microsoft.com/office/spreadsheetml/2017/dynamicarray\">\n  <metadataTypes count=\"1\">\n    <metadataType name=\"XLDAPR\" minSupportedVersion=\"120000\" copy=\"1\" pasteAll=\"1\" pasteValues=\"1\" merge=\"1\" splitFirst=\"1\" rowColShift=\"1\" clearFormats=\"1\" clearComments=\"1\" assign=\"1\" coerce=\"1\" cellMeta=\"1\"/>\n  </metadataTypes>\n  <futureMetadata name=\"XLDAPR\" count=\"1\">\n    <bk>\n      <extLst>\n        <ext uri=\"{bdbb8cdc-fa1e-496e-a857-3c3f30c029c3}\">\n          <xda:dynamicArrayProperties fDynamic=\"1\" fCollapsed=\"0\"/>\n        </ext>\n      </extLst>\n    </bk>\n  </futureMetadata>\n  <cellMetadata count=\"1\">\n    <bk>\n      <rc t=\"1\" v=\"0\"/>\n    </bk>\n  </cellMetadata>\n</metadata>"), e.join("");
}
function nl(e) {
	var t = [];
	if (!e) return t;
	var n = 1;
	return (e.match(Kt) || []).forEach(function(e) {
		var r = K(e);
		switch (r[0]) {
			case "<?xml": break;
			case "<calcChain":
			case "<calcChain>":
			case "</calcChain>": break;
			case "<c":
				delete r[0], r.i ? n = r.i : r.i = n, t.push(r);
				break;
		}
	}), t;
}
function rl(e) {
	var t = {};
	t.i = e.read_shift(4);
	var n = {};
	n.r = e.read_shift(4), n.c = e.read_shift(4), t.r = X(n);
	var r = e.read_shift(1);
	return r & 2 && (t.l = "1"), r & 8 && (t.a = "1"), t;
}
function il(e, t, n) {
	var r = [];
	return fr(e, function(e, t, n) {
		switch (n) {
			case 63:
				r.push(e);
				break;
			default: if (!t.T) throw Error("Unexpected record 0x" + n.toString(16));
		}
	}), r;
}
function al(e, t, n, r) {
	if (!e) return e;
	var i = r || {}, a = !1;
	fr(e, function(e, t, n) {
		switch (n) {
			case 359:
			case 363:
			case 364:
			case 366:
			case 367:
			case 368:
			case 369:
			case 370:
			case 371:
			case 472:
			case 577:
			case 578:
			case 579:
			case 580:
			case 581:
			case 582:
			case 583:
			case 584:
			case 585:
			case 586:
			case 587: break;
			case 35:
				a = !0;
				break;
			case 36:
				a = !1;
				break;
			default: if (!t.T && (!a || i.WTF)) throw Error("Unexpected record 0x" + n.toString(16));
		}
	}, i);
}
function ol(e, t) {
	if (!e) return "??";
	var n = (e.match(/<c:chart [^>]*r:id="([^"]*)"/) || ["", ""])[1];
	return t["!id"][n].Target;
}
var sl = 1024;
function cl(e, t) {
	for (var n = [21600, 21600], r = [
		"m0,0l0",
		n[1],
		n[0],
		n[1],
		n[0],
		"0xe"
	].join(","), i = [
		Y("xml", null, {
			"xmlns:v": En.v,
			"xmlns:o": En.o,
			"xmlns:x": En.x,
			"xmlns:mv": En.mv
		}).replace(/\/>/, ">"),
		Y("o:shapelayout", Y("o:idmap", null, {
			"v:ext": "edit",
			data: e
		}), { "v:ext": "edit" }),
		Y("v:shapetype", [Y("v:stroke", null, { joinstyle: "miter" }), Y("v:path", null, {
			gradientshapeok: "t",
			"o:connecttype": "rect"
		})].join(""), {
			id: "_x0000_t202",
			"o:spt": 202,
			coordsize: n.join(","),
			path: r
		})
	]; sl < e * 1e3;) sl += 1e3;
	return t.forEach(function(e) {
		var t = Dr(e[0]), n = {
			color2: "#BEFF82",
			type: "gradient"
		};
		n.type == "gradient" && (n.angle = "-180");
		var r = Y("v:fill", n.type == "gradient" ? Y("o:fill", null, {
			type: "gradientUnscaled",
			"v:ext": "view"
		}) : null, n);
		++sl, i = i.concat([
			"<v:shape" + yn({
				id: "_x0000_s" + sl,
				type: "#_x0000_t202",
				style: "position:absolute; margin-left:80pt;margin-top:5pt;width:104pt;height:64pt;z-index:10" + (e[1].hidden ? ";visibility:hidden" : ""),
				fillcolor: "#ECFAD4",
				strokecolor: "#edeaa1"
			}) + ">",
			r,
			Y("v:shadow", null, {
				on: "t",
				obscured: "t"
			}),
			Y("v:path", null, { "o:connecttype": "none" }),
			"<v:textbox><div style=\"text-align:left\"></div></v:textbox>",
			"<x:ClientData ObjectType=\"Note\">",
			"<x:MoveWithCells/>",
			"<x:SizeWithCells/>",
			vn("x:Anchor", [
				t.c + 1,
				0,
				t.r + 1,
				0,
				t.c + 3,
				20,
				t.r + 5,
				20
			].join(",")),
			vn("x:AutoFill", "False"),
			vn("x:Row", String(t.r)),
			vn("x:Column", String(t.c)),
			e[1].hidden ? "" : "<x:Visible/>",
			"</x:ClientData>",
			"</v:shape>"
		]);
	}), i.push("</xml>"), i.join("");
}
function ll(e, t, n, r) {
	var i = Array.isArray(e), a;
	t.forEach(function(t) {
		var o = Dr(t.ref);
		if (i ? (e[o.r] || (e[o.r] = []), a = e[o.r][o.c]) : a = e[t.ref], !a) {
			a = { t: "z" }, i ? e[o.r][o.c] = a : e[t.ref] = a;
			var s = kr(e["!ref"] || "BDWGO1000001:A1");
			s.s.r > o.r && (s.s.r = o.r), s.e.r < o.r && (s.e.r = o.r), s.s.c > o.c && (s.s.c = o.c), s.e.c < o.c && (s.e.c = o.c);
			var c = Z(s);
			c !== e["!ref"] && (e["!ref"] = c);
		}
		a.c ||= [];
		var l = {
			a: t.author,
			t: t.t,
			r: t.r,
			T: n
		};
		t.h && (l.h = t.h);
		for (var u = a.c.length - 1; u >= 0; --u) {
			if (!n && a.c[u].T) return;
			n && !a.c[u].T && a.c.splice(u, 1);
		}
		if (n && r) {
			for (u = 0; u < r.length; ++u) if (l.a == r[u].id) {
				l.a = r[u].name || l.a;
				break;
			}
		}
		a.c.push(l);
	});
}
function ul(e, t) {
	if (e.match(/<(?:\w+:)?comments *\/>/)) return [];
	var n = [], r = [], i = e.match(/<(?:\w+:)?authors>([\s\S]*)<\/(?:\w+:)?authors>/);
	i && i[1] && i[1].split(/<\/\w*:?author>/).forEach(function(e) {
		if (!(e === "" || e.trim() === "")) {
			var t = e.match(/<(?:\w+:)?author[^>]*>(.*)/);
			t && n.push(t[1]);
		}
	});
	var a = e.match(/<(?:\w+:)?commentList>([\s\S]*)<\/(?:\w+:)?commentList>/);
	return a && a[1] && a[1].split(/<\/\w*:?comment>/).forEach(function(e) {
		if (!(e === "" || e.trim() === "")) {
			var i = e.match(/<(?:\w+:)?comment[^>]*>/);
			if (i) {
				var a = K(i[0]), o = {
					author: a.authorId && n[a.authorId] || "sheetjsghost",
					ref: a.ref,
					guid: a.guid
				}, s = Dr(a.ref);
				if (!(t.sheetRows && t.sheetRows <= s.r)) {
					var c = e.match(/<(?:\w+:)?text>([\s\S]*)<\/(?:\w+:)?text>/), l = !!c && !!c[1] && gs(c[1]) || {
						r: "",
						t: "",
						h: ""
					};
					o.r = l.r, l.r == "<t></t>" && (l.t = l.h = ""), o.t = (l.t || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"), t.cellHTML && (o.h = l.h), r.push(o);
				}
			}
		}
	}), r;
}
function dl(e) {
	var t = [Ut, Y("comments", null, { xmlns: Tn[0] })], n = [];
	return t.push("<authors>"), e.forEach(function(e) {
		e[1].forEach(function(e) {
			var r = en(e.a);
			n.indexOf(r) == -1 && (n.push(r), t.push("<author>" + r + "</author>")), e.T && e.ID && n.indexOf("tc=" + e.ID) == -1 && (n.push("tc=" + e.ID), t.push("<author>tc=" + e.ID + "</author>"));
		});
	}), n.length == 0 && (n.push("SheetJ5"), t.push("<author>SheetJ5</author>")), t.push("</authors>"), t.push("<commentList>"), e.forEach(function(e) {
		var r = 0, i = [];
		if (e[1][0] && e[1][0].T && e[1][0].ID ? r = n.indexOf("tc=" + e[1][0].ID) : e[1].forEach(function(e) {
			e.a && (r = n.indexOf(en(e.a))), i.push(e.t || "");
		}), t.push("<comment ref=\"" + e[0] + "\" authorId=\"" + r + "\"><text>"), i.length <= 1) t.push(vn("t", en(i[0] || "")));
		else {
			for (var a = "Comment:\n    " + i[0] + "\n", o = 1; o < i.length; ++o) a += "Reply:\n    " + i[o] + "\n";
			t.push(vn("t", en(a)));
		}
		t.push("</text></comment>");
	}), t.push("</commentList>"), t.length > 2 && (t[t.length] = "</comments>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function fl(e, t) {
	var n = [], r = !1, i = {}, a = 0;
	return e.replace(Kt, function(o, s) {
		var c = K(o);
		switch (Yt(c[0])) {
			case "<?xml": break;
			case "<ThreadedComments": break;
			case "</ThreadedComments>": break;
			case "<threadedComment":
				i = {
					author: c.personId,
					guid: c.id,
					ref: c.ref,
					T: 1
				};
				break;
			case "</threadedComment>":
				i.t != null && n.push(i);
				break;
			case "<text>":
			case "<text":
				a = s + o.length;
				break;
			case "</text>":
				i.t = e.slice(a, s).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
				break;
			case "<mentions":
			case "<mentions>":
				r = !0;
				break;
			case "</mentions>":
				r = !1;
				break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>":
			case "<extLst/>": break;
			case "<ext":
				r = !0;
				break;
			case "</ext>":
				r = !1;
				break;
			default: if (!r && t.WTF) throw Error("unrecognized " + c[0] + " in threaded comments");
		}
		return o;
	}), n;
}
function pl(e, t, n) {
	var r = [Ut, Y("ThreadedComments", null, { xmlns: wn.TCMNT }).replace(/[\/]>/, ">")];
	return e.forEach(function(e) {
		var i = "";
		(e[1] || []).forEach(function(a, o) {
			if (!a.T) {
				delete a.ID;
				return;
			}
			a.a && t.indexOf(a.a) == -1 && t.push(a.a);
			var s = {
				ref: e[0],
				id: "{54EE7951-7262-4200-6969-" + ("000000000000" + n.tcid++).slice(-12) + "}"
			};
			o == 0 ? i = s.id : s.parentId = i, a.ID = s.id, a.a && (s.personId = "{54EE7950-7262-4200-6969-" + ("000000000000" + t.indexOf(a.a)).slice(-12) + "}"), r.push(Y("threadedComment", vn("text", a.t || ""), s));
		});
	}), r.push("</ThreadedComments>"), r.join("");
}
function ml(e, t) {
	var n = [], r = !1;
	return e.replace(Kt, function(e) {
		var i = K(e);
		switch (Yt(i[0])) {
			case "<?xml": break;
			case "<personList": break;
			case "</personList>": break;
			case "<person":
				n.push({
					name: i.displayname,
					id: i.id
				});
				break;
			case "</person>": break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>":
			case "<extLst/>": break;
			case "<ext":
				r = !0;
				break;
			case "</ext>":
				r = !1;
				break;
			default: if (!r && t.WTF) throw Error("unrecognized " + i[0] + " in threaded comments");
		}
		return e;
	}), n;
}
function hl(e) {
	var t = [Ut, Y("personList", null, {
		xmlns: wn.TCMNT,
		"xmlns:x": Tn[0]
	}).replace(/[\/]>/, ">")];
	return e.forEach(function(e, n) {
		t.push(Y("person", null, {
			displayName: e,
			id: "{54EE7950-7262-4200-6969-" + ("000000000000" + n).slice(-12) + "}",
			userId: e,
			providerId: "None"
		}));
	}), t.push("</personList>"), t.join("");
}
function gl(e) {
	var t = {};
	t.iauthor = e.read_shift(4);
	var n = Jr(e, 16);
	return t.rfx = n.s, t.ref = X(n.s), e.l += 16, t;
}
var _l = Ir;
function vl(e, t) {
	var n = [], r = [], i = {}, a = !1;
	return fr(e, function(e, o, s) {
		switch (s) {
			case 632:
				r.push(e);
				break;
			case 635:
				i = e;
				break;
			case 637:
				i.t = e.t, i.h = e.h, i.r = e.r;
				break;
			case 636:
				if (i.author = r[i.iauthor], delete i.iauthor, t.sheetRows && i.rfx && t.sheetRows <= i.rfx.r) break;
				i.t ||= "", delete i.rfx, n.push(i);
				break;
			case 3072: break;
			case 35:
				a = !0;
				break;
			case 36:
				a = !1;
				break;
			case 37: break;
			case 38: break;
			default: if (!o.T && (!a || t.WTF)) throw Error("Unexpected record 0x" + s.toString(16));
		}
	}), n;
}
var yl = "application/vnd.ms-office.vbaProject";
function bl(e) {
	var t = G.utils.cfb_new({ root: "R" });
	return e.FullPaths.forEach(function(n, r) {
		if (!(n.slice(-1) === "/" || !n.match(/_VBA_PROJECT_CUR/))) {
			var i = n.replace(/^[^\/]*/, "R").replace(/\/_VBA_PROJECT_CUR\u0000*/, "");
			G.utils.cfb_add(t, i, e.FileIndex[r].content);
		}
	}), G.write(t);
}
var xl = [
	"xlsb",
	"xlsm",
	"xlam",
	"biff8",
	"xla"
];
function Sl() {
	return { "!type": "dialog" };
}
function Cl() {
	return { "!type": "dialog" };
}
function wl() {
	return { "!type": "macro" };
}
function Tl() {
	return { "!type": "macro" };
}
var El = /*#__PURE__*/ (function() {
	var e = /(^|[^A-Za-z_])R(\[?-?\d+\]|[1-9]\d*|)C(\[?-?\d+\]|[1-9]\d*|)(?![A-Za-z0-9_])/g, t = {
		r: 0,
		c: 0
	};
	function n(e, n, r, i) {
		var a = !1, o = !1;
		r.length == 0 ? o = !0 : r.charAt(0) == "[" && (o = !0, r = r.slice(1, -1)), i.length == 0 ? a = !0 : i.charAt(0) == "[" && (a = !0, i = i.slice(1, -1));
		var s = r.length > 0 ? parseInt(r, 10) | 0 : 0, c = i.length > 0 ? parseInt(i, 10) | 0 : 0;
		return a ? c += t.c : --c, o ? s += t.r : --s, n + (a ? "" : "$") + Cr(c) + (o ? "" : "$") + yr(s);
	}
	return function(r, i) {
		return t = i, r.replace(e, n);
	};
})(), Dl = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})(?![_.\(A-Za-z0-9])/g, Ol = /*#__PURE__*/ (function() {
	return function(e, t) {
		return e.replace(Dl, function(e, n, r, i, a, o) {
			var s = Sr(i) - (r ? 0 : t.c), c = vr(o) - (a ? 0 : t.r), l = c == 0 ? "" : a ? c + 1 : "[" + c + "]", u = s == 0 ? "" : r ? s + 1 : "[" + s + "]";
			return n + "R" + l + "C" + u;
		});
	};
})();
function kl(e, t) {
	return e.replace(Dl, function(e, n, r, i, a, o) {
		return n + (r == "$" ? r + i : Cr(Sr(i) + t.c)) + (a == "$" ? a + o : yr(vr(o) + t.r));
	});
}
function Al(e, t, n) {
	var r = Or(t).s, i = Dr(n);
	return kl(e, {
		r: i.r - r.r,
		c: i.c - r.c
	});
}
function jl(e) {
	return e.length != 1;
}
function Ml(e) {
	return e.replace(/_xlfn\./g, "");
}
function Nl(e) {
	e.l += 1;
}
function Pl(e, t) {
	var n = e.read_shift(t == 1 ? 1 : 2);
	return [
		n & 16383,
		n >> 14 & 1,
		n >> 15 & 1
	];
}
function Fl(e, t, n) {
	var r = 2;
	if (n) {
		if (n.biff >= 2 && n.biff <= 5) return Il(e, t, n);
		n.biff == 12 && (r = 4);
	}
	var i = e.read_shift(r), a = e.read_shift(r), o = Pl(e, 2), s = Pl(e, 2);
	return {
		s: {
			r: i,
			c: o[0],
			cRel: o[1],
			rRel: o[2]
		},
		e: {
			r: a,
			c: s[0],
			cRel: s[1],
			rRel: s[2]
		}
	};
}
function Il(e) {
	var t = Pl(e, 2), n = Pl(e, 2), r = e.read_shift(1), i = e.read_shift(1);
	return {
		s: {
			r: t[0],
			c: r,
			cRel: t[1],
			rRel: t[2]
		},
		e: {
			r: n[0],
			c: i,
			cRel: n[1],
			rRel: n[2]
		}
	};
}
function Ll(e, t, n) {
	if (n.biff < 8) return Il(e, t, n);
	var r = e.read_shift(n.biff == 12 ? 4 : 2), i = e.read_shift(n.biff == 12 ? 4 : 2), a = Pl(e, 2), o = Pl(e, 2);
	return {
		s: {
			r,
			c: a[0],
			cRel: a[1],
			rRel: a[2]
		},
		e: {
			r: i,
			c: o[0],
			cRel: o[1],
			rRel: o[2]
		}
	};
}
function Rl(e, t, n) {
	if (n && n.biff >= 2 && n.biff <= 5) return zl(e, t, n);
	var r = e.read_shift(n && n.biff == 12 ? 4 : 2), i = Pl(e, 2);
	return {
		r,
		c: i[0],
		cRel: i[1],
		rRel: i[2]
	};
}
function zl(e) {
	var t = Pl(e, 2), n = e.read_shift(1);
	return {
		r: t[0],
		c: n,
		cRel: t[1],
		rRel: t[2]
	};
}
function Bl(e) {
	var t = e.read_shift(2), n = e.read_shift(2);
	return {
		r: t,
		c: n & 255,
		fQuoted: !!(n & 16384),
		cRel: n >> 15,
		rRel: n >> 15
	};
}
function Vl(e, t, n) {
	var r = n && n.biff ? n.biff : 8;
	if (r >= 2 && r <= 5) return Hl(e, t, n);
	var i = e.read_shift(r >= 12 ? 4 : 2), a = e.read_shift(2), o = (a & 16384) >> 14, s = (a & 32768) >> 15;
	if (a &= 16383, s == 1) for (; i > 524287;) i -= 1048576;
	if (o == 1) for (; a > 8191;) a -= 16384;
	return {
		r: i,
		c: a,
		cRel: o,
		rRel: s
	};
}
function Hl(e) {
	var t = e.read_shift(2), n = e.read_shift(1), r = (t & 32768) >> 15, i = (t & 16384) >> 14;
	return t &= 16383, r == 1 && t >= 8192 && (t -= 16384), i == 1 && n >= 128 && (n -= 256), {
		r: t,
		c: n,
		cRel: i,
		rRel: r
	};
}
function Ul(e, t, n) {
	return [(e[e.l++] & 96) >> 5, Fl(e, n.biff >= 2 && n.biff <= 5 ? 6 : 8, n)];
}
function Wl(e, t, n) {
	var r = (e[e.l++] & 96) >> 5, i = e.read_shift(2, "i"), a = 8;
	if (n) switch (n.biff) {
		case 5:
			e.l += 12, a = 6;
			break;
		case 12:
			a = 12;
			break;
	}
	return [
		r,
		i,
		Fl(e, a, n)
	];
}
function Gl(e, t, n) {
	var r = (e[e.l++] & 96) >> 5;
	return e.l += n && n.biff > 8 ? 12 : n.biff < 8 ? 6 : 8, [r];
}
function Kl(e, t, n) {
	var r = (e[e.l++] & 96) >> 5, i = e.read_shift(2), a = 8;
	if (n) switch (n.biff) {
		case 5:
			e.l += 12, a = 6;
			break;
		case 12:
			a = 12;
			break;
	}
	return e.l += a, [r, i];
}
function ql(e, t, n) {
	return [(e[e.l++] & 96) >> 5, Ll(e, t - 1, n)];
}
function Jl(e, t, n) {
	var r = (e[e.l++] & 96) >> 5;
	return e.l += n.biff == 2 ? 6 : n.biff == 12 ? 14 : 7, [r];
}
function Yl(e) {
	var t = e[e.l + 1] & 1;
	return e.l += 4, [t, 1];
}
function Xl(e, t, n) {
	e.l += 2;
	for (var r = e.read_shift(n && n.biff == 2 ? 1 : 2), i = [], a = 0; a <= r; ++a) i.push(e.read_shift(n && n.biff == 2 ? 1 : 2));
	return i;
}
function Zl(e, t, n) {
	var r = e[e.l + 1] & 255 ? 1 : 0;
	return e.l += 2, [r, e.read_shift(n && n.biff == 2 ? 1 : 2)];
}
function Ql(e, t, n) {
	var r = e[e.l + 1] & 255 ? 1 : 0;
	return e.l += 2, [r, e.read_shift(n && n.biff == 2 ? 1 : 2)];
}
function $l(e) {
	var t = e[e.l + 1] & 255 ? 1 : 0;
	return e.l += 2, [t, e.read_shift(2)];
}
function eu(e, t, n) {
	var r = e[e.l + 1] & 255 ? 1 : 0;
	return e.l += n && n.biff == 2 ? 3 : 4, [r];
}
function tu(e) {
	return [e.read_shift(1), e.read_shift(1)];
}
function nu(e) {
	return e.read_shift(2), tu(e, 2);
}
function ru(e) {
	return e.read_shift(2), tu(e, 2);
}
function iu(e, t, n) {
	var r = (e[e.l] & 96) >> 5;
	return e.l += 1, [r, Rl(e, 0, n)];
}
function au(e, t, n) {
	var r = (e[e.l] & 96) >> 5;
	return e.l += 1, [r, Vl(e, 0, n)];
}
function ou(e, t, n) {
	var r = (e[e.l] & 96) >> 5;
	e.l += 1;
	var i = e.read_shift(2);
	return n && n.biff == 5 && (e.l += 12), [
		r,
		i,
		Rl(e, 0, n)
	];
}
function su(e, t, n) {
	var r = (e[e.l] & 96) >> 5;
	e.l += 1;
	var i = e.read_shift(n && n.biff <= 3 ? 1 : 2);
	return [
		xd[i],
		bd[i],
		r
	];
}
function cu(e, t, n) {
	var r = e[e.l++], i = e.read_shift(1), a = n && n.biff <= 3 ? [r == 88 ? -1 : 0, e.read_shift(1)] : lu(e);
	return [i, (a[0] === 0 ? bd : yd)[a[1]]];
}
function lu(e) {
	return [e[e.l + 1] >> 7, e.read_shift(2) & 32767];
}
function uu(e, t, n) {
	e.l += n && n.biff == 2 ? 3 : 4;
}
function du(e, t, n) {
	return e.l++, n && n.biff == 12 ? [e.read_shift(4, "i"), 0] : [e.read_shift(2), e.read_shift(n && n.biff == 2 ? 1 : 2)];
}
function fu(e) {
	return e.l++, bi[e.read_shift(1)];
}
function pu(e) {
	return e.l++, e.read_shift(2);
}
function mu(e) {
	return e.l++, e.read_shift(1) !== 0;
}
function hu(e) {
	return e.l++, Yr(e, 8);
}
function gu(e, t, n) {
	return e.l++, ga(e, t - 1, n);
}
function _u(e, t) {
	var n = [e.read_shift(1)];
	if (t == 12) switch (n[0]) {
		case 2:
			n[0] = 4;
			break;
		case 4:
			n[0] = 16;
			break;
		case 0:
			n[0] = 1;
			break;
		case 1:
			n[0] = 2;
			break;
	}
	switch (n[0]) {
		case 4:
			n[1] = fa(e, 1) ? "TRUE" : "FALSE", t != 12 && (e.l += 7);
			break;
		case 37:
		case 16:
			n[1] = bi[e[e.l]], e.l += t == 12 ? 4 : 8;
			break;
		case 0:
			e.l += 8;
			break;
		case 1:
			n[1] = Yr(e, 8);
			break;
		case 2:
			n[1] = ba(e, 0, { biff: t > 0 && t < 8 ? 2 : t });
			break;
		default: throw Error("Bad SerAr: " + n[0]);
	}
	return n;
}
function vu(e, t, n) {
	for (var r = e.read_shift(n.biff == 12 ? 4 : 2), i = [], a = 0; a != r; ++a) i.push((n.biff == 12 ? Jr : Fa)(e, 8));
	return i;
}
function yu(e, t, n) {
	var r = 0, i = 0;
	n.biff == 12 ? (r = e.read_shift(4), i = e.read_shift(4)) : (i = 1 + e.read_shift(1), r = 1 + e.read_shift(2)), n.biff >= 2 && n.biff < 8 && (--r, --i == 0 && (i = 256));
	for (var a = 0, o = []; a != r && (o[a] = []); ++a) for (var s = 0; s != i; ++s) o[a][s] = _u(e, n.biff);
	return o;
}
function bu(e, t, n) {
	var r = e.read_shift(1) >>> 5 & 3, i = !n || n.biff >= 8 ? 4 : 2, a = e.read_shift(i);
	switch (n.biff) {
		case 2:
			e.l += 5;
			break;
		case 3:
		case 4:
			e.l += 8;
			break;
		case 5:
			e.l += 12;
			break;
	}
	return [
		r,
		0,
		a
	];
}
function xu(e, t, n) {
	return n.biff == 5 ? Su(e, t, n) : [
		e.read_shift(1) >>> 5 & 3,
		e.read_shift(2),
		e.read_shift(4)
	];
}
function Su(e) {
	var t = e.read_shift(1) >>> 5 & 3, n = e.read_shift(2, "i");
	e.l += 8;
	var r = e.read_shift(2);
	return e.l += 12, [
		t,
		n,
		r
	];
}
function Cu(e, t, n) {
	var r = e.read_shift(1) >>> 5 & 3;
	return e.l += n && n.biff == 2 ? 3 : 4, [r, e.read_shift(n && n.biff == 2 ? 1 : 2)];
}
function wu(e, t, n) {
	return [e.read_shift(1) >>> 5 & 3, e.read_shift(n && n.biff == 2 ? 1 : 2)];
}
function Tu(e, t, n) {
	var r = e.read_shift(1) >>> 5 & 3;
	return e.l += 4, n.biff < 8 && e.l--, n.biff == 12 && (e.l += 2), [r];
}
function Eu(e, t, n) {
	var r = (e[e.l++] & 96) >> 5, i = e.read_shift(2), a = 4;
	if (n) switch (n.biff) {
		case 5:
			a = 15;
			break;
		case 12:
			a = 6;
			break;
	}
	return e.l += a, [r, i];
}
var Du = ur, Ou = ur, ku = ur;
function Au(e, t, n) {
	return e.l += 2, [Bl(e, 4, n)];
}
function ju(e) {
	return e.l += 6, [];
}
var Mu = Au, Nu = ju, Pu = ju, Fu = Au;
function Iu(e) {
	return e.l += 2, [pa(e), e.read_shift(2) & 1];
}
var Lu = Au, Ru = Iu, zu = ju, Bu = Au, Vu = Au, Hu = [
	"Data",
	"All",
	"Headers",
	"??",
	"?Data2",
	"??",
	"?DataHeaders",
	"??",
	"Totals",
	"??",
	"??",
	"??",
	"?DataTotals",
	"??",
	"??",
	"??",
	"?Current"
];
function Uu(e) {
	e.l += 2;
	var t = e.read_shift(2), n = e.read_shift(2), r = e.read_shift(4), i = e.read_shift(2), a = e.read_shift(2), o = Hu[n >> 2 & 31];
	return {
		ixti: t,
		coltype: n & 3,
		rt: o,
		idx: r,
		c: i,
		C: a
	};
}
function Wu(e) {
	return e.l += 2, [e.read_shift(4)];
}
function Gu(e, t, n) {
	return e.l += 5, e.l += 2, e.l += n.biff == 2 ? 1 : 4, ["PTGSHEET"];
}
function Ku(e, t, n) {
	return e.l += n.biff == 2 ? 4 : 5, ["PTGENDSHEET"];
}
function qu(e) {
	return [e.read_shift(1) >>> 5 & 3, e.read_shift(2)];
}
function Ju(e) {
	return [e.read_shift(1) >>> 5 & 3, e.read_shift(2)];
}
function Yu(e) {
	return e.l += 4, [0, 0];
}
var Xu = {
	1: {
		n: "PtgExp",
		f: du
	},
	2: {
		n: "PtgTbl",
		f: ku
	},
	3: {
		n: "PtgAdd",
		f: Nl
	},
	4: {
		n: "PtgSub",
		f: Nl
	},
	5: {
		n: "PtgMul",
		f: Nl
	},
	6: {
		n: "PtgDiv",
		f: Nl
	},
	7: {
		n: "PtgPower",
		f: Nl
	},
	8: {
		n: "PtgConcat",
		f: Nl
	},
	9: {
		n: "PtgLt",
		f: Nl
	},
	10: {
		n: "PtgLe",
		f: Nl
	},
	11: {
		n: "PtgEq",
		f: Nl
	},
	12: {
		n: "PtgGe",
		f: Nl
	},
	13: {
		n: "PtgGt",
		f: Nl
	},
	14: {
		n: "PtgNe",
		f: Nl
	},
	15: {
		n: "PtgIsect",
		f: Nl
	},
	16: {
		n: "PtgUnion",
		f: Nl
	},
	17: {
		n: "PtgRange",
		f: Nl
	},
	18: {
		n: "PtgUplus",
		f: Nl
	},
	19: {
		n: "PtgUminus",
		f: Nl
	},
	20: {
		n: "PtgPercent",
		f: Nl
	},
	21: {
		n: "PtgParen",
		f: Nl
	},
	22: {
		n: "PtgMissArg",
		f: Nl
	},
	23: {
		n: "PtgStr",
		f: gu
	},
	26: {
		n: "PtgSheet",
		f: Gu
	},
	27: {
		n: "PtgEndSheet",
		f: Ku
	},
	28: {
		n: "PtgErr",
		f: fu
	},
	29: {
		n: "PtgBool",
		f: mu
	},
	30: {
		n: "PtgInt",
		f: pu
	},
	31: {
		n: "PtgNum",
		f: hu
	},
	32: {
		n: "PtgArray",
		f: Jl
	},
	33: {
		n: "PtgFunc",
		f: su
	},
	34: {
		n: "PtgFuncVar",
		f: cu
	},
	35: {
		n: "PtgName",
		f: bu
	},
	36: {
		n: "PtgRef",
		f: iu
	},
	37: {
		n: "PtgArea",
		f: Ul
	},
	38: {
		n: "PtgMemArea",
		f: Cu
	},
	39: {
		n: "PtgMemErr",
		f: Du
	},
	40: {
		n: "PtgMemNoMem",
		f: Ou
	},
	41: {
		n: "PtgMemFunc",
		f: wu
	},
	42: {
		n: "PtgRefErr",
		f: Tu
	},
	43: {
		n: "PtgAreaErr",
		f: Gl
	},
	44: {
		n: "PtgRefN",
		f: au
	},
	45: {
		n: "PtgAreaN",
		f: ql
	},
	46: {
		n: "PtgMemAreaN",
		f: qu
	},
	47: {
		n: "PtgMemNoMemN",
		f: Ju
	},
	57: {
		n: "PtgNameX",
		f: xu
	},
	58: {
		n: "PtgRef3d",
		f: ou
	},
	59: {
		n: "PtgArea3d",
		f: Wl
	},
	60: {
		n: "PtgRefErr3d",
		f: Eu
	},
	61: {
		n: "PtgAreaErr3d",
		f: Kl
	},
	255: {}
}, Zu = {
	64: 32,
	96: 32,
	65: 33,
	97: 33,
	66: 34,
	98: 34,
	67: 35,
	99: 35,
	68: 36,
	100: 36,
	69: 37,
	101: 37,
	70: 38,
	102: 38,
	71: 39,
	103: 39,
	72: 40,
	104: 40,
	73: 41,
	105: 41,
	74: 42,
	106: 42,
	75: 43,
	107: 43,
	76: 44,
	108: 44,
	77: 45,
	109: 45,
	78: 46,
	110: 46,
	79: 47,
	111: 47,
	88: 34,
	120: 34,
	89: 57,
	121: 57,
	90: 58,
	122: 58,
	91: 59,
	123: 59,
	92: 60,
	124: 60,
	93: 61,
	125: 61
}, Qu = {
	1: {
		n: "PtgElfLel",
		f: Iu
	},
	2: {
		n: "PtgElfRw",
		f: Bu
	},
	3: {
		n: "PtgElfCol",
		f: Mu
	},
	6: {
		n: "PtgElfRwV",
		f: Vu
	},
	7: {
		n: "PtgElfColV",
		f: Fu
	},
	10: {
		n: "PtgElfRadical",
		f: Lu
	},
	11: {
		n: "PtgElfRadicalS",
		f: zu
	},
	13: {
		n: "PtgElfColS",
		f: Nu
	},
	15: {
		n: "PtgElfColSV",
		f: Pu
	},
	16: {
		n: "PtgElfRadicalLel",
		f: Ru
	},
	25: {
		n: "PtgList",
		f: Uu
	},
	29: {
		n: "PtgSxName",
		f: Wu
	},
	255: {}
}, $u = {
	0: {
		n: "PtgAttrNoop",
		f: Yu
	},
	1: {
		n: "PtgAttrSemi",
		f: eu
	},
	2: {
		n: "PtgAttrIf",
		f: Ql
	},
	4: {
		n: "PtgAttrChoose",
		f: Xl
	},
	8: {
		n: "PtgAttrGoto",
		f: Zl
	},
	16: {
		n: "PtgAttrSum",
		f: uu
	},
	32: {
		n: "PtgAttrBaxcel",
		f: Yl
	},
	33: {
		n: "PtgAttrBaxcel",
		f: Yl
	},
	64: {
		n: "PtgAttrSpace",
		f: nu
	},
	65: {
		n: "PtgAttrSpaceSemi",
		f: ru
	},
	128: {
		n: "PtgAttrIfError",
		f: $l
	},
	255: {}
};
function ed(e, t, n, r) {
	if (r.biff < 8) return ur(e, t);
	for (var i = e.l + t, a = [], o = 0; o !== n.length; ++o) switch (n[o][0]) {
		case "PtgArray":
			n[o][1] = yu(e, 0, r), a.push(n[o][1]);
			break;
		case "PtgMemArea":
			n[o][2] = vu(e, n[o][1], r), a.push(n[o][2]);
			break;
		case "PtgExp":
			r && r.biff == 12 && (n[o][1][1] = e.read_shift(4), a.push(n[o][1]));
			break;
		case "PtgList":
		case "PtgElfRadicalS":
		case "PtgElfColS":
		case "PtgElfColSV": throw "Unsupported " + n[o][0];
		default: break;
	}
	return t = i - e.l, t !== 0 && a.push(ur(e, t)), a;
}
function td(e, t, n) {
	for (var r = e.l + t, i, a, o = []; r != e.l;) t = r - e.l, a = e[e.l], i = Xu[a] || Xu[Zu[a]], (a === 24 || a === 25) && (i = (a === 24 ? Qu : $u)[e[e.l + 1]]), !i || !i.f ? ur(e, t) : o.push([i.n, i.f(e, t, n)]);
	return o;
}
function nd(e) {
	for (var t = [], n = 0; n < e.length; ++n) {
		for (var r = e[n], i = [], a = 0; a < r.length; ++a) {
			var o = r[a];
			if (o) switch (o[0]) {
				case 2:
					i.push("\"" + o[1].replace(/"/g, "\"\"") + "\"");
					break;
				default: i.push(o[1]);
			}
			else i.push("");
		}
		t.push(i.join(","));
	}
	return t.join(";");
}
var rd = {
	PtgAdd: "+",
	PtgConcat: "&",
	PtgDiv: "/",
	PtgEq: "=",
	PtgGe: ">=",
	PtgGt: ">",
	PtgLe: "<=",
	PtgLt: "<",
	PtgMul: "*",
	PtgNe: "<>",
	PtgPower: "^",
	PtgSub: "-"
};
function id(e, t) {
	if (!e && !(t && t.biff <= 5 && t.biff >= 2)) throw Error("empty sheet name");
	return /[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(e) ? "'" + e + "'" : e;
}
function ad(e, t, n) {
	if (!e) return "SH33TJSERR0";
	if (n.biff > 8 && (!e.XTI || !e.XTI[t])) return e.SheetNames[t];
	if (!e.XTI) return "SH33TJSERR6";
	var r = e.XTI[t];
	if (n.biff < 8) return t > 1e4 && (t -= 65536), t < 0 && (t = -t), t == 0 ? "" : e.XTI[t - 1];
	if (!r) return "SH33TJSERR1";
	var i = "";
	if (n.biff > 8) switch (e[r[0]][0]) {
		case 357: return i = r[1] == -1 ? "#REF" : e.SheetNames[r[1]], r[1] == r[2] ? i : i + ":" + e.SheetNames[r[2]];
		case 358: return n.SID == null ? "SH33TJSSAME" + e[r[0]][0] : e.SheetNames[n.SID];
		case 355:
		default: return "SH33TJSSRC" + e[r[0]][0];
	}
	switch (e[r[0]][0][0]) {
		case 1025: return i = r[1] == -1 ? "#REF" : e.SheetNames[r[1]] || "SH33TJSERR3", r[1] == r[2] ? i : i + ":" + e.SheetNames[r[2]];
		case 14849: return e[r[0]].slice(1).map(function(e) {
			return e.Name;
		}).join(";;");
		default: return e[r[0]][0][3] ? (i = r[1] == -1 ? "#REF" : e[r[0]][0][3][r[1]] || "SH33TJSERR4", r[1] == r[2] ? i : i + ":" + e[r[0]][0][3][r[2]]) : "SH33TJSERR2";
	}
}
function od(e, t, n) {
	var r = ad(e, t, n);
	return r == "#REF" ? r : id(r, n);
}
function sd(e, t, n, r, i) {
	var a = i && i.biff || 8, o = {
		s: {
			c: 0,
			r: 0
		},
		e: {
			c: 0,
			r: 0
		}
	}, s = [], c, l, u, d = 0, f = 0, p, m = "";
	if (!e[0] || !e[0][0]) return "";
	for (var h = -1, g = "", _ = 0, v = e[0].length; _ < v; ++_) {
		var y = e[0][_];
		switch (y[0]) {
			case "PtgUminus":
				s.push("-" + s.pop());
				break;
			case "PtgUplus":
				s.push("+" + s.pop());
				break;
			case "PtgPercent":
				s.push(s.pop() + "%");
				break;
			case "PtgAdd":
			case "PtgConcat":
			case "PtgDiv":
			case "PtgEq":
			case "PtgGe":
			case "PtgGt":
			case "PtgLe":
			case "PtgLt":
			case "PtgMul":
			case "PtgNe":
			case "PtgPower":
			case "PtgSub":
				if (c = s.pop(), l = s.pop(), h >= 0) {
					switch (e[0][h][1][0]) {
						case 0:
							g = Tt(" ", e[0][h][1][1]);
							break;
						case 1:
							g = Tt("\r", e[0][h][1][1]);
							break;
						default: if (g = "", i.WTF) throw Error("Unexpected PtgAttrSpaceType " + e[0][h][1][0]);
					}
					l += g, h = -1;
				}
				s.push(l + rd[y[0]] + c);
				break;
			case "PtgIsect":
				c = s.pop(), l = s.pop(), s.push(l + " " + c);
				break;
			case "PtgUnion":
				c = s.pop(), l = s.pop(), s.push(l + "," + c);
				break;
			case "PtgRange":
				c = s.pop(), l = s.pop(), s.push(l + ":" + c);
				break;
			case "PtgAttrChoose": break;
			case "PtgAttrGoto": break;
			case "PtgAttrIf": break;
			case "PtgAttrIfError": break;
			case "PtgRef":
				u = mr(y[1][1], o, i), s.push(gr(u, a));
				break;
			case "PtgRefN":
				u = n ? mr(y[1][1], n, i) : y[1][1], s.push(gr(u, a));
				break;
			case "PtgRef3d":
				d = y[1][1], u = mr(y[1][2], o, i), m = od(r, d, i), s.push(m + "!" + gr(u, a));
				break;
			case "PtgFunc":
			case "PtgFuncVar":
				var b = y[1][0], x = y[1][1];
				b ||= 0, b &= 127;
				var S = b == 0 ? [] : s.slice(-b);
				s.length -= b, x === "User" && (x = S.shift()), s.push(x + "(" + S.join(",") + ")");
				break;
			case "PtgBool":
				s.push(y[1] ? "TRUE" : "FALSE");
				break;
			case "PtgInt":
				s.push(y[1]);
				break;
			case "PtgNum":
				s.push(String(y[1]));
				break;
			case "PtgStr":
				s.push("\"" + y[1].replace(/"/g, "\"\"") + "\"");
				break;
			case "PtgErr":
				s.push(y[1]);
				break;
			case "PtgAreaN":
				p = hr(y[1][1], n ? { s: n } : o, i), s.push(_r(p, i));
				break;
			case "PtgArea":
				p = hr(y[1][1], o, i), s.push(_r(p, i));
				break;
			case "PtgArea3d":
				d = y[1][1], p = y[1][2], m = od(r, d, i), s.push(m + "!" + _r(p, i));
				break;
			case "PtgAttrSum":
				s.push("SUM(" + s.pop() + ")");
				break;
			case "PtgAttrBaxcel":
			case "PtgAttrSemi": break;
			case "PtgName":
				f = y[1][2];
				var C = (r.names || [])[f - 1] || (r[0] || [])[f], w = C ? C.Name : "SH33TJSNAME" + String(f);
				w && w.slice(0, 6) == "_xlfn." && !i.xlfn && (w = w.slice(6)), s.push(w);
				break;
			case "PtgNameX":
				var T = y[1][1];
				f = y[1][2];
				var E;
				if (i.biff <= 5) T < 0 && (T = -T), r[T] && (E = r[T][f]);
				else {
					var D = "";
					if (((r[T] || [])[0] || [])[0] == 14849 || (((r[T] || [])[0] || [])[0] == 1025 ? r[T][f] && r[T][f].itab > 0 && (D = r.SheetNames[r[T][f].itab - 1] + "!") : D = r.SheetNames[f - 1] + "!"), r[T] && r[T][f]) D += r[T][f].Name;
					else if (r[0] && r[0][f]) D += r[0][f].Name;
					else {
						var O = (ad(r, T, i) || "").split(";;");
						O[f - 1] ? D = O[f - 1] : D += "SH33TJSERRX";
					}
					s.push(D);
					break;
				}
				E ||= { Name: "SH33TJSERRY" }, s.push(E.Name);
				break;
			case "PtgParen":
				var k = "(", A = ")";
				if (h >= 0) {
					switch (g = "", e[0][h][1][0]) {
						case 2:
							k = Tt(" ", e[0][h][1][1]) + k;
							break;
						case 3:
							k = Tt("\r", e[0][h][1][1]) + k;
							break;
						case 4:
							A = Tt(" ", e[0][h][1][1]) + A;
							break;
						case 5:
							A = Tt("\r", e[0][h][1][1]) + A;
							break;
						default: if (i.WTF) throw Error("Unexpected PtgAttrSpaceType " + e[0][h][1][0]);
					}
					h = -1;
				}
				s.push(k + s.pop() + A);
				break;
			case "PtgRefErr":
				s.push("#REF!");
				break;
			case "PtgRefErr3d":
				s.push("#REF!");
				break;
			case "PtgExp":
				u = {
					c: y[1][1],
					r: y[1][0]
				};
				var j = {
					c: n.c,
					r: n.r
				};
				if (r.sharedf[X(u)]) {
					var M = r.sharedf[X(u)];
					s.push(sd(M, o, j, r, i));
				} else {
					var N = !1;
					for (c = 0; c != r.arrayf.length; ++c) if (l = r.arrayf[c], !(u.c < l[0].s.c || u.c > l[0].e.c) && !(u.r < l[0].s.r || u.r > l[0].e.r)) {
						s.push(sd(l[1], o, j, r, i)), N = !0;
						break;
					}
					N || s.push(y[1]);
				}
				break;
			case "PtgArray":
				s.push("{" + nd(y[1]) + "}");
				break;
			case "PtgMemArea": break;
			case "PtgAttrSpace":
			case "PtgAttrSpaceSemi":
				h = _;
				break;
			case "PtgTbl": break;
			case "PtgMemErr": break;
			case "PtgMissArg":
				s.push("");
				break;
			case "PtgAreaErr":
				s.push("#REF!");
				break;
			case "PtgAreaErr3d":
				s.push("#REF!");
				break;
			case "PtgList":
				s.push("Table" + y[1].idx + "[#" + y[1].rt + "]");
				break;
			case "PtgMemAreaN":
			case "PtgMemNoMemN":
			case "PtgAttrNoop":
			case "PtgSheet":
			case "PtgEndSheet": break;
			case "PtgMemFunc": break;
			case "PtgMemNoMem": break;
			case "PtgElfCol":
			case "PtgElfColS":
			case "PtgElfColSV":
			case "PtgElfColV":
			case "PtgElfLel":
			case "PtgElfRadical":
			case "PtgElfRadicalLel":
			case "PtgElfRadicalS":
			case "PtgElfRw":
			case "PtgElfRwV": throw Error("Unsupported ELFs");
			case "PtgSxName": throw Error("Unrecognized Formula Token: " + String(y));
			default: throw Error("Unrecognized Formula Token: " + String(y));
		}
		if (i.biff != 3 && h >= 0 && [
			"PtgAttrSpace",
			"PtgAttrSpaceSemi",
			"PtgAttrGoto"
		].indexOf(e[0][_][0]) == -1) {
			y = e[0][h];
			var P = !0;
			switch (y[1][0]) {
				case 4: P = !1;
				case 0:
					g = Tt(" ", y[1][1]);
					break;
				case 5: P = !1;
				case 1:
					g = Tt("\r", y[1][1]);
					break;
				default: if (g = "", i.WTF) throw Error("Unexpected PtgAttrSpaceType " + y[1][0]);
			}
			s.push((P ? g : "") + s.pop() + (P ? "" : g)), h = -1;
		}
	}
	if (s.length > 1 && i.WTF) throw Error("bad formula stack");
	return s[0];
}
function cd(e, t, n) {
	var r = e.l + t, i = n.biff == 2 ? 1 : 2, a, o = e.read_shift(i);
	if (o == 65535) return [[], ur(e, t - 2)];
	var s = td(e, o, n);
	return t !== o + i && (a = ed(e, t - o - i, s, n)), e.l = r, [s, a];
}
function ld(e, t, n) {
	var r = e.l + t, i = n.biff == 2 ? 1 : 2, a, o = e.read_shift(i);
	if (o == 65535) return [[], ur(e, t - 2)];
	var s = td(e, o, n);
	return t !== o + i && (a = ed(e, t - o - i, s, n)), e.l = r, [s, a];
}
function ud(e, t, n, r) {
	var i = e.l + t, a = td(e, r, n), o;
	return i !== e.l && (o = ed(e, i - e.l, a, n)), [a, o];
}
function dd(e, t, n) {
	var r = e.l + t, i, a = e.read_shift(2), o = td(e, a, n);
	return a == 65535 ? [[], ur(e, t - 2)] : (t !== a + 2 && (i = ed(e, r - a - 2, o, n)), [o, i]);
}
function fd(e) {
	var t;
	if (Qn(e, e.l + 6) !== 65535) return [Yr(e), "n"];
	switch (e[e.l]) {
		case 0: return e.l += 8, ["String", "s"];
		case 1: return t = e[e.l + 2] === 1, e.l += 8, [t, "b"];
		case 2: return t = e[e.l + 2], e.l += 8, [t, "e"];
		case 3: return e.l += 8, ["", "s"];
	}
	return [];
}
function pd(e, t, n) {
	var r = e.l + t, i = ka(e, 6);
	n.biff == 2 && ++e.l;
	var a = fd(e, 8), o = e.read_shift(1);
	n.biff != 2 && (e.read_shift(1), n.biff >= 5 && e.read_shift(4));
	var s = ld(e, r - e.l, n);
	return {
		cell: i,
		val: a[0],
		formula: s,
		shared: o >> 3 & 1,
		tt: a[1]
	};
}
function md(e, t, n) {
	var r = td(e, e.read_shift(4), n), i = e.read_shift(4);
	return [r, i > 0 ? ed(e, i, r, n) : null];
}
var hd = md, gd = md, _d = md, vd = md, yd = {
	0: "BEEP",
	1: "OPEN",
	2: "OPEN.LINKS",
	3: "CLOSE.ALL",
	4: "SAVE",
	5: "SAVE.AS",
	6: "FILE.DELETE",
	7: "PAGE.SETUP",
	8: "PRINT",
	9: "PRINTER.SETUP",
	10: "QUIT",
	11: "NEW.WINDOW",
	12: "ARRANGE.ALL",
	13: "WINDOW.SIZE",
	14: "WINDOW.MOVE",
	15: "FULL",
	16: "CLOSE",
	17: "RUN",
	22: "SET.PRINT.AREA",
	23: "SET.PRINT.TITLES",
	24: "SET.PAGE.BREAK",
	25: "REMOVE.PAGE.BREAK",
	26: "FONT",
	27: "DISPLAY",
	28: "PROTECT.DOCUMENT",
	29: "PRECISION",
	30: "A1.R1C1",
	31: "CALCULATE.NOW",
	32: "CALCULATION",
	34: "DATA.FIND",
	35: "EXTRACT",
	36: "DATA.DELETE",
	37: "SET.DATABASE",
	38: "SET.CRITERIA",
	39: "SORT",
	40: "DATA.SERIES",
	41: "TABLE",
	42: "FORMAT.NUMBER",
	43: "ALIGNMENT",
	44: "STYLE",
	45: "BORDER",
	46: "CELL.PROTECTION",
	47: "COLUMN.WIDTH",
	48: "UNDO",
	49: "CUT",
	50: "COPY",
	51: "PASTE",
	52: "CLEAR",
	53: "PASTE.SPECIAL",
	54: "EDIT.DELETE",
	55: "INSERT",
	56: "FILL.RIGHT",
	57: "FILL.DOWN",
	61: "DEFINE.NAME",
	62: "CREATE.NAMES",
	63: "FORMULA.GOTO",
	64: "FORMULA.FIND",
	65: "SELECT.LAST.CELL",
	66: "SHOW.ACTIVE.CELL",
	67: "GALLERY.AREA",
	68: "GALLERY.BAR",
	69: "GALLERY.COLUMN",
	70: "GALLERY.LINE",
	71: "GALLERY.PIE",
	72: "GALLERY.SCATTER",
	73: "COMBINATION",
	74: "PREFERRED",
	75: "ADD.OVERLAY",
	76: "GRIDLINES",
	77: "SET.PREFERRED",
	78: "AXES",
	79: "LEGEND",
	80: "ATTACH.TEXT",
	81: "ADD.ARROW",
	82: "SELECT.CHART",
	83: "SELECT.PLOT.AREA",
	84: "PATTERNS",
	85: "MAIN.CHART",
	86: "OVERLAY",
	87: "SCALE",
	88: "FORMAT.LEGEND",
	89: "FORMAT.TEXT",
	90: "EDIT.REPEAT",
	91: "PARSE",
	92: "JUSTIFY",
	93: "HIDE",
	94: "UNHIDE",
	95: "WORKSPACE",
	96: "FORMULA",
	97: "FORMULA.FILL",
	98: "FORMULA.ARRAY",
	99: "DATA.FIND.NEXT",
	100: "DATA.FIND.PREV",
	101: "FORMULA.FIND.NEXT",
	102: "FORMULA.FIND.PREV",
	103: "ACTIVATE",
	104: "ACTIVATE.NEXT",
	105: "ACTIVATE.PREV",
	106: "UNLOCKED.NEXT",
	107: "UNLOCKED.PREV",
	108: "COPY.PICTURE",
	109: "SELECT",
	110: "DELETE.NAME",
	111: "DELETE.FORMAT",
	112: "VLINE",
	113: "HLINE",
	114: "VPAGE",
	115: "HPAGE",
	116: "VSCROLL",
	117: "HSCROLL",
	118: "ALERT",
	119: "NEW",
	120: "CANCEL.COPY",
	121: "SHOW.CLIPBOARD",
	122: "MESSAGE",
	124: "PASTE.LINK",
	125: "APP.ACTIVATE",
	126: "DELETE.ARROW",
	127: "ROW.HEIGHT",
	128: "FORMAT.MOVE",
	129: "FORMAT.SIZE",
	130: "FORMULA.REPLACE",
	131: "SEND.KEYS",
	132: "SELECT.SPECIAL",
	133: "APPLY.NAMES",
	134: "REPLACE.FONT",
	135: "FREEZE.PANES",
	136: "SHOW.INFO",
	137: "SPLIT",
	138: "ON.WINDOW",
	139: "ON.DATA",
	140: "DISABLE.INPUT",
	142: "OUTLINE",
	143: "LIST.NAMES",
	144: "FILE.CLOSE",
	145: "SAVE.WORKBOOK",
	146: "DATA.FORM",
	147: "COPY.CHART",
	148: "ON.TIME",
	149: "WAIT",
	150: "FORMAT.FONT",
	151: "FILL.UP",
	152: "FILL.LEFT",
	153: "DELETE.OVERLAY",
	155: "SHORT.MENUS",
	159: "SET.UPDATE.STATUS",
	161: "COLOR.PALETTE",
	162: "DELETE.STYLE",
	163: "WINDOW.RESTORE",
	164: "WINDOW.MAXIMIZE",
	166: "CHANGE.LINK",
	167: "CALCULATE.DOCUMENT",
	168: "ON.KEY",
	169: "APP.RESTORE",
	170: "APP.MOVE",
	171: "APP.SIZE",
	172: "APP.MINIMIZE",
	173: "APP.MAXIMIZE",
	174: "BRING.TO.FRONT",
	175: "SEND.TO.BACK",
	185: "MAIN.CHART.TYPE",
	186: "OVERLAY.CHART.TYPE",
	187: "SELECT.END",
	188: "OPEN.MAIL",
	189: "SEND.MAIL",
	190: "STANDARD.FONT",
	191: "CONSOLIDATE",
	192: "SORT.SPECIAL",
	193: "GALLERY.3D.AREA",
	194: "GALLERY.3D.COLUMN",
	195: "GALLERY.3D.LINE",
	196: "GALLERY.3D.PIE",
	197: "VIEW.3D",
	198: "GOAL.SEEK",
	199: "WORKGROUP",
	200: "FILL.GROUP",
	201: "UPDATE.LINK",
	202: "PROMOTE",
	203: "DEMOTE",
	204: "SHOW.DETAIL",
	206: "UNGROUP",
	207: "OBJECT.PROPERTIES",
	208: "SAVE.NEW.OBJECT",
	209: "SHARE",
	210: "SHARE.NAME",
	211: "DUPLICATE",
	212: "APPLY.STYLE",
	213: "ASSIGN.TO.OBJECT",
	214: "OBJECT.PROTECTION",
	215: "HIDE.OBJECT",
	216: "SET.EXTRACT",
	217: "CREATE.PUBLISHER",
	218: "SUBSCRIBE.TO",
	219: "ATTRIBUTES",
	220: "SHOW.TOOLBAR",
	222: "PRINT.PREVIEW",
	223: "EDIT.COLOR",
	224: "SHOW.LEVELS",
	225: "FORMAT.MAIN",
	226: "FORMAT.OVERLAY",
	227: "ON.RECALC",
	228: "EDIT.SERIES",
	229: "DEFINE.STYLE",
	240: "LINE.PRINT",
	243: "ENTER.DATA",
	249: "GALLERY.RADAR",
	250: "MERGE.STYLES",
	251: "EDITION.OPTIONS",
	252: "PASTE.PICTURE",
	253: "PASTE.PICTURE.LINK",
	254: "SPELLING",
	256: "ZOOM",
	259: "INSERT.OBJECT",
	260: "WINDOW.MINIMIZE",
	265: "SOUND.NOTE",
	266: "SOUND.PLAY",
	267: "FORMAT.SHAPE",
	268: "EXTEND.POLYGON",
	269: "FORMAT.AUTO",
	272: "GALLERY.3D.BAR",
	273: "GALLERY.3D.SURFACE",
	274: "FILL.AUTO",
	276: "CUSTOMIZE.TOOLBAR",
	277: "ADD.TOOL",
	278: "EDIT.OBJECT",
	279: "ON.DOUBLECLICK",
	280: "ON.ENTRY",
	281: "WORKBOOK.ADD",
	282: "WORKBOOK.MOVE",
	283: "WORKBOOK.COPY",
	284: "WORKBOOK.OPTIONS",
	285: "SAVE.WORKSPACE",
	288: "CHART.WIZARD",
	289: "DELETE.TOOL",
	290: "MOVE.TOOL",
	291: "WORKBOOK.SELECT",
	292: "WORKBOOK.ACTIVATE",
	293: "ASSIGN.TO.TOOL",
	295: "COPY.TOOL",
	296: "RESET.TOOL",
	297: "CONSTRAIN.NUMERIC",
	298: "PASTE.TOOL",
	302: "WORKBOOK.NEW",
	305: "SCENARIO.CELLS",
	306: "SCENARIO.DELETE",
	307: "SCENARIO.ADD",
	308: "SCENARIO.EDIT",
	309: "SCENARIO.SHOW",
	310: "SCENARIO.SHOW.NEXT",
	311: "SCENARIO.SUMMARY",
	312: "PIVOT.TABLE.WIZARD",
	313: "PIVOT.FIELD.PROPERTIES",
	314: "PIVOT.FIELD",
	315: "PIVOT.ITEM",
	316: "PIVOT.ADD.FIELDS",
	318: "OPTIONS.CALCULATION",
	319: "OPTIONS.EDIT",
	320: "OPTIONS.VIEW",
	321: "ADDIN.MANAGER",
	322: "MENU.EDITOR",
	323: "ATTACH.TOOLBARS",
	324: "VBAActivate",
	325: "OPTIONS.CHART",
	328: "VBA.INSERT.FILE",
	330: "VBA.PROCEDURE.DEFINITION",
	336: "ROUTING.SLIP",
	338: "ROUTE.DOCUMENT",
	339: "MAIL.LOGON",
	342: "INSERT.PICTURE",
	343: "EDIT.TOOL",
	344: "GALLERY.DOUGHNUT",
	350: "CHART.TREND",
	352: "PIVOT.ITEM.PROPERTIES",
	354: "WORKBOOK.INSERT",
	355: "OPTIONS.TRANSITION",
	356: "OPTIONS.GENERAL",
	370: "FILTER.ADVANCED",
	373: "MAIL.ADD.MAILER",
	374: "MAIL.DELETE.MAILER",
	375: "MAIL.REPLY",
	376: "MAIL.REPLY.ALL",
	377: "MAIL.FORWARD",
	378: "MAIL.NEXT.LETTER",
	379: "DATA.LABEL",
	380: "INSERT.TITLE",
	381: "FONT.PROPERTIES",
	382: "MACRO.OPTIONS",
	383: "WORKBOOK.HIDE",
	384: "WORKBOOK.UNHIDE",
	385: "WORKBOOK.DELETE",
	386: "WORKBOOK.NAME",
	388: "GALLERY.CUSTOM",
	390: "ADD.CHART.AUTOFORMAT",
	391: "DELETE.CHART.AUTOFORMAT",
	392: "CHART.ADD.DATA",
	393: "AUTO.OUTLINE",
	394: "TAB.ORDER",
	395: "SHOW.DIALOG",
	396: "SELECT.ALL",
	397: "UNGROUP.SHEETS",
	398: "SUBTOTAL.CREATE",
	399: "SUBTOTAL.REMOVE",
	400: "RENAME.OBJECT",
	412: "WORKBOOK.SCROLL",
	413: "WORKBOOK.NEXT",
	414: "WORKBOOK.PREV",
	415: "WORKBOOK.TAB.SPLIT",
	416: "FULL.SCREEN",
	417: "WORKBOOK.PROTECT",
	420: "SCROLLBAR.PROPERTIES",
	421: "PIVOT.SHOW.PAGES",
	422: "TEXT.TO.COLUMNS",
	423: "FORMAT.CHARTTYPE",
	424: "LINK.FORMAT",
	425: "TRACER.DISPLAY",
	430: "TRACER.NAVIGATE",
	431: "TRACER.CLEAR",
	432: "TRACER.ERROR",
	433: "PIVOT.FIELD.GROUP",
	434: "PIVOT.FIELD.UNGROUP",
	435: "CHECKBOX.PROPERTIES",
	436: "LABEL.PROPERTIES",
	437: "LISTBOX.PROPERTIES",
	438: "EDITBOX.PROPERTIES",
	439: "PIVOT.REFRESH",
	440: "LINK.COMBO",
	441: "OPEN.TEXT",
	442: "HIDE.DIALOG",
	443: "SET.DIALOG.FOCUS",
	444: "ENABLE.OBJECT",
	445: "PUSHBUTTON.PROPERTIES",
	446: "SET.DIALOG.DEFAULT",
	447: "FILTER",
	448: "FILTER.SHOW.ALL",
	449: "CLEAR.OUTLINE",
	450: "FUNCTION.WIZARD",
	451: "ADD.LIST.ITEM",
	452: "SET.LIST.ITEM",
	453: "REMOVE.LIST.ITEM",
	454: "SELECT.LIST.ITEM",
	455: "SET.CONTROL.VALUE",
	456: "SAVE.COPY.AS",
	458: "OPTIONS.LISTS.ADD",
	459: "OPTIONS.LISTS.DELETE",
	460: "SERIES.AXES",
	461: "SERIES.X",
	462: "SERIES.Y",
	463: "ERRORBAR.X",
	464: "ERRORBAR.Y",
	465: "FORMAT.CHART",
	466: "SERIES.ORDER",
	467: "MAIL.LOGOFF",
	468: "CLEAR.ROUTING.SLIP",
	469: "APP.ACTIVATE.MICROSOFT",
	470: "MAIL.EDIT.MAILER",
	471: "ON.SHEET",
	472: "STANDARD.WIDTH",
	473: "SCENARIO.MERGE",
	474: "SUMMARY.INFO",
	475: "FIND.FILE",
	476: "ACTIVE.CELL.FONT",
	477: "ENABLE.TIPWIZARD",
	478: "VBA.MAKE.ADDIN",
	480: "INSERTDATATABLE",
	481: "WORKGROUP.OPTIONS",
	482: "MAIL.SEND.MAILER",
	485: "AUTOCORRECT",
	489: "POST.DOCUMENT",
	491: "PICKLIST",
	493: "VIEW.SHOW",
	494: "VIEW.DEFINE",
	495: "VIEW.DELETE",
	509: "SHEET.BACKGROUND",
	510: "INSERT.MAP.OBJECT",
	511: "OPTIONS.MENONO",
	517: "MSOCHECKS",
	518: "NORMAL",
	519: "LAYOUT",
	520: "RM.PRINT.AREA",
	521: "CLEAR.PRINT.AREA",
	522: "ADD.PRINT.AREA",
	523: "MOVE.BRK",
	545: "HIDECURR.NOTE",
	546: "HIDEALL.NOTES",
	547: "DELETE.NOTE",
	548: "TRAVERSE.NOTES",
	549: "ACTIVATE.NOTES",
	620: "PROTECT.REVISIONS",
	621: "UNPROTECT.REVISIONS",
	647: "OPTIONS.ME",
	653: "WEB.PUBLISH",
	667: "NEWWEBQUERY",
	673: "PIVOT.TABLE.CHART",
	753: "OPTIONS.SAVE",
	755: "OPTIONS.SPELL",
	808: "HIDEALL.INKANNOTS"
}, bd = {
	0: "COUNT",
	1: "IF",
	2: "ISNA",
	3: "ISERROR",
	4: "SUM",
	5: "AVERAGE",
	6: "MIN",
	7: "MAX",
	8: "ROW",
	9: "COLUMN",
	10: "NA",
	11: "NPV",
	12: "STDEV",
	13: "DOLLAR",
	14: "FIXED",
	15: "SIN",
	16: "COS",
	17: "TAN",
	18: "ATAN",
	19: "PI",
	20: "SQRT",
	21: "EXP",
	22: "LN",
	23: "LOG10",
	24: "ABS",
	25: "INT",
	26: "SIGN",
	27: "ROUND",
	28: "LOOKUP",
	29: "INDEX",
	30: "REPT",
	31: "MID",
	32: "LEN",
	33: "VALUE",
	34: "TRUE",
	35: "FALSE",
	36: "AND",
	37: "OR",
	38: "NOT",
	39: "MOD",
	40: "DCOUNT",
	41: "DSUM",
	42: "DAVERAGE",
	43: "DMIN",
	44: "DMAX",
	45: "DSTDEV",
	46: "VAR",
	47: "DVAR",
	48: "TEXT",
	49: "LINEST",
	50: "TREND",
	51: "LOGEST",
	52: "GROWTH",
	53: "GOTO",
	54: "HALT",
	55: "RETURN",
	56: "PV",
	57: "FV",
	58: "NPER",
	59: "PMT",
	60: "RATE",
	61: "MIRR",
	62: "IRR",
	63: "RAND",
	64: "MATCH",
	65: "DATE",
	66: "TIME",
	67: "DAY",
	68: "MONTH",
	69: "YEAR",
	70: "WEEKDAY",
	71: "HOUR",
	72: "MINUTE",
	73: "SECOND",
	74: "NOW",
	75: "AREAS",
	76: "ROWS",
	77: "COLUMNS",
	78: "OFFSET",
	79: "ABSREF",
	80: "RELREF",
	81: "ARGUMENT",
	82: "SEARCH",
	83: "TRANSPOSE",
	84: "ERROR",
	85: "STEP",
	86: "TYPE",
	87: "ECHO",
	88: "SET.NAME",
	89: "CALLER",
	90: "DEREF",
	91: "WINDOWS",
	92: "SERIES",
	93: "DOCUMENTS",
	94: "ACTIVE.CELL",
	95: "SELECTION",
	96: "RESULT",
	97: "ATAN2",
	98: "ASIN",
	99: "ACOS",
	100: "CHOOSE",
	101: "HLOOKUP",
	102: "VLOOKUP",
	103: "LINKS",
	104: "INPUT",
	105: "ISREF",
	106: "GET.FORMULA",
	107: "GET.NAME",
	108: "SET.VALUE",
	109: "LOG",
	110: "EXEC",
	111: "CHAR",
	112: "LOWER",
	113: "UPPER",
	114: "PROPER",
	115: "LEFT",
	116: "RIGHT",
	117: "EXACT",
	118: "TRIM",
	119: "REPLACE",
	120: "SUBSTITUTE",
	121: "CODE",
	122: "NAMES",
	123: "DIRECTORY",
	124: "FIND",
	125: "CELL",
	126: "ISERR",
	127: "ISTEXT",
	128: "ISNUMBER",
	129: "ISBLANK",
	130: "T",
	131: "N",
	132: "FOPEN",
	133: "FCLOSE",
	134: "FSIZE",
	135: "FREADLN",
	136: "FREAD",
	137: "FWRITELN",
	138: "FWRITE",
	139: "FPOS",
	140: "DATEVALUE",
	141: "TIMEVALUE",
	142: "SLN",
	143: "SYD",
	144: "DDB",
	145: "GET.DEF",
	146: "REFTEXT",
	147: "TEXTREF",
	148: "INDIRECT",
	149: "REGISTER",
	150: "CALL",
	151: "ADD.BAR",
	152: "ADD.MENU",
	153: "ADD.COMMAND",
	154: "ENABLE.COMMAND",
	155: "CHECK.COMMAND",
	156: "RENAME.COMMAND",
	157: "SHOW.BAR",
	158: "DELETE.MENU",
	159: "DELETE.COMMAND",
	160: "GET.CHART.ITEM",
	161: "DIALOG.BOX",
	162: "CLEAN",
	163: "MDETERM",
	164: "MINVERSE",
	165: "MMULT",
	166: "FILES",
	167: "IPMT",
	168: "PPMT",
	169: "COUNTA",
	170: "CANCEL.KEY",
	171: "FOR",
	172: "WHILE",
	173: "BREAK",
	174: "NEXT",
	175: "INITIATE",
	176: "REQUEST",
	177: "POKE",
	178: "EXECUTE",
	179: "TERMINATE",
	180: "RESTART",
	181: "HELP",
	182: "GET.BAR",
	183: "PRODUCT",
	184: "FACT",
	185: "GET.CELL",
	186: "GET.WORKSPACE",
	187: "GET.WINDOW",
	188: "GET.DOCUMENT",
	189: "DPRODUCT",
	190: "ISNONTEXT",
	191: "GET.NOTE",
	192: "NOTE",
	193: "STDEVP",
	194: "VARP",
	195: "DSTDEVP",
	196: "DVARP",
	197: "TRUNC",
	198: "ISLOGICAL",
	199: "DCOUNTA",
	200: "DELETE.BAR",
	201: "UNREGISTER",
	204: "USDOLLAR",
	205: "FINDB",
	206: "SEARCHB",
	207: "REPLACEB",
	208: "LEFTB",
	209: "RIGHTB",
	210: "MIDB",
	211: "LENB",
	212: "ROUNDUP",
	213: "ROUNDDOWN",
	214: "ASC",
	215: "DBCS",
	216: "RANK",
	219: "ADDRESS",
	220: "DAYS360",
	221: "TODAY",
	222: "VDB",
	223: "ELSE",
	224: "ELSE.IF",
	225: "END.IF",
	226: "FOR.CELL",
	227: "MEDIAN",
	228: "SUMPRODUCT",
	229: "SINH",
	230: "COSH",
	231: "TANH",
	232: "ASINH",
	233: "ACOSH",
	234: "ATANH",
	235: "DGET",
	236: "CREATE.OBJECT",
	237: "VOLATILE",
	238: "LAST.ERROR",
	239: "CUSTOM.UNDO",
	240: "CUSTOM.REPEAT",
	241: "FORMULA.CONVERT",
	242: "GET.LINK.INFO",
	243: "TEXT.BOX",
	244: "INFO",
	245: "GROUP",
	246: "GET.OBJECT",
	247: "DB",
	248: "PAUSE",
	251: "RESUME",
	252: "FREQUENCY",
	253: "ADD.TOOLBAR",
	254: "DELETE.TOOLBAR",
	255: "User",
	256: "RESET.TOOLBAR",
	257: "EVALUATE",
	258: "GET.TOOLBAR",
	259: "GET.TOOL",
	260: "SPELLING.CHECK",
	261: "ERROR.TYPE",
	262: "APP.TITLE",
	263: "WINDOW.TITLE",
	264: "SAVE.TOOLBAR",
	265: "ENABLE.TOOL",
	266: "PRESS.TOOL",
	267: "REGISTER.ID",
	268: "GET.WORKBOOK",
	269: "AVEDEV",
	270: "BETADIST",
	271: "GAMMALN",
	272: "BETAINV",
	273: "BINOMDIST",
	274: "CHIDIST",
	275: "CHIINV",
	276: "COMBIN",
	277: "CONFIDENCE",
	278: "CRITBINOM",
	279: "EVEN",
	280: "EXPONDIST",
	281: "FDIST",
	282: "FINV",
	283: "FISHER",
	284: "FISHERINV",
	285: "FLOOR",
	286: "GAMMADIST",
	287: "GAMMAINV",
	288: "CEILING",
	289: "HYPGEOMDIST",
	290: "LOGNORMDIST",
	291: "LOGINV",
	292: "NEGBINOMDIST",
	293: "NORMDIST",
	294: "NORMSDIST",
	295: "NORMINV",
	296: "NORMSINV",
	297: "STANDARDIZE",
	298: "ODD",
	299: "PERMUT",
	300: "POISSON",
	301: "TDIST",
	302: "WEIBULL",
	303: "SUMXMY2",
	304: "SUMX2MY2",
	305: "SUMX2PY2",
	306: "CHITEST",
	307: "CORREL",
	308: "COVAR",
	309: "FORECAST",
	310: "FTEST",
	311: "INTERCEPT",
	312: "PEARSON",
	313: "RSQ",
	314: "STEYX",
	315: "SLOPE",
	316: "TTEST",
	317: "PROB",
	318: "DEVSQ",
	319: "GEOMEAN",
	320: "HARMEAN",
	321: "SUMSQ",
	322: "KURT",
	323: "SKEW",
	324: "ZTEST",
	325: "LARGE",
	326: "SMALL",
	327: "QUARTILE",
	328: "PERCENTILE",
	329: "PERCENTRANK",
	330: "MODE",
	331: "TRIMMEAN",
	332: "TINV",
	334: "MOVIE.COMMAND",
	335: "GET.MOVIE",
	336: "CONCATENATE",
	337: "POWER",
	338: "PIVOT.ADD.DATA",
	339: "GET.PIVOT.TABLE",
	340: "GET.PIVOT.FIELD",
	341: "GET.PIVOT.ITEM",
	342: "RADIANS",
	343: "DEGREES",
	344: "SUBTOTAL",
	345: "SUMIF",
	346: "COUNTIF",
	347: "COUNTBLANK",
	348: "SCENARIO.GET",
	349: "OPTIONS.LISTS.GET",
	350: "ISPMT",
	351: "DATEDIF",
	352: "DATESTRING",
	353: "NUMBERSTRING",
	354: "ROMAN",
	355: "OPEN.DIALOG",
	356: "SAVE.DIALOG",
	357: "VIEW.GET",
	358: "GETPIVOTDATA",
	359: "HYPERLINK",
	360: "PHONETIC",
	361: "AVERAGEA",
	362: "MAXA",
	363: "MINA",
	364: "STDEVPA",
	365: "VARPA",
	366: "STDEVA",
	367: "VARA",
	368: "BAHTTEXT",
	369: "THAIDAYOFWEEK",
	370: "THAIDIGIT",
	371: "THAIMONTHOFYEAR",
	372: "THAINUMSOUND",
	373: "THAINUMSTRING",
	374: "THAISTRINGLENGTH",
	375: "ISTHAIDIGIT",
	376: "ROUNDBAHTDOWN",
	377: "ROUNDBAHTUP",
	378: "THAIYEAR",
	379: "RTD",
	380: "CUBEVALUE",
	381: "CUBEMEMBER",
	382: "CUBEMEMBERPROPERTY",
	383: "CUBERANKEDMEMBER",
	384: "HEX2BIN",
	385: "HEX2DEC",
	386: "HEX2OCT",
	387: "DEC2BIN",
	388: "DEC2HEX",
	389: "DEC2OCT",
	390: "OCT2BIN",
	391: "OCT2HEX",
	392: "OCT2DEC",
	393: "BIN2DEC",
	394: "BIN2OCT",
	395: "BIN2HEX",
	396: "IMSUB",
	397: "IMDIV",
	398: "IMPOWER",
	399: "IMABS",
	400: "IMSQRT",
	401: "IMLN",
	402: "IMLOG2",
	403: "IMLOG10",
	404: "IMSIN",
	405: "IMCOS",
	406: "IMEXP",
	407: "IMARGUMENT",
	408: "IMCONJUGATE",
	409: "IMAGINARY",
	410: "IMREAL",
	411: "COMPLEX",
	412: "IMSUM",
	413: "IMPRODUCT",
	414: "SERIESSUM",
	415: "FACTDOUBLE",
	416: "SQRTPI",
	417: "QUOTIENT",
	418: "DELTA",
	419: "GESTEP",
	420: "ISEVEN",
	421: "ISODD",
	422: "MROUND",
	423: "ERF",
	424: "ERFC",
	425: "BESSELJ",
	426: "BESSELK",
	427: "BESSELY",
	428: "BESSELI",
	429: "XIRR",
	430: "XNPV",
	431: "PRICEMAT",
	432: "YIELDMAT",
	433: "INTRATE",
	434: "RECEIVED",
	435: "DISC",
	436: "PRICEDISC",
	437: "YIELDDISC",
	438: "TBILLEQ",
	439: "TBILLPRICE",
	440: "TBILLYIELD",
	441: "PRICE",
	442: "YIELD",
	443: "DOLLARDE",
	444: "DOLLARFR",
	445: "NOMINAL",
	446: "EFFECT",
	447: "CUMPRINC",
	448: "CUMIPMT",
	449: "EDATE",
	450: "EOMONTH",
	451: "YEARFRAC",
	452: "COUPDAYBS",
	453: "COUPDAYS",
	454: "COUPDAYSNC",
	455: "COUPNCD",
	456: "COUPNUM",
	457: "COUPPCD",
	458: "DURATION",
	459: "MDURATION",
	460: "ODDLPRICE",
	461: "ODDLYIELD",
	462: "ODDFPRICE",
	463: "ODDFYIELD",
	464: "RANDBETWEEN",
	465: "WEEKNUM",
	466: "AMORDEGRC",
	467: "AMORLINC",
	468: "CONVERT",
	724: "SHEETJS",
	469: "ACCRINT",
	470: "ACCRINTM",
	471: "WORKDAY",
	472: "NETWORKDAYS",
	473: "GCD",
	474: "MULTINOMIAL",
	475: "LCM",
	476: "FVSCHEDULE",
	477: "CUBEKPIMEMBER",
	478: "CUBESET",
	479: "CUBESETCOUNT",
	480: "IFERROR",
	481: "COUNTIFS",
	482: "SUMIFS",
	483: "AVERAGEIF",
	484: "AVERAGEIFS"
}, xd = {
	2: 1,
	3: 1,
	10: 0,
	15: 1,
	16: 1,
	17: 1,
	18: 1,
	19: 0,
	20: 1,
	21: 1,
	22: 1,
	23: 1,
	24: 1,
	25: 1,
	26: 1,
	27: 2,
	30: 2,
	31: 3,
	32: 1,
	33: 1,
	34: 0,
	35: 0,
	38: 1,
	39: 2,
	40: 3,
	41: 3,
	42: 3,
	43: 3,
	44: 3,
	45: 3,
	47: 3,
	48: 2,
	53: 1,
	61: 3,
	63: 0,
	65: 3,
	66: 3,
	67: 1,
	68: 1,
	69: 1,
	70: 1,
	71: 1,
	72: 1,
	73: 1,
	74: 0,
	75: 1,
	76: 1,
	77: 1,
	79: 2,
	80: 2,
	83: 1,
	85: 0,
	86: 1,
	89: 0,
	90: 1,
	94: 0,
	95: 0,
	97: 2,
	98: 1,
	99: 1,
	101: 3,
	102: 3,
	105: 1,
	106: 1,
	108: 2,
	111: 1,
	112: 1,
	113: 1,
	114: 1,
	117: 2,
	118: 1,
	119: 4,
	121: 1,
	126: 1,
	127: 1,
	128: 1,
	129: 1,
	130: 1,
	131: 1,
	133: 1,
	134: 1,
	135: 1,
	136: 2,
	137: 2,
	138: 2,
	140: 1,
	141: 1,
	142: 3,
	143: 4,
	144: 4,
	161: 1,
	162: 1,
	163: 1,
	164: 1,
	165: 2,
	172: 1,
	175: 2,
	176: 2,
	177: 3,
	178: 2,
	179: 1,
	184: 1,
	186: 1,
	189: 3,
	190: 1,
	195: 3,
	196: 3,
	197: 1,
	198: 1,
	199: 3,
	201: 1,
	207: 4,
	210: 3,
	211: 1,
	212: 2,
	213: 2,
	214: 1,
	215: 1,
	225: 0,
	229: 1,
	230: 1,
	231: 1,
	232: 1,
	233: 1,
	234: 1,
	235: 3,
	244: 1,
	247: 4,
	252: 2,
	257: 1,
	261: 1,
	271: 1,
	273: 4,
	274: 2,
	275: 2,
	276: 2,
	277: 3,
	278: 3,
	279: 1,
	280: 3,
	281: 3,
	282: 3,
	283: 1,
	284: 1,
	285: 2,
	286: 4,
	287: 3,
	288: 2,
	289: 4,
	290: 3,
	291: 3,
	292: 3,
	293: 4,
	294: 1,
	295: 3,
	296: 1,
	297: 3,
	298: 1,
	299: 2,
	300: 3,
	301: 3,
	302: 4,
	303: 2,
	304: 2,
	305: 2,
	306: 2,
	307: 2,
	308: 2,
	309: 3,
	310: 2,
	311: 2,
	312: 2,
	313: 2,
	314: 2,
	315: 2,
	316: 4,
	325: 2,
	326: 2,
	327: 2,
	328: 2,
	331: 2,
	332: 2,
	337: 2,
	342: 1,
	343: 1,
	346: 2,
	347: 1,
	350: 4,
	351: 3,
	352: 1,
	353: 2,
	360: 1,
	368: 1,
	369: 1,
	370: 1,
	371: 1,
	372: 1,
	373: 1,
	374: 1,
	375: 1,
	376: 1,
	377: 1,
	378: 1,
	382: 3,
	385: 1,
	392: 1,
	393: 1,
	396: 2,
	397: 2,
	398: 2,
	399: 1,
	400: 1,
	401: 1,
	402: 1,
	403: 1,
	404: 1,
	405: 1,
	406: 1,
	407: 1,
	408: 1,
	409: 1,
	410: 1,
	414: 4,
	415: 1,
	416: 1,
	417: 2,
	420: 1,
	421: 1,
	422: 2,
	424: 1,
	425: 2,
	426: 2,
	427: 2,
	428: 2,
	430: 3,
	438: 3,
	439: 3,
	440: 3,
	443: 2,
	444: 2,
	445: 2,
	446: 2,
	447: 6,
	448: 6,
	449: 2,
	450: 2,
	464: 2,
	468: 3,
	476: 2,
	479: 1,
	480: 2,
	65535: 0
};
function Sd(e) {
	return e.slice(0, 3) == "of:" && (e = e.slice(3)), e.charCodeAt(0) == 61 && (e = e.slice(1), e.charCodeAt(0) == 61 && (e = e.slice(1))), e = e.replace(/COM\.MICROSOFT\./g, ""), e = e.replace(/\[((?:\.[A-Z]+[0-9]+)(?::\.[A-Z]+[0-9]+)?)\]/g, function(e, t) {
		return t.replace(/\./g, "");
	}), e = e.replace(/\[.(#[A-Z]*[?!])\]/g, "$1"), e.replace(/[;~]/g, ",").replace(/\|/g, ";");
}
function Cd(e) {
	var t = e.split(":");
	return [t[0].split(".")[0], t[0].split(".")[1] + (t.length > 1 ? ":" + (t[1].split(".")[1] || t[1].split(".")[0]) : "")];
}
var wd = {}, Td = {}, Ed = typeof Map < "u";
function Dd(e, t, n) {
	var r = 0, i = e.length;
	if (n) {
		if (Ed ? n.has(t) : Object.prototype.hasOwnProperty.call(n, t)) {
			for (var a = Ed ? n.get(t) : n[t]; r < a.length; ++r) if (e[a[r]].t === t) return e.Count++, a[r];
		}
	} else for (; r < i; ++r) if (e[r].t === t) return e.Count++, r;
	return e[i] = { t }, e.Count++, e.Unique++, n && (Ed ? (n.has(t) || n.set(t, []), n.get(t).push(i)) : (Object.prototype.hasOwnProperty.call(n, t) || (n[t] = []), n[t].push(i))), i;
}
function Od(e, t) {
	var n = {
		min: e + 1,
		max: e + 1
	}, r = -1;
	return t.MDW && (rc = t.MDW), t.width == null ? t.wpx == null ? t.wch != null && (r = t.wch) : r = ac(t.wpx) : n.customWidth = 1, r > -1 ? (n.width = oc(r), n.customWidth = 1) : t.width != null && (n.width = t.width), t.hidden && (n.hidden = !0), t.level != null && (n.outlineLevel = n.level = t.level), n;
}
function kd(e, t) {
	if (e) {
		var n = [
			.7,
			.7,
			.75,
			.75,
			.3,
			.3
		];
		t == "xlml" && (n = [
			1,
			1,
			1,
			1,
			.5,
			.5
		]), e.left ??= n[0], e.right ??= n[1], e.top ??= n[2], e.bottom ??= n[3], e.header ??= n[4], e.footer ??= n[5];
	}
}
function Ad(e, t, n) {
	var r = n.revssf[t.z == null ? "General" : t.z], i = 60, a = e.length;
	if (r == null && n.ssf) {
		for (; i < 392; ++i) if (n.ssf[i] == null) {
			Xe(t.z, i), n.ssf[i] = t.z, n.revssf[t.z] = r = i;
			break;
		}
	}
	for (i = 0; i != a; ++i) if (e[i].numFmtId === r) return i;
	return e[a] = {
		numFmtId: r,
		fontId: 0,
		fillId: 0,
		borderId: 0,
		xfId: 0,
		applyNumberFormat: 1
	}, a;
}
function jd(e, t, n, r, i, a) {
	try {
		r.cellNF && (e.z = U[t]);
	} catch (e) {
		if (r.WTF) throw e;
	}
	if (!(e.t === "z" && !r.cellStyles)) {
		if (e.t === "d" && typeof e.v == "string" && (e.v = St(e.v)), (!r || r.cellText !== !1) && e.t !== "z") try {
			if (U[t] ?? Xe($e[t] || "General", t), e.t === "e") e.w = e.w || bi[e.v];
			else if (t === 0) if (e.t === "n") (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = ge(e.v);
			else if (e.t === "d") {
				var o = pt(e.v);
				(o | 0) === o ? e.w = o.toString(10) : e.w = ge(o);
			} else if (e.v === void 0) return "";
			else e.w = _e(e.v, Td);
			else e.t === "d" ? e.w = Ye(t, pt(e.v), Td) : e.w = Ye(t, e.v, Td);
		} catch (e) {
			if (r.WTF) throw e;
		}
		if (r.cellStyles && n != null) try {
			e.s = a.Fills[n], e.s.fgColor && e.s.fgColor.theme && !e.s.fgColor.rgb && (e.s.fgColor.rgb = $s(i.themeElements.clrScheme[e.s.fgColor.theme].rgb, e.s.fgColor.tint || 0), r.WTF && (e.s.fgColor.raw_rgb = i.themeElements.clrScheme[e.s.fgColor.theme].rgb)), e.s.bgColor && e.s.bgColor.theme && (e.s.bgColor.rgb = $s(i.themeElements.clrScheme[e.s.bgColor.theme].rgb, e.s.bgColor.tint || 0), r.WTF && (e.s.bgColor.raw_rgb = i.themeElements.clrScheme[e.s.bgColor.theme].rgb));
		} catch (e) {
			if (r.WTF && a.Fills) throw e;
		}
	}
}
function Md(e, t, n) {
	if (e && e["!ref"]) {
		var r = kr(e["!ref"]);
		if (r.e.c < r.s.c || r.e.r < r.s.r) throw Error("Bad range (" + n + "): " + e["!ref"]);
	}
}
function Nd(e, t) {
	var n = kr(t);
	n.s.r <= n.e.r && n.s.c <= n.e.c && n.s.r >= 0 && n.s.c >= 0 && (e["!ref"] = Z(n));
}
var Pd = /<(?:\w:)?mergeCell ref="[A-Z0-9:]+"\s*[\/]?>/g, Fd = /<(?:\w+:)?sheetData[^>]*>([\s\S]*)<\/(?:\w+:)?sheetData>/, Id = /<(?:\w:)?hyperlink [^>]*>/gm, Ld = /"(\w*:\w*)"/, Rd = /<(?:\w:)?col\b[^>]*[\/]?>/g, zd = /<(?:\w:)?autoFilter[^>]*([\/]|>([\s\S]*)<\/(?:\w:)?autoFilter)>/g, Bd = /<(?:\w:)?pageMargins[^>]*\/>/g, Vd = /<(?:\w:)?sheetPr\b(?:[^>a-z][^>]*)?\/>/, Hd = /<(?:\w:)?sheetPr[^>]*(?:[\/]|>([\s\S]*)<\/(?:\w:)?sheetPr)>/, Ud = /<(?:\w:)?sheetViews[^>]*(?:[\/]|>([\s\S]*)<\/(?:\w:)?sheetViews)>/;
function Wd(e, t, n, r, i, a, o) {
	if (!e) return e;
	r ||= { "!id": {} }, v != null && t.dense == null && (t.dense = v);
	var s = t.dense ? [] : {}, c = {
		s: {
			r: 2e6,
			c: 2e6
		},
		e: {
			r: 0,
			c: 0
		}
	}, l = "", u = "", d = e.match(Fd);
	d ? (l = e.slice(0, d.index), u = e.slice(d.index + d[0].length)) : l = u = e;
	var f = l.match(Vd);
	f ? Kd(f[0], s, i, n) : (f = l.match(Hd)) && qd(f[0], f[1] || "", s, i, n, o, a);
	var p = (l.match(/<(?:\w*:)?dimension/) || { index: -1 }).index;
	if (p > 0) {
		var m = l.slice(p, p + 50).match(Ld);
		m && Nd(s, m[1]);
	}
	var h = l.match(Ud);
	h && h[1] && sf(h[1], i);
	var g = [];
	if (t.cellStyles) {
		var _ = l.match(Rd);
		_ && tf(g, _);
	}
	d && uf(d[1], s, t, c, a, o);
	var y = u.match(zd);
	y && (s["!autofilter"] = rf(y[0]));
	var b = [], x = u.match(Pd);
	if (x) for (p = 0; p != x.length; ++p) b[p] = kr(x[p].slice(x[p].indexOf("\"") + 1));
	var S = u.match(Id);
	S && Qd(s, S, r);
	var C = u.match(Bd);
	if (C && (s["!margins"] = $d(K(C[0]))), !s["!ref"] && c.e.c >= c.s.c && c.e.r >= c.s.r && (s["!ref"] = Z(c)), t.sheetRows > 0 && s["!ref"]) {
		var w = kr(s["!ref"]);
		t.sheetRows <= +w.e.r && (w.e.r = t.sheetRows - 1, w.e.r > c.e.r && (w.e.r = c.e.r), w.e.r < w.s.r && (w.s.r = w.e.r), w.e.c > c.e.c && (w.e.c = c.e.c), w.e.c < w.s.c && (w.s.c = w.e.c), s["!fullref"] = s["!ref"], s["!ref"] = Z(w));
	}
	return g.length > 0 && (s["!cols"] = g), b.length > 0 && (s["!merges"] = b), s;
}
function Gd(e) {
	if (e.length === 0) return "";
	for (var t = "<mergeCells count=\"" + e.length + "\">", n = 0; n != e.length; ++n) t += "<mergeCell ref=\"" + Z(e[n]) + "\"/>";
	return t + "</mergeCells>";
}
function Kd(e, t, n, r) {
	var i = K(e);
	n.Sheets[r] || (n.Sheets[r] = {}), i.codeName && (n.Sheets[r].CodeName = q(J(i.codeName)));
}
function qd(e, t, n, r, i) {
	Kd(e.slice(0, e.indexOf(">")), n, r, i);
}
function Jd(e, t, n, r, i) {
	var a = !1, o = {}, s = null;
	if (r.bookType !== "xlsx" && t.vbaraw) {
		var c = t.SheetNames[n];
		try {
			t.Workbook && (c = t.Workbook.Sheets[n].CodeName || c);
		} catch {}
		a = !0, o.codeName = un(en(c));
	}
	if (e && e["!outline"]) {
		var l = {
			summaryBelow: 1,
			summaryRight: 1
		};
		e["!outline"].above && (l.summaryBelow = 0), e["!outline"].left && (l.summaryRight = 0), s = (s || "") + Y("outlinePr", null, l);
	}
	!a && !s || (i[i.length] = Y("sheetPr", s, o));
}
var Yd = [
	"objects",
	"scenarios",
	"selectLockedCells",
	"selectUnlockedCells"
], Xd = [
	"formatColumns",
	"formatRows",
	"formatCells",
	"insertColumns",
	"insertRows",
	"insertHyperlinks",
	"deleteColumns",
	"deleteRows",
	"sort",
	"autoFilter",
	"pivotTables"
];
function Zd(e) {
	var t = { sheet: 1 };
	return Yd.forEach(function(n) {
		e[n] != null && e[n] && (t[n] = "1");
	}), Xd.forEach(function(n) {
		e[n] != null && !e[n] && (t[n] = "0");
	}), e.password && (t.password = Vs(e.password).toString(16).toUpperCase()), Y("sheetProtection", null, t);
}
function Qd(e, t, n) {
	for (var r = Array.isArray(e), i = 0; i != t.length; ++i) {
		var a = K(J(t[i]), !0);
		if (!a.ref) return;
		var o = ((n || {})["!id"] || [])[a.id];
		o ? (a.Target = o.Target, a.location && (a.Target += "#" + q(a.location))) : (a.Target = "#" + q(a.location), o = {
			Target: a.Target,
			TargetMode: "Internal"
		}), a.Rel = o, a.tooltip && (a.Tooltip = a.tooltip, delete a.tooltip);
		for (var s = kr(a.ref), c = s.s.r; c <= s.e.r; ++c) for (var l = s.s.c; l <= s.e.c; ++l) {
			var u = X({
				c: l,
				r: c
			});
			r ? (e[c] || (e[c] = []), e[c][l] || (e[c][l] = {
				t: "z",
				v: void 0
			}), e[c][l].l = a) : (e[u] || (e[u] = {
				t: "z",
				v: void 0
			}), e[u].l = a);
		}
	}
}
function $d(e) {
	var t = {};
	return [
		"left",
		"right",
		"top",
		"bottom",
		"header",
		"footer"
	].forEach(function(n) {
		e[n] && (t[n] = parseFloat(e[n]));
	}), t;
}
function ef(e) {
	return kd(e), Y("pageMargins", null, e);
}
function tf(e, t) {
	for (var n = !1, r = 0; r != t.length; ++r) {
		var i = K(t[r], !0);
		i.hidden &&= an(i.hidden);
		var a = parseInt(i.min, 10) - 1, o = parseInt(i.max, 10) - 1;
		for (i.outlineLevel && (i.level = +i.outlineLevel || 0), delete i.min, delete i.max, i.width = +i.width, !n && i.width && (n = !0, cc(i.width)), lc(i); a <= o;) e[a++] = wt(i);
	}
}
function nf(e, t) {
	for (var n = ["<cols>"], r, i = 0; i != t.length; ++i) (r = t[i]) && (n[n.length] = Y("col", null, Od(i, r)));
	return n[n.length] = "</cols>", n.join("");
}
function rf(e) {
	return { ref: (e.match(/ref="([^"]*)"/) || [])[1] };
}
function af(e, t, n, r) {
	var i = typeof e.ref == "string" ? e.ref : Z(e.ref);
	n.Workbook ||= { Sheets: [] }, n.Workbook.Names || (n.Workbook.Names = []);
	var a = n.Workbook.Names, o = Or(i);
	o.s.r == o.e.r && (o.e.r = Or(t["!ref"]).e.r, i = Z(o));
	for (var s = 0; s < a.length; ++s) {
		var c = a[s];
		if (c.Name == "_xlnm._FilterDatabase" && c.Sheet == r) {
			c.Ref = "'" + n.SheetNames[r] + "'!" + i;
			break;
		}
	}
	return s == a.length && a.push({
		Name: "_xlnm._FilterDatabase",
		Sheet: r,
		Ref: "'" + n.SheetNames[r] + "'!" + i
	}), Y("autoFilter", null, { ref: i });
}
var of = /<(?:\w:)?sheetView(?:[^>a-z][^>]*)?\/?>/;
function sf(e, t) {
	t.Views ||= [{}], (e.match(of) || []).forEach(function(e, n) {
		var r = K(e);
		t.Views[n] || (t.Views[n] = {}), +r.zoomScale && (t.Views[n].zoom = +r.zoomScale), an(r.rightToLeft) && (t.Views[n].RTL = !0);
	});
}
function cf(e, t, n, r) {
	var i = { workbookViewId: "0" };
	return (((r || {}).Workbook || {}).Views || [])[0] && (i.rightToLeft = r.Workbook.Views[0].RTL ? "1" : "0"), Y("sheetViews", Y("sheetView", null, i), {});
}
function lf(e, t, n, r) {
	if (e.c && n["!comments"].push([t, e.c]), e.v === void 0 && typeof e.f != "string" || e.t === "z" && !e.f) return "";
	var i = "", a = e.t, o = e.v;
	if (e.t !== "z") switch (e.t) {
		case "b":
			i = e.v ? "1" : "0";
			break;
		case "n":
			i = "" + e.v;
			break;
		case "e":
			i = bi[e.v];
			break;
		case "d":
			r && r.cellDates ? i = St(e.v, -1).toISOString() : (e = wt(e), e.t = "n", i = "" + (e.v = pt(St(e.v)))), e.z === void 0 && (e.z = U[14]);
			break;
		default:
			i = e.v;
			break;
	}
	var s = vn("v", en(i)), c = { r: t }, l = Ad(r.cellXfs, e, r);
	switch (l !== 0 && (c.s = l), e.t) {
		case "n": break;
		case "d":
			c.t = "d";
			break;
		case "b":
			c.t = "b";
			break;
		case "e":
			c.t = "e";
			break;
		case "z": break;
		default:
			if (e.v == null) {
				delete e.t;
				break;
			}
			if (e.v.length > 32767) throw Error("Text length must not exceed 32767 characters");
			if (r && r.bookSST) {
				s = vn("v", "" + Dd(r.Strings, e.v, r.revStrings)), c.t = "s";
				break;
			}
			c.t = "str";
			break;
	}
	if (e.t != a && (e.t = a, e.v = o), typeof e.f == "string" && e.f) {
		var u = e.F && e.F.slice(0, t.length) == t ? {
			t: "array",
			ref: e.F
		} : null;
		s = Y("f", en(e.f), u) + (e.v == null ? "" : s);
	}
	return e.l && n["!links"].push([t, e.l]), e.D && (c.cm = 1), Y("c", s, c);
}
var uf = /*#__PURE__*/ (function() {
	var e = /<(?:\w+:)?c[ \/>]/, t = /<\/(?:\w+:)?row>/, n = /r=["']([^"']*)["']/, r = /<(?:\w+:)?is>([\S\s]*?)<\/(?:\w+:)?is>/, i = /ref=["']([^"']*)["']/, a = dn("v"), o = dn("f");
	return function(s, c, l, u, d, f) {
		for (var p = 0, m = "", h = [], g = [], _ = 0, v = 0, y = 0, b = "", x, S, C = 0, w = 0, T, E, D = 0, O = 0, k = Array.isArray(f.CellXf), A, j = [], M = [], N = Array.isArray(c), P = [], F = {}, I = !1, L = !!l.sheetStubs, R = s.split(t), ee = 0, z = R.length; ee != z; ++ee) {
			m = R[ee].trim();
			var B = m.length;
			if (B !== 0) {
				var te = 0;
				outa: for (p = 0; p < B; ++p) switch (m[p]) {
					case ">":
						if (m[p - 1] != "/") {
							++p;
							break outa;
						}
						if (l && l.cellStyles) {
							if (S = K(m.slice(te, p), !0), C = S.r == null ? C + 1 : parseInt(S.r, 10), w = -1, l.sheetRows && l.sheetRows < C) continue;
							F = {}, I = !1, S.ht && (I = !0, F.hpt = parseFloat(S.ht), F.hpx = fc(F.hpt)), S.hidden == "1" && (I = !0, F.hidden = !0), S.outlineLevel != null && (I = !0, F.level = +S.outlineLevel), I && (P[C - 1] = F);
						}
						break;
					case "<":
						te = p;
						break;
				}
				if (te >= p) break;
				if (S = K(m.slice(te, p), !0), C = S.r == null ? C + 1 : parseInt(S.r, 10), w = -1, !(l.sheetRows && l.sheetRows < C)) {
					u.s.r > C - 1 && (u.s.r = C - 1), u.e.r < C - 1 && (u.e.r = C - 1), l && l.cellStyles && (F = {}, I = !1, S.ht && (I = !0, F.hpt = parseFloat(S.ht), F.hpx = fc(F.hpt)), S.hidden == "1" && (I = !0, F.hidden = !0), S.outlineLevel != null && (I = !0, F.level = +S.outlineLevel), I && (P[C - 1] = F)), h = m.slice(p).split(e);
					for (var ne = 0; ne != h.length && h[ne].trim().charAt(0) == "<"; ++ne);
					for (h = h.slice(ne), p = 0; p != h.length; ++p) if (m = h[p].trim(), m.length !== 0) {
						if (g = m.match(n), _ = p, v = 0, y = 0, m = "<c " + (m.slice(0, 1) == "<" ? ">" : "") + m, g != null && g.length === 2) {
							for (_ = 0, b = g[1], v = 0; v != b.length && !((y = b.charCodeAt(v) - 64) < 1 || y > 26); ++v) _ = 26 * _ + y;
							--_, w = _;
						} else ++w;
						for (v = 0; v != m.length && m.charCodeAt(v) !== 62; ++v);
						if (++v, S = K(m.slice(0, v), !0), S.r ||= X({
							r: C - 1,
							c: w
						}), b = m.slice(v), x = { t: "" }, (g = b.match(a)) != null && g[1] !== "" && (x.v = q(g[1])), l.cellFormula) {
							if ((g = b.match(o)) != null && g[1] !== "") {
								if (x.f = q(J(g[1])).replace(/\r\n/g, "\n"), l.xlfn || (x.f = Ml(x.f)), g[0].indexOf("t=\"array\"") > -1) x.F = (b.match(i) || [])[1], x.F.indexOf(":") > -1 && j.push([kr(x.F), x.F]);
								else if (g[0].indexOf("t=\"shared\"") > -1) {
									E = K(g[0]);
									var V = q(J(g[1]));
									l.xlfn || (V = Ml(V)), M[parseInt(E.si, 10)] = [
										E,
										V,
										S.r
									];
								}
							} else (g = b.match(/<f[^>]*\/>/)) && (E = K(g[0]), M[E.si] && (x.f = Al(M[E.si][1], M[E.si][2], S.r)));
							var re = Dr(S.r);
							for (v = 0; v < j.length; ++v) re.r >= j[v][0].s.r && re.r <= j[v][0].e.r && re.c >= j[v][0].s.c && re.c <= j[v][0].e.c && (x.F = j[v][1]);
						}
						if (S.t == null && x.v === void 0) if (x.f || x.F) x.v = 0, x.t = "n";
						else if (L) x.t = "z";
						else continue;
						else x.t = S.t || "n";
						switch (u.s.c > w && (u.s.c = w), u.e.c < w && (u.e.c = w), x.t) {
							case "n":
								if (x.v == "" || x.v == null) {
									if (!L) continue;
									x.t = "z";
								} else x.v = parseFloat(x.v);
								break;
							case "s":
								if (x.v === void 0) {
									if (!L) continue;
									x.t = "z";
								} else T = wd[parseInt(x.v, 10)], x.v = T.t, x.r = T.r, l.cellHTML && (x.h = T.h);
								break;
							case "str":
								x.t = "s", x.v = x.v == null ? "" : J(x.v), l.cellHTML && (x.h = nn(x.v));
								break;
							case "inlineStr":
								g = b.match(r), x.t = "s", g != null && (T = gs(g[1])) ? (x.v = T.t, l.cellHTML && (x.h = T.h)) : x.v = "";
								break;
							case "b":
								x.v = an(x.v);
								break;
							case "d":
								l.cellDates ? x.v = St(x.v, 1) : (x.v = pt(St(x.v, 1)), x.t = "n");
								break;
							case "e":
								(!l || l.cellText !== !1) && (x.w = x.v), x.v = xi[x.v];
								break;
						}
						if (D = O = 0, A = null, k && S.s !== void 0 && (A = f.CellXf[S.s], A != null && (A.numFmtId != null && (D = A.numFmtId), l.cellStyles && A.fillId != null && (O = A.fillId))), jd(x, D, O, l, d, f), l.cellDates && k && x.t == "n" && We(U[D]) && (x.t = "d", x.v = _t(x.v)), S.cm && l.xlmeta) {
							var H = (l.xlmeta.Cell || [])[S.cm - 1];
							H && H.type == "XLDAPR" && (x.D = !0);
						}
						if (N) {
							var ie = Dr(S.r);
							c[ie.r] || (c[ie.r] = []), c[ie.r][ie.c] = x;
						} else c[S.r] = x;
					}
				}
			}
		}
		P.length > 0 && (c["!rows"] = P);
	};
})();
function df(e, t, n, r) {
	var i = [], a = [], o = kr(e["!ref"]), s = "", c, l = "", u = [], d = 0, f = 0, p = e["!rows"], m = Array.isArray(e), h = { r: l }, g, _ = -1;
	for (f = o.s.c; f <= o.e.c; ++f) u[f] = Cr(f);
	for (d = o.s.r; d <= o.e.r; ++d) {
		for (a = [], l = yr(d), f = o.s.c; f <= o.e.c; ++f) {
			c = u[f] + l;
			var v = m ? (e[d] || [])[f] : e[c];
			v !== void 0 && (s = lf(v, c, e, t, n, r)) != null && a.push(s);
		}
		(a.length > 0 || p && p[d]) && (h = { r: l }, p && p[d] && (g = p[d], g.hidden && (h.hidden = 1), _ = -1, g.hpx ? _ = dc(g.hpx) : g.hpt && (_ = g.hpt), _ > -1 && (h.ht = _, h.customHeight = 1), g.level && (h.outlineLevel = g.level)), i[i.length] = Y("row", a.join(""), h));
	}
	if (p) for (; d < p.length; ++d) p && p[d] && (h = { r: d + 1 }, g = p[d], g.hidden && (h.hidden = 1), _ = -1, g.hpx ? _ = dc(g.hpx) : g.hpt && (_ = g.hpt), _ > -1 && (h.ht = _, h.customHeight = 1), g.level && (h.outlineLevel = g.level), i[i.length] = Y("row", "", h));
	return i.join("");
}
function ff(e, t, n, r) {
	var i = [Ut, Y("worksheet", null, {
		xmlns: Tn[0],
		"xmlns:r": wn.r
	})], a = n.SheetNames[e], o = 0, s = "", c = n.Sheets[a];
	c ??= {};
	var l = c["!ref"] || "A1", u = kr(l);
	if (u.e.c > 16383 || u.e.r > 1048575) {
		if (t.WTF) throw Error("Range " + l + " exceeds format limit A1:XFD1048576");
		u.e.c = Math.min(u.e.c, 16383), u.e.r = Math.min(u.e.c, 1048575), l = Z(u);
	}
	r ||= {}, c["!comments"] = [];
	var d = [];
	Jd(c, n, e, t, i), i[i.length] = Y("dimension", null, { ref: l }), i[i.length] = cf(c, t, e, n), t.sheetFormat && (i[i.length] = Y("sheetFormatPr", null, {
		defaultRowHeight: t.sheetFormat.defaultRowHeight || "16",
		baseColWidth: t.sheetFormat.baseColWidth || "10",
		outlineLevelRow: t.sheetFormat.outlineLevelRow || "7"
	})), c["!cols"] != null && c["!cols"].length > 0 && (i[i.length] = nf(c, c["!cols"])), i[o = i.length] = "<sheetData/>", c["!links"] = [], c["!ref"] != null && (s = df(c, t, e, n, r), s.length > 0 && (i[i.length] = s)), i.length > o + 1 && (i[i.length] = "</sheetData>", i[o] = i[o].replace("/>", ">")), c["!protect"] && (i[i.length] = Zd(c["!protect"])), c["!autofilter"] != null && (i[i.length] = af(c["!autofilter"], c, n, e)), c["!merges"] != null && c["!merges"].length > 0 && (i[i.length] = Gd(c["!merges"]));
	var f = -1, p, m = -1;
	return c["!links"].length > 0 && (i[i.length] = "<hyperlinks>", c["!links"].forEach(function(e) {
		e[1].Target && (p = { ref: e[0] }, e[1].Target.charAt(0) != "#" && (m = Ai(r, -1, en(e[1].Target).replace(/#.*$/, ""), Q.HLINK), p["r:id"] = "rId" + m), (f = e[1].Target.indexOf("#")) > -1 && (p.location = en(e[1].Target.slice(f + 1))), e[1].Tooltip && (p.tooltip = en(e[1].Tooltip)), i[i.length] = Y("hyperlink", null, p));
	}), i[i.length] = "</hyperlinks>"), delete c["!links"], c["!margins"] != null && (i[i.length] = ef(c["!margins"])), (!t || t.ignoreEC || t.ignoreEC == null) && (i[i.length] = vn("ignoredErrors", Y("ignoredError", null, {
		numberStoredAsText: 1,
		sqref: l
	}))), d.length > 0 && (m = Ai(r, -1, "../drawings/drawing" + (e + 1) + ".xml", Q.DRAW), i[i.length] = Y("drawing", null, { "r:id": "rId" + m }), c["!drawing"] = d), c["!comments"].length > 0 && (m = Ai(r, -1, "../drawings/vmlDrawing" + (e + 1) + ".vml", Q.VML), i[i.length] = Y("legacyDrawing", null, { "r:id": "rId" + m }), c["!legacy"] = m), i.length > 1 && (i[i.length] = "</worksheet>", i[1] = i[1].replace("/>", ">")), i.join("");
}
function pf(e, t) {
	var n = {}, r = e.l + t;
	n.r = e.read_shift(4), e.l += 4;
	var i = e.read_shift(2);
	e.l += 1;
	var a = e.read_shift(1);
	return e.l = r, a & 7 && (n.level = a & 7), a & 16 && (n.hidden = !0), a & 32 && (n.hpt = i / 20), n;
}
var mf = Jr;
function hf() {}
function gf(e, t) {
	var n = {}, r = e[e.l];
	return ++e.l, n.above = !(r & 64), n.left = !(r & 128), e.l += 18, n.name = Hr(e, t - 19), n;
}
function _f(e) {
	return [Br(e)];
}
function vf(e) {
	return [Vr(e)];
}
function yf(e) {
	return [
		Br(e),
		e.read_shift(1),
		"b"
	];
}
function bf(e) {
	return [
		Vr(e),
		e.read_shift(1),
		"b"
	];
}
function xf(e) {
	return [
		Br(e),
		e.read_shift(1),
		"e"
	];
}
function Sf(e) {
	return [
		Vr(e),
		e.read_shift(1),
		"e"
	];
}
function Cf(e) {
	return [
		Br(e),
		e.read_shift(4),
		"s"
	];
}
function wf(e) {
	return [
		Vr(e),
		e.read_shift(4),
		"s"
	];
}
function Tf(e) {
	return [
		Br(e),
		Yr(e),
		"n"
	];
}
function Ef(e) {
	return [
		Vr(e),
		Yr(e),
		"n"
	];
}
function Df(e) {
	return [
		Br(e),
		Kr(e),
		"n"
	];
}
function Of(e) {
	return [
		Vr(e),
		Kr(e),
		"n"
	];
}
function kf(e) {
	return [
		Br(e),
		Rr(e),
		"is"
	];
}
function Af(e) {
	return [
		Br(e),
		Ir(e),
		"str"
	];
}
function jf(e) {
	return [
		Vr(e),
		Ir(e),
		"str"
	];
}
function Mf(e, t, n) {
	var r = e.l + t, i = Br(e);
	i.r = n["!row"];
	var a = [
		i,
		e.read_shift(1),
		"b"
	];
	return n.cellFormula ? (e.l += 2, a[3] = sd(gd(e, r - e.l, n), null, i, n.supbooks, n)) : e.l = r, a;
}
function Nf(e, t, n) {
	var r = e.l + t, i = Br(e);
	i.r = n["!row"];
	var a = [
		i,
		e.read_shift(1),
		"e"
	];
	return n.cellFormula ? (e.l += 2, a[3] = sd(gd(e, r - e.l, n), null, i, n.supbooks, n)) : e.l = r, a;
}
function Pf(e, t, n) {
	var r = e.l + t, i = Br(e);
	i.r = n["!row"];
	var a = [
		i,
		Yr(e),
		"n"
	];
	return n.cellFormula ? (e.l += 2, a[3] = sd(gd(e, r - e.l, n), null, i, n.supbooks, n)) : e.l = r, a;
}
function Ff(e, t, n) {
	var r = e.l + t, i = Br(e);
	i.r = n["!row"];
	var a = [
		i,
		Ir(e),
		"str"
	];
	return n.cellFormula ? (e.l += 2, a[3] = sd(gd(e, r - e.l, n), null, i, n.supbooks, n)) : e.l = r, a;
}
var If = Jr;
function Lf(e, t) {
	var n = e.l + t, r = Jr(e, 16), i = Ur(e), a = Ir(e), o = Ir(e), s = Ir(e);
	e.l = n;
	var c = {
		rfx: r,
		relId: i,
		loc: a,
		display: s
	};
	return o && (c.Tooltip = o), c;
}
function Rf() {}
function zf(e, t, n) {
	var r = e.l + t, i = qr(e, 16), a = e.read_shift(1), o = [i];
	return o[2] = a, n.cellFormula ? o[1] = hd(e, r - e.l, n) : e.l = r, o;
}
function Bf(e, t, n) {
	var r = e.l + t, i = [Jr(e, 16)];
	return n.cellFormula && (i[1] = vd(e, r - e.l, n)), e.l = r, i;
}
var Vf = [
	"left",
	"right",
	"top",
	"bottom",
	"header",
	"footer"
];
function Hf(e) {
	var t = {};
	return Vf.forEach(function(n) {
		t[n] = Yr(e, 8);
	}), t;
}
function Uf(e) {
	var t = e.read_shift(2);
	return e.l += 28, { RTL: t & 32 };
}
function Wf() {}
function Gf() {}
function Kf(e, t, n, r, i, a, o) {
	if (!e) return e;
	var s = t || {};
	r ||= { "!id": {} }, v != null && s.dense == null && (s.dense = v);
	var c = s.dense ? [] : {}, l, u = {
		s: {
			r: 2e6,
			c: 2e6
		},
		e: {
			r: 0,
			c: 0
		}
	}, d = [], f = !1, p = !1, m, h, g, _, y, b, x, S, C, w = [];
	s.biff = 12, s["!row"] = 0;
	var T = 0, E = !1, D = [], O = {}, k = s.supbooks || i.supbooks || [[]];
	if (k.sharedf = O, k.arrayf = D, k.SheetNames = i.SheetNames || i.Sheets.map(function(e) {
		return e.name;
	}), !s.supbooks && (s.supbooks = k, i.Names)) for (var A = 0; A < i.Names.length; ++A) k[0][A + 1] = i.Names[A];
	var j = [], M = [], N = !1;
	Zp[16] = {
		n: "BrtShortReal",
		f: Ef
	};
	var P, F;
	if (fr(e, function(e, t, v) {
		if (!p) switch (v) {
			case 148:
				l = e;
				break;
			case 0:
				m = e, s.sheetRows && s.sheetRows <= m.r && (p = !0), S = yr(_ = m.r), s["!row"] = m.r, (e.hidden || e.hpt || e.level != null) && (e.hpt && (e.hpx = fc(e.hpt)), M[e.r] = e);
				break;
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 62:
				switch (h = { t: e[2] }, e[2]) {
					case "n":
						h.v = e[1];
						break;
					case "s":
						x = wd[e[1]], h.v = x.t, h.r = x.r;
						break;
					case "b":
						h.v = !!e[1];
						break;
					case "e":
						h.v = e[1], s.cellText !== !1 && (h.w = bi[h.v]);
						break;
					case "str":
						h.t = "s", h.v = e[1];
						break;
					case "is":
						h.t = "s", h.v = e[1].t;
						break;
				}
				if ((g = o.CellXf[e[0].iStyleRef]) && jd(h, g.numFmtId, null, s, a, o), y = e[0].c == -1 ? y + 1 : e[0].c, s.dense ? (c[_] || (c[_] = []), c[_][y] = h) : c[Cr(y) + S] = h, s.cellFormula) {
					for (E = !1, T = 0; T < D.length; ++T) {
						var A = D[T];
						m.r >= A[0].s.r && m.r <= A[0].e.r && y >= A[0].s.c && y <= A[0].e.c && (h.F = Z(A[0]), E = !0);
					}
					!E && e.length > 3 && (h.f = e[3]);
				}
				if (u.s.r > m.r && (u.s.r = m.r), u.s.c > y && (u.s.c = y), u.e.r < m.r && (u.e.r = m.r), u.e.c < y && (u.e.c = y), s.cellDates && g && h.t == "n" && We(U[g.numFmtId])) {
					var I = se(h.v);
					I && (h.t = "d", h.v = new Date(I.y, I.m - 1, I.d, I.H, I.M, I.S, I.u));
				}
				P &&= (P.type == "XLDAPR" && (h.D = !0), void 0), F &&= void 0;
				break;
			case 1:
			case 12:
				if (!s.sheetStubs || f) break;
				h = {
					t: "z",
					v: void 0
				}, y = e[0].c == -1 ? y + 1 : e[0].c, s.dense ? (c[_] || (c[_] = []), c[_][y] = h) : c[Cr(y) + S] = h, u.s.r > m.r && (u.s.r = m.r), u.s.c > y && (u.s.c = y), u.e.r < m.r && (u.e.r = m.r), u.e.c < y && (u.e.c = y), P &&= (P.type == "XLDAPR" && (h.D = !0), void 0), F &&= void 0;
				break;
			case 176:
				w.push(e);
				break;
			case 49:
				P = ((s.xlmeta || {}).Cell || [])[e - 1];
				break;
			case 494:
				var L = r["!id"][e.relId];
				for (L ? (e.Target = L.Target, e.loc && (e.Target += "#" + e.loc), e.Rel = L) : e.relId == "" && (e.Target = "#" + e.loc), _ = e.rfx.s.r; _ <= e.rfx.e.r; ++_) for (y = e.rfx.s.c; y <= e.rfx.e.c; ++y) s.dense ? (c[_] || (c[_] = []), c[_][y] || (c[_][y] = {
					t: "z",
					v: void 0
				}), c[_][y].l = e) : (b = X({
					c: y,
					r: _
				}), c[b] || (c[b] = {
					t: "z",
					v: void 0
				}), c[b].l = e);
				break;
			case 426:
				if (!s.cellFormula) break;
				D.push(e), C = s.dense ? c[_][y] : c[Cr(y) + S], C.f = sd(e[1], u, {
					r: m.r,
					c: y
				}, k, s), C.F = Z(e[0]);
				break;
			case 427:
				if (!s.cellFormula) break;
				O[X(e[0].s)] = e[1], C = s.dense ? c[_][y] : c[Cr(y) + S], C.f = sd(e[1], u, {
					r: m.r,
					c: y
				}, k, s);
				break;
			case 60:
				if (!s.cellStyles) break;
				for (; e.e >= e.s;) j[e.e--] = {
					width: e.w / 256,
					hidden: !!(e.flags & 1),
					level: e.level
				}, N || (N = !0, cc(e.w / 256)), lc(j[e.e + 1]);
				break;
			case 161:
				c["!autofilter"] = { ref: Z(e) };
				break;
			case 476:
				c["!margins"] = e;
				break;
			case 147:
				i.Sheets[n] || (i.Sheets[n] = {}), e.name && (i.Sheets[n].CodeName = e.name), (e.above || e.left) && (c["!outline"] = {
					above: e.above,
					left: e.left
				});
				break;
			case 137:
				i.Views ||= [{}], i.Views[0] || (i.Views[0] = {}), e.RTL && (i.Views[0].RTL = !0);
				break;
			case 485: break;
			case 64:
			case 1053: break;
			case 151: break;
			case 152:
			case 175:
			case 644:
			case 625:
			case 562:
			case 396:
			case 1112:
			case 1146:
			case 471:
			case 1050:
			case 649:
			case 1105:
			case 589:
			case 607:
			case 564:
			case 1055:
			case 168:
			case 174:
			case 1180:
			case 499:
			case 507:
			case 550:
			case 171:
			case 167:
			case 1177:
			case 169:
			case 1181:
			case 551:
			case 552:
			case 661:
			case 639:
			case 478:
			case 537:
			case 477:
			case 536:
			case 1103:
			case 680:
			case 1104:
			case 1024:
			case 663:
			case 535:
			case 678:
			case 504:
			case 1043:
			case 428:
			case 170:
			case 3072:
			case 50:
			case 2070:
			case 1045: break;
			case 35:
				f = !0;
				break;
			case 36:
				f = !1;
				break;
			case 37:
				d.push(v), f = !0;
				break;
			case 38:
				d.pop(), f = !1;
				break;
			default: if (!t.T && (!f || s.WTF)) throw Error("Unexpected record 0x" + v.toString(16));
		}
	}, s), delete s.supbooks, delete s["!row"], !c["!ref"] && (u.s.r < 2e6 || l && (l.e.r > 0 || l.e.c > 0 || l.s.r > 0 || l.s.c > 0)) && (c["!ref"] = Z(l || u)), s.sheetRows && c["!ref"]) {
		var I = kr(c["!ref"]);
		s.sheetRows <= +I.e.r && (I.e.r = s.sheetRows - 1, I.e.r > u.e.r && (I.e.r = u.e.r), I.e.r < I.s.r && (I.s.r = I.e.r), I.e.c > u.e.c && (I.e.c = u.e.c), I.e.c < I.s.c && (I.s.c = I.e.c), c["!fullref"] = c["!ref"], c["!ref"] = Z(I));
	}
	return w.length > 0 && (c["!merges"] = w), j.length > 0 && (c["!cols"] = j), M.length > 0 && (c["!rows"] = M), c;
}
function qf(e) {
	var t = [], n = e.match(/^<c:numCache>/), r;
	(e.match(/<c:pt idx="(\d*)">(.*?)<\/c:pt>/gm) || []).forEach(function(e) {
		var r = e.match(/<c:pt idx="(\d*?)"><c:v>(.*)<\/c:v><\/c:pt>/);
		r && (t[+r[1]] = n ? +r[2] : r[2]);
	});
	var i = q((e.match(/<c:formatCode>([\s\S]*?)<\/c:formatCode>/) || ["", "General"])[1]);
	return (e.match(/<c:f>(.*?)<\/c:f>/gm) || []).forEach(function(e) {
		r = e.replace(/<.*?>/g, "");
	}), [
		t,
		i,
		r
	];
}
function Jf(e, t, n, r, i, a) {
	var o = a || { "!type": "chart" };
	if (!e) return a;
	var s = 0, c = 0, l = "A", u = {
		s: {
			r: 2e6,
			c: 2e6
		},
		e: {
			r: 0,
			c: 0
		}
	};
	return (e.match(/<c:numCache>[\s\S]*?<\/c:numCache>/gm) || []).forEach(function(e) {
		var t = qf(e);
		u.s.r = u.s.c = 0, u.e.c = s, l = Cr(s), t[0].forEach(function(e, n) {
			o[l + yr(n)] = {
				t: "n",
				v: e,
				z: t[1]
			}, c = n;
		}), u.e.r < c && (u.e.r = c), ++s;
	}), s > 0 && (o["!ref"] = Z(u)), o;
}
function Yf(e, t, n, r, i) {
	if (!e) return e;
	r ||= { "!id": {} };
	var a = {
		"!type": "chart",
		"!drawel": null,
		"!rel": ""
	}, o, s = e.match(Vd);
	return s && Kd(s[0], a, i, n), (o = e.match(/drawing r:id="(.*?)"/)) && (a["!rel"] = o[1]), r["!id"][a["!rel"]] && (a["!drawel"] = r["!id"][a["!rel"]]), a;
}
function Xf(e, t) {
	return e.l += 10, { name: Ir(e, t - 10) };
}
function Zf(e, t, n, r, i) {
	if (!e) return e;
	r ||= { "!id": {} };
	var a = {
		"!type": "chart",
		"!drawel": null,
		"!rel": ""
	}, o = [], s = !1;
	return fr(e, function(e, r, c) {
		switch (c) {
			case 550:
				a["!rel"] = e;
				break;
			case 651:
				i.Sheets[n] || (i.Sheets[n] = {}), e.name && (i.Sheets[n].CodeName = e.name);
				break;
			case 562:
			case 652:
			case 669:
			case 679:
			case 551:
			case 552:
			case 476:
			case 3072: break;
			case 35:
				s = !0;
				break;
			case 36:
				s = !1;
				break;
			case 37:
				o.push(c);
				break;
			case 38:
				o.pop();
				break;
			default: if (r.T > 0) o.push(c);
			else if (r.T < 0) o.pop();
			else if (!s || t.WTF) throw Error("Unexpected record 0x" + c.toString(16));
		}
	}, t), r["!id"][a["!rel"]] && (a["!drawel"] = r["!id"][a["!rel"]]), a;
}
var Qf = [
	[
		"allowRefreshQuery",
		!1,
		"bool"
	],
	[
		"autoCompressPictures",
		!0,
		"bool"
	],
	[
		"backupFile",
		!1,
		"bool"
	],
	[
		"checkCompatibility",
		!1,
		"bool"
	],
	["CodeName", ""],
	[
		"date1904",
		!1,
		"bool"
	],
	[
		"defaultThemeVersion",
		0,
		"int"
	],
	[
		"filterPrivacy",
		!1,
		"bool"
	],
	[
		"hidePivotFieldList",
		!1,
		"bool"
	],
	[
		"promptedSolutions",
		!1,
		"bool"
	],
	[
		"publishItems",
		!1,
		"bool"
	],
	[
		"refreshAllConnections",
		!1,
		"bool"
	],
	[
		"saveExternalLinkValues",
		!0,
		"bool"
	],
	[
		"showBorderUnselectedTables",
		!0,
		"bool"
	],
	[
		"showInkAnnotation",
		!0,
		"bool"
	],
	["showObjects", "all"],
	[
		"showPivotChartFilter",
		!1,
		"bool"
	],
	["updateLinks", "userSet"]
], $f = [
	[
		"activeTab",
		0,
		"int"
	],
	[
		"autoFilterDateGrouping",
		!0,
		"bool"
	],
	[
		"firstSheet",
		0,
		"int"
	],
	[
		"minimized",
		!1,
		"bool"
	],
	[
		"showHorizontalScroll",
		!0,
		"bool"
	],
	[
		"showSheetTabs",
		!0,
		"bool"
	],
	[
		"showVerticalScroll",
		!0,
		"bool"
	],
	[
		"tabRatio",
		600,
		"int"
	],
	["visibility", "visible"]
], ep = [], tp = [
	["calcCompleted", "true"],
	["calcMode", "auto"],
	["calcOnSave", "true"],
	["concurrentCalc", "true"],
	["fullCalcOnLoad", "false"],
	["fullPrecision", "true"],
	["iterate", "false"],
	["iterateCount", "100"],
	["iterateDelta", "0.001"],
	["refMode", "A1"]
];
function np(e, t) {
	for (var n = 0; n != e.length; ++n) for (var r = e[n], i = 0; i != t.length; ++i) {
		var a = t[i];
		if (r[a[0]] == null) r[a[0]] = a[1];
		else switch (a[2]) {
			case "bool":
				typeof r[a[0]] == "string" && (r[a[0]] = an(r[a[0]]));
				break;
			case "int":
				typeof r[a[0]] == "string" && (r[a[0]] = parseInt(r[a[0]], 10));
				break;
		}
	}
}
function rp(e, t) {
	for (var n = 0; n != t.length; ++n) {
		var r = t[n];
		if (e[r[0]] == null) e[r[0]] = r[1];
		else switch (r[2]) {
			case "bool":
				typeof e[r[0]] == "string" && (e[r[0]] = an(e[r[0]]));
				break;
			case "int":
				typeof e[r[0]] == "string" && (e[r[0]] = parseInt(e[r[0]], 10));
				break;
		}
	}
}
function ip(e) {
	rp(e.WBProps, Qf), rp(e.CalcPr, tp), np(e.WBView, $f), np(e.Sheets, ep), Td.date1904 = an(e.WBProps.date1904);
}
var ap = /*#__PURE__*/ "][*?/\\".split("");
function op(e, t) {
	if (e.length > 31) {
		if (t) return !1;
		throw Error("Sheet names cannot exceed 31 chars");
	}
	var n = !0;
	return ap.forEach(function(r) {
		if (e.indexOf(r) != -1) {
			if (!t) throw Error("Sheet name cannot contain : \\ / ? * [ ]");
			n = !1;
		}
	}), n;
}
function sp(e, t, n) {
	e.forEach(function(r, i) {
		op(r);
		for (var a = 0; a < i; ++a) if (r == e[a]) throw Error("Duplicate Sheet Name: " + r);
		if (n) {
			var o = t && t[i] && t[i].CodeName || r;
			if (o.charCodeAt(0) == 95 && o.length > 22) throw Error("Bad Code Name: Worksheet" + o);
		}
	});
}
function cp(e) {
	if (!e || !e.SheetNames || !e.Sheets) throw Error("Invalid Workbook");
	if (!e.SheetNames.length) throw Error("Workbook is empty");
	var t = e.Workbook && e.Workbook.Sheets || [];
	sp(e.SheetNames, t, !!e.vbaraw);
	for (var n = 0; n < e.SheetNames.length; ++n) Md(e.Sheets[e.SheetNames[n]], e.SheetNames[n], n);
}
var lp = /<\w+:workbook/;
function up(e, t) {
	if (!e) throw Error("Could not find file");
	var n = {
		AppVersion: {},
		WBProps: {},
		WBView: [],
		Sheets: [],
		CalcPr: {},
		Names: [],
		xmlns: ""
	}, r = !1, i = "xmlns", a = {}, o = 0;
	if (e.replace(Kt, function(s, c) {
		var l = K(s);
		switch (Yt(l[0])) {
			case "<?xml": break;
			case "<workbook":
				s.match(lp) && (i = "xmlns" + s.match(/<(\w+):/)[1]), n.xmlns = l[i];
				break;
			case "</workbook>": break;
			case "<fileVersion":
				delete l[0], n.AppVersion = l;
				break;
			case "<fileVersion/>":
			case "</fileVersion>": break;
			case "<fileSharing": break;
			case "<fileSharing/>": break;
			case "<workbookPr":
			case "<workbookPr/>":
				Qf.forEach(function(e) {
					if (l[e[0]] != null) switch (e[2]) {
						case "bool":
							n.WBProps[e[0]] = an(l[e[0]]);
							break;
						case "int":
							n.WBProps[e[0]] = parseInt(l[e[0]], 10);
							break;
						default: n.WBProps[e[0]] = l[e[0]];
					}
				}), l.codeName && (n.WBProps.CodeName = J(l.codeName));
				break;
			case "</workbookPr>": break;
			case "<workbookProtection": break;
			case "<workbookProtection/>": break;
			case "<bookViews":
			case "<bookViews>":
			case "</bookViews>": break;
			case "<workbookView":
			case "<workbookView/>":
				delete l[0], n.WBView.push(l);
				break;
			case "</workbookView>": break;
			case "<sheets":
			case "<sheets>":
			case "</sheets>": break;
			case "<sheet":
				switch (l.state) {
					case "hidden":
						l.Hidden = 1;
						break;
					case "veryHidden":
						l.Hidden = 2;
						break;
					default: l.Hidden = 0;
				}
				delete l.state, l.name = q(J(l.name)), delete l[0], n.Sheets.push(l);
				break;
			case "</sheet>": break;
			case "<functionGroups":
			case "<functionGroups/>": break;
			case "<functionGroup": break;
			case "<externalReferences":
			case "</externalReferences>":
			case "<externalReferences>": break;
			case "<externalReference": break;
			case "<definedNames/>": break;
			case "<definedNames>":
			case "<definedNames":
				r = !0;
				break;
			case "</definedNames>":
				r = !1;
				break;
			case "<definedName":
				a = {}, a.Name = J(l.name), l.comment && (a.Comment = l.comment), l.localSheetId && (a.Sheet = +l.localSheetId), an(l.hidden || "0") && (a.Hidden = !0), o = c + s.length;
				break;
			case "</definedName>":
				a.Ref = q(J(e.slice(o, c))), n.Names.push(a);
				break;
			case "<definedName/>": break;
			case "<calcPr":
				delete l[0], n.CalcPr = l;
				break;
			case "<calcPr/>":
				delete l[0], n.CalcPr = l;
				break;
			case "</calcPr>": break;
			case "<oleSize": break;
			case "<customWorkbookViews>":
			case "</customWorkbookViews>":
			case "<customWorkbookViews": break;
			case "<customWorkbookView":
			case "</customWorkbookView>": break;
			case "<pivotCaches>":
			case "</pivotCaches>":
			case "<pivotCaches": break;
			case "<pivotCache": break;
			case "<smartTagPr":
			case "<smartTagPr/>": break;
			case "<smartTagTypes":
			case "<smartTagTypes>":
			case "</smartTagTypes>": break;
			case "<smartTagType": break;
			case "<webPublishing":
			case "<webPublishing/>": break;
			case "<fileRecoveryPr":
			case "<fileRecoveryPr/>": break;
			case "<webPublishObjects>":
			case "<webPublishObjects":
			case "</webPublishObjects>": break;
			case "<webPublishObject": break;
			case "<extLst":
			case "<extLst>":
			case "</extLst>":
			case "<extLst/>": break;
			case "<ext":
				r = !0;
				break;
			case "</ext>":
				r = !1;
				break;
			case "<ArchID": break;
			case "<AlternateContent":
			case "<AlternateContent>":
				r = !0;
				break;
			case "</AlternateContent>":
				r = !1;
				break;
			case "<revisionPtr": break;
			default: if (!r && t.WTF) throw Error("unrecognized " + l[0] + " in workbook");
		}
		return s;
	}), Tn.indexOf(n.xmlns) === -1) throw Error("Unknown Namespace: " + n.xmlns);
	return ip(n), n;
}
function dp(e) {
	var t = [Ut];
	t[t.length] = Y("workbook", null, {
		xmlns: Tn[0],
		"xmlns:r": wn.r
	});
	var n = e.Workbook && (e.Workbook.Names || []).length > 0, r = { codeName: "ThisWorkbook" };
	e.Workbook && e.Workbook.WBProps && (Qf.forEach(function(t) {
		e.Workbook.WBProps[t[0]] != null && e.Workbook.WBProps[t[0]] != t[1] && (r[t[0]] = e.Workbook.WBProps[t[0]]);
	}), e.Workbook.WBProps.CodeName && (r.codeName = e.Workbook.WBProps.CodeName, delete r.CodeName)), t[t.length] = Y("workbookPr", null, r);
	var i = e.Workbook && e.Workbook.Sheets || [], a = 0;
	if (i && i[0] && i[0].Hidden) {
		for (t[t.length] = "<bookViews>", a = 0; a != e.SheetNames.length && !(!i[a] || !i[a].Hidden); ++a);
		a == e.SheetNames.length && (a = 0), t[t.length] = "<workbookView firstSheet=\"" + a + "\" activeTab=\"" + a + "\"/>", t[t.length] = "</bookViews>";
	}
	for (t[t.length] = "<sheets>", a = 0; a != e.SheetNames.length; ++a) {
		var o = { name: en(e.SheetNames[a].slice(0, 31)) };
		if (o.sheetId = "" + (a + 1), o["r:id"] = "rId" + (a + 1), i[a]) switch (i[a].Hidden) {
			case 1:
				o.state = "hidden";
				break;
			case 2:
				o.state = "veryHidden";
				break;
		}
		t[t.length] = Y("sheet", null, o);
	}
	return t[t.length] = "</sheets>", n && (t[t.length] = "<definedNames>", e.Workbook && e.Workbook.Names && e.Workbook.Names.forEach(function(e) {
		var n = { name: e.Name };
		e.Comment && (n.comment = e.Comment), e.Sheet != null && (n.localSheetId = "" + e.Sheet), e.Hidden && (n.hidden = "1"), e.Ref && (t[t.length] = Y("definedName", en(e.Ref), n));
	}), t[t.length] = "</definedNames>"), t.length > 2 && (t[t.length] = "</workbook>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function fp(e, t) {
	var n = {};
	return n.Hidden = e.read_shift(4), n.iTabID = e.read_shift(4), n.strRelID = Gr(e, t - 8), n.name = Ir(e), n;
}
function pp(e, t) {
	var n = {}, r = e.read_shift(4);
	n.defaultThemeVersion = e.read_shift(4);
	var i = t > 8 ? Ir(e) : "";
	return i.length > 0 && (n.CodeName = i), n.autoCompressPictures = !!(r & 65536), n.backupFile = !!(r & 64), n.checkCompatibility = !!(r & 4096), n.date1904 = !!(r & 1), n.filterPrivacy = !!(r & 8), n.hidePivotFieldList = !!(r & 1024), n.promptedSolutions = !!(r & 16), n.publishItems = !!(r & 2048), n.refreshAllConnections = !!(r & 262144), n.saveExternalLinkValues = !!(r & 128), n.showBorderUnselectedTables = !!(r & 4), n.showInkAnnotation = !!(r & 32), n.showObjects = [
		"all",
		"placeholders",
		"none"
	][r >> 13 & 3], n.showPivotChartFilter = !!(r & 32768), n.updateLinks = [
		"userSet",
		"never",
		"always"
	][r >> 8 & 3], n;
}
function mp(e, t) {
	var n = {};
	return e.read_shift(4), n.ArchID = e.read_shift(4), e.l += t - 8, n;
}
function hp(e, t, n) {
	var r = e.l + t;
	e.l += 4, e.l += 1;
	var i = e.read_shift(4), a = Wr(e), o = _d(e, 0, n), s = Ur(e);
	e.l = r;
	var c = {
		Name: a,
		Ptg: o
	};
	return i < 268435455 && (c.Sheet = i), s && (c.Comment = s), c;
}
function gp(e, t) {
	var n = {
		AppVersion: {},
		WBProps: {},
		WBView: [],
		Sheets: [],
		CalcPr: {},
		xmlns: ""
	}, r = [], i = !1;
	t ||= {}, t.biff = 12;
	var a = [], o = [[]];
	return o.SheetNames = [], o.XTI = [], Zp[16] = {
		n: "BrtFRTArchID$",
		f: mp
	}, fr(e, function(e, s, c) {
		switch (c) {
			case 156:
				o.SheetNames.push(e.name), n.Sheets.push(e);
				break;
			case 153:
				n.WBProps = e;
				break;
			case 39:
				e.Sheet != null && (t.SID = e.Sheet), e.Ref = sd(e.Ptg, null, null, o, t), delete t.SID, delete e.Ptg, a.push(e);
				break;
			case 1036: break;
			case 357:
			case 358:
			case 355:
			case 667:
				o[0].length ? o.push([c, e]) : o[0] = [c, e], o[o.length - 1].XTI = [];
				break;
			case 362:
				o.length === 0 && (o[0] = [], o[0].XTI = []), o[o.length - 1].XTI = o[o.length - 1].XTI.concat(e), o.XTI = o.XTI.concat(e);
				break;
			case 361: break;
			case 2071:
			case 158:
			case 143:
			case 664:
			case 353: break;
			case 3072:
			case 3073:
			case 534:
			case 677:
			case 157:
			case 610:
			case 2050:
			case 155:
			case 548:
			case 676:
			case 128:
			case 665:
			case 2128:
			case 2125:
			case 549:
			case 2053:
			case 596:
			case 2076:
			case 2075:
			case 2082:
			case 397:
			case 154:
			case 1117:
			case 553:
			case 2091: break;
			case 35:
				r.push(c), i = !0;
				break;
			case 36:
				r.pop(), i = !1;
				break;
			case 37:
				r.push(c), i = !0;
				break;
			case 38:
				r.pop(), i = !1;
				break;
			case 16: break;
			default: if (!s.T && (!i || t.WTF && r[r.length - 1] != 37 && r[r.length - 1] != 35)) throw Error("Unexpected record 0x" + c.toString(16));
		}
	}, t), ip(n), n.Names = a, n.supbooks = o, n;
}
function _p(e, t, n) {
	return t.slice(-4) === ".bin" ? gp(e, n) : up(e, n);
}
function vp(e, t, n, r, i, a, o, s) {
	return t.slice(-4) === ".bin" ? Kf(e, r, n, i, a, o, s) : Wd(e, r, n, i, a, o, s);
}
function yp(e, t, n, r, i, a, o, s) {
	return t.slice(-4) === ".bin" ? Zf(e, r, n, i, a, o, s) : Yf(e, r, n, i, a, o, s);
}
function bp(e, t, n, r, i, a, o, s) {
	return t.slice(-4) === ".bin" ? wl(e, r, n, i, a, o, s) : Tl(e, r, n, i, a, o, s);
}
function xp(e, t, n, r, i, a, o, s) {
	return t.slice(-4) === ".bin" ? Sl(e, r, n, i, a, o, s) : Cl(e, r, n, i, a, o, s);
}
function Sp(e, t, n, r) {
	return t.slice(-4) === ".bin" ? Ac(e, n, r) : Cc(e, n, r);
}
function Cp(e, t, n) {
	return Bc(e, n);
}
function wp(e, t, n) {
	return t.slice(-4) === ".bin" ? ws(e, n) : bs(e, n);
}
function Tp(e, t, n) {
	return t.slice(-4) === ".bin" ? vl(e, n) : ul(e, n);
}
function Ep(e, t, n) {
	return t.slice(-4) === ".bin" ? il(e, t, n) : nl(e, t, n);
}
function Dp(e, t, n, r) {
	if (n.slice(-4) === ".bin") return al(e, t, n, r);
}
function Op(e, t, n) {
	return t.slice(-4) === ".bin" ? $c(e, t, n) : el(e, t, n);
}
var kp = /([\w:]+)=((?:")([^"]*)(?:")|(?:')([^']*)(?:'))/g, Ap = /([\w:]+)=((?:")(?:[^"]*)(?:")|(?:')(?:[^']*)(?:'))/;
function jp(e, t) {
	var n = e.split(/\s+/), r = [];
	if (t || (r[0] = n[0]), n.length === 1) return r;
	var i = e.match(kp), a, o, s, c;
	if (i) for (c = 0; c != i.length; ++c) a = i[c].match(Ap), (o = a[1].indexOf(":")) === -1 ? r[a[1]] = a[2].slice(1, a[2].length - 1) : (s = a[1].slice(0, 6) === "xmlns:" ? "xmlns" + a[1].slice(6) : a[1].slice(o + 1), r[s] = a[2].slice(1, a[2].length - 1));
	return r;
}
function Mp(e) {
	var t = e.split(/\s+/), n = {};
	if (t.length === 1) return n;
	var r = e.match(kp), i, a, o, s;
	if (r) for (s = 0; s != r.length; ++s) i = r[s].match(Ap), (a = i[1].indexOf(":")) === -1 ? n[i[1]] = i[2].slice(1, i[2].length - 1) : (o = i[1].slice(0, 6) === "xmlns:" ? "xmlns" + i[1].slice(6) : i[1].slice(a + 1), n[o] = i[2].slice(1, i[2].length - 1));
	return n;
}
var Np;
function Pp(e, t) {
	var n = Np[e] || q(e);
	return n === "General" ? _e(t) : Ye(n, t);
}
function Fp(e, t, n, r) {
	var i = r;
	switch ((n[0].match(/dt:dt="([\w.]+)"/) || ["", ""])[1]) {
		case "boolean":
			i = an(r);
			break;
		case "i2":
		case "int":
			i = parseInt(r, 10);
			break;
		case "r4":
		case "float":
			i = parseFloat(r);
			break;
		case "date":
		case "dateTime.tz":
			i = St(r);
			break;
		case "i8":
		case "string":
		case "fixed":
		case "uuid":
		case "bin.base64": break;
		default: throw Error("bad custprop:" + n[0]);
	}
	e[q(t)] = i;
}
function Ip(e, t, n) {
	if (e.t !== "z") {
		if (!n || n.cellText !== !1) try {
			e.t === "e" ? e.w = e.w || bi[e.v] : t === "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = ge(e.v) : e.w = _e(e.v) : e.w = Pp(t || "General", e.v);
		} catch (e) {
			if (n.WTF) throw e;
		}
		try {
			var r = Np[t] || t || "General";
			if (n.cellNF && (e.z = r), n.cellDates && e.t == "n" && We(r)) {
				var i = se(e.v);
				i && (e.t = "d", e.v = new Date(i.y, i.m - 1, i.d, i.H, i.M, i.S, i.u));
			}
		} catch (e) {
			if (n.WTF) throw e;
		}
	}
}
function Lp(e, t, n) {
	if (n.cellStyles && t.Interior) {
		var r = t.Interior;
		r.Pattern && (r.patternType = pc[r.Pattern] || r.Pattern);
	}
	e[t.ID] = t;
}
function Rp(e, t, n, r, i, a, o, s, c, l) {
	var u = "General", d = r.StyleID, f = {};
	l ||= {};
	var p = [], m = 0;
	for (d === void 0 && s && (d = s.StyleID), d === void 0 && o && (d = o.StyleID); a[d] !== void 0 && (a[d].nf && (u = a[d].nf), a[d].Interior && p.push(a[d].Interior), a[d].Parent);) d = a[d].Parent;
	switch (n.Type) {
		case "Boolean":
			r.t = "b", r.v = an(e);
			break;
		case "String":
			r.t = "s", r.r = rn(q(e)), r.v = e.indexOf("<") > -1 ? q(t || e).replace(/<.*?>/g, "") : r.r;
			break;
		case "DateTime": e.slice(-1) != "Z" && (e += "Z"), r.v = (St(e) - new Date(Date.UTC(1899, 11, 30))) / (1440 * 60 * 1e3), r.v === r.v ? r.v < 60 && --r.v : r.v = q(e), (!u || u == "General") && (u = "yyyy-mm-dd");
		case "Number":
			r.v === void 0 && (r.v = +e), r.t ||= "n";
			break;
		case "Error":
			r.t = "e", r.v = xi[e], l.cellText !== !1 && (r.w = e);
			break;
		default:
			e == "" && t == "" ? r.t = "z" : (r.t = "s", r.v = rn(t || e));
			break;
	}
	if (Ip(r, u, l), l.cellFormula !== !1) if (r.Formula) {
		var h = q(r.Formula);
		h.charCodeAt(0) == 61 && (h = h.slice(1)), r.f = El(h, i), delete r.Formula, r.ArrayRange == "RC" ? r.F = El("RC:RC", i) : r.ArrayRange && (r.F = El(r.ArrayRange, i), c.push([kr(r.F), r.F]));
	} else for (m = 0; m < c.length; ++m) i.r >= c[m][0].s.r && i.r <= c[m][0].e.r && i.c >= c[m][0].s.c && i.c <= c[m][0].e.c && (r.F = c[m][1]);
	l.cellStyles && (p.forEach(function(e) {
		!f.patternType && e.patternType && (f.patternType = e.patternType);
	}), r.s = f), r.StyleID !== void 0 && (r.ixfe = r.StyleID);
}
function zp(e) {
	e.t = e.v || "", e.t = e.t.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), e.v = e.w = e.ixfe = void 0;
}
function Bp(e, t) {
	var n = t || {};
	Qe();
	var r = m(Sn(e));
	(n.type == "binary" || n.type == "array" || n.type == "base64") && (r = _ === void 0 ? J(r) : _.utils.decode(65001, d(r)));
	var i = r.slice(0, 1024).toLowerCase(), a = !1;
	if (i = i.replace(/".*?"/g, ""), (i.indexOf(">") & 1023) > Math.min(i.indexOf(",") & 1023, i.indexOf(";") & 1023)) {
		var o = wt(n);
		return o.type = "string", ss.to_workbook(r, o);
	}
	if (i.indexOf("<?xml") == -1 && [
		"html",
		"table",
		"head",
		"meta",
		"script",
		"style",
		"div"
	].forEach(function(e) {
		i.indexOf("<" + e) >= 0 && (a = !0);
	}), a) return im(r, n);
	Np = {
		"General Number": "General",
		"General Date": U[22],
		"Long Date": "dddd, mmmm dd, yyyy",
		"Medium Date": U[15],
		"Short Date": U[14],
		"Long Time": U[19],
		"Medium Time": U[18],
		"Short Time": U[20],
		Currency: "\"$\"#,##0.00_);[Red]\\(\"$\"#,##0.00\\)",
		Fixed: U[2],
		Standard: U[4],
		Percent: U[10],
		Scientific: U[11],
		"Yes/No": "\"Yes\";\"Yes\";\"No\";@",
		"True/False": "\"True\";\"True\";\"False\";@",
		"On/Off": "\"Yes\";\"Yes\";\"No\";@"
	};
	var s, c = [], l;
	v != null && n.dense == null && (n.dense = v);
	var u = {}, f = [], p = n.dense ? [] : {}, h = "", g = {}, y = {}, b = jp("<Data ss:Type=\"String\">"), x = 0, S = 0, C = 0, w = {
		s: {
			r: 2e6,
			c: 2e6
		},
		e: {
			r: 0,
			c: 0
		}
	}, T = {}, E = {}, D = "", O = 0, k = [], A = {}, j = {}, M = 0, N = [], P = [], F = {}, I = [], L, R = !1, ee = [], z = [], B = {}, te = 0, ne = 0, V = {
		Sheets: [],
		WBProps: { date1904: !1 }
	}, re = {};
	Cn.lastIndex = 0, r = r.replace(/<!--([\s\S]*?)-->/gm, "");
	for (var H = ""; s = Cn.exec(r);) switch (s[3] = (H = s[3]).toLowerCase()) {
		case "data":
			if (H == "data") {
				if (s[1] === "/") {
					if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
				} else s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
				break;
			}
			if (c[c.length - 1][1]) break;
			s[1] === "/" ? Rp(r.slice(x, s.index), D, b, c[c.length - 1][0] == "comment" ? F : g, {
				c: S,
				r: C
			}, T, I[S], y, ee, n) : (D = "", b = jp(s[0]), x = s.index + s[0].length);
			break;
		case "cell":
			if (s[1] === "/") if (P.length > 0 && (g.c = P), (!n.sheetRows || n.sheetRows > C) && g.v !== void 0 && (n.dense ? (p[C] || (p[C] = []), p[C][S] = g) : p[Cr(S) + yr(C)] = g), g.HRef && (g.l = { Target: q(g.HRef) }, g.HRefScreenTip && (g.l.Tooltip = g.HRefScreenTip), delete g.HRef, delete g.HRefScreenTip), (g.MergeAcross || g.MergeDown) && (te = S + (parseInt(g.MergeAcross, 10) | 0), ne = C + (parseInt(g.MergeDown, 10) | 0), k.push({
				s: {
					c: S,
					r: C
				},
				e: {
					c: te,
					r: ne
				}
			})), !n.sheetStubs) g.MergeAcross ? S = te + 1 : ++S;
			else if (g.MergeAcross || g.MergeDown) {
				for (var ie = S; ie <= te; ++ie) for (var ae = C; ae <= ne; ++ae) (ie > S || ae > C) && (n.dense ? (p[ae] || (p[ae] = []), p[ae][ie] = { t: "z" }) : p[Cr(ie) + yr(ae)] = { t: "z" });
				S = te + 1;
			} else ++S;
			else g = Mp(s[0]), g.Index && (S = g.Index - 1), S < w.s.c && (w.s.c = S), S > w.e.c && (w.e.c = S), s[0].slice(-2) === "/>" && ++S, P = [];
			break;
		case "row":
			s[1] === "/" || s[0].slice(-2) === "/>" ? (C < w.s.r && (w.s.r = C), C > w.e.r && (w.e.r = C), s[0].slice(-2) === "/>" && (y = jp(s[0]), y.Index && (C = y.Index - 1)), S = 0, ++C) : (y = jp(s[0]), y.Index && (C = y.Index - 1), B = {}, (y.AutoFitHeight == "0" || y.Height) && (B.hpx = parseInt(y.Height, 10), B.hpt = dc(B.hpx), z[C] = B), y.Hidden == "1" && (B.hidden = !0, z[C] = B));
			break;
		case "worksheet":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
				f.push(h), w.s.r <= w.e.r && w.s.c <= w.e.c && (p["!ref"] = Z(w), n.sheetRows && n.sheetRows <= w.e.r && (p["!fullref"] = p["!ref"], w.e.r = n.sheetRows - 1, p["!ref"] = Z(w))), k.length && (p["!merges"] = k), I.length > 0 && (p["!cols"] = I), z.length > 0 && (p["!rows"] = z), u[h] = p;
			} else w = {
				s: {
					r: 2e6,
					c: 2e6
				},
				e: {
					r: 0,
					c: 0
				}
			}, C = S = 0, c.push([s[3], !1]), l = jp(s[0]), h = q(l.Name), p = n.dense ? [] : {}, k = [], ee = [], z = [], re = {
				name: h,
				Hidden: 0
			}, V.Sheets.push(re);
			break;
		case "table":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
			} else if (s[0].slice(-2) == "/>") break;
			else c.push([s[3], !1]), I = [], R = !1;
			break;
		case "style":
			s[1] === "/" ? Lp(T, E, n) : E = jp(s[0]);
			break;
		case "numberformat":
			E.nf = q(jp(s[0]).Format || "General"), Np[E.nf] && (E.nf = Np[E.nf]);
			for (var oe = 0; oe != 392 && U[oe] != E.nf; ++oe);
			if (oe == 392) {
				for (oe = 57; oe != 392; ++oe) if (U[oe] == null) {
					Xe(E.nf, oe);
					break;
				}
			}
			break;
		case "column":
			if (c[c.length - 1][0] !== "table") break;
			if (L = jp(s[0]), L.Hidden && (L.hidden = !0, delete L.Hidden), L.Width && (L.wpx = parseInt(L.Width, 10)), !R && L.wpx > 10) {
				R = !0, rc = ec;
				for (var W = 0; W < I.length; ++W) I[W] && lc(I[W]);
			}
			R && lc(L), I[L.Index - 1 || I.length] = L;
			for (var se = 0; se < +L.Span; ++se) I[I.length] = wt(L);
			break;
		case "namedrange":
			if (s[1] === "/") break;
			V.Names ||= [];
			var ce = K(s[0]), le = {
				Name: ce.Name,
				Ref: El(ce.RefersTo.slice(1), {
					r: 0,
					c: 0
				})
			};
			V.Sheets.length > 0 && (le.Sheet = V.Sheets.length - 1), V.Names.push(le);
			break;
		case "namedcell": break;
		case "b": break;
		case "i": break;
		case "u": break;
		case "s": break;
		case "em": break;
		case "h2": break;
		case "h3": break;
		case "sub": break;
		case "sup": break;
		case "span": break;
		case "alignment": break;
		case "borders": break;
		case "border": break;
		case "font":
			if (s[0].slice(-2) === "/>") break;
			s[1] === "/" ? D += r.slice(O, s.index) : O = s.index + s[0].length;
			break;
		case "interior":
			if (!n.cellStyles) break;
			E.Interior = jp(s[0]);
			break;
		case "protection": break;
		case "author":
		case "title":
		case "description":
		case "created":
		case "keywords":
		case "subject":
		case "category":
		case "company":
		case "lastauthor":
		case "lastsaved":
		case "lastprinted":
		case "version":
		case "revision":
		case "totaltime":
		case "hyperlinkbase":
		case "manager":
		case "contentstatus":
		case "identifier":
		case "language":
		case "appname":
			if (s[0].slice(-2) === "/>") break;
			s[1] === "/" ? qi(A, H, r.slice(M, s.index)) : M = s.index + s[0].length;
			break;
		case "paragraphs": break;
		case "styles":
		case "workbook":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
			} else c.push([s[3], !1]);
			break;
		case "comment":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
				zp(F), P.push(F);
			} else c.push([s[3], !1]), l = jp(s[0]), F = { a: l.Author };
			break;
		case "autofilter":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
			} else if (s[0].charAt(s[0].length - 2) !== "/") {
				var ue = jp(s[0]);
				p["!autofilter"] = { ref: El(ue.Range).replace(/\$/g, "") }, c.push([s[3], !0]);
			}
			break;
		case "name": break;
		case "datavalidation":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
			} else s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
			break;
		case "pixelsperinch": break;
		case "componentoptions":
		case "documentproperties":
		case "customdocumentproperties":
		case "officedocumentsettings":
		case "pivottable":
		case "pivotcache":
		case "names":
		case "mapinfo":
		case "pagebreaks":
		case "querytable":
		case "sorting":
		case "schema":
		case "conditionalformatting":
		case "smarttagtype":
		case "smarttags":
		case "excelworkbook":
		case "workbookoptions":
		case "worksheetoptions":
			if (s[1] === "/") {
				if ((l = c.pop())[0] !== s[3]) throw Error("Bad state: " + l.join("|"));
			} else s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
			break;
		case "null": break;
		default:
			if (c.length == 0 && s[3] == "document" || c.length == 0 && s[3] == "uof") return gm(r, n);
			var de = !0;
			switch (c[c.length - 1][0]) {
				case "officedocumentsettings":
					switch (s[3]) {
						case "allowpng": break;
						case "removepersonalinformation": break;
						case "downloadcomponents": break;
						case "locationofcomponents": break;
						case "colors": break;
						case "color": break;
						case "index": break;
						case "rgb": break;
						case "targetscreensize": break;
						case "readonlyrecommended": break;
						default: de = !1;
					}
					break;
				case "componentoptions":
					switch (s[3]) {
						case "toolbar": break;
						case "hideofficelogo": break;
						case "spreadsheetautofit": break;
						case "label": break;
						case "caption": break;
						case "maxheight": break;
						case "maxwidth": break;
						case "nextsheetnumber": break;
						default: de = !1;
					}
					break;
				case "excelworkbook":
					switch (s[3]) {
						case "date1904":
							V.WBProps.date1904 = !0;
							break;
						case "windowheight": break;
						case "windowwidth": break;
						case "windowtopx": break;
						case "windowtopy": break;
						case "tabratio": break;
						case "protectstructure": break;
						case "protectwindow": break;
						case "protectwindows": break;
						case "activesheet": break;
						case "displayinknotes": break;
						case "firstvisiblesheet": break;
						case "supbook": break;
						case "sheetname": break;
						case "sheetindex": break;
						case "sheetindexfirst": break;
						case "sheetindexlast": break;
						case "dll": break;
						case "acceptlabelsinformulas": break;
						case "donotsavelinkvalues": break;
						case "iteration": break;
						case "maxiterations": break;
						case "maxchange": break;
						case "path": break;
						case "xct": break;
						case "count": break;
						case "selectedsheets": break;
						case "calculation": break;
						case "uncalced": break;
						case "startupprompt": break;
						case "crn": break;
						case "externname": break;
						case "formula": break;
						case "colfirst": break;
						case "collast": break;
						case "wantadvise": break;
						case "boolean": break;
						case "error": break;
						case "text": break;
						case "ole": break;
						case "noautorecover": break;
						case "publishobjects": break;
						case "donotcalculatebeforesave": break;
						case "number": break;
						case "refmoder1c1": break;
						case "embedsavesmarttags": break;
						default: de = !1;
					}
					break;
				case "workbookoptions":
					switch (s[3]) {
						case "owcversion": break;
						case "height": break;
						case "width": break;
						default: de = !1;
					}
					break;
				case "worksheetoptions":
					switch (s[3]) {
						case "visible":
							if (s[0].slice(-2) !== "/>") if (s[1] === "/") switch (r.slice(M, s.index)) {
								case "SheetHidden":
									re.Hidden = 1;
									break;
								case "SheetVeryHidden":
									re.Hidden = 2;
									break;
							}
							else M = s.index + s[0].length;
							break;
						case "header":
							p["!margins"] || kd(p["!margins"] = {}, "xlml"), isNaN(+K(s[0]).Margin) || (p["!margins"].header = +K(s[0]).Margin);
							break;
						case "footer":
							p["!margins"] || kd(p["!margins"] = {}, "xlml"), isNaN(+K(s[0]).Margin) || (p["!margins"].footer = +K(s[0]).Margin);
							break;
						case "pagemargins":
							var fe = K(s[0]);
							p["!margins"] || kd(p["!margins"] = {}, "xlml"), isNaN(+fe.Top) || (p["!margins"].top = +fe.Top), isNaN(+fe.Left) || (p["!margins"].left = +fe.Left), isNaN(+fe.Right) || (p["!margins"].right = +fe.Right), isNaN(+fe.Bottom) || (p["!margins"].bottom = +fe.Bottom);
							break;
						case "displayrighttoleft":
							V.Views ||= [], V.Views[0] || (V.Views[0] = {}), V.Views[0].RTL = !0;
							break;
						case "freezepanes": break;
						case "frozennosplit": break;
						case "splithorizontal":
						case "splitvertical": break;
						case "donotdisplaygridlines": break;
						case "activerow": break;
						case "activecol": break;
						case "toprowbottompane": break;
						case "leftcolumnrightpane": break;
						case "unsynced": break;
						case "print": break;
						case "printerrors": break;
						case "panes": break;
						case "scale": break;
						case "pane": break;
						case "number": break;
						case "layout": break;
						case "pagesetup": break;
						case "selected": break;
						case "protectobjects": break;
						case "enableselection": break;
						case "protectscenarios": break;
						case "validprinterinfo": break;
						case "horizontalresolution": break;
						case "verticalresolution": break;
						case "numberofcopies": break;
						case "activepane": break;
						case "toprowvisible": break;
						case "leftcolumnvisible": break;
						case "fittopage": break;
						case "rangeselection": break;
						case "papersizeindex": break;
						case "pagelayoutzoom": break;
						case "pagebreakzoom": break;
						case "filteron": break;
						case "fitwidth": break;
						case "fitheight": break;
						case "commentslayout": break;
						case "zoom": break;
						case "lefttoright": break;
						case "gridlines": break;
						case "allowsort": break;
						case "allowfilter": break;
						case "allowinsertrows": break;
						case "allowdeleterows": break;
						case "allowinsertcols": break;
						case "allowdeletecols": break;
						case "allowinserthyperlinks": break;
						case "allowformatcells": break;
						case "allowsizecols": break;
						case "allowsizerows": break;
						case "nosummaryrowsbelowdetail":
							p["!outline"] ||= {}, p["!outline"].above = !0;
							break;
						case "tabcolorindex": break;
						case "donotdisplayheadings": break;
						case "showpagelayoutzoom": break;
						case "nosummarycolumnsrightdetail":
							p["!outline"] ||= {}, p["!outline"].left = !0;
							break;
						case "blackandwhite": break;
						case "donotdisplayzeros": break;
						case "displaypagebreak": break;
						case "rowcolheadings": break;
						case "donotdisplayoutline": break;
						case "noorientation": break;
						case "allowusepivottables": break;
						case "zeroheight": break;
						case "viewablerange": break;
						case "selection": break;
						case "protectcontents": break;
						default: de = !1;
					}
					break;
				case "pivottable":
				case "pivotcache":
					switch (s[3]) {
						case "immediateitemsondrop": break;
						case "showpagemultipleitemlabel": break;
						case "compactrowindent": break;
						case "location": break;
						case "pivotfield": break;
						case "orientation": break;
						case "layoutform": break;
						case "layoutsubtotallocation": break;
						case "layoutcompactrow": break;
						case "position": break;
						case "pivotitem": break;
						case "datatype": break;
						case "datafield": break;
						case "sourcename": break;
						case "parentfield": break;
						case "ptlineitems": break;
						case "ptlineitem": break;
						case "countofsameitems": break;
						case "item": break;
						case "itemtype": break;
						case "ptsource": break;
						case "cacheindex": break;
						case "consolidationreference": break;
						case "filename": break;
						case "reference": break;
						case "nocolumngrand": break;
						case "norowgrand": break;
						case "blanklineafteritems": break;
						case "hidden": break;
						case "subtotal": break;
						case "basefield": break;
						case "mapchilditems": break;
						case "function": break;
						case "refreshonfileopen": break;
						case "printsettitles": break;
						case "mergelabels": break;
						case "defaultversion": break;
						case "refreshname": break;
						case "refreshdate": break;
						case "refreshdatecopy": break;
						case "versionlastrefresh": break;
						case "versionlastupdate": break;
						case "versionupdateablemin": break;
						case "versionrefreshablemin": break;
						case "calculation": break;
						default: de = !1;
					}
					break;
				case "pagebreaks":
					switch (s[3]) {
						case "colbreaks": break;
						case "colbreak": break;
						case "rowbreaks": break;
						case "rowbreak": break;
						case "colstart": break;
						case "colend": break;
						case "rowend": break;
						default: de = !1;
					}
					break;
				case "autofilter":
					switch (s[3]) {
						case "autofiltercolumn": break;
						case "autofiltercondition": break;
						case "autofilterand": break;
						case "autofilteror": break;
						default: de = !1;
					}
					break;
				case "querytable":
					switch (s[3]) {
						case "id": break;
						case "autoformatfont": break;
						case "autoformatpattern": break;
						case "querysource": break;
						case "querytype": break;
						case "enableredirections": break;
						case "refreshedinxl9": break;
						case "urlstring": break;
						case "htmltables": break;
						case "connection": break;
						case "commandtext": break;
						case "refreshinfo": break;
						case "notitles": break;
						case "nextid": break;
						case "columninfo": break;
						case "overwritecells": break;
						case "donotpromptforfile": break;
						case "textwizardsettings": break;
						case "source": break;
						case "number": break;
						case "decimal": break;
						case "thousandseparator": break;
						case "trailingminusnumbers": break;
						case "formatsettings": break;
						case "fieldtype": break;
						case "delimiters": break;
						case "tab": break;
						case "comma": break;
						case "autoformatname": break;
						case "versionlastedit": break;
						case "versionlastrefresh": break;
						default: de = !1;
					}
					break;
				case "datavalidation":
					switch (s[3]) {
						case "range": break;
						case "type": break;
						case "min": break;
						case "max": break;
						case "sort": break;
						case "descending": break;
						case "order": break;
						case "casesensitive": break;
						case "value": break;
						case "errorstyle": break;
						case "errormessage": break;
						case "errortitle": break;
						case "inputmessage": break;
						case "inputtitle": break;
						case "combohide": break;
						case "inputhide": break;
						case "condition": break;
						case "qualifier": break;
						case "useblank": break;
						case "value1": break;
						case "value2": break;
						case "format": break;
						case "cellrangelist": break;
						default: de = !1;
					}
					break;
				case "sorting":
				case "conditionalformatting":
					switch (s[3]) {
						case "range": break;
						case "type": break;
						case "min": break;
						case "max": break;
						case "sort": break;
						case "descending": break;
						case "order": break;
						case "casesensitive": break;
						case "value": break;
						case "errorstyle": break;
						case "errormessage": break;
						case "errortitle": break;
						case "cellrangelist": break;
						case "inputmessage": break;
						case "inputtitle": break;
						case "combohide": break;
						case "inputhide": break;
						case "condition": break;
						case "qualifier": break;
						case "useblank": break;
						case "value1": break;
						case "value2": break;
						case "format": break;
						default: de = !1;
					}
					break;
				case "mapinfo":
				case "schema":
				case "data":
					switch (s[3]) {
						case "map": break;
						case "entry": break;
						case "range": break;
						case "xpath": break;
						case "field": break;
						case "xsdtype": break;
						case "filteron": break;
						case "aggregate": break;
						case "elementtype": break;
						case "attributetype": break;
						case "schema":
						case "element":
						case "complextype":
						case "datatype":
						case "all":
						case "attribute":
						case "extends": break;
						case "row": break;
						default: de = !1;
					}
					break;
				case "smarttags": break;
				default:
					de = !1;
					break;
			}
			if (de || s[3].match(/!\[CDATA/)) break;
			if (!c[c.length - 1][1]) throw "Unrecognized tag: " + s[3] + "|" + c.join("|");
			if (c[c.length - 1][0] === "customdocumentproperties") {
				if (s[0].slice(-2) === "/>") break;
				s[1] === "/" ? Fp(j, H, N, r.slice(M, s.index)) : (N = s, M = s.index + s[0].length);
				break;
			}
			if (n.WTF) throw "Unrecognized tag: " + s[3] + "|" + c.join("|");
	}
	var pe = {};
	return !n.bookSheets && !n.bookProps && (pe.Sheets = u), pe.SheetNames = f, pe.Workbook = V, pe.SSF = wt(U), pe.Props = A, pe.Custprops = j, pe;
}
function Vp(e, t) {
	switch (Hm(t ||= {}), t.type || "base64") {
		case "base64": return Bp(S(e), t);
		case "binary":
		case "buffer":
		case "file": return Bp(e, t);
		case "array": return Bp(k(e), t);
	}
}
function Hp(e) {
	var t = {}, n = e.content;
	if (n.l = 28, t.AnsiUserType = n.read_shift(0, "lpstr-ansi"), t.AnsiClipboardFormat = $r(n), n.length - n.l <= 4) return t;
	var r = n.read_shift(4);
	if (r == 0 || r > 40 || (n.l -= 4, t.Reserved1 = n.read_shift(0, "lpstr-ansi"), n.length - n.l <= 4) || (r = n.read_shift(4), r !== 1907505652) || (t.UnicodeClipboardFormat = ei(n), r = n.read_shift(4), r == 0 || r > 40)) return t;
	n.l -= 4, t.Reserved2 = n.read_shift(0, "lpwstr");
}
var Up = [
	60,
	1084,
	2066,
	2165,
	2175
];
function Wp(e, t, n, r, i) {
	var a = r, o = [], s = n.slice(n.l, n.l + a);
	if (i && i.enc && i.enc.insitu && s.length > 0) switch (e) {
		case 9:
		case 521:
		case 1033:
		case 2057:
		case 47:
		case 405:
		case 225:
		case 406:
		case 312:
		case 404:
		case 10: break;
		case 133: break;
		default: i.enc.insitu(s);
	}
	o.push(s), n.l += a;
	for (var c = Qn(n, n.l), l = Qp[c], u = 0; l != null && Up.indexOf(c) > -1;) a = Qn(n, n.l + 2), u = n.l + 4, c == 2066 ? u += 4 : (c == 2165 || c == 2175) && (u += 12), s = n.slice(u, n.l + 4 + a), o.push(s), n.l += 4 + a, l = Qp[c = Qn(n, n.l)];
	var d = M(o);
	lr(d, 0);
	var f = 0;
	d.lens = [];
	for (var p = 0; p < o.length; ++p) d.lens.push(f), f += o[p].length;
	if (d.length < r) throw "XLS Record 0x" + e.toString(16) + " Truncated: " + d.length + " < " + r;
	return t.f(d, d.length, i);
}
function Gp(e, t, n) {
	if (e.t !== "z" && e.XF) {
		var r = 0;
		try {
			r = e.z || e.XF.numFmtId || 0, t.cellNF && (e.z = U[r]);
		} catch (e) {
			if (t.WTF) throw e;
		}
		if (!t || t.cellText !== !1) try {
			e.t === "e" ? e.w = e.w || bi[e.v] : r === 0 || r == "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = ge(e.v) : e.w = _e(e.v) : e.w = Ye(r, e.v, {
				date1904: !!n,
				dateNF: t && t.dateNF
			});
		} catch (e) {
			if (t.WTF) throw e;
		}
		if (t.cellDates && r && e.t == "n" && We(U[r] || String(r))) {
			var i = se(e.v);
			i && (e.t = "d", e.v = new Date(i.y, i.m - 1, i.d, i.H, i.M, i.S, i.u));
		}
	}
}
function Kp(e, t, n) {
	return {
		v: e,
		ixfe: t,
		t: n
	};
}
function qp(e, t) {
	var n = { opts: {} }, r = {};
	v != null && t.dense == null && (t.dense = v);
	var i = t.dense ? [] : {}, a = {}, o = {}, s = null, c = [], u = "", d = {}, f, p = "", m, h, g, _, y = {}, b = [], x, S, C = [], w = [], T = {
		Sheets: [],
		WBProps: { date1904: !1 },
		Views: [{}]
	}, E = {}, D = function(e) {
		return e < 8 ? yi[e] : e < 64 && w[e - 8] || yi[e];
	}, O = function(e, t, n) {
		var r = t.XF.data;
		if (!(!r || !r.patternType || !n || !n.cellStyles)) {
			t.s = {}, t.s.patternType = r.patternType;
			var i;
			(i = Xs(D(r.icvFore))) && (t.s.fgColor = { rgb: i }), (i = Xs(D(r.icvBack))) && (t.s.bgColor = { rgb: i });
		}
	}, k = function(e, t, n) {
		if (!(ee > 1) && !(n.sheetRows && e.r >= n.sheetRows)) {
			if (n.cellStyles && t.XF && t.XF.data && O(e, t, n), delete t.ixfe, delete t.XF, f = e, p = X(e), (!o || !o.s || !o.e) && (o = {
				s: {
					r: 0,
					c: 0
				},
				e: {
					r: 0,
					c: 0
				}
			}), e.r < o.s.r && (o.s.r = e.r), e.c < o.s.c && (o.s.c = e.c), e.r + 1 > o.e.r && (o.e.r = e.r + 1), e.c + 1 > o.e.c && (o.e.c = e.c + 1), n.cellFormula && t.f) {
				for (var r = 0; r < b.length; ++r) if (!(b[r][0].s.c > e.c || b[r][0].s.r > e.r) && !(b[r][0].e.c < e.c || b[r][0].e.r < e.r)) {
					t.F = Z(b[r][0]), (b[r][0].s.c != e.c || b[r][0].s.r != e.r) && delete t.f, t.f &&= "" + sd(b[r][1], o, e, L, A);
					break;
				}
			}
			n.dense ? (i[e.r] || (i[e.r] = []), i[e.r][e.c] = t) : i[p] = t;
		}
	}, A = {
		enc: !1,
		sbcch: 0,
		snames: [],
		sharedf: y,
		arrayf: b,
		rrtabid: [],
		lastuser: "",
		biff: 8,
		codepage: 0,
		winlocked: 0,
		cellStyles: !!t && !!t.cellStyles,
		WTF: !!t && !!t.wtf
	};
	t.password && (A.password = t.password);
	var j, M = [], N = [], P = [], F = [], I = !1, L = [];
	L.SheetNames = A.snames, L.sharedf = A.sharedf, L.arrayf = A.arrayf, L.names = [], L.XTI = [];
	var R = 0, ee = 0, z = 0, B = [], te = [], ne;
	A.codepage = 1200, l(1200);
	for (var V = !1; e.l < e.length - 1;) {
		var re = e.l, H = e.read_shift(2);
		if (H === 0 && R === 10) break;
		var ie = e.l === e.length ? 0 : e.read_shift(2), ae = Qp[H];
		if (ae && ae.f) {
			if (t.bookSheets && R === 133 && H !== 133) break;
			if (R = H, ae.r === 2 || ae.r == 12) {
				var oe = e.read_shift(2);
				if (ie -= 2, !A.enc && oe !== H && ((oe & 255) << 8 | oe >> 8) !== H) throw Error("rt mismatch: " + oe + "!=" + H);
				ae.r == 12 && (e.l += 10, ie -= 10);
			}
			var W = {};
			if (W = H === 10 ? ae.f(e, ie, A) : Wp(H, ae, e, ie, A), ee == 0 && [
				9,
				521,
				1033,
				2057
			].indexOf(R) === -1) continue;
			switch (H) {
				case 34:
					n.opts.Date1904 = T.WBProps.date1904 = W;
					break;
				case 134:
					n.opts.WriteProtect = !0;
					break;
				case 47:
					if (A.enc || (e.l = 0), A.enc = W, !t.password) throw Error("File is password-protected");
					if (W.valid == null) throw Error("Encryption scheme unsupported");
					if (!W.valid) throw Error("Password is incorrect");
					break;
				case 92:
					A.lastuser = W;
					break;
				case 66:
					var se = Number(W);
					switch (se) {
						case 21010:
							se = 1200;
							break;
						case 32768:
							se = 1e4;
							break;
						case 32769:
							se = 1252;
							break;
					}
					l(A.codepage = se), V = !0;
					break;
				case 317:
					A.rrtabid = W;
					break;
				case 25:
					A.winlocked = W;
					break;
				case 439:
					n.opts.RefreshAll = W;
					break;
				case 12:
					n.opts.CalcCount = W;
					break;
				case 16:
					n.opts.CalcDelta = W;
					break;
				case 17:
					n.opts.CalcIter = W;
					break;
				case 13:
					n.opts.CalcMode = W;
					break;
				case 14:
					n.opts.CalcPrecision = W;
					break;
				case 95:
					n.opts.CalcSaveRecalc = W;
					break;
				case 15:
					A.CalcRefMode = W;
					break;
				case 2211:
					n.opts.FullCalc = W;
					break;
				case 129:
					W.fDialog && (i["!type"] = "dialog"), W.fBelow || ((i["!outline"] ||= {}).above = !0), W.fRight || ((i["!outline"] ||= {}).left = !0);
					break;
				case 224:
					C.push(W);
					break;
				case 430:
					L.push([W]), L[L.length - 1].XTI = [];
					break;
				case 35:
				case 547:
					L[L.length - 1].push(W);
					break;
				case 24:
				case 536:
					ne = {
						Name: W.Name,
						Ref: sd(W.rgce, o, null, L, A)
					}, W.itab > 0 && (ne.Sheet = W.itab - 1), L.names.push(ne), L[0] || (L[0] = [], L[0].XTI = []), L[L.length - 1].push(W), W.Name == "_xlnm._FilterDatabase" && W.itab > 0 && W.rgce && W.rgce[0] && W.rgce[0][0] && W.rgce[0][0][0] == "PtgArea3d" && (te[W.itab - 1] = { ref: Z(W.rgce[0][0][1][2]) });
					break;
				case 22:
					A.ExternCount = W;
					break;
				case 23:
					L.length == 0 && (L[0] = [], L[0].XTI = []), L[L.length - 1].XTI = L[L.length - 1].XTI.concat(W), L.XTI = L.XTI.concat(W);
					break;
				case 2196:
					if (A.biff < 8) break;
					ne != null && (ne.Comment = W[1]);
					break;
				case 18:
					i["!protect"] = W;
					break;
				case 19:
					W !== 0 && A.WTF && console.error("Password verifier: " + W);
					break;
				case 133:
					a[W.pos] = W, A.snames.push(W.name);
					break;
				case 10:
					if (--ee) break;
					if (o.e) {
						if (o.e.r > 0 && o.e.c > 0) {
							if (o.e.r--, o.e.c--, i["!ref"] = Z(o), t.sheetRows && t.sheetRows <= o.e.r) {
								var ce = o.e.r;
								o.e.r = t.sheetRows - 1, i["!fullref"] = i["!ref"], i["!ref"] = Z(o), o.e.r = ce;
							}
							o.e.r++, o.e.c++;
						}
						M.length > 0 && (i["!merges"] = M), N.length > 0 && (i["!objects"] = N), P.length > 0 && (i["!cols"] = P), F.length > 0 && (i["!rows"] = F), T.Sheets.push(E);
					}
					u === "" ? d = i : r[u] = i, i = t.dense ? [] : {};
					break;
				case 9:
				case 521:
				case 1033:
				case 2057:
					if (A.biff === 8 && (A.biff = {
						9: 2,
						521: 3,
						1033: 4
					}[H] || {
						512: 2,
						768: 3,
						1024: 4,
						1280: 5,
						1536: 8,
						2: 2,
						7: 2
					}[W.BIFFVer] || 8), A.biffguess = W.BIFFVer == 0, W.BIFFVer == 0 && W.dt == 4096 && (A.biff = 5, V = !0, l(A.codepage = 28591)), A.biff == 8 && W.BIFFVer == 0 && W.dt == 16 && (A.biff = 2), ee++) break;
					if (i = t.dense ? [] : {}, A.biff < 8 && !V && (V = !0, l(A.codepage = t.codepage || 1252)), A.biff < 5 || W.BIFFVer == 0 && W.dt == 4096) {
						u === "" && (u = "Sheet1"), o = {
							s: {
								r: 0,
								c: 0
							},
							e: {
								r: 0,
								c: 0
							}
						};
						var le = {
							pos: e.l - ie,
							name: u
						};
						a[le.pos] = le, A.snames.push(u);
					} else u = (a[re] || { name: "" }).name;
					W.dt == 32 && (i["!type"] = "chart"), W.dt == 64 && (i["!type"] = "macro"), M = [], N = [], A.arrayf = b = [], P = [], F = [], I = !1, E = {
						Hidden: (a[re] || { hs: 0 }).hs,
						name: u
					};
					break;
				case 515:
				case 3:
				case 2:
					i["!type"] == "chart" && (t.dense ? (i[W.r] || [])[W.c] : i[X({
						c: W.c,
						r: W.r
					})]) && ++W.c, x = {
						ixfe: W.ixfe,
						XF: C[W.ixfe] || {},
						v: W.val,
						t: "n"
					}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t);
					break;
				case 5:
				case 517:
					x = {
						ixfe: W.ixfe,
						XF: C[W.ixfe],
						v: W.val,
						t: W.t
					}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t);
					break;
				case 638:
					x = {
						ixfe: W.ixfe,
						XF: C[W.ixfe],
						v: W.rknum,
						t: "n"
					}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t);
					break;
				case 189:
					for (var ue = W.c; ue <= W.C; ++ue) {
						var de = W.rkrec[ue - W.c][0];
						x = {
							ixfe: de,
							XF: C[de],
							v: W.rkrec[ue - W.c][1],
							t: "n"
						}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
							c: ue,
							r: W.r
						}, x, t);
					}
					break;
				case 6:
				case 518:
				case 1030:
					if (W.val == "String") {
						s = W;
						break;
					}
					if (x = Kp(W.val, W.cell.ixfe, W.tt), x.XF = C[x.ixfe], t.cellFormula) {
						var fe = W.formula;
						if (fe && fe[0] && fe[0][0] && fe[0][0][0] == "PtgExp") {
							var pe = fe[0][0][1][0], me = fe[0][0][1][1], he = X({
								r: pe,
								c: me
							});
							y[he] ? x.f = "" + sd(W.formula, o, W.cell, L, A) : x.F = ((t.dense ? (i[pe] || [])[me] : i[he]) || {}).F;
						} else x.f = "" + sd(W.formula, o, W.cell, L, A);
					}
					z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k(W.cell, x, t), s = W;
					break;
				case 7:
				case 519:
					if (s) s.val = W, x = Kp(W, s.cell.ixfe, "s"), x.XF = C[x.ixfe], t.cellFormula && (x.f = "" + sd(s.formula, o, s.cell, L, A)), z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k(s.cell, x, t), s = null;
					else throw Error("String record expects Formula");
					break;
				case 33:
				case 545:
					b.push(W);
					var ge = X(W[0].s);
					if (m = t.dense ? (i[W[0].s.r] || [])[W[0].s.c] : i[ge], t.cellFormula && m) {
						if (!s || !ge || !m) break;
						m.f = "" + sd(W[1], o, W[0], L, A), m.F = Z(W[0]);
					}
					break;
				case 1212:
					if (!t.cellFormula) break;
					if (p) {
						if (!s) break;
						y[X(s.cell)] = W[0], m = t.dense ? (i[s.cell.r] || [])[s.cell.c] : i[X(s.cell)], (m || {}).f = "" + sd(W[0], o, f, L, A);
					}
					break;
				case 253:
					x = Kp(c[W.isst].t, W.ixfe, "s"), c[W.isst].h && (x.h = c[W.isst].h), x.XF = C[x.ixfe], z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t);
					break;
				case 513:
					t.sheetStubs && (x = {
						ixfe: W.ixfe,
						XF: C[W.ixfe],
						t: "z"
					}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t));
					break;
				case 190:
					if (t.sheetStubs) for (var _e = W.c; _e <= W.C; ++_e) {
						var ve = W.ixfe[_e - W.c];
						x = {
							ixfe: ve,
							XF: C[ve],
							t: "z"
						}, z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
							c: _e,
							r: W.r
						}, x, t);
					}
					break;
				case 214:
				case 516:
				case 4:
					x = Kp(W.val, W.ixfe, "s"), x.XF = C[x.ixfe], z > 0 && (x.z = B[x.ixfe >> 8 & 63]), Gp(x, t, n.opts.Date1904), k({
						c: W.c,
						r: W.r
					}, x, t);
					break;
				case 0:
				case 512:
					ee === 1 && (o = W);
					break;
				case 252:
					c = W;
					break;
				case 1054:
					if (A.biff == 4) {
						B[z++] = W[1];
						for (var ye = 0; ye < z + 163 && U[ye] != W[1]; ++ye);
						ye >= 163 && Xe(W[1], z + 163);
					} else Xe(W[1], W[0]);
					break;
				case 30:
					B[z++] = W;
					for (var be = 0; be < z + 163 && U[be] != W; ++be);
					be >= 163 && Xe(W, z + 163);
					break;
				case 229:
					M = M.concat(W);
					break;
				case 93:
					N[W.cmo[0]] = A.lastobj = W;
					break;
				case 438:
					A.lastobj.TxO = W;
					break;
				case 127:
					A.lastobj.ImData = W;
					break;
				case 440:
					for (_ = W[0].s.r; _ <= W[0].e.r; ++_) for (g = W[0].s.c; g <= W[0].e.c; ++g) m = t.dense ? (i[_] || [])[g] : i[X({
						c: g,
						r: _
					})], m && (m.l = W[1]);
					break;
				case 2048:
					for (_ = W[0].s.r; _ <= W[0].e.r; ++_) for (g = W[0].s.c; g <= W[0].e.c; ++g) m = t.dense ? (i[_] || [])[g] : i[X({
						c: g,
						r: _
					})], m && m.l && (m.l.Tooltip = W[1]);
					break;
				case 28:
					if (A.biff <= 5 && A.biff >= 2) break;
					m = t.dense ? (i[W[0].r] || [])[W[0].c] : i[X(W[0])];
					var xe = N[W[2]];
					m || (t.dense ? (i[W[0].r] || (i[W[0].r] = []), m = i[W[0].r][W[0].c] = { t: "z" }) : m = i[X(W[0])] = { t: "z" }, o.e.r = Math.max(o.e.r, W[0].r), o.s.r = Math.min(o.s.r, W[0].r), o.e.c = Math.max(o.e.c, W[0].c), o.s.c = Math.min(o.s.c, W[0].c)), m.c ||= [], h = {
						a: W[1],
						t: xe.TxO.t
					}, m.c.push(h);
					break;
				case 2173:
					Yc(C[W.ixfe], W.ext);
					break;
				case 125:
					if (!A.cellStyles) break;
					for (; W.e >= W.s;) P[W.e--] = {
						width: W.w / 256,
						level: W.level || 0,
						hidden: !!(W.flags & 1)
					}, I || (I = !0, cc(W.w / 256)), lc(P[W.e + 1]);
					break;
				case 520:
					var Se = {};
					W.level != null && (F[W.r] = Se, Se.level = W.level), W.hidden && (F[W.r] = Se, Se.hidden = !0), W.hpt && (F[W.r] = Se, Se.hpt = W.hpt, Se.hpx = fc(W.hpt));
					break;
				case 38:
				case 39:
				case 40:
				case 41:
					i["!margins"] || kd(i["!margins"] = {}), i["!margins"][{
						38: "left",
						39: "right",
						40: "top",
						41: "bottom"
					}[H]] = W;
					break;
				case 161:
					i["!margins"] || kd(i["!margins"] = {}), i["!margins"].header = W.header, i["!margins"].footer = W.footer;
					break;
				case 574:
					W.RTL && (T.Views[0].RTL = !0);
					break;
				case 146:
					w = W;
					break;
				case 2198:
					j = W;
					break;
				case 140:
					S = W;
					break;
				case 442:
					u ? E.CodeName = W || E.name : T.WBProps.CodeName = W || "ThisWorkbook";
					break;
			}
		} else ae || console.error("Missing Info for XLS Record 0x" + H.toString(16)), e.l += ie;
	}
	return n.SheetNames = ct(a).sort(function(e, t) {
		return Number(e) - Number(t);
	}).map(function(e) {
		return a[e].name;
	}), t.bookSheets || (n.Sheets = r), !n.SheetNames.length && d["!ref"] ? (n.SheetNames.push("Sheet1"), n.Sheets && (n.Sheets.Sheet1 = d)) : n.Preamble = d, n.Sheets && te.forEach(function(e, t) {
		n.Sheets[n.SheetNames[t]]["!autofilter"] = e;
	}), n.Strings = c, n.SSF = wt(U), A.enc && (n.Encryption = A.enc), j && (n.Themes = j), n.Metadata = {}, S !== void 0 && (n.Metadata.Country = S), L.names.length > 0 && (T.Names = L.names), n.Workbook = T, n;
}
var Jp = {
	SI: "e0859ff2f94f6810ab9108002b27b3d9",
	DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
	UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
};
function Yp(e, t, n) {
	var r = G.find(e, "/!DocumentSummaryInformation");
	if (r && r.size > 0) try {
		var i = la(r, mi, Jp.DSI);
		for (var a in i) t[a] = i[a];
	} catch (e) {
		if (n.WTF) throw e;
	}
	var o = G.find(e, "/!SummaryInformation");
	if (o && o.size > 0) try {
		var s = la(o, hi, Jp.SI);
		for (var c in s) t[c] ?? (t[c] = s[c]);
	} catch (e) {
		if (n.WTF) throw e;
	}
	t.HeadingPairs && t.TitlesOfParts && (zi(t.HeadingPairs, t.TitlesOfParts, t, n), delete t.HeadingPairs, delete t.TitlesOfParts);
}
function Xp(e, t) {
	t ||= {}, Hm(t), u(), t.codepage && s(t.codepage);
	var n, r;
	if (e.FullPaths) {
		if (G.find(e, "/encryption")) throw Error("File is password-protected");
		n = G.find(e, "!CompObj"), r = G.find(e, "/Workbook") || G.find(e, "/Book");
	} else {
		switch (t.type) {
			case "base64":
				e = D(S(e));
				break;
			case "binary":
				e = D(e);
				break;
			case "buffer": break;
			case "array":
				Array.isArray(e) || (e = Array.prototype.slice.call(e));
				break;
		}
		lr(e, 0), r = { content: e };
	}
	var i, a;
	if (n && Hp(n), t.bookProps && !t.bookSheets) i = {};
	else {
		var o = C ? "buffer" : "array";
		if (r && r.content) i = qp(r.content, t);
		else if ((a = G.find(e, "PerfectOffice_MAIN")) && a.content) i = ls.to_workbook(a.content, (t.type = o, t));
		else if ((a = G.find(e, "NativeContent_MAIN")) && a.content) i = ls.to_workbook(a.content, (t.type = o, t));
		else if ((a = G.find(e, "MN0")) && a.content) throw Error("Unsupported Works 4 for Mac file");
		else throw Error("Cannot find Workbook stream");
		t.bookVBA && e.FullPaths && G.find(e, "/_VBA_PROJECT_CUR/VBA/dir") && (i.vbaraw = bl(e));
	}
	var c = {};
	return e.FullPaths && Yp(e, c, t), i.Props = i.Custprops = c, t.bookFiles && (i.cfb = e), i;
}
var Zp = {
	0: { f: pf },
	1: { f: _f },
	2: { f: Df },
	3: { f: xf },
	4: { f: yf },
	5: { f: Tf },
	6: { f: Af },
	7: { f: Cf },
	8: { f: Ff },
	9: { f: Pf },
	10: { f: Mf },
	11: { f: Nf },
	12: { f: vf },
	13: { f: Of },
	14: { f: Sf },
	15: { f: bf },
	16: { f: Ef },
	17: { f: jf },
	18: { f: wf },
	19: { f: Rr },
	20: {},
	21: {},
	22: {},
	23: {},
	24: {},
	25: {},
	26: {},
	27: {},
	28: {},
	29: {},
	30: {},
	31: {},
	32: {},
	33: {},
	34: {},
	35: { T: 1 },
	36: { T: -1 },
	37: { T: 1 },
	38: { T: -1 },
	39: { f: hp },
	40: {},
	42: {},
	43: { f: Ec },
	44: { f: Tc },
	45: { f: Dc },
	46: { f: kc },
	47: { f: Oc },
	48: {},
	49: { f: Fr },
	50: {},
	51: { f: Zc },
	52: { T: 1 },
	53: { T: -1 },
	54: { T: 1 },
	55: { T: -1 },
	56: { T: 1 },
	57: { T: -1 },
	58: {},
	59: {},
	60: { f: Uo },
	62: { f: kf },
	63: { f: rl },
	64: { f: Wf },
	65: {},
	66: {},
	67: {},
	68: {},
	69: {},
	70: {},
	128: {},
	129: { T: 1 },
	130: { T: -1 },
	131: {
		T: 1,
		f: ur,
		p: 0
	},
	132: { T: -1 },
	133: { T: 1 },
	134: { T: -1 },
	135: { T: 1 },
	136: { T: -1 },
	137: {
		T: 1,
		f: Uf
	},
	138: { T: -1 },
	139: { T: 1 },
	140: { T: -1 },
	141: { T: 1 },
	142: { T: -1 },
	143: { T: 1 },
	144: { T: -1 },
	145: { T: 1 },
	146: { T: -1 },
	147: { f: gf },
	148: {
		f: mf,
		p: 16
	},
	151: { f: Rf },
	152: {},
	153: { f: pp },
	154: {},
	155: {},
	156: { f: fp },
	157: {},
	158: {},
	159: {
		T: 1,
		f: Cs
	},
	160: { T: -1 },
	161: {
		T: 1,
		f: Jr
	},
	162: { T: -1 },
	163: { T: 1 },
	164: { T: -1 },
	165: { T: 1 },
	166: { T: -1 },
	167: {},
	168: {},
	169: {},
	170: {},
	171: {},
	172: { T: 1 },
	173: { T: -1 },
	174: {},
	175: {},
	176: { f: If },
	177: { T: 1 },
	178: { T: -1 },
	179: { T: 1 },
	180: { T: -1 },
	181: { T: 1 },
	182: { T: -1 },
	183: { T: 1 },
	184: { T: -1 },
	185: { T: 1 },
	186: { T: -1 },
	187: { T: 1 },
	188: { T: -1 },
	189: { T: 1 },
	190: { T: -1 },
	191: { T: 1 },
	192: { T: -1 },
	193: { T: 1 },
	194: { T: -1 },
	195: { T: 1 },
	196: { T: -1 },
	197: { T: 1 },
	198: { T: -1 },
	199: { T: 1 },
	200: { T: -1 },
	201: { T: 1 },
	202: { T: -1 },
	203: { T: 1 },
	204: { T: -1 },
	205: { T: 1 },
	206: { T: -1 },
	207: { T: 1 },
	208: { T: -1 },
	209: { T: 1 },
	210: { T: -1 },
	211: { T: 1 },
	212: { T: -1 },
	213: { T: 1 },
	214: { T: -1 },
	215: { T: 1 },
	216: { T: -1 },
	217: { T: 1 },
	218: { T: -1 },
	219: { T: 1 },
	220: { T: -1 },
	221: { T: 1 },
	222: { T: -1 },
	223: { T: 1 },
	224: { T: -1 },
	225: { T: 1 },
	226: { T: -1 },
	227: { T: 1 },
	228: { T: -1 },
	229: { T: 1 },
	230: { T: -1 },
	231: { T: 1 },
	232: { T: -1 },
	233: { T: 1 },
	234: { T: -1 },
	235: { T: 1 },
	236: { T: -1 },
	237: { T: 1 },
	238: { T: -1 },
	239: { T: 1 },
	240: { T: -1 },
	241: { T: 1 },
	242: { T: -1 },
	243: { T: 1 },
	244: { T: -1 },
	245: { T: 1 },
	246: { T: -1 },
	247: { T: 1 },
	248: { T: -1 },
	249: { T: 1 },
	250: { T: -1 },
	251: { T: 1 },
	252: { T: -1 },
	253: { T: 1 },
	254: { T: -1 },
	255: { T: 1 },
	256: { T: -1 },
	257: { T: 1 },
	258: { T: -1 },
	259: { T: 1 },
	260: { T: -1 },
	261: { T: 1 },
	262: { T: -1 },
	263: { T: 1 },
	264: { T: -1 },
	265: { T: 1 },
	266: { T: -1 },
	267: { T: 1 },
	268: { T: -1 },
	269: { T: 1 },
	270: { T: -1 },
	271: { T: 1 },
	272: { T: -1 },
	273: { T: 1 },
	274: { T: -1 },
	275: { T: 1 },
	276: { T: -1 },
	277: {},
	278: { T: 1 },
	279: { T: -1 },
	280: { T: 1 },
	281: { T: -1 },
	282: { T: 1 },
	283: { T: 1 },
	284: { T: -1 },
	285: { T: 1 },
	286: { T: -1 },
	287: { T: 1 },
	288: { T: -1 },
	289: { T: 1 },
	290: { T: -1 },
	291: { T: 1 },
	292: { T: -1 },
	293: { T: 1 },
	294: { T: -1 },
	295: { T: 1 },
	296: { T: -1 },
	297: { T: 1 },
	298: { T: -1 },
	299: { T: 1 },
	300: { T: -1 },
	301: { T: 1 },
	302: { T: -1 },
	303: { T: 1 },
	304: { T: -1 },
	305: { T: 1 },
	306: { T: -1 },
	307: { T: 1 },
	308: { T: -1 },
	309: { T: 1 },
	310: { T: -1 },
	311: { T: 1 },
	312: { T: -1 },
	313: { T: -1 },
	314: { T: 1 },
	315: { T: -1 },
	316: { T: 1 },
	317: { T: -1 },
	318: { T: 1 },
	319: { T: -1 },
	320: { T: 1 },
	321: { T: -1 },
	322: { T: 1 },
	323: { T: -1 },
	324: { T: 1 },
	325: { T: -1 },
	326: { T: 1 },
	327: { T: -1 },
	328: { T: 1 },
	329: { T: -1 },
	330: { T: 1 },
	331: { T: -1 },
	332: { T: 1 },
	333: { T: -1 },
	334: { T: 1 },
	335: { f: Xc },
	336: { T: -1 },
	337: {
		f: Qc,
		T: 1
	},
	338: { T: -1 },
	339: { T: 1 },
	340: { T: -1 },
	341: { T: 1 },
	342: { T: -1 },
	343: { T: 1 },
	344: { T: -1 },
	345: { T: 1 },
	346: { T: -1 },
	347: { T: 1 },
	348: { T: -1 },
	349: { T: 1 },
	350: { T: -1 },
	351: {},
	352: {},
	353: { T: 1 },
	354: { T: -1 },
	355: { f: Gr },
	357: {},
	358: {},
	359: {},
	360: { T: 1 },
	361: {},
	362: { f: wo },
	363: {},
	364: {},
	366: {},
	367: {},
	368: {},
	369: {},
	370: {},
	371: {},
	372: { T: 1 },
	373: { T: -1 },
	374: { T: 1 },
	375: { T: -1 },
	376: { T: 1 },
	377: { T: -1 },
	378: { T: 1 },
	379: { T: -1 },
	380: { T: 1 },
	381: { T: -1 },
	382: { T: 1 },
	383: { T: -1 },
	384: { T: 1 },
	385: { T: -1 },
	386: { T: 1 },
	387: { T: -1 },
	388: { T: 1 },
	389: { T: -1 },
	390: { T: 1 },
	391: { T: -1 },
	392: { T: 1 },
	393: { T: -1 },
	394: { T: 1 },
	395: { T: -1 },
	396: {},
	397: {},
	398: {},
	399: {},
	400: {},
	401: { T: 1 },
	403: {},
	404: {},
	405: {},
	406: {},
	407: {},
	408: {},
	409: {},
	410: {},
	411: {},
	412: {},
	413: {},
	414: {},
	415: {},
	416: {},
	417: {},
	418: {},
	419: {},
	420: {},
	421: {},
	422: { T: 1 },
	423: { T: 1 },
	424: { T: -1 },
	425: { T: -1 },
	426: { f: zf },
	427: { f: Bf },
	428: {},
	429: { T: 1 },
	430: { T: -1 },
	431: { T: 1 },
	432: { T: -1 },
	433: { T: 1 },
	434: { T: -1 },
	435: { T: 1 },
	436: { T: -1 },
	437: { T: 1 },
	438: { T: -1 },
	439: { T: 1 },
	440: { T: -1 },
	441: { T: 1 },
	442: { T: -1 },
	443: { T: 1 },
	444: { T: -1 },
	445: { T: 1 },
	446: { T: -1 },
	447: { T: 1 },
	448: { T: -1 },
	449: { T: 1 },
	450: { T: -1 },
	451: { T: 1 },
	452: { T: -1 },
	453: { T: 1 },
	454: { T: -1 },
	455: { T: 1 },
	456: { T: -1 },
	457: { T: 1 },
	458: { T: -1 },
	459: { T: 1 },
	460: { T: -1 },
	461: { T: 1 },
	462: { T: -1 },
	463: { T: 1 },
	464: { T: -1 },
	465: { T: 1 },
	466: { T: -1 },
	467: { T: 1 },
	468: { T: -1 },
	469: { T: 1 },
	470: { T: -1 },
	471: {},
	472: {},
	473: { T: 1 },
	474: { T: -1 },
	475: {},
	476: { f: Hf },
	477: {},
	478: {},
	479: { T: 1 },
	480: { T: -1 },
	481: { T: 1 },
	482: { T: -1 },
	483: { T: 1 },
	484: { T: -1 },
	485: { f: hf },
	486: { T: 1 },
	487: { T: -1 },
	488: { T: 1 },
	489: { T: -1 },
	490: { T: 1 },
	491: { T: -1 },
	492: { T: 1 },
	493: { T: -1 },
	494: { f: Lf },
	495: { T: 1 },
	496: { T: -1 },
	497: { T: 1 },
	498: { T: -1 },
	499: {},
	500: { T: 1 },
	501: { T: -1 },
	502: { T: 1 },
	503: { T: -1 },
	504: {},
	505: { T: 1 },
	506: { T: -1 },
	507: {},
	508: { T: 1 },
	509: { T: -1 },
	510: { T: 1 },
	511: { T: -1 },
	512: {},
	513: {},
	514: { T: 1 },
	515: { T: -1 },
	516: { T: 1 },
	517: { T: -1 },
	518: { T: 1 },
	519: { T: -1 },
	520: { T: 1 },
	521: { T: -1 },
	522: {},
	523: {},
	524: {},
	525: {},
	526: {},
	527: {},
	528: { T: 1 },
	529: { T: -1 },
	530: { T: 1 },
	531: { T: -1 },
	532: { T: 1 },
	533: { T: -1 },
	534: {},
	535: {},
	536: {},
	537: {},
	538: { T: 1 },
	539: { T: -1 },
	540: { T: 1 },
	541: { T: -1 },
	542: { T: 1 },
	548: {},
	549: {},
	550: { f: Gr },
	551: {},
	552: {},
	553: {},
	554: { T: 1 },
	555: { T: -1 },
	556: { T: 1 },
	557: { T: -1 },
	558: { T: 1 },
	559: { T: -1 },
	560: { T: 1 },
	561: { T: -1 },
	562: {},
	564: {},
	565: { T: 1 },
	566: { T: -1 },
	569: { T: 1 },
	570: { T: -1 },
	572: {},
	573: { T: 1 },
	574: { T: -1 },
	577: {},
	578: {},
	579: {},
	580: {},
	581: {},
	582: {},
	583: {},
	584: {},
	585: {},
	586: {},
	587: {},
	588: { T: -1 },
	589: {},
	590: { T: 1 },
	591: { T: -1 },
	592: { T: 1 },
	593: { T: -1 },
	594: { T: 1 },
	595: { T: -1 },
	596: {},
	597: { T: 1 },
	598: { T: -1 },
	599: { T: 1 },
	600: { T: -1 },
	601: { T: 1 },
	602: { T: -1 },
	603: { T: 1 },
	604: { T: -1 },
	605: { T: 1 },
	606: { T: -1 },
	607: {},
	608: { T: 1 },
	609: { T: -1 },
	610: {},
	611: { T: 1 },
	612: { T: -1 },
	613: { T: 1 },
	614: { T: -1 },
	615: { T: 1 },
	616: { T: -1 },
	617: { T: 1 },
	618: { T: -1 },
	619: { T: 1 },
	620: { T: -1 },
	625: {},
	626: { T: 1 },
	627: { T: -1 },
	628: { T: 1 },
	629: { T: -1 },
	630: { T: 1 },
	631: { T: -1 },
	632: { f: _l },
	633: { T: 1 },
	634: { T: -1 },
	635: {
		T: 1,
		f: gl
	},
	636: { T: -1 },
	637: { f: zr },
	638: { T: 1 },
	639: {},
	640: { T: -1 },
	641: { T: 1 },
	642: { T: -1 },
	643: { T: 1 },
	644: {},
	645: { T: -1 },
	646: { T: 1 },
	648: { T: 1 },
	649: {},
	650: { T: -1 },
	651: { f: Xf },
	652: {},
	653: { T: 1 },
	654: { T: -1 },
	655: { T: 1 },
	656: { T: -1 },
	657: { T: 1 },
	658: { T: -1 },
	659: {},
	660: { T: 1 },
	661: {},
	662: { T: -1 },
	663: {},
	664: { T: 1 },
	665: {},
	666: { T: -1 },
	667: {},
	668: {},
	669: {},
	671: { T: 1 },
	672: { T: -1 },
	673: { T: 1 },
	674: { T: -1 },
	675: {},
	676: {},
	677: {},
	678: {},
	679: {},
	680: {},
	681: {},
	1024: {},
	1025: {},
	1026: { T: 1 },
	1027: { T: -1 },
	1028: { T: 1 },
	1029: { T: -1 },
	1030: {},
	1031: { T: 1 },
	1032: { T: -1 },
	1033: { T: 1 },
	1034: { T: -1 },
	1035: {},
	1036: {},
	1037: {},
	1038: { T: 1 },
	1039: { T: -1 },
	1040: {},
	1041: { T: 1 },
	1042: { T: -1 },
	1043: {},
	1044: {},
	1045: {},
	1046: { T: 1 },
	1047: { T: -1 },
	1048: { T: 1 },
	1049: { T: -1 },
	1050: {},
	1051: { T: 1 },
	1052: { T: 1 },
	1053: { f: Gf },
	1054: { T: 1 },
	1055: {},
	1056: { T: 1 },
	1057: { T: -1 },
	1058: { T: 1 },
	1059: { T: -1 },
	1061: {},
	1062: { T: 1 },
	1063: { T: -1 },
	1064: { T: 1 },
	1065: { T: -1 },
	1066: { T: 1 },
	1067: { T: -1 },
	1068: { T: 1 },
	1069: { T: -1 },
	1070: { T: 1 },
	1071: { T: -1 },
	1072: { T: 1 },
	1073: { T: -1 },
	1075: { T: 1 },
	1076: { T: -1 },
	1077: { T: 1 },
	1078: { T: -1 },
	1079: { T: 1 },
	1080: { T: -1 },
	1081: { T: 1 },
	1082: { T: -1 },
	1083: { T: 1 },
	1084: { T: -1 },
	1085: {},
	1086: { T: 1 },
	1087: { T: -1 },
	1088: { T: 1 },
	1089: { T: -1 },
	1090: { T: 1 },
	1091: { T: -1 },
	1092: { T: 1 },
	1093: { T: -1 },
	1094: { T: 1 },
	1095: { T: -1 },
	1096: {},
	1097: { T: 1 },
	1098: {},
	1099: { T: -1 },
	1100: { T: 1 },
	1101: { T: -1 },
	1102: {},
	1103: {},
	1104: {},
	1105: {},
	1111: {},
	1112: {},
	1113: { T: 1 },
	1114: { T: -1 },
	1115: { T: 1 },
	1116: { T: -1 },
	1117: {},
	1118: { T: 1 },
	1119: { T: -1 },
	1120: { T: 1 },
	1121: { T: -1 },
	1122: { T: 1 },
	1123: { T: -1 },
	1124: { T: 1 },
	1125: { T: -1 },
	1126: {},
	1128: { T: 1 },
	1129: { T: -1 },
	1130: {},
	1131: { T: 1 },
	1132: { T: -1 },
	1133: { T: 1 },
	1134: { T: -1 },
	1135: { T: 1 },
	1136: { T: -1 },
	1137: { T: 1 },
	1138: { T: -1 },
	1139: { T: 1 },
	1140: { T: -1 },
	1141: {},
	1142: { T: 1 },
	1143: { T: -1 },
	1144: { T: 1 },
	1145: { T: -1 },
	1146: {},
	1147: { T: 1 },
	1148: { T: -1 },
	1149: { T: 1 },
	1150: { T: -1 },
	1152: { T: 1 },
	1153: { T: -1 },
	1154: { T: -1 },
	1155: { T: -1 },
	1156: { T: -1 },
	1157: { T: 1 },
	1158: { T: -1 },
	1159: { T: 1 },
	1160: { T: -1 },
	1161: { T: 1 },
	1162: { T: -1 },
	1163: { T: 1 },
	1164: { T: -1 },
	1165: { T: 1 },
	1166: { T: -1 },
	1167: { T: 1 },
	1168: { T: -1 },
	1169: { T: 1 },
	1170: { T: -1 },
	1171: {},
	1172: { T: 1 },
	1173: { T: -1 },
	1177: {},
	1178: { T: 1 },
	1180: {},
	1181: {},
	1182: {},
	2048: { T: 1 },
	2049: { T: -1 },
	2050: {},
	2051: { T: 1 },
	2052: { T: -1 },
	2053: {},
	2054: {},
	2055: { T: 1 },
	2056: { T: -1 },
	2057: { T: 1 },
	2058: { T: -1 },
	2060: {},
	2067: {},
	2068: { T: 1 },
	2069: { T: -1 },
	2070: {},
	2071: {},
	2072: { T: 1 },
	2073: { T: -1 },
	2075: {},
	2076: {},
	2077: { T: 1 },
	2078: { T: -1 },
	2079: {},
	2080: { T: 1 },
	2081: { T: -1 },
	2082: {},
	2083: { T: 1 },
	2084: { T: -1 },
	2085: { T: 1 },
	2086: { T: -1 },
	2087: { T: 1 },
	2088: { T: -1 },
	2089: { T: 1 },
	2090: { T: -1 },
	2091: {},
	2092: {},
	2093: { T: 1 },
	2094: { T: -1 },
	2095: {},
	2096: { T: 1 },
	2097: { T: -1 },
	2098: { T: 1 },
	2099: { T: -1 },
	2100: { T: 1 },
	2101: { T: -1 },
	2102: {},
	2103: { T: 1 },
	2104: { T: -1 },
	2105: {},
	2106: { T: 1 },
	2107: { T: -1 },
	2108: {},
	2109: { T: 1 },
	2110: { T: -1 },
	2111: { T: 1 },
	2112: { T: -1 },
	2113: { T: 1 },
	2114: { T: -1 },
	2115: {},
	2116: {},
	2117: {},
	2118: { T: 1 },
	2119: { T: -1 },
	2120: {},
	2121: { T: 1 },
	2122: { T: -1 },
	2123: { T: 1 },
	2124: { T: -1 },
	2125: {},
	2126: { T: 1 },
	2127: { T: -1 },
	2128: {},
	2129: { T: 1 },
	2130: { T: -1 },
	2131: { T: 1 },
	2132: { T: -1 },
	2133: { T: 1 },
	2134: {},
	2135: {},
	2136: {},
	2137: { T: 1 },
	2138: { T: -1 },
	2139: { T: 1 },
	2140: { T: -1 },
	2141: {},
	3072: {},
	3073: {},
	4096: { T: 1 },
	4097: { T: -1 },
	5002: { T: 1 },
	5003: { T: -1 },
	5081: { T: 1 },
	5082: { T: -1 },
	5083: {},
	5084: { T: 1 },
	5085: { T: -1 },
	5086: { T: 1 },
	5087: { T: -1 },
	5088: {},
	5089: {},
	5090: {},
	5092: { T: 1 },
	5093: { T: -1 },
	5094: {},
	5095: { T: 1 },
	5096: { T: -1 },
	5097: {},
	5099: {},
	65535: { n: "" }
}, Qp = {
	6: { f: pd },
	10: { f: ua },
	12: { f: pa },
	13: { f: pa },
	14: { f: fa },
	15: { f: fa },
	16: { f: Yr },
	17: { f: fa },
	18: { f: fa },
	19: { f: pa },
	20: { f: yo },
	21: { f: yo },
	23: { f: wo },
	24: { f: Co },
	25: { f: fa },
	26: {},
	27: {},
	28: { f: jo },
	29: {},
	34: { f: fa },
	35: { f: xo },
	38: { f: Yr },
	39: { f: Yr },
	40: { f: Yr },
	41: { f: Yr },
	42: { f: fa },
	43: { f: fa },
	47: { f: qs },
	49: { f: io },
	51: { f: pa },
	60: {},
	61: { f: to },
	64: { f: fa },
	65: { f: ro },
	66: { f: pa },
	77: {},
	80: {},
	81: {},
	82: {},
	85: { f: pa },
	89: {},
	90: {},
	91: {},
	92: { f: Ka },
	93: { f: No },
	94: {},
	95: { f: fa },
	96: {},
	97: {},
	99: { f: fa },
	125: { f: Uo },
	128: { f: go },
	129: { f: qa },
	130: { f: pa },
	131: { f: fa },
	132: { f: fa },
	133: { f: Ja },
	134: {},
	140: { f: zo },
	141: { f: pa },
	144: {},
	146: { f: Vo },
	151: {},
	152: {},
	153: {},
	154: {},
	155: {},
	156: { f: pa },
	157: {},
	158: {},
	160: { f: qo },
	161: { f: Wo },
	174: {},
	175: {},
	176: {},
	177: {},
	178: {},
	180: {},
	181: {},
	182: {},
	184: {},
	185: {},
	189: { f: fo },
	190: { f: po },
	193: { f: ua },
	197: {},
	198: {},
	199: {},
	200: {},
	201: {},
	202: { f: fa },
	203: {},
	204: {},
	205: {},
	206: {},
	207: {},
	208: {},
	209: {},
	210: {},
	211: {},
	213: {},
	215: {},
	216: {},
	217: {},
	218: { f: pa },
	220: {},
	221: { f: fa },
	222: {},
	224: { f: ho },
	225: { f: Ga },
	226: { f: ua },
	227: {},
	229: { f: Mo },
	233: {},
	235: {},
	236: {},
	237: {},
	239: {},
	240: {},
	241: {},
	242: {},
	244: {},
	245: {},
	246: {},
	247: {},
	248: {},
	249: {},
	251: {},
	252: { f: Ya },
	253: { f: ao },
	255: { f: Xa },
	256: {},
	259: {},
	290: {},
	311: {},
	312: {},
	315: {},
	317: { f: ma },
	318: {},
	319: {},
	320: {},
	330: {},
	331: {},
	333: {},
	334: {},
	335: {},
	336: {},
	337: {},
	338: {},
	339: {},
	340: {},
	351: {},
	352: { f: fa },
	353: { f: ua },
	401: {},
	402: {},
	403: {},
	404: {},
	405: {},
	406: {},
	407: {},
	408: {},
	425: {},
	426: {},
	427: {},
	428: {},
	429: {},
	430: { f: bo },
	431: { f: fa },
	432: {},
	433: {},
	434: {},
	437: {},
	438: { f: Io },
	439: { f: fa },
	440: { f: Lo },
	441: {},
	442: { f: ya },
	443: {},
	444: { f: pa },
	445: {},
	446: {},
	448: { f: ua },
	449: {
		f: $a,
		r: 2
	},
	450: { f: ua },
	512: { f: lo },
	513: { f: Ko },
	515: { f: vo },
	516: { f: oo },
	517: { f: _o },
	519: { f: Jo },
	520: { f: Za },
	523: {},
	545: { f: Oo },
	549: { f: eo },
	566: {},
	574: { f: no },
	638: { f: uo },
	659: {},
	1048: {},
	1054: { f: so },
	1084: {},
	1212: { f: Do },
	2048: { f: Ro },
	2049: {},
	2050: {},
	2051: {},
	2052: {},
	2053: {},
	2054: {},
	2055: {},
	2056: {},
	2057: { f: Wa },
	2058: {},
	2059: {},
	2060: {},
	2061: {},
	2062: {},
	2063: {},
	2064: {},
	2066: {},
	2067: {},
	2128: {},
	2129: {},
	2130: {},
	2131: {},
	2132: {},
	2133: {},
	2134: {},
	2135: {},
	2136: {},
	2137: {},
	2138: {},
	2146: {},
	2147: { r: 12 },
	2148: {},
	2149: {},
	2150: {},
	2151: { f: ua },
	2152: {},
	2154: {},
	2155: {},
	2156: {},
	2161: {},
	2162: {},
	2164: {},
	2165: {},
	2166: {},
	2167: {},
	2168: {},
	2169: {},
	2170: {},
	2171: {},
	2172: {
		f: Ho,
		r: 12
	},
	2173: {
		f: Jc,
		r: 12
	},
	2174: {},
	2175: {},
	2180: {},
	2181: {},
	2182: {},
	2183: {},
	2184: {},
	2185: {},
	2186: {},
	2187: {},
	2188: {
		f: fa,
		r: 12
	},
	2189: {},
	2190: { r: 12 },
	2191: {},
	2192: {},
	2194: {},
	2195: {},
	2196: {
		f: Eo,
		r: 12
	},
	2197: {},
	2198: {
		f: Hc,
		r: 12
	},
	2199: {},
	2200: {},
	2201: {},
	2202: {
		f: ko,
		r: 12
	},
	2203: { f: ua },
	2204: {},
	2205: {},
	2206: {},
	2207: {},
	2211: { f: Qa },
	2212: {},
	2213: {},
	2214: {},
	2215: {},
	4097: {},
	4098: {},
	4099: {},
	4102: {},
	4103: {},
	4105: {},
	4106: {},
	4107: {},
	4108: {},
	4109: {},
	4116: {},
	4117: {},
	4118: {},
	4119: {},
	4120: {},
	4121: {},
	4122: {},
	4123: {},
	4124: {},
	4125: {},
	4126: {},
	4127: {},
	4128: {},
	4129: {},
	4130: {},
	4132: {},
	4133: {},
	4134: { f: pa },
	4135: {},
	4146: {},
	4147: {},
	4148: {},
	4149: {},
	4154: {},
	4156: {},
	4157: {},
	4158: {},
	4159: {},
	4160: {},
	4161: {},
	4163: {},
	4164: { f: Go },
	4165: {},
	4166: {},
	4168: {},
	4170: {},
	4171: {},
	4174: {},
	4175: {},
	4176: {},
	4177: {},
	4187: {},
	4188: { f: Bo },
	4189: {},
	4191: {},
	4192: {},
	4193: {},
	4194: {},
	4195: {},
	4196: {},
	4197: {},
	4198: {},
	4199: {},
	4200: {},
	0: { f: lo },
	1: {},
	2: { f: Qo },
	3: { f: Zo },
	4: { f: Xo },
	5: { f: _o },
	7: { f: $o },
	8: {},
	9: { f: Wa },
	11: {},
	22: { f: pa },
	30: { f: co },
	31: {},
	32: {},
	33: { f: Oo },
	36: {},
	37: { f: eo },
	50: { f: es },
	62: {},
	52: {},
	67: {},
	68: { f: pa },
	69: {},
	86: {},
	126: {},
	127: { f: Yo },
	135: {},
	136: {},
	137: {},
	145: {},
	148: {},
	149: {},
	150: {},
	169: {},
	171: {},
	188: {},
	191: {},
	192: {},
	194: {},
	195: {},
	214: { f: ts },
	223: {},
	234: {},
	354: {},
	421: {},
	518: { f: pd },
	521: { f: Wa },
	536: { f: Co },
	547: { f: xo },
	561: {},
	579: {},
	1030: { f: pd },
	1033: { f: Wa },
	1091: {},
	2157: {},
	2163: {},
	2177: {},
	2240: {},
	2241: {},
	2242: {},
	2243: {},
	2244: {},
	2245: {},
	2246: {},
	2247: {},
	2248: {},
	2249: {},
	2250: {},
	2251: {},
	2262: { r: 12 },
	29282: {}
};
function $p(e, t, n, r) {
	var i = t;
	if (!isNaN(i)) {
		var a = r || (n || []).length || 0, o = e.next(4);
		o.write_shift(2, i), o.write_shift(2, a), a > 0 && Yn(n) && e.push(n);
	}
}
function em(e, t) {
	var n = t || {};
	v != null && n.dense == null && (n.dense = v);
	var r = n.dense ? [] : {};
	e = e.replace(/<!--.*?-->/g, "");
	var i = e.match(/<table/i);
	if (!i) throw Error("Invalid HTML: could not find <table>");
	var a = e.match(/<\/table/i), o = i.index, s = a && a.index || e.length, c = kt(e.slice(o, s), /(:?<tr[^>]*>)/i, "<tr>"), l = -1, u = 0, d = 0, f = 0, p = {
		s: {
			r: 1e7,
			c: 1e7
		},
		e: {
			r: 0,
			c: 0
		}
	}, m = [];
	for (o = 0; o < c.length; ++o) {
		var h = c[o].trim(), g = h.slice(0, 3).toLowerCase();
		if (g == "<tr") {
			if (++l, n.sheetRows && n.sheetRows <= l) {
				--l;
				break;
			}
			u = 0;
			continue;
		}
		if (!(g != "<td" && g != "<th")) {
			var _ = h.split(/<\/t[dh]>/i);
			for (s = 0; s < _.length; ++s) {
				var y = _[s].trim();
				if (y.match(/<t[dh]/i)) {
					for (var b = y, x = 0; b.charAt(0) == "<" && (x = b.indexOf(">")) > -1;) b = b.slice(x + 1);
					for (var S = 0; S < m.length; ++S) {
						var C = m[S];
						C.s.c == u && C.s.r < l && l <= C.e.r && (u = C.e.c + 1, S = -1);
					}
					var w = K(y.slice(0, y.indexOf(">")));
					f = w.colspan ? +w.colspan : 1, ((d = +w.rowspan) > 1 || f > 1) && m.push({
						s: {
							r: l,
							c: u
						},
						e: {
							r: l + (d || 1) - 1,
							c: u + f - 1
						}
					});
					var T = w.t || w["data-t"] || "";
					if (!b.length) {
						u += f;
						continue;
					}
					if (b = fn(b), p.s.r > l && (p.s.r = l), p.e.r < l && (p.e.r = l), p.s.c > u && (p.s.c = u), p.e.c < u && (p.e.c = u), !b.length) {
						u += f;
						continue;
					}
					var E = {
						t: "s",
						v: b
					};
					n.raw || !b.trim().length || T == "s" || (b === "TRUE" ? E = {
						t: "b",
						v: !0
					} : b === "FALSE" ? E = {
						t: "b",
						v: !1
					} : isNaN(Et(b)) ? isNaN(Ot(b).getDate()) || (E = {
						t: "d",
						v: St(b)
					}, n.cellDates || (E = {
						t: "n",
						v: pt(E.v)
					}), E.z = n.dateNF || U[14]) : E = {
						t: "n",
						v: Et(b)
					}), n.dense ? (r[l] || (r[l] = []), r[l][u] = E) : r[X({
						r: l,
						c: u
					})] = E, u += f;
				}
			}
		}
	}
	return r["!ref"] = Z(p), m.length && (r["!merges"] = m), r;
}
function tm(e, t, n, r) {
	for (var i = e["!merges"] || [], a = [], o = t.s.c; o <= t.e.c; ++o) {
		for (var s = 0, c = 0, l = 0; l < i.length; ++l) if (!(i[l].s.r > n || i[l].s.c > o) && !(i[l].e.r < n || i[l].e.c < o)) {
			if (i[l].s.r < n || i[l].s.c < o) {
				s = -1;
				break;
			}
			s = i[l].e.r - i[l].s.r + 1, c = i[l].e.c - i[l].s.c + 1;
			break;
		}
		if (!(s < 0)) {
			var u = X({
				r: n,
				c: o
			}), d = r.dense ? (e[n] || [])[o] : e[u], f = d && d.v != null && (d.h || nn(d.w || (jr(d), d.w) || "")) || "", p = {};
			s > 1 && (p.rowspan = s), c > 1 && (p.colspan = c), r.editable ? f = "<span contenteditable=\"true\">" + f + "</span>" : d && (p["data-t"] = d && d.t || "z", d.v != null && (p["data-v"] = d.v), d.z != null && (p["data-z"] = d.z), d.l && (d.l.Target || "#").charAt(0) != "#" && (f = "<a href=\"" + d.l.Target + "\">" + f + "</a>")), p.id = (r.id || "sjs") + "-" + u, a.push(Y("td", f, p));
		}
	}
	return "<tr>" + a.join("") + "</tr>";
}
var nm = "<html><head><meta charset=\"utf-8\"/><title>SheetJS Table Export</title></head><body>", rm = "</body></html>";
function im(e, t) {
	var n = e.match(/<table[\s\S]*?>[\s\S]*?<\/table>/gi);
	if (!n || n.length == 0) throw Error("Invalid HTML: could not find <table>");
	if (n.length == 1) return Mr(em(n[0], t), t);
	var r = Ch();
	return n.forEach(function(e, n) {
		wh(r, em(e, t), "Sheet" + (n + 1));
	}), r;
}
function am(e, t, n) {
	return [].join("") + "<table" + (n && n.id ? " id=\"" + n.id + "\"" : "") + ">";
}
function om(e, t) {
	var n = t || {}, r = n.header == null ? nm : n.header, i = n.footer == null ? rm : n.footer, a = [r], o = Or(e["!ref"]);
	n.dense = Array.isArray(e), a.push(am(e, o, n));
	for (var s = o.s.r; s <= o.e.r; ++s) a.push(tm(e, o, s, n));
	return a.push("</table>" + i), a.join("");
}
function sm(e, t, n) {
	var r = n || {};
	v != null && (r.dense = v);
	var i = 0, a = 0;
	if (r.origin != null) if (typeof r.origin == "number") i = r.origin;
	else {
		var o = typeof r.origin == "string" ? Dr(r.origin) : r.origin;
		i = o.r, a = o.c;
	}
	var s = t.getElementsByTagName("tr"), c = Math.min(r.sheetRows || 1e7, s.length), l = {
		s: {
			r: 0,
			c: 0
		},
		e: {
			r: i,
			c: a
		}
	};
	if (e["!ref"]) {
		var u = Or(e["!ref"]);
		l.s.r = Math.min(l.s.r, u.s.r), l.s.c = Math.min(l.s.c, u.s.c), l.e.r = Math.max(l.e.r, u.e.r), l.e.c = Math.max(l.e.c, u.e.c), i == -1 && (l.e.r = i = u.e.r + 1);
	}
	var d = [], f = 0, p = e["!rows"] ||= [], m = 0, h = 0, g = 0, _ = 0, y = 0, b = 0;
	for (e["!cols"] ||= []; m < s.length && h < c; ++m) {
		var x = s[m];
		if (um(x)) {
			if (r.display) continue;
			p[h] = { hidden: !0 };
		}
		var S = x.children;
		for (g = _ = 0; g < S.length; ++g) {
			var C = S[g];
			if (!(r.display && um(C))) {
				var w = C.hasAttribute("data-v") ? C.getAttribute("data-v") : C.hasAttribute("v") ? C.getAttribute("v") : fn(C.innerHTML), T = C.getAttribute("data-z") || C.getAttribute("z");
				for (f = 0; f < d.length; ++f) {
					var E = d[f];
					E.s.c == _ + a && E.s.r < h + i && h + i <= E.e.r && (_ = E.e.c + 1 - a, f = -1);
				}
				b = +C.getAttribute("colspan") || 1, ((y = +C.getAttribute("rowspan") || 1) > 1 || b > 1) && d.push({
					s: {
						r: h + i,
						c: _ + a
					},
					e: {
						r: h + i + (y || 1) - 1,
						c: _ + a + (b || 1) - 1
					}
				});
				var D = {
					t: "s",
					v: w
				}, O = C.getAttribute("data-t") || C.getAttribute("t") || "";
				w != null && (w.length == 0 ? D.t = O || "z" : r.raw || w.trim().length == 0 || O == "s" || (w === "TRUE" ? D = {
					t: "b",
					v: !0
				} : w === "FALSE" ? D = {
					t: "b",
					v: !1
				} : isNaN(Et(w)) ? isNaN(Ot(w).getDate()) || (D = {
					t: "d",
					v: St(w)
				}, r.cellDates || (D = {
					t: "n",
					v: pt(D.v)
				}), D.z = r.dateNF || U[14]) : D = {
					t: "n",
					v: Et(w)
				})), D.z === void 0 && T != null && (D.z = T);
				var k = "", A = C.getElementsByTagName("A");
				if (A && A.length) for (var j = 0; j < A.length && !(A[j].hasAttribute("href") && (k = A[j].getAttribute("href"), k.charAt(0) != "#")); ++j);
				k && k.charAt(0) != "#" && (D.l = { Target: k }), r.dense ? (e[h + i] || (e[h + i] = []), e[h + i][_ + a] = D) : e[X({
					c: _ + a,
					r: h + i
				})] = D, l.e.c < _ + a && (l.e.c = _ + a), _ += b;
			}
		}
		++h;
	}
	return d.length && (e["!merges"] = (e["!merges"] || []).concat(d)), l.e.r = Math.max(l.e.r, h - 1 + i), e["!ref"] = Z(l), h >= c && (e["!fullref"] = Z((l.e.r = s.length - m + h - 1 + i, l))), e;
}
function cm(e, t) {
	return sm((t || {}).dense ? [] : {}, e, t);
}
function lm(e, t) {
	return Mr(cm(e, t), t);
}
function um(e) {
	var t = "", n = dm(e);
	return n && (t = n(e).getPropertyValue("display")), t ||= e.style && e.style.display, t === "none";
}
function dm(e) {
	return e.ownerDocument.defaultView && typeof e.ownerDocument.defaultView.getComputedStyle == "function" ? e.ownerDocument.defaultView.getComputedStyle : typeof getComputedStyle == "function" ? getComputedStyle : null;
}
function fm(e) {
	return [q(e.replace(/[\t\r\n]/g, " ").trim().replace(/ +/g, " ").replace(/<text:s\/>/g, " ").replace(/<text:s text:c="(\d+)"\/>/g, function(e, t) {
		return Array(parseInt(t, 10) + 1).join(" ");
	}).replace(/<text:tab[^>]*\/>/g, "	").replace(/<text:line-break\/>/g, "\n").replace(/<[^>]*>/g, ""))];
}
var pm = {
	day: ["d", "dd"],
	month: ["m", "mm"],
	year: ["y", "yy"],
	hours: ["h", "hh"],
	minutes: ["m", "mm"],
	seconds: ["s", "ss"],
	"am-pm": ["A/P", "AM/PM"],
	"day-of-week": ["ddd", "dddd"],
	era: ["e", "ee"],
	quarter: ["\\Qm", "m\\\"th quarter\""]
};
function mm(e, t) {
	var n = t || {};
	v != null && n.dense == null && (n.dense = v);
	var r = Sn(e), i = [], a, o, s = { name: "" }, c = "", l = 0, u, d, f = {}, p = [], m = n.dense ? [] : {}, h, g, _ = { value: "" }, y = "", b = 0, x, S = [], C = -1, w = -1, T = {
		s: {
			r: 1e6,
			c: 1e7
		},
		e: {
			r: 0,
			c: 0
		}
	}, E = 0, D = {}, O = [], k = {}, A = 0, j = 0, M = [], N = 1, P = 1, F = [], I = { Names: [] }, L = {}, R = ["", ""], ee = [], z = {}, B = "", te = 0, ne = !1, V = !1, re = 0;
	for (Cn.lastIndex = 0, r = r.replace(/<!--([\s\S]*?)-->/gm, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, ""); h = Cn.exec(r);) switch (h[3] = h[3].replace(/_.*$/, "")) {
		case "table":
		case "工作表":
			h[1] === "/" ? (T.e.c >= T.s.c && T.e.r >= T.s.r ? m["!ref"] = Z(T) : m["!ref"] = "A1:A1", n.sheetRows > 0 && n.sheetRows <= T.e.r && (m["!fullref"] = m["!ref"], T.e.r = n.sheetRows - 1, m["!ref"] = Z(T)), O.length && (m["!merges"] = O), M.length && (m["!rows"] = M), u.name = u.名称 || u.name, typeof JSON < "u" && JSON.stringify(u), p.push(u.name), f[u.name] = m, V = !1) : h[0].charAt(h[0].length - 2) !== "/" && (u = K(h[0], !1), C = w = -1, T.s.r = T.s.c = 1e7, T.e.r = T.e.c = 0, m = n.dense ? [] : {}, O = [], M = [], V = !0);
			break;
		case "table-row-group":
			h[1] === "/" ? --E : ++E;
			break;
		case "table-row":
		case "行":
			if (h[1] === "/") {
				C += N, N = 1;
				break;
			}
			if (d = K(h[0], !1), d.行号 ? C = d.行号 - 1 : C == -1 && (C = 0), N = +d["number-rows-repeated"] || 1, N < 10) for (re = 0; re < N; ++re) E > 0 && (M[C + re] = { level: E });
			w = -1;
			break;
		case "covered-table-cell":
			h[1] !== "/" && ++w, n.sheetStubs && (n.dense ? (m[C] || (m[C] = []), m[C][w] = { t: "z" }) : m[X({
				r: C,
				c: w
			})] = { t: "z" }), y = "", S = [];
			break;
		case "table-cell":
		case "数据":
			if (h[0].charAt(h[0].length - 2) === "/") ++w, _ = K(h[0], !1), P = parseInt(_["number-columns-repeated"] || "1", 10), g = {
				t: "z",
				v: null
			}, _.formula && n.cellFormula != 0 && (g.f = Sd(q(_.formula))), (_.数据类型 || _["value-type"]) == "string" && (g.t = "s", g.v = q(_["string-value"] || ""), n.dense ? (m[C] || (m[C] = []), m[C][w] = g) : m[X({
				r: C,
				c: w
			})] = g), w += P - 1;
			else if (h[1] !== "/") {
				++w, y = "", b = 0, S = [], P = 1;
				var H = N ? C + N - 1 : C;
				if (w > T.e.c && (T.e.c = w), w < T.s.c && (T.s.c = w), C < T.s.r && (T.s.r = C), H > T.e.r && (T.e.r = H), _ = K(h[0], !1), ee = [], z = {}, g = {
					t: _.数据类型 || _["value-type"],
					v: null
				}, n.cellFormula) if (_.formula &&= q(_.formula), _["number-matrix-columns-spanned"] && _["number-matrix-rows-spanned"] && (A = parseInt(_["number-matrix-rows-spanned"], 10) || 0, j = parseInt(_["number-matrix-columns-spanned"], 10) || 0, k = {
					s: {
						r: C,
						c: w
					},
					e: {
						r: C + A - 1,
						c: w + j - 1
					}
				}, g.F = Z(k), F.push([k, g.F])), _.formula) g.f = Sd(_.formula);
				else for (re = 0; re < F.length; ++re) C >= F[re][0].s.r && C <= F[re][0].e.r && w >= F[re][0].s.c && w <= F[re][0].e.c && (g.F = F[re][1]);
				switch ((_["number-columns-spanned"] || _["number-rows-spanned"]) && (A = parseInt(_["number-rows-spanned"], 10) || 0, j = parseInt(_["number-columns-spanned"], 10) || 0, k = {
					s: {
						r: C,
						c: w
					},
					e: {
						r: C + A - 1,
						c: w + j - 1
					}
				}, O.push(k)), _["number-columns-repeated"] && (P = parseInt(_["number-columns-repeated"], 10)), g.t) {
					case "boolean":
						g.t = "b", g.v = an(_["boolean-value"]);
						break;
					case "float":
						g.t = "n", g.v = parseFloat(_.value);
						break;
					case "percentage":
						g.t = "n", g.v = parseFloat(_.value);
						break;
					case "currency":
						g.t = "n", g.v = parseFloat(_.value);
						break;
					case "date":
						g.t = "d", g.v = St(_["date-value"]), n.cellDates || (g.t = "n", g.v = pt(g.v)), g.z = "m/d/yy";
						break;
					case "time":
						g.t = "n", g.v = vt(_["time-value"]) / 86400, n.cellDates && (g.t = "d", g.v = _t(g.v)), g.z = "HH:MM:SS";
						break;
					case "number":
						g.t = "n", g.v = parseFloat(_.数据数值);
						break;
					default: if (g.t === "string" || g.t === "text" || !g.t) g.t = "s", _["string-value"] != null && (y = q(_["string-value"]), S = []);
					else throw Error("Unsupported value type " + g.t);
				}
			} else {
				if (ne = !1, g.t === "s" && (g.v = y || "", S.length && (g.R = S), ne = b == 0), L.Target && (g.l = L), ee.length > 0 && (g.c = ee, ee = []), y && n.cellText !== !1 && (g.w = y), ne && (g.t = "z", delete g.v), (!ne || n.sheetStubs) && !(n.sheetRows && n.sheetRows <= C)) for (var ie = 0; ie < N; ++ie) {
					if (P = parseInt(_["number-columns-repeated"] || "1", 10), n.dense) for (m[C + ie] || (m[C + ie] = []), m[C + ie][w] = ie == 0 ? g : wt(g); --P > 0;) m[C + ie][w + P] = wt(g);
					else for (m[X({
						r: C + ie,
						c: w
					})] = g; --P > 0;) m[X({
						r: C + ie,
						c: w + P
					})] = wt(g);
					T.e.c <= w && (T.e.c = w);
				}
				P = parseInt(_["number-columns-repeated"] || "1", 10), w += P - 1, P = 0, g = {}, y = "", S = [];
			}
			L = {};
			break;
		case "document":
		case "document-content":
		case "电子表格文档":
		case "spreadsheet":
		case "主体":
		case "scripts":
		case "styles":
		case "font-face-decls":
		case "master-styles":
			if (h[1] === "/") {
				if ((a = i.pop())[0] !== h[3]) throw "Bad state: " + a;
			} else h[0].charAt(h[0].length - 2) !== "/" && i.push([h[3], !0]);
			break;
		case "annotation":
			if (h[1] === "/") {
				if ((a = i.pop())[0] !== h[3]) throw "Bad state: " + a;
				z.t = y, S.length && (z.R = S), z.a = B, ee.push(z);
			} else h[0].charAt(h[0].length - 2) !== "/" && i.push([h[3], !1]);
			B = "", te = 0, y = "", b = 0, S = [];
			break;
		case "creator":
			h[1] === "/" ? B = r.slice(te, h.index) : te = h.index + h[0].length;
			break;
		case "meta":
		case "元数据":
		case "settings":
		case "config-item-set":
		case "config-item-map-indexed":
		case "config-item-map-entry":
		case "config-item-map-named":
		case "shapes":
		case "frame":
		case "text-box":
		case "image":
		case "data-pilot-tables":
		case "list-style":
		case "form":
		case "dde-links":
		case "event-listeners":
		case "chart":
			if (h[1] === "/") {
				if ((a = i.pop())[0] !== h[3]) throw "Bad state: " + a;
			} else h[0].charAt(h[0].length - 2) !== "/" && i.push([h[3], !1]);
			y = "", b = 0, S = [];
			break;
		case "scientific-number": break;
		case "currency-symbol": break;
		case "currency-style": break;
		case "number-style":
		case "percentage-style":
		case "date-style":
		case "time-style":
			if (h[1] === "/") {
				if (D[s.name] = c, (a = i.pop())[0] !== h[3]) throw "Bad state: " + a;
			} else h[0].charAt(h[0].length - 2) !== "/" && (c = "", s = K(h[0], !1), i.push([h[3], !0]));
			break;
		case "script": break;
		case "libraries": break;
		case "automatic-styles": break;
		case "default-style":
		case "page-layout": break;
		case "style": break;
		case "map": break;
		case "font-face": break;
		case "paragraph-properties": break;
		case "table-properties": break;
		case "table-column-properties": break;
		case "table-row-properties": break;
		case "table-cell-properties": break;
		case "number":
			switch (i[i.length - 1][0]) {
				case "time-style":
				case "date-style":
					o = K(h[0], !1), c += pm[h[3]][+(o.style === "long")];
					break;
			}
			break;
		case "fraction": break;
		case "day":
		case "month":
		case "year":
		case "era":
		case "day-of-week":
		case "week-of-year":
		case "quarter":
		case "hours":
		case "minutes":
		case "seconds":
		case "am-pm":
			switch (i[i.length - 1][0]) {
				case "time-style":
				case "date-style":
					o = K(h[0], !1), c += pm[h[3]][+(o.style === "long")];
					break;
			}
			break;
		case "boolean-style": break;
		case "boolean": break;
		case "text-style": break;
		case "text":
			if (h[0].slice(-2) === "/>") break;
			if (h[1] === "/") switch (i[i.length - 1][0]) {
				case "number-style":
				case "date-style":
				case "time-style":
					c += r.slice(l, h.index);
					break;
			}
			else l = h.index + h[0].length;
			break;
		case "named-range":
			o = K(h[0], !1), R = Cd(o["cell-range-address"]);
			var U = {
				Name: o.name,
				Ref: R[0] + "!" + R[1]
			};
			V && (U.Sheet = p.length), I.Names.push(U);
			break;
		case "text-content": break;
		case "text-properties": break;
		case "embedded-text": break;
		case "body":
		case "电子表格": break;
		case "forms": break;
		case "table-column": break;
		case "table-header-rows": break;
		case "table-rows": break;
		case "table-column-group": break;
		case "table-header-columns": break;
		case "table-columns": break;
		case "null-date": break;
		case "graphic-properties": break;
		case "calculation-settings": break;
		case "named-expressions": break;
		case "label-range": break;
		case "label-ranges": break;
		case "named-expression": break;
		case "sort": break;
		case "sort-by": break;
		case "sort-groups": break;
		case "tab": break;
		case "line-break": break;
		case "span": break;
		case "p":
		case "文本串":
			if (["master-styles"].indexOf(i[i.length - 1][0]) > -1) break;
			if (h[1] === "/" && (!_ || !_["string-value"])) {
				var ae = fm(r.slice(b, h.index), x);
				y = (y.length > 0 ? y + "\n" : "") + ae[0];
			} else x = K(h[0], !1), b = h.index + h[0].length;
			break;
		case "s": break;
		case "database-range":
			if (h[1] === "/") break;
			try {
				R = Cd(K(h[0])["target-range-address"]), f[R[0]]["!autofilter"] = { ref: R[1] };
			} catch {}
			break;
		case "date": break;
		case "object": break;
		case "title":
		case "标题": break;
		case "desc": break;
		case "binary-data": break;
		case "table-source": break;
		case "scenario": break;
		case "iteration": break;
		case "content-validations": break;
		case "content-validation": break;
		case "help-message": break;
		case "error-message": break;
		case "database-ranges": break;
		case "filter": break;
		case "filter-and": break;
		case "filter-or": break;
		case "filter-condition": break;
		case "list-level-style-bullet": break;
		case "list-level-style-number": break;
		case "list-level-properties": break;
		case "sender-firstname":
		case "sender-lastname":
		case "sender-initials":
		case "sender-title":
		case "sender-position":
		case "sender-email":
		case "sender-phone-private":
		case "sender-fax":
		case "sender-company":
		case "sender-phone-work":
		case "sender-street":
		case "sender-city":
		case "sender-postal-code":
		case "sender-country":
		case "sender-state-or-province":
		case "author-name":
		case "author-initials":
		case "chapter":
		case "file-name":
		case "template-name":
		case "sheet-name": break;
		case "event-listener": break;
		case "initial-creator":
		case "creation-date":
		case "print-date":
		case "generator":
		case "document-statistic":
		case "user-defined":
		case "editing-duration":
		case "editing-cycles": break;
		case "config-item": break;
		case "page-number": break;
		case "page-count": break;
		case "time": break;
		case "cell-range-source": break;
		case "detective": break;
		case "operation": break;
		case "highlighted-range": break;
		case "data-pilot-table":
		case "source-cell-range":
		case "source-service":
		case "data-pilot-field":
		case "data-pilot-level":
		case "data-pilot-subtotals":
		case "data-pilot-subtotal":
		case "data-pilot-members":
		case "data-pilot-member":
		case "data-pilot-display-info":
		case "data-pilot-sort-info":
		case "data-pilot-layout-info":
		case "data-pilot-field-reference":
		case "data-pilot-groups":
		case "data-pilot-group":
		case "data-pilot-group-member": break;
		case "rect": break;
		case "dde-connection-decls":
		case "dde-connection-decl":
		case "dde-link":
		case "dde-source": break;
		case "properties": break;
		case "property": break;
		case "a":
			if (h[1] !== "/") {
				if (L = K(h[0], !1), !L.href) break;
				L.Target = q(L.href), delete L.href, L.Target.charAt(0) == "#" && L.Target.indexOf(".") > -1 ? (R = Cd(L.Target.slice(1)), L.Target = "#" + R[0] + "!" + R[1]) : L.Target.match(/^\.\.[\\\/]/) && (L.Target = L.Target.slice(3));
			}
			break;
		case "table-protection": break;
		case "data-pilot-grand-total": break;
		case "office-document-common-attrs": break;
		default: switch (h[2]) {
			case "dc:":
			case "calcext:":
			case "loext:":
			case "ooo:":
			case "chartooo:":
			case "draw:":
			case "style:":
			case "chart:":
			case "form:":
			case "uof:":
			case "表:":
			case "字:": break;
			default: if (n.WTF) throw Error(h);
		}
	}
	var oe = {
		Sheets: f,
		SheetNames: p,
		Workbook: I
	};
	return n.bookSheets && delete oe.Sheets, oe;
}
function hm(e, t) {
	t ||= {}, Nt(e, "META-INF/manifest.xml") && Mi(Ft(e, "META-INF/manifest.xml"), t);
	var n = It(e, "content.xml");
	if (!n) throw Error("Missing content.xml in ODS / UOF file");
	var r = mm(J(n), t);
	return Nt(e, "meta.xml") && (r.Props = Fi(Ft(e, "meta.xml"))), r;
}
function gm(e, t) {
	return mm(e, t);
}
function _m(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function vm(e) {
	return typeof TextDecoder < "u" ? new TextDecoder().decode(e) : J(k(e));
}
function ym(e) {
	var t = e.reduce(function(e, t) {
		return e + t.length;
	}, 0), n = new Uint8Array(t), r = 0;
	return e.forEach(function(e) {
		n.set(e, r), r += e.length;
	}), n;
}
function bm(e) {
	return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), (e + (e >> 4) & 252645135) * 16843009 >>> 24;
}
function xm(e, t) {
	for (var n = (e[t + 15] & 127) << 7 | e[t + 14] >> 1, r = e[t + 14] & 1, i = t + 13; i >= t; --i) r = r * 256 + e[i];
	return (e[t + 15] & 128 ? -r : r) * 10 ** (n - 6176);
}
function Sm(e, t) {
	var n = t ? t[0] : 0, r = e[n] & 127;
	varint: if (e[n++] >= 128 && (r |= (e[n] & 127) << 7, e[n++] < 128 || (r |= (e[n] & 127) << 14, e[n++] < 128) || (r |= (e[n] & 127) << 21, e[n++] < 128) || (r += (e[n] & 127) * 2 ** 28, ++n, e[n++] < 128) || (r += (e[n] & 127) * 2 ** 35, ++n, e[n++] < 128) || (r += (e[n] & 127) * 2 ** 42, ++n, e[n++] < 128))) break varint;
	return t && (t[0] = n), r;
}
function Cm(e) {
	var t = 0, n = e[t] & 127;
	varint: if (e[t++] >= 128) {
		if (n |= (e[t] & 127) << 7, e[t++] < 128 || (n |= (e[t] & 127) << 14, e[t++] < 128) || (n |= (e[t] & 127) << 21, e[t++] < 128)) break varint;
		n |= (e[t] & 127) << 28;
	}
	return n;
}
function wm(e) {
	for (var t = [], n = [0]; n[0] < e.length;) {
		var r = n[0], i = Sm(e, n), a = i & 7;
		i = Math.floor(i / 8);
		var o = 0, s;
		if (i == 0) break;
		switch (a) {
			case 0:
				for (var c = n[0]; e[n[0]++] >= 128;);
				s = e.slice(c, n[0]);
				break;
			case 5:
				o = 4, s = e.slice(n[0], n[0] + o), n[0] += o;
				break;
			case 1:
				o = 8, s = e.slice(n[0], n[0] + o), n[0] += o;
				break;
			case 2:
				o = Sm(e, n), s = e.slice(n[0], n[0] + o), n[0] += o;
				break;
			default: throw Error(`PB Type ${a} for Field ${i} at offset ${r}`);
		}
		var l = {
			data: s,
			type: a
		};
		t[i] == null ? t[i] = [l] : t[i].push(l);
	}
	return t;
}
function Tm(e, t) {
	return e?.map(function(e) {
		return t(e.data);
	}) || [];
}
function Em(e) {
	for (var t = [], n = [0]; n[0] < e.length;) {
		var r = Sm(e, n), i = wm(e.slice(n[0], n[0] + r));
		n[0] += r;
		var a = {
			id: Cm(i[1][0].data),
			messages: []
		};
		i[2].forEach(function(t) {
			var r = wm(t.data), i = Cm(r[3][0].data);
			a.messages.push({
				meta: r,
				data: e.slice(n[0], n[0] + i)
			}), n[0] += i;
		}), i[3]?.[0] && (a.merge = Cm(i[3][0].data) >>> 0 > 0), t.push(a);
	}
	return t;
}
function Dm(e, t) {
	if (e != 0) throw Error(`Unexpected Snappy chunk type ${e}`);
	for (var n = [0], r = Sm(t, n), i = []; n[0] < t.length;) {
		var a = t[n[0]] & 3;
		if (a == 0) {
			var o = t[n[0]++] >> 2;
			if (o < 60) ++o;
			else {
				var s = o - 59;
				o = t[n[0]], s > 1 && (o |= t[n[0] + 1] << 8), s > 2 && (o |= t[n[0] + 2] << 16), s > 3 && (o |= t[n[0] + 3] << 24), o >>>= 0, o++, n[0] += s;
			}
			i.push(t.slice(n[0], n[0] + o)), n[0] += o;
			continue;
		} else {
			var c = 0, l = 0;
			if (a == 1 ? (l = (t[n[0]] >> 2 & 7) + 4, c = (t[n[0]++] & 224) << 3, c |= t[n[0]++]) : (l = (t[n[0]++] >> 2) + 1, a == 2 ? (c = t[n[0]] | t[n[0] + 1] << 8, n[0] += 2) : (c = (t[n[0]] | t[n[0] + 1] << 8 | t[n[0] + 2] << 16 | t[n[0] + 3] << 24) >>> 0, n[0] += 4)), i = [ym(i)], c == 0) throw Error("Invalid offset 0");
			if (c > i[0].length) throw Error("Invalid offset beyond length");
			if (l >= c) for (i.push(i[0].slice(-c)), l -= c; l >= i[i.length - 1].length;) i.push(i[i.length - 1]), l -= i[i.length - 1].length;
			i.push(i[0].slice(-c, -c + l));
		}
	}
	var u = ym(i);
	if (u.length != r) throw Error(`Unexpected length: ${u.length} != ${r}`);
	return u;
}
function Om(e) {
	for (var t = [], n = 0; n < e.length;) {
		var r = e[n++], i = e[n] | e[n + 1] << 8 | e[n + 2] << 16;
		n += 3, t.push(Dm(r, e.slice(n, n + i))), n += i;
	}
	if (n !== e.length) throw Error("data is not a valid framed stream!");
	return ym(t);
}
function km(e, t, n, r) {
	var i = _m(e), a = i.getUint32(4, !0), o = (r > 1 ? 12 : 8) + bm(a & (r > 1 ? 3470 : 398)) * 4, s = -1, c = -1, l = NaN, u = new Date(2001, 0, 1);
	a & 512 && (s = i.getUint32(o, !0), o += 4), o += bm(a & (r > 1 ? 12288 : 4096)) * 4, a & 16 && (c = i.getUint32(o, !0), o += 4), a & 32 && (l = i.getFloat64(o, !0), o += 8), a & 64 && (u.setTime(u.getTime() + i.getFloat64(o, !0) * 1e3), o += 8);
	var d;
	switch (e[2]) {
		case 0: break;
		case 2:
			d = {
				t: "n",
				v: l
			};
			break;
		case 3:
			d = {
				t: "s",
				v: t[c]
			};
			break;
		case 5:
			d = {
				t: "d",
				v: u
			};
			break;
		case 6:
			d = {
				t: "b",
				v: l > 0
			};
			break;
		case 7:
			d = {
				t: "n",
				v: l / 86400
			};
			break;
		case 8:
			d = {
				t: "e",
				v: 0
			};
			break;
		case 9:
			if (s > -1) d = {
				t: "s",
				v: n[s]
			};
			else if (c > -1) d = {
				t: "s",
				v: t[c]
			};
			else if (!isNaN(l)) d = {
				t: "n",
				v: l
			};
			else throw Error(`Unsupported cell type ${e.slice(0, 4)}`);
			break;
		default: throw Error(`Unsupported cell type ${e.slice(0, 4)}`);
	}
	return d;
}
function Am(e, t, n) {
	var r = _m(e), i = r.getUint32(8, !0), a = 12, o = -1, s = -1, c = NaN, l = NaN, u = new Date(2001, 0, 1);
	i & 1 && (c = xm(e, a), a += 16), i & 2 && (l = r.getFloat64(a, !0), a += 8), i & 4 && (u.setTime(u.getTime() + r.getFloat64(a, !0) * 1e3), a += 8), i & 8 && (s = r.getUint32(a, !0), a += 4), i & 16 && (o = r.getUint32(a, !0), a += 4);
	var d;
	switch (e[1]) {
		case 0: break;
		case 2:
			d = {
				t: "n",
				v: c
			};
			break;
		case 3:
			d = {
				t: "s",
				v: t[s]
			};
			break;
		case 5:
			d = {
				t: "d",
				v: u
			};
			break;
		case 6:
			d = {
				t: "b",
				v: l > 0
			};
			break;
		case 7:
			d = {
				t: "n",
				v: l / 86400
			};
			break;
		case 8:
			d = {
				t: "e",
				v: 0
			};
			break;
		case 9:
			if (o > -1) d = {
				t: "s",
				v: n[o]
			};
			else throw Error(`Unsupported cell type ${e[1]} : ${i & 31} : ${e.slice(0, 4)}`);
			break;
		case 10:
			d = {
				t: "n",
				v: c
			};
			break;
		default: throw Error(`Unsupported cell type ${e[1]} : ${i & 31} : ${e.slice(0, 4)}`);
	}
	return d;
}
function jm(e, t, n) {
	switch (e[0]) {
		case 0:
		case 1:
		case 2:
		case 3: return km(e, t, n, e[0]);
		case 5: return Am(e, t, n);
		default: throw Error(`Unsupported payload version ${e[0]}`);
	}
}
function Mm(e) {
	return Sm(wm(e)[1][0].data);
}
function Nm(e, t) {
	var n = wm(t.data), r = Cm(n[1][0].data), i = n[3], a = [];
	return (i || []).forEach(function(t) {
		var n = wm(t.data), i = Cm(n[1][0].data) >>> 0;
		switch (r) {
			case 1:
				a[i] = vm(n[3][0].data);
				break;
			case 8:
				var o = e[Mm(n[9][0].data)][0], s = e[Mm(wm(o.data)[1][0].data)][0], c = Cm(s.meta[1][0].data);
				if (c != 2001) throw Error(`2000 unexpected reference to ${c}`);
				a[i] = wm(s.data)[3].map(function(e) {
					return vm(e.data);
				}).join("");
				break;
		}
	}), a;
}
function Pm(e, t) {
	var n = wm(e), r = Cm(n[1][0].data) >>> 0, i = Cm(n[2][0].data) >>> 0, a = n[8]?.[0]?.data && Cm(n[8][0].data) > 0 || !1, o, s;
	if (n[7]?.[0]?.data && t != 0) o = n[7]?.[0]?.data, s = n[6]?.[0]?.data;
	else if (n[4]?.[0]?.data && t != 1) o = n[4]?.[0]?.data, s = n[3]?.[0]?.data;
	else throw `NUMBERS Tile missing ${t} cell storage`;
	for (var c = a ? 4 : 1, l = _m(o), u = [], d = 0; d < o.length / 2; ++d) {
		var f = l.getUint16(d * 2, !0);
		f < 65535 && u.push([d, f]);
	}
	if (u.length != i) throw `Expected ${i} cells, found ${u.length}`;
	var p = [];
	for (d = 0; d < u.length - 1; ++d) p[u[d][0]] = s.subarray(u[d][1] * c, u[d + 1][1] * c);
	return u.length >= 1 && (p[u[u.length - 1][0]] = s.subarray(u[u.length - 1][1] * c)), {
		R: r,
		cells: p
	};
}
function Fm(e, t) {
	var n = wm(t.data), r = n?.[7]?.[0] ? +(Cm(n[7][0].data) >>> 0 > 0) : -1, i = Tm(n[5], function(e) {
		return Pm(e, r);
	});
	return {
		nrows: Cm(n[4][0].data) >>> 0,
		data: i.reduce(function(e, t) {
			return e[t.R] || (e[t.R] = []), t.cells.forEach(function(n, r) {
				if (e[t.R][r]) throw Error(`Duplicate cell r=${t.R} c=${r}`);
				e[t.R][r] = n;
			}), e;
		}, [])
	};
}
function Im(e, t, n) {
	var r = wm(t.data), i = {
		s: {
			r: 0,
			c: 0
		},
		e: {
			r: 0,
			c: 0
		}
	};
	if (i.e.r = (Cm(r[6][0].data) >>> 0) - 1, i.e.r < 0) throw Error(`Invalid row varint ${r[6][0].data}`);
	if (i.e.c = (Cm(r[7][0].data) >>> 0) - 1, i.e.c < 0) throw Error(`Invalid col varint ${r[7][0].data}`);
	n["!ref"] = Z(i);
	var a = wm(r[4][0].data), o = Nm(e, e[Mm(a[4][0].data)][0]), s = a[17]?.[0] ? Nm(e, e[Mm(a[17][0].data)][0]) : [], c = wm(a[3][0].data), l = 0;
	c[1].forEach(function(t) {
		var r = e[Mm(wm(t.data)[2][0].data)][0], i = Cm(r.meta[1][0].data);
		if (i != 6002) throw Error(`6001 unexpected reference to ${i}`);
		var a = Fm(e, r);
		a.data.forEach(function(e, t) {
			e.forEach(function(e, r) {
				var i = X({
					r: l + t,
					c: r
				}), a = jm(e, o, s);
				a && (n[i] = a);
			});
		}), l += a.nrows;
	});
}
function Lm(e, t) {
	var n = wm(t.data), r = { "!ref": "A1" }, i = e[Mm(n[2][0].data)], a = Cm(i[0].meta[1][0].data);
	if (a != 6001) throw Error(`6000 unexpected reference to ${a}`);
	return Im(e, i[0], r), r;
}
function Rm(e, t) {
	var n = wm(t.data), r = {
		name: n[1]?.[0] ? vm(n[1][0].data) : "",
		sheets: []
	};
	return Tm(n[2], Mm).forEach(function(t) {
		e[t].forEach(function(t) {
			Cm(t.meta[1][0].data) == 6e3 && r.sheets.push(Lm(e, t));
		});
	}), r;
}
function zm(e, t) {
	var n = Ch();
	if (Tm(wm(t.data)[1], Mm).forEach(function(t) {
		e[t].forEach(function(t) {
			if (Cm(t.meta[1][0].data) == 2) {
				var r = Rm(e, t);
				r.sheets.forEach(function(e, t) {
					wh(n, e, t == 0 ? r.name : r.name + "_" + t, !0);
				});
			}
		});
	}), n.SheetNames.length == 0) throw Error("Empty NUMBERS file");
	return n;
}
function Bm(e) {
	var t = {}, n = [];
	if (e.FullPaths.forEach(function(e) {
		if (e.match(/\.iwpv2/)) throw Error("Unsupported password protection");
	}), e.FileIndex.forEach(function(e) {
		if (e.name.match(/\.iwa$/)) {
			var r;
			try {
				r = Om(e.content);
			} catch (t) {
				return console.log("?? " + e.content.length + " " + (t.message || t));
			}
			var i;
			try {
				i = Em(r);
			} catch (e) {
				return console.log("## " + (e.message || e));
			}
			i.forEach(function(e) {
				t[e.id] = e.messages, n.push(e.id);
			});
		}
	}), !n.length) throw Error("File has no messages");
	var r = (t?.[1]?.[0]?.meta?.[1])?.[0].data && Cm(t[1][0].meta[1][0].data) == 1 && t[1][0];
	if (r || n.forEach(function(e) {
		t[e].forEach(function(e) {
			if (Cm(e.meta[1][0].data) >>> 0 == 1) if (!r) r = e;
			else throw Error("Document has multiple roots");
		});
	}), !r) throw Error("Cannot find Document root");
	return zm(t, r);
}
function Vm(e) {
	return function(t) {
		for (var n = 0; n != e.length; ++n) {
			var r = e[n];
			t[r[0]] === void 0 && (t[r[0]] = r[1]), r[2] === "n" && (t[r[0]] = Number(t[r[0]]));
		}
	};
}
function Hm(e) {
	Vm([
		["cellNF", !1],
		["cellHTML", !0],
		["cellFormula", !0],
		["cellStyles", !1],
		["cellText", !0],
		["cellDates", !1],
		["sheetStubs", !1],
		[
			"sheetRows",
			0,
			"n"
		],
		["bookDeps", !1],
		["bookSheets", !1],
		["bookProps", !1],
		["bookFiles", !1],
		["bookVBA", !1],
		["password", ""],
		["WTF", !1]
	])(e);
}
function Um(e) {
	Vm([
		["cellDates", !1],
		["bookSST", !1],
		["bookType", "xlsx"],
		["compression", !1],
		["WTF", !1]
	])(e);
}
function Wm(e) {
	return Q.WS.indexOf(e) > -1 ? "sheet" : Q.CS && e == Q.CS ? "chart" : Q.DS && e == Q.DS ? "dialog" : Q.MS && e == Q.MS ? "macro" : e && e.length ? e : "sheet";
}
function Gm(e, t) {
	if (!e) return 0;
	try {
		e = t.map(function(t) {
			return t.id ||= t.strRelID, [
				t.name,
				e["!id"][t.id].Target,
				Wm(e["!id"][t.id].Type)
			];
		});
	} catch {
		return null;
	}
	return !e || e.length === 0 ? null : e;
}
function Km(e, t, n, r, i, a, o, s, c, l, u, d) {
	try {
		a[r] = Oi(It(e, n, !0), t);
		var f = Ft(e, t), p;
		switch (s) {
			case "sheet":
				p = vp(f, t, i, c, a[r], l, u, d);
				break;
			case "chart":
				if (p = yp(f, t, i, c, a[r], l, u, d), !p || !p["!drawel"]) break;
				var m = Ht(p["!drawel"].Target, t), h = Di(m), g = Ht(ol(It(e, m, !0), Oi(It(e, h, !0), m)), m), _ = Di(g);
				p = Jf(It(e, g, !0), g, c, Oi(It(e, _, !0), g), l, p);
				break;
			case "macro":
				p = bp(f, t, i, c, a[r], l, u, d);
				break;
			case "dialog":
				p = xp(f, t, i, c, a[r], l, u, d);
				break;
			default: throw Error("Unrecognized sheet type " + s);
		}
		o[r] = p;
		var v = [];
		a && a[r] && ct(a[r]).forEach(function(n) {
			var i = "";
			if (a[r][n].Type == Q.CMNT) {
				i = Ht(a[r][n].Target, t);
				var o = Tp(Ft(e, i, !0), i, c);
				if (!o || !o.length) return;
				ll(p, o, !1);
			}
			a[r][n].Type == Q.TCMNT && (i = Ht(a[r][n].Target, t), v = v.concat(fl(Ft(e, i, !0), c)));
		}), v && v.length && ll(p, v, !0, c.people || []);
	} catch (e) {
		if (c.WTF) throw e;
	}
}
function qm(e) {
	return e.charAt(0) == "/" ? e.slice(1) : e;
}
function Jm(e, t) {
	if (Qe(), t ||= {}, Hm(t), Nt(e, "META-INF/manifest.xml") || Nt(e, "objectdata.xml")) return hm(e, t);
	if (Nt(e, "Index/Document.iwa")) {
		if (typeof Uint8Array > "u") throw Error("NUMBERS file parsing requires Uint8Array support");
		if (Bm !== void 0) {
			if (e.FileIndex) return Bm(e);
			var n = G.utils.cfb_new();
			return Rt(e).forEach(function(t) {
				zt(n, t, Lt(e, t));
			}), Bm(n);
		}
		throw Error("Unsupported NUMBERS file");
	}
	if (!Nt(e, "[Content_Types].xml")) throw Nt(e, "index.xml.gz") ? Error("Unsupported NUMBERS 08 file") : Nt(e, "index.xml") ? Error("Unsupported NUMBERS 09 file") : Error("Unsupported ZIP file");
	var r = Rt(e), i = Ti(It(e, "[Content_Types].xml")), a = !1, o, s;
	if (i.workbooks.length === 0 && (s = "xl/workbook.xml", Ft(e, s, !0) && i.workbooks.push(s)), i.workbooks.length === 0) {
		if (s = "xl/workbook.bin", !Ft(e, s, !0)) throw Error("Could not find workbook");
		i.workbooks.push(s), a = !0;
	}
	i.workbooks[0].slice(-3) == "bin" && (a = !0);
	var c = {}, l = {};
	if (!t.bookSheets && !t.bookProps) {
		if (wd = [], i.sst) try {
			wd = wp(Ft(e, qm(i.sst)), i.sst, t);
		} catch (e) {
			if (t.WTF) throw e;
		}
		t.cellStyles && i.themes.length && (c = Cp(It(e, i.themes[0].replace(/^\//, ""), !0) || "", i.themes[0], t)), i.style && (l = Sp(Ft(e, qm(i.style)), i.style, c, t));
	}
	i.links.map(function(n) {
		try {
			var r = Oi(It(e, Di(qm(n))), n);
			return Dp(Ft(e, qm(n)), r, n, t);
		} catch {}
	});
	var u = _p(Ft(e, qm(i.workbooks[0])), i.workbooks[0], t), d = {}, f = "";
	i.coreprops.length && (f = Ft(e, qm(i.coreprops[0]), !0), f && (d = Fi(f)), i.extprops.length !== 0 && (f = Ft(e, qm(i.extprops[0]), !0), f && Bi(f, d, t)));
	var p = {};
	(!t.bookSheets || t.bookProps) && i.custprops.length !== 0 && (f = It(e, qm(i.custprops[0]), !0), f && (p = Ui(f, t)));
	var m = {};
	if ((t.bookSheets || t.bookProps) && (u.Sheets ? o = u.Sheets.map(function(e) {
		return e.name;
	}) : d.Worksheets && d.SheetNames.length > 0 && (o = d.SheetNames), t.bookProps && (m.Props = d, m.Custprops = p), t.bookSheets && o !== void 0 && (m.SheetNames = o), t.bookSheets ? m.SheetNames : t.bookProps)) return m;
	o = {};
	var h = {};
	t.bookDeps && i.calcchain && (h = Ep(Ft(e, qm(i.calcchain)), i.calcchain, t));
	var g = 0, _ = {}, v, y, b = u.Sheets;
	d.Worksheets = b.length, d.SheetNames = [];
	for (var x = 0; x != b.length; ++x) d.SheetNames[x] = b[x].name;
	var S = a ? "bin" : "xml", C = i.workbooks[0].lastIndexOf("/"), w = (i.workbooks[0].slice(0, C + 1) + "_rels/" + i.workbooks[0].slice(C + 1) + ".rels").replace(/^\//, "");
	Nt(e, w) || (w = "xl/_rels/workbook." + S + ".rels");
	var T = Oi(It(e, w, !0), w.replace(/_rels.*/, "s5s"));
	(i.metadata || []).length >= 1 && (t.xlmeta = Op(Ft(e, qm(i.metadata[0])), i.metadata[0], t)), (i.people || []).length >= 1 && (t.people = ml(Ft(e, qm(i.people[0])), t)), T &&= Gm(T, u.Sheets);
	var E = +!!Ft(e, "xl/worksheets/sheet.xml", !0);
	wsloop: for (g = 0; g != d.Worksheets; ++g) {
		var D = "sheet";
		if (T && T[g] ? (v = "xl/" + T[g][1].replace(/[\/]?xl\//, ""), Nt(e, v) || (v = T[g][1]), Nt(e, v) || (v = w.replace(/_rels\/.*$/, "") + T[g][1]), D = T[g][2]) : (v = "xl/worksheets/sheet" + (g + 1 - E) + "." + S, v = v.replace(/sheet0\./, "sheet.")), y = v.replace(/^(.*)(\/)([^\/]*)$/, "$1/_rels/$3.rels"), t && t.sheets != null) switch (typeof t.sheets) {
			case "number":
				if (g != t.sheets) continue wsloop;
				break;
			case "string":
				if (d.SheetNames[g].toLowerCase() != t.sheets.toLowerCase()) continue wsloop;
				break;
			default: if (Array.isArray && Array.isArray(t.sheets)) {
				for (var O = !1, k = 0; k != t.sheets.length; ++k) typeof t.sheets[k] == "number" && t.sheets[k] == g && (O = 1), typeof t.sheets[k] == "string" && t.sheets[k].toLowerCase() == d.SheetNames[g].toLowerCase() && (O = 1);
				if (!O) continue wsloop;
			}
		}
		Km(e, v, y, d.SheetNames[g], g, _, o, D, t, u, c, l);
	}
	return m = {
		Directory: i,
		Workbook: u,
		Props: d,
		Custprops: p,
		Deps: h,
		Sheets: o,
		SheetNames: d.SheetNames,
		Strings: wd,
		Styles: l,
		Themes: c,
		SSF: wt(U)
	}, t && t.bookFiles && (e.files ? (m.keys = r, m.files = e.files) : (m.keys = [], m.files = {}, e.FullPaths.forEach(function(t, n) {
		t = t.replace(/^Root Entry[\/]/, ""), m.keys.push(t), m.files[t] = e.FileIndex[n];
	}))), t && t.bookVBA && (i.vba.length > 0 ? m.vbaraw = Ft(e, qm(i.vba[0]), !0) : i.defaults && i.defaults.bin === yl && (m.vbaraw = Ft(e, "xl/vbaProject.bin", !0))), m;
}
function Ym(e, t) {
	var n = t || {}, r = "Workbook", i = G.find(e, r);
	try {
		if (r = "/!DataSpaces/Version", i = G.find(e, r), !i || !i.content || (Ds(i.content), r = "/!DataSpaces/DataSpaceMap", i = G.find(e, r), !i || !i.content)) throw Error("ECMA-376 Encrypted file missing " + r);
		var a = ks(i.content);
		if (a.length !== 1 || a[0].comps.length !== 1 || a[0].comps[0].t !== 0 || a[0].name !== "StrongEncryptionDataSpace" || a[0].comps[0].v !== "EncryptedPackage") throw Error("ECMA-376 Encrypted file bad " + r);
		if (r = "/!DataSpaces/DataSpaceInfo/StrongEncryptionDataSpace", i = G.find(e, r), !i || !i.content) throw Error("ECMA-376 Encrypted file missing " + r);
		var o = As(i.content);
		if (o.length != 1 || o[0] != "StrongEncryptionTransform") throw Error("ECMA-376 Encrypted file bad " + r);
		if (r = "/!DataSpaces/TransformInfo/StrongEncryptionTransform/!Primary", i = G.find(e, r), !i || !i.content) throw Error("ECMA-376 Encrypted file missing " + r);
		Ms(i.content);
	} catch {}
	if (r = "/EncryptionInfo", i = G.find(e, r), !i || !i.content) throw Error("ECMA-376 Encrypted file missing " + r);
	var s = Fs(i.content);
	if (r = "/EncryptedPackage", i = G.find(e, r), !i || !i.content) throw Error("ECMA-376 Encrypted file missing " + r);
	if (s[0] == 4 && typeof decrypt_agile < "u") return decrypt_agile(s[1], i.content, n.password || "", n);
	if (s[0] == 2 && typeof decrypt_std76 < "u") return decrypt_std76(s[1], i.content, n.password || "", n);
	throw Error("File is password-protected");
}
function Xm(e, t) {
	sl = 1024, e && !e.SSF && (e.SSF = wt(U)), e && e.SSF && (Qe(), Ze(e.SSF), t.revssf = ut(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF), t.rels = {}, t.wbrels = {}, t.Strings = [], t.Strings.Count = 0, t.Strings.Unique = 0, Ed ? t.revStrings = /* @__PURE__ */ new Map() : (t.revStrings = {}, t.revStrings.foo = [], delete t.revStrings.foo);
	var n = "xml", r = xl.indexOf(t.bookType) > -1, i = wi();
	Um(t ||= {});
	var a = Bt(), o = "", s = 0;
	if (t.cellXfs = [], Ad(t.cellXfs, {}, { revssf: { General: 0 } }), e.Props ||= {}, o = "docProps/core.xml", zt(a, o, Li(e.Props, t)), i.coreprops.push(o), Ai(t.rels, 2, o, Q.CORE_PROPS), o = "docProps/app.xml", !(e.Props && e.Props.SheetNames)) if (!e.Workbook || !e.Workbook.Sheets) e.Props.SheetNames = e.SheetNames;
	else {
		for (var c = [], l = 0; l < e.SheetNames.length; ++l) (e.Workbook.Sheets[l] || {}).Hidden != 2 && c.push(e.SheetNames[l]);
		e.Props.SheetNames = c;
	}
	e.Props.Worksheets = e.Props.SheetNames.length, zt(a, o, Vi(e.Props, t)), i.extprops.push(o), Ai(t.rels, 3, o, Q.EXT_PROPS), e.Custprops !== e.Props && ct(e.Custprops || {}).length > 0 && (o = "docProps/custom.xml", zt(a, o, Wi(e.Custprops, t)), i.custprops.push(o), Ai(t.rels, 4, o, Q.CUST_PROPS));
	var u = ["SheetJ5"];
	for (t.tcid = 0, s = 1; s <= e.SheetNames.length; ++s) {
		var d = { "!id": {} }, f = e.Sheets[e.SheetNames[s - 1]];
		switch ((f || {})["!type"] || "sheet") {
			default: o = "xl/worksheets/sheet" + s + "." + n, zt(a, o, ff(s - 1, t, e, d)), i.sheets.push(o), Ai(t.wbrels, -1, "worksheets/sheet" + s + "." + n, Q.WS[0]);
		}
		if (f) {
			var p = f["!comments"], m = !1, h = "";
			if (p && p.length > 0) {
				var g = !1;
				p.forEach(function(e) {
					e[1].forEach(function(e) {
						e.T == 1 && (g = !0);
					});
				}), g && (h = "xl/threadedComments/threadedComment" + s + "." + n, zt(a, h, pl(p, u, t)), i.threadedcomments.push(h), Ai(d, -1, "../threadedComments/threadedComment" + s + "." + n, Q.TCMNT)), h = "xl/comments" + s + "." + n, zt(a, h, dl(p, t)), i.comments.push(h), Ai(d, -1, "../comments" + s + "." + n, Q.CMNT), m = !0;
			}
			f["!legacy"] && m && zt(a, "xl/drawings/vmlDrawing" + s + ".vml", cl(s, f["!comments"])), delete f["!comments"], delete f["!legacy"];
		}
		d["!id"].rId1 && zt(a, Di(o), ki(d));
	}
	return t.Strings != null && t.Strings.length > 0 && (o = "xl/sharedStrings." + n, zt(a, o, Ss(t.Strings, t)), i.strs.push(o), Ai(t.wbrels, -1, "sharedStrings." + n, Q.SST)), o = "xl/workbook." + n, zt(a, o, dp(e, t)), i.workbooks.push(o), Ai(t.rels, 1, o, Q.WB), o = "xl/theme/theme1.xml", zt(a, o, Vc(e.Themes, t)), i.themes.push(o), Ai(t.wbrels, -1, "theme/theme1.xml", Q.THEME), o = "xl/styles." + n, zt(a, o, wc(e, t)), i.styles.push(o), Ai(t.wbrels, -1, "styles." + n, Q.STY), e.vbaraw && r && (o = "xl/vbaProject.bin", zt(a, o, e.vbaraw), i.vba.push(o), Ai(t.wbrels, -1, "vbaProject.bin", Q.VBA)), o = "xl/metadata." + n, zt(a, o, tl()), i.metadata.push(o), Ai(t.wbrels, -1, "metadata." + n, Q.XLMETA), u.length > 1 && (o = "xl/persons/person.xml", zt(a, o, hl(u, t)), i.people.push(o), Ai(t.wbrels, -1, "persons/person.xml", Q.PEOPLE)), zt(a, "[Content_Types].xml", Ei(i, t)), zt(a, "_rels/.rels", ki(t.rels)), zt(a, "xl/_rels/workbook." + n + ".rels", ki(t.wbrels)), delete t.revssf, delete t.ssf, a;
}
function Zm(e, t) {
	var n = "";
	switch ((t || {}).type || "base64") {
		case "buffer": return [
			e[0],
			e[1],
			e[2],
			e[3],
			e[4],
			e[5],
			e[6],
			e[7]
		];
		case "base64":
			n = S(e.slice(0, 12));
			break;
		case "binary":
			n = e;
			break;
		case "array": return [
			e[0],
			e[1],
			e[2],
			e[3],
			e[4],
			e[5],
			e[6],
			e[7]
		];
		default: throw Error("Unrecognized type " + (t && t.type || "undefined"));
	}
	return [
		n.charCodeAt(0),
		n.charCodeAt(1),
		n.charCodeAt(2),
		n.charCodeAt(3),
		n.charCodeAt(4),
		n.charCodeAt(5),
		n.charCodeAt(6),
		n.charCodeAt(7)
	];
}
function Qm(e, t) {
	return G.find(e, "EncryptedPackage") ? Ym(e, t) : Xp(e, t);
}
function $m(e, t) {
	var n, r = e, i = t || {};
	return i.type ||= C && Buffer.isBuffer(e) ? "buffer" : "base64", n = Vt(r, i), Jm(n, i);
}
function eh(e, t) {
	var n = 0;
	main: for (; n < e.length;) switch (e.charCodeAt(n)) {
		case 10:
		case 13:
		case 32:
			++n;
			break;
		case 60: return Vp(e.slice(n), t);
		default: break main;
	}
	return ss.to_workbook(e, t);
}
function th(e, t) {
	var n = "", r = Zm(e, t);
	switch (t.type) {
		case "base64":
			n = S(e);
			break;
		case "binary":
			n = e;
			break;
		case "buffer":
			n = e.toString("binary");
			break;
		case "array":
			n = Ct(e);
			break;
		default: throw Error("Unrecognized type " + t.type);
	}
	return r[0] == 239 && r[1] == 187 && r[2] == 191 && (n = J(n)), t.type = "binary", eh(n, t);
}
function nh(e, t) {
	var n = e;
	return t.type == "base64" && (n = S(n)), n = _.utils.decode(1200, n.slice(2), "str"), t.type = "binary", eh(n, t);
}
function rh(e) {
	return e.match(/[^\x00-\x7F]/) ? un(e) : e;
}
function ih(e, t, n, r) {
	return r ? (n.type = "string", ss.to_workbook(e, n)) : ss.to_workbook(t, n);
}
function ah(e, t) {
	u();
	var n = t || {};
	if (typeof ArrayBuffer < "u" && e instanceof ArrayBuffer) return ah(new Uint8Array(e), (n = wt(n), n.type = "array", n));
	typeof Uint8Array < "u" && e instanceof Uint8Array && !n.type && (n.type = typeof Deno < "u" ? "buffer" : "array");
	var r = e, i = [
		0,
		0,
		0,
		0
	], a = !1;
	if (n.cellStyles && (n.cellNF = !0, n.sheetStubs = !0), Td = {}, n.dateNF && (Td.dateNF = n.dateNF), n.type ||= C && Buffer.isBuffer(e) ? "buffer" : "base64", n.type == "file" && (n.type = C ? "buffer" : "binary", r = st(e), typeof Uint8Array < "u" && !C && (n.type = "array")), n.type == "string" && (a = !0, n.type = "binary", n.codepage = 65001, r = rh(e)), n.type == "array" && typeof Uint8Array < "u" && e instanceof Uint8Array && typeof ArrayBuffer < "u") {
		var o = new Uint8Array(/* @__PURE__ */ new ArrayBuffer(3));
		if (o.foo = "bar", !o.foo) return n = wt(n), n.type = "array", ah(j(r), n);
	}
	switch ((i = Zm(r, n))[0]) {
		case 208:
			if (i[1] === 207 && i[2] === 17 && i[3] === 224 && i[4] === 161 && i[5] === 177 && i[6] === 26 && i[7] === 225) return Qm(G.read(r, n), n);
			break;
		case 9:
			if (i[1] <= 8) return Xp(r, n);
			break;
		case 60: return Vp(r, n);
		case 73:
			if (i[1] === 73 && i[2] === 42 && i[3] === 0) throw Error("TIFF Image File is not a spreadsheet");
			if (i[1] === 68) return cs(r, n);
			break;
		case 84:
			if (i[1] === 65 && i[2] === 66 && i[3] === 76) return as.to_workbook(r, n);
			break;
		case 80: return i[1] === 75 && i[2] < 9 && i[3] < 9 ? $m(r, n) : ih(e, r, n, a);
		case 239: return i[3] === 60 ? Vp(r, n) : ih(e, r, n, a);
		case 255:
			if (i[1] === 254) return nh(r, n);
			if (i[1] === 0 && i[2] === 2 && i[3] === 0) return ls.to_workbook(r, n);
			break;
		case 0:
			if (i[1] === 0 && (i[2] >= 2 && i[3] === 0 || i[2] === 0 && (i[3] === 8 || i[3] === 9))) return ls.to_workbook(r, n);
			break;
		case 3:
		case 131:
		case 139:
		case 140: return rs.to_workbook(r, n);
		case 123:
			if (i[1] === 92 && i[2] === 114 && i[3] === 116) return Js.to_workbook(r, n);
			break;
		case 10:
		case 13:
		case 32: return th(r, n);
		case 137:
			if (i[1] === 80 && i[2] === 78 && i[3] === 71) throw Error("PNG Image File is not a spreadsheet");
			break;
	}
	return ns.indexOf(i[0]) > -1 && i[2] <= 12 && i[3] <= 31 ? rs.to_workbook(r, n) : ih(e, r, n, a);
}
function oh(e, t) {
	switch (t.type) {
		case "base64":
		case "binary": break;
		case "buffer":
		case "array":
			t.type = "";
			break;
		case "file": return ot(t.file, G.write(e, { type: C ? "buffer" : "" }));
		case "string": throw Error("'string' output type invalid for '" + t.bookType + "' files");
		default: throw Error("Unrecognized type " + t.type);
	}
	return G.write(e, t);
}
function sh(e, t) {
	var n = wt(t || {});
	return ch(Xm(e, n), n);
}
function ch(e, t) {
	var n = {}, r = C ? "nodebuffer" : typeof Uint8Array < "u" ? "array" : "string";
	if (t.compression && (n.compression = "DEFLATE"), t.password) n.type = r;
	else switch (t.type) {
		case "base64":
			n.type = "base64";
			break;
		case "binary":
			n.type = "string";
			break;
		case "string": throw Error("'string' output type invalid for '" + t.bookType + "' files");
		case "buffer":
		case "file":
			n.type = r;
			break;
		default: throw Error("Unrecognized type " + t.type);
	}
	var i = e.FullPaths ? G.write(e, {
		fileType: "zip",
		type: {
			nodebuffer: "buffer",
			string: "binary"
		}[n.type] || n.type,
		compression: !!t.compression
	}) : e.generate(n);
	if (typeof Deno < "u" && typeof i == "string") {
		if (t.type == "binary" || t.type == "base64") return i;
		i = new Uint8Array(O(i));
	}
	return t.password && typeof encrypt_agile < "u" ? oh(encrypt_agile(i, t.password), t) : t.type === "file" ? ot(t.file, i) : t.type == "string" ? J(i) : i;
}
function lh(e, t) {
	u(), cp(e);
	var n = wt(t || {});
	if (n.cellStyles && (n.cellNF = !0, n.sheetStubs = !0), n.type == "array") {
		n.type = "binary";
		var r = lh(e, n);
		return n.type = "array", O(r);
	}
	return sh(e, n);
}
function uh(e) {
	if (!e.bookType) {
		var t = {
			xls: "biff8",
			htm: "html",
			slk: "sylk",
			socialcalc: "eth",
			Sh33tJS: "WTF"
		}, n = e.file.slice(e.file.lastIndexOf(".")).toLowerCase();
		n.match(/^\.[a-z]+$/) && (e.bookType = n.slice(1)), e.bookType = t[e.bookType] || e.bookType;
	}
}
function dh(e, t, n) {
	var r = n || {};
	return r.type = "file", r.file = t, uh(r), lh(e, r);
}
function fh(e, t, n, r, i, a, o, s) {
	var c = yr(n), l = s.defval, u = s.raw || !Object.prototype.hasOwnProperty.call(s, "raw"), d = !0, f = i === 1 ? [] : {};
	if (i !== 1) if (Object.defineProperty) try {
		Object.defineProperty(f, "__rowNum__", {
			value: n,
			enumerable: !1
		});
	} catch {
		f.__rowNum__ = n;
	}
	else f.__rowNum__ = n;
	if (!o || e[n]) for (var p = t.s.c; p <= t.e.c; ++p) {
		var m = o ? e[n][p] : e[r[p] + c];
		if (m === void 0 || m.t === void 0) {
			if (l === void 0) continue;
			a[p] != null && (f[a[p]] = l);
			continue;
		}
		var h = m.v;
		switch (m.t) {
			case "z":
				if (h == null) break;
				continue;
			case "e":
				h = h == 0 ? null : void 0;
				break;
			case "s":
			case "d":
			case "b":
			case "n": break;
			default: throw Error("unrecognized type " + m.t);
		}
		if (a[p] != null) {
			if (h == null) if (m.t == "e" && h === null) f[a[p]] = null;
			else if (l !== void 0) f[a[p]] = l;
			else if (u && h === null) f[a[p]] = null;
			else continue;
			else f[a[p]] = u && (m.t !== "n" || m.t === "n" && s.rawNumbers !== !1) ? h : jr(m, h, s);
			h != null && (d = !1);
		}
	}
	return {
		row: f,
		isempty: d
	};
}
function ph(e, t) {
	if (e == null || e["!ref"] == null) return [];
	var n = {
		t: "n",
		v: 0
	}, r = 0, i = 1, a = [], o = 0, s = "", c = {
		s: {
			r: 0,
			c: 0
		},
		e: {
			r: 0,
			c: 0
		}
	}, l = t || {}, u = l.range == null ? e["!ref"] : l.range;
	switch (l.header === 1 ? r = 1 : l.header === "A" ? r = 2 : Array.isArray(l.header) ? r = 3 : l.header ?? (r = 0), typeof u) {
		case "string":
			c = kr(u);
			break;
		case "number":
			c = kr(e["!ref"]), c.s.r = u;
			break;
		default: c = u;
	}
	r > 0 && (i = 0);
	var d = yr(c.s.r), f = [], p = [], m = 0, h = 0, g = Array.isArray(e), _ = c.s.r, v = 0, y = {};
	g && !e[_] && (e[_] = []);
	var b = l.skipHidden && e["!cols"] || [], x = l.skipHidden && e["!rows"] || [];
	for (v = c.s.c; v <= c.e.c; ++v) if (!(b[v] || {}).hidden) switch (f[v] = Cr(v), n = g ? e[_][v] : e[f[v] + d], r) {
		case 1:
			a[v] = v - c.s.c;
			break;
		case 2:
			a[v] = f[v];
			break;
		case 3:
			a[v] = l.header[v - c.s.c];
			break;
		default:
			if (n ??= {
				w: "__EMPTY",
				t: "s"
			}, s = o = jr(n, null, l), h = y[o] || 0, !h) y[o] = 1;
			else {
				do
					s = o + "_" + h++;
				while (y[s]);
				y[o] = h, y[s] = 1;
			}
			a[v] = s;
	}
	for (_ = c.s.r + i; _ <= c.e.r; ++_) if (!(x[_] || {}).hidden) {
		var S = fh(e, c, _, f, r, a, g, l);
		(S.isempty === !1 || (r === 1 ? l.blankrows !== !1 : l.blankrows)) && (p[m++] = S.row);
	}
	return p.length = m, p;
}
var mh = /"/g;
function hh(e, t, n, r, i, a, o, s) {
	for (var c = !0, l = [], u = "", d = yr(n), f = t.s.c; f <= t.e.c; ++f) if (r[f]) {
		var p = s.dense ? (e[n] || [])[f] : e[r[f] + d];
		if (p == null) u = "";
		else if (p.v != null) {
			c = !1, u = "" + (s.rawNumbers && p.t == "n" ? p.v : jr(p, null, s));
			for (var m = 0, h = 0; m !== u.length; ++m) if ((h = u.charCodeAt(m)) === i || h === a || h === 34 || s.forceQuotes) {
				u = "\"" + u.replace(mh, "\"\"") + "\"";
				break;
			}
			u == "ID" && (u = "\"ID\"");
		} else p.f != null && !p.F ? (c = !1, u = "=" + p.f, u.indexOf(",") >= 0 && (u = "\"" + u.replace(mh, "\"\"") + "\"")) : u = "";
		l.push(u);
	}
	return s.blankrows === !1 && c ? null : l.join(o);
}
function gh(e, t) {
	var n = [], r = t ?? {};
	if (e == null || e["!ref"] == null) return "";
	var i = kr(e["!ref"]), a = r.FS === void 0 ? "," : r.FS, o = a.charCodeAt(0), s = r.RS === void 0 ? "\n" : r.RS, c = s.charCodeAt(0), l = RegExp((a == "|" ? "\\|" : a) + "+$"), u = "", d = [];
	r.dense = Array.isArray(e);
	for (var f = r.skipHidden && e["!cols"] || [], p = r.skipHidden && e["!rows"] || [], m = i.s.c; m <= i.e.c; ++m) (f[m] || {}).hidden || (d[m] = Cr(m));
	for (var h = 0, g = i.s.r; g <= i.e.r; ++g) (p[g] || {}).hidden || (u = hh(e, i, g, d, o, c, a, r), u != null && (r.strip && (u = u.replace(l, "")), (u || r.blankrows !== !1) && n.push((h++ ? s : "") + u)));
	return delete r.dense, n.join("");
}
function _h(e, t) {
	t ||= {}, t.FS = "	", t.RS = "\n";
	var n = gh(e, t);
	return _ === void 0 || t.type == "string" ? n : "ÿþ" + _.utils.encode(1200, n, "str");
}
function vh(e) {
	var t = "", n, r = "";
	if (e == null || e["!ref"] == null) return [];
	var i = kr(e["!ref"]), a = "", o = [], s, c = [], l = Array.isArray(e);
	for (s = i.s.c; s <= i.e.c; ++s) o[s] = Cr(s);
	for (var u = i.s.r; u <= i.e.r; ++u) for (a = yr(u), s = i.s.c; s <= i.e.c; ++s) if (t = o[s] + a, n = l ? (e[u] || [])[s] : e[t], r = "", n !== void 0) {
		if (n.F != null) {
			if (t = n.F, !n.f) continue;
			r = n.f, t.indexOf(":") == -1 && (t = t + ":" + t);
		}
		if (n.f != null) r = n.f;
		else if (n.t == "z") continue;
		else if (n.t == "n" && n.v != null) r = "" + n.v;
		else if (n.t == "b") r = n.v ? "TRUE" : "FALSE";
		else if (n.w !== void 0) r = "'" + n.w;
		else if (n.v === void 0) continue;
		else r = n.t == "s" ? "'" + n.v : "" + n.v;
		c[c.length] = t + "=" + r;
	}
	return c;
}
function yh(e, t, n) {
	var r = n || {}, i = +!r.skipHeader, a = e || {}, o = 0, s = 0;
	if (a && r.origin != null) if (typeof r.origin == "number") o = r.origin;
	else {
		var c = typeof r.origin == "string" ? Dr(r.origin) : r.origin;
		o = c.r, s = c.c;
	}
	var l, u = {
		s: {
			c: 0,
			r: 0
		},
		e: {
			c: s,
			r: o + t.length - 1 + i
		}
	};
	if (a["!ref"]) {
		var d = kr(a["!ref"]);
		u.e.c = Math.max(u.e.c, d.e.c), u.e.r = Math.max(u.e.r, d.e.r), o == -1 && (o = d.e.r + 1, u.e.r = o + t.length - 1 + i);
	} else o == -1 && (o = 0, u.e.r = t.length - 1 + i);
	var f = r.header || [], p = 0;
	t.forEach(function(e, t) {
		ct(e).forEach(function(n) {
			(p = f.indexOf(n)) == -1 && (f[p = f.length] = n);
			var c = e[n], u = "z", d = "", m = X({
				c: s + p,
				r: o + t + i
			});
			l = xh(a, m), c && typeof c == "object" && !(c instanceof Date) ? a[m] = c : (typeof c == "number" ? u = "n" : typeof c == "boolean" ? u = "b" : typeof c == "string" ? u = "s" : c instanceof Date ? (u = "d", r.cellDates || (u = "n", c = pt(c)), d = r.dateNF || U[14]) : c === null && r.nullError && (u = "e", c = 0), l ? (l.t = u, l.v = c, delete l.w, delete l.R, d && (l.z = d)) : a[m] = l = {
				t: u,
				v: c
			}, d && (l.z = d));
		});
	}), u.e.c = Math.max(u.e.c, s + f.length - 1);
	var m = yr(o);
	if (i) for (p = 0; p < f.length; ++p) a[Cr(p + s) + m] = {
		t: "s",
		v: f[p]
	};
	return a["!ref"] = Z(u), a;
}
function bh(e, t) {
	return yh(null, e, t);
}
function xh(e, t, n) {
	if (typeof t == "string") {
		if (Array.isArray(e)) {
			var r = Dr(t);
			return e[r.r] || (e[r.r] = []), e[r.r][r.c] || (e[r.r][r.c] = { t: "z" });
		}
		return e[t] || (e[t] = { t: "z" });
	}
	return typeof t == "number" ? xh(e, X({
		r: t,
		c: n || 0
	})) : xh(e, X(t));
}
function Sh(e, t) {
	if (typeof t == "number") {
		if (t >= 0 && e.SheetNames.length > t) return t;
		throw Error("Cannot find sheet # " + t);
	} else if (typeof t == "string") {
		var n = e.SheetNames.indexOf(t);
		if (n > -1) return n;
		throw Error("Cannot find sheet name |" + t + "|");
	} else throw Error("Cannot find sheet |" + t + "|");
}
function Ch() {
	return {
		SheetNames: [],
		Sheets: {}
	};
}
function wh(e, t, n, r) {
	var i = 1;
	if (!n) for (; i <= 65535 && e.SheetNames.indexOf(n = "Sheet" + i) != -1; ++i, n = void 0);
	if (!n || e.SheetNames.length >= 65535) throw Error("Too many worksheets");
	if (r && e.SheetNames.indexOf(n) >= 0) {
		var a = n.match(/(^.*?)(\d+)$/);
		i = a && +a[2] || 0;
		var o = a && a[1] || n;
		for (++i; i <= 65535 && e.SheetNames.indexOf(n = o + i) != -1; ++i);
	}
	if (op(n), e.SheetNames.indexOf(n) >= 0) throw Error("Worksheet with name |" + n + "| already exists!");
	return e.SheetNames.push(n), e.Sheets[n] = t, n;
}
function Th(e, t, n) {
	e.Workbook ||= {}, e.Workbook.Sheets || (e.Workbook.Sheets = []);
	var r = Sh(e, t);
	switch (e.Workbook.Sheets[r] || (e.Workbook.Sheets[r] = {}), n) {
		case 0:
		case 1:
		case 2: break;
		default: throw Error("Bad sheet visibility setting " + n);
	}
	e.Workbook.Sheets[r].Hidden = n;
}
function Eh(e, t) {
	return e.z = t, e;
}
function Dh(e, t, n) {
	return t ? (e.l = { Target: t }, n && (e.l.Tooltip = n)) : delete e.l, e;
}
function Oh(e, t, n) {
	return Dh(e, "#" + t, n);
}
function kh(e, t, n) {
	e.c ||= [], e.c.push({
		t,
		a: n || "SheetJS"
	});
}
function Ah(e, t, n, r) {
	for (var i = typeof t == "string" ? kr(t) : t, a = typeof t == "string" ? t : Z(t), o = i.s.r; o <= i.e.r; ++o) for (var s = i.s.c; s <= i.e.c; ++s) {
		var c = xh(e, o, s);
		c.t = "n", c.F = a, delete c.v, o == i.s.r && s == i.s.c && (c.f = n, r && (c.D = !0));
	}
	return e;
}
var jh = {
	encode_col: Cr,
	encode_row: yr,
	encode_cell: X,
	encode_range: Z,
	decode_col: Sr,
	decode_row: vr,
	split_cell: Er,
	decode_cell: Dr,
	decode_range: Or,
	format_cell: jr,
	sheet_add_aoa: Nr,
	sheet_add_json: yh,
	sheet_add_dom: sm,
	aoa_to_sheet: Pr,
	json_to_sheet: bh,
	table_to_sheet: cm,
	table_to_book: lm,
	sheet_to_csv: gh,
	sheet_to_txt: _h,
	sheet_to_json: ph,
	sheet_to_html: om,
	sheet_to_formulae: vh,
	sheet_to_row_object_array: ph,
	sheet_get_cell: xh,
	book_new: Ch,
	book_append_sheet: wh,
	book_set_sheet_visibility: Th,
	cell_set_number_format: Eh,
	cell_set_hyperlink: Dh,
	cell_set_internal_link: Oh,
	cell_add_comment: kh,
	sheet_set_array_formula: Ah,
	consts: {
		SHEET_VISIBLE: 0,
		SHEET_HIDDEN: 1,
		SHEET_VERY_HIDDEN: 2
	}
};
n.version;
//#endregion
//#region src/components/spreadsheet-editor/spreadsheet-editor.css?inline
var Mh = "tp-spreadsheet-editor{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface,Canvas);min-inline-size:0;color:var(--tp-color-text,CanvasText);gap:.5rem;display:grid;overflow:hidden}tp-spreadsheet-editor>tp-toolbar[data-tp-spreadsheet-editor-toolbar]{box-sizing:border-box;z-index:4;border-block-end:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));--tp-toolbar-padding:.375rem;--tp-toolbar-size:auto;--tp-icon-button-size:2rem;flex-wrap:wrap;min-inline-size:0;max-inline-size:100%;position:static;overflow-x:auto}tp-spreadsheet-editor [data-tp-spreadsheet-editor-separator]{background:color-mix(in srgb, CanvasText 22%, Canvas);align-self:stretch;inline-size:1px;margin-inline:.125rem}tp-spreadsheet-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-spreadsheet-editor>tp-toolbar>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-spreadsheet-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start-color:color-mix(in srgb, CanvasText 22%, Canvas)}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search]{align-items:center;display:inline-flex}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search][hidden]{display:none}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search] input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);min-block-size:2rem;inline-size:10rem;font:inherit;padding-inline:.45rem}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar]{grid-template-columns:max-content 4rem minmax(0,1fr);align-items:center;gap:.25rem;padding:.5rem;display:grid}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] output,tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);min-block-size:2rem;font:inherit;padding:.3rem .5rem}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] output{background:var(--tp-neutral-fill-softer);font-weight:var(--tp-font-weight-bold);place-items:center;display:grid}tp-spreadsheet-editor [data-tp-spreadsheet-editor-viewport]{max-block-size:32rem;overflow:auto}tp-spreadsheet-editor>[data-tp-spreadsheet-editor-viewport]>table{max-inline-size:none;border-spacing:0;table-layout:fixed;max-width:none;display:table;overflow:visible}tp-spreadsheet-editor th{z-index:1;border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-neutral-fill-softer);min-inline-size:3rem;font-size:.8rem;position:sticky}tp-spreadsheet-editor thead th{inset-block-start:0}tp-spreadsheet-editor tbody th{inset-inline-start:0}tp-spreadsheet-editor td{border:1px solid var(--tp-neutral-stroke-soft);min-inline-size:0;padding:0}tp-spreadsheet-editor td input{box-sizing:border-box;block-size:2rem;inline-size:100%;min-inline-size:0;color:inherit;font:inherit;background:0 0;border:0;padding:.25rem .4rem}tp-spreadsheet-editor td input:focus{outline:2px solid var(--tp-brand-stroke);outline-offset:-2px}tp-spreadsheet-editor td input[data-style~=bold]{font-weight:var(--tp-font-weight-bold,700)}tp-spreadsheet-editor td input[data-style~=italic]{font-style:italic}tp-spreadsheet-editor td input[data-style~=underline]{text-decoration-line:underline}tp-spreadsheet-editor td input[data-style~=strikethrough]{text-decoration-line:line-through}tp-spreadsheet-editor td input[data-style~=underline][data-style~=strikethrough]{text-decoration-line:underline line-through}tp-spreadsheet-editor td input[data-search-match]{background:color-mix(in srgb, var(--tp-brand-fill,#88b1a1) 30%, transparent)}tp-spreadsheet-editor[data-tp-fullscreen-target]:fullscreen{box-sizing:border-box;grid-template-rows:max-content max-content minmax(0,1fr);align-content:start;block-size:100%;inline-size:100%}tp-spreadsheet-editor[data-tp-fullscreen-target]:fullscreen [data-tp-spreadsheet-editor-viewport]{min-block-size:0;max-block-size:none}@media (width<=40rem){tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar]{grid-template-columns:4rem minmax(0,1fr)}tp-spreadsheet-editor tp-formula-picker{grid-column:1/-1}}tp-spreadsheet-editor td input[data-selected]{background:var(--tp-brand-fill-softer,color-mix(in srgb, Highlight 18%, transparent));box-shadow:inset 0 0 0 1px var(--tp-brand-stroke,Highlight)}tp-spreadsheet-editor [data-column-resize]{cursor:col-resize;touch-action:none;-webkit-user-select:none;user-select:none;z-index:2;inline-size:8px;position:absolute;inset-block:0;inset-inline-end:-3px}tp-spreadsheet-editor [data-column-resize]:hover,tp-spreadsheet-editor [data-column-resize]:focus-visible{background:var(--tp-brand-stroke,Highlight);outline:none}", Nh = t;
function Ph(e) {
	let t = [[]], n = "", r = !1;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i] ?? "";
		r ? a === "\"" && e[i + 1] === "\"" ? (n += "\"", i += 1) : a === "\"" ? r = !1 : n += a : a === "\"" ? r = !0 : a === "," ? (t.at(-1)?.push(n), n = "") : a === "\n" ? (t.at(-1)?.push(n), t.push([]), n = "") : a !== "\r" && (n += a);
	}
	return t.at(-1)?.push(n), t.length > 1 && t.at(-1)?.length === 1 && t.at(-1)?.[0] === "" && t.pop(), t;
}
function Fh(e) {
	return e.map((e) => e.map((e) => {
		let t = String(e ?? "");
		return /[",\r\n]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
	}).join(",")).join("\r\n");
}
function Ih(e) {
	let t = e + 1, n = "";
	for (; t > 0;) --t, n = String.fromCharCode(65 + t % 26) + n, t = Math.floor(t / 26);
	return n;
}
function Lh(e) {
	let t = e.toUpperCase().match(/^\$?([A-Z]+)\$?([1-9]\d*)$/);
	if (t === null || t[1] === void 0 || t[2] === void 0) return null;
	let n = 0;
	for (let e of t[1]) n = n * 26 + e.charCodeAt(0) - 64;
	return [Number(t[2]) - 1, n - 1];
}
function Rh(e, t, n) {
	return e.startsWith("=") ? e.replace(/"(?:[^"]|"")*"|[A-Z_$][A-Z0-9_.$]*/gi, (r, i) => {
		if (r.startsWith("\"") || /[A-Z0-9_.$]/i.test(e[i - 1] ?? "") || /^\s*\(/.test(e.slice(i + r.length))) return r;
		let a = r.match(/^(\$?)([A-Z]+)(\$?)([1-9]\d*)$/i), o = Lh(r);
		if (!a || !o) return r;
		let s = o[0] + (a[3] ? 0 : t), c = o[1] + (a[1] ? 0 : n);
		return s < 0 || c < 0 ? "#REF!" : `${a[1]}${Ih(c)}${a[3]}${s + 1}`;
	}) : e;
}
function zh(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e.slice(n);
		if (r.startsWith("#REF!")) throw Error("#REF!");
		let i = r.match(/^\s+/);
		if (i !== null) {
			n += i[0].length;
			continue;
		}
		let a = r.match(/^"(?:[^"]|"")*"/);
		if (a !== null) {
			t.push({
				type: "string",
				value: a[0].slice(1, -1).replaceAll("\"\"", "\"")
			}), n += a[0].length;
			continue;
		}
		let o = r.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?/i);
		if (o !== null) {
			t.push({
				type: "number",
				value: o[0]
			}), n += o[0].length;
			continue;
		}
		let s = r.match(/^[A-Z_$][A-Z0-9_.$]*/i);
		if (s !== null) {
			t.push({
				type: "identifier",
				value: s[0]
			}), n += s[0].length;
			continue;
		}
		let c = r.match(/^(?:<=|>=|<>|=|<|>|\+|-|\*|\/|\^|&)/);
		if (c !== null) {
			t.push({
				type: "operator",
				value: c[0]
			}), n += c[0].length;
			continue;
		}
		if ("(),;:".includes(e[n] ?? "")) {
			t.push({
				type: "punctuation",
				value: e[n] ?? ""
			}), n += 1;
			continue;
		}
		throw Error(`#ERROR! Unexpected ${e[n] ?? ""}`);
	}
	return t;
}
var Bh = class {
	tokens;
	resolveCell;
	resolveRange;
	index = 0;
	constructor(e, t, n) {
		this.tokens = e, this.resolveCell = t, this.resolveRange = n;
	}
	parse() {
		let e = this.comparison();
		if (this.peek() !== void 0) throw Error("#ERROR! Invalid formula");
		return e;
	}
	comparison() {
		let e = this.concatenation();
		for (; [
			"=",
			"<>",
			"<",
			">",
			"<=",
			">="
		].includes(this.peek()?.value ?? "");) {
			let t = this.next()?.value, n = this.concatenation();
			e = t === "=" ? e === n : t === "<>" ? e !== n : t === "<" ? e < n : t === ">" ? e > n : t === "<=" ? e <= n : e >= n;
		}
		return e;
	}
	concatenation() {
		let e = this.addition();
		for (; this.peek()?.value === "&";) this.next(), e = `${String(e)}${String(this.addition())}`;
		return e;
	}
	addition() {
		let e = this.multiplication();
		for (; this.peek()?.value === "+" || this.peek()?.value === "-";) {
			let t = this.next()?.value, n = Number(this.multiplication());
			e = t === "+" ? Number(e) + n : Number(e) - n;
		}
		return e;
	}
	multiplication() {
		let e = this.power();
		for (; this.peek()?.value === "*" || this.peek()?.value === "/";) {
			let t = this.next()?.value, n = Number(this.power());
			e = t === "*" ? Number(e) * n : Number(e) / n;
		}
		return e;
	}
	power() {
		let e = this.unary();
		return this.peek()?.value === "^" && (this.next(), e = Number(e) ** Number(this.power())), e;
	}
	unary() {
		return this.peek()?.value === "+" ? (this.next(), Number(this.unary())) : this.peek()?.value === "-" ? (this.next(), -Number(this.unary())) : this.primary();
	}
	primary() {
		let e = this.next();
		if (e === void 0) throw Error("#ERROR! Missing value");
		if (e.type === "number") return Number(e.value);
		if (e.type === "string") return e.value;
		if (e.value === "(") {
			let e = this.comparison();
			return this.expect(")"), e;
		}
		if (e.type !== "identifier") throw Error("#ERROR! Invalid value");
		let t = e.value.toUpperCase();
		if (t === "TRUE") return !0;
		if (t === "FALSE") return !1;
		if (this.peek()?.value === "(") {
			this.next();
			let e = [];
			for (; this.peek()?.value !== ")" && (e.push(this.comparison()), this.peek()?.value === "," || this.peek()?.value === ";");) this.next();
			this.expect(")");
			let n = Nh[t];
			if (typeof n != "function") throw Error("#NAME?");
			let r = n(...e);
			if (r instanceof Error) throw r;
			return r;
		}
		if (Lh(t) === null) throw Error("#NAME?");
		if (this.peek()?.value === ":") {
			this.next();
			let e = this.next();
			if (e?.type !== "identifier" || Lh(e.value) === null) throw Error("#REF!");
			return this.resolveRange(t, e.value);
		}
		return this.resolveCell(t);
	}
	peek() {
		return this.tokens[this.index];
	}
	next() {
		let e = this.tokens[this.index];
		return this.index += 1, e;
	}
	expect(e) {
		if (this.next()?.value !== e) throw Error(`#ERROR! Expected ${e}`);
	}
}, Vh = class t extends e {
	static styleId = "tp-spreadsheet-editor-styles";
	static nextId = 0;
	static copiedCell = null;
	data = [];
	formats = /* @__PURE__ */ new Map();
	cellStyles = /* @__PURE__ */ new Map();
	undoStack = [];
	redoStack = [];
	colorPreset = "tp-default";
	themeMode = "auto";
	formulaInput = null;
	nameOutput = null;
	activeReference = "A1";
	columnWidths = /* @__PURE__ */ new Map();
	selectionAnchor = "A1";
	sourceRequest = null;
	static get observedAttributes() {
		return [
			"rows",
			"columns",
			"value",
			"src"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get rows() {
		let e = Number(this.getAttribute("rows") ?? "20");
		return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 20;
	}
	set rows(e) {
		this.setAttribute("rows", String(Math.max(1, Math.floor(e))));
	}
	get columns() {
		let e = Number(this.getAttribute("columns") ?? "10");
		return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 10;
	}
	set columns(e) {
		this.setAttribute("columns", String(Math.max(1, Math.floor(e))));
	}
	get value() {
		return JSON.stringify(this.data);
	}
	set value(e) {
		this.setAttribute("value", e);
	}
	getData() {
		return this.data.map((e) => [...e]);
	}
	setData(e) {
		let t = Math.max(1, e.length), n = Math.max(1, ...e.map((e) => e.length));
		this.setAttribute("rows", String(t)), this.setAttribute("columns", String(n)), this.data = Array.from({ length: t }, (t, r) => Array.from({ length: n }, (t, n) => String(e[r]?.[n] ?? ""))), this.setAttribute("value", JSON.stringify(this.data));
	}
	async importFile(e) {
		this.sourceRequest?.abort(), this.applyImport(e, await this.parseFile(e));
	}
	async parseFile(e) {
		let t = e.name.split(".").at(-1)?.toLowerCase(), n;
		if (t === "csv") n = Ph(await e.text());
		else if (t === "json") {
			let t = JSON.parse(await e.text());
			n = typeof t == "object" && t && "data" in t ? t.data : t;
		} else if (t === "xlsx") {
			let t = ah(await e.arrayBuffer(), {
				type: "array",
				cellFormula: !0
			}), r = t.SheetNames[0];
			if (r === void 0) throw Error("The XLSX workbook contains no worksheet.");
			let i = t.Sheets[r];
			if (i === void 0) throw Error("The XLSX worksheet cannot be read.");
			n = jh.sheet_to_json(i, {
				header: 1,
				raw: !1,
				defval: ""
			}).map((e, t) => e.map((e, n) => {
				let r = i[jh.encode_cell({
					r: t,
					c: n
				})];
				return r?.f === void 0 ? e : `=${r.f}`;
			}));
		} else throw Error("Supported import formats are CSV, JSON and XLSX.");
		if (!Array.isArray(n) || n.some((e) => !Array.isArray(e))) throw Error("The imported data must be a two-dimensional array.");
		return n;
	}
	applyImport(e, t) {
		let n = e.name.split(".").at(-1)?.toLowerCase();
		this.rememberState(), this.setData(t), this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-import", {
			bubbles: !0,
			composed: !0,
			detail: {
				format: n,
				file: e
			}
		}));
	}
	exportFile(e, t = "spreadsheet", n = "formulas") {
		let r = n === "values" ? this.data.map((e, t) => e.map((e, n) => this.evaluate(`${Ih(n)}${t + 1}`, /* @__PURE__ */ new Set()))) : this.data;
		if (e === "xlsx") {
			let e = {};
			r.forEach((t, r) => {
				t.forEach((t, i) => {
					let a = jh.encode_cell({
						r,
						c: i
					});
					n === "formulas" && typeof t == "string" && t.startsWith("=") ? e[a] = {
						t: "n",
						f: t.slice(1)
					} : t instanceof Date ? e[a] = {
						t: "d",
						v: t
					} : typeof t == "boolean" ? e[a] = {
						t: "b",
						v: t
					} : t !== "" && Number.isFinite(Number(t)) ? e[a] = {
						t: "n",
						v: Number(t)
					} : e[a] = {
						t: "s",
						v: String(t)
					};
				});
			}), e["!ref"] = jh.encode_range({
				s: {
					r: 0,
					c: 0
				},
				e: {
					r: this.rows - 1,
					c: this.columns - 1
				}
			});
			let i = jh.book_new();
			jh.book_append_sheet(i, e, "Sheet1"), dh(i, `${t}.xlsx`);
		} else {
			let n = e === "csv" ? Fh(r.map((e) => e.map((e) => e instanceof Date ? e.toISOString() : e))) : JSON.stringify(r, null, 2), i = new Blob([n], { type: e === "csv" ? "text/csv;charset=utf-8" : "application/json" }), a = URL.createObjectURL(i), o = document.createElement("a");
			o.href = a, o.download = `${t}.${e}`, o.click(), URL.revokeObjectURL(a);
		}
		this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-export", {
			bubbles: !0,
			composed: !0,
			detail: {
				format: e,
				filename: `${t}.${e}`
			}
		}));
	}
	insertRow(e = "after") {
		let t = Lh(this.activeReference);
		if (t === null) return;
		let n = t[0] + +(e === "after");
		this.rememberState();
		let r = this.getData();
		r.splice(n, 0, Array.from({ length: this.columns }, () => "")), this.activeReference = `${Ih(t[1])}${String(n + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(r), this.emitStructureChange("insert-row", n);
	}
	deleteRow() {
		if (this.rows <= 1) return;
		let e = Lh(this.activeReference);
		if (e === null) return;
		this.rememberState();
		let t = this.getData();
		t.splice(e[0], 1);
		let n = Math.min(e[0], t.length - 1);
		this.activeReference = `${Ih(e[1])}${String(n + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(t), this.emitStructureChange("delete-row", e[0]);
	}
	insertColumn(e = "after") {
		let t = Lh(this.activeReference);
		if (t === null) return;
		let n = t[1] + +(e === "after");
		this.rememberState();
		let r = this.getData();
		for (let e of r) e.splice(n, 0, "");
		this.activeReference = `${Ih(n)}${String(t[0] + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(r), this.emitStructureChange("insert-column", n);
	}
	deleteColumn() {
		if (this.columns <= 1) return;
		let e = Lh(this.activeReference);
		if (e === null) return;
		this.rememberState();
		let t = this.getData();
		for (let n of t) n.splice(e[1], 1);
		let n = Math.min(e[1], this.columns - 2);
		this.activeReference = `${Ih(n)}${String(e[0] + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(t), this.emitStructureChange("delete-column", e[1]);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureId(), this.ensureGlobalStyle(t.styleId, Mh), this.readValue(), this.render(), this.loadSource();
	}
	disconnectedCallback() {
		this.sourceRequest?.abort();
	}
	async loadSource() {
		this.sourceRequest?.abort();
		let e = this.src.trim();
		if (!e) return;
		let t = new AbortController();
		this.sourceRequest = t;
		try {
			let n = new URL(e, this.baseURI), r = await fetch(n.href, { signal: t.signal });
			if (!r.ok) throw Error(`Unable to load spreadsheet (${r.status}).`);
			let i = new File([await r.arrayBuffer()], decodeURIComponent(n.pathname.split("/").at(-1) ?? "")), a = await this.parseFile(i);
			!t.signal.aborted && this.isConnected && this.applyImport(i, a);
		} catch (n) {
			t.signal.aborted || this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-error", {
				bubbles: !0,
				composed: !0,
				detail: {
					src: e,
					error: n
				}
			}));
		}
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) {
			if (e === "src") {
				this.isConnected && this.loadSource();
				return;
			}
			this.isConnected && (this.ensureId(), this.readValue(), this.render());
		}
	}
	ensureId() {
		this.dataset.tpColorScope = "", this.dataset.tpThemeScope = "", this.id === "" && (t.nextId += 1, this.id = `tp-spreadsheet-editor-${String(t.nextId)}`);
	}
	readValue() {
		let e = [];
		try {
			e = JSON.parse(this.getAttribute("value") ?? "[]");
		} catch {
			e = [];
		}
		let t = Array.isArray(e) ? e : [];
		this.data = Array.from({ length: this.rows }, (e, n) => Array.from({ length: this.columns }, (e, r) => {
			let i = t[n];
			return String(Array.isArray(i) ? i[r] ?? "" : "");
		}));
	}
	render() {
		this.colorPreset = this.querySelector("tp-color")?.getAttribute("preset") ?? this.colorPreset, this.themeMode = this.querySelector("tp-theme")?.getAttribute("mode") ?? this.themeMode;
		let e = this.createToolbar(), t = document.createElement("div");
		t.dataset.tpSpreadsheetEditorFormulaBar = "";
		let n = document.createElement("tp-formula-picker");
		n.addEventListener("tp-formula-picker-select", (e) => {
			let t = e.detail, n = t.formula;
			this.formulaInput !== null && (this.formulaInput.value = n, this.formulaInput.focus(), this.formulaInput.setSelectionRange(t.selectionStart, t.selectionEnd));
		});
		let r = document.createElement("output");
		r.textContent = this.activeReference;
		let i = document.createElement("input");
		i.type = "text", i.setAttribute("aria-label", "Cell value or formula"), i.addEventListener("change", () => this.commit(this.activeReference, i.value)), t.append(n, r, i);
		let a = document.createElement("table"), o = document.createElement("colgroup"), s = document.createElement("col");
		s.style.width = "48px", o.append(s);
		for (let e = 0; e < this.columns; e++) {
			let t = document.createElement("col");
			t.style.width = `${this.columnWidths.get(e) ?? 112}px`, o.append(t);
		}
		a.append(o);
		let c = 48 + Array.from({ length: this.columns }, (e, t) => this.columnWidths.get(t) ?? 112).reduce((e, t) => e + t, 0), l = () => {
			a.style.width = `${c}px`;
		};
		l();
		let u = a.createTHead().insertRow();
		u.append(document.createElement("th"));
		for (let e = 0; e < this.columns; e += 1) {
			let t = document.createElement("th");
			t.scope = "col", t.textContent = Ih(e);
			let n = document.createElement("span");
			n.dataset.columnResize = String(e), n.tabIndex = 0, n.setAttribute("role", "separator"), n.setAttribute("aria-orientation", "vertical"), n.setAttribute("aria-label", `Resize column ${Ih(e)}`), n.setAttribute("aria-valuemin", "48"), n.setAttribute("aria-valuenow", String(this.columnWidths.get(e) ?? 112));
			let r = (t) => {
				let r = Math.max(48, Math.round(t)), i = this.columnWidths.get(e) ?? 112;
				if (r === i) return;
				c += r - i, this.columnWidths.set(e, r);
				let a = o.children[e + 1];
				a.style.width = `${r}px`, n.setAttribute("aria-valuenow", String(r)), l();
			}, i = null, s = 0, d = null, f = () => {
				s = 0, d !== null && a.isConnected && r(d), d = null;
			};
			n.addEventListener("pointerdown", (t) => {
				t.button === 0 && (t.preventDefault(), i = {
					id: t.pointerId,
					x: t.clientX,
					width: this.columnWidths.get(e) ?? 112
				}, n.setPointerCapture(t.pointerId), n.focus());
			}), n.addEventListener("pointermove", (e) => {
				i?.id === e.pointerId && (d = i.width + e.clientX - i.x, s ||= requestAnimationFrame(f));
			});
			let p = () => {
				s && cancelAnimationFrame(s), f(), i = null;
			};
			n.addEventListener("pointerup", p), n.addEventListener("pointercancel", p), n.addEventListener("lostpointercapture", p), n.addEventListener("dblclick", () => r(112)), n.addEventListener("keydown", (t) => {
				t.key !== "ArrowLeft" && t.key !== "ArrowRight" || (t.preventDefault(), r((this.columnWidths.get(e) ?? 112) + (t.key === "ArrowRight" ? 8 : -8)));
			}), t.append(n), u.append(t);
		}
		let d = a.createTBody();
		for (let t = 0; t < this.rows; t += 1) {
			let n = d.insertRow(), r = document.createElement("th");
			r.scope = "row", r.textContent = String(t + 1), n.append(r);
			for (let r = 0; r < this.columns; r += 1) {
				let i = `${Ih(r)}${String(t + 1)}`, a = n.insertCell(), o = document.createElement("input");
				o.dataset.cell = i, o.dataset.format = this.formats.get(i) ?? "general", o.dataset.style = [...this.cellStyles.get(i) ?? []].join(" "), o.setAttribute("aria-label", i), o.value = this.displayValue(i), o.addEventListener("focus", () => {
					this.select(i, o.hasAttribute("data-selected"));
				}), o.addEventListener("pointerdown", (e) => {
					e.button === 0 && (e.shiftKey && e.preventDefault(), this.select(i, e.shiftKey));
				}), o.addEventListener("keydown", (t) => {
					if ((t.ctrlKey || t.metaKey) && !t.altKey && [
						"c",
						"x",
						"v"
					].includes(t.key.toLowerCase())) {
						t.preventDefault(), this.runToolbarCommand(t.key.toLowerCase() === "c" ? "copy" : t.key.toLowerCase() === "x" ? "cut" : "paste", e);
						return;
					}
					if (t.shiftKey && [
						"ArrowUp",
						"ArrowDown",
						"ArrowLeft",
						"ArrowRight"
					].includes(t.key)) {
						t.preventDefault();
						let [e, n] = Lh(this.activeReference) ?? [0, 0], r = Math.max(0, Math.min(this.rows - 1, e + (t.key === "ArrowDown" ? 1 : t.key === "ArrowUp" ? -1 : 0))), i = Math.max(0, Math.min(this.columns - 1, n + (t.key === "ArrowRight" ? 1 : t.key === "ArrowLeft" ? -1 : 0)));
						this.select(`${Ih(i)}${r + 1}`, !0);
					} else (t.key === "Delete" || t.key === "Backspace") && this.selectedReferences().length > 1 ? (t.preventDefault(), this.clearSelection()) : t.key === "Escape" && this.select(i);
				}), o.addEventListener("change", () => this.commit(i, o.value)), a.append(o);
			}
		}
		let f = document.createElement("div");
		f.dataset.tpSpreadsheetEditorViewport = "", f.append(a), this.replaceChildren(e, t, f), this.formulaInput = i, this.nameOutput = r, this.select(this.activeReference, !0);
	}
	createToolbar() {
		this.ensureId();
		let e = document.createElement("tp-toolbar");
		e.dataset.tpSpreadsheetEditorToolbar = "";
		let t = `${this.id}-files`, n = `${this.id}-format`, r = `${this.id}-cell-style`, i = `${this.id}-table`;
		e.innerHTML = `
      <tp-icon-button section="start" id="${t}" name="file" label="Files" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-file-dropdown anchor="#${t}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-file-action="import"><tp-icon name="file-import"></tp-icon><span>Import CSV, JSON or XLSX</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-file-action="csv" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export CSV — formulas</span></li>
          <li data-file-action="csv" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export CSV — values</span></li>
          <li data-file-action="json" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export JSON — formulas</span></li>
          <li data-file-action="json" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export JSON — values</span></li>
          <li data-file-action="xlsx" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — formulas</span></li>
          <li data-file-action="xlsx" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — values</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <input type="file" accept=".csv,.json,.xlsx,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-spreadsheet-file hidden />
      <tp-icon-button section="start" id="${n}" name="letter-f" label="Format" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-format-dropdown anchor="#${n}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-format="general">General</li><li data-format="number">Number</li>
          <li data-format="currency">Currency</li><li data-format="percent">Percent</li><li data-format="date">Date</li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${r}" name="format-text" label="Cell style" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-style-dropdown anchor="#${r}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-cell-style="bold"><tp-icon name="format-bold"></tp-icon><span>Bold</span></li>
          <li data-cell-style="italic"><tp-icon name="format-italic"></tp-icon><span>Italic</span></li>
          <li data-cell-style="underline"><tp-icon name="format-underline"></tp-icon><span>Underline</span></li>
          <li data-cell-style="strikethrough"><tp-icon name="format-strikethrough"></tp-icon><span>Strikethrough</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${i}" name="table" label="Table" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-table-dropdown anchor="#${i}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-table-action="insert-row-before"><tp-icon name="table-row-plus-before"></tp-icon><span>Insert row before</span></li>
          <li data-table-action="insert-row-after"><tp-icon name="table-row-plus-after"></tp-icon><span>Insert row after</span></li>
          <li data-table-action="insert-column-before"><tp-icon name="table-column-plus-before"></tp-icon><span>Insert column before</span></li>
          <li data-table-action="insert-column-after"><tp-icon name="table-column-plus-after"></tp-icon><span>Insert column after</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-table-action="delete-row"><tp-icon name="table-row-remove"></tp-icon><span>Delete row</span></li>
          <li data-table-action="delete-column"><tp-icon name="table-column-remove"></tp-icon><span>Delete column</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="close" label="Clear selected cells" data-command="clear-cells"></tp-icon-button>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="unformat"></tp-icon-button>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-spreadsheet-editor-search hidden><input type="search" aria-label="Search cells" /><tp-icon-button name="close" size="xs" label="Close search" data-command="close-search"></tp-icon-button></span>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}" preset="${this.colorPreset}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}" mode="${this.themeMode}"></tp-theme>
    `;
		let a = e.querySelector(`#${t}`), o = e.querySelector(`#${n}`), s = e.querySelector(`#${r}`), c = e.querySelector(`#${i}`), l = e.querySelector("[data-spreadsheet-file-dropdown]"), u = e.querySelector("[data-spreadsheet-format-dropdown]"), d = e.querySelector("[data-spreadsheet-style-dropdown]"), f = e.querySelector("[data-spreadsheet-table-dropdown]"), p = [
			l,
			u,
			d,
			f
		], m = (e, t) => {
			e?.addEventListener("click", (n) => {
				if (n.preventDefault(), n.stopPropagation(), t !== null) {
					if (!t.open) for (let e of p) e !== t && e?.hide();
					t.toggle(), e.setAttribute("aria-expanded", String(t.open));
				}
			}), t?.addEventListener("tp-dropdown-toggle", () => e?.setAttribute("aria-expanded", String(t.open)));
		};
		m(a, l), m(o, u), m(s, d), m(c, f), e.querySelector("tp-color")?.addEventListener("tp-color-change", (e) => {
			this.colorPreset = e.detail.preset;
		}), e.querySelector("tp-theme")?.addEventListener("tp-theme-change", (e) => {
			this.themeMode = e.detail.mode;
		});
		let h = e.querySelector("[data-spreadsheet-file]");
		return h?.addEventListener("change", () => {
			let e = h.files?.[0];
			e !== void 0 && this.importFile(e), h.value = "";
		}), e.addEventListener("tp-menu-item-select", (e) => {
			let t = e.detail?.item ?? e.target, n = t.closest("[data-file-action]")?.dataset.fileAction;
			n === "import" ? h?.click() : (n === "csv" || n === "json" || n === "xlsx") && this.exportFile(n, "spreadsheet", t.closest("[data-export-mode]")?.dataset.exportMode === "values" ? "values" : "formulas");
			let r = t.closest("[data-format]")?.dataset.format;
			r !== void 0 && this.applyFormat(r);
			let i = t.closest("[data-cell-style]")?.dataset.cellStyle;
			i !== void 0 && this.toggleCellStyle(i);
			let a = t.closest("[data-table-action]")?.dataset.tableAction;
			a === "insert-row-before" ? this.insertRow("before") : a === "insert-row-after" ? this.insertRow("after") : a === "insert-column-before" ? this.insertColumn("before") : a === "insert-column-after" ? this.insertColumn("after") : a === "delete-row" ? this.deleteRow() : a === "delete-column" && this.deleteColumn();
		}), e.addEventListener("click", (t) => {
			let n = t.target.closest("[data-command]")?.dataset.command;
			n !== void 0 && this.runToolbarCommand(n, e);
		}), e.querySelector("[type=\"search\"]")?.addEventListener("input", (e) => this.search(e.target.value)), e;
	}
	selectedReferences() {
		let [e, t] = Lh(this.activeReference) ?? [0, 0], [n, r] = Lh(this.selectionAnchor) ?? [e, t], i = [];
		for (let a = Math.min(e, n); a <= Math.min(this.rows - 1, Math.max(e, n)); a++) for (let e = Math.min(t, r); e <= Math.min(this.columns - 1, Math.max(t, r)); e++) i.push(`${Ih(e)}${a + 1}`);
		return i;
	}
	clearSelection() {
		let e = this.selectedReferences().filter((e) => {
			let [t, n] = Lh(e) ?? [0, 0];
			return (this.data[t]?.[n] ?? "") !== "";
		});
		if (e.length) {
			this.rememberState();
			for (let t of e) {
				let [e, n] = Lh(t) ?? [0, 0], r = this.data[e];
				r && (r[n] = "");
			}
			this.setAttribute("value", JSON.stringify(this.data)), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
			for (let t of e) this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-input", {
				bubbles: !0,
				composed: !0,
				detail: {
					cell: t,
					raw: "",
					value: ""
				}
			}));
		}
	}
	select(e, t = !1) {
		this.activeReference = e, t || (this.selectionAnchor = e);
		let n = new Set(this.selectedReferences());
		for (let e of this.querySelectorAll("[data-cell]")) e.toggleAttribute("data-selected", n.has(e.dataset.cell ?? ""));
		this.nameOutput !== null && (this.nameOutput.textContent = e);
		let r = Lh(e);
		r !== null && this.formulaInput !== null && (this.formulaInput.value = this.data[r[0]]?.[r[1]] ?? "");
	}
	commit(e, t) {
		let n = Lh(e);
		if (n === null) return;
		let [r, i] = n;
		this.data[r] !== void 0 && this.data[r][i] !== t && (this.rememberState(), this.data[r][i] = t, this.setAttribute("value", JSON.stringify(this.data)), this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-input", {
			bubbles: !0,
			composed: !0,
			detail: {
				cell: e,
				raw: t,
				value: this.evaluate(e, /* @__PURE__ */ new Set())
			}
		})));
	}
	displayValue(e) {
		let t = this.evaluate(e, /* @__PURE__ */ new Set()), n = this.formats.get(e) ?? "general";
		if (n === "number" && Number.isFinite(Number(t))) return Number(t).toLocaleString();
		if (n === "currency" && Number.isFinite(Number(t))) return Number(t).toLocaleString(void 0, {
			style: "currency",
			currency: "EUR"
		});
		if (n === "percent" && Number.isFinite(Number(t))) return Number(t).toLocaleString(void 0, { style: "percent" });
		if (n === "date") {
			let e = t instanceof Date ? t : new Date(String(t));
			if (!Number.isNaN(e.getTime())) return e.toLocaleDateString();
		}
		return t instanceof Date ? t.toLocaleDateString() : String(t);
	}
	rememberState() {
		this.undoStack.push(this.getData()), this.undoStack.length > 100 && this.undoStack.shift(), this.redoStack.length = 0;
	}
	restoreState(e) {
		this.setAttribute("rows", String(Math.max(1, e.length))), this.setAttribute("columns", String(Math.max(1, ...e.map((e) => e.length)))), this.setAttribute("value", JSON.stringify(e));
	}
	emitStructureChange(e, t) {
		this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-structure", {
			bubbles: !0,
			composed: !0,
			detail: {
				action: e,
				index: t,
				rows: this.rows,
				columns: this.columns
			}
		}));
	}
	undo() {
		let e = this.undoStack.pop();
		e !== void 0 && (this.redoStack.push(this.getData()), this.restoreState(e));
	}
	redo() {
		let e = this.redoStack.pop();
		e !== void 0 && (this.undoStack.push(this.getData()), this.restoreState(e));
	}
	applyFormat(e) {
		e === "general" ? this.formats.delete(this.activeReference) : this.formats.set(this.activeReference, e), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	toggleCellStyle(e) {
		let t = new Set(this.cellStyles.get(this.activeReference) ?? []);
		t.has(e) ? t.delete(e) : t.add(e), t.size === 0 ? this.cellStyles.delete(this.activeReference) : this.cellStyles.set(this.activeReference, t), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	clearActiveFormatting() {
		this.formats.delete(this.activeReference), this.cellStyles.delete(this.activeReference), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	async runToolbarCommand(e, n) {
		if (e === "clear-cells") {
			this.clearSelection();
			return;
		}
		if (e === "undo") {
			this.undo();
			return;
		}
		if (e === "redo") {
			this.redo();
			return;
		}
		if (e === "unformat") {
			this.clearActiveFormatting();
			return;
		}
		let r = n.querySelector("[data-tp-spreadsheet-editor-search]"), i = r?.querySelector("input");
		if (e === "search") {
			r != null && (r.hidden = !1), i?.focus();
			return;
		}
		if (e === "close-search") {
			i != null && (i.value = ""), this.search(""), r != null && (r.hidden = !0);
			return;
		}
		let a = Lh(this.activeReference);
		if (a === null) return;
		let o = this.data[a[0]]?.[a[1]] ?? "", s = this.activeReference;
		try {
			if (e === "copy" || e === "cut") await navigator.clipboard.writeText(o), t.copiedCell = {
				raw: o,
				row: a[0],
				column: a[1],
				cut: e === "cut"
			}, e === "cut" && this.commit(s, "");
			else if (e === "paste") {
				let e = await navigator.clipboard.readText(), n = t.copiedCell, r = n && !n.cut && n.raw === e ? Rh(e, a[0] - n.row, a[1] - n.column) : e;
				n && n.raw !== e && (t.copiedCell = null), this.commit(s, r);
			}
		} catch {
			this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-clipboard-error", {
				bubbles: !0,
				composed: !0,
				detail: { command: e }
			}));
		}
	}
	search(e) {
		let t = e.trim().toLocaleLowerCase();
		for (let e of this.querySelectorAll("[data-cell]")) {
			let n = t !== "" && e.value.toLocaleLowerCase().includes(t);
			e.toggleAttribute("data-search-match", n);
		}
	}
	evaluate(e, t) {
		let n = Lh(e);
		if (n === null) return "#REF!";
		if (e = `${Ih(n[1])}${n[0] + 1}`, t.has(e)) return "#CYCLE!";
		let r = this.data[n[0]]?.[n[1]] ?? "";
		if (!r.startsWith("=")) return r !== "" && Number.isFinite(Number(r)) ? Number(r) : r;
		t.add(e);
		try {
			return new Bh(zh(r.slice(1)), (e) => this.evaluate(e.toUpperCase(), new Set(t)), (e, n) => this.range(e, n, t)).parse();
		} catch (e) {
			return e instanceof Error && e.message.startsWith("#") ? e.message : "#ERROR!";
		}
	}
	range(e, t, n) {
		let r = Lh(e), i = Lh(t);
		if (r === null || i === null) return [["#REF!"]];
		let a = [];
		for (let e = Math.min(r[0], i[0]); e <= Math.max(r[0], i[0]); e += 1) {
			let t = [];
			for (let a = Math.min(r[1], i[1]); a <= Math.max(r[1], i[1]); a += 1) t.push(this.evaluate(`${Ih(a)}${String(e + 1)}`, new Set(n)));
			a.push(t);
		}
		return a;
	}
};
customElements.get("tp-spreadsheet-editor") || customElements.define("tp-spreadsheet-editor", Vh);
//#endregion
export { Fh as a, Ph as i, Lh as n, Rh as o, Ih as r, Vh as t };

//# sourceMappingURL=spreadsheet-editor.js.map