import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { TpCodeComment } from "./code-comment.js";

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

/** Creates a real editor with an explicit source and no external resource. */
function editor(id: string): TpCodeEditor {
	const element = document.createElement("tp-code-editor") as TpCodeEditor;
	element.id = id;
	element.setAttribute("language", "typescript");
	element.setValue("const value = 2; // <1> <2>");
	document.body.append(element);
	return element;
}
/** Creates a declarative annotation list without replacing its author content. */
function comments(id: string): TpCodeComment {
	const element = new TpCodeComment();
	element.htmlFor = id;
	element.innerHTML =
		"<ol><li><strong>First</strong> explanation.</li><li>Second explanation.</li></ol>";
	document.body.append(element);
	return element;
}

it("toggles list visibility without replacing author content or editor tooltips", async () => {
	const target = editor("visibility");
	const list = comments("visibility");
	const authorList = list.querySelector("ol");
	await vi.waitFor(() =>
		expect(
			document.querySelectorAll("[data-tp-code-comment-tooltip]"),
		).toHaveLength(2),
	);
	const marker = target.querySelector(".tp-code-comment-marker");
	const tooltip = document.querySelector("[data-tp-code-comment-tooltip]");
	expect(list.open).toBe(false);
	list.open = true;
	expect(list.hasAttribute("open")).toBe(true);
	list.removeAttribute("open");
	expect(list.open).toBe(false);
	list.setAttribute("open", "");
	expect(list.open).toBe(true);
	list.open = false;
	expect(list.hasAttribute("open")).toBe(false);
	expect(list.querySelector("ol")).toBe(authorList);
	expect(target.querySelector(".tp-code-comment-marker")).toBe(marker);
	expect(document.querySelector("[data-tp-code-comment-tooltip]")).toBe(
		tooltip,
	);
	marker?.dispatchEvent(new MouseEvent("mouseenter"));
	expect(tooltip?.hasAttribute("open")).toBe(true);
});

it("decorates the editor and original list, then restores the code and list on removal", async () => {
	const target = editor("example");
	const value = target.getValue();
	const list = comments("example");
	const strong = list.querySelector("strong");
	await vi.waitFor(() =>
		expect(target.querySelectorAll(".tp-code-comment-marker")).toHaveLength(2),
	);
	expect(list.querySelectorAll('tp-icon[library="numbers"]')).toHaveLength(2);
	expect(list.htmlFor).toBe("example");
	expect(target.getValue()).toBe(value);
	target.setAttribute("line-numbers", "");
	await vi.waitFor(() =>
		expect(target.querySelectorAll(".tp-code-comment-marker")).toHaveLength(2),
	);
	list.remove();
	expect(target.querySelector(".tp-code-comment-marker")).toBeNull();
	expect(target.getValue()).toBe(value);
	expect(list.querySelector("strong")).toBe(strong);
	expect(list.querySelector("tp-icon")).toBeNull();
	document.body.append(list);
	await vi.waitFor(() =>
		expect(target.querySelectorAll(".tp-code-comment-marker")).toHaveLength(2),
	);
});

it("finds late targets, tracks exact IDs and rebinds without disturbing another list", async () => {
	const first = comments("late:editor");
	expect(first.textContent).toContain("No tp-code-editor");
	const target = editor("late:editor");
	await vi.waitFor(() => expect(first.querySelector("tp-callout")).toBeNull());
	const second = comments("late:editor");
	const next = editor("next");
	first.htmlFor = "next";
	await vi.waitFor(() =>
		expect(next.querySelectorAll(".tp-code-comment-marker")).toHaveLength(2),
	);
	expect(target.querySelectorAll(".tp-code-comment-marker")).toHaveLength(2);
	second.remove();
	expect(target.querySelector(".tp-code-comment-marker")).toBeNull();
	next.id = "renamed";
	await vi.waitFor(() =>
		expect(first.textContent).toContain("No tp-code-editor"),
	);
	first.htmlFor = "renamed";
	await vi.waitFor(() => expect(first.querySelector("tp-callout")).toBeNull());
});

