//#region src/components/logigram/logigram-model.ts
function e(e) {
	let t = JSON.parse(e), n = (e) => typeof e == "string" && e.trim().length > 0;
	if (!t || !n(t.title) || !Array.isArray(t.categories) || t.categories.length < 2 || t.categories.length > 6) throw Error("Provide a title and 2–6 categories.");
	let r = t.categories[0]?.items?.length ?? 0;
	if (r < 2 || r > 8 || t.categories.some((e) => !e || !n(e.name) || !Array.isArray(e.items) || e.items.length !== r || e.items.some((e) => !n(e)) || new Set(e.items).size !== r) || new Set(t.categories.map((e) => e.name)).size !== t.categories.length) throw Error("Categories need unique names and the same 2–8 distinct items.");
	if (t.description !== void 0 && typeof t.description != "string" || !Array.isArray(t.clues) || !t.clues.length || t.clues.some((e) => !n(e))) throw Error("Provide textual clues and an optional text description.");
	if (!Array.isArray(t.solution) || t.solution.length !== r || t.solution.some((e) => !Array.isArray(e) || e.length !== t.categories.length)) throw Error("The solution needs one row per entity and one item per category.");
	for (let [e, n] of t.categories.entries()) {
		let i = t.solution.map((t) => t[e]);
		if (new Set(i).size !== r || i.some((e) => !n.items.includes(e ?? ""))) throw Error("Each category item must occur exactly once in the solution.");
	}
	return t;
}
var t = class {
	puzzle;
	cells = [];
	marks = [];
	past = [];
	future = [];
	constructor(e) {
		this.puzzle = e;
		for (let t = 0; t < e.categories.length; t++) for (let n = t + 1; n < e.categories.length; n++) for (let r = 0; r < (e.categories[t]?.items.length ?? 0); r++) for (let i = 0; i < (e.categories[n]?.items.length ?? 0); i++) this.cells.push({
			a: t,
			b: n,
			row: r,
			col: i
		});
		this.marks = this.cells.map(() => 0);
	}
	get value() {
		return [...this.marks];
	}
	get canUndo() {
		return this.past.length > 0;
	}
	get canRedo() {
		return this.future.length > 0;
	}
	expected(e) {
		let t = this.cells[e];
		if (!t) throw RangeError("Unknown cell.");
		let n = this.puzzle.categories[t.a]?.items[t.row], r = this.puzzle.categories[t.b]?.items[t.col];
		return this.puzzle.solution.some((e) => e[t.a] === n && e[t.b] === r) ? 1 : -1;
	}
	set(e, t, n = !1) {
		let r = this.cells[e];
		if (!r || ![
			0,
			-1,
			1
		].includes(t)) throw RangeError("Invalid cell or mark.");
		let i = [...this.marks];
		i[e] = t, t === 1 && n && this.cells.forEach((t, n) => {
			n !== e && t.a === r.a && t.b === r.b && (t.row === r.row || t.col === r.col) && (i[n] = -1);
		}), !i.every((e, t) => e === this.marks[t]) && (this.past.push([...this.marks]), this.future = [], this.marks = i);
	}
	assist(e, t) {
		let n = t === void 0 ? void 0 : this.cells[t];
		if ((e === "show-cell" || e === "show-block") && !n) return;
		let r = this.marks.map((r, i) => {
			if (e === "clear-incorrect") return r !== 0 && r !== this.expected(i) ? 0 : r;
			let a = this.cells[i];
			return e === "show-solution" || e === "show-cell" && i === t || e === "show-block" && a?.a === n?.a && a?.b === n?.b ? this.expected(i) : r;
		});
		r.every((e, t) => e === this.marks[t]) || (this.past.push([...this.marks]), this.future = [], this.marks = r);
	}
	undo() {
		let e = this.past.pop();
		e && (this.future.push(this.marks), this.marks = e);
	}
	redo() {
		let e = this.future.pop();
		e && (this.past.push(this.marks), this.marks = e);
	}
	reset() {
		this.marks.some(Boolean) && (this.past.push(this.marks), this.marks = this.cells.map(() => 0), this.future = []);
	}
	check() {
		let e = 0, t = 0, n = [];
		return this.cells.forEach((r, i) => {
			let a = this.expected(i);
			a === 1 && (t++, this.marks[i] === 1 && e++), this.marks[i] !== 0 && this.marks[i] !== a && n.push(i);
		}), {
			correct: e,
			total: t,
			errors: n,
			complete: e === t && n.length === 0
		};
	}
};
function n(t, n) {
	let r = Array.from(t.children).filter((e) => e.localName === "dl");
	if (r.length !== 1) throw Error("Provide a definition list with Prompt, Categories, Clues and Solution.");
	let i = /* @__PURE__ */ new Map(), a = Array.from(r[0]?.children ?? []);
	for (let e = 0; e < a.length; e += 2) {
		let t = a[e], n = a[e + 1], r = t?.textContent?.trim().toLowerCase() ?? "";
		if (t?.localName !== "dt" || n?.localName !== "dd" || ![
			"prompt",
			"categories",
			"clues",
			"solution"
		].includes(r) || i.has(r)) throw Error("Use one dt/dd pair for each of Prompt, Categories, Clues and Solution.");
		i.set(r, n);
	}
	if (i.size !== 4) throw Error("Prompt, Categories, Clues and Solution are required.");
	let o = (e) => {
		let t = Array.from(i.get(e)?.children ?? []).filter((e) => e.matches("ul,ol"));
		if (t.length !== 1) throw Error(`${e} requires one list.`);
		return t[0];
	}, s = o("categories"), c = o("clues"), l = o("solution"), u = (e) => Array.from(e.children).filter((e) => e.localName === "li"), d = (e) => Array.from(e.childNodes).filter((e) => !(e instanceof Element && e.matches("ul,ol"))).map((e) => e.textContent ?? "").join("").trim(), f = {
		title: n,
		description: i.get("prompt")?.textContent?.trim() ?? "",
		categories: u(s).map((e) => ({
			name: d(e),
			items: u(e.querySelector("ul,ol") ?? document.createElement("ul")).map((e) => e.textContent?.trim() ?? "")
		})),
		clues: u(c).map((e) => e.textContent?.trim() ?? ""),
		solution: u(l).map((e) => u(e.querySelector("ul,ol") ?? document.createElement("ul")).map((e) => e.textContent?.trim() ?? ""))
	};
	return e(JSON.stringify(f));
}
//#endregion
export { t as LogigramModel, e as parseLogigram, n as readLogigramLists };

//# sourceMappingURL=logigram-model.js.map