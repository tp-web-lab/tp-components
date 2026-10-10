import { Ku as e, Pr as t } from "./lib/typescript/typescript.js";
import "./checkbox-list.js";
import { LogigramModel as n, readLogigramLists as r } from "../components/logigram/logigram-model.js";
//#region src/components/logigram/logigram.css?inline
var i = "tp-logigram{color:var(--tp-text-body);border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md,.5rem);background:var(--tp-paper-color);padding:1rem;display:flow-root}tp-logigram .tp-logigram-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;display:flex}tp-logigram .tp-logigram-title{margin:0;font-size:1.25rem;font-weight:700}tp-logigram .tp-logigram-puzzle-title{font-weight:600}tp-logigram .tp-logigram-controls{flex-wrap:nowrap;align-items:center;gap:.5rem;max-inline-size:100%;display:flex;overflow-x:auto}tp-logigram .tp-logigram-controls>*{flex:none}tp-logigram .tp-logigram-grids{max-inline-size:100%;padding:.25rem;overflow-x:auto}tp-logigram .tp-logigram-matrix{border-collapse:collapse;border:0;inline-size:auto;max-inline-size:none;margin:0;display:table}tp-logigram .tp-logigram-matrix :is(th,td){box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-mid);text-align:center;background:0 0;padding:0}tp-logigram .tp-logigram-matrix th{font-weight:600}tp-logigram .tp-logigram-matrix .tp-logigram-empty{background:0 0;border:0}tp-logigram .tp-logigram-matrix .tp-logigram-category{border:2px solid var(--tp-neutral-stroke-mid);background:var(--tp-neutral-fill-soft);padding:.4rem}tp-logigram .tp-logigram-column{vertical-align:bottom;block-size:7rem}tp-logigram .tp-logigram-column span{writing-mode:vertical-rl;padding:.5rem .25rem;display:inline-block;transform:rotate(180deg)}tp-logigram .tp-logigram-row-category{inline-size:2rem;background:var(--tp-neutral-fill-soft)!important}tp-logigram .tp-logigram-row-category span{writing-mode:vertical-rl;padding:.5rem .25rem;display:inline-block;transform:rotate(180deg)}tp-logigram .tp-logigram-matrix .tp-logigram-row-label{text-align:start;overflow-wrap:anywhere;min-inline-size:6rem;max-inline-size:12rem;padding:.25rem .5rem}tp-logigram .tp-logigram-matrix .tp-logigram-group-start{border-inline-start-width:2px}tp-logigram .tp-logigram-matrix tbody tr:first-child>*{border-block-start-width:2px}tp-logigram .tp-logigram-matrix tbody tr:last-child>*{border-block-end-width:2px}tp-logigram .tp-logigram-matrix tbody tr>:last-child{border-inline-end-width:2px}tp-logigram .tp-logigram-matrix button{block-size:2.5rem;inline-size:2.5rem;color:inherit;cursor:pointer;background:0 0;border:0;border-radius:0;margin:0;padding:0;font:700 1.25rem system-ui;display:block}tp-logigram .tp-logigram-matrix button:hover{background:var(--tp-neutral-fill-soft)}tp-logigram .tp-logigram-matrix button[data-mark=\"1\"]{color:var(--tp-brand-text-colorful);background:var(--tp-brand-fill-soft)}tp-logigram .tp-logigram-matrix button[aria-invalid=true]{outline:2px solid var(--tp-danger-stroke-mid);outline-offset:-2px;color:var(--tp-danger-text-colorful)}tp-logigram .tp-logigram-matrix button:focus-visible{outline:3px solid var(--tp-focus-color,var(--tp-brand-stroke-mid));outline-offset:-3px}tp-logigram .tp-logigram-matrix button:disabled{opacity:.5;cursor:default}tp-logigram [data-success=true]{color:var(--tp-success-text-colorful);font-weight:600}tp-logigram .tp-logigram-assist{inline-size:auto;min-inline-size:0;max-inline-size:100%;font:inherit}tp-logigram .tp-logigram-matrix button[data-selected]{box-shadow:inset 0 0 0 3px var(--tp-brand-stroke-mid)}tp-logigram .tp-logigram-selection-hint{margin-block:.5rem 1rem;font-size:.875rem}", a = class extends e {
	model = null;
	original = null;
	revision = 0;
	request = null;
	timer;
	observer = new MutationObserver(() => this.schedule());
	cells = [];
	status = null;
	checked = !1;
	selectedCell;
	selectedButton;
	assistSelect = null;
	selectionHint = null;
	static get observedAttributes() {
		return [
			"label",
			"src",
			"auto-exclude",
			"disabled"
		];
	}
	get label() {
		return this.getAttribute("label") ?? "Logigram";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get autoExclude() {
		return this.hasAttribute("auto-exclude");
	}
	set autoExclude(e) {
		this.toggleAttribute("auto-exclude", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	get value() {
		return this.model?.value ?? [];
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-logigram-styles", i), this.model) {
			this.update();
			return;
		}
		this.observer.observe(this, {
			childList: !0,
			subtree: !0
		}), this.schedule();
	}
	disconnectedCallback() {
		this.revision++, clearTimeout(this.timer), this.request?.abort(), this.observer.disconnect();
	}
	attributeChangedCallback(e) {
		if (this.isConnected) if (e === "src") this.model = null, this.schedule();
		else if (e === "label") {
			let e = this.querySelector(".tp-logigram-puzzle-title");
			e && (e.textContent = this.label, e.hidden = !this.label || this.label === "Logigram");
		} else this.update();
	}
	schedule() {
		clearTimeout(this.timer), this.revision++, this.request?.abort(), this.timer = setTimeout(() => void this.load(), 0);
	}
	async load() {
		let e = ++this.revision;
		this.request = new AbortController(), this.observer.disconnect(), this.original ??= this.innerHTML, this.setAttribute("aria-busy", "true");
		try {
			let i = this.original;
			if (this.src) {
				let e = await fetch(t(this, this.src), { signal: this.request.signal });
				if (!e.ok) throw Error(`Unable to load puzzle (${e.status}).`);
				let n = await e.text(), { renderMarkdownToHtml: r } = await import("../components/markdown/markdown.js");
				i = await r(n);
			}
			if (e !== this.revision || !this.isConnected) return;
			let a = document.createElement("template");
			a.innerHTML = i, this.model = new n(r(a.content, this.label)), this.checked = !1, this.render();
		} catch (t) {
			if (e !== this.revision || !this.isConnected) return;
			this.model = null;
			let n = document.createElement("p");
			n.setAttribute("role", "alert"), n.textContent = t instanceof Error ? t.message : String(t), this.replaceChildren(n);
		} finally {
			e === this.revision && this.removeAttribute("aria-busy");
		}
	}
	move(e, t) {
		this.disabled || !this.model || (this.model.set(e, t, this.autoExclude), this.changed());
	}
	changed() {
		this.checked = !1, this.update(), this.dispatchEvent(new CustomEvent("tp-logigram-change", {
			bubbles: !0,
			detail: { value: this.value }
		}));
	}
	reset() {
		this.disabled || !this.model || (this.model.reset(), this.changed());
	}
	undo() {
		this.disabled || !this.model || (this.model.undo(), this.changed());
	}
	redo() {
		this.disabled || !this.model || (this.model.redo(), this.changed());
	}
	check() {
		if (this.disabled || !this.model) return null;
		this.checked = !0, this.update();
		let e = this.model.check();
		return this.dispatchEvent(new CustomEvent("tp-logigram-check", {
			bubbles: !0,
			detail: e
		})), e;
	}
	render() {
		let e = this.model;
		if (!e) return;
		this.replaceChildren(), this.cells = [], this.selectedCell = void 0, this.selectedButton = void 0;
		let t = document.createElement("h3");
		t.className = "tp-logigram-title", t.textContent = "Logigram";
		let n = document.createElement("div");
		n.className = "tp-logigram-header";
		let r = document.createElement("p");
		r.className = "tp-logigram-puzzle-title", r.textContent = this.label, r.hidden = !this.label || this.label === "Logigram";
		let i = document.createElement("p");
		i.textContent = e.puzzle.description ?? "";
		let a = document.createElement("p");
		a.textContent = "Match each item with exactly one item in every other category. Click a cell: unknown → no (×) → yes (✓).";
		let o = document.createElement("tp-checkbox-list");
		o.setAttribute("label", "Clues"), o.setAttribute("label-position", "top");
		let s = document.createElement("ul");
		for (let t of e.puzzle.clues) {
			let e = document.createElement("li");
			e.textContent = t, s.append(e);
		}
		o.append(s);
		let c = document.createElement("div");
		c.className = "tp-logigram-controls";
		for (let [e, t, n] of [[
			"undo",
			"Undo",
			() => this.undo()
		], [
			"redo",
			"Redo",
			() => this.redo()
		]]) {
			let r = document.createElement("tp-button");
			r.textContent = t, r.setAttribute("type", "button"), r.dataset.action = e, r.addEventListener("click", n), c.append(r);
		}
		let l = document.createElement("select");
		l.className = "tp-logigram-assist", l.setAttribute("aria-label", "Assistance actions");
		for (let [e, t] of [
			["", "Assist…"],
			["reset-game", "Reset the game"],
			["show-incorrect", "Show all incorrect boxes"],
			["clear-incorrect", "Clear the incorrect boxes"],
			["show-cell", "Show the box"],
			["show-block", "Show the category pair"],
			["show-solution", "Show the solution"]
		]) {
			let n = document.createElement("option");
			n.value = e ?? "", n.textContent = t ?? "", l.append(n);
		}
		l.addEventListener("change", () => {
			let e = l.value;
			l.value = "", !(this.disabled || !this.model) && (e === "reset-game" ? this.reset() : e === "show-incorrect" ? this.check() : (e === "clear-incorrect" || e === "show-cell" || e === "show-block" || e === "show-solution") && (this.model.assist(e, this.selectedCell), this.changed(), e === "show-solution" && this.check()));
		}), this.assistSelect = l, c.append(l), this.selectionHint = document.createElement("p"), this.selectionHint.className = "tp-logigram-selection-hint", this.selectionHint.setAttribute("role", "status"), this.status = document.createElement("p"), this.status.setAttribute("role", "status"), this.status.setAttribute("aria-live", "polite");
		let u = document.createElement("div");
		u.className = "tp-logigram-grids";
		let d = e.puzzle.categories, f = d[0]?.items.length ?? 0, p = document.createElement("table");
		p.className = "tp-logigram-matrix", p.setAttribute("aria-label", "Category matching grid");
		let m = p.createTHead(), h = m.insertRow(), g = document.createElement("td");
		g.colSpan = 2, g.rowSpan = 2, g.className = "tp-logigram-empty", h.append(g);
		for (let e of d.slice(1)) {
			let t = document.createElement("th");
			t.scope = "colgroup", t.colSpan = f, t.textContent = e.name, t.className = "tp-logigram-category", h.append(t);
		}
		let _ = m.insertRow();
		for (let e of d.slice(1)) for (let [t, n] of e.items.entries()) {
			let e = document.createElement("th");
			e.scope = "col", e.className = `tp-logigram-column${t === 0 ? " tp-logigram-group-start" : ""}`;
			let r = document.createElement("span");
			r.textContent = n, e.append(r), _.append(e);
		}
		let v = [0, ...d.map((e, t) => t).slice(2).reverse()];
		for (let t of v) {
			let n = d[t];
			if (!n) continue;
			let r = p.createTBody();
			for (let [i, a] of n.items.entries()) {
				let o = r.insertRow();
				if (i === 0) {
					let e = document.createElement("th");
					e.scope = "rowgroup", e.rowSpan = f, e.className = "tp-logigram-row-category";
					let t = document.createElement("span");
					t.textContent = n.name, e.append(t), o.append(e);
				}
				let s = document.createElement("th");
				s.scope = "row", s.textContent = a, s.className = "tp-logigram-row-label", o.append(s);
				for (let n = 1; n < d.length && !(t !== 0 && n >= t); n++) for (let r = 0; r < f; r++) {
					let a = t > n, s = e.cells.findIndex((e) => e.a === Math.min(t, n) && e.b === Math.max(t, n) && e.row === (a ? r : i) && e.col === (a ? i : r)), c = o.insertCell();
					r === 0 && c.classList.add("tp-logigram-group-start");
					let l = this.createCell(s, a);
					this.cells[s] = l, c.append(l);
				}
			}
		}
		u.append(p), n.append(t, c), this.append(n, this.selectionHint, r, i, a, o, this.status, u), this.update();
	}
	createCell(e, t) {
		let n = this.model, r = n?.cells[e];
		if (!n || !r) throw Error("Missing grid cell.");
		let i = n.puzzle.categories[r.a], a = n.puzzle.categories[r.b], o = document.createElement("button");
		return o.type = "button", o.dataset.label = `${i?.name}: ${i?.items[r.row]}; ${a?.name}: ${a?.items[r.col]}`, o.dataset.cell = String(e), o.addEventListener("focus", () => {
			this.selectedCell = e, this.updateAssistance();
		}), o.addEventListener("pointerdown", () => {
			this.selectedCell = e, this.updateAssistance();
		}), o.addEventListener("click", (t) => {
			this.selectedCell = e, this.updateAssistance();
			let n = this.model?.value[e] ?? 0;
			this.move(e, t.ctrlKey || t.metaKey ? 0 : n === 0 ? -1 : +(n === -1));
		}), o.addEventListener("contextmenu", (t) => {
			t.preventDefault(), this.move(e, 1);
		}), o.addEventListener("keydown", (i) => {
			if (i.key === "Delete" || i.key === "Backspace") {
				i.preventDefault(), this.move(e, 0);
				return;
			}
			let a = i.key === "ArrowRight" ? 1 : i.key === "ArrowLeft" ? -1 : 0, o = i.key === "ArrowDown" ? 1 : i.key === "ArrowUp" ? -1 : 0;
			if (!a && !o) return;
			i.preventDefault();
			let s = r.row + (t ? a : o), c = r.col + (t ? o : a), l = n.cells.findIndex((e) => e.a === r.a && e.b === r.b && e.row === s && e.col === c);
			this.cells[l]?.focus();
		}), o;
	}
	updateAssistance() {
		if (!this.assistSelect) return;
		this.assistSelect.disabled = this.disabled;
		let e = this.selectedCell === void 0 ? void 0 : this.cells[this.selectedCell];
		this.selectedButton?.removeAttribute("data-selected"), e?.setAttribute("data-selected", ""), this.selectedButton = e, this.selectionHint && (this.selectionHint.textContent = e ? `Selected box: ${e.dataset.label}. Use Assist… → Show the box or Show the category pair.` : "Click a grid box or focus it with Tab to enable Assist… → Show the box and Show the category pair.");
		for (let e of this.assistSelect.options) e.disabled = (e.value === "show-cell" || e.value === "show-block") && this.selectedCell === void 0;
	}
	update() {
		let e = this.model;
		if (!e) return;
		this.updateAssistance();
		let t = e.value, n = e.check();
		this.cells.forEach((e, r) => {
			let i = t[r] ?? 0;
			e.textContent = i === 1 ? "✓" : i === -1 ? "×" : "·", e.dataset.mark = String(i), e.disabled = this.disabled, e.setAttribute("aria-label", `${e.dataset.label}: ${i === 1 ? "yes" : i === -1 ? "no" : "unknown"}`), e.setAttribute("aria-invalid", String(this.checked && n.errors.includes(r)));
		});
		for (let t of this.querySelectorAll("tp-button[data-action], tp-checkbox-list")) {
			let n = t.dataset.action;
			t.toggleAttribute("disabled", this.disabled || n === "undo" && !e.canUndo || n === "redo" && !e.canRedo);
		}
		this.status && (this.status.textContent = this.checked ? n.complete ? "Solved!" : `${n.correct} / ${n.total} correct matches; ${n.errors.length} incorrect marks. Keep using the clues.` : `${t.filter((e) => e === 1).length} / ${n.total} matches marked.`, this.status.dataset.success = String(this.checked && n.complete));
	}
};
customElements.get("tp-logigram") || customElements.define("tp-logigram", a);
//#endregion
export { a as t };

//# sourceMappingURL=logigram.js.map