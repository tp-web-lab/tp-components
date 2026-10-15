export type Point = { x: number; y: number };
export type Placement = Point & { id: string; angle: number; flipped: boolean };
export function at<T>(items: readonly T[], index: number): T {
	const value = items[index];
	if (value === undefined) throw new Error(`Missing item ${index}`);
	return value;
}
const vertices: [number, number][][] = [
	[
		[0, 0],
		[4, 0],
		[2, 2],
	],
	[
		[0, 0],
		[2, 2],
		[0, 4],
	],
	[
		[4, 2],
		[4, 4],
		[2, 4],
	],
	[
		[4, 0],
		[4, 2],
		[3, 1],
	],
	[
		[2, 2],
		[3, 3],
		[1, 3],
	],
	[
		[2, 2],
		[3, 1],
		[4, 2],
		[3, 3],
	],
	[
		[0, 4],
		[2, 4],
		[3, 3],
		[1, 3],
	],
];
const ids = [
	"large-1",
	"large-2",
	"medium",
	"small-1",
	"small-2",
	"square",
	"parallelogram",
];
export const PIECES = vertices.map((v, i) => {
	if (
		v.reduce((sum, p, j) => {
			const q = at(v, (j + 1) % v.length);
			return sum + p[0] * q[1] - p[1] * q[0];
		}, 0) < 0
	)
		v.reverse();
	const x = v.reduce((s, p) => s + p[0], 0) / v.length;
	const y = v.reduce((s, p) => s + p[1], 0) / v.length;
	return {
		id: at(ids, i),
		points: v.map((p) => ({ x: p[0] - x, y: p[1] - y })),
		x: x - 2,
		y: y - 2,
	};
});
export const SQUARE: Placement[] = PIECES.map((p) => ({
	id: p.id,
	x: p.x,
	y: p.y,
	angle: 0,
	flipped: false,
}));
export function polygon(p: Placement): Point[] {
	const shape = PIECES.find((s) => s.id === p.id);
	if (!shape) throw new Error(`Unknown piece: ${p.id}`);
	const a = (p.angle * Math.PI) / 180,
		c = Math.cos(a),
		s = Math.sin(a);
	const points = shape.points.map((v) => {
		const x = p.flipped ? -v.x : v.x;
		return { x: p.x + x * c - v.y * s, y: p.y + x * s + v.y * c };
	});
	return p.flipped ? points.reverse() : points;
}
const cross = (a: Point, b: Point, c: Point): number =>
	(b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
export function area(points: Point[]): number {
	return (
		Math.abs(
			points.reduce((sum, p, i) => {
				const q = at(points, (i + 1) % points.length);
				return sum + p.x * q.y - p.y * q.x;
			}, 0),
		) / 2
	);
}
/** Convex clipping; shared edges have zero intersection area. */
export function intersection(a: Point[], b: Point[]): Point[] {
	let result = a;
	for (let i = 0; i < b.length; i++) {
		const u = at(b, i),
			v = at(b, (i + 1) % b.length),
			input = result;
		result = [];
		for (let j = 0; j < input.length; j++) {
			const p = at(input, j),
				q = at(input, (j + 1) % input.length),
				cp = cross(u, v, p),
				cq = cross(u, v, q);
			if (cp >= 0) result.push(p);
			if (cp >= 0 !== cq >= 0) {
				const t = cp / (cp - cq);
				result.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
			}
		}
	}
	return result;
}
export function overlaps(a: Placement, b: Placement): boolean {
	return area(intersection(polygon(a), polygon(b))) > 1e-7;
}
export function validate(placements: Placement[]): void {
	if (
		placements.length !== 7 ||
		new Set(placements.map((p) => p.id)).size !== 7
	)
		throw new Error("Exactly seven different pieces are required.");
	for (const p of placements) {
		if (
			!PIECES.some((s) => s.id === p.id) ||
			![p.x, p.y, p.angle].every(Number.isFinite) ||
			typeof p.flipped !== "boolean"
		)
			throw new Error("Invalid piece placement.");
		if (Math.abs(p.x) > 10000 || Math.abs(p.y) > 10000)
			throw new Error("Coordinates exceed the supported range.");
	}
	if (
		placements.some((p, i) =>
			placements.slice(i + 1).some((q) => overlaps(p, q)),
		)
	)
		throw new Error("Solution pieces must not overlap.");
}
/** A readable square dissection using named vertices and geometric relations. */
export const SQUARE_SOURCE = `# Corners of a square of side 4
point A = (0, 0)
point B = (4, 0)
point C = (4, 4)
point D = (0, 4)

# Shared landmarks
point O = midpoint(A, C)
point E = midpoint(B, C)
point F = midpoint(C, D)
point G = midpoint(B, O)
point H = midpoint(O, C)
point I = midpoint(O, D)

# The seven pieces, described by their boundary vertices
triangle A B O
triangle A O D
triangle E C F
triangle B E G
triangle O H I
square O G E H
parallelogram D F H I`;

/** Finds a rigid placement; vertices must follow the boundary in either direction. */
function fitVertices(id: string, points: Point[]): Placement | null {
	const shape = PIECES.find((p) => p.id === id);
	if (!shape || points.length !== shape.points.length) return null;
	const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
	const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
	for (const flipped of [false, true]) {
		const source = shape.points.map((p) => ({
			x: flipped ? -p.x : p.x,
			y: p.y,
		}));
		const a = at(source, 0);
		for (const direction of [1, -1])
			for (let shift = 0; shift < points.length; shift++) {
				const ordered = source.map((_, i) =>
					at(points, (shift + direction * i + points.length) % points.length),
				);
				const b = at(ordered, 0);
				const angle = Math.atan2(b.y - y, b.x - x) - Math.atan2(a.y, a.x);
				const c = Math.cos(angle),
					s = Math.sin(angle);
				if (
					source.every((p, i) => {
						const q = at(ordered, i);
						return (
							Math.hypot(
								x + p.x * c - p.y * s - q.x,
								y + p.x * s + p.y * c - q.y,
							) < 1e-7
						);
					})
				)
					return { id, x, y, angle: (angle * 180) / Math.PI, flipped };
			}
	}
	return null;
}

function parseSemanticSolution(source: string): Placement[] {
	const points = new Map<string, Point>();
	const placements: Placement[] = [];
	let grid = 1;
	let gridDeclared = false;
	const number = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?";
	const coordinate = new RegExp(
		`^\\(\\s*(${number})\\s*,\\s*(${number})\\s*\\)$`,
	);
	const resolve = (name: string): Point => {
		const p = points.get(name);
		if (!p)
			throw new Error(`Unknown point "${name}". Define it before using it.`);
		return p;
	};
	for (const [index, raw] of source.split(/\r?\n/).entries()) {
		const line = raw.replace(/#.*$/, "").trim();
		if (!line) continue;
		try {
			if (line.startsWith("grid")) {
				if (gridDeclared || points.size || placements.length)
					throw new Error(
						"Declare the grid once, before any points or pieces.",
					);
				if (line !== "grid 1" && line !== "grid sqrt2")
					throw new Error("Expected grid 1 or grid sqrt2.");
				grid = line === "grid sqrt2" ? Math.SQRT2 : 1;
				gridDeclared = true;
				continue;
			}
			if (line.startsWith("point ")) {
				const declaration = /^point\s+([A-Za-z][\w-]*)\s*=\s*(.+)$/.exec(line);
				if (!declaration)
					throw new Error("Expected point NAME = (x, y) or midpoint(A, B).");
				const name = at(declaration, 1),
					expression = at(declaration, 2);
				if (points.has(name))
					throw new Error(`Point "${name}" is already defined.`);
				const literal = coordinate.exec(expression);
				const middle =
					/^midpoint\(\s*([A-Za-z][\w-]*)\s*,\s*([A-Za-z][\w-]*)\s*\)$/.exec(
						expression,
					);
				let point: Point;
				if (literal)
					point = {
						x: grid * Number(at(literal, 1)),
						y: grid * Number(at(literal, 2)),
					};
				else if (middle) {
					const a = resolve(at(middle, 1)),
						b = resolve(at(middle, 2));
					point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
				} else
					throw new Error("Expected coordinates (x, y) or midpoint(A, B).");
				if (
					![point.x, point.y].every(
						(v) => Number.isFinite(v) && Math.abs(v) <= 10000,
					)
				)
					throw new Error(
						"Point coordinates must be finite and within ±10000.",
					);
				points.set(name, point);
				continue;
			}
			const tokens = line.match(/\([^()]*\)|[^\s]+/g) ?? [];
			const kind = tokens.shift();
			if (!kind || !["triangle", "square", "parallelogram"].includes(kind))
				throw new Error("Expected point, triangle, square or parallelogram.");
			if (tokens.length !== (kind === "triangle" ? 3 : 4))
				throw new Error(
					`${kind} requires ${kind === "triangle" ? 3 : 4} boundary vertices.`,
				);
			const vertices = tokens.map((token) => {
				const match = coordinate.exec(token);
				return match
					? { x: grid * Number(at(match, 1)), y: grid * Number(at(match, 2)) }
					: resolve(token);
			});
			if (
				vertices.some(
					(p) =>
						![p.x, p.y].every(
							(v) => Number.isFinite(v) && Math.abs(v) <= 10000,
						),
				)
			)
				throw new Error("Invalid vertex coordinates.");
			const candidates = PIECES.filter((p) =>
				kind === "triangle" ? p.points.length === 3 : p.id === kind,
			);
			const fits = candidates
				.map((p) => fitVertices(p.id, vertices))
				.filter((p): p is Placement => p !== null);
			const fit = fits.find(
				(p) => !placements.some((used) => used.id === p.id),
			);
			if (!fit)
				throw new Error(
					fits.length
						? `No unused ${kind} of this size remains.`
						: `These vertices do not form a tangram ${kind} of the required size. List vertices around its boundary.`,
				);
			if (placements.some((p) => overlaps(p, fit)))
				throw new Error("This piece overlaps a previously declared piece.");
			placements.push(fit);
		} catch (error) {
			throw new Error(
				`Line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	validate(placements);
	return placements;
}

/** Named vertices and geometric relations; legacy placement formats remain accepted. */
export function parseSolution(source: string): Placement[] {
	if (
		/^\s*(?:grid|point|triangle|square\s+(?:[A-Za-z(])|parallelogram\s+(?:[A-Za-z(]))/m.test(
			source.replace(/#.*$/gm, ""),
		)
	)
		return parseSemanticSolution(source);
	let result: Placement[];
	if (source.trim().startsWith("[")) {
		const raw: unknown = JSON.parse(source);
		if (!Array.isArray(raw)) throw new Error("Expected a placement array.");
		result = raw.map((p) => ({
			...p,
			angle: p.angle ?? 0,
			flipped: p.flipped ?? false,
		}));
	} else
		result = source
			.split(/\r?\n/)
			.map((l) => l.replace(/#.*$/, "").trim())
			.filter(Boolean)
			.map((line) => {
				const [id, x, y, angle = "0", flip, ...extra] = line.split(/\s+/);
				if (
					!id ||
					!x ||
					!y ||
					extra.length ||
					(flip !== undefined && flip !== "flip")
				)
					throw new Error(`Invalid placement: ${line}`);
				return {
					id,
					x: Number(x),
					y: Number(y),
					angle: Number(angle),
					flipped: flip === "flip",
				};
			});
	validate(result);
	return result;
}
/** Whether one piece is entirely covered by the target silhouette. */
export function insideTarget(p: Placement, target: Placement[]): boolean {
	return (
		Math.abs(
			area(polygon(p)) -
				target.reduce(
					(sum, q) => sum + area(intersection(polygon(p), polygon(q))),
					0,
				),
		) < 1e-6
	);
}
/** Completion requires all seven unique pieces, no overlap, and full coverage. */
export function solved(state: Placement[], target: Placement[]): boolean {
	try {
		validate(state);
		validate(target);
	} catch {
		return false;
	}
	return state.every((p) => insideTarget(p, target));
}
