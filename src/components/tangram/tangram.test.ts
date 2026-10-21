import { afterEach, describe, expect, it, vi } from "vitest";
import {
	area,
	at,
	intersection,
	overlaps,
	PIECES,
	parseSolution,
	polygon,
	SQUARE,
	SQUARE_SOURCE,
	solved,
	validate,
} from "./geometry.js";
import { TpTangram } from "./tangram.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});
async function game(): Promise<TpTangram> {
	const el = new TpTangram();
	document.body.append(el);
	await new Promise((resolve) => setTimeout(resolve, 0));
	return el;
}
const areaSigned = (points: { x: number; y: number }[]): number =>
	points.reduce((sum, p, i) => {
		const q = at(points, (i + 1) % points.length);
		return sum + p.x * q.y - p.y * q.x;
	}, 0);
describe("tangram geometry", () => {
	it("reads a square from named corners and midpoints without placement angles", () => {
		const result = parseSolution(SQUARE_SOURCE);
		validate(result);
		expect(
			solved(
				result,
				SQUARE.map((p) => ({ ...p, x: p.x + 2, y: p.y + 2 })),
			),
		).toBe(true);
	});
	it("recognizes pieces from literal boundary vertices in either winding", () => {
		const source = SQUARE.map(
			(p) =>
				`${p.id.includes("large") || p.id.includes("small") || p.id === "medium" ? "triangle" : p.id} ${polygon(
					p,
				)
					.reverse()
					.map((v) => `(${v.x}, ${v.y})`)
					.join(" ")}`,
		).join("\n");
		expect(solved(parseSolution(source), SQUARE)).toBe(true);
	});
	it("infers orientations for rotated and reflected figures", () => {
		for (const angle of [0, 37, 90, 180])
			for (const reflected of [false, true]) {
				const transformed = SQUARE.map((p) =>
					polygon(p).map((v) => {
						const x = reflected ? -v.x : v.x,
							a = (angle * Math.PI) / 180;
						return {
							x: x * Math.cos(a) - v.y * Math.sin(a) + 5,
							y: x * Math.sin(a) + v.y * Math.cos(a) - 3,
						};
					}),
				);
				const source = transformed
					.map(
						(points, i) =>
							`${i < 5 ? "triangle" : i === 5 ? "square" : "parallelogram"} ${points.map((p) => `(${p.x}, ${p.y})`).join(" ")}`,
					)
					.join("\n");
				const result = parseSolution(source);
				validate(result);
				expect(
					result.reduce((sum, p) => sum + area(polygon(p)), 0),
				).toBeCloseTo(16);
				for (const shape of transformed)
					expect(
						result.some(
							(p) =>
								area(
									intersection(
										polygon(p),
										areaSigned(shape) < 0 ? [...shape].reverse() : shape,
									),
								) >
								area(shape) - 1e-7,
						),
					).toBe(true);
			}
	});
	it("reports line numbers for semantic source errors", () => {
		for (const [source, message] of [
			["point A = midpoint(B, C)", "Unknown point"],
			["point A = (0,0)\npoint A = (1,1)", "already defined"],
			["triangle (0,0) (1,0) (0,1)", "required size"],
			["square (0,0) (2,0) (2,1) (0,1)", "required size"],
			["triangle (0,0) (4,0) (2,2)\ntriangle (0,0) (4,0) (2,2)", "overlaps"],
			[
				"triangle (0,0) (2,0) (1,1)\ntriangle (3,0) (5,0) (4,1)\ntriangle (6,0) (8,0) (7,1)",
				"No unused",
			],
		] as const)
			expect(() => parseSolution(source)).toThrow(
				new RegExp(`Line [0-9]+:.*${message}`),
			);
	});

	it("has exact areas and a square solution without overlaps", () => {
		expect(SQUARE.map((p) => area(polygon(p)))).toEqual([4, 4, 2, 1, 1, 2, 2]);
		expect(() => validate(SQUARE)).not.toThrow();
		expect(solved(SQUARE, SQUARE)).toBe(true);
	});
	it("preserves area through rotations and reflection", () => {
		for (const p of SQUARE)
			for (const angle of [45, 90, 135, 271])
				for (const flipped of [false, true])
					expect(area(polygon({ ...p, angle, flipped }))).toBeCloseTo(
						area(polygon(p)),
						9,
					);
	});
	it("allows contact and rejects positive-area intersections", () => {
		expect(overlaps(at(SQUARE, 0), at(SQUARE, 1))).toBe(false);
		expect(overlaps(at(SQUARE, 0), { ...at(SQUARE, 1), x: 0.01 })).toBe(true);
		expect(overlaps(at(SQUARE, 6), at(SQUARE, 6))).toBe(true);
	});
	it("accepts JSON and text and rejects invalid or overlapping solutions", () => {
		expect(parseSolution(JSON.stringify(SQUARE))).toEqual(SQUARE);
		expect(
			parseSolution(SQUARE.map((p) => `${p.id} ${p.x} ${p.y} 0`).join("\n")),
		).toEqual(SQUARE);
		for (const input of [
			"[]",
			"null",
			JSON.stringify(SQUARE.map((p) => ({ ...p, x: 0, y: 0 }))),
			JSON.stringify(SQUARE.map((p) => ({ ...p, angle: "bad" }))),
		])
			expect(() => parseSolution(input)).toThrow();
	});
	it("recognizes interchangeable small triangles", () => {
		const swapped = SQUARE.map((p) => ({ ...p }));
		const a = at(swapped, 3),
			b = at(swapped, 4);
		swapped[3] = { ...a, x: b.x, y: b.y, angle: 90 };
		swapped[4] = { ...b, x: a.x, y: a.y, angle: -90 };
		expect(solved(swapped, SQUARE)).toBe(true);
	});
	it("contains a parallelogram with unequal adjacent sides and nonright angles", () => {
		const points = at(PIECES, 6).points;
		const a = at(points, 0),
			b = at(points, 1),
			c = at(points, 2);
		expect(Math.hypot(b.x - a.x, b.y - a.y)).not.toBeCloseTo(
			Math.hypot(c.x - b.x, c.y - b.y),
		);
		expect(
			(b.x - a.x) * (c.x - b.x) + (b.y - a.y) * (c.y - b.y),
		).not.toBeCloseTo(0);
	});
});
describe("tangram component", () => {
	it("starts all seven pieces with the solution rotation and reflection when exact-orientation is present", async () => {
		const el = await game();
		el.exactOrientation = true;
		const target = SQUARE.map((p) => ({
			...p,
			x: -p.y,
			y: -p.x,
			angle: 90,
			flipped: true,
		}));
		el.setSolution(target);
		expect(el.placements.every((p) => p.angle === 90 && p.flipped)).toBe(true);
		expect(() => validate(el.placements)).not.toThrow();
		expect(el.querySelector(".tp-tangram-orientation")?.textContent).toContain(
			"Exact orientation",
		);
		const piece = at(el.placements, 0);
		expect(el.place(piece.id, piece.x, piece.y, 135)).toBe(true);
		el.undo();
		expect(at(el.placements, 0).angle).toBe(90);
		el.removeAttribute("exact-orientation");
		expect(el.placements.every((p) => p.angle === 0 && !p.flipped)).toBe(true);
		expect(el.canUndo).toBe(false);
		expect(el.querySelector(".tp-tangram-orientation")).toBeNull();
	});
	it("offers local icon controls for the selected piece and records rotations and flips", async () => {
		const el = await game();
		const local = () =>
			el.querySelector<HTMLElement>(".tp-tangram-selection-tools");
		expect(local()?.hidden).toBe(true);
		el.querySelector<SVGElement>('[data-piece="parallelogram"]')?.focus();
		expect(local()?.hidden).toBe(false);
		expect(
			local()?.querySelector('[data-action="flip"]')?.hasAttribute("disabled"),
		).toBe(false);
		local()
			?.querySelector('[data-action="right"]')
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(el.placements.find((p) => p.id === "parallelogram")?.angle).toBe(45);
		local()
			?.querySelector('[data-action="flip"]')
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(el.placements.find((p) => p.id === "parallelogram")?.flipped).toBe(
			true,
		);
		el.undo();
		expect(el.placements.find((p) => p.id === "parallelogram")?.flipped).toBe(
			false,
		);
		el.querySelector<SVGElement>('[data-piece="small-1"]')?.focus();
		expect(
			local()?.querySelector('[data-action="flip"]')?.hasAttribute("disabled"),
		).toBe(true);
		expect(el.querySelectorAll("tp-button-group tp-icon-button")).toHaveLength(
			8,
		);
	});

	it("uses the playing piece colors for solutions declared in a different order", async () => {
		const el = await game();
		const target = [...SQUARE].reverse();
		el.setSolution(target);
		el.showSolution();
		const polygons = Array.from(
			el.querySelectorAll(".tp-tangram-target polygon"),
		);
		for (const [i, p] of target.entries())
			expect(at(polygons, i).getAttribute("fill")).toBe(
				el.querySelector(`[data-piece="${p.id}"]`)?.getAttribute("fill"),
			);
	});

	it("starts with seven separate pieces surrounding an unsolved silhouette", async () => {
		const el = await game();
		expect(el.querySelectorAll("[data-piece]")).toHaveLength(7);
		expect(() => validate(el.placements)).not.toThrow();
		expect(el.isSolved).toBe(false);
	});
	it("accepts incorrect positions and orientations, inside and outside the silhouette", async () => {
		const el = await game();
		for (const [x, y, angle] of [
			[0.2, -0.3, 23],
			[3, -2, 17],
		] as const) {
			expect(el.place("small-1", x, y, angle)).toBe(true);
			expect(el.placements.find((p) => p.id === "small-1")).toMatchObject({
				x,
				y,
				angle,
			});
			expect(el.isSolved).toBe(false);
		}
	});
	it("keeps a free placement beyond the original frame visible and undoable", async () => {
		const el = await game();
		const initial = el.placements;
		expect(el.place("large-1", 9, 0, 13)).toBe(true);
		const box = (el.querySelector("svg")?.getAttribute("viewBox") ?? "")
			.split(" ")
			.map(Number);
		for (const point of polygon(at(el.placements, 0))) {
			expect(Math.abs(point.x)).toBeLessThan(at(box, 2) / 2);
			expect(Math.abs(point.y)).toBeLessThan(at(box, 3) / 2);
		}
		el.undo();
		expect(el.placements).toEqual(initial);
		el.redo();
		expect(at(el.placements, 0)).toMatchObject({ x: 9, y: 0, angle: 13 });
	});

	it("keeps the view scale stable when a piece is moved back towards the target", async () => {
		const el = await game();
		el.place("large-1", 12, 0);
		const view = el.querySelector(".tp-tangram-board")?.getAttribute("viewBox");
		el.place("large-1", 0, -4 / 3);
		expect(el.querySelector(".tp-tangram-board")?.getAttribute("viewBox")).toBe(
			view,
		);
	});
	it("drags a correctly placed piece freely without scrolling the documentation", async () => {
		const el = await game();
		for (const p of SQUARE)
			expect(el.place(p.id, p.x, p.y, p.angle, p.flipped)).toBe(true);
		expect(el.isSolved).toBe(true);
		const piece = el.querySelector<SVGElement>('[data-piece="large-1"]');
		const svg = el.querySelector<SVGSVGElement>(".tp-tangram-board");
		if (!piece || !svg) throw new Error("Missing board");
		const focus = vi.spyOn(piece, "focus");
		Object.defineProperties(svg, {
			getScreenCTM: { value: () => ({ inverse: () => ({}) }) },
			setPointerCapture: { value: vi.fn() },
			hasPointerCapture: { value: () => false },
		});
		vi.stubGlobal(
			"DOMPoint",
			class {
				constructor(
					public x: number,
					public y: number,
				) {}
				matrixTransform() {
					return { x: this.x, y: this.y };
				}
			},
		);
		const pointer = (type: string, x: number, y: number): MouseEvent => {
			const event = new MouseEvent(type, {
				clientX: x,
				clientY: y,
				button: 0,
				bubbles: true,
				cancelable: true,
			});
			Object.defineProperty(event, "pointerId", { value: 1 });
			return event;
		};
		piece.dispatchEvent(pointer("pointerdown", 0, -1));
		svg.dispatchEvent(pointer("pointermove", 0, -5));
		svg.dispatchEvent(pointer("pointerup", 0, -5));
		expect(focus).toHaveBeenCalledWith({ preventScroll: true });
		expect(at(el.placements, 0).y).toBeCloseTo(-4 / 3 - 4);
		expect(el.isSolved).toBe(false);
		el.undo();
		expect(el.isSolved).toBe(true);
	});
	it("rejects a collision without changing state or undo history", async () => {
		const el = await game();
		const before = el.placements;
		const p = at(before, 0),
			q = at(before, 1);
		expect(el.place(p.id, q.x, q.y)).toBe(false);
		expect(el.placements).toEqual(before);
		expect(el.canUndo).toBe(false);
	});
	it("supports undo, redo and clears a redo branch after a new move", async () => {
		const el = await game();
		const p = at(el.placements, 0);
		expect(el.place(p.id, p.x, p.y + 0.2)).toBe(true);
		el.undo();
		expect(at(el.placements, 0)).toEqual(p);
		el.redo();
		expect(at(el.placements, 0).y).toBeCloseTo(p.y + 0.2);
		el.undo();
		el.place(p.id, p.x, p.y - 0.2);
		expect(el.canRedo).toBe(false);
	});
	it("shows the solution without moving pieces or changing history", async () => {
		const el = await game(),
			before = el.placements;
		el.showSolution();
		expect(el.placements).toEqual(before);
		expect(el.canUndo).toBe(false);
		expect(
			el.querySelector(".tp-tangram-target polygon")?.getAttribute("stroke"),
		).toBe("#fff");
	});
	it("loads all pieces at their solution locations and reports completion", async () => {
		const el = await game();
		const listener = vi.fn();
		el.addEventListener("tp-tangram-change", listener);
		for (const p of SQUARE)
			expect(el.place(p.id, p.x, p.y, p.angle, p.flipped)).toBe(true);
		expect(el.isSolved).toBe(true);
		expect(listener.mock.calls.at(-1)?.[0].detail.solved).toBe(true);
		el.undo();
		expect(el.isSolved).toBe(false);
	});
	it("supports focused keyboard rotation and translation", async () => {
		const el = await game();
		el.querySelector('[data-piece="large-1"]')?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "r", bubbles: true }),
		);
		expect(at(el.placements, 0).angle).toBe(45);
		el.querySelector('[data-piece="large-1"]')?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
		expect(at(el.placements, 0).y).toBeCloseTo(0.05);
	});
	it("reads inline script and keeps a valid game on loading errors", async () => {
		const el = new TpTangram();
		el.innerHTML = `<script type="tp/tangram">${JSON.stringify(SQUARE)}</script>`;
		document.body.append(el);
		await new Promise((r) => setTimeout(r, 0));
		expect(el.placements).toHaveLength(7);
		const before = el.placements;
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404 }),
		);
		el.src = "missing.txt";
		await new Promise((r) => setTimeout(r, 0));
		expect(el.placements).toEqual(before);
		expect(el.querySelector('[role="status"]')?.textContent).toContain("404");
	});
	it("ignores stale source responses", async () => {
		const el = await game();
		let finish: (r: unknown) => void = () => {};
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockReturnValueOnce(
					new Promise((r) => {
						finish = r;
					}),
				)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => JSON.stringify(SQUARE),
				}),
		);
		el.src = "one.txt";
		el.src = "two.txt";
		await new Promise((r) => setTimeout(r, 0));
		el.place("large-1", 0, 0);
		const before = el.placements;
		finish({ ok: true, text: async () => JSON.stringify(SQUARE) });
		await new Promise((r) => setTimeout(r, 0));
		expect(el.placements).toEqual(before);
	});
});

