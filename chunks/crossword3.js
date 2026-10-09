import { t as e } from "./board2.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/crossword.js
var t = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
function n(e) {
	return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}
function r(e, r) {
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
		if (!t.test(o)) throw Error(`Invalid crossword character '${o}' in row ${r}`);
		let s = n(o), c = e.charAt(a + 1) === "!";
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
function i(e) {
	let t = e.split("\n").map((e) => e.trim()).filter((e) => e.length > 0), n = [], i = [], a = [], o = "rows";
	for (let e of t) {
		let t = /^([a-z])\.\s*(.+)$/.exec(e), s = /^([A-Z])\.\s*(.+)$/.exec(e), c = /^(\d+)\.\s*(.+)$/.exec(e);
		if (t) {
			if (o !== "rows") throw Error("Row definitions must come before clues");
			let e = t[1] ?? "", i = t[2] ?? "";
			n.push({
				label: e.toUpperCase(),
				cells: r(i, e.toUpperCase())
			});
			continue;
		}
		if (s) {
			o = "row-clues", i.push(e);
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
		rowClues: i,
		colClues: a
	};
}
var a = class {
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
	initialize(t, n = {}) {
		let r = i(t);
		if (n.silent === !0) for (let e of r.rows) for (let t of e) t.isBlack && (t.isEditable = !0);
		this.puzzle = r, this.board = new e({
			rows: r.rows.length,
			cols: r.colCount
		}, r.rows), this.initialPuzzle = t, this.silentBlackCells = n.silent === !0, this.revealIncorrect = !1, this.activeCell = null, this.orientation = "across";
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
}, o = {
	id: "crossword",
	async render(e) {
		let t = e.querySelectorAll(".tp-crossword[data-crossword-puzzle]");
		for (let e of t) {
			if (!(e instanceof HTMLElement)) continue;
			let t = e.getAttribute("data-crossword-puzzle");
			if (!t) continue;
			let n = e.getAttribute("data-crossword-silent") === "true";
			try {
				let r = null;
				e.innerHTML = "\n          <div class=\"tp-crossword-container\">\n            <div class=\"tp-crossword-header\">\n              <div class=\"tp-crossword-title\">Crossword</div>\n              <div class=\"tp-crossword-controls\">\n                <button class=\"tp-crossword-undo\" disabled>Undo</button>\n                <button class=\"tp-crossword-redo\" disabled>Redo</button>\n                <select class=\"tp-crossword-assist\">\n                  <option value=\"\">Assist…</option>\n                  <option value=\"reset-game\">Reset the game</option>\n                  <option value=\"show-incorrect\">Show all incorrect boxes</option>\n                  <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n                  <option value=\"show-cell\">Show the box</option>\n                  <option value=\"show-word\">Show the word</option>\n                  <option value=\"show-solution\">Show the solution</option>\n                </select>\n              </div>\n            </div>\n            <div class=\"tp-crossword-board-wrap\">\n              <div class=\"tp-crossword-grid\"></div>\n            </div>\n            <div class=\"tp-crossword-current-clues\"></div>\n            <div class=\"tp-crossword-clues\"></div>\n            <div class=\"tp-crossword-status\"></div>\n          </div>\n        ";
				let i = e.querySelector(".tp-crossword-grid"), o = e.querySelector(".tp-crossword-current-clues"), l = e.querySelector(".tp-crossword-clues"), u = e.querySelector(".tp-crossword-status"), d = e.querySelector(".tp-crossword-undo"), f = e.querySelector(".tp-crossword-redo"), m = e.querySelector(".tp-crossword-assist"), g = new a({ onChange: () => {
					s(g, u, d, f), p(g, l), h(g, l, o);
				} });
				g.initialize(t, { silent: n }), g.renderGrid(i), c(g, l), m.addEventListener("change", () => {
					switch (m.value) {
						case "reset-game":
							g.resetGame(), c(g, l);
							break;
						case "show-incorrect":
							g.showIncorrectCells();
							break;
						case "clear-incorrect":
							g.clearIncorrectCells();
							break;
						case "show-cell":
							if (g.getActiveCell()) {
								let e = g.getActiveCell();
								e && g.showCell(e.row, e.col);
							} else r && g.showCell(r.row, r.col);
							break;
						case "show-word":
							if (g.getActiveCell()) {
								let e = g.getActiveCell();
								e && g.showWord(e.row, e.col);
							} else r && g.showWord(r.row, r.col);
							break;
						case "show-solution":
							g.showSolution();
							break;
						default: break;
					}
					m.value = "", s(g, u, d, f), p(g, l), h(g, l, o);
				}), i.addEventListener("focus", (e) => {
					e.target instanceof HTMLInputElement && (r = {
						row: Number.parseInt(e.target.dataset.row ?? "0", 10),
						col: Number.parseInt(e.target.dataset.col ?? "0", 10)
					}, queueMicrotask(() => {
						p(g, l), h(g, l, o);
					}));
				}, !0);
				for (let t of e.querySelectorAll(".tp-crossword-mode-toggle")) t.addEventListener("mousedown", (e) => e.preventDefault());
				d.addEventListener("click", () => {
					g.undo(), s(g, u, d, f);
				}), f.addEventListener("click", () => {
					g.redo(), s(g, u, d, f);
				});
				for (let e of [d, f]) e.addEventListener("mousedown", (e) => e.preventDefault());
				s(g, u, d, f), p(g, l), h(g, l, o);
			} catch (t) {
				console.error("Failed to initialize crossword:", t), e.innerHTML = `<div class="tp-crossword-error">Error: ${t instanceof Error ? t.message : String(t)}</div>`;
			}
		}
	}
};
function s(e, t, n, r) {
	n.disabled = !e.canUndo(), r.disabled = !e.canRedo();
	let i = e.getValidation(), a = e.countEmptyCells(), o = e.countIncorrectCells(), s = e.getOrientation();
	if (t.className = "tp-crossword-status", i.isComplete) {
		t.classList.add("success"), t.textContent = "✓ Solved!";
		return;
	}
	t.classList.add("info"), e.isShowingIncorrectCells() && o > 0 ? t.textContent = `${a} empty · ${o} incorrect shown · mode: ${s}` : t.textContent = `${a} empty · mode: ${s}`;
}
function c(e, t) {
	let n = e.getClues();
	t.innerHTML = `
    <section>
      <h4>Across</h4>
      <ul class="tp-crossword-clue-list">${l(n.across, "across")}</ul>
    </section>
    <section>
      <h4>Down</h4>
      <ul class="tp-crossword-clue-list">${l(n.down, "down")}</ul>
    </section>
  `;
}
function l(e, t) {
	return e.map((e) => {
		let { label: n, text: r } = u(e), i = d(n), a = f(r).map((e, t) => `<span class="tp-crossword-clue-part" data-part-index="${t}">${_(e)}</span>`).join(" ");
		return n === "" ? `<li class="tp-crossword-clue-item" data-direction="${t}" data-clue-key=""><span class="tp-crossword-clue-text">${a}</span></li>` : `<li class="tp-crossword-clue-item" data-direction="${t}" data-clue-key="${_(i)}"><span class="tp-crossword-clue-label">${_(n)}</span><span class="tp-crossword-clue-text">${a}</span></li>`;
	}).join("");
}
function u(e) {
	let t = e.trim(), n = t.match(/^([A-Za-z0-9]+)\.\s*(.*)$/);
	return n ? {
		label: `${n[1]}.`,
		text: n[2] ?? ""
	} : {
		label: "",
		text: t
	};
}
function d(e) {
	return e.replace(/\.$/, "").toUpperCase();
}
function f(e) {
	let t = e.trim();
	return t === "" ? [""] : t.split(/(?<=\.)\s+(?=[A-ZÀ-ÖØ-Þ0-9])/u).map((e) => e.trim()).filter((e) => e.length > 0);
}
function p(e, t) {
	let n = e.isSilent(), r = t.querySelectorAll(".tp-crossword-clue-item");
	for (let e of r) {
		e.classList.remove("active-primary", "active-secondary"), e.querySelector(".tp-crossword-clue-label")?.classList.remove("active-primary", "active-secondary");
		let t = e.querySelectorAll(".tp-crossword-clue-part");
		for (let e of t) e.classList.remove("active-primary", "active-secondary");
	}
	let i = e.getActiveClues();
	if (!i) return;
	let a = i.across ? t.querySelector(`.tp-crossword-clue-item[data-direction="across"][data-clue-key="${i.across.key}"]`) : null, o = i.down ? t.querySelector(`.tp-crossword-clue-item[data-direction="down"][data-clue-key="${i.down.key}"]`) : null;
	i.primary === "across" ? (i.across && m(a, i.across.partIndex, "active-primary", n), i.down && m(o, i.down.partIndex, "active-secondary", n)) : (i.down && m(o, i.down.partIndex, "active-primary", n), i.across && m(a, i.across.partIndex, "active-secondary", n));
}
function m(e, t, n, r = !1) {
	if (!e) return;
	e.classList.add(n), e.querySelector(".tp-crossword-clue-label")?.classList.add(n);
	let i = Array.from(e.querySelectorAll(".tp-crossword-clue-part"));
	if (i.length !== 0) {
		if (r) {
			for (let e of i) e.classList.add(n);
			return;
		}
		i[Math.min(Math.max(t, 0), i.length - 1)]?.classList.add(n);
	}
}
function h(e, t, n) {
	let r = e.isSilent(), i = e.getActiveClues();
	if (!i) {
		n.textContent = "";
		return;
	}
	let a = i.primary, o = i.secondary, s = a === "across" ? i.across : i.down, c = o === "across" ? i.across : i.down, l = [];
	if (s) {
		let e = g(t, a, s.key, s.partIndex, r);
		e && l.push(`<div class="tp-crossword-current-clue primary">${_(e)}</div>`);
	}
	if (c) {
		let e = g(t, o, c.key, c.partIndex, r);
		e && l.push(`<div class="tp-crossword-current-clue secondary">${_(e)}</div>`);
	}
	n.innerHTML = l.join("");
}
function g(e, t, n, r, i = !1) {
	let a = e.querySelector(`.tp-crossword-clue-item[data-direction="${t}"][data-clue-key="${n}"]`);
	if (!a) return "";
	let o = a.querySelector(".tp-crossword-clue-label")?.textContent?.trim() ?? `${n}.`;
	if (i) return `${o} ${a.querySelector(".tp-crossword-clue-text")?.textContent?.trim() ?? ""}`.trim();
	let s = Array.from(a.querySelectorAll(".tp-crossword-clue-part"));
	return s.length === 0 ? `${o} ${a.querySelector(".tp-crossword-clue-text")?.textContent?.trim() ?? ""}`.trim() : `${o} ${s[Math.min(Math.max(r, 0), s.length - 1)]?.textContent?.trim() ?? ""}`.trim();
}
function _(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
//#endregion
export { o as default };

