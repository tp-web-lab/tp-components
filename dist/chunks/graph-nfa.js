import { i as e } from "./graph-editor.js";
//#region src/components/graph-nfa/graph-nfa.css?inline
var t = "tp-graph-nfa{display:block}.tp-nfa-state.is-active{fill:var(--tp-info-fill-softer,#dbeafe);stroke:var(--tp-info-stroke-mid,#2563eb);stroke-width:4px}.tp-nfa-accepting,.tp-nfa-initial-arrow{fill:none;stroke:var(--tp-graph-node-stroke,var(--tp-brand-stroke-mid,#5268d8));stroke-width:2px;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-edge.is-active .tp-graph-edge-line{stroke:var(--tp-info-stroke-mid,#2563eb);stroke-width:4px}.tp-nfa-field{align-items:center;gap:.3rem;font-size:.78rem;display:inline-flex}.tp-nfa-field input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft,#c7cedb);width:8rem;min-height:2rem;color:inherit;background:var(--tp-paper-color,Canvas);border-radius:.35rem;padding-inline:.45rem}.tp-nfa-status{min-width:4rem;font-size:.8rem;font-weight:600}.tp-nfa-status.success{color:var(--tp-success-text-colorful,#15803d)}.tp-nfa-status.danger{color:var(--tp-danger-text-colorful,#b91c1c)}", n = "nfa-state", r = "nfa-transition", i = "ε";
function a(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
var o = class {
	source;
	position = 0;
	constructor(e) {
		this.source = e;
	}
	parse() {
		let e = this.alternation();
		if (this.position !== this.source.length) throw TypeError(`Unexpected "${this.source[this.position]}" at ${this.position}.`);
		return e;
	}
	alternation() {
		let e = this.concatenation();
		for (; this.peek() === "|";) this.position += 1, e = {
			kind: "alternate",
			left: e,
			right: this.concatenation()
		};
		return e;
	}
	concatenation() {
		let e = [];
		for (; this.position < this.source.length && this.peek() !== ")" && this.peek() !== "|";) e.push(this.repetition());
		return e.length === 0 ? { kind: "epsilon" } : e.slice(1).reduce((e, t) => ({
			kind: "concat",
			left: e,
			right: t
		}), e[0]);
	}
	repetition() {
		let e = this.atom();
		for (; this.peek() === "*" || this.peek() === "+" || this.peek() === "?";) {
			let t = this.peek();
			this.position += 1, e = t === "*" ? {
				kind: "star",
				child: e
			} : t === "+" ? {
				kind: "plus",
				child: e
			} : {
				kind: "optional",
				child: e
			};
		}
		return e;
	}
	atom() {
		let e = this.peek();
		if (e === void 0) return { kind: "epsilon" };
		if (e === "(") {
			this.position += 1;
			let e = this.alternation();
			if (this.peek() !== ")") throw TypeError(`Missing closing parenthesis at ${this.position}.`);
			return this.position += 1, e;
		}
		if (e === "\\") {
			this.position += 1;
			let e = this.peek();
			if (e === void 0) throw TypeError("A regular expression cannot end with an escape character.");
			return this.position += 1, {
				kind: "symbol",
				value: e
			};
		}
		if ("|)*+?".includes(e)) throw TypeError(`Unexpected "${e}" at ${this.position}.`);
		return this.position += 1, {
			kind: "symbol",
			value: e
		};
	}
	peek() {
		return this.source[this.position];
	}
};
function s(e) {
	let t = new o(e).parse(), i = 0, a = 0, s = [], c = () => i++, l = (e, t, n) => {
		a += 1, s.push({
			id: `transition-${a}`,
			type: r,
			source: `q${e}`,
			target: `q${t}`,
			label: n,
			direction: "forward"
		});
	}, u = (e) => {
		if (e.kind === "symbol" || e.kind === "epsilon") {
			let t = c(), n = c();
			return l(t, n, e.kind === "epsilon" ? "ε" : e.value), {
				start: t,
				end: n
			};
		}
		if (e.kind === "concat") {
			let t = u(e.left), n = u(e.right);
			return l(t.end, n.start, "ε"), {
				start: t.start,
				end: n.end
			};
		}
		if (e.kind === "alternate") {
			let t = c(), n = u(e.left), r = u(e.right), i = c();
			return l(t, n.start, "ε"), l(t, r.start, "ε"), l(n.end, i, "ε"), l(r.end, i, "ε"), {
				start: t,
				end: i
			};
		}
		if (e.kind === "star" || e.kind === "optional") {
			let t = c(), n = u(e.child), r = c();
			return l(t, n.start, "ε"), l(t, r, "ε"), l(n.end, r, "ε"), e.kind === "star" && l(n.end, n.start, "ε"), {
				start: t,
				end: r
			};
		}
		let t = u(e.child);
		return l(t.end, t.start, "ε"), t;
	}, d = u(t), f = Array.from({ length: i }, (e, t) => ({
		id: `q${t}`,
		type: n,
		x: 100 + t % 6 * 135,
		y: 120 + Math.floor(t / 6) * 150,
		label: `q${t}`,
		data: {
			initial: t === d.start,
			accepting: t === d.end
		}
	}));
	return {
		version: 1,
		title: `NFA for ${e}`,
		nodes: f,
		edges: s,
		data: { regex: e }
	};
}
function c(e) {
	let t = new Set(e.nodes.filter((e) => e.type === n).map((e) => e.id));
	for (let t of e.nodes) if (t.type !== "nfa-state" && t.type !== "comment") throw TypeError(`Unsupported NFA node type: ${t.type}`);
	for (let n of e.edges) {
		if (n.source !== void 0 && n.target !== void 0 && (!t.has(n.source) || !t.has(n.target))) throw TypeError(`Transition "${n.id}" must connect two NFA states.`);
		if (n.type !== void 0 && n.type !== "nfa-transition") throw TypeError(`Unsupported NFA edge type: ${n.type}`);
		if (n.direction !== void 0 && n.direction !== "forward") throw TypeError("NFA transitions must be forward.");
	}
}
function l(e, t) {
	let n = new Set(t), r = [...n];
	for (; r.length > 0;) {
		let t = r.pop();
		for (let i of e.edges) i.source !== t || i.target === void 0 || i.label !== "ε" || n.has(i.target) || (n.add(i.target), r.push(i.target));
	}
	return n;
}
function u(e, t, n, r = 500) {
	c(e);
	let i = l(e, t), a = e.edges.filter((e) => e.source !== void 0 && i.has(e.source) && e.target !== void 0 && e.label === n), o = l(e, a.flatMap((e) => e.target ? [e.target] : [])), s = {};
	for (let t of e.nodes) s[t.id] = { state: {
		...t.state ?? {},
		active: o.has(t.id)
	} };
	let u = {};
	for (let t of e.edges) u[t.id] = { state: {
		...t.state ?? {},
		active: a.includes(t)
	} };
	return {
		activeStates: [...o],
		transition: {
			nodes: s,
			edges: u,
			duration: r
		}
	};
}
var d = class i extends e {
	static nfaStyleId = "tp-graph-nfa-styles";
	regexSource = "ab(a|b)*";
	inputWord = "";
	inputPosition = 0;
	activeStateIds = /* @__PURE__ */ new Set();
	running = !1;
	constructor() {
		super(), this.unregisterPalette("generic"), this.registerPalette({
			id: "nfa",
			label: "Automaton",
			shapes: [{
				type: n,
				label: "State",
				description: "NFA state",
				width: 64,
				height: 64,
				render: (e, t) => `<circle r="31" class="tp-graph-shape tp-nfa-state${t ? " is-selected" : ""}${e.state?.active === !0 ? " is-active" : ""}" />
          ${e.data?.accepting === !0 ? "<circle r=\"25\" class=\"tp-nfa-accepting\" />" : ""}
          ${e.data?.initial === !0 ? "<path class=\"tp-nfa-initial-arrow\" d=\"M -52 0 L -34 0 M -40 -6 L -34 0 L -40 6\" />" : ""}
          <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${a(e.label ?? "State")}</text>`
			}]
		}), super.setGraph(s(this.regexSource)), this.reset();
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.nfaStyleId, t);
	}
	setGraph(e) {
		c(e), super.setGraph(e), typeof e.data?.regex == "string" && (this.regexSource = e.data.regex);
	}
	addNode(e, t, n) {
		if (e !== "nfa-state" && e !== "comment") throw TypeError(`Unsupported NFA node type: ${e}`);
		return super.addNode(e, t, n);
	}
	addEdge(e, t, n = r, i, a, o = "forward") {
		if (o !== "forward") throw TypeError("NFA transitions must be forward.");
		return super.addEdge(e, t, n, i, a, o);
	}
	edgeDirections() {
		return ["forward"];
	}
	validateConnection(e, t, n) {
		super.validateConnection(e, t, n);
		let r = this.value;
		if (r.nodes.find((t) => t.id === e)?.type !== "nfa-state" || r.nodes.find((e) => e.id === t)?.type !== "nfa-state") throw TypeError("An NFA transition must connect two states.");
		if (n !== "nfa-transition") throw TypeError(`Unsupported NFA edge type: ${n}`);
	}
	get regex() {
		return this.regexSource;
	}
	get word() {
		return this.inputWord;
	}
	get activeStates() {
		return [...this.activeStateIds];
	}
	get accepted() {
		return this.inputPosition === this.inputWord.length && this.value.nodes.some((e) => this.activeStateIds.has(e.id) && e.data?.accepting === !0);
	}
	generate(e = this.regexSource) {
		this.regexSource = e, this.setGraph(s(e)), this.reset(this.inputWord);
	}
	reset(e = this.inputWord) {
		this.inputWord = e, this.inputPosition = 0;
		let t = this.value, n = t.nodes.filter((e) => e.data?.initial === !0).map((e) => e.id);
		this.activeStateIds = l(t, n);
		for (let e of t.nodes) e.state = {
			...e.state ?? {},
			active: this.activeStateIds.has(e.id)
		};
		for (let e of t.edges) e.state = {
			...e.state ?? {},
			active: !1
		};
		super.setGraph(t);
	}
	async readNext(e = 500) {
		let t = this.inputWord[this.inputPosition];
		if (t === void 0 || this.activeStateIds.size === 0) return !1;
		let n = u(this.value, this.activeStateIds, t, e);
		return this.inputPosition += 1, this.activeStateIds = new Set(n.activeStates), await this.animateTransition(n.transition), !0;
	}
	async run(e = 650) {
		if (this.running) return this.accepted;
		this.running = !0, super.setGraph(this.value);
		try {
			for (; this.inputPosition < this.inputWord.length && this.activeStateIds.size > 0;) await this.readNext(e);
			return this.accepted;
		} finally {
			this.running = !1, super.setGraph(this.value);
		}
	}
	renderResults() {
		let e = this.value, t = e.nodes.filter((e) => e.type === n);
		if (t.length === 0) return "";
		let r = [...new Set(e.edges.flatMap((e) => (e.label ?? "").split(/[\s,]+/u).filter(Boolean)))].sort((e, t) => e === "ε" ? -1 : t === "ε" ? 1 : e.localeCompare(t));
		return `<h3 class="tp-graph-results-header">Transition table</h3><div class="tp-graph-results-content"><table><thead><tr><th scope="col">State</th>${r.map((e) => `<th scope="col">${a(e)}</th>`).join("")}</tr></thead><tbody>${t.map((t) => {
			let n = `${t.data?.initial === !0 ? "→" : ""}${t.data?.accepting === !0 ? "*" : ""}`, i = r.map((n) => {
				let r = e.edges.filter((e) => e.source === t.id && (e.label ?? "").split(/[\s,]+/u).includes(n)).flatMap((e) => e.target ? [e.target] : []).map((t) => e.nodes.find((e) => e.id === t)).filter((e) => e !== void 0).map((e) => e.label ?? e.id);
				return `<td>${r.length > 0 ? `{${r.map(a).join(", ")}}` : "∅"}</td>`;
			}).join("");
			return `<tr><th scope="row">${n}${a(t.label ?? t.id)}</th>${i}</tr>`;
		}).join("")}</tbody></table></div>`;
	}
	renderToolbarActions() {
		let e = this.inputPosition === this.inputWord.length || this.activeStateIds.size === 0, t = e ? this.accepted ? "Accepted" : "Rejected" : `${this.inputPosition}/${this.inputWord.length}`;
		return `<tp-icon-button name="refresh" label="Generate NFA" data-nfa-action="generate" ${this.running ? "disabled" : ""}></tp-icon-button>
      <label class="tp-nfa-field">Regex <input value="${a(this.regexSource)}" data-nfa-regex aria-label="Regular expression" ${this.running ? "disabled" : ""}/></label>
      <tp-icon-button name="refresh" label="Reset word" data-nfa-action="reset"></tp-icon-button>
      <label class="tp-nfa-field">Word <input value="${a(this.inputWord)}" data-nfa-word aria-label="Input word" ${this.running ? "disabled" : ""}/></label>
      <tp-icon-button name="play" label="Read next character" data-nfa-action="step" ${e || this.running ? "disabled" : ""}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run word" data-nfa-action="run" ${e || this.running ? "disabled" : ""}></tp-icon-button>
      <span class="tp-nfa-status${e ? this.accepted ? " success" : " danger" : ""}">${t}</span>`;
	}
	bindExtensionEvents() {
		this.querySelector("[data-nfa-regex]")?.addEventListener("change", (e) => {
			this.regexSource = e.currentTarget.value;
		}), this.querySelector("[data-nfa-word]")?.addEventListener("change", (e) => this.reset(e.currentTarget.value)), this.querySelector("[data-nfa-action=\"generate\"]")?.addEventListener("click", () => this.generate()), this.querySelector("[data-nfa-action=\"step\"]")?.addEventListener("click", () => {
			this.readNext();
		}), this.querySelector("[data-nfa-action=\"run\"]")?.addEventListener("click", () => {
			this.run();
		}), this.querySelector("[data-nfa-action=\"reset\"]")?.addEventListener("click", () => this.reset());
	}
};
customElements.get("tp-graph-nfa") || customElements.define("tp-graph-nfa", d);
//#endregion
export { u as a, d as i, n, s as o, r, c as s, i as t };

//# sourceMappingURL=graph-nfa.js.map