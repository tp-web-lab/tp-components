/** Data and reversible state for one-to-one category matching puzzles. */
export interface LogigramPuzzle {
	title: string;
	description?: string;
	categories: { name: string; items: string[] }[];
	clues: string[];
	/** One row per entity, one item per category, in category order. */
	solution: string[][];
}
export type LogigramMark = 0 | -1 | 1;
export interface LogigramCell {
	a: number;
	b: number;
	row: number;
	col: number;
}
export function parseLogigram(source: string): LogigramPuzzle {
	const data = JSON.parse(source) as LogigramPuzzle;
	const text = (v: unknown): v is string =>
		typeof v === "string" && v.trim().length > 0;
	if (
		!data ||
		!text(data.title) ||
		!Array.isArray(data.categories) ||
		data.categories.length < 2 ||
		data.categories.length > 6
	)
		throw new Error("Provide a title and 2–6 categories.");
	const n = data.categories[0]?.items?.length ?? 0;
	if (
		n < 2 ||
		n > 8 ||
		data.categories.some(
			(c) =>
				!c ||
				!text(c.name) ||
				!Array.isArray(c.items) ||
				c.items.length !== n ||
				c.items.some((i) => !text(i)) ||
				new Set(c.items).size !== n,
		) ||
		new Set(data.categories.map((c) => c.name)).size !== data.categories.length
	)
		throw new Error(
			"Categories need unique names and the same 2–8 distinct items.",
		);
	if (
		(data.description !== undefined && typeof data.description !== "string") ||
		!Array.isArray(data.clues) ||
		!data.clues.length ||
		data.clues.some((c) => !text(c))
	)
		throw new Error("Provide textual clues and an optional text description.");
	if (
		!Array.isArray(data.solution) ||
		data.solution.length !== n ||
		data.solution.some(
			(r) => !Array.isArray(r) || r.length !== data.categories.length,
		)
	)
		throw new Error(
			"The solution needs one row per entity and one item per category.",
		);
	for (const [i, c] of data.categories.entries()) {
		const items = data.solution.map((r) => r[i]);
		if (
			new Set(items).size !== n ||
			items.some((v) => !c.items.includes(v ?? ""))
		)
			throw new Error(
				"Each category item must occur exactly once in the solution.",
			);
	}
	return data;
}
export class LogigramModel {
	public readonly cells: LogigramCell[] = [];
	private marks: LogigramMark[] = [];
	private past: LogigramMark[][] = [];
	private future: LogigramMark[][] = [];
	public constructor(public readonly puzzle: LogigramPuzzle) {
		for (let a = 0; a < puzzle.categories.length; a++)
			for (let b = a + 1; b < puzzle.categories.length; b++)
				for (
					let row = 0;
					row < (puzzle.categories[a]?.items.length ?? 0);
					row++
				)
					for (
						let col = 0;
						col < (puzzle.categories[b]?.items.length ?? 0);
						col++
					)
						this.cells.push({ a, b, row, col });
		this.marks = this.cells.map(() => 0);
	}
	public get value(): LogigramMark[] {
		return [...this.marks];
	}
	public get canUndo(): boolean {
		return this.past.length > 0;
	}
	public get canRedo(): boolean {
		return this.future.length > 0;
	}
	public expected(index: number): LogigramMark {
		const c = this.cells[index];
		if (!c) throw new RangeError("Unknown cell.");
		const left = this.puzzle.categories[c.a]?.items[c.row];
		const right = this.puzzle.categories[c.b]?.items[c.col];
		return this.puzzle.solution.some((r) => r[c.a] === left && r[c.b] === right)
			? 1
			: -1;
	}
	public set(index: number, mark: LogigramMark, autoExclude = false): void {
		const cell = this.cells[index];
		if (!cell || ![0, -1, 1].includes(mark))
			throw new RangeError("Invalid cell or mark.");
		const next = [...this.marks];
		next[index] = mark;
		if (mark === 1 && autoExclude)
			this.cells.forEach((c, i) => {
				if (
					i !== index &&
					c.a === cell.a &&
					c.b === cell.b &&
					(c.row === cell.row || c.col === cell.col)
				)
					next[i] = -1;
			});
		if (next.every((v, i) => v === this.marks[i])) return;
		this.past.push([...this.marks]);
		this.future = [];
		this.marks = next;
	}
	/** Applies assistance as one undoable move. */
	public assist(
		action: "clear-incorrect" | "show-cell" | "show-block" | "show-solution",
		index?: number,
	): void {
		const selected = index === undefined ? undefined : this.cells[index];
		if ((action === "show-cell" || action === "show-block") && !selected)
			return;
		const next = this.marks.map((mark, i) => {
			if (action === "clear-incorrect")
				return mark !== 0 && mark !== this.expected(i) ? 0 : mark;
			const cell = this.cells[i];
			if (
				action === "show-solution" ||
				(action === "show-cell" && i === index) ||
				(action === "show-block" &&
					cell?.a === selected?.a &&
					cell?.b === selected?.b)
			)
				return this.expected(i);
			return mark;
		});
		if (next.every((mark, i) => mark === this.marks[i])) return;
		this.past.push([...this.marks]);
		this.future = [];
		this.marks = next;
	}
	public undo(): void {
		const previous = this.past.pop();
		if (previous) {
			this.future.push(this.marks);
			this.marks = previous;
		}
	}
	public redo(): void {
		const next = this.future.pop();
		if (next) {
			this.past.push(this.marks);
			this.marks = next;
		}
	}
	public reset(): void {
		if (this.marks.some(Boolean)) {
			this.past.push(this.marks);
			this.marks = this.cells.map(() => 0);
			this.future = [];
		}
	}
	public check(): {
		correct: number;
		total: number;
		errors: number[];
		complete: boolean;
	} {
		let correct = 0;
		let total = 0;
		const errors: number[] = [];
		this.cells.forEach((_, i) => {
			const expected = this.expected(i);
			if (expected === 1) {
				total++;
				if (this.marks[i] === 1) correct++;
			}
			if (this.marks[i] !== 0 && this.marks[i] !== expected) errors.push(i);
		});
		return {
			correct,
			total,
			errors,
			complete: correct === total && errors.length === 0,
		};
	}
}

