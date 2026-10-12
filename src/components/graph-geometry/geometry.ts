/** @module components/graph-geometry/geometry @summary Dependency-based ruler and compass constructions. */
import { TP_COLOR_PRESETS } from "../color/color-presets.js";
export const GEOMETRY_COLORS = TP_COLOR_PRESETS.map((color) => color.slice(3));
export const GEOMETRY_STYLES = ["hidden", "dotted", "dashed", "solid"] as const;
export type GeometryStroke = "dotted" | "dashed" | "solid";
export interface GeometryPoint {
	x: number;
	y: number;
}
export const GEOMETRY_TRANSFORMATIONS = [
	"axialSymmetry",
	"centralSymmetry",
	"homothety",
	"rotation",
	"translation",
] as const;
export type GeometryTransformation = (typeof GEOMETRY_TRANSFORMATIONS)[number];
export type GeometryDefinition =
	| {
			kind: "measure";
			offset?: GeometryPoint;
			operation: "length" | "area" | "angle";
			inputs: string[];
	  }
	| {
			kind: "transform";
			operation: GeometryTransformation;
			object: string | GeometryDefinition;
			support: string;
			output: GeometryValue["kind"];
			amount: number;
	  }
	| { kind: "polygon"; vertices: string[] }
	| { kind: "regularPolygon"; first: string; second: string; sides: number }
	| { kind: "point"; x: number; y: number }
	| { kind: "on"; object: string; parameter: number }
	| { kind: "intersection"; first: string; second: string; branch: number }
	| { kind: "line" | "ray" | "vector"; first: string; second: string }
	| { kind: "segment"; first: string; second: string; length?: number }
	| { kind: "midpoint" | "perpendicularBisector"; segment: string }
	| { kind: "parallel" | "perpendicular"; point: string; support: string }
	| { kind: "bisector"; first: string; vertex: string; second: string }
	| { kind: "tangent"; point: string; circle: string; branch: number }
	| { kind: "comment"; point: string; text: string }
	| {
			kind: "circle";
			center: string;
			radius: number | { through: string } | { distance: [string, string] };
	  }
	| {
			kind: "arc" | "sector";
			circle: string;
			start: number;
			end: number;
			clockwise: boolean;
			relativeTo?: string;
	  };
