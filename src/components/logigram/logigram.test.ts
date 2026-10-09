import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import { TpLogigram } from "./logigram.js";
import {
	LogigramModel,
	parseLogigram,
	readLogigramLists,
} from "./logigram-model.js";

const puzzle = {
	title: "Club",
	categories: [
		{ name: "People", items: ["Ada", "Ben"] },
		{ name: "Drinks", items: ["Tea", "Juice"] },
		{ name: "Books", items: ["Poetry", "Science"] },
	],
	clues: ["Ada drinks tea and reads Poetry."],
	solution: [
		["Ada", "Tea", "Poetry"],
		["Ben", "Juice", "Science"],
	],
};
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("requires one-to-one solutions and rejects malformed definitions", () => {
	expect(parseLogigram(JSON.stringify(puzzle))).toEqual(puzzle);
	for (const invalid of [
		{
			...puzzle,
			solution: [
				["Ada", "Tea", "Poetry"],
				["Ben", "Tea", "Science"],
			],
		},
		{ ...puzzle, categories: [] },
		{ ...puzzle, clues: [] },
		{ ...puzzle, solution: [] },
	])
		expect(() => parseLogigram(JSON.stringify(invalid))).toThrow();
});
it("tracks exclusions as one undoable move and discards redo after a new move", () => {
	const game = new LogigramModel(puzzle);
	game.set(0, 1, true);
	expect(game.value.slice(0, 4)).toEqual([1, -1, -1, 0]);
	game.undo();
	expect(game.value.every((v) => v === 0)).toBe(true);
	game.redo();
	expect(game.value[0]).toBe(1);
	game.undo();
	game.set(1, -1);
	expect(game.canRedo).toBe(false);
	game.reset();
	game.undo();
	expect(game.value[1]).toBe(-1);
});
it("checks all category pairs, including incorrect negative marks", () => {
	const game = new LogigramModel(puzzle);
	expect(game.check()).toMatchObject({ correct: 0, total: 6, complete: false });
	for (const index of [0, 3, 4, 7, 8, 11]) game.set(index, 1);
	expect(game.check()).toMatchObject({ correct: 6, complete: true });
	game.set(1, 1);
	expect(game.check().errors).toEqual([1]);
	game.set(1, 0);
	game.set(0, -1);
	expect(game.check()).toMatchObject({
		correct: 5,
		errors: [0],
		complete: false,
	});
});
it.each([
	["md", renderMarkdownToHtml],
	["adoc", renderAsciidocToHtml],
	["html", async (s: string) => s],
] as const)(
	"plays native %s examples, with keyboard, disabling, checks and reconnect",
	async (ext, render) => {
		const helpersPath = "../../../scripts/component-basic-examples.mjs";
		const { namedExamples, viewerSource } = await import(helpersPath);
		const file = readFileSync(
			`public/docs/components/logigram/examples/examples.${ext}`,
			"utf8",
		);
		const examples = namedExamples(ext, viewerSource(ext, file)) as {
			label: string;
			source: string;
		}[];
		for (const example of examples.filter((e) => e.label !== "Attributes")) {
			document.body.innerHTML = await render(example.source);
			const game = document.querySelector("tp-logigram");
			expect(game).toBeInstanceOf(TpLogigram);
			if (!game) throw new Error("Missing game");
			await vi.waitFor(() =>
				expect(
					game.querySelectorAll("button[data-cell]").length,
				).toBeGreaterThan(0),
			);
			expect(game.querySelector('[role="alert"]')).toBeNull();
			const first = game.querySelector<HTMLButtonElement>(
				'button[data-cell="0"]',
			);
			if (!first) throw new Error("Missing cell");
			first.click();
			expect(game.value[0]).toBe(-1);
			first.click();
			expect(game.value[0]).toBe(1);
			game.undo();
			expect(game.value[0]).toBe(-1);
			game.redo();
			expect(game.value[0]).toBe(1);
			first.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
			);
			expect(game.value[0]).toBe(0);
			game.disabled = true;
			first.click();
			expect(game.value[0]).toBe(0);
			expect(game.check()).toBeNull();
			game.disabled = false;
			const listener = vi.fn();
			game.addEventListener("tp-logigram-check", listener);
			game.check();
			expect(listener).toHaveBeenCalledOnce();
			first.click();
			game.remove();
			document.body.append(game);
			expect(game.value[0]).toBe(-1);
		}
	},
);
it("loads Markdown through src and ignores an obsolete response", async () => {
	const markdown = readFileSync(
		"public/docs/components/logigram/examples/attributes-src-file1.md",
		"utf8",
	);
	let resolveOld: ((value: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise<Response>((resolve) => {
						resolveOld = resolve;
					}),
			)
			.mockResolvedValueOnce(new Response(markdown)),
	);
	const game = new TpLogigram();
	game.src = "/old.md";
	document.body.append(game);
	await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
	game.src = "/new.md";
	await vi.waitFor(() => expect(game.value).toHaveLength(4));
	resolveOld?.(new Response("invalid"));
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(game.value).toHaveLength(4);
	expect(game.querySelector('[role="alert"]')).toBeNull();
});

