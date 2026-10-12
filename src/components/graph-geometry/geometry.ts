/** @module components/graph-geometry/geometry @summary Dependency-based ruler and compass constructions. */
export interface GeometryPoint {
	x: number;
	y: number;
}
export type GeometryDefinition =
	| { kind: "point"; x: number; y: number }
	| { kind: "on"; object: string; parameter: number }
	| { kind: "intersection"; first: string; second: string; branch: number }
	| { kind: "line"; first: string; second: string }
	| { kind: "segment"; first: string; second: string }
	| {
			kind: "circle";
			center: string;
			radius: number | { through: string } | { distance: [string, string] };
	  }
	| {
			kind: "arc";
			circle: string;
			start: number;
			end: number;
			clockwise: boolean;
			relativeTo?: string;
	  };
export interface GeometryObject {
	id: string;
	hidden: boolean;
	definition: GeometryDefinition;
}
export type GeometryValue =
	| { kind: "point"; point: GeometryPoint }
	| { kind: "line" | "segment"; first: GeometryPoint; second: GeometryPoint }
	| { kind: "circle"; center: GeometryPoint; radius: number }
	| {
			kind: "arc";
			center: GeometryPoint;
			radius: number;
			start: number;
			sweep: number;
	  };
export interface GeometryResult {
	values: Map<string, GeometryValue | null>;
	errors: Map<string, string>;
}
const EPS = 1e-9;
const TAU = 2 * Math.PI;
const rad = (degrees: number): number => (degrees * Math.PI) / 180;
const norm = (a: number): number => ((a % TAU) + TAU) % TAU;
export const distance = (a: GeometryPoint, b: GeometryPoint): number =>
	Math.hypot(a.x - b.x, a.y - b.y);
const cross = (a: GeometryPoint, b: GeometryPoint): number =>
	a.x * b.y - a.y * b.x;
