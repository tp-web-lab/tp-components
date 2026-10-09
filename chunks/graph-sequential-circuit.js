import { _ as e, g as t, i as n, y as r } from "./graph-logical-circuit.js";
//#region src/components/graph-sequential-circuit/graph-sequential-circuit.css?inline
var i = "tp-graph-sequential-circuit{display:block}.tp-sequential-memory{fill:var(--tp-neutral-fill-soft,#e5e7eb);stroke:var(--tp-neutral-stroke-loud,#172033)}.tp-sequential-symbol{font-size:18px;font-weight:700}.tp-sequential-q{font-size:.75rem}.tp-sequential-state.is-true{fill:var(--tp-success-fill-mid,#1c9b57)}.tp-sequential-state.is-false{fill:var(--tp-danger-fill-mid,#cf3c4f)}.tp-sequential-clock{fill:var(--tp-neutral-fill-soft,#e5e7eb);stroke:var(--tp-neutral-stroke-loud,#172033)}.tp-sequential-clock-wave{fill:none;stroke:var(--tp-neutral-text-colorful,#172033);stroke-width:2px;pointer-events:none}", a = "logic-clock", o = "logic-d-flip-flop", s = "logic-sr-latch", c = "logic-d-latch", l = "logic-jk-flip-flop", u = "logic-t-flip-flop", d = [
	o,
	s,
	c,
	l,
	u
];
function f(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function p(e, t, n, r) {
	let i = e.state?.value === !0;
	return `<rect x="-34" y="-28" width="68" height="56" class="tp-graph-shape tp-sequential-memory${t ? " is-selected" : ""}" />
    <text x="0" y="-5" class="tp-graph-label tp-sequential-symbol" text-anchor="middle">${n}</text>
    <text x="0" y="15" class="tp-graph-label" text-anchor="middle">${f(e.label ?? r)}</text>
    <text x="27" y="5" class="tp-graph-label tp-sequential-q" text-anchor="end">Q</text>
    <circle cx="26" cy="-18" r="4" class="tp-sequential-state ${i ? "is-true" : "is-false"}" />`;
}
function m(e, t) {
	return `<circle r="22" class="tp-graph-shape tp-sequential-clock${t ? " is-selected" : ""}" />
    <path d="M-13 4H-5V-7H5V4H13" class="tp-sequential-clock-wave" />
    <text y="35" class="tp-graph-label" text-anchor="middle">${f(e.label ?? "Clock")}</text>`;
}
function h(e) {
	let t = new Map(e.nodes.map((e) => [e.id, e])), n = (r, i = /* @__PURE__ */ new Set()) => {
		if (i.has(r)) return !1;
		i.add(r);
		let a = t.get(r);
		return a?.type === "logic-clock" || a?.type === "logic-hub" && e.edges.some((e) => e.target === r && e.source !== void 0 && n(e.source, i));
	}, r = /* @__PURE__ */ new Map();
	for (let i of e.edges) {
		if (i.target === void 0) continue;
		let e = t.get(i.target);
		if (e?.type === "logic-clock") throw TypeError("A clock cannot receive a wire.");
		if (!e || !d.includes(e.type)) continue;
		if (i.source === i.target) throw TypeError("A flip-flop cannot connect to itself.");
		if (i.direction !== void 0 && i.direction !== "forward") throw TypeError("Sequential wires must be forward.");
		let a = e.type === "logic-sr-latch" || e.type === "logic-d-latch" ? ["west", "south"] : e.type === "logic-t-flip-flop" ? ["west", "north"] : [
			"west",
			"north",
			"south"
		];
		if (!i.targetPort || !a.includes(i.targetPort)) throw TypeError(`Invalid input port for ${e.type}.`);
		let o = r.get(e.id) ?? /* @__PURE__ */ new Set();
		if (o.has(i.targetPort)) throw TypeError(`Flip-flop port ${i.targetPort} is already connected.`);
		if (o.add(i.targetPort), r.set(e.id, o), (e.type === "logic-d-flip-flop" || e.type === "logic-jk-flip-flop" || e.type === "logic-t-flip-flop") && i.targetPort === "north" && !n(i.source ?? "")) throw TypeError("The clock port must be connected to a clock, directly or through a hub.");
	}
}
function g(e) {
	let t = structuredClone(e), r = new Set(t.nodes.filter((e) => e.type === "logic-clock" || d.includes(e.type)).map((e) => e.id));
	for (let e of t.nodes) r.has(e.id) && (e.type = n);
	return t.edges = t.edges.filter((e) => e.target === void 0 || !r.has(e.target)), t;
}
function _(e) {
	h(e), r(g(e));
}
function v(t) {
	_(t);
	let n = structuredClone(t), r = e(g(n)), i = new Map(r.nodes.map((e) => [e.id, e]));
	for (let e of n.nodes) e.type !== "logic-clock" && !d.includes(e.type) && (e.state = structuredClone(i.get(e.id)?.state ?? e.state));
	let a = (e, t) => {
		let r = n.edges.find((n) => n.target === e && n.targetPort === t);
		return r?.source !== void 0 && i.get(r.source)?.state?.value === !0;
	};
	for (let e of n.nodes) {
		let t = e.state?.value === !0;
		if (e.type === "logic-sr-latch") {
			let n = a(e.id, "west"), r = a(e.id, "south");
			n !== r && (t = n), e.state = {
				...e.state ?? {},
				value: t,
				invalid: n && r
			};
		} else e.type === "logic-d-latch" && a(e.id, "south") && (t = a(e.id, "west"), e.state = {
			...e.state ?? {},
			value: t
		});
	}
	let o = e(g(n)), s = new Map(o.nodes.map((e) => [e.id, e]));
	for (let e of n.nodes) e.type !== "logic-clock" && !d.includes(e.type) && (e.state = structuredClone(s.get(e.id)?.state ?? e.state));
	let c = new Map(n.nodes.map((e) => [e.id, e]));
	for (let e of n.edges) {
		let t = e.source === void 0 ? void 0 : c.get(e.source);
		e.state = {
			...e.state ?? {},
			value: t?.state?.value === !0
		};
	}
	return n;
}
var y = class e extends t {
	static sequentialStyleId = "tp-graph-sequential-circuit-styles";
	timer = null;
	timeline = [];
	constructor() {
		super(), this.registerPalette({
			id: "logic-sequential",
			label: "Sequential",
			shapes: [
				{
					type: a,
					label: "Clock",
					description: "Rising-edge clock",
					width: 44,
					height: 44,
					ports: { east: {
						x: 22,
						y: 0
					} },
					createData: () => ({ period: 700 }),
					render: m
				},
				{
					type: o,
					label: "D flip-flop",
					description: "Rising-edge D flip-flop",
					width: 68,
					height: 56,
					ports: {
						west: {
							x: -34,
							y: 0
						},
						north: {
							x: 0,
							y: -28
						},
						east: {
							x: 34,
							y: 0
						},
						south: {
							x: 0,
							y: 28
						}
					},
					createData: () => ({
						initial: !1,
						trigger: "rising"
					}),
					render: (e, t) => p(e, t, "D", "DFF")
				},
				{
					type: s,
					label: "SR latch",
					description: "Level-sensitive SR latch",
					width: 68,
					height: 56,
					ports: {
						west: {
							x: -34,
							y: 0
						},
						east: {
							x: 34,
							y: 0
						},
						south: {
							x: 0,
							y: 28
						}
					},
					createData: () => ({ initial: !1 }),
					render: (e, t) => p(e, t, "SR", "SR")
				},
				{
					type: c,
					label: "D latch",
					description: "Enable-controlled D latch",
					width: 68,
					height: 56,
					ports: {
						west: {
							x: -34,
							y: 0
						},
						east: {
							x: 34,
							y: 0
						},
						south: {
							x: 0,
							y: 28
						}
					},
					createData: () => ({ initial: !1 }),
					render: (e, t) => p(e, t, "D", "Latch")
				},
				{
					type: l,
					label: "JK flip-flop",
					description: "Rising-edge JK flip-flop",
					width: 68,
					height: 56,
					ports: {
						west: {
							x: -34,
							y: 0
						},
						north: {
							x: 0,
							y: -28
						},
						east: {
							x: 34,
							y: 0
						},
						south: {
							x: 0,
							y: 28
						}
					},
					createData: () => ({
						initial: !1,
						trigger: "rising"
					}),
					render: (e, t) => p(e, t, "JK", "JK")
				},
				{
					type: u,
					label: "T flip-flop",
					description: "Rising-edge toggle flip-flop",
					width: 68,
					height: 56,
					ports: {
						west: {
							x: -34,
							y: 0
						},
						north: {
							x: 0,
							y: -28
						},
						east: {
							x: 34,
							y: 0
						}
					},
					createData: () => ({
						initial: !1,
						trigger: "rising"
					}),
					render: (e, t) => p(e, t, "T", "TFF")
				}
			]
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(e.sequentialStyleId, i), this.timeline.length === 0 && (this.recordSample(this.value, "Initial", !1), this.setGraph(this.value));
	}
	disconnectedCallback() {
		this.stop(), super.disconnectedCallback();
	}
	isSupportedLogicNode(e) {
		return e === "logic-clock" || d.includes(e) || super.isSupportedLogicNode(e);
	}
	validateLogicGraph(e) {
		_(e);
	}
	toggle(e, t = !0) {
		let n = this.value, r = n.nodes.find((t) => t.id === e);
		if (!r || r.type !== "logic-input" && r.type !== "logic-output") throw TypeError("Only inputs and outputs can be toggled.");
		let i = r.state?.value !== !0;
		r.state = {
			...r.state ?? {},
			value: i
		};
		let a = t && r.type === "logic-input" ? v(n) : n;
		return this.recordSample(a, r.label ?? r.id, !1), this.setGraph(a), this.dispatchEvent(new CustomEvent("tp-logic-toggle", {
			bubbles: !0,
			detail: {
				id: e,
				value: i,
				graph: this.value
			}
		})), i;
	}
	evaluate() {
		let e = v(this.value);
		this.recordSample(e, "Evaluate", !1), this.setGraph(e), this.dispatchEvent(new CustomEvent("tp-logic-evaluate", {
			bubbles: !0,
			detail: { graph: this.value }
		}));
	}
	clockStep() {
		let e = this.value;
		for (let t of e.nodes.filter((e) => e.type === a)) t.state = {
			...t.state ?? {},
			value: !1
		};
		this.recordSample(e, "Clock 0", !1);
		let t = structuredClone(e);
		for (let e of t.nodes.filter((e) => e.type === a)) e.state = {
			...e.state ?? {},
			value: !0
		};
		let n = v(t), r = new Map(n.nodes.map((e) => [e.id, e])), i = /* @__PURE__ */ new Map(), o = (e, t) => {
			let i = n.edges.find((n) => n.target === e && n.targetPort === t);
			return i?.source !== void 0 && r.get(i.source)?.state?.value === !0;
		};
		for (let e of n.nodes) {
			let t = e.state?.value === !0;
			if (e.type === "logic-d-flip-flop") i.set(e.id, o(e.id, "west"));
			else if (e.type === "logic-t-flip-flop") i.set(e.id, o(e.id, "west") ? !t : t);
			else if (e.type === "logic-jk-flip-flop") {
				let n = o(e.id, "west"), r = o(e.id, "south");
				i.set(e.id, n && r ? !t : n ? !0 : !r && t);
			}
		}
		for (let [e, t] of i) {
			let n = r.get(e);
			n && (n.state = {
				...n.state ?? {},
				value: t
			});
		}
		let s = v(n);
		this.recordSample(s, "Clock ↑", !0);
		for (let e of s.nodes.filter((e) => e.type === a)) e.state = {
			...e.state ?? {},
			value: !1
		};
		let c = v(s);
		this.recordSample(c, "Clock 0", !1), this.setGraph(c), this.dispatchEvent(new CustomEvent("tp-sequential-clock", {
			bubbles: !0,
			detail: {
				values: Object.fromEntries(i),
				graph: this.value
			}
		}));
	}
	resetSequentialState() {
		let e = this.value;
		for (let t of e.nodes) d.includes(t.type) && (t.state = {
			...t.state ?? {},
			value: t.data?.initial === !0
		});
		let t = v(e);
		this.timeline = [], this.recordSample(t, "Reset", !1), this.setGraph(t), this.dispatchEvent(new CustomEvent("tp-sequential-reset", {
			bubbles: !0,
			detail: { graph: this.value }
		}));
	}
	run(e = 700) {
		if (this.timer !== null) return;
		let t = Number.isFinite(e) ? Math.max(100, e) : 700;
		this.timer = window.setInterval(() => this.clockStep(), t), this.renderRunState();
	}
	stop() {
		this.timer !== null && (window.clearInterval(this.timer), this.timer = null, this.renderRunState());
	}
	get running() {
		return this.timer !== null;
	}
	renderResults() {
		let e = this.timeline ?? [];
		if (e.length === 0) return "";
		let t = this.value.nodes.filter((e) => e.type === "logic-input" || e.type === "logic-output" || e.type === "logic-clock" || d.includes(e.type));
		if (t.length === 0) return "";
		let n = 90 + e.length * 54, r = 24 + t.length * 30;
		return `<h3 class="tp-graph-results-header">Timing diagram</h3><div class="tp-graph-results-content"><svg viewBox="0 0 ${n} ${r}" width="${n}" height="${r}" role="img" aria-label="Circuit timing diagram">${e.map((t, n) => {
			let i = 90 + n * 54;
			return `<path class="tp-graph-results-wave-grid" d="M${i} 20V${r}" />
        <text class="tp-graph-results-wave-step" x="${i + 54 / 2}" y="13" text-anchor="middle">${f(e[n]?.label ?? "")}</text>`;
		}).join("")}${t.map((t, n) => {
			let r = 24 + n * 30, i = r + 7, a = r + 23, o = `M 90 ${e[0]?.values[t.id] === !0 ? i : a}`;
			for (let n = 0; n < e.length; n += 1) {
				let r = 90 + (n + 1) * 54;
				o += ` H ${r}`;
				let s = e[n + 1];
				s && (o += ` V ${s.values[t.id] === !0 ? i : a}`);
			}
			return `<text class="tp-graph-results-wave-label" x="82" y="${r + 18}" text-anchor="end">${f(t.label ?? t.id)}</text>
        <path class="tp-graph-results-wave" d="${o}" />`;
		}).join("")}</svg></div>`;
	}
	renderToolbarActions() {
		return `<tp-icon-button name="refresh" label="Reset sequential state" data-sequential-action="reset"></tp-icon-button>
      <tp-icon-button name="vector-square" label="Use ${(this.representation === "iso" ? "ansi" : "iso").toUpperCase()} gate symbols" data-sequential-action="representation"></tp-icon-button>
      <tp-icon-button name="stop" label="Stop clock" data-sequential-action="stop" ${this.running ? "" : "disabled"}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run clock" data-sequential-action="run" ${this.running ? "disabled" : ""}></tp-icon-button>
      <tp-icon-button name="play" label="Clock step" data-sequential-action="step"></tp-icon-button>`;
	}
	bindExtensionEvents() {
		super.bindExtensionEvents(), this.querySelector("[data-sequential-action=\"reset\"]")?.addEventListener("click", () => this.resetSequentialState()), this.querySelector("[data-sequential-action=\"representation\"]")?.addEventListener("click", () => this.toggleRepresentation()), this.querySelector("[data-sequential-action=\"stop\"]")?.addEventListener("click", () => this.stop()), this.querySelector("[data-sequential-action=\"run\"]")?.addEventListener("click", () => this.run()), this.querySelector("[data-sequential-action=\"step\"]")?.addEventListener("click", () => this.clockStep());
	}
	renderRunState() {
		this.isConnected && this.setGraph(this.value);
	}
	recordSample(e, t, n) {
		let r = {};
		for (let t of e.nodes) r[t.id] = t.type === "logic-clock" ? n : t.state?.value === !0;
		this.timeline.push({
			label: t,
			values: r
		}), this.timeline.length > 24 && this.timeline.shift();
	}
};
customElements.get("tp-graph-sequential-circuit") || customElements.define("tp-graph-sequential-circuit", y);
//#endregion
export { s as a, v as c, l as i, _ as l, o as n, u as o, c as r, y as s, a as t };

