import { afterEach, expect, it, vi } from "vitest";
import { TpPostItEditor } from "./post-it-editor.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("registers the editor and handles missing, invalid and changing targets", () => {
	const editor = new TpPostItEditor();
	editor.setAttribute("for", "[");
	document.body.append(editor);
	expect(editor.textContent).toContain("Choose a document container");
	const target = document.createElement("article");
	target.id = "target";
	target.innerHTML = "<p>Document paragraph.</p>";
	document.body.prepend(target);
	editor.setAttribute("for", "#target");
	expect(editor.querySelector('[data-action="annotations"]')).not.toBeNull();
	expect(editor.page).toBe(document.location.href.split("#")[0]);
	editor.setPage("example");
	expect(editor.page).toBe("example");
	editor.setPage("");
	editor.removeAttribute("page");
	editor.setAttribute("lang", "en");
	editor.setAttribute("for", "tp-post-it-editor");
	expect(editor.textContent).toContain("Choose a document container");
	editor.setTarget(target);
	expect(editor.querySelectorAll('[data-action="annotations"]')).toHaveLength(
		1,
	);
	editor.remove();
	expect(editor.querySelector('[data-action="annotations"]')).toBeNull();
	document.body.append(editor);
	expect(editor.querySelectorAll('[data-action="annotations"]')).toHaveLength(
		1,
	);
	editor.dispose();
	editor.dispose();
});

it("accepts programmatic targets before connection and rejects contained targets", () => {
	const target = document.createElement("article");
	document.body.append(target);
	const editor = new TpPostItEditor();
	editor.setTarget(target);
	document.body.append(editor);
	expect(editor.querySelector('[data-action="annotations"]')).not.toBeNull();
	const child = document.createElement("div");
	editor.append(child);
	editor.setTarget(child);
	expect(editor.textContent).toContain("Choose a document container");
});

it("uses markup for new notes and synchronizes the dropdown without losing source", async () => {
	const saved = new Map<string, string>();
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => saved.get(key) ?? null,
		setItem: (key: string, value: string) => saved.set(key, value),
	});
	const target = document.createElement("article");
	target.innerHTML = "<p>Markup target.</p>";
	document.body.append(target);
	const editor = new TpPostItEditor();
	editor.setTarget(target);
	editor.setPage(`markup-test-${crypto.randomUUID()}`);
	editor.markup = "html";
	document.body.append(editor);
	const click = (label: string): void => {
		const button = [
			...editor.querySelectorAll<HTMLElement>("tp-button, tp-icon-button"),
		].find(
			(node) =>
				node.getAttribute("label") === label || node.textContent === label,
		);
		if (!button) throw new Error(`Missing ${label}`);
		button.click();
	};
	const selected = () =>
		editor
			.querySelector('[data-annotation-languages] [aria-current="true"]')
			?.getAttribute("data-language");
	click("Add annotation");
	target.querySelector("p")?.click();
	expect(selected()).toBe("html");
	const field = editor.querySelector("tp-textfield");
	if (!field) throw new Error("Missing source field");
	field.value = "<strong>Important</strong>";
	editor.markup = "markdown";
	expect(selected()).toBe("md");
	expect(field.value).toBe("<strong>Important</strong>");
	editor.querySelector<HTMLElement>('[data-language="html"]')?.click();
	expect(editor.markup).toBe("html");
	click("Save");
	await expect
		.poll(
			() =>
				editor.querySelector("[data-annotation-content] strong")?.textContent,
		)
		.toBe("Important");
	editor.markup = "none";
	click("Edit");
	expect(selected()).toBe("html");
	expect(field.value).toBe("<strong>Important</strong>");
	click("Cancel");
	click("Add annotation");
	target.querySelector("p")?.click();
	expect(selected()).toBe("txt");
	editor.setAttribute("markup", "unsupported");
	expect(editor.markup).toBe("none");
	expect(selected()).toBe("txt");
});