it("reports failed sources, recovers, and restores the original inline puzzle", async () => {
	const markdown = readFileSync(
		"public/docs/components/logigram/examples/attributes-src-file1.md",
		"utf8",
	);
	document.body.innerHTML = await renderMarkdownToHtml(
		`::: tp-logigram\n${markdown}\n:::`,
	);
	const game = document.querySelector("tp-logigram");
	if (!game) throw new Error("Missing game");
	await vi.waitFor(() => expect(game.value).toHaveLength(4));
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("missing", { status: 404 })),
	);
	game.src = "/missing.md";
	await vi.waitFor(() =>
		expect(game.querySelector('[role="alert"]')?.textContent).toContain("404"),
	);
	game.src = "";
	await vi.waitFor(() =>
		expect(game.querySelectorAll("button[data-cell]")).toHaveLength(4),
	);
	expect(game.querySelector('[role="alert"]')).toBeNull();
});

it("reads named definition sections regardless of order and rejects missing or duplicate terms", async () => {
	const source = readFileSync(
		"public/docs/components/logigram/examples/attributes-src-file1.md",
		"utf8",
	);
	const root = document.createElement("div");
	root.innerHTML = await renderMarkdownToHtml(source);
	const dl = root.querySelector("dl");
	if (!dl) throw new Error("Missing definition list");
	const first = dl.firstElementChild;
	const second = first?.nextElementSibling;
	if (!first || !second) throw new Error("Missing Prompt");
	dl.append(first, second);
	first.textContent = "prompt";
	expect(readLogigramLists(root, "Test").description).toBe(
		"Match each visitor with a drink.",
	);
	dl.append(first.cloneNode(true), second.cloneNode(true));
	expect(() => readLogigramLists(root, "Test")).toThrow("one dt/dd pair");
	dl.lastElementChild?.remove();
	dl.lastElementChild?.remove();
	first.remove();
	second.remove();
	expect(() => readLogigramLists(root, "Test")).toThrow("required");
});

it("shares triangular headers and preserves matches and arrow directions in the lower block", async () => {
	const file = readFileSync(
		"public/docs/components/logigram/examples/examples.html",
		"utf8",
	);
	const template = document.createElement("template");
	template.innerHTML = file;
	const source = template.content
		.querySelector("template")
		?.content.querySelector('div[label="Basic usage"]')?.innerHTML;
	if (!source) throw new Error("Missing basic example");
	document.body.innerHTML = source;
	const game = document.querySelector("tp-logigram");
	if (!game) throw new Error("Missing game");
	await vi.waitFor(() => expect(game.value).toHaveLength(27));
	expect(game.querySelectorAll("table")).toHaveLength(1);
	expect(
		[...game.querySelectorAll("tbody")].map(
			(body) => body.querySelectorAll("button").length,
		),
	).toEqual([18, 9]);
	expect(
		[...game.querySelectorAll("th[scope=colgroup]")].map(
			(th) => th.textContent,
		),
	).toEqual(["Books", "Drinks"]);
	expect(
		[...game.querySelectorAll("th[scope=rowgroup]")].map(
			(th) => th.textContent,
		),
	).toEqual(["Readers", "Drinks"]);
	const lower = game.querySelector<HTMLButtonElement>('button[data-cell="18"]');
	if (!lower) throw new Error("Missing lower cell");
	lower.click();
	lower.click();
	expect(game.value[18]).toBe(1);
	expect(game.check()?.errors).toEqual([]);
	lower.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect((document.activeElement as HTMLElement).dataset.cell).toBe("21");
	lower.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
	);
	expect((document.activeElement as HTMLElement).dataset.cell).toBe("19");
	game.undo();
	expect(lower.dataset.mark).toBe("-1");
});

