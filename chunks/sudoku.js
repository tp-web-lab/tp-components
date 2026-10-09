import { Ku as e } from "./lib/typescript/typescript.js";
import { t } from "./board.js";
//#region ../../../../../../@tp/tp-utilities/dist/games/sudoku/sudoku-parser.js
function n(e) {
	let t = e.trim().split("\n").filter((e) => e.trim().length > 0);
	if (t.length !== 9) throw Error(`Sudoku must have exactly 9 rows, got ${t.length}`);
	let n = [];
	for (let e = 0; e < 9; e++) {
		let r = t[e];
		if (!r) throw Error(`Missing row ${e}`);
		let i = [], a = 0;
		for (let t = 0; t < r.length && a < 9; t++) {
			let n = r.charAt(t);
			if (/\s/.test(n)) continue;
			let o = !1, s = "", c;
			if (n === ".") s = "";
			else if (/[1-9]/.test(n)) c = n, t + 1 < r.length && r[t + 1] === "!" ? (o = !0, s = c, t += 1) : s = "";
			else if (n === "!") throw Error(`Unexpected '!' at row ${e}, col ${a}: must follow a digit`);
			else throw Error(`Invalid character '${n}' at row ${e}, col ${a}: expected digit, '.', or '!'`);
			i.push({
				value: s,
				isEditable: !o,
				isInitial: o,
				solution: c,
				isError: !1,
				notes: []
			}), a += 1;
		}
		if (i.length !== 9) throw Error(`Row ${e} has ${i.length} columns, expected 9`);
		n.push(i);
	}
	return n;
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/games/sudoku/sudoku-rules.js
function r(e, t) {
	return Math.floor(e / 3) * 3 + Math.floor(t / 3);
}
function i(e) {
	let t = [], n = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set()), i = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set()), o = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set());
	for (let a = 0; a < 9; a++) for (let s = 0; s < 9; s++) {
		let c = e[a]?.[s];
		if (!c || c.value === "") continue;
		let l = c.value, u = r(a, s), d = {
			row: a,
			col: s
		};
		n[a]?.has(l) ? t.push({
			coord: d,
			type: "row"
		}) : n[a]?.add(l), i[s]?.has(l) ? t.push({
			coord: d,
			type: "col"
		}) : i[s]?.add(l), o[u]?.has(l) ? t.push({
			coord: d,
			type: "box"
		}) : o[u]?.add(l);
	}
	let s = t.length === 0;
	return {
		isValid: s,
		isComplete: s && a(e),
		conflicts: t
	};
}
function a(e) {
	for (let t of e) for (let e of t) if (e.value === "") return !1;
	return !0;
}
function o(e) {
	for (let t of e) for (let e of t) if (e.value === "" || e.solution && e.value !== e.solution) return !1;
	return !0;
}
function s(e, t, n, r) {
	if (!/[1-9]/.test(r) || !e[t]?.[n]) return !1;
	for (let i = 0; i < 9; i++) if (i !== n && e[t]?.[i]?.value === r) return !1;
	for (let i = 0; i < 9; i++) if (i !== t && e[i]?.[n]?.value === r) return !1;
	let i = Math.floor(t / 3) * 3, a = Math.floor(n / 3) * 3;
	for (let o = i; o < i + 3; o++) for (let i = a; i < a + 3; i++) if ((o !== t || i !== n) && e[o]?.[i]?.value === r) return !1;
	return !0;
}
function c(e, t, n) {
	let r = e[t]?.[n];
	if (!r || r.value !== "") return [];
	let i = [];
	for (let r = 1; r <= 9; r++) s(e, t, n, String(r)) && i.push(String(r));
	return i;
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/games/sudoku/sudoku-engine.js
var l = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
], u = class {
	board = null;
	gridElement = null;
	onChange;
	activeCell = null;
	revealIncorrect = !1;
	initialPuzzle = "";
	entryMode = "game";
	constructor(e = {}) {
		this.onChange = e.onChange;
	}
	initialize(e) {
		let r = n(e);
		this.board = new t({
			rows: 9,
			cols: 9
		}, r), this.initialPuzzle = e, this.revealIncorrect = !1, this.activeCell = null, this.entryMode = "game";
	}
	renderGrid(e) {
		if (!this.board) throw Error("Engine not initialized. Call initialize() first.");
		this.gridElement = e, e.innerHTML = "";
		let t = this.getSudokuCells();
		if (!t) throw Error("Engine not initialized. Call initialize() first.");
		for (let n = 0; n < 9; n++) for (let r = 0; r < 9; r++) {
			let i = t[n]?.[r];
			if (!i) continue;
			let a = document.createElement("div");
			a.className = "tp-sudoku-cell", n % 3 == 0 && a.classList.add("box-top"), n % 3 == 2 && a.classList.add("box-bottom"), r % 3 == 0 && a.classList.add("box-left"), r % 3 == 2 && a.classList.add("box-right");
			let o = i.isInitial;
			o && a.classList.add("initial"), this.revealIncorrect && i.value !== "" && typeof i.solution == "string" && i.value !== i.solution && a.classList.add("incorrect"), this.isHighlightedCell(n, r) && a.classList.add("current-line"), this.activeCell?.row === n && this.activeCell?.col === r && a.classList.add("current-cell");
			let s = i.value === "" ? this.getCellNotes(i) : [];
			s.length > 0 && (a.classList.add("has-notes"), a.appendChild(this.createNotesElement(s)));
			let c = document.createElement("input");
			c.type = "text", c.className = "tp-sudoku-input", c.value = i.value, c.maxLength = 1, c.inputMode = "numeric", c.readOnly = o, c.dataset.row = String(n), c.dataset.col = String(r), c.setAttribute("aria-label", `Sudoku cell ${n + 1},${r + 1}`), c.addEventListener("click", () => {
				this.setActiveCell(n, r);
			}), c.addEventListener("focus", () => {
				this.setActiveCell(n, r), !o && c.value !== "" && requestAnimationFrame(() => c.select());
			}), o || c.addEventListener("input", (e) => {
				let t = e.target, i = t.value.trim();
				if (i &&= i.charAt(i.length - 1), i && !/^[1-9]$/.test(i) && (t.value = "", i = ""), this.entryMode === "note" && i !== "") {
					t.value = "", this.toggleNote(n, r, i);
					return;
				}
				this.setCell(n, r, i);
			}), a.appendChild(c), e.appendChild(a);
		}
		this.attachKeyboardNavigation(e), this.restoreActiveCellFocus();
	}
	attachKeyboardNavigation(e) {
		e.dataset.sudokuNavAttached !== "true" && (e.dataset.sudokuNavAttached = "true", e.addEventListener("keydown", (t) => {
			if (!(t.target instanceof HTMLInputElement)) return;
			let n = Number.parseInt(t.target.dataset.row ?? "0", 10), r = Number.parseInt(t.target.dataset.col ?? "0", 10), i = n, a = r, o = 0, s = 0;
			switch (t.key) {
				case "ArrowUp":
					i = (n - 1 + 9) % 9, o = -1, t.preventDefault();
					break;
				case "ArrowDown":
					i = (n + 1) % 9, o = 1, t.preventDefault();
					break;
				case "ArrowLeft":
					a = (r - 1 + 9) % 9, s = -1, t.preventDefault();
					break;
				case "ArrowRight":
					a = (r + 1) % 9, s = 1, t.preventDefault();
					break;
				case "Delete":
				case "Backspace":
					t.preventDefault(), this.entryMode === "note" ? this.clearNotes(n, r) : this.setCell(n, r, "");
					return;
				default: return;
			}
			let c = this.findNextEditableCell(i, a, o, s), l = c?.row ?? i, u = c?.col ?? a, d = e.querySelector(`input[data-row="${l}"][data-col="${u}"]`);
			d && d.focus();
		}));
	}
	setCell(e, t, n) {
		this.board && (this.revealIncorrect &&= !1, this.setActiveCell(e, t), this.board.setCellState({
			row: e,
			col: t
		}, {
			value: n,
			notes: n === "" ? this.getCellNotesAt(e, t) : []
		}), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
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
	getState() {
		return this.board?.getState() ?? null;
	}
	getValidation() {
		let e = this.getSudokuCells();
		if (!e) return i([]);
		let t = i(e);
		return {
			...t,
			isComplete: t.isValid && o(e)
		};
	}
	canUndo() {
		return this.board?.canUndo() ?? !1;
	}
	canRedo() {
		return this.board?.canRedo() ?? !1;
	}
	getEntryMode() {
		return this.entryMode;
	}
	toggleEntryMode() {
		return this.entryMode = this.entryMode === "game" ? "note" : "game", this.onChange?.({
			kind: "assist",
			row: this.activeCell?.row ?? -1,
			col: this.activeCell?.col ?? -1
		}), this.entryMode;
	}
	countEmptyCells() {
		let e = this.getSudokuCells();
		return e ? e.flat().filter((e) => e.value === "").length : 0;
	}
	countIncorrectCells() {
		return this.getIncorrectCoords().length;
	}
	isShowingIncorrectCells() {
		return this.revealIncorrect;
	}
	getHint(e, t) {
		if (!this.board) return null;
		let n = this.getSudokuCells();
		if (!n) return null;
		let r = n[e]?.[t];
		if (!r || r.value !== "" || r.isInitial) return null;
		if (typeof r.solution == "string") return r.solution;
		let i = c(n, e, t);
		return i.length > 0 ? i[0] : null;
	}
	applyHint(e, t) {
		let n = this.getHint(e, t);
		return n ? (this.setCell(e, t, n), !0) : !1;
	}
	showIncorrectCells() {
		return this.revealIncorrect = !0, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
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
			updates: { value: "" }
		}));
		if (e.length === 0) return !1;
		let t = this.board.setCellsState(e, "clear incorrect cells");
		return this.revealIncorrect = !1, this.activeCell = e[0]?.coord ?? this.activeCell, t && this.gridElement && this.renderGrid(this.gridElement), t && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), t;
	}
	showCell(e, t) {
		if (!this.board) return !1;
		let n = this.getSudokuCells()?.[e]?.[t];
		if (!n || n.isInitial || typeof n.solution != "string") return !1;
		this.activeCell = {
			row: e,
			col: t
		};
		let r = this.board.setCellState({
			row: e,
			col: t
		}, {
			value: n.solution,
			notes: []
		}, "show cell");
		return r && this.gridElement && this.renderGrid(this.gridElement), r && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), r;
	}
	showSolution() {
		if (!this.board) return !1;
		let e = this.getSudokuCells();
		if (!e) return !1;
		let t = [];
		for (let n = 0; n < 9; n++) for (let r = 0; r < 9; r++) {
			let i = e[n]?.[r];
			!i || i.isInitial || typeof i.solution != "string" || i.value === i.solution || t.push({
				coord: {
					row: n,
					col: r
				},
				updates: {
					value: i.solution,
					notes: []
				}
			});
		}
		if (t.length === 0) return !1;
		this.activeCell = t[0]?.coord ?? this.activeCell;
		let n = this.board.setCellsState(t, "show solution");
		return n && this.gridElement && this.renderGrid(this.gridElement), n && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), n;
	}
	resetGame() {
		if (this.initialPuzzle === "") return !1;
		let e = n(this.initialPuzzle);
		return this.board = new t({
			rows: 9,
			cols: 9
		}, e), this.revealIncorrect = !1, this.activeCell = null, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), !0;
	}
	getSudokuCells() {
		let e = this.board?.getState();
		return e ? e.cells : null;
	}
	getIncorrectCoords() {
		let e = this.getSudokuCells();
		if (!e) return [];
		let t = [];
		for (let n = 0; n < 9; n++) for (let r = 0; r < 9; r++) {
			let i = e[n]?.[r];
			i && !i.isInitial && i.value !== "" && typeof i.solution == "string" && i.value !== i.solution && t.push({
				row: n,
				col: r
			});
		}
		return t;
	}
	setActiveCell(e, t) {
		if (this.activeCell = {
			row: e,
			col: t
		}, this.revealIncorrect && (this.revealIncorrect = !1, this.gridElement)) {
			this.renderGrid(this.gridElement);
			return;
		}
		this.refreshActiveHighlights();
	}
	isHighlightedCell(e, t) {
		let n = this.activeCell;
		return !!n && (n.row === e || n.col === t);
	}
	refreshActiveHighlights() {
		if (!this.gridElement) return;
		let e = this.gridElement.querySelectorAll(".tp-sudoku-cell");
		for (let t of e) t.classList.remove("current-line", "current-cell");
		if (!this.activeCell) return;
		for (let e = 0; e < 9; e++) for (let t = 0; t < 9; t++) {
			if (e !== this.activeCell.row && t !== this.activeCell.col) continue;
			let n = this.gridElement.querySelector(`input[data-row="${e}"][data-col="${t}"]`)?.closest(".tp-sudoku-cell");
			n && n.classList.add("current-line");
		}
		let t = this.gridElement.querySelector(`input[data-row="${this.activeCell.row}"][data-col="${this.activeCell.col}"]`)?.closest(".tp-sudoku-cell");
		t && t.classList.add("current-cell");
	}
	restoreActiveCellFocus() {
		if (!this.gridElement || !this.activeCell) return;
		let e = this.gridElement.querySelector(`input[data-row="${this.activeCell.row}"][data-col="${this.activeCell.col}"]`);
		!e || e.readOnly || requestAnimationFrame(() => {
			e.focus(), e.select();
		});
	}
	findNextEditableCell(e, t, n, r) {
		let i = this.getSudokuCells();
		if (!i) return null;
		let a = e, o = t;
		for (let e = 0; e < 81; e++) {
			let e = i[a]?.[o];
			if (e && !e.isInitial) return {
				row: a,
				col: o
			};
			a = (a + n + 9) % 9, o = (o + r + 9) % 9;
		}
		return null;
	}
	getCellNotes(e) {
		return [...e.notes ?? []].sort();
	}
	getCellNotesAt(e, t) {
		let n = this.getSudokuCells()?.[e]?.[t];
		return n ? this.getCellNotes(n) : [];
	}
	clearNotes(e, t) {
		this.board && this.board.setCellState({
			row: e,
			col: t
		}, { notes: [] }, "clear notes") && (this.setActiveCell(e, t), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "input",
			row: e,
			col: t
		}));
	}
	toggleNote(e, t, n) {
		if (!this.board) return;
		let r = this.getSudokuCells()?.[e]?.[t];
		if (!r || r.value !== "") return;
		this.revealIncorrect &&= !1;
		let i = this.getCellNotes(r), a = i.includes(n) ? i.filter((e) => e !== n) : [...i, n].sort();
		this.board.setCellState({
			row: e,
			col: t
		}, { notes: a }, `toggle note ${n}`) && (this.setActiveCell(e, t), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "input",
			row: e,
			col: t
		}));
	}
	createNotesElement(e) {
		let t = document.createElement("div");
		t.className = "tp-sudoku-notes";
		for (let n of l) {
			let r = document.createElement("span");
			r.textContent = e.includes(n) ? n : "", t.appendChild(r);
		}
		return t;
	}
}, d = ".tp-sudoku{--tp-game-cell-size:clamp(2.5rem, 3em, 3.5rem);--tp-game-symbol-font-size:clamp(1.25rem, 1.5em, 2rem);--tp-game-symbol-font-weight:800;box-sizing:border-box;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;max-inline-size:100%;margin:1em 0;padding:1em;font-family:system-ui,-apple-system,sans-serif;display:flow-root}.tp-sudoku *,.tp-sudoku :before,.tp-sudoku :after{box-sizing:border-box}.tp-sudoku-container{flex-direction:column;gap:1em;display:flex}.tp-sudoku-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5em;display:flex}.tp-sudoku-title{color:#333;font-size:1.25em;font-weight:700}.tp-sudoku-controls{flex-wrap:wrap;align-items:center;gap:.5em;display:flex}.tp-sudoku button{appearance:none;color:#fff;cursor:pointer;min-block-size:2.25em;font:inherit;box-sizing:border-box;background:#0b63ce;border:0;border-radius:4px;padding:.45em .9em;transition:background .2s}.tp-sudoku button:hover:not(:disabled){background:#0056b3}.tp-sudoku button:disabled{cursor:not-allowed;background:#ccc}.tp-sudoku select{color:#223;min-block-size:2.25em;inline-size:fit-content;max-inline-size:100%;font:inherit;box-sizing:border-box;background:#fff;border:1px solid #c7d2e0;border-radius:4px;flex:0 auto;padding:.35em .7em}.tp-sudoku-grid{grid-template-columns:repeat(9, var(--tp-game-cell-size));grid-template-rows:repeat(9, var(--tp-game-cell-size));background:#333;border:2px solid #333;gap:0;width:max-content;max-width:100%;margin-inline:auto;padding:2px;display:grid;overflow:auto}.tp-sudoku-cell{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);min-width:var(--tp-game-cell-size);min-height:var(--tp-game-cell-size);background:#fff;border:1px solid #ddd;justify-content:center;align-items:center;display:flex;position:relative}.tp-sudoku-cell.box-left{border-left-width:2px;border-left-color:#333}.tp-sudoku-cell.box-right{border-right-width:2px;border-right-color:#333}.tp-sudoku-cell.box-top{border-top-width:2px;border-top-color:#333}.tp-sudoku-cell.box-bottom{border-bottom-width:2px;border-bottom-color:#333}.tp-sudoku-input{text-align:center;width:100%;height:100%;font:var(--tp-game-symbol-font-weight) var(--tp-game-symbol-font-size)/1 system-ui, -apple-system, sans-serif;color:#1f2937;background:#fff;border:none;padding:0}.tp-sudoku-input:focus-visible{outline:var(--tp-focus-ring,2px solid #0b63ce);outline-offset:-2px}.tp-sudoku-cell.initial .tp-sudoku-input{color:#1d4f91;cursor:default;background:#dbe7ff;font-weight:800}.tp-sudoku-cell.initial.current-line .tp-sudoku-input{background:#cfe0ff}.tp-sudoku-cell.initial .tp-sudoku-input:focus-visible{outline:var(--tp-focus-ring,2px solid #0b63ce);outline-offset:-2px}.tp-sudoku-cell.incorrect .tp-sudoku-input{color:#c62828;background:#ffebee}.tp-sudoku-cell.current-line .tp-sudoku-input{background:#e6f0ff}.tp-sudoku-cell.current-cell{box-shadow:inset 0 0 0 2px #0b63ce}.tp-sudoku-status{text-align:center;border-radius:4px;min-height:1.5rem;padding:.75em;font-weight:500}.tp-sudoku-status.success{color:#155724;background:#d4edda;border:1px solid #c3e6cb}.tp-sudoku-status.error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb}.tp-sudoku-status.info{color:#0c5460;background:#d1ecf1;border:1px solid #bee5eb}.tp-sudoku-error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;padding:1rem}@media (prefers-reduced-motion:reduce){tp-sudoku,tp-sudoku *{transition-duration:.01ms!important;transition-delay:0s!important}}", f = class t extends e {
	static styleId = "tp-sudoku-styles";
	engine = null;
	gridElement = null;
	statusElement = null;
	modeButton = null;
	undoButton = null;
	redoButton = null;
	assistSelect = null;
	focusedCell = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.styleId, d), this.classList.add("tp-sudoku");
		let e = this.getAttribute("puzzle") ?? this.dataset.sudokuPuzzle ?? this.parsePuzzleFromLists();
		if (!e) {
			this.renderError("Empty sudoku puzzle");
			return;
		}
		try {
			this.engine = new u({ onChange: () => this.updateStatus() }), this.engine.initialize(e), this.render();
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
		this.innerHTML = "\n      <div class=\"tp-sudoku-container\">\n        <div class=\"tp-sudoku-header\">\n          <div class=\"tp-sudoku-title\">Sudoku</div>\n          <div class=\"tp-sudoku-controls\">\n            <button class=\"tp-sudoku-mode\" type=\"button\">Game</button>\n            <button class=\"tp-sudoku-undo\" disabled>Undo</button>\n            <button class=\"tp-sudoku-redo\" disabled>Redo</button>\n            <select class=\"tp-sudoku-assist\" aria-label=\"Assistance actions\">\n              <option value=\"\">Assist…</option>\n              <option value=\"reset-game\">Reset the game</option>\n              <option value=\"show-incorrect\">Show all incorrect boxes</option>\n              <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n              <option value=\"show-cell\">Show the box</option>\n              <option value=\"show-solution\">Show the solution</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"tp-sudoku-grid\"></div>\n        <div class=\"tp-sudoku-status\"></div>\n      </div>\n    ", this.gridElement = this.querySelector(".tp-sudoku-grid"), this.statusElement = this.querySelector(".tp-sudoku-status"), this.modeButton = this.querySelector(".tp-sudoku-mode"), this.undoButton = this.querySelector(".tp-sudoku-undo"), this.redoButton = this.querySelector(".tp-sudoku-redo"), this.assistSelect = this.querySelector(".tp-sudoku-assist"), !(!this.engine || !this.gridElement) && (this.engine.renderGrid(this.gridElement), this.attachEventListeners(), this.updateStatus());
	}
	attachEventListeners() {
		if (!(!this.modeButton || !this.undoButton || !this.redoButton || !this.assistSelect || !this.gridElement)) {
			this.modeButton.addEventListener("click", () => {
				this.engine?.toggleEntryMode(), this.updateStatus();
			}), this.undoButton.addEventListener("click", () => {
				this.engine?.undo(), this.updateStatus();
			}), this.redoButton.addEventListener("click", () => {
				this.engine?.redo(), this.updateStatus();
			}), this.assistSelect.addEventListener("change", () => {
				if (!(!this.engine || !this.assistSelect)) {
					switch (this.assistSelect.value) {
						case "reset-game":
							this.engine.resetGame(), this.focusedCell = null;
							break;
						case "show-incorrect":
							this.engine.showIncorrectCells();
							break;
						case "clear-incorrect":
							this.engine.clearIncorrectCells();
							break;
						case "show-cell":
							this.focusedCell && this.engine.showCell(this.focusedCell.row, this.focusedCell.col);
							break;
						case "show-solution":
							this.engine.showSolution();
							break;
						default: break;
					}
					this.assistSelect.value = "", this.updateStatus();
				}
			});
			for (let e of [
				this.modeButton,
				this.undoButton,
				this.redoButton
			]) e.addEventListener("mousedown", (e) => {
				e.preventDefault();
			});
			this.gridElement.addEventListener("focus", (e) => {
				if (e.target instanceof HTMLInputElement) {
					let t = Number.parseInt(e.target.dataset.row ?? "0", 10), n = Number.parseInt(e.target.dataset.col ?? "0", 10);
					this.focusedCell = {
						row: t,
						col: n
					};
				}
			}, !0);
		}
	}
	updateStatus() {
		if (!this.statusElement || !this.engine || !this.modeButton || !this.undoButton || !this.redoButton) return;
		let e = this.engine.getValidation();
		if (this.undoButton.disabled = !this.engine.canUndo(), this.redoButton.disabled = !this.engine.canRedo(), this.modeButton.textContent = this.engine.getEntryMode() === "game" ? "Game" : "Note", this.modeButton.setAttribute("aria-label", `Current entry mode: ${this.engine.getEntryMode()}`), this.statusElement.className = "tp-sudoku-status", e.isComplete) this.statusElement.textContent = "✓ Solved!", this.statusElement.classList.add("success");
		else {
			let e = this.engine.countIncorrectCells(), t = this.engine.countEmptyCells();
			this.engine.isShowingIncorrectCells() && e > 0 ? this.statusElement.textContent = `${e} incorrect box${e === 1 ? "" : "es"} shown` : this.statusElement.textContent = `${t} empty cell${t === 1 ? "" : "s"}`, this.statusElement.classList.add("info");
		}
	}
	renderError(e) {
		this.innerHTML = `<div class="tp-sudoku-error">Error: ${e}</div>`;
	}
};
customElements.get("tp-sudoku") || customElements.define("tp-sudoku", f);
//#endregion
export { f as t };

