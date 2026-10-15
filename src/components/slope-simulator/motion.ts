/** Piecewise linear terrain; altitude uses the same scale as horizontal distance. */
export type Terrain = readonly (readonly [number, number])[];
export const profiles: readonly { name: string; points: Terrain }[] = [
	{
		name: "Rolling stage",
		points: [
			[0, 0],
			[0.2, 0.012],
			[0.38, 0.002],
			[0.58, 0.022],
			[0.78, 0.006],
			[1, 0.016],
		],
	},
	{
		name: "Mountain passes",
		points: [
			[0, 0],
			[0.12, 0.003],
			[0.36, 0.045],
			[0.52, 0.015],
			[0.74, 0.055],
			[0.9, 0.024],
			[1, 0.02],
		],
	},
	{
		name: "Summit finish",
		points: [
			[0, 0],
			[0.2, 0.004],
			[0.35, 0.016],
			[0.5, 0.008],
			[0.72, 0.045],
			[1, 0.095],
		],
	},
];
export function segmentAt(points: Terrain, x: number, direction = 1): number {
	for (let i = 0; i < points.length - 1; i++) {
		const end = points[i + 1];
		if (end && (x < end[0] || (direction < 0 && x === end[0]))) return i;
	}
	return points.length - 2;
}
export function sample(
	points: Terrain,
	x: number,
	direction = 1,
): { altitude: number; grade: number } {
	const i = segmentAt(points, x, direction);
	const a = points[i];
	const b = points[i + 1];
	if (!a || !b) return { altitude: 0, grade: 0 };
	const slope = (b[1] - a[1]) / (b[0] - a[0]);
	return { altitude: a[1] + (x - a[0]) * slope, grade: slope * 100 };
}
/** Spend relative input effort across segments, including when travelling backwards. */
export function advance(
	points: Terrain,
	position: number,
	effort: number,
): number {
	if (!Number.isFinite(effort)) return position;
	const direction = Math.sign(effort);
	let remaining = Math.abs(effort);
	let x = position;
	for (let n = 0; n < points.length && remaining > 0; n++) {
		const i = segmentAt(points, x, direction);
		const boundary = points[direction > 0 ? i + 1 : i];
		if (!boundary) break;
		const cost = Math.exp(
			(sample(points, x, direction).grade * direction * Math.log(4)) / 20,
		);
		const distance = Math.abs(boundary[0] - x);
		const step = Math.min(distance, remaining / cost);
		x += direction * step;
		remaining = Math.max(0, remaining - step * cost);
		if (step === distance) x = boundary[0];
		if (x <= 0 || x >= 1) break;
	}
	return Math.max(0, Math.min(1, x));
}
