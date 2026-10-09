import { a as e, n as t, r as n, t as r } from "../../rolldown-runtime.js";
//#region ../../../../../../@tp/tp-markdown/dist/chunks/rolldown-runtime.js
var i = Object.create, a = Object.defineProperty, o = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, c = Object.getPrototypeOf, l = Object.prototype.hasOwnProperty, u = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, d = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), f = (e, t) => {
	let n = {};
	for (var r in e) a(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || a(n, Symbol.toStringTag, { value: "Module" }), n;
}, p = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = s(t), c = 0, u = i.length, d; c < u; c++) d = i[c], !l.call(e, d) && d !== n && a(e, d, {
		get: ((e) => t[e]).bind(null, d),
		enumerable: !(r = o(t, d)) || r.enumerable
	});
	return e;
}, m = (e, t, n) => (n = e == null ? {} : i(c(e)), p(t || !e || !e.__esModule ? a(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), h = (e) => l.call(e, "module.exports") ? e["module.exports"] : p(a({}, "__esModule", { value: !0 }), e), g = {};
function _(e) {
	let t = g[e];
	if (t) return t;
	t = g[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		t.push(n);
	}
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		t[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
	}
	return t;
}
function v(e, t) {
	typeof t != "string" && (t = v.defaultChars);
	let n = _(t);
	return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
		let t = "";
		for (let r = 0, i = e.length; r < i; r += 3) {
			let a = parseInt(e.slice(r + 1, r + 3), 16);
			if (a < 128) {
				t += n[a];
				continue;
			}
			if ((a & 224) == 192 && r + 3 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16);
				if ((n & 192) == 128) {
					let e = a << 6 & 1984 | n & 63;
					e < 128 ? t += "��" : t += String.fromCharCode(e), r += 3;
					continue;
				}
			}
			if ((a & 240) == 224 && r + 6 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16);
				if ((n & 192) == 128 && (i & 192) == 128) {
					let e = a << 12 & 61440 | n << 6 & 4032 | i & 63;
					e < 2048 || e >= 55296 && e <= 57343 ? t += "���" : t += String.fromCharCode(e), r += 6;
					continue;
				}
			}
			if ((a & 248) == 240 && r + 9 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16), o = parseInt(e.slice(r + 10, r + 12), 16);
				if ((n & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
					let e = a << 18 & 1835008 | n << 12 & 258048 | i << 6 & 4032 | o & 63;
					e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), r += 9;
					continue;
				}
			}
			t += "�";
		}
		return t;
	});
}
v.defaultChars = ";/?:@&=+$,#", v.componentChars = "";
var y = {};
function b(e) {
	let t = y[e];
	if (t) return t;
	t = y[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function x(e, t, n) {
	typeof t != "string" && (n = t, t = x.defaultChars), n === void 0 && (n = !0);
	let r = b(t), i = "";
	for (let t = 0, a = e.length; t < a; t++) {
		let o = e.charCodeAt(t);
		if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
			i += e.slice(t, t + 3), t += 2;
			continue;
		}
		if (o < 128) {
			i += r[o];
			continue;
		}
		if (o >= 55296 && o <= 57343) {
			if (o >= 55296 && o <= 56319 && t + 1 < a) {
				let n = e.charCodeAt(t + 1);
				if (n >= 56320 && n <= 57343) {
					i += encodeURIComponent(e[t] + e[t + 1]), t++;
					continue;
				}
			}
			i += "%EF%BF%BD";
			continue;
		}
		i += encodeURIComponent(e[t]);
	}
	return i;
}
x.defaultChars = ";/?:@&=+$,-_.!~*'()#", x.componentChars = "-_.!~*'()";
function S(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
function C() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var w = /^([a-z0-9.+-]+:)/i, T = /:[0-9]*$/, E = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, ee = [
	"%",
	"/",
	"?",
	";",
	"#",
	"'",
	"{",
	"}",
	"|",
	"\\",
	"^",
	"`",
	"<",
	">",
	"\"",
	"`",
	" ",
	"\r",
	"\n",
	"	"
], te = [
	"/",
	"?",
	"#"
], ne = 255, re = /^[+a-z0-9A-Z_-]{0,63}$/, D = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, ie = {
	javascript: !0,
	"javascript:": !0
}, ae = {
	http: !0,
	https: !0,
	ftp: !0,
	gopher: !0,
	file: !0,
	"http:": !0,
	"https:": !0,
	"ftp:": !0,
	"gopher:": !0,
	"file:": !0
};
function oe(e, t) {
	if (e && e instanceof C) return e;
	let n = new C();
	return n.parse(e, t), n;
}
C.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = E.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = w.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && ie[o]) && (a = a.substr(2), this.slashes = !0)), !ie[o] && (i || o && !ae[o])) {
		let e = -1;
		for (let t = 0; t < te.length; t++) r = a.indexOf(te[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < ee.length; t++) r = a.indexOf(ee[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(re)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(re)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(D);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > ne && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), ae[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, C.prototype.parseHost = function(e) {
	let t = T.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
var se = /* @__PURE__ */ f({
	decode: () => v,
	encode: () => x,
	format: () => S,
	parse: () => oe
}), O = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ce = /[\0-\x1F\x7F-\x9F]/, le = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, k = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, A = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, ue = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, j = /* @__PURE__ */ f({
	Any: () => O,
	Cc: () => ce,
	Cf: () => le,
	P: () => k,
	S: () => A,
	Z: () => ue
}), de = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((e) => e.charCodeAt(0))), fe = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((e) => e.charCodeAt(0))), pe = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]), me = String.fromCodePoint ?? function(e) {
	let t = "";
	return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
};
function he(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : pe.get(e) ?? e;
}
var M;
(function(e) {
	e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})(M ||= {});
var ge = 32, _e;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(_e ||= {});
function ve(e) {
	return e >= M.ZERO && e <= M.NINE;
}
function N(e) {
	return e >= M.UPPER_A && e <= M.UPPER_F || e >= M.LOWER_A && e <= M.LOWER_F;
}
function P(e) {
	return e >= M.UPPER_A && e <= M.UPPER_Z || e >= M.LOWER_A && e <= M.LOWER_Z || ve(e);
}
function F(e) {
	return e === M.EQUALS || P(e);
}
var I;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(I ||= {});
var L;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(L ||= {});
var ye = class {
	constructor(e, t, n) {
		this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = I.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = L.Strict;
	}
	startEntity(e) {
		this.decodeMode = e, this.state = I.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
	}
	write(e, t) {
		switch (this.state) {
			case I.EntityStart: return e.charCodeAt(t) === M.NUM ? (this.state = I.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = I.NamedEntity, this.stateNamedEntity(e, t));
			case I.NumericStart: return this.stateNumericStart(e, t);
			case I.NumericDecimal: return this.stateNumericDecimal(e, t);
			case I.NumericHex: return this.stateNumericHex(e, t);
			case I.NamedEntity: return this.stateNamedEntity(e, t);
		}
	}
	stateNumericStart(e, t) {
		return t >= e.length ? -1 : (e.charCodeAt(t) | ge) === M.LOWER_X ? (this.state = I.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = I.NumericDecimal, this.stateNumericDecimal(e, t));
	}
	addToNumericResult(e, t, n, r) {
		if (t !== n) {
			let i = n - t;
			this.result = this.result * r ** +i + parseInt(e.substr(t, i), r), this.consumed += i;
		}
	}
	stateNumericHex(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (ve(r) || N(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
		}
		return this.addToNumericResult(e, n, t, 16), -1;
	}
	stateNumericDecimal(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (ve(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
		}
		return this.addToNumericResult(e, n, t, 10), -1;
	}
	emitNumericEntity(e, t) {
		var n;
		if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
		if (e === M.SEMI) this.consumed += 1;
		else if (this.decodeMode === L.Strict) return 0;
		return this.emitCodePoint(he(this.result), this.consumed), this.errors && (e !== M.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
	}
	stateNamedEntity(e, t) {
		let { decodeTree: n } = this, r = n[this.treeIndex], i = (r & _e.VALUE_LENGTH) >> 14;
		for (; t < e.length; t++, this.excess++) {
			let a = e.charCodeAt(t);
			if (this.treeIndex = xe(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === L.Attribute && (i === 0 || F(a)) ? 0 : this.emitNotTerminatedNamedEntity();
			if (r = n[this.treeIndex], i = (r & _e.VALUE_LENGTH) >> 14, i !== 0) {
				if (a === M.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
				this.decodeMode !== L.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
			}
		}
		return -1;
	}
	emitNotTerminatedNamedEntity() {
		var e;
		let { result: t, decodeTree: n } = this, r = (n[t] & _e.VALUE_LENGTH) >> 14;
		return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
	}
	emitNamedEntityData(e, t, n) {
		let { decodeTree: r } = this;
		return this.emitCodePoint(t === 1 ? r[e] & ~_e.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
	}
	end() {
		var e;
		switch (this.state) {
			case I.NamedEntity: return this.result !== 0 && (this.decodeMode !== L.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case I.NumericDecimal: return this.emitNumericEntity(0, 2);
			case I.NumericHex: return this.emitNumericEntity(0, 3);
			case I.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			case I.EntityStart: return 0;
		}
	}
};
function be(e) {
	let t = "", n = new ye(e, (e) => t += me(e));
	return function(e, r) {
		let i = 0, a = 0;
		for (; (a = e.indexOf("&", a)) >= 0;) {
			t += e.slice(i, a), n.startEntity(r);
			let o = n.write(e, a + 1);
			if (o < 0) {
				i = a + n.end();
				break;
			}
			i = a + o, a = o === 0 ? i + 1 : i;
		}
		let o = t + e.slice(i);
		return t = "", o;
	};
}
function xe(e, t, n, r) {
	let i = (t & _e.BRANCH_LENGTH) >> 7, a = t & _e.JUMP_TABLE;
	if (i === 0) return a !== 0 && r === a ? n : -1;
	if (a) {
		let t = r - a;
		return t < 0 || t >= i ? -1 : e[n + t] - 1;
	}
	let o = n, s = o + i - 1;
	for (; o <= s;) {
		let t = o + s >>> 1, n = e[t];
		if (n < r) o = t + 1;
		else if (n > r) s = t - 1;
		else return e[t + i];
	}
	return -1;
}
var Se = be(de);
be(fe);
function Ce(e, t = L.Legacy) {
	return Se(e, t);
}
function we(e) {
	return Se(e, L.Strict);
}
var Te = /* @__PURE__ */ f({
	arrayReplaceAt: () => je,
	asciiTrim: () => Ze,
	assign: () => Ae,
	escapeHtml: () => R,
	escapeRE: () => We,
	fromCodePoint: () => Ne,
	has: () => ke,
	isMdAsciiPunct: () => Je,
	isPunctChar: () => Ke,
	isPunctCharCode: () => qe,
	isSpace: () => B,
	isString: () => De,
	isValidEntityCode: () => Me,
	isWhiteSpace: () => Ge,
	lib: () => Qe,
	normalizeReference: () => Ye,
	unescapeAll: () => ze,
	unescapeMd: () => Re
});
function Ee(e) {
	return Object.prototype.toString.call(e);
}
function De(e) {
	return Ee(e) === "[object String]";
}
var Oe = Object.prototype.hasOwnProperty;
function ke(e, t) {
	return Oe.call(e, t);
}
function Ae(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		if (t) {
			if (typeof t != "object") throw TypeError(t + "must be object");
			Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}
	}), e;
}
function je(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Me(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function Ne(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var Pe = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Fe = RegExp(Pe.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), Ie = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Le(e, t) {
	if (t.charCodeAt(0) === 35 && Ie.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return Me(n) ? Ne(n) : e;
	}
	let n = Ce(e);
	return n === e ? e : n;
}
function Re(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(Pe, "$1");
}
function ze(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(Fe, function(e, t, n) {
		return t || Le(e, n);
	});
}
var Be = /[&<>"]/, Ve = /[&<>"]/g, He = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Ue(e) {
	return He[e];
}
function R(e) {
	return Be.test(e) ? e.replace(Ve, Ue) : e;
}
var z = /[.?*+^$[\]\\(){}|-]/g;
function We(e) {
	return e.replace(z, "\\$&");
}
function B(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Ge(e) {
	if (e >= 8192 && e <= 8202) return !0;
	switch (e) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return !0;
	}
	return !1;
}
function Ke(e) {
	return k.test(e) || A.test(e);
}
function qe(e) {
	return Ke(Ne(e));
}
function Je(e) {
	switch (e) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Ye(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Xe(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Ze(e) {
	let t = 0;
	for (; t < e.length && Xe(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && Xe(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var Qe = {
	mdurl: se,
	ucmicro: j
};
function $e(e, t, n) {
	let r, i, a, o, s = e.posMax, c = e.pos;
	for (e.pos = t + 1, r = 1; e.pos < s;) {
		if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
			i = !0;
			break;
		}
		if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
			if (o === e.pos - 1) r++;
			else if (n) return e.pos = c, -1;
		}
	}
	let l = -1;
	return i && (l = e.pos), e.pos = c, l;
}
function et(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = ze(e.slice(t + 1, i)), a.ok = !0, a;
			if (r === 92 && i + 1 < n) {
				i += 2;
				continue;
			}
			i++;
		}
		return a;
	}
	let o = 0;
	for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
		if (r === 92 && i + 1 < n) {
			if (e.charCodeAt(i + 1) === 32) break;
			i += 2;
			continue;
		}
		if (r === 40 && (o++, o > 32)) return a;
		if (r === 41) {
			if (o === 0) break;
			o--;
		}
		i++;
	}
	return t === i || o !== 0 ? a : (a.str = ze(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function tt(e, t, n, r) {
	let i, a = t, o = {
		ok: !1,
		can_continue: !1,
		pos: 0,
		str: "",
		marker: 0
	};
	if (r) o.str = r.str, o.marker = r.marker;
	else {
		if (a >= n) return o;
		let r = e.charCodeAt(a);
		if (r !== 34 && r !== 39 && r !== 40) return o;
		t++, a++, r === 40 && (r = 41), o.marker = r;
	}
	for (; a < n;) {
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += ze(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += ze(e.slice(t, a)), o;
}
var nt = /* @__PURE__ */ f({
	parseLinkDestination: () => et,
	parseLinkLabel: () => $e,
	parseLinkTitle: () => tt
}), V = {};
V.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return "<code" + i.renderAttrs(a) + ">" + R(a.content) + "</code>";
}, V.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return "<pre" + i.renderAttrs(a) + "><code>" + R(e[t].content) + "</code></pre>\n";
}, V.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? ze(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || R(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, V.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, V.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, V.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, V.text = function(e, t) {
	return R(e[t].content);
}, V.html_block = function(e, t) {
	return e[t].content;
}, V.html_inline = function(e, t) {
	return e[t].content;
};
function rt() {
	this.rules = Ae({}, V);
}
rt.prototype.renderAttrs = function(e) {
	let t, n, r;
	if (!e.attrs) return "";
	for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + R(e.attrs[t][0]) + "=\"" + R(e.attrs[t][1]) + "\"";
	return r;
}, rt.prototype.renderToken = function(e, t, n) {
	let r = e[t], i = "";
	if (r.hidden) return "";
	r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
	let a = !1;
	if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
		let n = e[t + 1];
		(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
	}
	return i += a ? ">\n" : ">", i;
}, rt.prototype.renderInline = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
	}
	return r;
}, rt.prototype.renderInlineAsText = function(e, t, n) {
	let r = "";
	for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
		case "text":
			r += e[i].content;
			break;
		case "image":
			r += this.renderInlineAsText(e[i].children, t, n);
			break;
		case "html_inline":
		case "html_block":
			r += e[i].content;
			break;
		case "softbreak":
		case "hardbreak":
			r += "\n";
			break;
		default:
	}
	return r;
}, rt.prototype.render = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
	}
	return r;
};
function H() {
	this.__rules__ = [], this.__cache__ = null;
}
H.prototype.__find__ = function(e) {
	for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
	return -1;
}, H.prototype.__compile__ = function() {
	let e = this, t = [""];
	e.__rules__.forEach(function(e) {
		e.enabled && e.alt.forEach(function(e) {
			t.indexOf(e) < 0 && t.push(e);
		});
	}), e.__cache__ = {}, t.forEach(function(t) {
		e.__cache__[t] = [], e.__rules__.forEach(function(n) {
			n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));
		});
	});
}, H.prototype.at = function(e, t, n) {
	let r = this.__find__(e), i = n || {};
	if (r === -1) throw Error("Parser rule not found: " + e);
	this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
}, H.prototype.before = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, H.prototype.after = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i + 1, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, H.prototype.push = function(e, t, n) {
	let r = n || {};
	this.__rules__.push({
		name: e,
		enabled: !0,
		fn: t,
		alt: r.alt || []
	}), this.__cache__ = null;
}, H.prototype.enable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !0, n.push(e);
	}, this), this.__cache__ = null, n;
}, H.prototype.enableOnly = function(e, t) {
	Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
		e.enabled = !1;
	}), this.enable(e, t);
}, H.prototype.disable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !1, n.push(e);
	}, this), this.__cache__ = null, n;
}, H.prototype.getRules = function(e) {
	return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
};
function U(e, t, n) {
	this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
U.prototype.attrIndex = function(e) {
	if (!this.attrs) return -1;
	let t = this.attrs;
	for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
	return -1;
}, U.prototype.attrPush = function(e) {
	this.attrs ? this.attrs.push(e) : this.attrs = [e];
}, U.prototype.attrSet = function(e, t) {
	let n = this.attrIndex(e), r = [e, t];
	n < 0 ? this.attrPush(r) : this.attrs[n] = r;
}, U.prototype.attrGet = function(e) {
	let t = this.attrIndex(e), n = null;
	return t >= 0 && (n = this.attrs[t][1]), n;
}, U.prototype.attrJoin = function(e, t) {
	let n = this.attrIndex(e);
	n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
};
function it(e, t, n) {
	this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
}
it.prototype.Token = U;
var at = /\r\n?|\n/g, ot = /\0/g;
function st(e) {
	let t;
	t = e.src.replace(at, "\n"), t = t.replace(ot, "�"), e.src = t;
}
function ct(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function lt(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function ut(e) {
	return /^<a[>\s]/i.test(e);
}
function dt(e) {
	return /^<\/a\s*>/i.test(e);
}
function ft(e) {
	let t = e.tokens;
	if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
		if (t[n].type !== "inline" || !e.md.linkify.pretest(t[n].content)) continue;
		let r = t[n].children, i = 0;
		for (let a = r.length - 1; a >= 0; a--) {
			let o = r[a];
			if (o.type === "link_close") {
				for (a--; r[a].level !== o.level && r[a].type !== "link_open";) a--;
				continue;
			}
			if (o.type === "html_inline" && (ut(o.content) && i > 0 && i--, dt(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
				let i = o.content, s = e.md.linkify.match(i), c = [], l = o.level, u = 0;
				s.length > 0 && s[0].index === 0 && a > 0 && r[a - 1].type === "text_special" && (s = s.slice(1));
				for (let t = 0; t < s.length; t++) {
					let n = s[t].url, r = e.md.normalizeLink(n);
					if (!e.md.validateLink(r)) continue;
					let a = s[t].text;
					a = s[t].schema ? s[t].schema === "mailto:" && !/^mailto:/i.test(a) ? e.md.normalizeLinkText("mailto:" + a).replace(/^mailto:/, "") : e.md.normalizeLinkText(a) : e.md.normalizeLinkText("http://" + a).replace(/^http:\/\//, "");
					let o = s[t].index;
					if (o > u) {
						let t = new e.Token("text", "", 0);
						t.content = i.slice(u, o), t.level = l, c.push(t);
					}
					let d = new e.Token("link_open", "a", 1);
					d.attrs = [["href", r]], d.level = l++, d.markup = "linkify", d.info = "auto", c.push(d);
					let f = new e.Token("text", "", 0);
					f.content = a, f.level = l, c.push(f);
					let p = new e.Token("link_close", "a", -1);
					p.level = --l, p.markup = "linkify", p.info = "auto", c.push(p), u = s[t].lastIndex;
				}
				if (u < i.length) {
					let t = new e.Token("text", "", 0);
					t.content = i.slice(u), t.level = l, c.push(t);
				}
				t[n].children = r = je(r, a, c);
			}
		}
	}
}
var pt = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, mt = /\((c|tm|r)\)/i, ht = /\((c|tm|r)\)/gi, gt = {
	c: "©",
	r: "®",
	tm: "™"
};
function _t(e, t) {
	return gt[t.toLowerCase()];
}
function vt(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(ht, _t)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function yt(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && pt.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function bt(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (mt.test(e.tokens[t].content) && vt(e.tokens[t].children), pt.test(e.tokens[t].content) && yt(e.tokens[t].children));
}
var xt = /['"]/, St = /['"]/g, Ct = "’";
function wt(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Tt(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Et(e, t) {
	let n, r = [], i = {};
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = e[a].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
		if (r.length = n + 1, o.type !== "text") continue;
		let c = o.content, l = 0, u = c.length;
		OUTER: for (; l < u;) {
			St.lastIndex = l;
			let o = St.exec(c);
			if (!o) break;
			let d = !0, f = !0;
			l = o.index + 1;
			let p = o[0] === "'", m = 32;
			if (o.index - 1 >= 0) m = c.charCodeAt(o.index - 1);
			else for (n = a - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--) if (e[n].content) {
				m = e[n].content.charCodeAt(e[n].content.length - 1);
				break;
			}
			let h = 32;
			if (l < u) h = c.charCodeAt(l);
			else for (n = a + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++) if (e[n].content) {
				h = e[n].content.charCodeAt(0);
				break;
			}
			let g = Je(m) || qe(m), _ = Je(h) || qe(h), v = Ge(m), y = Ge(h);
			if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
				p && wt(i, a, o.index, Ct);
				continue;
			}
			if (f) for (n = r.length - 1; n >= 0; n--) {
				let e = r[n];
				if (r[n].level < s) break;
				if (e.single === p && r[n].level === s) {
					e = r[n];
					let s, c;
					p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), wt(i, a, o.index, c), wt(i, e.token, e.pos, s), r.length = n;
					continue OUTER;
				}
			}
			d ? r.push({
				token: a,
				pos: o.index,
				single: p,
				level: s
			}) : f && p && wt(i, a, o.index, Ct);
		}
	}
	Object.keys(i).forEach(function(t) {
		e[t].content = Tt(e[t].content, i[t]);
	});
}
function Dt(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !xt.test(e.tokens[t].content) || Et(e.tokens[t].children, e);
}
function Ot(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var kt = [
	["normalize", st],
	["block", ct],
	["inline", lt],
	["linkify", ft],
	["replacements", bt],
	["smartquotes", Dt],
	["text_join", Ot]
];
function At() {
	this.ruler = new H();
	for (let e = 0; e < kt.length; e++) this.ruler.push(kt[e][0], kt[e][1]);
}
At.prototype.process = function(e) {
	let t = this.ruler.getRules("");
	for (let n = 0, r = t.length; n < r; n++) t[n](e);
}, At.prototype.State = it;
function W(e, t, n, r) {
	this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
	let i = this.src;
	for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
		let s = i.charCodeAt(t);
		if (!o) if (B(s)) {
			n++, s === 9 ? r += 4 - r % 4 : r++;
			continue;
		} else o = !0;
		(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
	}
	this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
W.prototype.push = function(e, t, n) {
	let r = new U(e, t, n);
	return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
}, W.prototype.isEmpty = function(e) {
	return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
}, W.prototype.skipEmptyLines = function(e) {
	for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
	return e;
}, W.prototype.skipSpaces = function(e) {
	for (let t = this.src.length; e < t && B(this.src.charCodeAt(e)); e++);
	return e;
}, W.prototype.skipSpacesBack = function(e, t) {
	if (e <= t) return e;
	for (; e > t;) if (!B(this.src.charCodeAt(--e))) return e + 1;
	return e;
}, W.prototype.skipChars = function(e, t) {
	for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
	return e;
}, W.prototype.skipCharsBack = function(e, t, n) {
	if (e <= n) return e;
	for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
	return e;
}, W.prototype.getLines = function(e, t, n, r) {
	if (e >= t) return "";
	let i = Array(t - e);
	for (let a = 0, o = e; o < t; o++, a++) {
		let e = 0, s = this.bMarks[o], c = s, l;
		for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
			let t = this.src.charCodeAt(c);
			if (B(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
			else if (c - s < this.tShift[o]) e++;
			else break;
			c++;
		}
		e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
	}
	return i.join("");
}, W.prototype.Token = U;
var jt = 65536;
function Mt(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function Nt(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Pt(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !B(s) || o === 45 && B(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !B(t)) return !1;
		a++;
	}
	let c = Mt(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Mt(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = Nt(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
	let d = l.length;
	if (d === 0 || d !== u.length) return !1;
	if (r) return !0;
	let f = e.parentType;
	e.parentType = "table";
	let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
	m.map = h;
	let g = e.push("thead_open", "thead", 1);
	g.map = [t, t + 1];
	let _ = e.push("tr_open", "tr", 1);
	_.map = [t, t + 1];
	for (let t = 0; t < l.length; t++) {
		let n = e.push("th_open", "th", 1);
		u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
		let r = e.push("inline", "", 0);
		r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
	}
	e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
	let v, y = 0;
	for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
		let r = !1;
		for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
			r = !0;
			break;
		}
		if (r || (c = Mt(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Nt(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > jt)) break;
		if (i === t + 2) {
			let n = e.push("tbody_open", "tbody", 1);
			n.map = v = [t + 2, 0];
		}
		let a = e.push("tr_open", "tr", 1);
		a.map = [i, i + 1];
		for (let t = 0; t < d; t++) {
			let n = e.push("td_open", "td", 1);
			u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
			let r = e.push("inline", "", 0);
			r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
		}
		e.push("tr_close", "tr", -1);
	}
	return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
}
function Ft(e, t, n) {
	if (e.sCount[t] - e.blkIndent < 4) return !1;
	let r = t + 1, i = r;
	for (; r < n;) {
		if (e.isEmpty(r)) {
			r++;
			continue;
		}
		if (e.sCount[r] - e.blkIndent >= 4) {
			r++, i = r;
			continue;
		}
		break;
	}
	e.line = i;
	let a = e.push("code_block", "code", 0);
	return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
}
function It(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 126 && o !== 96) return !1;
	let s = i;
	i = e.skipChars(i, o);
	let c = i - s;
	if (c < 3) return !1;
	let l = e.src.slice(s, i), u = e.src.slice(i, a);
	if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
	if (r) return !0;
	let d = t, f = !1;
	for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
		f = !0;
		break;
	}
	c = e.sCount[t], e.line = d + +!!f;
	let p = e.push("fence", "code", 0);
	return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
}
function Lt(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
	if (r) return !0;
	let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
	e.parentType = "blockquote";
	let p = !1, m;
	for (m = t; m < n; m++) {
		let t = e.sCount[m] < e.blkIndent;
		if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
		if (e.src.charCodeAt(i++) === 62 && !t) {
			let t = e.sCount[m] + 1, n, r;
			e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
			let o = t;
			for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
				let t = e.src.charCodeAt(i);
				if (B(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
				else break;
				i++;
			}
			p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
			continue;
		}
		if (p) break;
		let r = !1;
		for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
			r = !0;
			break;
		}
		if (r) {
			e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
			break;
		}
		s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
	}
	let h = e.blkIndent;
	e.blkIndent = 0;
	let g = e.push("blockquote_open", "blockquote", 1);
	g.markup = ">";
	let _ = [t, 0];
	g.map = _, e.md.block.tokenize(e, t, m);
	let v = e.push("blockquote_close", "blockquote", -1);
	v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
	for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
	return e.blkIndent = h, !0;
}
function Rt(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !B(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function zt(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !B(e.src.charCodeAt(r)) ? -1 : r;
}
function Bt(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
	if (i + 1 >= r) return -1;
	let a = e.src.charCodeAt(i++);
	if (a < 48 || a > 57) return -1;
	for (;;) {
		if (i >= r) return -1;
		if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
			if (i - n >= 10) return -1;
			continue;
		}
		if (a === 41 || a === 46) break;
		return -1;
	}
	return i < r && (a = e.src.charCodeAt(i), !B(a)) ? -1 : i;
}
function Vt(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Ht(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Bt(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = zt(e, c)) >= 0) d = !1;
	else return !1;
	if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
	if (r) return !0;
	let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
	d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
	let g = [c, 0];
	s.map = g, s.markup = String.fromCharCode(m);
	let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
	for (e.parentType = "list"; c < n;) {
		a = p, i = e.eMarks[c];
		let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
		for (; a < i;) {
			let t = e.src.charCodeAt(a);
			if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
			else if (t === 32) r++;
			else break;
			a++;
		}
		let u = a, f;
		f = u >= i ? 1 : r - t, f > 4 && (f = 1);
		let h = t + f;
		s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
		let g = [c, 0];
		s.map = g, d && (s.info = e.src.slice(o, p - 1));
		let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
		if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
		let C = !1;
		for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
			C = !0;
			break;
		}
		if (C) break;
		if (d) {
			if (p = Bt(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = zt(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && Vt(e, h), !0;
}
function Ut(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
	function s(t) {
		let n = e.lineMax;
		if (t >= n || e.isEmpty(t)) return null;
		let r = !1;
		if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
			let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
			e.parentType = "reference";
			let a = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
				a = !0;
				break;
			}
			if (e.parentType = i, a) return null;
		}
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		return e.src.slice(i, a + 1);
	}
	let c = e.src.slice(i, a + 1);
	a = c.length;
	let l = -1;
	for (i = 1; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 91) return !1;
		if (e === 93) {
			l = i;
			break;
		} else if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		}
	}
	if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
	for (i = l + 2; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!B(e)) break;
	}
	let u = e.md.helpers.parseLinkDestination(c, i, a);
	if (!u.ok) return !1;
	let d = e.md.normalizeLink(u.str);
	if (!e.md.validateLink(d)) return !1;
	i = u.pos;
	let f = i, p = o, m = i;
	for (; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!B(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && B(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && B(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Ye(c.slice(1, l));
	return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
		title: g,
		href: d
	}), e.line = o, !0) : !1;
}
var Wt = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Gt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), Kt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), qt = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		!0
	],
	[
		/^<!--/,
		/-->/,
		!0
	],
	[
		/^<\?/,
		/\?>/,
		!0
	],
	[
		/^<![A-Z]/,
		/>/,
		!0
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		!0
	],
	[
		RegExp("^</?(" + Wt.join("|") + ")(?=(\\s|/?>|$))", "i"),
		/^$/,
		!0
	],
	[
		RegExp(Kt.source + "\\s*$"),
		/^$/,
		!1
	]
];
function Jt(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < qt.length && !qt[s][0].test(o); s++);
	if (s === qt.length) return !1;
	if (r) return qt[s][2];
	let c = t + 1, l = qt[s][1].test("");
	if (!qt[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), qt[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function Yt(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !B(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && B(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", "h" + String(s), 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Ze(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", "h" + String(s), -1);
	return d.markup = "########".slice(0, s), !0;
}
function G(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph");
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let i = e.parentType;
	e.parentType = "paragraph";
	let a = 0, o, s = t + 1;
	for (; s < n && !e.isEmpty(s); s++) {
		if (e.sCount[s] - e.blkIndent > 3) continue;
		if (e.sCount[s] >= e.blkIndent) {
			let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
			if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
				a = o === 61 ? 1 : 2;
				break;
			}
		}
		if (e.sCount[s] < 0) continue;
		let t = !1;
		for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	if (!a) return e.parentType = i, !1;
	let c = Ze(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", "h" + String(a), 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", "h" + String(a), -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function Xt(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
	for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
		if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
		let t = !1;
		for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	let o = Ze(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var Zt = [
	[
		"table",
		Pt,
		["paragraph", "reference"]
	],
	["code", Ft],
	[
		"fence",
		It,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Lt,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Rt,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Ht,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", Ut],
	[
		"html_block",
		Jt,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Yt,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", G],
	["paragraph", Xt]
];
function Qt() {
	this.ruler = new H();
	for (let e = 0; e < Zt.length; e++) this.ruler.push(Zt[e][0], Zt[e][1], { alt: (Zt[e][2] || []).slice() });
}
Qt.prototype.tokenize = function(e, t, n) {
	let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
	for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
		if (e.level >= a) {
			e.line = n;
			break;
		}
		let t = e.line, c = !1;
		for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
			if (t >= e.line) throw Error("block rule didn't increment state.line");
			break;
		}
		if (!c) throw Error("none of the block rules matched");
		e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
	}
}, Qt.prototype.parse = function(e, t, n, r) {
	if (!e) return;
	let i = new this.State(e, t, n, r);
	this.tokenize(i, i.line, i.lineMax);
}, Qt.prototype.State = W;
function $t(e, t, n, r) {
	this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
$t.prototype.pushPending = function() {
	let e = new U("text", "", 0);
	return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
}, $t.prototype.push = function(e, t, n) {
	this.pending && this.pushPending();
	let r = new U(e, t, n), i = null;
	return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
}, $t.prototype.scanDelims = function(e, t) {
	let n = this.posMax, r = this.src.charCodeAt(e), i;
	if (e === 0) i = 32;
	else if (e === 1) i = this.src.charCodeAt(0), (i & 63488) == 55296 && (i = 65533);
	else if (i = this.src.charCodeAt(e - 1), (i & 64512) == 56320) {
		let t = this.src.charCodeAt(e - 2);
		i = (t & 64512) == 55296 ? 65536 + (t - 55296 << 10) + (i - 56320) : 65533;
	} else (i & 64512) == 55296 && (i = 65533);
	let a = e;
	for (; a < n && this.src.charCodeAt(a) === r;) a++;
	let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32;
	if ((s & 64512) == 55296) {
		let e = this.src.charCodeAt(a + 1);
		s = (e & 64512) == 56320 ? 65536 + (s - 55296 << 10) + (e - 56320) : 65533;
	} else (s & 64512) == 56320 && (s = 65533);
	let c = Je(i) || qe(i), l = Je(s) || qe(s), u = Ge(i), d = Ge(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
	return {
		can_open: f && (t || !p || c),
		can_close: p && (t || !f || l),
		length: o
	};
}, $t.prototype.Token = U;
function en(e) {
	switch (e) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function tn(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !en(e.src.charCodeAt(n));) n++;
	return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
var nn = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function rn(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = e.pending.match(nn);
	if (!i) return !1;
	let a = i[1], o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
	if (!o) return !1;
	let s = o.url;
	if (s.length <= a.length) return !1;
	let c = s.length;
	for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
	c !== s.length && (s = s.slice(0, c));
	let l = e.md.normalizeLink(s);
	if (!e.md.validateLink(l)) return !1;
	if (!t) {
		e.pending = e.pending.slice(0, -a.length);
		let t = e.push("link_open", "a", 1);
		t.attrs = [["href", l]], t.markup = "linkify", t.info = "auto";
		let n = e.push("text", "", 0);
		n.content = e.md.normalizeLinkText(s);
		let r = e.push("link_close", "a", -1);
		r.markup = "linkify", r.info = "auto";
	}
	return e.pos += s.length - a.length, !0;
}
function an(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 10) return !1;
	let r = e.pending.length - 1, i = e.posMax;
	if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
		let t = r - 1;
		for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
		e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
	} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
	else e.push("softbreak", "br", 0);
	for (n++; n < i && B(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var on = [];
for (let e = 0; e < 256; e++) on.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	on[e.charCodeAt(0)] = 1;
});
function sn(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), B(i));) n++;
		return e.pos = n, !0;
	}
	if (i === 32) {
		if (!t) {
			let t = e.push("text_special", "", 0);
			t.content = "\\", t.markup = "\\", t.info = "escape";
		}
		return e.pos = n, !0;
	}
	let a = e.src[n];
	if (i >= 55296 && i <= 56319 && n + 1 < r) {
		let t = e.src.charCodeAt(n + 1);
		t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
	}
	let o = "\\" + a;
	if (!t) {
		let t = e.push("text_special", "", 0);
		i < 256 && on[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function cn(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = n;
	n++;
	let i = e.posMax;
	for (; n < i && e.src.charCodeAt(n) === 96;) n++;
	let a = e.src.slice(r, n), o = a.length;
	if (e.backticksScanned && (e.backticks[o] || 0) <= r) return t || (e.pending += a), e.pos += o, !0;
	let s = n, c;
	for (; (c = e.src.indexOf("`", s)) !== -1;) {
		for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
		let r = s - c;
		if (r === o) {
			if (!t) {
				let t = e.push("code_inline", "code", 0);
				t.markup = a, t.content = e.src.slice(n, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
			}
			return e.pos = s, !0;
		}
		e.backticks[r] = c;
	}
	return e.backticksScanned = !0, t || (e.pending += a), e.pos += o, !0;
}
function ln(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 126) return !1;
	let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
	if (a < 2) return !1;
	let s;
	a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
	for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
		marker: r,
		length: 0,
		token: e.tokens.length - 1,
		end: -1,
		open: i.can_open,
		close: i.can_close
	});
	return e.pos += i.length, !0;
}
function un(e, t) {
	let n, r = [], i = t.length;
	for (let a = 0; a < i; a++) {
		let i = t[a];
		if (i.marker !== 126 || i.end === -1) continue;
		let o = t[i.end];
		n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
	}
	for (; r.length;) {
		let t = r.pop(), i = t + 1;
		for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
		i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
	}
}
function dn(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	un(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && un(e, t[r].delimiters);
}
var fn = {
	tokenize: ln,
	postProcess: dn
};
function pn(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 95 && r !== 42) return !1;
	let i = e.scanDelims(e.pos, r === 42);
	for (let t = 0; t < i.length; t++) {
		let t = e.push("text", "", 0);
		t.content = String.fromCharCode(r), e.delimiters.push({
			marker: r,
			length: i.length,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
	}
	return e.pos += i.length, !0;
}
function mn(e, t) {
	let n = t.length;
	for (let r = n - 1; r >= 0; r--) {
		let n = t[r];
		if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
		let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
		s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
		let c = e.tokens[i.token];
		c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
	}
}
function hn(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	mn(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && mn(e, t[r].delimiters);
}
var gn = {
	tokenize: pn,
	postProcess: hn
};
function _n(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!B(n) && n !== 10)); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!B(n) && n !== 10)); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!B(n) && n !== 10)); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[Ye(r)], !a) return e.pos = u, !1;
		o = a.href, s = a.title;
	}
	if (!t) {
		e.pos = f, e.posMax = p;
		let t = e.push("link_open", "a", 1), n = [["href", o]];
		t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
	}
	return e.pos = m, e.posMax = d, !0;
}
function vn(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), !(!B(n) && n !== 10)); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!B(n) && n !== 10)); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!B(n) && n !== 10)); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[Ye(i)], !o) return e.pos = d, !1;
		u = o.href, c = o.title;
	}
	if (!t) {
		r = e.src.slice(p, m);
		let t = [];
		e.md.inline.parse(r, e.md, e.env, t);
		let n = e.push("image", "img", 0), i = [["src", u], ["alt", ""]];
		n.attrs = i, n.children = t, n.content = r, c && i.push(["title", c]);
	}
	return e.pos = a, e.posMax = f, !0;
}
var yn = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, bn = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function xn(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 60) return !1;
	let r = e.pos, i = e.posMax;
	for (;;) {
		if (++n >= i) return !1;
		let t = e.src.charCodeAt(n);
		if (t === 60) return !1;
		if (t === 62) break;
	}
	let a = e.src.slice(r + 1, n);
	if (bn.test(a)) {
		let n = e.md.normalizeLink(a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	if (yn.test(a)) {
		let n = e.md.normalizeLink("mailto:" + a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	return !1;
}
function Sn(e) {
	return /^<a[>\s]/i.test(e);
}
function Cn(e) {
	return /^<\/a\s*>/i.test(e);
}
function wn(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Tn(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !wn(i)) return !1;
	let a = e.src.slice(r).match(Gt);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], Sn(t.content) && e.linkLevel++, Cn(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var En = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Dn = /^&([a-z][a-z0-9]{1,31});/i;
function On(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(En);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = Me(t) ? Ne(t) : Ne(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(Dn);
		if (r) {
			let n = we(r[0]);
			if (n !== r[0]) {
				if (!t) {
					let t = e.push("text_special", "", 0);
					t.content = n, t.markup = r[0], t.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		}
	}
	return !1;
}
function kn(e) {
	let t = {}, n = e.length;
	if (!n) return;
	let r = 0, i = -2, a = [];
	for (let o = 0; o < n; o++) {
		let n = e[o];
		if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
		t.hasOwnProperty(n.marker) || (t[n.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		]);
		let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
		for (; c > s; c -= a[c] + 1) {
			let t = e[c];
			if (t.marker === n.marker && t.open && t.end < 0) {
				let r = !1;
				if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
					let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
					a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
					break;
				}
			}
		}
		l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
	}
}
function An(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	kn(e.delimiters);
	for (let e = 0; e < n; e++) t[e] && t[e].delimiters && kn(t[e].delimiters);
}
function jn(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Mn = [
	["text", tn],
	["linkify", rn],
	["newline", an],
	["escape", sn],
	["backticks", cn],
	["strikethrough", fn.tokenize],
	["emphasis", gn.tokenize],
	["link", _n],
	["image", vn],
	["autolink", xn],
	["html_inline", Tn],
	["entity", On]
], Nn = [
	["balance_pairs", An],
	["strikethrough", fn.postProcess],
	["emphasis", gn.postProcess],
	["fragments_join", jn]
];
function Pn() {
	this.ruler = new H();
	for (let e = 0; e < Mn.length; e++) this.ruler.push(Mn[e][0], Mn[e][1]);
	this.ruler2 = new H();
	for (let e = 0; e < Nn.length; e++) this.ruler2.push(Nn[e][0], Nn[e][1]);
}
Pn.prototype.skipToken = function(e) {
	let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
	if (a[t] !== void 0) {
		e.pos = a[t];
		return;
	}
	let o = !1;
	if (e.level < i) {
		for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
			if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
			break;
		}
	} else e.pos = e.posMax;
	o || e.pos++, a[t] = e.pos;
}, Pn.prototype.tokenize = function(e) {
	let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
	for (; e.pos < r;) {
		let a = e.pos, o = !1;
		if (e.level < i) {
			for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
				if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		}
		if (o) {
			if (e.pos >= r) break;
			continue;
		}
		e.pending += e.src[e.pos++];
	}
	e.pending && e.pushPending();
}, Pn.prototype.parse = function(e, t, n, r) {
	let i = new this.State(e, t, n, r);
	this.tokenize(i);
	let a = this.ruler2.getRules(""), o = a.length;
	for (let e = 0; e < o; e++) a[e](i);
}, Pn.prototype.State = $t;
function Fn(e) {
	let t = {};
	e ||= {}, t.src_Any = O.source, t.src_Cc = ce.source, t.src_Z = ue.source, t.src_P = k.source, t.src_ZPCc = [
		t.src_Z,
		t.src_P,
		t.src_Cc
	].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
	let n = "[><｜]";
	return t.src_pseudo_letter = `(?:(?!${n}|${t.src_ZPCc})${t.src_Any})`, t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = `(?=$|${n}|${t.src_ZPCc})(?!${e["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`, t.src_path = `(?:[/?#](?:(?!${t.src_ZCc}|${n}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`, t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + `|${t.src_pseudo_letter}{1,63})`, t.src_domain = "(?:" + t.src_xn + `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`, t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`, t.tpl_host_fuzzy = "(?:" + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`, t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`, t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`, t.tpl_email_fuzzy = `(^|${n}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`, t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`, t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`, t;
}
function In(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		t && Object.keys(t).forEach(function(n) {
			e[n] = t[n];
		});
	}), e;
}
function Ln(e) {
	return Object.prototype.toString.call(e);
}
function Rn(e) {
	return Ln(e) === "[object String]";
}
function zn(e) {
	return Ln(e) === "[object Object]";
}
function Bn(e) {
	return Ln(e) === "[object RegExp]";
}
function Vn(e) {
	return Ln(e) === "[object Function]";
}
function Hn(e) {
	return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var Un = {
	fuzzyLink: !0,
	fuzzyEmail: !0,
	fuzzyIP: !1
};
function Wn(e) {
	return Object.keys(e || {}).reduce(function(e, t) {
		return e || Un.hasOwnProperty(t);
	}, !1);
}
var Gn = {
	"http:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.http || (n.re.http = RegExp(`^\\/\\/${n.re.src_auth}${n.re.src_host_port_strict}${n.re.src_path}`, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
	} },
	"https:": "http:",
	"ftp:": "http:",
	"//": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.no_http || (n.re.no_http = RegExp("^" + n.re.src_auth + `(?:localhost|(?:(?:${n.re.src_domain})\\.)+${n.re.src_domain_root})` + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
	} },
	"mailto:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.mailto || (n.re.mailto = RegExp(`^${n.re.src_email_name}@${n.re.src_host_strict}`, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
	} }
}, Kn = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", qn = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Jn(e) {
	return function(t, n) {
		let r = t.slice(n);
		return e.test(r) ? r.match(e)[0].length : 0;
	};
}
function Yn() {
	return function(e, t) {
		t.normalize(e);
	};
}
function Xn(e) {
	let t = e.re = Fn(e.__opts__), n = e.__tlds__.slice();
	e.onCompile(), e.__tlds_replaced__ || n.push(Kn), n.push(t.src_xn), t.src_tlds = n.join("|");
	function r(e) {
		return e.replace("%TLDS%", t.src_tlds);
	}
	t.email_fuzzy = RegExp(r(t.tpl_email_fuzzy), "i"), t.email_fuzzy_global = RegExp(r(t.tpl_email_fuzzy), "ig"), t.link_fuzzy = RegExp(r(t.tpl_link_fuzzy), "i"), t.link_fuzzy_global = RegExp(r(t.tpl_link_fuzzy), "ig"), t.link_no_ip_fuzzy = RegExp(r(t.tpl_link_no_ip_fuzzy), "i"), t.link_no_ip_fuzzy_global = RegExp(r(t.tpl_link_no_ip_fuzzy), "ig"), t.host_fuzzy_test = RegExp(r(t.tpl_host_fuzzy_test), "i");
	let i = [];
	e.__compiled__ = {};
	function a(e, t) {
		throw Error(`(LinkifyIt) Invalid schema "${e}": ${t}`);
	}
	Object.keys(e.__schemas__).forEach(function(t) {
		let n = e.__schemas__[t];
		if (n === null) return;
		let r = {
			validate: null,
			link: null
		};
		if (e.__compiled__[t] = r, zn(n)) {
			Bn(n.validate) ? r.validate = Jn(n.validate) : Vn(n.validate) ? r.validate = n.validate : a(t, n), Vn(n.normalize) ? r.normalize = n.normalize : n.normalize ? a(t, n) : r.normalize = Yn();
			return;
		}
		if (Rn(n)) {
			i.push(t);
			return;
		}
		a(t, n);
	}), i.forEach(function(t) {
		e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
	}), e.__compiled__[""] = {
		validate: null,
		normalize: Yn()
	};
	let o = Object.keys(e.__compiled__).filter(function(t) {
		return t.length > 0 && e.__compiled__[t];
	}).map(Hn).join("|");
	e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "i"), e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "ig"), e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, "i"), e.re.pretest = RegExp(`(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`, "i");
}
function Zn(e, t, n, r) {
	let i = e.slice(n, r);
	this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
}
function K(e, t) {
	if (!(this instanceof K)) return new K(e, t);
	t || Wn(e) && (t = e, e = {}), this.__opts__ = In({}, Un, t), this.__schemas__ = In({}, Gn, e), this.__compiled__ = {}, this.__tlds__ = qn, this.__tlds_replaced__ = !1, this.re = {}, Xn(this);
}
K.prototype.add = function(e, t) {
	return this.__schemas__[e] = t, Xn(this), this;
}, K.prototype.set = function(e) {
	return this.__opts__ = In(this.__opts__, e), this;
}, K.prototype.test = function(e) {
	if (!e.length) return !1;
	let t, n;
	if (this.re.schema_test.test(e)) {
		for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
	}
	return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
}, K.prototype.pretest = function(e) {
	return this.re.pretest.test(e);
}, K.prototype.testSchemaAt = function(e, t, n) {
	return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
}, K.prototype.match = function(e) {
	let t = [], n = [], r = [], i = [], a, o, s;
	function c(e, t) {
		return e ? t ? e.index === t.index ? e.lastIndex >= t.lastIndex ? e : t : e.index < t.index ? e : t : e : t;
	}
	if (!e.length) return null;
	if (this.re.schema_test.test(e)) for (s = this.re.schema_search, s.lastIndex = 0; (a = s.exec(e)) !== null;) o = this.testSchemaAt(e, a[2], s.lastIndex), o && n.push({
		schema: a[2],
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length + o
	});
	if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) for (s = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) r.push({
		schema: "",
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length
	});
	if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) for (s = this.re.email_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) i.push({
		schema: "mailto:",
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length
	});
	let l = [
		0,
		0,
		0
	], u = 0;
	for (;;) {
		let a = [
			n[l[0]],
			i[l[1]],
			r[l[2]]
		], o = c(c(a[0], a[1]), a[2]);
		if (!o) break;
		if (o === a[0] ? l[0]++ : o === a[1] ? l[1]++ : l[2]++, o.index < u) continue;
		let s = new Zn(e, o.schema, o.index, o.lastIndex);
		this.__compiled__[s.schema].normalize(s, this), t.push(s), u = o.lastIndex;
	}
	return t.length ? t : null;
}, K.prototype.matchAtStart = function(e) {
	if (!e.length) return null;
	let t = this.re.schema_at_start.exec(e);
	if (!t) return null;
	let n = this.testSchemaAt(e, t[2], t[0].length);
	if (!n) return null;
	let r = new Zn(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
	return this.__compiled__[r.schema].normalize(r, this), r;
}, K.prototype.tlds = function(e, t) {
	return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
		return e !== n[t - 1];
	}).reverse(), Xn(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Xn(this), this);
}, K.prototype.normalize = function(e) {
	e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
}, K.prototype.onCompile = function() {};
var Qn = /* @__PURE__ */ f({
	decode: () => Cr,
	default: () => Dr,
	encode: () => wr,
	toASCII: () => Er,
	toUnicode: () => Tr,
	ucs2decode: () => nr,
	ucs2encode: () => yr
});
function $n(e) {
	throw RangeError(hr[e]);
}
function er(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function tr(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(mr, ".");
	let i = er(e.split("."), t).join(".");
	return r + i;
}
function nr(e) {
	let t = [], n = 0, r = e.length;
	for (; n < r;) {
		let i = e.charCodeAt(n++);
		if (i >= 55296 && i <= 56319 && n < r) {
			let r = e.charCodeAt(n++);
			(r & 64512) == 56320 ? t.push(((i & 1023) << 10) + (r & 1023) + 65536) : (t.push(i), n--);
		} else t.push(i);
	}
	return t;
}
var rr, ir, ar, or, sr, cr, lr, ur, dr, fr, pr, mr, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or = u((() => {
	rr = 2147483647, ir = 36, ar = 1, or = 26, sr = 38, cr = 700, lr = 72, ur = 128, dr = "-", fr = /^xn--/, pr = /[^\0-\x7F]/, mr = /[\x2E\u3002\uFF0E\uFF61]/g, hr = {
		overflow: "Overflow: input needs wider integers to process",
		"not-basic": "Illegal input >= 0x80 (not a basic code point)",
		"invalid-input": "Invalid input"
	}, gr = ir - ar, _r = Math.floor, vr = String.fromCharCode, yr = (e) => String.fromCodePoint(...e), br = function(e) {
		return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : ir;
	}, xr = function(e, t) {
		return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
	}, Sr = function(e, t, n) {
		let r = 0;
		for (e = n ? _r(e / cr) : e >> 1, e += _r(e / t); e > 455; r += ir) e = _r(e / gr);
		return _r(r + 36 * e / (e + sr));
	}, Cr = function(e) {
		let t = [], n = e.length, r = 0, i = ur, a = lr, o = e.lastIndexOf(dr);
		o < 0 && (o = 0);
		for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && $n("not-basic"), t.push(e.charCodeAt(n));
		for (let s = o > 0 ? o + 1 : 0; s < n;) {
			let o = r;
			for (let t = 1, i = ir;; i += ir) {
				s >= n && $n("invalid-input");
				let o = br(e.charCodeAt(s++));
				o >= ir && $n("invalid-input"), o > _r((rr - r) / t) && $n("overflow"), r += o * t;
				let c = i <= a ? ar : i >= a + or ? or : i - a;
				if (o < c) break;
				let l = ir - c;
				t > _r(rr / l) && $n("overflow"), t *= l;
			}
			let c = t.length + 1;
			a = Sr(r - o, c, o == 0), _r(r / c) > rr - i && $n("overflow"), i += _r(r / c), r %= c, t.splice(r++, 0, i);
		}
		return String.fromCodePoint(...t);
	}, wr = function(e) {
		let t = [];
		e = nr(e);
		let n = e.length, r = ur, i = 0, a = lr;
		for (let n of e) n < 128 && t.push(vr(n));
		let o = t.length, s = o;
		for (o && t.push(dr); s < n;) {
			let n = rr;
			for (let t of e) t >= r && t < n && (n = t);
			let c = s + 1;
			n - r > _r((rr - i) / c) && $n("overflow"), i += (n - r) * c, r = n;
			for (let n of e) if (n < r && ++i > rr && $n("overflow"), n === r) {
				let e = i;
				for (let n = ir;; n += ir) {
					let r = n <= a ? ar : n >= a + or ? or : n - a;
					if (e < r) break;
					let i = e - r, o = ir - r;
					t.push(vr(xr(r + i % o, 0))), e = _r(i / o);
				}
				t.push(vr(xr(e, 0))), a = Sr(i, c, s === o), i = 0, ++s;
			}
			++i, ++r;
		}
		return t.join("");
	}, Tr = function(e) {
		return tr(e, function(e) {
			return fr.test(e) ? Cr(e.slice(4).toLowerCase()) : e;
		});
	}, Er = function(e) {
		return tr(e, function(e) {
			return pr.test(e) ? "xn--" + wr(e) : e;
		});
	}, Dr = {
		version: "2.3.1",
		ucs2: {
			decode: nr,
			encode: yr
		},
		decode: Cr,
		encode: wr,
		toASCII: Er,
		toUnicode: Tr
	};
}));
Or();
var kr = {
	default: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 100
		},
		components: {
			core: {},
			block: {},
			inline: {}
		}
	},
	zero: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: ["paragraph"] },
			inline: {
				rules: ["text"],
				rules2: ["balance_pairs", "fragments_join"]
			}
		}
	},
	commonmark: {
		options: {
			html: !0,
			xhtmlOut: !0,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			] },
			inline: {
				rules: [
					"autolink",
					"backticks",
					"emphasis",
					"entity",
					"escape",
					"html_inline",
					"image",
					"link",
					"newline",
					"text"
				],
				rules2: [
					"balance_pairs",
					"emphasis",
					"fragments_join"
				]
			}
		}
	}
}, Ar = /^(vbscript|javascript|file|data):/, jr = /^data:image\/(gif|png|jpeg|webp);/;
function Mr(e) {
	let t = e.trim().toLowerCase();
	return !Ar.test(t) || jr.test(t);
}
var Nr = [
	"http:",
	"https:",
	"mailto:"
];
function Pr(e) {
	let t = oe(e, !0);
	if (t.hostname && (!t.protocol || Nr.indexOf(t.protocol) >= 0)) try {
		t.hostname = Dr.toASCII(t.hostname);
	} catch {}
	return x(S(t));
}
function Fr(e) {
	let t = oe(e, !0);
	if (t.hostname && (!t.protocol || Nr.indexOf(t.protocol) >= 0)) try {
		t.hostname = Dr.toUnicode(t.hostname);
	} catch {}
	return v(S(t), v.defaultChars + "%");
}
function q(e, t) {
	if (!(this instanceof q)) return new q(e, t);
	t || De(e) || (t = e || {}, e = "default"), this.inline = new Pn(), this.block = new Qt(), this.core = new At(), this.renderer = new rt(), this.linkify = new K(), this.validateLink = Mr, this.normalizeLink = Pr, this.normalizeLinkText = Fr, this.utils = Te, this.helpers = Ae({}, nt), this.options = {}, this.configure(e), t && this.set(t);
}
q.prototype.set = function(e) {
	return Ae(this.options, e), this;
}, q.prototype.configure = function(e) {
	let t = this;
	if (De(e)) {
		let t = e;
		if (e = kr[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
	}
	if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
	return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
		e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
	}), this;
}, q.prototype.enable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.enable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.enable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
	return this;
}, q.prototype.disable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.disable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.disable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
	return this;
}, q.prototype.use = function(e) {
	let t = [this].concat(Array.prototype.slice.call(arguments, 1));
	return e.apply(e, t), this;
}, q.prototype.parse = function(e, t) {
	if (typeof e != "string") throw Error("Input data should be a String");
	let n = new this.core.State(e, this, t);
	return this.core.process(n), n.tokens;
}, q.prototype.render = function(e, t) {
	return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
}, q.prototype.parseInline = function(e, t) {
	let n = new this.core.State(e, this, t);
	return n.inlineMode = !0, this.core.process(n), n.tokens;
}, q.prototype.renderInline = function(e, t) {
	return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
};
var Ir = !1, Lr = {
	false: "push",
	true: "unshift",
	after: "push",
	before: "unshift"
}, Rr = { isPermalinkSymbol: !0 };
function zr(e, t, n, r) {
	var i;
	if (!Ir) {
		var a = "Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#permalinks";
		typeof process == "object" && process && process.emitWarning ? process.emitWarning(a) : console.warn(a), Ir = !0;
	}
	var o = [
		Object.assign(new n.Token("link_open", "a", 1), { attrs: [].concat(t.permalinkClass ? [["class", t.permalinkClass]] : [], [["href", t.permalinkHref(e, n)]], Object.entries(t.permalinkAttrs(e, n))) }),
		Object.assign(new n.Token("html_block", "", 0), {
			content: t.permalinkSymbol,
			meta: Rr
		}),
		new n.Token("link_close", "a", -1)
	];
	t.permalinkSpace && n.tokens[r + 1].children[Lr[t.permalinkBefore]](Object.assign(new n.Token("text", "", 0), { content: " " })), (i = n.tokens[r + 1].children)[Lr[t.permalinkBefore]].apply(i, o);
}
function Br(e) {
	return "#" + e;
}
function Vr(e) {
	return {};
}
var Hr = {
	class: "header-anchor",
	symbol: "#",
	renderHref: Br,
	renderAttrs: Vr
};
function Ur(e) {
	function t(n) {
		return n = Object.assign({}, t.defaults, n), function(t, r, i, a) {
			return e(t, n, r, i, a);
		};
	}
	return t.defaults = Object.assign({}, Hr), t.renderPermalinkImpl = e, t;
}
function Wr(e) {
	var t = [], n = e.filter(function(e) {
		if (e[0] !== "class") return !0;
		t.push(e[1]);
	});
	return t.length > 0 && n.unshift(["class", t.join(" ")]), n;
}
var Gr = Ur(function(e, t, n, r, i) {
	var a, o = [
		Object.assign(new r.Token("link_open", "a", 1), { attrs: Wr([].concat(t.class ? [["class", t.class]] : [], [["href", t.renderHref(e, r)]], t.ariaHidden ? [["aria-hidden", "true"]] : [], Object.entries(t.renderAttrs(e, r)))) }),
		Object.assign(new r.Token("html_inline", "", 0), {
			content: t.symbol,
			meta: Rr
		}),
		new r.Token("link_close", "a", -1)
	];
	if (t.space) {
		var s = typeof t.space == "string" ? t.space : " ";
		r.tokens[i + 1].children[Lr[t.placement]](Object.assign(new r.Token(typeof t.space == "string" ? "html_inline" : "text", "", 0), { content: s }));
	}
	(a = r.tokens[i + 1].children)[Lr[t.placement]].apply(a, o);
});
Object.assign(Gr.defaults, {
	space: !0,
	placement: "after",
	ariaHidden: !1
});
var Kr = Ur(Gr.renderPermalinkImpl);
Kr.defaults = Object.assign({}, Gr.defaults, { ariaHidden: !0 });
var qr = Ur(function(e, t, n, r, i) {
	var a = [Object.assign(new r.Token("link_open", "a", 1), { attrs: Wr([].concat(t.class ? [["class", t.class]] : [], [["href", t.renderHref(e, r)]], Object.entries(t.renderAttrs(e, r)))) })].concat(t.safariReaderFix ? [new r.Token("span_open", "span", 1)] : [], r.tokens[i + 1].children, t.safariReaderFix ? [new r.Token("span_close", "span", -1)] : [], [new r.Token("link_close", "a", -1)]);
	r.tokens[i + 1].children = a;
});
Object.assign(qr.defaults, { safariReaderFix: !1 });
var Jr = Ur(function(e, t, n, r, i) {
	var a;
	if (![
		"visually-hidden",
		"aria-label",
		"aria-describedby",
		"aria-labelledby"
	].includes(t.style)) throw Error("`permalink.linkAfterHeader` called with unknown style option `" + t.style + "`");
	if (!["aria-describedby", "aria-labelledby"].includes(t.style) && !t.assistiveText) throw Error("`permalink.linkAfterHeader` called without the `assistiveText` option in `" + t.style + "` style");
	if (t.style === "visually-hidden" && !t.visuallyHiddenClass) throw Error("`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style");
	var o = r.tokens[i + 1].children.filter(function(e) {
		return e.type === "text" || e.type === "code_inline";
	}).reduce(function(e, t) {
		return e + t.content;
	}, ""), s = [], c = [];
	if (t.class && c.push(["class", t.class]), c.push(["href", t.renderHref(e, r)]), c.push.apply(c, Object.entries(t.renderAttrs(e, r))), t.style === "visually-hidden") {
		if (s.push(Object.assign(new r.Token("span_open", "span", 1), { attrs: [["class", t.visuallyHiddenClass]] }), Object.assign(new r.Token("text", "", 0), { content: t.assistiveText(o) }), new r.Token("span_close", "span", -1)), t.space) {
			var l = typeof t.space == "string" ? t.space : " ";
			s[Lr[t.placement]](Object.assign(new r.Token(typeof t.space == "string" ? "html_inline" : "text", "", 0), { content: l }));
		}
		s[Lr[t.placement]](Object.assign(new r.Token("span_open", "span", 1), { attrs: [["aria-hidden", "true"]] }), Object.assign(new r.Token("html_inline", "", 0), {
			content: t.symbol,
			meta: Rr
		}), new r.Token("span_close", "span", -1));
	} else s.push(Object.assign(new r.Token("html_inline", "", 0), {
		content: t.symbol,
		meta: Rr
	}));
	t.style === "aria-label" ? c.push(["aria-label", t.assistiveText(o)]) : ["aria-describedby", "aria-labelledby"].includes(t.style) && c.push([t.style, e]);
	var u = [Object.assign(new r.Token("link_open", "a", 1), { attrs: Wr(c) })].concat(s, [new r.Token("link_close", "a", -1)]);
	(a = r.tokens).splice.apply(a, [i + 3, 0].concat(u)), t.wrapper && (r.tokens.splice(i, 0, Object.assign(new r.Token("html_block", "", 0), { content: t.wrapper[0] + "\n" })), r.tokens.splice(i + 3 + u.length + 1, 0, Object.assign(new r.Token("html_block", "", 0), { content: t.wrapper[1] + "\n" })));
});
function Yr(e, t, n, r) {
	var i = e, a = r;
	if (n && Object.prototype.hasOwnProperty.call(t, i)) throw Error("User defined `id` attribute `" + e + "` is not unique. Please fix it in your Markdown to continue.");
	for (; Object.prototype.hasOwnProperty.call(t, i);) i = e + "-" + a, a += 1;
	return t[i] = !0, i;
}
function Xr(e, t) {
	t = Object.assign({}, Xr.defaults, t), e.core.ruler.push("anchor", function(e) {
		for (var n, r = {}, i = e.tokens, a = Array.isArray(t.level) ? (n = t.level, function(e) {
			return n.includes(e);
		}) : function(e) {
			return function(t) {
				return t >= e;
			};
		}(t.level), o = 0; o < i.length; o++) {
			var s = i[o];
			if (s.type === "heading_open" && a(Number(s.tag.substr(1)))) {
				var c = t.getTokensText(i[o + 1].children), l = s.attrGet("id");
				l = l == null ? Yr(l = t.slugifyWithState ? t.slugifyWithState(c, e) : t.slugify(c), r, !1, t.uniqueSlugStartIndex) : Yr(l, r, !0, t.uniqueSlugStartIndex), s.attrSet("id", l), !1 !== t.tabIndex && s.attrSet("tabindex", "" + t.tabIndex), typeof t.permalink == "function" ? t.permalink(l, t, e, o) : (t.permalink || t.renderPermalink && t.renderPermalink !== zr) && t.renderPermalink(l, t, e, o), o = i.indexOf(s), t.callback && t.callback(s, {
					slug: l,
					title: c
				});
			}
		}
	});
}
Object.assign(Jr.defaults, {
	style: "visually-hidden",
	space: !0,
	placement: "after",
	wrapper: null
}), Xr.permalink = {
	__proto__: null,
	legacy: zr,
	renderHref: Br,
	renderAttrs: Vr,
	makePermalink: Ur,
	linkInsideHeader: Gr,
	ariaHidden: Kr,
	headerLink: qr,
	linkAfterHeader: Jr
}, Xr.defaults = {
	level: 1,
	slugify: function(e) {
		return encodeURIComponent(String(e).trim().toLowerCase().replace(/\s+/g, "-"));
	},
	uniqueSlugStartIndex: 1,
	tabIndex: "-1",
	getTokensText: function(e) {
		return e.filter(function(e) {
			return ["text", "code_inline"].includes(e.type);
		}).map(function(e) {
			return e.content;
		}).join("");
	},
	permalink: !1,
	renderPermalink: zr,
	permalinkClass: Kr.defaults.class,
	permalinkSpace: Kr.defaults.space,
	permalinkSymbol: "¶",
	permalinkBefore: Kr.defaults.placement === "before",
	permalinkHref: Kr.defaults.renderHref,
	permalinkAttrs: Kr.defaults.renderAttrs
}, Xr.default = Xr;
var Zr = /* @__PURE__ */ d(((e) => {
	var t = {};
	function n(e) {
		let n = t[e];
		if (n) return n;
		n = t[e] = [];
		for (let e = 0; e < 128; e++) {
			let t = String.fromCharCode(e);
			n.push(t);
		}
		for (let t = 0; t < e.length; t++) {
			let r = e.charCodeAt(t);
			n[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
		}
		return n;
	}
	function r(e, t) {
		typeof t != "string" && (t = r.defaultChars);
		let i = n(t);
		return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
			let t = "";
			for (let n = 0, r = e.length; n < r; n += 3) {
				let a = parseInt(e.slice(n + 1, n + 3), 16);
				if (a < 128) {
					t += i[a];
					continue;
				}
				if ((a & 224) == 192 && n + 3 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16);
					if ((r & 192) == 128) {
						let e = a << 6 & 1984 | r & 63;
						e < 128 ? t += "��" : t += String.fromCharCode(e), n += 3;
						continue;
					}
				}
				if ((a & 240) == 224 && n + 6 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16), i = parseInt(e.slice(n + 7, n + 9), 16);
					if ((r & 192) == 128 && (i & 192) == 128) {
						let e = a << 12 & 61440 | r << 6 & 4032 | i & 63;
						e < 2048 || e >= 55296 && e <= 57343 ? t += "���" : t += String.fromCharCode(e), n += 6;
						continue;
					}
				}
				if ((a & 248) == 240 && n + 9 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16), i = parseInt(e.slice(n + 7, n + 9), 16), o = parseInt(e.slice(n + 10, n + 12), 16);
					if ((r & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
						let e = a << 18 & 1835008 | r << 12 & 258048 | i << 6 & 4032 | o & 63;
						e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), n += 9;
						continue;
					}
				}
				t += "�";
			}
			return t;
		});
	}
	r.defaultChars = ";/?:@&=+$,#", r.componentChars = "";
	var i = {};
	function a(e) {
		let t = i[e];
		if (t) return t;
		t = i[e] = [];
		for (let e = 0; e < 128; e++) {
			let n = String.fromCharCode(e);
			/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
		}
		for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
		return t;
	}
	function o(e, t, n) {
		typeof t != "string" && (n = t, t = o.defaultChars), n === void 0 && (n = !0);
		let r = a(t), i = "";
		for (let t = 0, a = e.length; t < a; t++) {
			let o = e.charCodeAt(t);
			if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
				i += e.slice(t, t + 3), t += 2;
				continue;
			}
			if (o < 128) {
				i += r[o];
				continue;
			}
			if (o >= 55296 && o <= 57343) {
				if (o >= 55296 && o <= 56319 && t + 1 < a) {
					let n = e.charCodeAt(t + 1);
					if (n >= 56320 && n <= 57343) {
						i += encodeURIComponent(e[t] + e[t + 1]), t++;
						continue;
					}
				}
				i += "%EF%BF%BD";
				continue;
			}
			i += encodeURIComponent(e[t]);
		}
		return i;
	}
	o.defaultChars = ";/?:@&=+$,-_.!~*'()#", o.componentChars = "-_.!~*'()";
	function s(e) {
		let t = "";
		return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
	}
	function c() {
		this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
	}
	var l = /^([a-z0-9.+-]+:)/i, u = /:[0-9]*$/, d = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, f = [
		"%",
		"/",
		"?",
		";",
		"#",
		"'",
		"{",
		"}",
		"|",
		"\\",
		"^",
		"`",
		"<",
		">",
		"\"",
		"`",
		" ",
		"\r",
		"\n",
		"	"
	], p = [
		"/",
		"?",
		"#"
	], m = 255, h = /^[+a-z0-9A-Z_-]{0,63}$/, g = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, _ = {
		javascript: !0,
		"javascript:": !0
	}, v = {
		http: !0,
		https: !0,
		ftp: !0,
		gopher: !0,
		file: !0,
		"http:": !0,
		"https:": !0,
		"ftp:": !0,
		"gopher:": !0,
		"file:": !0
	};
	function y(e, t) {
		if (e && e instanceof c) return e;
		let n = new c();
		return n.parse(e, t), n;
	}
	c.prototype.parse = function(e, t) {
		let n, r, i, a = e;
		if (a = a.trim(), !t && e.split("#").length === 1) {
			let e = d.exec(a);
			if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
		}
		let o = l.exec(a);
		if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && _[o]) && (a = a.substr(2), this.slashes = !0)), !_[o] && (i || o && !v[o])) {
			let e = -1;
			for (let t = 0; t < p.length; t++) r = a.indexOf(p[t]), r !== -1 && (e === -1 || r < e) && (e = r);
			let t, n;
			n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
			for (let t = 0; t < f.length; t++) r = a.indexOf(f[t]), r !== -1 && (e === -1 || r < e) && (e = r);
			e === -1 && (e = a.length), a[e - 1] === ":" && e--;
			let i = a.slice(0, e);
			a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
			let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
			if (!o) {
				let e = this.hostname.split(/\./);
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					if (n && !n.match(h)) {
						let r = "";
						for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
						if (!r.match(h)) {
							let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(g);
							o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
							break;
						}
					}
				}
			}
			this.hostname.length > m && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
		}
		let s = a.indexOf("#");
		s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
		let c = a.indexOf("?");
		return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), v[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
	}, c.prototype.parseHost = function(e) {
		let t = u.exec(e);
		t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
	}, e.decode = r, e.encode = o, e.format = s, e.parse = y;
})), Qr = /* @__PURE__ */ d(((e) => {
	e.Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, e.Cc = /[\0-\x1F\x7F-\x9F]/, e.Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, e.P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, e.S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, e.Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
})), $r = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), ei = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), ti = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.replaceCodePoint = e.fromCodePoint = void 0;
	var t = /* @__PURE__ */ new Map([
		[0, 65533],
		[128, 8364],
		[130, 8218],
		[131, 402],
		[132, 8222],
		[133, 8230],
		[134, 8224],
		[135, 8225],
		[136, 710],
		[137, 8240],
		[138, 352],
		[139, 8249],
		[140, 338],
		[142, 381],
		[145, 8216],
		[146, 8217],
		[147, 8220],
		[148, 8221],
		[149, 8226],
		[150, 8211],
		[151, 8212],
		[152, 732],
		[153, 8482],
		[154, 353],
		[155, 8250],
		[156, 339],
		[158, 382],
		[159, 376]
	]);
	e.fromCodePoint = String.fromCodePoint ?? function(e) {
		var t = "";
		return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
	};
	function n(e) {
		return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : t.get(e) ?? e;
	}
	e.replaceCodePoint = n;
	function r(t) {
		return (0, e.fromCodePoint)(n(t));
	}
	e.default = r;
})), ni = /* @__PURE__ */ d(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__setModuleDefault || (Object.create ? (function(e, t) {
		Object.defineProperty(e, "default", {
			enumerable: !0,
			value: t
		});
	}) : function(e, t) {
		e.default = t;
	}), r = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var r = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && t(r, e, i);
		return n(r, e), r;
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXML = e.decodeHTMLStrict = e.decodeHTMLAttribute = e.decodeHTML = e.determineBranch = e.EntityDecoder = e.DecodingMode = e.BinTrieFlags = e.fromCodePoint = e.replaceCodePoint = e.decodeCodePoint = e.xmlDecodeTree = e.htmlDecodeTree = void 0;
	var a = i($r());
	e.htmlDecodeTree = a.default;
	var o = i(ei());
	e.xmlDecodeTree = o.default;
	var s = r(ti());
	e.decodeCodePoint = s.default;
	var c = ti();
	Object.defineProperty(e, "replaceCodePoint", {
		enumerable: !0,
		get: function() {
			return c.replaceCodePoint;
		}
	}), Object.defineProperty(e, "fromCodePoint", {
		enumerable: !0,
		get: function() {
			return c.fromCodePoint;
		}
	});
	var l;
	(function(e) {
		e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
	})(l ||= {});
	var u = 32, d;
	(function(e) {
		e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
	})(d = e.BinTrieFlags ||= {});
	function f(e) {
		return e >= l.ZERO && e <= l.NINE;
	}
	function p(e) {
		return e >= l.UPPER_A && e <= l.UPPER_F || e >= l.LOWER_A && e <= l.LOWER_F;
	}
	function m(e) {
		return e >= l.UPPER_A && e <= l.UPPER_Z || e >= l.LOWER_A && e <= l.LOWER_Z || f(e);
	}
	function h(e) {
		return e === l.EQUALS || m(e);
	}
	var g;
	(function(e) {
		e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
	})(g ||= {});
	var _;
	(function(e) {
		e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
	})(_ = e.DecodingMode ||= {});
	var v = function() {
		function e(e, t, n) {
			this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = g.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = _.Strict;
		}
		return e.prototype.startEntity = function(e) {
			this.decodeMode = e, this.state = g.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
		}, e.prototype.write = function(e, t) {
			switch (this.state) {
				case g.EntityStart: return e.charCodeAt(t) === l.NUM ? (this.state = g.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = g.NamedEntity, this.stateNamedEntity(e, t));
				case g.NumericStart: return this.stateNumericStart(e, t);
				case g.NumericDecimal: return this.stateNumericDecimal(e, t);
				case g.NumericHex: return this.stateNumericHex(e, t);
				case g.NamedEntity: return this.stateNamedEntity(e, t);
			}
		}, e.prototype.stateNumericStart = function(e, t) {
			return t >= e.length ? -1 : (e.charCodeAt(t) | u) === l.LOWER_X ? (this.state = g.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = g.NumericDecimal, this.stateNumericDecimal(e, t));
		}, e.prototype.addToNumericResult = function(e, t, n, r) {
			if (t !== n) {
				var i = n - t;
				this.result = this.result * r ** +i + parseInt(e.substr(t, i), r), this.consumed += i;
			}
		}, e.prototype.stateNumericHex = function(e, t) {
			for (var n = t; t < e.length;) {
				var r = e.charCodeAt(t);
				if (f(r) || p(r)) t += 1;
				else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
			}
			return this.addToNumericResult(e, n, t, 16), -1;
		}, e.prototype.stateNumericDecimal = function(e, t) {
			for (var n = t; t < e.length;) {
				var r = e.charCodeAt(t);
				if (f(r)) t += 1;
				else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
			}
			return this.addToNumericResult(e, n, t, 10), -1;
		}, e.prototype.emitNumericEntity = function(e, t) {
			var n;
			if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			if (e === l.SEMI) this.consumed += 1;
			else if (this.decodeMode === _.Strict) return 0;
			return this.emitCodePoint((0, s.replaceCodePoint)(this.result), this.consumed), this.errors && (e !== l.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
		}, e.prototype.stateNamedEntity = function(e, t) {
			for (var n = this.decodeTree, r = n[this.treeIndex], i = (r & d.VALUE_LENGTH) >> 14; t < e.length; t++, this.excess++) {
				var a = e.charCodeAt(t);
				if (this.treeIndex = b(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === _.Attribute && (i === 0 || h(a)) ? 0 : this.emitNotTerminatedNamedEntity();
				if (r = n[this.treeIndex], i = (r & d.VALUE_LENGTH) >> 14, i !== 0) {
					if (a === l.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
					this.decodeMode !== _.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
				}
			}
			return -1;
		}, e.prototype.emitNotTerminatedNamedEntity = function() {
			var e, t = this, n = t.result, r = (t.decodeTree[n] & d.VALUE_LENGTH) >> 14;
			return this.emitNamedEntityData(n, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
		}, e.prototype.emitNamedEntityData = function(e, t, n) {
			var r = this.decodeTree;
			return this.emitCodePoint(t === 1 ? r[e] & ~d.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
		}, e.prototype.end = function() {
			var e;
			switch (this.state) {
				case g.NamedEntity: return this.result !== 0 && (this.decodeMode !== _.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
				case g.NumericDecimal: return this.emitNumericEntity(0, 2);
				case g.NumericHex: return this.emitNumericEntity(0, 3);
				case g.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
				case g.EntityStart: return 0;
			}
		}, e;
	}();
	e.EntityDecoder = v;
	function y(e) {
		var t = "", n = new v(e, function(e) {
			return t += (0, s.fromCodePoint)(e);
		});
		return function(e, r) {
			for (var i = 0, a = 0; (a = e.indexOf("&", a)) >= 0;) {
				t += e.slice(i, a), n.startEntity(r);
				var o = n.write(e, a + 1);
				if (o < 0) {
					i = a + n.end();
					break;
				}
				i = a + o, a = o === 0 ? i + 1 : i;
			}
			var s = t + e.slice(i);
			return t = "", s;
		};
	}
	function b(e, t, n, r) {
		var i = (t & d.BRANCH_LENGTH) >> 7, a = t & d.JUMP_TABLE;
		if (i === 0) return a !== 0 && r === a ? n : -1;
		if (a) {
			var o = r - a;
			return o < 0 || o >= i ? -1 : e[n + o] - 1;
		}
		for (var s = n, c = s + i - 1; s <= c;) {
			var l = s + c >>> 1, u = e[l];
			if (u < r) s = l + 1;
			else if (u > r) c = l - 1;
			else return e[l + i];
		}
		return -1;
	}
	e.determineBranch = b;
	var x = y(a.default), S = y(o.default);
	function C(e, t) {
		return t === void 0 && (t = _.Legacy), x(e, t);
	}
	e.decodeHTML = C;
	function w(e) {
		return x(e, _.Attribute);
	}
	e.decodeHTMLAttribute = w;
	function T(e) {
		return x(e, _.Strict);
	}
	e.decodeHTMLStrict = T;
	function E(e) {
		return S(e, _.Strict);
	}
	e.decodeXML = E;
})), ri = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 });
	function t(e) {
		for (var t = 1; t < e.length; t++) e[t][0] += e[t - 1][0] + 1;
		return e;
	}
	e.default = new Map(/* #__PURE__ */ t([
		[9, "&Tab;"],
		[0, "&NewLine;"],
		[22, "&excl;"],
		[0, "&quot;"],
		[0, "&num;"],
		[0, "&dollar;"],
		[0, "&percnt;"],
		[0, "&amp;"],
		[0, "&apos;"],
		[0, "&lpar;"],
		[0, "&rpar;"],
		[0, "&ast;"],
		[0, "&plus;"],
		[0, "&comma;"],
		[1, "&period;"],
		[0, "&sol;"],
		[10, "&colon;"],
		[0, "&semi;"],
		[0, {
			v: "&lt;",
			n: 8402,
			o: "&nvlt;"
		}],
		[0, {
			v: "&equals;",
			n: 8421,
			o: "&bne;"
		}],
		[0, {
			v: "&gt;",
			n: 8402,
			o: "&nvgt;"
		}],
		[0, "&quest;"],
		[0, "&commat;"],
		[26, "&lbrack;"],
		[0, "&bsol;"],
		[0, "&rbrack;"],
		[0, "&Hat;"],
		[0, "&lowbar;"],
		[0, "&DiacriticalGrave;"],
		[5, {
			n: 106,
			o: "&fjlig;"
		}],
		[20, "&lbrace;"],
		[0, "&verbar;"],
		[0, "&rbrace;"],
		[34, "&nbsp;"],
		[0, "&iexcl;"],
		[0, "&cent;"],
		[0, "&pound;"],
		[0, "&curren;"],
		[0, "&yen;"],
		[0, "&brvbar;"],
		[0, "&sect;"],
		[0, "&die;"],
		[0, "&copy;"],
		[0, "&ordf;"],
		[0, "&laquo;"],
		[0, "&not;"],
		[0, "&shy;"],
		[0, "&circledR;"],
		[0, "&macr;"],
		[0, "&deg;"],
		[0, "&PlusMinus;"],
		[0, "&sup2;"],
		[0, "&sup3;"],
		[0, "&acute;"],
		[0, "&micro;"],
		[0, "&para;"],
		[0, "&centerdot;"],
		[0, "&cedil;"],
		[0, "&sup1;"],
		[0, "&ordm;"],
		[0, "&raquo;"],
		[0, "&frac14;"],
		[0, "&frac12;"],
		[0, "&frac34;"],
		[0, "&iquest;"],
		[0, "&Agrave;"],
		[0, "&Aacute;"],
		[0, "&Acirc;"],
		[0, "&Atilde;"],
		[0, "&Auml;"],
		[0, "&angst;"],
		[0, "&AElig;"],
		[0, "&Ccedil;"],
		[0, "&Egrave;"],
		[0, "&Eacute;"],
		[0, "&Ecirc;"],
		[0, "&Euml;"],
		[0, "&Igrave;"],
		[0, "&Iacute;"],
		[0, "&Icirc;"],
		[0, "&Iuml;"],
		[0, "&ETH;"],
		[0, "&Ntilde;"],
		[0, "&Ograve;"],
		[0, "&Oacute;"],
		[0, "&Ocirc;"],
		[0, "&Otilde;"],
		[0, "&Ouml;"],
		[0, "&times;"],
		[0, "&Oslash;"],
		[0, "&Ugrave;"],
		[0, "&Uacute;"],
		[0, "&Ucirc;"],
		[0, "&Uuml;"],
		[0, "&Yacute;"],
		[0, "&THORN;"],
		[0, "&szlig;"],
		[0, "&agrave;"],
		[0, "&aacute;"],
		[0, "&acirc;"],
		[0, "&atilde;"],
		[0, "&auml;"],
		[0, "&aring;"],
		[0, "&aelig;"],
		[0, "&ccedil;"],
		[0, "&egrave;"],
		[0, "&eacute;"],
		[0, "&ecirc;"],
		[0, "&euml;"],
		[0, "&igrave;"],
		[0, "&iacute;"],
		[0, "&icirc;"],
		[0, "&iuml;"],
		[0, "&eth;"],
		[0, "&ntilde;"],
		[0, "&ograve;"],
		[0, "&oacute;"],
		[0, "&ocirc;"],
		[0, "&otilde;"],
		[0, "&ouml;"],
		[0, "&div;"],
		[0, "&oslash;"],
		[0, "&ugrave;"],
		[0, "&uacute;"],
		[0, "&ucirc;"],
		[0, "&uuml;"],
		[0, "&yacute;"],
		[0, "&thorn;"],
		[0, "&yuml;"],
		[0, "&Amacr;"],
		[0, "&amacr;"],
		[0, "&Abreve;"],
		[0, "&abreve;"],
		[0, "&Aogon;"],
		[0, "&aogon;"],
		[0, "&Cacute;"],
		[0, "&cacute;"],
		[0, "&Ccirc;"],
		[0, "&ccirc;"],
		[0, "&Cdot;"],
		[0, "&cdot;"],
		[0, "&Ccaron;"],
		[0, "&ccaron;"],
		[0, "&Dcaron;"],
		[0, "&dcaron;"],
		[0, "&Dstrok;"],
		[0, "&dstrok;"],
		[0, "&Emacr;"],
		[0, "&emacr;"],
		[2, "&Edot;"],
		[0, "&edot;"],
		[0, "&Eogon;"],
		[0, "&eogon;"],
		[0, "&Ecaron;"],
		[0, "&ecaron;"],
		[0, "&Gcirc;"],
		[0, "&gcirc;"],
		[0, "&Gbreve;"],
		[0, "&gbreve;"],
		[0, "&Gdot;"],
		[0, "&gdot;"],
		[0, "&Gcedil;"],
		[1, "&Hcirc;"],
		[0, "&hcirc;"],
		[0, "&Hstrok;"],
		[0, "&hstrok;"],
		[0, "&Itilde;"],
		[0, "&itilde;"],
		[0, "&Imacr;"],
		[0, "&imacr;"],
		[2, "&Iogon;"],
		[0, "&iogon;"],
		[0, "&Idot;"],
		[0, "&imath;"],
		[0, "&IJlig;"],
		[0, "&ijlig;"],
		[0, "&Jcirc;"],
		[0, "&jcirc;"],
		[0, "&Kcedil;"],
		[0, "&kcedil;"],
		[0, "&kgreen;"],
		[0, "&Lacute;"],
		[0, "&lacute;"],
		[0, "&Lcedil;"],
		[0, "&lcedil;"],
		[0, "&Lcaron;"],
		[0, "&lcaron;"],
		[0, "&Lmidot;"],
		[0, "&lmidot;"],
		[0, "&Lstrok;"],
		[0, "&lstrok;"],
		[0, "&Nacute;"],
		[0, "&nacute;"],
		[0, "&Ncedil;"],
		[0, "&ncedil;"],
		[0, "&Ncaron;"],
		[0, "&ncaron;"],
		[0, "&napos;"],
		[0, "&ENG;"],
		[0, "&eng;"],
		[0, "&Omacr;"],
		[0, "&omacr;"],
		[2, "&Odblac;"],
		[0, "&odblac;"],
		[0, "&OElig;"],
		[0, "&oelig;"],
		[0, "&Racute;"],
		[0, "&racute;"],
		[0, "&Rcedil;"],
		[0, "&rcedil;"],
		[0, "&Rcaron;"],
		[0, "&rcaron;"],
		[0, "&Sacute;"],
		[0, "&sacute;"],
		[0, "&Scirc;"],
		[0, "&scirc;"],
		[0, "&Scedil;"],
		[0, "&scedil;"],
		[0, "&Scaron;"],
		[0, "&scaron;"],
		[0, "&Tcedil;"],
		[0, "&tcedil;"],
		[0, "&Tcaron;"],
		[0, "&tcaron;"],
		[0, "&Tstrok;"],
		[0, "&tstrok;"],
		[0, "&Utilde;"],
		[0, "&utilde;"],
		[0, "&Umacr;"],
		[0, "&umacr;"],
		[0, "&Ubreve;"],
		[0, "&ubreve;"],
		[0, "&Uring;"],
		[0, "&uring;"],
		[0, "&Udblac;"],
		[0, "&udblac;"],
		[0, "&Uogon;"],
		[0, "&uogon;"],
		[0, "&Wcirc;"],
		[0, "&wcirc;"],
		[0, "&Ycirc;"],
		[0, "&ycirc;"],
		[0, "&Yuml;"],
		[0, "&Zacute;"],
		[0, "&zacute;"],
		[0, "&Zdot;"],
		[0, "&zdot;"],
		[0, "&Zcaron;"],
		[0, "&zcaron;"],
		[19, "&fnof;"],
		[34, "&imped;"],
		[63, "&gacute;"],
		[65, "&jmath;"],
		[142, "&circ;"],
		[0, "&caron;"],
		[16, "&breve;"],
		[0, "&DiacriticalDot;"],
		[0, "&ring;"],
		[0, "&ogon;"],
		[0, "&DiacriticalTilde;"],
		[0, "&dblac;"],
		[51, "&DownBreve;"],
		[127, "&Alpha;"],
		[0, "&Beta;"],
		[0, "&Gamma;"],
		[0, "&Delta;"],
		[0, "&Epsilon;"],
		[0, "&Zeta;"],
		[0, "&Eta;"],
		[0, "&Theta;"],
		[0, "&Iota;"],
		[0, "&Kappa;"],
		[0, "&Lambda;"],
		[0, "&Mu;"],
		[0, "&Nu;"],
		[0, "&Xi;"],
		[0, "&Omicron;"],
		[0, "&Pi;"],
		[0, "&Rho;"],
		[1, "&Sigma;"],
		[0, "&Tau;"],
		[0, "&Upsilon;"],
		[0, "&Phi;"],
		[0, "&Chi;"],
		[0, "&Psi;"],
		[0, "&ohm;"],
		[7, "&alpha;"],
		[0, "&beta;"],
		[0, "&gamma;"],
		[0, "&delta;"],
		[0, "&epsi;"],
		[0, "&zeta;"],
		[0, "&eta;"],
		[0, "&theta;"],
		[0, "&iota;"],
		[0, "&kappa;"],
		[0, "&lambda;"],
		[0, "&mu;"],
		[0, "&nu;"],
		[0, "&xi;"],
		[0, "&omicron;"],
		[0, "&pi;"],
		[0, "&rho;"],
		[0, "&sigmaf;"],
		[0, "&sigma;"],
		[0, "&tau;"],
		[0, "&upsi;"],
		[0, "&phi;"],
		[0, "&chi;"],
		[0, "&psi;"],
		[0, "&omega;"],
		[7, "&thetasym;"],
		[0, "&Upsi;"],
		[2, "&phiv;"],
		[0, "&piv;"],
		[5, "&Gammad;"],
		[0, "&digamma;"],
		[18, "&kappav;"],
		[0, "&rhov;"],
		[3, "&epsiv;"],
		[0, "&backepsilon;"],
		[10, "&IOcy;"],
		[0, "&DJcy;"],
		[0, "&GJcy;"],
		[0, "&Jukcy;"],
		[0, "&DScy;"],
		[0, "&Iukcy;"],
		[0, "&YIcy;"],
		[0, "&Jsercy;"],
		[0, "&LJcy;"],
		[0, "&NJcy;"],
		[0, "&TSHcy;"],
		[0, "&KJcy;"],
		[1, "&Ubrcy;"],
		[0, "&DZcy;"],
		[0, "&Acy;"],
		[0, "&Bcy;"],
		[0, "&Vcy;"],
		[0, "&Gcy;"],
		[0, "&Dcy;"],
		[0, "&IEcy;"],
		[0, "&ZHcy;"],
		[0, "&Zcy;"],
		[0, "&Icy;"],
		[0, "&Jcy;"],
		[0, "&Kcy;"],
		[0, "&Lcy;"],
		[0, "&Mcy;"],
		[0, "&Ncy;"],
		[0, "&Ocy;"],
		[0, "&Pcy;"],
		[0, "&Rcy;"],
		[0, "&Scy;"],
		[0, "&Tcy;"],
		[0, "&Ucy;"],
		[0, "&Fcy;"],
		[0, "&KHcy;"],
		[0, "&TScy;"],
		[0, "&CHcy;"],
		[0, "&SHcy;"],
		[0, "&SHCHcy;"],
		[0, "&HARDcy;"],
		[0, "&Ycy;"],
		[0, "&SOFTcy;"],
		[0, "&Ecy;"],
		[0, "&YUcy;"],
		[0, "&YAcy;"],
		[0, "&acy;"],
		[0, "&bcy;"],
		[0, "&vcy;"],
		[0, "&gcy;"],
		[0, "&dcy;"],
		[0, "&iecy;"],
		[0, "&zhcy;"],
		[0, "&zcy;"],
		[0, "&icy;"],
		[0, "&jcy;"],
		[0, "&kcy;"],
		[0, "&lcy;"],
		[0, "&mcy;"],
		[0, "&ncy;"],
		[0, "&ocy;"],
		[0, "&pcy;"],
		[0, "&rcy;"],
		[0, "&scy;"],
		[0, "&tcy;"],
		[0, "&ucy;"],
		[0, "&fcy;"],
		[0, "&khcy;"],
		[0, "&tscy;"],
		[0, "&chcy;"],
		[0, "&shcy;"],
		[0, "&shchcy;"],
		[0, "&hardcy;"],
		[0, "&ycy;"],
		[0, "&softcy;"],
		[0, "&ecy;"],
		[0, "&yucy;"],
		[0, "&yacy;"],
		[1, "&iocy;"],
		[0, "&djcy;"],
		[0, "&gjcy;"],
		[0, "&jukcy;"],
		[0, "&dscy;"],
		[0, "&iukcy;"],
		[0, "&yicy;"],
		[0, "&jsercy;"],
		[0, "&ljcy;"],
		[0, "&njcy;"],
		[0, "&tshcy;"],
		[0, "&kjcy;"],
		[1, "&ubrcy;"],
		[0, "&dzcy;"],
		[7074, "&ensp;"],
		[0, "&emsp;"],
		[0, "&emsp13;"],
		[0, "&emsp14;"],
		[1, "&numsp;"],
		[0, "&puncsp;"],
		[0, "&ThinSpace;"],
		[0, "&hairsp;"],
		[0, "&NegativeMediumSpace;"],
		[0, "&zwnj;"],
		[0, "&zwj;"],
		[0, "&lrm;"],
		[0, "&rlm;"],
		[0, "&dash;"],
		[2, "&ndash;"],
		[0, "&mdash;"],
		[0, "&horbar;"],
		[0, "&Verbar;"],
		[1, "&lsquo;"],
		[0, "&CloseCurlyQuote;"],
		[0, "&lsquor;"],
		[1, "&ldquo;"],
		[0, "&CloseCurlyDoubleQuote;"],
		[0, "&bdquo;"],
		[1, "&dagger;"],
		[0, "&Dagger;"],
		[0, "&bull;"],
		[2, "&nldr;"],
		[0, "&hellip;"],
		[9, "&permil;"],
		[0, "&pertenk;"],
		[0, "&prime;"],
		[0, "&Prime;"],
		[0, "&tprime;"],
		[0, "&backprime;"],
		[3, "&lsaquo;"],
		[0, "&rsaquo;"],
		[3, "&oline;"],
		[2, "&caret;"],
		[1, "&hybull;"],
		[0, "&frasl;"],
		[10, "&bsemi;"],
		[7, "&qprime;"],
		[7, {
			v: "&MediumSpace;",
			n: 8202,
			o: "&ThickSpace;"
		}],
		[0, "&NoBreak;"],
		[0, "&af;"],
		[0, "&InvisibleTimes;"],
		[0, "&ic;"],
		[72, "&euro;"],
		[46, "&tdot;"],
		[0, "&DotDot;"],
		[37, "&complexes;"],
		[2, "&incare;"],
		[4, "&gscr;"],
		[0, "&hamilt;"],
		[0, "&Hfr;"],
		[0, "&Hopf;"],
		[0, "&planckh;"],
		[0, "&hbar;"],
		[0, "&imagline;"],
		[0, "&Ifr;"],
		[0, "&lagran;"],
		[0, "&ell;"],
		[1, "&naturals;"],
		[0, "&numero;"],
		[0, "&copysr;"],
		[0, "&weierp;"],
		[0, "&Popf;"],
		[0, "&Qopf;"],
		[0, "&realine;"],
		[0, "&real;"],
		[0, "&reals;"],
		[0, "&rx;"],
		[3, "&trade;"],
		[1, "&integers;"],
		[2, "&mho;"],
		[0, "&zeetrf;"],
		[0, "&iiota;"],
		[2, "&bernou;"],
		[0, "&Cayleys;"],
		[1, "&escr;"],
		[0, "&Escr;"],
		[0, "&Fouriertrf;"],
		[1, "&Mellintrf;"],
		[0, "&order;"],
		[0, "&alefsym;"],
		[0, "&beth;"],
		[0, "&gimel;"],
		[0, "&daleth;"],
		[12, "&CapitalDifferentialD;"],
		[0, "&dd;"],
		[0, "&ee;"],
		[0, "&ii;"],
		[10, "&frac13;"],
		[0, "&frac23;"],
		[0, "&frac15;"],
		[0, "&frac25;"],
		[0, "&frac35;"],
		[0, "&frac45;"],
		[0, "&frac16;"],
		[0, "&frac56;"],
		[0, "&frac18;"],
		[0, "&frac38;"],
		[0, "&frac58;"],
		[0, "&frac78;"],
		[49, "&larr;"],
		[0, "&ShortUpArrow;"],
		[0, "&rarr;"],
		[0, "&darr;"],
		[0, "&harr;"],
		[0, "&updownarrow;"],
		[0, "&nwarr;"],
		[0, "&nearr;"],
		[0, "&LowerRightArrow;"],
		[0, "&LowerLeftArrow;"],
		[0, "&nlarr;"],
		[0, "&nrarr;"],
		[1, {
			v: "&rarrw;",
			n: 824,
			o: "&nrarrw;"
		}],
		[0, "&Larr;"],
		[0, "&Uarr;"],
		[0, "&Rarr;"],
		[0, "&Darr;"],
		[0, "&larrtl;"],
		[0, "&rarrtl;"],
		[0, "&LeftTeeArrow;"],
		[0, "&mapstoup;"],
		[0, "&map;"],
		[0, "&DownTeeArrow;"],
		[1, "&hookleftarrow;"],
		[0, "&hookrightarrow;"],
		[0, "&larrlp;"],
		[0, "&looparrowright;"],
		[0, "&harrw;"],
		[0, "&nharr;"],
		[1, "&lsh;"],
		[0, "&rsh;"],
		[0, "&ldsh;"],
		[0, "&rdsh;"],
		[1, "&crarr;"],
		[0, "&cularr;"],
		[0, "&curarr;"],
		[2, "&circlearrowleft;"],
		[0, "&circlearrowright;"],
		[0, "&leftharpoonup;"],
		[0, "&DownLeftVector;"],
		[0, "&RightUpVector;"],
		[0, "&LeftUpVector;"],
		[0, "&rharu;"],
		[0, "&DownRightVector;"],
		[0, "&dharr;"],
		[0, "&dharl;"],
		[0, "&RightArrowLeftArrow;"],
		[0, "&udarr;"],
		[0, "&LeftArrowRightArrow;"],
		[0, "&leftleftarrows;"],
		[0, "&upuparrows;"],
		[0, "&rightrightarrows;"],
		[0, "&ddarr;"],
		[0, "&leftrightharpoons;"],
		[0, "&Equilibrium;"],
		[0, "&nlArr;"],
		[0, "&nhArr;"],
		[0, "&nrArr;"],
		[0, "&DoubleLeftArrow;"],
		[0, "&DoubleUpArrow;"],
		[0, "&DoubleRightArrow;"],
		[0, "&dArr;"],
		[0, "&DoubleLeftRightArrow;"],
		[0, "&DoubleUpDownArrow;"],
		[0, "&nwArr;"],
		[0, "&neArr;"],
		[0, "&seArr;"],
		[0, "&swArr;"],
		[0, "&lAarr;"],
		[0, "&rAarr;"],
		[1, "&zigrarr;"],
		[6, "&larrb;"],
		[0, "&rarrb;"],
		[15, "&DownArrowUpArrow;"],
		[7, "&loarr;"],
		[0, "&roarr;"],
		[0, "&hoarr;"],
		[0, "&forall;"],
		[0, "&comp;"],
		[0, {
			v: "&part;",
			n: 824,
			o: "&npart;"
		}],
		[0, "&exist;"],
		[0, "&nexist;"],
		[0, "&empty;"],
		[1, "&Del;"],
		[0, "&Element;"],
		[0, "&NotElement;"],
		[1, "&ni;"],
		[0, "&notni;"],
		[2, "&prod;"],
		[0, "&coprod;"],
		[0, "&sum;"],
		[0, "&minus;"],
		[0, "&MinusPlus;"],
		[0, "&dotplus;"],
		[1, "&Backslash;"],
		[0, "&lowast;"],
		[0, "&compfn;"],
		[1, "&radic;"],
		[2, "&prop;"],
		[0, "&infin;"],
		[0, "&angrt;"],
		[0, {
			v: "&ang;",
			n: 8402,
			o: "&nang;"
		}],
		[0, "&angmsd;"],
		[0, "&angsph;"],
		[0, "&mid;"],
		[0, "&nmid;"],
		[0, "&DoubleVerticalBar;"],
		[0, "&NotDoubleVerticalBar;"],
		[0, "&and;"],
		[0, "&or;"],
		[0, {
			v: "&cap;",
			n: 65024,
			o: "&caps;"
		}],
		[0, {
			v: "&cup;",
			n: 65024,
			o: "&cups;"
		}],
		[0, "&int;"],
		[0, "&Int;"],
		[0, "&iiint;"],
		[0, "&conint;"],
		[0, "&Conint;"],
		[0, "&Cconint;"],
		[0, "&cwint;"],
		[0, "&ClockwiseContourIntegral;"],
		[0, "&awconint;"],
		[0, "&there4;"],
		[0, "&becaus;"],
		[0, "&ratio;"],
		[0, "&Colon;"],
		[0, "&dotminus;"],
		[1, "&mDDot;"],
		[0, "&homtht;"],
		[0, {
			v: "&sim;",
			n: 8402,
			o: "&nvsim;"
		}],
		[0, {
			v: "&backsim;",
			n: 817,
			o: "&race;"
		}],
		[0, {
			v: "&ac;",
			n: 819,
			o: "&acE;"
		}],
		[0, "&acd;"],
		[0, "&VerticalTilde;"],
		[0, "&NotTilde;"],
		[0, {
			v: "&eqsim;",
			n: 824,
			o: "&nesim;"
		}],
		[0, "&sime;"],
		[0, "&NotTildeEqual;"],
		[0, "&cong;"],
		[0, "&simne;"],
		[0, "&ncong;"],
		[0, "&ap;"],
		[0, "&nap;"],
		[0, "&ape;"],
		[0, {
			v: "&apid;",
			n: 824,
			o: "&napid;"
		}],
		[0, "&backcong;"],
		[0, {
			v: "&asympeq;",
			n: 8402,
			o: "&nvap;"
		}],
		[0, {
			v: "&bump;",
			n: 824,
			o: "&nbump;"
		}],
		[0, {
			v: "&bumpe;",
			n: 824,
			o: "&nbumpe;"
		}],
		[0, {
			v: "&doteq;",
			n: 824,
			o: "&nedot;"
		}],
		[0, "&doteqdot;"],
		[0, "&efDot;"],
		[0, "&erDot;"],
		[0, "&Assign;"],
		[0, "&ecolon;"],
		[0, "&ecir;"],
		[0, "&circeq;"],
		[1, "&wedgeq;"],
		[0, "&veeeq;"],
		[1, "&triangleq;"],
		[2, "&equest;"],
		[0, "&ne;"],
		[0, {
			v: "&Congruent;",
			n: 8421,
			o: "&bnequiv;"
		}],
		[0, "&nequiv;"],
		[1, {
			v: "&le;",
			n: 8402,
			o: "&nvle;"
		}],
		[0, {
			v: "&ge;",
			n: 8402,
			o: "&nvge;"
		}],
		[0, {
			v: "&lE;",
			n: 824,
			o: "&nlE;"
		}],
		[0, {
			v: "&gE;",
			n: 824,
			o: "&ngE;"
		}],
		[0, {
			v: "&lnE;",
			n: 65024,
			o: "&lvertneqq;"
		}],
		[0, {
			v: "&gnE;",
			n: 65024,
			o: "&gvertneqq;"
		}],
		[0, {
			v: "&ll;",
			n: new Map(/* #__PURE__ */ t([[824, "&nLtv;"], [7577, "&nLt;"]]))
		}],
		[0, {
			v: "&gg;",
			n: new Map(/* #__PURE__ */ t([[824, "&nGtv;"], [7577, "&nGt;"]]))
		}],
		[0, "&between;"],
		[0, "&NotCupCap;"],
		[0, "&nless;"],
		[0, "&ngt;"],
		[0, "&nle;"],
		[0, "&nge;"],
		[0, "&lesssim;"],
		[0, "&GreaterTilde;"],
		[0, "&nlsim;"],
		[0, "&ngsim;"],
		[0, "&LessGreater;"],
		[0, "&gl;"],
		[0, "&NotLessGreater;"],
		[0, "&NotGreaterLess;"],
		[0, "&pr;"],
		[0, "&sc;"],
		[0, "&prcue;"],
		[0, "&sccue;"],
		[0, "&PrecedesTilde;"],
		[0, {
			v: "&scsim;",
			n: 824,
			o: "&NotSucceedsTilde;"
		}],
		[0, "&NotPrecedes;"],
		[0, "&NotSucceeds;"],
		[0, {
			v: "&sub;",
			n: 8402,
			o: "&NotSubset;"
		}],
		[0, {
			v: "&sup;",
			n: 8402,
			o: "&NotSuperset;"
		}],
		[0, "&nsub;"],
		[0, "&nsup;"],
		[0, "&sube;"],
		[0, "&supe;"],
		[0, "&NotSubsetEqual;"],
		[0, "&NotSupersetEqual;"],
		[0, {
			v: "&subne;",
			n: 65024,
			o: "&varsubsetneq;"
		}],
		[0, {
			v: "&supne;",
			n: 65024,
			o: "&varsupsetneq;"
		}],
		[1, "&cupdot;"],
		[0, "&UnionPlus;"],
		[0, {
			v: "&sqsub;",
			n: 824,
			o: "&NotSquareSubset;"
		}],
		[0, {
			v: "&sqsup;",
			n: 824,
			o: "&NotSquareSuperset;"
		}],
		[0, "&sqsube;"],
		[0, "&sqsupe;"],
		[0, {
			v: "&sqcap;",
			n: 65024,
			o: "&sqcaps;"
		}],
		[0, {
			v: "&sqcup;",
			n: 65024,
			o: "&sqcups;"
		}],
		[0, "&CirclePlus;"],
		[0, "&CircleMinus;"],
		[0, "&CircleTimes;"],
		[0, "&osol;"],
		[0, "&CircleDot;"],
		[0, "&circledcirc;"],
		[0, "&circledast;"],
		[1, "&circleddash;"],
		[0, "&boxplus;"],
		[0, "&boxminus;"],
		[0, "&boxtimes;"],
		[0, "&dotsquare;"],
		[0, "&RightTee;"],
		[0, "&dashv;"],
		[0, "&DownTee;"],
		[0, "&bot;"],
		[1, "&models;"],
		[0, "&DoubleRightTee;"],
		[0, "&Vdash;"],
		[0, "&Vvdash;"],
		[0, "&VDash;"],
		[0, "&nvdash;"],
		[0, "&nvDash;"],
		[0, "&nVdash;"],
		[0, "&nVDash;"],
		[0, "&prurel;"],
		[1, "&LeftTriangle;"],
		[0, "&RightTriangle;"],
		[0, {
			v: "&LeftTriangleEqual;",
			n: 8402,
			o: "&nvltrie;"
		}],
		[0, {
			v: "&RightTriangleEqual;",
			n: 8402,
			o: "&nvrtrie;"
		}],
		[0, "&origof;"],
		[0, "&imof;"],
		[0, "&multimap;"],
		[0, "&hercon;"],
		[0, "&intcal;"],
		[0, "&veebar;"],
		[1, "&barvee;"],
		[0, "&angrtvb;"],
		[0, "&lrtri;"],
		[0, "&bigwedge;"],
		[0, "&bigvee;"],
		[0, "&bigcap;"],
		[0, "&bigcup;"],
		[0, "&diam;"],
		[0, "&sdot;"],
		[0, "&sstarf;"],
		[0, "&divideontimes;"],
		[0, "&bowtie;"],
		[0, "&ltimes;"],
		[0, "&rtimes;"],
		[0, "&leftthreetimes;"],
		[0, "&rightthreetimes;"],
		[0, "&backsimeq;"],
		[0, "&curlyvee;"],
		[0, "&curlywedge;"],
		[0, "&Sub;"],
		[0, "&Sup;"],
		[0, "&Cap;"],
		[0, "&Cup;"],
		[0, "&fork;"],
		[0, "&epar;"],
		[0, "&lessdot;"],
		[0, "&gtdot;"],
		[0, {
			v: "&Ll;",
			n: 824,
			o: "&nLl;"
		}],
		[0, {
			v: "&Gg;",
			n: 824,
			o: "&nGg;"
		}],
		[0, {
			v: "&leg;",
			n: 65024,
			o: "&lesg;"
		}],
		[0, {
			v: "&gel;",
			n: 65024,
			o: "&gesl;"
		}],
		[2, "&cuepr;"],
		[0, "&cuesc;"],
		[0, "&NotPrecedesSlantEqual;"],
		[0, "&NotSucceedsSlantEqual;"],
		[0, "&NotSquareSubsetEqual;"],
		[0, "&NotSquareSupersetEqual;"],
		[2, "&lnsim;"],
		[0, "&gnsim;"],
		[0, "&precnsim;"],
		[0, "&scnsim;"],
		[0, "&nltri;"],
		[0, "&NotRightTriangle;"],
		[0, "&nltrie;"],
		[0, "&NotRightTriangleEqual;"],
		[0, "&vellip;"],
		[0, "&ctdot;"],
		[0, "&utdot;"],
		[0, "&dtdot;"],
		[0, "&disin;"],
		[0, "&isinsv;"],
		[0, "&isins;"],
		[0, {
			v: "&isindot;",
			n: 824,
			o: "&notindot;"
		}],
		[0, "&notinvc;"],
		[0, "&notinvb;"],
		[1, {
			v: "&isinE;",
			n: 824,
			o: "&notinE;"
		}],
		[0, "&nisd;"],
		[0, "&xnis;"],
		[0, "&nis;"],
		[0, "&notnivc;"],
		[0, "&notnivb;"],
		[6, "&barwed;"],
		[0, "&Barwed;"],
		[1, "&lceil;"],
		[0, "&rceil;"],
		[0, "&LeftFloor;"],
		[0, "&rfloor;"],
		[0, "&drcrop;"],
		[0, "&dlcrop;"],
		[0, "&urcrop;"],
		[0, "&ulcrop;"],
		[0, "&bnot;"],
		[1, "&profline;"],
		[0, "&profsurf;"],
		[1, "&telrec;"],
		[0, "&target;"],
		[5, "&ulcorn;"],
		[0, "&urcorn;"],
		[0, "&dlcorn;"],
		[0, "&drcorn;"],
		[2, "&frown;"],
		[0, "&smile;"],
		[9, "&cylcty;"],
		[0, "&profalar;"],
		[7, "&topbot;"],
		[6, "&ovbar;"],
		[1, "&solbar;"],
		[60, "&angzarr;"],
		[51, "&lmoustache;"],
		[0, "&rmoustache;"],
		[2, "&OverBracket;"],
		[0, "&bbrk;"],
		[0, "&bbrktbrk;"],
		[37, "&OverParenthesis;"],
		[0, "&UnderParenthesis;"],
		[0, "&OverBrace;"],
		[0, "&UnderBrace;"],
		[2, "&trpezium;"],
		[4, "&elinters;"],
		[59, "&blank;"],
		[164, "&circledS;"],
		[55, "&boxh;"],
		[1, "&boxv;"],
		[9, "&boxdr;"],
		[3, "&boxdl;"],
		[3, "&boxur;"],
		[3, "&boxul;"],
		[3, "&boxvr;"],
		[7, "&boxvl;"],
		[7, "&boxhd;"],
		[7, "&boxhu;"],
		[7, "&boxvh;"],
		[19, "&boxH;"],
		[0, "&boxV;"],
		[0, "&boxdR;"],
		[0, "&boxDr;"],
		[0, "&boxDR;"],
		[0, "&boxdL;"],
		[0, "&boxDl;"],
		[0, "&boxDL;"],
		[0, "&boxuR;"],
		[0, "&boxUr;"],
		[0, "&boxUR;"],
		[0, "&boxuL;"],
		[0, "&boxUl;"],
		[0, "&boxUL;"],
		[0, "&boxvR;"],
		[0, "&boxVr;"],
		[0, "&boxVR;"],
		[0, "&boxvL;"],
		[0, "&boxVl;"],
		[0, "&boxVL;"],
		[0, "&boxHd;"],
		[0, "&boxhD;"],
		[0, "&boxHD;"],
		[0, "&boxHu;"],
		[0, "&boxhU;"],
		[0, "&boxHU;"],
		[0, "&boxvH;"],
		[0, "&boxVh;"],
		[0, "&boxVH;"],
		[19, "&uhblk;"],
		[3, "&lhblk;"],
		[3, "&block;"],
		[8, "&blk14;"],
		[0, "&blk12;"],
		[0, "&blk34;"],
		[13, "&square;"],
		[8, "&blacksquare;"],
		[0, "&EmptyVerySmallSquare;"],
		[1, "&rect;"],
		[0, "&marker;"],
		[2, "&fltns;"],
		[1, "&bigtriangleup;"],
		[0, "&blacktriangle;"],
		[0, "&triangle;"],
		[2, "&blacktriangleright;"],
		[0, "&rtri;"],
		[3, "&bigtriangledown;"],
		[0, "&blacktriangledown;"],
		[0, "&dtri;"],
		[2, "&blacktriangleleft;"],
		[0, "&ltri;"],
		[6, "&loz;"],
		[0, "&cir;"],
		[32, "&tridot;"],
		[2, "&bigcirc;"],
		[8, "&ultri;"],
		[0, "&urtri;"],
		[0, "&lltri;"],
		[0, "&EmptySmallSquare;"],
		[0, "&FilledSmallSquare;"],
		[8, "&bigstar;"],
		[0, "&star;"],
		[7, "&phone;"],
		[49, "&female;"],
		[1, "&male;"],
		[29, "&spades;"],
		[2, "&clubs;"],
		[1, "&hearts;"],
		[0, "&diamondsuit;"],
		[3, "&sung;"],
		[2, "&flat;"],
		[0, "&natural;"],
		[0, "&sharp;"],
		[163, "&check;"],
		[3, "&cross;"],
		[8, "&malt;"],
		[21, "&sext;"],
		[33, "&VerticalSeparator;"],
		[25, "&lbbrk;"],
		[0, "&rbbrk;"],
		[84, "&bsolhsub;"],
		[0, "&suphsol;"],
		[28, "&LeftDoubleBracket;"],
		[0, "&RightDoubleBracket;"],
		[0, "&lang;"],
		[0, "&rang;"],
		[0, "&Lang;"],
		[0, "&Rang;"],
		[0, "&loang;"],
		[0, "&roang;"],
		[7, "&longleftarrow;"],
		[0, "&longrightarrow;"],
		[0, "&longleftrightarrow;"],
		[0, "&DoubleLongLeftArrow;"],
		[0, "&DoubleLongRightArrow;"],
		[0, "&DoubleLongLeftRightArrow;"],
		[1, "&longmapsto;"],
		[2, "&dzigrarr;"],
		[258, "&nvlArr;"],
		[0, "&nvrArr;"],
		[0, "&nvHarr;"],
		[0, "&Map;"],
		[6, "&lbarr;"],
		[0, "&bkarow;"],
		[0, "&lBarr;"],
		[0, "&dbkarow;"],
		[0, "&drbkarow;"],
		[0, "&DDotrahd;"],
		[0, "&UpArrowBar;"],
		[0, "&DownArrowBar;"],
		[2, "&Rarrtl;"],
		[2, "&latail;"],
		[0, "&ratail;"],
		[0, "&lAtail;"],
		[0, "&rAtail;"],
		[0, "&larrfs;"],
		[0, "&rarrfs;"],
		[0, "&larrbfs;"],
		[0, "&rarrbfs;"],
		[2, "&nwarhk;"],
		[0, "&nearhk;"],
		[0, "&hksearow;"],
		[0, "&hkswarow;"],
		[0, "&nwnear;"],
		[0, "&nesear;"],
		[0, "&seswar;"],
		[0, "&swnwar;"],
		[8, {
			v: "&rarrc;",
			n: 824,
			o: "&nrarrc;"
		}],
		[1, "&cudarrr;"],
		[0, "&ldca;"],
		[0, "&rdca;"],
		[0, "&cudarrl;"],
		[0, "&larrpl;"],
		[2, "&curarrm;"],
		[0, "&cularrp;"],
		[7, "&rarrpl;"],
		[2, "&harrcir;"],
		[0, "&Uarrocir;"],
		[0, "&lurdshar;"],
		[0, "&ldrushar;"],
		[2, "&LeftRightVector;"],
		[0, "&RightUpDownVector;"],
		[0, "&DownLeftRightVector;"],
		[0, "&LeftUpDownVector;"],
		[0, "&LeftVectorBar;"],
		[0, "&RightVectorBar;"],
		[0, "&RightUpVectorBar;"],
		[0, "&RightDownVectorBar;"],
		[0, "&DownLeftVectorBar;"],
		[0, "&DownRightVectorBar;"],
		[0, "&LeftUpVectorBar;"],
		[0, "&LeftDownVectorBar;"],
		[0, "&LeftTeeVector;"],
		[0, "&RightTeeVector;"],
		[0, "&RightUpTeeVector;"],
		[0, "&RightDownTeeVector;"],
		[0, "&DownLeftTeeVector;"],
		[0, "&DownRightTeeVector;"],
		[0, "&LeftUpTeeVector;"],
		[0, "&LeftDownTeeVector;"],
		[0, "&lHar;"],
		[0, "&uHar;"],
		[0, "&rHar;"],
		[0, "&dHar;"],
		[0, "&luruhar;"],
		[0, "&ldrdhar;"],
		[0, "&ruluhar;"],
		[0, "&rdldhar;"],
		[0, "&lharul;"],
		[0, "&llhard;"],
		[0, "&rharul;"],
		[0, "&lrhard;"],
		[0, "&udhar;"],
		[0, "&duhar;"],
		[0, "&RoundImplies;"],
		[0, "&erarr;"],
		[0, "&simrarr;"],
		[0, "&larrsim;"],
		[0, "&rarrsim;"],
		[0, "&rarrap;"],
		[0, "&ltlarr;"],
		[1, "&gtrarr;"],
		[0, "&subrarr;"],
		[1, "&suplarr;"],
		[0, "&lfisht;"],
		[0, "&rfisht;"],
		[0, "&ufisht;"],
		[0, "&dfisht;"],
		[5, "&lopar;"],
		[0, "&ropar;"],
		[4, "&lbrke;"],
		[0, "&rbrke;"],
		[0, "&lbrkslu;"],
		[0, "&rbrksld;"],
		[0, "&lbrksld;"],
		[0, "&rbrkslu;"],
		[0, "&langd;"],
		[0, "&rangd;"],
		[0, "&lparlt;"],
		[0, "&rpargt;"],
		[0, "&gtlPar;"],
		[0, "&ltrPar;"],
		[3, "&vzigzag;"],
		[1, "&vangrt;"],
		[0, "&angrtvbd;"],
		[6, "&ange;"],
		[0, "&range;"],
		[0, "&dwangle;"],
		[0, "&uwangle;"],
		[0, "&angmsdaa;"],
		[0, "&angmsdab;"],
		[0, "&angmsdac;"],
		[0, "&angmsdad;"],
		[0, "&angmsdae;"],
		[0, "&angmsdaf;"],
		[0, "&angmsdag;"],
		[0, "&angmsdah;"],
		[0, "&bemptyv;"],
		[0, "&demptyv;"],
		[0, "&cemptyv;"],
		[0, "&raemptyv;"],
		[0, "&laemptyv;"],
		[0, "&ohbar;"],
		[0, "&omid;"],
		[0, "&opar;"],
		[1, "&operp;"],
		[1, "&olcross;"],
		[0, "&odsold;"],
		[1, "&olcir;"],
		[0, "&ofcir;"],
		[0, "&olt;"],
		[0, "&ogt;"],
		[0, "&cirscir;"],
		[0, "&cirE;"],
		[0, "&solb;"],
		[0, "&bsolb;"],
		[3, "&boxbox;"],
		[3, "&trisb;"],
		[0, "&rtriltri;"],
		[0, {
			v: "&LeftTriangleBar;",
			n: 824,
			o: "&NotLeftTriangleBar;"
		}],
		[0, {
			v: "&RightTriangleBar;",
			n: 824,
			o: "&NotRightTriangleBar;"
		}],
		[11, "&iinfin;"],
		[0, "&infintie;"],
		[0, "&nvinfin;"],
		[4, "&eparsl;"],
		[0, "&smeparsl;"],
		[0, "&eqvparsl;"],
		[5, "&blacklozenge;"],
		[8, "&RuleDelayed;"],
		[1, "&dsol;"],
		[9, "&bigodot;"],
		[0, "&bigoplus;"],
		[0, "&bigotimes;"],
		[1, "&biguplus;"],
		[1, "&bigsqcup;"],
		[5, "&iiiint;"],
		[0, "&fpartint;"],
		[2, "&cirfnint;"],
		[0, "&awint;"],
		[0, "&rppolint;"],
		[0, "&scpolint;"],
		[0, "&npolint;"],
		[0, "&pointint;"],
		[0, "&quatint;"],
		[0, "&intlarhk;"],
		[10, "&pluscir;"],
		[0, "&plusacir;"],
		[0, "&simplus;"],
		[0, "&plusdu;"],
		[0, "&plussim;"],
		[0, "&plustwo;"],
		[1, "&mcomma;"],
		[0, "&minusdu;"],
		[2, "&loplus;"],
		[0, "&roplus;"],
		[0, "&Cross;"],
		[0, "&timesd;"],
		[0, "&timesbar;"],
		[1, "&smashp;"],
		[0, "&lotimes;"],
		[0, "&rotimes;"],
		[0, "&otimesas;"],
		[0, "&Otimes;"],
		[0, "&odiv;"],
		[0, "&triplus;"],
		[0, "&triminus;"],
		[0, "&tritime;"],
		[0, "&intprod;"],
		[2, "&amalg;"],
		[0, "&capdot;"],
		[1, "&ncup;"],
		[0, "&ncap;"],
		[0, "&capand;"],
		[0, "&cupor;"],
		[0, "&cupcap;"],
		[0, "&capcup;"],
		[0, "&cupbrcap;"],
		[0, "&capbrcup;"],
		[0, "&cupcup;"],
		[0, "&capcap;"],
		[0, "&ccups;"],
		[0, "&ccaps;"],
		[2, "&ccupssm;"],
		[2, "&And;"],
		[0, "&Or;"],
		[0, "&andand;"],
		[0, "&oror;"],
		[0, "&orslope;"],
		[0, "&andslope;"],
		[1, "&andv;"],
		[0, "&orv;"],
		[0, "&andd;"],
		[0, "&ord;"],
		[1, "&wedbar;"],
		[6, "&sdote;"],
		[3, "&simdot;"],
		[2, {
			v: "&congdot;",
			n: 824,
			o: "&ncongdot;"
		}],
		[0, "&easter;"],
		[0, "&apacir;"],
		[0, {
			v: "&apE;",
			n: 824,
			o: "&napE;"
		}],
		[0, "&eplus;"],
		[0, "&pluse;"],
		[0, "&Esim;"],
		[0, "&Colone;"],
		[0, "&Equal;"],
		[1, "&ddotseq;"],
		[0, "&equivDD;"],
		[0, "&ltcir;"],
		[0, "&gtcir;"],
		[0, "&ltquest;"],
		[0, "&gtquest;"],
		[0, {
			v: "&leqslant;",
			n: 824,
			o: "&nleqslant;"
		}],
		[0, {
			v: "&geqslant;",
			n: 824,
			o: "&ngeqslant;"
		}],
		[0, "&lesdot;"],
		[0, "&gesdot;"],
		[0, "&lesdoto;"],
		[0, "&gesdoto;"],
		[0, "&lesdotor;"],
		[0, "&gesdotol;"],
		[0, "&lap;"],
		[0, "&gap;"],
		[0, "&lne;"],
		[0, "&gne;"],
		[0, "&lnap;"],
		[0, "&gnap;"],
		[0, "&lEg;"],
		[0, "&gEl;"],
		[0, "&lsime;"],
		[0, "&gsime;"],
		[0, "&lsimg;"],
		[0, "&gsiml;"],
		[0, "&lgE;"],
		[0, "&glE;"],
		[0, "&lesges;"],
		[0, "&gesles;"],
		[0, "&els;"],
		[0, "&egs;"],
		[0, "&elsdot;"],
		[0, "&egsdot;"],
		[0, "&el;"],
		[0, "&eg;"],
		[2, "&siml;"],
		[0, "&simg;"],
		[0, "&simlE;"],
		[0, "&simgE;"],
		[0, {
			v: "&LessLess;",
			n: 824,
			o: "&NotNestedLessLess;"
		}],
		[0, {
			v: "&GreaterGreater;",
			n: 824,
			o: "&NotNestedGreaterGreater;"
		}],
		[1, "&glj;"],
		[0, "&gla;"],
		[0, "&ltcc;"],
		[0, "&gtcc;"],
		[0, "&lescc;"],
		[0, "&gescc;"],
		[0, "&smt;"],
		[0, "&lat;"],
		[0, {
			v: "&smte;",
			n: 65024,
			o: "&smtes;"
		}],
		[0, {
			v: "&late;",
			n: 65024,
			o: "&lates;"
		}],
		[0, "&bumpE;"],
		[0, {
			v: "&PrecedesEqual;",
			n: 824,
			o: "&NotPrecedesEqual;"
		}],
		[0, {
			v: "&sce;",
			n: 824,
			o: "&NotSucceedsEqual;"
		}],
		[2, "&prE;"],
		[0, "&scE;"],
		[0, "&precneqq;"],
		[0, "&scnE;"],
		[0, "&prap;"],
		[0, "&scap;"],
		[0, "&precnapprox;"],
		[0, "&scnap;"],
		[0, "&Pr;"],
		[0, "&Sc;"],
		[0, "&subdot;"],
		[0, "&supdot;"],
		[0, "&subplus;"],
		[0, "&supplus;"],
		[0, "&submult;"],
		[0, "&supmult;"],
		[0, "&subedot;"],
		[0, "&supedot;"],
		[0, {
			v: "&subE;",
			n: 824,
			o: "&nsubE;"
		}],
		[0, {
			v: "&supE;",
			n: 824,
			o: "&nsupE;"
		}],
		[0, "&subsim;"],
		[0, "&supsim;"],
		[2, {
			v: "&subnE;",
			n: 65024,
			o: "&varsubsetneqq;"
		}],
		[0, {
			v: "&supnE;",
			n: 65024,
			o: "&varsupsetneqq;"
		}],
		[2, "&csub;"],
		[0, "&csup;"],
		[0, "&csube;"],
		[0, "&csupe;"],
		[0, "&subsup;"],
		[0, "&supsub;"],
		[0, "&subsub;"],
		[0, "&supsup;"],
		[0, "&suphsub;"],
		[0, "&supdsub;"],
		[0, "&forkv;"],
		[0, "&topfork;"],
		[0, "&mlcp;"],
		[8, "&Dashv;"],
		[1, "&Vdashl;"],
		[0, "&Barv;"],
		[0, "&vBar;"],
		[0, "&vBarv;"],
		[1, "&Vbar;"],
		[0, "&Not;"],
		[0, "&bNot;"],
		[0, "&rnmid;"],
		[0, "&cirmid;"],
		[0, "&midcir;"],
		[0, "&topcir;"],
		[0, "&nhpar;"],
		[0, "&parsim;"],
		[9, {
			v: "&parsl;",
			n: 8421,
			o: "&nparsl;"
		}],
		[44343, { n: new Map(/* #__PURE__ */ t([
			[56476, "&Ascr;"],
			[1, "&Cscr;"],
			[0, "&Dscr;"],
			[2, "&Gscr;"],
			[2, "&Jscr;"],
			[0, "&Kscr;"],
			[2, "&Nscr;"],
			[0, "&Oscr;"],
			[0, "&Pscr;"],
			[0, "&Qscr;"],
			[1, "&Sscr;"],
			[0, "&Tscr;"],
			[0, "&Uscr;"],
			[0, "&Vscr;"],
			[0, "&Wscr;"],
			[0, "&Xscr;"],
			[0, "&Yscr;"],
			[0, "&Zscr;"],
			[0, "&ascr;"],
			[0, "&bscr;"],
			[0, "&cscr;"],
			[0, "&dscr;"],
			[1, "&fscr;"],
			[1, "&hscr;"],
			[0, "&iscr;"],
			[0, "&jscr;"],
			[0, "&kscr;"],
			[0, "&lscr;"],
			[0, "&mscr;"],
			[0, "&nscr;"],
			[1, "&pscr;"],
			[0, "&qscr;"],
			[0, "&rscr;"],
			[0, "&sscr;"],
			[0, "&tscr;"],
			[0, "&uscr;"],
			[0, "&vscr;"],
			[0, "&wscr;"],
			[0, "&xscr;"],
			[0, "&yscr;"],
			[0, "&zscr;"],
			[52, "&Afr;"],
			[0, "&Bfr;"],
			[1, "&Dfr;"],
			[0, "&Efr;"],
			[0, "&Ffr;"],
			[0, "&Gfr;"],
			[2, "&Jfr;"],
			[0, "&Kfr;"],
			[0, "&Lfr;"],
			[0, "&Mfr;"],
			[0, "&Nfr;"],
			[0, "&Ofr;"],
			[0, "&Pfr;"],
			[0, "&Qfr;"],
			[1, "&Sfr;"],
			[0, "&Tfr;"],
			[0, "&Ufr;"],
			[0, "&Vfr;"],
			[0, "&Wfr;"],
			[0, "&Xfr;"],
			[0, "&Yfr;"],
			[1, "&afr;"],
			[0, "&bfr;"],
			[0, "&cfr;"],
			[0, "&dfr;"],
			[0, "&efr;"],
			[0, "&ffr;"],
			[0, "&gfr;"],
			[0, "&hfr;"],
			[0, "&ifr;"],
			[0, "&jfr;"],
			[0, "&kfr;"],
			[0, "&lfr;"],
			[0, "&mfr;"],
			[0, "&nfr;"],
			[0, "&ofr;"],
			[0, "&pfr;"],
			[0, "&qfr;"],
			[0, "&rfr;"],
			[0, "&sfr;"],
			[0, "&tfr;"],
			[0, "&ufr;"],
			[0, "&vfr;"],
			[0, "&wfr;"],
			[0, "&xfr;"],
			[0, "&yfr;"],
			[0, "&zfr;"],
			[0, "&Aopf;"],
			[0, "&Bopf;"],
			[1, "&Dopf;"],
			[0, "&Eopf;"],
			[0, "&Fopf;"],
			[0, "&Gopf;"],
			[1, "&Iopf;"],
			[0, "&Jopf;"],
			[0, "&Kopf;"],
			[0, "&Lopf;"],
			[0, "&Mopf;"],
			[1, "&Oopf;"],
			[3, "&Sopf;"],
			[0, "&Topf;"],
			[0, "&Uopf;"],
			[0, "&Vopf;"],
			[0, "&Wopf;"],
			[0, "&Xopf;"],
			[0, "&Yopf;"],
			[1, "&aopf;"],
			[0, "&bopf;"],
			[0, "&copf;"],
			[0, "&dopf;"],
			[0, "&eopf;"],
			[0, "&fopf;"],
			[0, "&gopf;"],
			[0, "&hopf;"],
			[0, "&iopf;"],
			[0, "&jopf;"],
			[0, "&kopf;"],
			[0, "&lopf;"],
			[0, "&mopf;"],
			[0, "&nopf;"],
			[0, "&oopf;"],
			[0, "&popf;"],
			[0, "&qopf;"],
			[0, "&ropf;"],
			[0, "&sopf;"],
			[0, "&topf;"],
			[0, "&uopf;"],
			[0, "&vopf;"],
			[0, "&wopf;"],
			[0, "&xopf;"],
			[0, "&yopf;"],
			[0, "&zopf;"]
		])) }],
		[8906, "&fflig;"],
		[0, "&filig;"],
		[0, "&fllig;"],
		[0, "&ffilig;"],
		[0, "&ffllig;"]
	]));
})), ii = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.getCodePoint = e.xmlReplacer = void 0, e.xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
	var t = /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[39, "&apos;"],
		[60, "&lt;"],
		[62, "&gt;"]
	]);
	e.getCodePoint = String.prototype.codePointAt == null ? function(e, t) {
		return (e.charCodeAt(t) & 64512) == 55296 ? (e.charCodeAt(t) - 55296) * 1024 + e.charCodeAt(t + 1) - 56320 + 65536 : e.charCodeAt(t);
	} : function(e, t) {
		return e.codePointAt(t);
	};
	function n(n) {
		for (var r = "", i = 0, a; (a = e.xmlReplacer.exec(n)) !== null;) {
			var o = a.index, s = n.charCodeAt(o), c = t.get(s);
			c === void 0 ? (r += `${n.substring(i, o)}&#x${(0, e.getCodePoint)(n, o).toString(16)};`, i = e.xmlReplacer.lastIndex += Number((s & 64512) == 55296)) : (r += n.substring(i, o) + c, i = o + 1);
		}
		return r + n.substr(i);
	}
	e.encodeXML = n, e.escape = n;
	function r(e, t) {
		return function(n) {
			for (var r, i = 0, a = ""; r = e.exec(n);) i !== r.index && (a += n.substring(i, r.index)), a += t.get(r[0].charCodeAt(0)), i = r.index + 1;
			return a + n.substring(i);
		};
	}
	e.escapeUTF8 = r(/[&<>'"]/g, t), e.escapeAttribute = r(/["&\u00A0]/g, /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[160, "&nbsp;"]
	])), e.escapeText = r(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
		[38, "&amp;"],
		[60, "&lt;"],
		[62, "&gt;"],
		[160, "&nbsp;"]
	]));
})), ai = /* @__PURE__ */ d(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.encodeNonAsciiHTML = e.encodeHTML = void 0;
	var n = t(ri()), r = ii(), i = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
	function a(e) {
		return s(i, e);
	}
	e.encodeHTML = a;
	function o(e) {
		return s(r.xmlReplacer, e);
	}
	e.encodeNonAsciiHTML = o;
	function s(e, t) {
		for (var i = "", a = 0, o; (o = e.exec(t)) !== null;) {
			var s = o.index;
			i += t.substring(a, s);
			var c = t.charCodeAt(s), l = n.default.get(c);
			if (typeof l == "object") {
				if (s + 1 < t.length) {
					var u = t.charCodeAt(s + 1), d = typeof l.n == "number" ? l.n === u ? l.o : void 0 : l.n.get(u);
					if (d !== void 0) {
						i += d, a = e.lastIndex += 1;
						continue;
					}
				}
				l = l.v;
			}
			if (l !== void 0) i += l, a = s + 1;
			else {
				var f = (0, r.getCodePoint)(t, s);
				i += `&#x${f.toString(16)};`, a = e.lastIndex += Number(f !== c);
			}
		}
		return i + t.substr(a);
	}
})), oi = /* @__PURE__ */ d(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXMLStrict = e.decodeHTML5Strict = e.decodeHTML4Strict = e.decodeHTML5 = e.decodeHTML4 = e.decodeHTMLAttribute = e.decodeHTMLStrict = e.decodeHTML = e.decodeXML = e.DecodingMode = e.EntityDecoder = e.encodeHTML5 = e.encodeHTML4 = e.encodeNonAsciiHTML = e.encodeHTML = e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.encode = e.decodeStrict = e.decode = e.EncodingMode = e.EntityLevel = void 0;
	var t = ni(), n = ai(), r = ii(), i;
	(function(e) {
		e[e.XML = 0] = "XML", e[e.HTML = 1] = "HTML";
	})(i = e.EntityLevel ||= {});
	var a;
	(function(e) {
		e[e.UTF8 = 0] = "UTF8", e[e.ASCII = 1] = "ASCII", e[e.Extensive = 2] = "Extensive", e[e.Attribute = 3] = "Attribute", e[e.Text = 4] = "Text";
	})(a = e.EncodingMode ||= {});
	function o(e, n) {
		if (n === void 0 && (n = i.XML), (typeof n == "number" ? n : n.level) === i.HTML) {
			var r = typeof n == "object" ? n.mode : void 0;
			return (0, t.decodeHTML)(e, r);
		}
		return (0, t.decodeXML)(e);
	}
	e.decode = o;
	function s(e, n) {
		n === void 0 && (n = i.XML);
		var r = typeof n == "number" ? { level: n } : n;
		return r.mode ??= t.DecodingMode.Strict, o(e, r);
	}
	e.decodeStrict = s;
	function c(e, t) {
		t === void 0 && (t = i.XML);
		var o = typeof t == "number" ? { level: t } : t;
		return o.mode === a.UTF8 ? (0, r.escapeUTF8)(e) : o.mode === a.Attribute ? (0, r.escapeAttribute)(e) : o.mode === a.Text ? (0, r.escapeText)(e) : o.level === i.HTML ? o.mode === a.ASCII ? (0, n.encodeNonAsciiHTML)(e) : (0, n.encodeHTML)(e) : (0, r.encodeXML)(e);
	}
	e.encode = c;
	var l = ii();
	Object.defineProperty(e, "encodeXML", {
		enumerable: !0,
		get: function() {
			return l.encodeXML;
		}
	}), Object.defineProperty(e, "escape", {
		enumerable: !0,
		get: function() {
			return l.escape;
		}
	}), Object.defineProperty(e, "escapeUTF8", {
		enumerable: !0,
		get: function() {
			return l.escapeUTF8;
		}
	}), Object.defineProperty(e, "escapeAttribute", {
		enumerable: !0,
		get: function() {
			return l.escapeAttribute;
		}
	}), Object.defineProperty(e, "escapeText", {
		enumerable: !0,
		get: function() {
			return l.escapeText;
		}
	});
	var u = ai();
	Object.defineProperty(e, "encodeHTML", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeNonAsciiHTML", {
		enumerable: !0,
		get: function() {
			return u.encodeNonAsciiHTML;
		}
	}), Object.defineProperty(e, "encodeHTML4", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeHTML5", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	});
	var d = ni();
	Object.defineProperty(e, "EntityDecoder", {
		enumerable: !0,
		get: function() {
			return d.EntityDecoder;
		}
	}), Object.defineProperty(e, "DecodingMode", {
		enumerable: !0,
		get: function() {
			return d.DecodingMode;
		}
	}), Object.defineProperty(e, "decodeXML", {
		enumerable: !0,
		get: function() {
			return d.decodeXML;
		}
	}), Object.defineProperty(e, "decodeHTML", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTMLStrict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTMLAttribute", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLAttribute;
		}
	}), Object.defineProperty(e, "decodeHTML4", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML5", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML4Strict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTML5Strict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeXMLStrict", {
		enumerable: !0,
		get: function() {
			return d.decodeXML;
		}
	});
})), si = /* @__PURE__ */ d(((e, t) => {
	var n = Qr();
	function r(e) {
		let t = {};
		e ||= {}, t.src_Any = n.Any.source, t.src_Cc = n.Cc.source, t.src_Z = n.Z.source, t.src_P = n.P.source, t.src_ZPCc = [
			t.src_Z,
			t.src_P,
			t.src_Cc
		].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
		let r = "[><｜]";
		return t.src_pseudo_letter = `(?:(?!${r}|${t.src_ZPCc})${t.src_Any})`, t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = `(?=$|${r}|${t.src_ZPCc})(?!${e["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`, t.src_path = `(?:[/?#](?:(?!${t.src_ZCc}|${r}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`, t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + `|${t.src_pseudo_letter}{1,63})`, t.src_domain = "(?:" + t.src_xn + `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`, t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`, t.tpl_host_fuzzy = "(?:" + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`, t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`, t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`, t.tpl_email_fuzzy = `(^|${r}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`, t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`, t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`, t;
	}
	function i(e) {
		return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
			t && Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}), e;
	}
	function a(e) {
		return Object.prototype.toString.call(e);
	}
	function o(e) {
		return a(e) === "[object String]";
	}
	function s(e) {
		return a(e) === "[object Object]";
	}
	function c(e) {
		return a(e) === "[object RegExp]";
	}
	function l(e) {
		return a(e) === "[object Function]";
	}
	function u(e) {
		return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
	var d = {
		fuzzyLink: !0,
		fuzzyEmail: !0,
		fuzzyIP: !1
	};
	function f(e) {
		return Object.keys(e || {}).reduce(function(e, t) {
			return e || d.hasOwnProperty(t);
		}, !1);
	}
	var p = {
		"http:": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.http || (n.re.http = RegExp(`^\\/\\/${n.re.src_auth}${n.re.src_host_port_strict}${n.re.src_path}`, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
		} },
		"https:": "http:",
		"ftp:": "http:",
		"//": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.no_http || (n.re.no_http = RegExp("^" + n.re.src_auth + `(?:localhost|(?:(?:${n.re.src_domain})\\.)+${n.re.src_domain_root})` + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
		} },
		"mailto:": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.mailto || (n.re.mailto = RegExp(`^${n.re.src_email_name}@${n.re.src_host_strict}`, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
		} }
	}, m = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", h = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
	function g(e) {
		return function(t, n) {
			let r = t.slice(n);
			return e.test(r) ? r.match(e)[0].length : 0;
		};
	}
	function _() {
		return function(e, t) {
			t.normalize(e);
		};
	}
	function v(e) {
		let t = e.re = r(e.__opts__), n = e.__tlds__.slice();
		e.onCompile(), e.__tlds_replaced__ || n.push(m), n.push(t.src_xn), t.src_tlds = n.join("|");
		function i(e) {
			return e.replace("%TLDS%", t.src_tlds);
		}
		t.email_fuzzy = RegExp(i(t.tpl_email_fuzzy), "i"), t.email_fuzzy_global = RegExp(i(t.tpl_email_fuzzy), "ig"), t.link_fuzzy = RegExp(i(t.tpl_link_fuzzy), "i"), t.link_fuzzy_global = RegExp(i(t.tpl_link_fuzzy), "ig"), t.link_no_ip_fuzzy = RegExp(i(t.tpl_link_no_ip_fuzzy), "i"), t.link_no_ip_fuzzy_global = RegExp(i(t.tpl_link_no_ip_fuzzy), "ig"), t.host_fuzzy_test = RegExp(i(t.tpl_host_fuzzy_test), "i");
		let a = [];
		e.__compiled__ = {};
		function d(e, t) {
			throw Error(`(LinkifyIt) Invalid schema "${e}": ${t}`);
		}
		Object.keys(e.__schemas__).forEach(function(t) {
			let n = e.__schemas__[t];
			if (n === null) return;
			let r = {
				validate: null,
				link: null
			};
			if (e.__compiled__[t] = r, s(n)) {
				c(n.validate) ? r.validate = g(n.validate) : l(n.validate) ? r.validate = n.validate : d(t, n), l(n.normalize) ? r.normalize = n.normalize : n.normalize ? d(t, n) : r.normalize = _();
				return;
			}
			if (o(n)) {
				a.push(t);
				return;
			}
			d(t, n);
		}), a.forEach(function(t) {
			e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
		}), e.__compiled__[""] = {
			validate: null,
			normalize: _()
		};
		let f = Object.keys(e.__compiled__).filter(function(t) {
			return t.length > 0 && e.__compiled__[t];
		}).map(u).join("|");
		e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${f})`, "i"), e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${f})`, "ig"), e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, "i"), e.re.pretest = RegExp(`(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`, "i");
	}
	function y(e, t, n, r) {
		let i = e.slice(n, r);
		this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
	}
	function b(e, t) {
		if (!(this instanceof b)) return new b(e, t);
		t || f(e) && (t = e, e = {}), this.__opts__ = i({}, d, t), this.__schemas__ = i({}, p, e), this.__compiled__ = {}, this.__tlds__ = h, this.__tlds_replaced__ = !1, this.re = {}, v(this);
	}
	b.prototype.add = function(e, t) {
		return this.__schemas__[e] = t, v(this), this;
	}, b.prototype.set = function(e) {
		return this.__opts__ = i(this.__opts__, e), this;
	}, b.prototype.test = function(e) {
		if (!e.length) return !1;
		let t, n;
		if (this.re.schema_test.test(e)) {
			for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
		}
		return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
	}, b.prototype.pretest = function(e) {
		return this.re.pretest.test(e);
	}, b.prototype.testSchemaAt = function(e, t, n) {
		return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
	}, b.prototype.match = function(e) {
		let t = [], n = [], r = [], i = [], a, o, s;
		function c(e, t) {
			return e ? t ? e.index === t.index ? e.lastIndex >= t.lastIndex ? e : t : e.index < t.index ? e : t : e : t;
		}
		if (!e.length) return null;
		if (this.re.schema_test.test(e)) for (s = this.re.schema_search, s.lastIndex = 0; (a = s.exec(e)) !== null;) o = this.testSchemaAt(e, a[2], s.lastIndex), o && n.push({
			schema: a[2],
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length + o
		});
		if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) for (s = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) r.push({
			schema: "",
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length
		});
		if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) for (s = this.re.email_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) i.push({
			schema: "mailto:",
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length
		});
		let l = [
			0,
			0,
			0
		], u = 0;
		for (;;) {
			let a = [
				n[l[0]],
				i[l[1]],
				r[l[2]]
			], o = c(c(a[0], a[1]), a[2]);
			if (!o) break;
			if (o === a[0] ? l[0]++ : o === a[1] ? l[1]++ : l[2]++, o.index < u) continue;
			let s = new y(e, o.schema, o.index, o.lastIndex);
			this.__compiled__[s.schema].normalize(s, this), t.push(s), u = o.lastIndex;
		}
		return t.length ? t : null;
	}, b.prototype.matchAtStart = function(e) {
		if (!e.length) return null;
		let t = this.re.schema_at_start.exec(e);
		if (!t) return null;
		let n = this.testSchemaAt(e, t[2], t[0].length);
		if (!n) return null;
		let r = new y(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
		return this.__compiled__[r.schema].normalize(r, this), r;
	}, b.prototype.tlds = function(e, t) {
		return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
			return e !== n[t - 1];
		}).reverse(), v(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, v(this), this);
	}, b.prototype.normalize = function(e) {
		e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
	}, b.prototype.onCompile = function() {}, t.exports = b;
})), ci = /* @__PURE__ */ d(((e, t) => {
	var n = Object.create, r = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, o = Object.getPrototypeOf, s = Object.prototype.hasOwnProperty, c = (e, t) => {
		let n = {};
		for (var i in e) r(n, i, {
			get: e[i],
			enumerable: !0
		});
		return t || r(n, Symbol.toStringTag, { value: "Module" }), n;
	}, l = (e, t, n, o) => {
		if (t && typeof t == "object" || typeof t == "function") for (var c = a(t), l = 0, u = c.length, d; l < u; l++) d = c[l], !s.call(e, d) && d !== n && r(e, d, {
			get: ((e) => t[e]).bind(null, d),
			enumerable: !(o = i(t, d)) || o.enumerable
		});
		return e;
	}, u = (e, t, i) => (i = e == null ? {} : n(o(e)), l(t || !e || !e.__esModule ? r(i, "default", {
		value: e,
		enumerable: !0
	}) : i, e)), d = Zr();
	d = u(d, 1);
	var f = Qr();
	f = u(f, 1);
	var p = oi(), m = si();
	m = u(m, 1);
	var g = (Or(), h(Qn));
	g = u(g, 1);
	var _ = /* @__PURE__ */ c({
		arrayReplaceAt: () => C,
		asciiTrim: () => me,
		assign: () => S,
		escapeHtml: () => O,
		escapeRE: () => le,
		fromCodePoint: () => T,
		has: () => x,
		isMdAsciiPunct: () => de,
		isPunctChar: () => ue,
		isPunctCharCode: () => j,
		isSpace: () => k,
		isString: () => y,
		isValidEntityCode: () => w,
		isWhiteSpace: () => A,
		lib: () => he,
		normalizeReference: () => fe,
		unescapeAll: () => D,
		unescapeMd: () => re
	});
	function v(e) {
		return Object.prototype.toString.call(e);
	}
	function y(e) {
		return v(e) === "[object String]";
	}
	var b = Object.prototype.hasOwnProperty;
	function x(e, t) {
		return b.call(e, t);
	}
	function S(e) {
		return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
			if (t) {
				if (typeof t != "object") throw TypeError(t + "must be object");
				Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}
		}), e;
	}
	function C(e, t, n) {
		return [].concat(e.slice(0, t), n, e.slice(t + 1));
	}
	function w(e) {
		return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
	}
	function T(e) {
		if (e > 65535) {
			e -= 65536;
			let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
			return String.fromCharCode(t, n);
		}
		return String.fromCharCode(e);
	}
	var E = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, ee = RegExp(E.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), te = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
	function ne(e, t) {
		if (t.charCodeAt(0) === 35 && te.test(t)) {
			let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
			return w(n) ? T(n) : e;
		}
		let n = (0, p.decodeHTML)(e);
		return n === e ? e : n;
	}
	function re(e) {
		return e.indexOf("\\") < 0 ? e : e.replace(E, "$1");
	}
	function D(e) {
		return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(ee, function(e, t, n) {
			return t || ne(e, n);
		});
	}
	var ie = /[&<>"]/, ae = /[&<>"]/g, oe = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function se(e) {
		return oe[e];
	}
	function O(e) {
		return ie.test(e) ? e.replace(ae, se) : e;
	}
	var ce = /[.?*+^$[\]\\(){}|-]/g;
	function le(e) {
		return e.replace(ce, "\\$&");
	}
	function k(e) {
		switch (e) {
			case 9:
			case 32: return !0;
		}
		return !1;
	}
	function A(e) {
		if (e >= 8192 && e <= 8202) return !0;
		switch (e) {
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 32:
			case 160:
			case 5760:
			case 8239:
			case 8287:
			case 12288: return !0;
		}
		return !1;
	}
	function ue(e) {
		return f.P.test(e) || f.S.test(e);
	}
	function j(e) {
		return ue(T(e));
	}
	function de(e) {
		switch (e) {
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
			case 46:
			case 47:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 124:
			case 125:
			case 126: return !0;
			default: return !1;
		}
	}
	function fe(e) {
		return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
	}
	function pe(e) {
		return e === 32 || e === 9 || e === 10 || e === 13;
	}
	function me(e) {
		let t = 0;
		for (; t < e.length && pe(e.charCodeAt(t)); t++);
		let n = e.length - 1;
		for (; n >= t && pe(e.charCodeAt(n)); n--);
		return e.slice(t, n + 1);
	}
	var he = {
		mdurl: d,
		ucmicro: f
	};
	function M(e, t, n) {
		let r, i, a, o, s = e.posMax, c = e.pos;
		for (e.pos = t + 1, r = 1; e.pos < s;) {
			if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
				i = !0;
				break;
			}
			if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
				if (o === e.pos - 1) r++;
				else if (n) return e.pos = c, -1;
			}
		}
		let l = -1;
		return i && (l = e.pos), e.pos = c, l;
	}
	function ge(e, t, n) {
		let r, i = t, a = {
			ok: !1,
			pos: 0,
			str: ""
		};
		if (e.charCodeAt(i) === 60) {
			for (i++; i < n;) {
				if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
				if (r === 62) return a.pos = i + 1, a.str = D(e.slice(t + 1, i)), a.ok = !0, a;
				if (r === 92 && i + 1 < n) {
					i += 2;
					continue;
				}
				i++;
			}
			return a;
		}
		let o = 0;
		for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
			if (r === 92 && i + 1 < n) {
				if (e.charCodeAt(i + 1) === 32) break;
				i += 2;
				continue;
			}
			if (r === 40 && (o++, o > 32)) return a;
			if (r === 41) {
				if (o === 0) break;
				o--;
			}
			i++;
		}
		return t === i || o !== 0 ? a : (a.str = D(e.slice(t, i)), a.pos = i, a.ok = !0, a);
	}
	function _e(e, t, n, r) {
		let i, a = t, o = {
			ok: !1,
			can_continue: !1,
			pos: 0,
			str: "",
			marker: 0
		};
		if (r) o.str = r.str, o.marker = r.marker;
		else {
			if (a >= n) return o;
			let r = e.charCodeAt(a);
			if (r !== 34 && r !== 39 && r !== 40) return o;
			t++, a++, r === 40 && (r = 41), o.marker = r;
		}
		for (; a < n;) {
			if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += D(e.slice(t, a)), o.ok = !0, o;
			if (i === 40 && o.marker === 41) return o;
			i === 92 && a + 1 < n && a++, a++;
		}
		return o.can_continue = !0, o.str += D(e.slice(t, a)), o;
	}
	var ve = /* @__PURE__ */ c({
		parseLinkDestination: () => ge,
		parseLinkLabel: () => M,
		parseLinkTitle: () => _e
	}), N = {};
	N.code_inline = function(e, t, n, r, i) {
		let a = e[t];
		return "<code" + i.renderAttrs(a) + ">" + O(a.content) + "</code>";
	}, N.code_block = function(e, t, n, r, i) {
		let a = e[t];
		return "<pre" + i.renderAttrs(a) + "><code>" + O(e[t].content) + "</code></pre>\n";
	}, N.fence = function(e, t, n, r, i) {
		let a = e[t], o = a.info ? D(a.info).trim() : "", s = "", c = "";
		if (o) {
			let e = o.split(/(\s+)/g);
			s = e[0], c = e.slice(2).join("");
		}
		let l;
		if (l = n.highlight && n.highlight(a.content, s, c) || O(a.content), l.indexOf("<pre") === 0) return l + "\n";
		if (o) {
			let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
			e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
			let r = { attrs: t };
			return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
		}
		return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
	}, N.image = function(e, t, n, r, i) {
		let a = e[t];
		return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
	}, N.hardbreak = function(e, t, n) {
		return n.xhtmlOut ? "<br />\n" : "<br>\n";
	}, N.softbreak = function(e, t, n) {
		return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
	}, N.text = function(e, t) {
		return O(e[t].content);
	}, N.html_block = function(e, t) {
		return e[t].content;
	}, N.html_inline = function(e, t) {
		return e[t].content;
	};
	function P() {
		this.rules = S({}, N);
	}
	P.prototype.renderAttrs = function(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + O(e.attrs[t][0]) + "=\"" + O(e.attrs[t][1]) + "\"";
		return r;
	}, P.prototype.renderToken = function(e, t, n) {
		let r = e[t], i = "";
		if (r.hidden) return "";
		r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
		let a = !1;
		if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
			let n = e[t + 1];
			(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
		}
		return i += a ? ">\n" : ">", i;
	}, P.prototype.renderInline = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
		}
		return r;
	}, P.prototype.renderInlineAsText = function(e, t, n) {
		let r = "";
		for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
			case "text":
				r += e[i].content;
				break;
			case "image":
				r += this.renderInlineAsText(e[i].children, t, n);
				break;
			case "html_inline":
			case "html_block":
				r += e[i].content;
				break;
			case "softbreak":
			case "hardbreak":
				r += "\n";
				break;
			default:
		}
		return r;
	}, P.prototype.render = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
		}
		return r;
	};
	function F() {
		this.__rules__ = [], this.__cache__ = null;
	}
	F.prototype.__find__ = function(e) {
		for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
		return -1;
	}, F.prototype.__compile__ = function() {
		let e = this, t = [""];
		e.__rules__.forEach(function(e) {
			e.enabled && e.alt.forEach(function(e) {
				t.indexOf(e) < 0 && t.push(e);
			});
		}), e.__cache__ = {}, t.forEach(function(t) {
			e.__cache__[t] = [], e.__rules__.forEach(function(n) {
				n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));
			});
		});
	}, F.prototype.at = function(e, t, n) {
		let r = this.__find__(e), i = n || {};
		if (r === -1) throw Error("Parser rule not found: " + e);
		this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
	}, F.prototype.before = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, F.prototype.after = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i + 1, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, F.prototype.push = function(e, t, n) {
		let r = n || {};
		this.__rules__.push({
			name: e,
			enabled: !0,
			fn: t,
			alt: r.alt || []
		}), this.__cache__ = null;
	}, F.prototype.enable = function(e, t) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach(function(e) {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error("Rules manager: invalid rule name " + e);
			}
			this.__rules__[r].enabled = !0, n.push(e);
		}, this), this.__cache__ = null, n;
	}, F.prototype.enableOnly = function(e, t) {
		Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
			e.enabled = !1;
		}), this.enable(e, t);
	}, F.prototype.disable = function(e, t) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach(function(e) {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error("Rules manager: invalid rule name " + e);
			}
			this.__rules__[r].enabled = !1, n.push(e);
		}, this), this.__cache__ = null, n;
	}, F.prototype.getRules = function(e) {
		return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
	};
	function I(e, t, n) {
		this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
	}
	I.prototype.attrIndex = function(e) {
		if (!this.attrs) return -1;
		let t = this.attrs;
		for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
		return -1;
	}, I.prototype.attrPush = function(e) {
		this.attrs ? this.attrs.push(e) : this.attrs = [e];
	}, I.prototype.attrSet = function(e, t) {
		let n = this.attrIndex(e), r = [e, t];
		n < 0 ? this.attrPush(r) : this.attrs[n] = r;
	}, I.prototype.attrGet = function(e) {
		let t = this.attrIndex(e), n = null;
		return t >= 0 && (n = this.attrs[t][1]), n;
	}, I.prototype.attrJoin = function(e, t) {
		let n = this.attrIndex(e);
		n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
	};
	function L(e, t, n) {
		this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
	}
	L.prototype.Token = I;
	var ye = /\r\n?|\n/g, be = /\0/g;
	function xe(e) {
		let t;
		t = e.src.replace(ye, "\n"), t = t.replace(be, "�"), e.src = t;
	}
	function Se(e) {
		let t;
		e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
	}
	function Ce(e) {
		let t = e.tokens;
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
		}
	}
	function we(e) {
		return /^<a[>\s]/i.test(e);
	}
	function Te(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Ee(e) {
		let t = e.tokens;
		if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
			if (t[n].type !== "inline" || !e.md.linkify.pretest(t[n].content)) continue;
			let r = t[n].children, i = 0;
			for (let a = r.length - 1; a >= 0; a--) {
				let o = r[a];
				if (o.type === "link_close") {
					for (a--; r[a].level !== o.level && r[a].type !== "link_open";) a--;
					continue;
				}
				if (o.type === "html_inline" && (we(o.content) && i > 0 && i--, Te(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
					let i = o.content, s = e.md.linkify.match(i), c = [], l = o.level, u = 0;
					s.length > 0 && s[0].index === 0 && a > 0 && r[a - 1].type === "text_special" && (s = s.slice(1));
					for (let t = 0; t < s.length; t++) {
						let n = s[t].url, r = e.md.normalizeLink(n);
						if (!e.md.validateLink(r)) continue;
						let a = s[t].text;
						a = s[t].schema ? s[t].schema === "mailto:" && !/^mailto:/i.test(a) ? e.md.normalizeLinkText("mailto:" + a).replace(/^mailto:/, "") : e.md.normalizeLinkText(a) : e.md.normalizeLinkText("http://" + a).replace(/^http:\/\//, "");
						let o = s[t].index;
						if (o > u) {
							let t = new e.Token("text", "", 0);
							t.content = i.slice(u, o), t.level = l, c.push(t);
						}
						let d = new e.Token("link_open", "a", 1);
						d.attrs = [["href", r]], d.level = l++, d.markup = "linkify", d.info = "auto", c.push(d);
						let f = new e.Token("text", "", 0);
						f.content = a, f.level = l, c.push(f);
						let p = new e.Token("link_close", "a", -1);
						p.level = --l, p.markup = "linkify", p.info = "auto", c.push(p), u = s[t].lastIndex;
					}
					if (u < i.length) {
						let t = new e.Token("text", "", 0);
						t.content = i.slice(u), t.level = l, c.push(t);
					}
					t[n].children = r = C(r, a, c);
				}
			}
		}
	}
	var De = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Oe = /\((c|tm|r)\)/i, ke = /\((c|tm|r)\)/gi, Ae = {
		c: "©",
		r: "®",
		tm: "™"
	};
	function je(e, t) {
		return Ae[t.toLowerCase()];
	}
	function Me(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && (r.content = r.content.replace(ke, je)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Ne(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && De.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Pe(e) {
		let t;
		if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (Oe.test(e.tokens[t].content) && Me(e.tokens[t].children), De.test(e.tokens[t].content) && Ne(e.tokens[t].children));
	}
	var Fe = /['"]/, Ie = /['"]/g, Le = "’";
	function Re(e, t, n, r) {
		e[t] || (e[t] = []), e[t].push({
			pos: n,
			ch: r
		});
	}
	function ze(e, t) {
		let n = "", r = 0;
		t.sort((e, t) => e.pos - t.pos);
		for (let i = 0; i < t.length; i++) {
			let a = t[i];
			n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
		}
		return n + e.slice(r);
	}
	function Be(e, t) {
		let n, r = [], i = {};
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = e[a].level;
			for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
			if (r.length = n + 1, o.type !== "text") continue;
			let c = o.content, l = 0, u = c.length;
			OUTER: for (; l < u;) {
				Ie.lastIndex = l;
				let o = Ie.exec(c);
				if (!o) break;
				let d = !0, f = !0;
				l = o.index + 1;
				let p = o[0] === "'", m = 32;
				if (o.index - 1 >= 0) m = c.charCodeAt(o.index - 1);
				else for (n = a - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--) if (e[n].content) {
					m = e[n].content.charCodeAt(e[n].content.length - 1);
					break;
				}
				let h = 32;
				if (l < u) h = c.charCodeAt(l);
				else for (n = a + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++) if (e[n].content) {
					h = e[n].content.charCodeAt(0);
					break;
				}
				let g = de(m) || j(m), _ = de(h) || j(h), v = A(m), y = A(h);
				if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
					p && Re(i, a, o.index, Le);
					continue;
				}
				if (f) for (n = r.length - 1; n >= 0; n--) {
					let e = r[n];
					if (r[n].level < s) break;
					if (e.single === p && r[n].level === s) {
						e = r[n];
						let s, c;
						p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), Re(i, a, o.index, c), Re(i, e.token, e.pos, s), r.length = n;
						continue OUTER;
					}
				}
				d ? r.push({
					token: a,
					pos: o.index,
					single: p,
					level: s
				}) : f && p && Re(i, a, o.index, Le);
			}
		}
		Object.keys(i).forEach(function(t) {
			e[t].content = ze(e[t].content, i[t]);
		});
	}
	function Ve(e) {
		if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !Fe.test(e.tokens[t].content) || Be(e.tokens[t].children, e);
	}
	function He(e) {
		let t, n, r = e.tokens, i = r.length;
		for (let e = 0; e < i; e++) {
			if (r[e].type !== "inline") continue;
			let i = r[e].children, a = i.length;
			for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
			for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
			t !== n && (i.length = n);
		}
	}
	var Ue = [
		["normalize", xe],
		["block", Se],
		["inline", Ce],
		["linkify", Ee],
		["replacements", Pe],
		["smartquotes", Ve],
		["text_join", He]
	];
	function R() {
		this.ruler = new F();
		for (let e = 0; e < Ue.length; e++) this.ruler.push(Ue[e][0], Ue[e][1]);
	}
	R.prototype.process = function(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}, R.prototype.State = L;
	function z(e, t, n, r) {
		this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) if (k(s)) {
				n++, s === 9 ? r += 4 - r % 4 : r++;
				continue;
			} else o = !0;
			(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
		}
		this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
	}
	z.prototype.push = function(e, t, n) {
		let r = new I(e, t, n);
		return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
	}, z.prototype.isEmpty = function(e) {
		return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
	}, z.prototype.skipEmptyLines = function(e) {
		for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
		return e;
	}, z.prototype.skipSpaces = function(e) {
		for (let t = this.src.length; e < t && k(this.src.charCodeAt(e)); e++);
		return e;
	}, z.prototype.skipSpacesBack = function(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!k(this.src.charCodeAt(--e))) return e + 1;
		return e;
	}, z.prototype.skipChars = function(e, t) {
		for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
		return e;
	}, z.prototype.skipCharsBack = function(e, t, n) {
		if (e <= n) return e;
		for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
		return e;
	}, z.prototype.getLines = function(e, t, n, r) {
		if (e >= t) return "";
		let i = Array(t - e);
		for (let a = 0, o = e; o < t; o++, a++) {
			let e = 0, s = this.bMarks[o], c = s, l;
			for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
				let t = this.src.charCodeAt(c);
				if (k(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}, z.prototype.Token = I;
	var We = 65536;
	function B(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
		return e.src.slice(n, r);
	}
	function Ge(e) {
		let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
		for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
		return t.push(s + e.substring(o)), t;
	}
	function Ke(e, t, n, r) {
		if (t + 2 > n) return !1;
		let i = t + 1;
		if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[i] + e.tShift[i];
		if (a >= e.eMarks[i]) return !1;
		let o = e.src.charCodeAt(a++);
		if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
		let s = e.src.charCodeAt(a++);
		if (s !== 124 && s !== 45 && s !== 58 && !k(s) || o === 45 && k(s)) return !1;
		for (; a < e.eMarks[i];) {
			let t = e.src.charCodeAt(a);
			if (t !== 124 && t !== 45 && t !== 58 && !k(t)) return !1;
			a++;
		}
		let c = B(e, t + 1), l = c.split("|"), u = [];
		for (let e = 0; e < l.length; e++) {
			let t = l[e].trim();
			if (!t) {
				if (e === 0 || e === l.length - 1) continue;
				return !1;
			}
			if (!/^:?-+:?$/.test(t)) return !1;
			t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
		}
		if (c = B(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
		l = Ge(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
		let d = l.length;
		if (d === 0 || d !== u.length) return !1;
		if (r) return !0;
		let f = e.parentType;
		e.parentType = "table";
		let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
		m.map = h;
		let g = e.push("thead_open", "thead", 1);
		g.map = [t, t + 1];
		let _ = e.push("tr_open", "tr", 1);
		_.map = [t, t + 1];
		for (let t = 0; t < l.length; t++) {
			let n = e.push("th_open", "th", 1);
			u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
			let r = e.push("inline", "", 0);
			r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
		}
		e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
		let v, y = 0;
		for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
			let r = !1;
			for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
				r = !0;
				break;
			}
			if (r || (c = B(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Ge(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > We)) break;
			if (i === t + 2) {
				let n = e.push("tbody_open", "tbody", 1);
				n.map = v = [t + 2, 0];
			}
			let a = e.push("tr_open", "tr", 1);
			a.map = [i, i + 1];
			for (let t = 0; t < d; t++) {
				let n = e.push("td_open", "td", 1);
				u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
				let r = e.push("inline", "", 0);
				r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
			}
			e.push("tr_close", "tr", -1);
		}
		return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
	}
	function qe(e, t, n) {
		if (e.sCount[t] - e.blkIndent < 4) return !1;
		let r = t + 1, i = r;
		for (; r < n;) {
			if (e.isEmpty(r)) {
				r++;
				continue;
			}
			if (e.sCount[r] - e.blkIndent >= 4) {
				r++, i = r;
				continue;
			}
			break;
		}
		e.line = i;
		let a = e.push("code_block", "code", 0);
		return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
	}
	function Je(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
		let o = e.src.charCodeAt(i);
		if (o !== 126 && o !== 96) return !1;
		let s = i;
		i = e.skipChars(i, o);
		let c = i - s;
		if (c < 3) return !1;
		let l = e.src.slice(s, i), u = e.src.slice(i, a);
		if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
		if (r) return !0;
		let d = t, f = !1;
		for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
			f = !0;
			break;
		}
		c = e.sCount[t], e.line = d + +!!f;
		let p = e.push("fence", "code", 0);
		return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
	}
	function Ye(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
		if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
		if (r) return !0;
		let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
		e.parentType = "blockquote";
		let p = !1, m;
		for (m = t; m < n; m++) {
			let t = e.sCount[m] < e.blkIndent;
			if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
			if (e.src.charCodeAt(i++) === 62 && !t) {
				let t = e.sCount[m] + 1, n, r;
				e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
				let o = t;
				for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
					let t = e.src.charCodeAt(i);
					if (k(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
					else break;
					i++;
				}
				p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
				continue;
			}
			if (p) break;
			let r = !1;
			for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
				r = !0;
				break;
			}
			if (r) {
				e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
				break;
			}
			s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
		}
		let h = e.blkIndent;
		e.blkIndent = 0;
		let g = e.push("blockquote_open", "blockquote", 1);
		g.markup = ">";
		let _ = [t, 0];
		g.map = _, e.md.block.tokenize(e, t, m);
		let v = e.push("blockquote_close", "blockquote", -1);
		v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
		for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
		return e.blkIndent = h, !0;
	}
	function Xe(e, t, n, r) {
		let i = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
		if (o !== 42 && o !== 45 && o !== 95) return !1;
		let s = 1;
		for (; a < i;) {
			let t = e.src.charCodeAt(a++);
			if (t !== o && !k(t)) return !1;
			t === o && s++;
		}
		if (s < 3) return !1;
		if (r) return !0;
		e.line = t + 1;
		let c = e.push("hr", "hr", 0);
		return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
	}
	function Ze(e, t) {
		let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
		return i !== 42 && i !== 45 && i !== 43 || r < n && !k(e.src.charCodeAt(r)) ? -1 : r;
	}
	function Qe(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
		if (i + 1 >= r) return -1;
		let a = e.src.charCodeAt(i++);
		if (a < 48 || a > 57) return -1;
		for (;;) {
			if (i >= r) return -1;
			if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
				if (i - n >= 10) return -1;
				continue;
			}
			if (a === 41 || a === 46) break;
			return -1;
		}
		return i < r && (a = e.src.charCodeAt(i), !k(a)) ? -1 : i;
	}
	function $e(e, t) {
		let n = e.level + 2;
		for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
	}
	function et(e, t, n, r) {
		let i, a, o, s, c = t, l = !0;
		if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
		let u = !1;
		r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
		let d, f, p;
		if ((p = Qe(e, c)) >= 0) {
			if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
		} else if ((p = Ze(e, c)) >= 0) d = !1;
		else return !1;
		if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
		if (r) return !0;
		let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
		d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
		let g = [c, 0];
		s.map = g, s.markup = String.fromCharCode(m);
		let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
		for (e.parentType = "list"; c < n;) {
			a = p, i = e.eMarks[c];
			let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
			for (; a < i;) {
				let t = e.src.charCodeAt(a);
				if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
				else if (t === 32) r++;
				else break;
				a++;
			}
			let u = a, f;
			f = u >= i ? 1 : r - t, f > 4 && (f = 1);
			let h = t + f;
			s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
			let g = [c, 0];
			s.map = g, d && (s.info = e.src.slice(o, p - 1));
			let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
			if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
			let C = !1;
			for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
				C = !0;
				break;
			}
			if (C) break;
			if (d) {
				if (p = Qe(e, c), p < 0) break;
				o = e.bMarks[c] + e.tShift[c];
			} else if (p = Ze(e, c), p < 0) break;
			if (m !== e.src.charCodeAt(p - 1)) break;
		}
		return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && $e(e, h), !0;
	}
	function tt(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
		if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
		function s(t) {
			let n = e.lineMax;
			if (t >= n || e.isEmpty(t)) return null;
			let r = !1;
			if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
				let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
				e.parentType = "reference";
				let a = !1;
				for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
					a = !0;
					break;
				}
				if (e.parentType = i, a) return null;
			}
			let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
			return e.src.slice(i, a + 1);
		}
		let c = e.src.slice(i, a + 1);
		a = c.length;
		let l = -1;
		for (i = 1; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 91) return !1;
			if (e === 93) {
				l = i;
				break;
			} else if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			}
		}
		if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
		for (i = l + 2; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (!k(e)) break;
		}
		let u = e.md.helpers.parseLinkDestination(c, i, a);
		if (!u.ok) return !1;
		let d = e.md.normalizeLink(u.str);
		if (!e.md.validateLink(d)) return !1;
		i = u.pos;
		let f = i, p = o, m = i;
		for (; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (!k(e)) break;
		}
		let h = e.md.helpers.parseLinkTitle(c, i, a);
		for (; h.can_continue;) {
			let t = s(o);
			if (t === null) break;
			c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
		}
		let g;
		for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && k(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && k(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10) return !1;
		let _ = fe(c.slice(1, l));
		return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
			title: g,
			href: d
		}), e.line = o, !0) : !1;
	}
	var nt = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), V = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), rt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), H = [
		[
			/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
			/<\/(script|pre|style|textarea)>/i,
			!0
		],
		[
			/^<!--/,
			/-->/,
			!0
		],
		[
			/^<\?/,
			/\?>/,
			!0
		],
		[
			/^<![A-Z]/,
			/>/,
			!0
		],
		[
			/^<!\[CDATA\[/,
			/\]\]>/,
			!0
		],
		[
			RegExp("^</?(" + nt.join("|") + ")(?=(\\s|/?>|$))", "i"),
			/^$/,
			!0
		],
		[
			RegExp(rt.source + "\\s*$"),
			/^$/,
			!1
		]
	];
	function U(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
		let o = e.src.slice(i, a), s = 0;
		for (; s < H.length && !H[s][0].test(o); s++);
		if (s === H.length) return !1;
		if (r) return H[s][2];
		let c = t + 1, l = H[s][1].test("");
		if (!H[s][1].test(o)) {
			for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), H[s][1].test(o)) {
				o.length !== 0 && c++;
				break;
			}
		}
		e.line = c;
		let u = e.push("html_block", "", 0);
		return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
	}
	function it(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let o = e.src.charCodeAt(i);
		if (o !== 35 || i >= a) return !1;
		let s = 1;
		for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
		if (s > 6 || i < a && !k(o)) return !1;
		if (r) return !0;
		a = e.skipSpacesBack(a, i);
		let c = e.skipCharsBack(a, 35, i);
		c > i && k(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
		let l = e.push("heading_open", "h" + String(s), 1);
		l.markup = "########".slice(0, s), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = me(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
		let d = e.push("heading_close", "h" + String(s), -1);
		return d.markup = "########".slice(0, s), !0;
	}
	function at(e, t, n) {
		let r = e.md.block.ruler.getRules("paragraph");
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let i = e.parentType;
		e.parentType = "paragraph";
		let a = 0, o, s = t + 1;
		for (; s < n && !e.isEmpty(s); s++) {
			if (e.sCount[s] - e.blkIndent > 3) continue;
			if (e.sCount[s] >= e.blkIndent) {
				let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
				if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
					a = o === 61 ? 1 : 2;
					break;
				}
			}
			if (e.sCount[s] < 0) continue;
			let t = !1;
			for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
				t = !0;
				break;
			}
			if (t) break;
		}
		if (!a) return e.parentType = i, !1;
		let c = me(e.getLines(t, s, e.blkIndent, !1));
		e.line = s + 1;
		let l = e.push("heading_open", "h" + String(a), 1);
		l.markup = String.fromCharCode(o), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = c, u.map = [t, e.line - 1], u.children = [];
		let d = e.push("heading_close", "h" + String(a), -1);
		return d.markup = String.fromCharCode(o), e.parentType = i, !0;
	}
	function ot(e, t, n) {
		let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
		for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
			if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
			let t = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
				t = !0;
				break;
			}
			if (t) break;
		}
		let o = me(e.getLines(t, a, e.blkIndent, !1));
		e.line = a;
		let s = e.push("paragraph_open", "p", 1);
		s.map = [t, e.line];
		let c = e.push("inline", "", 0);
		return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
	}
	var st = [
		[
			"table",
			Ke,
			["paragraph", "reference"]
		],
		["code", qe],
		[
			"fence",
			Je,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"blockquote",
			Ye,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"hr",
			Xe,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"list",
			et,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["reference", tt],
		[
			"html_block",
			U,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		[
			"heading",
			it,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["lheading", at],
		["paragraph", ot]
	];
	function ct() {
		this.ruler = new F();
		for (let e = 0; e < st.length; e++) this.ruler.push(st[e][0], st[e][1], { alt: (st[e][2] || []).slice() });
	}
	ct.prototype.tokenize = function(e, t, n) {
		let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
		for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
			if (e.level >= a) {
				e.line = n;
				break;
			}
			let t = e.line, c = !1;
			for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
				if (t >= e.line) throw Error("block rule didn't increment state.line");
				break;
			}
			if (!c) throw Error("none of the block rules matched");
			e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
		}
	}, ct.prototype.parse = function(e, t, n, r) {
		if (!e) return;
		let i = new this.State(e, t, n, r);
		this.tokenize(i, i.line, i.lineMax);
	}, ct.prototype.State = z;
	function lt(e, t, n, r) {
		this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
	}
	lt.prototype.pushPending = function() {
		let e = new I("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}, lt.prototype.push = function(e, t, n) {
		this.pending && this.pushPending();
		let r = new I(e, t, n), i = null;
		return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
	}, lt.prototype.scanDelims = function(e, t) {
		let n = this.posMax, r = this.src.charCodeAt(e), i;
		if (e === 0) i = 32;
		else if (e === 1) i = this.src.charCodeAt(0), (i & 63488) == 55296 && (i = 65533);
		else if (i = this.src.charCodeAt(e - 1), (i & 64512) == 56320) {
			let t = this.src.charCodeAt(e - 2);
			i = (t & 64512) == 55296 ? 65536 + (t - 55296 << 10) + (i - 56320) : 65533;
		} else (i & 64512) == 55296 && (i = 65533);
		let a = e;
		for (; a < n && this.src.charCodeAt(a) === r;) a++;
		let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32;
		if ((s & 64512) == 55296) {
			let e = this.src.charCodeAt(a + 1);
			s = (e & 64512) == 56320 ? 65536 + (s - 55296 << 10) + (e - 56320) : 65533;
		} else (s & 64512) == 56320 && (s = 65533);
		let c = de(i) || j(i), l = de(s) || j(s), u = A(i), d = A(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}, lt.prototype.Token = I;
	function ut(e) {
		switch (e) {
			case 10:
			case 33:
			case 35:
			case 36:
			case 37:
			case 38:
			case 42:
			case 43:
			case 45:
			case 58:
			case 60:
			case 61:
			case 62:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 125:
			case 126: return !0;
			default: return !1;
		}
	}
	function dt(e, t) {
		let n = e.pos;
		for (; n < e.posMax && !ut(e.src.charCodeAt(n));) n++;
		return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
	}
	var ft = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
	function pt(e, t) {
		if (!e.md.options.linkify || e.linkLevel > 0) return !1;
		let n = e.pos, r = e.posMax;
		if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
		let i = e.pending.match(ft);
		if (!i) return !1;
		let a = i[1], o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
		if (!o) return !1;
		let s = o.url;
		if (s.length <= a.length) return !1;
		let c = s.length;
		for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
		c !== s.length && (s = s.slice(0, c));
		let l = e.md.normalizeLink(s);
		if (!e.md.validateLink(l)) return !1;
		if (!t) {
			e.pending = e.pending.slice(0, -a.length);
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", l]], t.markup = "linkify", t.info = "auto";
			let n = e.push("text", "", 0);
			n.content = e.md.normalizeLinkText(s);
			let r = e.push("link_close", "a", -1);
			r.markup = "linkify", r.info = "auto";
		}
		return e.pos += s.length - a.length, !0;
	}
	function mt(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 10) return !1;
		let r = e.pending.length - 1, i = e.posMax;
		if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
			let t = r - 1;
			for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
			e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
		} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
		else e.push("softbreak", "br", 0);
		for (n++; n < i && k(e.src.charCodeAt(n));) n++;
		return e.pos = n, !0;
	}
	var ht = [];
	for (let e = 0; e < 256; e++) ht.push(0);
	"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
		ht[e.charCodeAt(0)] = 1;
	});
	function gt(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
		let i = e.src.charCodeAt(n);
		if (i === 10) {
			for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), k(i));) n++;
			return e.pos = n, !0;
		}
		if (i === 32) {
			if (!t) {
				let t = e.push("text_special", "", 0);
				t.content = "\\", t.markup = "\\", t.info = "escape";
			}
			return e.pos = n, !0;
		}
		let a = e.src[n];
		if (i >= 55296 && i <= 56319 && n + 1 < r) {
			let t = e.src.charCodeAt(n + 1);
			t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
		}
		let o = "\\" + a;
		if (!t) {
			let t = e.push("text_special", "", 0);
			i < 256 && ht[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
		}
		return e.pos = n + 1, !0;
	}
	function _t(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 96) return !1;
		let r = n;
		n++;
		let i = e.posMax;
		for (; n < i && e.src.charCodeAt(n) === 96;) n++;
		let a = e.src.slice(r, n), o = a.length;
		if (e.backticksScanned && (e.backticks[o] || 0) <= r) return t || (e.pending += a), e.pos += o, !0;
		let s = n, c;
		for (; (c = e.src.indexOf("`", s)) !== -1;) {
			for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
			let r = s - c;
			if (r === o) {
				if (!t) {
					let t = e.push("code_inline", "code", 0);
					t.markup = a, t.content = e.src.slice(n, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
				}
				return e.pos = s, !0;
			}
			e.backticks[r] = c;
		}
		return e.backticksScanned = !0, t || (e.pending += a), e.pos += o, !0;
	}
	function vt(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 126) return !1;
		let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
		if (a < 2) return !1;
		let s;
		a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
		for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
			marker: r,
			length: 0,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
		return e.pos += i.length, !0;
	}
	function yt(e, t) {
		let n, r = [], i = t.length;
		for (let a = 0; a < i; a++) {
			let i = t[a];
			if (i.marker !== 126 || i.end === -1) continue;
			let o = t[i.end];
			n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
		}
		for (; r.length;) {
			let t = r.pop(), i = t + 1;
			for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
			i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
		}
	}
	function bt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		yt(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && yt(e, t[r].delimiters);
	}
	var xt = {
		tokenize: vt,
		postProcess: bt
	};
	function St(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 95 && r !== 42) return !1;
		let i = e.scanDelims(e.pos, r === 42);
		for (let t = 0; t < i.length; t++) {
			let t = e.push("text", "", 0);
			t.content = String.fromCharCode(r), e.delimiters.push({
				marker: r,
				length: i.length,
				token: e.tokens.length - 1,
				end: -1,
				open: i.can_open,
				close: i.can_close
			});
		}
		return e.pos += i.length, !0;
	}
	function Ct(e, t) {
		let n = t.length;
		for (let r = n - 1; r >= 0; r--) {
			let n = t[r];
			if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
			let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
			s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
			let c = e.tokens[i.token];
			c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
		}
	}
	function wt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Ct(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Ct(e, t[r].delimiters);
	}
	var Tt = {
		tokenize: St,
		postProcess: wt
	};
	function Et(e, t) {
		let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
		if (e.src.charCodeAt(e.pos) !== 91) return !1;
		let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
		if (p < 0) return !1;
		let m = p + 1;
		if (m < d && e.src.charCodeAt(m) === 40) {
			for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
			if (m >= d) return !1;
			if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
				for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
				if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
			}
			(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
		}
		if (l) {
			if (e.env.references === void 0) return !1;
			if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[fe(r)], !a) return e.pos = u, !1;
			o = a.href, s = a.title;
		}
		if (!t) {
			e.pos = f, e.posMax = p;
			let t = e.push("link_open", "a", 1), n = [["href", o]];
			t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
		}
		return e.pos = m, e.posMax = d, !0;
	}
	function Dt(e, t) {
		let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
		if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
		let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
		if (m < 0) return !1;
		if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
			for (a++; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			if (a >= f) return !1;
			for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			else c = "";
			if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
			a++;
		} else {
			if (e.env.references === void 0) return !1;
			if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[fe(i)], !o) return e.pos = d, !1;
			u = o.href, c = o.title;
		}
		if (!t) {
			r = e.src.slice(p, m);
			let t = [];
			e.md.inline.parse(r, e.md, e.env, t);
			let n = e.push("image", "img", 0), i = [["src", u], ["alt", ""]];
			n.attrs = i, n.children = t, n.content = r, c && i.push(["title", c]);
		}
		return e.pos = a, e.posMax = f, !0;
	}
	var Ot = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, kt = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
	function At(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 60) return !1;
		let r = e.pos, i = e.posMax;
		for (;;) {
			if (++n >= i) return !1;
			let t = e.src.charCodeAt(n);
			if (t === 60) return !1;
			if (t === 62) break;
		}
		let a = e.src.slice(r + 1, n);
		if (kt.test(a)) {
			let n = e.md.normalizeLink(a);
			if (!e.md.validateLink(n)) return !1;
			if (!t) {
				let t = e.push("link_open", "a", 1);
				t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
				let r = e.push("text", "", 0);
				r.content = e.md.normalizeLinkText(a);
				let i = e.push("link_close", "a", -1);
				i.markup = "autolink", i.info = "auto";
			}
			return e.pos += a.length + 2, !0;
		}
		if (Ot.test(a)) {
			let n = e.md.normalizeLink("mailto:" + a);
			if (!e.md.validateLink(n)) return !1;
			if (!t) {
				let t = e.push("link_open", "a", 1);
				t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
				let r = e.push("text", "", 0);
				r.content = e.md.normalizeLinkText(a);
				let i = e.push("link_close", "a", -1);
				i.markup = "autolink", i.info = "auto";
			}
			return e.pos += a.length + 2, !0;
		}
		return !1;
	}
	function W(e) {
		return /^<a[>\s]/i.test(e);
	}
	function jt(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Mt(e) {
		let t = e | 32;
		return t >= 97 && t <= 122;
	}
	function Nt(e, t) {
		if (!e.md.options.html) return !1;
		let n = e.posMax, r = e.pos;
		if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
		let i = e.src.charCodeAt(r + 1);
		if (i !== 33 && i !== 63 && i !== 47 && !Mt(i)) return !1;
		let a = e.src.slice(r).match(V);
		if (!a) return !1;
		if (!t) {
			let t = e.push("html_inline", "", 0);
			t.content = a[0], W(t.content) && e.linkLevel++, jt(t.content) && e.linkLevel--;
		}
		return e.pos += a[0].length, !0;
	}
	var Pt = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Ft = /^&([a-z][a-z0-9]{1,31});/i;
	function It(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
		if (e.src.charCodeAt(n + 1) === 35) {
			let r = e.src.slice(n).match(Pt);
			if (r) {
				if (!t) {
					let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
					n.content = w(t) ? T(t) : T(65533), n.markup = r[0], n.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		} else {
			let r = e.src.slice(n).match(Ft);
			if (r) {
				let n = (0, p.decodeHTMLStrict)(r[0]);
				if (n !== r[0]) {
					if (!t) {
						let t = e.push("text_special", "", 0);
						t.content = n, t.markup = r[0], t.info = "entity";
					}
					return e.pos += r[0].length, !0;
				}
			}
		}
		return !1;
	}
	function Lt(e) {
		let t = {}, n = e.length;
		if (!n) return;
		let r = 0, i = -2, a = [];
		for (let o = 0; o < n; o++) {
			let n = e[o];
			if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
			t.hasOwnProperty(n.marker) || (t[n.marker] = [
				-1,
				-1,
				-1,
				-1,
				-1,
				-1
			]);
			let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
			for (; c > s; c -= a[c] + 1) {
				let t = e[c];
				if (t.marker === n.marker && t.open && t.end < 0) {
					let r = !1;
					if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
						let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
						a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
						break;
					}
				}
			}
			l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
		}
	}
	function Rt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Lt(e.delimiters);
		for (let e = 0; e < n; e++) t[e] && t[e].delimiters && Lt(t[e].delimiters);
	}
	function zt(e) {
		let t, n, r = 0, i = e.tokens, a = e.tokens.length;
		for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
	var Bt = [
		["text", dt],
		["linkify", pt],
		["newline", mt],
		["escape", gt],
		["backticks", _t],
		["strikethrough", xt.tokenize],
		["emphasis", Tt.tokenize],
		["link", Et],
		["image", Dt],
		["autolink", At],
		["html_inline", Nt],
		["entity", It]
	], Vt = [
		["balance_pairs", Rt],
		["strikethrough", xt.postProcess],
		["emphasis", Tt.postProcess],
		["fragments_join", zt]
	];
	function Ht() {
		this.ruler = new F();
		for (let e = 0; e < Bt.length; e++) this.ruler.push(Bt[e][0], Bt[e][1]);
		this.ruler2 = new F();
		for (let e = 0; e < Vt.length; e++) this.ruler2.push(Vt[e][0], Vt[e][1]);
	}
	Ht.prototype.skipToken = function(e) {
		let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
		if (a[t] !== void 0) {
			e.pos = a[t];
			return;
		}
		let o = !1;
		if (e.level < i) {
			for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
				if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		} else e.pos = e.posMax;
		o || e.pos++, a[t] = e.pos;
	}, Ht.prototype.tokenize = function(e) {
		let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
		for (; e.pos < r;) {
			let a = e.pos, o = !1;
			if (e.level < i) {
				for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
					if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (o) {
				if (e.pos >= r) break;
				continue;
			}
			e.pending += e.src[e.pos++];
		}
		e.pending && e.pushPending();
	}, Ht.prototype.parse = function(e, t, n, r) {
		let i = new this.State(e, t, n, r);
		this.tokenize(i);
		let a = this.ruler2.getRules(""), o = a.length;
		for (let e = 0; e < o; e++) a[e](i);
	}, Ht.prototype.State = lt;
	var Ut = {
		default: {
			options: {
				html: !1,
				xhtmlOut: !1,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 100
			},
			components: {
				core: {},
				block: {},
				inline: {}
			}
		},
		zero: {
			options: {
				html: !1,
				xhtmlOut: !1,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: ["paragraph"] },
				inline: {
					rules: ["text"],
					rules2: ["balance_pairs", "fragments_join"]
				}
			}
		},
		commonmark: {
			options: {
				html: !0,
				xhtmlOut: !0,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: [
					"blockquote",
					"code",
					"fence",
					"heading",
					"hr",
					"html_block",
					"lheading",
					"list",
					"reference",
					"paragraph"
				] },
				inline: {
					rules: [
						"autolink",
						"backticks",
						"emphasis",
						"entity",
						"escape",
						"html_inline",
						"image",
						"link",
						"newline",
						"text"
					],
					rules2: [
						"balance_pairs",
						"emphasis",
						"fragments_join"
					]
				}
			}
		}
	}, Wt = /^(vbscript|javascript|file|data):/, Gt = /^data:image\/(gif|png|jpeg|webp);/;
	function Kt(e) {
		let t = e.trim().toLowerCase();
		return !Wt.test(t) || Gt.test(t);
	}
	var qt = [
		"http:",
		"https:",
		"mailto:"
	];
	function Jt(e) {
		let t = d.parse(e, !0);
		if (t.hostname && (!t.protocol || qt.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toASCII(t.hostname);
		} catch {}
		return d.encode(d.format(t));
	}
	function Yt(e) {
		let t = d.parse(e, !0);
		if (t.hostname && (!t.protocol || qt.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toUnicode(t.hostname);
		} catch {}
		return d.decode(d.format(t), d.decode.defaultChars + "%");
	}
	function G(e, t) {
		if (!(this instanceof G)) return new G(e, t);
		t || y(e) || (t = e || {}, e = "default"), this.inline = new Ht(), this.block = new ct(), this.core = new R(), this.renderer = new P(), this.linkify = new m.default(), this.validateLink = Kt, this.normalizeLink = Jt, this.normalizeLinkText = Yt, this.utils = _, this.helpers = S({}, ve), this.options = {}, this.configure(e), t && this.set(t);
	}
	G.prototype.set = function(e) {
		return S(this.options, e), this;
	}, G.prototype.configure = function(e) {
		let t = this;
		if (y(e)) {
			let t = e;
			if (e = Ut[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
		}
		if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
		return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
			e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
		}), this;
	}, G.prototype.enable = function(e, t) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach(function(t) {
			n = n.concat(this[t].ruler.enable(e, !0));
		}, this), n = n.concat(this.inline.ruler2.enable(e, !0));
		let r = e.filter(function(e) {
			return n.indexOf(e) < 0;
		});
		if (r.length && !t) throw Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
		return this;
	}, G.prototype.disable = function(e, t) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach(function(t) {
			n = n.concat(this[t].ruler.disable(e, !0));
		}, this), n = n.concat(this.inline.ruler2.disable(e, !0));
		let r = e.filter(function(e) {
			return n.indexOf(e) < 0;
		});
		if (r.length && !t) throw Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
		return this;
	}, G.prototype.use = function(e) {
		let t = [this].concat(Array.prototype.slice.call(arguments, 1));
		return e.apply(e, t), this;
	}, G.prototype.parse = function(e, t) {
		if (typeof e != "string") throw Error("Input data should be a String");
		let n = new this.core.State(e, this, t);
		return this.core.process(n), n.tokens;
	}, G.prototype.render = function(e, t) {
		return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
	}, G.prototype.parseInline = function(e, t) {
		let n = new this.core.State(e, this, t);
		return n.inlineMode = !0, this.core.process(n), n.tokens;
	}, G.prototype.renderInline = function(e, t) {
		return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
	}, t.exports = G;
})), li = /* @__PURE__ */ d(((e) => {
	e.getAttrs = function(e, t, n) {
		let r = /[^\t\n\f />"'=]/, i = [], a = "", o = "", s = !0, l = !1;
		for (let u = t + n.leftDelimiter.length; u < e.length; u++) {
			if (!l && e.slice(u, u + n.rightDelimiter.length) === n.rightDelimiter) {
				a !== "" && i.push([a, o]);
				break;
			}
			let t = e.charAt(u);
			if (t === "=" && s) {
				s = !1;
				continue;
			}
			if (t === "." && a === "") {
				e.charAt(u + 1) === "." ? (a = "css-module", u += 1) : a = "class", s = !1;
				continue;
			}
			if (t === "#" && a === "") {
				a = "id", s = !1;
				continue;
			}
			if (c(e, u) && o === "" && !l) {
				l = !0;
				continue;
			}
			if (c(e, u) && l) {
				l = !1;
				continue;
			}
			if (t === " " && !l) {
				if (a === "") continue;
				i.push([a, o]), a = "", o = "", s = !0;
				continue;
			}
			if (!(s && t.search(r) === -1)) {
				if (s) {
					a += t;
					continue;
				}
				o += t;
			}
		}
		let u = n.allowedAttributes && n.allowedAttributes.length, d = n.allowedAttributeValues && n.allowedAttributeValues.length;
		if (u || d) {
			let e = n.allowedAttributes, t = n.allowedAttributeValues;
			return i.filter(function(n) {
				let r = n[0], i = n[1], a = !u, o = !d;
				function s(e) {
					return i === e || e instanceof RegExp && e.test(i);
				}
				function c(e) {
					return r === e || e instanceof RegExp && e.test(r);
				}
				return u && (a = e.some(c)), d && (o = t.some(s)), a && o;
			});
		}
		return i;
	}, e.addAttrs = function(e, t) {
		for (let n = 0, r = e.length; n < r; ++n) {
			let r = e[n][0];
			r === "class" ? t.attrJoin("class", e[n][1]) : r === "css-module" ? t.attrJoin("css-module", e[n][1]) : t.attrSet(r, e[n][1]);
		}
		return t;
	}, e.hasDelimiters = function(e, t) {
		if (!e) throw Error("Parameter `where` not passed. Should be \"start\", \"end\" or \"only\".");
		return function(n) {
			let r = t.leftDelimiter.length + 1 + t.rightDelimiter.length;
			if (!n || typeof n != "string" || n.length < r) return !1;
			function i(e) {
				let n = e.charAt(t.leftDelimiter.length) === ".", i = e.charAt(t.leftDelimiter.length) === "#";
				return n || i ? e.length >= r + 1 : e.length >= r;
			}
			let a, c, l, u, d = r - t.rightDelimiter.length;
			switch (e) {
				case "start":
					l = n.slice(0, t.leftDelimiter.length), a = l === t.leftDelimiter ? 0 : -1, c = a === -1 ? -1 : o(n, d, t), u = n.charAt(c + t.rightDelimiter.length), u && t.rightDelimiter.indexOf(u) !== -1 && (c = -1);
					break;
				case "end":
					a = s(n, t), c = a === -1 ? -1 : o(n, a + d, t), c = c === n.length - t.rightDelimiter.length ? c : -1;
					break;
				case "only":
					l = n.slice(0, t.leftDelimiter.length), a = l === t.leftDelimiter ? 0 : -1, l = n.slice(n.length - t.rightDelimiter.length), c = l === t.rightDelimiter ? n.length - t.rightDelimiter.length : -1;
					break;
				default: throw Error(`Unexpected case ${e}, expected 'start', 'end' or 'only'`);
			}
			return a !== -1 && c !== -1 && i(n.substring(a, c + t.rightDelimiter.length));
		};
	}, e.removeDelimiter = function(e, t) {
		let n = s(e, t);
		if (n === -1 || o(e, n + t.leftDelimiter.length, t) !== e.length - t.rightDelimiter.length) return e;
		let r = e.slice(0, n);
		return /[ \n]$/.test(r) ? r.slice(0, -1) : r;
	};
	function t(e) {
		return e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
	}
	e.escapeRegExp = t, e.getMatchingOpeningToken = function(e, t) {
		if (e[t].type === "softbreak") return !1;
		if (e[t].nesting === 0) return e[t];
		let n = e[t].level, r = e[t].type.replace("_close", "_open");
		for (; t >= 0; --t) if (e[t].type === r && e[t].level === n) return e[t];
		return !1;
	};
	var n = /[&<>"]/, r = /[&<>"]/g, i = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function a(e) {
		return i[e];
	}
	e.escapeHtml = function(e) {
		return n.test(e) ? e.replace(r, a) : e;
	};
	function o(e, t, n) {
		let r = !1;
		for (let i = t; i < e.length; i++) {
			if (c(e, i)) {
				r = !r;
				continue;
			}
			if (!r && e.slice(i, i + n.rightDelimiter.length) === n.rightDelimiter) return i;
		}
		return -1;
	}
	function s(e, t) {
		let n = -1, r = !1;
		for (let i = 0; i < e.length; i++) {
			if (c(e, i)) {
				r = !r;
				continue;
			}
			!r && e.slice(i, i + t.leftDelimiter.length) === t.leftDelimiter && (n = i);
		}
		return n;
	}
	e.findLeftDelimiter = s;
	function c(e, t) {
		if (e.charAt(t) !== "\"") return !1;
		let n = 0;
		for (let r = t - 1; r >= 0 && e.charAt(r) === "\\"; r--) n++;
		return n % 2 == 0;
	}
})), ui = /* @__PURE__ */ d(((e, t) => {
	var n = li();
	t.exports = (e) => {
		let t = RegExp("^ {0,3}[-*_]{3,} ?" + n.escapeRegExp(e.leftDelimiter) + "[^" + n.escapeRegExp(e.rightDelimiter) + "]");
		return [
			{
				name: "fenced code blocks",
				tests: [{
					shift: 0,
					block: !0,
					info: n.hasDelimiters("end", e)
				}],
				transform: (t, r) => {
					let i = t[r], a = n.findLeftDelimiter(i.info, e), o = n.getAttrs(i.info, a, e);
					n.addAttrs(o, i), i.info = n.removeDelimiter(i.info, e);
				}
			},
			{
				name: "inline nesting 0",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						shift: -1,
						type: (e) => e === "image" || e === "code_inline"
					}, {
						shift: 0,
						type: "text",
						content: n.hasDelimiters("start", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = a.content.indexOf(e.rightDelimiter), s = t[r].children[i - 1], c = n.getAttrs(a.content, 0, e);
					n.addAttrs(c, s), a.content.length === o + e.rightDelimiter.length ? t[r].children.splice(i, 1) : a.content = a.content.slice(o + e.rightDelimiter.length);
				}
			},
			{
				name: "tables",
				tests: [
					{
						shift: 0,
						type: "table_close"
					},
					{
						shift: 1,
						type: "paragraph_open"
					},
					{
						shift: 2,
						type: "inline",
						content: n.hasDelimiters("only", e)
					}
				],
				transform: (t, r) => {
					let i = t[r + 2], a = n.getMatchingOpeningToken(t, r), o = n.getAttrs(i.content, 0, e);
					n.addAttrs(o, a), t.splice(r + 1, 3);
				}
			},
			{
				name: "tables thead metadata",
				tests: [
					{
						shift: 0,
						type: "tr_close"
					},
					{
						shift: 1,
						type: "thead_close"
					},
					{
						shift: 2,
						type: "tbody_open"
					}
				],
				transform: (e, t) => {
					let r = n.getMatchingOpeningToken(e, t), i = e[t - 1], a = 0, o = t;
					for (; --o;) {
						if (e[o] === r) {
							e[o - 1].meta = Object.assign({}, e[o + 2].meta, { colsnum: a });
							break;
						}
						a += (e[o].level === i.level && e[o].type === i.type) >> 0;
					}
					e[t + 2].meta = Object.assign({}, e[t + 2].meta, { colsnum: a });
				}
			},
			{
				name: "tables tbody calculate",
				tests: [{
					shift: 0,
					type: "tbody_close",
					hidden: !1
				}],
				transform: (e, t) => {
					let n = t - 2;
					for (; n > 0 && e[--n].type !== "tbody_open";);
					let r = (e[n].meta && e[n].meta.colsnum) >> 0;
					if (r < 2) return;
					let i = e[t].level + 2;
					for (let o = n; o < t; o++) {
						if (e[o].level > i) continue;
						let s = e[o], c = s.hidden ? 0 : s.attrGet("rowspan") >> 0, l = s.hidden ? 0 : s.attrGet("colspan") >> 0;
						if (c > 1) {
							let t = r - (l > 0 ? l : 1);
							for (let n = o, r = c; r > 1; n++) e[n].type == "tr_open" && (e[n].meta = Object.assign({}, e[n].meta), e[n].meta && e[n].meta.colsnum && --t, e[n].meta.colsnum = t, r--);
						}
						if (s.type == "tr_open" && s.meta && s.meta.colsnum) {
							let n = s.meta.colsnum;
							for (let r = o, i = 0; r < t; r++) {
								if (e[r].type == "td_open") i += 1;
								else if (e[r].type == "tr_close") break;
								i > n && (e[r].hidden || a(e[r]));
							}
						}
						if (l > 1) {
							let i = [], c = o + 3, u = r;
							for (let t = o; t > n; t--) if (e[t].type == "tr_open") {
								u = e[t].meta && e[t].meta.colsnum || u;
								break;
							} else e[t].type === "td_open" && i.unshift(t);
							for (let n = o + 2; n < t; n++) if (e[n].type == "tr_close") {
								c = n;
								break;
							} else e[n].type == "td_open" && i.push(n);
							let d = i.indexOf(o), f = u - d;
							f = f > l ? l : f, l > f && s.attrSet("colspan", f + "");
							for (let t = i.slice(u + 1 - r - f)[0]; t < c; t++) e[t].hidden || a(e[t]);
						}
					}
				}
			},
			{
				name: "inline attributes",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						shift: -1,
						nesting: -1
					}, {
						shift: 0,
						type: "text",
						content: n.hasDelimiters("start", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = a.content, s = n.getAttrs(o, 0, e), c = n.getMatchingOpeningToken(t[r].children, i - 1);
					n.addAttrs(s, c), a.content = o.slice(o.indexOf(e.rightDelimiter) + e.rightDelimiter.length);
				}
			},
			{
				name: "list softbreak",
				tests: [{
					shift: -2,
					type: "list_item_open"
				}, {
					shift: 0,
					type: "inline",
					children: [{
						position: -2,
						type: "softbreak"
					}, {
						position: -1,
						type: "text",
						content: n.hasDelimiters("only", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i].content, o = n.getAttrs(a, 0, e), s = r - 2;
					for (; t[s - 1] && t[s - 1].type !== "ordered_list_open" && t[s - 1].type !== "bullet_list_open";) s--;
					n.addAttrs(o, t[s - 1]), t[r].children = t[r].children.slice(0, -2);
				}
			},
			{
				name: "list double softbreak",
				tests: [
					{
						shift: 0,
						type: (e) => e === "bullet_list_close" || e === "ordered_list_close"
					},
					{
						shift: 1,
						type: "paragraph_open"
					},
					{
						shift: 2,
						type: "inline",
						content: n.hasDelimiters("only", e),
						children: (e) => e.length === 1
					},
					{
						shift: 3,
						type: "paragraph_close"
					}
				],
				transform: (t, r) => {
					let i = t[r + 2].content, a = n.getAttrs(i, 0, e), o = n.getMatchingOpeningToken(t, r);
					n.addAttrs(a, o), t.splice(r + 1, 3);
				}
			},
			{
				name: "list item end",
				tests: [{
					shift: -2,
					type: "list_item_open"
				}, {
					shift: 0,
					type: "inline",
					children: [{
						position: -1,
						type: "text",
						content: n.hasDelimiters("end", e)
					}]
				}],
				transform: (t, i, a) => {
					let o = t[i].children[a], s = o.content, c = n.getAttrs(s, n.findLeftDelimiter(s, e), e);
					n.addAttrs(c, t[i - 2]);
					let l = s.slice(0, n.findLeftDelimiter(s, e));
					o.content = r(l) === " " ? l.slice(0, -1) : l;
				}
			},
			{
				name: "\n{.a} softbreak then curly in start",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						position: -2,
						type: "softbreak"
					}, {
						position: -1,
						type: "text",
						content: n.hasDelimiters("only", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = n.getAttrs(a.content, 0, e), s = r + 1;
					for (; t[s + 1] && t[s + 1].nesting === -1;) s++;
					let c = n.getMatchingOpeningToken(t, s);
					n.addAttrs(o, c), t[r].children = t[r].children.slice(0, -2);
				}
			},
			{
				name: "horizontal rule",
				tests: [
					{
						shift: 0,
						type: "paragraph_open"
					},
					{
						shift: 1,
						type: "inline",
						children: (e) => e.length === 1,
						content: (e) => e.match(t) !== null
					},
					{
						shift: 2,
						type: "paragraph_close"
					}
				],
				transform: (t, r) => {
					let i = t[r];
					i.type = "hr", i.tag = "hr", i.nesting = 0;
					let a = t[r + 1].content, o = a.lastIndexOf(e.leftDelimiter), s = n.getAttrs(a, o, e);
					n.addAttrs(s, i), i.markup = a, t.splice(r + 1, 2);
				}
			},
			{
				name: "end of block",
				tests: [{
					shift: 0,
					type: "inline",
					children: (t) => i(t, e) !== null
				}],
				transform: (t, a) => {
					let o = i(t[a].children, e);
					if (!o) return;
					let s = o.content, c = n.getAttrs(s, n.findLeftDelimiter(s, e), e), l = a + 1;
					for (; l < t.length && t[l].nesting !== -1;) l++;
					if (l >= t.length) return;
					let u = n.getMatchingOpeningToken(t, l);
					n.addAttrs(c, u);
					let d = s.slice(0, n.findLeftDelimiter(s, e));
					o.content = r(d) === " " ? d.slice(0, -1) : d;
				}
			}
		];
	};
	function r(e) {
		return e.slice(-1)[0];
	}
	function i(e, t) {
		let r = 0;
		for (let i = e.length - 1; i >= 0; i--) {
			let a = e[i];
			if (a.type === "code_inline" || a.type === "math_inline") return null;
			if (a.nesting === -1) {
				r++;
				continue;
			}
			if (a.nesting === 1) {
				if (r--, r < 0) return null;
				continue;
			}
			if (!(r > 0) && a.type === "text" && a.content.trim() !== "") return n.hasDelimiters("end", t)(a.content) ? a : null;
		}
		return null;
	}
	function a(e) {
		e.hidden = !0, e.children && e.children.forEach((e) => (e.content = "", a(e), void 0));
	}
})), di = /* @__PURE__ */ d(((e, t) => {
	var n = ci(), r = ui(), i = {
		leftDelimiter: "{",
		rightDelimiter: "}",
		allowedAttributes: [],
		allowedAttributeValues: [],
		fenceAttrsOnPre: !0
	};
	t.exports = function(e, t) {
		let o = Object.assign({}, i);
		o = Object.assign(o, t);
		let s = r(o);
		function c(e) {
			let t = e.tokens;
			for (let e = 0; e < t.length; e++) for (let n = 0; n < s.length; n++) {
				let r = s[n], i = null;
				if (r.tests.every((n) => {
					let r = a(t, e, n);
					return r.j !== null && (i = r.j), r.match;
				})) try {
					r.transform(t, e, i), (r.name === "inline attributes" || r.name === "inline nesting 0") && n--;
				} catch (e) {
					typeof o.errorHandler == "function" ? o.errorHandler(e, r.name) : (console.error(`markdown-it-attrs: Error in pattern '${r.name}': ${e.message}`), console.error(e.stack));
				}
			}
		}
		e.core.ruler.before("linkify", "curly_attributes", c);
		let l = n().renderer.rules.fence, u = e.renderer.rules.fence, d = typeof u == "function" && u !== l;
		o.fenceAttrsOnPre && !d && typeof u == "function" && (e.renderer.rules.fence = function(e, t, n, r, i) {
			let a = e[t], o = a.attrs ? a.attrs.slice() : null;
			a.attrs = null;
			let s = u(e, t, n, r, i);
			if (a.attrs = o, !o || o.length === 0) return s;
			let c = i.renderAttrs(a);
			return s.replace(/^<pre([ >])/, (e, t) => `<pre${c}${t}`);
		});
	};
	function a(e, t, n) {
		let r = {
			match: !1,
			j: null
		}, i = n.shift === void 0 ? n.position : t + n.shift;
		if (n.shift !== void 0 && i < 0) return r;
		let u = c(e, i);
		if (u === void 0) return r;
		for (let e of Object.keys(n)) if (!(e === "shift" || e === "position")) {
			if (u[e] === void 0) return r;
			if (e === "children" && o(n.children)) {
				if (u.children.length === 0) return r;
				let e, t = n.children, i = u.children;
				if (t.every((e) => e.position !== void 0)) {
					if (e = t.every((e) => a(i, e.position, e).match), e) {
						let e = l(t).position;
						r.j = e >= 0 ? e : i.length + e;
					}
				} else for (let n = 0; n < i.length; n++) if (e = t.every((e) => a(i, n, e).match), e) {
					r.j = n;
					break;
				}
				if (e === !1) return r;
				continue;
			}
			switch (typeof n[e]) {
				case "boolean":
				case "number":
				case "string":
					if (u[e] !== n[e]) return r;
					break;
				case "function":
					if (!n[e](u[e])) return r;
					break;
				case "object": if (s(n[e])) {
					if (n[e].every((t) => t(u[e])) === !1) return r;
					break;
				}
				default: throw Error(`Unknown type of pattern test (key: ${e}). Test should be of type boolean, number, string, function or array of functions.`);
			}
		}
		return r.match = !0, r;
	}
	function o(e) {
		return Array.isArray(e) && e.length && e.every((e) => typeof e == "object");
	}
	function s(e) {
		return Array.isArray(e) && e.length && e.every((e) => typeof e == "function");
	}
	function c(e, t) {
		return t >= 0 ? e[t] : e[e.length + t];
	}
	function l(e) {
		return e.slice(-1)[0] || {};
	}
})), fi = Symbol("markdown-it-deflist.ddDepth");
function pi(e) {
	let t = e.utils.isSpace;
	function n(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
		if (n >= r || e.sCount[t] - e.blkIndent >= 4) return -1;
		let i = e.src.charCodeAt(n++);
		if (i !== 126 && i !== 58) return -1;
		let a = e.skipSpaces(n);
		return n < r && n === a ? -1 : n;
	}
	function r(e, t, n, r) {
		let i = -1;
		for (let a = t; a < n; a++) {
			let t = e.tokens[a];
			if (!(t.level !== r || !t.block || t.nesting < 0)) {
				if (i >= 0) return;
				i = a;
			}
		}
		i < 0 || e.tokens[i].type !== "paragraph_open" || (e.tokens[i + 2].hidden = !0, e.tokens[i].hidden = !0);
	}
	function i(e, i, a, o) {
		if (o) return e.env[fi] ? n(e, i) >= 0 && e.sCount[i] < e.blkIndent : !1;
		let s = i + 1;
		if (s >= a) return !1;
		let c = !0;
		if (e.isEmpty(s) && (s++, c = !1, s >= a) || e.sCount[s] < e.blkIndent) return !1;
		let l = n(e, s);
		if (l < 0) return !1;
		let u = e.push("dl_open", "dl", 1), d = [i, 0];
		u.map = d;
		let f = i, p = s;
		OUTER: for (;;) {
			let i = e.push("dt_open", "dt", 1);
			i.map = [f, f];
			let o = e.push("inline", "", 0);
			for (o.map = [f, f], o.content = e.getLines(f, f + 1, e.blkIndent, !1).trim(), o.children = [], e.push("dt_close", "dt", -1);;) {
				let i = e.tokens.length, o = e.push("dd_open", "dd", 1), u = [s, 0];
				o.map = u;
				let d = l, f = e.eMarks[p], m = e.sCount[p] + l - (e.bMarks[p] + e.tShift[p]);
				for (; d < f;) {
					let n = e.src.charCodeAt(d);
					if (t(n)) n === 9 ? m += 4 - m % 4 : m++;
					else break;
					d++;
				}
				l = d;
				let h = e.tight, g = e.blkIndent, _ = e.tShift[p], v = e.sCount[p], y = e.parentType;
				if (e.blkIndent = e.sCount[p] + 2, e.tShift[p] = l - e.bMarks[p], e.sCount[p] = m, e.tight = !0, e.parentType = "deflist", e.env[fi] = (e.env[fi] || 0) + 1, e.md.block.tokenize(e, p, a, !0), e.env[fi]--, c && r(e, i, e.tokens.length, o.level + 1), e.tShift[p] = _, e.sCount[p] = v, e.tight = h, e.parentType = y, e.blkIndent = g, e.push("dd_close", "dd", -1), u[1] = s = e.line, s >= a || e.sCount[s] < e.blkIndent) break OUTER;
				if (l = n(e, s), l < 0) break;
				p = s;
			}
			if (s >= a || (f = s, e.isEmpty(f)) || e.sCount[f] < e.blkIndent || (p = f + 1, p >= a)) break;
			let u = e.isEmpty(p);
			if (u && p++, p >= a || e.sCount[p] < e.blkIndent || (l = n(e, p), l < 0)) break;
			c = !u;
		}
		return e.push("dl_close", "dl", -1), d[1] = s, e.line = s, !0;
	}
	e.block.ruler.before("paragraph", "deflist", i, { alt: [
		"paragraph",
		"reference",
		"blockquote"
	] });
}
var mi = /* @__PURE__ */ d(((e, t) => {
	function n() {
		this.__highest_alphabet__ = 0, this.__match_alphabets__ = {}, this.__initial_state__ = 0, this.__accept_states__ = {}, this.__transitions__ = {}, this.__actions__ = {};
	}
	n.prototype.set_highest_alphabet = function(e) {
		this.__highest_alphabet__ = e;
	}, n.prototype.set_match_alphabets = function(e) {
		this.__match_alphabets__ = e;
	}, n.prototype.set_initial_state = function(e) {
		this.__initial_state__ = e;
	}, n.prototype.set_accept_states = function(e) {
		for (var t = 0; t < e.length; t++) this.__accept_states__[e[t]] = !0;
	}, n.prototype.set_transitions = function(e) {
		this.__transitions__ = e;
	}, n.prototype.set_actions = function(e) {
		this.__actions__ = e;
	}, n.prototype.update_transition = function(e, t) {
		this.__transitions__[e] = Object.assign(this.__transitions__[e] || {}, t);
	}, n.prototype.execute = function(e, t) {
		var n, r, i;
		for (n = this.__initial_state__, r = e; n && r < t; r++) {
			for (i = this.__highest_alphabet__; i > 0 && !(n & i && this.__match_alphabets__[i].call(this, r, n, i)); i >>= 4);
			if (this.__actions__(r, n, i), i === 0) break;
			n = this.__transitions__[n][i] || 0;
		}
		return !!this.__accept_states__[n];
	}, t.exports = n;
})), hi = /* @__PURE__ */ d(((e, t) => {
	var n = mi();
	t.exports = function(e, t) {
		t = e.utils.assign({}, {
			multiline: !1,
			rowspan: !1,
			headerless: !1,
			multibody: !0,
			autolabel: !0
		}, t || {});
		function r(e, t) {
			var n = e.bMarks[t] + e.sCount[t], r = e.bMarks[t] + e.blkIndent, i = e.skipSpacesBack(e.eMarks[t], r), a = [], o, s, c = !1, l = !1, u = 0;
			for (o = n; o < i; o++) switch (e.src.charCodeAt(o)) {
				case 92:
					c = !0;
					break;
				case 96:
					s = e.skipChars(o, 96) - 1, s > o ? (l || (u === 0 ? u = s - o : u === s - o && (u = 0)), o = s) : (l || !c && !u) && (l = !l), c = !1;
					break;
				case 124:
					!l && !c && a.push(o), c = !1;
					break;
				default:
					c = !1;
					break;
			}
			return a.length === 0 ? a : (a[0] > r && a.unshift(r - 1), a[a.length - 1] < i - 1 && a.push(i), a);
		}
		function i(e, n, r) {
			var i = {
				text: null,
				label: null
			}, a = e.bMarks[r] + e.sCount[r], o = e.eMarks[r], s = e.src.slice(a, o).match(/^\[(.+?)\](\[([^\[\]]+)\])?\s*$/);
			return s ? n ? !0 : (i.text = s[1], !t.autolabel && !s[2] ? i : (i.label = s[2] || s[1], i.label = i.label.toLowerCase().replace(/\W+/g, ""), i)) : !1;
		}
		function a(e, n, i) {
			var a = {
				bounds: null,
				multiline: null
			}, o = r(e, i), s, c, l;
			return o.length < 2 ? !1 : n ? !0 : (a.bounds = o, t.multiline && (s = e.bMarks[i] + e.sCount[i], c = e.eMarks[i] - 1, a.multiline = e.src.charCodeAt(c) === 92, a.multiline && (l = e.eMarks[i], e.eMarks[i] = e.skipSpacesBack(c, s), a.bounds = r(e, i), e.eMarks[i] = l)), a);
		}
		function o(e, t, n) {
			var i = {
				aligns: [],
				wraps: []
			}, a = r(e, n), o = /^:?(-+|=+):?\+?$/, s, c, l;
			if (e.sCount[n] - e.blkIndent >= 4 || a.length === 0) return !1;
			for (s = 0; s < a.length - 1; s++) {
				if (c = e.src.slice(a[s] + 1, a[s + 1]).trim(), !o.test(c)) return !1;
				switch (i.wraps.push(c.charCodeAt(c.length - 1) === 43), l = (c.charCodeAt(0) === 58) << 4 | c.charCodeAt(c.length - 1 - i.wraps[s]) === 58, l) {
					case 0:
						i.aligns.push("");
						break;
					case 1:
						i.aligns.push("right");
						break;
					case 16:
						i.aligns.push("left");
						break;
					case 17:
						i.aligns.push("center");
						break;
				}
			}
			return t ? !0 : i;
		}
		function s(e, t, n) {
			return e.isEmpty(n);
		}
		function c(e, r, c, l) {
			var u = new n(), d = 16, f = -1, p, m, h, g, _, v, y = [], b, x, S, C, w, T, E, ee, te, ne;
			if (r + 2 > c || (m = new e.Token("table_open", "table", 1), m.meta = {
				sep: null,
				cap: null,
				tr: []
			}, u.set_highest_alphabet(65536), u.set_initial_state(65792), u.set_accept_states([
				65552,
				65553,
				0
			]), u.set_match_alphabets({
				65536: i.bind(this, e, !0),
				4096: o.bind(this, e, !0),
				256: a.bind(this, e, !0),
				16: a.bind(this, e, !0),
				1: s.bind(this, e, !0)
			}), u.set_transitions({
				65792: {
					65536: 256,
					256: 4352
				},
				256: { 256: 4352 },
				4352: {
					4096: 65552,
					256: 4352
				},
				65552: {
					65536: 0,
					16: 65553
				},
				65553: {
					65536: 0,
					16: 65553,
					1: 65552
				}
			}), t.headerless && (u.set_initial_state(69888), u.update_transition(69888, {
				65536: 4352,
				4096: 65552,
				256: 4352
			}), h = new e.Token("tr_placeholder", "tr", 0), h.meta = {}), t.multibody || u.update_transition(65552, {
				65536: 0,
				16: 65552
			}), u.set_actions(function(n, s, c) {
				switch (c) {
					case 65536:
						if (m.meta.cap) break;
						m.meta.cap = i(e, !1, n), m.meta.cap.map = [n, n + 1], m.meta.cap.first = n === r;
						break;
					case 4096:
						m.meta.sep = o(e, !1, n), m.meta.sep.map = [n, n + 1], h.meta.grp |= 1, d = 16;
						break;
					case 256:
					case 16:
						h = new e.Token("tr_open", "tr", 1), h.map = [n, n + 1], h.meta = a(e, !1, n), h.meta.type = c, h.meta.grp = d, d = 0, m.meta.tr.push(h), t.multiline && (h.meta.multiline && f < 0 ? f = m.meta.tr.length - 1 : !h.meta.multiline && f >= 0 && (p = m.meta.tr[f], p.meta.mbounds = m.meta.tr.slice(f).map(function(e) {
							return e.meta.bounds;
						}), p.map[1] = h.map[1], m.meta.tr = m.meta.tr.slice(0, f + 1), f = -1));
						break;
					case 1:
						h.meta.grp |= 1, d = 16;
						break;
				}
			}), u.execute(r, c) === !1) || !m.meta.tr.length) return !1;
			if (l) return !0;
			if (m.meta.tr[m.meta.tr.length - 1].meta.grp |= 1, m.map = b = [r, 0], m.block = !0, m.level = e.level++, e.tokens.push(m), m.meta.cap) {
				p = e.push("caption_open", "caption", 1), p.map = m.meta.cap.map;
				var re = [], D = m.meta.cap.first ? "top" : "bottom";
				m.meta.cap.label !== null && re.push(["id", m.meta.cap.label]), D !== "top" && re.push(["style", "caption-side: " + D]), p.attrs = re, p = e.push("inline", "", 0), p.content = m.meta.cap.text, p.map = m.meta.cap.map, p.children = [], p = e.push("caption_close", "caption", -1);
			}
			for (T = 0; T < m.meta.tr.length; T++) {
				for (_ = new e.Token("td_th_placeholder", "", 0), h = m.meta.tr[T], h.meta.grp & 16 && (S = h.meta.type === 256 ? "thead" : "tbody", p = e.push(S + "_open", S, 1), p.map = x = [h.map[0], 0], y = []), h.block = !0, h.level = e.level++, e.tokens.push(h), E = 0; E < h.meta.bounds.length - 1; E++) {
					if (w = [h.meta.bounds[E] + 1, h.meta.bounds[E + 1]], C = e.src.slice.apply(e.src, w), C === "") {
						g = _.attrGet("colspan"), _.attrSet("colspan", g === null ? 2 : g + 1);
						continue;
					}
					if (t.rowspan && y[E] && C.trim() === "^^") {
						v = y[E].attrGet("rowspan"), y[E].attrSet("rowspan", v === null ? 2 : v + 1), _ = new e.Token("td_th_placeholder", "", 0);
						continue;
					}
					if (S = h.meta.type === 256 ? "th" : "td", p = e.push(S + "_open", S, 1), p.map = h.map, p.attrs = [], m.meta.sep.aligns[E] && p.attrs.push(["style", "text-align:" + m.meta.sep.aligns[E]]), m.meta.sep.wraps[E] && p.attrs.push(["class", "extend"]), _ = y[E] = p, t.multiline && h.meta.multiline && h.meta.mbounds) {
						for (C = Array(h.map[0]).fill("").concat([C.trimRight()]), ee = 1; ee < h.meta.mbounds.length; ee++) E > h.meta.mbounds[ee].length - 2 || (w = [h.meta.mbounds[ee][E] + 1, h.meta.mbounds[ee][E + 1]], C.push(e.src.slice.apply(e.src, w).trimRight()));
						for (ne = new e.md.block.State(C.join("\n"), e.md, e.env, []), ne.level = h.level + 1, e.md.block.tokenize(ne, h.map[0], ne.lineMax), te = 0; te < ne.tokens.length; te++) e.tokens.push(ne.tokens[te]);
					} else p = e.push("inline", "", 0), p.content = C.trim(), p.map = h.map, p.level = h.level + 1, p.children = [];
					p = e.push(S + "_close", S, -1);
				}
				e.push("tr_close", "tr", -1), h.meta.grp & 1 && (S = h.meta.type === 256 ? "thead" : "tbody", p = e.push(S + "_close", S, -1), x[1] = h.map[1]);
			}
			return b[1] = Math.max(x[1], m.meta.sep.map[1], m.meta.cap ? m.meta.cap.map[1] : -1), p = e.push("table_close", "table", -1), e.line = b[1], !0;
		}
		e.block.ruler.at("table", c, { alt: ["paragraph", "reference"] });
	};
})), gi = {};
function _i(e) {
	let t = gi[e];
	if (t) return t;
	t = gi[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		t.push(n);
	}
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		t[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
	}
	return t;
}
function vi(e, t) {
	typeof t != "string" && (t = vi.defaultChars);
	let n = _i(t);
	return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
		let t = "";
		for (let r = 0, i = e.length; r < i; r += 3) {
			let a = parseInt(e.slice(r + 1, r + 3), 16);
			if (a < 128) {
				t += n[a];
				continue;
			}
			if ((a & 224) == 192 && r + 3 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16);
				if ((n & 192) == 128) {
					let e = a << 6 & 1984 | n & 63;
					e < 128 ? t += "��" : t += String.fromCharCode(e), r += 3;
					continue;
				}
			}
			if ((a & 240) == 224 && r + 6 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16);
				if ((n & 192) == 128 && (i & 192) == 128) {
					let e = a << 12 & 61440 | n << 6 & 4032 | i & 63;
					e < 2048 || e >= 55296 && e <= 57343 ? t += "���" : t += String.fromCharCode(e), r += 6;
					continue;
				}
			}
			if ((a & 248) == 240 && r + 9 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16), o = parseInt(e.slice(r + 10, r + 12), 16);
				if ((n & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
					let e = a << 18 & 1835008 | n << 12 & 258048 | i << 6 & 4032 | o & 63;
					e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), r += 9;
					continue;
				}
			}
			t += "�";
		}
		return t;
	});
}
vi.defaultChars = ";/?:@&=+$,#", vi.componentChars = "";
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/mdurl@2.1.0/node_modules/mdurl/lib/encode.mjs
var yi = {};
function bi(e) {
	let t = yi[e];
	if (t) return t;
	t = yi[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function xi(e, t, n) {
	typeof t != "string" && (n = t, t = xi.defaultChars), n === void 0 && (n = !0);
	let r = bi(t), i = "";
	for (let t = 0, a = e.length; t < a; t++) {
		let o = e.charCodeAt(t);
		if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
			i += e.slice(t, t + 3), t += 2;
			continue;
		}
		if (o < 128) {
			i += r[o];
			continue;
		}
		if (o >= 55296 && o <= 57343) {
			if (o >= 55296 && o <= 56319 && t + 1 < a) {
				let n = e.charCodeAt(t + 1);
				if (n >= 56320 && n <= 57343) {
					i += encodeURIComponent(e[t] + e[t + 1]), t++;
					continue;
				}
			}
			i += "%EF%BF%BD";
			continue;
		}
		i += encodeURIComponent(e[t]);
	}
	return i;
}
xi.defaultChars = ";/?:@&=+$,-_.!~*'()#", xi.componentChars = "-_.!~*'()";
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/mdurl@2.1.0/node_modules/mdurl/lib/format.mjs
function Si(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/mdurl@2.1.0/node_modules/mdurl/lib/parse.mjs
function Ci() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var wi = /^([a-z0-9.+-]+:)/i, Ti = /:[0-9]*$/, Ei = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Di = [
	"%",
	"/",
	"?",
	";",
	"#",
	"'",
	"{",
	"}",
	"|",
	"\\",
	"^",
	"`",
	"<",
	">",
	"\"",
	"`",
	" ",
	"\r",
	"\n",
	"	"
], Oi = [
	"/",
	"?",
	"#"
], ki = 255, Ai = /^[+a-z0-9A-Z_-]{0,63}$/, ji = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Mi = {
	javascript: !0,
	"javascript:": !0
}, Ni = {
	http: !0,
	https: !0,
	ftp: !0,
	gopher: !0,
	file: !0,
	"http:": !0,
	"https:": !0,
	"ftp:": !0,
	"gopher:": !0,
	"file:": !0
};
function Pi(e, t) {
	if (e && e instanceof Ci) return e;
	let n = new Ci();
	return n.parse(e, t), n;
}
Ci.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = Ei.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = wi.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Mi[o]) && (a = a.substr(2), this.slashes = !0)), !Mi[o] && (i || o && !Ni[o])) {
		let e = -1;
		for (let t = 0; t < Oi.length; t++) r = a.indexOf(Oi[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Di.length; t++) r = a.indexOf(Di[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(Ai)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(Ai)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(ji);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > ki && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), Ni[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, Ci.prototype.parseHost = function(e) {
	let t = Ti.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/mdurl@2.1.0/node_modules/mdurl/index.mjs
var Fi = /* @__PURE__ */ n({
	decode: () => vi,
	encode: () => xi,
	format: () => Si,
	parse: () => Pi
}), Ii = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Li = /[\0-\x1F\x7F-\x9F]/, Ri = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, zi = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Bi = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, Vi = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Hi = /* @__PURE__ */ n({
	Any: () => Ii,
	Cc: () => Li,
	Cf: () => Ri,
	P: () => zi,
	S: () => Bi,
	Z: () => Vi
}), Ui = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((e) => e.charCodeAt(0))), Wi = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((e) => e.charCodeAt(0))), Gi = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]), Ki = String.fromCodePoint ?? function(e) {
	let t = "";
	return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
};
function qi(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : Gi.get(e) ?? e;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/decode.js
var J;
(function(e) {
	e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})(J ||= {});
var Ji = 32, Yi;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(Yi ||= {});
function Xi(e) {
	return e >= J.ZERO && e <= J.NINE;
}
function Zi(e) {
	return e >= J.UPPER_A && e <= J.UPPER_F || e >= J.LOWER_A && e <= J.LOWER_F;
}
function Qi(e) {
	return e >= J.UPPER_A && e <= J.UPPER_Z || e >= J.LOWER_A && e <= J.LOWER_Z || Xi(e);
}
function $i(e) {
	return e === J.EQUALS || Qi(e);
}
var Y;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Y ||= {});
var ea;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(ea ||= {});
var ta = class {
	constructor(e, t, n) {
		this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = Y.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = ea.Strict;
	}
	startEntity(e) {
		this.decodeMode = e, this.state = Y.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
	}
	write(e, t) {
		switch (this.state) {
			case Y.EntityStart: return e.charCodeAt(t) === J.NUM ? (this.state = Y.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = Y.NamedEntity, this.stateNamedEntity(e, t));
			case Y.NumericStart: return this.stateNumericStart(e, t);
			case Y.NumericDecimal: return this.stateNumericDecimal(e, t);
			case Y.NumericHex: return this.stateNumericHex(e, t);
			case Y.NamedEntity: return this.stateNamedEntity(e, t);
		}
	}
	stateNumericStart(e, t) {
		return t >= e.length ? -1 : (e.charCodeAt(t) | Ji) === J.LOWER_X ? (this.state = Y.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = Y.NumericDecimal, this.stateNumericDecimal(e, t));
	}
	addToNumericResult(e, t, n, r) {
		if (t !== n) {
			let i = n - t;
			this.result = this.result * r ** +i + parseInt(e.substr(t, i), r), this.consumed += i;
		}
	}
	stateNumericHex(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (Xi(r) || Zi(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
		}
		return this.addToNumericResult(e, n, t, 16), -1;
	}
	stateNumericDecimal(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (Xi(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
		}
		return this.addToNumericResult(e, n, t, 10), -1;
	}
	emitNumericEntity(e, t) {
		var n;
		if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
		if (e === J.SEMI) this.consumed += 1;
		else if (this.decodeMode === ea.Strict) return 0;
		return this.emitCodePoint(qi(this.result), this.consumed), this.errors && (e !== J.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
	}
	stateNamedEntity(e, t) {
		let { decodeTree: n } = this, r = n[this.treeIndex], i = (r & Yi.VALUE_LENGTH) >> 14;
		for (; t < e.length; t++, this.excess++) {
			let a = e.charCodeAt(t);
			if (this.treeIndex = ra(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === ea.Attribute && (i === 0 || $i(a)) ? 0 : this.emitNotTerminatedNamedEntity();
			if (r = n[this.treeIndex], i = (r & Yi.VALUE_LENGTH) >> 14, i !== 0) {
				if (a === J.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
				this.decodeMode !== ea.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
			}
		}
		return -1;
	}
	emitNotTerminatedNamedEntity() {
		var e;
		let { result: t, decodeTree: n } = this, r = (n[t] & Yi.VALUE_LENGTH) >> 14;
		return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
	}
	emitNamedEntityData(e, t, n) {
		let { decodeTree: r } = this;
		return this.emitCodePoint(t === 1 ? r[e] & ~Yi.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
	}
	end() {
		var e;
		switch (this.state) {
			case Y.NamedEntity: return this.result !== 0 && (this.decodeMode !== ea.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case Y.NumericDecimal: return this.emitNumericEntity(0, 2);
			case Y.NumericHex: return this.emitNumericEntity(0, 3);
			case Y.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			case Y.EntityStart: return 0;
		}
	}
};
function na(e) {
	let t = "", n = new ta(e, (e) => t += Ki(e));
	return function(e, r) {
		let i = 0, a = 0;
		for (; (a = e.indexOf("&", a)) >= 0;) {
			t += e.slice(i, a), n.startEntity(r);
			let o = n.write(e, a + 1);
			if (o < 0) {
				i = a + n.end();
				break;
			}
			i = a + o, a = o === 0 ? i + 1 : i;
		}
		let o = t + e.slice(i);
		return t = "", o;
	};
}
function ra(e, t, n, r) {
	let i = (t & Yi.BRANCH_LENGTH) >> 7, a = t & Yi.JUMP_TABLE;
	if (i === 0) return a !== 0 && r === a ? n : -1;
	if (a) {
		let t = r - a;
		return t < 0 || t >= i ? -1 : e[n + t] - 1;
	}
	let o = n, s = o + i - 1;
	for (; o <= s;) {
		let t = o + s >>> 1, n = e[t];
		if (n < r) o = t + 1;
		else if (n > r) s = t - 1;
		else return e[t + i];
	}
	return -1;
}
var ia = na(Ui);
na(Wi);
function aa(e, t = ea.Legacy) {
	return ia(e, t);
}
function oa(e) {
	return ia(e, ea.Strict);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/common/utils.mjs
var sa = /* @__PURE__ */ n({
	arrayReplaceAt: () => pa,
	asciiTrim: () => Fa,
	assign: () => fa,
	escapeHtml: () => Ea,
	escapeRE: () => Oa,
	fromCodePoint: () => ha,
	has: () => da,
	isMdAsciiPunct: () => Ma,
	isPunctChar: () => Aa,
	isPunctCharCode: () => ja,
	isSpace: () => X,
	isString: () => la,
	isValidEntityCode: () => ma,
	isWhiteSpace: () => ka,
	lib: () => Ia,
	normalizeReference: () => Na,
	unescapeAll: () => xa,
	unescapeMd: () => ba
});
function ca(e) {
	return Object.prototype.toString.call(e);
}
function la(e) {
	return ca(e) === "[object String]";
}
var ua = Object.prototype.hasOwnProperty;
function da(e, t) {
	return ua.call(e, t);
}
function fa(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		if (t) {
			if (typeof t != "object") throw TypeError(t + "must be object");
			Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}
	}), e;
}
function pa(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function ma(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function ha(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var ga = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, _a = RegExp(ga.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), va = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function ya(e, t) {
	if (t.charCodeAt(0) === 35 && va.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return ma(n) ? ha(n) : e;
	}
	let n = aa(e);
	return n === e ? e : n;
}
function ba(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(ga, "$1");
}
function xa(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(_a, function(e, t, n) {
		return t || ya(e, n);
	});
}
var Sa = /[&<>"]/, Ca = /[&<>"]/g, wa = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Ta(e) {
	return wa[e];
}
function Ea(e) {
	return Sa.test(e) ? e.replace(Ca, Ta) : e;
}
var Da = /[.?*+^$[\]\\(){}|-]/g;
function Oa(e) {
	return e.replace(Da, "\\$&");
}
function X(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function ka(e) {
	if (e >= 8192 && e <= 8202) return !0;
	switch (e) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return !0;
	}
	return !1;
}
function Aa(e) {
	return zi.test(e) || Bi.test(e);
}
function ja(e) {
	return Aa(ha(e));
}
function Ma(e) {
	switch (e) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Na(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Pa(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Fa(e) {
	let t = 0;
	for (; t < e.length && Pa(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && Pa(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var Ia = {
	mdurl: Fi,
	ucmicro: Hi
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/helpers/parse_link_label.mjs
function La(e, t, n) {
	let r, i, a, o, s = e.posMax, c = e.pos;
	for (e.pos = t + 1, r = 1; e.pos < s;) {
		if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
			i = !0;
			break;
		}
		if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
			if (o === e.pos - 1) r++;
			else if (n) return e.pos = c, -1;
		}
	}
	let l = -1;
	return i && (l = e.pos), e.pos = c, l;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/helpers/parse_link_destination.mjs
function Ra(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = xa(e.slice(t + 1, i)), a.ok = !0, a;
			if (r === 92 && i + 1 < n) {
				i += 2;
				continue;
			}
			i++;
		}
		return a;
	}
	let o = 0;
	for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
		if (r === 92 && i + 1 < n) {
			if (e.charCodeAt(i + 1) === 32) break;
			i += 2;
			continue;
		}
		if (r === 40 && (o++, o > 32)) return a;
		if (r === 41) {
			if (o === 0) break;
			o--;
		}
		i++;
	}
	return t === i || o !== 0 ? a : (a.str = xa(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/helpers/parse_link_title.mjs
function za(e, t, n, r) {
	let i, a = t, o = {
		ok: !1,
		can_continue: !1,
		pos: 0,
		str: "",
		marker: 0
	};
	if (r) o.str = r.str, o.marker = r.marker;
	else {
		if (a >= n) return o;
		let r = e.charCodeAt(a);
		if (r !== 34 && r !== 39 && r !== 40) return o;
		t++, a++, r === 40 && (r = 41), o.marker = r;
	}
	for (; a < n;) {
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += xa(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += xa(e.slice(t, a)), o;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/helpers/index.mjs
var Ba = /* @__PURE__ */ n({
	parseLinkDestination: () => Ra,
	parseLinkLabel: () => La,
	parseLinkTitle: () => za
}), Va = {};
Va.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return "<code" + i.renderAttrs(a) + ">" + Ea(a.content) + "</code>";
}, Va.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return "<pre" + i.renderAttrs(a) + "><code>" + Ea(e[t].content) + "</code></pre>\n";
}, Va.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? xa(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Ea(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, Va.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, Va.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, Va.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, Va.text = function(e, t) {
	return Ea(e[t].content);
}, Va.html_block = function(e, t) {
	return e[t].content;
}, Va.html_inline = function(e, t) {
	return e[t].content;
};
function Ha() {
	this.rules = fa({}, Va);
}
Ha.prototype.renderAttrs = function(e) {
	let t, n, r;
	if (!e.attrs) return "";
	for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + Ea(e.attrs[t][0]) + "=\"" + Ea(e.attrs[t][1]) + "\"";
	return r;
}, Ha.prototype.renderToken = function(e, t, n) {
	let r = e[t], i = "";
	if (r.hidden) return "";
	r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
	let a = !1;
	if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
		let n = e[t + 1];
		(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
	}
	return i += a ? ">\n" : ">", i;
}, Ha.prototype.renderInline = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
	}
	return r;
}, Ha.prototype.renderInlineAsText = function(e, t, n) {
	let r = "";
	for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
		case "text":
			r += e[i].content;
			break;
		case "image":
			r += this.renderInlineAsText(e[i].children, t, n);
			break;
		case "html_inline":
		case "html_block":
			r += e[i].content;
			break;
		case "softbreak":
		case "hardbreak":
			r += "\n";
			break;
		default:
	}
	return r;
}, Ha.prototype.render = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
	}
	return r;
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/ruler.mjs
function Z() {
	this.__rules__ = [], this.__cache__ = null;
}
Z.prototype.__find__ = function(e) {
	for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
	return -1;
}, Z.prototype.__compile__ = function() {
	let e = this, t = [""];
	e.__rules__.forEach(function(e) {
		e.enabled && e.alt.forEach(function(e) {
			t.indexOf(e) < 0 && t.push(e);
		});
	}), e.__cache__ = {}, t.forEach(function(t) {
		e.__cache__[t] = [], e.__rules__.forEach(function(n) {
			n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));
		});
	});
}, Z.prototype.at = function(e, t, n) {
	let r = this.__find__(e), i = n || {};
	if (r === -1) throw Error("Parser rule not found: " + e);
	this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
}, Z.prototype.before = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, Z.prototype.after = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i + 1, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, Z.prototype.push = function(e, t, n) {
	let r = n || {};
	this.__rules__.push({
		name: e,
		enabled: !0,
		fn: t,
		alt: r.alt || []
	}), this.__cache__ = null;
}, Z.prototype.enable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !0, n.push(e);
	}, this), this.__cache__ = null, n;
}, Z.prototype.enableOnly = function(e, t) {
	Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
		e.enabled = !1;
	}), this.enable(e, t);
}, Z.prototype.disable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !1, n.push(e);
	}, this), this.__cache__ = null, n;
}, Z.prototype.getRules = function(e) {
	return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/token.mjs
function Ua(e, t, n) {
	this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
Ua.prototype.attrIndex = function(e) {
	if (!this.attrs) return -1;
	let t = this.attrs;
	for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
	return -1;
}, Ua.prototype.attrPush = function(e) {
	this.attrs ? this.attrs.push(e) : this.attrs = [e];
}, Ua.prototype.attrSet = function(e, t) {
	let n = this.attrIndex(e), r = [e, t];
	n < 0 ? this.attrPush(r) : this.attrs[n] = r;
}, Ua.prototype.attrGet = function(e) {
	let t = this.attrIndex(e), n = null;
	return t >= 0 && (n = this.attrs[t][1]), n;
}, Ua.prototype.attrJoin = function(e, t) {
	let n = this.attrIndex(e);
	n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/state_core.mjs
function Wa(e, t, n) {
	this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
}
Wa.prototype.Token = Ua;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/normalize.mjs
var Ga = /\r\n?|\n/g, Ka = /\0/g;
function qa(e) {
	let t;
	t = e.src.replace(Ga, "\n"), t = t.replace(Ka, "�"), e.src = t;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/block.mjs
function Ja(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/inline.mjs
function Ya(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/linkify.mjs
function Xa(e) {
	return /^<a[>\s]/i.test(e);
}
function Za(e) {
	return /^<\/a\s*>/i.test(e);
}
function Qa(e) {
	let t = e.tokens;
	if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
		if (t[n].type !== "inline" || !e.md.linkify.pretest(t[n].content)) continue;
		let r = t[n].children, i = 0;
		for (let a = r.length - 1; a >= 0; a--) {
			let o = r[a];
			if (o.type === "link_close") {
				for (a--; r[a].level !== o.level && r[a].type !== "link_open";) a--;
				continue;
			}
			if (o.type === "html_inline" && (Xa(o.content) && i > 0 && i--, Za(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
				let i = o.content, s = e.md.linkify.match(i), c = [], l = o.level, u = 0;
				s.length > 0 && s[0].index === 0 && a > 0 && r[a - 1].type === "text_special" && (s = s.slice(1));
				for (let t = 0; t < s.length; t++) {
					let n = s[t].url, r = e.md.normalizeLink(n);
					if (!e.md.validateLink(r)) continue;
					let a = s[t].text;
					a = s[t].schema ? s[t].schema === "mailto:" && !/^mailto:/i.test(a) ? e.md.normalizeLinkText("mailto:" + a).replace(/^mailto:/, "") : e.md.normalizeLinkText(a) : e.md.normalizeLinkText("http://" + a).replace(/^http:\/\//, "");
					let o = s[t].index;
					if (o > u) {
						let t = new e.Token("text", "", 0);
						t.content = i.slice(u, o), t.level = l, c.push(t);
					}
					let d = new e.Token("link_open", "a", 1);
					d.attrs = [["href", r]], d.level = l++, d.markup = "linkify", d.info = "auto", c.push(d);
					let f = new e.Token("text", "", 0);
					f.content = a, f.level = l, c.push(f);
					let p = new e.Token("link_close", "a", -1);
					p.level = --l, p.markup = "linkify", p.info = "auto", c.push(p), u = s[t].lastIndex;
				}
				if (u < i.length) {
					let t = new e.Token("text", "", 0);
					t.content = i.slice(u), t.level = l, c.push(t);
				}
				t[n].children = r = pa(r, a, c);
			}
		}
	}
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/replacements.mjs
var $a = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, eo = /\((c|tm|r)\)/i, to = /\((c|tm|r)\)/gi, no = {
	c: "©",
	r: "®",
	tm: "™"
};
function ro(e, t) {
	return no[t.toLowerCase()];
}
function io(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(to, ro)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function ao(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && $a.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function oo(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (eo.test(e.tokens[t].content) && io(e.tokens[t].children), $a.test(e.tokens[t].content) && ao(e.tokens[t].children));
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/smartquotes.mjs
var so = /['"]/, co = /['"]/g, lo = "’";
function uo(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function fo(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function po(e, t) {
	let n, r = [], i = {};
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = e[a].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
		if (r.length = n + 1, o.type !== "text") continue;
		let c = o.content, l = 0, u = c.length;
		OUTER: for (; l < u;) {
			co.lastIndex = l;
			let o = co.exec(c);
			if (!o) break;
			let d = !0, f = !0;
			l = o.index + 1;
			let p = o[0] === "'", m = 32;
			if (o.index - 1 >= 0) m = c.charCodeAt(o.index - 1);
			else for (n = a - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--) if (e[n].content) {
				m = e[n].content.charCodeAt(e[n].content.length - 1);
				break;
			}
			let h = 32;
			if (l < u) h = c.charCodeAt(l);
			else for (n = a + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++) if (e[n].content) {
				h = e[n].content.charCodeAt(0);
				break;
			}
			let g = Ma(m) || ja(m), _ = Ma(h) || ja(h), v = ka(m), y = ka(h);
			if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
				p && uo(i, a, o.index, lo);
				continue;
			}
			if (f) for (n = r.length - 1; n >= 0; n--) {
				let e = r[n];
				if (r[n].level < s) break;
				if (e.single === p && r[n].level === s) {
					e = r[n];
					let s, c;
					p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), uo(i, a, o.index, c), uo(i, e.token, e.pos, s), r.length = n;
					continue OUTER;
				}
			}
			d ? r.push({
				token: a,
				pos: o.index,
				single: p,
				level: s
			}) : f && p && uo(i, a, o.index, lo);
		}
	}
	Object.keys(i).forEach(function(t) {
		e[t].content = fo(e[t].content, i[t]);
	});
}
function mo(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !so.test(e.tokens[t].content) || po(e.tokens[t].children, e);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_core/text_join.mjs
function ho(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/parser_core.mjs
var go = [
	["normalize", qa],
	["block", Ja],
	["inline", Ya],
	["linkify", Qa],
	["replacements", oo],
	["smartquotes", mo],
	["text_join", ho]
];
function _o() {
	this.ruler = new Z();
	for (let e = 0; e < go.length; e++) this.ruler.push(go[e][0], go[e][1]);
}
_o.prototype.process = function(e) {
	let t = this.ruler.getRules("");
	for (let n = 0, r = t.length; n < r; n++) t[n](e);
}, _o.prototype.State = Wa;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/state_block.mjs
function vo(e, t, n, r) {
	this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
	let i = this.src;
	for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
		let s = i.charCodeAt(t);
		if (!o) if (X(s)) {
			n++, s === 9 ? r += 4 - r % 4 : r++;
			continue;
		} else o = !0;
		(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
	}
	this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
vo.prototype.push = function(e, t, n) {
	let r = new Ua(e, t, n);
	return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
}, vo.prototype.isEmpty = function(e) {
	return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
}, vo.prototype.skipEmptyLines = function(e) {
	for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
	return e;
}, vo.prototype.skipSpaces = function(e) {
	for (let t = this.src.length; e < t && X(this.src.charCodeAt(e)); e++);
	return e;
}, vo.prototype.skipSpacesBack = function(e, t) {
	if (e <= t) return e;
	for (; e > t;) if (!X(this.src.charCodeAt(--e))) return e + 1;
	return e;
}, vo.prototype.skipChars = function(e, t) {
	for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
	return e;
}, vo.prototype.skipCharsBack = function(e, t, n) {
	if (e <= n) return e;
	for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
	return e;
}, vo.prototype.getLines = function(e, t, n, r) {
	if (e >= t) return "";
	let i = Array(t - e);
	for (let a = 0, o = e; o < t; o++, a++) {
		let e = 0, s = this.bMarks[o], c = s, l;
		for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
			let t = this.src.charCodeAt(c);
			if (X(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
			else if (c - s < this.tShift[o]) e++;
			else break;
			c++;
		}
		e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
	}
	return i.join("");
}, vo.prototype.Token = Ua;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/table.mjs
var yo = 65536;
function bo(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function xo(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function So(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !X(s) || o === 45 && X(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !X(t)) return !1;
		a++;
	}
	let c = bo(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = bo(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = xo(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
	let d = l.length;
	if (d === 0 || d !== u.length) return !1;
	if (r) return !0;
	let f = e.parentType;
	e.parentType = "table";
	let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
	m.map = h;
	let g = e.push("thead_open", "thead", 1);
	g.map = [t, t + 1];
	let _ = e.push("tr_open", "tr", 1);
	_.map = [t, t + 1];
	for (let t = 0; t < l.length; t++) {
		let n = e.push("th_open", "th", 1);
		u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
		let r = e.push("inline", "", 0);
		r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
	}
	e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
	let v, y = 0;
	for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
		let r = !1;
		for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
			r = !0;
			break;
		}
		if (r || (c = bo(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = xo(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > yo)) break;
		if (i === t + 2) {
			let n = e.push("tbody_open", "tbody", 1);
			n.map = v = [t + 2, 0];
		}
		let a = e.push("tr_open", "tr", 1);
		a.map = [i, i + 1];
		for (let t = 0; t < d; t++) {
			let n = e.push("td_open", "td", 1);
			u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
			let r = e.push("inline", "", 0);
			r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
		}
		e.push("tr_close", "tr", -1);
	}
	return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/code.mjs
function Co(e, t, n) {
	if (e.sCount[t] - e.blkIndent < 4) return !1;
	let r = t + 1, i = r;
	for (; r < n;) {
		if (e.isEmpty(r)) {
			r++;
			continue;
		}
		if (e.sCount[r] - e.blkIndent >= 4) {
			r++, i = r;
			continue;
		}
		break;
	}
	e.line = i;
	let a = e.push("code_block", "code", 0);
	return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/fence.mjs
function wo(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 126 && o !== 96) return !1;
	let s = i;
	i = e.skipChars(i, o);
	let c = i - s;
	if (c < 3) return !1;
	let l = e.src.slice(s, i), u = e.src.slice(i, a);
	if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
	if (r) return !0;
	let d = t, f = !1;
	for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
		f = !0;
		break;
	}
	c = e.sCount[t], e.line = d + +!!f;
	let p = e.push("fence", "code", 0);
	return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/blockquote.mjs
function To(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
	if (r) return !0;
	let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
	e.parentType = "blockquote";
	let p = !1, m;
	for (m = t; m < n; m++) {
		let t = e.sCount[m] < e.blkIndent;
		if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
		if (e.src.charCodeAt(i++) === 62 && !t) {
			let t = e.sCount[m] + 1, n, r;
			e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
			let o = t;
			for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
				let t = e.src.charCodeAt(i);
				if (X(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
				else break;
				i++;
			}
			p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
			continue;
		}
		if (p) break;
		let r = !1;
		for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
			r = !0;
			break;
		}
		if (r) {
			e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
			break;
		}
		s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
	}
	let h = e.blkIndent;
	e.blkIndent = 0;
	let g = e.push("blockquote_open", "blockquote", 1);
	g.markup = ">";
	let _ = [t, 0];
	g.map = _, e.md.block.tokenize(e, t, m);
	let v = e.push("blockquote_close", "blockquote", -1);
	v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
	for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
	return e.blkIndent = h, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/hr.mjs
function Eo(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !X(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/list.mjs
function Do(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !X(e.src.charCodeAt(r)) ? -1 : r;
}
function Oo(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
	if (i + 1 >= r) return -1;
	let a = e.src.charCodeAt(i++);
	if (a < 48 || a > 57) return -1;
	for (;;) {
		if (i >= r) return -1;
		if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
			if (i - n >= 10) return -1;
			continue;
		}
		if (a === 41 || a === 46) break;
		return -1;
	}
	return i < r && (a = e.src.charCodeAt(i), !X(a)) ? -1 : i;
}
function ko(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Ao(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Oo(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Do(e, c)) >= 0) d = !1;
	else return !1;
	if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
	if (r) return !0;
	let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
	d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
	let g = [c, 0];
	s.map = g, s.markup = String.fromCharCode(m);
	let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
	for (e.parentType = "list"; c < n;) {
		a = p, i = e.eMarks[c];
		let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
		for (; a < i;) {
			let t = e.src.charCodeAt(a);
			if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
			else if (t === 32) r++;
			else break;
			a++;
		}
		let u = a, f;
		f = u >= i ? 1 : r - t, f > 4 && (f = 1);
		let h = t + f;
		s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
		let g = [c, 0];
		s.map = g, d && (s.info = e.src.slice(o, p - 1));
		let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
		if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
		let C = !1;
		for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
			C = !0;
			break;
		}
		if (C) break;
		if (d) {
			if (p = Oo(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Do(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && ko(e, h), !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/reference.mjs
function jo(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
	function s(t) {
		let n = e.lineMax;
		if (t >= n || e.isEmpty(t)) return null;
		let r = !1;
		if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
			let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
			e.parentType = "reference";
			let a = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
				a = !0;
				break;
			}
			if (e.parentType = i, a) return null;
		}
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		return e.src.slice(i, a + 1);
	}
	let c = e.src.slice(i, a + 1);
	a = c.length;
	let l = -1;
	for (i = 1; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 91) return !1;
		if (e === 93) {
			l = i;
			break;
		} else if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		}
	}
	if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
	for (i = l + 2; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!X(e)) break;
	}
	let u = e.md.helpers.parseLinkDestination(c, i, a);
	if (!u.ok) return !1;
	let d = e.md.normalizeLink(u.str);
	if (!e.md.validateLink(d)) return !1;
	i = u.pos;
	let f = i, p = o, m = i;
	for (; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!X(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && X(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && X(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Na(c.slice(1, l));
	return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
		title: g,
		href: d
	}), e.line = o, !0) : !1;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/common/html_blocks.mjs
var Mo = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), No = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), Po = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), Fo = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		!0
	],
	[
		/^<!--/,
		/-->/,
		!0
	],
	[
		/^<\?/,
		/\?>/,
		!0
	],
	[
		/^<![A-Z]/,
		/>/,
		!0
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		!0
	],
	[
		RegExp("^</?(" + Mo.join("|") + ")(?=(\\s|/?>|$))", "i"),
		/^$/,
		!0
	],
	[
		RegExp(Po.source + "\\s*$"),
		/^$/,
		!1
	]
];
function Io(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < Fo.length && !Fo[s][0].test(o); s++);
	if (s === Fo.length) return !1;
	if (r) return Fo[s][2];
	let c = t + 1, l = Fo[s][1].test("");
	if (!Fo[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), Fo[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/heading.mjs
function Lo(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !X(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && X(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", "h" + String(s), 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Fa(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", "h" + String(s), -1);
	return d.markup = "########".slice(0, s), !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/lheading.mjs
function Ro(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph");
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let i = e.parentType;
	e.parentType = "paragraph";
	let a = 0, o, s = t + 1;
	for (; s < n && !e.isEmpty(s); s++) {
		if (e.sCount[s] - e.blkIndent > 3) continue;
		if (e.sCount[s] >= e.blkIndent) {
			let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
			if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
				a = o === 61 ? 1 : 2;
				break;
			}
		}
		if (e.sCount[s] < 0) continue;
		let t = !1;
		for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	if (!a) return e.parentType = i, !1;
	let c = Fa(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", "h" + String(a), 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", "h" + String(a), -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_block/paragraph.mjs
function zo(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
	for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
		if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
		let t = !1;
		for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	let o = Fa(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/parser_block.mjs
var Bo = [
	[
		"table",
		So,
		["paragraph", "reference"]
	],
	["code", Co],
	[
		"fence",
		wo,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		To,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Eo,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Ao,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", jo],
	[
		"html_block",
		Io,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Lo,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Ro],
	["paragraph", zo]
];
function Vo() {
	this.ruler = new Z();
	for (let e = 0; e < Bo.length; e++) this.ruler.push(Bo[e][0], Bo[e][1], { alt: (Bo[e][2] || []).slice() });
}
Vo.prototype.tokenize = function(e, t, n) {
	let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
	for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
		if (e.level >= a) {
			e.line = n;
			break;
		}
		let t = e.line, c = !1;
		for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
			if (t >= e.line) throw Error("block rule didn't increment state.line");
			break;
		}
		if (!c) throw Error("none of the block rules matched");
		e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
	}
}, Vo.prototype.parse = function(e, t, n, r) {
	if (!e) return;
	let i = new this.State(e, t, n, r);
	this.tokenize(i, i.line, i.lineMax);
}, Vo.prototype.State = vo;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/state_inline.mjs
function Ho(e, t, n, r) {
	this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Ho.prototype.pushPending = function() {
	let e = new Ua("text", "", 0);
	return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
}, Ho.prototype.push = function(e, t, n) {
	this.pending && this.pushPending();
	let r = new Ua(e, t, n), i = null;
	return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
}, Ho.prototype.scanDelims = function(e, t) {
	let n = this.posMax, r = this.src.charCodeAt(e), i;
	if (e === 0) i = 32;
	else if (e === 1) i = this.src.charCodeAt(0), (i & 63488) == 55296 && (i = 65533);
	else if (i = this.src.charCodeAt(e - 1), (i & 64512) == 56320) {
		let t = this.src.charCodeAt(e - 2);
		i = (t & 64512) == 55296 ? 65536 + (t - 55296 << 10) + (i - 56320) : 65533;
	} else (i & 64512) == 55296 && (i = 65533);
	let a = e;
	for (; a < n && this.src.charCodeAt(a) === r;) a++;
	let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32;
	if ((s & 64512) == 55296) {
		let e = this.src.charCodeAt(a + 1);
		s = (e & 64512) == 56320 ? 65536 + (s - 55296 << 10) + (e - 56320) : 65533;
	} else (s & 64512) == 56320 && (s = 65533);
	let c = Ma(i) || ja(i), l = Ma(s) || ja(s), u = ka(i), d = ka(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
	return {
		can_open: f && (t || !p || c),
		can_close: p && (t || !f || l),
		length: o
	};
}, Ho.prototype.Token = Ua;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/text.mjs
function Uo(e) {
	switch (e) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Wo(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !Uo(e.src.charCodeAt(n));) n++;
	return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/linkify.mjs
var Go = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function Ko(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = e.pending.match(Go);
	if (!i) return !1;
	let a = i[1], o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
	if (!o) return !1;
	let s = o.url;
	if (s.length <= a.length) return !1;
	let c = s.length;
	for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
	c !== s.length && (s = s.slice(0, c));
	let l = e.md.normalizeLink(s);
	if (!e.md.validateLink(l)) return !1;
	if (!t) {
		e.pending = e.pending.slice(0, -a.length);
		let t = e.push("link_open", "a", 1);
		t.attrs = [["href", l]], t.markup = "linkify", t.info = "auto";
		let n = e.push("text", "", 0);
		n.content = e.md.normalizeLinkText(s);
		let r = e.push("link_close", "a", -1);
		r.markup = "linkify", r.info = "auto";
	}
	return e.pos += s.length - a.length, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/newline.mjs
function qo(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 10) return !1;
	let r = e.pending.length - 1, i = e.posMax;
	if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
		let t = r - 1;
		for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
		e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
	} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
	else e.push("softbreak", "br", 0);
	for (n++; n < i && X(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/escape.mjs
var Jo = [];
for (let e = 0; e < 256; e++) Jo.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	Jo[e.charCodeAt(0)] = 1;
});
function Yo(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), X(i));) n++;
		return e.pos = n, !0;
	}
	if (i === 32) {
		if (!t) {
			let t = e.push("text_special", "", 0);
			t.content = "\\", t.markup = "\\", t.info = "escape";
		}
		return e.pos = n, !0;
	}
	let a = e.src[n];
	if (i >= 55296 && i <= 56319 && n + 1 < r) {
		let t = e.src.charCodeAt(n + 1);
		t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
	}
	let o = "\\" + a;
	if (!t) {
		let t = e.push("text_special", "", 0);
		i < 256 && Jo[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/backticks.mjs
function Xo(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = n;
	n++;
	let i = e.posMax;
	for (; n < i && e.src.charCodeAt(n) === 96;) n++;
	let a = e.src.slice(r, n), o = a.length;
	if (e.backticksScanned && (e.backticks[o] || 0) <= r) return t || (e.pending += a), e.pos += o, !0;
	let s = n, c;
	for (; (c = e.src.indexOf("`", s)) !== -1;) {
		for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
		let r = s - c;
		if (r === o) {
			if (!t) {
				let t = e.push("code_inline", "code", 0);
				t.markup = a, t.content = e.src.slice(n, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
			}
			return e.pos = s, !0;
		}
		e.backticks[r] = c;
	}
	return e.backticksScanned = !0, t || (e.pending += a), e.pos += o, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/strikethrough.mjs
function Zo(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 126) return !1;
	let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
	if (a < 2) return !1;
	let s;
	a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
	for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
		marker: r,
		length: 0,
		token: e.tokens.length - 1,
		end: -1,
		open: i.can_open,
		close: i.can_close
	});
	return e.pos += i.length, !0;
}
function Qo(e, t) {
	let n, r = [], i = t.length;
	for (let a = 0; a < i; a++) {
		let i = t[a];
		if (i.marker !== 126 || i.end === -1) continue;
		let o = t[i.end];
		n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
	}
	for (; r.length;) {
		let t = r.pop(), i = t + 1;
		for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
		i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
	}
}
function $o(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Qo(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Qo(e, t[r].delimiters);
}
var es = {
	tokenize: Zo,
	postProcess: $o
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/emphasis.mjs
function ts(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 95 && r !== 42) return !1;
	let i = e.scanDelims(e.pos, r === 42);
	for (let t = 0; t < i.length; t++) {
		let t = e.push("text", "", 0);
		t.content = String.fromCharCode(r), e.delimiters.push({
			marker: r,
			length: i.length,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
	}
	return e.pos += i.length, !0;
}
function ns(e, t) {
	let n = t.length;
	for (let r = n - 1; r >= 0; r--) {
		let n = t[r];
		if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
		let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
		s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
		let c = e.tokens[i.token];
		c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
	}
}
function rs(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	ns(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && ns(e, t[r].delimiters);
}
var is = {
	tokenize: ts,
	postProcess: rs
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/link.mjs
function as(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!X(n) && n !== 10)); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!X(n) && n !== 10)); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!X(n) && n !== 10)); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[Na(r)], !a) return e.pos = u, !1;
		o = a.href, s = a.title;
	}
	if (!t) {
		e.pos = f, e.posMax = p;
		let t = e.push("link_open", "a", 1), n = [["href", o]];
		t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
	}
	return e.pos = m, e.posMax = d, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/image.mjs
function os(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), !(!X(n) && n !== 10)); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!X(n) && n !== 10)); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!X(n) && n !== 10)); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[Na(i)], !o) return e.pos = d, !1;
		u = o.href, c = o.title;
	}
	if (!t) {
		r = e.src.slice(p, m);
		let t = [];
		e.md.inline.parse(r, e.md, e.env, t);
		let n = e.push("image", "img", 0), i = [["src", u], ["alt", ""]];
		n.attrs = i, n.children = t, n.content = r, c && i.push(["title", c]);
	}
	return e.pos = a, e.posMax = f, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/autolink.mjs
var ss = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, cs = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function ls(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 60) return !1;
	let r = e.pos, i = e.posMax;
	for (;;) {
		if (++n >= i) return !1;
		let t = e.src.charCodeAt(n);
		if (t === 60) return !1;
		if (t === 62) break;
	}
	let a = e.src.slice(r + 1, n);
	if (cs.test(a)) {
		let n = e.md.normalizeLink(a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	if (ss.test(a)) {
		let n = e.md.normalizeLink("mailto:" + a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	return !1;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/html_inline.mjs
function us(e) {
	return /^<a[>\s]/i.test(e);
}
function ds(e) {
	return /^<\/a\s*>/i.test(e);
}
function fs(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function ps(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !fs(i)) return !1;
	let a = e.src.slice(r).match(No);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], us(t.content) && e.linkLevel++, ds(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/entity.mjs
var ms = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, hs = /^&([a-z][a-z0-9]{1,31});/i;
function gs(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(ms);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = ma(t) ? ha(t) : ha(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(hs);
		if (r) {
			let n = oa(r[0]);
			if (n !== r[0]) {
				if (!t) {
					let t = e.push("text_special", "", 0);
					t.content = n, t.markup = r[0], t.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		}
	}
	return !1;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/balance_pairs.mjs
function _s(e) {
	let t = {}, n = e.length;
	if (!n) return;
	let r = 0, i = -2, a = [];
	for (let o = 0; o < n; o++) {
		let n = e[o];
		if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
		t.hasOwnProperty(n.marker) || (t[n.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		]);
		let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
		for (; c > s; c -= a[c] + 1) {
			let t = e[c];
			if (t.marker === n.marker && t.open && t.end < 0) {
				let r = !1;
				if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
					let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
					a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
					break;
				}
			}
		}
		l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
	}
}
function vs(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	_s(e.delimiters);
	for (let e = 0; e < n; e++) t[e] && t[e].delimiters && _s(t[e].delimiters);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/rules_inline/fragments_join.mjs
function ys(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/parser_inline.mjs
var bs = [
	["text", Wo],
	["linkify", Ko],
	["newline", qo],
	["escape", Yo],
	["backticks", Xo],
	["strikethrough", es.tokenize],
	["emphasis", is.tokenize],
	["link", as],
	["image", os],
	["autolink", ls],
	["html_inline", ps],
	["entity", gs]
], xs = [
	["balance_pairs", vs],
	["strikethrough", es.postProcess],
	["emphasis", is.postProcess],
	["fragments_join", ys]
];
function Ss() {
	this.ruler = new Z();
	for (let e = 0; e < bs.length; e++) this.ruler.push(bs[e][0], bs[e][1]);
	this.ruler2 = new Z();
	for (let e = 0; e < xs.length; e++) this.ruler2.push(xs[e][0], xs[e][1]);
}
Ss.prototype.skipToken = function(e) {
	let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
	if (a[t] !== void 0) {
		e.pos = a[t];
		return;
	}
	let o = !1;
	if (e.level < i) {
		for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
			if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
			break;
		}
	} else e.pos = e.posMax;
	o || e.pos++, a[t] = e.pos;
}, Ss.prototype.tokenize = function(e) {
	let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
	for (; e.pos < r;) {
		let a = e.pos, o = !1;
		if (e.level < i) {
			for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
				if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		}
		if (o) {
			if (e.pos >= r) break;
			continue;
		}
		e.pending += e.src[e.pos++];
	}
	e.pending && e.pushPending();
}, Ss.prototype.parse = function(e, t, n, r) {
	let i = new this.State(e, t, n, r);
	this.tokenize(i);
	let a = this.ruler2.getRules(""), o = a.length;
	for (let e = 0; e < o; e++) a[e](i);
}, Ss.prototype.State = Ho;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/linkify-it@5.0.2/node_modules/linkify-it/lib/re.mjs
function Cs(e) {
	let t = {};
	e ||= {}, t.src_Any = Ii.source, t.src_Cc = Li.source, t.src_Z = Vi.source, t.src_P = zi.source, t.src_ZPCc = [
		t.src_Z,
		t.src_P,
		t.src_Cc
	].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
	let n = "[><｜]";
	return t.src_pseudo_letter = `(?:(?!${n}|${t.src_ZPCc})${t.src_Any})`, t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = `(?=$|${n}|${t.src_ZPCc})(?!${e["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`, t.src_path = `(?:[/?#](?:(?!${t.src_ZCc}|${n}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`, t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + `|${t.src_pseudo_letter}{1,63})`, t.src_domain = "(?:" + t.src_xn + `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`, t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`, t.tpl_host_fuzzy = "(?:" + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`, t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`, t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`, t.tpl_email_fuzzy = `(^|${n}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`, t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`, t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`, t;
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/linkify-it@5.0.2/node_modules/linkify-it/index.mjs
function ws(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		t && Object.keys(t).forEach(function(n) {
			e[n] = t[n];
		});
	}), e;
}
function Ts(e) {
	return Object.prototype.toString.call(e);
}
function Es(e) {
	return Ts(e) === "[object String]";
}
function Ds(e) {
	return Ts(e) === "[object Object]";
}
function Os(e) {
	return Ts(e) === "[object RegExp]";
}
function ks(e) {
	return Ts(e) === "[object Function]";
}
function As(e) {
	return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var js = {
	fuzzyLink: !0,
	fuzzyEmail: !0,
	fuzzyIP: !1
};
function Ms(e) {
	return Object.keys(e || {}).reduce(function(e, t) {
		return e || js.hasOwnProperty(t);
	}, !1);
}
var Ns = {
	"http:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.http || (n.re.http = RegExp(`^\\/\\/${n.re.src_auth}${n.re.src_host_port_strict}${n.re.src_path}`, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
	} },
	"https:": "http:",
	"ftp:": "http:",
	"//": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.no_http || (n.re.no_http = RegExp("^" + n.re.src_auth + `(?:localhost|(?:(?:${n.re.src_domain})\\.)+${n.re.src_domain_root})` + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
	} },
	"mailto:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.mailto || (n.re.mailto = RegExp(`^${n.re.src_email_name}@${n.re.src_host_strict}`, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
	} }
}, Ps = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Fs = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Is(e) {
	return function(t, n) {
		let r = t.slice(n);
		return e.test(r) ? r.match(e)[0].length : 0;
	};
}
function Ls() {
	return function(e, t) {
		t.normalize(e);
	};
}
function Rs(e) {
	let t = e.re = Cs(e.__opts__), n = e.__tlds__.slice();
	e.onCompile(), e.__tlds_replaced__ || n.push(Ps), n.push(t.src_xn), t.src_tlds = n.join("|");
	function r(e) {
		return e.replace("%TLDS%", t.src_tlds);
	}
	t.email_fuzzy = RegExp(r(t.tpl_email_fuzzy), "i"), t.email_fuzzy_global = RegExp(r(t.tpl_email_fuzzy), "ig"), t.link_fuzzy = RegExp(r(t.tpl_link_fuzzy), "i"), t.link_fuzzy_global = RegExp(r(t.tpl_link_fuzzy), "ig"), t.link_no_ip_fuzzy = RegExp(r(t.tpl_link_no_ip_fuzzy), "i"), t.link_no_ip_fuzzy_global = RegExp(r(t.tpl_link_no_ip_fuzzy), "ig"), t.host_fuzzy_test = RegExp(r(t.tpl_host_fuzzy_test), "i");
	let i = [];
	e.__compiled__ = {};
	function a(e, t) {
		throw Error(`(LinkifyIt) Invalid schema "${e}": ${t}`);
	}
	Object.keys(e.__schemas__).forEach(function(t) {
		let n = e.__schemas__[t];
		if (n === null) return;
		let r = {
			validate: null,
			link: null
		};
		if (e.__compiled__[t] = r, Ds(n)) {
			Os(n.validate) ? r.validate = Is(n.validate) : ks(n.validate) ? r.validate = n.validate : a(t, n), ks(n.normalize) ? r.normalize = n.normalize : n.normalize ? a(t, n) : r.normalize = Ls();
			return;
		}
		if (Es(n)) {
			i.push(t);
			return;
		}
		a(t, n);
	}), i.forEach(function(t) {
		e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
	}), e.__compiled__[""] = {
		validate: null,
		normalize: Ls()
	};
	let o = Object.keys(e.__compiled__).filter(function(t) {
		return t.length > 0 && e.__compiled__[t];
	}).map(As).join("|");
	e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "i"), e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "ig"), e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, "i"), e.re.pretest = RegExp(`(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`, "i");
}
function zs(e, t, n, r) {
	let i = e.slice(n, r);
	this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
}
function Q(e, t) {
	if (!(this instanceof Q)) return new Q(e, t);
	t || Ms(e) && (t = e, e = {}), this.__opts__ = ws({}, js, t), this.__schemas__ = ws({}, Ns, e), this.__compiled__ = {}, this.__tlds__ = Fs, this.__tlds_replaced__ = !1, this.re = {}, Rs(this);
}
Q.prototype.add = function(e, t) {
	return this.__schemas__[e] = t, Rs(this), this;
}, Q.prototype.set = function(e) {
	return this.__opts__ = ws(this.__opts__, e), this;
}, Q.prototype.test = function(e) {
	if (!e.length) return !1;
	let t, n;
	if (this.re.schema_test.test(e)) {
		for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
	}
	return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
}, Q.prototype.pretest = function(e) {
	return this.re.pretest.test(e);
}, Q.prototype.testSchemaAt = function(e, t, n) {
	return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
}, Q.prototype.match = function(e) {
	let t = [], n = [], r = [], i = [], a, o, s;
	function c(e, t) {
		return e ? t ? e.index === t.index ? e.lastIndex >= t.lastIndex ? e : t : e.index < t.index ? e : t : e : t;
	}
	if (!e.length) return null;
	if (this.re.schema_test.test(e)) for (s = this.re.schema_search, s.lastIndex = 0; (a = s.exec(e)) !== null;) o = this.testSchemaAt(e, a[2], s.lastIndex), o && n.push({
		schema: a[2],
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length + o
	});
	if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) for (s = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) r.push({
		schema: "",
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length
	});
	if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) for (s = this.re.email_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) i.push({
		schema: "mailto:",
		index: a.index + a[1].length,
		lastIndex: a.index + a[0].length
	});
	let l = [
		0,
		0,
		0
	], u = 0;
	for (;;) {
		let a = [
			n[l[0]],
			i[l[1]],
			r[l[2]]
		], o = c(c(a[0], a[1]), a[2]);
		if (!o) break;
		if (o === a[0] ? l[0]++ : o === a[1] ? l[1]++ : l[2]++, o.index < u) continue;
		let s = new zs(e, o.schema, o.index, o.lastIndex);
		this.__compiled__[s.schema].normalize(s, this), t.push(s), u = o.lastIndex;
	}
	return t.length ? t : null;
}, Q.prototype.matchAtStart = function(e) {
	if (!e.length) return null;
	let t = this.re.schema_at_start.exec(e);
	if (!t) return null;
	let n = this.testSchemaAt(e, t[2], t[0].length);
	if (!n) return null;
	let r = new zs(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
	return this.__compiled__[r.schema].normalize(r, this), r;
}, Q.prototype.tlds = function(e, t) {
	return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
		return e !== n[t - 1];
	}).reverse(), Rs(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Rs(this), this);
}, Q.prototype.normalize = function(e) {
	e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
}, Q.prototype.onCompile = function() {};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/punycode.js@2.3.1/node_modules/punycode.js/punycode.es6.js
var Bs = /* @__PURE__ */ n({
	decode: () => dc,
	default: () => hc,
	encode: () => fc,
	toASCII: () => mc,
	toUnicode: () => pc,
	ucs2decode: () => Ws,
	ucs2encode: () => sc
});
function Vs(e) {
	throw RangeError(rc[e]);
}
function Hs(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function Us(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(nc, ".");
	let i = Hs(e.split("."), t).join(".");
	return r + i;
}
function Ws(e) {
	let t = [], n = 0, r = e.length;
	for (; n < r;) {
		let i = e.charCodeAt(n++);
		if (i >= 55296 && i <= 56319 && n < r) {
			let r = e.charCodeAt(n++);
			(r & 64512) == 56320 ? t.push(((i & 1023) << 10) + (r & 1023) + 65536) : (t.push(i), n--);
		} else t.push(i);
	}
	return t;
}
var Gs, Ks, qs, Js, Ys, Xs, Zs, Qs, $s, ec, tc, nc, rc, ic, ac, oc, sc, cc, lc, uc, dc, fc, pc, mc, hc, gc = t((() => {
	Gs = 2147483647, Ks = 36, qs = 1, Js = 26, Ys = 38, Xs = 700, Zs = 72, Qs = 128, $s = "-", ec = /^xn--/, tc = /[^\0-\x7F]/, nc = /[\x2E\u3002\uFF0E\uFF61]/g, rc = {
		overflow: "Overflow: input needs wider integers to process",
		"not-basic": "Illegal input >= 0x80 (not a basic code point)",
		"invalid-input": "Invalid input"
	}, ic = Ks - qs, ac = Math.floor, oc = String.fromCharCode, sc = (e) => String.fromCodePoint(...e), cc = function(e) {
		return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Ks;
	}, lc = function(e, t) {
		return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
	}, uc = function(e, t, n) {
		let r = 0;
		for (e = n ? ac(e / Xs) : e >> 1, e += ac(e / t); e > 455; r += Ks) e = ac(e / ic);
		return ac(r + 36 * e / (e + Ys));
	}, dc = function(e) {
		let t = [], n = e.length, r = 0, i = Qs, a = Zs, o = e.lastIndexOf($s);
		o < 0 && (o = 0);
		for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && Vs("not-basic"), t.push(e.charCodeAt(n));
		for (let s = o > 0 ? o + 1 : 0; s < n;) {
			let o = r;
			for (let t = 1, i = Ks;; i += Ks) {
				s >= n && Vs("invalid-input");
				let o = cc(e.charCodeAt(s++));
				o >= Ks && Vs("invalid-input"), o > ac((Gs - r) / t) && Vs("overflow"), r += o * t;
				let c = i <= a ? qs : i >= a + Js ? Js : i - a;
				if (o < c) break;
				let l = Ks - c;
				t > ac(Gs / l) && Vs("overflow"), t *= l;
			}
			let c = t.length + 1;
			a = uc(r - o, c, o == 0), ac(r / c) > Gs - i && Vs("overflow"), i += ac(r / c), r %= c, t.splice(r++, 0, i);
		}
		return String.fromCodePoint(...t);
	}, fc = function(e) {
		let t = [];
		e = Ws(e);
		let n = e.length, r = Qs, i = 0, a = Zs;
		for (let n of e) n < 128 && t.push(oc(n));
		let o = t.length, s = o;
		for (o && t.push($s); s < n;) {
			let n = Gs;
			for (let t of e) t >= r && t < n && (n = t);
			let c = s + 1;
			n - r > ac((Gs - i) / c) && Vs("overflow"), i += (n - r) * c, r = n;
			for (let n of e) if (n < r && ++i > Gs && Vs("overflow"), n === r) {
				let e = i;
				for (let n = Ks;; n += Ks) {
					let r = n <= a ? qs : n >= a + Js ? Js : n - a;
					if (e < r) break;
					let i = e - r, o = Ks - r;
					t.push(oc(lc(r + i % o, 0))), e = ac(i / o);
				}
				t.push(oc(lc(e, 0))), a = uc(i, c, s === o), i = 0, ++s;
			}
			++i, ++r;
		}
		return t.join("");
	}, pc = function(e) {
		return Us(e, function(e) {
			return ec.test(e) ? dc(e.slice(4).toLowerCase()) : e;
		});
	}, mc = function(e) {
		return Us(e, function(e) {
			return tc.test(e) ? "xn--" + fc(e) : e;
		});
	}, hc = {
		version: "2.3.1",
		ucs2: {
			decode: Ws,
			encode: sc
		},
		decode: dc,
		encode: fc,
		toASCII: mc,
		toUnicode: pc
	};
}));
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/presets/default.mjs
gc();
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it/lib/index.mjs
var _c = {
	default: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 100
		},
		components: {
			core: {},
			block: {},
			inline: {}
		}
	},
	zero: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: ["paragraph"] },
			inline: {
				rules: ["text"],
				rules2: ["balance_pairs", "fragments_join"]
			}
		}
	},
	commonmark: {
		options: {
			html: !0,
			xhtmlOut: !0,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			] },
			inline: {
				rules: [
					"autolink",
					"backticks",
					"emphasis",
					"entity",
					"escape",
					"html_inline",
					"image",
					"link",
					"newline",
					"text"
				],
				rules2: [
					"balance_pairs",
					"emphasis",
					"fragments_join"
				]
			}
		}
	}
}, vc = /^(vbscript|javascript|file|data):/, yc = /^data:image\/(gif|png|jpeg|webp);/;
function bc(e) {
	let t = e.trim().toLowerCase();
	return !vc.test(t) || yc.test(t);
}
var xc = [
	"http:",
	"https:",
	"mailto:"
];
function Sc(e) {
	let t = Pi(e, !0);
	if (t.hostname && (!t.protocol || xc.indexOf(t.protocol) >= 0)) try {
		t.hostname = hc.toASCII(t.hostname);
	} catch {}
	return xi(Si(t));
}
function Cc(e) {
	let t = Pi(e, !0);
	if (t.hostname && (!t.protocol || xc.indexOf(t.protocol) >= 0)) try {
		t.hostname = hc.toUnicode(t.hostname);
	} catch {}
	return vi(Si(t), vi.defaultChars + "%");
}
function $(e, t) {
	if (!(this instanceof $)) return new $(e, t);
	t || la(e) || (t = e || {}, e = "default"), this.inline = new Ss(), this.block = new Vo(), this.core = new _o(), this.renderer = new Ha(), this.linkify = new Q(), this.validateLink = bc, this.normalizeLink = Sc, this.normalizeLinkText = Cc, this.utils = sa, this.helpers = fa({}, Ba), this.options = {}, this.configure(e), t && this.set(t);
}
$.prototype.set = function(e) {
	return fa(this.options, e), this;
}, $.prototype.configure = function(e) {
	let t = this;
	if (la(e)) {
		let t = e;
		if (e = _c[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
	}
	if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
	return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
		e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
	}), this;
}, $.prototype.enable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.enable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.enable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
	return this;
}, $.prototype.disable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.disable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.disable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
	return this;
}, $.prototype.use = function(e) {
	let t = [this].concat(Array.prototype.slice.call(arguments, 1));
	return e.apply(e, t), this;
}, $.prototype.parse = function(e, t) {
	if (typeof e != "string") throw Error("Input data should be a String");
	let n = new this.core.State(e, this, t);
	return this.core.process(n), n.tokens;
}, $.prototype.render = function(e, t) {
	return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
}, $.prototype.parseInline = function(e, t) {
	let n = new this.core.State(e, this, t);
	return n.inlineMode = !0, this.core.process(n), n.tokens;
}, $.prototype.renderInline = function(e, t) {
	return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
};
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it-anchor@9.2.1_@types+markdown-it@14.1.2_markdown-it@14.3.0/node_modules/markdown-it-anchor/dist/markdownItAnchor.mjs
var wc = !1, Tc = {
	false: "push",
	true: "unshift",
	after: "push",
	before: "unshift"
}, Ec = { isPermalinkSymbol: !0 };
function Dc(e, t, n, r) {
	var i;
	if (!wc) {
		var a = "Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#permalinks";
		typeof process == "object" && process && process.emitWarning ? process.emitWarning(a) : console.warn(a), wc = !0;
	}
	var o = [
		Object.assign(new n.Token("link_open", "a", 1), { attrs: [].concat(t.permalinkClass ? [["class", t.permalinkClass]] : [], [["href", t.permalinkHref(e, n)]], Object.entries(t.permalinkAttrs(e, n))) }),
		Object.assign(new n.Token("html_block", "", 0), {
			content: t.permalinkSymbol,
			meta: Ec
		}),
		new n.Token("link_close", "a", -1)
	];
	t.permalinkSpace && n.tokens[r + 1].children[Tc[t.permalinkBefore]](Object.assign(new n.Token("text", "", 0), { content: " " })), (i = n.tokens[r + 1].children)[Tc[t.permalinkBefore]].apply(i, o);
}
function Oc(e) {
	return "#" + e;
}
function kc(e) {
	return {};
}
var Ac = {
	class: "header-anchor",
	symbol: "#",
	renderHref: Oc,
	renderAttrs: kc
};
function jc(e) {
	function t(n) {
		return n = Object.assign({}, t.defaults, n), function(t, r, i, a) {
			return e(t, n, r, i, a);
		};
	}
	return t.defaults = Object.assign({}, Ac), t.renderPermalinkImpl = e, t;
}
function Mc(e) {
	var t = [], n = e.filter(function(e) {
		if (e[0] !== "class") return !0;
		t.push(e[1]);
	});
	return t.length > 0 && n.unshift(["class", t.join(" ")]), n;
}
var Nc = jc(function(e, t, n, r, i) {
	var a, o = [
		Object.assign(new r.Token("link_open", "a", 1), { attrs: Mc([].concat(t.class ? [["class", t.class]] : [], [["href", t.renderHref(e, r)]], t.ariaHidden ? [["aria-hidden", "true"]] : [], Object.entries(t.renderAttrs(e, r)))) }),
		Object.assign(new r.Token("html_inline", "", 0), {
			content: t.symbol,
			meta: Ec
		}),
		new r.Token("link_close", "a", -1)
	];
	if (t.space) {
		var s = typeof t.space == "string" ? t.space : " ";
		r.tokens[i + 1].children[Tc[t.placement]](Object.assign(new r.Token(typeof t.space == "string" ? "html_inline" : "text", "", 0), { content: s }));
	}
	(a = r.tokens[i + 1].children)[Tc[t.placement]].apply(a, o);
});
Object.assign(Nc.defaults, {
	space: !0,
	placement: "after",
	ariaHidden: !1
});
var Pc = jc(Nc.renderPermalinkImpl);
Pc.defaults = Object.assign({}, Nc.defaults, { ariaHidden: !0 });
var Fc = jc(function(e, t, n, r, i) {
	var a = [Object.assign(new r.Token("link_open", "a", 1), { attrs: Mc([].concat(t.class ? [["class", t.class]] : [], [["href", t.renderHref(e, r)]], Object.entries(t.renderAttrs(e, r)))) })].concat(t.safariReaderFix ? [new r.Token("span_open", "span", 1)] : [], r.tokens[i + 1].children, t.safariReaderFix ? [new r.Token("span_close", "span", -1)] : [], [new r.Token("link_close", "a", -1)]);
	r.tokens[i + 1].children = a;
});
Object.assign(Fc.defaults, { safariReaderFix: !1 });
var Ic = jc(function(e, t, n, r, i) {
	var a;
	if (![
		"visually-hidden",
		"aria-label",
		"aria-describedby",
		"aria-labelledby"
	].includes(t.style)) throw Error("`permalink.linkAfterHeader` called with unknown style option `" + t.style + "`");
	if (!["aria-describedby", "aria-labelledby"].includes(t.style) && !t.assistiveText) throw Error("`permalink.linkAfterHeader` called without the `assistiveText` option in `" + t.style + "` style");
	if (t.style === "visually-hidden" && !t.visuallyHiddenClass) throw Error("`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style");
	var o = r.tokens[i + 1].children.filter(function(e) {
		return e.type === "text" || e.type === "code_inline";
	}).reduce(function(e, t) {
		return e + t.content;
	}, ""), s = [], c = [];
	if (t.class && c.push(["class", t.class]), c.push(["href", t.renderHref(e, r)]), c.push.apply(c, Object.entries(t.renderAttrs(e, r))), t.style === "visually-hidden") {
		if (s.push(Object.assign(new r.Token("span_open", "span", 1), { attrs: [["class", t.visuallyHiddenClass]] }), Object.assign(new r.Token("text", "", 0), { content: t.assistiveText(o) }), new r.Token("span_close", "span", -1)), t.space) {
			var l = typeof t.space == "string" ? t.space : " ";
			s[Tc[t.placement]](Object.assign(new r.Token(typeof t.space == "string" ? "html_inline" : "text", "", 0), { content: l }));
		}
		s[Tc[t.placement]](Object.assign(new r.Token("span_open", "span", 1), { attrs: [["aria-hidden", "true"]] }), Object.assign(new r.Token("html_inline", "", 0), {
			content: t.symbol,
			meta: Ec
		}), new r.Token("span_close", "span", -1));
	} else s.push(Object.assign(new r.Token("html_inline", "", 0), {
		content: t.symbol,
		meta: Ec
	}));
	t.style === "aria-label" ? c.push(["aria-label", t.assistiveText(o)]) : ["aria-describedby", "aria-labelledby"].includes(t.style) && c.push([t.style, e]);
	var u = [Object.assign(new r.Token("link_open", "a", 1), { attrs: Mc(c) })].concat(s, [new r.Token("link_close", "a", -1)]);
	(a = r.tokens).splice.apply(a, [i + 3, 0].concat(u)), t.wrapper && (r.tokens.splice(i, 0, Object.assign(new r.Token("html_block", "", 0), { content: t.wrapper[0] + "\n" })), r.tokens.splice(i + 3 + u.length + 1, 0, Object.assign(new r.Token("html_block", "", 0), { content: t.wrapper[1] + "\n" })));
});
function Lc(e, t, n, r) {
	var i = e, a = r;
	if (n && Object.prototype.hasOwnProperty.call(t, i)) throw Error("User defined `id` attribute `" + e + "` is not unique. Please fix it in your Markdown to continue.");
	for (; Object.prototype.hasOwnProperty.call(t, i);) i = e + "-" + a, a += 1;
	return t[i] = !0, i;
}
function Rc(e, t) {
	t = Object.assign({}, Rc.defaults, t), e.core.ruler.push("anchor", function(e) {
		for (var n, r = {}, i = e.tokens, a = Array.isArray(t.level) ? (n = t.level, function(e) {
			return n.includes(e);
		}) : function(e) {
			return function(t) {
				return t >= e;
			};
		}(t.level), o = 0; o < i.length; o++) {
			var s = i[o];
			if (s.type === "heading_open" && a(Number(s.tag.substr(1)))) {
				var c = t.getTokensText(i[o + 1].children), l = s.attrGet("id");
				l = l == null ? Lc(l = t.slugifyWithState ? t.slugifyWithState(c, e) : t.slugify(c), r, !1, t.uniqueSlugStartIndex) : Lc(l, r, !0, t.uniqueSlugStartIndex), s.attrSet("id", l), !1 !== t.tabIndex && s.attrSet("tabindex", "" + t.tabIndex), typeof t.permalink == "function" ? t.permalink(l, t, e, o) : (t.permalink || t.renderPermalink && t.renderPermalink !== Dc) && t.renderPermalink(l, t, e, o), o = i.indexOf(s), t.callback && t.callback(s, {
					slug: l,
					title: c
				});
			}
		}
	});
}
Object.assign(Ic.defaults, {
	style: "visually-hidden",
	space: !0,
	placement: "after",
	wrapper: null
}), Rc.permalink = {
	__proto__: null,
	legacy: Dc,
	renderHref: Oc,
	renderAttrs: kc,
	makePermalink: jc,
	linkInsideHeader: Nc,
	ariaHidden: Pc,
	headerLink: Fc,
	linkAfterHeader: Ic
}, Rc.defaults = {
	level: 1,
	slugify: function(e) {
		return encodeURIComponent(String(e).trim().toLowerCase().replace(/\s+/g, "-"));
	},
	uniqueSlugStartIndex: 1,
	tabIndex: "-1",
	getTokensText: function(e) {
		return e.filter(function(e) {
			return ["text", "code_inline"].includes(e.type);
		}).map(function(e) {
			return e.content;
		}).join("");
	},
	permalink: !1,
	renderPermalink: Dc,
	permalinkClass: Pc.defaults.class,
	permalinkSpace: Pc.defaults.space,
	permalinkSymbol: "¶",
	permalinkBefore: Pc.defaults.placement === "before",
	permalinkHref: Pc.defaults.renderHref,
	permalinkAttrs: Pc.defaults.renderAttrs
}, Rc.default = Rc;
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/mdurl@2.1.0/node_modules/mdurl/build/index.cjs.js
var zc = /* @__PURE__ */ r(((e) => {
	var t = {};
	function n(e) {
		let n = t[e];
		if (n) return n;
		n = t[e] = [];
		for (let e = 0; e < 128; e++) {
			let t = String.fromCharCode(e);
			n.push(t);
		}
		for (let t = 0; t < e.length; t++) {
			let r = e.charCodeAt(t);
			n[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
		}
		return n;
	}
	function r(e, t) {
		typeof t != "string" && (t = r.defaultChars);
		let i = n(t);
		return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
			let t = "";
			for (let n = 0, r = e.length; n < r; n += 3) {
				let a = parseInt(e.slice(n + 1, n + 3), 16);
				if (a < 128) {
					t += i[a];
					continue;
				}
				if ((a & 224) == 192 && n + 3 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16);
					if ((r & 192) == 128) {
						let e = a << 6 & 1984 | r & 63;
						e < 128 ? t += "��" : t += String.fromCharCode(e), n += 3;
						continue;
					}
				}
				if ((a & 240) == 224 && n + 6 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16), i = parseInt(e.slice(n + 7, n + 9), 16);
					if ((r & 192) == 128 && (i & 192) == 128) {
						let e = a << 12 & 61440 | r << 6 & 4032 | i & 63;
						e < 2048 || e >= 55296 && e <= 57343 ? t += "���" : t += String.fromCharCode(e), n += 6;
						continue;
					}
				}
				if ((a & 248) == 240 && n + 9 < r) {
					let r = parseInt(e.slice(n + 4, n + 6), 16), i = parseInt(e.slice(n + 7, n + 9), 16), o = parseInt(e.slice(n + 10, n + 12), 16);
					if ((r & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
						let e = a << 18 & 1835008 | r << 12 & 258048 | i << 6 & 4032 | o & 63;
						e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), n += 9;
						continue;
					}
				}
				t += "�";
			}
			return t;
		});
	}
	r.defaultChars = ";/?:@&=+$,#", r.componentChars = "";
	var i = {};
	function a(e) {
		let t = i[e];
		if (t) return t;
		t = i[e] = [];
		for (let e = 0; e < 128; e++) {
			let n = String.fromCharCode(e);
			/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
		}
		for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
		return t;
	}
	function o(e, t, n) {
		typeof t != "string" && (n = t, t = o.defaultChars), n === void 0 && (n = !0);
		let r = a(t), i = "";
		for (let t = 0, a = e.length; t < a; t++) {
			let o = e.charCodeAt(t);
			if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
				i += e.slice(t, t + 3), t += 2;
				continue;
			}
			if (o < 128) {
				i += r[o];
				continue;
			}
			if (o >= 55296 && o <= 57343) {
				if (o >= 55296 && o <= 56319 && t + 1 < a) {
					let n = e.charCodeAt(t + 1);
					if (n >= 56320 && n <= 57343) {
						i += encodeURIComponent(e[t] + e[t + 1]), t++;
						continue;
					}
				}
				i += "%EF%BF%BD";
				continue;
			}
			i += encodeURIComponent(e[t]);
		}
		return i;
	}
	o.defaultChars = ";/?:@&=+$,-_.!~*'()#", o.componentChars = "-_.!~*'()";
	function s(e) {
		let t = "";
		return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
	}
	function c() {
		this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
	}
	var l = /^([a-z0-9.+-]+:)/i, u = /:[0-9]*$/, d = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, f = [
		"%",
		"/",
		"?",
		";",
		"#",
		"'",
		"{",
		"}",
		"|",
		"\\",
		"^",
		"`",
		"<",
		">",
		"\"",
		"`",
		" ",
		"\r",
		"\n",
		"	"
	], p = [
		"/",
		"?",
		"#"
	], m = 255, h = /^[+a-z0-9A-Z_-]{0,63}$/, g = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, _ = {
		javascript: !0,
		"javascript:": !0
	}, v = {
		http: !0,
		https: !0,
		ftp: !0,
		gopher: !0,
		file: !0,
		"http:": !0,
		"https:": !0,
		"ftp:": !0,
		"gopher:": !0,
		"file:": !0
	};
	function y(e, t) {
		if (e && e instanceof c) return e;
		let n = new c();
		return n.parse(e, t), n;
	}
	c.prototype.parse = function(e, t) {
		let n, r, i, a = e;
		if (a = a.trim(), !t && e.split("#").length === 1) {
			let e = d.exec(a);
			if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
		}
		let o = l.exec(a);
		if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && _[o]) && (a = a.substr(2), this.slashes = !0)), !_[o] && (i || o && !v[o])) {
			let e = -1;
			for (let t = 0; t < p.length; t++) r = a.indexOf(p[t]), r !== -1 && (e === -1 || r < e) && (e = r);
			let t, n;
			n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
			for (let t = 0; t < f.length; t++) r = a.indexOf(f[t]), r !== -1 && (e === -1 || r < e) && (e = r);
			e === -1 && (e = a.length), a[e - 1] === ":" && e--;
			let i = a.slice(0, e);
			a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
			let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
			if (!o) {
				let e = this.hostname.split(/\./);
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					if (n && !n.match(h)) {
						let r = "";
						for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
						if (!r.match(h)) {
							let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(g);
							o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
							break;
						}
					}
				}
			}
			this.hostname.length > m && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
		}
		let s = a.indexOf("#");
		s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
		let c = a.indexOf("?");
		return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), v[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
	}, c.prototype.parseHost = function(e) {
		let t = u.exec(e);
		t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
	}, e.decode = r, e.encode = o, e.format = s, e.parse = y;
})), Bc = /* @__PURE__ */ r(((e) => {
	e.Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, e.Cc = /[\0-\x1F\x7F-\x9F]/, e.Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, e.P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, e.S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, e.Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
})), Vc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), Hc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), Uc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.replaceCodePoint = e.fromCodePoint = void 0;
	var t = /* @__PURE__ */ new Map([
		[0, 65533],
		[128, 8364],
		[130, 8218],
		[131, 402],
		[132, 8222],
		[133, 8230],
		[134, 8224],
		[135, 8225],
		[136, 710],
		[137, 8240],
		[138, 352],
		[139, 8249],
		[140, 338],
		[142, 381],
		[145, 8216],
		[146, 8217],
		[147, 8220],
		[148, 8221],
		[149, 8226],
		[150, 8211],
		[151, 8212],
		[152, 732],
		[153, 8482],
		[154, 353],
		[155, 8250],
		[156, 339],
		[158, 382],
		[159, 376]
	]);
	e.fromCodePoint = String.fromCodePoint ?? function(e) {
		var t = "";
		return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
	};
	function n(e) {
		return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : t.get(e) ?? e;
	}
	e.replaceCodePoint = n;
	function r(t) {
		return (0, e.fromCodePoint)(n(t));
	}
	e.default = r;
})), Wc = /* @__PURE__ */ r(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__setModuleDefault || (Object.create ? (function(e, t) {
		Object.defineProperty(e, "default", {
			enumerable: !0,
			value: t
		});
	}) : function(e, t) {
		e.default = t;
	}), r = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var r = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && t(r, e, i);
		return n(r, e), r;
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXML = e.decodeHTMLStrict = e.decodeHTMLAttribute = e.decodeHTML = e.determineBranch = e.EntityDecoder = e.DecodingMode = e.BinTrieFlags = e.fromCodePoint = e.replaceCodePoint = e.decodeCodePoint = e.xmlDecodeTree = e.htmlDecodeTree = void 0;
	var a = i(Vc());
	e.htmlDecodeTree = a.default;
	var o = i(Hc());
	e.xmlDecodeTree = o.default;
	var s = r(Uc());
	e.decodeCodePoint = s.default;
	var c = Uc();
	Object.defineProperty(e, "replaceCodePoint", {
		enumerable: !0,
		get: function() {
			return c.replaceCodePoint;
		}
	}), Object.defineProperty(e, "fromCodePoint", {
		enumerable: !0,
		get: function() {
			return c.fromCodePoint;
		}
	});
	var l;
	(function(e) {
		e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
	})(l ||= {});
	var u = 32, d;
	(function(e) {
		e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
	})(d = e.BinTrieFlags ||= {});
	function f(e) {
		return e >= l.ZERO && e <= l.NINE;
	}
	function p(e) {
		return e >= l.UPPER_A && e <= l.UPPER_F || e >= l.LOWER_A && e <= l.LOWER_F;
	}
	function m(e) {
		return e >= l.UPPER_A && e <= l.UPPER_Z || e >= l.LOWER_A && e <= l.LOWER_Z || f(e);
	}
	function h(e) {
		return e === l.EQUALS || m(e);
	}
	var g;
	(function(e) {
		e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
	})(g ||= {});
	var _;
	(function(e) {
		e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
	})(_ = e.DecodingMode ||= {});
	var v = function() {
		function e(e, t, n) {
			this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = g.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = _.Strict;
		}
		return e.prototype.startEntity = function(e) {
			this.decodeMode = e, this.state = g.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
		}, e.prototype.write = function(e, t) {
			switch (this.state) {
				case g.EntityStart: return e.charCodeAt(t) === l.NUM ? (this.state = g.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = g.NamedEntity, this.stateNamedEntity(e, t));
				case g.NumericStart: return this.stateNumericStart(e, t);
				case g.NumericDecimal: return this.stateNumericDecimal(e, t);
				case g.NumericHex: return this.stateNumericHex(e, t);
				case g.NamedEntity: return this.stateNamedEntity(e, t);
			}
		}, e.prototype.stateNumericStart = function(e, t) {
			return t >= e.length ? -1 : (e.charCodeAt(t) | u) === l.LOWER_X ? (this.state = g.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = g.NumericDecimal, this.stateNumericDecimal(e, t));
		}, e.prototype.addToNumericResult = function(e, t, n, r) {
			if (t !== n) {
				var i = n - t;
				this.result = this.result * r ** +i + parseInt(e.substr(t, i), r), this.consumed += i;
			}
		}, e.prototype.stateNumericHex = function(e, t) {
			for (var n = t; t < e.length;) {
				var r = e.charCodeAt(t);
				if (f(r) || p(r)) t += 1;
				else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
			}
			return this.addToNumericResult(e, n, t, 16), -1;
		}, e.prototype.stateNumericDecimal = function(e, t) {
			for (var n = t; t < e.length;) {
				var r = e.charCodeAt(t);
				if (f(r)) t += 1;
				else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
			}
			return this.addToNumericResult(e, n, t, 10), -1;
		}, e.prototype.emitNumericEntity = function(e, t) {
			var n;
			if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			if (e === l.SEMI) this.consumed += 1;
			else if (this.decodeMode === _.Strict) return 0;
			return this.emitCodePoint((0, s.replaceCodePoint)(this.result), this.consumed), this.errors && (e !== l.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
		}, e.prototype.stateNamedEntity = function(e, t) {
			for (var n = this.decodeTree, r = n[this.treeIndex], i = (r & d.VALUE_LENGTH) >> 14; t < e.length; t++, this.excess++) {
				var a = e.charCodeAt(t);
				if (this.treeIndex = b(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === _.Attribute && (i === 0 || h(a)) ? 0 : this.emitNotTerminatedNamedEntity();
				if (r = n[this.treeIndex], i = (r & d.VALUE_LENGTH) >> 14, i !== 0) {
					if (a === l.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
					this.decodeMode !== _.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
				}
			}
			return -1;
		}, e.prototype.emitNotTerminatedNamedEntity = function() {
			var e, t = this, n = t.result, r = (t.decodeTree[n] & d.VALUE_LENGTH) >> 14;
			return this.emitNamedEntityData(n, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
		}, e.prototype.emitNamedEntityData = function(e, t, n) {
			var r = this.decodeTree;
			return this.emitCodePoint(t === 1 ? r[e] & ~d.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
		}, e.prototype.end = function() {
			var e;
			switch (this.state) {
				case g.NamedEntity: return this.result !== 0 && (this.decodeMode !== _.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
				case g.NumericDecimal: return this.emitNumericEntity(0, 2);
				case g.NumericHex: return this.emitNumericEntity(0, 3);
				case g.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
				case g.EntityStart: return 0;
			}
		}, e;
	}();
	e.EntityDecoder = v;
	function y(e) {
		var t = "", n = new v(e, function(e) {
			return t += (0, s.fromCodePoint)(e);
		});
		return function(e, r) {
			for (var i = 0, a = 0; (a = e.indexOf("&", a)) >= 0;) {
				t += e.slice(i, a), n.startEntity(r);
				var o = n.write(e, a + 1);
				if (o < 0) {
					i = a + n.end();
					break;
				}
				i = a + o, a = o === 0 ? i + 1 : i;
			}
			var s = t + e.slice(i);
			return t = "", s;
		};
	}
	function b(e, t, n, r) {
		var i = (t & d.BRANCH_LENGTH) >> 7, a = t & d.JUMP_TABLE;
		if (i === 0) return a !== 0 && r === a ? n : -1;
		if (a) {
			var o = r - a;
			return o < 0 || o >= i ? -1 : e[n + o] - 1;
		}
		for (var s = n, c = s + i - 1; s <= c;) {
			var l = s + c >>> 1, u = e[l];
			if (u < r) s = l + 1;
			else if (u > r) c = l - 1;
			else return e[l + i];
		}
		return -1;
	}
	e.determineBranch = b;
	var x = y(a.default), S = y(o.default);
	function C(e, t) {
		return t === void 0 && (t = _.Legacy), x(e, t);
	}
	e.decodeHTML = C;
	function w(e) {
		return x(e, _.Attribute);
	}
	e.decodeHTMLAttribute = w;
	function T(e) {
		return x(e, _.Strict);
	}
	e.decodeHTMLStrict = T;
	function E(e) {
		return S(e, _.Strict);
	}
	e.decodeXML = E;
})), Gc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 });
	function t(e) {
		for (var t = 1; t < e.length; t++) e[t][0] += e[t - 1][0] + 1;
		return e;
	}
	e.default = new Map(/* #__PURE__ */ t([
		[9, "&Tab;"],
		[0, "&NewLine;"],
		[22, "&excl;"],
		[0, "&quot;"],
		[0, "&num;"],
		[0, "&dollar;"],
		[0, "&percnt;"],
		[0, "&amp;"],
		[0, "&apos;"],
		[0, "&lpar;"],
		[0, "&rpar;"],
		[0, "&ast;"],
		[0, "&plus;"],
		[0, "&comma;"],
		[1, "&period;"],
		[0, "&sol;"],
		[10, "&colon;"],
		[0, "&semi;"],
		[0, {
			v: "&lt;",
			n: 8402,
			o: "&nvlt;"
		}],
		[0, {
			v: "&equals;",
			n: 8421,
			o: "&bne;"
		}],
		[0, {
			v: "&gt;",
			n: 8402,
			o: "&nvgt;"
		}],
		[0, "&quest;"],
		[0, "&commat;"],
		[26, "&lbrack;"],
		[0, "&bsol;"],
		[0, "&rbrack;"],
		[0, "&Hat;"],
		[0, "&lowbar;"],
		[0, "&DiacriticalGrave;"],
		[5, {
			n: 106,
			o: "&fjlig;"
		}],
		[20, "&lbrace;"],
		[0, "&verbar;"],
		[0, "&rbrace;"],
		[34, "&nbsp;"],
		[0, "&iexcl;"],
		[0, "&cent;"],
		[0, "&pound;"],
		[0, "&curren;"],
		[0, "&yen;"],
		[0, "&brvbar;"],
		[0, "&sect;"],
		[0, "&die;"],
		[0, "&copy;"],
		[0, "&ordf;"],
		[0, "&laquo;"],
		[0, "&not;"],
		[0, "&shy;"],
		[0, "&circledR;"],
		[0, "&macr;"],
		[0, "&deg;"],
		[0, "&PlusMinus;"],
		[0, "&sup2;"],
		[0, "&sup3;"],
		[0, "&acute;"],
		[0, "&micro;"],
		[0, "&para;"],
		[0, "&centerdot;"],
		[0, "&cedil;"],
		[0, "&sup1;"],
		[0, "&ordm;"],
		[0, "&raquo;"],
		[0, "&frac14;"],
		[0, "&frac12;"],
		[0, "&frac34;"],
		[0, "&iquest;"],
		[0, "&Agrave;"],
		[0, "&Aacute;"],
		[0, "&Acirc;"],
		[0, "&Atilde;"],
		[0, "&Auml;"],
		[0, "&angst;"],
		[0, "&AElig;"],
		[0, "&Ccedil;"],
		[0, "&Egrave;"],
		[0, "&Eacute;"],
		[0, "&Ecirc;"],
		[0, "&Euml;"],
		[0, "&Igrave;"],
		[0, "&Iacute;"],
		[0, "&Icirc;"],
		[0, "&Iuml;"],
		[0, "&ETH;"],
		[0, "&Ntilde;"],
		[0, "&Ograve;"],
		[0, "&Oacute;"],
		[0, "&Ocirc;"],
		[0, "&Otilde;"],
		[0, "&Ouml;"],
		[0, "&times;"],
		[0, "&Oslash;"],
		[0, "&Ugrave;"],
		[0, "&Uacute;"],
		[0, "&Ucirc;"],
		[0, "&Uuml;"],
		[0, "&Yacute;"],
		[0, "&THORN;"],
		[0, "&szlig;"],
		[0, "&agrave;"],
		[0, "&aacute;"],
		[0, "&acirc;"],
		[0, "&atilde;"],
		[0, "&auml;"],
		[0, "&aring;"],
		[0, "&aelig;"],
		[0, "&ccedil;"],
		[0, "&egrave;"],
		[0, "&eacute;"],
		[0, "&ecirc;"],
		[0, "&euml;"],
		[0, "&igrave;"],
		[0, "&iacute;"],
		[0, "&icirc;"],
		[0, "&iuml;"],
		[0, "&eth;"],
		[0, "&ntilde;"],
		[0, "&ograve;"],
		[0, "&oacute;"],
		[0, "&ocirc;"],
		[0, "&otilde;"],
		[0, "&ouml;"],
		[0, "&div;"],
		[0, "&oslash;"],
		[0, "&ugrave;"],
		[0, "&uacute;"],
		[0, "&ucirc;"],
		[0, "&uuml;"],
		[0, "&yacute;"],
		[0, "&thorn;"],
		[0, "&yuml;"],
		[0, "&Amacr;"],
		[0, "&amacr;"],
		[0, "&Abreve;"],
		[0, "&abreve;"],
		[0, "&Aogon;"],
		[0, "&aogon;"],
		[0, "&Cacute;"],
		[0, "&cacute;"],
		[0, "&Ccirc;"],
		[0, "&ccirc;"],
		[0, "&Cdot;"],
		[0, "&cdot;"],
		[0, "&Ccaron;"],
		[0, "&ccaron;"],
		[0, "&Dcaron;"],
		[0, "&dcaron;"],
		[0, "&Dstrok;"],
		[0, "&dstrok;"],
		[0, "&Emacr;"],
		[0, "&emacr;"],
		[2, "&Edot;"],
		[0, "&edot;"],
		[0, "&Eogon;"],
		[0, "&eogon;"],
		[0, "&Ecaron;"],
		[0, "&ecaron;"],
		[0, "&Gcirc;"],
		[0, "&gcirc;"],
		[0, "&Gbreve;"],
		[0, "&gbreve;"],
		[0, "&Gdot;"],
		[0, "&gdot;"],
		[0, "&Gcedil;"],
		[1, "&Hcirc;"],
		[0, "&hcirc;"],
		[0, "&Hstrok;"],
		[0, "&hstrok;"],
		[0, "&Itilde;"],
		[0, "&itilde;"],
		[0, "&Imacr;"],
		[0, "&imacr;"],
		[2, "&Iogon;"],
		[0, "&iogon;"],
		[0, "&Idot;"],
		[0, "&imath;"],
		[0, "&IJlig;"],
		[0, "&ijlig;"],
		[0, "&Jcirc;"],
		[0, "&jcirc;"],
		[0, "&Kcedil;"],
		[0, "&kcedil;"],
		[0, "&kgreen;"],
		[0, "&Lacute;"],
		[0, "&lacute;"],
		[0, "&Lcedil;"],
		[0, "&lcedil;"],
		[0, "&Lcaron;"],
		[0, "&lcaron;"],
		[0, "&Lmidot;"],
		[0, "&lmidot;"],
		[0, "&Lstrok;"],
		[0, "&lstrok;"],
		[0, "&Nacute;"],
		[0, "&nacute;"],
		[0, "&Ncedil;"],
		[0, "&ncedil;"],
		[0, "&Ncaron;"],
		[0, "&ncaron;"],
		[0, "&napos;"],
		[0, "&ENG;"],
		[0, "&eng;"],
		[0, "&Omacr;"],
		[0, "&omacr;"],
		[2, "&Odblac;"],
		[0, "&odblac;"],
		[0, "&OElig;"],
		[0, "&oelig;"],
		[0, "&Racute;"],
		[0, "&racute;"],
		[0, "&Rcedil;"],
		[0, "&rcedil;"],
		[0, "&Rcaron;"],
		[0, "&rcaron;"],
		[0, "&Sacute;"],
		[0, "&sacute;"],
		[0, "&Scirc;"],
		[0, "&scirc;"],
		[0, "&Scedil;"],
		[0, "&scedil;"],
		[0, "&Scaron;"],
		[0, "&scaron;"],
		[0, "&Tcedil;"],
		[0, "&tcedil;"],
		[0, "&Tcaron;"],
		[0, "&tcaron;"],
		[0, "&Tstrok;"],
		[0, "&tstrok;"],
		[0, "&Utilde;"],
		[0, "&utilde;"],
		[0, "&Umacr;"],
		[0, "&umacr;"],
		[0, "&Ubreve;"],
		[0, "&ubreve;"],
		[0, "&Uring;"],
		[0, "&uring;"],
		[0, "&Udblac;"],
		[0, "&udblac;"],
		[0, "&Uogon;"],
		[0, "&uogon;"],
		[0, "&Wcirc;"],
		[0, "&wcirc;"],
		[0, "&Ycirc;"],
		[0, "&ycirc;"],
		[0, "&Yuml;"],
		[0, "&Zacute;"],
		[0, "&zacute;"],
		[0, "&Zdot;"],
		[0, "&zdot;"],
		[0, "&Zcaron;"],
		[0, "&zcaron;"],
		[19, "&fnof;"],
		[34, "&imped;"],
		[63, "&gacute;"],
		[65, "&jmath;"],
		[142, "&circ;"],
		[0, "&caron;"],
		[16, "&breve;"],
		[0, "&DiacriticalDot;"],
		[0, "&ring;"],
		[0, "&ogon;"],
		[0, "&DiacriticalTilde;"],
		[0, "&dblac;"],
		[51, "&DownBreve;"],
		[127, "&Alpha;"],
		[0, "&Beta;"],
		[0, "&Gamma;"],
		[0, "&Delta;"],
		[0, "&Epsilon;"],
		[0, "&Zeta;"],
		[0, "&Eta;"],
		[0, "&Theta;"],
		[0, "&Iota;"],
		[0, "&Kappa;"],
		[0, "&Lambda;"],
		[0, "&Mu;"],
		[0, "&Nu;"],
		[0, "&Xi;"],
		[0, "&Omicron;"],
		[0, "&Pi;"],
		[0, "&Rho;"],
		[1, "&Sigma;"],
		[0, "&Tau;"],
		[0, "&Upsilon;"],
		[0, "&Phi;"],
		[0, "&Chi;"],
		[0, "&Psi;"],
		[0, "&ohm;"],
		[7, "&alpha;"],
		[0, "&beta;"],
		[0, "&gamma;"],
		[0, "&delta;"],
		[0, "&epsi;"],
		[0, "&zeta;"],
		[0, "&eta;"],
		[0, "&theta;"],
		[0, "&iota;"],
		[0, "&kappa;"],
		[0, "&lambda;"],
		[0, "&mu;"],
		[0, "&nu;"],
		[0, "&xi;"],
		[0, "&omicron;"],
		[0, "&pi;"],
		[0, "&rho;"],
		[0, "&sigmaf;"],
		[0, "&sigma;"],
		[0, "&tau;"],
		[0, "&upsi;"],
		[0, "&phi;"],
		[0, "&chi;"],
		[0, "&psi;"],
		[0, "&omega;"],
		[7, "&thetasym;"],
		[0, "&Upsi;"],
		[2, "&phiv;"],
		[0, "&piv;"],
		[5, "&Gammad;"],
		[0, "&digamma;"],
		[18, "&kappav;"],
		[0, "&rhov;"],
		[3, "&epsiv;"],
		[0, "&backepsilon;"],
		[10, "&IOcy;"],
		[0, "&DJcy;"],
		[0, "&GJcy;"],
		[0, "&Jukcy;"],
		[0, "&DScy;"],
		[0, "&Iukcy;"],
		[0, "&YIcy;"],
		[0, "&Jsercy;"],
		[0, "&LJcy;"],
		[0, "&NJcy;"],
		[0, "&TSHcy;"],
		[0, "&KJcy;"],
		[1, "&Ubrcy;"],
		[0, "&DZcy;"],
		[0, "&Acy;"],
		[0, "&Bcy;"],
		[0, "&Vcy;"],
		[0, "&Gcy;"],
		[0, "&Dcy;"],
		[0, "&IEcy;"],
		[0, "&ZHcy;"],
		[0, "&Zcy;"],
		[0, "&Icy;"],
		[0, "&Jcy;"],
		[0, "&Kcy;"],
		[0, "&Lcy;"],
		[0, "&Mcy;"],
		[0, "&Ncy;"],
		[0, "&Ocy;"],
		[0, "&Pcy;"],
		[0, "&Rcy;"],
		[0, "&Scy;"],
		[0, "&Tcy;"],
		[0, "&Ucy;"],
		[0, "&Fcy;"],
		[0, "&KHcy;"],
		[0, "&TScy;"],
		[0, "&CHcy;"],
		[0, "&SHcy;"],
		[0, "&SHCHcy;"],
		[0, "&HARDcy;"],
		[0, "&Ycy;"],
		[0, "&SOFTcy;"],
		[0, "&Ecy;"],
		[0, "&YUcy;"],
		[0, "&YAcy;"],
		[0, "&acy;"],
		[0, "&bcy;"],
		[0, "&vcy;"],
		[0, "&gcy;"],
		[0, "&dcy;"],
		[0, "&iecy;"],
		[0, "&zhcy;"],
		[0, "&zcy;"],
		[0, "&icy;"],
		[0, "&jcy;"],
		[0, "&kcy;"],
		[0, "&lcy;"],
		[0, "&mcy;"],
		[0, "&ncy;"],
		[0, "&ocy;"],
		[0, "&pcy;"],
		[0, "&rcy;"],
		[0, "&scy;"],
		[0, "&tcy;"],
		[0, "&ucy;"],
		[0, "&fcy;"],
		[0, "&khcy;"],
		[0, "&tscy;"],
		[0, "&chcy;"],
		[0, "&shcy;"],
		[0, "&shchcy;"],
		[0, "&hardcy;"],
		[0, "&ycy;"],
		[0, "&softcy;"],
		[0, "&ecy;"],
		[0, "&yucy;"],
		[0, "&yacy;"],
		[1, "&iocy;"],
		[0, "&djcy;"],
		[0, "&gjcy;"],
		[0, "&jukcy;"],
		[0, "&dscy;"],
		[0, "&iukcy;"],
		[0, "&yicy;"],
		[0, "&jsercy;"],
		[0, "&ljcy;"],
		[0, "&njcy;"],
		[0, "&tshcy;"],
		[0, "&kjcy;"],
		[1, "&ubrcy;"],
		[0, "&dzcy;"],
		[7074, "&ensp;"],
		[0, "&emsp;"],
		[0, "&emsp13;"],
		[0, "&emsp14;"],
		[1, "&numsp;"],
		[0, "&puncsp;"],
		[0, "&ThinSpace;"],
		[0, "&hairsp;"],
		[0, "&NegativeMediumSpace;"],
		[0, "&zwnj;"],
		[0, "&zwj;"],
		[0, "&lrm;"],
		[0, "&rlm;"],
		[0, "&dash;"],
		[2, "&ndash;"],
		[0, "&mdash;"],
		[0, "&horbar;"],
		[0, "&Verbar;"],
		[1, "&lsquo;"],
		[0, "&CloseCurlyQuote;"],
		[0, "&lsquor;"],
		[1, "&ldquo;"],
		[0, "&CloseCurlyDoubleQuote;"],
		[0, "&bdquo;"],
		[1, "&dagger;"],
		[0, "&Dagger;"],
		[0, "&bull;"],
		[2, "&nldr;"],
		[0, "&hellip;"],
		[9, "&permil;"],
		[0, "&pertenk;"],
		[0, "&prime;"],
		[0, "&Prime;"],
		[0, "&tprime;"],
		[0, "&backprime;"],
		[3, "&lsaquo;"],
		[0, "&rsaquo;"],
		[3, "&oline;"],
		[2, "&caret;"],
		[1, "&hybull;"],
		[0, "&frasl;"],
		[10, "&bsemi;"],
		[7, "&qprime;"],
		[7, {
			v: "&MediumSpace;",
			n: 8202,
			o: "&ThickSpace;"
		}],
		[0, "&NoBreak;"],
		[0, "&af;"],
		[0, "&InvisibleTimes;"],
		[0, "&ic;"],
		[72, "&euro;"],
		[46, "&tdot;"],
		[0, "&DotDot;"],
		[37, "&complexes;"],
		[2, "&incare;"],
		[4, "&gscr;"],
		[0, "&hamilt;"],
		[0, "&Hfr;"],
		[0, "&Hopf;"],
		[0, "&planckh;"],
		[0, "&hbar;"],
		[0, "&imagline;"],
		[0, "&Ifr;"],
		[0, "&lagran;"],
		[0, "&ell;"],
		[1, "&naturals;"],
		[0, "&numero;"],
		[0, "&copysr;"],
		[0, "&weierp;"],
		[0, "&Popf;"],
		[0, "&Qopf;"],
		[0, "&realine;"],
		[0, "&real;"],
		[0, "&reals;"],
		[0, "&rx;"],
		[3, "&trade;"],
		[1, "&integers;"],
		[2, "&mho;"],
		[0, "&zeetrf;"],
		[0, "&iiota;"],
		[2, "&bernou;"],
		[0, "&Cayleys;"],
		[1, "&escr;"],
		[0, "&Escr;"],
		[0, "&Fouriertrf;"],
		[1, "&Mellintrf;"],
		[0, "&order;"],
		[0, "&alefsym;"],
		[0, "&beth;"],
		[0, "&gimel;"],
		[0, "&daleth;"],
		[12, "&CapitalDifferentialD;"],
		[0, "&dd;"],
		[0, "&ee;"],
		[0, "&ii;"],
		[10, "&frac13;"],
		[0, "&frac23;"],
		[0, "&frac15;"],
		[0, "&frac25;"],
		[0, "&frac35;"],
		[0, "&frac45;"],
		[0, "&frac16;"],
		[0, "&frac56;"],
		[0, "&frac18;"],
		[0, "&frac38;"],
		[0, "&frac58;"],
		[0, "&frac78;"],
		[49, "&larr;"],
		[0, "&ShortUpArrow;"],
		[0, "&rarr;"],
		[0, "&darr;"],
		[0, "&harr;"],
		[0, "&updownarrow;"],
		[0, "&nwarr;"],
		[0, "&nearr;"],
		[0, "&LowerRightArrow;"],
		[0, "&LowerLeftArrow;"],
		[0, "&nlarr;"],
		[0, "&nrarr;"],
		[1, {
			v: "&rarrw;",
			n: 824,
			o: "&nrarrw;"
		}],
		[0, "&Larr;"],
		[0, "&Uarr;"],
		[0, "&Rarr;"],
		[0, "&Darr;"],
		[0, "&larrtl;"],
		[0, "&rarrtl;"],
		[0, "&LeftTeeArrow;"],
		[0, "&mapstoup;"],
		[0, "&map;"],
		[0, "&DownTeeArrow;"],
		[1, "&hookleftarrow;"],
		[0, "&hookrightarrow;"],
		[0, "&larrlp;"],
		[0, "&looparrowright;"],
		[0, "&harrw;"],
		[0, "&nharr;"],
		[1, "&lsh;"],
		[0, "&rsh;"],
		[0, "&ldsh;"],
		[0, "&rdsh;"],
		[1, "&crarr;"],
		[0, "&cularr;"],
		[0, "&curarr;"],
		[2, "&circlearrowleft;"],
		[0, "&circlearrowright;"],
		[0, "&leftharpoonup;"],
		[0, "&DownLeftVector;"],
		[0, "&RightUpVector;"],
		[0, "&LeftUpVector;"],
		[0, "&rharu;"],
		[0, "&DownRightVector;"],
		[0, "&dharr;"],
		[0, "&dharl;"],
		[0, "&RightArrowLeftArrow;"],
		[0, "&udarr;"],
		[0, "&LeftArrowRightArrow;"],
		[0, "&leftleftarrows;"],
		[0, "&upuparrows;"],
		[0, "&rightrightarrows;"],
		[0, "&ddarr;"],
		[0, "&leftrightharpoons;"],
		[0, "&Equilibrium;"],
		[0, "&nlArr;"],
		[0, "&nhArr;"],
		[0, "&nrArr;"],
		[0, "&DoubleLeftArrow;"],
		[0, "&DoubleUpArrow;"],
		[0, "&DoubleRightArrow;"],
		[0, "&dArr;"],
		[0, "&DoubleLeftRightArrow;"],
		[0, "&DoubleUpDownArrow;"],
		[0, "&nwArr;"],
		[0, "&neArr;"],
		[0, "&seArr;"],
		[0, "&swArr;"],
		[0, "&lAarr;"],
		[0, "&rAarr;"],
		[1, "&zigrarr;"],
		[6, "&larrb;"],
		[0, "&rarrb;"],
		[15, "&DownArrowUpArrow;"],
		[7, "&loarr;"],
		[0, "&roarr;"],
		[0, "&hoarr;"],
		[0, "&forall;"],
		[0, "&comp;"],
		[0, {
			v: "&part;",
			n: 824,
			o: "&npart;"
		}],
		[0, "&exist;"],
		[0, "&nexist;"],
		[0, "&empty;"],
		[1, "&Del;"],
		[0, "&Element;"],
		[0, "&NotElement;"],
		[1, "&ni;"],
		[0, "&notni;"],
		[2, "&prod;"],
		[0, "&coprod;"],
		[0, "&sum;"],
		[0, "&minus;"],
		[0, "&MinusPlus;"],
		[0, "&dotplus;"],
		[1, "&Backslash;"],
		[0, "&lowast;"],
		[0, "&compfn;"],
		[1, "&radic;"],
		[2, "&prop;"],
		[0, "&infin;"],
		[0, "&angrt;"],
		[0, {
			v: "&ang;",
			n: 8402,
			o: "&nang;"
		}],
		[0, "&angmsd;"],
		[0, "&angsph;"],
		[0, "&mid;"],
		[0, "&nmid;"],
		[0, "&DoubleVerticalBar;"],
		[0, "&NotDoubleVerticalBar;"],
		[0, "&and;"],
		[0, "&or;"],
		[0, {
			v: "&cap;",
			n: 65024,
			o: "&caps;"
		}],
		[0, {
			v: "&cup;",
			n: 65024,
			o: "&cups;"
		}],
		[0, "&int;"],
		[0, "&Int;"],
		[0, "&iiint;"],
		[0, "&conint;"],
		[0, "&Conint;"],
		[0, "&Cconint;"],
		[0, "&cwint;"],
		[0, "&ClockwiseContourIntegral;"],
		[0, "&awconint;"],
		[0, "&there4;"],
		[0, "&becaus;"],
		[0, "&ratio;"],
		[0, "&Colon;"],
		[0, "&dotminus;"],
		[1, "&mDDot;"],
		[0, "&homtht;"],
		[0, {
			v: "&sim;",
			n: 8402,
			o: "&nvsim;"
		}],
		[0, {
			v: "&backsim;",
			n: 817,
			o: "&race;"
		}],
		[0, {
			v: "&ac;",
			n: 819,
			o: "&acE;"
		}],
		[0, "&acd;"],
		[0, "&VerticalTilde;"],
		[0, "&NotTilde;"],
		[0, {
			v: "&eqsim;",
			n: 824,
			o: "&nesim;"
		}],
		[0, "&sime;"],
		[0, "&NotTildeEqual;"],
		[0, "&cong;"],
		[0, "&simne;"],
		[0, "&ncong;"],
		[0, "&ap;"],
		[0, "&nap;"],
		[0, "&ape;"],
		[0, {
			v: "&apid;",
			n: 824,
			o: "&napid;"
		}],
		[0, "&backcong;"],
		[0, {
			v: "&asympeq;",
			n: 8402,
			o: "&nvap;"
		}],
		[0, {
			v: "&bump;",
			n: 824,
			o: "&nbump;"
		}],
		[0, {
			v: "&bumpe;",
			n: 824,
			o: "&nbumpe;"
		}],
		[0, {
			v: "&doteq;",
			n: 824,
			o: "&nedot;"
		}],
		[0, "&doteqdot;"],
		[0, "&efDot;"],
		[0, "&erDot;"],
		[0, "&Assign;"],
		[0, "&ecolon;"],
		[0, "&ecir;"],
		[0, "&circeq;"],
		[1, "&wedgeq;"],
		[0, "&veeeq;"],
		[1, "&triangleq;"],
		[2, "&equest;"],
		[0, "&ne;"],
		[0, {
			v: "&Congruent;",
			n: 8421,
			o: "&bnequiv;"
		}],
		[0, "&nequiv;"],
		[1, {
			v: "&le;",
			n: 8402,
			o: "&nvle;"
		}],
		[0, {
			v: "&ge;",
			n: 8402,
			o: "&nvge;"
		}],
		[0, {
			v: "&lE;",
			n: 824,
			o: "&nlE;"
		}],
		[0, {
			v: "&gE;",
			n: 824,
			o: "&ngE;"
		}],
		[0, {
			v: "&lnE;",
			n: 65024,
			o: "&lvertneqq;"
		}],
		[0, {
			v: "&gnE;",
			n: 65024,
			o: "&gvertneqq;"
		}],
		[0, {
			v: "&ll;",
			n: new Map(/* #__PURE__ */ t([[824, "&nLtv;"], [7577, "&nLt;"]]))
		}],
		[0, {
			v: "&gg;",
			n: new Map(/* #__PURE__ */ t([[824, "&nGtv;"], [7577, "&nGt;"]]))
		}],
		[0, "&between;"],
		[0, "&NotCupCap;"],
		[0, "&nless;"],
		[0, "&ngt;"],
		[0, "&nle;"],
		[0, "&nge;"],
		[0, "&lesssim;"],
		[0, "&GreaterTilde;"],
		[0, "&nlsim;"],
		[0, "&ngsim;"],
		[0, "&LessGreater;"],
		[0, "&gl;"],
		[0, "&NotLessGreater;"],
		[0, "&NotGreaterLess;"],
		[0, "&pr;"],
		[0, "&sc;"],
		[0, "&prcue;"],
		[0, "&sccue;"],
		[0, "&PrecedesTilde;"],
		[0, {
			v: "&scsim;",
			n: 824,
			o: "&NotSucceedsTilde;"
		}],
		[0, "&NotPrecedes;"],
		[0, "&NotSucceeds;"],
		[0, {
			v: "&sub;",
			n: 8402,
			o: "&NotSubset;"
		}],
		[0, {
			v: "&sup;",
			n: 8402,
			o: "&NotSuperset;"
		}],
		[0, "&nsub;"],
		[0, "&nsup;"],
		[0, "&sube;"],
		[0, "&supe;"],
		[0, "&NotSubsetEqual;"],
		[0, "&NotSupersetEqual;"],
		[0, {
			v: "&subne;",
			n: 65024,
			o: "&varsubsetneq;"
		}],
		[0, {
			v: "&supne;",
			n: 65024,
			o: "&varsupsetneq;"
		}],
		[1, "&cupdot;"],
		[0, "&UnionPlus;"],
		[0, {
			v: "&sqsub;",
			n: 824,
			o: "&NotSquareSubset;"
		}],
		[0, {
			v: "&sqsup;",
			n: 824,
			o: "&NotSquareSuperset;"
		}],
		[0, "&sqsube;"],
		[0, "&sqsupe;"],
		[0, {
			v: "&sqcap;",
			n: 65024,
			o: "&sqcaps;"
		}],
		[0, {
			v: "&sqcup;",
			n: 65024,
			o: "&sqcups;"
		}],
		[0, "&CirclePlus;"],
		[0, "&CircleMinus;"],
		[0, "&CircleTimes;"],
		[0, "&osol;"],
		[0, "&CircleDot;"],
		[0, "&circledcirc;"],
		[0, "&circledast;"],
		[1, "&circleddash;"],
		[0, "&boxplus;"],
		[0, "&boxminus;"],
		[0, "&boxtimes;"],
		[0, "&dotsquare;"],
		[0, "&RightTee;"],
		[0, "&dashv;"],
		[0, "&DownTee;"],
		[0, "&bot;"],
		[1, "&models;"],
		[0, "&DoubleRightTee;"],
		[0, "&Vdash;"],
		[0, "&Vvdash;"],
		[0, "&VDash;"],
		[0, "&nvdash;"],
		[0, "&nvDash;"],
		[0, "&nVdash;"],
		[0, "&nVDash;"],
		[0, "&prurel;"],
		[1, "&LeftTriangle;"],
		[0, "&RightTriangle;"],
		[0, {
			v: "&LeftTriangleEqual;",
			n: 8402,
			o: "&nvltrie;"
		}],
		[0, {
			v: "&RightTriangleEqual;",
			n: 8402,
			o: "&nvrtrie;"
		}],
		[0, "&origof;"],
		[0, "&imof;"],
		[0, "&multimap;"],
		[0, "&hercon;"],
		[0, "&intcal;"],
		[0, "&veebar;"],
		[1, "&barvee;"],
		[0, "&angrtvb;"],
		[0, "&lrtri;"],
		[0, "&bigwedge;"],
		[0, "&bigvee;"],
		[0, "&bigcap;"],
		[0, "&bigcup;"],
		[0, "&diam;"],
		[0, "&sdot;"],
		[0, "&sstarf;"],
		[0, "&divideontimes;"],
		[0, "&bowtie;"],
		[0, "&ltimes;"],
		[0, "&rtimes;"],
		[0, "&leftthreetimes;"],
		[0, "&rightthreetimes;"],
		[0, "&backsimeq;"],
		[0, "&curlyvee;"],
		[0, "&curlywedge;"],
		[0, "&Sub;"],
		[0, "&Sup;"],
		[0, "&Cap;"],
		[0, "&Cup;"],
		[0, "&fork;"],
		[0, "&epar;"],
		[0, "&lessdot;"],
		[0, "&gtdot;"],
		[0, {
			v: "&Ll;",
			n: 824,
			o: "&nLl;"
		}],
		[0, {
			v: "&Gg;",
			n: 824,
			o: "&nGg;"
		}],
		[0, {
			v: "&leg;",
			n: 65024,
			o: "&lesg;"
		}],
		[0, {
			v: "&gel;",
			n: 65024,
			o: "&gesl;"
		}],
		[2, "&cuepr;"],
		[0, "&cuesc;"],
		[0, "&NotPrecedesSlantEqual;"],
		[0, "&NotSucceedsSlantEqual;"],
		[0, "&NotSquareSubsetEqual;"],
		[0, "&NotSquareSupersetEqual;"],
		[2, "&lnsim;"],
		[0, "&gnsim;"],
		[0, "&precnsim;"],
		[0, "&scnsim;"],
		[0, "&nltri;"],
		[0, "&NotRightTriangle;"],
		[0, "&nltrie;"],
		[0, "&NotRightTriangleEqual;"],
		[0, "&vellip;"],
		[0, "&ctdot;"],
		[0, "&utdot;"],
		[0, "&dtdot;"],
		[0, "&disin;"],
		[0, "&isinsv;"],
		[0, "&isins;"],
		[0, {
			v: "&isindot;",
			n: 824,
			o: "&notindot;"
		}],
		[0, "&notinvc;"],
		[0, "&notinvb;"],
		[1, {
			v: "&isinE;",
			n: 824,
			o: "&notinE;"
		}],
		[0, "&nisd;"],
		[0, "&xnis;"],
		[0, "&nis;"],
		[0, "&notnivc;"],
		[0, "&notnivb;"],
		[6, "&barwed;"],
		[0, "&Barwed;"],
		[1, "&lceil;"],
		[0, "&rceil;"],
		[0, "&LeftFloor;"],
		[0, "&rfloor;"],
		[0, "&drcrop;"],
		[0, "&dlcrop;"],
		[0, "&urcrop;"],
		[0, "&ulcrop;"],
		[0, "&bnot;"],
		[1, "&profline;"],
		[0, "&profsurf;"],
		[1, "&telrec;"],
		[0, "&target;"],
		[5, "&ulcorn;"],
		[0, "&urcorn;"],
		[0, "&dlcorn;"],
		[0, "&drcorn;"],
		[2, "&frown;"],
		[0, "&smile;"],
		[9, "&cylcty;"],
		[0, "&profalar;"],
		[7, "&topbot;"],
		[6, "&ovbar;"],
		[1, "&solbar;"],
		[60, "&angzarr;"],
		[51, "&lmoustache;"],
		[0, "&rmoustache;"],
		[2, "&OverBracket;"],
		[0, "&bbrk;"],
		[0, "&bbrktbrk;"],
		[37, "&OverParenthesis;"],
		[0, "&UnderParenthesis;"],
		[0, "&OverBrace;"],
		[0, "&UnderBrace;"],
		[2, "&trpezium;"],
		[4, "&elinters;"],
		[59, "&blank;"],
		[164, "&circledS;"],
		[55, "&boxh;"],
		[1, "&boxv;"],
		[9, "&boxdr;"],
		[3, "&boxdl;"],
		[3, "&boxur;"],
		[3, "&boxul;"],
		[3, "&boxvr;"],
		[7, "&boxvl;"],
		[7, "&boxhd;"],
		[7, "&boxhu;"],
		[7, "&boxvh;"],
		[19, "&boxH;"],
		[0, "&boxV;"],
		[0, "&boxdR;"],
		[0, "&boxDr;"],
		[0, "&boxDR;"],
		[0, "&boxdL;"],
		[0, "&boxDl;"],
		[0, "&boxDL;"],
		[0, "&boxuR;"],
		[0, "&boxUr;"],
		[0, "&boxUR;"],
		[0, "&boxuL;"],
		[0, "&boxUl;"],
		[0, "&boxUL;"],
		[0, "&boxvR;"],
		[0, "&boxVr;"],
		[0, "&boxVR;"],
		[0, "&boxvL;"],
		[0, "&boxVl;"],
		[0, "&boxVL;"],
		[0, "&boxHd;"],
		[0, "&boxhD;"],
		[0, "&boxHD;"],
		[0, "&boxHu;"],
		[0, "&boxhU;"],
		[0, "&boxHU;"],
		[0, "&boxvH;"],
		[0, "&boxVh;"],
		[0, "&boxVH;"],
		[19, "&uhblk;"],
		[3, "&lhblk;"],
		[3, "&block;"],
		[8, "&blk14;"],
		[0, "&blk12;"],
		[0, "&blk34;"],
		[13, "&square;"],
		[8, "&blacksquare;"],
		[0, "&EmptyVerySmallSquare;"],
		[1, "&rect;"],
		[0, "&marker;"],
		[2, "&fltns;"],
		[1, "&bigtriangleup;"],
		[0, "&blacktriangle;"],
		[0, "&triangle;"],
		[2, "&blacktriangleright;"],
		[0, "&rtri;"],
		[3, "&bigtriangledown;"],
		[0, "&blacktriangledown;"],
		[0, "&dtri;"],
		[2, "&blacktriangleleft;"],
		[0, "&ltri;"],
		[6, "&loz;"],
		[0, "&cir;"],
		[32, "&tridot;"],
		[2, "&bigcirc;"],
		[8, "&ultri;"],
		[0, "&urtri;"],
		[0, "&lltri;"],
		[0, "&EmptySmallSquare;"],
		[0, "&FilledSmallSquare;"],
		[8, "&bigstar;"],
		[0, "&star;"],
		[7, "&phone;"],
		[49, "&female;"],
		[1, "&male;"],
		[29, "&spades;"],
		[2, "&clubs;"],
		[1, "&hearts;"],
		[0, "&diamondsuit;"],
		[3, "&sung;"],
		[2, "&flat;"],
		[0, "&natural;"],
		[0, "&sharp;"],
		[163, "&check;"],
		[3, "&cross;"],
		[8, "&malt;"],
		[21, "&sext;"],
		[33, "&VerticalSeparator;"],
		[25, "&lbbrk;"],
		[0, "&rbbrk;"],
		[84, "&bsolhsub;"],
		[0, "&suphsol;"],
		[28, "&LeftDoubleBracket;"],
		[0, "&RightDoubleBracket;"],
		[0, "&lang;"],
		[0, "&rang;"],
		[0, "&Lang;"],
		[0, "&Rang;"],
		[0, "&loang;"],
		[0, "&roang;"],
		[7, "&longleftarrow;"],
		[0, "&longrightarrow;"],
		[0, "&longleftrightarrow;"],
		[0, "&DoubleLongLeftArrow;"],
		[0, "&DoubleLongRightArrow;"],
		[0, "&DoubleLongLeftRightArrow;"],
		[1, "&longmapsto;"],
		[2, "&dzigrarr;"],
		[258, "&nvlArr;"],
		[0, "&nvrArr;"],
		[0, "&nvHarr;"],
		[0, "&Map;"],
		[6, "&lbarr;"],
		[0, "&bkarow;"],
		[0, "&lBarr;"],
		[0, "&dbkarow;"],
		[0, "&drbkarow;"],
		[0, "&DDotrahd;"],
		[0, "&UpArrowBar;"],
		[0, "&DownArrowBar;"],
		[2, "&Rarrtl;"],
		[2, "&latail;"],
		[0, "&ratail;"],
		[0, "&lAtail;"],
		[0, "&rAtail;"],
		[0, "&larrfs;"],
		[0, "&rarrfs;"],
		[0, "&larrbfs;"],
		[0, "&rarrbfs;"],
		[2, "&nwarhk;"],
		[0, "&nearhk;"],
		[0, "&hksearow;"],
		[0, "&hkswarow;"],
		[0, "&nwnear;"],
		[0, "&nesear;"],
		[0, "&seswar;"],
		[0, "&swnwar;"],
		[8, {
			v: "&rarrc;",
			n: 824,
			o: "&nrarrc;"
		}],
		[1, "&cudarrr;"],
		[0, "&ldca;"],
		[0, "&rdca;"],
		[0, "&cudarrl;"],
		[0, "&larrpl;"],
		[2, "&curarrm;"],
		[0, "&cularrp;"],
		[7, "&rarrpl;"],
		[2, "&harrcir;"],
		[0, "&Uarrocir;"],
		[0, "&lurdshar;"],
		[0, "&ldrushar;"],
		[2, "&LeftRightVector;"],
		[0, "&RightUpDownVector;"],
		[0, "&DownLeftRightVector;"],
		[0, "&LeftUpDownVector;"],
		[0, "&LeftVectorBar;"],
		[0, "&RightVectorBar;"],
		[0, "&RightUpVectorBar;"],
		[0, "&RightDownVectorBar;"],
		[0, "&DownLeftVectorBar;"],
		[0, "&DownRightVectorBar;"],
		[0, "&LeftUpVectorBar;"],
		[0, "&LeftDownVectorBar;"],
		[0, "&LeftTeeVector;"],
		[0, "&RightTeeVector;"],
		[0, "&RightUpTeeVector;"],
		[0, "&RightDownTeeVector;"],
		[0, "&DownLeftTeeVector;"],
		[0, "&DownRightTeeVector;"],
		[0, "&LeftUpTeeVector;"],
		[0, "&LeftDownTeeVector;"],
		[0, "&lHar;"],
		[0, "&uHar;"],
		[0, "&rHar;"],
		[0, "&dHar;"],
		[0, "&luruhar;"],
		[0, "&ldrdhar;"],
		[0, "&ruluhar;"],
		[0, "&rdldhar;"],
		[0, "&lharul;"],
		[0, "&llhard;"],
		[0, "&rharul;"],
		[0, "&lrhard;"],
		[0, "&udhar;"],
		[0, "&duhar;"],
		[0, "&RoundImplies;"],
		[0, "&erarr;"],
		[0, "&simrarr;"],
		[0, "&larrsim;"],
		[0, "&rarrsim;"],
		[0, "&rarrap;"],
		[0, "&ltlarr;"],
		[1, "&gtrarr;"],
		[0, "&subrarr;"],
		[1, "&suplarr;"],
		[0, "&lfisht;"],
		[0, "&rfisht;"],
		[0, "&ufisht;"],
		[0, "&dfisht;"],
		[5, "&lopar;"],
		[0, "&ropar;"],
		[4, "&lbrke;"],
		[0, "&rbrke;"],
		[0, "&lbrkslu;"],
		[0, "&rbrksld;"],
		[0, "&lbrksld;"],
		[0, "&rbrkslu;"],
		[0, "&langd;"],
		[0, "&rangd;"],
		[0, "&lparlt;"],
		[0, "&rpargt;"],
		[0, "&gtlPar;"],
		[0, "&ltrPar;"],
		[3, "&vzigzag;"],
		[1, "&vangrt;"],
		[0, "&angrtvbd;"],
		[6, "&ange;"],
		[0, "&range;"],
		[0, "&dwangle;"],
		[0, "&uwangle;"],
		[0, "&angmsdaa;"],
		[0, "&angmsdab;"],
		[0, "&angmsdac;"],
		[0, "&angmsdad;"],
		[0, "&angmsdae;"],
		[0, "&angmsdaf;"],
		[0, "&angmsdag;"],
		[0, "&angmsdah;"],
		[0, "&bemptyv;"],
		[0, "&demptyv;"],
		[0, "&cemptyv;"],
		[0, "&raemptyv;"],
		[0, "&laemptyv;"],
		[0, "&ohbar;"],
		[0, "&omid;"],
		[0, "&opar;"],
		[1, "&operp;"],
		[1, "&olcross;"],
		[0, "&odsold;"],
		[1, "&olcir;"],
		[0, "&ofcir;"],
		[0, "&olt;"],
		[0, "&ogt;"],
		[0, "&cirscir;"],
		[0, "&cirE;"],
		[0, "&solb;"],
		[0, "&bsolb;"],
		[3, "&boxbox;"],
		[3, "&trisb;"],
		[0, "&rtriltri;"],
		[0, {
			v: "&LeftTriangleBar;",
			n: 824,
			o: "&NotLeftTriangleBar;"
		}],
		[0, {
			v: "&RightTriangleBar;",
			n: 824,
			o: "&NotRightTriangleBar;"
		}],
		[11, "&iinfin;"],
		[0, "&infintie;"],
		[0, "&nvinfin;"],
		[4, "&eparsl;"],
		[0, "&smeparsl;"],
		[0, "&eqvparsl;"],
		[5, "&blacklozenge;"],
		[8, "&RuleDelayed;"],
		[1, "&dsol;"],
		[9, "&bigodot;"],
		[0, "&bigoplus;"],
		[0, "&bigotimes;"],
		[1, "&biguplus;"],
		[1, "&bigsqcup;"],
		[5, "&iiiint;"],
		[0, "&fpartint;"],
		[2, "&cirfnint;"],
		[0, "&awint;"],
		[0, "&rppolint;"],
		[0, "&scpolint;"],
		[0, "&npolint;"],
		[0, "&pointint;"],
		[0, "&quatint;"],
		[0, "&intlarhk;"],
		[10, "&pluscir;"],
		[0, "&plusacir;"],
		[0, "&simplus;"],
		[0, "&plusdu;"],
		[0, "&plussim;"],
		[0, "&plustwo;"],
		[1, "&mcomma;"],
		[0, "&minusdu;"],
		[2, "&loplus;"],
		[0, "&roplus;"],
		[0, "&Cross;"],
		[0, "&timesd;"],
		[0, "&timesbar;"],
		[1, "&smashp;"],
		[0, "&lotimes;"],
		[0, "&rotimes;"],
		[0, "&otimesas;"],
		[0, "&Otimes;"],
		[0, "&odiv;"],
		[0, "&triplus;"],
		[0, "&triminus;"],
		[0, "&tritime;"],
		[0, "&intprod;"],
		[2, "&amalg;"],
		[0, "&capdot;"],
		[1, "&ncup;"],
		[0, "&ncap;"],
		[0, "&capand;"],
		[0, "&cupor;"],
		[0, "&cupcap;"],
		[0, "&capcup;"],
		[0, "&cupbrcap;"],
		[0, "&capbrcup;"],
		[0, "&cupcup;"],
		[0, "&capcap;"],
		[0, "&ccups;"],
		[0, "&ccaps;"],
		[2, "&ccupssm;"],
		[2, "&And;"],
		[0, "&Or;"],
		[0, "&andand;"],
		[0, "&oror;"],
		[0, "&orslope;"],
		[0, "&andslope;"],
		[1, "&andv;"],
		[0, "&orv;"],
		[0, "&andd;"],
		[0, "&ord;"],
		[1, "&wedbar;"],
		[6, "&sdote;"],
		[3, "&simdot;"],
		[2, {
			v: "&congdot;",
			n: 824,
			o: "&ncongdot;"
		}],
		[0, "&easter;"],
		[0, "&apacir;"],
		[0, {
			v: "&apE;",
			n: 824,
			o: "&napE;"
		}],
		[0, "&eplus;"],
		[0, "&pluse;"],
		[0, "&Esim;"],
		[0, "&Colone;"],
		[0, "&Equal;"],
		[1, "&ddotseq;"],
		[0, "&equivDD;"],
		[0, "&ltcir;"],
		[0, "&gtcir;"],
		[0, "&ltquest;"],
		[0, "&gtquest;"],
		[0, {
			v: "&leqslant;",
			n: 824,
			o: "&nleqslant;"
		}],
		[0, {
			v: "&geqslant;",
			n: 824,
			o: "&ngeqslant;"
		}],
		[0, "&lesdot;"],
		[0, "&gesdot;"],
		[0, "&lesdoto;"],
		[0, "&gesdoto;"],
		[0, "&lesdotor;"],
		[0, "&gesdotol;"],
		[0, "&lap;"],
		[0, "&gap;"],
		[0, "&lne;"],
		[0, "&gne;"],
		[0, "&lnap;"],
		[0, "&gnap;"],
		[0, "&lEg;"],
		[0, "&gEl;"],
		[0, "&lsime;"],
		[0, "&gsime;"],
		[0, "&lsimg;"],
		[0, "&gsiml;"],
		[0, "&lgE;"],
		[0, "&glE;"],
		[0, "&lesges;"],
		[0, "&gesles;"],
		[0, "&els;"],
		[0, "&egs;"],
		[0, "&elsdot;"],
		[0, "&egsdot;"],
		[0, "&el;"],
		[0, "&eg;"],
		[2, "&siml;"],
		[0, "&simg;"],
		[0, "&simlE;"],
		[0, "&simgE;"],
		[0, {
			v: "&LessLess;",
			n: 824,
			o: "&NotNestedLessLess;"
		}],
		[0, {
			v: "&GreaterGreater;",
			n: 824,
			o: "&NotNestedGreaterGreater;"
		}],
		[1, "&glj;"],
		[0, "&gla;"],
		[0, "&ltcc;"],
		[0, "&gtcc;"],
		[0, "&lescc;"],
		[0, "&gescc;"],
		[0, "&smt;"],
		[0, "&lat;"],
		[0, {
			v: "&smte;",
			n: 65024,
			o: "&smtes;"
		}],
		[0, {
			v: "&late;",
			n: 65024,
			o: "&lates;"
		}],
		[0, "&bumpE;"],
		[0, {
			v: "&PrecedesEqual;",
			n: 824,
			o: "&NotPrecedesEqual;"
		}],
		[0, {
			v: "&sce;",
			n: 824,
			o: "&NotSucceedsEqual;"
		}],
		[2, "&prE;"],
		[0, "&scE;"],
		[0, "&precneqq;"],
		[0, "&scnE;"],
		[0, "&prap;"],
		[0, "&scap;"],
		[0, "&precnapprox;"],
		[0, "&scnap;"],
		[0, "&Pr;"],
		[0, "&Sc;"],
		[0, "&subdot;"],
		[0, "&supdot;"],
		[0, "&subplus;"],
		[0, "&supplus;"],
		[0, "&submult;"],
		[0, "&supmult;"],
		[0, "&subedot;"],
		[0, "&supedot;"],
		[0, {
			v: "&subE;",
			n: 824,
			o: "&nsubE;"
		}],
		[0, {
			v: "&supE;",
			n: 824,
			o: "&nsupE;"
		}],
		[0, "&subsim;"],
		[0, "&supsim;"],
		[2, {
			v: "&subnE;",
			n: 65024,
			o: "&varsubsetneqq;"
		}],
		[0, {
			v: "&supnE;",
			n: 65024,
			o: "&varsupsetneqq;"
		}],
		[2, "&csub;"],
		[0, "&csup;"],
		[0, "&csube;"],
		[0, "&csupe;"],
		[0, "&subsup;"],
		[0, "&supsub;"],
		[0, "&subsub;"],
		[0, "&supsup;"],
		[0, "&suphsub;"],
		[0, "&supdsub;"],
		[0, "&forkv;"],
		[0, "&topfork;"],
		[0, "&mlcp;"],
		[8, "&Dashv;"],
		[1, "&Vdashl;"],
		[0, "&Barv;"],
		[0, "&vBar;"],
		[0, "&vBarv;"],
		[1, "&Vbar;"],
		[0, "&Not;"],
		[0, "&bNot;"],
		[0, "&rnmid;"],
		[0, "&cirmid;"],
		[0, "&midcir;"],
		[0, "&topcir;"],
		[0, "&nhpar;"],
		[0, "&parsim;"],
		[9, {
			v: "&parsl;",
			n: 8421,
			o: "&nparsl;"
		}],
		[44343, { n: new Map(/* #__PURE__ */ t([
			[56476, "&Ascr;"],
			[1, "&Cscr;"],
			[0, "&Dscr;"],
			[2, "&Gscr;"],
			[2, "&Jscr;"],
			[0, "&Kscr;"],
			[2, "&Nscr;"],
			[0, "&Oscr;"],
			[0, "&Pscr;"],
			[0, "&Qscr;"],
			[1, "&Sscr;"],
			[0, "&Tscr;"],
			[0, "&Uscr;"],
			[0, "&Vscr;"],
			[0, "&Wscr;"],
			[0, "&Xscr;"],
			[0, "&Yscr;"],
			[0, "&Zscr;"],
			[0, "&ascr;"],
			[0, "&bscr;"],
			[0, "&cscr;"],
			[0, "&dscr;"],
			[1, "&fscr;"],
			[1, "&hscr;"],
			[0, "&iscr;"],
			[0, "&jscr;"],
			[0, "&kscr;"],
			[0, "&lscr;"],
			[0, "&mscr;"],
			[0, "&nscr;"],
			[1, "&pscr;"],
			[0, "&qscr;"],
			[0, "&rscr;"],
			[0, "&sscr;"],
			[0, "&tscr;"],
			[0, "&uscr;"],
			[0, "&vscr;"],
			[0, "&wscr;"],
			[0, "&xscr;"],
			[0, "&yscr;"],
			[0, "&zscr;"],
			[52, "&Afr;"],
			[0, "&Bfr;"],
			[1, "&Dfr;"],
			[0, "&Efr;"],
			[0, "&Ffr;"],
			[0, "&Gfr;"],
			[2, "&Jfr;"],
			[0, "&Kfr;"],
			[0, "&Lfr;"],
			[0, "&Mfr;"],
			[0, "&Nfr;"],
			[0, "&Ofr;"],
			[0, "&Pfr;"],
			[0, "&Qfr;"],
			[1, "&Sfr;"],
			[0, "&Tfr;"],
			[0, "&Ufr;"],
			[0, "&Vfr;"],
			[0, "&Wfr;"],
			[0, "&Xfr;"],
			[0, "&Yfr;"],
			[1, "&afr;"],
			[0, "&bfr;"],
			[0, "&cfr;"],
			[0, "&dfr;"],
			[0, "&efr;"],
			[0, "&ffr;"],
			[0, "&gfr;"],
			[0, "&hfr;"],
			[0, "&ifr;"],
			[0, "&jfr;"],
			[0, "&kfr;"],
			[0, "&lfr;"],
			[0, "&mfr;"],
			[0, "&nfr;"],
			[0, "&ofr;"],
			[0, "&pfr;"],
			[0, "&qfr;"],
			[0, "&rfr;"],
			[0, "&sfr;"],
			[0, "&tfr;"],
			[0, "&ufr;"],
			[0, "&vfr;"],
			[0, "&wfr;"],
			[0, "&xfr;"],
			[0, "&yfr;"],
			[0, "&zfr;"],
			[0, "&Aopf;"],
			[0, "&Bopf;"],
			[1, "&Dopf;"],
			[0, "&Eopf;"],
			[0, "&Fopf;"],
			[0, "&Gopf;"],
			[1, "&Iopf;"],
			[0, "&Jopf;"],
			[0, "&Kopf;"],
			[0, "&Lopf;"],
			[0, "&Mopf;"],
			[1, "&Oopf;"],
			[3, "&Sopf;"],
			[0, "&Topf;"],
			[0, "&Uopf;"],
			[0, "&Vopf;"],
			[0, "&Wopf;"],
			[0, "&Xopf;"],
			[0, "&Yopf;"],
			[1, "&aopf;"],
			[0, "&bopf;"],
			[0, "&copf;"],
			[0, "&dopf;"],
			[0, "&eopf;"],
			[0, "&fopf;"],
			[0, "&gopf;"],
			[0, "&hopf;"],
			[0, "&iopf;"],
			[0, "&jopf;"],
			[0, "&kopf;"],
			[0, "&lopf;"],
			[0, "&mopf;"],
			[0, "&nopf;"],
			[0, "&oopf;"],
			[0, "&popf;"],
			[0, "&qopf;"],
			[0, "&ropf;"],
			[0, "&sopf;"],
			[0, "&topf;"],
			[0, "&uopf;"],
			[0, "&vopf;"],
			[0, "&wopf;"],
			[0, "&xopf;"],
			[0, "&yopf;"],
			[0, "&zopf;"]
		])) }],
		[8906, "&fflig;"],
		[0, "&filig;"],
		[0, "&fllig;"],
		[0, "&ffilig;"],
		[0, "&ffllig;"]
	]));
})), Kc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.getCodePoint = e.xmlReplacer = void 0, e.xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
	var t = /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[39, "&apos;"],
		[60, "&lt;"],
		[62, "&gt;"]
	]);
	e.getCodePoint = String.prototype.codePointAt == null ? function(e, t) {
		return (e.charCodeAt(t) & 64512) == 55296 ? (e.charCodeAt(t) - 55296) * 1024 + e.charCodeAt(t + 1) - 56320 + 65536 : e.charCodeAt(t);
	} : function(e, t) {
		return e.codePointAt(t);
	};
	function n(n) {
		for (var r = "", i = 0, a; (a = e.xmlReplacer.exec(n)) !== null;) {
			var o = a.index, s = n.charCodeAt(o), c = t.get(s);
			c === void 0 ? (r += `${n.substring(i, o)}&#x${(0, e.getCodePoint)(n, o).toString(16)};`, i = e.xmlReplacer.lastIndex += Number((s & 64512) == 55296)) : (r += n.substring(i, o) + c, i = o + 1);
		}
		return r + n.substr(i);
	}
	e.encodeXML = n, e.escape = n;
	function r(e, t) {
		return function(n) {
			for (var r, i = 0, a = ""; r = e.exec(n);) i !== r.index && (a += n.substring(i, r.index)), a += t.get(r[0].charCodeAt(0)), i = r.index + 1;
			return a + n.substring(i);
		};
	}
	e.escapeUTF8 = r(/[&<>'"]/g, t), e.escapeAttribute = r(/["&\u00A0]/g, /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[160, "&nbsp;"]
	])), e.escapeText = r(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
		[38, "&amp;"],
		[60, "&lt;"],
		[62, "&gt;"],
		[160, "&nbsp;"]
	]));
})), qc = /* @__PURE__ */ r(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.encodeNonAsciiHTML = e.encodeHTML = void 0;
	var n = t(Gc()), r = Kc(), i = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
	function a(e) {
		return s(i, e);
	}
	e.encodeHTML = a;
	function o(e) {
		return s(r.xmlReplacer, e);
	}
	e.encodeNonAsciiHTML = o;
	function s(e, t) {
		for (var i = "", a = 0, o; (o = e.exec(t)) !== null;) {
			var s = o.index;
			i += t.substring(a, s);
			var c = t.charCodeAt(s), l = n.default.get(c);
			if (typeof l == "object") {
				if (s + 1 < t.length) {
					var u = t.charCodeAt(s + 1), d = typeof l.n == "number" ? l.n === u ? l.o : void 0 : l.n.get(u);
					if (d !== void 0) {
						i += d, a = e.lastIndex += 1;
						continue;
					}
				}
				l = l.v;
			}
			if (l !== void 0) i += l, a = s + 1;
			else {
				var f = (0, r.getCodePoint)(t, s);
				i += `&#x${f.toString(16)};`, a = e.lastIndex += Number(f !== c);
			}
		}
		return i + t.substr(a);
	}
})), Jc = /* @__PURE__ */ r(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXMLStrict = e.decodeHTML5Strict = e.decodeHTML4Strict = e.decodeHTML5 = e.decodeHTML4 = e.decodeHTMLAttribute = e.decodeHTMLStrict = e.decodeHTML = e.decodeXML = e.DecodingMode = e.EntityDecoder = e.encodeHTML5 = e.encodeHTML4 = e.encodeNonAsciiHTML = e.encodeHTML = e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.encode = e.decodeStrict = e.decode = e.EncodingMode = e.EntityLevel = void 0;
	var t = Wc(), n = qc(), r = Kc(), i;
	(function(e) {
		e[e.XML = 0] = "XML", e[e.HTML = 1] = "HTML";
	})(i = e.EntityLevel ||= {});
	var a;
	(function(e) {
		e[e.UTF8 = 0] = "UTF8", e[e.ASCII = 1] = "ASCII", e[e.Extensive = 2] = "Extensive", e[e.Attribute = 3] = "Attribute", e[e.Text = 4] = "Text";
	})(a = e.EncodingMode ||= {});
	function o(e, n) {
		if (n === void 0 && (n = i.XML), (typeof n == "number" ? n : n.level) === i.HTML) {
			var r = typeof n == "object" ? n.mode : void 0;
			return (0, t.decodeHTML)(e, r);
		}
		return (0, t.decodeXML)(e);
	}
	e.decode = o;
	function s(e, n) {
		n === void 0 && (n = i.XML);
		var r = typeof n == "number" ? { level: n } : n;
		return r.mode ??= t.DecodingMode.Strict, o(e, r);
	}
	e.decodeStrict = s;
	function c(e, t) {
		t === void 0 && (t = i.XML);
		var o = typeof t == "number" ? { level: t } : t;
		return o.mode === a.UTF8 ? (0, r.escapeUTF8)(e) : o.mode === a.Attribute ? (0, r.escapeAttribute)(e) : o.mode === a.Text ? (0, r.escapeText)(e) : o.level === i.HTML ? o.mode === a.ASCII ? (0, n.encodeNonAsciiHTML)(e) : (0, n.encodeHTML)(e) : (0, r.encodeXML)(e);
	}
	e.encode = c;
	var l = Kc();
	Object.defineProperty(e, "encodeXML", {
		enumerable: !0,
		get: function() {
			return l.encodeXML;
		}
	}), Object.defineProperty(e, "escape", {
		enumerable: !0,
		get: function() {
			return l.escape;
		}
	}), Object.defineProperty(e, "escapeUTF8", {
		enumerable: !0,
		get: function() {
			return l.escapeUTF8;
		}
	}), Object.defineProperty(e, "escapeAttribute", {
		enumerable: !0,
		get: function() {
			return l.escapeAttribute;
		}
	}), Object.defineProperty(e, "escapeText", {
		enumerable: !0,
		get: function() {
			return l.escapeText;
		}
	});
	var u = qc();
	Object.defineProperty(e, "encodeHTML", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeNonAsciiHTML", {
		enumerable: !0,
		get: function() {
			return u.encodeNonAsciiHTML;
		}
	}), Object.defineProperty(e, "encodeHTML4", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeHTML5", {
		enumerable: !0,
		get: function() {
			return u.encodeHTML;
		}
	});
	var d = Wc();
	Object.defineProperty(e, "EntityDecoder", {
		enumerable: !0,
		get: function() {
			return d.EntityDecoder;
		}
	}), Object.defineProperty(e, "DecodingMode", {
		enumerable: !0,
		get: function() {
			return d.DecodingMode;
		}
	}), Object.defineProperty(e, "decodeXML", {
		enumerable: !0,
		get: function() {
			return d.decodeXML;
		}
	}), Object.defineProperty(e, "decodeHTML", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTMLStrict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTMLAttribute", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLAttribute;
		}
	}), Object.defineProperty(e, "decodeHTML4", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML5", {
		enumerable: !0,
		get: function() {
			return d.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML4Strict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTML5Strict", {
		enumerable: !0,
		get: function() {
			return d.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeXMLStrict", {
		enumerable: !0,
		get: function() {
			return d.decodeXML;
		}
	});
})), Yc = /* @__PURE__ */ r(((e, t) => {
	var n = Bc();
	function r(e) {
		let t = {};
		e ||= {}, t.src_Any = n.Any.source, t.src_Cc = n.Cc.source, t.src_Z = n.Z.source, t.src_P = n.P.source, t.src_ZPCc = [
			t.src_Z,
			t.src_P,
			t.src_Cc
		].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
		let r = "[><｜]";
		return t.src_pseudo_letter = `(?:(?!${r}|${t.src_ZPCc})${t.src_Any})`, t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = `(?=$|${r}|${t.src_ZPCc})(?!${e["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`, t.src_path = `(?:[/?#](?:(?!${t.src_ZCc}|${r}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`, t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + `|${t.src_pseudo_letter}{1,63})`, t.src_domain = "(?:" + t.src_xn + `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`, t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`, t.tpl_host_fuzzy = "(?:" + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`, t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`, t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`, t.tpl_email_fuzzy = `(^|${r}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`, t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`, t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`, t;
	}
	function i(e) {
		return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
			t && Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}), e;
	}
	function a(e) {
		return Object.prototype.toString.call(e);
	}
	function o(e) {
		return a(e) === "[object String]";
	}
	function s(e) {
		return a(e) === "[object Object]";
	}
	function c(e) {
		return a(e) === "[object RegExp]";
	}
	function l(e) {
		return a(e) === "[object Function]";
	}
	function u(e) {
		return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
	var d = {
		fuzzyLink: !0,
		fuzzyEmail: !0,
		fuzzyIP: !1
	};
	function f(e) {
		return Object.keys(e || {}).reduce(function(e, t) {
			return e || d.hasOwnProperty(t);
		}, !1);
	}
	var p = {
		"http:": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.http || (n.re.http = RegExp(`^\\/\\/${n.re.src_auth}${n.re.src_host_port_strict}${n.re.src_path}`, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
		} },
		"https:": "http:",
		"ftp:": "http:",
		"//": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.no_http || (n.re.no_http = RegExp("^" + n.re.src_auth + `(?:localhost|(?:(?:${n.re.src_domain})\\.)+${n.re.src_domain_root})` + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
		} },
		"mailto:": { validate: function(e, t, n) {
			let r = e.slice(t);
			return n.re.mailto || (n.re.mailto = RegExp(`^${n.re.src_email_name}@${n.re.src_host_strict}`, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
		} }
	}, m = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", h = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
	function g(e) {
		return function(t, n) {
			let r = t.slice(n);
			return e.test(r) ? r.match(e)[0].length : 0;
		};
	}
	function _() {
		return function(e, t) {
			t.normalize(e);
		};
	}
	function v(e) {
		let t = e.re = r(e.__opts__), n = e.__tlds__.slice();
		e.onCompile(), e.__tlds_replaced__ || n.push(m), n.push(t.src_xn), t.src_tlds = n.join("|");
		function i(e) {
			return e.replace("%TLDS%", t.src_tlds);
		}
		t.email_fuzzy = RegExp(i(t.tpl_email_fuzzy), "i"), t.email_fuzzy_global = RegExp(i(t.tpl_email_fuzzy), "ig"), t.link_fuzzy = RegExp(i(t.tpl_link_fuzzy), "i"), t.link_fuzzy_global = RegExp(i(t.tpl_link_fuzzy), "ig"), t.link_no_ip_fuzzy = RegExp(i(t.tpl_link_no_ip_fuzzy), "i"), t.link_no_ip_fuzzy_global = RegExp(i(t.tpl_link_no_ip_fuzzy), "ig"), t.host_fuzzy_test = RegExp(i(t.tpl_host_fuzzy_test), "i");
		let a = [];
		e.__compiled__ = {};
		function d(e, t) {
			throw Error(`(LinkifyIt) Invalid schema "${e}": ${t}`);
		}
		Object.keys(e.__schemas__).forEach(function(t) {
			let n = e.__schemas__[t];
			if (n === null) return;
			let r = {
				validate: null,
				link: null
			};
			if (e.__compiled__[t] = r, s(n)) {
				c(n.validate) ? r.validate = g(n.validate) : l(n.validate) ? r.validate = n.validate : d(t, n), l(n.normalize) ? r.normalize = n.normalize : n.normalize ? d(t, n) : r.normalize = _();
				return;
			}
			if (o(n)) {
				a.push(t);
				return;
			}
			d(t, n);
		}), a.forEach(function(t) {
			e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
		}), e.__compiled__[""] = {
			validate: null,
			normalize: _()
		};
		let f = Object.keys(e.__compiled__).filter(function(t) {
			return t.length > 0 && e.__compiled__[t];
		}).map(u).join("|");
		e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${f})`, "i"), e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${f})`, "ig"), e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, "i"), e.re.pretest = RegExp(`(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`, "i");
	}
	function y(e, t, n, r) {
		let i = e.slice(n, r);
		this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
	}
	function b(e, t) {
		if (!(this instanceof b)) return new b(e, t);
		t || f(e) && (t = e, e = {}), this.__opts__ = i({}, d, t), this.__schemas__ = i({}, p, e), this.__compiled__ = {}, this.__tlds__ = h, this.__tlds_replaced__ = !1, this.re = {}, v(this);
	}
	b.prototype.add = function(e, t) {
		return this.__schemas__[e] = t, v(this), this;
	}, b.prototype.set = function(e) {
		return this.__opts__ = i(this.__opts__, e), this;
	}, b.prototype.test = function(e) {
		if (!e.length) return !1;
		let t, n;
		if (this.re.schema_test.test(e)) {
			for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
		}
		return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
	}, b.prototype.pretest = function(e) {
		return this.re.pretest.test(e);
	}, b.prototype.testSchemaAt = function(e, t, n) {
		return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
	}, b.prototype.match = function(e) {
		let t = [], n = [], r = [], i = [], a, o, s;
		function c(e, t) {
			return e ? t ? e.index === t.index ? e.lastIndex >= t.lastIndex ? e : t : e.index < t.index ? e : t : e : t;
		}
		if (!e.length) return null;
		if (this.re.schema_test.test(e)) for (s = this.re.schema_search, s.lastIndex = 0; (a = s.exec(e)) !== null;) o = this.testSchemaAt(e, a[2], s.lastIndex), o && n.push({
			schema: a[2],
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length + o
		});
		if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) for (s = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) r.push({
			schema: "",
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length
		});
		if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) for (s = this.re.email_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;) i.push({
			schema: "mailto:",
			index: a.index + a[1].length,
			lastIndex: a.index + a[0].length
		});
		let l = [
			0,
			0,
			0
		], u = 0;
		for (;;) {
			let a = [
				n[l[0]],
				i[l[1]],
				r[l[2]]
			], o = c(c(a[0], a[1]), a[2]);
			if (!o) break;
			if (o === a[0] ? l[0]++ : o === a[1] ? l[1]++ : l[2]++, o.index < u) continue;
			let s = new y(e, o.schema, o.index, o.lastIndex);
			this.__compiled__[s.schema].normalize(s, this), t.push(s), u = o.lastIndex;
		}
		return t.length ? t : null;
	}, b.prototype.matchAtStart = function(e) {
		if (!e.length) return null;
		let t = this.re.schema_at_start.exec(e);
		if (!t) return null;
		let n = this.testSchemaAt(e, t[2], t[0].length);
		if (!n) return null;
		let r = new y(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
		return this.__compiled__[r.schema].normalize(r, this), r;
	}, b.prototype.tlds = function(e, t) {
		return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
			return e !== n[t - 1];
		}).reverse(), v(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, v(this), this);
	}, b.prototype.normalize = function(e) {
		e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
	}, b.prototype.onCompile = function() {}, t.exports = b;
})), Xc = /* @__PURE__ */ r(((t, n) => {
	var r = Object.create, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyNames, s = Object.getPrototypeOf, c = Object.prototype.hasOwnProperty, l = (e, t) => {
		let n = {};
		for (var r in e) i(n, r, {
			get: e[r],
			enumerable: !0
		});
		return t || i(n, Symbol.toStringTag, { value: "Module" }), n;
	}, u = (e, t, n, r) => {
		if (t && typeof t == "object" || typeof t == "function") for (var s = o(t), l = 0, u = s.length, d; l < u; l++) d = s[l], !c.call(e, d) && d !== n && i(e, d, {
			get: ((e) => t[e]).bind(null, d),
			enumerable: !(r = a(t, d)) || r.enumerable
		});
		return e;
	}, d = (e, t, n) => (n = e == null ? {} : r(s(e)), u(t || !e || !e.__esModule ? i(n, "default", {
		value: e,
		enumerable: !0
	}) : n, e)), f = zc();
	f = d(f, 1);
	var p = Bc();
	p = d(p, 1);
	var m = Jc(), h = Yc();
	h = d(h, 1);
	var g = (gc(), e(Bs));
	g = d(g, 1);
	var _ = /* @__PURE__ */ l({
		arrayReplaceAt: () => C,
		asciiTrim: () => me,
		assign: () => S,
		escapeHtml: () => O,
		escapeRE: () => le,
		fromCodePoint: () => T,
		has: () => x,
		isMdAsciiPunct: () => de,
		isPunctChar: () => ue,
		isPunctCharCode: () => j,
		isSpace: () => k,
		isString: () => y,
		isValidEntityCode: () => w,
		isWhiteSpace: () => A,
		lib: () => he,
		normalizeReference: () => fe,
		unescapeAll: () => D,
		unescapeMd: () => re
	});
	function v(e) {
		return Object.prototype.toString.call(e);
	}
	function y(e) {
		return v(e) === "[object String]";
	}
	var b = Object.prototype.hasOwnProperty;
	function x(e, t) {
		return b.call(e, t);
	}
	function S(e) {
		return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
			if (t) {
				if (typeof t != "object") throw TypeError(t + "must be object");
				Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}
		}), e;
	}
	function C(e, t, n) {
		return [].concat(e.slice(0, t), n, e.slice(t + 1));
	}
	function w(e) {
		return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
	}
	function T(e) {
		if (e > 65535) {
			e -= 65536;
			let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
			return String.fromCharCode(t, n);
		}
		return String.fromCharCode(e);
	}
	var E = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, ee = RegExp(E.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), te = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
	function ne(e, t) {
		if (t.charCodeAt(0) === 35 && te.test(t)) {
			let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
			return w(n) ? T(n) : e;
		}
		let n = (0, m.decodeHTML)(e);
		return n === e ? e : n;
	}
	function re(e) {
		return e.indexOf("\\") < 0 ? e : e.replace(E, "$1");
	}
	function D(e) {
		return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(ee, function(e, t, n) {
			return t || ne(e, n);
		});
	}
	var ie = /[&<>"]/, ae = /[&<>"]/g, oe = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function se(e) {
		return oe[e];
	}
	function O(e) {
		return ie.test(e) ? e.replace(ae, se) : e;
	}
	var ce = /[.?*+^$[\]\\(){}|-]/g;
	function le(e) {
		return e.replace(ce, "\\$&");
	}
	function k(e) {
		switch (e) {
			case 9:
			case 32: return !0;
		}
		return !1;
	}
	function A(e) {
		if (e >= 8192 && e <= 8202) return !0;
		switch (e) {
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 32:
			case 160:
			case 5760:
			case 8239:
			case 8287:
			case 12288: return !0;
		}
		return !1;
	}
	function ue(e) {
		return p.P.test(e) || p.S.test(e);
	}
	function j(e) {
		return ue(T(e));
	}
	function de(e) {
		switch (e) {
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
			case 46:
			case 47:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 124:
			case 125:
			case 126: return !0;
			default: return !1;
		}
	}
	function fe(e) {
		return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
	}
	function pe(e) {
		return e === 32 || e === 9 || e === 10 || e === 13;
	}
	function me(e) {
		let t = 0;
		for (; t < e.length && pe(e.charCodeAt(t)); t++);
		let n = e.length - 1;
		for (; n >= t && pe(e.charCodeAt(n)); n--);
		return e.slice(t, n + 1);
	}
	var he = {
		mdurl: f,
		ucmicro: p
	};
	function M(e, t, n) {
		let r, i, a, o, s = e.posMax, c = e.pos;
		for (e.pos = t + 1, r = 1; e.pos < s;) {
			if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
				i = !0;
				break;
			}
			if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
				if (o === e.pos - 1) r++;
				else if (n) return e.pos = c, -1;
			}
		}
		let l = -1;
		return i && (l = e.pos), e.pos = c, l;
	}
	function ge(e, t, n) {
		let r, i = t, a = {
			ok: !1,
			pos: 0,
			str: ""
		};
		if (e.charCodeAt(i) === 60) {
			for (i++; i < n;) {
				if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
				if (r === 62) return a.pos = i + 1, a.str = D(e.slice(t + 1, i)), a.ok = !0, a;
				if (r === 92 && i + 1 < n) {
					i += 2;
					continue;
				}
				i++;
			}
			return a;
		}
		let o = 0;
		for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
			if (r === 92 && i + 1 < n) {
				if (e.charCodeAt(i + 1) === 32) break;
				i += 2;
				continue;
			}
			if (r === 40 && (o++, o > 32)) return a;
			if (r === 41) {
				if (o === 0) break;
				o--;
			}
			i++;
		}
		return t === i || o !== 0 ? a : (a.str = D(e.slice(t, i)), a.pos = i, a.ok = !0, a);
	}
	function _e(e, t, n, r) {
		let i, a = t, o = {
			ok: !1,
			can_continue: !1,
			pos: 0,
			str: "",
			marker: 0
		};
		if (r) o.str = r.str, o.marker = r.marker;
		else {
			if (a >= n) return o;
			let r = e.charCodeAt(a);
			if (r !== 34 && r !== 39 && r !== 40) return o;
			t++, a++, r === 40 && (r = 41), o.marker = r;
		}
		for (; a < n;) {
			if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += D(e.slice(t, a)), o.ok = !0, o;
			if (i === 40 && o.marker === 41) return o;
			i === 92 && a + 1 < n && a++, a++;
		}
		return o.can_continue = !0, o.str += D(e.slice(t, a)), o;
	}
	var ve = /* @__PURE__ */ l({
		parseLinkDestination: () => ge,
		parseLinkLabel: () => M,
		parseLinkTitle: () => _e
	}), N = {};
	N.code_inline = function(e, t, n, r, i) {
		let a = e[t];
		return "<code" + i.renderAttrs(a) + ">" + O(a.content) + "</code>";
	}, N.code_block = function(e, t, n, r, i) {
		let a = e[t];
		return "<pre" + i.renderAttrs(a) + "><code>" + O(e[t].content) + "</code></pre>\n";
	}, N.fence = function(e, t, n, r, i) {
		let a = e[t], o = a.info ? D(a.info).trim() : "", s = "", c = "";
		if (o) {
			let e = o.split(/(\s+)/g);
			s = e[0], c = e.slice(2).join("");
		}
		let l;
		if (l = n.highlight && n.highlight(a.content, s, c) || O(a.content), l.indexOf("<pre") === 0) return l + "\n";
		if (o) {
			let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
			e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
			let r = { attrs: t };
			return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
		}
		return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
	}, N.image = function(e, t, n, r, i) {
		let a = e[t];
		return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
	}, N.hardbreak = function(e, t, n) {
		return n.xhtmlOut ? "<br />\n" : "<br>\n";
	}, N.softbreak = function(e, t, n) {
		return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
	}, N.text = function(e, t) {
		return O(e[t].content);
	}, N.html_block = function(e, t) {
		return e[t].content;
	}, N.html_inline = function(e, t) {
		return e[t].content;
	};
	function P() {
		this.rules = S({}, N);
	}
	P.prototype.renderAttrs = function(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + O(e.attrs[t][0]) + "=\"" + O(e.attrs[t][1]) + "\"";
		return r;
	}, P.prototype.renderToken = function(e, t, n) {
		let r = e[t], i = "";
		if (r.hidden) return "";
		r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
		let a = !1;
		if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
			let n = e[t + 1];
			(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
		}
		return i += a ? ">\n" : ">", i;
	}, P.prototype.renderInline = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
		}
		return r;
	}, P.prototype.renderInlineAsText = function(e, t, n) {
		let r = "";
		for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
			case "text":
				r += e[i].content;
				break;
			case "image":
				r += this.renderInlineAsText(e[i].children, t, n);
				break;
			case "html_inline":
			case "html_block":
				r += e[i].content;
				break;
			case "softbreak":
			case "hardbreak":
				r += "\n";
				break;
			default:
		}
		return r;
	}, P.prototype.render = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
		}
		return r;
	};
	function F() {
		this.__rules__ = [], this.__cache__ = null;
	}
	F.prototype.__find__ = function(e) {
		for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
		return -1;
	}, F.prototype.__compile__ = function() {
		let e = this, t = [""];
		e.__rules__.forEach(function(e) {
			e.enabled && e.alt.forEach(function(e) {
				t.indexOf(e) < 0 && t.push(e);
			});
		}), e.__cache__ = {}, t.forEach(function(t) {
			e.__cache__[t] = [], e.__rules__.forEach(function(n) {
				n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));
			});
		});
	}, F.prototype.at = function(e, t, n) {
		let r = this.__find__(e), i = n || {};
		if (r === -1) throw Error("Parser rule not found: " + e);
		this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
	}, F.prototype.before = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, F.prototype.after = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i + 1, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, F.prototype.push = function(e, t, n) {
		let r = n || {};
		this.__rules__.push({
			name: e,
			enabled: !0,
			fn: t,
			alt: r.alt || []
		}), this.__cache__ = null;
	}, F.prototype.enable = function(e, t) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach(function(e) {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error("Rules manager: invalid rule name " + e);
			}
			this.__rules__[r].enabled = !0, n.push(e);
		}, this), this.__cache__ = null, n;
	}, F.prototype.enableOnly = function(e, t) {
		Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
			e.enabled = !1;
		}), this.enable(e, t);
	}, F.prototype.disable = function(e, t) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach(function(e) {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error("Rules manager: invalid rule name " + e);
			}
			this.__rules__[r].enabled = !1, n.push(e);
		}, this), this.__cache__ = null, n;
	}, F.prototype.getRules = function(e) {
		return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
	};
	function I(e, t, n) {
		this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
	}
	I.prototype.attrIndex = function(e) {
		if (!this.attrs) return -1;
		let t = this.attrs;
		for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
		return -1;
	}, I.prototype.attrPush = function(e) {
		this.attrs ? this.attrs.push(e) : this.attrs = [e];
	}, I.prototype.attrSet = function(e, t) {
		let n = this.attrIndex(e), r = [e, t];
		n < 0 ? this.attrPush(r) : this.attrs[n] = r;
	}, I.prototype.attrGet = function(e) {
		let t = this.attrIndex(e), n = null;
		return t >= 0 && (n = this.attrs[t][1]), n;
	}, I.prototype.attrJoin = function(e, t) {
		let n = this.attrIndex(e);
		n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
	};
	function L(e, t, n) {
		this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
	}
	L.prototype.Token = I;
	var ye = /\r\n?|\n/g, be = /\0/g;
	function xe(e) {
		let t;
		t = e.src.replace(ye, "\n"), t = t.replace(be, "�"), e.src = t;
	}
	function Se(e) {
		let t;
		e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
	}
	function Ce(e) {
		let t = e.tokens;
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
		}
	}
	function we(e) {
		return /^<a[>\s]/i.test(e);
	}
	function Te(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Ee(e) {
		let t = e.tokens;
		if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
			if (t[n].type !== "inline" || !e.md.linkify.pretest(t[n].content)) continue;
			let r = t[n].children, i = 0;
			for (let a = r.length - 1; a >= 0; a--) {
				let o = r[a];
				if (o.type === "link_close") {
					for (a--; r[a].level !== o.level && r[a].type !== "link_open";) a--;
					continue;
				}
				if (o.type === "html_inline" && (we(o.content) && i > 0 && i--, Te(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
					let i = o.content, s = e.md.linkify.match(i), c = [], l = o.level, u = 0;
					s.length > 0 && s[0].index === 0 && a > 0 && r[a - 1].type === "text_special" && (s = s.slice(1));
					for (let t = 0; t < s.length; t++) {
						let n = s[t].url, r = e.md.normalizeLink(n);
						if (!e.md.validateLink(r)) continue;
						let a = s[t].text;
						a = s[t].schema ? s[t].schema === "mailto:" && !/^mailto:/i.test(a) ? e.md.normalizeLinkText("mailto:" + a).replace(/^mailto:/, "") : e.md.normalizeLinkText(a) : e.md.normalizeLinkText("http://" + a).replace(/^http:\/\//, "");
						let o = s[t].index;
						if (o > u) {
							let t = new e.Token("text", "", 0);
							t.content = i.slice(u, o), t.level = l, c.push(t);
						}
						let d = new e.Token("link_open", "a", 1);
						d.attrs = [["href", r]], d.level = l++, d.markup = "linkify", d.info = "auto", c.push(d);
						let f = new e.Token("text", "", 0);
						f.content = a, f.level = l, c.push(f);
						let p = new e.Token("link_close", "a", -1);
						p.level = --l, p.markup = "linkify", p.info = "auto", c.push(p), u = s[t].lastIndex;
					}
					if (u < i.length) {
						let t = new e.Token("text", "", 0);
						t.content = i.slice(u), t.level = l, c.push(t);
					}
					t[n].children = r = C(r, a, c);
				}
			}
		}
	}
	var De = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Oe = /\((c|tm|r)\)/i, ke = /\((c|tm|r)\)/gi, Ae = {
		c: "©",
		r: "®",
		tm: "™"
	};
	function je(e, t) {
		return Ae[t.toLowerCase()];
	}
	function Me(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && (r.content = r.content.replace(ke, je)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Ne(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && De.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Pe(e) {
		let t;
		if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (Oe.test(e.tokens[t].content) && Me(e.tokens[t].children), De.test(e.tokens[t].content) && Ne(e.tokens[t].children));
	}
	var Fe = /['"]/, Ie = /['"]/g, Le = "’";
	function Re(e, t, n, r) {
		e[t] || (e[t] = []), e[t].push({
			pos: n,
			ch: r
		});
	}
	function ze(e, t) {
		let n = "", r = 0;
		t.sort((e, t) => e.pos - t.pos);
		for (let i = 0; i < t.length; i++) {
			let a = t[i];
			n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
		}
		return n + e.slice(r);
	}
	function Be(e, t) {
		let n, r = [], i = {};
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = e[a].level;
			for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
			if (r.length = n + 1, o.type !== "text") continue;
			let c = o.content, l = 0, u = c.length;
			OUTER: for (; l < u;) {
				Ie.lastIndex = l;
				let o = Ie.exec(c);
				if (!o) break;
				let d = !0, f = !0;
				l = o.index + 1;
				let p = o[0] === "'", m = 32;
				if (o.index - 1 >= 0) m = c.charCodeAt(o.index - 1);
				else for (n = a - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--) if (e[n].content) {
					m = e[n].content.charCodeAt(e[n].content.length - 1);
					break;
				}
				let h = 32;
				if (l < u) h = c.charCodeAt(l);
				else for (n = a + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++) if (e[n].content) {
					h = e[n].content.charCodeAt(0);
					break;
				}
				let g = de(m) || j(m), _ = de(h) || j(h), v = A(m), y = A(h);
				if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
					p && Re(i, a, o.index, Le);
					continue;
				}
				if (f) for (n = r.length - 1; n >= 0; n--) {
					let e = r[n];
					if (r[n].level < s) break;
					if (e.single === p && r[n].level === s) {
						e = r[n];
						let s, c;
						p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), Re(i, a, o.index, c), Re(i, e.token, e.pos, s), r.length = n;
						continue OUTER;
					}
				}
				d ? r.push({
					token: a,
					pos: o.index,
					single: p,
					level: s
				}) : f && p && Re(i, a, o.index, Le);
			}
		}
		Object.keys(i).forEach(function(t) {
			e[t].content = ze(e[t].content, i[t]);
		});
	}
	function Ve(e) {
		if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !Fe.test(e.tokens[t].content) || Be(e.tokens[t].children, e);
	}
	function He(e) {
		let t, n, r = e.tokens, i = r.length;
		for (let e = 0; e < i; e++) {
			if (r[e].type !== "inline") continue;
			let i = r[e].children, a = i.length;
			for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
			for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
			t !== n && (i.length = n);
		}
	}
	var Ue = [
		["normalize", xe],
		["block", Se],
		["inline", Ce],
		["linkify", Ee],
		["replacements", Pe],
		["smartquotes", Ve],
		["text_join", He]
	];
	function R() {
		this.ruler = new F();
		for (let e = 0; e < Ue.length; e++) this.ruler.push(Ue[e][0], Ue[e][1]);
	}
	R.prototype.process = function(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}, R.prototype.State = L;
	function z(e, t, n, r) {
		this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) if (k(s)) {
				n++, s === 9 ? r += 4 - r % 4 : r++;
				continue;
			} else o = !0;
			(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
		}
		this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
	}
	z.prototype.push = function(e, t, n) {
		let r = new I(e, t, n);
		return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
	}, z.prototype.isEmpty = function(e) {
		return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
	}, z.prototype.skipEmptyLines = function(e) {
		for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
		return e;
	}, z.prototype.skipSpaces = function(e) {
		for (let t = this.src.length; e < t && k(this.src.charCodeAt(e)); e++);
		return e;
	}, z.prototype.skipSpacesBack = function(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!k(this.src.charCodeAt(--e))) return e + 1;
		return e;
	}, z.prototype.skipChars = function(e, t) {
		for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
		return e;
	}, z.prototype.skipCharsBack = function(e, t, n) {
		if (e <= n) return e;
		for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
		return e;
	}, z.prototype.getLines = function(e, t, n, r) {
		if (e >= t) return "";
		let i = Array(t - e);
		for (let a = 0, o = e; o < t; o++, a++) {
			let e = 0, s = this.bMarks[o], c = s, l;
			for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
				let t = this.src.charCodeAt(c);
				if (k(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}, z.prototype.Token = I;
	var We = 65536;
	function B(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
		return e.src.slice(n, r);
	}
	function Ge(e) {
		let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
		for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
		return t.push(s + e.substring(o)), t;
	}
	function Ke(e, t, n, r) {
		if (t + 2 > n) return !1;
		let i = t + 1;
		if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[i] + e.tShift[i];
		if (a >= e.eMarks[i]) return !1;
		let o = e.src.charCodeAt(a++);
		if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
		let s = e.src.charCodeAt(a++);
		if (s !== 124 && s !== 45 && s !== 58 && !k(s) || o === 45 && k(s)) return !1;
		for (; a < e.eMarks[i];) {
			let t = e.src.charCodeAt(a);
			if (t !== 124 && t !== 45 && t !== 58 && !k(t)) return !1;
			a++;
		}
		let c = B(e, t + 1), l = c.split("|"), u = [];
		for (let e = 0; e < l.length; e++) {
			let t = l[e].trim();
			if (!t) {
				if (e === 0 || e === l.length - 1) continue;
				return !1;
			}
			if (!/^:?-+:?$/.test(t)) return !1;
			t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
		}
		if (c = B(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
		l = Ge(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
		let d = l.length;
		if (d === 0 || d !== u.length) return !1;
		if (r) return !0;
		let f = e.parentType;
		e.parentType = "table";
		let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
		m.map = h;
		let g = e.push("thead_open", "thead", 1);
		g.map = [t, t + 1];
		let _ = e.push("tr_open", "tr", 1);
		_.map = [t, t + 1];
		for (let t = 0; t < l.length; t++) {
			let n = e.push("th_open", "th", 1);
			u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
			let r = e.push("inline", "", 0);
			r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
		}
		e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
		let v, y = 0;
		for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
			let r = !1;
			for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
				r = !0;
				break;
			}
			if (r || (c = B(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Ge(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > We)) break;
			if (i === t + 2) {
				let n = e.push("tbody_open", "tbody", 1);
				n.map = v = [t + 2, 0];
			}
			let a = e.push("tr_open", "tr", 1);
			a.map = [i, i + 1];
			for (let t = 0; t < d; t++) {
				let n = e.push("td_open", "td", 1);
				u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
				let r = e.push("inline", "", 0);
				r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
			}
			e.push("tr_close", "tr", -1);
		}
		return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
	}
	function qe(e, t, n) {
		if (e.sCount[t] - e.blkIndent < 4) return !1;
		let r = t + 1, i = r;
		for (; r < n;) {
			if (e.isEmpty(r)) {
				r++;
				continue;
			}
			if (e.sCount[r] - e.blkIndent >= 4) {
				r++, i = r;
				continue;
			}
			break;
		}
		e.line = i;
		let a = e.push("code_block", "code", 0);
		return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
	}
	function Je(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
		let o = e.src.charCodeAt(i);
		if (o !== 126 && o !== 96) return !1;
		let s = i;
		i = e.skipChars(i, o);
		let c = i - s;
		if (c < 3) return !1;
		let l = e.src.slice(s, i), u = e.src.slice(i, a);
		if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
		if (r) return !0;
		let d = t, f = !1;
		for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
			f = !0;
			break;
		}
		c = e.sCount[t], e.line = d + +!!f;
		let p = e.push("fence", "code", 0);
		return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
	}
	function Ye(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
		if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
		if (r) return !0;
		let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
		e.parentType = "blockquote";
		let p = !1, m;
		for (m = t; m < n; m++) {
			let t = e.sCount[m] < e.blkIndent;
			if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
			if (e.src.charCodeAt(i++) === 62 && !t) {
				let t = e.sCount[m] + 1, n, r;
				e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
				let o = t;
				for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
					let t = e.src.charCodeAt(i);
					if (k(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
					else break;
					i++;
				}
				p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
				continue;
			}
			if (p) break;
			let r = !1;
			for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
				r = !0;
				break;
			}
			if (r) {
				e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
				break;
			}
			s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
		}
		let h = e.blkIndent;
		e.blkIndent = 0;
		let g = e.push("blockquote_open", "blockquote", 1);
		g.markup = ">";
		let _ = [t, 0];
		g.map = _, e.md.block.tokenize(e, t, m);
		let v = e.push("blockquote_close", "blockquote", -1);
		v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
		for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
		return e.blkIndent = h, !0;
	}
	function Xe(e, t, n, r) {
		let i = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
		if (o !== 42 && o !== 45 && o !== 95) return !1;
		let s = 1;
		for (; a < i;) {
			let t = e.src.charCodeAt(a++);
			if (t !== o && !k(t)) return !1;
			t === o && s++;
		}
		if (s < 3) return !1;
		if (r) return !0;
		e.line = t + 1;
		let c = e.push("hr", "hr", 0);
		return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
	}
	function Ze(e, t) {
		let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
		return i !== 42 && i !== 45 && i !== 43 || r < n && !k(e.src.charCodeAt(r)) ? -1 : r;
	}
	function Qe(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
		if (i + 1 >= r) return -1;
		let a = e.src.charCodeAt(i++);
		if (a < 48 || a > 57) return -1;
		for (;;) {
			if (i >= r) return -1;
			if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
				if (i - n >= 10) return -1;
				continue;
			}
			if (a === 41 || a === 46) break;
			return -1;
		}
		return i < r && (a = e.src.charCodeAt(i), !k(a)) ? -1 : i;
	}
	function $e(e, t) {
		let n = e.level + 2;
		for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
	}
	function et(e, t, n, r) {
		let i, a, o, s, c = t, l = !0;
		if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
		let u = !1;
		r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
		let d, f, p;
		if ((p = Qe(e, c)) >= 0) {
			if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
		} else if ((p = Ze(e, c)) >= 0) d = !1;
		else return !1;
		if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
		if (r) return !0;
		let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
		d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
		let g = [c, 0];
		s.map = g, s.markup = String.fromCharCode(m);
		let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
		for (e.parentType = "list"; c < n;) {
			a = p, i = e.eMarks[c];
			let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
			for (; a < i;) {
				let t = e.src.charCodeAt(a);
				if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
				else if (t === 32) r++;
				else break;
				a++;
			}
			let u = a, f;
			f = u >= i ? 1 : r - t, f > 4 && (f = 1);
			let h = t + f;
			s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
			let g = [c, 0];
			s.map = g, d && (s.info = e.src.slice(o, p - 1));
			let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
			if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
			let C = !1;
			for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
				C = !0;
				break;
			}
			if (C) break;
			if (d) {
				if (p = Qe(e, c), p < 0) break;
				o = e.bMarks[c] + e.tShift[c];
			} else if (p = Ze(e, c), p < 0) break;
			if (m !== e.src.charCodeAt(p - 1)) break;
		}
		return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && $e(e, h), !0;
	}
	function tt(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
		if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
		function s(t) {
			let n = e.lineMax;
			if (t >= n || e.isEmpty(t)) return null;
			let r = !1;
			if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
				let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
				e.parentType = "reference";
				let a = !1;
				for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
					a = !0;
					break;
				}
				if (e.parentType = i, a) return null;
			}
			let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
			return e.src.slice(i, a + 1);
		}
		let c = e.src.slice(i, a + 1);
		a = c.length;
		let l = -1;
		for (i = 1; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 91) return !1;
			if (e === 93) {
				l = i;
				break;
			} else if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			}
		}
		if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
		for (i = l + 2; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (!k(e)) break;
		}
		let u = e.md.helpers.parseLinkDestination(c, i, a);
		if (!u.ok) return !1;
		let d = e.md.normalizeLink(u.str);
		if (!e.md.validateLink(d)) return !1;
		i = u.pos;
		let f = i, p = o, m = i;
		for (; i < a; i++) {
			let e = c.charCodeAt(i);
			if (e === 10) {
				let e = s(o);
				e !== null && (c += e, a = c.length, o++);
			} else if (!k(e)) break;
		}
		let h = e.md.helpers.parseLinkTitle(c, i, a);
		for (; h.can_continue;) {
			let t = s(o);
			if (t === null) break;
			c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
		}
		let g;
		for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && k(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && k(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10) return !1;
		let _ = fe(c.slice(1, l));
		return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
			title: g,
			href: d
		}), e.line = o, !0) : !1;
	}
	var nt = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), V = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), rt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), H = [
		[
			/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
			/<\/(script|pre|style|textarea)>/i,
			!0
		],
		[
			/^<!--/,
			/-->/,
			!0
		],
		[
			/^<\?/,
			/\?>/,
			!0
		],
		[
			/^<![A-Z]/,
			/>/,
			!0
		],
		[
			/^<!\[CDATA\[/,
			/\]\]>/,
			!0
		],
		[
			RegExp("^</?(" + nt.join("|") + ")(?=(\\s|/?>|$))", "i"),
			/^$/,
			!0
		],
		[
			RegExp(rt.source + "\\s*$"),
			/^$/,
			!1
		]
	];
	function U(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
		let o = e.src.slice(i, a), s = 0;
		for (; s < H.length && !H[s][0].test(o); s++);
		if (s === H.length) return !1;
		if (r) return H[s][2];
		let c = t + 1, l = H[s][1].test("");
		if (!H[s][1].test(o)) {
			for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), H[s][1].test(o)) {
				o.length !== 0 && c++;
				break;
			}
		}
		e.line = c;
		let u = e.push("html_block", "", 0);
		return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
	}
	function it(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let o = e.src.charCodeAt(i);
		if (o !== 35 || i >= a) return !1;
		let s = 1;
		for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
		if (s > 6 || i < a && !k(o)) return !1;
		if (r) return !0;
		a = e.skipSpacesBack(a, i);
		let c = e.skipCharsBack(a, 35, i);
		c > i && k(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
		let l = e.push("heading_open", "h" + String(s), 1);
		l.markup = "########".slice(0, s), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = me(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
		let d = e.push("heading_close", "h" + String(s), -1);
		return d.markup = "########".slice(0, s), !0;
	}
	function at(e, t, n) {
		let r = e.md.block.ruler.getRules("paragraph");
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let i = e.parentType;
		e.parentType = "paragraph";
		let a = 0, o, s = t + 1;
		for (; s < n && !e.isEmpty(s); s++) {
			if (e.sCount[s] - e.blkIndent > 3) continue;
			if (e.sCount[s] >= e.blkIndent) {
				let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
				if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
					a = o === 61 ? 1 : 2;
					break;
				}
			}
			if (e.sCount[s] < 0) continue;
			let t = !1;
			for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
				t = !0;
				break;
			}
			if (t) break;
		}
		if (!a) return e.parentType = i, !1;
		let c = me(e.getLines(t, s, e.blkIndent, !1));
		e.line = s + 1;
		let l = e.push("heading_open", "h" + String(a), 1);
		l.markup = String.fromCharCode(o), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = c, u.map = [t, e.line - 1], u.children = [];
		let d = e.push("heading_close", "h" + String(a), -1);
		return d.markup = String.fromCharCode(o), e.parentType = i, !0;
	}
	function ot(e, t, n) {
		let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
		for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
			if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
			let t = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
				t = !0;
				break;
			}
			if (t) break;
		}
		let o = me(e.getLines(t, a, e.blkIndent, !1));
		e.line = a;
		let s = e.push("paragraph_open", "p", 1);
		s.map = [t, e.line];
		let c = e.push("inline", "", 0);
		return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
	}
	var st = [
		[
			"table",
			Ke,
			["paragraph", "reference"]
		],
		["code", qe],
		[
			"fence",
			Je,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"blockquote",
			Ye,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"hr",
			Xe,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"list",
			et,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["reference", tt],
		[
			"html_block",
			U,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		[
			"heading",
			it,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["lheading", at],
		["paragraph", ot]
	];
	function ct() {
		this.ruler = new F();
		for (let e = 0; e < st.length; e++) this.ruler.push(st[e][0], st[e][1], { alt: (st[e][2] || []).slice() });
	}
	ct.prototype.tokenize = function(e, t, n) {
		let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
		for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
			if (e.level >= a) {
				e.line = n;
				break;
			}
			let t = e.line, c = !1;
			for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
				if (t >= e.line) throw Error("block rule didn't increment state.line");
				break;
			}
			if (!c) throw Error("none of the block rules matched");
			e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
		}
	}, ct.prototype.parse = function(e, t, n, r) {
		if (!e) return;
		let i = new this.State(e, t, n, r);
		this.tokenize(i, i.line, i.lineMax);
	}, ct.prototype.State = z;
	function lt(e, t, n, r) {
		this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
	}
	lt.prototype.pushPending = function() {
		let e = new I("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}, lt.prototype.push = function(e, t, n) {
		this.pending && this.pushPending();
		let r = new I(e, t, n), i = null;
		return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
	}, lt.prototype.scanDelims = function(e, t) {
		let n = this.posMax, r = this.src.charCodeAt(e), i;
		if (e === 0) i = 32;
		else if (e === 1) i = this.src.charCodeAt(0), (i & 63488) == 55296 && (i = 65533);
		else if (i = this.src.charCodeAt(e - 1), (i & 64512) == 56320) {
			let t = this.src.charCodeAt(e - 2);
			i = (t & 64512) == 55296 ? 65536 + (t - 55296 << 10) + (i - 56320) : 65533;
		} else (i & 64512) == 55296 && (i = 65533);
		let a = e;
		for (; a < n && this.src.charCodeAt(a) === r;) a++;
		let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32;
		if ((s & 64512) == 55296) {
			let e = this.src.charCodeAt(a + 1);
			s = (e & 64512) == 56320 ? 65536 + (s - 55296 << 10) + (e - 56320) : 65533;
		} else (s & 64512) == 56320 && (s = 65533);
		let c = de(i) || j(i), l = de(s) || j(s), u = A(i), d = A(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}, lt.prototype.Token = I;
	function ut(e) {
		switch (e) {
			case 10:
			case 33:
			case 35:
			case 36:
			case 37:
			case 38:
			case 42:
			case 43:
			case 45:
			case 58:
			case 60:
			case 61:
			case 62:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 125:
			case 126: return !0;
			default: return !1;
		}
	}
	function dt(e, t) {
		let n = e.pos;
		for (; n < e.posMax && !ut(e.src.charCodeAt(n));) n++;
		return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
	}
	var ft = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
	function pt(e, t) {
		if (!e.md.options.linkify || e.linkLevel > 0) return !1;
		let n = e.pos, r = e.posMax;
		if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
		let i = e.pending.match(ft);
		if (!i) return !1;
		let a = i[1], o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
		if (!o) return !1;
		let s = o.url;
		if (s.length <= a.length) return !1;
		let c = s.length;
		for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
		c !== s.length && (s = s.slice(0, c));
		let l = e.md.normalizeLink(s);
		if (!e.md.validateLink(l)) return !1;
		if (!t) {
			e.pending = e.pending.slice(0, -a.length);
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", l]], t.markup = "linkify", t.info = "auto";
			let n = e.push("text", "", 0);
			n.content = e.md.normalizeLinkText(s);
			let r = e.push("link_close", "a", -1);
			r.markup = "linkify", r.info = "auto";
		}
		return e.pos += s.length - a.length, !0;
	}
	function mt(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 10) return !1;
		let r = e.pending.length - 1, i = e.posMax;
		if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
			let t = r - 1;
			for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
			e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
		} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
		else e.push("softbreak", "br", 0);
		for (n++; n < i && k(e.src.charCodeAt(n));) n++;
		return e.pos = n, !0;
	}
	var ht = [];
	for (let e = 0; e < 256; e++) ht.push(0);
	"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
		ht[e.charCodeAt(0)] = 1;
	});
	function gt(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
		let i = e.src.charCodeAt(n);
		if (i === 10) {
			for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), k(i));) n++;
			return e.pos = n, !0;
		}
		if (i === 32) {
			if (!t) {
				let t = e.push("text_special", "", 0);
				t.content = "\\", t.markup = "\\", t.info = "escape";
			}
			return e.pos = n, !0;
		}
		let a = e.src[n];
		if (i >= 55296 && i <= 56319 && n + 1 < r) {
			let t = e.src.charCodeAt(n + 1);
			t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
		}
		let o = "\\" + a;
		if (!t) {
			let t = e.push("text_special", "", 0);
			i < 256 && ht[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
		}
		return e.pos = n + 1, !0;
	}
	function _t(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 96) return !1;
		let r = n;
		n++;
		let i = e.posMax;
		for (; n < i && e.src.charCodeAt(n) === 96;) n++;
		let a = e.src.slice(r, n), o = a.length;
		if (e.backticksScanned && (e.backticks[o] || 0) <= r) return t || (e.pending += a), e.pos += o, !0;
		let s = n, c;
		for (; (c = e.src.indexOf("`", s)) !== -1;) {
			for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
			let r = s - c;
			if (r === o) {
				if (!t) {
					let t = e.push("code_inline", "code", 0);
					t.markup = a, t.content = e.src.slice(n, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
				}
				return e.pos = s, !0;
			}
			e.backticks[r] = c;
		}
		return e.backticksScanned = !0, t || (e.pending += a), e.pos += o, !0;
	}
	function vt(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 126) return !1;
		let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
		if (a < 2) return !1;
		let s;
		a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
		for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
			marker: r,
			length: 0,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
		return e.pos += i.length, !0;
	}
	function yt(e, t) {
		let n, r = [], i = t.length;
		for (let a = 0; a < i; a++) {
			let i = t[a];
			if (i.marker !== 126 || i.end === -1) continue;
			let o = t[i.end];
			n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
		}
		for (; r.length;) {
			let t = r.pop(), i = t + 1;
			for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
			i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
		}
	}
	function bt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		yt(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && yt(e, t[r].delimiters);
	}
	var xt = {
		tokenize: vt,
		postProcess: bt
	};
	function St(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 95 && r !== 42) return !1;
		let i = e.scanDelims(e.pos, r === 42);
		for (let t = 0; t < i.length; t++) {
			let t = e.push("text", "", 0);
			t.content = String.fromCharCode(r), e.delimiters.push({
				marker: r,
				length: i.length,
				token: e.tokens.length - 1,
				end: -1,
				open: i.can_open,
				close: i.can_close
			});
		}
		return e.pos += i.length, !0;
	}
	function Ct(e, t) {
		let n = t.length;
		for (let r = n - 1; r >= 0; r--) {
			let n = t[r];
			if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
			let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
			s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
			let c = e.tokens[i.token];
			c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
		}
	}
	function wt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Ct(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Ct(e, t[r].delimiters);
	}
	var Tt = {
		tokenize: St,
		postProcess: wt
	};
	function Et(e, t) {
		let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
		if (e.src.charCodeAt(e.pos) !== 91) return !1;
		let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
		if (p < 0) return !1;
		let m = p + 1;
		if (m < d && e.src.charCodeAt(m) === 40) {
			for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
			if (m >= d) return !1;
			if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
				for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
				if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!k(n) && n !== 10)); m++);
			}
			(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
		}
		if (l) {
			if (e.env.references === void 0) return !1;
			if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[fe(r)], !a) return e.pos = u, !1;
			o = a.href, s = a.title;
		}
		if (!t) {
			e.pos = f, e.posMax = p;
			let t = e.push("link_open", "a", 1), n = [["href", o]];
			t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
		}
		return e.pos = m, e.posMax = d, !0;
	}
	function Dt(e, t) {
		let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
		if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
		let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
		if (m < 0) return !1;
		if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
			for (a++; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			if (a >= f) return !1;
			for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!k(n) && n !== 10)); a++);
			else c = "";
			if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
			a++;
		} else {
			if (e.env.references === void 0) return !1;
			if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[fe(i)], !o) return e.pos = d, !1;
			u = o.href, c = o.title;
		}
		if (!t) {
			r = e.src.slice(p, m);
			let t = [];
			e.md.inline.parse(r, e.md, e.env, t);
			let n = e.push("image", "img", 0), i = [["src", u], ["alt", ""]];
			n.attrs = i, n.children = t, n.content = r, c && i.push(["title", c]);
		}
		return e.pos = a, e.posMax = f, !0;
	}
	var Ot = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, kt = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
	function At(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 60) return !1;
		let r = e.pos, i = e.posMax;
		for (;;) {
			if (++n >= i) return !1;
			let t = e.src.charCodeAt(n);
			if (t === 60) return !1;
			if (t === 62) break;
		}
		let a = e.src.slice(r + 1, n);
		if (kt.test(a)) {
			let n = e.md.normalizeLink(a);
			if (!e.md.validateLink(n)) return !1;
			if (!t) {
				let t = e.push("link_open", "a", 1);
				t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
				let r = e.push("text", "", 0);
				r.content = e.md.normalizeLinkText(a);
				let i = e.push("link_close", "a", -1);
				i.markup = "autolink", i.info = "auto";
			}
			return e.pos += a.length + 2, !0;
		}
		if (Ot.test(a)) {
			let n = e.md.normalizeLink("mailto:" + a);
			if (!e.md.validateLink(n)) return !1;
			if (!t) {
				let t = e.push("link_open", "a", 1);
				t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
				let r = e.push("text", "", 0);
				r.content = e.md.normalizeLinkText(a);
				let i = e.push("link_close", "a", -1);
				i.markup = "autolink", i.info = "auto";
			}
			return e.pos += a.length + 2, !0;
		}
		return !1;
	}
	function W(e) {
		return /^<a[>\s]/i.test(e);
	}
	function jt(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Mt(e) {
		let t = e | 32;
		return t >= 97 && t <= 122;
	}
	function Nt(e, t) {
		if (!e.md.options.html) return !1;
		let n = e.posMax, r = e.pos;
		if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
		let i = e.src.charCodeAt(r + 1);
		if (i !== 33 && i !== 63 && i !== 47 && !Mt(i)) return !1;
		let a = e.src.slice(r).match(V);
		if (!a) return !1;
		if (!t) {
			let t = e.push("html_inline", "", 0);
			t.content = a[0], W(t.content) && e.linkLevel++, jt(t.content) && e.linkLevel--;
		}
		return e.pos += a[0].length, !0;
	}
	var Pt = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Ft = /^&([a-z][a-z0-9]{1,31});/i;
	function It(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
		if (e.src.charCodeAt(n + 1) === 35) {
			let r = e.src.slice(n).match(Pt);
			if (r) {
				if (!t) {
					let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
					n.content = w(t) ? T(t) : T(65533), n.markup = r[0], n.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		} else {
			let r = e.src.slice(n).match(Ft);
			if (r) {
				let n = (0, m.decodeHTMLStrict)(r[0]);
				if (n !== r[0]) {
					if (!t) {
						let t = e.push("text_special", "", 0);
						t.content = n, t.markup = r[0], t.info = "entity";
					}
					return e.pos += r[0].length, !0;
				}
			}
		}
		return !1;
	}
	function Lt(e) {
		let t = {}, n = e.length;
		if (!n) return;
		let r = 0, i = -2, a = [];
		for (let o = 0; o < n; o++) {
			let n = e[o];
			if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
			t.hasOwnProperty(n.marker) || (t[n.marker] = [
				-1,
				-1,
				-1,
				-1,
				-1,
				-1
			]);
			let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
			for (; c > s; c -= a[c] + 1) {
				let t = e[c];
				if (t.marker === n.marker && t.open && t.end < 0) {
					let r = !1;
					if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
						let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
						a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
						break;
					}
				}
			}
			l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
		}
	}
	function Rt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Lt(e.delimiters);
		for (let e = 0; e < n; e++) t[e] && t[e].delimiters && Lt(t[e].delimiters);
	}
	function zt(e) {
		let t, n, r = 0, i = e.tokens, a = e.tokens.length;
		for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
	var Bt = [
		["text", dt],
		["linkify", pt],
		["newline", mt],
		["escape", gt],
		["backticks", _t],
		["strikethrough", xt.tokenize],
		["emphasis", Tt.tokenize],
		["link", Et],
		["image", Dt],
		["autolink", At],
		["html_inline", Nt],
		["entity", It]
	], Vt = [
		["balance_pairs", Rt],
		["strikethrough", xt.postProcess],
		["emphasis", Tt.postProcess],
		["fragments_join", zt]
	];
	function Ht() {
		this.ruler = new F();
		for (let e = 0; e < Bt.length; e++) this.ruler.push(Bt[e][0], Bt[e][1]);
		this.ruler2 = new F();
		for (let e = 0; e < Vt.length; e++) this.ruler2.push(Vt[e][0], Vt[e][1]);
	}
	Ht.prototype.skipToken = function(e) {
		let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
		if (a[t] !== void 0) {
			e.pos = a[t];
			return;
		}
		let o = !1;
		if (e.level < i) {
			for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
				if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		} else e.pos = e.posMax;
		o || e.pos++, a[t] = e.pos;
	}, Ht.prototype.tokenize = function(e) {
		let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
		for (; e.pos < r;) {
			let a = e.pos, o = !1;
			if (e.level < i) {
				for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
					if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (o) {
				if (e.pos >= r) break;
				continue;
			}
			e.pending += e.src[e.pos++];
		}
		e.pending && e.pushPending();
	}, Ht.prototype.parse = function(e, t, n, r) {
		let i = new this.State(e, t, n, r);
		this.tokenize(i);
		let a = this.ruler2.getRules(""), o = a.length;
		for (let e = 0; e < o; e++) a[e](i);
	}, Ht.prototype.State = lt;
	var Ut = {
		default: {
			options: {
				html: !1,
				xhtmlOut: !1,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 100
			},
			components: {
				core: {},
				block: {},
				inline: {}
			}
		},
		zero: {
			options: {
				html: !1,
				xhtmlOut: !1,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: ["paragraph"] },
				inline: {
					rules: ["text"],
					rules2: ["balance_pairs", "fragments_join"]
				}
			}
		},
		commonmark: {
			options: {
				html: !0,
				xhtmlOut: !0,
				breaks: !1,
				langPrefix: "language-",
				linkify: !1,
				typographer: !1,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: [
					"blockquote",
					"code",
					"fence",
					"heading",
					"hr",
					"html_block",
					"lheading",
					"list",
					"reference",
					"paragraph"
				] },
				inline: {
					rules: [
						"autolink",
						"backticks",
						"emphasis",
						"entity",
						"escape",
						"html_inline",
						"image",
						"link",
						"newline",
						"text"
					],
					rules2: [
						"balance_pairs",
						"emphasis",
						"fragments_join"
					]
				}
			}
		}
	}, Wt = /^(vbscript|javascript|file|data):/, Gt = /^data:image\/(gif|png|jpeg|webp);/;
	function Kt(e) {
		let t = e.trim().toLowerCase();
		return !Wt.test(t) || Gt.test(t);
	}
	var qt = [
		"http:",
		"https:",
		"mailto:"
	];
	function Jt(e) {
		let t = f.parse(e, !0);
		if (t.hostname && (!t.protocol || qt.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toASCII(t.hostname);
		} catch {}
		return f.encode(f.format(t));
	}
	function Yt(e) {
		let t = f.parse(e, !0);
		if (t.hostname && (!t.protocol || qt.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toUnicode(t.hostname);
		} catch {}
		return f.decode(f.format(t), f.decode.defaultChars + "%");
	}
	function G(e, t) {
		if (!(this instanceof G)) return new G(e, t);
		t || y(e) || (t = e || {}, e = "default"), this.inline = new Ht(), this.block = new ct(), this.core = new R(), this.renderer = new P(), this.linkify = new h.default(), this.validateLink = Kt, this.normalizeLink = Jt, this.normalizeLinkText = Yt, this.utils = _, this.helpers = S({}, ve), this.options = {}, this.configure(e), t && this.set(t);
	}
	G.prototype.set = function(e) {
		return S(this.options, e), this;
	}, G.prototype.configure = function(e) {
		let t = this;
		if (y(e)) {
			let t = e;
			if (e = Ut[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
		}
		if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
		return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
			e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
		}), this;
	}, G.prototype.enable = function(e, t) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach(function(t) {
			n = n.concat(this[t].ruler.enable(e, !0));
		}, this), n = n.concat(this.inline.ruler2.enable(e, !0));
		let r = e.filter(function(e) {
			return n.indexOf(e) < 0;
		});
		if (r.length && !t) throw Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
		return this;
	}, G.prototype.disable = function(e, t) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach(function(t) {
			n = n.concat(this[t].ruler.disable(e, !0));
		}, this), n = n.concat(this.inline.ruler2.disable(e, !0));
		let r = e.filter(function(e) {
			return n.indexOf(e) < 0;
		});
		if (r.length && !t) throw Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
		return this;
	}, G.prototype.use = function(e) {
		let t = [this].concat(Array.prototype.slice.call(arguments, 1));
		return e.apply(e, t), this;
	}, G.prototype.parse = function(e, t) {
		if (typeof e != "string") throw Error("Input data should be a String");
		let n = new this.core.State(e, this, t);
		return this.core.process(n), n.tokens;
	}, G.prototype.render = function(e, t) {
		return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
	}, G.prototype.parseInline = function(e, t) {
		let n = new this.core.State(e, this, t);
		return n.inlineMode = !0, this.core.process(n), n.tokens;
	}, G.prototype.renderInline = function(e, t) {
		return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
	}, n.exports = G;
})), Zc = /* @__PURE__ */ r(((e) => {
	e.getAttrs = function(e, t, n) {
		let r = /[^\t\n\f />"'=]/, i = [], a = "", o = "", s = !0, l = !1;
		for (let u = t + n.leftDelimiter.length; u < e.length; u++) {
			if (!l && e.slice(u, u + n.rightDelimiter.length) === n.rightDelimiter) {
				a !== "" && i.push([a, o]);
				break;
			}
			let t = e.charAt(u);
			if (t === "=" && s) {
				s = !1;
				continue;
			}
			if (t === "." && a === "") {
				e.charAt(u + 1) === "." ? (a = "css-module", u += 1) : a = "class", s = !1;
				continue;
			}
			if (t === "#" && a === "") {
				a = "id", s = !1;
				continue;
			}
			if (c(e, u) && o === "" && !l) {
				l = !0;
				continue;
			}
			if (c(e, u) && l) {
				l = !1;
				continue;
			}
			if (t === " " && !l) {
				if (a === "") continue;
				i.push([a, o]), a = "", o = "", s = !0;
				continue;
			}
			if (!(s && t.search(r) === -1)) {
				if (s) {
					a += t;
					continue;
				}
				o += t;
			}
		}
		let u = n.allowedAttributes && n.allowedAttributes.length, d = n.allowedAttributeValues && n.allowedAttributeValues.length;
		if (u || d) {
			let e = n.allowedAttributes, t = n.allowedAttributeValues;
			return i.filter(function(n) {
				let r = n[0], i = n[1], a = !u, o = !d;
				function s(e) {
					return i === e || e instanceof RegExp && e.test(i);
				}
				function c(e) {
					return r === e || e instanceof RegExp && e.test(r);
				}
				return u && (a = e.some(c)), d && (o = t.some(s)), a && o;
			});
		}
		return i;
	}, e.addAttrs = function(e, t) {
		for (let n = 0, r = e.length; n < r; ++n) {
			let r = e[n][0];
			r === "class" ? t.attrJoin("class", e[n][1]) : r === "css-module" ? t.attrJoin("css-module", e[n][1]) : t.attrSet(r, e[n][1]);
		}
		return t;
	}, e.hasDelimiters = function(e, t) {
		if (!e) throw Error("Parameter `where` not passed. Should be \"start\", \"end\" or \"only\".");
		return function(n) {
			let r = t.leftDelimiter.length + 1 + t.rightDelimiter.length;
			if (!n || typeof n != "string" || n.length < r) return !1;
			function i(e) {
				let n = e.charAt(t.leftDelimiter.length) === ".", i = e.charAt(t.leftDelimiter.length) === "#";
				return n || i ? e.length >= r + 1 : e.length >= r;
			}
			let a, c, l, u, d = r - t.rightDelimiter.length;
			switch (e) {
				case "start":
					l = n.slice(0, t.leftDelimiter.length), a = l === t.leftDelimiter ? 0 : -1, c = a === -1 ? -1 : o(n, d, t), u = n.charAt(c + t.rightDelimiter.length), u && t.rightDelimiter.indexOf(u) !== -1 && (c = -1);
					break;
				case "end":
					a = s(n, t), c = a === -1 ? -1 : o(n, a + d, t), c = c === n.length - t.rightDelimiter.length ? c : -1;
					break;
				case "only":
					l = n.slice(0, t.leftDelimiter.length), a = l === t.leftDelimiter ? 0 : -1, l = n.slice(n.length - t.rightDelimiter.length), c = l === t.rightDelimiter ? n.length - t.rightDelimiter.length : -1;
					break;
				default: throw Error(`Unexpected case ${e}, expected 'start', 'end' or 'only'`);
			}
			return a !== -1 && c !== -1 && i(n.substring(a, c + t.rightDelimiter.length));
		};
	}, e.removeDelimiter = function(e, t) {
		let n = s(e, t);
		if (n === -1 || o(e, n + t.leftDelimiter.length, t) !== e.length - t.rightDelimiter.length) return e;
		let r = e.slice(0, n);
		return /[ \n]$/.test(r) ? r.slice(0, -1) : r;
	};
	function t(e) {
		return e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
	}
	e.escapeRegExp = t, e.getMatchingOpeningToken = function(e, t) {
		if (e[t].type === "softbreak") return !1;
		if (e[t].nesting === 0) return e[t];
		let n = e[t].level, r = e[t].type.replace("_close", "_open");
		for (; t >= 0; --t) if (e[t].type === r && e[t].level === n) return e[t];
		return !1;
	};
	var n = /[&<>"]/, r = /[&<>"]/g, i = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function a(e) {
		return i[e];
	}
	e.escapeHtml = function(e) {
		return n.test(e) ? e.replace(r, a) : e;
	};
	function o(e, t, n) {
		let r = !1;
		for (let i = t; i < e.length; i++) {
			if (c(e, i)) {
				r = !r;
				continue;
			}
			if (!r && e.slice(i, i + n.rightDelimiter.length) === n.rightDelimiter) return i;
		}
		return -1;
	}
	function s(e, t) {
		let n = -1, r = !1;
		for (let i = 0; i < e.length; i++) {
			if (c(e, i)) {
				r = !r;
				continue;
			}
			!r && e.slice(i, i + t.leftDelimiter.length) === t.leftDelimiter && (n = i);
		}
		return n;
	}
	e.findLeftDelimiter = s;
	function c(e, t) {
		if (e.charAt(t) !== "\"") return !1;
		let n = 0;
		for (let r = t - 1; r >= 0 && e.charAt(r) === "\\"; r--) n++;
		return n % 2 == 0;
	}
})), Qc = /* @__PURE__ */ r(((e, t) => {
	var n = Zc();
	t.exports = (e) => {
		let t = RegExp("^ {0,3}[-*_]{3,} ?" + n.escapeRegExp(e.leftDelimiter) + "[^" + n.escapeRegExp(e.rightDelimiter) + "]");
		return [
			{
				name: "fenced code blocks",
				tests: [{
					shift: 0,
					block: !0,
					info: n.hasDelimiters("end", e)
				}],
				transform: (t, r) => {
					let i = t[r], a = n.findLeftDelimiter(i.info, e), o = n.getAttrs(i.info, a, e);
					n.addAttrs(o, i), i.info = n.removeDelimiter(i.info, e);
				}
			},
			{
				name: "inline nesting 0",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						shift: -1,
						type: (e) => e === "image" || e === "code_inline"
					}, {
						shift: 0,
						type: "text",
						content: n.hasDelimiters("start", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = a.content.indexOf(e.rightDelimiter), s = t[r].children[i - 1], c = n.getAttrs(a.content, 0, e);
					n.addAttrs(c, s), a.content.length === o + e.rightDelimiter.length ? t[r].children.splice(i, 1) : a.content = a.content.slice(o + e.rightDelimiter.length);
				}
			},
			{
				name: "tables",
				tests: [
					{
						shift: 0,
						type: "table_close"
					},
					{
						shift: 1,
						type: "paragraph_open"
					},
					{
						shift: 2,
						type: "inline",
						content: n.hasDelimiters("only", e)
					}
				],
				transform: (t, r) => {
					let i = t[r + 2], a = n.getMatchingOpeningToken(t, r), o = n.getAttrs(i.content, 0, e);
					n.addAttrs(o, a), t.splice(r + 1, 3);
				}
			},
			{
				name: "tables thead metadata",
				tests: [
					{
						shift: 0,
						type: "tr_close"
					},
					{
						shift: 1,
						type: "thead_close"
					},
					{
						shift: 2,
						type: "tbody_open"
					}
				],
				transform: (e, t) => {
					let r = n.getMatchingOpeningToken(e, t), i = e[t - 1], a = 0, o = t;
					for (; --o;) {
						if (e[o] === r) {
							e[o - 1].meta = Object.assign({}, e[o + 2].meta, { colsnum: a });
							break;
						}
						a += (e[o].level === i.level && e[o].type === i.type) >> 0;
					}
					e[t + 2].meta = Object.assign({}, e[t + 2].meta, { colsnum: a });
				}
			},
			{
				name: "tables tbody calculate",
				tests: [{
					shift: 0,
					type: "tbody_close",
					hidden: !1
				}],
				transform: (e, t) => {
					let n = t - 2;
					for (; n > 0 && e[--n].type !== "tbody_open";);
					let r = (e[n].meta && e[n].meta.colsnum) >> 0;
					if (r < 2) return;
					let i = e[t].level + 2;
					for (let o = n; o < t; o++) {
						if (e[o].level > i) continue;
						let s = e[o], c = s.hidden ? 0 : s.attrGet("rowspan") >> 0, l = s.hidden ? 0 : s.attrGet("colspan") >> 0;
						if (c > 1) {
							let t = r - (l > 0 ? l : 1);
							for (let n = o, r = c; r > 1; n++) e[n].type == "tr_open" && (e[n].meta = Object.assign({}, e[n].meta), e[n].meta && e[n].meta.colsnum && --t, e[n].meta.colsnum = t, r--);
						}
						if (s.type == "tr_open" && s.meta && s.meta.colsnum) {
							let n = s.meta.colsnum;
							for (let r = o, i = 0; r < t; r++) {
								if (e[r].type == "td_open") i += 1;
								else if (e[r].type == "tr_close") break;
								i > n && (e[r].hidden || a(e[r]));
							}
						}
						if (l > 1) {
							let i = [], c = o + 3, u = r;
							for (let t = o; t > n; t--) if (e[t].type == "tr_open") {
								u = e[t].meta && e[t].meta.colsnum || u;
								break;
							} else e[t].type === "td_open" && i.unshift(t);
							for (let n = o + 2; n < t; n++) if (e[n].type == "tr_close") {
								c = n;
								break;
							} else e[n].type == "td_open" && i.push(n);
							let d = i.indexOf(o), f = u - d;
							f = f > l ? l : f, l > f && s.attrSet("colspan", f + "");
							for (let t = i.slice(u + 1 - r - f)[0]; t < c; t++) e[t].hidden || a(e[t]);
						}
					}
				}
			},
			{
				name: "inline attributes",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						shift: -1,
						nesting: -1
					}, {
						shift: 0,
						type: "text",
						content: n.hasDelimiters("start", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = a.content, s = n.getAttrs(o, 0, e), c = n.getMatchingOpeningToken(t[r].children, i - 1);
					n.addAttrs(s, c), a.content = o.slice(o.indexOf(e.rightDelimiter) + e.rightDelimiter.length);
				}
			},
			{
				name: "list softbreak",
				tests: [{
					shift: -2,
					type: "list_item_open"
				}, {
					shift: 0,
					type: "inline",
					children: [{
						position: -2,
						type: "softbreak"
					}, {
						position: -1,
						type: "text",
						content: n.hasDelimiters("only", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i].content, o = n.getAttrs(a, 0, e), s = r - 2;
					for (; t[s - 1] && t[s - 1].type !== "ordered_list_open" && t[s - 1].type !== "bullet_list_open";) s--;
					n.addAttrs(o, t[s - 1]), t[r].children = t[r].children.slice(0, -2);
				}
			},
			{
				name: "list double softbreak",
				tests: [
					{
						shift: 0,
						type: (e) => e === "bullet_list_close" || e === "ordered_list_close"
					},
					{
						shift: 1,
						type: "paragraph_open"
					},
					{
						shift: 2,
						type: "inline",
						content: n.hasDelimiters("only", e),
						children: (e) => e.length === 1
					},
					{
						shift: 3,
						type: "paragraph_close"
					}
				],
				transform: (t, r) => {
					let i = t[r + 2].content, a = n.getAttrs(i, 0, e), o = n.getMatchingOpeningToken(t, r);
					n.addAttrs(a, o), t.splice(r + 1, 3);
				}
			},
			{
				name: "list item end",
				tests: [{
					shift: -2,
					type: "list_item_open"
				}, {
					shift: 0,
					type: "inline",
					children: [{
						position: -1,
						type: "text",
						content: n.hasDelimiters("end", e)
					}]
				}],
				transform: (t, i, a) => {
					let o = t[i].children[a], s = o.content, c = n.getAttrs(s, n.findLeftDelimiter(s, e), e);
					n.addAttrs(c, t[i - 2]);
					let l = s.slice(0, n.findLeftDelimiter(s, e));
					o.content = r(l) === " " ? l.slice(0, -1) : l;
				}
			},
			{
				name: "\n{.a} softbreak then curly in start",
				tests: [{
					shift: 0,
					type: "inline",
					children: [{
						position: -2,
						type: "softbreak"
					}, {
						position: -1,
						type: "text",
						content: n.hasDelimiters("only", e)
					}]
				}],
				transform: (t, r, i) => {
					let a = t[r].children[i], o = n.getAttrs(a.content, 0, e), s = r + 1;
					for (; t[s + 1] && t[s + 1].nesting === -1;) s++;
					let c = n.getMatchingOpeningToken(t, s);
					n.addAttrs(o, c), t[r].children = t[r].children.slice(0, -2);
				}
			},
			{
				name: "horizontal rule",
				tests: [
					{
						shift: 0,
						type: "paragraph_open"
					},
					{
						shift: 1,
						type: "inline",
						children: (e) => e.length === 1,
						content: (e) => e.match(t) !== null
					},
					{
						shift: 2,
						type: "paragraph_close"
					}
				],
				transform: (t, r) => {
					let i = t[r];
					i.type = "hr", i.tag = "hr", i.nesting = 0;
					let a = t[r + 1].content, o = a.lastIndexOf(e.leftDelimiter), s = n.getAttrs(a, o, e);
					n.addAttrs(s, i), i.markup = a, t.splice(r + 1, 2);
				}
			},
			{
				name: "end of block",
				tests: [{
					shift: 0,
					type: "inline",
					children: (t) => i(t, e) !== null
				}],
				transform: (t, a) => {
					let o = i(t[a].children, e);
					if (!o) return;
					let s = o.content, c = n.getAttrs(s, n.findLeftDelimiter(s, e), e), l = a + 1;
					for (; l < t.length && t[l].nesting !== -1;) l++;
					if (l >= t.length) return;
					let u = n.getMatchingOpeningToken(t, l);
					n.addAttrs(c, u);
					let d = s.slice(0, n.findLeftDelimiter(s, e));
					o.content = r(d) === " " ? d.slice(0, -1) : d;
				}
			}
		];
	};
	function r(e) {
		return e.slice(-1)[0];
	}
	function i(e, t) {
		let r = 0;
		for (let i = e.length - 1; i >= 0; i--) {
			let a = e[i];
			if (a.type === "code_inline" || a.type === "math_inline") return null;
			if (a.nesting === -1) {
				r++;
				continue;
			}
			if (a.nesting === 1) {
				if (r--, r < 0) return null;
				continue;
			}
			if (!(r > 0) && a.type === "text" && a.content.trim() !== "") return n.hasDelimiters("end", t)(a.content) ? a : null;
		}
		return null;
	}
	function a(e) {
		e.hidden = !0, e.children && e.children.forEach((e) => (e.content = "", a(e), void 0));
	}
})), $c = /* @__PURE__ */ r(((e, t) => {
	var n = Xc(), r = Qc(), i = {
		leftDelimiter: "{",
		rightDelimiter: "}",
		allowedAttributes: [],
		allowedAttributeValues: [],
		fenceAttrsOnPre: !0
	};
	t.exports = function(e, t) {
		let o = Object.assign({}, i);
		o = Object.assign(o, t);
		let s = r(o);
		function c(e) {
			let t = e.tokens;
			for (let e = 0; e < t.length; e++) for (let n = 0; n < s.length; n++) {
				let r = s[n], i = null;
				if (r.tests.every((n) => {
					let r = a(t, e, n);
					return r.j !== null && (i = r.j), r.match;
				})) try {
					r.transform(t, e, i), (r.name === "inline attributes" || r.name === "inline nesting 0") && n--;
				} catch (e) {
					typeof o.errorHandler == "function" ? o.errorHandler(e, r.name) : (console.error(`markdown-it-attrs: Error in pattern '${r.name}': ${e.message}`), console.error(e.stack));
				}
			}
		}
		e.core.ruler.before("linkify", "curly_attributes", c);
		let l = n().renderer.rules.fence, u = e.renderer.rules.fence, d = typeof u == "function" && u !== l;
		o.fenceAttrsOnPre && !d && typeof u == "function" && (e.renderer.rules.fence = function(e, t, n, r, i) {
			let a = e[t], o = a.attrs ? a.attrs.slice() : null;
			a.attrs = null;
			let s = u(e, t, n, r, i);
			if (a.attrs = o, !o || o.length === 0) return s;
			let c = i.renderAttrs(a);
			return s.replace(/^<pre([ >])/, (e, t) => `<pre${c}${t}`);
		});
	};
	function a(e, t, n) {
		let r = {
			match: !1,
			j: null
		}, i = n.shift === void 0 ? n.position : t + n.shift;
		if (n.shift !== void 0 && i < 0) return r;
		let u = c(e, i);
		if (u === void 0) return r;
		for (let e of Object.keys(n)) if (!(e === "shift" || e === "position")) {
			if (u[e] === void 0) return r;
			if (e === "children" && o(n.children)) {
				if (u.children.length === 0) return r;
				let e, t = n.children, i = u.children;
				if (t.every((e) => e.position !== void 0)) {
					if (e = t.every((e) => a(i, e.position, e).match), e) {
						let e = l(t).position;
						r.j = e >= 0 ? e : i.length + e;
					}
				} else for (let n = 0; n < i.length; n++) if (e = t.every((e) => a(i, n, e).match), e) {
					r.j = n;
					break;
				}
				if (e === !1) return r;
				continue;
			}
			switch (typeof n[e]) {
				case "boolean":
				case "number":
				case "string":
					if (u[e] !== n[e]) return r;
					break;
				case "function":
					if (!n[e](u[e])) return r;
					break;
				case "object": if (s(n[e])) {
					if (n[e].every((t) => t(u[e])) === !1) return r;
					break;
				}
				default: throw Error(`Unknown type of pattern test (key: ${e}). Test should be of type boolean, number, string, function or array of functions.`);
			}
		}
		return r.match = !0, r;
	}
	function o(e) {
		return Array.isArray(e) && e.length && e.every((e) => typeof e == "object");
	}
	function s(e) {
		return Array.isArray(e) && e.length && e.every((e) => typeof e == "function");
	}
	function c(e, t) {
		return t >= 0 ? e[t] : e[e.length + t];
	}
	function l(e) {
		return e.slice(-1)[0] || {};
	}
})), el = Symbol("markdown-it-deflist.ddDepth");
function tl(e) {
	let t = e.utils.isSpace;
	function n(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
		if (n >= r || e.sCount[t] - e.blkIndent >= 4) return -1;
		let i = e.src.charCodeAt(n++);
		if (i !== 126 && i !== 58) return -1;
		let a = e.skipSpaces(n);
		return n < r && n === a ? -1 : n;
	}
	function r(e, t, n, r) {
		let i = -1;
		for (let a = t; a < n; a++) {
			let t = e.tokens[a];
			if (!(t.level !== r || !t.block || t.nesting < 0)) {
				if (i >= 0) return;
				i = a;
			}
		}
		i < 0 || e.tokens[i].type !== "paragraph_open" || (e.tokens[i + 2].hidden = !0, e.tokens[i].hidden = !0);
	}
	function i(e, i, a, o) {
		if (o) return e.env[el] ? n(e, i) >= 0 && e.sCount[i] < e.blkIndent : !1;
		let s = i + 1;
		if (s >= a) return !1;
		let c = !0;
		if (e.isEmpty(s) && (s++, c = !1, s >= a) || e.sCount[s] < e.blkIndent) return !1;
		let l = n(e, s);
		if (l < 0) return !1;
		let u = e.push("dl_open", "dl", 1), d = [i, 0];
		u.map = d;
		let f = i, p = s;
		OUTER: for (;;) {
			let i = e.push("dt_open", "dt", 1);
			i.map = [f, f];
			let o = e.push("inline", "", 0);
			for (o.map = [f, f], o.content = e.getLines(f, f + 1, e.blkIndent, !1).trim(), o.children = [], e.push("dt_close", "dt", -1);;) {
				let i = e.tokens.length, o = e.push("dd_open", "dd", 1), u = [s, 0];
				o.map = u;
				let d = l, f = e.eMarks[p], m = e.sCount[p] + l - (e.bMarks[p] + e.tShift[p]);
				for (; d < f;) {
					let n = e.src.charCodeAt(d);
					if (t(n)) n === 9 ? m += 4 - m % 4 : m++;
					else break;
					d++;
				}
				l = d;
				let h = e.tight, g = e.blkIndent, _ = e.tShift[p], v = e.sCount[p], y = e.parentType;
				if (e.blkIndent = e.sCount[p] + 2, e.tShift[p] = l - e.bMarks[p], e.sCount[p] = m, e.tight = !0, e.parentType = "deflist", e.env[el] = (e.env[el] || 0) + 1, e.md.block.tokenize(e, p, a, !0), e.env[el]--, c && r(e, i, e.tokens.length, o.level + 1), e.tShift[p] = _, e.sCount[p] = v, e.tight = h, e.parentType = y, e.blkIndent = g, e.push("dd_close", "dd", -1), u[1] = s = e.line, s >= a || e.sCount[s] < e.blkIndent) break OUTER;
				if (l = n(e, s), l < 0) break;
				p = s;
			}
			if (s >= a || (f = s, e.isEmpty(f)) || e.sCount[f] < e.blkIndent || (p = f + 1, p >= a)) break;
			let u = e.isEmpty(p);
			if (u && p++, p >= a || e.sCount[p] < e.blkIndent || (l = n(e, p), l < 0)) break;
			c = !u;
		}
		return e.push("dl_close", "dl", -1), d[1] = s, e.line = s, !0;
	}
	e.block.ruler.before("paragraph", "deflist", i, { alt: [
		"paragraph",
		"reference",
		"blockquote"
	] });
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it-ins@4.0.0/node_modules/markdown-it-ins/index.mjs
function nl(e) {
	function t(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 43) return !1;
		let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
		if (a < 2) return !1;
		if (a % 2) {
			let t = e.push("text", "", 0);
			t.content = o, a--;
		}
		for (let t = 0; t < a; t += 2) {
			let n = e.push("text", "", 0);
			n.content = o + o, !(!i.can_open && !i.can_close) && e.delimiters.push({
				marker: r,
				length: 0,
				jump: t / 2,
				token: e.tokens.length - 1,
				end: -1,
				open: i.can_open,
				close: i.can_close
			});
		}
		return e.pos += i.length, !0;
	}
	function n(e, t) {
		let n, r = [], i = t.length;
		for (let a = 0; a < i; a++) {
			let i = t[a];
			if (i.marker !== 43 || i.end === -1) continue;
			let o = t[i.end];
			n = e.tokens[i.token], n.type = "ins_open", n.tag = "ins", n.nesting = 1, n.markup = "++", n.content = "", n = e.tokens[o.token], n.type = "ins_close", n.tag = "ins", n.nesting = -1, n.markup = "++", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "+" && r.push(o.token - 1);
		}
		for (; r.length;) {
			let t = r.pop(), i = t + 1;
			for (; i < e.tokens.length && e.tokens[i].type === "ins_close";) i++;
			i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
		}
	}
	e.inline.ruler.before("emphasis", "ins", t), e.inline.ruler2.before("emphasis", "ins", function(e) {
		let t = e.tokens_meta, r = (e.tokens_meta || []).length;
		n(e, e.delimiters);
		for (let i = 0; i < r; i++) t[i] && t[i].delimiters && n(e, t[i].delimiters);
	});
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it-mark@4.0.0/node_modules/markdown-it-mark/index.mjs
function rl(e) {
	function t(e, t) {
		let n = e.pos, r = e.src.charCodeAt(n);
		if (t || r !== 61) return !1;
		let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
		if (a < 2) return !1;
		if (a % 2) {
			let t = e.push("text", "", 0);
			t.content = o, a--;
		}
		for (let t = 0; t < a; t += 2) {
			let n = e.push("text", "", 0);
			n.content = o + o, !(!i.can_open && !i.can_close) && e.delimiters.push({
				marker: r,
				length: 0,
				jump: t / 2,
				token: e.tokens.length - 1,
				end: -1,
				open: i.can_open,
				close: i.can_close
			});
		}
		return e.pos += i.length, !0;
	}
	function n(e, t) {
		let n = [], r = t.length;
		for (let i = 0; i < r; i++) {
			let r = t[i];
			if (r.marker !== 61 || r.end === -1) continue;
			let a = t[r.end], o = e.tokens[r.token];
			o.type = "mark_open", o.tag = "mark", o.nesting = 1, o.markup = "==", o.content = "";
			let s = e.tokens[a.token];
			s.type = "mark_close", s.tag = "mark", s.nesting = -1, s.markup = "==", s.content = "", e.tokens[a.token - 1].type === "text" && e.tokens[a.token - 1].content === "=" && n.push(a.token - 1);
		}
		for (; n.length;) {
			let t = n.pop(), r = t + 1;
			for (; r < e.tokens.length && e.tokens[r].type === "mark_close";) r++;
			if (r--, t !== r) {
				let n = e.tokens[r];
				e.tokens[r] = e.tokens[t], e.tokens[t] = n;
			}
		}
	}
	e.inline.ruler.before("emphasis", "mark", t), e.inline.ruler2.before("emphasis", "mark", function(e) {
		let t, r = e.tokens_meta, i = (e.tokens_meta || []).length;
		for (n(e, e.delimiters), t = 0; t < i; t++) r[t] && r[t].delimiters && n(e, r[t].delimiters);
	});
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it-sub@2.0.0/node_modules/markdown-it-sub/index.mjs
var il = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
function al(e, t) {
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 126 || t || r + 2 >= n) return !1;
	e.pos = r + 1;
	let i = !1;
	for (; e.pos < n;) {
		if (e.src.charCodeAt(e.pos) === 126) {
			i = !0;
			break;
		}
		e.md.inline.skipToken(e);
	}
	if (!i || r + 1 === e.pos) return e.pos = r, !1;
	let a = e.src.slice(r + 1, e.pos);
	if (a.match(/(^|[^\\])(\\\\)*\s/)) return e.pos = r, !1;
	e.posMax = e.pos, e.pos = r + 1;
	let o = e.push("sub_open", "sub", 1);
	o.markup = "~";
	let s = e.push("text", "", 0);
	s.content = a.replace(il, "$1");
	let c = e.push("sub_close", "sub", -1);
	return c.markup = "~", e.pos = e.posMax + 1, e.posMax = n, !0;
}
function ol(e) {
	e.inline.ruler.after("emphasis", "sub", al);
}
//#endregion
//#region ../../../../../../@tp/node_modules/.pnpm/markdown-it-sup@2.0.0/node_modules/markdown-it-sup/index.mjs
var sl = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
function cl(e, t) {
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 94 || t || r + 2 >= n) return !1;
	e.pos = r + 1;
	let i = !1;
	for (; e.pos < n;) {
		if (e.src.charCodeAt(e.pos) === 94) {
			i = !0;
			break;
		}
		e.md.inline.skipToken(e);
	}
	if (!i || r + 1 === e.pos) return e.pos = r, !1;
	let a = e.src.slice(r + 1, e.pos);
	if (a.match(/(^|[^\\])(\\\\)*\s/)) return e.pos = r, !1;
	e.posMax = e.pos, e.pos = r + 1;
	let o = e.push("sup_open", "sup", 1);
	o.markup = "^";
	let s = e.push("text", "", 0);
	s.content = a.replace(sl, "$1");
	let c = e.push("sup_close", "sup", -1);
	return c.markup = "^", e.pos = e.posMax + 1, e.posMax = n, !0;
}
function ll(e) {
	e.inline.ruler.after("emphasis", "sup", cl);
}
//#endregion
export { tl as a, $ as c, pi as d, hi as f, m as g, d as h, nl as i, q as l, f as m, ol as n, $c as o, di as p, rl as r, Rc as s, ll as t, Xr as u };