const subtract = (a: GeometryPoint, b: GeometryPoint): GeometryPoint => ({
	x: a.x - b.x,
	y: a.y - b.y,
});
const along = (
	a: GeometryPoint,
	d: GeometryPoint,
	t: number,
): GeometryPoint => ({ x: a.x + d.x * t, y: a.y + d.y * t });
function number(text: string): number {
	if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text.trim()))
		throw new Error(`Expected a number: ${text}`);
	const value = Number(text);
	if (!Number.isFinite(value)) throw new Error("A number must be finite.");
	return value;
}
function identifier(text: string): string {
	if (!/^[A-Za-z][\w]*$/.test(text)) throw new Error(`Invalid name: ${text}`);
	return text;
}
function splitArguments(text: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] === "(") depth++;
		if (text[i] === ")") depth--;
		if (text[i] === "," && depth === 0) {
			parts.push(text.slice(start, i).trim());
			start = i + 1;
		}
	}
	if (depth !== 0) throw new Error("Unbalanced parentheses.");
	parts.push(text.slice(start).trim());
	return parts;
}
/** Parses construction commands only; no evaluation of JavaScript or equations. */
export function parseGeometry(source: string): GeometryObject[] {
	const objects: GeometryObject[] = [];
	const ids = new Set<string>();
	for (const [index, raw] of source.split("\n").entries()) {
		const line = raw.replace(/#.*$/, "").trim();
		if (!line) continue;
		try {
			const match =
				/^(point|line|segment|circle|arc)\s+(\w+)\s*=\s*(.*?)\s*(hidden)?$/.exec(
					line,
				);
			if (!match) throw new Error("Expected: type name = construction.");
			const [, type = "", id = "", expression = "", hidden] = match;
			identifier(id);
			if (ids.has(id)) throw new Error(`Duplicate name: ${id}`);
			ids.add(id);
			let definition: GeometryDefinition;
			const coordinate = /^\(([^,]+),([^,]+)\)$/.exec(expression);
			if (type === "point" && coordinate)
				definition = {
					kind: "point",
					x: number(coordinate[1] ?? ""),
					y: number(coordinate[2] ?? ""),
				};
			else {
				const call = /^(\w+)\((.*)\)$/.exec(expression);
				if (!call) throw new Error("Invalid construction.");
				const fn = call[1];
				const args = splitArguments(call[2] ?? "");
				const a = args[0] ?? "";
				const b = args[1] ?? "";
				const options = new Map<string, string>();
				const named = (start: number, allowed: string[]): void => {
					for (const arg of args.slice(start)) {
						const pair = /^([\w-]+)=(.+)$/.exec(arg);
						const key = pair?.[1] ?? "";
						const value = pair?.[2] ?? "";
						if (!allowed.includes(key) || options.has(key))
							throw new Error(`Unexpected option: ${arg}`);
						options.set(key, value);
					}
				};
				if (type === "point" && fn === "on") {
					named(1, ["angle", "t"]);
					if (options.size !== 1) throw new Error("Use angle=…deg or t=… .");
					const angle = options.get("angle");
					definition = {
						kind: "on",
						object: identifier(a),
						parameter:
							angle === undefined
								? number(options.get("t") ?? "")
								: rad(number(angle.replace(/deg$/, ""))),
					};
					// The selected parameter syntax also checks the referenced support below.
					parameterKinds.set(
						definition,
						angle === undefined ? "linear" : "circular",
					);
				} else if (type === "point" && fn === "intersection") {
					named(2, ["branch"]);
					const branch = number(options.get("branch") ?? "0");
					if (branch !== 0 && branch !== 1)
						throw new Error("An intersection branch is 0 or 1.");
					definition = {
						kind: "intersection",
						first: identifier(a),
						second: identifier(b),
						branch,
					};
				} else if (
					(type === "line" || type === "segment") &&
					fn === type &&
					args.length === 2
				)
					definition = {
						kind: type,
						first: identifier(a),
						second: identifier(b),
					};
				else if (type === "circle" && fn === "circle" && args.length === 2) {
					const length = /^distance\((\w+),\s*(\w+)\)$/.exec(b);
					const radius = b.startsWith("through=")
						? { through: identifier(b.slice(8)) }
						: length
							? {
									distance: [
										identifier(length[1] ?? ""),
										identifier(length[2] ?? ""),
									] as [string, string],
								}
							: number(b);
					if (typeof radius === "number" && radius <= 0)
						throw new Error("The radius must be positive.");
					definition = { kind: "circle", center: identifier(a), radius };
				} else if (type === "arc" && fn === "arc") {
					named(1, ["start", "end", "direction", "relative-to"]);
					const direction = options.get("direction") ?? "ccw";
					if (direction !== "ccw" && direction !== "cw")
						throw new Error("Use direction=ccw or direction=cw.");
					definition = {
						kind: "arc",
						circle: identifier(a),
						start: rad(
							number((options.get("start") ?? "").replace(/deg$/, "")),
						),
						end: rad(number((options.get("end") ?? "").replace(/deg$/, ""))),
						clockwise: direction === "cw",
						...(options.has("relative-to")
							? { relativeTo: identifier(options.get("relative-to") ?? "") }
							: {}),
					};
					if (norm(definition.end - definition.start) < EPS)
						throw new Error(
							"An arc must span more than 0 and less than 360 degrees.",
						);
				} else throw new Error(`Unsupported ${type} construction: ${fn}`);
			}
			objects.push({ id, hidden: !!hidden, definition });
		} catch (error) {
			throw new Error(
				`Line ${index + 1}: ${error instanceof Error ? error.message : error}`,
			);
		}
	}
	const byId = new Map(objects.map((o) => [o.id, o]));
	const visiting = new Set<string>();
	const visited = new Set<string>();
	const check = (id: string): void => {
		if (visited.has(id)) return;
		if (visiting.has(id)) throw new Error(`Circular dependency: ${id}`);
		const object = byId.get(id);
		if (!object) throw new Error(`Unknown object: ${id}`);
		visiting.add(id);
		for (const dep of dependencies(object.definition)) check(dep);
		const kind = (ref: string): string => {
			const d = byId.get(ref)?.definition;
			return d?.kind === "on" || d?.kind === "intersection"
				? "point"
				: (d?.kind ?? "");
		};
		const requireKind = (ref: string, allowed: string[]): void => {
			if (!allowed.includes(kind(ref)))
				throw new Error(`Invalid support ${ref} for ${id}.`);
		};
		const d = object.definition;
		if (d.kind === "line" || d.kind === "segment") {
			requireKind(d.first, ["point"]);
			requireKind(d.second, ["point"]);
		}
		if (d.kind === "circle") {
			requireKind(d.center, ["point"]);
			if (typeof d.radius !== "number") {
				for (const ref of "through" in d.radius
					? [d.radius.through]
					: d.radius.distance)
					requireKind(ref, ["point"]);
			}
		}
		if (d.kind === "on")
			requireKind(
				d.object,
				parameterKinds.get(d) === "linear"
					? ["line", "segment"]
					: ["circle", "arc"],
			);
		if (d.kind === "arc") {
			requireKind(d.circle, ["circle"]);
			if (d.relativeTo) requireKind(d.relativeTo, ["line", "segment"]);
		}
		if (d.kind === "intersection") {
			requireKind(d.first, ["line", "segment", "circle", "arc"]);
			requireKind(d.second, ["line", "segment", "circle", "arc"]);
		}
		visiting.delete(id);
		visited.add(id);
	};
	for (const object of objects) check(object.id);
	return objects;
}
const parameterKinds = new WeakMap<GeometryDefinition, "linear" | "circular">();
export function dependencies(d: GeometryDefinition): string[] {
	switch (d.kind) {
		case "point":
			return [];
		case "on":
			return [d.object];
		case "intersection":
		case "line":
		case "segment":
			return [d.first, d.second];
		case "arc":
			return [d.circle, ...(d.relativeTo ? [d.relativeTo] : [])];
		case "circle":
			return [
				d.center,
				...(typeof d.radius === "number"
					? []
					: "through" in d.radius
						? [d.radius.through]
						: d.radius.distance),
			];
	}
}
function isLinear(
	value: GeometryValue,
): value is Extract<GeometryValue, { kind: "line" | "segment" }> {
	return value.kind === "line" || value.kind === "segment";
}
function isCircular(
	value: GeometryValue,
): value is Extract<GeometryValue, { kind: "circle" | "arc" }> {
	return value.kind === "circle" || value.kind === "arc";
}
export function contains(value: GeometryValue, p: GeometryPoint): boolean {
	if (value.kind === "arc") {
		const angle = Math.atan2(p.y - value.center.y, p.x - value.center.x);
		return (
			(value.sweep > 0
				? norm(angle - value.start)
				: norm(value.start - angle)) <=
			Math.abs(value.sweep) + EPS
		);
	}
	if (value.kind === "segment") {
		const d = subtract(value.second, value.first);
		const q = subtract(p, value.first);
		const t = (q.x * d.x + q.y * d.y) / (d.x ** 2 + d.y ** 2);
		return t >= -EPS && t <= 1 + EPS;
	}
	return true;
}
/** Returns stable oriented branches, keeping absent branches null after arc/segment clipping. */
export function intersections(
	a: GeometryValue,
	b: GeometryValue,
): (GeometryPoint | null)[] {
	let points: GeometryPoint[] = [];
	if (isLinear(a) && isLinear(b)) {
		const u = subtract(a.second, a.first);
		const v = subtract(b.second, b.first);
		const determinant = cross(u, v);
		if (Math.abs(determinant) > EPS)
			points = [
				along(a.first, u, cross(subtract(b.first, a.first), v) / determinant),
			];
	} else if (isCircular(a) && isCircular(b)) {
		const delta = subtract(b.center, a.center);
		const length = distance(a.center, b.center);
		if (
			length > EPS &&
			length <= a.radius + b.radius + EPS &&
			length >= Math.abs(a.radius - b.radius) - EPS
		) {
			const x = (a.radius ** 2 - b.radius ** 2 + length ** 2) / (2 * length);
			const h = Math.sqrt(Math.max(0, a.radius ** 2 - x ** 2));
			const middle = along(a.center, delta, x / length);
			const perpendicular = { x: -delta.y / length, y: delta.x / length };
			points = [
				along(middle, perpendicular, h),
				along(middle, perpendicular, -h),
			];
		}
	} else {
		const line = isLinear(a) ? a : isLinear(b) ? b : null;
		const circle = isCircular(a) ? a : isCircular(b) ? b : null;
		if (line && circle) {
			const d = subtract(line.second, line.first);
			const q = subtract(line.first, circle.center);
			const aa = d.x ** 2 + d.y ** 2;
			const bb = 2 * (q.x * d.x + q.y * d.y);
			const cc = q.x ** 2 + q.y ** 2 - circle.radius ** 2;
			const disc = bb ** 2 - 4 * aa * cc;
			if (disc >= -EPS && aa > EPS)
				points = [
					along(line.first, d, (-bb - Math.sqrt(Math.max(0, disc))) / (2 * aa)),
					along(line.first, d, (-bb + Math.sqrt(Math.max(0, disc))) / (2 * aa)),
				];
		}
	}
	return points.map((p) => (contains(a, p) && contains(b, p) ? p : null));
}
export function evaluateGeometry(
	objects: readonly GeometryObject[],
): GeometryResult {
	const values = new Map<string, GeometryValue | null>();
	const errors = new Map<string, string>();
	const byId = new Map(objects.map((o) => [o.id, o]));
	const visiting = new Set<string>();
	const resolve = (id: string): GeometryValue | null => {
		if (values.has(id)) return values.get(id) ?? null;
		if (visiting.has(id)) throw new Error(`Circular dependency: ${id}`);
		visiting.add(id);
		try {
			const d = byId.get(id)?.definition;
			if (!d) throw new Error(`Unknown object: ${id}`);
			const get = (ref: string): GeometryValue => {
				const v = resolve(ref);
				if (!v) throw new Error(`Undefined support: ${ref}`);
				return v;
			};
			const point = (ref: string): GeometryPoint => {
				const v = get(ref);
				if (v.kind !== "point") throw new Error(`Expected point: ${ref}`);
				return v.point;
			};
			let value: GeometryValue;
			if (d.kind === "point")
				value = { kind: "point", point: { x: d.x, y: d.y } };
			else if (d.kind === "line" || d.kind === "segment") {
				const first = point(d.first);
				const second = point(d.second);
				if (distance(first, second) < EPS)
					throw new Error("The two points coincide.");
				value = { kind: d.kind, first, second };
			} else if (d.kind === "circle") {
				const center = point(d.center);
				const radius =
					typeof d.radius === "number"
						? d.radius
						: "through" in d.radius
							? distance(center, point(d.radius.through))
							: distance(
									point(d.radius.distance[0]),
									point(d.radius.distance[1]),
								);
				if (radius < EPS) throw new Error("The radius is zero.");
				value = { kind: "circle", center, radius };
			} else if (d.kind === "arc") {
				const circle = get(d.circle);
				if (circle.kind !== "circle") throw new Error("Expected a circle.");
				let offset = 0;
				if (d.relativeTo) {
					const line = get(d.relativeTo);
					if (!isLinear(line)) throw new Error("Expected a direction.");
					offset = Math.atan2(
						line.second.y - line.first.y,
						line.second.x - line.first.x,
					);
				}
				value = {
					...circle,
					kind: "arc",
					start: d.start + offset,
					sweep: d.clockwise ? -norm(d.start - d.end) : norm(d.end - d.start),
				};
			} else if (d.kind === "on") {
				const support = get(d.object);
				let p: GeometryPoint;
				if (isLinear(support))
					p = along(
						support.first,
						subtract(support.second, support.first),
						support.kind === "segment"
							? Math.max(0, Math.min(1, d.parameter))
							: d.parameter,
					);
				else if (isCircular(support)) {
					let angle = d.parameter;
					if (
						support.kind === "arc" &&
						!contains(
							support,
							along(
								support.center,
								{ x: Math.cos(angle), y: Math.sin(angle) },
								support.radius,
							),
						)
					)
						angle = nearestArcAngle(support, angle);
					p = along(
						support.center,
						{ x: Math.cos(angle), y: Math.sin(angle) },
						support.radius,
					);
				} else throw new Error("Expected a line or circle.");
				value = { kind: "point", point: p };
			} else {
				const p = intersections(get(d.first), get(d.second))[d.branch];
				if (!p) throw new Error("This intersection does not exist.");
				value = { kind: "point", point: p };
			}
			values.set(id, value);
			return value;
		} catch (error) {
			errors.set(id, error instanceof Error ? error.message : String(error));
			values.set(id, null);
			return null;
		} finally {
			visiting.delete(id);
		}
	};
	for (const object of objects) resolve(object.id);
	return { values, errors };
}
function nearestArcAngle(
	arc: Extract<GeometryValue, { kind: "arc" }>,
	angle: number,
): number {
	const delta = (a: number): number =>
		Math.abs(Math.atan2(Math.sin(a - angle), Math.cos(a - angle)));
	return delta(arc.start) <= delta(arc.start + arc.sweep)
		? arc.start
		: arc.start + arc.sweep;
}
export function parameterAt(support: GeometryValue, p: GeometryPoint): number {
	if (isCircular(support)) {
		const angle = Math.atan2(p.y - support.center.y, p.x - support.center.x);
		return support.kind === "arc" && !contains(support, p)
			? nearestArcAngle(support, angle)
			: angle;
	}
	if (isLinear(support)) {
		const d = subtract(support.second, support.first);
		const q = subtract(p, support.first);
		const t = (q.x * d.x + q.y * d.y) / (d.x ** 2 + d.y ** 2);
		return support.kind === "segment" ? Math.max(0, Math.min(1, t)) : t;
	}
	throw new Error("Select a line, segment, circle or arc.");
}
export function serializeGeometry(objects: readonly GeometryObject[]): string {
	const n = (value: number): string => String(Number(value.toPrecision(12)));
	return objects
		.map(({ id, hidden, definition: d }) => {
			let type: string = d.kind;
			let expression: string;
			if (d.kind === "point") expression = `(${n(d.x)}, ${n(d.y)})`;
			else if (d.kind === "on") {
				type = "point";
				const support = objects.find((o) => o.id === d.object)?.definition.kind;
				expression = `on(${d.object}, ${support === "line" || support === "segment" ? `t=${n(d.parameter)}` : `angle=${n((d.parameter * 180) / Math.PI)}deg`})`;
			} else if (d.kind === "intersection") {
				type = "point";
				expression = `intersection(${d.first}, ${d.second}, branch=${d.branch})`;
			} else if (d.kind === "line" || d.kind === "segment")
				expression = `${d.kind}(${d.first}, ${d.second})`;
			else if (d.kind === "circle")
				expression = `circle(${d.center}, ${typeof d.radius === "number" ? n(d.radius) : "through" in d.radius ? `through=${d.radius.through}` : `distance(${d.radius.distance.join(", ")})`})`;
			else
				expression = `arc(${d.circle}, start=${n((d.start * 180) / Math.PI)}deg, end=${n((d.end * 180) / Math.PI)}deg, direction=${d.clockwise ? "cw" : "ccw"}${d.relativeTo ? `, relative-to=${d.relativeTo}` : ""})`;
			return `${type} ${id} = ${expression}${hidden ? " hidden" : ""}`;
		})
		.join("\n");
}
export const MEDIATRIX_CONSTRUCTION = `point A = (-3, 0)
point B = (3, 0)
segment AB = segment(A, B)
circle cA = circle(A, distance(A, B)) hidden
circle cB = circle(B, distance(A, B)) hidden
arc aC = arc(cA, start=40deg, end=80deg, relative-to=AB)
arc aD = arc(cA, start=280deg, end=320deg, relative-to=AB)
arc bC = arc(cB, start=100deg, end=140deg, relative-to=AB)
arc bD = arc(cB, start=220deg, end=260deg, relative-to=AB)
point C = intersection(aC, bC, branch=0)
point D = intersection(aD, bD, branch=1)
line m = line(C, D)`;
