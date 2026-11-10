/** Pure Kakuro parsing, constraint validation and bounded solution search. */
export interface KakuroCell {
	row: number;
	col: number;
	white: boolean;
	given: number;
	down: number;
	across: number;
	runs: number[];
}
export interface KakuroRun {
	total: number;
	cells: number[];
	direction: "across" | "down";
}
export interface KakuroGrid {
	rows: number;
	columns: number;
	cells: KakuroCell[];
	runs: KakuroRun[];
}

/** Parses whitespace-separated rows: #, ., fixed digits, or down/across clues. */
export function parseKakuro(source: string): KakuroGrid {
	const rows = source
		.trim()
		.split(/\r?\n/)
		.map((row) => row.trim().split(/\s+/));
	const columns = rows[0]?.length ?? 0;
	if (
		!source.trim() ||
		rows.length < 3 ||
		columns < 3 ||
		rows.length > 30 ||
		columns > 30 ||
		rows.some((row) => row.length !== columns)
	)
		throw new Error("Use a rectangular grid from 3 × 3 to 30 × 30 cells.");
	const cells = rows.flatMap((row, r) =>
		row.map((token, col): KakuroCell => {
			const clue = /^(\d{1,2})\/(\d{1,2})$/.exec(token);
			if (!clue && !/^(#|\.|[1-9])$/.test(token))
				throw new Error(
					`Invalid cell at row ${r + 1}, column ${col + 1}: ${token}`,
				);
			const down = Number(clue?.[1] ?? 0),
				across = Number(clue?.[2] ?? 0);
			if (clue && ((!down && !across) || down > 45 || across > 45))
				throw new Error(
					"Clues must be between 1 and 45; use # for a solid block.",
				);
			return {
				row: r,
				col,
				white: token === "." || /^[1-9]$/.test(token),
				given: /^[1-9]$/.test(token) ? Number(token) : 0,
				down,
				across,
				runs: [],
			};
		}),
	);
	const runs: KakuroRun[] = [];
	for (const cell of cells) {
		for (const direction of ["across", "down"] as const) {
			const total = cell[direction];
			if (!total) continue;
			const indices: number[] = [];
			let row = cell.row + (direction === "down" ? 1 : 0),
				col = cell.col + (direction === "across" ? 1 : 0);
			while (row < rows.length && col < columns) {
				const index = row * columns + col;
				if (!cells[index]?.white) break;
				indices.push(index);
				row += direction === "down" ? 1 : 0;
				col += direction === "across" ? 1 : 0;
			}
			const n = indices.length;
			if (
				n < 2 ||
				n > 9 ||
				total < (n * (n + 1)) / 2 ||
				total > (n * (19 - n)) / 2
			)
				throw new Error(
					`Impossible ${direction} clue at row ${cell.row + 1}, column ${cell.col + 1}.`,
				);
			for (const index of indices) cells[index]?.runs.push(runs.length);
			runs.push({ total, cells: indices, direction });
		}
	}
	if (
		!cells.some((cell) => cell.white) ||
		cells.some((cell) => cell.white && cell.runs.length !== 2)
	)
		throw new Error(
			"Every white cell must belong to one across run and one down run.",
		);
	const grid = { rows: rows.length, columns, cells, runs };
	if (
		kakuroConflicts(
			grid,
			cells.map((cell) => cell.given),
		).size
	)
		throw new Error("Fixed digits contradict the clues.");
	return grid;
}

const combinations = new Map<string, number[]>();
function masks(count: number, total: number): number[] {
	const key = `${count}:${total}`;
	const cached = combinations.get(key);
	if (cached) return cached;
	const result: number[] = [];
	for (let mask = 0; mask < 512; mask++) {
		let n = 0,
			sum = 0;
		for (let digit = 1; digit <= 9; digit++)
			if (mask & (1 << (digit - 1))) {
				n++;
				sum += digit;
			}
		if (n === count && sum === total) result.push(mask);
	}
	combinations.set(key, result);
	return result;
}
function runOptions(run: KakuroRun, values: readonly number[]): number[] {
	let used = 0;
	for (const index of run.cells) {
		const digit = values[index] ?? 0;
		if (!digit) continue;
		if (!Number.isInteger(digit) || digit < 1 || digit > 9) return [];
		const bit = 1 << (digit - 1);
		if (used & bit) return [];
		used |= bit;
	}
	return masks(run.cells.length, run.total).filter(
		(mask) => (mask & used) === used,
	);
}
/** Returns cells in runs whose current digits cannot meet the sum without repetition. */
export function kakuroConflicts(
	grid: KakuroGrid,
	values: readonly number[],
): Set<number> {
	const invalid = new Set<number>();
	for (const run of grid.runs)
		if (!runOptions(run, values).length)
			for (const index of run.cells) invalid.add(index);
	return invalid;
}
/** Finds a completion consistent with values, or null. Caps search to protect the browser. */
export function solveKakuro(
	grid: KakuroGrid,
	initial: readonly number[],
	limit = 100000,
): number[] | null {
	const values = [...initial];
	let visits = 0;
	const search = (): boolean => {
		if (++visits > limit)
			throw new Error(
				"This puzzle exceeds the assistance search limit. You can continue solving it manually.",
			);
		const options = grid.runs.map((run) => runOptions(run, values));
		if (options.some((list) => !list.length)) return false;
		let best = -1,
			candidates: number[] = [];
		for (let index = 0; index < grid.cells.length; index++) {
			const cell = grid.cells[index];
			if (!cell?.white || values[index]) continue;
			let allowed = 511;
			for (const runIndex of cell.runs) {
				const run = grid.runs[runIndex];
				if (!run) continue;
				let used = 0;
				for (const i of run.cells) {
					const value = values[i] ?? 0;
					if (value) used |= 1 << (value - 1);
				}
				allowed &=
					(options[runIndex] ?? []).reduce((all, mask) => all | mask, 0) &
					~used;
			}
			const digits = Array.from({ length: 9 }, (_, i) => i + 1).filter(
				(digit) => allowed & (1 << (digit - 1)),
			);
			if (!digits.length) return false;
			if (best < 0 || digits.length < candidates.length) {
				best = index;
				candidates = digits;
			}
		}
		if (best < 0) return true;
		for (const digit of candidates) {
			values[best] = digit;
			if (search()) return true;
		}
		values[best] = 0;
		return false;
	};
	return search() ? values : null;
}