const dimensions = Array.from({ length: 5 }, (_, i) => i + 2).flatMap(
	(categories) =>
		Array.from({ length: 7 }, (_, i) => [categories, i + 2] as const),
);
it.each(dimensions)(
	"lays out every pair exactly once for %i categories of %i items",
	async (count, size) => {
		const categories = Array.from({ length: count }, (_, c) => ({
			name: `Category ${c}`,
			items: Array.from({ length: size }, (_, i) => `Item ${c}-${i}`),
		}));
		const game = new TpLogigram();
		game.innerHTML = `<dl><dt>Prompt</dt><dd>Match items.</dd><dt>Categories</dt><dd><ul>${categories.map((c) => `<li>${c.name}<ul>${c.items.map((i) => `<li>${i}</li>`).join("")}</ul></li>`).join("")}</ul></dd><dt>Clues</dt><dd><ol><li>Match equal item numbers.</li></ol></dd><dt>Solution</dt><dd><ol>${Array.from({ length: size }, (_, i) => `<li><ul>${categories.map((c) => `<li>${c.items[i]}</li>`).join("")}</ul></li>`).join("")}</ol></dd></dl>`;
		document.body.append(game);
		const total = ((count * (count - 1)) / 2) * size * size;
		await vi.waitFor(() => expect(game.value).toHaveLength(total));
		const buttons = [
			...game.querySelectorAll<HTMLButtonElement>("button[data-cell]"),
		];
		expect(buttons).toHaveLength(total);
		expect(new Set(buttons.map((b) => b.dataset.cell)).size).toBe(total);
		const headers = [
			...game.querySelectorAll<HTMLTableCellElement>("th[scope=colgroup]"),
		];
		expect(headers.map((h) => h.textContent)).toEqual(
			categories.slice(1).map((c) => c.name),
		);
		expect(headers.every((h) => h.colSpan === size)).toBe(true);
		const columnLabels = [...game.querySelectorAll("th[scope=col]")].map(
			(h) => h.textContent,
		);
		expect(columnLabels).toEqual(categories.slice(1).flatMap((c) => c.items));
		const bodies = [...game.querySelectorAll("tbody")];
		expect(bodies).toHaveLength(count - 1);
		const seenPairs = new Set<string>();
		for (const [band, body] of bodies.entries()) {
			const left =
				body.querySelector<HTMLTableCellElement>("th[scope=rowgroup]");
			expect(left?.rowSpan).toBe(size);
			expect(body.rows).toHaveLength(size);
			expect(body.querySelectorAll("button")).toHaveLength(
				(count - 1 - band) * size * size,
			);
			for (const [row, tr] of [...body.rows].entries()) {
				const rowItem = tr.querySelector("th[scope=row]")?.textContent;
				const cells = [...tr.querySelectorAll<HTMLButtonElement>("button")];
				for (const [col, button] of cells.entries()) {
					// Read displayed headers independently of the internal model's ordering.
					const top = headers[Math.floor(col / size)]?.textContent;
					const expected = [
						`${left?.textContent}: ${rowItem}`,
						`${top}: ${columnLabels[col]}`,
					].sort();
					expect(button.dataset.label?.split("; ").sort()).toEqual(expected);
					seenPairs.add([left?.textContent, top].sort().join("/"));
					for (const [key, dr, dc] of [
						["ArrowRight", 0, 1],
						["ArrowLeft", 0, -1],
						["ArrowDown", 1, 0],
						["ArrowUp", -1, 0],
					] as const) {
						button.focus();
						button.dispatchEvent(
							new KeyboardEvent("keydown", { key, bubbles: true }),
						);
						const inside =
							row + dr >= 0 &&
							row + dr < size &&
							(col % size) + dc >= 0 &&
							(col % size) + dc < size;
						const expectedFocus = inside
							? body.rows[row + dr]?.querySelectorAll("button")[col + dc]
							: button;
						expect(document.activeElement).toBe(expectedFocus);
					}
				}
			}
		}
		expect(seenPairs.size).toBe((count * (count - 1)) / 2);
		// Check one correct and one incorrect mark in each displayed matrix.
		for (const body of bodies) {
			const row = [
				...(body.rows[0]?.querySelectorAll<HTMLButtonElement>("button") ?? []),
			];
			for (let col = 0; col < row.length; col += size) {
				const correct = row[col];
				const incorrect = row[col + 1];
				correct?.dispatchEvent(
					new MouseEvent("contextmenu", { bubbles: true }),
				);
				expect(game.check()?.errors).toEqual([]);
				incorrect?.dispatchEvent(
					new MouseEvent("contextmenu", { bubbles: true }),
				);
				expect(game.check()?.errors).toEqual([Number(incorrect?.dataset.cell)]);
				game.undo();
			}
		}
	},
);

