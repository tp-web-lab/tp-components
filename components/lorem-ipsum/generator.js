import { DICTIONARY as e } from "./dictionary.js";
//#region src/components/lorem-ipsum/generator.ts
var t = {
	type: "p",
	length: "3-5",
	wordsPerSentence: "4-16",
	sentencesPerParagraph: "3-6"
};
function n(e) {
	let t = e.seed === void 0 ? Math.random : p(e.seed);
	switch (e.type) {
		case "sentence": return h(o(t, e));
		case "title": return h(s(t, e));
		case "dl": return a(t, e);
		case "ol": return i(t, e, "ol");
		case "ul": return i(t, e, "ul");
		default: return r(t, e);
	}
}
function r(e, t) {
	let n = u(t.length, e);
	return Array.from({ length: n }, () => {
		let n = u(t.sentencesPerParagraph, e);
		return `<p>${h(Array.from({ length: n }, () => o(e, t)).join(" "))}</p>`;
	}).join("\n");
}
function i(e, t, n) {
	let r = u(t.length, e);
	return `<${n}>\n${Array.from({ length: r }, () => `  <li>${h(o(e, t))}</li>`).join("\n")}\n</${n}>`;
}
function a(e, t) {
	let n = u(t.length, e);
	return `<dl>\n${Array.from({ length: n }, () => {
		let n = s(e, {
			...t,
			wordsPerSentence: "1-3"
		}), r = o(e, t);
		return [`  <dt>${h(n)}</dt>`, `  <dd>${h(r)}</dd>`].join("\n");
	}).join("\n")}\n</dl>`;
}
function o(e, t) {
	return `${m(c(e, u(t.wordsPerSentence, e)).join(" "))}.`;
}
function s(e, t) {
	return c(e, u(t.wordsPerSentence, e)).map(m).join(" ");
}
function c(t, n) {
	return Array.from({ length: n }, () => e[Math.floor(t() * e.length)] ?? "lorem");
}
function l(e) {
	return e === "sentence" || e === "title" || e === "p" || e === "dl" || e === "ol" || e === "ul" ? e : "p";
}
function u(e, t) {
	if (typeof e == "number") return Math.max(0, Math.floor(e));
	let n = e.match(/^(\d+)\s*-\s*(\d+)$/);
	if (n !== null) {
		let e = Number.parseInt(n[1] ?? "0", 10), r = Number.parseInt(n[2] ?? String(e), 10), i = Math.min(e, r), a = Math.max(e, r);
		return i + Math.floor(t() * (a - i + 1));
	}
	return d(e, 1);
}
function d(e, t) {
	if (typeof e == "number") return Number.isFinite(e) ? Math.floor(e) : t;
	if (typeof e != "string") return t;
	let n = Number.parseInt(e, 10);
	return Number.isFinite(n) ? n : t;
}
function f(e) {
	if (e === void 0) return;
	if (typeof e == "number") return Number.isFinite(e) ? Math.floor(e) : void 0;
	let t = Number.parseInt(e, 10);
	return Number.isFinite(t) ? t : void 0;
}
function p(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function m(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function h(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
export { t as DEFAULT_OPTIONS, l as readLoremType, f as readOptionalInteger, n as renderLorem };

