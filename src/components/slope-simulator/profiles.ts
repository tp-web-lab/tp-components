import type { Terrain } from "./motion.js";

/** A cycling profile with [distance in kilometres, altitude in metres] points. */
export interface TpSlopeProfile {
	id: string;
	name: string;
	points: readonly (readonly [number, number])[];
}
/** Input shared by src, inline JSON and setProfiles(). */
export interface TpSlopeProfiles {
	profiles: readonly TpSlopeProfile[];
}
export interface NormalizedProfile {
	id: string;
	name: string;
	points: Terrain;
}

/** Validate the entire document before returning independent normalized profiles. */
export function parseProfiles(input: unknown): NormalizedProfile[] {
	const data: unknown = typeof input === "string" ? JSON.parse(input) : input;
	if (
		!data ||
		typeof data !== "object" ||
		!("profiles" in data) ||
		!Array.isArray(data.profiles) ||
		!data.profiles.length
	)
		throw new Error("Expected a nonempty profiles array.");
	const ids = new Set<string>();
	return data.profiles.map((item: unknown, index: number) => {
		if (
			!item ||
			typeof item !== "object" ||
			!("id" in item) ||
			typeof item.id !== "string" ||
			!item.id.trim() ||
			!("name" in item) ||
			typeof item.name !== "string" ||
			!item.name.trim() ||
			!("points" in item) ||
			!Array.isArray(item.points) ||
			item.points.length < 2
		)
			throw new Error(
				`Profile ${index + 1}: expected id, name and at least two points.`,
			);
		if (ids.has(item.id)) throw new Error(`Duplicate profile id: ${item.id}.`);
		ids.add(item.id);
		const points: [number, number][] = item.points.map(
			(point: unknown, i: number) => {
				if (
					!Array.isArray(point) ||
					point.length !== 2 ||
					!point.every((v) => typeof v === "number" && Number.isFinite(v))
				)
					throw new Error(
						`Profile "${item.id}", point ${i + 1}: expected two finite numbers.`,
					);
				return [point[0], point[1]];
			},
		);
		for (let i = 1; i < points.length; i++) {
			const a = points[i - 1];
			const b = points[i];
			if (!a || !b) continue;
			const distance = b[0] - a[0];
			if (!(distance > 0) || !Number.isFinite(distance))
				throw new Error(
					`Profile "${item.id}", segment ${i}: distances must increase strictly.`,
				);
			const grade = (b[1] - a[1]) / distance / 10;
			if (!Number.isFinite(grade) || Math.abs(grade) > 20 + 1e-10)
				throw new Error(
					`Profile "${item.id}", segment ${i}: slope ${grade.toFixed(6)}% exceeds ±20%.`,
				);
		}
		const first = points[0];
		const last = points[points.length - 1];
		if (!first || !last) throw new Error("Missing endpoints.");
		const span = last[0] - first[0];
		const minimum = points.reduce((min, p) => Math.min(min, p[1]), Infinity);
		if (
			!Number.isFinite(span) ||
			!Number.isFinite(span * 1000) ||
			span * 1000 === 0
		)
			throw new Error(`Profile "${item.id}": invalid distance span.`);
		return {
			id: item.id,
			name: item.name,
			points: points.map(([x, h]) => [
				(x - first[0]) / span,
				(h - minimum) / (span * 1000),
			]),
		};
	});
}
