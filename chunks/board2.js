//#region ../../../../../../@tp/tp-markdown/dist/chunks/board.js
var e = class {
	rows;
	cols;
	cells;
	history = [];
	historyIndex = -1;
	startTime = Date.now();
	constructor(e, t) {
		if (this.rows = e.rows, this.cols = e.cols, this.cells = t, this.cells.length !== this.rows) throw Error(`Expected ${this.rows} rows, got ${this.cells.length}`);
		for (let e = 0; e < this.cells.length; e++) if (this.cells[e]?.length !== this.cols) throw Error(`Row ${e}: expected ${this.cols} cols, got ${this.cells[e]?.length}`);
	}
	getDimensions() {
		return {
			rows: this.rows,
			cols: this.cols
		};
	}
	getCell(e) {
		return this.isValidCoord(e) ? this.cells[e.row]?.[e.col] ?? null : null;
	}
	getCells() {
		return this.cells.map((e) => [...e]);
	}
	setCellState(e, n, r) {
		let i = this.getCell(e);
		if (!i || !i.isEditable) return !1;
		let a = t(i);
		Object.assign(i, n);
		let o = t(i);
		if (JSON.stringify(a) === JSON.stringify(o)) return !1;
		let s = {
			coord: e,
			oldValue: a.value,
			newValue: o.value,
			timestamp: Date.now(),
			oldCellSnapshot: a,
			newCellSnapshot: o
		};
		return this.addToHistory([s], r), !0;
	}
	setCellsState(e, n) {
		let r = [];
		for (let { coord: n, updates: i } of e) {
			let e = this.getCell(n);
			if (!e || !e.isEditable) continue;
			let a = t(e);
			Object.assign(e, i);
			let o = t(e);
			JSON.stringify(a) !== JSON.stringify(o) && r.push({
				coord: n,
				oldValue: a.value,
				newValue: o.value,
				timestamp: Date.now(),
				oldCellSnapshot: a,
				newCellSnapshot: o
			});
		}
		return r.length > 0 ? (this.addToHistory(r, n), !0) : !1;
	}
	setCell(e, t, n) {
		let r = this.getCell(e);
		if (!r || !r.isEditable) return !1;
		let i = r.value;
		if (i === t) return !1;
		r.value = t;
		let a = {
			coord: e,
			oldValue: i,
			newValue: t,
			timestamp: Date.now()
		};
		return this.addToHistory([a], n), !0;
	}
	setCells(e, t) {
		let n = [];
		for (let { coord: t, value: r } of e) {
			let e = this.getCell(t);
			!e || !e.isEditable || e.value !== r && (n.push({
				coord: t,
				oldValue: e.value,
				newValue: r,
				timestamp: Date.now()
			}), e.value = r);
		}
		return n.length > 0 ? (this.addToHistory(n, t), !0) : !1;
	}
	undo() {
		if (this.historyIndex < 0) return !1;
		let e = this.history[this.historyIndex];
		if (!e) return !1;
		for (let t of e.changes) {
			let e = this.getCell(t.coord);
			e && n(e, t.oldCellSnapshot, t.oldValue);
		}
		return --this.historyIndex, !0;
	}
	redo() {
		if (this.historyIndex >= this.history.length - 1) return !1;
		let e = this.history[this.historyIndex + 1];
		if (!e) return !1;
		for (let t of e.changes) {
			let e = this.getCell(t.coord);
			e && n(e, t.newCellSnapshot, t.newValue);
		}
		return this.historyIndex += 1, !0;
	}
	canUndo() {
		return this.historyIndex >= 0;
	}
	canRedo() {
		return this.historyIndex < this.history.length - 1;
	}
	getState() {
		return {
			cells: this.getCells(),
			history: this.history,
			historyIndex: this.historyIndex
		};
	}
	validate() {
		return {
			isValid: !0,
			errors: []
		};
	}
	isComplete() {
		return !1;
	}
	getElapsedTime() {
		return Date.now() - this.startTime;
	}
	reset() {
		this.history = [], this.historyIndex = -1, this.startTime = Date.now();
		for (let e = 0; e < this.rows; e++) for (let t = 0; t < this.cols; t++) {
			let n = this.cells[e]?.[t];
			n && (n.value = "", n.isError = !1);
		}
	}
	isValidCoord(e) {
		return e.row >= 0 && e.row < this.rows && e.col >= 0 && e.col < this.cols;
	}
	addToHistory(e, t) {
		this.history = this.history.slice(0, this.historyIndex + 1), this.history.push({
			changes: e,
			timestamp: Date.now(),
			label: t
		}), this.historyIndex = this.history.length - 1;
	}
};
function t(e) {
	return typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
function n(e, n, r) {
	if (n) {
		for (let t of Object.keys(e)) t in n || delete e[t];
		Object.assign(e, t(n));
		return;
	}
	e.value = r;
}
//#endregion
export { e as t };

