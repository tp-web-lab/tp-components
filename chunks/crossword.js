import { Ku as e } from "./lib/typescript/typescript.js";
import { t } from "./board.js";
//#region ../../../../../../@tp/tp-utilities/dist/games/crossword/crossword-parser.js
var n = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
function r(e) {
	return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}
function i(e, t) {
	let i = [];
	for (let a = 0; a < e.length; a++) {
		let o = e.charAt(a);
		if (/\s/.test(o)) continue;
		if (o === "#") {
			i.push({
				value: "",
				isEditable: !1,
				isBlack: !0,
				isInitial: !1
			});
			continue;
		}
		if (!n.test(o)) throw Error(`Invalid crossword character '${o}' in row ${t}`);
		let s = r(o), c = e.charAt(a + 1) === "!";
		c && (a += 1), i.push({
			value: c ? s : "",
			isEditable: !c,
			isBlack: !1,
			isInitial: c,
			solution: s
		});
	}
	return i;
}
function a(e) {
	let t = e.split("\n").map((e) => e.trim()).filter((e) => e.length > 0), n = [], r = [], a = [], o = "rows";
	for (let e of t) {
		let t = /^([a-z])\.\s*(.+)$/.exec(e), s = /^([A-Z])\.\s*(.+)$/.exec(e), c = /^(\d+)\.\s*(.+)$/.exec(e);
		if (t) {
			if (o !== "rows") throw Error("Row definitions must come before clues");
			let e = t[1] ?? "", r = t[2] ?? "";
			n.push({
				label: e.toUpperCase(),
				cells: i(r, e.toUpperCase())
			});
			continue;
		}
		if (s) {
			o = "row-clues", r.push(e);
			continue;
		}
		if (c) {
			o = "col-clues", a.push(e);
			continue;
		}
		throw Error(`Invalid crossword line: ${e}`);
	}
	if (n.length === 0) throw Error("Crossword requires at least one row definition");
	let s = n[0]?.cells.length ?? 0;
	if (s === 0) throw Error("Crossword rows cannot be empty");
	for (let e of n) if (e.cells.length !== s) throw Error(`Crossword rows must have the same length: row ${e.label} has ${e.cells.length}, expected ${s}`);
	return {
		rows: n.map((e) => e.cells),
		rowLabels: n.map((e) => e.label),
		colCount: s,
		rowClues: r,
		colClues: a
	};
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/games/crossword/crossword-engine.js
var o = class {
	board = null;
	gridElement = null;
	onChange;
	puzzle = null;
	initialPuzzle = "";
	revealIncorrect = !1;
	activeCell = null;
	orientation = "across";
	silentBlackCells = !1;
	suppressRestoreFocusOnce = !1;
	getModeToggleIcon() {
		return this.orientation === "across" ? "↔" : "↕";
	}
	constructor(e = {}) {
		this.onChange = e.onChange;
	}
	initialize(e, n = {}) {
		let r = a(e);
		if (n.silent === !0) for (let e of r.rows) for (let t of e) t.isBlack && (t.isEditable = !0);
		this.puzzle = r, this.board = new t({
			rows: r.rows.length,
			cols: r.colCount
		}, r.rows), this.initialPuzzle = e, this.silentBlackCells = n.silent === !0, this.revealIncorrect = !1, this.activeCell = null, this.orientation = "across";
	}
	renderGrid(e) {
		let t = this.puzzle, n = this.getCells();
		if (!t || !n) throw Error("Engine not initialized. Call initialize() first.");
		this.gridElement = e, e.innerHTML = "";
		let r = document.createElement("table");
		r.className = "tp-crossword-table";
		let i = document.createElement("thead"), a = document.createElement("tr"), o = document.createElement("th");
		o.className = "tp-crossword-corner";
		let s = document.createElement("button");
		s.type = "button", s.className = "tp-crossword-mode-toggle", s.textContent = this.getModeToggleIcon(), s.setAttribute("aria-label", `Switch mode (current: ${this.orientation})`), s.title = `Mode: ${this.orientation}`, s.addEventListener("click", (e) => {
			e.preventDefault();
			let t = this.activeCell ? { ...this.activeCell } : null;
			this.toggleOrientation(), t && this.focusCell(t.row, t.col, !1);
		}), o.appendChild(s), a.appendChild(o);
		for (let e = 0; e < t.colCount; e++) {
			let t = document.createElement("th");
			t.className = "tp-crossword-col-label", t.textContent = String(e + 1), a.appendChild(t);
		}
		i.appendChild(a), r.appendChild(i);
		let c = document.createElement("tbody");
		for (let e = 0; e < n.length; e++) {
			let r = document.createElement("tr"), i = document.createElement("th");
			i.className = "tp-crossword-row-label", i.textContent = t.rowLabels[e] ?? String.fromCharCode(65 + e), r.appendChild(i);
			for (let i = 0; i < t.colCount; i++) {
				let t = n[e]?.[i];
				if (!t) continue;
				let a = document.createElement("td");
				a.className = "tp-crossword-cell", t.isBlack && a.classList.add("black"), t.isInitial && a.classList.add("initial"), this.revealIncorrect && !t.isBlack && t.value !== "" && typeof t.solution == "string" && t.value !== t.solution && a.classList.add("incorrect"), t.isBlack && this.silentBlackCells && a.classList.add("silent-black"), t.isBlack && a.addEventListener("click", () => {
					this.clearActiveCell();
				});
				let o = this.getHighlightRole(e, i);
				o === "primary" ? a.classList.add("current-word-primary") : o === "secondary" && a.classList.add("current-word-secondary"), this.activeCell?.row === e && this.activeCell?.col === i && a.classList.add("current-cell");
				let s = document.createElement("input");
				s.type = "text", s.className = "tp-crossword-input", s.value = t.value, s.maxLength = 1, s.dataset.row = String(e), s.dataset.col = String(i), s.readOnly = t.isInitial || t.isBlack && !this.silentBlackCells, s.setAttribute("aria-label", `Crossword cell ${e + 1},${i + 1}`), t.isBlack && !this.silentBlackCells && (s.tabIndex = -1), (!t.isBlack || this.silentBlackCells) && (s.addEventListener("click", () => {
					this.handleUserNavigation(e, i);
				}), s.addEventListener("focus", () => {
					this.setActiveCell(e, i), !s.readOnly && s.value !== "" && requestAnimationFrame(() => s.select());
				})), s.readOnly || (s.addEventListener("dblclick", () => {
					this.toggleOrientation();
				}), s.addEventListener("input", (t) => {
					let n = t.target, r = n.value.trim(), a = r === "" ? "" : r.charAt(r.length - 1), o = a === "" ? "" : this.silentBlackCells && a === "#" ? "#" : a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
					if (o !== "" && o !== "#" && !/[A-Z]/.test(o)) {
						n.value = "", this.setCell(e, i, "");
						return;
					}
					let s = null;
					o !== "" && (s = this.findNextEditableCell(e, i, this.orientation === "across" ? 0 : 1, +(this.orientation === "across")), s && (this.suppressRestoreFocusOnce = !0)), this.revealIncorrect && this.hideIncorrectCells(), this.setCell(e, i, o), s && (this.activeCell = s, this.setActiveCell(s.row, s.col, !0));
				})), a.appendChild(s), r.appendChild(a);
			}
			c.appendChild(r);
		}
		r.appendChild(c), e.appendChild(r), this.attachKeyboardNavigation(e), this.restoreActiveCellFocus();
	}
	getOrientation() {
		return this.orientation;
	}
	isSilent() {
		return this.silentBlackCells;
	}
	getActiveCell() {
		return this.activeCell ? { ...this.activeCell } : null;
	}
	getActiveClues() {
		let e = this.activeCell, t = this.puzzle;
		if (!e || !t) return null;
		let n = (t.rowLabels[e.row] ?? String.fromCharCode(65 + e.row)).toUpperCase(), r = String(e.col + 1);
		if (this.silentBlackCells) return {
			across: {
				key: n,
				partIndex: this.getAcrossWordPartIndex(e.row, e.col)
			},
			down: {
				key: r,
				partIndex: this.getDownWordPartIndex(e.row, e.col)
			},
			primary: this.orientation,
			secondary: this.orientation === "across" ? "down" : "across"
		};
		let i = this.getAcrossWordLength(e.row, e.col), a = this.getDownWordLength(e.row, e.col);
		return {
			across: i > 1 ? {
				key: n,
				partIndex: this.getAcrossWordPartIndex(e.row, e.col)
			} : null,
			down: a > 1 ? {
				key: r,
				partIndex: this.getDownWordPartIndex(e.row, e.col)
			} : null,
			primary: this.orientation,
			secondary: this.orientation === "across" ? "down" : "across"
		};
	}
	toggleOrientation() {
		return this.orientation = this.orientation === "across" ? "down" : "across", this.updateModeToggleButton(), this.refreshActiveHighlights(), this.onChange?.({
			kind: "assist",
			row: this.activeCell?.row ?? -1,
			col: this.activeCell?.col ?? -1
		}), this.orientation;
	}
	setActiveCell(e, t, n = !1) {
		let r = this.activeCell;
		this.activeCell = {
			row: e,
			col: t
		}, this.refreshActiveHighlights(), (!r || r.row !== e || r.col !== t) && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), n && this.gridElement && this.focusCell(e, t, !0);
	}
	clearActiveCell() {
		this.activeCell && (this.activeCell = null, this.refreshActiveHighlights(), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}));
	}
	setCell(e, t, n) {
		this.board && (this.revealIncorrect && this.hideIncorrectCells(), this.activeCell = {
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
	canUndo() {
		return this.board?.canUndo() ?? !1;
	}
	canRedo() {
		return this.board?.canRedo() ?? !1;
	}
	countEmptyCells() {
		let e = this.getCells();
		return e ? e.flat().filter((e) => (this.silentBlackCells ? !0 : !e.isBlack) && e.value === "").length : 0;
	}
	countIncorrectCells() {
		return this.getIncorrectCoords().length;
	}
	isShowingIncorrectCells() {
		return this.revealIncorrect;
	}
	getValidation() {
		return { isComplete: this.countEmptyCells() === 0 && this.countIncorrectCells() === 0 };
	}
	showIncorrectCells() {
		return this.revealIncorrect = !0, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), this.countIncorrectCells() > 0;
	}
	hideIncorrectCells() {
		return this.revealIncorrect ? (this.revealIncorrect = !1, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), !0) : !1;
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
		let t = this.board.setCells(e, "clear incorrect");
		return this.revealIncorrect = !1, this.activeCell = e[0]?.coord ?? this.activeCell, t && this.gridElement && this.renderGrid(this.gridElement), t && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), t;
	}
	showCell(e, t) {
		if (!this.board) return !1;
		let n = this.getCells()?.[e]?.[t];
		if (!n || n.isBlack || n.isInitial || typeof n.solution != "string") return !1;
		this.revealIncorrect && this.hideIncorrectCells(), this.activeCell = {
			row: e,
			col: t
		};
		let r = this.board.setCell({
			row: e,
			col: t
		}, n.solution, "show cell");
		return r && this.gridElement && this.renderGrid(this.gridElement), r && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), r;
	}
	showWord(e, t) {
		if (!this.board) return !1;
		let n = this.getCells();
		if (!n) return !1;
		let r = n[e]?.[t];
		if (!r || r.isBlack) return !1;
		this.revealIncorrect && this.hideIncorrectCells(), this.activeCell = {
			row: e,
			col: t
		};
		let i = [];
		for (let e of this.getCurrentWordCells()) {
			let t = n[e.row]?.[e.col];
			!t || t.isBlack || t.isInitial || typeof t.solution != "string" || t.value === t.solution || i.push({
				coord: {
					row: e.row,
					col: e.col
				},
				value: t.solution
			});
		}
		if (i.length === 0) return !1;
		this.activeCell = i[0]?.coord ?? this.activeCell;
		let a = this.board.setCells(i, "show word");
		return a && this.gridElement && this.renderGrid(this.gridElement), a && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), a;
	}
	showSolution() {
		if (!this.board) return !1;
		let e = this.getCells();
		if (!e) return !1;
		let t = [];
		for (let n = 0; n < e.length; n++) for (let r = 0; r < (e[0]?.length ?? 0); r++) {
			let i = e[n]?.[r];
			!i || i.isBlack || i.isInitial || typeof i.solution != "string" || i.value === i.solution || t.push({
				coord: {
					row: n,
					col: r
				},
				value: i.solution
			});
		}
		if (t.length === 0) return !1;
		this.revealIncorrect && this.hideIncorrectCells(), this.activeCell = t[0]?.coord ?? this.activeCell;
		let n = this.board.setCells(t, "show solution");
		return n && this.gridElement && this.renderGrid(this.gridElement), n && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), n;
	}
	resetGame() {
		return this.initialPuzzle === "" ? !1 : (this.initialize(this.initialPuzzle, { silent: this.silentBlackCells }), this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), !0);
	}
	getClues() {
		return {
			across: this.puzzle?.rowClues ?? [],
			down: this.puzzle?.colClues ?? []
		};
	}
	attachKeyboardNavigation(e) {
		e.dataset.crosswordNavAttached !== "true" && (e.dataset.crosswordNavAttached = "true", e.addEventListener("keydown", (e) => {
			if (!(e.target instanceof HTMLInputElement)) return;
			let t = e.key, n = Number.parseInt(e.target.dataset.row ?? "0", 10), r = Number.parseInt(e.target.dataset.col ?? "0", 10);
			if (t === "Delete") {
				if (e.preventDefault(), e.target.readOnly) return;
				this.setCell(n, r, ""), this.setActiveCell(n, r, !0);
				return;
			}
			if (t === "Backspace") {
				if (e.preventDefault(), e.target.value !== "") {
					this.setCell(n, r, ""), this.moveFromCellByOrientation(n, r, -1);
					return;
				}
				let t = this.getAdjacentEditableCellInOrientation(n, r, -1);
				if (!t) return;
				this.setCell(t.row, t.col, "");
				return;
			}
			if ([
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(t)) switch (e.preventDefault(), this.revealIncorrect && this.hideIncorrectCells(), t) {
				case "ArrowLeft":
					this.moveByDirection(n, r, 0, -1);
					return;
				case "ArrowRight":
					this.moveByDirection(n, r, 0, 1);
					return;
				case "ArrowUp":
					this.moveByDirection(n, r, -1, 0);
					return;
				case "ArrowDown":
					this.moveByDirection(n, r, 1, 0);
					return;
				default: return;
			}
		}));
	}
	moveByDirection(e, t, n, r) {
		let i = this.findNextEditableCell(e, t, n, r);
		!i || !this.gridElement || this.setActiveCell(i.row, i.col, !0);
	}
	moveFromCellByOrientation(e, t, n) {
		let r = this.getAdjacentEditableCellInOrientation(e, t, n);
		!r || !this.gridElement || this.setActiveCell(r.row, r.col, !0);
	}
	getAdjacentEditableCellInOrientation(e, t, n) {
		let [r, i] = this.orientation === "across" ? [0, n] : [n, 0];
		return this.findNextEditableCell(e, t, r, i);
	}
	findNextEditableCell(e, t, n, r) {
		let i = this.getCells();
		if (!i) return null;
		let a = i.length, o = i[0]?.length ?? 0;
		if (a === 0 || o === 0) return null;
		let s = e, c = t;
		for (let e = 0; e < a * o; e++) {
			s = (s + n + a) % a, c = (c + r + o) % o;
			let e = i[s]?.[c];
			if (e && !e.isInitial && (!e.isBlack || this.silentBlackCells)) return {
				row: s,
				col: c
			};
		}
		return null;
	}
	restoreActiveCellFocus() {
		if (this.suppressRestoreFocusOnce) {
			this.suppressRestoreFocusOnce = !1;
			return;
		}
		!this.gridElement || !this.activeCell || this.focusCell(this.activeCell.row, this.activeCell.col, !0);
	}
	updateModeToggleButton() {
		if (!this.gridElement) return;
		let e = this.gridElement.querySelector(".tp-crossword-mode-toggle");
		e && (e.textContent = this.getModeToggleIcon(), e.setAttribute("aria-label", `Switch mode (current: ${this.orientation})`), e.title = `Mode: ${this.orientation}`);
	}
	focusCell(e, t, n) {
		if (!this.gridElement) return;
		let r = this.gridElement.querySelector(`input[data-row="${e}"][data-col="${t}"]`);
		r && requestAnimationFrame(() => {
			r.focus(), n && !r.readOnly && r.value !== "" && r.select();
		});
	}
	handleUserNavigation(e, t) {
		this.revealIncorrect && this.hideIncorrectCells(), this.setActiveCell(e, t);
	}
	refreshActiveHighlights() {
		if (!this.gridElement) return;
		let e = this.gridElement.querySelectorAll(".tp-crossword-cell");
		for (let t of e) t.classList.remove("current-word-primary", "current-word-secondary", "current-cell");
		if (!this.activeCell || !this.getCells()) return;
		for (let e of this.getWordCellsForOrientation(this.orientation)) {
			let t = this.gridElement.querySelector(`.tp-crossword-cell input[data-row="${e.row}"][data-col="${e.col}"]`)?.closest(".tp-crossword-cell");
			t && t.classList.add("current-word-primary");
		}
		let t = this.orientation === "across" ? "down" : "across";
		for (let e of this.getWordCellsForOrientation(t)) {
			let t = this.gridElement.querySelector(`.tp-crossword-cell input[data-row="${e.row}"][data-col="${e.col}"]`)?.closest(".tp-crossword-cell");
			t && !t.classList.contains("current-word-primary") && t.classList.add("current-word-secondary");
		}
		let n = this.activeCell;
		if (n) {
			let e = this.gridElement.querySelector(`.tp-crossword-cell input[data-row="${n.row}"][data-col="${n.col}"]`)?.closest(".tp-crossword-cell");
			e && e.classList.add("current-cell");
		}
	}
	getHighlightRole(e, t) {
		if (this.getWordCellsForOrientation(this.orientation).some((n) => n.row === e && n.col === t)) return "primary";
		let n = this.orientation === "across" ? "down" : "across";
		return this.getWordCellsForOrientation(n).some((n) => n.row === e && n.col === t) ? "secondary" : null;
	}
	getCurrentWordCells() {
		return this.getWordCellsForOrientation(this.orientation);
	}
	getWordCellsForOrientation(e) {
		let t = this.activeCell, n = this.getCells();
		if (!t || !n) return [];
		let r = n[t.row]?.[t.col];
		if (!r) return [];
		if (this.silentBlackCells) {
			let r = [];
			if (e === "across") for (let e = 0; e < (n[0]?.length ?? 0); e++) r.push({
				row: t.row,
				col: e
			});
			else for (let e = 0; e < n.length; e++) r.push({
				row: e,
				col: t.col
			});
			return r;
		}
		if (r.isBlack) return [];
		let i = e === "across" ? 0 : 1, a = +(e === "across"), o = n.length, s = n[0]?.length ?? 0, c = t.row, l = t.col;
		for (; c - i >= 0 && l - a >= 0;) {
			let e = c - i, t = l - a, r = n[e]?.[t];
			if (!r || r.isBlack) break;
			c = e, l = t;
		}
		let u = [], d = c, f = l;
		for (; d < o && f < s;) {
			let e = n[d]?.[f];
			if (!e || e.isBlack) break;
			u.push({
				row: d,
				col: f
			}), d += i, f += a;
		}
		return u;
	}
	getAcrossWordPartIndex(e, t) {
		let n = this.getCells();
		if (!n) return 0;
		let r = -1;
		for (let i = 0; i < (n[0]?.length ?? 0); i++) {
			let a = n[e]?.[i];
			if (!a || a.isBlack) continue;
			let o = i > 0 ? n[e]?.[i - 1] : null;
			if ((i === 0 || o?.isBlack) && (r += 1), i === t) return Math.max(r, 0);
		}
		return 0;
	}
	getDownWordPartIndex(e, t) {
		let n = this.getCells();
		if (!n) return 0;
		let r = -1;
		for (let i = 0; i < n.length; i++) {
			let a = n[i]?.[t];
			if (!a || a.isBlack) continue;
			let o = i > 0 ? n[i - 1]?.[t] : null;
			if ((i === 0 || o?.isBlack) && (r += 1), i === e) return Math.max(r, 0);
		}
		return 0;
	}
	getCells() {
		let e = this.board?.getState();
		return e ? e.cells : null;
	}
	getAcrossWordLength(e, t) {
		let n = this.getCells();
		if (!n) return 0;
		let r = n[e]?.[t];
		if (!r || r.isBlack) return 0;
		let i = t;
		for (let r = t - 1; r >= 0 && !n[e]?.[r]?.isBlack; r--) i = r;
		let a = 0;
		for (let t = i; t < (n[0]?.length ?? 0) && !n[e]?.[t]?.isBlack; t++) a += 1;
		return a;
	}
	getDownWordLength(e, t) {
		let n = this.getCells();
		if (!n) return 0;
		let r = n[e]?.[t];
		if (!r || r.isBlack) return 0;
		let i = e;
		for (let r = e - 1; r >= 0 && !n[r]?.[t]?.isBlack; r--) i = r;
		let a = 0;
		for (let e = i; e < n.length && !n[e]?.[t]?.isBlack; e++) a += 1;
		return a;
	}
	getIncorrectCoords() {
		let e = this.getCells();
		if (!e) return [];
		let t = [];
		for (let n = 0; n < e.length; n++) for (let r = 0; r < (e[0]?.length ?? 0); r++) {
			let i = e[n]?.[r];
			i && !i.isBlack && !i.isInitial && i.value !== "" && typeof i.solution == "string" && i.value !== i.solution && t.push({
				row: n,
				col: r
			});
		}
		return t;
	}
}, s = ".tp-crossword{--tp-game-cell-size:3rem;--tp-game-symbol-font-size:1.5rem;--tp-game-symbol-font-weight:800;box-sizing:border-box;background:#f9f9fb;border:1px solid #e0e0e0;border-radius:8px;max-width:980px;margin:1rem 0;padding:1rem;font-family:system-ui,-apple-system,sans-serif;display:flow-root}.tp-crossword *,.tp-crossword :before,.tp-crossword :after{box-sizing:border-box}.tp-crossword-container{gap:1rem;display:grid}.tp-crossword-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;display:flex}.tp-crossword-title{font-size:1.25rem;font-weight:700}.tp-crossword-controls{flex-wrap:nowrap;align-items:center;gap:.5rem;max-width:100%;display:flex;overflow-x:auto}.tp-crossword-controls>*{flex:none}.tp-crossword button{appearance:none;color:#fff;cursor:pointer;box-sizing:border-box;background:#0b63ce;border:0;border-radius:4px;height:2.25rem;padding:0 .9rem}.tp-crossword button:disabled{cursor:not-allowed;background:#c3c7cf}.tp-crossword select{color:#223;width:auto;min-width:0;max-width:none;height:2.25rem;font:inherit;box-sizing:border-box;background:#fff;border:1px solid #c7d2e0;border-radius:4px;padding:0 .7rem}.tp-crossword-board-wrap{overflow-x:auto}.tp-crossword-grid{background:#333;border:2px solid #333;gap:1px;width:max-content;margin:0 auto;padding:2px;display:grid}.tp-crossword-table{border-collapse:collapse;margin:0 auto}.tp-crossword-corner,.tp-crossword-col-label,.tp-crossword-row-label{text-align:center;color:#4a5568;background:#eef2f8;padding:.25rem .4rem;font-size:.85rem}.tp-crossword-mode-toggle{color:#1f2d3d;cursor:pointer;background:#fff;border:1px solid #c7d2e0;border-radius:4px;justify-content:center;align-items:center;width:1.8rem;height:1.8rem;padding:0;font:700 1rem/1 system-ui,-apple-system,sans-serif;display:inline-flex}.tp-crossword-mode-toggle:hover{background:#f0f6ff}.tp-crossword-cell{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);min-width:var(--tp-game-cell-size);min-height:var(--tp-game-cell-size);background:#fff;border:1px solid #b9c3d2;padding:0}.tp-crossword-cell.black{background:#222}.tp-crossword-cell.silent-black{background:#fff}.tp-crossword-cell.initial .tp-crossword-input{color:#1d4f91;background:#dbe7ff;font-weight:800}.tp-crossword-cell.initial.current-word-primary .tp-crossword-input,.tp-crossword-cell.initial.current-word-secondary .tp-crossword-input{background:#cfe0ff}.tp-crossword-cell.incorrect .tp-crossword-input{color:#c62828;background:#ffebee}.tp-crossword-cell.current-word-primary .tp-crossword-input{background:#dbeafe}.tp-crossword-cell.current-word-secondary .tp-crossword-input{background:#eef4ff}.tp-crossword-cell.current-cell{box-shadow:inset 0 0 0 2px #0b63ce}.tp-crossword-input{text-align:center;text-transform:uppercase;width:100%;height:100%;font:var(--tp-game-symbol-font-weight) var(--tp-game-symbol-font-size)/1 system-ui, -apple-system, sans-serif;color:#111;background:0 0;border:none;outline:none;padding:0}.tp-crossword-input:focus-visible{outline:var(--tp-focus-ring,2px solid #0b63ce);outline-offset:-2px}.tp-crossword-clues{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;display:grid}.tp-crossword-current-clues{gap:.35rem;display:grid}.tp-crossword-current-clue{border-radius:4px;padding:.4rem .55rem}.tp-crossword-current-clue.primary{background:#dbeafe}.tp-crossword-current-clue.secondary{background:#eef4ff}.tp-crossword-clues h4{margin:0 0 .5rem}.tp-crossword-clue-list{margin:0;padding:0;list-style:none}.tp-crossword-clue-list li{border-radius:4px;align-items:baseline;gap:.45rem;margin:.2rem 0;padding:.15rem .3rem;display:flex}.tp-crossword-clue-label{color:#23344d;min-width:2.2rem;font-weight:700}.tp-crossword-clue-part{border-radius:3px;padding:.05rem .2rem}.tp-crossword-clue-label.active-primary,.tp-crossword-clue-part.active-primary{background:#dbeafe}.tp-crossword-clue-label.active-secondary,.tp-crossword-clue-part.active-secondary,.tp-crossword-clue-item[data-selected=true],.tp-crossword-clue-item[data-active=true]{background:#eef4ff}.tp-crossword-status{text-align:center;border-radius:4px;padding:.65rem;font-weight:500}.tp-crossword-status.success{color:#155724;background:#d4edda}.tp-crossword-status.info{color:#1e3a8a;background:#dbeafe}.tp-crossword-error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;padding:1rem}", c = class t extends e {
	static styleId = "tp-crossword-styles";
	engine = null;
	gridElement = null;
	currentCluesElement = null;
	cluesElement = null;
	statusElement = null;
	undoButton = null;
	redoButton = null;
	assistSelect = null;
	focusedCell = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.styleId, s), this.classList.add("tp-crossword");
		try {
			let e = this.dataset.crosswordPuzzle, t = this.dataset.crosswordSilent === "true";
			if (this.hasAttribute("silent") && (t = !0), e ||= this.parsePuzzleFromDL(), !e) {
				this.renderError("Empty crossword puzzle");
				return;
			}
			this.engine = new o({ onChange: () => this.onEngineChange() }), this.engine.initialize(e, { silent: t }), this.render();
		} catch (e) {
			this.renderError(e instanceof Error ? e.message : String(e));
		}
	}
	parsePuzzleFromDL() {
		let e = this.querySelector("dl");
		if (!e) return;
		let t = {
			solution: [],
			across: [],
			down: []
		}, n = null;
		for (let r of e.children) if (r.tagName === "DT") {
			let e = r.textContent?.toLowerCase().trim() ?? "";
			e === "across" || e === "horizontal" ? n = "across" : e === "down" || e === "vertical" ? n = "down" : e === "solution" && (n = "solution");
		} else if (r.tagName === "DD" && n) {
			let e = r.querySelectorAll("li");
			for (let r of e) {
				let e = r.textContent?.trim() ?? "";
				if (e) {
					let r = t[n];
					r && r.push(e);
				}
			}
		}
		let r = t.solution;
		if (!r || r.length === 0) return;
		let i = [];
		for (let e = 0; e < r.length; e++) {
			let t = String.fromCharCode(97 + e);
			i.push(`${t}. ${r[e]}`);
		}
		let a = t.across;
		if (a) for (let e = 0; e < a.length; e++) {
			let t = String.fromCharCode(65 + e), n = a[e]?.replace(/^[A-Za-z]\.\s*/, "") ?? "";
			i.push(`${t}. ${n}`);
		}
		let o = t.down;
		if (o) for (let e = 0; e < o.length; e++) {
			let t = e + 1, n = o[e]?.replace(/^\d+\.\s*/, "") ?? "";
			i.push(`${t}. ${n}`);
		}
		return i.join("\n");
	}
	render() {
		this.innerHTML = "\n      <div class=\"tp-crossword-container\">\n        <div class=\"tp-crossword-header\">\n          <div class=\"tp-crossword-title\">Crossword</div>\n          <div class=\"tp-crossword-controls\">\n            <button class=\"tp-crossword-undo\" disabled>Undo</button>\n            <button class=\"tp-crossword-redo\" disabled>Redo</button>\n            <select class=\"tp-crossword-assist\" aria-label=\"Assistance actions\">\n              <option value=\"\">Assist…</option>\n              <option value=\"reset-game\">Reset the game</option>\n              <option value=\"show-incorrect\">Show all incorrect boxes</option>\n              <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n              <option value=\"show-cell\">Show the box</option>\n              <option value=\"show-word\">Show the word</option>\n              <option value=\"show-solution\">Show the solution</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"tp-crossword-board-wrap\">\n          <div class=\"tp-crossword-grid\"></div>\n        </div>\n\n        <div class=\"tp-crossword-current-clues\"></div>\n        <div class=\"tp-crossword-clues\"></div>\n        <div class=\"tp-crossword-status\"></div>\n      </div>\n    ", this.gridElement = this.querySelector(".tp-crossword-grid"), this.currentCluesElement = this.querySelector(".tp-crossword-current-clues"), this.cluesElement = this.querySelector(".tp-crossword-clues"), this.statusElement = this.querySelector(".tp-crossword-status"), this.undoButton = this.querySelector(".tp-crossword-undo"), this.redoButton = this.querySelector(".tp-crossword-redo"), this.assistSelect = this.querySelector(".tp-crossword-assist"), !(!this.engine || !this.gridElement || !this.cluesElement) && (this.engine.renderGrid(this.gridElement), this.renderClues(), this.attachEventListeners(), this.updateStatus(), this.updateClueHighlights(), this.updateCurrentClues());
	}
	attachEventListeners() {
		if (!(!this.engine || !this.gridElement || !this.undoButton || !this.redoButton || !this.assistSelect)) {
			this.undoButton.addEventListener("click", () => {
				this.engine?.undo(), this.updateStatus();
			}), this.redoButton.addEventListener("click", () => {
				this.engine?.redo(), this.updateStatus();
			}), this.assistSelect.addEventListener("change", () => {
				if (!(!this.engine || !this.assistSelect || !this.cluesElement)) {
					switch (this.assistSelect.value) {
						case "reset-game":
							this.engine.resetGame(), this.renderClues();
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
						case "show-word":
							this.focusedCell && this.engine.showWord(this.focusedCell.row, this.focusedCell.col);
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
			this.gridElement.addEventListener("focus", (e) => {
				if (e.target instanceof HTMLInputElement) {
					let t = Number.parseInt(e.target.dataset.row ?? "0", 10), n = Number.parseInt(e.target.dataset.col ?? "0", 10);
					this.focusedCell = {
						row: t,
						col: n
					}, queueMicrotask(() => {
						this.updateClueHighlights(), this.updateCurrentClues();
					});
				}
			}, !0);
		}
	}
	renderClues() {
		if (!this.engine || !this.cluesElement) return;
		let e = this.engine.getClues(), t = this.renderClueItems(e.across, "across"), n = this.renderClueItems(e.down, "down");
		this.cluesElement.innerHTML = `
      <section>
        <h4>Across</h4>
        <ul class="tp-crossword-clue-list">${t}</ul>
      </section>
      <section>
        <h4>Down</h4>
        <ul class="tp-crossword-clue-list">${n}</ul>
      </section>
    `;
	}
	renderClueItems(e, t) {
		return e.map((e) => {
			let { label: n, text: r } = this.splitClueLabel(e), i = this.normalizeClueKey(n), a = this.splitClueParts(r).map((e, t) => `<span class="tp-crossword-clue-part" data-part-index="${t}">${this.escapeHtml(e)}</span>`).join(" ");
			return n === "" ? `<li class="tp-crossword-clue-item" data-direction="${t}" data-clue-key=""><span class="tp-crossword-clue-text">${a}</span></li>` : `<li class="tp-crossword-clue-item" data-direction="${t}" data-clue-key="${this.escapeHtml(i)}"><span class="tp-crossword-clue-label">${this.escapeHtml(n)}</span><span class="tp-crossword-clue-text">${a}</span></li>`;
		}).join("");
	}
	splitClueLabel(e) {
		let t = e.trim(), n = t.match(/^([A-Za-z0-9]+)\.\s*(.*)$/);
		return n ? {
			label: `${n[1]}.`,
			text: n[2] ?? ""
		} : {
			label: "",
			text: t
		};
	}
	normalizeClueKey(e) {
		return e.replace(/\.$/, "").toUpperCase();
	}
	splitClueParts(e) {
		let t = e.trim();
		return t === "" ? [""] : t.split(/(?<=\.)\s+(?=[A-ZÀ-ÖØ-Þ0-9])/u).map((e) => e.trim()).filter((e) => e.length > 0);
	}
	escapeHtml(e) {
		return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
	}
	onEngineChange() {
		this.updateStatus(), this.updateClueHighlights(), this.updateCurrentClues();
	}
	updateClueHighlights() {
		if (!this.engine || !this.cluesElement) return;
		let e = this.engine.isSilent(), t = this.cluesElement.querySelectorAll(".tp-crossword-clue-item");
		for (let e of t) {
			e.classList.remove("active-primary", "active-secondary"), e.querySelector(".tp-crossword-clue-label")?.classList.remove("active-primary", "active-secondary");
			let t = e.querySelectorAll(".tp-crossword-clue-part");
			for (let e of t) e.classList.remove("active-primary", "active-secondary");
		}
		let n = this.engine.getActiveClues();
		if (!n) return;
		let r = n.across ? this.cluesElement.querySelector(`.tp-crossword-clue-item[data-direction="across"][data-clue-key="${n.across.key}"]`) : null, i = n.down ? this.cluesElement.querySelector(`.tp-crossword-clue-item[data-direction="down"][data-clue-key="${n.down.key}"]`) : null;
		n.primary === "across" ? (n.across && this.setClueHighlight(r, n.across.partIndex, "active-primary", e), n.down && this.setClueHighlight(i, n.down.partIndex, "active-secondary", e)) : (n.down && this.setClueHighlight(i, n.down.partIndex, "active-primary", e), n.across && this.setClueHighlight(r, n.across.partIndex, "active-secondary", e));
	}
	setClueHighlight(e, t, n, r = !1) {
		if (!e) return;
		e.classList.add(n), e.querySelector(".tp-crossword-clue-label")?.classList.add(n);
		let i = e.querySelectorAll(".tp-crossword-clue-part");
		if (i.length !== 0) {
			if (r) {
				for (let e of i) e.classList.add(n);
				return;
			}
			i[Math.min(Math.max(t, 0), i.length - 1)]?.classList.add(n);
		}
	}
	updateCurrentClues() {
		if (!this.engine || !this.currentCluesElement || !this.cluesElement) return;
		let e = this.engine.isSilent(), t = this.engine.getActiveClues();
		if (!t) {
			this.currentCluesElement.innerHTML = "";
			return;
		}
		let n = t.primary, r = t.secondary, i = n === "across" ? t.across : t.down, a = r === "across" ? t.across : t.down, o = [];
		if (i) {
			let t = this.getCurrentClueText(n, i.key, i.partIndex, e);
			t && o.push(`<div class="tp-crossword-current-clue primary">${this.escapeHtml(t)}</div>`);
		}
		if (a) {
			let t = this.getCurrentClueText(r, a.key, a.partIndex, e);
			t && o.push(`<div class="tp-crossword-current-clue secondary">${this.escapeHtml(t)}</div>`);
		}
		this.currentCluesElement.innerHTML = o.join("");
	}
	getCurrentClueText(e, t, n, r = !1) {
		if (!this.cluesElement) return "";
		let i = this.cluesElement.querySelector(`.tp-crossword-clue-item[data-direction="${e}"][data-clue-key="${t}"]`);
		if (!i) return "";
		let a = i.querySelector(".tp-crossword-clue-label")?.textContent?.trim() ?? `${t}.`;
		if (r) return `${a} ${i.querySelector(".tp-crossword-clue-text")?.textContent?.trim() ?? ""}`.trim();
		let o = Array.from(i.querySelectorAll(".tp-crossword-clue-part"));
		return o.length === 0 ? "" : `${a} ${o[Math.min(Math.max(n, 0), o.length - 1)]?.textContent ?? ""}`.trim();
	}
	updateStatus() {
		if (!this.statusElement || !this.engine || !this.undoButton || !this.redoButton) return;
		let e = this.engine.getValidation();
		if (this.undoButton.disabled = !this.engine.canUndo(), this.redoButton.disabled = !this.engine.canRedo(), this.statusElement.className = "tp-crossword-status", e.isComplete) this.statusElement.textContent = "✓ Solved!", this.statusElement.classList.add("success");
		else {
			let e = this.engine.countEmptyCells();
			this.statusElement.textContent = `${e} empty cell${e === 1 ? "" : "s"}`, this.statusElement.classList.add("info");
		}
	}
	renderError(e) {
		this.innerHTML = `<div class="tp-crossword-error">Error: ${e}</div>`;
	}
};
customElements.get("tp-crossword") || customElements.define("tp-crossword", c);
//#endregion
export { c as t };

