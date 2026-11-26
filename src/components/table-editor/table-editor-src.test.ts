import { afterEach, describe, expect, it, vi } from "vitest";
import { TpTableEditor } from "./table-editor.js";

const source =
	"<table><caption>Imported</caption><tr><th>Item</th></tr><tr><td>Books</td></tr></table>";
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe("table editor imports", () => {
	it("loads src, replaces caption, and resets to the imported table", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(source)),
		);
		const editor = new TpTableEditor();
		editor.src = "https://example.org/table.html";
		document.body.append(editor);
		await vi.waitFor(() =>
			expect(editor.getData().cells).toEqual([["Item"], ["Books"]]),
		);
		expect(editor.caption).toBe("Imported");
		editor.setData([["Changed"]]);
		editor.reset();
		expect(editor.getData().cells[1]).toEqual(["Books"]);
		expect(editor.hasAttribute("aria-busy")).toBe(false);
	});
	it("keeps the previous table on rejection and emits an error", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("Not a table")),
		);
		const editor = new TpTableEditor();
		document.body.append(editor);
		editor.setData([["Keep"]]);
		const error = vi.fn();
		editor.addEventListener("tp-table-editor-error", error);
		editor.src = "https://example.org/invalid.md";
		await vi.waitFor(() => expect(error).toHaveBeenCalledOnce());
		expect(editor.getData().cells).toEqual([["Keep"]]);
		expect(editor.querySelector('[role="status"]')?.textContent).toMatch(
			/table/,
		);
	});
	it("ignores stale requests when src changes", async () => {
		let resolveFirst: (value: Response) => void = () => {};
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockImplementationOnce(
					() =>
						new Promise<Response>((resolve) => {
							resolveFirst = resolve;
						}),
				)
				.mockResolvedValue(new Response(source)),
		);
		const editor = new TpTableEditor();
		editor.src = "https://example.org/first.html";
		document.body.append(editor);
		editor.src = "https://example.org/second.html";
		await vi.waitFor(() => expect(editor.caption).toBe("Imported"));
		resolveFirst(new Response("<table><tr><td>Stale</td></tr></table>"));
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(editor.getData().cells[1]).toEqual(["Books"]);
	});
	it("opens a file picker from the import button and imports the chosen file", async () => {
		const editor = new TpTableEditor();
		document.body.append(editor);
		const input = editor.querySelector<HTMLInputElement>("[data-import-file]");
		expect(input).not.toBeNull();
		const click = vi.spyOn(HTMLInputElement.prototype, "click");
		editor.querySelector<HTMLElement>('[data-action="import"]')?.click();
		expect(click).not.toHaveBeenCalled();
		const menu = editor.querySelector("[data-import-menu]");
		const item = menu?.querySelector('[data-import-format="html"]');
		menu?.dispatchEvent(
			new CustomEvent("tp-menu-item-select", { detail: { item } }),
		);
		expect(input?.accept).toBe(".html,.htm");
		expect(click).toHaveBeenCalledOnce();
		const file = new File([source], "table.html");
		Object.defineProperty(file, "text", { value: async () => source });
		Object.defineProperty(input, "files", { value: [file] });
		input?.dispatchEvent(new Event("change"));
		await vi.waitFor(() => expect(editor.caption).toBe("Imported"));
		expect(editor.getData().cells[1]).toEqual(["Books"]);
	});
});
it("disables local import in readonly mode", () => {
	const editor = new TpTableEditor();
	editor.readonly = true;
	document.body.append(editor);
	expect(
		editor.querySelector('[data-action="import"]')?.hasAttribute("disabled"),
	).toBe(true);
	const click = vi.spyOn(HTMLInputElement.prototype, "click");
	editor.querySelector<HTMLElement>('[data-action="import"]')?.click();
	expect(click).not.toHaveBeenCalled();
});
it("does not apply a response after disconnection", async () => {
	let complete: (response: Response) => void = () => {};
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((resolve) => {
					complete = resolve;
				}),
		),
	);
	const editor = new TpTableEditor();
	editor.src = "https://example.org/table.html";
	const loaded = vi.fn();
	editor.addEventListener("tp-table-editor-load", loaded);
	document.body.append(editor);
	editor.remove();
	complete(new Response(source));
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(loaded).not.toHaveBeenCalled();
	expect(editor.hasAttribute("aria-busy")).toBe(false);
});

it("groups all import formats and filters the picker for each choice", () => {
	const editor = new TpTableEditor();
	document.body.append(editor);
	const menu = editor.querySelector("[data-import-menu]");
	const items = Array.from(
		menu?.querySelectorAll<HTMLElement>("[data-import-format]") ?? [],
	);
	expect(
		menu
			?.querySelector('[data-import-format="html"]')
			?.getAttribute("aria-current"),
	).toBe("true");
	expect(menu?.querySelectorAll("[data-check]")).toHaveLength(8);
	for (const item of items.slice(0, 5)) {
		expect(
			item.querySelector("tp-icon:not([data-check])")?.getAttribute("library"),
		).toBe("languages");
		expect(
			item.querySelector("tp-icon:not([data-check])")?.getAttribute("name"),
		).toBe(`file_type_${item.dataset.importFormat}`);
	}
	expect(items.map((item) => item.dataset.importFormat)).toEqual([
		"html",
		"asciidoc",
		"latex",
		"markdown",
		"restructuredtext",
		"csv",
		"json",
		"xlsx",
	]);
	expect(
		menu
			?.querySelector("tp-divider")
			?.previousElementSibling?.getAttribute("data-import-format"),
	).toBe("restructuredtext");
	expect(
		menu
			?.querySelector("tp-divider")
			?.nextElementSibling?.getAttribute("data-import-format"),
	).toBe("csv");
	vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
	for (const [index, item] of items.entries()) {
		menu?.dispatchEvent(
			new CustomEvent("tp-menu-item-select", { detail: { item } }),
		);
		expect(menu?.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
		expect(item.getAttribute("aria-current")).toBe("true");
		expect(
			editor.querySelector<HTMLInputElement>("[data-import-file]")?.accept,
		).toBe(
			[
				".html,.htm",
				".adoc,.asciidoc",
				".tex,.latex",
				".md,.markdown",
				".rst,.rest",
				".csv",
				".json",
				".xlsx",
			][index],
		);
	}
});
