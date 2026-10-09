import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
	annotationTarget,
	type PersonalAnnotation,
	PersonalAnnotations,
	parseAnnotations,
	renderAnnotation,
	resolveAnnotationTarget,
} from "./personal-annotations.js";

vi.mock("../components/markdown/markdown.js", () => ({
	renderMarkdownToHtml: async (source: string) => `<strong>${source}</strong>`,
}));
vi.mock("../components/asciidoc/asciidoc.js", () => ({
	renderAsciidocToHtml: async (source: string) => `<em>${source}</em>`,
}));
vi.mock("../components/restructuredtext/restructuredtext.js", () => ({
	renderRestructuredTextToHtml: async (source: string) => {
		if (source === "invalid") throw new Error("Invalid source");
		return `<p>${source}</p>`;
	},
}));

it("converts each markup language and sanitizes active HTML", async () => {
	expect(await renderAnnotation("hello", "md")).toBe("<strong>hello</strong>");
	expect(await renderAnnotation("hello", "adoc")).toBe("<em>hello</em>");
	expect(await renderAnnotation("hello", "rst")).toBe("<p>hello</p>");
	expect(
		await renderAnnotation(
			'<b onclick="alert(1)">hello</b><script>alert(1)</script><iframe src="/"></iframe><tp-include src="/"></tp-include>',
			"html",
		),
	).toBe("<b>hello</b>");
});

it("saves the selected language, restores source while editing and reports conversion failures", async () => {
	const { host, root, controller } = fixture();
	create(host, root);
	click(host, "Edit");
	expect(
		host
			.querySelector('[data-annotation-languages] [aria-current="true"]')
			?.querySelector(":scope > span")?.textContent,
	).toBe("Plain text");
	expect(
		Array.from(
			host.querySelectorAll(
				"[data-annotation-languages] li > tp-icon:first-child",
			),
		).map((icon) => icon.getAttribute("name")),
	).toEqual([
		"file_type_asciidoc",
		"file_type_html",
		"file_type_markdown",
		"file_type_restructuredtext",
		"language-text",
	]);
	const field = host.querySelector("tp-textfield");
	if (!field) throw new Error("Missing field");
	const choose = (language: string) => {
		const item = Array.from(host.querySelectorAll("tp-dropdown li")).find(
			(element) => element.getAttribute("data-language") === language,
		);
		item?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);
	};
	field.value = "<strong>Formatted note</strong>";
	choose("html");
	expect(
		host.querySelectorAll("[data-language-check]:not([hidden])"),
	).toHaveLength(1);
	expect(
		host
			.querySelector("[data-language-check]:not([hidden])")
			?.parentElement?.querySelector(":scope > span")?.textContent,
	).toBe("HTML");
	click(host, "Save");
	await vi.waitFor(() =>
		expect(
			host.querySelector("[data-annotation-content] strong")?.textContent,
		).toBe("Formatted note"),
	);
	controller.setPage("https://example.org/guide.html");
	click(host, "Edit");
	expect(field.value).toBe("<strong>Formatted note</strong>");
	expect(
		host.querySelector(
			'[aria-label="Annotation language"] [data-tp-button-content] > span',
		),
	).toBeNull();
	expect(
		host
			.querySelector('[aria-label="Annotation language"]')
			?.getAttribute("aria-description"),
	).toBe("Current language: HTML");
	expect(
		host
			.querySelector('[aria-label="Annotation language"] tp-icon')
			?.getAttribute("name"),
	).toBe("file_type_html");
	expect(
		host
			.querySelector("[data-language-check]:not([hidden])")
			?.parentElement?.querySelector(":scope > span")?.textContent,
	).toBe("HTML");
	choose("rst");
	field.value = "invalid";
	click(host, "Save");
	await vi.waitFor(() =>
		expect(host.querySelector("tp-post-it")?.textContent).toContain(
			"Unable to render this annotation.",
		),
	);
});

