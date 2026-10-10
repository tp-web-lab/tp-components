//#region src/languages/markdown/extensions/music/index.ts
function e(e) {
	t(e);
}
function t(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, s, c, l, u) => {
		let d = e[s];
		if (d === void 0) return "";
		if (i(d.info).name !== "music") return typeof t == "function" ? t(e, s, c, l, u) : u.renderToken(e, s, c);
		let f = r(d), p = {
			play: o(f, "play"),
			tablature: o(f, "tablature"),
			instrument: a(f, "instrument") ?? "guitar"
		};
		return n(d.content.trim(), p, s);
	};
}
function n(e, t, n) {
	return `
<section
  class="tp-md-music"
  data-music-id="${l(`tp-md-music-${String(n)}`)}"
  ${t.play ? "data-music-play" : ""}
  ${t.tablature ? "data-music-tablature" : ""}
  data-music-instrument="${l(t.instrument)}"
>
  <pre hidden class="tp-md-music-source">${c(e)}</pre>

  <div class="tp-md-music-controls"></div>

  <div class="tp-md-music-notation"></div>

  <div class="tp-md-music-audio"></div>

  <div class="tp-md-music-tablature"></div>
</section>
`;
}
function r(e) {
	return (e.attrs ?? []).map(([e, t]) => t === "" ? e : `${e}=${JSON.stringify(t)}`).join(" ");
}
function i(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function a(e, t) {
	let n = RegExp(`${t}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function o(e, t) {
	return RegExp(`(^|\\s)${s(t)}(\\s|$)`).test(e);
}
function s(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function l(e) {
	return e.replaceAll(/[^a-zA-Z0-9_-]/g, "");
}
//#endregion
export { e as default };

//# sourceMappingURL=index.js.map