describe("tangram assistance", () => {
	it("highlights incorrect pieces but accepts alternative placements inside the silhouette", async () => {
		const el = await game();
		const source = at(SQUARE, 0);
		// Rotating the square by 180 degrees gives another valid dissection.
		el.place(
			source.id,
			-source.x,
			-source.y,
			source.angle + 180,
			source.flipped,
		);
		el.showIncorrectPieces();
		expect(el.querySelectorAll("[data-incorrect]")).toHaveLength(6);
		expect(
			el
				.querySelector(`[data-piece="${source.id}"]`)
				?.hasAttribute("data-incorrect"),
		).toBe(false);
		el.showIncorrectPieces(false);
		expect(el.querySelectorAll("[data-incorrect]")).toHaveLength(0);
	});
	it("clears incorrect pieces without overlaps, preserves correct pieces, and supports undo/redo", async () => {
		const el = await game();
		const correct = at(SQUARE, 0);
		el.place(correct.id, correct.x, correct.y, correct.angle, correct.flipped);
		const wrong = at(el.placements, 1);
		el.place(wrong.id, 15, 15, 45);
		const before = el.placements;
		el.clearIncorrectPieces();
		validate(el.placements);
		expect(el.placements.find((p) => p.id === correct.id)).toEqual(correct);
		expect(el.placements.find((p) => p.id === wrong.id)?.angle).toBe(45);
		const after = el.placements;
		expect(after).not.toEqual(before);
		el.undo();
		expect(el.placements).toEqual(before);
		el.redo();
		expect(el.placements).toEqual(after);
	});
	it("reveals the selected piece and full solution without changing placements", async () => {
		const el = await game();
		const before = el.placements;
		const menuItem = () =>
			el.querySelector<HTMLElement>('[data-assist="piece"]');
		expect(menuItem()?.getAttribute("aria-disabled")).toBe("true");
		el.querySelector<SVGElement>('[data-piece="square"]')?.dispatchEvent(
			new FocusEvent("focusin", { bubbles: true }),
		);
		expect(menuItem()?.getAttribute("aria-disabled")).toBe("false");
		menuItem()?.click();
		expect(
			el.querySelectorAll('.tp-tangram-target polygon[stroke="#fff"]'),
		).toHaveLength(1);
		expect(el.placements).toEqual(before);
		el.querySelector<HTMLElement>('[data-assist="solution"]')?.click();
		expect(
			el.querySelectorAll('.tp-tangram-target polygon[stroke="#fff"]'),
		).toHaveLength(7);
		expect(el.placements).toEqual(before);
		el.showSolution(false);
		expect(
			el.querySelectorAll('.tp-tangram-target polygon[stroke="#fff"]'),
		).toHaveLength(0);
	});
});

