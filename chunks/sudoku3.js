import { t as e } from "./board2.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/sudoku.js
function t(e) {
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
function n(e, t) {
	return Math.floor(e / 3) * 3 + Math.floor(t / 3);
}
function r(e) {
	let t = [], r = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set()), a = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set()), o = Array.from({ length: 9 }, () => /* @__PURE__ */ new Set());
	for (let i = 0; i < 9; i++) for (let s = 0; s < 9; s++) {
		let c = e[i]?.[s];
		if (!c || c.value === "") continue;
		let l = c.value, u = n(i, s), d = {
			row: i,
			col: s
		};
		r[i]?.has(l) ? t.push({
			coord: d,
			type: "row"
		}) : r[i]?.add(l), a[s]?.has(l) ? t.push({
			coord: d,
			type: "col"
		}) : a[s]?.add(l), o[u]?.has(l) ? t.push({
			coord: d,
			type: "box"
		}) : o[u]?.add(l);
	}
	let s = t.length === 0;
	return {
		isValid: s,
		isComplete: s && i(e),
		conflicts: t
	};
}
function i(e) {
	for (let t of e) for (let e of t) if (e.value === "") return !1;
	return !0;
}
function a(e) {
	for (let t of e) for (let e of t) if (e.value === "" || e.solution && e.value !== e.solution) return !1;
	return !0;
}
function o(e, t, n, r) {
	if (!/[1-9]/.test(r) || !e[t]?.[n]) return !1;
	for (let i = 0; i < 9; i++) if (i !== n && e[t]?.[i]?.value === r) return !1;
	for (let i = 0; i < 9; i++) if (i !== t && e[i]?.[n]?.value === r) return !1;
	let i = Math.floor(t / 3) * 3, a = Math.floor(n / 3) * 3;
	for (let o = i; o < i + 3; o++) for (let i = a; i < a + 3; i++) if ((o !== t || i !== n) && e[o]?.[i]?.value === r) return !1;
	return !0;
}
function s(e, t, n) {
	let r = e[t]?.[n];
	if (!r || r.value !== "") return [];
	let i = [];
	for (let r = 1; r <= 9; r++) o(e, t, n, String(r)) && i.push(String(r));
	return i;
}
var c = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
], l = class {
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
	initialize(n) {
		let r = t(n);
		this.board = new e({
			rows: 9,
			cols: 9
		}, r), this.initialPuzzle = n, this.revealIncorrect = !1, this.activeCell = null, this.entryMode = "game";
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
		if (!e) return r([]);
		let t = r(e);
		return {
			...t,
			isComplete: t.isValid && a(e)
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
		let i = s(n, e, t);
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
		let n = t(this.initialPuzzle);
		return this.board = new e({
			rows: 9,
			cols: 9
		}, n), this.revealIncorrect = !1, this.activeCell = null, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
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
		for (let n of c) {
			let r = document.createElement("span");
			r.textContent = e.includes(n) ? n : "", t.appendChild(r);
		}
		return t;
	}
}, u = {
	id: "sudoku",
	async render(e) {
		let t = e.querySelectorAll(".tp-sudoku[data-sudoku-puzzle]");
		for (let e of t) {
			if (!(e instanceof HTMLElement)) continue;
			let t = e.getAttribute("data-sudoku-puzzle");
			if (t) try {
				f();
				let n = null;
				e.innerHTML = "\n          <div class=\"tp-sudoku-container\">\n            <div class=\"tp-sudoku-header\">\n              <div class=\"tp-sudoku-title\">Sudoku</div>\n              <div class=\"tp-sudoku-controls\">\n                <button class=\"tp-sudoku-mode\" type=\"button\">Game</button>\n                <button class=\"tp-sudoku-undo\" disabled>Undo</button>\n                <button class=\"tp-sudoku-redo\" disabled>Redo</button>\n                <select class=\"tp-sudoku-assist\">\n                  <option value=\"\">Assist…</option>\n                  <option value=\"reset-game\">Reset the game</option>\n                  <option value=\"show-incorrect\">Show all incorrect boxes</option>\n                  <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n                  <option value=\"show-cell\">Show the box</option>\n                  <option value=\"show-solution\">Show the solution</option>\n                </select>\n              </div>\n            </div>\n\n            <div class=\"tp-sudoku-grid\"></div>\n            <div class=\"tp-sudoku-status\"></div>\n          </div>\n        ";
				let r = e.querySelector(".tp-sudoku-grid"), i = e.querySelector(".tp-sudoku-status"), a = e.querySelector(".tp-sudoku-mode"), o = e.querySelector(".tp-sudoku-undo"), s = e.querySelector(".tp-sudoku-redo"), c = e.querySelector(".tp-sudoku-assist"), u = new l({ onChange: () => d(u, i, a, o, s) });
				u.initialize(t), u.renderGrid(r), o.disabled = !u.canUndo(), s.disabled = !u.canRedo(), a.addEventListener("click", () => {
					u.toggleEntryMode(), d(u, i, a, o, s);
				}), o.addEventListener("click", () => {
					u.undo(), d(u, i, a, o, s);
				}), s.addEventListener("click", () => {
					u.redo(), d(u, i, a, o, s);
				}), c.addEventListener("change", () => {
					switch (c.value) {
						case "reset-game":
							u.resetGame(), n = null;
							break;
						case "show-incorrect":
							u.showIncorrectCells();
							break;
						case "clear-incorrect":
							u.clearIncorrectCells();
							break;
						case "show-cell":
							n && u.showCell(n.row, n.col);
							break;
						case "show-solution":
							u.showSolution();
							break;
						default: break;
					}
					c.value = "", d(u, i, a, o, s);
				});
				for (let e of [
					a,
					o,
					s
				]) e.addEventListener("mousedown", (e) => {
					e.preventDefault();
				});
				r.addEventListener("focus", (e) => {
					e.target instanceof HTMLInputElement && (n = {
						row: Number.parseInt(e.target.dataset.row ?? "0", 10),
						col: Number.parseInt(e.target.dataset.col ?? "0", 10)
					});
				}, !0), d(u, i, a, o, s);
			} catch (t) {
				console.error("Failed to initialize sudoku:", t), e.innerHTML = `<div class="tp-sudoku-error">Error: ${t instanceof Error ? t.message : String(t)}</div>`;
			}
		}
	}
};
function d(e, t, n, r, i) {
	let a = e.getValidation();
	if (n.textContent = e.getEntryMode() === "game" ? "Game" : "Note", n.setAttribute("aria-label", `Current entry mode: ${e.getEntryMode()}`), r.disabled = !e.canUndo(), i.disabled = !e.canRedo(), t.className = "tp-sudoku-status", a.isComplete) t.textContent = "✓ Solved!", t.classList.add("success");
	else {
		let n = e.countIncorrectCells(), r = e.countEmptyCells();
		e.isShowingIncorrectCells() && n > 0 ? t.textContent = `${n} incorrect box${n === 1 ? "" : "es"} shown` : t.textContent = `${r} empty cell${r === 1 ? "" : "s"}`, t.classList.add("info");
	}
}
function f() {
	let e = "tp-md-sudoku-styles";
	if (document.getElementById(e)) return;
	let t = document.createElement("style");
	t.id = e, t.textContent = "\n.tp-sudoku {\n  box-sizing: border-box;\n  display: block;\n  font-family: system-ui, -apple-system, sans-serif;\n  max-width: 600px;\n  margin: 1rem 0;\n  padding: 1rem;\n  background: #f9f9f9;\n  border-radius: 8px;\n  border: 1px solid #e0e0e0;\n}\n\n.tp-sudoku *,\n.tp-sudoku *::before,\n.tp-sudoku *::after {\n  box-sizing: border-box;\n}\n\n.tp-sudoku-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.tp-sudoku-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n\n.tp-sudoku-title {\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: #333;\n}\n\n.tp-sudoku-controls {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: nowrap;\n  align-items: center;\n}\n\n.tp-sudoku button {\n  appearance: none;\n  height: 2.25rem;\n  padding: 0 0.9rem;\n  background: #0b63ce;\n  color: white;\n  border: 0;\n  border-radius: 4px;\n  cursor: pointer;\n  font: inherit;\n  transition: background 0.2s;\n  box-sizing: border-box;\n}\n\n.tp-sudoku button:hover:not(:disabled) {\n  background: #0056b3;\n}\n\n.tp-sudoku button:disabled {\n  background: #ccc;\n  cursor: not-allowed;\n}\n\n.tp-sudoku select {\n  max-width: none;\n  height: 2.25rem;\n  padding: 0 0.7rem;\n  border: 1px solid #c7d2e0;\n  border-radius: 4px;\n  background: white;\n  color: #223;\n  font: inherit;\n  box-sizing: border-box;\n}\n\n.tp-sudoku-grid {\n  display: grid;\n  grid-template-columns: repeat(9, 1fr);\n  grid-template-rows: repeat(9, minmax(0, 1fr));\n  gap: 0;\n  background: #333;\n  padding: 2px;\n  width: 100%;\n  max-width: 100%;\n  aspect-ratio: 1;\n  border: 2px solid #333;\n  margin-inline: auto;\n  overflow: hidden;\n}\n\n.tp-sudoku-cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: white;\n  border: 1px solid #ddd;\n  min-width: 0;\n  min-height: 0;\n  font-size: 1.25rem;\n  font-weight: bold;\n  position: relative;\n}\n\n.tp-sudoku-cell.box-left {\n  border-left-width: 2px;\n  border-left-color: #333;\n}\n.tp-sudoku-cell.box-right {\n  border-right-width: 2px;\n  border-right-color: #333;\n}\n.tp-sudoku-cell.box-top {\n  border-top-width: 2px;\n  border-top-color: #333;\n}\n.tp-sudoku-cell.box-bottom {\n  border-bottom-width: 2px;\n  border-bottom-color: #333;\n}\n\n.tp-sudoku-input {\n  width: 100%;\n  height: 100%;\n  border: none;\n  text-align: center;\n  font-size: 1.25rem;\n  font-weight: 600;\n  font-family: inherit;\n  background: white;\n  color: #1f2937;\n  padding: 0;\n}\n\n.tp-sudoku-input:focus {\n  outline: 2px solid #007bff;\n  outline-offset: -2px;\n}\n\n.tp-sudoku-cell.initial .tp-sudoku-input {\n  background: #dbe7ff;\n  color: #1d4f91;\n  font-weight: 800;\n  cursor: default;\n}\n\n.tp-sudoku-cell.initial.current-line .tp-sudoku-input {\n  background: #cfe0ff;\n}\n\n.tp-sudoku-cell.initial .tp-sudoku-input:focus {\n  outline: none;\n}\n\n.tp-sudoku-cell.incorrect .tp-sudoku-input {\n  background: #ffebee;\n  color: #c62828;\n}\n\n.tp-sudoku-cell.current-line .tp-sudoku-input {\n  background: #e6f0ff;\n}\n\n.tp-sudoku-cell.current-cell {\n  box-shadow: inset 0 0 0 2px #0b63ce;\n}\n\n.tp-sudoku-cell {\n  position: relative;\n  overflow: hidden;\n}\n\n.tp-sudoku-cell.has-notes .tp-sudoku-input {\n  background: transparent;\n}\n\n.tp-sudoku-notes {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  padding: 0.12rem;\n  pointer-events: none;\n  color: #516071;\n  font-size: 0.48rem;\n  line-height: 1;\n  text-align: center;\n  align-items: center;\n}\n\n.tp-sudoku-status {\n  padding: 0.75rem;\n  border-radius: 4px;\n  text-align: center;\n  font-weight: 500;\n  min-height: 1.5rem;\n}\n\n.tp-sudoku-status.success {\n  background: #d4edda;\n  color: #155724;\n  border: 1px solid #c3e6cb;\n}\n\n.tp-sudoku-status.error {\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n\n.tp-sudoku-status.info {\n  background: #d1ecf1;\n  color: #0c5460;\n  border: 1px solid #bee5eb;\n}\n\n.tp-sudoku-error {\n  padding: 1rem;\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n  border-radius: 4px;\n}\n", document.head.appendChild(t);
}
//#endregion
export { u as default };

