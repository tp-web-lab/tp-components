import { expect, it } from "vitest";
import {
	evaluateGeometry,
	geometrySourceLabel,
	parseGeometry,
	serializeGeometry,
	withGeometryLabel,
} from "./geometry.js";

it.each([
	"90deg",
	"100grad",
	"0.25turn",
	`${Math.PI / 2}rad`,
	`${Math.PI / 2}`,
])(
	"interprets %s consistently for points, arcs, sectors and rotations",
	(angle) => {
		const source = `point O = (0, 0)
point A = (2, 0)
circle c = circle(O, 2)
point P = on(c, angle=${angle})
arc a = arc(c, start=0, end=${angle})
sector s = sector(c, start=0rad, end=${angle})
point R = rotation(A, O, angle=${angle})`;
		const objects = parseGeometry(source);
		const result = evaluateGeometry(objects);
		expect(result.errors.size).toBe(0);
		for (const id of ["P", "R"]) {
			const p = result.values.get(id);
			if (p?.kind !== "point") throw Error("Missing point");
			expect(p.point.x).toBeCloseTo(0);
			expect(p.point.y).toBeCloseTo(2);
		}
		for (const id of ["a", "s"]) {
			const d = objects.find((o) => o.id === id)?.definition;
			if (d?.kind !== "arc" && d?.kind !== "sector")
				throw Error("Missing angle");
			expect(d.end).toBeCloseTo(Math.PI / 2);
		}
		expect(serializeGeometry(objects)).toContain("90deg");
		expect(evaluateGeometry(parseGeometry(serializeGeometry(objects)))).toEqual(
			result,
		);
	},
);
it("ignores source comments but preserves markers in quoted figure annotations and error line numbers", () => {
	const source = `<!-- introductory
 notes -->
point A = (0, 0) <!-- inline --> # remaining comment
comment note = comment(A, "<!-- literal --> # text")`;
	expect(parseGeometry(source)).toHaveLength(2);
	expect(serializeGeometry(parseGeometry(source))).toContain(
		"<!-- literal --> # text",
	);
	expect(() => parseGeometry(`${source}\ninvalid`)).toThrow("Line 5");
	expect(() => parseGeometry("point A = (0, 0)\n<!-- unfinished")).toThrow(
		"Line 2: Unclosed source comment",
	);
});
it.each(["90foo", "Infinityrad", "pi/2", "1e309turn"])(
	"rejects invalid angle %s",
	(angle) => {
		expect(() =>
			parseGeometry(
				`point O = (0, 0)\ncircle c = circle(O, 2)\npoint P = on(c, angle=${angle})`,
			),
		).toThrow();
	},
);

it("accepts one quoted label or title as metadata without creating a geometric object", () => {
	expect(parseGeometry('label = "My figure"\npoint A = (0, 0)')).toHaveLength(
		1,
	);
	expect(parseGeometry('title = "My figure"\npoint A = (0, 0)')).toHaveLength(
		1,
	);
	expect(() => parseGeometry("label = 12")).toThrow("Use label");
	expect(() => parseGeometry('label = ""\ntitle = "Other"')).toThrow(
		"Duplicate figure label",
	);
});

it("updates labels while preserving surrounding multiline and inline comments", () => {
	const source = '<!-- note\n end --> title = "Old" # keep\npoint A = (0, 0)';
	const updated = withGeometryLabel(source, 'New "title"');
	expect(updated).toContain("<!-- note\n end -->");
	expect(updated).toContain("# keep");
	expect(geometrySourceLabel(updated)).toBe('New "title"');
	expect(parseGeometry(updated)).toHaveLength(1);
});
