import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	puzzleContour,
	puzzleDestination,
	puzzleEdges,
	puzzleLayout,
	puzzlePath,
	puzzleTarget,
} from "./geometry.js";
import { TpPuzzle } from "./puzzle.js";

const images: FakeImage[] = [];
class FakeImage {
	naturalWidth = 600;
	naturalHeight = 400;
	src = "";
	onload: (() => void) | null = null;
	onerror: (() => void) | null = null;
	constructor() {
		images.push(this);
	}
}
beforeEach(() => {
	images.length = 0;
	vi.stubGlobal("Image", FakeImage);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});
function load(pieces = 12) {
	const game = new TpPuzzle();
	game.src = "image.svg";
	game.pieces = pieces;
	document.body.append(game);
	images.at(-1)?.onload?.();
	return game;
}
describe("image puzzle geometry", () => {
	it("uses exact factor grids, including prime counts", () => {
		expect(puzzleLayout(12, 1.5)).toMatchObject({ rows: 3, columns: 4 });
		const prime = puzzleLayout(13, 2);
		expect(prime.rows * prime.columns).toBe(13);
		expect(puzzleLayout(12, 0.66)).toMatchObject({ rows: 4, columns: 3 });
	});
	it.each([0, 1.5, 145, NaN])("rejects invalid piece count %s", (count) =>
		expect(() => puzzleLayout(count, 1)).toThrow(),
	);
	it("makes internal edges complementary and the outer boundary flat", () => {
		for (let id = 0; id < 12; id++) {
			const edges = puzzleEdges(id, 4, 3);
			if (id % 4 < 3)
				expect(edges[1]).toBe(-Number(puzzleEdges(id + 1, 4, 3)[3]));
			else expect(edges[1]).toBe(0);
			if (id < 8) expect(edges[2]).toBe(-Number(puzzleEdges(id + 4, 4, 3)[0]));
			else expect(edges[2]).toBe(0);
			if (id < 4) expect(edges[0]).toBe(0);
			if (id % 4 === 0) expect(edges[3]).toBe(0);
		}
		const grid = puzzleLayout(12, 1.5);
		expect(puzzlePath(0, grid, "square")).not.toContain("C");
		expect(puzzlePath(0, grid, "puzzle")).toContain("C");
	});
	it("snaps only correctly oriented pieces near their own target and rejects non-right angles", () => {
		const grid = puzzleLayout(12, 1.5),
			target = puzzleTarget(0, grid);
		expect(
			puzzleDestination({ ...target, x: target.x + 0.1, angle: 360 }, grid),
		).toEqual(target);
		expect(
			puzzleDestination({ ...target, x: target.x + 0.1, angle: 90 }, grid)?.x,
		).not.toBe(target.x);
		expect(puzzleDestination({ ...target, angle: 45 }, grid)).toBeNull();
		expect(puzzleDestination({ ...target, x: NaN }, grid)).toBeNull();
	});
});
describe("tp-puzzle", () => {
	it("captures image children when an already connected element is upgraded", () => {
		document.body.innerHTML =
			'<tp-puzzle-upgrade-test shape="square"><img src="upgrade.jpg" alt="A landscape"></tp-puzzle-upgrade-test>';
		customElements.define("tp-puzzle-upgrade-test", class extends TpPuzzle {});
		images.at(-1)?.onload?.();
		const game = document.querySelector("tp-puzzle-upgrade-test") as TpPuzzle;
		expect(game.src).toBe("upgrade.jpg");
		expect(game.placements).toHaveLength(16);
		expect(game.alt).toBe("A landscape");
	});
	it("allows keyboard users to move away from a snapped position", () => {
		const game = load(),
			target = puzzleTarget(0, puzzleLayout(12, 1.5));
		game.place(0, target.x, target.y, 0);
		const piece = game.querySelector('[data-piece="0"]');
		for (let i = 0; i < 2; i++)
			piece?.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "ArrowRight",
					bubbles: true,
					cancelable: true,
				}),
			);
		expect(game.placements[0]?.x).toBeCloseTo(target.x + 0.1);
		piece?.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowLeft",
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(game.placements[0]?.x).toBe(target.x);
	});
	it("loads an image and creates clipped, accessible pieces with unique per-instance IDs", () => {
		const game = load();
		expect(game.querySelectorAll("[data-piece]")).toHaveLength(12);
		expect(game.querySelectorAll("clipPath")).toHaveLength(13);
		expect(game.querySelectorAll("[data-piece] image")).toHaveLength(12);
		expect(game.hasAttribute("aria-busy")).toBe(false);
		const other = load();
		expect(game.querySelector("clipPath")?.id).not.toBe(
			other.querySelector("clipPath")?.id,
		);
		expect(game.querySelector("[data-piece]")?.getAttribute("role")).toBe(
			"button",
		);
	});
	it("captures an img source and alternative text, supports square pieces and attribute reloads", () => {
		const game = new TpPuzzle();
		game.innerHTML = '<img src="fallback.png" alt="A mountain">';
		game.shape = "square";
		game.exactOrientation = true;
		document.body.append(game);
		images.at(-1)?.onload?.();
		expect(game.placements.every((p) => p.angle === 0)).toBe(true);
		expect(game.querySelector("svg")?.getAttribute("aria-label")).toContain(
			"A mountain",
		);
		expect(
			game.querySelector(".tp-puzzle-outline")?.getAttribute("d"),
		).not.toContain("C");
		game.src = "new.webp";
		expect(images.at(-1)?.src).toContain("new.webp");
		images.at(-1)?.onload?.();
		expect(game.placements).toHaveLength(16);
		game.pieces = 6;
		images.at(-1)?.onload?.();
		expect(game.placements).toHaveLength(6);
	});
	it("handles loading errors and stale requests without allowing a previous source to win", () => {
		const game = new TpPuzzle();
		game.src = "first.png";
		document.body.append(game);
		const stale = images.at(-1)?.onload;
		game.src = "second.jpg";
		stale?.();
		expect(game.querySelector("svg")).toBeNull();
		images.at(-1)?.onerror?.();
		expect(game.textContent).toContain("Unable to load");
		game.src = "third.svg";
		images.at(-1)?.onload?.();
		expect(game.querySelector("svg")).not.toBeNull();
	});
	it("reports invalid configuration and can recover", () => {
		const game = new TpPuzzle();
		game.pieces = 0;
		document.body.append(game);
		expect(game.querySelector("[role=alert]")?.textContent).toContain("pieces");
		game.pieces = 12;
		game.src = "image.svg";
		game.setAttribute("shape", "circle");
		expect(game.textContent).toContain("shape");
		game.shape = "puzzle";
		images.at(-1)?.onload?.();
		expect(game.placements).toHaveLength(12);
	});
	it("supports placement, undo, redo, safe copies, completion and reference preview", () => {
		const game = load();
		const initial = game.placements;
		const changed = vi.fn(),
			complete = vi.fn();
		game.addEventListener("tp-puzzle-change", changed);
		game.addEventListener("tp-puzzle-complete", complete);
		const layout = puzzleLayout(12, 1.5);
		for (let id = 0; id < 12; id++) {
			const p = puzzleTarget(id, layout);
			expect(game.place(id, p.x, p.y, 0)).toBe(true);
		}
		expect(game.isSolved).toBe(true);
		expect(complete).toHaveBeenCalledTimes(1);
		expect(changed).toHaveBeenCalledTimes(12);
		game.undo();
		expect(game.isSolved).toBe(false);
		game.redo();
		expect(game.isSolved).toBe(true);
		expect(complete).toHaveBeenCalledTimes(2);
		const copy = game.placements;
		if (copy[0]) copy[0].x = 100;
		expect(game.placements[0]?.x).not.toBe(100);
		game.showImage();
		expect(game.querySelector("svg > image")?.getAttribute("opacity")).toBe(
			"0.6",
		);
		expect(game.isSolved).toBe(true);
		game.reset();
		expect(game.canUndo).toBe(false);
		expect(game.isSolved).toBe(false);
		expect(game.placements).toHaveLength(initial.length);
	});
	it("opens the context menu and rotates the selected piece in both directions", () => {
		const game = load();
		const piece = game.querySelector<SVGElement>('[data-piece="0"]');
		const angle = game.placements[0]?.angle ?? 0;
		piece?.dispatchEvent(
			new MouseEvent("contextmenu", {
				bubbles: true,
				cancelable: true,
				clientX: 50,
				clientY: 60,
			}),
		);
		expect(game.querySelector("tp-dropdown")?.hasAttribute("open")).toBe(true);
		game.querySelector<HTMLElement>('[data-angle="90"]')?.click();
		expect(game.placements[0]?.angle).toBe((angle + 90) % 360);
		expect(game.querySelector("tp-dropdown")?.hasAttribute("open")).toBe(false);
		piece?.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "R",
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(game.placements[0]?.angle).toBe(angle);
	});
	it("keeps edits across reconnection and rejects invalid placements", () => {
		const game = load();
		const before = game.placements;
		game.remove();
		document.body.append(game);
		expect(game.placements).toEqual(before);
		expect(game.place(99, 1, 1, 0)).toBe(false);
		expect(game.place(0, 1, 1, 45)).toBe(false);
		expect(game.canUndo).toBe(false);
	});
});

