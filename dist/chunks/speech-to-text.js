import { dt as e } from "./lib/typescript/typescript.js";
//#region ../tp-markdown/dist/markdown/extensions/speech-to-text/index.js
var t = "tp-md-speech-to-text-styles", n = "\n.tp-md-speech-to-text,\n.tp-md-speech-to-text-block {\n  display: grid;\n  gap: 0.5rem;\n}\n\n.tp-md-speech-to-text-block {\n  margin-block: 1rem;\n  padding: 1rem;\n  border: 1px solid color-mix(\n    in srgb,\n    CanvasText 20%,\n    transparent\n  );\n  border-radius: 0.75rem;\n}\n\n[data-stt-output] {\n  min-block-size: 3rem;\n  white-space: pre-wrap;\n}\n";
function r(r) {
	e(t, n), i(r), o(r);
}
function i(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("escape", "speech_to_text_inline", (e, t) => {
		if (!e.src.startsWith(":speech-to-text", e.pos)) return !1;
		let n = a(e.src, e.pos + 15);
		if (n === null) return !1;
		if (!t) {
			let t = e.push("speech_to_text_inline", "", 0);
			t.meta = {
				label: n.label.trim(),
				...c(n.args)
			};
		}
		return e.pos = n.end, !0;
	}), n.rules.speech_to_text_inline = (e, t) => {
		let n = s(e[t]), r = n.label || "Speak";
		return `
<span
  class="tp-md-speech-to-text"
  ${p("data-stt-lang", n.lang)}
  ${p("data-stt-continuous", n.continuous)}
  ${p("data-stt-interim-results", n.interimResults)}
>
  <button type="button" data-stt-start>
    🎙️ ${h(r)}
  </button>

  <output data-stt-output></output>
</span>
`;
	});
}
function a(e, t) {
	let n = t, r = "";
	if (e[n] === "{") {
		let t = e.indexOf("}", n + 1);
		if (t === -1) return null;
		r = e.slice(n + 1, t), n = t + 1;
	}
	if (e[n] !== ":" || (n += 1, e[n] !== "`")) return null;
	let i = n + 1, a = e.indexOf("`", i);
	return a === -1 ? null : {
		args: r,
		label: e.slice(i, a),
		end: a + 1
	};
}
function o(e) {
	let t = e.renderer, n = t.rules.fence;
	t.rules.fence = (e, t, r, i, a) => {
		let o = e[t];
		if (o === void 0) return "";
		let s = u(o.info);
		if (s.name !== "speech-to-text") return typeof n == "function" ? n(e, t, r, i, a) : a.renderToken(e, t, r);
		let d = `${s.args} ${l(o)}`.trim(), f = {
			label: o.content.trim() || "Start dictation",
			...c(d)
		};
		return `
<div
  class="tp-md-speech-to-text-block"
  ${p("data-stt-lang", f.lang)}
  ${p("data-stt-continuous", f.continuous)}
  ${p("data-stt-interim-results", f.interimResults)}
>
  <button type="button" data-stt-start>
    🎙️ ${h(f.label)}
  </button>

  <button type="button" data-stt-stop>
    ⏹ Stop
  </button>

  <div data-stt-output></div>
</div>
`;
	};
}
function s(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.label == "string" ? t : { label: "" };
}
function c(e) {
	return {
		lang: d(e, "lang") ?? void 0,
		continuous: f(e, "continuous"),
		interimResults: f(e, "interim-results") ?? f(e, "interimResults")
	};
}
function l(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function u(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function d(e, t) {
	let n = RegExp(`${m(t)}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function f(e, t) {
	let n = d(e, t);
	if (n !== null) {
		if (n === "true" || n === "1") return !0;
		if (n === "false" || n === "0") return !1;
	}
}
function p(e, t) {
	return t === void 0 ? "" : `${e}="${g(String(t))}"`;
}
function m(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function h(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function g(e) {
	return h(e);
}
//#endregion
export { r as default };

//# sourceMappingURL=speech-to-text.js.map