it("renumbers edited lists, handles missing content and avoids nonexistent icon requests", async () => {
	const target = editor("code");
	const list = comments("code");
	const ol = list.querySelector("ol");
	if (!ol) throw new Error("Missing list");
	ol.firstElementChild?.remove();
	await vi.waitFor(() =>
		expect(list.querySelectorAll("tp-icon")).toHaveLength(1),
	);
	expect(list.querySelector("tp-icon")?.getAttribute("name")).toBe("1");
	for (let index = 1; index < 100; index++)
		ol.append(document.createElement("li"));
	await vi.waitFor(() => expect(list.textContent).toContain("1 to 99"));
	expect(list.querySelector('tp-icon[name="100"]')).toBeNull();
	ol.remove();
	await vi.waitFor(() =>
		expect(list.textContent).toContain("Provide an ordered list"),
	);
	expect(target.querySelector(".tp-code-comment-marker")).toBeNull();
	list.htmlFor = "";
	expect(list.htmlFor).toBe("");
});

it("shows live rich comments on hover and keyboard focus, closes on Escape and cleans up", async () => {
	const target = editor("tips");
	const list = comments("tips");
	await vi.waitFor(() =>
		expect(
			document.querySelectorAll("tp-tooltip[data-tp-code-comment-tooltip]"),
		).toHaveLength(2),
	);
	const marker = target.querySelector<HTMLElement>(".tp-code-comment-marker");
	if (!marker) throw new Error("Missing marker");
	const tooltip = document.querySelector(`tp-tooltip[anchor="#${marker.id}"]`);
	if (!tooltip) throw new Error("Missing tooltip");
	expect(marker.tabIndex).toBe(0);
	expect(marker.getAttribute("aria-describedby")).toBe(tooltip.id);
	expect(tooltip.querySelector("strong")?.textContent).toBe("First");
	expect(tooltip.querySelector("[data-code-comment-number]")).toBeNull();
	marker.dispatchEvent(new MouseEvent("mouseenter"));
	expect(tooltip.hasAttribute("open")).toBe(true);
	marker.dispatchEvent(new MouseEvent("mouseleave"));
	expect(tooltip.hasAttribute("open")).toBe(false);
	marker.focus();
	expect(tooltip.hasAttribute("open")).toBe(true);
	document.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(tooltip.hasAttribute("open")).toBe(false);
	const strong = list.querySelector("strong");
	if (!strong) throw new Error("Missing author content");
	strong.firstChild?.replaceWith("Updated");
	await vi.waitFor(() =>
		expect(tooltip.querySelector("strong")?.textContent).toBe("Updated"),
	);
	expect(target.getValue()).toContain("// <1> <2>");
	list.remove();
	expect(
		document.querySelector("tp-tooltip[data-tp-code-comment-tooltip]"),
	).toBeNull();
});

it("preserves SVG references without duplicating IDs or moving author nodes", async () => {
	editor("rich");
	const list = comments("rich");
	const item = list.querySelector("li");
	if (!item) throw new Error("Missing list item");
	item.insertAdjacentHTML(
		"beforeend",
		'<svg aria-labelledby="shape-label"><title id="shape-label">Shape</title><defs><path id="shape-path" d="M0 0h4v4z"/></defs><use href="#shape-path"/></svg>',
	);
	await vi.waitFor(() =>
		expect(
			document.querySelector("tp-tooltip[data-tp-code-comment-tooltip] use"),
		).not.toBeNull(),
	);
	const tooltip = document.querySelector(
		"tp-tooltip[data-tp-code-comment-tooltip]",
	);
	const path = tooltip?.querySelector("path");
	expect(path?.id).not.toBe("shape-path");
	expect(tooltip?.querySelector("use")?.getAttribute("href")).toBe(
		`#${path?.id}`,
	);
	expect(document.querySelectorAll("#shape-path")).toHaveLength(1);
	expect(item.querySelector("path[id]")?.id).toBe("shape-path");
});
