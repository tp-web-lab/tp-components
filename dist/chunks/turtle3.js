import { i as e, n as t, r as n, t as r } from "./turtle-dsl.js";
//#region ../tp-markdown/dist/markdown/renderers/turtle.js
function i(e, t) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function a(e) {
	e.downloadUrl &&= (URL.revokeObjectURL(e.downloadUrl), null);
}
function o(e) {
	e.replayTimer !== null && (window.clearTimeout(e.replayTimer), e.replayTimer = null);
}
function s(e) {
	return e.replace(/<svg\b([^>]*)>/i, (e, t) => `<svg${t.replace(/\swidth="[^"]*"/i, "").replace(/\sheight="[^"]*"/i, "").replace(/\sstyle="[^"]*"/i, "")} style="display:block;width:100%;max-width:100%;height:auto;">`);
}
function c(t) {
	return r(e(t.program));
}
function l(e, r) {
	return t(r, "static"), s(n.renderSceneSvg({
		width: e.width,
		height: e.height,
		background: e.background || "transparent",
		padding: 20,
		linecap: "round",
		linejoin: "round"
	}));
}
function u(e) {
	let t = e.querySelector("[data-role=\"viewport\"]");
	if (!t) {
		let t = document.createElement("div");
		return t.setAttribute("data-role", "viewport"), e.appendChild(t), t;
	}
	let n = t.cloneNode(!1);
	return t.replaceWith(n), n;
}
function d(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function f(e) {
	if (e.dataset.hydrated === "true") return;
	let t = {
		program: e.dataset.program ?? "",
		mode: "static",
		width: Math.max(100, i(e.dataset.width, 900)),
		height: Math.max(100, i(e.dataset.height, 420)),
		background: e.dataset.background ?? "transparent",
		label: e.dataset.label ?? "",
		downloadUrl: null,
		replayTimer: null
	};
	e.innerHTML = "\n    <div class=\"tp-turtle-toolbar\" style=\"display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;\">\n      <button type=\"button\" data-action=\"replay\">Replay</button>\n      <button type=\"button\" data-action=\"download\">Download SVG</button>\n    </div>\n    <div data-role=\"viewport\"></div>\n  ";
	let n = e.querySelector("button[data-action=\"replay\"]"), r = e.querySelector("button[data-action=\"download\"]"), s = () => {
		o(t);
		let n = c(t), r = l(t, n), i = u(e);
		i.innerHTML = r, a(t), t.downloadUrl = URL.createObjectURL(new Blob([r], { type: "image/svg+xml;charset=utf-8" }));
	}, f = () => {
		o(t), a(t);
		let n = c(t), r = u(e), i = (e) => e.cmd === "forward" || e.cmd === "goto", s = (e) => Number.isFinite(e) ? Math.max(1, Math.min(10, Number(e))) : 6, d = (e, t, n, r) => Math.hypot(n - e, r - t), f = (e) => {
			let t = [], r = e, a = 6, o = 0, c = 0, l = 0, u = (e) => e * Math.PI / 180;
			for (let e = 0; e < n.length; e += 1) {
				let f = n[e];
				if (!f) continue;
				if (!i(f)) {
					t.push(f), f.cmd === "turtle" ? (o = f.x ?? 0, c = f.y ?? 0, l = f.heading ?? 0, a = s(f.speed)) : f.cmd === "style" && f.speed !== void 0 ? a = s(f.speed) : f.cmd === "left" ? l -= f.value : f.cmd === "right" && (l += f.value);
					continue;
				}
				let p = 11 - a;
				if (f.cmd === "forward") {
					let e = u(l), n = o + Math.cos(e) * f.value, i = c + Math.sin(e) * f.value, a = Math.max(.001, d(o, c, n, i)) * p;
					if (r >= a) t.push(f), r -= a, o = n, c = i;
					else {
						let e = Math.max(0, Math.min(1, r / a)), n = {
							...f,
							value: f.value * e
						};
						return t.push(n), t;
					}
				} else if (f.cmd === "goto") {
					let e = Math.max(.001, d(o, c, f.x, f.y)) * p;
					if (r >= e) t.push(f), r -= e, o = f.x, c = f.y;
					else {
						let n = Math.max(0, Math.min(1, r / e)), i = {
							...f,
							x: o + (f.x - o) * n,
							y: c + (f.y - c) * n
						};
						return t.push(i), t;
					}
				}
			}
			return t;
		}, p = 0;
		{
			let e = 6, t = 0, r = 0, i = 0, a = (e) => e * Math.PI / 180;
			for (let o of n) if (o) if (o.cmd === "turtle") t = o.x ?? 0, r = o.y ?? 0, i = o.heading ?? 0, e = s(o.speed);
			else if (o.cmd === "style" && o.speed !== void 0) e = s(o.speed);
			else if (o.cmd === "left") i -= o.value;
			else if (o.cmd === "right") i += o.value;
			else if (o.cmd === "forward") {
				let n = a(i), s = t + Math.cos(n) * o.value, c = r + Math.sin(n) * o.value;
				p += Math.max(.001, d(t, r, s, c)) * (11 - e), t = s, r = c;
			} else o.cmd === "goto" && (p += Math.max(.001, d(t, r, o.x, o.y)) * (11 - e), t = o.x, r = o.y);
		}
		if (p <= 0) {
			let e = l(t, n);
			r.innerHTML = e, t.downloadUrl = URL.createObjectURL(new Blob([e], { type: "image/svg+xml;charset=utf-8" }));
			return;
		}
		let m = Math.min(3e4, Math.max(6e3, p * .9)), h = performance.now(), g = () => {
			let e = performance.now() - h, n = Math.max(0, Math.min(1, e / m)), i = p * n, s = f(i), c = l(t, s);
			if (r.innerHTML = c, n >= 1) {
				o(t), a(t), t.downloadUrl = URL.createObjectURL(new Blob([c], { type: "image/svg+xml;charset=utf-8" }));
				return;
			}
			t.replayTimer = window.setTimeout(g, 16);
		};
		g();
	};
	n?.addEventListener("click", () => {
		try {
			f();
		} catch (t) {
			let n = t instanceof Error ? t.message : String(t), r = u(e);
			r.innerHTML = `<pre class="tp-turtle-error"><code>${d(n)}</code></pre>`;
		}
	}), r?.addEventListener("click", () => {
		if (s(), !t.downloadUrl) return;
		let e = document.createElement("a");
		e.href = t.downloadUrl, e.download = "turtle.svg", document.body.appendChild(e), e.click(), e.remove();
	}), s(), e.addEventListener("DOMNodeRemovedFromDocument", () => {
		o(t), a(t);
	}), e.dataset.hydrated = "true";
}
async function p(e) {
	let t = (e?.root ?? document).querySelectorAll("[data-turtle-block]");
	for (let e of t) try {
		f(e);
	} catch (t) {
		e.innerHTML = `<pre class="tp-turtle-error"><code>${d(t instanceof Error ? t.message : String(t))}</code></pre>`;
	}
}
var m = {
	id: "turtle",
	async render(e, t) {
		await p({
			root: e,
			options: t
		});
	}
};
//#endregion
export { m as default };

//# sourceMappingURL=turtle3.js.map