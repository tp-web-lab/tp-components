import type {
	LogigramCell,
	LogigramMark,
	LogigramPuzzle,
} from "./logigram-model.js";

/** Derives certain associations from player marks, never from the authored solution. */
export function deriveLogigramResults(
	categories: LogigramPuzzle["categories"],
	cells: readonly LogigramCell[],
	marks: readonly LogigramMark[],
): { rows: (string | null)[][]; conflict: boolean } {
	const size = categories[0]?.items.length ?? 0;
	const count = categories.length;
	const total = count * size;
	const allowed = Array.from({ length: total }, (_, a) =>
		Array.from(
			{ length: total },
			(_, b) => Math.floor(a / size) !== Math.floor(b / size) || a === b,
		),
	);
	let changed = false;
	const remove = (a: number, b: number) => {
		const forward = allowed[a];
		const backward = allowed[b];
		if (forward?.[b] && backward) {
			forward[b] = false;
			backward[a] = false;
			changed = true;
		}
	};
	for (const [i, cell] of cells.entries()) {
		const a = cell.a * size + cell.row,
			b = cell.b * size + cell.col;
		if (marks[i] === -1) remove(a, b);
		if (marks[i] === 1)
			for (let j = 0; j < size; j++) {
				if (j !== cell.col) remove(a, cell.b * size + j);
				if (j !== cell.row) remove(cell.a * size + j, b);
			}
	}
	let conflict = false;
	do {
		changed = false;
		for (let a = 0; a < total && !conflict; a++)
			for (let category = 0; category < count; category++) {
				if (Math.floor(a / size) === category) continue;
				const candidates = Array.from(
					{ length: size },
					(_, i) => category * size + i,
				).filter((b) => allowed[a]?.[b]);
				if (!candidates.length) {
					conflict = true;
					break;
				}
				const only = candidates[0];
				if (candidates.length === 1 && only !== undefined)
					for (let j = 0; j < size; j++) {
						const other = Math.floor(a / size) * size + j;
						if (other !== a) remove(other, only);
					}
			}
		for (let a = 0; a < total && !conflict; a++)
			for (let b = a + 1; b < total; b++) {
				if (!allowed[a]?.[b] || Math.floor(a / size) === Math.floor(b / size))
					continue;
				for (let category = 0; category < count; category++) {
					if (
						category === Math.floor(a / size) ||
						category === Math.floor(b / size)
					)
						continue;
					if (
						!Array.from({ length: size }, (_, i) => category * size + i).some(
							(c) => allowed[a]?.[c] && allowed[c]?.[b],
						)
					) {
						remove(a, b);
						break;
					}
				}
			}
	} while (changed && !conflict);
	const rows = Array.from({ length: size }, (_, row) =>
		categories.map((category, c) => {
			if (c === 0) return category.items[row] ?? null;
			if (conflict) return null;
			const matches = category.items.filter(
				(_, i) => allowed[row]?.[c * size + i],
			);
			return matches.length === 1 ? (matches[0] ?? null) : null;
		}),
	);
	return { rows, conflict };
}
