/** Image-puzzle geometry in square-cell units. */
export type PuzzleShape = "square" | "puzzle" | "triangle" | "hexagon";
export interface PuzzlePlacement {
	id: number;
	x: number;
	y: number;
	angle: number;
}
export interface PuzzleLayout {
	aspect: number;
	count: number;
	shape: PuzzleShape;
	boardWidth: number;
	boardHeight: number;
	cells: { x: number; y: number; vertices: number[][] }[];
	columns: number;
	rows: number;
	width: number;
	height: number;
	targetX: number;
	targetY: number;
}
/** Chooses an exact factorization closest to the image's aspect ratio. */
export function puzzleLayout(
	count: number,
	aspect: number,
	shape: PuzzleShape = "puzzle",
): PuzzleLayout {
	if (!Number.isInteger(count) || count < 1 || count > 144)
		throw new Error("pieces must be an integer from 1 to 144.");
	if (!Number.isFinite(aspect) || aspect <= 0)
		throw new Error("The image has no usable dimensions.");
	let columns = 1,
		score = Infinity;
	for (let c = 1; c <= count; c++)
		if (count % c === 0) {
			const distance = Math.abs(Math.log(c / (count / c) / aspect));
			if (distance < score) {
				columns = c;
				score = distance;
			}
		}
	if (shape === "triangle" || shape === "hexagon") {
		const h = Math.sqrt(3) / 2;
		columns = Math.max(
			1,
			Math.min(
				count,
				Math.round(
					Math.sqrt(count * aspect * (shape === "triangle" ? 2 * h : h)),
				),
			),
		);
		if (shape === "triangle" && count > 1) columns = Math.max(2, columns);
		const rows = Math.ceil(count / columns);
		const cells = Array.from({ length: count }, (_, id) => {
			const r = Math.floor(id / columns);
			const c =
				shape === "triangle" &&
				r > 0 &&
				r % 2 === 0 &&
				id === count - 1 &&
				id % columns === 0
					? 1
					: id % columns;
			let vertices: number[][];
			if (shape === "triangle") {
				const x = c / 2,
					y = r * h;
				vertices =
					(c + r) % 2 === 0
						? [
								[x, y + h],
								[x + 0.5, y],
								[x + 1, y + h],
							]
						: [
								[x, y],
								[x + 1, y],
								[x + 0.5, y + h],
							];
			} else {
				const x = c + 0.5 + (r % 2) / 2,
					y = 1 / Math.sqrt(3) + r * h;
				vertices = Array.from({ length: 6 }, (_, i) => {
					const a = ((30 + i * 60) * Math.PI) / 180;
					return [
						x + Math.cos(a) / Math.sqrt(3),
						y + Math.sin(a) / Math.sqrt(3),
					];
				});
			}
			return {
				x: vertices.reduce((sum, v) => sum + (v[0] ?? 0), 0) / vertices.length,
				y: vertices.reduce((sum, v) => sum + (v[1] ?? 0), 0) / vertices.length,
				vertices,
			};
		});
		const boardWidth = Math.max(
			...cells.flatMap((c) => c.vertices.map((v) => v[0] ?? 0)),
		);
		const boardHeight = Math.max(
			...cells.flatMap((c) => c.vertices.map((v) => v[1] ?? 0)),
		);
		const width = Math.max(columns * 1.6 + 2, boardWidth + 2);
		return {
			aspect,
			count,
			shape,
			cells,
			columns,
			rows,
			boardWidth,
			boardHeight,
			width,
			height: boardHeight + rows * 1.6 + 3,
			targetX: (width - boardWidth) / 2,
			targetY: 1,
		};
	}
	const rows = count / columns,
		width = columns * 1.6 + 2;
	return {
		aspect,
		count,
		shape,
		cells: [],
		boardWidth: columns,
		boardHeight: rows,
		columns,
		rows,
		width,
		height: rows * 2.6 + 3,
		targetX: (width - columns) / 2,
		targetY: 1,
	};
}
/** The solved center of a piece; piece IDs follow image rows. */
export function puzzleTarget(
	id: number,
	layout: PuzzleLayout,
): PuzzlePlacement {
	return {
		id,
		x: layout.targetX + (layout.cells[id]?.x ?? (id % layout.columns) + 0.5),
		y:
			layout.targetY +
			(layout.cells[id]?.y ?? Math.floor(id / layout.columns) + 0.5),
		angle: 0,
	};
}
/** Complementary edge signs in clockwise order: top, right, bottom, left. */
export function puzzleEdges(
	id: number,
	columns: number,
	rows: number,
): number[] {
	const r = Math.floor(id / columns),
		c = id % columns;
	const horizontal = (row: number, col: number) =>
		(row * 17 + col * 7) % 2 ? 1 : -1;
	const vertical = (row: number, col: number) =>
		(row * 11 + col * 3) % 2 ? 1 : -1;
	return [
		r ? -horizontal(r - 1, c) : 0,
		c < columns - 1 ? vertical(r, c) : 0,
		r < rows - 1 ? horizontal(r, c) : 0,
		c ? -vertical(r, c - 1) : 0,
	];
}
/** Builds a closed clipping path with exactly matching tabs on neighboring pieces. */
export function puzzlePath(
	id: number,
	layout: PuzzleLayout,
	shape: PuzzleShape,
): string {
	const cell = layout.cells[id];
	if (cell)
		return `${cell.vertices.map((v, i) => `${i ? "L" : "M"}${(v[0] ?? 0) - cell.x},${(v[1] ?? 0) - cell.y}`).join(" ")} Z`;
	if (shape === "square") return "M-.5,-.5 L.5,-.5 L.5,.5 L-.5,.5 Z";
	const corners = [
		[-0.5, -0.5],
		[0.5, -0.5],
		[0.5, 0.5],
		[-0.5, 0.5],
		[-0.5, -0.5],
	];
	const signs = puzzleEdges(id, layout.columns, layout.rows);
	let path = "M-.5,-.5";
	for (let edge = 0; edge < 4; edge++) {
		const a = corners[edge],
			b = corners[edge + 1];
		if (!a || !b) continue;
		const dx = (b[0] ?? 0) - (a[0] ?? 0),
			dy = (b[1] ?? 0) - (a[1] ?? 0),
			sign = signs[edge] ?? 0;
		const point = (t: number, n = 0) =>
			`${((a[0] ?? 0) + dx * t + dy * n * sign).toFixed(4)},${((a[1] ?? 0) + dy * t - dx * n * sign).toFixed(4)}`;
		if (sign)
			path += ` L${point(0.4)} C${point(0.48, 0.02)} ${point(0.35, 0.08)} ${point(0.35, 0.16)} C${point(0.35, 0.32)} ${point(0.65, 0.32)} ${point(0.65, 0.16)} C${point(0.65, 0.08)} ${point(0.52, 0.02)} ${point(0.6)} `;
		path += ` L${point(1)}`;
	}
	return `${path} Z`;
}
/** Normalizes right-angle rotations, clamps to the play area and snaps to the target. */
export function puzzleDestination(
	piece: PuzzlePlacement,
	layout: PuzzleLayout,
	snap = true,
): PuzzlePlacement | null {
	if (
		![piece.id, piece.x, piece.y, piece.angle].every(Number.isFinite) ||
		!Number.isInteger(piece.id) ||
		piece.id < 0 ||
		piece.id >= layout.count ||
		piece.angle % puzzleRotationStep(layout.shape) !== 0
	)
		return null;
	const next = {
		...piece,
		x: Math.max(0.85, Math.min(layout.width - 0.85, piece.x)),
		y: Math.max(0.85, Math.min(layout.height - 0.85, piece.y)),
		angle: ((piece.angle % 360) + 360) % 360,
	};
	const target = puzzleTarget(piece.id, layout);
	return snap &&
		next.angle === 0 &&
		Math.hypot(next.x - target.x, next.y - target.y) < 0.22
		? target
		: next;
}
/** A piece is solved only at its own image position with its original orientation. */
export function puzzlePieceSolved(
	piece: PuzzlePlacement,
	layout: PuzzleLayout,
): boolean {
	const target = puzzleTarget(piece.id, layout);
	return (
		piece.angle === 0 &&
		Math.hypot(piece.x - target.x, piece.y - target.y) < 0.00001
	);
}

