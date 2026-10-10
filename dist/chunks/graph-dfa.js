import { i as e } from "./graph-editor.js";
//#region src/components/graph-dfa/graph-dfa.css?inline
var t = "tp-graph-dfa{display:block}.tp-dfa-state.is-active{fill:var(--tp-success-fill-softer,#dcfce7);stroke:var(--tp-success-stroke-mid,#16a34a);stroke-width:4px}.tp-dfa-accepting{fill:none;stroke:var(--tp-graph-node-stroke,var(--tp-brand-stroke-mid,#5268d8));stroke-width:2px;pointer-events:none;vector-effect:non-scaling-stroke}.tp-dfa-initial-arrow{fill:none;stroke:var(--tp-graph-edge-color,currentColor);stroke-width:2px;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-edge .tp-graph-edge-line{stroke-linecap:round;transition:stroke .2s,stroke-width .2s}.tp-graph-edge.is-active .tp-graph-edge-line{stroke:var(--tp-success-stroke-mid,#16a34a);stroke-width:4px}.tp-dfa-word-label{align-items:center;gap:.35rem;font-size:.8rem;display:inline-flex}.tp-dfa-word-label input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft,#c7cedb);width:9rem;min-height:2rem;color:inherit;background:var(--tp-paper-color,Canvas);border-radius:.35rem;padding-inline:.5rem}.tp-dfa-status{min-width:5rem;font-size:.8rem;font-weight:600}.tp-dfa-status.success{color:var(--tp-success-text-colorful,#15803d)}.tp-dfa-status.danger{color:var(--tp-danger-text-colorful,#b91c1c)}@media (prefers-reduced-motion:reduce){tp-graph-dfa,tp-graph-dfa *{transition-duration:.01ms!important;transition-delay:0s!important}}", n = "dfa-state", r = "dfa-transition";
function i(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function a(e) {
	return (e.label ?? "").split(/[\s,]+/u).filter(Boolean);
}
function o(e) {
	let t = e.data?.alphabet;
	if (Array.isArray(t)) {
		if (!t.every((e) => typeof e == "string" && [...e].length === 1)) throw TypeError("The DFA alphabet must contain single-character strings.");
		return [...new Set(t)];
	}
	return [...new Set(e.edges.flatMap(a))].sort();
}
function s(e) {
	let t = o(e), n = /* @__PURE__ */ new Set(), r = 0;
	for (let t of e.nodes) if (t.type !== "comment") {
		if (t.type !== "dfa-state") throw TypeError(`Unsupported DFA node type: ${t.type}`);
		n.add(t.id), t.data?.initial === !0 && (r += 1);
	}
	if (r > 1) throw TypeError("A DFA can have only one initial state.");
	let i = /* @__PURE__ */ new Set();
	for (let t of e.edges) if (!(t.source === void 0 || t.target === void 0)) {
		if (!n.has(t.source) || !n.has(t.target)) throw TypeError(`Transition "${t.id}" must connect two DFA states.`);
		if (t.type !== void 0 && t.type !== "dfa-transition") throw TypeError(`Unsupported DFA edge type: ${t.type}`);
		if (t.direction !== void 0 && t.direction !== "forward") throw TypeError(`Transition "${t.id}" must be forward.`);
		for (let e of a(t)) {
			let n = `${t.source}\u0000${e}`;
			if (i.has(n)) throw TypeError(`State "${t.source}" has several transitions for "${e}".`);
			i.add(n);
		}
	}
	if (Array.isArray(e.data?.alphabet)) {
		for (let e of n) for (let n of t) if (!i.has(`${e}\u0000${n}`)) throw TypeError(`State "${e}" has no transition for "${n}".`);
	}
}
function c(e, t, r, i = 300) {
	s(e);
	let o = e.edges.find((e) => e.source === t && e.target !== void 0 && a(e).includes(r)), c = o?.target ?? null, l = {};
	for (let t of e.nodes.filter((e) => e.type === n)) l[t.id] = { state: {
		...t.state ?? {},
		active: t.id === c
	} };
	let u = {};
	for (let t of e.edges) u[t.id] = { state: {
		...t.state ?? {},
		active: t.id === o?.id
	} };
	return {
		stateId: c,
		transition: {
			nodes: l,
			edges: u,
			duration: i
		}
	};
}
var l = class l extends e {
	static dfaStyleId = "tp-graph-dfa-styles";
	inputWord = "";
	inputPosition = 0;
	activeStateId = null;
	rejected = !1;
	invalidSymbol = null;
	running = !1;
	constructor() {
		super(), this.unregisterPalette("generic"), this.registerPalette({
			id: "dfa",
			label: "Automaton",
			shapes: [{
				type: n,
				label: "State",
				description: "DFA state",
				width: 64,
				height: 64
			}].map((e) => ({
				...e,
				render: (e, t) => {
					let n = e.data?.initial === !0, r = e.data?.accepting === !0, a = e.state?.active === !0;
					return `${n ? "<path class=\"tp-dfa-initial-arrow\" d=\"M -52 0 L -34 0 M -40 -6 L -34 0 L -40 6\" />" : ""}
            <circle r="31" class="tp-graph-shape tp-dfa-state${t ? " is-selected" : ""}${a ? " is-active" : ""}" />
            ${r ? "<circle r=\"25\" class=\"tp-dfa-accepting\" />" : ""}
            <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${i(e.label ?? "State")}</text>`;
				}
			}))
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(l.dfaStyleId, t);
	}
	setGraph(e) {
		s(e), super.setGraph(e), this.syncRuntimeFromGraph();
	}
	addNode(e, t, n) {
		if (e !== "dfa-state" && e !== "comment") throw TypeError(`Unsupported DFA node type: ${e}`);
		return super.addNode(e, t, n);
	}
	addEdge(e, t, n = r, i, a, o = "forward") {
		if (o !== "forward") throw TypeError("DFA transitions must be forward.");
		return super.addEdge(e, t, n, i, a, o);
	}
	edgeDirections() {
		return ["forward"];
	}
	validateConnection(e, t, n) {
		super.validateConnection(e, t, n);
		let r = this.value;
		if (r.nodes.find((t) => t.id === e)?.type !== "dfa-state" || r.nodes.find((e) => e.id === t)?.type !== "dfa-state") throw TypeError("A DFA transition must connect two states.");
		if (n !== "dfa-transition") throw TypeError(`Unsupported DFA edge type: ${n}`);
	}
	get word() {
		return this.inputWord;
	}
	set word(e) {
		this.reset(e);
	}
	get position() {
		return this.inputPosition;
	}
	get currentState() {
		return this.activeStateId;
	}
	get alphabet() {
		return o(this.value);
	}
	get accepted() {
		return this.rejected || this.inputPosition !== this.inputWord.length || this.activeStateId === null ? !1 : this.value.nodes.find((e) => e.id === this.activeStateId)?.data?.accepting === !0;
	}
	reset(e = this.inputWord) {
		this.inputWord = e, this.inputPosition = 0, this.rejected = !1, this.invalidSymbol = null;
		let t = this.value;
		this.activeStateId = t.nodes.find((e) => e.type === "dfa-state" && e.data?.initial === !0)?.id ?? null;
		for (let e of t.nodes) e.state = {
			...e.state ?? {},
			active: e.id === this.activeStateId
		};
		for (let e of t.edges) e.state = {
			...e.state ?? {},
			active: !1
		};
		super.setGraph(t), this.dispatchEvent(new CustomEvent("tp-dfa-reset", {
			bubbles: !0,
			detail: {
				word: this.inputWord,
				stateId: this.activeStateId,
				graph: this.value
			}
		}));
	}
	async readNext(e = 300) {
		if (this.rejected || this.activeStateId === null || this.inputPosition >= this.inputWord.length) return !1;
		let t = this.inputWord[this.inputPosition];
		if (t === void 0) return !1;
		this.alphabet.includes(t) || (this.invalidSymbol = t);
		let n = c(this.value, this.activeStateId, t, e);
		return this.inputPosition += 1, this.activeStateId = n.stateId, this.rejected = n.stateId === null, await this.animateTransition(n.transition), this.dispatchEvent(new CustomEvent("tp-dfa-step", {
			bubbles: !0,
			detail: {
				symbol: t,
				position: this.inputPosition,
				stateId: this.activeStateId,
				accepted: this.accepted,
				rejected: this.rejected,
				graph: this.value
			}
		})), !0;
	}
	async run(e = 600) {
		if (this.running) return this.accepted;
		this.running = !0, super.setGraph(this.value);
		try {
			for (; this.inputPosition < this.inputWord.length && !this.rejected;) await this.readNext(e);
			return this.accepted;
		} finally {
			this.running = !1, super.setGraph(this.value);
		}
	}
	renderResults() {
		let e = this.value, t = e.nodes.filter((e) => e.type === n);
		if (t.length === 0) return "";
		let r = o(e);
		return `<h3 class="tp-graph-results-header">Transition table</h3><div class="tp-graph-results-content"><table><thead><tr><th scope="col">State</th>${r.map((e) => `<th scope="col">${i(e)}</th>`).join("")}</tr></thead><tbody>${t.map((t) => {
			let n = `${t.data?.initial === !0 ? "→" : ""}${t.data?.accepting === !0 ? "*" : ""}`, o = r.map((n) => {
				let r = e.edges.find((e) => e.source === t.id && a(e).includes(n)), o = e.nodes.find((e) => e.id === r?.target);
				return `<td>${o ? i(o.label ?? o.id) : "—"}</td>`;
			}).join("");
			return `<tr><th scope="row">${n}${i(t.label ?? t.id)}</th>${o}</tr>`;
		}).join("")}</tbody></table></div>`;
	}
	renderToolbarActions() {
		let e = this.invalidSymbol === null ? this.rejected ? "Rejected" : this.inputPosition === this.inputWord.length ? this.accepted ? "Accepted" : "Not accepted" : `${this.inputPosition}/${this.inputWord.length}` : `Invalid symbol: ${i(this.invalidSymbol)}`, t = this.invalidSymbol !== null || this.rejected || this.inputPosition === this.inputWord.length && !this.accepted ? " danger" : this.accepted ? " success" : "", n = this.running || this.rejected || this.inputPosition >= this.inputWord.length;
		return `<tp-icon-button name="refresh" label="Reset word" data-dfa-action="reset"></tp-icon-button>
      <label class="tp-dfa-word-label">Word <input type="text" value="${i(this.inputWord)}" data-dfa-word aria-label="Input word" ${this.running ? "disabled" : ""}/></label>
      <tp-icon-button name="play" label="Read next symbol" data-dfa-action="step" ${n ? "disabled" : ""}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run word" data-dfa-action="run" ${n ? "disabled" : ""}></tp-icon-button>
      <span class="tp-dfa-status${t}" aria-live="polite">${e}</span>`;
	}
	bindExtensionEvents() {
		this.querySelector("[data-dfa-word]")?.addEventListener("change", (e) => {
			this.reset(e.currentTarget.value);
		}), this.querySelector("[data-dfa-action=\"step\"]")?.addEventListener("click", () => {
			this.readNext();
		}), this.querySelector("[data-dfa-action=\"run\"]")?.addEventListener("click", () => {
			this.run();
		}), this.querySelector("[data-dfa-action=\"reset\"]")?.addEventListener("click", () => this.reset());
	}
	syncRuntimeFromGraph() {
		let e = this.value.nodes.find((e) => e.type === "dfa-state" && e.state?.active === !0);
		this.activeStateId = e?.id ?? this.value.nodes.find((e) => e.type === "dfa-state" && e.data?.initial === !0)?.id ?? null;
	}
};
customElements.get("tp-graph-dfa") || customElements.define("tp-graph-dfa", l);
//#endregion
export { s as a, c as i, r as n, l as r, n as t };

//# sourceMappingURL=graph-dfa.js.map