/** Reads native markup lists after Markdown, AsciiDoc or RST conversion. */
export function readLogigramLists(
	root: ParentNode,
	title: string,
): LogigramPuzzle {
	const definitions = Array.from(root.children).filter(
		(e) => e.localName === "dl",
	);
	if (definitions.length !== 1)
		throw new Error(
			"Provide a definition list with Prompt, Categories, Clues and Solution.",
		);
	const sections = new Map<string, Element>();
	const nodes = Array.from(definitions[0]?.children ?? []);
	for (let i = 0; i < nodes.length; i += 2) {
		const term = nodes[i];
		const description = nodes[i + 1];
		const name = term?.textContent?.trim().toLowerCase() ?? "";
		if (
			term?.localName !== "dt" ||
			description?.localName !== "dd" ||
			!["prompt", "categories", "clues", "solution"].includes(name) ||
			sections.has(name)
		)
			throw new Error(
				"Use one dt/dd pair for each of Prompt, Categories, Clues and Solution.",
			);
		sections.set(name, description);
	}
	if (sections.size !== 4)
		throw new Error("Prompt, Categories, Clues and Solution are required.");
	const list = (name: string): Element => {
		const lists = Array.from(sections.get(name)?.children ?? []).filter((e) =>
			e.matches("ul,ol"),
		);
		if (lists.length !== 1) throw new Error(`${name} requires one list.`);
		return lists[0] as Element;
	};
	const categories = list("categories");
	const clues = list("clues");
	const solution = list("solution");
	const items = (list: Element) =>
		Array.from(list.children).filter((e) => e.localName === "li");
	const ownText = (e: Element) =>
		Array.from(e.childNodes)
			.filter((n) => !(n instanceof Element && n.matches("ul,ol")))
			.map((n) => n.textContent ?? "")
			.join("")
			.trim();
	const puzzle = {
		title,
		description: sections.get("prompt")?.textContent?.trim() ?? "",
		categories: items(categories).map((e) => ({
			name: ownText(e),
			items: items(
				e.querySelector("ul,ol") ?? document.createElement("ul"),
			).map((i) => i.textContent?.trim() ?? ""),
		})),
		clues: items(clues).map((e) => e.textContent?.trim() ?? ""),
		solution: items(solution).map((e) =>
			items(e.querySelector("ul,ol") ?? document.createElement("ul")).map(
				(i) => i.textContent?.trim() ?? "",
			),
		),
	};
	return parseLogigram(JSON.stringify(puzzle));
}
