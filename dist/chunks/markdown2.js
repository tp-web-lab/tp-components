import { a as e, i as t, n, r, t as i } from "./rolldown-runtime2.js";
import { t as a } from "./markdown-style-registry.js";
import { n as o } from "./formats.js";
import { n as s } from "./lorem-ipsum.js";
//#region ../tp-markdown/dist/markdown/engine/markdown-execute-allowed-scripts.js
function c(e) {
	let t = l(e);
	for (let e of t) {
		let t = e.querySelectorAll("script");
		for (let e of t) {
			if (e.dataset.tpMdExecuted === "true") continue;
			let t = document.createElement("script");
			u(e, t), t.dataset.tpMdExecuted = "true", t.textContent = `
{
${e.textContent ?? ""}
}
`, e.replaceWith(t);
		}
	}
}
function l(e) {
	let t = [];
	return e instanceof HTMLElement && e.matches("[data-allow-script]") && t.push(e), t.push(...e.querySelectorAll("[data-allow-script]")), t;
}
function u(e, t) {
	for (let n of e.attributes) n.name !== "data-tp-md-executed" && t.setAttribute(n.name, n.value);
}
//#endregion
//#region ../tp-markdown/dist/chunks/lib/markdown-it/markdown-it.js
var d = {};
function f(e) {
	let t = d[e];
	if (t) return t;
	t = d[e] = [];
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
function p(e, t) {
	typeof t != "string" && (t = p.defaultChars);
	let n = f(t);
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
p.defaultChars = ";/?:@&=+$,#", p.componentChars = "";
var m = {};
function h(e) {
	let t = m[e];
	if (t) return t;
	t = m[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function g(e, t, n) {
	typeof t != "string" && (n = t, t = g.defaultChars), n === void 0 && (n = !0);
	let r = h(t), i = "";
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
g.defaultChars = ";/?:@&=+$,-_.!~*'()#", g.componentChars = "-_.!~*'()";
function _(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
function v() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var y = /^([a-z0-9.+-]+:)/i, b = /:[0-9]*$/, ee = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, x = [
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
], S = [
	"/",
	"?",
	"#"
], te = 255, C = /^[+a-z0-9A-Z_-]{0,63}$/, w = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, ne = {
	javascript: !0,
	"javascript:": !0
}, re = {
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
function ie(e, t) {
	if (e && e instanceof v) return e;
	let n = new v();
	return n.parse(e, t), n;
}
v.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = ee.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = y.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && ne[o]) && (a = a.substr(2), this.slashes = !0)), !ne[o] && (i || o && !re[o])) {
		let e = -1;
		for (let t = 0; t < S.length; t++) r = a.indexOf(S[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < x.length; t++) r = a.indexOf(x[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(C)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(C)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(w);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > te && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), re[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, v.prototype.parseHost = function(e) {
	let t = b.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
var ae = /* @__PURE__ */ i({
	decode: () => p,
	encode: () => g,
	format: () => _,
	parse: () => ie
}), oe = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, se = /[\0-\x1F\x7F-\x9F]/, ce = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, le = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, ue = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, de = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, fe = /* @__PURE__ */ i({
	Any: () => oe,
	Cc: () => se,
	Cf: () => ce,
	P: () => le,
	S: () => ue,
	Z: () => de
}), pe = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((e) => e.charCodeAt(0))), T = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((e) => e.charCodeAt(0))), me = /* @__PURE__ */ new Map([
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
]), he = String.fromCodePoint ?? function(e) {
	let t = "";
	return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
};
function ge(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : me.get(e) ?? e;
}
var E;
(function(e) {
	e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})(E ||= {});
var _e = 32, ve;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(ve ||= {});
function ye(e) {
	return e >= E.ZERO && e <= E.NINE;
}
function be(e) {
	return e >= E.UPPER_A && e <= E.UPPER_F || e >= E.LOWER_A && e <= E.LOWER_F;
}
function xe(e) {
	return e >= E.UPPER_A && e <= E.UPPER_Z || e >= E.LOWER_A && e <= E.LOWER_Z || ye(e);
}
function Se(e) {
	return e === E.EQUALS || xe(e);
}
var D;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(D ||= {});
var Ce;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Ce ||= {});
var O = class {
	constructor(e, t, n) {
		this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = D.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Ce.Strict;
	}
	startEntity(e) {
		this.decodeMode = e, this.state = D.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
	}
	write(e, t) {
		switch (this.state) {
			case D.EntityStart: return e.charCodeAt(t) === E.NUM ? (this.state = D.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = D.NamedEntity, this.stateNamedEntity(e, t));
			case D.NumericStart: return this.stateNumericStart(e, t);
			case D.NumericDecimal: return this.stateNumericDecimal(e, t);
			case D.NumericHex: return this.stateNumericHex(e, t);
			case D.NamedEntity: return this.stateNamedEntity(e, t);
		}
	}
	stateNumericStart(e, t) {
		return t >= e.length ? -1 : (e.charCodeAt(t) | _e) === E.LOWER_X ? (this.state = D.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = D.NumericDecimal, this.stateNumericDecimal(e, t));
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
			if (ye(r) || be(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
		}
		return this.addToNumericResult(e, n, t, 16), -1;
	}
	stateNumericDecimal(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (ye(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
		}
		return this.addToNumericResult(e, n, t, 10), -1;
	}
	emitNumericEntity(e, t) {
		var n;
		if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
		if (e === E.SEMI) this.consumed += 1;
		else if (this.decodeMode === Ce.Strict) return 0;
		return this.emitCodePoint(ge(this.result), this.consumed), this.errors && (e !== E.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
	}
	stateNamedEntity(e, t) {
		let { decodeTree: n } = this, r = n[this.treeIndex], i = (r & ve.VALUE_LENGTH) >> 14;
		for (; t < e.length; t++, this.excess++) {
			let a = e.charCodeAt(t);
			if (this.treeIndex = k(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === Ce.Attribute && (i === 0 || Se(a)) ? 0 : this.emitNotTerminatedNamedEntity();
			if (r = n[this.treeIndex], i = (r & ve.VALUE_LENGTH) >> 14, i !== 0) {
				if (a === E.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
				this.decodeMode !== Ce.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
			}
		}
		return -1;
	}
	emitNotTerminatedNamedEntity() {
		var e;
		let { result: t, decodeTree: n } = this, r = (n[t] & ve.VALUE_LENGTH) >> 14;
		return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
	}
	emitNamedEntityData(e, t, n) {
		let { decodeTree: r } = this;
		return this.emitCodePoint(t === 1 ? r[e] & ~ve.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
	}
	end() {
		var e;
		switch (this.state) {
			case D.NamedEntity: return this.result !== 0 && (this.decodeMode !== Ce.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case D.NumericDecimal: return this.emitNumericEntity(0, 2);
			case D.NumericHex: return this.emitNumericEntity(0, 3);
			case D.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			case D.EntityStart: return 0;
		}
	}
};
function we(e) {
	let t = "", n = new O(e, (e) => t += he(e));
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
function k(e, t, n, r) {
	let i = (t & ve.BRANCH_LENGTH) >> 7, a = t & ve.JUMP_TABLE;
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
var A = we(pe);
we(T);
function Te(e, t = Ce.Legacy) {
	return A(e, t);
}
function Ee(e) {
	return A(e, Ce.Strict);
}
var De = /* @__PURE__ */ i({
	arrayReplaceAt: () => Ne,
	asciiTrim: () => et,
	assign: () => Me,
	escapeHtml: () => Ke,
	escapeRE: () => Je,
	fromCodePoint: () => Fe,
	has: () => je,
	isMdAsciiPunct: () => Ze,
	isPunctChar: () => Xe,
	isPunctCharCode: () => M,
	isSpace: () => j,
	isString: () => ke,
	isValidEntityCode: () => Pe,
	isWhiteSpace: () => Ye,
	lib: () => tt,
	normalizeReference: () => Qe,
	unescapeAll: () => Ve,
	unescapeMd: () => Be
});
function Oe(e) {
	return Object.prototype.toString.call(e);
}
function ke(e) {
	return Oe(e) === "[object String]";
}
var Ae = Object.prototype.hasOwnProperty;
function je(e, t) {
	return Ae.call(e, t);
}
function Me(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		if (t) {
			if (typeof t != "object") throw TypeError(t + "must be object");
			Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}
	}), e;
}
function Ne(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Pe(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function Fe(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var Ie = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Le = RegExp(Ie.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), Re = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function ze(e, t) {
	if (t.charCodeAt(0) === 35 && Re.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return Pe(n) ? Fe(n) : e;
	}
	let n = Te(e);
	return n === e ? e : n;
}
function Be(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(Ie, "$1");
}
function Ve(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(Le, function(e, t, n) {
		return t || ze(e, n);
	});
}
var He = /[&<>"]/, Ue = /[&<>"]/g, We = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Ge(e) {
	return We[e];
}
function Ke(e) {
	return He.test(e) ? e.replace(Ue, Ge) : e;
}
var qe = /[.?*+^$[\]\\(){}|-]/g;
function Je(e) {
	return e.replace(qe, "\\$&");
}
function j(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Ye(e) {
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
function Xe(e) {
	return le.test(e) || ue.test(e);
}
function M(e) {
	return Xe(Fe(e));
}
function Ze(e) {
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
function Qe(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function $e(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function et(e) {
	let t = 0;
	for (; t < e.length && $e(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && $e(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var tt = {
	mdurl: ae,
	ucmicro: fe
};
function nt(e, t, n) {
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
function rt(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = Ve(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = Ve(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function it(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += Ve(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += Ve(e.slice(t, a)), o;
}
var at = /* @__PURE__ */ i({
	parseLinkDestination: () => rt,
	parseLinkLabel: () => nt,
	parseLinkTitle: () => it
}), N = {};
N.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return "<code" + i.renderAttrs(a) + ">" + Ke(a.content) + "</code>";
}, N.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return "<pre" + i.renderAttrs(a) + "><code>" + Ke(e[t].content) + "</code></pre>\n";
}, N.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? Ve(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Ke(a.content), l.indexOf("<pre") === 0) return l + "\n";
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
	return Ke(e[t].content);
}, N.html_block = function(e, t) {
	return e[t].content;
}, N.html_inline = function(e, t) {
	return e[t].content;
};
function ot() {
	this.rules = Me({}, N);
}
ot.prototype.renderAttrs = function(e) {
	let t, n, r;
	if (!e.attrs) return "";
	for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + Ke(e.attrs[t][0]) + "=\"" + Ke(e.attrs[t][1]) + "\"";
	return r;
}, ot.prototype.renderToken = function(e, t, n) {
	let r = e[t], i = "";
	if (r.hidden) return "";
	r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
	let a = !1;
	if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
		let n = e[t + 1];
		(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
	}
	return i += a ? ">\n" : ">", i;
}, ot.prototype.renderInline = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
	}
	return r;
}, ot.prototype.renderInlineAsText = function(e, t, n) {
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
}, ot.prototype.render = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
	}
	return r;
};
function P() {
	this.__rules__ = [], this.__cache__ = null;
}
P.prototype.__find__ = function(e) {
	for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
	return -1;
}, P.prototype.__compile__ = function() {
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
}, P.prototype.at = function(e, t, n) {
	let r = this.__find__(e), i = n || {};
	if (r === -1) throw Error("Parser rule not found: " + e);
	this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
}, P.prototype.before = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, P.prototype.after = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i + 1, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, P.prototype.push = function(e, t, n) {
	let r = n || {};
	this.__rules__.push({
		name: e,
		enabled: !0,
		fn: t,
		alt: r.alt || []
	}), this.__cache__ = null;
}, P.prototype.enable = function(e, t) {
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
}, P.prototype.enableOnly = function(e, t) {
	Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
		e.enabled = !1;
	}), this.enable(e, t);
}, P.prototype.disable = function(e, t) {
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
}, P.prototype.getRules = function(e) {
	return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
};
function F(e, t, n) {
	this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
F.prototype.attrIndex = function(e) {
	if (!this.attrs) return -1;
	let t = this.attrs;
	for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
	return -1;
}, F.prototype.attrPush = function(e) {
	this.attrs ? this.attrs.push(e) : this.attrs = [e];
}, F.prototype.attrSet = function(e, t) {
	let n = this.attrIndex(e), r = [e, t];
	n < 0 ? this.attrPush(r) : this.attrs[n] = r;
}, F.prototype.attrGet = function(e) {
	let t = this.attrIndex(e), n = null;
	return t >= 0 && (n = this.attrs[t][1]), n;
}, F.prototype.attrJoin = function(e, t) {
	let n = this.attrIndex(e);
	n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
};
function st(e, t, n) {
	this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
}
st.prototype.Token = F;
var ct = /\r\n?|\n/g, lt = /\0/g;
function ut(e) {
	let t;
	t = e.src.replace(ct, "\n"), t = t.replace(lt, "�"), e.src = t;
}
function dt(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function ft(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function pt(e) {
	return /^<a[>\s]/i.test(e);
}
function mt(e) {
	return /^<\/a\s*>/i.test(e);
}
function ht(e) {
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
			if (o.type === "html_inline" && (pt(o.content) && i > 0 && i--, mt(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
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
				t[n].children = r = Ne(r, a, c);
			}
		}
	}
}
var gt = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, _t = /\((c|tm|r)\)/i, vt = /\((c|tm|r)\)/gi, yt = {
	c: "©",
	r: "®",
	tm: "™"
};
function bt(e, t) {
	return yt[t.toLowerCase()];
}
function xt(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(vt, bt)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function St(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && gt.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function Ct(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (_t.test(e.tokens[t].content) && xt(e.tokens[t].children), gt.test(e.tokens[t].content) && St(e.tokens[t].children));
}
var wt = /['"]/, Tt = /['"]/g, Et = "’";
function Dt(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Ot(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function kt(e, t) {
	let n, r = [], i = {};
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = e[a].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
		if (r.length = n + 1, o.type !== "text") continue;
		let c = o.content, l = 0, u = c.length;
		OUTER: for (; l < u;) {
			Tt.lastIndex = l;
			let o = Tt.exec(c);
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
			let g = Ze(m) || M(m), _ = Ze(h) || M(h), v = Ye(m), y = Ye(h);
			if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
				p && Dt(i, a, o.index, Et);
				continue;
			}
			if (f) for (n = r.length - 1; n >= 0; n--) {
				let e = r[n];
				if (r[n].level < s) break;
				if (e.single === p && r[n].level === s) {
					e = r[n];
					let s, c;
					p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), Dt(i, a, o.index, c), Dt(i, e.token, e.pos, s), r.length = n;
					continue OUTER;
				}
			}
			d ? r.push({
				token: a,
				pos: o.index,
				single: p,
				level: s
			}) : f && p && Dt(i, a, o.index, Et);
		}
	}
	Object.keys(i).forEach(function(t) {
		e[t].content = Ot(e[t].content, i[t]);
	});
}
function At(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !wt.test(e.tokens[t].content) || kt(e.tokens[t].children, e);
}
function jt(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Mt = [
	["normalize", ut],
	["block", dt],
	["inline", ft],
	["linkify", ht],
	["replacements", Ct],
	["smartquotes", At],
	["text_join", jt]
];
function Nt() {
	this.ruler = new P();
	for (let e = 0; e < Mt.length; e++) this.ruler.push(Mt[e][0], Mt[e][1]);
}
Nt.prototype.process = function(e) {
	let t = this.ruler.getRules("");
	for (let n = 0, r = t.length; n < r; n++) t[n](e);
}, Nt.prototype.State = st;
function I(e, t, n, r) {
	this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
	let i = this.src;
	for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
		let s = i.charCodeAt(t);
		if (!o) if (j(s)) {
			n++, s === 9 ? r += 4 - r % 4 : r++;
			continue;
		} else o = !0;
		(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
	}
	this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
I.prototype.push = function(e, t, n) {
	let r = new F(e, t, n);
	return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
}, I.prototype.isEmpty = function(e) {
	return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
}, I.prototype.skipEmptyLines = function(e) {
	for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
	return e;
}, I.prototype.skipSpaces = function(e) {
	for (let t = this.src.length; e < t && j(this.src.charCodeAt(e)); e++);
	return e;
}, I.prototype.skipSpacesBack = function(e, t) {
	if (e <= t) return e;
	for (; e > t;) if (!j(this.src.charCodeAt(--e))) return e + 1;
	return e;
}, I.prototype.skipChars = function(e, t) {
	for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
	return e;
}, I.prototype.skipCharsBack = function(e, t, n) {
	if (e <= n) return e;
	for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
	return e;
}, I.prototype.getLines = function(e, t, n, r) {
	if (e >= t) return "";
	let i = Array(t - e);
	for (let a = 0, o = e; o < t; o++, a++) {
		let e = 0, s = this.bMarks[o], c = s, l;
		for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
			let t = this.src.charCodeAt(c);
			if (j(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
			else if (c - s < this.tShift[o]) e++;
			else break;
			c++;
		}
		e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
	}
	return i.join("");
}, I.prototype.Token = F;
var Pt = 65536;
function Ft(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function It(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Lt(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !j(s) || o === 45 && j(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !j(t)) return !1;
		a++;
	}
	let c = Ft(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Ft(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = It(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = Ft(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = It(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Pt)) break;
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
function Rt(e, t, n) {
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
function zt(e, t, n, r) {
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
function Bt(e, t, n, r) {
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
				if (j(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function Vt(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !j(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Ht(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !j(e.src.charCodeAt(r)) ? -1 : r;
}
function Ut(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !j(a)) ? -1 : i;
}
function Wt(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Gt(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Ut(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Ht(e, c)) >= 0) d = !1;
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
		let y = e.tight, b = e.tShift[c], ee = e.sCount[c], x = e.listIndent;
		if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = x, e.tShift[c] = b, e.sCount[c] = ee, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
		let S = !1;
		for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
			S = !0;
			break;
		}
		if (S) break;
		if (d) {
			if (p = Ut(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Ht(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && Wt(e, h), !0;
}
function Kt(e, t, n, r) {
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
		} else if (!j(e)) break;
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
		} else if (!j(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && j(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && j(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Qe(c.slice(1, l));
	return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
		title: g,
		href: d
	}), e.line = o, !0) : !1;
}
var qt = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Jt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), Yt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), L = [
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
		RegExp("^</?(" + qt.join("|") + ")(?=(\\s|/?>|$))", "i"),
		/^$/,
		!0
	],
	[
		RegExp(Yt.source + "\\s*$"),
		/^$/,
		!1
	]
];
function Xt(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < L.length && !L[s][0].test(o); s++);
	if (s === L.length) return !1;
	if (r) return L[s][2];
	let c = t + 1, l = L[s][1].test("");
	if (!L[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), L[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function Zt(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !j(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && j(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", "h" + String(s), 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = et(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", "h" + String(s), -1);
	return d.markup = "########".slice(0, s), !0;
}
function Qt(e, t, n) {
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
	let c = et(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", "h" + String(a), 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", "h" + String(a), -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function $t(e, t, n) {
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
	let o = et(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var en = [
	[
		"table",
		Lt,
		["paragraph", "reference"]
	],
	["code", Rt],
	[
		"fence",
		zt,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Bt,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Vt,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Gt,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", Kt],
	[
		"html_block",
		Xt,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Zt,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Qt],
	["paragraph", $t]
];
function tn() {
	this.ruler = new P();
	for (let e = 0; e < en.length; e++) this.ruler.push(en[e][0], en[e][1], { alt: (en[e][2] || []).slice() });
}
tn.prototype.tokenize = function(e, t, n) {
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
}, tn.prototype.parse = function(e, t, n, r) {
	if (!e) return;
	let i = new this.State(e, t, n, r);
	this.tokenize(i, i.line, i.lineMax);
}, tn.prototype.State = I;
function nn(e, t, n, r) {
	this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
nn.prototype.pushPending = function() {
	let e = new F("text", "", 0);
	return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
}, nn.prototype.push = function(e, t, n) {
	this.pending && this.pushPending();
	let r = new F(e, t, n), i = null;
	return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
}, nn.prototype.scanDelims = function(e, t) {
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
	let c = Ze(i) || M(i), l = Ze(s) || M(s), u = Ye(i), d = Ye(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
	return {
		can_open: f && (t || !p || c),
		can_close: p && (t || !f || l),
		length: o
	};
}, nn.prototype.Token = F;
function R(e) {
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
function rn(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !R(e.src.charCodeAt(n));) n++;
	return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
var an = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function on(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = e.pending.match(an);
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
function sn(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 10) return !1;
	let r = e.pending.length - 1, i = e.posMax;
	if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
		let t = r - 1;
		for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
		e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
	} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
	else e.push("softbreak", "br", 0);
	for (n++; n < i && j(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var cn = [];
for (let e = 0; e < 256; e++) cn.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	cn[e.charCodeAt(0)] = 1;
});
function ln(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), j(i));) n++;
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
		i < 256 && cn[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function un(e, t) {
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
function dn(e, t) {
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
function fn(e, t) {
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
function pn(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	fn(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && fn(e, t[r].delimiters);
}
var mn = {
	tokenize: dn,
	postProcess: pn
};
function hn(e, t) {
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
function gn(e, t) {
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
function _n(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	gn(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && gn(e, t[r].delimiters);
}
var vn = {
	tokenize: hn,
	postProcess: _n
};
function yn(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!j(n) && n !== 10)); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!j(n) && n !== 10)); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!j(n) && n !== 10)); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[Qe(r)], !a) return e.pos = u, !1;
		o = a.href, s = a.title;
	}
	if (!t) {
		e.pos = f, e.posMax = p;
		let t = e.push("link_open", "a", 1), n = [["href", o]];
		t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
	}
	return e.pos = m, e.posMax = d, !0;
}
function bn(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), !(!j(n) && n !== 10)); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!j(n) && n !== 10)); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!j(n) && n !== 10)); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[Qe(i)], !o) return e.pos = d, !1;
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
var xn = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Sn = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Cn(e, t) {
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
	if (Sn.test(a)) {
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
	if (xn.test(a)) {
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
function wn(e) {
	return /^<a[>\s]/i.test(e);
}
function Tn(e) {
	return /^<\/a\s*>/i.test(e);
}
function En(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Dn(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !En(i)) return !1;
	let a = e.src.slice(r).match(Jt);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], wn(t.content) && e.linkLevel++, Tn(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var On = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, kn = /^&([a-z][a-z0-9]{1,31});/i;
function An(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(On);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = Pe(t) ? Fe(t) : Fe(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(kn);
		if (r) {
			let n = Ee(r[0]);
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
function jn(e) {
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
function Mn(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	jn(e.delimiters);
	for (let e = 0; e < n; e++) t[e] && t[e].delimiters && jn(t[e].delimiters);
}
function Nn(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Pn = [
	["text", rn],
	["linkify", on],
	["newline", sn],
	["escape", ln],
	["backticks", un],
	["strikethrough", mn.tokenize],
	["emphasis", vn.tokenize],
	["link", yn],
	["image", bn],
	["autolink", Cn],
	["html_inline", Dn],
	["entity", An]
], Fn = [
	["balance_pairs", Mn],
	["strikethrough", mn.postProcess],
	["emphasis", vn.postProcess],
	["fragments_join", Nn]
];
function In() {
	this.ruler = new P();
	for (let e = 0; e < Pn.length; e++) this.ruler.push(Pn[e][0], Pn[e][1]);
	this.ruler2 = new P();
	for (let e = 0; e < Fn.length; e++) this.ruler2.push(Fn[e][0], Fn[e][1]);
}
In.prototype.skipToken = function(e) {
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
}, In.prototype.tokenize = function(e) {
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
}, In.prototype.parse = function(e, t, n, r) {
	let i = new this.State(e, t, n, r);
	this.tokenize(i);
	let a = this.ruler2.getRules(""), o = a.length;
	for (let e = 0; e < o; e++) a[e](i);
}, In.prototype.State = nn;
function Ln(e) {
	let t = {};
	e ||= {}, t.src_Any = oe.source, t.src_Cc = se.source, t.src_Z = de.source, t.src_P = le.source, t.src_ZPCc = [
		t.src_Z,
		t.src_P,
		t.src_Cc
	].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
	let n = "[><｜]";
	return t.src_pseudo_letter = `(?:(?!${n}|${t.src_ZPCc})${t.src_Any})`, t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = `(?=$|${n}|${t.src_ZPCc})(?!${e["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`, t.src_path = `(?:[/?#](?:(?!${t.src_ZCc}|${n}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`, t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + `|${t.src_pseudo_letter}{1,63})`, t.src_domain = "(?:" + t.src_xn + `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`, t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`, t.tpl_host_fuzzy = "(?:" + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`, t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`, t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`, t.tpl_email_fuzzy = `(^|${n}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`, t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`, t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`, t;
}
function Rn(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		t && Object.keys(t).forEach(function(n) {
			e[n] = t[n];
		});
	}), e;
}
function zn(e) {
	return Object.prototype.toString.call(e);
}
function Bn(e) {
	return zn(e) === "[object String]";
}
function Vn(e) {
	return zn(e) === "[object Object]";
}
function Hn(e) {
	return zn(e) === "[object RegExp]";
}
function Un(e) {
	return zn(e) === "[object Function]";
}
function Wn(e) {
	return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var Gn = {
	fuzzyLink: !0,
	fuzzyEmail: !0,
	fuzzyIP: !1
};
function Kn(e) {
	return Object.keys(e || {}).reduce(function(e, t) {
		return e || Gn.hasOwnProperty(t);
	}, !1);
}
var qn = {
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
}, Jn = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Yn = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Xn(e) {
	return function(t, n) {
		let r = t.slice(n);
		return e.test(r) ? r.match(e)[0].length : 0;
	};
}
function Zn() {
	return function(e, t) {
		t.normalize(e);
	};
}
function Qn(e) {
	let t = e.re = Ln(e.__opts__), n = e.__tlds__.slice();
	e.onCompile(), e.__tlds_replaced__ || n.push(Jn), n.push(t.src_xn), t.src_tlds = n.join("|");
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
		if (e.__compiled__[t] = r, Vn(n)) {
			Hn(n.validate) ? r.validate = Xn(n.validate) : Un(n.validate) ? r.validate = n.validate : a(t, n), Un(n.normalize) ? r.normalize = n.normalize : n.normalize ? a(t, n) : r.normalize = Zn();
			return;
		}
		if (Bn(n)) {
			i.push(t);
			return;
		}
		a(t, n);
	}), i.forEach(function(t) {
		e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
	}), e.__compiled__[""] = {
		validate: null,
		normalize: Zn()
	};
	let o = Object.keys(e.__compiled__).filter(function(t) {
		return t.length > 0 && e.__compiled__[t];
	}).map(Wn).join("|");
	e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "i"), e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, "ig"), e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, "i"), e.re.pretest = RegExp(`(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`, "i");
}
function $n(e, t, n, r) {
	let i = e.slice(n, r);
	this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
}
function z(e, t) {
	if (!(this instanceof z)) return new z(e, t);
	t || Kn(e) && (t = e, e = {}), this.__opts__ = Rn({}, Gn, t), this.__schemas__ = Rn({}, qn, e), this.__compiled__ = {}, this.__tlds__ = Yn, this.__tlds_replaced__ = !1, this.re = {}, Qn(this);
}
z.prototype.add = function(e, t) {
	return this.__schemas__[e] = t, Qn(this), this;
}, z.prototype.set = function(e) {
	return this.__opts__ = Rn(this.__opts__, e), this;
}, z.prototype.test = function(e) {
	if (!e.length) return !1;
	let t, n;
	if (this.re.schema_test.test(e)) {
		for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
	}
	return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
}, z.prototype.pretest = function(e) {
	return this.re.pretest.test(e);
}, z.prototype.testSchemaAt = function(e, t, n) {
	return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
}, z.prototype.match = function(e) {
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
		let s = new $n(e, o.schema, o.index, o.lastIndex);
		this.__compiled__[s.schema].normalize(s, this), t.push(s), u = o.lastIndex;
	}
	return t.length ? t : null;
}, z.prototype.matchAtStart = function(e) {
	if (!e.length) return null;
	let t = this.re.schema_at_start.exec(e);
	if (!t) return null;
	let n = this.testSchemaAt(e, t[2], t[0].length);
	if (!n) return null;
	let r = new $n(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
	return this.__compiled__[r.schema].normalize(r, this), r;
}, z.prototype.tlds = function(e, t) {
	return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
		return e !== n[t - 1];
	}).reverse(), Qn(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Qn(this), this);
}, z.prototype.normalize = function(e) {
	e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
}, z.prototype.onCompile = function() {};
var er = /* @__PURE__ */ i({
	decode: () => Cr,
	default: () => Dr,
	encode: () => wr,
	toASCII: () => Er,
	toUnicode: () => Tr,
	ucs2decode: () => ir,
	ucs2encode: () => yr
});
function tr(e) {
	throw RangeError(gr[e]);
}
function nr(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function rr(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(hr, ".");
	let i = nr(e.split("."), t).join(".");
	return r + i;
}
function ir(e) {
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
var ar, B, or, sr, cr, lr, ur, dr, fr, pr, mr, hr, gr, _r, V, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or = r((() => {
	ar = 2147483647, B = 36, or = 1, sr = 26, cr = 38, lr = 700, ur = 72, dr = 128, fr = "-", pr = /^xn--/, mr = /[^\0-\x7F]/, hr = /[\x2E\u3002\uFF0E\uFF61]/g, gr = {
		overflow: "Overflow: input needs wider integers to process",
		"not-basic": "Illegal input >= 0x80 (not a basic code point)",
		"invalid-input": "Invalid input"
	}, _r = B - or, V = Math.floor, vr = String.fromCharCode, yr = (e) => String.fromCodePoint(...e), br = function(e) {
		return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : B;
	}, xr = function(e, t) {
		return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
	}, Sr = function(e, t, n) {
		let r = 0;
		for (e = n ? V(e / lr) : e >> 1, e += V(e / t); e > 455; r += B) e = V(e / _r);
		return V(r + 36 * e / (e + cr));
	}, Cr = function(e) {
		let t = [], n = e.length, r = 0, i = dr, a = ur, o = e.lastIndexOf(fr);
		o < 0 && (o = 0);
		for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && tr("not-basic"), t.push(e.charCodeAt(n));
		for (let s = o > 0 ? o + 1 : 0; s < n;) {
			let o = r;
			for (let t = 1, i = B;; i += B) {
				s >= n && tr("invalid-input");
				let o = br(e.charCodeAt(s++));
				o >= B && tr("invalid-input"), o > V((ar - r) / t) && tr("overflow"), r += o * t;
				let c = i <= a ? or : i >= a + sr ? sr : i - a;
				if (o < c) break;
				let l = B - c;
				t > V(ar / l) && tr("overflow"), t *= l;
			}
			let c = t.length + 1;
			a = Sr(r - o, c, o == 0), V(r / c) > ar - i && tr("overflow"), i += V(r / c), r %= c, t.splice(r++, 0, i);
		}
		return String.fromCodePoint(...t);
	}, wr = function(e) {
		let t = [];
		e = ir(e);
		let n = e.length, r = dr, i = 0, a = ur;
		for (let n of e) n < 128 && t.push(vr(n));
		let o = t.length, s = o;
		for (o && t.push(fr); s < n;) {
			let n = ar;
			for (let t of e) t >= r && t < n && (n = t);
			let c = s + 1;
			n - r > V((ar - i) / c) && tr("overflow"), i += (n - r) * c, r = n;
			for (let n of e) if (n < r && ++i > ar && tr("overflow"), n === r) {
				let e = i;
				for (let n = B;; n += B) {
					let r = n <= a ? or : n >= a + sr ? sr : n - a;
					if (e < r) break;
					let i = e - r, o = B - r;
					t.push(vr(xr(r + i % o, 0))), e = V(i / o);
				}
				t.push(vr(xr(e, 0))), a = Sr(i, c, s === o), i = 0, ++s;
			}
			++i, ++r;
		}
		return t.join("");
	}, Tr = function(e) {
		return rr(e, function(e) {
			return pr.test(e) ? Cr(e.slice(4).toLowerCase()) : e;
		});
	}, Er = function(e) {
		return rr(e, function(e) {
			return mr.test(e) ? "xn--" + wr(e) : e;
		});
	}, Dr = {
		version: "2.3.1",
		ucs2: {
			decode: ir,
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
	let t = ie(e, !0);
	if (t.hostname && (!t.protocol || Nr.indexOf(t.protocol) >= 0)) try {
		t.hostname = Dr.toASCII(t.hostname);
	} catch {}
	return g(_(t));
}
function Fr(e) {
	let t = ie(e, !0);
	if (t.hostname && (!t.protocol || Nr.indexOf(t.protocol) >= 0)) try {
		t.hostname = Dr.toUnicode(t.hostname);
	} catch {}
	return p(_(t), p.defaultChars + "%");
}
function H(e, t) {
	if (!(this instanceof H)) return new H(e, t);
	t || ke(e) || (t = e || {}, e = "default"), this.inline = new In(), this.block = new tn(), this.core = new Nt(), this.renderer = new ot(), this.linkify = new z(), this.validateLink = Mr, this.normalizeLink = Pr, this.normalizeLinkText = Fr, this.utils = De, this.helpers = Me({}, at), this.options = {}, this.configure(e), t && this.set(t);
}
H.prototype.set = function(e) {
	return Me(this.options, e), this;
}, H.prototype.configure = function(e) {
	let t = this;
	if (ke(e)) {
		let t = e;
		if (e = kr[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
	}
	if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
	return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
		e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
	}), this;
}, H.prototype.enable = function(e, t) {
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
}, H.prototype.disable = function(e, t) {
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
}, H.prototype.use = function(e) {
	let t = [this].concat(Array.prototype.slice.call(arguments, 1));
	return e.apply(e, t), this;
}, H.prototype.parse = function(e, t) {
	if (typeof e != "string") throw Error("Input data should be a String");
	let n = new this.core.State(e, this, t);
	return this.core.process(n), n.tokens;
}, H.prototype.render = function(e, t) {
	return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
}, H.prototype.parseInline = function(e, t) {
	let n = new this.core.State(e, this, t);
	return n.inlineMode = !0, this.core.process(n), n.tokens;
}, H.prototype.renderInline = function(e, t) {
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
var Zr = /* @__PURE__ */ t(((e) => {
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
})), Qr = /* @__PURE__ */ t(((e) => {
	e.Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, e.Cc = /[\0-\x1F\x7F-\x9F]/, e.Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, e.P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, e.S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, e.Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
})), $r = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), ei = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(e) {
		return e.charCodeAt(0);
	}));
})), ti = /* @__PURE__ */ t(((e) => {
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
})), ni = /* @__PURE__ */ t(((e) => {
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
	var ee = y(a.default), x = y(o.default);
	function S(e, t) {
		return t === void 0 && (t = _.Legacy), ee(e, t);
	}
	e.decodeHTML = S;
	function te(e) {
		return ee(e, _.Attribute);
	}
	e.decodeHTMLAttribute = te;
	function C(e) {
		return ee(e, _.Strict);
	}
	e.decodeHTMLStrict = C;
	function w(e) {
		return x(e, _.Strict);
	}
	e.decodeXML = w;
})), ri = /* @__PURE__ */ t(((e) => {
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
})), ii = /* @__PURE__ */ t(((e) => {
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
})), ai = /* @__PURE__ */ t(((e) => {
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
})), oi = /* @__PURE__ */ t(((e) => {
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
})), si = /* @__PURE__ */ t(((e, t) => {
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
})), ci = /* @__PURE__ */ t(((e, t) => {
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
	}) : n, e)), f = Zr();
	f = d(f, 1);
	var p = Qr();
	p = d(p, 1);
	var m = oi(), h = si();
	h = d(h, 1);
	var g = (Or(), n(er));
	g = d(g, 1);
	var _ = /* @__PURE__ */ l({
		arrayReplaceAt: () => S,
		asciiTrim: () => ye,
		assign: () => x,
		escapeHtml: () => de,
		escapeRE: () => pe,
		fromCodePoint: () => C,
		has: () => ee,
		isMdAsciiPunct: () => E,
		isPunctChar: () => he,
		isPunctCharCode: () => ge,
		isSpace: () => T,
		isString: () => y,
		isValidEntityCode: () => te,
		isWhiteSpace: () => me,
		lib: () => be,
		normalizeReference: () => _e,
		unescapeAll: () => oe,
		unescapeMd: () => ae
	});
	function v(e) {
		return Object.prototype.toString.call(e);
	}
	function y(e) {
		return v(e) === "[object String]";
	}
	var b = Object.prototype.hasOwnProperty;
	function ee(e, t) {
		return b.call(e, t);
	}
	function x(e) {
		return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
			if (t) {
				if (typeof t != "object") throw TypeError(t + "must be object");
				Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}
		}), e;
	}
	function S(e, t, n) {
		return [].concat(e.slice(0, t), n, e.slice(t + 1));
	}
	function te(e) {
		return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
	}
	function C(e) {
		if (e > 65535) {
			e -= 65536;
			let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
			return String.fromCharCode(t, n);
		}
		return String.fromCharCode(e);
	}
	var w = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, ne = RegExp(w.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), re = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
	function ie(e, t) {
		if (t.charCodeAt(0) === 35 && re.test(t)) {
			let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
			return te(n) ? C(n) : e;
		}
		let n = (0, m.decodeHTML)(e);
		return n === e ? e : n;
	}
	function ae(e) {
		return e.indexOf("\\") < 0 ? e : e.replace(w, "$1");
	}
	function oe(e) {
		return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(ne, function(e, t, n) {
			return t || ie(e, n);
		});
	}
	var se = /[&<>"]/, ce = /[&<>"]/g, le = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function ue(e) {
		return le[e];
	}
	function de(e) {
		return se.test(e) ? e.replace(ce, ue) : e;
	}
	var fe = /[.?*+^$[\]\\(){}|-]/g;
	function pe(e) {
		return e.replace(fe, "\\$&");
	}
	function T(e) {
		switch (e) {
			case 9:
			case 32: return !0;
		}
		return !1;
	}
	function me(e) {
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
	function he(e) {
		return p.P.test(e) || p.S.test(e);
	}
	function ge(e) {
		return he(C(e));
	}
	function E(e) {
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
	function _e(e) {
		return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
	}
	function ve(e) {
		return e === 32 || e === 9 || e === 10 || e === 13;
	}
	function ye(e) {
		let t = 0;
		for (; t < e.length && ve(e.charCodeAt(t)); t++);
		let n = e.length - 1;
		for (; n >= t && ve(e.charCodeAt(n)); n--);
		return e.slice(t, n + 1);
	}
	var be = {
		mdurl: f,
		ucmicro: p
	};
	function xe(e, t, n) {
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
	function Se(e, t, n) {
		let r, i = t, a = {
			ok: !1,
			pos: 0,
			str: ""
		};
		if (e.charCodeAt(i) === 60) {
			for (i++; i < n;) {
				if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
				if (r === 62) return a.pos = i + 1, a.str = oe(e.slice(t + 1, i)), a.ok = !0, a;
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
		return t === i || o !== 0 ? a : (a.str = oe(e.slice(t, i)), a.pos = i, a.ok = !0, a);
	}
	function D(e, t, n, r) {
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
			if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += oe(e.slice(t, a)), o.ok = !0, o;
			if (i === 40 && o.marker === 41) return o;
			i === 92 && a + 1 < n && a++, a++;
		}
		return o.can_continue = !0, o.str += oe(e.slice(t, a)), o;
	}
	var Ce = /* @__PURE__ */ l({
		parseLinkDestination: () => Se,
		parseLinkLabel: () => xe,
		parseLinkTitle: () => D
	}), O = {};
	O.code_inline = function(e, t, n, r, i) {
		let a = e[t];
		return "<code" + i.renderAttrs(a) + ">" + de(a.content) + "</code>";
	}, O.code_block = function(e, t, n, r, i) {
		let a = e[t];
		return "<pre" + i.renderAttrs(a) + "><code>" + de(e[t].content) + "</code></pre>\n";
	}, O.fence = function(e, t, n, r, i) {
		let a = e[t], o = a.info ? oe(a.info).trim() : "", s = "", c = "";
		if (o) {
			let e = o.split(/(\s+)/g);
			s = e[0], c = e.slice(2).join("");
		}
		let l;
		if (l = n.highlight && n.highlight(a.content, s, c) || de(a.content), l.indexOf("<pre") === 0) return l + "\n";
		if (o) {
			let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
			e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
			let r = { attrs: t };
			return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
		}
		return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
	}, O.image = function(e, t, n, r, i) {
		let a = e[t];
		return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
	}, O.hardbreak = function(e, t, n) {
		return n.xhtmlOut ? "<br />\n" : "<br>\n";
	}, O.softbreak = function(e, t, n) {
		return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
	}, O.text = function(e, t) {
		return de(e[t].content);
	}, O.html_block = function(e, t) {
		return e[t].content;
	}, O.html_inline = function(e, t) {
		return e[t].content;
	};
	function we() {
		this.rules = x({}, O);
	}
	we.prototype.renderAttrs = function(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + de(e.attrs[t][0]) + "=\"" + de(e.attrs[t][1]) + "\"";
		return r;
	}, we.prototype.renderToken = function(e, t, n) {
		let r = e[t], i = "";
		if (r.hidden) return "";
		r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
		let a = !1;
		if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
			let n = e[t + 1];
			(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
		}
		return i += a ? ">\n" : ">", i;
	}, we.prototype.renderInline = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
		}
		return r;
	}, we.prototype.renderInlineAsText = function(e, t, n) {
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
	}, we.prototype.render = function(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
		}
		return r;
	};
	function k() {
		this.__rules__ = [], this.__cache__ = null;
	}
	k.prototype.__find__ = function(e) {
		for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
		return -1;
	}, k.prototype.__compile__ = function() {
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
	}, k.prototype.at = function(e, t, n) {
		let r = this.__find__(e), i = n || {};
		if (r === -1) throw Error("Parser rule not found: " + e);
		this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
	}, k.prototype.before = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, k.prototype.after = function(e, t, n, r) {
		let i = this.__find__(e), a = r || {};
		if (i === -1) throw Error("Parser rule not found: " + e);
		this.__rules__.splice(i + 1, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: a.alt || []
		}), this.__cache__ = null;
	}, k.prototype.push = function(e, t, n) {
		let r = n || {};
		this.__rules__.push({
			name: e,
			enabled: !0,
			fn: t,
			alt: r.alt || []
		}), this.__cache__ = null;
	}, k.prototype.enable = function(e, t) {
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
	}, k.prototype.enableOnly = function(e, t) {
		Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
			e.enabled = !1;
		}), this.enable(e, t);
	}, k.prototype.disable = function(e, t) {
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
	}, k.prototype.getRules = function(e) {
		return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
	};
	function A(e, t, n) {
		this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
	}
	A.prototype.attrIndex = function(e) {
		if (!this.attrs) return -1;
		let t = this.attrs;
		for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
		return -1;
	}, A.prototype.attrPush = function(e) {
		this.attrs ? this.attrs.push(e) : this.attrs = [e];
	}, A.prototype.attrSet = function(e, t) {
		let n = this.attrIndex(e), r = [e, t];
		n < 0 ? this.attrPush(r) : this.attrs[n] = r;
	}, A.prototype.attrGet = function(e) {
		let t = this.attrIndex(e), n = null;
		return t >= 0 && (n = this.attrs[t][1]), n;
	}, A.prototype.attrJoin = function(e, t) {
		let n = this.attrIndex(e);
		n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
	};
	function Te(e, t, n) {
		this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
	}
	Te.prototype.Token = A;
	var Ee = /\r\n?|\n/g, De = /\0/g;
	function Oe(e) {
		let t;
		t = e.src.replace(Ee, "\n"), t = t.replace(De, "�"), e.src = t;
	}
	function ke(e) {
		let t;
		e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
	}
	function Ae(e) {
		let t = e.tokens;
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
		}
	}
	function je(e) {
		return /^<a[>\s]/i.test(e);
	}
	function Me(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Ne(e) {
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
				if (o.type === "html_inline" && (je(o.content) && i > 0 && i--, Me(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
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
					t[n].children = r = S(r, a, c);
				}
			}
		}
	}
	var Pe = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Fe = /\((c|tm|r)\)/i, Ie = /\((c|tm|r)\)/gi, Le = {
		c: "©",
		r: "®",
		tm: "™"
	};
	function Re(e, t) {
		return Le[t.toLowerCase()];
	}
	function ze(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && (r.content = r.content.replace(Ie, Re)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Be(e) {
		let t = 0;
		for (let n = e.length - 1; n >= 0; n--) {
			let r = e[n];
			r.type === "text" && !t && Pe.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
		}
	}
	function Ve(e) {
		let t;
		if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (Fe.test(e.tokens[t].content) && ze(e.tokens[t].children), Pe.test(e.tokens[t].content) && Be(e.tokens[t].children));
	}
	var He = /['"]/, Ue = /['"]/g, We = "’";
	function Ge(e, t, n, r) {
		e[t] || (e[t] = []), e[t].push({
			pos: n,
			ch: r
		});
	}
	function Ke(e, t) {
		let n = "", r = 0;
		t.sort((e, t) => e.pos - t.pos);
		for (let i = 0; i < t.length; i++) {
			let a = t[i];
			n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
		}
		return n + e.slice(r);
	}
	function qe(e, t) {
		let n, r = [], i = {};
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = e[a].level;
			for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
			if (r.length = n + 1, o.type !== "text") continue;
			let c = o.content, l = 0, u = c.length;
			OUTER: for (; l < u;) {
				Ue.lastIndex = l;
				let o = Ue.exec(c);
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
				let g = E(m) || ge(m), _ = E(h) || ge(h), v = me(m), y = me(h);
				if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && o[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
					p && Ge(i, a, o.index, We);
					continue;
				}
				if (f) for (n = r.length - 1; n >= 0; n--) {
					let e = r[n];
					if (r[n].level < s) break;
					if (e.single === p && r[n].level === s) {
						e = r[n];
						let s, c;
						p ? (s = t.md.options.quotes[2], c = t.md.options.quotes[3]) : (s = t.md.options.quotes[0], c = t.md.options.quotes[1]), Ge(i, a, o.index, c), Ge(i, e.token, e.pos, s), r.length = n;
						continue OUTER;
					}
				}
				d ? r.push({
					token: a,
					pos: o.index,
					single: p,
					level: s
				}) : f && p && Ge(i, a, o.index, We);
			}
		}
		Object.keys(i).forEach(function(t) {
			e[t].content = Ke(e[t].content, i[t]);
		});
	}
	function Je(e) {
		if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !He.test(e.tokens[t].content) || qe(e.tokens[t].children, e);
	}
	function j(e) {
		let t, n, r = e.tokens, i = r.length;
		for (let e = 0; e < i; e++) {
			if (r[e].type !== "inline") continue;
			let i = r[e].children, a = i.length;
			for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
			for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
			t !== n && (i.length = n);
		}
	}
	var Ye = [
		["normalize", Oe],
		["block", ke],
		["inline", Ae],
		["linkify", Ne],
		["replacements", Ve],
		["smartquotes", Je],
		["text_join", j]
	];
	function Xe() {
		this.ruler = new k();
		for (let e = 0; e < Ye.length; e++) this.ruler.push(Ye[e][0], Ye[e][1]);
	}
	Xe.prototype.process = function(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}, Xe.prototype.State = Te;
	function M(e, t, n, r) {
		this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) if (T(s)) {
				n++, s === 9 ? r += 4 - r % 4 : r++;
				continue;
			} else o = !0;
			(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
		}
		this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
	}
	M.prototype.push = function(e, t, n) {
		let r = new A(e, t, n);
		return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
	}, M.prototype.isEmpty = function(e) {
		return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
	}, M.prototype.skipEmptyLines = function(e) {
		for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
		return e;
	}, M.prototype.skipSpaces = function(e) {
		for (let t = this.src.length; e < t && T(this.src.charCodeAt(e)); e++);
		return e;
	}, M.prototype.skipSpacesBack = function(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!T(this.src.charCodeAt(--e))) return e + 1;
		return e;
	}, M.prototype.skipChars = function(e, t) {
		for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
		return e;
	}, M.prototype.skipCharsBack = function(e, t, n) {
		if (e <= n) return e;
		for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
		return e;
	}, M.prototype.getLines = function(e, t, n, r) {
		if (e >= t) return "";
		let i = Array(t - e);
		for (let a = 0, o = e; o < t; o++, a++) {
			let e = 0, s = this.bMarks[o], c = s, l;
			for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
				let t = this.src.charCodeAt(c);
				if (T(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}, M.prototype.Token = A;
	var Ze = 65536;
	function Qe(e, t) {
		let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
		return e.src.slice(n, r);
	}
	function $e(e) {
		let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
		for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
		return t.push(s + e.substring(o)), t;
	}
	function et(e, t, n, r) {
		if (t + 2 > n) return !1;
		let i = t + 1;
		if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[i] + e.tShift[i];
		if (a >= e.eMarks[i]) return !1;
		let o = e.src.charCodeAt(a++);
		if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
		let s = e.src.charCodeAt(a++);
		if (s !== 124 && s !== 45 && s !== 58 && !T(s) || o === 45 && T(s)) return !1;
		for (; a < e.eMarks[i];) {
			let t = e.src.charCodeAt(a);
			if (t !== 124 && t !== 45 && t !== 58 && !T(t)) return !1;
			a++;
		}
		let c = Qe(e, t + 1), l = c.split("|"), u = [];
		for (let e = 0; e < l.length; e++) {
			let t = l[e].trim();
			if (!t) {
				if (e === 0 || e === l.length - 1) continue;
				return !1;
			}
			if (!/^:?-+:?$/.test(t)) return !1;
			t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
		}
		if (c = Qe(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
		l = $e(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
			if (r || (c = Qe(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = $e(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Ze)) break;
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
	function tt(e, t, n) {
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
	function nt(e, t, n, r) {
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
	function rt(e, t, n, r) {
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
					if (T(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
	function it(e, t, n, r) {
		let i = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
		if (o !== 42 && o !== 45 && o !== 95) return !1;
		let s = 1;
		for (; a < i;) {
			let t = e.src.charCodeAt(a++);
			if (t !== o && !T(t)) return !1;
			t === o && s++;
		}
		if (s < 3) return !1;
		if (r) return !0;
		e.line = t + 1;
		let c = e.push("hr", "hr", 0);
		return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
	}
	function at(e, t) {
		let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
		return i !== 42 && i !== 45 && i !== 43 || r < n && !T(e.src.charCodeAt(r)) ? -1 : r;
	}
	function N(e, t) {
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
		return i < r && (a = e.src.charCodeAt(i), !T(a)) ? -1 : i;
	}
	function ot(e, t) {
		let n = e.level + 2;
		for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
	}
	function P(e, t, n, r) {
		let i, a, o, s, c = t, l = !0;
		if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
		let u = !1;
		r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
		let d, f, p;
		if ((p = N(e, c)) >= 0) {
			if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
		} else if ((p = at(e, c)) >= 0) d = !1;
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
			let y = e.tight, b = e.tShift[c], ee = e.sCount[c], x = e.listIndent;
			if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = x, e.tShift[c] = b, e.sCount[c] = ee, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
			let S = !1;
			for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
				S = !0;
				break;
			}
			if (S) break;
			if (d) {
				if (p = N(e, c), p < 0) break;
				o = e.bMarks[c] + e.tShift[c];
			} else if (p = at(e, c), p < 0) break;
			if (m !== e.src.charCodeAt(p - 1)) break;
		}
		return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && ot(e, h), !0;
	}
	function F(e, t, n, r) {
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
			} else if (!T(e)) break;
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
			} else if (!T(e)) break;
		}
		let h = e.md.helpers.parseLinkTitle(c, i, a);
		for (; h.can_continue;) {
			let t = s(o);
			if (t === null) break;
			c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
		}
		let g;
		for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && T(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && T(c.charCodeAt(i));) i++;
		if (i < a && c.charCodeAt(i) !== 10) return !1;
		let _ = _e(c.slice(1, l));
		return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
			title: g,
			href: d
		}), e.line = o, !0) : !1;
	}
	var st = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), ct = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), lt = /* @__PURE__ */ RegExp("^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), ut = [
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
			RegExp("^</?(" + st.join("|") + ")(?=(\\s|/?>|$))", "i"),
			/^$/,
			!0
		],
		[
			RegExp(lt.source + "\\s*$"),
			/^$/,
			!1
		]
	];
	function dt(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
		let o = e.src.slice(i, a), s = 0;
		for (; s < ut.length && !ut[s][0].test(o); s++);
		if (s === ut.length) return !1;
		if (r) return ut[s][2];
		let c = t + 1, l = ut[s][1].test("");
		if (!ut[s][1].test(o)) {
			for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), ut[s][1].test(o)) {
				o.length !== 0 && c++;
				break;
			}
		}
		e.line = c;
		let u = e.push("html_block", "", 0);
		return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
	}
	function ft(e, t, n, r) {
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		if (e.sCount[t] - e.blkIndent >= 4) return !1;
		let o = e.src.charCodeAt(i);
		if (o !== 35 || i >= a) return !1;
		let s = 1;
		for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
		if (s > 6 || i < a && !T(o)) return !1;
		if (r) return !0;
		a = e.skipSpacesBack(a, i);
		let c = e.skipCharsBack(a, 35, i);
		c > i && T(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
		let l = e.push("heading_open", "h" + String(s), 1);
		l.markup = "########".slice(0, s), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = ye(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
		let d = e.push("heading_close", "h" + String(s), -1);
		return d.markup = "########".slice(0, s), !0;
	}
	function pt(e, t, n) {
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
		let c = ye(e.getLines(t, s, e.blkIndent, !1));
		e.line = s + 1;
		let l = e.push("heading_open", "h" + String(a), 1);
		l.markup = String.fromCharCode(o), l.map = [t, e.line];
		let u = e.push("inline", "", 0);
		u.content = c, u.map = [t, e.line - 1], u.children = [];
		let d = e.push("heading_close", "h" + String(a), -1);
		return d.markup = String.fromCharCode(o), e.parentType = i, !0;
	}
	function mt(e, t, n) {
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
		let o = ye(e.getLines(t, a, e.blkIndent, !1));
		e.line = a;
		let s = e.push("paragraph_open", "p", 1);
		s.map = [t, e.line];
		let c = e.push("inline", "", 0);
		return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
	}
	var ht = [
		[
			"table",
			et,
			["paragraph", "reference"]
		],
		["code", tt],
		[
			"fence",
			nt,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"blockquote",
			rt,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"hr",
			it,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"list",
			P,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["reference", F],
		[
			"html_block",
			dt,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		[
			"heading",
			ft,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["lheading", pt],
		["paragraph", mt]
	];
	function gt() {
		this.ruler = new k();
		for (let e = 0; e < ht.length; e++) this.ruler.push(ht[e][0], ht[e][1], { alt: (ht[e][2] || []).slice() });
	}
	gt.prototype.tokenize = function(e, t, n) {
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
	}, gt.prototype.parse = function(e, t, n, r) {
		if (!e) return;
		let i = new this.State(e, t, n, r);
		this.tokenize(i, i.line, i.lineMax);
	}, gt.prototype.State = M;
	function _t(e, t, n, r) {
		this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
	}
	_t.prototype.pushPending = function() {
		let e = new A("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}, _t.prototype.push = function(e, t, n) {
		this.pending && this.pushPending();
		let r = new A(e, t, n), i = null;
		return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
	}, _t.prototype.scanDelims = function(e, t) {
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
		let c = E(i) || ge(i), l = E(s) || ge(s), u = me(i), d = me(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}, _t.prototype.Token = A;
	function vt(e) {
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
	function yt(e, t) {
		let n = e.pos;
		for (; n < e.posMax && !vt(e.src.charCodeAt(n));) n++;
		return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
	}
	var bt = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
	function xt(e, t) {
		if (!e.md.options.linkify || e.linkLevel > 0) return !1;
		let n = e.pos, r = e.posMax;
		if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
		let i = e.pending.match(bt);
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
	function St(e, t) {
		let n = e.pos;
		if (e.src.charCodeAt(n) !== 10) return !1;
		let r = e.pending.length - 1, i = e.posMax;
		if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
			let t = r - 1;
			for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
			e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
		} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
		else e.push("softbreak", "br", 0);
		for (n++; n < i && T(e.src.charCodeAt(n));) n++;
		return e.pos = n, !0;
	}
	var Ct = [];
	for (let e = 0; e < 256; e++) Ct.push(0);
	"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
		Ct[e.charCodeAt(0)] = 1;
	});
	function wt(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
		let i = e.src.charCodeAt(n);
		if (i === 10) {
			for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), T(i));) n++;
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
			i < 256 && Ct[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
		}
		return e.pos = n + 1, !0;
	}
	function Tt(e, t) {
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
	function Et(e, t) {
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
	function Dt(e, t) {
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
	function Ot(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Dt(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Dt(e, t[r].delimiters);
	}
	var kt = {
		tokenize: Et,
		postProcess: Ot
	};
	function At(e, t) {
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
	function jt(e, t) {
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
	function Mt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		jt(e, e.delimiters);
		for (let r = 0; r < n; r++) t[r] && t[r].delimiters && jt(e, t[r].delimiters);
	}
	var Nt = {
		tokenize: At,
		postProcess: Mt
	};
	function I(e, t) {
		let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
		if (e.src.charCodeAt(e.pos) !== 91) return !1;
		let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
		if (p < 0) return !1;
		let m = p + 1;
		if (m < d && e.src.charCodeAt(m) === 40) {
			for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!T(n) && n !== 10)); m++);
			if (m >= d) return !1;
			if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
				for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!T(n) && n !== 10)); m++);
				if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!T(n) && n !== 10)); m++);
			}
			(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
		}
		if (l) {
			if (e.env.references === void 0) return !1;
			if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[_e(r)], !a) return e.pos = u, !1;
			o = a.href, s = a.title;
		}
		if (!t) {
			e.pos = f, e.posMax = p;
			let t = e.push("link_open", "a", 1), n = [["href", o]];
			t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
		}
		return e.pos = m, e.posMax = d, !0;
	}
	function Pt(e, t) {
		let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
		if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
		let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
		if (m < 0) return !1;
		if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
			for (a++; a < f && (n = e.src.charCodeAt(a), !(!T(n) && n !== 10)); a++);
			if (a >= f) return !1;
			for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!T(n) && n !== 10)); a++);
			if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!T(n) && n !== 10)); a++);
			else c = "";
			if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
			a++;
		} else {
			if (e.env.references === void 0) return !1;
			if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[_e(i)], !o) return e.pos = d, !1;
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
	var Ft = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, It = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
	function Lt(e, t) {
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
		if (It.test(a)) {
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
		if (Ft.test(a)) {
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
	function Rt(e) {
		return /^<a[>\s]/i.test(e);
	}
	function zt(e) {
		return /^<\/a\s*>/i.test(e);
	}
	function Bt(e) {
		let t = e | 32;
		return t >= 97 && t <= 122;
	}
	function Vt(e, t) {
		if (!e.md.options.html) return !1;
		let n = e.posMax, r = e.pos;
		if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
		let i = e.src.charCodeAt(r + 1);
		if (i !== 33 && i !== 63 && i !== 47 && !Bt(i)) return !1;
		let a = e.src.slice(r).match(ct);
		if (!a) return !1;
		if (!t) {
			let t = e.push("html_inline", "", 0);
			t.content = a[0], Rt(t.content) && e.linkLevel++, zt(t.content) && e.linkLevel--;
		}
		return e.pos += a[0].length, !0;
	}
	var Ht = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Ut = /^&([a-z][a-z0-9]{1,31});/i;
	function Wt(e, t) {
		let n = e.pos, r = e.posMax;
		if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
		if (e.src.charCodeAt(n + 1) === 35) {
			let r = e.src.slice(n).match(Ht);
			if (r) {
				if (!t) {
					let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
					n.content = te(t) ? C(t) : C(65533), n.markup = r[0], n.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		} else {
			let r = e.src.slice(n).match(Ut);
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
	function Gt(e) {
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
	function Kt(e) {
		let t = e.tokens_meta, n = e.tokens_meta.length;
		Gt(e.delimiters);
		for (let e = 0; e < n; e++) t[e] && t[e].delimiters && Gt(t[e].delimiters);
	}
	function qt(e) {
		let t, n, r = 0, i = e.tokens, a = e.tokens.length;
		for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
	var Jt = [
		["text", yt],
		["linkify", xt],
		["newline", St],
		["escape", wt],
		["backticks", Tt],
		["strikethrough", kt.tokenize],
		["emphasis", Nt.tokenize],
		["link", I],
		["image", Pt],
		["autolink", Lt],
		["html_inline", Vt],
		["entity", Wt]
	], Yt = [
		["balance_pairs", Kt],
		["strikethrough", kt.postProcess],
		["emphasis", Nt.postProcess],
		["fragments_join", qt]
	];
	function L() {
		this.ruler = new k();
		for (let e = 0; e < Jt.length; e++) this.ruler.push(Jt[e][0], Jt[e][1]);
		this.ruler2 = new k();
		for (let e = 0; e < Yt.length; e++) this.ruler2.push(Yt[e][0], Yt[e][1]);
	}
	L.prototype.skipToken = function(e) {
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
	}, L.prototype.tokenize = function(e) {
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
	}, L.prototype.parse = function(e, t, n, r) {
		let i = new this.State(e, t, n, r);
		this.tokenize(i);
		let a = this.ruler2.getRules(""), o = a.length;
		for (let e = 0; e < o; e++) a[e](i);
	}, L.prototype.State = _t;
	var Xt = {
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
	}, Zt = /^(vbscript|javascript|file|data):/, Qt = /^data:image\/(gif|png|jpeg|webp);/;
	function $t(e) {
		let t = e.trim().toLowerCase();
		return !Zt.test(t) || Qt.test(t);
	}
	var en = [
		"http:",
		"https:",
		"mailto:"
	];
	function tn(e) {
		let t = f.parse(e, !0);
		if (t.hostname && (!t.protocol || en.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toASCII(t.hostname);
		} catch {}
		return f.encode(f.format(t));
	}
	function nn(e) {
		let t = f.parse(e, !0);
		if (t.hostname && (!t.protocol || en.indexOf(t.protocol) >= 0)) try {
			t.hostname = g.default.toUnicode(t.hostname);
		} catch {}
		return f.decode(f.format(t), f.decode.defaultChars + "%");
	}
	function R(e, t) {
		if (!(this instanceof R)) return new R(e, t);
		t || y(e) || (t = e || {}, e = "default"), this.inline = new L(), this.block = new gt(), this.core = new Xe(), this.renderer = new we(), this.linkify = new h.default(), this.validateLink = $t, this.normalizeLink = tn, this.normalizeLinkText = nn, this.utils = _, this.helpers = x({}, Ce), this.options = {}, this.configure(e), t && this.set(t);
	}
	R.prototype.set = function(e) {
		return x(this.options, e), this;
	}, R.prototype.configure = function(e) {
		let t = this;
		if (y(e)) {
			let t = e;
			if (e = Xt[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
		}
		if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
		return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
			e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
		}), this;
	}, R.prototype.enable = function(e, t) {
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
	}, R.prototype.disable = function(e, t) {
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
	}, R.prototype.use = function(e) {
		let t = [this].concat(Array.prototype.slice.call(arguments, 1));
		return e.apply(e, t), this;
	}, R.prototype.parse = function(e, t) {
		if (typeof e != "string") throw Error("Input data should be a String");
		let n = new this.core.State(e, this, t);
		return this.core.process(n), n.tokens;
	}, R.prototype.render = function(e, t) {
		return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
	}, R.prototype.parseInline = function(e, t) {
		let n = new this.core.State(e, this, t);
		return n.inlineMode = !0, this.core.process(n), n.tokens;
	}, R.prototype.renderInline = function(e, t) {
		return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
	}, t.exports = R;
})), li = /* @__PURE__ */ t(((e) => {
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
})), ui = /* @__PURE__ */ t(((e, t) => {
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
})), di = /* @__PURE__ */ t(((e, t) => {
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
var mi = /* @__PURE__ */ t(((e, t) => {
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
})), hi = /* @__PURE__ */ t(((e, t) => {
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
			var u = new n(), d = 16, f = -1, p, m, h, g, _, v, y = [], b, ee, x, S, te, C, w, ne, re, ie;
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
				var ae = [], oe = m.meta.cap.first ? "top" : "bottom";
				m.meta.cap.label !== null && ae.push(["id", m.meta.cap.label]), oe !== "top" && ae.push(["style", "caption-side: " + oe]), p.attrs = ae, p = e.push("inline", "", 0), p.content = m.meta.cap.text, p.map = m.meta.cap.map, p.children = [], p = e.push("caption_close", "caption", -1);
			}
			for (C = 0; C < m.meta.tr.length; C++) {
				for (_ = new e.Token("td_th_placeholder", "", 0), h = m.meta.tr[C], h.meta.grp & 16 && (x = h.meta.type === 256 ? "thead" : "tbody", p = e.push(x + "_open", x, 1), p.map = ee = [h.map[0], 0], y = []), h.block = !0, h.level = e.level++, e.tokens.push(h), w = 0; w < h.meta.bounds.length - 1; w++) {
					if (te = [h.meta.bounds[w] + 1, h.meta.bounds[w + 1]], S = e.src.slice.apply(e.src, te), S === "") {
						g = _.attrGet("colspan"), _.attrSet("colspan", g === null ? 2 : g + 1);
						continue;
					}
					if (t.rowspan && y[w] && S.trim() === "^^") {
						v = y[w].attrGet("rowspan"), y[w].attrSet("rowspan", v === null ? 2 : v + 1), _ = new e.Token("td_th_placeholder", "", 0);
						continue;
					}
					if (x = h.meta.type === 256 ? "th" : "td", p = e.push(x + "_open", x, 1), p.map = h.map, p.attrs = [], m.meta.sep.aligns[w] && p.attrs.push(["style", "text-align:" + m.meta.sep.aligns[w]]), m.meta.sep.wraps[w] && p.attrs.push(["class", "extend"]), _ = y[w] = p, t.multiline && h.meta.multiline && h.meta.mbounds) {
						for (S = Array(h.map[0]).fill("").concat([S.trimRight()]), ne = 1; ne < h.meta.mbounds.length; ne++) w > h.meta.mbounds[ne].length - 2 || (te = [h.meta.mbounds[ne][w] + 1, h.meta.mbounds[ne][w + 1]], S.push(e.src.slice.apply(e.src, te).trimRight()));
						for (ie = new e.md.block.State(S.join("\n"), e.md, e.env, []), ie.level = h.level + 1, e.md.block.tokenize(ie, h.map[0], ie.lineMax), re = 0; re < ie.tokens.length; re++) e.tokens.push(ie.tokens[re]);
					} else p = e.push("inline", "", 0), p.content = S.trim(), p.map = h.map, p.level = h.level + 1, p.children = [];
					p = e.push(x + "_close", x, -1);
				}
				e.push("tr_close", "tr", -1), h.meta.grp & 1 && (x = h.meta.type === 256 ? "thead" : "tbody", p = e.push(x + "_close", x, -1), ee[1] = h.map[1]);
			}
			return b[1] = Math.max(ee[1], m.meta.sep.map[1], m.meta.cap ? m.meta.cap.map[1] : -1), p = e.push("table_close", "table", -1), e.line = b[1], !0;
		}
		e.block.ruler.at("table", c, { alt: ["paragraph", "reference"] });
	};
}));
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/expressions/index.js
function gi(e) {}
function _i(e, t, n = {}) {
	return yi(e, vi(n, t));
}
function vi(e, t) {
	let n = Ii(e.data), r = Ii(t.attributes);
	return {
		data: Ni(n, {
			...r,
			system: {
				date: (/* @__PURE__ */ new Date()).toISOString(),
				...Ii(n.system),
				...Ii(e.system),
				...Ii(r.system)
			}
		}),
		functions: {
			upper: (e) => String(e).toUpperCase(),
			lower: (e) => String(e).toLowerCase(),
			capitalize: (e) => zi(String(e)),
			slug: (e) => Bi(String(e)),
			json: (e) => JSON.stringify(e, null, 2),
			length: (e) => Ri(e),
			round: (e) => Math.round(Number(e)),
			floor: (e) => Math.floor(Number(e)),
			ceil: (e) => Math.ceil(Number(e)),
			fixed: (e, t = 2) => Number(e).toFixed(Number(t)),
			...e.functions
		},
		macros: {
			badge: (e, t = "default") => `<span class="tp-md-badge tp-md-badge-${Hi(String(t))}">${Vi(String(e))}</span>`,
			callout: (e, t) => `<aside class="tp-md-callout tp-md-callout-${Hi(String(e))}">${Vi(String(t))}</aside>`,
			...e.macros
		}
	};
}
function yi(e, t) {
	let n = [];
	return bi(e.replace(/^(`{3,}|~{3,})[ \t]*mdviewer[^\n]*\n[\s\S]*?\n\1\s*$/gm, (e) => {
		let t = n.push(e) - 1;
		return `__TP_MDVIEWER_FENCE_${String(t)}__`;
	}), t).replace(/__TP_MDVIEWER_FENCE_(\d+)__/g, (e, t) => n[Number(t)] ?? e);
}
function bi(e, t) {
	return xi(Ci(Si(e, t), t), t);
}
function xi(e, t) {
	return e.replace(/\{\{(?![#/])([\s\S]*?)\}\}/g, (e, n) => {
		let r = wi(n.trim(), t);
		return r === void 0 ? e : String(r);
	});
}
function Si(e, t) {
	return e.replace(/\{\{#if\s+(.+?)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (e, n, r, i) => Fi(wi(n, t)) ? bi(r, t) : bi(i ?? "", t));
}
function Ci(e, t) {
	return e.replace(/\{\{#each\s+(.+?)\}\}([\s\S]*?)\{\{\/each\}\}/g, (e, n, r) => {
		let i = wi(n, t);
		return Array.isArray(i) ? i.map((e, n) => bi(r, {
			...t,
			data: {
				...t.data,
				this: e,
				index: n
			}
		})).join("") : "";
	});
}
function wi(e, t) {
	let n = e.trim();
	if (n.includes("??")) {
		let [e, r] = Mi(n, "??");
		return wi(e, t) ?? wi(r, t);
	}
	let r = Oi(n);
	if (r !== null) return Fi(wi(r.condition, t)) ? wi(r.truthy, t) : wi(r.falsy, t);
	let i = Di(n);
	if (i !== null) {
		let e = t.functions[i.name] ?? t.macros[i.name];
		return e === void 0 ? void 0 : e(...i.args.map((e) => wi(e, t)));
	}
	let a = ki(n, t);
	return a === void 0 ? Ti(n, t) : a;
}
function Ti(e, t) {
	return e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'") ? e.slice(1, -1) : e === "true" ? !0 : e === "false" ? !1 : e === "null" ? null : /^-?\d+(?:\.\d+)?$/.test(e) ? Number(e) : Ei(t.data, e);
}
function Ei(e, t) {
	let n = t.split(".").filter(Boolean), r = e;
	for (let e of n) {
		if (typeof r != "object" || !r || !(e in r)) return;
		r = r[e];
	}
	return Li(r);
}
function Di(e) {
	let t = e.trim(), n = t.match(/^([a-zA-Z_$][\w$-]*)\s*\(/);
	if (n === null) return null;
	let r = n[1] ?? "", i = t.indexOf("(");
	return t.endsWith(")") ? {
		name: r,
		args: ji(t.slice(i + 1, -1))
	} : null;
}
function Oi(e) {
	let t = e.indexOf("?"), n = e.indexOf(":");
	return t < 0 || n < 0 || n < t ? null : {
		condition: e.slice(0, t).trim(),
		truthy: e.slice(t + 1, n).trim(),
		falsy: e.slice(n + 1).trim()
	};
}
function ki(e, t) {
	if (!/^[\d\s+\-*/()._a-zA-Z]+$/.test(e) || !/[+\-*/]/.test(e)) return;
	let n = e.replace(/[a-zA-Z_][\w.]*/g, (e) => {
		let n = Ei(t.data, e);
		return typeof n == "number" ? String(n) : "NaN";
	});
	if (/^[\d\s+\-*/().NaN]+$/.test(n)) return Ai(n);
}
function Ai(e) {
	let t = e.match(/NaN|\d+(?:\.\d+)?|[()+\-*/]/g) ?? [];
	if (t.some((e) => e === "NaN")) return;
	let n = 0;
	function r() {
		let e = i();
		for (; t[n] === "+" || t[n] === "-";) {
			let r = t[n];
			n += 1;
			let a = i();
			e = r === "+" ? e + a : e - a;
		}
		return e;
	}
	function i() {
		let e = a();
		for (; t[n] === "*" || t[n] === "/";) {
			let r = t[n];
			n += 1;
			let i = a();
			e = r === "*" ? e * i : e / i;
		}
		return e;
	}
	function a() {
		let e = t[n];
		if (e === void 0) return NaN;
		if (e === "(") {
			n += 1;
			let e = r();
			return n += +(t[n] === ")"), e;
		}
		return e === "-" ? (n += 1, -a()) : (n += 1, Number(e));
	}
	let o = r();
	return Number.isFinite(o) ? o : void 0;
}
function ji(e) {
	let t = [], n = "", r = 0, i = null;
	for (let a of e) {
		if (i !== null) {
			n += a, a === i && (i = null);
			continue;
		}
		if (a === "\"" || a === "'") {
			i = a, n += a;
			continue;
		}
		if (a === "(" && (r += 1), a === ")" && --r, a === "," && r === 0) {
			t.push(n.trim()), n = "";
			continue;
		}
		n += a;
	}
	return n.trim() !== "" && t.push(n.trim()), t;
}
function Mi(e, t) {
	let n = e.indexOf(t);
	return [e.slice(0, n).trim(), e.slice(n + t.length).trim()];
}
function Ni(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		n[e] = Pi(t) && Pi(r) ? Ni(t, r) : r;
	}
	return n;
}
function Pi(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Fi(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function Ii(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : {};
}
function Li(e) {
	if (typeof e == "string" || typeof e == "number" || typeof e == "boolean" || e == null) return e;
	if (Array.isArray(e)) return e.map(Li);
	if (typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = Li(r);
		return t;
	}
}
function Ri(e) {
	return typeof e == "string" || Array.isArray(e) ? e.length : typeof e == "object" && e ? Object.keys(e).length : 0;
}
function zi(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function Bi(e) {
	return e.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function Vi(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function Hi(e) {
	return Vi(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/highlight/index.js
function Ui(e) {
	Wi(e);
}
function Wi(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		let s = Gi(o.info);
		return s.language === "" ? typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r) : `<pre${Ki(o.attrs ?? [])}><code class="${`language-${Ji(s.language)}`}">${qi(o.content)}</code></pre>
`;
	};
}
function Gi(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		language: t,
		args: ""
	} : {
		language: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function Ki(e) {
	return e.length === 0 ? "" : e.map(([e, t]) => t === "" ? ` ${Ji(e)}` : ` ${Ji(e)}="${Ji(t)}"`).join("");
}
function qi(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Ji(e) {
	return qi(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/references/index.js
var Yi = "tp-md-references-styles", Xi = "\n.tp-md-reference-link {\n  position: relative;\n  text-decoration: underline dotted;\n  text-underline-offset: 0.2em;\n  cursor: pointer;\n}\n\n.tp-md-note-ref-wrap {\n  position: relative;\n  display: inline-block;\n}\n\n.tp-md-note-ref {\n  font-size: 0.75em;\n  line-height: 0;\n  vertical-align: super;\n}\n\n.tp-md-note-ref .tp-md-reference-link {\n  text-decoration: none;\n}\n\n.tp-md-reference-tooltip {\n  position: fixed;\n  z-index: 1000;\n\n  display: none;\n\n  inline-size: max-content;\n  max-inline-size: min(32rem, calc(100vw - 2rem));\n  max-block-size: calc(100vh - 2rem);\n\n  overflow: auto;\n\n  padding: 0.75rem;\n  border-radius: 0.5rem;\n\n  font-size: 1rem;\n  line-height: 1.4;\n  font-weight: normal;\n\n  background: Canvas;\n  color: CanvasText;\n\n  border: 1px solid\n    color-mix(in srgb, CanvasText 20%, transparent);\n\n  box-shadow:\n    0 0.5rem 1.5rem rgb(0 0 0 / 0.2);\n\n  white-space: normal;\n  overflow-wrap: break-word;\n\n  text-align: start;\n\n  pointer-events: none;\n}\n\n.tp-md-reference-tooltip[data-open='true'] {\n  display: block;\n}\n\n.tp-md-reference-link:hover .tp-md-reference-tooltip,\n.tp-md-reference-link:focus .tp-md-reference-tooltip,\n.tp-md-note-ref-wrap:hover > .tp-md-reference-tooltip,\n.tp-md-note-ref-wrap:focus-within > .tp-md-reference-tooltip,\n.tp-md-reference-tooltip[data-open='true'] {\n  display: block;\n}\n\n.tp-md-reference-tooltip p {\n  margin-block: 0.5rem;\n}\n\n.tp-md-reference-tooltip p:first-child {\n  margin-block-start: 0;\n}\n\n.tp-md-reference-tooltip p:last-child {\n  margin-block-end: 0;\n}\n\n.tp-md-bibliography,\n.tp-md-glossary,\n.tp-md-notes {\n  display: grid;\n  grid-template-columns: max-content minmax(0, 1fr);\n  column-gap: 1rem;\n  row-gap: 0.5rem;\n  align-items: start;\n}\n\n.tp-md-bibliography dt,\n.tp-md-glossary dt,\n.tp-md-notes dt,\n.tp-md-bibliography dd,\n.tp-md-glossary dd,\n.tp-md-notes dd {\n  margin: 0;\n}\n\n.tp-md-bibliography dt,\n.tp-md-glossary dt,\n.tp-md-notes dt {\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n.tp-md-bibliography dd,\n.tp-md-glossary dd,\n.tp-md-notes dd {\n  min-inline-size: 0;\n}\n\n.tp-md-bibliography dd > :first-child,\n.tp-md-glossary dd > :first-child,\n.tp-md-notes dd > :first-child {\n  margin-block-start: 0;\n}\n\n.tp-md-bibliography dd > :last-child,\n.tp-md-glossary dd > :last-child,\n.tp-md-notes dd > :last-child {\n  margin-block-end: 0;\n}\n\n.tp-md-index dl {\n  margin: 0;\n}\n\n.tp-md-index dt {\n  font-weight: 600;\n}\n\n.tp-md-index dd {\n  margin-inline-start: 1.5rem;\n}\n\n.tp-md-index a {\n  text-decoration: none;\n}\n\n.tp-md-index-link {\n  position: relative;\n  font-weight: 400;\n}\n\n.tp-md-index-tooltip {\n  position: fixed;\n  z-index: 1000;\n  display: none;\n\n  inline-size: max-content;\n  max-inline-size: min(40rem, calc(100vw - 2rem));\n  max-block-size: calc(100vh - 2rem);\n\n  overflow: auto;\n  padding: 0.75rem;\n  border: 1px solid color-mix(in srgb, CanvasText 20%, transparent);\n  border-radius: 0.5rem;\n\n  background: Canvas;\n  color: CanvasText;\n\n  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);\n}\n\n.tp-md-index-tooltip[data-open='true'] {\n  display: block;\n}\n\n.tp-md-index-tooltip [data-tp-md-index-preview] {\n  max-block-size: 20rem;\n  overflow: hidden;\n}\n\n/* listof */\n.tp-md-listof {\n  margin-block: 1rem;\n}\n\n.tp-md-listof-list {\n  margin-block: 0;\n}\n\n.tp-md-listof-link {\n  position: relative;\n  text-decoration: none;\n}\n\n.tp-md-listof-tooltip {\n  position: fixed;\n  z-index: 1000;\n  display: none;\n\n  inline-size: max-content;\n  max-inline-size: min(40rem, calc(100vw - 2rem));\n  max-block-size: calc(100vh - 2rem);\n\n  overflow: auto;\n  overscroll-behavior: contain;\n\n  padding: 0.75rem;\n  border: 1px solid\n    color-mix(in srgb, CanvasText 20%, transparent);\n  border-radius: 0.5rem;\n\n  background: Canvas;\n  color: CanvasText;\n\n  box-shadow:\n    0 0.5rem 1.5rem rgb(0 0 0 / 0.2);\n}\n\n.tp-md-listof-tooltip table {\n  max-inline-size: 100%;\n}\n\n.tp-md-listof-tooltip :is(table, pre, code) {\n  overflow: auto;\n}\n\n.tp-md-listof-tooltip[data-open='true'] {\n  display: block;\n}\n\n.tp-md-listof-tooltip [data-tp-md-listof-preview] {\n  max-block-size: 20rem;\n  overflow: hidden;\n  position: relative;\n}\n\n.tp-md-listof-tooltip [data-tp-md-listof-preview]::after {\n  content: \"\";\n  position: absolute;\n  inset-inline: 0;\n  inset-block-end: 0;\n  block-size: 3rem;\n  background: linear-gradient(transparent, Canvas);\n  pointer-events: none;\n}\n";
function Zi(e, t = {}) {
	a(Yi, Xi), Qi(e, t), aa(e), ca(e, t);
}
function Qi(e, t) {
	e.core.ruler.before("block", "tp_extract_references", (n) => {
		let r = n.env;
		if (r.__tp_extracting_reference_definition === !0) return;
		let i = ba(r), a = typeof r.path == "string" && r.path !== "" ? r.path : t.entryPath ?? "/index.md";
		n.src = $i(e, i, n.src, a, t, r).source;
	});
}
function $i(e, t, n, r, i, a) {
	let o = n.split("\n"), s = [], c = null;
	for (let n = 0; n < o.length; n += 1) {
		let r = o[n] ?? "", i = r.match(/^ {0,3}(`{3,}|~{3,})/);
		if (i !== null) {
			let e = i[1] ?? "";
			if (c === null) {
				c = e, s.push(r);
				continue;
			}
			if (e[0] === c[0] && e.length >= c.length) {
				c = null, s.push(r);
				continue;
			}
		}
		if (c !== null) {
			s.push(r);
			continue;
		}
		let l = r.match(/^(\[@([^\]]+)\]|\[%([^\]]+)\]|\[\^([^\]]+)\]):\s*(.*)$/);
		if (l === null) {
			s.push(r);
			continue;
		}
		let u = ta(l), d = na(l), f = [l[5] ?? ""], p = n + 1;
		for (; p < o.length;) {
			let e = o[p] ?? "";
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
		n = p - 1, ra(e, t, u, d, f.join("\n").trim(), a);
	}
	return ea(e, t, s.join("\n"), r, i, a), { source: s.join("\n") };
}
function ea(e, t, n, r, i, a) {
	let o = i.files ?? {}, s = n.matchAll(/^::(bibliography|biblio|glossary|notes)\{([^}]*)\}\s*$/gm);
	for (let n of s) {
		let s = n[2]?.trim() ?? "";
		if (s === "") continue;
		let c = Aa(r, s), l = o[c];
		typeof l == "string" && $i(e, t, l, c, i, a);
	}
}
function ta(e) {
	return e[2] === void 0 ? e[3] === void 0 ? "notes" : "glossary" : "bibliography";
}
function na(e) {
	return (e[2] ?? e[3] ?? e[4] ?? "").trim();
}
function ra(e, t, n, r, i, a) {
	if (r === "") return;
	let o = ja(r), s = Sa(n, o), c = `popover-${s}`, l = ia(e, i, a), u = {
		key: r,
		id: s,
		popoverId: c,
		raw: i,
		html: l,
		text: Ma(l)
	};
	if (n === "bibliography") {
		t.bibliography.set(o, u);
		return;
	}
	if (n === "glossary") {
		t.glossary.set(o, u);
		return;
	}
	t.notes.set(o, u), t.noteOrder.includes(o) || t.noteOrder.push(o);
}
function ia(e, t, n) {
	let r = {
		...n,
		__tp_references: n.__tp_references,
		__tp_extracting_reference_definition: !0
	};
	return e.render(t, r);
}
function aa(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("emphasis", "tp_reference_inline", (e, t) => {
		let n = e.src.slice(e.pos), r = n.match(/^\[@([^\]]+)\]/) ?? n.match(/^\[%([^\]]+)\]/) ?? n.match(/^\[\^([^\]]+)\]/);
		if (r === null) return !1;
		let i = r[0], a = r[1]?.trim() ?? "";
		if (a === "") return !1;
		if (!t) {
			let t = e.push(oa(i), "", 0);
			t.content = "", t.meta = { key: a };
		}
		return e.pos += i.length, !0;
	}), t.ruler.before("emphasis", "tp_index_inline", (e, t) => {
		let n = e.src.slice(e.pos).match(/^:index:`([^`]+)`/);
		if (n === null) return !1;
		let r = n[1]?.trim() ?? "";
		if (r === "") return !1;
		let i = e.env, a = ba(i), o = `index-${Na(r)}-${String(a.indexEntries.length + 1)}`;
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
	}), n.rules.tp_cite_inline = (e, t, n, r) => sa(e[t], r, "bibliography"), n.rules.tp_glossary_inline = (e, t, n, r) => sa(e[t], r, "glossary"), n.rules.tp_note_inline = (e, t, n, r) => sa(e[t], r, "notes"), n.rules.tp_index_inline = (e, t) => {
		let n = Da(e[t]);
		return n === null ? "" : `<span id="${U(n.id)}" data-index-entry="${U(n.key)}" aria-hidden="true"></span>`;
	});
}
function oa(e) {
	return e.startsWith("[@") ? "tp_cite_inline" : e.startsWith("[%") ? "tp_glossary_inline" : "tp_note_inline";
}
function sa(e, t, n) {
	let r = Ea(e);
	if (r === "") return "";
	let i = ba(t), a = ja(r), o = xa(i, n, a), s = o?.id ?? Sa(n, a), c = la(o);
	if (n === "bibliography") return `<a href="#${U(s)}" class="tp-md-reference-link" data-cite-ref="${U(s)}">[${Pa(r)}]${c}</a>`;
	if (n === "glossary") return `<a href="#${U(s)}" class="tp-md-reference-link tp-md-glossary-link" data-glossary-link="${U(s)}">${Pa(r)}${c}</a>`;
	let l = Ca(i, a);
	return `<span class="tp-md-note-ref-wrap"><sup class="tp-md-note-ref"><a href="#${U(s)}" class="tp-md-reference-link tp-md-note-link" data-note-ref="${U(s)}">[${Pa(l)}]</a></sup>${c}</span>`;
}
function ca(e, t) {
	let n = e.block, r = e.renderer;
	n === void 0 || r === void 0 || (n.ruler.before("paragraph", "tp_references_block", (e, t, n, r) => {
		let i = ka(e, t).trim().match(/^::(bibliography|biblio|glossary|notes|index|listof)\{([^}]*)\}\s*$/);
		if (i === null) return !1;
		if (r) return !0;
		let a = e.push("tp_references_block", "", 0);
		return a.block = !0, a.meta = {
			kind: wa(i[1] ?? ""),
			file: i[2]?.trim() ?? ""
		}, e.line = t + 1, !0;
	}), r.rules.tp_references_block = (n, r, i, a) => {
		let o = n[r];
		if (o === void 0) return "";
		let s = Oa(o.meta), c = ba(a);
		return s.kind === "listof" ? Ta(s.file) : (s.file !== "" && da(e, c, s.kind, s.file, a, t), s.kind === "bibliography" ? fa("tp-md-bibliography", c.bibliography) : s.kind === "glossary" ? fa("tp-md-glossary", c.glossary) : s.kind === "notes" ? ma(c) : ha(c.indexEntries));
	});
}
function la(e) {
	return e === void 0 ? "" : `<span class="tp-md-reference-tooltip" role="tooltip">${ua(e.html)}</span>`;
}
function ua(e) {
	return e.replaceAll(/<\/?p>/g, "").trim();
}
function da(e, t, n, r, i, a) {
	if (n === "index") return;
	let o = a.files ?? {}, s = Aa(typeof i.path == "string" && i.path !== "" ? i.path : a.entryPath ?? "/index.md", r), c = o[s];
	typeof c == "string" && $i(e, t, c, s, a, i);
}
function fa(e, t) {
	let n = [`<dl class="${U(e)}">`];
	for (let e of pa(t)) n.push(`<dt id="${U(e.id)}">${Pa(e.key)}</dt>`), n.push(`<dd data-reference-def="${U(e.id)}">${e.html}</dd>`);
	return n.push("</dl>"), n.join("");
}
function pa(e) {
	return [...e.values()].sort((e, t) => e.key.localeCompare(t.key, void 0, {
		sensitivity: "base",
		numeric: !0
	}));
}
function ma(e) {
	let t = ["<dl class=\"tp-md-notes\">"], n = [...e.noteRefs, ...e.noteOrder.filter((t) => !e.noteRefs.includes(t))];
	for (let r of n) {
		let n = e.notes.get(r);
		if (n === void 0) continue;
		let i = Ca(e, r);
		t.push(`<dt id="${U(n.id)}">[${Pa(i)}]</dt>`), t.push(`<dd data-reference-def="${U(n.id)}">${n.html}</dd>`);
	}
	return t.push("</dl>"), t.join("");
}
function ha(e) {
	return va(ga(e), !0);
}
function ga(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.key.split(",").map((e) => e.trim()).filter((e) => e !== "");
		e.length !== 0 && _a(t, e, n.id);
	}
	return t;
}
function _a(e, t, n) {
	let r = t[0];
	if (r === void 0) return;
	let i = ja(r), a = e.get(i);
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
	_a(a.children, o, n);
}
function va(e, t = !1) {
	let n = [`<dl${t ? " class=\"tp-md-index\"" : ""}>`];
	for (let t of [...e.values()].sort((e, t) => e.label.localeCompare(t.label, void 0, {
		sensitivity: "base",
		numeric: !0
	}))) n.push("<dt>"), n.push(Pa(t.label)), t.targets.length > 0 && (n.push(" "), n.push(ya(t.targets))), n.push("</dt>"), t.children.size > 0 && (n.push("<dd>"), n.push(va(t.children)), n.push("</dd>"));
	return n.push("</dl>"), n.join("");
}
function ya(e) {
	return e.map((e, t) => `
<a
  href="#${U(e)}"
  class="tp-md-index-link"
  data-tp-md-index-target="${U(e)}"
>
  ${String(t + 1)}
  <span class="tp-md-index-tooltip" role="tooltip"></span>
</a>`).join(", ");
}
function ba(e) {
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
function xa(e, t, n) {
	return t === "bibliography" ? e.bibliography.get(n) : t === "glossary" ? e.glossary.get(n) : e.notes.get(n);
}
function Sa(e, t) {
	return e === "bibliography" ? `bib-${Na(t)}` : e === "glossary" ? `glo-${Na(t)}` : `note-${Na(t)}`;
}
function Ca(e, t) {
	let n = e.noteRefs.indexOf(t);
	return n === -1 && (e.noteRefs.push(t), n = e.noteRefs.length - 1), String(n + 1);
}
function wa(e) {
	return e === "biblio" || e === "bibliography" ? "bibliography" : e === "glossary" ? "glossary" : e === "notes" ? "notes" : e === "listof" ? "listof" : "index";
}
function Ta(e) {
	return `
<div
  class="tp-md-listof"
  data-tp-md-listof="${U(e)}"
></div>
`;
}
function Ea(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.key == "string" ? t.key : "";
}
function Da(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.key == "string" && typeof t.id == "string" ? t : null;
}
function Oa(e) {
	if (typeof e != "object" || !e) return {
		kind: "bibliography",
		file: ""
	};
	let t = e;
	return {
		kind: typeof t.kind == "string" ? wa(t.kind) : "bibliography",
		file: typeof t.file == "string" ? t.file : ""
	};
}
function ka(e, t) {
	let n = (e.bMarks[t] ?? 0) + (e.tShift[t] ?? 0), r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
function Aa(e, t) {
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
function ja(e) {
	return e.trim().toLowerCase();
}
function Ma(e) {
	return e.replaceAll(/<[^>]*>/g, "").replaceAll(/\s+/g, " ").trim();
}
function Na(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
function Pa(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function U(e) {
	return Pa(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/markdown-extension-loader.js
var Fa = {
	formats: "./formats/index.js",
	"lorem-ipsum": "./lorem-ipsum/index.js",
	math: "./math/index.js",
	map: "./map/index.js",
	music: "./music/index.js",
	sudoku: "./sudoku/index.js",
	crossword: "./crossword/index.js",
	yakazu: "./yakazu/index.js",
	binary: "./binary/index.js",
	cryptarithm: "./cryptarithm/index.js",
	slide: "./slide/index.js",
	handwriting: "./handwriting/index.js",
	diagram: "./diagram/index.js",
	"game-life": "./game-life/index.js",
	turtle: "./turtle/index.js",
	typewriting: "./typewriting/index.js",
	"text-to-speech": "./text-to-speech/index.js",
	"speech-to-text": "./speech-to-text/index.js",
	"l-system": "./l-system/index.js",
	"xy-plot": "./xy-plot/index.js"
}, Ia = {
	formats: async () => import("./formats.js").then((e) => e.t),
	"lorem-ipsum": async () => import("./lorem-ipsum.js").then((e) => e.t),
	math: async () => import("./math3.js"),
	map: async () => import("./map3.js"),
	music: async () => import("./music.js"),
	sudoku: async () => import("./sudoku2.js"),
	crossword: async () => import("./crossword2.js"),
	yakazu: async () => import("./yakazu2.js"),
	binary: async () => import("./binary2.js"),
	cryptarithm: async () => import("./cryptarithm2.js"),
	slide: async () => import("./slide.js"),
	handwriting: async () => import("./handwriting.js"),
	diagram: async () => import("./diagram.js"),
	"game-life": async () => import("./game-life2.js"),
	turtle: async () => import("./turtle2.js"),
	typewriting: async () => import("./typewriting2.js"),
	"l-system": async () => import("./l-system.js"),
	"text-to-speech": async () => import("./text-to-speech2.js"),
	"speech-to-text": async () => import("./speech-to-text.js"),
	references: async () => Promise.resolve({ default: Zi }),
	highlight: async () => Promise.resolve({ default: Ui }),
	"xy-plot": async () => import("./xy-plot2.js")
};
function La() {
	let e = globalThis.__TP_EXTENSION_BASE__;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Ra(e, "md-extension");
		if (t) return t.endsWith("/") ? t : `${t}/`;
	}
	return `${window.location.origin}/dist/markdown/extensions/`;
}
function Ra(e, t) {
	if (!e) return null;
	let n = e.trim();
	return n.startsWith("data:") || n.startsWith("blob:") || n.startsWith("javascript:") || n.startsWith("file:") ? (console.error(`[${t}] invalid base URL`, n), null) : n;
}
function za(e) {
	let t = e.trim();
	if (t in Ia) return t;
	let n = t.match(/\/([^/]+)\/index\.(?:ts|js)(?:[?#].*)?$/i);
	if (n?.[1]) return n[1];
	let r = t.match(/\/([^/]+)\.(?:ts|js)(?:[?#].*)?$/i);
	return r?.[1] ? r[1] : t;
}
function Ba(e) {
	let t = Fa[e];
	return t ? new URL(t, La()).href : null;
}
async function Va(e) {
	console.debug("[md-ext] load request =", e);
	let t = za(e), n = Ia[t];
	if (n) {
		console.debug("[md-ext] static importer =", t);
		let e = await n(), r = e.default ?? e;
		if (typeof r != "function") throw Error(`Invalid Markdown extension: ${t}`);
		return r;
	}
	let r = await import(
		/* @vite-ignore */
		Ba(t) ?? e
), i = r.default ?? r;
	if (typeof i != "function") throw Error(`Invalid Markdown extension: ${e}`);
	return i;
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/mdviewer/index.js
var Ha = "tp-md-mdviewer-styles", Ua = "__tp_mdviewer_installed", Wa = /* @__PURE__ */ new Set(["src", "extensions"]), Ga = "\n.tp-md-mdviewer {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  gap: 0.5rem;\n  margin-block: 1rem;\n  overflow: visible;\n}\n\n.tp-md-mdviewer-toolbar {\n  grid-column: 1 / -1;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n  align-items: end;\n  margin-block-end: 0;\n}\n\n.tp-md-mdviewer-toolbar label,\n.tp-md-mdviewer-start-controls label {\n  display: grid;\n  gap: 0.15rem;\n  margin: 0;\n}\n\n.tp-md-mdviewer-toolbar select,\n.tp-md-mdviewer-start-controls select {\n  width: 100%;\n  height: 2.25rem;\n  box-sizing: border-box;\n}\n\n.tp-md-mdviewer-start,\n.tp-md-mdviewer-end,\n.tp-md-mdviewer-source-output,\n.tp-md-mdviewer-output {\n  min-inline-size: 0;\n  max-inline-size: 100%;\n}\n\n.tp-md-mdviewer-start {\n  display: grid;\n  gap: 0.5rem;\n  align-content: start;\n  border: 1px solid #d0d7de;\n  border-radius: 0.75rem;\n  background: #fff;\n  overflow: hidden;\n  padding: 0.5rem;\n}\n\n.tp-md-mdviewer-start-controls:empty {\n  display: none;\n}\n\n.tp-md-mdviewer-end {\n  display: grid;\n  gap: 0.5rem;\n  align-content: start;\n  border: 1px solid #d0d7de;\n  border-radius: 0.75rem;\n  background: #fff;\n  overflow: hidden;\n  padding: 0.5rem;\n  & section {\n    margin: 0;\n  }\n}\n\n.tp-md-mdviewer pre {\n  max-inline-size: 100%;\n  margin: 0;\n  overflow: auto;\n  padding: 0;\n  border-radius: 0.75rem;\n}\n\n.tp-md-mdviewer pre,\n.tp-md-mdviewer code {\n  white-space: pre;\n}\n\n.tp-md-mdviewer pre code {\n  display: block;\n  min-inline-size: max-content;\n  white-space: inherit;\n}\n\n.tp-md-mdviewer-output > pre,\n.tp-md-mdviewer-output pre {\n  max-block-size: none;\n  block-size: auto;\n  height: auto;\n}\n\n.tp-md-mdviewer[data-mdviewer-layout='source'] {\n  grid-template-columns: 1fr;\n}\n\n.tp-md-mdviewer[data-mdviewer-layout='source'] .tp-md-mdviewer-end {\n  display: none;\n}\n\n.tp-md-mdviewer[data-mdviewer-layout='output'] {\n  grid-template-columns: 1fr;\n}\n\n.tp-md-mdviewer[data-mdviewer-layout='output'] .tp-md-mdviewer-start {\n  display: none;\n}\n\n@media (max-width: 60rem) {\n  .tp-md-mdviewer {\n    grid-template-columns: 1fr;\n  }\n\n  .tp-md-mdviewer-toolbar {\n    grid-template-columns: 1fr;\n  }\n}\n";
function Ka(e) {
	a(Ha, Ga);
	let t = e;
	t[Ua] !== !0 && (t[Ua] = !0, Ja(e));
}
function qa(e) {
	let t = e;
	t[Ua] = !1, Ka(e);
}
function Ja(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		let s = to(o.info);
		if (s.name !== "mdviewer") return typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
		let c = {
			src: no(s.args, "src") ?? Ya(o, "src") ?? "",
			extensions: no(s.args, "extensions") ?? Ya(o, "extensions") ?? "",
			source: no(s.args, "data-tp-source") ?? Ya(o, "data-tp-source") ?? ""
		};
		return Za(o.content.trim(), c, Xa(o));
	};
}
function Ya(e, t) {
	return e.attrs?.find(([e]) => e === t)?.[1] ?? null;
}
function Xa(e) {
	return (e.attrs ?? []).filter(([e]) => !Wa.has(e));
}
function Za(e, t, n) {
	return `
<div${Qa(t, n)}>
  <template class="tp-md-mdviewer-source">${io(e)}</template>

  <div class="tp-md-mdviewer-toolbar">
    <label>
      <select class="tp-md-mdviewer-layout">
        <option value="both" selected>Both</option>
        <option value="source">Source only</option>
        <option value="output">Output only</option>
      </select>
    </label>

    <label>
      <select class="tp-md-mdviewer-select">
        <option value="render">Rendered HTML</option>
        <option value="html">HTML code</option>
        <option value="ast">AST JSON</option>
      </select>
    </label>
  </div>

  <div class="tp-md-mdviewer-start">
    <div class="tp-md-mdviewer-start-controls"></div>
    <div class="tp-md-mdviewer-source-output"></div>
  </div>

  <div class="tp-md-mdviewer-end">
    <div class="tp-md-mdviewer-output"></div>
  </div>
</div>
`;
}
function Qa(e, t) {
	let n = $a(t, "tp-md-mdviewer");
	return n.push(["data-mdviewer-layout", "both"]), n.push(["data-mdviewer-src", e.src]), n.push(["data-mdviewer-extensions", e.extensions]), e.source !== "" && n.push(["data-tp-source", e.source]), eo(n);
}
function $a(e, t) {
	let n = e.map(([e, t]) => [e, t]), r = n.find(([e]) => e === "class");
	return r === void 0 ? n.push(["class", t]) : r[1] = `${r[1]} ${t}`.trim(), n;
}
function eo(e) {
	return e.map(([e, t]) => t === "" ? ` ${ao(e)}` : ` ${ao(e)}="${ao(t)}"`).join("");
}
function to(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function no(e, t) {
	let n = RegExp(`(?:^|\\s)${ro(t)}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s}]+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").trim().replace(/^["']|["']$/g, "");
}
function ro(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function io(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function ao(e) {
	return io(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/page-nav/index.js
var oo = "tp-md-page-nav-styles", so = "\n.tp-md-page-nav {\n  display: grid;\n  grid-template-columns:\n    minmax(0, 1fr)\n    auto\n    minmax(0, 1fr);\n\n  gap: 1rem;\n  align-items: center;\n\n  margin-block-start: 3rem;\n  padding-block-start: 1rem;\n\n  border-block-start:\n    1px solid\n    color-mix(\n      in srgb,\n      CanvasText 15%,\n      transparent\n    );\n}\n\n.tp-md-page-nav a {\n  text-decoration: none;\n}\n\n.tp-md-page-nav-prev {\n  justify-self: start;\n}\n\n.tp-md-page-nav-top {\n  justify-self: center;\n}\n\n.tp-md-page-nav-next {\n  justify-self: end;\n  text-align: end;\n}\n\n.tp-md-page-nav-placeholder {\n  min-inline-size: 0;\n}\n";
function co() {
	a(oo, so);
}
function lo(e, t = {}) {
	return uo(e, t) ? po(e, t) : "";
}
function uo(e, t) {
	if (e.pageNavRoot !== !0 || fo(_o(e, t))) return !1;
	let n = e.attributes?.pageNav?.enabled;
	return typeof n == "boolean" ? n : t.enabled !== !1;
}
function fo(e) {
	return e.endsWith("/sidebar.md") || e.endsWith("/_sidebar.md");
}
function po(e, t) {
	let n = mo(_o(e, t), e, t), r = e.attributes?.pageNav?.topHref ?? t.topHref ?? "#", i = e.attributes?.pageNav?.topLabel ?? t.topLabel ?? "Top";
	return `
<nav
  class="tp-md-page-nav"
  aria-label="Page navigation"
>
  ${n.previous === void 0 ? "\n<span\n  class=\"tp-md-page-nav-placeholder\"\n></span>\n" : `
<a
  class="tp-md-page-nav-prev"
  rel="prev"
  href="${wo(So(n.previous.href))}"
>
  ← ${Co(n.previous.title)}
</a>
`}

  <a
    class="tp-md-page-nav-top"
    href="${wo(r)}"
  >
    ↑ ${Co(i)}
  </a>

  ${n.next === void 0 ? "\n<span\n  class=\"tp-md-page-nav-placeholder\"\n></span>\n" : `
<a
  class="tp-md-page-nav-next"
  rel="next"
  href="${wo(So(n.next.href))}"
>
  ${Co(n.next.title)} →
</a>
`}
</nav>
`;
}
function mo(e, t, n) {
	let r = t.files ?? n.files ?? {}, i = xo(t.attributes?.pageNav?.sidebarPath ?? n.sidebarPath ?? "/sidebar.md"), a = r[i];
	if (typeof a != "string") return {};
	let o = xo(e), s = ho(a).map((e) => ({
		title: e.title,
		href: bo(i, e.href)
	})), c = s.findIndex((e) => xo(e.href) === o);
	return c < 0 ? {} : {
		previous: s[c - 1],
		next: s[c + 1]
	};
}
function ho(e) {
	let t = [];
	for (let n of e.matchAll(/^\s*(?:[-*+]\s+)?(?:\*\*)?\[([^\]]+)\]\(([^)]+)\)(?:\*\*)?/gm)) {
		let e = go(n[1]?.trim() ?? ""), r = yo(n[2]?.trim() ?? "");
		e === "" || r === "" || r.startsWith("#") || !vo(r) || t.push({
			title: e,
			href: r
		});
	}
	return t;
}
function go(e) {
	return e.replaceAll(/`([^`]+)`/g, "$1").replaceAll(/\\([\\`*_[\]{}()#+.!<>-])/g, "$1").replaceAll(/\*\*([^*]+)\*\*/g, "$1").replaceAll(/\*([^*]+)\*/g, "$1").replaceAll(/__([^_]+)__/g, "$1").replaceAll(/_([^_]+)_/g, "$1").trim();
}
function _o(e, t) {
	return typeof e.path == "string" && e.path !== "" ? xo(e.path) : typeof t.entryPath == "string" && t.entryPath !== "" ? xo(t.entryPath) : "/index.md";
}
function vo(e) {
	return /\.md(?:[#?].*)?$/i.test(e);
}
function yo(e) {
	return e.match(/^([^ \t]+)(?:\s+["'][\s\S]*["'])?$/)?.[1] ?? e;
}
function bo(e, t) {
	if (t.startsWith("/")) return xo(t);
	let n = e.split("/").filter(Boolean);
	n.pop();
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			n.pop();
			continue;
		}
		n.push(e);
	}
	return xo(`/${n.join("/")}`);
}
function xo(e) {
	let t = [];
	for (let n of e.split("/")) if (!(n === "" || n === ".")) {
		if (n === "..") {
			t.pop();
			continue;
		}
		t.push(n);
	}
	return `/${t.join("/")}`;
}
function So(e) {
	return e.replace(/\.md(?=($|[#?]))/i, ".html");
}
function Co(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function wo(e) {
	return Co(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/example/index.js
var To = "tp-md-example-styles", Eo = "\n.tp-md-example {\n  display: block;\n\n  margin-block: 1rem;\n  padding: 1rem;\n\n  border: 1px solid\n    color-mix(\n      in srgb,\n      CanvasText 18%,\n      transparent\n    );\n\n  border-radius: 0.75rem;\n\n  background:\n    color-mix(\n      in srgb,\n      CanvasText 6%,\n      Canvas\n    );\n}\n\n.tp-md-example-label {\n  margin-block-end: 0.75rem;\n\n  color:\n    color-mix(\n      in srgb,\n      CanvasText 75%,\n      transparent\n    );\n\n  font-size: 0.875rem;\n  font-weight: 600;\n}\n\n.tp-md-example-content > :first-child {\n  margin-block-start: 0;\n}\n\n.tp-md-example-content > :last-child {\n  margin-block-end: 0;\n}\n";
function Do(e) {
	a(To, Eo), Oo(e);
}
function Oo(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (n, r, i, a, o) => {
		let s = n[r];
		if (s === void 0) return "";
		let c = jo(s.info);
		if (c.name !== "example") return typeof t == "function" ? t(n, r, i, a, o) : o.renderToken(n, r, i);
		let l = `${c.args} ${Ao(s)}`.trim(), u = {
			label: Mo(l, "label") ?? "",
			allowScript: No(l, "allow-script")
		}, d = _i(s.content, a);
		return ko(e.render(d, a), u);
	};
}
function ko(e, t) {
	return `
<section class="tp-md-example"${t.allowScript ? " data-allow-script" : ""}>
  ${t.label === "" ? "" : `<div class="tp-md-example-label">${Fo(t.label)}</div>`}

  <div class="tp-md-example-content">
${e}
  </div>
</section>
`;
}
function Ao(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function jo(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function Mo(e, t) {
	let n = RegExp(`${Po(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function No(e, t) {
	return RegExp(`(?:^|\\s)${Po(t)}(?:\\s|$)`).test(e);
}
function Po(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Fo(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/htmlviewer/index.js
var Io = "tp-md-htmlviewer-styles", Lo = "__tp_htmlviewer_installed", Ro = "\n.tp-htmlviewer {\n  display: block;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  margin: 1rem 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  background: transparent;\n  box-sizing: border-box;\n  overflow: visible;\n}\n\n.tp-htmlviewer-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  gap: 0.5rem;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  min-inline-size: 0;\n  align-items: start;\n  justify-items: stretch;\n  overflow: visible;\n}\n\n.tp-htmlviewer-panel {\n  position: relative;\n  min-inline-size: 0;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  margin: 0;\n  box-sizing: border-box;\n  border: 1px solid var(--tp-neutral-stroke-soft);\n  border-radius: .75rem;\n  background: var(--tp-paper-color);\n  overflow: hidden;\n}\n\n.tp-htmlviewer-panel-code,\n.tp-htmlviewer-panel-preview {\n  display: grid;\n  gap: 0.5rem;\n  align-content: start;\n}\n\n.tp-htmlviewer-controls {\n  display: grid;\n  gap: 0.5rem;\n  padding: 0.5rem;\n  border-bottom: 1px solid var(--tp-neutral-stroke-soft);\n}\n\n.tp-htmlviewer-controls label {\n  display: grid;\n  gap: 0.15rem;\n  margin-bottom: 0;\n}\n\n.tp-htmlviewer-controls select {\n  inline-size: 100%;\n  block-size: 2.5rem;\n  box-sizing: border-box;\n}\n\n.tp-htmlviewer-toolbar {\n  position: absolute;\n  top: .5rem;\n  right: .5rem;\n  z-index: 3;\n  display: flex;\n  gap: .375rem;\n  padding: 0;\n  border: 0;\n  background: transparent;\n}\n\n.tp-htmlviewer-copy-btn {\n  inline-size: 1.75rem;\n  block-size: 1.75rem;\n  min-inline-size: 1.75rem;\n  min-block-size: 1.75rem;\n  padding: 0;\n  border-radius: .5rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--tp-neutral-on-paper-color, currentColor);\n  backdrop-filter: blur(2px);\n  opacity: .95;\n}\n\n.tp-htmlviewer-copy-btn svg {\n  inline-size: 1rem;\n  block-size: 1rem;\n}\n\n.tp-htmlviewer-source-output,\n.tp-htmlviewer-output {\n  min-inline-size: 0;\n  max-inline-size: 100%;\n}\n\n.tp-htmlviewer-source-output {\n  position: relative;\n}\n\n.tp-htmlviewer-source-output pre,\n.tp-htmlviewer-output pre {\n  max-inline-size: 100%;\n  margin: 0;\n  overflow: auto;\n  padding: 0;\n  border-radius: 0.75rem;\n}\n\n.tp-htmlviewer-source-output pre code,\n.tp-htmlviewer-output pre code {\n  display: block;\n  min-inline-size: max-content;\n  white-space: pre;\n}\n\n.tp-htmlviewer-frame {\n  display: block;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  min-block-size: 0;\n  border: 0;\n  background: var(--tp-paper-color);\n  border-radius: inherit;\n}\n\n.tp-htmlviewer-grid[data-htmlviewer-layout='source'] {\n  grid-template-columns: 1fr;\n}\n\n.tp-htmlviewer-grid[data-htmlviewer-layout='source'] .tp-htmlviewer-panel-preview {\n  display: none;\n}\n\n.tp-htmlviewer-grid[data-htmlviewer-layout='output'] {\n  grid-template-columns: 1fr;\n}\n\n.tp-htmlviewer-grid[data-htmlviewer-layout='output'] .tp-htmlviewer-source-output {\n  display: none;\n}\n\n@media (max-width: 60rem) {\n  .tp-htmlviewer-grid {\n    grid-template-columns: 1fr;\n  }\n}\n";
function zo(e) {
	a(Io, Ro);
	let t = e;
	t[Lo] !== !0 && (t[Lo] = !0, Bo(e));
}
function Bo(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		if (Ko(o.info).name !== "htmlviewer") return typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
		let s = o.attrs ?? [], c = Ho(s), l = Uo(s, "allow-script");
		return Vo(o.content ?? "", c, l);
	};
}
function Vo(e, t, n) {
	let r = Wo(t, "tp-htmlviewer");
	return r.push(["data-htmlviewer", "true"]), n && r.push(["data-allow-script", ""]), `
<figure${Go(r)}>
  <template class="tp-htmlviewer-source">${qo(e)}</template>
</figure>
`;
}
function Ho(e) {
	return e.filter(([e]) => e !== "allow-script").map(([e, t]) => [e, t]);
}
function Uo(e, t) {
	return e.some(([e]) => e === t);
}
function Wo(e, t) {
	let n = e.map(([e, t]) => [e, t]), r = n.find(([e]) => e === "class");
	return r === void 0 ? n.push(["class", t]) : r[1] = `${r[1]} ${t}`.trim(), n;
}
function Go(e) {
	return e.map(([e, t]) => t === "" ? ` ${Jo(e)}` : ` ${Jo(e)}="${Jo(t)}"`).join("");
}
function Ko(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function qo(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Jo(e) {
	return qo(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/layout/index.js
var Yo = "tp-md-layout-styles", Xo = "\n.stack {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  gap: var(--layout-space, 0.5rem);\n}\n\n.stack > * {\n  margin-block: 0;\n}\n\n.stack > * + * {\n  margin-block-start: var(--layout-space, 0.5rem);\n}\n\n.cluster {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--layout-space, 0.5rem);\n  justify-content: var(--cluster-justify, flex-start);\n  align-items: var(--cluster-align, center);\n}\n\n.switcher {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--layout-space, 0.5rem);\n  --switcher-limit: attr(limit number, 2);\n}\n\n.switcher > * {\n  flex-grow: 1;\n  flex-basis: calc((var(--switcher-threshold, 40rem) - 100%) * 999);\n}\n\n\n.switcher > tp-l-system {\n  flex: 1 1 18rem;\n  min-inline-size: 0;\n}\n\n.switcher > tp-l-system .tp-l-system-figure {\n  margin: 0;\n  display: flex;\n  flex-direction: column; /* important */\n  align-items: stretch;\n  justify-content: flex-start;\n  gap: 0.5rem;\n  inline-size: 100%;\n}\n\n.switcher > tp-l-system .tp-l-system-svg,\n.switcher > tp-l-system svg {\n  display: block;\n  inline-size: 100%;\n  max-inline-size: 100%;\n  block-size: auto;\n}\n\n\n.switcher.feature-list > article {\n  flex: 0 0 250px;\n}\n.switcher.code-list > article {\n  flex: 0 0 400px;\n}\n\n.sidebar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--layout-space, 0.5rem);\n}\n\n.sidebar > :first-child {\n  flex-basis: var(--sidebar-width, 10rem);\n  flex-grow: 1;\n}\n\n.sidebar > :last-child {\n  flex-basis: 0;\n  flex-grow: 999;\n  min-inline-size: var(--sidebar-content-min, 70%);\n}\n\n.cover {\n  display: flex;\n  flex-direction: column;\n  min-block-size: var(--cover-min-block-size, 100vh);\n  padding: var(--cover-padding, 1rem);\n}\n\n.cover > * {\n  margin-block: var(--layout-space, 0.5rem);\n}\n\n.cover > :first-child:not(.centered) {\n  margin-block-start: 0;\n}\n\n.cover > :last-child:not(.centered) {\n  margin-block-end: 0;\n}\n\n.cover > .centered {\n  margin-block: auto;\n}\n\n.center {\n  box-sizing: content-box;\n  max-inline-size: var(--center-max-inline-size, 60rem);\n  margin-inline: auto;\n  padding-inline: var(--center-padding, 1rem);\n}\n\n.grid {\n  display: grid;\n  gap: var(--layout-space, 0.5rem);\n  grid-template-columns: repeat(\n    auto-fit,\n    minmax(min(var(--grid-min, 16rem), 100%), 1fr)\n  );\n}\n\n.reel {\n  display: flex;\n  gap: var(--layout-space, 0.5rem);\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-color: currentColor transparent;\n}\n\n.reel > * {\n  flex: 0 0 var(--reel-item-width, auto);\n}\n\n.reel > img {\n  block-size: 100%;\n  flex-basis: auto;\n  width: auto;\n}\n\n.reel > * + * {\n  margin-inline-start: 1rem;\n}\n\n.reel.overflowing {\n  padding-block-end: 1rem;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n  gap: var(--layout-space, 0.5rem);\n  padding: var(--card-padding, 1rem);\n  border: var(--card-border, 1px solid color-mix(in srgb, CanvasText 18%, transparent));\n  border-radius: var(--card-radius, 0.75rem);\n  background: var(--card-background, Canvas);\n  color: var(--card-color, CanvasText);\n}\n\n.card > :first-child {\n  margin-block-start: 0;\n}\n\n.card > :last-child {\n  margin-block-end: 0;\n}\n";
function Zo(e) {
	a(Yo, Xo);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/list-table/index.js
var Qo = /^list-table(?:\s|$)/;
function $o(e) {
	e.core.ruler.after("block", "list_table", (e) => {
		for (let t of e.tokens) t.type === "fence" && Qo.test(t.info.trim()) && es(t, ts(t.info));
	});
}
function es(e, t) {
	e.type = "html_block", e.tag = "", e.nesting = 0, e.info = "", e.markup = "", e.content = [
		"<template data-md-renderer=\"list-table\"",
		t.noHeading ? " no-heading" : "",
		t.caption ? ` caption="${is(t.caption)}"` : "",
		">",
		rs(e.content),
		"</template>"
	].join("");
}
function ts(e) {
	let t = e.trim().match(/^list-table\s*(?:\{([\s\S]*)\})?\s*$/)?.[1] ?? "";
	return {
		noHeading: /\bno-heading\b/.test(t),
		caption: ns(t, "caption")
	};
}
function ns(e, t) {
	let n = RegExp(`\\b${as(t)}\\s*=\\s*"([^"]*)"`);
	return e.match(n)?.[1] ?? "";
}
function rs(e) {
	return e.replaceAll("</template", "<\\/template");
}
function is(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function as(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
//#region ../tp-markdown/dist/chunks/lists.js
var os = "ul .tp-md-choice-list-item{list-style:none}.tp-md-choice-list-label{vertical-align:middle;align-items:center;gap:.5rem;line-height:1.4;display:inline-flex}.tp-md-choice-list-input{vertical-align:middle;flex:none;block-size:1rem;inline-size:1rem;margin:0}input[type=checkbox],input[type=radio]{transform-origin:50%;transform:scale(1.4)}.tp-md-list{margin:.5rem 0;padding-left:2.5rem}.tp-md-list-lower-alpha{list-style-type:lower-alpha}.tp-md-list-upper-alpha{list-style-type:upper-alpha}.tp-md-list-lower-roman{list-style-type:lower-roman}.tp-md-list-upper-roman{list-style-type:upper-roman}", ss = "tp-md-lists-styles";
function cs(e) {
	a(ss, os), ps(e), fs(e);
}
var ls = /^([A-Za-z]+)\.\s+([\s\S]+)$/;
function us(e) {
	if (!/^[A-Za-z]+$/.test(e)) return null;
	let t = e === e.toUpperCase();
	return /^[ivxlcdm]+$/i.test(e) && (e.length > 1 || e.toLowerCase() === "i") ? t ? "upper-roman" : "lower-roman" : t ? "upper-alpha" : "lower-alpha";
}
function ds(e) {
	let t = e.split("\n").filter((e) => e.trim() !== "");
	if (t.length === 0) return null;
	let n = [], r = null;
	for (let e of t) {
		let t = e.match(ls);
		if (!t) return null;
		r === null && (r = t[1] ?? ""), n.push(t[2] ?? "");
	}
	if (r === null) return null;
	let i = us(r);
	return i ? {
		type: i,
		items: n
	} : null;
}
function fs(e) {
	e.core.ruler.after("inline", "alpha_roman_list", (t) => {
		let n = t.tokens, r = 0;
		for (; r < n.length;) {
			if (n[r]?.type === "paragraph_open" && n[r + 1]?.type === "inline" && n[r + 2]?.type === "paragraph_close") {
				let i = n[r + 1];
				if (!i || i.type !== "inline") {
					r++;
					continue;
				}
				let a = ds(i.content);
				if (a) {
					let i = a.items.map((t) => `<li>${e.renderInline(t)}</li>`).join("\n"), o = `<ol class="tp-md-list tp-md-list-${a.type}">\n${i}\n</ol>\n`, s = new t.Token("html_block", "", 0);
					s.content = o, n.splice(r, 3, s);
					continue;
				}
			}
			r++;
		}
	});
}
function ps(e) {
	e.core.ruler.after("inline", "choice_list", (e) => {
		let t = e.tokens, n = 0, r = [];
		for (let i = 0; i < t.length; i += 1) {
			let a = t[i];
			if (a?.type === "bullet_list_open" || a?.type === "ordered_list_open") {
				n += 1;
				let e = `tp-md-choice-list-${String(n)}`;
				r.push(e), a.attrSet("data-choice-list", e);
				continue;
			}
			if (a?.type === "bullet_list_close" || a?.type === "ordered_list_close") {
				r.pop();
				continue;
			}
			if (a?.type !== "inline" || typeof a.content != "string") continue;
			let o = a.content.match(/^(\[(?: |x|X)\]|\((?: |x|X)\))\s+/);
			if (o === null) continue;
			let s = o[1] ?? "", c = s.includes("x") || s.includes("X"), l = s.startsWith("(") ? "radio" : "checkbox", u = a.content.slice(s.length).trimStart();
			a.children = ms(e.Token, {
				type: l,
				checked: c,
				content: u,
				name: r.at(-1) ?? "tp-md-choice-list"
			}), a.content = u;
			let d = hs(t, i);
			d !== null && d.attrJoin("class", "tp-md-choice-list-item");
		}
	});
}
function ms(e, t) {
	let n = new e("html_inline", "", 0);
	n.content = "<label class=\"tp-md-choice-list-label\">";
	let r = new e("html_inline", "", 0);
	r.content = `<input class="tp-md-choice-list-input" type="${t.type}" name="${gs(t.name)}" value="${gs(t.content)}" data-choice-list-name="${gs(t.name)}" ${t.checked ? "checked" : ""} />`;
	let i = new e("text", "", 0);
	i.content = t.content;
	let a = new e("html_inline", "", 0);
	return a.content = "</label>", [
		n,
		r,
		i,
		a
	];
}
function hs(e, t) {
	for (let n = t; n >= 0; --n) {
		let t = e[n];
		if (t?.type === "list_item_open") return t;
	}
	return null;
}
function gs(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/raw-html/index.js
function _s(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (o === void 0) return "";
		let s = o.info.trim().toLowerCase().replace(/\s+/g, " ");
		return s === "raw html" || s === "raw-html" ? o.content : typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
	};
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/section-numbering/index.js
function vs(e, t = {}) {
	e.core.ruler.push("tp_section_numbering", (e) => {
		let n = e.env;
		if ((n.attributes?.sectionNumbering?.enabled ?? n.attributes?.sectionNumbering?.enable ?? t.enabled ?? !1) !== !0) return;
		let r = ys(n.attributes?.sectionNumbering?.maxLevel ?? t.maxLevel ?? 6), i = Array.from({ length: r }, () => 0);
		for (let t = 0; t < e.tokens.length; t += 1) {
			let n = e.tokens[t];
			if (n?.type !== "heading_open") continue;
			let a = Number(n.tag.slice(1));
			if (!Number.isInteger(a) || a < 1 || a > r) continue;
			i[a - 1] = (i[a - 1] ?? 0) + 1;
			for (let e = a; e < i.length; e += 1) i[e] = 0;
			let o = i.slice(0, a).filter((e) => e > 0).join("."), s = e.tokens[t + 1];
			if (s?.type !== "inline") continue;
			s.children ??= [];
			let c = new e.Token("html_inline", "", 0);
			c.content = `<span data-section-number>${bs(o)} </span>`, s.children.unshift(c);
		}
	});
}
function ys(e) {
	let t = Number(e);
	return Number.isInteger(t) ? Math.min(Math.max(t, 1), 6) : 6;
}
function bs(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/tables/index.js
var xs = "tp-md-tables-styles", Ss = "\n.tp-md-table {\n  inline-size: 100%;\n  border-collapse: collapse;\n  margin-block: 1rem;\n}\n\n.tp-md-table th,\n.tp-md-table td {\n  padding: 0.5rem 0.75rem;\n  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);\n  text-align: start;\n  vertical-align: top;\n}\n\n.tp-md-table th {\n  font-weight: 700;\n  background: color-mix(in srgb, CanvasText 8%, Canvas);\n}\n\n.tp-md-table tbody tr:nth-child(even) {\n  background: color-mix(in srgb, CanvasText 4%, Canvas);\n}\n\n.tp-md-table td.tp-md-table-number {\n  text-align: end;\n  font-variant-numeric: tabular-nums;\n}\n\n.tp-md-block-table :where(th, td) > :first-child,\n.tp-md-list-table :where(th, td) > :first-child,\n.tp-md-table :where(td, th) > :first-child {\n  margin-block-start: 0;\n}\n\n.tp-md-block-table :where(th, td) > :last-child,\n.tp-md-list-table :where(th, td) > :last-child,\n.tp-md-table :where(td, th) > :last-child {\n  margin-block-end: 0;\n}\n\n.tp-md-table :where(td, th) :where(ul, ol) {\n  padding-inline-start: 1.5rem;\n  margin-block: 0.5rem;\n}\n\n.tp-md-table :where(td, th) :where(ul, ol) :where(ul, ol) {\n  margin-block: 0.25rem;\n}\n\ntable.tp-md-table.tp-md-list-table td ul,\ntable.tp-md-table.tp-md-list-table td ol,\ntable.tp-md-table.tp-md-list-table th ul,\ntable.tp-md-table.tp-md-list-table th ol {\n  list-style-position: outside;\n  padding-inline-start: 2rem;\n  margin-inline-start: 0;\n}\n\ntable.tp-md-table.tp-md-list-table td li,\ntable.tp-md-table.tp-md-list-table th li {\n  display: list-item;\n  margin-inline-start: 0;\n}\n\ntable.tp-md-table.tp-md-list-table td,\ntable.tp-md-table.tp-md-list-table th {\n  overflow: visible;\n}\n";
function Cs(e) {
	let t = e.block, n = e.renderer;
	t === void 0 || n === void 0 || (a(xs, Ss), ws(e), Os(e, t, n));
}
function ws(e) {
	let t = e.core;
	t !== void 0 && t.ruler.after("block", "tp_native_table_class", (e) => {
		for (let t of e.tokens) t.type === "table_open" && t.attrJoin("class", "tp-md-table");
		Ts(e.tokens);
	});
}
function Ts(e) {
	let t = -1;
	for (let n = 0; n < e.length; n += 1) {
		let r = e[n];
		if (r?.type === "table_open") {
			t = n;
			continue;
		}
		r?.type === "table_close" && t !== -1 && (Es(e.slice(t, n + 1)), t = -1);
	}
}
function Es(e) {
	let t = Ds(e).filter((e) => e.kind === "body"), n = Gs(t.map((e) => e.cells));
	for (let e of t) for (let t of n) e.cellTokens[t]?.attrJoin("class", "tp-md-table-number");
}
function Ds(e) {
	let t = [], n = "body", r = null, i = null;
	for (let a of e) {
		if (a.type === "thead_open") {
			n = "head";
			continue;
		}
		if (a.type === "tbody_open") {
			n = "body";
			continue;
		}
		if (a.type === "tr_open") {
			r = {
				kind: n,
				cells: [],
				cellTokens: []
			};
			continue;
		}
		if (a.type === "tr_close") {
			r !== null && (t.push(r), r = null);
			continue;
		}
		if (r !== null && (a.type === "td_open" || a.type === "th_open")) {
			i = a, r.cellTokens.push(a);
			continue;
		}
		r !== null && i !== null && a.type === "inline" && (r.cells.push(a.content), i = null);
	}
	return t;
}
function Os(e, t, n) {
	t.ruler.before("fence", "tp_table_block", (e, t, n, r) => {
		let i = Xs(e, t).trim().match(/^(`{3,}|~{3,})\s*(csv-table|json-table|ndjson-table)\s*$/);
		if (i === null) return !1;
		if (r) return !0;
		let a = i[1] ?? "```", o = i[2], s = [], c = t + 1;
		for (; c < n;) {
			let t = Xs(e, c);
			if (t.trim() === a) break;
			s.push(t), c += 1;
		}
		let l = e.push("tp_table_block", "", 0);
		return l.block = !0, l.content = s.join("\n"), l.meta = { fenceName: o }, e.line = c + 1, !0;
	}), n.rules.tp_table_block = (t, n) => {
		let r = t[n];
		if (r === void 0) return "";
		let i = ks(r.meta);
		return i === null ? "" : js(e, i, r.content);
	};
}
function ks(e) {
	return typeof e == "object" && e && typeof e.fenceName == "string" ? As(e.fenceName) : null;
}
function As(e) {
	let t = e.trim().split(/\s+/)[0] ?? "";
	return t === "csv-table" || t === "json-table" || t === "ndjson-table" ? t : null;
}
function js(e, t, n) {
	return Hs(e, Ms(t, n));
}
function Ms(e, t) {
	return e === "csv-table" ? Ns(t) : e === "json-table" ? Ps(t) : Fs(t);
}
function Ns(e) {
	return Is(Vs(e).filter((e) => e.some((e) => e.trim() !== "")));
}
function Ps(e) {
	try {
		let t = JSON.parse(e);
		return Ls(Array.isArray(t) ? t : [t]);
	} catch {
		return Bs("Invalid JSON table source");
	}
}
function Fs(e) {
	try {
		return Ls(e.split("\n").map((e) => e.trim()).filter((e) => e !== "").map((e) => JSON.parse(e)));
	} catch {
		return Bs("Invalid NDJSON table source");
	}
}
function Is(e) {
	let [t = [], ...n] = e;
	return {
		headers: t,
		rows: zs(n, t.length)
	};
}
function Ls(e) {
	let t = e.filter(Ys), n = Rs(t);
	return {
		headers: n,
		rows: t.map((e) => n.map((t) => Js(e[t])))
	};
}
function Rs(e) {
	let t = [];
	for (let n of e) for (let e of Object.keys(n)) t.includes(e) || t.push(e);
	return t;
}
function zs(e, t) {
	return e.map((e) => Array.from({ length: t }, (t, n) => e[n] ?? ""));
}
function Bs(e) {
	return {
		headers: ["Error"],
		rows: [[e]]
	};
}
function Vs(e) {
	let t = [], n = [], r = "", i = 0, a = !1;
	for (; i < e.length;) {
		let o = e[i] ?? "";
		if (a) {
			if (o === "\"" && e[i + 1] === "\"") {
				r += "\"", i += 2;
				continue;
			}
			if (o === "\"") {
				a = !1, i += 1;
				continue;
			}
			r += o, i += 1;
			continue;
		}
		if (o === "\"") {
			a = !0, i += 1;
			continue;
		}
		if (o === ",") {
			n.push(r), r = "", i += 1;
			continue;
		}
		if (o === "\n") {
			n.push(r), t.push(n), n = [], r = "", i += 1;
			continue;
		}
		o !== "\r" && (r += o), i += 1;
	}
	return n.push(r), t.push(n), t;
}
function Hs(e, t) {
	return t.headers.length === 0 && t.rows.length === 0 ? "<table class=\"tp-md-table\"></table>" : `
<table class="tp-md-table">
  ${Us(e, t.headers)}
  ${Ws(e, t.rows)}
</table>
`;
}
function Us(e, t) {
	return t.length === 0 ? "" : `
<thead>
  <tr>
    ${t.map((t) => `<th>${qs(e, t)}</th>`).join("")}
  </tr>
</thead>
`;
}
function Ws(e, t) {
	let n = Gs(t);
	return `
<tbody>
  ${t.map((t) => `
  <tr>
    ${t.map((t, r) => `<td${n.has(r) ? " class=\"tp-md-table-number\"" : ""}>${qs(e, t)}</td>`).join("")}
  </tr>`).join("")}
</tbody>
`;
}
function Gs(e) {
	let t = /* @__PURE__ */ new Set(), n = Math.max(...e.map((e) => e.length), 0);
	for (let r = 0; r < n; r += 1) {
		let n = e.map((e) => e[r] ?? "").filter((e) => e.trim() !== "");
		n.length > 0 && n.every(Ks) && t.add(r);
	}
	return t;
}
function Ks(e) {
	let t = e.trim();
	return t !== "" && /^-?\d+(?:[.,]\d+)?$/.test(t);
}
function qs(e, t) {
	return e.renderInline(t.trim());
}
function Js(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Ys(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Xs(e, t) {
	let n = e.bMarks[t] ?? 0, r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/tabs/index.js
var Zs = "tp-md-tabs-styles", Qs = "\n.tp-md-tabs {\n  --tp-md-tabs-border-color: var(--tp-tabs-border-color, var(--tp-neutral-stroke-soft));\n  --tp-md-tabs-border-selected-color: var(--tp-tabs-border-selected-color, var(--tp-brand-stroke-soft));\n  --tp-md-tabs-tab-bg: var(--tp-tabs-tab-bg, var(--tp-neutral-fill-softer));\n  --tp-md-tabs-tab-color: var(--tp-tabs-tab-color, var(--tp-text-body));\n  --tp-md-tabs-tab-selected-bg: var(--tp-tabs-tab-selected-bg, var(--tp-paper-color));\n  --tp-md-tabs-tab-selected-color: var(--tp-tabs-tab-selected-color, var(--tp-brand-seed));\n  --tp-md-tabs-panel-bg: var(--tp-tabs-panel-bg, var(--tp-paper-color));\n  display: block;\n  margin-block: 1rem;\n  min-inline-size: 0;\n  width: 100%;\n}\n\n.tp-md-tabs-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0;\n  min-inline-size: 0;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.tp-md-tabs-tab {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 1 1 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  min-inline-size: 0;\n  min-block-size: 0;\n  margin: 0;\n  margin-inline-end: 0.25rem;\n  padding: 0.25rem 0.5rem;\n  border: 1px solid var(--tp-md-tabs-border-color);\n  border-block-end: none;\n  border-radius: 0.5rem 0.5rem 0 0;\n  background: var(--tp-md-tabs-tab-bg);\n  color: var(--tp-md-tabs-tab-color);\n  cursor: pointer;\n  font: inherit;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.tp-md-tabs-tab:last-child {\n  margin-inline-end: 0;\n}\n\n.tp-md-tabs-tab[aria-selected='true'] {\n  border-color: var(--tp-md-tabs-border-selected-color);\n  background: var(--tp-md-tabs-tab-selected-bg);\n  color: var(--tp-md-tabs-tab-selected-color);\n  font-weight: 600;\n}\n\n.tp-md-tabs-panel {\n  box-sizing: border-box;\n  min-inline-size: 0;\n  max-inline-size: 100%;\n  padding: 0.75rem 1rem;\n  border: 1px solid var(--tp-md-tabs-border-color);\n  border-radius: 0 0 0.5rem 0.5rem;\n  background: var(--tp-md-tabs-panel-bg);\n}\n\n.tp-md-tabs-panel[hidden] {\n  display: none;\n}\n";
function $s(e) {
	a(Zs, Qs), ec(e);
}
function ec(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (n, r, i, a, o) => {
		let s = n[r];
		return s === void 0 ? "" : ac(s.info).name === "tabs" ? tc(e, s.content, a, r) : typeof t == "function" ? t(n, r, i, a, o) : o.renderToken(n, r, i);
	};
}
function tc(e, t, n, r) {
	let i = nc(t);
	if (i.length === 0) return "";
	let a = `tp-md-tabs-${String(r)}`;
	return `
<section class="tp-md-tabs" data-tabs>
  <div class="tp-md-tabs-list" role="tablist">
    ${i.map((e, t) => `
          <button
            class="tp-md-tabs-tab"
            type="button"
            role="tab"
            id="${a}-tab-${String(t)}"
            aria-controls="${a}-panel-${String(t)}"
            aria-selected="${t === 0 ? "true" : "false"}"
            data-tabs-tab
            data-tabs-index="${String(t)}"
          >${oc(e.label)}</button>
        `).join("")}
  </div>

  ${i.map((t, r) => `
        <div
          class="tp-md-tabs-panel"
          role="tabpanel"
          id="${a}-panel-${String(r)}"
          aria-labelledby="${a}-tab-${String(r)}"
          ${r === 0 ? "" : "hidden"}
          data-tabs-panel
          data-tabs-index="${String(r)}"
        >
          ${e.render(t.content, n)}
        </div>
      `).join("")}
</section>
`;
}
function nc(e) {
	let t = e.replace(/\r\n/g, "\n").split("\n"), n = [], r = "", i = [], a = () => {
		r.trim() !== "" && n.push({
			label: r.trim(),
			content: rc(i).trim()
		});
	};
	for (let e of t) {
		if (e.trim() === "") {
			i.push(e);
			continue;
		}
		if (!e.startsWith(":") && !e.startsWith(" ")) {
			a(), r = e.trim(), i = [];
			continue;
		}
		i.push(e.replace(/^:\s?/, ""));
	}
	return a(), n;
}
function rc(e) {
	return ic(e.map((e, t) => t === 0 || e.trim() === "" ? e.trim() === "" ? "" : e : e.replace(/^ {1,2}/, "")).join("\n"));
}
function ic(e) {
	let t = e.split("\n"), n = t.filter((e) => e.trim() !== "").map((e) => e.match(/^\s*/)?.[0].length ?? 0);
	if (n.length === 0) return e;
	let r = Math.min(...n);
	return r <= 0 ? e : t.map((e) => e.trim() === "" ? "" : e.slice(r)).join("\n");
}
function ac(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function oc(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/toc/index.js
var sc = "tp-md-toc-styles", cc = "\ndetails[data-markdown-toc] {\n  background: color-mix(in srgb, Canvas 94%, CanvasText 6%);\n  border: 1px solid color-mix(in srgb, CanvasText 12%, transparent);\n  backdrop-filter: blur(8px);\n  position: relative;\n  z-index: 20;\n}\n\ndetails[data-markdown-toc] ul {\n  margin-block: 0;\n}\n\ndetails[data-markdown-toc] li {\n  margin-block: 0.1rem;\n}\n\ndetails[data-markdown-toc] ul[data-toc-numbered] {\n  list-style: none;\n  padding-inline-start: 1rem;\n}\n\ndetails[data-markdown-toc] ul[data-toc-numbered] ul[data-toc-numbered] {\n  padding-inline-start: 1rem;\n}\n\n.tp-md-toc-aside[data-markdown-toc-position='end'] {\n  float: inline-end;\n  inline-size: min(18rem, 35%);\n  margin-inline-start: 1rem;\n  margin-block: 0 1rem;\n  border-left: none;\n  position: relative;\n  z-index: 20;\n}\n\n.tp-md-toc-aside[data-markdown-toc-position='end'] details[data-markdown-toc] {\n  position: sticky;\n  inset-block-start: 1rem;\n  z-index: 20;\n}\n\n.tp-md-toc-aside[data-markdown-toc-position='end'] details[data-markdown-toc][open] {\n  z-index: 100;\n}\n\n@media (max-width: 60rem) {\n  .tp-md-toc-aside[data-markdown-toc-position='end'] {\n    float: none;\n    inline-size: auto;\n    margin-inline-start: 0;\n  }\n\n  .tp-md-toc-aside[data-markdown-toc-position='end'] details[data-markdown-toc] {\n    position: static;\n  }\n}\n";
function lc(e, t = {}) {
	a(sc, cc), e.core.ruler.push("tp_collect_toc", (e) => {
		let t = e.env, n = Number(t.attributes?.toc?.maxLevel ?? 6), r = [];
		for (let t = 0; t < e.tokens.length; t += 1) {
			let i = e.tokens[t];
			if (i?.type !== "heading_open") continue;
			let a = Number(i.tag.slice(1));
			if (!Number.isInteger(a) || a < 1 || a > n) continue;
			let o = e.tokens[t + 1], s = o?.type === "inline" ? dc(o) : "";
			if (s === "") continue;
			let c = i.attrGet("id"), l = c ?? yc(s);
			c === null && i.attrSet("id", l), r.push({
				level: a,
				id: l,
				title: s
			});
		}
		t.__tp_toc = r;
	}), e.block.ruler.before("paragraph", "table_of_contents", (e, n, r, i) => {
		let a = (e.bMarks[n] ?? 0) + (e.tShift[n] ?? 0), o = e.eMarks[n] ?? a, s = e.src.slice(a, o).trim(), c = s.match(/^\[\[toc(?::([^\]]*))?\]\](?:\s*(\{.*\}))?$/i) ?? s.match(/^\[toc(?::([^\]]*))?\](?:\s*(\{.*\}))?$/i) ?? s.match(/^\$\{toc(?::([^}]*))?\}(?:\s*(\{.*\}))?$/i);
		if (c === null) return !1;
		if (i) return !0;
		let l = typeof c[1] == "string" && c[1].trim() !== "" ? c[1].trim() : t.defaultTitle ?? "Contents", u = vc(gc(c[2] ?? "")), d = e.push("toc_body", "", 0);
		return d.block = !0, d.meta = {
			title: l,
			position: u
		}, e.line = n + 1, !0;
	}), e.renderer.rules.toc_body = (e, n, r, i) => {
		let a = e[n];
		if (a === void 0) return "";
		let o = i.__tp_toc ?? [], s = hc(a.meta, t.defaultTitle ?? "Contents"), c = uc(o), l = mc(i), u = `
<details data-markdown-toc>
  <summary><h4>${bc(s.title)}</h4></summary>
  ${pc(c, l)}
</details>
`;
		return s.position === "end" ? `
<aside class="tp-md-toc-aside" data-markdown-toc-position="end">
  ${u}
</aside>
` : u;
	};
}
function uc(e) {
	let t = [], n = [{
		level: 0,
		children: t
	}];
	for (let t of e) {
		let e = {
			...t,
			children: []
		};
		for (; n.length > 1 && t.level <= fc(n).level;) n.pop();
		fc(n).children.push(e), n.push(e);
	}
	return t;
}
function dc(e) {
	return (e.children ?? []).map((e) => e.type === "html_inline" ? e.content.replace(/<[^>]*>/g, "") : e.content).join("").trim();
}
function fc(e) {
	let t = e.at(-1);
	return t === void 0 ? {
		level: 0,
		children: []
	} : t;
}
function pc(e, t) {
	return e.length === 0 ? "<ul></ul>" : `
<ul${e.some((e) => /^\d+(\.\d+)*\s/.test(e.title)) ? " data-toc-numbered" : ""}>
  ${e.map((e) => `
<li data-level="${e.level}">
  <a href="${xc(`${t}#${e.id}`)}">
    ${bc(e.title)}
  </a>
  ${pc(e.children, t)}
</li>`).join("")}
</ul>
`;
}
function mc(e) {
	let t = typeof e.path == "string" ? e.path.trim() : "";
	return t === "" || t === "/index.md" ? "" : `#${t.startsWith("/") ? t : `/${t}`}`;
}
function hc(e, t) {
	if (typeof e != "object" || !e) return {
		title: t,
		position: "normal"
	};
	let n = e;
	return {
		title: typeof n.title == "string" && n.title.trim() !== "" ? n.title : t,
		position: n.position === "end" ? "end" : "normal"
	};
}
function gc(e) {
	let t = e.trim();
	if (t === "" || !t.startsWith("{") || !t.endsWith("}")) return [];
	let n = t.slice(1, -1).trim();
	return n === "" ? [] : n.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map(_c).filter((e) => e !== null) ?? [];
}
function _c(e) {
	let t = e.match(/^([^=\s]+)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
	if (t === null) return null;
	let n = t[1] ?? "";
	return n === "" ? null : [n, t[2] ?? t[3] ?? t[4] ?? ""];
}
function vc(e) {
	return e.find(([e]) => e === "position")?.[1] === "end" ? "end" : "normal";
}
function yc(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function bc(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function xc(e) {
	return bc(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/extensions/web-component/index.js
var Sc = /* @__PURE__ */ new Set([
	"script",
	"style",
	"textarea",
	"template"
]), Cc = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
function wc(e) {
	Tc(e), Dc(e);
}
function Tc(e) {
	let t = e.block, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before(Bc(e), "web_component_block", (e, t, n, r) => {
		let i = kc(Fc(e, t).trim());
		if (i === null) return !1;
		let a = Ac(i.info);
		if (a === null) return !1;
		if (r) return !0;
		let o = Pc(e, t, n, i.fence), s = e.push("web_component_block", "", 0);
		return s.content = o.content, s.meta = a, s.attrs = a.attrs, s.block = !0, e.line = o.nextLine, !0;
	}, { alt: [
		"paragraph",
		"reference",
		"blockquote",
		"list"
	] }), n.rules.web_component_block = (t, n, r, i) => {
		let a = t[n];
		if (a === void 0) return "";
		let o = Rc(a.meta, "div"), s = zc(a.attrs ?? o.attrs);
		if (Cc.has(o.tag)) return `<${o.tag}${s}>\n`;
		if (Sc.has(o.tag)) return `<${o.tag}${s}>\n${a.content}\n</${o.tag}>\n`;
		if (o.tag === "tp-mdtag") return `<${o.tag}${s}>
  ${Hc(a.content)}
  </${o.tag}>
  `;
		let c = Ec(e.render(a.content, {
			...i,
			pageNavRoot: !1
		}));
		return `<${o.tag}${s}>
  ${c}
  </${o.tag}>
  `;
	});
}
function Ec(e) {
	let t = document.createElement("template");
	t.innerHTML = e;
	for (let e of t.content.querySelectorAll("p")) {
		let t = Array.from(e.childNodes).filter((e) => !(e instanceof Text) || e.textContent?.trim() !== "");
		t.length === 1 && t[0] instanceof HTMLElement && Lc(t[0].tagName.toLowerCase()) && e.replaceWith(t[0]);
	}
	return t.innerHTML;
}
function Dc(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("emphasis", "web_component_inline", (e, t) => {
		if (e.src[e.pos] !== ":") return !1;
		let n = Oc(e.src, e.pos);
		if (n === null) return !1;
		if (!t) {
			let t = e.push("web_component_inline", "", 0);
			t.content = n.content, t.attrs = n.attrs, t.meta = {
				tag: n.tag,
				attrs: n.attrs
			};
		}
		return e.pos = n.end, !0;
	}), n.rules.web_component_inline = (t, n, r, i) => {
		let a = t[n];
		if (a === void 0) return "";
		let o = Rc(a.meta, "span"), s = zc(a.attrs ?? o.attrs);
		if (Cc.has(o.tag)) return `<${o.tag}${s}>`;
		let c = e.renderInline(a.content, {
			...i,
			pageNavRoot: !1
		});
		return `<${o.tag}${s}>${c}</${o.tag}>`;
	});
}
function Oc(e, t) {
	let n = e.slice(t).match(/^:([a-z][a-z0-9-]*):/i);
	if (n === null) return null;
	let r = Ic(n[1] ?? "");
	if (!Lc(r)) return null;
	let i = t + n[0].length, a = i;
	for (; i < e.length;) {
		let t = e[i];
		if (t === "\n") return null;
		if (t === "`") {
			let t = i + 1;
			for (; e[t] === "`";) t += 1;
			let n = e.slice(i, t), r = e.indexOf(n, t);
			for (; r !== -1 && (e[r - 1] === "`" || e[r + n.length] === "`");) r = e.indexOf(n, r + n.length);
			if (r === -1 || e.slice(t, r).includes("\n")) return null;
			i = r + n.length;
			continue;
		}
		if (t === "\\" && i + 1 < e.length && e[i + 1] !== "\n") {
			i += 2;
			continue;
		}
		if (t === "{") {
			let t = Vc(e, i);
			return t === -1 ? null : {
				tag: r,
				content: e.slice(a, i).trim(),
				attrs: jc(e.slice(i, t + 1)),
				end: t + 1
			};
		}
		i += 1;
	}
	return null;
}
function kc(e) {
	let t = e.match(/^(:{3,})(.*)$/);
	if (t === null) return null;
	let n = t[1];
	return n === void 0 ? null : {
		fence: n,
		info: t[2]?.trim() ?? ""
	};
}
function Ac(e) {
	let t = e.trim();
	if (t === "") return null;
	let n = t.match(/^(\{[\s\S]*\})$/);
	if (n !== null) return {
		tag: "div",
		attrs: jc(n[1] ?? "")
	};
	let r = t.match(/^([a-z][a-z0-9-]*)(?:\s+(\{[\s\S]*\}))?$/i);
	if (r === null) return null;
	let i = r[1];
	if (i === void 0) return null;
	let a = Ic(i);
	return a === "div" && i !== "div" ? null : {
		tag: a,
		attrs: jc(r[2] ?? "")
	};
}
function jc(e) {
	let t = e.trim();
	if (t === "" || !t.startsWith("{") || !t.endsWith("}")) return [];
	let n = t.slice(1, -1).trim();
	return n === "" ? [] : Mc(n);
}
function Mc(e) {
	let t = [], n = [];
	for (let r of Nc(e)) {
		if (r.startsWith("#")) {
			let e = r.slice(1).trim();
			e !== "" && t.push(["id", e]);
			continue;
		}
		if (r.startsWith(".")) {
			let e = r.slice(1).trim();
			e !== "" && n.push(e);
			continue;
		}
		let e = r.match(/^([^=\s]+)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
		if (e !== null) {
			let n = e[1] ?? "", r = e[2] ?? e[3] ?? e[4] ?? "";
			n !== "" && t.push([n, r]);
			continue;
		}
		t.push([r, ""]);
	}
	if (n.length > 0) {
		let e = t.find(([e]) => e === "class");
		e === void 0 ? t.push(["class", n.join(" ")]) : e[1] = `${e[1]} ${n.join(" ")}`.trim();
	}
	return t;
}
function Nc(e) {
	return e.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
}
function Pc(e, t, n, r) {
	let i = [], a = t + 1;
	for (; a < n;) {
		let t = Fc(e, a);
		if (t.trim() === r) return {
			content: i.join("\n"),
			nextLine: a + 1
		};
		i.push(t), a += 1;
	}
	return {
		content: i.join("\n"),
		nextLine: a
	};
}
function Fc(e, t) {
	let n = e.bMarks[t] ?? 0, r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
function Ic(e) {
	let t = e.trim().toLowerCase();
	return /^[a-z][a-z0-9-]*$/.test(t) ? t : "div";
}
function Lc(e) {
	return /^[a-z][a-z0-9-]*$/.test(e);
}
function Rc(e, t) {
	if (typeof e == "object" && e && typeof e.tag == "string") {
		let n = e;
		return {
			tag: Ic(n.tag ?? t),
			attrs: Array.isArray(n.attrs) ? n.attrs : []
		};
	}
	return {
		tag: t,
		attrs: []
	};
}
function zc(e) {
	return e.length === 0 ? "" : e.map(([e, t]) => t === "" ? ` ${Uc(e)}` : ` ${Uc(e)}="${Uc(t)}"`).join("");
}
function Bc(e) {
	return e.block.ruler.__rules__?.[0]?.name ?? "fence";
}
function Vc(e, t) {
	let n = null;
	for (let r = t + 1; r < e.length; r += 1) {
		let t = e[r];
		if (n !== null) {
			t === n && (n = null);
			continue;
		}
		if (t === "\"" || t === "'") {
			n = t;
			continue;
		}
		if (t === "}") return r;
	}
	return -1;
}
function Hc(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Uc(e) {
	return Hc(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/engine/markdown-default-extensions.js
function Wc(e, t = {}) {
	e.use(Ui), e.use(o), e.use(Zi, {
		files: t.files,
		entryPath: t.entryPath
	}), e.use(co, {
		files: t.files,
		entryPath: t.entryPath,
		sidebarPath: "/sidebar.md"
	}), e.use(wc), e.use(vs), e.use(lc), e.use(Zo), e.use(Cs), e.use($o), e.use(Ka), e.use(Do), e.use(gi), e.use($s), e.use(cs), e.use(s), e.use(zo), e.use(_s);
}
//#endregion
//#region ../tp-markdown/dist/markdown/engine/markdown-default-plugins.js
var Gc = /* @__PURE__ */ e(di(), 1), Kc = /* @__PURE__ */ e(hi(), 1);
function qc(e) {
	e.use(Xr), e.use(pi), e.use(Gc.default, {
		leftDelimiter: "{",
		rightDelimiter: "}"
	}), e.use(Kc.default, {
		multiline: !0,
		rowspan: !0,
		headerless: !0,
		multibody: !0,
		aotolabel: !0
	});
}
//#endregion
//#region ../tp-markdown/dist/chunks/lib/yaml/yaml.js
var W = Symbol("NOT_RESOLVED"), Jc = Symbol("MERGE_KEY");
function G(e, t) {
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
function Yc(e, t) {
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
function Xc(e, t) {
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
var Zc = G("tag:yaml.org,2002:str", {
	resolve: (e) => e,
	identify: (e) => typeof e == "string"
}), Qc = [
	"",
	"~",
	"null",
	"Null",
	"NULL"
], $c = G("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: [
		"",
		"~",
		"n",
		"N"
	],
	resolve: (e) => Qc.indexOf(e) === -1 ? W : null,
	identify: (e) => e === null,
	represent: () => "null"
}), el = G("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: ["n"],
	resolve: (e, t) => e === "null" || t && e === "" ? null : W,
	identify: (e) => e === null,
	represent: () => "null"
}), tl = [
	"",
	"~",
	"null",
	"Null",
	"NULL"
], nl = G("tag:yaml.org,2002:null", {
	implicit: !0,
	implicitFirstChars: [
		"",
		"~",
		"n",
		"N"
	],
	resolve: (e) => tl.indexOf(e) === -1 ? W : null,
	identify: (e) => e === null,
	represent: () => "null"
}), rl = [
	"true",
	"True",
	"TRUE"
], il = [
	"false",
	"False",
	"FALSE"
], al = G("tag:yaml.org,2002:bool", {
	implicit: !0,
	implicitFirstChars: [
		"t",
		"T",
		"f",
		"F"
	],
	resolve: (e) => rl.indexOf(e) !== -1 || il.indexOf(e) === -1 && W,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), ol = ["true"], sl = ["false"], cl = G("tag:yaml.org,2002:bool", {
	implicit: !0,
	implicitFirstChars: ["t", "f"],
	resolve: (e) => ol.indexOf(e) !== -1 || sl.indexOf(e) === -1 && W,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), ll = [
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
], ul = [
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
], dl = G("tag:yaml.org,2002:bool", {
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
	resolve: (e) => ll.indexOf(e) !== -1 || ul.indexOf(e) === -1 && W,
	identify: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
	represent: (e) => e ? "true" : "false"
}), fl = /* @__PURE__ */ RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"), pl = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function ml(e) {
	let t = e, n = 1;
	return (t[0] === "-" || t[0] === "+") && (t[0] === "-" && (n = -1), t = t.slice(1)), t.startsWith("0b") ? n * parseInt(t.slice(2), 2) : t.startsWith("0o") ? n * parseInt(t.slice(2), 8) : t.startsWith("0x") ? n * parseInt(t.slice(2), 16) : n * parseInt(t, 10);
}
function hl(e, t) {
	if (t) {
		if (!pl.test(e)) return W;
	} else if (!fl.test(e)) return W;
	let n = ml(e);
	return Number.isFinite(n) ? n : W;
}
var gl = G("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		..."0123456789"
	],
	resolve: hl,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), _l = /* @__PURE__ */ RegExp("^-?(?:0|[1-9][0-9]*)$"), vl = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function yl(e) {
	let t = e, n = 1;
	return (t[0] === "-" || t[0] === "+") && (t[0] === "-" && (n = -1), t = t.slice(1)), t.startsWith("0b") ? n * parseInt(t.slice(2), 2) : t.startsWith("0o") ? n * parseInt(t.slice(2), 8) : t.startsWith("0x") ? n * parseInt(t.slice(2), 16) : n * parseInt(t, 10);
}
function bl(e, t) {
	if (t) {
		if (!vl.test(e)) return W;
	} else if (!_l.test(e)) return W;
	let n = yl(e);
	return Number.isFinite(n) ? n : W;
}
var xl = G("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: ["-", ..."0123456789"],
	resolve: bl,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), Sl = /* @__PURE__ */ RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");
function Cl(e) {
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
function wl(e) {
	if (!Sl.test(e)) return W;
	let t = Cl(e);
	return Number.isFinite(t) ? t : W;
}
var Tl = G("tag:yaml.org,2002:int", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		..."0123456789"
	],
	resolve: wl,
	identify: (e) => Number.isInteger(e) && !Object.is(e, -0) && e.toString(10).indexOf("e") < 0,
	represent: (e) => e.toString(10)
}), El = /* @__PURE__ */ RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), Dl = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Ol(e) {
	if (!El.test(e)) return W;
	let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
	if ("+-".includes(t[0]) && (t = t.slice(1)), t === ".inf") return n === 1 ? Infinity : -Infinity;
	if (t === ".nan") return NaN;
	let r = n * parseFloat(t);
	return Number.isFinite(r) || Dl.test(e) ? r : W;
}
function kl(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var Al = G("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		".",
		..."0123456789"
	],
	resolve: Ol,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: kl
}), jl = /* @__PURE__ */ RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"), Ml = /* @__PURE__ */ RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Nl(e, t) {
	if (t) {
		if (!Ml.test(e)) return W;
		let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
		if ("+-".includes(t[0]) && (t = t.slice(1)), t === ".inf") return n === 1 ? Infinity : -Infinity;
		if (t === ".nan") return NaN;
		let r = n * parseFloat(t);
		return Number.isFinite(r) ? r : W;
	}
	if (!jl.test(e)) return W;
	let n = Number(e);
	return Number.isFinite(n) ? n : W;
}
function Pl(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var Fl = G("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: ["-", ..."0123456789"],
	resolve: Nl,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: Pl
}), Il = /* @__PURE__ */ RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), Ll = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Rl(e) {
	if (!Il.test(e)) return W;
	let t = e.toLowerCase().replace(/_/g, ""), n = t[0] === "-" ? -1 : 1;
	if ("+-".includes(t[0]) && (t = t.slice(1)), t === ".inf") return n === 1 ? Infinity : -Infinity;
	if (t === ".nan") return NaN;
	let r = 0;
	if (t.includes(":")) {
		for (let e of t.split(":")) r = r * 60 + Number(e);
		r *= n;
	} else r = n * parseFloat(t);
	return Number.isFinite(r) || Ll.test(e) ? r : W;
}
function zl(e) {
	if (isNaN(e)) return ".nan";
	if (e === Infinity) return ".inf";
	if (e === -Infinity) return "-.inf";
	if (Object.is(e, -0)) return "-0.0";
	let t = e.toString(10);
	return /^[-+]?[0-9]+e/.test(t) ? t.replace("e", ".e") : t;
}
var Bl = G("tag:yaml.org,2002:float", {
	implicit: !0,
	implicitFirstChars: [
		"-",
		"+",
		".",
		..."0123456789"
	],
	resolve: Rl,
	identify: (e) => typeof e == "number" && (!Number.isInteger(e) || Object.is(e, -0) || e.toString(10).indexOf("e") >= 0),
	represent: zl
}), Vl = G("tag:yaml.org,2002:merge", {
	implicit: !0,
	implicitFirstChars: ["<"],
	resolve: (e, t) => e === "<<" || t && e === "" ? Jc : W
}), Hl = /^[A-Za-z0-9+/]*={0,2}$/;
function Ul(e) {
	let t = e.replace(/\s/g, "");
	if (t.length % 4 != 0 || !Hl.test(t)) return W;
	let n = atob(t), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return r;
}
function Wl(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
	return btoa(t);
}
var Gl = G("tag:yaml.org,2002:binary", {
	resolve: Ul,
	identify: (e) => Object.prototype.toString.call(e) === "[object Uint8Array]",
	represent: Wl
}), Kl = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), ql = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function Jl(e) {
	let t = Kl.exec(e);
	if (t === null && (t = ql.exec(e)), t === null) return W;
	let n = +t[1], r = t[2] - 1, i = +t[3];
	if (!t[4]) {
		let e = new Date(Date.UTC(n, r, i));
		return e.getUTCFullYear() !== n || e.getUTCMonth() !== r || e.getUTCDate() !== i ? W : e;
	}
	let a = +t[4], o = +t[5], s = +t[6], c = 0;
	if (a > 23 || o > 59 || s > 59) return W;
	if (t[7]) {
		let e = t[7].slice(0, 3);
		for (; e.length < 3;) e += "0";
		c = +e;
	}
	let l = new Date(Date.UTC(n, r, i, a, o, s, c));
	if (l.getUTCFullYear() !== n || l.getUTCMonth() !== r || l.getUTCDate() !== i) return W;
	if (t[9]) {
		let e = +t[10], n = +(t[11] || 0);
		if (e > 23 || n > 59) return W;
		let r = (e * 60 + n) * 6e4;
		l.setTime(l.getTime() - (t[9] === "-" ? -r : r));
	}
	return l;
}
var Yl = G("tag:yaml.org,2002:timestamp", {
	implicit: !0,
	implicitFirstChars: [..."0123456789"],
	resolve: Jl,
	identify: (e) => e instanceof Date,
	represent: (e) => e.toISOString()
}), Xl = Yc("tag:yaml.org,2002:seq", {
	create: () => [],
	addItem: (e, t) => {
		e.push(t);
	},
	identify: Array.isArray
});
function Zl(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === null || t === Object.prototype;
}
function Ql(e, t) {
	let n = {};
	for (let r of t) e[r] !== void 0 && (n[r] = e[r]);
	return n;
}
var $l = Yc("tag:yaml.org,2002:omap", {
	create: () => ({
		list: [],
		seen: /* @__PURE__ */ new Set()
	}),
	addItem: (e, t) => {
		let n;
		if (t instanceof Map) {
			if (t.size !== 1) return "cannot resolve an ordered map item";
			n = t.keys().next().value;
		} else if (Zl(t)) {
			let e = Object.keys(t);
			if (e.length !== 1) return "cannot resolve an ordered map item";
			n = e[0];
		} else return "cannot resolve an ordered map item";
		return e.seen.has(n) ? "duplicate key in ordered map" : (e.seen.add(n), e.list.push(t), "");
	},
	finalize: (e) => e.list
}), eu = Yc("tag:yaml.org,2002:pairs", {
	create: () => [],
	addItem: (e, t) => {
		if (t instanceof Map) return t.size === 1 ? (e.push(t.entries().next().value), "") : "cannot resolve a pairs item";
		if (Object.prototype.toString.call(t) !== "[object Object]") return "cannot resolve a pairs item";
		let n = t, r = Object.keys(n);
		return r.length === 1 ? (e.push([r[0], n[r[0]]]), "") : "cannot resolve a pairs item";
	}
}), tu = Xc("tag:yaml.org,2002:map", {
	create: () => ({}),
	identify: Zl,
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
}), nu = Xc("tag:yaml.org,2002:set", {
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
function ru() {
	return {
		scalar: {},
		sequence: {},
		mapping: {}
	};
}
function iu() {
	return {
		scalar: [],
		sequence: [],
		mapping: []
	};
}
function au(e) {
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
var ou = class e {
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
		let t = au(e), n = [], r = ru(), i = iu();
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
}, su = new ou([
	Zc,
	Xl,
	tu
]);
new ou([
	...su.tags,
	el,
	cl,
	xl,
	Fl
]);
var cu = new ou([
	...su.tags,
	$c,
	al,
	gl,
	Al
]), lu = new ou([
	...su.tags,
	nl,
	dl,
	Tl,
	Bl,
	Yl,
	Vl,
	Gl,
	$l,
	eu,
	nu
]);
Xc("tag:yaml.org,2002:map", {
	create: () => /* @__PURE__ */ new Map(),
	addPair: (e, t, n) => (e.set(t, n), ""),
	has: (e, t) => e.has(t),
	keys: (e) => e.keys(),
	get: (e, t) => e.get(t),
	identify: (e) => e instanceof Map || Zl(e),
	represent: (e) => {
		if (e instanceof Map) return e;
		let t = /* @__PURE__ */ new Map(), n = e;
		for (let e of Object.keys(n)) t.set(e, n[e]);
		return t;
	}
});
function uu(e) {
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
Xc("tag:yaml.org,2002:map", {
	create: () => ({}),
	identify: Zl,
	represent: (e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of Object.keys(e)) t.set(n, e[n]);
		return t;
	},
	addPair: (e, t, n) => {
		let r = uu(t);
		return r === null ? "nested arrays are not supported inside keys" : (r === "__proto__" ? Object.defineProperty(e, r, {
			value: n,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = n, "");
	},
	has: (e, t) => {
		let n = uu(t);
		return n !== null && Object.prototype.hasOwnProperty.call(e, n);
	},
	keys: (e) => Object.keys(e),
	get: (e, t) => e[String(t)]
});
var du = {
	maxLength: 79,
	indent: 1,
	linesBefore: 3,
	linesAfter: 2
};
function fu(e, t, n, r, i) {
	let a = "", o = "", s = Math.floor(i / 2) - 1;
	return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, "→") + o,
		pos: r - t + a.length
	};
}
function pu(e, t) {
	return " ".repeat(Math.max(t - e.length, 0)) + e;
}
function mu(e, t) {
	if (!e.buffer) return null;
	let n = {
		...du,
		...t
	}, r = /\r?\n|\r|\0/g, i = [0], a = [], o, s = -1;
	for (; o = r.exec(e.buffer);) a.push(o.index), i.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = i.length - 2);
	s < 0 && (s = i.length - 1);
	let c = "", l = Math.min(e.line + n.linesAfter, a.length).toString().length, u = n.maxLength - (n.indent + l + 3);
	for (let t = 1; t <= n.linesBefore && !(s - t < 0); t++) {
		let r = fu(e.buffer, i[s - t], a[s - t], e.position - (i[s] - i[s - t]), u);
		c = `${" ".repeat(n.indent)}${pu((e.line - t + 1).toString(), l)} | ${r.str}\n${c}`;
	}
	let d = fu(e.buffer, i[s], a[s], e.position, u);
	c += `${" ".repeat(n.indent)}${pu((e.line + 1).toString(), l)} | ${d.str}\n`, c += `${"-".repeat(n.indent + l + 3 + d.pos)}^\n`;
	for (let t = 1; t <= n.linesAfter && !(s + t >= a.length); t++) {
		let r = fu(e.buffer, i[s + t], a[s + t], e.position - (i[s] - i[s + t]), u);
		c += `${" ".repeat(n.indent)}${pu((e.line + t + 1).toString(), l)} | ${r.str}\n`;
	}
	return c.replace(/\n$/, "");
}
function hu(e, t) {
	let n = "";
	return e.mark ? (e.mark.name && (n += `in "${e.mark.name}" `), n += `(${e.mark.line + 1}:${e.mark.column + 1})`, !t && e.mark.snippet && (n += `\n\n${e.mark.snippet}`), `${e.reason} ${n}`) : e.reason;
}
var gu = class extends Error {
	reason;
	mark;
	constructor(e, t) {
		super(), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = hu(this, !1), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}
	toString(e) {
		return `${this.name}: ${hu(this, e)}`;
	}
};
function _u(e, t, n, r = "") {
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
	throw o.snippet = mu(o), new gu(n, o);
}
var vu = -1;
function yu(e) {
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
var bu = Array(256), xu = Array(256);
for (let e = 0; e < 256; e++) bu[e] = +!!yu(e), xu[e] = yu(e);
function Su(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function Cu(e) {
	return e >= 48 && e <= 57 ? e - 48 : (e | 32) - 97 + 10;
}
function wu(e) {
	return e === 120 ? 2 : e === 117 ? 4 : 8;
}
function Tu(e, t, n) {
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
function Eu(e) {
	return e === 1 ? " " : "\n".repeat(e - 1);
}
function Du(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = Tu(e, i, n);
			r += Eu(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, o);
}
function Ou(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 39) r += e.slice(a, i) + "'", i += 2, a = o = i;
		else if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = Tu(e, i, n);
			r += Eu(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, n);
}
function ku(e, t, n) {
	let r = "", i = t, a = t, o = t;
	for (; i < n;) {
		let t = e.charCodeAt(i);
		if (t === 92) {
			r += e.slice(a, i), i++;
			let t = e.charCodeAt(i);
			if (t === 10 || t === 13) i = Tu(e, i, n).position;
			else if (t < 256 && bu[t]) r += xu[t], i++;
			else {
				let n = wu(t), a = 0;
				for (; n > 0; n--) {
					i++;
					let t = Cu(e.charCodeAt(i));
					a = (a << 4) + t;
				}
				r += Su(a), i++;
			}
			a = o = i;
		} else if (t === 10 || t === 13) {
			r += e.slice(a, o);
			let t = Tu(e, i, n);
			r += Eu(t.breaks), i = a = o = t.position;
		} else i++, t !== 32 && t !== 9 && (o = i);
	}
	return r + e.slice(a, n);
}
function Au(e, t, n, r, i, a) {
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
function ju(e, t) {
	if (t.valueStart === vu) return "";
	let { valueStart: n, valueEnd: r } = t;
	if (t.fast) return e.slice(n, r);
	switch (t.style) {
		case 2: return Ou(e, n, r);
		case 3: return ku(e, n, r);
		case 4: return Au(e, n, r, t.indent, t.chomping, !1);
		case 5: return Au(e, n, r, t.indent, t.chomping, !0);
		default: return Du(e, n, r);
	}
}
var Mu = {
	"!": "!",
	"!!": "tag:yaml.org,2002:"
};
function Nu(e, t) {
	if (e.startsWith("!<") && e.endsWith(">")) return decodeURIComponent(e.slice(2, -1));
	let n = e.indexOf("!", 1), r = n === -1 ? "!" : e.slice(0, n + 1), i = t?.[r] ?? Mu[r] ?? r;
	return decodeURIComponent(i) + decodeURIComponent(e.slice(r.length));
}
var Pu = -1, Fu = {
	filename: "",
	schema: cu,
	json: !1,
	maxTotalMergeKeys: 1e4,
	maxAliases: -1
};
function Iu(e) {
	return "tagStart" in e && e.tagStart !== Pu ? e.tagStart : "anchorStart" in e && e.anchorStart !== Pu ? e.anchorStart : "valueStart" in e && e.valueStart !== Pu ? e.valueStart : "start" in e ? e.start : 0;
}
function K(e, t) {
	_u(e.source, e.position, t, e.filename);
}
function Lu(e, t, n, r) {
	try {
		return n.finalize(r);
	} catch (n) {
		if (n instanceof gu) throw n;
		_u(e.source, t, n instanceof Error ? n.message : String(n), e.filename);
	}
}
function Ru(e, t, n) {
	let r = e[n];
	if (r) return r;
	for (let e of t) if (n.startsWith(e.tagName)) return e;
}
function zu(e, t, n, r, i) {
	let a = Ru(t, n, r);
	if (a) return a;
	K(e, `unknown ${i} tag !<${r}>`);
}
function Bu(e, t) {
	let n = ju(e.source, t), r = t.tagStart === Pu ? "" : e.source.slice(t.tagStart, t.tagEnd), i = e.schema.defaultScalarTag;
	if (r !== "") {
		if (r === "!") return {
			value: n,
			tag: i
		};
		let t = Nu(r, e.tagHandlers), a = Ru(e.schema.exact.scalar, e.schema.prefix.scalar, t);
		if (a) {
			let r = a.resolve(n, !0, t);
			return r === W && K(e, `cannot resolve a node with !<${t}> explicit tag`), {
				value: r,
				tag: a
			};
		}
		let o = Ru(e.schema.exact.mapping, e.schema.prefix.mapping, t) ?? Ru(e.schema.exact.sequence, e.schema.prefix.sequence, t);
		if (o) {
			n !== "" && K(e, `cannot resolve a node with !<${t}> explicit tag`);
			let r = o.create(t);
			return {
				value: o.carrierIsResult ? r : Lu(e, e.position, o, r),
				tag: o
			};
		}
		K(e, `unknown scalar tag !<${t}>`);
	}
	if (t.style === 1) {
		let t = e.schema.implicitScalarByFirstChar.get(n.charAt(0)) ?? e.schema.implicitScalarAnyFirstChar;
		for (let e of t) {
			let t = e.resolve(n, !1, e.tagName);
			if (t !== W) return {
				value: t,
				tag: e
			};
		}
	}
	return {
		value: i.resolve(n, !1, i.tagName),
		tag: i
	};
}
function Vu(e, t, n, r, i, a) {
	let o = t.tagStart === Pu ? "" : e.source.slice(t.tagStart, t.tagEnd), s = o === "" || o === "!" ? i : Nu(o, e.tagHandlers);
	return {
		tagName: s,
		tag: zu(e, n, r, s, a)
	};
}
function Hu(e) {
	return e.nodeKind === "mapping";
}
function Uu(e, t, n, r) {
	for (let i of r.keys(n)) {
		if (e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && K(e, `merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`), t.tag.has(t.value, i)) continue;
		let a = t.tag.addPair(t.value, i, r.get(n, i));
		a && K(e, a), (t.overridable ??= /* @__PURE__ */ new Set()).add(i);
	}
}
function Wu(e, t, n, r) {
	if (e.position = t.keyPosition, Hu(r)) Uu(e, t, n, r);
	else if (r.nodeKind === "sequence" && Array.isArray(n)) for (let r of n) Uu(e, t, r, t.tag);
	else K(e, "cannot merge mappings; the provided source object is unacceptable");
}
function Gu(e, t, n, r, i) {
	if (e.position = t.keyPosition, n === Jc) {
		Wu(e, t, r, i);
		return;
	}
	!e.json && t.tag.has(t.value, n) && !t.overridable?.has(n) && K(e, "duplicated mapping key");
	let a = t.tag.addPair(t.value, n, r);
	a && K(e, a), t.overridable?.delete(n);
}
function Ku(e, t, n) {
	let r = e.frames[e.frames.length - 1];
	if (r.kind === "document") r.value = t, r.hasValue = !0;
	else if (r.kind === "sequence") {
		r.merge && (Hu(n) || K(e, "cannot merge mappings; the provided source object is unacceptable"));
		let i = r.tag.addItem(r.value, t, r.index++);
		i && K(e, i);
	} else if (r.hasKey) {
		let i = r.key;
		r.key = void 0, r.hasKey = !1, Gu(e, r, i, t, n);
	} else r.key = t, r.keyPosition = e.position, r.hasKey = !0;
}
function qu(e, t, n, r, i) {
	if (t.anchorStart !== Pu) {
		let a = {
			value: n,
			tag: r,
			isValueFinal: i
		};
		return e.anchors.set(e.source.slice(t.anchorStart, t.anchorEnd), a), a;
	}
	return null;
}
function Ju(e, t) {
	let n = {
		...Fu,
		...t,
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
	for (; n.eventIndex < n.events.length;) {
		let e = n.events[n.eventIndex++];
		switch (n.position = Iu(e), e.type) {
			case 1:
				n.anchors = /* @__PURE__ */ new Map(), n.aliasCount = 0, n.tagHandlers = Object.create(null);
				for (let t of e.directives) t.kind === "tag" && (n.tagHandlers[t.handle] = t.prefix);
				n.frames.push({
					kind: "document",
					position: n.position,
					value: void 0,
					hasValue: !1
				});
				break;
			case 4: {
				let { value: t, tag: r } = Bu(n, e);
				qu(n, e, t, r, !0), Ku(n, t, r);
				break;
			}
			case 2: {
				let t = Vu(n, e, n.schema.exact.sequence, n.schema.prefix.sequence, "tag:yaml.org,2002:seq", "sequence"), r = t.tag.create(t.tagName), i = qu(n, e, r, t.tag, t.tag.carrierIsResult), a = n.frames[n.frames.length - 1], o = a !== void 0 && a.kind === "mapping" && a.hasKey && a.key === Jc;
				n.frames.push({
					kind: "sequence",
					position: n.position,
					value: r,
					tag: t.tag,
					anchor: i,
					index: 0,
					merge: o
				});
				break;
			}
			case 3: {
				let t = Vu(n, e, n.schema.exact.mapping, n.schema.prefix.mapping, "tag:yaml.org,2002:map", "mapping"), r = t.tag.create(t.tagName), i = qu(n, e, r, t.tag, t.tag.carrierIsResult);
				n.frames.push({
					kind: "mapping",
					position: n.position,
					value: r,
					tag: t.tag,
					anchor: i,
					key: void 0,
					keyPosition: n.position,
					hasKey: !1,
					overridable: null
				});
				break;
			}
			case 5: {
				n.maxAliases !== -1 && ++n.aliasCount > n.maxAliases && K(n, `aliases exceeded maxAliases (${n.maxAliases})`);
				let t = n.source.slice(e.anchorStart, e.anchorEnd), r = n.anchors.get(t);
				r || K(n, `unidentified alias "${t}"`), r.isValueFinal || K(n, `recursive alias "${t}" is not supported for tag ${r.tag.tagName} because it uses finalize()`), Ku(n, r.value, r.tag);
				break;
			}
			case 6: {
				let e = n.frames.pop();
				if (e.kind === "document") n.documents.push(e.value);
				else {
					let t = e.tag.carrierIsResult ? e.value : Lu(n, e.position, e.tag, e.value);
					e.anchor && (e.anchor.value = t, e.anchor.isValueFinal = !0), Ku(n, t, e.tag);
				}
				break;
			}
		}
	}
	return n.documents;
}
var q = -1, Yu = Object.prototype.hasOwnProperty, Xu = 1, Zu = 2, Qu = 3, $u = 4, ed = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, td = /[,\[\]{}]/, nd = /^(?:!|!!|![0-9A-Za-z-]+!)$/, rd = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`, id = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`, ad = RegExp(`^(?:${rd})*$`), od = RegExp(`^(?:${id})+$`), sd = RegExp(`^(?:!(?:${rd})*|${id}(?:${rd})*)$`), cd = {
	filename: "",
	maxDepth: 100
};
function ld(e, t, n) {
	e.events.push({
		type: 1,
		explicitStart: t,
		explicitEnd: n,
		directives: e.directives
	});
}
function ud(e, t, n, r, i, a, o) {
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
function dd(e, t, n, r, i, a, o) {
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
function fd(e, t) {
	e.events.splice(t.eventsLength, 0, {
		type: 3,
		start: t.position,
		anchorStart: q,
		anchorEnd: q,
		tagStart: q,
		tagEnd: q,
		style: 2
	});
}
function pd(e, t, n, r, i, a, o, s, c = 1, l = -1, u = !1) {
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
function md(e, t, n) {
	e.events.push({
		type: 5,
		anchorStart: t,
		anchorEnd: n
	});
}
function hd(e) {
	e.events.push({ type: 6 });
}
function J(e) {
	pd(e, q, q, q, q, q, q, 1);
}
function gd() {
	return {
		anchorStart: q,
		anchorEnd: q,
		tagStart: q,
		tagEnd: q
	};
}
function _d(e) {
	return {
		position: e.position,
		line: e.line,
		lineStart: e.lineStart,
		lineIndent: e.lineIndent,
		firstTabInLine: e.firstTabInLine,
		eventsLength: e.events.length
	};
}
function vd(e, t) {
	e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.events.length = t.eventsLength;
}
function Y(e, t) {
	_u(e.input.slice(0, e.length), e.position, t, e.filename);
}
function X(e) {
	return e === 10 || e === 13;
}
function yd(e) {
	return e === 9 || e === 32;
}
function Z(e) {
	return yd(e) || X(e);
}
function bd(e) {
	return e === 0 || Z(e);
}
function xd(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Sd(e) {
	return e >= 48 && e <= 57 ? e - 48 : -1;
}
function Cd(e) {
	if (e >= 48 && e <= 57) return e - 48;
	let t = e | 32;
	return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function wd(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Td(e) {
	return e === 48 || e === 97 || e === 98 || e === 116 || e === 9 || e === 110 || e === 118 || e === 102 || e === 114 || e === 101 || e === 32 || e === 34 || e === 47 || e === 92 || e === 78 || e === 95 || e === 76 || e === 80;
}
function Ed(e) {
	e.input.charCodeAt(e.position) === 10 ? e.position++ : (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++), e.line++, e.lineStart = e.position, e.lineIndent = 0, e.firstTabInLine = -1;
}
function Q(e, t) {
	let n = 0, r = e.input.charCodeAt(e.position), i = e.position === e.lineStart || Z(e.input.charCodeAt(e.position - 1));
	for (; r !== 0;) {
		for (; yd(r);) i = !0, r === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), r = e.input.charCodeAt(++e.position);
		if (t && i && r === 35) do
			r = e.input.charCodeAt(++e.position);
		while (!X(r) && r !== 0);
		if (!X(r)) break;
		for (Ed(e), n++, i = !0, r = e.input.charCodeAt(e.position); r === 32;) e.lineIndent++, r = e.input.charCodeAt(++e.position);
	}
	return n;
}
function Dd(e, t = e.position) {
	let n = e.input.charCodeAt(t);
	if ((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2)) {
		let n = e.input.charCodeAt(t + 3);
		return n === 0 || Z(n);
	}
	return !1;
}
function Od(e) {
	let t = e.input.charCodeAt(e.position);
	for (; t !== 0 && !X(t);) t = e.input.charCodeAt(++e.position);
}
function kd(e, t, n) {
	ed.test(e.input.slice(t, n)) && Y(e, "the stream contains non-printable characters");
}
function Ad(e, t, n) {
	if (e.input.charCodeAt(e.position) !== 33) return !1;
	t.tagStart !== q && Y(e, "duplication of a tag property");
	let r = e.position, i = !1, a = !1, o = "!", s = e.input.charCodeAt(++e.position);
	s === 60 ? (i = !0, s = e.input.charCodeAt(++e.position)) : s === 33 && (a = !0, o = "!!", s = e.input.charCodeAt(++e.position));
	let c = e.position, l;
	if (i) {
		for (; s !== 0 && s !== 62;) s = e.input.charCodeAt(++e.position);
		s !== 62 && Y(e, "unexpected end of the stream within a verbatim tag"), l = e.input.slice(c, e.position), e.position++;
	} else {
		for (; s !== 0 && !Z(s) && !(n && xd(s));) s === 33 && (a ? Y(e, "tag suffix cannot contain exclamation marks") : (o = e.input.slice(c - 1, e.position + 1), nd.test(o) || Y(e, "named tag handle cannot contain such characters"), a = !0, c = e.position + 1)), s = e.input.charCodeAt(++e.position);
		l = e.input.slice(c, e.position), td.test(l) && Y(e, "tag suffix cannot contain flow indicator characters");
	}
	return l && !(i ? ad.test(l) : od.test(l)) && Y(e, `tag name cannot contain such characters: ${l}`), !i && o !== "!" && o !== "!!" && !Yu.call(e.tagHandlers, o) && Y(e, `undeclared tag handle "${o}"`), t.tagStart = r, t.tagEnd = e.position, !0;
}
function jd(e, t) {
	if (e.input.charCodeAt(e.position) !== 38) return !1;
	t.anchorStart !== q && Y(e, "duplication of an anchor property"), e.position++;
	let n = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !Z(e.input.charCodeAt(e.position)) && !xd(e.input.charCodeAt(e.position));) e.position++;
	return e.position === n && Y(e, "name of an anchor node must contain at least one character"), t.anchorStart = n, t.anchorEnd = e.position, !0;
}
function Md(e, t) {
	if (e.input.charCodeAt(e.position) !== 42) return !1;
	(t.anchorStart !== q || t.tagStart !== q) && Y(e, "alias node should not have any properties"), e.position++;
	let n = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !Z(e.input.charCodeAt(e.position)) && !xd(e.input.charCodeAt(e.position));) e.position++;
	return e.position === n && Y(e, "name of an alias node must contain at least one character"), md(e, n, e.position), !0;
}
function Nd(e, t) {
	Q(e, !1), e.lineIndent < t && Y(e, "deficient indentation");
}
function Pd(e, t, n) {
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
			return e.position++, pd(e, r, t, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2, 1, -1, i), !0;
		}
		X(a) ? (i = !1, Nd(e, t)) : e.position === e.lineStart && Dd(e) ? Y(e, "unexpected end of the document within a single quoted scalar") : a !== 9 && a < 32 ? Y(e, "expected valid JSON character") : e.position++;
	}
	Y(e, "unexpected end of the stream within a single quoted scalar");
}
function Fd(e, t, n) {
	if (e.input.charCodeAt(e.position) !== 34) return !1;
	e.position++;
	let r = e.position, i = !0;
	for (; e.input.charCodeAt(e.position) !== 0;) {
		let a = e.input.charCodeAt(e.position);
		if (a === 34) {
			let t = e.position;
			return e.position++, pd(e, r, t, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 3, 1, -1, i), !0;
		}
		if (a === 92) {
			i = !1;
			let n = e.input.charCodeAt(++e.position);
			if (X(n)) Nd(e, t);
			else if (Td(n)) e.position++;
			else {
				let t = wd(n);
				for (t === 0 && Y(e, "unknown escape sequence"); t-- > 0;) e.position++, Cd(e.input.charCodeAt(e.position)) < 0 && Y(e, "expected hexadecimal character");
				e.position++;
			}
		} else X(a) ? (i = !1, Nd(e, t)) : e.position === e.lineStart && Dd(e) ? Y(e, "unexpected end of the document within a double quoted scalar") : a !== 9 && a < 32 ? Y(e, "expected valid JSON character") : e.position++;
	}
	Y(e, "unexpected end of the stream within a double quoted scalar");
}
function Id(e, t, n) {
	let r = e.input.charCodeAt(e.position), i = 1, a = -1, o = !1;
	if (r !== 124 && r !== 62) return !1;
	let s = r === 124 ? 4 : 5;
	for (e.position++; e.input.charCodeAt(e.position) !== 0;) {
		let n = e.input.charCodeAt(e.position), r = Sd(n);
		if (n === 43 || n === 45) i !== 1 && Y(e, "repeat of a chomping mode identifier"), i = n === 43 ? 3 : 2, e.position++;
		else if (r >= 0) r === 0 && Y(e, "bad explicit indentation width of a block scalar; it cannot be less than one"), o && Y(e, "repeat of an indentation width identifier"), a = t + r - 1, o = !0, e.position++;
		else break;
	}
	let c = !1;
	for (; yd(e.input.charCodeAt(e.position));) c = !0, e.position++;
	c && e.input.charCodeAt(e.position) === 35 && Od(e), X(e.input.charCodeAt(e.position)) ? Ed(e) : e.input.charCodeAt(e.position) !== 0 && Y(e, "a line break is expected");
	let l = o ? a : -1, u = 0, d = e.position, f = e.position;
	for (; e.input.charCodeAt(e.position) !== 0;) {
		let n = e.position, r = 0;
		for (; e.input.charCodeAt(n + r) === 32;) r++;
		let i = e.input.charCodeAt(n + r);
		if (i === 0) {
			l >= 0 ? r > l && (f = n + r) : r > 0 && (f = n + r);
			break;
		}
		if (n === e.lineStart && Dd(e, n)) break;
		if (!o && l === -1 && X(i) && (u = Math.max(u, r)), !o && l === -1 && !X(i) && (i === 9 && r < t && (e.position = n + r, Y(e, "tab characters must not be used in indentation")), r < u && (e.position = n + r, Y(e, "bad indentation of a mapping entry"))), l === -1 && i !== 0 && !X(i) && r < t) {
			e.lineIndent = r, e.position = n + r;
			break;
		}
		!o && i !== 0 && !X(i) && l === -1 && (l = r);
		let a = l === -1 ? t + 1 : l;
		if (i !== 0 && !X(i) && r < a) {
			e.lineIndent = r, e.position = n + r;
			break;
		}
		Od(e), f = e.position, X(e.input.charCodeAt(e.position)) && (Ed(e), f = e.position);
	}
	return kd(e, d, f), pd(e, d, f, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, s, i, l), !0;
}
function Ld(e, t) {
	let n = e.input.charCodeAt(e.position), r = t === Xu;
	if (n === 0 || Z(n) || n === 35 || n === 38 || n === 42 || n === 33 || n === 124 || n === 62 || n === 39 || n === 34 || n === 37 || n === 64 || n === 96 || r && xd(n)) return !1;
	if (n === 63 || n === 45) {
		let t = e.input.charCodeAt(e.position + 1);
		if (bd(t) || r && xd(t)) return !1;
	}
	return !0;
}
function Rd(e, t, n, r) {
	if (!Ld(e, n)) return !1;
	let i = e.position, a = e.position, o = e.input.charCodeAt(e.position), s = n === Xu, c = !1;
	for (; o !== 0 && !(e.position === e.lineStart && Dd(e));) {
		if (o === 58) {
			let t = e.input.charCodeAt(e.position + 1);
			if (bd(t) || s && xd(t)) break;
		} else if (o === 35) {
			if (Z(e.input.charCodeAt(e.position - 1))) break;
		} else if (s && xd(o)) break;
		else if (X(o)) {
			let n = e.position, r = e.line, i = e.lineStart, a = e.lineIndent;
			if (Q(e, !1), e.lineIndent >= t) {
				c = !0, o = e.input.charCodeAt(e.position);
				continue;
			}
			e.position = n, e.line = r, e.lineStart = i, e.lineIndent = a;
			break;
		}
		yd(o) || (a = e.position + 1), o = e.input.charCodeAt(++e.position);
	}
	return a === i ? !1 : (kd(e, i, a), pd(e, i, a, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1, 1, -1, !c), !0);
}
function zd(e, t) {
	let n = e.line;
	Q(e, !0), (e.line > n && e.lineIndent < t || e.firstTabInLine !== -1 && e.lineIndent < t) && Y(e, "deficient indentation");
}
function Bd(e, t, n) {
	let r = e.input.charCodeAt(e.position), i = r === 123, a = e.position, o = !0;
	if (r !== 91 && r !== 123) return !1;
	let s = i ? 125 : 93;
	for (i ? dd(e, a, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2) : ud(e, a, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 2), e.position++; e.input.charCodeAt(e.position) !== 0;) {
		zd(e, t);
		let n = e.input.charCodeAt(e.position);
		if (n === s) return e.position++, hd(e), !0;
		o ? n === 44 && Y(e, "expected the node content, but found ','") : Y(e, "missed comma between flow collection entries");
		let r = !1, a = !1;
		n === 63 && Z(e.input.charCodeAt(e.position + 1)) && (r = a = !0, e.position += 1, zd(e, t));
		let c = e.line, l = _d(e), u = Ud(e, t, Xu, !1, !0);
		zd(e, t), n = e.input.charCodeAt(e.position), (i || a || e.line === c) && n === 58 ? (r = !0, e.position++, zd(e, t), i || fd(e, l), u || J(e), Ud(e, t, Xu, !1, !0) || J(e), zd(e, t), i || hd(e)) : i && r ? (u || J(e), J(e)) : i ? J(e) : r && (fd(e, l), u || J(e), J(e), hd(e)), n = e.input.charCodeAt(e.position), n === 44 ? (o = !0, e.position++) : o = !1;
	}
	Y(e, "unexpected end of the stream within a flow collection");
}
function Vd(e, t, n) {
	if (e.firstTabInLine !== -1 || e.input.charCodeAt(e.position) !== 45 || !bd(e.input.charCodeAt(e.position + 1))) return !1;
	for (ud(e, e.position, n.anchorStart, n.anchorEnd, n.tagStart, n.tagEnd, 1); e.input.charCodeAt(e.position) === 45 && bd(e.input.charCodeAt(e.position + 1));) {
		e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, Y(e, "tab characters must not be used in indentation"));
		let n = e.line;
		e.position++;
		let r = Q(e, !0) > 0;
		if (e.firstTabInLine !== -1 && e.input.charCodeAt(e.position) === 45 && bd(e.input.charCodeAt(e.position + 1)) && Y(e, "bad indentation of a sequence entry"), r && e.lineIndent <= t ? J(e) : Ud(e, t, Qu, !1, !0), Q(e, !0), e.lineIndent < t || e.position >= e.length) break;
		e.lineIndent > t && Y(e, "bad indentation of a sequence entry"), e.line === n && e.input.charCodeAt(e.position) === 45 && bd(e.input.charCodeAt(e.position + 1)) && Y(e, "bad indentation of a sequence entry");
	}
	return hd(e), !0;
}
function Hd(e, t, n, r) {
	let i = !1, a = !1, o = !1, s = !1;
	if (e.firstTabInLine !== -1) return !1;
	let c = e.input.charCodeAt(e.position);
	for (; c !== 0;) {
		!i && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, Y(e, "tab characters must not be used in indentation"));
		let l = e.input.charCodeAt(e.position + 1), u = e.line;
		if ((c === 63 || c === 58) && bd(l)) o ||= (dd(e, e.position, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1), !0), c === 63 ? (i && J(e), a = !0, i = !0) : i ? i = !1 : (J(e), a = !0, i = !1), e.position += 1, s = !0;
		else {
			i &&= (J(e), !1);
			let t = _d(e);
			if (!Ud(e, n, Zu, !1, !0)) break;
			if (e.line === u) {
				for (c = e.input.charCodeAt(e.position); yd(c);) c = e.input.charCodeAt(++e.position);
				if (c === 58) {
					if (c = e.input.charCodeAt(++e.position), bd(c) || Y(e, "a whitespace character is expected after the key-value separator within a block mapping"), !o) {
						for (vd(e, t), dd(e, t.position, r.anchorStart, r.anchorEnd, r.tagStart, r.tagEnd, 1), o = !0, Ud(e, n, Zu, !1, !0), c = e.input.charCodeAt(e.position); yd(c);) c = e.input.charCodeAt(++e.position);
						e.position++;
					}
					a = !0, i = !1, s = !1;
				} else if (a) Y(e, "expected ':' after a mapping key");
				else return r.anchorStart !== q || r.tagStart !== q ? (vd(e, t), !1) : !0;
			} else if (a) Y(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
			else return r.anchorStart !== q || r.tagStart !== q ? (vd(e, t), !1) : !0;
		}
		if (Ud(e, t, $u, !0, s) && (s = !1), i || (s &&= (J(e), !1)), Q(e, !0), c = e.input.charCodeAt(e.position), (e.line === u || e.lineIndent > t) && c !== 0) Y(e, "bad indentation of a mapping entry");
		else if (e.lineIndent < t) break;
	}
	return a ? (i && J(e), o && hd(e), !0) : !1;
}
function Ud(e, t, n, r, i, a = !0) {
	e.depth >= e.maxDepth && Y(e, `nesting exceeded maxDepth (${e.maxDepth})`), e.depth++;
	let o = 1, s = !1, c = !1, l = null, u = gd(), d = n === $u || n === Qu, f = d, p = d;
	if (r && Q(e, !0) && (s = !0, o = e.lineIndent > t ? 1 : e.lineIndent === t ? 0 : -1), e.position === e.lineStart && Dd(e)) return e.depth--, !1;
	if (o === 1) for (;;) {
		let r = e.input.charCodeAt(e.position), i = _d(e);
		if (s && o !== 1 && (r === 33 || r === 38)) break;
		if (s && p && (u.tagStart !== q || u.anchorStart !== q) && (r === 33 || r === 38)) {
			let n = _d(e), r = t + 1;
			if (Hd(e, e.position - e.lineStart, r, u) && e.events[n.eventsLength]?.type === 3) return e.depth--, !0;
			vd(e, n);
		}
		if (s && (r === 33 && u.tagStart !== q || r === 38 && u.anchorStart !== q) || !Ad(e, u, n === Xu) && !jd(e, u)) break;
		l === null && (l = i), Q(e, !0) ? (s = !0, f = p, o = e.lineIndent > t ? 1 : e.lineIndent === t ? 0 : -1) : f = !1;
	}
	if (f &&= s || i, o === 1 || n === $u) {
		let r = n === Xu || n === Zu ? t : t + 1, i = e.position - e.lineStart;
		if (o === 1) if (f && (Vd(e, i, u) || Hd(e, i, r, u)) || Bd(e, r, u)) c = !0;
		else {
			let t = e.input.charCodeAt(e.position);
			if (l !== null && a && p && !f && t !== 124 && t !== 62) {
				let t = _d(e), n = l.position - l.lineStart;
				vd(e, l), Hd(e, n, r, gd()) && e.events[t.eventsLength]?.type === 3 ? c = !0 : vd(e, t);
			}
			!c && (d && Id(e, r, u) || Pd(e, r, u) || Fd(e, r, u) || Md(e, u) || Rd(e, r, n, u)) && (c = !0);
		}
		else o === 0 && (c = f && Vd(e, i, u));
	}
	return d &&= !c, !c && (u.anchorStart !== q || u.tagStart !== q || d) && (pd(e, q, q, u.anchorStart, u.anchorEnd, u.tagStart, u.tagEnd, 1), c = !0), e.depth--, c || u.anchorStart !== q || u.tagStart !== q;
}
function Wd(e) {
	if (e.lineIndent > 0 || e.input.charCodeAt(e.position) !== 37) return !1;
	e.position++;
	let t = e.position;
	for (; e.input.charCodeAt(e.position) !== 0 && !Z(e.input.charCodeAt(e.position));) e.position++;
	let n = e.input.slice(t, e.position), r = [];
	for (n.length === 0 && Y(e, "directive name must not be less than one character in length"); e.input.charCodeAt(e.position) !== 0 && !X(e.input.charCodeAt(e.position));) {
		for (; yd(e.input.charCodeAt(e.position));) e.position++;
		if (e.input.charCodeAt(e.position) === 35 || X(e.input.charCodeAt(e.position)) || e.input.charCodeAt(e.position) === 0) break;
		let t = e.position;
		for (; e.input.charCodeAt(e.position) !== 0 && !Z(e.input.charCodeAt(e.position));) e.position++;
		r.push(e.input.slice(t, e.position));
	}
	if (X(e.input.charCodeAt(e.position)) && Ed(e), n === "YAML") {
		e.directives.some((e) => e.kind === "yaml") && Y(e, "duplication of %YAML directive"), r.length !== 1 && Y(e, "YAML directive accepts exactly one argument");
		let t = /^([0-9]+)\.([0-9]+)$/.exec(r[0]);
		t === null && Y(e, "ill-formed argument of the YAML directive"), parseInt(t[1], 10) !== 1 && Y(e, "unacceptable YAML version of the document"), e.directives.push({
			kind: "yaml",
			version: r[0]
		});
	} else if (n === "TAG") {
		r.length !== 2 && Y(e, "TAG directive accepts exactly two arguments");
		let [t, n] = r;
		nd.test(t) || Y(e, "ill-formed tag handle (first argument) of the TAG directive"), Yu.call(e.tagHandlers, t) && Y(e, `there is a previously declared suffix for "${t}" tag handle`), sd.test(n) || Y(e, "ill-formed tag prefix (second argument) of the TAG directive"), e.tagHandlers[t] = n, e.directives.push({
			kind: "tag",
			handle: t,
			prefix: n
		});
	}
	return !0;
}
function Gd(e) {
	e.directives = [], e.tagHandlers = Object.create(null);
	let t = !1;
	for (Q(e, !0); Wd(e);) t = !0, Q(e, !0);
	let n = !1, r = !1, i = !0;
	if (e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 && bd(e.input.charCodeAt(e.position + 3))) {
		n = !0;
		let t = e.line;
		e.position += 3, Q(e, !0), i = e.line > t;
	} else t && Y(e, "directives end mark is expected");
	let a = e.events.length;
	if (!n && e.position === e.lineStart && e.input.charCodeAt(e.position) === 46 && Dd(e)) {
		e.position += 3, Q(e, !0);
		return;
	}
	if (ld(e, n, !1), Ud(e, e.lineIndent - 1, $u, !1, i, i) || J(e), Q(e, !0), e.position === e.lineStart && Dd(e) && (r = e.input.charCodeAt(e.position) === 46, r)) {
		let t = e.line;
		e.position += 3, Q(e, !0), e.line === t && e.position < e.length && Y(e, "end of the stream or a document separator is expected");
	}
	let o = e.events[a];
	o?.type === 1 && (o.explicitEnd = r), hd(e), !r && e.position < e.length && !(e.position === e.lineStart && Dd(e)) && Y(e, "end of the stream or a document separator is expected");
}
function Kd(e, t) {
	let n = e.length, r = {
		...cd,
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
	for (i !== -1 && _u(e, i, "null byte is not allowed in input", r.filename), r.input.charCodeAt(r.position) === 65279 && r.position++; r.position < r.length && (Q(r, !0), !(r.position >= r.length));) {
		let e = r.position;
		Gd(r), r.position === e && Y(r, "can not read a document");
	}
	return r.events;
}
var qd = {
	...cd,
	...Fu
};
function Jd(e, t = {}) {
	let n = {
		...qd,
		...t
	}, r = String(e), i = Object.keys(cd), a = Object.keys(Fu);
	return Ju(Kd(r, Ql(n, i)), {
		...Ql(n, a),
		source: r
	});
}
function Yd(e, t) {
	let n = Jd(e, t);
	if (n.length === 0) throw new gu("expected a document, but the input is empty");
	if (n.length === 1) return n[0];
	throw new gu("expected a single document in the stream, but found more");
}
var $ = {};
$[0] = "\\0", $[7] = "\\a", $[8] = "\\b", $[9] = "\\t", $[10] = "\\n", $[11] = "\\v", $[12] = "\\f", $[13] = "\\r", $[27] = "\\e", $[34] = "\\\"", $[92] = "\\\\", $[133] = "\\N", $[160] = "\\_", $[8232] = "\\L", $[8233] = "\\P";
var Xd = {
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
lu.withTags({
	...Tl,
	resolve: (e, t, n) => {
		let r = Tl.resolve(e, t, n);
		return r === W ? gl.resolve(e, t, n) : r;
	}
}, {
	...Bl,
	resolve: (e, t, n) => {
		let r = Bl.resolve(e, t, n);
		return r === W ? Al.resolve(e, t, n) : r;
	}
}), { ...Xd };
//#endregion
//#region ../tp-markdown/dist/markdown/engine/markdown-frontmatter.js
function Zd(e) {
	let t = e.match(/^---\n([\s\S]*?)\n---\n?/);
	if (t === null) return {
		attributes: {},
		body: e
	};
	let n = t[1] ?? "", r;
	try {
		r = n.trim().length === 0 ? {} : Yd(n);
	} catch {
		r = {};
	}
	return {
		attributes: Qd(r) ? r : {},
		body: e.slice(t[0].length)
	};
}
function Qd(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
//#endregion
//#region ../tp-markdown/dist/markdown/renderers/markdown-runtime-loader.js
var $d = {
	mdviewer: "./mdviewer.js",
	htmlviewer: "./htmlviewer.js",
	tabs: "./tabs.js",
	"list-table": "./list-table.js",
	references: "./references.js",
	highlight: "./highlight.js",
	"speech-to-text": "./speech-to-text.js",
	"text-to-speech": "./text-to-speech.js",
	math: "./math.js",
	map: "./map.js",
	music: "./music.js",
	slide: "./slide.js",
	handwriting: "./handwriting.js",
	diagram: "./diagram.js",
	"game-life": "./game-life.js",
	turtle: "./turtle.js",
	typewriting: "./typewriting.js",
	"l-system": "./l-system.js",
	"xy-plot": "./xy-plot.js",
	sudoku: "./sudoku.js",
	crossword: "./crossword.js",
	yakazu: "./yakazu.js",
	binary: "./binary.js",
	cryptarithm: "./cryptarithm.js"
}, ef = {
	mdviewer: async () => import("./mdviewer.js"),
	htmlviewer: async () => import("./htmlviewer.js"),
	tabs: async () => import("./tabs2.js"),
	"list-table": async () => import("./list-table.js"),
	references: async () => import("./references.js"),
	highlight: async () => import("./highlight.js"),
	"speech-to-text": async () => import("./speech-to-text2.js"),
	"text-to-speech": async () => import("./text-to-speech3.js"),
	math: async () => import("./math.js").then((e) => e.t),
	map: async () => import("./map4.js"),
	music: async () => import("./music2.js"),
	slide: async () => import("./slide2.js"),
	handwriting: async () => import("./handwriting2.js"),
	diagram: async () => import("./diagram2.js"),
	"game-life": async () => import("./game-life3.js"),
	turtle: async () => import("./turtle3.js"),
	typewriting: async () => import("./typewriting3.js"),
	"l-system": async () => import("./l-system2.js"),
	sudoku: async () => import("./sudoku3.js"),
	crossword: async () => import("./crossword3.js"),
	yakazu: async () => import("./yakazu3.js"),
	binary: async () => import("./binary3.js"),
	cryptarithm: async () => import("./cryptarithm3.js")
};
function tf() {
	let e = globalThis.__TP_MODULE_BASE__?.trim() ?? "";
	if (e !== "" && !e.startsWith("null/") && !e.startsWith("about:") && !e.includes("://null")) try {
		let t = new URL(e, `${window.location.origin}/`).href;
		return t.endsWith("/") ? t : `${t}/`;
	} catch {}
	return `${window.location.origin}/dist/markdown/renderers/`;
}
function nf(e) {
	return `${tf()}${e.startsWith("./") ? e.slice(2) : e}`;
}
function rf(e) {
	let t = $d[e];
	return t ? nf(t) : null;
}
function af(e) {
	let t = e.trim();
	if (t in ef) return t;
	let n = t.match(/\/([^/]+)\.(?:ts|js)(?:[?#].*)?$/i);
	return n?.[1] ? n[1] : t;
}
async function of(e) {
	let t = af(e), n = ef[t];
	if (!n) throw Error(`Unknown runtime renderer: ${e}`);
	let r = await n(), i = r.default ?? r.renderer;
	if (!i) throw Error(`Invalid runtime renderer module: ${t}`);
	return i;
}
//#endregion
//#region ../tp-markdown/dist/markdown/engine/markdown.js
var sf = /* @__PURE__ */ new Set([
	"highlight",
	"math",
	"diagram",
	"map",
	"music",
	"references",
	"slide",
	"text-to-speech",
	"speech-to-text",
	"handwriting",
	"typewriting",
	"mdviewer",
	"htmlviewer",
	"list-table",
	"tabs",
	"game-life",
	"turtle",
	"l-system",
	"binary",
	"sudoku",
	"yakazu",
	"crossword",
	"cryptarithm"
]), cf = /* @__PURE__ */ new Map([
	["mathjax", "math"],
	["mermaid", "diagram"],
	["reveal", "slide"]
]), lf = /* @__PURE__ */ new Map([
	["mathjax", "math"],
	["mermaid", "diagram"],
	["reveal", "slide"],
	["game-life", "game-life"],
	["typewriting", "typewriting"],
	["turtle", "turtle"],
	["l-system", "l-system"]
]);
function uf(e) {
	return cf.get(e) ?? e;
}
function df(e) {
	return sf.has(e);
}
function ff(e) {
	let t = uf(e);
	return {
		id: t,
		url: t
	};
}
function pf(e) {
	return "id" in e && typeof e.id == "string" ? e.id : e.url.split("/").filter((e) => e !== "").at(-2) ?? null;
}
function mf(e) {
	let t = e.extensions;
	return Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.trim() !== "") : [];
}
function hf(e, t) {
	let n = pf(e);
	if (n === null) return {};
	let r = t[n];
	return typeof r != "object" || !r || Array.isArray(r) ? {} : r;
}
function gf(e, t) {
	return {
		...e,
		options: {
			...hf(e, t),
			...e.options ?? {}
		}
	};
}
function _f(e, t, n) {
	return {
		attributes: {
			...e.attributes ?? {},
			...t
		},
		includeBaseUrl: e.includeBaseUrl,
		files: e.files,
		path: n,
		pageNavRoot: e.pageNavRoot
	};
}
var vf = class {
	defaultRuntimeRendererIds = /* @__PURE__ */ new Set([
		"highlight",
		"references",
		"mdviewer",
		"list-table",
		"tabs",
		"htmlviewer"
	]);
	runtimeRendererIds = /* @__PURE__ */ new Set();
	lastAttributes = {};
	md;
	options;
	constructor(e = {}, t = []) {
		this.options = {
			html: !0,
			linkify: !0,
			typographer: !0,
			...e
		}, this.md = new H({
			html: this.options.html,
			linkify: this.options.linkify,
			typographer: this.options.typographer
		}), qc(this.md), Wc(this.md, {
			files: this.options.files,
			entryPath: this.options.path
		});
		for (let e of t) this.useExtension(e);
	}
	configure(e) {
		this.options = {
			...this.options,
			...e
		};
	}
	use(e, t = {}) {
		return this.md.use(e, t), this;
	}
	async useExtension(e) {
		if (typeof e.id != "string" || e.id.trim() === "") throw Error(`Invalid Markdown extension id: ${JSON.stringify(e)}`);
		if (typeof e.url != "string" || e.url.trim() === "") throw Error(`Invalid Markdown extension url for "${e.id}": ${JSON.stringify(e)}`);
		let t = await Va(e.url);
		return this.use(t, e.options ?? {}), this;
	}
	async useExtensions(e) {
		for (let t of e) await this.useExtension(t);
		return this;
	}
	parse(e, t = []) {
		if (t.length > 0) throw Error("TpMarkdown.parse() cannot load async extensions. Use parseAsync().");
		let n = Zd(e), r = _f(this.options, n.attributes, this.options.path), i = _i(n.body, r);
		return {
			tokens: this.md.parse(i, r),
			env: r
		};
	}
	async parseAsync(e, t = []) {
		let n = await this.prepareSource(e), r = Zd(n), i = this.resolveExtensions(r.attributes, t);
		return await this.useExtensions(i.map((e) => gf(e, r.attributes))), qa(this.md), this.parse(n);
	}
	render(e, t = []) {
		if (t.length > 0) throw Error("TpMarkdown.render() cannot load async extensions. Use renderAsync().");
		let n = Zd(e), r = _f(this.options, n.attributes, this.options.path);
		this.lastAttributes = r.attributes;
		let i = _i(n.body, r);
		return this.md.render(i, r);
	}
	async renderAsync(e, t = []) {
		let n = Zd(await this.prepareSource(e)), r = this.readEntryPath();
		this.lastAttributes = {
			...this.options.attributes ?? {},
			...n.attributes
		}, this.runtimeRendererIds.clear(), this.collectRuntimeRenderers(this.lastAttributes, t);
		let i = this.resolveExtensions(this.lastAttributes, t);
		await this.useExtensions(i.map((e) => gf(e, this.lastAttributes))), qa(this.md);
		let a = {
			attributes: this.lastAttributes,
			path: r,
			includeBaseUrl: this.options.includeBaseUrl,
			pageNavRoot: this.options.pageNavRoot,
			files: this.options.files
		}, o = _i(n.body, a), s = this.md.render(o, a);
		return a.pageNavRoot === !0 ? `${s}${lo(a)}` : s;
	}
	async renderInto(e, t, n = []) {
		t.innerHTML = await this.renderAsync(e, n), await this.renderRuntime(t), c(t);
	}
	async renderRuntime(e, t = {}) {
		let n = /* @__PURE__ */ new Set([...this.defaultRuntimeRendererIds, ...this.runtimeRendererIds]), r = t.only === void 0 ? null : new Set(t.only), i = new Set(t.exclude ?? []);
		for (let a of n) {
			let n = lf.get(a) ?? a;
			if (r !== null && !r.has(a) && !r.has(n) || i.has(a) || i.has(n)) continue;
			let o = rf(n);
			if (o === null) {
				console.error(`Markdown runtime renderer unknown: ${n}`);
				continue;
			}
			try {
				let n = await of(o), r = {
					...t,
					path: this.readEntryPath(),
					includeBaseUrl: this.options.includeBaseUrl
				};
				await n.render(e, r);
			} catch (e) {
				console.error(`Markdown runtime renderer failed: ${n}`, e);
			}
		}
	}
	readEntryPath() {
		return typeof this.options.path == "string" && this.options.path !== "" ? this.options.path : "/index.md";
	}
	async prepareSource(e) {
		return yf(e, this.readEntryPath(), this.options.includeBaseUrl ?? "");
	}
	resolveExtensions(e, t) {
		return [...mf(e).map(ff), ...t];
	}
	collectRuntimeRenderers(e, t) {
		for (let t of mf(e)) {
			let e = lf.get(t) ?? t;
			df(e) && this.runtimeRendererIds.add(e);
		}
		for (let e of t) {
			let t = pf(e);
			if (t === null) continue;
			let n = lf.get(t) ?? t;
			df(n) && this.runtimeRendererIds.add(n);
		}
	}
};
async function yf(e, t, n = "", r = /* @__PURE__ */ new Set()) {
	let i = /^::include\{(.+?)\}\s*$/gm, a = "", o = 0;
	for (let s of e.matchAll(i)) {
		let i = s[1], c = s.index;
		if (i === void 0 || c === void 0) continue;
		a += e.slice(o, c);
		let l = xf(t, i.trim());
		if (r.has(l)) a += `> Circular include ignored: \`${l}\``;
		else {
			r.add(l);
			let e = await bf(l, n);
			a += e === null ? `> Include not found: \`${l}\`` : await yf(e, l, n, r), r.delete(l);
		}
		o = c + s[0].length;
	}
	return a += e.slice(o), a;
}
async function bf(e, t) {
	let n = Cf(t, e);
	try {
		let e = await fetch(n);
		return e.ok ? await e.text() : null;
	} catch {
		return null;
	}
}
function xf(e, t) {
	if (t.startsWith("/")) return Sf(t);
	let n = e.split("/").filter(Boolean);
	n.pop();
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			n.pop();
			continue;
		}
		n.push(e);
	}
	return `/${n.join("/")}`;
}
function Sf(e) {
	let t = [];
	for (let n of e.split("/")) if (!(n === "" || n === ".")) {
		if (n === "..") {
			t.pop();
			continue;
		}
		t.push(n);
	}
	return `/${t.join("/")}`;
}
function Cf(e, t) {
	let n = e.replace(/\/$/, ""), r = t.replace(/^\//, "");
	return n === "" ? `/${r}` : `${n}/${r}`;
}
new vf();
//#endregion
export { c as i, Yd as n, H as r, vf as t };

//# sourceMappingURL=markdown2.js.map