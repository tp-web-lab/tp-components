import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "../python-notebook/python-notebook.js";
import "./notebook.js";

beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it.each(["tp-notebook", "tp-python-notebook"])(
	"offers a LaTeX cell in %s",
	async (tag) => {
		const notebook = document.createElement(tag);
		document.body.append(notebook);
		await vi.waitFor(() =>
			expect(
				notebook.querySelector(
					'[data-cell-type="markup"][data-language="latex"]',
				),
			).not.toBeNull(),
		);
		const choice = notebook.querySelector<HTMLElement>(
			'[data-cell-type="markup"][data-language="latex"]',
		);
		expect(
			choice
				?.querySelector('tp-icon[library="languages"]')
				?.getAttribute("name"),
		).toBe("file_type_latex");
		choice?.click();
		expect(notebook.querySelector("tp-latex-viewer")).toBeNull();
		expect(choice?.getAttribute("aria-current")).toBe("true");
		notebook.querySelector<HTMLElement>('[data-action="add-markup"]')?.click();
		await vi.waitFor(() =>
			expect(notebook.querySelector("tp-latex-viewer")).not.toBeNull(),
		);
		expect(
			notebook.querySelector('tp-latex-viewer script[type="tp/latex"]'),
		).not.toBeNull();
	},
);

it("loads, previews and exports native LaTeX cells", async () => {
	const notebook = document.createElement("tp-notebook");
	const source = String.raw`Hello \textbf{world}.`;
	const script = document.createElement("script");
	script.type = "tp/latex";
	script.textContent = source;
	notebook.append(script);
	document.body.append(notebook);
	await vi.waitFor(() =>
		expect(notebook.querySelector("tp-latex-viewer")).not.toBeNull(),
	);
	expect(notebook.querySelector("tp-latex-viewer script")?.textContent).toBe(
		source,
	);
	notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
	await vi.waitFor(() =>
		expect(
			notebook.querySelector(
				"[data-tp-notebook-preview-content] tp-latex .tp-latex-output",
			)?.textContent,
		).toContain("Hello"),
	);
	const api = notebook as unknown as HTMLElement & {
		standaloneHtml(): Promise<string>;
	};
	const exported = new DOMParser().parseFromString(
		await api.standaloneHtml(),
		"text/html",
	);
	expect(exported.querySelector(".tp-latex-output")?.textContent).toContain(
		"Hello",
	);
	const data = JSON.parse(
		exported.querySelector("#tp-notebook-data")?.textContent ?? "{}",
	);
	expect(data.cells[0]).toMatchObject({
		type: "markup",
		language: "latex",
		content: source,
	});
});

it("keeps the programming choice for repeated additions and disables both controls in preview", async () => {
	const notebook = document.createElement("tp-notebook");
	document.body.append(notebook);
	await vi.waitFor(() =>
		expect(notebook.querySelector('[data-language="python"]')).not.toBeNull(),
	);
	notebook.querySelector<HTMLElement>('[data-language="python"]')?.click();
	expect(notebook.querySelector("[data-tp-notebook-cell]")).toBeNull();
	expect(
		notebook.querySelector('[data-tp-notebook-language-choice="code"]')
			?.textContent,
	).toBe("python");
	expect(
		notebook
			.querySelector('[data-language="python"]')
			?.getAttribute("aria-current"),
	).toBe("true");
	expect(
		notebook
			.querySelector('[data-language="javascript"]')
			?.getAttribute("aria-current"),
	).toBe("false");
	const add = notebook.querySelector<HTMLElement>(
		'[data-action="add-language"]',
	);
	add?.click();
	add?.click();
	expect(notebook.querySelectorAll("tp-python-viewer")).toHaveLength(2);
	notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
	for (const selector of [
		'[data-action="add-language"]',
		'[data-action="add-markup"]',
		'[data-tp-notebook-language-choice="code"]',
		'[data-tp-notebook-language-choice="markup"]',
	]) {
		expect(notebook.querySelector(selector)?.hasAttribute("disabled")).toBe(
			true,
		);
	}
	notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
	notebook.setAttribute("readonly", "");
	add?.click();
	expect(notebook.querySelectorAll("tp-python-viewer")).toHaveLength(2);
});

it("opens markup and programming editors when entering edit mode", async () => {
	const notebook = document.createElement("tp-notebook");
	notebook.innerHTML =
		'<script type="tp/markdown">Hello</script><script type="tp/python">print(42)</script>';
	document.body.append(notebook);
	const check = async () => {
		await vi.waitFor(() => {
			expect(
				notebook
					.querySelector('[data-role="toggle-source"]')
					?.getAttribute("aria-pressed"),
			).toBe("true");
			expect(
				notebook
					.querySelector("[data-tp-programming-viewer-code]")
					?.getAttribute("aria-pressed"),
			).toBe("true");
		});
	};
	await check();
	notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
	notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
	await check();
});

it.each(["tp-notebook", "tp-python-notebook"])(
	"runs cells in view mode in %s, including readonly notebooks",
	async (tag) => {
		const notebook = document.createElement(tag);
		notebook.innerHTML =
			'<script type="tp/python">print(1)</script><script type="tp/markdown">Between cells</script><script type="tp/python">print(2)</script>';
		document.body.append(notebook);
		await vi.waitFor(() =>
			expect(notebook.querySelectorAll("tp-python-viewer")).toHaveLength(2),
		);
		notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
		await vi.waitFor(() =>
			expect(
				notebook.querySelectorAll(
					"[data-tp-notebook-preview-content] [data-tp-playground-run]",
				),
			).toHaveLength(2),
		);
		const buttons = Array.from(
			notebook.querySelectorAll<HTMLElement>(
				"[data-tp-notebook-preview-content] [data-tp-playground-run]",
			),
		);
		const calls: number[] = [];
		const spies = buttons.map((button, index) =>
			vi.spyOn(button, "click").mockImplementation(() => {
				calls.push(index);
			}),
		);
		const run = notebook.querySelector<HTMLElement>('[data-action="run-all"]');
		expect(run?.hasAttribute("disabled")).toBe(false);
		run?.click();
		expect(calls).toEqual([0, 1]);
		notebook.setAttribute("readonly", "");
		expect(run?.hasAttribute("disabled")).toBe(false);
		run?.click();
		expect(calls).toEqual([0, 1, 0, 1]);
		spies.forEach((spy) => {
			spy.mockRestore();
		});
	},
);
