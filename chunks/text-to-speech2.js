import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/text-to-speech/index.js
var t = "tp-md-text-to-speech-styles", n = "\n.tp-md-text-to-speech,\n.tp-md-text-to-speech-block button {\n  cursor: pointer;\n}\n\n.tp-md-text-to-speech-block {\n  display: grid;\n  gap: 0.5rem;\n  margin-block: 1rem;\n  padding: 1rem;\n  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);\n  border-radius: 0.75rem;\n}\n\n.tp-md-text-to-speech-controls {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n}\n\n.tp-md-text-to-speech-stop {\n  opacity: 0.8;\n}\n\n.tp-md-text-to-speech-content {\n  white-space: pre-line;\n}\n";
function r(r) {
	e(t, n), i(r), o(r);
}
function i(e) {
	let t = e.inline, n = e.renderer;
	t === void 0 || n === void 0 || (t.ruler.before("escape", "text_to_speech_inline", (e, t) => {
		if (!e.src.startsWith(":text-to-speech", e.pos)) return !1;
		let n = a(e.src, e.pos + 15);
		if (n === null || n.source.trim() === "") return !1;
		if (!t) {
			let t = e.push("text_to_speech_inline", "", 0);
			t.meta = {
				source: n.source.trim(),
				...c(n.args)
			};
		}
		return e.pos = n.end, !0;
	}), n.rules.text_to_speech_inline = (e, t) => {
		let n = s(e[t]);
		return `
<button
  type="button"
  class="tp-md-text-to-speech"
  data-text-to-speech-text="${g(n.source)}"
  ${p("data-tts-lang", n.lang)}
  ${p("data-tts-voice", n.voice)}
  ${p("data-tts-rate", n.rate)}
  ${p("data-tts-pitch", n.pitch)}
  ${p("data-tts-volume", n.volume)}
>🔊 ${h(n.source)}</button>
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
		source: e.slice(i, a),
		end: a + 1
	};
}
function o(e) {
	let t = e.renderer, n = t.rules.fence;
	t.rules.fence = (e, t, r, i, a) => {
		let o = e[t];
		if (o === void 0) return "";
		let s = u(o.info);
		if (s.name !== "text-to-speech") return typeof n == "function" ? n(e, t, r, i, a) : a.renderToken(e, t, r);
		let d = c(`${s.args} ${l(o)}`.trim()), f = o.content.trim();
		return `
<div
  class="tp-md-text-to-speech-block"
  ${p("data-tts-lang", d.lang)}
  ${p("data-tts-voice", d.voice)}
  ${p("data-tts-rate", d.rate)}
  ${p("data-tts-pitch", d.pitch)}
  ${p("data-tts-volume", d.volume)}
>
  <div class="tp-md-text-to-speech-content">${h(f)}</div>

  <div class="tp-md-text-to-speech-controls">
    <button
      type="button"
      class="tp-md-text-to-speech"
      data-text-to-speech-text="${g(f)}"
      ${p("data-tts-lang", d.lang)}
      ${p("data-tts-voice", d.voice)}
      ${p("data-tts-rate", d.rate)}
      ${p("data-tts-pitch", d.pitch)}
      ${p("data-tts-volume", d.volume)}
    >Read</button>

    <button
      type="button"
      class="tp-md-text-to-speech-stop"
    >Stop</button>
  </div>
</div>
`;
	};
}
function s(e) {
	let t = e?.meta;
	return typeof t == "object" && t && typeof t.source == "string" ? t : { source: "" };
}
function c(e) {
	return {
		lang: d(e, "lang") ?? void 0,
		voice: d(e, "voice") ?? void 0,
		rate: f(e, "rate"),
		pitch: f(e, "pitch"),
		volume: f(e, "volume")
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
	if (n === null) return;
	let r = Number(n);
	return Number.isFinite(r) ? r : void 0;
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