/** Rotation increment for each tiling. */
export function puzzleRotationStep(shape: PuzzleShape): number {
	return shape === "triangle" || shape === "hexagon" ? 60 : 90;
}
/** Target silhouette; shared cell edges are omitted from its outline. */
export function puzzleContour(layout: PuzzleLayout): string {
	if (!layout.cells.length)
		return `M${layout.targetX},${layout.targetY}h${layout.boardWidth}v${layout.boardHeight}h${-layout.boardWidth}Z`;
	const edges = new Map<string, number[][]>();
	const key = (p: number[]) =>
		`${(p[0] ?? 0).toFixed(6)},${(p[1] ?? 0).toFixed(6)}`;
	for (const cell of layout.cells)
		for (let i = 0; i < cell.vertices.length; i++) {
			const a = cell.vertices[i],
				b = cell.vertices[(i + 1) % cell.vertices.length];
			if (!a || !b) continue;
			const k = [key(a), key(b)].sort().join("/");
			if (edges.has(k)) edges.delete(k);
			else edges.set(k, [a, b]);
		}
	// Join the remaining directed edges into closed boundary loops.
	let path = "";
	while (edges.size) {
		const entry = edges.entries().next().value;
		if (!entry) break;
		let [k, edge] = entry;
		const start = edge[0];
		if (!start) break;
		path += `M${(start[0] ?? 0) + layout.targetX},${(start[1] ?? 0) + layout.targetY}`;
		while (true) {
			edges.delete(k);
			const end = edge[1];
			if (!end) break;
			path += `L${(end[0] ?? 0) + layout.targetX},${(end[1] ?? 0) + layout.targetY}`;
			if (key(end) === key(start)) break;
			const next = [...edges].find(([, e]) => e[0] && key(e[0]) === key(end));
			if (!next) break;
			[k, edge] = next;
		}
		path += "Z";
	}
	return path;
}
