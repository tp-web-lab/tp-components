import { qu as e } from "./lib/typescript/typescript.js";
import { t } from "./board.js";
//#region ../tp-utilities/dist/games/binary/binary-parser.js
function n(e) {
	let t = e.trim().split("\n").map((e) => e.trim()).filter((e) => e.length > 0);
	if (t.length === 0) throw Error("Binary puzzle cannot be empty");
	if (t.length % 2 != 0) throw Error(`Binary puzzle must have an even size, got ${t.length} rows`);
	let n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e], i = [];
		for (let t = 0; t < r.length; t++) {
			let n = r.charAt(t);
			if (!/\s/.test(n)) {
				if (n === "0" || n === "1") {
					let e = n, a = !1;
					t + 1 < r.length && r.charAt(t + 1) === "!" && (a = !0, t += 1), i.push({
						value: a ? e : "",
						isEditable: !a,
						isInitial: a,
						isError: !1,
						solution: e
					});
					continue;
				}
				throw Error(n === "!" ? `Unexpected '!' at row ${e}, col ${i.length}` : `Invalid character '${n}' at row ${e}, col ${i.length}: expected 0, 1, or '!'`);
			}
		}
		if (i.length !== t.length) throw Error(`Binary puzzle must be square: row ${e} has ${i.length} columns, expected ${t.length}`);
		n.push(i);
	}
	return n;
}
//#endregion
//#region ../tp-utilities/dist/games/binary/binary-rules.js
function r(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) for (let r = 0; r < (e[n]?.length ?? 0); r++) {
		let i = e[n]?.[r];
		!i || i.isInitial || i.solution === void 0 || i.value !== "" && i.value !== i.solution && t.push({
			coord: {
				row: n,
				col: r
			},
			type: "row",
			reason: "count"
		});
	}
	let n = e.flat().every((e) => e.value !== "" && e.solution !== void 0 && e.value === e.solution);
	return {
		isValid: t.length === 0,
		isComplete: n,
		conflicts: t
	};
}
//#endregion
//#region ../tp-utilities/dist/games/binary/binary-engine.js
var i = class {
	board = null;
	gridElement = null;
	onChange;
	activeCell = null;
	revealIncorrect = !1;
	initialPuzzle = "";
	suppressRestoreFocusOnce = !1;
	constructor(e = {}) {
		this.onChange = e.onChange;
	}
	initialize(e) {
		let r = n(e);
		this.board = new t({
			rows: r.length,
			cols: r[0]?.length ?? 0
		}, r), this.initialPuzzle = e, this.revealIncorrect = !1, this.activeCell = null;
	}
	renderGrid(e) {
		let t = this.getBinaryCells(), n = this.board?.getDimensions();
		if (!t || !n) throw Error("Engine not initialized. Call initialize() first.");
		this.gridElement = e, e.innerHTML = "", e.className = "tp-binary-grid", e.style.gridTemplateColumns = `repeat(${n.cols}, minmax(0, 1fr))`;
		let r = this.getValidation(), i = new Set(r.conflicts.map(({ coord: e }) => `${e.row}:${e.col}`));
		for (let r = 0; r < n.rows; r++) for (let a = 0; a < n.cols; a++) {
			let n = t[r]?.[a];
			if (!n) continue;
			let o = document.createElement("div");
			o.className = "tp-binary-cell", n.isInitial && o.classList.add("initial"), this.revealIncorrect && i.has(`${r}:${a}`) && o.classList.add("incorrect"), this.isHighlightedCell(r, a) && o.classList.add("current-line"), this.activeCell?.row === r && this.activeCell?.col === a && o.classList.add("current-cell");
			let s = document.createElement("input");
			s.type = "text", s.className = "tp-binary-input", s.value = n.value, s.maxLength = 1, s.inputMode = "numeric", s.readOnly = n.isInitial, s.dataset.row = String(r), s.dataset.col = String(a), s.setAttribute("aria-label", `Binary cell ${r + 1},${a + 1}`), s.addEventListener("click", () => {
				this.setActiveCell(r, a);
			}), s.addEventListener("focus", () => {
				this.setActiveCell(r, a), !n.isInitial && s.value !== "" && requestAnimationFrame(() => s.select());
			}), n.isInitial || s.addEventListener("input", (e) => {
				let t = e.target, n = t.value.trim();
				n &&= n.charAt(n.length - 1), n && !/^[01]$/.test(n) && (t.value = "", n = ""), this.revealIncorrect && this.hideIncorrectCells(), this.setCell(r, a, n);
			}), o.appendChild(s), e.appendChild(o);
		}
		this.attachKeyboardNavigation(e), this.restoreActiveCellFocus();
	}
	getValidation() {
		let e = this.getBinaryCells();
		return e ? r(e) : {
			isValid: !0,
			isComplete: !1,
			conflicts: []
		};
	}
	countEmptyCells() {
		let e = this.getBinaryCells();
		return e ? e.flat().filter((e) => e.value === "").length : 0;
	}
	countIncorrectCells() {
		return this.getValidation().conflicts.length;
	}
	isShowingIncorrectCells() {
		return this.revealIncorrect;
	}
	canUndo() {
		return this.board?.canUndo() ?? !1;
	}
	canRedo() {
		return this.board?.canRedo() ?? !1;
	}
	getActiveCell() {
		return this.activeCell ? { ...this.activeCell } : null;
	}
	setActiveCell(e, t, n = !1) {
		this.revealIncorrect && this.hideIncorrectCells();
		let r = this.activeCell;
		this.activeCell = {
			row: e,
			col: t
		}, this.refreshActiveHighlights(), (!r || r.row !== e || r.col !== t) && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), n && this.focusCell(e, t);
	}
	setCell(e, t, n, r = null) {
		this.board && (this.revealIncorrect && this.hideIncorrectCells(), this.activeCell = r ?? {
			row: e,
			col: t
		}, this.board.setCell({
			row: e,
			col: t
		}, n), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "input",
			row: e,
			col: t
		}));
	}
	undo() {
		this.board?.canUndo() && (this.board.undo(), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "undo",
			row: -1,
			col: -1
		}));
	}
	redo() {
		this.board?.canRedo() && (this.board.redo(), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "redo",
			row: -1,
			col: -1
		}));
	}
	showIncorrectCells() {
		return this.revealIncorrect = !0, this.suppressRestoreFocusOnce = !0, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), this.countIncorrectCells() > 0;
	}
	clearIncorrectCells() {
		if (!this.board) return !1;
		let e = this.getIncorrectCoords().map(({ row: e, col: t }) => ({
			coord: {
				row: e,
				col: t
			},
			value: ""
		}));
		if (e.length === 0) return !1;
		let t = this.board.setCells(e, "clear incorrect cells");
		return this.revealIncorrect = !1, t && this.gridElement && this.renderGrid(this.gridElement), t && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), t;
	}
	resetGame() {
		if (this.initialPuzzle === "") return !1;
		let e = n(this.initialPuzzle);
		return this.board = new t({
			rows: e.length,
			cols: e[0]?.length ?? 0
		}, e), this.revealIncorrect = !1, this.activeCell = null, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), !0;
	}
	showCell(e, t) {
		if (!this.board) return !1;
		let n = this.activeCell, r = n?.row ?? e, i = n?.col ?? t, a = this.getBinaryCells()?.[r]?.[i], o = a?.solution;
		if (!a || a.isInitial || typeof o != "string") return !1;
		this.revealIncorrect && this.hideIncorrectCells();
		let s = this.board.setCell({
			row: r,
			col: i
		}, o, "show box");
		return this.activeCell = {
			row: r,
			col: i
		}, s && this.gridElement && this.renderGrid(this.gridElement), s && this.onChange?.({
			kind: "assist",
			row: r,
			col: i
		}), s;
	}
	showSolution() {
		if (!this.board) return !1;
		let e = this.getBinaryCells();
		if (!e) return !1;
		let t = [];
		for (let n = 0; n < e.length; n++) for (let r = 0; r < (e[0]?.length ?? 0); r++) {
			let i = e[n]?.[r], a = i?.solution;
			!i || i.isInitial || i.value === a || typeof a != "string" || t.push({
				coord: {
					row: n,
					col: r
				},
				value: a
			});
		}
		if (t.length === 0) return !1;
		this.revealIncorrect && this.hideIncorrectCells();
		let n = this.board.setCells(t, "show solution");
		return n && this.gridElement && this.renderGrid(this.gridElement), n && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), n;
	}
	hideIncorrectCells() {
		this.revealIncorrect = !1, this.gridElement && this.renderGrid(this.gridElement);
	}
	getBinaryCells() {
		let e = this.board?.getState();
		return e ? e.cells : null;
	}
	getIncorrectCoords() {
		let e = this.getBinaryCells();
		return e ? this.getValidation().conflicts.map(({ coord: e }) => e).filter(({ row: t, col: n }) => !e[t]?.[n]?.isInitial) : [];
	}
	attachKeyboardNavigation(e) {
		e.dataset.binaryNavAttached !== "true" && (e.dataset.binaryNavAttached = "true", e.addEventListener("keydown", (e) => {
			if (!(e.target instanceof HTMLInputElement)) return;
			let t = Number.parseInt(e.target.dataset.row ?? "0", 10), n = Number.parseInt(e.target.dataset.col ?? "0", 10);
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault(), this.revealIncorrect && this.hideIncorrectCells(), this.moveByDirection(t, n, -1, 0);
					return;
				case "ArrowDown":
					e.preventDefault(), this.revealIncorrect && this.hideIncorrectCells(), this.moveByDirection(t, n, 1, 0);
					return;
				case "ArrowLeft":
					e.preventDefault(), this.revealIncorrect && this.hideIncorrectCells(), this.moveByDirection(t, n, 0, -1);
					return;
				case "ArrowRight":
					e.preventDefault(), this.revealIncorrect && this.hideIncorrectCells(), this.moveByDirection(t, n, 0, 1);
					return;
				case "Delete":
					e.preventDefault(), e.target.readOnly || (this.setCell(t, n, "", {
						row: t,
						col: n
					}), this.setActiveCell(t, n, !0));
					return;
				case "Backspace": {
					if (e.preventDefault(), e.target.value !== "") {
						let e = this.findNextEditableCell(t, n, 0, -1);
						this.setCell(t, n, "", e), e && this.focusCell(e.row, e.col);
						return;
					}
					let r = this.findNextEditableCell(t, n, 0, -1);
					if (!r) return;
					this.setCell(r.row, r.col, ""), this.focusCell(r.row, r.col);
					return;
				}
				default: return;
			}
		}));
	}
	moveByDirection(e, t, n, r) {
		let i = this.findNextEditableCell(e, t, n, r);
		i && this.setActiveCell(i.row, i.col, !0);
	}
	findNextEditableCell(e, t, n, r) {
		let i = this.getBinaryCells(), a = this.board?.getDimensions();
		if (!i || !a) return null;
		let o = e, s = t;
		for (let e = 1; e < Math.max(a.rows, a.cols); e++) {
			o = (o + n + a.rows) % a.rows, s = (s + r + a.cols) % a.cols;
			let e = i[o]?.[s];
			if (e && !e.isInitial) return {
				row: o,
				col: s
			};
		}
		return null;
	}
	focusCell(e, t) {
		if (!this.gridElement) return;
		let n = this.gridElement.querySelector(`input[data-row="${e}"][data-col="${t}"]`);
		n && requestAnimationFrame(() => n.focus());
	}
	refreshActiveHighlights() {
		if (!this.gridElement) return;
		let e = this.gridElement.querySelectorAll(".tp-binary-cell");
		for (let t of e) t.classList.remove("current-line", "current-cell");
		if (!this.activeCell) return;
		for (let e of this.getHighlightedCells()) {
			let t = this.gridElement.querySelector(`input[data-row="${e.row}"][data-col="${e.col}"]`)?.closest(".tp-binary-cell");
			t && t.classList.add("current-line");
		}
		let t = this.gridElement.querySelector(`input[data-row="${this.activeCell.row}"][data-col="${this.activeCell.col}"]`)?.closest(".tp-binary-cell");
		t && t.classList.add("current-cell");
	}
	isHighlightedCell(e, t) {
		return this.getHighlightedCells().some((n) => n.row === e && n.col === t);
	}
	getHighlightedCells() {
		let e = this.activeCell, t = this.board?.getDimensions();
		if (!e || !t) return [];
		let n = [], r = /* @__PURE__ */ new Set();
		for (let i = 0; i < t.rows; i++) {
			let t = `${i}:${e.col}`;
			r.has(t) || (n.push({
				row: i,
				col: e.col
			}), r.add(t));
		}
		for (let i = 0; i < t.cols; i++) {
			let t = `${e.row}:${i}`;
			r.has(t) || (n.push({
				row: e.row,
				col: i
			}), r.add(t));
		}
		return n;
	}
	restoreActiveCellFocus() {
		if (this.suppressRestoreFocusOnce) {
			this.suppressRestoreFocusOnce = !1;
			return;
		}
		!this.gridElement || !this.activeCell || this.focusCell(this.activeCell.row, this.activeCell.col);
	}
}, a = ".tp-binary{--tp-game-cell-size:3rem;--tp-game-symbol-font-size:1.5rem;--tp-game-symbol-font-weight:800;box-sizing:border-box;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;max-width:600px;margin:1rem 0;padding:1rem;font-family:system-ui,-apple-system,sans-serif;display:flow-root}.tp-binary *,.tp-binary :before,.tp-binary :after{box-sizing:border-box}.tp-binary-container{flex-direction:column;gap:1rem;display:flex}.tp-binary-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;display:flex}.tp-binary-title{color:#333;font-size:1.25rem;font-weight:700}.tp-binary-controls{flex-wrap:nowrap;align-items:center;gap:.5rem;display:flex}.tp-binary button{appearance:none;color:#fff;cursor:pointer;height:2.25rem;font:inherit;box-sizing:border-box;background:#0b63ce;border:0;border-radius:4px;padding:0 .9rem;transition:background .2s}.tp-binary button:hover:not(:disabled){background:#0056b3}.tp-binary button:disabled{cursor:not-allowed;background:#ccc}.tp-binary select{color:#223;max-width:none;height:2.25rem;font:inherit;box-sizing:border-box;background:#fff;border:1px solid #c7d2e0;border-radius:4px;padding:0 .7rem}.tp-binary-grid{background:#333;border:2px solid #333;gap:1px;width:max-content;max-width:100%;margin-inline:auto;padding:2px;display:grid;overflow:auto}.tp-binary-cell{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);min-width:var(--tp-game-cell-size);min-height:var(--tp-game-cell-size);background:#fff;justify-content:stretch;align-items:stretch;display:flex}.tp-binary-cell.initial .tp-binary-input{color:#1d4f91;background:#dbe7ff;font-weight:800}.tp-binary-cell.current-line .tp-binary-input{background:#e6f0ff}.tp-binary-cell.initial.current-line .tp-binary-input{background:#cfe0ff}.tp-binary-cell.incorrect .tp-binary-input{color:#c62828;background:#ffebee}.tp-binary-cell.current-cell{box-shadow:inset 0 0 0 2px #0b63ce}.tp-binary-input{text-align:center;text-transform:uppercase;width:100%;height:100%;font:var(--tp-game-symbol-font-weight) var(--tp-game-symbol-font-size)/1 system-ui, -apple-system, sans-serif;color:#1f2937;background:0 0;border:none;outline:none;padding:0}.tp-binary-input:focus-visible{outline:var(--tp-focus-ring,2px solid #0b63ce);outline-offset:-2px}.tp-binary-status{text-align:center;border-radius:4px;min-height:1.5rem;padding:.75rem;font-weight:500}.tp-binary-status.success{color:#155724;background:#d4edda;border:1px solid #c3e6cb}.tp-binary-status.error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb}.tp-binary-status.info{color:#0c5460;background:#d1ecf1;border:1px solid #bee5eb}.tp-binary-error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;padding:1rem}@media (prefers-reduced-motion:reduce){tp-binary,tp-binary *{transition-duration:.01ms!important;transition-delay:0s!important}}", o = class t extends e {
	static styleId = "tp-binary-styles";
	engine = null;
	gridElement = null;
	statusElement = null;
	undoButton = null;
	redoButton = null;
	assistSelect = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.styleId, a), this.classList.add("tp-binary");
		let e = this.getAttribute("puzzle") ?? this.dataset.binaryPuzzle ?? this.parsePuzzleFromLists();
		if (!e) {
			this.renderError("Empty binary puzzle");
			return;
		}
		try {
			this.engine = new i({ onChange: () => this.updateStatus() }), this.engine.initialize(e), this.render();
		} catch (e) {
			this.renderError(e instanceof Error ? e.message : String(e));
		}
	}
	parsePuzzleFromLists() {
		let e = Array.from(this.children).find((e) => {
			let t = e.tagName.toLowerCase();
			return t === "ol" || t === "ul";
		});
		if (!e) return;
		let t = Array.from(e.children).filter((e) => e.tagName === "LI").map((e) => e.textContent?.trim() ?? "").filter((e) => e.length > 0);
		if (t.length !== 0) return t.join("\n");
	}
	render() {
		this.innerHTML = "\n      <div class=\"tp-binary-container\">\n        <div class=\"tp-binary-header\">\n          <div class=\"tp-binary-title\">Binary</div>\n          <div class=\"tp-binary-controls\">\n            <button class=\"tp-binary-undo\" disabled>Undo</button>\n            <button class=\"tp-binary-redo\" disabled>Redo</button>\n            <select class=\"tp-binary-assist\" aria-label=\"Assistance actions\">\n              <option value=\"\">Assist…</option>\n              <option value=\"reset-game\">Reset the game</option>\n              <option value=\"show-incorrect\">Show all incorrect boxes</option>\n              <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n              <option value=\"show-cell\">Show the box</option>\n              <option value=\"show-solution\">Show the solution</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"tp-binary-grid\"></div>\n        <div class=\"tp-binary-status\"></div>\n      </div>\n    ", this.gridElement = this.querySelector(".tp-binary-grid"), this.statusElement = this.querySelector(".tp-binary-status"), this.undoButton = this.querySelector(".tp-binary-undo"), this.redoButton = this.querySelector(".tp-binary-redo"), this.assistSelect = this.querySelector(".tp-binary-assist"), !(!this.engine || !this.gridElement) && (this.engine.renderGrid(this.gridElement), this.attachEventListeners(), this.updateStatus());
	}
	attachEventListeners() {
		if (!(!this.undoButton || !this.redoButton || !this.assistSelect || !this.gridElement)) {
			this.undoButton.addEventListener("click", () => {
				this.engine?.undo(), this.updateStatus();
			}), this.redoButton.addEventListener("click", () => {
				this.engine?.redo(), this.updateStatus();
			}), this.assistSelect.addEventListener("change", () => {
				if (!(!this.engine || !this.assistSelect)) {
					switch (this.assistSelect.value) {
						case "reset-game":
							this.engine.resetGame();
							break;
						case "show-incorrect":
							this.engine.showIncorrectCells();
							break;
						case "clear-incorrect":
							this.engine.clearIncorrectCells();
							break;
						case "show-cell":
							if (this.engine?.getActiveCell()) {
								let e = this.engine.getActiveCell();
								e && this.engine.showCell(e.row, e.col);
							}
							break;
						case "show-solution":
							this.engine.showSolution();
							break;
						default: break;
					}
					this.assistSelect.value = "", this.updateStatus();
				}
			});
			for (let e of [this.undoButton, this.redoButton]) e.addEventListener("mousedown", (e) => {
				e.preventDefault();
			});
		}
	}
	updateStatus() {
		if (!this.statusElement || !this.engine || !this.undoButton || !this.redoButton) return;
		let e = this.engine.getValidation();
		if (this.undoButton.disabled = !this.engine.canUndo(), this.redoButton.disabled = !this.engine.canRedo(), this.statusElement.className = "tp-binary-status", e.isComplete) this.statusElement.textContent = "✓ Solved!", this.statusElement.classList.add("success");
		else {
			let e = this.engine.countIncorrectCells(), t = this.engine.countEmptyCells();
			this.engine.isShowingIncorrectCells() && e > 0 ? this.statusElement.textContent = `${e} incorrect box${e === 1 ? "" : "es"} shown` : this.statusElement.textContent = `${t} empty cell${t === 1 ? "" : "s"}`, this.statusElement.classList.add("info");
		}
	}
	renderError(e) {
		this.innerHTML = `<div class="tp-binary-error">Error: ${e}</div>`;
	}
};
customElements.get("tp-binary") || customElements.define("tp-binary", o);
//#endregion
export { o as t };

//# sourceMappingURL=binary.js.map