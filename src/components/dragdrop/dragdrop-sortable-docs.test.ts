import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, expect, it } from "vitest";
import "./dragdrop.js";

/** Shared documentation assets, not a duplicate test fixture. */
const example = readFileSync(
	"public/docs/components/dragdrop/examples/sortable-list.html",
	"utf8",
);
const script = readFileSync(
	"public/docs/components/dragdrop/examples/sortable-list.js",
	"utf8",
);

/** Finds a required element in the mounted example. */
function element(selector: string): HTMLElement {
	const found = document.querySelector<HTMLElement>(selector);
	if (!found) throw new Error(`Missing sortable example element: ${selector}`);
	return found;
}

/** Returns the current visual and DOM order. */
function order(): string[] {
	return [...document.querySelectorAll("ol > li")].map(
		(item) => item.getAttribute("aria-label") ?? "",
	);
}

beforeEach(async () => {
	document.body.innerHTML = example;
	await runInNewContext(script, { document, customElements });
});
afterEach(() => document.body.replaceChildren());

it("moves an entry with buttons and disables moves beyond the boundaries", () => {
	expect(
		element('li:first-child [data-direction="up"]').hasAttribute("disabled"),
	).toBe(true);
	expect(
		element('li:last-child [data-direction="down"]').hasAttribute("disabled"),
	).toBe(true);
	element('li:first-child [data-direction="down"]').click();
	expect(order().slice(0, 2)).toEqual([
		"Write a draft",
		"Publish the document",
	]);
	expect(element("[data-sort-status]").textContent).toContain("item 2 of 4");
});

it("reorders with the keyboard and leaves the order unchanged after cancellation", () => {
	const source = element("li:first-child");
	source.focus();
	for (const key of ["Enter", "ArrowDown"])
		source.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
	element("li:nth-child(2)").dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(order().slice(0, 2)).toEqual([
		"Write a draft",
		"Publish the document",
	]);
	const previous = order();
	for (const key of ["Enter", "ArrowDown", "Escape"])
		source.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
	expect(order()).toEqual(previous);
});

it("treats a center drop as reordering, never as nesting list entries", () => {
	const source = element("li:first-child");
	const target = element("li:last-child");
	element("tp-dragdrop").dispatchEvent(
		new CustomEvent("tp-dragdrop-drop", {
			detail: { source, target, position: "inside" },
		}),
	);
	expect(order().at(-1)).toBe("Publish the document");
	expect(document.querySelectorAll("ol > li")).toHaveLength(4);
	expect(document.querySelector("li li")).toBeNull();
	expect(document.activeElement).toBe(source);
});

it("restores the initial order and does not duplicate handlers on script reload", async () => {
	const initial = order();
	await runInNewContext(script, { document, customElements });
	element('li:first-child [data-direction="down"]').click();
	expect(order().indexOf(initial[0] ?? "")).toBe(1);
	element("[data-reset]").click();
	expect(order()).toEqual(initial);
});

it("keeps the insertion predecessor highlighted without moving entries until drop", () => {
	const initial = order();
	const source = element("li:first-child");
	const target = element("li:nth-child(3)");
	const controller = element("tp-dragdrop");
	const detail = { source, target, position: "after" };
	controller.dispatchEvent(new CustomEvent("tp-dragdrop-over", { detail }));
	expect(element("[data-sort-insert-after]")).toBe(target);
	expect(
		target.querySelector<HTMLElement>("tp-box")?.style.boxShadow,
	).toContain("-4px");
	expect(order()).toEqual(initial);
	controller.dispatchEvent(new CustomEvent("tp-dragdrop-over", { detail }));
	expect(document.querySelectorAll("[data-sort-insert-after]")).toHaveLength(1);
	controller.dispatchEvent(new CustomEvent("tp-dragdrop-drop", { detail }));
	expect(target.nextElementSibling).toBe(source);
	expect(document.querySelector("[data-sort-insert-after]")).toBeNull();
	expect(target.querySelector("tp-box")?.hasAttribute("style")).toBe(false);
});

it("highlights the actual predecessor for a before drop and marks the beginning explicitly", () => {
	const source = element("li:last-child");
	const controller = element("tp-dragdrop");
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-over", {
			detail: {
				source,
				target: element("li:nth-child(3)"),
				position: "before",
			},
		}),
	);
	expect(element("[data-sort-insert-after]")).toBe(element("li:nth-child(2)"));
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-over", {
			detail: { source, target: element("li:first-child"), position: "before" },
		}),
	);
	expect(document.querySelector("[data-sort-insert-after]")).toBeNull();
	expect(element("[data-sort-insert-before]")).toBe(element("li:first-child"));
	expect(element("[data-sort-status]").textContent).toContain(
		"beginning of the list",
	);
	controller.dispatchEvent(new CustomEvent("tp-dragdrop-end"));
	expect(document.querySelector("[data-sort-insert-before]")).toBeNull();
});

it("clears keyboard highlights on Escape and restores pre-existing styles", () => {
	const source = element("li:first-child");
	const target = element("li:nth-child(2)");
	const box = target.querySelector("tp-box");
	box?.setAttribute("style", "padding: 2rem;");
	for (const key of ["Enter", "ArrowDown"])
		source.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
	expect(element("[data-sort-insert-after]")).toBe(target);
	target.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(document.querySelector("[data-sort-insert-after]")).toBeNull();
	expect(box?.getAttribute("style")).toBe("padding: 2rem;");
});

it.each(["html", "md", "adoc", "rst"])(
	"keeps Basic usage, Sortable list and Tree drag and drop in %s",
	(extension) => {
		const content = readFileSync(
			`public/docs/components/dragdrop/examples/examples.${extension}`,
			"utf8",
		);
		expect(content).not.toContain("Additional usage");
		expect(content).toContain("Basic usage");
		expect(content).toContain("Sortable list");
		expect(content).toContain("Tree drag and drop");
		expect(content).toContain(
			"/docs/components/dragdrop/examples/sortable-list.js",
		);
	},
);