it("undoes and redoes each assistance action as a single move", () => {
	const game = new LogigramModel(puzzle);
	game.set(0, 1);
	game.set(1, 1);
	game.set(11, -1);
	const before = game.value;
	game.assist("clear-incorrect");
	expect(game.value[0]).toBe(1);
	expect(game.check().errors).toEqual([]);
	game.undo();
	expect(game.value).toEqual(before);
	game.redo();
	expect(game.check().errors).toEqual([]);
	game.assist("show-block", 8);
	expect(game.value.slice(8)).toEqual([1, -1, -1, 1]);
	game.undo();
	expect(game.value.slice(8)).toEqual([0, 0, 0, 0]);
	const partial = game.value;
	game.assist("show-cell", 9);
	expect(game.value[9]).toBe(-1);
	game.undo();
	expect(game.value).toEqual(partial);
	game.assist("show-solution");
	expect(game.check().complete).toBe(true);
	game.undo();
	expect(game.value).toEqual(partial);
	game.redo();
	expect(game.check().complete).toBe(true);
});

it("offers assistance on the retained selection and respects disabled state", async () => {
	const markdown = readFileSync(
		"public/docs/components/logigram/examples/attributes-src-file2.md",
		"utf8",
	);
	document.body.innerHTML = await renderMarkdownToHtml(
		`::: tp-logigram\n${markdown}\n:::`,
	);
	const game = document.querySelector("tp-logigram");
	if (!game) throw new Error("Missing game");
	await vi.waitFor(() => expect(game.value).toHaveLength(27));
	const menu = game.querySelector<HTMLSelectElement>(
		"select.tp-logigram-assist",
	);
	const cell = game.querySelector<HTMLButtonElement>('button[data-cell="18"]');
	if (!menu || !cell) throw new Error("Missing controls");
	const run = (action: string) => {
		menu.value = action;
		menu.dispatchEvent(new Event("change", { bubbles: true }));
	};
	expect(
		menu.querySelector<HTMLOptionElement>('[value="show-cell"]')?.disabled,
	).toBe(true);
	cell.click();
	menu.focus();
	expect(cell.hasAttribute("data-selected")).toBe(true);
	expect(
		game.querySelector(".tp-logigram-selection-hint")?.textContent,
	).toContain("Selected box:");
	expect(
		menu.querySelector<HTMLOptionElement>('[value="show-cell"]')?.disabled,
	).toBe(false);
	run("show-cell");
	expect(game.value[18]).toBe(1);
	expect(menu.value).toBe("");
	game.undo();
	expect(game.value[18]).toBe(-1);
	run("show-block");
	expect(game.value.slice(18).every((v) => v !== 0)).toBe(true);
	game.undo();
	game.reset();
	expect(game.value.every((v) => v === 0)).toBe(true);
	game.disabled = true;
	expect(menu.disabled).toBe(true);
	run("show-solution");
	expect(game.value.every((v) => v === 0)).toBe(true);
	game.disabled = false;
	run("show-solution");
	expect(game.check()?.complete).toBe(true);
	run("reset-game");
	expect(game.value.every((v) => v === 0)).toBe(true);
	game.undo();
	expect(game.check()?.complete).toBe(true);
});
