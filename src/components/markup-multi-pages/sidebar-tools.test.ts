import { afterEach, expect, it, vi } from "vitest";
import "../splitter/splitter.js";
import "../tree/tree.js";
import { appendSidebarTools } from "./sidebar-tools.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
function fixture() {
	const splitter = document.createElement("tp-splitter");
	splitter.position = "31%";
	splitter.innerHTML =
		'<dl><dt>Navigation</dt><dd><aside data-role="sidebar"><div data-controls></div><tp-tree level="0"><ul><li>Parent<ul><li>Nested<ul><li><a href="#target">Éléphant guide</a></li></ul></li></ul></li><li>Other</li></ul></tp-tree></aside></dd><dt>Page</dt><dd>Content</dd></dl>';
	document.body.append(splitter);
	const tree = splitter.querySelector("tp-tree");
	const controls = splitter.querySelector<HTMLElement>("[data-controls]");
	if (!tree || !controls) throw new Error("Missing fixture");
	appendSidebarTools(controls, tree);
	return { splitter, tree, controls };
}
it("finds accent-insensitive matches, opens ancestors, clears and closes with Escape", () => {
	const { tree, controls } = fixture();
	tree.collapseAll();
	controls.querySelector<HTMLElement>('[name="search"]')?.click();
	const field = controls.querySelector("tp-textfield");
	if (!field) throw new Error("Missing search");
	field.value = "ELEPHANT";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(tree.querySelectorAll("[data-tp-sidebar-match]")).toHaveLength(1);
	expect(tree.querySelector("[data-tp-sidebar-match]")?.textContent).toContain(
		"Éléphant guide",
	);
	expect(
		[...tree.querySelectorAll("li[data-expanded]")].every(
			(li) => li.getAttribute("data-expanded") === "true",
		),
	).toBe(true);
	expect(controls.querySelector('[role="status"]')?.textContent).toBe(
		"1 result",
	);
	expect(
		controls
			.querySelector('[role="status"]')
			?.hasAttribute("data-tp-sidebar-no-results"),
	).toBe(false);
	field.value = "missing";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(tree.querySelectorAll("[data-tp-sidebar-match]")).toHaveLength(0);
	expect(controls.querySelector('[role="status"]')?.textContent).toBe(
		"0 results",
	);
	expect(
		controls
			.querySelector('[role="status"]')
			?.hasAttribute("data-tp-sidebar-no-results"),
	).toBe(true);
	field.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(
		controls.querySelector<HTMLElement>("[data-tp-sidebar-search]")?.hidden,
	).toBe(true);
	expect(field.value).toBe("");
	expect(
		controls
			.querySelector('[role="status"]')
			?.hasAttribute("data-tp-sidebar-no-results"),
	).toBe(false);
	expect(
		controls.querySelector('[name="search"]')?.getAttribute("aria-expanded"),
	).toBe("false");
});
it("measures hidden titles and restores the original divider position without reordering", () => {
	const { splitter, tree, controls } = fixture();
	vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
		function (this: HTMLElement) {
			return {
				width:
					this === splitter ? 1000 : this.localName === "tp-tree" ? 500 : 310,
			} as DOMRect;
		},
	);
	const original = tree.textContent;
	controls
		.querySelector<HTMLElement>('[name="arrow-expand-horizontal"]')
		?.click();
	expect(Number.parseFloat(splitter.position)).toBeCloseTo(54.8);
	expect(tree.closest("aside")?.hasAttribute("data-tp-sidebar-wide")).toBe(
		true,
	);
	expect(tree.textContent).toBe(original);
	expect(splitter.querySelectorAll("tp-tree")).toHaveLength(1);
	controls
		.querySelector<HTMLElement>('[name="arrow-collapse-horizontal"]')
		?.click();
	expect(splitter.position).toBe("31%");
	expect(tree.closest("aside")?.hasAttribute("data-tp-sidebar-wide")).toBe(
		false,
	);
});

it("scrolls the sidebar to the first result below the sticky search controls", () => {
	const { tree, controls } = fixture();
	const sidebar = tree.closest<HTMLElement>("aside");
	const field = controls.querySelector("tp-textfield");
	const row = tree
		.querySelector('a[href="#target"]')
		?.closest<HTMLElement>("[data-tp-tree-row]");
	if (!sidebar || !field || !row) throw new Error("Missing fixture");
	sidebar.scrollTop = 100;
	vi.spyOn(sidebar, "getBoundingClientRect").mockReturnValue({
		top: 50,
	} as DOMRect);
	vi.spyOn(controls, "getBoundingClientRect").mockReturnValue({
		height: 120,
	} as DOMRect);
	vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
		top: 700,
	} as DOMRect);
	field.value = "elephant";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(sidebar.scrollTop).toBe(618);
	field.value = "missing";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(sidebar.scrollTop).toBe(618);
});
