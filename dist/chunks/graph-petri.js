import { i as e } from "./graph-editor.js";
//#region src/components/graph-petri/graph-petri.css?inline
var t = "tp-graph-petri{--tp-graph-node-stroke:var(--tp-neutral-text-colorful,var(--tp-text-body,#263248))}.tp-petri-place{fill:var(--tp-petri-place-fill,var(--tp-paper-color,Canvas))}.tp-petri-transition{fill:var(--tp-petri-transition-fill,var(--tp-neutral-fill-loud,#263248))}.tp-petri-transition.is-fired{fill:var(--tp-petri-fired-color,var(--tp-brand-fill-mid,#5268d8))}.tp-graph-node.is-petri-enabled .tp-petri-transition{stroke:var(--tp-petri-enabled-color,var(--tp-success-stroke-mid,#1c9b57));stroke-width:3px}.tp-petri-fire-control{opacity:0;pointer-events:none;cursor:pointer;transition:opacity .15s}.tp-graph-node.is-petri-enabled:hover .tp-petri-fire-control,.tp-graph-node.is-petri-enabled:focus .tp-petri-fire-control{opacity:1;pointer-events:all}.tp-petri-fire-control circle{fill:var(--tp-petri-enabled-color,var(--tp-success-fill-mid,#1c9b57));stroke:var(--tp-paper-color,Canvas);stroke-width:1.5px}.tp-petri-fire-control path{fill:var(--tp-success-text-on-mid,white);pointer-events:none}.tp-petri-token{fill:var(--tp-petri-token-color,var(--tp-text-body,#172033));pointer-events:none}.tp-petri-token-preview{stroke:var(--tp-petri-token-color,var(--tp-text-body,#172033));stroke-width:1px}.tp-petri-token-count{fill:var(--tp-petri-token-color,var(--tp-text-body,#172033));pointer-events:none;font:700 14px system-ui,sans-serif}.tp-petri-label{dominant-baseline:hanging}.tp-petri-toolbar-separator{background:var(--tp-neutral-stroke-soft,#d5dae4);align-self:stretch;width:1px;margin:.1rem .15rem}@media (prefers-reduced-motion:reduce){tp-graph-petri,tp-graph-petri *{transition-duration:.01ms!important;transition-delay:0s!important}}", n = "petri-place", r = "petri-transition", i = "petri-arc", a = "petri-token";
function o(e, t, n = 0) {
	return typeof e == "number" && Number.isFinite(e) && Number.isInteger(e) && e >= n ? e : t;
}
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function c(e) {
	return o(e.state?.tokens, o(e.data?.initialTokens, 0));
}
function l(e) {
	return o(e.data?.weight, 1, 1);
}
function u(e) {
	let t = e.data?.capacity;
	return t == null ? null : o(t, 0);
}
function d(e) {
	return new Map(e.nodes.map((e) => [e.id, e]));
}
function f(e) {
	return e.source === void 0 || e.target === void 0 ? null : e.direction === "backward" ? {
		source: e.target,
		target: e.source
	} : {
		source: e.source,
		target: e.target
	};
}
function p(e) {
	let t = d(e);
	for (let t of e.nodes) if (t.type !== "comment") {
		if (t.type !== "petri-place" && t.type !== "petri-transition") throw TypeError(`Unsupported Petri-net node type: ${t.type}`);
		if (t.type === "petri-place") {
			let e = t.state?.tokens, n = t.data?.initialTokens;
			if (e !== void 0 && o(e, -1) < 0 || n !== void 0 && o(n, -1) < 0) throw TypeError(`Place "${t.id}" has an invalid marking.`);
			let r = t.data?.capacity;
			if (r != null && o(r, -1) < 0) throw TypeError(`Place "${t.id}" has an invalid capacity.`);
			let i = u(t);
			if (i !== null && c(t) > i) throw TypeError(`Place "${t.id}" exceeds its capacity.`);
		}
	}
	for (let n of e.edges) {
		if (n.direction !== void 0 && n.direction !== "forward" && n.direction !== "backward") throw TypeError(`Arc "${n.id}" must be forward or backward.`);
		if (n.source === void 0 || n.target === void 0) continue;
		let e = t.get(n.source), r = t.get(n.target);
		if (!e || !r) throw TypeError(`Arc "${n.id}" has a missing endpoint.`);
		if (e.type !== "petri-place" && e.type !== "petri-transition" || r.type !== "petri-place" && r.type !== "petri-transition" || e.type === r.type) throw TypeError(`Arc "${n.id}" must connect a place and a transition.`);
		if (n.type !== void 0 && n.type !== "petri-arc") throw TypeError(`Unsupported Petri-net edge type: ${n.type}`);
		if (n.data?.weight !== void 0 && o(n.data.weight, 0, 1) < 1) throw TypeError(`Arc "${n.id}" has an invalid weight.`);
	}
}
function m(e, t) {
	if (e.nodes.find((e) => e.id === t)?.type !== "petri-transition") return null;
	let n = d(e), r = /* @__PURE__ */ new Map();
	for (let i of e.edges) {
		let e = f(i);
		e && (e.target === t && n.get(e.source)?.type === "petri-place" && r.set(e.source, (r.get(e.source) ?? 0) - l(i)), e.source === t && n.get(e.target)?.type === "petri-place" && r.set(e.target, (r.get(e.target) ?? 0) + l(i)));
	}
	let i = /* @__PURE__ */ new Map();
	for (let [e, t] of r) {
		let r = n.get(e);
		if (!r) return null;
		let a = c(r) + t, o = u(r);
		if (a < 0 || o !== null && a > o) return null;
		i.set(e, a);
	}
	return i;
}
function h(e) {
	return p(e), e.nodes.filter((t) => t.type === "petri-transition" && m(e, t.id) !== null).map((e) => e.id);
}
function g(e, t, n = 350) {
	p(e);
	let i = m(e, t);
	if (i === null) throw Error(`Transition "${t}" is not enabled.`);
	let a = {};
	for (let [t, n] of i) a[t] = { state: {
		...e.nodes.find((e) => e.id === t)?.state ?? {},
		tokens: n
	} };
	for (let n of e.nodes.filter((e) => e.type === r)) a[n.id] = { state: {
		...n.state ?? {},
		fired: n.id === t
	} };
	return {
		nodes: a,
		duration: n
	};
}
function _(e) {
	p(e);
	let t = e.nodes.filter((e) => e.type === n).map((e) => e.id), i = e.nodes.filter((e) => e.type === r).map((e) => e.id);
	return {
		places: t,
		transitions: i,
		values: t.map((t) => i.map((n) => {
			let r = 0;
			for (let i of e.edges) {
				let e = f(i);
				e && (e.source === t && e.target === n && (r -= l(i)), e.source === n && e.target === t && (r += l(i)));
			}
			return r;
		}))
	};
}
function v(e, t = 32) {
	p(e);
	let i = e.nodes.filter((e) => e.type === n).map((e) => e.id), a = e.nodes.filter((e) => e.type === r).map((e) => e.id), o = i.map((t) => c(e.nodes.find((e) => e.id === t))), s = [o], l = /* @__PURE__ */ new Map([[JSON.stringify(o), 0]]), u = [], d = !1;
	for (let n = 0; n < s.length; n += 1) {
		let r = s[n];
		if (!r) continue;
		let o = structuredClone(e);
		for (let [e, t] of i.entries()) {
			let n = o.nodes.find((e) => e.id === t);
			n && (n.state = {
				...n.state ?? {},
				tokens: r[e] ?? 0
			});
		}
		for (let e of a) {
			let a = m(o, e);
			if (a === null) continue;
			let c = [...r];
			for (let [e, t] of a) {
				let n = i.indexOf(e);
				n >= 0 && (c[n] = t);
			}
			let f = JSON.stringify(c), p = l.get(f);
			if (p === void 0) {
				if (s.length >= t) {
					d = !0;
					continue;
				}
				p = s.length, l.set(f, p), s.push(c);
			}
			u.push({
				source: n,
				target: p,
				transition: e
			});
		}
	}
	return {
		places: i,
		markings: s,
		edges: u,
		truncated: d
	};
}
function y(e) {
	return e === 0 ? "" : e > 5 ? `<text class="tp-petri-token-count" text-anchor="middle" dominant-baseline="central">${e}</text>` : (e === 1 ? [[0, 0]] : e === 2 ? [[-8, 0], [8, 0]] : e === 3 ? [
		[0, -9],
		[-8, 6],
		[8, 6]
	] : e === 4 ? [
		[-8, -8],
		[8, -8],
		[-8, 8],
		[8, 8]
	] : [
		[-9, -9],
		[9, -9],
		[0, 0],
		[-9, 9],
		[9, 9]
	]).map(([e, t]) => `<circle class="tp-petri-token" cx="${e}" cy="${t}" r="4" />`).join("");
}
var b = class l extends e {
	static petriStyleId = "tp-graph-petri-styles";
	constructor() {
		super(), this.unregisterPalette("generic"), this.registerPalette({
			id: "petri",
			label: "Petri net",
			shapes: [
				{
					type: n,
					label: "Place",
					description: "Place containing a marking",
					width: 62,
					height: 62,
					createData: () => ({
						initialTokens: 0,
						capacity: null
					}),
					render: (e, t) => `<circle r="31" class="tp-graph-shape tp-petri-place${t ? " is-selected" : ""}" />
            ${y(c(e))}
            <text class="tp-graph-label tp-petri-label" y="45" text-anchor="middle">${s(e.label ?? "Place")}</text>`
				},
				{
					type: r,
					label: "Transition",
					description: "Petri-net transition",
					width: 24,
					height: 62,
					render: (e, t) => `<rect x="-12" y="-31" width="24" height="62" rx="2" class="tp-graph-shape tp-petri-transition${t ? " is-selected" : ""}${e.state?.fired === !0 ? " is-fired" : ""}" />
            <text class="tp-graph-label tp-petri-label" y="45" text-anchor="middle">${s(e.label ?? "Transition")}</text>
            <g class="tp-petri-fire-control" data-petri-fire-transition="${s(e.id)}" aria-hidden="true">
              <circle cx="21" cy="-22" r="10" />
              <path d="M 18 -27 L 26 -22 L 18 -17 Z" />
            </g>`
				},
				{
					type: a,
					label: "Token",
					description: "Drag onto a place to add a token",
					width: 20,
					height: 20,
					render: () => "<circle class=\"tp-petri-token tp-petri-token-preview\" r=\"7\" />"
				}
			]
		}), this.registerSimulator("petri", (e) => {
			let t = h(e)[0];
			return t === void 0 ? { duration: 0 } : g(e, t);
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(l.petriStyleId, t);
	}
	setGraph(e) {
		p(e), super.setGraph(e);
	}
	addEdge(e, t, n = i, r, a, o = "forward") {
		if (o !== "forward" && o !== "backward") throw TypeError(`Unsupported Petri arc direction: ${o}`);
		return super.addEdge(e, t, n, r, a, o);
	}
	edgeDirections() {
		return ["forward", "backward"];
	}
	validateConnection(e, t, n) {
		super.validateConnection(e, t, n);
		let r = this.value, i = r.nodes.find((t) => t.id === e), a = r.nodes.find((e) => e.id === t);
		if (!i || !a) throw TypeError("Both arc endpoints must exist.");
		if (i.type !== "petri-place" && i.type !== "petri-transition" || a.type !== "petri-place" && a.type !== "petri-transition" || i.type === a.type) throw TypeError("A Petri arc must connect a place and a transition.");
		if (n !== "petri-arc") throw TypeError(`Unsupported Petri-net edge type: ${n}`);
	}
	addNode(e, t, n) {
		if (e !== "petri-place" && e !== "petri-transition" && e !== "comment") throw TypeError(`Unsupported Petri-net node type: ${e}`);
		return super.addNode(e, t, n);
	}
	addPlace(e, t = "Place", r = 0) {
		if (o(r, -1) < 0) throw TypeError("The initial marking must be a non-negative integer.");
		let i = this.addNode(n, e, t), a = this.value, s = a.nodes.find((e) => e.id === i.id);
		if (s) {
			let e = o(r, 0);
			s.data = {
				...s.data ?? {},
				initialTokens: e
			}, s.state = {
				...s.state ?? {},
				tokens: e
			}, this.setGraph(a);
		}
		return this.value.nodes.find((e) => e.id === i.id) ?? i;
	}
	addTransition(e, t = "Transition") {
		return this.addNode(r, e, t);
	}
	addTokens(e, t = 1, n = !0) {
		if (o(t, 0, 1) < 1) throw TypeError("The token count must be a positive integer.");
		let r = this.value, i = r.nodes.find((t) => t.id === e);
		if (!i || i.type !== "petri-place") throw TypeError("Tokens can only be added to a place.");
		let a = c(i) + t, s = u(i);
		if (s !== null && a > s) throw TypeError(`Place "${e}" exceeds its capacity.`);
		i.state = {
			...i.state ?? {},
			tokens: a
		}, n && (i.data = {
			...i.data ?? {},
			initialTokens: o(i.data?.initialTokens, c(i) - t) + t
		}), this.setGraph(r), this.dispatchEvent(new CustomEvent("tp-graph-change", {
			bubbles: !0,
			detail: {
				reason: "add-token",
				graph: this.value
			}
		}));
	}
	addArc(e, t, n = 1) {
		if (o(n, 0, 1) < 1) throw TypeError("The arc weight must be a positive integer.");
		let r = this.addEdge(e, t), i = this.value, a = i.edges.find((e) => e.id === r.id);
		if (a) {
			let e = o(n, 1, 1);
			a.data = {
				...a.data ?? {},
				weight: e
			}, a.label = e > 1 ? String(e) : void 0, this.setGraph(i);
		}
		return this.value.edges.find((e) => e.id === r.id) ?? r;
	}
	get enabledTransitions() {
		return h(this.value);
	}
	renderResults() {
		let e = this.value, t = _(e);
		if (t.places.length === 0) return "";
		let n = (t) => s(e.nodes.find((e) => e.id === t)?.label ?? t), r = t.transitions.map((e) => `<th scope="col">${n(e)}</th>`).join(""), i = t.places.map((e, r) => `<tr><th scope="row">${n(e)}</th>${(t.values[r] ?? []).map((e) => `<td>${e > 0 ? "+" : ""}${e}</td>`).join("")}</tr>`).join(""), a = t.places.map((t) => `<tr><th scope="row">${n(t)}</th><td>${c(e.nodes.find((e) => e.id === t))}</td></tr>`).join(""), o = v(e), l = Math.max(150, Math.min(6, o.markings.length) * 150), u = Math.max(90, Math.ceil(o.markings.length / 6) * 90), d = (e) => ({
			x: e % 6 * 150 + 150 / 2,
			y: Math.floor(e / 6) * 90 + 90 / 2
		}), f = o.edges.map((t) => {
			let n = d(t.source), r = d(t.target), i = e.nodes.find((e) => e.id === t.transition);
			if (t.source === t.target) return `<path class="tp-graph-results-marking-edge" d="M${n.x - 18} ${n.y - 22}A25 25 0 1 1 ${n.x + 18} ${n.y - 22}" marker-end="url(#tp-petri-marking-arrow)" />
          <text class="tp-graph-results-wave-step" x="${n.x}" y="${n.y - 34}" text-anchor="middle">${s(i?.label ?? t.transition)}</text>`;
			let a = (n.x + r.x) / 2, o = (n.y + r.y) / 2;
			return `<path class="tp-graph-results-marking-edge" d="M${n.x} ${n.y}L${r.x} ${r.y}" marker-end="url(#tp-petri-marking-arrow)" />
        <text class="tp-graph-results-wave-step" x="${a}" y="${o - 5}" text-anchor="middle">${s(i?.label ?? t.transition)}</text>`;
		}).join(""), p = o.markings.map((e, t) => {
			let n = d(t);
			return `<circle class="tp-graph-results-marking-node" cx="${n.x}" cy="${n.y}" r="27" />
        <text class="tp-graph-results-wave-label" x="${n.x}" y="${n.y - 4}" text-anchor="middle">M${t}</text>
        <text class="tp-graph-results-wave-step" x="${n.x}" y="${n.y + 12}" text-anchor="middle">(${e.join(", ")})</text>`;
		}).join("");
		return `<h3 class="tp-graph-results-header">Petri net analysis</h3><div class="tp-graph-results-content tp-graph-petri-results">
      <section><h4>Incidence matrix</h4><table><thead><tr><th scope="col">Place / transition</th>${r}</tr></thead><tbody>${i}</tbody></table></section>
      <section><h4>Current marking</h4><table class="tp-graph-marking-vector"><thead><tr><th scope="col">Place</th><th scope="col">M</th></tr></thead><tbody>${a}</tbody></table></section>
      <section class="tp-graph-marking-graph"><h4>Reachability graph${o.truncated ? " (first 32 markings)" : ""}</h4><svg viewBox="0 0 ${l} ${u}" width="${l}" height="${u}" role="img" aria-label="Reachability graph"><defs><marker id="tp-petri-marking-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker></defs>${f}${p}</svg></section>
    </div>`;
	}
	renderToolbarActions() {
		return `<tp-icon-button name="refresh" label="Reset marking" data-petri-action="reset"></tp-icon-button>
      <tp-icon-button name="play" label="Fire an enabled transition" data-petri-action="fire" ${this.enabledTransitions.length === 0 ? "disabled" : ""}></tp-icon-button>`;
	}
	bindExtensionEvents() {
		this.querySelector("[data-petri-action=\"fire\"]")?.addEventListener("click", () => {
			this.fireNext();
		}), this.querySelector("[data-petri-action=\"reset\"]")?.addEventListener("click", () => {
			this.resetMarking();
		});
		let e = new Set(this.enabledTransitions);
		for (let t of this.querySelectorAll("[data-node-id]")) {
			let n = t.dataset.nodeId;
			n && e.has(n) && (t.classList.add("is-petri-enabled"), t.addEventListener("keydown", (e) => {
				e.target !== t || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), e.stopPropagation(), this.fire(n));
			}));
		}
		for (let t of this.querySelectorAll("[data-petri-fire-transition]")) {
			let n = t.dataset.petriFireTransition;
			!n || !e.has(n) || t.addEventListener("click", (e) => {
				e.stopPropagation(), this.fire(n);
			});
		}
	}
	handlePaletteDrop(e, t, n) {
		if (e !== "petri-token") {
			super.handlePaletteDrop(e, t, n);
			return;
		}
		let r = n?.closest("[data-node-id]")?.dataset.nodeId;
		if (r) try {
			this.addTokens(r);
		} catch (e) {
			this.dispatchEvent(new CustomEvent("tp-graph-error", {
				bubbles: !0,
				detail: {
					error: e,
					operation: "add-token"
				}
			}));
		}
	}
	async fire(e, t = 350) {
		await this.animateTransition(g(this.value, e, t)), this.dispatchEvent(new CustomEvent("tp-petri-fire", {
			bubbles: !0,
			detail: {
				transitionId: e,
				marking: this.marking,
				graph: this.value
			}
		}));
	}
	async fireNext(e = 350) {
		let t = this.enabledTransitions;
		if (t.length === 0) return null;
		let n = t[Math.floor(Math.random() * t.length)];
		return n === void 0 ? null : (await this.fire(n, e), n);
	}
	resetMarking() {
		let e = this.value;
		for (let t of e.nodes) t.type === "petri-place" ? t.state = {
			...t.state ?? {},
			tokens: o(t.data?.initialTokens, 0)
		} : t.type === "petri-transition" && (t.state = {
			...t.state ?? {},
			fired: !1
		});
		this.setGraph(e), this.dispatchEvent(new CustomEvent("tp-petri-reset", {
			bubbles: !0,
			detail: {
				marking: this.marking,
				graph: this.value
			}
		}));
	}
	get marking() {
		return Object.fromEntries(this.value.nodes.filter((e) => e.type === n).map((e) => [e.id, c(e)]));
	}
};
customElements.get("tp-graph-petri") || customElements.define("tp-graph-petri", b);
//#endregion
export { b as a, l as c, c as d, p as f, r as i, _ as l, n, g as o, a as r, h as s, i as t, v as u };

//# sourceMappingURL=graph-petri.js.map