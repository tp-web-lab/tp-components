//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/game-life/index.js
function e(e) {
	let n = e.renderer.rules.fence ?? ((e, t, n, r, i) => i.renderToken(e, t, n));
	e.renderer.rules.fence = (e, o, c, l, u) => {
		let d = e[o];
		if (!d) return n(e, o, c, l, u);
		let f = (d.info || "").trim();
		if (!(f === "game-life" || f.startsWith("game-life "))) return n(e, o, c, l, u);
		try {
			let e = t(d), n = d.content.trim();
			if (n === "" && (e.preset ?? "").trim() === "") throw Error("Missing program source. Provide fenced DSL or preset.");
			let o = r(e), c = (e.caption ?? "").trim(), l = i(e), u = n === "" ? "" : `<script type="tp/game-life">${s(n)}<\/script>`;
			return [
				`<figure${o}>`,
				`<tp-game-life${l}>${u}</tp-game-life>`,
				c ? `<figcaption class="game-life-legend">${a(c)}</figcaption>` : "",
				"</figure>"
			].join("");
		} catch (e) {
			return `<pre class="game-life-error"><code>${a(e instanceof Error ? e.message : String(e))}</code></pre>`;
		}
	};
}
function t(e) {
	let t = {};
	for (let [n, r] of e.attrs ?? []) t[n] = r ?? "";
	return t;
}
function n(e, t) {
	if (!(t in e)) return !1;
	let n = (e[t] ?? "").trim().toLowerCase();
	return n === "" || n === t || n === "true" || n === "1" || n === "yes" || n === "on";
}
function r(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) (n === "id" || n === "class" || n === "role" || n.startsWith("data-") || n.startsWith("aria-")) && t.push(` ${n}="${o(r)}"`);
	return t.join("");
}
function i(e) {
	let t = [], r = /* @__PURE__ */ new Set(["wrap", "autoplay"]), i = /* @__PURE__ */ new Set([
		"label",
		"steps",
		"interval",
		"cell-size",
		"padding",
		"background",
		"alive-color",
		"dead-color",
		"grid-color",
		"grid-stroke-width",
		"cell-radius",
		"preset",
		"preset-x",
		"preset-y",
		"preset-width",
		"preset-height"
	]);
	for (let [a, s] of Object.entries(e)) if (i.has(a)) {
		if (r.has(a)) {
			n(e, a) && t.push(` ${a}`);
			continue;
		}
		t.push(` ${a}="${o(s)}"`);
	}
	return t.join("");
}
function a(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function o(e) {
	return a(e).replaceAll("\n", "&#10;");
}
function s(e) {
	return e.replaceAll("<\/script", "<\\/script");
}
//#endregion
export { e as default, e as useGameLifeExtension };