describe("complete tangram inventory", () => {
	it("rejects an empty or incomplete arrangement even inside the silhouette", () => {
		expect(solved([], SQUARE)).toBe(false);
		expect(solved(SQUARE.slice(0, 6), SQUARE)).toBe(false);
	});
	it("rejects repeated pieces and overlapping arrangements", () => {
		expect(solved([...SQUARE.slice(0, 6), at(SQUARE, 0)], SQUARE)).toBe(false);
		const duplicate = SQUARE.map((p) => ({ ...p }));
		duplicate[4] = {
			...at(duplicate, 4),
			x: at(duplicate, 3).x,
			y: at(duplicate, 3).y,
			angle: -90,
		};
		expect(solved(duplicate, SQUARE)).toBe(false);
	});
	it("never counts a revealed solution as played pieces", async () => {
		const el = await game();
		el.showSolution();
		expect(el.isSolved).toBe(false);
		expect(el.querySelectorAll("[data-piece]")).toHaveLength(7);
		for (const p of SQUARE.slice(0, 6))
			el.place(p.id, p.x, p.y, p.angle, p.flipped);
		expect(el.isSolved).toBe(false);
		const last = at(SQUARE, 6);
		el.place(last.id, last.x, last.y, last.angle, last.flipped);
		expect(el.isSolved).toBe(true);
	});
});