/** Cleanup releases floating note listeners and observers between tests. */
const controllers: PersonalAnnotations[] = [];
beforeEach(() => {
	const values = new Map<string, string>();
	const storage: Storage = {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => {
			values.set(key, value);
		},
		removeItem: (key) => {
			values.delete(key);
		},
		clear: () => {
			values.clear();
		},
		key: (index) => Array.from(values.keys())[index] ?? null,
		get length() {
			return values.size;
		},
	};
	vi.stubGlobal("localStorage", storage);
});
afterEach(() => {
	controllers.splice(0).forEach((controller) => {
		controller.dispose();
	});
	document.body.replaceChildren();
	localStorage.clear();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

/** Builds a stable document target and its toolbar controller. */
function fixture(): {
	host: HTMLElement;
	root: HTMLElement;
	controller: PersonalAnnotations;
} {
	const host = document.createElement("section");
	const root = document.createElement("main");
	root.innerHTML =
		'<p id="example">Underlying document text.</p><p>Other paragraph.</p>';
	host.append(root);
	document.body.append(host);
	const controller = new PersonalAnnotations(host, root);
	controllers.push(controller);
	host.prepend(controller.button);
	controller.setPage("https://example.org/guide.html");
	return { host, root, controller };
}

/** Activates an exact labelled library action without requiring native click synthesis. */
function click(host: HTMLElement, label: string): void {
	const button = Array.from(
		host.querySelectorAll("tp-button, tp-icon-button"),
	).find(
		(element) =>
			element.getAttribute("label") === label ||
			(element.localName === "tp-button" && element.textContent === label),
	);
	if (!button) throw new Error(`Missing ${label}`);
	button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

/** Creates a note using the public editor interaction. */
function create(host: HTMLElement, root: HTMLElement): void {
	click(host, "Add annotation");
	root.querySelector("p")?.dispatchEvent(
		new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			clientX: 20,
			clientY: 20,
		}),
	);
	const field = host.querySelector("tp-textfield");
	if (!field) throw new Error("Missing editor");
	field.value = '<img src=x onerror="alert(1)"> My note';
	click(host, "Save");
}

it("saves immediately without an observer loop when the target is body", async () => {
	const host = document.createElement("section");
	document.body.append(host);
	const controller = new PersonalAnnotations(host, document.body);
	controllers.push(controller);
	host.prepend(controller.button);
	controller.setPage("body-target");
	controller.button.click();
	click(host, "Add annotation");
	const icon = controller.button.querySelector("tp-icon");
	if (!icon) throw new Error("Missing editor icon");
	icon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	const field = host.querySelector("tp-textfield");
	if (!field) throw new Error("Missing editor field");
	field.value = "Note on the editor icon";
	click(host, "Save");
	await new Promise<void>((resolve) => setTimeout(resolve, 0));
	expect(host.querySelectorAll("tp-post-it")).toHaveLength(1);
	expect(host.querySelector("tp-post-it")?.attachment?.element).toBe(icon);
	expect(
		localStorage.getItem("tp-personal-annotations:v1:body-target"),
	).toContain("Note on the editor icon");
	click(host, "Edit");
	expect(field.value).toBe("Note on the editor icon");
});

it("validates stored records and resolves only verified targets", () => {
	const { root } = fixture();
	const element = root.querySelector("p");
	if (!element) throw new Error("Missing target");
	const record: PersonalAnnotation = {
		id: "a",
		text: "Note",
		x: 10,
		y: 10,
		...annotationTarget(root, element),
	};
	expect(
		parseAnnotations(JSON.stringify([record, {}, { ...record, x: "wrong" }])),
	).toEqual([record]);
	expect(parseAnnotations(null)).toEqual([]);
	expect(() => parseAnnotations("{}")).toThrow();
	expect(resolveAnnotationTarget(root, record)).toBe(element);
	element.removeAttribute("id");
	expect(resolveAnnotationTarget(root, record)).toBe(element);
	root.append(element.cloneNode(true));
	expect(resolveAnnotationTarget(root, record)).toBeNull();
	expect(
		resolveAnnotationTarget(root, { ...record, selector: "[invalid" }),
	).toBeNull();
});

it("creates text-only notes, persists by page, restores, edits and deletes", () => {
	const { host, root, controller } = fixture();
	create(host, root);
	expect(host.querySelector("tp-post-it img")).toBeNull();
	expect(host.querySelector("tp-post-it")?.textContent).toContain("<img src=x");
	const saved = localStorage.getItem(
		"tp-personal-annotations:v1:https://example.org/guide.html",
	);
	expect(parseAnnotations(saved)).toHaveLength(1);
	controller.setPage("https://example.org/other.html");
	expect(host.querySelector("tp-post-it")).toBeNull();
	controller.setPage("https://example.org/guide.html");
	expect(host.querySelectorAll("tp-post-it")).toHaveLength(1);
	click(host, "Edit");
	const field = host.querySelector("tp-textfield");
	if (!field) throw new Error("Missing field");
	field.value = "Edited";
	click(host, "Save");
	expect(host.querySelector("tp-post-it")?.textContent).toContain("Edited");
	click(host, "Delete");
	expect(host.querySelector("tp-post-it")).toBeNull();
	expect(
		parseAnnotations(
			localStorage.getItem(
				"tp-personal-annotations:v1:https://example.org/guide.html",
			),
		),
	).toEqual([]);
});

it("recovers missing targets by explicit reattachment and supports keyboard selection", async () => {
	const { host, root, controller } = fixture();
	create(host, root);
	root.querySelector("#example")?.remove();
	await Promise.resolve();
	controller.button.dispatchEvent(new MouseEvent("click"));
	expect(host.textContent).toContain("Target unavailable");
	expect(host.querySelector("tp-post-it")).toBeNull();
	click(host, "Reattach");
	expect(
		host.querySelector<HTMLElement>('[data-personal-annotation="panel"]')
			?.hidden,
	).toBe(false);
	const target = root.querySelector("p");
	target?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(host.querySelector("tp-post-it")).not.toBeNull();
	expect(target?.hasAttribute("tabindex")).toBe(false);
	expect(root.hasAttribute("tabindex")).toBe(false);
	expect(
		host.querySelector<HTMLElement>('[data-personal-annotation="panel"]')
			?.hidden,
	).toBe(false);
	click(host, "Add annotation");
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
	expect(root.hasAttribute("data-annotation-selecting")).toBe(false);
	expect(host.textContent).toContain("Selection cancelled");
	expect(
		host.querySelector<HTMLElement>('[data-personal-annotation="panel"]')
			?.hidden,
	).toBe(false);
});

it("positions above the full document column rather than a box narrowed by a table of contents", () => {
	const { host, root, controller } = fixture();
	controller.dispose();
	const box = document.createElement("tp-box");
	box.innerHTML = "<p>First target.</p><p>Second target.</p>";
	root.append(box);
	vi.spyOn(root, "getBoundingClientRect").mockReturnValue(
		new DOMRect(200, 0, 800, 800),
	);
	vi.spyOn(box, "getBoundingClientRect").mockReturnValue(
		new DOMRect(200, 0, 400, 150),
	);
	const editor = new PersonalAnnotations(host, box);
	controllers.push(editor);
	host.prepend(editor.button);
	editor.setPage("boxed-example");
	click(host, "Personal annotations");
	const panel = host.querySelector<HTMLElement>(
		'[data-personal-annotation="panel"]',
	);
	expect(panel?.style.inlineSize).toBe("min(36rem, 768px)");
	expect(panel?.style.right).toBe(`${window.innerWidth - 1000 + 16}px`);
	click(host, "Add annotation");
	expect(box.hasAttribute("data-annotation-selecting")).toBe(true);
	expect(root.hasAttribute("data-annotation-selecting")).toBe(false);
	box
		.querySelectorAll("p")[1]
		?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	expect(
		host.querySelector<HTMLElement>("[data-annotation-editor]")?.hidden,
	).toBe(false);
});

it("repositions the open editor when its document column changes", () => {
	const { host, root } = fixture();
	const bounds = vi.spyOn(root, "getBoundingClientRect");
	bounds.mockReturnValue(new DOMRect(200, 0, 600, 800));
	click(host, "Personal annotations");
	const panel = host.querySelector<HTMLElement>(
		'[data-personal-annotation="panel"]',
	);
	expect(panel?.style.inlineSize).toBe("min(36rem, 568px)");
	bounds.mockReturnValue(new DOMRect(0, 0, 400, 800));
	window.dispatchEvent(new Event("resize"));
	expect(panel?.style.inlineSize).toBe("min(36rem, 368px)");
	expect(panel?.style.right).toBe(`${window.innerWidth - 400 + 16}px`);
});

it("keeps the editor open during pointer selection and restores the root tab order", () => {
	const { host, root } = fixture();
	root.setAttribute("tabindex", "-1");
	click(host, "Personal annotations");
	click(host, "Add annotation");
	const panel = host.querySelector<HTMLElement>(
		'[data-personal-annotation="panel"]',
	);
	expect(panel?.hidden).toBe(false);
	expect(root.hasAttribute("data-annotation-selecting")).toBe(true);
	root
		.querySelector("p")
		?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	expect(panel?.hidden).toBe(false);
	expect(root.hasAttribute("data-annotation-selecting")).toBe(false);
	expect(root.getAttribute("tabindex")).toBe("-1");
	expect(
		host.querySelector<HTMLElement>("[data-annotation-editor]")?.hidden,
	).toBe(false);
});

it("saves and restores appearance, preserves old notes and cancels unsaved changes", () => {
	const { host, root, controller } = fixture();
	create(host, root);
	click(host, "Edit");
	const heading = host.querySelector('tp-textfield[label="heading"]');
	const color = host.querySelector("tp-color");
	const opacity = host.querySelector('tp-numberfield[label="opacity"]');
	const rotation = host.querySelector('tp-numberfield[label="rotation"]');
	if (!heading || !color || !opacity || !rotation)
		throw new Error("Missing appearance controls");
	// Selector-based queries return Element; the controls expose their state through attributes.
	heading.setAttribute("value", "My heading");
	color.setAttribute("preset", "tp-blue");
	expect(color.getAttribute("anchor")).toBe(`#${color.id}`);
	expect(root.classList.contains("tp-blue")).toBe(false);
	expect(host.classList.contains("tp-blue")).toBe(false);
	opacity.setAttribute("value", "0.65");
	rotation.setAttribute("value", "-7");
	click(host, "Save");
	controller.setPage("https://example.org/guide.html");
	const note = host.querySelector("tp-post-it");
	expect(note?.heading).toBe("My heading");
	expect(note?.color).toBe("blue");
	expect(note?.opacity).toBe(0.65);
	expect(note?.rotation).toBe(-7);
	click(host, "Edit");
	heading.setAttribute("value", "Not saved");
	color.setAttribute("preset", "tp-orange");
	click(host, "Cancel");
	expect(note?.heading).toBe("My heading");
	expect(note?.color).toBe("blue");
	click(host, "Edit");
	expect(color.getAttribute("preset")).toBe("tp-blue");
	click(host, "Reset appearance defaults");
	click(host, "Save");
	expect(host.querySelector("tp-post-it")?.heading).toBe("");
	expect(host.querySelector("tp-post-it")?.opacity).toBe(1);
	expect(host.querySelector("tp-post-it")?.rotation).toBe(0);
	expect(host.querySelector("tp-post-it")?.color).toBe("yellow");
	const key = "tp-personal-annotations:v1:https://example.org/guide.html";
	const record = parseAnnotations(localStorage.getItem(key))[0];
	if (!record) throw new Error("Missing saved annotation");
	delete record.heading;
	delete record.color;
	delete record.opacity;
	delete record.rotation;
	localStorage.setItem(key, JSON.stringify([record]));
	controller.setPage("https://example.org/guide.html");
	expect(host.querySelector("tp-post-it")?.heading).toBe("Personal annotation");
	localStorage.setItem(
		key,
		JSON.stringify([
			{ ...record, color: "invalid", opacity: 2, rotation: -99, heading: 42 },
		]),
	);
	controller.setPage("https://example.org/guide.html");
	expect(host.querySelector("tp-post-it")?.color).toBe("yellow");
	expect(host.querySelector("tp-post-it")?.opacity).toBe(1);
	expect(host.querySelector("tp-post-it")?.rotation).toBe(-12);
});

it("groups language and color before Close, enabling settings only for a draft", () => {
	const { host, root } = fixture();
	const header = host.querySelector("[data-annotation-header]");
	expect(header?.getAttribute("gap")).toBe(
		"var(--tp-toolbar-section-gap, 0.25rem)",
	);
	const language = header?.querySelector(
		'tp-icon-button[aria-label="Annotation language"]',
	);
	const color = header?.querySelector("tp-color");
	expect(language?.getAttribute("label")).toBe("Annotation language");
	expect(color?.querySelector(":scope > tp-icon-button")).not.toBeNull();
	expect(color?.nextElementSibling?.localName).toBe("tp-icon-button");
	expect(language?.querySelector("tp-icon")).not.toBeNull();
	expect(language?.nextElementSibling).toBe(color);
	expect(color?.nextElementSibling?.getAttribute("label")).toBe("Close");
	expect(language?.hasAttribute("disabled")).toBe(true);
	create(host, root);
	click(host, "Edit");
	expect(language?.hasAttribute("disabled")).toBe(false);
	expect(color?.hasAttribute("disabled")).toBe(false);
	expect(host.querySelector("[data-annotation-editor] tp-color")).toBeNull();
	click(host, "Cancel");
	expect(language?.hasAttribute("disabled")).toBe(true);
	expect(color?.hasAttribute("disabled")).toBe(true);
});

it("uses labelled icon actions in the header and note footer", () => {
	const { host, root, controller } = fixture();
	expect(controller.button.getAttribute("name")).toBe("post-it-editor");
	expect(controller.button.getAttribute("library")).toBe("components");
	expect(controller.button.getAttribute("section")).toBe("start");
	controller.button.click();
	const titleIcon = host.querySelector(
		"[data-annotation-header] h3 > :first-child",
	);
	expect(titleIcon?.localName).toBe("tp-icon");
	expect(titleIcon?.getAttribute("name")).toBe("post-it");
	expect(titleIcon?.getAttribute("library")).toBe("components");
	expect(titleIcon?.getAttribute("aria-hidden")).toBe("true");
	expect(host.querySelector("[data-annotation-header] h3")?.textContent).toBe(
		"Personal annotations",
	);
	expect(
		host
			.querySelector("[data-annotation-header] tp-icon-button:last-child")
			?.getAttribute("name"),
	).toBe("close");
	expect(
		host.querySelector("[data-annotation-add]")?.getAttribute("name"),
	).toBe("plus");
	create(host, root);
	const note = host.querySelector("tp-post-it");
	expect(
		host.querySelectorAll("[data-annotation-ranges] > tp-numberfield"),
	).toHaveLength(2);
	if (!note) throw new Error("Missing note");
	const footer = note.querySelector<HTMLElement>("[data-annotation-footer]");
	if (!footer) throw new Error("Missing footer");
	expect(footer.querySelector("tp-cluster")?.getAttribute("gap")).toBe(
		"var(--tp-toolbar-section-gap, 0.25rem)",
	);
	expect(footer.querySelector("tp-cluster")?.getAttribute("justify")).toBe(
		"end",
	);
	expect(
		Array.from(footer.querySelectorAll("tp-icon-button")).map((button) =>
			button.getAttribute("name"),
		),
	).toEqual(["pencil", "delete-outline"]);
	click(footer, "Edit");
	expect(
		host
			.querySelector('tp-textfield[aria-label="Annotation text"]')
			?.getAttribute("value"),
	).toContain("My note");
	click(host, "Close");
	expect(
		host.querySelector<HTMLElement>('[data-personal-annotation="panel"]')
			?.hidden,
	).toBe(true);
	click(footer, "Delete");
	expect(host.querySelector("tp-post-it")).toBeNull();
});

it("clears annotation text without deleting the saved note", () => {
	const { host, root } = fixture();
	create(host, root);
	click(host, "Edit");
	const field = host.querySelector(
		'tp-textfield[aria-label="Annotation text"]',
	);
	if (!field) throw new Error("Missing annotation text");
	expect(field.hasAttribute("clearable")).toBe(true);
	field
		.querySelector<HTMLButtonElement>("[data-tp-textfield-clear] button")
		?.click();
	expect(field.querySelector("textarea")?.value).toBe("");
	click(host, "Save");
	expect(host.textContent).toContain("Enter annotation text before saving.");
	expect(host.querySelector("tp-post-it")?.textContent).toContain("My note");
});

it("keeps edits in memory and reports storage failures", () => {
	const { host, root, controller } = fixture();
	vi.spyOn(localStorage, "setItem").mockImplementation(() => {
		throw new Error("Quota");
	});
	create(host, root);
	expect(host.textContent).toContain("Unable to save");
	expect(host.querySelector("tp-post-it")).not.toBeNull();
	vi.spyOn(localStorage, "getItem").mockImplementation(() => {
		throw new Error("Blocked");
	});
	controller.setPage("https://example.org/blocked.html");
	expect(host.textContent).toContain("could not be read");
});

it("preserves safe formulas and turns parser math placeholders into tp-math", async () => {
	const html = await renderAnnotation(
		'<tp-math src="/remote" onclick="alert(1)" value="x^2" mode="latexmath" displaystyle></tp-math><tp-include src="/remote"></tp-include>',
		"html",
	);
	expect(html).toContain(
		'<tp-math value="x^2" mode="latexmath" displaystyle=""></tp-math>',
	);
	expect(html).not.toContain("src=");
	expect(html).not.toContain("onclick");
	expect(html).not.toContain("tp-include");
	const result = await renderAnnotation(
		'<span data-mathjax-tex="x^2" data-mathjax-display="true"></span><span data-mathjax-asciimath="sqrt(x)"></span>',
		"html",
	);
	expect(result).toContain('value="x^2" mode="latexmath" displaystyle=""');
	expect(result).toContain('value="sqrt(x)" mode="asciimath"');
});
