import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TpHtmlPlayground } from "../html-playground/html-playground.js";
import {
	TpSqlPlayground,
	TpSqlProject,
} from "../sql-playground/sql-playground.js";

function mount(): TpSqlPlayground {
	const element = new TpSqlPlayground();
	document.body.append(element);
	return element;
}
function menu(element: Element, action: string): void {
	const host = element.querySelector("[data-tp-playground-toolbar-start-menu]");
	const item = host?.querySelector<HTMLElement>(
		`[data-tp-playground-action="${action}"]`,
	);
	if (!host || !item) throw new Error(`Missing menu action ${action}`);
	host.dispatchEvent(
		new CustomEvent("tp-menu-item-select", { detail: { item } }),
	);
}
beforeEach(() => {
	const values = new Map<string, string>();
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
		removeItem: (key: string) => {
			values.delete(key);
		},
		clear: () => values.clear(),
	});
});

afterEach(() => {
	document.body.replaceChildren();
	localStorage.clear();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("named playground actions", () => {
	it.each([
		["new-project", "newProject"],
		["clear-project", "clearProject"],
		["open-source-file", "openSourceFile"],
		["save-file", "saveFile"],
		["save-file-as", "saveFileAs"],
		["import-disk", "importProject"],
		["export-disk", "exportProject"],
		["save-memory", "saveInMemory"],
		["clear-memory", "clearMemory"],
		["sql-reset-db", "resetActiveDatabase"],
	] as const)("routes %s through %s", (action, method) => {
		const element = mount();
		const spy = vi
			.spyOn(element, method)
			.mockImplementation(() => Promise.resolve());
		menu(element, action);
		expect(spy).toHaveBeenCalledOnce();
	});
	it("clears and creates projects through both API and menu", () => {
		const element = mount();
		element.newProject();
		const starter = element.getProject().toJSON();
		element.clearProject();
		expect(element.getProject().files).toHaveLength(0);
		menu(element, "new-project");
		expect(element.getProject().toJSON()).toEqual(starter);
		menu(element, "clear-project");
		expect(element.getProject().files).toHaveLength(0);
	});
	it("saves, restores and clears browser memory without executing the project", () => {
		const element = mount();
		const run = vi.spyOn(element, "run").mockResolvedValue();
		element.setProject(
			new TpSqlProject({
				name: "Remembered",
				entry: "/query.sql",
				files: [{ path: "/query.sql", language: "sql", content: "SELECT 42;" }],
			}),
		);
		const saved = element.getProject().toJSON();
		menu(element, "save-memory");
		element.clearProject();
		menu(element, "load-memory");
		expect(element.getProject().toJSON()).toEqual(saved);
		expect(run).not.toHaveBeenCalled();
		menu(element, "clear-memory");
		expect(localStorage.getItem("tp-playground-memory:sql")).toBeNull();
		expect(element.getProject().toJSON()).toEqual(saved);
	});
	it("opens source/project choosers and save destinations with distinct options", async () => {
		const element = mount();
		const open = vi.spyOn(element, "openLocalProject").mockResolvedValue();
		const save = vi.spyOn(element, "saveActiveFile").mockResolvedValue();
		await element.openSourceFile();
		await element.importProject();
		await element.saveFile();
		await element.saveFileAs();
		expect(open.mock.calls).toEqual([[false], [true]]);
		expect(save.mock.calls).toEqual([[false], [true]]);
	});
	it("makes the HTML import-map menu functional and equivalent to the API", async () => {
		const element = new TpHtmlPlayground();
		document.body.append(element);
		const run = vi.spyOn(element, "run").mockResolvedValue();
		menu(element, "html-importmap-lit");
		expect(element.getProject().importmap).toEqual({
			imports: { lit: "https://cdn.jsdelivr.net/npm/lit@3/+esm" },
		});
		await element.setImportmap(undefined);
		expect(element.getProject().importmap).toBeUndefined();
		expect(run).toHaveBeenCalledTimes(2);
	});
});

it("keeps tree edits guarded and emits the same request events through the public API", () => {
	const tree = document.createElement("tp-tree");
	tree.innerHTML =
		'<ul><li data-node-id="root">Root<ul><li>Child</li></ul></li></ul>';
	document.body.append(tree);
	const root = tree.querySelector("li");
	if (!root) throw new Error("Missing root");
	const added = vi.fn();
	tree.addEventListener("tp-tree-node-add-request", added);
	const initial = tree.querySelectorAll("li").length;
	tree.addLeaf(root);
	expect(tree.querySelectorAll("li")).toHaveLength(initial);
	tree.editable = true;
	tree.addLeaf(root);
	expect(tree.querySelectorAll("li")).toHaveLength(initial + 1);
	expect(added).toHaveBeenCalledOnce();
	const deleted = vi.fn();
	tree.addEventListener("tp-tree-node-delete-request", deleted);
	const leaf = root.querySelector("li");
	if (!leaf) throw new Error("Missing child");
	tree.deleteNode(leaf);
	expect(leaf.isConnected).toBe(false);
	expect(deleted).toHaveBeenCalledOnce();
});