it("isolates the solution preview from a partially filled board and restores the game", async () => {
	const el = await game();
	const source = at(SQUARE, 0);
	el.place(source.id, -source.x, -source.y, 180);
	const before = el.placements;
	el.showSolution();
	expect(
		el.querySelector(".tp-tangram-playing-pieces")?.getAttribute("display"),
	).toBe("none");
	expect(el.querySelectorAll(".tp-tangram-target polygon")).toHaveLength(7);
	expect(el.querySelectorAll('[data-piece][tabindex="0"]')).toHaveLength(0);
	expect(el.placements).toEqual(before);
	el.showSolution(false);
	expect(
		el.querySelector(".tp-tangram-playing-pieces")?.hasAttribute("display"),
	).toBe(false);
	expect(el.placements).toEqual(before);
	expect(el.querySelectorAll('[data-piece][tabindex="0"]')).toHaveLength(7);
});

describe("show then clear assistance sequence", () => {
	it.each(["solution", "piece", "incorrect"])(
		"clears after showing %s without leaving reference pieces in play",
		async (action) => {
			const el = await game();
			const correct = at(SQUARE, 0);
			el.place(
				correct.id,
				correct.x,
				correct.y,
				correct.angle,
				correct.flipped,
			);
			el.place("square", 12, 12);
			const before = el.placements;
			el.querySelector<SVGElement>('[data-piece="square"]')?.dispatchEvent(
				new FocusEvent("focusin", { bubbles: true }),
			);
			el.querySelector<HTMLElement>(`[data-assist="${action}"]`)?.click();
			el.querySelector<HTMLElement>('[data-assist="clear"]')?.click();
			expect(
				el.querySelector(".tp-tangram-playing-pieces")?.hasAttribute("display"),
			).toBe(false);
			expect(
				el.querySelectorAll('.tp-tangram-target polygon[stroke="#fff"]'),
			).toHaveLength(0);
			expect(el.querySelectorAll('[data-piece][tabindex="0"]')).toHaveLength(7);
			expect(new Set(el.placements.map((p) => p.id)).size).toBe(7);
			validate(el.placements);
			expect(el.placements.find((p) => p.id === correct.id)).toEqual(correct);
			expect(el.isSolved).toBe(false);
			const after = el.placements;
			el.undo();
			expect(el.placements).toEqual(before);
			el.redo();
			expect(el.placements).toEqual(after);
		},
	);
	it("leaves the preview even when every piece is already correct", async () => {
		const el = await game();
		for (const p of SQUARE) el.place(p.id, p.x, p.y, p.angle, p.flipped);
		const before = el.placements;
		el.showSolution();
		el.clearIncorrectPieces();
		expect(el.isSolved).toBe(true);
		expect(el.placements).toEqual(before);
		expect(
			el.querySelector(".tp-tangram-playing-pieces")?.hasAttribute("display"),
		).toBe(false);
	});
});

it("dismisses local controls outside and with Escape while preserving the piece", async () => {
	const el = await game();
	const piece = el.querySelector<SVGElement>('[data-piece="parallelogram"]');
	const local = () =>
		el.querySelector<HTMLElement>(".tp-tangram-selection-tools");
	piece?.focus();
	const before = el.placements;
	document.body.click();
	expect(local()?.hidden).toBe(true);
	expect(piece?.hasAttribute("data-selected")).toBe(true);
	expect(el.placements).toEqual(before);
	piece?.blur();
	piece?.focus();
	expect(local()?.hidden).toBe(false);
	local()?.querySelector<HTMLElement>("button")?.focus();
	local()?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(local()?.hidden).toBe(true);
	expect(document.activeElement).toBe(piece);
	piece?.blur();
	piece?.focus();
	local()?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	expect(local()?.hidden).toBe(false);
	el.querySelector(".tp-tangram-board")?.dispatchEvent(
		new MouseEvent("click", { bubbles: true }),
	);
	expect(local()?.hidden).toBe(true);
});
