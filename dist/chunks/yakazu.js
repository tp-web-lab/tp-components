import { Zu as e } from "./lib/typescript/typescript.js";
import { t } from "./board.js";
//#region ../tp-utilities/dist/games/yakazu/yakazu-parser.js
function n(e) {
	let t = e.trim().split("\n").filter((e) => e.trim().length > 0);
	if (t.length !== 9) throw Error(`Yakazu must have exactly 9 rows, got ${t.length}`);
	let n = [], r = 0;
	for (let e = 0; e < 9; e++) {
		let i = t[e];
		if (!i) throw Error(`Missing row ${e}`);
		let a = [];
		for (let t = 0; t < i.length; t++) {
			let n = i.charAt(t);
			if (!/\s/.test(n)) {
				if (n === "#") {
					a.push({
						value: "",
						isEditable: !1,
						isBlack: !0,
						isInitial: !1,
						isError: !1,
						notes: []
					});
					continue;
				}
				if (n === ".") {
					a.push({
						value: "",
						isEditable: !0,
						isBlack: !1,
						isInitial: !1,
						isError: !1,
						notes: []
					});
					continue;
				}
				if (/[1-9]/.test(n)) {
					let e = n, r = !1;
					t + 1 < i.length && i[t + 1] === "!" && (r = !0, t += 1), a.push({
						value: r ? e : "",
						isEditable: !r,
						isBlack: !1,
						isInitial: r,
						solution: e,
						isError: !1,
						notes: []
					});
					continue;
				}
				throw Error(n === "!" ? `Unexpected '!' at row ${e}, col ${a.length}` : `Invalid character '${n}' at row ${e}, col ${a.length}: expected digit, '.', '#', or '!'`);
			}
		}
		if (a.length > 9) throw Error(`Row ${e} has ${a.length} columns, expected at most 9`);
		r = Math.max(r, a.length), n.push(a);
	}
	if (r === 0) throw Error("Yakazu puzzle cannot be empty");
	return n.map((e) => e.length === r ? e : e.concat(Array.from({ length: r - e.length }, () => ({
		value: "",
		isEditable: !1,
		isBlack: !0,
		isInitial: !1,
		isError: !1,
		notes: []
	}))));
}
//#endregion
//#region ../tp-utilities/dist/games/yakazu/yakazu-rules.js
function r(e, t, n) {
	let r = `${t.row}:${t.col}:${n}`;
	e.has(r) || e.set(r, {
		coord: t,
		type: n
	});
}
function i(e, t, n) {
	let i = e.filter(({ cell: e }) => e.value !== "");
	if (i.length === 0) return;
	let a = e.length, o = /* @__PURE__ */ new Set(), s = !1;
	for (let { coord: e, cell: c } of i) {
		let i = Number(c.value);
		(!Number.isInteger(i) || i < 1 || i > a || o.has(c.value)) && (s = !0), o.add(c.value), (i < 1 || i > a) && r(n, e, t);
	}
	if (s) for (let { coord: e } of i) r(n, e, t);
}
function a(e) {
	let t = /* @__PURE__ */ new Map(), n = e[0]?.length ?? 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (!r) continue;
		let a = [];
		for (let e = 0; e < r.length; e++) {
			let o = r[e];
			if (o) {
				if (o.isBlack) {
					i(a, "row", t), a = [];
					continue;
				}
				a.push({
					coord: {
						row: n,
						col: e
					},
					cell: o
				});
			}
		}
		i(a, "row", t);
	}
	for (let r = 0; r < n; r++) {
		let n = [];
		for (let a = 0; a < e.length; a++) {
			let o = e[a]?.[r];
			if (o) {
				if (o.isBlack) {
					i(n, "col", t), n = [];
					continue;
				}
				n.push({
					coord: {
						row: a,
						col: r
					},
					cell: o
				});
			}
		}
		i(n, "col", t);
	}
	for (let i = 0; i < e.length; i++) for (let a = 0; a < n; a++) {
		let n = e[i]?.[a];
		!n || n.isBlack || n.value === "" || typeof n.solution != "string" || n.value !== n.solution && (r(t, {
			row: i,
			col: a
		}, "row"), r(t, {
			row: i,
			col: a
		}, "col"));
	}
	let a = Array.from(t.values()), o = e.flat().filter((e) => !!e && !e.isBlack).every((e) => e.value !== "") && a.length === 0;
	return {
		isValid: a.length === 0,
		isComplete: o,
		conflicts: a
	};
}
//#endregion
//#region ../tp-utilities/dist/games/yakazu/yakazu-engine.js
var o = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
], s = class {
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
			rows: r.length,
			cols: r[0]?.length ?? 0
		}, r), this.initialPuzzle = e, this.revealIncorrect = !1, this.activeCell = null, this.entryMode = "game";
	}
	renderGrid(e) {
		let t = this.getYakazuCells(), n = this.board?.getDimensions();
		if (!t || !n) throw Error("Engine not initialized. Call initialize() first.");
		this.gridElement = e, e.innerHTML = "", e.className = "tp-yakazu-grid", e.style.gridTemplateColumns = `repeat(${n.cols}, minmax(0, 1fr))`;
		let r = this.getValidation(), i = new Set(r.conflicts.map(({ coord: e }) => `${e.row}:${e.col}`));
		for (let r = 0; r < n.rows; r++) for (let a = 0; a < n.cols; a++) {
			let n = t[r]?.[a];
			if (!n) continue;
			let o = document.createElement("div");
			if (o.className = "tp-yakazu-cell", n.isBlack) {
				o.classList.add("black"), o.addEventListener("click", () => {
					this.clearActiveCell();
				}), e.appendChild(o);
				continue;
			}
			n.isInitial && o.classList.add("initial"), this.revealIncorrect && !n.isInitial && i.has(`${r}:${a}`) && o.classList.add("incorrect"), this.isHighlightedCell(r, a) && o.classList.add("current-line"), this.activeCell?.row === r && this.activeCell?.col === a && o.classList.add("current-cell");
			let s = n.value === "" ? this.getCellNotes(n) : [];
			s.length > 0 && (o.classList.add("has-notes"), o.appendChild(this.createNotesElement(s)));
			let c = document.createElement("input");
			c.type = "text", c.className = "tp-yakazu-input", c.value = n.value, c.maxLength = 1, c.inputMode = "numeric", c.readOnly = n.isInitial, c.dataset.row = String(r), c.dataset.col = String(a), c.setAttribute("aria-label", `Yakazu cell ${r + 1},${a + 1}`), c.addEventListener("click", () => {
				this.setActiveCell(r, a);
			}), c.addEventListener("focus", () => {
				this.setActiveCell(r, a), !n.isInitial && c.value !== "" && requestAnimationFrame(() => c.select());
			}), n.isInitial || c.addEventListener("input", (e) => {
				let t = e.target, n = t.value.trim();
				if (n &&= n.charAt(n.length - 1), n && !/^[1-9]$/.test(n) && (t.value = "", n = ""), this.entryMode === "note" && n !== "") {
					t.value = "", this.toggleNote(r, a, n);
					return;
				}
				this.setCell(r, a, n);
			}), o.appendChild(c), e.appendChild(o);
		}
		this.attachKeyboardNavigation(e), this.restoreActiveCellFocus();
	}
	getValidation() {
		let e = this.getYakazuCells();
		return e ? a(e) : {
			isValid: !0,
			isComplete: !1,
			conflicts: []
		};
	}
	countEmptyCells() {
		let e = this.getYakazuCells();
		return e ? e.flat().filter((e) => !e.isBlack && e.value === "").length : 0;
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
	getActiveCell() {
		return this.activeCell ? { ...this.activeCell } : null;
	}
	setActiveCell(e, t, n = !1) {
		let r = this.activeCell;
		if (this.activeCell = {
			row: e,
			col: t
		}, this.revealIncorrect) {
			this.revealIncorrect = !1, this.gridElement && this.renderGrid(this.gridElement), n && this.focusCell(e, t);
			return;
		}
		this.refreshActiveHighlights(), (!r || r.row !== e || r.col !== t) && this.onChange?.({
			kind: "assist",
			row: e,
			col: t
		}), n && this.focusCell(e, t);
	}
	clearActiveCell() {
		this.activeCell && (this.activeCell = null, this.refreshActiveHighlights(), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}));
	}
	setCell(e, t, n) {
		this.board && (this.revealIncorrect &&= !1, this.activeCell = {
			row: e,
			col: t
		}, this.board.setCellState({
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
		return this.revealIncorrect = !1, t && this.gridElement && this.renderGrid(this.gridElement), t && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), t;
	}
	showCell(e, t) {
		if (!this.board) return !1;
		let n = this.getYakazuCells()?.[e]?.[t];
		if (!n || n.isBlack || n.isInitial || typeof n.solution != "string") return !1;
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
		let e = this.getYakazuCells(), t = this.board.getDimensions();
		if (!e) return !1;
		let n = [];
		for (let r = 0; r < t.rows; r++) for (let i = 0; i < t.cols; i++) {
			let t = e[r]?.[i];
			!t || t.isBlack || t.isInitial || typeof t.solution != "string" || t.value === t.solution || n.push({
				coord: {
					row: r,
					col: i
				},
				updates: {
					value: t.solution,
					notes: []
				}
			});
		}
		if (n.length === 0) return !1;
		let r = this.board.setCellsState(n, "show solution");
		return r && this.gridElement && this.renderGrid(this.gridElement), r && this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), r;
	}
	resetGame() {
		if (this.initialPuzzle === "") return !1;
		let e = n(this.initialPuzzle);
		return this.board = new t({
			rows: 9,
			cols: 9
		}, e), this.revealIncorrect = !1, this.activeCell = null, this.entryMode = "game", this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "assist",
			row: -1,
			col: -1
		}), !0;
	}
	hideIncorrectCells() {
		this.revealIncorrect = !1, this.gridElement && this.renderGrid(this.gridElement);
	}
	getYakazuCells() {
		let e = this.board?.getState();
		return e ? e.cells : null;
	}
	getIncorrectCoords() {
		let e = this.getYakazuCells();
		return e ? this.getValidation().conflicts.map(({ coord: e }) => e).filter(({ row: t, col: n }) => !e[t]?.[n]?.isInitial) : [];
	}
	attachKeyboardNavigation(e) {
		e.dataset.yakazuNavAttached !== "true" && (e.dataset.yakazuNavAttached = "true", e.addEventListener("keydown", (e) => {
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
					e.preventDefault(), e.target.readOnly || (this.entryMode === "note" ? (this.clearNotes(t, n), this.setActiveCell(t, n, !0)) : (this.setCell(t, n, ""), this.setActiveCell(t, n, !0)));
					return;
				case "Backspace":
					if (e.preventDefault(), this.entryMode === "note") {
						this.clearNotes(t, n), this.setActiveCell(t, n, !0);
						return;
					}
					this.setCell(t, n, ""), this.setActiveCell(t, n, !0);
					return;
				default: return;
			}
		}));
	}
	moveByDirection(e, t, n, r) {
		let i = this.findNextEditableCellWithWrap(e, t, n, r);
		i && this.setActiveCell(i.row, i.col, !0);
	}
	findNextEditableCellWithWrap(e, t, n, r) {
		let i = this.getYakazuCells(), a = this.board?.getDimensions();
		if (!i || !a) return null;
		let o = e, s = t;
		for (let e = 1; e < Math.max(a.rows, a.cols); e++) {
			o = (o + n + a.rows) % a.rows, s = (s + r + a.cols) % a.cols;
			let e = i[o]?.[s];
			if (e && e.isEditable && !e.isBlack) return {
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
		let e = this.gridElement.querySelectorAll(".tp-yakazu-cell");
		for (let t of e) t.classList.remove("current-line", "current-cell");
		if (!this.activeCell) return;
		for (let e of this.getHighlightedWordCells()) {
			let t = this.gridElement.querySelector(`input[data-row="${e.row}"][data-col="${e.col}"]`)?.closest(".tp-yakazu-cell");
			t && t.classList.add("current-line");
		}
		let t = this.gridElement.querySelector(`input[data-row="${this.activeCell.row}"][data-col="${this.activeCell.col}"]`)?.closest(".tp-yakazu-cell");
		t && t.classList.add("current-cell");
	}
	isHighlightedCell(e, t) {
		return this.getHighlightedWordCells().some((n) => n.row === e && n.col === t);
	}
	getHighlightedWordCells() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.getWordCellsForOrientation("across")) e.set(`${t.row}:${t.col}`, t);
		for (let t of this.getWordCellsForOrientation("down")) e.set(`${t.row}:${t.col}`, t);
		return [...e.values()];
	}
	getWordCellsForOrientation(e) {
		let t = this.activeCell, n = this.getYakazuCells(), r = this.board?.getDimensions();
		if (!t || !n || !r) return [];
		let i = n[t.row]?.[t.col];
		if (!i || i.isBlack) return [];
		let a = e === "across" ? 0 : 1, o = +(e === "across"), s = t.row, c = t.col;
		for (; s - a >= 0 && c - o >= 0;) {
			let e = s - a, t = c - o, r = n[e]?.[t];
			if (!r || r.isBlack) break;
			s = e, c = t;
		}
		let l = [], u = s, d = c;
		for (; u < r.rows && d < r.cols;) {
			let e = n[u]?.[d];
			if (!e || e.isBlack) break;
			l.push({
				row: u,
				col: d
			}), u += a, d += o;
		}
		return l;
	}
	restoreActiveCellFocus() {
		!this.gridElement || !this.activeCell || this.focusCell(this.activeCell.row, this.activeCell.col);
	}
	getCellNotes(e) {
		return [...e.notes ?? []].sort();
	}
	getCellNotesAt(e, t) {
		let n = this.getYakazuCells()?.[e]?.[t];
		return n ? this.getCellNotes(n) : [];
	}
	clearNotes(e, t) {
		this.board && this.board.setCellState({
			row: e,
			col: t
		}, { notes: [] }, "clear notes") && (this.activeCell = {
			row: e,
			col: t
		}, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "input",
			row: e,
			col: t
		}));
	}
	toggleNote(e, t, n) {
		if (!this.board) return;
		let r = this.getYakazuCells()?.[e]?.[t];
		if (!r || r.isBlack || r.value !== "") return;
		this.revealIncorrect &&= !1;
		let i = this.getCellNotes(r), a = i.includes(n) ? i.filter((e) => e !== n) : [...i, n].sort();
		this.board.setCellState({
			row: e,
			col: t
		}, { notes: a }, `toggle note ${n}`) && (this.activeCell = {
			row: e,
			col: t
		}, this.gridElement && this.renderGrid(this.gridElement), this.onChange?.({
			kind: "input",
			row: e,
			col: t
		}));
	}
	createNotesElement(e) {
		let t = document.createElement("div");
		t.className = "tp-yakazu-notes";
		for (let n of o) {
			let r = document.createElement("span");
			r.textContent = e.includes(n) ? n : "", t.appendChild(r);
		}
		return t;
	}
}, c = ".tp-yakazu{--tp-game-cell-size:3rem;--tp-game-symbol-font-size:1.5rem;--tp-game-symbol-font-weight:800;box-sizing:border-box;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;max-width:600px;margin:1rem 0;padding:1rem;font-family:system-ui,-apple-system,sans-serif;display:flow-root}.tp-yakazu *,.tp-yakazu :before,.tp-yakazu :after{box-sizing:border-box}.tp-yakazu-container{flex-direction:column;gap:1rem;display:flex}.tp-yakazu-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;display:flex}.tp-yakazu-title{color:#333;font-size:1.25rem;font-weight:700}.tp-yakazu-controls{flex-wrap:nowrap;align-items:center;gap:.5rem;display:flex}.tp-yakazu button{appearance:none;color:#fff;cursor:pointer;height:2.25rem;font:inherit;box-sizing:border-box;background:#0b63ce;border:0;border-radius:4px;padding:0 .9rem;transition:background .2s}.tp-yakazu button:hover:not(:disabled){background:#0056b3}.tp-yakazu button:disabled{cursor:not-allowed;background:#ccc}.tp-yakazu select{color:#223;max-width:none;height:2.25rem;font:inherit;box-sizing:border-box;background:#fff;border:1px solid #c7d2e0;border-radius:4px;padding:0 .7rem}.tp-yakazu-grid{background:#333;border:2px solid #333;gap:1px;width:max-content;max-width:100%;margin-inline:auto;padding:2px;display:grid;overflow:auto}.tp-yakazu-cell{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);min-width:var(--tp-game-cell-size);min-height:var(--tp-game-cell-size);background:#fff;justify-content:stretch;align-items:stretch;display:flex;position:relative}.tp-yakazu-cell.black{background:#222}.tp-yakazu-cell.initial .tp-yakazu-input{color:#1d4f91;background:#dbe7ff;font-weight:800}.tp-yakazu-cell.current-line .tp-yakazu-input{background:#e6f0ff}.tp-yakazu-cell.initial.current-line .tp-yakazu-input{background:#cfe0ff}.tp-yakazu-cell.incorrect .tp-yakazu-input{color:#c62828;background:#ffebee}.tp-yakazu-cell.current-cell{box-shadow:inset 0 0 0 2px #0b63ce}.tp-yakazu-cell.has-notes .tp-yakazu-input{background:0 0}.tp-yakazu-notes{pointer-events:none;color:#516071;text-align:center;grid-template-rows:repeat(3,1fr);grid-template-columns:repeat(3,1fr);align-items:center;padding:.12rem;font-size:.75rem;line-height:1;display:grid;position:absolute;inset:0}.tp-yakazu-input{text-align:center;text-transform:uppercase;width:100%;height:100%;font:var(--tp-game-symbol-font-weight) var(--tp-game-symbol-font-size)/1 system-ui, -apple-system, sans-serif;color:#1f2937;background:0 0;border:none;outline:none;padding:0}.tp-yakazu-input:focus-visible{outline:var(--tp-focus-ring,2px solid #0b63ce);outline-offset:-2px}.tp-yakazu-status{text-align:center;border-radius:4px;min-height:1.5rem;padding:.75rem;font-weight:500}.tp-yakazu-status.success{color:#155724;background:#d4edda;border:1px solid #c3e6cb}.tp-yakazu-status.error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb}.tp-yakazu-status.info{color:#0c5460;background:#d1ecf1;border:1px solid #bee5eb}.tp-yakazu-error{color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;padding:1rem}@media (prefers-reduced-motion:reduce){tp-yakazu,tp-yakazu *{transition-duration:.01ms!important;transition-delay:0s!important}}", l = class t extends e {
	static styleId = "tp-yakazu-styles";
	engine = null;
	gridElement = null;
	statusElement = null;
	modeButton = null;
	undoButton = null;
	redoButton = null;
	assistSelect = null;
	focusedCell = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.styleId, c), this.classList.add("tp-yakazu");
		let e = this.dataset.yakazuPuzzle ?? this.parsePuzzleFromLists();
		if (!e) {
			this.renderError("Empty yakazu puzzle");
			return;
		}
		try {
			this.engine = new s({ onChange: () => this.updateStatus() }), this.engine.initialize(e), this.render();
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
		this.innerHTML = "\n      <div class=\"tp-yakazu-container\">\n        <div class=\"tp-yakazu-header\">\n          <div class=\"tp-yakazu-title\">Yakazu</div>\n          <div class=\"tp-yakazu-controls\">\n            <button class=\"tp-yakazu-mode\" type=\"button\">Game</button>\n            <button class=\"tp-yakazu-undo\" disabled>Undo</button>\n            <button class=\"tp-yakazu-redo\" disabled>Redo</button>\n            <select class=\"tp-yakazu-assist\" aria-label=\"Assistance actions\">\n              <option value=\"\">Assist…</option>\n              <option value=\"reset-game\">Reset the game</option>\n              <option value=\"show-incorrect\">Show all incorrect boxes</option>\n              <option value=\"clear-incorrect\">Clear the incorrect boxes</option>\n              <option value=\"show-cell\">Show the box</option>\n              <option value=\"show-solution\">Show the solution</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"tp-yakazu-grid\"></div>\n        <div class=\"tp-yakazu-status\"></div>\n      </div>\n    ", this.gridElement = this.querySelector(".tp-yakazu-grid"), this.statusElement = this.querySelector(".tp-yakazu-status"), this.modeButton = this.querySelector(".tp-yakazu-mode"), this.undoButton = this.querySelector(".tp-yakazu-undo"), this.redoButton = this.querySelector(".tp-yakazu-redo"), this.assistSelect = this.querySelector(".tp-yakazu-assist"), !(!this.engine || !this.gridElement) && (this.engine.renderGrid(this.gridElement), this.attachEventListeners(), this.updateStatus());
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
		if (this.modeButton.textContent = this.engine.getEntryMode() === "game" ? "Game" : "Note", this.modeButton.setAttribute("aria-label", `Current entry mode: ${this.engine.getEntryMode()}`), this.undoButton.disabled = !this.engine.canUndo(), this.redoButton.disabled = !this.engine.canRedo(), this.statusElement.className = "tp-yakazu-status", e.isComplete) this.statusElement.textContent = "✓ Solved!", this.statusElement.classList.add("success");
		else {
			let e = this.engine.countIncorrectCells(), t = this.engine.countEmptyCells();
			this.engine.isShowingIncorrectCells() && e > 0 ? this.statusElement.textContent = `${e} incorrect box${e === 1 ? "" : "es"} shown` : this.statusElement.textContent = `${t} empty cell${t === 1 ? "" : "s"}`, this.statusElement.classList.add("info");
		}
	}
	renderError(e) {
		this.innerHTML = `<div class="tp-yakazu-error">Error: ${e}</div>`;
	}
};
customElements.get("tp-yakazu") || customElements.define("tp-yakazu", l);
//#endregion
export { l as t };

//# sourceMappingURL=yakazu.js.map