export interface GeometryObject {
	id: string;
	hidden: boolean;
	stroke?: GeometryStroke;
	color?: string;
	definition: GeometryDefinition;
}
export type GeometryValue =
	| { kind: "polygon"; vertices: GeometryPoint[] }
	| { kind: "point"; point: GeometryPoint }
	| {
			kind: "line" | "segment" | "ray" | "vector";
			first: GeometryPoint;
			second: GeometryPoint;
	  }
	| {
			kind: "comment";
			point: GeometryPoint;
			text: string;
			angleMark?: {
				vertex: GeometryPoint;
				start: number;
				sweep: number;
				right: boolean;
			};
	  }
	| { kind: "circle"; center: GeometryPoint; radius: number }
	| {
			kind: "arc" | "sector";
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
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		if (quoted && text[i] === "\\") {
			i++;
			continue;
		}
		if (text[i] === '"') {
			quoted = !quoted;
			continue;
		}
		if (quoted) continue;
		if (text[i] === "(") depth++;
		if (text[i] === ")") depth--;
		if (text[i] === "," && depth === 0) {
			parts.push(text.slice(start, i).trim());
			start = i + 1;
		}
	}
	if (depth !== 0 || quoted) throw new Error("Unbalanced parentheses.");
	parts.push(text.slice(start).trim());
	return parts;
}
/** Parses construction commands only; no evaluation of JavaScript or equations. */
function parseGeometryCommands(source: string, depth = 0): GeometryObject[] {
	if (depth > 64) throw new Error("Too many nested transformations.");
	const objects: GeometryObject[] = [];
	const ids = new Set<string>();
	for (const [index, raw] of source.split("\n").entries()) {
		const line = raw
			.replace(/"(?:[^"\\]|\\.)*"|(#.*$)/g, (match, comment) =>
				comment ? "" : match,
			)
			.trim();
		if (!line) continue;
		try {
			const match =
				/^(point|line|segment|ray|vector|circle|arc|sector|comment|polygon)\s+(\w+)\s*=\s*(.*?)(\s+(?:(?:style|color)=\w+|hidden)(?:\s+(?:(?:style|color)=\w+|hidden))*)?$/.exec(
					line,
				);
			if (!match) throw new Error("Expected: type name = construction.");
			const [, type = "", id = "", expression = "", appearance = ""] = match;
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
				if (GEOMETRY_TRANSFORMATIONS.includes(fn as GeometryTransformation)) {
					const operation = fn as GeometryTransformation;
					const option =
						operation === "homothety"
							? "ratio"
							: operation === "rotation"
								? "angle"
								: null;
					named(2, option ? [option] : []);
					const amount = option
						? number(
								(options.get(option) ?? "").replace(
									operation === "rotation" ? /deg$/ : /$^/,
									"",
								),
							)
						: 1;
					if (operation === "homothety" && amount === 0)
						throw new Error("The homothety ratio must be nonzero.");
					definition = {
						kind: "transform",
						operation,
						object: /^[A-Za-z][\w]*$/.test(a)
							? identifier(a)
							: (() => {
									const nested = parseGeometryCommands(
										`${type} nested = ${a}`,
										depth + 1,
									)[0];
									if (!nested || nested.hidden || nested.color || nested.stroke)
										throw new Error("Expected a construction expression.");
									return nested.definition;
								})(),
						support: identifier(b),
						output: type as GeometryValue["kind"],
						amount,
					};
				} else if (type === "point" && fn === "on") {
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
				} else if (type === "polygon" && fn === "polygon") {
					const vertices = args.map(identifier);
					if (vertices.length < 3 || new Set(vertices).size !== vertices.length)
						throw new Error(
							"A polygon needs at least three distinct vertices.",
						);
					definition = { kind: "polygon", vertices };
				} else if (type === "polygon" && fn === "regularPolygon") {
					named(2, ["sides"]);
					const sides = number(options.get("sides") ?? "");
					if (!Number.isInteger(sides) || sides < 3 || sides > 360)
						throw new Error("Sides must be an integer from 3 to 360.");
					definition = {
						kind: "regularPolygon",
						first: identifier(a),
						second: identifier(b),
						sides,
					};
				} else if (type === "point" && fn === "midpoint" && args.length === 1) {
					definition = { kind: "midpoint", segment: identifier(a) };
				} else if (
					type === "line" &&
					fn === "perpendicularBisector" &&
					args.length === 1
				) {
					definition = {
						kind: "perpendicularBisector",
						segment: identifier(a),
					};
				} else if (
					type === "line" &&
					(fn === "parallel" || fn === "perpendicular") &&
					args.length === 2
				) {
					definition = {
						kind: fn,
						point: identifier(a),
						support: identifier(b),
					};
				} else if (type === "line" && fn === "bisector" && args.length === 3) {
					definition = {
						kind: "bisector",
						first: identifier(a),
						vertex: identifier(b),
						second: identifier(args[2] ?? ""),
					};
				} else if (type === "line" && fn === "tangent") {
					named(2, ["branch"]);
					const branch = number(options.get("branch") ?? "0");
					if (branch !== 0 && branch !== 1)
						throw new Error("A tangent branch is 0 or 1.");
					definition = {
						kind: "tangent",
						point: identifier(a),
						circle: identifier(b),
						branch,
					};
				} else if (
					type === "comment" &&
					(fn === "length" || fn === "area" || fn === "angle")
				) {
					const optionIndex = args.findIndex((arg) => arg.includes("="));
					const inputs = optionIndex < 0 ? args : args.slice(0, optionIndex);
					named(inputs.length, ["dx", "dy"]);
					if (
						!(fn === "angle"
							? inputs.length === 3 || inputs.length === 2
							: fn === "length"
								? inputs.length === 1 || inputs.length === 2
								: inputs.length === 1)
					)
						throw new Error("Invalid measurement arguments.");
					const x = number(options.get("dx") ?? "0"),
						y = number(options.get("dy") ?? "0");
					definition = {
						kind: "measure",
						operation: fn,
						inputs: inputs.map(identifier),
						...(x || y ? { offset: { x, y } } : {}),
					};
				} else if (
					type === "comment" &&
					fn === "comment" &&
					args.length === 2
				) {
					const text: unknown = JSON.parse(b);
					if (typeof text !== "string" || !text.trim())
						throw new Error("A comment needs nonempty quoted text.");
					definition = { kind: "comment", point: identifier(a), text };
				} else if (
					(type === "line" ||
						type === "segment" ||
						type === "ray" ||
						type === "vector") &&
					fn === type
				) {
					named(2, type === "segment" ? ["length"] : []);
					const length = options.has("length")
						? number(options.get("length") ?? "")
						: undefined;
					if (length !== undefined && length <= 0)
						throw new Error("The length must be positive.");
					definition = {
						kind: type,
						first: identifier(a),
						second: identifier(b),
						...(length === undefined ? {} : { length }),
					};
				} else if (type === "circle" && fn === "circle" && args.length === 2) {
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
				} else if ((type === "arc" || type === "sector") && fn === type) {
					named(1, ["start", "end", "direction", "relative-to"]);
					const direction = options.get("direction") ?? "ccw";
					if (direction !== "ccw" && direction !== "cw")
						throw new Error("Use direction=ccw or direction=cw.");
					definition = {
						kind: type,
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
			const object: GeometryObject = { id, hidden: false, definition };
			const seen = new Set<string>();
			for (const option of appearance.trim().split(/\s+/).filter(Boolean)) {
				const [key = "", value = ""] = option.split("=");
				if (seen.has(key))
					throw new Error(`Duplicate appearance option: ${key}`);
				seen.add(key);
				if (key === "hidden") object.hidden = true;
				else if (key === "style") {
					if (!(GEOMETRY_STYLES as readonly string[]).includes(value))
						throw new Error(`Unknown stroke style: ${value}`);
					if (value === "hidden") object.hidden = true;
					else if (value !== "solid") object.stroke = value as GeometryStroke;
				} else {
					if (!GEOMETRY_COLORS.includes(value))
						throw new Error(`Unknown library color: ${value}`);
					object.color = value;
				}
			}
			objects.push(object);
		} catch (error) {
			throw new Error(
				`Line ${index + 1}: ${error instanceof Error ? error.message : error}`,
			);
		}
	}
	return objects;
}
/** Parses construction commands and validates their dependency graph. */
export function parseGeometry(source: string): GeometryObject[] {
	const objects = parseGeometryCommands(source);
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
			return d ? constructionKind(d) : "";
		};
		const requireKind = (ref: string, allowed: string[]): void => {
			if (!allowed.includes(kind(ref)))
				throw new Error(`Invalid support ${ref} for ${id}.`);
		};
		const checkDefinition = (d: GeometryDefinition): void => {
			if (d.kind === "transform") {
				if (typeof d.object === "string") requireKind(d.object, [d.output]);
				else {
					checkDefinition(d.object);
					if (constructionKind(d.object) !== d.output)
						throw new Error(`Invalid nested construction for ${id}.`);
				}
				requireKind(
					d.support,
					d.operation === "axialSymmetry"
						? ["line", "segment", "ray", "vector"]
						: d.operation === "translation"
							? ["vector"]
							: ["point"],
				);
			}
			if (d.kind === "polygon" || d.kind === "regularPolygon")
				for (const ref of dependencies(d)) requireKind(ref, ["point"]);
			if (
				d.kind === "line" ||
				d.kind === "segment" ||
				d.kind === "ray" ||
				d.kind === "vector"
			) {
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
						? ["line", "segment", "ray", "vector"]
						: ["circle", "arc"],
				);
			if (d.kind === "arc" || d.kind === "sector") {
				requireKind(d.circle, ["circle"]);
				if (d.relativeTo)
					requireKind(d.relativeTo, ["line", "segment", "ray", "vector"]);
			}
			if (d.kind === "intersection") {
				requireKind(d.first, [
					"line",
					"segment",
					"ray",
					"vector",
					"circle",
					"arc",
				]);
				requireKind(d.second, [
					"line",
					"segment",
					"ray",
					"vector",
					"circle",
					"arc",
				]);
			}
			if (d.kind === "midpoint" || d.kind === "perpendicularBisector")
				requireKind(d.segment, ["segment"]);
			if (d.kind === "parallel" || d.kind === "perpendicular") {
				requireKind(d.point, ["point"]);
				requireKind(d.support, ["line", "segment", "ray", "vector"]);
			}
			if (d.kind === "bisector") {
				for (const ref of [d.first, d.vertex, d.second])
					requireKind(ref, ["point"]);
			}
			if (d.kind === "tangent") {
				requireKind(d.point, ["point"]);
				requireKind(d.circle, ["circle"]);
			}
			if (d.kind === "measure") {
				const allowed =
					d.operation === "angle" && d.inputs.length === 2
						? ["segment", "ray", "vector", "line"]
						: d.operation === "angle" || d.inputs.length === 2
							? ["point"]
							: d.operation === "area"
								? ["polygon", "circle", "sector"]
								: ["segment", "vector", "circle", "arc", "polygon", "sector"];
				for (const ref of d.inputs) requireKind(ref, allowed);
			}
			if (d.kind === "comment") requireKind(d.point, ["point"]);
		};
		checkDefinition(object.definition);
		visiting.delete(id);
		visited.add(id);
	};
	for (const object of objects) check(object.id);
	return objects;
}
/** Geometric kind produced by a construction, independent of its recipe. */
export function constructionKind(d: GeometryDefinition): GeometryValue["kind"] {
	if (d.kind === "transform") return d.output;
	if (d.kind === "regularPolygon") return "polygon";
	if (d.kind === "measure") return "comment";
	if (d.kind === "on" || d.kind === "intersection" || d.kind === "midpoint")
		return "point";
	if (
		[
			"parallel",
			"perpendicular",
			"perpendicularBisector",
			"bisector",
			"tangent",
		].includes(d.kind)
	)
		return "line";
	return d.kind as GeometryValue["kind"];
}
const parameterKinds = new WeakMap<GeometryDefinition, "linear" | "circular">();
export function dependencies(d: GeometryDefinition): string[] {
	switch (d.kind) {
		case "measure":
			return d.inputs;
		case "transform":
			return [
				...(typeof d.object === "string" ? [d.object] : dependencies(d.object)),
				d.support,
			];
		case "polygon":
			return d.vertices;
		case "regularPolygon":
			return [d.first, d.second];
		case "point":
			return [];
		case "on":
			return [d.object];
		case "intersection":
		case "line":
		case "segment":
		case "ray":
		case "vector":
			return [d.first, d.second];
		case "midpoint":
		case "perpendicularBisector":
			return [d.segment];
		case "parallel":
		case "perpendicular":
			return [d.point, d.support];
		case "bisector":
			return [d.first, d.vertex, d.second];
		case "tangent":
			return [d.point, d.circle];
		case "comment":
			return [d.point];
		case "sector":
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
export function isLinear(
	value: GeometryValue,
): value is Extract<
	GeometryValue,
	{ kind: "line" | "segment" | "ray" | "vector" }
> {
	return (
		value.kind === "line" ||
		value.kind === "segment" ||
		value.kind === "ray" ||
		value.kind === "vector"
	);
}
function isCircular(
	value: GeometryValue,
): value is Extract<GeometryValue, { kind: "circle" | "arc" | "sector" }> {
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
	if (
		value.kind === "segment" ||
		value.kind === "vector" ||
		value.kind === "ray"
	) {
		const d = subtract(value.second, value.first);
		const q = subtract(p, value.first);
		const t = (q.x * d.x + q.y * d.y) / (d.x ** 2 + d.y ** 2);
		return t >= -EPS && (value.kind === "ray" || t <= 1 + EPS);
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
/** Applies a similarity to any geometric value, preserving its kind. */
function transformGeometry(
	value: GeometryValue,
	support: GeometryValue,
	operation: GeometryTransformation,
	amount: number,
): GeometryValue {
	let map: (p: GeometryPoint) => GeometryPoint;
	let scale = 1;
	let orientation = 1;
	if (operation === "translation") {
		if (support.kind !== "vector") throw new Error("Select a vector.");
		const delta = subtract(support.second, support.first);
		map = (p) => along(p, delta, 1);
	} else if (operation === "axialSymmetry") {
		if (!isLinear(support)) throw new Error("Select a linear axis.");
		const delta = subtract(support.second, support.first);
		const length2 = delta.x ** 2 + delta.y ** 2;
		if (length2 < EPS * EPS) throw new Error("The axis is undefined.");
		orientation = -1;
		map = (p) => {
			const v = subtract(p, support.first);
			const projection = along(
				support.first,
				delta,
				(v.x * delta.x + v.y * delta.y) / length2,
			);
			return { x: 2 * projection.x - p.x, y: 2 * projection.y - p.y };
		};
	} else {
		if (support.kind !== "point") throw new Error("Select a centre point.");
		const center = support.point;
		const angle = operation === "rotation" ? rad(amount) : 0;
		const factor =
			operation === "homothety"
				? amount
				: operation === "centralSymmetry"
					? -1
					: 1;
		scale = Math.abs(factor);
		map = (p) => {
			const v = subtract(p, center);
			return {
				x: center.x + factor * (v.x * Math.cos(angle) - v.y * Math.sin(angle)),
				y: center.y + factor * (v.x * Math.sin(angle) + v.y * Math.cos(angle)),
			};
		};
	}
	if (value.kind === "comment" && value.angleMark) {
		const mark = value.angleMark;
		const vertex = map(mark.vertex);
		const tip = map({
			x: mark.vertex.x + Math.cos(mark.start),
			y: mark.vertex.y + Math.sin(mark.start),
		});
		return {
			...value,
			point: map(value.point),
			angleMark: {
				...mark,
				vertex,
				start: Math.atan2(tip.y - vertex.y, tip.x - vertex.x),
				sweep: mark.sweep * orientation,
			},
		};
	}
	if (value.kind === "point" || value.kind === "comment")
		return { ...value, point: map(value.point) };
	if (isLinear(value))
		return { ...value, first: map(value.first), second: map(value.second) };
	if (value.kind === "polygon")
		return { ...value, vertices: value.vertices.map(map) };
	const center = map(value.center);
	const radius = value.radius * scale;
	if (value.kind === "circle") return { kind: "circle", center, radius };
	const start = map({
		x: value.center.x + value.radius * Math.cos(value.start),
		y: value.center.y + value.radius * Math.sin(value.start),
	});
	return {
		...value,
		center,
		radius,
		start: Math.atan2(start.y - center.y, start.x - center.x),
		sweep: orientation * value.sweep,
	};
}
/** Dynamic measurement labels use construction units and degrees. */
function measureGeometry(
	d: Extract<GeometryDefinition, { kind: "measure" }>,
	get: (ref: string) => GeometryValue,
): GeometryValue {
	const values = d.inputs.map(get);
	const first = values[0];
	if (!first) throw new Error("Missing measurement support.");
	let amount = 0;
	let angleMark: Extract<GeometryValue, { kind: "comment" }>["angleMark"];
	let anchor: GeometryPoint;
	const average = (points: GeometryPoint[]): GeometryPoint => ({
		x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
		y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
	});
	if (d.operation === "angle" && values.length === 2) {
		const second = values[1];
		if (!isLinear(first) || !second || !isLinear(second))
			throw new Error("Select two linear sides.");
		const shared = [first.first, first.second].find(
			(p) =>
				distance(p, second.first) < EPS || distance(p, second.second) < EPS,
		);
		const vertex =
			shared ?? intersections(first, second).find((p) => p !== null);
		if (!vertex)
			throw new Error("The sides need a common vertex or intersection.");
		const tip = (side: typeof first): GeometryPoint =>
			distance(side.first, vertex) > distance(side.second, vertex)
				? side.first
				: side.second;
		const a = tip(first),
			b = tip(second);
		if (distance(a, vertex) < EPS || distance(b, vertex) < EPS)
			throw new Error("The angle needs two nonzero arms.");
		const u = subtract(a, vertex),
			v = subtract(b, vertex);
		const sweep = Math.atan2(cross(u, v), u.x * v.x + u.y * v.y);
		amount = (Math.abs(sweep) * 180) / Math.PI;
		angleMark = {
			vertex,
			start: Math.atan2(u.y, u.x),
			sweep,
			right: Math.abs(amount - 90) < 1e-7,
		};
		anchor = vertex;
	} else if (d.operation === "angle" || values.length === 2) {
		const points = values.map((v) => {
			if (v.kind !== "point") throw new Error("Select points.");
			return v.point;
		});
		const [a, b, c] = points;
		if (!a || !b) throw new Error("Select two points.");
		if (d.operation === "angle") {
			if (!c || distance(a, b) < EPS || distance(c, b) < EPS)
				throw new Error("The angle needs two nonzero arms.");
			const u = subtract(a, b),
				v = subtract(c, b);
			amount =
				(Math.atan2(Math.abs(cross(u, v)), u.x * v.x + u.y * v.y) * 180) /
				Math.PI;
			anchor = b;
		} else {
			amount = distance(a, b);
			anchor = average([a, b]);
		}
	} else if (first.kind === "polygon") {
		anchor = average(first.vertices);
		const vertices = first.vertices;
		if (d.operation === "area") {
			// Crossing boundaries do not define a single simple polygon area.
			for (let i = 0; i < vertices.length; i++) {
				const a = vertices[i],
					b = vertices[(i + 1) % vertices.length];
				if (!a || !b) continue;
				for (let j = i + 2; j < vertices.length; j++) {
					if (i === 0 && j === vertices.length - 1) continue;
					const c = vertices[j],
						e = vertices[(j + 1) % vertices.length];
					if (!c || !e) continue;
					const orientation = (
						p: GeometryPoint,
						q: GeometryPoint,
						r: GeometryPoint,
					): number => cross(subtract(q, p), subtract(r, p));
					const onEdge = (
						p: GeometryPoint,
						q: GeometryPoint,
						r: GeometryPoint,
					): boolean =>
						Math.abs(orientation(p, q, r)) < EPS &&
						r.x >= Math.min(p.x, q.x) - EPS &&
						r.x <= Math.max(p.x, q.x) + EPS &&
						r.y >= Math.min(p.y, q.y) - EPS &&
						r.y <= Math.max(p.y, q.y) + EPS;
					if (
						(orientation(a, b, c) * orientation(a, b, e) < 0 &&
							orientation(c, e, a) * orientation(c, e, b) < 0) ||
						onEdge(a, b, c) ||
						onEdge(a, b, e) ||
						onEdge(c, e, a) ||
						onEdge(c, e, b)
					)
						throw new Error(
							"Area requires a simple polygon without crossing edges.",
						);
				}
			}
		}
		for (let i = 0; i < vertices.length; i++) {
			const a = vertices[i],
				b = vertices[(i + 1) % vertices.length];
			if (!a || !b) continue;
			amount +=
				d.operation === "area"
					? cross(
							subtract(a, vertices[0] ?? a),
							subtract(b, vertices[0] ?? a),
						) / 2
					: distance(a, b);
		}
		amount = Math.abs(amount);
	} else if (first.kind === "segment" || first.kind === "vector") {
		amount = distance(first.first, first.second);
		anchor = average([first.first, first.second]);
	} else if (
		first.kind === "circle" ||
		first.kind === "arc" ||
		first.kind === "sector"
	) {
		const sweep = first.kind === "circle" ? TAU : Math.abs(first.sweep);
		amount =
			d.operation === "area"
				? (first.radius ** 2 * sweep) / 2
				: first.radius * sweep +
					(first.kind === "sector" ? 2 * first.radius : 0);
		anchor =
			first.kind === "arc"
				? {
						x:
							first.center.x +
							first.radius * Math.cos(first.start + first.sweep / 2),
						y:
							first.center.y +
							first.radius * Math.sin(first.start + first.sweep / 2),
					}
				: first.center;
	} else throw new Error("Unsupported measurement support.");
	if (!Number.isFinite(amount))
		throw new Error("The measurement is undefined.");
	const unit =
		d.operation === "angle" ? "°" : d.operation === "area" ? " u²" : " u";
	return {
		kind: "comment",
		point: {
			x: anchor.x + (d.offset?.x ?? 0),
			y: anchor.y + (d.offset?.y ?? 0),
		},
		text: angleMark
			? angleMark.right
				? ""
				: `${Number(amount.toFixed(2))}°`
			: `${d.operation}(${d.inputs.join(", ")}) = ${Number(amount.toFixed(2))}${unit}`,
		...(angleMark ? { angleMark } : {}),
	};
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
			const evaluateDefinition = (d: GeometryDefinition): GeometryValue => {
				let value: GeometryValue;
				if (d.kind === "transform")
					value = transformGeometry(
						typeof d.object === "string"
							? get(d.object)
							: evaluateDefinition(d.object),
						get(d.support),
						d.operation,
						d.amount,
					);
				else if (d.kind === "polygon" || d.kind === "regularPolygon") {
					let vertices: GeometryPoint[];
					if (d.kind === "polygon") vertices = d.vertices.map(point);
					else {
						const a = point(d.first),
							b = point(d.second);
						vertices = [a, b];
						const angle = TAU / d.sides;
						let dx = b.x - a.x,
							dy = b.y - a.y;
						for (let i = 2; i < d.sides; i++) {
							const nextX = dx * Math.cos(angle) - dy * Math.sin(angle);
							dy = dx * Math.sin(angle) + dy * Math.cos(angle);
							dx = nextX;
							const last = vertices[i - 1] ?? b;
							vertices.push({ x: last.x + dx, y: last.y + dy });
						}
					}
					if (
						vertices.some(
							(p, i) =>
								distance(p, vertices[(i + 1) % vertices.length] ?? p) < EPS,
						)
					)
						throw new Error("Consecutive polygon vertices coincide.");
					value = { kind: "polygon", vertices };
				} else if (d.kind === "point")
					value = { kind: "point", point: { x: d.x, y: d.y } };
				else if (
					d.kind === "line" ||
					d.kind === "segment" ||
					d.kind === "ray" ||
					d.kind === "vector"
				) {
					const first = point(d.first);
					let second = point(d.second);
					if (distance(first, second) < EPS)
						throw new Error("The two points coincide.");
					if (d.kind === "segment" && d.length !== undefined)
						second = along(
							first,
							subtract(second, first),
							d.length / distance(first, second),
						);
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
				} else if (d.kind === "arc" || d.kind === "sector") {
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
						kind: d.kind,
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
							linearParameter(support, d.parameter),
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
				} else if (d.kind === "measure") {
					value = measureGeometry(d, get);
				} else if (d.kind === "comment") {
					value = { kind: "comment", point: point(d.point), text: d.text };
				} else if (
					d.kind === "midpoint" ||
					d.kind === "perpendicularBisector"
				) {
					const segment = get(d.segment);
					if (segment.kind !== "segment")
						throw new Error("Expected a segment.");
					const middle = along(
						segment.first,
						subtract(segment.second, segment.first),
						0.5,
					);
					const delta = subtract(segment.second, segment.first);
					value =
						d.kind === "midpoint"
							? { kind: "point", point: middle }
							: {
									kind: "line",
									first: middle,
									second: along(middle, { x: -delta.y, y: delta.x }, 1),
								};
				} else if (d.kind === "parallel" || d.kind === "perpendicular") {
					const support = get(d.support);
					if (!isLinear(support)) throw new Error("Expected a linear support.");
					const first = point(d.point);
					const delta = subtract(support.second, support.first);
					value = {
						kind: "line",
						first,
						second: along(
							first,
							d.kind === "parallel" ? delta : { x: -delta.y, y: delta.x },
							1,
						),
					};
				} else if (d.kind === "bisector") {
					const vertex = point(d.vertex);
					const u = subtract(point(d.first), vertex);
					const v = subtract(point(d.second), vertex);
					const a = Math.hypot(u.x, u.y),
						b = Math.hypot(v.x, v.y);
					if (a < EPS || b < EPS)
						throw new Error("The angle needs two nonzero arms.");
					const delta = { x: u.x / a + v.x / b, y: u.y / a + v.y / b };
					if (Math.hypot(delta.x, delta.y) < EPS) {
						delta.x = -u.y / a;
						delta.y = u.x / a;
					}
					value = {
						kind: "line",
						first: vertex,
						second: along(vertex, delta, 1),
					};
				} else if (d.kind === "tangent") {
					const circle = get(d.circle);
					if (circle.kind !== "circle") throw new Error("Expected a circle.");
					const first = point(d.point);
					const delta = subtract(first, circle.center);
					const length = distance(first, circle.center);
					if (length < circle.radius - EPS)
						throw new Error("No tangent from inside the circle.");
					if (Math.abs(length - circle.radius) <= EPS) {
						value = {
							kind: "line",
							first,
							second: along(
								first,
								{ x: -delta.y / length, y: delta.x / length },
								1,
							),
						};
					} else {
						const base = along(
							circle.center,
							delta,
							(circle.radius / length) ** 2,
						);
						const height =
							circle.radius * Math.sqrt(1 - (circle.radius / length) ** 2);
						const contact = along(
							base,
							{ x: -delta.y / length, y: delta.x / length },
							d.branch === 0 ? height : -height,
						);
						value = { kind: "line", first, second: contact };
					}
				} else if (d.kind === "intersection") {
					const p = intersections(get(d.first), get(d.second))[d.branch];
					if (!p) throw new Error("This intersection does not exist.");
					value = { kind: "point", point: p };
				} else throw new Error("Unsupported construction.");
				return value;
			};
			const value = evaluateDefinition(d);
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
	arc: Extract<GeometryValue, { kind: "arc" | "sector" }>,
	angle: number,
): number {
	const delta = (a: number): number =>
		Math.abs(Math.atan2(Math.sin(a - angle), Math.cos(a - angle)));
	return delta(arc.start) <= delta(arc.start + arc.sweep)
		? arc.start
		: arc.start + arc.sweep;
}
function linearParameter(support: GeometryValue, t: number): number {
	if (support.kind === "segment" || support.kind === "vector")
		return Math.max(0, Math.min(1, t));
	return support.kind === "ray" ? Math.max(0, t) : t;
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
		return linearParameter(support, t);
	}
	throw new Error("Select a line, segment, circle or arc.");
}
export function serializeGeometry(objects: readonly GeometryObject[]): string {
	const n = (value: number): string => String(Number(value.toPrecision(12)));
	return objects
		.map(({ id, hidden, stroke, color, definition: d }) => {
			const type = constructionKind(d);
			const expressionOf = (d: GeometryDefinition): string => {
				let expression: string;
				if (d.kind === "transform")
					expression = `${d.operation}(${typeof d.object === "string" ? d.object : expressionOf(d.object)}, ${d.support}${d.operation === "homothety" ? `, ratio=${n(d.amount)}` : d.operation === "rotation" ? `, angle=${n(d.amount)}deg` : ""})`;
				else if (d.kind === "polygon")
					expression = `polygon(${d.vertices.join(", ")})`;
				else if (d.kind === "regularPolygon")
					expression = `regularPolygon(${d.first}, ${d.second}, sides=${d.sides})`;
				else if (d.kind === "point") expression = `(${n(d.x)}, ${n(d.y)})`;
				else if (d.kind === "on") {
					const definition = objects.find((o) => o.id === d.object)?.definition;
					const support = definition ? constructionKind(definition) : "";
					expression = `on(${d.object}, ${["line", "segment", "ray", "vector"].includes(support) ? `t=${n(d.parameter)}` : `angle=${n((d.parameter * 180) / Math.PI)}deg`})`;
				} else if (d.kind === "intersection") {
					expression = `intersection(${d.first}, ${d.second}, branch=${d.branch})`;
				} else if (
					d.kind === "line" ||
					d.kind === "segment" ||
					d.kind === "ray" ||
					d.kind === "vector"
				)
					expression = `${d.kind}(${d.first}, ${d.second}${d.kind === "segment" && d.length !== undefined ? `, length=${n(d.length)}` : ""})`;
				else if (d.kind === "circle")
					expression = `circle(${d.center}, ${typeof d.radius === "number" ? n(d.radius) : "through" in d.radius ? `through=${d.radius.through}` : `distance(${d.radius.distance.join(", ")})`})`;
				else if (d.kind === "measure")
					expression = `${d.operation}(${d.inputs.join(", ")}${d.offset ? `, dx=${n(d.offset.x)}, dy=${n(d.offset.y)}` : ""})`;
				else if (d.kind === "comment")
					expression = `comment(${d.point}, ${JSON.stringify(d.text)})`;
				else if (d.kind === "midpoint" || d.kind === "perpendicularBisector")
					expression = `${d.kind}(${d.segment})`;
				else if (d.kind === "parallel" || d.kind === "perpendicular")
					expression = `${d.kind}(${d.point}, ${d.support})`;
				else if (d.kind === "bisector")
					expression = `bisector(${d.first}, ${d.vertex}, ${d.second})`;
				else if (d.kind === "tangent")
					expression = `tangent(${d.point}, ${d.circle}, branch=${d.branch})`;
				else if (d.kind === "arc" || d.kind === "sector")
					expression = `${d.kind}(${d.circle}, start=${n((d.start * 180) / Math.PI)}deg, end=${n((d.end * 180) / Math.PI)}deg, direction=${d.clockwise ? "cw" : "ccw"}${d.relativeTo ? `, relative-to=${d.relativeTo}` : ""})`;
				else throw new Error("Unsupported construction.");
				return expression;
			};
			return `${type} ${id} = ${expressionOf(d)}${stroke && stroke !== "solid" ? ` style=${stroke}` : ""}${color ? ` color=${color}` : ""}${hidden ? " hidden" : ""}`;
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