describe("regular polygon pieces", () => {
	it.each(["triangle", "hexagon"] as const)(
		"tiles a whole-piece %s board with exact counts and matching edges",
		(shape) => {
			for (const count of [1, 2, 13, 24, 144]) {
				const layout = puzzleLayout(count, 1.5, shape);
				expect(layout.cells).toHaveLength(count);
				const edges = new Map<string, number>();
				for (const cell of layout.cells) {
					const lengths = cell.vertices.map((v, i) => {
						const next = cell.vertices[(i + 1) % cell.vertices.length];
						return Math.hypot(
							(v[0] ?? 0) - (next?.[0] ?? 0),
							(v[1] ?? 0) - (next?.[1] ?? 0),
						);
					});
					for (const length of lengths)
						expect(length).toBeCloseTo(lengths[0] ?? 0, 10);
					for (let i = 0; i < cell.vertices.length; i++) {
						const a = cell.vertices[i],
							b = cell.vertices[(i + 1) % cell.vertices.length];
						const key = [a, b]
							.map((v) =>
								v
									?.map((n) => (Math.abs(n) < 1e-6 ? 0 : n).toFixed(6))
									.join(","),
							)
							.sort()
							.join("/");
						edges.set(key, (edges.get(key) ?? 0) + 1);
					}
				}
				const boundary = [...edges.values()].filter((n) => n === 1).length;
				expect(puzzleContour(layout).match(/L/g)).toHaveLength(boundary);
				expect([...edges.values()].every((n) => n <= 2)).toBe(true);
				const target = puzzleTarget(count - 1, layout);
				expect(puzzleDestination({ ...target, angle: 60 }, layout)?.angle).toBe(
					60,
				);
				expect(puzzleDestination({ ...target, angle: 90 }, layout)).toBeNull();
				expect(puzzleDestination({ ...target, id: count }, layout)).toBeNull();
			}
		},
	);
	it.each(["triangle", "hexagon"] as const)(
		"adapts %s controls, keyboard, image clipping and completion",
		(shape) => {
			const game = load(13);
			game.shape = shape;
			images.at(-1)?.onload?.();
			expect(game.querySelectorAll("[data-piece]")).toHaveLength(13);
			expect(game.querySelector('[data-action="right"]')?.textContent).toBe(
				"Rotate +60°",
			);
			expect(game.querySelector('[data-angle="60"]')).not.toBeNull();
			const piece = game.querySelector('[data-piece="0"]');
			game.place(0, 2, 5, 0);
			piece?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "r", bubbles: true }),
			);
			expect(game.placements[0]?.angle).toBe(60);
			game.undo();
			expect(game.placements[0]?.angle).toBe(0);
			expect(game.querySelector(".tp-puzzle-target")?.tagName).toBe("path");
			const layout = puzzleLayout(13, 1.5, shape);
			for (let id = 0; id < 13; id++) {
				const t = puzzleTarget(id, layout);
				game.place(id, t.x, t.y, 0);
			}
			expect(game.isSolved).toBe(true);
		},
	);
});

it("keeps triangle boards edge-connected, including narrow images and single-piece final rows", () => {
	for (const count of [2, 3, 7, 13, 31, 144])
		for (const aspect of [0.1, 1.5, 5]) {
			const layout = puzzleLayout(count, aspect, "triangle");
			const connected = new Set([0]);
			const shared = (a: number, b: number) => {
				const left = layout.cells[a]?.vertices ?? [],
					right = layout.cells[b]?.vertices ?? [];
				return (
					left.filter((v) =>
						right.some(
							(w) =>
								Math.hypot(
									(v[0] ?? 0) - (w[0] ?? 0),
									(v[1] ?? 0) - (w[1] ?? 0),
								) < 1e-8,
						),
					).length >= 2
				);
			};
			let changed = true;
			while (changed) {
				changed = false;
				for (let id = 0; id < count; id++)
					if (
						!connected.has(id) &&
						[...connected].some((other) => shared(id, other))
					) {
						connected.add(id);
						changed = true;
					}
			}
			expect(connected.size).toBe(count);
		}
});
