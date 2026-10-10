import { dt as e } from "./lib/typescript/typescript.js";
//#region ../tp-markdown/dist/markdown/extensions/music/index.js
var t = "tp-md-music-styles", n = "\n.tp-md-music {\n  display: grid;\n  gap: 0.75rem;\n\n  margin-block: 1rem;\n  padding: 1rem;\n\n  border: 1px solid\n    color-mix(\n      in srgb,\n      CanvasText 18%,\n      transparent\n    );\n\n  border-radius: 0.75rem;\n\n  background:\n    color-mix(\n      in srgb,\n      Canvas 96%,\n      CanvasText 4%\n    );\n}\n\n.tp-md-music-notation {\n  position: relative;\n  overflow-x: auto;\n}\n\n.tp-md-music-audio:empty,\n.tp-md-music-tablature:empty {\n  display: none;\n}\n\n.tp-md-music-source {\n  margin: 0;\n  overflow-x: auto;\n}\n\n.tp-md-music-instrument {\n  min-inline-size: 10rem;\n}\n\n/* -------------------------------------------------------------------------- */\n/* Toolbar */\n/* -------------------------------------------------------------------------- */\n\n.tp-md-music-toolbar {\n  display: grid;\n\n  grid-template-columns:\n    minmax(10rem, max-content)\n    max-content\n    max-content\n    minmax(10rem, 1fr);\n\n  gap: 0.5rem;\n  align-items: center;\n\n  margin-block-start: 0.5rem;\n}\n\n.tp-md-music-toolbar select,\n.tp-md-music-toolbar button,\n.tp-md-music-toolbar input {\n  margin: 0 !important;\n}\n\n/* -------------------------------------------------------------------------- */\n/* Buttons */\n/* -------------------------------------------------------------------------- */\n\n.tp-md-music-toolbar button {\n  padding-inline: 0.75rem;\n  white-space: nowrap;\n}\n\n/* -------------------------------------------------------------------------- */\n/* Range */\n/* -------------------------------------------------------------------------- */\n\n.tp-md-music-toolbar input[type='range'] {\n  inline-size: 100%;\n\n  min-inline-size: 0;\n\n  padding: 0 !important;\n  margin: 0 !important;\n\n  border: none !important;\n\n  background: transparent !important;\n\n  appearance: auto !important;\n  accent-color: currentColor;\n\n  cursor: pointer;\n}\n\n/* -------------------------------------------------------------------------- */\n/* Cursor */\n/* -------------------------------------------------------------------------- */\n\n.tp-md-music-cursor {\n  position: absolute;\n\n  inline-size: 2px;\n\n  background: red;\n\n  opacity: 0.75;\n\n  pointer-events: none;\n\n  z-index: 10;\n}\n\n/* -------------------------------------------------------------------------- */\n/* abcjs fallback tempo input */\n/* -------------------------------------------------------------------------- */\n\n.tp-md-music-audio input.abcjs-midi-tempo[type='number'] {\n  position: static !important;\n\n  display: inline-flex !important;\n  align-items: center !important;\n\n  inline-size: 4rem !important;\n  block-size: 1.75rem !important;\n\n  min-block-size: 1.75rem !important;\n\n  padding: 0 0.35rem !important;\n  margin: 0 !important;\n\n  appearance: auto !important;\n\n  vertical-align: middle !important;\n\n  font: inherit !important;\n  line-height: 1 !important;\n\n  background: Canvas !important;\n  color: CanvasText !important;\n\n  border: 1px solid\n    color-mix(\n      in srgb,\n      CanvasText 20%,\n      transparent\n    ) !important;\n\n  border-radius: 0.35rem !important;\n\n  box-sizing: border-box !important;\n}\n\n/* -------------------------------------------------------------------------- */\n/* Responsive */\n/* -------------------------------------------------------------------------- */\n\n@media (width <= 720px) {\n  .tp-md-music-toolbar {\n    grid-template-columns: 1fr;\n  }\n\n  .tp-md-music-instrument {\n    min-inline-size: 0;\n  }\n}\n";
function r(r) {
	e(t, n), i(r);
}
function i(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, u) => {
		let d = e[n];
		if (d === void 0) return "";
		let f = s(d.info);
		if (f.name !== "music") return typeof t == "function" ? t(e, n, r, i, u) : u.renderToken(e, n, r);
		let p = `${f.args} ${o(d)}`.trim(), m = {
			play: l(p, "play"),
			tablature: l(p, "tablature"),
			instrument: c(p, "instrument") ?? "guitar"
		};
		return a(d.content.trim(), m, n);
	};
}
function a(e, t, n) {
	return `
<section
  class="tp-md-music"
  data-music-id="${f(`tp-md-music-${String(n)}`)}"
  ${t.play ? "data-music-play" : ""}
  ${t.tablature ? "data-music-tablature" : ""}
  data-music-instrument="${f(t.instrument)}"
>
  <pre hidden class="tp-md-music-source">${d(e)}</pre>

  <div class="tp-md-music-controls"></div>

  <div class="tp-md-music-notation"></div>

  <div class="tp-md-music-audio"></div>

  <div class="tp-md-music-tablature"></div>
</section>
`;
}
function o(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function s(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function c(e, t) {
	let n = RegExp(`${t}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function l(e, t) {
	return RegExp(`(^|\\s)${u(t)}(\\s|$)`).test(e);
}
function u(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function d(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function f(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
export { r as default };

//# sourceMappingURL=music.js.map